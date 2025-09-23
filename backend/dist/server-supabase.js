"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
require("dotenv/config");
const auth_supabase_1 = __importDefault(require("./routes/auth-supabase"));
const adminAuth_1 = __importDefault(require("./routes/adminAuth"));
const admin_upload_1 = __importDefault(require("./routes/admin-upload"));
const admin_coaching_1 = __importDefault(require("./routes/admin-coaching"));
const admin_knowledge_1 = __importDefault(require("./routes/admin-knowledge"));
const admin_readings_1 = __importDefault(require("./routes/admin-readings"));
const email_test_1 = __importDefault(require("./routes/email-test"));
const matching_supabase_1 = __importDefault(require("./routes/matching-supabase"));
const swipe_supabase_1 = __importDefault(require("./routes/swipe-supabase"));
const metrics_supabase_1 = __importDefault(require("./routes/metrics-supabase"));
const charts_supabase_1 = __importDefault(require("./routes/charts-supabase"));
const readings_supabase_1 = __importDefault(require("./routes/readings-supabase"));
const reading_1 = __importDefault(require("./routes/reading"));
const community_1 = __importDefault(require("./routes/community"));
const knowledge_1 = __importDefault(require("./routes/knowledge"));
const moon_calendar_1 = __importDefault(require("./routes/moon-calendar"));
const astronomy_1 = __importDefault(require("./routes/astronomy"));
const chat_1 = __importStar(require("./routes/chat"));
const coaching_1 = __importDefault(require("./routes/coaching"));
const vip_dashboard_1 = __importDefault(require("./routes/vip-dashboard"));
const dating_1 = __importDefault(require("./routes/dating"));
const subscription_1 = __importDefault(require("./routes/subscription"));
const notifications_1 = __importDefault(require("./routes/notifications"));
const user_profile_1 = __importDefault(require("./routes/user-profile"));
const data_persistence_1 = __importDefault(require("./routes/data-persistence"));
const realtime_analysis_1 = __importDefault(require("./routes/realtime-analysis"));
const test_metrics_1 = __importDefault(require("./routes/test-metrics"));
const reiki_1 = __importDefault(require("./routes/reiki"));
const planets_1 = __importDefault(require("./routes/planets"));
const mercury_admin_1 = __importDefault(require("./routes/mercury-admin"));
const ai_engine_1 = __importDefault(require("./routes/ai-engine"));
const chiron_1 = __importDefault(require("./routes/chiron"));
const lilith_1 = __importDefault(require("./routes/lilith"));
const blackMoonLilith_1 = __importDefault(require("./routes/blackMoonLilith"));
const venus_1 = __importDefault(require("./routes/venus"));
const grafana_cloud_1 = require("./monitoring/grafana-cloud");
const supabase_1 = require("./lib/supabase");
const localDb_1 = require("./lib/localDb");
const lilithDb_1 = require("./lib/lilithDb");
const blackMoonLilithDb_1 = require("./lib/blackMoonLilithDb");
const venusDb_1 = require("./lib/venusDb");
const rateLimit_1 = require("./middleware/rateLimit");
const realtimeAnalysisWS_1 = __importDefault(require("./websocket/realtimeAnalysisWS"));
const http_1 = require("http");
async function main() {
    // Lokale SQLite-Datenbank initialisieren
    try {
        (0, localDb_1.initLocalDatabase)();
        console.log('[LOCAL-DB] SQLite-Datenbank bereit');
    }
    catch (error) {
        console.error('[LOCAL-DB] Fehler beim Initialisieren der lokalen Datenbank:', error);
    }
    // Lilith-Datenbank initialisieren
    try {
        (0, lilithDb_1.initLilithDatabase)();
        console.log('[LILITH-DB] Lilith-Datenbank bereit');
    }
    catch (error) {
        console.error('[LILITH-DB] Fehler beim Initialisieren der Lilith-Datenbank:', error);
    }
    // Venus-Datenbank initialisieren
    try {
        (0, venusDb_1.initVenusDatabase)();
        (0, venusDb_1.initVenusData)();
        console.log('[VENUS-DB] Venus-Datenbank bereit');
    }
    catch (error) {
        console.error('[VENUS-DB] Fehler beim Initialisieren der Venus-Datenbank:', error);
    }
    // Black Moon Lilith-Datenbank initialisieren
    try {
        (0, blackMoonLilithDb_1.initBlackMoonLilithDatabase)();
        console.log('[BML-DB] Black Moon Lilith-Datenbank bereit');
    }
    catch (error) {
        console.error('[BML-DB] Fehler beim Initialisieren der Black Moon Lilith-Datenbank:', error);
    }
    // Supabase-Verbindung testen (optional)
    try {
        const { data, error } = await supabase_1.supabase.from('knowledge_items').select('count').limit(1);
        if (error) {
            console.log('[SUPABASE] Verbindung nicht verfügbar - verwende lokale Datenbank');
        }
        else {
            console.log('[SUPABASE] Verbindung erfolgreich');
        }
    }
    catch (error) {
        console.log('[SUPABASE] Supabase nicht verfügbar - verwende lokale Datenbank');
    }
    const app = (0, express_1.default)();
    app.set('trust proxy', 1);
    app.use((0, cors_1.default)());
    app.use(express_1.default.json());
    // Rate Limiting Middleware
    app.use(rateLimit_1.apiRateLimit); // Allgemeines API-Rate-Limiting
    // Prometheus Middleware für Request-Metriken
    app.use(grafana_cloud_1.grafanaCloudMiddleware);
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
            (0, grafana_cloud_1.logToGrafana)('info', 'Metrics endpoint accessed', {
                endpoint: '/metrics',
                timestamp: new Date().toISOString()
            });
        }
        catch (error) {
            console.error('Fehler beim Abrufen der Metriken:', error);
            (0, grafana_cloud_1.logToGrafana)('error', 'Failed to retrieve metrics', {
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
        (0, grafana_cloud_1.logToGrafana)('info', 'Health check endpoint accessed', {
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
        }
        catch (error) {
            res.status(500).json({
                status: 'unhealthy',
                database: 'error',
                error: error.message,
                timestamp: new Date().toISOString()
            });
        }
    });
    app.use('/auth', auth_supabase_1.default); // POST /auth/login, POST /auth/register
    app.use('/admin', adminAuth_1.default); // POST /admin/login, POST /admin/register
    app.use('/admin', admin_upload_1.default); // POST /admin/upload, GET /admin/upload
    app.use('/admin/coaching', admin_coaching_1.default); // GET/POST /admin/coaching/coaches, GET/POST /admin/coaching/sessions
    app.use('/admin/knowledge', admin_knowledge_1.default); // GET/POST/PUT/DELETE /admin/knowledge
    app.use('/admin/readings', admin_readings_1.default); // GET/PUT/DELETE /admin/readings, Reading-Management für Admin
    app.use('/email', email_test_1.default); // POST /email/test, GET /email/status
    app.use('/matching', matching_supabase_1.default); // GET /matching/profile/:userId, POST /matching/analyze, POST /matching/like, POST /matching/message
    app.use('/swipe', swipe_supabase_1.default); // GET /swipe/profiles/:userId, POST /swipe, GET /swipe/matches/:userId
    app.use('/charts', charts_supabase_1.default); // GET/POST /charts
    app.use('/readings', readings_supabase_1.default); // GET/POST /readings
    app.use('/reading', reading_1.default); // POST /reading/generate
    app.use('/community', community_1.default); // GET/POST /community/*
    app.use('/knowledge', knowledge_1.default); // GET/POST/PUT/DELETE /knowledge/*
    app.use('/moon-calendar', moon_calendar_1.default); // GET /moon-calendar/phases/:date, GET /moon-calendar/calendar/:year/:month, GET /moon-calendar/current
    app.use('/astronomy', astronomy_1.default); // GET /astronomy/moon - Open-Meteo API für präzise Monddaten
    app.use('/chat', chat_1.default);
    app.use('/coaching', coaching_1.default);
    app.use('/vip-dashboard', vip_dashboard_1.default);
    app.use('/subscription', subscription_1.default); // GET/PUT /subscription/user/:userId, POST /subscription/user/:userId/cancel
    app.use('/dating', dating_1.default); // GET /chat/conversations/:userId, GET /chat/messages/:chatId, POST /chat/messages, POST /chat/create, PUT /chat/:chatId/read
    app.use('/notifications', notifications_1.default); // GET /notifications, GET /notifications/unread-count, POST /notifications/mark-read, POST /notifications/send, DELETE /notifications/:id
    app.use('/user-profile', user_profile_1.default); // GET /user-profile/profile/:userId, PUT /user-profile/profile/:userId, POST /user-profile/avatar, POST /user-profile/create, DELETE /user-profile/profile/:userId, GET /user-profile/search
    app.use('/data-persistence', data_persistence_1.default); // POST/GET /data-persistence/user-profile, POST/GET /data-persistence/chart, POST/GET /data-persistence/moon-tracking, POST/GET /data-persistence/journal, GET /data-persistence/dashboard
    app.use('/realtime-analysis', realtime_analysis_1.default); // POST /realtime-analysis/analyze, WebSocket /realtime-analysis/live
    app.use('/api/test-metrics', test_metrics_1.default);
    app.use('/reiki', reiki_1.default); // GET /reiki/symbols, POST /reiki/analysis, POST /reiki/session-plan, GET /reiki/benefits, POST /reiki/self-treatment, GET /reiki/meditation-guides // Test-Metriken für Grafana Cloud
    app.use('/api/planets', planets_1.default); // GET /api/planets/:planet/info, GET /api/planets/:planet/gates, GET /api/planets/:planet/centers
    app.use('/api/chiron', chiron_1.default); // GET /api/chiron/gates, GET /api/chiron/centers, GET /api/chiron/info
    app.use('/lilith', lilith_1.default); // GET /lilith/info, GET /lilith/centers, GET /lilith/gates - Lilith-Daten
    app.use('/blackmoonlilith', blackMoonLilith_1.default); // GET /blackmoonlilith/info, GET /blackmoonlilith/centers, GET /blackmoonlilith/gates - Black Moon Lilith-Daten
    app.use('/venus', venus_1.default); // GET /venus/info, GET /venus/centers, GET /venus/gates - Venus-Daten
    app.use('/api/mercury-admin', mercury_admin_1.default); // Admin-API für Mercury Gate-Bearbeitung
    app.use('/api/ai-engine', ai_engine_1.default); // AI-Engine API für erweiterte Readings, Reflektions-Analyse, Handlungspläne, Coaching
    app.use('/metrics', metrics_supabase_1.default); // GET /metrics/prometheus, GET /metrics/json
    const PORT = Number(process.env.PORT) || 4002;
    // HTTP-Server erstellen für WebSocket-Support
    const server = (0, http_1.createServer)(app);
    // WebSocket-Server für Echtzeit-Analyse
    const wsServer = new realtimeAnalysisWS_1.default(server);
    console.log('[WS] Echtzeit-Analyse WebSocket-Server initialisiert');
    // WebSocket-Server für Chat
    (0, chat_1.setupChatWebSocket)(server);
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
