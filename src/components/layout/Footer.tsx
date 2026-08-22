'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Leaf,
  Mail,
  Phone,
  MapPin,
  Send,
  ShieldCheck,
  Truck,
  RotateCcw,
  CreditCard,
  Heart,
  Sparkles,
  CheckCircle2,
  Lock,
  Award
} from 'lucide-react';
import { motion } from 'framer-motion';

export const Footer: React.FC = () => {
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
    }
  };

  return (
    <footer className="text-white pt-5 pb-4 mt-auto position-relative" style={{ background: '#051D12' }}>
      <div className="container">
        {/* Newsletter Signup Banner */}
        <div
          className="rounded-5 p-4 p-md-5 mb-5 text-white position-relative overflow-hidden shadow-2xl border"
          style={{
            background: 'linear-gradient(135deg, #04391D 0%, #064E28 50%, #0A6836 100%)',
            borderColor: 'rgba(255, 255, 255, 0.15)'
          }}
        >
          {/* Floating Produce Cutout Image Accent */}
          <motion.div
            animate={{ y: [0, -12, 0], rotate: [0, 2, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            className="position-absolute d-none d-lg-block pointer-events-none opacity-40"
            style={{ width: '320px', height: '320px', right: '-2%', bottom: '-15%', zIndex: 1 }}
          >
            <Image src="/images/c1.png" alt="Organic Basket" fill className="object-fit-contain" />
          </motion.div>

          <div className="row align-items-center gy-4 position-relative" style={{ zIndex: 3 }}>
            <div className="col-lg-7">
              <div className="d-inline-flex align-items-center gap-2 bg-warning bg-opacity-20 text-warning rounded-pill px-3 py-1 fw-bold small mb-3 border border-warning border-opacity-30">
                <Sparkles size={16} />
                <span>GET 20% OFF YOUR FIRST ORDER</span>
              </div>

              <h3 className="font-heading display-6 fw-extrabold text-white mb-2" style={{ lineHeight: 1.15 }}>
                Join the FreshVana Organic Family
              </h3>

              <p className="mb-0 text-white-50 fs-6" style={{ lineHeight: 1.6 }}>
                Get weekly organic farm harvest updates, healthy recipes, and secret discount coupons delivered straight to your inbox.
              </p>
            </div>

            <div className="col-lg-5">
              {subscribed ? (
                <div className="bg-white bg-opacity-10 rounded-4 p-3 border border-white border-opacity-20 text-center">
                  <div className="d-flex align-items-center justify-content-center gap-2 text-warning fw-bold mb-1">
                    <CheckCircle2 size={20} />
                    <span>Welcome to FreshVana Family!</span>
                  </div>
                  <span className="text-white-50 small">Your 20% OFF coupon code <strong>FRESH20</strong> is active!</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="d-flex flex-column gap-2">
                  <div className="input-group rounded-pill overflow-hidden bg-white p-1 shadow-lg">
                    <span className="input-group-text bg-transparent border-0 text-muted ps-3">
                      <Mail size={18} />
                    </span>
                    <input
                      type="email"
                      placeholder="Enter your email address..."
                      className="form-control border-0 bg-transparent py-2 shadow-none text-dark small"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <button
                      className="btn btn-warning rounded-pill px-4 fw-bold text-dark border-0 d-inline-flex align-items-center gap-2 shadow"
                      type="submit"
                      style={{ background: '#FFB800' }}
                    >
                      <span>Join Now</span>
                      <Send size={16} />
                    </button>
                  </div>
                  <span className="text-white-50 small ps-3" style={{ fontSize: '0.72rem' }}>
                    🔒 We respect your privacy. Unsubscribe anytime with 1-click.
                  </span>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Main Footer Content Columns */}
        <div className="row g-4 mb-5 pt-3 border-top border-white border-opacity-10">
          {/* Column 1: Brand Info & Contact Pills */}
          <div className="col-12 col-md-4">
            <Link href="/" className="text-decoration-none d-inline-flex align-items-center gap-2 mb-3">
              <div
                className="rounded-circle d-flex align-items-center justify-content-center text-white shadow-sm"
                style={{ width: '42px', height: '42px', background: 'linear-gradient(135deg, #0A6836, #064E28)' }}
              >
                <Leaf size={24} className="animate-float-fast" />
              </div>
              <span className="font-heading fw-extrabold fs-3 text-white">
                Fresh<span style={{ color: '#4CAF50' }}>Vana</span>
              </span>
            </Link>

            <p className="text-white-50 small mb-4" style={{ lineHeight: 1.65 }}>
              FreshVana delivers 100% certified pesticide-free organic fruits, vegetables, and hydroponic greens directly from trusted local farms to your doorstep in under 2 hours.
            </p>

            <div className="d-flex flex-column gap-2 text-white-50 small">
              <div className="d-flex align-items-center gap-2">
                <MapPin size={16} className="text-success" />
                <span>124 Farmway Estate, Green Ridge, Ooty, India</span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <Phone size={16} className="text-success" />
                <span>+91 1800-FRESH-VANA (Toll-Free Helpline)</span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <Mail size={16} className="text-success" />
                <span>care@freshvana.com</span>
              </div>
            </div>
          </div>

          {/* Column 2: Shop Categories */}
          <div className="col-6 col-md-2">
            <h6 className="font-heading fw-extrabold text-white mb-3 text-uppercase" style={{ letterSpacing: '0.5px' }}>
              Shop Categories
            </h6>
            <ul className="list-unstyled d-flex flex-column gap-2 small text-white-50">
              <li>
                <Link href="/shop?category=veggies" className="text-white-50 text-decoration-none hover-text-white transition-all">
                  Fresh Vegetables
                </Link>
              </li>
              <li>
                <Link href="/shop?category=fruits" className="text-white-50 text-decoration-none hover-text-white transition-all">
                  Fresh Fruits
                </Link>
              </li>
              <li>
                <Link href="/shop?category=leafy" className="text-white-50 text-decoration-none hover-text-white transition-all">
                  Leafy Greens
                </Link>
              </li>
              <li>
                <Link href="/shop?category=organic" className="text-white-50 text-decoration-none hover-text-white transition-all">
                  Organic Picks
                </Link>
              </li>
              <li>
                <Link href="/shop?category=exotic" className="text-white-50 text-decoration-none hover-text-white transition-all">
                  Exotic Collection
                </Link>
              </li>
              <li>
                <Link href="/deals" className="text-warning text-decoration-none fw-bold">
                  🔥 Flash Deals Hub
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Support */}
          <div className="col-6 col-md-3">
            <h6 className="font-heading fw-extrabold text-white mb-3 text-uppercase" style={{ letterSpacing: '0.5px' }}>
              Customer Support
            </h6>
            <ul className="list-unstyled d-flex flex-column gap-2 small text-white-50">
              <li>
                <Link href="/contact" className="text-white-50 text-decoration-none hover-text-white transition-all">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-white-50 text-decoration-none hover-text-white transition-all">
                  Delivery Terms & Areas
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-white-50 text-decoration-none hover-text-white transition-all">
                  Returns & Refund Guarantee
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-white-50 text-decoration-none hover-text-white transition-all">
                  Pesticide-Free Quality Lab
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-white-50 text-decoration-none hover-text-white transition-all">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-white-50 text-decoration-none hover-text-white transition-all">
                  Help Center & Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: FreshVana Organic Promise Cards */}
          <div className="col-12 col-md-3">
            <h6 className="font-heading fw-extrabold text-white mb-3 text-uppercase" style={{ letterSpacing: '0.5px' }}>
              FreshVana Organic Guarantee
            </h6>

            <div className="d-flex flex-column gap-3">
              <div className="bg-white bg-opacity-10 rounded-4 p-3 border border-white border-opacity-15 d-flex align-items-center gap-3">
                <div className="p-2 rounded-circle bg-success text-white">
                  <Truck size={20} />
                </div>
                <div>
                  <strong className="d-block text-white font-heading small">Under 2-Hour Delivery</strong>
                  <span className="text-white-50" style={{ fontSize: '0.72rem' }}>Temperature controlled delivery</span>
                </div>
              </div>

              <div className="bg-white bg-opacity-10 rounded-4 p-3 border border-white border-opacity-15 d-flex align-items-center gap-3">
                <div className="p-2 rounded-circle bg-success text-white">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <strong className="d-block text-white font-heading small">100% Quality Guarantee</strong>
                  <span className="text-white-50" style={{ fontSize: '0.72rem' }}>Instant replacement or refund</span>
                </div>
              </div>

              <div className="bg-white bg-opacity-10 rounded-4 p-3 border border-white border-opacity-15 d-flex align-items-center gap-3">
                <div className="p-2 rounded-circle bg-success text-white">
                  <Award size={20} />
                </div>
                <div>
                  <strong className="d-block text-white font-heading small">NABL Lab Certified</strong>
                  <span className="text-white-50" style={{ fontSize: '0.72rem' }}>Tested for 200+ chemicals</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="pt-4 border-top border-white border-opacity-10 d-flex flex-column flex-md-row align-items-center justify-content-between gap-3 text-white-50 small">
          <div>
            © 2026 <strong className="text-white font-heading">FreshVana</strong>. All Rights Reserved. Crafted with care for healthy living.
          </div>

          <div className="d-flex align-items-center gap-3 flex-wrap">
            <div className="d-flex align-items-center gap-1">
              <Lock size={14} className="text-success" />
              <span>256-Bit SSL Encrypted Payment</span>
            </div>
            <span>•</span>
            <div className="d-flex align-items-center gap-1">
              <Leaf size={14} className="text-success" />
              <span>100% Organic Certified</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
