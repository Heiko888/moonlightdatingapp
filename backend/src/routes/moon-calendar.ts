import express, { Request, Response } from 'express';
import { supabase } from '../lib/supabase';
import { authenticateToken } from '../middleware/auth';
import axios from 'axios';

const router = express.Router();

// NASA API Konfiguration
const NASA_API_KEY = process.env.NASA_API_KEY || 'DEMO_KEY'; // Kostenloser Demo-Key
const NASA_BASE_URL = 'https://api.nasa.gov/planetary';

interface MoonPhase {
  name: string;
  description: string;
  icon: string;
  energy: string;
  color: string;
  advice: string;
  explanation: string;
  reflectionExercises: string[];
  moonRituals: string[];
  humanDesignConnection: string;
}

interface MoonTracking {
  id: string;
  user_id: string;
  date: string;
  moon_phase: string;
  mood: number; // 1-10
  energy: number; // 1-10
  notes: string;
  rituals_completed: string[];
  created_at: string;
}

interface MoonNotification {
  id: string;
  user_id: string;
  moon_phase: string;
  notification_type: 'full_moon' | 'new_moon' | 'quarter_moon' | 'custom';
  message: string;
  scheduled_date: string;
  is_sent: boolean;
  created_at: string;
}

interface MoonStory {
  id: string;
  title: string;
  culture: string;
  content: string;
  moon_phase: string;
  moral: string;
  tags: string[];
}

interface PlantRitual {
  id: string;
  name: string;
  moon_phase: string;
  plants: string[];
  instructions: string[];
  benefits: string[];
  timing: string;
}

interface HealthGuidance {
  id: string;
  moon_phase: string;
  nutrition: {
    recommended: string[];
    avoid: string[];
    timing: string;
  };
  health: {
    activities: string[];
    rest: string[];
    healing: string[];
  };
  supplements: string[];
}

interface GateDetails {
  id: number;
  name: string;
  status: 'active' | 'inactive';
  description: string;
  keywords: string[];
  center: string;
  meaning: string;
  expression: string;
  shadow: string;
  gift: string;
}

// NASA API Response Interface
interface NASAEphemerisResponse {
  date: string;
  phase: string;
  illumination: number;
  distance: number;
  age: number;
}

const moonPhases: MoonPhase[] = [
  {
    name: 'Neumond',
    description: 'Neuer Anfang, Intention setzen',
    icon: '🌑',
    energy: 'Introspektiv und reflektierend',
    color: '#1a1a2e',
    advice: 'Setze neue Intentionen und plane deine nächsten Schritte',
    explanation: 'Der Neumond ist eine Zeit der Dunkelheit und des Neubeginns. Es ist der perfekte Moment, um neue Ziele zu setzen und deine Energie zu sammeln.',
    reflectionExercises: [
      'Was möchte ich in diesem Mondzyklus erreichen?',
      'Welche alten Muster kann ich loslassen?',
      'Was braucht meine Seele gerade am meisten?'
    ],
    moonRituals: [
      'Intentionen aufschreiben und verbrennen',
      'Meditation im Kerzenlicht',
      'Neue Ziele visualisieren'
    ],
    humanDesignConnection: 'Nutze deine Autorität, um zu entscheiden, welche neuen Wege du beschreiten möchtest.'
  },
  {
    name: 'Zunehmender Sichelmond',
    description: 'Wachstum und Entwicklung',
    icon: '🌒',
    energy: 'Expansiv und wachsend',
    color: '#2d3748',
    advice: 'Fokussiere dich auf Wachstum und lerne neue Fähigkeiten',
    explanation: 'Die zunehmende Sichel symbolisiert Wachstum und Entwicklung. Es ist eine Zeit, um neue Fähigkeiten zu erlernen und deine Energie zu steigern.',
    reflectionExercises: [
      'Was lerne ich gerade Neues?',
      'Wie kann ich meine Fähigkeiten erweitern?',
      'Welche Ressourcen brauche ich für mein Wachstum?'
    ],
    moonRituals: [
      'Neue Fähigkeiten üben',
      'Energie aufladen durch Bewegung',
      'Positive Affirmationen sprechen'
    ],
    humanDesignConnection: 'Folge deiner Strategie, um neue Möglichkeiten zu erkennen und zu nutzen.'
  },
  {
    name: 'Erstes Viertel',
    description: 'Entscheidungen treffen und handeln',
    icon: '🌓',
    energy: 'Entschlossen und handlungsorientiert',
    color: '#4a5568',
    advice: 'Treffe wichtige Entscheidungen und setze Pläne in die Tat um',
    explanation: 'Das erste Viertel ist eine Zeit der Entscheidungen und des Handelns. Die Energie ist stark und unterstützt mutige Schritte.',
    reflectionExercises: [
      'Welche Entscheidungen muss ich treffen?',
      'Was hindert mich daran, zu handeln?',
      'Wie kann ich meine Ziele konkret umsetzen?'
    ],
    moonRituals: [
      'Entscheidungen aufschreiben und bekräftigen',
      'Aktion planen und erste Schritte machen',
      'Energie für Handlungen sammeln'
    ],
    humanDesignConnection: 'Vertraue auf deine innere Autorität, um die richtigen Entscheidungen zu treffen.'
  },
  {
    name: 'Zunehmender Gibbous',
    description: 'Verfeinerung und Perfektionierung',
    icon: '🌔',
    energy: 'Analytisch und verfeinernd',
    color: '#718096',
    advice: 'Verfeinere deine Pläne und bereite dich auf den Höhepunkt vor',
    explanation: 'Der zunehmende Gibbous ist eine Zeit der Verfeinerung. Es ist der Moment, um Details zu perfektionieren und sich auf den Vollmond vorzubereiten.',
    reflectionExercises: [
      'Was kann ich noch verbessern?',
      'Sind meine Pläne vollständig?',
      'Wie kann ich mich optimal vorbereiten?'
    ],
    moonRituals: [
      'Pläne überprüfen und anpassen',
      'Details verfeinern',
      'Energie für den Höhepunkt sammeln'
    ],
    humanDesignConnection: 'Nutze deine natürliche Fähigkeit zur Verfeinerung und Perfektionierung.'
  },
  {
    name: 'Vollmond',
    description: 'Höhepunkt, Erleuchtung und Manifestation',
    icon: '🌕',
    energy: 'Intensiv und erleuchtend',
    color: '#FFD700',
    advice: 'Feiere deine Erfolge und erkenne deine Vollendung',
    explanation: 'Der Vollmond ist der Höhepunkt des Mondzyklus. Es ist eine Zeit der Erleuchtung, Manifestation und des Feierns.',
    reflectionExercises: [
      'Was habe ich erreicht?',
      'Was ist vollendet worden?',
      'Wofür bin ich dankbar?'
    ],
    moonRituals: [
      'Erfolge feiern und würdigen',
      'Vollmond-Meditation',
      'Dankbarkeit praktizieren'
    ],
    humanDesignConnection: 'Alle Human Design Typen können hier ihre höchste Energie erleben.'
  },
  {
    name: 'Abnehmender Gibbous',
    description: 'Dankbarkeit und Teilen',
    icon: '🌖',
    energy: 'Dankbar und gebend',
    color: '#E53E3E',
    advice: 'Sei dankbar und teile deine Weisheit mit anderen',
    explanation: 'Der abnehmende Gibbous ist eine Zeit der Dankbarkeit und des Teilens. Es ist der Moment, um zu erkennen, was wir gelernt haben.',
    reflectionExercises: [
      'Wofür bin ich dankbar?',
      'Was kann ich anderen weitergeben?',
      'Welche Weisheit habe ich gewonnen?'
    ],
    moonRituals: [
      'Dankbarkeitsjournal führen',
      'Weisheit mit anderen teilen',
      'Gemeinschaft stärken'
    ],
    humanDesignConnection: 'Nutze deine natürliche Fähigkeit zum Lehren und Teilen von Weisheit.'
  },
  {
    name: 'Letztes Viertel',
    description: 'Loslassen und Vergebung',
    icon: '🌗',
    energy: 'Loslassend und vergebend',
    color: '#C53030',
    advice: 'Lass los, was nicht mehr dient, und vergebe dir und anderen',
    explanation: 'Das letzte Viertel ist eine Zeit des Loslassens und der Vergebung. Es ist der Moment, um zu vergeben und Platz für Neues zu schaffen.',
    reflectionExercises: [
      'Was kann ich loslassen?',
      'Wem muss ich vergeben?',
      'Was ist abgeschlossen?'
    ],
    moonRituals: [
      'Loslass-Ritual durchführen',
      'Vergebungsmeditation',
      'Alte Muster beenden'
    ],
    humanDesignConnection: 'Nutze deine natürliche Fähigkeit zur Reflexion und Transformation.'
  },
  {
    name: 'Abnehmender Sichelmond',
    description: 'Ruhe und Regeneration',
    icon: '🌘',
    energy: 'Ruhig und regenerierend',
    color: '#9B2C2C',
    advice: 'Ruhe dich aus und bereite dich auf den neuen Zyklus vor',
    explanation: 'Die abnehmende Sichel ist eine Zeit der Ruhe und Regeneration. Es ist der Moment, um sich auszuruhen und die Energie für den nächsten Neumond zu sammeln.',
    reflectionExercises: [
      'Was braucht meine Seele zur Regeneration?',
      'Wie kann ich mich ausruhen?',
      'Was habe ich aus diesem Zyklus gelernt?'
    ],
    moonRituals: [
      'Entspannungsrituale',
      'Energie sammeln',
      'Reflexion des vergangenen Zyklus'
    ],
    humanDesignConnection: 'Alle Human Design Typen können hier ihre Energie regenerieren.'
  }
];

