import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { localDb } from '../lib/localDb';
import { 
  hdTypeDistribution, 
  centerActivationRate, 
  channelUsage, 
  profileDistribution,
  openaiApiCalls,
  databaseOperations
} from '../monitoring/prometheus';

const router = express.Router();

// ==================== USER PROFILE PERSISTENCE ====================

// POST /data-persistence/user-profile - Benutzerprofil speichern/aktualisieren
router.post('/user-profile', authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.id;
    const { 
      name, 
      birthdate, 
      birthplace, 
      hd_type, 
      profile, 
      centers, 
      channels, 
      gates, 
      planets, 
      chart_data,
      avatar 
    } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'Benutzer nicht authentifiziert' });
    }

    // Aktualisiere Benutzerprofil in der Datenbank
    const updateStmt = localDb.db.prepare(`
      UPDATE users SET 
        name = ?, 
        birthdate = ?, 
        birthplace = ?, 
        hd_type = ?, 
        profile = ?, 
        centers = ?, 
        channels = ?, 
        gates = ?, 
        planets = ?, 
        chart_data = ?, 
        avatar = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    const result = updateStmt.run(
      name,
      birthdate,
      birthplace,
      hd_type,
      profile,
      JSON.stringify(centers),
      JSON.stringify(channels),
      JSON.stringify(gates),
      JSON.stringify(planets),
      JSON.stringify(chart_data),
      avatar,
      userId
    );

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Benutzer nicht gefunden' });
    }

    // Metriken aktualisieren
    if (hd_type) {
      hdTypeDistribution.labels(hd_type).inc();
    }
    if (profile) {
      profileDistribution.labels(profile).inc();
    }
    databaseOperations.labels('update', 'users').inc();

    res.json({
      success: true,
      message: 'Benutzerprofil erfolgreich aktualisiert',
      userId
    });

  } catch (error) {
    console.error('[data-persistence] User profile error:', error);
    databaseOperations.labels('update', 'users').inc();
    res.status(500).json({ error: 'Fehler beim Speichern des Benutzerprofils' });
  }
});

// GET /data-persistence/user-profile - Benutzerprofil abrufen
router.get('/user-profile', authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Benutzer nicht authentifiziert' });
    }

    const user = localDb.getUserById(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'Benutzer nicht gefunden' });
    }

    // Parse JSON-Felder
    const userProfile = {
      ...user,
      centers: (user as any).centers ? JSON.parse((user as any).centers) : {},
      channels: (user as any).channels ? JSON.parse((user as any).channels) : {},
      gates: (user as any).gates ? JSON.parse((user as any).gates) : {},
      planets: (user as any).planets ? JSON.parse((user as any).planets) : {},
      chart_data: (user as any).chart_data ? JSON.parse((user as any).chart_data) : {}
    };

    res.json(userProfile);

  } catch (error) {
    console.error('[data-persistence] Get user profile error:', error);
    res.status(500).json({ error: 'Fehler beim Laden des Benutzerprofils' });
  }
});

// ==================== CHART PERSISTENCE ====================

// POST /data-persistence/chart - Human Design Chart speichern
router.post('/chart', authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.id;
    const { 
      name, 
      birth_date, 
      birth_time, 
      birth_place, 
      chart_data, 
      centers, 
      channels, 
      gates, 
      planets 
    } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'Benutzer nicht authentifiziert' });
    }

    if (!name || !birth_date || !birth_place) {
      return res.status(400).json({ 
        error: 'Name, Geburtsdatum und Geburtsort sind erforderlich' 
      });
    }

    const chartId = localDb.createChart({
      user_id: userId,
      name,
      birth_date,
      birth_time: birth_time || "00:00",
      birth_place,
      chart_data: JSON.stringify(chart_data),
      centers: JSON.stringify(centers),
      channels: JSON.stringify(channels),
      gates: JSON.stringify(gates),
      planets: JSON.stringify(planets)
    });

    // Metriken aktualisieren
    if (chart_data?.hdType) {
      hdTypeDistribution.labels(chart_data.hdType).inc();
    }
    if (chart_data?.profile) {
      profileDistribution.labels(chart_data.profile).inc();
    }
    databaseOperations.labels('insert', 'charts').inc();

    res.status(201).json({
      success: true,
      chartId: chartId.lastInsertRowid,
      message: 'Chart erfolgreich gespeichert'
    });

  } catch (error) {
    console.error('[data-persistence] Chart save error:', error);
    databaseOperations.labels('insert', 'charts').inc();
    res.status(500).json({ error: 'Fehler beim Speichern des Charts' });
  }
});

// GET /data-persistence/charts - Alle Charts des Benutzers abrufen
router.get('/charts', authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Benutzer nicht authentifiziert' });
    }

    const charts = localDb.getChartsByUserId(userId);
    
    // Parse JSON-Felder für jeden Chart
    const parsedCharts = charts.map(chart => ({
      ...chart,
      chart_data: chart.chart_data ? JSON.parse(chart.chart_data) : {},
      centers: chart.centers ? JSON.parse(chart.centers) : {},
      channels: chart.channels ? JSON.parse(chart.channels) : {},
      gates: chart.gates ? JSON.parse(chart.gates) : {},
      planets: chart.planets ? JSON.parse(chart.planets) : {}
    }));

    res.json(parsedCharts);

  } catch (error) {
    console.error('[data-persistence] Get charts error:', error);
    res.status(500).json({ error: 'Fehler beim Laden der Charts' });
  }
});

// ==================== MOON TRACKING PERSISTENCE ====================

// POST /data-persistence/moon-tracking - Mondkalender-Eintrag speichern
router.post('/moon-tracking', authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.id;
    const { 
      date, 
      moon_phase, 
      mood, 
      energy, 
      notes, 
      rituals_completed, 
      journal_entry_id 
    } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'Benutzer nicht authentifiziert' });
    }

    if (!date || !moon_phase) {
      return res.status(400).json({ 
        error: 'Datum und Mondphase sind erforderlich' 
      });
    }

    const stmt = localDb.db.prepare(`
      INSERT INTO moon_tracking (
        id, user_id, date, moon_phase, mood, energy, notes, 
        rituals_completed, journal_entry_id, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `);

    const id = Math.random().toString(36).substr(2, 9);
    const result = stmt.run(
      id,
      userId,
      date,
      moon_phase,
      mood,
      energy,
      notes,
      JSON.stringify(rituals_completed),
      journal_entry_id
    );

    databaseOperations.labels('insert', 'moon_tracking').inc();

    res.status(201).json({
      success: true,
      trackingId: id,
      message: 'Mondkalender-Eintrag erfolgreich gespeichert'
    });

  } catch (error) {
    console.error('[data-persistence] Moon tracking error:', error);
    databaseOperations.labels('insert', 'moon_tracking').inc();
    res.status(500).json({ error: 'Fehler beim Speichern des Mondkalender-Eintrags' });
  }
});

// GET /data-persistence/moon-tracking - Mondkalender-Einträge abrufen
router.get('/moon-tracking', authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.id;
    const { start_date, end_date } = req.query;

    if (!userId) {
      return res.status(401).json({ error: 'Benutzer nicht authentifiziert' });
    }

    let query = 'SELECT * FROM moon_tracking WHERE user_id = ?';
    const params: any[] = [userId];

    if (start_date) {
      query += ' AND date >= ?';
      params.push(start_date);
    }
    if (end_date) {
      query += ' AND date <= ?';
      params.push(end_date);
    }

    query += ' ORDER BY date DESC';

    const stmt = localDb.db.prepare(query);
    const entries = stmt.all(...params);

    // Parse JSON-Felder
    const parsedEntries = entries.map(entry => ({
      ...entry,
      rituals_completed: entry.rituals_completed ? JSON.parse(entry.rituals_completed) : []
    }));

    res.json(parsedEntries);

  } catch (error) {
    console.error('[data-persistence] Get moon tracking error:', error);
    res.status(500).json({ error: 'Fehler beim Laden der Mondkalender-Einträge' });
  }
});

// ==================== JOURNAL PERSISTENCE ====================

// POST /data-persistence/journal - Journal-Eintrag speichern
router.post('/journal', authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.id;
    const { 
      title, 
      content, 
      mood, 
      energy_level, 
      tags 
    } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'Benutzer nicht authentifiziert' });
    }

    if (!title || !content) {
      return res.status(400).json({ 
        error: 'Titel und Inhalt sind erforderlich' 
      });
    }

    const stmt = localDb.db.prepare(`
      INSERT INTO journal_entries (
        id, user_id, title, content, mood, energy_level, tags, 
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `);

    const id = Math.random().toString(36).substr(2, 9);
    const result = stmt.run(
      id,
      userId,
      title,
      content,
      mood,
      energy_level,
      JSON.stringify(tags)
    );

    databaseOperations.labels('insert', 'journal_entries').inc();

    res.status(201).json({
      success: true,
      entryId: id,
      message: 'Journal-Eintrag erfolgreich gespeichert'
    });

  } catch (error) {
    console.error('[data-persistence] Journal error:', error);
    databaseOperations.labels('insert', 'journal_entries').inc();
    res.status(500).json({ error: 'Fehler beim Speichern des Journal-Eintrags' });
  }
});

// GET /data-persistence/journal - Journal-Einträge abrufen
router.get('/journal', authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.id;
    const { limit = 50, offset = 0 } = req.query;

    if (!userId) {
      return res.status(401).json({ error: 'Benutzer nicht authentifiziert' });
    }

    const stmt = localDb.db.prepare(`
      SELECT * FROM journal_entries 
      WHERE user_id = ? 
      ORDER BY created_at DESC 
      LIMIT ? OFFSET ?
    `);

    const entries = stmt.all(userId, parseInt(limit as string), parseInt(offset as string));

    // Parse JSON-Felder
    const parsedEntries = entries.map(entry => ({
      ...entry,
      tags: entry.tags ? JSON.parse(entry.tags) : []
    }));

    res.json(parsedEntries);

  } catch (error) {
    console.error('[data-persistence] Get journal error:', error);
    res.status(500).json({ error: 'Fehler beim Laden der Journal-Einträge' });
  }
});

// ==================== DASHBOARD DATA ====================

// GET /data-persistence/dashboard - Zentrale Dashboard-Daten
router.get('/dashboard', authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Benutzer nicht authentifiziert' });
    }

    // Benutzerdaten
    const user = localDb.getUserById(userId);
    
    // Charts
    const charts = localDb.getChartsByUserId(userId);
    
    // Journal-Einträge (letzte 10)
    const journalStmt = localDb.db.prepare(`
      SELECT * FROM journal_entries 
      WHERE user_id = ? 
      ORDER BY created_at DESC 
      LIMIT 10
    `);
    const journalEntries = journalStmt.all(userId);
    
    // Mondkalender-Einträge (letzte 30)
    const moonStmt = localDb.db.prepare(`
      SELECT * FROM moon_tracking 
      WHERE user_id = ? 
      ORDER BY date DESC 
      LIMIT 30
    `);
    const moonEntries = moonStmt.all(userId);

    // Statistiken
    const stats = {
      totalCharts: charts.length,
      totalJournalEntries: journalEntries.length,
      totalMoonEntries: moonEntries.length,
      lastActivity: user?.updated_at || user?.created_at
    };

    const dashboardData = {
      user: user ? {
        ...user,
        centers: user.centers ? JSON.parse(user.centers) : {},
        channels: user.channels ? JSON.parse(user.channels) : {},
        gates: user.gates ? JSON.parse(user.gates) : {},
        planets: user.planets ? JSON.parse(user.planets) : {},
        chart_data: user.chart_data ? JSON.parse(user.chart_data) : {}
      } : null,
      charts: charts.map(chart => ({
        ...chart,
        chart_data: chart.chart_data ? JSON.parse(chart.chart_data) : {},
        centers: chart.centers ? JSON.parse(chart.centers) : {},
        channels: chart.channels ? JSON.parse(chart.channels) : {},
        gates: chart.gates ? JSON.parse(chart.gates) : {},
        planets: chart.planets ? JSON.parse(chart.planets) : {}
      })),
      journalEntries: journalEntries.map(entry => ({
        ...entry,
        tags: entry.tags ? JSON.parse(entry.tags) : []
      })),
      moonEntries: moonEntries.map(entry => ({
        ...entry,
        rituals_completed: entry.rituals_completed ? JSON.parse(entry.rituals_completed) : []
      })),
      statistics: stats
    };

    res.json(dashboardData);

  } catch (error) {
    console.error('[data-persistence] Dashboard error:', error);
    res.status(500).json({ error: 'Fehler beim Laden der Dashboard-Daten' });
  }
});

// ==================== USER ANALYTICS ====================

// GET /data-persistence/analytics - Umfassende Benutzer-Analytics
router.get('/analytics', authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Benutzer nicht authentifiziert' });
    }

    // Alle Mondkalender-Einträge
    const moonStmt = localDb.db.prepare(`
      SELECT * FROM moon_tracking 
      WHERE user_id = ? 
      ORDER BY date DESC
    `);
    const moonEntries = moonStmt.all(userId);
    
    // Alle Journal-Einträge
    const journalStmt = localDb.db.prepare(`
      SELECT * FROM journal_entries 
      WHERE user_id = ? 
      ORDER BY created_at DESC
    `);
    const journalEntries = journalStmt.all(userId);

    // Charts
    const charts = localDb.getChartsByUserId(userId);

    // Berechne detaillierte Statistiken
    const analytics = calculateUserAnalytics(moonEntries, journalEntries, charts);

    res.json({
      success: true,
      data: {
        moonEntries,
        journalEntries,
        charts,
        analytics
      }
    });

  } catch (error) {
    console.error('[data-persistence] Analytics error:', error);
    res.status(500).json({ error: 'Fehler beim Laden der Analytics-Daten' });
  }
});

// Hilfsfunktion für Analytics-Berechnungen
function calculateUserAnalytics(moonEntries: any[], journalEntries: any[], charts: any[]) {
  const analytics = {
    // Grundstatistiken
    totalMoonEntries: moonEntries.length,
    totalJournalEntries: journalEntries.length,
    totalCharts: charts.length,
    
    // Mondkalender-Statistiken
    averageMood: 0,
    averageEnergy: 0,
    moodTrend: 'neutral',
    energyTrend: 'neutral',
    
    // Mondphasen-Analyse
    phaseDistribution: {} as Record<string, number>,
    mostActivePhase: 'Keine Daten',
    leastActivePhase: 'Keine Daten',
    
    // Rituale-Statistiken
    totalRituals: 0,
    mostPopularRitual: 'Keine Daten',
    ritualCompletionRate: 0,
    
    // Zeitliche Analyse
    streakDays: 0,
    longestStreak: 0,
    lastActivity: 'Nie',
    mostActiveDay: 'Keine Daten',
    mostActiveMonth: 'Keine Daten',
    
    // Journal-Statistiken
    averageJournalLength: 0,
    mostUsedTags: [] as string[],
    journalFrequency: 0,
    
    // Trends
    moodOverTime: [] as Array<{date: string, mood: number}>,
    energyOverTime: [] as Array<{date: string, energy: number}>,
    activityOverTime: [] as Array<{date: string, entries: number}>
  };

  if (moonEntries.length === 0) {
    return analytics;
  }

  // Berechne Durchschnittswerte
  const totalMood = moonEntries.reduce((sum, entry) => sum + (entry.mood || 0), 0);
  const totalEnergy = moonEntries.reduce((sum, entry) => sum + (entry.energy || 0), 0);
  analytics.averageMood = Math.round((totalMood / moonEntries.length) * 10) / 10;
  analytics.averageEnergy = Math.round((totalEnergy / moonEntries.length) * 10) / 10;

  // Mondphasen-Verteilung
  moonEntries.forEach(entry => {
    const phase = entry.moon_phase;
    analytics.phaseDistribution[phase] = (analytics.phaseDistribution[phase] || 0) + 1;
  });

  // Häufigste und seltenste Mondphase
  const phaseEntries = Object.entries(analytics.phaseDistribution);
  if (phaseEntries.length > 0) {
    analytics.mostActivePhase = phaseEntries.reduce((a, b) => a[1] > b[1] ? a : b)[0];
    analytics.leastActivePhase = phaseEntries.reduce((a, b) => a[1] < b[1] ? a : b)[0];
  }

  // Rituale-Statistiken
  const allRituals: string[] = [];
  moonEntries.forEach(entry => {
    if (entry.rituals_completed) {
      try {
        const rituals = JSON.parse(entry.rituals_completed);
        if (Array.isArray(rituals)) {
          allRituals.push(...rituals);
        }
      } catch (e) {
        // Ignore parsing errors
      }
    }
  });
  
  analytics.totalRituals = allRituals.length;
  
  if (allRituals.length > 0) {
    const ritualCounts = allRituals.reduce((acc, ritual) => {
      acc[ritual] = (acc[ritual] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    analytics.mostPopularRitual = Object.entries(ritualCounts).reduce((a, b) => a[1] > b[1] ? a : b)[0];
    analytics.ritualCompletionRate = Math.round((allRituals.length / moonEntries.length) * 100);
  }

  // Streak-Berechnung
  const sortedDates = moonEntries
    .map(entry => new Date(entry.date))
    .sort((a, b) => b.getTime() - a.getTime());
  
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  for (let i = 0; i < sortedDates.length; i++) {
    const entryDate = new Date(sortedDates[i]);
    entryDate.setHours(0, 0, 0, 0);
    const daysDiff = Math.floor((today.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (i === 0 && daysDiff <= 1) {
      currentStreak = 1;
      tempStreak = 1;
    } else if (i > 0) {
      const prevDate = new Date(sortedDates[i-1]);
      prevDate.setHours(0, 0, 0, 0);
      const daysBetween = Math.floor((prevDate.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysBetween === 1) {
        tempStreak++;
        if (i === 1) currentStreak = tempStreak;
      } else {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 1;
      }
    }
  }
  
  analytics.streakDays = currentStreak;
  analytics.longestStreak = Math.max(longestStreak, tempStreak);

  // Letzte Aktivität
  if (moonEntries.length > 0) {
    analytics.lastActivity = new Date(moonEntries[0].date).toLocaleDateString('de-DE');
  }

  // Zeitliche Trends
  analytics.moodOverTime = moonEntries.slice(0, 30).map(entry => ({
    date: entry.date,
    mood: entry.mood || 0
  }));

  analytics.energyOverTime = moonEntries.slice(0, 30).map(entry => ({
    date: entry.date,
    energy: entry.energy || 0
  }));

  // Journal-Statistiken
  if (journalEntries.length > 0) {
    const totalLength = journalEntries.reduce((sum, entry) => sum + (entry.content?.length || 0), 0);
    analytics.averageJournalLength = Math.round(totalLength / journalEntries.length);
    
    // Häufigste Tags
    const allTags: string[] = [];
    journalEntries.forEach(entry => {
      if (entry.tags) {
        try {
          const tags = JSON.parse(entry.tags);
          if (Array.isArray(tags)) {
            allTags.push(...tags);
          }
        } catch (e) {
          // Ignore parsing errors
        }
      }
    });
    
    const tagCounts = allTags.reduce((acc, tag) => {
      acc[tag] = (acc[tag] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    analytics.mostUsedTags = Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([tag]) => tag);
  }

  return analytics;
}

export default router;
