'use client';

import React from 'react';
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
  Heart
} from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-dark text-white pt-5 pb-4 mt-auto position-relative" style={{ background: '#091E14' }}>
      <div className="container">
        {/* Newsletter Signup Card */}
        <div
          className="rounded-4 p-4 p-md-5 mb-5 text-white position-relative overflow-hidden shadow-lg"
          style={{ background: 'linear-gradient(135deg, #0A6836 0%, #064E28 100%)' }}
        >
          <div className="row align-items-center gy-3">
            <div className="col-lg-7">
              <div className="d-inline-flex align-items-center gap-2 bg-white bg-opacity-20 rounded-pill px-3 py-1 text-white small mb-2">
                <Leaf size={14} />
                <span>SUBSCRIBE & SAVE 10%</span>
              </div>
              <h3 className="font-heading fw-extrabold fs-2 text-white mb-2">
                Join the FreshVana Family
              </h3>
              <p className="mb-0 text-white-50 small">
                Get weekly organic recipes, farm harvest updates, and secret discount coupons delivered to your inbox.
              </p>
            </div>

            <div className="col-lg-5">
              <form onSubmit={(e) => e.preventDefault()} className="d-flex gap-2">
                <div className="input-group">
                  <span className="input-group-text bg-white border-0 text-muted ps-3">
                    <Mail size={18} />
                  </span>
                  <input
                    type="email"
                    placeholder="Enter your email address..."
                    className="form-control border-0 py-3 shadow-none text-dark"
                    required
                  />
                  <button
                    className="btn btn-warning px-4 fw-bold text-dark border-0 d-flex align-items-center gap-2"
                    type="submit"
                    style={{ background: '#FFB800' }}
                  >
                    <span>Join</span>
                    <Send size={16} />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="row g-4 mb-5">
          {/* Brand Info */}
          <div className="col-12 col-md-4">
            <Link href="/" className="text-decoration-none d-flex align-items-center gap-2 mb-3">
              <div
                className="rounded-circle d-flex align-items-center justify-content-center text-white"
                style={{ width: '40px', height: '40px', background: '#0A6836' }}
              >
                <Leaf size={22} />
              </div>
              <span className="font-heading fw-extrabold fs-3 text-white">
                Fresh<span className="text-success">Vana</span>
              </span>
            </Link>

            <p className="text-secondary small mb-4" style={{ lineHeight: 1.6 }}>
              FreshVana delivers certified pesticide-free organic fruits, vegetables, and hydroponic greens directly from trusted farms to your doorstep in under 2 hours.
            </p>

            <div className="d-flex flex-column gap-2 text-secondary small">
              <div className="d-flex align-items-center gap-2">
                <MapPin size={16} className="text-success" />
                <span>124 Farmway Estate, Green Ridge, Ooty, India</span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <Phone size={16} className="text-success" />
                <span>+91 1800-FRESH-VANA (Toll-Free)</span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <Mail size={16} className="text-success" />
                <span>care@freshvana.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-6 col-md-2">
            <h6 className="font-heading text-white fw-bold mb-3">Shop Categories</h6>
            <ul className="list-unstyled d-flex flex-column gap-2 text-secondary small">
              <li><Link href="/shop?category=veggies" className="text-secondary text-decoration-none hover-text-white">Fresh Vegetables</Link></li>
              <li><Link href="/shop?category=fruits" className="text-secondary text-decoration-none hover-text-white">Fresh Fruits</Link></li>
              <li><Link href="/shop?category=greens" className="text-secondary text-decoration-none hover-text-white">Leafy Greens</Link></li>
              <li><Link href="/shop?category=organic" className="text-secondary text-decoration-none hover-text-white">Organic Picks</Link></li>
              <li><Link href="/shop?category=exotic" className="text-secondary text-decoration-none hover-text-white">Exotic Collection</Link></li>
              <li><Link href="/shop?filter=deals" className="text-secondary text-decoration-none hover-text-white">Flash Deals</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="col-6 col-md-3">
            <h6 className="font-heading text-white fw-bold mb-3">Customer Support</h6>
            <ul className="list-unstyled d-flex flex-column gap-2 text-secondary small">
              <li><Link href="/checkout" className="text-secondary text-decoration-none hover-text-white">Track Order</Link></li>
              <li><a href="#" className="text-secondary text-decoration-none hover-text-white">Delivery Terms & Areas</a></li>
              <li><a href="#" className="text-secondary text-decoration-none hover-text-white">Returns & Refund Guarantee</a></li>
              <li><a href="#" className="text-secondary text-decoration-none hover-text-white">Pesticide Free Quality Lab</a></li>
              <li><a href="#" className="text-secondary text-decoration-none hover-text-white">Frequently Asked Questions</a></li>
              <li><a href="#" className="text-secondary text-decoration-none hover-text-white">Help Center & Support</a></li>
            </ul>
          </div>

          {/* Trust Guarantees */}
          <div className="col-12 col-md-3">
            <h6 className="font-heading text-white fw-bold mb-3">FreshVana Promise</h6>
            <div className="d-flex flex-column gap-3">
              <div className="d-flex align-items-center gap-3 p-3 rounded-3 bg-white bg-opacity-10">
                <Truck size={24} className="text-success flex-shrink-0" />
                <div>
                  <strong className="d-block text-white small font-heading">Under 2-Hour Delivery</strong>
                  <span className="text-secondary d-block" style={{ fontSize: '0.72rem' }}>Temperature controlled delivery</span>
                </div>
              </div>

              <div className="d-flex align-items-center gap-3 p-3 rounded-3 bg-white bg-opacity-10">
                <ShieldCheck size={24} className="text-success flex-shrink-0" />
                <div>
                  <strong className="d-block text-white small font-heading">100% Quality Guarantee</strong>
                  <span className="text-secondary d-block" style={{ fontSize: '0.72rem' }}>Instant replacement or refund</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-4 border-top border-secondary border-opacity-25 d-flex flex-column flex-md-row align-items-center justify-content-between text-secondary small gap-3">
          <div>
            &copy; {new Date().getFullYear()} FreshVana. All Rights Reserved. Crafted with care for healthy living.
          </div>

          <div className="d-flex align-items-center gap-3">
            <div className="d-flex align-items-center gap-1">
              <ShieldCheck size={14} className="text-success" />
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
