# Milestone 4 Notes — CI/CD Pipeline & DevSecOps (GitHub Actions + Trivy + GHCR)

**Project:** HelpDesk Pro — Enterprise Ticket Management System  
**Directory:** `capstone-helpdesk/.github/workflows`  
**Date:** October 2026  
**Status:** Completed  

---

## 1. Overview of Milestone 4

In Milestone 4, we implemented an automated end-to-end Continuous Integration, Continuous Delivery, and DevSecOps pipeline using GitHub Actions:

```text
[Git Push / PR]
       │
       ▼
 ┌───────────────┐
 │   TEST JOB    │  ──► Pytest Unit & API Tests
 │               │  ──► Frontend Bundle Production Build
 └───────┬───────┘
         │ (Only on success)
         ▼
 ┌───────────────┐
 │ BUILD & SCAN  │  ──► Docker multi-stage image builds (Commit SHA tag)
 │               │  ──► Trivy container vulnerability scanner (HIGH/CRITICAL)
 │               │  ──► Push verified images to GHCR (ghcr.io)
 └───────┬───────┘
         │ (Only on main branch)
         ▼
 ┌───────────────┐
 │  DEPLOY JOB   │  ──► Configure kubeconfig from encrypted secrets
 │               │  ──► Helm upgrade --install with image tag = commit SHA
 └───────────────┘
```

---

## 2. Pipeline Stages Detailed Breakdown

### Stage 1: Quality Gate (`test` job)
* **Python Environment:** Sets up Python 3.12 with pip cache.
* **Automated Tests:** Executes `pytest -v` inside `backend/`. If any test fails, the pipeline immediately halts, preventing broken images from ever being built.
* **Frontend Compilation:** Sets up Node.js 22 and validates that `npm run build` succeeds cleanly.

### Stage 2: Security & Artifact Storage (`build-scan-push` job)
* **Authentication:** Authenticates to GitHub Container Registry (`ghcr.io`) using the scoped repository token `${{ secrets.GITHUB_TOKEN }}`.
* **Immutable Commit SHA Tagging:** Tags every image with `${{ github.sha }}` for 100% auditability and traceability from production back to Git history:
  * `ghcr.io/<owner>/helpdesk-backend:<sha>`
  * `ghcr.io/<owner>/helpdesk-frontend:<sha>`
* **Trivy Container Vulnerability Scanning:**
  * Uses Aqua Security's `aquasecurity/trivy-action@0.30.0`.
  * Scans both `helpdesk-backend` and `helpdesk-frontend`.
  * `severity: HIGH,CRITICAL`: Enforces security thresholds.
  * `exit-code: '1'`: Fails the CI pipeline if unpatched high or critical CVEs are detected.
* **GHCR Push:** On successful security scan and when running on `main`, pushes both images to GHCR.

### Stage 3: Deployment (`deploy` job)
* **Conditional Trigger:** Runs exclusively on merges to the `main` branch after security checks pass.
* **Helm Integration:** Installs and initializes Helm via `azure/setup-helm@v4`.
* **Kubernetes Reconcile:** Injects cluster credentials via `${{ secrets.KUBE_CONFIG_DATA }}` and runs:
  ```bash
  helm upgrade --install helpdesk ./helm/helpdesk \
    --namespace helpdesk \
    --create-namespace \
    --set backend.image=ghcr.io/<owner>/helpdesk-backend \
    --set backend.tag=${{ github.sha }} \
    --set frontend.image=ghcr.io/<owner>/helpdesk-frontend \
    --set frontend.tag=${{ github.sha }}
  ```

---

## 3. Security Defense-in-Depth Teaching Principles

Students should recognize that Trivy in CI represents container image scanning, which is one component of a holistic DevSecOps framework:
1. **SAST (Static Application Security Testing):** Code analysis before compilation.
2. **SCA (Software Composition Analysis):** Dependency vulnerability audits (e.g. `npm audit`, `pip-audit`).
3. **Secret Scanning:** Preventing credentials/keys from being pushed to Git.
4. **Container Image Scanning (Trivy):** Scanning OS packages and libraries inside the built Docker layers.
5. **Runtime Security (Falco / Kyverno):** Enforcing pod security standards in Kubernetes.
