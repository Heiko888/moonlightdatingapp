"use client";
import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';

interface Star {
  left: string;
  top: string;
  size: number;
  delay?: number;
}

interface SSRSafeStarsProps {
  count?: number;
  minSize?: number;
  maxSize?: number;
  opacity?: number;
  color?: string;
  animation?: boolean;
  staticStars?: Star[];
}

const SSRSafeStars: React.FC<SSRSafeStarsProps> = ({
  count = 20,
  minSize = 1,
  maxSize = 4,
  opacity = 0.6,
  color = 'rgba(255, 255, 255, 0.6)',
  animation = true,
  staticStars
}) => {
  const [isClient, setIsClient] = useState(false);
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    setIsClient(true);
    
    if (staticStars) {
      setStars(staticStars);
    } else {
      // Generiere Sterne nur auf dem Client
      const generatedStars = Array.from({ length: count }, () => ({
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        size: Math.random() * (maxSize - minSize) + minSize,
        delay: animation ? Math.random() * 2 : 0
      }));
      setStars(generatedStars);
    }
  }, [count, minSize, maxSize, staticStars, animation]);

  // Für SSR: Zeige statische Sterne
  const displayStars = isClient ? stars : (staticStars || [
    { left: '10%', top: '15%', size: 2 },
    { left: '85%', top: '25%', size: 3 },
    { left: '45%', top: '35%', size: 2 },
    { left: '75%', top: '45%', size: 3 },
    { left: '20%', top: '55%', size: 2 },
    { left: '90%', top: '65%', size: 3 },
    { left: '30%', top: '75%', size: 2 },
    { left: '60%', top: '85%', size: 3 },
    { left: '15%', top: '95%', size: 2 },
    { left: '80%', top: '5%', size: 3 }
  ]);

  return (
    <Box sx={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      pointerEvents: 'none',
      zIndex: 1
    }}>
      {displayStars.map((star, i) => (
        <Box
          key={i}
          sx={{
            position: 'absolute',
            left: star.left,
            top: star.top,
            width: star.size * 4,
            height: star.size * 4,
            borderRadius: '50%',
            background: color.replace(/[\d.]+\)$/, `${opacity})`),
            boxShadow: `0 0 ${star.size * 2}px ${color}`,
            zIndex: 1,
            ...(animation && isClient && {
              animation: `twinkle ${2 + (star.delay || 0)}s ease-in-out infinite alternate`,
              animationDelay: `${star.delay || 0}s`
            })
          }}
        />
      ))}
      
      {animation && isClient && (
        <style dangerouslySetInnerHTML={{
          __html: `
            @keyframes twinkle {
              0% { opacity: 0.3; transform: scale(0.8); }
              50% { opacity: 1; transform: scale(1.2); }
              100% { opacity: 0.6; transform: scale(1); }
            }
          `
        }} />
      )}
    </Box>
  );
};

export default SSRSafeStars;
