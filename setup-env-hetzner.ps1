# Setup Environment Variables auf Hetzner
Write-Host "Setup Environment-Variablen auf Hetzner..." -ForegroundColor Cyan

$envContent = @'
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://njjcywgskzepikyzhihy.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5qamN5d2dza3plcGlreXpoaWh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYzMjYxNTYsImV4cCI6MjA3MTkwMjE1Nn0.5eyIEMHJr10PjNbNyDokqqcvycgEUIgyHkjB5puQOFs

# WICHTIG: SERVICE_ROLE_KEY muss manuell eingetragen werden!
# Gehe zu: https://supabase.com/dashboard/project/njjcywgskzepikyzhihy/settings/api
# Kopiere den "service_role" key
SUPABASE_SERVICE_ROLE_KEY=BITTE_EINTRAGEN

# OpenAI (optional)
OPENAI_API_KEY=OPTIONAL

# Node Environment
NODE_ENV=production
'@

# Erstelle temporäre Datei
$tempFile = [System.IO.Path]::GetTempFileName()
$envContent | Out-File -FilePath $tempFile -Encoding UTF8 -NoNewline

Write-Host "Lade .env Datei auf Server hoch..." -ForegroundColor Yellow
scp $tempFile root@138.199.237.34:/opt/hd-app/HD_App_chart/.env.production

Remove-Item $tempFile

Write-Host "`n✅ .env.production Datei erstellt!" -ForegroundColor Green
Write-Host "`n⚠️  WICHTIG:" -ForegroundColor Yellow
Write-Host "Du musst noch den SUPABASE_SERVICE_ROLE_KEY eintragen!" -ForegroundColor Yellow
Write-Host "`nSchritte:" -ForegroundColor Cyan
Write-Host "1. Gehe zu: https://supabase.com/dashboard/project/njjcywgskzepikyzhihy/settings/api" -ForegroundColor White
Write-Host "2. Kopiere den 'service_role' Key (NICHT den anon key!)" -ForegroundColor White
Write-Host "3. Führe dann aus:" -ForegroundColor White
Write-Host "   ssh root@138.199.237.34" -ForegroundColor Gray
Write-Host "   nano /opt/hd-app/HD_App_chart/.env.production" -ForegroundColor Gray
Write-Host "   # Ersetze BITTE_EINTRAGEN mit dem echten Key" -ForegroundColor Gray
Write-Host "   # Speichern: Strg+O, Enter, Strg+X" -ForegroundColor Gray
Write-Host "4. Container neu starten:" -ForegroundColor White
Write-Host "   docker restart hd_app_chart_frontend_1" -ForegroundColor Gray
Write-Host ""

