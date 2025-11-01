'use client';

import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  Grid,
  Stack,
} from '@mui/material';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Key, 
  Heart, 
  ArrowRight, 
  Star, 
  Sparkles,
  Users,
  Zap,
  Target,
} from 'lucide-react';

// Sparkle-Positionen für animierte Hintergrund-Funken
const sparklePositions = [
  { left: 15, top: 20 }, { left: 75, top: 35 }, { left: 45, top: 60 },
  { left: 85, top: 15 }, { left: 25, top: 80 }, { left: 65, top: 45 },
  { left: 10, top: 55 }, { left: 90, top: 70 }, { left: 35, top: 25 },
  { left: 55, top: 85 }, { left: 70, top: 10 }, { left: 30, top: 90 },
  { left: 50, top: 40 }, { left: 20, top: 65 }, { left: 80, top: 50 }
];

const sparkleAnimations = [
  { duration: 2.5, delay: 0.3 }, { duration: 3.2, delay: 1.1 }, { duration: 2.8, delay: 0.7 },
  { duration: 3.5, delay: 1.5 }, { duration: 2.3, delay: 0.5 }, { duration: 3.8, delay: 1.8 },
  { duration: 2.6, delay: 0.9 }, { duration: 3.0, delay: 1.2 }, { duration: 2.9, delay: 0.4 },
  { duration: 3.3, delay: 1.6 }, { duration: 2.7, delay: 0.8 }, { duration: 3.6, delay: 1.4 },
  { duration: 2.4, delay: 0.6 }, { duration: 3.1, delay: 1.3 }, { duration: 2.5, delay: 0.9 }
];

const features = [
  {
    icon: <Heart size={32} />,
    title: 'Resonanz',
    description: 'Entdecke die energetische Verbindung zwischen zwei Menschen',
  },
  {
    icon: <Sparkles size={32} />,
    title: 'Goldadern',
    description: 'Sieh die unsichtbaren Linien der Verbindung',
  },
  {
    icon: <Target size={32} />,
    title: 'Bewusstsein',
    description: 'Verstehe, was zwischen euch wirklich passiert',
  },
  {
    icon: <Zap size={32} />,
    title: 'Transformation',
    description: 'Erkenne die energetische Sprache, die euch verbindet',
  },
];

