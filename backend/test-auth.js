const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());

// In-Memory User Store für Tests
const users = [];

// Test-Routes
app.get('/', (req, res) => {
  res.json({ message: 'HD App Auth Test Server läuft!' });
});

// POST /auth/register
app.post('/auth/register', async (req, res) => {
  try {
    const { username, email, password, name } = req.body;

    // Prüfen ob Benutzer bereits existiert
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ error: 'E-Mail bereits registriert' });
    }

    // Passwort hashen
    const passwordHash = await bcrypt.hash(password, 10);

    // Benutzer erstellen
    const user = {
      id: Date.now().toString(),
      username,
      email,
      password_hash: passwordHash,
      name,
      created_at: new Date().toISOString()
    };

    users.push(user);

    // JWT Token erstellen
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      'test-secret-key',
      { expiresIn: '24h' }
    );
    
    res.status(201).json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('[auth/register] Error:', error);
    res.status(500).json({ error: 'Fehler bei der Registrierung' });
  }
});

// POST /auth/login
app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Benutzer finden
    const user = users.find(u => u.email === email);
    
    if (!user) {
      return res.status(401).json({ error: 'Ungültige Anmeldedaten' });
    }

    // Passwort überprüfen
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Ungültige Anmeldedaten' });
    }

    // JWT Token erstellen
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      'test-secret-key',
      { expiresIn: '24h' }
    );
    
    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('[auth/login] Error:', error);
    res.status(500).json({ error: 'Fehler bei der Anmeldung' });
  }
});

// Test-Protected Route
app.get('/protected', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Token fehlt' });
  }

  try {
    const decoded = jwt.verify(token, 'test-secret-key');
    res.json({ message: 'Geschützte Route', user: decoded });
  } catch (error) {
    res.status(401).json({ error: 'Ungültiger Token' });
  }
});

// Test-Readings Route
app.post('/readings', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Token fehlt' });
  }

  try {
    const decoded = jwt.verify(token, 'test-secret-key');
    const { chart_id, scope, content, sources } = req.body;
    
    const reading = {
      id: Date.now().toString(),
      user_id: decoded.userId,
      chart_id,
      scope,
      content,
      sources,
      created_at: new Date().toISOString()
    };
    
    res.status(201).json(reading);
  } catch (error) {
    res.status(401).json({ error: 'Ungültiger Token' });
  }
});

const PORT = 4001;
app.listen(PORT, () => {
  console.log(`Auth Test Server läuft auf http://localhost:${PORT}`);
  console.log('Verfügbare Endpoints:');
  console.log('- POST /auth/register');
  console.log('- POST /auth/login');
  console.log('- GET /protected');
  console.log('- POST /readings');
});
