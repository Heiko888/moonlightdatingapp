
import { motion } from 'framer-motion';
import { Box } from '@mui/material';
import { useState, useEffect } from 'react';

const AnimatedStars = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Feste Positionen und Größen für die Sterne um Hydration-Fehler zu vermeiden
  const starData = [
    { left: '5%', top: '15%', width: 3, height: 3 },
    { left: '15%', top: '25%', width: 2, height: 2 },
    { left: '25%', top: '10%', width: 4, height: 4 },
    { left: '35%', top: '35%', width: 3, height: 3 },
    { left: '45%', top: '20%', width: 2, height: 2 },
    { left: '55%', top: '45%', width: 3, height: 3 },
    { left: '65%', top: '15%', width: 2, height: 2 },
    { left: '75%', top: '30%', width: 4, height: 4 },
    { left: '85%', top: '25%', width: 3, height: 3 },
    { left: '95%', top: '40%', width: 2, height: 2 },
    { left: '10%', top: '55%', width: 3, height: 3 },
    { left: '20%', top: '70%', width: 2, height: 2 },
    { left: '30%', top: '60%', width: 4, height: 4 },
    { left: '40%', top: '75%', width: 3, height: 3 },
    { left: '50%', top: '50%', width: 2, height: 2 },
    { left: '60%', top: '65%', width: 3, height: 3 },
    { left: '70%', top: '55%', width: 2, height: 2 },
    { left: '80%', top: '70%', width: 4, height: 4 },
    { left: '90%', top: '60%', width: 3, height: 3 },
    { left: '5%', top: '85%', width: 2, height: 2 }
  ];

  // Static version for SSR - identisch mit Client-Version
  if (!mounted) {
    return (
      <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        {starData.map((star, i) => (
          <Box
            key={i}
            sx={{
              position: 'absolute',
              width: `${star.width}px`,
              height: `${star.height}px`,
              background: 'rgba(255, 255, 255, 0.8)',
              borderRadius: '50%',
              boxShadow: '0 0 10px rgba(255, 255, 255, 0.8)',
              left: star.left,
              top: star.top,
              opacity: 0.8
            }}
          />
        ))}
      </Box>
    );
  }

  // Animated version for client - identische Basis-Styles
  return (
    <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {starData.map((star, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            width: `${star.width}px`,
            height: `${star.height}px`,
            background: 'rgba(255, 255, 255, 0.8)',
            borderRadius: '50%',
            boxShadow: '0 0 10px rgba(255, 255, 255, 0.8)',
            left: star.left,
            top: star.top,
          }}
          animate={{
            opacity: [0.2, 1, 0.2],
            scale: [0.6, 1.4, 0.6],
          }}
          transition={{
            duration: 2.5 + (i * 0.2),
            repeat: Infinity,
            delay: i * 0.1,
          }}
        />
      ))}
    </Box>
  );
};

export default AnimatedStars;
