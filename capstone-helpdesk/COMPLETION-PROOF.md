# HelpDesk Pro — Capstone Tasks Completion Proof & Evidence

**Student / Engineer:** Sahadheep  
**Repository:** `https://github.com/sahadheep/devops-heros.git`  
**Branch:** `capstone-project`  
**Evaluation Standard:** Session 21 DevOps Final Capstone (100 Points Rubric)  

---

## 🎯 Executive Summary of Proof

| Module | Rubric Topic | Points | Completion Status | Proof / Evidence Location |
|:---:|:---|:---:|:---:|:---|
| **M1** | Application (FastAPI + React + PostgreSQL) | 10/10 | ✅ Completed | `backend/app/`, `frontend/src/`, `alembic/` |
| **M2** | Automated Testing (Pytest Suite) | 10/10 | ✅ 12/12 Passed | Terminal test log below (100% pass) |
| **M3** | Git & GitHub (10 Semantic Commits) | 5/5 | ✅ Pushed | `git log` output with 10 commits |
| **M4** | Docker & Docker Compose | 10/10 | ✅ Verified | `backend/Dockerfile`, `frontend/Dockerfile`, `docker-compose.yml` |
| **M5** | CI/CD Pipeline (GitHub Actions) | 15/15 | ✅ Implemented | `.github/workflows/ci-cd.yml` |
| **M6** | DevSecOps (Aqua Trivy Vulnerability Scan) | 5/5 | ✅ Configured | Trivy scan step in CI workflow |
| **M7** | Terraform AWS VPC + EKS (ap-south-1) | 15/15 | ✅ Coded | `terraform/main.tf`, `variables.tf`, `outputs.tf` |
| **M8** | Kubernetes Orchestration & Helm Packaging | 15/15 | ✅ Packaged | `k8s/namespace.yaml`, `helm/helpdesk/` |
| **M9** | Observability (Prometheus + Grafana + HPA) | 10/10 | ✅ Configured | `/metrics`, `servicemonitor.yaml`, `load-test.sh` |
| **M10**| Master Documentation & Demo Script | 5/5 | ✅ Documented | `README.md`, `DEMO-GUIDE.md`, Milestones 1–8 |
| **TOTAL** | **Session 21 Capstone Evaluation** | **100/100** | **ALL COMPLETED** | All assets pushed to GitHub |

---

## 📋 Task-by-Task Proof & Evidence Logs

### 1. Proof for M2: Pytest Automated Testing (10 Points)
Execution command run inside `capstone-helpdesk/backend`:
```text
C:\Users\SAHADHEEP\Desktop\devops-heros\capstone-helpdesk\backend\.venv\Scripts\pytest -v
```
**Terminal Output Proof:**
```text
============================= test session starts =============================
platform win32 -- Python 3.13.3, pytest-8.3.4, pluggy-1.7.0
rootdir: C:\Users\SAHADHEEP\Desktop\devops-heros\capstone-helpdesk\backend
configfile: pytest.ini
testpaths: tests
plugins: anyio-4.15.1
collected 12 items

tests/test_api.py::test_root PASSED                                      [  8%]
tests/test_api.py::test_health PASSED                                    [ 16%]
tests/test_api.py::test_ready PASSED                                     [ 25%]
tests/test_api.py::test_metrics PASSED                                   [ 33%]
tests/test_api.py::test_create_ticket_success PASSED                     [ 41%]
tests/test_api.py::test_create_ticket_validation_error PASSED            [ 50%]
tests/test_api.py::test_get_ticket_by_id PASSED                          [ 58%]
tests/test_api.py::test_list_and_filter_tickets PASSED                   [ 66%]
tests/test_api.py::test_update_ticket PASSED                             [ 75%]
tests/test_api.py::test_patch_ticket_status PASSED                       [ 83%]
tests/test_api.py::test_delete_ticket PASSED                             [ 91%]
tests/test_api.py::test_stats_endpoint PASSED                            [100%]

======================= 12 passed, 3 warnings in 1.93s ========================
```
*Evidence: 12 tests executed covering Liveness `/health`, DB Readiness `/ready`, Prometheus `/metrics`, ticket CRUD, query filters, and dashboard stats aggregation.*

---

### 2. Proof for M3: Git Version Control & 10 Remote Commits (5 Points)
Execution command:
```text
git log --oneline -n 10
```
**Terminal Output Proof:**
```text
41b9643 docs: complete HelpDesk Pro capstone documentation and 15-step demo guide
2f75800 feat(monitoring): add Prometheus metrics, Grafana dashboard, HPA load tester, and troubleshooting labs
d52056d feat(helm): create HelpDesk Pro Helm chart with Ingress, Service, PVC, and HPA autoscaling
702f69b feat(terraform): add AWS VPC and EKS infrastructure manifests in ap-south-1
1f19faf ci(github-actions): add CI/CD pipeline with pytest, Trivy container security scan, and GHCR publishing
f16af48 build(docker): add multi-stage frontend Dockerfile, non-root backend Dockerfile, and compose stack
0c2b5e3 feat(frontend): implement ticket queue, status management, modals, and Nginx proxy config
95272f3 feat(frontend): create React Vite dashboard structure and dark-mode design system
c142cdf test(backend): add comprehensive Pytest test suite for health, ready, and ticket CRUD APIs
310287d feat(backend): implement HelpDesk Pro data models, FastAPI core, and Alembic migrations
```
*Evidence: 10 semantic commits pushed to remote `origin capstone-project` on GitHub.*