// Mock-Daten für erweiterte Features
const mockMoonTracking: MoonTracking[] = [
  {
    id: '1',
    user_id: 'user1',
    date: new Date().toISOString().split('T')[0],
    moon_phase: 'Vollmond',
    mood: 8,
    energy: 7,
    notes: 'Fühle mich sehr verbunden und inspiriert heute.',
    rituals_completed: ['Vollmond-Meditation', 'Dankbarkeit praktizieren'],
    created_at: new Date().toISOString()
  }
];

const mockMoonNotifications: MoonNotification[] = [
  {
    id: '1',
    user_id: 'user1',
    moon_phase: 'Vollmond',
    notification_type: 'full_moon',
    message: 'Vollmond heute! Perfekt für Manifestation und Reflexion.',
    scheduled_date: new Date().toISOString(),
    is_sent: false,
    created_at: new Date().toISOString()
  }
];

// Mond-Geschichten und Mythen
const moonStories: MoonStory[] = [
  {
    id: '1',
    title: 'Die Mondgöttin Selene',
    culture: 'Griechisch',
    content: 'Selene, die griechische Mondgöttin, fährt jeden Abend mit ihrem silbernen Wagen über den Himmel. Sie verliebte sich in den schönen Hirten Endymion und bat Zeus, ihm ewigen Schlaf zu gewähren, damit er für immer jung und schön bliebe. Seitdem besucht sie ihn jede Nacht in seinen Träumen.',
    moon_phase: 'Vollmond',
    moral: 'Die Kraft der Liebe und des ewigen Begehrens',
    tags: ['Liebe', 'Ewigkeit', 'Schönheit', 'Träume']
  },
  {
    id: '2',
    title: 'Der Mondhase',
    culture: 'Chinesisch',
    content: 'In der chinesischen Mythologie lebt ein Jade-Hase auf dem Mond, der unermüdlich den Elixier der Unsterblichkeit in einem Mörser zerstößt. Der Hase wurde von den Göttern belohnt, weil er sein Leben für einen hungrigen Bettler opferte.',
    moon_phase: 'Vollmond',
    moral: 'Selbstlosigkeit und Opferbereitschaft werden belohnt',
    tags: ['Selbstlosigkeit', 'Unsterblichkeit', 'Belohnung', 'Opfer']
  },
  {
    id: '3',
    title: 'Mani und Sol',
    culture: 'Nordisch',
    content: 'In der nordischen Mythologie sind Mani (Mond) und Sol (Sonne) Geschwister, die von den Göttern in den Himmel gesetzt wurden, um die Zeit zu messen. Mani wird von zwei Wölfen verfolgt, die ihn eines Tages einholen werden - das Ende der Welt.',
    moon_phase: 'Neumond',
    moral: 'Alles hat seinen Zyklus und sein Ende',
    tags: ['Zyklus', 'Zeit', 'Geschwister', 'Schicksal']
  },
  {
    id: '4',
    title: 'Die Mondfrau',
    culture: 'Japanisch',
    content: 'Tsukuyomi, der Mondgott, wurde von seiner Schwester Amaterasu (Sonnengöttin) verbannt, weil er die Göttin der Nahrung tötete. Seitdem leben Sonne und Mond getrennt und wechseln sich am Himmel ab.',
    moon_phase: 'Zunehmender Mond',
    moral: 'Handlungen haben Konsequenzen',
    tags: ['Familie', 'Konflikt', 'Trennung', 'Konsequenzen']
  }
];

