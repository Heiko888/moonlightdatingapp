# Prometheus Monitoring für HD App

Diese Dokumentation erklärt die Integration von Prometheus und Grafana für das Monitoring der Human Design App.

## 🚀 Schnellstart

### 1. Dependencies installieren

```bash
cd backend
npm install prom-client
```

### 2. Mit Docker Compose starten

```bash
docker-compose up -d
```

### 3. Zugriff auf die Services

- **HD App Frontend**: <http://localhost:3000>
- **HD App Backend**: <http://localhost:4001>
- **Prometheus**: <http://localhost:9090>
- **Grafana**: <http://localhost:3001> (admin/admin)

## 📊 Verfügbare Metriken

### System Metriken (Standard)

- CPU, Memory, Disk Usage
- HTTP Request Rate & Duration
- Error Rates
- Node.js Runtime Metriken

### Business Metriken (Custom)

- **Benutzer**: `total_users_registered`, `active_users_total`
- **Charts**: `charts_generated_total`
- **Readings**: `readings_completed_total`
- **Chat**: `chat_messages_total`
- **HD Types**: `hd_type_distribution`
- **Profiles**: `profile_distribution`

### API Metriken

- `http_requests_total` - Gesamtzahl HTTP Requests
- `http_request_duration_seconds` - Request-Dauer
- `errors_total` - Fehler-Rate
- `openai_api_calls_total` - OpenAI API Aufrufe
- `database_operations_total` - Datenbankoperationen

## 🔧 Konfiguration

### Prometheus Endpoints

- **Metriken**: `GET /metrics/prometheus`
- **JSON**: `GET /metrics/json`

### Beispiel: Metriken abrufen

```bash
# Prometheus Format
curl http://localhost:4001/metrics/prometheus

# JSON Format
curl http://localhost:4001/metrics/json
```

## 📈 Grafana Dashboard

Das vordefinierte Dashboard enthält:

1. **Performance**
   - HTTP Request Rate
   - Response Time (95th percentile)
   - Error Rate

2. **Business KPIs**
   - Aktive Benutzer
   - Generierte Charts
   - Abgeschlossene Readings
   - Chat-Nachrichten

3. **Human Design Spezifisch**
   - HD Type Verteilung
   - Profile Verteilung
   - Center Aktivierungen

4. **System**
   - Socket Verbindungen
   - Datenbankoperationen
   - OpenAI API Aufrufe

## 🛠️ Integration in bestehenden Code

### 1. Metriken in Routen verwenden

```typescript
import { trackChartGeneration, trackReadingCompletion } from '../middleware/monitoring';

// In einer Route
router.post('/chart', async (req, res) => {
  try {
    // Chart generieren...
    trackChartGeneration(); // Metrik erhöhen
    res.json({ success: true });
  } catch (error) {
    // Error handling...
  }
});
```

### 2. Error Tracking

```typescript
import { trackError } from '../middleware/monitoring';

// In Error Handler
app.use((err, req, res, next) => {
  trackError(err.name, req.path);
  // ...
});
```

### 3. Database Operations

```typescript
import { trackDatabaseOperation } from '../middleware/monitoring';

// Vor Datenbankoperation
trackDatabaseOperation('find', 'users');
const users = await User.find();
```

## 🔍 Prometheus Queries

### Häufig verwendete Queries

```promql
# Request Rate pro Route
rate(http_requests_total[5m])

# 95th percentile Response Time
histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))

# Error Rate
rate(errors_total[5m])

# Aktive Benutzer
active_users_total

# HD Type Verteilung
hd_type_distribution

# Charts pro Stunde
rate(charts_generated_total[1h])
```

## 🚨 Alerts (Optional)

### Beispiel-Alerts in Prometheus

```yaml
groups:
  - name: hd-app-alerts
    rules:
      - alert: HighErrorRate
        expr: rate(errors_total[5m]) > 0.1
        for: 2m
        labels:
          severity: warning
        annotations:
          summary: "Hohe Fehlerrate in HD App"
          
      - alert: SlowResponseTime
        expr: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])) > 2
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "Langsame Response-Zeiten"
```

## 📝 Best Practices

1. **Metriken benennen**: Verwenden Sie aussagekräftige Namen
2. **Labels sparsam**: Zu viele Labels können Performance beeinträchtigen
3. **Cardinality**: Vermeiden Sie hohe Cardinality (z.B. User-IDs als Labels)
4. **Sampling**: Bei hohem Traffic Metriken samplen
5. **Retention**: Passende Retention-Zeit für Metriken setzen

## 🔧 Troubleshooting

### Prometheus kann keine Metriken abrufen

```bash
# Metriken-Endpoint testen
curl http://localhost:4001/metrics/prometheus

# Prometheus Logs prüfen
docker-compose logs prometheus
```

### Grafana zeigt keine Daten

1. Datenquelle prüfen (Prometheus URL)
2. Prometheus Targets Status prüfen
3. Zeitbereich in Grafana anpassen

### Hohe Memory Usage

- Metriken-Sampling aktivieren
- Unnötige Metriken entfernen
- Retention-Zeit reduzieren

## 📚 Weitere Ressourcen

- [Prometheus Dokumentation](https://prometheus.io/docs/)
- [Grafana Dokumentation](https://grafana.com/docs/)
- [prom-client Dokumentation](https://github.com/siimon/prom-client)
