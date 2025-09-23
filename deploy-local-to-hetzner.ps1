# ===========================================
# HD APP - LOKALE ÄNDERUNGEN AUF HETZNER DEPLOYEN
# ===========================================

param(
    [string]$ServerIP = "138.199.237.34",
    [string]$Username = "root",
    [string]$ServerPath = "/opt/hd-app/HD_App_chart"
)

Write-Host "HD App - Lokale Änderungen auf Hetzner Server deployen" -ForegroundColor Blue
Write-Host "Server: $ServerIP" -ForegroundColor Cyan
Write-Host "Benutzer: $Username" -ForegroundColor Cyan
Write-Host "Pfad: $ServerPath" -ForegroundColor Cyan
Write-Host ""

# SSH und SCP Befehle
$sshCmd = "ssh"
$scpCmd = "scp"

# Prüfe ob SSH-Verbindung funktioniert
Write-Host "Prüfe SSH-Verbindung..." -ForegroundColor Yellow
try {
    & $sshCmd -o ConnectTimeout=10 $Username@$ServerIP "echo 'SSH-Verbindung erfolgreich'"
    Write-Host "SSH-Verbindung erfolgreich" -ForegroundColor Green
} catch {
    Write-Host "SSH-Verbindung fehlgeschlagen. Bitte prüfen Sie:" -ForegroundColor Red
    Write-Host "   - Server-IP: $ServerIP" -ForegroundColor White
    Write-Host "   - Benutzername: $Username" -ForegroundColor White
    Write-Host "   - SSH-Key oder Passwort" -ForegroundColor White
    exit 1
}

# 1. Git-Status prüfen
Write-Host "📋 Prüfe lokale Git-Änderungen..." -ForegroundColor Yellow
$gitStatus = git status --porcelain
if ($gitStatus) {
    Write-Host "📝 Gefundene Änderungen:" -ForegroundColor Cyan
    $gitStatus | ForEach-Object { Write-Host "   $_" -ForegroundColor White }
    Write-Host ""
    
    # Änderungen committen
    $commitMessage = Read-Host "💬 Commit-Nachricht eingeben (oder Enter für 'Deploy to Hetzner')"
    if ([string]::IsNullOrWhiteSpace($commitMessage)) {
        $commitMessage = "Deploy to Hetzner - $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
    }
    
    Write-Host "💾 Committe Änderungen..." -ForegroundColor Yellow
    git add .
    git commit -m $commitMessage
    
    # Push zu Repository (falls vorhanden)
    Write-Host "📤 Pushe zu Repository..." -ForegroundColor Yellow
    try {
        git push origin main
        Write-Host "✅ Änderungen gepusht" -ForegroundColor Green
    } catch {
        Write-Host "⚠️  Push fehlgeschlagen (lokales Repository?)" -ForegroundColor Yellow
    }
} else {
    Write-Host "✅ Keine lokalen Änderungen gefunden" -ForegroundColor Green
}

# 2. Server-Verzeichnis vorbereiten
Write-Host "📁 Bereite Server-Verzeichnis vor..." -ForegroundColor Yellow
& $sshCmd $Username@$ServerIP "mkdir -p $ServerPath"

# 3. Wichtige Dateien und Verzeichnisse definieren
$filesToUpload = @(
    # Konfigurationsdateien
    "package.json",
    "docker-compose.supabase.yml",
    "env.supabase",
    "deploy-hetzner.sh",
    "ENTWICKLUNGS-UMGEBUNGEN.md",
    
    # Backend-Dateien
    "backend/package.json",
    "backend/env.local",
    "backend/src/server-local.ts",
    "backend/src/server-supabase.ts",
    
    # Frontend-Dateien
    "frontend/package.json",
    "frontend/env.local",
    "frontend/next.config.ts",
    "frontend/postcss.config.mjs",
    "frontend/tailwind.config.js"
)

$directoriesToUpload = @(
    # Backend-Verzeichnisse
    "backend/src",
    "backend/data",
    "backend/routes",
    "backend/lib",
    "backend/middleware",
    "backend/models",
    "backend/monitoring",
    "backend/websocket",
    "backend/services",
    "backend/utils",
    
    # Frontend-Verzeichnisse
    "frontend/app",
    "frontend/components",
    "frontend/lib",
    "frontend/hooks",
    "frontend/models",
    "frontend/types",
    "frontend/styles",
    
    # Monitoring
    "grafana",
    "prometheus",
    "alertmanager"
)

