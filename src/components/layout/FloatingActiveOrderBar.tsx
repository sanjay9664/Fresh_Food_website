'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Order } from '@/types';
import { Truck, ChevronRight, X, Clock, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const FloatingActiveOrderBar: React.FC = () => {
  const pathname = usePathname();
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const checkActiveOrders = () => {
      const saved = localStorage.getItem('freshvana_customer_orders');
      if (saved) {
        try {
          const parsed: Order[] = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            // Find the most recent order that is not delivered yet or placed recently
            const active = parsed.find(
              (o) => o.status === 'Out for Delivery' || o.status === 'Harvested & Packed' || o.status === 'Order Confirmed'
            );
            if (active) {
              setActiveOrder(active);
              return;
            }
          }
        } catch (e) {
          // ignore
        }
      }

      // Default mock active order fallback if none in localStorage
      setActiveOrder({
        id: 'ord-1001',
        orderNumber: 'FV-88401',
        createdAt: 'Today, 10:24 AM',
        status: 'Out for Delivery',
        items: [],
        itemCount: 5,
        totalAmount: 220,
        paymentMethod: 'UPI',
        paymentStatus: 'Paid',
        address: { fullName: '', mobile: '', email: '', address: '', landmark: '', city: '', state: '', pincode: '' },
        deliverySlot: {
          date: 'Today',
          timeSlot: 'Express',
          slotTimeText: '15-30 Mins Express'
        },
        deliveryTimeText: 'Arriving in 15 mins (Express Delivery)'
      });
    };

    checkActiveOrders();
    const interval = setInterval(checkActiveOrders, 10000);
    return () => clearInterval(interval);
  }, []);

  // Do not show on /orders page or if dismissed or no active order
  if (!activeOrder || dismissed || pathname === '/orders' || pathname === '/checkout') {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        className="position-fixed bottom-0 start-50 translate-middle-x pb-5 pb-md-4 px-3"
        style={{ zIndex: 1040, maxWidth: '520px', width: '100%', marginBottom: '35px' }}
      >
        <div
          className="bg-dark text-white rounded-pill p-2.5 px-3 shadow-2xl d-flex align-items-center justify-content-between border border-success border-opacity-50"
          style={{ background: 'linear-gradient(135deg, #051D12 0%, #0A6836 100%)', boxShadow: '0 8px 30px rgba(10, 104, 54, 0.4)' }}
        >
          <div className="d-flex align-items-center gap-2.5 overflow-hidden">
            <div className="rounded-circle bg-success text-white p-2 d-flex align-items-center justify-content-center flex-shrink-0 animate-pulse">
              <Truck size={18} />
            </div>
            <div className="lh-tight overflow-hidden">
              <div className="d-flex align-items-center gap-2">
                <span className="fw-extrabold font-heading text-warning small">
                  🛵 Order #{activeOrder.orderNumber}
                </span>
                <span className="badge bg-danger rounded-pill px-2 py-0.5" style={{ fontSize: '0.62rem' }}>
                  <Zap size={10} className="d-inline" /> 15 MINS
                </span>
              </div>
              <span className="text-white-50 small d-block text-truncate" style={{ fontSize: '0.74rem' }}>
                {activeOrder.status} · {activeOrder.deliveryTimeText}
              </span>
            </div>
          </div>

          <div className="d-flex align-items-center gap-2 flex-shrink-0 ms-2">
            <Link
              href="/orders"
              className="btn btn-warning rounded-pill px-3 py-1.5 fw-extrabold text-dark small d-flex align-items-center gap-1 shadow-sm border-0"
              style={{ fontSize: '0.78rem', background: '#FFB800' }}
            >
              <span>Track Live</span>
              <ChevronRight size={14} />
            </Link>
            <button
              onClick={() => setDismissed(true)}
              className="btn btn-link text-white-50 p-1 border-0"
              aria-label="Dismiss tracking bar"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
