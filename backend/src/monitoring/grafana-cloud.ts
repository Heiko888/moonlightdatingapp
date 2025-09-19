import { prometheusMiddleware } from './prometheus';

// Grafana Cloud Stack Configuration
const GRAFANA_CLOUD_CONFIG = {
  prometheus: {
    url: 'https://prometheus-prod-24-prod-eu-west-2.grafana.net',
    username: process.env.GRAFANA_PROMETHEUS_USERNAME || 'your-prometheus-username',
    password: process.env.GRAFANA_PROMETHEUS_PASSWORD || 'your-prometheus-password',
    remoteWriteUrl: 'https://prometheus-prod-24-prod-eu-west-2.grafana.net/api/prom/push'
  },
  loki: {
    url: 'https://logs-prod-012.grafana.net',
    username: process.env.GRAFANA_LOKI_USERNAME || 'your-loki-username',
    password: process.env.GRAFANA_LOKI_PASSWORD || 'your-loki-password',
    pushUrl: 'https://logs-prod-012.grafana.net/loki/api/v1/push'
  },
  tempo: {
    url: 'https://tempo-prod-10-prod-eu-west-2.grafana.net',
    username: process.env.GRAFANA_TEMPO_USERNAME || 'your-tempo-username',
    password: process.env.GRAFANA_TEMPO_PASSWORD || 'your-tempo-password',
    otlpEndpoint: 'https://otlp-gateway-prod-eu-west-2.grafana.net'
  }
};

// Prometheus Remote Write
export const sendMetricsToGrafana = async (metrics: string) => {
  // Skip if credentials are not configured or are placeholder values
  if (!GRAFANA_CLOUD_CONFIG.prometheus.username || 
      !GRAFANA_CLOUD_CONFIG.prometheus.password ||
      GRAFANA_CLOUD_CONFIG.prometheus.username === 'your-prometheus-username' ||
      GRAFANA_CLOUD_CONFIG.prometheus.password === 'your-prometheus-password') {
    console.log('Prometheus credentials not configured. Skipping metrics push to Grafana Cloud.');
    return;
  }

  try {
    const response = await fetch(GRAFANA_CLOUD_CONFIG.prometheus.remoteWriteUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-protobuf',
        'Content-Encoding': 'snappy',
        'Authorization': `Basic ${Buffer.from(
          `${GRAFANA_CLOUD_CONFIG.prometheus.username}:${GRAFANA_CLOUD_CONFIG.prometheus.password}`
        ).toString('base64')}`
      },
      body: metrics
    });

    if (!response.ok) {
      console.error('Failed to send metrics to Grafana Cloud:', response.statusText);
    }
  } catch (error) {
    console.error('Error sending metrics to Grafana Cloud:', error);
  }
};

// Loki Log Shipping
export const sendLogsToGrafana = async (logs: any[]) => {
  // Skip if credentials are not configured or are placeholder values
  if (!GRAFANA_CLOUD_CONFIG.loki.username || 
      !GRAFANA_CLOUD_CONFIG.loki.password ||
      GRAFANA_CLOUD_CONFIG.loki.username === 'your-loki-username' ||
      GRAFANA_CLOUD_CONFIG.loki.password === 'your-loki-password') {
    console.log('Loki credentials not configured. Skipping log push to Grafana Cloud.');
    return;
  }

  try {
    const logStream = {
      streams: [{
        stream: {
          job: 'human-design-app',
          instance: 'moonlight-app',
          environment: 'production'
        },
        values: logs.map(log => [
          (Date.now() * 1000000).toString(), // Nanoseconds timestamp
          JSON.stringify(log)
        ])
      }]
    };

    const response = await fetch(GRAFANA_CLOUD_CONFIG.loki.pushUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${Buffer.from(
          `${GRAFANA_CLOUD_CONFIG.loki.username}:${GRAFANA_CLOUD_CONFIG.loki.password}`
        ).toString('base64')}`
      },
      body: JSON.stringify(logStream)
    });

    if (!response.ok) {
      console.error('Failed to send logs to Grafana Cloud:', response.statusText);
    }
  } catch (error) {
    console.error('Error sending logs to Grafana Cloud:', error);
  }
};

// Tempo Tracing
export const sendTracesToGrafana = async (traces: any[]) => {
  try {
    const response = await fetch(GRAFANA_CLOUD_CONFIG.tempo.otlpEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-protobuf',
        'Authorization': `Basic ${Buffer.from(
          `${GRAFANA_CLOUD_CONFIG.tempo.username}:${GRAFANA_CLOUD_CONFIG.tempo.password}`
        ).toString('base64')}`
      },
      body: JSON.stringify(traces)
    });

    if (!response.ok) {
      console.error('Failed to send traces to Grafana Cloud:', response.statusText);
    }
  } catch (error) {
    console.error('Error sending traces to Grafana Cloud:', error);
  }
};

// Enhanced Prometheus Middleware with Grafana Cloud Integration
export const grafanaCloudMiddleware = (req: any, res: any, next: any) => {
  const start = Date.now();
  
  // Original prometheus middleware
  prometheusMiddleware(req, res, next);
  
  // Send metrics to Grafana Cloud
  res.on('finish', async () => {
    const duration = Date.now() - start;
    const metrics = [
      `http_requests_total{method="${req.method}",route="${req.route?.path || req.path}",status="${res.statusCode}"} 1`,
      `http_request_duration_ms{method="${req.method}",route="${req.route?.path || req.path}"} ${duration}`
    ].join('\n');
    
    await sendMetricsToGrafana(metrics);
  });
};

// Application Metrics for Human Design App
export const recordAppMetrics = {
  userRegistration: () => {
    const metric = 'hd_app_users_total 1';
    sendMetricsToGrafana(metric);
  },
  
  chartGenerated: () => {
    const metric = 'hd_app_charts_generated_total 1';
    sendMetricsToGrafana(metric);
  },
  
  matchCreated: () => {
    const metric = 'hd_app_matches_total 1';
    sendMetricsToGrafana(metric);
  },
  
  moonPhaseCalculated: () => {
    const metric = 'hd_app_moon_phases_calculated_total 1';
    sendMetricsToGrafana(metric);
  },
  
  datingImpulseGenerated: () => {
    const metric = 'hd_app_dating_impulses_generated_total 1';
    sendMetricsToGrafana(metric);
  },
  
  liveEventJoined: () => {
    const metric = 'hd_app_live_events_joined_total 1';
    sendMetricsToGrafana(metric);
  },
  
  courseCompleted: () => {
    const metric = 'hd_app_courses_completed_total 1';
    sendMetricsToGrafana(metric);
  }
};

// Logging Helper
export const logToGrafana = (level: 'info' | 'warn' | 'error', message: string, context?: any) => {
  const logEntry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    service: 'human-design-app',
    context: context || {}
  };
  
  sendLogsToGrafana([logEntry]);
  console.log(`[${level.toUpperCase()}] ${message}`, context);
};

export default {
  sendMetricsToGrafana,
  sendLogsToGrafana,
  sendTracesToGrafana,
  grafanaCloudMiddleware,
  recordAppMetrics,
  logToGrafana
};
