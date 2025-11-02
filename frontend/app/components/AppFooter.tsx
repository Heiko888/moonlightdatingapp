'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';
import Link from 'next/link';

export default function AppFooter() {
  return (
    <Box
      component="footer"
      sx={{
        mt: 8,
        py: 4,
        borderTop: '1px solid rgba(242, 159, 5, 0.2)',
        background: 'rgba(0, 0, 0, 0.3)',
      }}
    >
      <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 2, md: 4 } }}>
        {/* Social Media Icons */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography
            variant="h6"
            sx={{
              color: 'rgba(255, 255, 255, 0.9)',
              mb: 3,
              fontWeight: 600,
            }}
          >
            Folge uns auf Social Media
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3 }}>
            <Box
              component="a"
              href="https://www.youtube.com/@TheConnectionKey"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 56,
                height: 56,
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '2px solid rgba(242, 159, 5, 0.3)',
                color: '#F29F05',
                textDecoration: 'none',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                '&:hover': {
                  color: '#FF0000',
                  borderColor: '#FF0000',
                  transform: 'scale(1.1)',
                  background: 'rgba(255, 0, 0, 0.1)',
                  boxShadow: '0 4px 20px rgba(255, 0, 0, 0.3)'
                }
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </Box>
            <Box
              component="a"
              href="https://www.instagram.com/theconnectionkey/"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 56,
                height: 56,
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '2px solid rgba(242, 159, 5, 0.3)',
                color: '#F29F05',
                textDecoration: 'none',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                '&:hover': {
                  color: '#E4405F',
                  borderColor: '#E4405F',
                  transform: 'scale(1.1)',
                  background: 'rgba(228, 64, 95, 0.1)',
                  boxShadow: '0 4px 20px rgba(228, 64, 95, 0.3)'
                }
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </Box>
          </Box>
        </Box>
        
        {/* Impressum & Datenschutz */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          gap: 3,
          mb: 2,
          flexWrap: 'wrap'
        }}>
          <Link 
            href="/impressum"
            style={{ 
              textDecoration: 'none',
              color: 'rgba(255, 255, 255, 0.6)',
              fontSize: '0.875rem',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#F29F05';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)';
            }}
          >
            Impressum
          </Link>
          <Box
            sx={{
              width: '4px',
              height: '4px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.3)'
            }}
          />
          <Link 
            href="/datenschutz"
            style={{ 
              textDecoration: 'none',
              color: 'rgba(255, 255, 255, 0.6)',
              fontSize: '0.875rem',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#F29F05';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)';
            }}
          >
            Datenschutz
          </Link>
          <Box
            sx={{
              width: '4px',
              height: '4px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.3)'
            }}
          />
          <Typography sx={{ 
            color: 'rgba(255, 255, 255, 0.4)', 
            fontSize: '0.875rem'
          }}>
            © {new Date().getFullYear()} The Connection Key
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

