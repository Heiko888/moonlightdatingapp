"use client";

import React from 'react';
import { RotateCcw } from 'lucide-react';
import { RefreshButtonProps } from '@/types/dashboard.types';
import styles from '@/app/dashboard/dashboard.module.css';

const RefreshButton: React.FC<RefreshButtonProps> = ({ 
  isLoading, 
  onRefresh, 
  className = '' 
}) => {
  return (
    <button
      onClick={onRefresh}
      disabled={isLoading}
      className={`${styles.refreshButton} ${className}`}
    >
      <RotateCcw 
        size={16} 
        className={isLoading ? styles.refreshIcon : ''} 
      />
      {isLoading ? 'Lädt...' : 'Aktualisieren'}
    </button>
  );
};

export default RefreshButton;
