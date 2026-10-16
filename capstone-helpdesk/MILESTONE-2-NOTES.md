# Milestone 2 Notes — Frontend Dashboard (React + Vite + Modern SaaS UI + Nginx)

**Project:** HelpDesk Pro — Enterprise Ticket Management System  
**Directory:** `capstone-helpdesk/frontend`  
**Date:** October 2026  
**Status:** Completed & Build Verified  

---

## 1. Overview of Milestone 2

In Milestone 2, we built the complete, responsive Single Page Application (SPA) for **HelpDesk Pro**:
- **Framework:** React 18 + Vite
- **Styling:** Vanilla CSS design system with custom CSS variables, responsive grid, glassmorphism, and modern dark-mode aesthetic
- **Routing & Reverse Proxy:** Production-ready Nginx configuration handling SPA routing (`try_files $uri /index.html`) and proxying `/api`, `/health`, `/ready`, and `/metrics` to the backend.
- **Build Tooling:** Production bundle output with gzip compression support.

---

## 2. Directory Structure Created

```text
capstone-helpdesk/
└── frontend/
    ├── src/
    │   ├── main.jsx        # Complete React application & component tree
    │   └── styles.css      # Design tokens, typography, layout & responsive rules
    ├── dist/               # Production static assets bundle
    ├── .dockerignore
    ├── Dockerfile          # Multi-stage production build (Node -> Nginx)
    ├── index.html          # SEO tags, fonts & root container
    ├── nginx.conf          # Nginx reverse proxy configuration
    ├── package.json        # Dependencies (React, Vite)
    └── vite.config.js      # Vite dev server with proxy to backend :8000
```

---

## 3. UI/UX & Functional Features Implemented

### Top Header & Navigation
* **Eyebrow breadcrumbs:** Clear navigation hierarchy (`INCIDENT MANAGEMENT / RESOLVE TICKETS`).
* **Header Actions:** Quick manual "Refresh" button and glowing "＋ New Ticket" trigger.
* **Service Status Indicator:** Real-time ping checking `/health` endpoint with a live green indicator or red offline alert.

### KPI Cards (Dashboard Metrics)
Dynamically populated via `GET /api/tickets/stats`:
1. **Total Incidents:** Count of all registered support requests.
2. **Open Issues:** Tickets waiting for triage.
3. **In Progress:** Tickets currently assigned and under active investigation.
4. **Resolved:** Count of successfully resolved tickets.
5. **Urgent Priority:** High / Urgent SLA risk counter with subtle red pulse animation when active.

### Ticket Queue Table & Filtering
* **Status Filter Tabs:** `All`, `Open`, `In Progress`, `Resolved`, `Closed`.
* **Category Dropdown:** Filter by `Technical`, `Billing`, `Access & Security`, `Hardware`, `General`.
* **Real-time Search:** Multi-field search across title, description, requester email, and assignee.
* **Table Columns:**
  * Ticket ID (`#101`) & Title with description snippet.
  * Category badge.
  * Priority pill (`LOW`, `MEDIUM`, `HIGH`, `URGENT` with color-coded severity).
  * Customer email and Assigned agent.
  * Status badge (`OPEN`, `IN_PROGRESS`, `RESOLVED`, `CLOSED`).
  * Action controls: One-click status advancement (`Open -> In Progress -> Resolved -> Closed`) and Delete action.

### DevOps Side Rail & Recent Activity Feed
* **DevOps Pipeline Visualizer:** Interactive display tracking `Git Commit -> Pytest -> Trivy Scan -> Helm Deploy`.
* **Infrastructure Links:** Quick access to backend API ports, DB status, Prometheus `/metrics`, and Swagger `/docs`.
* **Activity Log:** Chronological stream of operational events (escalations, deployments, status changes).

### Interactive Ticket Creation Modal
* Modal window with backdrop blur and escape/close triggers.
* Form inputs for Title, Description, Category, Priority, Requester Email, and Assignee.
* Emits `POST /api/tickets` and automatically reloads the dashboard state.

---

## 4. Production Nginx Reverse Proxy (`nginx.conf`)

* Serves static assets from `/usr/share/nginx/html`.
* Enforces SPA fallback routing: `try_files $uri /index.html;`.
* Proxies all API requests to the upstream backend container:
  ```nginx
  location /api/ {
    proxy_pass http://backend:8000;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
  }
  ```
* Seamlessly exposes `/health`, `/ready`, and `/metrics` directly through port 80.

---

## 5. Build Verification

Build executed and verified via Vite:

```bash
cd capstone-helpdesk/frontend
npm install
npm run build
```

**Result:**
- `dist/index.html`: `1.33 kB` (gzip: `0.79 kB`)
- `dist/assets/index.css`: `11.24 kB` (gzip: `2.88 kB`)
- `dist/assets/index.js`: `156.66 kB` (gzip: `49.70 kB`)
- Build time: `666ms` with 0 errors.
