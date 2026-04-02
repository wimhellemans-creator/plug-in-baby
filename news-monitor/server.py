import http.server
import urllib.request
import urllib.parse
import ssl
import os
import json
import re
import gzip
import mimetypes
import webbrowser
import threading
import time
import hashlib
from urllib.error import URLError, HTTPError

PORT = int(os.environ.get('PORT', 3000))
DIRECTORY = os.path.dirname(os.path.abspath(__file__))
CACHE_DIR = os.path.join(DIRECTORY, '.cache')
CACHE_MAX_AGE = 300  # 5 minuten

# SSL context
SSL_CTX = ssl.create_default_context()
SSL_CTX.check_hostname = False
SSL_CTX.verify_mode = ssl.CERT_NONE

# Request headers
REQUEST_HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    'Accept-Language': 'nl-BE,nl;q=0.9,en-US;q=0.8,en;q=0.7',
    'Accept-Encoding': 'gzip, deflate',
    'Sec-Fetch-Dest': 'document',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-Site': 'none',
    'Upgrade-Insecure-Requests': '1',
}

# --- URL Opener met systeem-proxy ---
_proxy = urllib.request.ProxyHandler()
_https = urllib.request.HTTPSHandler(context=SSL_CTX)
_cookies = urllib.request.HTTPCookieProcessor()
_opener = urllib.request.build_opener(_proxy, _https, _cookies)


def fetch_url(target_url):
    """Fetch een URL, volgt redirects, returnt (body_bytes, content_type)."""
    req = urllib.request.Request(target_url, headers=REQUEST_HEADERS)
    response = _opener.open(req, timeout=15)
    body = response.read()

    if 'gzip' in response.headers.get('Content-Encoding', ''):
        try:
            body = gzip.decompress(body)
        except Exception:
            pass

    content_type = response.headers.get('Content-Type', 'text/html')
    return body, content_type


def inject_head_tags(body, target_url):
    """Inject <base> tag and Content-Security-Policy to block ALL JavaScript."""
    parsed = urllib.parse.urlparse(target_url)
    base_url = f'{parsed.scheme}://{parsed.netloc}/'
    tags = (
        f'<base href="{base_url}">'
        # CSP that blocks all script execution - more reliable than stripping
        '<meta http-equiv="Content-Security-Policy" '
        f'content="script-src \'none\'; default-src * data: blob:; style-src * \'unsafe-inline\'; img-src * data: blob:; font-src * data:;">'
    ).encode('utf-8')

    lower = body.lower()
    pos = lower.find(b'<head')
    if pos != -1:
        end = body.find(b'>', pos)
        if end != -1:
            insert = end + 1
            return body[:insert] + tags + body[insert:]
    return tags + body


def strip_scripts(html_bytes):
    html = html_bytes.decode('utf-8', errors='replace')
    # Remove <script>...</script> tags
    html = re.sub(r'<script[^>]*>.*?</script>', '', html, flags=re.DOTALL | re.IGNORECASE)
    html = re.sub(r'<script[^>]*/>', '', html, flags=re.IGNORECASE)
    # Remove script preload/modulepreload links (prevents JS from loading via <link>)
    html = re.sub(r'<link[^>]*\brel\s*=\s*["\']modulepreload["\'][^>]*/?\s*>', '', html, flags=re.IGNORECASE)
    html = re.sub(r'<link[^>]*\bas\s*=\s*["\']script["\'][^>]*/?\s*>', '', html, flags=re.IGNORECASE)
    # Unwrap <noscript> content
    html = re.sub(r'</?noscript[^>]*>', '', html, flags=re.IGNORECASE)
    # Remove inline event handlers
    html = re.sub(r'\s+on\w+\s*=\s*"[^"]*"', '', html)
    html = re.sub(r"\s+on\w+\s*=\s*'[^']*'", '', html)
    return html.encode('utf-8')


