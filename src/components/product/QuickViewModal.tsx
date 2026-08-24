'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { X, Star, ShoppingBag, Heart, ShieldCheck, Truck, Plus, Minus, ArrowRight, Sparkles, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, onClose }) => {
  const { cart, addToCart, updateQuantity, removeFromCart, setIsCartOpen } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [selectedWeight, setSelectedWeight] = useState<string>(product?.weights[0] || '1kg');
  const [activeImage, setActiveImage] = useState<string>(product?.image || '');
  const [quantity, setQuantity] = useState<number>(1);

  // This modal is shared by every home and shop card. Reset local controls
  // whenever a new product is opened so the selected weight always matches it.
  useEffect(() => {
    if (product) {
      setSelectedWeight(product.weights[0] || '1kg');
      setActiveImage(product.image);
      setQuantity(1);
    }
  }, [product]);

  if (!product) return null;

  const currentImage = activeImage || product.image;
  const isWishlisted = isInWishlist(product.id);

  const cartItem = cart.find(
    (item) => item.product.id === product.id && item.selectedWeight === selectedWeight
  );
  const currentQty = cartItem ? cartItem.quantity : quantity;

  const getMultiplier = (w: string) => {
    if (w === '250g') return 0.25;
    if (w === '500g') return 0.5;
    if (w === '1kg') return 1;
    if (w === '2kg') return 2;
    if (w === '125g') return 0.125;
    return 1;
  };

  const calculatedPrice = Math.round(product.price * getMultiplier(selectedWeight));
  const calculatedOriginalPrice = Math.round(product.originalPrice * getMultiplier(selectedWeight));

  const handleMinus = () => {
    if (cartItem) {
      if (cartItem.quantity > 1) {
        updateQuantity(product.id, selectedWeight, cartItem.quantity - 1);
      } else {
        removeFromCart(product.id, selectedWeight);
      }
    } else {
      setQuantity((prev) => Math.max(1, prev - 1));
    }
  };

  const handlePlus = () => {
    if (cartItem) {
      updateQuantity(product.id, selectedWeight, cartItem.quantity + 1);
    } else {
      setQuantity((prev) => prev + 1);
    }
  };

  const handleAddToCart = () => {
    if (cartItem) {
      updateQuantity(product.id, selectedWeight, cartItem.quantity + 1);
    } else {
      addToCart(product, selectedWeight, quantity);
    }
    onClose();
    setIsCartOpen(true);
  };

  return (
    <AnimatePresence>
      <div
        className="position-fixed top-0 start-0 w-100 h-100 modal-backdrop-blur d-flex align-items-center justify-content-center p-3"
        style={{ zIndex: 1060 }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: 30 }}
          transition={{ type: 'spring', damping: 25, stiffness: 250 }}
          className="bg-white rounded-4 shadow-lg overflow-hidden position-relative w-100 border"
          style={{ maxWidth: '880px', maxHeight: '92vh' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="btn btn-light rounded-circle p-2 position-absolute top-0 end-0 m-3 shadow-sm"
            style={{ zIndex: 10 }}
          >
            <X size={20} />
          </button>

          <div className="row g-0 overflow-auto" style={{ maxHeight: '92vh' }}>
            {/* Left Image & Health Benefit Pills */}
            <div className="col-md-5 p-4 bg-light d-flex flex-column justify-content-between border-end">
              <div>
                <div
                  className="position-relative rounded-4 overflow-hidden mb-3 shadow-sm bg-white"
                  style={{ height: '280px', width: '100%' }}
                >
                  <Image
                    src={currentImage}
                    alt={product.name}
                    fill
                    className="object-fit-contain p-3"
                  />
                  <span className="position-absolute top-0 start-0 m-3 badge-discount-v2">
                    {product.discountPercentage}% OFF
                  </span>
                </div>

                {/* Circular Health Benefits Preview Bar */}
                <div className="bg-white rounded-4 p-3 border shadow-sm">
                  <div className="d-flex align-items-center gap-1 text-success fw-bold small mb-2">
                    <Sparkles size={14} />
                    <span>ORGANIC HEALTH VITALITY</span>
                  </div>

                  <div className="row g-2 text-center">
                    {product.healthBenefits.slice(0, 4).map((b, idx) => (
                      <div key={idx} className="col-6">
                        <div className="p-2 rounded-3 bg-light border">
                          <span className="d-block mb-1" style={{ fontSize: '1.2rem' }}>{b.icon}</span>
                          <strong className="d-block text-dark small font-heading lh-1">{b.title}</strong>
                          <span className="text-success fw-bold" style={{ fontSize: '0.72rem' }}>{b.percentage}% Benefit</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-3 text-center text-muted small" style={{ fontSize: '0.72rem' }}>
                <Info size={12} className="text-muted me-1" />
                Informational nutrition indicators. Direct from certified organic farm.
              </div>
            </div>

            {/* Right Order Details */}
            <div className="col-md-7 p-4 p-md-5 d-flex flex-column justify-content-between">
              <div>
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <span className="badge bg-success bg-opacity-15 text-success font-heading fw-bold px-3 py-1 rounded-pill">
                    {product.category}
                  </span>
                  <div className="d-flex align-items-center gap-1 text-warning fw-bold small">
                    <Star size={15} fill="#FFB800" stroke="none" />
                    <span>{product.rating}</span>
                    <span className="text-muted fw-normal">({product.reviewsCount} reviews)</span>
                  </div>
                </div>

                <h3 className="font-heading fw-extrabold text-dark mb-2">{product.name}</h3>

                <p className="text-muted small mb-4" style={{ lineHeight: 1.5 }}>
                  {product.description}
                </p>

                {/* Price Display */}
                <div className="d-flex align-items-baseline gap-3 mb-4 p-3 bg-light rounded-3 border">
                  <span className="font-heading fs-3 fw-extrabold text-success">
                    ₹{calculatedPrice * currentQty}
                  </span>
                  {calculatedOriginalPrice > calculatedPrice && (
                    <span className="text-decoration-line-through text-muted fs-5">
                      ₹{calculatedOriginalPrice * currentQty}
                    </span>
                  )}
                  <span className="badge bg-danger ms-auto">
                    {product.discountPercentage}% OFF
                  </span>
                </div>

                {/* Weight Selector */}
                <div className="mb-4">
                  <label className="form-label fw-bold text-dark small d-block mb-2">
                    SELECT WEIGHT / QUANTITY UNIT
                  </label>
                  <div className="d-flex flex-wrap gap-2">
                    {product.weights.map((w) => (
                      <button
                        key={w}
                        onClick={() => setSelectedWeight(w)}
                        className={`btn rounded-pill px-3 py-2 fw-semibold ${
                          selectedWeight === w
                            ? 'btn-success text-white shadow-sm'
                            : 'btn-outline-secondary'
                        }`}
                        style={{ fontSize: '0.85rem' }}
                      >
                        {w}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity counter */}
                <div className="d-flex align-items-center gap-3 mb-4">
                  <span className="fw-bold small text-dark">QTY:</span>
                  <div className="d-flex align-items-center border rounded-pill px-3 py-1 bg-light">
                    <button
                      type="button"
                      onClick={handleMinus}
                      className="btn btn-sm btn-light rounded-circle p-1 text-dark border-0 d-flex align-items-center justify-content-center"
                      style={{ width: '28px', height: '28px' }}
                      title="Decrease / Remove"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="px-3 fw-bold small">{currentQty}</span>
                    <button
                      type="button"
                      onClick={handlePlus}
                      className="btn btn-sm btn-light rounded-circle p-1 text-dark border-0 d-flex align-items-center justify-content-center"
                      style={{ width: '28px', height: '28px' }}
                      title="Increase Quantity"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="d-flex flex-column gap-2 pt-3 border-top">
                <div className="d-flex gap-2">
                  <button
                    onClick={handleAddToCart}
                    className="btn btn-success rounded-pill py-3 flex-grow-1 fw-bold d-flex align-items-center justify-content-center gap-2 shadow-sm"
                    style={{ background: cartItem ? '#064E28' : '#0A6836', border: 'none' }}
                  >
                    <ShoppingBag size={18} />
                    <span>{cartItem ? `In Basket (${currentQty}) • ₹${calculatedPrice * currentQty}` : `Add to Basket (₹${calculatedPrice * currentQty})`}</span>
                  </button>

                  <button
                    onClick={() => toggleWishlist(product)}
                    className={`btn rounded-circle p-3 d-flex align-items-center justify-content-center ${
                      isWishlisted ? 'btn-danger text-white' : 'btn-outline-danger'
                    }`}
                    style={{ width: '48px', height: '48px' }}
                  >
                    <Heart size={18} fill={isWishlisted ? '#FFFFFF' : 'none'} />
                  </button>
                </div>

                <Link
                  href={`/product/${product.id}`}
                  onClick={onClose}
                  className="btn btn-link text-success text-center fw-semibold small text-decoration-none d-flex align-items-center justify-content-center gap-1 mt-1"
                >
                  <span>View Complete Health Benefits & Nutrition Details</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
