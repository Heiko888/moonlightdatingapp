'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  IconButton,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  LinearProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  Zap,
  Key,
  Code2,
  Eye,
  Copy,
  Check,
  Play,
  RotateCcw,
  Trash2,
  Plus,
  ExternalLink,
  Activity,
  BarChart3,
  TrendingUp,
  Users,
  Heart,
  BookOpen
} from 'lucide-react';
import AccessControl from '@/components/AccessControl';

interface APIKey {
  id: string;
  name: string;
  key: string;
  type: 'production' | 'test';
  status: 'active' | 'inactive' | 'revoked';
  createdAt: string;
  lastUsed: string;
  usage: number;
  limit: number;
  permissions: string[];
}

interface APIEndpoint {
  id: string;
  name: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  description: string;
  parameters: unknown[];
  response: unknown;
  rateLimit: number;
  category: 'charts' | 'compatibility' | 'readings' | 'users';
}

interface APIUsage {
  date: string;
  requests: number;
  errors: number;
  responseTime: number;
  cost: number;
}

export default function APIAccessPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [apiKeys, setApiKeys] = useState<APIKey[]>([]);
  const [endpoints, setEndpoints] = useState<APIEndpoint[]>([]);
  const [usage, setUsage] = useState<APIUsage[]>([]);
  const [showCreateKey, setShowCreateKey] = useState(false);
  const [showEndpointDetails, setShowEndpointDetails] = useState(false);
  const [selectedEndpoint, setSelectedEndpoint] = useState<APIEndpoint | null>(null);
  const [newKey, setNewKey] = useState({
    name: '',
    type: 'test',
    permissions: [] as string[]
  });
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    loadAPIData();
  }, []);

  const loadAPIData = async () => {
    try {
      // Simuliere API-Daten
      setApiKeys([
        {
          id: '1',
          name: 'Production Key',
          key: 'hd_vip_sk_live_1234567890abcdef',
          type: 'production',
          status: 'active',
          createdAt: '2024-01-01',
          lastUsed: '2024-01-15',
          usage: 1247,
          limit: 10000,
          permissions: ['charts', 'compatibility', 'readings', 'users']
        },
        {
          id: '2',
          name: 'Test Key',
          key: 'hd_vip_sk_test_abcdef1234567890',
          type: 'test',
          status: 'active',
          createdAt: '2024-01-01',
          lastUsed: '2024-01-14',
          usage: 89,
          limit: 1000,
          permissions: ['charts', 'compatibility']
        }
      ]);

      setEndpoints([
        {
          id: '1',
          name: 'Calculate Human Design Chart',
          method: 'POST',
          path: '/api/v1/charts/calculate',
          description: 'Berechnet ein Human Design Chart basierend auf Geburtsdaten',
          parameters: [
            { name: 'birth_date', type: 'string', required: true, description: 'Geburtsdatum (YYYY-MM-DD)' },
            { name: 'birth_time', type: 'string', required: true, description: 'Geburtszeit (HH:MM)' },
            { name: 'birth_place', type: 'string', required: true, description: 'Geburtsort' },
            { name: 'timezone', type: 'string', required: false, description: 'Zeitzone (Standard: Europe/Berlin)' }
          ],
          response: {
            type: 'object',
            properties: {
              type: { type: 'string', description: 'Human Design Typ' },
              profile: { type: 'string', description: 'Profil' },
              strategy: { type: 'string', description: 'Strategie' },
              authority: { type: 'string', description: 'Autorität' },
              centers: { type: 'object', description: 'Zentren' },
              channels: { type: 'object', description: 'Kanäle' },
              gates: { type: 'object', description: 'Tore' }
            }
          },
          rateLimit: 100,
          category: 'charts'
        },
        {
          id: '2',
          name: 'Calculate Compatibility',
          method: 'POST',
          path: '/api/v1/compatibility/calculate',
          description: 'Berechnet die Kompatibilität zwischen zwei Human Design Charts',
          parameters: [
            { name: 'chart1', type: 'object', required: true, description: 'Erstes Chart' },
            { name: 'chart2', type: 'object', required: true, description: 'Zweites Chart' },
            { name: 'type', type: 'string', required: false, description: 'Kompatibilitätstyp (dating, business, general)' }
          ],
          response: {
            type: 'object',
            properties: {
              overall_score: { type: 'number', description: 'Gesamtbewertung (0-100)' },
              type_compatibility: { type: 'number', description: 'Typ-Kompatibilität' },
              channel_compatibility: { type: 'number', description: 'Kanal-Kompatibilität' },
              gate_compatibility: { type: 'number', description: 'Tor-Kompatibilität' },
              insights: { type: 'array', description: 'Detaillierte Insights' }
            }
          },
          rateLimit: 50,
          category: 'compatibility'
        },
        {
          id: '3',
          name: 'Generate Reading',
          method: 'POST',
          path: '/api/v1/readings/generate',
          description: 'Generiert ein AI-basiertes Human Design Reading',
          parameters: [
            { name: 'chart_data', type: 'object', required: true, description: 'Chart-Daten' },
            { name: 'scope', type: 'string', required: true, description: 'Bereich (dating, business, personal, general)' },
            { name: 'language', type: 'string', required: false, description: 'Sprache (Standard: de)' }
          ],
          response: {
            type: 'object',
            properties: {
              reading: { type: 'string', description: 'Generiertes Reading' },
              scope: { type: 'string', description: 'Bereich' },
              generated_at: { type: 'string', description: 'Generierungszeit' }
            }
          },
          rateLimit: 25,
          category: 'readings'
        }
      ]);

      setUsage([
        { date: '2024-01-15', requests: 1247, errors: 12, responseTime: 245, cost: 12.47 },
        { date: '2024-01-14', requests: 1156, errors: 8, responseTime: 238, cost: 11.56 },
        { date: '2024-01-13', requests: 1089, errors: 15, responseTime: 252, cost: 10.89 },
        { date: '2024-01-12', requests: 1345, errors: 6, responseTime: 231, cost: 13.45 }
      ]);
    } catch (error) {
      console.error('Fehler beim Laden der API-Daten:', error);
    }
  };

  const handleCreateKey = () => {
    const key: APIKey = {
      id: Date.now().toString(),
      name: newKey.name,
      key: `hd_vip_sk_${newKey.type}_${Math.random().toString(36).substr(2, 16)}`,
      type: newKey.type as 'production' | 'test',
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
      lastUsed: 'Nie',
      usage: 0,
      limit: newKey.type === 'production' ? 10000 : 1000,
      permissions: newKey.permissions
    };
    
    setApiKeys([...apiKeys, key]);
    setNewKey({ name: '', type: 'test', permissions: [] });
    setShowCreateKey(false);
  };

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleRevokeKey = (keyId: string) => {
    setApiKeys(apiKeys.map(key => 
      key.id === keyId 
        ? { ...key, status: 'revoked' as const }
        : key
    ));
  };

  const handleViewEndpoint = (endpoint: APIEndpoint) => {
    setSelectedEndpoint(endpoint);
    setShowEndpointDetails(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#10b981';
      case 'inactive': return '#6b7280';
      case 'revoked': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return '#10b981';
      case 'POST': return '#3b82f6';
      case 'PUT': return '#f59e0b';
      case 'DELETE': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'charts': return <BarChart3 size={16} />;
      case 'compatibility': return <Heart size={16} />;
      case 'readings': return <BookOpen size={16} />;
      case 'users': return <Users size={16} />;
      default: return <Zap size={16} />;
    }
  };

  return (
    <AccessControl path="/api-access">
      <Box sx={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        color: 'white'
      }}>
        <Container maxWidth="xl" sx={{ py: 4 }}>
          {/* Header */}
          <motion.div
            
            
            
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
              <Zap size={48} color="#FFD700" style={{ marginRight: 16 }} />
              <Box>
                <Typography variant="h3" sx={{ color: '#FFD700', fontWeight: 700, mb: 1 }}>
                  ⚡ API Access
                </Typography>
                <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                  Vollständiger API-Zugang für Entwickler
                </Typography>
              </Box>
              <Box sx={{ ml: 'auto' }}>
                <Chip 
                  label="Developer Access" 
                  sx={{ 
                    background: 'linear-gradient(45deg, #FFD700, #FFA500)',
                    color: '#1a1a2e',
                    fontWeight: 600,
                    fontSize: '1rem',
                    px: 2,
                    py: 1
                  }} 
                />
              </Box>
            </Box>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            
            
            
          >
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ 
                  background: 'rgba(59, 130, 246, 0.1)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  borderRadius: 2
                }}>
                  <CardContent sx={{ textAlign: 'center', p: 2 }}>
                    <Key size={32} color="#3b82f6" style={{ margin: '0 auto 8px' }} />
                    <Typography variant="h4" sx={{ color: '#3b82f6', fontWeight: 700 }}>
                      {apiKeys.length}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                      API Keys
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ 
                  background: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  borderRadius: 2
                }}>
                  <CardContent sx={{ textAlign: 'center', p: 2 }}>
                    <Code2 size={32} color="#10b981" style={{ margin: '0 auto 8px' }} />
                    <Typography variant="h4" sx={{ color: '#10b981', fontWeight: 700 }}>
                      {endpoints.length}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                      Endpoints
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ 
                  background: 'rgba(245, 158, 11, 0.1)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  borderRadius: 2
                }}>
                  <CardContent sx={{ textAlign: 'center', p: 2 }}>
                    <Activity size={32} color="#f59e0b" style={{ margin: '0 auto 8px' }} />
                    <Typography variant="h4" sx={{ color: '#f59e0b', fontWeight: 700 }}>
                      {usage.reduce((sum, day) => sum + day.requests, 0).toLocaleString()}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                      API Calls
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ 
                  background: 'rgba(34, 197, 94, 0.1)',
                  border: '1px solid rgba(34, 197, 94, 0.3)',
                  borderRadius: 2
                }}>
                  <CardContent sx={{ textAlign: 'center', p: 2 }}>
                    <TrendingUp size={32} color="#22c55e" style={{ margin: '0 auto 8px' }} />
                    <Typography variant="h4" sx={{ color: '#22c55e', fontWeight: 700 }}>
                      €{usage.reduce((sum, day) => sum + day.cost, 0).toFixed(2)}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                      Gesamtkosten
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </motion.div>

          {/* Tabs */}
          <motion.div
            
            
            
          >
            <Paper sx={{ 
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 3
            }}>
              <Tabs
                value={activeTab}
                onChange={(e, newValue) => setActiveTab(newValue)}
                sx={{
                  '& .MuiTab-root': {
                    color: 'rgba(255,255,255,0.7)',
                    '&.Mui-selected': {
                      color: '#FFD700'
                    }
                  },
                  '& .MuiTabs-indicator': {
                    backgroundColor: '#FFD700'
                  }
                }}
              >
                <Tab label="API Keys" icon={<Key size={20} />} />
                <Tab label="Endpoints" icon={<Code2 size={20} />} />
                <Tab label="Usage" icon={<Activity size={20} />} />
                <Tab label="Documentation" icon={<BookOpen size={20} />} />
              </Tabs>

              {/* API Keys Tab */}
              {activeTab === 0 && (
                <Box sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h5" sx={{ color: 'white', fontWeight: 600 }}>
                      🔑 API Keys
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<Plus size={20} />}
                      onClick={() => setShowCreateKey(true)}
                      sx={{
                        background: 'linear-gradient(45deg, #FFD700, #FFA500)',
                        color: '#1a1a2e',
                        fontWeight: 600,
                        '&:hover': {
                          background: 'linear-gradient(45deg, #FFA500, #FF8C00)'
                        }
                      }}
                    >
                      Neuen Key erstellen
                    </Button>
                  </Box>

                  <Grid container spacing={3}>
                    {apiKeys.map((key) => (
                      <Grid item xs={12} md={6} key={key.id}>
                        <Card sx={{
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: 2,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 8px 32px rgba(255, 215, 0, 0.1)'
                          }
                        }}>
                          <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                              <Typography variant="h6" sx={{ color: '#fff' }}>
                                {key.name}
                              </Typography>
                              <Chip 
                                label={key.status === 'active' ? 'Aktiv' : 
                                      key.status === 'inactive' ? 'Inaktiv' : 'Widerrufen'}
                                size="small"
                                sx={{
                                  background: getStatusColor(key.status),
                                  color: '#fff'
                                }}
                              />
                            </Box>
                            
                            <Box sx={{ mb: 2 }}>
                              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1 }}>
                                API Key:
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <TextField
                                  value={key.key}
                                  InputProps={{ readOnly: true }}
                                  size="small"
                                  sx={{
                                    flex: 1,
                                    '& .MuiOutlinedInput-root': {
                                      color: '#fff',
                                      fontSize: '0.8rem',
                                      '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' }
                                    }
                                  }}
                                />
                                <IconButton
                                  size="small"
                                  onClick={() => handleCopyKey(key.key)}
                                  sx={{ color: copiedKey === key.key ? '#10b981' : 'rgba(255,255,255,0.7)' }}
                                >
                                  {copiedKey === key.key ? <Check size={16} /> : <Copy size={16} />}
                                </IconButton>
                              </Box>
                            </Box>
                            
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                              <Chip 
                                label={key.type === 'production' ? 'Production' : 'Test'} 
                                size="small" 
                                sx={{ 
                                  background: key.type === 'production' ? '#ef4444' : '#3b82f6',
                                  color: '#fff',
                                  mr: 2
                                }} 
                              />
                              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                Limit: {key.limit.toLocaleString()}/Monat
                              </Typography>
                            </Box>
                            
                            <Box sx={{ mb: 2 }}>
                              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1 }}>
                                Verwendung: {key.usage.toLocaleString()} / {key.limit.toLocaleString()}
                              </Typography>
                              <LinearProgress 
                                variant="determinate" 
                                value={(key.usage / key.limit) * 100} 
                                sx={{
                                  height: 6,
                                  borderRadius: 3,
                                  '& .MuiLinearProgress-bar': {
                                    background: (key.usage / key.limit) > 0.8 ? '#ef4444' : '#10b981'
                                  }
                                }}
                              />
                            </Box>
                            
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <Button
                                variant="outlined"
                                size="small"
                                startIcon={<Eye size={16} />}
                                sx={{ color: '#3b82f6', borderColor: '#3b82f6' }}
                              >
                                Details
                              </Button>
                              <Button
                                variant="outlined"
                                size="small"
                                startIcon={<RotateCcw size={16} />}
                                sx={{ color: '#f59e0b', borderColor: '#f59e0b' }}
                              >
                                Regenerieren
                              </Button>
                              <Button
                                variant="outlined"
                                size="small"
                                startIcon={<Trash2 size={16} />}
                                onClick={() => handleRevokeKey(key.id)}
                                sx={{ color: '#ef4444', borderColor: '#ef4444' }}
                              >
                                Widerrufen
                              </Button>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}

              {/* Endpoints Tab */}
              {activeTab === 1 && (
                <Box sx={{ p: 4 }}>
                  <Typography variant="h5" sx={{ color: 'white', mb: 3, fontWeight: 600 }}>
                    🔌 API Endpoints
                  </Typography>
                  
                  <Grid container spacing={3}>
                    {endpoints.map((endpoint) => (
                      <Grid item xs={12} key={endpoint.id}>
                        <Card sx={{
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: 2,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 8px 32px rgba(255, 215, 0, 0.1)'
                          }
                        }}>
                          <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                {getCategoryIcon(endpoint.category)}
                                <Typography variant="h6" sx={{ color: '#fff' }}>
                                  {endpoint.name}
                                </Typography>
                              </Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Chip 
                                  label={endpoint.method} 
                                  size="small" 
                                  sx={{ 
                                    background: getMethodColor(endpoint.method),
                                    color: '#fff',
                                    fontWeight: 600
                                  }} 
                                />
                                <Chip 
                                  label={`${endpoint.rateLimit}/h`} 
                                  size="small" 
                                  sx={{ 
                                    background: 'rgba(139, 92, 246, 0.2)',
                                    color: '#8B5CF6'
                                  }} 
                                />
                              </Box>
                            </Box>
                            
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mb: 2 }}>
                              {endpoint.description}
                            </Typography>
                            
                            <Box sx={{ mb: 2 }}>
                              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1 }}>
                                Endpoint:
                              </Typography>
                              <Box sx={{ 
                                background: 'rgba(0,0,0,0.3)', 
                                color: '#FFD700', 
                                p: 1, 
                                borderRadius: 1,
                                fontSize: '0.9rem',
                                fontFamily: 'monospace'
                              }}>
                                {endpoint.method} {endpoint.path}
                              </Box>
                            </Box>
                            
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <Button
                                variant="contained"
                                size="small"
                                startIcon={<ExternalLink size={16} />}
                                onClick={() => handleViewEndpoint(endpoint)}
                                sx={{
                                  background: 'linear-gradient(45deg, #3b82f6, #1d4ed8)',
                                  color: '#fff',
                                  fontWeight: 600
                                }}
                              >
                                Dokumentation
                              </Button>
                              <Button
                                variant="outlined"
                                size="small"
                                startIcon={<Play size={16} />}
                                sx={{ color: '#10b981', borderColor: '#10b981' }}
                              >
                                Testen
                              </Button>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}

              {/* Usage Tab */}
              {activeTab === 2 && (
                <Box sx={{ p: 4 }}>
                  <Typography variant="h5" sx={{ color: 'white', mb: 3, fontWeight: 600 }}>
                    📊 API Usage
                  </Typography>
                  
                  <TableContainer component={Paper} sx={{ 
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255,255,255,0.1)'
                  }}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ color: '#FFD700', fontWeight: 600 }}>Datum</TableCell>
                          <TableCell sx={{ color: '#FFD700', fontWeight: 600 }}>Requests</TableCell>
                          <TableCell sx={{ color: '#FFD700', fontWeight: 600 }}>Errors</TableCell>
                          <TableCell sx={{ color: '#FFD700', fontWeight: 600 }}>Response Time</TableCell>
                          <TableCell sx={{ color: '#FFD700', fontWeight: 600 }}>Kosten</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {usage.map((day, index) => (
                          <TableRow key={index}>
                            <TableCell sx={{ color: 'rgba(255,255,255,0.8)' }}>
                              {day.date}
                            </TableCell>
                            <TableCell sx={{ color: 'rgba(255,255,255,0.8)' }}>
                              {day.requests.toLocaleString()}
                            </TableCell>
                            <TableCell sx={{ color: day.errors > 10 ? '#ef4444' : 'rgba(255,255,255,0.8)' }}>
                              {day.errors}
                            </TableCell>
                            <TableCell sx={{ color: 'rgba(255,255,255,0.8)' }}>
                              {day.responseTime}ms
                            </TableCell>
                            <TableCell sx={{ color: 'rgba(255,255,255,0.8)' }}>
                              €{day.cost.toFixed(2)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              )}

              {/* Documentation Tab */}
              {activeTab === 3 && (
                <Box sx={{ p: 4 }}>
                  <Typography variant="h5" sx={{ color: 'white', mb: 3, fontWeight: 600 }}>
                    📚 API Dokumentation
                  </Typography>
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Card sx={{
                        background: 'rgba(59, 130, 246, 0.1)',
                        border: '1px solid rgba(59, 130, 246, 0.3)',
                        borderRadius: 2
                      }}>
                        <CardContent>
                          <Typography variant="h6" sx={{ color: '#3b82f6', mb: 2 }}>
                            🚀 Getting Started
                          </Typography>
                          <List>
                            <ListItem sx={{ px: 0 }}>
                              <ListItemIcon><Key size={20} color="#3b82f6" /></ListItemIcon>
                              <ListItemText 
                                primary="API Key generieren" 
                                secondary="Erstelle deinen ersten API Key"
                                sx={{ color: 'rgba(255,255,255,0.8)' }}
                              />
                            </ListItem>
                            <ListItem sx={{ px: 0 }}>
                              <ListItemIcon><Code2 size={20} color="#3b82f6" /></ListItemIcon>
                              <ListItemText 
                                primary="Erste API-Anfrage" 
                                secondary="Teste die API mit einem einfachen Request"
                                sx={{ color: 'rgba(255,255,255,0.8)' }}
                              />
                            </ListItem>
                            <ListItem sx={{ px: 0 }}>
                              <ListItemIcon><BookOpen size={20} color="#3b82f6" /></ListItemIcon>
                              <ListItemText 
                                primary="Dokumentation lesen" 
                                secondary="Lerne alle verfügbaren Endpoints kennen"
                                sx={{ color: 'rgba(255,255,255,0.8)' }}
                              />
                            </ListItem>
                          </List>
                        </CardContent>
                      </Card>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Card sx={{
                        background: 'rgba(16, 185, 129, 0.1)',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                        borderRadius: 2
                      }}>
                        <CardContent>
                          <Typography variant="h6" sx={{ color: '#10b981', mb: 2 }}>
                            📖 Beispiele
                          </Typography>
                          <Accordion sx={{ background: 'rgba(0,0,0,0.2)', mb: 1 }}>
                            <AccordionSummary expandIcon={<Plus size={16} />}>
                              <Typography variant="body2" sx={{ color: '#fff' }}>
                                Chart berechnen
                              </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                              <Box sx={{ 
                                background: 'rgba(0,0,0,0.3)', 
                                color: '#10b981', 
                                p: 1, 
                                borderRadius: 1,
                                fontSize: '0.8rem',
                                display: 'block',
                                fontFamily: 'monospace'
                              }}>
                                {`curl -X POST https://api.humandesign.app/v1/charts/calculate \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "birth_date": "1990-01-15",
    "birth_time": "14:30",
    "birth_place": "Berlin, Germany"
  }'`}
                              </Box>
                            </AccordionDetails>
                          </Accordion>
                          
                          <Accordion sx={{ background: 'rgba(0,0,0,0.2)' }}>
                            <AccordionSummary expandIcon={<Plus size={16} />}>
                              <Typography variant="body2" sx={{ color: '#fff' }}>
                                Kompatibilität berechnen
                              </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                              <Box sx={{ 
                                background: 'rgba(0,0,0,0.3)', 
                                color: '#10b981', 
                                p: 1, 
                                borderRadius: 1,
                                fontSize: '0.8rem',
                                display: 'block',
                                fontFamily: 'monospace'
                              }}>
                                {`curl -X POST https://api.humandesign.app/v1/compatibility/calculate \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "chart1": {...},
    "chart2": {...},
    "type": "dating"
  }'`}
                              </Box>
                            </AccordionDetails>
                          </Accordion>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </Paper>
          </motion.div>

          {/* Create Key Dialog */}
          <Dialog
            open={showCreateKey}
            onClose={() => setShowCreateKey(false)}
            maxWidth="sm"
            fullWidth
            PaperProps={{
              sx: {
                background: 'rgba(26, 26, 46, 0.95)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 215, 0, 0.3)',
                color: 'white'
              }
            }}
          >
            <DialogTitle sx={{ color: '#FFD700', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              Neuen API Key erstellen
            </DialogTitle>
            <DialogContent sx={{ pt: 3 }}>
              <TextField
                fullWidth
                label="Key Name"
                value={newKey.name}
                onChange={(e) => setNewKey({...newKey, name: e.target.value})}
                sx={{
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    color: '#fff',
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                    '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                    '&.Mui-focused fieldset': { borderColor: '#FFD700' }
                  },
                  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' }
                }}
              />
              
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel sx={{ color: 'rgba(255,255,255,0.7)' }}>Key Typ</InputLabel>
                <Select
                  value={newKey.type}
                  onChange={(e) => setNewKey({...newKey, type: e.target.value})}
                  sx={{
                    color: '#fff',
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.3)' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.5)' },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#FFD700' }
                  }}
                >
                  <MenuItem value="test">Test Key</MenuItem>
                  <MenuItem value="production">Production Key</MenuItem>
                </Select>
              </FormControl>
            </DialogContent>
            <DialogActions sx={{ p: 3, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              <Button
                onClick={() => setShowCreateKey(false)}
                sx={{ color: 'rgba(255,255,255,0.7)' }}
              >
                Abbrechen
              </Button>
              <Button
                onClick={handleCreateKey}
                variant="contained"
                disabled={!newKey.name.trim()}
                sx={{
                  background: 'linear-gradient(45deg, #FFD700, #FFA500)',
                  color: '#1a1a2e',
                  fontWeight: 600
                }}
              >
                Key erstellen
              </Button>
            </DialogActions>
          </Dialog>

          {/* Endpoint Details Dialog */}
          <Dialog
            open={showEndpointDetails}
            onClose={() => setShowEndpointDetails(false)}
            maxWidth="md"
            fullWidth
            PaperProps={{
              sx: {
                background: 'rgba(26, 26, 46, 0.95)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 215, 0, 0.3)',
                color: 'white'
              }
            }}
          >
            <DialogTitle sx={{ color: '#FFD700', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              {selectedEndpoint?.name}
            </DialogTitle>
            <DialogContent sx={{ pt: 3 }}>
              {selectedEndpoint && (
                <Box>
                  <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', mb: 3 }}>
                    {selectedEndpoint.description}
                  </Typography>
                  
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" sx={{ color: '#fff', mb: 2 }}>
                      Endpoint
                    </Typography>
                    <Box sx={{ 
                      background: 'rgba(0,0,0,0.3)', 
                      color: '#FFD700', 
                      p: 2, 
                      borderRadius: 1,
                      fontSize: '1rem',
                      display: 'block',
                      fontFamily: 'monospace'
                    }}>
                      {selectedEndpoint.method} {selectedEndpoint.path}
                    </Box>
                  </Box>
                  
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" sx={{ color: '#fff', mb: 2 }}>
                      Parameter
                    </Typography>
                    <List>
                      {selectedEndpoint.parameters.map((param, index) => (
                        <ListItem key={index} sx={{ px: 0 }}>
                          <ListItemText
                            primary={
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography variant="body2" sx={{ color: '#fff', fontWeight: 600 }}>
                                  {(param as { name: string }).name}
                                </Typography>
                                <Chip 
                                  label={(param as { type: string }).type} 
                                  size="small" 
                                  sx={{ 
                                    background: 'rgba(139, 92, 246, 0.2)',
                                    color: '#8B5CF6',
                                    fontSize: '0.7rem'
                                  }} 
                                />
                                {(param as { required?: boolean }).required && (
                                  <Chip 
                                    label="Required" 
                                    size="small" 
                                    sx={{ 
                                      background: '#ef4444',
                                      color: '#fff',
                                      fontSize: '0.7rem'
                                    }} 
                                  />
                                )}
                              </Box>
                            }
                            secondary={(param as { description: string }).description}
                            sx={{ color: 'rgba(255,255,255,0.8)' }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                  
                  <Box>
                    <Typography variant="h6" sx={{ color: '#fff', mb: 2 }}>
                      Response
                    </Typography>
                    <Box sx={{ 
                      background: 'rgba(0,0,0,0.3)', 
                      color: '#10b981', 
                      p: 2, 
                      borderRadius: 1,
                      fontSize: '0.9rem',
                      display: 'block',
                      fontFamily: 'monospace'
                    }}>
                      {JSON.stringify(selectedEndpoint.response, null, 2)}
                    </Box>
                  </Box>
                </Box>
              )}
            </DialogContent>
            <DialogActions sx={{ p: 3, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              <Button
                onClick={() => setShowEndpointDetails(false)}
                sx={{ color: 'rgba(255,255,255,0.7)' }}
              >
                Schließen
              </Button>
              <Button
                variant="contained"
                startIcon={<Play size={16} />}
                sx={{
                  background: 'linear-gradient(45deg, #10b981, #059669)',
                  color: '#fff',
                  fontWeight: 600
                }}
              >
                Testen
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
      </Box>
    </AccessControl>
  );
}
