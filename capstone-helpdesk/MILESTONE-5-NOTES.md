# Milestone 5 Notes — Infrastructure as Code (Terraform AWS VPC & EKS)

**Project:** HelpDesk Pro — Enterprise Ticket Management System  
**Directory:** `capstone-helpdesk/terraform`  
**Date:** October 2026  
**Status:** Completed  

---

## 1. Overview of Milestone 5

In Milestone 5, we codified the entire underlying AWS cloud environment using Terraform (Infrastructure as Code). Kubernetes manages container workloads, but cannot provision its own cloud networks, security perimeters, or compute instances.

Using Terraform replaces error-prone manual console configurations with declarative, reproducible code:
```text
Manual AWS Console (Antipattern) ❌
  AWS Console ──► VPC ──► Subnets ──► Gateways ──► EKS ──► Node Groups...

Terraform IaC (Best Practice) ✅
  terraform apply ──► Reconciles desired cloud state automatically
```

---

## 2. Directory Structure Created

```text
capstone-helpdesk/
└── terraform/
    ├── main.tf          # VPC and EKS module definitions
    ├── variables.tf     # Region (ap-south-1), cluster name & VPC CIDR
    ├── outputs.tf       # EKS endpoint, cluster name & kubeconfig command
    ├── versions.tf      # Provider constraints (AWS provider ~> 5.50)
    └── README.md        # Execution & lifecycle instructions
```

---

## 3. Infrastructure Architecture

### AWS VPC Module (`terraform-aws-modules/vpc/aws`)
* **Region:** `ap-south-1` (Mumbai).
* **CIDR:** `10.30.0.0/16`.
* **Subnets:**
  * Public Subnets: `10.30.101.0/24`, `10.30.102.0/24` with `kubernetes.io/role/elb = 1` tags (for public ALBs/Ingress).
  * Private Subnets: `10.30.1.0/24`, `10.30.2.0/24` with `kubernetes.io/role/internal-elb = 1` tags (where worker nodes and database workloads run).
* **NAT Gateway:** Single NAT gateway enabled to allow private worker nodes to download container images securely without exposing their interfaces to the public internet.

### AWS EKS Cluster Module (`terraform-aws-modules/eks/aws`)
* **Cluster Name:** `helpdesk-eks`.
* **Kubernetes Version:** `1.31`.
* **Cluster Endpoint:** Public access enabled with administrator permissions mapped to cluster creator.
* **Managed Node Group:**
  * Instance Types: `t3.medium` (2 vCPU, 4 GiB memory).
  * Auto Scaling: Minimum 2 nodes, Desired 2 nodes, Maximum 4 nodes.
  * Node Labels: `role: worker`, `app: helpdesk`.

---

## 4. Operational Commands

```bash
cd capstone-helpdesk/terraform

# Initialize providers
terraform init

# Plan changes
terraform plan -out=tfplan

# Apply infrastructure
terraform apply tfplan

# Configure kubectl
aws eks update-kubeconfig --region ap-south-1 --name helpdesk-eks

# Verify cluster connection
kubectl get nodes -o wide

# Destroy when finished
terraform destroy -auto-approve
```