// Pflanzen-Rituale nach Mondphasen
const plantRituals: PlantRitual[] = [
  {
    id: '1',
    name: 'Neumond-Saat',
    moon_phase: 'Neumond',
    plants: ['Wurzelgemüse', 'Kartoffeln', 'Karotten', 'Rüben'],
    instructions: [
      'Bereite den Boden vor und lockere ihn auf',
      'Säe die Samen in der Dunkelheit des Neumonds',
      'Visualisiere das Wachstum der Wurzeln',
      'Gieße mit Mondwasser (über Nacht stehen gelassen)'
    ],
    benefits: ['Stärkere Wurzelbildung', 'Bessere Nährstoffaufnahme', 'Robustere Pflanzen'],
    timing: 'Nachts oder in der Dämmerung'
  },
  {
    id: '2',
    name: 'Vollmond-Ernte',
    moon_phase: 'Vollmond',
    plants: ['Kräuter', 'Blüten', 'Früchte', 'Samen'],
    instructions: [
      'Ernte bei Vollmondlicht für maximale Potenz',
      'Verwende eine silberne Schere oder deine Hände',
      'Danke der Pflanze für ihre Gaben',
      'Trockne die Kräuter im Mondlicht'
    ],
    benefits: ['Höhere Wirkstoffkonzentration', 'Längere Haltbarkeit', 'Stärkere Heilwirkung'],
    timing: 'Bei Vollmondlicht, vor Mitternacht'
  },
  {
    id: '3',
    name: 'Zunehmender Mond - Wachstum',
    moon_phase: 'Zunehmender Mond',
    plants: ['Blattgemüse', 'Salat', 'Spinat', 'Kohl'],
    instructions: [
      'Pflanze bei zunehmendem Mond',
      'Dünge mit organischem Kompost',
      'Gieße regelmäßig und gleichmäßig',
      'Visualisiere üppiges Blattwachstum'
    ],
    benefits: ['Üppiges Blattwachstum', 'Schnelleres Wachstum', 'Grünere Blätter'],
    timing: 'Morgens oder abends'
  }
];

// Gesundheit und Ernährung nach Mondphasen
const healthGuidance: HealthGuidance[] = [
  {
    id: '1',
    moon_phase: 'Neumond',
    nutrition: {
      recommended: ['Entgiftende Tees', 'Grüne Smoothies', 'Wurzelgemüse', 'Fermentierte Lebensmittel'],
      avoid: ['Schwere Mahlzeiten', 'Alkohol', 'Zucker', 'Verarbeitete Lebensmittel'],
      timing: 'Leichte Mahlzeiten, viel Flüssigkeit'
    },
    health: {
      activities: ['Meditation', 'Yoga', 'Spaziergänge', 'Atemübungen'],
      rest: ['Früher schlafen', 'Digital Detox', 'Ruhephasen', 'Reflexion'],
      healing: ['Entgiftung', 'Fasten', 'Kräutertees', 'Sauna']
    },
    supplements: ['Mariendistel', 'Brennnessel', 'Löwenzahn', 'Chlorella']
  },
  {
    id: '2',
    moon_phase: 'Vollmond',
    nutrition: {
      recommended: ['Frische Früchte', 'Nüsse', 'Samen', 'Vollkornprodukte'],
      avoid: ['Koffein', 'Salz', 'Scharfe Gewürze', 'Große Portionen'],
      timing: 'Kleinere, häufigere Mahlzeiten'
    },
    health: {
      activities: ['Tanzen', 'Kreative Projekte', 'Gesellschaft', 'Manifestation'],
      rest: ['Ausreichend Schlaf', 'Entspannung', 'Mondbaden', 'Rituale'],
      healing: ['Kräuterbäder', 'Aromatherapie', 'Kristallarbeit', 'Mondmeditation']
    },
    supplements: ['Magnesium', 'Melatonin', 'Lavendel', 'Passionsblume']
  },
  {
    id: '3',
    moon_phase: 'Zunehmender Mond',
    nutrition: {
      recommended: ['Proteinreiche Lebensmittel', 'Eisenhaltige Nahrung', 'Vitamin C', 'Gesunde Fette'],
      avoid: ['Leere Kalorien', 'Zucker', 'Alkohol', 'Fast Food'],
      timing: 'Regelmäßige, nährstoffreiche Mahlzeiten'
    },
    health: {
      activities: ['Krafttraining', 'Wandern', 'Projektarbeit', 'Lernen'],
      rest: ['Aktive Erholung', 'Mittagsschlaf', 'Entspannung', 'Hobbys'],
      healing: ['Massage', 'Physiotherapie', 'Sport', 'Energiearbeit']
    },
    supplements: ['Eisen', 'Vitamin B12', 'Omega-3', 'Probiotika']
  }
];

