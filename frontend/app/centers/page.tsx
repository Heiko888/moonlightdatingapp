"use client";
import React from 'react';
import Head from "next/head";
import { Container, Typography, Box, Grid, Card, CardContent, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { Shield, Target, Users, Zap, Crown, ArrowRight, Heart, Brain, Eye, Gauge } from 'lucide-react';
import AnimatedStars from '@/components/AnimatedStars';
import Link from 'next/link';

export default function CentersPage() {
  const centers = [
    {
      title: "Kopf-Zentrum",
      description: "Inspiration und mentale Aktivität",
      details: "Das Zentrum für Inspiration, mentale Aktivität und spirituelle Fragen. Hier entstehen neue Ideen und Gedanken.",
      icon: <Brain size={32} color="white" />,
      color: "#f5576c",
      gates: ["Gate 64", "Gate 47", "Gate 11", "Gate 17", "Gate 24", "Gate 43"],
      defined: "Definiert - Du hast eine konstante Quelle der Inspiration",
      undefined: "Undefiniert - Du absorbierst die mentalen Aktivitäten anderer"
    },
    {
      title: "Hals-Zentrum",
      description: "Kommunikation und Manifestation",
      details: "Das Zentrum für Kommunikation, Manifestation und Handlung. Hier wird das ausgedrückt, was realisiert werden soll.",
      icon: <Eye size={32} color="white" />,
      color: "#764ba2",
      gates: ["Gate 20", "Gate 57", "Gate 10", "Gate 34", "Gate 16", "Gate 45", "Gate 12", "Gate 35", "Gate 5", "Gate 15", "Gate 52", "Gate 39", "Gate 53", "Gate 62", "Gate 56", "Gate 31", "Gate 8", "Gate 33"],
      defined: "Definiert - Du hast eine konstante Art zu kommunizieren",
      undefined: "Undefiniert - Du absorbierst die Kommunikation anderer"
    },
    {
      title: "G-Zentrum",
      description: "Identität und Lebensrichtung",
      details: "Das Zentrum für Identität, Lebensrichtung und Liebe. Hier findest du deinen Platz im Leben und deine Bestimmung.",
      icon: <Heart size={32} color="white" />,
      color: "#4facfe",
      gates: ["Gate 1", "Gate 2", "Gate 7", "Gate 13", "Gate 15", "Gate 10", "Gate 25", "Gate 46"],
      defined: "Definiert - Du hast eine feste Identität und Lebensrichtung",
      undefined: "Undefiniert - Du suchst nach deiner Identität und Bestimmung"
    },
    {
      title: "Herz-Zentrum",
      description: "Willenskraft und Ego",
      details: "Das Zentrum für Willenskraft, Ego und Selbstwert. Hier manifestiert sich deine Kraft und dein Selbstbewusstsein.",
      icon: <Shield size={32} color="white" />,
      color: "#00f2fe",
      gates: ["Gate 21", "Gate 26", "Gate 51", "Gate 40"],
      defined: "Definiert - Du hast eine konstante Willenskraft",
      undefined: "Undefiniert - Du absorbierst die Willenskraft anderer"
    },
    {
      title: "Solarplexus-Zentrum",
      description: "Emotionen und Intuition",
      details: "Das Zentrum für Emotionen, Intuition und spirituelle Weisheit. Hier entstehen Gefühle und emotionale Wellen.",
      icon: <Zap size={32} color="white" />,
      color: "#a8edea",
      gates: ["Gate 6", "Gate 22", "Gate 36", "Gate 37", "Gate 49", "Gate 55", "Gate 30", "Gate 41", "Gate 60", "Gate 3", "Gate 27", "Gate 42", "Gate 50", "Gate 19", "Gate 59", "Gate 61"],
      defined: "Definiert - Du hast eine konstante emotionale Natur",
      undefined: "Undefiniert - Du absorbierst die Emotionen anderer"
    },
    {
      title: "Sakral-Zentrum",
      description: "Lebenskraft und Sexualität",
      details: "Das Zentrum für Lebenskraft, Sexualität und Arbeit. Hier ist deine Energie und Vitalität zu Hause.",
      icon: <Target size={32} color="white" />,
      color: "#ff9a9e",
      gates: ["Gate 5", "Gate 14", "Gate 29", "Gate 9", "Gate 26", "Gate 3", "Gate 27", "Gate 42", "Gate 59", "Gate 34", "Gate 40"],
      defined: "Definiert - Du hast eine konstante Lebenskraft",
      undefined: "Undefiniert - Du absorbierst die Lebenskraft anderer"
    },
    {
      title: "Milz-Zentrum",
      description: "Intuition und Gesundheit",
      details: "Das Zentrum für Intuition, Gesundheit und Überlebensinstinkt. Hier spürst du, was gut oder schlecht für dich ist.",
      icon: <Gauge size={32} color="white" />,
      color: "#fad0c4",
      gates: ["Gate 48", "Gate 16", "Gate 20", "Gate 57", "Gate 32", "Gate 44", "Gate 50", "Gate 28", "Gate 18", "Gate 58", "Gate 38", "Gate 54", "Gate 61", "Gate 62"],
      defined: "Definiert - Du hast eine konstante Intuition",
      undefined: "Undefiniert - Du absorbierst die Intuition anderer"
    },
    {
      title: "Wurzel-Zentrum",
      description: "Stress und Antrieb",
      details: "Das Zentrum für Stress, Antrieb und Überlebensdruck. Hier entsteht der Druck, der dich antreibt.",
      icon: <Users size={32} color="white" />,
      color: "#ffecd2",
      gates: ["Gate 19", "Gate 39", "Gate 38", "Gate 54", "Gate 58", "Gate 41", "Gate 60", "Gate 52", "Gate 53", "Gate 3", "Gate 9", "Gate 27", "Gate 42", "Gate 59"],
      defined: "Definiert - Du hast eine konstante Stressquelle",
      undefined: "Undefiniert - Du absorbierst den Stress anderer"
    },
    {
      title: "Sakral-Zentrum",
      description: "Lebenskraft und Sexualität",
      details: "Das Zentrum für Lebenskraft, Sexualität und Arbeit. Hier ist deine Energie und Vitalität zu Hause.",
      icon: <Crown size={32} color="white" />,
      color: "#a8edea",
      gates: ["Gate 5", "Gate 14", "Gate 29", "Gate 9", "Gate 26", "Gate 3", "Gate 27", "Gate 42", "Gate 59", "Gate 34", "Gate 40"],
      defined: "Definiert - Du hast eine konstante Lebenskraft",
      undefined: "Undefiniert - Du absorbierst die Lebenskraft anderer"
    }
  ];

  return (
    <>
      <Head>
        <title>Human Design Zentren - Die 9 Energiezentren verstehen</title>
        <meta name="description" content="Entdecke die 9 Energiezentren im Human Design System. Verstehe deine definierten und undefinierten Zentren und wie sie deine Energie beeinflussen." />
        <meta name="keywords" content="Human Design Zentren, Energiezentren, definierte Zentren, undefinierte Zentren, Bodygraph" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="Human Design Zentren - Die 9 Energiezentren verstehen" />
        <meta property="og:description" content="Entdecke die 9 Energiezentren im Human Design System. Verstehe deine definierten und undefinierten Zentren." />
        <meta property="og:type" content="website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
    <Box sx={{ 
      minHeight: '100vh',
        background: `
          radial-gradient(ellipse at top, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
          radial-gradient(ellipse at bottom, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
          linear-gradient(135deg, #0f0f23 0%, #1a1a2e 25%, #16213e 50%, #0f3460 75%, #533483 100%)
        `,
      position: 'relative',
      overflow: 'hidden'
    }}>
      <AnimatedStars />
      
      <Container maxWidth="lg" sx={{ py: 8, position: 'relative', zIndex: 1 }}>
        {/* Header */}
          <motion.div
            
            
            
          >
            <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography variant="h2" sx={{
                color: 'white',
              fontWeight: 800,
                fontSize: { xs: '2.5rem', md: '4rem' },
                mb: 2,
                textShadow: '0 4px 20px rgba(0,0,0,0.5)',
                background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FFD700 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2
              }}>
                <Target size={64} style={{ color: '#FFD700' }} />
                Die 9 Energiezentren
                <Target size={64} style={{ color: '#FFD700' }} />
            </Typography>
              <Typography variant="h5" sx={{
                color: 'rgba(255,255,255,0.8)',
                fontSize: { xs: '1.2rem', md: '1.5rem' },
                maxWidth: 800,
                mx: 'auto',
                lineHeight: 1.6
              }}>
                Entdecke deine energetische Anatomie und verstehe, wie deine Zentren deine Energie beeinflussen
          </Typography>
        </Box>
          </motion.div>

          {/* Centers Grid */}
          <Grid container spacing={3}>
            {centers.map((center, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <motion.div
                  
                  
                  
                >
                  <Card sx={{
                    background: 'rgba(0, 0, 0, 0.3)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: 3,
                    border: '2px solid #FFD700',
                    height: '100%',
                    boxShadow: '0 8px 32px rgba(255, 215, 0, 0.2)'
                  }}>
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box sx={{
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          backgroundColor: center.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                          mr: 2
                        }}>
                          <Box sx={{
                            width: 20,
                            height: 20,
                      borderRadius: '50%',
                            backgroundColor: 'white'
                          }} />
                    </Box>
                        <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                          {center.title}
                    </Typography>
                      </Box>
                    <Typography sx={{
                        color: 'rgba(255,255,255,0.8)',
                      fontSize: '0.9rem',
                        lineHeight: 1.5,
                      mb: 2
                    }}>
                      {center.description}
                    </Typography>
                      <Typography sx={{
                        color: 'rgba(255,255,255,0.7)',
                        fontSize: '0.8rem',
                        lineHeight: 1.4,
                        mb: 3
                      }}>
                        {center.details}
                      </Typography>
                      
                      {/* Gates */}
                      <Box sx={{ mb: 2 }}>
                        <Typography sx={{ color: '#FFD700', fontSize: '0.8rem', fontWeight: 600, mb: 1 }}>
                          Tore:
                        </Typography>
                        <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.7rem' }}>
                          {center.gates.slice(0, 3).join(', ')}
                          {center.gates.length > 3 && '...'}
                        </Typography>
                    </Box>

                      {/* Defined/Undefined */}
                      <Box sx={{ mb: 3 }}>
                        <Typography sx={{ color: '#4CAF50', fontSize: '0.7rem', fontWeight: 600, mb: 0.5 }}>
                          {center.defined}
                        </Typography>
                        <Typography sx={{ color: '#FF9800', fontSize: '0.7rem', fontWeight: 600 }}>
                          {center.undefined}
                        </Typography>
                    </Box>
                  </CardContent>
                </Card>
                </motion.div>
              </Grid>
              ))}
          </Grid>

          {/* Info Section */}
          <motion.div
            
            
            
          >
              <Card sx={{
              background: 'rgba(0, 0, 0, 0.3)',
              backdropFilter: 'blur(20px)',
                borderRadius: 4,
              border: '2px solid #FFD700',
              mt: 8,
              boxShadow: '0 8px 32px rgba(255, 215, 0, 0.2)'
            }}>
              <CardContent sx={{ p: 6 }}>
                <Typography variant="h4" sx={{ color: 'white', fontWeight: 700, mb: 3, textAlign: 'center' }}>
                  Definiert vs. Undefiniert
                </Typography>
                <Grid container spacing={4}>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h6" sx={{ color: '#4CAF50', mb: 2 }}>
                        🟢 Definiert
                      </Typography>
                      <Typography sx={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.6 }}>
                        Definierten Zentren sind konstant aktiv und geben dir eine feste energetische Qualität. 
                        Sie sind deine Stärken und deine zuverlässigen Energiequellen.
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h6" sx={{ color: '#FF9800', mb: 2 }}>
                        ⚪ Undefiniert
                    </Typography>
                      <Typography sx={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.6 }}>
                        Undefinierte Zentren sind flexibel und absorbieren die Energie anderer. 
                        Sie sind deine Lernbereiche und deine Weisheitsquellen.
                    </Typography>
                  </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </motion.div>

          {/* Back to Grundlagen */}
          <motion.div
            
            
            
          >
            <Box sx={{ textAlign: 'center', mt: 6 }}>
              <Link href="/grundlagen-hd" passHref>
                          <Button
                  variant="outlined"
                  startIcon={<ArrowRight size={20} />}
                            sx={{
                    borderColor: '#FFD700',
                    color: '#FFD700',
                              fontWeight: 600,
                              px: 4,
                    py: 2,
                              borderRadius: 3,
                    fontSize: '1.1rem',
                              '&:hover': {
                      borderColor: '#FFD700',
                      backgroundColor: 'rgba(255, 215, 0, 0.1)'
                              }
                            }}
                          >
                  Zurück zu den Grundlagen
                          </Button>
              </Link>
                        </Box>
          </motion.div>
      </Container>
    </Box>
    </>
  );
}
