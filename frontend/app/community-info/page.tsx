"use client";

import React from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Container,
  Grid,
  Chip,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Paper
} from '@mui/material';
import { 
  Users, 
  Heart, 
  MessageCircle, 
  Search,
  Globe, 
  Star, 
  Shield, 
  Calendar, 
  MapPin, 
  UserPlus, 
  Send, 
  ThumbsUp, 
  MessageSquare, 
  Award, 
  Activity, 
  Clock, 
  ChevronRight, 
  Plus, 
  Eye, 
  Share2, 
  User, 
  Filter, 
  Phone, 
  Mail, 
  Instagram, 
  Facebook, 
  Twitter, 
  Edit, 
  Trash2,
  ArrowRight,
  CheckCircle,
  Zap,
  Target,
  BookOpen,
  Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';
import AnimatedStars from '../../components/AnimatedStars';
import Link from 'next/link';

export default function CommunityInfoPage() {
  const features = [
    {
      icon: <Users size={32} />,
      title: "Human Design Community",
      description: "Verbinde dich mit Menschen, die Human Design verstehen und leben",
      color: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
    },
    {
      icon: <MessageCircle size={32} />,
      title: "Authentische Gespräche",
      description: "Tiefgründige Diskussionen über Typen, Strategien und Autoritäten",
      color: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
    },
    {
      icon: <Calendar size={32} />,
      title: "Events & Meetups",
      description: "Regelmäßige Treffen, Workshops und Online-Events",
      color: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
    },
    {
      icon: <Heart size={32} />,
      title: "Beziehungen & Dating",
      description: "Finde Menschen, die zu deinem Human Design passen",
      color: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)"
    },
    {
      icon: <BookOpen size={32} />,
      title: "Wissen teilen",
      description: "Lerne von erfahrenen Human Design Experten",
      color: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)"
    },
    {
      icon: <Sparkles size={32} />,
      title: "Persönliches Wachstum",
      description: "Entwickle dich gemeinsam mit anderen weiter",
      color: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)"
    }
  ];

  const communityStats = [
    { label: "Aktive Mitglieder", value: "2,500+", icon: <Users size={24} /> },
    { label: "Tägliche Posts", value: "150+", icon: <MessageSquare size={24} /> },
    { label: "Events pro Monat", value: "25+", icon: <Calendar size={24} /> },
    { label: "Erfolgreiche Matches", value: "500+", icon: <Heart size={24} /> }
  ];

  const hdTypes = [
    { type: "Generator", description: "Energiegeladene Macher", color: "#10b981" },
    { type: "Manifesting Generator", description: "Dynamische Initiatoren", color: "#f59e0b" },
    { type: "Manifestor", description: "Natürliche Führer", color: "#ef4444" },
    { type: "Projector", description: "Weise Berater", color: "#8b5cf6" },
    { type: "Reflector", description: "Intuitive Spiegel", color: "#06b6d4" }
  ];

  return (
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
      <AnimatedStars />
      
      <Container maxWidth="xl" sx={{ py: { xs: 4, md: 8 }, position: 'relative', zIndex: 2, px: { xs: 1, sm: 2 } }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
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
                fontSize: { xs: '1.8rem', sm: '2.5rem', md: '3.5rem' },
                mb: 2,
                textShadow: '0 4px 20px rgba(0,0,0,0.5)',
                background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FFD700 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: { xs: 1, md: 2 },
                flexDirection: { xs: 'column', sm: 'row' }
              }}>
                <Users size={32} style={{ color: '#FFD700' }} />
                Kosmische Verbindungen Community
                <Users size={32} style={{ color: '#FFD700' }} />
              </Typography>
            </motion.div>
            
            <Typography variant="h5" sx={{
              color: 'rgba(255,255,255,0.8)',
              mb: 4,
              maxWidth: 800,
              mx: 'auto',
              fontWeight: 400,
              fontSize: { xs: '1rem', md: '1.2rem' },
              textAlign: 'center',
              lineHeight: 1.7,
              textShadow: '0 2px 8px rgba(0,0,0,0.3)'
            }}>
              Die größte Human Design Community im deutschsprachigen Raum
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              gap: { xs: 1, sm: 2 }, 
              flexWrap: 'wrap',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: 'center'
            }}>
              <Button
                component={Link}
                href="/community"
                variant="contained"
                size="large"
                fullWidth
                sx={{
                  background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
                  px: { xs: 3, sm: 4 },
                  py: 2,
                  borderRadius: 3,
                  fontWeight: 600,
                  minWidth: { xs: '100%', sm: 'auto' },
                  '&:hover': {
                    background: 'linear-gradient(135deg, #7C3AED 0%, #DB2777 100%)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(139, 92, 246, 0.4)'
                  }
                }}
              >
                <Users size={20} style={{ marginRight: 8 }} />
                Community beitreten
              </Button>
              
              <Button
                variant="outlined"
                size="large"
                fullWidth
                sx={{
                  borderColor: 'rgba(255,255,255,0.3)',
                  color: '#fff',
                  px: { xs: 3, sm: 4 },
                  py: 2,
                  borderRadius: 3,
                  fontWeight: 600,
                  minWidth: { xs: '100%', sm: 'auto' },
                  '&:hover': {
                    borderColor: '#FFD700',
                    backgroundColor: 'rgba(255, 215, 0, 0.1)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(255, 215, 0, 0.3)'
                  }
                }}
              >
                <Heart size={20} style={{ marginRight: 8 }} />
                Mehr erfahren
              </Button>
            </Box>
          </Box>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Grid container spacing={{ xs: 2, md: 4 }} sx={{ mb: 8 }}>
            {communityStats.map((stat, index) => (
              <Grid item xs={6} md={3} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card sx={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    backdropFilter: 'blur(25px)',
                    borderRadius: 4,
                    border: '1px solid rgba(255,255,255,0.2)',
                    textAlign: 'center',
                    p: 3,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                      background: 'rgba(255, 255, 255, 0.12)',
                      border: '1px solid rgba(255,255,255,0.3)'
                    }
                  }}>
                    <CardContent>
                      <Box sx={{ 
                        color: '#FFD700', 
                        mb: 2,
                        filter: 'drop-shadow(0 0 10px rgba(255, 215, 0, 0.3))'
                      }}>
                        {stat.icon}
                      </Box>
                      <Typography variant="h4" sx={{ 
                        color: 'white', 
                        fontWeight: 700, 
                        mb: 1,
                        textShadow: '0 0 10px rgba(255, 255, 255, 0.3)'
                      }}>
                        {stat.value}
                      </Typography>
                      <Typography variant="body2" sx={{ 
                        color: 'rgba(255,255,255,0.8)',
                        textShadow: '0 0 5px rgba(255, 255, 255, 0.2)'
                      }}>
                        {stat.label}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Typography variant="h3" sx={{ 
            color: 'white', 
            textAlign: 'center', 
            fontWeight: 700, 
            mb: 6,
            background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 0 20px rgba(255, 215, 0, 0.3)'
          }}>
            Was macht unsere Community besonders?
          </Typography>
          
          <Grid container spacing={{ xs: 2, md: 4 }} sx={{ mb: 8 }}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={6} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card sx={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    backdropFilter: 'blur(25px)',
                    borderRadius: 4,
                    border: '1px solid rgba(255,255,255,0.2)',
                    height: '100%',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                      background: 'rgba(255, 255, 255, 0.12)',
                      border: '1px solid rgba(255,255,255,0.3)'
                    }
                  }}>
                    <CardContent sx={{ p: 4 }}>
                      <Box sx={{ 
                        display: 'inline-flex',
                        p: 3,
                        borderRadius: 4,
                        background: feature.color,
                        color: 'white',
                        mb: 3,
                        boxShadow: '0 8px 25px rgba(0,0,0,0.2)'
                      }}>
                        {feature.icon}
                      </Box>
                      <Typography variant="h5" sx={{ 
                        color: 'white', 
                        fontWeight: 600, 
                        mb: 2,
                        textShadow: '0 0 10px rgba(255, 255, 255, 0.3)'
                      }}>
                        {feature.title}
                      </Typography>
                      <Typography variant="body1" sx={{ 
                        color: 'rgba(255,255,255,0.8)',
                        lineHeight: 1.6,
                        textShadow: '0 0 5px rgba(255, 255, 255, 0.2)'
                      }}>
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>

        {/* Human Design Types */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Typography variant="h3" sx={{ 
            color: 'white', 
            textAlign: 'center', 
            fontWeight: 700, 
            mb: 6,
            background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 0 20px rgba(255, 215, 0, 0.3)'
          }}>
            Alle Human Design Typen willkommen
          </Typography>
          
          <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mb: 8 }}>
            {hdTypes.map((hdType, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card sx={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    backdropFilter: 'blur(25px)',
                    borderRadius: 4,
                    border: '1px solid rgba(255,255,255,0.2)',
                    textAlign: 'center',
                    p: 3,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                      background: 'rgba(255, 255, 255, 0.12)',
                      border: '1px solid rgba(255,255,255,0.3)'
                    }
                  }}>
                    <CardContent>
                      <Box sx={{
                        width: 70,
                        height: 70,
                        borderRadius: '50%',
                        backgroundColor: hdType.color,
                        mx: 'auto',
                        mb: 3,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: `0 8px 25px ${hdType.color}40`,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'scale(1.1)',
                          boxShadow: `0 12px 35px ${hdType.color}60`
                        }
                      }}>
                        <Typography variant="h5" sx={{ 
                          color: 'white', 
                          fontWeight: 700,
                          textShadow: '0 0 10px rgba(255, 255, 255, 0.3)'
                        }}>
                          {hdType.type.charAt(0)}
                        </Typography>
                      </Box>
                      <Typography variant="h6" sx={{ 
                        color: 'white', 
                        fontWeight: 600, 
                        mb: 2,
                        textShadow: '0 0 10px rgba(255, 255, 255, 0.3)'
                      }}>
                        {hdType.type}
                      </Typography>
                      <Typography variant="body2" sx={{ 
                        color: 'rgba(255,255,255,0.8)',
                        textShadow: '0 0 5px rgba(255, 255, 255, 0.2)'
                      }}>
                        {hdType.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Card sx={{
            background: 'rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(25px)',
            borderRadius: 4,
            border: '1px solid rgba(255,255,255,0.2)',
            textAlign: 'center',
            p: 6,
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'radial-gradient(circle at 50% 0%, rgba(255, 215, 0, 0.1) 0%, transparent 70%)',
              opacity: 0.6
            }
          }}>
            <CardContent sx={{ position: 'relative', zIndex: 2 }}>
              <Typography variant="h4" sx={{ 
                color: 'white', 
                fontWeight: 700, 
                mb: 3,
                textShadow: '0 0 20px rgba(255, 255, 255, 0.3)'
              }}>
                Bereit, Teil unserer Community zu werden?
              </Typography>
              <Typography variant="h6" sx={{ 
                color: 'rgba(255,255,255,0.8)', 
                mb: 4,
                maxWidth: 600,
                mx: 'auto',
                textShadow: '0 0 10px rgba(255, 255, 255, 0.2)'
              }}>
                Tausche dich mit Gleichgesinnten aus, lerne von Experten und finde Menschen, die zu deinem Human Design passen.
              </Typography>
              <Box sx={{ 
                display: 'flex', 
                gap: { xs: 1, sm: 2 }, 
                justifyContent: 'center', 
                flexWrap: 'wrap',
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: 'center'
              }}>
                <Button
                  component={Link}
                  href="/community"
                  variant="contained"
                  size="large"
                  fullWidth
                  sx={{
                    background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
                    px: { xs: 3, sm: 4 },
                    py: 2,
                    borderRadius: 3,
                    fontWeight: 600,
                    minWidth: { xs: '100%', sm: 'auto' },
                    '&:hover': {
                      background: 'linear-gradient(135deg, #7C3AED 0%, #DB2777 100%)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 25px rgba(139, 92, 246, 0.4)'
                    }
                  }}
                >
                  <Users size={20} style={{ marginRight: 8 }} />
                  Community beitreten
                </Button>
                <Button
                  component={Link}
                  href="/register"
                  variant="outlined"
                  size="large"
                  fullWidth
                  sx={{
                    borderColor: 'rgba(255, 215, 0, 0.3)',
                    color: '#FFD700',
                    fontWeight: 600,
                    px: { xs: 3, sm: 4 },
                    py: 2,
                    borderRadius: 3,
                    minWidth: { xs: '100%', sm: 'auto' },
                    '&:hover': {
                      borderColor: '#FFD700',
                      backgroundColor: 'rgba(255, 215, 0, 0.1)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 25px rgba(255, 215, 0, 0.3)'
                    }
                  }}
                >
                  <Heart size={20} style={{ marginRight: 8 }} />
                  Kostenlos registrieren
                </Button>
              </Box>
            </CardContent>
          </Card>
        </motion.div>
      </Container>
    </Box>
  );
}
