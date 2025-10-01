"use client";
import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, Button, Container, Tabs, Tab, CircularProgress } from '@mui/material';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import AccessControl from '../../components/AccessControl';
import { UserSubscription } from '../../lib/subscription/types';
import { SubscriptionService } from '../../lib/subscription/subscriptionService';
import AdminAuditDashboard from '@/components/AdminAuditDashboard';
import { logAdminEvent } from '@/lib/audit/auditLogger';
import { 
  Settings, 
  Users, 
  BarChart3, 
  Upload, 
  ArrowRight,
  Star,
  Database,
  Shield,
  Bell,
  FileText,
  Download,
  Activity,
  Key,
  Monitor
} from 'lucide-react';
import AnimatedStars from '../../components/AnimatedStars';

function AdminContent() {
  const [activeTab, setActiveTab] = useState(0);

  // Audit-Log für Admin-Zugriff
  React.useEffect(() => {
    logAdminEvent('admin_dashboard_access', 'admin_dashboard', undefined, {
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent
    });
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    logAdminEvent('admin_tab_change', 'admin_dashboard', undefined, {
      tabIndex: newValue,
      tabName: newValue === 0 ? 'dashboard' : newValue === 1 ? 'audit' : 'unknown'
    });
  };

  const adminFeatures = [
    {
      title: "Reading-Management",
      description: "Verwalte alle Readings, Beziehungsanalysen und Dating-Beratungen",
      icon: <FileText size={24} />,
      href: "/admin/readings"
    },
    {
      title: "Benutzerverwaltung",
      description: "Verwalte alle Benutzer und deren Berechtigungen",
      icon: <Users size={24} />,
      href: "/admin/users"
    },
    {
      title: "Dashboard",
      description: "Übersicht über alle wichtigen Metriken",
      icon: <BarChart3 size={24} />,
      href: "/admin/dashboard"
    },
    {
      title: "Datenbank-Management",
      description: "Verwalte SQLite-Datenbank und Backup",
      icon: <Database size={24} />,
      href: "/admin/database"
    },
    {
      title: "Sicherheit & Logs",
      description: "Überwache Sicherheitsereignisse und Logs",
      icon: <Shield size={24} />,
      href: "/admin/security"
    },
    {
      title: "Benachrichtigungen",
      description: "Verwalte System-Benachrichtigungen",
      icon: <Bell size={24} />,
      href: "/admin/notifications"
    },
    {
      title: "Content-Management",
      description: "Verwalte Texte, Stories und Inhalte",
      icon: <FileText size={24} />,
      href: "/admin/content"
    },
    {
      title: "Datei-Upload",
      description: "Verwalte und lade Dateien hoch",
      icon: <Upload size={24} />,
      href: "/admin/upload"
    },
    {
      title: "System-Monitoring",
      description: "Überwache System-Performance und Status",
      icon: <Monitor size={24} />,
      href: "/admin/monitoring"
    },
    {
      title: "API-Management",
      description: "Verwalte API-Keys und Endpunkte",
      icon: <Key size={24} />,
      href: "/admin/api"
    },
    {
      title: "Backup & Export",
      description: "Erstelle Backups und exportiere Daten",
      icon: <Download size={24} />,
      href: "/admin/backup"
    },
    {
      title: "Aktivitäts-Logs",
      description: "Verfolge alle Benutzer-Aktivitäten",
      icon: <Activity size={24} />,
      href: "/admin/activity"
    },
    {
      title: "System-Einstellungen",
      description: "Konfiguriere die App-Einstellungen",
      icon: <Settings size={24} />,
      href: "/admin/settings"
    }
  ];

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: `
        radial-gradient(ellipse at top, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
        radial-gradient(ellipse at bottom, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
        linear-gradient(135deg, #0f0f23 0%, #1a1a2e 25%, #16213e 50%, #0f3460 75%, #533483 100%)
      `,
      position: 'relative',
      overflow: 'hidden'
    }}>
      <AnimatedStars />
      
      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 2, py: 8, px: 2 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Box textAlign="center" mb={6}>
            <motion.div
              animate={{
                textShadow: [
                  '0 0 30px rgba(255, 255, 255, 0.8), 0 0 60px rgba(255, 255, 255, 0.6), 0 0 90px rgba(255, 255, 255, 0.4)',
                  '0 0 40px rgba(255, 255, 255, 1), 0 0 80px rgba(255, 255, 255, 0.8), 0 0 120px rgba(255, 255, 255, 0.6)',
                  '0 0 30px rgba(255, 255, 255, 0.8), 0 0 60px rgba(255, 255, 255, 0.6), 0 0 90px rgba(255, 255, 255, 0.4)'
                ]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Typography
                variant="h1"
                sx={{
                  color: 'white',
                  fontWeight: 900,
                  mb: 4,
                  fontSize: { xs: '2.5rem', md: '4rem' },
                  filter: 'drop-shadow(0 0 20px rgba(255, 255, 255, 0.8))'
                }}
              >
                <Star size={48} style={{ marginRight: '16px', display: 'inline-block' }} />
                Admin Dashboard
                <Star size={48} style={{ marginLeft: '16px', display: 'inline-block' }} />
              </Typography>
            </motion.div>
            
            <Typography
              variant="h5"
              sx={{
                color: 'rgba(255,255,255,0.9)',
                mb: 6,
                maxWidth: 600,
                mx: 'auto',
                lineHeight: 1.6,
                fontSize: { xs: '1.2rem', md: '1.4rem' },
                textShadow: '0 2px 10px rgba(0,0,0,0.3)'
              }}
            >
              Verwalte deine HD App mit modernen Admin-Tools und Echtzeit-Analytics
            </Typography>
          </Box>

          <Box sx={{ borderBottom: 1, borderColor: 'rgba(255,255,255,0.2)', mb: 4 }}>
            <Tabs 
              value={activeTab} 
              onChange={handleTabChange} 
              aria-label="admin tabs"
              sx={{
                '& .MuiTab-root': {
                  color: 'rgba(255,255,255,0.7)',
                  '&.Mui-selected': {
                    color: '#FFD700'
                  }
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: '#FFD700'
                }
              }}
            >
              <Tab label="Dashboard" />
              <Tab label="Audit-Logs" />
            </Tabs>
          </Box>

          {activeTab === 0 && (
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, 
              gap: 4,
            maxWidth: '1400px',
            mx: 'auto',
            px: 2
          }}>
            {adminFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                style={{ width: '100%' }}
              >
                <Paper
                  component={Link}
                  href={feature.href}
                  sx={{
                    p: 4,
                    borderRadius: 4,
                    background: 'rgba(255, 255, 255, 0.08)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                    textDecoration: 'none',
                    color: 'inherit',
                    transition: 'all 0.3s ease',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 16px 48px rgba(0, 0, 0, 0.4)',
                      background: 'rgba(255, 255, 255, 0.12)',
                      border: '1px solid rgba(255, 255, 255, 0.3)'
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: 3,
                        background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
                        color: 'white',
                        mr: 3,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {feature.icon}
                    </Box>
                    <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                      {feature.title}
                    </Typography>
                  </Box>
                  
                  <Typography
                    variant="body1"
                    sx={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      mb: 3,
                      lineHeight: 1.6
                    }}
                  >
                    {feature.description}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', color: '#8B5CF6' }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, mr: 1 }}>
                      Öffnen
                    </Typography>
                    <ArrowRight size={16} />
                  </Box>
                </Paper>
              </motion.div>
            ))}
            </Box>
          )}

          {activeTab === 1 && (
            <AdminAuditDashboard />
          )}

          <Box sx={{ textAlign: 'center', mt: 8 }}>
            <Button 
              component={Link} 
              href="/" 
              variant="contained"
              size="large"
              sx={{ 
                background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
                color: 'white',
                px: 6,
                py: 2,
                fontSize: '1.1rem',
                borderRadius: 3,
                textTransform: 'none',
                boxShadow: '0 8px 32px rgba(139, 92, 246, 0.4)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #7C3AED 0%, #DB2777 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 12px 40px rgba(139, 92, 246, 0.6)',
                }
              }}
            >
              Zurück zur Startseite
              <ArrowRight size={20} style={{ marginLeft: 8 }} />
            </Button>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
}

// Hauptkomponente mit ProtectedRoute
export default function AdminPage() {
  const router = useRouter();
  const [userSubscription, setUserSubscription] = useState<UserSubscription | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Authentication check
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        
        if (!token || !userId) {
          console.log('🔒 Keine Authentifizierung - leite zur Login-Seite weiter');
          router.push('/login');
          return;
        }
        
        setIsAuthenticated(true);
        await loadUserSubscription(userId);
      } catch (error) {
        console.error('Fehler bei der Authentifizierung:', error);
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, [router]);

  const loadUserSubscription = async (userId: string) => {
    try {
      const subscription = await SubscriptionService.getUserSubscription(userId);
      setUserSubscription(subscription);
    } catch (error) {
      console.error('Fehler beim Laden der Subscription:', error);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)'
      }}>
        <CircularProgress size={60} sx={{ color: '#FFD700' }} />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <AccessControl 
      path="/admin" 
      userSubscription={userSubscription} 
      onUpgrade={() => router.push('/pricing')}
    >
      <AdminContent />
    </AccessControl>
  );
}
