'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Box,
  Button,
  Grid,
  Chip,
  Divider,
  Alert,
  CircularProgress,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Cross, 
  Star, 
  Target, 
  Heart, 
  Brain, 
  Zap, 
  Crown, 
  Shield,
  ChevronDown,
  Calculator,
  Search,
  Info
} from 'lucide-react';

interface IncarnationCross {
  cross_name: string;
  cross_type: string;
  sun_gate: number;
  earth_gate: number;
  sun_line: number;
  earth_line: number;
  description: string;
  life_theme: string;
  purpose: string;
  challenges: string;
  gifts: string;
  affirmation: string;
}

// Erweiterte Inkarnationskreuze mit Kategorien
const knownCrosses: IncarnationCross[] = [
  // Führungskreuze
  {
    cross_name: "Rahmen des Bewusstseins",
    cross_type: "Führungskreuz",
    sun_gate: 1,
    earth_gate: 2,
    sun_line: 1,
    earth_line: 1,
    description: "Das Inkarnationskreuz des Bewusstseins und der Führung",
    life_theme: "Führung durch Bewusstsein und Kreativität",
    purpose: "Andere durch authentischen Ausdruck und natürliche Führung zu inspirieren",
    challenges: "Sich selbst treu bleiben, ohne sich anzupassen",
    gifts: "Kreative Führung, authentischer Ausdruck, magnetische Präsenz",
    affirmation: "Ich führe durch mein authentisches Sein"
  },
  {
    cross_name: "Rahmen der Führung",
    cross_type: "Führungskreuz",
    sun_gate: 7,
    earth_gate: 13,
    sun_line: 1,
    earth_line: 1,
    description: "Das Inkarnationskreuz der natürlichen Führung und Zusammenarbeit",
    life_theme: "Führung durch Zusammenarbeit und Gemeinschaft",
    purpose: "Andere durch natürliche Führung und Zusammenarbeit zu inspirieren",
    challenges: "Geduld mit anderen zu haben",
    gifts: "Natürliche Führung, Zusammenarbeit, Gemeinschaftsgeist",
    affirmation: "Ich führe durch Zusammenarbeit und Gemeinschaft"
  },
  {
    cross_name: "Rahmen der Autorität",
    cross_type: "Führungskreuz",
    sun_gate: 10,
    earth_gate: 15,
    sun_line: 1,
    earth_line: 1,
    description: "Das Inkarnationskreuz der natürlichen Autorität und Individualität",
    life_theme: "Führung durch Individualität und natürliche Autorität",
    purpose: "Andere durch natürliche Autorität und Individualität zu inspirieren",
    challenges: "Sich selbst zu lieben und zu akzeptieren",
    gifts: "Natürliche Autorität, Individualität, Selbstliebe",
    affirmation: "Ich führe durch meine natürliche Autorität"
  },

  // Transformationskreuze
  {
    cross_name: "Rahmen der Transformation",
    cross_type: "Transformationskreuz",
    sun_gate: 3,
    earth_gate: 50,
    sun_line: 1,
    earth_line: 1,
    description: "Das Inkarnationskreuz der Transformation und des Schutzes",
    life_theme: "Transformation durch Chaos und Schutz",
    purpose: "Andere durch Transformation und Schutz zu führen",
    challenges: "Chaos als natürlichen Prozess zu akzeptieren",
    gifts: "Transformative Kraft, Schutz, emotionale Tiefe",
    affirmation: "Ich transformiere durch mein Sein"
  },
  {
    cross_name: "Rahmen der Regeneration",
    cross_type: "Transformationskreuz",
    sun_gate: 4,
    earth_gate: 49,
    sun_line: 1,
    earth_line: 1,
    description: "Das Inkarnationskreuz der Regeneration und des Schutzes",
    life_theme: "Transformation durch Regeneration und Schutz",
    purpose: "Andere durch Regeneration und Schutz zu führen",
    challenges: "Geduld mit dem Transformationsprozess zu haben",
    gifts: "Regenerative Kraft, Schutz, Geduld",
    affirmation: "Ich regeneriere und schütze durch mein Sein"
  },

  // Liebeskreuze
  {
    cross_name: "Rahmen der Liebe",
    cross_type: "Liebeskreuz",
    sun_gate: 25,
    earth_gate: 46,
    sun_line: 1,
    earth_line: 1,
    description: "Das Inkarnationskreuz der bedingungslosen Liebe und der Freude",
    life_theme: "Liebe und Freude durch Authentizität",
    purpose: "Andere durch bedingungslose Liebe und Freude zu inspirieren",
    challenges: "Liebe ohne Bedingungen zu geben",
    gifts: "Bedingungslose Liebe, Freude, Authentizität",
    affirmation: "Ich liebe bedingungslos und bringe Freude"
  },
  {
    cross_name: "Rahmen der Herzensliebe",
    cross_type: "Liebeskreuz",
    sun_gate: 26,
    earth_gate: 45,
    sun_line: 1,
    earth_line: 1,
    description: "Das Inkarnationskreuz der Herzensliebe und des Wohlstands",
    life_theme: "Liebe durch Herzenskraft und Wohlstand",
    purpose: "Andere durch Herzensliebe und Wohlstand zu inspirieren",
    challenges: "Liebe und Wohlstand zu teilen",
    gifts: "Herzensliebe, Wohlstand, Großzügigkeit",
    affirmation: "Ich teile Liebe und Wohlstand bedingungslos"
  },

  // Weisheitskreuze
  {
    cross_name: "Rahmen der Weisheit",
    cross_type: "Weisheitskreuz",
    sun_gate: 17,
    earth_gate: 18,
    sun_line: 1,
    earth_line: 1,
    description: "Das Inkarnationskreuz der Weisheit und der Korrektur",
    life_theme: "Weisheit durch Beobachtung und Korrektur",
    purpose: "Andere durch Weisheit und Korrektur zu führen",
    challenges: "Weisheit ohne Urteil zu teilen",
    gifts: "Weisheit, Korrektur, Klarheit",
    affirmation: "Ich teile Weisheit mit Klarheit und Mitgefühl"
  },
  {
    cross_name: "Rahmen der Erkenntnis",
    cross_type: "Weisheitskreuz",
    sun_gate: 20,
    earth_gate: 34,
    sun_line: 1,
    earth_line: 1,
    description: "Das Inkarnationskreuz der Erkenntnis und der Kraft",
    life_theme: "Weisheit durch Erkenntnis und Kraft",
    purpose: "Andere durch Erkenntnis und Kraft zu führen",
    challenges: "Erkenntnis mit Demut zu teilen",
    gifts: "Erkenntnis, Kraft, Demut",
    affirmation: "Ich teile Erkenntnis mit Kraft und Demut"
  },

  // Kreativkreuze
  {
    cross_name: "Rahmen der Kreativität",
    cross_type: "Kreativkreuz",
    sun_gate: 5,
    earth_gate: 35,
    sun_line: 1,
    earth_line: 1,
    description: "Das Inkarnationskreuz der Kreativität und des Wartens",
    life_theme: "Kreativität durch Warten und Rhythmus",
    purpose: "Andere durch Kreativität und Rhythmus zu inspirieren",
    challenges: "Geduld mit dem kreativen Prozess zu haben",
    gifts: "Kreativität, Rhythmus, Geduld",
    affirmation: "Ich erschaffe durch Geduld und Rhythmus"
  },
  {
    cross_name: "Rahmen der Inspiration",
    cross_type: "Kreativkreuz",
    sun_gate: 6,
    earth_gate: 36,
    sun_line: 1,
    earth_line: 1,
    description: "Das Inkarnationskreuz der Inspiration und der Krise",
    life_theme: "Kreativität durch Inspiration und Krise",
    purpose: "Andere durch Inspiration und Krisenbewältigung zu führen",
    challenges: "Krisen als Wachstumschancen zu sehen",
    gifts: "Inspiration, Krisenbewältigung, Wachstum",
    affirmation: "Ich inspiriere durch Krisen und Wachstum"
  },

  // Mystische Kreuze
  {
    cross_name: "Rahmen des Mystikers",
    cross_type: "Mystisches Kreuz",
    sun_gate: 12,
    earth_gate: 11,
    sun_line: 1,
    earth_line: 1,
    description: "Das Inkarnationskreuz des Mystikers und der Ruhe",
    life_theme: "Mystik durch Ruhe und Individualität",
    purpose: "Andere durch mystische Ruhe und Individualität zu inspirieren",
    challenges: "Ruhe in der Stille zu finden",
    gifts: "Mystische Ruhe, Individualität, Stille",
    affirmation: "Ich finde Ruhe in der mystischen Stille"
  },
  {
    cross_name: "Rahmen des Sehers",
    cross_type: "Mystisches Kreuz",
    sun_gate: 14,
    earth_gate: 8,
    sun_line: 1,
    earth_line: 1,
    description: "Das Inkarnationskreuz des Sehers und der Kraft",
    life_theme: "Mystik durch Sehen und Kraft",
    purpose: "Andere durch mystisches Sehen und Kraft zu führen",
    challenges: "Das Unsichtbare zu sehen",
    gifts: "Mystisches Sehen, Kraft, Vision",
    affirmation: "Ich sehe das Unsichtbare mit mystischer Kraft"
  }
];

