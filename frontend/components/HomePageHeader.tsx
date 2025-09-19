"use client";
import React, { useState, useEffect } from "react";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  Container
} from '@mui/material';
import {
  Home,
  Heart,
  Calendar,
  Users,
  LogOut,
  LogIn,
  UserPlus,
  FileText
} from 'lucide-react';

// Ausgewählte Seiten für die Startseite
const homePageMenuItems = [
  { label: 'Startseite', path: '/', icon: <Home size={20} /> },
  { label: 'Dating', path: '/dating', icon: <Heart size={20} /> },
  { label: 'Mondkalender', path: '/mondkalender', icon: <Calendar size={20} /> },
  { label: 'Friends', path: '/friends', icon: <Users size={20} /> },
  { label: 'Seitenanzeige', path: '/seitenanzeige', icon: <FileText size={20} /> },
];

// Auth-Menü basierend auf Login-Status
const getAuthMenuItems = (isLoggedIn: boolean) => {
  if (isLoggedIn) {
    return [
      { label: 'Abmelden', path: '/logout', icon: <LogOut size={20} /> },
    ];
  } else {
    return [
      { label: 'Anmelden', path: '/login', icon: <LogIn size={20} /> },
      { label: 'Registrieren', path: '/register', icon: <UserPlus size={20} /> },
    ];
  }
};

export default function HomePageHeader() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Prüfe Login-Status nur nach dem Mount
    const checkLoginStatus = () => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('authToken');
        setIsLoggedIn(!!token);
      }
    };
    
    checkLoginStatus();
    
    // Event Listener für Login-Status Änderungen
    const handleStorageChange = () => {
      checkLoginStatus();
    };
    
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleStorageChange);
    }
    
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('storage', handleStorageChange);
      }
    };
  }, []);

  // Hydration Safety Check
  if (!mounted) {
    return (
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: 1201,
          background: 'rgba(26, 26, 46, 0.95)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
        }}
      >
        <Container maxWidth="lg">
          <Toolbar sx={{ justifyContent: 'space-between', px: 0 }}>
            {/* MOONLIGHT Schriftzug entfernt */}
          </Toolbar>
        </Container>
      </AppBar>
    );
  }

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        zIndex: 1201,
        background: 'rgba(26, 26, 46, 0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
      }}
    >
      <Container maxWidth="lg">
        <Toolbar sx={{ justifyContent: 'space-between', px: 0 }}>
          {/* Logo/Brand - Entfernt */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {/* MOONLIGHT Schriftzug entfernt */}
          </Box>

          {/* Hauptnavigation */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
            {homePageMenuItems.map((item) => (
              <Button
                key={item.path}
                component={Link}
                href={item.path}
                startIcon={item.icon}
                sx={{
                  color: pathname === item.path ? '#FFD700' : 'rgba(255, 255, 255, 0.8)',
                  fontWeight: pathname === item.path ? 700 : 500,
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: '0.95rem',
                  background: pathname === item.path ? 'rgba(255, 215, 0, 0.1)' : 'transparent',
                  border: pathname === item.path ? '1px solid rgba(255, 215, 0, 0.3)' : '1px solid transparent',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    color: '#FFD700',
                    background: 'rgba(255, 215, 0, 0.1)',
                    border: '1px solid rgba(255, 215, 0, 0.3)',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 4px 12px rgba(255, 215, 0, 0.2)'
                  }
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>

                           {/* Auth-Buttons */}
                 <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 1 }}>
                   {getAuthMenuItems(isLoggedIn).map((item) => (
              <Button
                key={item.path}
                component={Link}
                href={item.path}
                startIcon={item.icon}
                variant={item.path === '/register' ? 'contained' : 'outlined'}
                sx={{
                  color: item.path === '/register' ? '#1a1a2e' : 'rgba(255, 255, 255, 0.8)',
                  fontWeight: 600,
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: '0.9rem',
                  background: item.path === '/register' 
                    ? 'linear-gradient(45deg, #FFD700, #FFA500)' 
                    : 'transparent',
                  border: item.path === '/register' 
                    ? 'none' 
                    : '1px solid rgba(255, 255, 255, 0.3)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    color: item.path === '/register' ? '#1a1a2e' : '#FFD700',
                    background: item.path === '/register' 
                      ? 'linear-gradient(45deg, #FFA500, #FFD700)' 
                      : 'rgba(255, 255, 255, 0.1)',
                    border: item.path === '/register' 
                      ? 'none' 
                      : '1px solid rgba(255, 215, 0, 0.5)',
                    transform: 'translateY(-1px)',
                    boxShadow: item.path === '/register' 
                      ? '0 4px 12px rgba(255, 215, 0, 0.4)' 
                      : '0 4px 12px rgba(255, 255, 255, 0.1)'
                  }
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>

          {/* Mobile Menu Button (für kleinere Bildschirme) */}
          <Box sx={{ display: { xs: 'block', md: 'none' } }}>
            <Button
              component={Link}
              href="/dating"
              variant="contained"
              sx={{
                background: 'linear-gradient(45deg, #FFD700, #FFA500)',
                color: '#1a1a2e',
                fontWeight: 700,
                px: 2,
                py: 1,
                borderRadius: 2,
                textTransform: 'none',
                fontSize: '0.9rem',
                '&:hover': {
                  background: 'linear-gradient(45deg, #FFA500, #FFD700)',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 12px rgba(255, 215, 0, 0.4)'
                }
              }}
            >
              Starten
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
