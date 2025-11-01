# 🖥️ KOMPLETTE SERVER-KONFIGURATION & DEPLOYMENT-WEGE

## 📋 INHALTSVERZEICHNIS

1. [Server-Infrastruktur](#1-server-infrastruktur)
2. [Docker-Compose-Konfigurationen](#2-docker-compose-konfigurationen)
3. [Nginx-Konfigurationen](#3-nginx-konfigurationen)
4. [Git-Workflow & Repository-Struktur](#4-git-workflow--repository-struktur)
5. [GitHub Actions Workflows](#5-github-actions-workflows)
6. [Deployment-Wege](#6-deployment-wege)
7. [Environment-Variablen](#7-environment-variablen)
8. [Port-Übersicht](#8-port-übersicht)
9. [Monitoring & Logging](#9-monitoring--logging)

---

## 1. SERVER-INFRASTRUKTUR

### 🖥️ Hetzner Production Server

```yaml
Server:
  Provider: Hetzner Cloud
  IP-Adresse: 138.199.237.34
  Domain: www.the-connection-key.de
  Alternative Domain: the-connection-key.de
  
  Betriebssystem: Linux (Ubuntu/Debian)
  Docker: Aktiviert
  Docker Compose: Aktiviert
  
  Verzeichnisse:
    App-Pfad: /opt/hd-app/HD_App_chart
    SSL-Zertifikate: /etc/letsencrypt/live/www.the-connection-key.de/
    Logs: /var/log/nginx/
    Docker-Volumes: Docker Managed
```

### 🔐 SSL/TLS Konfiguration

```yaml
SSL:
  Provider: Let's Encrypt
  Zertifikat-Pfad: /etc/letsencrypt/live/www.the-connection-key.de/
  Dateien:
    - fullchain.pem (Zertifikat)
    - privkey.pem (Private Key)
  Auto-Renewal: Aktiviert (certbot)
  Protokoll: TLSv1.2, TLSv1.3
```

### 🌐 Netzwerk-Konfiguration

```yaml
Netzwerk:
  Type: Bridge Network (app-network)
  Services:
    - frontend:3000
    - nginx:80/443
    - grafana:3001
    - prometheus:9090
    - redis:6379
    - alertmanager:9093
    - node-exporter:9100
    - redis-exporter:9121
```

---

## 2. DOCKER-COMPOSE-KONFIGURATIONEN

### 📦 Production (docker-compose.supabase.yml)

**Zweck**: Live Production Server auf Hetzner

```yaml
Services:
  frontend:
    Build: ./frontend (Dockerfile)
    Ports: 
      - "3000:3000"      # Host:Container
    Environment:
      - NODE_ENV=production
      - PORT=3000
      - HOSTNAME=0.0.0.0
      - NEXT_TELEMETRY_DISABLED=1
      - NODE_OPTIONS=--max-old-space-size=3072
    Networks: app-network
    Depends_on: [grafana, prometheus]
    Restart: unless-stopped

  nginx:
    Image: nginx:alpine
    Ports: 
      - "80:80"          # HTTP
      - "443:443"        # HTTPS
    Volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - /etc/letsencrypt:/etc/letsencrypt:ro
    Networks: app-network
    Depends_on: [frontend, grafana, prometheus]
    Restart: unless-stopped

  grafana:
    Image: grafana/grafana:latest
    Ports: 
      - "3001:3000"      # Host:Container (3001 extern, 3000 intern)
    Environment:
      - GF_SECURITY_ADMIN_PASSWORD=${GRAFANA_PASSWORD}
    Volumes:
      - grafana-storage:/var/lib/grafana
      - ./grafana/dashboards:/etc/grafana/provisioning/dashboards:ro
    Networks: app-network
    Restart: unless-stopped

  prometheus:
    Image: prom/prometheus:latest
    Ports: 
      - "9090:9090"      # Host:Container
    Volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml:ro
      - prometheus-storage:/prometheus
    Networks: app-network
    Restart: unless-stopped

  node-exporter:
    Image: prom/node-exporter:latest
    Ports: 
      - "9100:9100"      # Host:Container
    Networks: app-network
    Restart: unless-stopped

  alertmanager:
    Image: prom/alertmanager:latest
    Ports: 
      - "9093:9093"      # Host:Container
    Networks: app-network
    Restart: unless-stopped

  redis:
    Image: redis:alpine
    Ports: 
      - "6379:6379"      # Host:Container
    Volumes: redis-storage:/data
    Networks: app-network
    Restart: unless-stopped

  redis-exporter:
    Image: oliver006/redis_exporter:latest
    Ports: 
      - "9121:9121"      # Host:Container
    Networks: app-network
    Restart: unless-stopped

Networks:
  app-network:
    Driver: bridge

Volumes:
  grafana-storage:
  prometheus-storage:
  redis-storage:
  alertmanager-storage:
```

**Port-Zuordnung Production:**
- **Frontend**: `localhost:3000` → Container Port 3000
- **Nginx HTTP**: `localhost:80` → Container Port 80
- **Nginx HTTPS**: `localhost:443` → Container Port 443
- **Grafana**: `localhost:3001` → Container Port 3000
- **Prometheus**: `localhost:9090` → Container Port 9090
- **Node Exporter**: `localhost:9100` → Container Port 9100
- **Alertmanager**: `localhost:9093` → Container Port 9093
- **Redis**: `localhost:6379` → Container Port 6379
- **Redis Exporter**: `localhost:9121` → Container Port 9121

### 📦 Development (docker-compose.dev.yml)

**Zweck**: Lokale Docker-Entwicklung

```yaml
Services:
  frontend:
    Build: ./frontend (Dockerfile)
    Ports: 
      - "3000:3000"      # Host:Container
    Environment: 
      - NODE_ENV=development
    Volumes:
      - ./frontend:/app
      - /app/node_modules
      - /app/.next
    Restart: unless-stopped

  nginx:
    Image: nginx:alpine
    Ports: 
      - "80:80"          # Host:Container (HTTP only)
    Volumes:
      - ./nginx/nginx-dev.conf:/etc/nginx/nginx.conf:ro
    Depends_on: [frontend]
    Restart: unless-stopped
```

**Port-Zuordnung Development:**
- **Frontend**: `localhost:3000` → Container Port 3000
- **Nginx**: `localhost:80` → Container Port 80

### 📦 Development-3005 (docker-compose.dev-3005.yml)

**Zweck**: Entwicklung auf Port 3005 mit Docker

```yaml
Services:
  frontend-dev:
    Build: ./frontend (Dockerfile.dev)
    Ports: 
      - "3005:3005"      # Host:Container
    Environment:
      - NODE_ENV=development
      - PORT=3005
    Volumes:
      - ./frontend:/app
      - /app/node_modules
      - /app/.next
    Networks: dev-network
    Restart: unless-stopped

  nginx-dev:
    Image: nginx:alpine
    Ports: 
      - "8005:80"        # Host:Container (HTTP only)
    Volumes:
      - ./nginx/nginx-dev-3005.conf:/etc/nginx/nginx.conf:ro
    Networks: dev-network
    Restart: unless-stopped

  redis-dev:
    Image: redis:7-alpine
    Ports: 
      - "6380:6379"      # Host:Container
    Networks: dev-network
    Restart: unless-stopped
```

**Port-Zuordnung Dev-3005:**
- **Frontend**: `localhost:3005` → Container Port 3005
- **Nginx**: `localhost:8005` → Container Port 80
- **Redis**: `localhost:6380` → Container Port 6379

### 📦 Staging (docker-compose.staging.yml)

**Zweck**: Production-ähnliche Tests lokal

```yaml
Services:
  frontend-staging:
    Build: ./frontend (Dockerfile)
    Ports: 
      - "3002:3000"      # Host:Container
    Environment:
      - NODE_ENV=staging
      - PORT=3000
    Networks: staging-network
    Restart: unless-stopped

  nginx-staging:
    Image: nginx:alpine
    Ports: 
      - "8002:80"        # Host:Container (HTTP only)
    Volumes:
      - ./nginx/nginx-staging.conf:/etc/nginx/nginx.conf:ro
    Networks: staging-network
    Restart: unless-stopped

  grafana-staging:
    Image: grafana/grafana:latest
    Ports: 
      - "3003:3000"      # Host:Container
    Networks: staging-network
    Restart: unless-stopped

  prometheus-staging:
    Image: prom/prometheus:latest
    Ports: 
      - "9091:9090"      # Host:Container
    Networks: staging-network
    Restart: unless-stopped

  redis-staging:
    Image: redis:alpine
    Ports: 
      - "6381:6379"      # Host:Container
    Networks: staging-network
    Restart: unless-stopped
```

**Port-Zuordnung Staging:**
- **Frontend**: `localhost:3002` → Container Port 3000
- **Nginx**: `localhost:8002` → Container Port 80
- **Grafana**: `localhost:3003` → Container Port 3000
- **Prometheus**: `localhost:9091` → Container Port 9090
- **Redis**: `localhost:6381` → Container Port 6379

### 📦 Production-Local (docker-compose.prod-local.yml)

**Zweck**: Exakte Production-Simulation lokal

```yaml
Services:
  frontend-prod-local:
    Build: ./frontend (Dockerfile)
    Ports: 
      - "3004:3000"      # Host:Container
    Environment:
      - NODE_ENV=production
      - PORT=3000
    Networks: prod-local-network
    Restart: unless-stopped

  nginx-prod-local:
    Image: nginx:alpine
    Ports: 
      - "8004:80"        # HTTP
      - "8443:443"       # HTTPS (Self-Signed)
    Volumes:
      - ./nginx/nginx-prod-local.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/ssl:/etc/nginx/ssl:ro
    Networks: prod-local-network
    Restart: unless-stopped

  grafana-prod-local:
    Image: grafana/grafana:latest
    Ports: 
      - "3005:3000"      # Host:Container
    Networks: prod-local-network
    Restart: unless-stopped

  prometheus-prod-local:
    Image: prom/prometheus:latest
    Ports: 
      - "9092:9090"      # Host:Container
    Networks: prod-local-network
    Restart: unless-stopped

  node-exporter-prod-local:
    Image: prom/node-exporter:latest
    Ports: 
      - "9101:9100"      # Host:Container
    Networks: prod-local-network
    Restart: unless-stopped

  alertmanager-prod-local:
    Image: prom/alertmanager:latest
    Ports: 
      - "9094:9093"      # Host:Container
    Networks: prod-local-network
    Restart: unless-stopped

  redis-prod-local:
    Image: redis:alpine
    Ports: 
      - "6380:6379"      # Host:Container
    Networks: prod-local-network
    Restart: unless-stopped
```

**Port-Zuordnung Production-Local:**
- **Frontend**: `localhost:3004` → Container Port 3000
- **Nginx HTTP**: `localhost:8004` → Container Port 80
- **Nginx HTTPS**: `localhost:8443` → Container Port 443
- **Grafana**: `localhost:3005` → Container Port 3000
- **Prometheus**: `localhost:9092` → Container Port 9090
- **Node Exporter**: `localhost:9101` → Container Port 9100
- **Alertmanager**: `localhost:9094` → Container Port 9093
- **Redis**: `localhost:6380` → Container Port 6379

---

## 3. NGINX-KONFIGURATIONEN

### 🔧 Production (nginx/nginx.conf)

**Verwendung**: Hetzner Production Server

```nginx
# Upstream
upstream frontend {
    server frontend:3000;
    keepalive 32;
}

# HTTP Server (Port 80)
server {
    listen 80;
    server_name www.the-connection-key.de the-connection-key.de;
    
    # Let's Encrypt ACME Challenge
    location /.well-known/acme-challenge/ {
        root /usr/share/nginx/html;
    }
    
    # Redirect to HTTPS
    location / {
        return 301 https://$server_name$request_uri;
    }
}

# HTTPS Server (Port 443)
server {
    listen 443 ssl http2;
    server_name www.the-connection-key.de the-connection-key.de;
    
    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/www.the-connection-key.de/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/www.the-connection-key.de/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    
    # Security Headers
    add_header Strict-Transport-Security "max-age=63072000" always;
    add_header X-Frame-Options "DENY" always;
    add_header Content-Security-Policy "..." always;
    
    # Proxy to Frontend
    location / {
        proxy_pass http://frontend;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 🔧 Development (nginx/nginx-dev.conf)

**Verwendung**: Lokale Entwicklung

```nginx
# HTTP Only (kein SSL)
upstream frontend {
    server frontend:3000;
}

server {
    listen 80;
    server_name localhost;
    
    location / {
        proxy_pass http://frontend;
        proxy_http_version 1.1;
    }
    
    # Hot Module Replacement
    location /_next/webpack-hmr {
        proxy_pass http://frontend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

### 🔧 HTTP-Only (nginx/nginx-http-only.conf)

**Verwendung**: Lokale Tests ohne SSL

```nginx
# Keine SSL-Konfiguration
# Nur HTTP auf Port 80
server {
    listen 80;
    location / {
        proxy_pass http://frontend;
    }
}
```

---

## 4. GIT-WORKFLOW & REPOSITORY-STRUKTUR

### 📁 Repository

```yaml
Repository:
  URL: https://github.com/Heiko888/moonlightdatingapp.git
  Branch: main (Production)
  Remote: origin (GitHub)
  
  Struktur:
    frontend/          # Next.js Application
    nginx/             # Nginx Configurations
    .github/           # GitHub Actions Workflows
    deploy/            # Deployment Scripts
    docker-compose.*.yml # Docker Configurations
```

### 🔄 Git-Workflow

```bash
# 1. Development (lokal)
git checkout -b feature/neue-funktion
# Entwickeln auf Port 3005
git add .
git commit -m "feat: neue Funktion"
git push origin feature/neue-funktion

# 2. Pull Request
# GitHub → Create Pull Request
# Code Review

# 3. Merge to Main
# Nach Approval: Merge PR

# 4. GitHub Actions (automatisch)
# CI/CD Pipeline läuft
# Docker Image wird gebaut und gepusht

# 5. Production Deployment
# Option A: Via GitHub Actions UI
# Option B: Manuell via SSH
```

### 📦 Git-Konfiguration

```yaml
Remotes:
  origin:
    URL: https://github.com/Heiko888/moonlightdatingapp.git
    Fetch: +refs/heads/*:refs/remotes/origin/*
    Push: refs/heads/main:refs/heads/main

Branches:
  main:
    Remote: origin
    Merge: refs/heads/main
```

---

## 5. GITHUB ACTIONS WORKFLOWS

### ⚙️ CI/CD Pipeline (.github/workflows/ci-cd.yml)

**Trigger:**
- Push zu `main` oder `develop`
- Pull Requests

**Jobs:**

```yaml
1. lint-and-typecheck:
   - ESLint Check
   - TypeScript Compile Check
   - Runs on: ubuntu-latest
   
2. build-test:
   - npm ci
   - npm run build
   - Upload Artifacts
   - Runs on: ubuntu-latest
   
3. docker-build-test:
   - Docker Buildx Setup
   - Build Docker Image (no push)
   - Cache Optimization
   - Runs on: ubuntu-latest
   
4. deploy-staging:
   - Nur bei Push zu main
   - Staging Deployment (deaktiviert)
   - Runs on: ubuntu-latest
   
5. deploy-production:
   - Nur manuell (workflow_dispatch)
   - SSH zu Hetzner (138.199.237.34)
   - git pull
   - docker-compose down
   - docker-compose build
   - docker-compose up -d
   - Health Checks
   - Runs on: ubuntu-latest
   - Secrets: SSH_PRIVATE_KEY
```

### ⚙️ Docker Image Build (.github/workflows/docker-image.yml)

**Trigger:**
- Push zu `main`
- Tags (v*)
- Pull Requests

**Jobs:**

```yaml
1. build-and-push:
   - Docker Buildx Setup
   - Login to GHCR (ghcr.io)
   - Build Docker Image
   - Push to: ghcr.io/heiko888/moonlightdatingapp
   - Tags: main, sha, semver
   - Runs on: ubuntu-latest
   - Secrets: GITHUB_TOKEN (automatisch)
```

### ⚙️ Code Quality (.github/workflows/code-quality.yml)

**Trigger:**
- Pull Requests
- Push zu `main` oder `develop`

**Jobs:**

```yaml
1. code-quality:
   - ESLint mit Report
   - TypeScript Check
   - Console.log Detection
   - TODO Detection
   
2. security-scan:
   - npm audit
   - Security Report Upload
   
3. dependency-check:
   - npm outdated
```

---

## 6. DEPLOYMENT-WEGE

### 🚀 Weg 1: Automatisch via GitHub Actions

```mermaid
Lokale Änderungen
    ↓
git commit & push
    ↓
GitHub Actions (automatisch)
    ├─ CI/CD Pipeline
    ├─ Docker Build & Push
    └─ Tests
    ↓
GitHub Actions UI (manuell)
    └─ Run Workflow: Deploy to Production
    ↓
Hetzner Server
    ├─ SSH Connection
    ├─ git pull
    ├─ docker-compose down
    ├─ docker-compose build
    ├─ docker-compose up -d
    └─ Health Checks
```

**Befehle:**

```powershell
# 1. Lokale Änderungen
git add .
git commit -m "feat: neue Funktion"
git push origin main

# 2. Warten auf GitHub Actions Build
# Gehe zu: https://github.com/Heiko888/moonlightdatingapp/actions

# 3. Manuell deployen via GitHub Actions UI
# Actions → CI/CD Pipeline → Run workflow
```

### 🚀 Weg 2: Manuell via SSH

```powershell
# Direkt auf Hetzner Server
ssh root@138.199.237.34

# Auf Server
cd /opt/hd-app/HD_App_chart
git pull origin main
docker compose -f docker-compose.supabase.yml down
docker compose -f docker-compose.supabase.yml build --no-cache
docker compose -f docker-compose.supabase.yml up -d

# Status prüfen
docker compose -f docker-compose.supabase.yml ps
docker compose -f docker-compose.supabase.yml logs -f
```

### 🚀 Weg 3: Via PowerShell-Skript

```powershell
# Reparatur-Skript
.\repariere-hetzner.ps1

# Oder Update-Skript
.\update-hetzner-after-build.ps1
```

### 🚀 Weg 4: Direktes Git Pull auf Server

```bash
# SSH zu Server
ssh root@138.199.237.34

# Git Pull und Neustart
cd /opt/hd-app/HD_App_chart
git pull origin main
docker compose -f docker-compose.supabase.yml restart
```

---

## 7. ENVIRONMENT-VARIABLEN

### 🔐 Production (.env.production)

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://njjcywgskzepikyzhihy.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Security
JWT_SECRET=your_super_secure_jwt_secret_here_min_32_chars
SESSION_SECRET=your_session_secret_here

# AI & External
OPENAI_API_KEY=your_openai_api_key_here
NASA_API_KEY=your_nasa_api_key_here

# Monitoring
GRAFANA_PASSWORD=your_secure_grafana_password_here
PROMETHEUS_RETENTION=200h

# Node
NODE_ENV=production
PORT=3000
HOSTNAME=0.0.0.0
NODE_OPTIONS=--max-old-space-size=3072
NEXT_TELEMETRY_DISABLED=1
```

### 🔐 Staging (.env.staging)

```env
NODE_ENV=staging
PORT=3002
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

### 🔐 Development (.env.local)

```env
NODE_ENV=development
PORT=3005
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

---

## 8. PORT-ÜBERSICHT

### 📊 Vollständige Port-Übersicht

#### Port-Mapping Format: `Host-Port:Container-Port`

| Service | Development | Docker-Dev | Dev-3005 | Staging | Prod-Local | Production |
|---------|-------------|------------|----------|---------|------------|------------|
| **Frontend** | 3005 (native) | 3000:3000 | 3005:3005 | 3002:3000 | 3004:3000 | 3000:3000 |
| **Nginx HTTP** | - | 80:80 | 8005:80 | 8002:80 | 8004:80 | 80:80 |
| **Nginx HTTPS** | - | - | - | - | 8443:443 | 443:443 |
| **Grafana** | - | - | - | 3003:3000 | 3005:3000 | 3001:3000 |
| **Prometheus** | - | - | - | 9091:9090 | 9092:9090 | 9090:9090 |
| **Redis** | - | - | 6380:6379 | 6381:6379 | 6380:6379 | 6379:6379 |
| **Alertmanager** | - | - | - | - | 9094:9093 | 9093:9093 |
| **Node Exporter** | - | - | - | - | 9101:9100 | 9100:9100 |
| **Redis Exporter** | - | - | - | - | - | 9121:9121 |

**Legende:**
- **Development**: Native Next.js (kein Docker)
- **Docker-Dev**: `docker-compose.dev.yml`
- **Dev-3005**: `docker-compose.dev-3005.yml`
- **Staging**: `docker-compose.staging.yml`
- **Prod-Local**: `docker-compose.prod-local.yml`
- **Production**: `docker-compose.supabase.yml` (Hetzner)

### 🌐 URLs & Zugriff

| Environment | Frontend URL | Nginx URL | Grafana | Prometheus |
|-------------|--------------|-----------|---------|------------|
| **Development** | http://localhost:3005 | - | - | - |
| **Docker-Dev** | http://localhost:3000 | http://localhost:80 | - | - |
| **Dev-3005** | http://localhost:3005 | http://localhost:8005 | - | - |
| **Staging** | http://localhost:3002 | http://localhost:8002 | http://localhost:3003 | http://localhost:9091 |
| **Prod-Local** | http://localhost:3004 | http://localhost:8004 (https://8443) | http://localhost:3005 | http://localhost:9092 |
| **Production** | http://138.199.237.34:3000 | https://www.the-connection-key.de | http://138.199.237.34:3001 | http://138.199.237.34:9090 |

**Wichtig:**
- Production Frontend ist nur über Nginx erreichbar (Port 80/443)
- Direkter Zugriff auf Port 3000 sollte nicht öffentlich sein
- HTTPS redirects automatisch von HTTP

---

## 9. MONITORING & LOGGING

### 📊 Grafana Dashboards

```yaml
URL: http://138.199.237.34:3001
Login: admin / ${GRAFANA_PASSWORD}
Dashboards:
  - HD App Dashboard
  - System Metrics
  - Application Metrics
```

### 📊 Prometheus Metrics

```yaml
URL: http://138.199.237.34:9090
Targets:
  - node-exporter:9100
  - redis-exporter:9121
  - frontend:3000 (via /metrics)
```

### 📝 Logging

```bash
# Alle Container Logs
docker compose -f docker-compose.supabase.yml logs -f

# Nginx Logs
docker compose -f docker-compose.supabase.yml logs -f nginx
# Access: /var/log/nginx/access.log
# Error: /var/log/nginx/error.log

# Frontend Logs
docker compose -f docker-compose.supabase.yml logs -f frontend

# Nur Fehler
docker compose -f docker-compose.supabase.yml logs | grep -i error
```

---

## ✅ DEPLOYMENT-CHECKLISTE

### Vor Deployment

- [ ] Code-Review abgeschlossen
- [ ] Tests erfolgreich
- [ ] Linter-Fehler behoben
- [ ] TypeScript-Fehler behoben
- [ ] Environment-Variablen aktualisiert
- [ ] Dokumentation aktualisiert

### Während Deployment

- [ ] GitHub Actions Build erfolgreich
- [ ] Docker Image gebaut und gepusht
- [ ] SSH-Verbindung zum Server funktioniert
- [ ] Git Pull erfolgreich
- [ ] Container gestoppt
- [ ] Container neu gebaut
- [ ] Container gestartet

### Nach Deployment

- [ ] Container laufen (docker ps)
- [ ] Keine Fehler in Logs
- [ ] HTTP Test erfolgreich (curl)
- [ ] HTTPS Test erfolgreich (curl)
- [ ] Domain im Browser testen
- [ ] SSL-Zertifikat valide
- [ ] Monitoring funktioniert
- [ ] Health Checks erfolgreich

---

## 🔧 TROUBLESHOOTING

### Problem: Nginx startet nicht

```bash
# 1. Logs prüfen
docker compose -f docker-compose.supabase.yml logs nginx

# 2. SSL-Zertifikate prüfen
ls -la /etc/letsencrypt/live/www.the-connection-key.de/

# 3. Nginx Config testen
docker compose -f docker-compose.supabase.yml exec nginx nginx -t
```

### Problem: 502 Bad Gateway

```bash
# 1. Frontend Status
docker compose -f docker-compose.supabase.yml ps frontend

# 2. Frontend Logs
docker compose -f docker-compose.supabase.yml logs frontend

# 3. Netzwerk prüfen
docker network inspect hd_app_chart_app-network

# 4. Frontend neu starten
docker compose -f docker-compose.supabase.yml restart frontend
```

### Problem: SSL-Zertifikat-Fehler

```bash
# Zertifikat prüfen
certbot certificates

# Zertifikat erneuern
certbot renew --dry-run

# Container neu starten
docker compose -f docker-compose.supabase.yml restart nginx
```

---

## 📞 SUPPORT & LINKS

- **GitHub Repository**: https://github.com/Heiko888/moonlightdatingapp
- **GitHub Actions**: https://github.com/Heiko888/moonlightdatingapp/actions
- **Docker Registry**: https://github.com/Heiko888?tab=packages
- **Production Domain**: https://www.the-connection-key.de
- **Server IP**: 138.199.237.34

---

**Erstellt**: 2025-10-31  
**Letztes Update**: Nach Hetzner-Reparatur  
**Status**: ✅ Production-Konfiguration wiederhergestellt

