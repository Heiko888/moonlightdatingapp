#!/bin/bash

# 🚀 HD App Kubernetes Deployment Script

set -e

echo "🎯 HD App Kubernetes Deployment"
echo "================================"

# Farben für Output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Funktionen
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Prüfe ob kubectl verfügbar ist
if ! command -v kubectl &> /dev/null; then
    log_error "kubectl ist nicht installiert oder nicht im PATH"
    exit 1
fi

# Prüfe ob Cluster erreichbar ist
if ! kubectl cluster-info &> /dev/null; then
    log_error "Kubernetes-Cluster ist nicht erreichbar"
    exit 1
fi

log_success "Kubernetes-Cluster ist erreichbar"

# Prüfe ob Docker verfügbar ist
if ! command -v docker &> /dev/null; then
    log_warning "Docker ist nicht verfügbar - Images müssen manuell erstellt werden"
else
    log_info "Erstelle Docker-Images..."
    
    # Backend-Image erstellen
    if [ -d "backend" ]; then
        log_info "Erstelle Backend-Image..."
        docker build -t hd-app-backend:latest ./backend
        log_success "Backend-Image erstellt"
    else
        log_warning "Backend-Verzeichnis nicht gefunden"
    fi
    
    # Frontend-Image erstellen
    if [ -d "frontend" ]; then
        log_info "Erstelle Frontend-Image..."
        docker build -t hd-app-frontend:latest ./frontend
        log_success "Frontend-Image erstellt"
    else
        log_warning "Frontend-Verzeichnis nicht gefunden"
    fi
fi

# Kubernetes-Manifeste anwenden
log_info "Wende Kubernetes-Manifeste an..."

# Namespaces erstellen
log_info "Erstelle Namespaces..."
kubectl apply -f k8s/namespace.yaml
log_success "Namespaces erstellt"

# ConfigMaps erstellen
log_info "Erstelle ConfigMaps..."
kubectl apply -f k8s/configmap.yaml
log_success "ConfigMaps erstellt"

# Secrets erstellen
log_info "Erstelle Secrets..."
kubectl apply -f k8s/secrets.yaml
log_success "Secrets erstellt"

# Storage erstellen
log_info "Erstelle Persistent Volumes..."
kubectl apply -f k8s/storage.yaml
log_success "Storage erstellt"

# Backend deployen
log_info "Deploye Backend..."
kubectl apply -f k8s/backend-deployment.yaml
log_success "Backend deployed"

# Frontend deployen
log_info "Deploye Frontend..."
kubectl apply -f k8s/frontend-deployment.yaml
log_success "Frontend deployed"

# Monitoring deployen
log_info "Deploye Monitoring-Stack..."
kubectl apply -f k8s/monitoring-deployment.yaml
log_success "Monitoring-Stack deployed"

# Ingress erstellen
log_info "Erstelle Ingress..."
kubectl apply -f k8s/ingress.yaml
log_success "Ingress erstellt"

# Warte auf Pods
log_info "Warte auf Pods..."
kubectl wait --for=condition=ready pod -l app=hd-app-backend -n hd-app --timeout=300s
kubectl wait --for=condition=ready pod -l app=hd-app-frontend -n hd-app --timeout=300s
kubectl wait --for=condition=ready pod -l app=prometheus -n hd-app-monitoring --timeout=300s
kubectl wait --for=condition=ready pod -l app=grafana -n hd-app-monitoring --timeout=300s

log_success "Alle Pods sind bereit"

# Status anzeigen
echo ""
echo "📊 Deployment-Status:"
echo "===================="

echo ""
echo "🏠 HD App Namespace:"
kubectl get pods -n hd-app
kubectl get services -n hd-app

echo ""
echo "📈 Monitoring Namespace:"
kubectl get pods -n hd-app-monitoring
kubectl get services -n hd-app-monitoring

echo ""
echo "🌐 Ingress:"
kubectl get ingress -n hd-app
kubectl get ingress -n hd-app-monitoring

# Port-Forward-Optionen anzeigen
echo ""
echo "🔗 Lokaler Zugriff (Port-Forward):"
echo "=================================="
echo "HD App Backend:  kubectl port-forward service/hd-app-backend 4001:4001 -n hd-app"
echo "HD App Frontend: kubectl port-forward service/hd-app-frontend 3000:3000 -n hd-app"
echo "Grafana:         kubectl port-forward service/grafana 3001:3000 -n hd-app-monitoring"
echo "Prometheus:      kubectl port-forward service/prometheus 9090:9090 -n hd-app-monitoring"

echo ""
echo "🌍 URLs (mit Ingress):"
echo "======================"
echo "HD App:          http://hd-app.local"
echo "Grafana:         http://monitoring.local/grafana (admin/admin)"
echo "Prometheus:      http://monitoring.local/prometheus"
echo "Alertmanager:    http://monitoring.local/alertmanager"

echo ""
log_success "🎉 HD App erfolgreich auf Kubernetes deployed!"
echo ""
echo "📝 Nächste Schritte:"
echo "1. /etc/hosts anpassen für lokale URLs"
echo "2. Secrets in k8s/secrets.yaml anpassen"
echo "3. Monitoring-Dashboards in Grafana konfigurieren"
echo "4. Alerts in Alertmanager einrichten"
