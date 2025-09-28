"use client";

import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Tooltip,
  Tabs,
  Tab,
  Button,
  Switch,
  FormControlLabel
} from '@mui/material';
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  TrendingDown, 
  Activity,
  Download,
  RotateCcw,
  Users,
  Moon,
  Heart,
  Star,
  Zap,
  Target,
  EyeOff
} from 'lucide-react';
import styles from './AdvancedAnalytics.module.css';

interface AnalyticsData {
  period: string;
  metrics: {
    totalUsers: number;
    activeUsers: number;
    newUsers: number;
    retention: number;
    engagement: number;
    revenue: number;
  };
  charts: {
    userGrowth: Array<{ date: string; users: number }>;
    engagement: Array<{ feature: string; usage: number }>;
    revenue: Array<{ month: string; amount: number }>;
    demographics: Array<{ age: string; count: number }>;
  };
  insights: Array<{
    id: string;
    title: string;
    description: string;
    impact: 'high' | 'medium' | 'low';
    trend: 'up' | 'down' | 'stable';
  }>;
}

interface AdvancedAnalyticsProps {
  data: AnalyticsData;
  onFilterChange: (filters: Record<string, unknown>) => void;
  onExport: (format: 'pdf' | 'csv' | 'json') => void;
  className?: string;
}

