'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Tabs,
  Tab,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Divider,
  Card,
  CardContent,
  Alert,
  Tooltip
} from '@mui/material';
import {
  Save,
  FileDown,
  Eye,
  Plus,
  ChevronDown,
  Copy,
  Book,
  User,
  Calculator,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import Image from 'next/image';
import { 
  getGateAndLine, 
  getGateName,
  calculateCompleteChart,
  parseBirthDateTime,
  calculateProfile,
  getProfileInfo,
  findActivatedChannels,
  formatChannels,
  collectActiveGates,
  calculateCenters,
  getCenterDescription,
  calculateIncarnationCross,
  formatIncarnationCross,
  calculateTypeAndAuthority,
  calculateCircuits,
  getDominantCircuitGroup,
  calculateVariables,
  formatVariables,
  analyzeConnectionKey as analyzeConnectionKeyLogic,
  formatConnectionKeyAnalysis,
  CROSS_TYPE_ICONS,
  TYPE_ICONS,
  AUTHORITY_ICONS,
  STRATEGY_ICONS,
  NOT_SELF_ICONS,
  SIGNATURE_ICONS,
  DEFINITION_ICONS,
  CIRCUIT_ICONS,
  CIRCUIT_GROUP_ICONS,
  CIRCUITS,
  VARIABLE_ICONS,
  COGNITION_DESCRIPTIONS,
  type HumanDesignPlanets,
  type Channel,
  type CenterStatus,
  type IncarnationCrossData,
  type TypeAuthorityResult,
  type CircuitResult,
  type VariableData,
  type ConnectionKeyAnalysis
} from '@/lib/human-design';
import { 
  calculateApproximateSunPosition, 
  calculateEarthPosition,
  calculateDesignSun,
  calculateDesignEarth,
  getZodiacSign,
  EPHEMERIS_DISCLAIMER
} from '@/lib/human-design/simplified-ephemeris';

interface ReadingData {
  // Persönliche Daten (readingType ist jetzt separater State)
  name: string;
  geschlecht: string;
  geburtsdatum: string;
  geburtszeit: string;
  geburtsort: string;
  
  // Human Design Daten
  typ: string;
  strategie: string;
  signatur: string;
  nichtSelbst: string;
  profil: string;
  autoritaet: string;
  definition: string;
  inkarnationskreuz: string;
  
  // Sonnen und Erden
  bewussteSonne: string;
  bewussteErde: string;
  unbewussteSonne: string;
  unbewussteErde: string;
  
  // Zentren
  krone: string;
  ajna: string;
  kehle: string;
  gZentrum: string;
  herzEgo: string;
  sakral: string;
  solarplexus: string;
  milz: string;
  wurzel: string;
  
  // Kanäle
  kanaele: string;
  
  // Planeten
  sonne: string;
  mond: string;
  merkur: string;
  venus: string;
  mars: string;
  jupiter: string;
  saturn: string;
  suedknoten: string;
  nordknoten: string;
}

// Interface für Person 2 bei Connection Key
interface Person2Data {
  name: string;
  geschlecht: string;
  geburtsdatum: string;
  geburtszeit: string;
  geburtsort: string;
  typ: string;
  profil: string;
  autoritaet: string;
  definiertezentren: string;
  offenezentren: string;
  definierteTore: string;
}

interface GateInfo {
  gate: number;
  line: number;
  formatted: string;
  name: string;
}

interface CalculatedGates {
  personalitySun: GateInfo | null;
  personalityEarth: GateInfo | null;
  designSun: GateInfo | null;
  designEarth: GateInfo | null;
  zodiacInfo: {
    personalitySun: string;
    designSun: string;
  };
  // Profile, Channels, Centers, Incarnation Cross, Type and Authority, Circuits
  profile?: string; // e.g. "1/3"
  profileInfo?: { name: string; description: string; keywords: string[] } | null;
  channels?: Channel[];
  centers?: CenterStatus;
  incarnationCross?: IncarnationCrossData;
  typeAuthority?: TypeAuthorityResult;
  circuits?: CircuitResult[];
  variables?: VariableData;
  // Extended planets (only for precise calculation)
  personality?: {
    moon?: GateInfo | null;
    mercury?: GateInfo | null;
    venus?: GateInfo | null;
    mars?: GateInfo | null;
    jupiter?: GateInfo | null;
    saturn?: GateInfo | null;
    northNode?: GateInfo | null;
    southNode?: GateInfo | null;
  };
  design?: {
    moon?: GateInfo | null;
    mercury?: GateInfo | null;
    venus?: GateInfo | null;
    mars?: GateInfo | null;
    jupiter?: GateInfo | null;
    saturn?: GateInfo | null;
    northNode?: GateInfo | null;
    southNode?: GateInfo | null;
  };
}

// Textbausteine für verschiedene Kategorien
const textbausteine = {
  typ: {
    Generator: "Als Generator bist du die Lebenskraft dieser Welt. Deine Energie ist nachhaltig, beständig und magnetisch. Wenn du auf das wartest, was dich wirklich ruft, entfaltet sich deine volle Kraft.",
    "Manifestierender Generator": "Als Manifestierender Generator verbindest du die kraftvolle Energie des Generators mit der Initiationsgabe des Manifestors. Du bist hier, um zu antworten und dann schnell zu handeln – multitaskingfähig und effizient.",
    Manifestor: "Als Manifestor bist du hier, um zu initiieren. Deine Energie bewegt sich in Wellen – kraftvoll und unabhängig. Wenn du informierst, bevor du handelst, fließt dein Weg leichter.",
    Projektor: "Als Projektor bist du hier, um zu sehen und zu leiten. Deine Gabe ist Wahrnehmung. Wenn du auf die Einladung wartest, wird deine Weisheit erkannt und geschätzt.",
    Reflektor: "Als Reflektor bist du der Spiegel der Welt. Du nimmst alles wahr und reflektierst die Qualität deiner Umgebung. Deine Klarheit entsteht über Zeit und im Zyklus des Mondes."
  },
  autoritaet: {
    "Sakrale Autorität": "Dein Sakral antwortet im Moment – ein klares Ja oder Nein aus deinem Bauch. Diese Stimme ist älter als dein Verstand und weiser als jede Logik.",
    "Emotionale Autorität": "Deine Klarheit braucht Zeit. Die Welle deiner Gefühle trägt Wahrheit in sich. Warte, bis die Emotion sich setzt, dann zeigt sich der richtige Weg.",
    "Milz-Autorität": "Deine Milz flüstert leise, im Jetzt. Es ist ein spontanes Wissen, ein Instinkt, der nur einmal spricht. Vertraue diesem ersten Impuls.",
    "Ego-Autorität": "Dein Herz weiß, was es will. Es spricht durch Willenskraft und Selbstwert. Wenn dein Ego sich verpflichtet, ist die Entscheidung klar.",
    "Selbst-projizierte Autorität": "Deine Wahrheit entsteht, wenn du sprichst. Im Dialog mit anderen erkennst du, was stimmig ist. Deine Stimme führt dich.",
    "Mentale Autorität": "Als Projektor mit mentalem inneren Raum brauchst du andere, um Klarheit zu finden. Deine Gedanken brauchen Resonanz, nicht Einsamkeit.",
    "Lunare Autorität": "Als Reflektor entscheidest du mit dem Mond. 29 Tage Zeit geben dir Abstand, Perspektive und Klarheit. Überstürze nichts."
  },
  profil: {
    "1/3": "Der Ermittler/Märtyrer – Du erforschst das Leben durch direktes Erleben. Deine Fundamente sind fest, deine Experimente mutig. Fehler sind für dich Lernschritte.",
    "1/4": "Der Ermittler/Opportunist – Du baust auf solidem Wissen auf und teilst es durch deine Verbindungen. Dein Netzwerk ist dein Fundament.",
    "2/4": "Der Eremit/Opportunist – Du ziehst dich zurück, um deine Gaben zu entwickeln, und trittst durch Beziehungen wieder hervor. Deine Talente sind natürlich.",
    "2/5": "Der Eremit/Häretiker – Du bist das verborgene Talent mit der praktischen Lösung. Menschen projizieren Erwartungen auf dich – du musst lernen, sie zu erfüllen oder zu klären.",
    "3/5": "Der Märtyrer/Häretiker – Du lernst durch Trial-and-Error und bietest pragmatische Lösungen an. Deine Fehler werden zu universeller Weisheit.",
    "3/6": "Der Märtyrer/Rollenvorbild – Dein Leben hat drei Phasen: Experimentieren, Rückzug und Blüte. Du bist hier, um durch Erfahrung zu lehren.",
    "4/6": "Der Opportunist/Rollenvorbild – Du baust durch Netzwerke und reifst zu einem objektiven Beobachter. Deine Beziehungen tragen dich durchs Leben.",
    "4/1": "Der Opportunist/Ermittler – Du verbindest Menschen mit solidem Wissen. Dein Einfluss entsteht durch stabile Grundlagen und Gemeinschaft.",
    "5/1": "Der Häretiker/Ermittler – Du bietest universelle Lösungen auf festem Fundament. Menschen erwarten von dir Antworten – du lieferst sie mit Tiefe.",
    "5/2": "Der Häretiker/Eremit – Du wirst gerufen, um Probleme zu lösen, ziehst dich dann zurück. Deine Gabe ist Projektion und natürliche Exzellenz.",
    "6/2": "Der Rollenvorbild/Eremit – Nach einer Phase der Erfahrung und des Rückzugs trittst du als Vorbild hervor. Deine natürlichen Talente reifen mit der Zeit.",
    "6/3": "Der Rollenvorbild/Märtyrer – Dein Leben ist geprägt von Experimenten, Rückzug und Weisheit. Du lehrst durch dein gelebtes Beispiel."
  },
  zentren: {
    definiert: "Hier bist du verlässlich. Diese Energie ist konstant in dir vorhanden – dein festes Fundament.",
    offen: "Hier bist du empfänglich. Du nimmst die Energie anderer auf, verstärkst sie und lernst durch sie. Diese Offenheit ist keine Schwäche, sondern Weisheit.",
    undefiniert: "Hier gibt es keine feste Struktur. Du erlebst diese Energie in Wellen, abhängig von deiner Umgebung. Hier liegt großes Lernpotenzial."
  },
  zentrenSpezifisch: {
    krone: {
      definiert: "Deine Krone ist definiert – du hast konstanten Zugang zu mentaler Inspiration und Druck. Deine Gedanken entstehen aus dir selbst heraus.",
      offen: "Deine offene Krone nimmt Inspiration von außen auf. Du kannst viele Perspektiven verstehen, ohne an sie gebunden zu sein. Achte darauf, nicht im Denkdruck anderer gefangen zu werden.",
      undefiniert: "Deine undefinierte Krone ist völlig offen für mentale Impulse von außen. Du erlebst Denken in verschiedensten Formen. Nicht jeder Gedanke gehört dir."
    },
    ajna: {
      definiert: "Dein Ajna ist definiert – du hast eine feste Art zu denken und Konzepte zu verarbeiten. Deine mentale Perspektive ist verlässlich und konsistent.",
      offen: "Dein offenes Ajna nimmt unterschiedliche Denkmuster wahr. Du kannst flexibel denken und verschiedene Standpunkte einnehmen. Sei achtsam, nicht in fremde Überzeugungen zu verfallen.",
      undefiniert: "Dein undefiniertes Ajna ist ein offenes Tor für alle mentalen Konzepte. Du erlebst Denken als etwas Wandelbares – nutze das als Weisheit, nicht als Unsicherheit."
    },
    kehle: {
      definiert: "Deine Kehle ist definiert – du hast eine konstante Art zu kommunizieren oder zu handeln. Deine Stimme und dein Ausdruck sind verlässlich.",
      offen: "Deine offene Kehle ist empfänglich für verschiedene Ausdrucksformen. Du kannst flexibel kommunizieren, aber achte darauf, nicht zu viel zu reden, um Aufmerksamkeit zu bekommen.",
      undefiniert: "Deine undefinierte Kehle erlebt Ausdruck in vielen Formen. Du bist hier, um zu lernen, wann Sprechen oder Handeln wirklich angemessen ist."
    },
    gZentrum: {
      definiert: "Dein G-Zentrum ist definiert – du hast eine klare Richtung und Identität. Dein Selbst ist stabil und verlässlich.",
      offen: "Dein offenes G-Zentrum ist flexibel in Identität und Richtung. Du kannst dich anpassen und verschiedene Rollen einnehmen. Achte darauf, nicht deine Identität in anderen zu suchen.",
      undefiniert: "Dein undefiniertes G-Zentrum erlebt Identität als etwas Fließendes. Du bist hier, um zu lernen, dass dein Selbst nicht an einen Ort oder eine Rolle gebunden ist."
    },
    herzEgo: {
      definiert: "Dein Herz-Ego ist definiert – du hast konstanten Zugang zu Willenskraft und Selbstwert. Deine Versprechen sind verlässlich.",
      offen: "Dein offenes Herz-Ego nimmt Willenskraft von außen auf. Du kannst dich für andere beweisen wollen. Lerne, dass dein Wert nicht von Leistung abhängt.",
      undefiniert: "Dein undefiniertes Herz-Ego erlebt Willenskraft in Wellen. Du bist hier, um zu lernen, dass du nichts beweisen musst – dein Wert ist inhärent."
    },
    sakral: {
      definiert: "Dein Sakral ist definiert – du bist eine Lebenskraft-Batterie mit nachhaltiger Energie. Dein Körper weiß, wofür es sich zu arbeiten lohnt.",
      offen: "Dein offenes Sakral nimmt Lebenskraft von außen auf. Du verstärkst die Energie anderer, hast aber keine eigene konstante. Achte auf Überarbeitung und lerne, wann genug ist.",
      undefiniert: "Dein undefiniertes Sakral erlebt Energie in unvorhersehbaren Wellen. Du bist nicht hier, um konstant zu arbeiten – deine Weisheit liegt im Wissen, wann Pause nötig ist."
    },
    solarplexus: {
      definiert: "Dein Solarplexus ist definiert – du erlebst emotionale Wellen als konstanten Teil deines Seins. Deine Gefühle sind deine Wahrheit und brauchen Zeit zur Klarheit.",
      offen: "Dein offener Solarplexus nimmt Emotionen anderer auf und verstärkt sie. Du bist empathisch, aber achte darauf, nicht Emotionen festzuhalten, die nicht deine sind.",
      undefiniert: "Dein undefinierter Solarplexus erlebt Emotionen als etwas Vorübergehendes. Du bist hier, um emotionale Weisheit zu entwickeln – nicht durch Festhalten, sondern durch Beobachten."
    },
    milz: {
      definiert: "Deine Milz ist definiert – du hast konstanten Zugang zu Intuition und Instinkt. Dein Körper warnt dich im Moment vor Gefahr.",
      offen: "Deine offene Milz nimmt Gesundheit und Sicherheit von außen wahr. Du kannst dich festhalten an Menschen oder Situationen aus Angst. Lerne, deiner Flexibilität zu vertrauen.",
      undefiniert: "Deine undefinierte Milz erlebt Intuition in verschiedenen Formen. Du bist hier, um Weisheit über Gesundheit und Sicherheit zu sammeln – ohne dich an Angst zu klammern."
    },
    wurzel: {
      definiert: "Deine Wurzel ist definiert – du hast konstanten Zugang zu Antrieb und Adrenalin. Dein Druck, etwas zu tun, ist verlässlich und produktiv.",
      offen: "Deine offene Wurzel nimmt Druck von außen auf und verstärkt ihn. Du kannst dich gehetzt fühlen. Lerne, dass nicht jeder Druck dir gehört.",
      undefiniert: "Deine undefinierte Wurzel erlebt Druck in Wellen. Du bist hier, um zu lernen, dass Stress optional ist – deine Weisheit liegt in der Gelassenheit."
    }
  },
  kanaele: {
    "1-8": "Der Kanal der Inspiration – Die kreative Rolle. Du bist hier, um durch dein einzigartiges Selbst zu inspirieren und Neues zu modellieren.",
    "2-14": "Der Kanal des Pulses – Die Alchemie des Schicksals. Deine Energie kommt in Wellen und bringt Wohlstand durch den richtigen Rhythmus.",
    "3-60": "Der Kanal der Mutation – Der Puls der Veränderung. Du bist hier, um durch Veränderung und Einschränkung zu neuen Formaten zu finden.",
    "4-63": "Der Kanal der Logik – Das Gehirn. Du bist hier, um Muster zu erkennen, Zweifel zu hinterfragen und durch logisches Denken Klarheit zu schaffen.",
    "5-15": "Der Kanal des Rhythmus – Der Flow. Dein Leben folgt einem natürlichen Rhythmus – du bist hier, um dich in den universellen Flow einzufinden.",
    "6-59": "Der Kanal der Paarung – Die Intimität. Du bringst Menschen zusammen und schaffst tiefe, vertrauensvolle Verbindungen.",
    "7-31": "Der Kanal des Alpha – Die Führung. Du bist hier, um zu führen – durch deine Stimme und deine Richtung, wenn du eingeladen wirst.",
    "9-52": "Der Kanal der Konzentration – Die Fokussierung. Du hast die Gabe, dich tief auf Details zu konzentrieren und dabei die Ausdauer zu bewahren.",
    "10-20": "Der Kanal des Erwachens – Das Jetzt. Du lebst im gegenwärtigen Moment und bringst Bewusstsein ins Hier und Jetzt.",
    "10-34": "Der Kanal der Erforschung – Die Kraft des Selbst. Du bist hier, um deine eigene Kraft zu erforschen und kraftvoll im Jetzt zu handeln.",
    "10-57": "Der Kanal der Perfektion – Das intuitive Überleben. Deine Intuition ist direkt mit der Gegenwart verbunden – du weißt instinktiv, was jetzt richtig ist.",
    "11-56": "Der Kanal der Neugier – Der Suchende. Du bist hier, um Geschichten zu erzählen und durch Erfahrung Stimulation zu finden.",
    "12-22": "Der Kanal der Offenheit – Der soziale Rhythmus. Du öffnest emotionale Türen und bringst Menschen zusammen durch emotionale Verfügbarkeit.",
    "13-33": "Der Kanal des Prodigals – Der Zeuge. Du sammelst Erfahrungen und ziehst dich zurück, um sie zu reflektieren und zu teilen.",
    "16-48": "Der Kanal der Wellenlänge – Talent und Tiefe. Du hast Talent, das durch Übung und Tiefe zur Meisterschaft wird.",
    "17-62": "Der Kanal der Akzeptanz – Das organisierende Bewusstsein. Du bringst Ordnung durch akzeptierte Details und logische Organisation.",
    "18-58": "Der Kanal des Urteils – Die Korrektur. Du erkennst, was nicht perfekt ist, und bringst Freude durch Verbesserung.",
    "19-49": "Der Kanal der Sensitivität – Die Synthese. Du bist hochsensibel für die Bedürfnisse anderer und bringst emotionale Prinzipien ein.",
    "20-34": "Der Kanal des Charisma – Das Busy-Sein. Du bist ein kraftvoller Macher, der im Jetzt aktiv ist und andere durch deine Energie bewegst.",
    "20-57": "Der Kanal des Gehirns – Das intuitive Bewusstsein. Du verbindest Intuition mit dem gegenwärtigen Moment und handelst aus deinem instinktiven Wissen heraus.",
    "21-45": "Der Kanal des Geldes – Die Materialisten. Du hast die Kontrolle über materielle Ressourcen und bringst sie in die Gemeinschaft ein.",
    "23-43": "Der Kanal der Strukturierung – Das individuelle Wissen. Du bringst einzigartige Einsichten und Durchbrüche – wenn die Zeit reif ist.",
    "24-61": "Der Kanal des Bewusstseins – Der Denker. Du denkst tief nach und bringst innere Wahrheit durch wiederholte Reflexion zum Ausdruck.",
    "25-51": "Der Kanal der Initiation – Der Krieger. Du begegnest Herausforderungen mit Mut und initiierst durch den Geist.",
    "26-44": "Der Kanal des Übermittlers – Die Energie des Stammes. Du verkaufst und überzeugst durch instinktive Wahrnehmung und Geschick.",
    "27-50": "Der Kanal der Bewahrung – Der Wächter. Du bist verantwortlich für die Werte und Strukturen der Gemeinschaft – du bewahrst, was wichtig ist.",
    "28-38": "Der Kanal des Kämpfers – Der Sturheit. Du kämpfst für das, was Bedeutung hat, und gibst nicht auf, bis du den Sinn gefunden hast.",
    "29-46": "Der Kanal der Entdeckung – Der Erfolg. Du sagst Ja zu neuen Erfahrungen und findest dadurch Erfolg und Liebe zum Leben.",
    "30-41": "Der Kanal der Anerkennung – Der Träumer. Du fühlst die Sehnsucht nach neuen Erfahrungen und trägst Fantasien, die zu Manifestationen werden können.",
    "32-54": "Der Kanal der Transformation – Die Ambition. Du bist ehrgeizig und treibst Transformation durch deinen Aufstieg voran.",
    "34-57": "Der Kanal der Kraft – Das kraftvolle Überleben. Du verbindest Kraft mit Intuition – deine Power ist instinktiv und direkt.",
    "35-36": "Der Kanal der Vergänglichkeit – Das Abenteuer. Du lebst für Erfahrungen und Veränderung – dein Leben ist ein emotionales Abenteuer.",
    "37-40": "Der Kanal der Gemeinschaft – Das Geschäft. Du sorgst für die Gemeinschaft und verhandelst für das Wohl aller.",
    "39-55": "Der Kanal der Emotionalität – Der Stimmungsmacher. Du bewegst Emotionen und bringst Geist durch provokative emotionale Wellen.",
    "42-53": "Der Kanal der Reifung – Die Zyklen. Du verstehst, dass alles seine Zeit braucht – Anfang, Entwicklung, Reife und Vollendung.",
    "47-64": "Der Kanal der Abstraktion – Die mentale Aktivität. Du denkst in abstrakten Konzepten und verbindest Vergangenheit mit Zukunft durch mentale Klarheit."
  }
};

export default function ReadingCreatorPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [readingType, setReadingType] = useState('erweitert');
  const [readingData, setReadingData] = useState<ReadingData>({
    name: '',
    geschlecht: '',
    geburtsdatum: '',
    geburtszeit: '',
    geburtsort: '',
    typ: '',
    strategie: '',
    signatur: '',
    nichtSelbst: '',
    profil: '',
    autoritaet: '',
    definition: '',
    inkarnationskreuz: '',
    bewussteSonne: '',
    bewussteErde: '',
    unbewussteSonne: '',
    unbewussteErde: '',
    krone: '',
    ajna: '',
    kehle: '',
    gZentrum: '',
    herzEgo: '',
    sakral: '',
    solarplexus: '',
    milz: '',
    wurzel: '',
    kanaele: '',
    sonne: '',
    mond: '',
    merkur: '',
    venus: '',
    mars: '',
    jupiter: '',
    saturn: '',
    suedknoten: '',
    nordknoten: ''
  });
  
  // State für Person 2 (nur bei Connection Key)
  const [person2Data, setPerson2Data] = useState<Person2Data>({
    name: '',
    geschlecht: '',
    geburtsdatum: '',
    geburtszeit: '',
    geburtsort: '',
    typ: '',
    profil: '',
    autoritaet: '',
    definiertezentren: '',
    offenezentren: '',
    definierteTore: ''
  });
  
  const [showPreview, setShowPreview] = useState(false);
  const [showTextbausteine, setShowTextbausteine] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [calculatedGates, setCalculatedGates] = useState<CalculatedGates | null>(null);
  const [showCalculator, setShowCalculator] = useState(false);
  const [previewText, setPreviewText] = useState('');
  const [customTextbausteine, setCustomTextbausteine] = useState<{[key: string]: string}>({});
  const [newTextbausteinTitle, setNewTextbausteinTitle] = useState('');
  const [newTextbausteinContent, setNewTextbausteinContent] = useState('');
  const [editingTextbausteinKey, setEditingTextbausteinKey] = useState<string | null>(null);
  const [usePreciseCalculation, setUsePreciseCalculation] = useState(true); // Always true now (astronomy-engine)
  const [showAllPlanets, setShowAllPlanets] = useState(false);
  const [isClient, setIsClient] = useState(false);
  
  // State für Planeten-Aktivierung (nur Sonne/Erde vs. alle 13 Planeten)
  const [useAllPlanets, setUseAllPlanets] = useState(true);
  
  // State für Connection Key Analyse
  const [connectionKeyResult, setConnectionKeyResult] = useState<ConnectionKeyAnalysis | null>(null);
  
  // State für Person 2 Gate Calculator
  const [calculatedGatesPerson2, setCalculatedGatesPerson2] = useState<CalculatedGates | null>(null);
  
  const previewRef = useRef<HTMLDivElement>(null);

  // Fix hydration error by only rendering certain parts on client
  useEffect(() => {
    setIsClient(true);
    
    // Load custom textbausteine from LocalStorage
    const saved = localStorage.getItem('customTextbausteine');
    if (saved) {
      try {
        setCustomTextbausteine(JSON.parse(saved));
      } catch (e) {
        console.error('Error loading custom textbausteine:', e);
      }
    }
  }, []);

  // Save custom textbausteine to LocalStorage whenever they change
  useEffect(() => {
    if (Object.keys(customTextbausteine).length > 0) {
      localStorage.setItem('customTextbausteine', JSON.stringify(customTextbausteine));
    }
  }, [customTextbausteine]);

  // Funktionen für eigene Textbausteine
  const addCustomTextbaustein = () => {
    if (!newTextbausteinTitle.trim() || !newTextbausteinContent.trim()) {
      alert('⚠️ Bitte Titel und Inhalt eingeben!');
      return;
    }

    const key = editingTextbausteinKey || `custom_${Date.now()}`;
    const updated = {
      ...customTextbausteine,
      [key]: JSON.stringify({ title: newTextbausteinTitle, content: newTextbausteinContent })
    };
    
    setCustomTextbausteine(updated);
    
    // Reset form
    setNewTextbausteinTitle('');
    setNewTextbausteinContent('');
    setEditingTextbausteinKey(null);
    
    alert(editingTextbausteinKey ? '✅ Textbaustein aktualisiert!' : '✅ Textbaustein gespeichert!');
  };

  const editCustomTextbaustein = (key: string) => {
    try {
      const data = JSON.parse(customTextbausteine[key]);
      setNewTextbausteinTitle(data.title);
      setNewTextbausteinContent(data.content);
      setEditingTextbausteinKey(key);
    } catch (e) {
      console.error('Fehler beim Laden des Textbausteins:', e);
    }
  };

  const deleteCustomTextbaustein = (key: string) => {
    if (!confirm('🗑️ Möchtest du diesen Textbaustein wirklich löschen?')) return;
    
    const updated = { ...customTextbausteine };
    delete updated[key];
    
    setCustomTextbausteine(updated);
    
    alert('✅ Textbaustein gelöscht!');
  };

  const cancelEdit = () => {
    setNewTextbausteinTitle('');
    setNewTextbausteinContent('');
    setEditingTextbausteinKey(null);
  };

  const handleInputChange = (field: keyof ReadingData, value: string) => {
    setReadingData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Connection Key Analyse durchführen
  const analyzeConnectionKey = () => {
    console.log('🩵 Starting Connection Key Analysis...');
    
    // Validierung
    if (!readingData.name || !person2Data.name) {
      alert('⚠️ Bitte beide Namen eingeben!');
      return;
    }
    
    // Person 1 Tore parsen (aus definierten Toren oder calculatedGates)
    const person1Gates: number[] = [];
    
    // Zuerst versuchen, aus calculatedGates zu nehmen
    if (calculatedGates?.personalitySun) {
      person1Gates.push(calculatedGates.personalitySun.gate);
    }
    if (calculatedGates?.personalityEarth) {
      person1Gates.push(calculatedGates.personalityEarth.gate);
    }
    if (calculatedGates?.designSun) {
      person1Gates.push(calculatedGates.designSun.gate);
    }
    if (calculatedGates?.designEarth) {
      person1Gates.push(calculatedGates.designEarth.gate);
    }
    
    // Wenn alle Planeten aktiviert, diese auch hinzufügen
    if (useAllPlanets && calculatedGates?.personality) {
      Object.values(calculatedGates.personality).forEach(planet => {
        if (planet?.gate) person1Gates.push(planet.gate);
      });
    }
    if (useAllPlanets && calculatedGates?.design) {
      Object.values(calculatedGates.design).forEach(planet => {
        if (planet?.gate) person1Gates.push(planet.gate);
      });
    }
    
    // Person 2 Tore parsen (aus dem Textfeld, kommasepariert)
    const person2Gates: number[] = person2Data.definierteTore
      .split(',')
      .map(s => parseInt(s.trim()))
      .filter(n => !isNaN(n) && n >= 1 && n <= 64);
    
    console.log('Person 1 Gates:', person1Gates);
    console.log('Person 2 Gates:', person2Gates);
    
    if (person1Gates.length === 0 || person2Gates.length === 0) {
      alert('⚠️ Bitte die Tore beider Personen eingeben! Person 1: Nutze den Gate Calculator. Person 2: Gib Tore kommasepariert ein.');
      return;
    }
    
    // Zentren-Status für beide Personen
    // Person 1: Aus calculatedGates
    const person1Centers: CenterStatus = calculatedGates?.centers || {
      krone: 'undefiniert',
      ajna: 'undefiniert',
      kehle: 'undefiniert',
      gZentrum: 'undefiniert',
      herzEgo: 'undefiniert',
      sakral: 'undefiniert',
      solarplexus: 'undefiniert',
      milz: 'undefiniert',
      wurzel: 'undefiniert'
    };
    
    // Person 2: Mock - in echter App würde man diese auch berechnen
    // Für jetzt: Einfaches Parsing aus den Textfeldern
    const person2Centers: CenterStatus = {
      krone: person2Data.definiertezentren.toLowerCase().includes('krone') ? 'definiert' : 'undefiniert',
      ajna: person2Data.definiertezentren.toLowerCase().includes('ajna') ? 'definiert' : 'undefiniert',
      kehle: person2Data.definiertezentren.toLowerCase().includes('kehle') ? 'definiert' : 'undefiniert',
      gZentrum: person2Data.definiertezentren.toLowerCase().includes('g-zentrum') || person2Data.definiertezentren.toLowerCase().includes('g zentrum') ? 'definiert' : 'undefiniert',
      herzEgo: person2Data.definiertezentren.toLowerCase().includes('herz') || person2Data.definiertezentren.toLowerCase().includes('ego') ? 'definiert' : 'undefiniert',
      sakral: person2Data.definiertezentren.toLowerCase().includes('sakral') ? 'definiert' : 'undefiniert',
      solarplexus: person2Data.definiertezentren.toLowerCase().includes('solarplexus') ? 'definiert' : 'undefiniert',
      milz: person2Data.definiertezentren.toLowerCase().includes('milz') ? 'definiert' : 'undefiniert',
      wurzel: person2Data.definiertezentren.toLowerCase().includes('wurzel') ? 'definiert' : 'undefiniert'
    };
    
    // Analyse durchführen
    const analysis = analyzeConnectionKeyLogic(
      person1Gates,
      person2Gates,
      person1Centers,
      person2Centers
    );
    
    console.log('✅ Connection Key Analysis Complete:', analysis);
    console.log(formatConnectionKeyAnalysis(analysis));
    
    // Ergebnis speichern
    setConnectionKeyResult(analysis);
    
    // Alert mit Zusammenfassung
    alert(`🩵 Connection Key Analyse abgeschlossen!
    
Resonanzpunkte: ${analysis.summary.totalResonancePoints}
Verbindungsstärke: ${analysis.summary.connectionStrength}%
Goldadern: ${analysis.goldenThreads.length}
    
Details siehe Console und Ergebnis-Anzeige!`);
  };

  // Helper to convert planet position to GateInfo
  const convertToGateInfo = (longitude: number): GateInfo | null => {
    const gateAndLine = getGateAndLine(longitude);
    if (!gateAndLine) return null;
    
    return {
      ...gateAndLine,
      formatted: `${gateAndLine.gate}.${gateAndLine.line}`,
      name: getGateName(gateAndLine.gate)
    };
  };

  // Calculate gates from birth date
  const calculateGates = () => {
    console.log('🔘 Button clicked!');
    
    if (!readingData.geburtsdatum) {
      alert('Bitte gib erst ein Geburtsdatum ein!');
      return;
    }

    try {
      console.log('🔍 Starting gate calculation...');
      console.log('📅 Birth date:', readingData.geburtsdatum);
      console.log('⏰ Birth time:', readingData.geburtszeit || 'not set');
      console.log('🎯 Precise calculation:', usePreciseCalculation);
      
      // Try precise calculation first, fallback to simplified
      let calculated: CalculatedGates;
      
      if (usePreciseCalculation) {
        try {
          console.log('✨ Trying astronomy-engine for precise calculation...');
          
          const birthDate = parseBirthDateTime(
            readingData.geburtsdatum,
            readingData.geburtszeit || undefined
          );
          console.log('📆 Parsed birth date:', birthDate);
          
          const chart = calculateCompleteChart(birthDate);
          console.log('📊 Chart calculated:', chart);
          
          // Format results
          calculated = {
            personalitySun: convertToGateInfo(chart.personality.sun.longitude),
            personalityEarth: convertToGateInfo(chart.personality.earth.longitude),
            designSun: convertToGateInfo(chart.design.sun.longitude),
            designEarth: convertToGateInfo(chart.design.earth.longitude),
            zodiacInfo: {
              personalitySun: getZodiacSign(chart.personality.sun.longitude),
              designSun: getZodiacSign(chart.design.sun.longitude)
            },
            personality: {
              moon: convertToGateInfo(chart.personality.moon.longitude),
              mercury: convertToGateInfo(chart.personality.mercury.longitude),
              venus: convertToGateInfo(chart.personality.venus.longitude),
              mars: convertToGateInfo(chart.personality.mars.longitude),
              jupiter: convertToGateInfo(chart.personality.jupiter.longitude),
              saturn: convertToGateInfo(chart.personality.saturn.longitude),
              northNode: convertToGateInfo(chart.personality.northNode.longitude),
              southNode: convertToGateInfo(chart.personality.southNode.longitude),
            },
            design: {
              moon: convertToGateInfo(chart.design.moon.longitude),
              mercury: convertToGateInfo(chart.design.mercury.longitude),
              venus: convertToGateInfo(chart.design.venus.longitude),
              mars: convertToGateInfo(chart.design.mars.longitude),
              jupiter: convertToGateInfo(chart.design.jupiter.longitude),
              saturn: convertToGateInfo(chart.design.saturn.longitude),
              northNode: convertToGateInfo(chart.design.northNode.longitude),
              southNode: convertToGateInfo(chart.design.southNode.longitude),
            }
          };

          // Calculate Profile (from sun lines)
          const personalitySunLine = calculated.personalitySun?.line || 0;
          const designSunLine = calculated.designSun?.line || 0;
          if (personalitySunLine && designSunLine) {
            const profile = calculateProfile(personalitySunLine, designSunLine);
            calculated.profile = profile;
            calculated.profileInfo = getProfileInfo(profile);
            console.log('✅ Profile calculated:', profile);
          }

          // Calculate Incarnation Cross (from profile and gates)
          if (calculated.profile && calculated.personalitySun && calculated.personalityEarth && calculated.designSun && calculated.designEarth) {
            const incarnationCross = calculateIncarnationCross(
              calculated.profile,
              calculated.personalitySun.gate,
              calculated.personalityEarth.gate,
              calculated.designSun.gate,
              calculated.designEarth.gate
            );
            calculated.incarnationCross = incarnationCross;
            console.log('✅ Incarnation Cross calculated:', formatIncarnationCross(incarnationCross));
          }

          // Calculate Channels (from all active gates)
          // Sammle aktivierte Tore - entweder nur Sonne/Erde oder alle Planeten
          const personalityGates = useAllPlanets ? {
            sun: calculated.personalitySun?.gate,
            earth: calculated.personalityEarth?.gate,
            moon: calculated.personality?.moon?.gate,
            mercury: calculated.personality?.mercury?.gate,
            venus: calculated.personality?.venus?.gate,
            mars: calculated.personality?.mars?.gate,
            jupiter: calculated.personality?.jupiter?.gate,
            saturn: calculated.personality?.saturn?.gate,
            northNode: calculated.personality?.northNode?.gate,
            southNode: calculated.personality?.southNode?.gate,
          } : {
            sun: calculated.personalitySun?.gate,
            earth: calculated.personalityEarth?.gate,
          };
          
          const designGates = useAllPlanets ? {
            sun: calculated.designSun?.gate,
            earth: calculated.designEarth?.gate,
            moon: calculated.design?.moon?.gate,
            mercury: calculated.design?.mercury?.gate,
            venus: calculated.design?.venus?.gate,
            mars: calculated.design?.mars?.gate,
            jupiter: calculated.design?.jupiter?.gate,
            saturn: calculated.design?.saturn?.gate,
            northNode: calculated.design?.northNode?.gate,
            southNode: calculated.design?.southNode?.gate,
          } : {
            sun: calculated.designSun?.gate,
            earth: calculated.designEarth?.gate,
          };
          
          const activeGates = collectActiveGates(personalityGates, designGates);
          console.log(`🎯 Modus: ${useAllPlanets ? 'Alle 13 Planeten' : 'Nur Sonne & Erde'} → ${activeGates.length} aktivierte Tore`);
          const channels = findActivatedChannels(activeGates);
          calculated.channels = channels;
          console.log('✅ Channels calculated:', channels.length, 'channels found');

          // Calculate Centers (from all active gates)
          const centers = calculateCenters(activeGates);
          calculated.centers = centers;
          console.log('✅ Centers calculated:', centers);

          // Calculate Type and Authority (from centers and channels)
          const typeAuthority = calculateTypeAndAuthority(centers, channels);
          calculated.typeAuthority = typeAuthority;
          console.log('✅ Type & Authority calculated:', typeAuthority.type, '/', typeAuthority.authority);

          // Calculate Circuits (from channels)
          const circuits = calculateCircuits(channels);
          calculated.circuits = circuits;
          console.log('✅ Circuits calculated:', circuits.length, 'circuits active');

          // Calculate Variables (from personality and design planets)
          const variables = calculateVariables(chart.personality, chart.design);
          calculated.variables = variables;
          console.log('✅ Variables calculated:', variables.variableType, '/', variables.cognition);

          console.log('✅ Precise calculation successful!');
          
          // DETAILED DEBUG OUTPUT
          console.log('═══════════════════════════════════════');
          console.log('🔍 COMPLETE CALCULATION RESULTS:');
          console.log('═══════════════════════════════════════');
          console.log('📅 Birth Date:', readingData.geburtsdatum, readingData.geburtszeit);
          console.log('');
          console.log('☀️ PERSONALITY (Conscious):');
          console.log('  Sun:', calculated.personalitySun?.formatted, '→', calculated.personalitySun?.gate, 'Line:', calculated.personalitySun?.line);
          console.log('  Earth:', calculated.personalityEarth?.formatted);
          console.log('');
          console.log('🌙 DESIGN (Unconscious):');
          console.log('  Sun:', calculated.designSun?.formatted, '→', calculated.designSun?.gate, 'Line:', calculated.designSun?.line);
          console.log('  Earth:', calculated.designEarth?.formatted);
          console.log('');
          console.log('👤 PROFILE:', calculated.profile);
          console.log('  From lines:', calculated.personalitySun?.line, '/', calculated.designSun?.line);
          console.log('');
          console.log('✨ INKARNATIONSKREUZ:');
          if (calculated.incarnationCross) {
            console.log('  Type:', calculated.incarnationCross.type);
            console.log('  Name:', calculated.incarnationCross.name);
            console.log('  Short:', formatIncarnationCross(calculated.incarnationCross));
            console.log('  Gates:', calculated.incarnationCross.personalitySunGate, '/', calculated.incarnationCross.designSunGate);
          }
          console.log('');
          console.log('🎭 TYP & AUTORITÄT:');
          if (calculated.typeAuthority) {
            console.log('  Typ:', TYPE_ICONS[calculated.typeAuthority.type], calculated.typeAuthority.type);
            console.log('  → Erklärung:', calculated.typeAuthority.explanation.type);
            console.log('  Autorität:', AUTHORITY_ICONS[calculated.typeAuthority.authority], calculated.typeAuthority.authority);
            console.log('  → Erklärung:', calculated.typeAuthority.explanation.authority);
            console.log('  Strategie:', STRATEGY_ICONS[calculated.typeAuthority.strategy], calculated.typeAuthority.strategy);
            console.log('  → Erklärung:', calculated.typeAuthority.explanation.strategy);
            console.log('  Nicht-Selbst:', NOT_SELF_ICONS[calculated.typeAuthority.notSelfTheme], calculated.typeAuthority.notSelfTheme);
            console.log('  → Erklärung:', calculated.typeAuthority.explanation.notSelfTheme);
            console.log('  Signatur:', SIGNATURE_ICONS[calculated.typeAuthority.signature], calculated.typeAuthority.signature);
            console.log('  → Erklärung:', calculated.typeAuthority.explanation.signature);
            console.log('  Definition:', DEFINITION_ICONS[calculated.typeAuthority.definition], calculated.typeAuthority.definition);
            console.log('  → Erklärung:', calculated.typeAuthority.explanation.definition);
          }
          console.log('');
          console.log('🔗 CHANNELS:', calculated.channels?.length || 0);
          calculated.channels?.forEach(ch => {
            console.log('  →', ch.gates[0] + '-' + ch.gates[1], ':', ch.name);
          });
          console.log('');
          console.log('⚡ CENTERS:');
          if (calculated.centers) {
            Object.entries(calculated.centers).forEach(([name, status]) => {
              const icon = status === 'definiert' ? '🟢' : status === 'offen' ? '🟠' : '⚪';
              console.log('  ', icon, name, '→', status);
            });
          }
          console.log('');
          console.log('🔄 SCHALTKREISE:');
          if (calculated.circuits && calculated.circuits.length > 0) {
            const dominant = getDominantCircuitGroup(calculated.circuits);
            console.log('  Dominant:', CIRCUIT_GROUP_ICONS[dominant.group!], dominant.group, `(${dominant.percentage}%)`);
            console.log('  → ', dominant.description);
            console.log('');
            console.log('  Aktive Schaltkreise:');
            calculated.circuits.forEach(circuit => {
              const circuitInfo = CIRCUITS[circuit.name];
              console.log(`    ${CIRCUIT_ICONS[circuit.name]} ${circuit.name} (${circuit.group})`);
              console.log(`      → ${circuit.channelCount} Kanäle:`, circuit.activeChannels.join(', '));
              console.log(`      → ${circuitInfo.description}`);
            });
          } else {
            console.log('  Keine Schaltkreise aktiv');
          }
          console.log('');
          
          console.log('🧬 VARIABLEN (PHS, Environment, Perspective, Motivation):');
          if (calculated.variables) {
            const v = calculated.variables;
            console.log(`  Variable Type: ${v.variableType} (${v.cognition})`);
            console.log(`  → ${COGNITION_DESCRIPTIONS[v.cognition]}`);
            console.log('');
            
            console.log(`  ${VARIABLE_ICONS.phs} PHS (Ernährung):`);
            console.log(`    ${v.phs.arrow === 'left' ? VARIABLE_ICONS.left : VARIABLE_ICONS.right} ${v.phs.type} (Tone ${v.phs.tone})`);
            console.log(`    → ${v.phs.description}`);
            console.log(`    Keywords:`, v.phs.keywords.join(', '));
            console.log('');
            
            console.log(`  ${VARIABLE_ICONS.environment} Environment (Umgebung):`);
            console.log(`    ${v.environment.arrow === 'left' ? VARIABLE_ICONS.left : VARIABLE_ICONS.right} ${v.environment.type} (Tone ${v.environment.tone})`);
            console.log(`    → ${v.environment.description}`);
            console.log(`    Keywords:`, v.environment.keywords.join(', '));
            console.log('');
            
            console.log(`  ${VARIABLE_ICONS.perspective} Perspective (Sichtweise):`);
            console.log(`    ${v.perspective.arrow === 'left' ? VARIABLE_ICONS.left : VARIABLE_ICONS.right} ${v.perspective.type} (Tone ${v.perspective.tone})`);
            console.log(`    → ${v.perspective.description}`);
            console.log(`    Keywords:`, v.perspective.keywords.join(', '));
            console.log('');
            
            console.log(`  ${VARIABLE_ICONS.motivation} Motivation:`);
            console.log(`    ${v.motivation.arrow === 'left' ? VARIABLE_ICONS.left : VARIABLE_ICONS.right} ${v.motivation.type} (Tone ${v.motivation.tone})`);
            console.log(`    → ${v.motivation.description}`);
            console.log(`    Keywords:`, v.motivation.keywords.join(', '));
          } else {
            console.log('  Variablen nicht berechnet');
          }
          console.log('═══════════════════════════════════════');
        } catch (preciseError) {
          console.error('❌ PRECISE CALCULATION FAILED:');
          console.error('Error:', preciseError);
          console.error('Error message:', (preciseError as Error).message);
          console.error('Error stack:', (preciseError as Error).stack);
          console.warn('⚠️ Falling back to simplified calculation...');
          throw preciseError; // Fall through to simplified calculation
        }
      } else {
        throw new Error('Using simplified calculation');
      }
      
      // Set the calculated values
      console.log('✅ Gates calculated:', calculated);
      setCalculatedGates(calculated);
      setShowCalculator(true);
      console.log('✅ State updated successfully!');
      
    } catch (error) {
      console.warn('⚠️ Using SIMPLIFIED CALCULATION as fallback');
      console.error('Error details:', error);
      
      // FALLBACK: SIMPLIFIED CALCULATION (always works)
      try {
        const birthDate = new Date(readingData.geburtsdatum);
        
        const personalitySunLon = calculateApproximateSunPosition(birthDate);
        const personalityEarthLon = calculateEarthPosition(personalitySunLon);
        const designSunLon = calculateDesignSun(personalitySunLon);
        const designEarthLon = calculateDesignEarth(designSunLon);

        const calculated: CalculatedGates = {
          personalitySun: convertToGateInfo(personalitySunLon),
          personalityEarth: convertToGateInfo(personalityEarthLon),
          designSun: convertToGateInfo(designSunLon),
          designEarth: convertToGateInfo(designEarthLon),
          zodiacInfo: {
            personalitySun: getZodiacSign(personalitySunLon),
            designSun: getZodiacSign(designSunLon)
          }
        };

        console.log('✅ Simplified calculation successful:', calculated);
        setCalculatedGates(calculated);
        setShowCalculator(true);
        alert('ℹ️ Vereinfachte Berechnung verwendet (±2-3° Genauigkeit)');
      } catch (fallbackError) {
        console.error('❌ Even fallback calculation failed:', fallbackError);
        alert('Fehler bei der Berechnung der Gates. Bitte prüfe die Eingaben und versuche es erneut.');
      }
    }
  };

  // Auto-fill calculated gates into reading data
  const autoFillCalculatedGates = () => {
    if (!calculatedGates) return;

    const updates: Partial<ReadingData> = {
      bewussteSonne: calculatedGates.personalitySun?.formatted || readingData.bewussteSonne,
      bewussteErde: calculatedGates.personalityEarth?.formatted || readingData.bewussteErde,
      unbewussteSonne: calculatedGates.designSun?.formatted || readingData.unbewussteSonne,
      unbewussteErde: calculatedGates.designEarth?.formatted || readingData.unbewussteErde,
    };

    // Add Profile if calculated
    if (calculatedGates.profile) {
      updates.profil = calculatedGates.profile;
    }

    // Add Channels if calculated
    if (calculatedGates.channels && calculatedGates.channels.length > 0) {
      updates.kanaele = formatChannels(calculatedGates.channels);
    }

    // Add Centers if calculated
    if (calculatedGates.centers) {
      updates.krone = calculatedGates.centers.krone;
      updates.ajna = calculatedGates.centers.ajna;
      updates.kehle = calculatedGates.centers.kehle;
      updates.gZentrum = calculatedGates.centers.gZentrum;
      updates.herzEgo = calculatedGates.centers.herzEgo;
      updates.sakral = calculatedGates.centers.sakral;
      updates.solarplexus = calculatedGates.centers.solarplexus;
      updates.milz = calculatedGates.centers.milz;
      updates.wurzel = calculatedGates.centers.wurzel;
    }

    // Add Type and Authority if calculated
    if (calculatedGates.typeAuthority) {
      updates.typ = calculatedGates.typeAuthority.type;
      updates.autoritaet = calculatedGates.typeAuthority.authority;
    }

    // If precise calculation was used, also fill in other planets
    if (calculatedGates.personality) {
      updates.sonne = calculatedGates.personalitySun?.formatted || readingData.sonne;
      updates.mond = calculatedGates.personality.moon?.formatted || readingData.mond;
      updates.merkur = calculatedGates.personality.mercury?.formatted || readingData.merkur;
      updates.venus = calculatedGates.personality.venus?.formatted || readingData.venus;
      updates.mars = calculatedGates.personality.mars?.formatted || readingData.mars;
      updates.jupiter = calculatedGates.personality.jupiter?.formatted || readingData.jupiter;
      updates.saturn = calculatedGates.personality.saturn?.formatted || readingData.saturn;
      updates.nordknoten = calculatedGates.personality.northNode?.formatted || readingData.nordknoten;
      updates.suedknoten = calculatedGates.personality.southNode?.formatted || readingData.suedknoten;
    }

    setReadingData(prev => ({ ...prev, ...updates }));

    const filledItems = [
      '4 Basis-Gates (Sonne/Erde)',
      calculatedGates.profile && 'Profil',
      calculatedGates.channels && calculatedGates.channels.length > 0 && `${calculatedGates.channels.length} Kanäle`,
      calculatedGates.centers && '9 Zentren',
      calculatedGates.typeAuthority && 'Typ & Autorität',
      calculatedGates.personality && '8 erweiterte Planeten'
    ].filter(Boolean);

    alert(`✅ Übernommen:\n${filledItems.join('\n')}`);
  };

  // Gate Calculator für Person 2
  const calculateGatesPerson2 = () => {
    console.log('🔘 Person 2: Button clicked!');
    
    if (!person2Data.geburtsdatum) {
      alert('Bitte gib erst ein Geburtsdatum für Person 2 ein!');
      return;
    }

    try {
      console.log('🔍 Person 2: Starting gate calculation...');
      console.log('📅 Birth date:', person2Data.geburtsdatum);
      console.log('⏰ Birth time:', person2Data.geburtszeit || 'not set');
      
      // Try precise calculation
      try {
        console.log('✨ Person 2: Using astronomy-engine for precise calculation...');
        
        const birthDate = parseBirthDateTime(
          person2Data.geburtsdatum,
          person2Data.geburtszeit || undefined
        );
        console.log('📆 Person 2: Parsed birth date:', birthDate);
        
        const chart = calculateCompleteChart(birthDate);
        console.log('📊 Person 2: Chart calculated');
        
        // Format results
        const calculated: CalculatedGates = {
          personalitySun: convertToGateInfo(chart.personality.sun.longitude),
          personalityEarth: convertToGateInfo(chart.personality.earth.longitude),
          designSun: convertToGateInfo(chart.design.sun.longitude),
          designEarth: convertToGateInfo(chart.design.earth.longitude),
          zodiacInfo: {
            personalitySun: getZodiacSign(chart.personality.sun.longitude),
            designSun: getZodiacSign(chart.design.sun.longitude)
          },
          personality: {
            moon: convertToGateInfo(chart.personality.moon.longitude),
            mercury: convertToGateInfo(chart.personality.mercury.longitude),
            venus: convertToGateInfo(chart.personality.venus.longitude),
            mars: convertToGateInfo(chart.personality.mars.longitude),
            jupiter: convertToGateInfo(chart.personality.jupiter.longitude),
            saturn: convertToGateInfo(chart.personality.saturn.longitude),
            northNode: convertToGateInfo(chart.personality.northNode.longitude),
            southNode: convertToGateInfo(chart.personality.southNode.longitude),
          },
          design: {
            moon: convertToGateInfo(chart.design.moon.longitude),
            mercury: convertToGateInfo(chart.design.mercury.longitude),
            venus: convertToGateInfo(chart.design.venus.longitude),
            mars: convertToGateInfo(chart.design.mars.longitude),
            jupiter: convertToGateInfo(chart.design.jupiter.longitude),
            saturn: convertToGateInfo(chart.design.saturn.longitude),
            northNode: convertToGateInfo(chart.design.northNode.longitude),
            southNode: convertToGateInfo(chart.design.southNode.longitude),
          }
        };

        // Calculate Profile
        const personalitySunLine = calculated.personalitySun?.line || 0;
        const designSunLine = calculated.designSun?.line || 0;
        if (personalitySunLine && designSunLine) {
          const profile = calculateProfile(personalitySunLine, designSunLine);
          calculated.profile = profile;
          calculated.profileInfo = getProfileInfo(profile);
        }

        // Calculate Incarnation Cross
        if (calculated.profile && calculated.personalitySun && calculated.personalityEarth && calculated.designSun && calculated.designEarth) {
          const incarnationCross = calculateIncarnationCross(
            calculated.profile,
            calculated.personalitySun.gate,
            calculated.personalityEarth.gate,
            calculated.designSun.gate,
            calculated.designEarth.gate
          );
          calculated.incarnationCross = incarnationCross;
        }

        // Calculate Channels
        const personalityGates = useAllPlanets ? {
          sun: calculated.personalitySun?.gate,
          earth: calculated.personalityEarth?.gate,
          moon: calculated.personality?.moon?.gate,
          mercury: calculated.personality?.mercury?.gate,
          venus: calculated.personality?.venus?.gate,
          mars: calculated.personality?.mars?.gate,
          jupiter: calculated.personality?.jupiter?.gate,
          saturn: calculated.personality?.saturn?.gate,
          northNode: calculated.personality?.northNode?.gate,
          southNode: calculated.personality?.southNode?.gate,
        } : {
          sun: calculated.personalitySun?.gate,
          earth: calculated.personalityEarth?.gate,
        };
        
        const designGates = useAllPlanets ? {
          sun: calculated.designSun?.gate,
          earth: calculated.designEarth?.gate,
          moon: calculated.design?.moon?.gate,
          mercury: calculated.design?.mercury?.gate,
          venus: calculated.design?.venus?.gate,
          mars: calculated.design?.mars?.gate,
          jupiter: calculated.design?.jupiter?.gate,
          saturn: calculated.design?.saturn?.gate,
          northNode: calculated.design?.northNode?.gate,
          southNode: calculated.design?.southNode?.gate,
        } : {
          sun: calculated.designSun?.gate,
          earth: calculated.designEarth?.gate,
        };
        
        const activeGates = collectActiveGates(personalityGates, designGates);
        const channels = findActivatedChannels(activeGates);
        calculated.channels = channels;

        // Calculate Centers
        const centers = calculateCenters(activeGates);
        calculated.centers = centers;

        // Calculate Type and Authority
        const typeAuthority = calculateTypeAndAuthority(centers, channels);
        calculated.typeAuthority = typeAuthority;

        // Calculate Circuits
        const circuits = calculateCircuits(channels);
        calculated.circuits = circuits;

        // Calculate Variables
        const variables = calculateVariables(chart.personality, chart.design);
        calculated.variables = variables;

        console.log('✅ Person 2: Calculation successful!');
        console.log('═══════════════════════════════════════');
        console.log('🩵 PERSON 2 - CALCULATION RESULTS:');
        console.log('═══════════════════════════════════════');
        console.log(`☉ Personality Sun: Tor ${calculated.personalitySun?.gate}.${calculated.personalitySun?.line}`);
        console.log(`⊕ Personality Earth: Tor ${calculated.personalityEarth?.gate}.${calculated.personalityEarth?.line}`);
        console.log(`☉ Design Sun: Tor ${calculated.designSun?.gate}.${calculated.designSun?.line}`);
        console.log(`⊕ Design Earth: Tor ${calculated.designEarth?.gate}.${calculated.designEarth?.line}`);
        console.log(`📖 Profile: ${calculated.profile || 'N/A'}`);
        console.log(`🔷 Channels: ${calculated.channels?.length || 0}`);
        console.log(`🎯 Type: ${calculated.typeAuthority?.type || 'N/A'}`);
        console.log(`⚡ Authority: ${calculated.typeAuthority?.authority || 'N/A'}`);
        console.log('═══════════════════════════════════════');
        
        setCalculatedGatesPerson2(calculated);
        
        // Auto-fill Person 2 data
        autoFillPerson2Data(calculated);
        
      } catch (preciseError) {
        console.error('❌ Person 2: Precise calculation failed:', preciseError);
        alert('Fehler bei der präzisen Berechnung für Person 2. Bitte prüfe die Eingabedaten.');
      }
      
    } catch (error) {
      console.error('❌ Person 2: Fatal error during calculation:', error);
      alert('Ein unerwarteter Fehler ist bei der Berechnung für Person 2 aufgetreten.');
    }
  };

  // Auto-fill Person 2 data from calculation
  const autoFillPerson2Data = (calculatedGates: CalculatedGates) => {
    if (!calculatedGates) return;

    // Sammle alle aktivierten Tore
    const allGates: number[] = [];
    
    if (calculatedGates.personalitySun) allGates.push(calculatedGates.personalitySun.gate);
    if (calculatedGates.personalityEarth) allGates.push(calculatedGates.personalityEarth.gate);
    if (calculatedGates.designSun) allGates.push(calculatedGates.designSun.gate);
    if (calculatedGates.designEarth) allGates.push(calculatedGates.designEarth.gate);
    
    if (useAllPlanets && calculatedGates.personality) {
      Object.values(calculatedGates.personality).forEach(planet => {
        if (planet?.gate) allGates.push(planet.gate);
      });
    }
    if (useAllPlanets && calculatedGates.design) {
      Object.values(calculatedGates.design).forEach(planet => {
        if (planet?.gate) allGates.push(planet.gate);
      });
    }
    
    // Entferne Duplikate und sortiere
    const uniqueGates = [...new Set(allGates)].sort((a, b) => a - b);
    
    // Sammle definierte Zentren
    const definedCenters = Object.entries(calculatedGates.centers || {})
      .filter(([_, status]) => status === 'definiert')
      .map(([name, _]) => {
        const centerNames: Record<string, string> = {
          'krone': 'Krone',
          'ajna': 'Ajna',
          'kehle': 'Kehle',
          'gZentrum': 'G-Zentrum',
          'herzEgo': 'Herz/Ego',
          'sakral': 'Sakral',
          'solarplexus': 'Solarplexus',
          'milz': 'Milz',
          'wurzel': 'Wurzel'
        };
        return centerNames[name] || name;
      });
    
    // Sammle offene Zentren
    const openCenters = Object.entries(calculatedGates.centers || {})
      .filter(([_, status]) => status === 'offen' || status === 'undefiniert')
      .map(([name, _]) => {
        const centerNames: Record<string, string> = {
          'krone': 'Krone',
          'ajna': 'Ajna',
          'kehle': 'Kehle',
          'gZentrum': 'G-Zentrum',
          'herzEgo': 'Herz/Ego',
          'sakral': 'Sakral',
          'solarplexus': 'Solarplexus',
          'milz': 'Milz',
          'wurzel': 'Wurzel'
        };
        return centerNames[name] || name;
      });
    
    // Update Person 2 data
    setPerson2Data(prev => ({
      ...prev,
      typ: calculatedGates.typeAuthority?.type || prev.typ,
      profil: calculatedGates.profile || prev.profil,
      autoritaet: calculatedGates.typeAuthority?.authority || prev.autoritaet,
      definierteTore: uniqueGates.join(', '),
      definiertezentren: definedCenters.join(', '),
      offenezentren: openCenters.join(', ')
    }));

    const filledItems = [
      `${uniqueGates.length} Tore`,
      calculatedGates.profile && 'Profil',
      calculatedGates.typeAuthority && 'Typ & Autorität',
      `${definedCenters.length} definierte Zentren`,
      `${openCenters.length} offene Zentren`
    ].filter(Boolean);

    alert(`✅ Person 2: Übernommen!\n${filledItems.join('\n')}`);
  };

  const handleSave = async () => {
    try {
      const response = await fetch('/api/readings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: readingType,
          data: readingData,
          createdAt: new Date().toISOString()
        }),
      });
      
      if (response.ok) {
        alert('Reading erfolgreich gespeichert!');
      }
    } catch (error) {
      console.error('Fehler beim Speichern:', error);
      alert('Fehler beim Speichern des Readings');
    }
  };

  const handleExportPDF = async () => {
    if (typeof window === 'undefined') return;
    
    const jsPDF = (await import('jspdf')).default;
    const html2canvas = (await import('html2canvas')).default;
    
    if (previewRef.current) {
      const canvas = await html2canvas(previewRef.current, {
        scale: 2,
        useCORS: true,
        logging: false
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`${readingData.name || 'Reading'}_${readingType}.pdf`);
    }
  };

  const insertTextbaustein = (text: string, field: keyof ReadingData) => {
    handleInputChange(field, readingData[field] + ' ' + text);
    setShowTextbausteine(false);
  };

  const generateReading = () => {
    // Connection Key Template
    if (readingType === 'connectionKey' && connectionKeyResult) {
      return `
        <div style="font-family: 'Georgia', serif; line-height: 1.8; color: #2c3e50; max-width: 900px; margin: 0 auto; padding: 40px;">
          <h1 style="text-align: center; color: #8a2be2; font-size: 2.5em; margin-bottom: 10px;">🩵 The Connection Key</h1>
          <p style="text-align: center; color: #666; font-size: 1.1em; margin-bottom: 40px;">Resonanzanalyse zwischen ${readingData.name || '[Person 1]'} & ${person2Data.name || '[Person 2]'}</p>
          
          <div style="background: linear-gradient(135deg, #8a2be2 0%, #9d4edd 100%); padding: 30px; border-radius: 15px; margin-bottom: 40px; color: white;">
            <h2 style="margin-top: 0;">💫 Einleitung</h2>
            <p>Dieses Dokument beschreibt die Verbindung zweier Menschen auf Grundlage ihrer Human-Design-Daten. Es analysiert, wie sich ihre Energie, Wahrnehmung und Entscheidungsprozesse gegenseitig beeinflussen. Ziel ist ein klares Verständnis der individuellen und gemeinsamen Dynamiken.</p>
          </div>

          <h2 style="color: #8a2be2; border-bottom: 3px solid #8a2be2; padding-bottom: 10px; margin-top: 40px;">📊 Zusammenfassung</h2>
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin: 20px 0;">
            <div style="background: rgba(255, 215, 0, 0.2); padding: 20px; border-radius: 10px; text-align: center;">
              <h3 style="color: #FFD700; margin: 0; font-size: 2em;">${connectionKeyResult.summary.totalResonancePoints}</h3>
              <p style="margin: 5px 0 0 0;">Resonanzpunkte</p>
            </div>
            <div style="background: rgba(76, 175, 80, 0.2); padding: 20px; border-radius: 10px; text-align: center;">
              <h3 style="color: #4caf50; margin: 0; font-size: 2em;">${connectionKeyResult.summary.connectionStrength}%</h3>
              <p style="margin: 5px 0 0 0;">Verbindungsstärke</p>
            </div>
            <div style="background: rgba(255, 152, 0, 0.2); padding: 20px; border-radius: 10px; text-align: center;">
              <h3 style="color: #ff9800; margin: 0; font-size: 2em;">${connectionKeyResult.goldenThreads.length}</h3>
              <p style="margin: 5px 0 0 0;">Goldadern</p>
            </div>
          </div>

          <h2 style="color: #8a2be2; border-bottom: 3px solid #8a2be2; padding-bottom: 10px; margin-top: 40px;">🔹 Analyse – Person 1</h2>
          <div style="background: #f8f9fa; padding: 25px; border-radius: 10px; margin: 20px 0;">
            <p><strong>Name:</strong> ${readingData.name || '[Name]'}</p>
            <p><strong>Geschlecht:</strong> ${readingData.geschlecht || '[Geschlecht]'}</p>
            <p><strong>Geburtsdatum:</strong> ${readingData.geburtsdatum || '[Datum]'}</p>
            <p><strong>Geburtszeit:</strong> ${readingData.geburtszeit || '[Zeit]'}</p>
            <p><strong>Geburtsort:</strong> ${readingData.geburtsort || '[Ort]'}</p>
            <p><strong>Typ:</strong> ${readingData.typ || '[Typ]'}</p>
            <p><strong>Profil:</strong> ${readingData.profil || '[Profil]'}</p>
            <p><strong>Autorität:</strong> ${readingData.autoritaet || '[Autorität]'}</p>
          </div>

          <h2 style="color: #8a2be2; border-bottom: 3px solid #8a2be2; padding-bottom: 10px; margin-top: 40px;">🔹 Analyse – Person 2</h2>
          <div style="background: #f8f9fa; padding: 25px; border-radius: 10px; margin: 20px 0;">
            <p><strong>Name:</strong> ${person2Data.name || '[Name]'}</p>
            <p><strong>Geschlecht:</strong> ${person2Data.geschlecht || '[Geschlecht]'}</p>
            <p><strong>Geburtsdatum:</strong> ${person2Data.geburtsdatum || '[Datum]'}</p>
            <p><strong>Geburtszeit:</strong> ${person2Data.geburtszeit || '[Zeit]'}</p>
            <p><strong>Geburtsort:</strong> ${person2Data.geburtsort || '[Ort]'}</p>
            <p><strong>Typ:</strong> ${person2Data.typ || '[Typ]'}</p>
            <p><strong>Profil:</strong> ${person2Data.profil || '[Profil]'}</p>
            <p><strong>Autorität:</strong> ${person2Data.autoritaet || '[Autorität]'}</p>
          </div>

          <h2 style="color: #e8b86d; border-bottom: 3px solid #e8b86d; padding-bottom: 10px; margin-top: 40px;">✨ Verbindende Tore & Kanäle – Die Goldadern der Verbindung</h2>
          ${connectionKeyResult.goldenThreads.length > 0 ? connectionKeyResult.goldenThreads.map(thread => `
            <div style="background: linear-gradient(135deg, rgba(232, 184, 109, 0.1) 0%, rgba(255, 215, 155, 0.1) 100%); padding: 20px; border-radius: 10px; margin: 15px 0; border-left: 5px solid #e8b86d;">
              <h3 style="color: #e8b86d; margin-top: 0; font-size: 1.2em;">${thread.channel}: ${thread.theme}</h3>
              <p style="margin: 0; color: #333; line-height: 1.6;">${thread.description}</p>
            </div>
          `).join('') : '<p style="color: #666; font-style: italic;">Keine vollständigen Kanäle durch Verbindung gefunden.</p>'}

          <h2 style="color: #8a2be2; border-bottom: 3px solid #8a2be2; padding-bottom: 10px; margin-top: 40px;">🔗 Resonanzachsen (${connectionKeyResult.resonanceAxes.length})</h2>
          <p>Resonanzachsen entstehen, wenn ein Tor einer Person auf das komplementäre Tor der anderen Person trifft. Diese unsichtbaren Bänder aktivieren Themen und Dynamiken:</p>
          ${connectionKeyResult.resonanceAxes.map(axis => `
            <div style="background: rgba(138, 43, 226, 0.1); padding: 15px; border-radius: 8px; margin: 10px 0;">
              <p style="margin: 0; color: #8a2be2; font-weight: 600;">${axis.channelName}: ${axis.theme}</p>
              <p style="margin: 5px 0 0 0; color: #666; font-size: 0.9em;">
                ${axis.level === 'mental' ? '🧠 Mentale Ebene' : axis.level === 'emotional' ? '❤️ Emotionale Ebene' : '💪 Körperlich-energetische Ebene'}
              </p>
            </div>
          `).join('')}

          <h2 style="color: #4caf50; border-bottom: 3px solid #4caf50; padding-bottom: 10px; margin-top: 40px;">🔹 Zentren-Vergleich</h2>
          ${connectionKeyResult.centers.filter(c => c.type === 'resonance').length > 0 ? `
            <h3 style="color: #4caf50; margin-top: 20px;">✓ Resonanzfelder (${connectionKeyResult.centers.filter(c => c.type === 'resonance').length})</h3>
            ${connectionKeyResult.centers.filter(c => c.type === 'resonance').map(center => `
              <div style="background: rgba(76, 175, 80, 0.1); padding: 12px; border-radius: 6px; margin: 8px 0;">
                <p style="margin: 0; font-weight: 600;">${center.centerName}</p>
                <p style="margin: 5px 0 0 0; color: #666; font-size: 0.9em;">${center.description}</p>
              </div>
            `).join('')}
          ` : ''}
          
          ${connectionKeyResult.centers.filter(c => c.type === 'growth').length > 0 ? `
            <h3 style="color: #ff9800; margin-top: 20px;">⚡ Wachstumsfelder (${connectionKeyResult.centers.filter(c => c.type === 'growth').length})</h3>
            ${connectionKeyResult.centers.filter(c => c.type === 'growth').map(center => `
              <div style="background: rgba(255, 152, 0, 0.1); padding: 12px; border-radius: 6px; margin: 8px 0;">
                <p style="margin: 0; font-weight: 600;">${center.centerName}</p>
                <p style="margin: 5px 0 0 0; color: #666; font-size: 0.9em;">${center.description}</p>
              </div>
            `).join('')}
          ` : ''}

          <h2 style="color: #8a2be2; border-bottom: 3px solid #8a2be2; padding-bottom: 10px; margin-top: 40px;">🩵 Abschluss</h2>
          <div style="background: #f0f4ff; padding: 25px; border-radius: 10px; margin: 20px 0;">
            <p>Diese Analyse dient der bewussten Reflexion gemeinsamer Energieprozesse. Sie ist keine Bewertung, sondern eine Einladung zu Verständnis, Balance und Klarheit.</p>
            <p>Jede Verbindung trägt Potenziale für Wachstum – ob in Freundschaft, Partnerschaft oder beruflicher Zusammenarbeit.</p>
            <p style="text-align: center; font-style: italic; color: #8a2be2; margin-top: 20px;">💫 Die Verbindung ist das Geschenk 💫</p>
          </div>
        </div>
      `;
    }
    
    // Standard Human Design Reading Template
    return `
      <div style="font-family: 'Helvetica Neue', Arial, sans-serif; line-height: 1.8; color: #ffffff; background: #000000; margin: 0; padding: 0;">
        <!-- Header mit Logo -->
        <div style="background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%); padding: 40px 0; text-align: center; border-bottom: 3px solid #e8b86d;">
          <div style="max-width: 250px; margin: 0 auto 20px;">
            <img src="/images/connection-key-logo.png" alt="The Connection Key" style="width: 100%; height: auto;"/>
          </div>
          <h1 style="color: #e8b86d; font-size: 2.5em; margin: 0 0 10px 0; font-weight: 700; letter-spacing: 2px;">✨ HUMAN DESIGN READING ✨</h1>
          <p style="color: #ffffff; font-size: 1.3em; margin: 0; font-weight: 300;">${readingData.name || '[Name]'}</p>
        </div>

        <!-- Content Container -->
        <div style="max-width: 800px; margin: 0 auto; padding: 40px 20px;">
        
        <!-- Persönliche Daten Box -->
        <div style="background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%); padding: 30px; border-radius: 15px; margin-bottom: 40px; border: 2px solid #e8b86d; box-shadow: 0 8px 32px rgba(232, 184, 109, 0.2);">
          <h2 style="margin: 0 0 20px 0; color: #e8b86d; font-size: 1.8em; border-bottom: 2px solid #e8b86d; padding-bottom: 10px;">📋 Persönliche Daten</h2>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
            <div>
              <p style="margin: 0 0 5px 0; color: #e8b86d; font-weight: 600; font-size: 0.9em;">GEBURTSDATUM</p>
              <p style="margin: 0; color: #ffffff; font-size: 1.1em;">${readingData.geburtsdatum || '[Datum]'}</p>
            </div>
            <div>
              <p style="margin: 0 0 5px 0; color: #e8b86d; font-weight: 600; font-size: 0.9em;">GEBURTSZEIT</p>
              <p style="margin: 0; color: #ffffff; font-size: 1.1em;">${readingData.geburtszeit || '[Zeit]'}</p>
            </div>
            <div style="grid-column: 1 / -1;">
              <p style="margin: 0 0 5px 0; color: #e8b86d; font-weight: 600; font-size: 0.9em;">GEBURTSORT</p>
              <p style="margin: 0; color: #ffffff; font-size: 1.1em;">${readingData.geburtsort || '[Ort]'}</p>
            </div>
          </div>
        </div>

        <!-- Einleitung Box -->
        <div style="background: rgba(232, 184, 109, 0.1); padding: 30px; border-radius: 15px; margin-bottom: 40px; border-left: 5px solid #e8b86d;">
          <h2 style="color: #e8b86d; font-size: 1.8em; margin: 0 0 15px 0;">✨ Einleitung – die Landschaft öffnet sich</h2>
          <p style="margin: 0 0 10px 0; color: rgba(255, 255, 255, 0.9);">Die ersten Türen sind geöffnet, das Fundament gefunden. Nun trittst du in einen größeren Raum: Strukturen beginnen sich zu zeigen, Verbindungen erwachen, Richtungen zeichnen sich ab.</p>
          <p style="margin: 0; color: rgba(255, 255, 255, 0.9);">Was zuvor nur einzelne Punkte waren, entfaltet sich jetzt zu einer Landschaft. Wege werden sichtbar, Horizonte weiten sich, und dein eigener Pfad beginnt klarer hervorzutreten.</p>
        </div>

        <!-- Typ & Strategie Box -->
        <div style="background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%); padding: 30px; border-radius: 15px; margin-bottom: 40px; border: 2px solid #e8b86d;">
          <h2 style="color: #e8b86d; font-size: 1.8em; margin: 0 0 20px 0; border-bottom: 2px solid #e8b86d; padding-bottom: 10px;">🎯 Typ, Strategie, Signatur & Nicht-Selbst</h2>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
            <div style="background: rgba(232, 184, 109, 0.1); padding: 15px; border-radius: 10px;">
              <p style="margin: 0 0 5px 0; color: #e8b86d; font-weight: 600; font-size: 0.9em;">TYP</p>
              <p style="margin: 0; color: #ffffff; font-size: 1.2em; font-weight: 600;">${readingData.typ || '[Typ]'}</p>
            </div>
            <div style="background: rgba(232, 184, 109, 0.1); padding: 15px; border-radius: 10px;">
              <p style="margin: 0 0 5px 0; color: #e8b86d; font-weight: 600; font-size: 0.9em;">STRATEGIE</p>
              <p style="margin: 0; color: #ffffff; font-size: 1.2em; font-weight: 600;">${readingData.strategie || '[Strategie]'}</p>
            </div>
            <div style="background: rgba(76, 175, 80, 0.1); padding: 15px; border-radius: 10px;">
              <p style="margin: 0 0 5px 0; color: #4caf50; font-weight: 600; font-size: 0.9em;">SIGNATUR</p>
              <p style="margin: 0; color: #ffffff; font-size: 1.2em; font-weight: 600;">${readingData.signatur || '[Signatur]'}</p>
            </div>
            <div style="background: rgba(244, 67, 54, 0.1); padding: 15px; border-radius: 10px;">
              <p style="margin: 0 0 5px 0; color: #f44336; font-weight: 600; font-size: 0.9em;">NICHT-SELBST</p>
              <p style="margin: 0; color: #ffffff; font-size: 1.2em; font-weight: 600;">${readingData.nichtSelbst || '[Nicht-Selbst]'}</p>
            </div>
          </div>
          
          <p style="color: rgba(255, 255, 255, 0.9); margin: 0;">Deine Signatur erinnert dich daran, wann du im Einklang bist. Dein Nicht-Selbst-Thema zeigt dir, wann du dich von deinem Weg entfernt hast.</p>
        </div>
        
        ${readingData.typ && textbausteine.typ[readingData.typ as keyof typeof textbausteine.typ] ? `
        <div style="background: rgba(232, 184, 109, 0.05); padding: 25px; border-radius: 10px; margin: 25px 0; border-left: 5px solid #e8b86d;">
          <p style="margin: 0; font-style: italic; color: rgba(255, 255, 255, 0.9); line-height: 1.8;">
            ${textbausteine.typ[readingData.typ as keyof typeof textbausteine.typ]}
          </p>
        </div>
        ` : ''}
        
        <div style="background: rgba(232, 184, 109, 0.15); padding: 20px; border-left: 4px solid #e8b86d; margin: 20px 0; border-radius: 10px;">
          <p style="margin: 0 0 10px 0; color: #e8b86d; font-weight: 600;">💭 REFLEXION</p>
          <p style="margin: 5px 0; color: rgba(255, 255, 255, 0.9);">• Erkennst du dich in dieser Energie wieder?</p>
          <p style="margin: 5px 0; color: rgba(255, 255, 255, 0.9);">• Wo kämpfst du noch gegen deinen natürlichen Rhythmus?</p>
        </div>

        <!-- Profil & Autorität Box -->
        <div style="background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%); padding: 30px; border-radius: 15px; margin-top: 40px; margin-bottom: 40px; border: 2px solid #e8b86d;">
          <h2 style="color: #e8b86d; font-size: 1.8em; margin: 0 0 15px 0; border-bottom: 2px solid #e8b86d; padding-bottom: 10px;">🎭 Profil & Autorität</h2>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
            <div style="background: rgba(156, 39, 176, 0.1); padding: 15px; border-radius: 10px;">
              <p style="margin: 0 0 5px 0; color: #9c27b0; font-weight: 600; font-size: 0.9em;">PROFIL</p>
              <p style="margin: 0; color: #ffffff; font-size: 1.2em; font-weight: 600;">${readingData.profil || '[Profil]'}</p>
            </div>
            <div style="background: rgba(240, 147, 251, 0.1); padding: 15px; border-radius: 10px;">
              <p style="margin: 0 0 5px 0; color: #f093fb; font-weight: 600; font-size: 0.9em;">AUTORITÄT</p>
              <p style="margin: 0; color: #ffffff; font-size: 1.2em; font-weight: 600;">${readingData.autoritaet || '[Autorität]'}</p>
            </div>
          </div>
          
          <p style="color: rgba(255, 255, 255, 0.9); margin: 0;">Dein Profil beschreibt deine Rolle in der Welt – die Bühne, auf der du deine Erfahrungen machst. Deine Autorität ist dein inneres Steuer, das dir zeigt, wie Klarheit entsteht.</p>
        </div>
        
        ${readingData.profil && textbausteine.profil[readingData.profil as keyof typeof textbausteine.profil] ? `
        <div style="background: linear-gradient(135deg, rgba(156, 39, 176, 0.1) 0%, rgba(142, 68, 173, 0.1) 100%); padding: 25px; border-radius: 10px; margin: 25px 0; border-left: 5px solid #9c27b0;">
          <h3 style="color: #9c27b0; margin-top: 0; font-size: 1.1em;">📖 Dein Profil</h3>
          <p style="margin: 0; font-style: italic; color: #333; line-height: 1.8;">
            ${textbausteine.profil[readingData.profil as keyof typeof textbausteine.profil]}
          </p>
        </div>
        ` : ''}

        ${readingData.autoritaet && textbausteine.autoritaet[readingData.autoritaet as keyof typeof textbausteine.autoritaet] ? `
        <div style="background: linear-gradient(135deg, rgba(240, 147, 251, 0.1) 0%, rgba(245, 87, 108, 0.1) 100%); padding: 25px; border-radius: 10px; margin: 25px 0; border-left: 5px solid #f093fb;">
          <h3 style="color: #f093fb; margin-top: 0; font-size: 1.1em;">🎯 Deine Autorität</h3>
          <p style="margin: 0; font-style: italic; color: #333; line-height: 1.8;">
            ${textbausteine.autoritaet[readingData.autoritaet as keyof typeof textbausteine.autoritaet]}
          </p>
        </div>
        ` : ''}
        
        <div style="background: #f8f9fa; padding: 20px; border-left: 4px solid #FFD700; margin: 20px 0;">
          <p style="margin: 0;"><strong>Reflexion:</strong></p>
          <p style="margin: 5px 0 0 0;">• Welche Linie erkennst du stärker in dir?</p>
          <p style="margin: 5px 0 0 0;">• Wann fühlst du dich in deiner Rolle am stimmigsten?</p>
        </div>

        <!-- Inkarnationskreuz Box -->
        <div style="background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%); padding: 30px; border-radius: 15px; margin-top: 40px; margin-bottom: 30px; border: 2px solid #e8b86d;">
          <h2 style="color: #e8b86d; font-size: 1.8em; margin: 0 0 15px 0; border-bottom: 2px solid #e8b86d; padding-bottom: 10px;">🎭 Inkarnationskreuz</h2>
          <p style="color: rgba(255, 255, 255, 0.9); margin: 0 0 20px 0;">Dein Kreuz – <strong>${readingData.inkarnationskreuz || '[Inkarnationskreuz]'}</strong> – ist ein Kompass, der dich in eine bestimmte Richtung ruft. Es trägt die Erinnerung an das, was durch dich sichtbar werden möchte.</p>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
            <div style="background: rgba(232, 184, 109, 0.1); padding: 15px; border-radius: 10px;">
              <p style="margin: 0 0 5px 0; color: #e8b86d; font-weight: 600; font-size: 0.9em;">☉ BEWUSSTE SONNE</p>
              <p style="margin: 0; color: #ffffff; font-size: 1.1em;">${readingData.bewussteSonne || '[Tor]'}</p>
            </div>
            <div style="background: rgba(232, 184, 109, 0.1); padding: 15px; border-radius: 10px;">
              <p style="margin: 0 0 5px 0; color: #e8b86d; font-weight: 600; font-size: 0.9em;">🌍 BEWUSSTE ERDE</p>
              <p style="margin: 0; color: #ffffff; font-size: 1.1em;">${readingData.bewussteErde || '[Tor]'}</p>
            </div>
            <div style="background: rgba(232, 184, 109, 0.1); padding: 15px; border-radius: 10px;">
              <p style="margin: 0 0 5px 0; color: #e8b86d; font-weight: 600; font-size: 0.9em;">☉ UNBEWUSSTE SONNE</p>
              <p style="margin: 0; color: #ffffff; font-size: 1.1em;">${readingData.unbewussteSonne || '[Tor]'}</p>
            </div>
            <div style="background: rgba(232, 184, 109, 0.1); padding: 15px; border-radius: 10px;">
              <p style="margin: 0 0 5px 0; color: #e8b86d; font-weight: 600; font-size: 0.9em;">🌍 UNBEWUSSTE ERDE</p>
              <p style="margin: 0; color: #ffffff; font-size: 1.1em;">${readingData.unbewussteErde || '[Tor]'}</p>
            </div>
          </div>
        </div>

        <!-- Zentren Box -->
        <div style="background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%); padding: 30px; border-radius: 15px; margin-top: 40px; margin-bottom: 30px; border: 2px solid #e8b86d;">
          <h2 style="color: #e8b86d; font-size: 1.8em; margin: 0 0 15px 0; border-bottom: 2px solid #e8b86d; padding-bottom: 10px;">🌟 Zentren – Energie im Fluss</h2>
          <p style="color: rgba(255, 255, 255, 0.9); margin: 0 0 20px 0;">Die Zentren sind wie Tore in deinem Körperfeld. Manche sind definiert – dort bist du verlässlich, stabil, wiedererkennbar. Andere sind offen – dort nimmst du die Welt auf, bist empfänglich, lernend.</p>
        
        ${(() => {
          const zentrenListe = [
            { key: 'krone', name: 'Krone' },
            { key: 'ajna', name: 'Ajna' },
            { key: 'kehle', name: 'Kehle' },
            { key: 'gZentrum', name: 'G-Zentrum' },
            { key: 'herzEgo', name: 'Herz/Ego' },
            { key: 'sakral', name: 'Sakral' },
            { key: 'solarplexus', name: 'Solarplexus' },
            { key: 'milz', name: 'Milz' },
            { key: 'wurzel', name: 'Wurzel' }
          ];
          
          return zentrenListe.map(z => {
            const status = readingData[z.key as keyof ReadingData];
            const textbaustein = status && textbausteine.zentrenSpezifisch[z.key as keyof typeof textbausteine.zentrenSpezifisch]?.[status as keyof typeof textbausteine.zentrenSpezifisch.krone];
            
            return `
              <div style="margin: 20px 0; padding: 15px; background: ${status === 'definiert' ? 'rgba(76, 175, 80, 0.1)' : status === 'offen' ? 'rgba(255, 152, 0, 0.1)' : 'rgba(158, 158, 158, 0.1)'}; border-left: 4px solid ${status === 'definiert' ? '#4caf50' : status === 'offen' ? '#ff9800' : '#9e9e9e'}; border-radius: 5px;">
                <p style="margin: 0 0 10px 0;"><strong>${z.name}</strong> – ${status || '[Status]'}</p>
                ${textbaustein ? `
                  <p style="margin: 0; font-style: italic; color: #555; font-size: 0.9em; line-height: 1.6;">
                    ${textbaustein}
                  </p>
                ` : ''}
              </div>
            `;
          }).join('');
        })()}

        <p>Hier zeigen sich deine festen Kräfte und deine sensiblen Räume. Zusammen bilden sie den Puls, mit dem du durch dein Leben gehst.</p>
        
        <div style="background: #f8f9fa; padding: 20px; border-left: 4px solid #FFD700; margin: 20px 0;">
          <p style="margin: 0;"><strong>Reflexion:</strong></p>
          <p style="margin: 5px 0 0 0;">• In welchem Zentrum erlebst du die größte Stabilität?</p>
          <p style="margin: 5px 0 0 0;">• Wo bist du besonders empfänglich für die Welt um dich herum?</p>
        </div>

        </div>

        <!-- Kanäle Box -->
        <div style="background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%); padding: 30px; border-radius: 15px; margin-top: 40px; margin-bottom: 30px; border: 2px solid #e8b86d;">
          <h2 style="color: #e8b86d; font-size: 1.8em; margin: 0 0 15px 0; border-bottom: 2px solid #e8b86d; padding-bottom: 10px;">🔗 Kanäle – die Wege deiner Energie</h2>
          <p style="color: rgba(255, 255, 255, 0.9); margin: 0 0 10px 0;">Deine Kanäle sind die Verbindungen zwischen den Zentren. Sie zeigen, wie deine Energie konkret fließt.</p>
          <p style="color: #e8b86d; margin: 0 0 20px 0; font-weight: 600;"><strong>${readingData.kanaele || '[Kanäle]'}</strong></p>
        
        ${(() => {
          if (!readingData.kanaele) return '';
          
          // Parse Kanäle aus dem String (Format: "10-20, 13-33, 7-31")
          const kanaeleArray = readingData.kanaele.split(',').map(k => k.trim()).filter(k => k);
          
          return kanaeleArray.map(kanal => {
            // Normalisiere Kanal-Format (z.B. "10-20" oder "20-10" → immer kleinere Zahl zuerst)
            const parts = kanal.split('-').map(n => n.trim());
            if (parts.length !== 2) return '';
            
            const [g1, g2] = parts.map(n => parseInt(n));
            const normalizedKanal = g1 < g2 ? `${g1}-${g2}` : `${g2}-${g1}`;
            
            const textbaustein = textbausteine.kanaele[normalizedKanal as keyof typeof textbausteine.kanaele];
            
            if (!textbaustein) return '';
            
            return `
              <div style="margin: 20px 0; padding: 20px; background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%); border-left: 5px solid #667eea; border-radius: 8px;">
                <h3 style="color: #667eea; margin-top: 0; font-size: 1.1em;">🔗 Kanal ${normalizedKanal}</h3>
                <p style="margin: 0; font-style: italic; color: #333; line-height: 1.8;">
                  ${textbaustein}
                </p>
              </div>
            `;
          }).join('');
        })()}
        
        <p>Jeder Kanal ist wie ein Weg, den du immer wieder beschreitest – vertraut und zugleich voller Bewegung.</p>
        
        <div style="background: #f8f9fa; padding: 20px; border-left: 4px solid #FFD700; margin: 20px 0;">
          <p style="margin: 0;"><strong>Reflexion:</strong></p>
          <p style="margin: 5px 0 0 0;">• Welche deiner Kanäle erkennst du im Alltag am deutlichsten?</p>
          <p style="margin: 5px 0 0 0;">• Welche Energie fließt dir am leichtesten?</p>
        </div>

        </div>

        <!-- Planeten Box -->
        <div style="background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%); padding: 30px; border-radius: 15px; margin-top: 40px; margin-bottom: 30px; border: 2px solid #e8b86d;">
          <h2 style="color: #e8b86d; font-size: 1.8em; margin: 0 0 15px 0; border-bottom: 2px solid #e8b86d; padding-bottom: 10px;">🪐 Planeten – bis Saturn</h2>
        <p>Hier zeigt sich die erste Schicht deiner 
        
        <ul style="list-style: none; padding-left: 0;">
          <li>☉ <strong>Sonne</strong> – ${readingData.sonne || '[Tor]'}</li>
          <li>🌙 <strong>Mond</strong> – ${readingData.mond || '[Tor]'}</li>
          <li>☿ <strong>Merkur</strong> – ${readingData.merkur || '[Tor]'}</li>
          <li>♀ <strong>Venus</strong> – ${readingData.venus || '[Tor]'}</li>
          <li>♂ <strong>Mars</strong> – ${readingData.mars || '[Tor]'}</li>
          <li>♃ <strong>Jupiter</strong> – ${readingData.jupiter || '[Tor]'}</li>
          <li>♄ <strong>Saturn</strong> – ${readingData.saturn || '[Tor]'}</li>
        </ul>

        <p>Diese Planeten wirken nah, greifbar, alltäglich. Sie erzählen von deinem Licht, deiner inneren Welt, deiner Stimme, deiner Liebe, deinem Feuer, deinem Wachstum und deinen Prüfungen.</p>
        
        <div style="background: #f8f9fa; padding: 20px; border-left: 4px solid #FFD700; margin: 20px 0;">
          <p style="margin: 0;"><strong>Reflexion:</strong></p>
          <p style="margin: 5px 0 0 0;">• Wo erkennst du deine größte Lernaufgabe?</p>
          <p style="margin: 5px 0 0 0;">• Welche dieser Kräfte begleitet dich besonders stark im Alltag?</p>
        </div>

        </div>

        <!-- Knotenachse Box -->
        <div style="background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%); padding: 30px; border-radius: 15px; margin-top: 40px; margin-bottom: 30px; border: 2px solid #e8b86d;">
          <h2 style="color: #e8b86d; font-size: 1.8em; margin: 0 0 15px 0; border-bottom: 2px solid #e8b86d; padding-bottom: 10px;">🌙 Knotenachse – von Gestern nach Morgen</h2>
        <p>Die Knoten sind wie Pfeiler auf deiner Zeitachse. Dein Südknoten – <strong>${readingData.suedknoten || '[Tor]'}</strong> – erzählt von dem, was du mitbringst – Erfahrungen, Muster, vertraute Wege. Dein Nordknoten – <strong>${readingData.nordknoten || '[Tor]'}</strong> – zeigt, wohin deine Seele wachsen möchte – Räume, die noch nicht vertraut sind, aber auf dich warten.</p>
        <p>Süd- und Nordknoten spannen den Bogen zwischen Vergangenheit und Zukunft. Dein Leben bewegt sich dazwischen – und mit jedem Schritt verwebst du beide Pole.</p>
        
        <div style="background: #f8f9fa; padding: 20px; border-left: 4px solid #FFD700; margin: 20px 0;">
          <p style="margin: 0;"><strong>Reflexion:</strong></p>
          <p style="margin: 5px 0 0 0;">• Wo spürst du das Gewicht der Vergangenheit?</p>
          <p style="margin: 5px 0 0 0;">• Wo zieht dich schon der Ruf der Zukunft?</p>
        </div>

        </div>

        <!-- Abschluss Box -->
        <div style="background: rgba(232, 184, 109, 0.1); padding: 30px; border-radius: 15px; margin-top: 40px; margin-bottom: 40px; border-left: 5px solid #e8b86d;">
          <h2 style="color: #e8b86d; font-size: 1.8em; margin: 0 0 15px 0;">✨ Abschluss – Orientierung und roter Faden</h2>
        <p>Hier fügen sich die Teile deines Designs zu einer Landschaft, die du erkennen kannst. Zentren und Kanäle zeigen dir, wie deine Energie tatsächlich fließt. Die Planeten bis Saturn machen sichtbar, welche Kräfte dich im Alltag begleiten. Und die Knoten lassen dich spüren, dass dein Weg mehr ist als ein Kreis – er ist Bewegung, Entwicklung, Richtung.</p>
        <p>Dieses Reading schenkt dir keine fertigen Antworten auf jede Frage. Aber es gibt dir etwas Wertvolleres: den Überblick. Ein Gefühl für den roten Faden, der durch dein Leben läuft. Orientierung inmitten der vielen Eindrücke. Und die Einladung, weiterzugehen – dorthin, wo noch größere Kräfte auf dich warten.</p>

        <div style="text-align: center; margin-top: 60px; padding-top: 30px; border-top: 2px solid #FFD700;">
          <p style="color: #666; font-style: italic;">Erstellt mit ♥ durch The Connection Key</p>
        </div>
      </div>
    `;
  };

  return (
    <Box sx={{ minHeight: '100vh', background: '#000000', py: { xs: 2, md: 3 } }}>
      <Container maxWidth="xl">
        {/* Logo oben */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center',
          mb: { xs: 2, md: 4 },
          px: { xs: 2, sm: 0 }
        }}>
          <Box sx={{ 
            position: 'relative',
            height: { xs: 100, sm: 150, md: 220 },
            width: { xs: '100%', sm: 500, md: 880 },
            maxWidth: '100%'
          }}>
            <Image
              src="/images/connection-key-logo.png"
              alt="The Connection Key - Reading Design Tool"
              fill
              style={{ objectFit: 'contain' }}
              priority
              sizes="(max-width: 600px) 100vw, (max-width: 960px) 500px, 880px"
            />
          </Box>
        </Box>
        
        {/* Anleitung / Tutorial Card */}
        <Card sx={{ 
          mb: 3, 
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(232, 184, 109, 0.3)',
          boxShadow: '0 8px 32px rgba(232, 184, 109, 0.2)',
          overflow: 'visible'
        }}>
          <CardContent sx={{ overflow: 'visible' }}>
            <Typography variant="h6" sx={{ color: '#FFD700', fontWeight: 700, mb: { xs: 2, md: 3 }, display: 'flex', alignItems: 'center', gap: 1, fontSize: { xs: '1rem', md: '1.25rem' } }}>
              <Sparkles size={24} color="#FFD700" />
              📋 So nutzt du das Human Design Tool in 4 einfachen Schritten:
            </Typography>
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }, 
              gap: 2,
              overflow: 'visible'
            }}>
              {/* Schritt 1 */}
              <Box sx={{ 
                p: 2.5, 
                background: 'rgba(255, 255, 255, 0.08)', 
                borderRadius: 3,
                border: '3px solid transparent',
                backgroundImage: 'linear-gradient(#1a1a1a, #1a1a1a), linear-gradient(135deg, #FFD700, #FFA500)',
                backgroundOrigin: 'border-box',
                backgroundClip: 'padding-box, border-box',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 24px rgba(255, 215, 0, 0.4)',
                  background: 'rgba(255, 255, 255, 0.12)'
                }
              }}>
                <Typography sx={{ 
                  background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  fontWeight: 700, 
                  fontSize: '1.8rem', 
                  mb: 1 
                }}>1</Typography>
                <Typography sx={{ color: 'white', fontWeight: 700, fontSize: '1rem', mb: 1 }}>
                  Persönliche Daten
                </Typography>
                <Typography sx={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.8rem', lineHeight: 1.4 }}>
                  Name, Geburtsdatum & Geburtszeit eingeben
                </Typography>
              </Box>
              
              {/* Schritt 2 - Highlight */}
              <Box sx={{ 
                p: 2.5, 
                background: 'rgba(255, 215, 0, 0.15)', 
                borderRadius: 3, 
                border: '4px solid transparent',
                backgroundImage: 'linear-gradient(rgba(255, 215, 0, 0.15), rgba(255, 215, 0, 0.15)), linear-gradient(135deg, #FFD700, #FFA500)',
                backgroundOrigin: 'border-box',
                backgroundClip: 'padding-box, border-box',
                position: 'relative',
                boxShadow: '0 0 30px rgba(255, 215, 0, 0.5)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 40px rgba(255, 215, 0, 0.7)'
                }
              }}>
                <Typography sx={{ 
                  background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  fontWeight: 700, 
                  fontSize: '1.8rem', 
                  mb: 1 
                }}>2</Typography>
                <Typography sx={{ color: 'white', fontWeight: 700, fontSize: '1rem', mb: 1 }}>
                  Tore berechnen →
                </Typography>
                <Typography sx={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '0.8rem', lineHeight: 1.4 }}>
                  Rechts auf "Tore berechnen" klicken
                </Typography>
                <Box sx={{
                  position: 'absolute',
                  top: '50%',
                  right: { xs: 5, md: -40 },
                  transform: 'translateY(-50%)',
                  fontSize: '2rem',
                  animation: 'arrow-bounce 1s infinite',
                  '@keyframes arrow-bounce': {
                    '0%, 100%': { transform: 'translateY(-50%) translateX(0)' },
                    '50%': { transform: 'translateY(-50%) translateX(10px)' }
                  }
                }}>
                  👉
                </Box>
              </Box>
              
              {/* Schritt 3 */}
              <Box sx={{ 
                p: 2.5, 
                background: 'rgba(255, 255, 255, 0.08)', 
                borderRadius: 3,
                border: '3px solid transparent',
                backgroundImage: 'linear-gradient(#1a1a1a, #1a1a1a), linear-gradient(135deg, #FFD700, #FFA500)',
                backgroundOrigin: 'border-box',
                backgroundClip: 'padding-box, border-box',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 24px rgba(255, 215, 0, 0.4)',
                  background: 'rgba(255, 255, 255, 0.12)'
                }
              }}>
                <Typography sx={{ 
                  background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  fontWeight: 700, 
                  fontSize: '1.8rem', 
                  mb: 1 
                }}>3</Typography>
                <Typography sx={{ color: 'white', fontWeight: 700, fontSize: '1rem', mb: 1 }}>
                  Werte übernehmen
                </Typography>
                <Typography sx={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.8rem', lineHeight: 1.4 }}>
                  Gates, Profil & Kanäle automatisch einfügen
                </Typography>
              </Box>
              
              {/* Schritt 4 */}
              <Box sx={{ 
                p: 2.5, 
                background: 'rgba(255, 255, 255, 0.08)', 
                borderRadius: 3,
                border: '3px solid transparent',
                backgroundImage: 'linear-gradient(#1a1a1a, #1a1a1a), linear-gradient(135deg, #FFD700, #FFA500)',
                backgroundOrigin: 'border-box',
                backgroundClip: 'padding-box, border-box',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 24px rgba(255, 215, 0, 0.4)',
                  background: 'rgba(255, 255, 255, 0.12)'
                }
              }}>
                <Typography sx={{ 
                  background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  fontWeight: 700, 
                  fontSize: '1.8rem', 
                  mb: 1 
                }}>4</Typography>
                <Typography sx={{ color: 'white', fontWeight: 700, fontSize: '1rem', mb: 1 }}>
                  Fertigstellen
                </Typography>
                <Typography sx={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.8rem', lineHeight: 1.4 }}>
                  Typ & Autorität auswählen, dann PDF export
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: { xs: 2, md: 3 } }}>
          {/* Linke Seite: Eingabeformular */}
          <Paper sx={{ 
            flex: 1, 
            p: { xs: 2, md: 3 }, 
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, mb: { xs: 2, md: 3 }, gap: { xs: 2, sm: 0 } }}>
              <Typography variant="h5" sx={{ color: '#FFD700', display: 'flex', alignItems: 'center', gap: 1, fontSize: { xs: '1.25rem', md: '1.5rem' } }}>
                <Book size={24} />
                Human Design Daten
              </Typography>
              
              <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 250 } }}>
                <InputLabel sx={{ color: 'white' }}>Reading-Typ</InputLabel>
                <Select
                  value={readingType}
                  onChange={(e) => setReadingType(e.target.value)}
                  sx={{ color: 'white', '.MuiOutlinedInput-notchedOutline': { borderColor: '#FFD700' } }}
                >
                  <MenuItem value="basis">📄 Basis Reading</MenuItem>
                  <MenuItem value="erweitert">✨ Erweitertes Reading</MenuItem>
                  <MenuItem value="folge">📚 Weitere Folgen</MenuItem>
                  <MenuItem value="connectionKey">🩵 The Connection Key</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Tabs 
              value={activeTab} 
              onChange={(e, v) => setActiveTab(v)} 
              sx={{ mb: { xs: 2, md: 3 } }}
              variant="scrollable"
              scrollButtons="auto"
              allowScrollButtonsMobile
            >
              <Tab label="📊 Übersicht" sx={{ color: 'white', fontWeight: activeTab === 0 ? 700 : 400, fontSize: { xs: '0.75rem', sm: '0.875rem' }, minWidth: { xs: 'auto', sm: 160 } }} />
              <Tab label="👤 Persönlich" sx={{ color: 'white', fontWeight: activeTab === 1 ? 700 : 400, fontSize: { xs: '0.75rem', sm: '0.875rem' }, minWidth: { xs: 'auto', sm: 160 } }} />
              <Tab label="✨ HD" sx={{ color: 'white', fontWeight: activeTab === 2 ? 700 : 400, fontSize: { xs: '0.75rem', sm: '0.875rem' }, minWidth: { xs: 'auto', sm: 160 } }} />
              <Tab label="🔷 Zentren" sx={{ color: 'white', fontWeight: activeTab === 3 ? 700 : 400, fontSize: { xs: '0.75rem', sm: '0.875rem' }, minWidth: { xs: 'auto', sm: 160 } }} />
              <Tab label="🌍 Planeten" sx={{ color: 'white', fontWeight: activeTab === 4 ? 700 : 400, fontSize: { xs: '0.75rem', sm: '0.875rem' }, minWidth: { xs: 'auto', sm: 160 } }} />
            </Tabs>

            {/* Tab 0: Reading Übersicht */}
            {activeTab === 0 && (
              <>
                <Alert severity="success" sx={{ mb: 3, background: 'rgba(76, 175, 80, 0.2)', color: 'white', border: '1px solid #4caf50' }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                    📋 Reading-Aufbau im Überblick
                  </Typography>
                  <Typography variant="caption">
                    Hier siehst du, welche Abschnitte bereits ausgefüllt sind und wo du noch Textbausteine hinzufügen kannst!
                  </Typography>
                </Alert>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {/* Persönliche Daten */}
                  <Card sx={{ 
                    background: readingData.name && readingData.geburtsdatum 
                      ? 'linear-gradient(135deg, rgba(76, 175, 80, 0.2) 0%, rgba(76, 175, 80, 0.1) 100%)'
                      : 'linear-gradient(135deg, rgba(255, 152, 0, 0.2) 0%, rgba(255, 152, 0, 0.1) 100%)',
                    border: readingData.name && readingData.geburtsdatum ? '2px solid #4caf50' : '2px solid #ff9800'
                  }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6" sx={{ color: 'white', display: 'flex', alignItems: 'center', gap: 1 }}>
                          {readingData.name && readingData.geburtsdatum ? '✅' : '⚠️'} 1. Persönliche Daten
                        </Typography>
                        <Button size="small" onClick={() => setActiveTab(1)} sx={{ color: '#FFD700' }}>
                          Bearbeiten →
                        </Button>
                      </Box>
                      <Typography variant="body2" color="white" sx={{ opacity: 0.8 }}>
                        Name: {readingData.name || '❌ Nicht ausgefüllt'}<br />
                        Geburtsdatum: {readingData.geburtsdatum || '❌ Nicht ausgefüllt'}<br />
                        Geburtszeit: {readingData.geburtszeit || '❌ Nicht ausgefüllt'}
                      </Typography>
                    </CardContent>
                  </Card>

                  {/* Typ & Autorität */}
                  <Card sx={{ 
                    background: readingData.typ && readingData.autoritaet 
                      ? 'linear-gradient(135deg, rgba(76, 175, 80, 0.2) 0%, rgba(76, 175, 80, 0.1) 100%)'
                      : 'linear-gradient(135deg, rgba(244, 67, 54, 0.2) 0%, rgba(244, 67, 54, 0.1) 100%)',
                    border: readingData.typ && readingData.autoritaet ? '2px solid #4caf50' : '2px solid #f44336'
                  }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6" sx={{ color: 'white', display: 'flex', alignItems: 'center', gap: 1 }}>
                          {readingData.typ && readingData.autoritaet ? '✅' : '❌'} 2. Typ & Autorität
                        </Typography>
                        <Button size="small" onClick={() => setActiveTab(2)} sx={{ color: '#FFD700' }}>
                          Bearbeiten →
                        </Button>
                      </Box>
                      <Typography variant="body2" color="white" sx={{ opacity: 0.8 }}>
                        Typ: {readingData.typ || '❌ Nicht ausgefüllt'}<br />
                        Autorität: {readingData.autoritaet || '❌ Nicht ausgefüllt'}
                      </Typography>
                    </CardContent>
                  </Card>

                  {/* Profil */}
                  <Card sx={{ 
                    background: readingData.profil 
                      ? 'linear-gradient(135deg, rgba(76, 175, 80, 0.2) 0%, rgba(76, 175, 80, 0.1) 100%)'
                      : 'linear-gradient(135deg, rgba(255, 152, 0, 0.2) 0%, rgba(255, 152, 0, 0.1) 100%)',
                    border: readingData.profil ? '2px solid #4caf50' : '2px solid #ff9800'
                  }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6" sx={{ color: 'white', display: 'flex', alignItems: 'center', gap: 1 }}>
                          {readingData.profil ? '✅' : '⚠️'} 3. Profil
                        </Typography>
                        <Button size="small" onClick={() => setActiveTab(2)} sx={{ color: '#FFD700' }}>
                          Bearbeiten →
                        </Button>
                      </Box>
                      <Typography variant="body2" color="white" sx={{ opacity: 0.8 }}>
                        Profil: {readingData.profil || '❌ Nicht ausgefüllt'}
                      </Typography>
                    </CardContent>
                  </Card>

                  {/* Inkarnationskreuz */}
                  {calculatedGates && calculatedGates.incarnationCross && (
                    <Card sx={{ 
                      background: 'linear-gradient(135deg, rgba(156, 39, 176, 0.2) 0%, rgba(156, 39, 176, 0.1) 100%)',
                      border: '2px solid #9c27b0'
                    }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                          <Typography variant="h6" sx={{ color: 'white', display: 'flex', alignItems: 'center', gap: 1 }}>
                            ✨ 3b. Inkarnationskreuz
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="white" sx={{ opacity: 0.8, mb: 1 }}>
                          <strong>{calculatedGates.incarnationCross.type}-Kreuz</strong>
                        </Typography>
                        <Typography variant="caption" color="white" sx={{ opacity: 0.7, display: 'block' }}>
                          {calculatedGates.incarnationCross.name}
                        </Typography>
                        <Typography variant="caption" color="white" sx={{ opacity: 0.6, display: 'block', mt: 0.5 }}>
                          Tore: {calculatedGates.incarnationCross.personalitySunGate}, {calculatedGates.incarnationCross.personalityEarthGate}, {calculatedGates.incarnationCross.designSunGate}, {calculatedGates.incarnationCross.designEarthGate}
                        </Typography>
                      </CardContent>
                    </Card>
                  )}

                  {/* Zentren */}
                  <Card sx={{ 
                    background: readingData.krone || readingData.ajna || readingData.kehle 
                      ? 'linear-gradient(135deg, rgba(76, 175, 80, 0.2) 0%, rgba(76, 175, 80, 0.1) 100%)'
                      : 'linear-gradient(135deg, rgba(255, 152, 0, 0.2) 0%, rgba(255, 152, 0, 0.1) 100%)',
                    border: readingData.krone || readingData.ajna || readingData.kehle ? '2px solid #4caf50' : '2px solid #ff9800'
                  }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6" sx={{ color: 'white', display: 'flex', alignItems: 'center', gap: 1 }}>
                          {readingData.krone || readingData.ajna || readingData.kehle ? '✅' : '⚠️'} 4. Zentren (9 Stück)
                        </Typography>
                        <Button size="small" onClick={() => setActiveTab(3)} sx={{ color: '#FFD700' }}>
                          Bearbeiten →
                        </Button>
                      </Box>
                      <Typography variant="body2" color="white" sx={{ opacity: 0.8 }}>
                        {[readingData.krone, readingData.ajna, readingData.kehle, readingData.gZentrum, 
                          readingData.herzEgo, readingData.sakral, readingData.solarplexus, 
                          readingData.milz, readingData.wurzel].filter(z => z).length} von 9 ausgefüllt
                      </Typography>
                    </CardContent>
                  </Card>

                  {/* Kanäle */}
                  <Card sx={{ 
                    background: readingData.kanaele 
                      ? 'linear-gradient(135deg, rgba(76, 175, 80, 0.2) 0%, rgba(76, 175, 80, 0.1) 100%)'
                      : 'linear-gradient(135deg, rgba(255, 152, 0, 0.2) 0%, rgba(255, 152, 0, 0.1) 100%)',
                    border: readingData.kanaele ? '2px solid #4caf50' : '2px solid #ff9800'
                  }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6" sx={{ color: 'white', display: 'flex', alignItems: 'center', gap: 1 }}>
                          {readingData.kanaele ? '✅' : '⚠️'} 5. Kanäle
                        </Typography>
                        <Button size="small" onClick={() => setActiveTab(2)} sx={{ color: '#FFD700' }}>
                          Bearbeiten →
                        </Button>
                      </Box>
                      <Typography variant="body2" color="white" sx={{ opacity: 0.8 }}>
                        {readingData.kanaele || '❌ Nicht ausgefüllt'}
                      </Typography>
                    </CardContent>
                  </Card>

                  {/* Hinweis zu Textbausteinen */}
                  <Alert severity="info" sx={{ background: 'rgba(102, 126, 234, 0.2)', color: 'white', border: '1px solid #667eea' }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                      💡 Tipp: Textbausteine hinzufügen
                    </Typography>
                    <Typography variant="caption">
                      Öffne das "Textbausteine"-Menü oben rechts, um vorgefertigte Beschreibungen für Typ, Autorität, Profil, Zentren und Kanäle hinzuzufügen!
                    </Typography>
                  </Alert>
                </Box>
              </>
            )}

            {/* Tab 1: Persönliche Daten */}
            {activeTab === 1 && (
              <>
                <Alert severity="info" sx={{ mb: 3, background: 'rgba(102, 126, 234, 0.2)', color: 'white', border: '1px solid #667eea' }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                    📝 Schritt 1: Persönliche Daten eingeben
                  </Typography>
                  <Typography variant="caption">
                    Gib hier die grundlegenden Informationen ein. <strong>Geburtsdatum & -zeit</strong> sind wichtig für die Tor-Berechnung! ⏰
                  </Typography>
                </Alert>

                <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Name"
                    value={readingData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    sx={{ 
                      '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                      '& .MuiOutlinedInput-root': { 
                        color: 'white',
                        '& fieldset': { borderColor: 'rgba(255, 215, 0, 0.3)' }
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Geschlecht</InputLabel>
                    <Select
                      value={readingData.geschlecht}
                      onChange={(e) => handleInputChange('geschlecht', e.target.value)}
                      sx={{ 
                        color: 'white',
                        '& fieldset': { borderColor: 'rgba(255, 215, 0, 0.3)' }
                      }}
                    >
                      <MenuItem value="männlich">Männlich</MenuItem>
                      <MenuItem value="weiblich">Weiblich</MenuItem>
                      <MenuItem value="divers">Divers</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Geburtsdatum"
                    type="date"
                    value={readingData.geburtsdatum}
                    onChange={(e) => handleInputChange('geburtsdatum', e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    sx={{ 
                      '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                      '& .MuiOutlinedInput-root': { 
                        color: 'white',
                        '& fieldset': { borderColor: 'rgba(255, 215, 0, 0.3)' }
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Geburtszeit"
                    type="time"
                    value={readingData.geburtszeit}
                    onChange={(e) => handleInputChange('geburtszeit', e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    sx={{ 
                      '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                      '& .MuiOutlinedInput-root': { 
                        color: 'white',
                        '& fieldset': { borderColor: 'rgba(255, 215, 0, 0.3)' }
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Geburtsort"
                    value={readingData.geburtsort}
                    onChange={(e) => handleInputChange('geburtsort', e.target.value)}
                    sx={{ 
                      '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                      '& .MuiOutlinedInput-root': { 
                        color: 'white',
                        '& fieldset': { borderColor: 'rgba(255, 215, 0, 0.3)' }
                      }
                    }}
                  />
                </Grid>
              </Grid>
              
              {/* Person 2 Sektion - nur bei Connection Key */}
              {readingType === 'connectionKey' && (
                <Box sx={{ mt: 4, pt: 4, borderTop: '2px solid rgba(138, 43, 226, 0.5)' }}>
                  <Alert severity="success" sx={{ mb: 3, background: 'rgba(138, 43, 226, 0.2)', color: 'white', border: '1px solid #8a2be2' }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                      🩵 Person 2 - Für The Connection Key
                    </Typography>
                    <Typography variant="caption">
                      Gib die Daten der zweiten Person ein, um die Resonanzanalyse durchzuführen.
                    </Typography>
                  </Alert>

                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Name (Person 2)"
                        value={person2Data.name}
                        onChange={(e) => setPerson2Data(prev => ({ ...prev, name: e.target.value }))}
                        sx={{ 
                          '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                          '& .MuiOutlinedInput-root': { 
                            color: 'white',
                            '& fieldset': { borderColor: 'rgba(138, 43, 226, 0.5)' }
                          }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Geschlecht</InputLabel>
                        <Select
                          value={person2Data.geschlecht}
                          onChange={(e) => setPerson2Data(prev => ({ ...prev, geschlecht: e.target.value }))}
                          sx={{ 
                            color: 'white',
                            '& fieldset': { borderColor: 'rgba(138, 43, 226, 0.5)' }
                          }}
                        >
                          <MenuItem value="männlich">Männlich</MenuItem>
                          <MenuItem value="weiblich">Weiblich</MenuItem>
                          <MenuItem value="divers">Divers</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Geburtsdatum"
                        type="date"
                        value={person2Data.geburtsdatum}
                        onChange={(e) => setPerson2Data(prev => ({ ...prev, geburtsdatum: e.target.value }))}
                        InputLabelProps={{ shrink: true }}
                        sx={{ 
                          '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                          '& .MuiOutlinedInput-root': { 
                            color: 'white',
                            '& fieldset': { borderColor: 'rgba(138, 43, 226, 0.5)' }
                          }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Geburtszeit"
                        type="time"
                        value={person2Data.geburtszeit}
                        onChange={(e) => setPerson2Data(prev => ({ ...prev, geburtszeit: e.target.value }))}
                        InputLabelProps={{ shrink: true }}
                        sx={{ 
                          '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                          '& .MuiOutlinedInput-root': { 
                            color: 'white',
                            '& fieldset': { borderColor: 'rgba(138, 43, 226, 0.5)' }
                          }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Geburtsort"
                        value={person2Data.geburtsort}
                        onChange={(e) => setPerson2Data(prev => ({ ...prev, geburtsort: e.target.value }))}
                        sx={{ 
                          '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                          '& .MuiOutlinedInput-root': { 
                            color: 'white',
                            '& fieldset': { borderColor: 'rgba(138, 43, 226, 0.5)' }
                          }
                        }}
                      />
                    </Grid>
                    
                    {/* Basic HD Data für Person 2 */}
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Typ"
                        value={person2Data.typ}
                        onChange={(e) => setPerson2Data(prev => ({ ...prev, typ: e.target.value }))}
                        placeholder="z.B. Generator"
                        sx={{ 
                          '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                          '& .MuiOutlinedInput-root': { 
                            color: 'white',
                            '& fieldset': { borderColor: 'rgba(138, 43, 226, 0.5)' }
                          }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Profil"
                        value={person2Data.profil}
                        onChange={(e) => setPerson2Data(prev => ({ ...prev, profil: e.target.value }))}
                        placeholder="z.B. 6/2"
                        sx={{ 
                          '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                          '& .MuiOutlinedInput-root': { 
                            color: 'white',
                            '& fieldset': { borderColor: 'rgba(138, 43, 226, 0.5)' }
                          }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Autorität"
                        value={person2Data.autoritaet}
                        onChange={(e) => setPerson2Data(prev => ({ ...prev, autoritaet: e.target.value }))}
                        placeholder="z.B. Sakral"
                        sx={{ 
                          '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                          '& .MuiOutlinedInput-root': { 
                            color: 'white',
                            '& fieldset': { borderColor: 'rgba(138, 43, 226, 0.5)' }
                          }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        multiline
                        rows={2}
                        label="Definierte Zentren"
                        value={person2Data.definiertezentren}
                        onChange={(e) => setPerson2Data(prev => ({ ...prev, definiertezentren: e.target.value }))}
                        placeholder="z.B. Sakral, G-Zentrum, Milz"
                        sx={{ 
                          '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                          '& .MuiOutlinedInput-root': { 
                            color: 'white',
                            '& fieldset': { borderColor: 'rgba(138, 43, 226, 0.5)' }
                          }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        multiline
                        rows={2}
                        label="Offene Zentren"
                        value={person2Data.offenezentren}
                        onChange={(e) => setPerson2Data(prev => ({ ...prev, offenezentren: e.target.value }))}
                        placeholder="z.B. Krone, Ajna, Solarplexus"
                        sx={{ 
                          '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                          '& .MuiOutlinedInput-root': { 
                            color: 'white',
                            '& fieldset': { borderColor: 'rgba(138, 43, 226, 0.5)' }
                          }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        multiline
                        rows={3}
                        label="Definierte Tore"
                        value={person2Data.definierteTore}
                        onChange={(e) => setPerson2Data(prev => ({ ...prev, definierteTore: e.target.value }))}
                        placeholder="z.B. 1, 8, 13, 34, 57, 10 (kommasepariert)"
                        sx={{ 
                          '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                          '& .MuiOutlinedInput-root': { 
                            color: 'white',
                            '& fieldset': { borderColor: 'rgba(138, 43, 226, 0.5)' }
                          }
                        }}
                      />
                    </Grid>
                    
                    {/* Gate Calculator Button für Person 2 */}
                    <Grid item xs={12}>
                      <Alert severity="info" sx={{ mb: 2, background: 'rgba(138, 43, 226, 0.2)', color: 'white', border: '1px solid #8a2be2' }}>
                        <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                          🚀 Automatische Berechnung
                        </Typography>
                        <Typography variant="caption">
                          Nutze den <strong>Gate Calculator</strong> für automatische Berechnung aller Tore, Zentren, Typ & Autorität!
                        </Typography>
                      </Alert>
                      
                      <Button
                        fullWidth
                        variant="contained"
                        startIcon={<Calculator />}
                        onClick={calculateGatesPerson2}
                        disabled={!person2Data.geburtsdatum}
                        sx={{
                          background: 'linear-gradient(135deg, #8a2be2 0%, #9d4edd 100%)',
                          color: 'white',
                          fontWeight: 600,
                          py: 1.5,
                          '&:hover': {
                            background: 'linear-gradient(135deg, #9d4edd 0%, #c77dff 100%)',
                            transform: 'scale(1.02)'
                          },
                          '&:disabled': {
                            background: 'rgba(138, 43, 226, 0.3)',
                            color: 'rgba(255, 255, 255, 0.5)'
                          },
                          transition: 'all 0.3s ease'
                        }}
                      >
                        {person2Data.geburtsdatum 
                          ? '✨ Tore berechnen (Person 2)' 
                          : '⚠️ Erst Geburtsdatum eingeben'}
                      </Button>
                      
                      {calculatedGatesPerson2 && (
                        <Alert severity="success" sx={{ mt: 2, background: 'rgba(76, 175, 80, 0.2)', color: 'white', border: '1px solid #4caf50' }}>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            ✅ Berechnung erfolgreich!
                          </Typography>
                          <Typography variant="caption">
                            {calculatedGatesPerson2.profile && `Profil: ${calculatedGatesPerson2.profile} • `}
                            {calculatedGatesPerson2.typeAuthority && `Typ: ${calculatedGatesPerson2.typeAuthority.type} • `}
                            {calculatedGatesPerson2.channels && `${calculatedGatesPerson2.channels.length} Kanäle`}
                          </Typography>
                        </Alert>
                      )}
                    </Grid>
                  </Grid>
                </Box>
              )}
              </>
            )}

            {/* Tab 2: Human Design Grunddaten */}
            {activeTab === 2 && (
              <>
                <Alert severity="success" sx={{ mb: 3, background: 'rgba(76, 175, 80, 0.2)', color: 'white', border: '1px solid #4caf50' }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                    🎯 Schritt 2: Human Design Daten
                  </Typography>
                  <Typography variant="caption">
                    Wähle Typ & Autorität. Die <strong>Gates & Profil</strong> werden automatisch berechnet → Nutze den <strong>Gate Calculator rechts!</strong> ➡️
                  </Typography>
                </Alert>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Typ</InputLabel>
                    <Select
                      value={readingData.typ}
                      onChange={(e) => handleInputChange('typ', e.target.value)}
                      sx={{ 
                        color: 'white',
                        '& fieldset': { borderColor: 'rgba(255, 215, 0, 0.3)' }
                      }}
                    >
                      <MenuItem value="Generator">Generator</MenuItem>
                      <MenuItem value="Manifestierender Generator">Manifestierender Generator</MenuItem>
                      <MenuItem value="Manifestor">Manifestor</MenuItem>
                      <MenuItem value="Projektor">Projektor</MenuItem>
                      <MenuItem value="Reflektor">Reflektor</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Strategie"
                    value={readingData.strategie}
                    onChange={(e) => handleInputChange('strategie', e.target.value)}
                    sx={{ 
                      '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                      '& .MuiOutlinedInput-root': { 
                        color: 'white',
                        '& fieldset': { borderColor: 'rgba(255, 215, 0, 0.3)' }
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Signatur"
                    value={readingData.signatur}
                    onChange={(e) => handleInputChange('signatur', e.target.value)}
                    sx={{ 
                      '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                      '& .MuiOutlinedInput-root': { 
                        color: 'white',
                        '& fieldset': { borderColor: 'rgba(255, 215, 0, 0.3)' }
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Nicht-Selbst"
                    value={readingData.nichtSelbst}
                    onChange={(e) => handleInputChange('nichtSelbst', e.target.value)}
                    sx={{ 
                      '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                      '& .MuiOutlinedInput-root': { 
                        color: 'white',
                        '& fieldset': { borderColor: 'rgba(255, 215, 0, 0.3)' }
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Profil"
                    value={readingData.profil}
                    onChange={(e) => handleInputChange('profil', e.target.value)}
                    placeholder="z.B. 1/3"
                    sx={{ 
                      '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                      '& .MuiOutlinedInput-root': { 
                        color: 'white',
                        '& fieldset': { borderColor: 'rgba(255, 215, 0, 0.3)' }
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Autorität"
                    value={readingData.autoritaet}
                    onChange={(e) => handleInputChange('autoritaet', e.target.value)}
                    sx={{ 
                      '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                      '& .MuiOutlinedInput-root': { 
                        color: 'white',
                        '& fieldset': { borderColor: 'rgba(255, 215, 0, 0.3)' }
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Definition"
                    value={readingData.definition}
                    onChange={(e) => handleInputChange('definition', e.target.value)}
                    sx={{ 
                      '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                      '& .MuiOutlinedInput-root': { 
                        color: 'white',
                        '& fieldset': { borderColor: 'rgba(255, 215, 0, 0.3)' }
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Inkarnationskreuz"
                    value={readingData.inkarnationskreuz}
                    onChange={(e) => handleInputChange('inkarnationskreuz', e.target.value)}
                    sx={{ 
                      '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                      '& .MuiOutlinedInput-root': { 
                        color: 'white',
                        '& fieldset': { borderColor: 'rgba(255, 215, 0, 0.3)' }
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Bewusste Sonne"
                    value={readingData.bewussteSonne}
                    onChange={(e) => handleInputChange('bewussteSonne', e.target.value)}
                    placeholder="Tor.Linie"
                    sx={{ 
                      '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                      '& .MuiOutlinedInput-root': { 
                        color: 'white',
                        '& fieldset': { borderColor: 'rgba(255, 215, 0, 0.3)' }
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Bewusste Erde"
                    value={readingData.bewussteErde}
                    onChange={(e) => handleInputChange('bewussteErde', e.target.value)}
                    placeholder="Tor.Linie"
                    sx={{ 
                      '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                      '& .MuiOutlinedInput-root': { 
                        color: 'white',
                        '& fieldset': { borderColor: 'rgba(255, 215, 0, 0.3)' }
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Unbewusste Sonne"
                    value={readingData.unbewussteSonne}
                    onChange={(e) => handleInputChange('unbewussteSonne', e.target.value)}
                    placeholder="Tor.Linie"
                    sx={{ 
                      '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                      '& .MuiOutlinedInput-root': { 
                        color: 'white',
                        '& fieldset': { borderColor: 'rgba(255, 215, 0, 0.3)' }
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Unbewusste Erde"
                    value={readingData.unbewussteErde}
                    onChange={(e) => handleInputChange('unbewussteErde', e.target.value)}
                    placeholder="Tor.Linie"
                    sx={{ 
                      '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                      '& .MuiOutlinedInput-root': { 
                        color: 'white',
                        '& fieldset': { borderColor: 'rgba(255, 215, 0, 0.3)' }
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Kanäle"
                    value={readingData.kanaele}
                    onChange={(e) => handleInputChange('kanaele', e.target.value)}
                    placeholder="Liste der Kanäle mit Beschreibung"
                    sx={{ 
                      '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                      '& .MuiOutlinedInput-root': { 
                        color: 'white',
                        '& fieldset': { borderColor: 'rgba(255, 215, 0, 0.3)' }
                      }
                    }}
                  />
                </Grid>
              </Grid>
              </>
            )}

            {/* Tab 3: Zentren */}
            {activeTab === 3 && (
              <>
                <Alert severity="warning" sx={{ mb: 3, background: 'rgba(255, 152, 0, 0.2)', color: 'white', border: '1px solid #ff9800' }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                    ⚡ Optional: Zentren definieren
                  </Typography>
                  <Typography variant="caption">
                    Wähle für jedes Zentrum ob es <strong>definiert, offen oder undefiniert</strong> ist. Du kannst diesen Tab auch überspringen.
                  </Typography>
                </Alert>

              <Grid container spacing={2}>
                {['krone', 'ajna', 'kehle', 'gZentrum', 'herzEgo', 'sakral', 'solarplexus', 'milz', 'wurzel'].map((zentrum) => (
                  <Grid item xs={12} sm={6} key={zentrum}>
                    <FormControl fullWidth>
                      <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        {zentrum === 'gZentrum' ? 'G-Zentrum' : zentrum === 'herzEgo' ? 'Herz/Ego' : zentrum.charAt(0).toUpperCase() + zentrum.slice(1)}
                      </InputLabel>
                      <Select
                        value={readingData[zentrum as keyof ReadingData]}
                        onChange={(e) => handleInputChange(zentrum as keyof ReadingData, e.target.value)}
                        sx={{ 
                          color: 'white',
                          '& fieldset': { borderColor: 'rgba(255, 215, 0, 0.3)' }
                        }}
                      >
                        <MenuItem value="definiert">Definiert</MenuItem>
                        <MenuItem value="offen">Offen</MenuItem>
                        <MenuItem value="undefiniert">Undefiniert</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                ))}
              </Grid>
              </>
            )}

            {/* Tab 4: Planeten */}
            {activeTab === 4 && (
              <>
                <Alert severity="info" sx={{ mb: 3, background: 'rgba(156, 39, 176, 0.2)', color: 'white', border: '1px solid #9c27b0' }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                    🪐 Optional: Planeten-Aktivierungen
                  </Typography>
                  <Typography variant="caption">
                    Diese Felder werden automatisch gefüllt wenn du den <strong>Gate Calculator</strong> nutzt. Du kannst sie auch manuell eingeben.
                  </Typography>
                </Alert>

              <Grid container spacing={2}>
                {[
                  { key: 'sonne', label: '☉ Sonne' },
                  { key: 'mond', label: '🌙 Mond' },
                  { key: 'merkur', label: '☿ Merkur' },
                  { key: 'venus', label: '♀ Venus' },
                  { key: 'mars', label: '♂ Mars' },
                  { key: 'jupiter', label: '♃ Jupiter' },
                  { key: 'saturn', label: '♄ Saturn' },
                  { key: 'suedknoten', label: 'Südknoten' },
                  { key: 'nordknoten', label: 'Nordknoten' }
                ].map((planet) => (
                  <Grid item xs={12} sm={6} key={planet.key}>
                    <TextField
                      fullWidth
                      label={planet.label}
                      value={readingData[planet.key as keyof ReadingData]}
                      onChange={(e) => handleInputChange(planet.key as keyof ReadingData, e.target.value)}
                      placeholder="Tor.Linie"
                      sx={{ 
                        '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                        '& .MuiOutlinedInput-root': { 
                          color: 'white',
                          '& fieldset': { borderColor: 'rgba(255, 215, 0, 0.3)' }
                        }
                      }}
                    />
                  </Grid>
                ))}
              </Grid>
              </>
            )}

            {/* Aktions-Buttons */}
            <Box sx={{ display: 'flex', gap: 2, mt: 4, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                startIcon={<Book />}
                onClick={() => setShowTextbausteine(true)}
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)'
                  }
                }}
              >
                Textbausteine
              </Button>
              <Button
                variant="contained"
                startIcon={<Eye />}
                onClick={() => setShowPreview(true)}
                sx={{
                  background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #f5576c 0%, #f093fb 100%)'
                  }
                }}
              >
                Vorschau
              </Button>
              <Button
                variant="contained"
                startIcon={<Save />}
                onClick={handleSave}
                sx={{
                  background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)'
                  }
                }}
              >
                Speichern
              </Button>
              {/* Connection Key Analyse Button - nur bei Connection Key */}
              {readingType === 'connectionKey' && (
                <Button
                  variant="contained"
                  startIcon={<Calculator />}
                  onClick={analyzeConnectionKey}
                  sx={{
                    background: 'linear-gradient(135deg, #8a2be2, #9d4edd)',
                    color: 'white',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #9d4edd, #c77dff)'
                    }
                  }}
                >
                  🩵 Resonanzanalyse
                </Button>
              )}
              
              <Button
                variant="contained"
                startIcon={<FileDown />}
                onClick={handleExportPDF}
                sx={{
                  background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                  color: '#000',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #FFA500, #FF8C00)'
                  }
                }}
              >
                PDF Export
              </Button>
            </Box>
            
            {/* Connection Key Ergebnis-Anzeige */}
            {connectionKeyResult && readingType === 'connectionKey' && (
              <Box sx={{ mt: 4, p: 3, background: 'linear-gradient(135deg, rgba(138, 43, 226, 0.2) 0%, rgba(75, 0, 130, 0.2) 100%)', borderRadius: 2, border: '2px solid #8a2be2' }}>
                <Typography variant="h5" sx={{ color: '#FFD700', fontWeight: 700, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                  🩵 Connection Key Analyse - Ergebnisse
                </Typography>
                
                {/* Zusammenfassung */}
                <Card sx={{ mb: 3, background: 'rgba(0, 0, 0, 0.3)' }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>📊 Zusammenfassung</Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={4}>
                        <Box sx={{ textAlign: 'center', p: 2, background: 'rgba(255, 215, 0, 0.2)', borderRadius: 2 }}>
                          <Typography variant="h4" sx={{ color: '#FFD700', fontWeight: 700 }}>
                            {connectionKeyResult.summary.totalResonancePoints}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'white' }}>Resonanzpunkte</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={4}>
                        <Box sx={{ textAlign: 'center', p: 2, background: 'rgba(76, 175, 80, 0.2)', borderRadius: 2 }}>
                          <Typography variant="h4" sx={{ color: '#4caf50', fontWeight: 700 }}>
                            {connectionKeyResult.summary.connectionStrength}%
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'white' }}>Verbindungsstärke</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={4}>
                        <Box sx={{ textAlign: 'center', p: 2, background: 'rgba(255, 152, 0, 0.2)', borderRadius: 2 }}>
                          <Typography variant="h4" sx={{ color: '#ff9800', fontWeight: 700 }}>
                            {connectionKeyResult.goldenThreads.length}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'white' }}>Goldadern</Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
                
                {/* Goldadern */}
                {connectionKeyResult.goldenThreads.length > 0 && (
                  <Card sx={{ mb: 3, background: 'rgba(0, 0, 0, 0.3)' }}>
                    <CardContent>
                      <Typography variant="h6" sx={{ color: '#FFD700', mb: 2 }}>
                        ✨ Goldadern - Neue Kanäle durch Verbindung
                      </Typography>
                      {connectionKeyResult.goldenThreads.map((thread, idx) => (
                        <Box key={idx} sx={{ mb: 2, p: 2, background: 'rgba(255, 215, 0, 0.1)', borderRadius: 1, borderLeft: '4px solid #FFD700' }}>
                          <Typography variant="body1" sx={{ color: 'white', fontWeight: 700, mb: 0.5 }}>
                            {thread.channel}: {thread.theme}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                            {thread.description}
                          </Typography>
                        </Box>
                      ))}
                    </CardContent>
                  </Card>
                )}
                
                {/* Resonanzachsen */}
                {connectionKeyResult.resonanceAxes.length > 0 && (
                  <Card sx={{ mb: 3, background: 'rgba(0, 0, 0, 0.3)' }}>
                    <CardContent>
                      <Typography variant="h6" sx={{ color: '#FFD700', mb: 2 }}>
                        🔗 Resonanzachsen ({connectionKeyResult.resonanceAxes.length})
                      </Typography>
                      {connectionKeyResult.resonanceAxes.slice(0, 5).map((axis, idx) => (
                        <Box key={idx} sx={{ mb: 1.5, p: 1.5, background: 'rgba(138, 43, 226, 0.1)', borderRadius: 1 }}>
                          <Typography variant="body2" sx={{ color: 'white', fontWeight: 600 }}>
                            {axis.channelName}: {axis.theme}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                            {axis.level === 'mental' ? '🧠 Mental' : axis.level === 'emotional' ? '❤️ Emotional' : '💪 Körperlich-energetisch'}
                          </Typography>
                        </Box>
                      ))}
                      {connectionKeyResult.resonanceAxes.length > 5 && (
                        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)', fontStyle: 'italic' }}>
                          ... und {connectionKeyResult.resonanceAxes.length - 5} weitere
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                )}
                
                {/* Zentren-Vergleich */}
                <Card sx={{ background: 'rgba(0, 0, 0, 0.3)' }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ color: '#FFD700', mb: 2 }}>
                      🔹 Zentren-Vergleich
                    </Typography>
                    {connectionKeyResult.centers.filter(c => c.type === 'resonance').length > 0 && (
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" sx={{ color: '#4caf50', fontWeight: 600, mb: 1 }}>
                          ✓ Resonanzfelder ({connectionKeyResult.centers.filter(c => c.type === 'resonance').length})
                        </Typography>
                        {connectionKeyResult.centers.filter(c => c.type === 'resonance').map((center, idx) => (
                          <Typography key={idx} variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)', display: 'block', ml: 2 }}>
                            • {center.centerName}: {center.description}
                          </Typography>
                        ))}
                      </Box>
                    )}
                    {connectionKeyResult.centers.filter(c => c.type === 'growth').length > 0 && (
                      <Box>
                        <Typography variant="body2" sx={{ color: '#ff9800', fontWeight: 600, mb: 1 }}>
                          ⚡ Wachstumsfelder ({connectionKeyResult.centers.filter(c => c.type === 'growth').length})
                        </Typography>
                        {connectionKeyResult.centers.filter(c => c.type === 'growth').map((center, idx) => (
                          <Typography key={idx} variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)', display: 'block', ml: 2 }}>
                            • {center.centerName}: {center.description}
                          </Typography>
                        ))}
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Box>
            )}
          </Paper>

          {/* Rechte Seite: Quick Info & Gate Calculator */}
          <Paper sx={{ 
            width: { xs: '100%', lg: 400 },
            p: { xs: 2, md: 3 },
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(232, 184, 109, 0.2)'
          }}>
            {/* Gate Calculator Section */}
            <Card sx={{ 
              background: '#000000',
              mb: 3,
              boxShadow: '0 8px 32px rgba(232, 184, 109, 0.3)',
              position: 'relative',
              border: '3px solid #e8b86d',
              animation: 'pulse 2s infinite',
              '@keyframes pulse': {
                '0%, 100%': {
                  boxShadow: '0 8px 32px rgba(232, 184, 109, 0.3)',
                  borderColor: '#e8b86d'
                },
                '50%': {
                  boxShadow: '0 8px 48px rgba(232, 184, 109, 0.6)',
                  borderColor: '#ffd89b'
                }
              }
            }}>
              <CardContent>
                {/* "HIER STARTEN" Banner am Anfang */}
                <Box sx={{
                  background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                  color: '#000',
                  p: 1.5,
                  mb: 2,
                  borderRadius: 2,
                  fontWeight: 700,
                  fontSize: '1rem',
                  textAlign: 'center',
                  boxShadow: '0 4px 12px rgba(255, 215, 0, 0.5)',
                  animation: 'bounce 1s infinite',
                  '@keyframes bounce': {
                    '0%, 100%': { transform: 'scale(1)' },
                    '50%': { transform: 'scale(1.05)' }
                  }
                }}>
                  👉 SCHRITT 1: HIER STARTEN! 👈
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Calculator size={24} color="#FFD700" />
                  <Typography variant="h6" sx={{ color: '#FFD700', fontWeight: 700 }}>
                    Gate Calculator
                  </Typography>
                </Box>

                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)', mb: 2, fontSize: '0.85rem', fontWeight: 600 }}>
                  ✨ Berechne automatisch alle Tore, Profil & Kanäle aus dem Geburtsdatum!
                </Typography>

                {/* Precision Toggle - Only render on client to avoid hydration error */}
                {isClient && (
                  <Box sx={{ mb: 2, p: 1.5, background: 'rgba(0, 0, 0, 0.3)', borderRadius: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Typography variant="caption" sx={{ color: 'white', fontWeight: 600 }}>
                        🎯 Präzise Berechnung
                      </Typography>
                      <Box
                        component="button"
                        onClick={() => setUsePreciseCalculation(!usePreciseCalculation)}
                        sx={{
                          width: 50,
                          height: 26,
                          borderRadius: '13px',
                          border: 'none',
                          cursor: 'pointer',
                          background: usePreciseCalculation 
                            ? 'linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)'
                            : 'rgba(255, 255, 255, 0.2)',
                          position: 'relative',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'scale(1.05)'
                          }
                        }}
                      >
                        <Box sx={{
                          width: 20,
                          height: 20,
                          borderRadius: '50%',
                          background: 'white',
                          position: 'absolute',
                          top: 3,
                          left: usePreciseCalculation ? 27 : 3,
                          transition: 'left 0.3s ease',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                        }} />
                      </Box>
                    </Box>
                    <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)', display: 'block', mt: 0.5, fontSize: '0.7rem' }}>
                      {usePreciseCalculation 
                        ? '✓ Astronomy Engine (100% präzise)'
                        : '~ Vereinfacht (±2-3°)'}
                    </Typography>
                  </Box>
                )}

                {/* Planeten-Aktivierung Toggle */}
                {isClient && (
                  <Box sx={{ mb: 2, p: 1.5, background: 'rgba(138, 43, 226, 0.2)', borderRadius: 1, border: '1px solid rgba(138, 43, 226, 0.5)' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Typography variant="caption" sx={{ color: 'white', fontWeight: 600 }}>
                        🌟 Planeten-Aktivierung
                      </Typography>
                      <Box
                        component="button"
                        onClick={() => setUseAllPlanets(!useAllPlanets)}
                        sx={{
                          width: 50,
                          height: 26,
                          borderRadius: '13px',
                          border: 'none',
                          cursor: 'pointer',
                          background: useAllPlanets 
                            ? 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)'
                            : 'rgba(255, 255, 255, 0.2)',
                          position: 'relative',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'scale(1.05)'
                          }
                        }}
                      >
                        <Box sx={{
                          width: 20,
                          height: 20,
                          borderRadius: '50%',
                          background: 'white',
                          position: 'absolute',
                          top: 3,
                          left: useAllPlanets ? 27 : 3,
                          transition: 'left 0.3s ease',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                        }} />
                      </Box>
                    </Box>
                    <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)', display: 'block', mt: 0.5, fontSize: '0.7rem' }}>
                      {useAllPlanets 
                        ? '✓ Alle 13 Planeten (26 Tore)'
                        : '☀️ Nur Sonne & Erde (4 Tore)'}
                    </Typography>
                    <Alert 
                      severity={useAllPlanets ? "success" : "warning"} 
                      sx={{ 
                        mt: 1, 
                        background: useAllPlanets ? 'rgba(76, 175, 80, 0.2)' : 'rgba(255, 152, 0, 0.2)', 
                        color: 'white', 
                        fontSize: '0.65rem',
                        '& .MuiAlert-icon': { color: useAllPlanets ? '#4caf50' : '#ff9800' }
                      }}
                    >
                      {useAllPlanets 
                        ? 'Vollständiges Chart mit allen Kanälen & Zentren'
                        : 'Basis-Chart: Weniger Kanäle, einfacher Typ!'}
                    </Alert>
                  </Box>
                )}

                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<Sparkles size={18} />}
                  onClick={(e) => {
                    console.log('🔘 BUTTON CLICKED!', e);
                    console.log('📅 Geburtsdatum:', readingData.geburtsdatum);
                    if (!readingData.geburtsdatum) {
                      alert('⚠️ Bitte erst Geburtsdatum eingeben!');
                      return;
                    }
                    calculateGates();
                  }}
                  disabled={!readingData.geburtsdatum}
                  sx={{
                    background: readingData.geburtsdatum 
                      ? 'rgba(255, 215, 0, 0.2)' 
                      : 'rgba(255, 255, 255, 0.1)',
                    color: readingData.geburtsdatum 
                      ? '#FFD700' 
                      : 'rgba(255, 255, 255, 0.3)',
                    fontWeight: 600,
                    border: readingData.geburtsdatum 
                      ? '2px solid #FFD700' 
                      : '2px solid rgba(255, 255, 255, 0.2)',
                    mb: 2,
                    cursor: readingData.geburtsdatum ? 'pointer' : 'not-allowed',
                    '&:hover': readingData.geburtsdatum ? {
                      background: 'rgba(255, 215, 0, 0.3)',
                      transform: 'scale(1.02)',
                    } : {},
                    '&:disabled': {
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: 'rgba(255, 255, 255, 0.3)',
                      border: '2px solid rgba(255, 255, 255, 0.2)',
                      cursor: 'not-allowed'
                    }
                  }}
                >
                  {readingData.geburtsdatum ? '✨ Tore berechnen' : '⚠️ Geburtsdatum fehlt'}
                </Button>

                {calculatedGates && (
                  <Box>
                    <Divider sx={{ my: 2, borderColor: 'rgba(255, 255, 255, 0.2)' }} />
                    
                    <Alert 
                      severity="info" 
                      icon={<AlertCircle size={16} />}
                      sx={{ 
                        mb: 2, 
                        fontSize: '0.7rem',
                        background: 'rgba(0, 0, 0, 0.3)',
                        color: 'rgba(255, 255, 255, 0.8)',
                        '& .MuiAlert-icon': { color: '#FFD700' }
                      }}
                    >
                      Vereinfachte Berechnung (±2-3°)
                    </Alert>

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="caption" sx={{ color: '#FFD700', fontWeight: 600, display: 'block', mb: 1 }}>
                        ☉ Bewusste Sonne (Personality)
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'white', fontSize: '0.95rem', fontWeight: 600 }}>
                        {calculatedGates.personalitySun?.formatted}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)', display: 'block', fontSize: '0.75rem' }}>
                        {calculatedGates.personalitySun?.name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)', display: 'block', fontSize: '0.7rem' }}>
                        {calculatedGates.zodiacInfo.personalitySun}
                      </Typography>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="caption" sx={{ color: '#FFD700', fontWeight: 600, display: 'block', mb: 1 }}>
                        🌍 Bewusste Erde (Personality)
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'white', fontSize: '0.95rem', fontWeight: 600 }}>
                        {calculatedGates.personalityEarth?.formatted}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)', display: 'block', fontSize: '0.75rem' }}>
                        {calculatedGates.personalityEarth?.name}
                      </Typography>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="caption" sx={{ color: '#FFD700', fontWeight: 600, display: 'block', mb: 1 }}>
                        ☉ Unbewusste Sonne (Design)
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'white', fontSize: '0.95rem', fontWeight: 600 }}>
                        {calculatedGates.designSun?.formatted}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)', display: 'block', fontSize: '0.75rem' }}>
                        {calculatedGates.designSun?.name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)', display: 'block', fontSize: '0.7rem' }}>
                        {calculatedGates.zodiacInfo.designSun}
                      </Typography>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="caption" sx={{ color: '#FFD700', fontWeight: 600, display: 'block', mb: 1 }}>
                        🌍 Unbewusste Erde (Design)
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'white', fontSize: '0.95rem', fontWeight: 600 }}>
                        {calculatedGates.designEarth?.formatted}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)', display: 'block', fontSize: '0.75rem' }}>
                        {calculatedGates.designEarth?.name}
                      </Typography>
                    </Box>

                    {/* Profile Display */}
                    {calculatedGates.profile && (
                      <Box sx={{ mb: 2, p: 2, background: 'rgba(102, 126, 234, 0.2)', borderRadius: 2, border: '2px solid #667eea' }}>
                        <Typography variant="caption" sx={{ color: '#FFD700', fontWeight: 600, display: 'block', mb: 1 }}>
                          👤 Profil
                        </Typography>
                        <Typography variant="h6" sx={{ color: 'white', fontSize: '1.2rem', fontWeight: 700, mb: 0.5 }}>
                          {calculatedGates.profile}
                        </Typography>
                        {calculatedGates.profileInfo && (
                          <>
                            <Typography variant="caption" sx={{ color: '#FFD700', fontSize: '0.75rem', fontWeight: 600, display: 'block' }}>
                              {calculatedGates.profileInfo.name}
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.7rem', display: 'block', mt: 0.5, fontStyle: 'italic' }}>
                              {calculatedGates.profileInfo.description}
                            </Typography>
                          </>
                        )}
                      </Box>
                    )}

                    {/* Incarnation Cross Display */}
                    {calculatedGates.incarnationCross && (
                      <Box sx={{ mb: 2, p: 2, background: 'rgba(156, 39, 176, 0.2)', borderRadius: 2, border: '2px solid #9c27b0' }}>
                        <Typography variant="caption" sx={{ color: '#FFD700', fontWeight: 600, display: 'block', mb: 1 }}>
                          ✨ Inkarnationskreuz {CROSS_TYPE_ICONS[calculatedGates.incarnationCross.type]}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'white', fontSize: '0.85rem', fontWeight: 700, mb: 0.5 }}>
                          {calculatedGates.incarnationCross.type}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#ce93d8', fontSize: '0.75rem', fontWeight: 600, display: 'block', mb: 0.5 }}>
                          {calculatedGates.incarnationCross.name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.7rem', display: 'block', lineHeight: 1.4 }}>
                          Tore: {calculatedGates.incarnationCross.personalitySunGate} (☀️) / {calculatedGates.incarnationCross.personalityEarthGate} (🌍) | {calculatedGates.incarnationCross.designSunGate} (🌙☀️) / {calculatedGates.incarnationCross.designEarthGate} (🌙🌍)
                        </Typography>
                      </Box>
                    )}

                    {/* Type & Authority Display - Erweitert */}
                    {calculatedGates.typeAuthority && (
                      <Box sx={{ mb: 2 }}>
                        {/* Typ & Autorität */}
                        <Box sx={{ mb: 2, p: 2, background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.2) 0%, rgba(255, 165, 0, 0.2) 100%)', borderRadius: 2, border: '2px solid rgba(255, 215, 0, 0.6)' }}>
                          <Typography variant="caption" sx={{ color: '#FFD700', fontWeight: 600, display: 'block', mb: 1.5 }}>
                            🎭 Typ & Autorität
                          </Typography>
                          <Box sx={{ mb: 1.5 }}>
                            <Typography variant="body2" sx={{ color: 'white', fontSize: '0.85rem', fontWeight: 700, mb: 0.5 }}>
                              {TYPE_ICONS[calculatedGates.typeAuthority.type]} {calculatedGates.typeAuthority.type}
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.7rem', display: 'block', lineHeight: 1.4, fontStyle: 'italic' }}>
                              {calculatedGates.typeAuthority.explanation.type}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="body2" sx={{ color: 'white', fontSize: '0.85rem', fontWeight: 700, mb: 0.5 }}>
                              {AUTHORITY_ICONS[calculatedGates.typeAuthority.authority]} {calculatedGates.typeAuthority.authority}
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.7rem', display: 'block', lineHeight: 1.4, fontStyle: 'italic' }}>
                              {calculatedGates.typeAuthority.explanation.authority}
                            </Typography>
                          </Box>
                        </Box>

                        {/* Strategie */}
                        <Box sx={{ mb: 2, p: 2, background: 'rgba(102, 126, 234, 0.2)', borderRadius: 2, border: '2px solid #667eea' }}>
                          <Typography variant="caption" sx={{ color: '#667eea', fontWeight: 600, display: 'block', mb: 0.5 }}>
                            📢 Strategie
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'white', fontSize: '0.85rem', fontWeight: 700, mb: 0.5 }}>
                            {STRATEGY_ICONS[calculatedGates.typeAuthority.strategy]} {calculatedGates.typeAuthority.strategy}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.7rem', display: 'block', lineHeight: 1.4, fontStyle: 'italic' }}>
                            {calculatedGates.typeAuthority.explanation.strategy}
                          </Typography>
                        </Box>

                        {/* Nicht-Selbst & Signatur */}
                        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
                          <Box sx={{ p: 1.5, background: 'rgba(244, 67, 54, 0.2)', borderRadius: 2, border: '2px solid #f44336' }}>
                            <Typography variant="caption" sx={{ color: '#f44336', fontWeight: 600, display: 'block', mb: 0.5, fontSize: '0.65rem' }}>
                              ⚠️ Nicht-Selbst
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'white', fontSize: '0.75rem', fontWeight: 700, mb: 0.5 }}>
                              {NOT_SELF_ICONS[calculatedGates.typeAuthority.notSelfTheme]} {calculatedGates.typeAuthority.notSelfTheme}
                            </Typography>
                          </Box>
                          <Box sx={{ p: 1.5, background: 'rgba(76, 175, 80, 0.2)', borderRadius: 2, border: '2px solid #4caf50' }}>
                            <Typography variant="caption" sx={{ color: '#4caf50', fontWeight: 600, display: 'block', mb: 0.5, fontSize: '0.65rem' }}>
                              ✨ Signatur
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'white', fontSize: '0.75rem', fontWeight: 700, mb: 0.5 }}>
                              {SIGNATURE_ICONS[calculatedGates.typeAuthority.signature]} {calculatedGates.typeAuthority.signature}
                            </Typography>
                          </Box>
                        </Box>

                        {/* Definition */}
                        <Box sx={{ mt: 2, p: 2, background: 'rgba(156, 39, 176, 0.2)', borderRadius: 2, border: '2px solid #9c27b0' }}>
                          <Typography variant="caption" sx={{ color: '#ce93d8', fontWeight: 600, display: 'block', mb: 0.5 }}>
                            🔗 Definition
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'white', fontSize: '0.85rem', fontWeight: 700, mb: 0.5 }}>
                            {DEFINITION_ICONS[calculatedGates.typeAuthority.definition]} {calculatedGates.typeAuthority.definition}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.7rem', display: 'block', lineHeight: 1.4, fontStyle: 'italic' }}>
                            {calculatedGates.typeAuthority.explanation.definition}
                          </Typography>
                        </Box>
                      </Box>
                    )}

                    {/* Channels Display */}
                    {calculatedGates.channels && calculatedGates.channels.length > 0 && (
                      <Box sx={{ mb: 2, p: 2, background: 'rgba(240, 147, 251, 0.2)', borderRadius: 2, border: '2px solid #f093fb' }}>
                        <Typography variant="caption" sx={{ color: '#FFD700', fontWeight: 600, display: 'block', mb: 1 }}>
                          🔗 Kanäle ({calculatedGates.channels.length})
                        </Typography>
                        <Box sx={{ maxHeight: 200, overflowY: 'auto' }}>
                          {calculatedGates.channels.map((channel, idx) => (
                            <Box key={idx} sx={{ mb: 1, pb: 1, borderBottom: idx < calculatedGates.channels!.length - 1 ? '1px solid rgba(255, 255, 255, 0.1)' : 'none' }}>
                              <Typography variant="caption" sx={{ color: 'white', fontSize: '0.75rem', fontWeight: 600, display: 'block' }}>
                                {channel.gates[0]}-{channel.gates[1]}
                              </Typography>
                              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.65rem', display: 'block' }}>
                                {channel.name}
                              </Typography>
                            </Box>
                          ))}
                        </Box>
                      </Box>
                    )}

                    {/* Centers Display */}
                    {calculatedGates.centers && (
                      <Box sx={{ mb: 2, p: 2, background: 'rgba(76, 175, 80, 0.2)', borderRadius: 2, border: '2px solid #4caf50' }}>
                        <Typography variant="caption" sx={{ color: '#FFD700', fontWeight: 600, display: 'block', mb: 1 }}>
                          ⚡ Zentren (9)
                        </Typography>
                        <Box sx={{ maxHeight: 250, overflowY: 'auto' }}>
                          {Object.entries(calculatedGates.centers).map(([centerKey, status]) => {
                            const color = status === 'definiert' ? '#4caf50' : status === 'offen' ? '#ff9800' : '#9e9e9e';
                            return (
                              <Box key={centerKey} sx={{ mb: 0.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Box sx={{ 
                                  width: 10, 
                                  height: 10, 
                                  borderRadius: '50%', 
                                  background: color 
                                }} />
                                <Typography variant="caption" sx={{ color: 'white', fontSize: '0.7rem', flex: 1 }}>
                                  {getCenterDescription(centerKey as keyof CenterStatus).split(' (')[0]}
                                </Typography>
                                <Typography variant="caption" sx={{ 
                                  color, 
                                  fontSize: '0.65rem', 
                                  fontWeight: 700,
                                  textTransform: 'uppercase'
                                }}>
                                  {status}
                                </Typography>
                              </Box>
                            );
                          })}
                        </Box>
                      </Box>
                    )}

                    {/* Circuits Display */}
                    {calculatedGates.circuits && calculatedGates.circuits.length > 0 && (
                      <Box sx={{ mb: 2, p: 2, background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%)', borderRadius: 2, border: '2px solid #667eea' }}>
                        <Typography variant="caption" sx={{ color: '#FFD700', fontWeight: 600, display: 'block', mb: 1.5 }}>
                          🔄 Schaltkreise ({calculatedGates.circuits.length})
                        </Typography>
                        
                        {/* Dominant Circuit Group */}
                        {(() => {
                          const dominant = getDominantCircuitGroup(calculatedGates.circuits);
                          return dominant.group && (
                            <Box sx={{ mb: 2, p: 1.5, background: 'rgba(255, 255, 255, 0.1)', borderRadius: 1, border: '1px solid rgba(255, 215, 0, 0.3)' }}>
                              <Typography variant="caption" sx={{ color: '#FFD700', fontSize: '0.65rem', fontWeight: 600, display: 'block', mb: 0.5 }}>
                                ⭐ Dominant:
                              </Typography>
                              <Typography variant="body2" sx={{ color: 'white', fontSize: '0.8rem', fontWeight: 700, mb: 0.5 }}>
                                {CIRCUIT_GROUP_ICONS[dominant.group]} {dominant.group} ({dominant.percentage}%)
                              </Typography>
                              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.65rem', fontStyle: 'italic', lineHeight: 1.3 }}>
                                {dominant.description}
                              </Typography>
                            </Box>
                          );
                        })()}

                        {/* Individual Circuits */}
                        <Box>
                          {calculatedGates.circuits.map((circuit, idx) => {
                            const circuitInfo = CIRCUITS[circuit.name];
                            const groupColor = circuit.group === 'Individual' ? '#ff6b6b' : 
                                             circuit.group === 'Tribal' ? '#51cf66' : '#339af0';
                            
                            return (
                              <Box 
                                key={idx} 
                                sx={{ 
                                  mb: 1.5, 
                                  p: 1.5, 
                                  background: 'rgba(255, 255, 255, 0.05)', 
                                  borderRadius: 1,
                                  borderLeft: `4px solid ${groupColor}`
                                }}
                              >
                                <Typography variant="caption" sx={{ color: 'white', fontSize: '0.75rem', fontWeight: 700, display: 'block', mb: 0.5 }}>
                                  {CIRCUIT_ICONS[circuit.name]} {circuit.name}
                                </Typography>
                                <Typography variant="caption" sx={{ 
                                  color: groupColor, 
                                  fontSize: '0.65rem', 
                                  fontWeight: 600,
                                  display: 'block',
                                  mb: 0.5
                                }}>
                                  {CIRCUIT_GROUP_ICONS[circuit.group]} {circuit.group} • {circuit.channelCount} Kanal{circuit.channelCount > 1 ? 'e' : ''}
                                </Typography>
                                <Typography variant="caption" sx={{ 
                                  color: 'rgba(255, 255, 255, 0.6)', 
                                  fontSize: '0.65rem', 
                                  display: 'block',
                                  lineHeight: 1.3,
                                  fontStyle: 'italic'
                                }}>
                                  {circuitInfo.description}
                                </Typography>
                                <Box sx={{ mt: 0.5, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                  {circuit.activeChannels.map((ch, chIdx) => (
                                    <Typography 
                                      key={chIdx}
                                      variant="caption" 
                                      sx={{ 
                                        color: 'rgba(255, 255, 255, 0.5)', 
                                        fontSize: '0.6rem',
                                        background: 'rgba(0, 0, 0, 0.3)',
                                        px: 0.5,
                                        py: 0.25,
                                        borderRadius: 0.5
                                      }}
                                    >
                                      {ch}
                                    </Typography>
                                  ))}
                                </Box>
                              </Box>
                            );
                          })}
                        </Box>
                      </Box>
                    )}

                    {/* Variables Display */}
                    {calculatedGates.variables && (
                      <Box sx={{ mb: 2, p: 2, background: 'linear-gradient(135deg, rgba(138, 43, 226, 0.2) 0%, rgba(75, 0, 130, 0.2) 100%)', borderRadius: 2, border: '2px solid #8a2be2' }}>
                        <Typography variant="caption" sx={{ color: '#FFD700', fontWeight: 600, display: 'block', mb: 1.5 }}>
                          🧬 Variablen
                        </Typography>

                        {/* Variable Type & Cognition */}
                        <Box sx={{ mb: 2, p: 1.5, background: 'rgba(255, 255, 255, 0.1)', borderRadius: 1, border: '1px solid rgba(255, 215, 0, 0.3)' }}>
                          <Typography variant="body2" sx={{ color: 'white', fontSize: '0.8rem', fontWeight: 700, mb: 0.5 }}>
                            {calculatedGates.variables.variableType} • {calculatedGates.variables.cognition}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.65rem', fontStyle: 'italic', lineHeight: 1.3 }}>
                            {COGNITION_DESCRIPTIONS[calculatedGates.variables.cognition]}
                          </Typography>
                        </Box>

                        {/* PHS */}
                        <Box sx={{ mb: 1.5, p: 1.5, background: 'rgba(255, 255, 255, 0.05)', borderRadius: 1, borderLeft: '4px solid #ff6b9d' }}>
                          <Typography variant="caption" sx={{ color: 'white', fontSize: '0.75rem', fontWeight: 700, display: 'block', mb: 0.5 }}>
                            {VARIABLE_ICONS.phs} PHS: {calculatedGates.variables.phs.arrow === 'left' ? VARIABLE_ICONS.left : VARIABLE_ICONS.right} {calculatedGates.variables.phs.type}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.65rem', display: 'block', lineHeight: 1.3, fontStyle: 'italic' }}>
                            {calculatedGates.variables.phs.description}
                          </Typography>
                        </Box>

                        {/* Environment */}
                        <Box sx={{ mb: 1.5, p: 1.5, background: 'rgba(255, 255, 255, 0.05)', borderRadius: 1, borderLeft: '4px solid #4ecdc4' }}>
                          <Typography variant="caption" sx={{ color: 'white', fontSize: '0.75rem', fontWeight: 700, display: 'block', mb: 0.5 }}>
                            {VARIABLE_ICONS.environment} Environment: {calculatedGates.variables.environment.arrow === 'left' ? VARIABLE_ICONS.left : VARIABLE_ICONS.right} {calculatedGates.variables.environment.type}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.65rem', display: 'block', lineHeight: 1.3, fontStyle: 'italic' }}>
                            {calculatedGates.variables.environment.description}
                          </Typography>
                        </Box>

                        {/* Perspective */}
                        <Box sx={{ mb: 1.5, p: 1.5, background: 'rgba(255, 255, 255, 0.05)', borderRadius: 1, borderLeft: '4px solid #ffd93d' }}>
                          <Typography variant="caption" sx={{ color: 'white', fontSize: '0.75rem', fontWeight: 700, display: 'block', mb: 0.5 }}>
                            {VARIABLE_ICONS.perspective} Perspective: {calculatedGates.variables.perspective.arrow === 'left' ? VARIABLE_ICONS.left : VARIABLE_ICONS.right} {calculatedGates.variables.perspective.type}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.65rem', display: 'block', lineHeight: 1.3, fontStyle: 'italic' }}>
                            {calculatedGates.variables.perspective.description}
                          </Typography>
                        </Box>

                        {/* Motivation */}
                        <Box sx={{ mb: 0, p: 1.5, background: 'rgba(255, 255, 255, 0.05)', borderRadius: 1, borderLeft: '4px solid #95e1d3' }}>
                          <Typography variant="caption" sx={{ color: 'white', fontSize: '0.75rem', fontWeight: 700, display: 'block', mb: 0.5 }}>
                            {VARIABLE_ICONS.motivation} Motivation: {calculatedGates.variables.motivation.arrow === 'left' ? VARIABLE_ICONS.left : VARIABLE_ICONS.right} {calculatedGates.variables.motivation.type}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.65rem', display: 'block', lineHeight: 1.3, fontStyle: 'italic' }}>
                            {calculatedGates.variables.motivation.description}
                          </Typography>
                        </Box>
                      </Box>
                    )}

                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<Copy size={16} />}
                      onClick={autoFillCalculatedGates}
                      sx={{
                        background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                        color: '#000',
                        fontWeight: 700,
                        mt: 1,
                        '&:hover': {
                          background: 'linear-gradient(135deg, #FFA500, #FF8C00)',
                          transform: 'scale(1.02)',
                        }
                      }}
                    >
                      Werte übernehmen
                    </Button>

                    {/* Extended Planets (Precise Calculation Only) */}
                    {calculatedGates.personality && (
                      <Box sx={{ mt: 2 }}>
                        <Button
                          fullWidth
                          variant="outlined"
                          onClick={() => setShowAllPlanets(!showAllPlanets)}
                          sx={{
                            color: '#FFD700',
                            borderColor: '#FFD700',
                            fontSize: '0.75rem',
                            py: 0.5,
                            '&:hover': {
                              borderColor: '#FFA500',
                              background: 'rgba(255, 215, 0, 0.1)'
                            }
                          }}
                        >
                          {showAllPlanets ? '🔽 Weniger anzeigen' : '▶️ Alle Planeten anzeigen'}
                        </Button>

                        {showAllPlanets && (
                          <Box sx={{ mt: 2, p: 2, background: 'rgba(0, 0, 0, 0.3)', borderRadius: 1 }}>
                            <Typography variant="caption" sx={{ color: '#FFD700', fontWeight: 600, display: 'block', mb: 2 }}>
                              🪐 Erweiterte Planeten (Personality)
                            </Typography>

                            {[
                              { key: 'moon', label: '🌙 Mond', data: calculatedGates.personality.moon },
                              { key: 'mercury', label: '☿ Merkur', data: calculatedGates.personality.mercury },
                              { key: 'venus', label: '♀ Venus', data: calculatedGates.personality.venus },
                              { key: 'mars', label: '♂ Mars', data: calculatedGates.personality.mars },
                              { key: 'jupiter', label: '♃ Jupiter', data: calculatedGates.personality.jupiter },
                              { key: 'saturn', label: '♄ Saturn', data: calculatedGates.personality.saturn },
                              { key: 'northNode', label: '☊ Nordknoten', data: calculatedGates.personality.northNode },
                              { key: 'southNode', label: '☋ Südknoten', data: calculatedGates.personality.southNode },
                            ].map((planet) => (
                              planet.data && (
                                <Box key={planet.key} sx={{ mb: 1.5, pb: 1.5, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                                  <Typography variant="caption" sx={{ color: 'rgba(255, 215, 0, 0.8)', fontSize: '0.7rem', display: 'block' }}>
                                    {planet.label}
                                  </Typography>
                                  <Typography variant="body2" sx={{ color: 'white', fontSize: '0.85rem', fontWeight: 600 }}>
                                    {planet.data.formatted}
                                  </Typography>
                                  <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.65rem', display: 'block' }}>
                                    {planet.data.name}
                                  </Typography>
                                </Box>
                              )
                            ))}

                            <Divider sx={{ my: 2, borderColor: 'rgba(255, 255, 255, 0.2)' }} />

                            <Typography variant="caption" sx={{ color: '#FFD700', fontWeight: 600, display: 'block', mb: 2 }}>
                              🪐 Erweiterte Planeten (Design)
                            </Typography>

                            {calculatedGates.design && [
                              { key: 'moon', label: '🌙 Mond', data: calculatedGates.design.moon },
                              { key: 'mercury', label: '☿ Merkur', data: calculatedGates.design.mercury },
                              { key: 'venus', label: '♀ Venus', data: calculatedGates.design.venus },
                              { key: 'mars', label: '♂ Mars', data: calculatedGates.design.mars },
                              { key: 'jupiter', label: '♃ Jupiter', data: calculatedGates.design.jupiter },
                              { key: 'saturn', label: '♄ Saturn', data: calculatedGates.design.saturn },
                              { key: 'northNode', label: '☊ Nordknoten', data: calculatedGates.design.northNode },
                              { key: 'southNode', label: '☋ Südknoten', data: calculatedGates.design.southNode },
                            ].map((planet) => (
                              planet.data && (
                                <Box key={planet.key} sx={{ mb: 1.5, pb: 1.5, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                                  <Typography variant="caption" sx={{ color: 'rgba(255, 215, 0, 0.8)', fontSize: '0.7rem', display: 'block' }}>
                                    {planet.label}
                                  </Typography>
                                  <Typography variant="body2" sx={{ color: 'white', fontSize: '0.85rem', fontWeight: 600 }}>
                                    {planet.data.formatted}
                                  </Typography>
                                  <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.65rem', display: 'block' }}>
                                    {planet.data.name}
                                  </Typography>
                                </Box>
                              )
                            ))}
                          </Box>
                        )}
                      </Box>
                    )}
                  </Box>
                )}
              </CardContent>
            </Card>

            <Divider sx={{ my: 3, borderColor: 'rgba(255, 215, 0, 0.3)' }} />

            {/* Quick Info */}
            <Typography variant="h6" sx={{ color: '#FFD700', mb: 2 }}>
              📝 Schnellübersicht
            </Typography>
            
            <Card sx={{ background: 'rgba(255, 215, 0, 0.1)', mb: 2 }}>
              <CardContent>
                <Typography variant="subtitle2" sx={{ color: '#FFD700', mb: 1 }}>
                  <User size={16} style={{ display: 'inline', marginRight: 8 }} />
                  Persönliche Daten
                </Typography>
                <Typography variant="body2" sx={{ color: 'white', fontSize: '0.9rem' }}>
                  Name: {readingData.name || '-'}
                </Typography>
                <Typography variant="body2" sx={{ color: 'white', fontSize: '0.9rem' }}>
                  Datum: {readingData.geburtsdatum || '-'}
                </Typography>
                <Typography variant="body2" sx={{ color: 'white', fontSize: '0.9rem' }}>
                  Typ: {readingData.typ || '-'}
                </Typography>
                <Typography variant="body2" sx={{ color: 'white', fontSize: '0.9rem' }}>
                  Profil: {readingData.profil || '-'}
                </Typography>
              </CardContent>
            </Card>

            <Divider sx={{ my: 2, borderColor: 'rgba(255, 215, 0, 0.3)' }} />

            <Typography variant="subtitle1" sx={{ color: '#FFD700', mb: 1 }}>
              💡 Tipps
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 2, fontSize: '0.85rem' }}>
              • Fülle zuerst das Geburtsdatum aus
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 2, fontSize: '0.85rem' }}>
              • Berechne die Tore automatisch
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 2, fontSize: '0.85rem' }}>
              • Nutze die Textbausteine
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.85rem' }}>
              • Prüfe die Vorschau vor dem Export
            </Typography>
          </Paper>
        </Box>
      </Container>

      {/* Vorschau-Dialog */}
      <Dialog 
        open={showPreview} 
        onClose={() => setShowPreview(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ background: '#000', color: '#FFD700', borderBottom: '2px solid #FFD700' }}>
          Vorschau: {readingData.name || 'Reading'}
        </DialogTitle>
        <DialogContent sx={{ background: '#fff', p: 0 }}>
          <Box 
            ref={previewRef}
            dangerouslySetInnerHTML={{ __html: generateReading() }}
          />
        </DialogContent>
        <DialogActions sx={{ background: '#000', borderTop: '1px solid rgba(255, 215, 0, 0.3)' }}>
          <Button onClick={() => setShowPreview(false)} sx={{ color: 'white' }}>
            Schließen
          </Button>
          <Button 
            onClick={handleExportPDF}
            startIcon={<FileDown />}
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #FFD700, #FFA500)',
              color: '#000'
            }}
          >
            Als PDF speichern
          </Button>
        </DialogActions>
      </Dialog>

      {/* Textbausteine-Dialog mit Preview */}
      <Dialog
        open={showTextbausteine}
        onClose={() => { setShowTextbausteine(false); setPreviewText(''); }}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle sx={{ background: '#000', color: '#FFD700' }}>
          📚 Textbausteine-Bibliothek
        </DialogTitle>
        <DialogContent sx={{ background: '#1a1a1a' }}>
          <Box sx={{ display: 'flex', gap: 2, height: '70vh' }}>
            {/* Linke Seite: Textbausteine-Liste */}
            <Box sx={{ flex: 1, overflowY: 'auto', pr: 2 }}>
              <Typography variant="subtitle2" sx={{ color: 'white', mb: 2, mt: 2 }}>
                Wähle eine Kategorie und füge Textbausteine zu deinem Reading hinzu:
              </Typography>
          
          <Accordion sx={{ background: 'rgba(255, 255, 255, 0.05)', mb: 1 }}>
            <AccordionSummary expandIcon={<ChevronDown color="#FFD700" />}>
              <Typography sx={{ color: '#FFD700' }}>⚡ Typ-Beschreibungen</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List>
                {Object.entries(textbausteine.typ).map(([typ, text]) => (
                  <ListItem 
                    key={typ}
                    onMouseEnter={() => setPreviewText(text)}
                    onMouseLeave={() => setPreviewText('')}
                    secondaryAction={
                      <IconButton edge="end" onClick={() => { insertTextbaustein(text, 'typ'); setShowTextbausteine(false); }}>
                        <Copy size={18} color="#FFD700" />
                      </IconButton>
                    }
                    sx={{ 
                      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                      cursor: 'pointer',
                      '&:hover': { background: 'rgba(255, 215, 0, 0.1)' }
                    }}
                  >
                    <ListItemText
                      primary={typ}
                      primaryTypographyProps={{ color: '#FFD700', fontWeight: 600 }}
                    />
                  </ListItem>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>

          <Accordion sx={{ background: 'rgba(255, 255, 255, 0.05)', mb: 1 }}>
            <AccordionSummary expandIcon={<ChevronDown color="#FFD700" />}>
              <Typography sx={{ color: '#FFD700' }}>🎯 Autoritäts-Beschreibungen</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List>
                {Object.entries(textbausteine.autoritaet).map(([auth, text]) => (
                  <ListItem 
                    key={auth}
                    onMouseEnter={() => setPreviewText(text)}
                    onMouseLeave={() => setPreviewText('')}
                    secondaryAction={
                      <IconButton edge="end" onClick={() => { insertTextbaustein(text, 'autoritaet'); setShowTextbausteine(false); }}>
                        <Copy size={18} color="#FFD700" />
                      </IconButton>
                    }
                    sx={{ 
                      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                      cursor: 'pointer',
                      '&:hover': { background: 'rgba(255, 215, 0, 0.1)' }
                    }}
                  >
                    <ListItemText
                      primary={auth}
                      primaryTypographyProps={{ color: '#FFD700', fontWeight: 600 }}
                    />
                  </ListItem>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>

          <Accordion sx={{ background: 'rgba(255, 255, 255, 0.05)', mb: 1 }}>
            <AccordionSummary expandIcon={<ChevronDown color="#FFD700" />}>
              <Typography sx={{ color: '#FFD700' }}>📖 Profil-Beschreibungen</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List>
                {Object.entries(textbausteine.profil).map(([profil, text]) => (
                  <ListItem 
                    key={profil}
                    onMouseEnter={() => setPreviewText(text)}
                    onMouseLeave={() => setPreviewText('')}
                    secondaryAction={
                      <IconButton edge="end" onClick={() => { insertTextbaustein(text, 'profil'); setShowTextbausteine(false); }}>
                        <Copy size={18} color="#FFD700" />
                      </IconButton>
                    }
                    sx={{ 
                      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                      cursor: 'pointer',
                      '&:hover': { background: 'rgba(255, 215, 0, 0.1)' }
                    }}
                  >
                    <ListItemText
                      primary={profil}
                      primaryTypographyProps={{ color: '#FFD700', fontWeight: 600 }}
                    />
                  </ListItem>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>

          <Accordion sx={{ background: 'rgba(255, 255, 255, 0.05)', mb: 1 }}>
            <AccordionSummary expandIcon={<ChevronDown color="#FFD700" />}>
              <Typography sx={{ color: '#FFD700' }}>🔗 Kanal-Beschreibungen</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List sx={{ maxHeight: 400, overflowY: 'auto' }}>
                {Object.entries(textbausteine.kanaele).map(([kanal, text]) => (
                  <ListItem 
                    key={kanal}
                    onMouseEnter={() => setPreviewText(text)}
                    onMouseLeave={() => setPreviewText('')}
                    secondaryAction={
                      <IconButton edge="end" onClick={() => { navigator.clipboard.writeText(text); alert('Kanal-Beschreibung kopiert!'); }}>
                        <Copy size={18} color="#FFD700" />
                      </IconButton>
                    }
                    sx={{ 
                      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                      cursor: 'pointer',
                      '&:hover': { background: 'rgba(255, 215, 0, 0.1)' }
                    }}
                  >
                    <ListItemText
                      primary={`Kanal ${kanal}`}
                      primaryTypographyProps={{ color: '#FFD700', fontWeight: 600, fontSize: '0.9rem' }}
                    />
                  </ListItem>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>

          {/* Eigene Textbausteine */}
          <Accordion sx={{ background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.15) 0%, rgba(255, 165, 0, 0.15) 100%)', mb: 1 }}>
            <AccordionSummary expandIcon={<ChevronDown color="#FFD700" />}>
              <Typography sx={{ color: '#FFD700', fontWeight: 700 }}>✨ Eigene Textbausteine erstellen</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ mb: 3 }}>
                <Alert severity="info" sx={{ mb: 2, background: 'rgba(102, 126, 234, 0.2)', color: 'white', border: '1px solid #667eea' }}>
                  <Typography variant="caption">
                    💡 Erstelle deine eigenen Textbausteine! Sie werden automatisch gespeichert und stehen dir jederzeit zur Verfügung.
                  </Typography>
                </Alert>

                {/* Formular zum Erstellen/Bearbeiten */}
                <Box sx={{ mb: 3, p: 2, background: 'rgba(0, 0, 0, 0.3)', borderRadius: 2 }}>
                  <TextField
                    fullWidth
                    label={editingTextbausteinKey ? "Titel bearbeiten" : "Titel für Textbaustein"}
                    value={newTextbausteinTitle}
                    onChange={(e) => setNewTextbausteinTitle(e.target.value)}
                    sx={{ 
                      mb: 2,
                      '& .MuiInputLabel-root': { color: '#FFD700' },
                      '& .MuiOutlinedInput-root': { 
                        color: 'white',
                        '& fieldset': { borderColor: 'rgba(255, 215, 0, 0.3)' },
                        '&:hover fieldset': { borderColor: 'rgba(255, 215, 0, 0.5)' },
                        '&.Mui-focused fieldset': { borderColor: '#FFD700' }
                      }
                    }}
                    placeholder="z.B. Tor 32 - Meine Interpretation"
                  />
                  
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label={editingTextbausteinKey ? "Inhalt bearbeiten" : "Inhalt des Textbausteins"}
                    value={newTextbausteinContent}
                    onChange={(e) => setNewTextbausteinContent(e.target.value)}
                    sx={{ 
                      mb: 2,
                      '& .MuiInputLabel-root': { color: '#FFD700' },
                      '& .MuiOutlinedInput-root': { 
                        color: 'white',
                        '& fieldset': { borderColor: 'rgba(255, 215, 0, 0.3)' },
                        '&:hover fieldset': { borderColor: 'rgba(255, 215, 0, 0.5)' },
                        '&.Mui-focused fieldset': { borderColor: '#FFD700' }
                      }
                    }}
                    placeholder="Schreibe hier deinen individuellen Text..."
                  />
                  
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button 
                      variant="contained" 
                      onClick={addCustomTextbaustein}
                      sx={{ 
                        background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                        color: '#000',
                        fontWeight: 700,
                        '&:hover': {
                          background: 'linear-gradient(135deg, #FFA500, #FFD700)'
                        }
                      }}
                    >
                      {editingTextbausteinKey ? '💾 Aktualisieren' : '➕ Hinzufügen'}
                    </Button>
                    
                    {editingTextbausteinKey && (
                      <Button 
                        variant="outlined" 
                        onClick={cancelEdit}
                        sx={{ 
                          borderColor: 'rgba(255, 215, 0, 0.5)',
                          color: '#FFD700',
                          '&:hover': {
                            borderColor: '#FFD700',
                            background: 'rgba(255, 215, 0, 0.1)'
                          }
                        }}
                      >
                        ❌ Abbrechen
                      </Button>
                    )}
                  </Box>
                </Box>

                {/* Liste der gespeicherten eigenen Textbausteine */}
                {Object.keys(customTextbausteine).length > 0 ? (
                  <Box>
                    <Typography variant="subtitle2" sx={{ color: 'white', mb: 2, fontWeight: 600 }}>
                      📚 Deine gespeicherten Textbausteine ({Object.keys(customTextbausteine).length})
                    </Typography>
                    <List>
                      {Object.entries(customTextbausteine).map(([key, value]) => {
                        const data = JSON.parse(value);
                        return (
                          <ListItem 
                            key={key}
                            onMouseEnter={() => setPreviewText(data.content)}
                            onMouseLeave={() => setPreviewText('')}
                            sx={{ 
                              borderBottom: '1px solid rgba(255, 215, 0, 0.2)',
                              background: 'rgba(255, 215, 0, 0.05)',
                              mb: 1,
                              borderRadius: 1,
                              cursor: 'pointer',
                              '&:hover': { background: 'rgba(255, 215, 0, 0.15)' }
                            }}
                          >
                            <ListItemText
                              primary={data.title}
                              secondary={`${data.content.substring(0, 60)}${data.content.length > 60 ? '...' : ''}`}
                              primaryTypographyProps={{ color: '#FFD700', fontWeight: 600 }}
                              secondaryTypographyProps={{ color: 'rgba(255, 255, 255, 0.6)' }}
                            />
                            <Box sx={{ display: 'flex', gap: 0.5 }}>
                              <IconButton 
                                edge="end" 
                                onClick={() => { navigator.clipboard.writeText(data.content); alert('✅ Textbaustein kopiert!'); }}
                                sx={{ '&:hover': { background: 'rgba(255, 215, 0, 0.2)' } }}
                              >
                                <Copy size={18} color="#4caf50" />
                              </IconButton>
                              <IconButton 
                                edge="end" 
                                onClick={() => editCustomTextbaustein(key)}
                                sx={{ '&:hover': { background: 'rgba(255, 215, 0, 0.2)' } }}
                              >
                                <Sparkles size={18} color="#2196f3" />
                              </IconButton>
                              <IconButton 
                                edge="end" 
                                onClick={() => deleteCustomTextbaustein(key)}
                                sx={{ '&:hover': { background: 'rgba(255, 0, 0, 0.2)' } }}
                              >
                                <AlertCircle size={18} color="#f44336" />
                              </IconButton>
                            </Box>
                          </ListItem>
                        );
                      })}
                    </List>
                  </Box>
                ) : (
                  <Alert severity="info" sx={{ background: 'rgba(255, 152, 0, 0.2)', color: 'white', border: '1px solid #ff9800' }}>
                    <Typography variant="caption">
                      📝 Noch keine eigenen Textbausteine vorhanden. Erstelle deinen ersten Textbaustein oben!
                    </Typography>
                  </Alert>
                )}
              </Box>
            </AccordionDetails>
          </Accordion>

            </Box>

            {/* Rechte Seite: Preview-Bereich */}
            <Box sx={{ 
              flex: 1, 
              borderLeft: '2px solid rgba(255, 215, 0, 0.3)', 
              pl: 2,
              display: 'flex',
              flexDirection: 'column'
            }}>
              <Typography variant="subtitle2" sx={{ color: '#FFD700', mb: 2, mt: 2, fontWeight: 700 }}>
                👁️ Live-Vorschau
              </Typography>
              
              {previewText ? (
                <Paper sx={{ 
                  flex: 1, 
                  p: 3, 
                  background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                  border: '2px solid #667eea',
                  borderRadius: 2,
                  overflowY: 'auto'
                }}>
                  <Typography sx={{ 
                    color: 'white', 
                    lineHeight: 1.8,
                    fontSize: '0.95rem',
                    fontStyle: 'italic'
                  }}>
                    {previewText}
                  </Typography>
                </Paper>
              ) : (
                <Box sx={{ 
                  flex: 1, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  border: '2px dashed rgba(255, 215, 0, 0.3)',
                  borderRadius: 2,
                  p: 3
                }}>
                  <Typography sx={{ 
                    color: 'rgba(255, 255, 255, 0.5)', 
                    textAlign: 'center',
                    fontStyle: 'italic'
                  }}>
                    Bewege die Maus über einen Textbaustein,<br/>
                    um eine Vorschau zu sehen
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ background: '#000' }}>
          <Button onClick={() => setShowTextbausteine(false)} sx={{ color: 'white' }}>
            Schließen
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

