"use client";

import React from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { MessageCircle, Users, Bot } from 'lucide-react';
import UnifiedPageLayout from '@/components/UnifiedPageLayout';
import Link from 'next/link';

export default function ChatNewPage() {
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
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2, py: { xs: 4, md: 8 }, px: { xs: 1, sm: 2 } }}>
        {/* Header */}
        <Box textAlign="center" mb={6}>
          <Typography 
            variant="h2" 
            sx={{ 
              fontWeight: 'bold', 
              mb: 2,
              background: 'linear-gradient(135deg, #ff6b9d, #4ecdc4)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: { xs: '2.5rem', md: '3.5rem' }
            }}
          >
            💬 Chat-System
          </Typography>
          <Typography 
            variant="h5" 
            sx={{ 
              color: 'rgba(255,255,255,0.8)', 
              fontWeight: 300,
              maxWidth: '600px',
              mx: 'auto',
              lineHeight: 1.6
            }}
          >
            Verbinde dich mit der Community und nutze die verfügbaren Chat-Funktionen
          </Typography>
        </Box>

        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h4" sx={{ color: 'white', mb: 4 }}>
            🚀 Chat-Funktionen verfügbar
          </Typography>
        
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Box sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
              gap: 3,
              mb: 4
            }}>
              <Box sx={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '16px',
                p: 4,
                textAlign: 'center'
              }}>
                <MessageCircle size={48} color="#4ecdc4" style={{ marginBottom: 16 }} />
                <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                  Community Chat
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 3 }}>
                  Direktnachrichten und Community-Diskussionen
                </Typography>
                <Button
                  component={Link}
                  href="/community"
                  variant="contained"
                  sx={{
                    background: 'linear-gradient(135deg, #ff6b9d, #c44569)',
                    color: 'white',
                    fontWeight: 600,
                    px: 3,
                    borderRadius: 3,
                    '&:hover': {
                      background: 'linear-gradient(135deg, #ff5a8a, #b83a5a)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 25px rgba(255, 107, 157, 0.3)'
                    }
                  }}
                >
                  Community öffnen
                </Button>
              </Box>

              <Box sx={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '16px',
                p: 4,
                textAlign: 'center'
              }}>
                <Bot size={48} color="#ff6b9d" style={{ marginBottom: 16 }} />
                <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                  AI Chat
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 3 }}>
                  KI-gestützte Human Design Beratung
                </Typography>
                <Button
                  component={Link}
                  href="/ai-chat"
                  variant="contained"
                  sx={{
                    background: 'linear-gradient(135deg, #4ecdc4, #44a08d)',
                    color: 'white',
                    fontWeight: 600,
                    px: 3,
                    borderRadius: 3,
                    '&:hover': {
                      background: 'linear-gradient(135deg, #44a08d, #4ecdc4)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 25px rgba(78, 205, 196, 0.3)'
                    }
                  }}
                >
                  AI Chat öffnen
                </Button>
              </Box>
            </Box>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Box sx={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '16px',
              p: 4,
              mb: 4
            }}>
              <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                📱 Verfügbare Chat-Funktionen:
              </Typography>
              <Box sx={{ textAlign: 'left', maxWidth: '600px', mx: 'auto' }}>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mb: 1 }}>
                  • Community-Nachrichten und Direktnachrichten
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mb: 1 }}>
                  • AI-Chat für personalisierte Human Design Beratung
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mb: 1 }}>
                  • Echtzeit-Messaging mit WebSocket-Technologie
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mb: 1 }}>
                  • Online-Status und Benachrichtigungen
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                  • Kompatibilitäts-Checks zwischen Community-Mitgliedern
                </Typography>
              </Box>
            </Box>
          </motion.div>
        </Box>
      </Container>
    </Box>
  );
}