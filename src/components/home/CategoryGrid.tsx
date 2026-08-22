'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useProducts } from '@/context/ProductContext';
import { motion } from 'framer-motion';
import { ArrowRight, Leaf, ChevronLeft, ChevronRight } from 'lucide-react';

export const CategoryGrid: React.FC = () => {
  const router = useRouter();
  const { categories } = useProducts();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  const haloBgs = ['halo-bg-1', 'halo-bg-2', 'halo-bg-3', 'halo-bg-4', 'halo-bg-5', 'halo-bg-6'];

  // Auto-sliding ticker
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          scrollRef.current.scrollBy({ left: 240, behavior: 'smooth' });
        }
      }
    }, 3500);

    return () => clearInterval(interval);
  }, [isPaused]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -280 : 280;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleCategoryClick = (catId: string) => {
    router.push(`/shop?category=${catId}`);
  };

  return (
    <section className="py-5 bg-white" id="categories">
      <div className="container py-3">
        {/* Section Header */}
        <div className="d-flex flex-column flex-sm-row align-items-sm-end justify-content-between mb-4 pb-2">
          <div>
            <h3 className="font-heading display-6 fw-extrabold text-dark mb-1 d-flex align-items-center gap-2">
              <span>Shop By</span>
              <span style={{ color: '#0A6836' }}>Category</span>
              <Leaf size={24} className="text-success" />
            </h3>
            <p className="text-muted small mb-0">Explore our wide range of fresh and healthy organic produce</p>
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

            <button
              onClick={() => router.push('/shop')}
              className="btn btn-link text-success fw-bold text-decoration-none d-inline-flex align-items-center gap-1 ms-2 p-0 fs-6 border-0 bg-transparent"
            >
              <span>View All</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>

        {/* Circular Halo Category Slider - Auto Sliding + Pause on Hover */}
        <div
          ref={scrollRef}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="d-flex gap-4 overflow-auto pb-3 pt-2 scrollbar-none snap-x"
          style={{ scrollBehavior: 'smooth', msOverflowStyle: 'none', scrollbarWidth: 'none' }}
        >
          {categories.map((cat, idx) => (
            <div
              key={cat.id}
              className="flex-shrink-0"
              style={{ width: '165px' }}
            >
              <motion.div
                whileHover={{ y: -8, scale: 1.03 }}
                transition={{ duration: 0.25 }}
                onClick={() => handleCategoryClick(cat.id)}
                className="category-halo-card cursor-pointer p-2 rounded-4"
                style={{ cursor: 'pointer' }}
              >
                {/* Halo Circle Container */}
                <div className={`halo-circle ${haloBgs[idx % haloBgs.length]} overflow-hidden rounded-circle mx-auto mb-2`}>
                  <div className="position-relative w-100 h-100 p-3 d-flex align-items-center justify-content-center">
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      fill
                      className="object-fit-cover rounded-circle p-1"
                      sizes="120px"
                    />
                  </div>
                </div>

                <h6 className="font-heading fw-bold mb-1 text-dark text-center" style={{ fontSize: '0.95rem' }}>
                  {cat.name}
                </h6>
                <span className="small text-muted d-block text-center" style={{ fontSize: '0.78rem' }}>
                  {cat.productCount}+ Items
                </span>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
