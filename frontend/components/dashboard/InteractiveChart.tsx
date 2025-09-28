"use client";

import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  IconButton,
  Tooltip,
  Chip
} from '@mui/material';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  PieChart, 
  Activity,
  Zap
} from 'lucide-react';
import styles from './InteractiveChart.module.css';

interface ChartData {
  name: string;
  value: number;
  color: string;
  icon: React.ReactNode;
  trend: 'up' | 'down' | 'stable';
  trendValue: number;
}

interface InteractiveChartProps {
  title: string;
  data: ChartData[];
  type?: 'bar' | 'pie' | 'line';
  className?: string;
}

const InteractiveChart: React.FC<InteractiveChartProps> = ({ 
  title, 
  data, 
  type = 'bar',
  className = '' 
}) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [animationProgress, setAnimationProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationProgress(1);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const maxValue = Math.max(...data.map(item => item.value));
  const totalValue = data.reduce((sum, item) => sum + item.value, 0);

  const renderBarChart = () => (
    <Box className={styles.chartContainer}>
      {data.map((item, index) => (
        <Box 
          key={item.name}
          className={`${styles.barItem} ${activeIndex === index ? styles.active : ''} ${hoveredIndex === index ? styles.hovered : ''}`}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
          onClick={() => setActiveIndex(activeIndex === index ? null : index)}
          style={{
            '--bar-height': `${(item.value / maxValue) * 100}%`,
            '--bar-color': item.color,
            '--animation-delay': `${index * 0.1}s`
          } as React.CSSProperties}
        >
            <Box className={styles.bar}>
              <Box className={styles.barFill} />
              <Box className={styles.barValue}>
                {item.value}
              </Box>
            </Box>
            <Box className={styles.barLabel}>
              <Box className={styles.barIcon}>
                {item.icon}
              </Box>
              <Typography variant="caption" className={styles.barName}>
                {item.name}
              </Typography>
              <Box className={styles.trendIndicator}>
                {item.trend === 'up' ? (
                  <TrendingUp className={styles.trendIcon} />
                ) : item.trend === 'down' ? (
                  <TrendingDown className={styles.trendIcon} />
                ) : (
                  <Activity className={styles.trendIcon} />
                )}
                <Typography variant="caption" className={styles.trendValue}>
                  {item.trendValue}%
                </Typography>
              </Box>
            </Box>
          </Box>
      ))}
    </Box>
  );

  const renderPieChart = () => (
    <Box className={styles.pieContainer}>
      <Box className={styles.pieChart}>
        {data.map((item, index) => {
          const percentage = (item.value / totalValue) * 100;
          const angle = (data.slice(0, index).reduce((sum, d) => sum + d.value, 0) / totalValue) * 360;
          
          return (
            <Box 
              key={item.name}
              className={`${styles.pieSegment} ${activeIndex === index ? styles.active : ''}`}
                style={{
                  '--segment-angle': `${angle}deg`,
                  '--segment-percentage': `${percentage}%`,
                  '--segment-color': item.color,
                  '--animation-delay': `${index * 0.1}s`
                } as React.CSSProperties}
                onClick={() => setActiveIndex(activeIndex === index ? null : index)}
              />
          );
        })}
      </Box>
      <Box className={styles.pieLegend}>
        {data.map((item, index) => (
          <Box 
            key={item.name}
            className={`${styles.legendItem} ${activeIndex === index ? styles.active : ''}`}
              onClick={() => setActiveIndex(activeIndex === index ? null : index)}
            >
              <Box 
                className={styles.legendColor}
                style={{ backgroundColor: item.color }}
              />
              <Box className={styles.legendContent}>
                <Typography variant="body2" className={styles.legendName}>
                  {item.name}
                </Typography>
                <Typography variant="caption" className={styles.legendValue}>
                  {item.value} ({((item.value / totalValue) * 100).toFixed(1)}%)
                </Typography>
              </Box>
              <Box className={styles.trendIndicator}>
                {item.trend === 'up' ? (
                  <TrendingUp className={styles.trendIcon} />
                ) : item.trend === 'down' ? (
                  <TrendingDown className={styles.trendIcon} />
                ) : (
                  <Activity className={styles.trendIcon} />
                )}
                <Typography variant="caption" className={styles.trendValue}>
                  {item.trendValue}%
                </Typography>
              </Box>
            </Box>
        ))}
      </Box>
    </Box>
  );

  return (
    <Card className={`${styles.chartCard} ${className}`}>
      <CardContent>
        <Box className={styles.chartHeader}>
          <Box className={styles.chartTitle}>
            <Box className={styles.chartIcon}>
              {type === 'bar' ? <BarChart3 /> : type === 'pie' ? <PieChart /> : <Activity />}
            </Box>
            <Typography variant="h6" className={styles.chartTitleText}>
              {title}
            </Typography>
          </Box>
          <Box className={styles.chartControls}>
            <Tooltip title="Daten aktualisieren">
              <IconButton className={styles.refreshButton}>
                <Zap className={styles.refreshIcon} />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Box className={styles.chartContent}>
          {type === 'bar' ? renderBarChart() : renderPieChart()}
        </Box>

        {activeIndex !== null && (
          <Box className={styles.chartDetails}>
              <Typography variant="h6" className={styles.detailsTitle}>
                {data[activeIndex].name} Details
              </Typography>
              <Box className={styles.detailsContent}>
                <Box className={styles.detailItem}>
                  <Typography variant="body2" className={styles.detailLabel}>
                    Wert:
                  </Typography>
                  <Typography variant="h6" className={styles.detailValue}>
                    {data[activeIndex].value}
                  </Typography>
                </Box>
                <Box className={styles.detailItem}>
                  <Typography variant="body2" className={styles.detailLabel}>
                    Trend:
                  </Typography>
                  <Chip 
                    icon={data[activeIndex].trend === 'up' ? <TrendingUp /> : data[activeIndex].trend === 'down' ? <TrendingDown /> : <Activity />}
                    label={`${data[activeIndex].trendValue}%`}
                    className={`${styles.trendChip} ${styles[data[activeIndex].trend]}`}
                  />
                </Box>
                <Box className={styles.detailItem}>
                  <Typography variant="body2" className={styles.detailLabel}>
                    Anteil:
                  </Typography>
                  <Typography variant="body2" className={styles.detailValue}>
                    {((data[activeIndex].value / totalValue) * 100).toFixed(1)}% (Animation: {Math.round(animationProgress * 100)}%)
                  </Typography>
                </Box>
              </Box>
            </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default InteractiveChart;
