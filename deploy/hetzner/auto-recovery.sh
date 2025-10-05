#!/bin/bash

# 🚀 HD App - Automatische Server-Wiederherstellung
# Führt alle notwendigen Schritte zur Wiederherstellung der Services aus

echo "🚀 HD App - Automatische Server-Wiederherstellung gestartet..."
echo "============================================================="

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

# 1. Zum App-Verzeichnis wechseln
print_step "Zum App-Verzeichnis wechseln..."
cd /opt/hd-app/HD_App_chart || {
    print_error "App-Verzeichnis nicht gefunden!"
    exit 1
}
print_success "Im App-Verzeichnis: $(pwd)"

# 2. Git Status prüfen und aktualisieren
print_step "Git Repository aktualisieren..."
git fetch origin
git pull origin main
print_success "Repository aktualisiert"

# 3. Docker Services stoppen
print_step "Bestehende Docker Services stoppen..."
docker-compose -f docker-compose.supabase.yml down || true
print_success "Docker Services gestoppt"

# 4. Docker System bereinigen (optional)
print_step "Docker System bereinigen..."
docker system prune -f || true
print_success "Docker System bereinigt"

# 5. Docker Services neu starten
print_step "Docker Services neu starten..."
docker-compose -f docker-compose.supabase.yml up -d --build
print_success "Docker Services gestartet"

# 6. Warten bis Services laufen
print_step "Warten bis Services gestartet sind..."
sleep 30

# 7. Nginx Status prüfen und starten
print_step "Nginx Status prüfen..."
if systemctl is-active --quiet nginx; then
    print_success "Nginx läuft bereits"
else
    print_step "Nginx starten..."
    systemctl start nginx
    systemctl enable nginx
    print_success "Nginx gestartet"
fi

# 8. Nginx Konfiguration testen
print_step "Nginx Konfiguration testen..."
if nginx -t; then
    print_success "Nginx Konfiguration OK"
    systemctl reload nginx
else
    print_error "Nginx Konfiguration fehlerhaft!"
fi

# 9. SSL-Zertifikat prüfen
print_step "SSL-Zertifikat prüfen..."
if certbot certificates 2>/dev/null | grep -q "VALID"; then
    print_success "SSL-Zertifikat ist gültig"
else
    print_warning "SSL-Zertifikat prüfen..."
    certbot renew --dry-run
fi

# 10. Firewall Status prüfen
print_step "Firewall Status prüfen..."
if ufw status | grep -q "Status: active"; then
    print_success "Firewall ist aktiv"
    # Wichtige Ports freigeben
    ufw allow 80/tcp
    ufw allow 443/tcp
    ufw allow 3000/tcp
    ufw allow 3001/tcp
    ufw allow 9090/tcp
    print_success "Ports freigegeben"
else
    print_warning "Firewall ist nicht aktiv"
fi

# 11. Services Status prüfen
print_step "Services Status prüfen..."
echo ""
echo "=== DOCKER SERVICES STATUS ==="
docker-compose -f docker-compose.supabase.yml ps

echo ""
echo "=== NGINX STATUS ==="
systemctl status nginx --no-pager -l

echo ""
echo "=== PORT STATUS ==="
netstat -tlnp | grep -E ':(80|443|3000|3001|9090)' || echo "Keine relevanten Ports gefunden"

# 12. Health Checks
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

# 13. Domain Test (falls konfiguriert)
DOMAIN="moonlightdatingapp.werdemeisterdeinergedanken.de"
print_step "Domain Test: $DOMAIN"
if curl -f https://$DOMAIN > /dev/null 2>&1; then
    print_success "Domain ist erreichbar: https://$DOMAIN"
else
    print_error "Domain NICHT erreichbar: $DOMAIN"
fi

# 14. Finale Status-Ausgabe
echo ""
print_success "🎉 Automatische Wiederherstellung abgeschlossen!"
echo ""
echo "📋 Zugriff auf Ihre Services:"
echo "  • Frontend: http://138.199.237.34:3000"
echo "  • Grafana: http://138.199.237.34:3001"
echo "  • Prometheus: http://138.199.237.34:9090"
echo "  • Domain: https://$DOMAIN"
echo ""
echo "🔧 Nützliche Befehle:"
echo "  • Services Status: docker-compose -f docker-compose.supabase.yml ps"
echo "  • Logs anzeigen: docker-compose -f docker-compose.supabase.yml logs -f"
echo "  • Nginx Logs: tail -f /var/log/nginx/error.log"
echo "  • Server-Diagnose: ./deploy/hetzner/check-server-errors.sh"
echo ""

# 15. Logs anzeigen (letzte 10 Zeilen)
print_step "Letzte Docker Logs:"
docker-compose -f docker-compose.supabase.yml logs --tail=10

print_success "Wiederherstellung abgeschlossen!"
