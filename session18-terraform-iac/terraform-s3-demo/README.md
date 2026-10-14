# Terraform S3 Bucket Demo

A hands-on Infrastructure-as-Code (IaC) demo provisioning an AWS S3 bucket using Terraform.

---

## 1. Project Directory Structure
```text
terraform-s3-demo/
├── provider.tf          # Terraform version & AWS provider configuration
├── variables.tf         # Input variable declarations
├── terraform.tfvars     # Variable value definitions
├── main.tf              # AWS S3 bucket resource definition
├── outputs.tf           # Output values (bucket name, ARN, region)
└── README.md            # Workflow documentation
```

---

## 2. Terraform Lifecycle Workflow

Execute the full Terraform workflow in sequence:

```text
init ──► fmt ──► validate ──► plan ──► apply ──► show ──► output ──► destroy
```

### Step 1: Initialize Working Directory
Downloads the AWS provider plugin and configures backend state:
```bash
terraform init
```
*Expected Output*: `Terraform has been successfully initialized!`

### Step 2: Format Code Syntax
Enforces standard Terraform indentation and styling:
```bash
terraform fmt
```

### Step 3: Validate Configuration
Checks configuration for internal consistency and syntax correctness:
```bash
terraform validate
```
*Expected Output*: `Success! The configuration is valid.`

### Step 4: Generate Execution Plan
Previews the resources Terraform will create without making live changes:
```bash
terraform plan
```
*Expected Output*: `Plan: 1 to add, 0 to change, 0 to destroy.`

### Step 5: Apply & Provision Infrastructure
Provisions the S3 bucket on AWS:
```bash
terraform apply -auto-approve
```
*Expected Output*:
```text
Apply complete! Resources: 1 added, 0 changed, 0 destroyed.
Outputs:
bucket_arn = "arn:aws:s3:::sahadheep-terraform-s3-demo-bucket"
bucket_name = "sahadheep-terraform-s3-demo-bucket"
bucket_region = "ap-south-1"
```

### Step 6: Inspect Live State
Displays detailed resource attributes stored in `terraform.tfstate`:
```bash
terraform show
```

### Step 7: Query Outputs
Retrieves defined outputs from the state file:
```bash
terraform output
terraform output bucket_name
```
*Expected Output*: `"sahadheep-terraform-s3-demo-bucket"`

### Step 8: Clean Up & Destroy Resources
Safely destroys all managed resources to prevent AWS charges:
```bash
terraform destroy -auto-approve
```
*Expected Output*: `Destroy complete! Resources: 1 destroyed.`

---

## 3. Workflow Terminal Output Screenshot
![Terraform S3 Workflow Output](../01-terraform-workflow.png)
