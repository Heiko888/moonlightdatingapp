'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Alert,
  Grid,
  Chip,
  Divider,
  IconButton,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Edit as EditIcon,
  PictureAsPdf as PdfIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';

interface Reading {
  id: string;
  reading_type: string;
  client_name: string;
  reading_data: any;
  created_at: string;
  updated_at?: string;
}

export default function ReadingDetail() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [reading, setReading] = useState<Reading | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchReading();
    }
  }, [id]);

  const fetchReading = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/readings/${id}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Fehler beim Laden des Readings');
      }

      setReading(data.reading);
    } catch (err: any) {
      console.error('Fehler beim Laden:', err);
      setError(err.message || 'Fehler beim Laden des Readings');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Möchtest du dieses Reading wirklich löschen?')) {
      return;
    }

    try {
      const response = await fetch(`/api/readings/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Fehler beim Löschen');
      }

      router.push('/coach/readings');
    } catch (err: any) {
      console.error('Fehler beim Löschen:', err);
      setError(err.message || 'Fehler beim Löschen des Readings');
    }
  };

  const handleExportPDF = () => {
    // TODO: PDF-Export Implementierung
    alert('PDF-Export wird in Kürze verfügbar sein');
  };

  const getReadingTypeLabel = (type: string) => {
    switch (type) {
      case 'human-design':
        return 'Human Design';
      case 'connectionKey':
        return 'Connection Key';
      default:
        return type;
    }
  };

  const getReadingTypeColor = (type: string) => {
    switch (type) {
      case 'human-design':
        return '#e8b86d';
      case 'connectionKey':
        return '#4fc3f7';
      default:
        return '#90caf9';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          background: '#000000',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress
            size={70}
            thickness={4}
            sx={{
              color: '#e8b86d',
              mb: 3,
            }}
          />
          <Typography variant="h6" sx={{ color: '#e8b86d' }}>
            Lade Reading...
          </Typography>
        </Box>
      </Box>
    );
  }

  if (error || !reading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          background: '#000000',
          pt: 4,
        }}
      >
        <Container maxWidth="lg">
          <Button
            startIcon={<BackIcon />}
            onClick={() => router.push('/coach/readings')}
            sx={{
              color: '#e8b86d',
              mb: 4,
            }}
          >
            Zurück zu Readings
          </Button>
          <Alert severity="error">{error || 'Reading nicht gefunden'}</Alert>
        </Container>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: '#000000',
        pt: 4,
        pb: 8,
      }}
    >
      <Container maxWidth="lg">
        {/* Logo */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box sx={{ position: 'relative', width: '100%', maxWidth: 500, height: 240, mx: 'auto' }}>
            <Image
              src="/images/connection-key-logo.png"
              alt="The Connection Key"
              fill
              style={{ objectFit: 'contain' }}
              priority
              sizes="(max-width: 768px) 100vw, 500px"
            />
          </Box>
        </Box>

        {/* Navigation */}
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button
            startIcon={<BackIcon />}
            onClick={() => router.push('/coach/readings')}
            sx={{
              color: '#e8b86d',
              '&:hover': {
                background: 'rgba(232, 184, 109, 0.1)',
              },
            }}
          >
            Zurück zu Readings
          </Button>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              startIcon={<EditIcon />}
              onClick={() => router.push(`/coach/readings/create?id=${reading.id}`)}
              variant="outlined"
              sx={{
                borderColor: '#4fc3f7',
                color: '#4fc3f7',
                '&:hover': {
                  borderColor: '#4fc3f7',
                  background: 'rgba(79, 195, 247, 0.1)',
                },
              }}
            >
              Bearbeiten
            </Button>
            <Button
              startIcon={<PdfIcon />}
              onClick={handleExportPDF}
              variant="outlined"
              sx={{
                borderColor: '#e8b86d',
                color: '#e8b86d',
                '&:hover': {
                  borderColor: '#e8b86d',
                  background: 'rgba(232, 184, 109, 0.1)',
                },
              }}
            >
              Als PDF
            </Button>
            <Button
              startIcon={<DeleteIcon />}
              onClick={handleDelete}
              variant="outlined"
              sx={{
                borderColor: '#f44336',
                color: '#f44336',
                '&:hover': {
                  borderColor: '#f44336',
                  background: 'rgba(244, 67, 54, 0.1)',
                },
              }}
            >
              Löschen
            </Button>
          </Box>
        </Box>

        {/* Header Card */}
        <Card
          sx={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            mb: 3,
          }}
        >
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Box>
                <Chip
                  label={getReadingTypeLabel(reading.reading_type)}
                  size="small"
                  sx={{
                    mb: 2,
                    background: getReadingTypeColor(reading.reading_type),
                    color: '#000',
                    fontWeight: 600,
                  }}
                />
                <Typography variant="h4" sx={{ color: '#fff', fontWeight: 700, mb: 1 }}>
                  {reading.client_name || 'Unbenannt'}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                  Erstellt: {formatDate(reading.created_at)}
                </Typography>
                {reading.updated_at && reading.updated_at !== reading.created_at && (
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                    Aktualisiert: {formatDate(reading.updated_at)}
                  </Typography>
                )}
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Reading Daten */}
        <Card
          sx={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <CardContent>
            <Typography variant="h5" sx={{ color: '#e8b86d', fontWeight: 600, mb: 3 }}>
              Reading-Daten
            </Typography>

            <Grid container spacing={3}>
              {/* Geburtsdaten */}
              {(reading.reading_data?.geburtsdatum || reading.reading_data?.geburtszeit || reading.reading_data?.geburtsort) && (
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600, mb: 2 }}>
                    Geburtsdaten
                  </Typography>
                  <Grid container spacing={2}>
                    {reading.reading_data.geburtsdatum && (
                      <Grid item xs={12} sm={4}>
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)', mb: 0.5 }}>
                          Geburtsdatum
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#fff' }}>
                          {reading.reading_data.geburtsdatum}
                        </Typography>
                      </Grid>
                    )}
                    {reading.reading_data.geburtszeit && (
                      <Grid item xs={12} sm={4}>
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)', mb: 0.5 }}>
                          Geburtszeit
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#fff' }}>
                          {reading.reading_data.geburtszeit}
                        </Typography>
                      </Grid>
                    )}
                    {reading.reading_data.geburtsort && (
                      <Grid item xs={12} sm={4}>
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)', mb: 0.5 }}>
                          Geburtsort
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#fff' }}>
                          {reading.reading_data.geburtsort}
                        </Typography>
                      </Grid>
                    )}
                  </Grid>
                  <Divider sx={{ my: 3, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
                </Grid>
              )}

              {/* Human Design Daten */}
              {reading.reading_data?.typ && (
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600, mb: 2 }}>
                    Human Design Chart
                  </Typography>
                  <Grid container spacing={2}>
                    {reading.reading_data.typ && (
                      <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)', mb: 0.5 }}>
                          Typ
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#fff', fontWeight: 600 }}>
                          {reading.reading_data.typ}
                        </Typography>
                      </Grid>
                    )}
                    {reading.reading_data.profil && (
                      <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)', mb: 0.5 }}>
                          Profil
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#fff', fontWeight: 600 }}>
                          {reading.reading_data.profil}
                        </Typography>
                      </Grid>
                    )}
                    {reading.reading_data.autorität && (
                      <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)', mb: 0.5 }}>
                          Autorität
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#fff', fontWeight: 600 }}>
                          {reading.reading_data.autorität}
                        </Typography>
                      </Grid>
                    )}
                    {reading.reading_data.strategie && (
                      <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)', mb: 0.5 }}>
                          Strategie
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#fff', fontWeight: 600 }}>
                          {reading.reading_data.strategie}
                        </Typography>
                      </Grid>
                    )}
                  </Grid>
                  <Divider sx={{ my: 3, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
                </Grid>
              )}

              {/* Reading Text */}
              {reading.reading_data?.readingText && (
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600, mb: 2 }}>
                    Reading
                  </Typography>
                  <Box
                    sx={{
                      background: 'rgba(255, 255, 255, 0.03)',
                      borderRadius: 2,
                      p: 3,
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{
                        color: 'rgba(255, 255, 255, 0.9)',
                        whiteSpace: 'pre-wrap',
                        lineHeight: 1.8,
                      }}
                    >
                      {reading.reading_data.readingText}
                    </Typography>
                  </Box>
                </Grid>
              )}

              {/* Alle anderen Daten */}
              {Object.keys(reading.reading_data || {}).length > 0 && (
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600, mb: 2 }}>
                    Weitere Informationen
                  </Typography>
                  <Box
                    sx={{
                      background: 'rgba(255, 255, 255, 0.03)',
                      borderRadius: 2,
                      p: 3,
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                    }}
                  >
                    <pre
                      style={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '0.875rem',
                        overflow: 'auto',
                        margin: 0,
                        fontFamily: 'monospace',
                      }}
                    >
                      {JSON.stringify(reading.reading_data, null, 2)}
                    </pre>
                  </Box>
                </Grid>
              )}
            </Grid>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
