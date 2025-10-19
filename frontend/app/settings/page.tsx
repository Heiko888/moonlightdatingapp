"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase/client';
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
  ListItemIcon,
  Paper,
  Switch,
  FormControlLabel,
  Alert,
  CircularProgress,
  Stack,
  TextField
} from '@mui/material';
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  Palette,
  Download,
  Save,
  CheckCircle,
  Sparkles,
  Moon,
  Sun,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Heart,
  Star,
  Activity,
  TrendingUp,
  ArrowRight,
  LogOut,
  HelpCircle,
  Info,
  MoreVertical,
  Globe,
  Trash2,
  Key,
  Database,
  Zap,
  Target
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useHydrationSafe } from '../../hooks/useHydrationSafe';
import AccessControl from '../../components/AccessControl';
import { useRouter } from 'next/navigation';

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


// Settings Features
const settingsFeatures = [
  {
    icon: <User size={32} />,
    title: "Profil-Einstellungen",
    description: "Verwalte deine persönlichen Daten und Profilinformationen",
    color: "linear-gradient(135deg, #4ecdc4, #44a08d)",
    stats: "100% Sicher"
  },
  {
    icon: <Bell size={32} />,
    title: "Benachrichtigungen",
    description: "Passe deine Benachrichtigungseinstellungen nach deinen Wünschen an",
    color: "linear-gradient(135deg, #8b5cf6, #6d28d9)",
    stats: "Vollständig anpassbar"
  },
  {
    icon: <Shield size={32} />,
    title: "Sicherheit & Datenschutz",
    description: "Schütze deine Daten und kontrolliere deine Privatsphäre",
    color: "linear-gradient(135deg, #06b6d4, #0284c7)",
    stats: "DSGVO-konform"
  },
  {
    icon: <Palette size={32} />,
    title: "Design & Erscheinungsbild",
    description: "Personalisiere das Aussehen der App nach deinen Vorlieben",
    color: "linear-gradient(135deg, #10b981, #059669)",
    stats: "Mehrere Themes"
  },
  {
    icon: <Database size={32} />,
    title: "Daten & Export",
    description: "Verwalte deine Daten und exportiere sie bei Bedarf",
    color: "linear-gradient(135deg, #f59e0b, #d97706)",
    stats: "Vollständige Kontrolle"
  },
  {
    icon: <Key size={32} />,
    title: "Konto & Abonnement",
    description: "Verwalte dein Abonnement und Konto-Einstellungen",
    color: "linear-gradient(135deg, #ec4899, #db2777)",
    stats: "Transparent"
  }
];

// Settings Categories
const settingsCategories = [
  {
    step: "1",
    title: "Profil bearbeiten",
    description: "Aktualisiere deine persönlichen Informationen und Profildaten",
    icon: <User size={24} />
  },
  {
    step: "2",
    title: "Benachrichtigungen anpassen",
    description: "Wähle aus, welche Benachrichtigungen du erhalten möchtest",
    icon: <Bell size={24} />
  },
  {
    step: "3",
    title: "Sicherheit erhöhen",
    description: "Aktiviere 2FA und andere Sicherheitsfeatures",
    icon: <Shield size={24} />
  },
  {
    step: "4",
    title: "Design personalisieren",
    description: "Wähle dein bevorzugtes Theme und Layout",
    icon: <Palette size={24} />
  }
];

