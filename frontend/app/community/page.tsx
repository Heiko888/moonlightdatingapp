"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import UnifiedPageLayout from '@/components/UnifiedPageLayout';
// Ungenutzte Imports entfernt
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
  Tabs,
  Tab,
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  IconButton,
  Badge,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  Fab
} from '@mui/material';
import { 
  Users, 
  MessageCircle, 
  Calendar, 
  MapPin, 
  Star, 
  Heart,
  Plus,
  Filter,
  MessageSquare,
  Award,
  Activity,
  ThumbsUp,
  Share2,
  MoreVertical,
  TrendingUp,
  Clock,
  Key
} from 'lucide-react';
import { motion } from 'framer-motion';
import AccessControl from '../../components/AccessControl';
import Link from 'next/link';
// import { UserSubscription } from '../../lib/subscription/types'; // Entfernt - nicht mehr benötigt
// import { SubscriptionService } from '../../lib/subscription/subscriptionService'; // Entfernt - nicht mehr benötigt

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`community-tabpanel-${index}`}
      aria-labelledby={`community-tab-${index}`}
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

function CommunityContent() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);
  const [userSubscription, setUserSubscription] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState<string>('');
  const [newPostDialog, setNewPostDialog] = useState(false);
  const [newPostText, setNewPostText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [messagesDialog, setMessagesDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<{ name: string; type: string; avatar: string } | null>(null);
  const [messageText, setMessageText] = useState('');
  const [posts, setPosts] = useState<any[]>([]);
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());
  const [mounted, setMounted] = useState(false);
  const [commentDialog, setCommentDialog] = useState<{ open: boolean; postId: number | null }>({ open: false, postId: null });
  const [commentText, setCommentText] = useState('');
  const [postComments, setPostComments] = useState<Record<number, any[]>>({});
  const [sharedEvents, setSharedEvents] = useState<Set<number>>(new Set());

  // Authentifizierung und Subscription prüfen
  useEffect(() => {
    const checkAuth = async () => {
      // Prüfe, ob Onboarding bereits abgeschlossen wurde
      const hasSeenOnboarding = localStorage.getItem('community-onboarding-completed');
      if (!hasSeenOnboarding) {
        router.push('/community/onboarding');
        return;
      }

      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      
      if (!token || !userId) {
        setIsAuthenticated(false);
        // Keine Authentifizierung erforderlich - App ist öffentlich
        return;
      }
      
      setIsAuthenticated(true);
      loadUserName();
      await loadUserSubscription();
    };

    checkAuth();
    setMounted(true);
  }, [router]);

  useEffect(() => {
    if (mounted) {
      loadPosts();
    }
  }, [mounted, userName]);

  const loadUserName = async () => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) return;

      const userData = localStorage.getItem('userData');
      if (userData) {
        const data = JSON.parse(userData);
        if (data.firstName || data.first_name) {
          setUserName(data.firstName || data.first_name);
          return;
        }
      }

      const { createClient } = await import('@/utils/supabase/client');
      const supabase = createClient();
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('first_name')
        .eq('user_id', userId)
        .single();

      if (!error && profile?.first_name) {
        setUserName(profile.first_name);
      }
    } catch (error) {
      console.error('Fehler beim Laden des Benutzernamens:', error);
    }
  };

  const loadUserSubscription = async () => {
    try {
      const userData = localStorage.getItem('userData');
      if (userData) {
        const user = JSON.parse(userData);
        // Temporärer Fix - SubscriptionService entfernt
        // const subscription = await SubscriptionService.getUserSubscription(user.id);
        const subscription = null;
        setUserSubscription(subscription);
      }
    } catch (error) {
      console.error('Fehler beim Laden der Subscription:', error);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const loadPosts = () => {
    if (typeof window === 'undefined') return; // Server-side guard
    
    try {
      const savedPosts = localStorage.getItem('community-posts');
      if (savedPosts) {
        const parsedPosts = JSON.parse(savedPosts);
        setPosts(parsedPosts);
      } else {
        // Initiale Mock-Posts
        setPosts([
          {
            id: 1,
            author: "Sarah M.",
            avatar: "/api/placeholder/48/48",
            content: "Als Manifesting Generator fühle ich mich heute besonders energiegeladen! 🌟 Wer hat Lust auf einen spontanen Austausch?",
            timestamp: "vor 2 Stunden",
            likes: 24,
            comments: 8,
            shares: 3,
            type: "Manifesting Generator",
            typeColor: "#f59e0b",
            tags: ["Energie", "Austausch", "Manifesting Generator"]
          },
          {
            id: 2,
            author: "Michael K.",
            avatar: "/api/placeholder/48/48",
            content: "Hat jemand Erfahrung mit Projector-Strategien in Beziehungen? Ich bin neu in der Community und würde gerne von euren Erfahrungen lernen.",
            timestamp: "vor 4 Stunden",
            likes: 18,
            comments: 12,
            shares: 2,
            type: "Projector",
            typeColor: "#8b5cf6",
            tags: ["Beziehungen", "Strategien", "Projector"]
          },
          {
            id: 3,
            author: "Lisa W.",
            avatar: "/api/placeholder/48/48",
            content: "Neuer Mondkalender-Eintrag: Vollmond in 3 Tagen! 🌕 Perfekt für Reflector-Energie. Wie geht ihr mit Mondphasen um?",
            timestamp: "vor 6 Stunden",
            likes: 31,
            comments: 15,
            shares: 7,
            type: "Reflector",
            typeColor: "#06b6d4",
            tags: ["Mondkalender", "Vollmond", "Reflector"]
          },
          {
            id: 4,
            author: "Tom R.",
            avatar: "/api/placeholder/48/48",
            content: "Generator-Tipp: Wenn ihr euch müde fühlt, prüft eure Energie-Zentren! Oft liegt es an ungenutzter kreativer Energie.",
            timestamp: "vor 8 Stunden",
            likes: 42,
            comments: 9,
            shares: 11,
            type: "Generator",
            typeColor: "#F29F05",
            tags: ["Energie", "Tipps", "Generator"]
          }
        ]);
      }
    } catch (error) {
      console.error('Fehler beim Laden der Posts:', error);
    }
  };

  const savePosts = (updatedPosts: any[]) => {
    if (typeof window === 'undefined') return; // Server-side guard
    try {
      localStorage.setItem('community-posts', JSON.stringify(updatedPosts));
    } catch (error) {
      console.error('Fehler beim Speichern der Posts:', error);
    }
  };

  const handleNewPost = () => {
    if (newPostText.trim()) {
      const newPost = {
        id: Date.now(),
        author: userName || 'Du',
        avatar: userName ? `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=F29F05&color=fff` : "/api/placeholder/48/48",
        content: newPostText,
        timestamp: "gerade eben",
        likes: 0,
        comments: 0,
        shares: 0,
        type: "Community",
        typeColor: "#F29F05",
        tags: []
      };
      
      const updatedPosts = [newPost, ...posts];
      setPosts(updatedPosts);
      savePosts(updatedPosts);
      setNewPostText('');
      setNewPostDialog(false);
    }
  };

  const handleLikePost = (postId: number) => {
    const isLiked = likedPosts.has(postId);
    const updatedLikedPosts = new Set(likedPosts);
    
    if (isLiked) {
      updatedLikedPosts.delete(postId);
    } else {
      updatedLikedPosts.add(postId);
    }
    
    setLikedPosts(updatedLikedPosts);
    
    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          likes: isLiked ? post.likes - 1 : post.likes + 1
        };
      }
      return post;
    });
    
    setPosts(updatedPosts);
    savePosts(updatedPosts);
  };

  const handleCommentClick = (postId: number) => {
    setCommentDialog({ open: true, postId });
    setCommentText('');
  };

  const handleCommentSubmit = () => {
    if (commentText.trim() && commentDialog.postId !== null) {
      const newComment = {
        id: Date.now(),
        author: userName || 'Du',
        avatar: userName ? `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=F29F05&color=fff` : "/api/placeholder/40/40",
        content: commentText,
        timestamp: "gerade eben"
      };

      const currentComments = postComments[commentDialog.postId] || [];
      setPostComments({
        ...postComments,
        [commentDialog.postId]: [...currentComments, newComment]
      });

      // Update post comment count
      const updatedPosts = posts.map(post => {
        if (post.id === commentDialog.postId) {
          return {
            ...post,
            comments: (post.comments || 0) + 1
          };
        }
        return post;
      });
      setPosts(updatedPosts);
      savePosts(updatedPosts);

      setCommentText('');
      setCommentDialog({ open: false, postId: null });
    }
  };

  const handleShareConnectionKey = () => {
    router.push('/connection-key');
  };

  const handleJoinEvent = (eventId: number) => {
    const isJoined = sharedEvents.has(eventId);
    const updatedEvents = new Set(sharedEvents);
    
    if (isJoined) {
      updatedEvents.delete(eventId);
    } else {
      updatedEvents.add(eventId);
    }
    
    setSharedEvents(updatedEvents);
    // Hier könnte die Event-Teilnahme gespeichert werden
  };

  const handleSendMessage = () => {
    if (messageText.trim() && selectedUser) {
      console.log('Nachricht an', selectedUser.name, ':', messageText);
      setMessageText('');
      setMessagesDialog(false);
      setSelectedUser(null);
    }
  };

  const handleUserClick = (user: { name: string; type: string; avatar: string }) => {
    setSelectedUser(user);
    setMessagesDialog(true);
  };

  const handleCompatibilityCheck = (user: { name: string; type: string; avatar: string }) => {
    // Simuliere Kompatibilitäts-Berechnung
    const compatibility = Math.floor(Math.random() * 40) + 60; // 60-100%
    console.log(`Kompatibilität mit ${user.name}: ${compatibility}%`);
    // Hier würde die echte Kompatibilitäts-Berechnung stattfinden
  };

  // Mock-Daten für Community Hub
  const communityStats = [
    { label: "Aktive Mitglieder", value: "2,847", icon: <Users size={24} />, color: "#F29F05" },
    { label: "Posts heute", value: posts.length.toString(), icon: <MessageSquare size={24} />, color: "#F29F05" },
    { label: "Events", value: "23", icon: <Calendar size={24} />, color: "#8C1D04" },
    { label: "Matches", value: "89", icon: <Heart size={24} />, color: "#8C1D04" }
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: "Human Design Stammtisch Berlin",
      date: "15. Januar 2025",
      time: "19:00",
      location: "Berlin Mitte",
      attendees: 24,
      maxAttendees: 30,
      type: "Meetup",
      organizer: "Sarah M.",
      description: "Gemütlicher Austausch über Human Design Erfahrungen"
    },
    {
      id: 2,
      title: "Chart-Analyse Workshop",
      date: "22. Januar 2025",
      time: "14:00",
      location: "Online",
      attendees: 12,
      maxAttendees: 20,
      type: "Workshop",
      organizer: "Dr. Maria L.",
      description: "Vertiefte Einführung in Chart-Analysen"
    },
    {
      id: 3,
      title: "Beziehungs-Coaching Gruppe",
      date: "28. Januar 2025",
      time: "18:30",
      location: "Hamburg",
      attendees: 8,
      maxAttendees: 12,
      type: "Gruppe",
      organizer: "Michael K.",
      description: "Fokus auf Human Design in Beziehungen"
    }
  ];

  const onlineUsers = [
    { id: 1, name: "Anna", type: "Generator", avatar: "/api/placeholder/40/40", status: "online" },
    { id: 2, name: "Tom", type: "Projector", avatar: "/api/placeholder/40/40", status: "online" },
    { id: 3, name: "Maria", type: "Manifestor", avatar: "/api/placeholder/40/40", status: "away" },
    { id: 4, name: "David", type: "Reflector", avatar: "/api/placeholder/40/40", status: "online" },
    { id: 5, name: "Lisa", type: "Manifesting Generator", avatar: "/api/placeholder/40/40", status: "online" }
  ];

  const trendingTopics = [
    { topic: "Generator Energie", posts: 45, trend: "up" },
    { topic: "Projector Strategien", posts: 32, trend: "up" },
    { topic: "Mondkalender", posts: 28, trend: "up" },
    { topic: "Beziehungen", posts: 67, trend: "stable" },
    { topic: "Chart-Analyse", posts: 23, trend: "down" }
  ];

  // Mock-Daten für erweiterte Features
  const directMessages = [
    {
      id: 1,
      user: { name: "Sarah M.", avatar: "/api/placeholder/40/40", type: "Manifesting Generator", status: "online" },
      lastMessage: "Hey! Wie geht es dir heute?",
      timestamp: "vor 5 Min",
      unread: 2
    },
    {
      id: 2,
      user: { name: "Michael K.", avatar: "/api/placeholder/40/40", type: "Projector", status: "away" },
      lastMessage: "Danke für den Tipp gestern!",
      timestamp: "vor 1 Std",
      unread: 0
    },
    {
      id: 3,
      user: { name: "Lisa W.", avatar: "/api/placeholder/40/40", type: "Reflector", status: "online" },
      lastMessage: "Lass uns morgen chatten!",
      timestamp: "vor 3 Std",
      unread: 1
    }
  ];

  const compatibilityMatches = [
    {
      user: { name: "Anna", type: "Generator", avatar: "/api/placeholder/48/48", age: 28, location: "Berlin" },
      compatibility: 94,
      sharedGates: 8,
      sharedChannels: 3,
      compatibilityFactors: ["Gemeinsame Kanäle", "Harmonische Profile", "Ähnliche Strategien"]
    },
    {
      user: { name: "Tom", type: "Projector", avatar: "/api/placeholder/48/48", age: 32, location: "München" },
      compatibility: 87,
      sharedGates: 6,
      sharedChannels: 2,
      compatibilityFactors: ["Komplementäre Energien", "Gegenseitige Unterstützung"]
    },
    {
      user: { name: "Maria", type: "Manifestor", avatar: "/api/placeholder/48/48", age: 25, location: "Hamburg" },
      compatibility: 91,
      sharedGates: 7,
      sharedChannels: 4,
      compatibilityFactors: ["Starke Verbindung", "Gemeinsame Ziele", "Harmonische Autorität"]
    }
  ];

  const mentorMenteeMatches = [
    {
      type: "mentor",
      user: { name: "Dr. Sarah L.", type: "Manifesting Generator", avatar: "/api/placeholder/48/48", experience: "10+ Jahre" },
      specialty: "Chart-Analyse",
      rating: 4.9,
      students: 45,
      description: "Erfahrene Human Design Beraterin"
    },
    {
      type: "mentee",
      user: { name: "Alex", type: "Projector", avatar: "/api/placeholder/48/48", level: "Anfänger" },
      lookingFor: "Grundlagen lernen",
      goals: ["Chart verstehen", "Strategie anwenden"],
      description: "Suche Mentor für Human Design Grundlagen"
    }
  ];

  const notificationData = [
    {
      id: 1,
      type: "message",
      title: "Neue Nachricht von Sarah M.",
      content: "Hey! Wie geht es dir heute?",
      timestamp: "vor 5 Min",
      read: false,
      icon: <MessageCircle size={20} />
    },
    {
      id: 2,
      type: "match",
      title: "Neuer Kompatibilitäts-Match!",
      content: "94% Kompatibilität mit Anna gefunden",
      timestamp: "vor 1 Std",
      read: false,
      icon: <Heart size={20} />
    },
    {
      id: 3,
      type: "event",
      title: "Event-Erinnerung",
      content: "Human Design Stammtisch startet in 2 Stunden",
      timestamp: "vor 2 Std",
      read: true,
      icon: <Calendar size={20} />
    }
  ];

  return (
    <AccessControl 
      path="/community" 
      userSubscription={userSubscription}
      onUpgrade={() => router.push('/pricing')}
    >
      <Box sx={{ 
        minHeight: '100vh',
        background: 'radial-gradient(ellipse at top, rgba(242, 159, 5, 0.15) 0%, rgba(0, 0, 0, 1) 50%), radial-gradient(ellipse at bottom, rgba(140, 29, 4, 0.1) 0%, rgba(0, 0, 0, 1) 70%)',
        backgroundAttachment: 'fixed',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background: 'radial-gradient(90% 70% at 50% 28%, rgba(242, 159, 5, 0.36), transparent 78%), radial-gradient(60% 50% at 82% 82%, rgba(140, 29, 4, 0.24), transparent 78%)'
        }
      }}>
        {/* Animierte Sparkles - nur client-side */}
        {mounted && (
          <Box sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1,
            pointerEvents: 'none',
            overflow: 'hidden'
          }}>
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                style={{
                  position: 'absolute',
                  width: i % 3 === 0 ? '4px' : i % 3 === 1 ? '6px' : '3px',
                  height: i % 3 === 0 ? '4px' : i % 3 === 1 ? '6px' : '3px',
                  background: i % 2 === 0 ? '#F29F05' : '#FFD700',
                  borderRadius: '50%',
                  left: `${(i * 7) % 100}%`,
                  top: `${(i * 11) % 100}%`,
                  boxShadow: `0 0 ${i % 3 === 0 ? '15px' : '10px'} ${i % 2 === 0 ? 'rgba(242,159,5,0.9)' : 'rgba(255,215,0,0.8)'}`
                }}
                animate={{
                  opacity: [0, 1, 0.5, 1, 0],
                  scale: [0.3, 1.5, 0.8, 1.3, 0.3],
                  y: [0, -50, -20, -40, 0],
                }}
                transition={{
                  duration: 2 + (i * 0.3),
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut"
                }}
              />
            ))}
          </Box>
        )}

        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 2, pt: { xs: 4, md: 6 }, pb: 8, px: { xs: 1, sm: 2 } }}>
          <Box sx={{ mb: 4 }}>
            <Typography 
              variant="h3" 
              sx={{ 
                fontWeight: 800,
                fontSize: { xs: '2rem', md: '2.5rem' },
                background: 'linear-gradient(135deg, #F29F05, #8C1D04)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 0 30px rgba(242, 159, 5, 0.3)'
              }}
            >
              {userName ? `👥 ${userName}s Community` : '👥 Community & Connection Key'}
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                color: 'rgba(255,255,255,0.7)', 
                mt: 1,
                fontSize: { xs: '0.9rem', md: '1rem' }
              }}
            >
              Verbinde dich, teile Resonanzen und entdecke energetische Verbindungen
            </Typography>
          </Box>

          {/* Stats Cards */}
          <Box>
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {communityStats.map((stat, index) => (
                <Grid item xs={6} md={3} key={index}>
                  <Card sx={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: 4,
                  border: '1px solid rgba(242, 159, 5, 0.20)',
                    textAlign: 'center',
                    p: 2,
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                    boxShadow: '0 12px 40px rgba(242, 159, 5, 0.25)',
                    borderColor: 'rgba(242, 159, 5, 0.35)'
                    }
                  }}>
                    <CardContent>
                      <Box sx={{ color: stat.color, mb: 1 }}>
                        {stat.icon}
                      </Box>
                      <Typography variant="h4" sx={{ color: 'white', fontWeight: 700, mb: 1 }}>
                        {stat.value}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                        {stat.label}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Search and Filter */}
          <Box>
            <Paper sx={{
              background: 'rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(20px)',
              borderRadius: 4,
              border: '1px solid rgba(242, 159, 5, 0.20)',
              p: 3,
              mb: 4
            }}>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <TextField
                  fullWidth
                  placeholder="Suche in der Community..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      '& fieldset': {
                        borderColor: 'rgba(255,255,255,0.3)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(255,255,255,0.5)',
                      },
                    '&.Mui-focused fieldset': {
                      borderColor: '#F29F05',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(255,255,255,0.7)',
                    }
                  }}
                />
                <Button
                  variant="outlined"
                  startIcon={<Filter size={20} />}
                  sx={{
                    borderColor: 'rgba(242, 159, 5, 0.30)',
                    color: '#F29F05',
                    '&:hover': {
                      borderColor: '#8C1D04',
                      backgroundColor: 'rgba(242, 159, 5, 0.10)'
                    }
                  }}
                >
                  Filter
                </Button>
              </Box>
            </Paper>
          </Box>

          {/* Tabs */}
          <Paper sx={{
            background: 'rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(20px)',
            borderRadius: 4,
            border: '1px solid rgba(242, 159, 5, 0.30)',
            boxShadow: '0 8px 32px rgba(242, 159, 5, 0.15)',
            mb: 4,
            overflow: 'hidden'
          }}>
            <Tabs 
              value={activeTab} 
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                minHeight: 64,
                '& .MuiTab-root': {
                  color: 'rgba(255,255,255,0.6)',
                  fontWeight: 600,
                  fontSize: { xs: '0.875rem', md: '1rem' },
                  minHeight: 64,
                  px: { xs: 2, md: 3 },
                  transition: 'all 0.3s ease',
                  '&.Mui-selected': {
                    color: '#F29F05',
                    background: 'rgba(242, 159, 5, 0.10)'
                  },
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.05)',
                    color: 'rgba(255, 255, 255, 0.9)'
                  }
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: '#F29F05',
                  height: 3,
                  borderRadius: '3px 3px 0 0'
                },
                '& .MuiTabs-flexContainer': {
                  gap: { xs: 0, md: 1 }
                }
              }}
            >
              <Tab label="Feed" icon={<MessageSquare size={20} />} iconPosition="start" />
              <Tab label="Events" icon={<Calendar size={20} />} iconPosition="start" />
              <Tab label="Online" icon={<Users size={20} />} iconPosition="start" />
              <Tab label="Nachrichten" icon={<MessageCircle size={20} />} iconPosition="start" />
              <Tab label="Matches" icon={<Heart size={20} />} iconPosition="start" />
              <Tab label="Mentoring" icon={<Award size={20} />} iconPosition="start" />
              <Tab label="Trending" icon={<TrendingUp size={20} />} />
            </Tabs>
          </Paper>

          {/* Tab Content */}
          <TabPanel value={activeTab} index={0}>
            <Grid container spacing={3}>
              {/* Feed */}
              <Grid item xs={12} lg={8}>
                <Card sx={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: 4,
                  border: '1px solid rgba(242, 159, 5, 0.20)',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
                }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <MessageSquare size={24} style={{ color: '#F29F05', marginRight: 12 }} />
                        <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                          Community Feed
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button
                          variant="contained"
                          startIcon={<Plus size={20} />}
                          onClick={() => setNewPostDialog(true)}
                          sx={{
                            background: 'linear-gradient(135deg, #F29F05, #8C1D04)',
                            color: 'white',
                            fontWeight: 700,
                            px: 3,
                            py: 1.5,
                            borderRadius: 2,
                            boxShadow: '0 4px 20px rgba(242, 159, 5, 0.4)',
                            '&:hover': {
                              background: 'linear-gradient(135deg, #8C1D04, #F29F05)',
                              transform: 'translateY(-2px)',
                              boxShadow: '0 6px 25px rgba(242, 159, 5, 0.5)'
                            },
                            transition: 'all 0.3s ease'
                          }}
                        >
                          Neuer Post
                        </Button>
                        <Button
                          variant="outlined"
                          startIcon={<Key size={20} />}
                          onClick={handleShareConnectionKey}
                          sx={{
                            borderColor: 'rgba(242, 159, 5, 0.5)',
                            color: '#F29F05',
                            fontWeight: 600,
                            px: 3,
                            py: 1.5,
                            borderRadius: 2,
                            '&:hover': {
                              borderColor: '#F29F05',
                              background: 'rgba(242, 159, 5, 0.1)',
                              transform: 'translateY(-2px)'
                            },
                            transition: 'all 0.3s ease'
                          }}
                        >
                          Connection Key teilen
                        </Button>
                      </Box>
                    </Box>
                    
                    {posts.length === 0 ? (
                      <Box sx={{ textAlign: 'center', py: 8 }}>
                        <MessageSquare size={64} style={{ color: '#F29F05', opacity: 0.5, marginBottom: 16 }} />
                        <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.7)', mb: 2 }}>
                          Noch keine Posts
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                          Erstelle den ersten Post und teile deine Gedanken mit der Community!
                        </Typography>
                      </Box>
                    ) : (
                      posts.map((post, index) => (
                      <Box
                        key={post.id}
                      >
                        <Box sx={{ 
                          mb: 3, 
                          p: 3, 
                          background: 'rgba(255, 255, 255, 0.03)', 
                          borderRadius: 3,
                          border: '1px solid rgba(242, 159, 5, 0.15)',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            background: 'rgba(242, 159, 5, 0.08)',
                            border: '1px solid rgba(242, 159, 5, 0.25)',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 4px 15px rgba(242, 159, 5, 0.15)'
                          }
                        }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Avatar src={post.avatar} sx={{ width: 48, height: 48, mr: 2 }} />
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 600 }}>
                                {post.author}
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Chip 
                                  label={post.type} 
                                  size="small" 
                                  sx={{ 
                                    background: 'rgba(242, 159, 5, 0.15)', 
                                    color: '#F29F05',
                                    fontSize: '0.7rem',
                                    fontWeight: 600
                                  }} 
                                />
                                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                                  {post.timestamp}
                                </Typography>
                              </Box>
                            </Box>
                            <IconButton sx={{ color: 'rgba(255,255,255,0.7)' }}>
                              <MoreVertical size={20} />
                            </IconButton>
                          </Box>
                          
                          <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)', mb: 2, lineHeight: 1.6 }}>
                            {post.content}
                          </Typography>
                          
                          <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                            {post.tags.map((tag: string, tagIndex: number) => (
                              <Chip
                                key={tagIndex}
                                label={`#${tag}`}
                                size="small"
                                sx={{
                                  background: 'rgba(242, 159, 5, 0.10)',
                                  color: '#F29F05',
                                  fontSize: '0.7rem'
                                }}
                              />
                            ))}
                          </Box>
                          
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                            <IconButton 
                              size="small" 
                              onClick={() => handleLikePost(post.id)}
                              sx={{ 
                                color: likedPosts.has(post.id) ? '#F29F05' : 'rgba(255,255,255,0.7)',
                                '&:hover': {
                                  color: '#F29F05'
                                }
                              }}
                            >
                              <ThumbsUp size={16} fill={likedPosts.has(post.id) ? '#F29F05' : 'none'} />
                              <Typography variant="caption" sx={{ ml: 0.5 }}>
                                {post.likes}
                              </Typography>
                            </IconButton>
                            <IconButton 
                              size="small" 
                              onClick={() => handleCommentClick(post.id)}
                              sx={{ color: 'rgba(255,255,255,0.7)', '&:hover': { color: '#F29F05' } }}
                            >
                              <MessageCircle size={16} />
                              <Typography variant="caption" sx={{ ml: 0.5 }}>
                                {post.comments || 0}
                              </Typography>
                            </IconButton>
                            <IconButton size="small" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                              <Share2 size={16} />
                              <Typography variant="caption" sx={{ ml: 0.5 }}>
                                {post.shares}
                              </Typography>
                            </IconButton>
                          </Box>
                        </Box>
                      </Box>
                    ))
                    )}
                  </CardContent>
                </Card>
              </Grid>

              {/* Sidebar */}
              <Grid item xs={12} lg={4}>
                {/* Online Users */}
                <Card sx={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: 4,
                  border: '1px solid rgba(242, 159, 5, 0.20)',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                  mb: 3
                }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ color: 'white', fontWeight: 600, mb: 2 }}>
                      Online jetzt
                    </Typography>
                    <List>
                      {onlineUsers.map((user) => (
                        <ListItem key={user.id} sx={{ px: 0 }}>
                          <ListItemAvatar>
                            <Box sx={{ position: 'relative' }}>
                              <Avatar src={user.avatar} sx={{ width: 40, height: 40 }} />
                              <Box sx={{
                                position: 'absolute',
                                bottom: 0,
                                right: 0,
                                width: 12,
                                height: 12,
                                borderRadius: '50%',
                                backgroundColor: user.status === 'online' ? '#F29F05' : '#8C1D04',
                                border: '2px solid rgba(255,255,255,0.1)'
                              }} />
                            </Box>
                          </ListItemAvatar>
                          <ListItemText 
                            primary={user.name}
                            secondary={user.type}
                            primaryTypographyProps={{ color: 'white', fontSize: '0.9rem', fontWeight: 600 }}
                            secondaryTypographyProps={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem' }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>

                {/* Trending Topics */}
                <Card sx={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: 4,
                  border: '1px solid rgba(242, 159, 5, 0.20)',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
                }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ color: 'white', fontWeight: 600, mb: 2 }}>
                      Trending Topics
                    </Typography>
                    <List>
                      {trendingTopics.map((topic, index) => (
                        <ListItem key={index} sx={{ px: 0 }}>
                          <ListItemText 
                            primary={topic.topic}
                            secondary={`${topic.posts} Posts`}
                            primaryTypographyProps={{ color: 'white', fontSize: '0.9rem' }}
                            secondaryTypographyProps={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem' }}
                          />
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {topic.trend === 'up' && <TrendingUp size={16} style={{ color: '#F29F05' }} />}
                            {topic.trend === 'down' && <TrendingUp size={16} style={{ color: '#ef4444', transform: 'rotate(180deg)' }} />}
                            {topic.trend === 'stable' && <Activity size={16} style={{ color: '#f59e0b' }} />}
                          </Box>
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </TabPanel>

          <TabPanel value={activeTab} index={1}>
            <Grid container spacing={3}>
              {upcomingEvents.map((event, index) => (
                <Grid item xs={12} md={6} lg={4} key={event.id}>
                  <Box
                  >
                    <Card sx={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      backdropFilter: 'blur(20px)',
                      borderRadius: 3,
                      border: '1px solid rgba(242, 159, 5, 0.20)',
                      height: '100%',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
                      }
                    }}>
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Calendar size={20} style={{ color: '#F29F05', marginRight: 8 }} />
                          <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                            {event.title}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ mb: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Clock size={16} style={{ color: 'rgba(255,255,255,0.7)', marginRight: 8 }} />
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                              {event.date} um {event.time}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <MapPin size={16} style={{ color: 'rgba(255,255,255,0.7)', marginRight: 8 }} />
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                              {event.location}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Users size={16} style={{ color: 'rgba(255,255,255,0.7)', marginRight: 8 }} />
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                              {event.attendees}/{event.maxAttendees} Teilnehmer
                            </Typography>
                          </Box>
                        </Box>
                        
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 2 }}>
                          {event.description}
                        </Typography>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                          <Chip 
                            label={event.type} 
                            size="small" 
                            sx={{ 
                              background: 'rgba(16, 185, 129, 0.2)', 
                              color: '#F29F05'
                            }} 
                          />
                          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                            von {event.organizer}
                          </Typography>
                        </Box>
                        
                        <LinearProgress 
                          variant="determinate" 
                          value={(event.attendees / event.maxAttendees) * 100}
                          sx={{
                            mb: 2,
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: '#F29F05'
                            },
                            '& .MuiLinearProgress-root': {
                              backgroundColor: 'rgba(255,255,255,0.1)'
                            }
                          }}
                        />
                        
                        <Button 
                          variant={sharedEvents.has(event.id) ? "contained" : "outlined"}
                          fullWidth
                          onClick={() => handleJoinEvent(event.id)}
                          sx={{
                            borderColor: sharedEvents.has(event.id) ? 'transparent' : 'rgba(242, 159, 5, 0.5)',
                            background: sharedEvents.has(event.id) ? 'linear-gradient(135deg, #F29F05, #8C1D04)' : 'transparent',
                            color: sharedEvents.has(event.id) ? 'white' : '#F29F05',
                            fontWeight: 600,
                            '&:hover': {
                              borderColor: '#F29F05',
                              backgroundColor: sharedEvents.has(event.id) ? 'linear-gradient(135deg, #8C1D04, #F29F05)' : 'rgba(242, 159, 5, 0.1)'
                            },
                            transition: 'all 0.3s ease'
                          }}
                        >
                          {sharedEvents.has(event.id) ? '✓ Teilnahme bestätigt' : 'Event beitreten'}
                        </Button>
                      </CardContent>
                    </Card>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </TabPanel>

          <TabPanel value={activeTab} index={2}>
            <Card sx={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(20px)',
              borderRadius: 3,
              border: '1px solid rgba(255,255,255,0.2)'
            }}>
              <CardContent>
                <Typography variant="h6" sx={{ color: 'white', fontWeight: 600, mb: 3 }}>
                  Aktive Community-Mitglieder
                </Typography>
                <Grid container spacing={2}>
                  {onlineUsers.map((user, index) => (
                    <Grid item xs={6} sm={4} md={3} lg={2} key={user.id}>
                      <Box>
                        <Box sx={{ 
                          textAlign: 'center', 
                          p: 2, 
                          background: 'rgba(255, 255, 255, 0.03)', 
                          borderRadius: 2,
                          border: '1px solid rgba(242, 159, 5, 0.20)',
                          transition: 'all 0.3s ease',
                          cursor: 'pointer',
                          '&:hover': {
                            background: 'rgba(255, 255, 255, 0.05)',
                            transform: 'translateY(-2px)'
                          }
                        }}
                        onClick={() => handleUserClick(user)}
                        >
                          <Box sx={{ position: 'relative', display: 'inline-block', mb: 1 }}>
                            <Avatar src={user.avatar} sx={{ width: 56, height: 56, mx: 'auto' }} />
                            <Box sx={{
                              position: 'absolute',
                              bottom: 2,
                              right: 2,
                              width: 16,
                              height: 16,
                              borderRadius: '50%',
                                backgroundColor: user.status === 'online' ? '#F29F05' : '#8C1D04',
                              border: '2px solid rgba(255,255,255,0.1)'
                            }} />
                          </Box>
                          <Typography variant="body2" sx={{ color: 'white', fontWeight: 600, mb: 0.5 }}>
                            {user.name}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                            {user.type}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </TabPanel>

          {/* Messages Tab */}
          <TabPanel value={activeTab} index={3}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <Card sx={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: 3,
                  border: '1px solid rgba(255,255,255,0.2)'
                }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ color: 'white', fontWeight: 600, mb: 3 }}>
                      Direktnachrichten
                    </Typography>
                    <List>
                      {directMessages.map((message) => (
                        <ListItem 
                          key={message.id} 
                          sx={{ 
                            p: 2, 
                            mb: 1, 
                            background: 'rgba(255, 255, 255, 0.03)', 
                            borderRadius: 2,
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              background: 'rgba(255,255,255,0.1)'
                            }
                          }}
                          onClick={() => handleUserClick(message.user)}
                        >
                          <ListItemAvatar>
                            <Box sx={{ position: 'relative' }}>
                              <Avatar src={message.user.avatar} sx={{ width: 48, height: 48 }} />
                              <Box sx={{
                                position: 'absolute',
                                bottom: 0,
                                right: 0,
                                width: 12,
                                height: 12,
                                borderRadius: '50%',
                                backgroundColor: message.user.status === 'online' ? '#F29F05' : '#8C1D04',
                                border: '2px solid rgba(255,255,255,0.1)'
                              }} />
                            </Box>
                          </ListItemAvatar>
                          <ListItemText 
                            primary={
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 600 }}>
                                  {message.user.name}
                                </Typography>
                                {message.unread > 0 && (
                                  <Badge badgeContent={message.unread} color="error" />
                                )}
                              </Box>
                            }
                            secondary={
                              <Box>
                                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mb: 0.5 }}>
                                  {message.lastMessage}
                                </Typography>
                                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                                  {message.timestamp}
                                </Typography>
                              </Box>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card sx={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: 3,
                  border: '1px solid rgba(255,255,255,0.2)'
                }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ color: 'white', fontWeight: 600, mb: 2 }}>
                      Benachrichtigungen
                    </Typography>
                    <List>
                      {notificationData.map((notification) => (
                        <ListItem key={notification.id} sx={{ px: 0, py: 1 }}>
                          <ListItemAvatar>
                            <Avatar sx={{ 
                              width: 32, 
                              height: 32, 
                              background: notification.read ? 'rgba(255,255,255,0.1)' : '#F29F05',
                              color: notification.read ? 'rgba(255,255,255,0.7)' : '#1f2937'
                            }}>
                              {notification.icon}
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText 
                            primary={
                              <Typography variant="body2" sx={{ 
                                color: 'white', 
                                fontWeight: notification.read ? 400 : 600,
                                fontSize: '0.9rem'
                              }}>
                                {notification.title}
                              </Typography>
                            }
                            secondary={
                              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                                {notification.timestamp}
                              </Typography>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </TabPanel>

          {/* Matches Tab */}
          <TabPanel value={activeTab} index={4}>
            <Grid container spacing={3}>
              {compatibilityMatches.map((match, index) => (
                <Grid item xs={12} md={6} lg={4} key={index}>
                  <Box
                  >
                    <Card sx={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      backdropFilter: 'blur(20px)',
                      borderRadius: 3,
                      border: '1px solid rgba(242, 159, 5, 0.20)',
                      height: '100%',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
                      }
                    }}>
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Avatar src={match.user.avatar} sx={{ width: 56, height: 56, mr: 2 }} />
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                              {match.user.name}
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                              {match.user.type} • {match.user.age} • {match.user.location}
                            </Typography>
                          </Box>
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h4" sx={{ 
                              color: match.compatibility > 90 ? '#F29F05' : match.compatibility > 80 ? '#F29F05' : '#8C1D04',
                              fontWeight: 700
                            }}>
                              {match.compatibility}%
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                              Kompatibilität
                            </Typography>
                          </Box>
                        </Box>
                        
                        <Box sx={{ mb: 2 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                              Gemeinsame Tore: {match.sharedGates}
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                              Kanäle: {match.sharedChannels}
                            </Typography>
                          </Box>
                        </Box>
                        
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" sx={{ color: '#F29F05', fontWeight: 600, mb: 1 }}>
                            Kompatibilitäts-Faktoren:
                          </Typography>
                          {match.compatibilityFactors.map((factor, idx) => (
                              <Chip
                              key={idx}
                              label={factor}
                              size="small"
                              sx={{
                                background: 'rgba(242, 159, 5, 0.10)',
                                color: '#F29F05',
                                fontSize: '0.7rem',
                                mr: 0.5,
                                mb: 0.5
                              }}
                            />
                          ))}
                        </Box>
                        
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button 
                            variant="contained" 
                            fullWidth
                            onClick={() => handleUserClick(match.user)}
                            sx={{
                              background: 'linear-gradient(135deg, #F29F05, #8C1D04)',
                              color: 'white',
                              fontWeight: 600,
                              '&:hover': {
                                background: 'linear-gradient(135deg, #8C1D04, #F29F05)'
                              }
                            }}
                          >
                            Nachricht senden
                          </Button>
                          <Button 
                            variant="outlined"
                            onClick={() => handleCompatibilityCheck(match.user)}
                            sx={{
                              borderColor: 'rgba(242, 159, 5, 0.30)',
                              color: '#F29F05',
                              minWidth: 'auto',
                              px: 2,
                              '&:hover': {
                                borderColor: '#8C1D04',
                                backgroundColor: 'rgba(242, 159, 5, 0.10)'
                              }
                            }}
                          >
                            <Heart size={16} />
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </TabPanel>

          {/* Mentoring Tab */}
          <TabPanel value={activeTab} index={5}>
            <Grid container spacing={3}>
              {mentorMenteeMatches.map((match, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <Box
                  >
                    <Card sx={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      backdropFilter: 'blur(20px)',
                      borderRadius: 3,
                      border: '1px solid rgba(242, 159, 5, 0.20)',
                      height: '100%',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
                      }
                    }}>
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Avatar src={match.user.avatar} sx={{ width: 56, height: 56, mr: 2 }} />
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                              {match.user.name}
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                              {match.user.type}
                            </Typography>
                          </Box>
                          <Chip 
                            label={match.type === 'mentor' ? 'Mentor' : 'Mentee'} 
                            sx={{ 
                              background: match.type === 'mentor' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(59, 130, 246, 0.2)',
                              color: match.type === 'mentor' ? '#F29F05' : '#3b82f6',
                              fontWeight: 600
                            }} 
                          />
                        </Box>
                        
                        {match.type === 'mentor' ? (
                          <Box>
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mb: 1 }}>
                              <strong>Spezialgebiet:</strong> {match.specialty}
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mb: 1 }}>
                              <strong>Erfahrung:</strong> {match.user.experience}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Star size={16} style={{ color: '#F29F05', marginRight: 4 }} />
                                <Typography variant="body2" sx={{ color: 'white' }}>
                                  {match.rating}
                                </Typography>
                              </Box>
                              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                {match.students} Studenten
                              </Typography>
                            </Box>
                          </Box>
                        ) : (
                          <Box>
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mb: 1 }}>
                              <strong>Level:</strong> {match.user.level}
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mb: 1 }}>
                              <strong>Such nach:</strong> {match.lookingFor}
                            </Typography>
                            <Box sx={{ mb: 2 }}>
                              <Typography variant="body2" sx={{ color: '#F29F05', fontWeight: 600, mb: 1 }}>
                                Ziele:
                              </Typography>
                              {match.goals?.map((goal, idx) => (
                                <Chip
                                  key={idx}
                                  label={goal}
                                  size="small"
                                  sx={{
                                    background: 'rgba(242, 159, 5, 0.10)',
                                    color: '#F29F05',
                                    fontSize: '0.7rem',
                                    mr: 0.5,
                                    mb: 0.5
                                  }}
                                />
                              ))}
                            </Box>
                          </Box>
                        )}
                        
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 2 }}>
                          {match.description}
                        </Typography>
                        
                        <Button 
                          variant="contained" 
                          fullWidth
                          onClick={() => handleUserClick(match.user)}
                          sx={{
                            background: 'linear-gradient(135deg, #F29F05, #8C1D04)',
                            color: '#1f2937',
                            fontWeight: 600,
                            '&:hover': {
                              background: 'linear-gradient(135deg, #8C1D04, #F29F05)'
                            }
                          }}
                        >
                          {match.type === 'mentor' ? 'Als Mentor kontaktieren' : 'Als Mentee kontaktieren'}
                        </Button>
                      </CardContent>
                    </Card>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </TabPanel>

          <TabPanel value={activeTab} index={6}>
            <Grid container spacing={3}>
              {trendingTopics.map((topic, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Box
                  >
                    <Card sx={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      backdropFilter: 'blur(20px)',
                      borderRadius: 3,
                      border: '1px solid rgba(242, 159, 5, 0.20)',
                      p: 3,
                      textAlign: 'center',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
                      }
                    }}>
                      <CardContent>
                        <Box sx={{ mb: 2 }}>
                          {topic.trend === 'up' && <TrendingUp size={32} style={{ color: '#F29F05' }} />}
                          {topic.trend === 'down' && <TrendingUp size={32} style={{ color: '#ef4444', transform: 'rotate(180deg)' }} />}
                          {topic.trend === 'stable' && <Activity size={32} style={{ color: '#f59e0b' }} />}
                        </Box>
                        <Typography variant="h6" sx={{ color: 'white', fontWeight: 600, mb: 1 }}>
                          {topic.topic}
                        </Typography>
                        <Typography variant="h4" sx={{ color: '#F29F05', fontWeight: 700, mb: 1 }}>
                          {topic.posts}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                          Posts
                        </Typography>
                      </CardContent>
                    </Card>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </TabPanel>

        {/* Floating Action Button */}
        <Fab
          color="primary"
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            background: 'linear-gradient(135deg, #F29F05, #8C1D04)',
            color: '#1f2937',
            '&:hover': {
              background: 'linear-gradient(135deg, #8C1D04, #F29F05)',
              transform: 'scale(1.1)'
            }
          }}
          onClick={() => setNewPostDialog(true)}
        >
          <Plus size={24} />
        </Fab>

        {/* New Post Dialog */}
        <Dialog
          open={newPostDialog}
          onClose={() => setNewPostDialog(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              background: 'rgba(15, 15, 35, 0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(242, 159, 5, 0.20)',
              borderRadius: 3
            }
          }}
        >
          <DialogTitle sx={{ color: 'white', fontWeight: 600 }}>
            Neuen Post erstellen
          </DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              multiline
              rows={4}
              placeholder="Was möchtest du mit der Community teilen?"
              value={newPostText}
              onChange={(e) => setNewPostText(e.target.value)}
              sx={{
                mt: 2,
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': {
                    borderColor: 'rgba(255,255,255,0.3)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255,255,255,0.5)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#F29F05',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(255,255,255,0.7)',
                }
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setNewPostDialog(false)}
              sx={{ color: 'rgba(255,255,255,0.7)' }}
            >
              Abbrechen
            </Button>
            <Button
              onClick={handleNewPost}
              variant="contained"
              sx={{
                background: 'linear-gradient(135deg, #F29F05, #8C1D04)',
                color: '#1f2937',
                fontWeight: 600,
                '&:hover': {
                  background: 'linear-gradient(135deg, #8C1D04, #F29F05)'
                }
              }}
            >
              Posten
            </Button>
          </DialogActions>
        </Dialog>

        {/* Messages Dialog */}
        <Dialog
          open={messagesDialog}
          onClose={() => setMessagesDialog(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              background: 'rgba(15, 15, 35, 0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(242, 159, 5, 0.20)',
              borderRadius: 3
            }
          }}
        >
          <DialogTitle sx={{ color: 'white', fontWeight: 600 }}>
            Nachricht an {selectedUser?.name}
          </DialogTitle>
          <DialogContent>
            {selectedUser && (
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, p: 2, background: 'rgba(255, 255, 255, 0.03)', borderRadius: 2 }}>
                <Avatar src={selectedUser.avatar} sx={{ width: 40, height: 40, mr: 2 }} />
                <Box>
                  <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 600 }}>
                    {selectedUser.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                    {selectedUser.type}
                  </Typography>
                </Box>
              </Box>
            )}
            <TextField
              fullWidth
              multiline
              rows={4}
              placeholder="Schreibe eine Nachricht..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': {
                    borderColor: 'rgba(255,255,255,0.3)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255,255,255,0.5)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#F29F05',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(255,255,255,0.7)',
                }
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setMessagesDialog(false)}
              sx={{ color: 'rgba(255,255,255,0.7)' }}
            >
              Abbrechen
            </Button>
            <Button
              onClick={handleSendMessage}
              variant="contained"
              sx={{
                background: 'linear-gradient(135deg, #F29F05, #8C1D04)',
                color: '#1f2937',
                fontWeight: 600,
                '&:hover': {
                  background: 'linear-gradient(135deg, #8C1D04, #F29F05)'
                }
              }}
            >
              Senden
            </Button>
          </DialogActions>
        </Dialog>

        {/* Comment Dialog */}
        <Dialog
          open={commentDialog.open}
          onClose={() => setCommentDialog({ open: false, postId: null })}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              background: 'rgba(15, 15, 35, 0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(242, 159, 5, 0.20)',
              borderRadius: 3
            }
          }}
        >
          <DialogTitle sx={{ color: 'white', fontWeight: 600 }}>
            Kommentar hinzufügen
          </DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              multiline
              rows={4}
              placeholder="Schreibe einen Kommentar..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              sx={{
                mt: 2,
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': {
                    borderColor: 'rgba(255,255,255,0.3)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255,255,255,0.5)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#F29F05',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(255,255,255,0.7)',
                }
              }}
            />
            {commentDialog.postId !== null && postComments[commentDialog.postId] && postComments[commentDialog.postId].length > 0 && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 2 }}>
                  Kommentare ({postComments[commentDialog.postId].length})
                </Typography>
                {postComments[commentDialog.postId].map((comment: any) => (
                  <Box key={comment.id} sx={{ mb: 2, p: 2, background: 'rgba(255,255,255,0.05)', borderRadius: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Avatar src={comment.avatar} sx={{ width: 32, height: 32, mr: 1 }} />
                      <Typography variant="body2" sx={{ color: 'white', fontWeight: 600 }}>
                        {comment.author}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', ml: 1 }}>
                        {comment.timestamp}
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                      {comment.content}
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setCommentDialog({ open: false, postId: null })}
              sx={{ color: 'rgba(255,255,255,0.7)' }}
            >
              Abbrechen
            </Button>
            <Button
              onClick={handleCommentSubmit}
              variant="contained"
              sx={{
                background: 'linear-gradient(135deg, #F29F05, #8C1D04)',
                color: 'white',
                fontWeight: 600,
                '&:hover': {
                  background: 'linear-gradient(135deg, #8C1D04, #F29F05)'
                }
              }}
            >
              Kommentieren
            </Button>
          </DialogActions>
        </Dialog>
        </Container>

        {/* CSS Animations */}
        <style>{`
          @keyframes pulse {
            0%, 100% {
              transform: scale(1);
              opacity: 0.5;
            }
            50% {
              transform: scale(1.1);
              opacity: 0.8;
            }
          }
        `}</style>
      </Box>
    </AccessControl>
  );
}

// Hauptkomponente mit ProtectedRoute
export default function CommunityPage() {
  return (
    <CommunityContent />
  );
}
