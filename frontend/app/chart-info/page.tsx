"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AccessControl from '../../components/AccessControl';
import UnifiedPageLayout from '../../components/UnifiedPageLayout';
// import { UserSubscription } from '../../lib/subscription/types'; // Entfernt - nicht mehr benötigt
// import { SubscriptionService } from '../../lib/subscription/subscriptionService'; // Entfernt - nicht mehr benötigt
import { Container, Typography, Card, CardContent, Box, Button, Paper, Chip, Grid, Tabs, Tab, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Star, 
  ArrowRight, 
  CheckCircle, 
  Zap, 
  Eye, 
  Heart, 
  Crown,
  Target,
  Moon,
  Activity
} from 'lucide-react';
import Link from 'next/link';

export default function ChartInfoPage() {
  const router = useRouter();
  const [userSubscription, setUserSubscription] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

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
      // Temporärer Fix - SubscriptionService entfernt
      // const subscription = await SubscriptionService.getUserSubscription(userId);
      const subscription = null;
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

  const chartFeatures = [
    {
      icon: <Zap size={32} />,
      title: "Energie-Typen",
      description: "Entdecke deinen einzigartigen Energie-Typ: Generator, Manifestor, Projector oder Reflector",
      color: "#f59e0b",
      details: "Jeder Typ hat eine spezifische Art, Energie zu verwenden und zu manifestieren."
    },
    {
      icon: <Eye size={32} />,
      title: "Autorität",
      description: "Lerne deine natürliche Entscheidungsmethode kennen",
      color: "#10b981",
      details: "Deine innere Autorität zeigt dir, wie du authentische Entscheidungen triffst."
    },
    {
      icon: <Heart size={32} />,
      title: "Strategie",
      description: "Finde deine optimale Lebensstrategie",
      color: "#ef4444",
      details: "Die richtige Strategie hilft dir, im Einklang mit deiner Natur zu leben."
    },
    {
      icon: <Crown size={32} />,
      title: "Profil",
      description: "Verstehe deine Lebensrolle und dein Potenzial",
      color: "#8b5cf6",
      details: "Dein Profil zeigt deine einzigartige Lebensrolle und dein Potenzial."
    }
  ];

  const humanDesignTypes = [
    {
      name: "Generator",
      percentage: "70%",
      description: "Die Lebenskraft des Planeten",
      strategy: "Warten auf die Antwort",
      authority: "Sakral-Autorität",
      color: "#10b981",
      icon: <Activity size={24} />
    },
    {
      name: "Manifestor",
      percentage: "8%",
      description: "Die Initiatoren",
      strategy: "Informieren",
      authority: "Emotionale oder andere Autorität",
      color: "#ef4444",
      icon: <Zap size={24} />
    },
    {
      name: "Projector",
      percentage: "20%",
      description: "Die natürlichen Führer",
      strategy: "Warten auf die Einladung",
      authority: "Emotionale oder andere Autorität",
      color: "#8b5cf6",
      icon: <Target size={24} />
    },
    {
      name: "Reflector",
      percentage: "2%",
      description: "Die Spiegel der Gemeinschaft",
      strategy: "Warten auf den Mondzyklus",
      authority: "Mond-Autorität",
      color: "#06b6d4",
      icon: <Moon size={24} />
    }
  ];

  const centers = [
    { name: "Kopf", color: "#fbbf24", description: "Inspiration und mentaler Druck" },
    { name: "Ajna", color: "#8b5cf6", description: "Konzeptualisierung und Bewusstsein" },
    { name: "Kehle", color: "#06b6d4", description: "Manifestation und Kommunikation" },
    { name: "G-Zentrum", color: "#10b981", description: "Identität und Richtung" },
    { name: "Herz", color: "#ef4444", description: "Willen und Kraft" },
    { name: "Sakral", color: "#ec4899", description: "Lebenskraft und Sexualität" },
    { name: "Solarplexus", color: "#f97316", description: "Emotionen und Bewusstsein" },
    { name: "Milz", color: "#f59e0b", description: "Intuition und Überleben" },
    { name: "Wurzel", color: "#dc2626", description: "Druck und Adrenalin" }
  ];

  const chartBenefits = [
    "Entdecke deine authentische Persönlichkeit",
    "Verstehe deine Energie und wie du sie optimal nutzt",
    "Finde erfüllende Beziehungen und Verbindungen",
    "Entscheide aus deiner inneren Weisheit heraus",
    "Lebe im Einklang mit natürlichen Zyklen",
    "Wachse durch bewusste Selbsterkenntnis"
  ];

  return (
    <AccessControl 
      path="/chart-info" 
      userSubscription={userSubscription} 
      onUpgrade={() => router.push('/pricing')}
    >
      <UnifiedPageLayout
        title="📊 Chart Informationen"
        subtitle="Verstehe dein Human Design Chart: Zentren, Kanäle, Tore und Profile im Detail"
      >
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Navigation Tabs */}
            <Paper sx={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              borderRadius: 3,
              border: '1px solid rgba(255,255,255,0.2)',
              maxWidth: 800,
              mx: 'auto',
              mb: 4
            }}>
              <Tabs
                value={activeTab}
                onChange={handleTabChange}
                centered
                sx={{
                  '& .MuiTab-root': {
                    color: 'rgba(255,255,255,0.7)',
                    fontWeight: 600,
                    '&.Mui-selected': {
                      color: '#FFD700'
                    }
                  },
                  '& .MuiTabs-indicator': {
                    backgroundColor: '#FFD700'
                  }
                }}
              >
                <Tab label="Übersicht" />
                <Tab label="Typen" />
                <Tab label="Zentren" />
                <Tab label="Grundlagen" />
              </Tabs>
            </Paper>
          </motion.div>

        {/* Tab Content */}
        {activeTab === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Was ist Human Design */}
          <Card sx={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
            borderRadius: 4,
              border: '1px solid rgba(255,255,255,0.2)',
            mb: 6
          }}>
            <CardContent sx={{ p: 6 }}>
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                  <Sparkles size={48} color="#FFD700" style={{ marginBottom: 16 }} />
                  <Typography variant="h3" sx={{ color: 'white', fontWeight: 700, mb: 3 }}>
                  Was ist Human Design?
                </Typography>
                <Typography sx={{
                    color: 'rgba(255,255,255,0.8)',
                  fontSize: '1.2rem',
                  lineHeight: 1.8,
                  maxWidth: 900,
                  mx: 'auto'
                }}>
                  Human Design ist eine revolutionäre Wissenschaft, die Astrologie, I Ging, Chakren-System und Quantenphysik vereint. 
                  Es zeigt dir deine einzigartige energetische Blaupause und wie du authentisch leben kannst.
                </Typography>
              </Box>
            </CardContent>
          </Card>

        {/* Chart Features */}
            <Grid container spacing={3} sx={{ mb: 6 }}>
              {chartFeatures.map((feature, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <motion.div
                    
                    
                    
                  >
                    <Card sx={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(20px)',
                      borderRadius: 3,
                      border: '1px solid rgba(255,255,255,0.2)',
                      height: '100%'
                    }}>
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Box sx={{
                            width: 40,
                            height: 40,
                            borderRadius: '50%',
                            backgroundColor: feature.color,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mr: 2
                          }}>
                            <Box sx={{
                              width: 20,
                              height: 20,
                              borderRadius: '50%',
                              backgroundColor: 'white'
                            }} />
                          </Box>
                          <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                            {feature.title}
                          </Typography>
                        </Box>
                        <Typography sx={{
                          color: 'rgba(255,255,255,0.8)',
                          fontSize: '0.9rem',
                          lineHeight: 1.5,
                          mb: 2
                        }}>
                          {feature.description}
                        </Typography>
                        <Typography sx={{
                          color: 'rgba(255,255,255,0.7)',
                          fontSize: '0.8rem',
                          lineHeight: 1.4
                        }}>
                          {feature.details}
                        </Typography>
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
          
          
            
        >
          <Typography variant="h3" sx={{ 
              color: 'white', 
            textAlign: 'center', 
            fontWeight: 700, 
            mb: 6 
          }}>
              Die 4 Human Design Typen
          </Typography>
          
            <Grid container spacing={3}>
              {humanDesignTypes.map((type, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                <motion.div
                  
                  
                    
                >
                  <Card sx={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)',
                    borderRadius: 3,
                      border: '1px solid rgba(255,255,255,0.2)',
                      p: 3,
                      height: '100%',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 15px 30px rgba(0,0,0,0.3)'
                    }
                  }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Box sx={{
                          width: 20,
                          height: 20,
                        borderRadius: '50%',
                          background: type.color,
                          marginRight: 2
                        }} />
                        <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                          {type.name}
                        </Typography>
                        <Chip 
                          label={type.percentage} 
                          size="small"
                          sx={{ 
                            background: type.color,
                            color: 'white',
                            fontWeight: 600,
                            ml: 'auto'
                          }} 
                        />
                      </Box>
                      
                      <Typography sx={{
                        color: 'rgba(255,255,255,0.8)',
                        fontSize: '0.9rem',
                        lineHeight: 1.5,
                        mb: 2
                      }}>
                        {type.description}
                      </Typography>
                      
                      <Box sx={{ mb: 1 }}>
                        <Typography variant="body2" sx={{ color: '#FFD700', fontWeight: 600, mb: 0.5, fontSize: '0.8rem' }}>
                          Strategie:
                        </Typography>
                        <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem' }}>
                          {type.strategy}
                        </Typography>
                      </Box>
                      
                      <Box>
                        <Typography variant="body2" sx={{ color: '#FFD700', fontWeight: 600, mb: 0.5, fontSize: '0.8rem' }}>
                          Autorität:
                        </Typography>
                        <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem' }}>
                          {type.authority}
                        </Typography>
                      </Box>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        )}

        {activeTab === 2 && (
          <motion.div
            
            
            
          >
            <Typography variant="h3" sx={{ 
              color: 'white', 
              textAlign: 'center', 
              fontWeight: 700, 
              mb: 6 
            }}>
              Die 9 Energiezentren
            </Typography>
            
            <Grid container spacing={3}>
              {centers.map((center, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <motion.div
                    
                    
                    
                  >
                    <Card sx={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: 3,
                      border: '1px solid rgba(255,255,255,0.2)',
                      p: 3,
                      height: '100%',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 15px 30px rgba(0,0,0,0.3)'
                      }
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Box sx={{
                          width: 20,
                          height: 20,
                          borderRadius: '50%',
                          background: center.color,
                          marginRight: 2
                        }} />
                        <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                          {center.name}
                      </Typography>
                      </Box>
                      <Typography sx={{
                        color: 'rgba(255,255,255,0.8)',
                        fontSize: '0.9rem',
                        lineHeight: 1.5
                      }}>
                        {center.description}
                      </Typography>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>
        )}

        {activeTab === 3 && (
        <motion.div
          
          
            
        >
          <Card sx={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
            borderRadius: 4,
              border: '1px solid rgba(255,255,255,0.2)',
            mb: 6
          }}>
            <CardContent sx={{ p: 6 }}>
              <Typography variant="h3" sx={{ 
                  color: 'white', 
                textAlign: 'center', 
                fontWeight: 700, 
                mb: 4 
              }}>
                Warum Human Design?
              </Typography>
              <Grid container spacing={3}>
                {chartBenefits.map((benefit, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <motion.div
                      
                      
                        
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                          <CheckCircle size={24} color="#FFD700" />
                        <Typography sx={{
                            color: 'rgba(255,255,255,0.9)',
                          fontSize: '1.1rem'
                        }}>
                          {benefit}
                        </Typography>
                      </Box>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </motion.div>
        )}

        {/* Call to Action */}
        <motion.div
          
          
          
        >
          <Box sx={{ textAlign: 'center', mt: 8 }}>
            <Typography variant="h4" sx={{ 
              color: 'white', 
              fontWeight: 700, 
              mb: 4 
            }}>
              Bereit für deine Reise?
            </Typography>
            <Typography variant="h6" sx={{
              color: 'rgba(255,255,255,0.8)',
              mb: 6,
              maxWidth: 600,
              mx: 'auto'
            }}>
              Erstelle jetzt dein kostenloses Human Design Chart und entdecke deine wahre Natur
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
                         <Button
               component={Link}
               href="/register"
               variant="contained"
               size="large"
               sx={{
                  background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                  color: '#000',
                 fontWeight: 700,
                 px: 6,
                 py: 2,
                 borderRadius: 3,
                 fontSize: '1.2rem',
                 '&:hover': {
                    background: 'linear-gradient(135deg, #FFA500 0%, #FFD700 100%)',
                   transform: 'translateY(-2px)',
                    boxShadow: '0 12px 30px rgba(255, 215, 0, 0.4)'
                 }
               }}
             >
               Chart erstellen <ArrowRight size={24} style={{ marginLeft: 8 }} />
             </Button>
              
              <Button
                component={Link}
                href="/human-design-chart"
                variant="outlined"
                size="large"
                sx={{
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                  color: 'white',
                  fontWeight: 600,
                  px: 6,
                  py: 2,
                  borderRadius: 3,
                  fontSize: '1.2rem',
                  '&:hover': {
                    borderColor: '#FFD700',
                    backgroundColor: 'rgba(255, 215, 0, 0.1)',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                Chart anzeigen
              </Button>
            </Box>
          </Box>
        </motion.div>
      </Container>
    </UnifiedPageLayout>
  </AccessControl>
  );
}
