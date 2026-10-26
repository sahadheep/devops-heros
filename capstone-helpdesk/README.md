# HelpDesk Pro — Enterprise Incident Management System

[![CI/CD Pipeline](https://github.com/sahadheep/devops-heros/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/sahadheep/devops-heros/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python 3.12+](https://img.shields.io/badge/python-3.12%2B-blue.svg)](https://www.python.org/)
[![React 18](https://img.shields.io/badge/frontend-React%2018%20%2B%20Vite-61dafb.svg)](https://react.dev/)
[![Kubernetes 1.31](https://img.shields.io/badge/kubernetes-v1.31-326ce5.svg)](https://kubernetes.io/)
[![Terraform](https://img.shields.io/badge/IaC-Terraform%20AWS-7B42BC.svg)](https://www.terraform.io/)
[![ArgoCD](https://img.shields.io/badge/GitOps-ArgoCD-EF7B4D.svg)](https://argo-cd.readthedocs.io/)
[![Prometheus](https://img.shields.io/badge/Monitoring-Prometheus-E6522C.svg)](https://prometheus.io/)
[![Grafana](https://img.shields.io/badge/Observability-Grafana-F46800.svg)](https://grafana.com/)

---

## 1. Project Overview & Deliverables

**HelpDesk Pro** is a cloud-native, microservice-based enterprise incident and support ticket management platform. It fulfills all requirements for the **DevSecOps Final Capstone Project (Session 21)**.

### 🌟 Submission Deliverables Quick Links
* 📊 **Presentation Slides (PPTX)**: [`demo/HelpDesk_Pro_DevSecOps_Capstone.pptx`](./demo/HelpDesk_Pro_DevSecOps_Capstone.pptx)
* 🎥 **Live Walkthrough Video**: [`demo/demo-walkthrough.mp4`](./demo/demo-walkthrough.mp4)
* 🎯 **15-Step Evaluator Proof**: [`DEMO-GUIDE.md`](./DEMO-GUIDE.md) & [`COMPLETION-PROOF.md`](./COMPLETION-PROOF.md)

---

## 2. End-to-End DevSecOps Delivery Architecture

```text
Developer Laptop
       │
       ▼
Git / GitHub (Branching: capstone-project)
       │
       ▼
GitHub Actions CI/CD Pipeline
       ├── 1. Automated Testing: Pytest (12/12 passing) with SQLite isolation
       ├── 2. Frontend Asset Build: Vite 5.4 + React 18 production bundle
       ├── 3. Containerization: Multi-stage Docker builds (non-root UID 10001)
       ├── 4. Security Gate: Aqua Trivy container scan (blocks HIGH/CRITICAL CVEs)
       └── 5. Artifact Publishing: Push immutable SHA-tagged images to GHCR
                               │
                               ▼
                Terraform (Infrastructure as Code)
                               │
                      AWS VPC (Multi-AZ) + AWS EKS 1.31
                               │
                               ▼
                      ArgoCD GitOps Operator
                               │
                               ▼
                      Helm v3 Package Manager
                               │
               ┌───────────────┴───────────────┐
               ▼                               ▼
       React Frontend (Nginx:80)       FastAPI Backend (:8000)
               │                               │
               └───────────────┬───────────────┘
                               │
                               ▼
                    PostgreSQL 16 Database (5Gi PVC)
                               │
                       Prometheus + Grafana
```

---

## 3. Technology Stack Matrix

| Layer | Technology | Purpose & Implementation Details |
| :--- | :--- | :--- |
| **Frontend** | React 18, Vite 5.4, Vanilla CSS | Interactive incident dashboard with KPI counters and status filtering |
| **Backend** | Python 3.12, FastAPI, Pydantic v2 | High-throughput asynchronous REST API service |
| **Database** | PostgreSQL 16 Alpine, Alembic | Relational database with versioned schema migrations |
| **Testing** | Pytest, FastAPI TestClient, SQLite | 12 automated unit and integration tests with zero production dependency |
| **Containers** | Docker (Multi-stage) | Lean production images running as unprivileged user `helpdesk` (UID 10001) |
| **CI/CD** | GitHub Actions | Automated build, test, scan, and push pipeline triggered on Git pushes |
| **DevSecOps** | Aqua Trivy | Container vulnerability scanner failing builds on HIGH or CRITICAL CVEs |
| **IaC** | Terraform (`aws` provider ~> 5.50) | Automated AWS VPC (public/private subnets, NAT Gateway) and EKS cluster |
| **GitOps** | ArgoCD | Declarative Git-driven deployment with automated pruning and self-healing |
| **Orchestration** | Kubernetes 1.31, Helm v3 | Deployments, ClusterIP Services, Ingress-Nginx, HPA (2-6 pods), 5Gi PVC |
| **Observability** | Prometheus, Grafana | Prometheus FastAPI Instrumentator, ServiceMonitor, custom Grafana dashboards |

---

## 4. Repository Structure

```text
capstone-helpdesk/
├── backend/                       # FastAPI REST API backend service
│   ├── alembic/                   # Database schema migrations
│   │   └── versions/              # Migration scripts (e.g. initial ticket schema)
│   ├── app/                       # Application code
│   │   ├── config.py              # Environment configuration via Pydantic
│   │   ├── database.py            # SQLAlchemy engine & session factory
│   │   ├── main.py                # FastAPI app, routers, probes & metrics
│   │   ├── models.py              # SQLAlchemy database models
│   │   └── schemas.py             # Pydantic request/response validation schemas
│   ├── tests/                     # Pytest test suite
│   │   ├── conftest.py            # Test fixtures & isolated SQLite database
│   │   └── test_api.py            # 12 passing unit/integration tests
│   ├── Dockerfile                 # Multi-stage non-root container
│   ├── pytest.ini                 # Pytest test configuration
│   └── requirements.txt           # Python dependencies
├── frontend/                      # React 18 single page application
│   ├── src/                       # Components, state, and styling
│   ├── dist/                      # Production build assets
│   ├── Dockerfile                 # Multi-stage build (Node 22 -> Nginx Alpine)
│   ├── nginx.conf                 # Reverse proxy & SPA client routing
│   └── package.json               # Node dependencies and build scripts
├── terraform/                     # AWS Infrastructure as Code
│   ├── main.tf                    # AWS VPC & EKS cluster modules
│   ├── variables.tf               # Region, CIDR, and cluster variables
│   ├── outputs.tf                 # Cluster endpoint, VPC ID, kubeconfig helper
│   ├── terraform.tfvars.example   # Example parameter variables (no committed secrets)
│   ├── deploy-aws.ps1             # Turn-key deployment automation script
│   └── destroy-aws.ps1            # Turn-key teardown script for cost control
├── helm/helpdesk/                 # Production Helm v3 chart
│   ├── templates/                 # Deployments, Services, ConfigMaps, Secrets, Ingress, HPA
│   ├── Chart.yaml                 # Helm metadata
│   ├── values.yaml                # Default values
│   ├── values-dev.yaml            # Local cluster configuration
│   └── values-prod.yaml           # AWS production configuration
├── argocd/                        # Declarative GitOps Application manifests
│   ├── application.yaml           # ArgoCD Application resource definition
│   └── README.md                  # GitOps workflow & UI verification guide
├── monitoring/                    # Observability configurations
│   ├── prometheus-values.yaml     # Prometheus Helm values & scrape configurations
│   └── grafana-dashboard.json     # Custom Grafana dashboard for RED application metrics
├── demo/                          # Presentation & Video Submission Artifacts
│   ├── HelpDesk_Pro_DevSecOps_Capstone.pptx  # 12-slide PowerPoint presentation
│   ├── HelpDesk_Pro_DevSecOps_Capstone.pdf   # High-resolution PDF slide deck
│   ├── DEMO-RECORDING-GUIDE.md    # 8-step recording script & timestamps
│   ├── presentation-video-placeholder.mp4   # MP4 recording video placeholder
│   └── VIDEO_LINK.md              # Streaming links (YouTube / Loom / Drive)
├── scripts/                       # Load testing & helper automation
│   ├── load-test.sh               # High-concurrency bash load generator
│   └── load-test.ps1              # Windows PowerShell load generator
├── troubleshooting/               # Real-world diagnostic playbooks
│   ├── broken-image.yaml          # CrashLoopBackOff triage scenario
│   ├── broken-service.yaml        # Service selector misconfiguration scenario
│   └── TROUBLESHOOTING-GUIDE.md   # Step-by-step diagnostic guide
├── docker-compose.yml             # Local complete multi-service stack
└── README.md                      # Complete technical documentation
```

---

## 5. Running Locally

### Method 1: Docker Compose (Quickest)
```bash
# Build and start frontend, backend, and PostgreSQL database
docker compose up --build -d

# Verify containers are running
docker compose ps
```
* **Frontend Web UI**: [http://localhost:3000](http://localhost:3000)
* **API Documentation**: [http://localhost:8000/docs](http://localhost:8000/docs)
* **Liveness Probe**: [http://localhost:8000/health](http://localhost:8000/health)
* **Readiness Probe**: [http://localhost:8000/ready](http://localhost:8000/ready)
* **Prometheus Metrics**: [http://localhost:8000/metrics](http://localhost:8000/metrics)

To shut down:
```bash
docker compose down -v
```

---

### Method 2: Manual Development Setup

#### Backend Setup
```bash
cd backend
python -m venv .venv
.\.venv\Scripts\activate       # On Linux/macOS: source .venv/bin/activate
pip install -r requirements.txt

# Run migrations
alembic upgrade head

# Run automated tests
pytest -v

# Start FastAPI server
uvicorn app.main:app --reload --port 8000
```

#### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

---

## 6. Testing & Code Quality Gates (Module 2)

HelpDesk Pro maintains a 100% automated test gate executed via Pytest.

```bash
# Run backend test suite
cd backend
pytest -v
```

### Test Coverage Highlights:
1. `test_root`: Verifies API metadata endpoint.
2. `test_health`: Verifies `/health` Kubernetes liveness probe.
3. `test_ready`: Verifies `/ready` Kubernetes readiness probe with database health check.
4. `test_metrics`: Validates Prometheus telemetry output format.
5. `test_create_ticket_success`: Tests successful ticket creation and default values.
6. `test_create_ticket_validation_error`: Ensures Pydantic schema rejects invalid payloads.
7. `test_get_ticket_by_id`: Tests ticket retrieval and 404 handling.
8. `test_list_and_filter_tickets`: Verifies status, priority, and category query filters.
9. `test_update_ticket`: Validates full ticket attribute updates.
10. `test_patch_ticket_status`: Validates status state machine transitions.
11. `test_delete_ticket`: Verifies ticket deletion.
12. `test_stats_endpoint`: Verifies aggregated dashboard metrics computation.

---

## 7. CI/CD & DevSecOps Pipeline (Modules 5 & 6)

The CI/CD pipeline is implemented in [`.github/workflows/ci-cd.yml`](../.github/workflows/ci-cd.yml) and runs on every push and pull request to `main` and `capstone-project`:

1. **Automated Testing Gate**: Installs Python 3.12 and runs `pytest -v`. Build halts immediately if any test fails.
2. **Frontend Asset Build**: Installs Node 22 and runs `npm run build` to ensure zero compilation errors.
3. **Multi-Stage Docker Builds**: Builds hardened containers with non-root privileges.
4. **Aqua Trivy Container Security Scan**:
   ```bash
   aquasec/trivy:latest image --severity HIGH,CRITICAL --ignore-unfixed helpdesk-backend:${{ github.sha }}
   ```
   Ensures zero unpatched HIGH or CRITICAL vulnerabilities enter the artifact registry.
5. **Publish to GitHub Container Registry (GHCR)**: Pushes immutable images tagged with `${{ github.sha }}`.

---

## 8. Cloud Infrastructure via Terraform (Module 7)

Terraform provisions the complete AWS production environment in `ap-south-1`:

```bash
cd terraform
terraform init
terraform plan
terraform apply -auto-approve
```

### Infrastructure Details:
* **VPC**: `10.30.0.0/16` CIDR with 2 public subnets (`10.30.101.0/24`, `10.30.102.0/24`) and 2 private subnets (`10.30.1.0/24`, `10.30.2.0/24`).
* **NAT Gateway**: Single NAT gateway for secure outbound internet access.
* **EKS Cluster**: Kubernetes 1.31 cluster with managed worker node group (2x `t3.small` nodes scaling to 4).
* **Cost Control**: Complete teardown via `terraform destroy -auto-approve` or [`terraform/destroy-aws.ps1`](./terraform/destroy-aws.ps1).

---

## 9. Kubernetes Orchestration & Helm Packaging (Module 8)

The application is deployed to Kubernetes using Helm v3:

```bash
# Create namespace
kubectl apply -f k8s/namespace.yaml

# Deploy via Helm
helm upgrade --install helpdesk ./helm/helpdesk \
  --namespace helpdesk \
  -f ./helm/helpdesk/values-prod.yaml
```

### Deployed Workloads:
* **Backend Deployment**: 2 replicas running FastAPI with resource limits, liveness probe, and readiness probe.
* **Frontend Deployment**: 2 replicas running Nginx with SPA routing.
* **PostgreSQL Deployment**: Single instance with 5Gi PersistentVolumeClaim.
* **Ingress-Nginx**: Ingress resource routing `/` to frontend and `/api` to backend.
* **Horizontal Pod Autoscaler (HPA)**: Automatically scales backend replicas between 2 and 6 based on 70% CPU threshold.

---

## 10. GitOps Continuous Delivery via ArgoCD

HelpDesk Pro utilizes declarative GitOps delivery managed by ArgoCD:

```bash
# Apply ArgoCD Application
kubectl apply -f argocd/application.yaml

# Check sync status
kubectl get application helpdesk-pro -n argocd
```

* **Target Repo**: `https://github.com/sahadheep/devops-heros.git`
* **Target Revision**: `capstone-project`
* **Path**: `capstone-helpdesk/helm/helpdesk`
* **Automated Sync**: Configured with `prune: true` and `selfHeal: true` to prevent configuration drift.

See [`argocd/README.md`](./argocd/README.md) for full instructions and screenshots guide.

---

## 11. Observability: Prometheus & Grafana (Module 9)

HelpDesk Pro implements complete telemetry using the RED method (Rate, Errors, Duration):

1. **Instrumentation**: FastAPI Prometheus Instrumentator exports OpenMetrics at `/metrics`.
2. **Prometheus Scraping**: A CoreOS `ServiceMonitor` scrapes backend pods every 15s. The Prometheus Targets UI displays `helpdesk-backend` in a healthy **UP** state.
3. **Grafana Dashboards**: The pre-configured dashboard [`monitoring/grafana-dashboard.json`](./monitoring/grafana-dashboard.json) provides live visibility into:
   * **Throughput**: `rate(http_requests_total[1m])`
   * **Latency Distribution**: `histogram_quantile(0.95, ...)` for p50, p95, and p99 SLA tracking.
   * **Error Rates**: 4xx client errors and 5xx server exceptions.
   * **Active In-Flight Requests**: Real-time concurrency gauge.
4. **Load Testing**:
   ```bash
   ./scripts/load-test.sh
   # or on Windows:
   .\scripts\load-test.ps1
   ```
   Simulates 50+ concurrent requests, triggering live metric spikes in Grafana and demonstrating HPA auto-scaling.

---

## 12. Final Video Presentation & Grading Checklist (Module 10)

The final submission requires a live recorded presentation video covering all 8 steps in order:

| Step # | Evaluation Requirement | Status | Verification Reference |
| :---: | :--- | :---: | :--- |
| **1** | **Present PPT Slides** (Architecture & Stack) | ✅ Ready | [`demo/HelpDesk_Pro_DevSecOps_Capstone.pptx`](./demo/HelpDesk_Pro_DevSecOps_Capstone.pptx) |
| **2** | **Codebase Walkthrough** (Folder layout & files) | ✅ Ready | `backend/`, `frontend/`, `terraform/`, `helm/` |
| **3** | **CI/CD Pipeline** (Push trigger & end-to-end run) | ✅ Ready | [`.github/workflows/ci-cd.yml`](../.github/workflows/ci-cd.yml) |
| **4** | **Terraform** (`terraform plan` & AWS Console) | ✅ Ready | [`terraform/main.tf`](./terraform/main.tf), VPC + EKS |
| **5** | **ArgoCD** (Synced application & GitOps flow) | ✅ Ready | [`argocd/application.yaml`](./argocd/application.yaml) |
| **6** | **Kubernetes** (`kubectl get pods,svc,ingress`) | ✅ Ready | [`helm/helpdesk/templates/`](./helm/helpdesk/templates/) |
| **7** | **Prometheus** (Targets page showing app as UP) | ✅ Ready | `/metrics` endpoint & `ServiceMonitor` |
| **8** | **Grafana** (Live dashboard with metrics) | ✅ Ready | [`monitoring/grafana-dashboard.json`](./monitoring/grafana-dashboard.json) |

For complete instructions and talking points, refer to the [`demo/DEMO-RECORDING-GUIDE.md`](./demo/DEMO-RECORDING-GUIDE.md).

---

## 13. License

MIT License. Designed and engineered by Sahadheep for the Session 21 DevSecOps Final Capstone.
