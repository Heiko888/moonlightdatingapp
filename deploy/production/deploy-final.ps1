# ===========================================
# FINALES DEPLOYMENT - STATISCHE DATEIEN
# ===========================================

$ServerIP = "138.199.237.34"
$Username = "root"
# $ServerPath = "/opt/hd-app"  # Currently unused

Write-Host "🚀 Finales Deployment - Statische Dateien" -ForegroundColor Blue

# 1. Frontend lokal bauen (mit Environment-Variablen)
Write-Host "🔧 Frontend lokal bauen..." -ForegroundColor Yellow
Set-Location frontend
$env:NEXT_PUBLIC_SUPABASE_URL = "https://njjcywgskzepikyzhihy.supabase.co"
$env:NEXT_PUBLIC_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5qamN5d2dza3plcGlreXpoaWh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYzMjYxNTYsImV4cCI6MjA3MTkwMjE1Nn0.5eyIEMHJr10PjNbNyDokqqcvycgEUIgyHkjB5puQOFs"
$env:STRIPE_SECRET_KEY = "sk_test_dummy_key_for_build"
$env:STRIPE_WEBHOOK_SECRET = "whsec_dummy_webhook_secret"

npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build fehlgeschlagen!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Build erfolgreich!" -ForegroundColor Green

# 2. Statische Dateien hochladen
Write-Host "📤 Statische Dateien hochladen..." -ForegroundColor Yellow
scp -r out root@138.199.237.34:/opt/hd-app/

# 3. Nginx-Konfiguration erstellen
Write-Host "🌐 Nginx-Konfiguration erstellen..." -ForegroundColor Yellow
ssh $Username@$ServerIP "cat > /etc/nginx/sites-available/hd-app << 'EOF'
server {
    listen 80;
    server_name _;
    root /opt/hd-app/out;
    index index.html;

    location / {
        try_files \$uri \$uri.html \$uri/ =404;
    }

    location /api {
        return 404;
    }
}
EOF"

# 4. Nginx aktivieren
ssh $Username@$ServerIP "ln -sf /etc/nginx/sites-available/hd-app /etc/nginx/sites-enabled/ && rm -f /etc/nginx/sites-enabled/default && nginx -t && systemctl reload nginx"

Write-Host ""
Write-Host "✅ Deployment abgeschlossen!" -ForegroundColor Green
Write-Host "🌐 Ihre App ist verfügbar unter: http://$ServerIP" -ForegroundColor Cyan
Write-Host "📊 Grafana: http://$ServerIP:3001" -ForegroundColor Cyan
Write-Host "📈 Prometheus: http://$ServerIP:9090" -ForegroundColor Cyan
