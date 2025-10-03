#!/bin/bash

# 🔍 HD App - Hetzner Server Fehlerprüfung
# Umfassende Diagnose des Server-Status

echo "🔍 HD App - Server Fehlerprüfung gestartet..."
echo "=============================================="

# Farben für Output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
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

print_critical() {
    echo -e "${RED}[CRITICAL]${NC} $1"
}

# 1. System Status
print_step "=== SYSTEM STATUS ==="
echo "Uptime: $(uptime)"
echo "Memory: $(free -h | grep Mem)"
echo "Disk Space: $(df -h / | tail -1)"
echo "Load Average: $(cat /proc/loadavg)"
echo ""

# 2. Docker Status
print_step "=== DOCKER STATUS ==="
if command -v docker &> /dev/null; then
    print_success "Docker ist installiert"
    docker --version
    docker ps -a
    echo ""
    
    # Docker System Info
    print_step "Docker System Info:"
    docker system df
    echo ""
else
    print_critical "Docker ist NICHT installiert!"
fi

# 3. Docker Compose Status
print_step "=== DOCKER COMPOSE STATUS ==="
if [ -f "docker-compose.supabase.yml" ]; then
    print_success "docker-compose.supabase.yml gefunden"
    docker-compose -f docker-compose.supabase.yml ps
    echo ""
    
    # Container Logs prüfen
    print_step "Container Logs (letzte 10 Zeilen):"
    docker-compose -f docker-compose.supabase.yml logs --tail=10
    echo ""
else
    print_critical "docker-compose.supabase.yml NICHT gefunden!"
    echo "Aktuelles Verzeichnis: $(pwd)"
    echo "Verfügbare Dateien:"
    ls -la | grep -E "(docker|compose)"
fi

# 4. Port Status
print_step "=== PORT STATUS ==="
echo "Aktive Ports:"
netstat -tlnp | grep -E ':(3000|3001|80|443|9090)' || echo "Keine relevanten Ports gefunden"
echo ""

# 5. Nginx Status
print_step "=== NGINX STATUS ==="
if command -v nginx &> /dev/null; then
    print_success "Nginx ist installiert"
    systemctl status nginx --no-pager -l
    echo ""
    
    # Nginx Konfiguration testen
    print_step "Nginx Konfiguration testen:"
    nginx -t
    echo ""
    
    # Nginx Logs
    print_step "Nginx Error Logs (letzte 20 Zeilen):"
    if [ -f "/var/log/nginx/error.log" ]; then
        tail -20 /var/log/nginx/error.log
    else
        print_warning "Nginx Error Log nicht gefunden"
    fi
    echo ""
    
    print_step "Nginx Access Logs (letzte 10 Zeilen):"
    if [ -f "/var/log/nginx/access.log" ]; then
        tail -10 /var/log/nginx/access.log
    else
        print_warning "Nginx Access Log nicht gefunden"
    fi
    echo ""
else
    print_critical "Nginx ist NICHT installiert!"
fi

# 6. Service Connectivity Tests
print_step "=== SERVICE CONNECTIVITY ==="

# Frontend Test
print_step "Frontend Service Test (Port 3000):"
if curl -f -s http://localhost:3000 > /dev/null 2>&1; then
    print_success "Frontend läuft auf Port 3000"
    curl -I http://localhost:3000 2>/dev/null | head -1
else
    print_error "Frontend NICHT erreichbar auf Port 3000"
    # Versuche alternative Ports
    for port in 3001 3002 3003; do
        if curl -f -s http://localhost:$port > /dev/null 2>&1; then
            print_warning "Service läuft auf Port $port"
        fi
    done
fi
echo ""

# Grafana Test
print_step "Grafana Service Test (Port 3001):"
if curl -f -s http://localhost:3001 > /dev/null 2>&1; then
    print_success "Grafana läuft auf Port 3001"
else
    print_error "Grafana NICHT erreichbar auf Port 3001"
fi
echo ""

# 7. SSL Zertifikat Status
print_step "=== SSL ZERTIFIKAT STATUS ==="
if [ -f "/etc/nginx/ssl/cert.pem" ]; then
    print_success "SSL Zertifikat gefunden"
    echo "Zertifikat Details:"
    openssl x509 -in /etc/nginx/ssl/cert.pem -text -noout | grep -E "(Subject:|Not After:|Issuer:)" 2>/dev/null || echo "Zertifikat-Details nicht lesbar"
    
    # Ablaufdatum prüfen
    expiry=$(openssl x509 -in /etc/nginx/ssl/cert.pem -noout -dates | grep notAfter | cut -d= -f2)
    if [ ! -z "$expiry" ]; then
        expiry_date=$(date -d "$expiry" +%s 2>/dev/null || date -j -f "%b %d %H:%M:%S %Y %Z" "$expiry" +%s 2>/dev/null)
        current_date=$(date +%s)
        if [ ! -z "$expiry_date" ] && [ "$expiry_date" -gt "$current_date" ]; then
            days_left=$(( (expiry_date - current_date) / 86400 ))
            if [ "$days_left" -lt 30 ]; then
                print_warning "SSL Zertifikat läuft in $days_left Tagen ab!"
            else
                print_success "SSL Zertifikat ist gültig ($days_left Tage verbleibend)"
            fi
        fi
    fi
else
    print_error "SSL Zertifikat NICHT gefunden!"
fi
echo ""

# 8. Environment Check
print_step "=== ENVIRONMENT CHECK ==="
if [ -f ".env" ]; then
    print_success ".env Datei gefunden"
    echo "Wichtige Variablen:"
    grep -E "^(NEXT_PUBLIC_|SUPABASE_|JWT_|OPENAI_)" .env | head -5 || echo "Keine wichtigen Variablen gefunden"
else
    print_error ".env Datei NICHT gefunden!"
fi
echo ""

# 9. Process Status
print_step "=== PROCESS STATUS ==="
echo "Node.js Prozesse:"
ps aux | grep -E "(node|npm|next)" | grep -v grep || echo "Keine Node.js Prozesse gefunden"
echo ""

echo "Nginx Prozesse:"
ps aux | grep nginx | grep -v grep || echo "Keine Nginx Prozesse gefunden"
echo ""

# 10. Disk Space Check
print_step "=== DISK SPACE CHECK ==="
df -h | grep -E "(/$|/var|/tmp)"
echo ""

# 11. Memory Check
print_step "=== MEMORY CHECK ==="
free -h
echo ""

# 12. System Logs
print_step "=== SYSTEM LOGS (letzte 10 Zeilen) ==="
if [ -f "/var/log/syslog" ]; then
    tail -10 /var/log/syslog | grep -E "(error|Error|ERROR|fail|Fail|FAIL)" || echo "Keine kritischen System-Logs gefunden"
else
    print_warning "System Log nicht verfügbar"
fi
echo ""

# 13. Empfohlene Aktionen
print_step "=== EMPFOHLENE AKTIONEN ==="
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
echo "4. Frontend manuell starten (falls Docker nicht funktioniert):"
echo "   cd frontend && npm run build && npm start"
echo ""
echo "5. System neu starten (falls nötig):"
echo "   reboot"
echo ""

print_step "=== DIAGNOSE ABGESCHLOSSEN ==="
echo "Prüfen Sie die obigen Ausgaben auf Fehler und folgen Sie den empfohlenen Aktionen."
