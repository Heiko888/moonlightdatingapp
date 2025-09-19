
# Grafana Dashboard - Manuelles Setup

## 🚨 Problem: Keine Daten im Dashboard

Das automatische Dashboard-Provisioning funktioniert nicht korrekt. Hier ist die manuelle Lösung:

## 🔧 Schritt-für-Schritt Setup

### 1. Grafana öffnen
- **URL**: http://localhost:3001
- **Login**: admin / admin

### 2. Prometheus-Datenquelle hinzufügen
1. Gehen Sie zu **Configuration** → **Data Sources**
2. Klicken Sie auf **Add data source**
3. Wählen Sie **Prometheus**
4. Konfiguration:
   - **Name**: Prometheus
   - **URL**: http://prometheus:9090
   - **Access**: Proxy
5. Klicken Sie auf **Save & Test**

### 3. Dashboard erstellen
1. Gehen Sie zu **Create** → **Dashboard**
2. Klicken Sie auf **Add new panel**

### 4. Erste Metrik hinzufügen
1. Wählen Sie **Prometheus** als Datenquelle
2. Query eingeben: `rate(process_cpu_seconds_total[5m]) * 100`
3. **Legend**: CPU Usage %
4. **Title**: CPU Usage
5. Klicken Sie auf **Apply**

### 5. Zweite Metrik hinzufügen
1. Klicken Sie auf **Add panel**
2. Query eingeben: `process_resident_memory_bytes / 1024 / 1024`
3. **Legend**: Memory (MB)
4. **Title**: Memory Usage
5. Klicken Sie auf **Apply**

### 6. Dashboard speichern
1. Klicken Sie auf **Save dashboard**
2. **Name**: HD App Monitoring
3. **Tags**: hd-app, monitoring
4. Klicken Sie auf **Save**

## 📊 Verfügbare Metriken

### Node.js Standard-Metriken (funktionieren)
```promql
# CPU Usage
rate(process_cpu_seconds_total[5m]) * 100

# Memory Usage
process_resident_memory_bytes / 1024 / 1024

# Heap Size
process_heap_size_bytes / 1024 / 1024

# Open File Descriptors
process_open_fds

# Process Uptime
process_start_time_seconds
```

### HTTP-Metriken (möglicherweise nicht verfügbar)
```promql
# Request Rate
rate(http_requests_total[5m])

# Response Time
histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))
```

## 🔍 Troubleshooting

### Keine Daten sichtbar?
1. **Prometheus prüfen**: http://localhost:9090
2. **HD App Metriken prüfen**: http://localhost:4001/metrics/prometheus
3. **Zeitbereich anpassen**: Wählen Sie "Last 1 hour" oder "Last 6 hours"

### Prometheus zeigt keine Targets?
1. Prüfen Sie die Prometheus-Konfiguration in `prometheus.yml`
2. Stellen Sie sicher, dass die HD App läuft
3. Restart Prometheus: `docker-compose -f docker-compose-monitoring.yml restart prometheus`

### Grafana zeigt keine Datenquelle?
1. Prüfen Sie, ob Prometheus läuft: `docker ps | findstr prometheus`
2. Testen Sie die Verbindung in Grafana
3. URL sollte sein: `http://prometheus:9090` (nicht localhost)

## 📈 Dashboard erweitern

### Weitere Panels hinzufügen:
1. **Node.js Heap**: `process_heap_size_bytes / 1024 / 1024`
2. **File Descriptors**: `process_open_fds`
3. **Process Uptime**: `time() - process_start_time_seconds`

### Nützliche Queries:
```promql
# CPU Usage über Zeit
rate(process_cpu_seconds_total[5m]) * 100

# Memory Usage Trend
process_resident_memory_bytes / 1024 / 1024

# System Load
rate(process_cpu_seconds_total[1m])

# Process Count
count(process_cpu_seconds_total)
```

## 🎯 Schnellstart-Script

Falls Sie das Dashboard automatisch erstellen möchten:

```bash
# Dashboard JSON exportieren
curl -u admin:admin http://localhost:3001/api/dashboards/uid/hd-app-simple > dashboard.json

# Dashboard importieren
curl -X POST -H "Content-Type: application/json" -u admin:admin -d @dashboard.json http://localhost:3001/api/dashboards/db
```

## 📞 Support

Bei Problemen:
1. **Logs prüfen**: `docker logs hdappchart-grafana-1`
2. **Prometheus-Status**: http://localhost:9090/status
3. **HD App-Status**: http://localhost:4001/health
4. **Metriken-Endpoint**: http://localhost:4001/metrics/prometheus

## 🎨 Dashboard-Optimierung

### Layout anpassen:
- Panel-Größen ändern
- Zeitbereich anpassen
- Refresh-Rate einstellen (30s empfohlen)

### Styling:
- Dark/Light Theme wählen
- Farben anpassen
- Thresholds setzen

### Alerts hinzufügen:
- CPU > 80%
- Memory > 90%
- Process down
