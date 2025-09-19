"use client";

import React, { useState } from 'react';
import { Box, Container, Typography, Card, CardContent, Button, Grid, Chip } from '@mui/material';
import Bodygraph from '@/components/Bodygraph';
import { DefinedState } from '@/lib/hd-bodygraph/types';

export default function BodygraphDemo() {
  const [defined, setDefined] = useState<DefinedState>({
    centers: { 
      SACRAL: true, 
      THROAT: true,
      G: true 
    },
    channels: { 
      "34-20": true,
      "1-8": true,
      "10-20": true
    },
    gates: { 
      34: true, 
      20: true,
      1: true,
      8: true,
      10: true
    }
  });

  const toggleCenter = (centerId: string) => {
    setDefined(prev => ({
      ...prev,
      centers: {
        ...prev.centers,
        [centerId]: !prev.centers?.[centerId as keyof typeof prev.centers]
      }
    }));
  };

  const toggleChannel = (channelId: string) => {
    setDefined(prev => ({
      ...prev,
      channels: {
        ...prev.channels,
        [channelId]: !prev.channels?.[channelId]
      }
    }));
  };

  const toggleGate = (gateId: number) => {
    setDefined(prev => ({
      ...prev,
      gates: {
        ...prev.gates,
        [gateId]: !prev.gates?.[gateId]
      }
    }));
  };

  const resetAll = () => {
    setDefined({
      centers: {},
      channels: {},
      gates: {}
    });
  };

  const loadExample = (type: 'generator' | 'projector' | 'manifestor' | 'reflector') => {
    switch (type) {
      case 'generator':
        setDefined({
          centers: { SACRAL: true, THROAT: true, G: true },
          channels: { "34-20": true, "1-8": true, "10-20": true },
          gates: { 34: true, 20: true, 1: true, 8: true, 10: true }
        });
        break;
      case 'projector':
        setDefined({
          centers: { THROAT: true, G: true, AJNA: true },
          channels: { "1-8": true, "11-56": true },
          gates: { 1: true, 8: true, 11: true, 56: true }
        });
        break;
      case 'manifestor':
        setDefined({
          centers: { THROAT: true, G: true, ROOT: true },
          channels: { "20-34": true, "1-8": true },
          gates: { 20: true, 34: true, 1: true, 8: true }
        });
        break;
      case 'reflector':
        setDefined({
          centers: {},
          channels: {},
          gates: {}
        });
        break;
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h2" sx={{ color: '#1a1a2e', mb: 2, fontWeight: 800 }}>
          Human Design Bodygraph
        </Typography>
        <Typography variant="h6" sx={{ color: '#6c757d', mb: 4 }}>
          Interaktive Demo mit allen 9 Zentren, 36 Kanälen und 64 Gates
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Bodygraph */}
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3, textAlign: 'center' }}>
            <CardContent>
              <Bodygraph 
                defined={defined} 
                width={600} 
                height={800}
                showLabels={true}
                showGateNumbers={true}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Controls */}
        <Grid item xs={12} md={4}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            
            {/* Example Types */}
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, color: '#1a1a2e' }}>
                  Beispiel-Typen
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Button 
                    variant="outlined" 
                    onClick={() => loadExample('generator')}
                    sx={{ mb: 1 }}
                  >
                    Generator
                  </Button>
                  <Button 
                    variant="outlined" 
                    onClick={() => loadExample('projector')}
                    sx={{ mb: 1 }}
                  >
                    Projector
                  </Button>
                  <Button 
                    variant="outlined" 
                    onClick={() => loadExample('manifestor')}
                    sx={{ mb: 1 }}
                  >
                    Manifestor
                  </Button>
                  <Button 
                    variant="outlined" 
                    onClick={() => loadExample('reflector')}
                    sx={{ mb: 1 }}
                  >
                    Reflector
                  </Button>
                  <Button 
                    variant="outlined" 
                    color="error"
                    onClick={resetAll}
                  >
                    Alles zurücksetzen
                  </Button>
                </Box>
              </CardContent>
            </Card>

            {/* Centers */}
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, color: '#1a1a2e' }}>
                  Zentren
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {['HEAD', 'AJNA', 'THROAT', 'G', 'HEART', 'SACRAL', 'SPLEEN', 'SOLAR', 'ROOT'].map(center => (
                    <Chip
                      key={center}
                      label={center}
                      clickable
                      color={defined.centers?.[center as keyof typeof defined.centers] ? 'primary' : 'default'}
                      onClick={() => toggleCenter(center)}
                    />
                  ))}
                </Box>
              </CardContent>
            </Card>

            {/* Channels */}
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, color: '#1a1a2e' }}>
                  Kanäle
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {['34-20', '1-8', '10-20', '11-56', '20-34', '1-8'].map(channel => (
                    <Chip
                      key={channel}
                      label={channel}
                      clickable
                      color={defined.channels?.[channel] ? 'primary' : 'default'}
                      onClick={() => toggleChannel(channel)}
                    />
                  ))}
                </Box>
              </CardContent>
            </Card>

            {/* Gates */}
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, color: '#1a1a2e' }}>
                  Gates
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {[1, 8, 10, 20, 34, 11, 56].map(gate => (
                    <Chip
                      key={gate}
                      label={`Gate ${gate}`}
                      clickable
                      color={defined.gates?.[gate] ? 'primary' : 'default'}
                      onClick={() => toggleGate(gate)}
                    />
                  ))}
                </Box>
              </CardContent>
            </Card>

            {/* Info */}
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, color: '#1a1a2e' }}>
                  Info
                </Typography>
                <Typography variant="body2" sx={{ color: '#6c757d', mb: 2 }}>
                  • <strong>Definierte Zentren</strong> sind gefüllt und zeigen deine festen Eigenschaften
                </Typography>
                <Typography variant="body2" sx={{ color: '#6c757d', mb: 2 }}>
                  • <strong>Aktive Kanäle</strong> verbinden definierte Zentren
                </Typography>
                <Typography variant="body2" sx={{ color: '#6c757d', mb: 2 }}>
                  • <strong>Gates</strong> sind die Endpunkte der Kanäle
                </Typography>
                <Typography variant="body2" sx={{ color: '#6c757d' }}>
                  • Klicke auf die Chips um Elemente zu aktivieren/deaktivieren
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}
