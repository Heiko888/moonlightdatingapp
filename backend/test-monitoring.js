const express = require('express');
const { prometheusMiddleware, getMetrics } = require('./dist/monitoring/prometheus');
const { trackChartGeneration, trackReadingCompletion, trackAuthAttempt } = require('./dist/middleware/monitoring');

const app = express();
app.use(express.json());

// Prometheus Middleware für Request-Metriken
app.use(prometheusMiddleware);

// Test-Routes
app.get('/', (req, res) => {
  res.json({ message: 'HD App Test Server läuft!' });
});

app.get('/metrics', async (req, res) => {
  try {
    const metrics = await getMetrics();
    res.set('Content-Type', 'text/plain');
    res.send(metrics);
  } catch (error) {
    res.status(500).send('Error collecting metrics');
  }
});

// Test-Route für Business-Metriken
app.post('/test/chart', (req, res) => {
  trackChartGeneration();
  res.json({ message: 'Chart generiert!' });
});

app.post('/test/reading', (req, res) => {
  trackReadingCompletion();
  res.json({ message: 'Reading abgeschlossen!' });
});

app.post('/test/auth', (req, res) => {
  trackAuthAttempt('login', true);
  res.json({ message: 'Auth erfolgreich!' });
});

app.post('/test/auth-fail', (req, res) => {
  trackAuthAttempt('login', false);
  res.json({ message: 'Auth fehlgeschlagen!' });
});

const PORT = 4001;
app.listen(PORT, () => {
  console.log(`Test Server läuft auf http://localhost:${PORT}`);
  console.log(`Prometheus Metriken: http://localhost:${PORT}/metrics`);
});
