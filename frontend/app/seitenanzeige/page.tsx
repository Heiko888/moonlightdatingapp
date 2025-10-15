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
// import { UserSubscription as BaseUserSubscription } from '../../lib/subscription/types'; // Entfernt - nicht mehr benötigt
import UnifiedPageLayout from '../../components/UnifiedPageLayout';

// Temporärer Fix - UserSubscription Interface
interface UserSubscription {
  packageId: 'free' | 'basic' | 'premium' | 'vip';
  status: 'active' | 'inactive' | 'expired';
  startDate?: string;
  endDate?: string;
  autoRenew?: boolean;
  paymentMethod?: string;
  billingCycle?: string;
}

export default function SeitenanzeigePage() {
  const [activeTab, setActiveTab] = useState('frontend');
  const { isClient } = useHydrationSafe();
  
  // Mock user subscription - in real app, this would come from context/API
  const [userSubscription, setUserSubscription] = useState<any>(null);

  useEffect(() => {
    // Load user subscription from localStorage or API
    const stored = localStorage.getItem('userSubscription');
    if (stored) {
      try {
        setUserSubscription(JSON.parse(stored));
      } catch (error) {
        console.error('Error parsing user subscription:', error);
      }
    }
  }, []);

  const tabs = [
    { id: 'frontend', label: 'Frontend', icon: <Monitor size={20} /> },
    { id: 'backend', label: 'Backend', icon: <Server size={20} /> },
    { id: 'mobile', label: 'Mobile', icon: <Smartphone size={20} /> },
    { id: 'admin', label: 'Admin', icon: <Shield size={20} /> }
  ];

  const getPackageColor = (packageId: string) => {
    switch (packageId) {
      case 'free': return '#6b7280';
      case 'basic': return '#4ecdc4';      // Teal
      case 'premium': return '#ff6b9d';    // Pink
      case 'vip': return '#ffd700';        // Gold
      case 'admin': return '#ef4444';
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

  const pages = {
    frontend: [
      {
        category: '🏠 Hauptseiten',
        pages: [
          { name: 'Dashboard', path: '/dashboard', description: 'Übersicht und Navigation', package: 'basic' },
          { name: 'Profil', path: '/profile', description: 'Benutzerprofil verwalten', package: 'basic' },
          { name: 'Einstellungen', path: '/settings', description: 'App-Einstellungen', package: 'basic' },
          { name: 'Chart', path: '/chart', description: 'Human Design Chart', package: 'free' },
          { name: 'Chart Info', path: '/chart-info', description: 'Chart-Informationen', package: 'free' },
          { name: 'Human Design Info', path: '/human-design-info', description: 'HD-Grundlagen', package: 'free' }
        ]
      },
      {
        category: '🌙 Mondkalender',
        pages: [
          { name: 'Mondkalender', path: '/mondkalender', description: 'Mondphasen und -energien', package: 'basic' },
          { name: 'Mondkalender Info', path: '/mondkalender-info', description: 'Mondkalender-Erklärung', package: 'free' }
        ]
      },
      {
        category: '👥 Community',
        pages: [
          { name: 'Community', path: '/community', description: 'Benutzer-Community', package: 'basic' },
          { name: 'VIP Community', path: '/vip-community', description: 'Exklusive VIP-Community', package: 'vip' }
        ]
      },
      {
        category: '💕 Dating',
        pages: [
          { name: 'Dating', path: '/dating', description: 'Dating-System', package: 'premium' },
          { name: 'Dating Info', path: '/dating-info', description: 'Dating-Erklärung', package: 'free' },
          { name: 'Dating Impulse', path: '/dating-impulse', description: 'Dating-Impulse', package: 'premium' }
        ]
      },
      {
        category: '🎯 Coaching',
        pages: [
          { name: 'Coaching', path: '/coaching', description: 'Coaching-System', package: 'vip' },
          { name: 'Personal Coach', path: '/personal-coach', description: 'Persönlicher Coach', package: 'vip' }
        ]
      },
      {
        category: '📊 Analytics',
        pages: [
          { name: 'Analytics', path: '/analytics', description: 'Erweiterte Analytics', package: 'vip' },
          { name: 'API Access', path: '/api-access', description: 'API-Zugang', package: 'vip' }
        ]
      }
    ],
    backend: [
      {
        category: '🔐 Authentifizierung',
        pages: [
          { name: 'Login', path: '/login', description: 'Benutzer-Anmeldung', package: 'free' },
          { name: 'Register', path: '/register', description: 'Benutzer-Registrierung', package: 'free' },
          { name: 'Logout', path: '/logout', description: 'Benutzer-Abmeldung', package: 'free' }
        ]
      },
      {
        category: '💳 Abonnements',
        pages: [
          { name: 'Pricing', path: '/pricing', description: 'Preisübersicht', package: 'free' },
          { name: 'Subscription', path: '/subscription', description: 'Abonnement-Verwaltung', package: 'basic' },
          { name: 'Upgrade', path: '/upgrade', description: 'Paket-Upgrade', package: 'free' }
        ]
      }
    ],
    mobile: [
      {
        category: '📱 Mobile App',
        pages: [
          { name: 'Mobile App', path: '/mobile-app', description: 'Mobile App-Info', package: 'free' },
          { name: 'Mobile Demo', path: '/mobile-demo', description: 'Mobile Demo', package: 'free' }
        ]
      }
    ],
    admin: [
      {
        category: '⚙️ Administration',
        pages: [
          { name: 'Admin Public', path: '/admin-public', description: 'Öffentliche Admin-Info', package: 'free' },
          { name: 'Admin', path: '/admin', description: 'Admin-Panel', package: 'admin' }
        ]
      }
    ]
  };

  return (
      <UnifiedPageLayout
        title="🗺️ App-Navigation"
        subtitle="Entdecke alle verfügbaren Funktionen und navigiere durch die App"
      >
        {/* Tabs */}
        <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap', justifyContent: 'center' }}>
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? 'contained' : 'outlined'}
              onClick={() => setActiveTab(tab.id)}
              startIcon={tab.icon}
              sx={{ 
                color: activeTab === tab.id ? 'white' : 'rgba(255,255,255,0.8)',
                borderColor: 'rgba(255,255,255,0.3)',
                '&:hover': {
                  borderColor: '#FFD700',
                  backgroundColor: 'rgba(255, 215, 0, 0.1)'
                },
                '&.MuiButton-contained': {
                  background: 'linear-gradient(135deg, #ff6b9d, #c44569, #4ecdc4)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #ff5a8a, #b83a5a, #3ec4b4)'
                  }
                }
              }}
            >
              {tab.label}
            </Button>
          ))}
        </Box>

        {/* Content based on active tab */}
        {activeTab === 'frontend' && (
          <Grid container spacing={3}>
            {pages.frontend.map((category, categoryIndex) => (
              <Grid item xs={12} md={6} key={categoryIndex}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
                >
                  <Card sx={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: 3,
                    height: '100%'
                  }}>
                    <CardContent>
                      <Typography variant="h6" sx={{ 
                        color: '#FFD700', 
                        mb: 2, 
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                      }}>
                        {category.category}
                      </Typography>
                      
                      <List>
                        {category.pages.map((page, pageIndex) => (
                          <motion.div
                            key={pageIndex}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: pageIndex * 0.05 }}
                          >
                            <ListItem sx={{ px: 0 }}>
                              <ListItemIcon>
                                <Chip
                                  label={page.package}
                                  size="small"
                                  sx={{
                                    bgcolor: `${getPackageColor(page.package)}20`,
                                    color: getPackageColor(page.package),
                                    border: `1px solid ${getPackageColor(page.package)}40`,
                                    fontSize: '0.75rem',
                                    minWidth: '60px'
                                  }}
                                />
                              </ListItemIcon>
                              <ListItemText
                                primary={page.name}
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
                                onClick={() => window.open(page.path, '_blank')}
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
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Backend Tab */}
        {activeTab === 'backend' && (
          <Grid container spacing={3}>
            {pages.backend.map((category, categoryIndex) => (
              <Grid item xs={12} md={6} key={categoryIndex}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
                >
                  <Card sx={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: 3,
                    height: '100%'
                  }}>
                    <CardContent>
                      <Typography variant="h6" sx={{ 
                        color: '#4ecdc4', 
                        mb: 2, 
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                      }}>
                        {category.category}
                      </Typography>
                      
                      <List>
                        {category.pages.map((page, pageIndex) => (
                          <motion.div
                            key={pageIndex}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: pageIndex * 0.05 }}
                          >
                            <ListItem sx={{ px: 0 }}>
                              <ListItemIcon>
                                <Chip
                                  label={page.package}
                                  size="small"
                                  sx={{
                                    bgcolor: `${getPackageColor(page.package)}20`,
                                    color: getPackageColor(page.package),
                                    border: `1px solid ${getPackageColor(page.package)}40`,
                                    fontSize: '0.75rem',
                                    minWidth: '60px'
                                  }}
                                />
                              </ListItemIcon>
                              <ListItemText
                                primary={page.name}
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
                                onClick={() => window.open(page.path, '_blank')}
                                sx={{ 
                                  color: '#4ecdc4',
                                  '&:hover': {
                                    backgroundColor: 'rgba(78, 205, 196, 0.1)'
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
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Mobile Tab */}
        {activeTab === 'mobile' && (
          <Grid container spacing={3}>
            {pages.mobile.map((category, categoryIndex) => (
              <Grid item xs={12} md={6} key={categoryIndex}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
                >
                  <Card sx={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: 3,
                    height: '100%'
                  }}>
                    <CardContent>
                      <Typography variant="h6" sx={{ 
                        color: '#ff6b9d', 
                        mb: 2, 
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                      }}>
                        {category.category}
                      </Typography>
                      
                      <List>
                        {category.pages.map((page, pageIndex) => (
                          <motion.div
                            key={pageIndex}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: pageIndex * 0.05 }}
                          >
                            <ListItem sx={{ px: 0 }}>
                              <ListItemIcon>
                                <Chip
                                  label={page.package}
                                  size="small"
                                  sx={{
                                    bgcolor: `${getPackageColor(page.package)}20`,
                                    color: getPackageColor(page.package),
                                    border: `1px solid ${getPackageColor(page.package)}40`,
                                    fontSize: '0.75rem',
                                    minWidth: '60px'
                                  }}
                                />
                              </ListItemIcon>
                              <ListItemText
                                primary={page.name}
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
                                onClick={() => window.open(page.path, '_blank')}
                                sx={{ 
                                  color: '#ff6b9d',
                                  '&:hover': {
                                    backgroundColor: 'rgba(255, 107, 157, 0.1)'
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
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Admin Tab */}
        {activeTab === 'admin' && (
          <Grid container spacing={3}>
            {pages.admin.map((category, categoryIndex) => (
              <Grid item xs={12} md={6} key={categoryIndex}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
                >
                  <Card sx={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: 3,
                    height: '100%'
                  }}>
                    <CardContent>
                      <Typography variant="h6" sx={{ 
                        color: '#ef4444', 
                        mb: 2, 
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                      }}>
                        {category.category}
                      </Typography>
                      
                      <List>
                        {category.pages.map((page, pageIndex) => (
                          <motion.div
                            key={pageIndex}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: pageIndex * 0.05 }}
                          >
                            <ListItem sx={{ px: 0 }}>
                              <ListItemIcon>
                                <Chip
                                  label={page.package}
                                  size="small"
                                  sx={{
                                    bgcolor: `${getPackageColor(page.package)}20`,
                                    color: getPackageColor(page.package),
                                    border: `1px solid ${getPackageColor(page.package)}40`,
                                    fontSize: '0.75rem',
                                    minWidth: '60px'
                                  }}
                                />
                              </ListItemIcon>
                              <ListItemText
                                primary={page.name}
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
                                onClick={() => window.open(page.path, '_blank')}
                                sx={{ 
                                  color: '#ef4444',
                                  '&:hover': {
                                    backgroundColor: 'rgba(239, 68, 68, 0.1)'
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
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        )}
      </UnifiedPageLayout>
  );
}
