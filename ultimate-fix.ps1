# ULTIMATE FIX - Komplette Neuinstallation
$server = "root@138.199.237.34"
$path = "/opt/hd-app/HD_App_chart"

Write-Host "================================================" -ForegroundColor Red
Write-Host "  ULTIMATE FIX - KOMPLETTE NEUINSTALLATION" -ForegroundColor Red
Write-Host "================================================" -ForegroundColor Red
Write-Host ""
Write-Host "Dies wird:" -ForegroundColor Yellow
Write-Host "  - Alle Container stoppen und löschen" -ForegroundColor White
Write-Host "  - Neuesten Code pullen" -ForegroundColor White
Write-Host "  - Dependencies neu installieren" -ForegroundColor White
Write-Host "  - Environment-Variablen setzen" -ForegroundColor White
Write-Host "  - Alles neu bauen und starten" -ForegroundColor White
Write-Host ""
Write-Host "Dauer: ca. 15-20 Minuten" -ForegroundColor Yellow
Write-Host ""

# SCHRITT 1: Alles stoppen und aufräumen
Write-Host "SCHRITT 1/8: Stoppe alle Container..." -ForegroundColor Cyan
ssh $server "cd $path && docker-compose -f docker-compose.supabase.yml down -v --remove-orphans"
Write-Host "✓ Container gestoppt" -ForegroundColor Green
Write-Host ""

# SCHRITT 2: Git Pull
Write-Host "SCHRITT 2/8: Pull neuesten Code..." -ForegroundColor Cyan
ssh $server "cd $path && git fetch origin && git reset --hard origin/main"
Write-Host "✓ Code aktualisiert" -ForegroundColor Green
Write-Host ""

# SCHRITT 3: Environment-Variablen
Write-Host "SCHRITT 3/8: Setze Environment-Variablen..." -ForegroundColor Cyan
ssh $server "cd $path && cp -f env.production .env"
ssh $server "cd $path && cat .env | head -5"
Write-Host "✓ .env erstellt" -ForegroundColor Green
Write-Host ""

# SCHRITT 4: Node Modules löschen
Write-Host "SCHRITT 4/8: Lösche alte node_modules..." -ForegroundColor Cyan
ssh $server "cd $path/frontend && rm -rf node_modules package-lock.json .next"
Write-Host "✓ Alte Builds gelöscht" -ForegroundColor Green
Write-Host ""

# SCHRITT 5: Dependencies installieren
Write-Host "SCHRITT 5/8: Installiere Dependencies (3-5 Min)..." -ForegroundColor Cyan
ssh $server "cd $path/frontend && npm install 2>&1 | tail -10"
Write-Host "✓ Dependencies installiert" -ForegroundColor Green
Write-Host ""

# SCHRITT 6: Docker Images aufräumen
Write-Host "SCHRITT 6/8: Räume alte Docker Images auf..." -ForegroundColor Cyan
ssh $server "docker system prune -f"
Write-Host "✓ Docker aufgeräumt" -ForegroundColor Green
Write-Host ""

# SCHRITT 7: Neu bauen (das dauert!)
Write-Host "SCHRITT 7/8: Baue Frontend neu (10-15 Min)..." -ForegroundColor Cyan
Write-Host "Bitte warten..." -ForegroundColor Yellow
$buildResult = ssh $server "cd $path && docker-compose -f docker-compose.supabase.yml build --no-cache frontend 2>&1"

if ($buildResult -match "ERROR|error|failed") {
    Write-Host "❌ BUILD FEHLER!" -ForegroundColor Red
    Write-Host $buildResult | Select-String "error|ERROR|failed" | Select-Object -First 20
    exit 1
} else {
    Write-Host "✓ Frontend gebaut" -ForegroundColor Green
}
Write-Host ""

# SCHRITT 8: Starte alles
Write-Host "SCHRITT 8/8: Starte alle Services..." -ForegroundColor Cyan
ssh $server "cd $path && docker-compose -f docker-compose.supabase.yml up -d"
Write-Host "✓ Services gestartet" -ForegroundColor Green
Write-Host ""

# Warte und prüfe
Write-Host "Warte 15 Sekunden für Service-Start..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

Write-Host ""
Write-Host "FINAL CHECK:" -ForegroundColor Cyan
ssh $server "cd $path && docker-compose -f docker-compose.supabase.yml ps"
Write-Host ""

Write-Host "================================================" -ForegroundColor Green
Write-Host "  ✅ INSTALLATION ABGESCHLOSSEN!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green
Write-Host ""
Write-Host "Teste die App: http://138.199.237.34:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Falls Probleme:" -ForegroundColor Yellow
Write-Host "  1. Öffne http://138.199.237.34:3000" -ForegroundColor White
Write-Host "  2. Drücke F12 für Developer Tools" -ForegroundColor White
Write-Host "  3. Schau in die Console für Fehler" -ForegroundColor White
Write-Host "  4. Sende mir die Fehlermeldung" -ForegroundColor White

