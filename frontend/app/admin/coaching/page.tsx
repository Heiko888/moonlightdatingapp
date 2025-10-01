"use client";
import React, { useState, useEffect } from "react";
import { Box, Typography, Button, Paper, Alert, TextField, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { motion } from "framer-motion";
import AppHeader from '../../../components/AppHeader';
import { Plus, Edit, Trash2, User, Calendar, Star, Users } from "lucide-react";
import axios from 'axios';

interface CoachProfile {
  id: string;
  name: string;
  email: string;
  specialization: string[];
  experience: number;
  rating: number;
  hourlyRate: number;
  availability: string[];
  bio: string;
  imageUrl?: string;
  isActive: boolean;
}

interface CoachingSession {
  id: string;
  coachId: string;
  clientName: string;
  date: string;
  duration: number;
  topic: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
}

export default function AdminCoachingPage() {
  const [coaches, setCoaches] = useState<CoachProfile[]>([]);
  const [sessions, setSessions] = useState<CoachingSession[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [openCoachDialog, setOpenCoachDialog] = useState(false);
  const [openSessionDialog, setOpenSessionDialog] = useState(false);
  const [editingCoach, setEditingCoach] = useState<CoachProfile | null>(null);
  const [editingSession, setEditingSession] = useState<CoachingSession | null>(null);
  const [activeTab, setActiveTab] = useState<'coaches' | 'sessions'>('coaches');

  // Formular-States für Coach
  const [coachForm, setCoachForm] = useState({
    name: '',
    email: '',
    specialization: '',
    experience: 0,
    rating: 5,
    hourlyRate: 0,
    availability: '',
    bio: '',
    imageUrl: ''
  });

  // Formular-States für Session
  const [sessionForm, setSessionForm] = useState({
    coachId: '',
    clientName: '',
    date: '',
    duration: 60,
    topic: '',
    status: 'scheduled' as 'scheduled' | 'completed' | 'cancelled',
    notes: ''
  });

  useEffect(() => {
    fetchCoaches();
    fetchSessions();
  }, []);

  const fetchCoaches = async () => {
    try {
      const response = await axios.get('http://localhost:4001/admin/coaching/coaches');
      setCoaches(response.data.coaches || []);
    } catch (error) {
      console.error('Fehler beim Laden der Coaches:', error);
    }
  };

  const fetchSessions = async () => {
    try {
      const response = await axios.get('http://localhost:4001/admin/coaching/sessions');
      setSessions(response.data.sessions || []);
    } catch (error) {
      console.error('Fehler beim Laden der Sessions:', error);
    }
  };

  const handleCoachSubmit = async () => {
    setLoading(true);
    try {
      const coachData = {
        ...coachForm,
        specialization: coachForm.specialization.split(',').map(s => s.trim()),
        availability: coachForm.availability.split(',').map(s => s.trim()),
        isActive: true
      };

      if (editingCoach) {
        await axios.put(`http://localhost:4001/admin/coaching/coaches/${editingCoach.id}`, coachData);
        setMessage("Coach erfolgreich aktualisiert!");
      } else {
        await axios.post('http://localhost:4001/admin/coaching/coaches', coachData);
        setMessage("Coach erfolgreich erstellt!");
      }

      setOpenCoachDialog(false);
      resetCoachForm();
      fetchCoaches();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unbekannter Fehler';
      setMessage("Fehler: " + errorMessage);
    }
    setLoading(false);
  };

  const handleSessionSubmit = async () => {
    setLoading(true);
    try {
      if (editingSession) {
        await axios.put(`http://localhost:4001/admin/coaching/sessions/${editingSession.id}`, sessionForm);
        setMessage("Session erfolgreich aktualisiert!");
      } else {
        await axios.post('http://localhost:4001/admin/coaching/sessions', sessionForm);
        setMessage("Session erfolgreich erstellt!");
      }

      setOpenSessionDialog(false);
      resetSessionForm();
      fetchSessions();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unbekannter Fehler';
      setMessage("Fehler: " + errorMessage);
    }
    setLoading(false);
  };

  const deleteCoach = async (id: string) => {
    if (window.confirm('Coach wirklich löschen?')) {
      try {
        await axios.delete(`http://localhost:4001/admin/coaching/coaches/${id}`);
        setMessage("Coach erfolgreich gelöscht!");
        fetchCoaches();
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unbekannter Fehler';
        setMessage("Fehler beim Löschen: " + errorMessage);
      }
    }
  };

  const deleteSession = async (id: string) => {
    if (window.confirm('Session wirklich löschen?')) {
      try {
        await axios.delete(`http://localhost:4001/admin/coaching/sessions/${id}`);
        setMessage("Session erfolgreich gelöscht!");
        fetchSessions();
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unbekannter Fehler';
        setMessage("Fehler beim Löschen: " + errorMessage);
      }
    }
  };

  const editCoach = (coach: CoachProfile) => {
    setEditingCoach(coach);
    setCoachForm({
      name: coach.name,
      email: coach.email,
      specialization: coach.specialization.join(', '),
      experience: coach.experience,
      rating: coach.rating,
      hourlyRate: coach.hourlyRate,
      availability: coach.availability.join(', '),
      bio: coach.bio,
      imageUrl: coach.imageUrl || ''
    });
    setOpenCoachDialog(true);
  };

  const editSession = (session: CoachingSession) => {
    setEditingSession(session);
    setSessionForm({
      coachId: session.coachId,
      clientName: session.clientName,
      date: session.date,
      duration: session.duration,
      topic: session.topic,
      status: session.status,
      notes: session.notes || ''
    });
    setOpenSessionDialog(true);
  };

  const resetCoachForm = () => {
    setCoachForm({
      name: '',
      email: '',
      specialization: '',
      experience: 0,
      rating: 5,
      hourlyRate: 0,
      availability: '',
      bio: '',
      imageUrl: ''
    });
    setEditingCoach(null);
  };

  const resetSessionForm = () => {
    setSessionForm({
      coachId: '',
      clientName: '',
      date: '',
      duration: 60,
      topic: '',
      status: 'scheduled',
      notes: ''
    });
    setEditingSession(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'primary';
      case 'completed': return 'success';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'scheduled': return 'Geplant';
      case 'completed': return 'Abgeschlossen';
      case 'cancelled': return 'Storniert';
      default: return status;
    }
  };

  return (
    <>
      <AppHeader current="/admin" />
      <Box sx={{ minHeight: '100vh', background: 'linear-gradient(120deg,#2a174d 0%,#3a2069 100%)', py: 8 }}>
        <motion.div 
          initial={{ opacity: 0, y: 40 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }} 
          style={{ maxWidth: 1200, margin: '0 auto' }}
        >
          <Paper elevation={6} sx={{ 
            p: 4, 
            borderRadius: 4, 
            background: 'rgba(44,24,77,0.85)', 
            color: '#fff', 
            boxShadow:'0 8px 32px #7c3aed', 
            position:'relative'
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
              <Typography variant="h4" sx={{ 
                color: "#fff", 
                fontWeight: 700, 
                textShadow:'0 2px 8px #7c3aed' 
              }}>
                🎯 Coaching-Verwaltung
              </Typography>
              <Button 
                variant="outlined" 
                onClick={() => window.history.back()}
                sx={{ 
                  color: '#b39ddb', 
                  borderColor: '#b39ddb',
                  '&:hover': { borderColor: '#7c3aed', color: '#7c3aed' }
                }}
              >
                Zurück zum Dashboard
              </Button>
            </Box>

            {/* Tab-Navigation */}
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant={activeTab === 'coaches' ? 'contained' : 'outlined'}
                  onClick={() => setActiveTab('coaches')}
                  startIcon={<Users />}
                  sx={{ 
                    color: activeTab === 'coaches' ? '#fff' : '#b39ddb',
                    borderColor: '#b39ddb',
                    '&:hover': { borderColor: '#7c3aed', color: '#7c3aed' }
                  }}
                >
                  Coaches ({coaches.length})
                </Button>
                <Button
                  variant={activeTab === 'sessions' ? 'contained' : 'outlined'}
                  onClick={() => setActiveTab('sessions')}
                  startIcon={<Calendar />}
                  sx={{ 
                    color: activeTab === 'sessions' ? '#fff' : '#b39ddb',
                    borderColor: '#b39ddb',
                    '&:hover': { borderColor: '#7c3aed', color: '#7c3aed' }
                  }}
                >
                  Sessions ({sessions.length})
                </Button>
              </Box>
            </Box>

            {/* Coaches Tab */}
            {activeTab === 'coaches' && (
          <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h5" sx={{ color: '#b39ddb' }}>
                    Coach-Profile verwalten
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<Plus />}
                    onClick={() => {
                      resetCoachForm();
                      setOpenCoachDialog(true);
                    }}
                    sx={{ 
                      background: '#7c3aed',
                      '&:hover': { background: '#6d28d9' }
                    }}
                  >
                    Neuen Coach hinzufügen
                  </Button>
                </Box>

                <TableContainer component={Paper} sx={{ background: 'rgba(179, 157, 219, 0.1)' }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ color: '#b39ddb', fontWeight: 600 }}>Name</TableCell>
                        <TableCell sx={{ color: '#b39ddb', fontWeight: 600 }}>Spezialisierung</TableCell>
                        <TableCell sx={{ color: '#b39ddb', fontWeight: 600 }}>Erfahrung</TableCell>
                        <TableCell sx={{ color: '#b39ddb', fontWeight: 600 }}>Bewertung</TableCell>
                        <TableCell sx={{ color: '#b39ddb', fontWeight: 600 }}>Stundensatz</TableCell>
                        <TableCell sx={{ color: '#b39ddb', fontWeight: 600 }}>Status</TableCell>
                        <TableCell sx={{ color: '#b39ddb', fontWeight: 600 }}>Aktionen</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {coaches.map((coach) => (
                        <TableRow key={coach.id}>
                          <TableCell sx={{ color: '#fff' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <User size={16} style={{ marginRight: 8, color: '#b39ddb' }} />
                              {coach.name}
                            </Box>
                          </TableCell>
                          <TableCell sx={{ color: '#fff' }}>
                            {coach.specialization.map((spec, index) => (
                              <Chip 
                                key={index} 
                                label={spec} 
                                size="small" 
                                sx={{ mr: 0.5, mb: 0.5, background: '#7c3aed' }}
                              />
                            ))}
                          </TableCell>
                          <TableCell sx={{ color: '#fff' }}>{coach.experience} Jahre</TableCell>
                          <TableCell sx={{ color: '#fff' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Star size={16} style={{ color: '#ffd700', marginRight: 4 }} />
                              {coach.rating}/5
            </Box>
                          </TableCell>
                          <TableCell sx={{ color: '#fff' }}>€{coach.hourlyRate}/h</TableCell>
                          <TableCell>
                            <Chip 
                              label={coach.isActive ? 'Aktiv' : 'Inaktiv'} 
                              color={coach.isActive ? 'success' : 'error'}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <IconButton onClick={() => editCoach(coach)} sx={{ color: '#b39ddb' }}>
                              <Edit size={16} />
                            </IconButton>
                            <IconButton onClick={() => deleteCoach(coach.id)} sx={{ color: '#ef4444' }}>
                              <Trash2 size={16} />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
          </Box>
            )}

            {/* Sessions Tab */}
            {activeTab === 'sessions' && (
          <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h5" sx={{ color: '#b39ddb' }}>
                    Coaching-Sessions verwalten
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<Plus />}
                    onClick={() => {
                      resetSessionForm();
                      setOpenSessionDialog(true);
                    }}
                    sx={{ 
                      background: '#7c3aed',
                      '&:hover': { background: '#6d28d9' }
                    }}
                  >
                    Neue Session hinzufügen
                  </Button>
                </Box>

                <TableContainer component={Paper} sx={{ background: 'rgba(179, 157, 219, 0.1)' }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ color: '#b39ddb', fontWeight: 600 }}>Coach</TableCell>
                        <TableCell sx={{ color: '#b39ddb', fontWeight: 600 }}>Kunde</TableCell>
                        <TableCell sx={{ color: '#b39ddb', fontWeight: 600 }}>Datum</TableCell>
                        <TableCell sx={{ color: '#b39ddb', fontWeight: 600 }}>Dauer</TableCell>
                        <TableCell sx={{ color: '#b39ddb', fontWeight: 600 }}>Thema</TableCell>
                        <TableCell sx={{ color: '#b39ddb', fontWeight: 600 }}>Status</TableCell>
                        <TableCell sx={{ color: '#b39ddb', fontWeight: 600 }}>Aktionen</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {sessions.map((session) => (
                        <TableRow key={session.id}>
                          <TableCell sx={{ color: '#fff' }}>
                            {coaches.find(c => c.id === session.coachId)?.name || 'Unbekannt'}
                          </TableCell>
                          <TableCell sx={{ color: '#fff' }}>{session.clientName}</TableCell>
                          <TableCell sx={{ color: '#fff' }}>
                            {new Date(session.date).toLocaleDateString('de-DE')}
                          </TableCell>
                          <TableCell sx={{ color: '#fff' }}>{session.duration} Min.</TableCell>
                          <TableCell sx={{ color: '#fff' }}>{session.topic}</TableCell>
                          <TableCell>
                            <Chip 
                              label={getStatusText(session.status)} 
                              color={getStatusColor(session.status) as any}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <IconButton onClick={() => editSession(session)} sx={{ color: '#b39ddb' }}>
                              <Edit size={16} />
                            </IconButton>
                            <IconButton onClick={() => deleteSession(session.id)} sx={{ color: '#ef4444' }}>
                              <Trash2 size={16} />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}

            {message && (
              <Alert 
                severity={message.includes("erfolgreich") ? "success" : "error"} 
                sx={{ mt: 4, borderRadius: 2 }}
              >
                {message}
              </Alert>
            )}
          </Paper>
        </motion.div>
      </Box>

      {/* Coach Dialog */}
      <Dialog open={openCoachDialog} onClose={() => setOpenCoachDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ background: '#7c3aed', color: '#fff' }}>
          {editingCoach ? 'Coach bearbeiten' : 'Neuen Coach hinzufügen'}
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <TextField
                label="Name"
                value={coachForm.name}
                onChange={(e) => setCoachForm({...coachForm, name: e.target.value})}
                sx={{ flex: 1, minWidth: 200 }}
              />
              <TextField
                label="E-Mail"
                type="email"
                value={coachForm.email}
                onChange={(e) => setCoachForm({...coachForm, email: e.target.value})}
                sx={{ flex: 1, minWidth: 200 }}
              />
            </Box>
            
            <TextField
              label="Spezialisierung (kommagetrennt)"
              value={coachForm.specialization}
              onChange={(e) => setCoachForm({...coachForm, specialization: e.target.value})}
              fullWidth
              helperText="z.B. Human Design, Astrologie, Coaching"
            />
            
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <TextField
                label="Erfahrung (Jahre)"
                type="number"
                value={coachForm.experience}
                onChange={(e) => setCoachForm({...coachForm, experience: parseInt(e.target.value)})}
                sx={{ flex: 1, minWidth: 150 }}
              />
              <TextField
                label="Bewertung (1-5)"
                type="number"
                value={coachForm.rating}
                onChange={(e) => setCoachForm({...coachForm, rating: parseInt(e.target.value)})}
                sx={{ flex: 1, minWidth: 150 }}
                inputProps={{ min: 1, max: 5 }}
              />
              <TextField
                label="Stundensatz (€)"
                type="number"
                value={coachForm.hourlyRate}
                onChange={(e) => setCoachForm({...coachForm, hourlyRate: parseInt(e.target.value)})}
                sx={{ flex: 1, minWidth: 150 }}
              />
            </Box>
            
            <TextField
              label="Verfügbarkeit (kommagetrennt)"
              value={coachForm.availability}
              onChange={(e) => setCoachForm({...coachForm, availability: e.target.value})}
              fullWidth
              helperText="z.B. Montag, Dienstag, Mittwoch"
            />
            
            <TextField
              label="Bild-URL (optional)"
              value={coachForm.imageUrl}
              onChange={(e) => setCoachForm({...coachForm, imageUrl: e.target.value})}
              fullWidth
            />
            
            <TextField
              label="Biografie"
              multiline
              rows={4}
              value={coachForm.bio}
              onChange={(e) => setCoachForm({...coachForm, bio: e.target.value})}
              fullWidth
            />
            </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCoachDialog(false)}>Abbrechen</Button>
          <Button 
            onClick={handleCoachSubmit} 
            variant="contained"
            disabled={loading}
            sx={{ background: '#7c3aed' }}
          >
            {loading ? "Speichern..." : (editingCoach ? "Aktualisieren" : "Erstellen")}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Session Dialog */}
      <Dialog open={openSessionDialog} onClose={() => setOpenSessionDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ background: '#7c3aed', color: '#fff' }}>
          {editingSession ? 'Session bearbeiten' : 'Neue Session hinzufügen'}
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <TextField
                select
                label="Coach"
                value={sessionForm.coachId}
                onChange={(e) => setSessionForm({...sessionForm, coachId: e.target.value})}
                sx={{ flex: 1, minWidth: 200 }}
              >
                {coaches.map((coach) => (
                  <option key={coach.id} value={coach.id}>
                    {coach.name}
                  </option>
                ))}
              </TextField>
              <TextField
                label="Kundenname"
                value={sessionForm.clientName}
                onChange={(e) => setSessionForm({...sessionForm, clientName: e.target.value})}
                sx={{ flex: 1, minWidth: 200 }}
              />
            </Box>
            
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <TextField
                label="Datum"
                type="datetime-local"
                value={sessionForm.date}
                onChange={(e) => setSessionForm({...sessionForm, date: e.target.value})}
                sx={{ flex: 1, minWidth: 200 }}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="Dauer (Minuten)"
                type="number"
                value={sessionForm.duration}
                onChange={(e) => setSessionForm({...sessionForm, duration: parseInt(e.target.value)})}
                sx={{ flex: 1, minWidth: 200 }}
              />
            </Box>
            
            <TextField
              label="Thema"
              value={sessionForm.topic}
              onChange={(e) => setSessionForm({...sessionForm, topic: e.target.value})}
              fullWidth
            />
            
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <TextField
                select
                label="Status"
                value={sessionForm.status}
                onChange={(e) => setSessionForm({...sessionForm, status: e.target.value as 'scheduled' | 'completed' | 'cancelled'})}
                sx={{ flex: 1, minWidth: 200 }}
              >
                <option value="scheduled">Geplant</option>
                <option value="completed">Abgeschlossen</option>
                <option value="cancelled">Storniert</option>
              </TextField>
          </Box>
            
            <TextField
              label="Notizen"
              multiline
              rows={3}
              value={sessionForm.notes}
              onChange={(e) => setSessionForm({...sessionForm, notes: e.target.value})}
              fullWidth
            />
    </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenSessionDialog(false)}>Abbrechen</Button>
          <Button 
            onClick={handleSessionSubmit} 
            variant="contained"
            disabled={loading}
            sx={{ background: '#7c3aed' }}
          >
            {loading ? "Speichern..." : (editingSession ? "Aktualisieren" : "Erstellen")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
