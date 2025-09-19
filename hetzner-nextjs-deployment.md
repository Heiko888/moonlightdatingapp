# 🚀 HD App - Next.js Deployment auf Hetzner Server

## 📋 Übersicht

Die HD App wird als **Next.js Full-Stack Anwendung** auf Ihrem Hetzner Server (138.199.237.34) deployed. Die App besteht aus:

- **Frontend**: Next.js 15.4.6 mit React 19
- **Backend**: Node.js/Express API (integriert in Next.js)
- **Datenbank**: MongoDB
- **Monitoring**: Grafana + Prometheus

## 🏗️ Architektur

```
Internet → Nginx (Port 80/443) → Next.js App (Port 3000) → MongoDB (Port 27017)
                                ↓
                            Grafana (Port 3001)
                            Prometheus (Port 9090)
```

## 🔧 Production-Konfiguration

### **1. Next.js Production Build**

```bash
# Im frontend-Verzeichnis
npm run build
npm start
```

### **2. Environment-Variablen für Production**

```env
# .env.production
NODE_ENV=production
NEXT_PUBLIC_API_URL=http://138.199.237.34:4001
MONGODB_URI=mongodb://localhost:27017/hdapp
JWT_SECRET=your-super-secret-jwt-key
OPENAI_API_KEY=your-openai-key
PORT=3000
```

### **3. Nginx-Konfiguration für Next.js**

```nginx
# /etc/nginx/sites-available/hd-app
server {
    listen 80;
    server_name 138.199.237.34 your-domain.com;
    
    # Next.js App
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Next.js spezifische Headers
        proxy_set_header X-Forwarded-Host $host;
        proxy_set_header X-Forwarded-Server $host;
    }
    
    # API Routes
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Static Assets
    location /_next/static {
        proxy_pass http://localhost:3000;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

## 🐳 Docker Deployment

### **Dockerfile für Next.js**

```dockerfile
# frontend/Dockerfile
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the application
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### **Docker Compose für Production**

```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  # HD App (Next.js Full-Stack)
  hd-app:
    build: 
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://mongo:27017/hdapp
      - JWT_SECRET=${JWT_SECRET}
      - OPENAI_API_KEY=${OPENAI_API_KEY}
    depends_on:
      - mongo
    networks:
      - hd-network
    restart: unless-stopped

  # MongoDB
  mongo:
    image: mongo:7.0
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db
    networks:
      - hd-network
    restart: unless-stopped

  # Grafana
  grafana:
    image: grafana/grafana:latest
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=${GRAFANA_PASSWORD}
    volumes:
      - grafana_data:/var/lib/grafana
    networks:
      - hd-network
    restart: unless-stopped

  # Prometheus
  prometheus:
    image: prom/prometheus:latest
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus
    networks:
      - hd-network
    restart: unless-stopped

volumes:
  mongo_data:
  grafana_data:
  prometheus_data:

networks:
  hd-network:
    driver: bridge
```

## 🚀 Deployment-Skript

```bash
#!/bin/bash
# deploy-hetzner.sh

echo "🚀 HD App - Hetzner Deployment wird gestartet..."

# 1. Repository klonen/aktualisieren
cd /opt/hd-app
git pull origin main

# 2. Environment-Datei erstellen
cat > .env << EOF
NODE_ENV=production
MONGODB_URI=mongodb://mongo:27017/hdapp
JWT_SECRET=your-super-secret-jwt-key-here
OPENAI_API_KEY=your-openai-key-here
GRAFANA_PASSWORD=admin123
EOF

# 3. Docker Images neu bauen
docker-compose -f docker-compose.prod.yml build --no-cache

# 4. Services stoppen
docker-compose -f docker-compose.prod.yml down

# 5. Services starten
docker-compose -f docker-compose.prod.yml up -d

# 6. Health Check
sleep 30
echo "🔍 Health Check..."
curl -f http://localhost:3000 || echo "❌ App nicht erreichbar"
curl -f http://localhost:3001 || echo "❌ Grafana nicht erreichbar"

echo "✅ Deployment abgeschlossen!"
echo "🌐 URLs:"
echo "  App: http://138.199.237.34:3000"
echo "  Grafana: http://138.199.237.34:3001"
```

## 📊 Monitoring & Logs

### **Logs anzeigen**

```bash
# App Logs
docker-compose -f docker-compose.prod.yml logs -f hd-app

# MongoDB Logs
docker-compose -f docker-compose.prod.yml logs -f mongo

# Alle Logs
docker-compose -f docker-compose.prod.yml logs -f
```

### **Performance überwachen**

```bash
# Docker Stats
docker stats

# System Ressourcen
htop
df -h
free -h
```

## 🔒 SSL/HTTPS Setup

### **Let's Encrypt mit Certbot**

```bash
# Certbot installieren
apt install certbot python3-certbot-nginx -y

# SSL-Zertifikat erstellen
certbot --nginx -d your-domain.com

# Auto-Renewal
crontab -e
# Fügen Sie hinzu:
# 0 12 * * * /usr/bin/certbot renew --quiet
```

## 🎯 Nächste Schritte

1. **Server vorbereiten** (Docker, Nginx, etc.)
2. **Repository klonen** auf den Server
3. **Environment-Variablen** konfigurieren
4. **Docker Compose** starten
5. **Nginx** konfigurieren
6. **SSL-Zertifikat** einrichten
7. **Domain** konfigurieren

---

**🎉 Die HD App läuft als vollständige Next.js Anwendung auf Ihrem Hetzner Server!**
