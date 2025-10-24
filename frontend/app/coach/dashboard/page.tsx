"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  MenuItem,
  IconButton,
  Tabs,
  Tab
} from '@mui/material';
import {
  Edit,
  Delete,
  VideoCall,
  CheckCircle,
  Schedule,
  Pending,
  Email,
  Download,
  Refresh
} from '@mui/icons-material';
import CircularProgress from '@mui/material/CircularProgress';

interface Reading {
  id: string;
  userId: string;
  title: string;
  question: string;
  category: string;
  birthdate: string;
  birthtime: string;
  birthplace: string;
  email: string;
  phone: string;
  status: string;
  zoomLink?: string;
  zoomDate?: string;
  coachNotes?: string;
  createdAt: string;
  updatedAt: string;
}

interface Stats {
  total: number;
  pending: number;
  zoomScheduled: number;
  completed: number;
  approved: number;
}

const CoachDashboard: React.FC = () => {
  const router = useRouter();
  const [readings, setReadings] = useState<Reading[]>([]);
  const [stats, setStats] = useState<Stats>({
    total: 0,
    pending: 0,
    zoomScheduled: 0,
    completed: 0,
    approved: 0
  });
  const [loading, setLoading] = useState(false);
  const [selectedReading, setSelectedReading] = useState<Reading | null>(null);
  const [editDialog, setEditDialog] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  
  // Edit form state
  const [editStatus, setEditStatus] = useState('');
  const [editZoomLink, setEditZoomLink] = useState('');
  const [editZoomDate, setEditZoomDate] = useState('');
  const [editCoachNotes, setEditCoachNotes] = useState('');

  // Lade Readings vom Backend
  const loadReadings = async () => {
    setLoading(true);
    try {
      const statusFilter = ['all', 'pending', 'zoom-scheduled', 'completed', 'approved'][activeTab];
      const url = statusFilter === 'all' 
        ? '/api/coach/readings'
        : `/api/coach/readings?status=${statusFilter}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (response.ok) {
        setReadings(data.readings || []);
        setStats(data.stats || stats);
      }
    } catch (error) {
      console.error('Fehler beim Laden der Readings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReadings();
  }, [activeTab]);

  const handleEditClick = (reading: Reading) => {
    setSelectedReading(reading);
    setEditStatus(reading.status);
    setEditZoomLink(reading.zoomLink || '');
    setEditZoomDate(reading.zoomDate || '');
    setEditCoachNotes(reading.coachNotes || '');
    setEditDialog(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedReading) return;

    try {
      const response = await fetch(`/api/readings/${selectedReading.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: editStatus,
          zoomLink: editZoomLink,
          zoomDate: editZoomDate,
          coachNotes: editCoachNotes
        })
      });

      if (response.ok) {
        alert('Reading erfolgreich aktualisiert! E-Mail wurde an den Kunden gesendet.');
        setEditDialog(false);
        loadReadings();
      } else {
        alert('Fehler beim Aktualisieren des Readings');
      }
    } catch (error) {
      console.error('Fehler beim Speichern:', error);
      alert('Fehler beim Speichern');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Möchtest du dieses Reading wirklich löschen?')) return;

    try {
      const response = await fetch(`/api/readings/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        alert('Reading erfolgreich gelöscht');
        loadReadings();
      } else {
        alert('Fehler beim Löschen');
      }
    } catch (error) {
      console.error('Fehler beim Löschen:', error);
      alert('Fehler beim Löschen');
    }
  };

  const getStatusColor = (status: string) => {
    // Harmonisiert auf die Markenpalette
    switch (status) {
      case 'pending': return '#F29F05';
      case 'zoom-scheduled': return '#8C1D04';
      case 'completed': return '#590A03';
      case 'approved': return '#F29F05';
      default: return '#260A0A';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return '⏳ Warte auf Termin';
      case 'zoom-scheduled': return '📅 Termin vereinbart';
      case 'completed': return '✅ Zoom abgeschlossen';
      case 'approved': return '🎉 Freigegeben';
      default: return status;
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0F1220 0%, #1A0E08 100%)',
      py: 4,
      position: 'relative',
      '&::before': {
        content: '""',
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        background: 'radial-gradient(90% 70% at 50% 28%, rgba(242, 159, 5, 0.36), transparent 78%), radial-gradient(60% 50% at 82% 82%, rgba(140, 29, 4, 0.24), transparent 78%)'
      }
    }}>
      {/* Loading Overlay */}
      {loading && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0, 0, 0, 0.9)',
            backdropFilter: 'blur(5px)',
            zIndex: 9999
          }}
        >
          <Box sx={{ textAlign: 'center' }}>
            <CircularProgress
              size={80}
              thickness={4}
              sx={{
                color: '#F29F05',
                mb: 3,
                '& .MuiCircularProgress-circle': {
                  strokeLinecap: 'round',
                }
              }}
            />
            <Typography variant="h6" sx={{ color: '#F29F05', fontWeight: 600 }}>
              Lade Daten...
            </Typography>
          </Box>
        </Box>
      )}

      <Container maxWidth="xl">
        {/* Logo */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box sx={{ position: 'relative', width: '100%', maxWidth: 600, height: 280, mx: 'auto' }}>
            <Image
              src="/images/Design%20ohne%20Titel%2815%29.png"
              alt="The Connection Key"
              fill
              style={{ objectFit: 'contain' }}
              priority
              sizes="(max-width: 768px) 100vw, 600px"
            />
          </Box>
        </Box>

        {/* Statistik Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={2.4}>
            <Card sx={{ 
              bgcolor: 'background.paper',
              border: '1px solid rgba(242, 159, 5, 0.15)',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 20px 40px rgba(242, 159, 5, 0.25)',
              }
            }}>
              <CardContent>
                <Typography variant="h4" sx={{ color: '#F29F05', fontWeight: 700 }}>
                  {stats.total}
                </Typography>
                <Typography variant="body2" sx={{ color: '#ffffff', fontWeight: 600 }}>
                  Gesamt
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <Card sx={{ 
              bgcolor: 'background.paper',
              border: '1px solid rgba(242, 159, 5, 0.15)',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 20px 40px rgba(242, 159, 5, 0.25)',
              }
            }}>
              <CardContent>
                <Typography variant="h4" sx={{ color: '#F29F05', fontWeight: 700 }}>
                  {stats.pending}
                </Typography>
                <Typography variant="body2" sx={{ color: '#ffffff', fontWeight: 600 }}>
                  Warte auf Termin
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <Card sx={{ 
              background: 'rgba(140, 29, 4, 0.10)', 
              border: '1px solid rgba(140, 29, 4, 0.30)',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 24px rgba(140, 29, 4, 0.30)',
              }
            }}>
              <CardContent>
                <Typography variant="h4" sx={{ color: '#8C1D04', fontWeight: 700 }}>
                  {stats.zoomScheduled}
                </Typography>
                <Typography variant="body2" sx={{ color: '#ffffff', fontWeight: 600 }}>
                  Termin vereinbart
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <Card sx={{ 
              background: 'rgba(89, 10, 3, 0.10)', 
              border: '1px solid rgba(89, 10, 3, 0.30)',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 24px rgba(89, 10, 3, 0.30)',
              }
            }}>
              <CardContent>
                <Typography variant="h4" sx={{ color: '#590A03', fontWeight: 700 }}>
                  {stats.completed}
                </Typography>
                <Typography variant="body2" sx={{ color: '#ffffff', fontWeight: 600 }}>
                  Zoom abgeschlossen
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <Card sx={{ 
              background: 'rgba(242, 159, 5, 0.10)', 
              border: '1px solid rgba(242, 159, 5, 0.30)',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 24px rgba(242, 159, 5, 0.30)',
              }
            }}>
              <CardContent>
                <Typography variant="h4" sx={{ color: '#F29F05', fontWeight: 700 }}>
                  {stats.approved}
                </Typography>
                <Typography variant="body2" sx={{ color: '#ffffff', fontWeight: 600 }}>
                  Freigegeben
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Tabs Filter */}
        <Paper sx={{ 
          background: 'rgba(255,255,255,0.05)', 
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(242, 159, 5, 0.20)',
          mb: 3
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
            <Tabs
              value={activeTab}
              onChange={(e, newValue) => setActiveTab(newValue)}
              sx={{
                '& .MuiTab-root': {
                  color: '#ffffff',
                  fontWeight: 600,
                  '&.Mui-selected': {
                    color: '#F29F05'
                  }
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: '#F29F05'
                }
              }}
            >
              <Tab label="Alle" />
              <Tab label={`Pending (${stats.pending})`} />
              <Tab label={`Geplant (${stats.zoomScheduled})`} />
              <Tab label={`Abgeschlossen (${stats.completed})`} />
              <Tab label={`Freigegeben (${stats.approved})`} />
            </Tabs>
            <Button
              startIcon={<Refresh />}
              onClick={loadReadings}
              sx={{ 
                color: '#F29F05',
                borderColor: '#F29F05',
                '&:hover': {
                  background: 'rgba(242, 159, 5, 0.10)',
                  borderColor: '#8C1D04'
                }
              }}
            >
              Aktualisieren
            </Button>
          </Box>
        </Paper>

        {/* Readings Table */}
        <TableContainer 
          component={Paper} 
          sx={{ 
            background: 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(242, 159, 5, 0.20)'
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: '#F29F05', fontWeight: 700 }}>Status</TableCell>
                <TableCell sx={{ color: '#F29F05', fontWeight: 700 }}>Titel</TableCell>
                <TableCell sx={{ color: '#F29F05', fontWeight: 700 }}>Kunde</TableCell>
                <TableCell sx={{ color: '#F29F05', fontWeight: 700 }}>Kategorie</TableCell>
                <TableCell sx={{ color: '#F29F05', fontWeight: 700 }}>Erstellt</TableCell>
                <TableCell sx={{ color: '#F29F05', fontWeight: 700 }}>Aktionen</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {readings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} sx={{ textAlign: 'center', color: '#ffffff' }}>
                    Keine Readings gefunden
                  </TableCell>
                </TableRow>
              ) : (
                readings.map((reading) => (
                  <TableRow key={reading.id} hover>
                    <TableCell>
                      <Chip
                        label={getStatusLabel(reading.status)}
                        size="small"
                        sx={{
                          background: getStatusColor(reading.status),
                          color: 'white',
                          fontWeight: 600
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ color: '#ffffff', fontWeight: 600 }}>{reading.title}</TableCell>
                    <TableCell sx={{ color: '#ffffff' }}>
                      {reading.email}
                    </TableCell>
                    <TableCell sx={{ color: '#ffffff' }}>
                      {reading.category}
                    </TableCell>
                    <TableCell sx={{ color: '#ffffff' }}>
                      {new Date(reading.createdAt).toLocaleDateString('de-DE')}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => handleEditClick(reading)}
                        sx={{ color: '#F29F05', mr: 1 }}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(reading.id)}
                        sx={{ color: '#8C1D04' }}
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>

      {/* Edit Dialog */}
      <Dialog
        open={editDialog}
        onClose={() => setEditDialog(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            background: 'rgba(0,0,0,0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(232, 184, 109, 0.3)',
            borderRadius: 3
          }
        }}
      >
        <DialogTitle sx={{ color: '#e8b86d', fontWeight: 600 }}>
          Reading bearbeiten
        </DialogTitle>
        <DialogContent>
          {selectedReading && (
            <Box sx={{ pt: 2 }}>
              <Typography variant="subtitle2" sx={{ color: '#ffffff', mb: 3 }}>
                <strong>Kunde:</strong> {selectedReading.email}<br />
                <strong>Geburtsdaten:</strong> {selectedReading.birthdate} um {selectedReading.birthtime} in {selectedReading.birthplace}<br />
                <strong>Frage:</strong> {selectedReading.question}
              </Typography>

              <TextField
                select
                label="Status"
                fullWidth
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value)}
                sx={{ mb: 2, '& .MuiInputLabel-root': { color: '#ffffff' }, '& .MuiOutlinedInput-root': { color: 'white' } }}
              >
                <MenuItem value="pending">⏳ Warte auf Termin</MenuItem>
                <MenuItem value="zoom-scheduled">📅 Termin vereinbart</MenuItem>
                <MenuItem value="completed">✅ Zoom abgeschlossen</MenuItem>
                <MenuItem value="approved">🎉 Freigegeben</MenuItem>
              </TextField>

              <TextField
                label="Zoom-Link"
                fullWidth
                value={editZoomLink}
                onChange={(e) => setEditZoomLink(e.target.value)}
                placeholder="https://zoom.us/j/..."
                sx={{ mb: 2, '& .MuiInputLabel-root': { color: '#ffffff' }, '& .MuiOutlinedInput-root': { color: 'white' } }}
              />

              <TextField
                label="Zoom-Termin"
                fullWidth
                type="datetime-local"
                value={editZoomDate}
                onChange={(e) => setEditZoomDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{ mb: 2, '& .MuiInputLabel-root': { color: '#ffffff' }, '& .MuiOutlinedInput-root': { color: 'white' } }}
              />

              <TextField
                label="Coach-Notizen"
                fullWidth
                multiline
                rows={4}
                value={editCoachNotes}
                onChange={(e) => setEditCoachNotes(e.target.value)}
                placeholder="Interne Notizen zum Reading..."
                sx={{ mb: 2, '& .MuiInputLabel-root': { color: '#ffffff' }, '& .MuiOutlinedInput-root': { color: 'white' } }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setEditDialog(false)} sx={{ color: '#ffffff' }}>
            Abbrechen
          </Button>
          <Button
            onClick={handleSaveEdit}
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #e8b86d 0%, #ffd89b 100%)',
              color: '#000',
              fontWeight: 600,
              '&:hover': {
                background: 'linear-gradient(135deg, #ffd89b 0%, #e8b86d 100%)',
              }
            }}
          >
            Speichern & E-Mail senden
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CoachDashboard;

