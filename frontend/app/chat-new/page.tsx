"use client";
import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Paper, Tabs, Tab, Alert, Grid, Card, CardContent, Avatar, Chip, Button, IconButton, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
// import { motion } from 'framer-motion'; // Temporarily disabled due to webpack issues
import { MessageCircle, Users, Star, Zap, Heart, BarChart3, Eye, Moon, Flame, ArrowRight } from 'lucide-react';
import ChatInterface from '@/components/ChatInterface';
import ChatWithChart from '@/components/ChatWithChart';
import AnimatedStars from '@/components/AnimatedStars';
import AccessControl from '@/components/AccessControl';
import { UserSubscription } from '@/lib/subscription/types';
import { SubscriptionService } from '@/lib/subscription/subscriptionService';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface ChatUser {
  id: string;
  name: string;
  avatar: string;
  hdType: string;
  profile: string;
  authority: string;
  centers: string[];
  channels: string[];
  gates: string[];
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isOnline: boolean;
  compatibility: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`chat-tabpanel-${index}`}
      aria-labelledby={`chat-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const mockUsers: ChatUser[] = [
  {
    id: '1',
    name: 'Sophie',
    avatar: '/images/sophie.jpg',
    hdType: 'Generator',
    profile: '3/5',
    authority: 'Sakrale Autorität',
    centers: ['Sakral', 'Solar Plexus', 'Herz'],
    channels: ['10-20', '34-57'],
    gates: ['10', '20', '34', '57'],
    lastMessage: 'Hallo! Ich sehe, wir haben eine interessante Kompatibilität! 🌟',
    lastMessageTime: 'vor 30 Min',
    unreadCount: 2,
    isOnline: true,
    compatibility: 87
  },
  {
    id: '2',
    name: 'Max',
    avatar: '/images/max.jpg',
    hdType: 'Projector',
    profile: '2/4',
    authority: 'Splenische Autorität',
    centers: ['Splenisch', 'Solar Plexus', 'Herz'],
    channels: ['10-20', '34-57'],
    gates: ['10', '20', '34', '57'],
    lastMessage: 'Lass uns unsere Charts vergleichen! 📊',
    lastMessageTime: 'vor 1 Std',
    unreadCount: 0,
    isOnline: false,
    compatibility: 73
  },
  {
    id: '3',
    name: 'Anna',
    avatar: '/images/anna.jpg',
    hdType: 'Manifestor',
    profile: '1/3',
    authority: 'Splenische Autorität',
    centers: ['Splenisch', 'Solar Plexus', 'Herz'],
    channels: ['10-20', '34-57'],
    gates: ['10', '20', '34', '57'],
    lastMessage: 'Deine Energie fühlt sich sehr harmonisch an! 🌟',
    lastMessageTime: 'vor 2 Std',
    unreadCount: 1,
    isOnline: true,
    compatibility: 92
  }
];

const getHdTypeIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case 'generator':
      return <Zap size={16} />;
    case 'projector':
      return <Eye size={16} />;
    case 'manifestor':
      return <Flame size={16} />;
    case 'reflector':
      return <Moon size={16} />;
    default:
      return <Users size={16} />;
  }
};

const getHdTypeColor = (type: string) => {
  switch (type.toLowerCase()) {
    case 'generator':
      return '#10B981';
    case 'projector':
      return '#8B5CF6';
    case 'manifestor':
      return '#F59E0B';
    case 'reflector':
      return '#06B6D4';
    default:
      return '#6B7280';
  }
};

const getCompatibilityColor = (score: number) => {
  if (score >= 80) return '#22c55e';
  if (score >= 60) return '#f59e0b';
  return '#ef4444';
};

export default function ChatNewPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedChatId, setSelectedChatId] = useState<string | undefined>();
  const [currentUserId] = useState('user1');
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [showCardDialog, setShowCardDialog] = useState(false);
  const [activeCard, setActiveCard] = useState<string | null>(null);
  const [userSubscription, setUserSubscription] = useState<UserSubscription | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Mock user chart data
  const userChart = {
    type: 'Generator',
    profile: '2/4',
    authority: 'Sakrale Autorität',
    centers: ['Sakral', 'Solar Plexus', 'Herz'],
    channels: ['10-20', '34-57'],
    gates: ['10', '20', '34', '57'],
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleChatSelect = (chatId: string) => {
    setSelectedChatId(chatId);
  };

  const handleUserSelect = (user: ChatUser) => {
    setSelectedUser(user);
    setShowChat(true);
  };

  const handleBackToList = () => {
    setShowChat(false);
    setSelectedUser(null);
  };

  const handleCardClick = (cardType: string) => {
    setActiveCard(cardType);
    setShowCardDialog(true);
  };

  const handleCloseCardDialog = () => {
    setShowCardDialog(false);
    setActiveCard(null);
  };

  // Authentifizierung und Subscription prüfen
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      
      if (!token || !userId) {
        setIsAuthenticated(false);
        window.location.href = '/login?redirect=/chat-new';
        return;
      }
      
      setIsAuthenticated(true);
      
      // Subscription laden
      await loadUserSubscription();
    };

    checkAuth();
  }, []);

  const loadUserSubscription = async () => {
    try {
      const userData = localStorage.getItem('userData');
      if (userData) {
        const user = JSON.parse(userData);
        const subscription = await SubscriptionService.getUserSubscription(user.id);
        setUserSubscription(subscription);
      }
    } catch (error) {
      console.error('Fehler beim Laden der Subscription:', error);
    }
  };

  const getCardContent = () => {
    switch (activeCard) {
      case 'chart':
        return {
          title: 'Chart-Vergleich',
          content: (
            <Box>
              <Typography variant="h6" sx={{ mb: 2, color: 'white' }}>
                📊 Deine Chart-Überschneidungen
              </Typography>
              <Box sx={{ mb: 3 }}>
                <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', mb: 2 }}>
                  <strong>Gemeinsame Zentren:</strong> Sakral, Solar Plexus, Herz
                </Typography>
                <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', mb: 2 }}>
                  <strong>Gemeinsame Kanäle:</strong> 10-20 (Ganzheit), 34-57 (Kraft)
                </Typography>
                <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', mb: 2 }}>
                  <strong>Gemeinsame Tore:</strong> 10, 20, 34, 57
                </Typography>
              </Box>
              <Button
                variant="contained"
                fullWidth
                sx={{
                  background: 'linear-gradient(45deg, #8B5CF6, #A855F7)',
                  color: 'white',
                  fontWeight: 'bold'
                }}
                onClick={() => {
                  console.log('Chart-Vergleich öffnen');
                }}
              >
                Detaillierten Chart-Vergleich anzeigen
              </Button>
            </Box>
          )
        };
      case 'compatibility':
        return {
          title: 'Kompatibilitäts-Analyse',
          content: (
            <Box>
              <Typography variant="h6" sx={{ mb: 2, color: 'white' }}>
                ❤️ Eure Energie-Harmonie
              </Typography>
              <Box sx={{ mb: 3 }}>
                <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', mb: 2 }}>
                  <strong>Gesamt-Kompatibilität:</strong> 87% - Sehr harmonisch! 🌟
                </Typography>
                <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', mb: 2 }}>
                  <strong>Energie-Flow:</strong> Eure Generatoren-Energien ergänzen sich perfekt
                </Typography>
                <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', mb: 2 }}>
                  <strong>Kommunikation:</strong> Beide haben sakrale Autorität - intuitive Verständigung
                </Typography>
              </Box>
              <Button
                variant="contained"
                fullWidth
                sx={{
                  background: 'linear-gradient(45deg, #EF4444, #F87171)',
                  color: 'white',
                  fontWeight: 'bold'
                }}
                onClick={() => {
                  console.log('Kompatibilitäts-Report generieren');
                }}
              >
                Vollständigen Kompatibilitäts-Report erstellen
              </Button>
            </Box>
          )
        };
      default:
        return { title: '', content: null };
    }
  };

  if (showChat && selectedUser) {
    return (
      <Box sx={{ height: '100vh', background: 'linear-gradient(135deg, #0F0F23 0%, #1A1A2E 100%)' }}>
        <ChatWithChart otherUser={selectedUser} userChart={userChart} />
      </Box>
    );
  }

  return (
    <AccessControl 
      path="/chat-new" 
      userSubscription={userSubscription}
      onUpgrade={() => window.location.href = '/pricing'}
    >
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0F0F23 0%, #1A1A2E 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <AnimatedStars />
      
      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1, py: 4 }}>
        {/* Header */}
        <Box
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Box textAlign="center" mb={4}>
            <Typography 
              variant="h2" 
              component="h1" 
              sx={{ 
                background: 'linear-gradient(45deg, #8B5CF6, #A855F7, #EC4899)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 'bold',
                mb: 2
              }}
            >
              💬 Chat & Connect
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                color: 'rgba(255,255,255,0.8)',
                maxWidth: 600,
                mx: 'auto'
              }}
            >
              Verbinde dich mit anderen Human Design Enthusiasten und tausche dich über eure Charts aus
            </Typography>
          </Box>
        </Box>

        {/* Tabs */}
        <Box
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Paper 
            elevation={3} 
            sx={{ 
              borderRadius: 3,
              background: 'rgba(255,255,255,0.05)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.1)',
              overflow: 'hidden'
            }}
          >
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              variant="fullWidth"
              sx={{
                '& .MuiTab-root': {
                  color: 'rgba(255,255,255,0.7)',
                  fontWeight: 'bold',
                  textTransform: 'none',
                  fontSize: '1.1rem',
                  py: 2,
                  '&.Mui-selected': {
                    color: '#8B5CF6',
                    background: 'rgba(139, 92, 246, 0.1)',
                  },
                },
                '& .MuiTabs-indicator': {
                  background: 'linear-gradient(45deg, #8B5CF6, #A855F7)',
                  height: 3,
                },
              }}
            >
              <Tab 
                icon={<MessageCircle size={24} />} 
                label="Live Chat" 
                iconPosition="start"
              />
              <Tab 
                icon={<Users size={24} />} 
                label="Community" 
                iconPosition="start"
              />
              <Tab 
                icon={<Star size={24} />} 
                label="Matches" 
                iconPosition="start"
              />
              <Tab 
                icon={<Zap size={24} />} 
                label="Features" 
                iconPosition="start"
              />
            </Tabs>

            {/* Tab Content */}
            <TabPanel value={activeTab} index={0}>
              <Box sx={{ height: '70vh' }}>
                <ChatInterface
                  currentUserId={currentUserId}
                  selectedChatId={selectedChatId}
                  onChatSelect={handleChatSelect}
                />
              </Box>
            </TabPanel>

            <TabPanel value={activeTab} index={1}>
              <Box>
                <Typography variant="h5" sx={{ color: 'white', mb: 3, fontWeight: 600 }}>
                  💬 Deine Chats
                </Typography>
                
                <Grid container spacing={2}>
                  {mockUsers.map((user, index) => (
                    <Grid item xs={12} key={user.id}>
                      <Card
                        sx={{
                          background: 'rgba(255, 255, 255, 0.05)',
                          backdropFilter: 'blur(10px)',
                          borderRadius: 2,
                          border: '1px solid rgba(255,255,255,0.1)',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            background: 'rgba(255, 255, 255, 0.1)',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
                          }
                        }}
                        onClick={() => handleUserSelect(user)}
                      >
                        <CardContent sx={{ p: 3 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                            <Box sx={{ position: 'relative' }}>
                              <Avatar
                                src={user.avatar}
                                sx={{ width: 60, height: 60, border: '2px solid rgba(255,255,255,0.2)' }}
                              />
                              {user.isOnline && (
                                <Box
                                  sx={{
                                    position: 'absolute',
                                    bottom: 2,
                                    right: 2,
                                    width: 16,
                                    height: 16,
                                    borderRadius: '50%',
                                    backgroundColor: '#22c55e',
                                    border: '2px solid white'
                                  }}
                                />
                              )}
                            </Box>
                            
                            <Box sx={{ flex: 1 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                                <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                                  {user.name}
                                </Typography>
                                <Chip
                                  icon={getHdTypeIcon(user.hdType)}
                                  label={`${user.hdType} ${user.profile}`}
                                  size="small"
                                  sx={{
                                    backgroundColor: `${getHdTypeColor(user.hdType)}20`,
                                    color: getHdTypeColor(user.hdType),
                                    border: `1px solid ${getHdTypeColor(user.hdType)}40`,
                                  }}
                                />
                                <Chip
                                  label={`${user.compatibility}% Match`}
                                  size="small"
                                  sx={{
                                    backgroundColor: `${getCompatibilityColor(user.compatibility)}20`,
                                    color: getCompatibilityColor(user.compatibility),
                                    border: `1px solid ${getCompatibilityColor(user.compatibility)}40`,
                                  }}
                                />
                              </Box>
                              
                              <Typography
                                variant="body2"
                                sx={{
                                  color: 'rgba(255,255,255,0.7)',
                                  mb: 1,
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap'
                                }}
                              >
                                {user.lastMessage}
                </Typography>
                              
                              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                                  {user.lastMessageTime}
                </Typography>
                                {user.unreadCount > 0 && (
                                  <Chip
                                    label={user.unreadCount}
                                    size="small"
                                    sx={{
                                      backgroundColor: '#ef4444',
                                      color: 'white',
                                      minWidth: 24,
                                      height: 24,
                                      fontSize: '0.75rem'
                                    }}
                                  />
                                )}
                              </Box>
                            </Box>
                            
                            <ArrowRight size={20} color="rgba(255,255,255,0.5)" />
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </TabPanel>

            <TabPanel value={activeTab} index={2}>
              <Box>
                <Typography variant="h5" sx={{ color: 'white', mb: 3, fontWeight: 600 }}>
                  ⚡ Chat Features
                </Typography>
                
                <Grid container spacing={3} sx={{ mb: 4 }}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Card 
                      sx={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(20px)',
                        borderRadius: 3,
                        border: '1px solid rgba(255,255,255,0.2)',
                        textAlign: 'center',
                        p: 2,
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          background: 'rgba(255, 255, 255, 0.15)',
                          transform: 'translateY(-4px)',
                          boxShadow: '0 8px 25px rgba(139, 92, 246, 0.3)',
                        }
                      }}
                      onClick={() => handleCardClick('chart')}
                    >
                      <CardContent>
                        <BarChart3 size={32} color="#8B5CF6" style={{ marginBottom: 16 }} />
                        <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>
                          Chart-Vergleich
                </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                          Sieh eure Human Design Überschneidungen in Echtzeit
                </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={12} sm={6} md={3}>
                    <Card 
                      sx={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(20px)',
                        borderRadius: 3,
                        border: '1px solid rgba(255,255,255,0.2)',
                        textAlign: 'center',
                        p: 2,
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          background: 'rgba(255, 255, 255, 0.15)',
                          transform: 'translateY(-4px)',
                          boxShadow: '0 8px 25px rgba(239, 68, 68, 0.3)',
                        }
                      }}
                      onClick={() => handleCardClick('compatibility')}
                    >
                      <CardContent>
                        <Heart size={32} color="#EF4444" style={{ marginBottom: 16 }} />
                        <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>
                          Kompatibilität
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                          Erkenne harmonische Energie-Flüsse zwischen euch
                </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
                
                <Box sx={{ maxWidth: 600, mx: 'auto' }}>
                  <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', mb: 2 }}>
                    ✅ Echtzeit-Nachrichten über WebSocket
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', mb: 2 }}>
                    ✅ Typing-Indikatoren
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', mb: 2 }}>
                    ✅ Online-Status
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', mb: 2 }}>
                    ✅ Nachrichten-Persistierung
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', mb: 2 }}>
                    ✅ Human Design Kompatibilität
                  </Typography>
                  <Alert severity="success" sx={{ mt: 3 }}>
                    Alle Chat-Features sind vollständig funktional! 🎉
                  </Alert>
                </Box>
              </Box>
            </TabPanel>

            <TabPanel value={activeTab} index={3}>
              <Box textAlign="center" py={8}>
                <Typography variant="h4" sx={{ color: 'white', mb: 2 }}>
                  🌟 Community Features
                </Typography>
                <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', mb: 4 }}>
                  Hier findest du Gruppen, Events und Community-Aktivitäten
                </Typography>
                <Alert severity="info" sx={{ maxWidth: 500, mx: 'auto' }}>
                  Community-Features werden in der nächsten Version implementiert
                </Alert>
              </Box>
            </TabPanel>
          </Paper>
        </Box>

        {/* Card Detail Dialog */}
        <Dialog
          open={showCardDialog}
          onClose={handleCloseCardDialog}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              background: 'linear-gradient(135deg, #0F0F23 0%, #1A1A2E 100%)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: 3,
            }
          }}
        >
          <DialogTitle sx={{ color: 'white', textAlign: 'center', fontSize: '1.5rem', fontWeight: 'bold' }}>
            {getCardContent().title}
          </DialogTitle>
          <DialogContent sx={{ color: 'white' }}>
            {getCardContent().content}
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button
              onClick={handleCloseCardDialog}
              sx={{
                color: 'rgba(255,255,255,0.7)',
                borderColor: 'rgba(255,255,255,0.3)',
                '&:hover': {
                  borderColor: 'rgba(255,255,255,0.5)',
                  backgroundColor: 'rgba(255,255,255,0.1)'
                }
              }}
              variant="outlined"
            >
              Schließen
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
    </AccessControl>
  );
}
