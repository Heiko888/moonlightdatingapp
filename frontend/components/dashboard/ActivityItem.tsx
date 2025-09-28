"use client";

import React from 'react';
import { ActivityItemProps } from '@/types/dashboard.types';
import styles from '@/app/dashboard/dashboard.module.css';

const ActivityItem: React.FC<ActivityItemProps> = ({ 
  activity, 
  className = '' 
}) => {
  return (
    <div className={`${styles.activityItem} ${className}`}>
      <div className={styles.activityTitle}>
        {activity.title}
      </div>
      <div className={styles.activityTime}>
        {new Date(activity.timestamp).toLocaleString('de-DE')}
      </div>
      {activity.description && (
        <div className={styles.activityDescription}>
          {activity.description}
        </div>
      )}
    </div>
  );
};

export default ActivityItem;
