"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useRouter, usePathname } from 'next/navigation';
// Unused imports removed
import { apiService } from '@/lib/services/apiService';
import { MoonTracking } from '@/types/common.types';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Button, 
  Container,
  Grid,
  Chip,
  Avatar,
  LinearProgress,
  CircularProgress,
  Alert,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Tabs,
  Tab,
  FormControlLabel,
  Switch,
  Slider
} from '@mui/material';
import { 
  Plus, 
  Star,
  Activity,
  Bell,
  BookOpen,
  Heart,
  Calendar,
  Flower2
} from 'lucide-react';
// import AppHeader from '../../components/AppHeader';
import AnimatedStars from '../../components/AnimatedStars';
import AccessControl from '../../components/AccessControl';
import { UserSubscription } from '../../lib/subscription/types';
import { SubscriptionService } from '../../lib/subscription/subscriptionService';

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

// MoonTracking Interface aus common.types.ts verwenden

interface TrackingStats {
  totalEntries: number;
  averageMood: number;
  averageEnergy: number;
  averageSleep: number;
  mostFrequentPhase: string;
  streakDays: number;
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

// GateDetails interface entfernt - nicht verwendet

// Hilfsfunktionen für den Mondkalender
function generateCalendarDays(year: number, month: number) {
  const firstDay = new Date(year, month - 1, 1);
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - firstDay.getDay() + 1); // Montag als Start
  
  const days = [];
  const today = new Date();
  
  for (let i = 0; i < 42; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    
    days.push({
      day: date.getDate(),
      date: date,
      isCurrentMonth: date.getMonth() === month - 1,
      isToday: date.toDateString() === today.toDateString()
    });
  }
  
  return days;
}

// Echte Mondphasen-Berechnung basierend auf astronomischen Daten
function getMoonPhase(date: Date): { icon: string; name: string; phase: number } {
  // Referenzdatum: 6. Januar 2000, 18:14 UTC (Neumond)
  const knownNewMoon = new Date('2000-01-06T18:14:00Z');
  
  // Mondzyklus: 29.53059 Tage
  const lunarCycle = 29.53059;
  
  // Berechne die Anzahl der Tage seit dem bekannten Neumond
  const daysSinceKnownNewMoon = (date.getTime() - knownNewMoon.getTime()) / (1000 * 60 * 60 * 24);
  
  // Berechne die aktuelle Mondphase (0 = Neumond, 0.25 = Erstes Viertel, 0.5 = Vollmond, 0.75 = Letztes Viertel)
  const phase = ((daysSinceKnownNewMoon % lunarCycle) + lunarCycle) % lunarCycle;
  const normalizedPhase = phase / lunarCycle;
  
  // Bestimme Mondphase basierend auf dem normalisierten Wert
  if (normalizedPhase < 0.0625) {
    return { icon: '🌑', name: 'Neumond', phase: normalizedPhase };
  } else if (normalizedPhase < 0.1875) {
    return { icon: '🌒', name: 'Zunehmende Sichel', phase: normalizedPhase };
  } else if (normalizedPhase < 0.3125) {
    return { icon: '🌓', name: 'Erstes Viertel', phase: normalizedPhase };
  } else if (normalizedPhase < 0.4375) {
    return { icon: '🌔', name: 'Zunehmender Mond', phase: normalizedPhase };
  } else if (normalizedPhase < 0.5625) {
    return { icon: '🌕', name: 'Vollmond', phase: normalizedPhase };
  } else if (normalizedPhase < 0.6875) {
    return { icon: '🌖', name: 'Abnehmender Mond', phase: normalizedPhase };
  } else if (normalizedPhase < 0.8125) {
    return { icon: '🌗', name: 'Letztes Viertel', phase: normalizedPhase };
  } else {
    return { icon: '🌘', name: 'Abnehmende Sichel', phase: normalizedPhase };
  }
}

function getMoonPhaseIcon(date: Date): string {
  return getMoonPhase(date).icon;
}


