"use client";

import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Container,
  Grid,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Paper,
  Button,
  Avatar,
  Badge,
  Divider,
  IconButton,
  Menu,
  MenuItem
} from '@mui/material';
import { 
  Sparkles, 
  Heart, 
  Users, 
  BookOpen, 
  BarChart3, 
  Crown, 
  TrendingUp,
  Globe,
  Brain,
  Server,
  Code,
  Settings,
  User,
  Home,
  Folder,
  ExternalLink,
  Monitor,
  Smartphone,
  Cloud,
  Star,
  Calendar,
  MessageCircle,
  Target,
  Zap,
  Shield,
  Bell,
  Palette,
  Download,
  ArrowRight,
  CheckCircle,
  Info,
  MoreVertical
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useHydrationSafe } from '../../hooks/useHydrationSafe';
import AccessControl from '../../components/AccessControl';
import { UserSubscription as BaseUserSubscription } from '../../lib/subscription/types';

// Extended UserSubscription to include 'free' package
interface UserSubscription extends Omit<BaseUserSubscription, 'packageId'> {
  packageId: 'free' | 'basic' | 'premium' | 'vip';
}

// Floating Stars Animation
const AnimatedStars = () => {
  const stars = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    size: Math.random() * 3 + 1,
    delay: Math.random() * 2
  }));

  return (
    <Box sx={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      pointerEvents: 'none',
      zIndex: 1
    }}>
      {stars.map((star) => (
        <motion.div
          key={star.id}
          style={{
            position: 'absolute',
            left: star.left,
            top: star.top,
            width: star.size,
            height: star.size,
            background: 'rgba(255, 255, 255, 0.6)',
            borderRadius: '50%',
            boxShadow: '0 0 4px rgba(255, 255, 255, 0.8)'
          }}
          animate={{
            opacity: [0.3, 1, 0.3],
            scale: [0.8, 1.2, 0.8]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: star.delay
          }}
        />
      ))}
    </Box>
  );
};

// TypeScript Interfaces
interface Page {
  name: string;
  path: string;
  description: string;
  requiredPackage: 'free' | 'basic' | 'premium' | 'vip';
}

interface Category {
  category: string;
  icon: React.ReactNode;
  requiredPackage: 'free' | 'basic' | 'premium' | 'vip';
  pages: Page[];
}

interface BackendRoute {
  name: string;
  path: string;
  description: string;
}

interface BackendCategory {
  category: string;
  icon: React.ReactNode;
  routes: BackendRoute[];
}

