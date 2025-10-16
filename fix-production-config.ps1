# Fix Production Docker-Compose Config
Write-Host "Fixing Production Config auf Hetzner..." -ForegroundColor Cyan

$productionConfig = @'
version: '3.8'

services:
  frontend:
    image: ghcr.io/heiko888/moonlightdatingapp:main
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
      - HOSTNAME=0.0.0.0
    env_file:
      - .env.production
    restart: unless-stopped
    depends_on:
      - grafana
      - prometheus

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/ssl:/etc/nginx/ssl:ro
      - /etc/letsencrypt:/etc/letsencrypt:ro
    depends_on:
      - frontend
      - grafana
      - prometheus
    restart: unless-stopped

  grafana:
    image: grafana/grafana:latest
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=${GRAFANA_PASSWORD:-admin123}
      - GF_USERS_ALLOW_SIGN_UP=false
    volumes:
      - grafana-storage:/var/lib/grafana
      - ./grafana/dashboards:/etc/grafana/provisioning/dashboards:ro
      - ./grafana/datasources:/etc/grafana/provisioning/datasources:ro
    restart: unless-stopped

  prometheus:
    image: prom/prometheus:latest
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml:ro
      - ./prometheus:/etc/prometheus/rules:ro
      - prometheus-storage:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
    restart: unless-stopped

  node-exporter:
    image: prom/node-exporter:latest
    ports:
      - "9100:9100"
    restart: unless-stopped

  alertmanager:
    image: prom/alertmanager:latest
    ports:
      - "9093:9093"
    restart: unless-stopped

  redis:
    image: redis:alpine
    ports:
      - "6379:6379"
    restart: unless-stopped

volumes:
  grafana-storage:
  prometheus-storage:
'@

# Upload config
$tempFile = New-TemporaryFile
$productionConfig | Out-File -FilePath $tempFile.FullName -Encoding UTF8 -NoNewline
scp $tempFile.FullName root@138.199.237.34:/opt/hd-app/HD_App_chart/docker-compose.supabase.yml
Remove-Item $tempFile.FullName

Write-Host "Config hochgeladen! Starte Services neu..." -ForegroundColor Yellow
ssh root@138.199.237.34 "cd /opt/hd-app/HD_App_chart && docker-compose -f docker-compose.supabase.yml down && docker-compose -f docker-compose.supabase.yml up -d"

Write-Host "`nWarte 20 Sekunden..." -ForegroundColor Cyan
Start-Sleep -Seconds 20

Write-Host "`nPrüfe Status..." -ForegroundColor Cyan
ssh root@138.199.237.34 "docker ps"

Write-Host "`nFERTIG!" -ForegroundColor Green

