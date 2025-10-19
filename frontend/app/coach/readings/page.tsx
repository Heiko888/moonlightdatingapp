'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Chip,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  InputAdornment,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  PictureAsPdf as PdfIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface Reading {
  id: string;
  reading_type: string;
  client_name: string;
  reading_data: any;
  created_at: string;
  updated_at?: string;
}

export default function ReadingsOverview() {
  const router = useRouter();
  const [readings, setReadings] = useState<Reading[]>([]);
  const [filteredReadings, setFilteredReadings] = useState<Reading[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id: string | null }>({
    open: false,
    id: null,
  });

  // Readings laden
  useEffect(() => {
    fetchReadings();
  }, []);

  // Filter anwenden
  useEffect(() => {
    let filtered = [...readings];

    // Suche
    if (searchQuery) {
      filtered = filtered.filter((reading) =>
        reading.client_name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Typ-Filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter((reading) => reading.reading_type === typeFilter);
    }

    setFilteredReadings(filtered);
  }, [searchQuery, typeFilter, readings]);

  const fetchReadings = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/readings');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Fehler beim Laden der Readings');
      }

      setReadings(data.readings || []);
      setFilteredReadings(data.readings || []);
    } catch (err: any) {
      console.error('Fehler beim Laden:', err);
      setError(err.message || 'Fehler beim Laden der Readings');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/readings/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Fehler beim Löschen');
      }

      // Erfolgreich gelöscht - Liste aktualisieren
      setReadings((prev) => prev.filter((r) => r.id !== id));
      setDeleteDialog({ open: false, id: null });
    } catch (err: any) {
      console.error('Fehler beim Löschen:', err);
      setError(err.message || 'Fehler beim Löschen des Readings');
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
        return '#e8b86d'; // Gold
      case 'connectionKey':
        return '#4fc3f7'; // Hellblau
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
      <Container maxWidth="xl">
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

        {/* Header */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography
            variant="h3"
            sx={{
              color: '#ffffff',
              fontWeight: 700,
              mb: 1,
            }}
          >
            Deine Readings
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: 'rgba(255, 255, 255, 0.7)',
              mb: 3,
            }}
          >
            Verwalte und exportiere deine Human Design Readings
          </Typography>

          <Button
            variant="contained"
            size="large"
            startIcon={<AddIcon />}
            onClick={() => router.push('/coach/readings/create')}
            sx={{
              background: 'linear-gradient(135deg, #e8b86d 0%, #ffd89b 100%)',
              color: '#000',
              fontWeight: 600,
              px: 4,
              py: 1.5,
              '&:hover': {
                background: 'linear-gradient(135deg, #ffd89b 0%, #e8b86d 100%)',
              },
            }}
          >
            Neues Reading erstellen
          </Button>
        </Box>

        {/* Filter & Suche */}
        <Card
          sx={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            mb: 3,
          }}
        >
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  placeholder="Nach Name suchen..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: 'rgba(255, 255, 255, 0.5)' }} />
                      </InputAdornment>
                    ),
                    sx: {
                      color: '#fff',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255, 255, 255, 0.2)',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#e8b86d',
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Typ filtern</InputLabel>
                  <Select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    label="Typ filtern"
                    sx={{
                      color: '#fff',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255, 255, 255, 0.2)',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#e8b86d',
                      },
                      '& .MuiSvgIcon-root': {
                        color: '#fff',
                      },
                    }}
                  >
                    <MenuItem value="all">Alle Typen</MenuItem>
                    <MenuItem value="human-design">Human Design</MenuItem>
                    <MenuItem value="connectionKey">Connection Key</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2}>
                <Typography
                  variant="body2"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    textAlign: 'center',
                  }}
                >
                  {filteredReadings.length} von {readings.length}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Loading */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress sx={{ color: '#e8b86d' }} />
          </Box>
        )}

        {/* Readings Liste */}
        {!loading && filteredReadings.length === 0 && (
          <Card
            sx={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              textAlign: 'center',
              py: 8,
            }}
          >
            <CardContent>
              <Typography variant="h6" sx={{ color: '#fff', mb: 2 }}>
                {searchQuery || typeFilter !== 'all'
                  ? 'Keine Readings gefunden'
                  : 'Noch keine Readings erstellt'}
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)', mb: 3 }}>
                {searchQuery || typeFilter !== 'all'
                  ? 'Versuche andere Suchkriterien'
                  : 'Erstelle dein erstes Reading'}
              </Typography>
              {!searchQuery && typeFilter === 'all' && (
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={() => router.push('/coach/readings/create')}
                  sx={{
                    borderColor: '#e8b86d',
                    color: '#e8b86d',
                    '&:hover': {
                      borderColor: '#ffd89b',
                      background: 'rgba(232, 184, 109, 0.1)',
                    },
                  }}
                >
                  Neues Reading erstellen
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {!loading && filteredReadings.length > 0 && (
          <Grid container spacing={3}>
            {filteredReadings.map((reading) => (
              <Grid item xs={12} md={6} lg={4} key={reading.id}>
                <Card
                  sx={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 24px rgba(232, 184, 109, 0.3)',
                      borderColor: 'rgba(232, 184, 109, 0.5)',
                    },
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    {/* Typ Badge */}
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

                    {/* Name */}
                    <Typography
                      variant="h6"
                      sx={{
                        color: '#fff',
                        fontWeight: 600,
                        mb: 1,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {reading.client_name || 'Unbenannt'}
                    </Typography>

                    {/* Datum */}
                    <Typography
                      variant="caption"
                      sx={{
                        color: 'rgba(255, 255, 255, 0.5)',
                        display: 'block',
                        mb: 2,
                      }}
                    >
                      Erstellt: {formatDate(reading.created_at)}
                    </Typography>

                    {/* Daten-Preview */}
                    {reading.reading_data && (
                      <Box sx={{ mb: 2 }}>
                        {reading.reading_data.geburtsdatum && (
                          <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                            📅 {reading.reading_data.geburtsdatum}
                          </Typography>
                        )}
                        {reading.reading_data.geburtsort && (
                          <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)', ml: 2 }}>
                            📍 {reading.reading_data.geburtsort}
                          </Typography>
                        )}
                      </Box>
                    )}

                    {/* Aktionen */}
                    <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                      <IconButton
                        size="small"
                        onClick={() => router.push(`/coach/readings/${reading.id}`)}
                        sx={{
                          color: '#e8b86d',
                          border: '1px solid rgba(232, 184, 109, 0.3)',
                          '&:hover': {
                            background: 'rgba(232, 184, 109, 0.1)',
                            borderColor: '#e8b86d',
                          },
                        }}
                        title="Anzeigen"
                      >
                        <ViewIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => router.push(`/coach/readings/create?id=${reading.id}`)}
                        sx={{
                          color: '#4fc3f7',
                          border: '1px solid rgba(79, 195, 247, 0.3)',
                          '&:hover': {
                            background: 'rgba(79, 195, 247, 0.1)',
                            borderColor: '#4fc3f7',
                          },
                        }}
                        title="Bearbeiten"
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        sx={{
                          color: '#f44336',
                          border: '1px solid rgba(244, 67, 54, 0.3)',
                          '&:hover': {
                            background: 'rgba(244, 67, 54, 0.1)',
                            borderColor: '#f44336',
                          },
                        }}
                        onClick={() => setDeleteDialog({ open: true, id: reading.id })}
                        title="Löschen"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      {/* Delete Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, id: null })}
        PaperProps={{
          sx: {
            background: 'rgba(30, 30, 30, 0.98)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          },
        }}
      >
        <DialogTitle sx={{ color: '#fff' }}>Reading löschen?</DialogTitle>
        <DialogContent>
          <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            Möchtest du dieses Reading wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, id: null })} sx={{ color: '#fff' }}>
            Abbrechen
          </Button>
          <Button
            onClick={() => deleteDialog.id && handleDelete(deleteDialog.id)}
            sx={{
              color: '#f44336',
              '&:hover': {
                background: 'rgba(244, 67, 54, 0.1)',
              },
            }}
          >
            Löschen
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

