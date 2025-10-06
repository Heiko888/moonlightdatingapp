"use client";

import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import SSRSafeStars from './SSRSafeStars';

interface UnifiedPageLayoutProps {
  title: string;
  subtitle?: string;
  description?: string;
  children: React.ReactNode;
  showStars?: boolean;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
}

export default function UnifiedPageLayout({
  title,
  subtitle,
  description,
  children,
  showStars = true,
  maxWidth = 'lg'
}: UnifiedPageLayoutProps) {
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
      {showStars && <SSRSafeStars />}
      
      <Container maxWidth={maxWidth} sx={{ position: 'relative', zIndex: 2, py: { xs: 4, md: 8 }, px: { xs: 1, sm: 2 } }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Box sx={{ 
            textAlign: 'center', 
            mb: 6,
            py: { xs: 4, md: 6 }
          }}>
            <Typography
              variant="h2"
              sx={{
                background: 'linear-gradient(135deg, #ff6b9d, #c44569, #4ecdc4)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 800,
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                mb: 2,
                textShadow: '0 0 30px rgba(255, 107, 157, 0.3)'
              }}
            >
              {title}
            </Typography>
            
            {subtitle && (
              <Typography 
                variant="h5" 
                sx={{ 
                  color: 'rgba(255,255,255,0.8)', 
                  mb: 3,
                  fontSize: { xs: '1.1rem', md: '1.3rem' },
                  maxWidth: '600px',
                  mx: 'auto',
                  lineHeight: 1.6
                }}
              >
                {subtitle}
              </Typography>
            )}
            
            {description && (
              <Typography 
                variant="body1" 
                sx={{ 
                  color: 'rgba(255,255,255,0.7)', 
                  maxWidth: '800px',
                  mx: 'auto',
                  lineHeight: 1.6
                }}
              >
                {description}
              </Typography>
            )}
          </Box>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {children}
        </motion.div>
      </Container>
    </Box>
  );
}
