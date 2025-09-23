import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Datei-Pfade für lokale Speicherung
const readingsFile = path.join(__dirname, '../../data/readings.json');
const usersFile = path.join(__dirname, '../../data/users.json');

// Verzeichnis erstellen falls nicht vorhanden
const dataDir = path.dirname(readingsFile);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Hilfsfunktionen zum Lesen/Schreiben der JSON-Dateien
const readReadings = () => {
  try {
    if (fs.existsSync(readingsFile)) {
      const data = fs.readFileSync(readingsFile, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('[ADMIN-READINGS] Fehler beim Lesen der Readings:', error);
  }
  return [];
};

const writeReadings = (readings: any[]) => {
  try {
    fs.writeFileSync(readingsFile, JSON.stringify(readings, null, 2));
  } catch (error) {
    console.error('[ADMIN-READINGS] Fehler beim Schreiben der Readings:', error);
    throw error;
  }
};

const readUsers = () => {
  try {
    if (fs.existsSync(usersFile)) {
      const data = fs.readFileSync(usersFile, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('[ADMIN-READINGS] Fehler beim Lesen der Benutzer:', error);
  }
  return [];
};

// Admin-Authentifizierung Middleware
const requireAdmin = (req: any, res: any, next: any) => {
  const user = req.user;
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ success: false, error: 'Admin-Berechtigung erforderlich' });
  }
  next();
};

// GET /admin/readings - Alle Readings für Admin abrufen
router.get('/', authenticateToken, requireAdmin, (req, res) => {
  try {
    const readings = readReadings();
    const users = readUsers();
    
    // Readings mit Benutzerinformationen anreichern
    const enrichedReadings = readings.map((reading: any) => {
      const user = users.find((u: any) => u.id === reading.user_id);
      return {
        ...reading,
        userName: user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : 'Unbekannter Benutzer',
        userEmail: user ? user.email : 'unbekannt@example.com'
      };
    });

    // Statistiken berechnen
    const stats = {
      total: enrichedReadings.length,
      pdfEnhanced: enrichedReadings.filter((r: any) => r.generation_method === 'PDF-enhanced').length,
      aiPowered: enrichedReadings.filter((r: any) => r.generation_method === 'AI-powered').length,
      relationship: enrichedReadings.filter((r: any) => r.scope === 'relationship').length,
      dating: enrichedReadings.filter((r: any) => r.scope === 'dating').length,
      career: enrichedReadings.filter((r: any) => r.scope === 'career').length,
      completed: enrichedReadings.filter((r: any) => r.status === 'completed').length,
      delivered: enrichedReadings.filter((r: any) => r.status === 'delivered').length,
      draft: enrichedReadings.filter((r: any) => r.status === 'draft').length
    };

    console.log(`[ADMIN-READINGS] ${enrichedReadings.length} Readings für Admin abgerufen`);
    res.json({ 
      success: true, 
      readings: enrichedReadings,
      stats 
    });
  } catch (error) {
    console.error('[ADMIN-READINGS] Fehler beim Abrufen der Readings:', error);
    res.status(500).json({ success: false, error: 'Fehler beim Abrufen der Readings' });
  }
});

// GET /admin/readings/:id - Einzelnes Reading für Admin abrufen
router.get('/:id', authenticateToken, requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const readings = readReadings();
    const users = readUsers();
    
    const reading = readings.find((r: any) => r.id === id);
    
    if (!reading) {
      return res.status(404).json({ success: false, error: 'Reading nicht gefunden' });
    }

    // Reading mit Benutzerinformationen anreichern
    const user = users.find((u: any) => u.id === reading.user_id);
    const enrichedReading = {
      ...reading,
      userName: user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : 'Unbekannter Benutzer',
      userEmail: user ? user.email : 'unbekannt@example.com',
      userProfile: user || null
    };

    console.log(`[ADMIN-READINGS] Reading ${id} für Admin abgerufen`);
    res.json({ success: true, reading: enrichedReading });
  } catch (error) {
    console.error('[ADMIN-READINGS] Fehler beim Abrufen des Readings:', error);
    res.status(500).json({ success: false, error: 'Fehler beim Abrufen des Readings' });
  }
});

// PUT /admin/readings/:id - Reading aktualisieren (Admin)
router.put('/:id', authenticateToken, requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const { status, content, reflectionQuestions, tags, summary } = req.body;
    
    const readings = readReadings();
    const readingIndex = readings.findIndex((r: any) => r.id === id);
    
    if (readingIndex === -1) {
      return res.status(404).json({ success: false, error: 'Reading nicht gefunden' });
    }

    // Reading aktualisieren
    readings[readingIndex] = {
      ...readings[readingIndex],
      status: status || readings[readingIndex].status,
      content: content || readings[readingIndex].content,
      reflectionQuestions: reflectionQuestions || readings[readingIndex].reflectionQuestions,
      tags: tags || readings[readingIndex].tags,
      summary: summary || readings[readingIndex].summary,
      updated_at: new Date().toISOString()
    };

    writeReadings(readings);

    console.log(`[ADMIN-READINGS] Reading ${id} von Admin aktualisiert`);
    res.json({ success: true, reading: readings[readingIndex] });
  } catch (error) {
    console.error('[ADMIN-READINGS] Fehler beim Aktualisieren des Readings:', error);
    res.status(500).json({ success: false, error: 'Fehler beim Aktualisieren des Readings' });
  }
});

