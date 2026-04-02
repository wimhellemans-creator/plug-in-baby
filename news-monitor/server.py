import http.server
import urllib.request
import urllib.parse
import os
import sys
import json
import re
import gzip
import io
import webbrowser
import threading
import time
import hashlib
from urllib.error import URLError, HTTPError

PORT = 3000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))
CACHE_DIR = os.path.join(DIRECTORY, '.cache')
CACHE_MAX_AGE = 300  # 5 minutes

# Headers die iframe-embedding blokkeren - deze strippen we
BLOCKED_HEADERS = {
    'x-frame-options',
    'content-security-policy',
    'content-security-policy-report-only',
}

# Standaard request headers
REQUEST_HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'nl-BE,nl;q=0.9,en;q=0.8',
    'Accept-Encoding': 'gzip',
}


def fetch_url(target_url, max_redirects=5):
    """Fetch a URL, following redirects manually."""
    for _ in range(max_redirects):
        try:
            req = urllib.request.Request(target_url, headers=REQUEST_HEADERS)

            class NoRedirect(urllib.request.HTTPRedirectHandler):
                def redirect_request(self, req, fp, code, msg, headers, newurl):
                    return None

            opener = urllib.request.build_opener(NoRedirect)
            response = opener.open(req, timeout=15)

            body = response.read()

            # Decompress gzip if needed
            if response.headers.get('Content-Encoding') == 'gzip':
                body = gzip.decompress(body)

            content_type = response.headers.get('Content-Type', 'text/html')
            return body, content_type, response.status

        except HTTPError as e:
            if e.code in (301, 302, 303, 307, 308):
                location = e.headers.get('Location')
                if location:
                    target_url = urllib.parse.urljoin(target_url, location)
                    continue
            raise
    raise Exception('Too many redirects')


def inject_base_tag(body, target_url):
    """Inject a <base> tag so relative URLs resolve correctly."""
    parsed = urllib.parse.urlparse(target_url)
    base_url = f'{parsed.scheme}://{parsed.netloc}{parsed.path}'
    base_tag = f'<base href="{base_url}">'.encode('utf-8')

    if b'<head>' in body:
        return body.replace(b'<head>', b'<head>' + base_tag, 1)
    elif b'<HEAD>' in body:
        return body.replace(b'<HEAD>', b'<HEAD>' + base_tag, 1)
    return base_tag + body


def strip_scripts(html_bytes):
    """Remove <script> tags and inline event handlers for a static snapshot."""
    html = html_bytes.decode('utf-8', errors='replace')

    # Remove <script>...</script> tags (including multiline)
    html = re.sub(r'<script[\s>].*?</script>', '', html, flags=re.DOTALL | re.IGNORECASE)

    # Remove <noscript>...</noscript> (show the content that was hidden)
    html = re.sub(r'</?noscript[^>]*>', '', html, flags=re.IGNORECASE)

    # Remove common inline event handlers
    html = re.sub(r'\s+on\w+="[^"]*"', '', html)
    html = re.sub(r"\s+on\w+='[^']*'", '', html)

    return html.encode('utf-8')


def make_snapshot_wrapper(body):
    """Wrap the snapshot HTML in a container that disables interaction and looks clean."""
    style = b'''<style>
        * { pointer-events: none !important; cursor: default !important; }
        body { overflow: hidden !important; }
        /* Hide cookie banners, overlays, popups */
        [class*="cookie"], [class*="Cookie"], [class*="consent"], [class*="Consent"],
        [class*="banner"], [class*="overlay"], [class*="popup"], [class*="modal"],
        [id*="cookie"], [id*="Cookie"], [id*="consent"], [id*="Consent"],
        [class*="didomi"], [id*="didomi"],
        [class*="sp_message"], [id*="sp_message"],
        [class*="qc-cmp"], [id*="qc-cmp"],
        [class*="cc-banner"], [class*="cc_banner"],
        [aria-label*="cookie" i], [aria-label*="consent" i] {
            display: none !important;
        }
        /* Remove fixed/sticky positioned overlays */
        body > div[style*="position: fixed"],
        body > div[style*="position:fixed"],
        body > div[style*="z-index: 9"],
        body > div[style*="z-index:9"] {
            display: none !important;
        }
    </style>'''

    if b'</head>' in body:
        body = body.replace(b'</head>', style + b'</head>', 1)
    elif b'</HEAD>' in body:
        body = body.replace(b'</HEAD>', style + b'</HEAD>', 1)
    else:
        body = style + body

    return body


def get_cache_path(url):
    """Get the cache file path for a URL."""
    url_hash = hashlib.md5(url.encode()).hexdigest()
    return os.path.join(CACHE_DIR, f'{url_hash}.html')


def get_cached_snapshot(url):
    """Return cached snapshot if fresh enough."""
    path = get_cache_path(url)
    if os.path.exists(path):
        age = time.time() - os.path.getmtime(path)
        if age < CACHE_MAX_AGE:
            with open(path, 'rb') as f:
                return f.read()
    return None


def save_to_cache(url, body):
    """Save snapshot to cache."""
    os.makedirs(CACHE_DIR, exist_ok=True)
    path = get_cache_path(url)
    with open(path, 'wb') as f:
        f.write(body)


class NieuwsmonitorHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)

        if parsed.path == '/api/health':
            self.send_json({'proxy': True})
        elif parsed.path == '/proxy':
            self.handle_proxy(parsed)
        elif parsed.path == '/snapshot':
            self.handle_snapshot(parsed)
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

    def handle_snapshot(self, parsed):
        """Return a static HTML snapshot: no JS, no cookie banners, iframe-safe."""
        params = urllib.parse.parse_qs(parsed.query)
        target_url = params.get('url', [None])[0]

        if not target_url:
            self.send_error(400, 'Missing ?url= parameter')
            return

        # Check cache first
        cached = get_cached_snapshot(target_url)
        if cached:
            self.send_html(cached)
            return

        try:
            body, content_type, status = fetch_url(target_url)
        except Exception as e:
            self.send_error(502, f'Could not fetch: {str(e)}')
            return

        if 'text/html' not in content_type:
            self.send_error(400, 'Not an HTML page')
            return

        # Process: inject base tag, strip scripts, hide cookie banners
        body = inject_base_tag(body, target_url)
        body = strip_scripts(body)
        body = make_snapshot_wrapper(body)

        # Cache the result
        save_to_cache(target_url, body)

        self.send_html(body)

    def handle_proxy(self, parsed):
        """Full proxy: strips iframe-blocking headers but keeps JS for interactivity."""
        params = urllib.parse.parse_qs(parsed.query)
        target_url = params.get('url', [None])[0]

        if not target_url:
            self.send_error(400, 'Missing ?url= parameter')
            return

        try:
            body, content_type, status = fetch_url(target_url)
        except HTTPError as e:
            self.send_error(e.code, f'Upstream error: {e.reason}')
            return
        except URLError as e:
            self.send_error(502, f'Could not reach site: {e.reason}')
            return
        except Exception as e:
            self.send_error(502, f'Proxy error: {str(e)}')
            return

        # For HTML: inject base tag
        if 'text/html' in content_type:
            body = inject_base_tag(body, target_url)

        self.send_response(status)
        self.send_header('Content-Type', content_type)
        self.send_header('Content-Length', len(body))
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, format, *args):
        msg = str(args[0]) if args else ''
        if '/proxy' in msg or '/snapshot' in msg or '/api/' in msg:
            return
        super().log_message(format, *args)


def open_browser():
    """Open browser after a short delay."""
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
