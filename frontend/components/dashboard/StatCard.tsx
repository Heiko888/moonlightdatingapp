"use client";

import React from 'react';
import { StatCardProps } from '@/types/dashboard.types';
import styles from '@/app/dashboard/dashboard.module.css';

const StatCard: React.FC<StatCardProps> = ({ 
  value, 
  label, 
  type, 
  className = '' 
}) => {
  return (
    <div className={`${styles.statCard} ${className}`}>
      <div className={`${styles.statNumber} ${styles[type]}`}>
        {value}
      </div>
      <div className={styles.statLabel}>
        {label}
      </div>
    </div>
  );
};

export default StatCard;
