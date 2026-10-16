# HelpDesk Pro — Kubernetes Troubleshooting Lab Guide

This lab teaches the systematic diagnostic method required to troubleshoot Kubernetes application failures in production.

---

## Lab 1: ImagePullBackOff / ErrImagePull

### 1. Apply Faulty Manifest
```bash
kubectl apply -f troubleshooting/broken-image.yaml
```

### 2. Observe the Failure
```bash
kubectl get pods -n helpdesk -l scenario=broken-image
```
*Output will indicate status `ImagePullBackOff` or `ErrImagePull`.*

### 3. Diagnose Root Cause
Run `kubectl describe`:
```bash
kubectl describe pod -n helpdesk -l scenario=broken-image
```
Inspect the **Events** section at the bottom:
```text
Events:
  Type     Reason     Message
  ----     ------     -------
  Normal   Pulling    Pulling image "ghcr.io/sahadheep/helpdesk-backend:v999.non-existent"
  Warning  Failed     Failed to pull image: rpc error: code = NotFound
  Warning  Failed     Error: ErrImagePull
  Normal   BackOff    Back-off pulling image
```

### 4. Remedy
Edit the deployment to supply a valid image or tag:
```bash
kubectl set image deployment/helpdesk-broken-image -n helpdesk backend=ghcr.io/sahadheep/helpdesk-backend:latest
```

---

## Lab 2: Service Selector Mismatch (No Endpoints)

### 1. Apply Faulty Service
```bash
kubectl apply -f troubleshooting/broken-service.yaml
```

### 2. Observe Missing Endpoints
```bash
kubectl get svc helpdesk-broken-service -n helpdesk
kubectl get endpoints helpdesk-broken-service -n helpdesk
```
*Output will show `<none>` under the `ENDPOINTS` column.*

### 3. Diagnose Root Cause
Compare service selector against actual pod labels:
```bash
# Check service selector
kubectl get svc helpdesk-broken-service -n helpdesk -o jsonpath='{.spec.selector}'

# Check running pod labels
kubectl get pods -n helpdesk --show-labels
```
**Finding:** The service selector looks for `app: non-existent-workload`, but the backend pods have `app: helpdesk-backend`.

### 4. Remedy
Patch the selector to match the running backend pods:
```bash
kubectl patch svc helpdesk-broken-service -n helpdesk -p '{"spec":{"selector":{"app":"helpdesk-backend"}}}'
kubectl get endpoints helpdesk-broken-service -n helpdesk
```
*Endpoints will now list the IP addresses of the backend pods.*
