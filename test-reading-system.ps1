# ==========================================
# READING SYSTEM TEST
# ==========================================

Write-Host "`n📋 READING SYSTEM - SCHRITT FÜR SCHRITT TEST" -ForegroundColor Cyan
Write-Host "=========================================`n" -ForegroundColor Cyan

# Schritt 1: Container neu starten
Write-Host "Schritt 1: Container neu starten..." -ForegroundColor Yellow
docker-compose -f docker-compose.dev-3005.yml restart

Write-Host "`nWarte 15 Sekunden auf Neustart...`n" -ForegroundColor White
Start-Sleep -Seconds 15

# Schritt 2: Prüfe ob Container läuft
Write-Host "Schritt 2: Container-Status..." -ForegroundColor Yellow
docker ps | Select-String "hd-app-frontend-dev-3005"

# Schritt 3: Zeige aktuelle Logs
Write-Host "`nSchritt 3: Aktuelle Logs (letzte 20 Zeilen)..." -ForegroundColor Yellow
docker logs hd-app-frontend-dev-3005 --tail 20

# Schritt 4: Teste die Seiten
Write-Host "`n`nSchritt 4: Öffne Browser-Fenster..." -ForegroundColor Yellow
Write-Host "  → Reading-Seite wird geöffnet..." -ForegroundColor White
Start-Sleep -Seconds 2
start http://localhost:3005/reading

Write-Host "`n✅ FERTIG!" -ForegroundColor Green
Write-Host "=========================================`n" -ForegroundColor Green

Write-Host "📍 Was du jetzt tun sollst:`n" -ForegroundColor Cyan
Write-Host "1. Im Browser (der sich gerade öffnete):" -ForegroundColor White
Write-Host "   - Drücke F5 (Seite neu laden)" -ForegroundColor White
Write-Host "   - Klicke auf [Reading starten]" -ForegroundColor White
Write-Host "   - Fülle das Formular aus" -ForegroundColor White
Write-Host "   - Klicke [Anfrage abschicken]" -ForegroundColor White
Write-Host ""
Write-Host "2. Was sollte passieren:" -ForegroundColor White
Write-Host "   ✓ Formular wird abgeschickt" -ForegroundColor Green
Write-Host "   ✓ Weiterleitung zu /reading/next-steps" -ForegroundColor Green
Write-Host "   ✓ Erklärung wie es weiter geht" -ForegroundColor Green
Write-Host ""
Write-Host "3. Falls es NICHT funktioniert:" -ForegroundColor Yellow
Write-Host "   - Drücke F12 (Browser-Konsole öffnen)" -ForegroundColor White
Write-Host "   - Schaue nach Fehlermeldungen (rot)" -ForegroundColor White
Write-Host "   - Sag mir was dort steht" -ForegroundColor White
Write-Host ""

