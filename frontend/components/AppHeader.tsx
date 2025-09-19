"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from 'framer-motion';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Box, 
  IconButton, 
  Button,
  useTheme,
  useMediaQuery
} from "@mui/material";
import { 
  User, 
  Settings
} from 'lucide-react';
import Link from "next/link";

// Animierte Vollmond-Komponente
const AnimatedFullMoon = () => (
  <motion.div
    style={{
      width: 24,
      height: 24,
      borderRadius: '50%',
      background: 'radial-gradient(circle at 30% 30%, #ffffff 0%, #f0f0f0 40%, #e0e0e0 60%, #d0d0d0 100%)',
      boxShadow: '0 0 20px rgba(255, 255, 255, 0.8), inset 0 0 20px rgba(255, 255, 255, 0.3)',
      position: 'relative',
      marginTop: 4
    }}
    animate={{
      rotate: 360,
    }}
    transition={{
      duration: 20,
      repeat: Infinity,
      ease: "linear"
    }}
  >
    {/* Mondkrater */}
    <Box
      sx={{
        position: 'absolute',
        top: '25%',
        left: '20%',
        width: 3,
        height: 3,
        borderRadius: '50%',
        background: 'rgba(200, 200, 200, 0.6)',
        boxShadow: 'inset 0 0 2px rgba(0, 0, 0, 0.3)'
      }}
    />
    <Box
      sx={{
        position: 'absolute',
        top: '60%',
        left: '70%',
        width: 2,
        height: 2,
        borderRadius: '50%',
        background: 'rgba(180, 180, 180, 0.5)',
        boxShadow: 'inset 0 0 1px rgba(0, 0, 0, 0.2)'
      }}
    />
    <Box
      sx={{
        position: 'absolute',
        top: '40%',
        left: '50%',
        width: 1.5,
        height: 1.5,
        borderRadius: '50%',
        background: 'rgba(190, 190, 190, 0.4)',
        boxShadow: 'inset 0 0 1px rgba(0, 0, 0, 0.1)'
      }}
    />
  </motion.div>
);

export default function AppHeader({ current }: { current?: string }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // User aus Token holen
  const [username, setUsername] = useState<string | null>(null);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const userData = localStorage.getItem('userData');
        if (userData) {
          const user = JSON.parse(userData);
          setUsername(user.username || user.name);
        }
      } catch {}
    }
  }, []);

  return (
    <AppBar position="static" sx={{ 
      background: 'linear-gradient(135deg, #4b2e83 0%, #6b46c1 100%)', 
      color: '#fff', 
      boxShadow: '0 2px 12px rgba(75, 46, 131, 0.3)',
      height: { xs: 65, md: 70 }
    }}>
      <Toolbar sx={{ 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "space-between", 
        height: '100%',
        px: { xs: 2, md: 3 }
      }}>
        {/* Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Image
            src="/images/ChatGPT Image 25. Aug. 2025, 13_02_47.png"
            alt="Logo"
            width={40}
            height={40}
            style={{ borderRadius: 8, objectFit: 'contain', background: '#fff' }}
            priority
          />
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 700, 
                color: '#fff', 
                lineHeight: 1,
                fontSize: { xs: '1.1rem', md: '1.25rem' }
              }}
            >
              MOONLIGHT
            </Typography>
            <AnimatedFullMoon />
          </Box>
        </Box>

        {/* Navigation entfernt - nur Logo und User-Bereich */}

        {/* User Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {username ? (
            <Typography sx={{ 
              color: '#ffd700', 
              fontWeight: 600,
              fontSize: { xs: '0.85rem', md: '0.9rem' }
            }}>
              {username}
            </Typography>
          ) : (
            <Link href="/login">
              <Button
                variant="outlined"
                size="small"
                startIcon={<User size={16} />}
                sx={{
                  color: '#fff',
                  borderColor: 'rgba(255,255,255,0.3)',
                  '&:hover': {
                    borderColor: '#ffd700',
                    backgroundColor: 'rgba(255, 215, 0, 0.1)'
                  }
                }}
              >
                Login
              </Button>
            </Link>
          )}
          
          <Link href="/settings">
            <IconButton
              size="small"
              sx={{
                color: '#fff',
                '&:hover': {
                  backgroundColor: 'rgba(255, 215, 0, 0.1)',
                  color: '#ffd700'
                }
              }}
            >
              <Settings size={18} />
            </IconButton>
          </Link>
        </Box>
      </Toolbar>
    </AppBar>
  );
}