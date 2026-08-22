'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useProducts } from '@/context/ProductContext';
import { categories } from '@/data/categories';
import { ProductCard } from '@/components/product/ProductCard';
import { useQuickView } from '@/context/QuickViewContext';
import {
  Filter,
  Search,
  SlidersHorizontal,
  RotateCcw,
  Sparkles,
  Leaf,
  Tag,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { motion } from 'framer-motion';

function ShopContent() {
  const { products } = useProducts();
  const { openQuickView } = useQuickView();
  const searchParams = useSearchParams();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<number>(350);
  const [minRating, setMinRating] = useState<number>(0);
  const [organicOnly, setOrganicOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>('popularity');
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);

  // React to URL query parameters dynamically
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [searchParams]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (selectedCategory !== 'all') {
      result = result.filter(
        (p) =>
          p.categoryId === selectedCategory ||
          p.category.toLowerCase().includes(selectedCategory.toLowerCase())
      );
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
      );
    }

    result = result.filter((p) => p.price <= maxPrice);

    if (minRating > 0) {
      result = result.filter((p) => p.rating >= minRating);
    }

    if (organicOnly) {
      result = result.filter((p) => p.badge === 'Organic');
    }

    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'discount') {
      result.sort((a, b) => b.discountPercentage - a.discountPercentage);
    }

    return result;
  }, [products, selectedCategory, searchQuery, maxPrice, minRating, organicOnly, sortBy]);

  const resetFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setMaxPrice(350);
    setMinRating(0);
    setOrganicOnly(false);
    setSortBy('popularity');
  };

  return (
    <div className="bg-cream min-vh-100" style={{ paddingTop: '110px' }}>
      {/* Full-Width Shop Hero Banner Touching Under Navbar */}
      <section
        className="w-100 position-relative py-5 px-3 text-white overflow-hidden"
        style={{
          backgroundImage: 'linear-gradient(180deg, rgba(4, 57, 29, 0.88) 0%, rgba(6, 78, 40, 0.90) 50%, rgba(10, 104, 54, 0.92) 100%), url(/images/login_bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          minHeight: '380px',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <div className="container position-relative py-3" style={{ zIndex: 3 }}>
          <div className="row align-items-center gy-4">
            <div className="col-lg-7">
              <div className="d-inline-flex align-items-center gap-2 bg-white bg-opacity-20 rounded-pill px-3 py-1 text-white fw-bold small mb-3 border border-white border-opacity-30">
                <Sparkles size={16} className="text-warning" />
                <span>FRESH HARVEST MARKETPLACE</span>
              </div>

              <h1 className="font-heading display-4 fw-extrabold text-white mb-2" style={{ lineHeight: 1.12 }}>
                100% Certified Organic Farm Marketplace
              </h1>

              <p className="fs-5 text-white-50 mb-4">
                Pesticide-free vegetables, seasonal fruits, and leafy hydroponic greens delivered fresh daily.
              </p>

              <div className="d-flex align-items-center gap-3 text-white-50 small flex-wrap">
                <div className="d-flex align-items-center gap-2 bg-black bg-opacity-30 rounded-pill px-3 py-2 border border-white border-opacity-20">
                  <Tag size={16} className="text-warning" />
                  <span>Use Coupon: <strong className="text-warning">FRESH20</strong> for 20% OFF</span>
                </div>
                <div className="d-flex align-items-center gap-2 bg-black bg-opacity-30 rounded-pill px-3 py-2 border border-white border-opacity-20">
                  <ShieldCheck size={16} className="text-warning" />
                  <span>100% Chemical-Free Guarantee</span>
                </div>
              </div>
            </div>

            <div className="col-lg-5 text-center">
              <div className="position-relative mx-auto" style={{ maxWidth: '380px', width: '100%', height: '240px' }}>
                <Image
                  src="/images/hero_fruits_collection.png"
                  alt="Fresh Organic Fruits"
                  fill
                  className="object-fit-contain"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Catalog Section */}
      <div className="container py-5">
        {/* Mobile Filter Toggle */}
        <div className="d-lg-none mb-3">
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="btn btn-success rounded-pill px-4 py-2 w-100 fw-bold d-flex align-items-center justify-content-center gap-2 shadow-sm"
            style={{ background: '#0A6836' }}
          >
            <Filter size={18} />
            <span>Filter Marketplace ({filteredProducts.length} Items)</span>
          </button>
        </div>

        <div className="row g-4">
          {/* Left Sidebar Filters */}
          <div className={`col-lg-3 ${mobileFilterOpen ? 'd-block' : 'd-none d-lg-block'}`}>
            <div className="bg-white rounded-5 p-4 shadow-sm border position-sticky" style={{ top: '160px' }}>
              <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom">
                <div className="d-flex align-items-center gap-2">
                  <SlidersHorizontal size={18} className="text-success" />
                  <h5 className="font-heading fw-extrabold mb-0 text-dark">Filter Produce</h5>
                </div>

                <button
                  onClick={resetFilters}
                  className="btn btn-sm btn-link text-muted text-decoration-none p-0 border-0 small d-flex align-items-center gap-1"
                  title="Reset Filters"
                >
                  <RotateCcw size={12} />
                  <span>Reset</span>
                </button>
              </div>

              {/* Search Produce Input */}
              <div className="mb-4">
                <label className="form-label font-heading fw-bold text-dark small mb-2">
                  Search Item
                </label>
                <div className="input-group border rounded-pill overflow-hidden bg-light">
                  <span className="input-group-text bg-transparent border-0 ps-3 text-muted">
                    <Search size={16} />
                  </span>
                  <input
                    type="text"
                    className="form-control border-0 bg-transparent py-2 small shadow-none"
                    placeholder="e.g. Tomato, Mango..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {/* Category Selector Radio List */}
              <div className="mb-4">
                <label className="form-label font-heading fw-bold text-dark small mb-2">
                  Select Category
                </label>
                <div className="d-flex flex-column gap-1">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`btn text-start rounded-3 py-2 px-3 small border-0 d-flex align-items-center justify-content-between ${
                      selectedCategory === 'all'
                        ? 'bg-success text-white fw-bold'
                        : 'text-dark hover-bg-light'
                    }`}
                    style={selectedCategory === 'all' ? { background: '#0A6836' } : {}}
                  >
                    <span>All Produce</span>
                    <span className={`badge ${selectedCategory === 'all' ? 'bg-white text-success' : 'bg-light text-muted'}`}>
                      {products.length}
                    </span>
                  </button>

                  {categories.map((cat) => {
                    const catCount = products.filter(
                      (p) => p.categoryId === cat.id || p.category.toLowerCase().includes(cat.name.toLowerCase())
                    ).length;

                    const isSel = selectedCategory === cat.id;

                    return (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`btn text-start rounded-3 py-2 px-3 small border-0 d-flex align-items-center justify-content-between ${
                          isSel ? 'bg-success text-white fw-bold' : 'text-dark hover-bg-light'
                        }`}
                        style={isSel ? { background: '#0A6836' } : {}}
                      >
                        <span>{cat.name}</span>
                        <span className={`badge ${isSel ? 'bg-white text-success' : 'bg-light text-muted'}`}>
                          {catCount || cat.productCount}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Max Price Range Slider */}
              <div className="mb-4">
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <label className="form-label font-heading fw-bold text-dark small mb-0">
                    Max Price
                  </label>
                  <strong className="text-success small">₹{maxPrice}</strong>
                </div>
                <input
                  type="range"
                  className="form-range text-success"
                  min="20"
                  max="350"
                  step="10"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                />
                <div className="d-flex justify-content-between small text-muted">
                  <span>₹20</span>
                  <span>₹350</span>
                </div>
              </div>

              {/* 100% Organic Switch */}
              <div className="form-check form-switch mb-2">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="organicSwitchShop"
                  checked={organicOnly}
                  onChange={(e) => setOrganicOnly(e.target.checked)}
                />
                <label className="form-check-input-label font-heading fw-bold text-dark small ms-2" htmlFor="organicSwitchShop">
                  100% Organic Certified Only
                </label>
              </div>
            </div>
          </div>

          {/* Right Main Grid Area */}
          <div className="col-lg-9">
            {/* Top Controls Bar */}
            <div className="bg-white rounded-4 p-3 shadow-sm border mb-4 d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3">
              <div className="d-flex align-items-center gap-2">
                <span className="badge bg-success bg-opacity-10 text-success font-heading fw-bold px-3 py-2 rounded-pill small">
                  {filteredProducts.length} Items Available
                </span>
                {selectedCategory !== 'all' && (
                  <span className="text-muted small">
                    Category: <strong className="text-dark">{categories.find((c) => c.id === selectedCategory)?.name || selectedCategory}</strong>
                  </span>
                )}
              </div>

              <div className="d-flex align-items-center gap-2">
                <label className="small text-muted font-heading fw-bold text-nowrap mb-0">Sort By:</label>
                <select
                  className="form-select form-select-sm rounded-pill border py-2 px-3 small"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  style={{ width: '180px' }}
                >
                  <option value="popularity">Popularity</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="discount">Biggest Discount</option>
                </select>
              </div>
            </div>

            {/* Product Cards Responsive Grid */}
            {filteredProducts.length > 0 ? (
              <div className="row g-4">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="col-12 col-sm-6 col-md-4">
                    <ProductCard product={product} onQuickView={openQuickView} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-5 p-5 text-center shadow-sm border my-4">
                <Leaf size={48} className="text-muted mb-3 opacity-50" />
                <h4 className="font-heading fw-bold text-dark mb-2">No Produce Found</h4>
                <p className="text-muted small mb-4">
                  No items matched your selected search or price filter.
                </p>
                <button
                  onClick={resetFilters}
                  className="btn btn-success rounded-pill px-4 py-2 fw-bold border-0 shadow-sm"
                  style={{ background: '#0A6836' }}
                >
                  Reset Marketplace Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="py-5 text-center">Loading Marketplace...</div>}>
      <ShopContent />
    </Suspense>
  );
}
