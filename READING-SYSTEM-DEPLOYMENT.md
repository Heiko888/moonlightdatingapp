# 🚀 Reading-System Deployment Guide

## Übersicht

Das Reading-System kann auf mehrere Arten deployed werden. Hier sind die zwei empfohlenen Optionen:

---

## 🎯 Option 1: Vercel (Empfohlen - Am Einfachsten)

**Vorteile:**
- ✅ Optimiert für Next.js
- ✅ Automatisches CI/CD
- ✅ Kostenlos für kleine Projekte
- ✅ Serverless Functions für APIs
- ✅ Kein Server-Management nötig

### Schritt 1: Vercel CLI installieren

```bash
npm install -g vercel
```

### Schritt 2: Projekt vorbereiten

```bash
cd c:\AppProgrammierung\Projekte\HD_App_chart\frontend
```

### Schritt 3: Login bei Vercel

```bash
vercel login
```

### Schritt 4: Umgebungsvariablen setzen

Erstelle `.env.production` im `frontend/` Ordner:

```env
# E-Mail-Service (SendGrid/Resend)
EMAIL_API_KEY=your_api_key_here
EMAIL_FROM=noreply@yourdomain.com
COACH_EMAIL=coach@yourdomain.com

# Datenbank (Optional - für In-Memory Store nicht nötig)
# DATABASE_URL=postgresql://...

# PDF Storage (Optional)
# PDF_STORAGE_URL=https://...

# Next.js
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

### Schritt 5: Deployment starten

```bash
# Test-Deployment (Preview)
vercel

# Production-Deployment
vercel --prod
```

### Schritt 6: Umgebungsvariablen in Vercel Dashboard setzen

1. Gehe zu https://vercel.com/dashboard
2. Wähle dein Projekt
3. Settings → Environment Variables
4. Füge alle Variablen aus `.env.production` hinzu
5. Redeploy: Deployments → Latest → Redeploy

### Schritt 7: Custom Domain (Optional)

1. Settings → Domains
2. Füge deine Domain hinzu: `reading.yourdomain.com`
3. DNS-Einstellungen anpassen (wird angezeigt)

---

## 🖥️ Option 2: Hetzner Server (Deine bestehende Infrastruktur)

**Vorteile:**
- ✅ Volle Kontrolle
- ✅ Bereits vorhandene Infrastruktur
- ✅ Günstig für viele User
- ✅ Eigener Server

### Schritt 1: Reading-System zu Docker hinzufügen

Erstelle `frontend/Dockerfile.reading`:

```dockerfile
FROM node:18-alpine AS base

# Dependencies
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Runner
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3005
ENV PORT 3005

CMD ["node", "server.js"]
```

### Schritt 2: Docker Compose erweitern

Erstelle `docker-compose.reading.yml`:

```yaml
version: '3.8'

services:
  frontend-reading:
    build:
      context: ./frontend
      dockerfile: Dockerfile.reading
    container_name: hd-reading-frontend
    restart: always
    ports:
      - "3005:3005"
    environment:
      - NODE_ENV=production
      - EMAIL_API_KEY=${EMAIL_API_KEY}
      - EMAIL_FROM=${EMAIL_FROM}
      - COACH_EMAIL=${COACH_EMAIL}
      - DATABASE_URL=${DATABASE_URL}
    networks:
      - hd-network
    depends_on:
      - redis
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:3005/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  nginx-reading:
    image: nginx:alpine
    container_name: hd-reading-nginx
    restart: always
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx-reading.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/ssl:/etc/nginx/ssl:ro
    networks:
      - hd-network
    depends_on:
      - frontend-reading

networks:
  hd-network:
    driver: bridge

volumes:
  redis-data:
```

### Schritt 3: Nginx Konfiguration

Erstelle `nginx/nginx-reading.conf`:

```nginx
upstream reading_frontend {
    server frontend-reading:3005;
}

