const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Einfache Routen für Tests
app.get('/', (req, res) => {
  res.json({ 
    ok: true, 
    message: 'HD App Backend läuft! (Test-Modus)',
    database: 'Test-Modus ohne Supabase',
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    database: 'test-mode',
    timestamp: new Date().toISOString()
  });
});

// Test-Auth-Route
app.post('/auth/login', (req, res) => {
  res.json({
    success: true,
    message: 'Login erfolgreich (Test-Modus)',
    token: 'test-token-123'
  });
});

app.post('/auth/register', (req, res) => {
  res.json({
    success: true,
    message: 'Registrierung erfolgreich (Test-Modus)',
    user: { id: 'test-user-123', email: req.body.email }
  });
});

// Test-Charts-Route
app.get('/charts', (req, res) => {
  res.json({
    charts: [
      { id: '1', name: 'Test Chart 1', type: 'Generator' },
      { id: '2', name: 'Test Chart 2', type: 'Manifestor' }
    ]
  });
});

// Test-Readings-Route
app.get('/readings', (req, res) => {
  res.json({
    readings: [
      { id: '1', title: 'Test Reading 1', content: 'Test content' },
      { id: '2', title: 'Test Reading 2', content: 'Test content' }
    ]
  });
});

const PORT = 4001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`[TEST-SERVER] HD App Backend läuft auf http://localhost:${PORT}`);
  console.log('[TEST-SERVER] Test-Modus ohne Supabase-Verbindung');
});
