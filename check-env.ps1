Write-Host "Prüfe Environment-Variablen auf Hetzner..." -ForegroundColor Cyan
ssh root@138.199.237.34 'cd /opt/hd-app/HD_App_chart && ls -la | grep env'
