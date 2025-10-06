'use client';

import React, { useState, useMemo } from 'react';
import { 
  Box, 
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
  ArrowUpDown
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import UnifiedPageLayout from '@/components/UnifiedPageLayout';

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
      gradient: 'linear-gradient(135deg, #87CEEB 0%, #B0E0E6 50%, #E0F6FF 100%)',
      icon: '☿',
      description: 'Merkur regiert Kommunikation, Denken und Lernen. Er zeigt, wie wir Informationen verarbeiten und uns ausdrücken.',
      path: '/planets/mercury',
      energy: 'Kommunikation',
      element: 'Luft',
      influence: 'Denken & Ausdruck'
    },
    {
      id: 'venus',
      name: 'Venus',
      mythology: 'Die Göttin der Liebe',
      color: '#FFB6C1',
      gradient: 'linear-gradient(135deg, #FFB6C1 0%, #FFC0CB 50%, #FFE4E1 100%)',
      icon: '♀',
      description: 'Venus steht für Liebe, Schönheit und Harmonie. Sie zeigt, was wir wertschätzen und wie wir Beziehungen gestalten.',
      path: '/planets/venus',
      energy: 'Liebe',
      element: 'Erde',
      influence: 'Beziehungen & Werte'
    },
    {
      id: 'mars',
      name: 'Mars',
      mythology: 'Der Gott des Krieges',
      color: '#FF4500',
      gradient: 'linear-gradient(135deg, #FF4500 0%, #FF6347 50%, #FF7F50 100%)',
      icon: '♂',
      description: 'Mars repräsentiert Energie, Aktion und Durchsetzungskraft. Er zeigt, wie wir unsere Ziele verfolgen und Konflikte lösen.',
      path: '/planets/mars',
      energy: 'Aktion',
      element: 'Feuer',
      influence: 'Energie & Durchsetzung'
    },
    {
      id: 'jupiter',
      name: 'Jupiter',
      mythology: 'Der König der Götter',
      color: '#DAA520',
      gradient: 'linear-gradient(135deg, #DAA520 0%, #FFD700 50%, #FFF8DC 100%)',
      icon: '♃',
      description: 'Jupiter steht für Expansion, Weisheit und Optimismus. Er zeigt, wo wir wachsen und uns entwickeln können.',
      path: '/planets/jupiter',
      energy: 'Expansion',
      element: 'Feuer',
      influence: 'Wachstum & Weisheit'
    },
    {
      id: 'saturn',
      name: 'Saturn',
      mythology: 'Der Lehrer und Disziplin',
      color: '#708090',
      gradient: 'linear-gradient(135deg, #708090 0%, #A9A9A9 50%, #D3D3D3 100%)',
      icon: '♄',
      description: 'Saturn repräsentiert Struktur, Verantwortung und Grenzen. Er zeigt, wo wir lernen und reifen müssen.',
      path: '/planets/saturn',
      energy: 'Struktur',
      element: 'Erde',
      influence: 'Disziplin & Reife'
    },
    {
      id: 'uranus',
      name: 'Uranus',
      mythology: 'Der Revolutionär',
      color: '#4B0082',
      gradient: 'linear-gradient(135deg, #4B0082 0%, #8A2BE2 50%, #DDA0DD 100%)',
      icon: '♅',
      description: 'Uranus steht für Innovation, Freiheit und Veränderung. Er zeigt, wo wir uns von Konventionen befreien können.',
      path: '/planets/uranus',
      energy: 'Revolution',
      element: 'Luft',
      influence: 'Innovation & Freiheit'
    },
    {
      id: 'neptune',
      name: 'Neptun',
      mythology: 'Der Mystiker',
      color: '#4169E1',
      gradient: 'linear-gradient(135deg, #4169E1 0%, #6495ED 50%, #B0C4DE 100%)',
      icon: '♆',
      description: 'Neptun repräsentiert Spiritualität, Intuition und Illusion. Er zeigt, wo wir uns mit dem Göttlichen verbinden.',
      path: '/planets/neptune',
      energy: 'Spiritualität',
      element: 'Wasser',
      influence: 'Intuition & Mystik'
    },
    {
      id: 'pluto',
      name: 'Pluto',
      mythology: 'Der Transformator',
      color: '#8B0000',
      gradient: 'linear-gradient(135deg, #8B0000 0%, #DC143C 50%, #FF6347 100%)',
      icon: '♇',
      description: 'Pluto steht für Transformation, Macht und Regeneration. Er zeigt, wo wir uns tiefgreifend verändern müssen.',
      path: '/planets/pluto',
      energy: 'Transformation',
      element: 'Wasser',
      influence: 'Macht & Regeneration'
    },
    {
      id: 'chiron',
      name: 'Chiron',
      mythology: 'Der verwundete Heiler',
      color: '#9370DB',
      gradient: 'linear-gradient(135deg, #9370DB 0%, #BA55D3 50%, #DDA0DD 100%)',
      icon: '⚷',
      description: 'Chiron repräsentiert Heilung, Weisheit und Wunden. Er zeigt, wo wir andere heilen können, weil wir selbst verwundet wurden.',
      path: '/planets/chiron',
      energy: 'Heilung',
      element: 'Feuer',
      influence: 'Weisheit & Wunden'
    },
    {
      id: 'incarnation-cross',
      name: 'Inkarnationskreuz',
      mythology: 'Der Lebenszweck',
      color: '#FFD700',
      gradient: 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FF8C00 100%)',
      icon: '✚',
      description: 'Das Inkarnationskreuz zeigt deinen Lebenszweck und deine Bestimmung. Es ist der rote Faden durch dein Leben.',
      path: '/planets/incarnation-cross',
      energy: 'Bestimmung',
      element: 'Alle',
      influence: 'Lebenszweck & Bestimmung'
    }
  ];

  // Filter und Sortierung
  const filteredPlanets = useMemo(() => {
    let filtered = planets.filter(planet => 
      planet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      planet.mythology.toLowerCase().includes(searchTerm.toLowerCase()) ||
      planet.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (selectedElement) {
      filtered = filtered.filter(planet => planet.element === selectedElement);
    }

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

  const elements = [...new Set(planets.map(planet => planet.element))];

  return (
    <UnifiedPageLayout
      title="Die Planeten im Human Design"
      subtitle="Entdecke die kosmischen Kräfte, die dein Leben prägen"
      description="Jeder Planet im Human Design System repräsentiert eine spezifische Energie und Funktion in unserem Leben. Von der Sonne als Zentrum unseres Bewusstseins bis zu Chiron als dem verwundeten Heiler - lerne die tiefe Bedeutung und Wirkung jedes Planeten kennen."
    >
      {/* Search and Filter */}
      <Paper sx={{
        p: 3,
        mb: 4,
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: 3
      }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
          <TextField
            placeholder="Planeten suchen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={20} color="#FFD700" />
                </InputAdornment>
              ),
            }}
            sx={{
              flex: 1,
              minWidth: 200,
              '& .MuiOutlinedInput-root': {
                color: 'white',
                '& fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                },
                '&:hover fieldset': {
                  borderColor: '#FFD700',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#FFD700',
                },
              },
            }}
          />
          
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Element</InputLabel>
            <Select
              value={selectedElement}
              onChange={(e) => setSelectedElement(e.target.value)}
              sx={{
                color: 'white',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#FFD700',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#FFD700',
                },
              }}
            >
              <MenuItem value="">Alle Elemente</MenuItem>
              {elements.map(element => (
                <MenuItem key={element} value={element}>{element}</MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Sortieren</InputLabel>
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              sx={{
                color: 'white',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#FFD700',
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
          
          {(searchTerm || selectedElement) && (
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
              Filter zurücksetzen
            </Button>
          )}
        </Box>
      </Paper>

      {/* Planets Grid */}
      <Grid container spacing={3}>
        {filteredPlanets.map((planet, index) => (
          <Grid item xs={12} sm={6} md={4} key={planet.id}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <Card sx={{
                background: `linear-gradient(135deg, ${planet.color}15 0%, rgba(11,13,18,0.95) 50%, rgba(26,31,43,0.98) 100%)`,
                backdropFilter: 'blur(20px)',
                borderRadius: 4,
                border: `2px solid ${planet.color}40`,
                height: '100%',
                transition: 'all 0.3s ease',
                '&:hover': {
                  border: `2px solid ${planet.color}`,
                  boxShadow: `0 8px 32px ${planet.color}30`,
                  transform: 'translateY(-5px)',
                },
              }}>
                <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h4" sx={{ mr: 2, fontSize: '2rem' }}>
                      {planet.icon}
                    </Typography>
                    <Box>
                      <Typography variant="h6" sx={{ 
                        color: planet.color, 
                        fontWeight: 700,
                        mb: 0.5
                      }}>
                        {planet.name}
                      </Typography>
                      <Chip 
                        label={planet.element} 
                        size="small" 
                        sx={{ 
                          bgcolor: `${planet.color}20`,
                          color: planet.color,
                          border: `1px solid ${planet.color}40`,
                          fontSize: '0.75rem'
                        }} 
                      />
                    </Box>
                  </Box>
                  
                  <Typography variant="body2" sx={{ 
                    color: 'rgba(255,255,255,0.8)', 
                    mb: 2,
                    fontStyle: 'italic',
                    fontSize: '0.9rem'
                  }}>
                    {planet.mythology}
                  </Typography>
                  
                  <Typography variant="body2" sx={{ 
                    color: 'rgba(255,255,255,0.7)', 
                    mb: 3,
                    flexGrow: 1,
                    lineHeight: 1.5
                  }}>
                    {planet.description}
                  </Typography>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', display: 'block' }}>
                      Energie: {planet.energy}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', display: 'block' }}>
                      Einfluss: {planet.influence}
                    </Typography>
                  </Box>
                  
                  <Button
                    component={Link}
                    href={planet.path}
                    variant="contained"
                    fullWidth
                    sx={{
                      background: planet.gradient,
                      color: 'white',
                      fontWeight: 600,
                      py: 1.5,
                      borderRadius: 2,
                      '&:hover': {
                        background: planet.gradient,
                        transform: 'translateY(-2px)',
                        boxShadow: `0 4px 20px ${planet.color}40`,
                      },
                    }}
                  >
                    Mehr erfahren
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </UnifiedPageLayout>
  );
}