// Farben für verschiedene Kreuz-Typen
const getCrossColor = (crossType: string): string => {
  switch (crossType) {
    case 'Führungskreuz':
      return '#8B5CF6'; // Lila
    case 'Transformationskreuz':
      return '#EF4444'; // Rot
    case 'Liebeskreuz':
      return '#EC4899'; // Pink
    case 'Weisheitskreuz':
      return '#3B82F6'; // Blau
    case 'Kreativkreuz':
      return '#F59E0B'; // Orange
    case 'Mystisches Kreuz':
      return '#8B5CF6'; // Lila
    default:
      return '#6B7280'; // Grau
  }
};

export default function IncarnationCrossPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [calculatedCross, setCalculatedCross] = useState<IncarnationCross | null>(null);
  const [expandedCross, setExpandedCross] = useState<number | false>(false);
  
  // Filter und Suche
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Alle');
  const [sortBy, setSortBy] = useState('name');
  
  // Formular für Kreuz-Berechnung
  const [calculationForm, setCalculationForm] = useState({
    sunGate: '',
    earthGate: '',
    sunLine: '',
    earthLine: ''
  });

  // Kategorien für Filter
  const categories = ['Alle', 'Führungskreuz', 'Transformationskreuz', 'Liebeskreuz', 'Weisheitskreuz', 'Kreativkreuz', 'Mystisches Kreuz'];

  // Gefilterte und sortierte Kreuze
  const filteredCrosses = knownCrosses
    .filter(cross => {
      const matchesSearch = cross.cross_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           cross.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           cross.life_theme.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'Alle' || cross.cross_type === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.cross_name.localeCompare(b.cross_name);
        case 'type':
          return a.cross_type.localeCompare(b.cross_type);
        case 'sun_gate':
          return a.sun_gate - b.sun_gate;
        default:
          return 0;
      }
    });

  const calculateIncarnationCross = () => {
    if (!calculationForm.sunGate || !calculationForm.earthGate || 
        !calculationForm.sunLine || !calculationForm.earthLine) {
      setError('Bitte fülle alle Felder aus');
      return;
    }

    setLoading(true);
    
    // Simuliere Berechnung
    setTimeout(() => {
      const sunGate = parseInt(calculationForm.sunGate);
      const earthGate = parseInt(calculationForm.earthGate);
      const sunLine = parseInt(calculationForm.sunLine);
      const earthLine = parseInt(calculationForm.earthLine);

      // Suche nach bekanntem Kreuz
      const knownCross = knownCrosses.find(cross => 
        cross.sun_gate === sunGate && 
        cross.earth_gate === earthGate && 
        cross.sun_line === sunLine && 
        cross.earth_line === earthLine
      );

      if (knownCross) {
        setCalculatedCross(knownCross);
      } else {
        // Erstelle generisches Kreuz
        setCalculatedCross({
          cross_name: `Kreuz ${sunGate}.${sunLine}/${earthGate}.${earthLine}`,
          cross_type: "Incarnation Cross",
          sun_gate: sunGate,
          earth_gate: earthGate,
          sun_line: sunLine,
          earth_line: earthLine,
          description: `Einzigartiges Inkarnationskreuz mit Sonne in Tor ${sunGate}, Linie ${sunLine} und Erde in Tor ${earthGate}, Linie ${earthLine}`,
          life_theme: "Individuelle Lebensaufgabe",
          purpose: "Deine einzigartige Lebensaufgabe zu erfüllen",
          challenges: "Deine wahre Natur zu leben",
          gifts: "Einzigartige Gaben und Talente",
          affirmation: "Ich lebe meine einzigartige Lebensaufgabe"
        });
      }
      
      setError(null);
      setLoading(false);
    }, 1000);
  };

  const handleInputChange = (field: string, value: string) => {
    setCalculationForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <motion.div
        
        
        
      >
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
            <Cross size={48} color="#8B5CF6" />
            <Typography variant="h2" component="h1" sx={{ 
              ml: 2, 
              fontWeight: 'bold',
              background: 'linear-gradient(45deg, #8B5CF6, #EC4899)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Inkarnationskreuz
            </Typography>
          </Box>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            Entdecke dein einzigartiges Inkarnationskreuz - die vier Tore, die deine Lebensaufgabe und dein höchstes Potenzial definieren
          </Typography>
        </Box>
      </motion.div>

      {/* Fehler-Anzeige */}
      {error && (
        <motion.div
          
          
          
        >
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        </motion.div>
      )}

      {/* Berechnungsformular */}
      <motion.div
        
        
        
      >
        <Card sx={{ mb: 4, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Calculator size={24} color="white" />
              <Typography variant="h5" sx={{ ml: 2, color: 'white', fontWeight: 'bold' }}>
                Inkarnationskreuz berechnen
              </Typography>
            </Box>
            
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label="Sonne Tor"
                  type="number"
                  value={calculationForm.sunGate}
                  onChange={(e) => handleInputChange('sunGate', e.target.value)}
                  inputProps={{ min: 1, max: 64 }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      '& fieldset': {
                        borderColor: 'rgba(255,255,255,0.3)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(255,255,255,0.5)',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'white',
                    },
                    '& .MuiOutlinedInput-input': {
                      color: 'white',
                    }
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label="Erde Tor"
                  type="number"
                  value={calculationForm.earthGate}
                  onChange={(e) => handleInputChange('earthGate', e.target.value)}
                  inputProps={{ min: 1, max: 64 }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      '& fieldset': {
                        borderColor: 'rgba(255,255,255,0.3)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(255,255,255,0.5)',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'white',
                    },
                    '& .MuiOutlinedInput-input': {
                      color: 'white',
                    }
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label="Sonne Linie"
                  type="number"
                  value={calculationForm.sunLine}
                  onChange={(e) => handleInputChange('sunLine', e.target.value)}
                  inputProps={{ min: 1, max: 6 }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      '& fieldset': {
                        borderColor: 'rgba(255,255,255,0.3)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(255,255,255,0.5)',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'white',
                    },
                    '& .MuiOutlinedInput-input': {
                      color: 'white',
                    }
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label="Erde Linie"
                  type="number"
                  value={calculationForm.earthLine}
                  onChange={(e) => handleInputChange('earthLine', e.target.value)}
                  inputProps={{ min: 1, max: 6 }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      '& fieldset': {
                        borderColor: 'rgba(255,255,255,0.3)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(255,255,255,0.5)',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'white',
                    },
                    '& .MuiOutlinedInput-input': {
                      color: 'white',
                    }
                  }}
                />
              </Grid>
            </Grid>
            
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Button
                variant="contained"
                size="large"
                onClick={calculateIncarnationCross}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : <Calculator />}
                sx={{
                  background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #FF5252, #26A69A)',
                  },
                  px: 4,
                  py: 1.5
                }}
              >
                {loading ? 'Berechne...' : 'Inkarnationskreuz berechnen'}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </motion.div>

      {/* Berechnetes Inkarnationskreuz */}
      {calculatedCross && (
        <motion.div
          
          
          
        >
          <Card sx={{ mb: 4, border: '2px solid #8B5CF6' }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Star size={24} color="#8B5CF6" />
                <Typography variant="h5" sx={{ ml: 2, fontWeight: 'bold', color: '#8B5CF6' }}>
                  Dein Inkarnationskreuz
                </Typography>
              </Box>
              
              <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold' }}>
                {calculatedCross.cross_name}
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
                <Chip 
                  label={`Sonne: Tor ${calculatedCross.sun_gate}.${calculatedCross.sun_line}`} 
                  color="primary" 
                  variant="outlined" 
                />
                <Chip 
                  label={`Erde: Tor ${calculatedCross.earth_gate}.${calculatedCross.earth_line}`} 
                  color="secondary" 
                  variant="outlined" 
                />
              </Box>
              
              <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
                {calculatedCross.description}
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Box sx={{ p: 2, backgroundColor: '#F3F4F6', borderRadius: 2 }}>
                    <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold', color: '#8B5CF6' }}>
                      Lebensaufgabe
                    </Typography>
                    <Typography variant="body2">
                      {calculatedCross.life_theme}
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Box sx={{ p: 2, backgroundColor: '#F3F4F6', borderRadius: 2 }}>
                    <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold', color: '#8B5CF6' }}>
                      Zweck
                    </Typography>
                    <Typography variant="body2">
                      {calculatedCross.purpose}
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Box sx={{ p: 2, backgroundColor: '#FEF2F2', borderRadius: 2 }}>
                    <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold', color: '#DC2626' }}>
                      Herausforderungen
                    </Typography>
                    <Typography variant="body2">
                      {calculatedCross.challenges}
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Box sx={{ p: 2, backgroundColor: '#F0FDF4', borderRadius: 2 }}>
                    <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold', color: '#16A34A' }}>
                      Gaben
                    </Typography>
                    <Typography variant="body2">
                      {calculatedCross.gifts}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
              
              <Box sx={{ mt: 3, p: 2, backgroundColor: '#8B5CF6', borderRadius: 2 }}>
                <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold', color: 'white' }}>
                  Affirmation
                </Typography>
                <Typography variant="body1" sx={{ color: 'white', fontStyle: 'italic' }}>
                  "{calculatedCross.affirmation}"
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Filter und Suche */}
      <motion.div
        
        
        
      >
        <Card sx={{ mb: 4, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Search size={24} color="white" />
              <Typography variant="h5" sx={{ ml: 2, color: 'white', fontWeight: 'bold' }}>
                Kreuze durchsuchen & filtern
              </Typography>
            </Box>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Suche nach Namen oder Beschreibung"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      '& fieldset': {
                        borderColor: 'rgba(255,255,255,0.3)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(255,255,255,0.5)',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'white',
                    },
                    '& .MuiOutlinedInput-input': {
                      color: 'white',
                    }
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: 'white' }}>Kategorie</InputLabel>
                  <Select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    sx={{
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      color: 'white',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255,255,255,0.3)',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255,255,255,0.5)',
                      },
                      '& .MuiSvgIcon-root': {
                        color: 'white',
                      }
                    }}
                  >
                    {categories.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: 'white' }}>Sortieren nach</InputLabel>
                  <Select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    sx={{
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      color: 'white',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255,255,255,0.3)',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255,255,255,0.5)',
                      },
                      '& .MuiSvgIcon-root': {
                        color: 'white',
                      }
                    }}
                  >
                    <MenuItem value="name">Name</MenuItem>
                    <MenuItem value="type">Kategorie</MenuItem>
                    <MenuItem value="sun_gate">Sonne Tor</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            
            <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
              <Chip 
                label={`${filteredCrosses.length} Kreuze gefunden`} 
                color="primary" 
                variant="outlined"
                sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.5)' }}
              />
              {selectedCategory !== 'Alle' && (
                <Chip 
                  label={`Kategorie: ${selectedCategory}`} 
                  color="secondary" 
                  variant="outlined"
                  sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.5)' }}
                />
              )}
            </Box>
          </CardContent>
        </Card>
      </motion.div>

      {/* Bekannte Inkarnationskreuze */}
      <motion.div
        
        
        
      >
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
          Bekannte Inkarnationskreuze ({filteredCrosses.length})
        </Typography>
        
        <Grid container spacing={3}>
          {filteredCrosses.map((cross, index) => (
            <Grid item xs={12} md={6} lg={4} key={index}>
              <motion.div
                
                
                
                whileHover={{ y: -5 }}
              >
                <Card sx={{ 
                  height: '100%',
                  background: `linear-gradient(135deg, ${getCrossColor(cross.cross_type)}15 0%, rgba(11,13,18,0.95) 50%, rgba(26,31,43,0.98) 100%)`,
                  backdropFilter: 'blur(20px)',
                  borderRadius: 4,
                  border: `2px solid ${getCrossColor(cross.cross_type)}40`,
                  boxShadow: `0 8px 32px ${getCrossColor(cross.cross_type)}30, inset 0 1px 0 ${getCrossColor(cross.cross_type)}60`,
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative',
                  overflow: 'hidden',
                  '&:hover': {
                    boxShadow: `0 20px 60px ${getCrossColor(cross.cross_type)}50, inset 0 1px 0 ${getCrossColor(cross.cross_type)}80`,
                    transform: 'translateY(-8px) scale(1.02)',
                    border: `2px solid ${getCrossColor(cross.cross_type)}80`
                  },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '3px',
                    background: `linear-gradient(90deg, ${getCrossColor(cross.cross_type)} 0%, ${getCrossColor(cross.cross_type)}80 100%)`,
                    opacity: 0.8
                  }
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Box sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        background: `linear-gradient(45deg, ${getCrossColor(cross.cross_type)}, ${getCrossColor(cross.cross_type)}80)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 2,
                        color: '#000',
                        fontSize: '18px',
                        fontWeight: 'bold'
                      }}>
                        ✚
                      </Box>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'white' }}>
                          {cross.cross_name}
                        </Typography>
                        <Chip 
                          label={cross.cross_type} 
                          size="small" 
                          sx={{ 
                            backgroundColor: `${getCrossColor(cross.cross_type)}20`,
                            color: getCrossColor(cross.cross_type),
                            border: `1px solid ${getCrossColor(cross.cross_type)}40`,
                            fontWeight: 'bold'
                          }}
                        />
                      </Box>
                    </Box>
                    
                    <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                      <Chip 
                        label={`☉ ${cross.sun_gate}.${cross.sun_line}`} 
                        size="small" 
                        sx={{ 
                          backgroundColor: '#FFD70020',
                          color: '#FFD700',
                          border: '1px solid #FFD70040'
                        }}
                      />
                      <Chip 
                        label={`🌍 ${cross.earth_gate}.${cross.earth_line}`} 
                        size="small" 
                        sx={{ 
                          backgroundColor: '#32CD3220',
                          color: '#32CD32',
                          border: '1px solid #32CD3240'
                        }}
                      />
                    </Box>
                    
                    <Typography variant="body2" sx={{ mb: 2, color: 'rgba(255,255,255,0.8)', lineHeight: 1.6 }}>
                      {cross.description}
                    </Typography>
                    
                    <Box sx={{ p: 2, backgroundColor: `${getCrossColor(cross.cross_type)}15`, borderRadius: 2, mb: 2 }}>
                      <Typography variant="body2" sx={{ fontWeight: 'bold', color: getCrossColor(cross.cross_type), mb: 1 }}>
                        Lebensaufgabe:
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                        {cross.life_theme}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      <Chip 
                        label="Gaben" 
                        size="small" 
                        sx={{ 
                          backgroundColor: '#10B98120',
                          color: '#10B981',
                          border: '1px solid #10B98140'
                        }}
                      />
                      <Chip 
                        label="Herausforderungen" 
                        size="small" 
                        sx={{ 
                          backgroundColor: '#EF444420',
                          color: '#EF4444',
                          border: '1px solid #EF444440'
                        }}
                      />
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </motion.div>
    </Container>
  );
}
