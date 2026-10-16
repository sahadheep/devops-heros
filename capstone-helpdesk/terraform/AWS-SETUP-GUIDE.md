# AWS EKS Setup & Deployment Guide for HelpDesk Pro

Follow these quick steps whenever you sign up or log into your AWS account to create your Kubernetes cluster.

---

## Step 1: Get Your AWS Access Keys

1. Log into your **AWS Management Console** (`https://aws.amazon.com/console/`).
2. In the top search bar, search for **IAM** (Identity and Access Management).
3. Click **Users** $\rightarrow$ select your username (or create a new user with `AdministratorAccess`).
4. Click the **Security credentials** tab.
5. Scroll down to **Access keys** $\rightarrow$ click **Create access key**.
6. Select **Command Line Interface (CLI)** $\rightarrow$ check the confirmation box $\rightarrow$ click **Next** $\rightarrow$ click **Create access key**.
7. Copy both:
   * **Access Key ID** (e.g., `AKIA...`)
   * **Secret Access Key** (e.g., `wJalrXUtn...`)

---

## Step 2: One-Click Cluster Deployment

Whenever you are ready, simply open **PowerShell** and run:

```powershell
cd c:\Users\SAHADHEEP\Desktop\devops-heros\capstone-helpdesk\terraform
powershell -ExecutionPolicy Bypass -File .\deploy-aws.ps1
```

### What this script does automatically:
1. Prompts you for your **AWS Access Key ID** and **Secret Access Key** (keeps it secure).
2. Sets your target region to `ap-south-1` (Mumbai).
3. Runs `terraform init` to download modules.
4. Generates an execution plan showing all VPC and EKS resources.
5. Asks for your confirmation (`yes`), then provisions the cluster on AWS.
6. Automatically links your `kubectl` to the new AWS EKS cluster!

---

## Step 3: Verify Your Cloud Cluster

Once the script completes, run:

```powershell
kubectl get nodes
```
You will see your live AWS EC2 worker nodes (`Ready`) running Kubernetes in Mumbai!

---

## Step 4: Tear Down (Avoid Unwanted Billing)

When your evaluation or demo is finished, run the one-click teardown script to delete everything and stop all AWS billing:

```powershell
cd c:\Users\SAHADHEEP\Desktop\devops-heros\capstone-helpdesk\terraform
powershell -ExecutionPolicy Bypass -File .\destroy-aws.ps1
```
Type `yes`, and Terraform will cleanly delete the EKS cluster, NAT Gateway, and VPC so you never get charged.
