'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Order Inquiry',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="py-5 bg-cream" style={{ paddingTop: '160px', minHeight: '85vh' }}>
      <div className="container py-3">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-5">
          <span className="badge bg-success bg-opacity-10 text-success fw-bold px-3 py-1 rounded-pill small mb-2 border border-success border-opacity-25">
            24/7 CUSTOMER CARE
          </span>
          <h1 className="font-heading display-5 fw-extrabold text-dark mb-2">
            Get in Touch with FreshVana
          </h1>
          <p className="text-muted">
            Have questions about your organic delivery, farm origins, or bulk orders? We are here to help!
          </p>
        </div>

        <div className="row g-4 mb-5">
          {/* Left Contact Form */}
          <div className="col-lg-7">
            <div className="bg-white rounded-4 p-4 p-md-5 shadow-sm border">
              <h4 className="font-heading fw-bold text-dark mb-4">Send Us a Message</h4>

              {submitted ? (
                <div className="text-center py-5">
                  <div className="rounded-circle bg-success text-white p-3 d-inline-block mb-3">
                    <CheckCircle2 size={40} />
                  </div>
                  <h4 className="font-heading fw-bold text-dark mb-2">Message Sent Successfully!</h4>
                  <p className="text-muted small mb-4">
                    Thank you for reaching out. Our organic support team will respond to your email within 2 hours.
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
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label fw-bold text-dark small">Your Full Name</label>
                      <input
                        type="text"
                        className="form-control rounded-3 py-2 px-3 small border"
                        placeholder="John Doe"
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
                        placeholder="john@example.com"
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
                        <option value="Order Inquiry">Order & Delivery Inquiry</option>
                        <option value="Quality Feedback">Quality & Freshness Feedback</option>
                        <option value="Farmer Partnership">Farmer Partnership</option>
                        <option value="Bulk Purchase">Bulk Purchase & Corporate</option>
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

                    <div className="col-12 pt-2">
                      <button
                        type="submit"
                        className="btn btn-success btn-lg rounded-pill px-5 py-3 fw-bold d-inline-flex align-items-center gap-2 shadow"
                        style={{ background: '#0A6836', border: 'none' }}
                      >
                        <span>Submit Inquiry</span>
                        <Send size={18} />
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Right Contact Cards */}
          <div className="col-lg-5">
            <div className="d-flex flex-column gap-3">
              <div className="bg-white rounded-4 p-4 shadow-sm border d-flex align-items-start gap-3">
                <div className="p-3 rounded-circle bg-success bg-opacity-10 text-success flex-shrink-0">
                  <Phone size={24} />
                </div>
                <div>
                  <h6 className="font-heading fw-bold text-dark mb-1">Customer Care Helpline</h6>
                  <p className="text-muted small mb-1">+91 1800-FRESH-VANA (Toll-Free)</p>
                  <span className="text-success small fw-bold">Available 7:00 AM - 10:00 PM</span>
                </div>
              </div>

              <div className="bg-white rounded-4 p-4 shadow-sm border d-flex align-items-start gap-3">
                <div className="p-3 rounded-circle bg-success bg-opacity-10 text-success flex-shrink-0">
                  <Mail size={24} />
                </div>
                <div>
                  <h6 className="font-heading fw-bold text-dark mb-1">Email Support</h6>
                  <p className="text-muted small mb-1">care@freshvana.com</p>
                  <span className="text-success small fw-bold">Response within 2 hours</span>
                </div>
              </div>

              <div className="bg-white rounded-4 p-4 shadow-sm border d-flex align-items-start gap-3">
                <div className="p-3 rounded-circle bg-success bg-opacity-10 text-success flex-shrink-0">
                  <MapPin size={24} />
                </div>
                <div>
                  <h6 className="font-heading fw-bold text-dark mb-1">Organic Farm Headquarters</h6>
                  <p className="text-muted small mb-0">124 Farmway Estate, Green Ridge, Ooty, Tamil Nadu, India</p>
                </div>
              </div>

              <div className="bg-white rounded-4 p-4 shadow-sm border d-flex align-items-start gap-3">
                <div className="p-3 rounded-circle bg-success bg-opacity-10 text-success flex-shrink-0">
                  <Clock size={24} />
                </div>
                <div>
                  <h6 className="font-heading fw-bold text-dark mb-1">Dispatch Operating Hours</h6>
                  <p className="text-muted small mb-0">Monday – Sunday: 6:00 AM to 11:00 PM IST</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
