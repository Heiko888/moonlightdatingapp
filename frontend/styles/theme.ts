'use client'

import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#ff6b9d' }, // Dating Pink
    secondary: { main: '#4ecdc4' }, // Dating Teal
    background: { 
      default: '#0F0F23', 
      paper: 'rgba(255,255,255,0.05)' 
    },
    text: { 
      primary: '#ffffff', 
      secondary: 'rgba(255,255,255,0.8)' 
    },
    error: { main: '#ef4444' },
    warning: { main: '#f59e0b' },
    success: { main: '#10b981' },
    info: { main: '#3b82f6' }
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: ['Inter','system-ui','Segoe UI','Roboto','Arial'].join(','),
    h1: { 
      fontWeight: 800, 
      fontSize: '2.4rem',
      background: 'linear-gradient(135deg, #ff6b9d, #c44569, #4ecdc4)',
      backgroundClip: 'text',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent'
    },
    h2: { 
      fontWeight: 700, 
      fontSize: '1.8rem',
      color: '#ffffff'
    },
    h3: {
      fontWeight: 700,
      fontSize: '1.5rem',
      color: '#ffffff'
    },
    button: { 
      textTransform: 'none', 
      fontWeight: 600 
    },
  },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { 
          borderRadius: 12, 
          paddingInline: 16, 
          paddingBlock: 10,
          fontWeight: 600
        },
        contained: {
          background: 'linear-gradient(135deg, #ff6b9d, #c44569)',
          color: 'white',
          '&:hover': {
            background: 'linear-gradient(135deg, #ff5a8a, #b83a5a)',
            transform: 'translateY(-2px)',
            boxShadow: '0 12px 35px rgba(255, 107, 157, 0.4)'
          }
        },
        outlined: {
          borderColor: 'rgba(255, 255, 255, 0.3)',
          color: 'white',
          '&:hover': {
            borderColor: 'rgba(255, 255, 255, 0.6)',
            backgroundColor: 'rgba(255, 255, 255, 0.1)'
          }
        }
      },
    },
    MuiCard: {
      styleOverrides: {
        root: { 
          backgroundColor: 'transparent',
          background: 'rgba(255,255,255,0.05)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 12,
          transition: 'all 0.3s ease',
          color: '#FFD700',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
          }
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: { 
          backgroundColor: 'rgba(255, 255, 255, 0.25)',
          borderRadius: 8
        },
        notchedOutline: { 
          borderColor: 'rgba(255,255,255,0.4)',
          '&:hover': {
            borderColor: 'rgba(255,255,255,0.6)'
          }
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiInputBase-root': {
            backgroundColor: 'rgba(255,255,255,0.25)',
            borderRadius: 8
          }
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255,255,255,0.25)',
          borderRadius: 8,
          color: 'white',
          '&::placeholder': {
            color: 'rgba(255,255,255,0.7)'
          }
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 215, 0, 0.2)',
          color: '#FFD700',
          border: '1px solid #FFD700',
          '&:hover': {
            backgroundColor: 'rgba(255, 215, 0, 0.3)'
          }
        }
      }
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          color: '#ffffff'
        }
      }
    }
  },
})

export default theme
