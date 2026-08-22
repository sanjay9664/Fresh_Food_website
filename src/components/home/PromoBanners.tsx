'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Tag, Gift, Truck } from 'lucide-react';

export const PromoBanners: React.FC = () => {
  return (
    <section className="py-4 bg-cream">
      <div className="container">
        <div className="row g-3">
          {/* Card 1: Soft Green Extra 10% OFF */}
          <div className="col-12 col-md-4">
            <div
              className="p-4 rounded-4 text-dark position-relative overflow-hidden shadow-sm h-100 d-flex flex-column justify-content-between"
              style={{ background: 'linear-gradient(135deg, #EBF6F0 0%, #D4EFE0 100%)', border: '1px solid #B8E4CB' }}
            >
              <div>
                <span className="text-muted small fw-bold d-block mb-1">Get First Order</span>
                <h4 className="font-heading fw-extrabold text-dark mb-1">EXTRA 10% OFF</h4>
                <p className="small text-muted mb-3">Use Code: <strong className="text-success">FIRST10</strong></p>
              </div>

              <div className="d-flex align-items-end justify-content-between">
                <Link
                  href="/shop"
                  className="btn btn-sm btn-success rounded-pill px-3 py-2 fw-bold d-inline-flex align-items-center gap-1"
                  style={{ background: '#0A6836', border: 'none', fontSize: '0.82rem' }}
                >
                  <span>Shop Now</span>
                  <ArrowRight size={14} />
                </Link>

                <div className="position-relative" style={{ width: '80px', height: '60px' }}>
                  <Image src="/images/carrots.png" alt="Basket" fill className="object-fit-contain" />
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Warm Orange Refer & Earn ₹200 */}
          <div className="col-12 col-md-4">
            <div
              className="p-4 rounded-4 text-dark position-relative overflow-hidden shadow-sm h-100 d-flex flex-column justify-content-between"
              style={{ background: 'linear-gradient(135deg, #FFF4E8 0%, #FFE5C8 100%)', border: '1px solid #FCD4A6' }}
            >
              <div>
                <span className="text-warning text-dark small fw-bold d-block mb-1">Refer & Earn</span>
                <h4 className="font-heading fw-extrabold text-dark mb-1">EARN ₹200</h4>
                <p className="small text-muted mb-3">On Every Successful Referral</p>
              </div>

              <div className="d-flex align-items-end justify-content-between">
                <Link
                  href="/shop?filter=deals"
                  className="btn btn-sm rounded-pill px-3 py-2 fw-bold d-inline-flex align-items-center gap-1 text-white"
                  style={{ background: '#FF6F00', border: 'none', fontSize: '0.82rem' }}
                >
                  <span>Refer Now</span>
                  <ArrowRight size={14} />
                </Link>

                <div className="position-relative" style={{ width: '80px', height: '60px' }}>
                  <Gift size={44} className="text-warning ms-auto" />
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Soft Lavender Free Shipping */}
          <div className="col-12 col-md-4">
            <div
              className="p-4 rounded-4 text-dark position-relative overflow-hidden shadow-sm h-100 d-flex flex-column justify-content-between"
              style={{ background: 'linear-gradient(135deg, #F2EFFC 0%, #DDD5FC 100%)', border: '1px solid #C9BDFA' }}
            >
              <div>
                <span className="text-primary small fw-bold d-block mb-1">Free Shipping</span>
                <h4 className="font-heading fw-extrabold text-dark mb-1">ON ORDERS ABOVE ₹499</h4>
                <p className="small text-muted mb-3">Fast & Safe Delivery</p>
              </div>

              <div className="d-flex align-items-end justify-content-between">
                <Link
                  href="/shop"
                  className="btn btn-sm btn-primary rounded-pill px-3 py-2 fw-bold d-inline-flex align-items-center gap-1"
                  style={{ background: '#6D28D9', border: 'none', fontSize: '0.82rem' }}
                >
                  <span>Shop Now</span>
                  <ArrowRight size={14} />
                </Link>

                <div className="position-relative" style={{ width: '80px', height: '60px' }}>
                  <Truck size={44} className="text-primary ms-auto" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
