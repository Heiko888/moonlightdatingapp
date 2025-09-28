"use client";
import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Paper, Tabs, Tab, Alert, Grid, Card, CardContent, Avatar, Chip, Button, IconButton, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { MessageCircle, Users, Star, Zap, Heart, BarChart3, Eye, Moon, Flame, ArrowRight } from 'lucide-react';
import ChatInterface from '@/components/ChatInterface';
import ChatWithChart from '@/components/ChatWithChart';
import AnimatedStars from '@/components/AnimatedStars';
import ProtectedRoute from '@/components/ProtectedRoute';

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

// Mock data für Chat-Users
const mockUsers: ChatUser[] = [
  {
    id: 'user1',
    name: 'Sarah',
    avatar: '/avatars/sarah.jpg',
    hdType: 'Generator',
    profile: '2/4',
    authority: 'Sakrale Autorität',
    centers: ['Sakral', 'Solar Plexus', 'Herz'],
    channels: ['10-20', '34-57'],
    gates: ['10', '20', '34', '57'],
    lastMessage: 'Hey! Wie geht es dir heute?',
    lastMessageTime: '14:30',
    unreadCount: 2,
    isOnline: true,
    compatibility: 85
  },
  {
    id: 'user2',
    name: 'Michael',
    avatar: '/avatars/michael.jpg',
    hdType: 'Manifestor',
    profile: '1/3',
    authority: 'Splenische Autorität',
    centers: ['Splenisch', 'Solar Plexus'],
    channels: ['20-34'],
    gates: ['20', '34'],
    lastMessage: 'Das Meeting war super!',
    lastMessageTime: '13:45',
    unreadCount: 0,
    isOnline: false,
    compatibility: 72
  },
  {
    id: 'user3',
    name: 'Lisa',
    avatar: '/avatars/lisa.jpg',
    hdType: 'Projector',
    profile: '3/5',
    authority: 'Splenische Autorität',
    centers: ['Splenisch', 'Solar Plexus', 'Herz'],
    channels: ['10-20', '20-34'],
    gates: ['10', '20', '34'],
    lastMessage: 'Kannst du mir bei dem Projekt helfen?',
    lastMessageTime: '12:15',
    unreadCount: 1,
    isOnline: true,
    compatibility: 91
  }
];

const getCompatibilityColor = (compatibility: number): string => {
  if (compatibility >= 90) return '#10b981';
  if (compatibility >= 80) return '#3b82f6';
  if (compatibility >= 70) return '#f59e0b';
  return '#ef4444';
};