const AdvancedAnalytics: React.FC<AdvancedAnalyticsProps> = ({
  data,
  onFilterChange,
  onExport,
  className = ''
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(['users', 'engagement', 'revenue']);
  const [chartType, setChartType] = useState<'bar' | 'line' | 'pie'>('bar');
  const [showInsights, setShowInsights] = useState(true);
  const [isRealTime, setIsRealTime] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const periods = [
    { value: '7d', label: 'Letzte 7 Tage' },
    { value: '30d', label: 'Letzte 30 Tage' },
    { value: '90d', label: 'Letzte 90 Tage' },
    { value: '1y', label: 'Letztes Jahr' },
    { value: 'all', label: 'Alle Zeit' }
  ];

  const metrics = [
    { value: 'users', label: 'Benutzer', icon: <Users size={16} />, color: '#2196F3' },
    { value: 'engagement', label: 'Engagement', icon: <Activity size={16} />, color: '#4CAF50' },
    { value: 'revenue', label: 'Umsatz', icon: <TrendingUp size={16} />, color: '#FF9800' },
    { value: 'retention', label: 'Retention', icon: <Target size={16} />, color: '#9C27B0' },
    { value: 'moon', label: 'Mondkalender', icon: <Moon size={16} />, color: '#673AB7' },
    { value: 'dating', label: 'Dating', icon: <Heart size={16} />, color: '#E91E63' }
  ];

  const chartTypes = [
    { value: 'bar', label: 'Balkendiagramm', icon: <BarChart3 size={16} /> },
    { value: 'line', label: 'Liniendiagramm', icon: <TrendingUp size={16} /> },
    { value: 'pie', label: 'Kreisdiagramm', icon: <PieChart size={16} /> }
  ];

  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period);
    onFilterChange({ period, metrics: selectedMetrics, chartType, realTime: isRealTime });
  };

  const handleMetricToggle = (metric: string) => {
    const newMetrics = selectedMetrics.includes(metric)
      ? selectedMetrics.filter(m => m !== metric)
      : [...selectedMetrics, metric];
    setSelectedMetrics(newMetrics);
    onFilterChange({ period: selectedPeriod, metrics: newMetrics, chartType, realTime: isRealTime });
  };

  const handleChartTypeChange = (type: 'bar' | 'line' | 'pie') => {
    setChartType(type);
    onFilterChange({ period: selectedPeriod, metrics: selectedMetrics, chartType: type, realTime: isRealTime });
  };

  const handleExport = (format: 'pdf' | 'csv' | 'json') => {
    onExport(format);
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return '#4CAF50';
      case 'medium': return '#FF9800';
      case 'low': return '#757575';
      default: return '#757575';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp size={16} />;
      case 'down': return <TrendingDown size={16} />;
      default: return <Activity size={16} />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return '#4CAF50';
      case 'down': return '#f44336';
      default: return '#757575';
    }
  };

  return (
    <Box className={`${styles.advancedAnalytics} ${className}`}>
      {/* Header mit Filtern */}
      <Card className={styles.analyticsHeader}>
          <CardContent>
            <Box className={styles.headerTop}>
              <Box className={styles.headerLeft}>
                <Typography variant="h4" className={styles.headerTitle}>
                  Advanced Analytics
                </Typography>
                <Typography variant="body2" className={styles.headerSubtitle}>
                  Detaillierte Einblicke in deine Human Design App
                </Typography>
              </Box>
              
              <Box className={styles.headerControls}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={isRealTime}
                      onChange={(e) => setIsRealTime(e.target.checked)}
                      color="secondary"
                    />
                  }
                  label="Echtzeit"
                />
                
                <Tooltip title="Daten aktualisieren">
                  <IconButton className={styles.refreshButton}>
                    <RotateCcw className={styles.refreshIcon} />
                  </IconButton>
                </Tooltip>
                
                <Button
                  variant="outlined"
                  startIcon={<Download size={16} />}
                  onClick={() => handleExport('pdf')}
                  className={styles.exportButton}
                >
                  Export
                </Button>
              </Box>
            </Box>
            
            <Box className={styles.filtersRow}>
              <FormControl className={styles.periodFilter}>
                <InputLabel>Zeitraum</InputLabel>
                <Select
                  value={selectedPeriod}
                  onChange={(e) => handlePeriodChange(e.target.value)}
                  label="Zeitraum"
                >
                  {periods.map(period => (
                    <MenuItem key={period.value} value={period.value}>
                      {period.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <Box className={styles.metricsFilter}>
                <Typography variant="body2" className={styles.filterLabel}>
                  Metriken:
                </Typography>
                <Box className={styles.metricsChips}>
                  {metrics.map(metric => (
                    <Chip
                      key={metric.value}
                      icon={metric.icon}
                      label={metric.label}
                      onClick={() => handleMetricToggle(metric.value)}
                      className={`${styles.metricChip} ${selectedMetrics.includes(metric.value) ? styles.selected : ''}`}
                      style={{ 
                        backgroundColor: selectedMetrics.includes(metric.value) ? metric.color : 'transparent',
                        color: selectedMetrics.includes(metric.value) ? 'white' : metric.color,
                        borderColor: metric.color
                      }}
                    />
                  ))}
                </Box>
              </Box>
              
              <Box className={styles.chartTypeFilter}>
                <Typography variant="body2" className={styles.filterLabel}>
                  Diagramm-Typ:
                </Typography>
                <Box className={styles.chartTypeButtons}>
                  {chartTypes.map(type => (
                    <Button
                      key={type.value}
                      variant={chartType === type.value ? 'contained' : 'outlined'}
                      startIcon={type.icon}
                      onClick={() => handleChartTypeChange(type.value as 'bar' | 'line' | 'pie')}
                      className={styles.chartTypeButton}
                    >
                      {type.label}
                    </Button>
                  ))}
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>

      {/* Tabs für verschiedene Ansichten */}
      <Card className={styles.tabsCard}>
          <Tabs
            value={activeTab}
            onChange={(e, newValue) => setActiveTab(newValue)}
            className={styles.analyticsTabs}
          >
            <Tab label="Übersicht" icon={<BarChart3 size={16} />} />
            <Tab label="Benutzer" icon={<Users size={16} />} />
            <Tab label="Engagement" icon={<Activity size={16} />} />
            <Tab label="Umsatz" icon={<TrendingUp size={16} />} />
            <Tab label="Insights" icon={<Target size={16} />} />
          </Tabs>
        </Card>

      {/* Tab Content */}
      <Box className={styles.tabContent}>
        {activeTab === 0 && (
          <Grid container spacing={3}>
            {/* Key Metrics */}
            {[
              { key: 'totalUsers', label: 'Gesamt Benutzer', value: data.metrics.totalUsers, icon: <Users size={24} />, color: '#2196F3' },
              { key: 'activeUsers', label: 'Aktive Benutzer', value: data.metrics.activeUsers, icon: <Activity size={24} />, color: '#4CAF50' },
              { key: 'newUsers', label: 'Neue Benutzer', value: data.metrics.newUsers, icon: <Star size={24} />, color: '#FF9800' },
              { key: 'retention', label: 'Retention Rate', value: `${data.metrics.retention}%`, icon: <Target size={24} />, color: '#9C27B0' },
              { key: 'engagement', label: 'Engagement', value: `${data.metrics.engagement}%`, icon: <Zap size={24} />, color: '#E91E63' },
              { key: 'revenue', label: 'Umsatz', value: `€${data.metrics.revenue.toLocaleString()}`, icon: <TrendingUp size={24} />, color: '#4CAF50' }
            ].map((metric) => (
              <Grid item xs={12} sm={6} md={4} key={metric.key}>
                <Card className={styles.metricCard}>
                      <CardContent>
                        <Box className={styles.metricHeader}>
                          <Box 
                            className={styles.metricIcon}
                            style={{ color: metric.color }}
                          >
                            {metric.icon}
                          </Box>
                          <Typography variant="h4" className={styles.metricValue}>
                            {metric.value}
                          </Typography>
                        </Box>
                        <Typography variant="body2" className={styles.metricLabel}>
                          {metric.label}
                        </Typography>
                        <Box className={styles.metricTrend}>
                          <TrendingUp className={styles.trendIcon} />
                          <Typography variant="caption" className={styles.trendText}>
                            +{Math.floor(Math.random() * 20) + 1}%
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {activeTab === 4 && showInsights && (
          <Card className={styles.insightsCard}>
              <CardContent>
                <Box className={styles.insightsHeader}>
                  <Typography variant="h6" className={styles.insightsTitle}>
                    KI-Insights & Empfehlungen
                  </Typography>
                  <IconButton onClick={() => setShowInsights(false)}>
                    <EyeOff size={16} />
                  </IconButton>
                </Box>
                
                <Box className={styles.insightsList}>
                  {data.insights.map((insight) => (
                    <Box key={insight.id} className={styles.insightItem}>
                        <Box className={styles.insightHeader}>
                          <Box className={styles.insightIcon}>
                            {getTrendIcon(insight.trend)}
                          </Box>
                          <Typography variant="subtitle1" className={styles.insightTitle}>
                            {insight.title}
                          </Typography>
                          <Chip 
                            label={insight.impact}
                            size="small"
                            className={styles.impactChip}
                            style={{ backgroundColor: getImpactColor(insight.impact) }}
                          />
                        </Box>
                        <Typography variant="body2" className={styles.insightDescription}>
                          {insight.description}
                        </Typography>
                        <Box className={styles.insightTrend}>
                          <Box 
                            className={styles.trendIndicator}
                            style={{ color: getTrendColor(insight.trend) }}
                          >
                            {getTrendIcon(insight.trend)}
                          </Box>
                          <Typography variant="caption" className={styles.trendText}>
                            {insight.trend === 'up' ? 'Steigend' : insight.trend === 'down' ? 'Fallend' : 'Stabil'}
                          </Typography>
                        </Box>
                      </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
        )}
      </Box>
    </Box>
  );
};

export default AdvancedAnalytics;
