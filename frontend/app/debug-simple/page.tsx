"use client";
import React, { useState, useEffect } from 'react';
import { Box, Typography, Container, Paper, Button, Alert } from '@mui/material';

interface DebugInfo {
  timestamp?: string;
  userAgent?: string;
  url?: string;
  localStorage?: {
    available?: boolean;
    keys?: string[];
    test?: string;
    cleared?: boolean;
  };
  jsonParse?: string;
}

export default function DebugSimplePage() {
  const [debugInfo, setDebugInfo] = useState<DebugInfo>({});
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    const info: DebugInfo = {
      timestamp: new Date().toISOString(),
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'SSR',
      url: typeof window !== 'undefined' ? window.location.href : 'SSR',
      localStorage: typeof window !== 'undefined' ? {
        available: typeof Storage !== 'undefined',
        keys: Object.keys(localStorage || {})
      } : undefined
    };

    // Test localStorage
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('debug-test', 'success');
        localStorage.removeItem('debug-test');
        if (info.localStorage) {
          info.localStorage.test = 'success';
        }
      }
    } catch (error) {
      if (info.localStorage) {
        info.localStorage.test = 'failed';
      }
      setErrors(prev => [...prev, `localStorage error: ${error}`]);
    }

    // Test JSON.parse
    try {
      if (typeof window !== 'undefined') {
        const testData = { test: true, timestamp: Date.now() };
        const jsonString = JSON.stringify(testData);
        const parsed = JSON.parse(jsonString);
        info.jsonParse = parsed.test ? 'success' : 'failed';
      }
    } catch (error) {
      info.jsonParse = 'failed';
      setErrors(prev => [...prev, `JSON.parse error: ${error}`]);
    }

    setDebugInfo(info);
  }, []);

  const handleClearStorage = () => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.clear();
        setDebugInfo((prev: DebugInfo) => ({ ...prev, localStorage: { ...prev.localStorage, cleared: true } }));
      }
    } catch (error) {
      setErrors(prev => [...prev, `Clear storage error: ${error}`]);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{ p: 4, background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%)', color: 'white' }}>
        <Typography variant="h4" sx={{ color: '#ff6b9d', mb: 3 }}>
          🔧 Debug Information
        </Typography>

        {errors.length > 0 && (
          <Alert severity="error" sx={{ mb: 3 }}>
            <Typography variant="h6">Fehler gefunden:</Typography>
            {errors.map((error, index) => (
              <Typography key={index} variant="body2">
                {error}
              </Typography>
            ))}
          </Alert>
        )}

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ color: '#4ecdc4', mb: 2 }}>
            System Information:
          </Typography>
          <pre style={{ 
            background: 'rgba(255,255,255,0.05)', 
            padding: 16, 
            borderRadius: 8,
            overflow: 'auto',
            fontSize: '12px'
          }}>
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            onClick={handleClearStorage}
            sx={{
              background: 'linear-gradient(45deg, #ff6b9d, #4ecdc4)',
              '&:hover': {
                background: 'linear-gradient(45deg, #e55a8a, #3bb5b0)'
              }
            }}
          >
            localStorage leeren
          </Button>
          <Button
            variant="outlined"
            onClick={() => window.location.reload()}
            sx={{
              borderColor: 'rgba(255,255,255,0.3)',
              color: 'white',
              '&:hover': {
                borderColor: 'white',
                background: 'rgba(255,255,255,0.1)'
              }
            }}
          >
            Seite neu laden
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
