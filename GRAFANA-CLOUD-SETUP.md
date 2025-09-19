# 🚀 Grafana Cloud Stack Setup

## Human Design App - Moonlight App

### 📋 Übersicht

Du hast jetzt Zugang zu einem professionellen **Grafana Cloud Stack** mit folgenden Services:

- **Prometheus**: Metriken-Sammlung und -Speicherung
- **Loki**: Log-Aggregation und -Suche  
- **Tempo**: Distributed Tracing
- **OTLP Gateway**: OpenTelemetry Protocol Endpoint

### 🔧 Konfiguration

#### 1. **Credentials einrichten**

Erstelle eine `.env` Datei im `backend/` Verzeichnis:

```bash
# Grafana Cloud Stack Configuration
GRAFANA_PROMETHEUS_USERNAME=your-prometheus-username
GRAFANA_PROMETHEUS_PASSWORD=your-prometheus-password
GRAFANA_LOKI_USERNAME=your-loki-username
GRAFANA_LOKI_PASSWORD=your-loki-password
GRAFANA_TEMPO_USERNAME=your-tempo-username
GRAFANA_TEMPO_PASSWORD=your-tempo-password
```

#### 2. **Backend Integration**

Das Backend ist bereits konfiguriert mit:

- ✅ **Grafana Cloud Middleware** (`backend/src/monitoring/grafana-cloud.ts`)
- ✅ **Prometheus Remote Write** für Metriken
- ✅ **Loki Log Shipping** für Logs
- ✅ **Tempo Tracing** für Performance-Monitoring

#### 3. **Metriken aktivieren**

```typescript
import { recordAppMetrics, logToGrafana } from './monitoring/grafana-cloud';

// Metriken aufzeichnen
recordAppMetrics.userRegistration();
recordAppMetrics.chartGenerated();
recordAppMetrics.matchCreated();
recordAppMetrics.moonPhaseCalculated();
recordAppMetrics.datingImpulseGenerated();
recordAppMetrics.liveEventJoined();
recordAppMetrics.courseCompleted();

// Logs senden
logToGrafana('info', 'User logged in', { userId: '123' });
logToGrafana('error', 'Database connection failed', { error: 'Connection timeout' });
```

### 📊 Verfügbare Metriken

#### **Application Metrics:**

- `hd_app_users_total` - Anzahl registrierter Benutzer
- `hd_app_charts_generated_total` - Generierte Human Design Charts
- `hd_app_matches_total` - Erstellte Matches
- `hd_app_moon_phases_calculated_total` - Berechnete Mondphasen
- `hd_app_dating_impulses_generated_total` - Generierte Dating-Impulse
- `hd_app_live_events_joined_total` - Teilnahmen an Live-Events
- `hd_app_courses_completed_total` - Abgeschlossene Kurse

#### **HTTP Metrics:**

- `http_requests_total` - HTTP-Anfragen nach Route und Status
- `http_request_duration_ms` - Antwortzeiten

#### **System Metrics:**

- `nodejs_memory_usage_bytes` - Speicherverbrauch
- `nodejs_cpu_usage_percent` - CPU-Auslastung
- `nodejs_event_loop_lag_ms` - Event Loop Verzögerung

### 🔍 Logging

#### **Log Levels:**

- `info` - Allgemeine Informationen
- `warn` - Warnungen
- `error` - Fehler

#### **Log Context:**

```typescript
logToGrafana('info', 'User action', {
  userId: '123',
  action: 'chart_generated',
  timestamp: new Date().toISOString(),
  metadata: { chartType: 'generator' }
});
```

### 📈 Dashboards

#### **Empfohlene Dashboards:**

1. **Application Overview**

   - Benutzer-Aktivität
   - Feature-Nutzung
   - Performance-Metriken

2. **User Journey**

   - Registrierung → Chart → Matching → Events
   - Conversion-Raten
   - Drop-off-Punkte

3. **System Health**

   - API-Response-Zeiten
   - Fehler-Raten
   - Ressourcen-Verbrauch

4. **Business Metrics**

   - Aktive Benutzer
   - Feature-Adoption
   - Engagement-Metriken

### 🚀 Deployment

#### **Production Setup:**

1. **Environment Variables setzen:**

```bash
export GRAFANA_PROMETHEUS_USERNAME="your-username"
export GRAFANA_PROMETHEUS_PASSWORD="your-password"
# ... weitere Credentials
```

1. **Backend starten:**

```bash
cd backend
npm run dev:backend
```

1. **Metriken überwachen:**

- Gehe zu deinem Grafana Cloud Dashboard
- Überwache die Metriken in Echtzeit
- Setze Alerts für kritische Metriken

### 🔔 Alerts

#### **Empfohlene Alerts:**

1. **High Error Rate**

   - `rate(http_requests_total{status=~"5.."}[5m]) > 0.1`

2. **Slow Response Times**

   - `histogram_quantile(0.95, rate(http_request_duration_ms_bucket[5m])) > 1000`

3. **High Memory Usage**

   - `nodejs_memory_usage_bytes / 1024 / 1024 / 1024 > 1`

4. **Database Connection Issues**

   - `rate(hd_app_database_errors_total[5m]) > 0`

### 📱 Frontend Integration

#### **Performance Monitoring:**

```typescript
// In React Components
import { logToGrafana } from './monitoring/grafana-cloud';

useEffect(() => {
  logToGrafana('info', 'Component mounted', {
    component: 'DatingImpulse',
    userId: user?.id
  });
}, []);
```

#### **User Actions tracken:**

```typescript
const handleUserAction = (action: string, data: any) => {
  logToGrafana('info', 'User action', {
    action,
    userId: user?.id,
    timestamp: new Date().toISOString(),
    data
  });
};
```

### 🎯 Nächste Schritte

1. **Credentials konfigurieren** in `.env` Datei
2. **Backend starten** mit Grafana Cloud Integration
3. **Dashboards erstellen** in Grafana Cloud
4. **Alerts einrichten** für kritische Metriken
5. **Performance optimieren** basierend auf Metriken

### 📞 Support

Bei Fragen zur Grafana Cloud Integration:

- [Grafana Cloud Dokumentation](https://grafana.com/docs/grafana-cloud/)
- [Prometheus Remote Write](https://prometheus.io/docs/prometheus/latest/storage/#remote-storage-integrations)
- [Loki Log Shipping](https://grafana.com/docs/loki/latest/clients/)

---

**🎉 Deine Human Design App ist jetzt mit professionellem Monitoring ausgestattet!**
