'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useProducts } from '@/context/ProductContext';
import { ProductCard } from '@/components/product/ProductCard';
import { Product } from '@/types';
import { ArrowRight, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';

interface BestSellersProps {
  onQuickView: (product: Product) => void;
}

export const BestSellers: React.FC<BestSellersProps> = ({ onQuickView }) => {
  const { products } = useProducts();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-slide products every 3.5 seconds, pauses when mouse hovers over
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          scrollRef.current.scrollBy({ left: 290, behavior: 'smooth' });
        }
      }
    }, 3500);

    return () => clearInterval(interval);
  }, [isPaused]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -310 : 310;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-5 bg-cream position-relative" id="bestsellers">
      <div className="container py-2">
        {/* Section Header */}
        <div className="d-flex flex-column flex-sm-row align-items-sm-end justify-content-between mb-4">
          <div>
            <div className="d-flex align-items-center gap-1 text-success fw-bold small mb-1">
              <Sparkles size={16} />
              <span>POPULAR HARVEST</span>
            </div>
            <h3 className="font-heading display-6 fw-extrabold text-dark mb-0">
              Best Selling <span style={{ color: '#0A6836' }}>Products</span>
            </h3>
            <p className="text-muted small mb-0 mt-1">Our most loved fresh organic picks delivered daily</p>
          </div>

          <div className="d-flex align-items-center gap-2 mt-3 mt-sm-0">
            <button
              onClick={() => scroll('left')}
              className="btn btn-light rounded-circle p-2 shadow-sm border"
              aria-label="Scroll Left"
            >
              <ChevronLeft size={18} />
            </button>

            <button
              onClick={() => scroll('right')}
              className="btn btn-light rounded-circle p-2 shadow-sm border"
              aria-label="Scroll Right"
            >
              <ChevronRight size={18} />
            </button>

            <Link
              href="/shop"
              className="btn btn-link text-success fw-bold text-decoration-none d-inline-flex align-items-center gap-1 ms-2 p-0 fs-6"
            >
              <span>View All</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>

        {/* Products Auto-Sliding Row - Pauses on Mouse Hover */}
        <div
          ref={scrollRef}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="d-flex gap-4 overflow-auto pb-4 pt-2 scrollbar-none snap-x"
          style={{ scrollBehavior: 'smooth', msOverflowStyle: 'none', scrollbarWidth: 'none' }}
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="flex-shrink-0"
              style={{ width: '275px' }}
            >
              <ProductCard product={product} onQuickView={onQuickView} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