export default function ConnectionKeyPage() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `
          radial-gradient(circle at 20% 20%, rgba(242, 159, 5, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 80% 80%, rgba(140, 29, 4, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 40% 60%, rgba(242, 159, 5, 0.08) 0%, transparent 50%),
          linear-gradient(180deg, #0b0a0f 0%, #0b0a0f 60%)
        `,
        backgroundAttachment: 'fixed',
        position: 'relative',
        pt: { xs: 6, md: 10 },
        pb: 8,
        overflow: 'hidden',
      }}
    >
      {/* Animated Gradient Circles */}
      {Array.from({ length: 3 }).map((_, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            width: `${600 + i * 200}px`,
            height: `${600 + i * 200}px`,
            borderRadius: '50%',
            background: `radial-gradient(circle, rgba(242, 159, 5, ${0.08 - i * 0.02}), transparent)`,
            left: `${20 + i * 30}%`,
            top: `${10 + i * 20}%`,
            pointerEvents: 'none',
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2],
            x: [0, Math.sin(i) * 50, 0],
            y: [0, Math.cos(i) * 50, 0],
          }}
          transition={{
            duration: 8 + i * 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Sparkles */}
      {sparklePositions.map((pos, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            left: `${pos.left}%`,
            top: `${pos.top}%`,
            width: '4px',
            height: '4px',
            background: '#F29F05',
            borderRadius: '50%',
            boxShadow: '0 0 6px rgba(242, 159, 5, 0.8)',
            pointerEvents: 'none',
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1.5, 0],
          }}
          transition={{
            duration: sparkleAnimations[i].duration,
            delay: sparkleAnimations[i].delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Logo */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Box sx={{ position: 'relative', width: '100%', maxWidth: 500, height: 250, mx: 'auto', mb: 4 }}>
            <Image
              src="/images/connection-key-logo.png"
              alt="The Connection Key"
              fill
              style={{ objectFit: 'contain' }}
              priority
              sizes="(max-width: 768px) 100vw, 500px"
            />
          </Box>

          <Typography
            variant="h1"
            sx={{
              fontWeight: 800,
              mb: 3,
              fontSize: { xs: '2.5rem', md: '4rem' },
              background: 'linear-gradient(135deg, #F29F05, #8C1D04)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            💫 The Connection Key
          </Typography>

          <Typography
            variant="h5"
            sx={{
              color: 'rgba(255, 255, 255, 0.9)',
              mb: 4,
              maxWidth: 800,
              mx: 'auto',
              lineHeight: 1.8,
              fontSize: { xs: '1.1rem', md: '1.5rem' },
            }}
          >
            Finde heraus, was zwischen euch lebt. Kein Match. Kein Algorithmus. Nur Wahrheit – in Energie übersetzt.
          </Typography>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} justifyContent="center" sx={{ mb: 8 }}>
            <Button
              component={Link}
              href="/connection-key/create"
              variant="contained"
              size="large"
              endIcon={<ArrowRight size={24} />}
              sx={{
                background: 'linear-gradient(135deg, #F29F05, #8C1D04)',
                color: 'white',
                fontWeight: 700,
                px: 6,
                py: 2.5,
                fontSize: '1.1rem',
                borderRadius: 4,
                boxShadow: '0 8px 25px rgba(242, 159, 5, 0.4)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #8C1D04, #F29F05)',
                  transform: 'translateY(-3px)',
                  boxShadow: '0 12px 35px rgba(242, 159, 5, 0.5)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              <Key size={24} style={{ marginRight: 12 }} />
              Connection Key erstellen
            </Button>
            <Button
              component={Link}
              href="/resonanzanalyse"
              variant="outlined"
              size="large"
              sx={{
                borderColor: 'rgba(242, 159, 5, 0.5)',
                color: '#F29F05',
                fontWeight: 700,
                px: 6,
                py: 2.5,
                fontSize: '1.1rem',
                borderRadius: 4,
                borderWidth: 2,
                '&:hover': {
                  borderColor: '#F29F05',
                  background: 'rgba(242, 159, 5, 0.1)',
                  borderWidth: 2,
                },
              }}
            >
              Zu meinen Readings
            </Button>
          </Stack>
        </Box>

        {/* Features */}
        <Grid container spacing={4} sx={{ mb: 8 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Card
                  sx={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(242, 159, 5, 0.3)',
                    borderRadius: 3,
                    p: 3,
                    height: '100%',
                    textAlign: 'center',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      borderColor: '#F29F05',
                      boxShadow: '0 8px 25px rgba(242, 159, 5, 0.2)',
                    },
                  }}
                >
                  <Box sx={{ color: '#F29F05', mb: 2, display: 'flex', justifyContent: 'center' }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" sx={{ color: '#fff', mb: 1, fontWeight: 700 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    {feature.description}
                  </Typography>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card
            sx={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(242, 159, 5, 0.3)',
              borderRadius: 4,
              p: 4,
              mb: 6,
            }}
          >
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                mb: 3,
                background: 'linear-gradient(135deg, #F29F05, #8C1D04)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textAlign: 'center',
              }}
            >
              Was ist The Connection Key?
            </Typography>
            <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.9)', mb: 3, lineHeight: 1.9, fontSize: '1.1rem' }}>
              The Connection Key ist eine <strong>Resonanzanalyse zwischen zwei Menschen</strong>, basierend auf dem Human Design System. 
              Sie zeigt dir die energetische Verbindung, die zwischen euch existiert – auch wenn sie unsichtbar ist.
            </Typography>
            <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.9)', mb: 3, lineHeight: 1.9, fontSize: '1.1rem' }}>
              <strong>Es geht nicht darum, ob ihr passt – sondern was entsteht, wenn ihr euch begegnet.</strong> Andere Plattformen suchen Übereinstimmungen. 
              Wir zeigen Resonanz. Goldadern, komplementäre Tore und die unsichtbaren Linien der Verbindung.
            </Typography>
            <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.9)', lineHeight: 1.9, fontSize: '1.1rem' }}>
              Wenn sich zwei Designs berühren, aktiviert sich etwas, das größer ist als beide. Ein definiertes Tor findet sein Gegenüber. 
              Ein Zentrum beginnt zu pulsieren. Ein Raum öffnet sich. Das ist Resonanz – der Moment, in dem Begegnung dich verändert.
            </Typography>
          </Card>
        </motion.div>

        {/* CTA */}
        <Box sx={{ textAlign: 'center' }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              mb: 3,
              background: 'linear-gradient(135deg, #F29F05, #8C1D04)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Bereit, zu sehen, was zwischen euch lebt?
          </Typography>
          <Button
            component={Link}
            href="/connection-key/create"
            variant="contained"
            size="large"
            endIcon={<ArrowRight size={24} />}
            sx={{
              background: 'linear-gradient(135deg, #F29F05, #8C1D04)',
              color: 'white',
              fontWeight: 700,
              px: 6,
              py: 2.5,
              fontSize: '1.2rem',
              borderRadius: 4,
              boxShadow: '0 8px 25px rgba(242, 159, 5, 0.4)',
              '&:hover': {
                background: 'linear-gradient(135deg, #8C1D04, #F29F05)',
                transform: 'translateY(-3px)',
                boxShadow: '0 12px 35px rgba(242, 159, 5, 0.5)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            <Key size={24} style={{ marginRight: 12 }} />
            Finde eure Resonanz – jetzt starten
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

