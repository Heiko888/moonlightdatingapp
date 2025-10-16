# Update Supabase Keys auf Hetzner
Write-Host "Update Supabase Keys auf Hetzner..." -ForegroundColor Cyan
Write-Host ""

$SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5qamN5d2dza3plcGlreXpoaWh5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjMyNjE1NiwiZXhwIjoyMDcxOTAyMTU2fQ.BZxq9k9ZOZmzTRRkpbk9tlpwt3k743VYEIovmsfs2Wo"

Write-Host "Erstelle .env.production auf Server..." -ForegroundColor Yellow

ssh root@138.199.237.34 @"
cd /opt/hd-app/HD_App_chart
cat > .env.production << 'EOF'
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://njjcywgskzepikyzhihy.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5qamN5d2dza3plcGlreXpoaWh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYzMjYxNTYsImV4cCI6MjA3MTkwMjE1Nn0.5eyIEMHJr10PjNbNyDokqqcvycgEUIgyHkjB5puQOFs
SUPABASE_SERVICE_ROLE_KEY=$SERVICE_ROLE_KEY
NODE_ENV=production
PORT=3000
EOF
echo '.env.production erstellt!'
"@

Write-Host ""
Write-Host "Starte Frontend-Container neu..." -ForegroundColor Yellow
ssh root@138.199.237.34 "docker restart hd_app_chart_frontend_1"

Write-Host ""
Write-Host "Warte 10 Sekunden..." -ForegroundColor Cyan
Start-Sleep -Seconds 10

Write-Host ""
Write-Host "Container Status:" -ForegroundColor Cyan
ssh root@138.199.237.34 "docker ps | grep frontend"

Write-Host ""
Write-Host "FERTIG!" -ForegroundColor Green
Write-Host "Die Datenbank sollte jetzt funktionieren!" -ForegroundColor Green
Write-Host ""
