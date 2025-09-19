# 🚀 HD App - Next.js Deployment mit Caddy auf Hetzner Server

## 📋 Übersicht

Die HD App wird als **Next.js Full-Stack Anwendung** auf Ihrem Hetzner Server (138.199.237.34) mit **Caddy** als Reverse Proxy deployed.

### **Vorteile von Caddy:**
- ✅ **Automatisches SSL** (Let's Encrypt)
- ✅ **Einfache Konfiguration** (Caddyfile)
- ✅ **HTTP/2 und HTTP/3** Support
- ✅ **Automatische HTTPS-Weiterleitung**
- ✅ **Moderne Performance**

## 🏗️ Architektur

```
Internet → Caddy (Port 80/443) → Next.js App (Port 3000) → MongoDB
                                ↓
                            Grafana (Port 3001)
                            Prometheus (Port 9090)
```

## 🔧 Caddy-Konfiguration

### **Caddyfile für HD App**

```caddyfile
# /etc/caddy/Caddyfile

# Hauptdomain (ersetzen Sie mit Ihrer Domain)
your-domain.com {
    # Next.js App
    reverse_proxy localhost:3000 {
        header_up Host {host}
        header_up X-Real-IP {remote}
        header_up X-Forwarded-For {remote}
        header_up X-Forwarded-Proto {scheme}
    }
    
    # Logging
    log {
        output file /var/log/caddy/hd-app.log
        format json
    }
}

# IP-basierter Zugriff (für Tests)
138.199.237.34 {
    reverse_proxy localhost:3000 {
        header_up Host {host}
        header_up X-Real-IP {remote}
        header_up X-Forwarded-For {remote}
        header_up X-Forwarded-Proto {scheme}
    }
    
    # Temporär für Tests - später entfernen
    tls internal
}

# Grafana Subdomain
grafana.your-domain.com {
    reverse_proxy localhost:3001 {
        header_up Host {host}
        header_up X-Real-IP {remote}
        header_up X-Forwarded-For {remote}
        header_up X-Forwarded-Proto {scheme}
    }
    
    # Basic Auth für Grafana (zusätzliche Sicherheit)
    basicauth {
        admin $2a$14$your-hashed-password-here
    }
}

# Prometheus Subdomain
prometheus.your-domain.com {
    reverse_proxy localhost:9090 {
        header_up Host {host}
        header_up X-Real-IP {remote}
        header_up X-Forwarded-For {remote}
        header_up X-Forwarded-Proto {scheme}
    }
    
    # Basic Auth für Prometheus
    basicauth {
        admin $2a$14$your-hashed-password-here
    }
}
```

### **Erweiterte Caddy-Konfiguration**

```caddyfile
# /etc/caddy/Caddyfile (Erweitert)

# Globale Optionen
{
    # Email für Let's Encrypt
    email your-email@domain.com
    
    # Automatische HTTPS
    auto_https off
}

# HD App Hauptseite
your-domain.com {
    # Next.js App
    reverse_proxy localhost:3000 {
        header_up Host {host}
        header_up X-Real-IP {remote}
        header_up X-Forwarded-For {remote}
        header_up X-Forwarded-Proto {scheme}
        
        # Health Check
        health_uri /api/health
        health_interval 30s
        health_timeout 5s
    }
    
    # Security Headers
    header {
        # HSTS
        Strict-Transport-Security "max-age=31536000; includeSubDomains"
        
        # Content Security Policy
        Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;"
        
        # X-Frame-Options
        X-Frame-Options "SAMEORIGIN"
        
        # X-Content-Type-Options
        X-Content-Type-Options "nosniff"
        
        # Referrer Policy
        Referrer-Policy "strict-origin-when-cross-origin"
    }
    
    # Gzip Compression
    encode gzip
    
    # Logging
    log {
        output file /var/log/caddy/hd-app.log
        format json
        level INFO
    }
    
    # Rate Limiting
    rate_limit {
        zone static {
            key {remote_host}
            events 100
            window 1m
        }
    }
}

# API Subdomain (optional)
api.your-domain.com {
    reverse_proxy localhost:3000 {
        header_up Host {host}
        header_up X-Real-IP {remote}
        header_up X-Forwarded-For {remote}
        header_up X-Forwarded-Proto {scheme}
    }
    
    # API-spezifische Headers
    header {
        Access-Control-Allow-Origin "*"
        Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"
        Access-Control-Allow-Headers "Content-Type, Authorization"
    }
}

# Grafana Dashboard
grafana.your-domain.com {
    reverse_proxy localhost:3001 {
        header_up Host {host}
        header_up X-Real-IP {remote}
        header_up X-Forwarded-For {remote}
        header_up X-Forwarded-Proto {scheme}
    }
    
    # Basic Auth
    basicauth {
        admin $2a$14$your-hashed-password-here
    }
    
    # Grafana-spezifische Headers
    header {
        X-Frame-Options "SAMEORIGIN"
    }
}

# Prometheus Metrics
prometheus.your-domain.com {
    reverse_proxy localhost:9090 {
        header_up Host {host}
        header_up X-Real-IP {remote}
        header_up X-Forwarded-For {remote}
        header_up X-Forwarded-Proto {scheme}
    }
    
    # Basic Auth
    basicauth {
        admin $2a$14$your-hashed-password-here
    }
}
```

## 🐳 Docker Compose mit Caddy

```yaml
# docker-compose.caddy.yml
version: '3.8'

services:
  # Caddy Reverse Proxy
  caddy:
    image: caddy:2-alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile
      - caddy_data:/data
      - caddy_config:/config
      - /var/log/caddy:/var/log/caddy
    networks:
      - hd-network
    restart: unless-stopped

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
      - NEXT_PUBLIC_API_URL=https://your-domain.com
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
      - GF_SERVER_ROOT_URL=https://grafana.your-domain.com
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
  caddy_data:
  caddy_config:
  mongo_data:
  grafana_data:
  prometheus_data:

networks:
  hd-network:
    driver: bridge
```

## 🚀 Caddy Deployment-Skript

```bash
#!/bin/bash
# deploy-caddy-hetzner.sh

echo "🚀 HD App - Caddy Deployment auf Hetzner Server..."

# Farben
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

# Schritt 1: Caddy installieren
log_info "Caddy wird installiert..."
apt install -y debian-keyring debian-archive-keyring apt-transport-https
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | tee /etc/apt/sources.list.d/caddy-stable.list
apt update
apt install caddy
log_success "Caddy installiert"

# Schritt 2: Caddyfile erstellen
log_info "Caddyfile wird erstellt..."
cat > /etc/caddy/Caddyfile << 'EOF'
# HD App Caddyfile
your-domain.com {
    reverse_proxy localhost:3000 {
        header_up Host {host}
        header_up X-Real-IP {remote}
        header_up X-Forwarded-For {remote}
        header_up X-Forwarded-Proto {scheme}
    }
    
    # Security Headers
    header {
        Strict-Transport-Security "max-age=31536000; includeSubDomains"
        X-Frame-Options "SAMEORIGIN"
        X-Content-Type-Options "nosniff"
    }
    
    # Compression
    encode gzip
    
    # Logging
    log {
        output file /var/log/caddy/hd-app.log
        format json
    }
}

# IP-basierter Zugriff (temporär)
138.199.237.34 {
    reverse_proxy localhost:3000 {
        header_up Host {host}
        header_up X-Real-IP {remote}
        header_up X-Forwarded-For {remote}
        header_up X-Forwarded-Proto {scheme}
    }
    tls internal
}

# Grafana
grafana.your-domain.com {
    reverse_proxy localhost:3001 {
        header_up Host {host}
        header_up X-Real-IP {remote}
        header_up X-Forwarded-For {remote}
        header_up X-Forwarded-Proto {scheme}
    }
}

# Prometheus
prometheus.your-domain.com {
    reverse_proxy localhost:9090 {
        header_up Host {host}
        header_up X-Real-IP {remote}
        header_up X-Forwarded-For {remote}
        header_up X-Forwarded-Proto {scheme}
    }
}
EOF
log_success "Caddyfile erstellt"

# Schritt 3: Log-Verzeichnis erstellen
log_info "Log-Verzeichnis wird erstellt..."
mkdir -p /var/log/caddy
chown caddy:caddy /var/log/caddy
log_success "Log-Verzeichnis erstellt"

# Schritt 4: Caddy starten
log_info "Caddy wird gestartet..."
systemctl enable caddy
systemctl start caddy
systemctl status caddy
log_success "Caddy gestartet"

# Schritt 5: Firewall anpassen
log_info "Firewall wird konfiguriert..."
ufw allow 80
ufw allow 443
ufw allow 22
ufw allow 3000  # Temporär für Tests
ufw allow 3001  # Grafana
ufw allow 9090  # Prometheus
log_success "Firewall konfiguriert"

echo ""
log_success "🎉 Caddy Deployment abgeschlossen!"
echo ""
echo "🌐 Verfügbare URLs:"
echo "==================="
echo "HD App:     https://your-domain.com"
echo "IP Test:    https://138.199.237.34 (temporär)"
echo "Grafana:    https://grafana.your-domain.com"
echo "Prometheus: https://prometheus.your-domain.com"
echo ""
echo "📊 Nützliche Befehle:"
echo "====================="
echo "Caddy Status:    systemctl status caddy"
echo "Caddy Logs:      journalctl -u caddy -f"
echo "Caddy Reload:    caddy reload --config /etc/caddy/Caddyfile"
echo "Caddy Validate:  caddy validate --config /etc/caddy/Caddyfile"
echo ""
echo "🔧 Nächste Schritte:"
echo "===================="
echo "1. Domain in Caddyfile anpassen"
echo "2. DNS auf Server zeigen lassen"
echo "3. HD App starten"
echo "4. SSL wird automatisch eingerichtet!"
```

## 🔒 SSL mit Caddy

### **Automatisches SSL**
Caddy richtet automatisch SSL ein:
- ✅ **Let's Encrypt** Zertifikate
- ✅ **Automatische Erneuerung**
- ✅ **HTTP → HTTPS** Weiterleitung
- ✅ **HTTP/2 und HTTP/3**

### **Manuelle SSL-Konfiguration**
```caddyfile
your-domain.com {
    tls your-email@domain.com {
        # Custom SSL options
    }
    
    reverse_proxy localhost:3000
}
```

## 📊 Monitoring mit Caddy

### **Caddy Metriken**
```caddyfile
# Metriken-Endpunkt
:2019/metrics {
    prometheus
}
```

### **Log-Analyse**
```bash
# Caddy Logs anzeigen
journalctl -u caddy -f

# Log-Dateien
tail -f /var/log/caddy/hd-app.log
```

## 🎯 Vorteile von Caddy vs. Nginx

| Feature | Caddy | Nginx |
|---------|-------|-------|
| SSL Setup | ✅ Automatisch | ❌ Manuell |
| Konfiguration | ✅ Einfach | ❌ Komplex |
| HTTP/3 | ✅ Standard | ❌ Experimental |
| Performance | ✅ Sehr gut | ✅ Sehr gut |
| Community | ✅ Wachsend | ✅ Etabliert |

---

**🎉 Mit Caddy haben Sie eine moderne, sichere und einfache Lösung für Ihre HD App!**