---

### 3. Proof for M1: Application Frontend & Backend (10 Points)
Execution command in `capstone-helpdesk/frontend`:
```text
npm run build
```
**Terminal Output Proof:**
```text
> helpdesk-frontend@1.0.0 build
> vite build

vite v5.4.21 building for production...
transforming...
✓ 30 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                   1.33 kB │ gzip:  0.79 kB
dist/assets/index-C03SW9zc.css   11.24 kB │ gzip:  2.88 kB
dist/assets/index-CDe-yO6Q.js   156.66 kB │ gzip: 49.70 kB
✓ built in 666ms
```
*Evidence: Full React Single Page Application compiled with zero errors.*

---

### 4. Proof for M4: Docker & Docker Compose (10 Points)
Execution command in `capstone-helpdesk`:
```text
docker compose config
```
**Terminal Output Proof:**
```text
name: capstone-helpdesk
services:
  backend:
    build:
      context: C:\Users\SAHADHEEP\Desktop\devops-heros\capstone-helpdesk\backend
      dockerfile: Dockerfile
    container_name: helpdesk-backend
    depends_on:
      postgres:
        condition: service_healthy
    ports:
      - published: "8000"
        target: 8000
  frontend:
    build:
      context: C:\Users\SAHADHEEP\Desktop\devops-heros\capstone-helpdesk\frontend
      dockerfile: Dockerfile
    container_name: helpdesk-frontend
    ports:
      - published: "3000"
        target: 80
  postgres:
    image: postgres:16-alpine
    container_name: helpdesk-postgres
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U helpdesk -d helpdesk"]
    ports:
      - published: "5432"
        target: 5432
```
*Evidence: Validated compose definition with healthcheck dependency controls, unprivileged non-root users (`10001`), and multi-stage frontend Dockerfile.*

---

### 5. Proof for M5 & M6: CI/CD Pipeline & DevSecOps (20 Points)
* **Workflow File:** `.github/workflows/ci-cd.yml`
* **Trigger:** Push and Pull Requests to branch `main`.
* **Stage 1 (Test Gate):** Runs Pytest and frontend build.
* **Stage 2 (Security Gate):** Builds containers, executes Aqua Trivy vulnerability scanner (`severity: HIGH,CRITICAL`, `exit-code: 1`), and pushes to `ghcr.io`.
* **Stage 3 (Deploy Gate):** Automates Helm deployment with commit SHA tagging.

---

### 6. Proof for M7: Terraform Cloud Infrastructure (15 Points)
* **Directory:** `terraform/`
* **Modules:**
  * AWS VPC (`terraform-aws-modules/vpc/aws` v5.8.1) in `ap-south-1` with 2 public subnets, 2 private subnets, and NAT Gateway.
  * AWS EKS (`terraform-aws-modules/eks/aws` v20.37.1) Kubernetes v1.31 with Managed Node Groups (`t3.medium`, autoscaling 2–4 nodes).
* **Outputs:** `cluster_name`, `cluster_endpoint`, `vpc_id`, and `configure_kubectl` command.

---

### 7. Proof for M8: Kubernetes & Helm Packaging (15 Points)
* **Namespace:** `k8s/namespace.yaml` (`helpdesk` namespace).
* **Helm Package:** `helm/helpdesk/` with environment values (`values-dev.yaml`, `values-prod.yaml`).
* **Deployments:** Separate pods for Backend (with liveness `/health` and readiness `/ready` probes), Frontend (Nginx), and PostgreSQL (with 5Gi PVC).
* **Ingress:** Routes `/` to frontend, and `/api`, `/health`, `/ready`, `/metrics` to backend.
* **HPA:** Autoscales backend pods between 2 and 5 replicas on 60% CPU utilization.

---

### 8. Proof for M9: Observability & Monitoring (10 Points)
* **Prometheus Telemetry:** FastAPI Prometheus instrumentator registered at `/metrics`.
* **ServiceMonitor:** `helm/helpdesk/templates/servicemonitor.yaml` configuring automatic Prometheus scraping.
* **Grafana Stack:** `monitoring/prometheus-values.yaml`.
* **Autoscaling Load Generator:** `scripts/load-test.sh` and `scripts/load-test.ps1`.
* **Troubleshooting Labs:** `broken-image.yaml` (ImagePullBackOff) and `broken-service.yaml` (Missing endpoints) with complete diagnostic steps in `troubleshooting/TROUBLESHOOTING-GUIDE.md`.

---

### 9. Proof for M10: Documentation & Presentation (5 Points)
* **Master Documentation:** Comprehensive `README.md` in repository root.
* **Evaluation Script:** `DEMO-GUIDE.md` detailing the 15-step presentation walkthrough.
* **Milestone Logs:** `MILESTONE-1-NOTES.md` through `MILESTONE-8-NOTES.md`.
