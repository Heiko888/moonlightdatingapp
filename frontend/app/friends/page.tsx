"use client";

import React, { useEffect, useState } from "react";
import { 
  Box, 
  Typography, 
  Button, 
  Card, 
  CardContent, 
  Container,
  Grid,
  Chip,
  Avatar,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
  Badge,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  alpha,
  Fade,
  Slide
} from "@mui/material";
import { 
  Users, 
  Search, 
  MapPin, 
  Heart, 
  MessageCircle, 
  Star, 
  Filter,
  Plus,
  UserPlus,
  Activity,
  Calendar,
  Coffee,
  Music,
  Camera,
  BookOpen,
  Gamepad2,
  Mountain,
  Car,
  Plane,
  Sparkles,
  Zap,
  Shield,
  Brain,
  Eye,
  Home
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Types
interface Friend {
  id: string;
  name: string;
  avatar: string;
  location: string;
  age: number;
  hdType: string;
  interests: string[];
  bio: string;
  isOnline: boolean;
  lastSeen: string;
  mutualFriends: number;
  compatibility: number;
  activities: string[];
  status: 'online' | 'away' | 'busy' | 'offline';
}

interface Activity {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  participants: number;
  maxParticipants: number;
  category: string;
  icon: React.ReactNode;
  color: string;
}

// Mock Data - Erweiterte Freunde-Liste
// Mock-Daten entfernt - Friends werden jetzt aus Supabase geladen

const mockActivities: Activity[] = [
  {
    id: '1',
    title: 'Yoga im Park',
    description: 'Gemeinsame Yoga-Session im Tiergarten mit Anna',
    date: '2024-01-15',
    location: 'Tiergarten, Berlin',
    participants: 8,
    maxParticipants: 15,
    category: 'Wellness',
    icon: <Activity size={20} />,
    color: '#10b981'
  },
  {
    id: '2',
    title: 'Kunst-Ausstellung',
    description: 'Besuch der neuen Ausstellung im Hamburger Bahnhof',
    date: '2024-01-18',
    location: 'Hamburger Bahnhof, Berlin',
    participants: 5,
    maxParticipants: 10,
    category: 'Kultur',
    icon: <Camera size={20} />,
    color: '#10b981'
  },
  {
    id: '3',
    title: 'Kaffee & Gespräche',
    description: 'Entspannte Gespräche bei gutem Kaffee',
    date: '2024-01-20',
    location: 'Café Einstein, München',
    participants: 3,
    maxParticipants: 6,
    category: 'Gesellschaft',
    icon: <Coffee size={20} />,
    color: '#34d399'
  },
  {
    id: '4',
    title: 'Tech-Talk & Human Design',
    description: 'Diskussion über Technologie und spirituelle Entwicklung',
    date: '2024-01-22',
    location: 'Co-Working Space, Frankfurt',
    participants: 12,
    maxParticipants: 20,
    category: 'Bildung',
    icon: <Brain size={20} />,
    color: '#10b981'
  },
  {
    id: '5',
    title: 'Tanz-Workshop',
    description: 'Kreativer Tanz-Workshop mit Lena',
    date: '2024-01-25',
    location: 'Tanzstudio, Köln',
    participants: 6,
    maxParticipants: 12,
    category: 'Kunst',
    icon: <Music size={20} />,
    color: '#34d399'
  },
  {
    id: '6',
    title: 'Sport & Motivation',
    description: 'Gemeinsames Training mit Tom',
    date: '2024-01-28',
    location: 'Fitness-Studio, Stuttgart',
    participants: 4,
    maxParticipants: 8,
    category: 'Sport',
    icon: <Zap size={20} />,
    color: '#059669'
  }
];

export default function FriendsPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const [showFriendDialog, setShowFriendDialog] = useState(false);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [activities, setActivities] = useState<Activity[]>(mockActivities);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Neue Features
  const [sortBy, setSortBy] = useState<'name' | 'compatibility' | 'lastSeen' | 'mutualFriends'>('compatibility');
  const [filterBy, setFilterBy] = useState<'all' | 'online' | 'offline' | 'hdType'>('all');
  const [selectedHdType, setSelectedHdType] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  // Lade Friends aus Supabase
  useEffect(() => {
    const loadFriends = async () => {
      try {
        setLoading(true);
        const userId = localStorage.getItem('userId');
        
        if (!userId) {
          console.warn('Kein User eingeloggt');
          setLoading(false);
          return;
        }

        const response = await fetch(`/api/friends?userId=${userId}`);
        const data = await response.json();

        if (data.success && data.friends) {
          setFriends(data.friends);
        } else {
          setError('Fehler beim Laden der Friends');
        }
      } catch (err) {
        console.error('Error loading friends:', err);
        setError('Fehler beim Laden der Friends');
      } finally {
        setLoading(false);
      }
    };

    loadFriends();
    setMounted(true);
  }, []);

  if (!mounted || loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          background: `
            radial-gradient(circle at 20% 20%, rgba(16, 185, 129, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(52, 211, 153, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 60%, rgba(16, 185, 129, 0.15) 0%, transparent 50%),
            linear-gradient(135deg, #0F0F23 0%, #1A1A2E 100%)
          `,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2
        }}
      >
        <Typography variant="h6" sx={{ color: 'white' }}>
          Lade Friends...
        </Typography>
        {error && (
          <Typography variant="body2" sx={{ color: '#ff6b9d' }}>
            {error}
          </Typography>
        )}
      </Box>
    );
  }

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleFriendClick = (friend: Friend) => {
    setSelectedFriend(friend);
    setShowFriendDialog(true);
  };

  // Erweiterte Filter- und Sortierfunktionen
  const filteredAndSortedFriends = friends
    .filter(friend => {
      // Suchfilter
      const matchesSearch = friend.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        friend.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        friend.interests.some(interest => 
          interest.toLowerCase().includes(searchQuery.toLowerCase())
        );
      
      // Status-Filter
      const matchesStatus = filterBy === 'all' || 
        (filterBy === 'online' && friend.isOnline) ||
        (filterBy === 'offline' && !friend.isOnline) ||
        (filterBy === 'hdType' && friend.hdType === selectedHdType);
      
      // Favoriten-Filter
      const matchesFavorites = !showFavoritesOnly || favorites.includes(friend.id);
      
      return matchesSearch && matchesStatus && matchesFavorites;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'compatibility':
          return b.compatibility - a.compatibility;
        case 'mutualFriends':
          return b.mutualFriends - a.mutualFriends;
        case 'lastSeen':
          return a.lastSeen.localeCompare(b.lastSeen);
        default:
          return 0;
      }
    });

  const handleToggleFavorite = (friendId: string) => {
    setFavorites(prev => 
      prev.includes(friendId) 
        ? prev.filter(id => id !== friendId)
        : [...prev, friendId]
    );
  };

  const getUniqueHdTypes = () => {
    return [...new Set(friends.map(friend => friend.hdType))];
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: `
        radial-gradient(circle at 20% 20%, rgba(52, 211, 153, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 80% 80%, rgba(16, 185, 129, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 40% 60%, rgba(102, 126, 234, 0.1) 0%, transparent 50%),
        linear-gradient(135deg, #0F0F23 0%, #1A1A2E 100%)
      `,
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Fixed Navigation Bar */}
      <Box sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        backdropFilter: 'blur(20px)',
        background: 'rgba(26, 11, 46, 0.8)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <Container maxWidth="lg">
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            py: 2 
          }}>
            <Link href="/" style={{ textDecoration: 'none' }}>
              <Typography variant="h5" sx={{ 
                background: 'linear-gradient(135deg, #4ecdc4, #8b5cf6, #ff6b9d)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 800,
                cursor: 'pointer'
              }}>
                🔑 The Connection Key
              </Typography>
            </Link>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                onClick={() => router.push('/community-info')}
                variant="outlined"
                sx={{
                  color: 'white',
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                  '&:hover': {
                    borderColor: '#4ecdc4',
                    background: 'rgba(78, 205, 196, 0.1)'
                  }
                }}
              >
                Info
              </Button>
              <Button
                onClick={() => router.push('/dashboard')}
                variant="contained"
                startIcon={<Home size={18} />}
                sx={{
                  background: 'linear-gradient(135deg, #4ecdc4, #0891b2)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #3bb5b0, #0779a1)'
                  }
                }}
              >
                Dashboard
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2, pt: 15, pb: { xs: 4, md: 8 }, px: { xs: 1, sm: 2 } }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Box sx={{ 
            textAlign: 'center', 
            mb: 6
          }}>
            <Typography
              variant="h2"
              sx={{
                background: 'linear-gradient(135deg, #4ecdc4, #8b5cf6, #ff6b9d)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 800,
                fontSize: { xs: '2rem', md: '3rem' },
                mb: 2,
                textShadow: '0 0 30px rgba(78, 205, 196, 0.3)'
              }}
            >
              👥 Freunde & Community
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                color: 'rgba(255,255,255,0.85)', 
                mb: 3,
                fontSize: { xs: '1rem', md: '1.25rem' },
                maxWidth: 700,
                mx: 'auto',
                lineHeight: 1.8,
                fontWeight: 300
              }}
            >
              Verbinde dich mit Gleichgesinnten und teile deine Human Design Reise.
            </Typography>
          </Box>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Box sx={{ mb: 4 }}>
            <TextField
              fullWidth
              placeholder="Suche nach Namen, Ort oder Interessen..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  background: 'rgba(16, 185, 129, 0.08)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  borderRadius: 3,
                  color: 'white',
                  '&:hover': {
                    border: '1px solid rgba(16, 185, 129, 0.5)'
                  },
                  '&.Mui-focused': {
                    border: '1px solid #10b981'
                  }
                },
                '& .MuiInputBase-input': {
                  color: 'white',
                  '&::placeholder': {
                    color: 'rgba(255,255,255,0.7)'
                  }
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={20} color="rgba(255,255,255,0.7)" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowFilters(!showFilters)}
                      sx={{ color: 'rgba(255,255,255,0.7)' }}
                    >
                      <Filter size={20} />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </Box>
        </motion.div>

        {/* Erweiterte Filter */}
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: showFilters ? 'auto' : 0 }}
          transition={{ duration: 0.3 }}
        >
          {showFilters && (
            <Box sx={{ 
              mb: 4, 
              p: 3, 
              background: 'rgba(255, 255, 255, 0.08)', 
              backdropFilter: 'blur(20px)',
              borderRadius: 4, 
              border: '1px solid rgba(255, 255, 255, 0.15)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
            }}>
              <Grid container spacing={2}>
                {/* Sortierung */}
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)', mb: 1, fontWeight: 600 }}>
                    Sortieren nach:
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {[
                      { key: 'compatibility', label: 'Kompatibilität' },
                      { key: 'name', label: 'Name' },
                      { key: 'mutualFriends', label: 'Gemeinsame Freunde' },
                      { key: 'lastSeen', label: 'Zuletzt online' }
                    ].map(option => (
                      <Chip
                        key={option.key}
                        label={option.label}
                        size="small"
                        onClick={() => setSortBy(option.key as any)}
                        sx={{
                          background: sortBy === option.key ? '#4ecdc4' : 'rgba(78, 205, 196, 0.1)',
                          color: sortBy === option.key ? 'white' : 'rgba(78, 205, 196, 0.9)',
                          cursor: 'pointer',
                          border: '1px solid rgba(78, 205, 196, 0.3)'
                        }}
                      />
                    ))}
                  </Box>
                </Grid>

                {/* Filter */}
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)', mb: 1, fontWeight: 600 }}>
                    Filter:
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {[
                      { key: 'all', label: 'Alle' },
                      { key: 'online', label: 'Online' },
                      { key: 'offline', label: 'Offline' }
                    ].map(option => (
                      <Chip
                        key={option.key}
                        label={option.label}
                        size="small"
                        onClick={() => setFilterBy(option.key as any)}
                        sx={{
                          background: filterBy === option.key ? '#10b981' : 'rgba(255,255,255,0.1)',
                          color: filterBy === option.key ? 'white' : 'rgba(255,255,255,0.7)',
                          cursor: 'pointer'
                        }}
                      />
                    ))}
                  </Box>
                </Grid>

                {/* Human Design Typ Filter */}
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)', mb: 1, fontWeight: 600 }}>
                    HD-Typ:
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {getUniqueHdTypes().map(hdType => (
                      <Chip
                        key={hdType}
                        label={hdType}
                        size="small"
                        onClick={() => {
                          setFilterBy('hdType');
                          setSelectedHdType(hdType);
                        }}
                        sx={{
                          background: selectedHdType === hdType ? '#4ecdc4' : 'rgba(255,255,255,0.1)',
                          color: selectedHdType === hdType ? 'white' : 'rgba(255,255,255,0.7)',
                          cursor: 'pointer'
                        }}
                      />
                    ))}
                  </Box>
                </Grid>

                {/* Favoriten */}
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)', mb: 1, fontWeight: 600 }}>
                    Favoriten:
                  </Typography>
                  <Chip
                    label={showFavoritesOnly ? 'Nur Favoriten' : 'Alle anzeigen'}
                    size="small"
                    onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                    icon={<Star size={16} />}
                    sx={{
                      background: showFavoritesOnly ? '#4ecdc4' : 'rgba(255,255,255,0.1)',
                      color: showFavoritesOnly ? 'white' : 'rgba(255,255,255,0.7)',
                      cursor: 'pointer'
                    }}
                  />
                </Grid>
              </Grid>
            </Box>
          )}
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Box sx={{ mb: 4 }}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              centered
              sx={{
                '& .MuiTab-root': {
                  color: 'rgba(16, 185, 129, 0.7)',
                  fontWeight: 600,
                  '&.Mui-selected': {
                    color: '#10b981'
                  }
                },
                '& .MuiTabs-indicator': {
                  background: 'linear-gradient(45deg, #10b981, #34d399)',
                  height: 3,
                  borderRadius: 2
                }
              }}
            >
              <Tab 
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Users size={20} />
                    Freunde
                  </Box>
                } 
              />
              <Tab 
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Activity size={20} />
                    Aktivitäten
                  </Box>
                } 
              />
            </Tabs>
          </Box>
        </motion.div>

        {/* Statistiken */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Box sx={{ 
            mb: 4, 
            p: 4, 
            background: 'rgba(255, 255, 255, 0.08)', 
            backdropFilter: 'blur(20px)',
            borderRadius: 4, 
            border: '1px solid rgba(255, 255, 255, 0.15)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
          }}>
            <Grid container spacing={3}>
              <Grid item xs={6} sm={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ color: '#4ecdc4', fontWeight: 700 }}>
                    {filteredAndSortedFriends.length}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Freunde
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ color: '#4ecdc4', fontWeight: 700 }}>
                    {filteredAndSortedFriends.filter(f => f.isOnline).length}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Online
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ color: '#4ecdc4', fontWeight: 700 }}>
                    {favorites.length}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Favoriten
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ color: '#4ecdc4', fontWeight: 700 }}>
                    {activities.length}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Aktivitäten
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </motion.div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {activeTab === 0 && (
            <motion.div
              key="friends"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <Grid container spacing={3}>
                {filteredAndSortedFriends.map((friend, index) => (
                  <Grid item xs={12} sm={6} md={4} key={friend.id}>
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Card
                        sx={{
                          background: 'rgba(255, 255, 255, 0.08)',
                          backdropFilter: 'blur(20px)',
                          border: '1px solid rgba(255, 255, 255, 0.15)',
                          borderRadius: 4,
                          height: '100%',
                          transition: 'all 0.3s ease',
                          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                          cursor: 'pointer',
                          '&:hover': {
                            transform: 'translateY(-8px)',
                            boxShadow: '0 20px 40px rgba(78, 205, 196, 0.3)',
                            border: '1px solid rgba(78, 205, 196, 0.5)'
                          }
                        }}
                        onClick={() => handleFriendClick(friend)}
                      >
                        <CardContent sx={{ p: 3 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Badge
                              overlap="circular"
                              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                              badgeContent={
                                <Box
                                  sx={{
                                    width: 12,
                                    height: 12,
                                    borderRadius: '50%',
                                    background: friend.isOnline ? '#10b981' : '#6b7280',
                                    border: '2px solid white'
                                  }}
                                />
                              }
                            >
                              <Avatar
                                src={friend.avatar}
                                sx={{
                                  width: 60,
                                  height: 60,
                                  border: '3px solid',
                                  borderColor: friend.isOnline ? 'success.main' : 'grey.500'
                                }}
                              />
                            </Badge>
                            <Box sx={{ ml: 2, flex: 1 }}>
                              <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                                {friend.name}
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                <MapPin size={14} color="rgba(255, 255, 255, 0.7)" />
                                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                  {friend.location} • {friend.age} Jahre
                                </Typography>
                              </Box>
                              <Typography variant="body2" sx={{ color: 'rgba(78, 205, 196, 0.9)' }}>
                                {friend.hdType} • {friend.compatibility}% Kompatibilität
                              </Typography>
                            </Box>
                          </Box>

                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: 'rgba(255, 255, 255, 0.8)', 
                              mb: 2, 
                              lineHeight: 1.6,
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden'
                            }}
                          >
                            {friend.bio}
                          </Typography>

                          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                            {friend.interests.slice(0, 3).map((interest, idx) => (
                              <Chip
                                key={idx}
                                label={interest}
                                size="small"
                                sx={{
                                  background: 'rgba(78, 205, 196, 0.2)',
                                  color: '#4ecdc4',
                                  border: '1px solid rgba(78, 205, 196, 0.3)'
                                }}
                              />
                            ))}
                            {friend.interests.length > 3 && (
                              <Chip
                                label={`+${friend.interests.length - 3}`}
                                size="small"
                                sx={{
                                  background: 'rgba(78, 205, 196, 0.1)',
                                  color: 'rgba(78, 205, 196, 0.8)'
                                }}
                              />
                            )}
                          </Box>

                          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'space-between' }}>
                            <Button
                              variant="outlined"
                              size="small"
                              startIcon={<Heart size={16} />}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleFavorite(friend.id);
                              }}
                              sx={{
                                color: favorites.includes(friend.id) ? '#4ecdc4' : 'white',
                                borderColor: favorites.includes(friend.id) ? '#4ecdc4' : 'rgba(255, 255, 255, 0.3)',
                                background: favorites.includes(friend.id) ? 'rgba(78, 205, 196, 0.1)' : 'transparent',
                                '&:hover': {
                                  borderColor: '#4ecdc4',
                                  background: 'rgba(78, 205, 196, 0.2)'
                                }
                              }}
                            >
                              {favorites.includes(friend.id) ? 'Favorit' : 'Favorit'}
                            </Button>
                            <Button
                              variant="outlined"
                              size="small"
                              startIcon={<MessageCircle size={16} />}
                              sx={{
                                color: 'white',
                                borderColor: 'rgba(255, 255, 255, 0.3)',
                                '&:hover': {
                                  borderColor: '#4ecdc4',
                                  background: 'rgba(78, 205, 196, 0.1)'
                                }
                              }}
                            >
                              Chat
                            </Button>
                          </Box>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </motion.div>
          )}

          {activeTab === 1 && (
            <motion.div
              key="activities"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <Grid container spacing={3}>
                {activities.map((activity, index) => (
                  <Grid item xs={12} sm={6} md={4} key={activity.id}>
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Card
                        sx={{
                          background: 'rgba(255, 255, 255, 0.08)',
                          backdropFilter: 'blur(20px)',
                          border: '1px solid rgba(255, 255, 255, 0.15)',
                          borderRadius: 4,
                          height: '100%',
                          transition: 'all 0.3s ease',
                          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                          '&:hover': {
                            transform: 'translateY(-8px)',
                            boxShadow: '0 20px 40px rgba(78, 205, 196, 0.3)',
                            border: '1px solid rgba(78, 205, 196, 0.5)'
                          }
                        }}
                      >
                        <CardContent sx={{ p: 3 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Box sx={{ color: activity.color, mr: 2 }}>
                              {activity.icon}
                            </Box>
                            <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                              {activity.title}
                            </Typography>
                          </Box>

                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: 'rgba(255,255,255,0.8)', 
                              mb: 2, 
                              lineHeight: 1.5
                            }}
                          >
                            {activity.description}
                          </Typography>

                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                            <MapPin size={14} color="rgba(255,255,255,0.7)" />
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                              {activity.location}
                            </Typography>
                          </Box>

                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                            <Calendar size={14} color="rgba(255,255,255,0.7)" />
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                              {new Date(activity.date).toLocaleDateString('de-DE')}
                            </Typography>
                          </Box>

                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                              {activity.participants}/{activity.maxParticipants} Teilnehmer
                            </Typography>
                            <Chip
                              label={activity.category}
                              size="small"
                              sx={{
                                background: `${activity.color}20`,
                                color: activity.color,
                                border: `1px solid ${activity.color}50`
                              }}
                            />
                          </Box>

                          <Button
                            variant="contained"
                            fullWidth
                            startIcon={<UserPlus size={16} />}
                            sx={{
                              background: `linear-gradient(45deg, ${activity.color}, ${activity.color}cc)`,
                              color: 'white',
                              fontWeight: 600,
                              '&:hover': {
                                background: `linear-gradient(45deg, ${activity.color}cc, ${activity.color})`
                              }
                            }}
                          >
                            Teilnehmen
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </motion.div>
          )}
        </AnimatePresence>
      </Container>

      {/* Friend Detail Dialog */}
      <Dialog
        open={showFriendDialog}
        onClose={() => setShowFriendDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            background: 'rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: 4,
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)'
          }
        }}
      >
        {selectedFriend && (
          <>
            <DialogTitle sx={{ color: 'white', textAlign: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                <Avatar
                  src={selectedFriend.avatar}
                  sx={{ width: 60, height: 60 }}
                />
                <Box>
                  <Typography variant="h5" sx={{ color: 'white', fontWeight: 600 }}>
                    {selectedFriend.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                    {selectedFriend.location} • {selectedFriend.age} Jahre
                  </Typography>
                </Box>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', mb: 2 }}>
                {selectedFriend.bio}
              </Typography>
              <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>
                Interessen
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                {selectedFriend.interests.map((interest, idx) => (
                  <Chip
                    key={idx}
                    label={interest}
                    sx={{
                      background: 'rgba(78, 205, 196, 0.2)',
                      color: '#4ecdc4'
                    }}
                  />
                ))}
              </Box>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => setShowFriendDialog(false)}
                sx={{ color: 'rgba(255,255,255,0.7)' }}
              >
                Schließen
              </Button>
              <Button
                variant="contained"
                startIcon={<MessageCircle size={16} />}
                sx={{
                  background: 'linear-gradient(135deg, #4ecdc4, #0891b2)',
                  color: 'white',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #3bb5b0, #0779a1)'
                  }
                }}
              >
                Nachricht senden
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

    </Box>
  );
}
