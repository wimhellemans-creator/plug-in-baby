import http.server
import urllib.request
import urllib.parse
import os
import sys
import json
import webbrowser
import threading
from urllib.error import URLError, HTTPError

PORT = 3000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

# Headers die iframe-embedding blokkeren - deze strippen we
BLOCKED_HEADERS = {
    'x-frame-options',
    'content-security-policy',
    'content-security-policy-report-only',
}


class NieuwsmonitorHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)

        if parsed.path == '/api/health':
            self.send_json({'proxy': True})
        elif parsed.path == '/proxy':
            self.handle_proxy(parsed)
        else:
            super().do_GET()

    def send_json(self, data):
        body = json.dumps(data).encode('utf-8')
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Content-Length', len(body))
        self.end_headers()
        self.wfile.write(body)

    def handle_proxy(self, parsed):
        params = urllib.parse.parse_qs(parsed.query)
        target_url = params.get('url', [None])[0]

        if not target_url:
            self.send_error(400, 'Missing ?url= parameter')
            return

        try:
            urllib.parse.urlparse(target_url)
        except Exception:
            self.send_error(400, 'Invalid URL')
            return

        # Max 5 redirects
        for _ in range(5):
            try:
                req = urllib.request.Request(target_url, headers={
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                    'Accept-Language': 'nl-BE,nl;q=0.9,en;q=0.8',
                })

                # Disable auto-redirect so we can proxy redirects ourselves
                class NoRedirect(urllib.request.HTTPRedirectHandler):
                    def redirect_request(self, req, fp, code, msg, headers, newurl):
                        return None

                opener = urllib.request.build_opener(NoRedirect)
                response = opener.open(req, timeout=15)
                break

            except HTTPError as e:
                if e.code in (301, 302, 303, 307, 308):
                    location = e.headers.get('Location')
                    if location:
                        target_url = urllib.parse.urljoin(target_url, location)
                        continue
                self.send_error(e.code, f'Upstream error: {e.reason}')
                return

            except URLError as e:
                self.send_error(502, f'Could not reach site: {e.reason}')
                return

            except Exception as e:
                self.send_error(502, f'Proxy error: {str(e)}')
                return
        else:
            self.send_error(502, 'Too many redirects')
            return

        # Read response
        content_type = response.headers.get('Content-Type', 'text/html')
        body = response.read()

        # For HTML: inject <base> tag so relative URLs resolve correctly
        if 'text/html' in content_type:
            parsed_target = urllib.parse.urlparse(target_url)
            base_url = f'{parsed_target.scheme}://{parsed_target.netloc}{parsed_target.path}'
            base_tag = f'<base href="{base_url}">'.encode('utf-8')

            if b'<head>' in body:
                body = body.replace(b'<head>', b'<head>' + base_tag, 1)
            elif b'<HEAD>' in body:
                body = body.replace(b'<HEAD>', b'<HEAD>' + base_tag, 1)
            else:
                body = base_tag + body

        # Send response, stripping iframe-blocking headers
        self.send_response(response.status)
        for key, value in response.headers.items():
            if key.lower() in BLOCKED_HEADERS:
                continue
            if key.lower() == 'set-cookie':
                continue
            if key.lower() == 'transfer-encoding':
                continue
            try:
                self.send_header(key, value)
            except Exception:
                pass
        self.send_header('Content-Length', len(body))
        self.end_headers()
        self.wfile.write(body)

    # Suppress request logs for cleaner output
    def log_message(self, format, *args):
        if '/proxy' in str(args[0]) if args else False:
            return
        super().log_message(format, *args)


def open_browser():
    """Open browser after a short delay."""
    import time
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

    # Open browser in background thread
    threading.Thread(target=open_browser, daemon=True).start()

    try:
        server = http.server.HTTPServer(('', PORT), NieuwsmonitorHandler)
        server.serve_forever()
    except KeyboardInterrupt:
        print('\n  Server gestopt.')
        server.server_close()
