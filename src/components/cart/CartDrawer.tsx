'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight, Tag, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    subtotal,
    appliedCoupon,
    couponDiscountPercent,
    couponDiscountAmount,
    deliveryFee,
    totalAmount,
    applyCoupon,
    removeCoupon
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  const handleApplyCoupon = (e: React.FormEvent) => {
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
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="position-fixed top-0 start-0 w-100 h-100 modal-backdrop-blur"
            style={{ zIndex: 1050 }}
          />

          {/* Slide Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="position-fixed top-0 end-0 h-100 bg-white shadow-lg d-flex flex-column"
            style={{ zIndex: 1051, width: '100%', maxWidth: '440px' }}
          >
            {/* Drawer Header */}
            <div className="p-3 border-bottom d-flex align-items-center justify-content-between bg-light">
              <div className="d-flex align-items-center gap-2">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center text-white"
                  style={{ width: '36px', height: '36px', background: '#FF6F00' }}
                >
                  <ShoppingBag size={18} />
                </div>
                <h5 className="font-heading fw-bold mb-0 text-dark">Your Fresh Basket</h5>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="btn btn-light rounded-circle p-2"
              >
                <X size={20} />
              </button>
            </div>

            {/* Free Delivery Bar Progress */}
            <div className="bg-success bg-opacity-10 p-2 text-center border-bottom">
              {subtotal >= 399 ? (
                <span className="small fw-bold text-success">
                  🎉 Congratulations! You unlocked FREE Delivery!
                </span>
              ) : (
                <span className="small text-dark">
                  Add <strong className="text-success">₹{399 - subtotal}</strong> more for FREE Express Delivery!
                </span>
              )}
            </div>

            {/* Cart Items List */}
            <div className="p-3 overflow-auto flex-grow-1">
              {cart.length === 0 ? (
                <div className="text-center py-5">
                  <div className="fs-1 mb-3">🧺</div>
                  <h5 className="font-heading fw-bold text-dark mb-2">Your Basket is Empty</h5>
                  <p className="text-muted small mb-4">
                    Looks like you haven&apos;t added any fresh produce yet.
                  </p>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="btn btn-success rounded-pill px-4"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                <div className="d-flex flex-column gap-3">
                  {cart.map((item) => (
                    <div
                      key={`${item.product.id}-${item.selectedWeight}`}
                      className="d-flex gap-3 p-2 rounded-3 border bg-white position-relative"
                    >
                      <div
                        className="position-relative rounded-3 overflow-hidden flex-shrink-0"
                        style={{ width: '70px', height: '70px', background: '#F4F7F4' }}
                      >
                        <Image
                          src={item.product.image}
                          alt={item.product.name}
                          fill
                          className="object-fit-cover"
                        />
                      </div>
                      <div className="flex-grow-1">
                        <div className="d-flex justify-content-between align-items-start pr-4">
                          <h6 className="fw-bold mb-0 text-dark" style={{ fontSize: '0.92rem' }}>
                            {item.product.name}
                          </h6>
                          <button
                            onClick={() => removeFromCart(item.product.id, item.selectedWeight)}
                            className="btn btn-link text-muted p-0 ms-2"
                            title="Remove"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <div className="small text-muted mb-2">Weight: {item.selectedWeight}</div>

                        <div className="d-flex align-items-center justify-content-between">
                          <div className="d-flex align-items-center border rounded-pill px-2 py-1 bg-light">
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.product.id,
                                  item.selectedWeight,
                                  item.quantity - 1
                                )
                              }
                              className="btn btn-sm btn-link p-0 text-dark text-decoration-none"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="px-2 fw-bold small">{item.quantity}</span>
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.product.id,
                                  item.selectedWeight,
                                  item.quantity + 1
                                )
                              }
                              className="btn btn-sm btn-link p-0 text-dark text-decoration-none"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          <div className="fw-bold text-success" style={{ fontSize: '0.95rem' }}>
                            ₹{item.itemPrice * item.quantity}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Coupon Section */}
            {cart.length > 0 && (
              <div className="px-3 py-2 border-top bg-light">
                {appliedCoupon ? (
                  <div className="d-flex align-items-center justify-content-between bg-success bg-opacity-10 p-2 rounded-3 border border-success">
                    <div className="d-flex align-items-center gap-2 small fw-bold text-success">
                      <CheckCircle2 size={16} />
                      <span>Coupon {appliedCoupon} (-{couponDiscountPercent}%)</span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="btn btn-sm btn-link text-danger p-0 text-decoration-none"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="d-flex gap-2">
                    <div className="input-group input-group-sm">
                      <span className="input-group-text bg-white border-end-0">
                        <Tag size={14} className="text-muted" />
                      </span>
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        placeholder="Promo Code (FRESH20)"
                        className="form-control border-start-0 text-uppercase"
                      />
                      <button type="submit" className="btn btn-outline-success">
                        Apply
                      </button>
                    </div>
                  </form>
                )}
                {couponError && <div className="small text-danger mt-1">{couponError}</div>}
              </div>
            )}

            {/* Footer Summary & Checkout CTA */}
            {cart.length > 0 && (
              <div className="p-3 border-top bg-white">
                <div className="d-flex justify-content-between mb-1 small text-muted">
                  <span>Subtotal</span>
                  <span className="fw-bold text-dark">₹{subtotal}</span>
                </div>

                {couponDiscountAmount > 0 && (
                  <div className="d-flex justify-content-between mb-1 small text-success">
                    <span>Coupon Discount</span>
                    <span className="fw-bold">-₹{couponDiscountAmount}</span>
                  </div>
                )}

                <div className="d-flex justify-content-between mb-2 small text-muted">
                  <span>Delivery Charges</span>
                  <span>{deliveryFee === 0 ? <strong className="text-success">FREE</strong> : `₹${deliveryFee}`}</span>
                </div>

                <div className="d-flex justify-content-between mb-3 fs-5 fw-bold text-dark border-top pt-2">
                  <span>Total Amount</span>
                  <span className="text-success font-heading fs-4">₹{totalAmount}</span>
                </div>

                <div className="d-flex gap-2">
                  <Link
                    href="/cart"
                    onClick={() => setIsCartOpen(false)}
                    className="btn btn-outline-secondary rounded-pill py-2 flex-grow-1 fw-semibold"
                  >
                    View Cart
                  </Link>
                  <Link
                    href="/checkout"
                    onClick={() => setIsCartOpen(false)}
                    className="btn btn-success rounded-pill py-2 flex-grow-1 fw-bold d-flex align-items-center justify-content-center gap-2"
                    style={{ background: 'linear-gradient(135deg, #FF6F00 0%, #E66000 100%)', border: 'none' }}
                  >
                    <span>Checkout</span>
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
