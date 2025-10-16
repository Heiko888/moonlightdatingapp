# Starte Services auf Hetzner
Write-Host "Starte Docker-Services auf Hetzner..." -ForegroundColor Cyan

ssh root@138.199.237.34 @'
cd /opt/hd-app/HD_App_chart
echo "Starting services..."
docker-compose -f docker-compose.supabase.yml up -d
echo ""
echo "Waiting 20 seconds..."
sleep 20
echo ""
echo "Container Status:"
docker ps
'@

Write-Host "`nServices gestartet!" -ForegroundColor Green

