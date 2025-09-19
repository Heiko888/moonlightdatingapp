"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetMetrics = exports.getMetrics = exports.prometheusMiddleware = exports.profileDistribution = exports.channelUsage = exports.centerActivationRate = exports.hdTypeDistribution = exports.errorRate = exports.fileUploads = exports.authenticationAttempts = exports.openaiApiCalls = exports.databaseOperations = exports.socketConnections = exports.chatMessages = exports.readingsCompleted = exports.chartsGenerated = exports.totalUsers = exports.activeUsers = exports.httpRequestTotal = exports.httpRequestDuration = void 0;
const prom_client_1 = require("prom-client");
// Standard-Metriken sammeln (CPU, Memory, etc.)
(0, prom_client_1.collectDefaultMetrics)({ register: prom_client_1.register });
// Custom Metriken für HD App
exports.httpRequestDuration = new prom_client_1.Histogram({
    name: 'http_request_duration_seconds',
    help: 'Dauer von HTTP-Requests',
    labelNames: ['method', 'route', 'status_code'],
    buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10]
});
exports.httpRequestTotal = new prom_client_1.Counter({
    name: 'http_requests_total',
    help: 'Gesamtzahl der HTTP-Requests',
    labelNames: ['method', 'route', 'status_code']
});
exports.activeUsers = new prom_client_1.Gauge({
    name: 'active_users_total',
    help: 'Aktuelle Anzahl aktiver Benutzer'
});
exports.totalUsers = new prom_client_1.Gauge({
    name: 'total_users_registered',
    help: 'Gesamtzahl registrierter Benutzer'
});
exports.chartsGenerated = new prom_client_1.Counter({
    name: 'charts_generated_total',
    help: 'Gesamtzahl generierter Human Design Charts'
});
exports.readingsCompleted = new prom_client_1.Counter({
    name: 'readings_completed_total',
    help: 'Gesamtzahl abgeschlossener Readings'
});
exports.chatMessages = new prom_client_1.Counter({
    name: 'chat_messages_total',
    help: 'Gesamtzahl gesendeter Chat-Nachrichten',
    labelNames: ['chat_type']
});
exports.socketConnections = new prom_client_1.Gauge({
    name: 'socket_connections_active',
    help: 'Aktuelle Anzahl aktiver Socket-Verbindungen'
});
exports.databaseOperations = new prom_client_1.Counter({
    name: 'database_operations_total',
    help: 'Gesamtzahl Datenbankoperationen',
    labelNames: ['operation', 'collection']
});
exports.openaiApiCalls = new prom_client_1.Counter({
    name: 'openai_api_calls_total',
    help: 'Gesamtzahl OpenAI API-Aufrufe',
    labelNames: ['endpoint', 'status']
});
exports.authenticationAttempts = new prom_client_1.Counter({
    name: 'authentication_attempts_total',
    help: 'Gesamtzahl Authentifizierungsversuche',
    labelNames: ['method', 'success']
});
exports.fileUploads = new prom_client_1.Counter({
    name: 'file_uploads_total',
    help: 'Gesamtzahl Datei-Uploads',
    labelNames: ['file_type', 'size_category']
});
exports.errorRate = new prom_client_1.Counter({
    name: 'errors_total',
    help: 'Gesamtzahl aufgetretener Fehler',
    labelNames: ['type', 'route']
});
// Business-spezifische Metriken für Human Design
exports.hdTypeDistribution = new prom_client_1.Gauge({
    name: 'hd_type_distribution',
    help: 'Verteilung der Human Design Typen',
    labelNames: ['hd_type']
});
exports.centerActivationRate = new prom_client_1.Counter({
    name: 'center_activations_total',
    help: 'Gesamtzahl Center-Aktivierungen',
    labelNames: ['center_name']
});
exports.channelUsage = new prom_client_1.Counter({
    name: 'channel_usage_total',
    help: 'Nutzung von Human Design Channels',
    labelNames: ['channel_name']
});
exports.profileDistribution = new prom_client_1.Gauge({
    name: 'profile_distribution',
    help: 'Verteilung der Human Design Profile',
    labelNames: ['profile_type']
});
// Middleware für automatische Request-Metriken
const prometheusMiddleware = (req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = (Date.now() - start) / 1000;
        const route = req.route?.path || req.path || 'unknown';
        exports.httpRequestDuration
            .labels(req.method, route, res.statusCode.toString())
            .observe(duration);
        exports.httpRequestTotal
            .labels(req.method, route, res.statusCode.toString())
            .inc();
    });
    next();
};
exports.prometheusMiddleware = prometheusMiddleware;
// Funktion zum Exportieren der Metriken
const getMetrics = async () => {
    return await prom_client_1.register.metrics();
};
exports.getMetrics = getMetrics;
// Funktion zum Zurücksetzen der Metriken (nur für Tests)
const resetMetrics = () => {
    prom_client_1.register.clear();
};
exports.resetMetrics = resetMetrics;
exports.default = prom_client_1.register;
