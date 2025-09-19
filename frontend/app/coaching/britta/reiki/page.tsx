"use client";

import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Button,
  Chip,
  Rating,
  IconButton,
  TextField,
  MenuItem,
  Alert,
  CircularProgress,
  Container,
  Grid,
  Divider
} from '@mui/material';
import { motion } from 'framer-motion';
import { 
  Star, 
  MapPin, 
  Heart, 
  Sparkles, 
  ArrowLeft, 
  BookOpen, 
  MessageSquare, 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Clock, 
  Send,
  Zap,
  Shield,
  Leaf,
  Moon,
  Sun,
  Wind,
  Droplets,
  Flame
} from 'lucide-react';
import Link from 'next/link';
import AnimatedStars from '../../../../components/AnimatedStars';
import AnimatedMoon from '../../../../components/AnimatedMoon';

// Animierte Reiki-Symbole
const ReikiSymbols = () => {
  const symbols = [
    { name: 'Cho Ku Rei', icon: <Zap size={24} />, color: '#FFD700' },
    { name: 'Sei He Ki', icon: <Shield size={24} />, color: '#8B5CF6' },
    { name: 'Hon Sha Ze Sho Nen', icon: <Moon size={24} />, color: '#06B6D4' },
    { name: 'Dai Ko Myo', icon: <Sun size={24} />, color: '#EF4444' }
  ];

  return (
    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap', mb: 4 }}>
      {symbols.map((symbol, index) => (
        <motion.div
          key={symbol.name}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            p: 2,
            borderRadius: 3,
            background: `linear-gradient(135deg, ${symbol.color}20 0%, ${symbol.color}10 100%)`,
            border: `2px solid ${symbol.color}40`,
            minWidth: 120
          }}>
            <Box sx={{ color: symbol.color, mb: 1 }}>
              {symbol.icon}
            </Box>
            <Typography variant="caption" sx={{ 
              color: symbol.color, 
              fontWeight: 600,
              textAlign: 'center',
              fontSize: '0.75rem'
            }}>
              {symbol.name}
            </Typography>
          </Box>
        </motion.div>
      ))}
    </Box>
  );
};

