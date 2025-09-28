"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/api/auth';
import { SupabaseService } from '@/lib/services/supabaseService';
import { supabase } from '@/lib/supabase/client';
import { useLoadingState } from '@/lib/services/loadingService';
import { 
  DashboardData, 
  Activity, 
  Notification, 
  DashboardContentProps,
  UserProfile
} from '@/types/dashboard.types';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import InteractiveChart from '@/components/dashboard/InteractiveChart';
// import DashboardWidget from '@/components/dashboard/DashboardWidget';
import AchievementSystem from '@/components/dashboard/AchievementSystem';
import LiveDashboard from '@/components/dashboard/LiveDashboard';
import AdvancedAnalytics from '@/components/dashboard/AdvancedAnalytics';
import MobileDashboard from '@/components/dashboard/MobileDashboard';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Chip, 
  Avatar, 
  LinearProgress,
  IconButton,
  Tooltip,
  Slide,
  Zoom,
  Badge,
  Button,
  Tabs,
  Tab,
  Switch,
  FormControlLabel
} from '@mui/material';
import { 
  TrendingUp, 
  Star, 
  Moon, 
  Heart, 
  Users, 
  Calendar,
  Zap,
  Crown,
  Sparkles,
  Target,
  Activity as ActivityIcon,
  Bell,
  RotateCcw,
  ArrowRight,
  ChevronRight,
  Settings,
  Layout,
  Trophy,
  BarChart3,
  MessageCircle,
  BookOpen,
  UserCheck,
  Globe,
  Clock,
  LogOut
} from 'lucide-react';
import styles from './dashboard.module.css';

