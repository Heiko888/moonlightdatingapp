# 🚀 HD App - Kubernetes Deployment

## 📋 Übersicht

Dieses Verzeichnis enthält alle Kubernetes-Manifeste für die HD App und das Monitoring-System.

## 🏗️ Architektur

### Namespaces

- **`hd-app`**: Hauptanwendung (Frontend + Backend)
- **`hd-app-monitoring`**: Monitoring-Stack (Prometheus, Grafana, Alertmanager)

### Komponenten

#### HD App

- **Backend**: Node.js/Express API mit SQLite-Datenbank
- **Frontend**: Next.js React-Anwendung
- **Storage**: Persistent Volumes für Datenbank und Uploads

#### Monitoring

- **Prometheus**: Metriken-Sammlung
- **Grafana**: Dashboard-Visualisierung
- **Alertmanager**: Benachrichtigungen
- **Node Exporter**: System-Metriken

## 🚀 Deployment

### 1. Voraussetzungen

```bash
# Kubernetes-Cluster mit Ingress-Controller
kubectl cluster-info

# Docker-Images erstellen
docker build -t hd-app-backend:latest ./backend
docker build -t hd-app-frontend:latest ./frontend
```

### 2. Secrets konfigurieren

```bash
# Secrets in k8s/secrets.yaml anpassen
# Base64-Encoding: echo -n "your-secret" | base64
```

### 3. Deployment starten

```bash
# Alle Komponenten deployen
kubectl apply -k k8s/

# Oder einzeln:
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secrets.yaml
kubectl apply -f k8s/storage.yaml
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/monitoring-deployment.yaml
kubectl apply -f k8s/ingress.yaml
```

### 4. Status prüfen

```bash
# Pods prüfen
kubectl get pods -n hd-app
kubectl get pods -n hd-app-monitoring

# Services prüfen
kubectl get services -n hd-app
kubectl get services -n hd-app-monitoring

# Ingress prüfen
kubectl get ingress -n hd-app
kubectl get ingress -n hd-app-monitoring
```

## 🌐 Zugriff

### HD App URLs

- **Frontend**: <http://hd-app.local>
- **Backend API**: <http://hd-app.local/api>

### Monitoring URLs

- **Grafana**: <http://monitoring.local/grafana> (admin/admin)
- **Prometheus**: <http://monitoring.local/prometheus>
- **Alertmanager**: <http://monitoring.local/alertmanager>

## 🔧 Konfiguration

### Umgebungsvariablen

Alle Konfiguration erfolgt über ConfigMaps und Secrets:

```yaml
# k8s/configmap.yaml
data:
  NODE_ENV: "production"
  PORT: "4001"
  DATABASE_PATH: "/app/data/hd-app.db"
```

### Secrets

```yaml
# k8s/secrets.yaml
data:
  JWT_SECRET: <base64-encoded>
  OPENAI_API_KEY: <base64-encoded>
  SUPABASE_URL: <base64-encoded>
```

## 📊 Monitoring

### Metriken

- **System-Metriken**: CPU, Memory, Disk
- **Application-Metriken**: HTTP-Requests, Response-Times
- **Business-Metriken**: HD-Types, Chart-Generierung

### Alerts

- **High CPU Usage**: > 80% für 2 Minuten
- **High Memory Usage**: > 500MB für 2 Minuten
- **App Down**: Nicht erreichbar für 1 Minute
- **High Error Rate**: > 10% für 2 Minuten

## 🔍 Troubleshooting

### Logs anzeigen

```bash
# Backend-Logs
kubectl logs -f deployment/hd-app-backend -n hd-app

# Frontend-Logs
kubectl logs -f deployment/hd-app-frontend -n hd-app

# Prometheus-Logs
kubectl logs -f deployment/prometheus -n hd-app-monitoring

# Grafana-Logs
kubectl logs -f deployment/grafana -n hd-app-monitoring
```

### Pod-Status prüfen

```bash
# Pod-Details
kubectl describe pod <pod-name> -n hd-app

# Events anzeigen
kubectl get events -n hd-app --sort-by='.lastTimestamp'
```

### Port-Forward für lokalen Zugriff

```bash
# HD App Backend
kubectl port-forward service/hd-app-backend 4001:4001 -n hd-app

# HD App Frontend
kubectl port-forward service/hd-app-frontend 3000:3000 -n hd-app

# Grafana
kubectl port-forward service/grafana 3001:3000 -n hd-app-monitoring

# Prometheus
kubectl port-forward service/prometheus 9090:9090 -n hd-app-monitoring
```

## 🗑️ Cleanup

```bash
# Alle Ressourcen löschen
kubectl delete -k k8s/

# Oder einzeln:
kubectl delete namespace hd-app
kubectl delete namespace hd-app-monitoring
```

## 📈 Skalierung

### Horizontal Pod Autoscaler

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: hd-app-backend-hpa
  namespace: hd-app
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: hd-app-backend
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
```

## 🔒 Sicherheit

### Network Policies

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: hd-app-network-policy
  namespace: hd-app
spec:
  podSelector: {}
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - namespaceSelector:
        matchLabels:
          name: hd-app
  egress:
  - to:
    - namespaceSelector:
        matchLabels:
          name: hd-app-monitoring
```

## 🎯 Nächste Schritte

- [ ] **Helm-Chart** erstellen für einfacheres Deployment
- [ ] **CI/CD-Pipeline** mit GitHub Actions
- [ ] **SSL/TLS** mit cert-manager
- [ ] **Backup-Strategie** für Persistent Volumes
- [ ] **Multi-Environment** Support (dev/staging/prod)

---

**🎉 Die HD App läuft jetzt auf Kubernetes!** Alle Komponenten sind hochverfügbar und können einfach skaliert werden.