// Detaillierte Gate-Beschreibungen
const gateDetails: GateDetails[] = [
  {
    id: 1,
    name: "Self-Expression",
    status: "active",
    description: "Das Tor der Kreativität und des Selbstausdrucks",
    keywords: ["Kreativität", "Selbstausdruck", "Inspiration"],
    center: "Kopf-Zentrum",
    meaning: "Das Tor der Kreativität und des Selbstausdrucks. Es repräsentiert die Fähigkeit, neue Ideen zu generieren und diese kreativ auszudrücken.",
    expression: "Du bist ein natürlicher Kreativer, der neue Wege findet, um Ideen auszudrücken. Deine Kreativität fließt durch dich und inspiriert andere.",
    shadow: "Kreative Blockaden, Angst vor Urteilen, Perfektionismus, der den Ausdruck hemmt.",
    gift: "Die Gabe, neue Formen des Ausdrucks zu schaffen und andere zu inspirieren."
  },
  {
    id: 3,
    name: "Ordering",
    status: "active",
    description: "Das Tor der Strukturierung und Ordnung",
    keywords: ["Struktur", "Ordnung", "Organisation"],
    center: "Sakral-Zentrum",
    meaning: "Das Tor der Strukturierung und Ordnung. Es bringt die Fähigkeit mit sich, Chaos in Ordnung zu verwandeln und Strukturen zu schaffen.",
    expression: "Du hast ein natürliches Talent, Ordnung zu schaffen und Strukturen zu etablieren. Du bringst Organisation in unorganisierte Situationen.",
    shadow: "Rigide Strukturen, Kontrollzwang, Unfähigkeit, mit Chaos umzugehen.",
    gift: "Die Gabe, Ordnung zu schaffen und anderen zu helfen, ihre Struktur zu finden."
  },
  {
    id: 8,
    name: "Holding Together",
    status: "active",
    description: "Das Tor des Zusammenhalts und der Kontribution",
    keywords: ["Zusammenhalt", "Kontribution", "Einheit"],
    center: "Kehle-Zentrum",
    meaning: "Das Tor des Zusammenhalts und der Kontribution. Es repräsentiert die Fähigkeit, Menschen zusammenzubringen und zur Gemeinschaft beizutragen.",
    expression: "Du bist ein natürlicher Vermittler, der Menschen zusammenbringt und zur Einheit beiträgt. Du schaffst Verbindungen zwischen verschiedenen Gruppen.",
    shadow: "Übermäßige Kontrolle, Manipulation, Unfähigkeit, loszulassen.",
    gift: "Die Gabe, Einheit zu schaffen und zur Gemeinschaft beizutragen."
  },
  {
    id: 10,
    name: "Treading",
    status: "active",
    description: "Das Tor des Tretens und der Selbstliebe",
    keywords: ["Selbstliebe", "Treten", "Verhalten"],
    center: "G-Zentrum",
    meaning: "Das Tor des Tretens und der Selbstliebe. Es repräsentiert die Fähigkeit, den eigenen Weg zu gehen und sich selbst zu lieben.",
    expression: "Du gehst deinen eigenen Weg und liebst dich selbst. Du zeigst anderen, wie man authentisch lebt und sich selbst akzeptiert.",
    shadow: "Selbstkritik, mangelnde Selbstliebe, Unfähigkeit, den eigenen Weg zu gehen.",
    gift: "Die Gabe, sich selbst zu lieben und anderen zu zeigen, wie man authentisch lebt."
  }
];

// NASA API Funktionen
async function getNASAEphemeris(date: string): Promise<NASAEphemerisResponse | null> {
  try {
    const response = await axios.get(`${NASA_BASE_URL}/ephemeris`, {
      params: {
        target: 'moon',
        date: date,
        api_key: NASA_API_KEY
      }
    });

    if (response.data && response.data.ephemeris) {
      const ephemeris = response.data.ephemeris;
      return {
        date: date,
        phase: ephemeris.phase || 'unknown',
        illumination: ephemeris.illumination || 0,
        distance: ephemeris.distance || 0,
        age: ephemeris.age || 0
      };
    }
    return null;
  } catch (error) {
    console.error('NASA API Fehler:', error);
    return null;
  }
}

// Präzise Mondphasen-Berechnung mit NASA API
async function calculateMoonPhaseWithNASA(date: Date): Promise<MoonPhase> {
  const dateString = date.toISOString().split('T')[0];
  
  try {
    // Versuche NASA API zu verwenden
    const nasaData = await getNASAEphemeris(dateString);
    
    if (nasaData) {
      // Konvertiere NASA Phase zu unserer Phase
      const phase = mapNASAPhaseToLocal(nasaData.phase, nasaData.illumination);
      return phase;
    }
  } catch (error) {
    console.log('NASA API nicht verfügbar, verwende lokale Berechnung');
  }
  
  // Fallback: Lokale Berechnung
  return calculateMoonPhaseLocal(date);
}

// NASA Phase zu lokaler Phase mappen
function mapNASAPhaseToLocal(nasaPhase: string, illumination: number): MoonPhase {
  // NASA Phasen: new_moon, waxing_crescent, first_quarter, waxing_gibbous, full_moon, waning_gibbous, last_quarter, waning_crescent
  
  switch (nasaPhase.toLowerCase()) {
    case 'new_moon':
      return moonPhases[0]; // Neumond
    case 'waxing_crescent':
      return moonPhases[1]; // Zunehmender Sichelmond
    case 'first_quarter':
      return moonPhases[2]; // Erstes Viertel
    case 'waxing_gibbous':
      return moonPhases[3]; // Zunehmender Gibbous
    case 'full_moon':
      return moonPhases[4]; // Vollmond
    case 'waning_gibbous':
      return moonPhases[5]; // Abnehmender Gibbous
    case 'last_quarter':
      return moonPhases[6]; // Letztes Viertel
    case 'waning_crescent':
      return moonPhases[7]; // Abnehmender Sichelmond
    default:
      // Fallback basierend auf Beleuchtung
      if (illumination < 0.1) return moonPhases[0]; // Neumond
      if (illumination < 0.25) return moonPhases[1]; // Zunehmender Sichelmond
      if (illumination < 0.35) return moonPhases[2]; // Erstes Viertel
      if (illumination < 0.65) return moonPhases[3]; // Zunehmender Gibbous
      if (illumination < 0.75) return moonPhases[4]; // Vollmond
      if (illumination < 0.85) return moonPhases[5]; // Abnehmender Gibbous
      if (illumination < 0.95) return moonPhases[6]; // Letztes Viertel
      return moonPhases[7]; // Abnehmender Sichelmond
  }
}

// Lokale Fallback-Berechnung
function calculateMoonPhaseLocal(date: Date): MoonPhase {
  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  const phaseIndex = Math.floor((dayOfYear % 29.5) / 3.7); // 29.5 Tage = Mondzyklus
  return moonPhases[phaseIndex % moonPhases.length];
}

// GET /moon-calendar/phases/:date - Mondphase für ein bestimmtes Datum
router.get('/phases/:date', async (req: Request, res: Response) => {
  try {
    const { date } = req.params;
    const targetDate = new Date(date);
    
    if (isNaN(targetDate.getTime())) {
      return res.status(400).json({ error: 'Ungültiges Datum' });
    }

    const moonPhase = await calculateMoonPhaseWithNASA(targetDate);
    
    // Versuche Supabase zu verwenden (für zukünftige Erweiterungen)
    if (supabase) {
      // Hier könnte man die Mondphase in der Datenbank speichern
      // Für jetzt verwenden wir nur die Berechnung
    }

    res.json({
      date: date,
      phase: moonPhase,
      timestamp: targetDate.toISOString()
    });
  } catch (error) {
    console.error('Fehler beim Laden der Mondphase:', error);
    res.status(500).json({ error: 'Fehler beim Laden der Mondphase' });
  }
});

