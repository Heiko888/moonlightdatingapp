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
      background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 25%, #533483 50%, #8B5CF6 75%, #A855F7 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <AnimatedStars />
      
      <Container maxWidth="lg" sx={{ py: 8, position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <motion.div
          
          
          
        >
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography variant="h2" sx={{
              background: 'linear-gradient(135deg, #ffffff 0%, #e0e7ff 50%, #c7d2fe 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 800,
              mb: 3
            }}>
              🌟 Kosmische Verbindungen Community
            </Typography>
            <Typography variant="h5" sx={{
              color: 'rgba(255,255,255,0.8)',
              mb: 4,
              maxWidth: 600,
              mx: 'auto'
            }}>
              Die größte Human Design Community im deutschsprachigen Raum
            </Typography>
            <Button
              component={Link}
              href="/community"
              variant="contained"
              size="large"
              sx={{
                background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                color: '#1f2937',
                fontWeight: 700,
                px: 4,
                py: 2,
                fontSize: '1.1rem',
                '&:hover': {
                  background: 'linear-gradient(135deg, #FFA500 0%, #FFD700 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 25px rgba(255, 215, 0, 0.4)'
                }
              }}
            >
              Community beitreten
              <ArrowRight size={20} style={{ marginLeft: 8 }} />
            </Button>
          </Box>
        </motion.div>

        {/* Stats */}
        <motion.div
          
          
          
        >
          <Grid container spacing={4} sx={{ mb: 8 }}>
            {communityStats.map((stat, index) => (
              <Grid item xs={6} md={3} key={index}>
                <Card sx={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: 3,
                  border: '1px solid rgba(255,255,255,0.2)',
                  textAlign: 'center',
                  p: 3
                }}>
                  <CardContent>
                    <Box sx={{ color: '#FFD700', mb: 2 }}>
                      {stat.icon}
                    </Box>
                    <Typography variant="h4" sx={{ color: 'white', fontWeight: 700, mb: 1 }}>
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                      {stat.label}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </motion.div>

        {/* Features */}
        <motion.div
          
          
          
        >
          <Typography variant="h3" sx={{ 
            color: 'white', 
            textAlign: 'center', 
            fontWeight: 700, 
            mb: 6 
          }}>
            Was macht unsere Community besonders?
          </Typography>
          
          <Grid container spacing={4} sx={{ mb: 8 }}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Card sx={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: 3,
                  border: '1px solid rgba(255,255,255,0.2)',
                  height: '100%',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
                  }
                }}>
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ 
                      display: 'inline-flex',
                      p: 2,
                      borderRadius: 3,
                      background: feature.color,
                      color: 'white',
                      mb: 3
                    }}>
                      {feature.icon}
                    </Box>
                    <Typography variant="h5" sx={{ 
                      color: 'white', 
                      fontWeight: 600, 
                      mb: 2 
                    }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body1" sx={{ 
                      color: 'rgba(255,255,255,0.8)',
                      lineHeight: 1.6
                    }}>
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </motion.div>

        {/* Human Design Types */}
        <motion.div
          
          
          
        >
          <Typography variant="h3" sx={{ 
            color: 'white', 
            textAlign: 'center', 
            fontWeight: 700, 
            mb: 6 
          }}>
            Alle Human Design Typen willkommen
          </Typography>
          
          <Grid container spacing={3} sx={{ mb: 8 }}>
            {hdTypes.map((hdType, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card sx={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: 3,
                  border: '1px solid rgba(255,255,255,0.2)',
                  textAlign: 'center',
                  p: 3
                }}>
                  <CardContent>
                    <Box sx={{
                      width: 60,
                      height: 60,
                      borderRadius: '50%',
                      backgroundColor: hdType.color,
                      mx: 'auto',
                      mb: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Typography variant="h6" sx={{ color: 'white', fontWeight: 700 }}>
                        {hdType.type.charAt(0)}
                      </Typography>
                    </Box>
                    <Typography variant="h6" sx={{ 
                      color: 'white', 
                      fontWeight: 600, 
                      mb: 1 
                    }}>
                      {hdType.type}
                    </Typography>
                    <Typography variant="body2" sx={{ 
                      color: 'rgba(255,255,255,0.7)' 
                    }}>
                      {hdType.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </motion.div>

        {/* CTA */}
        <motion.div
          
          
          
        >
          <Card sx={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            borderRadius: 4,
            border: '1px solid rgba(255,255,255,0.2)',
            textAlign: 'center',
            p: 6
          }}>
            <CardContent>
              <Typography variant="h4" sx={{ 
                color: 'white', 
                fontWeight: 700, 
                mb: 3 
              }}>
                Bereit, Teil unserer Community zu werden?
              </Typography>
              <Typography variant="h6" sx={{ 
                color: 'rgba(255,255,255,0.8)', 
                mb: 4,
                maxWidth: 600,
                mx: 'auto'
              }}>
                Tausche dich mit Gleichgesinnten aus, lerne von Experten und finde Menschen, die zu deinem Human Design passen.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Button
                  component={Link}
                  href="/community"
                  variant="contained"
                  size="large"
                  sx={{
                    background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                    color: '#1f2937',
                    fontWeight: 700,
                    px: 4,
                    py: 2,
                    '&:hover': {
                      background: 'linear-gradient(135deg, #FFA500 0%, #FFD700 100%)',
                      transform: 'translateY(-2px)'
                    }
                  }}
                >
                  Community beitreten
                  <ArrowRight size={20} style={{ marginLeft: 8 }} />
                </Button>
                <Button
                  component={Link}
                  href="/register"
                  variant="outlined"
                  size="large"
                  sx={{
                    borderColor: 'rgba(255, 215, 0, 0.3)',
                    color: '#FFD700',
                    fontWeight: 600,
                    px: 4,
                    py: 2,
                    '&:hover': {
                      borderColor: '#FFD700',
                      backgroundColor: 'rgba(255, 215, 0, 0.1)'
                    }
                  }}
                >
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
