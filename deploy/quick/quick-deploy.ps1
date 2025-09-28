# ===========================================
# HD APP - QUICK DEPLOYMENT
# ===========================================

$ServerIP = "138.199.237.34"
$Username = "root"
$ServerPath = "/opt/hd-app/HD_App_chart"

Write-Host "🚀 HD App - Quick Deployment" -ForegroundColor Blue
Write-Host "Server: $ServerIP" -ForegroundColor Cyan
Write-Host ""

# Alle Befehle in einem Array
$commands = @(
    "ssh $Username@$ServerIP 'echo \"SSH-Verbindung erfolgreich\"'",
    "ssh $Username@$ServerIP 'mkdir -p $ServerPath'",
    "scp docker-compose.supabase.yml $Username@$ServerIP`:$ServerPath/",
    "scp env.supabase $Username@$ServerIP`:$ServerPath/",
    "scp package.json $Username@$ServerIP`:$ServerPath/",
    "scp -r backend $Username@$ServerIP`:$ServerPath/",
    "scp -r frontend $Username@$ServerIP`:$ServerPath/",
    "scp -r grafana $Username@$ServerIP`:$ServerPath/",
    "scp -r prometheus $Username@$ServerIP`:$ServerPath/",
    "ssh $Username@$ServerIP 'cd $ServerPath && chmod +x *.sh 2>/dev/null || true'",
    "ssh $Username@$ServerIP 'cd $ServerPath && docker-compose -f docker-compose.supabase.yml down 2>/dev/null || true'",
    "ssh $Username@$ServerIP 'cd $ServerPath && if [ ! -f .env ]; then cp env.supabase .env; fi'",
    "ssh $Username@$ServerIP 'cd $ServerPath && docker-compose -f docker-compose.supabase.yml build --no-cache'",
    "ssh $Username@$ServerIP 'cd $ServerPath && docker-compose -f docker-compose.supabase.yml up -d'",
    "ssh $Username@$ServerIP 'cd $ServerPath && docker-compose -f docker-compose.supabase.yml ps'"
)

Write-Host "📋 Führen Sie diese Befehle nacheinander aus:" -ForegroundColor Yellow
Write-Host ""

for ($i = 0; $i -lt $commands.Length; $i++) {
    $step = $i + 1
    Write-Host "$step. $($commands[$i])" -ForegroundColor White
    Write-Host ""
}

Write-Host "📋 Nach dem Deployment:" -ForegroundColor Cyan
Write-Host "   • Hauptanwendung: http://$ServerIP" -ForegroundColor White
Write-Host "   • Backend API: http://$ServerIP:4001" -ForegroundColor White
Write-Host "   • Grafana: http://$ServerIP:3001" -ForegroundColor White
Write-Host "   • Prometheus: http://$ServerIP:9090" -ForegroundColor White
Write-Host ""

Write-Host "✅ Kopieren Sie die Befehle und führen Sie sie in Ihrem Terminal aus!" -ForegroundColor Green
