"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Box, Typography, Button, Container, Paper } from '@mui/material';
import { Shield, ArrowLeft, Home } from 'lucide-react';

const UnauthorizedPage: React.FC = () => {
  const router = useRouter();

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
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      py: 4
    }}>
      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 2 }}>
        <Paper 
          elevation={24} 
          sx={{ 
            p: 6,
            background: 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 4,
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
            textAlign: 'center'
          }}
        >
          <Shield size={80} color="#ff6b9d" style={{ marginBottom: '24px' }} />
          
          <Typography 
            variant="h3" 
            component="h1" 
            gutterBottom 
            sx={{ 
              mb: 3,
              background: 'linear-gradient(135deg, #ff6b9d, #c44569, #4ecdc4)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 800,
              fontSize: { xs: '2rem', md: '2.5rem' }
            }}
          >
            🚫 Zugriff verweigert
          </Typography>
        
          <Typography 
            variant="h5" 
            sx={{ 
              mb: 4, 
              color: 'rgba(255,255,255,0.9)',
              fontWeight: 600
            }}
          >
            Admin-Bereich
          </Typography>

          <Typography 
            variant="body1" 
            sx={{ 
              mb: 4, 
              color: 'rgba(255,255,255,0.8)',
              fontSize: '1.1rem',
              lineHeight: 1.6
            }}
          >
            Sie haben keine Berechtigung, auf diesen Bereich zuzugreifen.
            <br />
            Nur Administratoren können diese Seite besuchen.
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              onClick={() => router.push('/')}
              startIcon={<Home size={20} />}
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
              Zur Startseite
            </Button>

            <Button
              variant="outlined"
              onClick={() => router.back()}
              startIcon={<ArrowLeft size={20} />}
              sx={{
                borderColor: 'rgba(255,255,255,0.3)',
                color: 'rgba(255,255,255,0.9)',
                fontWeight: 600,
                px: 4,
                py: 1.5,
                borderRadius: 2,
                '&:hover': {
                  borderColor: '#ff6b9d',
                  backgroundColor: 'rgba(255, 107, 157, 0.1)',
                  color: '#ff6b9d'
                }
              }}
            >
              Zurück
            </Button>
          </Box>

          <Typography 
            variant="body2" 
            sx={{ 
              mt: 4, 
              color: 'rgba(255,255,255,0.6)',
              fontSize: '0.9rem'
            }}
          >
            Falls Sie glauben, dass dies ein Fehler ist, wenden Sie sich an den Support.
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default UnauthorizedPage;