// GET /moon-calendar/calendar/:year/:month - Mondkalender für einen Monat
router.get('/calendar/:year/:month', async (req: Request, res: Response) => {
  try {
    const { year, month } = req.params;
    const yearNum = parseInt(year);
    const monthNum = parseInt(month) - 1; // JavaScript Monate sind 0-basiert
    
    if (isNaN(yearNum) || isNaN(monthNum) || monthNum < 0 || monthNum > 11) {
      return res.status(400).json({ error: 'Ungültiges Jahr oder Monat' });
    }

    const daysInMonth = new Date(yearNum, monthNum + 1, 0).getDate();
    const calendar: any[] = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(yearNum, monthNum, day);
      const moonPhase = await calculateMoonPhaseWithNASA(date);
      
      calendar.push({
        date: date.toISOString().split('T')[0],
        day: day,
        phase: {
          name: moonPhase.name,
          icon: moonPhase.icon,
          energy: moonPhase.energy
        }
      });
    }

    res.json({
      year: yearNum,
      month: monthNum + 1,
      calendar: calendar
    });
  } catch (error) {
    console.error('Fehler beim Laden des Mondkalenders:', error);
    res.status(500).json({ error: 'Fehler beim Laden des Mondkalenders' });
  }
});

// GET /moon-calendar/current - Aktuelle Mondphase (geschützt)
router.get('/current', authenticateToken, async (req: Request, res: Response) => {
  try {
    const now = new Date();
    const moonPhase = await calculateMoonPhaseWithNASA(now);
    
    // Berechne den Fortschritt im aktuellen Mondzyklus
    const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    const cycleProgress = (dayOfYear % 29.5) / 29.5 * 100;
    
    res.json({
      current: {
        date: now.toISOString().split('T')[0],
        time: now.toISOString(),
        phase: moonPhase,
        cycleProgress: Math.round(cycleProgress)
      },
      nextPhase: {
        // Berechne die nächste Phase (vereinfacht)
        estimatedDate: new Date(now.getTime() + 3.7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      }
    });
  } catch (error) {
    console.error('Fehler beim Laden der aktuellen Mondphase:', error);
    res.status(500).json({ error: 'Fehler beim Laden der aktuellen Mondphase' });
  }
});

// GET /moon-calendar/phases - Alle Mondphasen-Informationen (geschützt)
router.get('/phases', authenticateToken, async (req: Request, res: Response) => {
  try {
    res.json({
      phases: moonPhases,
      totalPhases: moonPhases.length,
      cycleLength: 29.5 // Tage
    });
  } catch (error) {
    console.error('Fehler beim Laden der Mondphasen:', error);
    res.status(500).json({ error: 'Fehler beim Laden der Mondphasen' });
  }
});

// NEUE FEATURES:

// POST /moon-calendar/tracking - Persönliches Moon-Tracking hinzufügen
router.post('/tracking', async (req: Request, res: Response) => {
  try {
    const { user_id, date, moon_phase, mood, energy, notes, rituals_completed } = req.body;
    
    if (!user_id || !date || !moon_phase) {
      return res.status(400).json({ error: 'user_id, date und moon_phase sind erforderlich' });
    }

    const newTracking = {
      user_id,
      date,
      moon_phase,
      mood: mood || 5,
      energy: energy || 5,
      notes: notes || '',
      rituals_completed: rituals_completed || [],
      created_at: new Date().toISOString()
    };

    // Versuche Supabase zu verwenden
    if (supabase) {
      try {
        // 1. Erstelle Journal-Eintrag
        const journalTitle = `Mond-Tracking: ${moon_phase} - ${new Date(date).toLocaleDateString('de-DE')}`;
        const journalContent = `Mondphase: ${moon_phase}\nStimmung: ${mood}/10\nEnergie: ${energy}/10\n\nNotizen:\n${notes}\n\nRituale:\n${rituals_completed.join(', ')}`;
        
        const { data: journalData, error: journalError } = await supabase
          .from('journal_entries')
          .insert([{
            user_id,
            title: journalTitle,
            content: journalContent,
            mood: getMoodLabel(mood),
            energy_level: energy,
            tags: ['Mond-Tracking', moon_phase]
          }])
          .select()
          .single();

        if (journalError) throw journalError;

        // 2. Erstelle Moon-Tracking mit Journal-Referenz
        const { data, error } = await supabase
          .from('moon_tracking')
          .insert([{
            ...newTracking,
            journal_entry_id: journalData.id
          }])
          .select()
          .single();

        if (error) throw error;
        return res.status(201).json({ ...data, journal_entry: journalData });
      } catch (supabaseError) {
        console.log('Supabase nicht verfügbar, verwende Mock-Daten');
      }
    }

    // Fallback: Mock-Daten
    const mockTracking: MoonTracking = {
      id: Date.now().toString(),
      ...newTracking
    };
    mockMoonTracking.push(mockTracking);
    res.status(201).json(mockTracking);
  } catch (error) {
    console.error('Fehler beim Speichern des Moon-Trackings:', error);
    res.status(500).json({ error: 'Fehler beim Speichern des Moon-Trackings' });
  }
});

// Hilfsfunktion für Mood-Labels
function getMoodLabel(mood: number): string {
  if (mood >= 8) return 'Begeistert';
  if (mood >= 6) return 'Zufrieden';
  if (mood >= 4) return 'Klar';
  if (mood >= 2) return 'Verwirrt';
  return 'Neutral';
}

// GET /moon-calendar/tracking/:user_id - Moon-Tracking für einen User abrufen
router.get('/tracking/:user_id', async (req: Request, res: Response) => {
  try {
    const { user_id } = req.params;
    const { start_date, end_date, limit = 30 } = req.query;
    
    // Versuche Supabase zu verwenden
    if (supabase) {
      try {
        let query = supabase
          .from('moon_tracking')
          .select('*')
          .eq('user_id', user_id)
          .order('date', { ascending: false })
          .limit(Number(limit));

        if (start_date) {
          query = query.gte('date', start_date.toString());
        }
        if (end_date) {
          query = query.lte('date', end_date.toString());
        }

        const { data, error } = await query;
        if (error) throw error;
        return res.json(data || []);
      } catch (supabaseError) {
        console.log('Supabase nicht verfügbar, verwende Mock-Daten');
      }
    }

    // Fallback: Mock-Daten
    let userTracking = mockMoonTracking.filter(t => t.user_id === user_id);
    
    if (start_date) {
      userTracking = userTracking.filter(t => t.date >= start_date.toString());
    }
    if (end_date) {
      userTracking = userTracking.filter(t => t.date <= end_date.toString());
    }
    
    userTracking = userTracking
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, Number(limit));

    res.json(userTracking);
  } catch (error) {
    console.error('Fehler beim Laden des Moon-Trackings:', error);
    res.status(500).json({ error: 'Fehler beim Laden des Moon-Trackings' });
  }
});

