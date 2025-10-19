#!/bin/bash

# 🚀 HD App - Alle Server neu starten
# Führt einen kompletten Reboot aller Services durch

echo "🚀 HD App - Alle Server werden neu gestartet..."
echo "=============================================="

# Farben für Output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Funktionen für farbige Ausgabe
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

print_info() {
    echo -e "${CYAN}[INFO]${NC} $1"
}

# 1. Zum App-Verzeichnis wechseln
print_step "Zum App-Verzeichnis wechseln..."
if [ -d "/opt/hd-app/HD_App_chart" ]; then
    cd /opt/hd-app/HD_App_chart
    print_success "Im App-Verzeichnis: $(pwd)"
elif [ -d "./HD_App_chart" ]; then
    cd ./HD_App_chart
    print_success "Im lokalen App-Verzeichnis: $(pwd)"
else
    print_error "App-Verzeichnis nicht gefunden!"
    print_info "Versuche im aktuellen Verzeichnis zu arbeiten..."
fi

# 2. Docker Services stoppen
print_step "Docker Services stoppen..."
if [ -f "docker-compose.supabase.yml" ]; then
    docker-compose -f docker-compose.supabase.yml down || true
    print_success "Supabase Services gestoppt"
fi

if [ -f "docker-compose.frontend.yml" ]; then
    docker-compose -f docker-compose.frontend.yml down || true
    print_success "Frontend Services gestoppt"
fi

# 3. Alle laufenden Container stoppen
print_step "Alle laufenden Container stoppen..."
docker stop $(docker ps -q) 2>/dev/null || true
print_success "Alle Container gestoppt"

# 4. Docker System bereinigen
print_step "Docker System bereinigen..."
docker system prune -f || true
print_success "Docker System bereinigt"

# 5. Nginx stoppen
print_step "Nginx stoppen..."
systemctl stop nginx 2>/dev/null || true
print_success "Nginx gestoppt"

# 6. System Services neu starten
print_step "System Services neu starten..."

# Docker Service
if systemctl is-active --quiet docker; then
    print_success "Docker Service läuft bereits"
else
    print_step "Docker Service starten..."
    systemctl start docker
    systemctl enable docker
    print_success "Docker Service gestartet"
fi

# Nginx Service
print_step "Nginx Service starten..."
systemctl start nginx
systemctl enable nginx
print_success "Nginx Service gestartet"

# 7. Docker Services neu starten
print_step "Docker Services neu starten..."

# Supabase Services starten
if [ -f "docker-compose.supabase.yml" ]; then
    print_step "Supabase Services starten..."
    docker-compose -f docker-compose.supabase.yml up -d --build
    print_success "Supabase Services gestartet"
fi

# Frontend Services starten (falls separat)
if [ -f "docker-compose.frontend.yml" ]; then
    print_step "Frontend Services starten..."
    docker-compose -f docker-compose.frontend.yml up -d --build
    print_success "Frontend Services gestartet"
fi

# 8. Warten bis Services laufen
print_step "Warten bis Services gestartet sind..."
sleep 30

# 9. Nginx Konfiguration testen und neu laden
print_step "Nginx Konfiguration testen..."
if nginx -t; then
    print_success "Nginx Konfiguration OK"
    systemctl reload nginx
    print_success "Nginx neu geladen"
else
    print_error "Nginx Konfiguration fehlerhaft!"
    print_info "Versuche Nginx-Konfiguration zu reparieren..."
    if [ -f "nginx-config-fix.sh" ]; then
        chmod +x nginx-config-fix.sh
        ./nginx-config-fix.sh
    fi
fi

# 10. SSL-Zertifikat prüfen
print_step "SSL-Zertifikat prüfen..."
if command -v certbot &> /dev/null; then
    if certbot certificates 2>/dev/null | grep -q "VALID"; then
        print_success "SSL-Zertifikat ist gültig"
    else
        print_warning "SSL-Zertifikat prüfen..."
        certbot renew --dry-run
    fi
else
    print_warning "Certbot nicht installiert - SSL-Prüfung übersprungen"
fi

