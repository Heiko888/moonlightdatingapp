'use client';

import React, { useEffect, useState } from 'react';
import { Box, Container, Button } from '@mui/material';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';

export default function AppHeader() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [logoSrc, setLogoSrc] = useState('/images/connection-key-logo.png');

  useEffect(() => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      setIsAuthenticated(!!token && !!userId);
    } catch {}
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch {}
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('userData');
      localStorage.removeItem('profileSetupCompleted');
      localStorage.removeItem('user-subscription');
    } catch {}
    setIsAuthenticated(false);
    router.push('/login');
  };
  return (
    <Box sx={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      bgcolor: '#000000',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(242, 159, 5, 0.15)',
      boxShadow: '0 4px 30px rgba(0, 0, 0, 0.3)'
    }}>
      <Container maxWidth="lg">
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          py: 1
        }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
            <Box sx={{
              position: 'relative',
              height: { xs: 50, md: 70 },
              width: { xs: 200, md: 280 },
              cursor: 'pointer',
              transition: 'transform 0.3s ease',
              '&:hover': { transform: 'scale(1.05)' }
            }}>
              <Image
                src={logoSrc}
                alt="App Logo"
                fill
                style={{ objectFit: 'contain' }}
                onError={() => setLogoSrc('/images/Design%20ohne%20Titel(15).png')}
                priority
              />
            </Box>
          </Link>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              component={Link}
              href="/"
              variant="outlined"
              sx={{ textTransform: 'none', fontWeight: 600 }}
            >
              Home
            </Button>
            {isAuthenticated ? (
              <Button
                onClick={handleLogout}
                variant="outlined"
                sx={{ textTransform: 'none', fontWeight: 600 }}
              >
                Abmelden
              </Button>
            ) : (
              <Button
                component={Link}
                href="/register"
                variant="outlined"
                sx={{ textTransform: 'none', fontWeight: 600 }}
              >
                Registrieren
              </Button>
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}


