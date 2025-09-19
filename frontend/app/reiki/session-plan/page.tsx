"use client";
import React, { useState } from 'react';
import { Container, Typography, Card, CardContent, Box, Button, Grid, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { motion } from 'framer-motion';
import { Sparkles, Calendar, Clock, Target, Heart, Brain, Zap, ArrowRight } from 'lucide-react';
import AnimatedStars from '@/components/AnimatedStars';

export default function ReikiSessionPlanPage() {
  const [formData, setFormData] = useState({
    name: '',
    birthDate: '',
    birthTime: '',
    birthPlace: '',
    sessionType: 'general',
    duration: '60',
    focus: 'stress'
  });
  const [sessionPlan, setSessionPlan] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const sessionTypes = [
    { value: 'general', label: 'Allgemeine Heilung' },
    { value: 'emotional', label: 'Emotionale Heilung' },
    { value: 'physical', label: 'Körperliche Heilung' },
    { value: 'spiritual', label: 'Spirituelle Entwicklung' },
    { value: 'chakra', label: 'Chakra-Ausgleich' }
  ];

  const focusAreas = [
    { value: 'stress', label: 'Stressabbau' },
    { value: 'pain', label: 'Schmerzlinderung' },
    { value: 'sleep', label: 'Schlafverbesserung' },
    { value: 'energy', label: 'Energieausgleich' },
    { value: 'relationships', label: 'Beziehungen' },
    { value: 'creativity', label: 'Kreativität' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      setSessionPlan({
        duration: formData.duration,
        symbols: ['Cho Ku Rei', 'Sei He Ki'],
        handPositions: [
          'Kopf (Krone)',
          'Herz-Chakra',
          'Solarplexus',
          'Hände'
        ],
        meditation: 'Visualisiere goldenes Licht, das durch deinen Körper fließt',
        affirmations: [
          'Ich bin offen für Heilung',
          'Meine Energie fließt frei',
          'Ich bin in Balance'
        ],
        followUp: 'Trinke viel Wasser und ruhe dich aus'
      });
      setIsLoading(false);
    }, 2000);
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
      overflow: 'hidden'
    }}>
      <AnimatedStars />
      
      <Container maxWidth="lg" sx={{ py: 8, position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 4 }}>
              <Calendar size={48} color="#FFD700" />
              <Typography variant="h1" sx={{
                color: '#FFD700',
                fontWeight: 800,
                textShadow: '0 4px 20px rgba(255, 215, 0, 0.3)',
                fontSize: { xs: '2.5rem', md: '4rem' }
              }}>
                Reiki Session Plan
              </Typography>
              <Calendar size={48} color="#FFD700" />
            </Box>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
            >
              <Typography variant="h5" sx={{
                color: 'rgba(255,255,255,0.9)',
                fontSize: { xs: '1.2rem', md: '1.5rem' },
                maxWidth: 800,
                mx: 'auto',
                lineHeight: 1.6
              }}>
                Erstelle einen individuellen Reiki-Session-Plan basierend auf deinen Bedürfnissen
              </Typography>
            </motion.div>
          </Box>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <Card sx={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            borderRadius: 4,
            boxShadow: '0 25px 50px rgba(0,0,0,0.2)',
            border: '1px solid rgba(255,255,255,0.2)',
            mb: 6
          }}>
            <CardContent sx={{ p: 6 }}>
              <Typography variant="h4" sx={{ 
                color: '#FFD700', 
                textAlign: 'center', 
                fontWeight: 700, 
                mb: 4 
              }}>
                Session-Details
              </Typography>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      required
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          color: 'white',
                          '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                          '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                          '&.Mui-focused fieldset': { borderColor: '#FFD700' }
                        },
                        '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
                        '& .MuiInputLabel-root.Mui-focused': { color: '#FFD700' }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Geburtsdatum"
                      type="date"
                      value={formData.birthDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, birthDate: e.target.value }))}
                      required
                      InputLabelProps={{ shrink: true }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          color: 'white',
                          '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                          '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                          '&.Mui-focused fieldset': { borderColor: '#FFD700' }
                        },
                        '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
                        '& .MuiInputLabel-root.Mui-focused': { color: '#FFD700' }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Geburtszeit"
                      type="time"
                      value={formData.birthTime}
                      onChange={(e) => setFormData(prev => ({ ...prev, birthTime: e.target.value }))}
                      required
                      InputLabelProps={{ shrink: true }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          color: 'white',
                          '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                          '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                          '&.Mui-focused fieldset': { borderColor: '#FFD700' }
                        },
                        '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
                        '& .MuiInputLabel-root.Mui-focused': { color: '#FFD700' }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Geburtsort"
                      value={formData.birthPlace}
                      onChange={(e) => setFormData(prev => ({ ...prev, birthPlace: e.target.value }))}
                      required
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          color: 'white',
                          '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                          '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                          '&.Mui-focused fieldset': { borderColor: '#FFD700' }
                        },
                        '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
                        '& .MuiInputLabel-root.Mui-focused': { color: '#FFD700' }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel sx={{ color: 'rgba(255,255,255,0.7)' }}>Session-Typ</InputLabel>
                      <Select
                        value={formData.sessionType}
                        onChange={(e) => setFormData(prev => ({ ...prev, sessionType: e.target.value }))}
                        sx={{
                          color: 'white',
                          '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.3)' },
                          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.5)' },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#FFD700' }
                        }}
                      >
                        {sessionTypes.map((type) => (
                          <MenuItem key={type.value} value={type.value}>
                            {type.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel sx={{ color: 'rgba(255,255,255,0.7)' }}>Dauer (Minuten)</InputLabel>
                      <Select
                        value={formData.duration}
                        onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                        sx={{
                          color: 'white',
                          '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.3)' },
                          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.5)' },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#FFD700' }
                        }}
                      >
                        <MenuItem value="30">30 Minuten</MenuItem>
                        <MenuItem value="45">45 Minuten</MenuItem>
                        <MenuItem value="60">60 Minuten</MenuItem>
                        <MenuItem value="90">90 Minuten</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel sx={{ color: 'rgba(255,255,255,0.7)' }}>Fokus-Bereich</InputLabel>
                      <Select
                        value={formData.focus}
                        onChange={(e) => setFormData(prev => ({ ...prev, focus: e.target.value }))}
                        sx={{
                          color: 'white',
                          '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.3)' },
                          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.5)' },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#FFD700' }
                        }}
                      >
                        {focusAreas.map((area) => (
                          <MenuItem key={area.value} value={area.value}>
                            {area.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        disabled={isLoading}
                        sx={{
                          background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                          color: '#1a1a2e',
                          fontWeight: 700,
                          px: 6,
                          py: 2,
                          borderRadius: 3,
                          fontSize: '1.2rem',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #FFA500 0%, #FFD700 100%)',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 12px 30px rgba(255, 215, 0, 0.3)'
                          }
                        }}
                      >
                        {isLoading ? 'Erstelle Plan...' : 'Session-Plan erstellen'} 
                        <ArrowRight size={24} style={{ marginLeft: 8 }} />
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Session Plan Results */}
        {sessionPlan && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <Card sx={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              borderRadius: 4,
              boxShadow: '0 25px 50px rgba(0,0,0,0.2)',
              border: '1px solid rgba(255,255,255,0.2)',
              mb: 6
            }}>
              <CardContent sx={{ p: 6 }}>
                <Typography variant="h3" sx={{ 
                  color: '#FFD700', 
                  textAlign: 'center', 
                  fontWeight: 700, 
                  mb: 4 
                }}>
                  Dein Reiki Session-Plan
                </Typography>
                
                <Grid container spacing={4}>
                  <Grid item xs={12} md={6}>
                    <Card sx={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      mb: 3
                    }}>
                      <CardContent>
                        <Typography variant="h6" sx={{ color: '#FFD700', mb: 2 }}>
                          <Clock size={20} style={{ marginRight: 8, verticalAlign: 'middle' }} />
                          Dauer: {sessionPlan.duration} Minuten
                        </Typography>
                      </CardContent>
                    </Card>
                    
                    <Card sx={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      mb: 3
                    }}>
                      <CardContent>
                        <Typography variant="h6" sx={{ color: '#FFD700', mb: 2 }}>
                          <Sparkles size={20} style={{ marginRight: 8, verticalAlign: 'middle' }} />
                          Empfohlene Symbole
                        </Typography>
                        {sessionPlan.symbols.map((symbol: string, index: number) => (
                          <Typography key={index} sx={{ color: 'rgba(255,255,255,0.8)' }}>
                            • {symbol}
                          </Typography>
                        ))}
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Card sx={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      mb: 3
                    }}>
                      <CardContent>
                        <Typography variant="h6" sx={{ color: '#FFD700', mb: 2 }}>
                          <Target size={20} style={{ marginRight: 8, verticalAlign: 'middle' }} />
                          Handpositionen
                        </Typography>
                        {sessionPlan.handPositions.map((position: string, index: number) => (
                          <Typography key={index} sx={{ color: 'rgba(255,255,255,0.8)' }}>
                            • {position}
                          </Typography>
                        ))}
                      </CardContent>
                    </Card>
                    
                    <Card sx={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255,255,255,0.1)'
                    }}>
                      <CardContent>
                        <Typography variant="h6" sx={{ color: '#FFD700', mb: 2 }}>
                          <Heart size={20} style={{ marginRight: 8, verticalAlign: 'middle' }} />
                          Affirmationen
                        </Typography>
                        {sessionPlan.affirmations.map((affirmation: string, index: number) => (
                          <Typography key={index} sx={{ color: 'rgba(255,255,255,0.8)' }}>
                            • {affirmation}
                          </Typography>
                        ))}
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </Container>
    </Box>
  );
}
