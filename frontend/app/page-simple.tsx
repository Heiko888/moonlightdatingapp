"use client";
import React from 'react';
import { Box, Typography, Container, Button } from '@mui/material';
import Link from 'next/link';

export default function SimpleHomePage() {
  return (
    <Box sx={{
      minHeight: '100vh',
      background: `
        radial-gradient(circle at 20% 20%, rgba(255, 107, 157, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 80% 80%, rgba(78, 205, 196, 0.1) 0%, transparent 50%),
        linear-gradient(135deg, #0F0F23 0%, #1A1A2E 100%)
      `,
      position: 'relative',
      overflow: 'hidden'
    }}>
      <Container maxWidth="lg" sx={{ py: 8, position: 'relative', zIndex: 2 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography
            variant="h1"
            sx={{
              background: 'linear-gradient(135deg, #ff6b9d, #c44569, #4ecdc4)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 800,
              fontSize: { xs: '2.5rem', md: '4rem' },
              mb: 3,
              textShadow: '0 0 30px rgba(255, 107, 157, 0.3)'
            }}
          >
            🌟 Human Design App
          </Typography>
          <Typography 
            variant="h5" 
            sx={{ 
              color: 'rgba(255,255,255,0.8)', 
              mb: 4,
              fontSize: { xs: '1.1rem', md: '1.3rem' },
              maxWidth: '600px',
              mx: 'auto',
              lineHeight: 1.6
            }}
          >
            Entdecke dein energetisches Potenzial und finde die Liebe deines Lebens.
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button
            component={Link}
            href="/login"
            variant="contained"
            size="large"
            sx={{
              background: 'linear-gradient(45deg, #ff6b9d, #4ecdc4)',
              color: 'white',
              fontWeight: 600,
              px: 4,
              py: 1.5,
              borderRadius: 2,
              '&:hover': {
                background: 'linear-gradient(45deg, #e55a8a, #3bb5b0)',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 25px rgba(255, 107, 157, 0.3)'
              }
            }}
          >
            Anmelden
          </Button>
          <Button
            component={Link}
            href="/register"
            variant="outlined"
            size="large"
            sx={{
              borderColor: 'rgba(255,255,255,0.3)',
              color: 'white',
              fontWeight: 600,
              px: 4,
              py: 1.5,
              borderRadius: 2,
              '&:hover': {
                borderColor: 'white',
                background: 'rgba(255,255,255,0.1)'
              }
            }}
          >
            Registrieren
          </Button>
        </Box>

        <Box sx={{ mt: 8, display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button
            component={Link}
            href="/test"
            variant="text"
            sx={{ color: 'rgba(255,255,255,0.7)' }}
          >
            Test-Seite
          </Button>
          <Button
            component={Link}
            href="/dating"
            variant="text"
            sx={{ color: 'rgba(255,255,255,0.7)' }}
          >
            Dating
          </Button>
          <Button
            component={Link}
            href="/mondkalender"
            variant="text"
            sx={{ color: 'rgba(255,255,255,0.7)' }}
          >
            Mondkalender
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