// GET /moon-calendar/tracking/:user_id/stats - Statistiken für Moon-Tracking
router.get('/tracking/:user_id/stats', async (req: Request, res: Response) => {
  try {
    const { user_id } = req.params;
    
    // Versuche Supabase zu verwenden
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('moon_tracking')
          .select('*')
          .eq('user_id', user_id);

        if (error) throw error;
        
        // Berechne Statistiken
        const stats = calculateTrackingStats(data || []);
        return res.json(stats);
      } catch (supabaseError) {
        console.log('Supabase nicht verfügbar, verwende Mock-Daten');
      }
    }

    // Fallback: Mock-Daten
    const userTracking = mockMoonTracking.filter(t => t.user_id === user_id);
    const stats = calculateTrackingStats(userTracking);
    res.json(stats);
  } catch (error) {
    console.error('Fehler beim Laden der Moon-Tracking-Statistiken:', error);
    res.status(500).json({ error: 'Fehler beim Laden der Moon-Tracking-Statistiken' });
  }
});

// POST /moon-calendar/notifications - Moon-Benachrichtigung erstellen
router.post('/notifications', async (req: Request, res: Response) => {
  try {
    const { user_id, moon_phase, notification_type, message, scheduled_date } = req.body;
    
    if (!user_id || !moon_phase || !notification_type) {
      return res.status(400).json({ error: 'user_id, moon_phase und notification_type sind erforderlich' });
    }

    const newNotification = {
      user_id,
      moon_phase,
      notification_type,
      message: message || `Besondere Mondphase: ${moon_phase}`,
      scheduled_date: scheduled_date || new Date().toISOString(),
      is_sent: false,
      created_at: new Date().toISOString()
    };

    // Versuche Supabase zu verwenden
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('moon_notifications')
          .insert([newNotification])
          .select()
          .single();

        if (error) throw error;
        return res.status(201).json(data);
      } catch (supabaseError) {
        console.log('Supabase nicht verfügbar, verwende Mock-Daten');
      }
    }
  
    

    // Fallback: Mock-Daten
    const mockNotification: MoonNotification = {
      id: Date.now().toString(),
      ...newNotification
    };
    mockMoonNotifications.push(mockNotification);
    res.status(201).json(mockNotification);
  } catch (error) {
    console.error('Fehler beim Erstellen der Moon-Benachrichtigung:', error);
    res.status(500).json({ error: 'Fehler beim Erstellen der Moon-Benachrichtigung' });
  }
});

// GET /moon-calendar/notifications/:user_id - Moon-Benachrichtigungen abrufen
router.get('/notifications/:user_id', async (req: Request, res: Response) => {
  try {
    const { user_id } = req.params;
    
    // Versuche Supabase zu verwenden
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('moon_notifications')
          .select('*')
          .eq('user_id', user_id)
          .order('scheduled_date', { ascending: true });

        if (error) throw error;
        return res.json(data || []);
      } catch (supabaseError) {
        console.log('Supabase nicht verfügbar, verwende Mock-Daten');
      }
    }

    // Fallback: Mock-Daten
    const userNotifications = mockMoonNotifications.filter(n => n.user_id === user_id);
    res.json(userNotifications);
  } catch (error) {
    console.error('Fehler beim Laden der Moon-Benachrichtigungen:', error);
    res.status(500).json({ error: 'Fehler beim Laden der Moon-Benachrichtigungen' });
  }
});

// GET /moon-calendar/human-design/:hd_type - Human Design spezifische Empfehlungen
router.get('/human-design/:hd_type', async (req: Request, res: Response) => {
  try {
    const { hd_type } = req.params;
    
    const hdRecommendations = {
      'Manifesting Generator': {
        optimal_phases: ['Neumond', 'Erstes Viertel'],
        advice: 'Nutze die Neumond-Energie für neue Projekte und das erste Viertel für Entscheidungen.',
        rituals: ['Energie-Manifestation', 'Projekt-Planung', 'Aktions-Listen erstellen']
      },
      'Generator': {
        optimal_phases: ['Zunehmender Sichelmond', 'Zunehmender Gibbous'],
        advice: 'Fokussiere dich auf Wachstum und Verfeinerung in den zunehmenden Phasen.',
        rituals: ['Energie-Aufladung', 'Fähigkeiten-Entwicklung', 'Detailarbeit']
      },
      'Manifestor': {
        optimal_phases: ['Erstes Viertel', 'Vollmond'],
        advice: 'Nutze die starken Phasen für Führung und Manifestation.',
        rituals: ['Entscheidungsfindung', 'Projekt-Initiation', 'Energie-Management']
      },
      'Projector': {
        optimal_phases: ['Zunehmender Sichelmond', 'Abnehmender Gibbous'],
        advice: 'Nutze die Beobachtungsphasen für Analyse und Weitergabe von Wissen.',
        rituals: ['Beobachtung', 'Analyse', 'Weisheit teilen']
      },
      'Reflector': {
        optimal_phases: ['Abnehmender Sichelmond', 'Neumond'],
        advice: 'Nutze die ruhigen Phasen für Reflexion und Regeneration.',
        rituals: ['Reflexion', 'Regeneration', 'Zyklus-Review']
      }
    };

    const recommendations = hdRecommendations[hd_type as keyof typeof hdRecommendations] || {
      optimal_phases: ['Vollmond', 'Neumond'],
      advice: 'Nutze die wichtigsten Mondphasen für deine Entwicklung.',
      rituals: ['Meditation', 'Reflexion', 'Energiearbeit']
    };

    res.json({
      hd_type,
      recommendations,
      current_phase: (await calculateMoonPhaseWithNASA(new Date())).name,
      is_optimal_phase: recommendations.optimal_phases.includes((await calculateMoonPhaseWithNASA(new Date())).name)
    });
  } catch (error) {
    console.error('Fehler beim Laden der Human Design Empfehlungen:', error);
    res.status(500).json({ error: 'Fehler beim Laden der Human Design Empfehlungen' });
  }
});

