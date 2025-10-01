"use client";

import { 
  Box, 
  Typography, 
  Button, 
  Card, 
  CardContent, 
  Container,
  Grid,
  Chip,
  Paper,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  Badge,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { 
  Heart, 
  MapPin, 
  Calendar,
  Users,
  Star,
  Coffee,
  Music,
  Camera,
  BookOpen,
  Utensils,
  Moon,
  Sun,
  Sparkles,
  ArrowRight,
  Lightbulb,
  Target,
  Clock,
  DollarSign
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

// Floating Stars Animation
const FloatingStars = () => {
  const stars = [
    { left: '10%', top: '15%', size: 2 },
    { left: '85%', top: '25%', size: 3 },
    { left: '45%', top: '35%', size: 2 },
    { left: '75%', top: '45%', size: 3 },
    { left: '20%', top: '55%', size: 2 },
    { left: '90%', top: '65%', size: 3 },
    { left: '30%', top: '75%', size: 2 },
    { left: '60%', top: '85%', size: 3 },
    { left: '15%', top: '95%', size: 2 },
    { left: '80%', top: '5%', size: 3 }
  ];

  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        zIndex: 0,
        pointerEvents: 'none'
      }}
    >
      {stars.map((star, index) => (
        <Box
          key={index}
          sx={{
            position: 'absolute',
            left: star.left,
            top: star.top,
            width: `${star.size}px`,
            height: `${star.size}px`,
            background: 'rgba(255, 255, 255, 0.6)',
            borderRadius: '50%',
            animation: `twinkle ${2 + Math.random() * 3}s ease-in-out infinite alternate`,
            '@keyframes twinkle': {
              '0%': { opacity: 0.3, transform: 'scale(1)' },
              '100%': { opacity: 1, transform: 'scale(1.2)' }
            }
          }}
        />
      ))}
    </Box>
  );
};

interface DatingTip {
  id: string;
  title: string;
  description: string;
  category: 'location' | 'activity' | 'timing' | 'communication';
  icon: React.ReactNode;
  color: string;
  energy: 'high' | 'medium' | 'low';
  duration: string;
  cost: 'free' | 'low' | 'medium' | 'high';
  weather: 'indoor' | 'outdoor' | 'any';
}

interface Location {
  id: string;
  name: string;
  type: string;
  description: string;
  address: string;
  energy: 'high' | 'medium' | 'low';
  atmosphere: string[];
  bestFor: string[];
  icon: React.ReactNode;
  color: string;
}

