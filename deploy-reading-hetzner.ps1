# ===========================================
# READING SYSTEM - HETZNER DEPLOYMENT
# ===========================================

Write-Host "`n🚀 READING SYSTEM DEPLOYMENT FÜR HETZNER" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

# WICHTIG: Port-Hinweis
Write-Host "`n⚠️  WICHTIG: Port-Konfiguration" -ForegroundColor Yellow
Write-Host "   Port 3005 ist für Grafana reserviert (lt. Memory)" -ForegroundColor White
Write-Host "   Reading-System wird auf Port 3006 deployt" -ForegroundColor White
Write-Host ""

# 1. Frontend Build testen
Write-Host "`n1. Frontend Build testen..." -ForegroundColor Yellow
Set-Location -Path ".\frontend"

Write-Host "   Installiere Dependencies..." -ForegroundColor White
npm install

Write-Host "   Starte Build..." -ForegroundColor White
$env:NODE_OPTIONS = "--max-old-space-size=4096"
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "`n❌ BUILD FEHLGESCHLAGEN!" -ForegroundColor Red
    Write-Host "Mögliche Lösungen:" -ForegroundColor Yellow
    Write-Host "1. npm install --force" -ForegroundColor White
    Write-Host "2. Prüfe Fehler oben" -ForegroundColor White
    Write-Host "3. next.config.mjs prüfen" -ForegroundColor White
    Set-Location -Path ".."
    exit 1
}

Write-Host "   ✅ Build erfolgreich!" -ForegroundColor Green

# 2. Zurück zum Root
Set-Location -Path ".."

# 3. Docker-Compose für Reading erstellen
Write-Host "`n2. Docker-Compose für Reading erstellen..." -ForegroundColor Yellow

$dockerComposeContent = @"
version: '3.8'

services:
  # Reading System Frontend
  reading-frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
      args:
        - NODE_ENV=production
    container_name: hd-reading-frontend
    ports:
      - "3006:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
      - HOSTNAME=0.0.0.0
      - NEXT_TELEMETRY_DISABLED=1
      - NEXT_PUBLIC_SUPABASE_URL=`${NEXT_PUBLIC_SUPABASE_URL}
      - NEXT_PUBLIC_SUPABASE_ANON_KEY=`${NEXT_PUBLIC_SUPABASE_ANON_KEY}
      - SUPABASE_SERVICE_ROLE_KEY=`${SUPABASE_SERVICE_ROLE_KEY}
      - JWT_SECRET=`${JWT_SECRET}
      - EMAIL_API_KEY=`${EMAIL_API_KEY:-}
      - EMAIL_FROM=`${EMAIL_FROM:-noreply@humandesign.app}
      - COACH_EMAIL=`${COACH_EMAIL:-coach@humandesign.app}
    restart: unless-stopped
    networks:
      - reading-network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 60s

  # Nginx für Reading System
  reading-nginx:
    image: nginx:alpine
    container_name: hd-reading-nginx
    ports:
      - "8006:80"
    volumes:
      - ./nginx/nginx-reading.conf:/etc/nginx/nginx.conf:ro
    depends_on:
      - reading-frontend
    restart: unless-stopped
    networks:
      - reading-network

networks:
  reading-network:
    driver: bridge
"@

$dockerComposeContent | Out-File -FilePath "docker-compose.reading.yml" -Encoding utf8
Write-Host "   ✅ docker-compose.reading.yml erstellt" -ForegroundColor Green

# 4. Nginx Config für Reading erstellen
Write-Host "`n3. Nginx Config erstellen..." -ForegroundColor Yellow

$nginxConfig = @"
events {
    worker_connections 1024;
}

http {
    upstream reading_frontend {
        server reading-frontend:3000;
    }

    server {
        listen 80;
        server_name _;

        client_max_body_size 10M;

        location / {
            proxy_pass http://reading_frontend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade `$http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host `$host;
            proxy_cache_bypass `$http_upgrade;
            proxy_set_header X-Real-IP `$remote_addr;
            proxy_set_header X-Forwarded-For `$proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto `$scheme;
            
            # Timeouts erhöhen
            proxy_connect_timeout 60s;
            proxy_send_timeout 60s;
            proxy_read_timeout 60s;
        }

        # API Routes
        location /api/ {
            proxy_pass http://reading_frontend;
            proxy_http_version 1.1;
            proxy_set_header Host `$host;
            proxy_set_header X-Real-IP `$remote_addr;
            proxy_set_header X-Forwarded-For `$proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto `$scheme;
        }

        # Health Check
        location /health {
            access_log off;
            return 200 "healthy\n";
            add_header Content-Type text/plain;
        }
    }
}
"@

New-Item -Path ".\nginx" -ItemType Directory -Force | Out-Null
$nginxConfig | Out-File -FilePath ".\nginx\nginx-reading.conf" -Encoding utf8
Write-Host "   ✅ nginx-reading.conf erstellt" -ForegroundColor Green

# 5. Health Check API Route erstellen
Write-Host "`n4. Health Check API erstellen..." -ForegroundColor Yellow

$healthCheckContent = @"
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'reading-system'
  });
}
"@

New-Item -Path ".\frontend\app\api\health" -ItemType Directory -Force | Out-Null
$healthCheckContent | Out-File -FilePath ".\frontend\app\api\health\route.ts" -Encoding utf8
Write-Host "   ✅ Health Check API erstellt" -ForegroundColor Green

