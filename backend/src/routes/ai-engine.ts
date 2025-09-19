import express from 'express';
import { authenticateToken } from '../middleware/auth';
import advancedAIReadingEngine from '../services/advancedAIReadingEngine';
import reflectionAnalysisEngine from '../services/reflectionAnalysisEngine';
import adaptiveActionEngine from '../services/adaptiveActionEngine';
import realTimeCoachingEngine from '../services/realTimeCoachingEngine';
import predictiveAnalyticsEngine from '../services/predictiveAnalyticsEngine';

const router = express.Router();

/**
 * POST /ai-engine/advanced-reading
 * Generiert erweiterte Readings mit Validierung
 */
router.post('/advanced-reading', authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Nicht authentifiziert' });
    }

    const { 
      readingType = 'personal', 
      context, 
      userProfile 
    } = req.body;

    if (!userProfile) {
      return res.status(400).json({ error: 'userProfile ist erforderlich' });
    }

    console.log(`🧠 Erweiterte Reading-Generierung für Benutzer ${userId}...`);

    const advancedReading = await advancedAIReadingEngine.generateAdvancedReading(
      userProfile,
      readingType,
      context
    );

    res.json({
      success: true,
      reading: advancedReading,
      metadata: {
        generatedAt: new Date(),
        engine: 'advanced-ai-reading',
        version: '1.0.0'
      }
    });

  } catch (error) {
    console.error('❌ Fehler bei der erweiterten Reading-Generierung:', error);
    res.status(500).json({ 
      error: 'Fehler bei der Reading-Generierung',
      details: error instanceof Error ? error.message : 'Unbekannter Fehler'
    });
  }
});

/**
 * POST /ai-engine/reflection-analysis
 * Analysiert Reflektionen und erkennt Muster
 */
router.post('/reflection-analysis', authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Nicht authentifiziert' });
    }

    const { reflections } = req.body;

    if (!reflections || !Array.isArray(reflections)) {
      return res.status(400).json({ error: 'reflections Array ist erforderlich' });
    }

    console.log(`🔍 Reflektions-Analyse für Benutzer ${userId}...`);

    const insights = await reflectionAnalysisEngine.analyzeReflections(userId, reflections);

    res.json({
      success: true,
      insights,
      metadata: {
        analyzedAt: new Date(),
        reflectionCount: reflections.length,
        engine: 'reflection-analysis',
        version: '1.0.0'
      }
    });

  } catch (error) {
    console.error('❌ Fehler bei der Reflektions-Analyse:', error);
    res.status(500).json({ 
      error: 'Fehler bei der Reflektions-Analyse',
      details: error instanceof Error ? error.message : 'Unbekannter Fehler'
    });
  }
});

/**
 * POST /ai-engine/action-plan
 * Generiert adaptive Handlungspläne
 */
router.post('/action-plan', authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Nicht authentifiziert' });
    }

    const { 
      userProfile, 
      context, 
      focusArea 
    } = req.body;

    if (!userProfile) {
      return res.status(400).json({ error: 'userProfile ist erforderlich' });
    }

    console.log(`🎯 Handlungsplan-Generierung für Benutzer ${userId}...`);

    const actionPlan = await adaptiveActionEngine.generateActionPlan(
      userProfile,
      context,
      focusArea
    );

    res.json({
      success: true,
      actionPlan,
      metadata: {
        generatedAt: new Date(),
        engine: 'adaptive-action',
        version: '1.0.0'
      }
    });

  } catch (error) {
    console.error('❌ Fehler bei der Handlungsplan-Generierung:', error);
    res.status(500).json({ 
      error: 'Fehler bei der Handlungsplan-Generierung',
      details: error instanceof Error ? error.message : 'Unbekannter Fehler'
    });
  }
});

/**
 * POST /ai-engine/real-time-coaching
 * Echtzeit-Coaching
 */
router.post('/real-time-coaching', authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Nicht authentifiziert' });
    }

    const { 
      userProfile, 
      context, 
      userMessage 
    } = req.body;

    if (!userProfile) {
      return res.status(400).json({ error: 'userProfile ist erforderlich' });
    }

    console.log(`🤖 Echtzeit-Coaching für Benutzer ${userId}...`);

    const coachingResponse = await realTimeCoachingEngine.provideRealTimeGuidance(
      userProfile,
      context,
      userMessage
    );

    res.json({
      success: true,
      coaching: coachingResponse,
      metadata: {
        generatedAt: new Date(),
        engine: 'real-time-coaching',
        version: '1.0.0'
      }
    });

  } catch (error) {
    console.error('❌ Fehler beim Echtzeit-Coaching:', error);
    res.status(500).json({ 
      error: 'Fehler beim Echtzeit-Coaching',
      details: error instanceof Error ? error.message : 'Unbekannter Fehler'
    });
  }
});

/**
 * POST /ai-engine/predictive-analytics
 * Predictive Analytics für Lebensphasen
 */
router.post('/predictive-analytics', authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Nicht authentifiziert' });
    }

    const { userProfile } = req.body;

    if (!userProfile) {
      return res.status(400).json({ error: 'userProfile ist erforderlich' });
    }

    console.log(`🔮 Predictive Analytics für Benutzer ${userId}...`);

    const analysis = await predictiveAnalyticsEngine.analyzeLifePhases(userProfile);

    res.json({
      success: true,
      analysis,
      metadata: {
        generatedAt: new Date(),
        engine: 'predictive-analytics',
        version: '1.0.0'
      }
    });

  } catch (error) {
    console.error('❌ Fehler bei der Predictive Analytics:', error);
    res.status(500).json({ 
      error: 'Fehler bei der Predictive Analytics',
      details: error instanceof Error ? error.message : 'Unbekannter Fehler'
    });
  }
});

