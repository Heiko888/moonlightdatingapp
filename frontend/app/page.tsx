"use client";

import React from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Button, 
  Stack,
  Paper,
  Grid
} from '@mui/material';
import { 
  Heart, 
  Users, 
  BookOpen,
  Moon,
  Star,
  Target,
  Calendar,
  ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function HomePage() {
  const features = [
    {
      icon: <Heart size={32} />,
      title: "Human Design Dating",
      description: "Finde Menschen, die zu deinem Human Design passen",
      color: "#ff6b9d"
    },
    {
      icon: <BookOpen size={32} />,
      title: "Persönliche Readings",
      description: "Erhalte tiefe Einblicke in dein Human Design",
      color: "#8b5cf6"
    },
    {
      icon: <Users size={32} />,
      title: "Community",
      description: "Verbinde dich mit Gleichgesinnten",
      color: "#06b6d4"
    },
    {
      icon: <Moon size={32} />,
      title: "Mondkalender",
      description: "Verfolge die kosmischen Zyklen",
      color: "#10b981"
    }
  ];

  const stats = [
    { label: "Aktive Mitglieder", value: "2,500+" },
    { label: "Erfolgreiche Matches", value: "500+" },
    { label: "Community Events", value: "25+" },
    { label: "Zufriedene Nutzer", value: "98%" }
  ];

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 25%, #16213e 50%, #0f3460 75%, #533483 100%)',
      position: 'relative'
    }}>
      
      {/* Navigation */}
      <Box sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: 'rgba(15, 15, 35, 0.9)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <Container maxWidth="lg">
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            py: 2
          }}>
            <Typography variant="h5" sx={{
              background: 'linear-gradient(135deg, #ff6b9d, #4ecdc4)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 800
            }}>
              🌟 HD App
            </Typography>
            
            <Stack direction="row" spacing={2}>
              <Button
                component={Link}
                href="/login"
                variant="outlined"
                sx={{
                  borderColor: 'rgba(255,255,255,0.3)',
                  color: 'white',
                  '&:hover': {
                    borderColor: '#4ecdc4',
                    backgroundColor: 'rgba(78, 205, 196, 0.1)'
                  }
                }}
              >
                Anmelden
              </Button>
              <Button
                component={Link}
                href="/register"
                variant="contained"
                sx={{
                  background: 'linear-gradient(45deg, #ff6b9d, #4ecdc4)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #e55a8a, #3bb5b0)'
                  }
                }}
              >
                Registrieren
              </Button>
            </Stack>
          </Box>
        </Container>
      </Box>

      {/* Hero Section */}
      <Container maxWidth="lg" sx={{ pt: 20, pb: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography variant="h1" sx={{
            color: '#e6e6fa',
            textShadow: '0 0 20px rgba(230, 230, 250, 0.8), 0 0 40px rgba(230, 230, 250, 0.6)',
            fontWeight: 800,
            mb: 3,
            fontSize: { xs: '2.5rem', md: '4rem' }
          }}>
            Kosmische Verbindungen
          </Typography>
          
          <Typography variant="h5" sx={{
            color: 'rgba(255,255,255,0.8)',
            mb: 4,
            maxWidth: 600,
            mx: 'auto',
            lineHeight: 1.6
          }}>
            Verbinde dich mit Menschen, die zu deinem kosmischen Design passen. 
            Finde Liebe, Freundschaft und persönliches Wachstum.
          </Typography>
          
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center" sx={{ flexWrap: 'wrap' }}>
            <Button
              component={Link}
              href="/register"
              variant="contained"
              size="large"
              sx={{
                background: 'linear-gradient(45deg, #ff6b9d, #4ecdc4)',
                px: 4,
                py: 2,
                borderRadius: 3,
                fontWeight: 600,
                minWidth: { xs: '100%', sm: 'auto' },
                '&:hover': {
                  background: 'linear-gradient(45deg, #e55a8a, #3bb5b0)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 25px rgba(255, 107, 157, 0.3)'
                }
              }}
            >
              <Heart size={20} style={{ marginRight: 8 }} />
              Jetzt starten
            </Button>
            
            <Button
              component={Link}
              href="/community-info"
              variant="outlined"
              size="large"
              sx={{
                borderColor: 'rgba(255,255,255,0.3)',
                color: 'white',
                px: 4,
                py: 2,
                borderRadius: 3,
                fontWeight: 600,
                minWidth: { xs: '100%', sm: 'auto' },
                '&:hover': {
                  borderColor: '#4ecdc4',
                  backgroundColor: 'rgba(78, 205, 196, 0.1)',
                  transform: 'translateY(-2px)'
                }
              }}
            >
              <Users size={20} style={{ marginRight: 8 }} />
              Mehr erfahren
            </Button>

            <Button
              component={Link}
              href="/sitemap"
              variant="outlined"
              size="large"
              sx={{
                borderColor: 'rgba(255,255,255,0.3)',
                color: 'white',
                px: 4,
                py: 2,
                borderRadius: 3,
                fontWeight: 600,
                minWidth: { xs: '100%', sm: 'auto' },
                '&:hover': {
                  borderColor: '#8b5cf6',
                  backgroundColor: 'rgba(139, 92, 246, 0.1)',
                  transform: 'translateY(-2px)'
                }
              }}
            >
              <BookOpen size={20} style={{ marginRight: 8 }} />
              Seitenübersicht
            </Button>
          </Stack>
        </Box>

        {/* Stats */}
        <Grid container spacing={3} sx={{ mb: 8 }}>
          {stats.map((stat, index) => (
            <Grid item xs={6} md={3} key={index}>
              <Paper sx={{
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: 3,
                border: '1px solid rgba(255,255,255,0.2)',
                textAlign: 'center',
                p: 3,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  background: 'rgba(255, 255, 255, 0.15)'
                }
              }}>
                <Typography variant="h4" sx={{ 
                  color: 'white', 
                  fontWeight: 700, 
                  mb: 1
                }}>
                  {stat.value}
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: 'rgba(255,255,255,0.7)'
                }}>
                  {stat.label}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Features */}
        <Typography variant="h3" sx={{ 
          color: 'white', 
          textAlign: 'center', 
          fontWeight: 700, 
          mb: 6,
          background: 'linear-gradient(135deg, #ff6b9d, #4ecdc4)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Was macht uns besonders?
        </Typography>
        
        <Grid container spacing={3} sx={{ mb: 8 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Paper sx={{
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: 3,
                border: '1px solid rgba(255,255,255,0.2)',
                p: 4,
                height: '100%',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  background: 'rgba(255, 255, 255, 0.15)'
                }
              }}>
                <Box sx={{ 
                  display: 'inline-flex',
                  p: 2,
                  borderRadius: 2,
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
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* CTA */}
        <Paper sx={{
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: 3,
          border: '1px solid rgba(255,255,255,0.2)',
          textAlign: 'center',
          p: 6
        }}>
          <Typography variant="h4" sx={{ 
            color: 'white', 
            fontWeight: 700, 
            mb: 3
          }}>
            Bereit für deine kosmische Reise?
          </Typography>
          <Typography variant="h6" sx={{ 
            color: 'rgba(255,255,255,0.8)', 
            mb: 4,
            maxWidth: 600,
            mx: 'auto'
          }}>
            Starte noch heute und entdecke, wer du wirklich bist.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
            <Button
              component={Link}
              href="/register"
              variant="contained"
              size="large"
              sx={{
                background: 'linear-gradient(45deg, #ff6b9d, #4ecdc4)',
                px: 4,
                py: 2,
                borderRadius: 3,
                fontWeight: 600,
                '&:hover': {
                  background: 'linear-gradient(45deg, #e55a8a, #3bb5b0)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 25px rgba(255, 107, 157, 0.3)'
                }
              }}
            >
              <Heart size={20} style={{ marginRight: 8 }} />
              Kostenlos registrieren
            </Button>
            <Button
              component={Link}
              href="/login"
              variant="outlined"
              size="large"
              sx={{
                borderColor: 'rgba(255,255,255,0.3)',
                color: 'white',
                px: 4,
                py: 2,
                borderRadius: 3,
                fontWeight: 600,
                '&:hover': {
                  borderColor: '#4ecdc4',
                  backgroundColor: 'rgba(78, 205, 196, 0.1)',
                  transform: 'translateY(-2px)'
                }
              }}
            >
              <ArrowRight size={20} style={{ marginRight: 8 }} />
              Bereits Mitglied?
            </Button>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}