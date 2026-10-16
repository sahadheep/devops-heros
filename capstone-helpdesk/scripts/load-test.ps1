# HelpDesk Pro Load Test Script (PowerShell)
param (
    [string]$Url = "http://localhost:8000/api/tickets/stats",
    [int]$TotalRequests = 500
)

Write-Host "=================================================" -ForegroundColor Cyan
Write-Host "Starting HelpDesk Pro Load Generator" -ForegroundColor Cyan
Write-Host "Target URL: $Url" -ForegroundColor Gray
Write-Host "Requests:   $TotalRequests" -ForegroundColor Gray
Write-Host "=================================================" -ForegroundColor Cyan

$success = 0
$fail = 0

for ($i = 1; $i -le $TotalRequests; $i++) {
    try {
        $res = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 2
        if ($res.StatusCode -eq 200) { $success++ } else { $fail++ }
    } catch {
        $fail++
    }

    if ($i % 50 -eq 0) {
        Write-Host "Progress: $i / $TotalRequests requests sent (Success: $success, Failed: $fail)..." -ForegroundColor Yellow
    }
}

Write-Host "✅ Completed: $success successful, $fail failed." -ForegroundColor Green
