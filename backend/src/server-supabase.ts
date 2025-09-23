import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import authRoutes from './routes/auth-supabase';
import adminAuthRoutes from './routes/adminAuth';
import adminUploadRoutes from './routes/admin-upload';
import adminCoachingRoutes from './routes/admin-coaching';
import adminKnowledgeRoutes from './routes/admin-knowledge';
import adminReadingsRoutes from './routes/admin-readings';
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
import astronomyRoutes from './routes/astronomy';
import chatRoutes, { setupChatWebSocket } from './routes/chat';
import coachingRoutes from './routes/coaching';
import vipDashboardRoutes from './routes/vip-dashboard';
import datingRoutes from './routes/dating';
import subscriptionRoutes from './routes/subscription';
import notificationRoutes from './routes/notifications';
import userProfileRoutes from './routes/user-profile';
import dataPersistenceRoutes from './routes/data-persistence';
import realtimeAnalysisRoutes from './routes/realtime-analysis';
import testMetricsRoutes from './routes/test-metrics';
import reikiRoutes from './routes/reiki';
import planetsRoutes from './routes/planets';
import mercuryAdminRoutes from './routes/mercury-admin';
import aiEngineRoutes from './routes/ai-engine';
import chironRoutes from './routes/chiron';
import lilithRoutes from './routes/lilith';
import blackMoonLilithRoutes from './routes/blackMoonLilith';
import venusRoutes from './routes/venus';
import { prometheusMiddleware } from './monitoring/prometheus';
import { grafanaCloudMiddleware, recordAppMetrics, logToGrafana } from './monitoring/grafana-cloud';
import { supabase } from './lib/supabase';
import { initLocalDatabase } from './lib/localDb';
import { initLilithDatabase } from './lib/lilithDb';
import { initBlackMoonLilithDatabase } from './lib/blackMoonLilithDb';
import { initVenusDatabase, initVenusData } from './lib/venusDb';
import { apiRateLimit, authRateLimit, uploadRateLimit } from './middleware/rateLimit';
import RealtimeAnalysisWebSocketServer from './websocket/realtimeAnalysisWS';
import { createServer } from 'http';

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

  // Venus-Datenbank initialisieren
  try {
    initVenusDatabase();
    initVenusData();
    console.log('[VENUS-DB] Venus-Datenbank bereit');
  } catch (error) {
    console.error('[VENUS-DB] Fehler beim Initialisieren der Venus-Datenbank:', error);
  }


  // Black Moon Lilith-Datenbank initialisieren
  try {
    initBlackMoonLilithDatabase();
    console.log('[BML-DB] Black Moon Lilith-Datenbank bereit');
  } catch (error) {
    console.error('[BML-DB] Fehler beim Initialisieren der Black Moon Lilith-Datenbank:', error);
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
  app.use(grafanaCloudMiddleware);
  
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
        'hd_app_matches_total 0',
        '',
        '# HELP hd_app_moon_phases_calculated_total Total number of moon phases calculated',
        '# TYPE hd_app_moon_phases_calculated_total counter',
        'hd_app_moon_phases_calculated_total 0',
        '',
        '# HELP hd_app_dating_impulses_generated_total Total number of dating impulses generated',
        '# TYPE hd_app_dating_impulses_generated_total counter',
        'hd_app_dating_impulses_generated_total 0',
        '',
        '# HELP hd_app_live_events_joined_total Total number of live events joined',
        '# TYPE hd_app_live_events_joined_total counter',
        'hd_app_live_events_joined_total 0',
        '',
        '# HELP hd_app_courses_completed_total Total number of courses completed',
        '# TYPE hd_app_courses_completed_total counter',
        'hd_app_courses_completed_total 0'
      ].join('\n');

      res.end(metrics);
      
      // Log Metriken-Abruf
      logToGrafana('info', 'Metrics endpoint accessed', {
        endpoint: '/metrics',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Fehler beim Abrufen der Metriken:', error);
      logToGrafana('error', 'Failed to retrieve metrics', {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      });
      res.status(500).json({ error: 'Fehler beim Abrufen der Metriken' });
    }
  });
  
  app.get('/', (_req, res) => {
    res.json({ 
      ok: true, 
      message: 'HD App Backend läuft!',
      database: 'SQLite (Lokal) + Supabase (Optional)',
      grafanaCloud: 'integrated',
      timestamp: new Date().toISOString()
    });
    
    // Log Health Check
    logToGrafana('info', 'Health check endpoint accessed', {
      endpoint: '/',
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
  app.use('/admin/readings', adminReadingsRoutes); // GET/PUT/DELETE /admin/readings, Reading-Management für Admin
  app.use('/email', emailTestRoutes);  // POST /email/test, GET /email/status
  app.use('/matching', matchingRoutes); // GET /matching/profile/:userId, POST /matching/analyze, POST /matching/like, POST /matching/message
  app.use('/swipe', swipeRoutes);      // GET /swipe/profiles/:userId, POST /swipe, GET /swipe/matches/:userId
  app.use('/charts', chartsRoutes);    // GET/POST /charts
  app.use('/readings', readingsRoutes); // GET/POST /readings
  app.use('/reading', readingRoutes); // POST /reading/generate
  app.use('/community', communityRoutes); // GET/POST /community/*
  app.use('/knowledge', knowledgeRoutes); // GET/POST/PUT/DELETE /knowledge/*
  app.use('/moon-calendar', moonCalendarRoutes); // GET /moon-calendar/phases/:date, GET /moon-calendar/calendar/:year/:month, GET /moon-calendar/current
  app.use('/astronomy', astronomyRoutes); // GET /astronomy/moon - Open-Meteo API für präzise Monddaten
  app.use('/chat', chatRoutes);
  app.use('/coaching', coachingRoutes);
  app.use('/vip-dashboard', vipDashboardRoutes);
  app.use('/subscription', subscriptionRoutes); // GET/PUT /subscription/user/:userId, POST /subscription/user/:userId/cancel
  app.use('/dating', datingRoutes); // GET /chat/conversations/:userId, GET /chat/messages/:chatId, POST /chat/messages, POST /chat/create, PUT /chat/:chatId/read
  app.use('/notifications', notificationRoutes); // GET /notifications, GET /notifications/unread-count, POST /notifications/mark-read, POST /notifications/send, DELETE /notifications/:id
  app.use('/user-profile', userProfileRoutes); // GET /user-profile/profile/:userId, PUT /user-profile/profile/:userId, POST /user-profile/avatar, POST /user-profile/create, DELETE /user-profile/profile/:userId, GET /user-profile/search
  app.use('/data-persistence', dataPersistenceRoutes); // POST/GET /data-persistence/user-profile, POST/GET /data-persistence/chart, POST/GET /data-persistence/moon-tracking, POST/GET /data-persistence/journal, GET /data-persistence/dashboard
  app.use('/realtime-analysis', realtimeAnalysisRoutes); // POST /realtime-analysis/analyze, WebSocket /realtime-analysis/live
  app.use('/api/test-metrics', testMetricsRoutes);
  app.use('/reiki', reikiRoutes); // GET /reiki/symbols, POST /reiki/analysis, POST /reiki/session-plan, GET /reiki/benefits, POST /reiki/self-treatment, GET /reiki/meditation-guides // Test-Metriken für Grafana Cloud
  app.use('/api/planets', planetsRoutes); // GET /api/planets/:planet/info, GET /api/planets/:planet/gates, GET /api/planets/:planet/centers
  app.use('/api/chiron', chironRoutes); // GET /api/chiron/gates, GET /api/chiron/centers, GET /api/chiron/info
  app.use('/lilith', lilithRoutes); // GET /lilith/info, GET /lilith/centers, GET /lilith/gates - Lilith-Daten
  app.use('/blackmoonlilith', blackMoonLilithRoutes); // GET /blackmoonlilith/info, GET /blackmoonlilith/centers, GET /blackmoonlilith/gates - Black Moon Lilith-Daten
  app.use('/venus', venusRoutes); // GET /venus/info, GET /venus/centers, GET /venus/gates - Venus-Daten
  app.use('/api/mercury-admin', mercuryAdminRoutes); // Admin-API für Mercury Gate-Bearbeitung
  app.use('/api/ai-engine', aiEngineRoutes); // AI-Engine API für erweiterte Readings, Reflektions-Analyse, Handlungspläne, Coaching
  app.use('/metrics', metricsRoutes);  // GET /metrics/prometheus, GET /metrics/json

  const PORT = Number(process.env.PORT) || 4002;
  
  // HTTP-Server erstellen für WebSocket-Support
  const server = createServer(app);
  
  // WebSocket-Server für Echtzeit-Analyse
  const wsServer = new RealtimeAnalysisWebSocketServer(server);
  console.log('[WS] Echtzeit-Analyse WebSocket-Server initialisiert');
  
  // WebSocket-Server für Chat
  setupChatWebSocket(server);
  console.log('[WS] Chat WebSocket-Server initialisiert');
  
  server.listen(PORT, () => {
    console.log(`[BOOT] HD App Backend läuft auf http://localhost:${PORT}`);
    console.log(`[WS] WebSocket-Server läuft auf ws://localhost:${PORT}/realtime-analysis/live`);
  });
}

main().catch(err => {
  console.error('[BOOT] Fehler beim Starten:', err);
  process.exit(1);
});
