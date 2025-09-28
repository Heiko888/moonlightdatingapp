"use client";

import React from 'react';
import Link from 'next/link';
import { NotificationItemProps } from '@/types/dashboard.types';
import styles from '@/app/dashboard/dashboard.module.css';

const NotificationItem: React.FC<NotificationItemProps> = ({ 
  notification, 
  onMarkAsRead,
  onDelete,
  className = '' 
}) => {
  const handleMarkAsRead = () => {
    if (onMarkAsRead && !notification.read) {
      onMarkAsRead(notification.id);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(notification.id);
    }
  };

  return (
    <div className={`${styles.notificationItem} ${className}`}>
      <div className={styles.notificationHeader}>
        <span className={styles.notificationMessage}>
          {notification.message}
        </span>
        <span className={styles.notificationTime}>
          {new Date(notification.timestamp).toLocaleDateString('de-DE')}
        </span>
      </div>
      {notification.actionUrl && (
        <Link 
          href={notification.actionUrl}
          className={styles.notificationAction}
        >
          → Mehr erfahren
        </Link>
      )}
    </div>
  );
};

export default NotificationItem;
