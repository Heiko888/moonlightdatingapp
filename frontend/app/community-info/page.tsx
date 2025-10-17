"use client";

import React from "react";
import Link from "next/link";
import { 
  Box, 
  Typography, 
  Button,
  Container,
  Grid,
  Card,
  Paper,
  Chip,
  Stack
} from "@mui/material";
import { 
  Heart, 
  Users,
  Moon,
  ArrowRight,
  Star, 
  Check,
  Sparkles,
  MessageCircle,
  Calendar,
  TrendingUp,
  Shield,
  Zap,
  Target,
  BookOpen,
  UserPlus,
  Share2
} from "lucide-react";
import { motion } from "framer-motion";

// Community Features
const communityFeatures = [
  {
    icon: <Users size={32} />,
    title: "Community Hub",
    description: "Verbinde dich mit über 2.500+ Gleichgesinnten aus der ganzen Welt",
    color: "linear-gradient(135deg, #4ecdc4, #0891b2)",
    stats: "2.500+ Mitglieder"
  },
  {
    icon: <MessageCircle size={32} />,
    title: "Austausch & Support",
    description: "Teile Erfahrungen, stelle Fragen und lerne von anderen auf ihrer Human Design Journey",
    color: "linear-gradient(135deg, #8b5cf6, #6d28d9)",
    stats: "10.000+ Posts"
  },
  {
    icon: <Calendar size={32} />,
    title: "Events & Meetups",
    description: "Nimm an exklusiven Workshops, Webinaren und lokalen Meetups teil",
    color: "linear-gradient(135deg, #06b6d4, #0284c7)",
    stats: "25+ Events/Monat"
  },
  {
    icon: <Heart size={32} />,
    title: "Matching & Dating",
    description: "Finde Menschen, die energetisch zu dir passen - für Freundschaft oder Liebe",
    color: "linear-gradient(135deg, #ff6b9d, #c44569)",
    stats: "500+ Matches"
  },
  {
    icon: <BookOpen size={32} />,
    title: "Wissens-Bibliothek",
    description: "Zugang zu umfangreichen Ressourcen, Artikeln und Guides über Human Design",
    color: "linear-gradient(135deg, #10b981, #059669)",
    stats: "100+ Artikel"
  },
  {
    icon: <Share2 size={32} />,
    title: "Teilen & Wachsen",
    description: "Teile deine Erkenntnisse und helfe anderen auf ihrem Weg der Selbstentdeckung",
    color: "linear-gradient(135deg, #f59e0b, #d97706)",
    stats: "5.000+ Shares"
  }
];

// Community Benefits
const benefits = [
  {
    icon: <Shield size={24} />,
    title: "Sichere Umgebung",
    description: "Geschützter Raum für authentischen Austausch"
  },
  {
    icon: <Sparkles size={24} />,
    title: "Exklusive Inhalte",
    description: "Premium Mitglieder erhalten Zugang zu VIP-Content"
  },
  {
    icon: <TrendingUp size={24} />,
    title: "Persönliches Wachstum",
    description: "Entwickle dich weiter durch Community-Support"
  },
  {
    icon: <Target size={24} />,
    title: "Gleichgesinnte finden",
    description: "Finde Menschen auf derselben Wellenlänge"
  }
];

// Success Stories (Mock data)
const successStories = [
  {
    name: "Sarah M.",
    type: "Generator",
    story: "Durch die Community habe ich nicht nur meinen Partner gefunden, sondern auch eine ganze Gruppe von Freunden, die mich verstehen.",
    rating: 5
  },
  {
    name: "Marcus K.",
    type: "Projector",
    story: "Die Workshops und Meetups haben mir geholfen, mein Human Design wirklich zu verstehen und anzuwenden.",
    rating: 5
  },
  {
    name: "Emma L.",
    type: "Manifestor",
    story: "Ich liebe den Austausch in der Community. Endlich Menschen, die ähnlich denken und fühlen!",
    rating: 5
  }
];

