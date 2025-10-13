# 📚 VOLLSTÄNDIGE BEDIENUNGSANLEITUNG - HD_APP_CHART

**Version**: 1.0  
**Datum**: 2025-10-14  
**Autor**: Claude 3.5 Sonnet

---

## 📋 INHALTSVERZEICHNIS

1. [Projekt-Übersicht](#projekt-übersicht)
2. [Development-Umgebung](#development-umgebung)
3. [Docker-Konfigurationen](#docker-konfigurationen)
4. [Nginx-Konfigurationen](#nginx-konfigurationen)
5. [Monitoring-System](#monitoring-system)
6. [Deployment-Strategien](#deployment-strategien)
7. [GitHub-Integration](#github-integration)
8. [Datenbank & Authentication](#datenbank--authentication)
9. [Payment-System](#payment-system)
10. [Troubleshooting](#troubleshooting)

---

## 1. PROJEKT-ÜBERSICHT

### **Was ist HD_App_chart?**

Eine astrologische Web-Applikation mit:
- **Frontend**: Next.js 14 + TypeScript + React
- **Datenbank**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Payment**: Stripe
- **Monitoring**: Prometheus + Grafana
- **Deployment**: Docker + Hetzner Server

### **Projekt-Struktur:**

```
HD_App_chart/
├── frontend/                 # Next.js Frontend
│   ├── app/                 # Next.js App Router
│   ├── components/          # React Komponenten
│   ├── lib/                 # Utilities & Services
│   ├── middleware.ts        # Next.js Middleware
│   └── package.json         # Dependencies
├── nginx/                   # Nginx Konfigurationen
├── grafana/                 # Grafana Dashboards
├── prometheus/              # Prometheus Config
├── alertmanager/            # Alertmanager Config
├── deploy/                  # Deployment Scripts
├── .github/                 # GitHub Actions
└── docker-compose.*.yml     # Docker Konfigurationen
```

---

## 2. DEVELOPMENT-UMGEBUNG

### **2.1 Native Development (Port 3005)**

#### **Wofür?**
- Schnellste Entwicklung
- Hot Module Replacement (HMR)
- Direktes Debugging
- Beste Developer Experience

#### **Starten:**
```powershell
cd frontend
npm install
npm run dev
```

#### **Zugriff:**
```
http://localhost:3005
```

#### **Features:**
- ✅ Automatisches Reload bei Änderungen
- ✅ Schnelle Kompilierung
- ✅ Source Maps aktiviert
- ✅ Debug-Modus
- ✅ Keine Docker-Overhead

#### **Wann verwenden?**
- Tägliche Entwicklung
- Feature-Entwicklung
- Bug-Fixes
- UI-Anpassungen
- Schnelle Iterationen

#### **Konfiguration:**
- **Port**: `3005` (definiert in `package.json`)
- **Environment**: `.env.local`
- **Node**: Version 20+
- **Hot Reload**: Aktiviert

---

### **2.2 Docker Development (Port 3000)**

#### **Wofür?**
- Production-ähnliche Umgebung
- Docker-spezifische Tests
- Container-Integration
- Nginx-Testing

#### **Starten:**
```powershell
docker-compose -f docker-compose.dev.yml up -d
```

#### **Stoppen:**
```powershell
docker-compose -f docker-compose.dev.yml down
```

#### **Zugriff:**
```
Frontend: http://localhost:3000
Nginx:    http://localhost:80
```

#### **Features:**
- ✅ Docker Container
- ✅ Nginx Reverse Proxy
- ✅ Production-ähnlich
- ✅ Volume Mounting
- ✅ Hot Reload (langsamer)

#### **Wann verwenden?**
- Docker-spezifische Tests
- Nginx-Konfiguration testen
- Production-Simulation
- Container-Integration prüfen

#### **Konfiguration:**
- **Datei**: `docker-compose.dev.yml`
- **Services**: Frontend, Nginx
- **Volumes**: Code-Mounting
- **Network**: Bridge

---

### **2.3 Staging Environment (Port 3002)**

#### **Wofür?**
- Pre-Production Tests
- Integration Tests
- Performance Tests
- QA-Testing

#### **Starten:**
```powershell
.\deploy\staging\deploy-staging.ps1
```

#### **Stoppen:**
```powershell
docker-compose -f docker-compose.staging.yml down
```

#### **Zugriff:**
```
Frontend:   http://localhost:3002
Nginx:      http://localhost:8002
Grafana:    http://localhost:3003
Prometheus: http://localhost:9091
```

#### **Features:**
- ✅ Production Build
- ✅ Monitoring aktiviert
- ✅ Redis Caching
- ✅ Nginx mit Security Headers
- ✅ Separate Volumes

#### **Wann verwenden?**
- Vor Production-Deployment
- Integration Tests
- Performance-Messungen
- QA-Freigabe
- Stakeholder-Demos

#### **Konfiguration:**
- **Datei**: `docker-compose.staging.yml`
- **Environment**: `.env.staging`
- **Build**: Production Mode
- **Monitoring**: Aktiviert

---

### **2.4 Production-Local (Port 3004)**

#### **Wofür?**
- Exakte Production-Simulation
- Finale Tests
- SSL-Testing
- Vollständiges Monitoring

#### **Starten:**
```powershell
.\deploy\production\deploy-prod-local.ps1
```

#### **Stoppen:**
```powershell
docker-compose -f docker-compose.prod-local.yml down
```

#### **Zugriff:**
```
Frontend:      http://localhost:3004
Nginx HTTP:    http://localhost:8004 (→ HTTPS)
Nginx HTTPS:   https://localhost:8443
Grafana:       http://localhost:3005
Prometheus:    http://localhost:9092
Alertmanager:  http://localhost:9094
Redis:         localhost:6380
```

#### **Features:**
- ✅ Production Build
- ✅ SSL/HTTPS
- ✅ Vollständiges Monitoring
- ✅ Alertmanager
- ✅ Redis mit Password
- ✅ Rate Limiting
- ✅ Security Headers

#### **Wann verwenden?**
- Finale Tests vor Production
- SSL-Konfiguration testen
- Monitoring-Setup prüfen
- Performance unter Last
- Security-Tests

#### **Konfiguration:**
- **Datei**: `docker-compose.prod-local.yml`
- **Environment**: `.env.production.local`
- **SSL**: Self-Signed Certificates
- **Monitoring**: Vollständig

---

### **2.5 Production (Hetzner)**

#### **Wofür?**
- Live Production Server
- Echte Benutzer
- Production-Daten
- 24/7 Verfügbarkeit

#### **Deployen:**
```powershell
.\deploy\production\setup-production.ps1
```

#### **Zugriff:**
```
Frontend:      http://138.199.237.34:3000
Grafana:       http://138.199.237.34:3001
Prometheus:    http://138.199.237.34:9090
Alertmanager:  http://138.199.237.34:9093
```

#### **Features:**
- ✅ Production Build
- ✅ Let's Encrypt SSL
- ✅ Vollständiges Monitoring
- ✅ Alerting
- ✅ Redis Caching
- ✅ Rate Limiting
- ✅ Security Headers
- ✅ Backup-System

#### **Wann verwenden?**
- Live-Deployment
- Nach erfolgreichen Tests
- Feature-Releases
- Bug-Fixes in Production

#### **Konfiguration:**
- **Datei**: `docker-compose.supabase.yml`
- **Environment**: `.env.production`
- **SSL**: Let's Encrypt
- **Domain**: moonlightdatingapp.werdemeisterdeinergedanken.de

---

## 3. DOCKER-KONFIGURATIONEN

### **3.1 docker-compose.dev.yml**

#### **Zweck:**
Docker-basierte Development-Umgebung

#### **Services:**
```yaml
frontend:
  - Port: 3000
  - Environment: development
  - Hot Reload: Ja
  - Volumes: Code-Mounting

nginx:
  - Port: 80
  - Reverse Proxy
  - Development Config
```

#### **Verwendung:**
```powershell
# Starten
docker-compose -f docker-compose.dev.yml up -d

# Logs anzeigen
docker-compose -f docker-compose.dev.yml logs -f

# Stoppen
docker-compose -f docker-compose.dev.yml down

# Neu bauen
docker-compose -f docker-compose.dev.yml build --no-cache
```

#### **Wann verwenden?**
- Docker-spezifische Entwicklung
- Nginx-Konfiguration testen
- Container-Integration

---

### **3.2 docker-compose.staging.yml**

#### **Zweck:**
Staging-Umgebung für Pre-Production Tests

#### **Services:**
```yaml
frontend-staging:
  - Port: 3002
  - Environment: staging
  - Production Build

nginx-staging:
  - Port: 8002
  - Security Headers

grafana-staging:
  - Port: 3003
  - Monitoring

prometheus-staging:
  - Port: 9091
  - Metrics

redis-staging:
  - Port: 6381
  - Caching
```

#### **Verwendung:**
```powershell
# Deployment-Script
.\deploy\staging\deploy-staging.ps1

# Oder manuell
docker-compose -f docker-compose.staging.yml up -d

# Status prüfen
docker-compose -f docker-compose.staging.yml ps

# Logs
docker-compose -f docker-compose.staging.yml logs -f frontend-staging
```

#### **Wann verwenden?**
- Vor Production-Deployment
- Integration Tests
- Performance Tests
- QA-Freigabe

---

### **3.3 docker-compose.prod-local.yml**

#### **Zweck:**
Lokale Production-Simulation mit allen Features

#### **Services:**
```yaml
frontend-prod-local:
  - Port: 3004
  - Production Build
  - Alle Optimierungen

nginx-prod-local:
  - Port: 8004/8443
  - SSL/HTTPS
  - Rate Limiting
  - Security Headers

grafana-prod-local:
  - Port: 3005
  - Vollständiges Monitoring

prometheus-prod-local:
  - Port: 9092
  - Alle Metriken

alertmanager-prod-local:
  - Port: 9094
  - Email-Alerts

redis-prod-local:
  - Port: 6380
  - Password-geschützt
```

#### **Verwendung:**
```powershell
# Deployment-Script
.\deploy\production\deploy-prod-local.ps1

# Status prüfen
docker-compose -f docker-compose.prod-local.yml ps

# Logs
docker-compose -f docker-compose.prod-local.yml logs -f

# Stoppen
docker-compose -f docker-compose.prod-local.yml down
```

#### **Wann verwenden?**
- Finale Tests vor Production
- SSL-Testing
- Monitoring-Setup
- Performance unter Last

---

### **3.4 docker-compose.supabase.yml**

#### **Zweck:**
Production-Konfiguration für Hetzner Server

#### **Services:**
```yaml
frontend:
  - Port: 3000
  - Production Build
  - Optimiert

nginx:
  - Port: 80/443
  - Let's Encrypt SSL
  - Production Config

grafana:
  - Port: 3001
  - Production Monitoring

prometheus:
  - Port: 9090
  - Metrics Collection

node-exporter:
  - Port: 9100
  - System Metrics

alertmanager:
  - Port: 9093
  - Production Alerts

redis:
  - Port: 6379
  - Production Cache
```

#### **Verwendung:**
```powershell
# Deployment auf Hetzner
.\deploy\production\setup-production.ps1

# Manuell auf Server
ssh root@138.199.237.34
cd /opt/hd-app/HD_App_chart
docker-compose -f docker-compose.supabase.yml up -d

# Status prüfen
docker-compose -f docker-compose.supabase.yml ps

# Logs
docker-compose -f docker-compose.supabase.yml logs -f frontend
```

#### **Wann verwenden?**
- Production-Deployment
- Live-Updates
- Feature-Releases

---

## 4. NGINX-KONFIGURATIONEN

### **4.1 nginx-dev.conf**

#### **Zweck:**
Development Nginx-Konfiguration

#### **Features:**
```nginx
- HTTP only (kein HTTPS)
- Proxy zu Frontend (Port 3000)
- Hot Module Replacement Support
- /_next/static/ Caching
- /_next/webpack-hmr WebSocket
- Security Headers (relaxed)
- Gzip Compression
```

#### **Verwendung:**
```
Automatisch geladen in docker-compose.dev.yml
```

#### **Wichtige Locations:**
```nginx
location / {
    # Proxy zu Frontend
    proxy_pass http://frontend;
}

location /_next/static/ {
    # Next.js Static Files
    # 365 Tage Cache
}

location /_next/webpack-hmr {
    # Hot Module Replacement
    # WebSocket Support
}
```

#### **Wann anpassen?**
- Neue API-Routes
- Zusätzliche Proxy-Rules
- Custom Headers
- Rate Limiting ändern

---

### **4.2 nginx-staging.conf**

#### **Zweck:**
Staging Nginx-Konfiguration

#### **Features:**
```nginx
- HTTP only
- Security Headers
- Static File Caching
- Gzip Compression
- Health Check Endpoint
```

#### **Verwendung:**
```
Automatisch geladen in docker-compose.staging.yml
```

#### **Wichtige Locations:**
```nginx
location / {
    proxy_pass http://frontend-staging;
}

location /_next/static/ {
    # 365 Tage Cache
    expires 365d;
}

location /health {
    return 200 "healthy - staging\n";
}
```

---

### **4.3 nginx-prod-local.conf**

#### **Zweck:**
Production-Local Nginx mit SSL

#### **Features:**
```nginx
- HTTPS mit Self-Signed Cert
- HTTP → HTTPS Redirect
- Rate Limiting
- Security Headers (strict)
- Content Security Policy
- Static File Caching
```

#### **Verwendung:**
```
Automatisch geladen in docker-compose.prod-local.yml
```

#### **Wichtige Features:**
```nginx
# HTTP → HTTPS Redirect
server {
    listen 80;
    return 301 https://$server_name$request_uri;
}

# HTTPS Server
server {
    listen 443 ssl http2;
    ssl_certificate /etc/nginx/ssl/localhost.pem;
    
    # Rate Limiting
    location /api/ {
        limit_req zone=api burst=10 nodelay;
    }
    
    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000";
    add_header Content-Security-Policy "...";
}
```

---

### **4.4 nginx.conf (Production)**

#### **Zweck:**
Production Nginx für Hetzner

#### **Features:**
```nginx
- Let's Encrypt SSL
- HTTP → HTTPS Redirect
- Rate Limiting (strict)
- Security Headers (production)
- CORS Headers
- Static File Caching
- ACME Challenge Support
```

#### **Verwendung:**
```
Automatisch geladen in docker-compose.supabase.yml
```

#### **Wichtige Features:**
```nginx
# Let's Encrypt ACME Challenge
location /.well-known/acme-challenge/ {
    root /usr/share/nginx/html;
}

# HTTPS Server
server {
    listen 443 ssl http2;
    ssl_certificate /etc/letsencrypt/live/.../fullchain.pem;
    
    # Rate Limiting (production)
    location /api/ {
        limit_req zone=api burst=20 nodelay;
    }
    
    location /api/auth/login {
        limit_req zone=login burst=5 nodelay;
    }
}
```

#### **Wann anpassen?**
- SSL-Zertifikat erneuern
- Rate Limits ändern
- Neue Security Headers
- Custom Routes

---

## 5. MONITORING-SYSTEM

### **5.1 Grafana**

#### **Zweck:**
Dashboard-Visualisierung und Monitoring

#### **Zugriff:**
```
Development:  Nicht verfügbar
Staging:      http://localhost:3003
Prod-Local:   http://localhost:3005
Production:   http://138.199.237.34:3001
```

#### **Login:**
```
Username: admin
Password: [siehe .env Datei]
```

#### **Features:**
- ✅ System Metrics Dashboard
- ✅ Application Metrics
- ✅ Docker Metrics
- ✅ Custom Dashboards
- ✅ Alert Visualization
- ✅ Data Source Management

#### **Verwendung:**

**Dashboard erstellen:**
1. Login zu Grafana
2. Dashboard → New Dashboard
3. Add Visualization
4. Query auswählen (Prometheus)
5. Metric auswählen
6. Visualisierung anpassen
7. Save Dashboard

**Verfügbare Dashboards:**
- System Overview
- Application Metrics
- Docker Metrics
- Custom Business Metrics

#### **Wann verwenden?**
- Performance-Monitoring
- System-Überwachung
- Fehler-Analyse
- Kapazitäts-Planung

---

### **5.2 Prometheus**

#### **Zweck:**
Metrics Collection und Storage

#### **Zugriff:**
```
Development:  Nicht verfügbar
Staging:      http://localhost:9091
Prod-Local:   http://localhost:9092
Production:   http://138.199.237.34:9090
```

#### **Features:**
- ✅ Metrics Scraping
- ✅ Time Series Database
- ✅ Query Language (PromQL)
- ✅ Alert Rules
- ✅ Service Discovery

#### **Konfiguration:**
```yaml
# prometheus.yml
scrape_configs:
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']
  
  - job_name: 'node-exporter'
    static_configs:
      - targets: ['node-exporter:9100']
  
  - job_name: 'hd-app-frontend'
    static_configs:
      - targets: ['frontend:3000']
    metrics_path: '/api/metrics'
```

#### **Verfügbare Metriken:**
```
# System Metrics
node_cpu_seconds_total
node_memory_MemTotal_bytes
node_disk_io_time_seconds_total

# Application Metrics
http_requests_total
http_request_duration_seconds
http_response_size_bytes

# Docker Metrics
container_cpu_usage_seconds_total
container_memory_usage_bytes
```

#### **PromQL Queries:**
```promql
# CPU Usage
100 - (avg(rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100)

# Memory Usage
(node_memory_MemTotal_bytes - node_memory_MemAvailable_bytes) / node_memory_MemTotal_bytes * 100

# HTTP Request Rate
rate(http_requests_total[5m])

# HTTP Error Rate
rate(http_requests_total{status=~"5.."}[5m])
```

#### **Wann verwenden?**
- Metrics abfragen
- Alert Rules erstellen
- Performance-Analyse
- Kapazitäts-Planung

---

### **5.3 Alertmanager**

#### **Zweck:**
Alert Management und Notifications

#### **Zugriff:**
```
Development:  Nicht verfügbar
Staging:      Nicht konfiguriert
Prod-Local:   http://localhost:9094
Production:   http://138.199.237.34:9093
```

#### **Features:**
- ✅ Alert Grouping
- ✅ Email Notifications
- ✅ Alert Silencing
- ✅ Alert Routing
- ✅ Inhibition Rules

#### **Konfiguration:**
```yaml
# alertmanager.yml
global:
  smtp_smarthost: 'smtp.gmail.com:587'
  smtp_from: 'alerts@your-domain.com'
  smtp_auth_username: 'your-email@gmail.com'
  smtp_auth_password: 'your-app-password'

receivers:
- name: 'web.hook'
  email_configs:
  - to: 'admin@your-domain.com'
    headers:
      Subject: 'HD App Alert: {{ .GroupLabels.alertname }}'
    html: |
      <h2>HD App Alert</h2>
      {{ range .Alerts }}
      <p><strong>Alert:</strong> {{ .Annotations.summary }}</p>
      {{ end }}
```

#### **Alert Rules:**
```yaml
# prometheus/alerts.yml
groups:
- name: system_alerts
  rules:
  - alert: HighCPUUsage
    expr: 100 - (avg(rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100) > 80
    for: 5m
    labels:
      severity: warning
    annotations:
      summary: "High CPU usage detected"
  
  - alert: HighMemoryUsage
    expr: (node_memory_MemTotal_bytes - node_memory_MemAvailable_bytes) / node_memory_MemTotal_bytes * 100 > 90
    for: 5m
    labels:
      severity: critical
    annotations:
      summary: "High memory usage detected"
```

#### **Wann verwenden?**
- Email-Benachrichtigungen
- Alert-Management
- Incident Response
- Monitoring-Automation

---

### **5.4 Node Exporter**

#### **Zweck:**
System Metrics Collection

#### **Port:**
```
9100
```

#### **Verfügbare Metriken:**
```
# CPU
node_cpu_seconds_total

# Memory
node_memory_MemTotal_bytes
node_memory_MemAvailable_bytes

# Disk
node_disk_io_time_seconds_total
node_filesystem_avail_bytes

# Network
node_network_receive_bytes_total
node_network_transmit_bytes_total

# Load Average
node_load1
node_load5
node_load15
```

#### **Wann verwenden?**
- System-Monitoring
- Resource-Tracking
- Kapazitäts-Planung

---

## 6. DEPLOYMENT-STRATEGIEN

### **6.1 Development Workflow**

#### **Schritt 1: Lokale Entwicklung**
```powershell
# Native Development Server
cd frontend
npm run dev
# → http://localhost:3005
```

**Verwendung:**
- Feature-Entwicklung
- Bug-Fixes
- UI-Anpassungen
- Schnelle Iterationen

---

#### **Schritt 2: Docker Testing**
```powershell
# Docker Development
docker-compose -f docker-compose.dev.yml up -d
# → http://localhost:3000
```

**Verwendung:**
- Docker-spezifische Tests
- Nginx-Konfiguration
- Container-Integration

---

#### **Schritt 3: Staging Deployment**
```powershell
# Staging Environment
.\deploy\staging\deploy-staging.ps1
# → http://localhost:3002
```

**Verwendung:**
- Integration Tests
- Performance Tests
- QA-Freigabe

---

#### **Schritt 4: Production-Local Testing**
```powershell
# Production Simulation
.\deploy\production\deploy-prod-local.ps1
# → http://localhost:3004
```

**Verwendung:**
- Finale Tests
- SSL-Testing
- Monitoring-Setup

---

#### **Schritt 5: Production Deployment**
```powershell
# Production Deployment
.\deploy\production\setup-production.ps1
# → http://138.199.237.34:3000
```

**Verwendung:**
- Live-Deployment
- Feature-Releases

---

### **6.2 Git Workflow**

#### **Feature-Entwicklung:**
```powershell
# 1. Feature Branch erstellen
git checkout -b feature/user-profile

# 2. Entwickeln auf Port 3005
cd frontend
npm run dev

# 3. Committen
git add .
git commit -m "feat: add user profile page"

# 4. Pushen
git push origin feature/user-profile

# 5. Pull Request erstellen
# GitHub → New Pull Request

# 6. Review & Merge
# Nach Approval: Merge to main

# 7. Deployment
.\deploy\production\setup-production.ps1
```

---

### **6.3 Hotfix Workflow**

#### **Kritischer Bug in Production:**
```powershell
# 1. Hotfix Branch
git checkout -b hotfix/critical-bug

# 2. Fix entwickeln
cd frontend
npm run dev

# 3. Testen
.\deploy\production\deploy-prod-local.ps1

# 4. Committen & Pushen
git add .
git commit -m "fix: critical bug in login"
git push origin hotfix/critical-bug

# 5. Sofort mergen
# GitHub → Merge (Fast-Track)

# 6. Deployment
.\deploy\production\setup-production.ps1
```

---

## 7. GITHUB-INTEGRATION

### **7.1 GitHub Actions**

#### **CI/CD Pipeline:**
```yaml
# .github/workflows/ci-cd.yml

Trigger:
- Push zu main/develop
- Pull Requests

Jobs:
1. Lint & Type Check
   - ESLint
   - TypeScript Check

2. Build Test
   - npm install
   - npm build
   - Upload Artifacts

3. Docker Build Test
   - Docker Buildx
   - Build Image
   - Cache Optimization

4. Staging Deployment
   - Nur bei Push zu main
   - Automatisch

5. Production Deployment
   - Nur manuell
   - SSH zu Hetzner
   - Docker Compose
   - Health Checks
```

#### **Code Quality Workflow:**
```yaml
# .github/workflows/code-quality.yml

Jobs:
1. Code Quality Analysis
   - ESLint mit Report
   - TypeScript Check
   - Console.log Detection
   - TODO Detection

2. Security Scan
   - npm audit
   - Security Report

3. Dependency Check
   - Outdated Packages
```

#### **Docker Image Workflow:**
```yaml
# .github/workflows/docker-image.yml

Jobs:
1. Build and Push
   - Docker Buildx
   - Container Registry
   - Metadata
   - Cache

2. Image Scan
   - Trivy Security Scan
   - SARIF Upload
```

---

### **7.2 Issue Templates**

#### **Bug Report:**
```
Verwendung:
1. GitHub → Issues → New Issue
2. Bug Report Template auswählen
3. Formular ausfüllen:
   - Beschreibung
   - Reproduktionsschritte
   - Erwartetes Verhalten
   - Environment
   - Browser
   - Logs
   - Screenshots
```

#### **Feature Request:**
```
Verwendung:
1. GitHub → Issues → New Issue
2. Feature Request Template
3. Formular ausfüllen:
   - Problem/Motivation
   - Vorgeschlagene Lösung
   - Alternative Lösungen
   - Priorität
   - Kategorie
   - Mockups
```

---

### **7.3 Pull Request Template**

#### **Verwendung:**
```
Automatisch geladen bei PR-Erstellung

Checkliste:
- [ ] Code Review
- [ ] Tests durchgeführt
- [ ] Dokumentation aktualisiert
- [ ] Keine Linter-Fehler
- [ ] Build erfolgreich
- [ ] Docker Build erfolgreich
```

---

### **7.4 Dependabot**

#### **Automatische Updates:**
```yaml
# .github/dependabot.yml

Wöchentliche Updates für:
- NPM Dependencies
- Docker Images
- GitHub Actions

Grouping:
- React Ecosystem
- Next.js Ecosystem
- Supabase
- Dev Dependencies
```

#### **Verwendung:**
```
Automatisch:
1. Dependabot erstellt PR
2. CI/CD läuft automatisch
3. Review & Merge
```

---

## 8. DATENBANK & AUTHENTICATION

### **8.1 Supabase Setup**

#### **Konfiguration:**
```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

#### **Tabellen:**
```sql
-- profiles
CREATE TABLE profiles (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE,
  full_name TEXT,
  birth_date DATE,
  birth_time TIME,
  birth_place TEXT,
  subscription_tier TEXT,
  created_at TIMESTAMP
);

-- charts
CREATE TABLE charts (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  chart_data JSONB,
  created_at TIMESTAMP
);

-- matching_profiles
CREATE TABLE matching_profiles (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  partner_id UUID REFERENCES profiles(id),
  compatibility_score INTEGER,
  created_at TIMESTAMP
);
```

#### **Row Level Security (RLS):**
```sql
-- Nur eigene Daten sehen
CREATE POLICY "Users can view own profile"
ON profiles FOR SELECT
USING (auth.uid() = id);

-- Nur eigene Daten ändern
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id);
```

---

### **8.2 Authentication**

#### **Login:**
```typescript
// lib/supabase/client.ts
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Login
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password'
})
```

#### **Signup:**
```typescript
// Signup
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password',
  options: {
    data: {
      full_name: 'John Doe'
    }
  }
})
```

#### **Logout:**
```typescript
// Logout
const { error } = await supabase.auth.signOut()
```

---

### **8.3 Middleware Access Control**

#### **Subscription-basiert:**
```typescript
// middleware.ts
const subscriptionAccess = {
  '/dashboard': ['free', 'basic', 'vip', 'admin'],
  '/chart': ['basic', 'vip', 'admin'],
  '/matching': ['vip', 'admin'],
  '/admin': ['admin']
}
```

#### **Verwendung:**
```
Automatisch:
- Middleware prüft Subscription
- Redirect bei fehlenden Rechten
- Cookie-basierte Session
```

---

## 9. PAYMENT-SYSTEM

### **9.1 Stripe Setup**

#### **Konfiguration:**
```env
# .env.local
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

#### **Subscription Packages:**
```typescript
// lib/stripe/client.ts
export const SUBSCRIPTION_PACKAGES = {
  free: {
    name: 'Free',
    price: 0,
    features: ['Basis-Horoskop']
  },
  basic: {
    name: 'Basic',
    price: 9.99,
    features: ['Horoskop', 'Chart']
  },
  vip: {
    name: 'VIP',
    price: 29.99,
    features: ['Alle Features', 'Matching']
  }
}
```

---

### **9.2 Payment Flow**

#### **Checkout:**
```typescript
// 1. Checkout Session erstellen
const session = await stripe.checkout.sessions.create({
  mode: 'subscription',
  line_items: [{
    price: 'price_...',
    quantity: 1
  }],
  success_url: `${process.env.NEXT_PUBLIC_URL}/success`,
  cancel_url: `${process.env.NEXT_PUBLIC_URL}/cancel`
})

// 2. Redirect zu Stripe
window.location.href = session.url
```

#### **Webhook:**
```typescript
// app/api/webhooks/stripe/route.ts
export async function POST(req: Request) {
  const sig = req.headers.get('stripe-signature')
  const event = stripe.webhooks.constructEvent(
    await req.text(),
    sig!,
    process.env.STRIPE_WEBHOOK_SECRET!
  )
  
  if (event.type === 'checkout.session.completed') {
    // Subscription aktivieren
  }
  
  return new Response('OK', { status: 200 })
}
```

---

## 10. TROUBLESHOOTING

### **10.1 Port bereits belegt**

#### **Problem:**
```
Error: Port 3005 already in use
```

#### **Lösung:**
```powershell
# Port-Belegung prüfen
Get-NetTCPConnection -LocalPort 3005

# Prozess beenden
Stop-Process -Id <ProcessId> -Force

# Oder alle Node-Prozesse
Get-Process node | Stop-Process -Force
```

---

### **10.2 Docker Container startet nicht**

#### **Problem:**
```
Error: Container exits immediately
```

#### **Lösung:**
```powershell
# Logs anzeigen
docker logs <container-name>

# Container neu starten
docker-compose -f docker-compose.dev.yml restart

# Neu bauen
docker-compose -f docker-compose.dev.yml build --no-cache
docker-compose -f docker-compose.dev.yml up -d
```

---

### **10.3 Nginx 404 Fehler**

#### **Problem:**
```
GET /_next/static/... 404
```

#### **Lösung:**
```powershell
# Nginx Konfiguration testen
docker-compose -f docker-compose.dev.yml exec nginx nginx -t

# Nginx neu laden
docker-compose -f docker-compose.dev.yml exec nginx nginx -s reload

# Logs prüfen
docker logs hd_app_chart-nginx-1
```

---

### **10.4 Hetzner Server voll**

#### **Problem:**
```
Disk: 98% belegt
```

#### **Lösung:**
```powershell
# Cleanup-Script ausführen
.\cleanup-hetzner.ps1

# Ergebnis:
# - 40-50GB frei
# - Ungenutzte Volumes gelöscht
# - Build Cache gelöscht
# - Alte Images gelöscht
```

---

### **10.5 Supabase Connection Error**

#### **Problem:**
```
Error: Failed to connect to Supabase
```

#### **Lösung:**
```powershell
# Environment Variables prüfen
cat .env.local | grep SUPABASE

# Supabase Status prüfen
# https://status.supabase.com

# Credentials neu generieren
# Supabase Dashboard → Settings → API
```

---

### **10.6 Stripe Webhook nicht erhalten**

#### **Problem:**
```
Webhook events not received
```

#### **Lösung:**
```powershell
# Webhook Secret prüfen
cat .env.local | grep STRIPE_WEBHOOK

# Stripe CLI für lokale Tests
stripe listen --forward-to localhost:3005/api/webhooks/stripe

# Webhook Logs in Stripe Dashboard prüfen
# https://dashboard.stripe.com/webhooks
```

---

## 📚 WEITERE RESSOURCEN

### **Dokumentation:**
- `DEPLOYMENT-STRATEGY.md` - Deployment-Strategie
- `DEPLOYMENT-QUICK-START.md` - Quick-Start Guide
- `GITHUB-SETUP-COMPLETE.md` - GitHub-Konfiguration
- `GITHUB-SECRETS-SETUP.md` - Secrets-Setup
- `MONITORING-STATUS.md` - Monitoring-Status
- `NGINX-404-FIX.md` - Nginx-Fixes
- `SECURITY.md` - Security Policy

### **Scripts:**
- `cleanup-hetzner.ps1` - Server Cleanup
- `setup-production.ps1` - Production Deployment
- `deploy-staging.ps1` - Staging Deployment
- `deploy-prod-local.ps1` - Prod-Local Deployment

---

## 🎯 ZUSAMMENFASSUNG

### **Tägliche Entwicklung:**
```powershell
cd frontend
npm run dev
# → http://localhost:3005
```

### **Docker Testing:**
```powershell
docker-compose -f docker-compose.dev.yml up -d
# → http://localhost:3000
```

### **Staging Tests:**
```powershell
.\deploy\staging\deploy-staging.ps1
# → http://localhost:3002
```

### **Production Deployment:**
```powershell
.\deploy\production\setup-production.ps1
# → http://138.199.237.34:3000
```

### **Server Cleanup:**
```powershell
.\cleanup-hetzner.ps1
# → 40-50GB frei
```

---

**Ende der Bedienungsanleitung**

**Version**: 1.0  
**Letzte Aktualisierung**: 2025-10-14  
**Status**: Vollständig und getestet

