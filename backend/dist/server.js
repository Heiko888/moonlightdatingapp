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
const email_test_1 = __importDefault(require("./routes/email-test"));
const matching_supabase_1 = __importDefault(require("./routes/matching-supabase"));
const swipe_supabase_1 = __importDefault(require("./routes/swipe-supabase"));
const charts_supabase_1 = __importDefault(require("./routes/charts-supabase"));
const readings_supabase_1 = __importDefault(require("./routes/readings-supabase"));
const reading_1 = __importDefault(require("./routes/reading"));
const community_1 = __importDefault(require("./routes/community"));
const knowledge_1 = __importDefault(require("./routes/knowledge"));
const moon_calendar_1 = __importDefault(require("./routes/moon-calendar"));
const chat_1 = __importDefault(require("./routes/chat"));
const notifications_1 = __importDefault(require("./routes/notifications"));
const user_profile_1 = __importDefault(require("./routes/user-profile"));
const data_integration_1 = __importDefault(require("./routes/data-integration"));
const advanced_matching_1 = __importDefault(require("./routes/advanced-matching"));
const geocoding_1 = __importDefault(require("./routes/geocoding"));
const dashboard_1 = __importDefault(require("./routes/dashboard"));
const lilith_1 = __importDefault(require("./routes/lilith"));
const prometheus_1 = require("./monitoring/prometheus");
const supabase_1 = require("./lib/supabase");
const localDb_1 = require("./lib/localDb");
const lilithDb_1 = require("./lib/lilithDb");
const rateLimit_1 = require("./middleware/rateLimit");
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
    app.use(prometheus_1.prometheusMiddleware);
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
        }
        catch (error) {
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
    app.use('/email', email_test_1.default); // POST /email/test, GET /email/status
    app.use('/matching', matching_supabase_1.default); // GET /matching/profile/:userId, POST /matching/analyze, POST /matching/like, POST /matching/message
    app.use('/swipe', swipe_supabase_1.default); // GET /swipe/profiles/:userId, POST /swipe, GET /swipe/matches/:userId
    app.use('/charts', charts_supabase_1.default); // GET/POST /charts
    app.use('/readings', readings_supabase_1.default); // GET/POST /readings
    app.use('/reading', reading_1.default); // POST /reading/generate
    app.use('/community', community_1.default); // GET/POST /community/*
    app.use('/knowledge', knowledge_1.default); // GET/POST/PUT/DELETE /knowledge/*
    app.use('/moon-calendar', moon_calendar_1.default); // GET /moon-calendar/phases/:date, GET /moon-calendar/calendar/:year/:month, GET /moon-calendar/current
    app.use('/chat', chat_1.default); // GET /chat/conversations/:userId, GET /chat/messages/:chatId, POST /chat/messages, POST /chat/create, PUT /chat/:chatId/read
    app.use('/notifications', notifications_1.default); // GET /notifications, GET /notifications/unread-count, POST /notifications/mark-read, POST /notifications/send, DELETE /notifications/:id
    app.use('/user-profile', user_profile_1.default); // GET /user-profile/profile/:userId, PUT /user-profile/profile/:userId, POST /user-profile/avatar, POST /user-profile/create, DELETE /user-profile/profile/:userId, GET /user-profile/search
    app.use('/data-integration', data_integration_1.default); // GET /data-integration/dashboard/:userId, POST /data-integration/link-data, GET /data-integration/connections/:userId, POST /data-integration/sync
    app.use('/api/advanced-matching', advanced_matching_1.default); // POST /api/advanced-matching/analyze, GET /api/advanced-matching/compatible-users/:userId, POST /api/advanced-matching/batch-analyze
    app.use('/geocoding', geocoding_1.default); // POST /geocoding/lookup, POST /geocoding/batch, GET /geocoding/cache, DELETE /geocoding/cache, GET /geocoding/test
    app.use('/dashboard', dashboard_1.default); // GET /dashboard/:userId - Dashboard-Daten für Benutzer
    app.use('/lilith', lilith_1.default); // GET /lilith/info, GET /lilith/centers, GET /lilith/gates - Lilith-Daten
    // Test-Daten Routes (direkt integriert)
    app.post('/test-data/seed', async (req, res) => {
        try {
            const { seedTestData } = await Promise.resolve().then(() => __importStar(require('./scripts/seedTestData')));
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
            }
            else {
                res.status(500).json({
                    success: false,
                    error: result.error || 'Unbekannter Fehler beim Seeding'
                });
            }
        }
        catch (error) {
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
            if (!localDb_1.localDb.db) {
                return res.status(500).json({
                    success: false,
                    error: 'Datenbank nicht verfügbar'
                });
            }
            const testUsers = localDb_1.localDb.db.prepare('SELECT COUNT(*) as count FROM users WHERE email LIKE \'%@example.com\'').get();
            const totalUsers = localDb_1.localDb.db.prepare('SELECT COUNT(*) as count FROM users').get();
            const totalSwipes = localDb_1.localDb.db.prepare('SELECT COUNT(*) as count FROM swipes').get();
            const totalMatches = localDb_1.localDb.db.prepare('SELECT COUNT(*) as count FROM matches').get();
            const totalAnalyses = localDb_1.localDb.db.prepare('SELECT COUNT(*) as count FROM compatibility_analysis').get();
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
        }
        catch (error) {
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
            const { localDb } = await Promise.resolve().then(() => __importStar(require('./lib/localDb')));
            if (!localDb.db) {
                throw new Error('Datenbank nicht verfügbar');
            }
            const user = localDb.db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
            if (!user) {
                return res.status(404).json({ error: 'Benutzer nicht gefunden' });
            }
            res.json(user);
        }
        catch (error) {
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
            const { localDb } = await Promise.resolve().then(() => __importStar(require('./lib/localDb')));
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
            const updatedUser = localDb.db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
            res.json(updatedUser);
        }
        catch (error) {
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
