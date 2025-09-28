"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Chip, 
  Avatar,
  IconButton,
  Tooltip,
  Badge,
  LinearProgress
} from '@mui/material';
import { 
  Wifi, 
  WifiOff, 
  RotateCcw, 
  Activity, 
  Users, 
  MessageCircle,
  Heart,
  Moon,
  Bell,
  TrendingUp,
  Clock,
  Globe,
  Signal
} from 'lucide-react';
import styles from './LiveDashboard.module.css';

interface LiveData {
  id: string;
  type: 'activity' | 'notification' | 'match' | 'moon' | 'community';
  title: string;
  message: string;
  timestamp: Date;
  user?: {
    name: string;
    avatar?: string;
  };
  metadata?: Record<string, unknown>;
}

interface LiveStats {
  onlineUsers: number;
  activeChats: number;
  newMatches: number;
  moonPhases: number;
  communityPosts: number;
}

interface LiveDashboardProps {
  onDataUpdate: (data: LiveData[]) => void;
  onStatsUpdate: (stats: LiveStats) => void;
  className?: string;
}

const LiveDashboard: React.FC<LiveDashboardProps> = ({
  onDataUpdate,
  onStatsUpdate,
  className = ''
}) => {
  const [isConnected] = useState(true);
  const [connectionQuality] = useState<'excellent' | 'good' | 'poor' | 'offline'>('excellent');
  const [liveData, setLiveData] = useState<LiveData[]>([]);
  const [liveStats, setLiveStats] = useState<LiveStats>({
    onlineUsers: 0,
    activeChats: 0,
    newMatches: 0,
    moonPhases: 0,
    communityPosts: 0
  });
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [isUpdating, setIsUpdating] = useState(false);

  // Simuliere WebSocket-Verbindung
  useEffect(() => {
    const interval = setInterval(() => {
      // Simuliere Live-Daten
      const newData: LiveData[] = [
        {
          id: `live-${Date.now()}`,
          type: 'activity',
          title: 'Neue Aktivität',
          message: 'Benutzer hat einen Mondkalender-Eintrag erstellt',
          timestamp: new Date(),
          user: {
            name: 'Maria Schmidt',
            avatar: '/avatars/maria.jpg'
          }
        },
        {
          id: `match-${Date.now()}`,
          type: 'match',
          title: 'Neues Match!',
          message: 'Du hast ein neues Match gefunden',
          timestamp: new Date(),
          user: {
            name: 'Alex Weber',
            avatar: '/avatars/alex.jpg'
          }
        },
        {
          id: `moon-${Date.now()}`,
          type: 'moon',
          title: 'Mondphase Update',
          message: 'Vollmond erreicht - 98% Beleuchtung',
          timestamp: new Date()
        }
      ];

      setLiveData(prevData => [...newData, ...prevData].slice(0, 10));
      setLastUpdate(new Date());
      onDataUpdate(newData);
    }, 5000);

    return () => clearInterval(interval);
  }, [onDataUpdate]);

  // Simuliere Live-Statistiken
  useEffect(() => {
    const statsInterval = setInterval(() => {
      setLiveStats(() => ({
        onlineUsers: Math.floor(Math.random() * 50) + 100,
        activeChats: Math.floor(Math.random() * 20) + 5,
        newMatches: Math.floor(Math.random() * 10) + 1,
        moonPhases: Math.floor(Math.random() * 5) + 1,
        communityPosts: Math.floor(Math.random() * 30) + 10
      }));
      onStatsUpdate(liveStats);
    }, 10000);

    return () => clearInterval(statsInterval);
  }, [liveStats, onStatsUpdate]);

  const handleRefresh = useCallback(async () => {
    setIsUpdating(true);
    
    // Simuliere API-Aufruf
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setLastUpdate(new Date());
    setIsUpdating(false);
  }, []);

  const getConnectionIcon = () => {
    switch (connectionQuality) {
      case 'excellent': return <Wifi className={styles.connectionIcon} />;
      case 'good': return <Signal className={styles.connectionIcon} />;
      case 'poor': return <WifiOff className={styles.connectionIcon} />;
      default: return <WifiOff className={styles.connectionIcon} />;
    }
  };

  const getConnectionColor = () => {
    switch (connectionQuality) {
      case 'excellent': return '#4CAF50';
      case 'good': return '#FF9800';
      case 'poor': return '#f44336';
      default: return '#757575';
    }
  };

  const getLiveDataIcon = (type: string) => {
    switch (type) {
      case 'activity': return <Activity size={16} />;
      case 'notification': return <Bell size={16} />;
      case 'match': return <Heart size={16} />;
      case 'moon': return <Moon size={16} />;
      case 'community': return <Users size={16} />;
      default: return <Activity size={16} />;
    }
  };

  const getLiveDataColor = (type: string) => {
    switch (type) {
      case 'activity': return '#2196F3';
      case 'notification': return '#FF9800';
      case 'match': return '#E91E63';
      case 'moon': return '#9C27B0';
      case 'community': return '#4CAF50';
      default: return '#757575';
    }
  };

  return (
    <Box className={`${styles.liveDashboard} ${className}`}>
      {/* Connection Status */}
      <Card className={styles.connectionCard}>
          <CardContent>
            <Box className={styles.connectionHeader}>
              <Box className={styles.connectionInfo}>
                <Box 
                  className={styles.connectionIcon}
                  style={{ color: getConnectionColor() }}
                >
                  {getConnectionIcon()}
                </Box>
                <Box className={styles.connectionDetails}>
                  <Typography variant="h6" className={styles.connectionTitle}>
                    {isConnected ? 'Live-Verbindung' : 'Offline'}
                  </Typography>
                  <Typography variant="body2" className={styles.connectionSubtitle}>
                    {isConnected ? 'Echtzeit-Updates aktiv' : 'Verbindung unterbrochen'}
                  </Typography>
                </Box>
              </Box>
              
              <Box className={styles.connectionControls}>
                <Tooltip title="Manuell aktualisieren">
                  <IconButton 
                    onClick={handleRefresh}
                    disabled={isUpdating}
                    className={styles.refreshButton}
                  >
                    <RotateCcw className={`${styles.refreshIcon} ${isUpdating ? styles.spinning : ''}`} />
                  </IconButton>
                </Tooltip>
                
                <Chip 
                  icon={<Clock size={14} />}
                  label={lastUpdate.toLocaleTimeString('de-DE')}
                  size="small"
                  className={styles.lastUpdateChip}
                />
              </Box>
            </Box>
            
            {isConnected && (
              <Box className={styles.connectionQuality}>
                <LinearProgress 
                  variant="determinate" 
                  value={connectionQuality === 'excellent' ? 100 : connectionQuality === 'good' ? 75 : 25}
                  className={styles.qualityBar}
                />
                <Typography variant="caption" className={styles.qualityText}>
                  Verbindungsqualität: {connectionQuality === 'excellent' ? 'Ausgezeichnet' : 
                                      connectionQuality === 'good' ? 'Gut' : 'Schlecht'}
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>

      {/* Live Statistics */}
      <Box className={styles.liveStatsGrid}>
        {[
          { key: 'onlineUsers', label: 'Online Benutzer', icon: <Users size={20} />, color: '#4CAF50' },
          { key: 'activeChats', label: 'Aktive Chats', icon: <MessageCircle size={20} />, color: '#2196F3' },
          { key: 'newMatches', label: 'Neue Matches', icon: <Heart size={20} />, color: '#E91E63' },
          { key: 'moonPhases', label: 'Mondphasen', icon: <Moon size={20} />, color: '#9C27B0' },
          { key: 'communityPosts', label: 'Community Posts', icon: <Globe size={20} />, color: '#FF9800' }
        ].map((stat) => (
          <Card key={stat.key} className={styles.statCard}>
                <CardContent>
                  <Box className={styles.statHeader}>
                    <Box 
                      className={styles.statIcon}
                      style={{ color: stat.color }}
                    >
                      {stat.icon}
                    </Box>
                    <Typography variant="h4" className={styles.statValue}>
                      {liveStats[stat.key as keyof LiveStats]}
                    </Typography>
                  </Box>
                  <Typography variant="body2" className={styles.statLabel}>
                    {stat.label}
                  </Typography>
                  <Box className={styles.statTrend}>
                    <TrendingUp className={styles.trendIcon} />
                    <Typography variant="caption" className={styles.trendText}>
                      +{Math.floor(Math.random() * 10) + 1}%
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
        ))}
      </Box>

      {/* Live Data Feed */}
      <Card className={styles.liveFeedCard}>
          <CardContent>
            <Box className={styles.feedHeader}>
              <Box className={styles.feedTitle}>
                <Activity className={styles.feedIcon} />
                <Typography variant="h6" className={styles.feedTitleText}>
                  Live-Aktivitäten
                </Typography>
              </Box>
              <Badge badgeContent={liveData.length} color="secondary">
                <Bell className={styles.feedBadge} />
              </Badge>
            </Box>
            
            <Box className={styles.liveFeed}>
              {liveData.map((data) => (
                <Box key={data.id} className={styles.liveItem}>
                    <Box 
                      className={styles.liveItemIcon}
                      style={{ color: getLiveDataColor(data.type) }}
                    >
                      {getLiveDataIcon(data.type)}
                    </Box>
                    
                    <Box className={styles.liveItemContent}>
                      <Typography variant="subtitle2" className={styles.liveItemTitle}>
                        {data.title}
                      </Typography>
                      <Typography variant="body2" className={styles.liveItemMessage}>
                        {data.message}
                      </Typography>
                      <Typography variant="caption" className={styles.liveItemTime}>
                        {data.timestamp.toLocaleTimeString('de-DE')}
                      </Typography>
                    </Box>
                    
                    {data.user && (
                      <Avatar className={styles.liveItemAvatar}>
                        {data.user.name.charAt(0)}
                      </Avatar>
                    )}
                  </Box>
              ))}
            </Box>
          </CardContent>
        </Card>
    </Box>
  );
};

export default LiveDashboard;