# 6. Docker Build & Deploy
Write-Host "`n5. Docker Build & Deploy..." -ForegroundColor Yellow

$deployChoice = Read-Host "Möchtest du jetzt das Docker-Image bauen und starten? (y/n)"

if ($deployChoice -eq "y" -or $deployChoice -eq "Y") {
    Write-Host "`n   Stoppe alte Container..." -ForegroundColor White
    docker-compose -f docker-compose.reading.yml down 2>$null

    Write-Host "`n   Baue Docker-Image (Das kann 5-10 Minuten dauern)..." -ForegroundColor White
    docker-compose -f docker-compose.reading.yml build --no-cache

    if ($LASTEXITCODE -ne 0) {
        Write-Host "`n❌ DOCKER BUILD FEHLGESCHLAGEN!" -ForegroundColor Red
        exit 1
    }

    Write-Host "`n   Starte Container..." -ForegroundColor White
    docker-compose -f docker-compose.reading.yml up -d

    Write-Host "`n   Warte 30 Sekunden auf Container-Start..." -ForegroundColor White
    Start-Sleep -Seconds 30

    Write-Host "`n6. Health Checks..." -ForegroundColor Yellow
    
    # Health Check
    Write-Host "   Reading Frontend (Port 3006)..." -ForegroundColor White
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:3006" -Method GET -TimeoutSec 10 -ErrorAction Stop
        if ($response.StatusCode -eq 200) {
            Write-Host "   ✅ Frontend: OK" -ForegroundColor Green
        }
    } catch {
        Write-Host "   ⚠️  Frontend: Noch nicht bereit (ist normal, braucht Zeit)" -ForegroundColor Yellow
    }

    Write-Host "   Nginx (Port 8006)..." -ForegroundColor White
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:8006" -Method GET -TimeoutSec 10 -ErrorAction Stop
        if ($response.StatusCode -eq 200) {
            Write-Host "   ✅ Nginx: OK" -ForegroundColor Green
        }
    } catch {
        Write-Host "   ⚠️  Nginx: Noch nicht bereit" -ForegroundColor Yellow
    }

    # Container Status
    Write-Host "`n7. Container Status..." -ForegroundColor Yellow
    docker-compose -f docker-compose.reading.yml ps

    # Logs anzeigen
    Write-Host "`n8. Letzte Logs (wenn Fehler, siehe hier)..." -ForegroundColor Yellow
    docker-compose -f docker-compose.reading.yml logs --tail=30

    Write-Host "`n✅ DEPLOYMENT ABGESCHLOSSEN!" -ForegroundColor Green
    Write-Host "=========================================" -ForegroundColor Green
    Write-Host "`n📍 Zugriff:" -ForegroundColor Cyan
    Write-Host "   • Reading System: http://localhost:3006/reading" -ForegroundColor White
    Write-Host "   • Coach Dashboard: http://localhost:3006/coach/dashboard" -ForegroundColor White
    Write-Host "   • Nginx: http://localhost:8006" -ForegroundColor White
    Write-Host ""
    Write-Host "⚠️  Hinweis:" -ForegroundColor Yellow
    Write-Host "   • Port 3005 = Grafana (bereits belegt)" -ForegroundColor White
    Write-Host "   • Port 3006 = Reading System (neu)" -ForegroundColor White
    Write-Host ""
    Write-Host "🔍 Debugging:" -ForegroundColor Cyan
    Write-Host "   • Logs: docker-compose -f docker-compose.reading.yml logs -f" -ForegroundColor White
    Write-Host "   • Status: docker-compose -f docker-compose.reading.yml ps" -ForegroundColor White
    Write-Host "   • Restart: docker-compose -f docker-compose.reading.yml restart" -ForegroundColor White
    Write-Host ""

} else {
    Write-Host "`n⏸️  Deployment abgebrochen" -ForegroundColor Yellow
    Write-Host "   Führe manuell aus:" -ForegroundColor White
    Write-Host "   docker-compose -f docker-compose.reading.yml build" -ForegroundColor White
    Write-Host "   docker-compose -f docker-compose.reading.yml up -d" -ForegroundColor White
}

# 9. Git Status
Write-Host "`n9. Neue Dateien..." -ForegroundColor Yellow
Write-Host "   Folgende Dateien wurden erstellt:" -ForegroundColor White
Write-Host "   - docker-compose.reading.yml" -ForegroundColor White
Write-Host "   - nginx/nginx-reading.conf" -ForegroundColor White
Write-Host "   - frontend/app/api/health/route.ts" -ForegroundColor White
Write-Host ""
Write-Host "   Möchtest du diese Dateien zu Git hinzufügen?" -ForegroundColor White
$gitChoice = Read-Host "   (y/n)"

if ($gitChoice -eq "y" -or $gitChoice -eq "Y") {
    git add docker-compose.reading.yml nginx/nginx-reading.conf frontend/app/api/health/route.ts
    Write-Host "   ✅ Dateien zu Git hinzugefügt" -ForegroundColor Green
    Write-Host "   Committe mit: git commit -m 'Add Reading System deployment'" -ForegroundColor White
}

Write-Host "`n🎉 FERTIG!" -ForegroundColor Green

