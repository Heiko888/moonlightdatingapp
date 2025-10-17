"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
// Ungenutzte Imports entfernt für bessere Performance
import { 
  Box, 
  Container, 
  Typography, 
  Card, 
  CardContent, 
  Button, 
  Grid, 
  Chip, 
  Avatar,
  LinearProgress,
  IconButton,
  Badge,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  // Tabs und Tab entfernt - nicht verwendet
  TextField,
  InputAdornment,
  // Fab entfernt - nicht verwendet
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  Heart,
  MessageCircle,
  // Star entfernt - nicht verwendet
  Filter,
  Search,
  Users,
  // Zap und Eye entfernt - nicht verwendet
  Send,
  // MoreVertical entfernt - nicht verwendet
  Phone,
  Video,
  MapPin,
  // Calendar und Clock entfernt - nicht verwendet
  ChevronRight,
  Sparkles,
  Target,
  // TrendingUp und Award entfernt - nicht verwendet
  Crown,
  // Flame entfernt - nicht verwendet
} from 'lucide-react';

interface ProfileImage {
  id: string;
  url: string;
  is_primary: boolean;
  uploaded_at: string;
  order: number;
  alt_text?: string;
}

interface Match {
  id: string;
  userId: string;
  name: string;
  age: number;
  location: string;
  avatar: string;
  profile_images?: ProfileImage[]; // Neue: Mehrere Profilbilder
  hdType: string;
  compatibility: number;
  lastMessage?: string;
  lastMessageTime?: string;
  isOnline: boolean;
  isNewMatch: boolean;
  mutualInterests: string[];
  profile: {
    bio: string;
    interests: string[];
    lifestyle: string[];
    goals: string[];
  };
}

interface MatchMessage {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
}

interface MatchStats {
  totalMatches: number;
  newMatches: number;
  conversations: number;
  superLikes: number;
}

