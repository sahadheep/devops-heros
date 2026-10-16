# ==============================================================================
# HelpDesk Pro — Automated AWS Cloud Teardown (Avoid Charges)
# ==============================================================================
$ErrorActionPreference = "Stop"

Write-Host "==================================================================" -ForegroundColor Red
Write-Host " HelpDesk Pro: Automated AWS Infrastructure Teardown" -ForegroundColor Red
Write-Host "==================================================================" -ForegroundColor Red

$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

$confirm = Read-Host "Are you SURE you want to DESTROY all AWS VPC & EKS resources to stop billing? (yes/no)"

if ($confirm.ToLower() -eq "yes") {
    Write-Host "`nDestroying AWS resources cleanly..." -ForegroundColor Yellow
    terraform destroy -auto-approve
    Write-Host "`n✅ All AWS resources successfully deleted. You will not be billed further." -ForegroundColor Green
} else {
    Write-Host "`nTeardown cancelled. Resources remain active in AWS." -ForegroundColor Cyan
}
