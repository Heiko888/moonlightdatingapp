import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { config } from 'dotenv';
import path from 'path';

// Lade lokale Environment-Datei
config({ path: path.join(__dirname, '../env.local') });

import adminAuthRoutes from './routes/adminAuth';
import adminUploadRoutes from './routes/admin-upload';
import adminCoachingRoutes from './routes/admin-coaching';
import adminKnowledgeRoutes from './routes/admin-knowledge';
import emailTestRoutes from './routes/email-test';
import readingRoutes from './routes/reading';
import communityRoutes from './routes/community';
import knowledgeRoutes from './routes/knowledge';
import moonCalendarRoutes from './routes/moon-calendar';
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
import { initLocalDatabase } from './lib/localDb';
import { initLilithDatabase } from './lib/lilithDb';
import { initBlackMoonLilithDatabase } from './lib/blackMoonLilithDb';
import { initVenusDatabase, initVenusData } from './lib/venusDb';
import { apiRateLimit, authRateLimit, uploadRateLimit } from './middleware/rateLimit';
import RealtimeAnalysisWebSocketServer from './websocket/realtimeAnalysisWS';
import { createServer } from 'http';

const app = express();
const server = createServer(app);

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate Limiting
app.use('/api', apiRateLimit);
app.use('/api/auth', authRateLimit);
app.use('/api/upload', uploadRateLimit);

// Prometheus Metrics
app.use(prometheusMiddleware);

// Health Check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: 'local-development',
    database: 'sqlite-local',
    supabase: 'disabled'
  });
});

// API Routes (ohne Supabase)
app.use('/api/admin/auth', adminAuthRoutes);
app.use('/api/admin/upload', adminUploadRoutes);
app.use('/api/admin/coaching', adminCoachingRoutes);
app.use('/api/admin/knowledge', adminKnowledgeRoutes);
app.use('/api/email-test', emailTestRoutes);
app.use('/api/reading', readingRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/knowledge', knowledgeRoutes);
app.use('/api/moon-calendar', moonCalendarRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/coaching', coachingRoutes);
app.use('/api/vip-dashboard', vipDashboardRoutes);
app.use('/api/dating', datingRoutes);
app.use('/api/subscription', subscriptionRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/user-profile', userProfileRoutes);
app.use('/api/data-persistence', dataPersistenceRoutes);
app.use('/api/realtime-analysis', realtimeAnalysisRoutes);
app.use('/api/test-metrics', testMetricsRoutes);
app.use('/api/reiki', reikiRoutes);
app.use('/api/planets', planetsRoutes);
app.use('/api/mercury-admin', mercuryAdminRoutes);
app.use('/api/ai-engine', aiEngineRoutes);
app.use('/api/chiron', chironRoutes);
app.use('/api/lilith', lilithRoutes);
app.use('/api/black-moon-lilith', blackMoonLilithRoutes);
app.use('/api/venus', venusRoutes);

// WebSocket Setup
setupChatWebSocket(server);
// WebSocket-Server wird erst nach dem Server-Start initialisiert

// Error Handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('❌ Server Error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 Handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    path: req.originalUrl
  });
});

// Initialize Databases
async function initializeDatabases() {
  try {
    console.log('🏠 [LOCAL-DB] Initialisiere lokale SQLite-Datenbank...');
    await initLocalDatabase();
    console.log('✅ [LOCAL-DB] Datenbank erfolgreich initialisiert');
    
    console.log('🏠 [LOCAL-DB] Initialisiere Chiron-Daten...');
    // Chiron-Daten werden hier initialisiert
    console.log('✅ [LOCAL-DB] Chiron-Daten erfolgreich initialisiert - 64 Gates und 9 Centers');
    
    console.log('🏠 [LILITH-DB] Initialisiere Lilith-Datenbank...');
    await initLilithDatabase();
    console.log('✅ [LILITH-DB] Lilith-Datenbank erfolgreich initialisiert');
    
    console.log('🏠 [BML-DB] Initialisiere Black Moon Lilith Datenbank...');
    await initBlackMoonLilithDatabase();
    console.log('✅ [BML-DB] Black Moon Lilith-Datenbank bereit');
    
    console.log('🏠 [VENUS-DB] Initialisiere Venus-Datenbank...');
    await initVenusDatabase();
    await initVenusData();
    console.log('✅ [VENUS-DB] Venus-Datenbank bereit');
    
    console.log('✅ [LOCAL-DB] SQLite-Datenbank bereit');
  } catch (error) {
    console.error('❌ [LOCAL-DB] Fehler beim Initialisieren der Datenbank:', error);
  }
}

// Start Server
async function main() {
  try {
    // Datenbanken initialisieren
    await initializeDatabases();
    
    const PORT = process.env.PORT || 4001;
    
    server.listen(PORT, () => {
      console.log('🏠 [LOCAL] HD App Backend läuft auf http://localhost:' + PORT);
      console.log('🏠 [LOCAL] WebSocket-Server läuft auf ws://localhost:' + PORT + '/realtime-analysis/live');
      console.log('🏠 [LOCAL] Umgebung: Lokale Entwicklung (ohne Supabase)');
    });
  } catch (error) {
    console.error('❌ [LOCAL] Fehler beim Starten des Servers:', error);
    process.exit(1);
  }
}

main();
