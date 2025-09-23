import { register, collectDefaultMetrics, Counter, Histogram, Gauge } from 'prom-client';

// Standard-Metriken sammeln
collectDefaultMetrics({ register });

// Custom Metriken für HD App
export const httpRequestDuration = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10]
});

export const httpRequestTotal = new Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code']
});

export const hdTypeDistribution = new Gauge({
  name: 'hd_type_distribution',
  help: 'Distribution of Human Design types',
  labelNames: ['hd_type']
});

export const profileDistribution = new Gauge({
  name: 'profile_distribution',
  help: 'Distribution of Human Design profiles',
  labelNames: ['profile_type']
});

export const activeUsers = new Gauge({
  name: 'active_users',
  help: 'Number of active users',
  labelNames: ['user_type']
});

export const chartCalculations = new Counter({
  name: 'chart_calculations_total',
  help: 'Total number of chart calculations',
  labelNames: ['chart_type', 'status']
});

export const databaseConnections = new Gauge({
  name: 'database_connections_active',
  help: 'Number of active database connections'
});

export const errorRate = new Counter({
  name: 'errors_total',
  help: 'Total number of errors',
  labelNames: ['error_type', 'severity']
});

export const promClient = {
  register,
  httpRequestDuration,
  httpRequestTotal,
  hdTypeDistribution,
  profileDistribution,
  activeUsers,
  chartCalculations,
  databaseConnections,
  errorRate
};

// Middleware für automatische Metriken-Sammlung
export function metricsMiddleware(req: any, res: any, next: any) {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    const route = req.route?.path || req.path;
    
    httpRequestDuration
      .labels(req.method, route, res.statusCode.toString())
      .observe(duration);
    
    httpRequestTotal
      .labels(req.method, route, res.statusCode.toString())
      .inc();
  });
  
  next();
}