export default function BrittaReikiPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingForm, setBookingForm] = useState({ 
    name: "", 
    email: "", 
    phone: "", 
    sessionType: "", 
    date: "", 
    time: "", 
    message: "" 
  });
  
  const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    setUserId(localStorage.getItem("userId"));
  }, []);

  const reikiSessionTypes = [
    "Reiki-Behandlung (60 Min)",
    "Reiki-Einweihung Level 1",
    "Reiki-Einweihung Level 2", 
    "Reiki-Meister Einweihung",
    "Fern-Reiki Behandlung",
    "Reiki für Tiere",
    "Reiki für Schwangere",
    "Reiki für Kinder"
  ];

  const timeSlots = [
    "09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00", "18:00"
  ];

  const handleBookingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBookingForm({ ...bookingForm, [e.target.name]: e.target.value });
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingLoading(true);
    setBookingSuccess(null);
    setBookingError(null);
    
    try {
      const res = await fetch("http://localhost:4001/sessionrequest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          ...bookingForm, 
          coach: "Britta Schuhmann",
          service: "Reiki"
        })
      });
      const data = await res.json();
      
      if (data.success) {
        setBookingSuccess("Reiki-Session-Anfrage erfolgreich versendet! Britta meldet sich bald bei dir. ✨");
        setBookingForm({ name: "", email: "", phone: "", sessionType: "", date: "", time: "", message: "" });
        setShowBookingForm(false);
      } else {
        setBookingError(data.error || "Fehler beim Senden der Anfrage. Bitte versuche es erneut.");
      }
    } catch {
      setBookingError("Verbindungsfehler. Bitte überprüfe deine Internetverbindung.");
    }
    setBookingLoading(false);
  };

  const reikiBenefits = [
    { icon: <Heart size={20} />, title: "Stressabbau", description: "Tiefe Entspannung und innere Ruhe" },
    { icon: <Shield size={20} />, title: "Energieausgleich", description: "Harmonisierung der Chakren" },
    { icon: <Leaf size={20} />, title: "Selbstheilung", description: "Aktivierung der körpereigenen Heilkräfte" },
    { icon: <Zap size={20} />, title: "Energiefluss", description: "Verbesserung des Energieflusses" },
    { icon: <Moon size={20} />, title: "Schlafqualität", description: "Besserer und erholsamerer Schlaf" },
    { icon: <Sun size={20} />, title: "Lebensfreude", description: "Mehr Vitalität und Lebensenergie" }
  ];

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: `
        radial-gradient(ellipse at top, rgba(255, 215, 0, 0.2) 0%, transparent 50%),
        radial-gradient(ellipse at bottom, rgba(139, 92, 246, 0.2) 0%, transparent 50%),
        linear-gradient(135deg, #0f0f23 0%, #1a1a2e 25%, #533483 50%, #8B5CF6 75%, #A855F7 100%)
      `,
      py: 6,
      position: 'relative',
      overflow: 'hidden'
    }}>
      <AnimatedStars />
      <AnimatedMoon size={150} position="top-right" />
      
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
        {/* Zurück-Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Button
            component={Link}
            href="/coaching/britta"
            variant="outlined"
            startIcon={<ArrowLeft size={20} />}
            sx={{ 
              color: '#fff', 
              borderColor: 'rgba(255,255,255,0.3)', 
              fontWeight: 600, 
              borderRadius: 3,
              px: 3,
              py: 1.5,
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)',
              mb: 4,
              '&:hover': {
                borderColor: '#FFD700',
                background: 'rgba(255,215,0,0.1)',
                transform: 'translateY(-2px)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            Zurück zu Britta
          </Button>
        </motion.div>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Card sx={{ 
            maxWidth: 800, 
            mx: 'auto', 
            borderRadius: 4, 
            boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '2px solid rgba(255,255,255,0.2)',
            overflow: 'hidden',
            mb: 4
          }}>
            {/* Header mit Avatar */}
            <Box sx={{ 
              background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
              p: 4,
              textAlign: 'center',
              position: 'relative'
            }}>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <Avatar 
                  src="/images/britta.jpg" 
                  sx={{ 
                    width: 120, 
                    height: 120, 
                    mx: 'auto', 
                    mb: 3, 
                    boxShadow: '0 8px 32px rgba(255,215,0,0.4)', 
                    border: '4px solid #fff'
                  }} 
                />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <Typography variant="h3" sx={{ 
                  color: '#23233a', 
                  fontWeight: 800, 
                  mb: 1,
                  textShadow: '0 2px 4px rgba(255,255,255,0.8)'
                }}>
                  Reiki-Heilung mit Britta
                </Typography>
                <Typography variant="h5" sx={{ 
                  color: '#23233a', 
                  fontWeight: 500,
                  mb: 2
                }}>
                  Reiki-Meisterin & Human Design Coach
                </Typography>
                
                {/* Reiki-Symbole */}
                <ReikiSymbols />
              </motion.div>
            </Box>

            {/* Content */}
            <CardContent sx={{ p: 4 }}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <Typography variant="h5" sx={{ 
                  color: '#4b2e83', 
                  fontWeight: 700, 
                  mb: 3,
                  textAlign: 'center'
                }}>
                  Was ist Reiki?
                </Typography>
                
                <Typography variant="body1" sx={{ 
                  color: '#4a5568', 
                  mb: 3, 
                  fontWeight: 500,
                  lineHeight: 1.8,
                  fontSize: '1.1rem'
                }}>
                  Reiki ist eine japanische Heilmethode, bei der universelle Lebensenergie durch Handauflegen übertragen wird. 
                  Als zertifizierte Reiki-Meisterin begleite ich dich auf deinem Weg zu mehr Balance, Heilung und innerem Frieden.
                </Typography>

                <Typography variant="body1" sx={{ 
                  color: '#4a5568', 
                  mb: 4, 
                  fontWeight: 500,
                  lineHeight: 1.8,
                  fontSize: '1.1rem'
                }}>
                  Meine Reiki-Behandlungen verbinde ich mit Human Design Erkenntnissen, um dir eine ganzheitliche 
                  Heilungserfahrung zu ermöglichen, die perfekt auf deine energetische Struktur abgestimmt ist.
                </Typography>

                {/* Reiki-Vorteile */}
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" sx={{ 
                    color: '#4b2e83', 
                    fontWeight: 700, 
                    mb: 3,
                    textAlign: 'center'
                  }}>
                    Was Reiki für dich bewirken kann:
                  </Typography>
                  <Grid container spacing={2}>
                    {reikiBenefits.map((benefit, index) => (
                      <Grid item xs={12} sm={6} md={4} key={index}>
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.1 * index }}
                        >
                          <Box sx={{
                            p: 3,
                            borderRadius: 3,
                            background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                            color: '#23233a',
                            textAlign: 'center',
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center'
                          }}>
                            <Box sx={{ mb: 2 }}>
                              {benefit.icon}
                            </Box>
                            <Typography variant="h6" sx={{ 
                              fontWeight: 700, 
                              mb: 1,
                              fontSize: '1rem'
                            }}>
                              {benefit.title}
                            </Typography>
                            <Typography variant="body2" sx={{ 
                              fontSize: '0.9rem',
                              lineHeight: 1.4
                            }}>
                              {benefit.description}
                            </Typography>
                          </Box>
                        </motion.div>
                      </Grid>
                    ))}
                  </Grid>
                </Box>

                {/* Reiki-Session-Typen */}
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" sx={{ 
                    color: '#4b2e83', 
                    fontWeight: 700, 
                    mb: 3,
                    textAlign: 'center'
                  }}>
                    Meine Reiki-Angebote
                  </Typography>
                  <Grid container spacing={2}>
                    {[
                      { type: "Reiki-Behandlung", duration: "60 Min", price: "80€", description: "Vollständige Reiki-Behandlung mit Chakren-Ausgleich" },
                      { type: "Reiki Level 1", duration: "1 Tag", price: "180€", description: "Erste Reiki-Einweihung für Selbstbehandlung" },
                      { type: "Reiki Level 2", duration: "1 Tag", price: "280€", description: "Zweite Reiki-Einweihung mit Symbolen" },
                      { type: "Fern-Reiki", duration: "30 Min", price: "50€", description: "Reiki-Behandlung auf Distanz" }
                    ].map((session, index) => (
                      <Grid item xs={12} sm={6} key={index}>
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.5, delay: 0.1 * index }}
                        >
                          <Card sx={{
                            height: '100%',
                            background: 'rgba(255, 215, 0, 0.1)',
                            border: '2px solid rgba(255, 215, 0, 0.3)',
                            borderRadius: 3
                          }}>
                            <CardContent sx={{ p: 3 }}>
                              <Typography variant="h6" sx={{ 
                                color: '#4b2e83', 
                                fontWeight: 700, 
                                mb: 1
                              }}>
                                {session.type}
                              </Typography>
                              <Typography variant="body2" sx={{ 
                                color: '#4a5568', 
                                mb: 2,
                                lineHeight: 1.5
                              }}>
                                {session.description}
                              </Typography>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="body2" sx={{ color: '#667eea', fontWeight: 600 }}>
                                  {session.duration}
                                </Typography>
                                <Typography variant="h6" sx={{ 
                                  color: '#FFD700', 
                                  fontWeight: 700
                                }}>
                                  {session.price}
                                </Typography>
                              </Box>
                            </CardContent>
                          </Card>
                        </motion.div>
                      </Grid>
                    ))}
                  </Grid>
                </Box>

                {/* CTA Button */}
                <Box sx={{ textAlign: 'center' }}>
                  <Button 
                    variant="contained" 
                    size="large"
                    onClick={() => setShowBookingForm(true)}
                    sx={{ 
                      background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                      color: '#23233a', 
                      fontWeight: 700, 
                      borderRadius: 3,
                      px: 6,
                      py: 2,
                      fontSize: '1.1rem',
                      textTransform: 'none',
                      boxShadow: '0 8px 24px rgba(255, 215, 0, 0.3)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #FFA500 0%, #FFD700 100%)',
                        transform: 'translateY(-3px)',
                        boxShadow: '0 12px 32px rgba(255, 215, 0, 0.4)'
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Reiki-Session buchen
                  </Button>
                </Box>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Buchungsformular Modal */}
        {showBookingForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.7)',
              backdropFilter: 'blur(8px)',
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px'
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              style={{ maxWidth: 600, width: '100%' }}
            >
              <Card sx={{ 
                background: 'rgba(255, 255, 255, 0.98)', 
                backdropFilter: 'blur(20px)',
                borderRadius: 4, 
                boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
                border: '2px solid rgba(255, 215, 0, 0.2)',
                maxHeight: '90vh',
                overflow: 'auto'
              }}>
                <CardContent sx={{ p: 4 }}>
                  {/* Header */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h4" sx={{ 
                      color: '#4b2e83', 
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2
                    }}>
                      <Zap size={28} style={{ color: '#FFD700' }} />
                      Reiki-Session buchen
                    </Typography>
                    <Button
                      onClick={() => setShowBookingForm(false)}
                      sx={{ 
                        color: '#FFD700',
                        minWidth: 'auto',
                        p: 1,
                        '&:hover': { background: 'rgba(255, 215, 0, 0.1)' }
                      }}
                    >
                      ✕
                    </Button>
                  </Box>

                  {/* Erfolgs- und Fehlermeldungen */}
                  {bookingSuccess && (
                    <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
                      {bookingSuccess}
                    </Alert>
                  )}
                  
                  {bookingError && (
                    <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                      {bookingError}
                    </Alert>
                  )}

                  {/* Formular */}
                  <Box component="form" onSubmit={handleBookingSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {/* Name */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <User size={20} style={{ color: '#FFD700' }} />
                      <TextField 
                        label="Name" 
                        name="name" 
                        value={bookingForm.name} 
                        onChange={handleBookingChange} 
                        required 
                        fullWidth 
                        sx={{ 
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            background: 'rgba(255,255,255,0.9)',
                            '&:hover': {
                              background: 'rgba(255,255,255,1)',
                            },
                            '&.Mui-focused': {
                              borderColor: '#FFD700'
                            }
                          },
                          '& .MuiInputBase-input': {
                            color: '#4b2e83',
                          },
                          '& .MuiInputLabel-root': {
                            color: '#FFD700',
                            fontWeight: 500
                          }
                        }} 
                      />
                    </Box>
                    
                    {/* Email */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Mail size={20} style={{ color: '#FFD700' }} />
                      <TextField 
                        label="E-Mail" 
                        name="email" 
                        value={bookingForm.email} 
                        onChange={handleBookingChange} 
                        required 
                        fullWidth 
                        type="email"
                        sx={{ 
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            background: 'rgba(255,255,255,0.9)',
                            '&:hover': {
                              background: 'rgba(255,255,255,1)',
                            }
                          },
                          '& .MuiInputBase-input': {
                            color: '#4b2e83',
                          },
                          '& .MuiInputLabel-root': {
                            color: '#FFD700',
                            fontWeight: 500
                          }
                        }} 
                      />
                    </Box>
                    
                    {/* Telefon */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Phone size={20} style={{ color: '#FFD700' }} />
                      <TextField 
                        label="Telefon" 
                        name="phone" 
                        value={bookingForm.phone} 
                        onChange={handleBookingChange} 
                        required 
                        fullWidth 
                        type="tel"
                        sx={{ 
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            background: 'rgba(255,255,255,0.9)',
                            '&:hover': {
                              background: 'rgba(255,255,255,1)',
                            }
                          },
                          '& .MuiInputBase-input': {
                            color: '#4b2e83',
                          },
                          '& .MuiInputLabel-root': {
                            color: '#FFD700',
                            fontWeight: 500
                          }
                        }} 
                      />
                    </Box>
                    
                    {/* Session-Typ */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Zap size={20} style={{ color: '#FFD700' }} />
                      <TextField
                        select
                        name="sessionType"
                        value={bookingForm.sessionType}
                        onChange={handleBookingChange}
                        required
                        fullWidth
                        label="Reiki-Session-Typ"
                        sx={{ 
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            background: 'rgba(255,255,255,0.9)',
                            '&:hover': {
                              background: 'rgba(255,255,255,1)',
                            }
                          },
                          '& .MuiInputBase-input': {
                            color: '#4b2e83',
                          },
                          '& .MuiInputLabel-root': {
                            color: '#FFD700',
                            fontWeight: 500
                          }
                        }}
                      >
                        {reikiSessionTypes.map(type => (
                          <MenuItem key={type} value={type}>{type}</MenuItem>
                        ))}
                      </TextField>
                    </Box>
                    
                    {/* Datum und Uhrzeit */}
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                        <Calendar size={20} style={{ color: '#FFD700' }} />
                        <TextField 
                          label="Datum" 
                          name="date" 
                          value={bookingForm.date} 
                          onChange={handleBookingChange} 
                          required 
                          fullWidth 
                          type="date"
                          sx={{ 
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              background: 'rgba(255,255,255,0.9)',
                              '&:hover': {
                                background: 'rgba(255,255,255,1)',
                              }
                            },
                            '& .MuiInputBase-input': {
                              color: '#4b2e83',
                            },
                            '& .MuiInputLabel-root': {
                              color: '#FFD700',
                              fontWeight: 500
                            }
                          }} 
                        />
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                        <Clock size={20} style={{ color: '#FFD700' }} />
                        <TextField
                          select
                          name="time"
                          value={bookingForm.time}
                          onChange={handleBookingChange}
                          required
                          fullWidth
                          label="Uhrzeit"
                          sx={{ 
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              background: 'rgba(255,255,255,0.9)',
                              '&:hover': {
                                background: 'rgba(255,255,255,1)',
                              }
                            },
                            '& .MuiInputBase-input': {
                              color: '#4b2e83',
                            },
                            '& .MuiInputLabel-root': {
                              color: '#FFD700',
                              fontWeight: 500
                            }
                          }}
                        >
                          {timeSlots.map(time => (
                            <MenuItem key={time} value={time}>{time}</MenuItem>
                          ))}
                        </TextField>
                      </Box>
                    </Box>
                    
                    {/* Nachricht */}
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                      <MessageSquare size={20} style={{ color: '#FFD700', marginTop: '8px' }} />
                      <TextField 
                        label="Nachricht (optional)" 
                        name="message" 
                        value={bookingForm.message} 
                        onChange={handleBookingChange} 
                        fullWidth 
                        multiline 
                        minRows={3}
                        placeholder="Erzähle mir von deinem Anliegen oder deinen Fragen zur Reiki-Behandlung..."
                        sx={{ 
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            background: 'rgba(255,255,255,0.9)',
                            '&:hover': {
                              background: 'rgba(255,255,255,1)',
                            }
                          },
                          '& .MuiInputBase-input': {
                            color: '#4b2e83',
                          },
                          '& .MuiInputLabel-root': {
                            color: '#FFD700',
                            fontWeight: 500
                          }
                        }} 
                      />
                    </Box>
                    
                    {/* Submit Button */}
                    <Button 
                      type="submit" 
                      variant="contained" 
                      fullWidth
                      sx={{ 
                        mt: 2, 
                        borderRadius: 2, 
                        background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)', 
                        color: '#23233a', 
                        fontWeight: 700, 
                        fontSize: 16, 
                        py: 1.5,
                        boxShadow: '0 8px 25px rgba(255, 215, 0, 0.3)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #FFA500 0%, #FFD700 100%)',
                          boxShadow: '0 12px 35px rgba(255, 215, 0, 0.4)',
                        },
                        '&:disabled': { 
                          opacity: 0.7,
                          background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)'
                        } 
                      }}
                      disabled={bookingLoading}
                    >
                      {bookingLoading ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CircularProgress size={20} sx={{ color: '#23233a' }} />
                          Wird gesendet...
                        </Box>
                      ) : (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Send size={18} />
                          Reiki-Session anfragen
                        </Box>
                      )}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </Container>
    </Box>
  );
}