export default function SettingsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('profile');
  const [settingsAnchorEl, setSettingsAnchorEl] = useState<null | HTMLElement>(null);
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userSubscription, setUserSubscription] = useState<any>(null);
  const { isClient: hydrationSafe, localStorage: safeLocalStorage } = useHydrationSafe();

  // Settings states
  const [settings, setSettings] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    birthDate: "",
    notifications: true,
    emailNotifications: true,
    pushNotifications: true,
    darkMode: true,
    language: 'de',
    privacy: 'public'
  });

  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

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

      // Load user settings
      setSettings({
        name: userData.firstName || '',
        email: userData.email || '',
        phone: userData.phone || '',
        location: userData.location || '',
        birthDate: userData.birthDate || '',
        notifications: userData.notifications !== false,
        emailNotifications: userData.emailNotifications !== false,
        pushNotifications: userData.pushNotifications !== false,
        darkMode: userData.darkMode !== false,
        language: userData.language || 'de',
        privacy: userData.privacy || 'public'
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

  // Settings menu handlers
  const handleSettingsClick = (event: React.MouseEvent<HTMLElement>) => {
    setSettingsAnchorEl(event.currentTarget);
  };

  const handleSettingsClose = () => {
    setSettingsAnchorEl(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    if (loading) return;
    
    setLoading(true);
    setError(null);
    
    setTimeout(() => {
      setSuccess(true);
      setLoading(false);
      setTimeout(() => setSuccess(false), 3000);
    }, 1000);
  };

  const handleThemeChange = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const handleExportData = async () => {
    if (loading) return;
    
    setLoading(true);
    setError(null);
    
    const userId = safeLocalStorage.getItem("userId");
    if (!userId) {
      setError("Keine User-ID gefunden.");
      setLoading(false);
      return;
    }
    
    try {
      // Supabase: Benutzerdaten abrufen
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (!error && data) {
        if (typeof window !== 'undefined') {
          const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `userdata_${userId}.json`;
          document.body.appendChild(a);
          a.click();
          a.remove();
        }
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError("Fehler beim Export.");
      }
    } catch {
      setError("Fehler beim Export.");
    } finally {
      setLoading(false);
    }
  };

  const settingsTabs = [
    { id: 'profile', label: 'Profil', icon: <User size={20} /> },
    { id: 'notifications', label: 'Benachrichtigungen', icon: <Bell size={20} /> },
    { id: 'privacy', label: 'Datenschutz', icon: <Shield size={20} /> },
    { id: 'appearance', label: 'Erscheinungsbild', icon: <Palette size={20} /> },
    { id: 'account', label: 'Konto', icon: <Settings size={20} /> }
  ];

  return (
    <AccessControl 
      path="/settings" 
      userSubscription={userSubscription ? {
        ...userSubscription,
        packageId: userSubscription.packageId === 'free' ? 'basic' : userSubscription.packageId
      } : undefined}
    >
      <Box sx={{
        minHeight: '100vh',
        background: `
          radial-gradient(circle at 20% 20%, rgba(78, 205, 196, 0.15) 0%, transparent 50%),
          radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.15) 0%, transparent 50%),
          radial-gradient(circle at 40% 60%, rgba(255, 107, 157, 0.15) 0%, transparent 50%),
          linear-gradient(135deg, #0F0F23 0%, #1A1A2E 100%)
        `,
        position: 'relative',
        overflow: 'hidden'
      }}>
        
        {/* Navigation */}
        <Box sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          background: '#000000',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.3)'
        }}>
          <Container maxWidth="lg">
            <Box sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              py: 1
            }}>
              <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                <Box sx={{ 
                  position: 'relative',
                  height: { xs: 50, md: 70 },
                  width: { xs: 200, md: 280 },
                  cursor: 'pointer',
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.05)'
                  }
                }}>
                  <Image
                    src="/images/connection-key-logo.png"
                    alt="The Connection Key Logo"
                    fill
                    style={{ objectFit: 'contain' }}
                    priority
                  />
                </Box>
              </Link>
              
              <Stack direction="row" spacing={2}>
                <Button
                  component={Link}
                  href="/dashboard"
                  variant="outlined"
                  sx={{
                    borderColor: 'rgba(255,255,255,0.3)',
                    color: 'white',
                    borderRadius: 3,
                    textTransform: 'none',
                    fontWeight: 600,
                    '&:hover': {
                      borderColor: '#4ecdc4',
                      backgroundColor: 'rgba(78, 205, 196, 0.1)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 15px rgba(78, 205, 196, 0.2)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  Dashboard
                </Button>
                <Button
                  component={Link}
                  href="/profile"
                  variant="contained"
                  sx={{
                    background: 'linear-gradient(135deg, #4ecdc4, #44a08d)',
                    borderRadius: 3,
                    textTransform: 'none',
                    fontWeight: 600,
                    boxShadow: '0 4px 15px rgba(78, 205, 196, 0.3)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #44a08d, #4ecdc4)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 25px rgba(78, 205, 196, 0.4)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  Profil
                </Button>
              </Stack>
            </Box>
          </Container>
        </Box>

        {/* Hero Section */}
        <Container maxWidth="lg" sx={{ pt: { xs: 16, md: 20 }, pb: 8 }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Box sx={{ textAlign: 'center', mb: 8 }}>
              <Typography variant="h1" sx={{
                background: 'linear-gradient(135deg, #4ecdc4, #8b5cf6, #ff6b9d)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 800,
                mb: 3,
                fontSize: { xs: '2.5rem', md: '4rem' },
                textShadow: '0 0 30px rgba(78, 205, 196, 0.3)'
              }}>
                ⚙️ Einstellungen
              </Typography>
              
              <Typography variant="h5" sx={{
                color: 'rgba(255,255,255,0.85)',
                mb: 6,
                maxWidth: 700,
                mx: 'auto',
                lineHeight: 1.8,
                fontSize: { xs: '1.1rem', md: '1.3rem' }
              }}>
                Personalisiere deine Erfahrung und verwalte deine Präferenzen. 
                Alles unter deiner Kontrolle.
              </Typography>
              
              <Stack 
                direction={{ xs: 'column', sm: 'row' }} 
                spacing={2} 
                justifyContent="center"
                sx={{ mb: 6 }}
              >
                <Button
                  onClick={() => setActiveTab('profile')}
                  variant="contained"
                  size="large"
                  sx={{
                    background: 'linear-gradient(135deg, #4ecdc4, #44a08d)',
                    px: 5,
                    py: 2,
                    borderRadius: 3,
                    fontWeight: 600,
                    fontSize: '1.1rem',
                    textTransform: 'none',
                    minWidth: { xs: '100%', sm: 'auto' },
                    boxShadow: '0 8px 25px rgba(78, 205, 196, 0.3)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #44a08d, #4ecdc4)',
                      transform: 'translateY(-3px)',
                      boxShadow: '0 12px 35px rgba(78, 205, 196, 0.4)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  <User size={22} style={{ marginRight: 10 }} />
                  Profil bearbeiten
                </Button>
                
                <Button
                  onClick={() => setActiveTab('notifications')}
                  variant="outlined"
                  size="large"
                  sx={{
                    borderColor: 'rgba(255,255,255,0.3)',
                    color: 'white',
                    px: 5,
                    py: 2,
                    borderRadius: 3,
                    fontWeight: 600,
                    fontSize: '1.1rem',
                    textTransform: 'none',
                    minWidth: { xs: '100%', sm: 'auto' },
                    '&:hover': {
                      borderColor: '#8b5cf6',
                      backgroundColor: 'rgba(139, 92, 246, 0.1)',
                      transform: 'translateY(-3px)',
                      boxShadow: '0 8px 25px rgba(139, 92, 246, 0.2)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  <Bell size={22} style={{ marginRight: 10 }} />
                  Benachrichtigungen
                  <ArrowRight size={22} style={{ marginLeft: 10 }} />
                </Button>
              </Stack>

              {/* Stats */}
              <Grid container spacing={3} sx={{ mb: 8 }}>
                <Grid item xs={6} md={3}>
                  <Card sx={{
                    background: 'rgba(78, 205, 196, 0.1)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: 3,
                    border: '1px solid rgba(78, 205, 196, 0.3)',
                    textAlign: 'center',
                    p: 3,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 10px 30px rgba(78, 205, 196, 0.3)'
                    }
                  }}>
                    <Typography variant="h3" sx={{ color: '#4ecdc4', fontWeight: 800, mb: 1 }}>
                      100%
                    </Typography>
                    <Typography sx={{ color: 'rgba(255,255,255,0.7)' }}>
                      Datenschutz
                    </Typography>
                  </Card>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Card sx={{
                    background: 'rgba(139, 92, 246, 0.1)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: 3,
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                    textAlign: 'center',
                    p: 3,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 10px 30px rgba(139, 92, 246, 0.3)'
                    }
                  }}>
                    <Typography variant="h3" sx={{ color: '#8b5cf6', fontWeight: 800, mb: 1 }}>
                      DSGVO
                    </Typography>
                    <Typography sx={{ color: 'rgba(255,255,255,0.7)' }}>
                      Konform
                    </Typography>
                  </Card>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Card sx={{
                    background: 'rgba(255, 107, 157, 0.1)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: 3,
                    border: '1px solid rgba(255, 107, 157, 0.3)',
                    textAlign: 'center',
                    p: 3,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 10px 30px rgba(255, 107, 157, 0.3)'
                    }
                  }}>
                    <Typography variant="h3" sx={{ color: '#ff6b9d', fontWeight: 800, mb: 1 }}>
                      24/7
                    </Typography>
                    <Typography sx={{ color: 'rgba(255,255,255,0.7)' }}>
                      Verfügbar
                    </Typography>
                  </Card>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Card sx={{
                    background: 'rgba(245, 158, 11, 0.1)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: 3,
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                    textAlign: 'center',
                    p: 3,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 10px 30px rgba(245, 158, 11, 0.3)'
                    }
                  }}>
                    <Typography variant="h3" sx={{ color: '#f59e0b', fontWeight: 800, mb: 1 }}>
                      SSL
                    </Typography>
                    <Typography sx={{ color: 'rgba(255,255,255,0.7)' }}>
                      Verschlüsselt
                    </Typography>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          </motion.div>

          {/* Settings Features */}
          <Box sx={{ mb: 10 }}>
            <Typography variant="h2" sx={{
              textAlign: 'center',
              background: 'linear-gradient(135deg, #4ecdc4, #8b5cf6)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 800,
              mb: 2,
              fontSize: { xs: '2rem', md: '3rem' }
            }}>
              ✨ Einstellungs-Bereiche
            </Typography>
            <Typography variant="h6" sx={{
              textAlign: 'center',
              color: 'rgba(255,255,255,0.7)',
              mb: 6,
              maxWidth: 600,
              mx: 'auto'
            }}>
              Alle wichtigen Einstellungen an einem Ort
            </Typography>

            <Grid container spacing={3}>
              {settingsFeatures.map((feature, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 * index }}
                  >
                    <Card sx={{
                      background: 'rgba(255, 255, 255, 0.08)',
                      backdropFilter: 'blur(20px)',
                      borderRadius: 4,
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      p: 4,
                      height: '100%',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-10px)',
                        background: 'rgba(255, 255, 255, 0.12)',
                        boxShadow: '0 15px 45px rgba(0, 0, 0, 0.4)',
                        '& .feature-icon': {
                          transform: 'scale(1.1) rotate(5deg)'
                        }
                      }
                    }}>
                      <Box 
                        className="feature-icon"
                        sx={{ 
                          display: 'inline-flex',
                          p: 2.5,
                          borderRadius: 3,
                          background: feature.color,
                          color: 'white',
                          mb: 3,
                          transition: 'all 0.3s ease',
                          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
                        }}
                      >
                        {feature.icon}
                      </Box>
                      <Typography variant="h5" sx={{ 
                        color: 'white', 
                        fontWeight: 700, 
                        mb: 2
                      }}>
                        {feature.title}
                      </Typography>
                      <Typography variant="body1" sx={{ 
                        color: 'rgba(255,255,255,0.75)',
                        lineHeight: 1.7,
                        mb: 3
                      }}>
                        {feature.description}
                      </Typography>
                      <Chip
                        label={feature.stats}
                        sx={{
                          background: 'rgba(255, 255, 255, 0.1)',
                          color: 'white',
                          fontWeight: 600
                        }}
                      />
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* How It Works */}
          <Box sx={{ mb: 10 }}>
            <Typography variant="h2" sx={{
              textAlign: 'center',
              background: 'linear-gradient(135deg, #8b5cf6, #ff6b9d)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 800,
              mb: 6,
              fontSize: { xs: '2rem', md: '3rem' }
            }}>
              🎯 So funktioniert's
            </Typography>

            <Grid container spacing={3}>
              {settingsCategories.map((step, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Card sx={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: 4,
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    p: 3,
                    height: '100%',
                    textAlign: 'center',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      background: 'rgba(255, 255, 255, 0.12)',
                      boxShadow: '0 12px 35px rgba(0, 0, 0, 0.3)'
                    }
                  }}>
                    <Box sx={{
                      width: 60,
                      height: 60,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #4ecdc4, #8b5cf6)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 3,
                      fontSize: '1.5rem',
                      fontWeight: 800,
                      color: 'white'
                    }}>
                      {step.step}
                    </Box>
                    <Box sx={{
                      display: 'inline-flex',
                      p: 2,
                      borderRadius: 3,
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      mb: 2
                    }}>
                      {step.icon}
                    </Box>
                    <Typography variant="h6" sx={{ 
                      color: 'white', 
                      fontWeight: 700, 
                      mb: 1
                    }}>
                      {step.title}
                    </Typography>
                    <Typography variant="body2" sx={{ 
                      color: 'rgba(255,255,255,0.7)',
                      lineHeight: 1.6
                    }}>
                      {step.description}
                    </Typography>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Navigation Tabs */}
          <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap', justifyContent: 'center' }}>
            {settingsTabs.map((tab) => (
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
          {activeTab === 'profile' && (
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
                      <User size={24} style={{ marginRight: 12 }} />
                      Persönliche Daten
                    </Typography>
                    
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1 }}>
                        Vorname
                      </Typography>
                      <Box
                        component="input"
                        type="text"
                        value={settings.name}
                        onChange={handleInputChange}
                        name="name"
                        placeholder="Dein Vorname"
                        sx={{
                          width: '100%',
                          p: 1.5,
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.3)',
                          borderRadius: 2,
                          color: 'white',
                          '&:focus': {
                            outline: 'none',
                            borderColor: '#f59e0b',
                            boxShadow: '0 0 0 3px rgba(245, 158, 11, 0.3)'
                          },
                          '::placeholder': {
                            color: 'rgba(255, 255, 255, 0.5)'
                          }
                        }}
                      />
                    </Box>

                    <Box sx={{ mb: 3 }}>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1 }}>
                        E-Mail
                      </Typography>
                      <Box
                        component="input"
                        type="email"
                        value={settings.email}
                        onChange={handleInputChange}
                        name="email"
                        placeholder="deine@email.com"
                        sx={{
                          width: '100%',
                          p: 1.5,
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.3)',
                          borderRadius: 2,
                          color: 'white',
                          '&:focus': {
                            outline: 'none',
                            borderColor: '#f59e0b',
                            boxShadow: '0 0 0 3px rgba(245, 158, 11, 0.3)'
                          },
                          '::placeholder': {
                            color: 'rgba(255, 255, 255, 0.5)'
                          }
                        }}
                      />
                    </Box>

                    <Box sx={{ mb: 3 }}>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1 }}>
                        Telefon
                      </Typography>
                      <Box
                        component="input"
                        type="tel"
                        value={settings.phone}
                        onChange={handleInputChange}
                        name="phone"
                        placeholder="+49 123 456789"
                        sx={{
                          width: '100%',
                          p: 1.5,
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.3)',
                          borderRadius: 2,
                          color: 'white',
                          '&:focus': {
                            outline: 'none',
                            borderColor: '#f59e0b',
                            boxShadow: '0 0 0 3px rgba(245, 158, 11, 0.3)'
                          },
                          '::placeholder': {
                            color: 'rgba(255, 255, 255, 0.5)'
                          }
                        }}
                      />
                    </Box>

                    <Box sx={{ mb: 3 }}>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1 }}>
                        Standort
                      </Typography>
                      <Box
                        component="input"
                        type="text"
                        value={settings.location}
                        onChange={handleInputChange}
                        name="location"
                        placeholder="Berlin, Deutschland"
                        sx={{
                          width: '100%',
                          p: 1.5,
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.3)',
                          borderRadius: 2,
                          color: 'white',
                          '&:focus': {
                            outline: 'none',
                            borderColor: '#f59e0b',
                            boxShadow: '0 0 0 3px rgba(245, 158, 11, 0.3)'
                          },
                          '::placeholder': {
                            color: 'rgba(255, 255, 255, 0.5)'
                          }
                        }}
                      />
                    </Box>
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
                      <Calendar size={24} style={{ marginRight: 12 }} />
                      Geburtsdaten
                    </Typography>
                    
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1 }}>
                        Geburtsdatum
                      </Typography>
                      <Box
                        component="input"
                        type="date"
                        value={settings.birthDate}
                        onChange={handleInputChange}
                        name="birthDate"
                        sx={{
                          width: '100%',
                          p: 1.5,
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.3)',
                          borderRadius: 2,
                          color: 'white',
                          '&:focus': {
                            outline: 'none',
                            borderColor: '#f59e0b',
                            boxShadow: '0 0 0 3px rgba(245, 158, 11, 0.3)'
                          }
                        }}
                      />
                    </Box>

                    <Box sx={{ mb: 3 }}>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1 }}>
                        Human Design Typ
                      </Typography>
                      <Box
                        component="select"
                        sx={{
                          width: '100%',
                          p: 1.5,
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.3)',
                          borderRadius: 2,
                          color: 'white',
                          '&:focus': {
                            outline: 'none',
                            borderColor: '#f59e0b',
                            boxShadow: '0 0 0 3px rgba(245, 158, 11, 0.3)'
                          }
                        }}
                      >
                        <option value="">Wähle deinen Typ</option>
                        <option value="Generator">Generator</option>
                        <option value="Projector">Projector</option>
                        <option value="Manifestor">Manifestor</option>
                        <option value="Reflector">Reflector</option>
                      </Box>
                    </Box>

                    <Button
                      variant="contained"
                      onClick={handleSave}
                      disabled={loading}
                      startIcon={loading ? <CircularProgress size={20} /> : <Save size={20} />}
                      sx={{
                        background: 'linear-gradient(45deg, #10b981, #059669)',
                        '&:hover': { background: 'linear-gradient(45deg, #059669, #10b981)' },
                        width: '100%',
                        py: 1.5
                      }}
                    >
                      {loading ? 'Speichern...' : 'Änderungen speichern'}
                    </Button>
                  </Card>
                </Grid>
              </Grid>
            </motion.div>
          )}

          {activeTab === 'notifications' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card sx={{
                background: 'rgba(255,255,255,0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 3,
                p: 4
              }}>
                <Typography variant="h6" sx={{ color: 'white', mb: 3, display: 'flex', alignItems: 'center' }}>
                  <Bell size={24} style={{ marginRight: 12 }} />
                  Benachrichtigungseinstellungen
                </Typography>

                <List>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon>
                      <Bell size={20} color="#FFD700" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Alle Benachrichtigungen" 
                      secondary="Erhalte Updates über neue Matches und Nachrichten"
                      sx={{ 
                        '& .MuiListItemText-primary': { color: 'white' },
                        '& .MuiListItemText-secondary': { color: 'rgba(255,255,255,0.7)' }
                      }}
                    />
                    <Switch
                      checked={settings.notifications}
                      onChange={(e) => setSettings({...settings, notifications: e.target.checked})}
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: '#FFD700',
                          '& + .MuiSwitch-track': {
                            backgroundColor: '#FFD700',
                          },
                        },
                      }}
                    />
                  </ListItem>

                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon>
                      <Mail size={20} color="#FFD700" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="E-Mail Benachrichtigungen" 
                      secondary="Erhalte wichtige Updates per E-Mail"
                      sx={{ 
                        '& .MuiListItemText-primary': { color: 'white' },
                        '& .MuiListItemText-secondary': { color: 'rgba(255,255,255,0.7)' }
                      }}
                    />
                    <Switch
                      checked={settings.emailNotifications}
                      onChange={(e) => setSettings({...settings, emailNotifications: e.target.checked})}
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: '#FFD700',
                          '& + .MuiSwitch-track': {
                            backgroundColor: '#FFD700',
                          },
                        },
                      }}
                    />
                  </ListItem>

                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon>
                      <Bell size={20} color="#FFD700" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Push-Benachrichtigungen" 
                      secondary="Erhalte sofortige Benachrichtigungen auf deinem Gerät"
                      sx={{ 
                        '& .MuiListItemText-primary': { color: 'white' },
                        '& .MuiListItemText-secondary': { color: 'rgba(255,255,255,0.7)' }
                      }}
                    />
                    <Switch
                      checked={settings.pushNotifications}
                      onChange={(e) => setSettings({...settings, pushNotifications: e.target.checked})}
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: '#FFD700',
                          '& + .MuiSwitch-track': {
                            backgroundColor: '#FFD700',
                          },
                        },
                      }}
                    />
                  </ListItem>
                </List>
              </Card>
            </motion.div>
          )}

          {activeTab === 'privacy' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card sx={{
                background: 'rgba(255,255,255,0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 3,
                p: 4
              }}>
                <Typography variant="h6" sx={{ color: 'white', mb: 3, display: 'flex', alignItems: 'center' }}>
                  <Shield size={24} style={{ marginRight: 12 }} />
                  Datenschutz & Sicherheit
                </Typography>

                <List>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon>
                      <Eye size={20} color="#FFD700" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Profil-Sichtbarkeit" 
                      secondary="Wer kann dein Profil sehen"
                      sx={{ 
                        '& .MuiListItemText-primary': { color: 'white' },
                        '& .MuiListItemText-secondary': { color: 'rgba(255,255,255,0.7)' }
                      }}
                    />
                    <Box
                      component="select"
                      value={settings.privacy}
                      onChange={(e) => setSettings({...settings, privacy: e.target.value})}
                      sx={{
                        p: 1,
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        borderRadius: 1,
                        color: 'white',
                        minWidth: 120
                      }}
                    >
                      <option value="public">Öffentlich</option>
                      <option value="friends">Nur Freunde</option>
                      <option value="private">Privat</option>
                    </Box>
                  </ListItem>

                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon>
                      <Lock size={20} color="#FFD700" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Zwei-Faktor-Authentifizierung" 
                      secondary="Erhöhe die Sicherheit deines Kontos"
                      sx={{ 
                        '& .MuiListItemText-primary': { color: 'white' },
                        '& .MuiListItemText-secondary': { color: 'rgba(255,255,255,0.7)' }
                      }}
                    />
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{
                        borderColor: '#FFD700',
                        color: '#FFD700',
                        '&:hover': { borderColor: '#fbbf24', background: 'rgba(255, 215, 0, 0.1)' }
                      }}
                    >
                      Aktivieren
                    </Button>
                  </ListItem>
                </List>
              </Card>
            </motion.div>
          )}

          {activeTab === 'appearance' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card sx={{
                background: 'rgba(255,255,255,0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 3,
                p: 4
              }}>
                <Typography variant="h6" sx={{ color: 'white', mb: 3, display: 'flex', alignItems: 'center' }}>
                  <Palette size={24} style={{ marginRight: 12 }} />
                  Erscheinungsbild
                </Typography>

                <List>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon>
                      {theme === 'dark' ? <Moon size={20} color="#FFD700" /> : <Sun size={20} color="#FFD700" />}
                    </ListItemIcon>
                    <ListItemText 
                      primary="Dark Mode" 
                      secondary="Schalte zwischen hellem und dunklem Modus um"
                      sx={{ 
                        '& .MuiListItemText-primary': { color: 'white' },
                        '& .MuiListItemText-secondary': { color: 'rgba(255,255,255,0.7)' }
                      }}
                    />
                    <Switch
                      checked={theme === 'dark'}
                      onChange={handleThemeChange}
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: '#FFD700',
                          '& + .MuiSwitch-track': {
                            backgroundColor: '#FFD700',
                          },
                        },
                      }}
                    />
                  </ListItem>

                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon>
                      <Globe size={20} color="#FFD700" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Sprache" 
                      secondary="Wähle deine bevorzugte Sprache"
                      sx={{ 
                        '& .MuiListItemText-primary': { color: 'white' },
                        '& .MuiListItemText-secondary': { color: 'rgba(255,255,255,0.7)' }
                      }}
                    />
                    <Box
                      component="select"
                      value={settings.language}
                      onChange={(e) => setSettings({...settings, language: e.target.value})}
                      sx={{
                        p: 1,
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        borderRadius: 1,
                        color: 'white',
                        minWidth: 120
                      }}
                    >
                      <option value="de">Deutsch</option>
                      <option value="en">English</option>
                      <option value="fr">Français</option>
                      <option value="es">Español</option>
                    </Box>
                  </ListItem>
                </List>
              </Card>
            </motion.div>
          )}

          {activeTab === 'account' && (
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
                      <Download size={24} style={{ marginRight: 12 }} />
                      Daten exportieren
                    </Typography>
                    
                    <Typography sx={{ color: 'rgba(255,255,255,0.8)', mb: 3 }}>
                      Lade alle deine Daten als JSON-Datei herunter
                    </Typography>

                    <Button
                      variant="contained"
                      onClick={handleExportData}
                      disabled={loading}
                      startIcon={loading ? <CircularProgress size={20} /> : <Download size={20} />}
                      sx={{
                        background: 'linear-gradient(45deg, #3b82f6, #2563eb)',
                        '&:hover': { background: 'linear-gradient(45deg, #2563eb, #3b82f6)' },
                        width: '100%',
                        py: 1.5
                      }}
                    >
                      {loading ? 'Exportieren...' : 'Daten exportieren'}
                    </Button>
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
                      <LogOut size={24} style={{ marginRight: 12 }} />
                      Konto verwalten
                    </Typography>
                    
                    <List>
                      <ListItem sx={{ px: 0, py: 1 }}>
                        <Button
                          variant="outlined"
                          fullWidth
                          sx={{
                            borderColor: '#ef4444',
                            color: '#ef4444',
                            '&:hover': { borderColor: '#dc2626', background: 'rgba(239, 68, 68, 0.1)' }
                          }}
                        >
                          <LogOut size={16} style={{ marginRight: 8 }} />
                          Abmelden
                        </Button>
                      </ListItem>
                      
                      <ListItem sx={{ px: 0, py: 1 }}>
                        <Button
                          variant="outlined"
                          fullWidth
                          sx={{
                            borderColor: '#ef4444',
                            color: '#ef4444',
                            '&:hover': { borderColor: '#dc2626', background: 'rgba(239, 68, 68, 0.1)' }
                          }}
                        >
                          <Trash2 size={16} style={{ marginRight: 8 }} />
                          Konto löschen
                        </Button>
                      </ListItem>
                    </List>
                  </Card>
                </Grid>
              </Grid>
            </motion.div>
          )}

          {/* Success/Error Messages */}
          {success && (
            <Alert severity="success" sx={{ mt: 3, background: 'rgba(16, 185, 129, 0.1)', color: 'white' }}>
              <CheckCircle size={20} style={{ marginRight: 8 }} />
              Änderungen erfolgreich gespeichert!
            </Alert>
          )}

          {error && (
            <Alert severity="error" sx={{ mt: 3, background: 'rgba(239, 68, 68, 0.1)', color: 'white' }}>
              {error}
            </Alert>
          )}

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <Card sx={{
              background: 'rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(20px)',
              borderRadius: 4,
              border: '1px solid rgba(255,255,255,0.15)',
              textAlign: 'center',
              p: { xs: 4, md: 8 },
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
              mt: 8,
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(135deg, rgba(78, 205, 196, 0.1), rgba(139, 92, 246, 0.1))',
                zIndex: 0
              }
            }}>
              <Box sx={{ position: 'relative', zIndex: 1 }}>
                <Box sx={{ mb: 3 }}>
                  <Settings size={48} color="#4ecdc4" style={{ marginBottom: 16 }} />
                </Box>
                <Typography variant="h3" sx={{ 
                  color: 'white', 
                  fontWeight: 800, 
                  mb: 3,
                  fontSize: { xs: '1.8rem', md: '2.5rem' },
                  background: 'linear-gradient(135deg, #4ecdc4, #8b5cf6)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  🚀 Alles unter Kontrolle?
                </Typography>
                <Typography variant="h6" sx={{ 
                  color: 'rgba(255,255,255,0.85)', 
                  mb: 5,
                  maxWidth: 700,
                  mx: 'auto',
                  lineHeight: 1.8,
                  fontSize: { xs: '1rem', md: '1.2rem' }
                }}>
                  Deine Einstellungen sind sicher gespeichert. Entdecke jetzt alle Features der App!
                </Typography>
                
                <Stack 
                  direction={{ xs: 'column', sm: 'row' }} 
                  spacing={2} 
                  justifyContent="center"
                  sx={{ mb: 3 }}
                >
                  <Button
                    component={Link}
                    href="/dashboard"
                    variant="contained"
                    size="large"
                    sx={{
                      background: 'linear-gradient(135deg, #4ecdc4, #44a08d)',
                      px: 6,
                      py: 2.5,
                      borderRadius: 3,
                      fontWeight: 700,
                      fontSize: '1.1rem',
                      textTransform: 'none',
                      minWidth: { xs: '100%', sm: '300px' },
                      boxShadow: '0 10px 30px rgba(78, 205, 196, 0.4)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #44a08d, #4ecdc4)',
                        transform: 'translateY(-4px)',
                        boxShadow: '0 15px 40px rgba(78, 205, 196, 0.5)'
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <Target size={22} style={{ marginRight: 10 }} />
                    Zum Dashboard
                  </Button>
                  
                  <Button
                    component={Link}
                    href="/profile"
                    variant="outlined"
                    size="large"
                    sx={{
                      borderColor: 'rgba(255,255,255,0.3)',
                      color: 'white',
                      px: 6,
                      py: 2.5,
                      borderRadius: 3,
                      fontWeight: 700,
                      fontSize: '1.1rem',
                      textTransform: 'none',
                      minWidth: { xs: '100%', sm: '300px' },
                      '&:hover': {
                        borderColor: '#8b5cf6',
                        backgroundColor: 'rgba(139, 92, 246, 0.1)',
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 25px rgba(139, 92, 246, 0.2)'
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <User size={22} style={{ marginRight: 10 }} />
                    Profil ansehen
                    <ArrowRight size={22} style={{ marginLeft: 10 }} />
                  </Button>
                </Stack>

                <Typography sx={{ 
                  color: 'rgba(255,255,255,0.6)', 
                  mt: 3,
                  fontSize: '0.9rem'
                }}>
                  100% sicher • DSGVO-konform • 24/7 verfügbar
                </Typography>
              </Box>
            </Card>
          </motion.div>
        </Container>
      </Box>
    </AccessControl>
  );
}