/**
 * POST /ai-engine/specific-recommendations
 * Spezifische Handlungsempfehlungen
 */
router.post('/specific-recommendations', authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Nicht authentifiziert' });
    }

    const { 
      userProfile, 
      context, 
      situation 
    } = req.body;

    if (!userProfile || !situation) {
      return res.status(400).json({ error: 'userProfile und situation sind erforderlich' });
    }

    console.log(`💡 Spezifische Empfehlungen für Benutzer ${userId}...`);

    const recommendations = await adaptiveActionEngine.generateSpecificRecommendations(
      userProfile,
      context,
      situation
    );

    res.json({
      success: true,
      recommendations,
      metadata: {
        generatedAt: new Date(),
        engine: 'adaptive-action',
        version: '1.0.0'
      }
    });

  } catch (error) {
    console.error('❌ Fehler bei der Empfehlungs-Generierung:', error);
    res.status(500).json({ 
      error: 'Fehler bei der Empfehlungs-Generierung',
      details: error instanceof Error ? error.message : 'Unbekannter Fehler'
    });
  }
});

/**
 * POST /ai-engine/proactive-coaching
 * Proaktives Coaching
 */
router.post('/proactive-coaching', authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Nicht authentifiziert' });
    }

    const { userProfile, context } = req.body;

    if (!userProfile) {
      return res.status(400).json({ error: 'userProfile ist erforderlich' });
    }

    console.log(`🚀 Proaktives Coaching für Benutzer ${userId}...`);

    const coachingResponse = await realTimeCoachingEngine.generateProactiveCoaching(
      userProfile,
      context
    );

    res.json({
      success: true,
      coaching: coachingResponse,
      metadata: {
        generatedAt: new Date(),
        engine: 'real-time-coaching',
        version: '1.0.0'
      }
    });

  } catch (error) {
    console.error('❌ Fehler beim proaktiven Coaching:', error);
    res.status(500).json({ 
      error: 'Fehler beim proaktiven Coaching',
      details: error instanceof Error ? error.message : 'Unbekannter Fehler'
    });
  }
});

/**
 * GET /ai-engine/coaching-history/:userId
 * Holt Coaching-Historie
 */
router.get('/coaching-history/:userId', authenticateToken, async (req, res) => {
  try {
    const userId = req.params.userId;
    const requestingUserId = req.user?.id;

    if (requestingUserId !== userId) {
      return res.status(403).json({ error: 'Keine Berechtigung' });
    }

    const history = realTimeCoachingEngine.getCoachingHistory(userId);

    res.json({
      success: true,
      history,
      metadata: {
        retrievedAt: new Date(),
        count: history.length
      }
    });

  } catch (error) {
    console.error('❌ Fehler beim Abrufen der Coaching-Historie:', error);
    res.status(500).json({ 
      error: 'Fehler beim Abrufen der Coaching-Historie',
      details: error instanceof Error ? error.message : 'Unbekannter Fehler'
    });
  }
});

/**
 * POST /ai-engine/evaluate-action
 * Bewertet den Erfolg von Aktionen
 */
router.post('/evaluate-action', authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Nicht authentifiziert' });
    }

    const { action, outcome, userFeedback } = req.body;

    if (!action || !outcome || userFeedback === undefined) {
      return res.status(400).json({ 
        error: 'action, outcome und userFeedback sind erforderlich' 
      });
    }

    console.log(`📊 Aktions-Bewertung für Benutzer ${userId}...`);

    const evaluation = await adaptiveActionEngine.evaluateActionSuccess(
      action,
      outcome,
      userFeedback
    );

    res.json({
      success: true,
      evaluation,
      metadata: {
        evaluatedAt: new Date(),
        engine: 'adaptive-action',
        version: '1.0.0'
      }
    });

  } catch (error) {
    console.error('❌ Fehler bei der Aktions-Bewertung:', error);
    res.status(500).json({ 
      error: 'Fehler bei der Aktions-Bewertung',
      details: error instanceof Error ? error.message : 'Unbekannter Fehler'
    });
  }
});

/**
 * GET /ai-engine/coaching-effectiveness/:userId
 * Analysiert Coaching-Effektivität
 */
router.get('/coaching-effectiveness/:userId', authenticateToken, async (req, res) => {
  try {
    const userId = req.params.userId;
    const requestingUserId = req.user?.id;

    if (requestingUserId !== userId) {
      return res.status(403).json({ error: 'Keine Berechtigung' });
    }

    const effectiveness = await realTimeCoachingEngine.analyzeCoachingEffectiveness(userId);

    res.json({
      success: true,
      effectiveness,
      metadata: {
        analyzedAt: new Date(),
        engine: 'real-time-coaching',
        version: '1.0.0'
      }
    });

  } catch (error) {
    console.error('❌ Fehler bei der Effektivitäts-Analyse:', error);
    res.status(500).json({ 
      error: 'Fehler bei der Effektivitäts-Analyse',
      details: error instanceof Error ? error.message : 'Unbekannter Fehler'
    });
  }
});

/**
 * GET /ai-engine/status
 * Status der AI-Engine
 */
router.get('/status', (req, res) => {
  res.json({
    success: true,
    status: 'operational',
    engines: {
      'advanced-reading': 'active',
      'reflection-analysis': 'active',
      'adaptive-action': 'active',
      'real-time-coaching': 'active',
      'predictive-analytics': 'active'
    },
    version: '1.0.0',
    timestamp: new Date()
  });
});

export default router;