# 11. Firewall Status prüfen
print_step "Firewall Status prüfen..."
if command -v ufw &> /dev/null; then
    if ufw status | grep -q "Status: active"; then
        print_success "Firewall ist aktiv"
        # Wichtige Ports freigeben
        ufw allow 80/tcp
        ufw allow 443/tcp
        ufw allow 3000/tcp
        ufw allow 3001/tcp
        ufw allow 9090/tcp
        ufw allow 9100/tcp
        print_success "Ports freigegeben"
    else
        print_warning "Firewall ist nicht aktiv"
    fi
else
    print_warning "UFW nicht installiert - Firewall-Prüfung übersprungen"
fi

# 12. Services Status prüfen
print_step "Services Status prüfen..."
echo ""
echo "=== DOCKER SERVICES STATUS ==="
if [ -f "docker-compose.supabase.yml" ]; then
    docker-compose -f docker-compose.supabase.yml ps
fi

echo ""
echo "=== NGINX STATUS ==="
systemctl status nginx --no-pager -l

echo ""
echo "=== PORT STATUS ==="
netstat -tlnp | grep -E ':(80|443|3000|3001|9090|9100)' || echo "Keine relevanten Ports gefunden"

# 13. Health Checks
print_step "Health Checks durchführen..."

# Frontend Test
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    print_success "Frontend läuft auf Port 3000"
else
    print_error "Frontend NICHT erreichbar auf Port 3000"
fi

# Grafana Test
if curl -f http://localhost:3001 > /dev/null 2>&1; then
    print_success "Grafana läuft auf Port 3001"
else
    print_error "Grafana NICHT erreichbar auf Port 3001"
fi

# Prometheus Test
if curl -f http://localhost:9090 > /dev/null 2>&1; then
    print_success "Prometheus läuft auf Port 9090"
else
    print_error "Prometheus NICHT erreichbar auf Port 9090"
fi

# Node Exporter Test
if curl -f http://localhost:9100 > /dev/null 2>&1; then
    print_success "Node Exporter läuft auf Port 9100"
else
    print_error "Node Exporter NICHT erreichbar auf Port 9100"
fi

# HTTP Test
if curl -f http://localhost:80 > /dev/null 2>&1; then
    print_success "HTTP läuft auf Port 80"
else
    print_error "HTTP NICHT erreichbar auf Port 80"
fi

# HTTPS Test
if curl -f -k https://localhost:443 > /dev/null 2>&1; then
    print_success "HTTPS läuft auf Port 443"
else
    print_error "HTTPS NICHT erreichbar auf Port 443"
fi

# 14. Domain Test (falls konfiguriert)
DOMAIN="www.the-connection-key.de"
print_step "Domain Test: $DOMAIN"
if curl -f https://$DOMAIN > /dev/null 2>&1; then
    print_success "Domain ist erreichbar: https://$DOMAIN"
else
    print_error "Domain NICHT erreichbar: $DOMAIN"
fi

# 15. Finale Status-Ausgabe
echo ""
print_success "🎉 Alle Server wurden neu gestartet!"
echo ""
print_info "📋 Zugriff auf Ihre Services:"
print_info "  • Frontend: http://138.199.237.34:3000"
print_info "  • Grafana: http://138.199.237.34:3001"
print_info "  • Prometheus: http://138.199.237.34:9090"
print_info "  • Node Exporter: http://138.199.237.34:9100"
print_info "  • Domain: https://$DOMAIN"
echo ""
print_info "🔧 Nützliche Befehle:"
print_info "  • Services Status: docker-compose -f docker-compose.supabase.yml ps"
print_info "  • Logs anzeigen: docker-compose -f docker-compose.supabase.yml logs -f"
print_info "  • Nginx Logs: tail -f /var/log/nginx/error.log"
print_info "  • Server-Diagnose: ./deploy/hetzner/check-server-errors.sh"
print_info "  • Auto-Recovery: ./deploy/hetzner/auto-recovery.sh"
echo ""

# 16. Logs anzeigen (letzte 10 Zeilen)
print_step "Letzte Docker Logs:"
if [ -f "docker-compose.supabase.yml" ]; then
    docker-compose -f docker-compose.supabase.yml logs --tail=10
fi

print_success "Reboot aller Server abgeschlossen!"
