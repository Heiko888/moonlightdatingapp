const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());

// In-Memory Stores für Tests
const users = [];
const readings = [];

// Test-Routes
app.get('/', (req, res) => {
  res.json({ message: 'HD App Reading Test Server läuft!' });
});

// POST /auth/register
app.post('/auth/register', async (req, res) => {
  try {
    const { username, email, password, name } = req.body;

    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ error: 'E-Mail bereits registriert' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = {
      id: Date.now().toString(),
      username,
      email,
      password_hash: passwordHash,
      name,
      created_at: new Date().toISOString()
    };

    users.push(user);

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

    const user = users.find(u => u.email === email);
    
    if (!user) {
      return res.status(401).json({ error: 'Ungültige Anmeldedaten' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Ungültige Anmeldedaten' });
    }

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

// GET /readings - Alle Readings eines Benutzers
app.get('/readings', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Token fehlt' });
  }

  try {
    const decoded = jwt.verify(token, 'test-secret-key');
    const userReadings = readings.filter(r => r.user_id === decoded.userId);
    res.json(userReadings);
  } catch (error) {
    res.status(401).json({ error: 'Ungültiger Token' });
  }
});

// GET /readings/:id - Ein spezifisches Reading
app.get('/readings/:id', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  const readingId = req.params.id;
  
  if (!token) {
    return res.status(401).json({ error: 'Token fehlt' });
  }

  try {
    const decoded = jwt.verify(token, 'test-secret-key');
    const reading = readings.find(r => r.id === readingId);
    
    if (!reading) {
      return res.status(404).json({ error: 'Reading nicht gefunden' });
    }

    if (reading.user_id !== decoded.userId) {
      return res.status(403).json({ error: 'Keine Berechtigung für dieses Reading' });
    }

    res.json(reading);
  } catch (error) {
    res.status(401).json({ error: 'Ungültiger Token' });
  }
});

// POST /readings - Neues Reading erstellen
app.post('/readings', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Token fehlt' });
  }

  try {
    const decoded = jwt.verify(token, 'test-secret-key');
    const { chart_id, scope, content, sources, title, summary, tags } = req.body;
    
    if (!chart_id || !scope || !content) {
      return res.status(400).json({ 
        error: 'chart_id, scope und content sind erforderlich' 
      });
    }
    
    const reading = {
      id: Date.now().toString(),
      user_id: decoded.userId,
      chart_id,
      scope,
      content,
      sources: sources || [],
      title: title || `Reading für ${scope}`,
      summary: summary || '',
      tags: tags || [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    readings.push(reading);
    res.status(201).json(reading);
  } catch (error) {
    res.status(401).json({ error: 'Ungültiger Token' });
  }
});

// PUT /readings/:id - Reading aktualisieren
app.put('/readings/:id', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  const readingId = req.params.id;
  
  if (!token) {
    return res.status(401).json({ error: 'Token fehlt' });
  }

  try {
    const decoded = jwt.verify(token, 'test-secret-key');
    const readingIndex = readings.findIndex(r => r.id === readingId);
    
    if (readingIndex === -1) {
      return res.status(404).json({ error: 'Reading nicht gefunden' });
    }

    const reading = readings[readingIndex];
    if (reading.user_id !== decoded.userId) {
      return res.status(403).json({ error: 'Keine Berechtigung für dieses Reading' });
    }

    const { title, content, summary, sources, tags } = req.body;
    
    const updatedReading = {
      ...reading,
      title: title || reading.title,
      content: content || reading.content,
      summary: summary || reading.summary,
      sources: sources || reading.sources,
      tags: tags || reading.tags,
      updated_at: new Date().toISOString()
    };
    
    readings[readingIndex] = updatedReading;
    res.json(updatedReading);
  } catch (error) {
    res.status(401).json({ error: 'Ungültiger Token' });
  }
});

// DELETE /readings/:id - Reading löschen
app.delete('/readings/:id', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  const readingId = req.params.id;
  
  if (!token) {
    return res.status(401).json({ error: 'Token fehlt' });
  }

  try {
    const decoded = jwt.verify(token, 'test-secret-key');
    const readingIndex = readings.findIndex(r => r.id === readingId);
    
    if (readingIndex === -1) {
      return res.status(404).json({ error: 'Reading nicht gefunden' });
    }

    const reading = readings[readingIndex];
    if (reading.user_id !== decoded.userId) {
      return res.status(403).json({ error: 'Keine Berechtigung für dieses Reading' });
    }

    readings.splice(readingIndex, 1);
    res.json({ message: 'Reading erfolgreich gelöscht' });
  } catch (error) {
    res.status(401).json({ error: 'Ungültiger Token' });
  }
});

// GET /readings/search?q=query - Readings durchsuchen
app.get('/readings/search', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  const query = req.query.q;
  
  if (!token) {
    return res.status(401).json({ error: 'Token fehlt' });
  }

  if (!query) {
    return res.status(400).json({ error: 'Suchbegriff erforderlich' });
  }

  try {
    const decoded = jwt.verify(token, 'test-secret-key');
    const userReadings = readings.filter(r => r.user_id === decoded.userId);
    
    const searchResults = userReadings.filter(reading => 
      reading.title?.toLowerCase().includes(query.toLowerCase()) ||
      reading.content?.toLowerCase().includes(query.toLowerCase()) ||
      reading.summary?.toLowerCase().includes(query.toLowerCase())
    );
    
    res.json(searchResults);
  } catch (error) {
    res.status(401).json({ error: 'Ungültiger Token' });
  }
});

const PORT = 4001;
app.listen(PORT, () => {
  console.log(`Reading Test Server läuft auf http://localhost:${PORT}`);
  console.log('Verfügbare Endpoints:');
  console.log('- POST /auth/register');
  console.log('- POST /auth/login');
  console.log('- GET /readings');
  console.log('- GET /readings/:id');
  console.log('- POST /readings');
  console.log('- PUT /readings/:id');
  console.log('- DELETE /readings/:id');
  console.log('- GET /readings/search?q=query');
});
