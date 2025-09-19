'use client';

import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Card, 
  CardContent, 
  Button, 
  Grid, 
  Switch, 
  FormControlLabel,
  Paper,
  Chip
} from '@mui/material';
import CSSBodygraph from '../../components/CSSBodygraph';
import { CenterId, GateId } from '../../lib/hd-bodygraph/types';

export default function CSSBodygraphPage() {
  const [showLabels, setShowLabels] = useState(true);
  const [showGateNumbers, setShowGateNumbers] = useState(true);
  const [defined, setDefined] = useState({
    centers: {
      HEAD: true,
      AJNA: true,
      THROAT: true,
      G: true,
      HEART: false,
      SACRAL: true,
      SPLEEN: false,
      SOLAR: false,
      ROOT: true,
    } as Partial<Record<CenterId, boolean>>,
    gates: {
      1: true,
      2: true,
      3: true,
      5: true,
      7: true,
      8: true,
      9: true,
      10: true,
      11: true,
      13: true,
      14: true,
      15: true,
      16: true,
      18: false,
      19: true,
      20: true,
      21: false,
      22: false,
      23: true,
      24: true,
      25: true,
      26: false,
      28: false,
      29: true,
      30: false,
      31: true,
      32: false,
      33: true,
      34: true,
      36: false,
      37: false,
      38: true,
      39: true,
      40: false,
      41: true,
      44: false,
      46: true,
      47: true,
      48: false,
      49: false,
      50: false,
      51: false,
      52: true,
      53: true,
      54: true,
      55: false,
      56: true,
      57: false,
      58: true,
      59: true,
      60: true,
      61: true,
      62: true,
      63: true,
      64: true,
    } as Partial<Record<GateId, boolean>>,
    channels: {
      '1-8': true,
      '2-14': true,
      '3-60': true,
      '5-15': true,
      '7-31': true,
      '9-52': true,
      '10-20': true,
      '10-57': false,
      '11-56': true,
      '13-33': true,
      '16-48': false,
      '17-62': false,
      '18-58': false,
      '19-49': false,
      '20-34': true,
      '20-57': false,
      '21-45': false,
      '22-12': false,
      '23-43': false,
      '24-61': true,
      '25-51': false,
      '26-44': false,
      '27-50': false,
      '28-38': false,
      '29-46': false,
      '30-41': false,
      '32-54': false,
      '35-36': false,
      '37-40': false,
      '39-55': false,
      '42-53': false,
      '47-64': true,
    } as Partial<Record<string, boolean>>,
  });

  const toggleCenter = (centerId: CenterId) => {
    setDefined(prev => ({
      ...prev,
      centers: {
        ...prev.centers,
        [centerId]: !prev.centers[centerId],
      },
    }));
  };

  const toggleGate = (gateId: GateId) => {
    setDefined(prev => ({
      ...prev,
      gates: {
        ...prev.gates,
        [gateId]: !prev.gates[gateId],
      },
    }));
  };

  const toggleChannel = (channelId: string) => {
    setDefined(prev => ({
      ...prev,
      channels: {
        ...prev.channels,
        [channelId]: !prev.channels[channelId],
      },
    }));
  };

  const resetToDefault = () => {
    setDefined({
      centers: {
        HEAD: true,
        AJNA: true,
        THROAT: true,
        G: true,
        HEART: false,
        SACRAL: true,
        SPLEEN: false,
        SOLAR: false,
        ROOT: true,
      },
      gates: {
        1: true, 2: true, 3: true, 5: true, 7: true, 8: true, 9: true, 10: true,
        11: true, 13: true, 14: true, 15: true, 16: true, 19: true, 20: true,
        23: true, 24: true, 25: true, 29: true, 31: true, 33: true, 34: true,
        38: true, 39: true, 41: true, 46: true, 47: true, 52: true, 53: true,
        54: true, 56: true, 58: true, 59: true, 60: true, 61: true, 62: true,
        63: true, 64: true,
      },
      channels: {
        '1-8': true, '2-14': true, '3-60': true, '5-15': true, '7-31': true,
        '9-52': true, '10-20': true, '11-56': true, '13-33': true, '20-34': true,
        '24-61': true, '47-64': true,
      },
    });
  };

  const clearAll = () => {
    setDefined({
      centers: {},
      gates: {},
      channels: {},
    });
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
        CSS Bodygraph - Human Design Chart
      </Typography>

      <Grid container spacing={3}>
        {/* Bodygraph */}
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                CSS Bodygraph
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  minHeight: '600px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: 2,
                  p: 2,
                }}
              >
                <CSSBodygraph
                  defined={defined}
                  width={800}
                  height={1000}
                  showLabels={showLabels}
                  showGateNumbers={showGateNumbers}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Controls */}
        <Grid item xs={12} lg={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Einstellungen
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={showLabels}
                      onChange={(e) => setShowLabels(e.target.checked)}
                    />
                  }
                  label="Zentren-Labels anzeigen"
                />
              </Box>

              <Box sx={{ mb: 3 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={showGateNumbers}
                      onChange={(e) => setShowGateNumbers(e.target.checked)}
                    />
                  }
                  label="Gate-Nummern anzeigen"
                />
              </Box>

              <Box sx={{ mb: 3 }}>
                <Button
                  variant="outlined"
                  onClick={resetToDefault}
                  sx={{ mr: 1, mb: 1 }}
                >
                  Standard
                </Button>
                <Button
                  variant="outlined"
                  onClick={clearAll}
                  sx={{ mb: 1 }}
                >
                  Alle löschen
                </Button>
              </Box>

              <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                Zentren
              </Typography>
              <Box sx={{ mb: 2 }}>
                {(['HEAD', 'AJNA', 'THROAT', 'G', 'HEART', 'SACRAL', 'SPLEEN', 'SOLAR', 'ROOT'] as CenterId[]).map((centerId) => (
                  <Chip
                    key={centerId}
                    label={centerId}
                    color={defined.centers?.[centerId] ? 'primary' : 'default'}
                    onClick={() => toggleCenter(centerId)}
                    sx={{ m: 0.5 }}
                  />
                ))}
              </Box>

              <Typography variant="h6" gutterBottom>
                Aktive Gates
              </Typography>
              <Paper sx={{ p: 2, maxHeight: 200, overflow: 'auto' }}>
                {Object.entries(defined.gates || {})
                  .filter(([_, active]) => active)
                  .map(([gateId, _]) => (
                    <Chip
                      key={gateId}
                      label={`Gate ${gateId}`}
                      size="small"
                      onClick={() => toggleGate(parseInt(gateId) as GateId)}
                      sx={{ m: 0.25 }}
                    />
                  ))}
              </Paper>

              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Aktive Kanäle
              </Typography>
              <Paper sx={{ p: 2, maxHeight: 200, overflow: 'auto' }}>
                {Object.entries(defined.channels || {})
                  .filter(([_, active]) => active)
                  .map(([channelId, _]) => (
                    <Chip
                      key={channelId}
                      label={`Channel ${channelId}`}
                      size="small"
                      color="secondary"
                      onClick={() => toggleChannel(channelId)}
                      sx={{ m: 0.25 }}
                    />
                  ))}
              </Paper>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
