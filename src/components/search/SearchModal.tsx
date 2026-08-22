'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { products } from '@/data/products';
import { Product } from '@/types';
import { Search, X, Star, ArrowRight, TrendingUp, Sparkles, Leaf } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onSelectProduct }) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const popularSearches = ['Avocado', 'Spinach', 'Royal Apple', 'Organic Carrot', 'Fresh Tomato', 'Broccoli'];

  const filteredProducts = query.trim()
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase()) ||
          p.description.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <AnimatePresence>
      <div
        className="position-fixed top-0 start-0 w-100 h-100 modal-backdrop-blur d-flex align-items-start justify-content-center pt-5 px-3"
        style={{ zIndex: 1060 }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="bg-white rounded-4 shadow-lg overflow-hidden position-relative w-100 border"
          style={{ maxWidth: '650px' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header Input */}
          <div className="p-3 border-bottom d-flex align-items-center gap-3 bg-light">
            <Search size={22} className="text-success ms-2" />
            <input
              type="text"
              placeholder="Search organic fruits, vegetables, or farm categories..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="form-control border-0 bg-transparent shadow-none fs-5 py-2 text-dark"
              autoFocus
            />
            <button
              onClick={onClose}
              className="btn btn-light rounded-circle p-2 border-0 me-1"
            >
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="p-4" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
            {!query.trim() ? (
              <div>
                <div className="d-flex align-items-center gap-2 text-muted small fw-bold mb-3">
                  <TrendingUp size={16} className="text-success" />
                  <span>POPULAR SEARCHES</span>
                </div>

                <div className="d-flex flex-wrap gap-2 mb-4">
                  {popularSearches.map((term) => (
                    <button
                      key={term}
                      onClick={() => setQuery(term)}
                      className="btn btn-outline-secondary rounded-pill btn-sm px-3 py-1 fw-semibold"
                    >
                      {term}
                    </button>
                  ))}
                </div>

                <div className="d-flex align-items-center gap-2 text-muted small fw-bold mb-3 pt-3 border-top">
                  <Sparkles size={16} className="text-warning" />
                  <span>RECOMMENDED FOR YOU</span>
                </div>

                <div className="row g-2">
                  {products.slice(0, 3).map((p) => (
                    <div key={p.id} className="col-12">
                      <div
                        onClick={() => {
                          onSelectProduct(p);
                          onClose();
                        }}
                        className="d-flex align-items-center justify-content-between p-2 rounded-3 hover-bg-light cursor-pointer border"
                      >
                        <div className="d-flex align-items-center gap-3">
                          <div className="position-relative rounded-2 bg-light p-1" style={{ width: '48px', height: '48px' }}>
                            <Image src={p.image} alt={p.name} fill className="object-fit-contain p-1" />
                          </div>
                          <div>
                            <strong className="d-block text-dark small font-heading">{p.name}</strong>
                            <span className="text-success fw-bold small">₹{p.price} / {p.weights[0]}</span>
                          </div>
                        </div>
                        <ArrowRight size={16} className="text-muted" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : filteredProducts.length > 0 ? (
              <div>
                <div className="text-muted small fw-bold mb-3">
                  FOUND {filteredProducts.length} ORGANIC ITEMS
                </div>
                <div className="d-flex flex-column gap-2">
                  {filteredProducts.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => {
                        onSelectProduct(p);
                        onClose();
                      }}
                      className="d-flex align-items-center justify-content-between p-3 rounded-3 hover-bg-light cursor-pointer border"
                    >
                      <div className="d-flex align-items-center gap-3">
                        <div className="position-relative rounded-2 bg-light p-1" style={{ width: '56px', height: '56px' }}>
                          <Image src={p.image} alt={p.name} fill className="object-fit-contain p-1" />
                        </div>
                        <div>
                          <strong className="d-block text-dark font-heading">{p.name}</strong>
                          <span className="text-muted small d-block">{p.category}</span>
                          <span className="text-success fw-bold">₹{p.price} / {p.weights[0]}</span>
                        </div>
                      </div>

                      <button className="btn btn-sm btn-success rounded-pill px-3 py-1 font-heading fw-bold">
                        View Item
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-5 text-muted">
                <div className="fs-1 mb-2 text-success">
                  <Leaf size={48} className="mx-auto" />
                </div>
                <h6 className="fw-bold text-dark font-heading">No produce matching &quot;{query}&quot;</h6>
                <p className="small mb-0">Try searching for apples, carrots, spinach or tomatoes.</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
