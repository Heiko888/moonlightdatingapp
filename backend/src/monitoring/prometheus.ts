import { register, collectDefaultMetrics, Counter, Histogram, Gauge } from 'prom-client';

// Standard-Metriken sammeln (CPU, Memory, etc.)
collectDefaultMetrics({ register });

// Custom Metriken für HD App
export const httpRequestDuration = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'Dauer von HTTP-Requests',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10]
});

export const httpRequestTotal = new Counter({
  name: 'http_requests_total',
  help: 'Gesamtzahl der HTTP-Requests',
  labelNames: ['method', 'route', 'status_code']
});

export const activeUsers = new Gauge({
  name: 'active_users_total',
  help: 'Aktuelle Anzahl aktiver Benutzer'
});

export const totalUsers = new Gauge({
  name: 'total_users_registered',
  help: 'Gesamtzahl registrierter Benutzer'
});

export const chartsGenerated = new Counter({
  name: 'charts_generated_total',
  help: 'Gesamtzahl generierter Human Design Charts'
});

export const readingsCompleted = new Counter({
  name: 'readings_completed_total',
  help: 'Gesamtzahl abgeschlossener Readings'
});

export const chatMessages = new Counter({
  name: 'chat_messages_total',
  help: 'Gesamtzahl gesendeter Chat-Nachrichten',
  labelNames: ['chat_type']
});

export const socketConnections = new Gauge({
  name: 'socket_connections_active',
  help: 'Aktuelle Anzahl aktiver Socket-Verbindungen'
});

export const databaseOperations = new Counter({
  name: 'database_operations_total',
  help: 'Gesamtzahl Datenbankoperationen',
  labelNames: ['operation', 'collection']
});

export const openaiApiCalls = new Counter({
  name: 'openai_api_calls_total',
  help: 'Gesamtzahl OpenAI API-Aufrufe',
  labelNames: ['endpoint', 'status']
});

export const authenticationAttempts = new Counter({
  name: 'authentication_attempts_total',
  help: 'Gesamtzahl Authentifizierungsversuche',
  labelNames: ['method', 'success']
});

export const fileUploads = new Counter({
  name: 'file_uploads_total',
  help: 'Gesamtzahl Datei-Uploads',
  labelNames: ['file_type', 'size_category']
});

export const errorRate = new Counter({
  name: 'errors_total',
  help: 'Gesamtzahl aufgetretener Fehler',
  labelNames: ['type', 'route']
});

// Business-spezifische Metriken für Human Design
export const hdTypeDistribution = new Gauge({
  name: 'hd_type_distribution',
  help: 'Verteilung der Human Design Typen',
  labelNames: ['hd_type']
});

export const centerActivationRate = new Counter({
  name: 'center_activations_total',
  help: 'Gesamtzahl Center-Aktivierungen',
  labelNames: ['center_name']
});

export const channelUsage = new Counter({
  name: 'channel_usage_total',
  help: 'Nutzung von Human Design Channels',
  labelNames: ['channel_name']
});

export const profileDistribution = new Gauge({
  name: 'profile_distribution',
  help: 'Verteilung der Human Design Profile',
  labelNames: ['profile_type']
});

// Middleware für automatische Request-Metriken
export const prometheusMiddleware = (req: any, res: any, next: any) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    const route = req.route?.path || req.path || 'unknown';
    
    httpRequestDuration
      .labels(req.method, route, res.statusCode.toString())
      .observe(duration);
    
    httpRequestTotal
      .labels(req.method, route, res.statusCode.toString())
      .inc();
  });
  
  next();
};

// Funktion zum Exportieren der Metriken
export const getMetrics = async () => {
  return await register.metrics();
};

// Funktion zum Zurücksetzen der Metriken (nur für Tests)
export const resetMetrics = () => {
  register.clear();
};

export default register;
