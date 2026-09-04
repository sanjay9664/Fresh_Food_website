'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Leaf, Download, X, Star, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const MobileAppBanner: React.FC = () => {
  const [dismissed, setDismissed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!isMobile || dismissed) return null;

  return (
    <div
      className="bg-dark text-white p-2.5 px-3 d-flex align-items-center justify-content-between border-bottom position-relative shadow-sm"
      style={{
        background: 'linear-gradient(90deg, #051D12 0%, #0A6836 100%)',
        zIndex: 1046
      }}
    >
      <div className="d-flex align-items-center gap-2.5 overflow-hidden">
        <div
          className="rounded-3 d-flex align-items-center justify-content-center text-white flex-shrink-0 shadow-sm"
          style={{ width: '38px', height: '38px', background: '#064E28', border: '1px solid rgba(255,255,255,0.2)' }}
        >
          <Leaf size={22} className="text-success" />
        </div>

        <div className="lh-tight overflow-hidden">
          <div className="d-flex align-items-center gap-1.5">
            <strong className="font-heading text-white small fw-extrabold">FreshVana App</strong>
            <span className="badge bg-warning text-dark rounded-pill px-1.5 py-0.5" style={{ fontSize: '0.6rem' }}>
              4.9 ⭐
            </span>
          </div>
          <span className="text-white-50 d-block text-truncate" style={{ fontSize: '0.72rem' }}>
            ⚡ 15-Min Express Delivery & 20% OFF
          </span>
        </div>
      </div>

      <div className="d-flex align-items-center gap-2 flex-shrink-0">
        <button
          type="button"
          onClick={() => alert('FreshVana App shortcut added to your home screen! 📱')}
          className="btn btn-warning rounded-pill px-3 py-1 fw-extrabold text-dark d-flex align-items-center gap-1 shadow-sm border-0"
          style={{ fontSize: '0.75rem', background: '#FFB800' }}
        >
          <Download size={13} />
          <span>USE APP</span>
        </button>

        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="btn btn-link text-white-50 p-1 border-0"
          aria-label="Close mobile app banner"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};
