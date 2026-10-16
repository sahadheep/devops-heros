# Milestone 7 Notes — Observability, Monitoring & Troubleshooting Labs

**Project:** HelpDesk Pro — Enterprise Ticket Management System  
**Directory:** `capstone-helpdesk/monitoring`, `scripts/`, `troubleshooting/`  
**Date:** October 2026  
**Status:** Completed  

---

## 1. Overview of Milestone 7

In Milestone 7, we implemented comprehensive monitoring, autoscaling verification scripts, and real-world failure troubleshooting labs:
- **Prometheus & Grafana:** Observability stack configuration scraping `/metrics` via Prometheus Operator `ServiceMonitor`.
- **Load Generation Helpers:** Bash and PowerShell load scripts to drive CPU traffic and prove HPA auto-scaling behavior.
- **Troubleshooting Labs:** Reproducible failure scenarios for `ImagePullBackOff` and broken `Service` label selector mismatches.

---

## 2. Directory Structure Created

```text
capstone-helpdesk/
├── monitoring/
│   └── prometheus-values.yaml             # Prometheus Operator & Grafana Helm values
├── scripts/
│   ├── load-test.sh                       # Linux / macOS curl load generator
│   └── load-test.ps1                      # Windows PowerShell load generator
└── troubleshooting/
    ├── broken-image.yaml                  # Faulty deployment triggering ImagePullBackOff
    ├── broken-service.yaml                # Mismatched selector with zero endpoints
    └── TROUBLESHOOTING-GUIDE.md           # Step-by-step diagnostic workflows
```

---

## 3. Monitoring Details

FastAPI metrics exposed on `/metrics` are scraped by Prometheus and mapped into Grafana dashboards:
- **Request Rate:** `sum(rate(http_requests_total[1m])) by (handler, status)`
- **Request Latency:** `histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket[1m])) by (le))`
- **Active Backend Pods:** `count(kube_pod_info{namespace="helpdesk", pod=~".*backend.*"})`
- **CPU Utilization:** `sum(rate(container_cpu_usage_seconds_total{namespace="helpdesk", pod=~".*backend.*"}[1m]))`

---

## 4. Verification & Testing

```bash
# Run load generator
./scripts/load-test.sh

# Watch HPA respond and scale pods
kubectl get hpa -n helpdesk -w

# Apply and troubleshoot broken image
kubectl apply -f troubleshooting/broken-image.yaml
kubectl describe pod -n helpdesk -l scenario=broken-image
```
