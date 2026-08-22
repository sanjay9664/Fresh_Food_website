'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight, Leaf, ShieldCheck, Truck, Award, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const HeroCarousel: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const slides = [
    {
      id: 1,
      badge: 'UP TO 40% OFF',
      title: 'Freshness From Farm To Your Door',
      subtitle: 'Handpicked fruits and vegetables, delivered fresh to your doorstep within 12 hours.',
      image: '/images/c1.png',
      ctaPrimaryText: 'Shop Now',
      ctaPrimaryLink: '/shop',
      ctaSecondaryText: 'Explore Collection',
      ctaSecondaryLink: '/categories'
    },
    {
      id: 2,
      badge: '100% ORGANIC',
      title: 'Pure Pesticide-Free Daily Vegetables',
      subtitle: 'Harvested directly from certified hydroponic and organic local green farms.',
      image: '/images/c3.png',
      ctaPrimaryText: 'Browse Vegetables',
      ctaPrimaryLink: '/shop?category=veggies',
      ctaSecondaryText: 'View Categories',
      ctaSecondaryLink: '/categories'
    },
    {
      id: 3,
      badge: 'FLASH DEALS',
      title: 'Exotic Bell Peppers & Leafy Harvest',
      subtitle: 'Save big on sweet capsicum, crisp kale, avocados, and hydroponic greens.',
      image: '/images/c4.png',
      ctaPrimaryText: 'Claim Deals',
      ctaPrimaryLink: '/deals',
      ctaSecondaryText: 'Explore All Produce',
      ctaSecondaryLink: '/shop'
    },
    {
      id: 4,
      badge: 'TOP HARVEST',
      title: 'Farm Fresh Harvest & Herbal Essentials',
      subtitle: 'Clean, nutrient-packed coriander, sweet potatoes, and daily cooking essentials.',
      image: '/images/c5.png',
      ctaPrimaryText: 'Shop Fresh Harvest',
      ctaPrimaryLink: '/shop',
      ctaSecondaryText: 'Our Farm Story',
      ctaSecondaryLink: '/about'
    },
    {
      id: 5,
      badge: 'EXOTIC ORCHARD',
      title: 'Juicy Tropical & Sun-Ripened Fruits',
      subtitle: 'Alphonso mangoes, Royal Gala apples, bananas, and seedless sweet grapes.',
      image: '/images/c6.png',
      ctaPrimaryText: 'Explore Fruit Orchard',
      ctaPrimaryLink: '/shop?category=fruits',
      ctaSecondaryText: 'Special Offers',
      ctaSecondaryLink: '/deals'
    }
  ];

  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isPaused, slides.length]);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const current = slides[currentSlide] || slides[0];

  return (
    <section
      className="position-relative overflow-hidden bg-cream hero-carousel-section"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="container">
        <div
          className="rounded-5 position-relative overflow-hidden shadow-sm border p-3 p-sm-4 p-md-5"
          style={{
            background: 'linear-gradient(135deg, #F4FBF7 0%, #E8F7EE 50%, #F4FBF7 100%)',
            minHeight: '380px',
            borderColor: '#D1E7DD'
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, x: 25 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -25 }}
              transition={{ duration: 0.45 }}
              className="row align-items-center gy-3 gy-md-4 position-relative"
              style={{ zIndex: 2 }}
            >
              {/* Left Column: Heading, Subtitle, 4 Badges, CTA Buttons */}
              <div className="col-lg-6 text-center text-lg-start">
                <div className="d-inline-flex align-items-center gap-2 bg-success bg-opacity-10 text-success rounded-pill px-3 py-1 fw-bold small mb-2 mb-md-3 border border-success border-opacity-25 mx-auto mx-lg-0">
                  <Sparkles size={16} />
                  <span>{current.badge}</span>
                </div>

                <h1
                  className="font-heading display-6 display-md-5 fw-extrabold text-dark mb-2 mb-md-3 text-center text-lg-start"
                  style={{ lineHeight: 1.18, letterSpacing: '-0.5px' }}
                >
                  {current.title.split('Freshness').map((part, i) =>
                    i === 0 ? (
                      <React.Fragment key={i}>
                        <span style={{ color: '#0A6836' }}>Freshness</span>
                        {part}
                      </React.Fragment>
                    ) : (
                      part
                    )
                  )}
                </h1>

                <p className="fs-6 fs-md-5 text-muted mb-3 mb-md-4 text-center text-lg-start" style={{ lineHeight: 1.5 }}>
                  {current.subtitle}
                </p>

                {/* 4 Feature Badges Row */}
                <div className="row g-2 mb-3 mb-md-4 justify-content-center justify-content-lg-start">
                  <div className="col-6 col-sm-3">
                    <div className="bg-white rounded-3 p-2 text-center border shadow-xs">
                      <div className="p-1 rounded-circle bg-success bg-opacity-10 text-success d-inline-flex mb-1">
                        <Leaf size={14} />
                      </div>
                      <strong className="d-block text-dark font-heading" style={{ fontSize: '0.72rem' }}>
                        Farm Fresh
                      </strong>
                      <span className="text-muted d-block" style={{ fontSize: '0.62rem' }}>
                        Direct From Farms
                      </span>
                    </div>
                  </div>

                  <div className="col-6 col-sm-3">
                    <div className="bg-white rounded-3 p-2 text-center border shadow-xs">
                      <div className="p-1 rounded-circle bg-success bg-opacity-10 text-success d-inline-flex mb-1">
                        <ShieldCheck size={14} />
                      </div>
                      <strong className="d-block text-dark font-heading" style={{ fontSize: '0.72rem' }}>
                        100% Organic
                      </strong>
                      <span className="text-muted d-block" style={{ fontSize: '0.62rem' }}>
                        Chemical Free
                      </span>
                    </div>
                  </div>

                  <div className="col-6 col-sm-3">
                    <div className="bg-white rounded-3 p-2 text-center border shadow-xs">
                      <div className="p-1 rounded-circle bg-success bg-opacity-10 text-success d-inline-flex mb-1">
                        <Truck size={14} />
                      </div>
                      <strong className="d-block text-dark font-heading" style={{ fontSize: '0.72rem' }}>
                        Fast Delivery
                      </strong>
                      <span className="text-muted d-block" style={{ fontSize: '0.62rem' }}>
                        On Time Always
                      </span>
                    </div>
                  </div>

                  <div className="col-6 col-sm-3">
                    <div className="bg-white rounded-3 p-2 text-center border shadow-xs">
                      <div className="p-1 rounded-circle bg-success bg-opacity-10 text-success d-inline-flex mb-1">
                        <Award size={14} />
                      </div>
                      <strong className="d-block text-dark font-heading" style={{ fontSize: '0.72rem' }}>
                        Best Quality
                      </strong>
                      <span className="text-muted d-block" style={{ fontSize: '0.62rem' }}>
                        Quality Checked
                      </span>
                    </div>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="d-flex align-items-center justify-content-center justify-content-lg-start gap-2 gap-sm-3 flex-wrap">
                  <Link
                    href={current.ctaPrimaryLink}
                    className="btn btn-success rounded-pill px-3 px-sm-4 py-2 py-sm-3 fw-bold text-white d-inline-flex align-items-center gap-2 shadow flex-grow-1 flex-sm-grow-0 justify-content-center"
                    style={{ background: '#0A6836', border: 'none', fontSize: '0.9rem' }}
                  >
                    <span>{current.ctaPrimaryText}</span>
                    <ArrowRight size={16} />
                  </Link>

                  <Link
                    href={current.ctaSecondaryLink}
                    className="btn btn-white rounded-pill px-3 px-sm-4 py-2 py-sm-3 fw-bold text-dark d-inline-flex align-items-center gap-2 shadow-sm border flex-grow-1 flex-sm-grow-0 justify-content-center"
                    style={{ fontSize: '0.9rem' }}
                  >
                    <span>{current.ctaSecondaryText}</span>
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>

              {/* Right Column: Large Produce Visual + UP TO 40% OFF Circular Badge */}
              <div className="col-lg-6 text-center position-relative">
                {/* Circular Badge Top Right (Desktop/Tablet) */}
                <div
                  className="position-absolute top-0 end-0 rounded-circle text-white d-none d-sm-flex flex-column align-items-center justify-content-center shadow-lg"
                  style={{
                    width: '75px',
                    height: '75px',
                    background: 'linear-gradient(135deg, #0A6836, #064E28)',
                    zIndex: 5,
                    border: '2px solid #FFFFFF'
                  }}
                >
                  <span style={{ fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    UP TO
                  </span>
                  <strong className="font-heading fw-extrabold fs-6 lh-1">40%</strong>
                  <span style={{ fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    OFF
                  </span>
                </div>

                {/* Produce Visual Image */}
                <div className="position-relative d-inline-block mx-auto" style={{ maxWidth: '440px', width: '100%' }}>
                  <div
                    className="position-relative hero-image-container"
                    style={{
                      filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.15))'
                    }}
                  >
                    <Image
                      src={current.image}
                      alt={current.title}
                      fill
                      className="object-fit-contain p-2"
                      priority
                      sizes="(max-width: 768px) 100vw, 45vw"
                      style={{ mixBlendMode: 'multiply' }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Carousel Arrows (Desktop / Tablet side navigation) */}
          <button
            onClick={handlePrev}
            className="btn btn-white btn-sm rounded-circle p-2 position-absolute top-50 start-0 translate-middle-y ms-3 shadow border text-dark d-none d-md-flex align-items-center justify-content-center"
            style={{ zIndex: 10, width: '40px', height: '40px' }}
            aria-label="Previous Slide"
          >
            <ChevronLeft size={20} />
          </button>

          <button
            onClick={handleNext}
            className="btn btn-white btn-sm rounded-circle p-2 position-absolute top-50 end-0 translate-middle-y me-3 shadow border text-dark d-none d-md-flex align-items-center justify-content-center"
            style={{ zIndex: 10, width: '40px', height: '40px' }}
            aria-label="Next Slide"
          >
            <ChevronRight size={20} />
          </button>

          {/* Bottom Dots Indicator with Mobile Nav Buttons */}
          <div className="position-absolute bottom-0 start-50 translate-middle-x mb-2 mb-md-3 d-flex align-items-center gap-2" style={{ zIndex: 10 }}>
            <button
              onClick={handlePrev}
              className="btn btn-sm text-dark p-1 d-md-none border-0 bg-transparent opacity-75"
              aria-label="Previous Slide"
            >
              <ChevronLeft size={18} />
            </button>

            {slides.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => setCurrentSlide(idx)}
                className={`btn p-0 rounded-pill transition-all ${
                  currentSlide === idx ? 'bg-success' : 'bg-secondary bg-opacity-30'
                }`}
                style={{
                  width: currentSlide === idx ? '26px' : '8px',
                  height: '8px',
                  border: 'none',
                  background: currentSlide === idx ? '#0A6836' : undefined
                }}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}

            <button
              onClick={handleNext}
              className="btn btn-sm text-dark p-1 d-md-none border-0 bg-transparent opacity-75"
              aria-label="Next Slide"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
