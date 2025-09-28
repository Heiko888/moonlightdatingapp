"use client";

import React, { useState, useRef } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  IconButton,
  Menu,
  MenuItem,
  Chip,
  Tooltip,
  Slide
} from '@mui/material';
import { 
  MoreVertical, 
  Settings, 
  Maximize2, 
  Minimize2, 
  X,
  GripVertical,
  Star,
  TrendingUp,
  Users,
  Calendar,
  Activity
} from 'lucide-react';
import styles from './DashboardWidget.module.css';

interface WidgetData {
  id: string;
  title: string;
  type: 'chart' | 'stats' | 'activity' | 'calendar' | 'social';
  size: 'small' | 'medium' | 'large';
  position: { x: number; y: number };
  data: Array<Record<string, unknown>> | Record<string, unknown>;
  config: Record<string, unknown>;
}

interface DashboardWidgetProps {
  widget: WidgetData;
  onRemove: (id: string) => void;
  onResize: (id: string, size: 'small' | 'medium' | 'large') => void;
  isDragging?: boolean;
  isResizing?: boolean;
}

const DashboardWidget: React.FC<DashboardWidgetProps> = ({
  widget,
  onRemove,
  onResize,
  isDragging = false,
  isResizing = false
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const widgetRef = useRef<HTMLDivElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleFavorite = () => {
    setIsFavorited(!isFavorited);
    handleMenuClose();
  };

  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
    handleMenuClose();
  };

  const handleRemove = () => {
    onRemove(widget.id);
    handleMenuClose();
  };

  const handleResize = (newSize: 'small' | 'medium' | 'large') => {
    onResize(widget.id, newSize);
    handleMenuClose();
  };

  const getWidgetIcon = (type: string) => {
    switch (type) {
      case 'chart': return <TrendingUp size={20} />;
      case 'stats': return <Activity size={20} />;
      case 'activity': return <Calendar size={20} />;
      case 'calendar': return <Calendar size={20} />;
      case 'social': return <Users size={20} />;
      default: return <Activity size={20} />;
    }
  };

  const getWidgetContent = () => {
    if (isMinimized) {
      return (
        <Box className={styles.minimizedContent}>
          <Box className={styles.minimizedIcon}>
            {getWidgetIcon(widget.type)}
          </Box>
          <Typography variant="caption" className={styles.minimizedTitle}>
            {widget.title}
          </Typography>
        </Box>
      );
    }

    switch (widget.type) {
      case 'chart':
        return (
          <Box className={styles.chartContent}>
            <Box className={styles.chartHeader}>
              <Typography variant="h6" className={styles.chartTitle}>
                {widget.title}
              </Typography>
              <Box className={styles.chartStats}>
                <Chip 
                  icon={<TrendingUp size={14} />}
                  label="+12%"
                  size="small"
                  className={styles.trendChip}
                />
              </Box>
            </Box>
            <Box className={styles.chartVisualization}>
              {/* Placeholder für Chart */}
              <Box className={styles.chartPlaceholder}>
                <TrendingUp className={styles.chartIcon} />
                <Typography variant="body2" className={styles.chartText}>
                  Interaktive Datenvisualisierung
                </Typography>
              </Box>
            </Box>
          </Box>
        );

      case 'stats':
        return (
          <Box className={styles.statsContent}>
            <Box className={styles.statsHeader}>
              <Typography variant="h6" className={styles.statsTitle}>
                {widget.title}
              </Typography>
            </Box>
            <Box className={styles.statsGrid}>
              {Array.isArray(widget.data) && widget.data.map((stat: Record<string, unknown>, index: number) => (
                <Box key={index} className={styles.statItem}>
                    <Box className={styles.statIcon}>
                      {stat.icon as React.ReactNode}
                    </Box>
                    <Box className={styles.statContent}>
                      <Typography variant="h4" className={styles.statValue}>
                        {String(stat.value)}
                      </Typography>
                      <Typography variant="caption" className={styles.statLabel}>
                        {String(stat.label)}
                      </Typography>
                    </Box>
                  </Box>
              ))}
            </Box>
          </Box>
        );

      case 'activity':
        return (
          <Box className={styles.activityContent}>
            <Box className={styles.activityHeader}>
              <Typography variant="h6" className={styles.activityTitle}>
                {widget.title}
              </Typography>
            </Box>
            <Box className={styles.activityList}>
              {Array.isArray(widget.data) && widget.data.map((activity: Record<string, unknown>, index: number) => (
                <Box key={index} className={styles.activityItem}>
                    <Box className={styles.activityIcon}>
                      {activity.icon as React.ReactNode}
                    </Box>
                    <Box className={styles.activityDetails}>
                      <Typography variant="body2" className={styles.activityText}>
                        {String(activity.text)}
                      </Typography>
                      <Typography variant="caption" className={styles.activityTime}>
                        {String(activity.time)}
                      </Typography>
                    </Box>
                  </Box>
              ))}
            </Box>
          </Box>
        );

      default:
        return (
          <Box className={styles.defaultContent}>
            <Typography variant="h6" className={styles.defaultTitle}>
              {widget.title}
            </Typography>
            <Typography variant="body2" className={styles.defaultText}>
              Widget-Inhalt wird geladen...
            </Typography>
          </Box>
        );
    }
  };

  return (
    <Slide direction="up" in={true} timeout={800}>
      <Card 
        ref={widgetRef}
        className={`${styles.widgetCard} ${styles[widget.size]} ${isDragging ? styles.dragging : ''} ${isResizing ? styles.resizing : ''} ${isMinimized ? styles.minimized : ''}`}
        style={{
          gridColumn: `span ${widget.size === 'small' ? 1 : widget.size === 'medium' ? 2 : 3}`,
          gridRow: `span ${widget.size === 'small' ? 1 : widget.size === 'medium' ? 2 : 3}`
        }}
      >
        <CardContent className={styles.widgetContent}>
          {/* Widget Header */}
          <Box className={styles.widgetHeader}>
            <Box className={styles.widgetTitle}>
              <Box className={styles.widgetIcon}>
                {getWidgetIcon(widget.type)}
              </Box>
              <Typography variant="h6" className={styles.widgetTitleText}>
                {widget.title}
              </Typography>
              {isFavorited && (
                <Star className={styles.favoriteIcon} size={16} />
              )}
            </Box>
            
            <Box className={styles.widgetControls}>
              <Tooltip title="Favorisieren">
                <IconButton 
                  size="small"
                  onClick={handleFavorite}
                  className={`${styles.controlButton} ${isFavorited ? styles.favorited : ''}`}
                >
                  <Star size={16} />
                </IconButton>
              </Tooltip>
              
              <Tooltip title="Minimieren/Maximieren">
                <IconButton 
                  size="small"
                  onClick={handleMinimize}
                  className={styles.controlButton}
                >
                  {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
                </IconButton>
              </Tooltip>
              
              <Tooltip title="Einstellungen">
                <IconButton 
                  size="small"
                  onClick={handleMenuOpen}
                  className={styles.controlButton}
                >
                  <MoreVertical size={16} />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          {/* Widget Content */}
          <Box className={styles.widgetBody}>
            {getWidgetContent()}
          </Box>

          {/* Drag Handle */}
          <Box className={styles.dragHandle}>
            <GripVertical className={styles.dragIcon} />
          </Box>
        </CardContent>

        {/* Widget Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          className={styles.widgetMenu}
        >
          <MenuItem onClick={() => handleResize('small')}>
            <Settings size={16} />
            Klein
          </MenuItem>
          <MenuItem onClick={() => handleResize('medium')}>
            <Settings size={16} />
            Mittel
          </MenuItem>
          <MenuItem onClick={() => handleResize('large')}>
            <Settings size={16} />
            Groß
          </MenuItem>
          <MenuItem onClick={handleRemove}>
            <X size={16} />
            Entfernen
          </MenuItem>
        </Menu>
      </Card>
    </Slide>
  );
};

export default DashboardWidget;
