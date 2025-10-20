'use client'
import * as React from 'react'
import { useTheme } from '@/components/ThemeProvider'
import { CssBaseline } from '@mui/material'

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  // Theme wird nun via Toggle-ThemeProvider bereitgestellt
  // Diese Komponente dient nur noch als CssBaseline Wrapper, falls noch eingebunden
  useTheme();
  return (
    <>
      <CssBaseline />
      {children}
    </>
  )
}
