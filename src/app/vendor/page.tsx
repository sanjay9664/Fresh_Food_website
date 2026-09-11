'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function VendorIndexPage() {
  const router = useRouter();
  const { isLoggedIn, user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      const isVendor = isLoggedIn && user && (
        String(user.role || '').toLowerCase().includes('vendor') ||
        String(user.email || '').toLowerCase().includes('vendor')
      );
      if (isVendor) {
        router.replace('/vendor/dashboard');
      } else {
        router.replace('/vendor/login');
      }
    }
  }, [isLoggedIn, user, loading, router]);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      fontFamily: 'sans-serif',
      color: '#475569'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div className="spinner-border text-success mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
          <span className="visually-hidden">Loading...</span>
        </div>
        <p style={{ fontWeight: 500 }}>Connecting to FreshVana Vendor Portal...</p>
      </div>
    </div>
  );
}