export default function SeitenanzeigePage() {
  const [activeTab, setActiveTab] = useState('frontend');
  const [isClient, setIsClient] = useState(false);
  const [userSubscription, setUserSubscription] = useState<UserSubscription | null>(null);
  const { isClient: hydrationSafe, localStorage: safeLocalStorage } = useHydrationSafe();

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  // Load user subscription data
  useEffect(() => {
    if (!hydrationSafe) return;
    
    try {
      const userData = JSON.parse(safeLocalStorage.getItem('userData') || '{}');
      const userSubscriptionData = JSON.parse(safeLocalStorage.getItem('userSubscription') || '{}');
      
      let currentPlan = userData.subscriptionPlan || userSubscriptionData.packageId || 'free';
      if (currentPlan === 'free') {
        currentPlan = 'basic'; // Auto-Upgrade für bestehende 'free' User
      }
      
      setUserSubscription({
        userId: userData.id || 'unknown',
        packageId: currentPlan,
        plan: currentPlan,
        status: userSubscriptionData.status || 'active',
        startDate: userSubscriptionData.startDate || new Date().toISOString(),
        endDate: userSubscriptionData.endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        autoRenew: userSubscriptionData.autoRenew || false,
        paymentMethod: userSubscriptionData.paymentMethod || 'none',
        billingCycle: userSubscriptionData.billingCycle || 'monthly'
      });
    } catch (error) {
      console.error('Error loading user data:', error);
      setUserSubscription({
        userId: 'unknown',
        packageId: 'free',
        plan: 'free',
        status: 'active',
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        autoRenew: false,
        paymentMethod: 'none',
        billingCycle: 'monthly'
      });
    }
  }, [hydrationSafe]);

  // Frontend pages data
  const frontendPages: Category[] = [
    {
      category: "🌐 Öffentliche Bereiche",
      icon: <Globe size={20} />,
      requiredPackage: 'free',
      pages: [
        { name: "Startseite", path: "/", description: "🏠 Hauptseite mit kosmischem Design und animierten Monden", requiredPackage: 'free' },
        { name: "Login", path: "/login", description: "🔐 Benutzer-Anmeldung mit sicherem Zugang", requiredPackage: 'free' },
        { name: "Registrierung", path: "/register", description: "📝 Neue Benutzer-Registrierung mit dd/mm/yyyy Format", requiredPackage: 'free' },
        { name: "Community Info", path: "/community-info", description: "Community-Informationen mit modernem Design", requiredPackage: 'free' },
        { name: "Sitemap", path: "/sitemap", description: "Seitenübersicht mit Navigation", requiredPackage: 'free' },
        { name: "Chart", path: "/chart", description: "Human Design Chart berechnen", requiredPackage: 'free' },
        { name: "Mondkalender", path: "/mondkalender", description: "Mondphasen und Tracking", requiredPackage: 'free' },
        { name: "Mondkalender Info", path: "/mondkalender-info", description: "Alle Mondkalender-Funktionen erklärt", requiredPackage: 'free' },
        { name: "Sales", path: "/sales", description: "Verkaufsseite", requiredPackage: 'free' },
        { name: "Admin Public", path: "/admin-public", description: "Öffentliche Admin-Übersicht", requiredPackage: 'free' },
        { name: "App-Navigation", path: "/seitenanzeige", description: "Zentrale Navigation durch alle App-Funktionen", requiredPackage: 'free' }
      ]
    },
    {
      category: "⚡ App-Funktionen",
      icon: <Target size={20} />,
      requiredPackage: 'basic',
      pages: [
        { name: "Human Design Chart", path: "/human-design-chart", description: "Detaillierte Chart-Analyse", requiredPackage: 'basic' },
        { name: "Dating Interface", path: "/dating-interface", description: "Dating und Matching System", requiredPackage: 'basic' },
        { name: "Readings", path: "/reading", description: "Persönliche Readings und Insights", requiredPackage: 'basic' },
        { name: "Roadmap", path: "/roadmap", description: "Persönliche Entwicklungs-Roadmap", requiredPackage: 'basic' },
        { name: "Package Overview", path: "/package-overview", description: "Abonnement-Übersicht", requiredPackage: 'basic' },
        { name: "Gamification", path: "/gamification", description: "Gamification System", requiredPackage: 'basic' }
      ]
    },
    {
      category: "👑 Premium Features",
      icon: <Crown size={20} />,
      requiredPackage: 'premium',
      pages: [
        { name: "Dating Dashboard", path: "/dating", description: "Premium Dating Dashboard", requiredPackage: 'premium' },
        { name: "Advanced Analytics", path: "/analytics", description: "Erweiterte Analytics", requiredPackage: 'premium' },
        { name: "Coaching Sessions", path: "/coaching", description: "1:1 Coaching Sessions", requiredPackage: 'premium' }
      ]
    },
    {
      category: "🎯 Coaching",
      icon: <Users size={20} />,
      requiredPackage: 'premium',
      pages: [
        { name: "Janine", path: "/coaching/janine", description: "Coaching mit Janine", requiredPackage: 'premium' },
        { name: "Louisa", path: "/coaching/louisa", description: "Coaching mit Louisa", requiredPackage: 'premium' },
        { name: "Heiko", path: "/coaching/heiko", description: "Coaching mit Heiko", requiredPackage: 'premium' }
      ]
    },
    {
      category: "🔧 System & Debug",
      icon: <Settings size={20} />,
      requiredPackage: 'free',
      pages: [
        { name: "Debug Simple", path: "/debug-simple", description: "Debug-Informationen", requiredPackage: 'free' },
        { name: "Pricing", path: "/pricing", description: "Preisübersicht", requiredPackage: 'free' },
        { name: "Settings", path: "/settings", description: "Benutzer-Einstellungen", requiredPackage: 'free' }
      ]
    }
  ];

  // Backend routes data
  const backendRoutes: BackendCategory[] = [
    {
      category: "Backend APIs",
      icon: <BarChart3 size={20} />,
      routes: [
        { name: "Auth Login", path: "/api/auth/login", description: "Benutzer-Anmeldung API" },
        { name: "Auth Register", path: "/api/auth/register", description: "Benutzer-Registrierung API" },
        { name: "Auth Verify", path: "/api/auth/verify", description: "Token-Verifizierung API" },
        { name: "Stripe Customer Portal", path: "/api/stripe/customer-portal", description: "Stripe Kundenportal API" },
        { name: "Charts", path: "/api/charts", description: "Chart-Daten" },
        { name: "User Data", path: "/api/user", description: "Benutzer-Daten" },
        { name: "Subscription", path: "/api/subscription", description: "Abonnement-Management" },
        { name: "Notifications", path: "/api/notifications", description: "Benachrichtigungen" }
      ]
    }
  ];

  const tabs = [
    { id: 'frontend', label: '📱 App-Seiten', icon: <Monitor size={20} /> },
    { id: 'backend', label: '⚙️ APIs', icon: <Server size={20} /> },
    { id: 'stats', label: '📊 Statistiken', icon: <BarChart3 size={20} /> }
  ];

  const getPackageColor = (packageId: string) => {
    switch (packageId) {
      case 'free': return '#6b7280';
      case 'basic': return '#3b82f6';
      case 'premium': return '#8b5cf6';
      case 'vip': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const getPackageIcon = (packageId: string) => {
    switch (packageId) {
      case 'free': return <Globe size={16} />;
      case 'basic': return <Star size={16} />;
      case 'premium': return <Crown size={16} />;
      case 'vip': return <Zap size={16} />;
      default: return <Globe size={16} />;
    }
  };

  const canAccess = (requiredPackage: string) => {
    // Seitenanzeige ist für alle eingeloggten Benutzer zugänglich
    return true;
  };

  return (
    <AccessControl 
      path="/seitenanzeige" 
      userSubscription={userSubscription ? {
        ...userSubscription,
        packageId: userSubscription.packageId === 'free' ? 'basic' : userSubscription.packageId
      } : undefined}
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
        {isClient && <AnimatedStars />}
        
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2, py: { xs: 4, md: 8 }, px: { xs: 1, sm: 2 } }}>
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
      <Box sx={{
              textAlign: 'center', 
              mb: 6,
              py: { xs: 4, md: 6 }
            }}>
              <Typography
                variant="h2"
            sx={{
                  background: 'linear-gradient(135deg, #ff6b9d, #c44569, #4ecdc4)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontWeight: 800,
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  mb: 2,
                  textShadow: '0 0 30px rgba(255, 107, 157, 0.3)'
                }}
              >
                🗺️ App-Navigation
                </Typography>
              <Typography 
                variant="h5" 
                    sx={{ 
                  color: 'rgba(255,255,255,0.8)', 
                  mb: 3,
                  fontSize: { xs: '1.1rem', md: '1.3rem' },
                  maxWidth: '600px',
                  mx: 'auto',
                  lineHeight: 1.6
                }}
              >
                Entdecke alle verfügbaren Funktionen und navigiere durch die App
                    </Typography>
              </Box>
          </motion.div>

          {/* Navigation Tabs */}
          <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap', justifyContent: 'center' }}>
            {tabs.map((tab) => (
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
          {activeTab === 'frontend' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Grid container spacing={4}>
                {frontendPages.map((category, catIndex) => (
                  <Grid item xs={12} md={6} key={catIndex}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: catIndex * 0.1 }}
                    >
          <Card sx={{ 
                        background: 'rgba(255,255,255,0.05)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: 3,
                        p: 4,
                        height: '100%',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-5px)',
                          boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
                        }
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, color: getPackageColor(category.requiredPackage) }}>
                          {category.icon}
                          <Typography variant="h5" sx={{ ml: 2, fontWeight: 700, color: 'white' }}>
                            {category.category}
                </Typography>
                <Chip 
                            icon={getPackageIcon(category.requiredPackage)}
                            label={category.requiredPackage.toUpperCase()}
                            size="small"
                  sx={{ 
                              ml: 'auto',
                              backgroundColor: getPackageColor(category.requiredPackage),
                              color: 'white',
                              fontWeight: 'bold'
                  }} 
                />
              </Box>
              
                        <List dense>
                          {category.pages.map((page, pageIndex) => (
                            <motion.div
                              key={pageIndex}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3, delay: catIndex * 0.1 + pageIndex * 0.05 }}
                            >
                              <ListItem sx={{ 
                                px: 0, 
                                py: 1,
                                opacity: 1
                              }}>
                                <ListItemIcon sx={{ minWidth: 32 }}>
                                  <CheckCircle size={16} color="#10b981" />
                                </ListItemIcon>
                                <ListItemText
                                  primary={
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                      <Typography variant="body1" sx={{ color: 'white', fontWeight: 500 }}>
                              {page.name}
                            </Typography>
                          </Box>
                                  }
                                  secondary={
                                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mt: 0.5 }}>
                            {page.description}
                          </Typography>
                                  }
                                />
                                <Button
                                  component={Link}
                                  href={page.path}
                                size="small"
                                sx={{ 
                                    color: '#FFD700',
                                  '&:hover': {
                                      backgroundColor: 'rgba(255, 215, 0, 0.1)'
                                    }
                                  }}
                                >
                                  <ExternalLink size={16} />
                                </Button>
                              </ListItem>
                              {pageIndex < category.pages.length - 1 && (
                                <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', my: 0.5 }} />
                              )}
                            </motion.div>
                          ))}
                        </List>
                      </Card>
                    </motion.div>
                    </Grid>
                  ))}
              </Grid>
            </motion.div>
          )}

          {activeTab === 'backend' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Grid container spacing={4}>
                {backendRoutes.map((category, catIndex) => (
                  <Grid item xs={12} key={catIndex}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: catIndex * 0.1 }}
                    >
                      <Card sx={{
                        background: 'rgba(255,255,255,0.05)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: 3,
                        p: 4
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, color: '#4ecdc4' }}>
                          {category.icon}
                          <Typography variant="h5" sx={{ ml: 2, fontWeight: 700, color: 'white' }}>
                            {category.category}
                          </Typography>
        </Box>

                        <Grid container spacing={2}>
                          {category.routes.map((route, routeIndex) => (
                            <Grid item xs={12} sm={6} md={4} key={routeIndex}>
                              <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3, delay: catIndex * 0.1 + routeIndex * 0.05 }}
                              >
                                <Paper sx={{
                                  p: 3,
                                  background: 'rgba(255,255,255,0.05)',
                                  border: '1px solid rgba(255,255,255,0.1)',
                                  borderRadius: 2,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 8px 25px rgba(0,0,0,0.2)'
                                  }
                                }}>
                                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <Server size={20} color="#4ecdc4" />
                                    <Typography variant="h6" sx={{ ml: 1, color: 'white', fontWeight: 600 }}>
                                      {route.name}
                        </Typography>
                      </Box>
                                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 2 }}>
                                    {route.description}
                      </Typography>
                        <Chip 
                                    label={route.path}
                          size="small"
                          sx={{ 
                                      backgroundColor: 'rgba(78, 205, 196, 0.2)',
                                      color: '#4ecdc4',
                                      border: '1px solid #4ecdc4',
                                      fontFamily: 'monospace'
                                    }}
                                  />
                                </Paper>
                              </motion.div>
                            </Grid>
                          ))}
                        </Grid>
                  </Card>
                    </motion.div>
                </Grid>
                ))}
                </Grid>
            </motion.div>
          )}

          {activeTab === 'stats' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                    <Card sx={{ 
                    background: 'rgba(255,255,255,0.05)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 3,
                    p: 4
                  }}>
                    <Typography variant="h6" sx={{ color: 'white', mb: 3, display: 'flex', alignItems: 'center' }}>
                      <BarChart3 size={24} style={{ marginRight: 12 }} />
                      Seiten-Statistiken
                          </Typography>
                    
                    <List>
                      <ListItem sx={{ px: 0 }}>
                        <ListItemIcon>
                          <Globe size={20} color="#10b981" />
                              </ListItemIcon>
                              <ListItemText
                          primary="Öffentliche Seiten" 
                          secondary="Für alle Benutzer zugänglich"
                                      sx={{ 
                            '& .MuiListItemText-primary': { color: 'white' },
                            '& .MuiListItemText-secondary': { color: 'rgba(255,255,255,0.7)' }
                          }}
                        />
                        <Chip label="11" color="success" />
                            </ListItem>
                      
                      <ListItem sx={{ px: 0 }}>
                        <ListItemIcon>
                          <Star size={20} color="#3b82f6" />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Basic Features" 
                          secondary="Für Basic-Abonnenten"
                  sx={{ 
                            '& .MuiListItemText-primary': { color: 'white' },
                            '& .MuiListItemText-secondary': { color: 'rgba(255,255,255,0.7)' }
                          }}
                        />
                        <Chip label="6" color="primary" />
                      </ListItem>
                      
                      <ListItem sx={{ px: 0 }}>
                        <ListItemIcon>
                          <Crown size={20} color="#8b5cf6" />
                              </ListItemIcon>
                              <ListItemText
                          primary="Premium Features" 
                          secondary="Für Premium-Abonnenten"
                                    sx={{ 
                            '& .MuiListItemText-primary': { color: 'white' },
                            '& .MuiListItemText-secondary': { color: 'rgba(255,255,255,0.7)' }
                          }}
                        />
                        <Chip label="6" color="secondary" />
                            </ListItem>
                        </List>
                    </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Card sx={{ 
                    background: 'rgba(255,255,255,0.05)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 3,
                    p: 4
                  }}>
                    <Typography variant="h6" sx={{ color: 'white', mb: 3, display: 'flex', alignItems: 'center' }}>
                      <Server size={24} style={{ marginRight: 12 }} />
                      API-Statistiken
                          </Typography>
                    
                    <List>
                      <ListItem sx={{ px: 0 }}>
                        <ListItemIcon>
                          <Code size={20} color="#4ecdc4" />
                              </ListItemIcon>
                              <ListItemText
                          primary="Backend APIs" 
                          secondary="Verfügbare API-Endpunkte"
                                    sx={{ 
                            '& .MuiListItemText-primary': { color: 'white' },
                            '& .MuiListItemText-secondary': { color: 'rgba(255,255,255,0.7)' }
                          }}
                        />
                        <Chip label="8" sx={{ backgroundColor: '#4ecdc4', color: 'white' }} />
                            </ListItem>
                      
                      <ListItem sx={{ px: 0 }}>
                        <ListItemIcon>
                          <Shield size={20} color="#f59e0b" />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Authentifizierung" 
                          secondary="Login, Register, Verify"
                  sx={{ 
                            '& .MuiListItemText-primary': { color: 'white' },
                            '& .MuiListItemText-secondary': { color: 'rgba(255,255,255,0.7)' }
                          }}
                        />
                        <Chip label="3" sx={{ backgroundColor: '#f59e0b', color: 'white' }} />
                      </ListItem>
                      
                      <ListItem sx={{ px: 0 }}>
                        <ListItemIcon>
                          <Cloud size={20} color="#10b981" />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Daten-APIs" 
                          secondary="User, Charts, Subscription"
                          sx={{ 
                            '& .MuiListItemText-primary': { color: 'white' },
                            '& .MuiListItemText-secondary': { color: 'rgba(255,255,255,0.7)' }
                          }}
                        />
                        <Chip label="5" color="success" />
                      </ListItem>
                    </List>
                  </Card>
                </Grid>
                </Grid>
            </motion.div>
        )}
      </Container>
    </Box>
    </AccessControl>
  );
}