"use client";
import React from 'react';
import { Container, Typography, Card, CardContent, Box, Grid, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Brain, 
  Heart, 
  Users, 
  Calendar, 
  ArrowRight,
  Info,
  Lightbulb,
  Target,
  Shield,
  Zap
} from 'lucide-react';
import AnimatedStars from '@/components/AnimatedStars';
import Link from 'next/link';

export default function InfoHubPage() {
  const infoPages = [
    {
      title: "Chart Info",
      description: "Grundlagen und Erklärung des Human Design Systems",
      icon: <BookOpen size={32} color="#FFD700" />,
      path: "/chart-info",
      color: "#667eea",
      category: "Grundlagen"
    },
    {
      title: "Human Design Info",
      description: "Umfassende Human Design Grundlagen - Typen, Zentren, Profile und mehr",
      icon: <Brain size={32} color="#FFD700" />,
      path: "/human-design-info",
      color: "#667eea",
      category: "Grundlagen"
    },
    {
      title: "Authority",
      description: "Deine innere Autorität und Entscheidungsfindung",
      icon: <Shield size={32} color="#FFD700" />,
      path: "/authority",
      color: "#f093fb",
      category: "Grundlagen"
    },
    {
      title: "Centers",
      description: "Die 9 Energiezentren - deine energetische Anatomie verstehen",
      icon: <Target size={32} color="#FFD700" />,
      path: "/centers-info",
      color: "#ff9a9e",
      category: "Grundlagen"
    },
    {
      title: "Channels",
      description: "Die 36 Kanäle - deine Verbindungen und Talente",
      icon: <Zap size={32} color="#FFD700" />,
      path: "/channels-info",
      color: "#a8edea",
      category: "Grundlagen"
    },
    {
      title: "Gates",
      description: "Die 64 Tore des I Ging - deine individuellen Eigenschaften",
      icon: <Info size={32} color="#FFD700" />,
      path: "/gates-info",
      color: "#d299c2",
      category: "Grundlagen"
    },
    {
      title: "Profiles",
      description: "Die 12 Profile - deine Lebensrolle und dein Potenzial",
      icon: <Users size={32} color="#FFD700" />,
      path: "/profiles-info",
      color: "#fad0c4",
      category: "Grundlagen"
    },
    {
      title: "Community",
      description: "Verbinde dich mit anderen Human Design Enthusiasten",
      icon: <Heart size={32} color="#FFD700" />,
      path: "/community-info",
      color: "#ffecd2",
      category: "Services"
    },
    {
      title: "Mondkalender",
      description: "Lebe im Einklang mit den Mondzyklen",
      icon: <Calendar size={32} color="#FFD700" />,
      path: "/mondkalender-info",
      color: "#a8edea",
      category: "Services"
    },
    {
      title: "Journal Info",
      description: "Human Design Journaling und Selbstreflexion",
      icon: <Lightbulb size={32} color="#FFD700" />,
      path: "/journal-info",
      color: "#a8edea",
      category: "Anwendung"
    }
  ];

  const categories = {
    "Grundlagen": infoPages.filter(page => page.category === "Grundlagen"),
    "Services": infoPages.filter(page => page.category === "Services"),
    "Anwendung": infoPages.filter(page => page.category === "Anwendung")
  };

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
      
      <Container maxWidth="lg" sx={{ py: 8, position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <motion.div
              animate={{ 
                textShadow: [
                  '0 0 20px rgba(255, 215, 0, 0.5)',
                  '0 0 30px rgba(255, 215, 0, 0.8)',
                  '0 0 20px rgba(255, 215, 0, 0.5)'
                ]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            >
              <Typography variant="h1" sx={{
                color: 'white',
                fontWeight: 800,
                fontSize: { xs: '2.5rem', md: '4rem' },
                mb: 2,
                textShadow: '0 4px 20px rgba(0,0,0,0.5)',
                background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FFD700 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2
              }}>
                <Brain size={64} style={{ color: '#FFD700' }} />
                Info Hub
                <Brain size={64} style={{ color: '#FFD700' }} />
              </Typography>
            </motion.div>
            
            <Typography variant="h5" sx={{
              color: 'rgba(255,255,255,0.8)',
              fontSize: { xs: '1.2rem', md: '1.5rem' },
              maxWidth: 800,
              mx: 'auto',
              lineHeight: 1.6,
              mb: 4
            }}>
              Deine zentrale Anlaufstelle für alle Human Design Informationen
            </Typography>
          </Box>
        </motion.div>

        {/* Categories */}
        {Object.entries(categories).map(([categoryName, pages], categoryIndex) => (
          <motion.div
            key={categoryName}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + categoryIndex * 0.2, duration: 0.8 }}
          >
            <Typography variant="h3" sx={{ 
              color: 'white', 
              textAlign: 'center', 
              fontWeight: 700, 
              mb: 4,
              mt: categoryIndex > 0 ? 8 : 0
            }}>
              {categoryName}
            </Typography>
            
            <Grid container spacing={3} sx={{ mb: 6 }}>
              {pages.map((page, index) => (
                <Grid item xs={12} sm={6} md={4} key={page.title}>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + categoryIndex * 0.2 + index * 0.1, duration: 0.6 }}
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
                            backgroundColor: page.color,
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
                            {page.title}
                          </Typography>
                        </Box>
                        <Typography sx={{
                          color: 'rgba(255,255,255,0.8)',
                          fontSize: '0.9rem',
                          lineHeight: 1.5,
                          mb: 2
                        }}>
                          {page.description}
                        </Typography>
                        <Link href={page.path} style={{ textDecoration: 'none' }}>
                          <Button
                            variant="outlined"
                            fullWidth
                            endIcon={<ArrowRight size={16} />}
                            sx={{
                              borderColor: page.color,
                              color: page.color,
                              fontWeight: 600,
                              py: 1,
                              borderRadius: 2,
                              fontSize: '0.8rem',
                              '&:hover': {
                                borderColor: page.color,
                                backgroundColor: `${page.color}20`
                              }
                            }}
                          >
                            Erkunden
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        ))}
      </Container>
    </Box>
  );
}