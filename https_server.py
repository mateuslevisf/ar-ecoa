import http.server
import ssl
import os

# Generate self-signed certificate (run these commands in terminal first)
# openssl req -new -x509 -keyout server.key -out server.cert -days 365 -nodes

# Set up server
port = 8000
handler = http.server.SimpleHTTPRequestHandler
httpd = http.server.HTTPServer(('0.0.0.0', port), handler)

# Add SSL context
context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
context.load_cert_chain('server.cert', 'server.key')
httpd.socket = context.wrap_socket(httpd.socket, server_side=True)

print(f"Serving HTTPS on 0.0.0.0 port {port}")
httpd.serve_forever()