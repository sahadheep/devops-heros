# Milestone 3 Notes — Containerization & Local Development (Docker & Compose)

**Project:** HelpDesk Pro — Enterprise Ticket Management System  
**Directory:** `capstone-helpdesk`  
**Date:** October 2026  
**Status:** Completed & Compose Configuration Verified  

---

## 1. Overview of Milestone 3

In Milestone 3, we containerized both the backend and frontend services using Docker, applied container security best practices, and assembled a unified `docker-compose.yml` stack for local developer workflows.

- **Backend Container:** Single-stage minimal Python image, non-root user execution, Alembic startup migration, and Uvicorn server on port `8000`.
- **Frontend Container:** Multi-stage build (Node builder $\rightarrow$ Nginx Alpine runtime) on port `80` (mapped to host port `3000`).
- **Database Service:** PostgreSQL 16 Alpine with custom health checks and persistent volume storage.
- **Orchestration:** Docker Compose with health-aware dependency management (`condition: service_healthy`).

---

## 2. Docker Architecture & Dockerfiles

### Backend Dockerfile (`backend/Dockerfile`)
```dockerfile
FROM python:3.12-slim
WORKDIR /app
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt && useradd --create-home --uid 10001 appuser
COPY alembic.ini ./
COPY alembic ./alembic
COPY app ./app
USER 10001
EXPOSE 8000
CMD ["sh", "-c", "alembic upgrade head && uvicorn app.main:app --host 0.0.0.0 --port 8000"]
```
* **Security highlights:** Runs as unprivileged user `10001` (`appuser`) instead of root.
* **Resilience:** Performs `alembic upgrade head` before starting Uvicorn, guaranteeing schema state matches the codebase.

### Frontend Dockerfile (`frontend/Dockerfile`)
```dockerfile
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:1.27-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
```
* **Multi-stage build:** Discards the Node runtime, npm dependencies, and source files; only the static `/dist` files and lightweight Nginx binary are kept in the final image.
* **Image size reduction:** Results in an extremely small, attack-surface-minimized production container.

---

## 3. Local Stack Architecture (`docker-compose.yml`)

```text
[Browser: localhost:3000]
         │
         ▼
[Frontend: Nginx:80] ──(Reverse Proxy)──► [Backend: FastAPI:8000]
                                                  │
                                                  ▼
                                      [PostgreSQL: 5432]
```

### Services Summary

| Service | Image / Build Context | Exposed Ports | Health Check / Dependencies |
| :--- | :--- | :--- | :--- |
| **`postgres`** | `postgres:16-alpine` | `5432:5432` | `pg_isready -U helpdesk -d helpdesk` |
| **`backend`** | `./backend` | `8000:8000` | Waits for Postgres `service_healthy` |
| **`frontend`** | `./frontend` | `3000:80` | Depends on `backend` |

---

## 4. Run & Verification Commands

To run the entire stack locally:

```bash
# Start all containers in the background with auto-build
docker compose up --build -d

# Check running container statuses
docker compose ps

# View real-time logs
docker compose logs -f backend

# Access services:
# Frontend:  http://localhost:3000
# Backend:   http://localhost:8000
# Swagger:   http://localhost:8000/docs
# Metrics:   http://localhost:8000/metrics
# Health:    http://localhost:8000/health

# Stop stack
docker compose down

# Stop and wipe database volume
docker compose down -v
```
