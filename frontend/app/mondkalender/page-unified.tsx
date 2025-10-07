"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useRouter, usePathname } from 'next/navigation';
import { MoonTracking } from '@/types/common.types';
import { safeJsonParse } from '@/lib/supabase/client';
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
  Flower2,
  Moon
} from 'lucide-react';
import AccessControl from '../../components/AccessControl';
// import { UserSubscription } from '../../lib/subscription/types'; // Entfernt - nicht mehr benötigt
import UnifiedPageLayout from '@/components/UnifiedPageLayout';

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
  exercise: {
    recommended: string[];
    intensity: string;
    timing: string;
  };
  sleep: {
    recommended_hours: number;
    best_sleep_time: string;
    tips: string[];
  };
  wellness: {
    practices: string[];
    self_care: string[];
    mindfulness: string[];
  };
}

const moonPhases: MoonPhase[] = [
  {
    name: "Neumond",
    description: "Zeit für Neuanfänge und Intentionen",
    icon: "🌑",
    energy: "Niedrig",
    color: "#1a1a2e",
    advice: "Setze neue Ziele und träume groß",
    explanation: "Der Neumond ist die perfekte Zeit, um neue Projekte zu starten und sich auf das zu konzentrieren, was du wirklich willst.",
    reflectionExercises: [
      "Was möchte ich in den nächsten 28 Tagen erreichen?",
      "Welche Gewohnheiten möchte ich etablieren?",
      "Was kann ich loslassen, um Platz für Neues zu schaffen?"
    ],
    moonRituals: [
      "Intentionen aufschreiben",
      "Meditation zur Klarheit",
      "Räuchern mit Salbei"
    ],
    humanDesignConnection: "Perfekt für Manifestoren und Generatoren, um neue Projekte zu starten"
  },
  {
    name: "Zunehmender Sichelmond",
    description: "Zeit für Wachstum und Entwicklung",
    icon: "🌒",
    energy: "Steigend",
    color: "#2d3748",
    advice: "Nimm deine Träume in die Hand",
    explanation: "Die Energie des Mondes wächst und unterstützt dich dabei, deine Ziele zu verfolgen.",
    reflectionExercises: [
      "Welche Schritte kann ich heute für meine Ziele unternehmen?",
      "Was motiviert mich am meisten?",
      "Wie kann ich meine Energie optimal nutzen?"
    ],
    moonRituals: [
      "Vision Board erstellen",
      "Tägliche Affirmationen",
      "Kräuter pflanzen"
    ],
    humanDesignConnection: "Ideal für Generatoren, um ihre Energie zu kanalisieren"
  },
  {
    name: "Erstes Viertel",
    description: "Zeit für Entscheidungen und Aktionen",
    icon: "🌓",
    energy: "Hoch",
    color: "#4a5568",
    advice: "Handle entschlossen und vertraue deiner Intuition",
    explanation: "Die Mondenergie erreicht ihren ersten Höhepunkt und gibt dir die Kraft, wichtige Entscheidungen zu treffen.",
    reflectionExercises: [
      "Welche Entscheidung habe ich aufgeschoben?",
      "Was sagt mir mein Bauchgefühl?",
      "Welche Risiken bin ich bereit einzugehen?"
    ],
    moonRituals: [
      "Entscheidungsritual",
      "Kraftstein-Meditation",
      "Bewegung in der Natur"
    ],
    humanDesignConnection: "Starke Zeit für Projektoren, um ihre Weisheit zu teilen"
  },
  {
    name: "Zunehmender Gibbous",
    description: "Zeit für Verfeinerung und Anpassung",
    icon: "🌔",
    energy: "Sehr hoch",
    color: "#718096",
    advice: "Verfeinere deine Pläne und passe sie an",
    explanation: "Die Mondenergie ist fast auf ihrem Höhepunkt. Nutze diese Zeit, um deine Pläne zu verfeinern.",
    reflectionExercises: [
      "Was funktioniert gut in meinem Plan?",
      "Was muss ich anpassen?",
      "Wie kann ich meine Effizienz steigern?"
    ],
    moonRituals: [
      "Planungsritual",
      "Kreative Aktivitäten",
      "Soziale Verbindungen stärken"
    ],
    humanDesignConnection: "Perfekt für Reflektoren, um Feedback zu sammeln"
  },
  {
    name: "Vollmond",
    description: "Zeit für Vollendung und Feiern",
    icon: "🌕",
    energy: "Maximum",
    color: "#f7fafc",
    advice: "Feiere deine Erfolge und lass los, was nicht mehr dient",
    explanation: "Der Vollmond bringt Klarheit und Vollendung. Es ist Zeit, zu feiern und loszulassen.",
    reflectionExercises: [
      "Was habe ich erreicht?",
      "Was kann ich jetzt loslassen?",
      "Wofür bin ich dankbar?"
    ],
    moonRituals: [
      "Vollmond-Zeremonie",
      "Dankbarkeitsritual",
      "Loslassungsritual"
    ],
    humanDesignConnection: "Machtvolle Zeit für alle Typen, besonders Reflektoren"
  },
  {
    name: "Abnehmender Gibbous",
    description: "Zeit für Dankbarkeit und Weitergabe",
    icon: "🌖",
    energy: "Hoch",
    color: "#a0aec0",
    advice: "Teile deine Weisheit und sei dankbar",
    explanation: "Die Mondenergie beginnt abzunehmen. Nutze diese Zeit, um deine Erfahrungen zu teilen.",
    reflectionExercises: [
      "Was habe ich gelernt?",
      "Wie kann ich anderen helfen?",
      "Wofür bin ich dankbar?"
    ],
    moonRituals: [
      "Dankbarkeits-Journal",
      "Weisheit teilen",
      "Gemeinschaftsrituale"
    ],
    humanDesignConnection: "Ideal für Projektoren, um ihre Weisheit zu teilen"
  },
  {
    name: "Letztes Viertel",
    description: "Zeit für Reflexion und Vergebung",
    icon: "🌗",
    energy: "Mittel",
    color: "#718096",
    advice: "Reflektiere und verzeihe dir selbst",
    explanation: "Die Mondenergie nimmt weiter ab. Es ist Zeit für tiefe Reflexion und Vergebung.",
    reflectionExercises: [
      "Was möchte ich vergeben?",
      "Welche Lektionen habe ich gelernt?",
      "Wie kann ich mich selbst lieben?"
    ],
    moonRituals: [
      "Vergebungsritual",
      "Selbstliebe-Praxis",
      "Heilungsmeditation"
    ],
    humanDesignConnection: "Heilende Zeit für alle Typen"
  },
  {
    name: "Abnehmender Sichelmond",
    description: "Zeit für Ruhe und Regeneration",
    icon: "🌘",
    energy: "Niedrig",
    color: "#2d3748",
    advice: "Ruhe dich aus und bereite dich auf den Neuanfang vor",
    explanation: "Die Mondenergie ist am niedrigsten. Nutze diese Zeit für Ruhe und Regeneration.",
    reflectionExercises: [
      "Was brauche ich für meine Regeneration?",
      "Wie kann ich mich besser um mich kümmern?",
      "Was möchte ich im nächsten Zyklus anders machen?"
    ],
    moonRituals: [
      "Ruhe-Ritual",
      "Selbstfürsorge",
      "Vorbereitung auf den Neumond"
    ],
    humanDesignConnection: "Wichtige Ruhezeit für alle Typen"
  }
];

