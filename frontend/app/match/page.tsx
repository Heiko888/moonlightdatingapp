"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
  Tabs,
  Tab,
  TextField,
  InputAdornment,
  Fab
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  MessageCircle,
  Star,
  Filter,
  Search,
  Users,
  Zap,
  Eye,
  Send,
  MoreVert,
  Phone,
  Video,
  MapPin,
  Calendar,
  Clock,
  ChevronRight,
  Sparkles,
  Target,
  TrendingUp,
  Award,
  Crown,
  Flame
} from 'lucide-react';

interface Match {
  id: string;
  userId: string;
  name: string;
  age: number;
  location: string;
  avatar: string;
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
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
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

  const [matchStats, setMatchStats] = useState<MatchStats>({
    totalMatches: 24,
    newMatches: 3,
    conversations: 8,
    superLikes: 5
  });

  useEffect(() => {
    setIsClient(true);
    const userData = localStorage.getItem('userData');
    if (userData) {
      const user = JSON.parse(userData);
      setUserId(user.id);
    } else {
      router.push('/login');
    }
    
    setTimeout(() => setLoading(false), 1000);
  }, [router]);

  const filteredMatches = matches.filter(match =>
    match.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    match.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    match.hdType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleMatchClick = (match: Match) => {
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

  if (!isClient || loading) {
    return (
      <Box sx={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Box sx={{ textAlign: 'center' }}>
          <LinearProgress sx={{ width: 200, mb: 2 }} />
          <Typography variant="h6" sx={{ color: '#FFD700' }}>
            Lade Matches...
          </Typography>
        </Box>
      </Box>
    );
  }

  if (!userId) {
    return (
      <Box sx={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Typography variant="h6" sx={{ color: 'white' }}>
          Benutzer nicht gefunden
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Hintergrund-Effekte */}
      <Box sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `
          radial-gradient(circle at 20% 80%, rgba(255, 107, 107, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(76, 205, 196, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 40% 40%, rgba(255, 215, 0, 0.1) 0%, transparent 50%)
        `,
        zIndex: 1
      }} />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2, py: 6 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.3, duration: 0.8, type: "spring" }}
            >
              <Box sx={{ 
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 120,
                height: 120,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #FF6B6B 0%, #4ECDC4 50%, #FFD700 100%)',
                mb: 4,
                boxShadow: '0 20px 40px rgba(255, 107, 107, 0.4)',
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  inset: -4,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #FF6B6B, #4ECDC4, #FFD700)',
                  zIndex: -1,
                  filter: 'blur(20px)',
                  opacity: 0.7
                }
              }}>
                <Heart size={60} color="#1a1a2e" />
              </Box>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <Typography variant="h2" sx={{ 
                color: '#FF6B6B', 
                fontWeight: 900, 
                mb: 2,
                textShadow: '0 4px 8px rgba(255, 107, 107, 0.3)'
              }}>
                Deine Matches
              </Typography>
              <Typography variant="h6" sx={{ 
                color: 'rgba(255,255,255,0.8)', 
                maxWidth: 600, 
                mx: 'auto',
                lineHeight: 1.6
              }}>
                Entdecke Menschen, die energetisch zu dir passen und echte Verbindungen schaffen.
              </Typography>
            </motion.div>
          </Box>

