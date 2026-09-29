import http.server
import socketserver
import urllib.request
import urllib.error
import json
import os

PORT = 8080
DIRECTORY = os.path.dirname(os.path.abspath(__file__))
API_KEY = "AQ.Ab8RN6JwBAspVmogOFKW3-Ws4EP9GZF9IMbxAiP9aHHniJdpkA"

class CampusFlowHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        # Enable CORS and disable aggressive caching for development
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def do_POST(self):
        if self.path == '/api/gemini':
            content_length = int(self.headers.get('Content-Length', 0))
            post_body = self.rfile.read(content_length)

            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={API_KEY}"
            req = urllib.request.Request(
                url,
                data=post_body,
                headers={'Content-Type': 'application/json'}
            )

            try:
                with urllib.request.urlopen(req, timeout=25) as response:
                    resp_data = response.read()
                    self.send_response(200)
                    self.send_header('Content-Type', 'application/json')
                    self.end_headers()
                    self.wfile.write(resp_data)
            except urllib.error.HTTPError as e:
                err_content = e.read()
                print(f"[Gemini Proxy] HTTP {e.code}: {err_content.decode('utf-8', errors='ignore')[:200]}")
                self.send_response(e.code)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(err_content)
            except Exception as e:
                print(f"[Gemini Proxy] Error: {e}")
                err_json = json.dumps({"error": {"message": str(e)}}).encode('utf-8')
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(err_json)
            return

        super().do_POST()

if __name__ == '__main__':
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), CampusFlowHandler) as httpd:
        print(f"CampusFlow Server running at http://localhost:{PORT}")
        httpd.serve_forever()