function ChatContent() {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedChatId, setSelectedChatId] = useState<string | undefined>();
  const [currentUserId] = useState('user1');
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [showCardDialog, setShowCardDialog] = useState(false);
  const [activeCard, setActiveCard] = useState<string | null>(null);
  const [userSubscription, setUserSubscription] = useState<any>(null);
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
        return;
      }
      
      setIsAuthenticated(true);
      await loadUserSubscription();
    };

    checkAuth();
  }, []);

  const loadUserSubscription = async () => {
    // Mock subscription data
    setUserSubscription({
      package: 'basic',
      status: 'active',
      expiresAt: '2024-12-31'
    });
  };

  if (showChat && selectedUser) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton onClick={handleBackToList} sx={{ color: 'white' }}>
            <ArrowRight size={24} />
          </IconButton>
          <Avatar src={selectedUser.avatar} sx={{ width: 40, height: 40 }} />
          <Box>
            <Typography variant="h6" sx={{ color: 'white' }}>
              {selectedUser.name}
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
              {selectedUser.hdType} • {selectedUser.profile}
            </Typography>
          </Box>
        </Box>
        
        <ChatWithChart 
          user={selectedUser}
          currentUser={userChart}
          onBack={handleBackToList}
        />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h3" sx={{ 
          color: 'white', 
          mb: 2,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          💬 Chat & Community
        </Typography>
        <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.8)', mb: 4 }}>
          Verbinde dich mit Gleichgesinnten und entdecke deine energetische Kompatibilität
        </Typography>
      </Box>

      <Paper sx={{ 
        background: 'rgba(255,255,255,0.1)', 
        backdropFilter: 'blur(10px)',
        borderRadius: 3,
        overflow: 'hidden'
      }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange}
          sx={{ 
            borderBottom: 1, 
            borderColor: 'rgba(255,255,255,0.1)',
            '& .MuiTab-root': { color: 'rgba(255,255,255,0.7)' },
            '& .Mui-selected': { color: 'white' }
          }}
        >
          <Tab 
            icon={<MessageCircle size={20} />} 
            label="Chats" 
            iconPosition="start"
          />
          <Tab 
            icon={<Users size={20} />} 
            label="Community" 
            iconPosition="start"
          />
          <Tab 
            icon={<Heart size={20} />} 
            label="Matches" 
            iconPosition="start"
          />
          <Tab 
            icon={<Star size={20} />} 
            label="Features" 
            iconPosition="start"
          />
        </Tabs>

        <TabPanel value={activeTab} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                Aktive Chats
              </Typography>
              {mockUsers.map((user) => (
                <Card 
                  key={user.id}
                  sx={{ 
                    mb: 2, 
                    cursor: 'pointer',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    '&:hover': {
                      background: 'rgba(255,255,255,0.1)',
                      transform: 'translateY(-2px)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                  onClick={() => handleUserSelect(user)}
                >
                  <CardContent sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar src={user.avatar} sx={{ width: 40, height: 40 }} />
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="subtitle1" sx={{ color: 'white' }}>
                            {user.name}
                          </Typography>
                          <Chip 
                            label={`${user.compatibility}%`}
                            size="small"
                            sx={{ 
                              backgroundColor: getCompatibilityColor(user.compatibility),
                              color: 'white',
                              fontWeight: 'bold'
                            }}
                          />
                        </Box>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                          {user.hdType} • {user.profile}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', mt: 0.5 }}>
                          {user.lastMessage}
                        </Typography>
                      </Box>
                      {user.unreadCount > 0 && (
                        <Chip 
                          label={user.unreadCount}
                          size="small"
                          color="primary"
                          sx={{ ml: 1 }}
                        />
                      )}
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Grid>
            
            <Grid item xs={12} md={8}>
              <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                Chat-Features
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Card sx={{ 
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)'
                  }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <MessageCircle size={24} color="#3b82f6" />
                        <Typography variant="h6" sx={{ color: 'white' }}>
                          Echtzeit-Chat
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                        Sofortige Nachrichten mit anderen Nutzern
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Card sx={{ 
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)'
                  }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <Heart size={24} color="#ef4444" />
                        <Typography variant="h6" sx={{ color: 'white' }}>
                          Kompatibilität
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                        Human Design basierte Kompatibilitätsanalyse
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={activeTab} index={1}>
          <Box textAlign="center" py={8}>
            <Typography variant="h4" sx={{ color: 'white', mb: 2 }}>
              👥 Community Hub
            </Typography>
            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', mb: 4 }}>
              Hier findest du Gruppen, Events und Community-Aktivitäten
            </Typography>
            <Alert severity="info" sx={{ maxWidth: 500, mx: 'auto' }}>
              Community-Features werden in der nächsten Version implementiert
            </Alert>
          </Box>
        </TabPanel>

        <TabPanel value={activeTab} index={2}>
          <Box textAlign="center" py={8}>
            <Typography variant="h4" sx={{ color: 'white', mb: 2 }}>
              💕 Deine Matches
            </Typography>
            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', mb: 4 }}>
              Entdecke Menschen, die energetisch zu dir passen
            </Typography>
            <Alert severity="info" sx={{ maxWidth: 500, mx: 'auto' }}>
              Matching-System wird in der nächsten Version implementiert
            </Alert>
          </Box>
        </TabPanel>

        <TabPanel value={activeTab} index={3}>
          <Box textAlign="center" py={8}>
            <Typography variant="h4" sx={{ color: 'white', mb: 2 }}>
              ⭐ Chat-Features
            </Typography>
            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', mb: 4 }}>
              Alle verfügbaren Chat-Funktionen im Überblick
            </Typography>
            
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
      </Paper>
    </Container>
  );
}

export default function ChatPage() {
  return (
    <ProtectedRoute requiredPackage="basic">
      <ChatContent />
    </ProtectedRoute>
  );
}
