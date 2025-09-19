"use client";
import { useState, useEffect } from "react";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
// import SimpleMoonlightHeader from "./SimpleMoonlightHeader";

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

// Einheitliches Theme basierend auf dem Dashboard-Design
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#FFD700', // Gold
      light: '#FFE55C',
      dark: '#DAA520',
    },
    secondary: {
      main: '#8B5CF6', // Violett
      light: '#A78BFA',
      dark: '#7C3AED',
    },
    background: {
      default: '#0f0f23',
      paper: 'rgba(255, 255, 255, 0.1)',
    },
    text: {
      primary: '#ffffff',
      secondary: 'rgba(255,255,255,0.9)',
    },
    success: {
      main: '#10b981',
      light: '#34d399',
      dark: '#059669',
    },
    warning: {
      main: '#f59e0b',
      light: '#fbbf24',
      dark: '#d97706',
    },
    error: {
      main: '#ef4444',
      light: '#f87171',
      dark: '#dc2626',
    },
    info: {
      main: '#06b6d4',
      light: '#22d3ee',
      dark: '#0891b2',
    },
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
    h1: {
      fontWeight: 900,
      fontSize: '3.5rem',
      color: '#ffffff',
      textShadow: '0 0 20px rgba(255, 255, 255, 0.5)',
    },
    h2: {
      fontWeight: 900,
      fontSize: '3rem',
      color: '#ffffff',
      textShadow: '0 0 20px rgba(255, 255, 255, 0.5)',
    },
    h3: {
      fontWeight: 700,
      fontSize: '2rem',
      color: '#ffffff',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
      color: '#ffffff',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
      color: '#ffffff',
    },
    h6: {
      fontWeight: 500,
      fontSize: '1rem',
      color: 'rgba(255,255,255,0.9)',
    },
    body1: {
      fontSize: '1rem',
      color: 'rgba(255,255,255,0.9)',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      color: 'rgba(255,255,255,0.8)',
      lineHeight: 1.5,
    },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: 16,
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.2)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 700,
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
          },
        },
        contained: {
          background: 'linear-gradient(45deg, #FFD700, #FFA500)',
          color: '#1a1a2e',
          '&:hover': {
            background: 'linear-gradient(45deg, #FFA500, #FFD700)',
          },
        },
        outlined: {
          borderColor: 'rgba(255,255,255,0.2)',
          color: '#ffffff',
          '&:hover': {
            borderColor: 'rgba(255,255,255,0.4)',
            backgroundColor: 'rgba(255,255,255,0.05)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderColor: 'rgba(255,255,255,0.2)',
            '&:hover': {
              borderColor: 'rgba(255,255,255,0.2)',
            },
            '&.Mui-focused': {
              borderColor: '#FFD700',
            },
          },
        },
      },
    },
  },
});

export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Header komplett entfernt

  // Während SSR oder vor dem Mount immer das gleiche Layout rendern
  if (!mounted) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div style={{
          minHeight: '100vh',
          background: '#0f0f23',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <main style={{ 
            flex: 1
          }}>
            {children}
          </main>
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div style={{
        minHeight: '100vh',
        background: '#0f0f23',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <main style={{ 
          flex: 1,
          paddingTop: '0'
        }}>
          {children}
        </main>
      </div>
    </ThemeProvider>
  );
}
