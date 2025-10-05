"use client";

import React from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Card, 
  CardContent, 
  Grid, 
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Chip
} from '@mui/material';
import { 
  Heart, 
  Users, 
  Star, 
  Moon, 
  BookOpen,
  Calendar,
  Target,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Home,
  User,
  Settings,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import AnimatedStars from '@/components/AnimatedStars';

export default function SitemapPage() {
  const mainPages = [
    { title: "Startseite", path: "/", description: "Willkommen bei der HD App", icon: <Home size={24} /> },
    { title: "Registrierung", path: "/register", description: "Neues Konto erstellen", icon: <User size={24} /> },
    { title: "Anmeldung", path: "/login", description: "Bestehendes Konto anmelden", icon: <User size={24} /> },
    { title: "Community Info", path: "/community-info", description: "Über unsere Community", icon: <Users size={24} /> },
  ];

  const appPages = [
    { title: "Human Design Chart", path: "/human-design-chart", description: "Dein persönliches Chart", icon: <Target size={24} /> },
    { title: "Mondkalender", path: "/mondkalender", description: "Kosmische Zyklen verfolgen", icon: <Moon size={24} /> },
    { title: "Dating", path: "/dating", description: "Finde deine kosmische Verbindung", icon: <Heart size={24} /> },
    { title: "Reading", path: "/reading", description: "Persönliche Readings", icon: <BookOpen size={24} /> },
    { title: "Roadmap", path: "/roadmap", description: "Dein Entwicklungsweg", icon: <TrendingUp size={24} /> },
    { title: "Package Overview", path: "/package-overview", description: "Abonnement-Optionen", icon: <Star size={24} /> },
  ];

  const gamificationPages = [
    { title: "Gamification", path: "/gamification", description: "Spielerische Elemente", icon: <Star size={24} /> },
  ];

  const debugPages = [
    { title: "Debug Simple", path: "/debug-simple", description: "System-Debugging", icon: <Settings size={24} /> },
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
      
      <Container maxWidth="lg" sx={{ py: 8, position: 'relative', zIndex: 2 }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography variant="h2" sx={{
              background: 'linear-gradient(135deg, #ff6b9d, #4ecdc4)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 800,
              mb: 3,
              fontSize: { xs: '2rem', md: '3rem' }
            }}>
              🗺️ Seitenübersicht
            </Typography>
            
            <Typography variant="h5" sx={{
              color: 'rgba(255,255,255,0.8)',
              mb: 4,
              maxWidth: 600,
              mx: 'auto',
              lineHeight: 1.6
            }}>
              Entdecke alle verfügbaren Seiten und Funktionen der HD App
            </Typography>
          </Box>
        </motion.div>

        {/* Main Pages */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Typography variant="h4" sx={{ 
            color: 'white', 
            fontWeight: 700, 
            mb: 4,
            background: 'linear-gradient(135deg, #ff6b9d, #4ecdc4)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Hauptseiten
          </Typography>
          
          <Grid container spacing={3} sx={{ mb: 6 }}>
            {mainPages.map((page, index) => (
              <Grid item xs={12} md={6} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card sx={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: 3,
                    border: '1px solid rgba(255,255,255,0.1)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid rgba(255,255,255,0.2)'
                    }
                  }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Box sx={{ 
                          color: '#4ecdc4', 
                          mr: 2,
                          display: 'flex',
                          alignItems: 'center'
                        }}>
                          {page.icon}
                        </Box>
                        <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                          {page.title}
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ 
                        color: 'rgba(255,255,255,0.7)',
                        mb: 2
                      }}>
                        {page.description}
                      </Typography>
                      <Link href={page.path} style={{ textDecoration: 'none' }}>
                        <Typography variant="body2" sx={{ 
                          color: '#4ecdc4',
                          fontWeight: 600,
                          display: 'flex',
                          alignItems: 'center',
                          '&:hover': {
                            color: '#3bb5b0'
                          }
                        }}>
                          Seite besuchen <ArrowRight size={16} style={{ marginLeft: 8 }} />
                        </Typography>
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>

        {/* App Pages */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Typography variant="h4" sx={{ 
            color: 'white', 
            fontWeight: 700, 
            mb: 4,
            background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            App-Funktionen
          </Typography>
          
          <Grid container spacing={3} sx={{ mb: 6 }}>
            {appPages.map((page, index) => (
              <Grid item xs={12} md={6} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card sx={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: 3,
                    border: '1px solid rgba(255,255,255,0.1)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid rgba(255,255,255,0.2)'
                    }
                  }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Box sx={{ 
                          color: '#8b5cf6', 
                          mr: 2,
                          display: 'flex',
                          alignItems: 'center'
                        }}>
                          {page.icon}
                        </Box>
                        <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                          {page.title}
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ 
                        color: 'rgba(255,255,255,0.7)',
                        mb: 2
                      }}>
                        {page.description}
                      </Typography>
                      <Link href={page.path} style={{ textDecoration: 'none' }}>
                        <Typography variant="body2" sx={{ 
                          color: '#8b5cf6',
                          fontWeight: 600,
                          display: 'flex',
                          alignItems: 'center',
                          '&:hover': {
                            color: '#7c3aed'
                          }
                        }}>
                          Seite besuchen <ArrowRight size={16} style={{ marginLeft: 8 }} />
                        </Typography>
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>

        {/* Additional Pages */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h5" sx={{ 
                color: 'white', 
                fontWeight: 700, 
                mb: 3,
                background: 'linear-gradient(135deg, #10b981, #059669)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Gamification
              </Typography>
              
              {gamificationPages.map((page, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card sx={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: 3,
                    border: '1px solid rgba(255,255,255,0.1)',
                    mb: 2,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      background: 'rgba(255, 255, 255, 0.08)'
                    }
                  }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Box sx={{ color: '#10b981', mr: 2 }}>{page.icon}</Box>
                        <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                          {page.title}
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1 }}>
                        {page.description}
                      </Typography>
                      <Link href={page.path} style={{ textDecoration: 'none' }}>
                        <Typography variant="body2" sx={{ 
                          color: '#10b981',
                          fontWeight: 600,
                          display: 'flex',
                          alignItems: 'center'
                        }}>
                          Seite besuchen <ArrowRight size={16} style={{ marginLeft: 8 }} />
                        </Typography>
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="h5" sx={{ 
                color: 'white', 
                fontWeight: 700, 
                mb: 3,
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Debug & Tools
              </Typography>
              
              {debugPages.map((page, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card sx={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: 3,
                    border: '1px solid rgba(255,255,255,0.1)',
                    mb: 2,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      background: 'rgba(255, 255, 255, 0.08)'
                    }
                  }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Box sx={{ color: '#f59e0b', mr: 2 }}>{page.icon}</Box>
                        <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                          {page.title}
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1 }}>
                        {page.description}
                      </Typography>
                      <Link href={page.path} style={{ textDecoration: 'none' }}>
                        <Typography variant="body2" sx={{ 
                          color: '#f59e0b',
                          fontWeight: 600,
                          display: 'flex',
                          alignItems: 'center'
                        }}>
                          Seite besuchen <ArrowRight size={16} style={{ marginLeft: 8 }} />
                        </Typography>
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </Grid>
          </Grid>
        </motion.div>
      </Container>
    </Box>
  );
}
