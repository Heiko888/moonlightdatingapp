"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Paper,
  Divider,
  Alert,
  CircularProgress
} from "@mui/material";
import {
  BookOpen,
  Star,
  Sparkles,
  Clock,
  User,
  Calendar,
  MapPin,
  Heart,
  Brain,
  Zap,
  Moon,
  Sun,
  ArrowRight,
  CheckCircle,
  Gift,
  Crown
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

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

export default function CustomReadingsPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    birthDate: '',
    birthTime: '',
    birthPlace: '',
    readingType: '',
    specificQuestions: '',
    urgency: 'normal'
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const readingTypes = [
    {
      id: 'friendship',
      name: 'Energetische Freundschafts-Analyse',
      description: 'Entdecke deine energetischen Muster in Freundschaften und sozialen Beziehungen',
      price: '€79',
      duration: '60 Min',
      features: ['Freundschafts-Muster', 'Soziale Energie', 'Kommunikationsstil', 'Gruppendynamik', 'Empfehlungen']
    },
    {
      id: 'relationships',
      name: 'Energetische Analyse Liebesleben',
      description: 'Tiefgreifende Analyse deiner energetischen Muster in romantischen Beziehungen',
      price: '€129',
      duration: '90 Min',
      features: ['Liebes-Energie', 'Partnerschafts-Muster', 'Intimität & Verbindung', 'Herausforderungen', 'Lösungsansätze']
    },
    {
      id: 'career',
      name: 'Energetische Karriereanalyse',
      description: 'Deine berufliche Ausrichtung basierend auf deinem energetischen Design',
      price: '€99',
      duration: '75 Min',
      features: ['Berufliche Energie', 'Ideal-Umgebung', 'Karriere-Pfade', 'Entscheidungsfindung', 'Talente & Fähigkeiten']
    },
    {
      id: 'individual',
      name: 'Individuelle Analyse',
      description: 'Maßgeschneiderte energetische Analyse für deine spezifischen Lebensbereiche',
      price: '€149',
      duration: '120 Min',
      features: ['Persönliche Themen', 'Spezifische Fragen', 'Flexible Gestaltung', 'Nachbetreuung', 'Transformationsplan']
    }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setLoading(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <Box sx={{ 
        minHeight: '100vh',
        background: `
          radial-gradient(circle at 20% 20%, rgba(255, 107, 157, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 80% 80%, rgba(78, 205, 196, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 40% 60%, rgba(102, 126, 234, 0.1) 0%, transparent 50%),
          linear-gradient(135deg, #0F0F23 0%, #1A1A2E 100%)
        `,
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <FloatingStars />
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
          <motion.div
            
            
            
          >
            <Card sx={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 4,
              p: 6,
              textAlign: 'center'
            }}>
              <Box sx={{ mb: 4 }}>
                <CheckCircle size={80} color="#ff6b9d" style={{ margin: '0 auto 24px' }} />
                <Typography variant="h3" sx={{ 
                  color: '#ff6b9d', 
                  fontWeight: 700, 
                  mb: 2 
                }}>
                  Anfrage erfolgreich gesendet!
                </Typography>
                <Typography variant="h6" sx={{ 
                  color: 'rgba(255,255,255,0.8)', 
                  mb: 4,
                  lineHeight: 1.6
                }}>
                  Vielen Dank für deine Anfrage für eine energetische Analyse. 
                  Wir melden uns innerhalb von 24 Stunden bei dir zurück.
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Button
                  component={Link}
                  href="/reading"
                  variant="contained"
                  sx={{
                    background: 'linear-gradient(135deg, #ff6b9d, #c44569)',
                    color: 'white',
                    fontWeight: 700,
                    px: 4,
                    py: 1.5,
                    borderRadius: 3,
                    '&:hover': {
                      background: 'linear-gradient(135deg, #ff5a8a, #b83a5a)',
                      transform: 'translateY(-2px)'
                    }
                  }}
                >
                  Zu den Analysen
                </Button>
                <Button
                  component={Link}
                  href="/dashboard"
                  variant="outlined"
                  sx={{
                    borderColor: 'rgba(255,255,255,0.3)',
                    color: 'white',
                    fontWeight: 700,
                    px: 4,
                    py: 1.5,
                    borderRadius: 3,
                    '&:hover': {
                      borderColor: 'white',
                      backgroundColor: 'rgba(255,255,255,0.1)'
                    }
                  }}
                >
                  Zum Dashboard
                </Button>
              </Box>
            </Card>
          </motion.div>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: `
        radial-gradient(circle at 20% 20%, rgba(255, 107, 157, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 80% 80%, rgba(78, 205, 196, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 40% 60%, rgba(102, 126, 234, 0.1) 0%, transparent 50%),
        linear-gradient(135deg, #0F0F23 0%, #1A1A2E 100%)
      `,
      position: 'relative',
      overflow: 'hidden'
    }}>
      <FloatingStars />
      
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, py: 8 }}>
        {/* Hero Section */}
        <motion.div
          
          
          
        >
          <Box textAlign="center" mb={8}>
            <Chip
              label="✨ Energetische Analysen"
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
                background: 'linear-gradient(135deg, #ff6b9d, #4ecdc4)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 800,
                mb: 4,
                fontSize: { xs: '2.5rem', md: '4rem' },
                textShadow: '0 0 30px rgba(255, 107, 157, 0.8)'
              }}
            >
              ⚡ Energetische Analysen
            </Typography>
            
            <Typography
              variant="h4"
              sx={{
                color: 'rgba(255,255,255,0.9)',
                mb: 6,
                maxWidth: 800,
                mx: 'auto',
                lineHeight: 1.6,
                fontWeight: 300
              }}
            >
              Energetische Analysen deines Human Design, maßgeschneidert für deine individuellen Lebensbereiche und Beziehungen.
            </Typography>
          </Box>
        </motion.div>

        {/* Reading Types */}
        <motion.div
          
          
          
        >
          <Typography variant="h2" sx={{ 
            color: 'white',
            fontWeight: 800,
            mb: 6,
            textAlign: 'center',
            background: 'linear-gradient(45deg, #fff, #e0e7ff)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Verfügbare Analyse-Typen
          </Typography>
          
          <Grid container spacing={4} sx={{ mb: 8 }}>
            {readingTypes.map((reading, index) => (
              <Grid item xs={12} md={6} lg={4} key={reading.id}>
                <motion.div
                  
                  
                  
                >
                  <Card sx={{ 
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: 4,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                    height: '100%',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                      border: '1px solid rgba(255, 107, 157, 0.3)'
                    }
                  }}>
                    <CardContent sx={{ p: 4 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                        <Box sx={{
                          width: 50,
                          height: 50,
                          borderRadius: '12px',
                          background: 'linear-gradient(135deg, #ff6b9d, #c44569)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginRight: '16px'
                        }}>
                          <BookOpen size={24} color="white" />
                        </Box>
                        <Box>
                          <Typography variant="h5" sx={{ color: 'white', fontWeight: 700, mb: 1 }}>
                            {reading.name}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                            {reading.duration}
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Typography variant="body1" sx={{ 
                        color: 'rgba(255,255,255,0.8)', 
                        mb: 3, 
                        lineHeight: 1.6 
                      }}>
                        {reading.description}
                      </Typography>

                      <Box sx={{ mb: 3 }}>
                        {reading.features.map((feature, featureIndex) => (
                          <Chip
                            key={featureIndex}
                            label={feature}
                            size="small"
                            sx={{
                              mr: 1,
                              mb: 1,
                              background: 'rgba(255, 107, 157, 0.2)',
                              color: '#ff6b9d',
                              border: '1px solid rgba(255, 107, 157, 0.3)',
                              fontWeight: 500
                            }}
                          />
                        ))}
                      </Box>

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Typography variant="h4" sx={{ 
                          color: '#ff6b9d', 
                          fontWeight: 800 
                        }}>
                          {reading.price}
                        </Typography>
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => handleInputChange('readingType', reading.id)}
                          sx={{
                            background: reading.id === formData.readingType 
                              ? 'linear-gradient(135deg, #ff6b9d, #c44569)' 
                              : 'rgba(255, 255, 255, 0.1)',
                            color: reading.id === formData.readingType ? 'white' : 'white',
                            fontWeight: 600,
                            '&:hover': {
                              background: 'linear-gradient(135deg, #ff5a8a, #b83a5a)',
                              color: 'white'
                            }
                          }}
                        >
                          {reading.id === formData.readingType ? 'Ausgewählt' : 'Auswählen'}
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>

        {/* Booking Form */}
        <motion.div
          
          
          
        >
          <Card sx={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 4,
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            p: 6
          }}>
            <Typography variant="h3" sx={{ 
              color: 'white', 
              fontWeight: 700, 
              mb: 4, 
              textAlign: 'center' 
            }}>
              Energetische Analyse anfragen
            </Typography>
            
            <form onSubmit={handleSubmit}>
              <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    fullWidth
                    required
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 3,
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        color: 'white',
                        '& fieldset': { border: 'none' },
                        '&:hover': { border: '1px solid rgba(255, 107, 157, 0.5)' },
                        '&.Mui-focused': { 
                          border: '1px solid #ff6b9d',
                          boxShadow: '0 0 0 2px rgba(255, 107, 157, 0.2)'
                        }
                      },
                      '& .MuiInputLabel-root': {
                        color: 'rgba(255, 255, 255, 0.7)',
                        '&.Mui-focused': { color: '#ff6b9d' }
                      },
                      '& .MuiInputBase-input': {
                        color: 'white !important'
                      }
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    label="E-Mail"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    fullWidth
                    required
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 3,
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        color: 'white',
                        '& fieldset': { border: 'none' },
                        '&:hover': { border: '1px solid rgba(255, 107, 157, 0.5)' },
                        '&.Mui-focused': { 
                          border: '1px solid #ff6b9d',
                          boxShadow: '0 0 0 2px rgba(255, 107, 157, 0.2)'
                        }
                      },
                      '& .MuiInputLabel-root': {
                        color: 'rgba(255, 255, 255, 0.7)',
                        '&.Mui-focused': { color: '#ff6b9d' }
                      },
                      '& .MuiInputBase-input': {
                        color: 'white !important'
                      }
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <TextField
                    label="Geburtsdatum"
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) => handleInputChange('birthDate', e.target.value)}
                    fullWidth
                    required
                    InputLabelProps={{ shrink: true }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 3,
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        color: 'white',
                        '& fieldset': { border: 'none' },
                        '&:hover': { border: '1px solid rgba(255, 107, 157, 0.5)' },
                        '&.Mui-focused': { 
                          border: '1px solid #ff6b9d',
                          boxShadow: '0 0 0 2px rgba(255, 107, 157, 0.2)'
                        }
                      },
                      '& .MuiInputLabel-root': {
                        color: 'rgba(255, 255, 255, 0.7)',
                        '&.Mui-focused': { color: '#ff6b9d' }
                      },
                      '& .MuiInputBase-input': {
                        color: 'white !important'
                      }
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <TextField
                    label="Geburtszeit"
                    type="time"
                    value={formData.birthTime}
                    onChange={(e) => handleInputChange('birthTime', e.target.value)}
                    fullWidth
                    required
                    InputLabelProps={{ shrink: true }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 3,
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        color: 'white',
                        '& fieldset': { border: 'none' },
                        '&:hover': { border: '1px solid rgba(255, 107, 157, 0.5)' },
                        '&.Mui-focused': { 
                          border: '1px solid #ff6b9d',
                          boxShadow: '0 0 0 2px rgba(255, 107, 157, 0.2)'
                        }
                      },
                      '& .MuiInputLabel-root': {
                        color: 'rgba(255, 255, 255, 0.7)',
                        '&.Mui-focused': { color: '#ff6b9d' }
                      },
                      '& .MuiInputBase-input': {
                        color: 'white !important'
                      }
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <TextField
                    label="Geburtsort"
                    value={formData.birthPlace}
                    onChange={(e) => handleInputChange('birthPlace', e.target.value)}
                    fullWidth
                    required
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 3,
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        color: 'white',
                        '& fieldset': { border: 'none' },
                        '&:hover': { border: '1px solid rgba(255, 107, 157, 0.5)' },
                        '&.Mui-focused': { 
                          border: '1px solid #ff6b9d',
                          boxShadow: '0 0 0 2px rgba(255, 107, 157, 0.2)'
                        }
                      },
                      '& .MuiInputLabel-root': {
                        color: 'rgba(255, 255, 255, 0.7)',
                        '&.Mui-focused': { color: '#ff6b9d' }
                      },
                      '& .MuiInputBase-input': {
                        color: 'white !important'
                      }
                    }}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    label="Spezifische Fragen oder Themen"
                    multiline
                    rows={4}
                    value={formData.specificQuestions}
                    onChange={(e) => handleInputChange('specificQuestions', e.target.value)}
                    fullWidth
                    placeholder="Beschreibe deine spezifischen Fragen oder Lebensbereiche, die du im Reading behandeln möchtest..."
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 3,
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        color: 'white',
                        '& fieldset': { border: 'none' },
                        '&:hover': { border: '1px solid rgba(255, 107, 157, 0.5)' },
                        '&.Mui-focused': { 
                          border: '1px solid #ff6b9d',
                          boxShadow: '0 0 0 2px rgba(255, 107, 157, 0.2)'
                        }
                      },
                      '& .MuiInputLabel-root': {
                        color: 'rgba(255, 255, 255, 0.7)',
                        '&.Mui-focused': { color: '#ff6b9d' }
                      },
                      '& .MuiInputBase-input': {
                        color: 'white !important',
                        '&::placeholder': {
                          color: 'rgba(255, 255, 255, 0.5)',
                          opacity: 1
                        }
                      }
                    }}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Dringlichkeit</InputLabel>
                    <Select
                      value={formData.urgency}
                      onChange={(e) => handleInputChange('urgency', e.target.value)}
                      sx={{
                        borderRadius: 3,
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        color: 'white',
                        '& fieldset': { border: 'none' },
                        '&:hover': { border: '1px solid rgba(255, 107, 157, 0.5)' },
                        '&.Mui-focused': { 
                          border: '1px solid #ff6b9d',
                          boxShadow: '0 0 0 2px rgba(255, 107, 157, 0.2)'
                        },
                        '& .MuiSelect-select': {
                          color: 'white'
                        }
                      }}
                    >
                      <MenuItem value="normal">Normal (1-2 Wochen)</MenuItem>
                      <MenuItem value="urgent">Dringend (3-5 Tage)</MenuItem>
                      <MenuItem value="asap">Sofort (1-2 Tage)</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12}>
                  <Box sx={{ textAlign: 'center', mt: 4 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      disabled={loading || !formData.readingType}
                      sx={{
                        background: 'linear-gradient(135deg, #ff6b9d, #c44569)',
                        color: 'white',
                        fontWeight: 700,
                        px: 6,
                        py: 2,
                        fontSize: '1.2rem',
                        borderRadius: 3,
                        textTransform: 'none',
                        boxShadow: '0 8px 32px rgba(255, 107, 157, 0.4)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #ff5a8a, #b83a5a)',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 12px 40px rgba(255, 107, 157, 0.6)'
                        },
                        '&:disabled': {
                          background: 'rgba(255, 255, 255, 0.1)',
                          color: 'rgba(255, 255, 255, 0.3)'
                        }
                      }}
                    >
                      {loading ? (
                        <>
                          <CircularProgress size={20} sx={{ mr: 2, color: 'white' }} />
                          Wird gesendet...
                        </>
                      ) : (
                        <>
                          Analyse anfragen
                          <ArrowRight size={24} style={{ marginLeft: 8 }} />
                        </>
                      )}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </form>
          </Card>
        </motion.div>

        {/* Benefits Section */}
        <motion.div
          
          
          
        >
          <Box sx={{ 
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 4,
            p: 6,
            mt: 8,
            textAlign: 'center'
          }}>
            <Typography variant="h4" sx={{ 
              color: 'white', 
              fontWeight: 700, 
              mb: 4,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2
            }}>
              <Gift size={32} />
              Warum energetische Analysen?
            </Typography>
            <Grid container spacing={4}>
              {[
                { icon: <User size={24} />, title: 'Energetisch', desc: 'Fokus auf deine energetischen Muster und Design' },
                { icon: <Brain size={24} />, title: 'Tiefgreifend', desc: 'Detaillierte Analysen deiner energetischen Struktur' },
                { icon: <Heart size={24} />, title: 'Transformativ', desc: 'Praktische Erkenntnisse für deine Beziehungen' },
                { icon: <Clock size={24} />, title: 'Spezifisch', desc: 'Fokus auf konkrete Lebensbereiche' }
              ].map((benefit, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Box sx={{
                      width: 60,
                      height: 60,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #ff6b9d, #c44569)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 16px',
                      color: 'white'
                    }}>
                      {benefit.icon}
                    </Box>
                    <Typography variant="h6" sx={{ color: 'white', fontWeight: 600, mb: 1 }}>
                      {benefit.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                      {benefit.desc}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
}