SNAPSHOT_CSS = b'''<style>
*{pointer-events:none!important;cursor:default!important}
body{overflow:hidden!important}
/* Cookie/consent banners */
[class*="cookie" i],[class*="consent" i],[class*="gdpr" i],
[class*="overlay" i],[class*="popup" i],[class*="modal" i],
[id*="cookie" i],[id*="consent" i],[id*="gdpr" i],
[class*="didomi"],[id*="didomi"],
[class*="sp_message"],[id*="sp_message"],
[class*="qc-cmp"],[id*="qc-cmp"],
[class*="cc-banner"],[class*="cc_banner"],
[class*="cmp-"],[id*="cmp-"],
[aria-label*="cookie" i],[aria-label*="consent" i],
.tp-modal,.tp-backdrop,#piano-inline,
div[data-testid*="consent" i],div[data-testid*="cookie" i]{
display:none!important;visibility:hidden!important;height:0!important;overflow:hidden!important}
body>div[style*="position: fixed"],body>div[style*="position:fixed"]{display:none!important}
/* Next.js / React error overlays */
#__next-build-watcher,nextjs-portal{display:none!important}
/* Hide Next.js "Application error" page - show actual content behind it */
body>div#__next>div[style*="font-family"]{display:none!important}
body>div#__next>div>div>h2{display:none!important}
/* Generic framework error screens */
[data-nextjs-dialog],[data-nextjs-dialog-overlay]{display:none!important}
</style>'''


def make_snapshot(body):
    lower = body.lower()
    idx = lower.find(b'</head>')
    if idx != -1:
        return body[:idx] + SNAPSHOT_CSS + body[idx:]
    return SNAPSHOT_CSS + body


def get_cache_path(url):
    return os.path.join(CACHE_DIR, hashlib.md5(url.encode()).hexdigest() + '.html')


def get_cached(url):
    path = get_cache_path(url)
    if os.path.exists(path) and (time.time() - os.path.getmtime(path)) < CACHE_MAX_AGE:
        with open(path, 'rb') as f:
            return f.read()
    return None


def save_cache(url, body):
    os.makedirs(CACHE_DIR, exist_ok=True)
    with open(get_cache_path(url), 'wb') as f:
        f.write(body)


def serve_static_file(handler, file_path):
    """Serve een statisch bestand."""
    if not os.path.isfile(file_path):
        handler.send_error(404, 'Bestand niet gevonden')
        return

    mime_type, _ = mimetypes.guess_type(file_path)
    if mime_type is None:
        mime_type = 'application/octet-stream'

    with open(file_path, 'rb') as f:
        content = f.read()

    handler.send_response(200)
    handler.send_header('Content-Type', mime_type)
    handler.send_header('Content-Length', len(content))
    handler.end_headers()
    handler.wfile.write(content)


def make_fallback_card(url):
    """Mooie fallback-kaart voor sites die JavaScript nodig hebben."""
    parsed = urllib.parse.urlparse(url)
    domain = parsed.netloc.replace('www.', '')
    favicon = f'https://www.google.com/s2/favicons?domain={parsed.netloc}&sz=64'
    return f'''<!DOCTYPE html>
<html><head><meta charset="utf-8">
<meta http-equiv="Content-Security-Policy" content="script-src 'none'">
<style>
*{{margin:0;padding:0;box-sizing:border-box}}
body{{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
background:linear-gradient(135deg,#1a1a1a 0%,#2d2d2d 100%);
color:#fff;height:100vh;display:flex;align-items:center;justify-content:center;
text-align:center}}
.card{{padding:40px}}
.card img{{width:48px;height:48px;margin-bottom:16px;border-radius:8px}}
.card h2{{font-size:20px;margin-bottom:8px;font-weight:600}}
.card p{{font-size:13px;color:#888;line-height:1.5}}
.badge{{display:inline-block;margin-top:16px;padding:6px 16px;
background:rgba(226,13,13,0.15);color:#E20D0D;border-radius:20px;
font-size:11px;font-weight:600;letter-spacing:0.5px;text-transform:uppercase}}
</style></head>
<body><div class="card">
<img src="{favicon}" alt="">
<h2>{domain}</h2>
<p>Deze site vereist JavaScript en kan niet<br>als snapshot worden weergegeven.</p>
<span class="badge">Klik om te openen</span>
</div></body></html>'''.encode('utf-8')