export default function CommunityInfoPage() {
  return (
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
        background: 'rgba(15, 15, 35, 0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.3)'
      }}>
        <Container maxWidth="lg">
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            py: 2
          }}>
            <Typography
              component={Link}
              href="/"
              variant="h5"
              sx={{
                background: 'linear-gradient(135deg, #4ecdc4, #8b5cf6, #ff6b9d)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 800,
                textDecoration: 'none',
                cursor: 'pointer'
              }}
            >
              🔑 The Connection Key
            </Typography>
            
            <Stack direction="row" spacing={2}>
              <Button
                component={Link}
                href="/"
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
                Startseite
              </Button>
              <Button
                component={Link}
                href="/register"
                variant="contained"
                sx={{
                  background: 'linear-gradient(135deg, #4ecdc4, #0891b2)',
                  borderRadius: 3,
                  textTransform: 'none',
                  fontWeight: 600,
                  boxShadow: '0 4px 15px rgba(78, 205, 196, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #3bb5b0, #0779a1)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 25px rgba(78, 205, 196, 0.4)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Jetzt beitreten
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
              textShadow: '0 0 40px rgba(78, 205, 196, 0.3)'
            }}>
              👥 Community Hub
            </Typography>
            
            <Typography variant="h5" sx={{
              color: 'rgba(255,255,255,0.85)',
              mb: 6,
              maxWidth: 700,
              mx: 'auto',
              lineHeight: 1.8,
              fontSize: { xs: '1.1rem', md: '1.3rem' }
            }}>
              Verbinde dich mit über 2.500+ Menschen auf ihrer Human Design Journey. 
              Teile Erfahrungen, finde Freunde und wachse gemeinsam.
            </Typography>
            
            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              spacing={2} 
              justifyContent="center"
              sx={{ mb: 6 }}
            >
              <Button
                component={Link}
                href="/register"
                variant="contained"
                size="large"
                sx={{
                  background: 'linear-gradient(135deg, #4ecdc4, #0891b2)',
                  px: 5,
                  py: 2,
                  borderRadius: 3,
                  fontWeight: 600,
                  fontSize: '1.1rem',
                  textTransform: 'none',
                  minWidth: { xs: '100%', sm: 'auto' },
                  boxShadow: '0 8px 25px rgba(78, 205, 196, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #3bb5b0, #0779a1)',
                    transform: 'translateY(-3px)',
                    boxShadow: '0 12px 35px rgba(78, 205, 196, 0.4)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                <UserPlus size={22} style={{ marginRight: 10 }} />
                Kostenlos beitreten
              </Button>
              
              <Button
                component={Link}
                href="/community"
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
                Community ansehen
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
                    2.500+
                  </Typography>
                  <Typography sx={{ color: 'rgba(255,255,255,0.7)' }}>
                    Mitglieder
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
                    500+
                  </Typography>
                  <Typography sx={{ color: 'rgba(255,255,255,0.7)' }}>
                    Matches
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
                    25+
                  </Typography>
                  <Typography sx={{ color: 'rgba(255,255,255,0.7)' }}>
                    Events/Monat
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
                    98%
                  </Typography>
                  <Typography sx={{ color: 'rgba(255,255,255,0.7)' }}>
                    Zufriedenheit
                  </Typography>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </motion.div>

        {/* Community Features */}
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
            ✨ Community Features
          </Typography>
          <Typography variant="h6" sx={{
            textAlign: 'center',
            color: 'rgba(255,255,255,0.7)',
            mb: 6,
            maxWidth: 600,
            mx: 'auto'
          }}>
            Alles, was du brauchst, um dich zu vernetzen und zu wachsen
          </Typography>

          <Grid container spacing={3}>
            {communityFeatures.map((feature, index) => (
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

        {/* Benefits Section */}
        <Box sx={{ mb: 10 }}>
          <Typography variant="h2" sx={{
            textAlign: 'center',
            background: 'linear-gradient(135deg, #ff6b9d, #8b5cf6)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 800,
            mb: 6,
            fontSize: { xs: '2rem', md: '3rem' }
          }}>
            🌟 Deine Vorteile
          </Typography>

          <Grid container spacing={3}>
            {benefits.map((benefit, index) => (
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
                    display: 'inline-flex',
                    p: 2,
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, #4ecdc4, #8b5cf6)',
                    color: 'white',
                    mb: 2
                  }}>
                    {benefit.icon}
                  </Box>
                  <Typography variant="h6" sx={{ 
                    color: 'white', 
                    fontWeight: 700, 
                    mb: 1
                  }}>
                    {benefit.title}
                  </Typography>
                  <Typography variant="body2" sx={{ 
                    color: 'rgba(255,255,255,0.7)',
                    lineHeight: 1.6
                  }}>
                    {benefit.description}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Success Stories */}
        <Box sx={{ mb: 10 }}>
          <Typography variant="h2" sx={{
            textAlign: 'center',
            background: 'linear-gradient(135deg, #f59e0b, #ff6b9d)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 800,
            mb: 2,
            fontSize: { xs: '2rem', md: '3rem' }
          }}>
            💬 Was unsere Community sagt
          </Typography>
          <Typography variant="h6" sx={{
            textAlign: 'center',
            color: 'rgba(255,255,255,0.7)',
            mb: 6,
            maxWidth: 600,
            mx: 'auto'
          }}>
            Echte Erfahrungen von echten Menschen
          </Typography>

          <Grid container spacing={3}>
            {successStories.map((story, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card sx={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: 4,
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  p: 4,
                  height: '100%',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    background: 'rgba(255, 255, 255, 0.12)',
                    boxShadow: '0 12px 35px rgba(0, 0, 0, 0.3)'
                  }
                }}>
                  <Box sx={{ display: 'flex', gap: 0.5, mb: 2 }}>
                    {[...Array(story.rating)].map((_, i) => (
                      <Star key={i} size={20} fill="#FFD700" color="#FFD700" />
                    ))}
                  </Box>
                  <Typography variant="body1" sx={{
                    color: 'rgba(255,255,255,0.85)',
                    lineHeight: 1.7,
                    mb: 3,
                    fontStyle: 'italic'
                  }}>
                    "{story.story}"
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" sx={{ color: 'white', fontWeight: 700 }}>
                      {story.name}
                    </Typography>
                    <Chip
                      label={story.type}
                      size="small"
                      sx={{
                        background: 'linear-gradient(135deg, #4ecdc4, #8b5cf6)',
                        color: 'white',
                        fontWeight: 600
                      }}
                    />
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

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
                <Sparkles size={48} color="#4ecdc4" style={{ marginBottom: 16 }} />
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
                🚀 Bereit, Teil der Community zu werden?
              </Typography>
              <Typography variant="h6" sx={{ 
                color: 'rgba(255,255,255,0.85)', 
                mb: 5,
                maxWidth: 700,
                mx: 'auto',
                lineHeight: 1.8,
                fontSize: { xs: '1rem', md: '1.2rem' }
              }}>
                Werde Teil einer wachsenden Community von Menschen, die ihr wahres Selbst entdecken und leben.
              </Typography>
              
              <Button
                component={Link}
                href="/register"
                variant="contained"
                size="large"
                sx={{
                  background: 'linear-gradient(135deg, #4ecdc4, #0891b2)',
                  px: 6,
                  py: 2.5,
                  borderRadius: 3,
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  textTransform: 'none',
                  minWidth: { xs: '100%', sm: '300px' },
                  boxShadow: '0 10px 30px rgba(78, 205, 196, 0.4)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #3bb5b0, #0779a1)',
                    transform: 'translateY(-4px)',
                    boxShadow: '0 15px 40px rgba(78, 205, 196, 0.5)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                <UserPlus size={22} style={{ marginRight: 10 }} />
                Jetzt kostenlos beitreten
              </Button>

              <Typography sx={{ 
                color: 'rgba(255,255,255,0.6)', 
                mt: 3,
                fontSize: '0.9rem'
              }}>
                100% kostenlos • Keine Kreditkarte erforderlich • Jederzeit kündbar
              </Typography>
            </Box>
          </Card>
        </motion.div>
      </Container>
    </Box>
  );
}
