'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useProducts } from '@/context/ProductContext';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { HealthBenefits } from '@/components/product/HealthBenefits';
import {
  Star,
  ShoppingBag,
  Heart,
  Truck,
  ShieldCheck,
  RotateCcw,
  Plus,
  Minus,
  ArrowLeft,
  Share2,
  CheckCircle2,
  Leaf
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { products } = useProducts();
  const { addToCart, remainingQuantityKg } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const productId = params?.id as string;
  const product = products.find((p) => p.id === productId) || products[0];

  const [selectedWeight, setSelectedWeight] = useState<string>(product.weights[0] || '1kg');
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'benefits' | 'nutrition' | 'reviews'>('benefits');

  const isWishlisted = isInWishlist(product.id);

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
  const remainingKg = remainingQuantityKg(product);
  const canAddSelectedWeight = product.inStock && remainingKg >= getMultiplier(selectedWeight);
  const maxQuantity = Number.isFinite(remainingKg) ? Math.floor(remainingKg / getMultiplier(selectedWeight)) : Number.MAX_SAFE_INTEGER;
  const isSoldOut = !product.inStock || remainingKg <= 0;

  return (
    <div className="py-5 bg-cream" style={{ paddingTop: '160px', minHeight: '85vh' }}>
      <div className="container py-3">
        {/* Back Link */}
        <button
          onClick={() => router.back()}
          className="btn btn-link text-success fw-bold text-decoration-none d-inline-flex align-items-center gap-2 mb-4 p-0"
        >
          <ArrowLeft size={18} />
          <span>Back to Catalog</span>
        </button>

        {/* Product Hero Grid */}
        <div className="bg-white rounded-5 p-4 p-md-5 shadow-sm border mb-5">
          <div className="row g-4 align-items-center">
            {/* Left Image Showcase */}
            <div className="col-lg-5 text-center">
              <div
                className="position-relative rounded-4 p-4 d-flex align-items-center justify-content-center overflow-hidden border"
                style={{ background: '#F9FAF9', height: '340px' }}
              >
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-fit-contain p-3"
                  sizes="(max-width: 768px) 100vw, 40vw"
                  priority
                />
              </div>
            </div>

            {/* Right Product Details */}
            <div className="col-lg-7">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="badge bg-success bg-opacity-10 text-success fw-bold px-3 py-1 rounded-pill small">
                  {product.badge || '100% Organic'}
                </span>

                <button
                  onClick={() => toggleWishlist(product)}
                  className={`btn btn-sm rounded-circle p-2 border ${
                    isWishlisted ? 'bg-danger text-white' : 'bg-light text-muted'
                  }`}
                  style={{ width: '36px', height: '36px' }}
                >
                  <Heart size={16} fill={isWishlisted ? '#FFFFFF' : 'none'} />
                </button>
              </div>

              <h2 className="font-heading display-6 fw-extrabold text-dark mb-2">
                {product.name}
              </h2>

              {/* Rating */}
              <div className="d-flex align-items-center gap-2 mb-3">
                <div className="d-flex align-items-center text-warning">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={16} fill="#FFB800" stroke="none" />
                  ))}
                </div>
                <strong className="small text-dark font-heading">{product.rating}</strong>
                <span className="text-muted small">({product.reviewsCount} verified reviews)</span>
              </div>

              {/* Price */}
              <div className="d-flex align-items-baseline gap-3 mb-4">
                <span className="font-heading display-5 fw-extrabold text-dark">
                  ₹{currentPrice * quantity}
                </span>
                {currentOriginalPrice > currentPrice && (
                  <span className="text-decoration-line-through text-muted fs-5">
                    ₹{currentOriginalPrice * quantity}
                  </span>
                )}
                <span className="badge bg-danger bg-opacity-10 text-danger fw-bold">
                  {product.discountPercentage}% OFF
                </span>
              </div>

              <p className="text-muted mb-4" style={{ lineHeight: 1.6 }}>
                {product.description}
              </p>
              {Number.isFinite(remainingKg) && (
                <div className={`small fw-bold mb-3 ${isSoldOut ? 'text-danger' : 'text-success'}`}>
                  {isSoldOut ? 'Currently sold out' : `${remainingKg.toFixed(2).replace(/\.00$/, '')} kg currently available`}
                </div>
              )}

              {/* Weight Selector */}
              <div className="mb-4">
                <label className="form-label fw-bold text-dark small mb-2 d-block">
                  Select Portion Weight:
                </label>
                <div className="d-flex gap-2 flex-wrap">
                  {product.weights.map((w) => (
                    <button
                      key={w}
                      type="button"
                      onClick={() => setSelectedWeight(w)}
                      className={`btn rounded-pill px-3 py-2 fw-semibold ${
                        selectedWeight === w
                          ? 'btn-success text-white shadow-sm'
                          : 'btn-light text-dark border'
                      }`}
                      style={{ minWidth: '70px' }}
                    >
                      {w}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity & Add to Basket */}
              <div className="d-flex align-items-center gap-3 mb-4 flex-wrap">
                <div className="d-flex align-items-center border rounded-pill px-3 py-2 bg-light">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="btn btn-sm btn-link p-0 text-dark border-0"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="px-3 fw-bold">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
                    disabled={!canAddSelectedWeight || quantity >= maxQuantity}
                    className="btn btn-sm btn-link p-0 text-dark border-0"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                <button
                  onClick={() => addToCart(product, selectedWeight, quantity)}
                  disabled={!canAddSelectedWeight}
                  className="btn btn-success btn-lg rounded-pill px-5 py-3 fw-bold d-flex align-items-center justify-content-center gap-2 shadow flex-grow-1 border-0"
                  style={{ background: '#0A6836' }}
                >
                  <ShoppingBag size={20} />
                  <span>Add {quantity} to Basket • ₹{currentPrice * quantity}</span>
                </button>
              </div>

              {/* Trust badges */}
              <div className="pt-3 border-top d-flex align-items-center gap-4 text-muted small flex-wrap">
                <div className="d-flex align-items-center gap-2">
                  <Truck size={16} className="text-success" />
                  <span>Under 2-Hour Express Shipping</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <ShieldCheck size={16} className="text-success" />
                  <span>Lab Certified Pesticide-Free</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Health Benefits Section */}
        {product.healthBenefits && product.healthBenefits.length > 0 && (
          <div className="bg-white rounded-5 p-4 p-md-5 shadow-sm border mb-5">
            <h4 className="font-heading fw-extrabold text-dark mb-4 text-center">
              Health Benefits & Vital Scores
            </h4>
            <HealthBenefits benefits={product.healthBenefits} productName={product.name} />
          </div>
        )}
      </div>
    </div>
  );
}
