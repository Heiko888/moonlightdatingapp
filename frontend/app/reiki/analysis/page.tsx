"use client";
import React, { useState, useEffect } from 'react';
import { Container, Typography, Card, CardContent, Box, Button, Grid, TextField, Alert } from '@mui/material';
import { motion } from 'framer-motion';
import { Sparkles, Brain, Heart, Zap, Eye, Crown, ArrowRight, Calendar, Clock, MapPin } from 'lucide-react';
import AnimatedStars from '@/components/AnimatedStars';

export default function ReikiAnalysisPage() {
  const [formData, setFormData] = useState({
    birthDate: '',
    birthTime: '',
    birthPlace: '',
    name: ''
  });
  const [analysis, setAnalysis] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simuliere API-Aufruf
    setTimeout(() => {
      setAnalysis({
        // Human Design Daten
        type: "Generator",
        profile: "1/3",
        line: "3",
        channels: ["10-20", "34-57", "61-24"],
        centers: {
          defined: ["Solarplexus", "Herz", "G-Punkt"],
          undefined: ["Kopf", "Hals", "Milz"]
        },
        // Reiki-spezifische Analyse
        reikiType: "Emotionaler Heiler",
        primarySymbol: "Sei He Ki",
        secondarySymbol: "Cho Ku Rei",
        energyLevel: "Hoch",
        chakraFocus: ["Herz", "Solarplexus"],
        recommendations: [
          "Fokus auf emotionale Heilung",
          "Regelmäßige Selbstbehandlung",
          "Meditation mit Sei He Ki Symbol",
          "Herz-Chakra stärken"
        ],
        compatibility: {
          symbols: ["Sei He Ki", "Cho Ku Rei", "Hon Sha Ze Sho Nen"],
          techniques: ["Fernheilung", "Emotionale Heilung", "Schutz"]
        }
      });
      setIsLoading(false);
    }, 2000);
  };

  if (!isClient) {
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
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Typography sx={{ color: '#FFD700', fontSize: '1.5rem' }}>
          Lade...
        </Typography>
      </Box>
    );
  }

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
              <Brain size={48} color="#FFD700" />
              <Typography variant="h1" sx={{
                color: '#FFD700',
                fontWeight: 800,
                textShadow: '0 4px 20px rgba(255, 215, 0, 0.3)',
                fontSize: { xs: '2.5rem', md: '4rem' }
              }}>
                Reiki HD-Analyse
              </Typography>
              <Brain size={48} color="#FFD700" />
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
                Erhalte eine personalisierte Reiki-Analyse basierend auf deinem Human Design
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
                Geburtsdaten eingeben
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
                        {isLoading ? 'Analysiere...' : 'Analyse starten'} 
                        <ArrowRight size={24} style={{ marginLeft: 8 }} />
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Analysis Results */}
        {analysis && (
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
                  Deine Reiki-Analyse
                </Typography>
                
                {/* Human Design Übersicht */}
                <Card sx={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  mb: 4
                }}>
                  <CardContent>
                    <Typography variant="h5" sx={{ 
                      color: '#FFD700', 
                      textAlign: 'center', 
                      fontWeight: 600, 
                      mb: 3 
                    }}>
                      Dein Human Design
                    </Typography>
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6} md={3}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="h6" sx={{ color: '#FFD700', mb: 1 }}>
                            Typ
                          </Typography>
                          <Typography sx={{ 
                            color: 'rgba(255,255,255,0.9)',
                            fontSize: '1.2rem',
                            fontWeight: 600
                          }}>
                            {analysis.type}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="h6" sx={{ color: '#FFD700', mb: 1 }}>
                            Profil
                          </Typography>
                          <Typography sx={{ 
                            color: 'rgba(255,255,255,0.9)',
                            fontSize: '1.2rem',
                            fontWeight: 600
                          }}>
                            {analysis.profile}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="h6" sx={{ color: '#FFD700', mb: 1 }}>
                            Linie
                          </Typography>
                          <Typography sx={{ 
                            color: 'rgba(255,255,255,0.9)',
                            fontSize: '1.2rem',
                            fontWeight: 600
                          }}>
                            {analysis.line}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="h6" sx={{ color: '#FFD700', mb: 1 }}>
                            Kanäle
                          </Typography>
                          <Typography sx={{ 
                            color: 'rgba(255,255,255,0.9)',
                            fontSize: '1rem',
                            fontWeight: 500
                          }}>
                            {analysis.channels.length} aktiv
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                    
                    {/* Kanäle Details */}
                    <Box sx={{ mt: 3, textAlign: 'center' }}>
                      <Typography variant="h6" sx={{ color: '#FFD700', mb: 2 }}>
                        Deine Kanäle
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 1 }}>
                        {analysis.channels.map((channel: string, index: number) => (
                          <Box
                            key={index}
                            sx={{
                              background: 'rgba(255, 215, 0, 0.1)',
                              border: '1px solid rgba(255, 215, 0, 0.3)',
                              borderRadius: 2,
                              px: 2,
                              py: 1,
                              color: '#FFD700',
                              fontWeight: 600,
                              fontSize: '0.9rem'
                            }}
                          >
                            {channel}
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
                
                <Grid container spacing={4}>
                  <Grid item xs={12} md={6}>
                    <Card sx={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      mb: 3
                    }}>
                      <CardContent>
                        <Typography variant="h6" sx={{ color: '#FFD700', mb: 2 }}>
                          Reiki-Typ
                        </Typography>
                        <Typography sx={{ color: 'rgba(255,255,255,0.8)' }}>
                          {analysis.reikiType}
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
                          Primäres Symbol
                        </Typography>
                        <Typography sx={{ color: 'rgba(255,255,255,0.8)' }}>
                          {analysis.primarySymbol}
                        </Typography>
                      </CardContent>
                    </Card>
                    
                    <Card sx={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255,255,255,0.1)'
                    }}>
                      <CardContent>
                        <Typography variant="h6" sx={{ color: '#FFD700', mb: 2 }}>
                          Energie-Level
                        </Typography>
                        <Typography sx={{ color: 'rgba(255,255,255,0.8)' }}>
                          {analysis.energyLevel}
                        </Typography>
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
                          Chakra-Fokus
                        </Typography>
                        {analysis.chakraFocus.map((chakra: string, index: number) => (
                          <Typography key={index} sx={{ color: 'rgba(255,255,255,0.8)' }}>
                            • {chakra}
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
                          Empfehlungen
                        </Typography>
                        {analysis.recommendations.map((rec: string, index: number) => (
                          <Typography key={index} sx={{ color: 'rgba(255,255,255,0.8)', mb: 1 }}>
                            • {rec}
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
