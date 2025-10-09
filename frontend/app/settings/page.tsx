"use client";
import React, { useState, useEffect } from "react";
// import AppHeader from "../../components/AppHeader";
// import AnimatedMoon from "../../components/AnimatedMoon";
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Card, 
  CardContent,
  Container,
  Switch,
  FormControlLabel,
  Alert,
  CircularProgress
} from "@mui/material";
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useHydrationSafe } from '../../hooks/useHydrationSafe';
import AccessControl from '../../components/AccessControl';
import { UserSubscription as BaseUserSubscription } from '../../lib/subscription/types';

// Extended UserSubscription to include 'free' package
interface UserSubscription extends Omit<BaseUserSubscription, 'packageId'> {
  packageId: 'free' | 'basic' | 'premium' | 'vip';
}
import { useRouter } from 'next/navigation';
import { 
  User, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  Download, 
  Trash2, 
  Palette,
  Shield,
  Save,
  CheckCircle,
  BarChart3,
  BookOpen,
  Eye as EyeIcon,
  Edit,
  Plus,
  DollarSign,
  Sparkles
} from 'lucide-react';

// SSR-sichere animierte Sterne Komponente - Optimiert
const SSRSafeAnimatedStars = () => {
  // Entferne isClient State für bessere Performance
  // Sterne werden direkt gerendert

  const starPositions = [
    { left: '5%', top: '15%' },
    { left: '15%', top: '25%' },
    { left: '25%', top: '10%' },
    { left: '35%', top: '35%' },
    { left: '45%', top: '20%' },
    { left: '55%', top: '45%' },
    { left: '65%', top: '15%' },
    { left: '75%', top: '30%' },
    { left: '85%', top: '25%' },
    { left: '95%', top: '40%' },
    { left: '10%', top: '55%' },
    { left: '20%', top: '70%' },
    { left: '30%', top: '60%' },
    { left: '40%', top: '75%' },
    { left: '50%', top: '50%' },
    { left: '60%', top: '65%' },
    { left: '70%', top: '55%' },
    { left: '80%', top: '70%' },
    { left: '90%', top: '60%' },
    { left: '5%', top: '85%' },
    { left: '25%', top: '80%' },
    { left: '45%', top: '90%' },
    { left: '65%', top: '85%' },
    { left: '85%', top: '80%' },
    { left: '95%', top: '90%' }
  ];

  return (
    <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {starPositions.map((position, i) => {
        const size = 3 + (i % 3); // Feste Größen: 3, 4, 5px
        const color = i % 3 === 0 ? '#FFD700' : i % 3 === 1 ? '#A855F7' : '#8B5CF6';
        const delay = (i * 0.2) % 4; // Berechenbare Delays
        const duration = 3 + (i % 3); // 3, 4, 5 Sekunden
        
        return (
          <motion.div
            key={i}
            style={{
              position: 'absolute',
              width: `${size}px`,
              height: `${size}px`,
              background: color,
              borderRadius: '50%',
              boxShadow: i % 3 === 0 
                ? '0 0 8px #FFD700, 0 0 16px #FFD700, 0 0 24px #FFD700'
                : i % 3 === 1
                ? '0 0 8px #A855F7, 0 0 16px #A855F7, 0 0 24px #A855F7'
                : '0 0 8px #8B5CF6, 0 0 16px #8B5CF6, 0 0 24px #8B5CF6',
              left: position.left,
              top: position.top,
            }}
            animate={{
              opacity: [0.2, 1, 0.2],
              scale: [0.6, 1.4, 0.6],
            }}
            transition={{
              duration: duration,
              repeat: Infinity,
              delay: delay,
            }}
          />
        );
      })}
    </Box>
  );
};

const initialSettings = {
  name: "",
  email: "",
  phone: "",
  location: "",
  postalCode: "",
  bio: "",
  website: "",
};

// UserSubscription interface imported from types