export default function MatchingPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string>('');
  // isClient State entfernt für bessere Performance
  const [loading, setLoading] = useState(true);
  // activeTab und setActiveTab entfernt - nicht verwendet
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [showMatchDialog, setShowMatchDialog] = useState(false);
  const [messages, setMessages] = useState<MatchMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');

  // Mock-Daten für Matches
  const [matches, setMatches] = useState<Match[]>([
    {
      id: '1',
      userId: 'user2',
      name: 'Sarah M.',
      age: 28,
      location: 'Berlin',
      avatar: '/api/placeholder/60/60',
      profile_images: [
        {
          id: '1',
          url: '/api/placeholder/400/600',
          is_primary: true,
          uploaded_at: '2024-01-15T10:00:00Z',
          order: 0,
          alt_text: 'Sarah am Strand'
        },
        {
          id: '2',
          url: '/api/placeholder/400/600',
          is_primary: false,
          uploaded_at: '2024-01-16T14:30:00Z',
          order: 1,
          alt_text: 'Sarah beim Yoga'
        },
        {
          id: '3',
          url: '/api/placeholder/400/600',
          is_primary: false,
          uploaded_at: '2024-01-17T18:45:00Z',
          order: 2,
          alt_text: 'Sarah in der Natur'
        }
      ],
      hdType: 'Generator',
      compatibility: 92,
      lastMessage: 'Hey! Wie war dein Tag?',
      lastMessageTime: 'vor 2 Min',
      isOnline: true,
      isNewMatch: false,
      mutualInterests: ['Astrologie', 'Meditation', 'Yoga'],
      profile: {
        bio: 'Liebe es, neue Menschen kennenzulernen und tiefe Gespräche zu führen.',
        interests: ['Astrologie', 'Meditation', 'Yoga', 'Reisen'],
        lifestyle: ['Vegetarisch', 'Sportlich', 'Spirituell'],
        goals: ['Persönliches Wachstum', 'Gesunde Beziehungen']
      }
    },
    {
      id: '2',
      userId: 'user3',
      name: 'Michael K.',
      age: 32,
      location: 'München',
      avatar: '/api/placeholder/60/60',
      profile_images: [
        {
          id: '4',
          url: '/api/placeholder/400/600',
          is_primary: true,
          uploaded_at: '2024-01-18T09:15:00Z',
          order: 0,
          alt_text: 'Michael beim Coaching'
        },
        {
          id: '5',
          url: '/api/placeholder/400/600',
          is_primary: false,
          uploaded_at: '2024-01-19T16:20:00Z',
          order: 1,
          alt_text: 'Michael in der Natur'
        }
      ],
      hdType: 'Projector',
      compatibility: 87,
      lastMessage: 'Das klingt interessant! Erzähl mir mehr.',
      lastMessageTime: 'vor 15 Min',
      isOnline: false,
      isNewMatch: true,
      mutualInterests: ['Human Design', 'Coaching', 'Bücher'],
      profile: {
        bio: 'Coach und Human Design Enthusiast. Liebe es, Menschen zu helfen, ihre wahre Natur zu entdecken.',
        interests: ['Human Design', 'Coaching', 'Bücher', 'Philosophie'],
        lifestyle: ['Gesund', 'Bewusst', 'Lernend'],
        goals: ['Anderen helfen', 'Wissen teilen']
      }
    },
    {
      id: '3',
      userId: 'user4',
      name: 'Anna L.',
      age: 26,
      location: 'Hamburg',
      avatar: '/api/placeholder/60/60',
      hdType: 'Manifestor',
      compatibility: 78,
      lastMessage: 'Wann können wir uns treffen?',
      lastMessageTime: 'vor 1 Std',
      isOnline: true,
      isNewMatch: false,
      mutualInterests: ['Kreativität', 'Kunst', 'Musik'],
      profile: {
        bio: 'Künstlerin und Manifestor. Schaffe gerne und inspiriere andere.',
        interests: ['Kunst', 'Musik', 'Kreativität', 'Design'],
        lifestyle: ['Kreativ', 'Frei', 'Inspirierend'],
        goals: ['Kunst schaffen', 'Inspirieren']
      }
    },
    {
      id: '4',
      userId: 'user5',
      name: 'Tom R.',
      age: 30,
      location: 'Köln',
      avatar: '/api/placeholder/60/60',
      hdType: 'Reflector',
      compatibility: 85,
      lastMessage: 'Danke für das schöne Gespräch!',
      lastMessageTime: 'vor 3 Std',
      isOnline: false,
      isNewMatch: true,
      mutualInterests: ['Spiritualität', 'Natur', 'Reflexion'],
      profile: {
        bio: 'Reflector, der die Welt durch verschiedene Perspektiven betrachtet.',
        interests: ['Spiritualität', 'Natur', 'Reflexion', 'Philosophie'],
        lifestyle: ['Ruhig', 'Nachdenklich', 'Naturnah'],
        goals: ['Verstehen', 'Reflektieren', 'Wachsen']
      }
    }
  ]);

  const [matchStats] = useState<MatchStats>({
    totalMatches: 24,
    newMatches: 3,
    conversations: 8,
    superLikes: 5
  });

  useEffect(() => {
    const loadMatches = async () => {
      try {
        // SSR-sicherer localStorage Zugriff
        let currentUserId = 'demo-user';
        if (typeof window !== 'undefined') {
          const userData = localStorage.getItem('userData');
          if (userData) {
            const user = JSON.parse(userData);
            currentUserId = user.id;
          }
        }
        setUserId(currentUserId);

        // Lade echte Matches aus der Datenbank
        const response = await fetch(`/api/matches?userId=${currentUserId}&limit=20`);
        const data = await response.json();

        if (data.success && data.matches && data.matches.length > 0) {
          // Verwende echte Daten aus der Datenbank
          setMatches(data.matches);
          console.log('✅ Matches aus Datenbank geladen:', data.matches.length);
        } else {
          // Fallback auf Mock-Daten, wenn keine Daten in der DB
          console.log('⚠️ Keine Matches in Datenbank, verwende Mock-Daten');
        }
        
      } catch (error) {
        console.error('Fehler beim Laden der Matches:', error);
        // Bei Fehler: Mock-Daten bleiben erhalten
      } finally {
        setLoading(false);
      }
    };

    loadMatches();
  }, [router]);

  const filteredMatches = matches.filter(match =>
    match.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    match.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    match.hdType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleMatchClick = (match: Match) => {
    console.log('Match clicked:', match.name); // Debug-Log
    setSelectedMatch(match);
    setShowMatchDialog(true);
    // Simuliere das Laden von Nachrichten
    setMessages([
      {
        id: '1',
        senderId: match.userId,
        content: 'Hey! Schön, dass wir uns gefunden haben!',
        timestamp: new Date(Date.now() - 3600000),
        isRead: true
      },
      {
        id: '2',
        senderId: userId,
        content: 'Ja, das freut mich auch sehr!',
        timestamp: new Date(Date.now() - 3500000),
        isRead: true
      },
      {
        id: '3',
        senderId: match.userId,
        content: match.lastMessage || 'Wie geht es dir?',
        timestamp: new Date(Date.now() - 120000),
        isRead: false
      }
    ]);
  };

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedMatch) {
      const message: MatchMessage = {
        id: Date.now().toString(),
        senderId: userId,
        content: newMessage,
        timestamp: new Date(),
        isRead: false
      };
      setMessages(prev => [...prev, message]);
      setNewMessage('');
      
      // Aktualisiere den letzten Nachricht in den Matches
      setMatches(prev => prev.map(match => 
        match.id === selectedMatch.id 
          ? { ...match, lastMessage: newMessage, lastMessageTime: 'Jetzt' }
          : match
      ));
    }
  };

  const getCompatibilityColor = (score: number) => {
    if (score >= 90) return '#4CAF50';
    if (score >= 80) return '#8BC34A';
    if (score >= 70) return '#FFC107';
    return '#FF9800';
  };

  const getHDTypeColor = (type: string) => {
    const colors = {
      'Generator': '#4ECDC4',
      'Manifesting Generator': '#45B7D1',
      'Manifestor': '#FF6B6B',
      'Projector': '#96CEB4',
      'Reflector': '#8B5CF6'
    };
    return colors[type as keyof typeof colors] || '#FFD700';
  };

  if (loading) {
    return (
      <Box sx={{ 
        minHeight: '100vh',
        background: `
          radial-gradient(circle at 20% 20%, rgba(255, 107, 157, 0.15) 0%, transparent 50%),
          radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.15) 0%, transparent 50%),
          radial-gradient(circle at 40% 60%, rgba(78, 205, 196, 0.15) 0%, transparent 50%),
          linear-gradient(135deg, #0F0F23 0%, #1A1A2E 100%)
        `,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Box sx={{ textAlign: 'center' }}>
          <LinearProgress sx={{ 
            width: 200, 
            mb: 2,
            '& .MuiLinearProgress-bar': {
              background: 'linear-gradient(135deg, #ff6b9d, #c44569)'
            }
          }} />
          <Typography variant="h6" sx={{ 
            background: 'linear-gradient(135deg, #ff6b9d, #c44569)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Lade Matches...
          </Typography>
        </Box>
      </Box>
    );
  }


  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: `
        radial-gradient(circle at 20% 20%, rgba(255, 107, 157, 0.15) 0%, transparent 50%),
        radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.15) 0%, transparent 50%),
        radial-gradient(circle at 40% 60%, rgba(78, 205, 196, 0.15) 0%, transparent 50%),
        linear-gradient(135deg, #0F0F23 0%, #1A1A2E 100%)
      `,
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Feste Navigation */}
      <Box sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: 'rgba(15, 15, 35, 0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.3)'
      }}>
        <Container maxWidth="lg">
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            py: 2
          }}>
            {/* Logo */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="h5" sx={{ 
                fontWeight: 800,
                background: 'linear-gradient(135deg, #4ecdc4, #8b5cf6, #ff6b9d)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                cursor: 'pointer',
                textDecoration: 'none'
              }}
              onClick={() => router.push('/')}>
                🔑 The Connection Key
              </Typography>
            </Box>
            {/* Navigation Buttons */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                onClick={() => router.push('/dating-info')}
                variant="outlined"
                sx={{
                  borderColor: 'rgba(255,255,255,0.3)',
                  color: 'white',
                  borderRadius: 3,
                  textTransform: 'none',
                  fontWeight: 600,
                  '&:hover': {
                    borderColor: '#ff6b9d',
                    backgroundColor: 'rgba(255, 107, 157, 0.1)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 15px rgba(255, 107, 157, 0.2)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Info
              </Button>
              <Button
                onClick={() => router.push('/dashboard')}
                variant="contained"
                sx={{
                  background: 'linear-gradient(135deg, #ff6b9d, #c44569)',
                  borderRadius: 3,
                  textTransform: 'none',
                  fontWeight: 600,
                  boxShadow: '0 4px 15px rgba(255, 107, 157, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #ff5a8a, #c44569)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(255, 107, 157, 0.4)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Dashboard
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2, pt: 15, pb: 6 }}>
        <motion.div
          
          
          
        >
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <motion.div
              
              
              
            >
              <Typography variant="h2" sx={{ 
                fontWeight: 800, 
                mb: 2,
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                background: 'linear-gradient(135deg, #4ecdc4, #8b5cf6, #ff6b9d)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 0 30px rgba(78, 205, 196, 0.3)'
              }}>
                💕 Deine Matches
              </Typography>
              <Typography variant="h6" sx={{ 
                color: 'rgba(255,255,255,0.85)', 
                maxWidth: 600, 
                mx: 'auto',
                lineHeight: 1.6,
                fontSize: { xs: '1rem', md: '1.25rem' }
              }}>
                Entdecke Menschen, die energetisch zu dir passen und echte Verbindungen schaffen.
              </Typography>
            </motion.div>
          </Box>

          {/* Statistiken */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Grid container spacing={3} sx={{ mb: 6 }}>
              {[
                { label: 'Gesamt Matches', value: matchStats.totalMatches, icon: Heart, color: '#ff6b9d' },
                { label: 'Neue Matches', value: matchStats.newMatches, icon: Sparkles, color: '#8b5cf6' },
                { label: 'Gespräche', value: matchStats.conversations, icon: MessageCircle, color: '#4ecdc4' },
                { label: 'Super Likes', value: matchStats.superLikes, icon: Crown, color: '#ffd700' }
              ].map((stat, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.1 * index }}
                    whileHover={{ y: -8 }}
                  >
                    <Card sx={{
                      background: 'rgba(255, 255, 255, 0.08)',
                      backdropFilter: 'blur(20px)',
                      borderRadius: 4,
                      border: '1px solid rgba(255,255,255,0.2)',
                      p: 3,
                      textAlign: 'center',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                      '&:hover': {
                        boxShadow: `0 20px 40px ${stat.color}30`,
                        border: `1px solid ${stat.color}`,
                        background: 'rgba(255, 255, 255, 0.12)'
                      }
                    }}>
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        mb: 2
                      }}>
                        <Box sx={{
                          p: 2,
                          borderRadius: '50%',
                          background: `linear-gradient(135deg, ${stat.color}30, ${stat.color}50)`,
                          border: `2px solid ${stat.color}`,
                          boxShadow: `0 4px 15px ${stat.color}40`
                        }}>
                          <stat.icon size={28} color={stat.color} />
                        </Box>
                      </Box>
                      <Typography variant="h3" sx={{ 
                        color: stat.color, 
                        fontWeight: 900,
                        mb: 1,
                        fontSize: { xs: '2rem', md: '2.5rem' }
                      }}>
                        {stat.value}
                      </Typography>
                      <Typography variant="body2" sx={{ 
                        color: 'rgba(255,255,255,0.9)',
                        fontWeight: 600,
                        fontSize: '0.95rem'
                      }}>
                        {stat.label}
                      </Typography>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>

          {/* Suchleiste */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Box sx={{ mb: 4 }}>
              <TextField
                fullWidth
                placeholder="Suche nach Namen, Ort oder HD-Typ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search size={20} color="#ff6b9d" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton>
                        <Filter size={20} color="#ff6b9d" />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    background: 'rgba(255, 255, 255, 0.08)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: 4,
                    border: '1px solid rgba(255,255,255,0.2)',
                    color: 'white',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.3s ease',
                    '& fieldset': {
                      border: 'none'
                    },
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.12)',
                      border: '1px solid rgba(255, 107, 157, 0.4)',
                      boxShadow: '0 8px 32px rgba(255, 107, 157, 0.2)'
                    },
                    '&.Mui-focused': {
                      background: 'rgba(255, 255, 255, 0.12)',
                      border: '1px solid #ff6b9d',
                      boxShadow: '0 8px 32px rgba(255, 107, 157, 0.3)'
                    }
                  },
                  '& .MuiInputBase-input::placeholder': {
                    color: 'rgba(255,255,255,0.6)'
                  }
                }}
              />
            </Box>
          </motion.div>

          {/* Matches Liste */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Card sx={{
              background: 'rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(20px)',
              borderRadius: 4,
              border: '1px solid rgba(255,255,255,0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
            }}>
              <CardContent sx={{ p: 0 }}>
                {filteredMatches.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 6 }}>
                    <Heart size={64} color="#ff6b9d" style={{ marginBottom: 16 }} />
                    <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                      {matches.length === 0 ? 'Demo-Matches werden geladen...' : 'Keine Matches gefunden'}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 3 }}>
                      {matches.length === 0 ? 'Lade Demo-Daten...' : (searchTerm ? 'Versuche andere Suchbegriffe.' : 'Starte das Dating und finde deine perfekten Matches!')}
                    </Typography>
                    <Button
                      variant="contained"
                      onClick={() => router.push('/dating')}
                      sx={{
                        background: 'linear-gradient(135deg, #ff6b9d, #c44569)',
                        color: 'white',
                        fontWeight: 600,
                        px: 4,
                        py: 1.5,
                        borderRadius: 3,
                        boxShadow: '0 8px 25px rgba(255, 107, 157, 0.4)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #ff5a8a, #c44569)',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 12px 35px rgba(255, 107, 157, 0.6)'
                        },
                        transition: 'all 0.3s ease'
                      }}
                    >
                      Dating starten
                    </Button>
                  </Box>
                ) : (
                  <List>
                    {filteredMatches.map((match, index) => (
                      <motion.div
                        key={match.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 * index }}
                      >
                        <ListItem 
                          sx={{ 
                            px: 3, 
                            py: 2,
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            borderRadius: 2,
                            '&:hover': {
                              background: 'rgba(255, 107, 157, 0.1)',
                              boxShadow: '0 4px 15px rgba(255, 107, 157, 0.2)'
                            }
                          }}
                          onClick={(e) => {
                            console.log('ListItem clicked for:', match.name); // Debug-Log
                            handleMatchClick(match);
                          }}
                        >
                          <ListItemAvatar>
                            <Badge
                              overlap="circular"
                              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                              badgeContent={
                                match.isOnline ? (
                                  <Box sx={{
                                    width: 12,
                                    height: 12,
                                    borderRadius: '50%',
                                    background: '#4ecdc4',
                                    border: '2px solid #1a1a2e',
                                    boxShadow: '0 2px 8px rgba(78, 205, 196, 0.6)'
                                  }} />
                                ) : null
                              }
                            >
                              <Avatar 
                                sx={{ 
                                  width: 60, 
                                  height: 60,
                                  border: match.isNewMatch ? '3px solid #8b5cf6' : '3px solid #ff6b9d',
                                  position: 'relative',
                                  boxShadow: match.isNewMatch 
                                    ? '0 4px 15px rgba(139, 92, 246, 0.4)' 
                                    : '0 4px 15px rgba(255, 107, 157, 0.4)'
                                }}
                                src={
                                  match.profile_images && match.profile_images.length > 0 
                                    ? match.profile_images.find(img => img.is_primary)?.url || match.profile_images[0].url
                                    : match.avatar
                                }
                              >
                                <Users size={30} />
                              </Avatar>
                              {/* Bildergalerie-Indikator */}
                              {match.profile_images && match.profile_images.length > 1 && (
                                <Box sx={{
                                  position: 'absolute',
                                  bottom: -2,
                                  right: -2,
                                  background: 'linear-gradient(135deg, #ff6b9d, #8b5cf6)',
                                  borderRadius: '50%',
                                  width: 20,
                                  height: 20,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontSize: '10px',
                                  fontWeight: 'bold',
                                  color: 'white',
                                  border: '2px solid #1a1a2e',
                                  boxShadow: '0 2px 8px rgba(255, 107, 157, 0.4)'
                                }}>
                                  {match.profile_images.length}
                                </Box>
                              )}
                            </Badge>
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                                  {match.name}, {match.age}
                                </Typography>
                                {match.isNewMatch && (
                                  <Chip
                                    label="NEU"
                                    size="small"
                                    sx={{
                                      background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
                                      color: 'white',
                                      fontWeight: 700,
                                      fontSize: '0.7rem',
                                      boxShadow: '0 2px 8px rgba(139, 92, 246, 0.4)'
                                    }}
                                  />
                                )}
                              </Box>
                            }
                            secondary={
                              <Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <MapPin size={14} color="#4ecdc4" />
                                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                      {match.location}
                                    </Typography>
                                  </Box>
                                  <Chip
                                    label={match.hdType}
                                    size="small"
                                    sx={{
                                      background: `${getHDTypeColor(match.hdType)}20`,
                                      color: getHDTypeColor(match.hdType),
                                      border: `1px solid ${getHDTypeColor(match.hdType)}`,
                                      fontSize: '0.7rem'
                                    }}
                                  />
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <Target size={14} color={getCompatibilityColor(match.compatibility)} />
                                    <Typography variant="body2" sx={{ color: getCompatibilityColor(match.compatibility), fontWeight: 600 }}>
                                      {match.compatibility}%
                                    </Typography>
                                  </Box>
                                </Box>
                                {match.lastMessage && (
                                  <Typography variant="body2" sx={{ 
                                    color: 'rgba(255,255,255,0.6)',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 1,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden'
                                  }}>
                                    {match.lastMessage}
                                  </Typography>
                                )}
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                                    {match.lastMessageTime}
                                  </Typography>
                                  {match.mutualInterests.length > 0 && (
                                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                                      {match.mutualInterests.slice(0, 2).map((interest, i) => (
                                        <Chip
                                          key={i}
                                          label={interest}
                                          size="small"
                                          sx={{
                                            background: 'rgba(78, 205, 196, 0.2)',
                                            color: '#4ecdc4',
                                            border: '1px solid rgba(78, 205, 196, 0.4)',
                                            fontSize: '0.6rem',
                                            height: 20,
                                            fontWeight: 600
                                          }}
                                        />
                                      ))}
                                    </Box>
                                  )}
                                </Box>
                              </Box>
                            }
                          />
                          <ListItemSecondaryAction>
                            <IconButton 
                              edge="end" 
                              sx={{ 
                                color: '#ff6b9d',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                  color: '#ff5a8a',
                                  background: 'rgba(255, 107, 157, 0.1)',
                                  transform: 'scale(1.1)'
                                }
                              }}
                              onClick={(e) => {
                                e.stopPropagation(); // Verhindere Event-Bubbling
                                console.log('Arrow clicked for:', match.name); // Debug-Log
                                handleMatchClick(match);
                              }}
                            >
                              <ChevronRight size={20} />
                            </IconButton>
                          </ListItemSecondaryAction>
                        </ListItem>
                        {index < filteredMatches.length - 1 && <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />}
                      </motion.div>
                    ))}
                  </List>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </Container>

      {/* Match Dialog */}
      <Dialog
        open={showMatchDialog}
        onClose={() => setShowMatchDialog(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            background: `
              radial-gradient(circle at 20% 20%, rgba(255, 107, 157, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 80%, rgba(78, 205, 196, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 40% 60%, rgba(102, 126, 234, 0.1) 0%, transparent 50%),
              linear-gradient(135deg, #0F0F23 0%, #1A1A2E 100%)
            `,
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: 4,
            height: '80vh',
            color: 'white'
          }
        }}
      >
        {selectedMatch && (
          <>
            <DialogTitle sx={{ 
              color: '#ff6b9d', 
              fontWeight: 700, 
              textAlign: 'center',
              borderBottom: '1px solid rgba(255,255,255,0.1)',
              pb: 2
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                <Avatar 
                  src={
                    selectedMatch.profile_images && selectedMatch.profile_images.length > 0 
                      ? selectedMatch.profile_images.find(img => img.is_primary)?.url || selectedMatch.profile_images[0].url
                      : selectedMatch.avatar
                  }
                  sx={{ 
                    width: 50, 
                    height: 50, 
                    border: '3px solid #ff6b9d',
                    boxShadow: '0 4px 15px rgba(255, 107, 157, 0.4)'
                  }}
                />
                <Box>
                  <Typography variant="h6" sx={{ 
                    background: 'linear-gradient(135deg, #ff6b9d, #8b5cf6)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontWeight: 700
                  }}>
                    {selectedMatch.name}, {selectedMatch.age}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                    {selectedMatch.location} • {selectedMatch.hdType}
                  </Typography>
                  {/* Bildergalerie-Indikator */}
                  {selectedMatch.profile_images && selectedMatch.profile_images.length > 1 && (
                    <Chip 
                      label={`${selectedMatch.profile_images.length} Bilder`}
                      size="small"
                      sx={{
                        background: 'linear-gradient(135deg, #ff6b9d, #8b5cf6)',
                        color: 'white',
                        fontWeight: 'bold',
                        mt: 0.5,
                        boxShadow: '0 2px 8px rgba(255, 107, 157, 0.4)'
                      }}
                    />
                  )}
                </Box>
              </Box>
            </DialogTitle>
            <DialogContent sx={{ p: 0, display: 'flex', flexDirection: 'column' }}>
              {/* Profilbilder-Galerie */}
              {selectedMatch.profile_images && selectedMatch.profile_images.length > 0 && (
                <Box sx={{ p: 3, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  <Typography variant="h6" sx={{ 
                    background: 'linear-gradient(135deg, #ff6b9d, #8b5cf6)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: 2, 
                    fontWeight: 600 
                  }}>
                    📸 Profilbilder
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, overflow: 'auto', pb: 1 }}>
                    {selectedMatch.profile_images.map((image, index) => (
                      <Box
                        key={image.id}
                        sx={{
                          minWidth: 120,
                          height: 120,
                          borderRadius: 2,
                          overflow: 'hidden',
                          cursor: 'pointer',
                          border: image.is_primary ? '3px solid #ff6b9d' : '2px solid rgba(255,255,255,0.2)',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'scale(1.05)',
                            boxShadow: '0 8px 25px rgba(255, 107, 157, 0.4)'
                          }
                        }}
                        onClick={() => window.open(image.url, '_blank')}
                      >
                        <Image
                          src={image.url}
                          alt={image.alt_text || `Bild ${index + 1}`}
                          width={120}
                          height={120}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                        />
                        {image.is_primary && (
                          <Box sx={{
                            position: 'absolute',
                            top: 4,
                            right: 4,
                            background: '#ff6b9d',
                            color: 'white',
                            borderRadius: '50%',
                            width: 20,
                            height: 20,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '10px',
                            fontWeight: 'bold',
                            boxShadow: '0 2px 8px rgba(255, 107, 157, 0.4)'
                          }}>
                            ⭐
                          </Box>
                        )}
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}
              
              {/* Chat Messages */}
              <Box sx={{ flex: 1, p: 3, overflow: 'auto' }}>
                {messages.map((message) => (
                  <Box
                    key={message.id}
                    sx={{
                      display: 'flex',
                      justifyContent: message.senderId === userId ? 'flex-end' : 'flex-start',
                      mb: 2
                    }}
                  >
                    <Box sx={{
                      maxWidth: '70%',
                      p: 2,
                      borderRadius: 3,
                      background: message.senderId === userId 
                        ? 'linear-gradient(135deg, #ff6b9d, #c44569)'
                        : 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      boxShadow: message.senderId === userId 
                        ? '0 4px 15px rgba(255, 107, 157, 0.3)'
                        : 'none'
                    }}>
                      <Typography variant="body1">{message.content}</Typography>
                      <Typography variant="caption" sx={{ 
                        opacity: 0.7,
                        display: 'block',
                        mt: 0.5
                      }}>
                        {message.timestamp.toLocaleTimeString('de-DE', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
              
              {/* Message Input */}
              <Box sx={{ 
                p: 3, 
                borderTop: '1px solid rgba(255,255,255,0.1)',
                display: 'flex',
                gap: 2
              }}>
                <TextField
                  fullWidth
                  placeholder="Nachricht schreiben..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: 3,
                      border: '1px solid rgba(255,255,255,0.2)',
                      color: 'white',
                      '& fieldset': {
                        border: 'none'
                      }
                    }
                  }}
                />
                <IconButton
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  sx={{
                    background: 'linear-gradient(135deg, #ff6b9d, #c44569)',
                    color: 'white',
                    boxShadow: '0 4px 15px rgba(255, 107, 157, 0.4)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #ff5a8a, #c44569)',
                      transform: 'scale(1.05)',
                      boxShadow: '0 6px 20px rgba(255, 107, 157, 0.6)'
                    },
                    '&:disabled': {
                      background: 'rgba(255,255,255,0.1)',
                      color: 'rgba(255,255,255,0.3)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  <Send size={20} />
                </IconButton>
              </Box>
            </DialogContent>
            <DialogActions sx={{ p: 3, gap: 2, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              <Button
                onClick={() => setShowMatchDialog(false)}
                sx={{ 
                  color: 'rgba(255,255,255,0.7)',
                  '&:hover': {
                    color: 'white',
                    background: 'rgba(255, 255, 255, 0.1)'
                  }
                }}
              >
                Schließen
              </Button>
              <Button
                variant="outlined"
                startIcon={<Phone size={20} />}
                sx={{
                  color: '#4ecdc4',
                  borderColor: '#4ecdc4',
                  '&:hover': {
                    borderColor: '#4ecdc4',
                    backgroundColor: 'rgba(78, 205, 196, 0.1)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 15px rgba(78, 205, 196, 0.3)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Anrufen
              </Button>
              <Button
                variant="contained"
                startIcon={<Video size={20} />}
                sx={{
                  background: 'linear-gradient(135deg, #ff6b9d, #c44569)',
                  color: 'white',
                  fontWeight: 600,
                  px: 3,
                  boxShadow: '0 8px 25px rgba(255, 107, 157, 0.4)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #ff5a8a, #c44569)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 12px 35px rgba(255, 107, 157, 0.6)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Video-Call
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}
