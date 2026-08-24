'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useProducts } from '@/context/ProductContext';
import { ProductCard } from '@/components/product/ProductCard';
import { useQuickView } from '@/context/QuickViewContext';
import {
  Sparkles,
  Search,
  SlidersHorizontal,
  Layers,
  Leaf,
  Tag,
  ShieldCheck,
  TrendingUp,
  ArrowRight,
  RotateCcw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const HomeProduceMarketplace: React.FC = () => {
  const { products, categories } = useProducts();
  const { openQuickView } = useQuickView();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [organicOnly, setOrganicOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>('popularity');
  const [maxPrice, setMaxPrice] = useState<number>(350);
  const [minRating, setMinRating] = useState<number>(0);

  // Filter products dynamically
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category filter
      if (selectedCategory !== 'all') {
        const matchesCat =
          p.categoryId === selectedCategory ||
          p.category.toLowerCase().includes(selectedCategory.toLowerCase());
        if (!matchesCat) return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesQuery =
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q);
        if (!matchesQuery) return false;
      }

      // Organic switch filter
      if (organicOnly && p.badge !== 'Organic') {
        return false;
      }

      if (p.price > maxPrice || (minRating > 0 && p.rating < minRating)) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'discount') return b.discountPercentage - a.discountPercentage;
      return b.reviewsCount - a.reviewsCount; // Popularity default
    });
  }, [products, selectedCategory, searchQuery, organicOnly, sortBy, maxPrice, minRating]);

  const resetFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setOrganicOnly(false);
    setSortBy('popularity');
    setMaxPrice(350);
    setMinRating(0);
  };

  const hasActiveFilters = selectedCategory !== 'all' || Boolean(searchQuery) || organicOnly || maxPrice !== 350 || minRating !== 0 || sortBy !== 'popularity';

  return (
    <section className="py-5 bg-cream position-relative" id="marketplace">
      <div className="container py-3">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-4">
          <span className="badge bg-success bg-opacity-10 text-success font-heading fw-bold px-3 py-2 rounded-pill small mb-2 border border-success border-opacity-25">
            🌿 LIVE DIRECT FARM MARKETPLACE
          </span>
          <h2 className="font-heading display-5 fw-extrabold text-dark mb-2">
            Order All Fresh Produce <span style={{ color: '#0A6836' }}>Directly From Home</span>
          </h2>
          <p className="text-muted small mb-0">
            Browse our complete range of certified organic fruits, vegetables, and daily essentials. Order in 1-click!
          </p>
        </div>

        {/* Category Selector Pill Bar */}
        <div className="d-flex align-items-center gap-2 overflow-auto pb-3 pt-1 px-1 scrollbar-none snap-x mb-4 justify-content-start justify-content-md-center">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`btn rounded-pill px-4 py-2 fw-bold text-nowrap transition-all ${
              selectedCategory === 'all'
                ? 'btn-success text-white shadow-sm'
                : 'btn-white text-dark border'
            }`}
            style={selectedCategory === 'all' ? { background: '#0A6836', border: 'none' } : { background: '#FFFFFF' }}
          >
            All Produce ({products.length})
          </button>

          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`btn rounded-pill px-4 py-2 fw-bold text-nowrap transition-all ${
                  isSelected
                    ? 'btn-success text-white shadow-sm'
                    : 'btn-white text-dark border'
                }`}
                style={isSelected ? { background: '#0A6836', border: 'none' } : { background: '#FFFFFF' }}
              >
                {cat.name}
              </button>
            );
          })}
        </div>

        {/* Search, filter and sort controls */}
        <div className="bg-white rounded-4 p-3 shadow-sm border mb-4">
          <div className="row g-3 align-items-center">
            {/* Live Search Input */}
            <div className="col-12 col-md-5">
              <div className="input-group rounded-pill overflow-hidden border bg-light">
                <span className="input-group-text bg-transparent border-0 text-muted ps-3">
                  <Search size={18} />
                </span>
                <input
                  type="text"
                  placeholder="Search carrots, apples, spinach, tomatoes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="form-control border-0 bg-transparent py-2 text-dark small shadow-none"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="btn btn-sm btn-link text-muted pe-3 text-decoration-none"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Sort By Dropdown */}
            <div className="col-6 col-md-4">
              <div className="d-flex align-items-center gap-2">
                <label className="small text-muted font-heading fw-bold text-nowrap mb-0 d-none d-sm-inline">
                  Sort:
                </label>
                <select
                  className="form-select form-select-sm rounded-pill border py-2 px-3 small w-100"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="popularity">Most Popular</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="discount">Biggest Discount</option>
                </select>
              </div>
            </div>

            {/* Organic Switch Filter */}
            <div className="col-6 col-md-3 text-end">
              <div className="form-check form-switch d-inline-flex align-items-center justify-content-end mb-0">
                <input
                  className="form-check-input me-2 cursor-pointer"
                  type="checkbox"
                  id="homeOrganicSwitch"
                  checked={organicOnly}
                  onChange={(e) => setOrganicOnly(e.target.checked)}
                />
                <label className="form-check-label font-heading fw-bold text-dark small cursor-pointer" htmlFor="homeOrganicSwitch">
                  100% Organic Only
                </label>
              </div>
            </div>
          </div>

          <div className="row g-3 align-items-center border-top mt-3 pt-3">
            <div className="col-12 col-md-5">
              <div className="d-flex align-items-center gap-3">
                <label className="small text-dark fw-bold text-nowrap mb-0">Max price</label>
                <input
                  type="range"
                  className="form-range mb-0"
                  min="20"
                  max="350"
                  step="10"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  aria-label="Maximum product price"
                />
                <strong className="small text-success text-nowrap">₹{maxPrice}</strong>
              </div>
            </div>

            <div className="col-7 col-md-4">
              <div className="d-flex align-items-center gap-2">
                <label className="small text-dark fw-bold text-nowrap mb-0">Rating</label>
                <select
                  className="form-select form-select-sm rounded-pill"
                  value={minRating}
                  onChange={(e) => setMinRating(Number(e.target.value))}
                  aria-label="Minimum rating"
                >
                  <option value="0">All ratings</option>
                  <option value="4">4★ & above</option>
                  <option value="4.5">4.5★ & above</option>
                </select>
              </div>
            </div>

            <div className="col-5 col-md-3 text-end">
              {hasActiveFilters ? (
                <button type="button" onClick={resetFilters} className="btn btn-outline-success btn-sm rounded-pill px-3 fw-bold">
                  <RotateCcw size={14} className="me-1" /> Clear filters
                </button>
              ) : (
                <span className="small text-muted">{filteredProducts.length} fresh picks</span>
              )}
            </div>
          </div>
        </div>

        <div className="d-flex align-items-center justify-content-between mb-3 px-1">
          <span className="small text-muted"><strong className="text-success">{filteredProducts.length}</strong> products ready to add</span>
          <Link href="/shop" className="small fw-bold text-success text-decoration-none d-inline-flex align-items-center gap-1">
            View full shop <ArrowRight size={15} />
          </Link>
        </div>

        {/* Product Cards Responsive Grid (2 columns on mobile) */}
        {filteredProducts.length > 0 ? (
          <div className="row g-2 g-sm-3 g-md-4">
            {filteredProducts.map((product) => (
              <div key={product.id} className="col-6 col-md-4 col-lg-3">
                <ProductCard product={product} onQuickView={openQuickView} />
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-5 p-5 text-center shadow-sm border my-4">
            <Leaf size={48} className="text-muted mb-3 opacity-50 mx-auto d-block" />
            <h4 className="font-heading fw-bold text-dark mb-2">No Produce Matching Filter</h4>
            <p className="text-muted small mb-4">
              Try searching for a different fruit or vegetable, or reset your category selection.
            </p>
            <button
              onClick={() => {
                resetFilters();
              }}
              className="btn btn-success rounded-pill px-4 py-2 fw-bold border-0 shadow-sm text-white"
              style={{ background: '#0A6836' }}
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
