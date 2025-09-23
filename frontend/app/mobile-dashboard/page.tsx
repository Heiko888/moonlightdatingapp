"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Box, 
  Container, 
  Typography, 
  Card, 
  CardContent, 
  Grid, 
  Chip, 
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Badge,
  Divider,
  Fab,
  BottomNavigation,
  BottomNavigationAction,
  AppBar,
  Toolbar,
  Menu,
  MenuItem,
  SwipeableDrawer
} from '@mui/material';
import { 
  Home, 
  Calendar, 
  User, 
  Settings,
  Menu as MenuIcon,
  Heart,
  Users,
  Star,
  Zap,
  Target,
  BookOpen,
  ChevronRight,
  Bell,
  Clock,
  MapPin,
  Share2,
  ThumbsUp,
  MessageSquare,
  Plus,
  Activity
} from 'lucide-react';
import AccessControl from '../../components/AccessControl';
import { UserSubscription } from '../../lib/subscription/types';
import { SubscriptionService } from '../../lib/subscription/subscriptionService';

export default function MobileDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);
  const [userSubscription, setUserSubscription] = useState<UserSubscription | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [notifications, setNotifications] = useState(3);

  // Authentifizierung und Subscription prüfen
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      
      if (!token || !userId) {
        setIsAuthenticated(false);
        router.push('/login?redirect=/mobile-dashboard');
        return;
      }
      
      setIsAuthenticated(true);
      await loadUserSubscription();
    };

    checkAuth();
  }, [router]);

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

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  // Dashboard-Daten laden
  const [dashboardData, setDashboardData] = useState<any>(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const userId = localStorage.getItem('userId');
        if (!userId) return;

        const response = await fetch(`http://localhost:4001/dashboard/${userId}`);
        if (response.ok) {
          const data = await response.json();
          setDashboardData(data);
        }
      } catch (error) {
        console.error('Fehler beim Laden der Dashboard-Daten:', error);
      }
    };

    if (isAuthenticated) {
      loadDashboardData();
    }
  }, [isAuthenticated]);

  // Quick Stats aus echten Daten oder Fallback
  const quickStats = dashboardData ? [
    { label: "Energie Level", value: "85%", icon: <Zap size={24} />, color: "#10b981" },
    { label: "Matches", value: dashboardData.statistics?.totalMatches?.toString() || "0", icon: <Heart size={24} />, color: "#ef4444" },
    { label: "Events", value: "3", icon: <Calendar size={24} />, color: "#3b82f6" },
    { label: "Posts", value: dashboardData.statistics?.communityActivity?.toString() || "0", icon: <MessageSquare size={24} />, color: "#f59e0b" }
  ] : [
    { label: "Energie Level", value: "85%", icon: <Zap size={24} />, color: "#10b981" },
    { label: "Matches", value: "12", icon: <Heart size={24} />, color: "#ef4444" },
    { label: "Events", value: "3", icon: <Calendar size={24} />, color: "#3b82f6" },
    { label: "Posts", value: "7", icon: <MessageSquare size={24} />, color: "#f59e0b" }
  ];

  // Recent Activity aus echten Daten oder Fallback
  const recentActivity = dashboardData?.recentActivity?.map((activity: any) => ({
    id: activity.id,
    type: activity.type,
    title: activity.message,
    description: activity.type === 'moon' ? 'Mondkalender-Eintrag' : 
                 activity.type === 'reading' ? 'Reading abgeschlossen' :
                 activity.type === 'match' ? 'Neuer Match!' : 'Aktivität',
    timestamp: activity.time,
    icon: activity.type === 'moon' ? <Calendar size={20} /> :
          activity.type === 'reading' ? <BookOpen size={20} /> :
          activity.type === 'match' ? <Heart size={20} /> : <Activity size={20} />,
    color: activity.type === 'moon' ? "#3b82f6" :
           activity.type === 'reading' ? "#8b5cf6" :
           activity.type === 'match' ? "#ef4444" : "#10b981"
  })) || [
    {
      id: 1,
      type: "match",
      title: "Neuer Match mit Sarah",
      description: "Ihr seid 89% kompatibel",
      timestamp: "vor 2 Stunden",
      icon: <Heart size={20} />,
      color: "#ef4444"
    },
    {
      id: 2,
      type: "event",
      title: "Human Design Stammtisch",
      description: "Berlin, 15. Januar 2025",
      timestamp: "vor 4 Stunden",
      icon: <Calendar size={20} />,
      color: "#3b82f6"
    },
    {
      id: 3,
      type: "post",
      title: "Dein Post wurde geliked",
      description: "5 neue Likes erhalten",
      timestamp: "vor 6 Stunden",
      icon: <ThumbsUp size={20} />,
      color: "#f59e0b"
    },
    {
      id: 4,
      type: "energy",
      title: "Energie-Update",
      description: "Dein Energie-Level ist gestiegen",
      timestamp: "vor 8 Stunden",
      icon: <Zap size={20} />,
      color: "#10b981"
    }
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: "Human Design Stammtisch",
      date: "15. Jan",
      time: "19:00",
      location: "Berlin",
      attendees: 24,
      type: "Meetup"
    },
    {
      id: 2,
      title: "Chart-Analyse Workshop",
      date: "22. Jan",
      time: "14:00",
      location: "Online",
      attendees: 12,
      type: "Workshop"
    }
  ];

  const quickActions = [
    { label: "Chart anzeigen", icon: <Target size={24} />, action: () => router.push('/chart') },
    { label: "Community", icon: <Users size={24} />, action: () => router.push('/community') },
    { label: "Dating", icon: <Heart size={24} />, action: () => router.push('/dating') },
    { label: "Journal", icon: <BookOpen size={24} />, action: () => router.push('/journal') },
    { label: "Mondkalender", icon: <Calendar size={24} />, action: () => router.push('/mondkalender') },
    { label: "Coaching", icon: <Star size={24} />, action: () => router.push('/coaching') }
  ];

  if (!isAuthenticated) {
    return (
      <Box sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0F0F23 0%, #1A1A2E 100%)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <Typography variant="h6" sx={{ color: 'white' }}>
          Lade Mobile Dashboard...
        </Typography>
      </Box>
    );
  }

  return (
    <AccessControl
      path="/mobile-dashboard"
      userSubscription={userSubscription}
      onUpgrade={() => router.push('/pricing')}
    >
      <Box sx={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 25%, #533483 50%, #8B5CF6 75%, #A855F7 100%)',
        position: 'relative',
        overflow: 'hidden',
        pb: 8
      }}>
        {/* Mobile App Bar */}
        <AppBar 
          position="fixed" 
          sx={{ 
            background: 'rgba(15, 15, 35, 0.95)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(255,255,255,0.1)'
          }}
        >
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => setDrawerOpen(true)}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" sx={{ flexGrow: 1, color: 'white', fontWeight: 600 }}>
              Moonlight
            </Typography>
            <IconButton color="inherit" sx={{ mr: 1 }}>
              <Badge badgeContent={notifications} color="error">
                <Bell />
              </Badge>
            </IconButton>
            <IconButton color="inherit" onClick={handleMenuOpen}>
              <Settings />
            </IconButton>
          </Toolbar>
        </AppBar>

        {/* Main Content */}
        <Container maxWidth="sm" sx={{ pt: 8, pb: 2 }}>
          {/* Welcome Section */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h4" sx={{
              background: 'linear-gradient(135deg, #ffffff 0%, #e0e7ff 50%, #c7d2fe 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 700,
              mb: 1
            }}>
              Willkommen zurück! 🌟
            </Typography>
            <Typography variant="body1" sx={{
              color: 'rgba(255,255,255,0.8)'
            }}>
              Dein Human Design Dashboard
            </Typography>
          </Box>

          {/* Quick Stats */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {quickStats.map((stat, index) => (
              <Grid item xs={6} key={index}>
                <Card sx={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: 2,
                  border: '1px solid rgba(255,255,255,0.2)',
                  textAlign: 'center',
                  p: 2
                }}>
                  <CardContent sx={{ p: 1 }}>
                    <Box sx={{ color: stat.color, mb: 1 }}>
                      {stat.icon}
                    </Box>
                    <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, mb: 0.5 }}>
                      {stat.value}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                      {stat.label}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Quick Actions */}
          <Typography variant="h6" sx={{ color: 'white', fontWeight: 600, mb: 2 }}>
            Schnellzugriff
          </Typography>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {quickActions.map((action, index) => (
              <Grid item xs={4} key={index}>
                <Card sx={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: 2,
                  border: '1px solid rgba(255,255,255,0.2)',
                  textAlign: 'center',
                  p: 2,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.15)',
                    transform: 'translateY(-2px)'
                  }
                }} onClick={action.action}>
                  <CardContent sx={{ p: 1 }}>
                    <Box sx={{ color: '#FFD700', mb: 1 }}>
                      {action.icon}
                    </Box>
                    <Typography variant="caption" sx={{ color: 'white', fontWeight: 500 }}>
                      {action.label}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Recent Activity */}
          <Typography variant="h6" sx={{ color: 'white', fontWeight: 600, mb: 2 }}>
            Letzte Aktivitäten
          </Typography>
          <Card sx={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            borderRadius: 2,
            border: '1px solid rgba(255,255,255,0.2)'
          }}>
            <List>
              {recentActivity.map((activity, index) => (
                <React.Fragment key={activity.id}>
                  <ListItem sx={{ py: 1.5 }}>
                    <ListItemAvatar>
                      <Box sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        backgroundColor: `${activity.color}20`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: activity.color
                      }}>
                        {activity.icon}
                      </Box>
                    </ListItemAvatar>
                    <ListItemText 
                      primary={
                        <Typography variant="body2" sx={{ color: 'white', fontWeight: 600 }}>
                          {activity.title}
                        </Typography>
                      }
                      secondary={
                        <Box>
                          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                            {activity.description}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', display: 'block' }}>
                            {activity.timestamp}
                          </Typography>
                        </Box>
                      }
                    />
                    <ListItemSecondaryAction>
                      <IconButton size="small" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                        <ChevronRight size={16} />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                  {index < recentActivity.length - 1 && <Divider sx={{ backgroundColor: 'rgba(255,255,255,0.1)' }} />}
                </React.Fragment>
              ))}
            </List>
          </Card>

          {/* Upcoming Events */}
          <Typography variant="h6" sx={{ color: 'white', fontWeight: 600, mb: 2, mt: 3 }}>
            Kommende Events
          </Typography>
          {upcomingEvents.map((event, index) => (
            <Card key={event.id} sx={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              borderRadius: 2,
              border: '1px solid rgba(255,255,255,0.2)',
              mb: 2
            }}>
              <CardContent sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body1" sx={{ color: 'white', fontWeight: 600, mb: 0.5 }}>
                      {event.title}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Calendar size={14} style={{ color: 'rgba(255,255,255,0.7)' }} />
                      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                        {event.date} • {event.time}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <MapPin size={14} style={{ color: 'rgba(255,255,255,0.7)' }} />
                      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                        {event.location} • {event.attendees} Teilnehmer
                      </Typography>
                    </Box>
                  </Box>
                  <Chip 
                    label={event.type} 
                    size="small" 
                    sx={{ 
                      background: 'rgba(255, 215, 0, 0.2)', 
                      color: '#FFD700',
                      fontSize: '0.7rem'
                    }} 
                  />
                </Box>
              </CardContent>
            </Card>
          ))}
        </Container>

        {/* Bottom Navigation */}
        <BottomNavigation
          value={activeTab}
          onChange={handleTabChange}
          sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            background: 'rgba(15, 15, 35, 0.95)',
            backdropFilter: 'blur(20px)',
            borderTop: '1px solid rgba(255,255,255,0.1)',
            '& .MuiBottomNavigationAction-root': {
              color: 'rgba(255,255,255,0.7)',
              '&.Mui-selected': {
                color: '#FFD700'
              }
            }
          }}
        >
          <BottomNavigationAction label="Home" icon={<Home />} />
          <BottomNavigationAction label="Community" icon={<Users />} />
          <BottomNavigationAction label="Dating" icon={<Heart />} />
          <BottomNavigationAction label="Events" icon={<Calendar />} />
          <BottomNavigationAction label="Profil" icon={<User />} />
        </BottomNavigation>

        {/* Side Drawer */}
        <SwipeableDrawer
          anchor="left"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          onOpen={() => setDrawerOpen(true)}
          PaperProps={{
            sx: {
              background: 'rgba(15, 15, 35, 0.95)',
              backdropFilter: 'blur(20px)',
              borderRight: '1px solid rgba(255,255,255,0.1)',
              width: 280
            }
          }}
        >
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ color: 'white', fontWeight: 600, mb: 3 }}>
              Menu
            </Typography>
            <List>
              <ListItem button onClick={() => router.push('/dashboard')}>
                <ListItemAvatar>
                  <Home size={20} style={{ color: '#FFD700' }} />
                </ListItemAvatar>
                <ListItemText primary="Dashboard" sx={{ color: 'white' }} />
              </ListItem>
              <ListItem button onClick={() => router.push('/chart')}>
                <ListItemAvatar>
                  <Target size={20} style={{ color: '#FFD700' }} />
                </ListItemAvatar>
                <ListItemText primary="Chart" sx={{ color: 'white' }} />
              </ListItem>
              <ListItem button onClick={() => router.push('/community')}>
                <ListItemAvatar>
                  <Users size={20} style={{ color: '#FFD700' }} />
                </ListItemAvatar>
                <ListItemText primary="Community" sx={{ color: 'white' }} />
              </ListItem>
              <ListItem button onClick={() => router.push('/dating')}>
                <ListItemAvatar>
                  <Heart size={20} style={{ color: '#FFD700' }} />
                </ListItemAvatar>
                <ListItemText primary="Dating" sx={{ color: 'white' }} />
              </ListItem>
              <ListItem button onClick={() => router.push('/coaching')}>
                <ListItemAvatar>
                  <Star size={20} style={{ color: '#FFD700' }} />
                </ListItemAvatar>
                <ListItemText primary="Coaching" sx={{ color: 'white' }} />
              </ListItem>
              <ListItem button onClick={() => router.push('/settings')}>
                <ListItemAvatar>
                  <Settings size={20} style={{ color: '#FFD700' }} />
                </ListItemAvatar>
                <ListItemText primary="Einstellungen" sx={{ color: 'white' }} />
              </ListItem>
            </List>
          </Box>
        </SwipeableDrawer>

        {/* Menu */}
        <Menu
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={handleMenuClose}
          PaperProps={{
            sx: {
              background: 'rgba(15, 15, 35, 0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.1)'
            }
          }}
        >
          <MenuItem onClick={handleMenuClose} sx={{ color: 'white' }}>
            <Share2 size={16} style={{ marginRight: 8 }} />
            Teilen
          </MenuItem>
          <MenuItem onClick={handleMenuClose} sx={{ color: 'white' }}>
            <Settings size={16} style={{ marginRight: 8 }} />
            Einstellungen
          </MenuItem>
        </Menu>

        {/* Floating Action Button */}
        <Fab
          color="primary"
          sx={{
            position: 'fixed',
            bottom: 80,
            right: 16,
            background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
            color: '#1f2937',
            '&:hover': {
              background: 'linear-gradient(135deg, #FFA500 0%, #FFD700 100%)',
              transform: 'scale(1.1)'
            }
          }}
          onClick={() => router.push('/community')}
        >
          <Plus size={24} />
        </Fab>
      </Box>
    </AccessControl>
  );
}