// Hilfsfunktion für Tracking-Statistiken
function calculateTrackingStats(trackingData: MoonTracking[]) {
  if (trackingData.length === 0) {
    return {
      total_entries: 0,
      average_mood: 0,
      average_energy: 0,
      most_common_phase: null,
      phase_correlations: {}
    };
  }

  const totalEntries = trackingData.length;
  const averageMood = trackingData.reduce((sum, entry) => sum + entry.mood, 0) / totalEntries;
  const averageEnergy = trackingData.reduce((sum, entry) => sum + entry.energy, 0) / totalEntries;

  // Häufigste Mondphase
  const phaseCounts: { [key: string]: number } = {};
  trackingData.forEach(entry => {
    phaseCounts[entry.moon_phase] = (phaseCounts[entry.moon_phase] || 0) + 1;
  });
  const mostCommonPhase = Object.keys(phaseCounts).reduce((a, b) => 
    phaseCounts[a] > phaseCounts[b] ? a : b
  );

  // Korrelationen zwischen Phasen und Stimmung/Energie
  const phaseCorrelations: { [key: string]: { mood: number, energy: number, count: number } } = {};
  trackingData.forEach(entry => {
    if (!phaseCorrelations[entry.moon_phase]) {
      phaseCorrelations[entry.moon_phase] = { mood: 0, energy: 0, count: 0 };
    }
    phaseCorrelations[entry.moon_phase].mood += entry.mood;
    phaseCorrelations[entry.moon_phase].energy += entry.energy;
    phaseCorrelations[entry.moon_phase].count += 1;
  });

  // Durchschnitte berechnen
  Object.keys(phaseCorrelations).forEach(phase => {
    const data = phaseCorrelations[phase];
    data.mood = data.mood / data.count;
    data.energy = data.energy / data.count;
  });

  return {
    total_entries: totalEntries,
    average_mood: Math.round(averageMood * 10) / 10,
    average_energy: Math.round(averageEnergy * 10) / 10,
    most_common_phase: mostCommonPhase,
    phase_correlations: phaseCorrelations
  };
}

// NEUE ENDPOINTS FÜR ERWEITERTE FEATURES:

// GET /moon-calendar/stories - Mond-Geschichten abrufen (geschützt)
router.get('/stories', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { moon_phase, culture } = req.query;
    
    let filteredStories = moonStories;
    
    if (moon_phase) {
      filteredStories = filteredStories.filter(story => 
        story.moon_phase.toLowerCase() === moon_phase.toString().toLowerCase()
      );
    }
    
    if (culture) {
      filteredStories = filteredStories.filter(story => 
        story.culture.toLowerCase().includes(culture.toString().toLowerCase())
      );
    }
    
    res.json({
      stories: filteredStories,
      total: filteredStories.length
    });
  } catch (error) {
    console.error('Fehler beim Laden der Mond-Geschichten:', error);
    res.status(500).json({ error: 'Fehler beim Laden der Mond-Geschichten' });
  }
});

// GET /moon-calendar/stories/:id - Einzelne Mond-Geschichte
router.get('/stories/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const story = moonStories.find(s => s.id === id);
    
    if (!story) {
      return res.status(404).json({ error: 'Geschichte nicht gefunden' });
    }
    
    res.json(story);
  } catch (error) {
    console.error('Fehler beim Laden der Geschichte:', error);
    res.status(500).json({ error: 'Fehler beim Laden der Geschichte' });
  }
});

// GET /moon-calendar/plant-rituals - Pflanzen-Rituale abrufen
router.get('/plant-rituals', async (req: Request, res: Response) => {
  try {
    const { moon_phase, plant_type } = req.query;
    
    let filteredRituals = plantRituals;
    
    if (moon_phase) {
      filteredRituals = filteredRituals.filter(ritual => 
        ritual.moon_phase.toLowerCase() === moon_phase.toString().toLowerCase()
      );
    }
    
    if (plant_type) {
      filteredRituals = filteredRituals.filter(ritual => 
        ritual.plants.some(plant => 
          plant.toLowerCase().includes(plant_type.toString().toLowerCase())
        )
      );
    }
    
    res.json({
      rituals: filteredRituals,
      total: filteredRituals.length
    });
  } catch (error) {
    console.error('Fehler beim Laden der Pflanzen-Rituale:', error);
    res.status(500).json({ error: 'Fehler beim Laden der Pflanzen-Rituale' });
  }
});

// GET /moon-calendar/health-guidance - Gesundheit und Ernährung
router.get('/health-guidance', async (req: Request, res: Response) => {
  try {
    const { moon_phase } = req.query;
    
    let filteredGuidance = healthGuidance;
    
    if (moon_phase) {
      filteredGuidance = filteredGuidance.filter(guidance => 
        guidance.moon_phase.toLowerCase() === moon_phase.toString().toLowerCase()
      );
    }
    
    res.json({
      guidance: filteredGuidance,
      total: filteredGuidance.length
    });
  } catch (error) {
    console.error('Fehler beim Laden der Gesundheits-Empfehlungen:', error);
    res.status(500).json({ error: 'Fehler beim Laden der Gesundheits-Empfehlungen' });
  }
});

