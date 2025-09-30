"use client";

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Container,
  Paper,
  Tabs,
  Tab,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from 'recharts';
import {
  TrendingUp,
  Users,
  MessageCircle,
  Heart,
  Calendar,
  Activity,
  Target,
  Zap
} from 'lucide-react';

interface HDAnalyticsData {
  overview: {
    totalUsers: number;
    activeUsers: number;
    totalCharts: number;
    totalReadings: number;
    totalGates: number;
    totalCenters: number;
  };
  userGrowth: Array<{
    date: string;
    users: number;
    newUsers: number;
    activeUsers: number;
  }>;
  chartTypes: Array<{
    type: string;
    count: number;
    percentage: number;
  }>;
  planetActivity: Array<{
    planet: string;
    views: number;
    interactions: number;
  }>;
  gateActivity: Array<{
    gate: number;
    activations: number;
    percentage: number;
  }>;
  centerActivity: Array<{
    center: string;
    defined: number;
    undefined: number;
  }>;
  readingEngagement: Array<{
    date: string;
    readings: number;
    shares: number;
    favorites: number;
  }>;
  userProfiles: Array<{
    type: string;
    count: number;
    percentage: number;
  }>;
  monthlyTrends: Array<{
    month: string;
    readings: number;
    users: number;
    engagement: number;
  }>;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState<HDAnalyticsData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAnalyticsData();
  }, []);

  const loadAnalyticsData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Human Design Analytics Mock-Daten
      const mockData: HDAnalyticsData = {
        overview: {
          totalUsers: 1250,
          activeUsers: 890,
          totalCharts: 3400,
          totalReadings: 15600,
          totalGates: 64,
          totalCenters: 9
        },
        userGrowth: [
          { date: '2024-01', users: 100, newUsers: 20, activeUsers: 80 },
          { date: '2024-02', users: 150, newUsers: 30, activeUsers: 120 },
          { date: '2024-03', users: 200, newUsers: 25, activeUsers: 160 },
          { date: '2024-04', users: 280, newUsers: 40, activeUsers: 220 },
          { date: '2024-05', users: 350, newUsers: 35, activeUsers: 280 },
          { date: '2024-06', users: 450, newUsers: 50, activeUsers: 360 }
        ],
        chartTypes: [
          { type: 'Geburtschart', count: 2800, percentage: 82 },
          { type: 'Transit-Chart', count: 450, percentage: 13 },
          { type: 'Synastrie-Chart', count: 150, percentage: 5 }
        ],
        planetActivity: [
          { planet: 'Sonne', views: 12500, interactions: 3200 },
          { planet: 'Mond', views: 11200, interactions: 2800 },
          { planet: 'Merkur', views: 9800, interactions: 2400 },
          { planet: 'Venus', views: 8900, interactions: 2100 },
          { planet: 'Mars', views: 7600, interactions: 1800 },
          { planet: 'Jupiter', views: 6800, interactions: 1600 },
          { planet: 'Saturn', views: 6200, interactions: 1400 },
          { planet: 'Uranus', views: 5400, interactions: 1200 },
          { planet: 'Neptun', views: 4800, interactions: 1000 },
          { planet: 'Pluto', views: 4200, interactions: 900 }
        ],
        gateActivity: [
          { gate: 1, activations: 450, percentage: 8.2 },
          { gate: 2, activations: 420, percentage: 7.6 },
          { gate: 3, activations: 380, percentage: 6.9 },
          { gate: 4, activations: 360, percentage: 6.5 },
          { gate: 5, activations: 340, percentage: 6.2 },
          { gate: 6, activations: 320, percentage: 5.8 },
          { gate: 7, activations: 300, percentage: 5.4 },
          { gate: 8, activations: 280, percentage: 5.1 },
          { gate: 9, activations: 260, percentage: 4.7 },
          { gate: 10, activations: 240, percentage: 4.4 }
        ],
        centerActivity: [
          { center: 'Kopf', defined: 320, undefined: 930 },
          { center: 'Ajna', defined: 280, undefined: 970 },
          { center: 'Hals', defined: 250, undefined: 1000 },
          { center: 'G', defined: 200, undefined: 1050 },
          { center: 'Herz', defined: 180, undefined: 1070 },
          { center: 'Solarplexus', defined: 160, undefined: 1090 },
          { center: 'Sakral', defined: 140, undefined: 1110 },
          { center: 'Wurzel', defined: 120, undefined: 1130 },
          { center: 'Milz', defined: 100, undefined: 1150 }
        ],
        readingEngagement: [
          { date: '2024-01', readings: 1200, shares: 180, favorites: 95 },
          { date: '2024-02', readings: 1500, shares: 220, favorites: 120 },
          { date: '2024-03', readings: 1800, shares: 260, favorites: 145 },
          { date: '2024-04', readings: 2200, shares: 320, favorites: 170 },
          { date: '2024-05', readings: 2800, shares: 380, favorites: 195 },
          { date: '2024-06', readings: 3500, shares: 450, favorites: 220 }
        ],
        userProfiles: [
          { type: 'Generator', count: 450, percentage: 36 },
          { type: 'Manifestor', count: 200, percentage: 16 },
          { type: 'Projector', count: 300, percentage: 24 },
          { type: 'Reflector', count: 150, percentage: 12 },
          { type: 'Manifesting Generator', count: 150, percentage: 12 }
        ],
        monthlyTrends: [
          { month: 'Jan', readings: 1200, users: 100, engagement: 65 },
          { month: 'Feb', readings: 1500, users: 150, engagement: 70 },
          { month: 'Mär', readings: 1800, users: 200, engagement: 75 },
          { month: 'Apr', readings: 2200, users: 280, engagement: 78 },
          { month: 'Mai', readings: 2800, users: 350, engagement: 82 },
          { month: 'Jun', readings: 3500, users: 450, engagement: 85 }
        ]
      };

      setAnalyticsData(mockData);
    } catch (error) {
      console.error('Error loading analytics data:', error);
      setError('Fehler beim Laden der Analytics-Daten');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress size={48} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Analytics werden geladen...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!analyticsData) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="info">Keine Analytics-Daten verfügbar</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        📊 Human Design Analytics
      </Typography>

      <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label="Übersicht" />
        <Tab label="Charts & Readings" />
        <Tab label="Planeten & Gates" />
        <Tab label="User Types" />
        <Tab label="Trends" />
      </Tabs>

      {/* Tab 0: Übersicht */}
      {activeTab === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Users size={24} color="#3b82f6" />
                  <Typography variant="h6" sx={{ ml: 1 }}>
                    Gesamt Benutzer
                  </Typography>
                </Box>
                <Typography variant="h3" color="primary">
                  {analyticsData.overview.totalUsers.toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Activity size={24} color="#10b981" />
                  <Typography variant="h6" sx={{ ml: 1 }}>
                    Aktive Benutzer
                  </Typography>
                </Box>
                <Typography variant="h3" color="success.main">
                  {analyticsData.overview.activeUsers.toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Target size={24} color="#f59e0b" />
                  <Typography variant="h6" sx={{ ml: 1 }}>
                    Charts erstellt
                  </Typography>
                </Box>
                <Typography variant="h3" color="warning.main">
                  {analyticsData.overview.totalCharts.toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Zap size={24} color="#ef4444" />
                  <Typography variant="h6" sx={{ ml: 1 }}>
                    Readings
                  </Typography>
                </Box>
                <Typography variant="h3" color="error.main">
                  {analyticsData.overview.totalReadings.toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Benutzerwachstum
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={analyticsData.userGrowth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="users" stackId="1" stroke="#8884d8" fill="#8884d8" />
                  <Area type="monotone" dataKey="newUsers" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
                </AreaChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* Tab 1: Charts & Readings */}
      {activeTab === 1 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Chart-Typen
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={analyticsData.chartTypes}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ type, percentage }) => `${type} ${percentage}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {analyticsData.chartTypes.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Reading-Engagement
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analyticsData.readingEngagement}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="readings" fill="#8884d8" />
                  <Bar dataKey="shares" fill="#82ca9d" />
                  <Bar dataKey="favorites" fill="#ffc658" />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* Tab 2: Engagement */}
      {activeTab === 2 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Engagement-Trends
              </Typography>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={analyticsData.engagement}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="messages" stroke="#8884d8" strokeWidth={2} />
                  <Line type="monotone" dataKey="matches" stroke="#82ca9d" strokeWidth={2} />
                  <Line type="monotone" dataKey="sessions" stroke="#ffc658" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* Tab 3: Features */}
      {activeTab === 3 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Feature-Nutzung und Zufriedenheit
              </Typography>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={analyticsData.featureUsage}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="feature" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="usage" fill="#8884d8" name="Nutzung (%)" />
                  <Bar yAxisId="right" dataKey="satisfaction" fill="#82ca9d" name="Zufriedenheit (1-5)" />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* Tab 4: Trends */}
      {activeTab === 4 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Monatliche Trends
              </Typography>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={analyticsData.monthlyTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={2} name="Umsatz (€)" />
                  <Line yAxisId="right" type="monotone" dataKey="users" stroke="#82ca9d" strokeWidth={2} name="Benutzer" />
                  <Line yAxisId="right" type="monotone" dataKey="engagement" stroke="#ffc658" strokeWidth={2} name="Engagement (%)" />
                </LineChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Container>
  );
}
