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

interface AnalyticsData {
  overview: {
    totalUsers: number;
    activeUsers: number;
    totalMessages: number;
    totalMatches: number;
    totalSessions: number;
    engagementRate: number;
  };
  userGrowth: Array<{
    date: string;
    users: number;
    newUsers: number;
    activeUsers: number;
  }>;
  engagement: Array<{
    date: string;
    messages: number;
    matches: number;
    sessions: number;
  }>;
  userTypes: Array<{
    type: string;
    count: number;
    percentage: number;
  }>;
  featureUsage: Array<{
    feature: string;
    usage: number;
    satisfaction: number;
  }>;
  monthlyTrends: Array<{
    month: string;
    revenue: number;
    users: number;
    engagement: number;
  }>;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAnalyticsData();
  }, []);

  const loadAnalyticsData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Mock-Daten für Demo
      const mockData: AnalyticsData = {
        overview: {
          totalUsers: 1250,
          activeUsers: 890,
          totalMessages: 15600,
          totalMatches: 340,
          totalSessions: 1200,
          engagementRate: 78.5
        },
        userGrowth: [
          { date: '2024-01', users: 100, newUsers: 20, activeUsers: 80 },
          { date: '2024-02', users: 150, newUsers: 30, activeUsers: 120 },
          { date: '2024-03', users: 200, newUsers: 25, activeUsers: 160 },
          { date: '2024-04', users: 280, newUsers: 40, activeUsers: 220 },
          { date: '2024-05', users: 350, newUsers: 35, activeUsers: 280 },
          { date: '2024-06', users: 450, newUsers: 50, activeUsers: 360 }
        ],
        engagement: [
          { date: '2024-01', messages: 1200, matches: 25, sessions: 180 },
          { date: '2024-02', messages: 1500, matches: 30, sessions: 220 },
          { date: '2024-03', messages: 1800, matches: 35, sessions: 260 },
          { date: '2024-04', messages: 2200, matches: 40, sessions: 320 },
          { date: '2024-05', messages: 2800, matches: 45, sessions: 380 },
          { date: '2024-06', messages: 3500, matches: 50, sessions: 450 }
        ],
        userTypes: [
          { type: 'Generator', count: 450, percentage: 36 },
          { type: 'Manifestor', count: 200, percentage: 16 },
          { type: 'Projector', count: 300, percentage: 24 },
          { type: 'Reflector', count: 150, percentage: 12 },
          { type: 'Manifesting Generator', count: 150, percentage: 12 }
        ],
        featureUsage: [
          { feature: 'Dashboard', usage: 95, satisfaction: 4.2 },
          { feature: 'Chat', usage: 78, satisfaction: 4.5 },
          { feature: 'Dating', usage: 65, satisfaction: 4.1 },
          { feature: 'Mondkalender', usage: 45, satisfaction: 4.3 },
          { feature: 'Coaching', usage: 30, satisfaction: 4.7 }
        ],
        monthlyTrends: [
          { month: 'Jan', revenue: 2500, users: 100, engagement: 65 },
          { month: 'Feb', revenue: 3200, users: 150, engagement: 70 },
          { month: 'Mär', revenue: 4100, users: 200, engagement: 75 },
          { month: 'Apr', revenue: 5200, users: 280, engagement: 78 },
          { month: 'Mai', revenue: 6800, users: 350, engagement: 82 },
          { month: 'Jun', revenue: 8500, users: 450, engagement: 85 }
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
        📊 Analytics Dashboard
      </Typography>

      <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label="Übersicht" />
        <Tab label="Benutzer" />
        <Tab label="Engagement" />
        <Tab label="Features" />
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
                  <MessageCircle size={24} color="#f59e0b" />
                  <Typography variant="h6" sx={{ ml: 1 }}>
                    Nachrichten
                  </Typography>
                </Box>
                <Typography variant="h3" color="warning.main">
                  {analyticsData.overview.totalMessages.toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Heart size={24} color="#ef4444" />
                  <Typography variant="h6" sx={{ ml: 1 }}>
                    Matches
                  </Typography>
                </Box>
                <Typography variant="h3" color="error.main">
                  {analyticsData.overview.totalMatches.toLocaleString()}
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

      {/* Tab 1: Benutzer */}
      {activeTab === 1 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Human Design Typen
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={analyticsData.userTypes}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ type, percentage }) => `${type} ${percentage}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {analyticsData.userTypes.map((entry, index) => (
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
                Benutzeraktivität
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analyticsData.engagement}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="messages" fill="#8884d8" />
                  <Bar dataKey="matches" fill="#82ca9d" />
                  <Bar dataKey="sessions" fill="#ffc658" />
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