export default function MondkalenderPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userSubscription, setUserSubscription] = useState<UserSubscription | null>(null);
  const [currentPhase, setCurrentPhase] = useState<MoonPhase | null>(null);
  const [loading, setLoading] = useState(true);
  const [, setTrackingData] = useState<MoonTracking[]>([]);
  const [stats, setStats] = useState<TrackingStats>({
    totalEntries: 0,
    averageMood: 0,
    averageEnergy: 0,
    averageSleep: 0,
    mostFrequentPhase: 'Keine Daten',
    streakDays: 0
  });
  const [activeTab, setActiveTab] = useState(0);
  const [newEntry, setNewEntry] = useState({
    mood: 5,
    energy_level: 5,
    sleep_quality: 5,
    notes: '',
    moon_phase: ''
  });

  // Authentifizierung und Subscription prüfen
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      
      if (!token || !userId) {
        setIsAuthenticated(false);
        setLoading(false);
        // Keine Authentifizierung erforderlich - App ist öffentlich
        return;
      }
      
      setIsAuthenticated(true);
      
      // Subscription laden
      await loadUserSubscription();
      
      // Loading beenden
      setLoading(false);
    };

    const loadUserSubscription = async () => {
      try {
        const userData = localStorage.getItem('userData');
        const userSubscription = localStorage.getItem('userSubscription');
        
        if (userData) {
          const user = JSON.parse(userData);
          
          // Versuche zuerst localStorage
          if (userSubscription) {
            const subscription = JSON.parse(userSubscription);
            setUserSubscription({
              userId: user.id || 'unknown',
              packageId: subscription.plan || user.subscriptionPlan || 'basic',
              plan: subscription.plan || user.subscriptionPlan || 'basic',
              status: subscription.status || 'active',
              startDate: subscription.startDate || new Date().toISOString(),
              endDate: subscription.endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
              autoRenew: subscription.autoRenew || false,
              paymentMethod: subscription.paymentMethod || 'none',
              billingCycle: subscription.billingCycle || 'monthly'
            });
            console.log('✅ Subscription aus localStorage geladen:', subscription.plan || user.subscriptionPlan || 'basic');
            return;
          }
          
          // Fallback: Direkt aus userData
          if (user.subscriptionPlan) {
            const planId = user.subscriptionPlan === 'free' ? 'basic' : user.subscriptionPlan;
            
            // Auto-Upgrade für bestehende free-Accounts
            if (user.subscriptionPlan === 'free') {
              console.log('🔄 Auto-Upgrade: free → basic');
              user.subscriptionPlan = 'basic';
              localStorage.setItem('userData', JSON.stringify(user));
              
              // Aktualisiere auch userSubscription
              localStorage.setItem('userSubscription', JSON.stringify({
                plan: 'basic',
                status: 'active',
                startDate: new Date().toISOString(),
                features: [
                  'Human Design Chart',
                  'Vollständiger Mondkalender',
                  'Community Zugang',
                  'Basis-Matching',
                  'Bis zu 3 Profilbilder'
                ]
              }));
            }
            
            setUserSubscription({
              userId: user.id || 'unknown',
              packageId: planId,
              plan: planId,
              status: 'active',
              startDate: new Date().toISOString(),
              endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
              autoRenew: false,
              paymentMethod: 'none',
              billingCycle: 'monthly'
            });
            console.log('✅ Subscription aus userData geladen:', planId);
            return;
          }
          
          // Fallback: SubscriptionService
          try {
            const subscription = await SubscriptionService.getUserSubscription(user.id);
            setUserSubscription(subscription);
            console.log('✅ Subscription aus Service geladen:', subscription?.packageId);
          } catch {
            console.log('⚠️ SubscriptionService nicht verfügbar, verwende Basic-Plan');
            setUserSubscription({
              userId: user.id,
              packageId: 'basic',
              plan: 'basic',
              status: 'active',
              startDate: new Date().toISOString(),
              endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
              autoRenew: true,
              paymentMethod: 'free',
              billingCycle: 'monthly'
            });
          }
        }
      } catch (error) {
        console.error('Fehler beim Laden des Abonnements:', error);
        // Fallback: Basic-Plan
        setUserSubscription({
          userId: 'fallback-user',
          packageId: 'basic',
          plan: 'basic',
          status: 'active',
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          autoRenew: true,
          paymentMethod: 'free',
          billingCycle: 'monthly'
        });
      }
    };

    checkAuth();
  }, [router]);
  const [notificationSettings, setNotificationSettings] = useState({
    moonPhaseReminders: true,
    dailyReminders: false,
    weeklyReports: true
  });
  const [moonStories, setMoonStories] = useState<MoonStory[]>([]);
  const [plantRituals, setPlantRituals] = useState<PlantRitual[]>([]);
  const [healthGuidance, setHealthGuidance] = useState<HealthGuidance[]>([]);
  const [selectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [userProfile, setUserProfile] = useState<Record<string, unknown> | null>(null);

  // Lade User-Profil beim Start
  useEffect(() => {
    loadUserProfile();
  }, []);

  const moonPhases: MoonPhase[] = useMemo(() => [
    {
      name: "Neumond",
      description: "Zeit für Neuanfänge und Intentionen",
      icon: "🌑",
      energy: "Niedrig",
      color: "#2C3E50",
      advice: "Perfekt für Meditation und Zielsetzung",
      explanation: "Der Neumond ist die beste Zeit, um neue Projekte zu starten und sich Ziele zu setzen. Die Energie ist nach innen gerichtet und unterstützt Introspektion.",
      reflectionExercises: [
        "Was möchte ich in diesem Zyklus erreichen?",
        "Welche Gewohnheiten möchte ich etablieren?",
        "Was kann ich loslassen?",
        "Welche Human Design-Strategie möchte ich vertiefen?"
      ],
      moonRituals: [
        "Intentionen aufschreiben",
        "Meditation",
        "Räuchern",
        "Vision Board erstellen",
        "Human Design Chart studieren"
      ],
      humanDesignConnection: "🌌 G-Zentrum Aktivierung: Der Neumond aktiviert dein G-Zentrum - die Quelle deiner Richtung und Liebe. Nutze diese Zeit, um deine innere Autorität zu stärken und deine wahre Richtung zu finden. Für Generators: Höre auf deine Sacral-Antworten. Für Projectors: Warte auf Einladungen. Für Manifestors: Informiere andere über deine Pläne. Für Reflectors: Nutze die 28-Tage-Regel für wichtige Entscheidungen."
    },
    {
      name: "Zunehmender Mond",
      description: "Zeit für Wachstum und Entwicklung",
      icon: "🌒",
      energy: "Steigend",
      color: "#3498DB",
      advice: "Ideal für Lernen und neue Fähigkeiten",
      explanation: "Die Energie steigt und unterstützt Wachstum und Entwicklung. Perfekt für das Erlernen neuer Fähigkeiten und das Aufbauen von Ressourcen.",
      reflectionExercises: [
        "Was lerne ich gerade über mein Human Design?",
        "Wie kann ich meine definierten Zentren stärken?",
        "Welche undefinierten Zentren brauchen Aufmerksamkeit?",
        "Welche Profile-Aspekte möchte ich entwickeln?"
      ],
      moonRituals: [
        "Neue Fähigkeiten lernen",
        "Bücher lesen",
        "Kurse besuchen",
        "Netzwerken",
        "Human Design Reading vertiefen"
      ],
      humanDesignConnection: "🦋 Spleen-Zentrum Fokus: Der zunehmende Mond stärkt dein Spleen-Zentrum - dein Überlebensinstinkt und deine Intuition. Nutze diese Zeit, um deine natürlichen Instinkte zu schärfen. Für definierte Spleen-Zentren: Vertraue deinen Überlebensinstinkten. Für undefinierte: Lerne von anderen, aber folge nicht blind. Diese Phase unterstützt auch das Erlernen neuer Fähigkeiten, die zu deinem Human Design passen."
    },
    {
      name: "Vollmond",
      description: "Zeit für Manifestation und Vollendung",
      icon: "🌕",
      energy: "Hoch",
      color: "#F39C12",
      advice: "Perfekt für Rituale und Manifestation",
      explanation: "Die höchste Energie des Mondzyklus - ideal für Manifestation und Rituale. Der Vollmond bringt alles ans Licht und verstärkt Emotionen.",
      reflectionExercises: [
        "Was habe ich in diesem Mondzyklus erreicht?",
        "Welche Human Design-Erkenntnisse sind mir gekommen?",
        "Wie fühle ich mich in meiner Authentizität?",
        "Was möchte ich in die Welt bringen?"
      ],
      moonRituals: [
        "Vollmond-Ritual",
        "Kräuter sammeln",
        "Kristalle aufladen",
        "Gratitude-Praxis",
        "Human Design Manifestation"
      ],
      humanDesignConnection: "🔥 Solar Plexus Explosion: Der Vollmond aktiviert dein Solar Plexus-Zentrum - das Zentrum der Emotionen und Entscheidungen. Diese Zeit ist besonders kraftvoll für emotionale Klärung und authentische Entscheidungen. Für definierte Solar Plexus: Nutze deine emotionale Autorität für wichtige Entscheidungen. Für undefinierte: Lass dich nicht von den Emotionen anderer überwältigen. Der Vollmond verstärkt auch deine natürlichen Talente - nutze diese Energie, um dein Human Design in die Welt zu bringen. Perfekt für Manifestation deiner wahren Natur!"
    },
    {
      name: "Abnehmender Mond",
      description: "Zeit für Loslassen und Reinigung",
      icon: "🌖",
      energy: "Fallend",
      color: "#E74C3C",
      advice: "Ideal für Entgiftung und Loslassen",
      explanation: "Die Energie nimmt ab - perfekt für Reinigung und Loslassen. Zeit, um Altes zu verabschieden und Platz für Neues zu schaffen.",
      reflectionExercises: [
        "Was kann ich loslassen, was nicht zu meinem Human Design passt?",
        "Welche Konditionierungen belasten mich?",
        "Was brauche ich nicht mehr in meinem Leben?",
        "Wie kann ich meine undefinierten Zentren entlasten?"
      ],
      moonRituals: [
        "Entgiftung",
        "Aufräumen",
        "Vergeben",
        "Alte Gewohnheiten ablegen",
        "Human Design Konditionierung reinigen"
      ],
      humanDesignConnection: "🌱 Wurzel-Zentrum Reinigung: Der abnehmende Mond unterstützt dein Wurzel-Zentrum - das Zentrum des Drucks und der Adrenalin-Energie. Nutze diese Zeit, um Druck abzubauen und Stress zu reduzieren. Für definierte Wurzel-Zentren: Lass den Druck los, der nicht deiner ist. Für undefinierte: Entferne dich von stressigen Situationen. Diese Phase ist ideal, um Konditionierungen zu erkennen und loszulassen, die nicht zu deinem authentischen Human Design gehören. Perfekt für innere Reinigung und Vorbereitung auf den nächsten Zyklus."
    }
  ], []);

  const loadCurrentMoonPhase = useCallback(async () => {
    try {
      console.log('Lade echte Mondphase-Daten...');
      
      // Berechne echte Mondphase für heute
      const currentDate = new Date();
      const moonPhaseData = getMoonPhase(currentDate);
      
      // Finde passende Mondphase-Details basierend auf dem Namen
      let matchingPhase = moonPhases.find(phase => 
        phase.name === moonPhaseData.name || 
        phase.name.includes('Neumond') && moonPhaseData.name === 'Neumond' ||
        phase.name.includes('Vollmond') && moonPhaseData.name === 'Vollmond' ||
        phase.name.includes('Zunehmend') && moonPhaseData.name.includes('Zunehmend') ||
        phase.name.includes('Abnehmend') && moonPhaseData.name.includes('Abnehmend')
      );
      
      // Fallback zu einer passenden Phase
      if (!matchingPhase) {
        if (moonPhaseData.name === 'Neumond') {
          matchingPhase = moonPhases[0]; // Neumond
        } else if (moonPhaseData.name === 'Vollmond') {
          matchingPhase = moonPhases[2]; // Vollmond
        } else if (moonPhaseData.name.includes('Zunehmend')) {
          matchingPhase = moonPhases[1]; // Zunehmender Mond
        } else {
          matchingPhase = moonPhases[3]; // Abnehmender Mond
        }
      }
      
      // Erstelle aktualisierte Phase mit echten Daten
      const currentPhaseData: MoonPhase = {
        ...matchingPhase,
        name: moonPhaseData.name,
        icon: moonPhaseData.icon,
        description: `Aktuelle Mondphase: ${moonPhaseData.name} (${Math.round(moonPhaseData.phase * 100)}% des Zyklus)`
      };
      
      setCurrentPhase(currentPhaseData);
      
      // Versuche optional API-Aufruf im Hintergrund für zusätzliche Daten
      try {
        const apiPhase = await apiService.getCurrentMoonPhase();
        
        if (apiPhase && apiPhase.success && apiPhase.data) {
          const convertedPhase: MoonPhase = {
            name: apiPhase.data.name || moonPhaseData.name,
            description: apiPhase.data.description || currentPhaseData.description,
            icon: apiPhase.data.emoji || moonPhaseData.icon,
            energy: apiPhase.data.energy === 'high' ? 'Hoch' : apiPhase.data.energy === 'medium' ? 'Mittel' : 'Niedrig',
            color: currentPhaseData.color,
            advice: currentPhaseData.advice,
            explanation: apiPhase.data.description || currentPhaseData.explanation,
            reflectionExercises: currentPhaseData.reflectionExercises,
            moonRituals: currentPhaseData.moonRituals,
            humanDesignConnection: apiPhase.data.humanDesignConnection || currentPhaseData.humanDesignConnection
          };
          setCurrentPhase(convertedPhase);
        }
      } catch {
        // API-Fehler ignorieren, lokale Daten verwenden
      }
    } catch (err) {
      console.error('Fehler beim Laden der Mondphase:', err);
      // Fallback zu lokalen Daten
      setCurrentPhase(moonPhases[0]);
    } finally {
      setLoading(false);
    }
  }, [moonPhases]);

  const calculateStreak = useCallback((data: MoonTracking[]) => {
    if (data.length === 0) return 0;
    
    const sortedDates = data
      .map(entry => new Date(entry.date))
      .sort((a, b) => b.getTime() - a.getTime());
    
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < sortedDates.length; i++) {
      const entryDate = new Date(sortedDates[i]);
      entryDate.setHours(0, 0, 0, 0);
      const daysDiff = Math.floor((today.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === i) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  }, []);

  const calculateStats = useCallback((data: MoonTracking[]) => {
    if (data.length === 0) {
      setStats({
        totalEntries: 0,
        averageMood: 0,
        averageEnergy: 0,
        averageSleep: 0,
        mostFrequentPhase: 'Keine Daten',
        streakDays: 0
      });
      return;
    }

    const totalMood = data.reduce((sum, entry) => sum + entry.mood, 0);
    const totalEnergy = data.reduce((sum, entry) => sum + entry.energy_level, 0);
    const totalSleep = data.reduce((sum, entry) => sum + entry.sleep_quality, 0);

    const phaseCounts = data.reduce((acc, entry) => {
      acc[entry.moon_phase] = (acc[entry.moon_phase] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const mostFrequentPhase = Object.entries(phaseCounts).reduce((a, b) => 
      phaseCounts[a[0]] > phaseCounts[b[0]] ? a : b
    )[0];

    setStats({
      totalEntries: data.length,
      averageMood: Math.round((totalMood / data.length) * 10) / 10,
      averageEnergy: Math.round((totalEnergy / data.length) * 10) / 10,
      averageSleep: Math.round((totalSleep / data.length) * 10) / 10,
      mostFrequentPhase,
      streakDays: calculateStreak(data)
    });
  }, [calculateStreak]);

  const loadUserData = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const data = await apiService.getMoonTracking(localStorage.getItem('userId') || '');
      
      if (data && data.success && data.data) {
        setTrackingData(data.data);
        calculateStats(data.data);
      }
    } catch (error) {
      console.error('Fehler beim Laden der Daten:', error);
    }
  }, [calculateStats]);

  useEffect(() => {
    loadCurrentMoonPhase();
    loadUserData();
    loadMoonStories();
    loadPlantRituals();
    loadHealthGuidance();
  }, [loadCurrentMoonPhase, loadUserData]);

  // Alte calculateStats und calculateStreak Funktionen entfernt - jetzt mit useCallback definiert

  const loadUserProfile = async () => {
    try {
      // SSR-sicherer localStorage Zugriff
      if (typeof window !== 'undefined') {
        const userData = localStorage.getItem('userData');
        if (userData) {
          const user = JSON.parse(userData);
          setUserProfile(user);
          return;
        }
      }
      
      // Fallback zu Mock-Daten
      setUserProfile({
        hdType: 'Generator',
        hdStrategy: 'Auf Sacral-Antworten warten',
        hdAuthority: 'Sacral-Autorität',
        hdProfile: '3/5 Profil'
      });
    } catch (error) {
      console.error('Fehler beim Laden des User-Profils:', error);
      // Fallback zu Mock-Daten
      setUserProfile({
        hdType: 'Generator',
        hdStrategy: 'Auf Sacral-Antworten warten',
        hdAuthority: 'Sacral-Autorität',
        hdProfile: '3/5 Profil'
      });
    }
  };

  const loadMoonStories = async () => {
    try {
      // TODO: Implement getMoonStories in SupabaseService
      const stories = null;
      if (stories) {
        setMoonStories(stories);
      }
      } catch (error) {
      console.error('Fehler beim Laden der Mond-Geschichten:', error);
      // Fallback zu Mock-Daten
      setMoonStories([
        {
          id: '1',
          title: 'Die Mondgöttin Selene',
          culture: 'Griechisch',
          content: 'Selene, die griechische Mondgöttin, fährt jeden Abend mit ihrem silbernen Wagen über den Himmel. Sie verliebte sich in den schönen Hirten Endymion und bat Zeus, ihm ewigen Schlaf zu gewähren, damit er für immer jung und schön bliebe.',
          moon_phase: 'Vollmond',
          moral: 'Die Kraft der Liebe und des ewigen Begehrens',
          tags: ['Liebe', 'Ewigkeit', 'Schönheit', 'Träume']
        },
        {
          id: '2',
          title: 'Der Mondhase',
          culture: 'Chinesisch',
          content: 'In der chinesischen Mythologie lebt ein Hase auf dem Mond, der mit einem Mörser und Stößel das Elixier der Unsterblichkeit herstellt. Der Hase symbolisiert Geduld und Ausdauer bei der Verfolgung spiritueller Ziele.',
          moon_phase: 'Vollmond',
          moral: 'Geduld und Ausdauer führen zur spirituellen Transformation',
          tags: ['Geduld', 'Spiritualität', 'Unsterblichkeit', 'Ausdauer']
        },
        {
          id: '3',
          title: 'Mani und die Wölfe',
          culture: 'Nordisch',
          content: 'In der nordischen Mythologie fährt Mani, der Mondgott, in seinem Wagen über den Himmel, verfolgt von zwei Wölfen. Diese Wölfe symbolisieren die Zeit, die unaufhaltsam vergeht, und erinnern uns an die Vergänglichkeit des Lebens.',
          moon_phase: 'Abnehmender Mond',
          moral: 'Nutze die Zeit weise und lebe im Moment',
          tags: ['Zeit', 'Vergänglichkeit', 'Weisheit', 'Gegenwart']
        },
        {
          id: '4',
          title: 'Die Mondgöttin Chang\'e',
          culture: 'Chinesisch',
          content: 'Chang\'e, die chinesische Mondgöttin, stahl das Elixier der Unsterblichkeit und floh zum Mond. Dort lebt sie in Einsamkeit, aber ihre Liebe zur Erde ist ungebrochen. Sie symbolisiert Opferbereitschaft und die Verbindung zwischen Himmel und Erde.',
          moon_phase: 'Neumond',
          moral: 'Manchmal müssen wir Opfer bringen, um unser wahres Selbst zu finden',
          tags: ['Opfer', 'Einsamkeit', 'Liebe', 'Transformation']
        },
        {
          id: '5',
          title: 'Der Mond und die Gezeiten',
          culture: 'Polynesisch',
          content: 'Die polynesische Legende erzählt von Maui, der den Mond einfing und ihn zwang, regelmäßig zu erscheinen. Dadurch entstanden die Gezeiten, die das Leben im Ozean und an den Küsten regeln. Der Mond wird als Regulator der natürlichen Rhythmen verehrt.',
          moon_phase: 'Zunehmender Mond',
          moral: 'Der Mond regelt die natürlichen Rhythmen des Lebens',
          tags: ['Rhythmus', 'Natur', 'Gezeiten', 'Regulation']
        },
        {
          id: '6',
          title: 'Die Mondfrau',
          culture: 'Japanisch',
          content: 'In der japanischen Folklore lebt eine alte Frau auf dem Mond, die unermüdlich Reis kocht. Sie symbolisiert Fruchtbarkeit, Wohlstand und die Verbindung zwischen Himmel und Erde. Ihre Arbeit bringt Segen für die Ernte.',
          moon_phase: 'Vollmond',
          moral: 'Fleiß und Hingabe bringen Fruchtbarkeit und Wohlstand',
          tags: ['Fruchtbarkeit', 'Wohlstand', 'Fleiß', 'Ernte']
        }
      ]);
    }
  };

  const loadPlantRituals = async () => {
    try {
      // TODO: Implement getPlantRituals in SupabaseService
      const rituals = null;
      if (rituals) {
        setPlantRituals(rituals);
      }
      } catch (error) {
      console.error('Fehler beim Laden der Pflanzen-Rituale:', error);
      // Fallback zu Mock-Daten
      setPlantRituals([
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
        }
      ]);
    }
  };

  const loadHealthGuidance = async () => {
    try {
      // TODO: Implement getHealthGuidance in SupabaseService
      const guidance = null;
      if (guidance) {
        setHealthGuidance(guidance);
      }
    } catch (error) {
      console.error('Fehler beim Laden der Gesundheits-Empfehlungen:', error);
      // Fallback zu Mock-Daten
      setHealthGuidance([
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
        }
      ]);
    }
  };

  // Removed unused functions

  const handleSaveEntry = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const entryData: MoonTracking = {
        id: Date.now().toString(),
        user_id: localStorage.getItem('userId') || '',
        date: new Date().toISOString().split('T')[0],
        mood: newEntry.mood,
        energy_level: newEntry.energy_level,
        sleep_quality: newEntry.sleep_quality,
        notes: newEntry.notes,
        moon_phase: currentPhase?.name || 'Unbekannt',
        created_at: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // TODO: Implement saveMoonTrackingData in SupabaseService
      const response = { success: true, message: 'Data saved locally' };

      if (response.success) {
        setNewEntry({
          mood: 5,
          energy_level: 5,
          sleep_quality: 5,
          notes: '',
          moon_phase: ''
        });
        loadUserData();
      }
    } catch (error) {
      console.error('Fehler beim Speichern:', error);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  // Zeige Loading-Screen während Authentifizierung geprüft wird
  if (loading || !isAuthenticated) {
    return (
      <Box sx={{ 
        minHeight: '100vh', 
        background: `
          radial-gradient(ellipse at top, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
          radial-gradient(ellipse at bottom, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
          linear-gradient(135deg, #0f0f23 0%, #1a1a2e 25%, #16213e 50%, #0f3460 75%, #533483 100%)
        `,
        display: 'flex', 
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        gap: 2
      }}>
        <CircularProgress size={60} sx={{ color: '#8B5CF6' }} />
        {!isAuthenticated && (
          <Typography variant="h6" sx={{ color: 'white', textAlign: 'center' }}>
            Weiterleitung zur Anmeldung...
          </Typography>
        )}
      </Box>
    );
  }

  // Warten bis Authentifizierung überprüft wurde
  if (loading) {
    return (
      <Box sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 25%, #16213e 50%, #0f3460 75%, #533483 100%)'
      }}>
        <CircularProgress size={60} sx={{ color: '#FFD700' }} />
      </Box>
    );
  }

  // Debug-Ausgabe
  console.log('🔍 Mondkalender Debug:', {
    isAuthenticated,
    userSubscription,
    packageId: userSubscription?.packageId,
    loading
  });

  return (
    <AccessControl 
      path={pathname} 
      userSubscription={userSubscription}
      onUpgrade={() => router.push('/upgrade')}
    >
    <Box sx={{ 
      minHeight: '100vh', 
      background: `
        radial-gradient(ellipse at top, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
        radial-gradient(ellipse at bottom, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
        linear-gradient(135deg, #0f0f23 0%, #1a1a2e 25%, #16213e 50%, #0f3460 75%, #533483 100%)
      `,
      position: 'relative',
      overflow: 'hidden',
      '@keyframes moonGlow': {
        '0%': {
          textShadow: '0 0 20px rgba(255, 215, 0, 0.6), 0 0 40px rgba(255, 215, 0, 0.3)',
        },
        '100%': {
          textShadow: '0 0 40px rgba(255, 215, 0, 1), 0 0 80px rgba(255, 215, 0, 0.6)',
        }
      },
      '@keyframes moonRotate': {
        '0%': {
          transform: 'rotate(0deg)',
        },
        '100%': {
          transform: 'rotate(360deg)',
        }
      },
      '@keyframes moonPulse': {
        '0%': {
          transform: 'scale(1)',
          opacity: 0.6,
        },
        '50%': {
          transform: 'scale(1.1)',
          opacity: 0.8,
        },
        '100%': {
          transform: 'scale(1)',
          opacity: 0.6,
        }
      },
      '@keyframes moonPhaseGlow': {
        '0%': {
          filter: 'brightness(1)',
          transform: 'scale(1)',
        },
        '100%': {
          filter: 'brightness(1.3)',
          transform: 'scale(1.05)',
        }
      }
    }}>
      <AnimatedStars />
      
      {/* Animated Moon Background */}
      <Box sx={{ position: 'absolute', top: '2%', right: '10%', zIndex: 1 }}>
        <Box
          sx={{
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: 'radial-gradient(circle at 30% 30%, #ffffff 0%, #f0f0f0 40%, #e0e0e0 60%, #d0d0d0 100%)',
            boxShadow: '0 0 30px rgba(255, 255, 255, 0.8), inset 0 0 30px rgba(255, 255, 255, 0.3)',
            margin: '0 auto',
            animation: 'moonRotate 20s linear infinite, moonPulse 4s ease-in-out infinite'
          }}
        />
      </Box>
      
      <Container maxWidth="lg" sx={{ py: 8, position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <motion.div
          
          
          
        >
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            {/* Upgrade Promotion für Basic-User */}
            {userSubscription?.packageId === 'basic' && (
              <motion.div
                
                
                
              >
                <Box sx={{
                  background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(255, 165, 0, 0.1) 100%)',
                  border: '1px solid rgba(255, 215, 0, 0.3)',
                  borderRadius: 3,
                  p: 3,
                  mb: 4,
                  backdropFilter: 'blur(10px)'
                }}>
                  <Typography variant="h6" sx={{ color: '#FFD700', mb: 1, fontWeight: 'bold' }}>
                    🌙 Entdecke den vollständigen Mondkalender
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mb: 2 }}>
                    Als Premium-Mitglied erhältst du erweiterte Mondphasen-Analysen, persönliche Rituale und exklusive Insights.
                  </Typography>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => router.push('/upgrade')}
                    sx={{
                      background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                      color: '#000',
                      fontWeight: 'bold',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #FFA500, #FFD700)',
                        transform: 'translateY(-2px)'
                      }
                    }}
                  >
                    🚀 Jetzt upgraden
                  </Button>
                </Box>
              </motion.div>
            )}
            
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 4 }}>
              <Typography variant="h1" sx={{
                color: '#FFD700',
                fontWeight: 800,
                textShadow: '0 0 30px rgba(255, 215, 0, 0.8), 0 0 60px rgba(255, 215, 0, 0.4)',
                fontSize: { xs: '2.5rem', md: '4rem' },
                background: 'linear-gradient(45deg, #FFD700, #FFA500, #FFD700)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                animation: 'moonGlow 3s ease-in-out infinite alternate'
            }}>
                🌙 Mondkalender
            </Typography>
            </Box>
            <motion.div
              
              
              
            >
              <Typography variant="h5" sx={{ 
              color: 'rgba(255,255,255,0.9)',
                fontSize: { xs: '1.2rem', md: '1.5rem' },
                maxWidth: 800,
                mx: 'auto',
                lineHeight: 1.6
              }}>
                Verfolge deine Verbindung zum Mond und deine persönlichen Muster
            </Typography>
            </motion.div>
          </Box>
        </motion.div>

        {/* Profil Widget */}
        <motion.div
          
          
          
        >
          <Card sx={{ 
            background: 'rgba(139, 92, 246, 0.1)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            borderRadius: 3, 
            mb: 4
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar 
                  sx={{ 
                    width: 60, 
                    height: 60, 
                    mr: 3,
                    background: 'linear-gradient(45deg, #8B5CF6, #A855F7)',
                    fontSize: '1.5rem'
                  }}
                >
                  👤
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h5" sx={{ color: '#8B5CF6', fontWeight: 600, mb: 1 }}>
                    Dein Human Design Profil
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    Personalisierte Mond-Insights basierend auf deinem Chart
                  </Typography>
                </Box>
                <Chip 
                  label="Premium" 
                  sx={{ 
                    background: 'linear-gradient(45deg, #FFD700, #FFA500)',
                    color: '#1a1a2e',
                    fontWeight: 600
                  }} 
                />
              </Box>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={3}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="h4" sx={{ color: '#8B5CF6', mb: 1 }}>
                      🧬
                    </Typography>
                    <Typography variant="h6" sx={{ color: '#fff', mb: 1 }}>
                      {String(userProfile?.hdType || 'Generator')}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                      Dein Human Design Typ
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={3}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="h4" sx={{ color: '#10b981', mb: 1 }}>
                      🎯
                    </Typography>
                    <Typography variant="h6" sx={{ color: '#fff', mb: 1 }}>
                      Strategie
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                      {String(userProfile?.hdStrategy || 'Auf Sacral-Antworten warten')}
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={3}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="h4" sx={{ color: '#f59e0b', mb: 1 }}>
                      ⚡
                    </Typography>
                    <Typography variant="h6" sx={{ color: '#fff', mb: 1 }}>
                      Autorität
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                      {String(userProfile?.hdAuthority || 'Sacral-Autorität')}
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={3}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="h4" sx={{ color: '#ef4444', mb: 1 }}>
                      📊
                    </Typography>
                    <Typography variant="h6" sx={{ color: '#fff', mb: 1 }}>
                      {String(userProfile?.hdProfile || '3/5 Profil')}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                      Martyrer-Heretiker
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
              
              <Box sx={{ mt: 3, p: 2, background: 'rgba(255,255,255,0.05)', borderRadius: 2 }}>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)', textAlign: 'center', fontStyle: 'italic' }}>
                  &ldquo;Als Generator profitierst du besonders von der zunehmenden Mondphase für neue Projekte 
                  und vom abnehmenden Mond für Reflexion und Loslassen.&rdquo;
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </motion.div>

        {/* Aktuelle Mondphase */}
          {currentPhase && (
        <motion.div
          
          
              
            >
                <Card sx={{ 
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: 3,
                mb: 4
                }}>
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <Typography variant="h1" sx={{ 
                        mr: 2, 
                        fontSize: '4rem',
                        animation: 'moonPhaseGlow 3s ease-in-out infinite alternate'
                      }}>
                        {currentPhase.icon}
                      </Typography>
                      <Box>
                      <Typography variant="h4" sx={{ color: '#fff', fontWeight: 600, mb: 1 }}>
                        {currentPhase.name}
                        </Typography>
                      <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                        {currentPhase.description}
                        </Typography>
                      </Box>
                    </Box>

                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="h6" sx={{ color: '#8B5CF6', mb: 2 }}>
                        💡 Empfehlung
                      </Typography>
                      <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                        {currentPhase.advice}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="h6" sx={{ color: '#8B5CF6', mb: 2 }}>
                        ⚡ Energie-Level
                      </Typography>
                      <Chip 
                        label={currentPhase.energy} 
                        sx={{ 
                          background: currentPhase.color,
                          color: '#fff',
                          fontWeight: 600
                        }} 
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
                    </motion.div>
          )}

        
          {/* Tabs */}
          <motion.div
            
            
            
          >
                <Card sx={{ 
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: 3
            }}>
              <Tabs 
                value={activeTab} 
                onChange={handleTabChange}
                variant="fullWidth"
                sx={{
                  '& .MuiTab-root': {
                    color: 'rgba(255,255,255,0.7)',
                    fontWeight: 600,
                    fontSize: '1rem',
                    py: 2,
                    '&.Mui-selected': {
                      color: '#8B5CF6'
                    }
                  },
                  '& .MuiTabs-indicator': {
                    backgroundColor: '#8B5CF6',
                    height: 3
                  }
                }}
              >
                <Tab 
                  icon={<Calendar size={24} />} 
                  label="Kalender & Phasen" 
                  iconPosition="start" 
                />
                <Tab 
                  icon={<Activity size={24} />} 
                  label="Tracking & Stats" 
                  iconPosition="start" 
                />
                <Tab 
                  icon={<BookOpen size={24} />} 
                  label="Wissen & Rituale" 
                  iconPosition="start" 
                />
                <Tab 
                  icon={<Bell size={24} />} 
                  label="Einstellungen" 
                  iconPosition="start" 
                />
              </Tabs>

              {/* Kalender & Phasen Tab */}
              {activeTab === 0 && (
                <Box sx={{ p: 4 }}>
                  <Typography variant="h5" sx={{ color: 'white', mb: 3, fontWeight: 600 }}>
                    📅 Mondkalender & Phasen
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', mb: 4 }}>
                    Hier findest du den vollständigen Mondkalender mit echten Mondphasen und deren Auswirkungen.
                  </Typography>
                  
                  {/* Monatsauswahl */}
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" sx={{ color: '#fff', mb: 2 }}>
                      Wähle einen Monat:
                    </Typography>
                    <Grid container spacing={2}>
                      {[
                        'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
                        'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
                      ].map((month, index) => (
                        <Grid item xs={3} sm={2} md={1} key={index}>
                          <Button
                            variant="outlined"
                            fullWidth
                            onClick={() => setSelectedMonth(index + 1)}
                            sx={{
                              color: selectedMonth === index + 1 ? '#fff' : '#8B5CF6',
                              borderColor: selectedMonth === index + 1 ? '#8B5CF6' : 'rgba(139, 92, 246, 0.3)',
                              backgroundColor: selectedMonth === index + 1 ? 'rgba(139, 92, 246, 0.2)' : 'transparent',
                              '&:hover': {
                                borderColor: '#8B5CF6',
                                backgroundColor: 'rgba(139, 92, 246, 0.1)'
                              }
                            }}
                          >
                            {month}
                          </Button>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>

                  {/* Kalender-Grid */}
                  <Card sx={{ 
                    background: 'rgba(255, 255, 255, 0.05)', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 2,
                    p: 3
                  }}>
                    <Typography variant="h6" sx={{ color: '#fff', mb: 3, textAlign: 'center' }}>
                      {[
                        'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
                        'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
                      ][selectedMonth - 1]} {selectedYear}
                    </Typography>
                    
                    {/* Wochentage Header */}
                    <Grid container spacing={1} sx={{ mb: 1 }}>
                      {['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].map((day) => (
                        <Grid item xs key={day}>
                          <Typography variant="subtitle2" sx={{ 
                            color: '#8B5CF6', 
                            textAlign: 'center', 
                            fontWeight: 600,
                            py: 1
                          }}>
                            {day}
                          </Typography>
                        </Grid>
                      ))}
                    </Grid>
                    
                    {/* Kalender-Tage */}
                    <Grid container spacing={0.5}>
                      {generateCalendarDays(selectedYear, selectedMonth).map((day, index) => (
                        <Grid item xs={12/7} key={index} sx={{ aspectRatio: '1' }}>
                          <Card sx={{
                            background: day.isCurrentMonth 
                              ? (day.isToday ? 'rgba(139, 92, 246, 0.3)' : 'rgba(255, 255, 255, 0.05)')
                              : 'rgba(255, 255, 255, 0.02)',
                            border: day.isToday 
                              ? '2px solid #8B5CF6' 
                              : '1px solid rgba(255,255,255,0.1)',
                            borderRadius: 1,
                            height: '100%',
                            minHeight: 80,
                            p: 0.5,
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            '&:hover': {
                              backgroundColor: day.isCurrentMonth 
                                ? 'rgba(139, 92, 246, 0.1)' 
                                : 'rgba(255, 255, 255, 0.05)'
                            }
                          }}>
                            <Typography variant="body2" sx={{ 
                              color: day.isCurrentMonth ? '#fff' : 'rgba(255,255,255,0.4)', 
                              fontWeight: day.isToday ? 700 : 400,
                              fontSize: '0.8rem',
                              textAlign: 'center'
                            }}>
                              {day.day}
                            </Typography>
                            
                            {day.isCurrentMonth && (
                              <Box sx={{ textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                <Typography variant="h6" sx={{ color: '#8B5CF6', mb: 0.5, fontSize: '1.2rem' }}>
                                  {getMoonPhaseIcon(day.date)}
                                </Typography>
                                <Typography variant="caption" sx={{ 
                                  color: 'rgba(255,255,255,0.7)', 
                                  fontSize: '0.6rem',
                                  lineHeight: 1,
                                  textAlign: 'center'
                                }}>
                                  {getMoonPhase(day.date)?.name || 'Mond'}
                                </Typography>
                              </Box>
                            )}
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  </Card>
                  
                  {/* Aktuelle Mondphase Details */}
                  {currentPhase && (
                    <Box sx={{ mt: 4 }}>
                      <Typography variant="h6" sx={{ color: '#fff', mb: 3 }}>
                        🌙 Aktuelle Mondphase Details
                      </Typography>
                      <Grid container spacing={4}>
                        <Grid item xs={12} md={6}>
                          <Typography variant="h6" sx={{ color: '#fff', mb: 2 }}>
                            📖 Erklärung
                          </Typography>
                          <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', mb: 3 }}>
                            {currentPhase.explanation}
                          </Typography>
                          
                          <Typography variant="h6" sx={{ color: '#fff', mb: 2 }}>
                            🧘 Reflektionsübungen
                          </Typography>
                          <List>
                            {currentPhase.reflectionExercises.map((exercise, index) => (
                              <ListItem key={index} sx={{ px: 0 }}>
                                <ListItemIcon>
                                  <Star size={16} style={{ color: '#8B5CF6' }} />
                                </ListItemIcon>
                                <ListItemText 
                                  primary={exercise}
                                  sx={{ color: 'rgba(255,255,255,0.8)' }}
                                />
                              </ListItem>
                            ))}
                          </List>
                        </Grid>

                        <Grid item xs={12} md={6}>
                          <Typography variant="h6" sx={{ color: '#fff', mb: 2 }}>
                            🔮 Mondrituale
                          </Typography>
                          <List>
                            {currentPhase.moonRituals.map((ritual, index) => (
                              <ListItem key={index} sx={{ px: 0 }}>
                                <ListItemIcon>
                                  <Star size={16} style={{ color: '#8B5CF6' }} />
                                </ListItemIcon>
                                <ListItemText 
                                  primary={ritual}
                                  sx={{ color: 'rgba(255,255,255,0.8)' }}
                                />
                              </ListItem>
                            ))}
                          </List>

                          <Typography variant="h6" sx={{ color: '#fff', mb: 2, mt: 3 }}>
                            🧬 Human Design Verbindung
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 2 }}>
                            {currentPhase.humanDesignConnection}
                          </Typography>
                          
                          {/* Spezielle Human Design Vollmond-Rituale */}
                          {currentPhase.name === 'Vollmond' && (
                            <Box sx={{ 
                              mt: 3, 
                              p: 3, 
                              background: 'rgba(255, 215, 0, 0.1)', 
                              borderRadius: 2,
                              border: '1px solid rgba(255, 215, 0, 0.3)'
                            }}>
                              <Typography variant="h6" sx={{ color: '#FFD700', mb: 2 }}>
                                🌕 Human Design Vollmond-Rituale
                              </Typography>
                              <List dense>
                                <ListItem sx={{ px: 0 }}>
                                  <ListItemIcon>
                                    <Star size={16} style={{ color: '#FFD700' }} />
                                  </ListItemIcon>
                                  <ListItemText 
                                    primary="Chart-Reflexion: Studiere dein Human Design Chart bei Vollmondlicht"
                                    sx={{ color: 'rgba(255,255,255,0.8)' }}
                                  />
                                </ListItem>
                                <ListItem sx={{ px: 0 }}>
                                  <ListItemIcon>
                                    <Star size={16} style={{ color: '#FFD700' }} />
                                  </ListItemIcon>
                                  <ListItemText 
                                    primary="Authentizitäts-Check: Prüfe, ob du deiner Strategie und Autorität folgst"
                                    sx={{ color: 'rgba(255,255,255,0.8)' }}
                                  />
                                </ListItem>
                                <ListItem sx={{ px: 0 }}>
                                  <ListItemIcon>
                                    <Star size={16} style={{ color: '#FFD700' }} />
                                  </ListItemIcon>
                                  <ListItemText 
                                    primary="Konditionierung loslassen: Identifiziere und befreie dich von nicht-authentischen Mustern"
                                    sx={{ color: 'rgba(255,255,255,0.8)' }}
                                  />
                                </ListItem>
                                <ListItem sx={{ px: 0 }}>
                                  <ListItemIcon>
                                    <Star size={16} style={{ color: '#FFD700' }} />
                                  </ListItemIcon>
                                  <ListItemText 
                                    primary="Manifestation: Visualisiere, wie du dein Human Design in die Welt bringst"
                                    sx={{ color: 'rgba(255,255,255,0.8)' }}
                                  />
                                </ListItem>
                              </List>
                            </Box>
                          )}
                        </Grid>
                      </Grid>
                    </Box>
                  )}
                </Box>
              )}

              {/* Tracking & Stats Tab */}
              {activeTab === 1 && (
                <Box sx={{ p: 4 }}>
                  <Typography variant="h5" sx={{ color: 'white', mb: 3, fontWeight: 600 }}>
                    📊 Tracking & Statistiken
                  </Typography>
                  
                  {/* Tracking Form */}
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="h6" sx={{ color: '#fff', mb: 3 }}>
                      📝 Heute tracken
                    </Typography>
                    
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={4}>
                        <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', mb: 1 }}>
                          Stimmung: {newEntry.mood}/10
                        </Typography>
                        <LinearProgress 
                          variant="determinate" 
                          value={newEntry.mood * 10} 
                          sx={{
                            height: 8, 
                            borderRadius: 4,
                            '& .MuiLinearProgress-bar': {
                              background: 'linear-gradient(90deg, #ef4444, #f59e0b, #10b981)'
                            }
                          }}
                        />
                        <Slider
                          value={newEntry.mood}
                          onChange={(e, value) => setNewEntry({...newEntry, mood: value as number})}
                          min={1}
                          max={10}
                          step={1}
                          marks
                          valueLabelDisplay="auto"
                          sx={{ mt: 2 }}
                        />
                      </Grid>

                      <Grid item xs={12} md={4}>
                        <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', mb: 1 }}>
                          Energie: {newEntry.energy_level}/10
                        </Typography>
                        <LinearProgress 
                          variant="determinate" 
                          value={newEntry.energy_level * 10} 
                          sx={{
                            height: 8, 
                            borderRadius: 4,
                            '& .MuiLinearProgress-bar': {
                              background: 'linear-gradient(90deg, #6b7280, #f59e0b, #10b981)'
                            }
                          }}
                        />
                        <Slider
                          value={newEntry.energy_level}
                          onChange={(e, value) => setNewEntry({...newEntry, energy_level: value as number})}
                          min={1}
                          max={10}
                          step={1}
                          marks
                          valueLabelDisplay="auto"
                          sx={{ mt: 2 }}
                        />
                      </Grid>

                      <Grid item xs={12} md={4}>
                        <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', mb: 1 }}>
                          Schlaf: {newEntry.sleep_quality}/10
                        </Typography>
                        <LinearProgress 
                          variant="determinate" 
                          value={newEntry.sleep_quality * 10} 
                          sx={{
                            height: 8, 
                            borderRadius: 4,
                            '& .MuiLinearProgress-bar': {
                              background: 'linear-gradient(90deg, #6b7280, #3b82f6, #8b5cf6)'
                            }
                          }}
                        />
                        <Slider
                          value={newEntry.sleep_quality}
                          onChange={(e, value) => setNewEntry({...newEntry, sleep_quality: value as number})}
                          min={1}
                          max={10}
                          step={1}
                          marks
                          valueLabelDisplay="auto"
                          sx={{ mt: 2 }}
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          multiline
                          rows={3}
                          placeholder="Notizen zum heutigen Tag..."
                          value={newEntry.notes}
                          onChange={(e) => setNewEntry({...newEntry, notes: e.target.value})}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              color: '#fff',
                              '& fieldset': {
                                borderColor: 'rgba(255,255,255,0.3)'
                              },
                              '&:hover fieldset': {
                                borderColor: 'rgba(255,255,255,0.5)'
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: '#8B5CF6'
                              }
                            }
                          }}
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <Button
                          variant="contained"
                          onClick={handleSaveEntry}
                          startIcon={<Plus size={20} />}
                          sx={{
                            background: 'linear-gradient(45deg, #8B5CF6, #A855F7)',
                            color: '#fff',
                            py: 1.5,
                            fontSize: '1rem',
                            fontWeight: 600,
                            borderRadius: 3,
                            '&:hover': { 
                              background: 'linear-gradient(45deg, #7C3AED, #9333EA)'
                            }
                          }}
                        >
                          Eintrag speichern
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>
                  
                  {/* Statistiken */}
                  <Typography variant="h6" sx={{ color: '#fff', mb: 3 }}>
                    📊 Deine Statistiken
                  </Typography>
                  
                  {stats ? (
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6} md={3}>
                        <Card sx={{ 
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: 2
                        }}>
                          <CardContent sx={{ textAlign: 'center', p: 3 }}>
                            <Typography variant="h4" sx={{ color: '#8B5CF6', fontWeight: 700 }}>
                              {stats.totalEntries}
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                              Einträge
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>

                      <Grid item xs={12} sm={6} md={3}>
                        <Card sx={{ 
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: 2
                        }}>
                          <CardContent sx={{ textAlign: 'center', p: 3 }}>
                            <Typography variant="h4" sx={{ color: '#10b981', fontWeight: 700 }}>
                              {stats.averageMood}/10
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                              Ø Stimmung
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>

                      <Grid item xs={12} sm={6} md={3}>
                        <Card sx={{ 
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: 2
                        }}>
                          <CardContent sx={{ textAlign: 'center', p: 3 }}>
                            <Typography variant="h4" sx={{ color: '#f59e0b', fontWeight: 700 }}>
                              {stats.averageEnergy}/10
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                              Ø Energie
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>

                      <Grid item xs={12} sm={6} md={3}>
                        <Card sx={{ 
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: 2
                        }}>
                          <CardContent sx={{ textAlign: 'center', p: 3 }}>
                            <Typography variant="h4" sx={{ color: '#ef4444', fontWeight: 700 }}>
                              {stats.streakDays}
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                              Tage Streak
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    </Grid>
                  ) : (
                    <Alert severity="info" sx={{ borderRadius: 2 }}>
                      Noch keine Tracking-Daten vorhanden. Starte dein Tracking!
                    </Alert>
                  )}
                </Box>
              )}

              {/* Wissen & Rituale Tab */}
              {activeTab === 2 && (
                <Box sx={{ p: 4 }}>
                  <Typography variant="h5" sx={{ color: 'white', mb: 3, fontWeight: 600 }}>
                    📚 Wissen & Rituale
                  </Typography>
                  
                  <Grid container spacing={4}>
                    {/* Mond-Geschichten */}
                    <Grid item xs={12} md={6}>
                      <Typography variant="h6" sx={{ color: '#fff', mb: 3 }}>
                        📖 Mond-Geschichten & Mythen
                      </Typography>
                      
                      <Grid container spacing={3}>
                        {moonStories.map((story) => (
                          <Grid item xs={12} key={story.id}>
                            <Card sx={{
                              background: 'rgba(255, 255, 255, 0.05)',
                              border: '1px solid rgba(255,255,255,0.1)',
                              borderRadius: 2
                            }}>
                              <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                  <Typography variant="h6" sx={{ color: '#FFD700', mr: 1 }}>
                                    {story.moon_phase === 'Vollmond' ? '🌕' : 
                                     story.moon_phase === 'Neumond' ? '🌑' : '🌙'}
                                  </Typography>
                                  <Typography variant="h6" sx={{ color: '#fff' }}>
                                    {story.title}
                                  </Typography>
                                </Box>
                                <Chip 
                                  label={story.culture} 
                                  size="small" 
                                  sx={{ 
                                    background: '#8B5CF6', 
                                    color: '#fff', 
                                    mb: 2 
                                  }} 
                                />
                                <Typography variant="body2" sx={{ 
                                  color: 'rgba(255,255,255,0.8)', 
                                  mb: 2, 
                                  display: '-webkit-box',
                                  WebkitLineClamp: 3,
                                  WebkitBoxOrient: 'vertical',
                                  overflow: 'hidden'
                                }}>
                                  {story.content}
                                </Typography>
                                <Typography variant="body2" sx={{ 
                                  color: '#FFD700', 
                                  fontStyle: 'italic',
                                  fontSize: '0.9rem'
                                }}>
                                  💡 {story.moral}
                                </Typography>
                              </CardContent>
                            </Card>
                          </Grid>
                        ))}
                      </Grid>
                    </Grid>

                    {/* Pflanzen-Rituale */}
                    <Grid item xs={12} md={6}>
                      <Typography variant="h6" sx={{ color: '#fff', mb: 3 }}>
                        🌱 Pflanzen-Rituale & Mond-Gärtnern
                      </Typography>
                      
                      <Grid container spacing={3}>
                        {plantRituals.map((ritual) => (
                          <Grid item xs={12} key={ritual.id}>
                            <Card sx={{
                              background: 'rgba(34, 197, 94, 0.1)',
                              border: '1px solid rgba(34, 197, 94, 0.3)',
                              borderRadius: 2
                            }}>
                              <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                  <Flower2 size={24} color="#22c55e" style={{ marginRight: 8 }} />
                                  <Typography variant="h6" sx={{ color: '#22c55e' }}>
                                    {ritual.name}
                                  </Typography>
                                </Box>
                                <Chip
                                  label={ritual.moon_phase} 
                                  size="small" 
                                  sx={{
                                    background: '#22c55e', 
                                    color: '#fff', 
                                    mb: 2 
                                  }} 
                                />
                                <Typography variant="body2" sx={{ color: '#fff', mb: 2 }}>
                                  <strong>Pflanzen:</strong> {ritual.plants.join(', ')}
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#fff', mb: 2 }}>
                                  <strong>Timing:</strong> {ritual.timing}
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                                  <strong>Vorteile:</strong> {ritual.benefits.join(', ')}
                                </Typography>
                              </CardContent>
                            </Card>
                          </Grid>
                        ))}
                      </Grid>
                    </Grid>

                    {/* Gesundheit */}
                    <Grid item xs={12}>
                      <Typography variant="h6" sx={{ color: '#fff', mb: 3 }}>
                        💚 Gesundheit & Ernährung nach Mondphasen
                      </Typography>
                      
                      <Grid container spacing={3}>
                        {healthGuidance.map((guidance) => (
                          <Grid item xs={12} md={6} key={guidance.id}>
                            <Card sx={{ 
                              background: 'rgba(239, 68, 68, 0.1)',
                              border: '1px solid rgba(239, 68, 68, 0.3)',
                              borderRadius: 2
                            }}>
                              <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                  <Heart size={24} color="#ef4444" style={{ marginRight: 8 }} />
                                  <Typography variant="h6" sx={{ color: '#ef4444' }}>
                                    {guidance.moon_phase}
                                  </Typography>
                                </Box>
                                
                                <Box sx={{ mb: 2 }}>
                                  <Typography variant="body2" sx={{ color: '#fff', mb: 1 }}>
                                    <strong>🍎 Ernährung:</strong>
                                  </Typography>
                                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mb: 1 }}>
                                    Empfohlen: {guidance.nutrition.recommended.join(', ')}
                                  </Typography>
                                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                                    Vermeiden: {guidance.nutrition.avoid.join(', ')}
                                  </Typography>
                                </Box>
                                
                                <Box sx={{ mb: 2 }}>
                                  <Typography variant="body2" sx={{ color: '#fff', mb: 1 }}>
                                    <strong>⚡ Aktivitäten:</strong>
                                  </Typography>
                                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                                    {guidance.health.activities.join(', ')}
                                  </Typography>
                                </Box>
                                
                                <Box>
                                  <Typography variant="body2" sx={{ color: '#fff', mb: 1 }}>
                                    <strong>💊 Ergänzungen:</strong>
                                  </Typography>
                                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                                    {guidance.supplements.join(', ')}
                                  </Typography>
                                </Box>
                              </CardContent>
                            </Card>
                          </Grid>
                        ))}
                      </Grid>
                    </Grid>
                  </Grid>
                </Box>
              )}

              {/* Einstellungen Tab */}
              {activeTab === 3 && (
                <Box sx={{ p: 4 }}>
                  <Typography variant="h5" sx={{ color: 'white', mb: 3, fontWeight: 600 }}>
                    ⚙️ Einstellungen
                  </Typography>
                  
                  <Typography variant="h6" sx={{ color: '#fff', mb: 3 }}>
                    🔔 Benachrichtigungen
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={notificationSettings.moonPhaseReminders}
                          onChange={(e) => setNotificationSettings({
                            ...notificationSettings,
                            moonPhaseReminders: e.target.checked
                          })}
                          sx={{
                            '& .MuiSwitch-switchBase.Mui-checked': {
                              color: '#8B5CF6'
                            },
                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                              backgroundColor: '#8B5CF6'
                            }
                          }}
                        />
                      }
                      label="Mondphasen-Erinnerungen"
                      sx={{ color: 'rgba(255,255,255,0.8)' }}
                    />
                    
                    <FormControlLabel
                      control={
                        <Switch
                          checked={notificationSettings.dailyReminders}
                          onChange={(e) => setNotificationSettings({
                            ...notificationSettings,
                            dailyReminders: e.target.checked
                          })}
                          sx={{
                            '& .MuiSwitch-switchBase.Mui-checked': {
                              color: '#8B5CF6'
                            },
                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                              backgroundColor: '#8B5CF6'
                            }
                          }}
                        />
                      }
                      label="Tägliche Erinnerungen"
                      sx={{ color: 'rgba(255,255,255,0.8)' }}
                    />
                    
                    <FormControlLabel
                      control={
                        <Switch
                          checked={notificationSettings.weeklyReports}
                          onChange={(e) => setNotificationSettings({
                            ...notificationSettings,
                            weeklyReports: e.target.checked
                          })}
                          sx={{
                            '& .MuiSwitch-switchBase.Mui-checked': {
                              color: '#8B5CF6'
                            },
                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                              backgroundColor: '#8B5CF6'
                            }
                          }}
                        />
                      }
                      label="Wöchentliche Berichte"
                      sx={{ color: 'rgba(255,255,255,0.8)' }}
                    />
                  </Box>
                </Box>
              )}

              </Card>

              {/* Dating-Tipps Widget - nach den Tabs */}
              <motion.div
                
                
                
              >
                <Card sx={{ 
                  background: 'rgba(255, 215, 0, 0.1)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 215, 0, 0.3)',
                  borderRadius: 3, 
                  mb: 4
                }}>
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <Heart size={32} color="#FFD700" style={{ marginRight: 12 }} />
                      <Typography variant="h4" sx={{ color: '#FFD700', fontWeight: 600 }}>
                        💕 Dating-Tipps für {currentPhase?.name || 'diese Mondphase'}
                      </Typography>
                    </Box>
                    
                    <Grid container spacing={3}>
                      {/* Human Design Dating-Tipps */}
                      <Grid item xs={12} md={6}>
                        <Typography variant="h6" sx={{ color: '#fff', mb: 2 }}>
                          🧬 Human Design Dating-Strategie
                        </Typography>
                        
                        {currentPhase?.name === 'Vollmond' && (
                          <Box sx={{ mb: 3 }}>
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)', mb: 2 }}>
                              <strong>🌕 Vollmond-Energie nutzen:</strong> Diese Phase verstärkt deine natürlichen Talente. 
                              Zeige deinem Date deine authentische Persönlichkeit!
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                              <strong>💡 Tipp:</strong> Nutze deine Human Design-Strategie für den perfekten ersten Eindruck.
                            </Typography>
                          </Box>
                        )}
                        
                        {currentPhase?.name === 'Neumond' && (
                          <Box sx={{ mb: 3 }}>
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)', mb: 2 }}>
                              <strong>🌑 Neumond-Energie nutzen:</strong> Perfekt für neue Anfänge! 
                              Diese Phase unterstützt neue Verbindungen und frische Energie.
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                              <strong>💡 Tipp:</strong> Höre auf deine innere Autorität bei Dating-Entscheidungen.
                            </Typography>
                          </Box>
                        )}
                        
                        {currentPhase?.name === 'Zunehmender Mond' && (
                          <Box sx={{ mb: 3 }}>
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)', mb: 2 }}>
                              <strong>🌙 Zunehmender Mond-Energie nutzen:</strong> Ideale Zeit für das Kennenlernen! 
                              Diese Phase unterstützt Wachstum und Entwicklung.
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                              <strong>💡 Tipp:</strong> Nutze deine Intuition für die richtigen Dating-Entscheidungen.
                            </Typography>
                          </Box>
                        )}
                        
                        {currentPhase?.name === 'Abnehmender Mond' && (
                          <Box sx={{ mb: 3 }}>
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)', mb: 2 }}>
                              <strong>🌘 Abnehmender Mond-Energie nutzen:</strong> Perfekt für tiefere Gespräche! 
                              Diese Phase unterstützt Reflexion und emotionale Verbindung.
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                              <strong>💡 Tipp:</strong> Lass alte Dating-Muster los und sei authentisch.
                            </Typography>
                          </Box>
                        )}
                      </Grid>

                      {/* Konkrete Orte & Aktivitäten */}
                      <Grid item xs={12} md={6}>
                        <Typography variant="h6" sx={{ color: '#fff', mb: 2 }}>
                          📍 Konkrete Orte & Aktivitäten
                        </Typography>
                        
                        {currentPhase?.name === 'Vollmond' && (
                          <Box>
                            <Typography variant="body2" sx={{ color: '#FFD700', mb: 1, fontWeight: 600 }}>
                              🌕 Vollmond-Dating-Spots:
                            </Typography>
                            <List dense>
                              <ListItem sx={{ px: 0 }}>
                                <ListItemIcon><Star size={16} style={{ color: '#FFD700' }} /></ListItemIcon>
                                <ListItemText 
                                  primary="Rooftop-Bar mit Stadtblick" 
                                  secondary="Berlin: Klunkerkranich, München: 181 Restaurant"
                                  sx={{ color: 'rgba(255,255,255,0.8)' }}
                                />
                              </ListItem>
                              <ListItem sx={{ px: 0 }}>
                                <ListItemIcon><Star size={16} style={{ color: '#FFD700' }} /></ListItemIcon>
                                <ListItemText 
                                  primary="Mondlicht-Spaziergang am See" 
                                  secondary="München: Englischer Garten, Hamburg: Alster"
                                  sx={{ color: 'rgba(255,255,255,0.8)' }}
                                />
                              </ListItem>
                              <ListItem sx={{ px: 0 }}>
                                <ListItemIcon><Star size={16} style={{ color: '#FFD700' }} /></ListItemIcon>
                                <ListItemText 
                                  primary="Romantisches Restaurant" 
                                  secondary="Köln: Ox & Klee, Frankfurt: Lafleur"
                                  sx={{ color: 'rgba(255,255,255,0.8)' }}
                                />
                              </ListItem>
                            </List>
                          </Box>
                        )}
                        
                        {currentPhase?.name === 'Neumond' && (
                          <Box>
                            <Typography variant="body2" sx={{ color: '#22c55e', mb: 1, fontWeight: 600 }}>
                              🌑 Neumond-Dating-Spots:
                            </Typography>
                            <List dense>
                              <ListItem sx={{ px: 0 }}>
                                <ListItemIcon><Star size={16} style={{ color: '#22c55e' }} /></ListItemIcon>
                                <ListItemText 
                                  primary="Cozy Café mit Kerzenlicht" 
                                  secondary="Berlin: The Barn, München: Man vs Machine"
                                  sx={{ color: 'rgba(255,255,255,0.8)' }}
                                />
                              </ListItem>
                              <ListItem sx={{ px: 0 }}>
                                <ListItemIcon><Star size={16} style={{ color: '#22c55e' }} /></ListItemIcon>
                                <ListItemText 
                                  primary="Kunstmuseum oder Galerie" 
                                  secondary="Hamburg: Kunsthalle, Düsseldorf: K20"
                                  sx={{ color: 'rgba(255,255,255,0.8)' }}
                                />
                              </ListItem>
                              <ListItem sx={{ px: 0 }}>
                                <ListItemIcon><Star size={16} style={{ color: '#22c55e' }} /></ListItemIcon>
                                <ListItemText 
                                  primary="Wellness & Spa" 
                                  secondary="Stuttgart: Le Meridien, Dresden: Taschenbergpalais"
                                  sx={{ color: 'rgba(255,255,255,0.8)' }}
                                />
                              </ListItem>
                            </List>
                          </Box>
                        )}
                        
                        {currentPhase?.name === 'Zunehmender Mond' && (
                          <Box>
                            <Typography variant="body2" sx={{ color: '#3b82f6', mb: 1, fontWeight: 600 }}>
                              🌙 Zunehmender Mond-Dating-Spots:
                            </Typography>
                            <List dense>
                              <ListItem sx={{ px: 0 }}>
                                <ListItemIcon><Star size={16} style={{ color: '#3b82f6' }} /></ListItemIcon>
                                <ListItemText 
                                  primary="Aktivitäten & Erlebnisse" 
                                  secondary="Berlin: Escape Room, München: Kletterhalle"
                                  sx={{ color: 'rgba(255,255,255,0.8)' }}
                                />
                              </ListItem>
                              <ListItem sx={{ px: 0 }}>
                                <ListItemIcon><Star size={16} style={{ color: '#3b82f6' }} /></ListItemIcon>
                                <ListItemText 
                                  primary="Food-Markt oder Street Food" 
                                  secondary="Hamburg: Schanzenviertel, Köln: Belgisches Viertel"
                                  sx={{ color: 'rgba(255,255,255,0.8)' }}
                                />
                              </ListItem>
                              <ListItem sx={{ px: 0 }}>
                                <ListItemIcon><Star size={16} style={{ color: '#3b82f6' }} /></ListItemIcon>
                                <ListItemText 
                                  primary="Konzert oder Live-Musik" 
                                  secondary="Frankfurt: Alte Oper, Leipzig: Gewandhaus"
                                  sx={{ color: 'rgba(255,255,255,0.8)' }}
                                />
                              </ListItem>
                            </List>
                          </Box>
                        )}
                        
                        {currentPhase?.name === 'Abnehmender Mond' && (
                          <Box>
                            <Typography variant="body2" sx={{ color: '#8b5cf6', mb: 1, fontWeight: 600 }}>
                              🌘 Abnehmender Mond-Dating-Spots:
                            </Typography>
                            <List dense>
                              <ListItem sx={{ px: 0 }}>
                                <ListItemIcon><Star size={16} style={{ color: '#8b5cf6' }} /></ListItemIcon>
                                <ListItemText 
                                  primary="Ruhige Parks & Gärten" 
                                  secondary="München: Nymphenburg, Berlin: Tiergarten"
                                  sx={{ color: 'rgba(255,255,255,0.8)' }}
                                />
                              </ListItem>
                              <ListItem sx={{ px: 0 }}>
                                <ListItemIcon><Star size={16} style={{ color: '#8b5cf6' }} /></ListItemIcon>
                                <ListItemText 
                                  primary="Bibliothek oder Buchhandlung" 
                                  secondary="Hamburg: Elbphilharmonie, Köln: Mayersche"
                                  sx={{ color: 'rgba(255,255,255,0.8)' }}
                                />
                              </ListItem>
                              <ListItem sx={{ px: 0 }}>
                                <ListItemIcon><Star size={16} style={{ color: '#8b5cf6' }} /></ListItemIcon>
                                <ListItemText 
                                  primary="Therme oder Sauna" 
                                  secondary="Stuttgart: Mineraltherme, Dresden: Elbamare"
                                  sx={{ color: 'rgba(255,255,255,0.8)' }}
                                />
                              </ListItem>
                            </List>
                          </Box>
                        )}
                      </Grid>
                    </Grid>
                    
                    <Box sx={{ mt: 3, p: 2, background: 'rgba(255,255,255,0.05)', borderRadius: 2 }}>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)', textAlign: 'center', fontStyle: 'italic' }}>
                        &ldquo;Nutze die Mondenergie für authentische Verbindungen. 
                        Dein Human Design zeigt dir den Weg zu echten, tiefen Beziehungen.&rdquo;
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
          </motion.div>

      </Container>
    </Box>
    </AccessControl>
  );
}
