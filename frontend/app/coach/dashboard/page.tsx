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
    switch (status) {
      case 'pending': return '#eab308';
      case 'zoom-scheduled': return '#3b82f6';
      case 'completed': return '#8b5cf6';
      case 'approved': return '#10b981';
      default: return '#6b7280';
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
      background: '#000000',
      py: 4
    }}>
      <Container maxWidth="xl">
        {/* Logo */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box sx={{ position: 'relative', width: '100%', maxWidth: 600, height: 280, mx: 'auto' }}>
            <Image
              src="/images/connection-key-logo.png"
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
              background: 'rgba(232, 184, 109, 0.1)', 
              border: '1px solid rgba(232, 184, 109, 0.3)',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 24px rgba(232, 184, 109, 0.3)',
              }
            }}>
              <CardContent>
                <Typography variant="h4" sx={{ color: '#e8b86d', fontWeight: 700 }}>
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
              background: 'rgba(234, 179, 8, 0.1)', 
              border: '1px solid rgba(234, 179, 8, 0.3)',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 24px rgba(234, 179, 8, 0.3)',
              }
            }}>
              <CardContent>
                <Typography variant="h4" sx={{ color: '#eab308', fontWeight: 700 }}>
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
              background: 'rgba(59, 130, 246, 0.1)', 
              border: '1px solid rgba(59, 130, 246, 0.3)',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 24px rgba(59, 130, 246, 0.3)',
              }
            }}>
              <CardContent>
                <Typography variant="h4" sx={{ color: '#3b82f6', fontWeight: 700 }}>
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
              background: 'rgba(139, 92, 246, 0.1)', 
              border: '1px solid rgba(139, 92, 246, 0.3)',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 24px rgba(139, 92, 246, 0.3)',
              }
            }}>
              <CardContent>
                <Typography variant="h4" sx={{ color: '#8b5cf6', fontWeight: 700 }}>
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
              background: 'rgba(16, 185, 129, 0.1)', 
              border: '1px solid rgba(16, 185, 129, 0.3)',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 24px rgba(16, 185, 129, 0.3)',
              }
            }}>
              <CardContent>
                <Typography variant="h4" sx={{ color: '#10b981', fontWeight: 700 }}>
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
          border: '1px solid rgba(232, 184, 109, 0.2)',
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
                    color: '#e8b86d'
                  }
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: '#e8b86d'
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
                color: '#e8b86d',
                borderColor: '#e8b86d',
                '&:hover': {
                  background: 'rgba(232, 184, 109, 0.1)',
                  borderColor: '#ffd89b'
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
            border: '1px solid rgba(232, 184, 109, 0.2)'
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: '#e8b86d', fontWeight: 700 }}>Status</TableCell>
                <TableCell sx={{ color: '#e8b86d', fontWeight: 700 }}>Titel</TableCell>
                <TableCell sx={{ color: '#e8b86d', fontWeight: 700 }}>Kunde</TableCell>
                <TableCell sx={{ color: '#e8b86d', fontWeight: 700 }}>Kategorie</TableCell>
                <TableCell sx={{ color: '#e8b86d', fontWeight: 700 }}>Erstellt</TableCell>
                <TableCell sx={{ color: '#e8b86d', fontWeight: 700 }}>Aktionen</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} sx={{ textAlign: 'center', color: 'white' }}>
                    Lade Daten...
                  </TableCell>
                </TableRow>
              ) : readings.length === 0 ? (
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
                        sx={{ color: '#3b82f6', mr: 1 }}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(reading.id)}
                        sx={{ color: '#ef4444' }}
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