export default function SettingsPage() {
  const router = useRouter();
  const [exportSuccess, setExportSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userSubscription, setUserSubscription] = useState<UserSubscription | null>(null);
  const { isClient, localStorage: safeLocalStorage } = useHydrationSafe();

  // Load user subscription data
  useEffect(() => {
    if (isClient) {
      const loadSubscription = () => {
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
            status: userSubscriptionData.status || 'active',
            startDate: userSubscriptionData.startDate || new Date().toISOString(),
            endDate: userSubscriptionData.endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            autoRenew: userSubscriptionData.autoRenew || false,
            paymentMethod: userSubscriptionData.paymentMethod || 'none',
            billingCycle: userSubscriptionData.billingCycle || 'monthly',
            plan: currentPlan // Hinzugefügt
          });
        } catch (error) {
          console.error('Error loading user subscription:', error);
          setUserSubscription({
            userId: 'unknown',
            packageId: 'free',
            status: 'active',
            startDate: new Date().toISOString(),
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            autoRenew: false,
            paymentMethod: 'none',
            billingCycle: 'monthly',
            plan: 'free' // Hinzugefügt
          });
        }
      };
      
      loadSubscription();
    }
  }, [isClient, safeLocalStorage]); // Alle verwendeten Dependencies

  const handleExportData = async () => {
    setLoading(true);
    const userId = safeLocalStorage.getItem("userId");
    if (!userId) {
      setError("Keine User-ID gefunden.");
      setLoading(false);
      return;
    }
    try {
      const resp = await fetch(`/api/user/${userId}`);
      if (resp.ok) {
        const data = await resp.json();
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
        setExportSuccess(true);
        setTimeout(() => setExportSuccess(false), 3000);
      } else {
        setError("Fehler beim Export.");
      }
    } catch {
      setError("Fehler beim Export.");
    }
    setLoading(false);
  };

  const [privacy, setPrivacy] = useState({ 
    profileVisible: true, 
    dataSharing: false,
    emailNotifications: true,
    pushNotifications: true,
    allowMessages: true
  });
  
  const [pwChange, setPwChange] = useState({ old: '', neu: '', confirm: '' });
  const [emailChange, setEmailChange] = useState({ neu: '', confirm: '' });
  const [pwSuccess, setPwSuccess] = useState(false);
  const [emailSuccess, setEmailSuccess] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handlePrivacyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrivacy({ ...privacy, [e.target.name]: e.target.checked });
  };
  
  const handlePwChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPwChange({ ...pwChange, [e.target.name]: e.target.value });
  };
  
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmailChange({ ...emailChange, [e.target.name]: e.target.value });
  };

  const savePwChange = async () => {
    if (pwChange.neu !== pwChange.confirm) {
      setError("Neue Passwörter stimmen nicht überein.");
      return;
    }
    
    setLoading(true);
    const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : "";
    if (!userId) {
      setError("Keine User-ID gefunden.");
      setLoading(false);
      return;
    }
    try {
      const resp = await fetch(`/api/user/changepassword`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, oldPassword: pwChange.old, newPassword: pwChange.neu })
      });
      if (resp.ok) {
        setPwSuccess(true);
        setError(null);
        setPwChange({ old: '', neu: '', confirm: '' });
        setTimeout(() => setPwSuccess(false), 3000);
      } else {
        const data = await resp.json();
        setError(data.error || "Fehler beim Ändern des Passworts.");
      }
    } catch {
      setError("Fehler beim Ändern des Passworts.");
    }
    setLoading(false);
  };

  const saveEmailChange = async () => {
    if (emailChange.neu !== emailChange.confirm) {
      setError("E-Mail-Adressen stimmen nicht überein.");
      return;
    }
    
    setLoading(true);
    const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : "";
    if (!userId) {
      setError("Keine User-ID gefunden.");
      setLoading(false);
      return;
    }
    try {
      const resp = await fetch(`/api/user/changeemail`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, newEmail: emailChange.neu })
      });
      if (resp.ok) {
        setEmailSuccess(true);
        setError(null);
        setEmailChange({ neu: '', confirm: '' });
        setTimeout(() => setEmailSuccess(false), 3000);
      } else {
        const data = await resp.json();
        setError(data.error || "Fehler beim Ändern der E-Mail.");
      }
    } catch {
      setError("Fehler beim Ändern der E-Mail.");
    }
    setLoading(false);
  };

  const [settings, setSettings] = useState(initialSettings);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    setLoading(true);
    // Hier könnte ein API-Call stehen
    setTimeout(() => {
      setSuccess(true);
      setError(null);
      setLoading(false);
      setTimeout(() => setSuccess(false), 3000);
    }, 1000);
  };

  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [cancelSubscriptionSuccess, setCancelSubscriptionSuccess] = useState(false);

  const handleThemeChange = () => {
    setTheme(t => t === 'light' ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme === 'light' ? 'dark' : 'light');
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Möchtest du deinen Account wirklich unwiderruflich löschen? Diese Aktion kann nicht rückgängig gemacht werden.")) {
      return;
    }
    
    setLoading(true);
    const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : "";
    if (!userId) {
      setError("Keine User-ID gefunden.");
      setLoading(false);
      return;
    }
    try {
      const resp = await fetch(`/api/user/delete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId })
      });
      if (resp.ok) {
        setDeleteSuccess(true);
        setError(null);
        setTimeout(() => {
          localStorage.clear();
          window.location.href = '/';
        }, 2000);
      } else {
        const data = await resp.json();
        setError(data.error || "Fehler beim Löschen.");
      }
    } catch {
      setError("Fehler beim Löschen.");
    }
    setLoading(false);
  };

  const handleCancelSubscription = async () => {
    if (!window.confirm("Möchtest du dein Abonnement wirklich kündigen? Du verlierst den Zugang zu Premium-Features am Ende der aktuellen Abrechnungsperiode.")) {
      return;
    }
    
    setLoading(true);
    const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : "";
    if (!userId) {
      setError("Keine User-ID gefunden.");
      setLoading(false);
      return;
    }
    try {
      const resp = await fetch(`/api/user/cancel-subscription`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId })
      });
      if (resp.ok) {
        setCancelSubscriptionSuccess(true);
        setError(null);
        setTimeout(() => setCancelSubscriptionSuccess(false), 5000);
      } else {
        const data = await resp.json();
        setError(data.error || "Fehler beim Kündigen des Abonnements.");
      }
    } catch {
      setError("Fehler beim Kündigen des Abonnements.");
    }
    setLoading(false);
  };

  return (
    <AccessControl 
      path="/settings" 
      userSubscription={userSubscription ? {
        ...userSubscription,
        packageId: userSubscription.packageId === 'free' ? 'basic' : userSubscription.packageId
      } as BaseUserSubscription : null}
      onUpgrade={() => router.push('/pricing')}
    >
      <Box sx={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 25%, #533483 50%, #8B5CF6 75%, #A855F7 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <SSRSafeAnimatedStars />
        
        <Container maxWidth="md" sx={{ py: 4, position: 'relative', zIndex: 2 }}>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
          >
            {/* Hero Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Box sx={{ textAlign: 'center', mb: 6 }}>
                <Typography 
                  variant="h2" 
                  sx={{ 
                    color: '#FFD700', 
                    fontWeight: 800, 
                    mb: 3,
                    fontSize: { xs: '2.5rem', md: '3.5rem' },
                    textShadow: '0 0 20px rgba(255, 215, 0, 0.5)',
                    background: 'linear-gradient(45deg, #FFD700, #fbbf24)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}
                >
                  <Sparkles size={48} style={{ marginRight: 16, display: 'inline-block' }} />
                  Einstellungen
                  <Sparkles size={48} style={{ marginLeft: 16, display: 'inline-block' }} />
                </Typography>
                
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: 'rgba(255,255,255,0.9)', 
                    mb: 4,
                    fontWeight: 400,
                    maxWidth: 800,
                    mx: 'auto',
                    lineHeight: 1.4
                  }}
                >
                  Verwalte deine persönlichen Einstellungen und Human Design Präferenzen
                </Typography>
              </Box>
            </motion.div>

            {/* Persönliche Daten */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Card sx={{ 
                mb: 4,
                background: 'rgba(255, 255, 255, 0.1)', 
                backdropFilter: 'blur(20px)',
                borderRadius: 3, 
                boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                    <Box sx={{ 
                      width: 48, 
                      height: 48, 
                      borderRadius: '12px', 
                      background: 'linear-gradient(135deg, #FFD700, #fbbf24)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      boxShadow: '0 4px 12px rgba(255, 215, 0, 0.3)', 
                      color: '#23233a'
                    }}>
                      <User size={24} />
                    </Box>
                    <Typography variant="h5" sx={{ color: '#FFD700', fontWeight: 700 }}>
                      Persönliche Daten
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
                    <TextField 
                      name="name" 
                      label="Vollständiger Name" 
                      value={settings.name} 
                      onChange={handleChange} 
                      fullWidth 
                      sx={{ 
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 3,
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                          '& fieldset': {
                            borderColor: 'rgba(255, 215, 0, 0.3)',
                          },
                          '&:hover fieldset': {
                            borderColor: 'rgba(255, 215, 0, 0.5)',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#FFD700',
                          },
                        },
                        '& .MuiInputBase-input': {
                          color: '#23233a',
                        },
                        '& .MuiInputLabel-root': {
                          color: '#666',
                        }
                      }} 
                    />
                    <TextField 
                      name="email" 
                      label="E-Mail" 
                      type="email"
                      value={settings.email} 
                      onChange={handleChange} 
                      fullWidth 
                      sx={{ 
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 3,
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                          '& fieldset': {
                            borderColor: 'rgba(255, 215, 0, 0.3)',
                          },
                          '&:hover fieldset': {
                            borderColor: 'rgba(255, 215, 0, 0.5)',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#FFD700',
                          },
                        },
                        '& .MuiInputBase-input': {
                          color: '#23233a',
                        },
                        '& .MuiInputLabel-root': {
                          color: '#666',
                        }
                      }} 
                    />
                    <TextField 
                      name="phone" 
                      label="Telefon" 
                      value={settings.phone} 
                      onChange={handleChange} 
                      fullWidth 
                      sx={{ 
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 3,
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                          '& fieldset': {
                            borderColor: 'rgba(255, 215, 0, 0.3)',
                          },
                          '&:hover fieldset': {
                            borderColor: 'rgba(255, 215, 0, 0.5)',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#FFD700',
                          },
                        },
                        '& .MuiInputBase-input': {
                          color: '#23233a',
                        },
                        '& .MuiInputLabel-root': {
                          color: '#666',
                        }
                      }} 
                    />
                    <TextField 
                      name="location" 
                      label="Ort" 
                      value={settings.location} 
                      onChange={handleChange} 
                      fullWidth 
                      sx={{ 
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 3,
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                          '& fieldset': {
                            borderColor: 'rgba(255, 215, 0, 0.3)',
                          },
                          '&:hover fieldset': {
                            borderColor: 'rgba(255, 215, 0, 0.5)',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#FFD700',
                          },
                        },
                        '& .MuiInputBase-input': {
                          color: '#23233a',
                        },
                        '& .MuiInputLabel-root': {
                          color: '#666',
                        }
                      }} 
                    />
                    <TextField 
                      name="postalCode" 
                      label="Postleitzahl" 
                      value={settings.postalCode} 
                      onChange={handleChange} 
                      fullWidth 
                      sx={{ 
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 3,
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                          '& fieldset': {
                            borderColor: 'rgba(255, 215, 0, 0.3)',
                          },
                          '&:hover fieldset': {
                            borderColor: 'rgba(255, 215, 0, 0.5)',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#FFD700',
                          },
                        },
                        '& .MuiInputBase-input': {
                          color: '#23233a',
                        },
                        '& .MuiInputLabel-root': {
                          color: '#666',
                        }
                      }} 
                    />
                    <TextField 
                      name="website" 
                      label="Website" 
                      value={settings.website} 
                      onChange={handleChange} 
                      fullWidth 
                      sx={{ 
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 3,
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                          '& fieldset': {
                            borderColor: 'rgba(255, 215, 0, 0.3)',
                          },
                          '&:hover fieldset': {
                            borderColor: 'rgba(255, 215, 0, 0.5)',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#FFD700',
                          },
                        },
                        '& .MuiInputBase-input': {
                          color: '#23233a',
                        },
                        '& .MuiInputLabel-root': {
                          color: '#666',
                        }
                      }} 
                    />
                  </Box>

                  <TextField 
                    name="bio" 
                    label="Über mich" 
                    value={settings.bio} 
                    onChange={handleChange} 
                    fullWidth 
                    multiline 
                    minRows={3}
                    sx={{ 
                      mt: 3,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 3,
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        '& fieldset': {
                          borderColor: 'rgba(255, 215, 0, 0.3)',
                        },
                        '&:hover fieldset': {
                          borderColor: 'rgba(255, 215, 0, 0.5)',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#FFD700',
                        },
                      },
                      '& .MuiInputBase-input': {
                        color: '#23233a',
                      },
                      '& .MuiInputLabel-root': {
                        color: '#666',
                      }
                    }} 
                  />

                  <Button 
                    variant="contained" 
                    onClick={handleSave}
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={20} /> : <Save size={20} />}
                    sx={{ 
                      mt: 3, 
                      borderRadius: 3, 
                      background: 'linear-gradient(45deg, #FFD700, #fbbf24)', 
                      color: '#23233a', 
                      fontWeight: 700, 
                      fontSize: 16, 
                      py: 1.5,
                      px: 4,
                      boxShadow: '0 8px 25px rgba(255, 215, 0, 0.3)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #fbbf24, #f59e0b)',
                        boxShadow: '0 12px 35px rgba(255, 215, 0, 0.4)',
                      },
                      '&:disabled': { 
                        opacity: 0.7,
                        background: 'linear-gradient(45deg, #FFD700, #fbbf24)'
                      } 
                    }}
                  >
                    {loading ? 'Speichere...' : 'Speichern'}
                  </Button>

                  {success && (
                    <Alert severity="success" sx={{ mt: 2, borderRadius: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CheckCircle size={20} />
                        Einstellungen erfolgreich gespeichert!
                      </Box>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Privatsphäre & Benachrichtigungen */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Card sx={{ 
                mb: 4,
                background: 'rgba(255, 255, 255, 0.1)', 
                backdropFilter: 'blur(20px)',
                borderRadius: 3, 
                boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                    <Box sx={{ 
                      width: 48, 
                      height: 48, 
                      borderRadius: '12px', 
                      background: 'linear-gradient(135deg, #A855F7, #8B5CF6)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      boxShadow: '0 4px 12px rgba(168, 85, 247, 0.3)', 
                      color: '#fff'
                    }}>
                      <Shield size={24} />
                    </Box>
                    <Typography variant="h5" sx={{ color: '#A855F7', fontWeight: 700 }}>
                      Privatsphäre & Benachrichtigungen
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <FormControlLabel
                      control={
                        <Switch 
                          checked={privacy.profileVisible} 
                          onChange={handlePrivacyChange}
                          name="profileVisible"
                          sx={{
                            '& .MuiSwitch-switchBase.Mui-checked': {
                              color: '#FFD700',
                            },
                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                              backgroundColor: '#FFD700',
                            },
                          }}
                        />
                      }
                      label="Profil öffentlich sichtbar"
                      sx={{ color: '#ffffff', fontWeight: 500 }}
                    />
                    <FormControlLabel
                      control={
                        <Switch 
                          checked={privacy.dataSharing} 
                          onChange={handlePrivacyChange}
                          name="dataSharing"
                          sx={{
                            '& .MuiSwitch-switchBase.Mui-checked': {
                              color: '#FFD700',
                            },
                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                              backgroundColor: '#FFD700',
                            },
                          }}
                        />
                      }
                      label="Daten für Forschung freigeben"
                      sx={{ color: '#ffffff', fontWeight: 500 }}
                    />
                    <FormControlLabel
                      control={
                        <Switch 
                          checked={privacy.emailNotifications} 
                          onChange={handlePrivacyChange}
                          name="emailNotifications"
                          sx={{
                            '& .MuiSwitch-switchBase.Mui-checked': {
                              color: '#FFD700',
                            },
                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                              backgroundColor: '#FFD700',
                            },
                          }}
                        />
                      }
                      label="E-Mail-Benachrichtigungen"
                      sx={{ color: '#ffffff', fontWeight: 500 }}
                    />
                    <FormControlLabel
                      control={
                        <Switch 
                          checked={privacy.pushNotifications} 
                          onChange={handlePrivacyChange}
                          name="pushNotifications"
                          sx={{
                            '& .MuiSwitch-switchBase.Mui-checked': {
                              color: '#FFD700',
                            },
                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                              backgroundColor: '#FFD700',
                            },
                          }}
                        />
                      }
                      label="Push-Benachrichtigungen"
                      sx={{ color: '#ffffff', fontWeight: 500 }}
                    />
                    <FormControlLabel
                      control={
                        <Switch 
                          checked={privacy.allowMessages} 
                          onChange={handlePrivacyChange}
                          name="allowMessages"
                          sx={{
                            '& .MuiSwitch-switchBase.Mui-checked': {
                              color: '#FFD700',
                            },
                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                              backgroundColor: '#FFD700',
                            },
                          }}
                        />
                      }
                      label="Nachrichten von anderen Nutzern erlauben"
                      sx={{ color: '#ffffff', fontWeight: 500 }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </motion.div>

            {/* Passwort ändern */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <Card sx={{ 
                mb: 4,
                background: 'rgba(255, 255, 255, 0.1)', 
                backdropFilter: 'blur(20px)',
                borderRadius: 3, 
                boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                    <Box sx={{ 
                      width: 48, 
                      height: 48, 
                      borderRadius: '12px', 
                      background: 'linear-gradient(135deg, #10B981, #059669)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)', 
                      color: '#fff'
                    }}>
                      <Lock size={24} />
                    </Box>
                    <Typography variant="h5" sx={{ color: '#10B981', fontWeight: 700 }}>
                      Passwort ändern
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <TextField 
                      name="old" 
                      label="Aktuelles Passwort" 
                      type={showOldPassword ? "text" : "password"}
                      value={pwChange.old} 
                      onChange={handlePwChange} 
                      fullWidth 
                      InputProps={{
                        endAdornment: (
                          <Button
                            onClick={() => setShowOldPassword(!showOldPassword)}
                            sx={{ minWidth: 'auto', p: 1 }}
                          >
                            {showOldPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                          </Button>
                        ),
                      }}
                      sx={{ 
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 3,
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                          '& fieldset': {
                            borderColor: 'rgba(16, 185, 129, 0.3)',
                          },
                          '&:hover fieldset': {
                            borderColor: 'rgba(16, 185, 129, 0.5)',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#10B981',
                          },
                        },
                        '& .MuiInputBase-input': {
                          color: '#23233a',
                        },
                        '& .MuiInputLabel-root': {
                          color: '#666',
                        }
                      }} 
                    />
                    <TextField 
                      name="neu" 
                      label="Neues Passwort" 
                      type={showNewPassword ? "text" : "password"}
                      value={pwChange.neu} 
                      onChange={handlePwChange} 
                      fullWidth 
                      InputProps={{
                        endAdornment: (
                          <Button
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            sx={{ minWidth: 'auto', p: 1 }}
                          >
                            {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                          </Button>
                        ),
                      }}
                      sx={{ 
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 3,
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                          '& fieldset': {
                            borderColor: 'rgba(16, 185, 129, 0.3)',
                          },
                          '&:hover fieldset': {
                            borderColor: 'rgba(16, 185, 129, 0.5)',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#10B981',
                          },
                        },
                        '& .MuiInputBase-input': {
                          color: '#23233a',
                        },
                        '& .MuiInputLabel-root': {
                          color: '#666',
                        }
                      }} 
                    />
                    <TextField 
                      name="confirm" 
                      label="Neues Passwort bestätigen" 
                      type={showConfirmPassword ? "text" : "password"}
                      value={pwChange.confirm} 
                      onChange={handlePwChange} 
                      fullWidth 
                      InputProps={{
                        endAdornment: (
                          <Button
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            sx={{ minWidth: 'auto', p: 1 }}
                          >
                            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                          </Button>
                        ),
                      }}
                      sx={{ 
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 3,
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                          '& fieldset': {
                            borderColor: 'rgba(16, 185, 129, 0.3)',
                          },
                          '&:hover fieldset': {
                            borderColor: 'rgba(16, 185, 129, 0.5)',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#10B981',
                          },
                        },
                        '& .MuiInputBase-input': {
                          color: '#23233a',
                        },
                        '& .MuiInputLabel-root': {
                          color: '#666',
                        }
                      }} 
                    />
                    
                    <Button 
                      variant="contained" 
                      onClick={savePwChange}
                      disabled={loading || !pwChange.old || !pwChange.neu || !pwChange.confirm}
                      startIcon={loading ? <CircularProgress size={20} /> : <Lock size={20} />}
                      sx={{ 
                        borderRadius: 3, 
                        background: 'linear-gradient(45deg, #10B981, #059669)', 
                        color: '#fff', 
                        fontWeight: 700, 
                        fontSize: 16, 
                        py: 1.5,
                        px: 4,
                        boxShadow: '0 8px 25px rgba(16, 185, 129, 0.3)',
                        '&:hover': {
                          background: 'linear-gradient(45deg, #059669, #047857)',
                          boxShadow: '0 12px 35px rgba(16, 185, 129, 0.4)',
                        },
                        '&:disabled': { 
                          opacity: 0.7,
                          background: 'linear-gradient(45deg, #10B981, #059669)'
                        } 
                      }}
                    >
                      {loading ? 'Ändere...' : 'Passwort ändern'}
                    </Button>

                    {pwSuccess && (
                      <Alert severity="success" sx={{ borderRadius: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CheckCircle size={20} />
                          Passwort erfolgreich geändert!
                        </Box>
                      </Alert>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </motion.div>

            {/* E-Mail ändern */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.0 }}
            >
              <Card sx={{ 
                mb: 4,
                background: 'rgba(255, 255, 255, 0.1)', 
                backdropFilter: 'blur(20px)',
                borderRadius: 3, 
                boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                    <Box sx={{ 
                      width: 48, 
                      height: 48, 
                      borderRadius: '12px', 
                      background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)', 
                      color: '#fff'
                    }}>
                      <Mail size={24} />
                    </Box>
                    <Typography variant="h5" sx={{ color: '#8B5CF6', fontWeight: 700 }}>
                      E-Mail ändern
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <TextField 
                      name="neu" 
                      label="Neue E-Mail" 
                      type="email"
                      value={emailChange.neu} 
                      onChange={handleEmailChange} 
                      fullWidth 
                      sx={{ 
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 3,
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                          '& fieldset': {
                            borderColor: 'rgba(139, 92, 246, 0.3)',
                          },
                          '&:hover fieldset': {
                            borderColor: 'rgba(139, 92, 246, 0.5)',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#8B5CF6',
                          },
                        },
                        '& .MuiInputBase-input': {
                          color: '#23233a',
                        },
                        '& .MuiInputLabel-root': {
                          color: '#666',
                        }
                      }} 
                    />
                    <TextField 
                      name="confirm" 
                      label="Neue E-Mail bestätigen" 
                      type="email"
                      value={emailChange.confirm} 
                      onChange={handleEmailChange} 
                      fullWidth 
                      sx={{ 
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 3,
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                          '& fieldset': {
                            borderColor: 'rgba(139, 92, 246, 0.3)',
                          },
                          '&:hover fieldset': {
                            borderColor: 'rgba(139, 92, 246, 0.5)',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#8B5CF6',
                          },
                        },
                        '& .MuiInputBase-input': {
                          color: '#23233a',
                        },
                        '& .MuiInputLabel-root': {
                          color: '#666',
                        }
                      }} 
                    />
                    
                    <Button 
                      variant="contained" 
                      onClick={saveEmailChange}
                      disabled={loading || !emailChange.neu || !emailChange.confirm}
                      startIcon={loading ? <CircularProgress size={20} /> : <Mail size={20} />}
                      sx={{ 
                        borderRadius: 3, 
                        background: 'linear-gradient(45deg, #8B5CF6, #7C3AED)', 
                        color: '#fff', 
                        fontWeight: 700, 
                        fontSize: 16, 
                        py: 1.5,
                        px: 4,
                        boxShadow: '0 8px 25px rgba(139, 92, 246, 0.3)',
                        '&:hover': {
                          background: 'linear-gradient(45deg, #7C3AED, #6D28D9)',
                          boxShadow: '0 12px 35px rgba(139, 92, 246, 0.4)',
                        },
                        '&:disabled': { 
                          opacity: 0.7,
                          background: 'linear-gradient(45deg, #8B5CF6, #7C3AED)'
                        } 
                      }}
                    >
                      {loading ? 'Ändere...' : 'E-Mail ändern'}
                    </Button>

                    {emailSuccess && (
                      <Alert severity="success" sx={{ borderRadius: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CheckCircle size={20} />
                          E-Mail erfolgreich geändert!
                        </Box>
                      </Alert>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </motion.div>

            {/* Profil bearbeiten */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
            >
              <Card sx={{ 
                mb: 4,
                background: 'rgba(255, 255, 255, 0.1)', 
                backdropFilter: 'blur(20px)',
                borderRadius: 3, 
                boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                    <Box sx={{ 
                      width: 48, 
                      height: 48, 
                      borderRadius: '12px', 
                      background: 'linear-gradient(135deg, #FFD700, #fbbf24)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      boxShadow: '0 4px 12px rgba(255, 215, 0, 0.3)', 
                      color: '#23233a'
                    }}>
                      <User size={24} />
                    </Box>
                    <Typography variant="h5" sx={{ color: '#FFD700', fontWeight: 700 }}>
                      Profil bearbeiten
                    </Typography>
                  </Box>

                  <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', mb: 3 }}>
                    Bearbeite deine persönlichen Informationen und Human Design Details.
                  </Typography>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <Button 
                      variant="outlined" 
                      component={Link}
                      href="/profil-einrichten"
                      startIcon={<User size={20} />}
                      sx={{ 
                        borderRadius: 3,
                        borderColor: 'rgba(255, 215, 0, 0.3)',
                        color: '#FFD700',
                        fontWeight: 600,
                        py: 1.5,
                        '&:hover': {
                          borderColor: '#FFD700',
                          backgroundColor: 'rgba(255, 215, 0, 0.1)',
                        }
                      }}
                    >
                      Profil vollständig bearbeiten
                    </Button>

                    <Button 
                      variant="outlined" 
                      component={Link}
                      href="/profil"
                      startIcon={<User size={20} />}
                      sx={{ 
                        borderRadius: 3,
                        borderColor: 'rgba(255, 215, 0, 0.3)',
                        color: '#FFD700',
                        fontWeight: 600,
                        py: 1.5,
                        '&:hover': {
                          borderColor: '#FFD700',
                          backgroundColor: 'rgba(255, 215, 0, 0.1)',
                        }
                      }}
                    >
                      Profil anzeigen
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>

            {/* Human Design Chart verwalten */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.4 }}
            >
              <Card sx={{ 
                mb: 4,
                background: 'rgba(255, 255, 255, 0.1)', 
                backdropFilter: 'blur(20px)',
                borderRadius: 3, 
                boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                    <Box sx={{ 
                      width: 48, 
                      height: 48, 
                      borderRadius: '12px', 
                      background: 'linear-gradient(135deg, #10B981, #059669)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)', 
                      color: '#fff'
                    }}>
                      <BarChart3 size={24} />
                    </Box>
                    <Typography variant="h5" sx={{ color: '#10B981', fontWeight: 700 }}>
                      Human Design Chart verwalten
                    </Typography>
                  </Box>

                  <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', mb: 3 }}>
                    Erstelle neue Charts, bearbeite bestehende und verwalte deine Human Design Berechnungen.
                  </Typography>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <Button 
                      variant="outlined" 
                      component={Link}
                      href="/chart"
                      startIcon={<Plus size={20} />}
                      sx={{ 
                        borderRadius: 3,
                        borderColor: 'rgba(16, 185, 129, 0.3)',
                        color: '#10B981',
                        fontWeight: 600,
                        py: 1.5,
                        '&:hover': {
                          borderColor: '#10B981',
                          backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        }
                      }}
                    >
                      Neues Chart erstellen
                    </Button>

                    <Button 
                      variant="outlined" 
                      component={Link}
                      href="/dashboard"
                      startIcon={<EyeIcon size={20} />}
                      sx={{ 
                        borderRadius: 3,
                        borderColor: 'rgba(16, 185, 129, 0.3)',
                        color: '#10B981',
                        fontWeight: 600,
                        py: 1.5,
                        '&:hover': {
                          borderColor: '#10B981',
                          backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        }
                      }}
                    >
                      Meine Charts anzeigen
                    </Button>

                    <Button 
                      variant="outlined" 
                      component={Link}
                      href="/chart"
                      startIcon={<Edit size={20} />}
                      sx={{ 
                        borderRadius: 3,
                        borderColor: 'rgba(16, 185, 129, 0.3)',
                        color: '#10B981',
                        fontWeight: 600,
                        py: 1.5,
                        '&:hover': {
                          borderColor: '#10B981',
                          backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        }
                      }}
                    >
                      Chart bearbeiten
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>

            {/* Reading verwalten */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.6 }}
            >
              <Card sx={{ 
                mb: 4,
                background: 'rgba(255, 255, 255, 0.1)', 
                backdropFilter: 'blur(20px)',
                borderRadius: 3, 
                boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                    <Box sx={{ 
                      width: 48, 
                      height: 48, 
                      borderRadius: '12px', 
                      background: 'linear-gradient(135deg, #F59E0B, #D97706)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)', 
                      color: '#fff'
                    }}>
                      <BookOpen size={24} />
                    </Box>
                    <Typography variant="h5" sx={{ color: '#F59E0B', fontWeight: 700 }}>
                      Reading verwalten
                    </Typography>
                  </Box>

                  <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', mb: 3 }}>
                    Erstelle neue Readings, bearbeite bestehende und verwalte deine Human Design Interpretationen.
                  </Typography>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <Button 
                      variant="outlined" 
                      component={Link}
                      href="/reading"
                      startIcon={<Plus size={20} />}
                      sx={{ 
                        borderRadius: 3,
                        borderColor: 'rgba(245, 158, 11, 0.3)',
                        color: '#F59E0B',
                        fontWeight: 600,
                        py: 1.5,
                        '&:hover': {
                          borderColor: '#F59E0B',
                          backgroundColor: 'rgba(245, 158, 11, 0.1)',
                        }
                      }}
                    >
                      Neues Reading erstellen
                    </Button>

                    <Button 
                      variant="outlined" 
                      component={Link}
                      href="/dashboard"
                      startIcon={<EyeIcon size={20} />}
                      sx={{ 
                        borderRadius: 3,
                        borderColor: 'rgba(245, 158, 11, 0.3)',
                        color: '#F59E0B',
                        fontWeight: 600,
                        py: 1.5,
                        '&:hover': {
                          borderColor: '#F59E0B',
                          backgroundColor: 'rgba(245, 158, 11, 0.1)',
                        }
                      }}
                    >
                      Meine Readings anzeigen
                    </Button>

                    <Button 
                      variant="outlined" 
                      component={Link}
                      href="/reading"
                      startIcon={<Edit size={20} />}
                      sx={{ 
                        borderRadius: 3,
                        borderColor: 'rgba(245, 158, 11, 0.3)',
                        color: '#F59E0B',
                        fontWeight: 600,
                        py: 1.5,
                        '&:hover': {
                          borderColor: '#F59E0B',
                          backgroundColor: 'rgba(245, 158, 11, 0.1)',
                        }
                      }}
                    >
                      Reading bearbeiten
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>

            {/* Theme & Datenexport */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.8 }}
            >
              <Card sx={{ 
                mb: 4,
                background: 'rgba(255, 255, 255, 0.1)', 
                backdropFilter: 'blur(20px)',
                borderRadius: 3, 
                boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                    <Box sx={{ 
                      width: 48, 
                      height: 48, 
                      borderRadius: '12px', 
                      background: 'linear-gradient(135deg, #F59E0B, #D97706)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)', 
                      color: '#fff'
                    }}>
                      <Palette size={24} />
                    </Box>
                    <Typography variant="h5" sx={{ color: '#F59E0B', fontWeight: 700 }}>
                      Darstellung & Daten
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <Button 
                      variant="outlined" 
                      onClick={handleThemeChange}
                      startIcon={<Palette size={20} />}
                      sx={{ 
                        borderRadius: 3,
                        borderColor: 'rgba(245, 158, 11, 0.3)',
                        color: '#F59E0B',
                        fontWeight: 600,
                        py: 1.5,
                        '&:hover': {
                          borderColor: '#F59E0B',
                          backgroundColor: 'rgba(245, 158, 11, 0.1)',
                        }
                      }}
                    >
                      {theme === 'light' ? 'Dunkles Theme aktivieren' : 'Helles Theme aktivieren'}
                    </Button>

                    <Button 
                      variant="outlined" 
                      onClick={handleExportData}
                      disabled={loading}
                      startIcon={loading ? <CircularProgress size={20} /> : <Download size={20} />}
                      sx={{ 
                        borderRadius: 3,
                        borderColor: 'rgba(245, 158, 11, 0.3)',
                        color: '#F59E0B',
                        fontWeight: 600,
                        py: 1.5,
                        '&:hover': {
                          borderColor: '#F59E0B',
                          backgroundColor: 'rgba(245, 158, 11, 0.1)',
                        }
                      }}
                    >
                      {loading ? 'Exportiere...' : 'Meine Daten als JSON herunterladen'}
                    </Button>

                    {exportSuccess && (
                      <Alert severity="success" sx={{ borderRadius: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CheckCircle size={20} />
                          Datenexport erfolgreich!
                        </Box>
                      </Alert>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </motion.div>

            {/* Abonnement kündigen */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 2.0 }}
            >
              <Card sx={{ 
                mb: 4,
                background: 'rgba(255, 255, 255, 0.1)', 
                backdropFilter: 'blur(20px)',
                borderRadius: 3, 
                boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                    <Box sx={{ 
                      width: 48, 
                      height: 48, 
                      borderRadius: '12px', 
                      background: 'linear-gradient(135deg, #F59E0B, #D97706)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)', 
                      color: '#fff'
                    }}>
                      <DollarSign size={24} />
                    </Box>
                    <Typography variant="h5" sx={{ color: '#F59E0B', fontWeight: 700 }}>
                      Abonnement verwalten
                    </Typography>
                  </Box>

                  <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', mb: 3 }}>
                    Verwalte dein Premium-Abonnement und kündige es bei Bedarf.
                  </Typography>

                  <Box sx={{ 
                    p: 3, 
                    mb: 3, 
                    borderRadius: 3, 
                    background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(217, 119, 6, 0.1))',
                    border: '1px solid rgba(245, 158, 11, 0.2)'
                  }}>
                    <Typography variant="h6" sx={{ color: '#F59E0B', fontWeight: 600, mb: 1 }}>
                      Aktuelles Abonnement: {userSubscription?.packageId?.toUpperCase() || 'FREE'}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mb: 2 }}>
                      {userSubscription?.packageId === 'free' && (
                        <>
                          • Grundfunktionen<br/>
                          • Mondkalender<br/>
                          • Community-Zugang<br/>
                          • Basis-Matching
                        </>
                      )}
                      {userSubscription?.packageId === 'basic' && (
                        <>
                          • Human Design Chart<br/>
                          • Vollständiger Mondkalender<br/>
                          • Community-Zugang<br/>
                          • Bis zu 3 Profilbilder
                        </>
                      )}
                      {userSubscription?.packageId === 'premium' && (
                        <>
                          • Unbegrenzte Chart-Berechnungen<br/>
                          • Erweiterte Readings mit AI<br/>
                          • PDF-Integration für detaillierte Analysen<br/>
                          • Prioritäts-Support
                        </>
                      )}
                      {userSubscription?.packageId === 'vip' && (
                        <>
                          • Alle Premium-Features<br/>
                          • Persönlicher Coach<br/>
                          • Exklusive Events<br/>
                          • 24/7 VIP-Support
                        </>
                      )}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#F59E0B', fontWeight: 500 }}>
                      {userSubscription?.packageId === 'free' ? (
                        'Upgrade für erweiterte Features'
                      ) : (
                        `Nächste Abrechnung: ${new Date(userSubscription?.endDate || '').toLocaleDateString('de-DE')}`
                      )}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {userSubscription?.packageId === 'free' ? (
                      <Button 
                        variant="contained" 
                        component={Link}
                        href="/upgrade"
                        startIcon={<Sparkles size={20} />}
                        sx={{ 
                          borderRadius: 3,
                          background: 'linear-gradient(45deg, #F59E0B, #D97706)',
                          color: 'white',
                          fontWeight: 600,
                          py: 1.5,
                          '&:hover': {
                            background: 'linear-gradient(45deg, #D97706, #B45309)'
                          }
                        }}
                      >
                        Jetzt upgraden
                      </Button>
                    ) : (
                      <Button 
                        variant="outlined" 
                        component={Link}
                        href="/pricing"
                        startIcon={<DollarSign size={20} />}
                        sx={{ 
                          borderRadius: 3,
                          borderColor: 'rgba(245, 158, 11, 0.3)',
                          color: '#F59E0B',
                          fontWeight: 600,
                          py: 1.5,
                          '&:hover': {
                            borderColor: '#F59E0B',
                            backgroundColor: 'rgba(245, 158, 11, 0.1)',
                          }
                        }}
                      >
                        Abonnement ändern
                      </Button>
                    )}

                    {userSubscription?.packageId !== 'free' && (
                      <Button 
                        variant="contained" 
                        onClick={handleCancelSubscription}
                        disabled={loading}
                        startIcon={loading ? <CircularProgress size={20} /> : <DollarSign size={20} />}
                        sx={{ 
                          borderRadius: 3, 
                          background: 'linear-gradient(45deg, #EF4444, #DC2626)', 
                          color: '#fff', 
                          fontWeight: 700, 
                          fontSize: 16, 
                          py: 1.5,
                          px: 4,
                          boxShadow: '0 8px 25px rgba(239, 68, 68, 0.3)',
                          '&:hover': {
                            background: 'linear-gradient(45deg, #DC2626, #B91C1C)',
                            boxShadow: '0 12px 35px rgba(239, 68, 68, 0.4)',
                          },
                          '&:disabled': { 
                            opacity: 0.7,
                            background: 'linear-gradient(45deg, #EF4444, #DC2626)'
                          } 
                        }}
                      >
                        {loading ? 'Kündige...' : 'Abonnement kündigen'}
                      </Button>
                    )}

                    {cancelSubscriptionSuccess && (
                      <Alert severity="info" sx={{ borderRadius: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CheckCircle size={20} />
                          Abonnement erfolgreich gekündigt! Du behältst den Zugang bis zum Ende der aktuellen Abrechnungsperiode.
                        </Box>
                      </Alert>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </motion.div>

            {/* Account löschen */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 2.2 }}
            >
              <Card sx={{ 
                background: 'rgba(255, 255, 255, 0.1)', 
                backdropFilter: 'blur(20px)',
                borderRadius: 3, 
                boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                    <Box sx={{ 
                      width: 48, 
                      height: 48, 
                      borderRadius: '12px', 
                      background: 'linear-gradient(135deg, #EF4444, #DC2626)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)', 
                      color: '#fff'
                    }}>
                      <Trash2 size={24} />
                    </Box>
                    <Typography variant="h5" sx={{ color: '#EF4444', fontWeight: 700 }}>
                      Account löschen
                    </Typography>
                  </Box>

                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mb: 3 }}>
                    Diese Aktion kann nicht rückgängig gemacht werden. Alle deine Daten werden unwiderruflich gelöscht.
                  </Typography>

                  <Button 
                    variant="contained" 
                    color="error"
                    onClick={handleDeleteAccount}
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={20} /> : <Trash2 size={20} />}
                    sx={{ 
                      borderRadius: 3, 
                      background: 'linear-gradient(45deg, #EF4444, #DC2626)', 
                      color: '#fff', 
                      fontWeight: 700, 
                      fontSize: 16, 
                      py: 1.5,
                      px: 4,
                      boxShadow: '0 8px 25px rgba(239, 68, 68, 0.3)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #DC2626, #B91C1C)',
                        boxShadow: '0 12px 35px rgba(239, 68, 68, 0.4)',
                      },
                      '&:disabled': { 
                        opacity: 0.7,
                        background: 'linear-gradient(45deg, #EF4444, #DC2626)'
                      } 
                    }}
                  >
                    {loading ? 'Lösche...' : 'Account unwiderruflich löschen'}
                  </Button>

                  {deleteSuccess && (
                    <Alert severity="warning" sx={{ mt: 2, borderRadius: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CheckCircle size={20} />
                        Account wird gelöscht...
                      </Box>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Fehleranzeige */}
            {error && (
              <Alert severity="error" sx={{ mt: 3, borderRadius: 3 }}>
                {error}
              </Alert>
            )}
          </motion.div>
        </Container>
      </Box>
    </AccessControl>
  );
}
