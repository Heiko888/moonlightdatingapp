"use client";
import React, { useState } from 'react';
import { Container, Typography, Card, CardContent, Box, Button, Paper, Chip, Tabs, Tab, Grid, Accordion, AccordionSummary, AccordionDetails, TextField, InputAdornment } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { motion } from 'framer-motion';
import { Search, Brain, Heart, Zap, Eye, Crown, Shield, Target, Star, Circle, ChevronDown, ArrowRight, BookOpen } from 'lucide-react';
import AnimatedStars from '@/components/AnimatedStars';
import Link from 'next/link';

interface Authority {
  id: string;
  name: string;
  germanName: string;
  description: string;
  strategy: string;
  centers: string[];
  keywords: string[];
  decisionProcess: string;
  challenges: string[];
  strengths: string[];
  color: string;
  icon: React.ReactNode;
}

export default function AuthorityPage() {
  const [selectedAuthority, setSelectedAuthority] = useState<Authority | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedAuthority, setExpandedAuthority] = useState<string | false>(false);

  const authorities: Authority[] = [
    {
      id: 'sacral',
      name: 'Sacral Authority',
      germanName: 'Sakrale Autorität',
      description: 'Die sakrale Autorität ist die häufigste und natürlichste Entscheidungsmethode. Sie basiert auf der sakralen Antwort - einem inneren "Ja" oder "Nein".',
      strategy: 'Warten auf die sakrale Antwort. Höre auf deine innere Stimme und spüre die Energie in deinem Bauch.',
      centers: ['Sacral Center'],
      keywords: ['Sakrale Antwort', 'Energie', 'Bauchgefühl', 'Ja/Nein', 'Natur'],
      decisionProcess: '1. Stelle dir die Frage\n2. Spüre in deinen Bauch\n3. Warte auf die sakrale Antwort (Ja/Nein)\n4. Vertraue der Antwort',
      challenges: ['Überdenken der Antwort', 'Zweifel an der Intuition', 'Druck von außen', 'Angst vor Fehlern'],
      strengths: ['Schnelle Entscheidungen', 'Natürliche Intuition', 'Zuverlässige Antworten', 'Energische Klarheit'],
      color: '#f59e0b',
      icon: <Zap size={24} />
    },
    {
      id: 'emotional',
      name: 'Emotional Authority',
      germanName: 'Emotionale Autorität',
      description: 'Die emotionale Autorität basiert auf emotionalen Wellen. Entscheidungen müssen durch emotionale Klarheit reifen.',
      strategy: 'Warten auf emotionale Klarheit. Lass deine Emotionen durch ihre Wellen fließen, bevor du entscheidest.',
      centers: ['Solar Plexus Center'],
      keywords: ['Emotionale Wellen', 'Klarheit', 'Reifung', 'Geduld', 'Gefühle'],
      decisionProcess: '1. Erkenne die emotionale Welle\n2. Warte auf Klarheit\n3. Lass die Emotion reifen\n4. Entscheide in Klarheit',
      challenges: ['Ungeduld', 'Druck zu entscheiden', 'Emotionale Überwältigung', 'Angst vor Verpassen'],
      strengths: ['Tiefe Weisheit', 'Emotionale Reife', 'Authentische Entscheidungen', 'Menschliche Verbindung'],
      color: '#ec4899',
      icon: <Heart size={24} />
    },
    {
      id: 'splenic',
      name: 'Splenic Authority',
      germanName: 'Splenische Autorität',
      description: 'Die splenische Autorität ist die schnellste und basiert auf Intuition und Überlebensinstinkt.',
      strategy: 'Vertraue deiner Intuition. Die Antwort kommt sofort und ist zuverlässig.',
      centers: ['Spleen Center'],
      keywords: ['Intuition', 'Überleben', 'Sofort', 'Instinkt', 'Gesundheit'],
      decisionProcess: '1. Höre auf deine Intuition\n2. Vertraue der sofortigen Antwort\n3. Handle entsprechend\n4. Zweifle nicht',
      challenges: ['Zweifel an der Intuition', 'Überdenken', 'Angst vor Fehlern', 'Druck von außen'],
      strengths: ['Sofortige Klarheit', 'Zuverlässige Intuition', 'Überlebensinstinkt', 'Gesunde Entscheidungen'],
      color: '#84cc16',
      icon: <Eye size={24} />
    },
    {
      id: 'g',
      name: 'G Center Authority',
      germanName: 'G-Zentrum Autorität',
      description: 'Die G-Zentrum Autorität basiert auf Liebe und Richtung. Entscheidungen kommen aus dem Herzen.',
      strategy: 'Folge deinem Herzen. Die Antwort kommt aus Liebe und innerer Richtung.',
      centers: ['G Center'],
      keywords: ['Liebe', 'Richtung', 'Herz', 'Identität', 'Zweck'],
      decisionProcess: '1. Spüre in dein Herz\n2. Frage nach Liebe und Richtung\n3. Vertraue der Antwort\n4. Folge deinem Weg',
      challenges: ['Angst vor Liebe', 'Identitätskrisen', 'Suche nach Richtung', 'Zweifel am Herzen'],
      strengths: ['Authentische Liebe', 'Klare Richtung', 'Herzbasierte Entscheidungen', 'Wahre Identität'],
      color: '#10b981',
      icon: <Heart size={24} />
    },
    {
      id: 'ego',
      name: 'Ego Authority',
      germanName: 'Ego-Autorität',
      description: 'Die Ego-Autorität basiert auf Willen und Selbstwertigkeit. Entscheidungen kommen aus innerer Kraft.',
      strategy: 'Vertraue deinem Willen. Die Antwort kommt aus innerer Kraft und Selbstwertigkeit.',
      centers: ['Heart Center'],
      keywords: ['Wille', 'Selbstwertigkeit', 'Kraft', 'Entscheidung', 'Autorität'],
      decisionProcess: '1. Spüre deinen Willen\n2. Vertraue deiner Kraft\n3. Entscheide aus Selbstwertigkeit\n4. Handle mit Autorität',
      challenges: ['Angst vor Willensverlust', 'Selbstzweifel', 'Druck zu beweisen', 'Angst vor Autorität'],
      strengths: ['Starker Wille', 'Selbstwertigkeit', 'Entscheidungskraft', 'Natürliche Autorität'],
      color: '#ef4444',
      icon: <Shield size={24} />
    },
    {
      id: 'environmental',
      name: 'Environmental Authority',
      germanName: 'Umgebungs-Autorität',
      description: 'Die Umgebungs-Autorität basiert auf der Umgebung und dem Kontext. Entscheidungen werden durch die Umgebung beeinflusst.',
      strategy: 'Achte auf deine Umgebung. Die Antwort kommt durch den richtigen Kontext und die richtige Umgebung.',
      centers: ['G Center'],
      keywords: ['Umgebung', 'Kontext', 'Richtung', 'Raum', 'Atmosphäre'],
      decisionProcess: '1. Beobachte deine Umgebung\n2. Spüre den Kontext\n3. Vertraue der Umgebungsantwort\n4. Handle entsprechend',
      challenges: ['Falsche Umgebung', 'Kontextverlust', 'Angst vor Richtungslosigkeit', 'Druck zu entscheiden'],
      strengths: ['Umgebungsbewusstsein', 'Kontextuelle Klarheit', 'Richtungsgefühl', 'Raumverständnis'],
      color: '#8b5cf6',
      icon: <Target size={24} />
    }
  ];

  const filteredAuthorities = authorities.filter(authority =>
    authority.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    authority.germanName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    authority.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAuthorityExpand = (authorityId: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedAuthority(isExpanded ? authorityId : false);
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: `
        radial-gradient(ellipse at top, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
        radial-gradient(ellipse at bottom, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
        linear-gradient(135deg, #0f0f23 0%, #1a1a2e 25%, #16213e 50%, #0f3460 75%, #533483 100%),
        url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='20' cy='20' r='1'/%3E%3Ccircle cx='80' cy='80' r='1'/%3E%3Ccircle cx='40' cy='60' r='0.5'/%3E%3Ccircle cx='60' cy='40' r='0.5'/%3E%3Ccircle cx='90' cy='10' r='0.8'/%3E%3Ccircle cx='10' cy='90' r='0.8'/%3E%3C/g%3E%3C/svg%3E")
      `,
      position: 'relative',
      overflow: 'hidden',
      py: 4
    }}>
      {/* Floating Stars Animation - SSR-sicher */}
      <Box sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
        zIndex: 1
      }}>
        {[...Array(20)].map((_, i) => (
          <Box
            key={i}
            sx={{
              position: 'absolute',
              width: Math.random() * 3 + 1,
              height: Math.random() * 3 + 1,
              background: 'rgba(255, 255, 255, 0.8)',
              borderRadius: '50%',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `twinkle ${Math.random() * 3 + 2}s infinite ease-in-out`,
              animationDelay: `${Math.random() * 2}s`,
              '@keyframes twinkle': {
                '0%, 100%': { opacity: 0.3, transform: 'scale(1)' },
                '50%': { opacity: 1, transform: 'scale(1.2)' }
              }
            }}
          />
        ))}
      </Box>
      
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
        {/* Hero Section */}
        <motion.div
          
          
          
        >
          <Box textAlign="center" mb={8}>
            <Chip
              label="🧠 Human Design Autoritäten"
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.15)',
                color: 'white',
                fontWeight: 700,
                mb: 3,
                fontSize: '1rem',
                py: 1,
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}
            />
            
            <Typography 
              variant="h1" 
              component="h1" 
              sx={{ 
                color: 'white', 
                fontWeight: 900,
                mb: 4,
                fontSize: { xs: '2.5rem', md: '4rem' },
                textShadow: '0 0 20px rgba(255, 255, 255, 0.5)',
                background: 'linear-gradient(45deg, #fff, #e0e7ff)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Autoritäten
            </Typography>
            
            <Typography 
              variant="h4" 
              sx={{ 
                color: 'rgba(255,255,255,0.9)', 
                mb: 6,
                maxWidth: 800,
                mx: 'auto',
                lineHeight: 1.4,
                textShadow: '0 2px 10px rgba(0,0,0,0.3)'
              }}
            >
              Entdecke deine natürliche Entscheidungsmethode und lerne, 
              wie du deine Autorität optimal nutzen kannst
            </Typography>
          </Box>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          
          
          
        >
          <Card sx={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            borderRadius: 4,
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
            p: 3,
            mb: 6
          }}>
            <TextField
              fullWidth
              placeholder="Suche nach Autoritäten, Schlüsselwörtern oder deutschen Namen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={20} color="white" />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                  '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                  '&.Mui-focused fieldset': { borderColor: 'white' }
                },
                '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                '& .MuiInputBase-input::placeholder': { color: 'rgba(255, 255, 255, 0.5)' }
              }}
            />
          </Card>
        </motion.div>

        {/* Authorities Grid */}
        <motion.div
          
          
          
        >
          <Grid container spacing={4}>
            {filteredAuthorities.map((authority, index) => (
              <Grid item xs={12} md={6} key={authority.id}>
                <motion.div
                  
                  
                  
                  whileHover={{ y: -8 }}
                >
                  <Card sx={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: 4,
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 30px 60px rgba(0,0,0,0.4)',
                      borderColor: 'rgba(255,255,255,0.4)',
                      background: 'rgba(255, 255, 255, 0.15)',
                    }
                  }}>
                    <CardContent sx={{ p: 4 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                        <Box sx={{
                          width: 60,
                          height: 60,
                          borderRadius: '50%',
                          background: `linear-gradient(135deg, ${authority.color}, ${authority.color}80)`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mr: 3,
                          color: '#fff'
                        }}>
                          {authority.icon}
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h5" sx={{
                            color: 'white',
                            fontWeight: 700,
                            mb: 1,
                            textShadow: '0 2px 10px rgba(0,0,0,0.3)'
                          }}>
                            {authority.germanName}
                          </Typography>
                          <Typography variant="body1" sx={{
                            color: 'rgba(255,255,255,0.8)',
                            fontSize: '0.9rem'
                          }}>
                            {authority.name}
                          </Typography>
                        </Box>
                      </Box>

                      <Typography sx={{
                        color: 'rgba(255,255,255,0.9)',
                        mb: 3,
                        lineHeight: 1.6
                      }}>
                        {authority.description}
                      </Typography>

                      <Box sx={{ mb: 3 }}>
                        <Typography variant="h6" sx={{
                          color: 'white',
                          fontWeight: 600,
                          mb: 2,
                          textShadow: '0 2px 10px rgba(0,0,0,0.3)'
                        }}>
                          Strategie:
                        </Typography>
                        <Typography sx={{
                          color: 'rgba(255,255,255,0.8)',
                          fontStyle: 'italic',
                          lineHeight: 1.6
                        }}>
                          {authority.strategy}
                        </Typography>
                      </Box>

                      <Box sx={{ mb: 3 }}>
                        <Typography variant="h6" sx={{
                          color: 'white',
                          fontWeight: 600,
                          mb: 2,
                          textShadow: '0 2px 10px rgba(0,0,0,0.3)'
                        }}>
                          Schlüsselwörter:
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {authority.keywords.map((keyword, idx) => (
                            <Chip
                              key={idx}
                              label={keyword}
                              size="small"
                              sx={{
                                background: 'rgba(255, 255, 255, 0.2)',
                                color: 'white',
                                border: '1px solid rgba(255, 255, 255, 0.3)',
                                fontSize: '0.8rem'
                              }}
                            />
                          ))}
                        </Box>
                      </Box>

                      {/* Expandable Details */}
                      <Accordion 
                        expanded={expandedAuthority === authority.id}
                        onChange={handleAuthorityExpand(authority.id)}
                        sx={{
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          borderRadius: 2,
                          '&:before': { display: 'none' }
                        }}
                      >
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}
                          sx={{ color: 'white' }}
                        >
                          <Typography variant="h6" sx={{ fontWeight: 600, textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
                            Detaillierte Informationen
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                              <Box sx={{ mb: 3 }}>
                                <Typography variant="h6" sx={{
                                  color: 'white',
                                  fontWeight: 600,
                                  mb: 2,
                                  textShadow: '0 2px 10px rgba(0,0,0,0.3)'
                                }}>
                                  Entscheidungsprozess:
                                </Typography>
                                <Typography sx={{
                                  color: 'rgba(255,255,255,0.8)',
                                  lineHeight: 1.6,
                                  whiteSpace: 'pre-line'
                                }}>
                                  {authority.decisionProcess}
                                </Typography>
                              </Box>

                              <Box sx={{ mb: 3 }}>
                                <Typography variant="h6" sx={{
                                  color: 'white',
                                  fontWeight: 600,
                                  mb: 2,
                                  textShadow: '0 2px 10px rgba(0,0,0,0.3)'
                                }}>
                                  Stärken:
                                </Typography>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                  {authority.strengths.map((strength, idx) => (
                                    <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                      <Star size={16} color="white" />
                                      <Typography sx={{
                                        color: 'rgba(255,255,255,0.8)',
                                        fontSize: '0.9rem'
                                      }}>
                                        {strength}
                                      </Typography>
                                    </Box>
                                  ))}
                                </Box>
                              </Box>
                            </Grid>

                            <Grid item xs={12} md={6}>
                              <Box sx={{ mb: 3 }}>
                                <Typography variant="h6" sx={{
                                  color: 'white',
                                  fontWeight: 600,
                                  mb: 2,
                                  textShadow: '0 2px 10px rgba(0,0,0,0.3)'
                                }}>
                                  Herausforderungen:
                                </Typography>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                  {authority.challenges.map((challenge, idx) => (
                                    <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                      <Circle size={16} color="white" />
                                      <Typography sx={{
                                        color: 'rgba(255,255,255,0.8)',
                                        fontSize: '0.9rem'
                                      }}>
                                        {challenge}
                                      </Typography>
                                    </Box>
                                  ))}
                                </Box>
                              </Box>

                              <Box>
                                <Typography variant="h6" sx={{
                                  color: 'white',
                                  fontWeight: 600,
                                  mb: 2,
                                  textShadow: '0 2px 10px rgba(0,0,0,0.3)'
                                }}>
                                  Zentren:
                                </Typography>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                  {authority.centers.map((center, idx) => (
                                    <Chip
                                      key={idx}
                                      label={center}
                                      size="small"
                                      sx={{
                                        background: 'rgba(255, 255, 255, 0.15)',
                                        color: 'white',
                                        border: '1px solid rgba(255, 255, 255, 0.2)',
                                        fontSize: '0.8rem'
                                      }}
                                    />
                                  ))}
                                </Box>
                              </Box>
                            </Grid>
                          </Grid>
                        </AccordionDetails>
                      </Accordion>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>

        {/* Back to Dashboard Button */}
        <motion.div
          
          
          
        >
          <Box sx={{ textAlign: 'center', mt: 8 }}>
            <Button
              component={Link}
              href="/dashboard"
              variant="contained"
              startIcon={<ArrowRight size={20} />}
              sx={{
                background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                color: '#1f2937',
                fontWeight: 700,
                px: 6,
                py: 2,
                borderRadius: 3,
                fontSize: '1.1rem',
                boxShadow: '0 8px 24px rgba(255, 215, 0, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #FFA500 0%, #FFD700 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 12px 30px rgba(255, 215, 0, 0.4)'
                }
              }}
            >
              Zurück zum Dashboard
            </Button>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
}
