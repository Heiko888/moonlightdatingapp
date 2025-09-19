"use client";
import React, { useState } from 'react';
import { Container, Typography, Card, CardContent, Box, Button, Paper, Chip, Tabs, Tab, Grid, TextField, InputAdornment } from '@mui/material';
import { Search, Hexagon, Zap, Eye, Crown, Shield, Target, Star, Circle, ChevronDown, ArrowRight } from 'lucide-react';
import AnimatedStars from '@/components/AnimatedStars';
import Link from 'next/link';

interface Line {
  id: number;
  name: string;
  germanName: string;
  description: string;
  theme: string;
  keywords: string[];
  characteristics: string[];
  shadow: string;
  gift: string;
  color: string;
  icon: React.ReactNode;
}

export default function LinesPage() {
  const [selectedLine, setSelectedLine] = useState<Line | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  const lines: Line[] = [
    {
      id: 1,
      name: 'The Investigator',
      germanName: 'Der Forscher',
      description: 'Die erste Linie ist die Linie der Forschung und des tiefen Verständnisses. Sie sucht nach Fundamenten und Grundlagen.',
      theme: 'Forschung und Fundament',
      keywords: ['Forschung', 'Fundament', 'Tiefe', 'Verständnis', 'Basis'],
      characteristics: [
        'Tiefes Bedürfnis nach Verständnis',
        'Forscht nach den Grundlagen',
        'Braucht Zeit für gründliche Analyse',
        'Vertraut auf bewährte Methoden',
        'Kann unsicher wirken, wenn nicht genug geforscht wurde'
      ],
      shadow: 'Kann überanalysieren und in der Forschung stecken bleiben',
      gift: 'Bietet solide Fundamente und tiefes Verständnis',
      color: '#f5576c',
      icon: <Target size={24} />
    },
    {
      id: 2,
      name: 'The Hermit',
      germanName: 'Der Einsiedler',
      description: 'Die zweite Linie ist die Linie der natürlichen Begabung und des Rückzugs. Sie hat angeborene Talente, die erkannt werden müssen.',
      theme: 'Natürliche Begabung und Projektion',
      keywords: ['Begabung', 'Projektion', 'Rückzug', 'Erkennung', 'Talente'],
      characteristics: [
        'Hat natürliche, angeborene Talente',
        'Wird oft von anderen projiziert',
        'Braucht Anerkennung von außen',
        'Kann sich zurückziehen, wenn nicht erkannt',
        'Funktioniert am besten in der Gemeinschaft'
      ],
      shadow: 'Kann sich zurückziehen und Talente nicht nutzen',
      gift: 'Bringt natürliche Begabungen und Talente ein',
      color: '#764ba2',
      icon: <Eye size={24} />
    },
    {
      id: 3,
      name: 'The Martyr',
      germanName: 'Der Märtyrer',
      description: 'Die dritte Linie ist die Linie der Erfahrung und des Experimentierens. Sie lernt durch Versuch und Irrtum.',
      theme: 'Erfahrung und Experiment',
      keywords: ['Erfahrung', 'Experiment', 'Versuch', 'Irrtum', 'Lernen'],
      characteristics: [
        'Lernt durch Versuch und Irrtum',
        'Macht viele Erfahrungen',
        'Kann chaotisch und unvorhersagbar sein',
        'Entwickelt sich durch Fehler',
        'Bringt praktische Weisheit ein'
      ],
      shadow: 'Kann chaotisch sein und andere verunsichern',
      gift: 'Bringt praktische Erfahrung und Weisheit',
      color: '#4facfe',
      icon: <Zap size={24} />
    },
    {
      id: 4,
      name: 'The Opportunist',
      germanName: 'Der Opportunist',
      description: 'Die vierte Linie ist die Linie der Netzwerke und Beziehungen. Sie funktioniert am besten in Gruppen und Gemeinschaften.',
      theme: 'Netzwerke und Beziehungen',
      keywords: ['Netzwerke', 'Beziehungen', 'Gemeinschaft', 'Freundschaft', 'Verbindung'],
      characteristics: [
        'Funktioniert am besten in Gruppen',
        'Baut Netzwerke und Beziehungen auf',
        'Ist freundlich und einladend',
        'Braucht andere, um zu funktionieren',
        'Kann opportunistisch wirken'
      ],
      shadow: 'Kann opportunistisch und oberflächlich sein',
      gift: 'Verbindet Menschen und baut Gemeinschaften auf',
      color: '#00f2fe',
      icon: <Star size={24} />
    },
    {
      id: 5,
      name: 'The Heretic',
      germanName: 'Der Ketzer',
      description: 'Die fünfte Linie ist die Linie der universellen Anerkennung und des Einflusses. Sie hat die Kraft, andere zu beeinflussen.',
      theme: 'Universelle Anerkennung und Einfluss',
      keywords: ['Einfluss', 'Anerkennung', 'Universell', 'Führung', 'Vision'],
      characteristics: [
        'Hat universelle Anerkennung',
        'Kann andere stark beeinflussen',
        'Wird oft projiziert und idealisiert',
        'Hat visionäre Qualitäten',
        'Kann als Retter oder Ketzer gesehen werden'
      ],
      shadow: 'Kann als Ketzer oder Retter projiziert werden',
      gift: 'Bringt universelle Lösungen und Führung',
      color: '#a8edea',
      icon: <Crown size={24} />
    },
    {
      id: 6,
      name: 'The Role Model',
      germanName: 'Das Vorbild',
      description: 'Die sechste Linie ist die Linie der Rolle und des Vorbilds. Sie zeigt anderen den Weg und ist ein Beispiel.',
      theme: 'Rolle und Vorbild',
      keywords: ['Vorbild', 'Rolle', 'Beispiel', 'Führung', 'Weisheit'],
      characteristics: [
        'Ist ein natürliches Vorbild',
        'Zeigt anderen den Weg',
        'Hat eine besondere Rolle in der Gesellschaft',
        'Kann distanziert und überlegen wirken',
        'Bringt Weisheit und Reife ein'
      ],
      shadow: 'Kann distanziert und überlegen wirken',
      gift: 'Ist ein Vorbild und zeigt den Weg',
      color: '#ffecd2',
      icon: <Shield size={24} />
    }
  ];

  const filteredLines = lines.filter(line =>
    line.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    line.germanName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    line.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleLineClick = (line: Line) => {
    console.log('Line clicked:', line);
    setSelectedLine(line);
    setActiveTab(0);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
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
        {/* Back Button */}
        <Box sx={{ mb: 4 }}>
          <Link href="/grundlagen-hd" passHref>
            <Button
              variant="outlined"
              startIcon={<ArrowRight size={20} style={{ transform: 'rotate(180deg)' }} />}
              sx={{
                borderColor: '#FFD700',
                color: '#FFD700',
                fontWeight: 600,
                px: 3,
                py: 1,
                borderRadius: 2,
                '&:hover': {
                  borderColor: '#FFD700',
                  backgroundColor: 'rgba(255, 215, 0, 0.1)',
                  transform: 'translateX(-4px)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              Zurück zu den HD-Grundlagen
            </Button>
          </Link>
        </Box>

        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
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
            <Hexagon size={64} style={{ color: '#FFD700' }} />
            Human Design Lines
            <Hexagon size={64} style={{ color: '#FFD700' }} />
          </Typography>
          <Typography variant="h5" sx={{
            color: 'rgba(255,255,255,0.8)',
            fontSize: { xs: '1.2rem', md: '1.5rem' },
            maxWidth: 800,
            mx: 'auto',
            lineHeight: 1.6
          }}>
            Entdecke die 6 Linien der Hexagramme und ihre Bedeutung
          </Typography>
        </Box>

        {/* Search */}
        <Box sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
          <TextField
            fullWidth
            placeholder="Suche nach Linien..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search style={{ color: '#FFD700' }} />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                border: '2px solid #FFD700',
                borderRadius: 3,
                color: 'white',
                '& fieldset': {
                  border: 'none',
                },
                '&:hover fieldset': {
                  border: 'none',
                },
                '&.Mui-focused fieldset': {
                  border: 'none',
                },
              },
              '& .MuiInputBase-input': {
                color: 'white',
                '&::placeholder': {
                  color: 'rgba(255,255,255,0.7)',
                },
              },
            }}
          />
        </Box>

        {/* Lines Grid */}
        <Grid container spacing={3} sx={{ mb: 6 }}>
          {filteredLines.map((line) => (
            <Grid item xs={12} sm={6} md={4} key={line.id}>
              <Card 
                sx={{
                  background: 'rgba(0, 0, 0, 0.3)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: 3,
                  border: '2px solid #FFD700',
                  height: '100%',
                  boxShadow: '0 8px 32px rgba(255, 215, 0, 0.2)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 40px rgba(255, 215, 0, 0.3)',
                  }
                }}
                onClick={() => handleLineClick(line)}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      backgroundColor: line.color,
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
                    <Box>
                      <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                        Linie {line.id}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                        {line.germanName}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Typography sx={{
                    color: 'rgba(255,255,255,0.8)',
                    fontSize: '0.9rem',
                    lineHeight: 1.5,
                    mb: 2
                  }}>
                    {line.description}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                    {line.keywords.slice(0, 3).map((keyword, index) => (
                      <Chip
                        key={index}
                        label={keyword}
                        size="small"
                        sx={{
                          backgroundColor: `${line.color}20`,
                          color: line.color,
                          fontSize: '0.7rem',
                          height: 20
                        }}
                      />
                    ))}
                  </Box>
                  
                  <Typography sx={{
                    color: line.color,
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    textAlign: 'center',
                    mt: 1
                  }}>
                    Klicken für Details →
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Selected Line Details */}
        {selectedLine && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ color: '#FFD700', textAlign: 'center', mb: 2 }}>
              Detailansicht für: {selectedLine.germanName}
            </Typography>
          <Card sx={{
            background: 'rgba(0, 0, 0, 0.3)',
            backdropFilter: 'blur(20px)',
            borderRadius: 4,
            border: '2px solid #FFD700',
            boxShadow: '0 8px 32px rgba(255, 215, 0, 0.2)'
          }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Box sx={{
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  backgroundColor: selectedLine.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 3
                }}>
                  <Box sx={{
                    width: 30,
                    height: 30,
                    borderRadius: '50%',
                    backgroundColor: 'white'
                  }} />
                </Box>
                <Box>
                  <Typography variant="h4" sx={{ color: 'white', fontWeight: 700 }}>
                    Linie {selectedLine.id} - {selectedLine.germanName}
                  </Typography>
                  <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    {selectedLine.name}
                  </Typography>
                </Box>
              </Box>

              <Tabs
                value={activeTab}
                onChange={handleTabChange}
                sx={{
                  '& .MuiTab-root': {
                    color: 'rgba(255,255,255,0.7)',
                    '&.Mui-selected': {
                      color: '#FFD700',
                    },
                  },
                  '& .MuiTabs-indicator': {
                    backgroundColor: '#FFD700',
                  },
                }}
              >
                <Tab label="Übersicht" />
                <Tab label="Eigenschaften" />
                <Tab label="Schatten & Geschenk" />
              </Tabs>

              <Box sx={{ mt: 3 }}>
                {activeTab === 0 && (
                  <Box>
                    <Typography variant="h6" sx={{ color: '#FFD700', mb: 2 }}>
                      {selectedLine.theme}
                    </Typography>
                    <Typography sx={{ color: 'rgba(255,255,255,0.8)', mb: 3, lineHeight: 1.6 }}>
                      {selectedLine.description}
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {selectedLine.keywords.map((keyword, index) => (
                        <Chip
                          key={index}
                          label={keyword}
                          sx={{
                            backgroundColor: `${selectedLine.color}20`,
                            color: selectedLine.color,
                            border: `1px solid ${selectedLine.color}40`
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                )}

                {activeTab === 1 && (
                  <Box>
                    <Typography variant="h6" sx={{ color: '#FFD700', mb: 2 }}>
                      Charakteristika
                    </Typography>
                    <Box component="ul" sx={{ pl: 2 }}>
                      {selectedLine.characteristics.map((characteristic, index) => (
                        <Typography
                          key={index}
                          component="li"
                          sx={{ color: 'rgba(255,255,255,0.8)', mb: 1 }}
                        >
                          {characteristic}
                        </Typography>
                      ))}
                    </Box>
                  </Box>
                )}

                {activeTab === 2 && (
                  <Box>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <Paper sx={{
                          background: 'rgba(255, 0, 0, 0.1)',
                          border: '1px solid rgba(255, 0, 0, 0.3)',
                          p: 3,
                          borderRadius: 2
                        }}>
                          <Typography variant="h6" sx={{ color: '#ff6b6b', mb: 2 }}>
                            Schatten
                          </Typography>
                          <Typography sx={{ color: 'rgba(255,255,255,0.8)' }}>
                            {selectedLine.shadow}
                          </Typography>
                        </Paper>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Paper sx={{
                          background: 'rgba(0, 255, 0, 0.1)',
                          border: '1px solid rgba(0, 255, 0, 0.3)',
                          p: 3,
                          borderRadius: 2
                        }}>
                          <Typography variant="h6" sx={{ color: '#51cf66', mb: 2 }}>
                            Geschenk
                          </Typography>
                          <Typography sx={{ color: 'rgba(255,255,255,0.8)' }}>
                            {selectedLine.gift}
                          </Typography>
                        </Paper>
                      </Grid>
                    </Grid>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
          </Box>
        )}
      </Container>
    </Box>
  );
}
