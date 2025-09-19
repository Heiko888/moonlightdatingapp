"use client";
import React, { useState } from 'react';
import { Container, Typography, Card, CardContent, Box, Button, Paper, Chip, Tabs, Tab, Grid, TextField, InputAdornment } from '@mui/material';
import { Search, Zap, Eye, Crown, Shield, Target, Star, Circle, ChevronDown, ArrowRight, Heart } from 'lucide-react';
import AnimatedStars from '@/components/AnimatedStars';
import Link from 'next/link';

interface Channel {
  id: string;
  name: string;
  germanName: string;
  description: string;
  fromGate: number;
  toGate: number;
  fromCenter: string;
  toCenter: string;
  keywords: string[];
  energy: string;
  manifestation: string;
  color: string;
  icon: React.ReactNode;
}

export default function ChannelsPage() {
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  const channels: Channel[] = [
    {
      id: '1-8',
      name: 'Inspiration Channel',
      germanName: 'Inspirations-Kanal',
      description: 'Der Kanal der Inspiration verbindet das G-Zentrum mit dem Kehl-Zentrum und manifestiert kreative Führung.',
      fromGate: 1,
      toGate: 8,
      fromCenter: 'G Center',
      toCenter: 'Throat Center',
      keywords: ['Inspiration', 'Kreativität', 'Führung', 'Manifestation', 'Ausdruck'],
      energy: 'Kreative Führungsenergie, die durch natürliche Inspiration manifestiert wird.',
      manifestation: 'Natürliche Führung durch kreative Inspiration und authentischen Ausdruck.',
      color: '#10b981',
      icon: <Zap size={24} />
    },
    {
      id: '2-14',
      name: 'The Channel of the Beat',
      germanName: 'Kanal des Rhythmus',
      description: 'Der Kanal des Rhythmus verbindet das G-Zentrum mit dem Sakral-Zentrum und schafft natürliche Führung.',
      fromGate: 2,
      toGate: 14,
      fromCenter: 'G Center',
      toCenter: 'Sacral Center',
      keywords: ['Rhythmus', 'Führung', 'Energie', 'Timing', 'Natur'],
      energy: 'Rhythmische Führungsenergie, die durch natürliche Timing und Energie fließt.',
      manifestation: 'Natürliche Führung durch rhythmische Energie und perfektes Timing.',
      color: '#3b82f6',
      icon: <Target size={24} />
    },
    {
      id: '3-60',
      name: 'Mutation Channel',
      germanName: 'Mutations-Kanal',
      description: 'Der Mutations-Kanal verbindet das Sakral-Zentrum mit dem Wurzel-Zentrum und schafft evolutionäre Veränderung.',
      fromGate: 3,
      toGate: 60,
      fromCenter: 'Sacral Center',
      toCenter: 'Root Center',
      keywords: ['Mutation', 'Veränderung', 'Evolution', 'Innovation', 'Wachstum'],
      energy: 'Mutationsenergie, die evolutionäre Veränderung und Innovation antreibt.',
      manifestation: 'Evolutionäre Veränderung durch natürliche Mutation und Innovation.',
      color: '#f59e0b',
      icon: <Star size={24} />
    },
    {
      id: '4-63',
      name: 'Logic Channel',
      germanName: 'Logik-Kanal',
      description: 'Der Logik-Kanal verbindet das Ajna-Zentrum mit dem Kopf-Zentrum und schafft mentale Klarheit.',
      fromGate: 4,
      toGate: 63,
      fromCenter: 'Ajna Center',
      toCenter: 'Head Center',
      keywords: ['Logik', 'Klarheit', 'Mental', 'Verstehen', 'Weisheit'],
      energy: 'Logische Energie, die mentale Klarheit und Verstehen schafft.',
      manifestation: 'Mentale Klarheit durch logisches Denken und natürliches Verstehen.',
      color: '#8b5cf6',
      icon: <Eye size={24} />
    },
    {
      id: '5-15',
      name: 'Rhythm Channel',
      germanName: 'Rhythmus-Kanal',
      description: 'Der Rhythmus-Kanal verbindet das Sakral-Zentrum mit dem G-Zentrum und schafft natürliche Führung.',
      fromGate: 5,
      toGate: 15,
      fromCenter: 'Sacral Center',
      toCenter: 'G Center',
      keywords: ['Rhythmus', 'Führung', 'Natur', 'Timing', 'Energie'],
      energy: 'Rhythmische Führungsenergie, die durch natürliche Timing fließt.',
      manifestation: 'Natürliche Führung durch rhythmische Energie und perfektes Timing.',
      color: '#06b6d4',
      icon: <Circle size={24} />
    },
    {
      id: '6-59',
      name: 'Intimacy Channel',
      germanName: 'Intimacy-Kanal',
      description: 'Der Intimacy-Kanal verbindet das Sakral-Zentrum mit dem Solarplexus-Zentrum und schafft emotionale Verbindung.',
      fromGate: 6,
      toGate: 59,
      fromCenter: 'Sacral Center',
      toCenter: 'Solar Plexus Center',
      keywords: ['Intimität', 'Emotion', 'Verbindung', 'Beziehung', 'Empathie'],
      energy: 'Intimationsenergie, die emotionale Verbindung und Empathie schafft.',
      manifestation: 'Emotionale Verbindung durch natürliche Intimität und Empathie.',
      color: '#ef4444',
      icon: <Heart size={24} />
    },
    {
      id: '7-31',
      name: 'The Alpha Channel',
      germanName: 'Alpha-Kanal',
      description: 'Der Alpha-Kanal verbindet das G-Zentrum mit dem Kehl-Zentrum und schafft natürliche Führung.',
      fromGate: 7,
      toGate: 31,
      fromCenter: 'G Center',
      toCenter: 'Throat Center',
      keywords: ['Alpha', 'Führung', 'Manifestation', 'Ausdruck', 'Autorität'],
      energy: 'Alpha-Führungsenergie, die natürliche Autorität und Manifestation schafft.',
      manifestation: 'Natürliche Führung durch Alpha-Energie und authentische Autorität.',
      color: '#84cc16',
      icon: <Crown size={24} />
    },
    {
      id: '9-52',
      name: 'Concentration Channel',
      germanName: 'Konzentrations-Kanal',
      description: 'Der Konzentrations-Kanal verbindet das Sakral-Zentrum mit dem Milz-Zentrum und schafft fokussierte Energie.',
      fromGate: 9,
      toGate: 52,
      fromCenter: 'Sacral Center',
      toCenter: 'Spleen Center',
      keywords: ['Konzentration', 'Fokus', 'Energie', 'Intuition', 'Stärke'],
      energy: 'Konzentrationsenergie, die fokussierte Kraft und intuitive Stärke schafft.',
      manifestation: 'Fokussierte Energie durch natürliche Konzentration und intuitive Stärke.',
      color: '#f97316',
      icon: <Shield size={24} />
    }
  ];

  // Füge weitere Channels hinzu (vereinfacht für Demo)
  const channelNumbers = [
    '10-20', '11-56', '12-22', '13-33', '16-48', '17-62', '18-58', '19-49',
    '20-34', '21-45', '23-43', '24-61', '25-51', '26-44', '27-50', '28-38',
    '29-46', '30-41', '32-54', '35-36', '37-40', '39-55', '42-53', '47-64',
    '57-20', '58-18', '60-3', '61-24', '62-17', '63-4', '64-47'
  ];

  channelNumbers.forEach((channelId, index) => {
    const [fromGate, toGate] = channelId.split('-').map(Number);
    channels.push({
      id: channelId,
      name: `Channel ${channelId}`,
      germanName: `Kanal ${channelId}`,
      description: `Der Kanal ${channelId} verbindet Tor ${fromGate} mit Tor ${toGate} und schafft eine spezifische energetische Verbindung.`,
      fromGate,
      toGate,
      fromCenter: ['G Center', 'Sacral Center', 'Ajna Center', 'Head Center', 'Throat Center', 'Heart Center', 'Solar Plexus Center', 'Spleen Center', 'Root Center'][fromGate % 9],
      toCenter: ['G Center', 'Sacral Center', 'Ajna Center', 'Head Center', 'Throat Center', 'Heart Center', 'Solar Plexus Center', 'Spleen Center', 'Root Center'][toGate % 9],
      keywords: ['Energie', 'Verbindung', 'Manifestation', 'Ausdruck', 'Kraft'],
      energy: `Energetische Verbindung zwischen Tor ${fromGate} und Tor ${toGate}.`,
      manifestation: `Manifestation durch die energetische Verbindung von Tor ${fromGate} zu Tor ${toGate}.`,
      color: ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#06b6d4', '#ef4444', '#84cc16', '#f97316', '#ec4899', '#14b8a6'][index % 10],
      icon: <Zap size={24} />
    });
  });

  const filteredChannels = channels.filter(channel =>
    channel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    channel.germanName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    channel.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm.toLowerCase())) ||
    channel.id.includes(searchTerm)
  );

  const handleChannelSelect = (channel: Channel) => {
    setSelectedChannel(channel);
    setActiveTab(0);
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0b0d12 0%, #1a1f2b 100%)',
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
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 3 }}>
            <Zap size={32} color="#d8b35c" />
            <Typography variant="h2" sx={{
              color: '#f5f2ea',
              fontWeight: 800,
              textShadow: '0 4px 20px rgba(0,0,0,0.6)',
              fontSize: { xs: '2.5rem', md: '3.5rem' }
            }}>
              Die 36 Channels
            </Typography>
            <Zap size={32} color="#d8b35c" />
          </Box>
          <Typography variant="h6" sx={{
            color: 'rgba(245,242,234,0.8)',
            fontSize: { xs: '1.1rem', md: '1.3rem' }
          }}>
            Entdecke alle 36 Human Design Channels und ihre energetischen Verbindungen
          </Typography>
        </Box>

        {/* Search */}
        <Box sx={{ mb: 4 }}>
          <TextField
            fullWidth
            placeholder="Suche nach Channels, Namen oder Schlüsselwörtern..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                background: 'rgba(245,242,234,0.05)',
                border: '1px solid rgba(216,179,92,0.3)',
                borderRadius: 3,
                color: '#f5f2ea',
                '&:hover': {
                  borderColor: 'rgba(216,179,92,0.5)'
                },
                '&.Mui-focused': {
                  borderColor: '#d8b35c'
                }
              },
              '& .MuiInputBase-input': {
                color: '#f5f2ea',
                '&::placeholder': {
                  color: 'rgba(245,242,234,0.5)',
                  opacity: 1
                }
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search color="#d8b35c" />
                </InputAdornment>
              )
            }}
          />
        </Box>

        <Grid container spacing={4}>
          {/* Channels Grid */}
          <Grid item xs={12} md={8}>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, gap: 3 }}>
              {filteredChannels.map((channel) => (
                <Card
                  key={channel.id}
                  onClick={() => handleChannelSelect(channel)}
                  sx={{
                    background: 'linear-gradient(135deg, rgba(11,13,18,0.9) 0%, rgba(26,31,43,0.95) 100%)',
                    borderRadius: 3,
                    border: selectedChannel?.id === channel.id ? '2px solid #d8b35c' : '1px solid rgba(216,179,92,0.2)',
                    backdropFilter: 'blur(10px)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    '&:hover': {
                      borderColor: 'rgba(216,179,92,0.4)',
                      transform: 'translateY(-4px)',
                      boxShadow: '0 12px 32px rgba(216,179,92,0.2)'
                    }
                  }}
                >
                  <CardContent sx={{ p: 3, textAlign: 'center' }}>
                    <Box sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 60,
                      height: 60,
                      borderRadius: '50%',
                      background: `linear-gradient(135deg, ${channel.color}, ${channel.color}80)`,
                      margin: '0 auto 16px',
                      color: '#fff'
                    }}>
                      {channel.icon}
                    </Box>
                    
                    <Typography variant="h4" sx={{
                      color: channel.color,
                      fontWeight: 700,
                      mb: 1
                    }}>
                      {channel.id}
                    </Typography>
                    
                    <Typography variant="h6" sx={{
                      color: '#f5f2ea',
                      fontWeight: 600,
                      mb: 1
                    }}>
                      {channel.germanName}
                    </Typography>
                    
                    <Typography variant="body2" sx={{
                      color: 'rgba(245,242,234,0.7)',
                      fontWeight: 600,
                      mb: 2,
                      textTransform: 'uppercase',
                      letterSpacing: 1
                    }}>
                      {channel.name}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 2 }}>
                      <Chip
                        label={`${channel.fromGate}`}
                        size="small"
                        sx={{
                          background: 'rgba(16,185,129,0.1)',
                          color: '#10b981',
                          border: '1px solid rgba(16,185,129,0.3)',
                          fontSize: '0.8rem'
                        }}
                      />
                      <ArrowRight size={16} color="#d8b35c" />
                      <Chip
                        label={`${channel.toGate}`}
                        size="small"
                        sx={{
                          background: 'rgba(239,68,68,0.1)',
                          color: '#ef4444',
                          border: '1px solid rgba(239,68,68,0.3)',
                          fontSize: '0.8rem'
                        }}
                      />
                    </Box>
                    
                    <Typography sx={{
                      color: 'rgba(245,242,234,0.8)',
                      fontSize: '0.9rem',
                      lineHeight: 1.4,
                      mb: 2
                    }}>
                      {channel.description}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, justifyContent: 'center' }}>
                      {channel.keywords.slice(0, 2).map((keyword, index) => (
                        <Chip
                          key={index}
                          label={keyword}
                          size="small"
                          sx={{
                            background: 'rgba(245,242,234,0.1)',
                            color: 'rgba(245,242,234,0.7)',
                            border: '1px solid rgba(216,179,92,0.2)',
                            fontSize: '0.7rem'
                          }}
                        />
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Grid>

          {/* Channel Details */}
          <Grid item xs={12} md={4}>
            {selectedChannel ? (
              <Card sx={{
                background: 'linear-gradient(135deg, rgba(11,13,18,0.95) 0%, rgba(26,31,43,0.98) 100%)',
                borderRadius: 4,
                boxShadow: '0 25px 50px rgba(0,0,0,0.3)',
                border: '1px solid rgba(216,179,92,0.2)',
                backdropFilter: 'blur(20px)',
                position: 'sticky',
                top: 24
              }}>
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <Box sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      background: `linear-gradient(135deg, ${selectedChannel.color}, ${selectedChannel.color}80)`,
                      margin: '0 auto 16px',
                      color: '#fff'
                    }}>
                      {selectedChannel.icon}
                    </Box>
                    
                    <Typography variant="h2" sx={{
                      color: selectedChannel.color,
                      fontWeight: 800,
                      mb: 1
                    }}>
                      {selectedChannel.id}
                    </Typography>
                    
                    <Typography variant="h4" sx={{
                      color: '#f5f2ea',
                      fontWeight: 700,
                      mb: 1
                    }}>
                      {selectedChannel.germanName}
                    </Typography>
                    
                    <Typography variant="body1" sx={{
                      color: 'rgba(245,242,234,0.7)',
                      fontWeight: 600,
                      mb: 2,
                      textTransform: 'uppercase',
                      letterSpacing: 1
                    }}>
                      {selectedChannel.name}
                    </Typography>
                  </Box>

                  <Tabs
                    value={activeTab}
                    onChange={(e, newValue) => setActiveTab(newValue)}
                    sx={{
                      '& .MuiTab-root': {
                        color: 'rgba(245,242,234,0.7)',
                        '&.Mui-selected': {
                          color: '#d8b35c'
                        }
                      },
                      '& .MuiTabs-indicator': {
                        backgroundColor: '#d8b35c'
                      }
                    }}
                  >
                    <Tab label="Übersicht" />
                    <Tab label="Energie" />
                    <Tab label="Verbindung" />
                  </Tabs>

                  <Box sx={{ mt: 3 }}>
                    {activeTab === 0 && (
                      <Box>
                        <Typography sx={{
                          color: 'rgba(245,242,234,0.9)',
                          lineHeight: 1.6,
                          mb: 3
                        }}>
                          {selectedChannel.description}
                        </Typography>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 3 }}>
                          <Box sx={{ textAlign: 'center' }}>
                            <Chip
                              label={`Tor ${selectedChannel.fromGate}`}
                              sx={{
                                background: 'rgba(16,185,129,0.1)',
                                color: '#10b981',
                                border: '1px solid rgba(16,185,129,0.3)',
                                mb: 1
                              }}
                            />
                            <Typography sx={{ color: 'rgba(245,242,234,0.7)', fontSize: '0.8rem' }}>
                              {selectedChannel.fromCenter}
                            </Typography>
                          </Box>
                          <ArrowRight size={24} color="#d8b35c" />
                          <Box sx={{ textAlign: 'center' }}>
                            <Chip
                              label={`Tor ${selectedChannel.toGate}`}
                              sx={{
                                background: 'rgba(239,68,68,0.1)',
                                color: '#ef4444',
                                border: '1px solid rgba(239,68,68,0.3)',
                                mb: 1
                              }}
                            />
                            <Typography sx={{ color: 'rgba(245,242,234,0.7)', fontSize: '0.8rem' }}>
                              {selectedChannel.toCenter}
                            </Typography>
                          </Box>
                        </Box>
                        
                        <Typography variant="h6" sx={{ color: '#d8b35c', mb: 2 }}>
                          Schlüsselwörter
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {selectedChannel.keywords.map((keyword, index) => (
                            <Chip
                              key={index}
                              label={keyword}
                              sx={{
                                background: 'rgba(245,242,234,0.1)',
                                color: 'rgba(245,242,234,0.8)',
                                border: '1px solid rgba(216,179,92,0.2)',
                                m: 0.5
                              }}
                            />
                          ))}
                        </Box>
                      </Box>
                    )}

                    {activeTab === 1 && (
                      <Box>
                        <Typography variant="h6" sx={{ color: '#d8b35c', mb: 2 }}>
                          Energetische Qualität
                        </Typography>
                        <Typography sx={{
                          color: 'rgba(245,242,234,0.9)',
                          lineHeight: 1.6,
                          mb: 3
                        }}>
                          {selectedChannel.energy}
                        </Typography>
                        
                        <Typography variant="h6" sx={{ color: '#d8b35c', mb: 2 }}>
                          Manifestation
                        </Typography>
                        <Typography sx={{
                          color: 'rgba(245,242,234,0.9)',
                          lineHeight: 1.6
                        }}>
                          {selectedChannel.manifestation}
                        </Typography>
                      </Box>
                    )}

                    {activeTab === 2 && (
                      <Box>
                        <Typography variant="h6" sx={{ color: '#d8b35c', mb: 2 }}>
                          Zentren-Verbindung
                        </Typography>
                        
                        <Box sx={{ mb: 3 }}>
                          <Typography variant="subtitle1" sx={{ color: '#10b981', fontWeight: 600, mb: 1 }}>
                            Von: {selectedChannel.fromCenter}
                          </Typography>
                          <Typography sx={{
                            color: 'rgba(245,242,234,0.8)',
                            lineHeight: 1.5,
                            mb: 2
                          }}>
                            Tor {selectedChannel.fromGate} im {selectedChannel.fromCenter} initiiert die energetische Verbindung.
                          </Typography>
                        </Box>
                        
                        <Box sx={{ mb: 3 }}>
                          <Typography variant="subtitle1" sx={{ color: '#ef4444', fontWeight: 600, mb: 1 }}>
                            Zu: {selectedChannel.toCenter}
                          </Typography>
                          <Typography sx={{
                            color: 'rgba(245,242,234,0.8)',
                            lineHeight: 1.5,
                            mb: 2
                          }}>
                            Tor {selectedChannel.toGate} im {selectedChannel.toCenter} empfängt und manifestiert die Energie.
                          </Typography>
                        </Box>
                        
                        <Typography variant="h6" sx={{ color: '#d8b35c', mb: 2 }}>
                          Energetische Auswirkung
                        </Typography>
                        <Typography sx={{
                          color: 'rgba(245,242,234,0.8)',
                          lineHeight: 1.6
                        }}>
                          Diese Verbindung schafft eine definierte energetische Qualität, die konstant und zuverlässig in der Persönlichkeit manifestiert wird.
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </CardContent>
              </Card>
            ) : (
              <Paper sx={{
                background: 'linear-gradient(135deg, rgba(11,13,18,0.8) 0%, rgba(26,31,43,0.9) 100%)',
                border: '1px solid rgba(216,179,92,0.2)',
                borderRadius: 3,
                p: 4,
                textAlign: 'center',
                backdropFilter: 'blur(10px)'
              }}>
                <Zap size={48} color="rgba(216,179,92,0.5)" style={{ marginBottom: 16 }} />
                <Typography sx={{ color: 'rgba(245,242,234,0.7)', fontSize: '1.1rem' }}>
                  Wähle einen Kanal aus, um mehr zu erfahren
                </Typography>
              </Paper>
            )}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
