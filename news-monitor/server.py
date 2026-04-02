import http.server
import urllib.request
import urllib.parse
import ssl
import os
import json
import re
import gzip
import webbrowser
import threading
import time
import hashlib
from urllib.error import URLError, HTTPError

PORT = 3000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))
CACHE_DIR = os.path.join(DIRECTORY, '.cache')
CACHE_MAX_AGE = 300  # 5 minutes

# SSL context die ook oudere certificaten accepteert
SSL_CTX = ssl.create_default_context()
SSL_CTX.check_hostname = False
SSL_CTX.verify_mode = ssl.CERT_NONE

# Headers die iframe-embedding blokkeren
BLOCKED_HEADERS = {
    'x-frame-options',
    'content-security-policy',
    'content-security-policy-report-only',
}

# Request headers (nabootsen van een echte browser)
REQUEST_HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
    'Accept-Language': 'nl-BE,nl;q=0.9,en-US;q=0.8,en;q=0.7',
    'Accept-Encoding': 'gzip, deflate',
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
    'Sec-Fetch-Dest': 'document',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-Site': 'none',
    'Sec-Fetch-User': '?1',
    'Upgrade-Insecure-Requests': '1',
}


def _build_opener():
    """Build URL opener that uses system proxy settings and accepts all SSL."""
    proxy_handler = urllib.request.ProxyHandler()  # Uses Windows/system proxy
    https_handler = urllib.request.HTTPSHandler(context=SSL_CTX)
    cookie_handler = urllib.request.HTTPCookieProcessor()
    return urllib.request.build_opener(proxy_handler, https_handler, cookie_handler)

_opener = _build_opener()


def fetch_url(target_url):
    """Fetch a URL following redirects, return (body_bytes, content_type)."""
    req = urllib.request.Request(target_url, headers=REQUEST_HEADERS)
    response = _opener.open(req, timeout=15)

    body = response.read()

    # Decompress if gzipped
    encoding = response.headers.get('Content-Encoding', '')
    if 'gzip' in encoding:
        try:
            body = gzip.decompress(body)
        except Exception:
            pass  # Was not actually gzipped

    content_type = response.headers.get('Content-Type', 'text/html')
    return body, content_type


def inject_base_tag(body, target_url):
    """Inject <base> tag so relative URLs resolve correctly."""
    parsed = urllib.parse.urlparse(target_url)
    base_url = f'{parsed.scheme}://{parsed.netloc}/'
    base_tag = f'<base href="{base_url}" target="_blank">'.encode('utf-8')

    lower = body.lower()
    idx = lower.find(b'<head>')
    if idx != -1:
        insert_at = idx + len(b'<head>')
        return body[:insert_at] + base_tag + body[insert_at:]
    idx = lower.find(b'<head ')
    if idx != -1:
        end = body.find(b'>', idx)
        if end != -1:
            insert_at = end + 1
            return body[:insert_at] + base_tag + body[insert_at:]
    return base_tag + body


def strip_scripts(html_bytes):
    """Remove <script> tags for a static snapshot."""
    html = html_bytes.decode('utf-8', errors='replace')

    # Remove <script>...</script> tags
    html = re.sub(r'<script[^>]*>.*?</script>', '', html, flags=re.DOTALL | re.IGNORECASE)

    # Remove standalone <script .../> tags
    html = re.sub(r'<script[^>]*/>', '', html, flags=re.IGNORECASE)

    # Unwrap <noscript> content (show what was hidden)
    html = re.sub(r'</?noscript[^>]*>', '', html, flags=re.IGNORECASE)

    # Remove inline event handlers
    html = re.sub(r'\s+on\w+\s*=\s*"[^"]*"', '', html)
    html = re.sub(r"\s+on\w+\s*=\s*'[^']*'", '', html)

    return html.encode('utf-8')


COOKIE_HIDE_CSS = b'''<style id="newsmonitor-snapshot-style">
    * { pointer-events: none !important; cursor: default !important; }
    body { overflow: hidden !important; }
    [class*="cookie" i], [class*="consent" i], [class*="gdpr" i],
    [class*="banner" i][class*="privacy" i],
    [class*="overlay" i], [class*="popup" i], [class*="modal" i],
    [id*="cookie" i], [id*="consent" i], [id*="gdpr" i],
    [class*="didomi"], [id*="didomi"],
    [class*="sp_message"], [id*="sp_message"],
    [class*="qc-cmp"], [id*="qc-cmp"],
    [class*="cc-banner"], [class*="cc_banner"],
    [class*="cmp-"], [id*="cmp-"],
    [aria-label*="cookie" i], [aria-label*="consent" i],
    .tp-modal, .tp-backdrop, #piano-inline,
    div[data-testid*="consent" i], div[data-testid*="cookie" i] {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
        height: 0 !important;
        overflow: hidden !important;
    }
    body > div[style*="position: fixed"],
    body > div[style*="position:fixed"] {
        display: none !important;
    }
    body { overflow: hidden !important; }
</style>'''


