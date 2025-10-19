# ==========================================
# FIX HETZNER BUILD - AUTOMATISCH
# ==========================================

$HETZNER_IP = "138.199.237.34"

Write-Host "`n🚀 FIX HETZNER BUILD" -ForegroundColor Cyan
Write-Host "Server: $HETZNER_IP" -ForegroundColor Yellow
Write-Host "=========================================`n" -ForegroundColor Cyan

# 1. Skript auf Server kopieren
Write-Host "📤 Kopiere Skript auf Server..." -ForegroundColor Yellow
scp fix-hetzner-build.sh root@${HETZNER_IP}:/root/

if ($LASTEXITCODE -ne 0) {
    Write-Host "`n❌ Fehler beim Kopieren!" -ForegroundColor Red
    Write-Host "Pruefe SSH-Zugriff: ssh root@$HETZNER_IP" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Skript kopiert!`n" -ForegroundColor Green

# 2. Skript ausfuehrbar machen und ausfuehren
Write-Host "🔧 Fuehre Fix aus (dauert 3-5 Min)...`n" -ForegroundColor Yellow

ssh root@$HETZNER_IP @"
chmod +x /root/fix-hetzner-build.sh
/root/fix-hetzner-build.sh
"@

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ FIX ERFOLGREICH!" -ForegroundColor Green
    Write-Host "=========================================`n" -ForegroundColor Green
    
    Write-Host "🌐 Teste jetzt:" -ForegroundColor Cyan
    Write-Host "   http://$HETZNER_IP/reading" -ForegroundColor White
    Write-Host "   http://www.the-connection-key.de/reading" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host "`n❌ FEHLER beim Fix!" -ForegroundColor Red
    Write-Host "Pruefe Logs: ssh root@$HETZNER_IP 'docker-compose logs --tail=50'" -ForegroundColor Yellow
}

