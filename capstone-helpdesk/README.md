# HelpDesk Pro — Enterprise Ticket Management System

[![CI/CD Pipeline](https://github.com/sahadheep/devops-heros/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/sahadheep/devops-heros/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python 3.12+](https://img.shields.io/badge/python-3.12%2B-blue.svg)](https://www.python.org/)
[![React 18](https://img.shields.io/badge/frontend-React%2018%20%2B%20Vite-61dafb.svg)](https://react.dev/)
[![Kubernetes 1.31](https://img.shields.io/badge/kubernetes-v1.31-326ce5.svg)](https://kubernetes.io/)

---

## 1. Project Overview

**HelpDesk Pro** is a production-grade, microservice-ready SaaS support ticket and incident management platform. It demonstrates how a modern cloud-native application travels from local developer workstations through automated testing, security scanning, container registries, Terraform cloud infrastructure, and Kubernetes orchestration with autoscaling and observability.

### End-to-End Delivery Architecture

```text
Developer Laptop
       │
       ▼
Git / GitHub (Branching & PRs)
       │
       ▼
GitHub Actions CI/CD
       ├── Pytest Automated Backend Tests
       ├── React Vite Production Build
       ├── Multi-stage Docker Builds
       ├── Aqua Trivy Container Security Scan (HIGH / CRITICAL)
       └── Push Immutable SHA-tagged Images to GHCR
                               │
                               ▼
                Terraform (Infrastructure as Code)
                               │
                      AWS VPC + AWS EKS (ap-south-1)
                               │
                               ▼
                       Helm Package Manager
                               │
               ┌───────────────┴───────────────┐
               ▼                               ▼
       React Frontend (Nginx:80)       FastAPI Backend (:8000)
               │                               │
               └───────────────┬───────────────┘
                               │
                               ▼
                    PostgreSQL 16 Database
                               │
                       Prometheus + Grafana
```

---

## 2. Technology Stack

| Layer | Technologies & Tools |
| :--- | :--- |
| **Frontend** | React 18, Vite, Vanilla CSS design system, Nginx reverse proxy |
| **Backend** | Python 3.12+, FastAPI, SQLAlchemy 2.0, Pydantic v2, Uvicorn |
| **Database** | PostgreSQL 16 Alpine, Alembic database migrations |
| **Testing** | Pytest, FastAPI TestClient, SQLite test isolation |
| **Containers** | Docker multi-stage builds, non-root user execution (`10001`) |
| **CI/CD & Security** | GitHub Actions, Trivy vulnerability scanner, GitHub Container Registry (GHCR) |
| **Infrastructure (IaC)** | Terraform (`aws` provider ~> 5.50), AWS VPC, AWS EKS |
| **Orchestration** | Kubernetes 1.31, Helm v3, Ingress-Nginx, HPA |
| **Observability** | Prometheus, Prometheus FastAPI Instrumentator, Grafana, ServiceMonitor |

---

## 3. Repository Structure

```text
capstone-helpdesk/
├── backend/                  # FastAPI service, SQLAlchemy models, Alembic migrations
│   ├── alembic/              # Schema revision migrations
│   ├── app/                  # REST APIs, config, db engine, models, schemas
│   ├── tests/                # Automated pytest test suite
│   ├── Dockerfile            # Production non-root container
│   ├── pytest.ini            # Pytest configuration
│   └── requirements.txt      # Python dependencies
├── frontend/                 # React SPA dashboard
│   ├── src/                  # Components and modern styling
│   ├── Dockerfile            # Multi-stage production build (Node -> Nginx)
│   ├── nginx.conf            # Reverse proxy & SPA fallback routing
│   └── package.json          # Dependencies & scripts
├── docker-compose.yml        # Full local containerized stack
├── terraform/                # AWS VPC + EKS cloud infrastructure
├── helm/helpdesk/            # Production Helm package (Deployments, Services, HPA, Ingress)
├── k8s/                      # Namespace manifest
├── monitoring/               # Prometheus & Grafana configurations
├── troubleshooting/          # Faulty manifests & step-by-step diagnostic guide
├── scripts/                  # Load-testing helpers (bash & powershell)
├── .github/workflows/        # Automated CI/CD & DevSecOps pipeline
└── DEMO-GUIDE.md             # 15-step final presentation evaluation script
```


---

## 4. Running Locally

### Option A: Fastest Method via Docker Compose (Recommended)

Requirements: Docker Desktop or Docker Engine.

```bash
# Build images and start all services
docker compose up --build -d

# Check service statuses
docker compose ps
```

Access services:
* **Frontend Dashboard:** [http://localhost:3000](http://localhost:3000)
* **Backend API Documentation:** [http://localhost:8000/docs](http://localhost:8000/docs)
* **Liveness Probe:** [http://localhost:8000/health](http://localhost:8000/health)
* **Readiness Probe:** [http://localhost:8000/ready](http://localhost:8000/ready)
* **Prometheus Telemetry:** [http://localhost:8000/metrics](http://localhost:8000/metrics)

Stop services:
```bash
docker compose down
# To wipe database volume: docker compose down -v
```

---

### Option B: Running Manually

#### 1. Backend
```bash
cd backend
python -m venv .venv
.\.venv\Scripts\activate       # On Linux/macOS: source .venv/bin/activate
pip install -r requirements.txt

# Run migrations
alembic upgrade head

# Run tests
pytest -v

# Start FastAPI server
uvicorn app.main:app --reload --port 8000
```

#### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## 5. API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | API status and documentation metadata |
| `GET` | `/health` | Kubernetes liveness probe |
| `GET` | `/ready` | Kubernetes readiness probe (checks database connectivity) |
| `GET` | `/metrics` | Prometheus metrics scrape endpoint |
| `GET` | `/api/tickets` | List tickets with optional status, priority, category, search filters |
| `POST` | `/api/tickets` | Create a new support ticket |
| `GET` | `/api/tickets/{id}` | Retrieve ticket by ID |
| `PUT` | `/api/tickets/{id}` | Update ticket attributes |
| `PATCH` | `/api/tickets/{id}/status` | Transition ticket status |
| `DELETE`| `/api/tickets/{id}` | Delete ticket |
| `GET` | `/api/tickets/stats` | Aggregated dashboard KPI counters |

---

## 6. Cloud Deployment (Terraform + Kubernetes + Helm)

### Step 1: Provision Infrastructure with Terraform
```bash
cd terraform
terraform init
terraform plan
terraform apply -auto-approve

# Configure kubectl
aws eks update-kubeconfig --region ap-south-1 --name helpdesk-eks
```

### Step 2: Deploy Workload via Helm
```bash
cd ..
kubectl apply -f k8s/namespace.yaml

helm upgrade --install helpdesk ./helm/helpdesk \
  --namespace helpdesk \
  -f ./helm/helpdesk/values-prod.yaml
```

### Step 3: Verify Deployment
```bash
kubectl get pods,svc,ingress,hpa -n helpdesk
```

---

## 7. License

MIT License. Built for Session 21 DevOps Final Capstone.
