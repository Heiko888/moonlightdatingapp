"use client";
import React from 'react';
import { Box, Typography, Container } from '@mui/material';

export default function TestPage() {
  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0F0F23 0%, #1A1A2E 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <Container maxWidth="md" sx={{ textAlign: 'center' }}>
        <Typography 
          variant="h2" 
          sx={{ 
            color: '#ff6b9d',
            mb: 2,
            fontWeight: 800
          }}
        >
          ✅ Test erfolgreich!
        </Typography>
        <Typography 
          variant="h5" 
          sx={{ 
            color: 'white',
            mb: 4
          }}
        >
          Die App funktioniert grundsätzlich.
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            color: 'rgba(255,255,255,0.8)'
          }}
        >
          Wenn Sie diese Seite sehen, ist die Grundfunktionalität in Ordnung.
        </Typography>
      </Container>
    </Box>
  );
}
