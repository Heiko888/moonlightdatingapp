# 📊 MONITORING-STATUS

**Letzte Aktualisierung**: 2025-10-13 23:54

---

## **✅ AKTUELLE MONITORING-SERVICES**

### **1. Grafana**
- **Status**: ✅ Läuft
- **Port**: 3001
- **URL**: http://localhost:3001
- **Container**: `hd_app_chart-grafana-1`
- **Uptime**: 8+ Stunden
- **Passwort**: Wiederhergestellt ✅

### **2. Prometheus**
- **Status**: ✅ Läuft
- **Port**: 9090
- **URL**: http://localhost:9090
- **Container**: `hd_app_chart-prometheus-1`
- **Uptime**: 8+ Stunden
- **Metriken**: Aktiv

### **3. Alertmanager**
- **Status**: ✅ Läuft (Neu gestartet)
- **Port**: 9093
- **URL**: http://localhost:9093
- **Container**: `hd_app_chart-alertmanager-1`
- **Konfiguration**: ✅ Korrigiert
- **Problem**: ✅ Behoben

### **4. Node Exporter**
- **Status**: ✅ Läuft (Kubernetes)
- **Port**: 9100
- **Container**: `k8s_node-exporter_*`
- **Uptime**: 8+ Stunden

---

## **🔧 BEHOBENE PROBLEME**

### **Problem: Alertmanager Konfigurationsfehler**

#### **Fehler:**
```yaml
ERROR: yaml: unmarshal errors:
  line 18: field subject not found in type config.plain
  line 19: field body not found in type config.plain
```

#### **Ursache:**
- Veraltete YAML-Syntax für Email-Konfiguration
- `subject` und `body` Felder nicht mehr unterstützt

#### **Lösung:**
```yaml
# ❌ Alt (fehlerhaft)
receivers:
- name: 'web.hook'
  email_configs:
  - to: 'admin@your-domain.com'
    subject: 'Alert'
    body: 'Message'

# ✅ Neu (korrekt)
receivers:
- name: 'web.hook'
  email_configs:
  - to: 'admin@your-domain.com'
    headers:
      Subject: 'HD App Alert: {{ .GroupLabels.alertname }}'
    html: |
      <h2>HD App Alert</h2>
      {{ range .Alerts }}
      <p><strong>Alert:</strong> {{ .Annotations.summary }}</p>
      {{ end }}
```

#### **Status**: ✅ Behoben und getestet

---

## **📊 MONITORING-ÜBERSICHT**

### **Verfügbare Metriken:**

#### **1. System-Metriken (Node Exporter):**
- CPU Usage
- Memory Usage
- Disk Usage
- Network Traffic
- Load Average

#### **2. Application-Metriken:**
- HTTP Request Rate
- Response Times
- Error Rates
- Active Connections

#### **3. Docker-Metriken:**
- Container Status
- Resource Usage
- Network Stats

---

## **🚨 ALERTS KONFIGURATION**

### **Aktive Alert Rules:**

#### **1. High CPU Usage**
```yaml
- alert: HighCPUUsage
  expr: 100 - (avg by(instance) (rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100) > 80
  for: 5m
  labels:
    severity: warning
  annotations:
    summary: "High CPU usage detected"
    description: "CPU usage is above 80% for 5 minutes"
```

#### **2. High Memory Usage**
```yaml
- alert: HighMemoryUsage
  expr: (node_memory_MemTotal_bytes - node_memory_MemAvailable_bytes) / node_memory_MemTotal_bytes * 100 > 90
  for: 5m
  labels:
    severity: critical
  annotations:
    summary: "High memory usage detected"
    description: "Memory usage is above 90%"
```

#### **3. Service Down**
```yaml
- alert: ServiceDown
  expr: up == 0
  for: 1m
  labels:
    severity: critical
  annotations:
    summary: "Service is down"
    description: "{{ $labels.job }} is down"
```

---

## **📧 EMAIL-BENACHRICHTIGUNGEN**

### **Konfiguration:**
```yaml
global:
  smtp_smarthost: 'smtp.gmail.com:587'
  smtp_from: 'alerts@your-domain.com'
  smtp_auth_username: 'your-email@gmail.com'
  smtp_auth_password: 'your-app-password'
```

### **Setup:**
1. Gmail App-Passwort erstellen
2. `alertmanager.yml` aktualisieren
3. Alertmanager neu starten
4. Test-Alert senden

---

## **🎯 ZUGRIFF AUF MONITORING-SERVICES**

### **Lokal (Development):**
```
Grafana:       http://localhost:3001
Prometheus:    http://localhost:9090
Alertmanager:  http://localhost:9093
Node Exporter: http://localhost:9100/metrics
```

### **Production (Hetzner):**
```
Grafana:       http://138.199.237.34:3001
Prometheus:    http://138.199.237.34:9090
Alertmanager:  http://138.199.237.34:9093
```

---

## **📈 GRAFANA DASHBOARDS**

### **Verfügbare Dashboards:**

#### **1. System Overview**
- CPU, Memory, Disk Usage
- Network Traffic
- Load Average

#### **2. Application Metrics**
- Request Rate
- Response Times
- Error Rates

#### **3. Docker Metrics**
- Container Status
- Resource Usage

---

## **✅ CHECKLISTE**

### **Monitoring Setup:**
- [x] Grafana installiert und konfiguriert
- [x] Prometheus installiert und konfiguriert
- [x] Alertmanager installiert und konfiguriert
- [x] Node Exporter installiert
- [x] Dashboards erstellt
- [x] Alert Rules konfiguriert
- [ ] Email-Benachrichtigungen getestet

### **Nächste Schritte:**
- [ ] Gmail App-Passwort erstellen
- [ ] Email-Konfiguration aktualisieren
- [ ] Test-Alert senden
- [ ] Weitere Dashboards erstellen
- [ ] Custom Metriken hinzufügen

---

## **🔍 TROUBLESHOOTING**

### **Problem: Grafana nicht erreichbar**
```powershell
# Container Status prüfen
docker ps --filter "name=grafana"

# Logs prüfen
docker logs hd_app_chart-grafana-1

# Neu starten
docker-compose -f docker-compose.supabase.yml restart grafana
```

### **Problem: Prometheus keine Daten**
```powershell
# Targets prüfen
# http://localhost:9090/targets

# Konfiguration prüfen
docker exec hd_app_chart-prometheus-1 cat /etc/prometheus/prometheus.yml

# Neu starten
docker-compose -f docker-compose.supabase.yml restart prometheus
```

### **Problem: Alertmanager Fehler**
```powershell
# Logs prüfen
docker logs hd_app_chart-alertmanager-1

# Konfiguration validieren
docker exec hd_app_chart-alertmanager-1 amtool check-config /etc/alertmanager/alertmanager.yml

# Neu starten
docker-compose -f docker-compose.supabase.yml restart alertmanager
```

---

## **📚 WEITERE RESSOURCEN**

- [Prometheus Dokumentation](https://prometheus.io/docs/)
- [Grafana Dokumentation](https://grafana.com/docs/)
- [Alertmanager Dokumentation](https://prometheus.io/docs/alerting/latest/alertmanager/)
- [Node Exporter Dokumentation](https://github.com/prometheus/node_exporter)

---

**Status**: ✅ Alle Monitoring-Services laufen einwandfrei

