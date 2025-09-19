import { Router } from 'express';
import emailService from '../services/emailService';
import { getWelcomeEmailTemplate, getWelcomeEmailSubject } from '../templates/welcomeEmail';

const router = Router();

// POST /email/test - Test-E-Mail senden
router.post('/test', async (req, res) => {
  try {
    const { email, name, username } = req.body;

    if (!email || !name || !username) {
      return res.status(400).json({ 
        error: 'E-Mail, Name und Benutzername sind erforderlich' 
      });
    }

    console.log('📧 Test-E-Mail wird gesendet...');

    // Willkommens-E-Mail senden
    await emailService.sendWelcomeEmail({
      email,
      name,
      username
    });

    // Transaktions-E-Mail senden
    const emailHtml = getWelcomeEmailTemplate({ email, name, username });
    const emailSubject = getWelcomeEmailSubject(name);
    
    await emailService.sendTransactionalEmail(email, emailSubject, emailHtml);

    console.log('✅ Test-E-Mail erfolgreich gesendet an:', email);

    res.json({
      success: true,
      message: 'Test-E-Mail erfolgreich gesendet',
      recipient: email
    });

  } catch (error) {
    console.error('❌ Fehler beim Senden der Test-E-Mail:', error);
    res.status(500).json({
      success: false,
      error: 'Fehler beim Senden der Test-E-Mail',
      details: error instanceof Error ? error.message : 'Unbekannter Fehler'
    });
  }
});

// GET /email/status - E-Mail-Konfiguration prüfen
router.get('/status', (req, res) => {
  const config = {
    provider: process.env.EMAIL_PROVIDER || 'nicht konfiguriert',
    hasApiKey: !!process.env.EMAIL_API_KEY,
    mailchimpListId: process.env.MAILCHIMP_LIST_ID || 'nicht konfiguriert',
    hubspotPortalId: process.env.HUBSPOT_PORTAL_ID || 'nicht konfiguriert',
    fromEmail: process.env.FROM_EMAIL || 'nicht konfiguriert',
    frontendUrl: process.env.FRONTEND_URL || 'nicht konfiguriert'
  };

  res.json({
    success: true,
    config,
    status: config.hasApiKey ? 'konfiguriert' : 'nicht konfiguriert'
  });
});

export default router;
