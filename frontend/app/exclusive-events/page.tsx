'use client';

import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Grid, 
  Card, 
  CardContent, 
  Avatar, 
  Chip, 
  Button,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  IconButton,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Users, 
  Star, 
  Heart,
  Sparkles,
  Crown,
  Clock,
  MapPin,
  Video,
  MessageCircle,
  Gift,
  Award,
  Zap,
  Moon,
  Sun,
  Globe
} from 'lucide-react';

export default function ExclusiveEventsPage() {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [bookingDialog, setBookingDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  const [events, setEvents] = useState([
    {
      id: 1,
      title: 'VIP Moon Circle',
      description: 'Exklusiver Mondkreis für Premium-Mitglieder mit energetischer Heilung und tiefen Gesprächen',
      date: '2024-01-15',
      time: '19:00',
      duration: '2 Stunden',
      location: 'Online (Zoom)',
      type: 'Workshop',
      attendees: 12,
      maxAttendees: 15,
      price: 'Kostenlos',
      host: 'Sarah Chen',
      hostAvatar: '👩‍💼',
      features: ['Energetische Heilung', 'Mondrituale', 'Gruppendiskussion', 'Meditation'],
      status: 'available',
      category: 'Spiritualität'
    },
    {
      id: 2,
      title: 'Human Design Masterclass',
      description: 'Vertiefende Einblicke in Human Design mit praktischen Übungen und persönlichen Chart-Analysen',
      date: '2024-01-18',
      time: '20:00',
      duration: '3 Stunden',
      location: 'Online (Zoom)',
      type: 'Masterclass',
      attendees: 8,
      maxAttendees: 12,
      price: 'Kostenlos',
      host: 'Michael Rodriguez',
      hostAvatar: '👨‍🎓',
      features: ['Chart-Analyse', 'Praktische Übungen', 'Q&A Session', 'Networking'],
      status: 'available',
      category: 'Bildung'
    },
    {
      id: 3,
      title: 'Premium Dating Workshop',
      description: 'Strategien für erfolgreiches energetisches Dating mit praktischen Tipps und Übungen',
      date: '2024-01-22',
      time: '18:30',
      duration: '2.5 Stunden',
      location: 'Online (Zoom)',
      type: 'Workshop',
      attendees: 15,
      maxAttendees: 20,
      price: 'Kostenlos',
      host: 'Lisa Thompson',
      hostAvatar: '👩‍❤️‍👨',
      features: ['Dating-Strategien', 'Energie-Work', 'Rollenspiele', 'Feedback'],
      status: 'available',
      category: 'Dating'
    },
    {
      id: 4,
      title: 'VIP Networking Event',
      description: 'Exklusives Networking-Event für Premium-Mitglieder mit Speed-Dating und tiefen Gesprächen',
      date: '2024-01-25',
      time: '19:30',
      duration: '3 Stunden',
      location: 'Online (Zoom)',
      type: 'Networking',
      attendees: 20,
      maxAttendees: 25,
      price: 'Kostenlos',
      host: 'David Lee',
      hostAvatar: '👨‍💼',
      features: ['Speed-Dating', 'Networking', 'Gruppendiskussion', 'Preise'],
      status: 'available',
      category: 'Networking'
    },
    {
      id: 5,
      title: 'Energetische Heilung Session',
      description: 'Gruppen-Heilungssession mit Reiki, Meditation und energetischer Reinigung',
      date: '2024-01-28',
      time: '20:00',
      duration: '2 Stunden',
      location: 'Online (Zoom)',
      type: 'Heilung',
      attendees: 10,
      maxAttendees: 15,
      price: 'Kostenlos',
      host: 'Elisabeth Taeubel',
      hostAvatar: '🧘‍♀️',
      features: ['Reiki-Heilung', 'Meditation', 'Energetische Reinigung', 'Gruppenarbeit'],
      status: 'available',
      category: 'Heilung'
    },
    {
      id: 6,
      title: 'Premium Chart Reading',
      description: 'Persönliche Chart-Readings in kleinen Gruppen mit individueller Beratung',
      date: '2024-02-01',
      time: '19:00',
      duration: '2.5 Stunden',
      location: 'Online (Zoom)',
      type: 'Reading',
      attendees: 6,
      maxAttendees: 8,
      price: 'Kostenlos',
      host: 'Elisabeth Weber',
      hostAvatar: '🔮',
      features: ['Persönliche Readings', 'Chart-Analyse', 'Individuelle Beratung', 'Gruppendiskussion'],
      status: 'available',
      category: 'Human Design'
    }
  ]);

  const [upcomingEvents, setUpcomingEvents] = useState([
    {
      id: 1,
      title: 'VIP Moon Circle',
      date: '2024-01-15',
      time: '19:00',
      status: 'Bestätigt',
      meetingLink: 'https://zoom.us/j/123456789'
    },
    {
      id: 2,
      title: 'Human Design Masterclass',
      date: '2024-01-18',
      time: '20:00',
      status: 'Wartend',
      meetingLink: null
    }
  ]);

  const handleBookEvent = (event) => {
    setSelectedEvent(event);
    setBookingDialog(true);
  };

  const handleConfirmBooking = () => {
    // Booking logic here
    setBookingDialog(false);
    setSelectedEvent(null);
  };

  const getEventTypeColor = (type) => {
    switch (type) {
      case 'Workshop': return '#8b5cf6';
      case 'Masterclass': return '#06b6d4';
      case 'Networking': return '#10b981';
      case 'Heilung': return '#f59e0b';
      case 'Reading': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getEventTypeIcon = (type) => {
    switch (type) {
      case 'Workshop': return <Users size={20} />;
      case 'Masterclass': return <Star size={20} />;
      case 'Networking': return <MessageCircle size={20} />;
      case 'Heilung': return <Heart size={20} />;
      case 'Reading': return <Sparkles size={20} />;
      default: return <Calendar size={20} />;
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      color: 'white',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Floating Stars Background */}
      <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden' }}>
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            style={{
              position: 'absolute',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              color: 'rgba(255, 255, 255, 0.3)',
              fontSize: '12px'
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          >
            ✨
          </motion.div>
        ))}
      </Box>

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1, py: 4 }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
              <Calendar size={48} color="#8b5cf6" />
              <Typography variant="h2" sx={{ ml: 2, fontWeight: 700, background: 'linear-gradient(45deg, #8b5cf6, #3b82f6)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Exklusive Events
              </Typography>
            </Box>
            <Typography variant="h5" sx={{ color: 'rgba(255, 255, 255, 0.8)', mb: 3 }}>
              Premium-Veranstaltungen nur für VIP-Mitglieder
            </Typography>
            <Chip 
              icon={<Crown size={16} />} 
              label="VIP Exklusiv" 
              sx={{ 
                background: 'linear-gradient(45deg, #f59e0b, #ffd700)',
                color: 'white',
                fontWeight: 600,
                px: 2,
                py: 1
              }} 
            />
          </Box>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <Grid container spacing={4} sx={{ mb: 6 }}>
            <Grid item xs={12} md={3}>
              <Paper elevation={0} sx={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 3,
                p: 3,
                textAlign: 'center'
              }}>
                <Calendar size={32} color="#8b5cf6" />
                <Typography variant="h4" sx={{ fontWeight: 700, mt: 1 }}>6</Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Verfügbare Events</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={3}>
              <Paper elevation={0} sx={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 3,
                p: 3,
                textAlign: 'center'
              }}>
                <Users size={32} color="#06b6d4" />
                <Typography variant="h4" sx={{ fontWeight: 700, mt: 1 }}>71</Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Teilnehmer</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={3}>
              <Paper elevation={0} sx={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 3,
                p: 3,
                textAlign: 'center'
              }}>
                <Star size={32} color="#10b981" />
                <Typography variant="h4" sx={{ fontWeight: 700, mt: 1 }}>4.9</Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Durchschnittsbewertung</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={3}>
              <Paper elevation={0} sx={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 3,
                p: 3,
                textAlign: 'center'
              }}>
                <Crown size={32} color="#f59e0b" />
                <Typography variant="h4" sx={{ fontWeight: 700, mt: 1 }}>100%</Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>VIP Exklusiv</Typography>
              </Paper>
            </Grid>
          </Grid>
        </motion.div>

        <Grid container spacing={4}>
          {/* Available Events */}
          <Grid item xs={12} md={8}>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
                Verfügbare Events
              </Typography>
              <Grid container spacing={3}>
                {events.map((event, index) => (
                  <Grid item xs={12} md={6} key={event.id}>
                    <Paper elevation={0} sx={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: 3,
                      p: 3,
                      height: '100%',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        borderColor: 'rgba(139, 92, 246, 0.3)'
                      }
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Box sx={{
                          width: 50,
                          height: 50,
                          borderRadius: '50%',
                          background: `linear-gradient(45deg, ${getEventTypeColor(event.type)}, ${getEventTypeColor(event.type)}80)`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mr: 2,
                          color: 'white'
                        }}>
                          {getEventTypeIcon(event.type)}
                        </Box>
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            {event.title}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                            {event.type} • {event.category}
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Typography variant="body2" sx={{ mb: 2, color: 'rgba(255, 255, 255, 0.8)', lineHeight: 1.5 }}>
                        {event.description}
                      </Typography>

                      <Box sx={{ mb: 2 }}>
                        {event.features.map((feature, idx) => (
                          <Chip 
                            key={idx}
                            label={feature} 
                            size="small" 
                            sx={{ 
                              mr: 1,
                              mb: 1,
                              background: 'rgba(139, 92, 246, 0.2)',
                              color: '#8b5cf6',
                              fontSize: '10px'
                            }} 
                          />
                        ))}
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <Clock size={16} color="rgba(255, 255, 255, 0.6)" />
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                          {event.date} um {event.time} ({event.duration})
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <MapPin size={16} color="rgba(255, 255, 255, 0.6)" />
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                          {event.location}
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <Users size={16} color="rgba(255, 255, 255, 0.6)" />
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                          {event.attendees}/{event.maxAttendees} Teilnehmer
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Avatar sx={{ width: 24, height: 24, fontSize: '12px' }}>
                            {event.hostAvatar}
                          </Avatar>
                          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                            Host: {event.host}
                          </Typography>
                        </Box>
                        <Chip 
                          label={event.price} 
                          size="small" 
                          sx={{ 
                            background: 'rgba(16, 185, 129, 0.2)',
                            color: '#10b981',
                            fontSize: '10px'
                          }} 
                        />
                      </Box>

                      <Button 
                        fullWidth 
                        variant="contained"
                        onClick={() => handleBookEvent(event)}
                        sx={{ 
                          background: 'linear-gradient(45deg, #8b5cf6, #3b82f6)',
                          color: 'white',
                          fontWeight: 600,
                          py: 1.5,
                          '&:hover': {
                            background: 'linear-gradient(45deg, #7c3aed, #2563eb)'
                          }
                        }}
                      >
                        Event buchen
                      </Button>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </motion.div>
          </Grid>

          {/* Upcoming Events */}
          <Grid item xs={12} md={4}>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <Paper elevation={0} sx={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 3,
                p: 3,
                height: 'fit-content'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Calendar size={24} color="#06b6d4" />
                  <Typography variant="h5" sx={{ ml: 2, fontWeight: 600 }}>Deine Events</Typography>
                </Box>
                
                {upcomingEvents.map((event, index) => (
                  <Box key={event.id} sx={{ mb: 3, p: 2, background: 'rgba(255, 255, 255, 0.05)', borderRadius: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Avatar sx={{ 
                        width: 40,
                        height: 40,
                        fontSize: '16px',
                        mr: 2,
                        background: 'linear-gradient(45deg, #06b6d4, #0891b2)'
                      }}>
                        📅
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {event.title}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                          {event.date} um {event.time}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Chip 
                        label={event.status} 
                        size="small" 
                        sx={{ 
                          background: event.status === 'Bestätigt' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                          color: event.status === 'Bestätigt' ? '#10b981' : '#f59e0b',
                          fontSize: '10px'
                        }} 
                      />
                      {event.meetingLink && (
                        <Button
                          size="small"
                          startIcon={<Video size={16} />}
                          sx={{ 
                            color: '#06b6d4',
                            fontSize: '12px',
                            minWidth: 'auto'
                          }}
                        >
                          Beitreten
                        </Button>
                      )}
                    </Box>
                  </Box>
                ))}
              </Paper>
            </motion.div>
          </Grid>
        </Grid>
      </Container>

      {/* Booking Dialog */}
      <Dialog 
        open={bookingDialog} 
        onClose={() => setBookingDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            background: 'rgba(26, 26, 46, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: 'white'
          }
        }}
      >
        <DialogTitle sx={{ 
          background: 'linear-gradient(45deg, #8b5cf6, #3b82f6)',
          color: 'white',
          fontWeight: 600
        }}>
          Event buchen
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          {selectedEvent && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 1 }}>
                {selectedEvent.title}
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                {selectedEvent.description}
              </Typography>
            </Box>
          )}
          
          <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
            Möchten Sie dieses exklusive Event buchen? Sie erhalten eine Bestätigung per E-Mail.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button 
            onClick={() => setBookingDialog(false)}
            sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
          >
            Abbrechen
          </Button>
          <Button 
            onClick={handleConfirmBooking}
            variant="contained"
            sx={{ 
              background: 'linear-gradient(45deg, #8b5cf6, #3b82f6)',
              color: 'white',
              fontWeight: 600
            }}
          >
            Event buchen
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
