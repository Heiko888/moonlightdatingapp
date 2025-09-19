import { Router } from 'express';
import { recordAppMetrics, logToGrafana } from '../monitoring/grafana-cloud';

const router = Router();

// Test-Route für Metriken-Generierung
router.post('/generate-test-metrics', async (req, res) => {
  try {
    // Simuliere verschiedene App-Aktivitäten
    const activities = [
      'userRegistration',
      'chartGenerated', 
      'matchCreated',
      'moonPhaseCalculated',
      'datingImpulseGenerated',
      'liveEventJoined',
      'courseCompleted'
    ];

    const randomActivity = activities[Math.floor(Math.random() * activities.length)];
    
    // Generiere Metriken basierend auf zufälliger Aktivität
    switch (randomActivity) {
      case 'userRegistration':
        recordAppMetrics.userRegistration();
        logToGrafana('info', 'Test user registration', { 
          testRun: true,
          timestamp: new Date().toISOString()
        });
        break;
        
      case 'chartGenerated':
        recordAppMetrics.chartGenerated();
        logToGrafana('info', 'Test chart generation', { 
          testRun: true,
          chartType: 'generator',
          timestamp: new Date().toISOString()
        });
        break;
        
      case 'matchCreated':
        recordAppMetrics.matchCreated();
        logToGrafana('info', 'Test match creation', { 
          testRun: true,
          matchType: 'compatibility',
          timestamp: new Date().toISOString()
        });
        break;
        
      case 'moonPhaseCalculated':
        recordAppMetrics.moonPhaseCalculated();
        logToGrafana('info', 'Test moon phase calculation', { 
          testRun: true,
          phase: 'fullmoon',
          timestamp: new Date().toISOString()
        });
        break;
        
      case 'datingImpulseGenerated':
        recordAppMetrics.datingImpulseGenerated();
        logToGrafana('info', 'Test dating impulse generation', { 
          testRun: true,
          impulseType: 'energy',
          timestamp: new Date().toISOString()
        });
        break;
        
      case 'liveEventJoined':
        recordAppMetrics.liveEventJoined();
        logToGrafana('info', 'Test live event join', { 
          testRun: true,
          eventType: 'workshop',
          timestamp: new Date().toISOString()
        });
        break;
        
      case 'courseCompleted':
        recordAppMetrics.courseCompleted();
        logToGrafana('info', 'Test course completion', { 
          testRun: true,
          courseType: 'video',
          timestamp: new Date().toISOString()
        });
        break;
    }

    res.json({
      success: true,
      message: `Test metric generated: ${randomActivity}`,
      activity: randomActivity,
      timestamp: new Date().toISOString(),
      grafanaCloud: 'metrics sent'
    });

  } catch (error) {
    console.error('Error generating test metrics:', error);
    logToGrafana('error', 'Failed to generate test metrics', {
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
    
    res.status(500).json({
      success: false,
      error: 'Failed to generate test metrics',
      message: error.message
    });
  }
});

// Bulk Test-Metriken generieren
router.post('/generate-bulk-metrics', async (req, res) => {
  try {
    const { count = 10 } = req.body;
    const results = [];

    for (let i = 0; i < count; i++) {
      const activities = [
        'userRegistration',
        'chartGenerated', 
        'matchCreated',
        'moonPhaseCalculated',
        'datingImpulseGenerated',
        'liveEventJoined',
        'courseCompleted'
      ];

      const randomActivity = activities[Math.floor(Math.random() * activities.length)];
      
      switch (randomActivity) {
        case 'userRegistration':
          recordAppMetrics.userRegistration();
          break;
        case 'chartGenerated':
          recordAppMetrics.chartGenerated();
          break;
        case 'matchCreated':
          recordAppMetrics.matchCreated();
          break;
        case 'moonPhaseCalculated':
          recordAppMetrics.moonPhaseCalculated();
          break;
        case 'datingImpulseGenerated':
          recordAppMetrics.datingImpulseGenerated();
          break;
        case 'liveEventJoined':
          recordAppMetrics.liveEventJoined();
          break;
        case 'courseCompleted':
          recordAppMetrics.courseCompleted();
          break;
      }

      results.push({
        index: i + 1,
        activity: randomActivity,
        timestamp: new Date().toISOString()
      });

      // Kleine Verzögerung zwischen Metriken
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    logToGrafana('info', 'Bulk test metrics generated', {
      count,
      testRun: true,
      timestamp: new Date().toISOString()
    });

    res.json({
      success: true,
      message: `Generated ${count} test metrics`,
      count,
      results,
      timestamp: new Date().toISOString(),
      grafanaCloud: 'bulk metrics sent'
    });

  } catch (error) {
    console.error('Error generating bulk test metrics:', error);
    logToGrafana('error', 'Failed to generate bulk test metrics', {
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
    
    res.status(500).json({
      success: false,
      error: 'Failed to generate bulk test metrics',
      message: error.message
    });
  }
});

// Test-Logs generieren
router.post('/generate-test-logs', async (req, res) => {
  try {
    const logLevels = ['info', 'warn', 'error'];
    const logMessages = [
      'User logged in successfully',
      'Chart generation completed',
      'Match compatibility calculated',
      'Moon phase updated',
      'Dating impulse generated',
      'Live event started',
      'Course progress updated',
      'Database connection established',
      'API rate limit reached',
      'Authentication failed'
    ];

    const randomLevel = logLevels[Math.floor(Math.random() * logLevels.length)];
    const randomMessage = logMessages[Math.floor(Math.random() * logMessages.length)];

    logToGrafana(randomLevel, `Test: ${randomMessage}`, {
      testRun: true,
      level: randomLevel,
      message: randomMessage,
      timestamp: new Date().toISOString(),
      context: {
        userId: 'test-user-123',
        sessionId: 'test-session-456',
        requestId: 'test-request-789'
      }
    });

    res.json({
      success: true,
      message: 'Test log generated',
      logLevel: randomLevel,
      logMessage: randomMessage,
      timestamp: new Date().toISOString(),
      grafanaCloud: 'log sent to Loki'
    });

  } catch (error) {
    console.error('Error generating test log:', error);
    
    res.status(500).json({
      success: false,
      error: 'Failed to generate test log',
      message: error.message
    });
  }
});

// Grafana Cloud Status prüfen
router.get('/status', async (req, res) => {
  try {
    const status = {
      grafanaCloud: {
        prometheus: {
          url: process.env.GRAFANA_PROMETHEUS_USERNAME ? 'configured' : 'not configured',
          username: process.env.GRAFANA_PROMETHEUS_USERNAME ? 'set' : 'not set'
        },
        loki: {
          url: process.env.GRAFANA_LOKI_USERNAME ? 'configured' : 'not configured',
          username: process.env.GRAFANA_LOKI_USERNAME ? 'set' : 'not set'
        },
        tempo: {
          url: process.env.GRAFANA_TEMPO_USERNAME ? 'configured' : 'not configured',
          username: process.env.GRAFANA_TEMPO_USERNAME ? 'set' : 'not set'
        }
      },
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    };

    logToGrafana('info', 'Grafana Cloud status checked', {
      status,
      timestamp: new Date().toISOString()
    });

    res.json(status);

  } catch (error) {
    console.error('Error checking Grafana Cloud status:', error);
    
    res.status(500).json({
      success: false,
      error: 'Failed to check Grafana Cloud status',
      message: error.message
    });
  }
});

export default router;
