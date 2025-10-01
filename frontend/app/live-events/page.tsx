"use client";
import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import { motion } from 'framer-motion';
import LiveEventsSystem from '@/components/LiveEventsSystem';
import AnimatedStars from '@/components/AnimatedStars';

export default function LiveEventsPage() {
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
              🎥 Live Events
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: 'rgba(255,255,255,0.8)',
                maxWidth: 600,
                mx: 'auto'
              }}
            >
              Nimm teil an Live-Workshops, Q&A Sessions und Meditationssessions
            </Typography>
          </Box>
        </motion.div>

        {/* Live Events System Component */}
        <motion.div
          
          
          
        >
          <LiveEventsSystem />
        </motion.div>
      </Container>
    </Box>
  );
}
