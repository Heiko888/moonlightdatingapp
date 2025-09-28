"use client";

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Alert,
  Tabs,
  Tab,
  LinearProgress
} from '@mui/material';
import {
  Search,
  Download,
  RotateCcw,
  Eye,
  Shield,
  User,
  Settings
} from 'lucide-react';
import { useAuditLogs, useAuditStats } from '@/lib/audit/auditLogger';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`audit-tabpanel-${index}`}
      aria-labelledby={`audit-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const severityColors = {
  low: '#22c55e',
  medium: '#f59e0b',
  high: '#ef4444',
  critical: '#dc2626'
};

const categoryIcons = {
  auth: <User size={16} />,
  admin: <Settings size={16} />,
  user: <User size={16} />,
  system: <Settings size={16} />,
  security: <Shield size={16} />
};

export default function AdminAuditDashboard() {
  const [activeTab, setActiveTab] = useState(0);
  const [filter, setFilter] = useState({
    action: '',
    resource: '',
    category: '',
    severity: '',
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined
  });

  const { logs, loading, error, refetch } = useAuditLogs(filter);
  const { stats } = useAuditStats('day');

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleFilterChange = (field: string, value: string | Date | undefined) => {
    setFilter(prev => ({ ...prev, [field]: value }));
  };

  const clearFilters = () => {
    setFilter({
      action: '',
      resource: '',
      category: '',
      severity: '',
      startDate: undefined,
      endDate: undefined
    });
  };

  const exportLogs = () => {
    const csvContent = [
      ['Timestamp', 'User', 'Action', 'Resource', 'Category', 'Severity', 'Details'],
      ...logs.map(log => [
        new Date(log.timestamp).toLocaleString('de-DE'),
        log.userEmail,
        log.action,
        log.resource,
        log.category,
        log.severity,
        JSON.stringify(log.details || {})
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('de-DE');
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ color: 'white', mb: 3 }}>
        <Shield size={32} style={{ marginRight: '12px', verticalAlign: 'middle' }} />
        Audit-Dashboard
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange} aria-label="audit tabs">
          <Tab label="Übersicht" />
          <Tab label="Logs" />
          <Tab label="Statistiken" />
        </Tabs>
      </Box>

      <TabPanel value={activeTab} index={0}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <Card sx={{ background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(20px)' }}>
              <CardContent>
                <Typography variant="h6" sx={{ color: 'white' }}>
                  Gesamt Events
                </Typography>
                <Typography variant="h3" sx={{ color: '#22c55e' }}>
                  {stats.totalEvents}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <Card sx={{ background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(20px)' }}>
              <CardContent>
                <Typography variant="h6" sx={{ color: 'white' }}>
                  Kritische Events
                </Typography>
                <Typography variant="h3" sx={{ color: '#ef4444' }}>
                  {stats.eventsBySeverity.critical || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <Card sx={{ background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(20px)' }}>
              <CardContent>
                <Typography variant="h6" sx={{ color: 'white' }}>
                  Admin Actions
                </Typography>
                <Typography variant="h3" sx={{ color: '#f59e0b' }}>
                  {stats.eventsByCategory.admin || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <Card sx={{ background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(20px)' }}>
              <CardContent>
                <Typography variant="h6" sx={{ color: 'white' }}>
                  Security Events
                </Typography>
                <Typography variant="h3" sx={{ color: '#dc2626' }}>
                  {stats.eventsByCategory.security || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
            Top Actions
          </Typography>
          <Grid container spacing={2}>
            {stats.topActions.map((action, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card sx={{ background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(20px)' }}>
                  <CardContent>
                    <Typography variant="body2" sx={{ color: 'white' }}>
                      {action.action}
                    </Typography>
                    <Typography variant="h6" sx={{ color: '#22c55e' }}>
                      {action.count}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </TabPanel>

      <TabPanel value={activeTab} index={1}>
        <Box sx={{ mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Action"
                value={filter.action}
                onChange={(e) => handleFilterChange('action', e.target.value)}
                size="small"
                sx={{ 
                  '& .MuiInputBase-input': { color: 'white' },
                  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' }
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel sx={{ color: 'rgba(255,255,255,0.7)' }}>Category</InputLabel>
                <Select
                  value={filter.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  label="Category"
                  sx={{ 
                    color: 'white',
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.3)' }
                  }}
                >
                  <MenuItem value="">Alle</MenuItem>
                  <MenuItem value="auth">Auth</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                  <MenuItem value="user">User</MenuItem>
                  <MenuItem value="system">System</MenuItem>
                  <MenuItem value="security">Security</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel sx={{ color: 'rgba(255,255,255,0.7)' }}>Severity</InputLabel>
                <Select
                  value={filter.severity}
                  onChange={(e) => handleFilterChange('severity', e.target.value)}
                  label="Severity"
                  sx={{ 
                    color: 'white',
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.3)' }
                  }}
                >
                  <MenuItem value="">Alle</MenuItem>
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                  <MenuItem value="critical">Critical</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="contained"
                  startIcon={<Search size={16} />}
                  onClick={refetch}
                  size="small"
                >
                  Suchen
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<RotateCcw size={16} />}
                  onClick={clearFilters}
                  size="small"
                >
                  Reset
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Download size={16} />}
                  onClick={exportLogs}
                  size="small"
                >
                  Export
                </Button>
              </Box>
            </Grid>
          </Grid>
          
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Startdatum"
                type="datetime-local"
                value={filter.startDate ? filter.startDate.toISOString().slice(0, 16) : ''}
                onChange={(e) => {
                  const value = e.target.value ? new Date(e.target.value) : undefined;
                  handleFilterChange('startDate', value);
                }}
                size="small"
                InputLabelProps={{ shrink: true }}
                sx={{ 
                  '& .MuiInputBase-input': { color: 'white' },
                  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' }
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Enddatum"
                type="datetime-local"
                value={filter.endDate ? filter.endDate.toISOString().slice(0, 16) : ''}
                onChange={(e) => {
                  const value = e.target.value ? new Date(e.target.value) : undefined;
                  handleFilterChange('endDate', value);
                }}
                size="small"
                InputLabelProps={{ shrink: true }}
                sx={{ 
                  '& .MuiInputBase-input': { color: 'white' },
                  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' }
                }}
              />
            </Grid>
          </Grid>
        </Box>

        {loading && <LinearProgress sx={{ mb: 2 }} />}
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <TableContainer component={Paper} sx={{ background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(20px)' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Timestamp</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>User</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Action</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Resource</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Category</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Severity</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Details</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id} hover>
                  <TableCell sx={{ color: 'white' }}>
                    {formatTimestamp(log.timestamp)}
                  </TableCell>
                  <TableCell sx={{ color: 'white' }}>
                    {log.userEmail}
                  </TableCell>
                  <TableCell sx={{ color: 'white' }}>
                    {log.action}
                  </TableCell>
                  <TableCell sx={{ color: 'white' }}>
                    {log.resource}
                  </TableCell>
                  <TableCell sx={{ color: 'white' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {categoryIcons[log.category as keyof typeof categoryIcons]}
                      {log.category}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={log.severity}
                      size="small"
                      sx={{
                        backgroundColor: severityColors[log.severity],
                        color: 'white',
                        fontWeight: 'bold'
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => console.log('Details:', log.details)}
                      sx={{ color: 'white' }}
                    >
                      <Eye size={16} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      <TabPanel value={activeTab} index={2}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card sx={{ background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(20px)' }}>
              <CardContent>
                <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                  Events nach Kategorie
                </Typography>
                {Object.entries(stats.eventsByCategory).map(([category, count]) => (
                  <Box key={category} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" sx={{ color: 'white' }}>
                      {category}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#22c55e' }}>
                      {count}
                    </Typography>
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card sx={{ background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(20px)' }}>
              <CardContent>
                <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                  Events nach Schweregrad
                </Typography>
                {Object.entries(stats.eventsBySeverity).map(([severity, count]) => (
                  <Box key={severity} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" sx={{ color: 'white' }}>
                      {severity}
                    </Typography>
                    <Typography variant="body2" sx={{ color: severityColors[severity as keyof typeof severityColors] }}>
                      {count}
                    </Typography>
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>
    </Box>
  );
}
