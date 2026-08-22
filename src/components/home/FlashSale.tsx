'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Flame, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export const FlashSale: React.FC = () => {
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
    <section className="py-4 bg-white">
      <div className="container">
        <div
          className="rounded-5 text-white position-relative overflow-hidden shadow-lg p-4 p-md-5"
          style={{
            background: 'linear-gradient(135deg, #04391D 0%, #064E28 50%, #0A6836 100%)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          {/* Subtle light trails background effect */}
          <div className="position-absolute top-0 start-0 w-100 h-100 pointer-events-none opacity-20 bg-radial-gradient" />

          <div className="row align-items-center gy-4 position-relative" style={{ zIndex: 2 }}>
            {/* Left Content Column */}
            <div className="col-lg-7">
              <div className="d-inline-flex align-items-center gap-2 bg-warning bg-opacity-20 text-warning rounded-pill px-3 py-1 fw-bold small mb-3 border border-warning border-opacity-30">
                <Flame size={16} />
                <span>Flash Sale</span>
              </div>

              <h2 className="font-heading display-4 fw-extrabold text-white mb-3" style={{ lineHeight: 1.15 }}>
                UP TO <span className="text-warning">40% OFF</span> <br className="d-none d-sm-block" />
                On Selected Fresh Vegetables
              </h2>

              {/* 4 Unit Digital Countdown Timer */}
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

              {/* Action Button */}
              <div className="mb-4">
                <Link
                  href="/shop?filter=deals"
                  className="btn btn-white btn-lg rounded-pill px-4 py-3 fw-bold text-dark d-inline-flex align-items-center gap-2 shadow"
                >
                  <span>Shop Now</span>
                  <ArrowRight size={18} className="text-success" />
                </Link>
              </div>

              {/* 3 Green Checks */}
              <div className="d-flex align-items-center gap-3 text-white-50 small flex-wrap">
                <div className="d-flex align-items-center gap-1">
                  <CheckCircle2 size={15} className="text-success" />
                  <span className="text-white">100% Organic</span>
                </div>
                <div className="d-flex align-items-center gap-1">
                  <CheckCircle2 size={15} className="text-success" />
                  <span className="text-white">Pesticide Free</span>
                </div>
                <div className="d-flex align-items-center gap-1">
                  <CheckCircle2 size={15} className="text-success" />
                  <span className="text-white">Freshly Picked</span>
                </div>
              </div>
            </div>

            {/* Right Vegetable Basket Visual + 100% Organic Seal */}
            <div className="col-lg-5 text-center position-relative">
              <div className="position-relative d-inline-block mx-auto" style={{ maxWidth: '440px', width: '100%' }}>
                {/* Green Circular 100% Organic Seal */}
                <div
                  className="position-absolute top-50 end-0 translate-middle-y rounded-circle bg-success text-white d-flex flex-column align-items-center justify-content-center fw-bold p-2 shadow-lg border border-3 border-white"
                  style={{ width: '100px', height: '100px', zIndex: 5, marginTop: '20px' }}
                >
                  <span style={{ fontSize: '0.9rem', lineHeight: 1 }}>100%</span>
                  <span style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>ORGANIC</span>
                  <span style={{ fontSize: '0.55rem', opacity: 0.8 }}>Certified</span>
                </div>

                <div className="position-relative" style={{ height: '300px' }}>
                  <Image
                    src="/images/c1.png"
                    alt="Flash Sale Vegetable Basket"
                    fill
                    className="object-fit-contain"
                    sizes="(max-width: 768px) 100vw, 40vw"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
