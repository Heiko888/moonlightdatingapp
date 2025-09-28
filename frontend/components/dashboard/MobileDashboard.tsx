"use client";

import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  SwipeableDrawer,
  Fab,
  BottomNavigation,
  BottomNavigationAction,
  useMediaQuery,
  useTheme,
  Badge
} from '@mui/material';
import { 
  Menu, 
  Home, 
  Layout, 
  Trophy, 
  Activity, 
  BarChart3,
  Settings,
  Bell,
  User,
  Moon,
  Heart,
  Users,
  Star,
  Zap,
  Target,
  Crown,
  Sparkles
} from 'lucide-react';
import styles from './MobileDashboard.module.css';

interface MobileDashboardProps {
  children: React.ReactNode;
  className?: string;
}

const MobileDashboard: React.FC<MobileDashboardProps> = ({ 
  children, 
  className = '' 
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [bottomNavValue, setBottomNavValue] = useState(0);
  const [notifications] = useState(3);
  const [achievements] = useState(5);

  const navigationItems = [
    { label: 'Dashboard', icon: <Home size={24} />, value: 0 },
    { label: 'Widgets', icon: <Layout size={24} />, value: 1 },
    { label: 'Achievements', icon: <Trophy size={24} />, value: 2 },
    { label: 'Live', icon: <Activity size={24} />, value: 3 },
    { label: 'Analytics', icon: <BarChart3 size={24} />, value: 4 }
  ];

  const drawerItems = [
    { label: 'Dashboard', icon: <Home size={20} />, href: '/dashboard' },
    { label: 'Mondkalender', icon: <Moon size={20} />, href: '/moon-calendar' },
    { label: 'Dating', icon: <Heart size={20} />, href: '/dating' },
    { label: 'Community', icon: <Users size={20} />, href: '/community' },
    { label: 'Coaching', icon: <Target size={20} />, href: '/coaching' },
    { label: 'Analytics', icon: <BarChart3 size={20} />, href: '/analytics' },
    { label: 'Einstellungen', icon: <Settings size={20} />, href: '/settings' }
  ];

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleBottomNavChange = (event: React.SyntheticEvent, newValue: number) => {
    setBottomNavValue(newValue);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  if (!isMobile) {
    return <>{children}</>;
  }

  return (
    <Box className={`${styles.mobileDashboard} ${className}`}>
      {/* Mobile Header */}
      <Box className={styles.mobileHeader}>
        <Box className={styles.headerLeft}>
          <IconButton 
            onClick={handleDrawerToggle}
            className={styles.menuButton}
            size="large"
          >
            <Menu className={styles.menuIcon} />
          </IconButton>
          <Typography variant="h6" className={styles.headerTitle}>
            Human Design
          </Typography>
        </Box>
        
        <Box className={styles.headerRight}>
          <IconButton className={styles.headerButton}>
            <Badge badgeContent={notifications} color="error">
              <Bell className={styles.headerIcon} />
            </Badge>
          </IconButton>
          
          <IconButton className={styles.headerButton}>
            <Badge badgeContent={achievements} color="secondary">
              <Trophy className={styles.headerIcon} />
            </Badge>
          </IconButton>
        </Box>
      </Box>

      {/* Main Content */}
      <Box className={styles.mobileContent}>
        {children}
      </Box>

      {/* Bottom Navigation */}
      <BottomNavigation
        value={bottomNavValue}
        onChange={handleBottomNavChange}
        className={styles.bottomNavigation}
        showLabels
      >
        {navigationItems.map((item) => (
          <BottomNavigationAction
            key={item.value}
            label={item.label}
            icon={item.icon}
            className={styles.bottomNavItem}
          />
        ))}
      </BottomNavigation>

      {/* Swipeable Drawer */}
      <SwipeableDrawer
        anchor="left"
        open={drawerOpen}
        onClose={handleDrawerClose}
        onOpen={handleDrawerToggle}
        className={styles.mobileDrawer}
        disableSwipeToOpen={false}
      >
        <Box className={styles.drawerContent}>
          {/* Drawer Header */}
          <Box className={styles.drawerHeader}>
            <Box className={styles.drawerUserInfo}>
              <Box className={styles.userAvatar}>
                <User className={styles.userIcon} />
              </Box>
              <Box className={styles.userDetails}>
                <Typography variant="h6" className={styles.userName}>
                  Willkommen zurück!
                </Typography>
                <Typography variant="body2" className={styles.userSubtitle}>
                  Dein Human Design Dashboard
                </Typography>
              </Box>
            </Box>
            
            <IconButton 
              onClick={handleDrawerClose}
              className={styles.closeButton}
            >
              <Menu className={styles.closeIcon} />
            </IconButton>
          </Box>

          {/* Drawer Navigation */}
          <List className={styles.drawerList}>
            {drawerItems.map((item, index) => (
              <ListItem 
                key={index}
                button
                className={styles.drawerItem}
                onClick={handleDrawerClose}
              >
                <ListItemIcon className={styles.drawerIcon}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.label}
                  className={styles.drawerText}
                />
              </ListItem>
            ))}
          </List>

          {/* Drawer Footer */}
          <Box className={styles.drawerFooter}>
            <Box className={styles.drawerStats}>
              <Box className={styles.statItem}>
                <Star className={styles.statIcon} />
                <Typography variant="caption" className={styles.statText}>
                  Level 5
                </Typography>
              </Box>
              <Box className={styles.statItem}>
                <Zap className={styles.statIcon} />
                <Typography variant="caption" className={styles.statText}>
                  250 XP
                </Typography>
              </Box>
              <Box className={styles.statItem}>
                <Crown className={styles.statIcon} />
                <Typography variant="caption" className={styles.statText}>
                  Premium
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </SwipeableDrawer>

      {/* Floating Action Button */}
      <Fab 
        className={styles.fab}
        color="secondary"
        size="large"
      >
        <Sparkles className={styles.fabIcon} />
      </Fab>
    </Box>
  );
};

export default MobileDashboard;
