'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useProducts } from '@/context/ProductContext';
import { useQuickView } from '@/context/QuickViewContext';
import { ProductCard } from '@/components/product/ProductCard';
import { Flame, Sparkles, Tag, ArrowRight, CheckCircle2, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DealsPage() {
  const { products } = useProducts();
  const { openQuickView } = useQuickView();

  const dealProducts = products.filter((p) => p.isFlashSale || p.discountPercentage >= 20);

  const [timeLeft, setTimeLeft] = useState({
    days: 2,
    hours: 59,
    minutes: 10,
    seconds: 45
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        return { days: 2, hours: 59, minutes: 10, seconds: 45 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="py-5 bg-cream" style={{ paddingTop: '160px', minHeight: '85vh' }}>
      <div className="container py-3">
        {/* Grand Deals Banner */}
        <div
          className="rounded-5 text-white position-relative overflow-hidden shadow-lg p-4 p-md-5 mb-5"
          style={{
            background: 'linear-gradient(135deg, #04391D 0%, #064E28 50%, #0A6836 100%)',
            border: '1px solid rgba(255, 255, 255, 0.12)'
          }}
        >
          <div className="row align-items-center gy-4">
            <div className="col-lg-7">
              <div className="d-inline-flex align-items-center gap-2 bg-warning bg-opacity-20 text-warning rounded-pill px-3 py-1 fw-bold small mb-3 border border-warning border-opacity-30">
                <Flame size={16} />
                <span>HOT FLASH DEALS HUB</span>
              </div>

              <h1 className="font-heading display-4 fw-extrabold text-white mb-3" style={{ lineHeight: 1.12 }}>
                Up To <span className="text-warning">40% OFF</span> On Fresh Daily Farm Harvest
              </h1>

              <p className="fs-5 text-white-50 mb-4">
                Limited-time savings on certified pesticide-free organic vegetables, fresh fruits, and leafy greens.
              </p>

              {/* Countdown Timer */}
              <div className="d-flex align-items-center gap-2 gap-sm-3 mb-4 flex-wrap">
                <div className="text-center bg-black bg-opacity-40 rounded-4 px-3 py-2 border border-white border-opacity-20" style={{ minWidth: '70px' }}>
                  <span className="font-heading fs-3 fw-extrabold text-white d-block lh-1">
                    {String(timeLeft.days).padStart(2, '0')}
                  </span>
                  <span className="text-white-50" style={{ fontSize: '0.68rem', textTransform: 'uppercase' }}>Days</span>
                </div>

                <span className="fs-4 fw-bold text-warning">:</span>

                <div className="text-center bg-black bg-opacity-40 rounded-4 px-3 py-2 border border-white border-opacity-20" style={{ minWidth: '70px' }}>
                  <span className="font-heading fs-3 fw-extrabold text-white d-block lh-1">
                    {String(timeLeft.hours).padStart(2, '0')}
                  </span>
                  <span className="text-white-50" style={{ fontSize: '0.68rem', textTransform: 'uppercase' }}>Hours</span>
                </div>

                <span className="fs-4 fw-bold text-warning">:</span>

                <div className="text-center bg-black bg-opacity-40 rounded-4 px-3 py-2 border border-white border-opacity-20" style={{ minWidth: '70px' }}>
                  <span className="font-heading fs-3 fw-extrabold text-white d-block lh-1">
                    {String(timeLeft.minutes).padStart(2, '0')}
                  </span>
                  <span className="text-white-50" style={{ fontSize: '0.68rem', textTransform: 'uppercase' }}>Minutes</span>
                </div>

                <span className="fs-4 fw-bold text-warning">:</span>

                <div className="text-center bg-black bg-opacity-40 rounded-4 px-3 py-2 border border-white border-opacity-20" style={{ minWidth: '70px' }}>
                  <span className="font-heading fs-3 fw-extrabold text-warning d-block lh-1">
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </span>
                  <span className="text-white-50" style={{ fontSize: '0.68rem', textTransform: 'uppercase' }}>Seconds</span>
                </div>
              </div>
            </div>

            <div className="col-lg-5 text-center">
              <div className="position-relative d-inline-block mx-auto" style={{ maxWidth: '380px', width: '100%' }}>
                <div className="position-relative" style={{ height: '260px' }}>
                  <Image
                    src="/images/hero_exotic_veggies.png"
                    alt="Flash Farm Deals"
                    fill
                    className="object-fit-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Claim Coupons Banner Row */}
        <div className="row g-3 mb-5">
          <div className="col-12 col-md-6">
            <div className="p-4 rounded-4 bg-white border shadow-sm d-flex align-items-center justify-content-between">
              <div>
                <span className="badge bg-danger bg-opacity-10 text-danger fw-bold px-3 py-1 rounded-pill small mb-1">
                  OFFICIAL COUPON
                </span>
                <h5 className="font-heading fw-extrabold text-dark mb-1">Get 20% OFF Entire Order</h5>
                <p className="text-muted small mb-0">Use Code: <strong className="text-success">FRESH20</strong></p>
              </div>

              <div className="p-3 rounded-circle bg-success bg-opacity-10 text-success">
                <Tag size={28} />
              </div>
            </div>
          </div>

          <div className="col-12 col-md-6">
            <div className="p-4 rounded-4 bg-white border shadow-sm d-flex align-items-center justify-content-between">
              <div>
                <span className="badge bg-warning bg-opacity-20 text-warning fw-bold px-3 py-1 rounded-pill small mb-1">
                  FIRST ORDER DEAL
                </span>
                <h5 className="font-heading fw-extrabold text-dark mb-1">Extra 10% OFF First Order</h5>
                <p className="text-muted small mb-0">Use Code: <strong className="text-success">FIRST10</strong></p>
              </div>

              <div className="p-3 rounded-circle bg-warning bg-opacity-10 text-warning">
                <Sparkles size={28} />
              </div>
            </div>
          </div>
        </div>

        {/* Flash Deals Produce Catalog */}
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div>
            <h3 className="font-heading fw-extrabold text-dark mb-0">
              Active Flash Sale Produce ({dealProducts.length})
            </h3>
            <p className="text-muted small mb-0">Handpicked organic items with active price cuts</p>
          </div>
        </div>

        <div className="row g-4">
          {dealProducts.map((product) => (
            <div key={product.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
              <ProductCard product={product} onQuickView={openQuickView} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
