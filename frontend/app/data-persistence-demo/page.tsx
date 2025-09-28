"use client";
import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Card, 
  CardContent, 
  Button, 
  Grid, 
  Chip, 
  Alert, 
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Paper,
  Switch,
  FormControlLabel,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { 
  Database, 
  Cloud, 
  Wifi, 
  WifiOff, 
  RotateCcw, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  User,
  FileText,
  Moon,
  Calendar,
  BarChart3,
  Settings
} from 'lucide-react';
import { 
  dataPersistenceUtils, 
  userProfileService, 
  chartService, 
  moonTrackingService, 
  journalService, 
  dashboardService,
  type DashboardData 
} from '../../lib/dataPersistenceService';

export default function DataPersistenceDemo() {
  const [isOnline, setIsOnline] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');
  const [syncMessage, setSyncMessage] = useState('');
  
  // Demo-Daten
  const [demoMode, setDemoMode] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newEntry, setNewEntry] = useState({ title: '', content: '' });

  // Online-Status überwachen
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Authentifizierung prüfen
  useEffect(() => {
    setIsAuthenticated(dataPersistenceUtils.isAuthenticated());
  }, []);

  // Dashboard-Daten laden
  const loadDashboardData = async () => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    try {
      const data = await dashboardService.getDashboardData();
      setDashboardData(data);
    } catch (error) {
      console.error('Fehler beim Laden der Dashboard-Daten:', error);
    } finally {
      setLoading(false);
    }
  };

  // Vollständige Synchronisation
  const handleFullSync = async () => {
    setSyncStatus('syncing');
    setSyncMessage('Synchronisiere alle Daten...');
    
    try {
      await dataPersistenceUtils.hybridSync();
      setSyncStatus('success');
      setSyncMessage('Alle Daten erfolgreich synchronisiert');
      await loadDashboardData();
    } catch (error) {
      setSyncStatus('error');
      setSyncMessage('Synchronisation fehlgeschlagen');
    }
  };

  // Demo-Daten erstellen
  const createDemoData = async () => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    try {
      // Demo Journal-Eintrag
      await journalService.saveEntry({
        title: newEntry.title || 'Demo Journal-Eintrag',
        content: newEntry.content || 'Dies ist ein Demo-Eintrag für die Datenpersistierung.',
        mood: 'happy',
        energy_level: 8,
        tags: ['demo', 'test']
      });

      // Demo Mondkalender-Eintrag
      await moonTrackingService.saveEntry({
        date: new Date().toISOString().split('T')[0],
        moon_phase: 'Vollmond',
        mood: 7,
        energy: 8,
        notes: 'Demo-Eintrag für Mondkalender-Tracking',
        rituals_completed: ['Meditation', 'Journaling']
      });

      setSyncStatus('success');
      setSyncMessage('Demo-Daten erfolgreich erstellt');
      await loadDashboardData();
    } catch (error) {
      setSyncStatus('error');
      setSyncMessage('Fehler beim Erstellen der Demo-Daten');
    } finally {
      setLoading(false);
      setShowCreateDialog(false);
      setNewEntry({ title: '', content: '' });
    }
  };

  // Status-Chip Komponente
  const StatusChip = ({ status, label }: { status: 'success' | 'error' | 'warning' | 'info', label: string }) => {
    const colors = {
      success: '#10b981',
      error: '#ef4444',
      warning: '#f59e0b',
      info: '#3b82f6'
    };
    
    const icons = {
      success: <CheckCircle size={16} />,
      error: <XCircle size={16} />,
      warning: <AlertCircle size={16} />,
      info: <AlertCircle size={16} />
    };

    return (
      <Chip
        icon={icons[status]}
        label={label}
        sx={{ 
          backgroundColor: colors[status] + '20',
          color: colors[status],
          border: `1px solid ${colors[status]}40`
        }}
      />
    );
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      py: 4
    }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h3" sx={{ color: 'white', mb: 2, fontWeight: 'bold' }}>
            🗄️ Datenpersistierung Demo
          </Typography>
          <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.8)' }}>
            Echte Datenbank-Integration mit SQLite & Supabase
          </Typography>
        </Box>

        {/* Status-Bar */}
        <Card sx={{ mb: 4, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)' }}>
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <StatusChip 
                    status={isOnline ? 'success' : 'error'} 
                    label={isOnline ? 'Online' : 'Offline'} 
                  />
                  <StatusChip 
                    status={isAuthenticated ? 'success' : 'warning'} 
                    label={isAuthenticated ? 'Authentifiziert' : 'Nicht authentifiziert'} 
                  />
                  <StatusChip 
                    status={demoMode ? 'info' : 'success'} 
                    label={demoMode ? 'Demo-Modus' : 'Live-Modus'} 
                  />
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={demoMode}
                        onChange={(e) => setDemoMode(e.target.checked)}
                        color="primary"
                      />
                    }
                    label="Demo-Modus"
                  />
                  <Button
                    variant="contained"
                    startIcon={<RotateCcw size={20} />}
                    onClick={handleFullSync}
                    disabled={!isAuthenticated || loading}
                    sx={{ 
                      background: 'linear-gradient(45deg, #FFD700, #FFA500)',
                      color: '#1a1a2e',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #FFA500, #FFD700)'
                      }
                    }}
                  >
                    Vollständige Sync
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Sync-Status */}
        {syncStatus !== 'idle' && (
          <Alert 
            severity={syncStatus === 'success' ? 'success' : syncStatus === 'error' ? 'error' : 'info'}
            sx={{ mb: 4 }}
            icon={syncStatus === 'syncing' ? <CircularProgress size={20} /> : undefined}
          >
            {syncMessage}
          </Alert>
        )}

        {/* Hauptinhalt */}
        <Grid container spacing={4}>
          {/* System-Status */}
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%', background: 'rgba(255,255,255,0.95)' }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Settings size={24} />
                  System-Status
                </Typography>
                
                <List>
                  <ListItem>
                    <ListItemIcon>
                      {isOnline ? <Wifi color="#10b981" /> : <WifiOff color="#ef4444" />}
                    </ListItemIcon>
                    <ListItemText 
                      primary="Netzwerk-Verbindung"
                      secondary={isOnline ? 'Verbindung aktiv' : 'Keine Internetverbindung'}
                    />
                  </ListItem>
                  
                  <ListItem>
                    <ListItemIcon>
                      {isAuthenticated ? <Database color="#10b981" /> : <Cloud color="#f59e0b" />}
                    </ListItemIcon>
                    <ListItemText 
                      primary="Datenbank-Zugriff"
                      secondary={isAuthenticated ? 'SQLite-Datenbank verfügbar' : 'Nur lokale Speicherung'}
                    />
                  </ListItem>
                  
                  <ListItem>
                    <ListItemIcon>
                      <BarChart3 color="#3b82f6" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Daten-Synchronisation"
                      secondary={isAuthenticated && isOnline ? 'Automatisch aktiviert' : 'Manuell erforderlich'}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Dashboard-Daten */}
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%', background: 'rgba(255,255,255,0.95)' }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <BarChart3 size={24} />
                  Dashboard-Daten
                </Typography>
                
                {loading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <CircularProgress />
                  </Box>
                ) : dashboardData ? (
                  <Box>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Paper sx={{ p: 2, textAlign: 'center', background: '#f0f9ff' }}>
                          <Typography variant="h4" color="primary">
                            {dashboardData.statistics.totalCharts}
                          </Typography>
                          <Typography variant="body2">Charts</Typography>
                        </Paper>
                      </Grid>
                      <Grid item xs={6}>
                        <Paper sx={{ p: 2, textAlign: 'center', background: '#f0fdf4' }}>
                          <Typography variant="h4" color="success.main">
                            {dashboardData.statistics.totalJournalEntries}
                          </Typography>
                          <Typography variant="body2">Journal-Einträge</Typography>
                        </Paper>
                      </Grid>
                      <Grid item xs={6}>
                        <Paper sx={{ p: 2, textAlign: 'center', background: '#fefce8' }}>
                          <Typography variant="h4" color="warning.main">
                            {dashboardData.statistics.totalMoonEntries}
                          </Typography>
                          <Typography variant="body2">Mondkalender-Einträge</Typography>
                        </Paper>
                      </Grid>
                      <Grid item xs={6}>
                        <Paper sx={{ p: 2, textAlign: 'center', background: '#fdf2f8' }}>
                          <Typography variant="h4" color="secondary">
                            {dashboardData.user ? '1' : '0'}
                          </Typography>
                          <Typography variant="body2">Benutzerprofile</Typography>
                        </Paper>
                      </Grid>
                    </Grid>
                    
                    <Button
                      variant="outlined"
                      fullWidth
                      sx={{ mt: 2 }}
                      onClick={loadDashboardData}
                    >
                      Daten aktualisieren
                    </Button>
                  </Box>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography color="text.secondary" sx={{ mb: 2 }}>
                      Keine Dashboard-Daten verfügbar
                    </Typography>
                    <Button
                      variant="contained"
                      onClick={loadDashboardData}
                      disabled={!isAuthenticated}
                    >
                      Daten laden
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Demo-Aktionen */}
          <Grid item xs={12}>
            <Card sx={{ background: 'rgba(255,255,255,0.95)' }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <FileText size={24} />
                  Demo-Aktionen
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<User size={20} />}
                      onClick={() => userProfileService.syncFromLocalStorage()}
                      disabled={!isAuthenticated}
                    >
                      Profil synchronisieren
                    </Button>
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<FileText size={20} />}
                      onClick={() => chartService.syncFromLocalStorage()}
                      disabled={!isAuthenticated}
                    >
                      Chart synchronisieren
                    </Button>
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<Moon size={20} />}
                      onClick={() => moonTrackingService.syncFromLocalStorage()}
                      disabled={!isAuthenticated}
                    >
                      Mondkalender synchronisieren
                    </Button>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<Calendar size={20} />}
                      onClick={() => journalService.syncFromLocalStorage()}
                      disabled={!isAuthenticated}
                    >
                      Journal synchronisieren
                    </Button>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Button
                      variant="contained"
                      fullWidth
                      startIcon={<FileText size={20} />}
                      onClick={() => setShowCreateDialog(true)}
                      disabled={!isAuthenticated}
                      sx={{ 
                        background: 'linear-gradient(45deg, #10b981, #059669)',
                        '&:hover': {
                          background: 'linear-gradient(45deg, #059669, #047857)'
                        }
                      }}
                    >
                      Demo-Daten erstellen
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Demo-Daten Dialog */}
        <Dialog open={showCreateDialog} onClose={() => setShowCreateDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Demo-Daten erstellen</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Titel"
              fullWidth
              variant="outlined"
              value={newEntry.title}
              onChange={(e) => setNewEntry({ ...newEntry, title: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Inhalt"
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              value={newEntry.content}
              onChange={(e) => setNewEntry({ ...newEntry, content: e.target.value })}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowCreateDialog(false)}>Abbrechen</Button>
            <Button onClick={createDemoData} variant="contained" disabled={loading}>
              {loading ? 'Erstelle...' : 'Erstellen'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}
