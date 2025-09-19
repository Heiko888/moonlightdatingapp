import { Router } from 'express';
import fs from 'fs';
import path from 'path';

const router = Router();

// Datei-Pfade für lokale Speicherung (in Produktion würde man eine echte Datenbank verwenden)
const coachesFile = path.join(__dirname, '../../data/coaches.json');
const sessionsFile = path.join(__dirname, '../../data/sessions.json');

// Verzeichnis erstellen falls nicht vorhanden
const dataDir = path.dirname(coachesFile);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Hilfsfunktionen zum Lesen/Schreiben der JSON-Dateien
const readCoaches = () => {
  try {
    if (fs.existsSync(coachesFile)) {
      const data = fs.readFileSync(coachesFile, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('[COACHING] Fehler beim Lesen der Coaches:', error);
  }
  return [];
};

const writeCoaches = (coaches: any[]) => {
  try {
    fs.writeFileSync(coachesFile, JSON.stringify(coaches, null, 2));
  } catch (error) {
    console.error('[COACHING] Fehler beim Schreiben der Coaches:', error);
    throw error;
  }
};

const readSessions = () => {
  try {
    if (fs.existsSync(sessionsFile)) {
      const data = fs.readFileSync(sessionsFile, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('[COACHING] Fehler beim Lesen der Sessions:', error);
  }
  return [];
};

const writeSessions = (sessions: any[]) => {
  try {
    fs.writeFileSync(sessionsFile, JSON.stringify(sessions, null, 2));
  } catch (error) {
    console.error('[COACHING] Fehler beim Schreiben der Sessions:', error);
    throw error;
  }
};

// Coach-Routen
// GET /admin/coaching/coaches - Alle Coaches abrufen
router.get('/coaches', (req, res) => {
  try {
    const coaches = readCoaches();
    res.json({ success: true, coaches });
  } catch (error) {
    console.error('[COACHING] Fehler beim Abrufen der Coaches:', error);
    res.status(500).json({ success: false, error: 'Fehler beim Abrufen der Coaches' });
  }
});

// POST /admin/coaching/coaches - Neuen Coach erstellen
router.post('/coaches', (req, res) => {
  try {
    const { name, email, specialization, experience, rating, hourlyRate, availability, bio, imageUrl } = req.body;
    
    if (!name || !email) {
      return res.status(400).json({ success: false, error: 'Name und E-Mail sind erforderlich' });
    }

    const coaches = readCoaches();
    const newCoach = {
      id: Date.now().toString(),
      name,
      email,
      specialization: Array.isArray(specialization) ? specialization : [specialization],
      experience: parseInt(experience) || 0,
      rating: parseInt(rating) || 5,
      hourlyRate: parseInt(hourlyRate) || 0,
      availability: Array.isArray(availability) ? availability : [availability],
      bio: bio || '',
      imageUrl: imageUrl || '',
      isActive: true,
      createdAt: new Date().toISOString()
    };

    coaches.push(newCoach);
    writeCoaches(coaches);

    console.log(`[COACHING] Coach erstellt: ${newCoach.name}`);
    res.json({ success: true, coach: newCoach });
  } catch (error) {
    console.error('[COACHING] Fehler beim Erstellen des Coaches:', error);
    res.status(500).json({ success: false, error: 'Fehler beim Erstellen des Coaches' });
  }
});

// PUT /admin/coaching/coaches/:id - Coach aktualisieren
router.put('/coaches/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, specialization, experience, rating, hourlyRate, availability, bio, imageUrl } = req.body;
    
    const coaches = readCoaches();

    const coachIndex = coaches.findIndex((c: any) => c.id === id);
    
    if (coachIndex === -1) {
      return res.status(404).json({ success: false, error: 'Coach nicht gefunden' });
    }

    coaches[coachIndex] = {
      ...coaches[coachIndex],
      name: name || coaches[coachIndex].name,
      email: email || coaches[coachIndex].email,
      specialization: Array.isArray(specialization) ? specialization : [specialization],
      experience: parseInt(experience) || coaches[coachIndex].experience,
      rating: parseInt(rating) || coaches[coachIndex].rating,
      hourlyRate: parseInt(hourlyRate) || coaches[coachIndex].hourlyRate,
      availability: Array.isArray(availability) ? availability : [availability],
      bio: bio || coaches[coachIndex].bio,
      imageUrl: imageUrl || coaches[coachIndex].imageUrl,
      updatedAt: new Date().toISOString()
    };

    writeCoaches(coaches);

    console.log(`[COACHING] Coach aktualisiert: ${coaches[coachIndex].name}`);
    res.json({ success: true, coach: coaches[coachIndex] });
  } catch (error) {
    console.error('[COACHING] Fehler beim Aktualisieren des Coaches:', error);
    res.status(500).json({ success: false, error: 'Fehler beim Aktualisieren des Coaches' });
  }
});

// DELETE /admin/coaching/coaches/:id - Coach löschen
router.delete('/coaches/:id', (req, res) => {
  try {
    const { id } = req.params;
    const coaches = readCoaches();
    const coachIndex = coaches.findIndex((c: any) => c.id === id);
    
    if (coachIndex === -1) {
      return res.status(404).json({ success: false, error: 'Coach nicht gefunden' });
    }

    const deletedCoach = coaches.splice(coachIndex, 1)[0];
    writeCoaches(coaches);

    console.log(`[COACHING] Coach gelöscht: ${deletedCoach.name}`);
    res.json({ success: true, message: 'Coach erfolgreich gelöscht' });
  } catch (error) {
    console.error('[COACHING] Fehler beim Löschen des Coaches:', error);
    res.status(500).json({ success: false, error: 'Fehler beim Löschen des Coaches' });
  }
});

// Session-Routen
// GET /admin/coaching/sessions - Alle Sessions abrufen
router.get('/sessions', (req, res) => {
  try {
    const sessions = readSessions();
    res.json({ success: true, sessions });
  } catch (error) {
    console.error('[COACHING] Fehler beim Abrufen der Sessions:', error);
    res.status(500).json({ success: false, error: 'Fehler beim Abrufen der Sessions' });
  }
});

// POST /admin/coaching/sessions - Neue Session erstellen
router.post('/sessions', (req, res) => {
  try {
    const { coachId, clientName, date, duration, topic, status, notes } = req.body;
    
    if (!coachId || !clientName || !date || !topic) {
      return res.status(400).json({ success: false, error: 'Coach, Kunde, Datum und Thema sind erforderlich' });
    }

    const sessions = readSessions();
    const newSession = {
      id: Date.now().toString(),
      coachId,
      clientName,
      date,
      duration: parseInt(duration) || 60,
      topic,
      status: status || 'scheduled',
      notes: notes || '',
      createdAt: new Date().toISOString()
    };

    sessions.push(newSession);
    writeSessions(sessions);

    console.log(`[COACHING] Session erstellt: ${newSession.topic} für ${newSession.clientName}`);
    res.json({ success: true, session: newSession });
  } catch (error) {
    console.error('[COACHING] Fehler beim Erstellen der Session:', error);
    res.status(500).json({ success: false, error: 'Fehler beim Erstellen der Session' });
  }
});

// PUT /admin/coaching/sessions/:id - Session aktualisieren
router.put('/sessions/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { coachId, clientName, date, duration, topic, status, notes } = req.body;
    
    const sessions = readSessions();
    const sessionIndex = sessions.findIndex((s: any) => s.id === id);
    
    if (sessionIndex === -1) {
      return res.status(404).json({ success: false, error: 'Session nicht gefunden' });
    }

    sessions[sessionIndex] = {
      ...sessions[sessionIndex],
      coachId: coachId || sessions[sessionIndex].coachId,
      clientName: clientName || sessions[sessionIndex].clientName,
      date: date || sessions[sessionIndex].date,
      duration: parseInt(duration) || sessions[sessionIndex].duration,
      topic: topic || sessions[sessionIndex].topic,
      status: status || sessions[sessionIndex].status,
      notes: notes || sessions[sessionIndex].notes,
      updatedAt: new Date().toISOString()
    };

    writeSessions(sessions);

    console.log(`[COACHING] Session aktualisiert: ${sessions[sessionIndex].topic}`);
    res.json({ success: true, session: sessions[sessionIndex] });
  } catch (error) {
    console.error('[COACHING] Fehler beim Aktualisieren der Session:', error);
    res.status(500).json({ success: false, error: 'Fehler beim Aktualisieren der Session' });
  }
});

// DELETE /admin/coaching/sessions/:id - Session löschen
router.delete('/sessions/:id', (req, res) => {
  try {
    const { id } = req.params;
    const sessions = readSessions();
    const sessionIndex = sessions.findIndex((s: any) => s.id === id);
    
    if (sessionIndex === -1) {
      return res.status(404).json({ success: false, error: 'Session nicht gefunden' });
    }

    const deletedSession = sessions.splice(sessionIndex, 1)[0];
    writeSessions(sessions);

    console.log(`[COACHING] Session gelöscht: ${deletedSession.topic}`);
    res.json({ success: true, message: 'Session erfolgreich gelöscht' });
  } catch (error) {
    console.error('[COACHING] Fehler beim Löschen der Session:', error);
    res.status(500).json({ success: false, error: 'Fehler beim Löschen der Session' });
  }
});

export default router;
