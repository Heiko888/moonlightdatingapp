"use client";
import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { 
  Reading
} from '@/types/common.types';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Grid,
  Paper,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Tabs,
  Tab,
  MenuItem
} from '@mui/material';
import {
  MenuBook,
  ArrowForward,
  CompareArrows,
  PersonAdd
} from '@mui/icons-material';
import AccessControl from '../../components/AccessControl';
import ChartComparisonModal from '../../components/ChartComparisonModal';
// import { UserSubscription } from '../../lib/subscription/types'; // Entfernt - nicht mehr benötigt
// import { SubscriptionService } from '../../lib/subscription/subscriptionService'; // Entfernt - nicht mehr benötigt
import { safeJsonParse } from '@/lib/supabase/client';

interface ReadingExtended extends Reading {
  question: string;
  status: string;
  datingType?: string;
}


const ReadingPage: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [userSubscription, setUserSubscription] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<number>(0);
  // isClient State entfernt für bessere Performance
  const [readings, setReadings] = useState<ReadingExtended[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [newReadingDialog, setNewReadingDialog] = useState<boolean>(false);
  const [newReadingTitle, setNewReadingTitle] = useState('');
  const [newReadingQuestion, setNewReadingQuestion] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDatingType, setSelectedDatingType] = useState('');
  const [newReadingBirthdate, setNewReadingBirthdate] = useState('');
  const [newReadingBirthtime, setNewReadingBirthtime] = useState('');
  const [newReadingBirthplace, setNewReadingBirthplace] = useState('');
  const [newReadingEmail, setNewReadingEmail] = useState('');
  const [newReadingPhone, setNewReadingPhone] = useState('');
  
  // Chartvergleich States
  const [showComparisonModal, setShowComparisonModal] = useState(false);
  const [chart1Data, setChart1Data] = useState<any>(null);
  const [chart2Data, setChart2Data] = useState<any>(null);
  const [selectedChart1, setSelectedChart1] = useState('');
  const [selectedChart2, setSelectedChart2] = useState('');
  const [friends, setFriends] = useState<any[]>([]);

  // Authentifizierung und Subscription prüfen
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      
      if (!token || !userId) {
        // Keine Authentifizierung erforderlich - App ist öffentlich
        return;
      }
      
      // isClient State entfernt
      
      // Daten laden
      loadReadings();
      loadUserSubscription();
      loadFriends();
    };

    checkAuth();
  }, [router]);

  const loadFriends = async () => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) return;

      const response = await fetch(`/api/friends?userId=${userId}`);
      const data = await response.json();

      if (data.success && data.friends) {
        setFriends(data.friends);
      }
    } catch (error) {
      console.error('Fehler beim Laden der Friends:', error);
    }
  };

  const loadUserSubscription = async () => {
    try {
      const userData = localStorage.getItem('userData');
      if (userData) {
        const user = safeJsonParse(userData, {});
        // Temporärer Fix - SubscriptionService entfernt
        // const subscription = await SubscriptionService.getUserSubscription(user.id);
        const subscription = null;
        setUserSubscription(subscription);
      }
    } catch (error) {
      console.error('Fehler beim Laden des Abonnements:', error);
    }
  };

  const loadReadings = async () => {
    try {
      setLoading(true);
      // SSR-sicherer localStorage Zugriff
      if (typeof window !== 'undefined') {
        const localReadings = safeJsonParse(localStorage.getItem('userReadings') || '[]', []);
        setReadings(localReadings);
      }
    } catch (error) {
      console.error('Fehler beim Laden der Readings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const createNewReading = async () => {
    if (!newReadingTitle || !newReadingQuestion || !newReadingBirthdate || !newReadingBirthtime || !newReadingBirthplace || !newReadingEmail) {
      alert('Bitte fülle alle Pflichtfelder aus!');
      return;
    }

    setLoading(true);
    try {
      // Hole User-ID
      const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') || 'anonymous' : 'anonymous';

      // Sende Reading an Backend-API
      const response = await fetch('/api/readings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          title: newReadingTitle,
          question: newReadingQuestion,
          category: selectedCategory,
          datingType: selectedDatingType,
          birthdate: newReadingBirthdate,
          birthtime: newReadingBirthtime,
          birthplace: newReadingBirthplace,
          email: newReadingEmail,
          phone: newReadingPhone
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Fehler beim Erstellen des Readings');
      }

      // Speichere auch lokal für Offline-Zugriff
      if (typeof window !== 'undefined') {
        const existingReadings = safeJsonParse(localStorage.getItem('userReadings') || '[]', []);
        existingReadings.push(data.reading);
        localStorage.setItem('userReadings', JSON.stringify(existingReadings));
        localStorage.setItem('currentReadingId', data.reading.id);
      }

      // Aktualisiere State
      loadReadings();
      setNewReadingDialog(false);
      
      // Reset Form
      setNewReadingTitle('');
      setNewReadingQuestion('');
      setSelectedCategory('');
      setSelectedDatingType('');
      setNewReadingBirthdate('');
      setNewReadingBirthtime('');
      setNewReadingBirthplace('');
      setNewReadingEmail('');
      setNewReadingPhone('');

      // Weiterleitung zur "Nächste Schritte"-Seite
      console.log('Reading erfolgreich erstellt, leite weiter...');
      
      // Verwende window.location als Fallback für robustere Weiterleitung
      if (typeof window !== 'undefined') {
        window.location.href = '/resonanzanalyse/next-steps';
      } else {
        router.push('/resonanzanalyse/next-steps');
      }
    } catch (error) {
      console.error('Fehler beim Erstellen des Readings:', error);
      alert(error instanceof Error ? error.message : 'Fehler beim Erstellen des Readings');
    } finally {
      setLoading(false);
    }
  };

  const generateReadingContent = (category: string, datingType: string, question: string): string => {
    try {
      // Erweiterte Reading-Struktur basierend auf dem 6/3 Generator Beispiel
      let content = `# 🧬 **${newReadingTitle}**\n\n`;
      content += `**📅 Erstellt am:** ${new Date().toLocaleDateString('de-DE')}\n`;
      content += `**🎯 Kategorie:** ${category}\n`;
      content += `**👤 Human Design Typ:** ${datingType}\n\n`;
      
      content += `## ❓ Deine Frage\n\n`;
      content += `*"${question}"*\n\n`;
      
      content += `---\n\n`;
      
      // Erweiterte Human Design Profile
      interface HDProfile {
        type: string;
        strategy: string;
        authority: string;
        profile: string;
        description: string;
        energy: string;
        strengths: string[];
        challenges: string[];
        centers: {
          defined: string[];
          open: string[];
        };
        business: {
          style: string;
          marketing: string;
          sales: string;
          formats: string[];
        };
      }
      
      const hdProfiles: Record<string, HDProfile> = {
        'Generator': {
          type: 'Generator',
          strategy: 'Reagieren',
          authority: 'Sakral-Autorität',
          profile: 'Lebenskraft und Ausdauer',
          description: 'Du bist die Lebenskraft des Planeten. Deine Energie ist konstant und zuverlässig.',
          energy: 'Lebenskraft und Ausdauer',
          strengths: ['Ausdauer', 'Zuverlässigkeit', 'Lebensfreude', 'Arbeitskraft', 'Konstante Energie'],
          challenges: ['Warten lernen', 'Nicht initiieren', 'Sakral-Signale hören', 'Frustration vermeiden'],
          centers: {
            defined: ['Sakral', 'Wurzel', 'Milz'],
            open: ['Ajna', 'Krone', 'Hals', 'Emotion', 'Ego', 'G-Zentrum']
          },
          business: {
            style: 'Reaktion + Erfahrung + Weisheit',
            marketing: 'Authentizität statt Strategie',
            sales: 'Resonanz statt Push',
            formats: ['Retreats', '1:1-Angebote', 'Storytelling', 'Prozess-basierte Programme']
          }
        },
        'Manifesting Generator': {
          type: 'Manifesting Generator',
          strategy: 'Warten auf die Antwort, dann informieren',
          authority: 'Sakral-Autorität',
          profile: 'Dynamische Lebenskraft',
          description: 'Du bist der dynamische Macher - du kannst sowohl initiieren als auch reagieren.',
          energy: 'Dynamische Lebenskraft',
          strengths: ['Flexibilität', 'Effizienz', 'Multi-Tasking', 'Energie', 'Schnelle Umsetzung'],
          challenges: ['Geduld', 'Kommunikation', 'Prioritäten setzen', 'Informieren lernen'],
          centers: {
            defined: ['Sakral', 'Wurzel', 'Milz'],
            open: ['Ajna', 'Krone', 'Hals', 'Emotion', 'Ego', 'G-Zentrum']
          },
          business: {
            style: 'Dynamik + Effizienz + Anpassung',
            marketing: 'Schnelle, effiziente Kommunikation',
            sales: 'Direkte, klare Angebote',
            formats: ['Online-Kurse', 'Schnelle Programme', 'Multi-Format-Angebote']
          }
        },
        'Projector': {
          type: 'Projector',
          strategy: 'Warten auf die Einladung',
          authority: 'Emotionale oder andere Autorität',
          profile: 'Führung und Beratung',
          description: 'Du bist der natürliche Führer und Berater. Du siehst andere klar.',
          energy: 'Führung und Beratung',
          strengths: ['Weisheit', 'Führungsqualitäten', 'Einsicht', 'Beratung', 'Tiefe Analyse'],
          challenges: ['Warten auf Einladungen', 'Nicht initiieren', 'Erkennung finden', 'Geduld'],
          centers: {
            defined: ['Milz', 'Wurzel'],
            open: ['Sakral', 'Ajna', 'Krone', 'Hals', 'Emotion', 'Ego', 'G-Zentrum']
          },
          business: {
            style: 'Weisheit + Führung + Beratung',
            marketing: 'Wertvolle Inhalte, die Einladungen schaffen',
            sales: 'Beratung und Führung',
            formats: ['Coaching', 'Beratung', 'Führungsprogramme', 'Mentoring']
          }
        },
        'Manifestor': {
          type: 'Manifestor',
          strategy: 'Informieren',
          authority: 'Emotionale oder andere Autorität',
          profile: 'Initiierung und Aktion',
          description: 'Du bist der Initiator. Du bringst Dinge in Bewegung.',
          energy: 'Initiierung und Aktion',
          strengths: ['Initiative', 'Unabhängigkeit', 'Durchsetzungskraft', 'Führung', 'Innovation'],
          challenges: ['Informieren lernen', 'Frieden schaffen', 'Andere einbeziehen', 'Geduld'],
          centers: {
            defined: ['Hals', 'Wurzel'],
            open: ['Sakral', 'Ajna', 'Krone', 'Milz', 'Emotion', 'Ego', 'G-Zentrum']
          },
          business: {
            style: 'Initiierung + Innovation + Führung',
            marketing: 'Bahnbrechende Ideen und Innovationen',
            sales: 'Überzeugungskraft und Durchsetzung',
            formats: ['Startups', 'Innovationsprogramme', 'Führungskräfte-Entwicklung']
          }
        },
        'Reflector': {
          type: 'Reflector',
          strategy: 'Warten auf den Mondzyklus',
          authority: 'Mond-Autorität',
          profile: 'Spiegel der Gemeinschaft',
          description: 'Du bist der Spiegel der Gemeinschaft. Du reflektierst die Gesundheit der Gruppe.',
          energy: 'Spiegel der Gemeinschaft',
          strengths: ['Objektivität', 'Gemeinschaftsgefühl', 'Flexibilität', 'Weisheit', 'Spiegelfunktion'],
          challenges: ['Entscheidungen treffen', 'Mondzyklus befolgen', 'Schutz vor Einflüssen', 'Geduld'],
          centers: {
            defined: [],
            open: ['Sakral', 'Ajna', 'Krone', 'Hals', 'Milz', 'Emotion', 'Ego', 'G-Zentrum', 'Wurzel']
          },
          business: {
            style: 'Spiegelung + Gemeinschaft + Weisheit',
            marketing: 'Gemeinschaftsorientierte Inhalte',
            sales: 'Gemeinschaftsbildung und Verbindung',
            formats: ['Community-Programme', 'Gruppen-Coaching', 'Gemeinschafts-Events']
          }
        }
      };
      
      const userProfile = hdProfiles[datingType] || hdProfiles['Generator'];
      
      // Vollständiges Human Design Profil
      content += `## 🧬 **${userProfile.type} mit ${userProfile.authority}**\n\n`;
      content += `**Typ:** ${userProfile.type}\n`;
      content += `**Strategie:** ${userProfile.strategy}\n`;
      content += `**Autorität:** ${userProfile.authority}\n`;
      content += `**Profil:** ${userProfile.profile}\n\n`;
      
      content += `### 🔋 **Typ: ${userProfile.type}**\n\n`;
      content += `${userProfile.description}\n\n`;
      
      content += `**Was dich stärkt:**\n\n`;
      userProfile.strengths.forEach((strength: string) => {
        content += `* ${strength}\n`;
      });
      content += `\n`;
      
      content += `**Deine Herausforderungen:**\n\n`;
      userProfile.challenges.forEach((challenge: string) => {
        content += `* ${challenge}\n`;
      });
      content += `\n`;
      
      content += `### 🌊 **Autorität: ${userProfile.authority}**\n\n`;
      if (userProfile.authority === 'Sakral-Autorität') {
        content += `Du triffst Entscheidungen über dein Bauchgefühl. Dein Sakralzentrum gibt dir klare Ja-/Nein-Antworten.\n\n`;
        content += `**Entscheidungsstil:**\n`;
        content += `* Höre auf deine Sakral-Antworten (Ah-hah, Uh-uh)\n`;
        content += `* Vertraue deinem ersten Gefühl\n`;
        content += `* Warte auf die richtige Frage\n`;
        content += `* Reagiere spontan auf das, was dich begeistert\n\n`;
      } else if (userProfile.authority === 'Emotionale oder andere Autorität') {
        content += `Du triffst Entscheidungen nicht spontan – du brauchst Zeit, um durch deine emotionale Welle zu gehen.\n\n`;
        content += `**Entscheidungsstil:**\n`;
        content += `* Warte, bis du emotional ausgeglichen bist\n`;
        content += `* Beobachte deine Hoch- und Tiefphasen\n`;
        content += `* Triff keine Entscheidungen in Euphorie oder Verzweiflung\n`;
        content += `* Gib dir mehrere Tage Bedenkzeit bei großen Entscheidungen\n\n`;
      } else if (userProfile.authority === 'Mond-Autorität') {
        content += `Du brauchst einen vollen Mondzyklus (28 Tage), um wichtige Entscheidungen zu treffen.\n\n`;
        content += `**Entscheidungsstil:**\n`;
        content += `* Warte auf den Mondzyklus\n`;
        content += `* Sammle Informationen über 28 Tage\n`;
        content += `* Beobachte deine Reaktionen auf verschiedene Optionen\n`;
        content += `* Vertraue auf die Klarheit nach dem Zyklus\n\n`;
      }
      
      content += `### 🌀 **Zentren**\n\n`;
      content += `**Definiert:**\n`;
      userProfile.centers.defined.forEach((center: string) => {
        content += `* **${center}**: Stabile, zuverlässige Energie\n`;
      });
      content += `\n`;
      
      content += `**Offen:**\n`;
      userProfile.centers.open.forEach((center: string) => {
        content += `* **${center}**: Empfänglich für Einflüsse - hier kannst du wachsen\n`;
      });
      content += `\n`;
      
      content += `---\n\n`;
      
      // Business & Marketing Bereich (falls relevant)
      if (category === 'business' || category === 'career' || category === 'leadership') {
        content += `## 🔥 **Business & Marketing als ${userProfile.type}**\n\n`;
        content += `### 🧭 **Grundenergie im Business: ${userProfile.business.style}**\n\n`;
        content += `### 📈 **Dein natürlicher Marketingstil: ${userProfile.business.marketing}**\n\n`;
        content += `### 💬 **Verkaufsenergie: ${userProfile.business.sales}**\n\n`;
        content += `### 🛠️ **Konkrete Businessformate, die zu dir passen:**\n\n`;
        userProfile.business.formats.forEach((format: string) => {
          content += `| 🔹 ${format} | Deine natürliche Stärke in diesem Bereich |\n`;
        });
        content += `\n`;
        
        content += `### 🧠 **Dein ideales Marketingmantra:**\n\n`;
        content += `> **"Ich bin kein Produkt. Ich bin Erfahrung, Reife und Echtheit."**\n`;
        content += `> **"Ich muss nicht verkaufen – ich muss sichtbar sein in meinem Prozess."**\n\n`;
        
        content += `### 🚫 **Warnsignale, dass du dich im Business verlierst:**\n\n`;
        content += `* Du machst etwas, nur weil „man das so macht"\n`;
        content += `* Du bist im Launch, fühlst dich aber leer\n`;
        content += `* Du passt dich an den Markt an und verlierst deine Stimme\n`;
        content += `* Du verbirgst Fehler – obwohl sie deine Stärke wären\n\n`;
        
        content += `---\n\n`;
      }
      
      // Kategorie-spezifische Bereiche
      content += `## 🔍 **Detaillierte Bereiche**\n\n`;
      
      interface DetailedArea {
        title: string;
        areas: Array<{
          name: string;
          content: string;
        }>;
      }
      
      const detailedAreas: Record<string, DetailedArea> = {
        'first-date': {
          title: '💕 First Date Bereich',
          areas: [
            {
              name: 'Ort & Aktivität',
              content: `Wähle einen Ort, der zu deiner ${userProfile.type}-Energie passt. ${userProfile.type === 'Generator' ? 'Generatoren lieben Aktivität und Bewegung.' : userProfile.type === 'Projector' ? 'Projectors bevorzugen ruhige Gespräche und tiefe Verbindung.' : userProfile.type === 'Manifestor' ? 'Manifestors brauchen Raum für Initiative und Führung.' : 'Reflectors brauchen Zeit und Raum zum Spiegeln.'}`
            },
            {
              name: 'Kommunikation',
              content: `Sei authentisch und folge deiner inneren Autorität. ${userProfile.type === 'Generator' ? 'Generatoren warten auf Fragen und reagieren spontan.' : userProfile.type === 'Projector' ? 'Projectors teilen Weisheit nur bei Einladung.' : userProfile.type === 'Manifestor' ? 'Manifestors informieren über ihre Pläne.' : 'Reflectors brauchen Zeit für ihre Antworten.'}`
            },
            {
              name: 'Energie-Management',
              content: 'Achte auf die Energie deines Dates. Manche brauchen mehr Raum, andere mehr Nähe. Respektiere die unterschiedlichen Bedürfnisse und folge deiner eigenen Energie.'
            },
            {
              name: 'Nach dem Date',
              content: 'Reflektiere über deine Energie und Reaktionen. Was hat sich gut angefühlt? Was war herausfordernd? Nutze diese Erkenntnisse für zukünftige Dates.'
            }
          ]
        },
        'relationship': {
          title: '💑 Beziehungs-Bereich',
          areas: [
            {
              name: 'Energie-Dynamik',
              content: `Verstehe die Energie-Dynamik zwischen euch. Als ${userProfile.type} bringst du ${userProfile.energy} in die Beziehung. Wie ergänzen sich eure Energien?`
            },
            {
              name: 'Kommunikationsstrategien',
              content: `Respektiere die unterschiedlichen Strategien. Als ${userProfile.type} folgst du der Strategie "${userProfile.strategy}". Kommuniziere das klar mit deinem Partner.`
            },
            {
              name: 'Gemeinsame Channels',
              content: 'Nutze eure gemeinsamen Channels für tiefere Verbindung. Diese sind eure natürlichen Verbindungspunkte und zeigen eure gemeinsamen Talente.'
            },
            {
              name: 'Wachstum zusammen',
              content: 'Arbeite an euren individuellen Wachstumsbereichen. Unterstützt euch gegenseitig beim Lernen und Wachsen, besonders in den offenen Centers.'
            }
          ]
        },
        'communication': {
          title: '💬 Kommunikations-Bereich',
          areas: [
            {
              name: `${userProfile.type} Kommunikation`,
              content: `${userProfile.type === 'Generator' ? 'Warte auf die richtige Frage, bevor du antwortest. Deine Sakral-Autorität zeigt dir, wann du wirklich antworten solltest.' : userProfile.type === 'Projector' ? 'Teile deine Weisheit, aber nur wenn du eingeladen wirst. Deine Einsichten sind wertvoll, aber nur wenn sie gewünscht sind.' : userProfile.type === 'Manifestor' ? 'Informiere andere über deine Pläne. Kommunikation ist der Schlüssel zu friedlichen Beziehungen.' : 'Nimm dir Zeit für wichtige Entscheidungen. Der Mondzyklus gibt dir die Klarheit, die du brauchst.'}`
            },
            {
              name: 'Authentische Kommunikation',
              content: 'Kommuniziere aus deiner wahren Natur heraus. Sei ehrlich über deine Bedürfnisse und Grenzen.'
            },
            {
              name: 'Energie-basierte Kommunikation',
              content: 'Achte auf die Energie deines Gesprächspartners. Verschiedene Typen brauchen verschiedene Arten der Kommunikation.'
            },
            {
              name: 'Konfliktlösung',
              content: 'Nutze deine Human Design Weisheit für bessere Konfliktlösung. Verstehe die Energie des anderen und finde gemeinsame Lösungen.'
            }
          ]
        },
        'career': {
          title: '💼 Karriere-Bereich',
          areas: [
            {
              name: 'Energie & Arbeit',
              content: `Finde Arbeit, die zu deiner ${userProfile.type}-Energie passt. ${userProfile.type === 'Generator' ? 'Generatoren brauchen befriedigende Arbeit, die sie energetisiert.' : userProfile.type === 'Projector' ? 'Projectors suchen Anerkennung und Führungsrollen.' : userProfile.type === 'Manifestor' ? 'Manifestors brauchen Freiheit und Initiative.' : 'Reflectors brauchen vielfältige Erfahrungen.'}`
            },
            {
              name: 'Strategie im Beruf',
              content: `Wende deine Strategie "${userProfile.strategy}" auch im Beruf an. Warte auf die richtigen Gelegenheiten und folge deiner Autorität.`
            },
            {
              name: 'Wachstum & Entwicklung',
              content: 'Nutze deine offenen Centers für berufliches Wachstum. Sie zeigen dir, wo du lernen und dich entwickeln kannst.'
            },
            {
              name: 'Zusammenarbeit',
              content: 'Verstehe die Energie deiner Kollegen. Verschiedene Typen brauchen verschiedene Arten der Zusammenarbeit und Führung.'
            }
          ]
        },
        'health': {
          title: '🌱 Gesundheits-Bereich',
          areas: [
            {
              name: 'Energie-Management',
              content: `Achte auf deine Energie. Als ${userProfile.type} brauchst du ${userProfile.type === 'Generator' ? 'Bewegung und befriedigende Aktivitäten.' : userProfile.type === 'Projector' ? 'Ruhe und Anerkennung.' : userProfile.type === 'Manifestor' ? 'Freiheit und Initiative.' : 'Zeit und Raum zum Spiegeln.'}`
            },
            {
              name: 'Ernährung',
              content: 'Höre auf deine innere Autorität bei der Ernährung. Dein Körper weiß, was er braucht, wenn du ihm zuhörst.'
            },
            {
              name: 'Stress-Management',
              content: 'Verstehe deine Stress-Signale. Offene Centers zeigen dir, wo du anfällig für Stress bist und wie du dich schützen kannst.'
            },
            {
              name: 'Wohlbefinden',
              content: `Folge deiner Strategie "${userProfile.strategy}" für besseres Wohlbefinden. Sie ist dein Kompass für ein gesundes Leben.`
            }
          ]
        },
        'marketing': {
          title: '📈 Marketing & Verkauf',
          areas: [
            {
              name: 'Authentisches Marketing',
              content: `Als ${userProfile.type} funktioniert für dich ${userProfile.business.marketing}. Zeige deine echte Persönlichkeit und teile deine Erfahrungen.`
            },
            {
              name: 'Verkaufsstrategie',
              content: `Deine Verkaufsenergie ist ${userProfile.business.sales}. Nutze deine natürlichen Stärken für authentische Verkaufsgespräche.`
            },
            {
              name: 'Content-Erstellung',
              content: 'Erstelle Inhalte, die zu deiner Energie passen. Teile deine Geschichte und deine Erfahrungen authentisch.'
            },
            {
              name: 'Kundenbeziehungen',
              content: 'Baue echte Beziehungen zu deinen Kunden auf. Deine Human Design Weisheit hilft dir, die richtigen Menschen anzusprechen.'
            }
          ]
        },
        'entrepreneurship': {
          title: '💡 Unternehmertum',
          areas: [
            {
              name: 'Geschäftsidee entwickeln',
              content: `Als ${userProfile.type} bringst du ${userProfile.energy} in dein Unternehmen. Nutze deine natürlichen Talente für deine Geschäftsidee.`
            },
            {
              name: 'Strategie & Planung',
              content: `Folge deiner Strategie "${userProfile.strategy}" auch im Business. Plane nicht zu detailliert, sondern reagiere auf Gelegenheiten.`
            },
            {
              name: 'Team aufbauen',
              content: 'Baue ein Team auf, das deine Energie ergänzt. Verstehe die verschiedenen Human Design Typen für bessere Zusammenarbeit.'
            },
            {
              name: 'Wachstum & Skalierung',
              content: 'Skaliere dein Business im Einklang mit deiner Energie. Erzwinge kein Wachstum, das nicht zu dir passt.'
            }
          ]
        },
        'teamwork': {
          title: '👥 Teamarbeit',
          areas: [
            {
              name: 'Team-Dynamik verstehen',
              content: `Als ${userProfile.type} bringst du ${userProfile.energy} ins Team. Verstehe die Energie deiner Teammitglieder für bessere Zusammenarbeit.`
            },
            {
              name: 'Kommunikation im Team',
              content: 'Nutze deine Human Design Weisheit für bessere Teamkommunikation. Verschiedene Typen brauchen verschiedene Kommunikationsstile.'
            },
            {
              name: 'Konflikte lösen',
              content: 'Löse Teamkonflikte durch Verständnis der verschiedenen Energien. Jeder Typ hat andere Bedürfnisse und Reaktionsweisen.'
            },
            {
              name: 'Produktivität steigern',
              content: 'Steigere die Teamproduktivität durch optimale Energieverteilung. Nutze die Stärken jedes Teammitglieds.'
            }
          ]
        },
        'job-search': {
          title: '🔍 Jobsuche',
          areas: [
            {
              name: 'Richtige Jobs finden',
              content: `Suche Jobs, die zu deiner ${userProfile.type}-Energie passen. ${userProfile.type === 'Generator' ? 'Generatoren brauchen befriedigende Arbeit.' : userProfile.type === 'Projector' ? 'Projectors suchen Anerkennung und Führung.' : userProfile.type === 'Manifestor' ? 'Manifestors brauchen Freiheit und Initiative.' : 'Reflectors brauchen vielfältige Erfahrungen.'}`
            },
            {
              name: 'Bewerbungsstrategie',
              content: `Nutze deine Strategie "${userProfile.strategy}" auch bei der Jobsuche. Warte auf die richtigen Gelegenheiten und folge deiner Autorität.`
            },
            {
              name: 'Vorstellungsgespräche',
              content: 'Sei authentisch in Vorstellungsgesprächen. Zeige deine echte Persönlichkeit und deine Human Design Stärken.'
            },
            {
              name: 'Networking',
              content: 'Baue echte berufliche Beziehungen auf. Nutze deine Human Design Weisheit für authentisches Networking.'
            }
          ]
        },
        'skills': {
          title: '🎯 Fähigkeiten entwickeln',
          areas: [
            {
              name: 'Natürliche Talente nutzen',
              content: `Entwickle deine natürlichen ${userProfile.type}-Talente. Nutze deine definierten Centers für deine Stärken.`
            },
            {
              name: 'Wachstumsbereiche',
              content: 'Arbeite an deinen offenen Centers für persönliches Wachstum. Sie zeigen dir, wo du lernen und dich entwickeln kannst.'
            },
            {
              name: 'Lernstrategien',
              content: `Lerne im Einklang mit deiner Strategie "${userProfile.strategy}". Finde Lernmethoden, die zu deiner Energie passen.`
            },
            {
              name: 'Fähigkeiten anwenden',
              content: 'Wende deine Fähigkeiten authentisch an. Nutze deine Human Design Weisheit für bessere Anwendung deiner Talente.'
            }
          ]
        },
        'networking': {
          title: '🤝 Networking',
          areas: [
            {
              name: 'Authentische Verbindungen',
              content: `Baue echte Verbindungen auf, die zu deiner ${userProfile.type}-Energie passen. Sei authentisch in deinen Beziehungen.`
            },
            {
              name: 'Networking-Strategie',
              content: `Nutze deine Strategie "${userProfile.strategy}" auch beim Networking. Warte auf die richtigen Gelegenheiten und Menschen.`
            },
            {
              name: 'Wertvolle Beziehungen',
              content: 'Baue wertvolle berufliche Beziehungen auf. Verstehe die verschiedenen Human Design Typen für bessere Verbindungen.'
            },
            {
              name: 'Gegenseitige Unterstützung',
              content: 'Unterstütze andere und lass dich unterstützen. Nutze deine Human Design Weisheit für gegenseitige Hilfe.'
            }
          ]
        },
        'team-management': {
          title: '👥 Team-Management',
          areas: [
            {
              name: 'Führungsstil entwickeln',
              content: `Als ${userProfile.type} entwickle einen Führungsstil, der zu deiner Energie passt. Nutze deine natürlichen Führungsqualitäten.`
            },
            {
              name: 'Team-Energie verstehen',
              content: 'Verstehe die Energie deines Teams. Verschiedene Human Design Typen brauchen verschiedene Führungsansätze.'
            },
            {
              name: 'Motivation & Engagement',
              content: 'Motiviere dein Team durch Verständnis ihrer individuellen Bedürfnisse. Jeder Typ hat andere Motivationsfaktoren.'
            },
            {
              name: 'Performance-Management',
              content: 'Führe Performance-Gespräche im Einklang mit Human Design Prinzipien. Verstehe die Stärken und Wachstumsbereiche jedes Teammitglieds.'
            }
          ]
        },
        'decision-making': {
          title: '🎯 Entscheidungsfindung',
          areas: [
            {
              name: 'Entscheidungsprozess',
              content: `Nutze deine ${userProfile.authority} für bessere Entscheidungen. Folge deiner inneren Autorität bei wichtigen Entscheidungen.`
            },
            {
              name: 'Team-Entscheidungen',
              content: 'Führe Team-Entscheidungen durch Verständnis der verschiedenen Autoritäten. Jeder Typ hat andere Entscheidungsprozesse.'
            },
            {
              name: 'Strategische Planung',
              content: `Plane strategisch im Einklang mit deiner Strategie "${userProfile.strategy}". Erzwinge keine Entscheidungen, die nicht zu dir passen.`
            },
            {
              name: 'Risikobewertung',
              content: 'Bewerte Risiken durch deine Human Design Weisheit. Nutze deine natürliche Intuition für bessere Entscheidungen.'
            }
          ]
        }
      };
      
      const selectedArea = detailedAreas[category] || detailedAreas['first-date'];
      
      content += `### ${selectedArea.title}\n\n`;
      
      selectedArea.areas.forEach((area, index: number) => {
        content += `#### ${index + 1}. ${area.name}\n\n`;
        content += `${area.content}\n\n`;
      });
      
      content += `---\n\n`;
      
      // Praktische Übungen
      content += `## 🎯 **Praktische Übungen**\n\n`;
      content += `### Diese Woche:\n\n`;
      content += `• **Tag 1-2:** Beobachte deine Energie und Reaktionen\n`;
      content += `• **Tag 3-4:** Experimentiere mit deiner Strategie "${userProfile.strategy}"\n`;
      content += `• **Tag 5-6:** Arbeite an einem Wachstumsbereich\n`;
      content += `• **Tag 7:** Reflektiere über deine Erfahrungen\n\n`;
      
      content += `### Nächste Schritte:\n\n`;
      content += `• Vertraue auf deine innere Weisheit\n`;
      content += `• Sei geduldig mit dir selbst und dem Prozess\n`;
      content += `• Dokumentiere deine Erkenntnisse\n`;
      content += `• Teile deine Erfahrungen mit anderen\n\n`;
      
      content += `---\n\n`;
      content += `*Dieses Reading wurde basierend auf Human Design Prinzipien erstellt und ist eine persönliche Interpretation deiner energetischen Struktur.*\n\n`;
      content += `*Für ein persönliches Reading wende dich an einen zertifizierten Human Design Berater.*`;
      
      return content;
    } catch (error) {
      console.error('Fehler in generateReadingContent:', error);
      return `📖 **${newReadingTitle}**\n\n**Deine Frage:** ${question}\n\n**✨ Allgemeine Human Design Insights:**\n\nBasierend auf deiner Frage und deinem Human Design hier einige wertvolle Erkenntnisse:\n\n• Folge immer deiner inneren Autorität bei wichtigen Entscheidungen\n• Nutze deine Strategie als Kompass für dein Leben\n• Arbeite an deinen offenen Centers für persönliches Wachstum\n• Verstehe deine Definition für bessere Beziehungen\n\n**🎯 Nächste Schritte:**\n• Beobachte deine Energie und Reaktionen in den nächsten Tagen\n• Experimentiere mit den gegebenen Tipps\n• Vertraue auf deine innere Weisheit\n• Sei geduldig mit dir selbst und dem Prozess\n\n*Dieses Reading wurde basierend auf Human Design Prinzipien erstellt.*`;
    }
  };

  // isClient Check entfernt - Seite lädt sofort

  return (
    <AccessControl 
      path={pathname} 
      userSubscription={userSubscription}
      onUpgrade={() => router.push('/pricing')}
    >
    <Box sx={{ 
      minHeight: '100vh',
      background: `
        radial-gradient(circle at 20% 20%, rgba(255, 107, 157, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 80% 80%, rgba(78, 205, 196, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 40% 60%, rgba(102, 126, 234, 0.1) 0%, transparent 50%),
        linear-gradient(135deg, #0F0F23 0%, #1A1A2E 100%)
      `,
      position: 'relative',
      overflow: 'hidden'
    }}>
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2, py: { xs: 4, md: 8 }, px: { xs: 1, sm: 2 } }}>
        {/* Header */}
        <Box sx={{ 
          textAlign: 'center', 
          mb: 6,
          py: { xs: 4, md: 6 }
        }}>
          <Typography
            variant="h2"
            sx={{
              background: 'linear-gradient(135deg, #ff6b9d, #c44569, #4ecdc4)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 800,
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              mb: 2,
              textShadow: '0 0 30px rgba(255, 107, 157, 0.3)'
            }}
          >
            the Connection Code - Deine Resonanzanalyse
          </Typography>
          <Typography 
            variant="h5" 
            sx={{ 
              color: 'rgba(255,255,255,0.8)', 
              mb: 3,
              fontSize: { xs: '1.1rem', md: '1.3rem' },
              maxWidth: '600px',
              mx: 'auto',
              lineHeight: 1.6
            }}
          >
            Tauche ein in die Welt deiner Energie und entdecke dein energetisches Potenzial.
          </Typography>
        </Box>

        {/* Main Content */}
        <Paper 
          elevation={3} 
          sx={{ 
            borderRadius: 3,
            background: 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.1)',
            overflow: 'hidden'
          }}
        >
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              variant="fullWidth"
              sx={{
                '& .MuiTab-root': {
                  color: 'rgba(255,255,255,0.7)',
                  fontWeight: 600,
                  textTransform: 'none',
                  fontSize: '1.1rem',
                  py: 2,
                  '&.Mui-selected': {
                    color: '#ff6b9d',
                    background: 'rgba(255, 107, 157, 0.1)',
                  },
                },
                '& .MuiTabs-indicator': {
                  background: 'linear-gradient(45deg, #ff6b9d, #4ecdc4)',
                  height: 3,
                  borderRadius: 2
                },
              }}
            >
              <Tab label="📚 Meine Readings" />
              <Tab label="✨ Neues Reading" />
              <Tab label="🎯 Empfehlungen" />
              <Tab label="🔄 Chartvergleich" />
            </Tabs>

            <Box sx={{ p: 4 }}>
              {activeTab === 0 && (
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h5" sx={{ color: 'white', fontWeight: 600 }}>
                      Deine Readings
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<ArrowForward />}
                      onClick={() => setNewReadingDialog(true)}
                      sx={{
                        background: 'linear-gradient(45deg, #ff6b9d, #c44569)',
                        '&:hover': {
                          background: 'linear-gradient(45deg, #ff5a8a, #b83a5a)',
                        }
                      }}
                    >
                      Neues Reading
                    </Button>
                  </Box>

                  {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                      <CircularProgress />
                    </Box>
                  ) : readings.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 6 }}>
                      <MenuBook sx={{ fontSize: 64, color: 'rgba(255,255,255,0.3)', mb: 2 }} />
                      <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.7)', mb: 2 }}>
                        Noch keine Readings vorhanden
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                        Erstelle dein erstes Reading und entdecke dein energetisches Potenzial
                      </Typography>
                    </Box>
                  ) : (
                    <Grid container spacing={3}>
                      {readings.map((reading) => (
                        <Grid item xs={12} md={6} lg={4} key={reading.id}>
                          <Card
                            sx={{
                              background: 'rgba(255,255,255,0.05)',
                              border: '1px solid rgba(255,255,255,0.1)',
                              borderRadius: 3,
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: '0 8px 25px rgba(255, 107, 157, 0.3)',
                              }
                            }}
                          >
                            <CardContent>
                              <Typography variant="h6" sx={{ color: 'white', mb: 1, fontWeight: 600 }}>
                                {reading.title}
                              </Typography>
                              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 2 }}>
                                {reading.question}
                              </Typography>
                              <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                                <Chip
                                  label={
                                    reading.status === 'pending' ? '⏳ Warte auf Termin' :
                                    reading.status === 'zoom-scheduled' ? '📅 Termin vereinbart' :
                                    reading.status === 'completed' ? '✅ Zoom abgeschlossen' :
                                    reading.status === 'approved' ? '🎉 Freigegeben' :
                                    'In Bearbeitung'
                                  }
                                  size="small"
                                  sx={{
                                    background: 
                                      reading.status === 'pending' ? '#eab308' :
                                      reading.status === 'zoom-scheduled' ? '#3b82f6' :
                                      reading.status === 'completed' ? '#8b5cf6' :
                                      reading.status === 'approved' ? '#10b981' :
                                      '#f59e0b',
                                    color: 'white',
                                    fontWeight: 500
                                  }}
                                />
                                {reading.category && (
                                  <Chip
                                    label={reading.category === 'dating' ? '💕 Dating' : 
                                           reading.category === 'business' ? '💼 Business' : 
                                           reading.category === 'personal' ? '✨ Persönlich' : '🌟 Allgemein'}
                                    size="small"
                                    sx={{
                                      background: 'rgba(255, 107, 157, 0.2)',
                                      color: '#ff6b9d',
                                      fontWeight: 500
                                    }}
                                  />
                                )}
                              </Box>
                              {reading.status === 'approved' ? (
                                <Button
                                  variant="contained"
                                  size="small"
                                  onClick={() => {
                                    // Download Reading als PDF
                                    alert('PDF-Download wird implementiert. Reading ist freigegeben!');
                                  }}
                                  sx={{
                                    background: 'linear-gradient(45deg, #10b981, #059669)',
                                    color: 'white',
                                    fontWeight: 600,
                                    '&:hover': {
                                      background: 'linear-gradient(45deg, #059669, #047857)',
                                    }
                                  }}
                                >
                                  📥 PDF herunterladen
                                </Button>
                              ) : (
                                <Button
                                  variant="outlined"
                                  size="small"
                                  onClick={() => {
                                    if (reading.status === 'pending') {
                                      router.push('/resonanzanalyse/next-steps');
                                    } else if (reading.status === 'zoom-scheduled') {
                                      alert('Dein Zoom-Termin ist vereinbart. Du erhältst das PDF nach dem Reading und Coach-Freigabe.');
                                    } else if (reading.status === 'completed') {
                                      alert('Dein Zoom-Reading ist abgeschlossen. Der Coach bereitet gerade dein PDF vor. Du wirst benachrichtigt, sobald es verfügbar ist.');
                                    }
                                  }}
                                  sx={{
                                    borderColor: 'rgba(255,255,255,0.3)',
                                    color: 'white',
                                    '&:hover': {
                                      borderColor: '#ff6b9d',
                                      backgroundColor: 'rgba(255, 107, 157, 0.1)'
                                    }
                                  }}
                                >
                                  {reading.status === 'pending' ? '📋 Status anzeigen' :
                                   reading.status === 'zoom-scheduled' ? '📅 Termin-Info' :
                                   reading.status === 'completed' ? '⏳ In Bearbeitung' :
                                   'Details anzeigen'}
                                </Button>
                              )}
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  )}
                </Box>
              )}

              {activeTab === 1 && (
                <Box>
                  <Typography variant="h5" sx={{ color: 'white', fontWeight: 600, mb: 3 }}>
                    Neues Reading erstellen
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', mb: 4 }}>
                    Erstelle ein neues Reading und erhalte tiefe Einblicke in dein Human Design.
                  </Typography>
                  
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => setNewReadingDialog(true)}
                    sx={{
                      background: 'linear-gradient(45deg, #ff6b9d, #c44569)',
                      py: 2,
                      px: 4,
                      fontSize: '1.1rem',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #ff5a8a, #b83a5a)',
                      }
                    }}
                  >
                    Reading starten
                  </Button>
                </Box>
              )}

              {activeTab === 2 && (
                <Box>
                  <Typography variant="h5" sx={{ color: 'white', fontWeight: 600, mb: 3 }}>
                    Empfohlene Readings
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', mb: 4 }}>
                    Basierend auf deinem Human Design empfehlen wir dir diese Readings:
                  </Typography>
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Card sx={{ 
                        background: 'rgba(255,255,255,0.05)', 
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: 3,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 8px 25px rgba(255, 107, 157, 0.2)',
                        }
                      }}>
                        <CardContent>
                          <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                            💼 Business & Marketing
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 2 }}>
                            Entdecke deinen natürlichen Business-Stil und Marketing-Ansatz basierend auf deinem Human Design.
                          </Typography>
                          <Button 
                            variant="outlined" 
                            size="small"
                            onClick={() => {
                              setSelectedCategory('business');
                              setSelectedDatingType('career');
                              setNewReadingDialog(true);
                            }}
                            sx={{
                              borderColor: 'rgba(255,255,255,0.3)',
                              color: 'white',
                              '&:hover': {
                                borderColor: '#ff6b9d',
                                backgroundColor: 'rgba(255, 107, 157, 0.1)'
                              }
                            }}
                          >
                            Business-Reading
                          </Button>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Card sx={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <CardContent>
                          <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                            👑 Leadership & Management
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 2 }}>
                            Verstehe deine natürlichen Führungsqualitäten und wie du Teams optimal leitest.
                          </Typography>
                          <Button 
                            variant="outlined" 
                            size="small"
                            onClick={() => {
                              setSelectedCategory('leadership');
                              setSelectedDatingType('career');
                              setNewReadingDialog(true);
                            }}
                          >
                            Leadership-Reading
                          </Button>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Card sx={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <CardContent>
                          <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                            ❤️ Beziehungen & Liebe
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 2 }}>
                            Verstehe deine Beziehungsdynamiken und finde dein energetisches Match.
                          </Typography>
                          <Button 
                            variant="outlined" 
                            size="small"
                            onClick={() => {
                              setSelectedCategory('dating');
                              setSelectedDatingType('relationship');
                              setNewReadingDialog(true);
                            }}
                          >
                            Beziehungs-Reading
                          </Button>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Card sx={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <CardContent>
                          <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                            🥰 Erstes Date
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 2 }}>
                            Authentische Dating-Tipps basierend auf deinem Human Design für den perfekten ersten Eindruck.
                          </Typography>
                          <Button 
                            variant="outlined" 
                            size="small"
                            onClick={() => {
                              setSelectedCategory('dating');
                              setSelectedDatingType('first-date');
                              setNewReadingDialog(true);
                            }}
                          >
                            Dating-Tipps
                          </Button>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Card sx={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <CardContent>
                          <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                            💬 Kommunikation
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 2 }}>
                            Lerne, wie du mit deinem energetischen Typ am besten kommunizierst.
                          </Typography>
                          <Button 
                            variant="outlined" 
                            size="small"
                            onClick={() => {
                              setSelectedCategory('communication');
                              setSelectedDatingType('communication');
                              setNewReadingDialog(true);
                            }}
                          >
                            Kommunikations-Reading
                          </Button>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Card sx={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <CardContent>
                          <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                            🌱 Gesundheit & Wohlbefinden
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 2 }}>
                            Entdecke, wie du deine Energie optimal nutzt und dein Wohlbefinden steigerst.
                          </Typography>
                          <Button 
                            variant="outlined" 
                            size="small"
                            onClick={() => {
                              setSelectedCategory('health');
                              setSelectedDatingType('health');
                              setNewReadingDialog(true);
                            }}
                          >
                            Gesundheits-Reading
                          </Button>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                </Box>
              )}

              {activeTab === 3 && (
                <Box>
                  <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <Typography variant="h5" sx={{ color: 'white', fontWeight: 600, mb: 2 }}>
                      🔄 Chartvergleich
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', mb: 3 }}>
                      Vergleiche zwei Human Design Charts und entdecke die energetischen Verbindungen
                    </Typography>
                  </Box>

                  <Grid container spacing={3}>
                    {/* Chart 1 Selection */}
                    <Grid item xs={12} md={6}>
                      <Card sx={{ 
                        background: 'rgba(255,255,255,0.05)', 
                        border: '2px solid rgba(255, 107, 157, 0.3)',
                        borderRadius: 3,
                        p: 3
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                          <PersonAdd sx={{ fontSize: 40, color: '#ff6b9d', mr: 2 }} />
                          <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                            Chart 1 (Du)
                          </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 3 }}>
                          Dein eigenes Chart wird automatisch verwendet
                        </Typography>
                        {(() => {
                          // Lade echte Daten aus localStorage
                          const userData = typeof window !== 'undefined' ? localStorage.getItem('userData') : null;
                          let userChart = {
                            type: 'Noch nicht erstellt',
                            profile: '-',
                            authority: '-',
                            strategy: '-'
                          };
                          
                          if (userData) {
                            try {
                              const parsed = JSON.parse(userData);
                              userChart = {
                                type: parsed.hdType || 'Nicht angegeben',
                                profile: parsed.hdProfile || 'Nicht angegeben',
                                authority: parsed.hdAuthority || 'Nicht angegeben',
                                strategy: parsed.hdStrategy || 'Nicht angegeben'
                              };
                            } catch (e) {
                              console.error('Fehler beim Laden der Chart-Daten:', e);
                            }
                          }
                          
                          return (
                            <Box sx={{
                              p: 3,
                              background: 'rgba(255, 107, 157, 0.1)',
                              borderRadius: 2,
                              border: '1px solid rgba(255, 107, 157, 0.3)'
                            }}>
                              <Typography variant="body2" sx={{ color: 'white', mb: 1 }}>
                                <strong>Typ:</strong> {userChart.type}
                              </Typography>
                              <Typography variant="body2" sx={{ color: 'white', mb: 1 }}>
                                <strong>Profil:</strong> {userChart.profile}
                              </Typography>
                              <Typography variant="body2" sx={{ color: 'white', mb: 1 }}>
                                <strong>Autorität:</strong> {userChart.authority}
                              </Typography>
                              <Typography variant="body2" sx={{ color: 'white', mb: 1 }}>
                                <strong>Strategie:</strong> {userChart.strategy}
                              </Typography>
                              {userChart.type === 'Noch nicht erstellt' && (
                                <Button
                                  variant="outlined"
                                  size="small"
                                  href="/profil-einrichten"
                                  sx={{
                                    mt: 2,
                                    borderColor: '#ff6b9d',
                                    color: '#ff6b9d',
                                    '&:hover': {
                                      borderColor: '#ff5a8a',
                                      background: 'rgba(255,107,157,0.1)'
                                    }
                                  }}
                                >
                                  Jetzt Chart erstellen →
                                </Button>
                              )}
                            </Box>
                          );
                        })()}
                      </Card>
                    </Grid>

                    {/* Chart 2 Selection */}
                    <Grid item xs={12} md={6}>
                      <Card sx={{ 
                        background: 'rgba(255,255,255,0.05)', 
                        border: '2px solid rgba(78, 205, 196, 0.3)',
                        borderRadius: 3,
                        p: 3
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                          <PersonAdd sx={{ fontSize: 40, color: '#4ecdc4', mr: 2 }} />
                          <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                            Chart 2 (Partner)
                          </Typography>
                        </Box>
<TextField
                          fullWidth
                          select
                          label="Wähle ein Chart zum Vergleich"
                          value={selectedChart2}
                          onChange={(e) => setSelectedChart2(e.target.value)}
                          sx={{
                            mb: 2,
                            '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
                            '& .MuiOutlinedInput-root': {
                              color: 'white',
                              '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                              '&:hover fieldset': { borderColor: '#4ecdc4' },
                              '&.Mui-focused fieldset': { borderColor: '#4ecdc4' }
                            }
                          }}
                        >
                          <MenuItem value="">
                            <em>Wähle ein Profil...</em>
                          </MenuItem>
                          {friends.length > 0 ? (
                            friends.map((friend, index) => (
                              <MenuItem key={friend.id} value={`partner${index}`}>
                                {friend.name || `Partner ${index + 1}`} - {friend.hdType || 'Unbekannter Typ'}
                              </MenuItem>
                            ))
                          ) : (
                            <MenuItem value="" disabled>
                              Noch keine Friends gespeichert - Gehe zu /friends um welche hinzuzufügen
                            </MenuItem>
                          )}
                          <MenuItem value="custom">Eigenes Chart eingeben</MenuItem>
                        </TextField>

{(() => {
                          // Zeige ausgewählten Partner an
                          if (!selectedChart2 || selectedChart2 === '') return null;
                          
                          if (selectedChart2 === 'custom') {
                            return (
                              <Box sx={{
                                p: 3,
                                background: 'rgba(78, 205, 196, 0.1)',
                                borderRadius: 2,
                                border: '1px solid rgba(78, 205, 196, 0.3)',
                                textAlign: 'center'
                              }}>
                                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 2 }}>
                                  Eigenes Chart eingeben wird noch implementiert
                                </Typography>
                                <Button
                                  variant="outlined"
                                  size="small"
                                  href="/friends"
                                  sx={{
                                    borderColor: '#4ecdc4',
                                    color: '#4ecdc4',
                                    '&:hover': {
                                      borderColor: '#3dbdb3',
                                      background: 'rgba(78,205,196,0.1)'
                                    }
                                  }}
                                >
                                  Zur Freundesliste →
                                </Button>
                              </Box>
                            );
                          }
                          
                          // Finde den ausgewählten Partner aus dem friends-State
                          const partnerIndex = parseInt(selectedChart2.replace('partner', ''));
                          const partner = friends[partnerIndex];
                          
                          if (!partner) {
                            return (
                              <Box sx={{
                                p: 3,
                                background: 'rgba(78, 205, 196, 0.1)',
                                borderRadius: 2,
                                border: '1px solid rgba(78, 205, 196, 0.3)'
                              }}>
                                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                  Partner nicht gefunden
                                </Typography>
                              </Box>
                            );
                          }
                          
                          return (
                            <Box sx={{
                              p: 3,
                              background: 'rgba(78, 205, 196, 0.1)',
                              borderRadius: 2,
                              border: '1px solid rgba(78, 205, 196, 0.3)'
                            }}>
                              <Typography variant="body2" sx={{ color: 'white', mb: 1 }}>
                                <strong>Typ:</strong> {partner.hdType || 'Nicht angegeben'}
                              </Typography>
                              <Typography variant="body2" sx={{ color: 'white', mb: 1 }}>
                                <strong>Profil:</strong> {partner.hdProfile || 'Nicht angegeben'}
                              </Typography>
                              <Typography variant="body2" sx={{ color: 'white', mb: 1 }}>
                                <strong>Autorität:</strong> {partner.hdAuthority || 'Nicht angegeben'}
                              </Typography>
                              <Typography variant="body2" sx={{ color: 'white' }}>
                                <strong>Strategie:</strong> {partner.hdStrategy || 'Nicht angegeben'}
                              </Typography>
                            </Box>
                          );
                        })()}
                      </Card>
                    </Grid>
                  </Grid>

                  {/* Compare Button */}
                  <Box sx={{ textAlign: 'center', mt: 4 }}>
                    <Button
                      variant="contained"
                      size="large"
                      startIcon={<CompareArrows />}
                      onClick={() => {
                        // Set demo chart data
                        setChart1Data({
                          hdType: 'Generator',
                          profile: '2/4',
                          authority: 'Sakral',
                          strategy: 'Warten und Reagieren',
                          gates: [
                            { id: '1', active: true, name: 'Tor 1' },
                            { id: '8', active: true, name: 'Tor 8' },
                            { id: '13', active: true, name: 'Tor 13' }
                          ],
                          channels: [
                            { id: '1-8', active: true, name: 'Kanal 1-8' }
                          ],
                          centers: [
                            { id: 'sacral', active: true, name: 'Sakral' },
                            { id: 'throat', active: true, name: 'Kehle' }
                          ]
                        });
                        
                        setChart2Data({
                          hdType: selectedChart2 === 'partner1' ? 'Manifestor' : selectedChart2 === 'partner2' ? 'Projektor' : 'Generator',
                          profile: selectedChart2 === 'partner1' ? '1/3' : selectedChart2 === 'partner2' ? '2/5' : '3/5',
                          authority: selectedChart2 === 'partner1' ? 'Emotional' : selectedChart2 === 'partner2' ? 'Milz' : 'Sakral',
                          strategy: selectedChart2 === 'partner1' ? 'Informieren' : selectedChart2 === 'partner2' ? 'Warten auf Einladung' : 'Warten und Reagieren',
                          gates: [
                            { id: '2', active: true, name: 'Tor 2' },
                            { id: '7', active: true, name: 'Tor 7' },
                            { id: '13', active: true, name: 'Tor 13' }
                          ],
                          channels: [
                            { id: '2-14', active: true, name: 'Kanal 2-14' }
                          ],
                          centers: [
                            { id: 'sacral', active: false, name: 'Sakral' },
                            { id: 'throat', active: true, name: 'Kehle' }
                          ]
                        });
                        
                        setShowComparisonModal(true);
                      }}
                      disabled={!selectedChart2}
                      sx={{
                        background: 'linear-gradient(45deg, #ff6b9d, #4ecdc4)',
                        px: 6,
                        py: 2,
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        '&:hover': {
                          background: 'linear-gradient(45deg, #ff5a8a, #3dbdb3)',
                          transform: 'scale(1.05)',
                        },
                        '&:disabled': {
                          background: 'rgba(255,255,255,0.1)',
                          color: 'rgba(255,255,255,0.3)'
                        },
                        transition: 'all 0.3s ease'
                      }}
                    >
                      Charts vergleichen
                    </Button>
                  </Box>

                  {/* Info Box */}
                  <Card sx={{ 
                    mt: 4, 
                    background: 'rgba(78, 205, 196, 0.1)', 
                    border: '1px solid rgba(78, 205, 196, 0.3)',
                    borderRadius: 3
                  }}>
                    <CardContent>
                      <Typography variant="h6" sx={{ color: 'white', mb: 2, fontWeight: 600 }}>
                        💡 Was ist der Connection Code?
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mb: 2 }}>
                        Der Connection Code ist eine tiefgehende Analyse der energetischen Resonanz zwischen zwei Menschen. 
                        Durch den Vergleich der Human Design Charts erkennen wir:
                      </Typography>
                      <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12} sm={6}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Box sx={{ 
                              width: 8, 
                              height: 8, 
                              borderRadius: '50%', 
                              background: '#4ecdc4', 
                              mr: 2 
                            }} />
                            <Typography variant="body2" sx={{ color: 'white' }}>
                              Gemeinsame definierte Zentren
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Box sx={{ 
                              width: 8, 
                              height: 8, 
                              borderRadius: '50%', 
                              background: '#4ecdc4', 
                              mr: 2 
                            }} />
                            <Typography variant="body2" sx={{ color: 'white' }}>
                              Elektromagnetische Verbindungen
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Box sx={{ 
                              width: 8, 
                              height: 8, 
                              borderRadius: '50%', 
                              background: '#4ecdc4', 
                              mr: 2 
                            }} />
                            <Typography variant="body2" sx={{ color: 'white' }}>
                              Kompatibilität der Strategien
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Box sx={{ 
                              width: 8, 
                              height: 8, 
                              borderRadius: '50%', 
                              background: '#4ecdc4', 
                              mr: 2 
                            }} />
                            <Typography variant="body2" sx={{ color: 'white' }}>
                              Potenzielle Herausforderungen
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Box>
              )}
            </Box>
          </Paper>
      </Container>

      {/* New Reading Dialog */}
      <Dialog
        open={newReadingDialog}
        onClose={() => setNewReadingDialog(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            background: 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 3
          }
        }}
      >
        <DialogTitle sx={{ color: 'white', fontWeight: 600 }}>
          Neues Reading erstellen
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 3 }}>
            Bitte fülle alle Felder aus. Diese Informationen werden für dein persönliches Zoom-Reading mit unserem Coach benötigt.
          </Typography>

          <TextField
            autoFocus
            margin="dense"
            label="Titel des Readings *"
            fullWidth
            variant="outlined"
            value={newReadingTitle}
            onChange={(e) => setNewReadingTitle(e.target.value)}
            placeholder="z.B. Mein Human Design für Business"
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                color: 'white',
                '& fieldset': {
                  borderColor: 'rgba(255,255,255,0.3)',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(255,255,255,0.5)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#ff6b9d',
                },
              },
              '& .MuiInputLabel-root': {
                color: 'rgba(255,255,255,0.7)',
                '&.Mui-focused': {
                  color: '#ff6b9d',
                },
              },
            }}
          />
          
          <TextField
            select
            margin="dense"
            label="Kategorie *"
            fullWidth
            variant="outlined"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            sx={{
              mb: 3,
              '& .MuiOutlinedInput-root': {
                color: 'white',
                '& fieldset': {
                  borderColor: 'rgba(255,255,255,0.3)',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(255,255,255,0.5)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#ff6b9d',
                },
              },
              '& .MuiInputLabel-root': {
                color: 'rgba(255,255,255,0.7)',
                '&.Mui-focused': {
                  color: '#ff6b9d',
                },
              },
            }}
          >
            <MenuItem value="dating">💕 Dating & Beziehungen</MenuItem>
            <MenuItem value="business">💼 Business & Karriere</MenuItem>
            <MenuItem value="career">🚀 Karriere & Führung</MenuItem>
            <MenuItem value="leadership">👑 Leadership & Management</MenuItem>
            <MenuItem value="communication">💬 Kommunikation</MenuItem>
            <MenuItem value="health">🌱 Gesundheit & Wohlbefinden</MenuItem>
            <MenuItem value="personal">✨ Persönliche Entwicklung</MenuItem>
            <MenuItem value="general">🌟 Allgemein</MenuItem>
          </TextField>

          {selectedCategory === 'dating' && (
            <TextField
              select
              margin="dense"
              label="Dating-Bereich"
              fullWidth
              variant="outlined"
              value={selectedDatingType}
              onChange={(e) => setSelectedDatingType(e.target.value)}
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': {
                    borderColor: 'rgba(255,255,255,0.3)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255,255,255,0.5)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#8b5cf6',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(255,255,255,0.7)',
                  '&.Mui-focused': {
                    color: '#8b5cf6',
                  },
                },
              }}
            >
              <MenuItem value="first-date">🥰 Erstes Date</MenuItem>
              <MenuItem value="relationship">💑 Beziehung</MenuItem>
              <MenuItem value="communication">💬 Kommunikation</MenuItem>
              <MenuItem value="intimacy">🔥 Intimität</MenuItem>
            </TextField>
          )}

          {selectedCategory === 'business' && (
            <TextField
              select
              margin="dense"
              label="Business-Bereich"
              fullWidth
              variant="outlined"
              value={selectedDatingType}
              onChange={(e) => setSelectedDatingType(e.target.value)}
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': {
                    borderColor: 'rgba(255,255,255,0.3)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255,255,255,0.5)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#8b5cf6',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(255,255,255,0.7)',
                  '&.Mui-focused': {
                    color: '#8b5cf6',
                  },
                },
              }}
            >
              <MenuItem value="career">🚀 Karriere & Entwicklung</MenuItem>
              <MenuItem value="marketing">📈 Marketing & Verkauf</MenuItem>
              <MenuItem value="entrepreneurship">💡 Unternehmertum</MenuItem>
              <MenuItem value="teamwork">👥 Teamarbeit</MenuItem>
            </TextField>
          )}

          {selectedCategory === 'career' && (
            <TextField
              select
              margin="dense"
              label="Karriere-Bereich"
              fullWidth
              variant="outlined"
              value={selectedDatingType}
              onChange={(e) => setSelectedDatingType(e.target.value)}
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': {
                    borderColor: 'rgba(255,255,255,0.3)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255,255,255,0.5)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#8b5cf6',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(255,255,255,0.7)',
                  '&.Mui-focused': {
                    color: '#8b5cf6',
                  },
                },
              }}
            >
              <MenuItem value="career">🚀 Karriereplanung</MenuItem>
              <MenuItem value="job-search">🔍 Jobsuche</MenuItem>
              <MenuItem value="skills">🎯 Fähigkeiten entwickeln</MenuItem>
              <MenuItem value="networking">🤝 Networking</MenuItem>
            </TextField>
          )}

          {selectedCategory === 'leadership' && (
            <TextField
              select
              margin="dense"
              label="Leadership-Bereich"
              fullWidth
              variant="outlined"
              value={selectedDatingType}
              onChange={(e) => setSelectedDatingType(e.target.value)}
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': {
                    borderColor: 'rgba(255,255,255,0.3)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255,255,255,0.5)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#8b5cf6',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(255,255,255,0.7)',
                  '&.Mui-focused': {
                    color: '#8b5cf6',
                  },
                },
              }}
            >
              <MenuItem value="leadership">👑 Führungsstil</MenuItem>
              <MenuItem value="team-management">👥 Team-Management</MenuItem>
              <MenuItem value="decision-making">🎯 Entscheidungsfindung</MenuItem>
              <MenuItem value="communication">💬 Führungskommunikation</MenuItem>
            </TextField>
          )}

          <TextField
            margin="dense"
            label="Deine Frage oder dein Anliegen *"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={newReadingQuestion}
            onChange={(e) => setNewReadingQuestion(e.target.value)}
            placeholder={selectedCategory === 'dating' ? 
              "z.B. Wie kann ich beim ersten Date authentisch sein?" : 
              "Beschreibe dein Anliegen oder deine Frage..."
            }
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                color: 'white',
                '& fieldset': {
                  borderColor: 'rgba(255,255,255,0.3)',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(255,255,255,0.5)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#ff6b9d',
                },
              },
              '& .MuiInputLabel-root': {
                color: 'rgba(255,255,255,0.7)',
                '&.Mui-focused': {
                  color: '#ff6b9d',
                },
              },
            }}
          />

          <Typography variant="subtitle1" sx={{ color: '#ff6b9d', fontWeight: 600, mt: 3, mb: 2 }}>
            📅 Geburtsdaten für dein Human Design Chart
          </Typography>

          <TextField
            margin="dense"
            label="Geburtsdatum *"
            fullWidth
            type="date"
            variant="outlined"
            value={newReadingBirthdate}
            onChange={(e) => setNewReadingBirthdate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                color: 'white',
                '& fieldset': {
                  borderColor: 'rgba(255,255,255,0.3)',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(255,255,255,0.5)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#ff6b9d',
                },
              },
              '& .MuiInputLabel-root': {
                color: 'rgba(255,255,255,0.7)',
                '&.Mui-focused': {
                  color: '#ff6b9d',
                },
              },
            }}
          />

          <TextField
            margin="dense"
            label="Geburtszeit *"
            fullWidth
            type="time"
            variant="outlined"
            value={newReadingBirthtime}
            onChange={(e) => setNewReadingBirthtime(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            helperText="Die genaue Uhrzeit ist wichtig für dein Chart"
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                color: 'white',
                '& fieldset': {
                  borderColor: 'rgba(255,255,255,0.3)',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(255,255,255,0.5)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#ff6b9d',
                },
              },
              '& .MuiInputLabel-root': {
                color: 'rgba(255,255,255,0.7)',
                '&.Mui-focused': {
                  color: '#ff6b9d',
                },
              },
              '& .MuiFormHelperText-root': {
                color: 'rgba(255,255,255,0.5)',
              },
            }}
          />

          <TextField
            margin="dense"
            label="Geburtsort (Stadt, Land) *"
            fullWidth
            variant="outlined"
            value={newReadingBirthplace}
            onChange={(e) => setNewReadingBirthplace(e.target.value)}
            placeholder="z.B. München, Deutschland"
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                color: 'white',
                '& fieldset': {
                  borderColor: 'rgba(255,255,255,0.3)',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(255,255,255,0.5)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#ff6b9d',
                },
              },
              '& .MuiInputLabel-root': {
                color: 'rgba(255,255,255,0.7)',
                '&.Mui-focused': {
                  color: '#ff6b9d',
                },
              },
            }}
          />

          <Typography variant="subtitle1" sx={{ color: '#ff6b9d', fontWeight: 600, mt: 3, mb: 2 }}>
            📞 Kontaktdaten für Zoom-Reading
          </Typography>

          <TextField
            margin="dense"
            label="E-Mail-Adresse *"
            fullWidth
            type="email"
            variant="outlined"
            value={newReadingEmail}
            onChange={(e) => setNewReadingEmail(e.target.value)}
            placeholder="deine@email.de"
            helperText="Wir senden dir den Zoom-Link an diese E-Mail"
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                color: 'white',
                '& fieldset': {
                  borderColor: 'rgba(255,255,255,0.3)',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(255,255,255,0.5)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#ff6b9d',
                },
              },
              '& .MuiInputLabel-root': {
                color: 'rgba(255,255,255,0.7)',
                '&.Mui-focused': {
                  color: '#ff6b9d',
                },
              },
              '& .MuiFormHelperText-root': {
                color: 'rgba(255,255,255,0.5)',
              },
            }}
          />

          <TextField
            margin="dense"
            label="Telefonnummer (optional)"
            fullWidth
            type="tel"
            variant="outlined"
            value={newReadingPhone}
            onChange={(e) => setNewReadingPhone(e.target.value)}
            placeholder="+49 123 456789"
            helperText="Für Rückfragen oder falls du per Telefon erreicht werden möchtest"
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                color: 'white',
                '& fieldset': {
                  borderColor: 'rgba(255,255,255,0.3)',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(255,255,255,0.5)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#ff6b9d',
                },
              },
              '& .MuiInputLabel-root': {
                color: 'rgba(255,255,255,0.7)',
                '&.Mui-focused': {
                  color: '#ff6b9d',
                },
              },
              '& .MuiFormHelperText-root': {
                color: 'rgba(255,255,255,0.5)',
              },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => setNewReadingDialog(false)}
            sx={{ color: 'rgba(255,255,255,0.7)' }}
          >
            Abbrechen
          </Button>
          <Button
            onClick={createNewReading}
            variant="contained"
            sx={{
              background: 'linear-gradient(45deg, #ff6b9d, #c44569)',
              fontWeight: 600,
              px: 3,
              '&:hover': {
                background: 'linear-gradient(45deg, #ff5a8a, #b83a5a)',
              }
            }}
          >
            Anfrage abschicken →
          </Button>
        </DialogActions>
      </Dialog>

      {/* Chart Comparison Modal */}
      {showComparisonModal && chart1Data && chart2Data && (
        <ChartComparisonModal
          open={showComparisonModal}
          onClose={() => setShowComparisonModal(false)}
          chart1Data={chart1Data}
          chart2Data={chart2Data}
        />
      )}
    </Box>
    </AccessControl>
  );
}

export default ReadingPage;
