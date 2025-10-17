"use client";
import React from 'react';
import { Container, Typography, Card, CardContent, Box, Grid, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { 
  Star, 
  Moon, 
  Heart, 
  Users, 
  BookOpen, 
  BarChart3,
  Settings,
  DollarSign,
  Crown,
  Zap,
  Target,
  Globe,
  Brain,
  Activity,
  Calendar,
  Smartphone,
  TrendingUp
} from 'lucide-react';
import MobileLayout from '../../components/MobileLayout';

export default function MobileDemoPage() {
  const features = [
    {
      title: "Human Design Chart",
      description: "Berechnen Sie Ihr persönliches Human Design Chart",
      icon: <BarChart3 size={32} color="#FFD700" />,
      color: "#667eea",
      path: "/chart"
    },
    {
      title: "Mondkalender",
      description: "Leben Sie im Einklang mit den Mondzyklen",
      icon: <Moon size={32} color="#FFD700" />,
      color: "#4ecdc4",
      path: "/mondkalender"
    },
    {
      title: "Dating System",
      description: "Finden Sie Ihre kosmische Verbindung",
      icon: <Heart size={32} color="#FFD700" />,
      color: "#ff6b9d",
      path: "/dating"
    },
    {
      title: "Community",
      description: "Verbinden Sie sich mit Gleichgesinnten",
      icon: <Users size={32} color="#FFD700" />,
      color: "#10b981",
      path: "/community"
    },
    {
      title: "Journal",
      description: "Dokumentieren Sie Ihre Reise",
      icon: <BookOpen size={32} color="#FFD700" />,
      color: "#8b5cf6",
      path: "/journal"
    },
    {
      title: "Analytics",
      description: "Tiefe Einblicke in Ihr Design",
      icon: <TrendingUp size={32} color="#FFD700" />,
      color: "#f59e0b",
      path: "/analytics",
      isPremium: true
    },
    {
      title: "AI Analysis",
      description: "KI-basierte Chart-Analyse",
      icon: <Brain size={32} color="#FFD700" />,
      color: "#ef4444",
      path: "/ai-chart-analysis",
      isPremium: true
    },
    {
      title: "Mobile App",
      description: "The Connection Key überall dabei",
      icon: <Smartphone size={32} color="#FFD700" />,
      color: "#06b6d4",
      path: "/mobile-app"
    }
  ];

  return (
    <MobileLayout currentPath="/mobile-demo">
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography 
              variant="h2" 
              sx={{ 
                color: 'white', 
                fontWeight: 800, 
                mb: 3,
                fontSize: { xs: '2rem', md: '3rem' },
                textShadow: '0 0 20px rgba(255, 255, 255, 0.3)'
              }}
            >
              🌙 Mobile The Connection Key
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                color: 'rgba(255,255,255,0.8)', 
                mb: 4,
                maxWidth: '600px',
                mx: 'auto'
              }}
            >
              Ihre komplette Human Design Erfahrung - optimiert für mobile Geräte
            </Typography>
          </Box>
        </motion.div>

        {/* Features Grid */}
        <Grid container spacing={3}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card sx={{
                  height: '100%',
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: 4,
                  border: '1px solid rgba(255,255,255,0.2)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                    borderColor: 'rgba(255,255,255,0.4)'
                  }
                }}>
                  <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      mb: 2
                    }}>
                      <Box sx={{
                        width: 48,
                        height: 48,
                        borderRadius: '12px',
                        background: `linear-gradient(135deg, ${feature.color}, ${feature.color}dd)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: `0 8px 24px ${feature.color}40`
                      }}>
                        {feature.icon}
                      </Box>
                      {feature.isPremium && (
                        <Box sx={{
                          background: 'linear-gradient(45deg, #f59e0b, #d97706)',
                          color: 'white',
                          px: 1.5,
                          py: 0.5,
                          borderRadius: 2,
                          fontSize: '0.7rem',
                          fontWeight: 600
                        }}>
                          PREMIUM
                        </Box>
                      )}
                    </Box>
                    
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        color: 'white', 
                        fontWeight: 700, 
                        mb: 1,
                        fontSize: '1.1rem'
                      }}
                    >
                      {feature.title}
                    </Typography>
                    
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: 'rgba(255,255,255,0.8)', 
                        mb: 3,
                        flexGrow: 1,
                        lineHeight: 1.6
                      }}
                    >
                      {feature.description}
                    </Typography>
                    
                    <Button
                      variant="outlined"
                      fullWidth
                      sx={{
                        borderColor: 'rgba(255,255,255,0.3)',
                        color: 'white',
                        fontWeight: 600,
                        py: 1.5,
                        borderRadius: 3,
                        '&:hover': {
                          borderColor: feature.color,
                          backgroundColor: `${feature.color}20`,
                          transform: 'translateY(-2px)'
                        },
                        transition: 'all 0.3s ease'
                      }}
                    >
                      Erkunden
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* Mobile Navigation Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Card sx={{
            mt: 6,
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            borderRadius: 4,
            border: '1px solid rgba(255,255,255,0.2)',
            p: 4
          }}>
            <CardContent>
              <Box sx={{ textAlign: 'center' }}>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    color: 'white', 
                    fontWeight: 700, 
                    mb: 2 
                  }}
                >
                  📱 Mobile Navigation
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: 'rgba(255,255,255,0.8)', 
                    mb: 3,
                    maxWidth: '600px',
                    mx: 'auto'
                  }}
                >
                  Diese Seite verwendet die neue mobile Navigation. Tippen Sie auf das Menü-Symbol 
                  oben links, um alle verfügbaren Seiten zu durchsuchen.
                </Typography>
                <Box sx={{ 
                  display: 'flex', 
                  gap: 2, 
                  justifyContent: 'center',
                  flexWrap: 'wrap'
                }}>
                  <Box sx={{
                    background: 'rgba(255, 215, 0, 0.2)',
                    color: '#FFD700',
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    fontSize: '0.8rem',
                    fontWeight: 600
                  }}>
                    🎯 Kategorisiert
                  </Box>
                  <Box sx={{
                    background: 'rgba(34, 197, 94, 0.2)',
                    color: '#22c55e',
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    fontSize: '0.8rem',
                    fontWeight: 600
                  }}>
                    📱 Mobile-optimiert
                  </Box>
                  <Box sx={{
                    background: 'rgba(59, 130, 246, 0.2)',
                    color: '#3b82f6',
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    fontSize: '0.8rem',
                    fontWeight: 600
                  }}>
                    🔍 Suchbar
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </motion.div>
      </Container>
    </MobileLayout>
  );
}
