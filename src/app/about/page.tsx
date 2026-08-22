'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Leaf, ShieldCheck, Sprout, Truck, Award, Users, Heart, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AboutPage() {
  return (
    <div className="bg-cream min-vh-100" style={{ paddingTop: '110px' }}>
      {/* Full-Width Hero Section Touching Under Navbar */}
      <section
        className="w-100 position-relative py-5 px-3 text-white overflow-hidden"
        style={{
          backgroundImage: 'linear-gradient(180deg, rgba(4, 57, 29, 0.88) 0%, rgba(6, 78, 40, 0.90) 50%, rgba(10, 104, 54, 0.92) 100%), url(/images/login_bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          minHeight: '480px',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        {/* Floating Produce Cutouts in Background */}
        <motion.div
          animate={{ y: [0, -15, 0], rotate: [0, 3, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="position-absolute d-none d-lg-block pointer-events-none opacity-40"
          style={{ width: '420px', height: '420px', bottom: '0%', right: '2%', zIndex: 1 }}
        >
          <Image src="/images/c1.png" alt="Organic Basket" fill className="object-fit-contain" />
        </motion.div>

        <div className="container position-relative py-4" style={{ zIndex: 3 }}>
          <div className="row align-items-center gy-4">
            <div className="col-lg-7">
              <div className="d-inline-flex align-items-center gap-2 bg-white bg-opacity-20 rounded-pill px-3 py-1 text-white fw-bold small mb-3 border border-white border-opacity-30">
                <Sparkles size={16} className="text-warning" />
                <span>OUR ORGANIC FARM STORY</span>
              </div>

              <h1 className="font-heading display-4 fw-extrabold text-white mb-3" style={{ lineHeight: 1.12 }}>
                Freshness, Naturally Delivered From Farm To Table
              </h1>

              <p className="fs-5 text-white-50 mb-4" style={{ lineHeight: 1.6 }}>
                FreshVana was built with a single mission: to deliver 100% certified pesticide-free organic vegetables & fruits directly from local green farms to your home within 12 hours of harvest.
              </p>

              <div className="d-flex align-items-center gap-3 flex-wrap">
                <Link
                  href="/shop"
                  className="btn btn-warning btn-lg rounded-pill px-4 py-3 fw-bold text-dark d-inline-flex align-items-center gap-2 shadow"
                  style={{ background: '#FFB800', border: 'none' }}
                >
                  <span>Explore Fresh Harvest Catalog</span>
                  <ArrowRight size={18} />
                </Link>
                <Link
                  href="/categories"
                  className="btn btn-outline-light btn-lg rounded-pill px-4 py-3 fw-bold d-inline-flex align-items-center gap-2"
                >
                  <span>Browse Categories</span>
                  <ArrowRight size={18} />
                </Link>
              </div>
            </div>

            <div className="col-lg-5 text-center">
              <div className="position-relative mx-auto" style={{ maxWidth: '380px', width: '100%' }}>
                <div
                  className="position-relative bg-white bg-opacity-10 rounded-5 p-3 border border-white border-opacity-20 shadow-2xl"
                  style={{ height: '320px', filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.3))' }}
                >
                  <Image
                    src="/images/hero_organic_basket.png"
                    alt="FreshVana Organic Harvest"
                    fill
                    className="object-fit-contain p-2"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics Row */}
      <section className="bg-white py-5 border-bottom shadow-xs">
        <div className="container">
          <div className="row g-4 text-center">
            <div className="col-6 col-md-3">
              <h2 className="font-heading display-5 fw-extrabold text-success mb-1">50,000+</h2>
              <span className="text-muted small fw-semibold">Happy Healthy Families</span>
            </div>
            <div className="col-6 col-md-3">
              <h2 className="font-heading display-5 fw-extrabold text-success mb-1">500+</h2>
              <span className="text-muted small fw-semibold">Certified Organic Farms</span>
            </div>
            <div className="col-6 col-md-3">
              <h2 className="font-heading display-5 fw-extrabold text-success mb-1">100%</h2>
              <span className="text-muted small fw-semibold">Pesticide Free Guarantee</span>
            </div>
            <div className="col-6 col-md-3">
              <h2 className="font-heading display-5 fw-extrabold text-success mb-1">&lt; 2 Hrs</h2>
              <span className="text-muted small fw-semibold">Express Doorstep Delivery</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Core Organic Pillars */}
      <section className="container py-5">
        <div className="text-center max-w-2xl mx-auto mb-5">
          <span className="badge bg-success bg-opacity-10 text-success fw-bold px-3 py-1 rounded-pill small mb-2 border border-success border-opacity-25">
            OUR PROMISE TO YOU
          </span>
          <h2 className="font-heading display-6 fw-extrabold text-dark mb-2">
            Why Conscious Families Choose FreshVana
          </h2>
          <p className="text-muted small">
            We follow strict lab testing and cold-chain protocols so you receive pure, nutrient-rich produce.
          </p>
        </div>

        <div className="row g-4">
          <div className="col-12 col-md-6 col-lg-3">
            <div className="p-4 rounded-5 bg-white border shadow-sm h-100">
              <div className="p-3 rounded-circle bg-success bg-opacity-10 text-success d-inline-block mb-3">
                <Sprout size={28} />
              </div>
              <h5 className="font-heading fw-bold text-dark mb-2">Direct From Farms</h5>
              <p className="text-muted small mb-0" style={{ lineHeight: 1.6 }}>
                Harvested daily at 4:00 AM from Ooty, Himachal Pradesh, and Ratnagiri organic orchards.
              </p>
            </div>
          </div>

          <div className="col-12 col-md-6 col-lg-3">
            <div className="p-4 rounded-5 bg-white border shadow-sm h-100">
              <div className="p-3 rounded-circle bg-success bg-opacity-10 text-success d-inline-block mb-3">
                <ShieldCheck size={28} />
              </div>
              <h5 className="font-heading fw-bold text-dark mb-2">Zero Pesticides</h5>
              <p className="text-muted small mb-0" style={{ lineHeight: 1.6 }}>
                Lab tested for 200+ chemical residues. 100% natural, non-GMO, and chemical-free.
              </p>
            </div>
          </div>

          <div className="col-12 col-md-6 col-lg-3">
            <div className="p-4 rounded-5 bg-white border shadow-sm h-100">
              <div className="p-3 rounded-circle bg-success bg-opacity-10 text-success d-inline-block mb-3">
                <Truck size={28} />
              </div>
              <h5 className="font-heading fw-bold text-dark mb-2">Cold-Chain Express</h5>
              <p className="text-muted small mb-0" style={{ lineHeight: 1.6 }}>
                Temperature-controlled vans ensure veggies remain crisp and garden-fresh until your doorstep.
              </p>
            </div>
          </div>

          <div className="col-12 col-md-6 col-lg-3">
            <div className="p-4 rounded-5 bg-white border shadow-sm h-100">
              <div className="p-3 rounded-circle bg-success bg-opacity-10 text-success d-inline-block mb-3">
                <Award size={28} />
              </div>
              <h5 className="font-heading fw-bold text-dark mb-2">Eco Packaging</h5>
              <p className="text-muted small mb-0" style={{ lineHeight: 1.6 }}>
                100% plastic-free biodegradable paper bags and reusable organic cotton mesh totes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Farm Partner Highlight Banner */}
      <section className="container mb-5">
        <div
          className="rounded-5 text-white p-4 p-md-5 position-relative overflow-hidden shadow-lg"
          style={{ background: 'linear-gradient(135deg, #04391D 0%, #064E28 50%, #0A6836 100%)' }}
        >
          <div className="row align-items-center gy-4">
            <div className="col-lg-7">
              <span className="badge bg-warning text-dark fw-bold px-3 py-1 rounded-pill small mb-3">
                LAB CERTIFIED FRESHNESS
              </span>
              <h3 className="font-heading display-6 fw-extrabold text-white mb-3">
                Pesticide-Free Guarantee Certificate
              </h3>
              <p className="text-white-50 mb-4" style={{ lineHeight: 1.6 }}>
                Every single item in our inventory passes through automated optical sorting and chemical spectrometry analysis before dispatch.
              </p>

              <div className="d-flex flex-column gap-2 mb-4">
                <div className="d-flex align-items-center gap-2 text-white">
                  <CheckCircle2 size={18} className="text-warning" />
                  <span className="small">NABL Lab Certified Residue Free</span>
                </div>
                <div className="d-flex align-items-center gap-2 text-white">
                  <CheckCircle2 size={18} className="text-warning" />
                  <span className="small">Zero Wax Coatings or Artificial Ripeners</span>
                </div>
                <div className="d-flex align-items-center gap-2 text-white">
                  <CheckCircle2 size={18} className="text-warning" />
                  <span className="small">Same-Day Pluck & Delivery Workflow</span>
                </div>
              </div>

              <Link
                href="/shop"
                className="btn btn-warning rounded-pill px-4 py-3 fw-bold text-dark d-inline-flex align-items-center gap-2 border-0 shadow"
              >
                <span>Shop Certified Organic Now</span>
                <ArrowRight size={18} />
              </Link>
            </div>

            <div className="col-lg-5 text-center">
              <div className="position-relative mx-auto" style={{ maxWidth: '360px', width: '100%', height: '280px' }}>
                <Image
                  src="/images/hero_exotic_veggies.png"
                  alt="Organic Veggies"
                  fill
                  className="object-fit-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
