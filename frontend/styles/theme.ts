'use client'

import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#F29F05' }, // Akzent 1
    secondary: { main: '#8C1D04' }, // Akzent 2
    background: { 
      default: '#02000D', // Tiefes Schwarzblau
      paper: 'rgba(242, 159, 5, 0.05)'
    },
    text: { 
      primary: '#ffffff', 
      secondary: 'rgba(255,255,255,0.8)'
    },
    error: { main: '#8C1D04' },
    warning: { main: '#F29F05' },
    success: { main: '#590A03' },
    info: { main: '#260A0A' }
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: ['Inter','system-ui','Segoe UI','Roboto','Arial'].join(','),
    h1: { 
      fontWeight: 800, 
      fontSize: '2.4rem',
      background: 'linear-gradient(135deg, #F29F05, #8C1D04)',
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
          background: 'linear-gradient(135deg, #F29F05, #8C1D04)',
          color: 'white',
          '&:hover': {
            background: 'linear-gradient(135deg, #8C1D04, #F29F05)',
            transform: 'translateY(-2px)',
            boxShadow: '0 12px 35px rgba(242, 159, 5, 0.35)'
          }
        },
        outlined: {
          borderColor: '#F29F05',
          color: '#F29F05',
          '&:hover': {
            borderColor: '#8C1D04',
            backgroundColor: 'rgba(242, 159, 5, 0.10)'
          }
        },
        text: {
          color: '#F29F05',
          '&:hover': {
            backgroundColor: 'rgba(242, 159, 5, 0.08)'
          }
        }
      },
    },
    MuiCard: {
      styleOverrides: {
        root: { 
          backgroundColor: 'transparent',
          background: 'rgba(242, 159, 5, 0.05)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(242, 159, 5, 0.15)',
          borderRadius: 12,
          transition: 'all 0.3s ease',
          color: '#F29F05',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 20px 40px rgba(242, 159, 5, 0.25)'
          }
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: { 
          backgroundColor: 'rgba(242, 159, 5, 0.1)',
          borderRadius: 8
        },
        notchedOutline: { 
          borderColor: 'rgba(242, 159, 5, 0.4)',
          '&:hover': {
            borderColor: 'rgba(242, 159, 5, 0.6)'
          }
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiInputBase-root': {
            backgroundColor: 'rgba(242, 159, 5, 0.1)',
            borderRadius: 8
          }
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(242, 159, 5, 0.1)',
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
          backgroundColor: 'rgba(242, 159, 5, 0.2)',
          color: '#F29F05',
          border: '1px solid #F29F05',
          '&:hover': {
            backgroundColor: 'rgba(242, 159, 5, 0.3)'
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
