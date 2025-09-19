'use client';

import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Card, 
  CardContent, 
  Grid, 
  Button
} from '@mui/material';
import { motion } from 'framer-motion';
import { 
  ArrowLeft
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function PlanetsPage() {
  const router = useRouter();

  const planets = [
    {
      id: 'sun',
      name: 'Sonne',
      mythology: 'Das Zentrum des Bewusstseins',
      color: '#FFD700',
      icon: '☉',
      description: 'Die Sonne repräsentiert unser wahres Selbst, unsere Essenz und unser Bewusstsein. Sie zeigt, wer wir wirklich sind und was uns antreibt.',
      path: '/planets/sun'
    },
    {
      id: 'moon',
      name: 'Mond',
      mythology: 'Das Unterbewusstsein und die Emotionen',
      color: '#C0C0C0',
      icon: '☽',
      description: 'Der Mond repräsentiert unser Unterbewusstsein, unsere Emotionen und unsere instinktiven Reaktionen. Er zeigt, wie wir emotional reagieren.',
      path: '/planets/moon'
    },
    {
      id: 'mercury',
      name: 'Merkur',
      mythology: 'Der Bote der Götter',
      color: '#87CEEB',
      icon: '☿',
      description: 'Merkur repräsentiert Kommunikation, Denken und Austausch. Er zeigt, wie wir kommunizieren und Informationen verarbeiten.',
      path: '/planets/mercury'
    },
    {
      id: 'venus',
      name: 'Venus',
      mythology: 'Die Göttin der Liebe',
      color: '#FFB6C1',
      icon: '♀',
      description: 'Venus repräsentiert Liebe, Schönheit und Werte. Sie zeigt, was wir lieben und was uns wichtig ist.',
      path: '/planets/venus'
    },
    {
      id: 'mars',
      name: 'Mars',
      mythology: 'Der Gott des Krieges',
      color: '#FF4500',
      icon: '♂',
      description: 'Mars repräsentiert Aktion, Aggression und Durchsetzung. Er zeigt, wie wir handeln und uns durchsetzen.',
      path: '/planets/mars'
    },
    {
      id: 'jupiter',
      name: 'Jupiter',
      mythology: 'Der König der Götter',
      color: '#DAA520',
      icon: '♃',
      description: 'Jupiter repräsentiert Expansion, Weisheit und Wachstum. Er zeigt, wo wir wachsen und uns ausdehnen.',
      path: '/planets/jupiter'
    },
    {
      id: 'saturn',
      name: 'Saturn',
      mythology: 'Der Lehrer und Disziplinierer',
      color: '#708090',
      icon: '♄',
      description: 'Saturn repräsentiert Struktur, Disziplin und Verantwortung. Er zeigt, wo wir lernen und uns entwickeln.',
      path: '/planets/saturn'
    },
    {
      id: 'uranus',
      name: 'Uranus',
      mythology: 'Der Revolutionär',
      color: '#00CED1',
      icon: '♅',
      description: 'Uranus repräsentiert Revolution, Innovation und Veränderung. Er zeigt, wo wir rebellieren und Neues erschaffen.',
      path: '/planets/uranus'
    },
    {
      id: 'neptune',
      name: 'Neptun',
      mythology: 'Der Mystiker',
      color: '#4169E1',
      icon: '♆',
      description: 'Neptun repräsentiert Spiritualität, Illusion und Verbindung. Er zeigt, wo wir spirituell wachsen und uns verbinden.',
      path: '/planets/neptune'
    },
    {
      id: 'pluto',
      name: 'Pluto',
      mythology: 'Der Transformator',
      color: '#8B008B',
      icon: '♇',
      description: 'Pluto repräsentiert Transformation, Macht und Regeneration. Er zeigt, wo wir uns transformieren und erneuern.',
      path: '/planets/pluto'
    },
    {
      id: 'chiron',
      name: 'Chiron',
      mythology: 'Der verwundete Heiler',
      color: '#FF6B6B',
      icon: '⚷',
      description: 'Chiron repräsentiert unsere tiefsten Wunden und unsere Fähigkeit, andere zu heilen. Er zeigt, wo wir verletzt wurden und wo wir anderen helfen können.',
      path: '/planets/chiron'
    },
    {
      id: 'lilith',
      name: 'Lilith',
      mythology: 'Die Wilde Frau',
      color: '#4B0082',
      icon: '⚸',
      description: 'Lilith repräsentiert das Wilde, Unabhängige und Tabubrechende in uns. Sie zeigt, wo wir uns weigern, uns zu unterwerfen.',
      path: '/lilith'
    },
    {
      id: 'incarnation-cross',
      name: 'Inkarnationskreuz',
      mythology: 'Die Lebensaufgabe',
      color: '#EC4899',
      icon: '✚',
      description: 'Das Inkarnationskreuz definiert deine einzigartige Lebensaufgabe und dein höchstes Potenzial. Es zeigt, wofür du hier bist.',
      path: '/planets/incarnation-cross'
    }
  ];

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0B0D12 0%, #1A1F2B 50%, #2D3748 100%)',
      color: 'white',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated Stars */}
      <Box sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `
          radial-gradient(2px 2px at 20px 30px, #FFD700, transparent),
          radial-gradient(2px 2px at 40px 70px, #C0C0C0, transparent),
          radial-gradient(1px 1px at 90px 40px, #87CEEB, transparent),
          radial-gradient(1px 1px at 130px 80px, #FFB6C1, transparent),
          radial-gradient(2px 2px at 160px 30px, #FF4500, transparent)
        `,
        backgroundRepeat: 'repeat',
        backgroundSize: '200px 100px',
        animation: 'twinkle 4s ease-in-out infinite alternate'
      }} />

      <Container maxWidth="lg" sx={{ py: 4, position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Button
            variant="outlined"
            onClick={() => router.push('/premium-dashboard')}
            sx={{
              color: '#FFD700',
              borderColor: '#FFD700',
              '&:hover': {
                borderColor: '#FFD700',
                backgroundColor: 'rgba(255, 215, 0, 0.1)',
                boxShadow: '0 0 20px rgba(255, 215, 0, 0.3)'
              },
              mr: 2
            }}
          >
            <ArrowLeft size={20} style={{ marginRight: 8 }} />
            Zurück zum Premium Dashboard
          </Button>
        </Box>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h1" sx={{ fontWeight: 700, color: '#FFD700', mb: 2 }}>
              Die Planeten im Human Design
            </Typography>
            <Typography variant="h5" sx={{ color: 'rgba(255,255,255,0.8)', fontStyle: 'italic', mb: 2 }}>
              Entdecke die kosmischen Kräfte, die dein Leben prägen
            </Typography>
            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)', maxWidth: '800px', mx: 'auto' }}>
              Jeder Planet im Human Design System repräsentiert eine spezifische Energie und Funktion in unserem Leben. 
              Von der Sonne als Zentrum unseres Bewusstseins bis zu Chiron als dem verwundeten Heiler - 
              lerne die tiefe Bedeutung und Wirkung jedes Planeten kennen.
            </Typography>
          </Box>
        </motion.div>

        {/* Planets Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Grid container spacing={3}>
            {planets.map((planet, index) => (
              <Grid item xs={12} sm={6} md={4} key={planet.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <Card sx={{
                    background: 'linear-gradient(135deg, rgba(11,13,18,0.9) 0%, rgba(26,31,43,0.95) 100%)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: 3,
                    border: `1px solid ${planet.color}`,
                    boxShadow: `0 8px 32px ${planet.color}20`,
                    height: '100%',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      boxShadow: `0 12px 40px ${planet.color}40`,
                      transform: 'translateY(-5px)'
                    }
                  }}>
                    <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Box sx={{
                          width: 50,
                          height: 50,
                          borderRadius: '50%',
                          background: `linear-gradient(45deg, ${planet.color}, ${planet.color}80)`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mr: 2,
                          color: '#000',
                          fontSize: '24px',
                          fontWeight: 'bold'
                        }}>
                          {planet.icon}
                        </Box>
                        <Box>
                          <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                            {planet.name}
                          </Typography>
                          <Typography variant="body2" sx={{ color: planet.color, fontWeight: 500 }}>
                            {planet.mythology}
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Typography variant="body2" sx={{ 
                        color: 'rgba(255,255,255,0.8)', 
                        mb: 3, 
                        flexGrow: 1,
                        lineHeight: 1.6
                      }}>
                        {planet.description}
                      </Typography>
                      
                      <Button
                        component={Link}
                        href={planet.path}
                        fullWidth
                        variant="outlined"
                        sx={{
                          borderColor: planet.color,
                          color: planet.color,
                          '&:hover': {
                            borderColor: planet.color,
                            backgroundColor: `${planet.color}20`,
                            boxShadow: `0 0 20px ${planet.color}40`
                          }
                        }}
                      >
                        {planet.name} erkunden
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>

        {/* Footer Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Card sx={{
            background: 'linear-gradient(135deg, rgba(11,13,18,0.9) 0%, rgba(26,31,43,0.95) 100%)',
            backdropFilter: 'blur(20px)',
            borderRadius: 3,
            border: '1px solid #FFD700',
            boxShadow: '0 8px 32px rgba(255, 215, 0, 0.2)',
            p: 3,
            mt: 4
          }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" sx={{ color: '#FFD700', fontWeight: 600, mb: 2 }}>
                🌟 Die Planeten als kosmische Lehrer 🌟
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.6 }}>
                Jeder Planet in deinem Human Design Chart ist ein kosmischer Lehrer, der dir spezifische Lektionen und Gaben bringt. 
                Von der Sonne, die dir zeigt, wer du wirklich bist, bis zu Chiron, der dir hilft, deine Wunden zu heilen und andere zu heilen - 
                die Planeten sind deine spirituellen Begleiter auf dem Weg der Selbsterkenntnis und des Wachstums.
              </Typography>
            </Box>
          </Card>
        </motion.div>
      </Container>
    </Box>
  );
}
