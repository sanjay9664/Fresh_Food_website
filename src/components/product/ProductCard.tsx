'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { Heart, Star, Eye, Plus, Minus, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  const router = useRouter();
  const { cart, addToCart, updateQuantity, removeFromCart, setIsCartOpen } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [selectedWeight, setSelectedWeight] = useState<string>(product.weights[0] || '1kg');

  const isWishlisted = isInWishlist(product.id);

  // Check if item is already in cart for this selected weight
  const cartItem = cart.find(
    (item) => item.product.id === product.id && item.selectedWeight === selectedWeight
  );

  // Price calculation based on weight unit
  const getMultiplier = (w: string) => {
    if (w === '250g') return 0.25;
    if (w === '500g') return 0.5;
    if (w === '1kg') return 1;
    if (w === '2kg') return 2;
    if (w === '125g') return 0.125;
    return 1;
  };

  const currentPrice = Math.round(product.price * getMultiplier(selectedWeight));
  const currentOriginalPrice = Math.round(product.originalPrice * getMultiplier(selectedWeight));

  const handleMinus = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (cartItem) {
      if (cartItem.quantity > 1) {
        updateQuantity(product.id, selectedWeight, cartItem.quantity - 1);
      } else {
        removeFromCart(product.id, selectedWeight);
      }
    }
  };

  const handlePlus = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (cartItem) {
      updateQuantity(product.id, selectedWeight, cartItem.quantity + 1);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, selectedWeight, 1);
    // Keep shoppers on the product grid so they can add multiple items quickly.
    // The basket remains available from the bottom Cart tab / header icon.
  };

  const handleNavigateToDetails = () => {
    router.push(`/product/${product.id}`);
  };

  return (
    <motion.div
      whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(10, 104, 54, 0.12)' }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className="product-card-v2 h-100 d-flex flex-column justify-content-between p-3 position-relative bg-white border shadow-sm"
      style={{ borderRadius: '22px', borderColor: 'rgba(10, 104, 54, 0.1)' }}
    >
      {/* Top Discount Badge */}
      <div className="position-absolute top-0 start-0 m-3 d-flex flex-column gap-1 pointer-events-none" style={{ zIndex: 3 }}>
        {product.discountPercentage > 0 && (
          <span
            className="badge fw-extrabold text-white px-2 py-1 shadow-sm"
            style={{
              background: 'linear-gradient(135deg, #E53935 0%, #C62828 100%)',
              borderRadius: '50px',
              fontSize: '0.65rem',
              letterSpacing: '0.5px'
            }}
          >
            {product.discountPercentage}% OFF
          </span>
        )}
      </div>

      {/* Quick View Eye Button */}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onQuickView(product);
        }}
        className="btn btn-sm btn-light rounded-circle p-0 position-absolute top-0 end-0 m-3 shadow-xs border text-muted d-flex align-items-center justify-content-center"
        style={{ zIndex: 5, width: '32px', height: '32px', background: 'rgba(255, 255, 255, 0.9)' }}
        title="Quick View Details"
      >
        <Eye size={15} />
      </button>

      {/* Image Container (Clickable -> Product Details Page) */}
      <div
        onClick={handleNavigateToDetails}
        className="img-box rounded-4 mb-2 d-flex align-items-center justify-content-center overflow-hidden position-relative cursor-pointer"
        style={{ height: '150px', background: '#F8FAF8' }}
      >
        <div className="w-100 h-100 d-flex align-items-center justify-content-center p-2">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-fit-contain p-2 transition-all"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
        </div>
      </div>

      {/* Card Content */}
      <div className="d-flex flex-column flex-grow-1 justify-content-between text-center">
        <div>
          {/* Title (Clickable -> Product Details Page) */}
          <h6
            onClick={handleNavigateToDetails}
            className="font-heading text-dark fw-extrabold mb-1 text-truncate hover-text-success text-center cursor-pointer"
            style={{ fontSize: '0.92rem', letterSpacing: '-0.2px' }}
          >
            {product.name}
          </h6>

          {/* Weight Unit Selector Pills */}
          <div className="d-flex align-items-center justify-content-center gap-1 mb-2 py-1 flex-wrap">
            {product.weights.map((w) => {
              const isSelected = selectedWeight === w;
              return (
                <button
                  key={w}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedWeight(w);
                  }}
                  className={`btn btn-xs rounded-pill px-2 py-0 fw-bold transition-all ${
                    isSelected
                      ? 'btn-success text-white shadow-xs'
                      : 'btn-light text-muted border'
                  }`}
                  style={{
                    fontSize: '0.66rem',
                    lineHeight: '1.4',
                    background: isSelected ? '#0A6836' : '#F1F5F9',
                    borderColor: isSelected ? '#0A6836' : '#E2E8F0'
                  }}
                >
                  {w}
                </button>
              );
            })}
          </div>

          {/* Rating */}
          <div className="d-flex align-items-center justify-content-center gap-1 text-warning mb-1" style={{ fontSize: '0.72rem' }}>
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} size={11} fill="#FFB800" stroke="none" />
            ))}
            <span className="text-muted ms-1 fw-semibold">({product.reviewsCount})</span>
          </div>

          {/* Price Display */}
          <div className="d-flex align-items-baseline justify-content-center gap-1 mb-1">
            <span className="font-heading fs-5 fw-extrabold text-success" style={{ color: '#0A6836' }}>
              ₹{currentPrice * (cartItem ? cartItem.quantity : 1)}
            </span>
            {currentOriginalPrice > currentPrice && (
              <span className="text-decoration-line-through text-muted small ms-1" style={{ fontSize: '0.75rem' }}>
                ₹{currentOriginalPrice * (cartItem ? cartItem.quantity : 1)}
              </span>
            )}
          </div>

          {/* View Full Details Button */}
          <Link
            href={`/product/${product.id}`}
            className="btn btn-link p-0 text-success fw-bold text-decoration-none mb-2 d-inline-block"
            style={{ fontSize: '0.72rem', color: '#0A6836' }}
          >
            👁️ View Full Details & Nutrition →
          </Link>
        </div>

        {/* Action Row: Dynamic Add / Counter Pill + Wishlist Heart */}
        <div className="pt-2 border-top">
          <div className="d-flex align-items-center justify-content-between gap-2">
            {/* Dynamic Button / Counter Pill */}
            {cartItem ? (
              /* Item IN Cart: Solid Green Pill Counter [- qty +] */
              <div
                className="d-flex align-items-center justify-content-between rounded-pill px-1 py-1 shadow-sm flex-grow-1"
                style={{
                  background: 'linear-gradient(135deg, #0A6836 0%, #064E28 100%)',
                  height: '38px',
                  color: '#FFFFFF'
                }}
              >
                <button
                  type="button"
                  onClick={handleMinus}
                  className="btn btn-sm btn-white rounded-circle p-0 text-dark border-0 d-flex align-items-center justify-content-center shadow-xs"
                  style={{ width: '28px', height: '28px', background: '#FFFFFF', color: '#0A6836' }}
                  title="Decrease or Remove"
                >
                  <Minus size={14} strokeWidth={3} />
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsCartOpen(true);
                  }}
                  className="btn btn-link text-white text-decoration-none fw-extrabold px-2 py-0 font-heading d-flex align-items-center gap-1"
                  style={{ fontSize: '0.76rem' }}
                  title="View cart"
                  aria-label={`View cart with ${cartItem.quantity} ${product.name}`}
                >
                  <span>{cartItem.quantity}</span>
                  <ShoppingBag size={13} />
                  <span className="d-none d-sm-inline">VIEW CART</span>
                </button>

                <button
                  type="button"
                  onClick={handlePlus}
                  className="btn btn-sm btn-white rounded-circle p-0 text-dark border-0 d-flex align-items-center justify-content-center shadow-xs"
                  style={{ width: '28px', height: '28px', background: '#FFFFFF', color: '#0A6836' }}
                  title="Increase Quantity"
                >
                  <Plus size={14} strokeWidth={3} />
                </button>
              </div>
            ) : (
              /* Item NOT in Cart: Single Line "+ ADD" Pill Button */
              <button
                type="button"
                onClick={handleAddToCart}
                className="btn btn-success rounded-pill flex-grow-1 py-2 px-3 fw-extrabold d-flex align-items-center justify-content-center gap-1 border-0 shadow-sm text-nowrap"
                style={{
                  background: 'linear-gradient(135deg, #0A6836 0%, #064E28 100%)',
                  height: '38px',
                  fontSize: '0.85rem',
                  letterSpacing: '0.5px'
                }}
              >
                <Plus size={16} strokeWidth={3} />
                <span>ADD TO CART</span>
              </button>
            )}

            {/* Wishlist Heart Button */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleWishlist(product);
              }}
              className={`btn btn-sm rounded-circle p-0 d-flex align-items-center justify-content-center border-0 flex-shrink-0 shadow-xs ${
                isWishlisted ? 'bg-danger text-white' : 'bg-light text-muted'
              }`}
              style={{ width: '38px', height: '38px' }}
              title="Wishlist"
            >
              <Heart size={16} fill={isWishlisted ? '#FFFFFF' : 'none'} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
