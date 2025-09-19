# NASA API Integration für Mondphasen

## Übersicht

Die App verwendet jetzt die **NASA Planetary API** für präzise Mondphasen-Daten anstelle der vereinfachten lokalen Berechnung.

## API Details

### NASA Planetary API
- **URL**: `https://api.nasa.gov/planetary/ephemeris`
- **Kostenlos**: Ja (bis zu 1000 Requests/Tag)
- **Dokumentation**: https://api.nasa.gov/

### Endpoints
- `GET /planetary/ephemeris?target=moon&date=YYYY-MM-DD&api_key=YOUR_KEY`

## Konfiguration

### 1. API Key erhalten
1. Gehe zu https://api.nasa.gov/
2. Registriere dich kostenlos
3. Erhalte deinen API Key

### 2. Umgebungsvariable setzen
```bash
# In .env Datei
NASA_API_KEY=IaVDBnlzJ0mv1nUSOhl72gdtuX1dzl56EjUO2i9W

```

### 3. Fallback-Key
Wenn kein API Key gesetzt ist, wird automatisch der Demo-Key verwendet:
```javascript
const NASA_API_KEY = process.env.NASA_API_KEY || 'DEMO_KEY';
```

## Funktionsweise

### 1. NASA API Aufruf
```typescript
async function getNASAEphemeris(date: string): Promise<NASAEphemerisResponse | null> {
  const response = await axios.get(`${NASA_BASE_URL}/ephemeris`, {
    params: {
      target: 'moon',
      date: date,
      api_key: NASA_API_KEY
    }
  });
}
```

### 2. Phase Mapping
NASA Phasen werden zu lokalen Phasen gemappt:
- `new_moon` → Neumond 🌑
- `waxing_crescent` → Zunehmender Sichelmond 🌒
- `first_quarter` → Erstes Viertel 🌓
- `waxing_gibbous` → Zunehmender Gibbous 🌔
- `full_moon` → Vollmond 🌕
- `waning_gibbous` → Abnehmender Gibbous 🌖
- `last_quarter` → Letztes Viertel 🌗
- `waning_crescent` → Abnehmender Sichelmond 🌘

### 3. Fallback-System
Wenn die NASA API nicht verfügbar ist:
1. Automatischer Fallback zur lokalen Berechnung
2. Keine Unterbrechung des Services
3. Logging für Debugging

## Vorteile

### ✅ Präzision
- **Astronomisch korrekte** Mondphasen
- **Echte NASA-Daten** statt Schätzungen
- **Präzise Zeitstempel** und Beleuchtungswerte

### ✅ Zuverlässigkeit
- **Fallback-System** bei API-Ausfällen
- **Rate Limiting** berücksichtigt
- **Error Handling** für robuste Anwendung

### ✅ Performance
- **Caching** möglich (für zukünftige Optimierung)
- **Schnelle Antwortzeiten** durch NASA CDN
- **Minimale Latenz** durch optimierte Endpoints

## API Limits

### Demo Key (Standard)
- **1000 Requests/Tag**
- **Perfekt für Entwicklung**
- **Kostenlos**

### Registrierter Key
- **1000 Requests/Tag** (Standard)
- **Erweiterte Limits** möglich
- **Bessere Performance**

## Monitoring

### Logs
```javascript
console.log('NASA API erfolgreich');
console.log('NASA API nicht verfügbar, verwende lokale Berechnung');
console.error('NASA API Fehler:', error);
```

### Metriken (zukünftig)
- API Response Times
- Success/Failure Rates
- Cache Hit Rates

## Troubleshooting

### Häufige Probleme

1. **API Key ungültig**
   - Prüfe API Key in .env
   - Registriere dich neu bei NASA

2. **Rate Limit erreicht**
   - Warte bis zum nächsten Tag
   - Implementiere Caching

3. **Network Issues**
   - Automatischer Fallback aktiv
   - Prüfe Internetverbindung

### Debugging
```bash
# API Test
curl "https://api.nasa.gov/planetary/ephemeris?target=moon&date=2024-12-25&api_key=DEMO_KEY"
```

## Zukünftige Erweiterungen

### 1. Caching
- Redis für API Responses
- Reduzierung API Calls
- Bessere Performance

### 2. Erweiterte Daten
- Mondaufgang/-untergang
- Monddistanz zur Erde
- Beleuchtungsgrad

### 3. Alternative APIs
- Backup APIs für Redundanz
- Mehrere Datenquellen
- Höhere Verfügbarkeit

## Sicherheit

### API Key Schutz
- **Niemals** im Frontend Code
- **Nur** in Backend .env
- **Regelmäßige Rotation** empfohlen

### Rate Limiting
- **Automatische Begrenzung** der Requests
- **Graceful Degradation** bei Limits
- **Monitoring** der API Nutzung
