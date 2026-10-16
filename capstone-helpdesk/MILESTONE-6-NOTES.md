# Milestone 6 Notes — Kubernetes Bootstrap & Helm Packaging

**Project:** HelpDesk Pro — Enterprise Ticket Management System  
**Directory:** `capstone-helpdesk/helm/helpdesk` & `capstone-helpdesk/k8s`  
**Date:** October 2026  
**Status:** Completed  

---

## 1. Overview of Milestone 6

In Milestone 6, we converted individual Kubernetes manifests into an enterprise Helm package (`helpdesk`). Helm eliminates manual manifest editing, simplifies configuration templating across multiple environments (`dev`, `prod`), and enables automated rollbacks.

Key achievements:
- **Namespace isolation:** `helpdesk` namespace manifest in `k8s/namespace.yaml`.
- **Deployments & Services:** Separate decoupled Deployments and ClusterIP Services for Frontend and Backend.
- **Persistent Database:** In-cluster PostgreSQL Deployment with a 5Gi PersistentVolumeClaim (`PVC`).
- **Ingress Controller Routing:** Single unified domain host (`helpdesk.local`) routing:
  - `/api` $\rightarrow$ Backend port 8000
  - `/health`, `/ready`, `/metrics` $\rightarrow$ Backend port 8000
  - `/` $\rightarrow$ Frontend port 80
- **Horizontal Pod Autoscaling (HPA):** Dynamically scales backend replicas from 2 to 5 based on 60% CPU utilization.
- **ServiceMonitor:** Native CoreOS Prometheus Operator resource to scrape `/metrics`.

---

## 2. Directory Structure Created

```text
capstone-helpdesk/
├── k8s/
│   └── namespace.yaml                     # Namespace declaration
└── helm/
    └── helpdesk/
        ├── Chart.yaml                     # Chart metadata (v1.0.0)
        ├── values.yaml                    # Base configuration
        ├── values-dev.yaml                # Single replica overrides for development
        ├── values-prod.yaml               # Scaled production values (10 max pods)
        └── templates/
            ├── _helpers.tpl               # Label and naming templates
            ├── backend-deployment.yaml    # Probes, resource limits & env vars
            ├── backend-service.yaml       # ClusterIP service
            ├── frontend-deployment.yaml   # Nginx static server deployment
            ├── frontend-service.yaml      # ClusterIP service
            ├── postgres.yaml              # PVC, Deployment, Service
            ├── ingress.yaml               # Ingress routing rules
            ├── hpa.yaml                   # CPU autoscaling policy
            └── servicemonitor.yaml        # Prometheus metrics scraper
```

---

## 3. Helm Usage & Verification

To install the Helm chart on any Kubernetes cluster:

```bash
# 1. Create namespace
kubectl apply -f k8s/namespace.yaml

# 2. Deploy Helm release (Dev environment)
helm upgrade --install helpdesk ./helm/helpdesk \
  --namespace helpdesk \
  -f ./helm/helpdesk/values-dev.yaml

# 3. Check running pods and services
kubectl get pods,svc,ingress,hpa -n helpdesk

# 4. View Helm release history
helm history helpdesk -n helpdesk

# 5. Rollback to previous version if needed
helm rollback helpdesk 1 -n helpdesk
```
