import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import authRoutes from './routes/auth-supabase';
import adminAuthRoutes from './routes/adminAuth';
import adminUploadRoutes from './routes/admin-upload';
import adminCoachingRoutes from './routes/admin-coaching';
import adminKnowledgeRoutes from './routes/admin-knowledge';
import emailTestRoutes from './routes/email-test';
import matchingRoutes from './routes/matching-supabase';
import swipeRoutes from './routes/swipe-supabase';
import metricsRoutes from './routes/metrics-supabase';
import chartsRoutes from './routes/charts-supabase';
import readingsRoutes from './routes/readings-supabase';
import readingRoutes from './routes/reading';
import communityRoutes from './routes/community';
import knowledgeRoutes from './routes/knowledge';
import moonCalendarRoutes from './routes/moon-calendar';
import chatRoutes from './routes/chat';
import notificationRoutes from './routes/notifications';
import userProfileRoutes from './routes/user-profile';
import dataIntegrationRoutes from './routes/data-integration';
import advancedMatchingRoutes from './routes/advanced-matching';
import testDataRoutes from './routes/test-data';
import geocodingRoutes from './routes/geocoding';
import dashboardRoutes from './routes/dashboard';
import lilithRoutes from './routes/lilith';
import { prometheusMiddleware } from './monitoring/prometheus';
import register from './monitoring/prometheus';
import { supabase } from './lib/supabase';
import { initLocalDatabase, localDb } from './lib/localDb';
import { initLilithDatabase } from './lib/lilithDb';
import { apiRateLimit, authRateLimit, uploadRateLimit } from './middleware/rateLimit';

