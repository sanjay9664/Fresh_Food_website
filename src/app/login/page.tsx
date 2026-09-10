'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import {
  User,
  Mail,
  Lock,
  Leaf,
  ArrowRight,
  AlertCircle,
  Eye,
  EyeOff,
  CheckCircle2,
  Sparkles,
  Key
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoginPage() {
  const { login, register } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    emailOrPhone: '',
    password: ''
  });

  // These controls only fill the form; login is still validated exclusively
  // by the backend and no browser-side demo account exists.
  const handleQuickFillCustomer = () => setFormData({
    name: '', emailOrPhone: 'sanjay@freshvana.com', password: 'password123'
  });
  const handleQuickFillAdmin = () => setFormData({
    name: '', emailOrPhone: 'admin@freshvana.com', password: 'password123'
  });

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    try {
      if (isRegister) {
        const res = await register(
          formData.name || 'User',
          formData.emailOrPhone,
          formData.password,
          'customer'
        );

        if (!res.success && res.message) {
          setErrorMessage(res.message);
        } else if (res.success) {
          setSuccessMessage(res.message || 'Account created successfully! Please verify your email before signing in.');
        }
      } else {
        const res = await login(
          formData.emailOrPhone,
          formData.password,
          'customer'
        );

        if (!res.success && res.message) {
          setErrorMessage(res.message);
        } else if (res.success) {
          setSuccessMessage('Welcome back! Logging in...');
        }
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center py-5 px-3 position-relative overflow-hidden"
      style={{
        backgroundImage: 'linear-gradient(135deg, #04391d 0%, #064e28 50%, #0a6836 100%)',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {/* Soft Glow Orbs */}
      <div
        className="position-absolute rounded-circle pointer-events-none"
        style={{
          width: '450px',
          height: '450px',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.2) 0%, rgba(0,0,0,0) 70%)',
          top: '-80px',
          left: '-80px',
          zIndex: 1
        }}
      />
      <div
        className="position-absolute rounded-circle pointer-events-none"
        style={{
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(234, 179, 8, 0.15) 0%, rgba(0,0,0,0) 70%)',
          bottom: '-100px',
          right: '-100px',
          zIndex: 1
        }}
      />

      {/* Floating Organic Vegetables */}
      <motion.div
        animate={{ y: [0, 12, 0], rotate: [0, -3, 0] }}
        transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut' }}
        className="position-absolute d-none d-lg-block pointer-events-none"
        style={{ width: '250px', height: '250px', top: '5%', left: '5%', zIndex: 2 }}
      >
        <Image src="/images/c4.png" alt="Fresh Produce" fill className="object-fit-contain" />
      </motion.div>

      <motion.div
        animate={{ y: [0, -12, 0], rotate: [0, 3, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="position-absolute d-none d-lg-block pointer-events-none"
        style={{ width: '270px', height: '270px', bottom: '5%', right: '5%', zIndex: 2 }}
      >
        <Image src="/images/c1.png" alt="Fresh Vegetables" fill className="object-fit-contain" priority />
      </motion.div>

      {/* Elegant Main Login Card */}
      <div className="w-100 position-relative" style={{ maxWidth: '440px', zIndex: 5 }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="bg-white rounded-4 p-4 p-sm-4 shadow-lg border-0"
          style={{
            borderRadius: '28px',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.3)'
          }}
        >
          {/* Header */}
          <div className="text-center mb-4 pt-2">
            <div
              className="rounded-circle d-inline-flex align-items-center justify-content-center text-white mb-2 shadow-sm"
              style={{
                width: '56px',
                height: '56px',
                background: 'linear-gradient(135deg, #0A6836, #10B981)'
              }}
            >
              <Leaf size={28} />
            </div>

            <h3 className="fw-bold text-dark mb-1 fs-4">
              {isRegister ? 'Create Account' : 'Welcome Back'}
            </h3>
            <p className="text-muted small mb-0">
              {isRegister
                ? 'Sign up to order fresh organic produce'
                : 'Sign in to access your FreshVana account'}
            </p>
          </div>

          {/* Segmented Control (Sign In vs Create Account) */}
          <div
            className="d-flex rounded-pill bg-light p-1 mb-4 border"
            style={{ background: '#F3F4F6' }}
          >
            <button
              type="button"
              onClick={() => {
                setIsRegister(false);
                setErrorMessage(null);
                setSuccessMessage(null);
              }}
              className={`btn btn-sm rounded-pill flex-grow-1 py-2 fw-semibold border-0 transition-all ${
                !isRegister ? 'bg-white text-dark shadow-sm' : 'text-muted'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setIsRegister(true);
                setErrorMessage(null);
                setSuccessMessage(null);
              }}
              className={`btn btn-sm rounded-pill flex-grow-1 py-2 fw-semibold border-0 transition-all ${
                isRegister ? 'bg-white text-dark shadow-sm' : 'text-muted'
              }`}
            >
              Register
            </button>
          </div>

          {/* Alerts */}
          <AnimatePresence mode="wait">
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="alert alert-danger rounded-3 py-2 px-3 d-flex align-items-center gap-2 small fw-medium mb-3"
              >
                <AlertCircle size={16} className="flex-shrink-0" />
                <span>{errorMessage}</span>
              </motion.div>
            )}

            {successMessage && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="alert alert-success rounded-3 py-2 px-3 d-flex align-items-center gap-2 small fw-medium mb-3"
              >
                <CheckCircle2 size={16} className="flex-shrink-0" />
                <span>{successMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleAuthSubmit}>
            <div className="d-flex flex-column gap-3 mb-4">
              {/* Full Name field (Only in Register mode) */}
              {isRegister && (
                <div>
                  <label className="form-label text-secondary small fw-medium mb-1">Full Name</label>
                  <div className="input-group border rounded-3 overflow-hidden">
                    <span className="input-group-text bg-light border-0 text-muted ps-3 pe-2">
                      <User size={18} />
                    </span>
                    <input
                      type="text"
                      className="form-control border-0 py-2 small shadow-none text-dark fw-medium"
                      placeholder="e.g. Sanjay Kumar"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required={isRegister}
                    />
                  </div>
                </div>
              )}

              {/* Email / Mobile */}
              <div>
                <label className="form-label text-secondary small fw-medium mb-1">Email or Mobile</label>
                <div className="input-group border rounded-3 overflow-hidden">
                  <span className="input-group-text bg-light border-0 text-muted ps-3 pe-2">
                    <Mail size={18} />
                  </span>
                  <input
                    type="text"
                    className="form-control border-0 py-2 small shadow-none text-dark fw-medium"
                    placeholder="name@example.com or 9876543210"
                    value={formData.emailOrPhone}
                    onChange={(e) => setFormData({ ...formData, emailOrPhone: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="d-flex align-items-center justify-content-between mb-1">
                  <label className="form-label text-secondary small fw-medium mb-0">Password</label>
                  {!isRegister && (
                    <a
                      href="#forgot"
                      onClick={(e) => {
                        e.preventDefault();
                        alert('Password reset instructions sent.');
                      }}
                      className="text-success extra-small fw-semibold text-decoration-none"
                    >
                      Forgot?
                    </a>
                  )}
                </div>
                <div className="input-group border rounded-3 overflow-hidden">
                  <span className="input-group-text bg-light border-0 text-muted ps-3 pe-2">
                    <Lock size={18} />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="form-control border-0 py-2 small shadow-none text-dark fw-medium"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="btn bg-light border-0 text-muted pe-3 ps-2"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Main Action Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-success btn-lg rounded-pill w-100 py-2.5 fw-bold shadow-sm border-0 text-white d-flex align-items-center justify-content-center gap-2"
              style={{ background: '#0A6836' }}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner-border spinner-border-sm" role="status"></span>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>{isRegister ? 'Create Account' : 'Sign In'}</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Minimal Quick Demo Autofills Footer */}
          <div className="mt-4 pt-3 border-top text-center">
            <div className="d-flex align-items-center justify-content-center gap-2 extra-small text-muted mb-2">
              <Key size={13} className="text-success" />
              <span>Quick Demo Fill:</span>
              <button
                type="button"
                onClick={handleQuickFillCustomer}
                className="btn btn-link p-0 text-success fw-bold text-decoration-none extra-small"
              >
                Customer
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={handleQuickFillAdmin}
                className="btn btn-link p-0 text-dark fw-bold text-decoration-none extra-small"
              >
                Admin
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
