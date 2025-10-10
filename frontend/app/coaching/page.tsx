"use client";
import React, { useState, useRef, useEffect } from 'react';
import { Container, Typography, Card, CardContent, Box, Button, Paper, Chip, Grid, Avatar, Rating, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Tabs, Tab, IconButton, Divider, Alert, CircularProgress, MenuItem } from '@mui/material';
import { motion } from 'framer-motion';
import { Users, Calendar, ArrowRight, Clock, MapPin, Phone, Mail, BookOpen, User, Send, X, MessageSquare } from 'lucide-react';
import AccessControl from '../../components/AccessControl';
// import { UserSubscription } from '../../lib/subscription/types'; // Entfernt - nicht mehr benötigt
// import { SubscriptionService } from '../../lib/subscription/subscriptionService'; // Entfernt - nicht mehr benötigt
import { useRouter } from 'next/navigation';
import Link from 'next/link';
// import { apiService } from '@/lib/services/apiService'; // Entfernt - nicht mehr benötigt
// import { useLoadingState } from '@/lib/services/loadingService'; // Entfernt - nicht mehr benötigt
// import UnifiedPageLayout from '@/components/UnifiedPageLayout'; // Entfernt - nicht mehr benötigt
// import { useSubscription } from '../../hooks/useSubscription'; // Entfernt - nicht mehr benötigt

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'coach';
  timestamp: Date;
}

interface CoachExtended {
  id: number;
  name: string;
  title: string;
  avatar: string;
  rating: number;
  reviews: number;
  experience: string;
  specializations: string[];
  description: string;
  sessions: Array<{ type: string; price: string; duration: string }>;
  availability: string[];
  languages: string[];
  profileUrl: string;
  isOnline: boolean;
  lastSeen?: string;
}

interface BookingData {
  name: string;
  email: string;
  phone: string;
  message: string;
  sessionType: string;
  date: string;
  time: string;
}

