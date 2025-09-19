import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { UserSubscription } from '../../types/subscription';

const router = Router();

// Pfad zur Abonnement-Datenbank
const subscriptionDbPath = path.join(__dirname, '../../data/subscriptions.json');

// Abonnement-Datenbank initialisieren
function initSubscriptionDb() {
  const dir = path.dirname(subscriptionDbPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  if (!fs.existsSync(subscriptionDbPath)) {
    // Demo-Abonnements erstellen
    const demoSubscriptions = [
      {
        id: '1',
        userId: '1', // test@hdapp.com
        packageId: 'basic',
        status: 'active',
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 Tage
        autoRenew: true,
        paymentMethod: 'credit_card',
        billingCycle: 'monthly',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
    
    fs.writeFileSync(subscriptionDbPath, JSON.stringify(demoSubscriptions, null, 2));
    console.log('✅ Demo-Abonnements erstellt');
  }
}

// Abonnement-Datenbank laden
function loadSubscriptions() {
  try {
    if (!fs.existsSync(subscriptionDbPath)) {
      initSubscriptionDb();
    }
    const data = fs.readFileSync(subscriptionDbPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Fehler beim Laden der Abonnement-Datenbank:', error);
    return [];
  }
}

// Abonnement-Datenbank speichern
function saveSubscriptions(subscriptions: any[]) {
  try {
    fs.writeFileSync(subscriptionDbPath, JSON.stringify(subscriptions, null, 2));
  } catch (error) {
    console.error('Fehler beim Speichern der Abonnement-Datenbank:', error);
  }
}

// GET /subscription/user/:userId - Benutzer-Abonnement abrufen
router.get('/user/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const subscriptions = loadSubscriptions();
    const subscription = subscriptions.find((sub: any) => sub.userId === userId);
    
    if (!subscription) {
      // Erstelle Standard-Basic-Abonnement für neuen Benutzer
      const newSubscription = {
        id: uuidv4(),
        userId,
        packageId: 'basic',
        status: 'active',
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        autoRenew: true,
        paymentMethod: 'credit_card',
        billingCycle: 'monthly',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      subscriptions.push(newSubscription);
      saveSubscriptions(subscriptions);
      
      return res.json(newSubscription);
    }
    
    res.json(subscription);
  } catch (error) {
    console.error('[subscription/user] Error:', error);
    res.status(500).json({ error: 'Fehler beim Laden des Abonnements' });
  }
});

// PUT /subscription/user/:userId - Abonnement aktualisieren
router.put('/user/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const { packageId, billingCycle, autoRenew = true } = req.body;
    
    if (!packageId) {
      return res.status(400).json({ error: 'Paket-ID ist erforderlich' });
    }
    
    const subscriptions = loadSubscriptions();
    const subscriptionIndex = subscriptions.findIndex((sub: any) => sub.userId === userId);
    
    const now = new Date();
    const endDate = new Date();
    
    // Berechne Enddatum basierend auf Billing Cycle
    if (billingCycle === 'yearly') {
      endDate.setFullYear(endDate.getFullYear() + 1);
    } else {
      endDate.setMonth(endDate.getMonth() + 1);
    }
    
    const updatedSubscription = {
      id: subscriptionIndex >= 0 ? subscriptions[subscriptionIndex].id : uuidv4(),
      userId,
      packageId,
      status: 'active',
      startDate: subscriptionIndex >= 0 ? subscriptions[subscriptionIndex].startDate : now.toISOString(),
      endDate: endDate.toISOString(),
      autoRenew,
      paymentMethod: 'credit_card',
      billingCycle: billingCycle || 'monthly',
      createdAt: subscriptionIndex >= 0 ? subscriptions[subscriptionIndex].createdAt : now.toISOString(),
      updatedAt: now.toISOString()
    };
    
    if (subscriptionIndex >= 0) {
      subscriptions[subscriptionIndex] = updatedSubscription;
    } else {
      subscriptions.push(updatedSubscription);
    }
    
    saveSubscriptions(subscriptions);
    
    console.log(`✅ Abonnement aktualisiert für Benutzer ${userId}: ${packageId}`);
    res.json(updatedSubscription);
  } catch (error) {
    console.error('[subscription/update] Error:', error);
    res.status(500).json({ error: 'Fehler beim Aktualisieren des Abonnements' });
  }
});

// POST /subscription/user/:userId/cancel - Abonnement kündigen
router.post('/user/:userId/cancel', (req, res) => {
  try {
    const { userId } = req.params;
    const subscriptions = loadSubscriptions();
    const subscriptionIndex = subscriptions.findIndex((sub: any) => sub.userId === userId);
    
    if (subscriptionIndex === -1) {
      return res.status(404).json({ error: 'Abonnement nicht gefunden' });
    }
    
    subscriptions[subscriptionIndex].status = 'cancelled';
    subscriptions[subscriptionIndex].autoRenew = false;
    subscriptions[subscriptionIndex].updatedAt = new Date().toISOString();
    
    saveSubscriptions(subscriptions);
    
    console.log(`✅ Abonnement gekündigt für Benutzer ${userId}`);
    res.json({ message: 'Abonnement erfolgreich gekündigt' });
  } catch (error) {
    console.error('[subscription/cancel] Error:', error);
    res.status(500).json({ error: 'Fehler beim Kündigen des Abonnements' });
  }
});

// PUT /subscription/user/:userId/payment - Zahlungsmethode aktualisieren
router.put('/user/:userId/payment', (req, res) => {
  try {
    const { userId } = req.params;
    const { paymentMethod } = req.body;
    
    const subscriptions = loadSubscriptions();
    const subscriptionIndex = subscriptions.findIndex((sub: any) => sub.userId === userId);
    
    if (subscriptionIndex === -1) {
      return res.status(404).json({ error: 'Abonnement nicht gefunden' });
    }
    
    subscriptions[subscriptionIndex].paymentMethod = paymentMethod;
    subscriptions[subscriptionIndex].updatedAt = new Date().toISOString();
    
    saveSubscriptions(subscriptions);
    
    res.json({ message: 'Zahlungsmethode erfolgreich aktualisiert' });
  } catch (error) {
    console.error('[subscription/payment] Error:', error);
    res.status(500).json({ error: 'Fehler beim Aktualisieren der Zahlungsmethode' });
  }
});

// GET /subscription/status/:userId - Abonnement-Status prüfen
router.get('/status/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const subscriptions = loadSubscriptions();
    const subscription = subscriptions.find((sub: any) => sub.userId === userId);
    
    if (!subscription) {
      return res.json({
        isActive: false,
        daysRemaining: 0,
        needsRenewal: false,
        packageId: 'basic'
      });
    }
    
    const endDate = new Date(subscription.endDate);
    const now = new Date();
    const daysRemaining = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    res.json({
      isActive: subscription.status === 'active' && daysRemaining > 0,
      daysRemaining: Math.max(0, daysRemaining),
      needsRenewal: daysRemaining <= 7 && subscription.autoRenew,
      packageId: subscription.packageId,
      status: subscription.status
    });
  } catch (error) {
    console.error('[subscription/status] Error:', error);
    res.status(500).json({ error: 'Fehler beim Prüfen des Abonnement-Status' });
  }
});

