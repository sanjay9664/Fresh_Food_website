'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { User, Mail, Lock, ShieldCheck, Leaf, ShieldAlert, ArrowRight, CheckCircle2, AlertCircle, Key } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const { login, register } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: 'Sanjay Kumar',
    emailOrPhone: 'sanjay@freshvana.com',
    password: 'password123'
  });

  const handleQuickFillAdmin = () => {
    setIsAdminMode(true);
    setIsRegister(false);
    setErrorMessage(null);
    setFormData({
      name: 'Super Admin (Sanjay)',
      emailOrPhone: 'admin@freshvana.com',
      password: 'password123'
    });
  };

  const handleQuickFillCustomer = () => {
    setIsAdminMode(false);
    setIsRegister(false);
    setErrorMessage(null);
    setFormData({
      name: 'Sanjay Kumar',
      emailOrPhone: 'sanjay@freshvana.com',
      password: 'password123'
    });
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const targetRole = isAdminMode ? 'admin' : 'customer';

    if (isRegister) {
      const res = register(formData.name, formData.emailOrPhone, formData.password, targetRole);
      if (!res.success && res.message) {
        setErrorMessage(res.message);
      }
    } else {
      const res = login(formData.emailOrPhone, formData.password, targetRole, formData.name);
      if (!res.success && res.message) {
        setErrorMessage(res.message);
      }
    }
  };

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center py-5 px-3 position-relative overflow-hidden"
      style={{
        backgroundImage: 'linear-gradient(180deg, rgba(4, 57, 29, 0.84) 0%, rgba(6, 78, 40, 0.88) 50%, rgba(10, 104, 54, 0.90) 100%), url(/images/login_bg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* 1. TOP LEFT CORNER: Floating Cutout */}
      <motion.div
        animate={{ y: [0, 18, 0], rotate: [0, -4, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        className="position-absolute d-none d-lg-block pointer-events-none"
        style={{
          width: '320px',
          height: '320px',
          top: '3%',
          left: '3%',
          zIndex: 2,
          filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.4))'
        }}
      >
        <Image
          src="/images/c4.png"
          alt="Organic Red Capsicum"
          fill
          className="object-fit-contain"
          style={{ mixBlendMode: 'multiply' }}
        />
      </motion.div>

      {/* 2. TOP RIGHT CORNER: Floating Cutout */}
      <motion.div
        animate={{ y: [0, -16, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut' }}
        className="position-absolute d-none d-lg-block pointer-events-none"
        style={{
          width: '340px',
          height: '340px',
          top: '2%',
          right: '3%',
          zIndex: 2,
          filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.4))'
        }}
      >
        <Image
          src="/images/c5.png"
          alt="Fresh Organic Produce"
          fill
          className="object-fit-contain"
          style={{ mixBlendMode: 'multiply' }}
        />
      </motion.div>

      {/* 3. BOTTOM LEFT CORNER: Floating Cutout */}
      <motion.div
        animate={{ y: [0, -15, 0], rotate: [0, 3, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="position-absolute d-none d-lg-block pointer-events-none"
        style={{
          width: '360px',
          height: '360px',
          bottom: '2%',
          left: '3%',
          zIndex: 2,
          filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.4))'
        }}
      >
        <Image
          src="/images/c3.png"
          alt="Fresh Farm Carrots"
          fill
          className="object-fit-contain"
          style={{ mixBlendMode: 'multiply' }}
        />
      </motion.div>

      {/* 4. BOTTOM RIGHT CORNER: Floating Cutout */}
      <motion.div
        animate={{ y: [0, 15, 0], rotate: [0, -3, 0] }}
        transition={{ duration: 7.5, repeat: Infinity, ease: 'easeInOut' }}
        className="position-absolute d-none d-lg-block pointer-events-none"
        style={{
          width: '420px',
          height: '420px',
          bottom: '2%',
          right: '2%',
          zIndex: 2,
          filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.4))'
        }}
      >
        <Image
          src="/images/c1.png"
          alt="Fresh Vegetable Basket"
          fill
          className="object-fit-contain"
          priority
          style={{ mixBlendMode: 'multiply' }}
        />
      </motion.div>

      {/* Main Glassmorphic Login Form Container */}
      <div className="container position-relative" style={{ zIndex: 5, marginTop: '70px', marginBottom: '40px' }}>
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-5">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="bg-white rounded-5 p-4 p-md-5 shadow-2xl border"
              style={{ borderRadius: '32px', boxShadow: '0 25px 60px rgba(0,0,0,0.35)' }}
            >
              {/* Brand Header */}
              <div className="text-center mb-4">
                <div
                  className="rounded-circle d-inline-flex align-items-center justify-content-center text-white mb-2 shadow-sm"
                  style={{
                    width: '64px',
                    height: '64px',
                    background: isAdminMode
                      ? 'linear-gradient(135deg, #111827, #1F2937)'
                      : 'linear-gradient(135deg, #0A6836, #064E28)'
                  }}
                >
                  {isAdminMode ? <ShieldAlert size={32} /> : <Leaf size={32} />}
                </div>

                <h3 className="font-heading fw-extrabold text-dark mb-1 fs-2">
                  {isAdminMode ? 'Super Admin Portal' : 'FreshVana Account'}
                </h3>
                <p className="text-muted small mb-0">
                  {isAdminMode
                    ? 'Super Admin Sign In for produce, inventory & storefront control'
                    : isRegister
                    ? 'Create your free account for organic delivery'
                    : 'Sign in to access your orders and rewards'}
                </p>
              </div>

              {/* Demo Quick Fill Buttons */}
              <div className="p-3 bg-light rounded-4 border mb-4">
                <div className="d-flex align-items-center gap-1 text-dark fw-bold small mb-2">
                  <Key size={16} className="text-success" />
                  <span>1-CLICK DEMO LOGIN AUTOFILL</span>
                </div>
                <div className="d-flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={handleQuickFillAdmin}
                    className="btn btn-sm btn-dark rounded-pill px-3 py-1 fw-bold text-white small d-flex align-items-center gap-1 shadow-sm"
                  >
                    <ShieldAlert size={14} className="text-warning" />
                    <span>Demo Super Admin</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleQuickFillCustomer}
                    className="btn btn-sm btn-success rounded-pill px-3 py-1 fw-bold text-white small d-flex align-items-center gap-1 shadow-sm"
                    style={{ background: '#0A6836', border: 'none' }}
                  >
                    <User size={14} />
                    <span>Demo Customer</span>
                  </button>
                </div>
              </div>

              {/* Account Mode Selector Tabs */}
              <div className="d-flex align-items-center justify-content-center gap-2 mb-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsAdminMode(false);
                    setErrorMessage(null);
                  }}
                  className={`btn btn-sm rounded-pill px-3 py-2 fw-bold ${
                    !isAdminMode ? 'btn-success text-white shadow-sm' : 'btn-light text-muted border'
                  }`}
                  style={!isAdminMode ? { background: '#0A6836', border: 'none' } : {}}
                >
                  Customer Access
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsAdminMode(true);
                    setErrorMessage(null);
                  }}
                  className={`btn btn-sm rounded-pill px-3 py-2 fw-bold ${
                    isAdminMode ? 'btn-dark text-white shadow-sm' : 'btn-light text-muted border'
                  }`}
                >
                  Super Admin Panel
                </button>
              </div>

              {/* Form Mode Switcher Tabs */}
              <div className="d-flex rounded-pill bg-light p-1 border mb-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsRegister(false);
                    setErrorMessage(null);
                  }}
                  className={`btn btn-sm rounded-pill flex-grow-1 py-2 fw-bold ${
                    !isRegister ? 'btn-success text-white shadow-sm' : 'btn-light text-muted border-0'
                  }`}
                  style={!isRegister ? { background: isAdminMode ? '#111827' : '#0A6836', border: 'none' } : {}}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsRegister(true);
                    setErrorMessage(null);
                  }}
                  className={`btn btn-sm rounded-pill flex-grow-1 py-2 fw-bold ${
                    isRegister ? 'btn-success text-white shadow-sm' : 'btn-light text-muted border-0'
                  }`}
                  style={isRegister ? { background: isAdminMode ? '#111827' : '#0A6836', border: 'none' } : {}}
                >
                  Register / Sign Up
                </button>
              </div>

              {/* Error Alert Display */}
              {errorMessage && (
                <div className="alert alert-danger rounded-4 d-flex align-items-center gap-2 small fw-semibold mb-4">
                  <AlertCircle size={18} className="flex-shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Login / Register Form */}
              <form onSubmit={handleAuthSubmit}>
                <div className="d-flex flex-column gap-3 mb-4">
                  {/* Full Name Input */}
                  <div>
                    <label className="form-label fw-bold text-dark small mb-1">
                      Full Name
                    </label>
                    <div className="input-group border rounded-3 overflow-hidden">
                      <span className="input-group-text bg-light border-0 text-muted ps-3">
                        <User size={18} />
                      </span>
                      <input
                        type="text"
                        className="form-control border-0 py-2 small shadow-none text-dark fw-semibold"
                        placeholder="e.g. Sanjay Kumar"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  {/* Email / Mobile Input */}
                  <div>
                    <label className="form-label fw-bold text-dark small mb-1">
                      {isAdminMode ? 'Super Admin Email or Phone' : 'Email Address or Mobile Number'}
                    </label>
                    <div className="input-group border rounded-3 overflow-hidden">
                      <span className="input-group-text bg-light border-0 text-muted ps-3">
                        <Mail size={18} />
                      </span>
                      <input
                        type="text"
                        className="form-control border-0 py-2 small shadow-none text-dark fw-semibold"
                        placeholder={isAdminMode ? 'admin@freshvana.com or 8707375679' : 'sanjay@freshvana.com or 9876543210'}
                        value={formData.emailOrPhone}
                        onChange={(e) => setFormData({ ...formData, emailOrPhone: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  {/* Password Input */}
                  <div>
                    <label className="form-label fw-bold text-dark small mb-1">Password</label>
                    <div className="input-group border rounded-3 overflow-hidden">
                      <span className="input-group-text bg-light border-0 text-muted ps-3">
                        <Lock size={18} />
                      </span>
                      <input
                        type="password"
                        className="form-control border-0 py-2 small shadow-none text-dark fw-semibold"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className={`btn btn-lg rounded-pill w-100 py-3 fw-bold shadow border-0 text-white d-flex align-items-center justify-content-center gap-2 ${
                    isAdminMode ? 'btn-dark' : 'btn-success'
                  }`}
                  style={!isAdminMode ? { background: '#0A6836' } : {}}
                >
                  <span>
                    {isRegister
                      ? `Register New ${isAdminMode ? 'Super Admin' : 'Customer'} Account`
                      : isAdminMode
                      ? 'Sign In to Super Admin Control Panel'
                      : `Sign In as ${formData.name || 'User'} & Continue`}
                  </span>
                  <ArrowRight size={18} />
                </button>
              </form>

              <div className="text-center mt-4 pt-3 border-top">
                <div className="d-flex align-items-center justify-content-center gap-1 text-muted small">
                  <ShieldCheck size={16} className="text-success" />
                  <span>256-Bit Encrypted Secure Sign-In</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
