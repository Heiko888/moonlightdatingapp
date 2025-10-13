# HETZNER SERVER CLEANUP SCRIPT

$ServerIP = "138.199.237.34"
$Username = "root"

Write-Host ""
Write-Host "HETZNER SERVER CLEANUP" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

# 1. Aktueller Status
Write-Host ""
Write-Host "Aktueller Speicher-Status:" -ForegroundColor Yellow
ssh $Username@$ServerIP "df -h / | tail -1"

# 2. Docker System Info
Write-Host ""
Write-Host "Docker Speicher-Nutzung:" -ForegroundColor Yellow
ssh $Username@$ServerIP "docker system df"

# 3. Ungenutzte Docker Volumes löschen
Write-Host ""
Write-Host "Lösche ungenutzte Docker Volumes..." -ForegroundColor Yellow
ssh $Username@$ServerIP "docker volume prune -f"

# 4. Docker Build Cache löschen
Write-Host ""
Write-Host "Lösche Docker Build Cache..." -ForegroundColor Yellow
ssh $Username@$ServerIP "docker builder prune -af"

# 5. Ungenutzte Docker Images löschen
Write-Host ""
Write-Host "Lösche ungenutzte Docker Images..." -ForegroundColor Yellow
ssh $Username@$ServerIP "docker image prune -af"

# 6. Alte Container löschen
Write-Host ""
Write-Host "Lösche gestoppte Container..." -ForegroundColor Yellow
ssh $Username@$ServerIP "docker container prune -f"

# 7. Alte Networks löschen
Write-Host ""
Write-Host "Lösche ungenutzte Networks..." -ForegroundColor Yellow
ssh $Username@$ServerIP "docker network prune -f"

# 8. Logs rotieren
Write-Host ""
Write-Host "Rotiere System-Logs..." -ForegroundColor Yellow
ssh $Username@$ServerIP "journalctl --vacuum-time=7d"

# 9. APT Cache leeren
Write-Host ""
Write-Host "Leere APT Cache..." -ForegroundColor Yellow
ssh $Username@$ServerIP "apt-get clean; apt-get autoclean"

# 10. Neuer Status
Write-Host ""
Write-Host "Neuer Speicher-Status:" -ForegroundColor Green
ssh $Username@$ServerIP "df -h / | tail -1"

Write-Host ""
Write-Host "Neue Docker Speicher-Nutzung:" -ForegroundColor Green
ssh $Username@$ServerIP "docker system df"

Write-Host ""
Write-Host "CLEANUP ABGESCHLOSSEN!" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green
