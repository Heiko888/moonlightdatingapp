"use client";
import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Card, 
  CardContent, 
  Box, 
  Button, 
  Grid, 
  Stepper, 
  Step, 
  StepLabel, 
  StepContent,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Alert,
  IconButton,
  Collapse
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  Heart, 
  Eye, 
  Crown, 
  Sparkles, 
  Target, 
  Users, 
  Clock, 
  CheckCircle, 
  Play, 
  Pause, 
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  BookOpen,
  Timer,
  Award
} from 'lucide-react';
import AnimatedStars from '@/components/AnimatedStars';

interface ConsciousnessLevel {
  id: number;
  title: string;
  description: string;
  color: string;
  icon: React.ReactNode;
  duration: string;
  difficulty: 'Anfänger' | 'Fortgeschritten' | 'Experte';
  exercises: {
    id: string;
    title: string;
    description: string;
    instructions: string[];
    duration: string;
    benefits: string[];
    tips: string[];
  }[];
  benefits: string[];
  challenges: string[];
}

export default function ConsciousnessExercisesPage() {
  const [activeLevel, setActiveLevel] = useState(0);
  const [activeExercise, setActiveExercise] = useState<string | null>(null);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [completedExercises, setCompletedExercises] = useState<Set<string>>(new Set());
  const [expandedLevel, setExpandedLevel] = useState<number | null>(null);

  const consciousnessLevels: ConsciousnessLevel[] = [
    {
      id: 1,
      title: "Körperliches Bewusstsein",
      description: "Die Grundlage: Verbindung mit dem physischen Körper",
      color: "#FF6B6B",
      icon: <Target size={24} />,
      duration: "2-4 Wochen",
      difficulty: 'Anfänger',
      benefits: [
        "Verbesserte Körperwahrnehmung",
        "Reduzierte körperliche Anspannung",
        "Bessere Stressresistenz",
        "Grundlage für alle weiteren Stufen"
      ],
      challenges: [
        "Geduld beim Erlernen der Körperwahrnehmung",
        "Regelmäßige Übung erforderlich",
        "Anfängliche Unbehaglichkeit möglich"
      ],
      exercises: [
        {
          id: "body-scan",
          title: "Körper-Scan Meditation",
          description: "Systematische Wahrnehmung aller Körperteile",
          duration: "15-30 Minuten",
          instructions: [
            "Lege oder setze dich bequem hin",
            "Schließe die Augen und atme tief ein",
            "Beginne bei den Zehen und arbeite dich langsam nach oben",
            "Spüre jeden Körperteil bewusst",
            "Nimm Spannungen wahr, ohne sie zu bewerten",
            "Atme in jeden Bereich hinein",
            "Beende mit einem tiefen Atemzug"
          ],
          benefits: [
            "Tiefe Entspannung",
            "Bessere Körperwahrnehmung",
            "Stressabbau",
            "Verbesserte Schlafqualität"
          ],
          tips: [
            "Übe täglich zur gleichen Zeit",
            "Beginne mit 10 Minuten und steigere langsam",
            "Verwende eine geführte Meditation als Einstieg"
          ]
        },
        {
          id: "breathing-awareness",
          title: "Atem-Bewusstsein",
          description: "Bewusste Atmung als Anker für das gegenwärtige Moment",
          duration: "10-20 Minuten",
          instructions: [
            "Setze dich aufrecht hin",
            "Platziere eine Hand auf dem Bauch",
            "Atme langsam durch die Nase ein",
            "Spüre, wie sich der Bauch hebt",
            "Halte den Atem kurz an",
            "Atme langsam durch den Mund aus",
            "Wiederhole 10-20 Mal"
          ],
          benefits: [
            "Sofortige Beruhigung",
            "Verbesserte Konzentration",
            "Reduzierte Angst",
            "Bessere Sauerstoffversorgung"
          ],
          tips: [
            "Zähle beim Einatmen bis 4, beim Ausatmen bis 6",
            "Übe bei Stress oder vor wichtigen Entscheidungen",
            "Kombiniere mit sanfter Musik"
          ]
        }
      ]
    },
    {
      id: 2,
      title: "Emotionales Bewusstsein",
      description: "Gefühle erkennen, akzeptieren und transformieren",
      color: "#4ECDC4",
      icon: <Heart size={24} />,
      duration: "3-6 Wochen",
      difficulty: 'Anfänger',
      benefits: [
        "Bessere Emotionsregulation",
        "Reduzierte emotionale Reaktivität",
        "Tiefere Selbstakzeptanz",
        "Verbesserte Beziehungen"
      ],
      challenges: [
        "Konfrontation mit unangenehmen Gefühlen",
        "Geduld beim Erlernen der Emotionsregulation",
        "Konsistente Übung erforderlich"
      ],
      exercises: [
        {
          id: "emotion-journaling",
          title: "Emotions-Tagebuch",
          description: "Tägliche Reflexion über Gefühle und deren Auslöser",
          duration: "15-20 Minuten täglich",
          instructions: [
            "Führe ein Tagebuch mit dir",
            "Notiere 3x täglich deine Gefühle",
            "Beschreibe die Situation, die das Gefühl ausgelöst hat",
            "Identifiziere körperliche Empfindungen",
            "Frage dich: Was brauche ich gerade?",
            "Reflektiere am Abend über die Muster"
          ],
          benefits: [
            "Bessere Selbsterkenntnis",
            "Frühe Erkennung von Mustern",
            "Emotionale Intelligenz",
            "Proaktive Emotionsregulation"
          ],
          tips: [
            "Verwende Farben für verschiedene Emotionen",
            "Sei ehrlich und urteile nicht",
            "Teile Erkenntnisse mit vertrauten Personen"
          ]
        },
        {
          id: "emotion-acceptance",
          title: "Gefühls-Akzeptanz Übung",
          description: "Gefühle ohne Widerstand erleben und loslassen",
          duration: "20-30 Minuten",
          instructions: [
            "Setze dich in eine ruhige Umgebung",
            "Identifiziere ein aktuelles Gefühl",
            "Nimm es ohne Bewertung wahr",
            "Frage dich: Wo spüre ich es im Körper?",
            "Atme in das Gefühl hinein",
            "Lass es da sein, ohne es zu ändern",
            "Beobachte, wie es sich verändert"
          ],
          benefits: [
            "Reduzierte emotionale Intensität",
            "Bessere Toleranz für Unbehagen",
            "Emotionale Flexibilität",
            "Tiefere Selbstakzeptanz"
          ],
          tips: [
            "Beginne mit leichten Gefühlen",
            "Übe regelmäßig, nicht nur bei starken Emotionen",
            "Verwende positive Selbstgespräche"
          ]
        }
      ]
    },
    {
      id: 3,
      title: "Mentales Bewusstsein",
      description: "Gedanken beobachten und mentale Muster erkennen",
      color: "#45B7D1",
      icon: <Brain size={24} />,
      duration: "4-8 Wochen",
      difficulty: 'Fortgeschritten',
      benefits: [
        "Bessere Gedankenkontrolle",
        "Reduzierte mentale Unruhe",
        "Verbesserte Konzentration",
        "Klarere Entscheidungsfindung"
      ],
      challenges: [
        "Geduld beim Erlernen der Gedankenbeobachtung",
        "Konfrontation mit negativen Gedankenmustern",
        "Konsistente Achtsamkeitspraxis"
      ],
      exercises: [
        {
          id: "mindfulness-meditation",
          title: "Achtsamkeits-Meditation",
          description: "Gedanken ohne Bewertung beobachten",
          duration: "20-45 Minuten",
          instructions: [
            "Setze dich in eine bequeme Position",
            "Schließe die Augen und atme natürlich",
            "Beobachte deine Gedanken wie Wolken am Himmel",
            "Lass Gedanken kommen und gehen",
            "Kehre sanft zur Atmung zurück, wenn du abgelenkt wirst",
            "Urteile nicht über deine Gedanken",
            "Beende mit einem tiefen Atemzug"
          ],
          benefits: [
            "Reduzierte mentale Unruhe",
            "Bessere Konzentration",
            "Emotionale Stabilität",
            "Klarere Gedanken"
          ],
          tips: [
            "Beginne mit 10 Minuten und steigere langsam",
            "Verwende eine Timer-App",
            "Übe täglich zur gleichen Zeit"
          ]
        },
        {
          id: "thought-labeling",
          title: "Gedanken-Etikettierung",
          description: "Gedanken kategorisieren und Muster erkennen",
          duration: "15-30 Minuten",
          instructions: [
            "Führe ein Gedanken-Tagebuch",
            "Notiere alle Gedanken für 10 Minuten",
            "Kategorisiere sie: Sorgen, Pläne, Erinnerungen, etc.",
            "Identifiziere wiederkehrende Muster",
            "Frage dich: Sind diese Gedanken hilfreich?",
            "Reflektiere über die Häufigkeit verschiedener Gedankentypen"
          ],
          benefits: [
            "Bessere Selbsterkenntnis",
            "Frühe Erkennung von Sorgenmustern",
            "Mentale Klarheit",
            "Reduzierte Gedankenspiralen"
          ],
          tips: [
            "Verwende Farben für verschiedene Kategorien",
            "Übe mehrmals täglich",
            "Sei geduldig mit dir selbst"
          ]
        }
      ]
    },
    {
      id: 4,
      title: "Spirituelles Bewusstsein",
      description: "Verbindung mit dem höheren Selbst und universeller Weisheit",
      color: "#96CEB4",
      icon: <Sparkles size={24} />,
      duration: "6-12 Wochen",
      difficulty: 'Fortgeschritten',
      benefits: [
        "Tiefere spirituelle Verbindung",
        "Gefühl von Sinn und Zweck",
        "Innere Ruhe und Gelassenheit",
        "Erweiterte Perspektive auf das Leben"
      ],
      challenges: [
        "Offenheit für spirituelle Erfahrungen",
        "Geduld bei der spirituellen Entwicklung",
        "Integration in den Alltag"
      ],
      exercises: [
        {
          id: "spiritual-connection",
          title: "Spirituelle Verbindung",
          description: "Verbindung mit dem höheren Selbst herstellen",
          duration: "30-60 Minuten",
          instructions: [
            "Schaffe einen heiligen Raum",
            "Zünde Kerzen oder Räucherstäbchen an",
            "Setze eine spirituelle Absicht",
            "Meditiere über deine Verbindung zum Universum",
            "Stelle Fragen an dein höheres Selbst",
            "Lausche auf innere Antworten",
            "Danke für die Verbindung"
          ],
          benefits: [
            "Tiefere spirituelle Verbindung",
            "Gefühl von Sinn und Zweck",
            "Innere Führung",
            "Spirituelle Klarheit"
          ],
          tips: [
            "Verwende spirituelle Symbole",
            "Führe ein spirituelles Tagebuch",
            "Übe in der Natur"
          ]
        },
        {
          id: "gratitude-practice",
          title: "Dankbarkeits-Praxis",
          description: "Tägliche Dankbarkeit für spirituelles Wachstum",
          duration: "10-20 Minuten täglich",
          instructions: [
            "Beginne jeden Tag mit 3 Dingen, für die du dankbar bist",
            "Schreibe sie in ein Dankbarkeitstagebuch",
            "Spüre die Dankbarkeit in deinem Herzen",
            "Danke dem Universum für deine Segnungen",
            "Reflektiere über spirituelle Lektionen",
            "Beende mit einem Gebet oder Mantra"
          ],
          benefits: [
            "Positive Lebenseinstellung",
            "Spirituelle Verbindung",
            "Reduzierte Negativität",
            "Erhöhte Lebenszufriedenheit"
          ],
          tips: [
            "Sei spezifisch in deiner Dankbarkeit",
            "Incluide auch kleine Dinge",
            "Teile deine Dankbarkeit mit anderen"
          ]
        }
      ]
    },
    {
      id: 5,
      title: "Intuitives Bewusstsein",
      description: "Entwicklung der inneren Weisheit und Intuition",
      color: "#FECA57",
      icon: <Eye size={24} />,
      duration: "8-16 Wochen",
      difficulty: 'Experte',
      benefits: [
        "Stärkere Intuition",
        "Bessere Entscheidungsfindung",
        "Erhöhte Kreativität",
        "Tiefere Selbsterkenntnis"
      ],
      challenges: [
        "Vertrauen in die eigene Intuition entwickeln",
        "Unterscheidung zwischen Intuition und Angst",
        "Integration in den Alltag"
      ],
      exercises: [
        {
          id: "intuition-journal",
          title: "Intuitions-Tagebuch",
          description: "Intuitive Impulse dokumentieren und validieren",
          duration: "15-30 Minuten täglich",
          instructions: [
            "Notiere alle intuitiven Impulse",
            "Dokumentiere die Situation und dein Gefühl",
            "Verfolge die Ergebnisse",
            "Analysiere die Genauigkeit deiner Intuition",
            "Identifiziere Muster in deinen intuitiven Signalen",
            "Vertraue zunehmend auf deine innere Weisheit"
          ],
          benefits: [
            "Stärkere Intuition",
            "Besseres Vertrauen in sich selbst",
            "Verbesserte Entscheidungsfindung",
            "Erhöhte Selbstsicherheit"
          ],
          tips: [
            "Beginne mit kleinen Entscheidungen",
            "Sei geduldig mit dem Lernprozess",
            "Vertraue auf deine ersten Impulse"
          ]
        },
        {
          id: "body-wisdom",
          title: "Körper-Weisheit",
          description: "Körperliche Empfindungen als intuitive Führung nutzen",
          duration: "20-40 Minuten",
          instructions: [
            "Stelle dir eine wichtige Entscheidung vor",
            "Spüre in deinen Körper hinein",
            "Beobachte körperliche Reaktionen",
            "Identifiziere positive und negative Empfindungen",
            "Vertraue auf die körperliche Weisheit",
            "Entscheide basierend auf körperlichen Signalen"
          ],
          benefits: [
            "Stärkere Körperverbindung",
            "Bessere Entscheidungsfindung",
            "Reduzierte mentale Überlastung",
            "Natürlichere Lebensführung"
          ],
          tips: [
            "Übe mit verschiedenen Entscheidungen",
            "Vertraue auf deine ersten körperlichen Reaktionen",
            "Kombiniere mit rationaler Analyse"
          ]
        }
      ]
    },
    {
      id: 6,
      title: "Transpersonales Bewusstsein",
      description: "Erweiterung über das individuelle Selbst hinaus",
      color: "#A55EEA",
      icon: <Users size={24} />,
      duration: "12-24 Wochen",
      difficulty: 'Experte',
      benefits: [
        "Gefühl der Einheit mit allem",
        "Reduziertes Ego",
        "Tiefere Mitmenschlichkeit",
        "Erweiterte Perspektive"
      ],
      challenges: [
        "Loslassen des Ego",
        "Akzeptanz der Verbundenheit",
        "Integration in den Alltag"
      ],
      exercises: [
        {
          id: "unity-meditation",
          title: "Einheits-Meditation",
          description: "Erfahrung der Verbundenheit mit allem",
          duration: "45-90 Minuten",
          instructions: [
            "Meditiere über deine Verbindung zur Natur",
            "Erweitere das Bewusstsein auf alle Lebewesen",
            "Spüre die Einheit mit dem Universum",
            "Lass das Gefühl des getrennten Selbst los",
            "Erfahre die Verbundenheit mit allem",
            "Integriere diese Erfahrung in dein tägliches Leben"
          ],
          benefits: [
            "Gefühl der Einheit",
            "Reduziertes Ego",
            "Tiefere Mitmenschlichkeit",
            "Spirituelle Erfüllung"
          ],
          tips: [
            "Übe in der Natur",
            "Verwende geführte Meditationen",
            "Sei geduldig mit dem Prozess"
          ]
        },
        {
          id: "compassion-practice",
          title: "Mitgefühl-Praxis",
          description: "Entwicklung von Mitgefühl für alle Wesen",
          duration: "20-40 Minuten",
          instructions: [
            "Beginne mit Mitgefühl für dich selbst",
            "Erweitere es auf geliebte Menschen",
            "Incluide neutrale Personen",
            "Erweitere auf schwierige Menschen",
            "Umfasse alle Lebewesen",
            "Spüre die Verbundenheit durch Mitgefühl"
          ],
          benefits: [
            "Tiefere Mitmenschlichkeit",
            "Reduzierte Wut und Groll",
            "Erhöhte Empathie",
            "Bessere Beziehungen"
          ],
          tips: [
            "Beginne mit kleinen Schritten",
            "Sei geduldig mit schwierigen Menschen",
            "Übe regelmäßig"
          ]
        }
      ]
    },
    {
      id: 7,
      title: "Kosmisches Bewusstsein",
      description: "Vollständige Integration und kosmische Perspektive",
      color: "#FFD700",
      icon: <Crown size={24} />,
      duration: "Lebenslange Praxis",
      difficulty: 'Experte',
      benefits: [
        "Vollständige Selbstverwirklichung",
        "Kosmische Perspektive",
        "Tiefe innere Ruhe",
        "Vollständige Integration aller Aspekte"
      ],
      challenges: [
        "Lebenslange Hingabe",
        "Kontinuierliche Praxis",
        "Integration aller Stufen"
      ],
      exercises: [
        {
          id: "cosmic-meditation",
          title: "Kosmische Meditation",
          description: "Vollständige Verbindung mit dem kosmischen Bewusstsein",
          duration: "60-120 Minuten",
          instructions: [
            "Meditiere über deine kosmische Natur",
            "Erfahre dich als Teil des Universums",
            "Lass alle Grenzen des Selbst los",
            "Erlebe die Einheit mit dem Kosmos",
            "Integriere alle vorherigen Stufen",
            "Lebte aus diesem erweiterten Bewusstsein"
          ],
          benefits: [
            "Vollständige Selbstverwirklichung",
            "Kosmische Perspektive",
            "Tiefe innere Ruhe",
            "Vollständige Integration"
          ],
          tips: [
            "Übe regelmäßig und konsequent",
            "Integriere in alle Lebensbereiche",
            "Sei ein lebendes Beispiel"
          ]
        },
        {
          id: "service-practice",
          title: "Dienst-Praxis",
          description: "Dienen aus kosmischem Bewusstsein heraus",
          duration: "Lebenslange Praxis",
          instructions: [
            "Identifiziere deine einzigartigen Gaben",
            "Diene anderen aus Liebe und Weisheit",
            "Handele aus kosmischem Bewusstsein",
            "Sei ein Kanal für höhere Weisheit",
            "Inspiriere andere auf ihrem Weg",
            "Lebte als Beispiel für kosmisches Bewusstsein"
          ],
          benefits: [
            "Sinnvolle Lebensführung",
            "Tiefe Erfüllung",
            "Positive Auswirkung auf die Welt",
            "Vollständige Selbstverwirklichung"
          ],
          tips: [
            "Beginne mit kleinen Diensten",
            "Sei authentisch in deinem Dienst",
            "Diene ohne Erwartungen"
          ]
        }
      ]
    }
  ];

  const handleExerciseComplete = (exerciseId: string) => {
    setCompletedExercises(prev => new Set([...prev, exerciseId]));
  };

  const handleLevelExpand = (levelId: number) => {
    setExpandedLevel(expandedLevel === levelId ? null : levelId);
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <AnimatedStars />
      
      <Container maxWidth="lg" sx={{ py: 4, position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <motion.div
          
          
          
        >
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography 
              variant="h2" 
              sx={{ 
                color: 'white', 
                fontWeight: 700, 
                mb: 2,
                textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
              }}
            >
              🌟 Sieben Stufen des Bewusstseins
            </Typography>
            <Typography 
              variant="h5" 
              sx={{ 
                color: 'rgba(255,255,255,0.9)', 
                mb: 3,
                textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
              }}
            >
              Dein Weg zur vollständigen Bewusstseinsentwicklung
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
              <Chip 
                icon={<Award size={16} />} 
                label={`${completedExercises.size} Übungen abgeschlossen`}
                sx={{ 
                  background: 'rgba(255,255,255,0.2)', 
                  color: 'white',
                  backdropFilter: 'blur(10px)'
                }} 
              />
              <Chip 
                icon={<Timer size={16} />} 
                label="Tägliche Praxis empfohlen"
                sx={{ 
                  background: 'rgba(255,255,255,0.2)', 
                  color: 'white',
                  backdropFilter: 'blur(10px)'
                }} 
              />
            </Box>
          </Box>
        </motion.div>

        {/* Consciousness Levels */}
        <Grid container spacing={3}>
          {consciousnessLevels.map((level, index) => (
            <Grid item xs={12} key={level.id}>
              <motion.div
                
                
                
              >
                <Card sx={{ 
                  background: 'rgba(255,255,255,0.95)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 3,
                  overflow: 'hidden',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                  border: `2px solid ${level.color}20`
                }}>
                  <CardContent sx={{ p: 0 }}>
                    {/* Level Header */}
                    <Box 
                      sx={{ 
                        background: `linear-gradient(135deg, ${level.color}, ${level.color}80)`,
                        p: 3,
                        color: 'white',
                        cursor: 'pointer'
                      }}
                      onClick={() => handleLevelExpand(level.id)}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Box sx={{ 
                            background: 'rgba(255,255,255,0.2)', 
                            borderRadius: 2, 
                            p: 1.5,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            {level.icon}
                          </Box>
                          <Box>
                            <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
                              Stufe {level.id}: {level.title}
                            </Typography>
                            <Typography variant="h6" sx={{ opacity: 0.9, mb: 2 }}>
                              {level.description}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                              <Chip 
                                label={level.difficulty} 
                                size="small" 
                                sx={{ 
                                  background: 'rgba(255,255,255,0.2)', 
                                  color: 'white' 
                                }} 
                              />
                              <Chip 
                                icon={<Clock size={14} />} 
                                label={level.duration} 
                                size="small" 
                                sx={{ 
                                  background: 'rgba(255,255,255,0.2)', 
                                  color: 'white' 
                                }} 
                              />
                            </Box>
                          </Box>
                        </Box>
                        <IconButton sx={{ color: 'white' }}>
                          {expandedLevel === level.id ? <ChevronUp /> : <ChevronDown />}
                        </IconButton>
                      </Box>
                    </Box>

                    {/* Level Content */}
                    <Collapse in={expandedLevel === level.id}>
                      <Box sx={{ p: 3 }}>
                        {/* Benefits & Challenges */}
                        <Grid container spacing={3} sx={{ mb: 4 }}>
                          <Grid item xs={12} md={6}>
                            <Box sx={{ 
                              background: `${level.color}10`, 
                              borderRadius: 2, 
                              p: 2,
                              border: `1px solid ${level.color}30`
                            }}>
                              <Typography variant="h6" sx={{ 
                                color: level.color, 
                                fontWeight: 600, 
                                mb: 2,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1
                              }}>
                                <CheckCircle size={20} />
                                Vorteile
                              </Typography>
                              <List dense>
                                {level.benefits.map((benefit, idx) => (
                                  <ListItem key={idx} sx={{ py: 0.5 }}>
                                    <ListItemIcon sx={{ minWidth: 32 }}>
                                      <Box sx={{ 
                                        width: 6, 
                                        height: 6, 
                                        borderRadius: '50%', 
                                        background: level.color 
                                      }} />
                                    </ListItemIcon>
                                    <ListItemText 
                                      primary={benefit} 
                                      primaryTypographyProps={{ fontSize: '0.9rem' }}
                                    />
                                  </ListItem>
                                ))}
                              </List>
                            </Box>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <Box sx={{ 
                              background: '#FFF3E0', 
                              borderRadius: 2, 
                              p: 2,
                              border: '1px solid #FFB74D30'
                            }}>
                              <Typography variant="h6" sx={{ 
                                color: '#F57C00', 
                                fontWeight: 600, 
                                mb: 2,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1
                              }}>
                                <Lightbulb size={20} />
                                Herausforderungen
                              </Typography>
                              <List dense>
                                {level.challenges.map((challenge, idx) => (
                                  <ListItem key={idx} sx={{ py: 0.5 }}>
                                    <ListItemIcon sx={{ minWidth: 32 }}>
                                      <Box sx={{ 
                                        width: 6, 
                                        height: 6, 
                                        borderRadius: '50%', 
                                        background: '#F57C00' 
                                      }} />
                                    </ListItemIcon>
                                    <ListItemText 
                                      primary={challenge} 
                                      primaryTypographyProps={{ fontSize: '0.9rem' }}
                                    />
                                  </ListItem>
                                ))}
                              </List>
                            </Box>
                          </Grid>
                        </Grid>

                        <Divider sx={{ my: 3 }} />

                        {/* Exercises */}
                        <Typography variant="h5" sx={{ 
                          fontWeight: 600, 
                          mb: 3,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1
                        }}>
                          <BookOpen size={24} />
                          Übungen für diese Stufe
                        </Typography>

                        <Grid container spacing={2}>
                          {level.exercises.map((exercise) => (
                            <Grid item xs={12} md={6} key={exercise.id}>
                              <Card sx={{ 
                                border: completedExercises.has(exercise.id) ? 
                                  `2px solid ${level.color}` : 
                                  '1px solid #E0E0E0',
                                background: completedExercises.has(exercise.id) ? 
                                  `${level.color}05` : 
                                  'white'
                              }}>
                                <CardContent>
                                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                    <Box sx={{ flex: 1 }}>
                                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                                        {exercise.title}
                                      </Typography>
                                      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                                        {exercise.description}
                                      </Typography>
                                      <Chip 
                                        icon={<Timer size={14} />} 
                                        label={exercise.duration} 
                                        size="small" 
                                        sx={{ 
                                          background: `${level.color}20`, 
                                          color: level.color,
                                          mb: 2
                                        }} 
                                      />
                                    </Box>
                                    {completedExercises.has(exercise.id) && (
                                      <CheckCircle size={24} color={level.color} />
                                    )}
                                  </Box>

                                  <Button
                                    variant="contained"
                                    fullWidth
                                    onClick={() => setActiveExercise(exercise.id)}
                                    sx={{
                                      background: `linear-gradient(45deg, ${level.color}, ${level.color}80)`,
                                      '&:hover': {
                                        background: `linear-gradient(45deg, ${level.color}CC, ${level.color}60)`
                                      }
                                    }}
                                  >
                                    {completedExercises.has(exercise.id) ? 'Wiederholen' : 'Übung starten'}
                                  </Button>
                                </CardContent>
                              </Card>
                            </Grid>
                          ))}
                        </Grid>
                      </Box>
                    </Collapse>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* Exercise Detail Modal */}
        <AnimatePresence>
          {activeExercise && (
            <motion.div
              
              
              exit={{ opacity: 0 }}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0,0,0,0.8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
                padding: 20
              }}
              onClick={() => setActiveExercise(null)}
            >
              <motion.div
                
                
                exit={{ scale: 0.8, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                style={{
                  background: 'white',
                  borderRadius: 16,
                  maxWidth: 800,
                  width: '100%',
                  maxHeight: '90vh',
                  overflow: 'auto'
                }}
              >
                {(() => {
                  const exercise = consciousnessLevels
                    .flatMap(level => level.exercises)
                    .find(ex => ex.id === activeExercise);
                  
                  if (!exercise) return null;
                  
                  const level = consciousnessLevels.find(l => 
                    l.exercises.some(ex => ex.id === activeExercise)
                  );
                  
                  return (
                    <Box sx={{ p: 4 }}>
                      {/* Header */}
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'flex-start',
                        mb: 3
                      }}>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h4" sx={{ 
                            fontWeight: 600, 
                            mb: 1,
                            color: level?.color
                          }}>
                            {exercise.title}
                          </Typography>
                          <Typography variant="h6" sx={{ 
                            color: 'text.secondary', 
                            mb: 2 
                          }}>
                            {exercise.description}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            <Chip 
                              icon={<Timer size={16} />} 
                              label={exercise.duration} 
                              sx={{ 
                                background: `${level?.color}20`, 
                                color: level?.color 
                              }} 
                            />
                            <Chip 
                              icon={<Award size={16} />} 
                              label={level?.difficulty} 
                              sx={{ 
                                background: `${level?.color}20`, 
                                color: level?.color 
                              }} 
                            />
                          </Box>
                        </Box>
                        <IconButton 
                          onClick={() => setActiveExercise(null)}
                          sx={{ color: 'text.secondary' }}
                        >
                          ×
                        </IconButton>
                      </Box>

                      <Divider sx={{ my: 3 }} />

                      {/* Instructions */}
                      <Box sx={{ mb: 4 }}>
                        <Typography variant="h5" sx={{ 
                          fontWeight: 600, 
                          mb: 2,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1
                        }}>
                          <Play size={24} />
                          Anleitung
                        </Typography>
                        <List>
                          {exercise.instructions.map((instruction, idx) => (
                            <ListItem key={idx} sx={{ py: 1 }}>
                              <ListItemIcon sx={{ minWidth: 40 }}>
                                <Box sx={{ 
                                  width: 24, 
                                  height: 24, 
                                  borderRadius: '50%', 
                                  background: level?.color,
                                  color: 'white',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontSize: '0.8rem',
                                  fontWeight: 600
                                }}>
                                  {idx + 1}
                                </Box>
                              </ListItemIcon>
                              <ListItemText 
                                primary={instruction}
                                primaryTypographyProps={{ fontSize: '1rem' }}
                              />
                            </ListItem>
                          ))}
                        </List>
                      </Box>

                      {/* Benefits */}
                      <Box sx={{ mb: 4 }}>
                        <Typography variant="h5" sx={{ 
                          fontWeight: 600, 
                          mb: 2,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1
                        }}>
                          <CheckCircle size={24} />
                          Vorteile
                        </Typography>
                        <Grid container spacing={1}>
                          {exercise.benefits.map((benefit, idx) => (
                            <Grid item xs={12} sm={6} key={idx}>
                              <Box sx={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: 1,
                                p: 1,
                                borderRadius: 1,
                                background: `${level?.color}10`
                              }}>
                                <CheckCircle size={16} color={level?.color} />
                                <Typography variant="body2">
                                  {benefit}
                                </Typography>
                              </Box>
                            </Grid>
                          ))}
                        </Grid>
                      </Box>

                      {/* Tips */}
                      <Box sx={{ mb: 4 }}>
                        <Typography variant="h5" sx={{ 
                          fontWeight: 600, 
                          mb: 2,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1
                        }}>
                          <Lightbulb size={24} />
                          Tipps
                        </Typography>
                        <List dense>
                          {exercise.tips.map((tip, idx) => (
                            <ListItem key={idx} sx={{ py: 0.5 }}>
                              <ListItemIcon sx={{ minWidth: 32 }}>
                                <Box sx={{ 
                                  width: 6, 
                                  height: 6, 
                                  borderRadius: '50%', 
                                  background: level?.color 
                                }} />
                              </ListItemIcon>
                              <ListItemText 
                                primary={tip}
                                primaryTypographyProps={{ fontSize: '0.9rem' }}
                              />
                            </ListItem>
                          ))}
                        </List>
                      </Box>

                      {/* Action Buttons */}
                      <Box sx={{ 
                        display: 'flex', 
                        gap: 2, 
                        justifyContent: 'center',
                        pt: 3,
                        borderTop: '1px solid #E0E0E0'
                      }}>
                        <Button
                          variant="contained"
                          size="large"
                          onClick={() => {
                            handleExerciseComplete(exercise.id);
                            setActiveExercise(null);
                          }}
                          sx={{
                            background: `linear-gradient(45deg, ${level?.color}, ${level?.color}80)`,
                            '&:hover': {
                              background: `linear-gradient(45deg, ${level?.color}CC, ${level?.color}60)`
                            },
                            px: 4,
                            py: 1.5
                          }}
                        >
                          {completedExercises.has(exercise.id) ? 'Wiederholen' : 'Übung abschließen'}
                        </Button>
                        <Button
                          variant="outlined"
                          size="large"
                          onClick={() => setActiveExercise(null)}
                          sx={{ px: 4, py: 1.5 }}
                        >
                          Schließen
                        </Button>
                      </Box>
                    </Box>
                  );
                })()}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </Container>
    </Box>
  );
}
