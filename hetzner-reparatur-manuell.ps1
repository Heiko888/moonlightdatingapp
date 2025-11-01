# Manuelle Hetzner-Reparatur mit ausführlicher Ausgabe
$server = "root@138.199.237.34"
$path = "/opt/hd-app/HD_App_chart"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  HETZNER SERVER REPARATUR (MANUELL)" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "SCHRITT 1: Git Pull..." -ForegroundColor Yellow
$result1 = ssh $server "cd $path && git pull origin main 2>&1"
Write-Host $result1

Write-Host ""
Write-Host "SCHRITT 2: Aktuelle docker-compose.yml prüfen..." -ForegroundColor Yellow
$result2 = ssh $server "cd $path && grep -A3 'nginx:' docker-compose.supabase.yml | head -5"
Write-Host $result2

Write-Host ""
Write-Host "SCHRITT 3: Container stoppen..." -ForegroundColor Yellow
$result3 = ssh $server "cd $path && docker compose -f docker-compose.supabase.yml down 2>&1"
Write-Host $result3

Write-Host ""
Write-Host "SCHRITT 4: Container neu starten..." -ForegroundColor Yellow
$result4 = ssh $server "cd $path && docker compose -f docker-compose.supabase.yml up -d 2>&1"
Write-Host $result4

Write-Host ""
Write-Host "SCHRITT 5: Warten 20 Sekunden..." -ForegroundColor Yellow
Start-Sleep -Seconds 20

Write-Host ""
Write-Host "SCHRITT 6: Container Status..." -ForegroundColor Yellow
$result5 = ssh $server "cd $path && docker compose -f docker-compose.supabase.yml ps"
Write-Host $result5

Write-Host ""
Write-Host "SCHRITT 7: Nginx Logs (letzte 20 Zeilen)..." -ForegroundColor Yellow
$result6 = ssh $server "cd $path && docker compose -f docker-compose.supabase.yml logs --tail=20 nginx 2>&1"
Write-Host $result6

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  REPARATUR ABGESCHLOSSEN" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