          {/* Statistiken */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            <Grid container spacing={3} sx={{ mb: 6 }}>
              {[
                { label: 'Gesamt Matches', value: matchStats.totalMatches, icon: Heart, color: '#FF6B6B' },
                { label: 'Neue Matches', value: matchStats.newMatches, icon: Sparkles, color: '#FFD700' },
                { label: 'Gespräche', value: matchStats.conversations, icon: MessageCircle, color: '#4ECDC4' },
                { label: 'Super Likes', value: matchStats.superLikes, icon: Crown, color: '#8B5CF6' }
              ].map((stat, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8 + index * 0.1, duration: 0.6 }}
                  >
                    <Card sx={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(20px)',
                      borderRadius: 4,
                      border: '1px solid rgba(255,255,255,0.2)',
                      p: 3,
                      textAlign: 'center',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                        border: `1px solid ${stat.color}`
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
                          background: `linear-gradient(135deg, ${stat.color}20, ${stat.color}40)`,
                          border: `2px solid ${stat.color}`
                        }}>
                          <stat.icon size={24} color={stat.color} />
                        </Box>
                      </Box>
                      <Typography variant="h3" sx={{ 
                        color: stat.color, 
                        fontWeight: 900,
                        mb: 1
                      }}>
                        {stat.value}
                      </Typography>
                      <Typography variant="body2" sx={{ 
                        color: 'rgba(255,255,255,0.8)',
                        fontWeight: 500
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
            transition={{ delay: 1, duration: 0.8 }}
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
                      <Search size={20} color="#4ECDC4" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton>
                        <Filter size={20} color="#4ECDC4" />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: 4,
                    border: '1px solid rgba(255,255,255,0.2)',
                    color: 'white',
                    '& fieldset': {
                      border: 'none'
                    },
                    '&:hover fieldset': {
                      border: 'none'
                    },
                    '&.Mui-focused fieldset': {
                      border: '1px solid #4ECDC4'
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
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
          >
            <Card sx={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              borderRadius: 4,
              border: '1px solid rgba(255,255,255,0.2)'
            }}>
              <CardContent sx={{ p: 0 }}>
                {filteredMatches.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 6 }}>
                    <Heart size={64} color="#FF6B6B" style={{ marginBottom: 16 }} />
                    <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                      Keine Matches gefunden
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 3 }}>
                      {searchTerm ? 'Versuche andere Suchbegriffe.' : 'Starte das Dating und finde deine perfekten Matches!'}
                    </Typography>
                    <Button
                      variant="contained"
                      onClick={() => router.push('/dating')}
                      sx={{
                        background: 'linear-gradient(135deg, #FF6B6B 0%, #4ECDC4 100%)',
                        color: '#1a1a2e',
                        fontWeight: 600
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
                        transition={{ delay: 1.4 + index * 0.1, duration: 0.6 }}
                      >
                        <ListItem 
                          sx={{ 
                            px: 3, 
                            py: 2,
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              background: 'rgba(255, 255, 255, 0.05)'
                            }
                          }}
                          onClick={() => handleMatchClick(match)}
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
                                    background: '#4CAF50',
                                    border: '2px solid #1a1a2e'
                                  }} />
                                ) : null
                              }
                            >
                              <Avatar 
                                sx={{ 
                                  width: 60, 
                                  height: 60,
                                  border: match.isNewMatch ? '3px solid #FFD700' : '2px solid #4ECDC4'
                                }}
                                src={match.avatar}
                              >
                                <Users size={30} />
                              </Avatar>
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
                                      background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                                      color: '#1a1a2e',
                                      fontWeight: 700,
                                      fontSize: '0.7rem'
                                    }}
                                  />
                                )}
                              </Box>
                            }
                            secondary={
                              <Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <MapPin size={14} color="#4ECDC4" />
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
                                            background: 'rgba(76, 205, 196, 0.2)',
                                            color: '#4ECDC4',
                                            border: '1px solid rgba(76, 205, 196, 0.3)',
                                            fontSize: '0.6rem',
                                            height: 20
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
                            <IconButton edge="end" sx={{ color: '#4ECDC4' }}>
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
            background: 'rgba(15, 15, 35, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: 4,
            height: '80vh'
          }
        }}
      >
        {selectedMatch && (
          <>
            <DialogTitle sx={{ 
              color: '#FF6B6B', 
              fontWeight: 700, 
              textAlign: 'center',
              borderBottom: '1px solid rgba(255,255,255,0.1)',
              pb: 2
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                <Avatar 
                  src={selectedMatch.avatar}
                  sx={{ width: 50, height: 50, border: '2px solid #4ECDC4' }}
                />
                <Box>
                  <Typography variant="h6">{selectedMatch.name}, {selectedMatch.age}</Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                    {selectedMatch.location} • {selectedMatch.hdType}
                  </Typography>
                </Box>
              </Box>
            </DialogTitle>
            <DialogContent sx={{ p: 0, display: 'flex', flexDirection: 'column' }}>
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
                        ? 'linear-gradient(135deg, #4ECDC4 0%, #45B7D1 100%)'
                        : 'rgba(255, 255, 255, 0.1)',
                      color: message.senderId === userId ? '#1a1a2e' : 'white'
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
                    background: 'linear-gradient(135deg, #4ECDC4 0%, #45B7D1 100%)',
                    color: '#1a1a2e',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #45B7D1 0%, #96CEB4 100%)'
                    },
                    '&:disabled': {
                      background: 'rgba(255,255,255,0.1)',
                      color: 'rgba(255,255,255,0.3)'
                    }
                  }}
                >
                  <Send size={20} />
                </IconButton>
              </Box>
            </DialogContent>
            <DialogActions sx={{ p: 3, gap: 2, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              <Button
                onClick={() => setShowMatchDialog(false)}
                sx={{ color: 'rgba(255,255,255,0.7)' }}
              >
                Schließen
              </Button>
              <Button
                variant="outlined"
                startIcon={<Phone size={20} />}
                sx={{
                  color: '#4ECDC4',
                  borderColor: '#4ECDC4',
                  '&:hover': {
                    borderColor: '#4ECDC4',
                    backgroundColor: 'rgba(76, 205, 196, 0.1)'
                  }
                }}
              >
                Anrufen
              </Button>
              <Button
                variant="contained"
                startIcon={<Video size={20} />}
                sx={{
                  background: 'linear-gradient(135deg, #FF6B6B 0%, #4ECDC4 100%)',
                  color: '#1a1a2e',
                  fontWeight: 600
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
