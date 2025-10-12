"use client";

import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Tabs, 
  Tab, 
  Grid, 
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Alert,
  CircularProgress,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  Divider
} from '@mui/material';
import { 
  Heart, 
  Users, 
  Star, 
  Zap,
  Target,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Info,
  Plus,
  Search
} from 'lucide-react';
import { motion } from 'framer-motion';

interface SynastryAspect {
  planet1: string;
  planet2: string;
  aspect: string;
  orb: number;
  influence: string;
  description: string;
  advice: string[];
}

interface CompositeChart {
  sun: number;
  moon: number;
  ascendant: number;
  themes: string[];
  strengths: string[];
  challenges: string[];
  purpose: string;
}

interface KarmicConnection {
  type: 'soulmate' | 'karmic' | 'twin flame' | 'past life';
  description: string;
  lessons: string[];
  purpose: string;
  duration: string;
}

interface FamilyDynamics {
  relationship: string;
  compatibility: number;
  dynamics: string[];
  challenges: string[];
  advice: string[];
}

export default function RelationshipsPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [synastry, setSynastry] = useState<SynastryAspect[]>([]);
  const [composite, setComposite] = useState<CompositeChart | null>(null);
  const [karmic, setKarmic] = useState<KarmicConnection | null>(null);
  const [family, setFamily] = useState<FamilyDynamics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState('');

  useEffect(() => {
    loadRelationshipData();
  }, []);

  const loadRelationshipData = async () => {
    try {
      setLoading(true);
      
      // Mock-Daten für Demo
      const mockSynastry: SynastryAspect[] = [
        {
          planet1: 'Sun',
          planet2: 'Moon',
          aspect: 'Trine',
          orb: 2.3,
          influence: 'Harmonische emotionale Verbindung',
          description: 'Die Sonne der Person 1 bildet ein Trine zum Mond der Person 2. Dies schafft eine natürliche emotionale Harmonie und Verständnis.',
          advice: [
            'Nutzt eure emotionale Verbindung',
            'Kommuniziert offen über Gefühle',
            'Unterstützt euch gegenseitig'
          ]
        },
        {
          planet1: 'Venus',
          planet2: 'Mars',
          aspect: 'Square',
          orb: 1.8,
          influence: 'Leidenschaftliche Spannung',
          description: 'Venus und Mars bilden ein Quadrat, was zu leidenschaftlicher Anziehung, aber auch zu Spannungen führen kann.',
          advice: [
            'Arbeitet an der Kommunikation',
            'Respektiert eure Unterschiede',
            'Nutzt die Spannung konstruktiv'
          ]
        },
        {
          planet1: 'Mercury',
          planet2: 'Mercury',
          aspect: 'Conjunction',
          orb: 0.5,
          influence: 'Intellektuelle Verbindung',
          description: 'Beide Merkur stehen in Konjunktion, was zu einer starken mentalen Verbindung und Verständnis führt.',
          advice: [
            'Tauscht euch über Ideen aus',
            'Lernt voneinander',
            'Nutzt eure gemeinsame Sprache'
          ]
        }
      ];

      const mockComposite: CompositeChart = {
        sun: 285.5,
        moon: 142.3,
        ascendant: 78.9,
        themes: [
          'Gemeinsame Kreativität',
          'Emotionale Tiefe',
          'Intellektueller Austausch'
        ],
        strengths: [
          'Starke emotionale Verbindung',
          'Gemeinsame Werte',
          'Gegenseitige Unterstützung'
        ],
        challenges: [
          'Kommunikationsunterschiede',
          'Verschiedene Bedürfnisse',
          'Balance zwischen Nähe und Distanz'
        ],
        purpose: 'Diese Beziehung dient dem gemeinsamen spirituellen Wachstum und der gegenseitigen Heilung.'
      };

      const mockKarmic: KarmicConnection = {
        type: 'soulmate',
        description: 'Eine tiefe seelische Verbindung, die über viele Leben hinweg besteht.',
        lessons: [
          'Unbedingte Liebe lernen',
          'Vergebung praktizieren',
          'Eigenständigkeit in der Beziehung'
        ],
        purpose: 'Gegenseitige Heilung und spirituelle Entwicklung durch die Beziehung.',
        duration: 'Langlebig - mehrere Leben'
      };

      const mockFamily: FamilyDynamics = {
        relationship: 'Parent-Child',
        compatibility: 75,
        dynamics: [
          'Starke emotionale Bindung',
          'Verschiedene Generationen',
          'Gegenseitige Unterstützung'
        ],
        challenges: [
          'Generationsunterschiede',
          'Verschiedene Lebensphasen',
          'Kommunikationsbarrieren'
        ],
        advice: [
          'Respektiert eure Unterschiede',
          'Kommuniziert offen und ehrlich',
          'Unterstützt euch gegenseitig'
        ]
      };

      setSynastry(mockSynastry);
      setComposite(mockComposite);
      setKarmic(mockKarmic);
      setFamily(mockFamily);
    } catch (err) {
      setError('Fehler beim Laden der Beziehungsdaten');
      console.error('Error loading relationships:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedPerson('');
  };

  const getAspectColor = (aspect: string) => {
    switch (aspect) {
      case 'Trine': return '#10b981';
      case 'Square': return '#f56565';
      case 'Conjunction': return '#8b5cf6';
      case 'Opposition': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const getKarmicTypeColor = (type: string) => {
    switch (type) {
      case 'soulmate': return '#ff6b9d';
      case 'karmic': return '#f59e0b';
      case 'twin flame': return '#8b5cf6';
      case 'past life': return '#6b7280';
      default: return '#6b7280';
    }
  };

  if (loading) {
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
        overflow: 'hidden',
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center'
      }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
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
        overflow: 'hidden',
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center'
      }}>
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: `
        radial-gradient(circle at 20% 20%, rgba(255, 107, 157, 0.08) 0%, transparent 50%),
        radial-gradient(circle at 80% 80%, rgba(78, 205, 196, 0.08) 0%, transparent 50%),
        radial-gradient(circle at 40% 60%, rgba(102, 126, 234, 0.08) 0%, transparent 50%),
        linear-gradient(135deg, #0F0F23 0%, #1A1A2E 50%, #16213E 100%)
      `,
      position: 'relative',
      overflow: 'hidden'
    }}>
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3, position: 'relative', zIndex: 2 }}>
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
              💕 Beziehungs-Analyse
            </Typography>
            <Typography 
              variant="h5" 
              sx={{ 
                color: 'rgba(78, 205, 196, 0.9)', 
                mb: 3,
                fontSize: { xs: '1.1rem', md: '1.3rem' },
                maxWidth: '600px',
                mx: 'auto',
                lineHeight: 1.6
              }}
            >
              Entdecke die energetischen Verbindungen zwischen Menschen - Synastry, Composite Charts und karmische Verbindungen.
            </Typography>
          </Box>
        </motion.div>

        {/* Add Relationship Button */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <Button
            variant="contained"
            startIcon={<Plus size={20} />}
            onClick={handleOpenDialog}
            sx={{
              background: 'linear-gradient(135deg, #ff6b9d, #c44569)',
              borderRadius: 3,
              px: 4,
              py: 1.5,
              fontWeight: 600,
              '&:hover': {
                background: 'linear-gradient(135deg, #c44569, #ff6b9d)'
              }
            }}
          >
            Neue Beziehung analysieren
          </Button>
        </Box>

        {/* Tabs */}
        <Card sx={{
          background: 'rgba(78, 205, 196, 0.03)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(78, 205, 196, 0.08)',
          borderRadius: 4,
          mb: 4,
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
        }}>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange}
            sx={{
              '& .MuiTab-root': {
                color: 'rgba(78, 205, 196, 0.7)',
                fontWeight: 600,
                '&.Mui-selected': {
                  color: '#FFD700'
                }
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#FFD700'
              }
            }}
          >
            <Tab label="Synastry" icon={<Star size={20} />} />
            <Tab label="Composite" icon={<Heart size={20} />} />
            <Tab label="Karmische Verbindungen" icon={<Zap size={20} />} />
            <Tab label="Familien-Dynamiken" icon={<Users size={20} />} />
          </Tabs>
        </Card>

        {/* Tab Content */}
        {activeTab === 0 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Typography variant="h5" sx={{ color: '#4ECDC4', mb: 3, fontWeight: 600 }}>
              Synastry - Planeten-Aspekte
            </Typography>
            
            <Grid container spacing={3}>
              {synastry.map((aspect, index) => (
                <Grid item xs={12} md={6} lg={4} key={index}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card sx={{
                      background: `linear-gradient(135deg, rgba(${getAspectColor(aspect.aspect).slice(1)}, 0.12) 0%, rgba(${getAspectColor(aspect.aspect).slice(1)}, 0.05) 100%)`,
                      border: `1px solid ${getAspectColor(aspect.aspect)}50`,
                      borderRadius: 4,
                      p: 3,
                      height: '100%',
                      backdropFilter: 'blur(10px)',
                      boxShadow: `0 4px 20px ${getAspectColor(aspect.aspect)}20`,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: `0 8px 30px ${getAspectColor(aspect.aspect)}30`,
                        border: `1px solid ${getAspectColor(aspect.aspect)}70`
                      }
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Star size={24} color={getAspectColor(aspect.aspect)} />
                        <Typography variant="h6" sx={{ color: '#4ECDC4', ml: 1, fontWeight: 600 }}>
                          {aspect.planet1} - {aspect.planet2}
                        </Typography>
                        <Chip 
                          label={aspect.aspect}
                          size="small"
                          sx={{ 
                            ml: 'auto',
                            background: getAspectColor(aspect.aspect),
                            color: 'white',
                            fontWeight: 600
                          }}
                        />
                      </Box>
                      
                      <Typography variant="body2" sx={{ color: 'rgba(78, 205, 196, 0.8)', mb: 2 }}>
                        Orb: {aspect.orb}° • {aspect.influence}
                      </Typography>
                      
                      <Typography variant="body1" sx={{ color: 'rgba(78, 205, 196, 0.9)', mb: 3 }}>
                        {aspect.description}
                      </Typography>
                      
                      <Divider sx={{ my: 2, borderColor: 'rgba(78, 205, 196, 0.1)' }} />
                      
                      <Typography variant="subtitle2" sx={{ color: getAspectColor(aspect.aspect), mb: 1 }}>
                        Empfehlungen:
                      </Typography>
                      <List dense>
                        {aspect.advice.map((advice, adviceIndex) => (
                          <ListItem key={adviceIndex} sx={{ px: 0, py: 0.5 }}>
                            <ListItemIcon sx={{ minWidth: 20 }}>
                              <CheckCircle size={16} color={getAspectColor(aspect.aspect)} />
                            </ListItemIcon>
                            <ListItemText 
                              primary={advice}
                              sx={{ 
                                color: 'rgba(78, 205, 196, 0.8)',
                                '& .MuiListItemText-primary': {
                                  fontSize: '0.875rem'
                                }
                              }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        )}

        {activeTab === 1 && composite && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card sx={{
              background: 'linear-gradient(135deg, rgba(255, 107, 157, 0.08) 0%, rgba(196, 69, 105, 0.03) 100%)',
              border: '1px solid rgba(255, 107, 157, 0.2)',
              borderRadius: 4,
              p: 3,
              backdropFilter: 'blur(10px)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
            }}>
              <Typography variant="h5" sx={{ color: '#ff6b9d', fontWeight: 700, mb: 3 }}>
                Composite Chart
              </Typography>
              
              <Typography variant="body1" sx={{ color: 'rgba(78, 205, 196, 0.9)', mb: 4, lineHeight: 1.6 }}>
                {composite.purpose}
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Typography variant="h6" sx={{ color: '#ff6b9d', mb: 2 }}>
                    Themen
                  </Typography>
                  <List>
                    {composite.themes.map((theme, index) => (
                      <ListItem key={index} sx={{ px: 0 }}>
                        <ListItemIcon>
                          <Target size={20} color="#ff6b9d" />
                        </ListItemIcon>
                        <ListItemText 
                          primary={theme}
                          sx={{ color: 'rgba(78, 205, 196, 0.8)' }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Typography variant="h6" sx={{ color: '#10b981', mb: 2 }}>
                    Stärken
                  </Typography>
                  <List>
                    {composite.strengths.map((strength, index) => (
                      <ListItem key={index} sx={{ px: 0 }}>
                        <ListItemIcon>
                          <CheckCircle size={20} color="#10b981" />
                        </ListItemIcon>
                        <ListItemText 
                          primary={strength}
                          sx={{ color: 'rgba(78, 205, 196, 0.8)' }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Typography variant="h6" sx={{ color: '#f56565', mb: 2 }}>
                    Herausforderungen
                  </Typography>
                  <List>
                    {composite.challenges.map((challenge, index) => (
                      <ListItem key={index} sx={{ px: 0 }}>
                        <ListItemIcon>
                          <AlertTriangle size={20} color="#f56565" />
                        </ListItemIcon>
                        <ListItemText 
                          primary={challenge}
                          sx={{ color: 'rgba(78, 205, 196, 0.8)' }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Grid>
              </Grid>
            </Card>
          </motion.div>
        )}

        {activeTab === 2 && karmic && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card sx={{
              background: 'linear-gradient(135deg, rgba(78, 205, 196, 0.08) 0%, rgba(78, 205, 196, 0.03) 100%)',
              border: '1px solid rgba(78, 205, 196, 0.3)',
              borderRadius: 4,
              p: 3,
              backdropFilter: 'blur(10px)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Heart size={32} color={getKarmicTypeColor(karmic.type)} />
                <Typography variant="h5" sx={{ color: getKarmicTypeColor(karmic.type), fontWeight: 700, ml: 2 }}>
                  {karmic.type.charAt(0).toUpperCase() + karmic.type.slice(1)} Verbindung
                </Typography>
              </Box>
              
              <Typography variant="body1" sx={{ color: 'rgba(78, 205, 196, 0.9)', mb: 4, lineHeight: 1.6 }}>
                {karmic.description}
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" sx={{ color: getKarmicTypeColor(karmic.type), mb: 2 }}>
                    Lektionen
                  </Typography>
                  <List>
                    {karmic.lessons.map((lesson, index) => (
                      <ListItem key={index} sx={{ px: 0 }}>
                        <ListItemIcon>
                          <Zap size={20} color={getKarmicTypeColor(karmic.type)} />
                        </ListItemIcon>
                        <ListItemText 
                          primary={lesson}
                          sx={{ color: 'rgba(78, 205, 196, 0.8)' }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" sx={{ color: getKarmicTypeColor(karmic.type), mb: 2 }}>
                    Zweck
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'rgba(78, 205, 196, 0.8)', mb: 2 }}>
                    {karmic.purpose}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(78, 205, 196, 0.6)' }}>
                    Dauer: {karmic.duration}
                  </Typography>
                </Grid>
              </Grid>
            </Card>
          </motion.div>
        )}

        {activeTab === 3 && family && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card sx={{
              background: 'linear-gradient(135deg, rgba(56, 178, 172, 0.08) 0%, rgba(20, 184, 166, 0.03) 100%)',
              border: '1px solid rgba(56, 178, 172, 0.2)',
              borderRadius: 4,
              p: 3,
              backdropFilter: 'blur(10px)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
            }}>
              <Typography variant="h5" sx={{ color: '#38b2ac', fontWeight: 700, mb: 3 }}>
                Familien-Dynamiken
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ color: '#4ECDC4', mr: 2, fontWeight: 600 }}>
                  {family.relationship}
                </Typography>
                <Chip 
                  label={`${family.compatibility}% Kompatibilität`}
                  sx={{ 
                    background: family.compatibility > 70 ? '#10b981' : family.compatibility > 50 ? '#f59e0b' : '#f56565',
                    color: 'white',
                    fontWeight: 600
                  }}
                />
              </Box>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Typography variant="h6" sx={{ color: '#38b2ac', mb: 2 }}>
                    Dynamiken
                  </Typography>
                  <List>
                    {family.dynamics.map((dynamic, index) => (
                      <ListItem key={index} sx={{ px: 0 }}>
                        <ListItemIcon>
                          <Users size={20} color="#38b2ac" />
                        </ListItemIcon>
                        <ListItemText 
                          primary={dynamic}
                          sx={{ color: 'rgba(78, 205, 196, 0.8)' }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Typography variant="h6" sx={{ color: '#f56565', mb: 2 }}>
                    Herausforderungen
                  </Typography>
                  <List>
                    {family.challenges.map((challenge, index) => (
                      <ListItem key={index} sx={{ px: 0 }}>
                        <ListItemIcon>
                          <AlertTriangle size={20} color="#f56565" />
                        </ListItemIcon>
                        <ListItemText 
                          primary={challenge}
                          sx={{ color: 'rgba(78, 205, 196, 0.8)' }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Typography variant="h6" sx={{ color: '#10b981', mb: 2 }}>
                    Empfehlungen
                  </Typography>
                  <List>
                    {family.advice.map((advice, index) => (
                      <ListItem key={index} sx={{ px: 0 }}>
                        <ListItemIcon>
                          <CheckCircle size={20} color="#10b981" />
                        </ListItemIcon>
                        <ListItemText 
                          primary={advice}
                          sx={{ color: 'rgba(78, 205, 196, 0.8)' }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Grid>
              </Grid>
            </Card>
          </motion.div>
        )}

        {/* Dialog for adding new relationship */}
        <Dialog 
          open={openDialog} 
          onClose={handleCloseDialog} 
          maxWidth="sm" 
          fullWidth
          PaperProps={{
            sx: {
              background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
              borderRadius: 4,
              border: '1px solid rgba(78, 205, 196, 0.1)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
            }
          }}
        >
          <DialogTitle sx={{ 
            color: '#4ECDC4', 
            background: 'transparent',
            fontWeight: 600,
            fontSize: '1.25rem'
          }}>
            Neue Beziehung analysieren
          </DialogTitle>
          <DialogContent sx={{ background: 'transparent' }}>
            <TextField
              fullWidth
              label="Person suchen"
              value={selectedPerson}
              onChange={(e) => setSelectedPerson(e.target.value)}
              sx={{ 
                mt: 2,
                '& .MuiOutlinedInput-root': {
                  background: 'rgba(78, 205, 196, 0.05)',
                  borderRadius: 3,
                  '& fieldset': {
                    borderColor: 'rgba(78, 205, 196, 0.2)'
                  },
                  '&:hover fieldset': {
                    borderColor: '#FFD700'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#FFD700'
                  }
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(78, 205, 196, 0.7)'
                }
              }}
              InputProps={{
                startAdornment: <Search size={20} style={{ marginRight: 8, color: '#FFD700' }} />
              }}
            />
          </DialogContent>
          <DialogActions sx={{ background: 'transparent', p: 3 }}>
            <Button 
              onClick={handleCloseDialog} 
              sx={{ 
                color: 'rgba(78, 205, 196, 0.7)',
                fontWeight: 500
              }}
            >
              Abbrechen
            </Button>
            <Button 
              onClick={handleCloseDialog}
              sx={{ 
                background: 'linear-gradient(135deg, #ff6b9d, #c44569)',
                color: 'white',
                fontWeight: 600,
                borderRadius: 3,
                px: 3,
                '&:hover': {
                  background: 'linear-gradient(135deg, #c44569, #ff6b9d)'
                }
              }}
            >
              Analysieren
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}
