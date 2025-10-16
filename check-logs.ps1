# Check Server Logs
$server = "root@138.199.237.34"

Write-Host "Checking Docker container logs..." -ForegroundColor Yellow
Write-Host ""

# Get container name
Write-Host "=== Docker Containers ===" -ForegroundColor Cyan
ssh $server "docker ps -a | grep frontend"
Write-Host ""

# Get logs
Write-Host "=== Frontend Logs (last 100 lines) ===" -ForegroundColor Cyan
ssh $server "docker logs hd_app_chart_frontend_1 --tail 100 2>&1" | Out-File -FilePath "frontend-logs.txt"

Write-Host "Logs saved to: frontend-logs.txt" -ForegroundColor Green
Write-Host ""
Write-Host "Opening log file..." -ForegroundColor Yellow
notepad frontend-logs.txt