// GET /moon-calendar/yearly/:year - Kompletter Jahreskalender
router.get('/yearly/:year', async (req: Request, res: Response) => {
  try {
    const { year } = req.params;
    const yearNum = parseInt(year);
    
    if (isNaN(yearNum) || yearNum < 1900 || yearNum > 2100) {
      return res.status(400).json({ error: 'Ungültiges Jahr' });
    }
    
    const yearlyCalendar: any[] = [];
    
    // Generiere alle Tage des Jahres
    for (let month = 0; month < 12; month++) {
      const daysInMonth = new Date(yearNum, month + 1, 0).getDate();
      
      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(yearNum, month, day);
        const moonPhase = await calculateMoonPhaseWithNASA(date);
        
        // Finde passende Geschichten, Rituale und Gesundheitsempfehlungen
        const dayStories = moonStories.filter(story => 
          story.moon_phase === moonPhase.name
        );
        
        const dayRituals = plantRituals.filter(ritual => 
          ritual.moon_phase === moonPhase.name
        );
        
        const dayHealth = healthGuidance.find(guidance => 
          guidance.moon_phase === moonPhase.name
        );
        
        yearlyCalendar.push({
          date: date.toISOString().split('T')[0],
          day: day,
          month: month + 1,
          year: yearNum,
          dayOfWeek: date.getDay(),
          moonPhase: {
            name: moonPhase.name,
            icon: moonPhase.icon,
            energy: moonPhase.energy,
            color: moonPhase.color,
            advice: moonPhase.advice
          },
          stories: dayStories.slice(0, 2), // Max 2 Geschichten pro Tag
          rituals: dayRituals.slice(0, 1), // Max 1 Ritual pro Tag
          health: dayHealth,
          isSpecialDay: isSpecialMoonDay(date, moonPhase.name)
        });
      }
    }
    
    res.json({
      year: yearNum,
      totalDays: yearlyCalendar.length,
      calendar: yearlyCalendar,
      summary: {
        phases: getPhaseDistribution(yearlyCalendar),
        specialDays: yearlyCalendar.filter(day => day.isSpecialDay).length
      }
    });
  } catch (error) {
    console.error('Fehler beim Laden des Jahreskalenders:', error);
    res.status(500).json({ error: 'Fehler beim Laden des Jahreskalenders' });
  }
});

// GET /moon-calendar/monthly/:year/:month - Detaillierter Monatskalender (geschützt)
router.get('/monthly/:year/:month', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { year, month } = req.params;
    const yearNum = parseInt(year);
    const monthNum = parseInt(month) - 1;
    
    if (isNaN(yearNum) || isNaN(monthNum) || monthNum < 0 || monthNum > 11) {
      return res.status(400).json({ error: 'Ungültiges Jahr oder Monat' });
    }
    
    const daysInMonth = new Date(yearNum, monthNum + 1, 0).getDate();
    const monthlyCalendar: any[] = [];
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(yearNum, monthNum, day);
      const moonPhase = await calculateMoonPhaseWithNASA(date);
      
      // Erweiterte Informationen für jeden Tag
      const dayInfo = {
        date: date.toISOString().split('T')[0],
        day: day,
        dayOfWeek: date.getDay(),
        dayName: date.toLocaleDateString('de-DE', { weekday: 'long' }),
        moonPhase: {
          name: moonPhase.name,
          icon: moonPhase.icon,
          energy: moonPhase.energy,
          color: moonPhase.color,
          advice: moonPhase.advice,
          explanation: moonPhase.explanation,
          reflectionExercises: moonPhase.reflectionExercises,
          moonRituals: moonPhase.moonRituals,
          humanDesignConnection: moonPhase.humanDesignConnection
        },
        plantRituals: plantRituals.filter(ritual => ritual.moon_phase === moonPhase.name),
        healthGuidance: healthGuidance.find(guidance => guidance.moon_phase === moonPhase.name),
        stories: moonStories.filter(story => story.moon_phase === moonPhase.name),
        isWeekend: date.getDay() === 0 || date.getDay() === 6,
        isSpecialDay: isSpecialMoonDay(date, moonPhase.name)
      };
      
      monthlyCalendar.push(dayInfo);
    }
    
    res.json({
      year: yearNum,
      month: monthNum + 1,
      monthName: new Date(yearNum, monthNum).toLocaleDateString('de-DE', { month: 'long' }),
      totalDays: monthlyCalendar.length,
      calendar: monthlyCalendar,
      phaseSummary: getPhaseDistribution(monthlyCalendar)
    });
  } catch (error) {
    console.error('Fehler beim Laden des Monatskalenders:', error);
    res.status(500).json({ error: 'Fehler beim Laden des Monatskalenders' });
  }
});

// Hilfsfunktionen
function isSpecialMoonDay(date: Date, moonPhase: string): boolean {
  // Besondere Tage: Vollmond, Neumond, Sonnenwenden, Tagundnachtgleichen
  const specialPhases = ['Vollmond', 'Neumond'];
  const month = date.getMonth();
  const day = date.getDate();
  
  // Sonnenwenden und Tagundnachtgleichen (ungefähr)
  const specialDates = [
    { month: 2, day: 20 }, // Frühlings-Tagundnachtgleiche
    { month: 5, day: 21 }, // Sommersonnenwende
    { month: 8, day: 22 }, // Herbst-Tagundnachtgleiche
    { month: 11, day: 21 } // Wintersonnenwende
  ];
  
  return specialPhases.includes(moonPhase) || 
         specialDates.some(special => 
           Math.abs(month - special.month) <= 1 && Math.abs(day - special.day) <= 3
         );
}

function getPhaseDistribution(calendar: any[]): Record<string, number> {
  const distribution: Record<string, number> = {};
  
  calendar.forEach(day => {
    const phase = day.moonPhase.name;
    distribution[phase] = (distribution[phase] || 0) + 1;
  });
  
  return distribution;
}

// GET /moon-calendar/gate-details - Alle Gate-Details abrufen
router.get('/gate-details', async (req: Request, res: Response) => {
  try {
    const { gate_id, status, center } = req.query;
    
    let filteredGates = gateDetails;
    
    if (gate_id) {
      filteredGates = filteredGates.filter(gate => gate.id === parseInt(gate_id.toString()));
    }
    
    if (status) {
      filteredGates = filteredGates.filter(gate => gate.status === status);
    }
    
    if (center) {
      filteredGates = filteredGates.filter(gate => 
        gate.center.toLowerCase().includes(center.toString().toLowerCase())
      );
    }
    
    res.json({
      gates: filteredGates,
      total: filteredGates.length
    });
  } catch (error) {
    console.error('Fehler beim Laden der Gate-Details:', error);
    res.status(500).json({ error: 'Fehler beim Laden der Gate-Details' });
  }
});

// GET /moon-calendar/gate-details/:id - Einzelnes Gate-Detail
router.get('/gate-details/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const gate = gateDetails.find(g => g.id === parseInt(id));
    
    if (!gate) {
      return res.status(404).json({ error: 'Gate nicht gefunden' });
    }
    
    res.json(gate);
  } catch (error) {
    console.error('Fehler beim Laden des Gate-Details:', error);
    res.status(500).json({ error: 'Fehler beim Laden des Gate-Details' });
  }
});

export default router;
