#!/bin/bash

# 🔍 HD App - Hetzner Server Debug Script
# Diagnostiziert Server-Probleme

echo "🔍 HD App - Server Debug gestartet..."
echo "====================================="

# Farben für Output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_step() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 1. System Status
print_step "System Status prüfen..."
echo "Uptime: $(uptime)"
echo "Memory: $(free -h)"
echo "Disk: $(df -h /)"
echo ""

# 2. Docker Status
print_step "Docker Status prüfen..."
docker ps -a
echo ""

# 3. Docker Compose Status
print_step "Docker Compose Services prüfen..."
if [ -f "docker-compose.supabase.yml" ]; then
    docker-compose -f docker-compose.supabase.yml ps
else
    print_error "docker-compose.supabase.yml nicht gefunden!"
fi
echo ""

# 4. Port Status
print_step "Port Status prüfen..."
netstat -tlnp | grep -E ':(3000|3001|80|443)'
echo ""

# 5. Nginx Status
print_step "Nginx Status prüfen..."
systemctl status nginx --no-pager -l
echo ""

# 6. Nginx Logs
print_step "Nginx Error Logs (letzte 20 Zeilen)..."
tail -20 /var/log/nginx/error.log
echo ""

# 7. Nginx Access Logs
print_step "Nginx Access Logs (letzte 10 Zeilen)..."
tail -10 /var/log/nginx/access.log
echo ""

# 8. Frontend Service prüfen
print_step "Frontend Service prüfen..."
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    print_success "Frontend läuft auf Port 3000"
else
    print_error "Frontend nicht erreichbar auf Port 3000"
fi

# 9. Grafana Service prüfen
print_step "Grafana Service prüfen..."
if curl -f http://localhost:3001 > /dev/null 2>&1; then
    print_success "Grafana läuft auf Port 3001"
else
    print_error "Grafana nicht erreichbar auf Port 3001"
fi

# 10. Docker Logs
print_step "Docker Logs (letzte 20 Zeilen)..."
if [ -f "docker-compose.supabase.yml" ]; then
    docker-compose -f docker-compose.supabase.yml logs --tail=20
else
    print_error "Docker Compose Datei nicht gefunden!"
fi
echo ""

# 11. Environment prüfen
print_step "Environment prüfen..."
if [ -f ".env" ]; then
    print_success ".env Datei gefunden"
    echo "Wichtige Variablen:"
    grep -E "^(NEXT_PUBLIC_|SUPABASE_|JWT_|OPENAI_)" .env | head -5
else
    print_error ".env Datei nicht gefunden!"
fi
echo ""

# 12. Nginx Konfiguration testen
print_step "Nginx Konfiguration testen..."
nginx -t
echo ""

# 13. SSL Zertifikat prüfen
print_step "SSL Zertifikat prüfen..."
if [ -f "/etc/nginx/ssl/cert.pem" ]; then
    print_success "SSL Zertifikat gefunden"
    openssl x509 -in /etc/nginx/ssl/cert.pem -text -noout | grep -E "(Subject:|Not After:)"
else
    print_error "SSL Zertifikat nicht gefunden!"
fi
echo ""

# 14. Empfohlene Aktionen
print_step "🔧 Empfohlene Aktionen:"
echo "1. Services neu starten:"
echo "   docker-compose -f docker-compose.supabase.yml down"
echo "   docker-compose -f docker-compose.supabase.yml up -d"
echo ""
echo "2. Nginx neu starten:"
echo "   systemctl restart nginx"
echo ""
echo "3. Logs überwachen:"
echo "   docker-compose -f docker-compose.supabase.yml logs -f"
echo "   tail -f /var/log/nginx/error.log"
echo ""
echo "4. Frontend manuell starten:"
echo "   cd frontend && npm run build && npm start"
echo ""

print_step "Debug abgeschlossen!"
