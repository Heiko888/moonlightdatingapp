# 🎯 HD App - Komplettes Monitoring-System

## 🚀 Übersicht

Das HD App Monitoring-System umfasst:

- **Prometheus**: Metriken-Sammlung
- **Grafana**: Dashboard-Visualisierung  
- **Alertmanager**: Benachrichtigungen
- **Business-Metriken**: HD-spezifische KPIs

## 📊 Verfügbare Services

| Service | URL | Port | Beschreibung |
|---------|-----|------|--------------|
| **HD App Backend** | <http://localhost:4001> | 4001 | Hauptanwendung |
| **Prometheus** | <http://localhost:9090> | 9090 | Metriken-Sammlung |
| **Grafana** | <http://localhost:3001> | 3001 | Dashboards |
| **Alertmanager** | <http://localhost:9093> | 9093 | Benachrichtigungen |
| **Node Exporter** | <http://localhost:9100> | 9100 | System-Metriken |

## 🔧 Installation & Setup

### 1. Monitoring-System starten

```bash
docker-compose -f docker-compose-monitoring.yml up -d
```

### 2. HD App starten

```bash
npm run dev
```

### 3. Monitoring testen

```bash
node test-monitoring.js
```

## 📈 Verfügbare Metriken

### System-Metriken

```promql
# CPU Usage
rate(process_cpu_seconds_total[5m]) * 100

# Memory Usage
process_resident_memory_bytes / 1024 / 1024

# Heap Size
process_heap_size_bytes / 1024 / 1024

# File Descriptors
process_open_fds
```

### HTTP-Metriken

```promql
# Request Rate
rate(http_requests_total[5m])

# Response Time (95th percentile)
histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))

# Error Rate
rate(http_requests_total{status_code=~"5.."}[5m])
```

### Business-Metriken

```promql
# HD Type Distribution
hd_type_distribution

# Profile Distribution
profile_distribution

# OpenAI API Calls
openai_api_calls_total

# Database Operations
database_operations_total
```

## 🚨 Alerts

### Konfigurierte Alerts

- **HighCPUUsage**: CPU > 80% für 2 Minuten
- **HighMemoryUsage**: Memory > 500MB für 2 Minuten
- **HDAppDown**: App nicht erreichbar für 1 Minute
- **HighErrorRate**: Fehlerrate > 10% für 2 Minuten
- **HighResponseTime**: Response Time > 2s für 2 Minuten
- **LowActiveUsers**: Keine aktiven User für 10 Minuten

### Alert-Severity

- **Critical**: App Down, kritische Fehler
- **Warning**: Performance-Probleme
- **Info**: Niedrige Aktivität

## 📊 Dashboard-Setup

### Manuelles Setup (empfohlen)

1. **Grafana öffnen**: <http://localhost:3001> (admin/admin)
2. **Prometheus-Datenquelle hinzufügen**:
   - URL: `http://prometheus:9090`
   - Access: Proxy
3. **Dashboard erstellen**:
   - Create → Dashboard → Add new panel
   - Queries aus der obigen Liste verwenden

### Automatisches Setup

```bash
# Dashboard importieren
curl -X POST -H "Content-Type: application/json" -u admin:admin \
  -d @grafana/dashboards/hd-app-dashboard.json \
  http://localhost:3001/api/dashboards/db
```

## 🔍 Troubleshooting

### Keine Daten im Dashboard?

1. **HD App läuft?**: <http://localhost:4001/health>
2. **Prometheus läuft?**: <http://localhost:9090>
3. **Metriken verfügbar?**: <http://localhost:4001/metrics/prometheus>
4. **Zeitbereich anpassen**: "Last 1 hour" wählen

### Alerts funktionieren nicht?

1. **Alertmanager läuft?**: <http://localhost:9093>
2. **Alerts konfiguriert?**: prometheus/alerts.yml prüfen
3. **E-Mail-Konfiguration**: alertmanager/alertmanager.yml anpassen

### Business-Metriken fehlen?

1. **Datenbank-Tabellen**: user_profiles, charts, readings
2. **Metriken-Endpoint**: <http://localhost:4001/metrics/json>
3. **Backend-Logs**: Fehler in der Metriken-Generierung

## 📈 Dashboard-Erweiterung

### Neue Panels hinzufügen

1. **Chart-Generierung**: `rate(charts_generated_total[5m])`
2. **User-Aktivität**: `rate(user_sessions_total[5m])`
3. **API-Performance**: `rate(api_calls_total[5m])`

### Custom Business-KPIs

```promql
# HD Type Popularity
topk(5, hd_type_distribution)

# Most Active Profiles
topk(3, profile_distribution)

# Chart Generation Rate
rate(charts_generated_total[1h])
```

## 🎨 Dashboard-Optimierung

### Layout

- **Refresh**: 30 Sekunden
- **Time Range**: Letzte Stunde
- **Theme**: Dark/Light

### Thresholds

- **CPU**: Grün < 50%, Gelb 50-80%, Rot > 80%
- **Memory**: Grün < 300MB, Gelb 300-500MB, Rot > 500MB
- **Response Time**: Grün < 1s, Gelb 1-2s, Rot > 2s

### Alerts

- **E-Mail**: <admin@hd-app.local>
- **Webhook**: <http://localhost:5001/>
- **Slack**: (optional konfigurierbar)

## 📞 Support

### Logs prüfen

```bash
# Grafana
docker logs hdappchart-grafana

# Prometheus
docker logs hdappchart-prometheus

# Alertmanager
docker logs hdappchart-alertmanager

# HD App
npm run dev
```

### Status-Checks

- **HD App**: <http://localhost:4001/health>
- **Prometheus**: <http://localhost:9090/status>
- **Alertmanager**: <http://localhost:9093/api/v1/status>
- **Grafana**: <http://localhost:3001/api/health>

### Monitoring-Test

```bash
node test-monitoring.js
```

## 🎯 Nächste Schritte

1. **Dashboard personalisieren** nach Ihren Bedürfnissen
2. **Alerts konfigurieren** für E-Mail/Slack
3. **Business-KPIs erweitern** um spezifische Metriken
4. **Performance optimieren** basierend auf den Daten
5. **Backup-Strategie** für Monitoring-Daten

---

**🎉 Das HD App Monitoring-System ist vollständig einsatzbereit!**
