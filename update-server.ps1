# ===========================================
# HD APP - SERVER UPDATE SCRIPT
# ===========================================

$ServerIP = "138.199.237.34"
$ServerPath = "/opt/hd-app/HD_App_chart"

Write-Host "🚀 HD App - Server Update" -ForegroundColor Blue
Write-Host "Server: $ServerIP" -ForegroundColor Cyan
Write-Host ""

# 1. Änderungen zum Server pushen
Write-Host "📤 Änderungen zum Server pushen..." -ForegroundColor Yellow
ssh -i ~/.ssh/hetzner_key root@$ServerIP "cd $ServerPath && git pull origin main"

# 2. Frontend neu bauen
Write-Host "🔨 Frontend neu bauen..." -ForegroundColor Yellow
ssh -i ~/.ssh/hetzner_key root@$ServerIP "cd $ServerPath/frontend; docker build -t hd-app-frontend:latest ."

# 3. Container neu starten
Write-Host "🔄 Container neu starten..." -ForegroundColor Yellow
ssh -i ~/.ssh/hetzner_key root@$ServerIP "docker stop hd-app-frontend 2>/dev/null; docker rm hd-app-frontend 2>/dev/null; pkill -f next-server 2>/dev/null"
ssh -i ~/.ssh/hetzner_key root@$ServerIP "docker run -d --name hd-app-frontend -p 3000:3000 -e NEXT_PUBLIC_SUPABASE_URL=https://njjcywgskzepikyzhihy.supabase.co -e NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5qamN5d2dza3plcGlreXpoaWh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYzMjYxNTYsImV4cCI6MjA3MTkwMjE1Nn0.5eyIEMHJr10PjNbNyDokqqcvycgEUIgyHkjB5puQOFs hd-app-frontend:latest"

# 4. Warten bis Container läuft
Write-Host "⏳ Warten bis Container läuft..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# 4. Status prüfen
Write-Host "✅ Status prüfen..." -ForegroundColor Yellow
ssh -i ~/.ssh/hetzner_key root@$ServerIP "docker ps | grep hd-app-frontend"

Write-Host ""
Write-Host "🎉 Update abgeschlossen!" -ForegroundColor Green
Write-Host "Frontend: http://$ServerIP:3000" -ForegroundColor White
Write-Host ""
