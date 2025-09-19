# Grafana Dashboard Setup für HD App

## 🎯 Übersicht

Das HD App Monitoring Dashboard bietet Echtzeit-Einblicke in die Performance und Gesundheit der Human Design App.

## 🚀 Schnellstart

### 1. Dashboard öffnen

- **URL**: [http://localhost:3001](http://localhost:3001)
- **Login**: admin / admin
- **Dashboard**: "HD App Monitoring" (wird automatisch geladen)

### 2. Verfügbare Metriken

#### HTTP Performance

- **Request Rate**: Anzahl HTTP-Requests pro Sekunde
- **Response Time**: 95. Perzentil der Antwortzeiten
- **Error Rate**: Fehlerrate pro Endpunkt

#### System Resources

- **CPU Usage**: Prozessor-Auslastung in Prozent
- **Memory Usage**: Speicherverbrauch in MB
- **Process Metrics**: Node.js-spezifische Metriken

#### Business KPIs (geplant)

- **Active Users**: Aktive Benutzer
- **Charts Generated**: Generierte Human Design Charts
- **HD Type Distribution**: Verteilung der Human Design Typen

## 📊 Dashboard-Panels

### 1. HTTP Request Rate

```promql
rate(http_requests_total[5m])
```

Zeigt die Anzahl der HTTP-Requests pro Sekunde über die letzten 5 Minuten.

### 2. Response Time (95th percentile)

```promql
histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))
```

Zeigt das 95. Perzentil der Antwortzeiten - 95% aller Requests sind schneller als dieser Wert.

### 3. System CPU Usage

```promql
rate(process_cpu_seconds_total[5m]) * 100
```

Zeigt die CPU-Auslastung des Node.js-Prozesses in Prozent.

### 4. System Memory Usage

```promql
process_resident_memory_bytes / 1024 / 1024
```

Zeigt den Speicherverbrauch in MB.

## 🔧 Konfiguration

### Prometheus-Datenquelle

- **Name**: Prometheus
- **URL**: [http://prometheus:9090](http://prometheus:9090)
- **Type**: Prometheus
- **Access**: Proxy

### Dashboard-Einstellungen

- **Refresh**: 30 Sekunden
- **Time Range**: Letzte Stunde
- **Timezone**: Browser

## 📈 Nützliche Prometheus-Queries

### Performance-Metriken

```promql
# Request Rate pro Route
rate(http_requests_total[5m])

# Response Time 95th percentile
histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))

# Error Rate
rate(http_requests_total{status_code=~"5.."}[5m])
```

### System-Metriken

```promql
# CPU Usage
rate(process_cpu_seconds_total[5m]) * 100

# Memory Usage
process_resident_memory_bytes / 1024 / 1024

# Node.js Heap Size
process_heap_size_bytes / 1024 / 1024
```

### Business-Metriken (wenn implementiert)

```promql
# Active Users
active_users_total

# Charts Generated
charts_generated_total

# HD Type Distribution
hd_type_distribution
```

## 🚨 Alerts (Optional)

### Beispiel-Alerts

```yaml
groups:
  - name: hd-app-alerts
    rules:
      - alert: HighErrorRate
        expr: rate(http_requests_total{status_code=~"5.."}[5m]) > 0.1
        for: 2m
        labels:
          severity: warning
        annotations:
          summary: "High error rate detected"
          
      - alert: HighResponseTime
        expr: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])) > 2
        for: 2m
        labels:
          severity: warning
        annotations:
          summary: "High response time detected"
```

## 🔍 Troubleshooting

### Dashboard zeigt keine Daten

1. Prüfen Sie, ob Prometheus läuft: [http://localhost:9090](http://localhost:9090)
2. Prüfen Sie die Targets: [http://localhost:9090/targets](http://localhost:9090/targets)
3. Prüfen Sie, ob HD App Metriken sendet: [http://localhost:4001/metrics/prometheus](http://localhost:4001/metrics/prometheus)

### Metriken fehlen

1. Prüfen Sie die Prometheus-Konfiguration in `prometheus.yml`
2. Prüfen Sie die HD App Logs auf Fehler
3. Stellen Sie sicher, dass die Metriken-Endpoints funktionieren

### Grafana Login-Probleme

- Standard-Credentials: admin / admin
- Bei Problemen: Container neu starten

## 📝 Erweiterte Konfiguration

### Custom Metriken hinzufügen

1. Metriken in der HD App implementieren
2. Prometheus-Konfiguration anpassen
3. Dashboard-Panels hinzufügen

### Dashboard exportieren/importieren

```bash
# Dashboard exportieren
curl -u admin:admin http://localhost:3001/api/dashboards/uid/hd-app-monitoring > dashboard.json

# Dashboard importieren
curl -X POST -H "Content-Type: application/json" -u admin:admin -d @dashboard.json http://localhost:3001/api/dashboards/db
```

## 🎨 Dashboard-Anpassungen

### Farben ändern

- Dashboard-Einstellungen → General → Style
- Wählen Sie zwischen "light" und "dark"

### Panels hinzufügen

1. Dashboard bearbeiten
2. "Add panel" klicken
3. Prometheus als Datenquelle wählen
4. Query eingeben

### Zeitbereich anpassen

- Oben rechts im Dashboard
- Wählen Sie "Last 1 hour", "Last 6 hours", etc.

## 📞 Support

Bei Problemen:

1. Logs prüfen: `docker logs hdappchart-grafana-1`
2. Prometheus-Status: [http://localhost:9090/status](http://localhost:9090/status)
3. HD App-Status: [http://localhost:4001/health](http://localhost:4001/health)