// GET /subscription/packages - Verfügbare Pakete abrufen
router.get('/packages', (req, res) => {
  try {
    const packages = [
      {
        id: 'basic',
        name: 'Basic',
        description: 'Perfekt für den Einstieg in Human Design',
        price: 'Kostenlos',
        priceMonthly: 0,
        priceYearly: 0,
        color: '#6b7280',
        icon: '⭐',
        features: [
          'Grundlegende Chart-Berechnung',
          'Mondkalender (7 Tage Vorschau)',
          'Community-Zugang (Basis)',
          'Basis-Matching (5 Matches/Tag)',
          'Standard-Support',
          'Mobile App Zugang'
        ],
        limitations: [
          'Begrenzte Chart-Details',
          'Keine erweiterten Analytics',
          'Keine VIP-Features',
          'Werbung in der App'
        ],
        maxCharts: 1,
        maxCoachingSessions: 0,
        maxDatingMatches: 5,
        hasAdvancedAnalytics: false,
        hasVIPCommunity: false,
        hasPersonalCoach: false,
        hasPrioritySupport: false,
        hasEarlyAccess: false
      },
      {
        id: 'premium',
        name: 'Premium',
        description: 'Erweiterte Features für tieferes Verständnis',
        price: '19,99€/Monat',
        priceMonthly: 19.99,
        priceYearly: 199.99,
        color: '#8b5cf6',
        icon: '💎',
        features: [
          'Alle Basic-Features',
          'Erweiterte Chart-Analyse',
          'Vollständiger Mondkalender',
          'Erweiterte Matching-Algorithmen',
          'Coaching-Zugang (2 Sessions/Monat)',
          'Prioritäts-Support',
          'Werbefreie Erfahrung',
          'Erweiterte Analytics',
          'Export-Funktionen'
        ],
        limitations: [
          'Keine VIP-Exklusiv-Features',
          'Begrenzte API-Zugriffe',
          'Kein persönlicher Coach'
        ],
        maxCharts: 5,
        maxCoachingSessions: 2,
        maxDatingMatches: 50,
        hasAdvancedAnalytics: true,
        hasVIPCommunity: false,
        hasPersonalCoach: false,
        hasPrioritySupport: true,
        hasEarlyAccess: false
      },
      {
        id: 'vip',
        name: 'VIP',
        description: 'Das ultimative Human Design Erlebnis',
        price: '49,99€/Monat',
        priceMonthly: 49.99,
        priceYearly: 499.99,
        color: '#f59e0b',
        icon: '👑',
        features: [
          'Alle Premium-Features',
          'Exklusive VIP-Community',
          'Persönlicher Coach (unbegrenzt)',
          'Unbegrenzte API-Zugriffe',
          'Früher Zugang zu neuen Features',
          'Premium-Analytics & Insights',
          'Exklusive Events & Workshops',
          '1:1 Beratung',
          'White-Label Optionen',
          'API-Zugang für Entwickler'
        ],
        limitations: [],
        maxCharts: -1,
        maxCoachingSessions: -1,
        maxDatingMatches: -1,
        hasAdvancedAnalytics: true,
        hasVIPCommunity: true,
        hasPersonalCoach: true,
        hasPrioritySupport: true,
        hasEarlyAccess: true
      }
    ];
    
    res.json(packages);
  } catch (error) {
    console.error('[subscription/packages] Error:', error);
    res.status(500).json({ error: 'Fehler beim Laden der Pakete' });
  }
});

// Initialisiere Abonnement-Datenbank beim Start
initSubscriptionDb();

export default router;
