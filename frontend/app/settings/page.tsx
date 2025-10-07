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
  CircularProgress
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
  Trash2
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useHydrationSafe } from '../../hooks/useHydrationSafe';
import AccessControl from '../../components/AccessControl';
// import { UserSubscription as BaseUserSubscription } from '../../lib/subscription/types'; // Entfernt - nicht mehr benötigt
import { useRouter } from 'next/navigation';

// Extended UserSubscription to include 'free' package
interface UserSubscription extends Omit<BaseUserSubscription, 'packageId'> {
  packageId: 'free' | 'basic' | 'premium' | 'vip';
}


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
          radial-gradient(circle at 20% 20%, rgba(255, 107, 157, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 80% 80%, rgba(78, 205, 196, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 40% 60%, rgba(102, 126, 234, 0.1) 0%, transparent 50%),
          linear-gradient(135deg, #0F0F23 0%, #1A1A2E 100%)
        `,
        position: 'relative',
        overflow: 'hidden'
      }}>
        
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
                ⚙️ Einstellungen
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
                Personalisiere deine Erfahrung und verwalte deine Präferenzen
              </Typography>
            </Box>
          </motion.div>

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
        </Container>
      </Box>
    </AccessControl>
  );
}