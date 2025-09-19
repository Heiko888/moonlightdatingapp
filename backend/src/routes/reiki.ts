import express from 'express';
import { authenticateToken } from '../middleware/auth';
import OpenAI from 'openai';

const router = express.Router();

// OpenAI Client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

// Reiki-Symbole und ihre Bedeutungen
const reikiSymbols = {
  'cho_ku_rei': {
    name: 'Cho Ku Rei',
    meaning: 'Das Kraft-Symbol - verstärkt die Reiki-Energie',
    usage: 'Für Schutz, Reinigung und Energieverstärkung',
    mantra: 'Cho Ku Rei'
  },
  'sei_he_ki': {
    name: 'Sei He Ki',
    meaning: 'Das Mental-Emotional-Symbol - für mentale und emotionale Heilung',
    usage: 'Für emotionale Blockaden, Ängste und mentale Klarheit',
    mantra: 'Sei He Ki'
  },
  'hon_sha_ze_sho_nen': {
    name: 'Hon Sha Ze Sho Nen',
    meaning: 'Das Fernheilungs-Symbol - für Fernheilung und Zeit',
    usage: 'Für Fernheilung, Vergangenheit und Zukunft',
    mantra: 'Hon Sha Ze Sho Nen'
  },
  'dai_ko_myo': {
    name: 'Dai Ko Myo',
    meaning: 'Das Meister-Symbol - für spirituelle Entwicklung',
    usage: 'Für spirituelle Transformation und Meisterschaft',
    mantra: 'Dai Ko Myo'
  }
};

// GET /reiki/symbols - Alle Reiki-Symbole abrufen
router.get('/symbols', (req, res) => {
  try {
    res.json({
      success: true,
      symbols: reikiSymbols,
      count: Object.keys(reikiSymbols).length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Fehler beim Abrufen der Reiki-Symbole'
    });
  }
});