async function main() {
  // Lokale SQLite-Datenbank initialisieren
  try {
    initLocalDatabase();
    console.log('[LOCAL-DB] SQLite-Datenbank bereit');
  } catch (error) {
    console.error('[LOCAL-DB] Fehler beim Initialisieren der lokalen Datenbank:', error);
  }

  // Lilith-Datenbank initialisieren
  try {
    initLilithDatabase();
    console.log('[LILITH-DB] Lilith-Datenbank bereit');
  } catch (error) {
    console.error('[LILITH-DB] Fehler beim Initialisieren der Lilith-Datenbank:', error);
  }

  // Supabase-Verbindung testen (optional)
  try {
    const { data, error } = await supabase.from('knowledge_items').select('count').limit(1);
    if (error) {
      console.log('[SUPABASE] Verbindung nicht verfügbar - verwende lokale Datenbank');
    } else {
      console.log('[SUPABASE] Verbindung erfolgreich');
    }
  } catch (error) {
    console.log('[SUPABASE] Supabase nicht verfügbar - verwende lokale Datenbank');
  }

  const app = express();
  app.set('trust proxy', 1);
  app.use(cors());
  app.use(express.json());
  
  // Rate Limiting Middleware
  app.use(apiRateLimit); // Allgemeines API-Rate-Limiting
  
  // Prometheus Middleware für Request-Metriken
  app.use(prometheusMiddleware);
  
  // Prometheus Metriken-Endpoint
  app.get('/metrics', async (_req, res) => {
    try {
      res.set('Content-Type', 'text/plain; version=0.0.4; charset=utf-8');
      
      // Einfache Metriken für HD App
      const metrics = [
        '# HELP http_requests_total Total number of HTTP requests',
        '# TYPE http_requests_total counter',
        'http_requests_total{method="GET",route="/",status="200"} 1',
        'http_requests_total{method="GET",route="/health",status="200"} 1',
        '',
        '# HELP hd_app_users_total Total number of registered users',
        '# TYPE hd_app_users_total gauge',
        'hd_app_users_total 0',
        '',
        '# HELP hd_app_charts_generated_total Total number of charts generated',
        '# TYPE hd_app_charts_generated_total counter',
        'hd_app_charts_generated_total 0',
        '',
        '# HELP hd_app_matches_total Total number of matches',
        '# TYPE hd_app_matches_total counter',
        'hd_app_matches_total 0'
      ].join('\n');
      
      res.end(metrics);
    } catch (error) {
      console.error('Fehler beim Abrufen der Metriken:', error);
      res.status(500).json({ error: 'Fehler beim Abrufen der Metriken' });
    }
  });
  
  app.get('/', (_req, res) => {
    res.json({ 
      ok: true, 
      message: 'HD App Backend läuft!',
      database: 'SQLite (Lokal) + Supabase (Optional)',
      timestamp: new Date().toISOString()
    });
  });

  // Health Check
  app.get('/health', async (_req, res) => {
    try {
      res.json({
        status: 'healthy',
        database: 'sqlite-local',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        status: 'unhealthy',
        database: 'error',
        error: (error as Error).message,
        timestamp: new Date().toISOString()
      });
    }
  });

  app.use('/auth', authRoutes);        // POST /auth/login, POST /auth/register
  app.use('/admin', adminAuthRoutes);  // POST /admin/login, POST /admin/register
  app.use('/admin', adminUploadRoutes); // POST /admin/upload, GET /admin/upload
  app.use('/admin/coaching', adminCoachingRoutes); // GET/POST /admin/coaching/coaches, GET/POST /admin/coaching/sessions
  app.use('/admin/knowledge', adminKnowledgeRoutes); // GET/POST/PUT/DELETE /admin/knowledge
  app.use('/email', emailTestRoutes);  // POST /email/test, GET /email/status
  app.use('/matching', matchingRoutes); // GET /matching/profile/:userId, POST /matching/analyze, POST /matching/like, POST /matching/message
  app.use('/swipe', swipeRoutes);      // GET /swipe/profiles/:userId, POST /swipe, GET /swipe/matches/:userId
  app.use('/charts', chartsRoutes);    // GET/POST /charts
  app.use('/readings', readingsRoutes); // GET/POST /readings
  app.use('/reading', readingRoutes); // POST /reading/generate
  app.use('/community', communityRoutes); // GET/POST /community/*
  app.use('/knowledge', knowledgeRoutes); // GET/POST/PUT/DELETE /knowledge/*
  
  app.use('/moon-calendar', moonCalendarRoutes); // GET /moon-calendar/phases/:date, GET /moon-calendar/calendar/:year/:month, GET /moon-calendar/current
  app.use('/chat', chatRoutes); // GET /chat/conversations/:userId, GET /chat/messages/:chatId, POST /chat/messages, POST /chat/create, PUT /chat/:chatId/read
  app.use('/notifications', notificationRoutes); // GET /notifications, GET /notifications/unread-count, POST /notifications/mark-read, POST /notifications/send, DELETE /notifications/:id
  app.use('/user-profile', userProfileRoutes); // GET /user-profile/profile/:userId, PUT /user-profile/profile/:userId, POST /user-profile/avatar, POST /user-profile/create, DELETE /user-profile/profile/:userId, GET /user-profile/search
  app.use('/data-integration', dataIntegrationRoutes); // GET /data-integration/dashboard/:userId, POST /data-integration/link-data, GET /data-integration/connections/:userId, POST /data-integration/sync
  app.use('/api/advanced-matching', advancedMatchingRoutes); // POST /api/advanced-matching/analyze, GET /api/advanced-matching/compatible-users/:userId, POST /api/advanced-matching/batch-analyze
  app.use('/geocoding', geocodingRoutes); // POST /geocoding/lookup, POST /geocoding/batch, GET /geocoding/cache, DELETE /geocoding/cache, GET /geocoding/test
  app.use('/dashboard', dashboardRoutes); // GET /dashboard/:userId - Dashboard-Daten für Benutzer
  app.use('/lilith', lilithRoutes); // GET /lilith/info, GET /lilith/centers, GET /lilith/gates - Lilith-Daten
  // Test-Daten Routes (direkt integriert)
  app.post('/test-data/seed', async (req, res) => {
    try {
      const { seedTestData } = await import('./scripts/seedTestData');
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

  app.get('/test-data/status', async (req, res) => {
    try {
      if (!localDb.db) {
        return res.status(500).json({
          success: false,
          error: 'Datenbank nicht verfügbar'
        });
      }
      
      const testUsers = localDb.db.prepare('SELECT COUNT(*) as count FROM users WHERE email LIKE \'%@example.com\'').get() as any;
      const totalUsers = localDb.db.prepare('SELECT COUNT(*) as count FROM users').get() as any;
      const totalSwipes = localDb.db.prepare('SELECT COUNT(*) as count FROM swipes').get() as any;
      const totalMatches = localDb.db.prepare('SELECT COUNT(*) as count FROM matches').get() as any;
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

  // Benutzer-API Routes
  app.get('/api/users/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
      const { localDb } = await import('./lib/localDb');
      
      if (!localDb.db) {
        throw new Error('Datenbank nicht verfügbar');
      }

      const user = localDb.db.prepare('SELECT * FROM users WHERE id = ?').get(userId) as any;
      
      if (!user) {
        return res.status(404).json({ error: 'Benutzer nicht gefunden' });
      }

      res.json(user);
    } catch (error) {
      console.error('Fehler beim Laden des Benutzers:', error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : 'Unbekannter Fehler' 
      });
    }
  });

  app.put('/api/users/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
      const updateData = req.body;
      const { localDb } = await import('./lib/localDb');
      
      if (!localDb.db) {
        throw new Error('Datenbank nicht verfügbar');
      }

      // Erstelle UPDATE-Query dynamisch
      const fields = Object.keys(updateData).filter(key => key !== 'id');
      const setClause = fields.map(field => `${field} = ?`).join(', ');
      const values = fields.map(field => updateData[field]);
      
      if (fields.length === 0) {
        return res.status(400).json({ error: 'Keine Felder zum Aktualisieren' });
      }

      const stmt = localDb.db.prepare(`UPDATE users SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`);
      const result = stmt.run(...values, userId);

      if (result.changes === 0) {
        return res.status(404).json({ error: 'Benutzer nicht gefunden' });
      }

      // Aktualisierten Benutzer zurückgeben
      const updatedUser = localDb.db.prepare('SELECT * FROM users WHERE id = ?').get(userId) as any;
      res.json(updatedUser);
    } catch (error) {
      console.error('Fehler beim Aktualisieren des Benutzers:', error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : 'Unbekannter Fehler' 
      });
    }
  });

  const PORT = process.env.PORT || 4001;
  
  app.listen(PORT, () => {
    console.log(`🚀 HD App Backend läuft auf Port ${PORT}`);
    console.log(`📊 Health Check: http://localhost:${PORT}/health`);
    console.log(`🌙 Moon Calendar API: http://localhost:${PORT}/moon-calendar`);
    console.log(`📈 Metrics: http://localhost:${PORT}/metrics`);
  });
}

main().catch(console.error);
