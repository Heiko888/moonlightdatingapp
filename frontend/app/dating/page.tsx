"use client";

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
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  ListItemIcon
} from '@mui/material';
import { 
  Heart, 
  MessageCircle, 
  MapPin, 
  Calendar,
  Users,
  Star,
  Filter,
  Search,
  Settings,
  Bell,
  MoreVertical,
  Lightbulb,
  User,
  Shield,
  LogOut,
  HelpCircle,
  Info
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';
import SSRSafeStars from '@/components/SSRSafeStars';

export default function DatingDashboard() {
  const [activeTab, setActiveTab] = useState('swipe');
  const [settingsAnchorEl, setSettingsAnchorEl] = useState<null | HTMLElement>(null);

  // Settings menu handlers
  const handleSettingsClick = (event: React.MouseEvent<HTMLElement>) => {
    setSettingsAnchorEl(event.currentTarget);
  };

  const handleSettingsClose = () => {
    setSettingsAnchorEl(null);
  };

  // Mock data for dashboard
  const existingMatches = [
    {
      id: 1,
      name: "Sarah",
      age: 28,
      type: "Generator",
      profile: "1/3",
      distance: "2 km",
      lastActive: "vor 2 Stunden",
      compatibility: 95,
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      interests: ["Yoga", "Reisen", "Kochen"]
    },
    {
      id: 2,
      name: "Marcus",
      age: 32,
      type: "Projector",
      profile: "2/4",
      distance: "5 km",
      lastActive: "vor 1 Tag",
      compatibility: 88,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      interests: ["Musik", "Fotografie", "Natur"]
    },
    {
      id: 3,
      name: "Emma",
      age: 25,
      type: "Manifesting Generator",
      profile: "3/5",
      distance: "8 km",
      lastActive: "vor 3 Stunden",
      compatibility: 92,
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      interests: ["Tanzen", "Kunst", "Wellness"]
    }
  ];

  const events = [
    {
      id: 1,
      title: "Human Design Meetup",
      date: "15. Jan 2025",
      time: "19:00",
      location: "Berlin Mitte",
      attendees: 24,
      type: "Meetup"
    },
    {
      id: 2,
      title: "Reiki & Human Design Workshop",
      date: "22. Jan 2025",
      time: "14:00",
      location: "Hamburg Altona",
      attendees: 12,
      type: "Workshop"
    },
    {
      id: 3,
      title: "Dating & Energie Workshop",
      date: "28. Jan 2025",
      time: "18:30",
      location: "München Schwabing",
      attendees: 18,
      type: "Workshop"
    }
  ];

  const stats = [
    { label: "Matches", value: "12", icon: <Heart size={24} />, color: "#ef4444" },
    { label: "Nachrichten", value: "8", icon: <MessageCircle size={24} />, color: "#3b82f6" },
    { label: "Events", value: "3", icon: <Calendar size={24} />, color: "#10b981" },
    { label: "Kompatibilität", value: "94%", icon: <Star size={24} />, color: "#f59e0b" }
  ];


  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0F0F23 0%, #1A1A2E 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <SSRSafeStars />
      
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, py: 4 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
          <Typography
              variant="h3"
            sx={{
              color: '#FFD700',
              fontWeight: 800,
                mb: 1,
                fontSize: { xs: '2rem', md: '2.5rem' }
              }}
            >
              💕 Dating Dashboard
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.7)' }}>
              Finde deine energetischen Matches
          </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <IconButton sx={{ color: '#FFD700' }}>
              <Badge badgeContent={3} color="error">
                <Bell size={24} />
              </Badge>
            </IconButton>
            <IconButton 
              sx={{ color: '#FFD700' }}
              onClick={handleSettingsClick}
            >
              <Settings size={24} />
            </IconButton>
          </Box>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {stats.map((stat, index) => (
            <Grid item xs={6} md={3} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card sx={{
                  background: 'rgba(255,255,255,0.05)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 2
                }}>
                  <CardContent sx={{ p: 3, textAlign: 'center' }}>
                    <Box sx={{ color: stat.color, mb: 1 }}>
                      {stat.icon}
                    </Box>
                    <Typography variant="h4" sx={{ color: 'white', fontWeight: 700, mb: 0.5 }}>
                      {stat.value}
          </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                      {stat.label}
          </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* Navigation Tabs */}
        <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
          {[
            { id: 'swipe', label: 'Swipe', icon: <Heart size={20} /> },
            { id: 'matches', label: 'Matches', icon: <Users size={20} /> },
            { id: 'events', label: 'Events', icon: <Calendar size={20} /> },
            { id: 'messages', label: 'Nachrichten', icon: <MessageCircle size={20} /> }
          ].map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? 'contained' : 'outlined'}
              onClick={() => setActiveTab(tab.id)}
              startIcon={tab.icon}
            sx={{
                background: activeTab === tab.id ? 'linear-gradient(45deg, #FFD700, #fbbf24)' : 'transparent',
                color: activeTab === tab.id ? '#23233a' : '#FFD700',
                border: '1px solid #FFD700',
                '&:hover': {
                  background: activeTab === tab.id ? 'linear-gradient(45deg, #fbbf24, #FFD700)' : 'rgba(255, 215, 0, 0.1)'
                }
              }}
            >
              {tab.label}
            </Button>
          ))}
        </Box>

        {/* Content based on active tab */}
        {activeTab === 'swipe' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Typography variant="h4" sx={{ color: 'white', mb: 2 }}>
                💫 Intelligente Swipe-Funktion
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.8)', mb: 4 }}>
                Entdecke Menschen mit kompatibler Human Design Energie
          </Typography>
          
              <Button
                component={Link}
                href="/swipe"
                variant="contained"
                size="large"
            sx={{ 
                  background: 'linear-gradient(45deg, #ef4444, #dc2626)',
                  color: 'white',
                  fontWeight: 700,
                  px: 6,
                  py: 2,
                  fontSize: '1.2rem',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #dc2626, #ef4444)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 10px 30px rgba(239, 68, 68, 0.4)'
                  }
                }}
              >
                <Heart size={24} style={{ marginRight: 8 }} />
                Jetzt swipen
              </Button>
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Card sx={{
                  background: 'rgba(255,255,255,0.05)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 3,
                  textAlign: 'center',
                  p: 3
                }}>
                  <Heart size={48} color="#ef4444" style={{ marginBottom: 16 }} />
                  <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                    Energetische Kompatibilität
                  </Typography>
                  <Typography sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    Finde Menschen, deren Energie perfekt zu deiner passt
          </Typography>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Card sx={{
                  background: 'rgba(255,255,255,0.05)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 3,
                  textAlign: 'center',
                  p: 3
                }}>
                  <Users size={48} color="#3b82f6" style={{ marginBottom: 16 }} />
                  <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                    Human Design Matching
          </Typography>
                  <Typography sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    Basierend auf Typ, Profil und energetischen Zentren
          </Typography>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Card sx={{
                  background: 'rgba(255,255,255,0.05)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 3,
              textAlign: 'center',
                  p: 3
                }}>
                  <Star size={48} color="#f59e0b" style={{ marginBottom: 16 }} />
                  <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                    Authentische Verbindungen
                  </Typography>
                  <Typography sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    Echte Resonanz statt oberflächliche Matches
                  </Typography>
                </Card>
              </Grid>
            </Grid>
          </motion.div>
        )}

        {activeTab === 'matches' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Grid container spacing={3}>
              {existingMatches.map((match) => (
                <Grid item xs={12} md={6} lg={4} key={match.id}>
                  <Card sx={{
                    background: 'rgba(255,255,255,0.05)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 3,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
                    }
                  }}>
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar 
                          src={match.image} 
                          sx={{ width: 60, height: 60, mr: 2 }}
                        />
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                            {match.name}, {match.age}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                            {match.type} • {match.profile}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                            {match.distance} • {match.lastActive}
                          </Typography>
                        </Box>
                        <IconButton>
                          <MoreVertical size={20} color="rgba(255,255,255,0.7)" />
                        </IconButton>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Star size={16} color="#FFD700" />
                        <Typography variant="body2" sx={{ color: '#FFD700', ml: 1, fontWeight: 600 }}>
                          {match.compatibility}% Kompatibilität
                      </Typography>
                    </Box>

                    <Box sx={{ mb: 3 }}>
                        {match.interests.map((interest, index) => (
                        <Chip
                          key={index}
                            label={interest}
                          size="small"
                          sx={{
                            mr: 1,
                            mb: 1,
                              background: 'rgba(255, 215, 0, 0.2)',
                              color: '#FFD700',
                              border: '1px solid #FFD700'
                          }}
                        />
                      ))}
                    </Box>

                      <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="contained"
                      fullWidth
                      sx={{
                            background: 'linear-gradient(45deg, #ef4444, #dc2626)',
                            '&:hover': { background: 'linear-gradient(45deg, #dc2626, #ef4444)' }
                          }}
                        >
                          <Heart size={16} style={{ marginRight: 8 }} />
                          Like
                        </Button>
                        <Button
                          variant="outlined"
                          fullWidth
                          sx={{
                            borderColor: '#3b82f6',
                            color: '#3b82f6',
                            '&:hover': { borderColor: '#2563eb', background: 'rgba(59, 130, 246, 0.1)' }
                          }}
                        >
                          <MessageCircle size={16} style={{ marginRight: 8 }} />
                          Chat
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        )}

        {activeTab === 'events' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Grid container spacing={3}>
              {events.map((event) => (
                <Grid item xs={12} md={6} key={event.id}>
                  <Card sx={{
                    background: 'rgba(255,255,255,0.05)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 3,
                    transition: 'all 0.3s ease',
                        '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
                    }
                  }}>
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Box>
                          <Typography variant="h6" sx={{ color: 'white', fontWeight: 600, mb: 1 }}>
                            {event.title}
                          </Typography>
                          <Chip 
                            label={event.type} 
                            size="small" 
                            sx={{ 
                              background: 'rgba(16, 185, 129, 0.2)', 
                              color: '#10b981',
                              border: '1px solid #10b981'
                            }} 
                          />
                        </Box>
                        <IconButton>
                          <MoreVertical size={20} color="rgba(255,255,255,0.7)" />
                        </IconButton>
                      </Box>
                      
                      <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Calendar size={16} color="rgba(255,255,255,0.7)" />
                          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', ml: 1 }}>
                            {event.date} • {event.time}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <MapPin size={16} color="rgba(255,255,255,0.7)" />
                          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', ml: 1 }}>
                            {event.location}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Users size={16} color="rgba(255,255,255,0.7)" />
                          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', ml: 1 }}>
                            {event.attendees} Teilnehmer
                          </Typography>
                        </Box>
                      </Box>

                      <Button
                        variant="contained"
                        fullWidth
                        sx={{
                          background: 'linear-gradient(45deg, #10b981, #059669)',
                          '&:hover': { background: 'linear-gradient(45deg, #059669, #10b981)' }
                        }}
                      >
                        <Calendar size={16} style={{ marginRight: 8 }} />
                        Teilnehmen
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          </motion.div>
        )}

        {activeTab === 'messages' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card sx={{
              background: 'rgba(255,255,255,0.05)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 3
            }}>
              <CardContent sx={{ p: 0 }}>
                <List>
                  {existingMatches.slice(0, 3).map((match, index) => (
                    <div key={match.id}>
                      <ListItem sx={{ p: 3 }}>
                        <ListItemAvatar>
                          <Avatar src={match.image} />
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography variant="h6" sx={{ color: 'white' }}>
                                {match.name}
                              </Typography>
                              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                {match.lastActive}
                              </Typography>
                            </Box>
                          }
                          secondary={
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                              Hey! Wie war dein Tag? 😊
                            </Typography>
                          }
                        />
                        <Badge badgeContent={1} color="error">
                          <MessageCircle size={24} color="rgba(255,255,255,0.7)" />
                        </Badge>
                      </ListItem>
                      {index < 2 && <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />}
                    </div>
                  ))}
                </List>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Quick Actions */}
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="h5" sx={{ color: 'white', mb: 3 }}>
            Schnellaktionen
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              component={Link}
              href="/dating-info"
              variant="outlined"
              startIcon={<Heart size={20} />}
              sx={{ 
                borderColor: '#FFD700',
                color: '#FFD700',
                '&:hover': { borderColor: '#fbbf24', background: 'rgba(255, 215, 0, 0.1)' }
              }}
            >
              Dating Info
            </Button>
            <Button
              component={Link}
              href="/dating/match-tips"
              variant="outlined"
              startIcon={<Lightbulb size={20} />}
              sx={{ 
                borderColor: '#8b5cf6',
                color: '#8b5cf6',
                '&:hover': { borderColor: '#7c3aed', background: 'rgba(139, 92, 246, 0.1)' }
              }}
            >
              Match Tipps
            </Button>
            <Button
              variant="outlined"
              startIcon={<Search size={20} />}
              sx={{ 
                borderColor: '#3b82f6',
                color: '#3b82f6',
                '&:hover': { borderColor: '#2563eb', background: 'rgba(59, 130, 246, 0.1)' }
              }}
            >
              Neue Matches
            </Button>
            <Button
              variant="outlined"
              startIcon={<Filter size={20} />}
            sx={{ 
                borderColor: '#10b981',
                color: '#10b981',
                '&:hover': { borderColor: '#059669', background: 'rgba(16, 185, 129, 0.1)' }
              }}
            >
              Filter
          </Button>
            <Button
              component={Link}
              href="/reading"
              variant="outlined"
              startIcon={<Star size={20} />}
              sx={{ 
                borderColor: '#f59e0b',
                color: '#f59e0b',
                '&:hover': { borderColor: '#d97706', background: 'rgba(245, 158, 11, 0.1)' }
              }}
            >
              Reading
            </Button>
          </Box>
        </Box>
      </Container>

      {/* Settings Menu */}
      <Menu
        anchorEl={settingsAnchorEl}
        open={Boolean(settingsAnchorEl)}
        onClose={handleSettingsClose}
        PaperProps={{
          sx: {
            background: 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 2,
            mt: 1,
            minWidth: 200
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem 
          onClick={handleSettingsClose}
          component={Link}
          href="/dashboard"
          sx={{ 
            color: 'white',
            '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
          }}
        >
          <ListItemIcon>
            <User size={20} color="#FFD700" />
          </ListItemIcon>
          <ListItemText primary="Profil bearbeiten" />
        </MenuItem>
        
        <MenuItem 
          onClick={handleSettingsClose}
          component={Link}
          href="/settings"
            sx={{ 
              color: 'white',
            '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
          }}
        >
          <ListItemIcon>
            <Settings size={20} color="#FFD700" />
          </ListItemIcon>
          <ListItemText primary="Einstellungen" />
        </MenuItem>
        
        <MenuItem 
          onClick={handleSettingsClose}
          component={Link}
          href="/privacy"
            sx={{ 
            color: 'white',
            '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
          }}
        >
          <ListItemIcon>
            <Shield size={20} color="#FFD700" />
          </ListItemIcon>
          <ListItemText primary="Datenschutz" />
        </MenuItem>
        
        <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
        
        <MenuItem 
          onClick={handleSettingsClose}
          component={Link}
          href="/help"
            sx={{
            color: 'white',
            '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
          }}
        >
          <ListItemIcon>
            <HelpCircle size={20} color="#FFD700" />
          </ListItemIcon>
          <ListItemText primary="Hilfe & Support" />
        </MenuItem>
        
        <MenuItem 
          onClick={handleSettingsClose}
            component={Link}
          href="/about"
          sx={{ 
            color: 'white',
            '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
          }}
        >
          <ListItemIcon>
            <Info size={20} color="#FFD700" />
          </ListItemIcon>
          <ListItemText primary="Über die App" />
        </MenuItem>
        
        <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
        
        <MenuItem 
          onClick={handleSettingsClose}
          sx={{ 
            color: '#ef4444',
            '&:hover': { backgroundColor: 'rgba(239, 68, 68, 0.1)' }
          }}
        >
          <ListItemIcon>
            <LogOut size={20} color="#ef4444" />
          </ListItemIcon>
          <ListItemText primary="Abmelden" />
        </MenuItem>
      </Menu>
    </Box>
  );
}