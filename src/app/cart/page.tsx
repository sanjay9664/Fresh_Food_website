'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart, SlotType } from '@/context/CartContext';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Tag,
  CheckCircle2,
  ArrowLeft,
  Clock,
  Sunrise,
  Sun,
  Sunset,
  Zap
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function CartPage() {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    subtotal,
    productSavingsAmount,
    appliedCoupon,
    couponDiscountPercent,
    couponDiscountAmount,
    deliveryFee,
    totalAmount,
    applyCoupon,
    removeCoupon,
    deliverySlot,
    deliveryDate,
    slotTimeText,
    setDeliverySlotPreference
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  const handleCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    const res = applyCoupon(couponInput);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponInput('');
    }
  };

  return (
    <div className="bg-cream min-vh-100 pb-5" style={{ paddingTop: '150px' }}>
      <div className="container py-4">
        {/* Header */}
        <div className="d-flex align-items-center justify-content-between mb-4 pb-3 border-bottom">
          <div>
            <Link href="/shop" className="text-decoration-none text-success small fw-bold d-flex align-items-center gap-1 mb-1">
              <ArrowLeft size={16} /> Continue Shopping
            </Link>
            <h1 className="font-heading display-6 fw-extrabold text-dark mb-0">
              Shopping Basket ({cart.length} items)
            </h1>
          </div>
        </div>

        {cart.length === 0 ? (
          <div className="bg-white rounded-4 p-5 text-center shadow-sm max-w-xl mx-auto my-5">
            <div className="fs-1 mb-3">🧺</div>
            <h3 className="font-heading fw-bold text-dark mb-2">Your Fresh Cart is Empty</h3>
            <p className="text-muted mb-4">
              Your cart is waiting to be filled with farm fresh organic vegetables & juicy fruits.
            </p>
            <Link href="/shop" className="btn btn-success rounded-pill px-5 py-3 fw-bold">
              Explore Fresh Produce
            </Link>
          </div>
        ) : (
          <div className="row g-4">
            {/* Left Items Table */}
            <div className="col-lg-8">
              <div className="bg-white rounded-4 border shadow-sm overflow-hidden">
                <div className="p-3 bg-light border-bottom font-heading fw-bold text-dark d-none d-md-flex justify-content-between">
                  <span>Product</span>
                  <div className="d-flex gap-5 pe-4">
                    <span>Weight & Price</span>
                    <span>Quantity</span>
                    <span>Subtotal</span>
                  </div>
                </div>

                <div className="divide-y">
                  {cart.map((item) => (
                    <div
                      key={`${item.product.id}-${item.selectedWeight}`}
                      className="p-3 p-md-4 border-bottom d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3"
                    >
                      <div className="d-flex align-items-center gap-3">
                        <div
                          className="position-relative rounded-3 overflow-hidden flex-shrink-0 bg-light"
                          style={{ width: '80px', height: '80px' }}
                        >
                          <Image
                            src={item.product.image}
                            alt={item.product.name}
                            fill
                            className="object-fit-cover"
                          />
                        </div>
                        <div>
                          <span className="badge bg-success bg-opacity-10 text-success small mb-1">
                            {item.product.badge}
                          </span>
                          <h6 className="font-heading fw-bold text-dark mb-1">
                            {item.product.name}
                          </h6>
                          <div className="small text-muted">Weight: {item.selectedWeight}</div>
                        </div>
                      </div>

                      <div className="d-flex align-items-center justify-content-between justify-content-md-end gap-4 flex-grow-1">
                        <div className="text-muted small">
                          ₹{item.itemPrice}
                        </div>

                        {/* Quantity Counter */}
                        <div className="d-flex align-items-center border rounded-pill px-3 py-1 bg-light">
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.product.id,
                                item.selectedWeight,
                                item.quantity - 1
                              )
                            }
                            className="btn btn-sm btn-link p-0 text-dark"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="px-3 fw-bold small">{item.quantity}</span>
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.product.id,
                                item.selectedWeight,
                                item.quantity + 1
                              )
                            }
                            className="btn btn-sm btn-link p-0 text-dark"
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        {/* Item Total Price */}
                        <div className="fw-bold text-success font-heading fs-5" style={{ minWidth: '80px', textAlign: 'right' }}>
                          ₹{item.itemPrice * item.quantity}
                        </div>

                        <button
                          onClick={() => removeFromCart(item.product.id, item.selectedWeight)}
                          className="btn btn-link text-muted hover-text-danger p-1"
                          title="Remove item"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Summary Card */}
            <div className="col-lg-4">
              <div className="bg-white rounded-4 border shadow-sm p-4 sticky-top" style={{ top: '100px' }}>
                {/* Delivery Time Slot Preference Selector */}
                <div className="mb-4 p-3 bg-light rounded-4 border">
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <label className="form-label fw-bold text-dark small mb-0 d-flex align-items-center gap-1">
                      <Clock size={16} className="text-success" />
                      <span>DELIVERY TIME SLOT</span>
                    </label>
                    <span
                      className="badge rounded-pill fw-bold font-heading"
                      style={{
                        backgroundColor: '#E8F5E9',
                        color: '#0A6836',
                        border: '1px solid #81C784',
                        padding: '4px 10px'
                      }}
                    >
                      {deliveryDate} ({deliverySlot})
                    </span>
                  </div>

                  {/* Day Pills */}
                  <div className="d-flex gap-1 mb-2">
                    {['Today', 'Tomorrow', 'Day After'].map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setDeliverySlotPreference(deliverySlot, d)}
                        className={`btn btn-xs rounded-pill flex-grow-1 py-1 fw-bold ${
                          deliveryDate === d ? 'btn-success text-white' : 'btn-white border text-dark'
                        }`}
                        style={{ fontSize: '0.72rem' }}
                      >
                        {d}
                      </button>
                    ))}
                  </div>

                  {/* Slot Pills */}
                  <div className="row g-1">
                    {[
                      { id: 'Morning', name: 'Morning', time: '7-10 AM', icon: Sunrise },
                      { id: 'Afternoon', name: 'Afternoon', time: '12-3 PM', icon: Sun },
                      { id: 'Evening', name: 'Evening', time: '5-8 PM', icon: Sunset },
                      { id: 'Express', name: 'Express', time: '⚡ 2-Hour', icon: Zap }
                    ].map((option) => {
                      const Icon = option.icon;
                      const isSelected = deliverySlot === option.id;
                      return (
                        <div className="col-6" key={option.id}>
                          <button
                            type="button"
                            onClick={() => setDeliverySlotPreference(option.id as SlotType, deliveryDate)}
                            className={`btn w-100 text-start p-2 rounded-3 border fw-semibold transition-all ${
                              isSelected ? 'btn-success text-white' : 'btn-white text-dark'
                            }`}
                            style={{ fontSize: '0.72rem' }}
                          >
                            <div className="d-flex align-items-center justify-content-between">
                              <span className="d-flex align-items-center gap-1">
                                <Icon size={12} />
                                {option.name}
                              </span>
                              <small style={{ opacity: 0.85, fontSize: '0.65rem' }}>{option.time}</small>
                            </div>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Coupon Code Section */}
                <div className="mb-4">
                  <label className="form-label fw-bold text-dark small">HAVE A PROMO CODE?</label>
                  {appliedCoupon ? (
                    <div className="d-flex align-items-center justify-content-between p-2 rounded-3 bg-success bg-opacity-10 border border-success">
                      <div className="d-flex align-items-center gap-2 small fw-bold text-success">
                        <CheckCircle2 size={16} />
                        <span>Code {appliedCoupon} (-{couponDiscountPercent}%)</span>
                      </div>
                      <button
                        onClick={removeCoupon}
                        className="btn btn-sm btn-link text-danger p-0 text-decoration-none"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleCouponSubmit}>
                      <div className="input-group">
                        <span className="input-group-text bg-white">
                          <Tag size={16} className="text-muted" />
                        </span>
                        <input
                          type="text"
                          value={couponInput}
                          onChange={(e) => setCouponInput(e.target.value)}
                          placeholder="Try FRESH20"
                          className="form-control text-uppercase"
                        />
                        <button type="submit" className="btn btn-outline-success">
                          Apply
                        </button>
                      </div>
                      {couponError && <div className="small text-danger mt-1">{couponError}</div>}
                    </form>
                  )}
                </div>

                {/* Cost Breakdown */}
                <div className="d-flex flex-column gap-2 mb-4">
                  <div className="d-flex justify-content-between text-muted">
                    <span>Basket Subtotal</span>
                    <span className="fw-bold text-dark">₹{subtotal}</span>
                  </div>

                  {productSavingsAmount > 0 && (
                    <div className="d-flex justify-content-between text-success small">
                      <span>Product Savings</span>
                      <span>-₹{productSavingsAmount}</span>
                    </div>
                  )}

                  {couponDiscountAmount > 0 && (
                    <div className="d-flex justify-content-between text-success small">
                      <span>Promo Discount ({appliedCoupon})</span>
                      <span className="fw-bold">-₹{couponDiscountAmount}</span>
                    </div>
                  )}

                  <div className="d-flex justify-content-between text-muted">
                    <span>Delivery Charge</span>
                    <span>
                      {deliveryFee === 0 ? (
                        <strong className="text-success">FREE</strong>
                      ) : (
                        `₹${deliveryFee}`
                      )}
                    </span>
                  </div>

                  <div className="d-flex justify-content-between font-heading fs-4 fw-extrabold text-dark pt-3 border-top mt-2">
                    <span>Total Amount</span>
                    <span className="text-success">₹{totalAmount}</span>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="btn btn-success w-100 rounded-pill py-3 fw-bold d-flex align-items-center justify-content-center gap-2 shadow-sm"
                  style={{ background: 'linear-gradient(135deg, #FF6F00 0%, #E66000 100%)', border: 'none' }}
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight size={18} />
                </Link>

                <div className="text-center text-muted small mt-3">
                  🛡️ 100% Secure Checkout Guarantee
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
