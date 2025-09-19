import express, { Request, Response } from 'express';
import { seedTestData } from '../scripts/seedTestData';

const router = express.Router();

/**
 * POST /test-data/seed
 * Erstellt Test-Daten für das Swipe & Matching System
 */
router.post('/seed', async (req: Request, res: Response) => {
  try {
    console.log('🌱 Starte Test-Daten Seeding...');
    
    const result = await seedTestData();
    
    if (result.success) {
      res.json({
        success: true,
        message: 'Test-Daten erfolgreich erstellt',
        data: {
          usersCreated: result.usersCreated,
          timestamp: new Date().toISOString()
        }
      });
    } else {
      res.status(500).json({
        success: false,
        error: result.error || 'Unbekannter Fehler beim Seeding'
      });
    }
    
  } catch (error) {
    console.error('Fehler beim Seeding der Test-Daten:', error);
    res.status(500).json({
      success: false,
      error: 'Fehler beim Erstellen der Test-Daten',
      details: error instanceof Error ? error.message : 'Unbekannter Fehler'
    });
  }
});

/**
 * GET /test-data/status
 * Zeigt Status der Test-Daten
 */
router.get('/status', async (req: Request, res: Response) => {
  try {
    const { localDb } = await import('../lib/localDb');
    
    if (!localDb.db) {
      return res.status(500).json({
        success: false,
        error: 'Datenbank nicht verfügbar'
      });
    }
    
    // Zähle Test-Benutzer
    const testUsers = localDb.db.prepare('SELECT COUNT(*) as count FROM users WHERE email LIKE "%@example.com"').get() as any;
    const totalUsers = localDb.db.prepare('SELECT COUNT(*) as count FROM users').get() as any;
    
    // Zähle Swipes
    const totalSwipes = localDb.db.prepare('SELECT COUNT(*) as count FROM swipes').get() as any;
    
    // Zähle Matches
    const totalMatches = localDb.db.prepare('SELECT COUNT(*) as count FROM matches').get() as any;
    
    // Zähle Kompatibilitätsanalysen
    const totalAnalyses = localDb.db.prepare('SELECT COUNT(*) as count FROM compatibility_analysis').get() as any;
    
    res.json({
      success: true,
      data: {
        testUsers: testUsers.count,
        totalUsers: totalUsers.count,
        totalSwipes: totalSwipes.count,
        totalMatches: totalMatches.count,
        totalAnalyses: totalAnalyses.count,
        timestamp: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('Fehler beim Abrufen des Test-Daten-Status:', error);
    res.status(500).json({
      success: false,
      error: 'Fehler beim Abrufen des Status',
      details: error instanceof Error ? error.message : 'Unbekannter Fehler'
    });
  }
});

/**
 * GET /test-data/users
 * Zeigt alle Test-Benutzer
 */
router.get('/users', async (req: Request, res: Response) => {
  try {
    const { localDb } = await import('../lib/localDb');
    
    if (!localDb.db) {
      return res.status(500).json({
        success: false,
        error: 'Datenbank nicht verfügbar'
      });
    }
    
    const testUsers = localDb.db.prepare(`
      SELECT id, name, email, hd_type, profile, location, bio, age, interests, images
      FROM users 
      WHERE email LIKE "%@example.com"
      ORDER BY created_at DESC
    `).all() as any[];
    
    // Parse JSON-Felder
    const users = testUsers.map(user => ({
      ...user,
      interests: user.interests ? JSON.parse(user.interests) : [],
      images: user.images ? JSON.parse(user.images) : []
    }));
    
    res.json({
      success: true,
      data: {
        users,
        count: users.length,
        timestamp: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('Fehler beim Abrufen der Test-Benutzer:', error);
    res.status(500).json({
      success: false,
      error: 'Fehler beim Abrufen der Test-Benutzer',
      details: error instanceof Error ? error.message : 'Unbekannter Fehler'
    });
  }
});

/**
 * DELETE /test-data/cleanup
 * Löscht alle Test-Daten
 */
router.delete('/cleanup', async (req: Request, res: Response) => {
  try {
    const { localDb } = await import('../lib/localDb');
    
    if (!localDb.db) {
      return res.status(500).json({
        success: false,
        error: 'Datenbank nicht verfügbar'
      });
    }
    
    console.log('🗑️ Lösche alle Test-Daten...');
    
    // Lösche in der richtigen Reihenfolge (wegen Foreign Keys)
    localDb.db.exec('DELETE FROM match_feedback WHERE user_id IN (SELECT id FROM users WHERE email LIKE "%@example.com")');
    localDb.db.exec('DELETE FROM compatibility_analysis WHERE user_a IN (SELECT id FROM users WHERE email LIKE "%@example.com") OR user_b IN (SELECT id FROM users WHERE email LIKE "%@example.com")');
    localDb.db.exec('DELETE FROM matches WHERE user_a IN (SELECT id FROM users WHERE email LIKE "%@example.com") OR user_b IN (SELECT id FROM users WHERE email LIKE "%@example.com")');
    localDb.db.exec('DELETE FROM swipes WHERE user_id IN (SELECT id FROM users WHERE email LIKE "%@example.com") OR target_id IN (SELECT id FROM users WHERE email LIKE "%@example.com")');
    localDb.db.exec('DELETE FROM users WHERE email LIKE "%@example.com"');
    
    console.log('✅ Test-Daten erfolgreich gelöscht');
    
    res.json({
      success: true,
      message: 'Test-Daten erfolgreich gelöscht',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Fehler beim Löschen der Test-Daten:', error);
    res.status(500).json({
      success: false,
      error: 'Fehler beim Löschen der Test-Daten',
      details: error instanceof Error ? error.message : 'Unbekannter Fehler'
    });
  }
});

export default router;