def make_snapshot(body):
    """Add CSS to hide cookie banners and disable interaction."""
    lower = body.lower()
    idx = lower.find(b'</head>')
    if idx != -1:
        return body[:idx] + COOKIE_HIDE_CSS + body[idx:]
    return COOKIE_HIDE_CSS + body


def get_cache_path(url):
    url_hash = hashlib.md5(url.encode()).hexdigest()
    return os.path.join(CACHE_DIR, f'{url_hash}.html')


def get_cached(url):
    path = get_cache_path(url)
    if os.path.exists(path):
        age = time.time() - os.path.getmtime(path)
        if age < CACHE_MAX_AGE:
            with open(path, 'rb') as f:
                return f.read()
    return None


def save_cache(url, body):
    os.makedirs(CACHE_DIR, exist_ok=True)
    with open(get_cache_path(url), 'wb') as f:
        f.write(body)


class NieuwsmonitorHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def do_GET(self):
        # Parse the request path
        path = self.path.split('?')[0]
        query = self.path.split('?', 1)[1] if '?' in self.path else ''

        if path == '/api/health':
            self.send_json({'proxy': True})
        elif path == '/snapshot':
            self.handle_snapshot(query)
        elif path == '/proxy':
            self.handle_proxy(query)
        else:
            super().do_GET()

    def send_json(self, data):
        body = json.dumps(data).encode('utf-8')
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Content-Length', len(body))
        self.end_headers()
        self.wfile.write(body)

    def send_html(self, body, status=200):
        self.send_response(status)
        self.send_header('Content-Type', 'text/html; charset=utf-8')
        self.send_header('Content-Length', len(body))
        self.send_header('Cache-Control', f'public, max-age={CACHE_MAX_AGE}')
        self.end_headers()
        self.wfile.write(body)

    def get_url_param(self, query_string):
        params = urllib.parse.parse_qs(query_string)
        return params.get('url', [None])[0]

    def handle_snapshot(self, query):
        """Static HTML snapshot: no JS, no cookie banners, iframe-safe."""
        target_url = self.get_url_param(query)
        if not target_url:
            self.send_error(400, 'Missing ?url= parameter')
            return

        # Check cache
        cached = get_cached(target_url)
        if cached:
            self.send_html(cached)
            return

        try:
            print(f'  [snapshot] Fetching {target_url}...')
            body, content_type = fetch_url(target_url)
            print(f'  [snapshot] Got {len(body)} bytes from {target_url}')
        except Exception as e:
            print(f'  [snapshot] ERROR fetching {target_url}: {e}')
            error_html = f'<html><body><h2>Kon {target_url} niet laden</h2><p>{str(e)}</p></body></html>'
            self.send_html(error_html.encode('utf-8'), 200)
            return

        # Process HTML
        body = inject_base_tag(body, target_url)
        body = strip_scripts(body)
        body = make_snapshot(body)

        save_cache(target_url, body)
        self.send_html(body)

    def handle_proxy(self, query):
        """Full proxy: strips iframe-blocking headers, keeps JS."""
        target_url = self.get_url_param(query)
        if not target_url:
            self.send_error(400, 'Missing ?url= parameter')
            return

        try:
            print(f'  [proxy] Fetching {target_url}...')
            body, content_type = fetch_url(target_url)
        except Exception as e:
            print(f'  [proxy] ERROR fetching {target_url}: {e}')
            error_html = f'<html><body><h2>Kon {target_url} niet laden</h2><p>{str(e)}</p></body></html>'
            self.send_html(error_html.encode('utf-8'), 200)
            return

        if 'text/html' in content_type:
            body = inject_base_tag(body, target_url)

        self.send_response(200)
        self.send_header('Content-Type', content_type)
        self.send_header('Content-Length', len(body))
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, format, *args):
        """Only log static file requests, not API/proxy requests."""
        msg = str(args[0]) if args else ''
        if any(x in msg for x in ['/proxy', '/snapshot', '/api/']):
            return
        super().log_message(format, *args)


def open_browser():
    time.sleep(1.5)
    webbrowser.open(f'http://localhost:{PORT}')


if __name__ == '__main__':
    print()
    print('  ====================================')
    print('  HLN Nieuwsmonitor')
    print('  ====================================')
    print()
    print(f'  Server draait op http://localhost:{PORT}')
    print('  Druk Ctrl+C om te stoppen.')
    print()

    threading.Thread(target=open_browser, daemon=True).start()

    try:
        server = http.server.HTTPServer(('', PORT), NieuwsmonitorHandler)
        server.serve_forever()
    except KeyboardInterrupt:
        print('\n  Server gestopt.')
        server.server_close()