// GET /reiki/symbol/:symbolName - Spezifisches Reiki-Symbol abrufen
router.get('/symbol/:symbolName', (req, res) => {
  try {
    const { symbolName } = req.params;
    const symbol = reikiSymbols[symbolName as keyof typeof reikiSymbols];
    
    if (!symbol) {
      return res.status(404).json({
        success: false,
        error: 'Reiki-Symbol nicht gefunden'
      });
    }
    
    res.json({
      success: true,
      symbol: {
        name: symbol.name,
        meaning: symbol.meaning,
        usage: symbol.usage,
        mantra: symbol.mantra
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Fehler beim Abrufen des Reiki-Symbols'
    });
  }
});

// POST /reiki/analysis - Reiki-Analyse basierend auf Human Design
router.post('/analysis', authenticateToken, async (req, res) => {
  try {
    const { chartData, focusArea } = req.body;
    
    if (!chartData) {
      return res.status(400).json({
        success: false,
        error: 'Chart-Daten sind erforderlich'
      });
    }
    
    const prompt = `Erstelle eine Reiki-Analyse basierend auf Human Design Chart-Daten:

Human Design Chart:
- Typ: ${chartData.type}
- Profil: ${chartData.profile}
- Strategie: ${chartData.strategy}
- Autorität: ${chartData.authority}
- Definierte Zentren: ${chartData.definedCenters?.join(', ') || 'Unbekannt'}
- Aktive Gates: ${chartData.activeGates?.join(', ') || 'Unbekannt'}

Fokus-Bereich: ${focusArea || 'Allgemeine Reiki-Behandlung'}

Bitte erstelle eine strukturierte Reiki-Analyse mit folgenden Abschnitten:

1. **Energie-Profil** - Wie die Human Design-Energie mit Reiki harmoniert
2. **Empfohlene Symbole** - Welche Reiki-Symbole am besten passen
3. **Chakra-Fokus** - Welche Chakren besondere Aufmerksamkeit brauchen
4. **Behandlungsansatz** - Spezifische Reiki-Techniken für diesen Typ
5. **Selbstheilung** - Empfehlungen für tägliche Reiki-Praxis
6. **Warnungen** - Besondere Vorsichtsmaßnahmen

Die Analyse sollte praktisch anwendbar und auf die individuellen Energiemuster abgestimmt sein.`;

    const aiResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1500,
      temperature: 0.7
    });

    const analysis = aiResponse.choices[0]?.message?.content || 'Keine Analyse verfügbar';

    res.json({
      success: true,
      analysis: {
        content: analysis,
        chartType: chartData.type,
        focusArea: focusArea || 'Allgemein',
        generatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Reiki-Analyse Fehler:', error);
    res.status(500).json({
      success: false,
      error: 'Fehler bei der Reiki-Analyse'
    });
  }
});

// POST /reiki/session-plan - Reiki-Session-Plan erstellen
router.post('/session-plan', authenticateToken, async (req, res) => {
  try {
    const { sessionType, duration, clientNeeds, chartData } = req.body;
    
    if (!sessionType || !duration) {
      return res.status(400).json({
        success: false,
        error: 'Session-Typ und Dauer sind erforderlich'
      });
    }
    
    const prompt = `Erstelle einen detaillierten Reiki-Session-Plan:

Session-Details:
- Typ: ${sessionType}
- Dauer: ${duration} Minuten
- Kundenbedürfnisse: ${clientNeeds || 'Allgemeine Entspannung'}

Human Design Chart (falls verfügbar):
- Typ: ${chartData?.type || 'Unbekannt'}
- Profil: ${chartData?.profile || 'Unbekannt'}
- Strategie: ${chartData?.strategy || 'Unbekannt'}

Erstelle einen strukturierten Session-Plan mit:

1. **Vorbereitung** (5-10 Min) - Raum, Atmung, Intention
2. **Hauptbehandlung** (40-50 Min) - Reiki-Techniken, Symbole, Chakren
3. **Abschluss** (5-10 Min) - Integration, Nachbesprechung
4. **Nachsorge** - Empfehlungen für zu Hause
5. **Benötigte Materialien** - Kristalle, Musik, etc.

Der Plan sollte professionell und praktisch umsetzbar sein.`;

    const aiResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1200,
      temperature: 0.6
    });

    const sessionPlan = aiResponse.choices[0]?.message?.content || 'Kein Session-Plan verfügbar';

    res.json({
      success: true,
      sessionPlan: {
        content: sessionPlan,
        sessionType,
        duration,
        clientNeeds: clientNeeds || 'Allgemein',
        generatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Session-Plan Fehler:', error);
    res.status(500).json({
      success: false,
      error: 'Fehler beim Erstellen des Session-Plans'
    });
  }
});

// GET /reiki/benefits - Reiki-Vorteile und Wirkungen
router.get('/benefits', (req, res) => {
  try {
    const benefits = [
      {
        category: 'Körperlich',
        benefits: [
          'Schmerzlinderung',
          'Verbesserte Durchblutung',
          'Stärkung des Immunsystems',
          'Bessere Schlafqualität',
          'Reduzierung von Entzündungen'
        ]
      },
      {
        category: 'Emotional',
        benefits: [
          'Stressabbau',
          'Emotionale Balance',
          'Angstlinderung',
          'Verbesserte Stimmung',
          'Trauma-Heilung'
        ]
      },
      {
        category: 'Mental',
        benefits: [
          'Klarheit des Geistes',
          'Verbesserte Konzentration',
          'Mentaler Stressabbau',
          'Bessere Entscheidungsfindung',
          'Kreativitätssteigerung'
        ]
      },
      {
        category: 'Spirituell',
        benefits: [
          'Spirituelle Entwicklung',
          'Bewusstseinserweiterung',
          'Energieausgleich',
          'Chakra-Harmonisierung',
          'Intuitionsstärkung'
        ]
      }
    ];

    res.json({
      success: true,
      benefits,
      totalCategories: benefits.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Fehler beim Abrufen der Reiki-Vorteile'
    });
  }
});

// POST /reiki/self-treatment - Selbstbehandlungs-Anleitung
router.post('/self-treatment', authenticateToken, async (req, res) => {
  try {
    const { treatmentType, duration, focusArea } = req.body;
    
    const prompt = `Erstelle eine detaillierte Reiki-Selbstbehandlungs-Anleitung:

Behandlungs-Typ: ${treatmentType || 'Allgemeine Selbstbehandlung'}
Dauer: ${duration || '20'} Minuten
Fokus-Bereich: ${focusArea || 'Allgemeine Entspannung'}

Erstelle eine Schritt-für-Schritt-Anleitung mit:

1. **Vorbereitung** - Raum, Atmung, Intention setzen
2. **Handpositionen** - Detaillierte Anleitung für jede Position
3. **Zeitaufteilung** - Wie lange bei jeder Position
4. **Symbole** - Welche Reiki-Symbole zu verwenden
5. **Abschluss** - Integration und Dankbarkeit
6. **Tipps** - Für optimale Wirkung

Die Anleitung sollte einfach zu befolgen und für Anfänger geeignet sein.`;

    const aiResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1000,
      temperature: 0.6
    });

    const selfTreatment = aiResponse.choices[0]?.message?.content || 'Keine Anleitung verfügbar';

    res.json({
      success: true,
      selfTreatment: {
        content: selfTreatment,
        treatmentType: treatmentType || 'Allgemein',
        duration: duration || '20',
        focusArea: focusArea || 'Allgemein',
        generatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Selbstbehandlung Fehler:', error);
    res.status(500).json({
      success: false,
      error: 'Fehler beim Erstellen der Selbstbehandlungs-Anleitung'
    });
  }
});

// GET /reiki/meditation-guides - Reiki-Meditations-Anleitungen
router.get('/meditation-guides', (req, res) => {
  try {
    const meditationGuides = [
      {
        id: 'cho_ku_rei_meditation',
        name: 'Cho Ku Rei Meditation',
        duration: '15 Minuten',
        description: 'Meditation mit dem Kraft-Symbol für Energie und Schutz',
        steps: [
          'Sitzen Sie bequem und schließen Sie die Augen',
          'Visualisieren Sie das Cho Ku Rei Symbol',
          'Rezitieren Sie das Mantra "Cho Ku Rei"',
          'Fühlen Sie die Energie durch Ihren Körper fließen',
          'Beenden Sie mit Dankbarkeit'
        ]
      },
      {
        id: 'chakra_balancing',
        name: 'Chakra-Ausgleichs-Meditation',
        duration: '20 Minuten',
        description: 'Meditation zur Harmonisierung aller Chakren',
        steps: [
          'Beginnen Sie mit der Wurzel-Chakra',
          'Arbeiten Sie sich durch alle 7 Chakren',
          'Verwenden Sie Reiki-Energie für jeden Bereich',
          'Spüren Sie die Balance und Harmonie',
          'Integrieren Sie die Energie'
        ]
      },
      {
        id: 'distance_healing',
        name: 'Fernheilungs-Meditation',
        duration: '25 Minuten',
        description: 'Meditation für Fernheilung mit Hon Sha Ze Sho Nen',
        steps: [
          'Setzen Sie eine klare Intention',
          'Visualisieren Sie die Person oder Situation',
          'Verwenden Sie das Fernheilungs-Symbol',
          'Senden Sie Reiki-Energie über Zeit und Raum',
          'Beenden Sie mit Liebe und Dankbarkeit'
        ]
      }
    ];

    res.json({
      success: true,
      meditationGuides,
      totalGuides: meditationGuides.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Fehler beim Abrufen der Meditations-Anleitungen'
    });
  }
});

export default router;
