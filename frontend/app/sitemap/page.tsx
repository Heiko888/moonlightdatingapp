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
  Chip,
  Button
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

export default function SitemapPage() {
  // Vollständige Seiten-Datenbank (synchronisiert mit seitenuebersicht)
  const allPages = [
    // Öffentliche Seiten
    { title: "Startseite", path: "/", description: "Willkommen auf der Human Design App", category: "Öffentlich", icon: <Home size={24} /> },
    { title: "Anmelden", path: "/login", description: "Benutzeranmeldung", category: "Öffentlich", icon: <User size={24} /> },
    { title: "Registrieren", path: "/register", description: "Neue Benutzer registrieren", category: "Öffentlich", icon: <User size={24} /> },
    { title: "Preise", path: "/pricing", description: "Preisübersicht und Pakete", category: "Öffentlich", icon: <Star size={24} /> },
    { title: "Sitemap", path: "/sitemap", description: "Übersicht aller Seiten", category: "Öffentlich", icon: <MapPin size={24} /> },
    { title: "Roadmap", path: "/roadmap", description: "Entwicklungsplan", category: "Öffentlich", icon: <TrendingUp size={24} /> },
    { title: "Package Overview", path: "/package-overview", description: "Paket-Übersicht", category: "Öffentlich", icon: <Star size={24} /> },
    { title: "Seitenübersicht", path: "/seitenuebersicht", description: "Vollständige Übersicht aller App-Seiten", category: "Öffentlich", icon: <MapPin size={24} /> },

    // Benutzer-Seiten
    { title: "Dashboard", path: "/dashboard", description: "Persönliches Dashboard", category: "Benutzer", icon: <Target size={24} /> },
    { title: "Profil", path: "/profil", description: "Benutzerprofil verwalten", category: "Benutzer", icon: <User size={24} /> },
    { title: "Einstellungen", path: "/settings", description: "App-Einstellungen", category: "Benutzer", icon: <Settings size={24} /> },
    { title: "Chat", path: "/chat", description: "Chat-System", category: "Benutzer", icon: <Heart size={24} /> },

    // Human Design
    { title: "Human Design Chart", path: "/chart", description: "Persönliches Human Design Chart", category: "Human Design", icon: <Target size={24} /> },
    { title: "Chart Info", path: "/chart-info", description: "Detaillierte Chart-Informationen", category: "Human Design", icon: <BookOpen size={24} /> },
    { title: "Zentren", path: "/centers", description: "Human Design Zentren", category: "Human Design", icon: <Target size={24} /> },
    { title: "Tore", path: "/gates", description: "Human Design Tore", category: "Human Design", icon: <Target size={24} /> },
    { title: "Kanäle", path: "/channels", description: "Human Design Kanäle", category: "Human Design", icon: <Target size={24} /> },
    { title: "Autorität", path: "/authority", description: "Entscheidungsautorität", category: "Human Design", icon: <Target size={24} /> },

    // Kosmos & Mond
    { title: "Mondkalender", path: "/mondkalender", description: "Mondphasen und kosmische Zyklen", category: "Kosmos", icon: <Moon size={24} /> },
    { title: "Planeten", path: "/planets", description: "Übersicht aller Planeten", category: "Kosmos", icon: <Star size={24} /> },
    { title: "Sonne", path: "/planets/sun", description: "Die Sonne im Human Design", category: "Kosmos", icon: <Star size={24} /> },
    { title: "Mond", path: "/planets/moon", description: "Der Mond im Human Design", category: "Kosmos", icon: <Moon size={24} /> },
    { title: "Lilith", path: "/lilith", description: "Lilith-Energie", category: "Kosmos", icon: <Moon size={24} /> },

    // Community & Dating
    { title: "Community", path: "/community", description: "Benutzer-Community", category: "Community", icon: <Users size={24} /> },
    { title: "Dating", path: "/dating", description: "Human Design Dating", category: "Dating", icon: <Heart size={24} /> },
    { title: "Match", path: "/match", description: "Match-Übersicht", category: "Dating", icon: <Heart size={24} /> },
    { title: "Swipe", path: "/swipe", description: "Dating-Swipe-Funktion", category: "Dating", icon: <Heart size={24} /> },

    // Tools & Features
    { title: "Readings", path: "/reading", description: "Persönliche Human Design Readings", category: "Tools", icon: <BookOpen size={24} /> },
    { title: "Journal", path: "/journal", description: "Persönliches Journal", category: "Tools", icon: <BookOpen size={24} /> },
    { title: "Knowledge", path: "/knowledge", description: "Wissensdatenbank", category: "AI", icon: <BookOpen size={24} /> },
    { title: "AI Chat", path: "/ai-chat", description: "KI-Chat-System", category: "AI", icon: <Heart size={24} /> },

    // Coaching & VIP
    { title: "Coaching", path: "/coaching", description: "Persönliches 1:1 Coaching", category: "Coaching", icon: <Target size={24} /> },
    { title: "VIP Community", path: "/vip-community", description: "Exklusive VIP-Community", category: "VIP", icon: <Star size={24} /> },
    { title: "Exclusive Events", path: "/exclusive-events", description: "Exklusive Events", category: "VIP", icon: <Star size={24} /> },

    // Development & Admin
    { title: "Admin Panel", path: "/admin", description: "Administratives Panel", category: "Admin", icon: <Settings size={24} /> },
    { title: "Debug", path: "/debug", description: "Debug-Funktionen", category: "Development", icon: <Settings size={24} /> },
    { title: "Demo", path: "/demo", description: "Demo-Seite", category: "Development", icon: <Star size={24} /> },
  ];

  // Nach Kategorien gruppieren
  const groupedPages = allPages.reduce((groups, page) => {
    const category = page.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(page);
    return groups;
  }, {} as Record<string, typeof allPages>);

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
              🗺️ Vollständige Sitemap
            </Typography>
            
            <Typography variant="h5" sx={{
              color: 'rgba(255,255,255,0.8)',
              mb: 4,
              maxWidth: 600,
              mx: 'auto',
              lineHeight: 1.6
            }}>
              Alle {allPages.length} Seiten von The Connection Key - Kategorisiert und durchsuchbar
            </Typography>
          </Box>
        </motion.div>

        {/* Seiten nach Kategorien */}
        {Object.entries(groupedPages).map(([category, pages], categoryIndex) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
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
              {category} ({pages.length} Seiten)
            </Typography>
            
            <Grid container spacing={3} sx={{ mb: 6 }}>
              {pages.map((page, index) => (
                <Grid item xs={12} md={6} lg={4} key={index}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                  >
                    <Card sx={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: 3,
                      border: '1px solid rgba(255,255,255,0.1)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0 15px 45px rgba(0,0,0,0.4)',
                        border: '1px solid rgba(255, 107, 157, 0.5)'
                      }
                    }}>
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Box sx={{ 
                            color: '#ff6b9d', 
                            mr: 2,
                            display: 'flex',
                            alignItems: 'center'
                          }}>
                            {page.icon}
                          </Box>
                          <Typography variant="h6" sx={{ 
                            color: 'white', 
                            fontWeight: 600,
                            flex: 1
                          }}>
                            {page.title}
                          </Typography>
                          <CheckCircle size={20} color="#4ecdc4" />
                        </Box>
                        
                        <Typography variant="body2" sx={{ 
                          color: 'rgba(255,255,255,0.7)', 
                          mb: 2,
                          lineHeight: 1.6
                        }}>
                          {page.description}
                        </Typography>
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Link href={page.path} style={{ textDecoration: 'none' }}>
                            <Button
                              variant="contained"
                              sx={{
                                background: 'linear-gradient(135deg, #ff6b9d, #4ecdc4)',
                                color: 'white',
                                fontWeight: 600,
                                borderRadius: 2,
                                px: 3,
                                py: 1,
                                textTransform: 'none',
                                '&:hover': {
                                  background: 'linear-gradient(135deg, #ff5a8a, #3eb8b8)',
                                  transform: 'translateY(-2px)'
                                }
                              }}
                            >
                              Besuchen
                              <ArrowRight size={16} style={{ marginLeft: 8 }} />
                            </Button>
                          </Link>
                        </Box>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        ))}

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Box sx={{ textAlign: 'center', mt: 8, p: 4, background: 'rgba(255, 255, 255, 0.05)', borderRadius: 3 }}>
            <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
              📊 Gesamtstatistik
            </Typography>
            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', mb: 2 }}>
              {allPages.length} Seiten in {Object.keys(groupedPages).length} Kategorien
            </Typography>
            <Link href="/seitenuebersicht" style={{ textDecoration: 'none' }}>
              <Button
                variant="outlined"
                sx={{
                  borderColor: 'rgba(255, 107, 157, 0.5)',
                  color: '#ff6b9d',
                  '&:hover': {
                    borderColor: '#ff6b9d',
                    backgroundColor: 'rgba(255, 107, 157, 0.1)'
                  }
                }}
              >
                Erweiterte Seitenübersicht
                <ArrowRight size={16} style={{ marginLeft: 8 }} />
              </Button>
            </Link>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
}