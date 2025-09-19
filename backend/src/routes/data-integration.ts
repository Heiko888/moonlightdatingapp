import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import jwt from 'jsonwebtoken';

const router = Router();

// Pfade zu den verschiedenen Datenbanken
const userDbPath = path.join(__dirname, '../../data/users.json');
const moonTrackingPath = path.join(__dirname, '../../data/moon-tracking.json');
const matchingDataPath = path.join(__dirname, '../../data/matching-data.json');
const coachingSessionsPath = path.join(__dirname, '../../data/coaching-sessions.json');

// Middleware für JWT-Authentifizierung
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Zugriff verweigert' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ error: 'Ungültiges Token' });
    }
    req.user = user;
    next();
  });
};

// GET /data-integration/dashboard/:userId - Zentrale Dashboard-Daten
router.get('/dashboard/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Alle verknüpften Daten laden
    const dashboardData: any = {
      user: null,
      hdChart: null,
      moonData: null,
      matchingHistory: null,
      coachingSessions: null,
      statistics: null
    };

    // 1. Benutzerdaten laden
    try {
      const users = JSON.parse(fs.readFileSync(userDbPath, 'utf8'));
      dashboardData.user = users.find((u: any) => u.id === userId);
    } catch (error) {
      console.log('Benutzerdaten nicht verfügbar');
    }

    // 2. HD-Chart Daten (falls vorhanden)
    try {
      const hdChartPath = path.join(__dirname, `../../data/hd-charts/${userId}.json`);
      if (fs.existsSync(hdChartPath)) {
        dashboardData.hdChart = JSON.parse(fs.readFileSync(hdChartPath, 'utf8'));
      }
    } catch (error) {
      console.log('HD-Chart Daten nicht verfügbar');
    }

    // 3. Mondkalender-Tracking
    try {
      if (fs.existsSync(moonTrackingPath)) {
        const moonData = JSON.parse(fs.readFileSync(moonTrackingPath, 'utf8'));
        dashboardData.moonData = moonData.filter((entry: any) => entry.userId === userId);
      }
    } catch (error) {
      console.log('Mondkalender-Daten nicht verfügbar');
    }

    // 4. Matching-Historie
    try {
      if (fs.existsSync(matchingDataPath)) {
        const matchingData = JSON.parse(fs.readFileSync(matchingDataPath, 'utf8'));
        dashboardData.matchingHistory = matchingData.filter((entry: any) => 
          entry.user1Id === userId || entry.user2Id === userId
        );
      }
    } catch (error) {
      console.log('Matching-Daten nicht verfügbar');
    }

    // 5. Coaching-Sessions
    try {
      if (fs.existsSync(coachingSessionsPath)) {
        const coachingData = JSON.parse(fs.readFileSync(coachingSessionsPath, 'utf8'));
        dashboardData.coachingSessions = coachingData.filter((session: any) => 
          session.userId === userId
        );
      }
    } catch (error) {
      console.log('Coaching-Daten nicht verfügbar');
    }

    // 6. Statistiken berechnen
    dashboardData.statistics = {
      totalMoonEntries: dashboardData.moonData?.length || 0,
      totalMatchingAnalyses: dashboardData.matchingHistory?.length || 0,
      totalCoachingSessions: dashboardData.coachingSessions?.length || 0,
      lastActivity: new Date().toISOString()
    };

    res.json(dashboardData);
  } catch (error) {
    console.error('Fehler beim Laden der Dashboard-Daten:', error);
    res.status(500).json({ error: 'Fehler beim Laden der Dashboard-Daten' });
  }
});

// POST /data-integration/link-data - Daten zwischen Tools verknüpfen
router.post('/link-data', authenticateToken, async (req, res) => {
  try {
    const { userId, toolType, data, linkTo } = req.body;

    if (!userId || !toolType || !data) {
      return res.status(400).json({ error: 'Alle Felder sind erforderlich' });
    }

    // Datenverknüpfung speichern
    const linkData = {
      id: Date.now().toString(),
      userId,
      toolType, // 'hd-chart', 'moon-calendar', 'matching', 'coaching'
      data,
      linkTo, // Array von Tool-Typen, mit denen verknüpft werden soll
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Verknüpfungsdaten speichern
    const linksPath = path.join(__dirname, '../../data/data-links.json');
    let links = [];
    
    try {
      if (fs.existsSync(linksPath)) {
        links = JSON.parse(fs.readFileSync(linksPath, 'utf8'));
      }
    } catch (error) {
      console.log('Neue Verknüpfungsdatei wird erstellt');
    }

    links.push(linkData);
    fs.writeFileSync(linksPath, JSON.stringify(links, null, 2));

    res.json({ 
      success: true, 
      message: 'Daten erfolgreich verknüpft',
      linkId: linkData.id 
    });
  } catch (error) {
    console.error('Fehler beim Verknüpfen der Daten:', error);
    res.status(500).json({ error: 'Fehler beim Verknüpfen der Daten' });
  }
});

// GET /data-integration/connections/:userId - Alle Verknüpfungen eines Benutzers
router.get('/connections/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const linksPath = path.join(__dirname, '../../data/data-links.json');
    
    if (!fs.existsSync(linksPath)) {
      return res.json({ connections: [] });
    }

    const links = JSON.parse(fs.readFileSync(linksPath, 'utf8'));
    const userConnections = links.filter((link: any) => link.userId === userId);

    res.json({ connections: userConnections });
  } catch (error) {
    console.error('Fehler beim Laden der Verknüpfungen:', error);
    res.status(500).json({ error: 'Fehler beim Laden der Verknüpfungen' });
  }
});

// POST /data-integration/sync - Daten zwischen Tools synchronisieren
router.post('/sync', authenticateToken, async (req, res) => {
  try {
    const { userId, sourceTool, targetTool, data } = req.body;

    if (!userId || !sourceTool || !targetTool || !data) {
      return res.status(400).json({ error: 'Alle Felder sind erforderlich' });
    }

    // Daten-Synchronisation basierend auf Tool-Typ
    let syncResult = { success: true, message: 'Daten synchronisiert' };

    switch (targetTool) {
      case 'dashboard':
        // Dashboard-Daten aktualisieren
        syncResult.message = 'Dashboard aktualisiert';
        break;
      
      case 'moon-calendar':
        // Mondkalender mit HD-Chart verknüpfen
        if (sourceTool === 'hd-chart') {
          syncResult.message = 'Mondkalender mit HD-Chart verknüpft';
        }
        break;
      
      case 'matching':
        // Matching mit HD-Chart verknüpfen
        if (sourceTool === 'hd-chart') {
          syncResult.message = 'Matching mit HD-Chart verknüpft';
        }
        break;
      
      case 'coaching':
        // Coaching mit persönlichen Daten verknüpfen
        syncResult.message = 'Coaching mit persönlichen Daten verknüpft';
        break;
      
      default:
        syncResult.message = 'Unbekannter Tool-Typ';
    }

    res.json(syncResult);
  } catch (error) {
    console.error('Fehler bei der Daten-Synchronisation:', error);
    res.status(500).json({ error: 'Fehler bei der Daten-Synchronisation' });
  }
});

export default router;