server {
    listen 80;
    server_name reading.yourdomain.com;
    
    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name reading.yourdomain.com;

    ssl_certificate /etc/nginx/ssl/fullchain.pem;
    ssl_certificate_key /etc/nginx/ssl/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    location / {
        proxy_pass http://reading_frontend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # API Routes
    location /api/ {
        proxy_pass http://reading_frontend;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Schritt 4: Deployment-Skript erstellen

Erstelle `deploy/reading/deploy-reading.ps1`:

```powershell
# ===========================================
# READING SYSTEM DEPLOYMENT
# ===========================================

Write-Host "`n🚀 READING SYSTEM DEPLOYMENT" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

# 1. Git Pull
Write-Host "`n1. Code aktualisieren..." -ForegroundColor Yellow
git pull origin main

# 2. Alte Container stoppen
Write-Host "`n2. Alte Container stoppen..." -ForegroundColor Yellow
docker-compose -f docker-compose.reading.yml down

# 3. Docker Build
Write-Host "`n3. Docker Build..." -ForegroundColor Yellow
docker-compose -f docker-compose.reading.yml build --no-cache frontend-reading

# 4. Container starten
Write-Host "`n4. Container starten..." -ForegroundColor Yellow
docker-compose -f docker-compose.reading.yml up -d

# 5. Warten auf Start
Write-Host "`n5. Warten auf Container-Start..." -ForegroundColor Yellow
Start-Sleep -Seconds 20

# 6. Health Check
Write-Host "`n6. Health Check..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3005/api/health" -TimeoutSec 10
    if ($response.StatusCode -eq 200) {
        Write-Host "   ✅ Reading System: OK" -ForegroundColor Green
    }
} catch {
    Write-Host "   ❌ Reading System: FEHLER" -ForegroundColor Red
    Write-Host "   Logs anzeigen: docker logs hd-reading-frontend" -ForegroundColor Yellow
}

# 7. Container Status
Write-Host "`n7. Container Status..." -ForegroundColor Yellow
docker-compose -f docker-compose.reading.yml ps

Write-Host "`n✅ DEPLOYMENT ABGESCHLOSSEN" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green
Write-Host "`nZugriff:" -ForegroundColor Cyan
Write-Host "   • Reading System: http://localhost:3005" -ForegroundColor White
Write-Host "   • Coach Dashboard: http://localhost:3005/coach/dashboard" -ForegroundColor White
Write-Host ""
```

### Schritt 5: Auf Server deployen

```powershell
# Lokal testen
.\deploy\reading\deploy-reading.ps1

# Auf Hetzner Server
ssh root@your-server-ip
cd /root/hd-app
git pull
./deploy/reading/deploy-reading.ps1
```

---

## 📦 Datenbank-Integration (Produktion)

Für Production solltest du den In-Memory Store durch eine echte Datenbank ersetzen:

### Option A: Supabase (Empfohlen)

```bash
npm install @supabase/supabase-js
```

**Schema erstellen:**

```sql
-- readings table
CREATE TABLE readings (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    title TEXT NOT NULL,
    question TEXT NOT NULL,
    category TEXT NOT NULL,
    dating_type TEXT,
    birthdate DATE NOT NULL,
    birthtime TIME NOT NULL,
    birthplace TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    status TEXT DEFAULT 'pending',
    content TEXT,
    pdf_url TEXT,
    zoom_link TEXT,
    zoom_date TIMESTAMPTZ,
    coach_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_readings_user_id ON readings(user_id);
CREATE INDEX idx_readings_status ON readings(status);
CREATE INDEX idx_readings_created_at ON readings(created_at DESC);
```

**API anpassen:**

```typescript
// frontend/lib/db/supabase.ts
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

// In API Routes verwenden
const { data, error } = await supabase
  .from('readings')
  .insert([newReading]);
```

### Option B: PostgreSQL (Selbst-gehostet)

```yaml
# docker-compose.reading.yml
services:
  postgres:
    image: postgres:15-alpine
    container_name: hd-reading-db
    restart: always
    environment:
      POSTGRES_DB: reading_db
      POSTGRES_USER: reading_user
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres-data:/var/lib/postgresql/data
    networks:
      - hd-network
    ports:
      - "5432:5432"

volumes:
  postgres-data:
```

---

## 📧 E-Mail-Service Setup (Produktion)

### Option A: Resend (Empfohlen für Next.js)

```bash
npm install resend
```

```typescript
// frontend/lib/email/emailService.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

private async sendEmail(data: EmailData): Promise<boolean> {
  try {
    const result = await resend.emails.send({
      from: 'Reading System <onboarding@resend.dev>',
      to: data.to,
      subject: data.subject,
      html: data.html
    });
    return true;
  } catch (error) {
    console.error('E-Mail-Fehler:', error);
    return false;
  }
}
```

**Setup:**
1. Registriere bei https://resend.com
2. API-Key kopieren
3. Umgebungsvariable setzen: `RESEND_API_KEY=re_xxx`

### Option B: SendGrid

```bash
npm install @sendgrid/mail
```

```typescript
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

await sgMail.send({
  to: data.to,
  from: process.env.EMAIL_FROM!,
  subject: data.subject,
  html: data.html
});
```

---

## 📄 PDF-Generierung Setup (Produktion)

### Option: Puppeteer (Empfohlen)

```bash
npm install puppeteer
```

```typescript
// frontend/lib/pdf/pdfGenerator.ts
import puppeteer from 'puppeteer';

async generateReadingPDF(data: ReadingPDFData): Promise<string> {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  
  // HTML-Template rendern
  const html = this.generateHTMLTemplate(data);
  await page.setContent(html);
  
  // PDF generieren
  const pdf = await page.pdf({
    format: 'A4',
    printBackground: true,
    margin: {
      top: '1cm',
      right: '1cm',
      bottom: '1cm',
      left: '1cm'
    }
  });
  
  await browser.close();
  
  // PDF hochladen (z.B. zu S3)
  const pdfUrl = await this.uploadToStorage(pdf, `reading_${data.id}.pdf`);
  
  return pdfUrl;
}
```

---

## 🔒 Sicherheit & Authentifizierung

### Coach-Dashboard schützen

```typescript
// frontend/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Prüfe ob Coach-Route
  if (request.nextUrl.pathname.startsWith('/coach')) {
    const token = request.cookies.get('auth-token');
    
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    
    // Prüfe Coach-Berechtigung
    // ... JWT validieren ...
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: '/coach/:path*'
};
```

---

## 🎯 Deployment Checklist

### Vor dem Deployment:

- [ ] Alle Tests lokal durchgeführt
- [ ] Umgebungsvariablen vorbereitet
- [ ] E-Mail-Service konfiguriert (Resend/SendGrid)
- [ ] Datenbank eingerichtet (Supabase/PostgreSQL)
- [ ] PDF-Generierung getestet
- [ ] SSL-Zertifikate vorhanden (für Hetzner)
- [ ] Domain/Subdomain konfiguriert
- [ ] Backup-Strategie definiert

### Nach dem Deployment:

- [ ] Health-Checks erfolgreich
- [ ] API-Endpunkte erreichbar
- [ ] Reading erstellen funktioniert
- [ ] E-Mails werden versendet
- [ ] PDF-Generierung funktioniert
- [ ] Coach-Dashboard erreichbar
- [ ] Status-Updates funktionieren
- [ ] Monitoring aktiv (Sentry/Vercel Analytics)

---

## 📊 Monitoring Setup

### Sentry für Error-Tracking

```bash
npm install @sentry/nextjs
```

```typescript
// sentry.client.config.ts
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});
```

---

## 🚀 Quick Deploy Commands

### Vercel:
```bash
cd frontend
vercel --prod
```

### Hetzner:
```bash
ssh root@your-server
cd /root/hd-app
git pull
.\deploy\reading\deploy-reading.ps1
```

### Lokal testen:
```bash
cd frontend
npm run build
npm run start
```

---

## 💰 Kosten-Übersicht

### Vercel (Hobby Plan):
- ✅ **Kostenlos** bis 100 GB Bandwidth
- ✅ Unbegrenzte Requests
- ✅ Serverless Functions inkl.

### Hetzner Server:
- 💰 **~5€/Monat** (CX11)
- ✅ Volle Kontrolle
- ✅ Unbegrenzt Traffic

### Zusätzliche Services:
- **Resend:** Kostenlos bis 3.000 E-Mails/Monat
- **Supabase:** Kostenlos bis 500 MB
- **Sentry:** Kostenlos bis 5.000 Events/Monat

---

**Empfehlung:** Starte mit **Vercel** für schnelles Deployment, wechsle später zu Hetzner wenn du mehr Kontrolle brauchst.

**Support:** Bei Fragen zum Deployment melde dich! 💬