class NieuwsmonitorHandler(http.server.BaseHTTPRequestHandler):
    """Custom HTTP handler - geen SimpleHTTPRequestHandler meer."""

    def do_GET(self):
        # Log elke request voor debugging
        print(f'  [GET] {self.path}')

        # Splits path en query string
        if '?' in self.path:
            path, query = self.path.split('?', 1)
        else:
            path, query = self.path, ''

        # --- API Routes ---
        if path == '/api/health':
            self.respond_json({'proxy': True})

        elif path == '/snapshot':
            self.handle_snapshot(query)

        elif path == '/proxy':
            self.handle_proxy(query)

        # --- Static Files ---
        else:
            self.serve_static(path)

    def respond_json(self, data):
        body = json.dumps(data).encode('utf-8')
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Content-Length', len(body))
        self.end_headers()
        self.wfile.write(body)

    def respond_html(self, body, status=200):
        self.send_response(status)
        self.send_header('Content-Type', 'text/html; charset=utf-8')
        self.send_header('Content-Length', len(body))
        self.end_headers()
        self.wfile.write(body)

    def get_url_param(self, query_string):
        params = urllib.parse.parse_qs(query_string)
        return params.get('url', [None])[0]

    def serve_static(self, path):
        """Serve statische bestanden uit de news-monitor map."""
        # Default naar index.html
        if path == '/' or path == '':
            path = '/index.html'

        # Beveilig tegen path traversal
        safe_path = os.path.normpath(path.lstrip('/'))
        if safe_path.startswith('..'):
            self.send_error(403, 'Forbidden')
            return

        file_path = os.path.join(DIRECTORY, safe_path)
        serve_static_file(self, file_path)

    def handle_snapshot(self, query):
        """Statische HTML snapshot: geen JS, geen cookie banners."""
        url = self.get_url_param(query)
        if not url:
            self.respond_html(b'<html><body><p>Missing url parameter</p></body></html>')
            return

        cached = get_cached(url)
        if cached:
            print(f'  [snapshot] Serving cached: {url}')
            self.respond_html(cached)
            return

        try:
            print(f'  [snapshot] Fetching: {url}')
            body, ct = fetch_url(url)
            print(f'  [snapshot] OK: {len(body)} bytes from {url}')
        except Exception as e:
            print(f'  [snapshot] FOUT: {url} -> {e}')
            self.respond_html(f'<html><body style="font-family:sans-serif;padding:20px"><h3>Kon niet laden</h3><p>{url}</p><p style="color:red">{e}</p></body></html>'.encode('utf-8'))
            return

        body = inject_head_tags(body, url)
        body = strip_scripts(body)
        body = make_snapshot(body)

        # Detect broken pages (Next.js error, empty content, etc.)
        html_text = body.decode('utf-8', errors='replace').lower()
        if 'application error' in html_text or 'client-side exception' in html_text:
            print(f'  [snapshot] JS-only site detected: {url} -> using fallback')
            body = make_fallback_card(url)

        save_cache(url, body)
        self.respond_html(body)

    def handle_proxy(self, query):
        """Volledige proxy: strips iframe-blocking headers, houdt JS."""
        url = self.get_url_param(query)
        if not url:
            self.respond_html(b'<html><body><p>Missing url parameter</p></body></html>')
            return

        try:
            print(f'  [proxy] Fetching: {url}')
            body, ct = fetch_url(url)
            print(f'  [proxy] OK: {len(body)} bytes from {url}')
        except Exception as e:
            print(f'  [proxy] FOUT: {url} -> {e}')
            self.respond_html(f'<html><body style="font-family:sans-serif;padding:20px"><h3>Kon niet laden</h3><p>{url}</p><p style="color:red">{e}</p></body></html>'.encode('utf-8'))
            return

        if 'text/html' in ct:
            body = inject_head_tags(body, url)

        self.send_response(200)
        self.send_header('Content-Type', ct)
        self.send_header('Content-Length', len(body))
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, format, *args):
        """Standaard logging onderdrukken (we doen eigen logging)."""
        pass


def open_browser():
    time.sleep(1.5)
    webbrowser.open(f'http://localhost:{PORT}')


if __name__ == '__main__':
    print()
    print('  ====================================')
    print('  HLN Nieuwsmonitor')
    print('  ====================================')
    print()
    # Cache legen bij opstarten (zodat code-wijzigingen effect hebben)
    if os.path.exists(CACHE_DIR):
        for f in os.listdir(CACHE_DIR):
            os.remove(os.path.join(CACHE_DIR, f))
        print('  Cache geleegd.')

    print(f'  Server draait op http://localhost:{PORT}')
    print('  Druk Ctrl+C om te stoppen.')
    print()

    # Open browser alleen lokaal, niet in cloud
    if 'RENDER' not in os.environ and 'RAILWAY' not in os.environ:
        threading.Thread(target=open_browser, daemon=True).start()

    try:
        server = http.server.HTTPServer(('', PORT), NieuwsmonitorHandler)
        server.serve_forever()
    except KeyboardInterrupt:
        print('\n  Server gestopt.')
        server.server_close()
