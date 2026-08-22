'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { Heart, Star, ShoppingBag, Eye, Plus, Minus } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  const router = useRouter();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [selectedWeight, setSelectedWeight] = useState<string>(product.weights[0] || '1kg');
  const [quantity, setQuantity] = useState<number>(1);

  const isWishlisted = isInWishlist(product.id);

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

  const handleCardClick = () => {
    // Open Quick View Modal for instant inspection
    onQuickView(product);
  };

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      onClick={handleCardClick}
      className="product-card-v2 h-100 d-flex flex-column justify-content-between p-3 position-relative bg-white cursor-pointer"
      style={{ borderRadius: '20px', border: '1px solid rgba(10, 104, 54, 0.08)', cursor: 'pointer' }}
    >
      {/* Discount Badge */}
      {product.discountPercentage > 0 && (
        <span
          className="position-absolute top-0 start-0 m-3 badge-discount-v2 pointer-events-none"
          style={{ zIndex: 3 }}
        >
          {product.discountPercentage}% OFF
        </span>
      )}

      {/* Quick View Eye Button (Top Right) */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onQuickView(product);
        }}
        className="btn btn-sm btn-white rounded-circle p-2 position-absolute top-0 end-0 m-3 shadow-sm border text-muted d-flex align-items-center justify-content-center"
        style={{ zIndex: 5, width: '32px', height: '32px' }}
        title="Quick View"
      >
        <Eye size={15} />
      </button>

      {/* Image Container */}
      <div
        className="img-box rounded-4 mb-3 d-flex align-items-center justify-content-center overflow-hidden position-relative"
        style={{ height: '160px', background: '#F9FAF9' }}
      >
        <div className="w-100 h-100 d-flex align-items-center justify-content-center p-2">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-fit-contain p-2"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
        </div>
      </div>

      {/* Card Content */}
      <div className="d-flex flex-column flex-grow-1 justify-content-between text-center">
        <div>
          {/* Title */}
          <h6
            className="font-heading text-dark fw-bold mb-1 text-truncate hover-text-success text-center"
            style={{ fontSize: '0.95rem' }}
          >
            {product.name}
          </h6>

          {/* Weight Unit Selector Pills */}
          <div className="d-flex align-items-center justify-content-center gap-1 mb-2 py-1 flex-wrap">
            {product.weights.map((w) => (
              <button
                key={w}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedWeight(w);
                }}
                className={`btn btn-xs rounded-pill px-2 py-0 fw-semibold ${
                  selectedWeight === w
                    ? 'btn-success text-white'
                    : 'btn-light text-muted border'
                }`}
                style={{ fontSize: '0.68rem', lineHeight: '1.4' }}
              >
                {w}
              </button>
            ))}
          </div>

          {/* Rating */}
          <div className="d-flex align-items-center justify-content-center gap-1 text-warning mb-2" style={{ fontSize: '0.75rem' }}>
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} size={11} fill="#FFB800" stroke="none" />
            ))}
            <span className="text-muted ms-1">({product.reviewsCount})</span>
          </div>

          {/* Price Display */}
          <div className="d-flex align-items-baseline justify-content-center gap-1 mb-3">
            <span className="font-heading fs-5 fw-extrabold text-dark">
              ₹{currentPrice * quantity}
            </span>
            {currentOriginalPrice > currentPrice && (
              <span className="text-decoration-line-through text-muted small ms-1" style={{ fontSize: '0.75rem' }}>
                ₹{currentOriginalPrice * quantity}
              </span>
            )}
          </div>
        </div>

        {/* Action Row: QTY Counter + Add to Cart + Wishlist Heart */}
        <div className="pt-2 border-top">
          <div className="d-flex align-items-center justify-content-center gap-1">
            {/* Quantity Selector (- 1 +) */}
            <div className="d-flex align-items-center border rounded-pill px-2 py-1 bg-light flex-shrink-0">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setQuantity(Math.max(1, quantity - 1));
                }}
                className="btn btn-sm btn-link p-0 text-dark border-0 text-decoration-none"
              >
                <Minus size={11} />
              </button>
              <span className="px-1 fw-bold" style={{ fontSize: '0.75rem' }}>{quantity}</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setQuantity(quantity + 1);
                }}
                className="btn btn-sm btn-link p-0 text-dark border-0 text-decoration-none"
              >
                <Plus size={11} />
              </button>
            </div>

            {/* Solid Green Add to Cart button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                addToCart(product, selectedWeight, quantity);
              }}
              className="btn btn-sm btn-success rounded-pill flex-grow-1 py-2 px-2 fw-bold d-flex align-items-center justify-content-center gap-1 border-0 shadow-sm"
              style={{ background: '#0A6836', fontSize: '0.75rem' }}
            >
              <ShoppingBag size={13} />
              <span>Add to Cart</span>
            </button>

            {/* Wishlist Heart button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleWishlist(product);
              }}
              className={`btn btn-sm rounded-circle p-2 d-flex align-items-center justify-content-center border-0 flex-shrink-0 ${
                isWishlisted ? 'bg-danger text-white' : 'bg-light text-muted'
              }`}
              style={{ width: '32px', height: '32px' }}
              title="Wishlist"
            >
              <Heart size={14} fill={isWishlisted ? '#FFFFFF' : 'none'} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
