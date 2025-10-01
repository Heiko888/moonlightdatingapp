'use client';

import React, { useState, useMemo } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Card, 
  CardContent, 
  Grid, 
  Button,
  TextField,
  InputAdornment,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper
} from '@mui/material';
import { motion } from 'framer-motion';
import { 
  ArrowLeft,
  Search,
  Filter,
  Sort
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function PlanetsPage() {
  const router = useRouter();
  
  // Such- und Filter-States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedElement, setSelectedElement] = useState('');
  const [sortBy, setSortBy] = useState('name');

  const planets = [
    {
      id: 'sun',
      name: 'Sonne',
      mythology: 'Das Zentrum des Bewusstseins',
      color: '#FFD700',
      gradient: 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FF8C00 100%)',
      icon: '☉',
      description: 'Die Sonne repräsentiert unser wahres Selbst, unsere Essenz und unser Bewusstsein. Sie zeigt, wer wir wirklich sind und was uns antreibt.',
      path: '/planets/sun',
      energy: 'Lebenskraft',
      element: 'Feuer',
      influence: 'Bewusstsein & Identität'
    },
    {
      id: 'moon',
      name: 'Mond',
      mythology: 'Das Unterbewusstsein und die Emotionen',
      color: '#C0C0C0',
      gradient: 'linear-gradient(135deg, #C0C0C0 0%, #E6E6FA 50%, #F0F8FF 100%)',
      icon: '☽',
      description: 'Der Mond repräsentiert unser Unterbewusstsein, unsere Emotionen und unsere instinktiven Reaktionen. Er zeigt, wie wir emotional reagieren.',
      path: '/planets/moon',
      energy: 'Emotionen',
      element: 'Wasser',
      influence: 'Unterbewusstsein & Intuition'
    },
    {
      id: 'mercury',
      name: 'Merkur',
      mythology: 'Der Bote der Götter',
      color: '#87CEEB',
      gradient: 'linear-gradient(135deg, #87CEEB 0%, #4682B4 50%, #1E90FF 100%)',
      icon: '☿',
      description: 'Merkur repräsentiert Kommunikation, Denken und Austausch. Er zeigt, wie wir kommunizieren und Informationen verarbeiten.',
      path: '/planets/mercury',
      energy: 'Kommunikation',
      element: 'Luft',
      influence: 'Denken & Austausch'
    },
    {
      id: 'venus',
      name: 'Venus',
      mythology: 'Die Göttin der Liebe',
      color: '#FFB6C1',
      gradient: 'linear-gradient(135deg, #FFB6C1 0%, #FF69B4 50%, #FF1493 100%)',
      icon: '♀',
      description: 'Venus repräsentiert Liebe, Schönheit und Werte. Sie zeigt, was wir lieben und was uns wichtig ist.',
      path: '/planets/venus',
      energy: 'Liebe',
      element: 'Erde',
      influence: 'Beziehungen & Schönheit'
    },
    {
      id: 'mars',
      name: 'Mars',
      mythology: 'Der Gott des Krieges',
      color: '#FF4500',
      gradient: 'linear-gradient(135deg, #FF4500 0%, #DC143C 50%, #B22222 100%)',
      icon: '♂',
      description: 'Mars repräsentiert Aktion, Aggression und Durchsetzung. Er zeigt, wie wir handeln und uns durchsetzen.',
      path: '/planets/mars',
      energy: 'Aktion',
      element: 'Feuer',
      influence: 'Durchsetzung & Kampf'
    },
    {
      id: 'jupiter',
      name: 'Jupiter',
      mythology: 'Der König der Götter',
      color: '#DAA520',
      gradient: 'linear-gradient(135deg, #DAA520 0%, #FFD700 50%, #FFA500 100%)',
      icon: '♃',
      description: 'Jupiter repräsentiert Expansion, Weisheit und Wachstum. Er zeigt, wo wir wachsen und uns ausdehnen.',
      path: '/planets/jupiter',
      energy: 'Expansion',
      element: 'Luft',
      influence: 'Weisheit & Wachstum'
    },
    {
      id: 'saturn',
      name: 'Saturn',
      mythology: 'Der Lehrer und Disziplinierer',
      color: '#708090',
      gradient: 'linear-gradient(135deg, #708090 0%, #2F4F4F 50%, #1C1C1C 100%)',
      icon: '♄',
      description: 'Saturn repräsentiert Struktur, Disziplin und Verantwortung. Er zeigt, wo wir lernen und uns entwickeln.',
      path: '/planets/saturn',
      energy: 'Struktur',
      element: 'Erde',
      influence: 'Disziplin & Grenzen'
    },
    {
      id: 'uranus',
      name: 'Uranus',
      mythology: 'Der Revolutionär',
      color: '#00CED1',
      gradient: 'linear-gradient(135deg, #00CED1 0%, #8A2BE2 50%, #9400D3 100%)',
      icon: '♅',
      description: 'Uranus repräsentiert Revolution, Innovation und Veränderung. Er zeigt, wo wir rebellieren und Neues erschaffen.',
      path: '/planets/uranus',
      energy: 'Revolution',
      element: 'Luft',
      influence: 'Innovation & Veränderung'
    },
    {
      id: 'neptune',
      name: 'Neptun',
      mythology: 'Der Mystiker',
      color: '#4169E1',
      gradient: 'linear-gradient(135deg, #4169E1 0%, #00BFFF 50%, #87CEEB 100%)',
      icon: '♆',
      description: 'Neptun repräsentiert Spiritualität, Illusion und Verbindung. Er zeigt, wo wir spirituell wachsen und uns verbinden.',
      path: '/planets/neptune',
      energy: 'Spiritualität',
      element: 'Wasser',
      influence: 'Illusion & Verbindung'
    },
    {
      id: 'pluto',
      name: 'Pluto',
      mythology: 'Der Transformator',
      color: '#8B008B',
      gradient: 'linear-gradient(135deg, #8B008B 0%, #DC143C 50%, #FF4500 100%)',
      icon: '♇',
      description: 'Pluto repräsentiert Transformation, Macht und Regeneration. Er zeigt, wo wir uns transformieren und erneuern.',
      path: '/planets/pluto',
      energy: 'Transformation',
      element: 'Feuer',
      influence: 'Macht & Regeneration'
    },
    {
      id: 'chiron',
      name: 'Chiron',
      mythology: 'Der verwundete Heiler',
      color: '#FF6B6B',
      gradient: 'linear-gradient(135deg, #FF6B6B 0%, #00FF7F 50%, #00CED1 100%)',
      icon: '⚷',
      description: 'Chiron repräsentiert unsere tiefsten Wunden und unsere Fähigkeit, andere zu heilen. Er zeigt, wo wir verletzt wurden und wo wir anderen helfen können.',
      path: '/planets/chiron',
      energy: 'Heilung',
      element: 'Erde',
      influence: 'Wunden & Weisheit'
    },
    {
      id: 'lilith',
      name: 'Lilith',
      mythology: 'Die Wilde Frau',
      color: '#4B0082',
      gradient: 'linear-gradient(135deg, #4B0082 0%, #8A2BE2 50%, #9400D3 100%)',
      icon: '⚸',
      description: 'Lilith repräsentiert das Wilde, Unabhängige und Tabubrechende in uns. Sie zeigt, wo wir uns weigern, uns zu unterwerfen.',
      path: '/lilith',
      energy: 'Rebellion',
      element: 'Feuer',
      influence: 'Unabhängigkeit & Tabu'
    },
    {
      id: 'incarnation-cross',
      name: 'Inkarnationskreuz',
      mythology: 'Die Lebensaufgabe',
      color: '#EC4899',
      gradient: 'linear-gradient(135deg, #EC4899 0%, #F97316 50%, #EF4444 100%)',
      icon: '✚',
      description: 'Das Inkarnationskreuz definiert deine einzigartige Lebensaufgabe und dein höchstes Potenzial. Es zeigt, wofür du hier bist.',
      path: '/planets/incarnation-cross',
      energy: 'Lebensaufgabe',
      element: 'Alle',
      influence: 'Höchstes Potenzial'
    }
  ];

  // Filter- und Sortierlogik
  const filteredPlanets = useMemo(() => {
    let filtered = planets.filter(planet => {
      const matchesSearch = planet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           planet.mythology.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           planet.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           planet.energy.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesElement = !selectedElement || planet.element === selectedElement;
      
      return matchesSearch && matchesElement;
    });

    // Sortierung
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'element':
          return a.element.localeCompare(b.element);
        case 'energy':
          return a.energy.localeCompare(b.energy);
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchTerm, selectedElement, sortBy]);

  // Verfügbare Elemente für Filter
  const availableElements = [...new Set(planets.map(planet => planet.element))];

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0B0D12 0%, #1A1F2B 50%, #2D3748 100%)',
      color: 'white',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated Stars */}
      <Box sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `
          radial-gradient(2px 2px at 20px 30px, #FFD700, transparent),
          radial-gradient(2px 2px at 40px 70px, #C0C0C0, transparent),
          radial-gradient(1px 1px at 90px 40px, #87CEEB, transparent),
          radial-gradient(1px 1px at 130px 80px, #FFB6C1, transparent),
          radial-gradient(2px 2px at 160px 30px, #FF4500, transparent)
        `,
        backgroundRepeat: 'repeat',
        backgroundSize: '200px 100px',
        animation: 'twinkle 4s ease-in-out infinite alternate'
      }} />

      <Container maxWidth="lg" sx={{ py: 4, position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Button
            variant="outlined"
            onClick={() => router.push('/premium-dashboard')}
            sx={{
              color: '#FFD700',
              borderColor: '#FFD700',
              '&:hover': {
                borderColor: '#FFD700',
                backgroundColor: 'rgba(255, 215, 0, 0.1)',
                boxShadow: '0 0 20px rgba(255, 215, 0, 0.3)'
              },
              mr: 2
            }}
          >
            <ArrowLeft size={20} style={{ marginRight: 8 }} />
            Zurück zum Premium Dashboard
          </Button>
        </Box>

        {/* Such- und Filter-Bereich */}
        <Paper sx={{
          p: 3,
          mb: 4,
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 3
        }}>
          <Grid container spacing={3} alignItems="center">
            {/* Suchfeld */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Planeten suchen..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search color="#FFD700" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    '& fieldset': {
                      borderColor: 'rgba(255, 215, 0, 0.3)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(255, 215, 0, 0.5)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#FFD700',
                    },
                  },
                  '& .MuiInputBase-input::placeholder': {
                    color: 'rgba(255, 255, 255, 0.7)',
                  },
                }}
              />
            </Grid>

            {/* Element-Filter */}
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: '#FFD700' }}>Element</InputLabel>
                <Select
                  value={selectedElement}
                  onChange={(e) => setSelectedElement(e.target.value)}
                  sx={{
                    color: 'white',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255, 215, 0, 0.3)',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255, 215, 0, 0.5)',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#FFD700',
                    },
                  }}
                >
                  <MenuItem value="">Alle Elemente</MenuItem>
                  {availableElements.map((element) => (
                    <MenuItem key={element} value={element}>
                      {element}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Sortierung */}
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: '#FFD700' }}>Sortieren nach</InputLabel>
                <Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  sx={{
                    color: 'white',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255, 215, 0, 0.3)',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255, 215, 0, 0.5)',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#FFD700',
                    },
                  }}
                >
                  <MenuItem value="name">Name</MenuItem>
                  <MenuItem value="element">Element</MenuItem>
                  <MenuItem value="energy">Energie</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          {/* Aktive Filter anzeigen */}
          {(searchTerm || selectedElement) && (
            <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {searchTerm && (
                <Chip
                  label={`Suche: "${searchTerm}"`}
                  onDelete={() => setSearchTerm('')}
                  sx={{
                    backgroundColor: 'rgba(255, 215, 0, 0.2)',
                    color: '#FFD700',
                    border: '1px solid rgba(255, 215, 0, 0.3)',
                  }}
                />
              )}
              {selectedElement && (
                <Chip
                  label={`Element: ${selectedElement}`}
                  onDelete={() => setSelectedElement('')}
                  sx={{
                    backgroundColor: 'rgba(255, 215, 0, 0.2)',
                    color: '#FFD700',
                    border: '1px solid rgba(255, 215, 0, 0.3)',
                  }}
                />
              )}
            </Box>
          )}

          {/* Ergebnisse-Anzeige */}
          <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              {filteredPlanets.length} von {planets.length} Planeten
            </Typography>
            {filteredPlanets.length !== planets.length && (
              <Button
                size="small"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedElement('');
                }}
                sx={{
                  color: '#FFD700',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 215, 0, 0.1)',
                  },
                }}
              >
                Filter zurücksetzen
              </Button>
            )}
          </Box>
        </Paper>

        {/* Title */}
        <motion.div
          
          
          
        >
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h1" sx={{ fontWeight: 700, color: '#FFD700', mb: 2 }}>
              Die Planeten im Human Design
            </Typography>
            <Typography variant="h5" sx={{ color: 'rgba(255,255,255,0.8)', fontStyle: 'italic', mb: 2 }}>
              Entdecke die kosmischen Kräfte, die dein Leben prägen
            </Typography>
            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)', maxWidth: '800px', mx: 'auto' }}>
              Jeder Planet im Human Design System repräsentiert eine spezifische Energie und Funktion in unserem Leben. 
              Von der Sonne als Zentrum unseres Bewusstseins bis zu Chiron als dem verwundeten Heiler - 
              lerne die tiefe Bedeutung und Wirkung jedes Planeten kennen.
            </Typography>
          </Box>
        </motion.div>

        {/* Planets Grid */}
        <motion.div
          
          
          
        >
          <Grid container spacing={3}>
            {filteredPlanets.map((planet, index) => (
              <Grid item xs={12} sm={6} md={4} key={planet.id}>
                <motion.div
                  
                  
                  
                  whileHover={{ y: -5 }}
                >
                  <Card sx={{
                    background: `linear-gradient(135deg, ${planet.color}15 0%, rgba(11,13,18,0.95) 50%, rgba(26,31,43,0.98) 100%)`,
                    backdropFilter: 'blur(20px)',
                    borderRadius: 4,
                    border: `2px solid ${planet.color}40`,
                    boxShadow: `0 8px 32px ${planet.color}30, inset 0 1px 0 ${planet.color}60`,
                    height: '100%',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    position: 'relative',
                    overflow: 'hidden',
                    '&:hover': {
                      boxShadow: `0 20px 60px ${planet.color}50, inset 0 1px 0 ${planet.color}80`,
                      transform: 'translateY(-8px) scale(1.02)',
                      border: `2px solid ${planet.color}80`
                    },
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '2px',
                      background: planet.gradient || `linear-gradient(90deg, ${planet.color} 0%, ${planet.color}80 100%)`,
                      opacity: 0.8
                    }
                  }}>
                    <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Box sx={{
                          width: 50,
                          height: 50,
                          borderRadius: '50%',
                          background: `linear-gradient(45deg, ${planet.color}, ${planet.color}80)`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mr: 2,
                          color: '#000',
                          fontSize: '24px',
                          fontWeight: 'bold'
                        }}>
                          {planet.icon}
                        </Box>
                        <Box>
                          <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                            {planet.name}
                          </Typography>
                          <Typography variant="body2" sx={{ color: planet.color, fontWeight: 500 }}>
                            {planet.mythology}
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Typography variant="body2" sx={{ 
                        color: 'rgba(255,255,255,0.8)', 
                        mb: 2, 
                        flexGrow: 1,
                        lineHeight: 1.6
                      }}>
                        {planet.description}
                      </Typography>

                      {/* Zusätzliche Informationen */}
                      <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {planet.energy && (
                          <Box sx={{
                            px: 1.5,
                            py: 0.5,
                            borderRadius: 2,
                            background: `${planet.color}20`,
                            border: `1px solid ${planet.color}40`
                          }}>
                            <Typography variant="caption" sx={{ color: planet.color, fontWeight: 600 }}>
                              {planet.energy}
                            </Typography>
                          </Box>
                        )}
                        {planet.element && (
                          <Box sx={{
                            px: 1.5,
                            py: 0.5,
                            borderRadius: 2,
                            background: `${planet.color}15`,
                            border: `1px solid ${planet.color}30`
                          }}>
                            <Typography variant="caption" sx={{ color: planet.color, fontWeight: 500 }}>
                              {planet.element}
                            </Typography>
                          </Box>
                        )}
                      </Box>

                      {planet.influence && (
                        <Typography variant="caption" sx={{ 
                          color: `${planet.color}80`, 
                          mb: 2,
                          fontStyle: 'italic',
                          display: 'block'
                        }}>
                          Einfluss: {planet.influence}
                        </Typography>
                      )}
                      
                      <Button
                        component={Link}
                        href={planet.path}
                        fullWidth
                        variant="outlined"
                        sx={{
                          borderColor: planet.color,
                          color: planet.color,
                          '&:hover': {
                            borderColor: planet.color,
                            backgroundColor: `${planet.color}20`,
                            boxShadow: `0 0 20px ${planet.color}40`
                          }
                        }}
                      >
                        {planet.name} erkunden
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>

        {/* Footer Info */}
        <motion.div
          
          
          
        >
          <Card sx={{
            background: 'linear-gradient(135deg, rgba(11,13,18,0.9) 0%, rgba(26,31,43,0.95) 100%)',
            backdropFilter: 'blur(20px)',
            borderRadius: 3,
            border: '1px solid #FFD700',
            boxShadow: '0 8px 32px rgba(255, 215, 0, 0.2)',
            p: 3,
            mt: 4
          }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" sx={{ color: '#FFD700', fontWeight: 600, mb: 2 }}>
                🌟 Die Planeten als kosmische Lehrer 🌟
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.6 }}>
                Jeder Planet in deinem Human Design Chart ist ein kosmischer Lehrer, der dir spezifische Lektionen und Gaben bringt. 
                Von der Sonne, die dir zeigt, wer du wirklich bist, bis zu Chiron, der dir hilft, deine Wunden zu heilen und andere zu heilen - 
                die Planeten sind deine spirituellen Begleiter auf dem Weg der Selbsterkenntnis und des Wachstums.
              </Typography>
            </Box>
          </Card>
        </motion.div>

        {/* Keine Ergebnisse */}
        {filteredPlanets.length === 0 && (
          <motion.div
            
            
            
          >
            <Box sx={{
              textAlign: 'center',
              py: 8,
              px: 4
            }}>
              <Typography variant="h5" sx={{ 
                color: 'rgba(255, 255, 255, 0.7)',
                mb: 2
              }}>
                🔍 Keine Planeten gefunden
              </Typography>
              <Typography variant="body1" sx={{ 
                color: 'rgba(255, 255, 255, 0.5)',
                mb: 3
              }}>
                Versuche es mit anderen Suchbegriffen oder ändere deine Filter
              </Typography>
              <Button
                variant="outlined"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedElement('');
                }}
                sx={{
                  color: '#FFD700',
                  borderColor: '#FFD700',
                  '&:hover': {
                    borderColor: '#FFD700',
                    backgroundColor: 'rgba(255, 215, 0, 0.1)',
                  },
                }}
              >
                Alle Filter zurücksetzen
              </Button>
            </Box>
          </motion.div>
        )}
      </Container>
    </Box>
  );
}
