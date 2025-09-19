import React from 'react';
import { Box, Paper, Typography, Button } from '@mui/material';
import Link from 'next/link';

// Für statischen Export - generiere statische Parameter
export async function generateStaticParams() {
  // Beispiel-IDs für statischen Export
  return [
    { id: 'example-1' },
    { id: 'example-2' },
    { id: 'example-3' }
  ];
}

export default function ChartPage({ params }: { params: { id: string } }) {
  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      p: 4,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <Paper sx={{ 
        p: 6, 
        borderRadius: 4,
        background: 'rgba(254, 243, 199, 0.1)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(254, 243, 199, 0.2)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
        textAlign: 'center',
        maxWidth: 600
      }}>
        <Typography variant="h4" sx={{ color: '#fef3c7', fontWeight: 700, mb: 3 }}>
          Chart: {params.id}
        </Typography>
        
        <Typography variant="body1" sx={{ color: 'rgba(254, 243, 199, 0.8)', mb: 4 }}>
          Diese Seite ist für den statischen Export optimiert. 
          Die vollständige Funktionalität ist in der dynamischen Version verfügbar.
        </Typography>
        
        <Button 
          component={Link} 
          href="/dashboard" 
          variant="contained"
          sx={{ 
            background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
            color: '#1f2937',
            px: 4,
            py: 2,
            '&:hover': {
              background: 'linear-gradient(135deg, #fde68a 0%, #fef3c7 100%)'
            }
          }}
        >
          Zurück zum Dashboard
        </Button>
      </Paper>
    </Box>
  );
}