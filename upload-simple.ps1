# Einfaches Upload Script für Hetzner Server
param(
    [string]$ServerIP = "138.199.237.34",
    [string]$Username = "root"
)

Write-Host "Upload zu Hetzner Server: $ServerIP" -ForegroundColor Blue

# Wichtige Dateien
$files = @(
    "docker-compose.supabase.yml",
    "env.supabase", 
    "deploy-hetzner.sh",
    "HETZNER-DEPLOYMENT.md"
)

# Verzeichnisse
$dirs = @(
    "backend",
    "frontend", 
    "grafana",
    "prometheus"
)

# Server Verzeichnis erstellen
ssh $Username@$ServerIP "mkdir -p /opt/hd-app/HD_App_chart"

# Dateien übertragen
foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "Uploading $file..." -ForegroundColor Yellow
        scp $file $Username@$ServerIP`:/opt/hd-app/HD_App_chart/
    }
}

# Verzeichnisse übertragen  
foreach ($dir in $dirs) {
    if (Test-Path $dir) {
        Write-Host "Uploading $dir..." -ForegroundColor Yellow
        scp -r $dir $Username@$ServerIP`:/opt/hd-app/HD_App_chart/
    }
}

# Script ausführbar machen
ssh $Username@$ServerIP "chmod +x /opt/hd-app/HD_App_chart/deploy-hetzner.sh"

Write-Host "Upload completed!" -ForegroundColor Green
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. ssh $Username@$ServerIP" -ForegroundColor White
Write-Host "2. cd /opt/hd-app/HD_App_chart" -ForegroundColor White  
Write-Host "3. ./deploy-hetzner.sh" -ForegroundColor White
