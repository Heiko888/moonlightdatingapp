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

// Bekannte Inkarnationskreuze
const knownCrosses: IncarnationCross[] = [
  {
    cross_name: "Rahmen des Bewusstseins",
    cross_type: "Incarnation Cross",
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
    cross_name: "Rahmen der Transformation",
    cross_type: "Incarnation Cross",
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
    cross_name: "Rahmen der Liebe",
    cross_type: "Incarnation Cross",
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
    cross_name: "Rahmen der Weisheit",
    cross_type: "Incarnation Cross",
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
  }
];

export default function IncarnationCrossPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [calculatedCross, setCalculatedCross] = useState<IncarnationCross | null>(null);
  const [expandedCross, setExpandedCross] = useState<number | false>(false);
  
  // Formular für Kreuz-Berechnung
  const [calculationForm, setCalculationForm] = useState({
    sunGate: '',
    earthGate: '',
    sunLine: '',
    earthLine: ''
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
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
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
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        </motion.div>
      )}

      {/* Berechnungsformular */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
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

      {/* Bekannte Inkarnationskreuze */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
          Bekannte Inkarnationskreuze
        </Typography>
        
        <Grid container spacing={3}>
          {knownCrosses.map((cross, index) => (
            <Grid item xs={12} md={6} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card sx={{ 
                  height: '100%',
                  transition: 'transform 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 25px rgba(139, 92, 246, 0.15)'
                  }
                }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                      {cross.cross_name}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                      <Chip 
                        label={`Sonne: ${cross.sun_gate}.${cross.sun_line}`} 
                        size="small" 
                        color="primary" 
                        variant="outlined" 
                      />
                      <Chip 
                        label={`Erde: ${cross.earth_gate}.${cross.earth_line}`} 
                        size="small" 
                        color="secondary" 
                        variant="outlined" 
                      />
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {cross.description}
                    </Typography>
                    
                    <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#8B5CF6' }}>
                      {cross.life_theme}
                    </Typography>
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