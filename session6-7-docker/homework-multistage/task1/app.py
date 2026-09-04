from http.server import BaseHTTPRequestHandler, HTTPServer

class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        response = "Hello World from Docker multi-stage build"
        self.send_response(200)
        self.send_header("Content-type", "text/plain")
        self.end_headers()
        self.wfile.write(response.encode())

server = HTTPServer(("0.0.0.0", 8080), Handler)

print("Application running on port 8080")
server.serve_forever()