// DELETE /admin/readings/:id - Reading löschen (Admin)
router.delete('/:id', authenticateToken, requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const readings = readReadings();
    const readingIndex = readings.findIndex((r: any) => r.id === id);
    
    if (readingIndex === -1) {
      return res.status(404).json({ success: false, error: 'Reading nicht gefunden' });
    }

    const deletedReading = readings.splice(readingIndex, 1)[0];
    writeReadings(readings);

    console.log(`[ADMIN-READINGS] Reading ${id} von Admin gelöscht`);
    res.json({ success: true, message: 'Reading erfolgreich gelöscht' });
  } catch (error) {
    console.error('[ADMIN-READINGS] Fehler beim Löschen des Readings:', error);
    res.status(500).json({ success: false, error: 'Fehler beim Löschen des Readings' });
  }
});

// POST /admin/readings/:id/export - Reading als PDF exportieren
router.post('/:id/export', authenticateToken, requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const { format = 'pdf' } = req.body;
    
    const readings = readReadings();
    const reading = readings.find((r: any) => r.id === id);
    
    if (!reading) {
      return res.status(404).json({ success: false, error: 'Reading nicht gefunden' });
    }

    // Hier würde normalerweise der PDF-Export implementiert werden
    // Für jetzt geben wir eine Mock-Antwort zurück
    const exportData = {
      readingId: reading.id,
      title: reading.title,
      content: reading.content,
      exportFormat: format,
      exportDate: new Date().toISOString(),
      downloadUrl: `/api/admin/readings/${id}/download`
    };

    console.log(`[ADMIN-READINGS] Reading ${id} für Export vorbereitet`);
    res.json({ success: true, export: exportData });
  } catch (error) {
    console.error('[ADMIN-READINGS] Fehler beim Exportieren des Readings:', error);
    res.status(500).json({ success: false, error: 'Fehler beim Exportieren des Readings' });
  }
});

// GET /admin/readings/stats/overview - Reading-Statistiken für Admin
router.get('/stats/overview', authenticateToken, requireAdmin, (req, res) => {
  try {
    const readings = readReadings();
    const users = readUsers();
    
    // Detaillierte Statistiken
    const stats = {
      total: readings.length,
      byMethod: {
        'PDF-enhanced': readings.filter((r: any) => r.generation_method === 'PDF-enhanced').length,
        'AI-powered': readings.filter((r: any) => r.generation_method === 'AI-powered').length,
        'simple': readings.filter((r: any) => r.generation_method === 'simple').length
      },
      byScope: {
        'relationship': readings.filter((r: any) => r.scope === 'relationship').length,
        'dating': readings.filter((r: any) => r.scope === 'dating').length,
        'career': readings.filter((r: any) => r.scope === 'career').length,
        'personal': readings.filter((r: any) => r.scope === 'personal').length
      },
      byStatus: {
        'completed': readings.filter((r: any) => r.status === 'completed').length,
        'delivered': readings.filter((r: any) => r.status === 'delivered').length,
        'draft': readings.filter((r: any) => r.status === 'draft').length
      },
      recentActivity: readings
        .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 10)
        .map((reading: any) => {
          const user = users.find((u: any) => u.id === reading.user_id);
          return {
            id: reading.id,
            title: reading.title,
            userName: user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : 'Unbekannter Benutzer',
            scope: reading.scope,
            method: reading.generation_method,
            status: reading.status,
            createdAt: reading.created_at
          };
        })
    };

    console.log('[ADMIN-READINGS] Reading-Statistiken für Admin abgerufen');
    res.json({ success: true, stats });
  } catch (error) {
    console.error('[ADMIN-READINGS] Fehler beim Abrufen der Statistiken:', error);
    res.status(500).json({ success: false, error: 'Fehler beim Abrufen der Statistiken' });
  }
});

// GET /admin/readings/user/:userId - Alle Readings eines Benutzers
router.get('/user/:userId', authenticateToken, requireAdmin, (req, res) => {
  try {
    const { userId } = req.params;
    const readings = readReadings();
    const users = readUsers();
    
    const userReadings = readings.filter((r: any) => r.user_id === userId);
    const user = users.find((u: any) => u.id === userId);
    
    if (!user) {
      return res.status(404).json({ success: false, error: 'Benutzer nicht gefunden' });
    }

    const enrichedReadings = userReadings.map((reading: any) => ({
      ...reading,
      userName: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
      userEmail: user.email
    }));

    console.log(`[ADMIN-READINGS] ${userReadings.length} Readings für Benutzer ${userId} abgerufen`);
    res.json({ 
      success: true, 
      readings: enrichedReadings,
      user: {
        id: user.id,
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        email: user.email,
        joinDate: user.createdAt || user.joinDate
      }
    });
  } catch (error) {
    console.error('[ADMIN-READINGS] Fehler beim Abrufen der Benutzer-Readings:', error);
    res.status(500).json({ success: false, error: 'Fehler beim Abrufen der Benutzer-Readings' });
  }
});

export default router;
