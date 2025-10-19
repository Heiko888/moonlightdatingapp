'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Alert,
  CircularProgress,
  Grid,
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
  const id = params.id as string;

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

  const renderDataField = (label: string, value: any) => {
    if (!value) return null;

    return (
      <Box sx={{ mb: 2 }}>
        <Typography
          variant="caption"
          sx={{
            color: 'rgba(255, 255, 255, 0.5)',
            textTransform: 'uppercase',
            fontWeight: 600,
            letterSpacing: 1,
          }}
        >
          {label}
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: '#fff',
            mt: 0.5,
          }}
        >
          {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
        </Typography>
      </Box>
    );
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          background: '#000000',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress sx={{ color: '#e8b86d' }} />
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
        <Container maxWidth="md">
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Image
              src="/images/connection-key-logo.png"
              alt="The Connection Key"
              width={300}
              height={150}
              style={{ maxWidth: '100%', height: 'auto' }}
            />
          </Box>

          <Alert severity="error" sx={{ mb: 3 }}>
            {error || 'Reading nicht gefunden'}
          </Alert>

          <Button
            variant="outlined"
            startIcon={<BackIcon />}
            onClick={() => router.push('/coach/readings')}
            sx={{
              borderColor: '#e8b86d',
              color: '#e8b86d',
              '&:hover': {
                borderColor: '#ffd89b',
                background: 'rgba(232, 184, 109, 0.1)',
              },
            }}
          >
            Zurück zur Übersicht
          </Button>
        </Container>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: '#000000',
        position: 'relative',
        pt: 4,
        pb: 8,
      }}
    >
      {/* Logo */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Image
          src="/images/connection-key-logo.png"
          alt="The Connection Key"
          width={300}
          height={150}
          style={{ maxWidth: '100%', height: 'auto' }}
        />
      </Box>

      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Button
            startIcon={<BackIcon />}
            onClick={() => router.push('/coach/readings')}
            sx={{
              color: 'rgba(255, 255, 255, 0.7)',
              mb: 3,
              '&:hover': {
                color: '#e8b86d',
                background: 'rgba(232, 184, 109, 0.1)',
              },
            }}
          >
            Zurück zur Übersicht
          </Button>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Chip
              label={getReadingTypeLabel(reading.reading_type)}
              sx={{
                background: getReadingTypeColor(reading.reading_type),
                color: '#000',
                fontWeight: 600,
              }}
            />
            <Typography
              variant="caption"
              sx={{
                color: 'rgba(255, 255, 255, 0.5)',
              }}
            >
              Erstellt: {formatDate(reading.created_at)}
            </Typography>
          </Box>

          <Typography
            variant="h3"
            sx={{
              color: '#ffffff',
              fontWeight: 700,
              mb: 3,
            }}
          >
            {reading.client_name || 'Unbenannt'}
          </Typography>

          {/* Aktionen */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={() => router.push(`/coach/readings/create?id=${reading.id}`)}
              sx={{
                background: 'linear-gradient(135deg, #e8b86d 0%, #ffd89b 100%)',
                color: '#000',
                fontWeight: 600,
                '&:hover': {
                  background: 'linear-gradient(135deg, #ffd89b 0%, #e8b86d 100%)',
                },
              }}
            >
              Bearbeiten
            </Button>
          </Box>
        </Box>

        {/* Daten */}
        <Grid container spacing={3}>
          {/* Persönliche Daten */}
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                height: '100%',
              }}
            >
              <CardContent>
                <Typography
                  variant="h6"
                  sx={{
                    color: '#e8b86d',
                    fontWeight: 600,
                    mb: 3,
                  }}
                >
                  📋 Persönliche Daten
                </Typography>

                {renderDataField('Name', reading.reading_data.name)}
                {renderDataField('Geschlecht', reading.reading_data.geschlecht)}
                {renderDataField('Geburtsdatum', reading.reading_data.geburtsdatum)}
                {renderDataField('Geburtszeit', reading.reading_data.geburtszeit)}
                {renderDataField('Geburtsort', reading.reading_data.geburtsort)}
              </CardContent>
            </Card>
          </Grid>

          {/* Human Design Daten */}
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                height: '100%',
              }}
            >
              <CardContent>
                <Typography
                  variant="h6"
                  sx={{
                    color: '#e8b86d',
                    fontWeight: 600,
                    mb: 3,
                  }}
                >
                  ✨ Human Design
                </Typography>

                {renderDataField('Typ', reading.reading_data.typ)}
                {renderDataField('Profil', reading.reading_data.profil)}
                {renderDataField('Autorität', reading.reading_data.autoritaet)}
              </CardContent>
            </Card>
          </Grid>

          {/* Zentren */}
          {(reading.reading_data.definiertZentren || reading.reading_data.offenZentren) && (
            <Grid item xs={12}>
              <Card
                sx={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <CardContent>
                  <Typography
                    variant="h6"
                    sx={{
                      color: '#e8b86d',
                      fontWeight: 600,
                      mb: 3,
                    }}
                  >
                    🌟 Zentren
                  </Typography>

                  <Grid container spacing={2}>
                    {reading.reading_data.definiertZentren && (
                      <Grid item xs={12} md={6}>
                        {renderDataField('Definierte Zentren', reading.reading_data.definiertZentren)}
                      </Grid>
                    )}
                    {reading.reading_data.offenZentren && (
                      <Grid item xs={12} md={6}>
                        {renderDataField('Offene Zentren', reading.reading_data.offenZentren)}
                      </Grid>
                    )}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          )}

          {/* Tore */}
          {reading.reading_data.definiertTore && (
            <Grid item xs={12}>
              <Card
                sx={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <CardContent>
                  <Typography
                    variant="h6"
                    sx={{
                      color: '#e8b86d',
                      fontWeight: 600,
                      mb: 3,
                    }}
                  >
                    🚪 Definierte Tore
                  </Typography>

                  {renderDataField('Tore', reading.reading_data.definiertTore)}
                </CardContent>
              </Card>
            </Grid>
          )}

          {/* Vollständige Daten (für Connection Key) */}
          {reading.reading_type === 'connectionKey' && (
            <Grid item xs={12}>
              <Card
                sx={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <CardContent>
                  <Typography
                    variant="h6"
                    sx={{
                      color: '#4fc3f7',
                      fontWeight: 600,
                      mb: 3,
                    }}
                  >
                    🩵 Connection Key Daten
                  </Typography>

                  <Box
                    sx={{
                      background: 'rgba(0, 0, 0, 0.3)',
                      p: 2,
                      borderRadius: 1,
                      fontFamily: 'monospace',
                      fontSize: '0.875rem',
                      color: '#fff',
                      overflow: 'auto',
                      maxHeight: '400px',
                    }}
                  >
                    <pre>{JSON.stringify(reading.reading_data, null, 2)}</pre>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      </Container>
    </Box>
  );
}

