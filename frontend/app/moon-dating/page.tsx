"use client";
import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import { motion } from 'framer-motion';
import MoonDatingGuide from '@/components/MoonDatingGuide';
import AnimatedStars from '@/components/AnimatedStars';

export default function MoonDatingPage() {
  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0F0F23 0%, #1A1A2E 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <AnimatedStars />
      
      <Container maxWidth="lg" sx={{ py: 4, position: 'relative', zIndex: 2 }}>
        {/* Header */}
        <motion.div
          
          
          
        >
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography
              variant="h2"
              sx={{
                color: 'white',
                mb: 3,
                fontWeight: 800,
                fontSize: { xs: '2rem', md: '3rem' },
                textShadow: '0 0 20px rgba(255, 255, 255, 0.3)'
              }}
            >
              🌙 Mondkalender-Dating
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: 'rgba(255,255,255,0.8)',
                maxWidth: 600,
                mx: 'auto'
              }}
            >
              Plane deine Dates nach den Mondzyklen für optimale Verbindungen
            </Typography>
          </Box>
        </motion.div>

        {/* Moon Dating Guide Component */}
        <motion.div
          
          
          
        >
          <MoonDatingGuide />
        </motion.div>
      </Container>
    </Box>
  );
}