# 4. Dateien übertragen
Write-Host "📤 Übertrage Dateien..." -ForegroundColor Yellow
foreach ($file in $filesToUpload) {
    if (Test-Path $file) {
        Write-Host "   📄 $file" -ForegroundColor Gray
        & $scpCmd $file $Username@$ServerIP`:$ServerPath/
    } else {
        Write-Host "   ⚠️  $file nicht gefunden" -ForegroundColor Yellow
    }
}

# 5. Verzeichnisse übertragen
Write-Host "📁 Übertrage Verzeichnisse..." -ForegroundColor Yellow
foreach ($dir in $directoriesToUpload) {
    if (Test-Path $dir) {
        Write-Host "   📁 $dir" -ForegroundColor Gray
        & $scpCmd -r $dir $Username@$ServerIP`:$ServerPath/
    } else {
        Write-Host "   ⚠️  $dir nicht gefunden" -ForegroundColor Yellow
    }
}

# 6. Server-seitige Vorbereitung
Write-Host "🔧 Bereite Server vor..." -ForegroundColor Yellow
& $sshCmd $Username@$ServerIP @"
cd $ServerPath
chmod +x deploy-hetzner.sh
chmod +x *.sh
"@

# 7. Docker-Container stoppen (falls laufend)
Write-Host "🛑 Stoppe laufende Container..." -ForegroundColor Yellow
& $sshCmd $Username@$ServerIP @"
cd $ServerPath
docker-compose -f docker-compose.supabase.yml down 2>/dev/null || true
"@

# 8. Environment-Datei prüfen
Write-Host "⚙️  Prüfe Environment-Konfiguration..." -ForegroundColor Yellow
& $sshCmd $Username@$ServerIP @"
cd $ServerPath
if [ ! -f .env ]; then
    echo '📝 Erstelle .env aus env.supabase...'
    cp env.supabase .env
    echo '✅ .env erstellt'
else
    echo '✅ .env bereits vorhanden'
fi
"@

# 9. Services neu starten
Write-Host "🚀 Starte Services neu..." -ForegroundColor Yellow
& $sshCmd $Username@$ServerIP @"
cd $ServerPath
echo '🐳 Baue Docker-Images neu...'
docker-compose -f docker-compose.supabase.yml build --no-cache

echo '🚀 Starte Services...'
docker-compose -f docker-compose.supabase.yml up -d

echo '⏳ Warte auf Services...'
sleep 30

echo '🔍 Prüfe Service-Status...'
docker-compose -f docker-compose.supabase.yml ps
"@

# 10. Health Check
Write-Host "🏥 Führe Health Check durch..." -ForegroundColor Yellow
& $sshCmd $Username@$ServerIP @"
cd $ServerPath
echo '🔍 Prüfe Frontend...'
curl -f http://localhost:3000 > /dev/null 2>&1 && echo '✅ Frontend: OK' || echo '❌ Frontend: Fehler'

echo '🔍 Prüfe Backend...'
curl -f http://localhost:4001/health > /dev/null 2>&1 && echo '✅ Backend: OK' || echo '❌ Backend: Fehler'

echo '🔍 Prüfe Grafana...'
curl -f http://localhost:3001 > /dev/null 2>&1 && echo '✅ Grafana: OK' || echo '❌ Grafana: Fehler'
"@

# 11. Zusammenfassung
Write-Host ""
Write-Host "🎉 Deployment abgeschlossen!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Service-URLs:" -ForegroundColor Cyan
Write-Host "   • Hauptanwendung: http://$ServerIP" -ForegroundColor White
Write-Host "   • Backend API: http://$ServerIP:4001" -ForegroundColor White
Write-Host "   • Grafana: http://$ServerIP:3001" -ForegroundColor White
Write-Host "   • Prometheus: http://$ServerIP:9090" -ForegroundColor White
Write-Host ""
Write-Host "🔧 Nützliche Befehle:" -ForegroundColor Cyan
Write-Host "   • Logs anzeigen: ssh $Username@$ServerIP 'cd $ServerPath && docker-compose -f docker-compose.supabase.yml logs -f'" -ForegroundColor White
Write-Host "   • Status prüfen: ssh $Username@$ServerIP 'cd $ServerPath && docker-compose -f docker-compose.supabase.yml ps'" -ForegroundColor White
Write-Host "   • Services stoppen: ssh $Username@$ServerIP 'cd $ServerPath && docker-compose -f docker-compose.supabase.yml down'" -ForegroundColor White
Write-Host "   • Services starten: ssh $Username@$ServerIP 'cd $ServerPath && docker-compose -f docker-compose.supabase.yml up -d'" -ForegroundColor White
Write-Host ""
Write-Host "📝 Environment-Datei bearbeiten:" -ForegroundColor Cyan
Write-Host "   ssh $Username@$ServerIP 'cd $ServerPath && nano .env'" -ForegroundColor White
Write-Host ""
Write-Host "✅ Alle lokalen Änderungen wurden erfolgreich auf den Hetzner-Server übertragen!" -ForegroundColor Green
