"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Button,
  Chip,
  Stack,
  Divider
} from '@mui/material';
import { motion } from 'framer-motion';
import { Share2, Eye, Clock, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

interface SharedChartData {
  type: string;
  profile: string;
  authority: string;
  centers: any;
  gates: any[];
  channels: any[];
  isAnonymous: boolean;
  createdAt: string;
  expiresAt: string;
  views: number;
}

export default function SharedChartPage() {
  const params = useParams();
  const router = useRouter();
  const shareId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chartData, setChartData] = useState<SharedChartData | null>(null);

  useEffect(() => {
    if (shareId) {
      loadSharedChart();
    }
  }, [shareId]);

  const loadSharedChart = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/share/${shareId}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          setError('Dieser geteilte Chart wurde nicht gefunden oder ist abgelaufen.');
        } else if (response.status === 410) {
          setError('Dieser geteilte Chart ist abgelaufen.');
        } else {
          setError('Fehler beim Laden des Charts.');
        }
        return;
      }

      const data = await response.json();
      setChartData(data);

    } catch (err) {
      console.error('Error loading shared chart:', err);
      setError('Ein unerwarteter Fehler ist aufgetreten.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)'
      }}>
        <Stack spacing={2} alignItems="center">
          <CircularProgress sx={{ color: '#FFD700' }} size={60} />
          <Typography variant="h6" sx={{ color: 'white' }}>
            Lade geteilten Chart...
          </Typography>
        </Stack>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
        p: 3
      }}>
        <Container maxWidth="sm">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card sx={{
              background: 'rgba(255,255,255,0.05)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 3
            }}>
              <CardContent>
                <Stack spacing={3} alignItems="center">
                  <AlertTriangle size={48} color="#f59e0b" />
                  <Typography variant="h5" sx={{ color: 'white', textAlign: 'center' }}>
                    {error}
                  </Typography>
                  <Button
                    component={Link}
                    href="/"
                    variant="contained"
                    sx={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)'
                      }
                    }}
                  >
                    Zur Startseite
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </motion.div>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{
      minHeight: '100vh',
      background: `
        linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)
      `,
      py: 8
    }}>
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header */}
          <Stack spacing={2} mb={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Share2 size={32} color="#FFD700" />
              <Typography variant="h3" sx={{ color: 'white', fontWeight: 700 }}>
                Geteilter Human Design Chart
              </Typography>
            </Box>

            {/* Metadata */}
            <Stack direction="row" spacing={2} flexWrap="wrap">
              {chartData?.isAnonymous && (
                <Chip
                  icon={<Eye size={16} />}
                  label="Anonymisiert"
                  sx={{
                    background: 'rgba(255, 215, 0, 0.2)',
                    color: '#FFD700',
                    border: '1px solid #FFD700'
                  }}
                />
              )}
              <Chip
                icon={<Eye size={16} />}
                label={`${chartData?.views || 0} Aufrufe`}
                sx={{
                  background: 'rgba(255,255,255,0.1)',
                  color: 'white',
                  border: '1px solid rgba(255,255,255,0.2)'
                }}
              />
              <Chip
                icon={<Clock size={16} />}
                label={`Geteilt am ${new Date(chartData?.createdAt || '').toLocaleDateString('de-DE')}`}
                sx={{
                  background: 'rgba(255,255,255,0.1)',
                  color: 'white',
                  border: '1px solid rgba(255,255,255,0.2)'
                }}
              />
            </Stack>
          </Stack>

          <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', my: 4 }} />

          {/* Chart Content */}
          <Card sx={{
            background: 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 3
          }}>
            <CardContent sx={{ p: 4 }}>
              <Stack spacing={4}>
                {/* Basic Info */}
                <Box>
                  <Typography variant="h5" sx={{ color: '#FFD700', mb: 2 }}>
                    Human Design Typ
                  </Typography>
                  <Typography variant="h4" sx={{ color: 'white' }}>
                    {chartData?.type}
                  </Typography>
                </Box>

                <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />

                {/* Profile & Authority */}
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={4}>
                  <Box flex={1}>
                    <Typography variant="h6" sx={{ color: '#FFD700', mb: 1 }}>
                      Profil
                    </Typography>
                    <Typography variant="h5" sx={{ color: 'white' }}>
                      {chartData?.profile}
                    </Typography>
                  </Box>
                  <Box flex={1}>
                    <Typography variant="h6" sx={{ color: '#FFD700', mb: 1 }}>
                      Autorität
                    </Typography>
                    <Typography variant="h5" sx={{ color: 'white' }}>
                      {chartData?.authority}
                    </Typography>
                  </Box>
                </Stack>

                <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />

                {/* CTA */}
                <Box sx={{
                  p: 3,
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(255, 165, 0, 0.1) 100%)',
                  border: '1px solid rgba(255, 215, 0, 0.3)',
                  textAlign: 'center'
                }}>
                  <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                    Möchtest du dein eigenes Human Design Chart erstellen?
                  </Typography>
                  <Button
                    component={Link}
                    href="/register"
                    variant="contained"
                    size="large"
                    sx={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      px: 4,
                      py: 1.5,
                      '&:hover': {
                        background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                        transform: 'scale(1.05)'
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Jetzt kostenlos starten
                  </Button>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </motion.div>
      </Container>
    </Box>
  );
}

