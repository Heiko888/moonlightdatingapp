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
      <Container maxWidth="lg" disableGutters sx={{ px: { xs: 1.5, sm: 2 } }}>
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          py: { xs: 0.5, md: 1 }
        }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
            <Box sx={{
              position: 'relative',
              height: { xs: 40, md: 70 },
              width: { xs: 140, md: 280 },
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

          <Box sx={{
            display: 'flex',
            gap: { xs: 1, sm: 2 },
            overflowX: { xs: 'auto', sm: 'visible' },
            maxWidth: { xs: '60%', sm: 'unset' },
            ml: { xs: 1, sm: 2 },
            '::-webkit-scrollbar': { height: 6 },
            '::-webkit-scrollbar-thumb': { background: 'rgba(255,255,255,0.2)', borderRadius: 4 }
          }}>
            <Button
              component={Link}
              href="/"
              variant="outlined"
              size="small"
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                minWidth: { xs: 'auto', sm: 120 },
                px: { xs: 1.5, sm: 2.5 },
                whiteSpace: 'nowrap'
              }}
            >
              Home
            </Button>
            {isAuthenticated ? (
              <Button
                onClick={handleLogout}
                variant="outlined"
                size="small"
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                  minWidth: { xs: 'auto', sm: 120 },
                  px: { xs: 1.5, sm: 2.5 },
                  whiteSpace: 'nowrap'
                }}
              >
                Abmelden
              </Button>
            ) : (
              <Button
                component={Link}
                href="/register"
                variant="outlined"
                size="small"
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                  minWidth: { xs: 'auto', sm: 120 },
                  px: { xs: 1.5, sm: 2.5 },
                  whiteSpace: 'nowrap'
                }}
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


