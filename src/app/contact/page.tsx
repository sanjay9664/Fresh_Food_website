'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  ShieldCheck,
  Headphones,
  ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Order & Delivery Inquiry',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const faqs = [
    {
      q: 'How fast is the organic delivery?',
      a: 'We offer Express 2-Hour Doorstep Shipping as well as morning (7 AM - 10 AM) and evening (5 PM - 8 PM) fresh pluck slots.'
    },
    {
      q: 'How do you guarantee 100% pesticide-free produce?',
      a: 'Every batch harvested from our partner farms in Ooty, Himachal, and Ratnagiri undergoes NABL-certified chemical spectrometry analysis.'
    },
    {
      q: 'What is the return policy if produce arrives damaged?',
      a: 'We offer an instant 100% No-Questions-Asked Refund or immediate same-day replacement for any item you are unsatisfied with.'
    },
    {
      q: 'Do you accept bulk organic orders for events or restaurants?',
      a: 'Yes! Select "Bulk & Wholesale Orders" in the contact inquiry form or call our direct helpline for custom wholesale pricing.'
    }
  ];

  return (
    <div className="bg-cream min-vh-100 mobile-hero-padding" style={{ paddingTop: '110px' }}>
      {/* Full-Width Hero Section Touching Under Floating Navbar */}
      <section
        className="w-100 position-relative py-5 px-3 text-white overflow-hidden"
        style={{
          backgroundImage: 'linear-gradient(180deg, rgba(4, 57, 29, 0.88) 0%, rgba(6, 78, 40, 0.90) 50%, rgba(10, 104, 54, 0.92) 100%), url(/images/login_bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          minHeight: '380px',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        {/* Floating Produce Cutout Overlay */}
        <motion.div
          animate={{ y: [0, -15, 0], rotate: [0, 3, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="position-absolute d-none d-lg-block pointer-events-none opacity-40"
          style={{ width: '380px', height: '380px', bottom: '0%', right: '2%', zIndex: 1 }}
        >
          <Image src="/images/c1.png" alt="Organic Basket" fill className="object-fit-contain" />
        </motion.div>

        <div className="container position-relative py-3" style={{ zIndex: 3 }}>
          <div className="row align-items-center gy-4">
            <div className="col-lg-7">
              <div className="d-inline-flex align-items-center gap-2 bg-white bg-opacity-20 rounded-pill px-3 py-1 text-white fw-bold small mb-3 border border-white border-opacity-30">
                <Headphones size={16} className="text-warning" />
                <span>24/7 DEDICATED ORGANIC SUPPORT</span>
              </div>

              <h1 className="font-heading display-4 fw-extrabold text-white mb-3" style={{ lineHeight: 1.12 }}>
                Get In Touch With FreshVana Organic Care
              </h1>

              <p className="fs-5 text-white-50 mb-4" style={{ lineHeight: 1.6 }}>
                Have questions about your organic delivery, farm origins, or bulk orders? Our dedicated team is here to assist you 7 days a week.
              </p>

              <div className="d-flex align-items-center gap-3 text-white-50 small flex-wrap">
                <div className="d-flex align-items-center gap-2 bg-black bg-opacity-30 rounded-pill px-3 py-2 border border-white border-opacity-20">
                  <ShieldCheck size={16} className="text-warning" />
                  <span>Response SLA Under 2 Hours</span>
                </div>
                <div className="d-flex align-items-center gap-2 bg-black bg-opacity-30 rounded-pill px-3 py-2 border border-white border-opacity-20">
                  <Phone size={16} className="text-warning" />
                  <span>Toll-Free Helpline Available</span>
                </div>
              </div>
            </div>

            <div className="col-lg-5 text-center">
              <div className="position-relative mx-auto" style={{ maxWidth: '360px', width: '100%', height: '240px' }}>
                <Image
                  src="/images/hero_organic_basket.png"
                  alt="Fresh Support"
                  fill
                  className="object-fit-contain"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Cards & Form Container */}
      <div className="container py-5">
        <div className="row g-4 mb-5">
          {/* Left Form Card */}
          <div className="col-lg-7">
            <div className="bg-white rounded-5 p-4 p-md-5 shadow-sm border">
              <h3 className="font-heading fw-extrabold text-dark mb-1">Send Us a Message</h3>
              <p className="text-muted small mb-4">Fill out the form below and our team will get back to you promptly.</p>

              {submitted ? (
                <div className="text-center py-5">
                  <div className="rounded-circle bg-success text-white p-3 d-inline-block mb-3 shadow">
                    <CheckCircle2 size={44} />
                  </div>
                  <h4 className="font-heading fw-bold text-dark mb-2">Message Sent Successfully!</h4>
                  <p className="text-muted small mb-4">
                    Thank you for reaching out. Our support specialist will respond to your email within 2 hours.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="btn btn-outline-success rounded-pill px-4 py-2 fw-semibold"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="row g-3 mb-4">
                    <div className="col-md-6">
                      <label className="form-label fw-bold text-dark small">Your Full Name</label>
                      <input
                        type="text"
                        className="form-control rounded-3 py-2 px-3 small border"
                        placeholder="Sanjay Kumar"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-bold text-dark small">Email Address</label>
                      <input
                        type="email"
                        className="form-control rounded-3 py-2 px-3 small border"
                        placeholder="sanjay@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-bold text-dark small">Phone Number</label>
                      <input
                        type="tel"
                        className="form-control rounded-3 py-2 px-3 small border"
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-bold text-dark small">Inquiry Subject</label>
                      <select
                        className="form-select rounded-3 py-2 px-3 small border"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      >
                        <option value="Order & Delivery Inquiry">Order & Delivery Inquiry</option>
                        <option value="Product Quality & Organic Assurance">Product Quality & Organic Assurance</option>
                        <option value="Bulk & Wholesale Orders">Bulk & Wholesale Orders</option>
                        <option value="General Feedback">General Feedback</option>
                      </select>
                    </div>

                    <div className="col-12">
                      <label className="form-label fw-bold text-dark small">Your Message</label>
                      <textarea
                        rows={4}
                        className="form-control rounded-3 py-2 px-3 small border"
                        placeholder="Describe your inquiry in detail..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-success btn-lg rounded-pill px-5 py-3 fw-bold text-white shadow border-0 d-inline-flex align-items-center gap-2"
                    style={{ background: '#0A6836' }}
                  >
                    <span>Submit Inquiry</span>
                    <Send size={18} />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Right Information Cards */}
          <div className="col-lg-5">
            <div className="d-flex flex-column gap-3">
              <div className="bg-white rounded-5 p-4 shadow-sm border d-flex align-items-start gap-3">
                <div className="p-3 rounded-circle bg-success bg-opacity-10 text-success flex-shrink-0">
                  <Phone size={24} />
                </div>
                <div>
                  <strong className="d-block text-dark font-heading mb-1">Customer Care Helpline</strong>
                  <span className="text-success fw-bold d-block mb-1">+91 1800-FRESH-VANA (Toll-Free)</span>
                  <span className="text-muted small">Available 7:00 AM – 10:00 PM IST</span>
                </div>
              </div>

              <div className="bg-white rounded-5 p-4 shadow-sm border d-flex align-items-start gap-3">
                <div className="p-3 rounded-circle bg-success bg-opacity-10 text-success flex-shrink-0">
                  <Mail size={24} />
                </div>
                <div>
                  <strong className="d-block text-dark font-heading mb-1">Email Support</strong>
                  <span className="text-success fw-bold d-block mb-1">care@freshvana.com</span>
                  <span className="text-muted small">Guaranteed Response within 2 hours</span>
                </div>
              </div>

              <div className="bg-white rounded-5 p-4 shadow-sm border d-flex align-items-start gap-3">
                <div className="p-3 rounded-circle bg-success bg-opacity-10 text-success flex-shrink-0">
                  <MapPin size={24} />
                </div>
                <div>
                  <strong className="d-block text-dark font-heading mb-1">Organic Farm Headquarters</strong>
                  <span className="text-dark small d-block mb-1">124 Farmway Estate, Green Ridge, Ooty, Tamil Nadu, India</span>
                </div>
              </div>

              <div className="bg-white rounded-5 p-4 shadow-sm border d-flex align-items-start gap-3">
                <div className="p-3 rounded-circle bg-success bg-opacity-10 text-success flex-shrink-0">
                  <Clock size={24} />
                </div>
                <div>
                  <strong className="d-block text-dark font-heading mb-1">Dispatch Operating Hours</strong>
                  <span className="text-muted small d-block">Monday – Sunday: 6:00 AM to 11:00 PM IST</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Accordion Section */}
        <div className="bg-white rounded-5 p-4 p-md-5 shadow-sm border">
          <div className="text-center max-w-2xl mx-auto mb-4">
            <div className="d-inline-flex align-items-center gap-2 text-success fw-bold small mb-1">
              <HelpCircle size={18} />
              <span>FREQUENTLY ASKED QUESTIONS</span>
            </div>
            <h3 className="font-heading fw-extrabold text-dark mb-1">Quick Answers</h3>
          </div>

          <div className="row g-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="col-12 col-md-6">
                <div className="p-4 rounded-4 bg-light border h-100">
                  <strong className="d-block text-dark font-heading mb-2">{faq.q}</strong>
                  <p className="text-muted small mb-0" style={{ lineHeight: 1.6 }}>{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
