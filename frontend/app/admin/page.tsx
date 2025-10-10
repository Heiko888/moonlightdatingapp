"use client";

import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Alert,
  Chip,
  Grid,
  Paper
} from '@mui/material';
import { Crown, Star, Zap, Gift, CheckCircle } from 'lucide-react';
import { SubscriptionService, AdminService } from '../../lib/supabase/services';

export default function AdminPage() {
  const [userId, setUserId] = useState('');
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'package' | 'users' | 'stats'>('package');

  const handleSetPackage = async (packageId: string) => {
    if (!userId.trim()) {
      setResult('❌ Bitte User ID eingeben!');
      return;
    }

    setLoading(true);
    try {
      const success = await SubscriptionService.updateSubscription(userId, packageId);
      if (success) {
        setResult(`✅ ${packageId.toUpperCase()} Paket erfolgreich gesetzt!`);
      } else {
        setResult(`❌ Fehler beim Setzen des ${packageId.toUpperCase()} Pakets!`);
      }
    } catch (error) {
      setResult(`❌ Fehler: ${error}`);
    }
    setLoading(false);
  };

  const loadStats = async () => {
    try {
      const userStats = await AdminService.getUserStats();
      const subscriptionStats = await AdminService.getSubscriptionStats();
      setStats({ userStats, subscriptionStats });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const loadUsers = async () => {
    try {
      const allUsers = await AdminService.getAllUsers();
      setUsers(allUsers);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  React.useEffect(() => {
    if (activeTab === 'stats') {
      loadStats();
    } else if (activeTab === 'users') {
      loadUsers();
    }
  }, [activeTab]);

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: `
        radial-gradient(circle at 20% 20%, rgba(255, 107, 157, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 80% 80%, rgba(78, 205, 196, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 40% 60%, rgba(102, 126, 234, 0.1) 0%, transparent 50%),
        linear-gradient(135deg, #0F0F23 0%, #1A1A2E 100%)
      `,
      position: 'relative',
      overflow: 'hidden'
    }}>
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2, py: { xs: 4, md: 8 }, px: { xs: 1, sm: 2 } }}>
        {/* Header */}
        <Box textAlign="center" mb={6}>
          <Typography 
            variant="h2" 
            sx={{ 
              fontWeight: 'bold', 
              mb: 2,
              background: 'linear-gradient(135deg, #ff6b9d, #4ecdc4)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: { xs: '2.5rem', md: '3.5rem' }
            }}
          >
            🔧 Admin Panel
          </Typography>
          <Typography 
            variant="h5" 
            sx={{ 
              color: 'rgba(255,255,255,0.8)', 
              fontWeight: 300,
              maxWidth: '600px',
              mx: 'auto',
              lineHeight: 1.6
            }}
          >
            Vollständige Admin-Verwaltung
          </Typography>
        </Box>

        {/* Tab Navigation */}
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Button
            variant={activeTab === 'package' ? 'contained' : 'outlined'}
            onClick={() => setActiveTab('package')}
            sx={{
              background: activeTab === 'package' ? 'linear-gradient(45deg, #ff6b9d, #4ecdc4)' : 'transparent',
              borderColor: 'rgba(255,255,255,0.3)',
              color: activeTab === 'package' ? 'white' : 'rgba(255,255,255,0.8)',
              '&:hover': {
                borderColor: '#ff6b9d',
                backgroundColor: activeTab === 'package' ? 'linear-gradient(45deg, #e55a8a, #3bb5b0)' : 'rgba(255, 107, 157, 0.1)'
              }
            }}
          >
            📦 Paket-Management
          </Button>
          <Button
            variant={activeTab === 'users' ? 'contained' : 'outlined'}
            onClick={() => setActiveTab('users')}
            sx={{
              background: activeTab === 'users' ? 'linear-gradient(45deg, #ff6b9d, #4ecdc4)' : 'transparent',
              borderColor: 'rgba(255,255,255,0.3)',
              color: activeTab === 'users' ? 'white' : 'rgba(255,255,255,0.8)',
              '&:hover': {
                borderColor: '#ff6b9d',
                backgroundColor: activeTab === 'users' ? 'linear-gradient(45deg, #e55a8a, #3bb5b0)' : 'rgba(255, 107, 157, 0.1)'
              }
            }}
          >
            👥 User-Verwaltung
          </Button>
          <Button
            variant={activeTab === 'stats' ? 'contained' : 'outlined'}
            onClick={() => setActiveTab('stats')}
            sx={{
              background: activeTab === 'stats' ? 'linear-gradient(45deg, #ff6b9d, #4ecdc4)' : 'transparent',
              borderColor: 'rgba(255,255,255,0.3)',
              color: activeTab === 'stats' ? 'white' : 'rgba(255,255,255,0.8)',
              '&:hover': {
                borderColor: '#ff6b9d',
                backgroundColor: activeTab === 'stats' ? 'linear-gradient(45deg, #e55a8a, #3bb5b0)' : 'rgba(255, 107, 157, 0.1)'
              }
            }}
          >
            📊 Statistiken
          </Button>
        </Box>

        {/* Tab Content */}
        {activeTab === 'package' && (
          <>
            {/* User ID Input */}
            <Card sx={{
              background: 'rgba(255,255,255,0.05)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 4,
              mb: 4
            }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" sx={{ color: '#ff6b9d', mb: 3, fontWeight: 700 }}>
                  👤 User ID eingeben
                </Typography>
                <TextField
                  fullWidth
                  label="User ID"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder="z.B. 123e4567-e89b-12d3-a456-426614174000"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      '& fieldset': {
                        borderColor: 'rgba(255,255,255,0.3)',
                      },
                      '&:hover fieldset': {
                        borderColor: '#ff6b9d',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#ff6b9d',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(255,255,255,0.7)',
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: '#ff6b9d',
                    },
                  }}
                />
              </CardContent>
            </Card>

        {/* Package Buttons */}
        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{
              background: 'rgba(255,255,255,0.05)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 4,
              p: 3,
              textAlign: 'center',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.2)'
              }
            }}>
              <Gift size={40} color="#4ecdc4" style={{ marginBottom: '16px' }} />
              <Typography variant="h6" sx={{ color: 'white', mb: 2, fontWeight: 700 }}>
                FREE
              </Typography>
              <Button
                variant="outlined"
                onClick={() => handleSetPackage('free')}
                disabled={loading}
                sx={{
                  borderColor: '#4ecdc4',
                  color: '#4ecdc4',
                  '&:hover': {
                    borderColor: '#4ecdc4',
                    backgroundColor: 'rgba(78, 205, 196, 0.1)'
                  }
                }}
              >
                Setzen
              </Button>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{
              background: 'rgba(255,255,255,0.05)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 4,
              p: 3,
              textAlign: 'center',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.2)'
              }
            }}>
              <Zap size={40} color="#ff6b9d" style={{ marginBottom: '16px' }} />
              <Typography variant="h6" sx={{ color: 'white', mb: 2, fontWeight: 700 }}>
                BASIC
              </Typography>
              <Button
                variant="outlined"
                onClick={() => handleSetPackage('basic')}
                disabled={loading}
                sx={{
                  borderColor: '#ff6b9d',
                  color: '#ff6b9d',
                  '&:hover': {
                    borderColor: '#ff6b9d',
                    backgroundColor: 'rgba(255, 107, 157, 0.1)'
                  }
                }}
              >
                Setzen
              </Button>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{
              background: 'rgba(255,255,255,0.05)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 4,
              p: 3,
              textAlign: 'center',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.2)'
              }
            }}>
              <Star size={40} color="#ffd700" style={{ marginBottom: '16px' }} />
              <Typography variant="h6" sx={{ color: 'white', mb: 2, fontWeight: 700 }}>
                PREMIUM
              </Typography>
              <Button
                variant="outlined"
                onClick={() => handleSetPackage('premium')}
                disabled={loading}
                sx={{
                  borderColor: '#ffd700',
                  color: '#ffd700',
                  '&:hover': {
                    borderColor: '#ffd700',
                    backgroundColor: 'rgba(255, 215, 0, 0.1)'
                  }
                }}
              >
                Setzen
              </Button>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{
              background: 'rgba(255,255,255,0.05)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 4,
              p: 3,
              textAlign: 'center',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.2)'
              }
            }}>
              <Crown size={40} color="#9c27b0" style={{ marginBottom: '16px' }} />
              <Typography variant="h6" sx={{ color: 'white', mb: 2, fontWeight: 700 }}>
                VIP
              </Typography>
              <Button
                variant="outlined"
                onClick={() => handleSetPackage('vip')}
                disabled={loading}
                sx={{
                  borderColor: '#9c27b0',
                  color: '#9c27b0',
                  '&:hover': {
                    borderColor: '#9c27b0',
                    backgroundColor: 'rgba(156, 39, 176, 0.1)'
                  }
                }}
              >
                Setzen
              </Button>
            </Paper>
          </Grid>
        </Grid>

            {/* Result */}
            {result && (
              <Alert 
                severity={result.includes('✅') ? 'success' : 'error'}
                sx={{ 
                  mb: 3, 
                  borderRadius: 2,
                  background: result.includes('✅') 
                    ? 'rgba(76, 175, 80, 0.1)' 
                    : 'rgba(244, 67, 54, 0.1)',
                  border: result.includes('✅') 
                    ? '1px solid rgba(76, 175, 80, 0.3)' 
                    : '1px solid rgba(244, 67, 54, 0.3)'
                }}
              >
                {result}
              </Alert>
            )}

            {/* Info */}
            <Card sx={{
              background: 'rgba(255,255,255,0.05)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 4
            }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" sx={{ color: '#ff6b9d', mb: 3, fontWeight: 700 }}>
                  ℹ️ Anleitung
                </Typography>
                <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)', mb: 2 }}>
                  1. User ID aus der Supabase Auth Tabelle kopieren
                </Typography>
                <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)', mb: 2 }}>
                  2. User ID in das Feld oben eingeben
                </Typography>
                <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)', mb: 2 }}>
                  3. Gewünschtes Paket auswählen und "Setzen" klicken
                </Typography>
                <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                  4. Das Paket wird sofort aktiviert (1 Jahr Laufzeit)
                </Typography>
              </CardContent>
            </Card>
          </>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <Card sx={{
            background: 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 4,
            mb: 4
          }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" sx={{ color: '#ff6b9d', mb: 3, fontWeight: 700 }}>
                👥 Alle User
              </Typography>
              {users.length > 0 ? (
                <Box sx={{ maxHeight: '400px', overflowY: 'auto' }}>
                  {users.map((user, index) => (
                    <Paper key={user.id} sx={{
                      p: 2,
                      mb: 2,
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: 2
                    }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                          <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                            {user.first_name} {user.last_name}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                            {user.email}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                            ID: {user.user_id}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Chip 
                            label={user.subscription_package || 'free'} 
                            color={user.subscription_package === 'vip' ? 'secondary' : 'primary'}
                            size="small"
                          />
                          {user.is_admin && (
                            <Chip label="Admin" color="error" size="small" />
                          )}
                        </Box>
                      </Box>
                    </Paper>
                  ))}
                </Box>
              ) : (
                <Typography sx={{ color: 'rgba(255,255,255,0.7)', textAlign: 'center', py: 4 }}>
                  Keine User gefunden
                </Typography>
              )}
            </CardContent>
          </Card>
        )}

        {/* Stats Tab */}
        {activeTab === 'stats' && (
          <Grid container spacing={3}>
            {stats?.userStats && (
              <Grid item xs={12} md={6}>
                <Card sx={{
                  background: 'rgba(255,255,255,0.05)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 4
                }}>
                  <CardContent sx={{ p: 4 }}>
                    <Typography variant="h5" sx={{ color: '#ff6b9d', mb: 3, fontWeight: 700 }}>
                      👥 User-Statistiken
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography sx={{ color: 'rgba(255,255,255,0.8)' }}>Gesamt User:</Typography>
                        <Typography sx={{ color: 'white', fontWeight: 600 }}>{stats.userStats.totalUsers}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography sx={{ color: 'rgba(255,255,255,0.8)' }}>Aktive User:</Typography>
                        <Typography sx={{ color: 'white', fontWeight: 600 }}>{stats.userStats.activeUsers}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography sx={{ color: 'rgba(255,255,255,0.8)' }}>Admin User:</Typography>
                        <Typography sx={{ color: 'white', fontWeight: 600 }}>{stats.userStats.adminUsers}</Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            )}

            {stats?.subscriptionStats && (
              <Grid item xs={12} md={6}>
                <Card sx={{
                  background: 'rgba(255,255,255,0.05)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 4
                }}>
                  <CardContent sx={{ p: 4 }}>
                    <Typography variant="h5" sx={{ color: '#ff6b9d', mb: 3, fontWeight: 700 }}>
                      📊 Abonnement-Statistiken
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography sx={{ color: 'rgba(255,255,255,0.8)' }}>Free:</Typography>
                        <Typography sx={{ color: 'white', fontWeight: 600 }}>{stats.subscriptionStats.free}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography sx={{ color: 'rgba(255,255,255,0.8)' }}>Basic:</Typography>
                        <Typography sx={{ color: 'white', fontWeight: 600 }}>{stats.subscriptionStats.basic}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography sx={{ color: 'rgba(255,255,255,0.8)' }}>Premium:</Typography>
                        <Typography sx={{ color: 'white', fontWeight: 600 }}>{stats.subscriptionStats.premium}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography sx={{ color: 'rgba(255,255,255,0.8)' }}>VIP:</Typography>
                        <Typography sx={{ color: 'white', fontWeight: 600 }}>{stats.subscriptionStats.vip}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography sx={{ color: 'rgba(255,255,255,0.8)' }}>Admin:</Typography>
                        <Typography sx={{ color: 'white', fontWeight: 600 }}>{stats.subscriptionStats.admin}</Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            )}
          </Grid>
        )}
      </Container>
    </Box>
  );
}