export default function CoachingPage() {
  const router = useRouter();
  const [selectedCoach, setSelectedCoach] = useState<CoachExtended | null>(null);
  const [bookingDialog, setBookingDialog] = useState<boolean>(false);
  const [chatDialog, setChatDialog] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<number>(0);
  const [newMessage, setNewMessage] = useState<string>('');
  const [messages, setMessages] = useState<{ [coachId: number]: Message[] }>({});
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  // Temporärer Fix - useSubscription Hook entfernt
  const userSubscription = null;
  const subscriptionLoading = false;
  const forceSync = () => {};
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [bookingData, setBookingData] = useState<BookingData>({
    name: '',
    email: '',
    phone: '',
    message: '',
    sessionType: '1:1 Coaching',
    date: '',
    time: ''
  });

  // Buchungsformular State
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [form, setForm] = useState({ 
    name: "", 
    email: "", 
    phone: "", 
    sessionType: "", 
    date: "", 
    time: "", 
    message: "" 
  });
  
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Authentifizierung prüfen
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');

      if (!token || !userId) {
        setIsAuthenticated(false);
        return;
      }

      setIsAuthenticated(true);
    };

    checkAuth();
  }, []);

  // Force sync subscription on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!userSubscription) {
        console.log('Coaching: No subscription found, forcing sync...');
        forceSync();
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [userSubscription, forceSync]);


  const coaches: CoachExtended[] = [
    {
      id: 1,
      name: "Heiko",
      title: "Human Design Experte & Life Coach",
      avatar: "/coaches/heiko.jpg",
      rating: 4.9,
      reviews: 127,
      experience: "8+ Jahre",
      specializations: ["Human Design", "Life Coaching", "Beziehungen", "Karriere"],
      description: "Heiko ist ein zertifizierter Human Design Experte mit über 8 Jahren Erfahrung. Er hilft Menschen dabei, ihre einzigartige Design zu verstehen und im Alltag zu leben.",
      sessions: [
        { type: "1:1 Coaching", price: "120€", duration: "60 Min" },
        { type: "Gruppen-Session", price: "80€", duration: "90 Min" },
        { type: "Intensiv-Workshop", price: "300€", duration: "3 Stunden" }
      ],
      availability: ["Mo-Fr: 9:00-18:00", "Sa: 10:00-16:00"],
      languages: ["Deutsch", "Englisch"],
      profileUrl: "/coaching/heiko",
      isOnline: true,
      lastSeen: "vor 2 Minuten"
    },
    {
      id: 2,
      name: "Janine",
      title: "Human Design Beraterin & Therapeutin",
      avatar: "/coaches/janine.jpg",
      rating: 4.8,
      reviews: 89,
      experience: "6+ Jahre",
      specializations: ["Human Design", "Psychologie", "Familie", "Kinder"],
      description: "Janine ist eine erfahrene Human Design Beraterin mit psychologischem Hintergrund. Sie spezialisiert sich auf Familien- und Beziehungsdynamiken.",
      sessions: [
        { type: "1:1 Coaching", price: "100€", duration: "60 Min" },
        { type: "Paar-Coaching", price: "150€", duration: "90 Min" },
        { type: "Familien-Session", price: "200€", duration: "120 Min" }
      ],
      availability: ["Di-Do: 10:00-17:00", "Fr: 9:00-15:00"],
      languages: ["Deutsch", "Französisch"],
      profileUrl: "/coaching/janine",
      isOnline: false,
      lastSeen: "vor 1 Stunde"
    },
    {
      id: 3,
      name: "Elisabeth",
      title: "Human Design Master & Business Coach",
      avatar: "/coaches/elisabeth.jpg",
      rating: 4.7,
      reviews: 98,
      experience: "7+ Jahre",
      specializations: ["Human Design", "Business", "Leadership", "Team-Dynamik"],
      description: "Elisabeth hilft Führungskräften und Unternehmern dabei, ihre Human Design im beruflichen Kontext zu nutzen und erfolgreiche Teams aufzubauen.",
      sessions: [
        { type: "1:1 Coaching", price: "160€", duration: "60 Min" },
        { type: "Business Design", price: "200€", duration: "90 Min" },
        { type: "Team-Workshop", price: "500€", duration: "4 Stunden" }
      ],
      availability: ["Mo-Fr: 8:00-17:00"],
      languages: ["Deutsch", "Englisch"],
      profileUrl: "/coaching/elisabeth",
      isOnline: false,
      lastSeen: "vor 30 Minuten"
    }
  ];

  const handleCoachSelect = (coach: CoachExtended) => {
    setSelectedCoach(coach);
    setBookingDialog(true);
  };

  const handleChatOpen = (coach: CoachExtended) => {
    setSelectedCoach(coach);
    setChatDialog(true);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedCoach) return;

    const message: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => ({
      ...prev,
      [selectedCoach.id]: [...(prev[selectedCoach.id] || []), message]
    }));

    setNewMessage('');
    setIsTyping(true);

    // Simuliere Coach-Antwort
    setTimeout(() => {
      const coachMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: `Vielen Dank für deine Nachricht! Ich werde dir so schnell wie möglich antworten. 😊`,
        sender: 'coach',
        timestamp: new Date()
      };

      setMessages(prev => ({
        ...prev,
        [selectedCoach.id]: [...(prev[selectedCoach.id] || []), coachMessage]
      }));

      setIsTyping(false);
    }, 2000);
  };

  const handleBookingSubmit = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const response = await fetch('/api/coaching/booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          coachId: selectedCoach?.id,
          ...bookingData
        })
      });
      
      const data = await response.json();

      if (data.success) {
        setSuccess("Buchung erfolgreich! Du erhältst eine Bestätigung per E-Mail.");
        setBookingDialog(false);
        setBookingData({
          name: '',
          email: '',
          phone: '',
          message: '',
          sessionType: '1:1 Coaching',
          date: '',
          time: ''
        });
      } else {
        setError(data.message || "Fehler bei der Buchung");
      }
    } catch (err) {
      setError("Fehler bei der Buchung. Bitte versuche es erneut.");
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/api/coaching/booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        setSuccess("Buchung erfolgreich! Du erhältst eine Bestätigung per E-Mail.");
        setForm({ name: "", email: "", phone: "", sessionType: "", date: "", time: "", message: "" });
        setShowBookingForm(false);
      } else {
        setError("Fehler bei der Buchung. Bitte versuche es erneut.");
      }
    } catch (err) {
      setError("Fehler bei der Buchung. Bitte versuche es erneut.");
    } finally {
      setLoading(false);
    }
  };

  // Debug: Log subscription status
  console.log('Coaching: Current userSubscription:', userSubscription);
  console.log('Coaching: Subscription loading:', subscriptionLoading);

  return (
    <AccessControl
      path="/coaching"
      userSubscription={userSubscription}
      onUpgrade={() => router.push('/pricing')}
    >
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
        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 2, py: { xs: 4, md: 8 }, px: { xs: 1, sm: 2 } }}>
          {/* Header */}
          <Box textAlign="center" mb={6}>
            <Typography 
              variant="h2" 
              sx={{ 
                fontWeight: 'bold', 
                mb: 2,
                background: 'linear-gradient(135deg, #ff6b9d, #4ecdc4)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: { xs: '2.5rem', md: '3.5rem' }
              }}
            >
              👥 Coaching & Community
            </Typography>
            <Typography 
              variant="h5" 
              sx={{ 
                color: 'rgba(255,255,255,0.8)', 
                fontWeight: 300,
                maxWidth: '600px',
                mx: 'auto',
                lineHeight: 1.6
              }}
            >
              Buche deine persönliche Human Design Session, chatte mit unseren Coaches oder trete unserer Community bei
            </Typography>
          </Box>
        {/* Coaches Grid */}
        <Grid container spacing={4} sx={{ mb: 6 }}>
          {coaches.map((coach, index) => (
            <Grid item xs={12} md={6} key={coach.id}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card sx={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 4,
                  height: '100%',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
                  },
                  transition: 'all 0.3s ease'
                }}>
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <Avatar
                        src={coach.avatar}
                        sx={{
                          width: 80,
                          height: 80,
                          mr: 3,
                          border: '3px solid rgba(255, 255, 255, 0.2)'
                        }}
                      />
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, mr: 2 }}>
                            {coach.name}
                          </Typography>
                          <Chip
                            label={coach.isOnline ? 'Online' : 'Offline'}
                            size="small"
                            sx={{
                              background: coach.isOnline ? 'linear-gradient(135deg, #ff6b9d, #c44569)' : 'rgba(255,255,255,0.2)',
                              color: 'white',
                              fontWeight: 600
                            }}
                          />
                        </Box>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1 }}>
                          {coach.title}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Rating value={coach.rating} readOnly size="small" sx={{ mr: 1 }} />
                          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                            {coach.rating} ({coach.reviews} Bewertungen)
                          </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                          {coach.experience} Erfahrung
                        </Typography>
                      </Box>
                    </Box>

                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mb: 3, lineHeight: 1.6 }}>
                      {coach.description}
                    </Typography>

                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" sx={{ color: '#FFD700', mb: 1, fontWeight: 600 }}>
                        Spezialisierungen:
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {coach.specializations.map((spec, idx) => (
                          <Chip
                            key={idx}
                            label={spec}
                            size="small"
                            sx={{
                              background: 'rgba(255, 255, 255, 0.1)',
                              color: 'rgba(255,255,255,0.8)',
                              border: '1px solid rgba(255,255,255,0.2)'
                            }}
                          />
                        ))}
                      </Box>
                    </Box>

                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" sx={{ color: '#FFD700', mb: 1, fontWeight: 600 }}>
                        Verfügbarkeit:
                      </Typography>
                      {coach.availability.map((time, idx) => (
                        <Typography key={idx} variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 0.5 }}>
                          {time}
                        </Typography>
                      ))}
                    </Box>

                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Button
                          fullWidth
                          variant="contained"
                          startIcon={<Calendar size={20} />}
                          onClick={() => handleCoachSelect(coach)}
                          sx={{
                            background: 'linear-gradient(135deg, #ff6b9d, #c44569)',
                            '&:hover': {
                              background: 'linear-gradient(135deg, #ff5a8a, #b83a5a)'
                            },
                            borderRadius: 2,
                            py: 1.5
                          }}
                        >
                          Buchen
                        </Button>
                      </Grid>
                      <Grid item xs={6}>
                        <Button
                          fullWidth
                          variant="outlined"
                          startIcon={<MessageSquare size={20} />}
                          onClick={() => handleChatOpen(coach)}
                          sx={{
                            color: 'rgba(255,255,255,0.8)',
                            borderColor: 'rgba(255,255,255,0.3)',
                            '&:hover': {
                              borderColor: '#ff6b9d',
                              backgroundColor: 'rgba(255, 107, 157, 0.1)'
                            },
                            borderRadius: 2,
                            py: 1.5
                          }}
                        >
                          Chat
                        </Button>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* Community Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card sx={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 4,
            p: 4
          }}>
            <Typography variant="h5" sx={{ color: '#FFD700', mb: 3, fontWeight: 700, textAlign: 'center' }}>
              🌟 VIP Community
            </Typography>
            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', mb: 4, textAlign: 'center' }}>
              Tritt unserer exklusiven VIP Community bei und verbinde dich mit Gleichgesinnten auf ihrer Human Design Journey.
            </Typography>
            <Box sx={{ textAlign: 'center' }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<Users size={24} />}
                onClick={() => router.push('/vip-community')}
                sx={{
                  background: 'linear-gradient(45deg, #FFD700, #FFA500)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #FFA500, #FFD700)'
                  },
                  borderRadius: 3,
                  px: 4,
                  py: 2,
                  fontSize: '1.1rem',
                  fontWeight: 700
                }}
              >
                Community beitreten
              </Button>
            </Box>
          </Card>
        </motion.div>

        {/* Booking Dialog */}
        <Dialog
          open={bookingDialog}
          onClose={() => setBookingDialog(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              background: 'rgba(26, 26, 46, 0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 4
            }
          }}
        >
          <DialogTitle sx={{ color: 'white', fontWeight: 700 }}>
            Session buchen - {selectedCoach?.name}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Name"
                  value={bookingData.name}
                  onChange={(e) => setBookingData({ ...bookingData, name: e.target.value })}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                      '&:hover fieldset': { borderColor: '#4ecdc4' }
                    },
                    '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="E-Mail"
                  type="email"
                  value={bookingData.email}
                  onChange={(e) => setBookingData({ ...bookingData, email: e.target.value })}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                      '&:hover fieldset': { borderColor: '#4ecdc4' }
                    },
                    '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Telefon"
                  value={bookingData.phone}
                  onChange={(e) => setBookingData({ ...bookingData, phone: e.target.value })}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                      '&:hover fieldset': { borderColor: '#4ecdc4' }
                    },
                    '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Session-Typ"
                  value={bookingData.sessionType}
                  onChange={(e) => setBookingData({ ...bookingData, sessionType: e.target.value })}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                      '&:hover fieldset': { borderColor: '#4ecdc4' }
                    },
                    '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' }
                  }}
                >
                  {selectedCoach?.sessions.map((session, index) => (
                    <MenuItem key={index} value={session.type}>
                      {session.type} - {session.price} ({session.duration})
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Datum"
                  value={bookingData.date}
                  onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                      '&:hover fieldset': { borderColor: '#4ecdc4' }
                    },
                    '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="time"
                  label="Uhrzeit"
                  value={bookingData.time}
                  onChange={(e) => setBookingData({ ...bookingData, time: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                      '&:hover fieldset': { borderColor: '#4ecdc4' }
                    },
                    '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' }
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Nachricht (optional)"
                  value={bookingData.message}
                  onChange={(e) => setBookingData({ ...bookingData, message: e.target.value })}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                      '&:hover fieldset': { borderColor: '#4ecdc4' }
                    },
                    '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' }
                  }}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button
              onClick={() => setBookingDialog(false)}
              sx={{ color: 'rgba(255,255,255,0.7)' }}
            >
              Abbrechen
            </Button>
            <Button
              onClick={handleBookingSubmit}
              variant="contained"
              disabled={loading}
              sx={{
                background: 'linear-gradient(135deg, #ff6b9d, #c44569)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #ff5a8a, #b83a5a)'
                },
                borderRadius: 2,
                px: 3
              }}
            >
              {loading ? <CircularProgress size={20} /> : 'Buchen'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Chat Dialog */}
        <Dialog
          open={chatDialog}
          onClose={() => setChatDialog(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              background: 'rgba(26, 26, 46, 0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 4,
              height: '70vh'
            }
          }}
        >
          <DialogTitle sx={{ color: 'white', fontWeight: 700, display: 'flex', alignItems: 'center' }}>
            <Avatar src={selectedCoach?.avatar} sx={{ width: 40, height: 40, mr: 2 }} />
            Chat mit {selectedCoach?.name}
          </DialogTitle>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Box sx={{ flex: 1, overflow: 'auto', mb: 2 }}>
              {selectedCoach && messages[selectedCoach.id]?.map((message) => (
                <Box
                  key={message.id}
                  sx={{
                    display: 'flex',
                    justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                    mb: 2
                  }}
                >
                  <Paper
                    sx={{
                      p: 2,
                      maxWidth: '70%',
                      background: message.sender === 'user' 
                        ? 'linear-gradient(45deg, #4ecdc4, #44a08d)'
                        : 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      borderRadius: 3
                    }}
                  >
                    <Typography variant="body2">{message.text}</Typography>
                    <Typography variant="caption" sx={{ opacity: 0.7, display: 'block', mt: 1 }}>
                      {message.timestamp.toLocaleTimeString()}
                    </Typography>
                  </Paper>
                </Box>
              ))}
              {isTyping && (
                <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <Paper sx={{ p: 2, background: 'rgba(255, 255, 255, 0.1)', borderRadius: 3 }}>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                      {selectedCoach?.name} tippt...
                    </Typography>
                  </Paper>
                </Box>
              )}
              <div ref={messagesEndRef} />
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                placeholder="Nachricht schreiben..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                    '&:hover fieldset': { borderColor: '#4ecdc4' }
                  }
                }}
              />
              <Button
                onClick={handleSendMessage}
                variant="contained"
                disabled={!newMessage.trim()}
                sx={{
                  background: 'linear-gradient(135deg, #ff6b9d, #c44569)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #ff5a8a, #b83a5a)'
                  },
                  borderRadius: 2,
                  minWidth: 'auto',
                  px: 2
                }}
              >
                <Send size={20} />
              </Button>
            </Box>
          </DialogContent>
        </Dialog>
        </Container>
      </Box>
    </AccessControl>
  );
}
