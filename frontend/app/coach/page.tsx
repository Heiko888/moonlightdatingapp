'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Book as BookIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function CoachHome() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const menuItems = [
    {
      title: 'Dashboard',
      description: 'Übersicht über deine Aktivitäten und Statistiken',
      icon: DashboardIcon,
      path: '/coach/dashboard',
      color: '#e8b86d',
    },
    {
      title: 'Readings verwalten',
      description: 'Alle erstellten Readings anzeigen, bearbeiten und exportieren',
      icon: BookIcon,
      path: '/coach/readings',
      color: '#4fc3f7',
    },
    {
      title: 'Neues Reading erstellen',
      description: 'Human Design oder Connection Key Reading für Klienten erstellen',
      icon: AddIcon,
      path: '/coach/readings/create',
      color: '#4caf50',
    },
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: '#000000',
        position: 'relative',
        pt: 4,
        pb: 8,
      }}
    >
      <Container maxWidth="lg">
        {/* Logo */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Box sx={{ position: 'relative', width: '100%', maxWidth: 600, height: 280, mx: 'auto' }}>
            <Image
              src="/images/connection-key-logo.png"
              alt="The Connection Key"
              fill
              style={{ objectFit: 'contain' }}
              priority
              sizes="(max-width: 768px) 100vw, 600px"
            />
          </Box>
        </Box>

        {/* Willkommenstext */}
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Typography
            variant="h3"
            sx={{
              color: '#ffffff',
              fontWeight: 700,
              mb: 2,
            }}
          >
            Willkommen im Coach-Bereich
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: 'rgba(255, 255, 255, 0.7)',
              fontWeight: 300,
              maxWidth: 600,
              mx: 'auto',
            }}
          >
            Erstelle professionelle Human Design Readings und verwalte deine Klienten
          </Typography>
        </Box>

        {/* Navigations-Karten */}
        <Grid container spacing={4}>
          {menuItems.map((item, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card
                sx={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: `0 12px 40px ${item.color}40`,
                    borderColor: item.color,
                  },
                }}
                onClick={() => router.push(item.path)}
              >
                <CardContent
                  sx={{
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    p: 4,
                  }}
                >
                  {/* Icon */}
                  <Box
                    sx={{
                      mb: 3,
                      p: 3,
                      borderRadius: '50%',
                      background: `${item.color}20`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minWidth: 120,
                      minHeight: 120,
                    }}
                  >
                    {mounted && <item.icon sx={{ fontSize: 60, color: item.color }} />}
                  </Box>

                  {/* Titel */}
                  <Typography
                    variant="h5"
                    sx={{
                      color: '#ffffff',
                      fontWeight: 600,
                      mb: 2,
                    }}
                  >
                    {item.title}
                  </Typography>

                  {/* Beschreibung */}
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      mb: 3,
                      flexGrow: 1,
                    }}
                  >
                    {item.description}
                  </Typography>

                  {/* Button */}
                  <Button
                    variant="contained"
                    fullWidth
                    sx={{
                      background: `linear-gradient(135deg, ${item.color} 0%, ${item.color}cc 100%)`,
                      color: '#000',
                      fontWeight: 600,
                      py: 1.5,
                      '&:hover': {
                        background: `linear-gradient(135deg, ${item.color}cc 0%, ${item.color} 100%)`,
                      },
                    }}
                  >
                    Öffnen
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Hilfebereich */}
        <Box
          sx={{
            mt: 8,
            p: 4,
            background: 'rgba(232, 184, 109, 0.1)',
            borderRadius: 3,
            border: '1px solid rgba(232, 184, 109, 0.3)',
            textAlign: 'center',
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: '#e8b86d',
              fontWeight: 600,
              mb: 2,
            }}
          >
            💡 Schnellstart
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: 'rgba(255, 255, 255, 0.9)',
              mb: 3,
            }}
          >
            <strong>Neu hier?</strong> Starte mit einem neuen Reading! Gebe die Geburtsdaten ein, 
            nutze den Gate Calculator für präzise Berechnungen und exportiere dein professionelles PDF.
          </Typography>
          <Button
            variant="outlined"
            size="large"
            startIcon={mounted ? <AddIcon /> : undefined}
            onClick={() => router.push('/coach/readings/create')}
            sx={{
              borderColor: '#e8b86d',
              color: '#e8b86d',
              fontWeight: 600,
              px: 4,
              '&:hover': {
                borderColor: '#ffd89b',
                background: 'rgba(232, 184, 109, 0.1)',
              },
            }}
          >
            Erstes Reading erstellen
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

