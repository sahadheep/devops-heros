# ==============================================================================
# HelpDesk Pro — Automated AWS EKS Cluster Provisioner
# ==============================================================================
param (
    [string]$Region = "ap-south-1"
)

$ErrorActionPreference = "Stop"

Write-Host "==================================================================" -ForegroundColor Cyan
Write-Host " HelpDesk Pro: Automated AWS VPC & EKS Cluster Deployment" -ForegroundColor Cyan
Write-Host " Target Region: $Region (Mumbai)" -ForegroundColor Gray
Write-Host "==================================================================" -ForegroundColor Cyan

# 1. Check or Prompt for AWS Credentials
if (-not $env:AWS_ACCESS_KEY_ID -or -not $env:AWS_SECRET_ACCESS_KEY) {
    Write-Host "`n[!] No active AWS credentials found in environment variables." -ForegroundColor Yellow
    $accessKey = Read-Host "Enter your AWS Access Key ID"
    $secretKey = Read-Host "Enter your AWS Secret Access Key" -AsSecureString
    $bstr = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($secretKey)
    $plainSecret = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($bstr)
    
    $env:AWS_ACCESS_KEY_ID = $accessKey.Trim()
    $env:AWS_SECRET_ACCESS_KEY = $plainSecret.Trim()
    $env:AWS_DEFAULT_REGION = $Region
}

# 2. Add Terraform to Path if needed
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

Write-Host "`n[Step 1/4] Running Terraform Init..." -ForegroundColor Green
terraform init

Write-Host "`n[Step 2/4] Running Terraform Plan..." -ForegroundColor Green
terraform plan -out=tfplan

Write-Host "`n[Step 3/4] Ready to provision AWS VPC, subnets, and EKS cluster." -ForegroundColor Cyan
$confirm = Read-Host "Do you want to proceed and create resources in AWS? (yes/no)"

if ($confirm.ToLower() -eq "yes") {
    Write-Host "`nProvisioning AWS Infrastructure (this usually takes 10-15 minutes)..." -ForegroundColor Green
    terraform apply tfplan

    Write-Host "`n[Step 4/4] Configuring kubectl for your new AWS EKS cluster..." -ForegroundColor Green
    $clusterName = (terraform output -raw cluster_name)
    aws eks update-kubeconfig --region $Region --name $clusterName

    Write-Host "`n✅ AWS EKS Cluster successfully created and connected!" -ForegroundColor Green
    kubectl get nodes
} else {
    Write-Host "`nDeployment cancelled by user. No resources were created." -ForegroundColor Yellow
}
