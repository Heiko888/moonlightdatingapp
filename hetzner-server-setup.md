# 🚀 HD App - Hetzner Server Setup (138.199.237.34)

## 📋 Server-Informationen

- **IP-Adresse**: 138.199.237.34
- **Provider**: Hetzner
- **Ziel**: Production Deployment der HD App

## 🔧 Setup-Schritte

### 1. Server-Zugang einrichten

```bash
# SSH-Verbindung zum Server
ssh root@138.199.237.34

# Oder mit SSH-Key (empfohlen)
ssh -i ~/.ssh/hetzner_key root@138.199.237.34
```

### 2. System aktualisieren

```bash
# Ubuntu/Debian
apt update && apt upgrade -y

# CentOS/RHEL
yum update -y
```

### 3. Docker installieren

```bash
# Docker installieren
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Docker Compose installieren
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Docker starten
systemctl start docker
systemctl enable docker
```

### 4. Node.js installieren (für Development)

```bash
# Node.js 20.x installieren
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
apt-get install -y nodejs

# Oder mit nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 20
nvm use 20
```

### 5. Firewall konfigurieren

```bash
# UFW aktivieren
ufw enable

# Ports öffnen
ufw allow 22    # SSH
ufw allow 80    # HTTP
ufw allow 443   # HTTPS
ufw allow 3000  # Frontend (temporär)
ufw allow 4001  # Backend (temporär)
ufw allow 3001  # Grafana
ufw allow 9090  # Prometheus

# Status prüfen
ufw status
```

### 6. Nginx installieren (für Reverse Proxy)

```bash
# Nginx installieren
apt install nginx -y

# Nginx starten
systemctl start nginx
systemctl enable nginx
```

## 🚀 Deployment-Optionen

### Option 1: Docker Compose (Empfohlen)

```bash
# Repository klonen
git clone <your-repo-url> /opt/hd-app
cd /opt/hd-app

# Environment-Datei erstellen
cp env.example .env

# .env anpassen für Production
nano .env
```

**Production .env Konfiguration:**

```env
NODE_ENV=production
PORT=4001
MONGO_URI=mongodb://mongo:27017/hdapp
JWT_SECRET=your-super-secret-jwt-key
OPENAI_API_KEY=your-openai-key
NEXT_PUBLIC_API_URL=http://138.199.237.34:4001
```

```bash
# Services starten
docker-compose up -d

# Logs prüfen
docker-compose logs -f
```

### Option 2: Kubernetes (für Skalierung)

```bash
# Kubernetes installieren
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl

# Minikube oder k3s installieren
curl -sfL https://get.k3s.io | sh -

# Deployment starten
kubectl apply -k k8s/
```

## 🌐 Nginx-Konfiguration

### Frontend (Port 80/443)

```nginx
# /etc/nginx/sites-available/hd-app
server {
    listen 80;
    server_name 138.199.237.34 your-domain.com;
    
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
    }
}
```

### Backend API (Port 80/443/api)

```nginx
server {
    listen 80;
    server_name 138.199.237.34 your-domain.com;
    
    location /api {
        proxy_pass http://localhost:4001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Nginx-Konfiguration aktivieren
ln -s /etc/nginx/sites-available/hd-app /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

## 🔒 SSL-Zertifikat (Let's Encrypt)

```bash
# Certbot installieren
apt install certbot python3-certbot-nginx -y

# SSL-Zertifikat erstellen
certbot --nginx -d your-domain.com

# Auto-Renewal testen
certbot renew --dry-run
```

## 📊 Monitoring einrichten

### Grafana Dashboard

```bash
# Grafana ist bereits in docker-compose.yml enthalten
# Zugriff: http://138.199.237.34:3001
# Login: admin/admin
```

### Prometheus Metriken

```bash
# Prometheus ist bereits in docker-compose.yml enthalten
# Zugriff: http://138.199.237.34:9090
```

## 🔄 Deployment-Skript

```bash
#!/bin/bash
# deploy.sh

echo "🚀 HD App Deployment auf Hetzner Server..."

# Repository aktualisieren
cd /opt/hd-app
git pull origin main

# Docker Images neu bauen
docker-compose build --no-cache

# Services neu starten
docker-compose down
docker-compose up -d

# Health Check
sleep 30
curl -f http://localhost:3000 || echo "❌ Frontend nicht erreichbar"
curl -f http://localhost:4001/api/health || echo "❌ Backend nicht erreichbar"

echo "✅ Deployment abgeschlossen!"
```

## 🎯 URLs nach Deployment

- **Frontend**: [http://138.199.237.34:3000](http://138.199.237.34:3000)
- **Backend API**: [http://138.199.237.34:4001](http://138.199.237.34:4001)
- **Grafana**: [http://138.199.237.34:3001](http://138.199.237.34:3001)
- **Prometheus**: [http://138.199.237.34:9090](http://138.199.237.34:9090)

## 🔧 Troubleshooting

### Logs anzeigen

```bash
# Docker Logs
docker-compose logs -f hd-frontend
docker-compose logs -f hd-backend
docker-compose logs -f mongo

# System Logs
journalctl -u docker -f
journalctl -u nginx -f
```

### Ports prüfen

```bash
# Offene Ports
netstat -tlnp
ss -tlnp

# Firewall Status
ufw status
```

### Performance überwachen

```bash
# System-Ressourcen
htop
df -h
free -h

# Docker Stats
docker stats
```

## 📈 Nächste Schritte

1. **Domain konfigurieren** (DNS auf 138.199.237.34 zeigen lassen)
2. **SSL-Zertifikat** mit Let's Encrypt einrichten
3. **Backup-Strategie** für MongoDB implementieren
4. **CI/CD-Pipeline** für automatische Deployments
5. **Monitoring-Alerts** konfigurieren

---

**🎉 Die HD App läuft jetzt auf Ihrem Hetzner Server!**
