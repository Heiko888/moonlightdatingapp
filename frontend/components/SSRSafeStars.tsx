"use client";

import React, { useState, useEffect } from 'react';
import AnimatedStars from './AnimatedStars';

interface SSRSafeStarsProps {
  count?: number;
  size?: number;
  duration?: number;
}

const SSRSafeStars: React.FC<SSRSafeStarsProps> = (props) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // SSR-safe
  }

  return <AnimatedStars {...props} />;
};

export default SSRSafeStars;