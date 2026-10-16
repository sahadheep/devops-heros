# Terraform Infrastructure for HelpDesk Pro

This module provisions the underlying cloud network and Kubernetes runtime on AWS:
- AWS VPC with public and private subnets across 2 Availability Zones (`ap-south-1a`, `ap-south-1b`)
- NAT Gateway for secure outbound internet access from private worker nodes
- AWS EKS Cluster (Kubernetes 1.31)
- Managed Node Groups with autoscaling ($2 \le \text{nodes} \le 4$)

## Quickstart

```bash
cd terraform
terraform init
terraform plan
terraform apply -auto-approve

# Configure kubectl after provisioning
$(terraform output -raw configure_kubectl)

# Verify cluster connection
kubectl get nodes
```

## Teardown

```bash
terraform destroy -auto-approve
```