export default function MondkalenderPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState(0);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [userSubscription, setUserSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [moonTracking, setMoonTracking] = useState<MoonTracking[]>([]);
  const [trackingStats, setTrackingStats] = useState<TrackingStats>({
    totalEntries: 0,
    averageMood: 0,
    averageEnergy: 0,
    averageSleep: 0,
    mostFrequentPhase: '',
    streakDays: 0
  });

  // Current moon phase calculation
  const getCurrentMoonPhase = useCallback(() => {
    const now = new Date();
    const knownNewMoon = new Date('2024-01-11T11:57:00Z'); // Known new moon
    const lunarCycle = 29.53059; // Average lunar cycle in days
    const daysSinceNewMoon = (now.getTime() - knownNewMoon.getTime()) / (1000 * 60 * 60 * 24);
    const cyclePosition = (daysSinceNewMoon % lunarCycle) / lunarCycle;
    
    if (cyclePosition < 0.125) return moonPhases[0]; // Neumond
    if (cyclePosition < 0.25) return moonPhases[1]; // Zunehmender Sichelmond
    if (cyclePosition < 0.375) return moonPhases[2]; // Erstes Viertel
    if (cyclePosition < 0.5) return moonPhases[3]; // Zunehmender Gibbous
    if (cyclePosition < 0.625) return moonPhases[4]; // Vollmond
    if (cyclePosition < 0.75) return moonPhases[5]; // Abnehmender Gibbous
    if (cyclePosition < 0.875) return moonPhases[6]; // Letztes Viertel
    return moonPhases[7]; // Abnehmender Sichelmond
  }, []);

  const currentMoonPhase = getCurrentMoonPhase();

  // Load user subscription
  useEffect(() => {
    const loadSubscription = async () => {
      try {
        const subscriptionData = localStorage.getItem('userSubscription');
        if (subscriptionData) {
          const subscription = JSON.parse(subscriptionData);
          setUserSubscription(subscription);
        }
      } catch (error) {
        console.error('Error loading subscription:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSubscription();
  }, []);

  // Load moon tracking data
  useEffect(() => {
    const loadMoonTracking = async () => {
      try {
        const trackingData = localStorage.getItem('moonTracking');
        if (trackingData) {
          const tracking = JSON.parse(trackingData);
          setMoonTracking(tracking);
          
          // Calculate stats
          if (tracking.length > 0) {
            const totalEntries = tracking.length;
            const averageMood = tracking.reduce((sum, entry) => sum + (entry.mood || 0), 0) / totalEntries;
            const averageEnergy = tracking.reduce((sum, entry) => sum + (entry.energy || 0), 0) / totalEntries;
            const averageSleep = tracking.reduce((sum, entry) => sum + (entry.sleep_hours || 0), 0) / totalEntries;
            
            // Find most frequent phase
            const phaseCounts: { [key: string]: number } = {};
            tracking.forEach(entry => {
              if (entry.moon_phase) {
                phaseCounts[entry.moon_phase] = (phaseCounts[entry.moon_phase] || 0) + 1;
              }
            });
            const mostFrequentPhase = Object.keys(phaseCounts).reduce((a, b) => 
              phaseCounts[a] > phaseCounts[b] ? a : b, '');
            
            setTrackingStats({
              totalEntries,
              averageMood,
              averageEnergy,
              averageSleep,
              mostFrequentPhase,
              streakDays: 0 // Calculate streak logic here
            });
          }
        }
      } catch (error) {
        console.error('Error loading moon tracking:', error);
      }
    };

    loadMoonTracking();
  }, []);

  const handleAddEntry = () => {
    router.push('/mondkalender/tracking');
  };

  return (
    <AccessControl 
      path={pathname} 
      userSubscription={userSubscription}
      onUpgrade={() => router.push('/pricing')}
    >
      <UnifiedPageLayout
        title="🌙 Mondkalender"
        subtitle="Verfolge die Mondzyklen und entdecke, wie sie dein Leben beeinflussen. Verbinde dich mit der kosmischen Energie."
        showStars={true}
      >
        {/* Current Moon Phase */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card sx={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 4,
            mb: 4,
            overflow: 'hidden'
          }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Box sx={{
                  fontSize: '4rem',
                  mr: 3,
                  animation: 'moonPulse 3s ease-in-out infinite'
                }}>
                  {currentMoonPhase.icon}
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h4" sx={{ 
                    color: 'white', 
                    fontWeight: 700, 
                    mb: 1,
                    background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}>
                    {currentMoonPhase.name}
                  </Typography>
                  <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.8)', mb: 2 }}>
                    {currentMoonPhase.description}
                  </Typography>
                  <Chip 
                    label={`Energie: ${currentMoonPhase.energy}`}
                    sx={{
                      background: 'linear-gradient(45deg, #4ecdc4, #44a08d)',
                      color: 'white',
                      fontWeight: 600
                    }}
                  />
                </Box>
              </Box>
              
              <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)', mb: 3, lineHeight: 1.6 }}>
                {currentMoonPhase.explanation}
              </Typography>
              
              <Typography variant="h6" sx={{ color: '#FFD700', mb: 2, fontWeight: 600 }}>
                💡 Empfehlung für heute:
              </Typography>
              <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', mb: 3 }}>
                {currentMoonPhase.advice}
              </Typography>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tracking Stats */}
        {trackingStats.totalEntries > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card sx={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 4,
              mb: 4
            }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" sx={{ color: '#FFD700', mb: 3, fontWeight: 700 }}>
                  📊 Deine Mond-Tracking Statistiken
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" sx={{ color: '#4ecdc4', fontWeight: 700, mb: 1 }}>
                        {trackingStats.totalEntries}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                        Einträge
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" sx={{ color: '#ff6b9d', fontWeight: 700, mb: 1 }}>
                        {trackingStats.averageMood.toFixed(1)}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                        Durchschn. Stimmung
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" sx={{ color: '#c44569', fontWeight: 700, mb: 1 }}>
                        {trackingStats.averageEnergy.toFixed(1)}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                        Durchschn. Energie
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" sx={{ color: '#FFD700', fontWeight: 700, mb: 1 }}>
                        {trackingStats.averageSleep.toFixed(1)}h
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                        Durchschn. Schlaf
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Moon Phases Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card sx={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 4,
            mb: 4
          }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" sx={{ color: '#FFD700', mb: 3, fontWeight: 700 }}>
                🌙 Mondphasen-Übersicht
              </Typography>
              <Grid container spacing={2}>
                {moonPhases.map((phase, index) => (
                  <Grid item xs={12} sm={6} md={3} key={phase.name}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Card sx={{
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: 3,
                        p: 2,
                        height: '100%',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 8px 25px rgba(0,0,0,0.3)'
                        },
                        transition: 'all 0.3s ease'
                      }}>
                        <Box sx={{ textAlign: 'center', mb: 2 }}>
                          <Typography variant="h3" sx={{ mb: 1 }}>
                            {phase.icon}
                          </Typography>
                          <Typography variant="h6" sx={{ color: 'white', fontWeight: 600, mb: 1 }}>
                            {phase.name}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 2 }}>
                            {phase.description}
                          </Typography>
                          <Chip 
                            label={phase.energy}
                            size="small"
                            sx={{
                              background: 'linear-gradient(45deg, #4ecdc4, #44a08d)',
                              color: 'white',
                              fontWeight: 600
                            }}
                          />
                        </Box>
                      </Card>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<Plus size={24} />}
                onClick={handleAddEntry}
                sx={{
                  background: 'linear-gradient(45deg, #4ecdc4, #44a08d)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #44a08d, #4ecdc4)'
                  },
                  borderRadius: 3,
                  py: 2,
                  fontSize: '1.1rem',
                  fontWeight: 700
                }}
              >
                Eintrag hinzufügen
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Calendar size={24} />}
                onClick={() => setActiveTab(1)}
                sx={{
                  color: 'rgba(255,255,255,0.8)',
                  borderColor: 'rgba(255,255,255,0.3)',
                  '&:hover': {
                    borderColor: '#ff6b9d',
                    backgroundColor: 'rgba(255, 107, 157, 0.1)'
                  },
                  borderRadius: 3,
                  py: 2,
                  fontSize: '1.1rem',
                  fontWeight: 600
                }}
              >
                Kalender anzeigen
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<BookOpen size={24} />}
                onClick={() => router.push('/mondkalender-info')}
                sx={{
                  color: 'rgba(255,255,255,0.8)',
                  borderColor: 'rgba(255,255,255,0.3)',
                  '&:hover': {
                    borderColor: '#FFD700',
                    backgroundColor: 'rgba(255, 215, 0, 0.1)'
                  },
                  borderRadius: 3,
                  py: 2,
                  fontSize: '1.1rem',
                  fontWeight: 600
                }}
              >
                Mehr erfahren
              </Button>
            </Grid>
          </Grid>
        </motion.div>

        {/* Moon Rituals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card sx={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 4
          }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" sx={{ color: '#FFD700', mb: 3, fontWeight: 700 }}>
                🕯️ Rituale für {currentMoonPhase.name}
              </Typography>
              <Grid container spacing={2}>
                {currentMoonPhase.moonRituals.map((ritual, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Box sx={{
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: 3,
                        p: 3,
                        display: 'flex',
                        alignItems: 'center'
                      }}>
                        <Box sx={{
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          background: 'linear-gradient(45deg, #ff6b9d, #c44569)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mr: 2
                        }}>
                          <Flower2 size={20} color="white" />
                        </Box>
                        <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                          {ritual}
                        </Typography>
                      </Box>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </motion.div>
      </UnifiedPageLayout>
    </AccessControl>
  );
}
