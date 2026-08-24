'use client';

import React, { useState } from 'react';
import { HeroCarousel } from '@/components/home/HeroCarousel';
import { CategoryGrid } from '@/components/home/CategoryGrid';
import { FlashSale } from '@/components/home/FlashSale';
import { BestSellers } from '@/components/home/BestSellers';
import { PromoBanners } from '@/components/home/PromoBanners';
import { TrustSection } from '@/components/home/TrustSection';
import { ScrollFloatingVeggies } from '@/components/ui/ScrollFloatingVeggies';
import { useQuickView } from '@/context/QuickViewContext';
import { Star, ChevronLeft, ChevronRight, Award } from 'lucide-react';
import { motion } from 'framer-motion';

import { HomeProduceMarketplace } from '@/components/home/HomeProduceMarketplace';

export default function HomePage() {
  const { openQuickView } = useQuickView();

  const [activeReviewIndex, setActiveReviewIndex] = useState(0);

  const customerReviews = [
    {
      name: 'Ananya R.',
      location: 'Bangalore, Karnataka',
      comment: 'The vegetables are extremely fresh and last longer. Delivery is always on time, FreshVana has become my go-to store!',
      rating: 5,
      avatar: 'A'
    },
    {
      name: 'Dr. Vikram Malhotra',
      location: 'Delhi, India',
      comment: 'I love the quality and packaging. You can really taste the freshness. Highly recommended!',
      rating: 5,
      avatar: 'V'
    },
    {
      name: 'Shalini Sen',
      location: 'Mumbai, Maharashtra',
      comment: 'Best organic produce I have ever had online. My kids love the taste of the fruits and veggies!',
      rating: 5,
      avatar: 'S'
    },
    {
      name: 'Rahul Sharma',
      location: 'Pune, Maharashtra',
      comment: 'Zero soil residue and crisp spinach leaves. 10/10 quality and fast doorstep delivery.',
      rating: 5,
      avatar: 'R'
    }
  ];

  const handlePrevReview = () => {
    setActiveReviewIndex((prev) => (prev - 1 + customerReviews.length) % customerReviews.length);
  };

  const handleNextReview = () => {
    setActiveReviewIndex((prev) => (prev + 1) % customerReviews.length);
  };

  return (
    <div className="position-relative">
      {/* Scroll-driven floating organic veggies */}
      <ScrollFloatingVeggies />

      {/* 1. Hero Carousel */}
      <HeroCarousel />

      {/* 2. Category Grid */}
      <CategoryGrid />

      {/* 3. Live Direct Farm Produce Marketplace (All Fruits & Vegetables Ordering) */}
      <HomeProduceMarketplace />

      {/* 4. Grand Flash Sale Hero Banner */}
      <FlashSale />

      {/* 5. Best Selling Products */}
      <BestSellers onQuickView={openQuickView} />

      {/* 5. 3 Promo Banners Row */}
      <PromoBanners />

      {/* 6. 4 Trust Features Row */}
      <TrustSection />

      {/* 7. Real Experiences / Testimonials Section matching reference UI */}
      <section className="py-5 bg-cream" id="about">
        <div className="container py-3">
          <div className="text-center max-w-2xl mx-auto mb-4">
            <span className="badge bg-success bg-opacity-10 text-success fw-bold px-3 py-1 rounded-pill small mb-2">
              TESTIMONIALS
            </span>
            <h2 className="font-heading display-6 fw-extrabold text-dark mb-2">
              Real Experiences from FreshVana Lovers
            </h2>
            <p className="text-muted small">
              Join thousands of happy customers who trust us for their daily fresh needs.
            </p>
          </div>

          {/* Testimonial Cards Carousel Container */}
          <div className="position-relative">
            {/* Left & Right Carousel Control Buttons */}
            <div className="d-flex justify-content-end gap-2 mb-3">
              <button
                onClick={handlePrevReview}
                className="btn btn-light rounded-circle p-2 shadow-sm border"
                aria-label="Previous Review"
              >
                <ChevronLeft size={18} />
              </button>

              <button
                onClick={handleNextReview}
                className="btn btn-light rounded-circle p-2 shadow-sm border"
                aria-label="Next Review"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            <div className="row g-4">
              {customerReviews.slice(0, 3).map((rev, idx) => (
                <div key={idx} className="col-12 col-md-4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: idx * 0.1 }}
                    className="p-4 rounded-4 bg-white border shadow-sm h-100 d-flex flex-column justify-content-between"
                  >
                    <div>
                      <div className="d-flex align-items-center gap-1 mb-3 text-warning">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} size={15} fill="#FFB800" stroke="none" />
                        ))}
                      </div>
                      <p className="text-muted mb-4" style={{ lineHeight: 1.6, fontSize: '0.92rem' }}>
                        &quot;{rev.comment}&quot;
                      </p>
                    </div>

                    <div className="pt-3 border-top d-flex align-items-center gap-3">
                      <div
                        className="rounded-circle bg-success text-white fw-bold d-flex align-items-center justify-content-center flex-shrink-0"
                        style={{ width: '40px', height: '40px' }}
                      >
                        {rev.avatar}
                      </div>
                      <div>
                        <div className="fw-bold text-dark font-heading small">{rev.name}</div>
                        <div className="text-muted" style={{ fontSize: '0.72rem' }}>{rev.location}</div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