export default function MatchTipsPage() {
  const [userType, setUserType] = useState('');
  const [partnerType, setUserPartnerType] = useState('');
  const [userProfile, setUserProfile] = useState('');
  const [partnerProfile, setPartnerProfile] = useState('');
  const [showResults, setShowResults] = useState(false);

  // Dating-Tipps basierend auf Human Design Konstellationen
  const getDatingTips = (userType: string, partnerType: string, userProfile: string, partnerProfile: string): DatingTip[] => {
    const tips: DatingTip[] = [];

    // Generator + Projector Kombinationen
    if ((userType === 'Generator' && partnerType === 'Projector') || 
        (userType === 'Projector' && partnerType === 'Generator')) {
      tips.push(
        {
          id: 'gen-proj-1',
          title: 'Energie-Aufladung für Generatoren',
          description: 'Wähle Orte, wo der Generator seine Energie aufladen kann - lebendige Cafés, Märkte oder Workshops.',
          category: 'location',
          icon: <Coffee size={24} />,
          color: '#10b981',
          energy: 'high',
          duration: '2-3 Stunden',
          cost: 'low',
          weather: 'indoor'
        },
        {
          id: 'gen-proj-2',
          title: 'Projektor-Wertschätzung',
          description: 'Zeige dem Projector, dass seine Weisheit geschätzt wird - frage nach seiner Meinung und höre aktiv zu.',
          category: 'communication',
          icon: <Users size={24} />,
          color: '#8b5cf6',
          energy: 'medium',
          duration: 'Gespräch',
          cost: 'free',
          weather: 'any'
        }
      );
    }

    // Manifestor + Projector Kombinationen
    if ((userType === 'Manifestor' && partnerType === 'Projector') || 
        (userType === 'Projector' && partnerType === 'Manifestor')) {
      tips.push(
        {
          id: 'man-proj-1',
          title: 'Informieren vor Handeln',
          description: 'Manifestors sollten Projectors über Pläne informieren - spontane Aktivitäten können Projectors überwältigen.',
          category: 'communication',
          icon: <Lightbulb size={24} />,
          color: '#ef4444',
          energy: 'medium',
          duration: 'Planung',
          cost: 'free',
          weather: 'any'
        },
        {
          id: 'man-proj-2',
          title: 'Kreative Zusammenarbeit',
          description: 'Projekte oder kreative Aktivitäten, wo beide ihre Stärken einbringen können.',
          category: 'activity',
          icon: <Camera size={24} />,
          color: '#f59e0b',
          energy: 'high',
          duration: '3-4 Stunden',
          cost: 'medium',
          weather: 'any'
        }
      );
    }

    // Reflector Kombinationen
    if (userType === 'Reflector' || partnerType === 'Reflector') {
      tips.push(
        {
          id: 'refl-1',
          title: 'Mondzyklus beachten',
          description: 'Reflectors brauchen Zeit für Entscheidungen - plane Dates mit genügend Vorlaufzeit.',
          category: 'timing',
          icon: <Moon size={24} />,
          color: '#06b6d4',
          energy: 'low',
          duration: 'Planung',
          cost: 'free',
          weather: 'any'
        },
        {
          id: 'refl-2',
          title: 'Ruhige, reflektierende Orte',
          description: 'Wähle Orte mit ruhiger Atmosphäre - Parks, Museen oder ruhige Cafés.',
          category: 'location',
          icon: <BookOpen size={24} />,
          color: '#06b6d4',
          energy: 'low',
          duration: '2-3 Stunden',
          cost: 'low',
          weather: 'any'
        }
      );
    }

    // Manifesting Generator Kombinationen
    if (userType === 'Manifesting Generator' || partnerType === 'Manifesting Generator') {
      tips.push(
        {
          id: 'mgen-1',
          title: 'Multi-Tasking Aktivitäten',
          description: 'Aktivitäten, die mehrere Interessen gleichzeitig bedienen - Food Markets, Festivals.',
          category: 'activity',
          icon: <Utensils size={24} />,
          color: '#f59e0b',
          energy: 'high',
          duration: '3-5 Stunden',
          cost: 'medium',
          weather: 'any'
        }
      );
    }

    // Profil-spezifische Tipps
    if (userProfile.includes('3') || partnerProfile.includes('3')) {
      tips.push(
        {
          id: 'line3-1',
          title: 'Experimentelle Dates',
          description: 'Line 3 liebt Experimente - probiert neue Restaurants, Aktivitäten oder Routen aus.',
          category: 'activity',
          icon: <Target size={24} />,
          color: '#ef4444',
          energy: 'high',
          duration: '2-4 Stunden',
          cost: 'medium',
          weather: 'any'
        }
      );
    }

    if (userProfile.includes('4') || partnerProfile.includes('4')) {
      tips.push(
        {
          id: 'line4-1',
          title: 'Freundeskreis einbeziehen',
          description: 'Line 4 liebt soziale Verbindungen - Double Dates oder Gruppenaktivitäten.',
          category: 'activity',
          icon: <Users size={24} />,
          color: '#8b5cf6',
          energy: 'medium',
          duration: '3-4 Stunden',
          cost: 'medium',
          weather: 'any'
        }
      );
    }

    return tips;
  };

  // Orte basierend auf Human Design Typen
  const getRecommendedLocations = (userType: string, partnerType: string): Location[] => {
    const locations: Location[] = [];

    // Generator-freundliche Orte
    if (userType === 'Generator' || partnerType === 'Generator') {
      locations.push(
        {
          id: 'gen-cafe',
          name: 'Lebendiges Café',
          type: 'Café',
          description: 'Energiegeladene Atmosphäre mit vielen Menschen und Aktivitäten',
          address: 'Beispiel: Café Central, Berlin',
          energy: 'high',
          atmosphere: ['lebendig', 'sozial', 'energiegeladen'],
          bestFor: ['Gespräche', 'Menschen beobachten', 'Energie tanken'],
          icon: <Coffee size={24} />,
          color: '#10b981'
        },
        {
          id: 'gen-market',
          name: 'Wochenmarkt',
          type: 'Markt',
          description: 'Viele verschiedene Eindrücke und Möglichkeiten zu interagieren',
          address: 'Beispiel: Mauerpark Flohmarkt, Berlin',
          energy: 'high',
          atmosphere: ['bunt', 'vielfältig', 'spontan'],
          bestFor: ['Entdecken', 'Shoppen', 'Street Food'],
          icon: <Utensils size={24} />,
          color: '#f59e0b'
        }
      );
    }

    // Projector-freundliche Orte
    if (userType === 'Projector' || partnerType === 'Projector') {
      locations.push(
        {
          id: 'proj-museum',
          name: 'Museum oder Galerie',
          type: 'Kultur',
          description: 'Ruhige Atmosphäre für tiefe Gespräche und Reflexion',
          address: 'Beispiel: Pergamonmuseum, Berlin',
          energy: 'low',
          atmosphere: ['ruhig', 'inspirierend', 'kontemplativ'],
          bestFor: ['Gespräche', 'Lernen', 'Reflexion'],
          icon: <BookOpen size={24} />,
          color: '#8b5cf6'
        },
        {
          id: 'proj-park',
          name: 'Ruhiger Park',
          type: 'Natur',
          description: 'Naturverbindung für entspannte Gespräche',
          address: 'Beispiel: Tiergarten, Berlin',
          energy: 'low',
          atmosphere: ['entspannend', 'natürlich', 'friedlich'],
          bestFor: ['Spaziergänge', 'Picknick', 'Gespräche'],
          icon: <MapPin size={24} />,
          color: '#10b981'
        }
      );
    }

    // Manifestor-freundliche Orte
    if (userType === 'Manifestor' || partnerType === 'Manifestor') {
      locations.push(
        {
          id: 'man-activity',
          name: 'Aktivitätszentrum',
          type: 'Aktivität',
          description: 'Plätze für spontane Aktivitäten und Abenteuer',
          address: 'Beispiel: Kletterhalle, Berlin',
          energy: 'high',
          atmosphere: ['dynamisch', 'abenteuerlich', 'spontan'],
          bestFor: ['Sport', 'Abenteuer', 'Herausforderungen'],
          icon: <Target size={24} />,
          color: '#ef4444'
        }
      );
    }

    // Reflector-freundliche Orte
    if (userType === 'Reflector' || partnerType === 'Reflector') {
      locations.push(
        {
          id: 'refl-quiet',
          name: 'Ruhiges Café',
          type: 'Café',
          description: 'Entspannte Atmosphäre für tiefe Gespräche',
          address: 'Beispiel: Café Einstein, Berlin',
          energy: 'low',
          atmosphere: ['ruhig', 'gemütlich', 'intim'],
          bestFor: ['Gespräche', 'Reflexion', 'Entspannung'],
          icon: <Coffee size={24} />,
          color: '#06b6d4'
        }
      );
    }

    return locations;
  };

  const handleGenerateTips = () => {
    if (userType && partnerType && userProfile && partnerProfile) {
      setShowResults(true);
    }
  };

  const tips = showResults ? getDatingTips(userType, partnerType, userProfile, partnerProfile) : [];
  const locations = showResults ? getRecommendedLocations(userType, partnerType) : [];

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
      overflow: 'hidden'
    }}>
      <FloatingStars />
      
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, py: 4 }}>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography
            variant="h2"
            sx={{
              color: '#FFD700',
              fontWeight: 800,
              mb: 2,
              fontSize: { xs: '2rem', md: '3rem' },
              textShadow: '0 4px 20px rgba(255, 215, 0, 0.8)',
              background: 'linear-gradient(45deg, #FFD700, #fbbf24)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            💕 Dating-Tipps & Orte
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.2rem' }}>
            Personalisierte Empfehlungen basierend auf euren Human Design Profilen
          </Typography>
        </Box>

        {/* Eingabeformular */}
        <Card sx={{
          background: 'rgba(255,255,255,0.05)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 3,
          mb: 4
        }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" sx={{ color: 'white', mb: 3, textAlign: 'center' }}>
              Eure Human Design Profile
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" sx={{ color: '#FFD700', mb: 2 }}>
                  Dein Profil
                </Typography>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel sx={{ color: 'rgba(255,255,255,0.7)' }}>Dein Typ</InputLabel>
                  <Select
                    value={userType}
                    onChange={(e) => setUserType(e.target.value)}
                    sx={{ color: 'white' }}
                  >
                    <MenuItem value="Generator">Generator</MenuItem>
                    <MenuItem value="Manifesting Generator">Manifesting Generator</MenuItem>
                    <MenuItem value="Projector">Projector</MenuItem>
                    <MenuItem value="Manifestor">Manifestor</MenuItem>
                    <MenuItem value="Reflector">Reflector</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: 'rgba(255,255,255,0.7)' }}>Dein Profil</InputLabel>
                  <Select
                    value={userProfile}
                    onChange={(e) => setUserProfile(e.target.value)}
                    sx={{ color: 'white' }}
                  >
                    <MenuItem value="1/3">1/3</MenuItem>
                    <MenuItem value="1/4">1/4</MenuItem>
                    <MenuItem value="2/4">2/4</MenuItem>
                    <MenuItem value="2/5">2/5</MenuItem>
                    <MenuItem value="3/5">3/5</MenuItem>
                    <MenuItem value="3/6">3/6</MenuItem>
                    <MenuItem value="4/6">4/6</MenuItem>
                    <MenuItem value="4/1">4/1</MenuItem>
                    <MenuItem value="5/1">5/1</MenuItem>
                    <MenuItem value="5/2">5/2</MenuItem>
                    <MenuItem value="6/2">6/2</MenuItem>
                    <MenuItem value="6/3">6/3</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="h6" sx={{ color: '#FFD700', mb: 2 }}>
                  Partner-Profil
                </Typography>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel sx={{ color: 'rgba(255,255,255,0.7)' }}>Partner Typ</InputLabel>
                  <Select
                    value={partnerType}
                    onChange={(e) => setUserPartnerType(e.target.value)}
                    sx={{ color: 'white' }}
                  >
                    <MenuItem value="Generator">Generator</MenuItem>
                    <MenuItem value="Manifesting Generator">Manifesting Generator</MenuItem>
                    <MenuItem value="Projector">Projector</MenuItem>
                    <MenuItem value="Manifestor">Manifestor</MenuItem>
                    <MenuItem value="Reflector">Reflector</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: 'rgba(255,255,255,0.7)' }}>Partner Profil</InputLabel>
                  <Select
                    value={partnerProfile}
                    onChange={(e) => setPartnerProfile(e.target.value)}
                    sx={{ color: 'white' }}
                  >
                    <MenuItem value="1/3">1/3</MenuItem>
                    <MenuItem value="1/4">1/4</MenuItem>
                    <MenuItem value="2/4">2/4</MenuItem>
                    <MenuItem value="2/5">2/5</MenuItem>
                    <MenuItem value="3/5">3/5</MenuItem>
                    <MenuItem value="3/6">3/6</MenuItem>
                    <MenuItem value="4/6">4/6</MenuItem>
                    <MenuItem value="4/1">4/1</MenuItem>
                    <MenuItem value="5/1">5/1</MenuItem>
                    <MenuItem value="5/2">5/2</MenuItem>
                    <MenuItem value="6/2">6/2</MenuItem>
                    <MenuItem value="6/3">6/3</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            
            <Box sx={{ textAlign: 'center', mt: 4 }}>
              <Button
                variant="contained"
                size="large"
                onClick={handleGenerateTips}
                disabled={!userType || !partnerType || !userProfile || !partnerProfile}
                sx={{
                  background: 'linear-gradient(45deg, #FFD700, #fbbf24)',
                  color: '#23233a',
                  fontWeight: 700,
                  px: 6,
                  py: 2,
                  '&:hover': {
                    background: 'linear-gradient(45deg, #fbbf24, #FFD700)',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                <Sparkles size={20} style={{ marginRight: 8 }} />
                Tipps generieren
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Ergebnisse */}
        {showResults && (
          <>
            {/* Dating-Tipps */}
            <Box sx={{ mb: 6 }}>
              <Typography variant="h4" sx={{ color: 'white', mb: 4, textAlign: 'center' }}>
                💡 Personalisierte Dating-Tipps
              </Typography>
              
              <Grid container spacing={3}>
                {tips.map((tip) => (
                  <Grid item xs={12} md={6} key={tip.id}>
                    <motion.div
                      
                      
                      
                    >
                      <Card sx={{
                        background: 'rgba(255,255,255,0.05)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: 3,
                        height: '100%',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
                        }
                      }}>
                        <CardContent sx={{ p: 3 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Box sx={{ color: tip.color, mr: 2 }}>
                              {tip.icon}
                            </Box>
                            <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                              {tip.title}
                            </Typography>
                          </Box>
                          
                          <Typography sx={{ color: 'rgba(255,255,255,0.8)', mb: 2, lineHeight: 1.6 }}>
                            {tip.description}
                          </Typography>
                          
                          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            <Chip
                              label={tip.duration}
                              size="small"
                              icon={<Clock size={16} />}
                              sx={{ background: 'rgba(255, 215, 0, 0.2)', color: '#FFD700' }}
                            />
                            <Chip
                              label={tip.energy}
                              size="small"
                              sx={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10b981' }}
                            />
                            <Chip
                              label={tip.cost}
                              size="small"
                              icon={<DollarSign size={16} />}
                              sx={{ background: 'rgba(59, 130, 246, 0.2)', color: '#3b82f6' }}
                            />
                          </Box>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </Box>

            {/* Empfohlene Orte */}
            <Box sx={{ mb: 6 }}>
              <Typography variant="h4" sx={{ color: 'white', mb: 4, textAlign: 'center' }}>
                📍 Empfohlene Orte
              </Typography>
              
              <Grid container spacing={3}>
                {locations.map((location) => (
                  <Grid item xs={12} md={6} key={location.id}>
                    <motion.div
                      
                      
                      
                    >
                      <Card sx={{
                        background: 'rgba(255,255,255,0.05)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: 3,
                        height: '100%',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
                        }
                      }}>
                        <CardContent sx={{ p: 3 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Box sx={{ color: location.color, mr: 2 }}>
                              {location.icon}
                            </Box>
                            <Box>
                              <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                                {location.name}
                              </Typography>
                              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                {location.type}
                              </Typography>
                            </Box>
                          </Box>
                          
                          <Typography sx={{ color: 'rgba(255,255,255,0.8)', mb: 2, lineHeight: 1.6 }}>
                            {location.description}
                          </Typography>
                          
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" sx={{ color: '#FFD700', mb: 1 }}>
                              <MapPin size={16} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                              {location.address}
                            </Typography>
                          </Box>
                          
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1 }}>
                              Atmosphäre:
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                              {location.atmosphere.map((atm, index) => (
                                <Chip
                                  key={index}
                                  label={atm}
                                  size="small"
                                  sx={{ background: 'rgba(255, 215, 0, 0.2)', color: '#FFD700' }}
                                />
                              ))}
                            </Box>
                          </Box>
                          
                          <Box>
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1 }}>
                              Ideal für:
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                              {location.bestFor.map((activity, index) => (
                                <Chip
                                  key={index}
                                  label={activity}
                                  size="small"
                                  sx={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10b981' }}
                                />
                              ))}
                            </Box>
                          </Box>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </>
        )}
      </Container>
    </Box>
  );
}
