# DevOps Heros — Comprehensive Coursework & Final Capstone

[![CI/CD Pipeline](https://github.com/sahadheep/devops-heros/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/sahadheep/devops-heros/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

* **Student / Engineer:** Sahadheep  
* **Repository:** [github.com/sahadheep/devops-heros](https://github.com/sahadheep/devops-heros)  
* **Capstone Working Branch:** `capstone-project`  
* **Submission Form:** [https://forms.gle/XWAP1vAumDJgAPM1A](https://forms.gle/XWAP1vAumDJgAPM1A)  
* **Submission Deadline:** Sunday, 19 October 2026, 11:59 PM IST  

---

## 🌟 Session 21 Final DevSecOps Capstone: HelpDesk Pro

**HelpDesk Pro** is a production-grade, microservice-based SaaS support ticket and incident management platform built across all 10 modules of the DevSecOps curriculum.

👉 **[Explore Full Technical Documentation in `capstone-helpdesk/`](./capstone-helpdesk)**

---

### 📦 Submission Deliverables in `demo/` Folder

As mandated by the submission guidelines, the presentation slides and video walkthrough are located in both [`demo/`](./demo) and [`capstone-helpdesk/demo/`](./capstone-helpdesk/demo):
 
| Deliverable | File Link | Status | Description |
| :--- | :--- | :---: | :--- |
| 📊 **PPT Slide Deck** | [`demo/HelpDesk_Pro_DevSecOps_Capstone.pptx`](./demo/HelpDesk_Pro_DevSecOps_Capstone.pptx) | ✅ Present | 12-slide comprehensive presentation deck formatted in 16:9 widescreen. |
| 🎥 **Presentation Video** | [Google Drive Video Walkthrough](https://drive.google.com/file/d/1OaFILXn0B7LWQSUzXwGXwd0pvizraccb/view?usp=drive_link) | ✅ Present | Full HD video walkthrough covering the 8 rubric evaluation steps in exact sequence. |

---

### 🎥 Mandatory Video Requirements Checklist (In Exact Order)

Your final submission video must cover the following 8 components in this exact order:

1. [x] **Present PPT Slides**: What you built, problem statement, architecture overview ([`demo/HelpDesk_Pro_DevSecOps_Capstone.pptx`](./demo/HelpDesk_Pro_DevSecOps_Capstone.pptx)).
2. [x] **Codebase Walkthrough**: Directory structure, FastAPI backend, React frontend, Dockerfiles, and Helm chart.
3. [x] **CI/CD Pipeline**: Trigger a push, show GitHub Actions pipeline running end-to-end (Pytest, Vite build, Trivy scan, GHCR push).
4. [x] **Terraform**: `terraform plan` output and AWS Console showing provisioned VPC and EKS cluster in `ap-south-1`.
5. [x] **ArgoCD**: Show `helpdesk-pro` application synced and healthy, demonstrating GitOps continuous delivery ([`capstone-helpdesk/argocd/`](./capstone-helpdesk/argocd/)).
6. [x] **Kubernetes**: `kubectl get pods,svc,ingress,hpa -n helpdesk` showing all pods in `Running` state.
7. [x] **Prometheus**: Targets page (`/targets`) displaying `helpdesk-backend` target as `UP`.
8. [x] **Grafana**: Live dashboard with application metrics responding to traffic generated via [`capstone-helpdesk/scripts/load-test.sh`](./capstone-helpdesk/scripts/load-test.sh).

---

## 📂 Repository Directory Overview

| Directory | Focus Area / Topics |
|:---|:---|
| **[capstone-helpdesk/](./capstone-helpdesk)** | **Session 21 Final Capstone Project (HelpDesk Pro)** |
| **[demo/](./demo)** | **Final Capstone Demo Deliverables (PPT, PDF, Video Guide & Placeholder)** |
| **[session1-devops-engineer-roadmap/](./session1-devops-engineer-roadmap)** | DevOps Roadmap & Foundations |
| **[session2-linux/](./session2-linux)** | Linux Administration, Permissions, Processes & Storage |
| **[session3-shell-scripting/](./session3-shell-scripting)** | Bash Automation Scripts & System Diagnostics |
| **[session4-networking/](./session4-networking)** | TCP/IP, DNS, Routing, CIDR, and Ports |
| **[session5-git-github/](./session5-git-github)** | Git Version Control, Branching, Rebase & Merging |
| **[session6-7-docker/](./session6-7-docker)** | Docker Images, Multi-Stage Builds & Container Lifecycle |
| **[session8-docker-networking-volume/](./session8-docker-networking-volume)** | Container Networks, Storage Volumes & Compose |
| **[session9-k8s/](./session9-k8s)** | Kubernetes Architecture, Pods & Minikube |
| **[session10-k8s-core-objects/](./session10-k8s-core-objects)** | Deployments, ReplicaSets & Pod Lifecycles |
| **[session-11-kubernetes-services/](./session-11-kubernetes-services)** | ClusterIP, NodePort, LoadBalancer & CoreDNS |
| **[session-12-ingress-configmaps-secrets/](./session-12-ingress-configmaps-secrets)** | Ingress Controllers, ConfigMaps & Encrypted Secrets |
| **[session-13-storage-hpa-probes/](./session-13-storage-hpa-probes)** | PV, PVC, StorageClasses, HPA & Health Probes |
| **[session-14-kubernetes-troubleshooting/](./session-14-kubernetes-troubleshooting)** | Real-world K8s Debugging & Playbooks |
| **[session-15-helm/](./session-15-helm)** | Helm v3 Charts, Values, Templating & Rollbacks |
| **[session-16-github-actions/](./session-16-github-actions)** | CI/CD Workflows, Runners, Actions & Artifacts |
| **[session-17-devsecops/](./session-17-devsecops)** | Aqua Trivy, SAST, SCA, and Security Gates |
| **[session18-terraform-iac/](./session18-terraform-iac)** | Terraform Providers, Resources & State Management |
| **[session19-cloud-terraform/](./session19-cloud-terraform)** | AWS Cloud Infrastructure via Terraform |
| **[session20-monitoring-observability-gitops/](./session20-monitoring-observability-gitops)** | Prometheus, Grafana, Alerting & GitOps |

---

## 🔗 Submission Form
* **Official Capstone Submission Form**: [https://forms.gle/XWAP1vAumDJgAPM1A](https://forms.gle/XWAP1vAumDJgAPM1A)
