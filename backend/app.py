from flask import Flask, jsonify
from flask_cors import CORS
import os

app = Flask(__name__)

# CORS: explicit origins required when using credentials (auth cookies).
# See NETWORK.md for why "*" does NOT work with credentials: 'include'.
_project = os.environ.get('PROJECT_NAME', 'template')
CORS(app, supports_credentials=True, origins=[
    f"https://{_project}.blain-projects.ca",
    "http://localhost:5173",
])

@app.route('/api/health')
def health():
    return jsonify({
        "status": "online",
        "service": "python-backend",
        "project": os.environ.get('PROJECT_NAME', 'unknown')
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)