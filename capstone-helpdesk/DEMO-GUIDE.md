# HelpDesk Pro — Final Student Presentation & Demo Guide

This script walks through the exact **15-step demonstration order** required for the Session 21 DevOps Final Capstone evaluation.

---

### Step 1: Application (HelpDesk Pro UI)
1. Open browser at `http://localhost:3000` (or your ingress host `http://helpdesk.local`).
2. Show the **KPI Cards** (*Total Incidents*, *Open Issues*, *In Progress*, *Resolved*, *Urgent Priority*).
3. Demonstrate live filtering by Status (`Open`, `Urgent`, `Resolved`) and Category (`Technical`, `Hardware`).
4. Click **"＋ New Ticket"**, fill out the modal form, and submit.
5. Show the new ticket immediately appearing in the queue with its category badge and priority pill.
6. Click the status advancement button (`↻`) to transition the ticket from `OPEN` $\rightarrow$ `IN_PROGRESS` $\rightarrow$ `RESOLVED`.

---

### Step 2: REST API & Interactive Documentation
1. Navigate to `http://localhost:8000/docs`.
2. Demonstrate FastAPI's interactive Swagger UI.
3. Test `GET /health` $\rightarrow$ returns `{"status": "UP"}` (Liveness).
4. Test `GET /ready` $\rightarrow$ returns `{"status": "READY", "database": "CONNECTED"}` (Readiness).
5. Execute `GET /api/tickets/stats` to show aggregated JSON telemetry.

---

### Step 3: Database & Migrations
1. Connect to PostgreSQL or inspect running containers:
   ```bash
   docker exec -it helpdesk-postgres psql -U helpdesk -d helpdesk -c "\dt"
   docker exec -it helpdesk-postgres psql -U helpdesk -d helpdesk -c "SELECT id, title, priority, status FROM tickets;"
   ```
2. Show the Alembic version tracking table:
   ```bash
   docker exec -it helpdesk-postgres psql -U helpdesk -d helpdesk -c "SELECT * FROM alembic_version;"
   ```
3. Explain why migrations are version-controlled alongside application code.

---

### Step 4: Git & Branching Strategy
1. Show Git history on terminal:
   ```bash
   git log --oneline -n 10
   ```
2. Highlight clear, semantic commit messages following standard conventions (`feat:`, `test:`, `build:`, `ci:`).

---

### Step 5: Continuous Integration (CI)
1. Open the GitHub repository $\rightarrow$ **Actions** tab.
2. Show the `Run Unit Tests & Build Assets` job:
   * Pytest running 12 automated unit tests across CRUD, validation, and probe endpoints.
   * Node build verifying the React bundle.
3. Explain that a failed test halts the pipeline before any container is built.

---

### Step 6: Docker Containerization
1. Open `backend/Dockerfile` and explain:
   * Non-root user `10001` security enforcement.
   * `alembic upgrade head` execution on container entry.
2. Open `frontend/Dockerfile` and explain:
   * Multi-stage build (discarding Node/npm tooling to keep runtime small and secure).
   * Nginx reverse proxy routing.

---

### Step 7: Container Security Scanning (Trivy)
1. Show the `Trivy Security Scan` step in GitHub Actions logs:
   * Scans container layers for vulnerabilities.
   * Enforces zero toleration on `HIGH` and `CRITICAL` CVEs (`exit-code: 1`).

---

### Step 8: Container Registry (GHCR)
1. Open GitHub Packages under your profile/organization.
2. Show the two published images:
   * `ghcr.io/<owner>/helpdesk-backend:<commit-sha>`
   * `ghcr.io/<owner>/helpdesk-frontend:<commit-sha>`
3. Explain how commit SHA tags ensure 100% traceability from production back to source code.

---

### Step 9: Infrastructure as Code (Terraform)
1. Show the `terraform/` directory:
   * `main.tf`: AWS VPC module with public/private subnets and NAT Gateway.
   * AWS EKS module configuring Kubernetes 1.31 and Managed Node Groups.
2. Emphasize that cloud resources are codified, versioned, and reproducible.

---

### Step 10: Kubernetes Orchestration
1. Inspect running cluster resources:
   ```bash
   kubectl get pods -n helpdesk
   kubectl get svc -n helpdesk
   ```
2. Show Pod liveness and readiness probe configurations:
   ```bash
   kubectl describe pod -n helpdesk -l app=helpdesk-backend | grep -A 5 "Liveness:"
   ```

---

### Step 11: Helm Package Management
1. Show Helm release status:
   ```bash
   helm list -n helpdesk
   helm status helpdesk -n helpdesk
   ```
2. Explain the value of `values-dev.yaml` vs. `values-prod.yaml` for environment portability.

---

### Step 12: Kubernetes Ingress
1. Inspect Ingress rules:
   ```bash
   kubectl get ingress -n helpdesk
   ```
2. Explain path routing:
   * `/` routes to React frontend.
   * `/api` routes to FastAPI backend.
   * Internal backend DNS names are never exposed to public internet clients.

---

### Step 13: Horizontal Pod Autoscaler (HPA)
1. Inspect current HPA state:
   ```bash
   kubectl get hpa -n helpdesk
   ```
2. Trigger the load generator script:
   ```bash
   ./scripts/load-test.sh
   # On Windows: .\scripts\load-test.ps1
   ```
3. Watch the HPA scale backend pods from 2 up to 4+ replicas in real time:
   ```bash
   kubectl get hpa -n helpdesk -w
   ```

---

### Step 14: Observability & Monitoring
1. Open Prometheus `/metrics` endpoint to show raw telemetry.
2. Open Grafana:
   * Show HTTP request rate panel (`http_requests_total`).
   * Show P95 latency panel (`http_request_duration_seconds_bucket`).
   * Show pod CPU and memory utilization correlating with the HPA load test.

---

### Step 15: Live Troubleshooting Demonstration
1. **Broken Image Simulation:**
   ```bash
   kubectl apply -f troubleshooting/broken-image.yaml
   kubectl get pods -n helpdesk -l scenario=broken-image
   # Show ImagePullBackOff
   kubectl describe pod -n helpdesk -l scenario=broken-image
   # Show the failed event and explain root-cause analysis
   ```
2. **Broken Service Simulation:**
   ```bash
   kubectl apply -f troubleshooting/broken-service.yaml
   kubectl get endpoints helpdesk-broken-service -n helpdesk
   # Show <none> endpoints
   # Explain label selector mismatch between Service spec and Pod template
   ```