const DashboardContent: React.FC<DashboardContentProps> = ({ className = '' }) => {
  const { user } = useAuth();
  const { isLoading, error, setLoading, setError } = useLoadingState('dashboard');

  // Funktion zur Auswahl des passenden Icons basierend auf der Aktivitätskategorie
  const getActivityIcon = (activity: Activity) => {
    const category = activity.category || activity.type;
    
    switch (category.toLowerCase()) {
      case 'moon':
      case 'mondkalender':
        return <Moon size={16} />;
      case 'dating':
      case 'match':
        return <Heart size={16} />;
      case 'community':
      case 'chat':
        return <MessageCircle size={16} />;
      case 'reading':
      case 'coaching':
        return <BookOpen size={16} />;
      case 'profile':
      case 'user':
        return <UserCheck size={16} />;
      case 'social':
      case 'network':
        return <Globe size={16} />;
      case 'notification':
      case 'alert':
        return <Bell size={16} />;
      case 'time':
      case 'schedule':
        return <Clock size={16} />;
      case 'system':
        return <Settings size={16} />;
      default:
        return <ActivityIcon size={16} />;
    }
  };
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [showAdvancedFeatures, setShowAdvancedFeatures] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const loadDashboardData = useCallback(async () => {
    if (!user?.id || typeof user.id !== 'string') return;
    
    setLoading(true);
    setError('');

    try {
      // Prüfe Supabase-Verbindung zuerst
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Supabase-Session-Fehler:', sessionError);
        setError('Verbindungsfehler zur Datenbank. Bitte versuchen Sie es später erneut.');
        return;
      }
      
      if (!session) {
        console.warn('Keine aktive Session gefunden');
        setError('Sie sind nicht angemeldet. Bitte melden Sie sich erneut an.');
        return;
      }

      // Echte API-Aufrufe über SupabaseService
      const dashboardResponse = await SupabaseService.getDashboardData(user.id);
      
      if (dashboardResponse.success && dashboardResponse.data) {
        const data: DashboardData = {
          stats: {
            moonEntries: dashboardResponse.data.stats?.moonEntries || 0,
            readings: dashboardResponse.data.stats?.readings || 0,
            matches: dashboardResponse.data.stats?.matches || 0,
            communityActivity: dashboardResponse.data.stats?.communityActivity || 0
          },
          recentActivities: dashboardResponse.data.activities || [],
          notifications: dashboardResponse.data.notifications || [],
          userProfile: user as unknown as UserProfile,
          trends: {
            moonEntries: [],
            readings: [],
            matches: [],
            communityActivity: []
          }
        };

        setDashboardData(data);
        setLastRefresh(new Date());
      } else {
        // Fallback bei API-Fehlern
        const fallbackStats = {
          moonEntries: 0,
          readings: 0,
          matches: 0,
          communityActivity: 0
        };

        const data: DashboardData = {
          stats: fallbackStats,
          recentActivities: [],
          notifications: [],
          userProfile: user as unknown as UserProfile,
          trends: {
            moonEntries: [],
            readings: [],
            matches: [],
            communityActivity: []
          }
        };

        setDashboardData(data);
        setLastRefresh(new Date());
        
        if (dashboardResponse.error) {
          console.warn('⚠️ Dashboard-API-Fehler, verwende Fallback-Daten:', dashboardResponse.error);
        }
      }
    } catch (error) {
      console.error('❌ Fehler beim Laden der Dashboard-Daten:', error);
      
      // Spezifische Fehlerbehandlung für NetworkError
      if (error instanceof TypeError && error.message.includes('fetch')) {
        setError('Netzwerkfehler: Bitte überprüfen Sie Ihre Internetverbindung und versuchen Sie es erneut.');
      } else if (error instanceof Error && error.message.includes('NetworkError')) {
        setError('Netzwerkfehler: Die Verbindung zum Server konnte nicht hergestellt werden.');
      } else if (error instanceof Error && error.message.includes('Failed to fetch')) {
        setError('Verbindungsfehler: Der Server ist nicht erreichbar. Bitte versuchen Sie es später erneut.');
      } else {
        setError('Fehler beim Laden der Dashboard-Daten. Bitte versuche es später erneut.');
      }
      
      // Fallback-Daten bei kritischen Fehlern
      const fallbackStats = {
        moonEntries: 0,
        readings: 0,
        matches: 0,
        communityActivity: 0
      };

      // Beispiel-Aktivitäten für Demo-Zwecke
      const fallbackActivities: Activity[] = [
        {
          id: 'demo-1',
          type: 'moon',
          category: 'moon',
          title: 'Mondkalender-Eintrag erstellt',
          description: 'Neuer Eintrag im Mondkalender hinzugefügt',
          timestamp: new Date().toISOString()
        },
        {
          id: 'demo-2',
          type: 'reading',
          category: 'reading',
          title: 'Reading durchgeführt',
          description: 'Human Design Reading abgeschlossen',
          timestamp: new Date(Date.now() - 3600000).toISOString()
        }
      ];

      const data: DashboardData = {
        stats: fallbackStats,
        recentActivities: fallbackActivities,
        notifications: [],
        userProfile: user as unknown as UserProfile,
        trends: {
          moonEntries: [],
          readings: [],
          matches: [],
          communityActivity: []
        }
      };

      setDashboardData(data);
      setLastRefresh(new Date());
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]); // ✅ FIX: Nur user.id als Dependency, um Dauerschleife zu vermeiden

  // Dashboard-Daten laden
  useEffect(() => {
    if (user?.id) {
      loadDashboardData();
    }
  }, [user?.id, loadDashboardData]); // ✅ FIX: Jetzt ist loadDashboardData stabil

  // Spektakulärer Loading-Zustand
  if (isLoading) {
    return (
      <Box className={styles.loadingContainer}>
        <Box className={styles.loadingContent}>
            <div className={styles.loadingSpinner}>
              <Sparkles className={styles.sparkleIcon} />
              <div className={styles.spinner}></div>
      </div>
            <Typography variant="h4" className={styles.loadingTitle}>
              Dein Dashboard wird vorbereitet...
            </Typography>
            <Typography variant="body1" className={styles.loadingSubtext}>
              Lade deine persönlichen Human Design Daten
            </Typography>
            <LinearProgress 
              className={styles.loadingProgress} 
              color="secondary" 
            />
          </Box>
      </Box>
    );
  }

  return (
    <Box className={`${styles.dashboardContainer} ${className}`}>
      <Box className={styles.container}>
        {/* Spektakulärer Header */}
        <Slide direction="down" in={true} timeout={800}>
          <Box className={styles.header}>
            <Box className={styles.headerTop}>
              <Box className={styles.headerLeft}>
                <Typography variant="h3" className={styles.headerTitle}>
                  <Crown className={styles.crownIcon} />
                  Dein Human Design Dashboard
                </Typography>
                <Typography variant="h6" className={styles.headerSubtitle}>
                  Willkommen zurück, <span className={styles.userName}>
                    {(() => {
                      const firstName = dashboardData?.userProfile?.firstName || user?.firstName;
                      if (firstName && typeof firstName === 'string') return firstName;
                      if (user?.email && typeof user.email === 'string') {
                        return user.email.split('@')[0];
                      }
                      return 'Benutzer';
                    })()}
                  </span>! ✨
                </Typography>
              </Box>
              <Box className={styles.headerRight}>
                <Tooltip title="Dashboard aktualisieren">
                  <IconButton 
                    className={styles.refreshButton}
                    onClick={() => loadDashboardData()}
                    disabled={isLoading}
                  >
                    <RotateCcw className={isLoading ? styles.spinning : ''} />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Abmelden">
                  <Link href="/logout">
                    <IconButton 
                      className={styles.logoutButton}
                      sx={{ 
                        ml: 1,
                        color: '#ff6b6b',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 107, 107, 0.1)',
                          color: '#ff5252'
                        }
                      }}
                    >
                      <LogOut size={20} />
                    </IconButton>
                  </Link>
                </Tooltip>
                <Chip 
                  icon={<Crown size={16} />}
                  label="Premium"
                  className={styles.premiumChip}
                  color="secondary"
                />
              </Box>
            </Box>
            
            <Typography variant="body2" className={styles.lastUpdate}>
            Letzte Aktualisierung: {lastRefresh.toLocaleString('de-DE')}
            </Typography>

          {error && (
            <Card className={styles.errorCard}>
                  <CardContent>
                    <Box className={styles.errorContent}>
                      <Typography variant="h6" color="error">
                        ⚠️ Fehler beim Laden der Daten
                      </Typography>
                      <Typography variant="body2" className={styles.errorText}>
                        {error}
                      </Typography>
                      <Button 
                        variant="contained" 
                        color="error"
                        onClick={() => loadDashboardData()}
                        disabled={isLoading}
                        startIcon={<RotateCcw />}
                      >
                        {isLoading ? 'Lädt...' : 'Erneut versuchen'}
                      </Button>
                </Box>
              </CardContent>
            </Card>
        )}
          </Box>
        </Slide>

        {/* Spektakuläre Statistik-Karten */}
        {dashboardData && (
          <Slide direction="up" in={true} timeout={1000}>
            <Grid container spacing={3} className={styles.statsGrid}>
              <Grid item xs={12} sm={6} md={3}>
                <Zoom in={true} timeout={1200}>
                  <Card className={styles.statCard}>
                    <CardContent className={styles.statContent}>
                      <Box className={styles.statHeader}>
                        <Avatar className={styles.statAvatar}>
                          <Moon className={styles.statIcon} />
                        </Avatar>
                        <Box className={styles.statTrend}>
                          <TrendingUp className={styles.trendIcon} />
                          <Typography variant="caption">+12%</Typography>
                        </Box>
                      </Box>
                      <Typography variant="h3" className={styles.statNumber}>
                        {dashboardData.stats.moonEntries}
                      </Typography>
                      <Typography variant="body2" className={styles.statLabel}>
                        Mondkalender-Einträge
                      </Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={Math.min((dashboardData.stats.moonEntries / 30) * 100, 100)}
                        className={styles.statProgress}
                      />
                    </CardContent>
                  </Card>
                </Zoom>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Zoom in={true} timeout={1400}>
                  <Card className={styles.statCard}>
                    <CardContent className={styles.statContent}>
                      <Box className={styles.statHeader}>
                        <Avatar className={styles.statAvatar}>
                          <Star className={styles.statIcon} />
                        </Avatar>
                        <Box className={styles.statTrend}>
                          <TrendingUp className={styles.trendIcon} />
                          <Typography variant="caption">+8%</Typography>
                        </Box>
                      </Box>
                      <Typography variant="h3" className={styles.statNumber}>
                        {dashboardData.stats.readings}
                      </Typography>
                      <Typography variant="body2" className={styles.statLabel}>
                        Lesungen
                      </Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={Math.min((dashboardData.stats.readings / 20) * 100, 100)}
                        className={styles.statProgress}
                      />
                    </CardContent>
                  </Card>
                </Zoom>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Zoom in={true} timeout={1600}>
                  <Card className={styles.statCard}>
                    <CardContent className={styles.statContent}>
                      <Box className={styles.statHeader}>
                        <Avatar className={styles.statAvatar}>
                          <Heart className={styles.statIcon} />
                        </Avatar>
                        <Box className={styles.statTrend}>
                          <TrendingUp className={styles.trendIcon} />
                          <Typography variant="caption">+25%</Typography>
                        </Box>
                      </Box>
                      <Typography variant="h3" className={styles.statNumber}>
                        {dashboardData.stats.matches}
                      </Typography>
                      <Typography variant="body2" className={styles.statLabel}>
                        Matches
                      </Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={Math.min((dashboardData.stats.matches / 10) * 100, 100)}
                        className={styles.statProgress}
                      />
                    </CardContent>
                  </Card>
                </Zoom>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Zoom in={true} timeout={1800}>
                  <Card className={styles.statCard}>
                    <CardContent className={styles.statContent}>
                      <Box className={styles.statHeader}>
                        <Avatar className={styles.statAvatar}>
                          <Users className={styles.statIcon} />
                        </Avatar>
                        <Box className={styles.statTrend}>
                          <TrendingUp className={styles.trendIcon} />
                          <Typography variant="caption">+15%</Typography>
                        </Box>
                      </Box>
                      <Typography variant="h3" className={styles.statNumber}>
                        {dashboardData.stats.communityActivity}
                      </Typography>
                      <Typography variant="body2" className={styles.statLabel}>
                        Community-Aktivität
                      </Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={Math.min((dashboardData.stats.communityActivity / 50) * 100, 100)}
                        className={styles.statProgress}
                      />
                    </CardContent>
                  </Card>
                </Zoom>
              </Grid>
            </Grid>
          </Slide>
        )}

        {/* Spektakulärer Hauptinhalt */}
        {dashboardData && (
          <Slide direction="up" in={true} timeout={2000}>
            <Grid container spacing={3} className={styles.mainContent}>
              {/* Aktivitäten-Sektion */}
              <Grid item xs={12} lg={8}>
                <Card className={styles.activityCard}>
                    <CardContent>
                      <Box className={styles.cardHeader}>
                        <Box className={styles.cardTitle}>
                          <ActivityIcon className={styles.cardIcon} />
                          <Typography variant="h5">Letzte Aktivitäten</Typography>
                        </Box>
                        <Button 
                          variant="outlined" 
                          size="small"
                          endIcon={<ArrowRight />}
                          className={styles.viewAllButton}
                        >
                          Alle anzeigen
                        </Button>
                      </Box>
                      
              {dashboardData.recentActivities.length > 0 ? (
                        <Box className={styles.activitiesList}>
                          {dashboardData.recentActivities.map((activity: Activity) => (
                            <Box key={activity.id} className={styles.activityItem}>
                                <Avatar className={styles.activityAvatar}>
                                  {getActivityIcon(activity)}
                                </Avatar>
                                <Box className={styles.activityContent}>
                                  <Typography variant="subtitle1" className={styles.activityTitle}>
                                    {activity.title}
                                  </Typography>
                                  <Typography variant="body2" className={styles.activityDescription}>
                                    {activity.description}
                                  </Typography>
                                  <Typography variant="caption" className={styles.activityTime}>
                                    {activity.timestamp}
                                  </Typography>
                                </Box>
                                <ChevronRight className={styles.activityArrow} />
                              </Box>
                          ))}
                        </Box>
                      ) : (
                        <Box className={styles.emptyState}>
                          <Box className={styles.emptyIcon}>
                            <Target className={styles.emptyIconSvg} />
                          </Box>
                          <Typography variant="h6" className={styles.emptyTitle}>
                            Beginne deine Human Design Reise!
                          </Typography>
                          <Typography variant="body2" className={styles.emptyDescription}>
                            Erstelle deinen ersten Mondkalender-Eintrag oder führe ein Reading durch.
                          </Typography>
                          <Box className={styles.emptyActions}>
                            <Button 
                              variant="contained" 
                              startIcon={<Moon />}
                              className={styles.emptyActionButton}
                              component={Link}
                              href="/mondkalender"
                            >
                              Mondkalender starten
                            </Button>
                            <Button 
                              variant="outlined" 
                              startIcon={<Star />}
                              className={styles.emptyActionButton}
                              component={Link}
                              href="/reading"
                            >
                              Reading durchführen
                            </Button>
                          </Box>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
              </Grid>

              {/* Sidebar */}
              <Grid item xs={12} lg={4}>
                <Box className={styles.sidebar}>
                  {/* Interaktive Charts */}
                  <InteractiveChart
                      title="Aktivitäts-Übersicht"
                      type="bar"
                      data={[
                        {
                          name: 'Mondkalender',
                          value: dashboardData.stats.moonEntries,
                          color: '#667eea',
                          icon: <Moon size={16} />,
                          trend: 'up',
                          trendValue: 12
                        },
                        {
                          name: 'Lesungen',
                          value: dashboardData.stats.readings,
                          color: '#764ba2',
                          icon: <Star size={16} />,
                          trend: 'up',
                          trendValue: 8
                        },
                        {
                          name: 'Matches',
                          value: dashboardData.stats.matches,
                          color: '#f093fb',
                          icon: <Heart size={16} />,
                          trend: 'up',
                          trendValue: 25
                        },
                        {
                          name: 'Community',
                          value: dashboardData.stats.communityActivity,
                          color: '#4ecdc4',
                          icon: <Users size={16} />,
                          trend: 'up',
                          trendValue: 15
                        }
                      ]}
                    />

                  {/* Schnellzugriff */}
                  <Card className={styles.quickAccessCard}>
                      <CardContent>
                        <Box className={styles.cardHeader}>
                          <Box className={styles.cardTitle}>
                            <Zap className={styles.cardIcon} />
                            <Typography variant="h6">Schnellzugriff</Typography>
                          </Box>
                        </Box>
                        
                        <Box className={styles.quickAccessList}>
                          <Button 
                            variant="contained" 
                            fullWidth
                            startIcon={<Moon />}
                            className={styles.quickAccessButton}
                            component={Link}
                            href="/mondkalender"
                          >
                            Mondkalender
                          </Button>
                          <Button 
                            variant="contained" 
                            fullWidth
                            startIcon={<Heart />}
                            className={styles.quickAccessButton}
                            component={Link}
                            href="/dating"
                          >
                            Dating
                          </Button>
                          <Button 
                            variant="outlined" 
                            fullWidth
                            startIcon={<Users />}
                            className={styles.quickAccessButton}
                            component={Link}
                            href="/community"
                          >
                            Community
                          </Button>
                          <Button 
                            variant="outlined" 
                            fullWidth
                            startIcon={<Calendar />}
                            className={styles.quickAccessButton}
                            component={Link}
                            href="/coaching"
                          >
                            Coaching
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>

                  {/* Benachrichtigungen */}
                  <Card className={styles.notificationsCard}>
                      <CardContent>
                        <Box className={styles.cardHeader}>
                          <Box className={styles.cardTitle}>
                            <Bell className={styles.cardIcon} />
                            <Typography variant="h6">Benachrichtigungen</Typography>
                          </Box>
                          <Badge badgeContent={dashboardData.notifications.length} color="secondary">
                            <Bell className={styles.notificationBadge} />
                          </Badge>
                        </Box>
                        
                        {dashboardData.notifications.length > 0 ? (
                          <Box className={styles.notificationsList}>
                            {dashboardData.notifications.map((notification: Notification) => (
                              <Box key={notification.id} className={styles.notificationItem}>
                                  <Avatar className={styles.notificationAvatar}>
                                    <Bell className={styles.notificationIcon} />
                                  </Avatar>
                                  <Box className={styles.notificationContent}>
                                    <Typography variant="subtitle2" className={styles.notificationTitle}>
                                      {notification.message}
                                    </Typography>
                                    <Typography variant="body2" className={styles.notificationMessage}>
                                      {notification.timestamp}
                                    </Typography>
                                    <Typography variant="caption" className={styles.notificationTime}>
                                      {notification.timestamp}
                                    </Typography>
                                </Box>
                              </Box>
                          ))}
                          </Box>
                        ) : (
                          <Box className={styles.emptyNotifications}>
                            <Bell className={styles.emptyNotificationIcon} />
                            <Typography variant="body2" className={styles.emptyNotificationText}>
                    Keine neuen Benachrichtigungen
                            </Typography>
                            <Typography variant="caption" className={styles.emptyNotificationSubtext}>
                              Du wirst benachrichtigt, wenn es Neuigkeiten gibt
                            </Typography>
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                </Box>
              </Grid>
            </Grid>
          </Slide>
        )}

        {/* Advanced Features Toggle */}
        <Box className={styles.advancedToggle}>
          <FormControlLabel
            control={
              <Switch
                checked={showAdvancedFeatures}
                onChange={(e) => setShowAdvancedFeatures(e.target.checked)}
                color="secondary"
              />
            }
            label="Erweiterte Features aktivieren"
          />
        </Box>

        {/* Advanced Features */}
        {showAdvancedFeatures && (
          <Box className={styles.advancedFeatures}>
              {/* Navigation Tabs */}
              <Card className={styles.navigationCard}>
                <Tabs
                  value={activeTab}
                  onChange={(e, newValue) => setActiveTab(newValue)}
                  className={styles.dashboardTabs}
                >
                  <Tab 
                    label="Dashboard" 
                    icon={<Layout size={16} />} 
                    className={styles.dashboardTab}
                  />
                  <Tab 
                    label="Widgets" 
                    icon={<Settings size={16} />} 
                    className={styles.dashboardTab}
                  />
                  <Tab 
                    label="Achievements" 
                    icon={<Trophy size={16} />} 
                    className={styles.dashboardTab}
                  />
                  <Tab 
                    label="Live Updates" 
                    icon={<ActivityIcon size={16} />} 
                    className={styles.dashboardTab}
                  />
                  <Tab 
                    label="Analytics" 
                    icon={<BarChart3 size={16} />} 
                    className={styles.dashboardTab}
                  />
                </Tabs>
              </Card>

              {/* Tab Content */}
              <Box className={styles.tabContent}>
                {activeTab === 0 && (
                  <Box className={styles.basicDashboard}>
                    <Typography variant="h5" className={styles.sectionTitle}>
                      Standard Dashboard
                    </Typography>
                    <Typography variant="body2" className={styles.sectionSubtitle}>
                      Dein persönliches Human Design Dashboard
                    </Typography>
                  </Box>
                )}

                {activeTab === 1 && (
                  <Box className={styles.widgetsSection}>
                    <Typography variant="h5" className={styles.sectionTitle}>
                      Personalisierte Widgets
                    </Typography>
                    <Typography variant="body2" className={styles.sectionSubtitle}>
                      Erstelle dein individuelles Dashboard
                    </Typography>
                    {/* Widget Grid würde hier implementiert werden */}
                    <Box className={styles.widgetsPlaceholder}>
                      <Typography variant="body1" className={styles.placeholderText}>
                        Widget-System wird hier implementiert
                      </Typography>
                    </Box>
                  </Box>
                )}

                {activeTab === 2 && (
                  <AchievementSystem
                      achievements={[
                        {
                          id: 'moon-master',
                          title: 'Mond-Meister',
                          description: 'Erstelle 30 Mondkalender-Einträge',
                          icon: <Moon size={20} />,
                          category: 'moon',
                          rarity: 'epic',
                          points: 100,
                          progress: 15,
                          maxProgress: 30,
                          unlocked: false,
                          requirements: ['30 Mondkalender-Einträge erstellen']
                        },
                        {
                          id: 'dating-expert',
                          title: 'Dating-Experte',
                          description: 'Finde 10 Matches',
                          icon: <Heart size={20} />,
                          category: 'dating',
                          rarity: 'rare',
                          points: 50,
                          progress: 3,
                          maxProgress: 10,
                          unlocked: false,
                          requirements: ['10 Matches finden']
                        }
                      ]}
                      userLevel={{
                        level: 5,
                        experience: 250,
                        maxExperience: 500,
                        title: 'Entdecker',
                        nextLevelTitle: 'Experte',
                        progress: 50,
                        points: 250
                      }}
                      onAchievementUnlock={(id) => console.log('Achievement unlocked:', id)}
                    />
                )}

                {activeTab === 3 && (
                  <LiveDashboard
                    onDataUpdate={(data) => console.log('Live data updated:', data)}
                    onStatsUpdate={(stats) => console.log('Live stats updated:', stats)}
                  />
                )}

                {activeTab === 4 && (
                  <AdvancedAnalytics
                    data={{
                      period: '30d',
                      metrics: {
                        totalUsers: 1250,
                        activeUsers: 890,
                        newUsers: 45,
                        retention: 78,
                        engagement: 65,
                        revenue: 12500
                      },
                      charts: {
                        userGrowth: [],
                        engagement: [],
                        revenue: [],
                        demographics: []
                      },
                      insights: [
                        {
                          id: 'insight-1',
                          title: 'Hohe Engagement-Rate',
                          description: 'Deine Benutzer sind sehr aktiv in der Community',
                          impact: 'high',
                          trend: 'up'
                        }
                      ]
                    }}
                    onFilterChange={(filters) => console.log('Filters changed:', filters)}
                    onExport={(format) => console.log('Export requested:', format)}
                  />
                )}
              </Box>
            </Box>
        )}
      </Box>
    </Box>
  );
};

// Hauptkomponente - Zugänglich für alle angemeldeten Benutzer
export default function DashboardPage() {
  return (
    <ProtectedRoute requiredPackage="free">
      <MobileDashboard>
      <DashboardContent />
      </MobileDashboard>
    </ProtectedRoute>
  );
}
