# Rebuild Container mit neuen Dateien

Write-Host "Stoppe Container..." -ForegroundColor Yellow
docker-compose -f docker-compose.dev-3005.yml down

Write-Host "Baue Container NEU (dauert 2-3 Min)..." -ForegroundColor Yellow
docker-compose -f docker-compose.dev-3005.yml up -d --build

Write-Host "Warte 30 Sekunden..." -ForegroundColor Yellow
Start-Sleep 30

Write-Host "Oeffne Browser..." -ForegroundColor Green
start http://localhost:3005/reading

Write-Host "`nFERTIG! Im Browser:" -ForegroundColor Green
Write-Host "1. Druecke STRG+SHIFT+R (Hard Refresh)" -ForegroundColor White
Write-Host "2. Klicke 'Reading starten'" -ForegroundColor White
Write-Host "3. Jetzt solltest du 9 Felder sehen!" -ForegroundColor White

