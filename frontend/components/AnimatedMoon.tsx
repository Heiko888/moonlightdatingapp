"use client";

import { Box } from '@mui/material';
import { motion } from 'framer-motion';

interface AnimatedMoonProps {
  size?: number;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'center';
}

const AnimatedMoon = ({ 
  size = 120, 
  position = 'top-right' 
}) => {
  const getPosition = () => {
    switch (position) {
      case 'top-left':
        return { top: '5%', left: '5%' };
      case 'bottom-right':
        return { bottom: '5%', right: '5%' };
      case 'bottom-left':
        return { bottom: '5%', left: '5%' };
      case 'center':
        return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
      default:
        return { top: '5%', right: '5%' };
    }
  };

  return (
    <Box
      sx={{
        position: 'absolute',
        ...getPosition(),
        zIndex: 1,
        pointerEvents: 'none',
      }}
    >
      {/* Hauptmond */}
      <motion.div
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          background: 'radial-gradient(circle, #fff 0%, #f0f8ff 30%, #e6f3ff 60%, #cce7ff 100%)',
          boxShadow: `
            0 0 20px rgba(255, 255, 255, 0.8),
            0 0 40px rgba(255, 255, 255, 0.6),
            0 0 60px rgba(255, 255, 255, 0.4),
            0 0 80px rgba(255, 255, 255, 0.2),
            inset 0 0 20px rgba(255, 255, 255, 0.3)
          `,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.8, 1, 0.8],
          rotate: [0, 5, 0]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {/* Mond-Krater */}
        <Box sx={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          background: `
            radial-gradient(ellipse 20px 15px at 30% 25%, rgba(200, 220, 255, 0.3) 0%, transparent 50%),
            radial-gradient(ellipse 15px 10px at 70% 60%, rgba(200, 220, 255, 0.2) 0%, transparent 50%),
            radial-gradient(ellipse 12px 8px at 20% 70%, rgba(200, 220, 255, 0.25) 0%, transparent 50%),
            radial-gradient(ellipse 18px 12px at 80% 30%, rgba(200, 220, 255, 0.15) 0%, transparent 50%)
          `
        }} />
        
        {/* Mond-Glanz */}
        <motion.div
          style={{
            position: 'absolute',
            width: size * 0.33,
            height: size * 0.33,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.3) 70%, transparent 100%)',
            top: '15%',
            left: '15%'
          }}
          animate={{
            opacity: [0.3, 0.8, 0.3],
            scale: [0.8, 1.2, 0.8]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.div>
      
      {/* Mond-Aura */}
      <motion.div
        style={{
          position: 'absolute',
          width: size * 1.33,
          height: size * 1.33,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 50%, transparent 100%)',
          top: `-${size * 0.17}px`,
          left: `-${size * 0.17}px`,
          zIndex: -1
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Animierte Sterne */}
      {[
        { left: '10%', top: '15%' }, { left: '85%', top: '25%' }, { left: '45%', top: '35%' },
        { left: '75%', top: '45%' }, { left: '20%', top: '55%' }, { left: '90%', top: '65%' },
        { left: '30%', top: '75%' }, { left: '60%', top: '85%' }, { left: '15%', top: '95%' },
        { left: '80%', top: '5%' }, { left: '50%', top: '15%' }, { left: '25%', top: '25%' },
        { left: '70%', top: '35%' }, { left: '40%', top: '45%' }, { left: '95%', top: '55%' }
      ].map((pos, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            width: '3px',
            height: '3px',
            background: '#FFD700',
            borderRadius: '50%',
            boxShadow: '0 0 8px #FFD700, 0 0 16px #FFD700, 0 0 24px #FFD700',
            left: pos.left,
            top: pos.top,
          }}
          animate={{
            opacity: [0.2, 1, 0.2],
            scale: [0.6, 1.4, 0.6],
          }}
          transition={{
            duration: 2.5 + (i * 0.2),
            repeat: Infinity,
            delay: i * 0.3,
          }}
        />
      ))}
    </Box>
  );
};

export default AnimatedMoon;
