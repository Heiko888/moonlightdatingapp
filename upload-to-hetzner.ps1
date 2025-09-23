# PowerShell Script zum Upload der HD App auf Hetzner Server
# Verwendung: .\upload-to-hetzner.ps1 -ServerIP "138.199.237.34" -Username "root"

param(
    [Parameter(Mandatory=$true)]
    [string]$ServerIP,
    
    [Parameter(Mandatory=$false)]
    [string]$Username = "root",
    
    [Parameter(Mandatory=$false)]
    [string]$KeyPath = ""
)

Write-Host "🚀 HD App Upload auf Hetzner Server gestartet..." -ForegroundColor Blue

# SSH Key prüfen
if ($KeyPath -ne "") {
    $sshCmd = "ssh -i $KeyPath"
    $scpCmd = "scp -i $KeyPath"
} else {
    $sshCmd = "ssh"
    $scpCmd = "scp"
}

# Verbindung testen
Write-Host "🔍 Verbindung zum Server wird getestet..." -ForegroundColor Yellow
try {
    & $sshCmd $Username@$ServerIP "echo 'Verbindung erfolgreich'"
    Write-Host "✅ Verbindung erfolgreich!" -ForegroundColor Green
} catch {
    Write-Host "❌ Verbindung fehlgeschlagen! Bitte prüfen Sie:" -ForegroundColor Red
    Write-Host "   - Server IP: $ServerIP" -ForegroundColor Red
    Write-Host "   - Username: $Username" -ForegroundColor Red
    Write-Host "   - SSH Key: $KeyPath" -ForegroundColor Red
    exit 1
}

# Wichtige Dateien auflisten
$filesToUpload = @(
    "docker-compose.supabase.yml",
    "env.supabase",
    "deploy-hetzner.sh",
    "HETZNER-DEPLOYMENT.md"
)

# Verzeichnisse auflisten
$directoriesToUpload = @(
    "backend",
    "frontend",
    "grafana",
    "prometheus"
)

Write-Host "📁 Dateien werden auf den Server übertragen..." -ForegroundColor Blue

# App Verzeichnis auf Server erstellen
& $sshCmd $Username@$ServerIP "mkdir -p /opt/hd-app/HD_App_chart"

# Einzelne Dateien übertragen
foreach ($file in $filesToUpload) {
    if (Test-Path $file) {
        Write-Host "   📄 $file wird übertragen..." -ForegroundColor Yellow
        & $scpCmd $file $Username@$ServerIP`:/opt/hd-app/HD_App_chart/
    } else {
        Write-Host "   ⚠️  $file nicht gefunden, übersprungen" -ForegroundColor Yellow
    }
}

# Verzeichnisse übertragen
foreach ($dir in $directoriesToUpload) {
    if (Test-Path $dir) {
        Write-Host "   📁 $dir wird übertragen..." -ForegroundColor Yellow
        & $scpCmd -r $dir $Username@$ServerIP`:/opt/hd-app/HD_App_chart/
    } else {
        Write-Host "   ⚠️  $dir nicht gefunden, übersprungen" -ForegroundColor Yellow
    }
}

# Deployment Script ausführbar machen
Write-Host "🔧 Deployment Script wird vorbereitet..." -ForegroundColor Blue
& $sshCmd $Username@$ServerIP "chmod +x /opt/hd-app/HD_App_chart/deploy-hetzner.sh"

Write-Host "✅ Upload abgeschlossen!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Nächste Schritte:" -ForegroundColor Cyan
Write-Host "1. Auf den Server einloggen:" -ForegroundColor White
Write-Host "   ssh $Username@$ServerIP" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Deployment starten:" -ForegroundColor White
Write-Host "   cd /opt/hd-app/HD_App_chart" -ForegroundColor Gray
Write-Host "   ./deploy-hetzner.sh" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Environment konfigurieren:" -ForegroundColor White
Write-Host "   nano .env" -ForegroundColor Gray
Write-Host ""
Write-Host "4. Services starten:" -ForegroundColor White
Write-Host "   docker-compose -f docker-compose.supabase.yml up -d" -ForegroundColor Gray
Write-Host ""
Write-Host "🌐 Nach dem Deployment:" -ForegroundColor Cyan
Write-Host "   • Hauptanwendung: http://$ServerIP" -ForegroundColor White
Write-Host "   • Grafana: http://$ServerIP/grafana/" -ForegroundColor White
Write-Host "   • Prometheus: http://$ServerIP/prometheus/" -ForegroundColor White