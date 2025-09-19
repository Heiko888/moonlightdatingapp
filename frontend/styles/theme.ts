'use client'

import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary:   { main: '#A259F7' }, // Kräftiges Lila
    secondary: { main: '#D6B4FC' }, // Helles Lila
    background: { default: '#1B133D', paper: '#2B1A5A' }, // Lila-Töne
    text: { primary: '#F5F7FB', secondary: '#C9B6E7' }, // Helles Lila/Weiß
  },
  shape: { borderRadius: 14 },
  typography: {
    fontFamily: ['Inter','system-ui','Segoe UI','Roboto','Arial'].join(','),
    h1: { fontWeight: 800, fontSize: '2.4rem' },
    h2: { fontWeight: 700, fontSize: '1.8rem' },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { borderRadius: 12, paddingInline: 16, paddingBlock: 10 },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: { backgroundImage: 'none', border: '1px solid #6C3EB6' },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: { backgroundColor: '#251A3A' },
        notchedOutline: { borderColor: '#6C3EB6' },
      },
    },
      MuiTextField: {
        styleOverrides: {
          root: {
            backgroundColor: '#fff', // gewünschte Farbe
          },
        },
      },
      MuiInputBase: {
        styleOverrides: {
          root: {
            backgroundColor: '#fff', // auch für native Inputs
          },
        },
      },
  },
})

export default theme
