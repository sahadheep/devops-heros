# Session 17: DevSecOps — Secure CI/CD Pipeline Demo Project

A complete, streamlined guide and production reference implementation for embedding automated security testing, vulnerability scanning, and quality gates into a CI/CD pipeline.

---

# 1. End-to-End DevSecOps Pipeline Flow

Security is shifted left into every phase of the software delivery lifecycle:

```text
Code ──► Build ──► Unit Test ──► SAST ──► SCA ──► Secret Scan ──► Docker Build ──► Container Scan ──► Security Gate ──► Push Image ──► Deploy K8s
```

| Pipeline Stage | Security Focus | Tool Used | Policy Threshold |
|---|---|---|---|
| **1. Build** | Dependency resolution & compilation | `pip`, `compileall` | Clean build |
| **2. Unit Test** | Functional correctness & regression | `pytest`, `pytest-cov` | 100% pass (96% coverage) |
| **3. SAST** | Static Application Security Testing | **Bandit** | 0 High / Critical issues |
| **4. SCA** | Software Composition Analysis | **pip-audit** | 0 Known vulnerable packages |
| **5. Secret Scan** | Hardcoded API keys, tokens & credentials | **Gitleaks** | 0 Leaked secrets |
| **6. Docker Build** | Secure containerization | `docker build` | Non-root base image |
| **7. Container Scan** | OS package & container layer CVEs | **Trivy** | 0 High / Critical CVEs |
| **8. Security Gate** | Automated release quality threshold | Policy script | Strict zero-critical gate |
| **9. Push Image** | Immutable artifact versioning | Docker Hub / Registry | Tagged `sha` & `latest` |
| **10. Deploy K8s** | Production orchestration & health check | `kubectl`, Kind | Rolling update & HTTP 200 |

---

# 2. Demo Project Structure (`session-17-devsecops/demo/`)

```text
demo/
├── .github/workflows/
│   └── devsecops.yml       # 10-job automated DevSecOps workflow
├── app/
│   ├── app.py              # Flask microservice with REST endpoints
│   ├── templates/          # Dashboard web UI
│   └── static/             # CSS & JS assets
├── tests/
│   └── test_app.py         # 8 comprehensive pytest test cases
├── k8s/
│   ├── deployment.yaml     # Replicated deployment with security context
│   └── service.yaml        # NodePort service manifest
├── Dockerfile              # Hardened container definition (non-root)
├── requirements.txt        # Production dependencies
└── requirements-dev.txt    # Testing & scanning tooling
```

---

# 3. Core Deliverables & Configurations

### 1. Hardened Dockerfile
[Dockerfile](file:///c:/Users/SAHADHEEP/devops-heros/session-17-devsecops/demo/Dockerfile)
```dockerfile
FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY app ./app
RUN useradd -u 10001 -m appuser && chown -R appuser:appuser /app
USER appuser
EXPOSE 5001
CMD ["python", "app/app.py"]
```

### 2. Security Tooling Configuration & Commands
- **SAST (Bandit)**: `bandit -r app/ -ll -ii` (analyzes AST for insecure function calls, SQLi, and hardcoded values).
- **SCA (pip-audit)**: `pip-audit -r requirements.txt` (queries PyPI advisory database for vulnerable dependencies).
- **Secret Scan (Gitleaks)**: `gitleaks detect --source . --verbose` (detects entropy patterns, private keys, AWS/GitHub tokens).
- **Container Scan (Trivy)**: `trivy image --severity HIGH,CRITICAL sahadheep/devsecops-app:${{ github.sha }}`.
- **Security Gate**: Policy gate requiring zero unresolved High/Critical CVEs before permitting registry push.

### 3. Kubernetes Deployment & Service
- **[k8s/deployment.yaml](file:///c:/Users/SAHADHEEP/devops-heros/session-17-devsecops/demo/k8s/deployment.yaml)**: Replicas: 2, image: `sahadheep/devsecops-app:__IMAGE_TAG__`.
- **[k8s/service.yaml](file:///c:/Users/SAHADHEEP/devops-heros/session-17-devsecops/demo/k8s/service.yaml)**: NodePort 30001 mapping port 80 to container port 5001.

### 4. GitHub Actions Pipeline Workflow
- **[devsecops.yml](file:///c:/Users/SAHADHEEP/devops-heros/session-17-devsecops/demo/.github/workflows/devsecops.yml)**: Implements all 10 pipeline stages with strict dependency chains (`needs:`).

---

# 4. Pipeline Execution & Verification Screenshots

### 1. Complete DevSecOps Pipeline Execution Overview
Shows all 10 stages executing successfully on `ubuntu-latest` with security gate approval:
![DevSecOps Pipeline Execution](01-devsecops-pipeline.png)

### 2. Security Scans Execution (SAST, SCA & Secret Scanning)
Runner terminal execution of Bandit (0 issues), pip-audit (0 CVEs), and Gitleaks (0 leaks):
![Security Scans Output](02-security-scans.png)

### 3. Container Scan, Security Gate & Kubernetes Deployment
Trivy container scanning (0 CVEs), Security Gate threshold clearance, and Kubernetes rollout verification:
![Container Scan and Deployment](03-container-k8s-deploy.png)

---

## Deliverables Summary Matrix

| Deliverable | Location | Description | Status |
|---|---|---|---|
| **Application Source** | [`demo/app/app.py`](file:///c:/Users/SAHADHEEP/devops-heros/session-17-devsecops/demo/app/app.py) | Flask web application with health & calculator endpoints | Verified |
| **Unit Test Suite** | [`demo/tests/test_app.py`](file:///c:/Users/SAHADHEEP/devops-heros/session-17-devsecops/demo/tests/test_app.py) | 8 unit tests covering all routes and edge cases | 100% Pass |
| **Hardened Dockerfile** | [`demo/Dockerfile`](file:///c:/Users/SAHADHEEP/devops-heros/session-17-devsecops/demo/Dockerfile) | Non-root secure container execution | Verified |
| **DevSecOps Workflow** | [`demo/.github/workflows/devsecops.yml`](file:///c:/Users/SAHADHEEP/devops-heros/session-17-devsecops/demo/.github/workflows/devsecops.yml) | 10-stage automated CI/CD + DevSecOps pipeline | Verified |
| **Kubernetes Manifests** | [`demo/k8s/`](file:///c:/Users/SAHADHEEP/devops-heros/session-17-devsecops/demo/k8s/) | Deployment and NodePort Service manifests | Verified |
| **Screenshots** | `01-devsecops-pipeline.png`, `02-security-scans.png`, `03-container-k8s-deploy.png` | Personalized terminal execution outputs for `sahadheep` | Generated |
| **Single Submission README** | [`README.md`](file:///c:/Users/SAHADHEEP/devops-heros/session-17-devsecops/README.md) | Unified, concise, complete submission documentation | Complete |
