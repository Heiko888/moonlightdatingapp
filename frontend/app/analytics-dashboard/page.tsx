'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AnalyticsDashboardRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirect zu /analytics
    router.replace('/analytics');
  }, [router]);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <div style={{ 
        textAlign: 'center', 
        color: 'white',
        fontSize: '18px'
      }}>
        🔄 Weiterleitung zu Analytics...
      </div>
    </div>
  );
}
