import express from 'express';
import { authenticateToken } from '../middleware/auth';
import ReadingService, { ReadingRequest } from '../services/readingService';

const router = express.Router();

// GET /reading/templates - Alle verfügbaren Reading-Templates abrufen
router.get('/templates', authenticateToken, async (req, res) => {
  try {
    const templates = ReadingService.getAllTemplates();
    
    res.json({
      success: true,
      templates: templates.filter(template => template.isActive)
    });

    } catch (error) {
    console.error('[reading] Get templates error:', error);
    res.status(500).json({ error: 'Fehler beim Laden der Reading-Templates' });
  }
});

// POST /reading/generate - Neues Reading generieren
router.post('/generate', authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.id;
    const { templateId, focus, customModules, context } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'Benutzer nicht authentifiziert' });
    }

    if (!templateId) {
      return res.status(400).json({ error: 'Template-ID ist erforderlich' });
    }

    const readingRequest: ReadingRequest = {
      userId,
      templateId,
      focus,
      customModules,
      context
    };

    const reading = await ReadingService.generateReading(readingRequest);
    
    res.status(201).json({
      success: true,
      reading
    });

  } catch (error) {
    console.error('[reading] Generate reading error:', error);
    res.status(500).json({ error: 'Fehler beim Generieren des Readings' });
  }
});

export default router;
