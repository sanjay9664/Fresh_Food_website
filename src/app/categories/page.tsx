'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useProducts } from '@/context/ProductContext';
import { ProductCard } from '@/components/product/ProductCard';
import { useQuickView } from '@/context/QuickViewContext';
import {
  Filter,
  Search,
  SlidersHorizontal,
  RotateCcw,
  Sparkles,
  Leaf,
  Layers,
  ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';

function CategoriesContent() {
  const { products, categories } = useProducts();
  const { openQuickView } = useQuickView();
  const searchParams = useSearchParams();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<number>(350);
  const [minRating, setMinRating] = useState<number>(0);
  const [organicOnly, setOrganicOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>('popularity');
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);

  const haloBgs = ['halo-bg-1', 'halo-bg-2', 'halo-bg-3', 'halo-bg-4', 'halo-bg-5', 'halo-bg-6'];

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
    <div className="py-5 bg-cream" style={{ paddingTop: '160px', minHeight: '85vh' }}>
      <div className="container py-3">
        {/* Top Header */}
        <div className="text-center max-w-2xl mx-auto mb-4">
          <span className="badge bg-success bg-opacity-10 text-success fw-bold px-3 py-1 rounded-pill small mb-2 border border-success border-opacity-25">
            ALL ORGANIC CATEGORIES & PRODUCE
          </span>
          <h1 className="font-heading display-5 fw-extrabold text-dark mb-1">
            Browse By Organic Category
          </h1>
          <p className="text-muted small">
            Select any category below or filter through our complete pesticide-free harvest catalog.
          </p>
        </div>

        {/* Top 8 Halo Categories Quick Selector Cards */}
        <div className="d-flex gap-3 overflow-auto pb-4 pt-2 scrollbar-none snap-x mb-4">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`flex-shrink-0 btn rounded-4 px-4 py-3 border shadow-sm transition-all text-start ${
              selectedCategory === 'all'
                ? 'btn-success text-white shadow'
                : 'btn-white text-dark hover-bg-light'
            }`}
            style={selectedCategory === 'all' ? { background: '#0A6836', border: 'none' } : { minWidth: '150px' }}
          >
            <div className="d-flex align-items-center gap-2 mb-1">
              <Layers size={18} />
              <strong className="font-heading">All Items</strong>
            </div>
            <span className="small opacity-75 d-block" style={{ fontSize: '0.75rem' }}>
              {products.length} Products
            </span>
          </button>

          {categories.map((cat, idx) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex-shrink-0 btn rounded-4 p-2 border shadow-sm transition-all text-center ${
                  isSelected ? 'border-success bg-success bg-opacity-10' : 'bg-white hover-bg-light'
                }`}
                style={{ width: '135px' }}
              >
                <div className={`halo-circle ${haloBgs[idx % haloBgs.length]} overflow-hidden rounded-circle mx-auto mb-1`} style={{ width: '60px', height: '60px' }}>
                  <div className="position-relative w-100 h-100 p-1 d-flex align-items-center justify-content-center">
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      fill
                      className="object-fit-cover rounded-circle p-1"
                    />
                  </div>
                </div>

                <strong className={`d-block font-heading small text-truncate ${isSelected ? 'text-success fw-extrabold' : 'text-dark'}`}>
                  {cat.name}
                </strong>
                <span className="text-muted small d-block" style={{ fontSize: '0.68rem' }}>
                  {cat.productCount}+ Items
                </span>
              </button>
            );
          })}
        </div>

        {/* Mobile Filter Toggle */}
        <div className="d-lg-none mb-3">
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="btn btn-success rounded-pill px-4 py-2 w-100 fw-bold d-flex align-items-center justify-content-center gap-2 shadow-sm"
            style={{ background: '#0A6836' }}
          >
            <Filter size={18} />
            <span>Filter Categories ({filteredProducts.length} Items)</span>
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
                  Search Category
                </label>
                <div className="input-group border rounded-pill overflow-hidden bg-light">
                  <span className="input-group-text bg-transparent border-0 ps-3 text-muted">
                    <Search size={16} />
                  </span>
                  <input
                    type="text"
                    className="form-control border-0 bg-transparent py-2 small shadow-none"
                    placeholder="e.g. Spinach, Apple..."
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
                  id="organicSwitch"
                  checked={organicOnly}
                  onChange={(e) => setOrganicOnly(e.target.checked)}
                />
                <label className="form-check-input-label font-heading fw-bold text-dark small ms-2" htmlFor="organicSwitch">
                  100% Organic Certified Only
                </label>
              </div>
            </div>
          </div>

          {/* Right Main Grid Area */}
          <div className="col-lg-9">
            {/* Top Controls Bar: Counter & Sorting */}
            <div className="bg-white rounded-4 p-3 shadow-sm border mb-4 d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3">
              <div className="d-flex align-items-center gap-2">
                <span className="badge bg-success bg-opacity-10 text-success font-heading fw-bold px-3 py-2 rounded-pill small">
                  {filteredProducts.length} Items Found
                </span>
                {selectedCategory !== 'all' && (
                  <span className="text-muted small">
                    In Category: <strong className="text-dark">{categories.find((c) => c.id === selectedCategory)?.name || selectedCategory}</strong>
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
                  No items matched your selected category or price filter.
                </p>
                <button
                  onClick={resetFilters}
                  className="btn btn-success rounded-pill px-4 py-2 fw-bold border-0 shadow-sm"
                  style={{ background: '#0A6836' }}
                >
                  Reset Category Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CategoriesPage() {
  return (
    <Suspense fallback={<div className="py-5 text-center">Loading Categories...</div>}>
      <CategoriesContent />
    </Suspense>
  );
}
