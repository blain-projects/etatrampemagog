# Fullstack Hybrid Template (Node/TS + Python)

This repository is a boilerplate for building fullstack applications. It uses **Docker Compose** to orchestrate a TypeScript frontend and a Python backend, with **Traefik** managing SSL and routing.

## 🚀 How to deploy
1. **Fork** this repository.
2. In Discord, ask your OpenClaw agent:
   `Deploy project [NAME] with repo git@github.com:[USER]/template-fullstack-web.git`
3. The app will be live at:
   - Frontend: `https://[NAME].blain-projects.ca`
   - Backend API: `https://api.[NAME].blain-projects.ca`

## 🏗️ Architecture


- **Frontend:** Node.js + Express + TypeScript. It serves the HTML/JS and communicates with the backend via HTTPS.
- **Backend:** Python + Flask. It handles logic, data processing, and API requests.
- **Networking:** Both services share the `web_network`. They can talk to each other internally using their service names (`http://backend:5000`).

## ⚠️ Critical Notes
- **CORS:** The Python backend includes `flask-cors`. This is mandatory. Without it, your browser will block requests from the frontend to the API subdomain.
- **SSL:** Traefik automatically handles certificates for both the main domain and the `api.` subdomain.

## 📈 Scaling Tips
### 1. Adding a Database
To add a database (e.g., PostgreSQL), add a new service in `docker-compose.yml`:
```yaml
  db:
    image: postgres:15
    volumes:
      - db_data:/var/lib/postgresql/data
    networks:
      - web_network