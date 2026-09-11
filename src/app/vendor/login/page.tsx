'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { 
  Store, 
  Lock, 
  Mail, 
  ArrowRight, 
  ShieldCheck, 
  TrendingUp, 
  Truck, 
  CreditCard, 
  Leaf, 
  CheckCircle2, 
  Key,
  Building2,
  Phone,
  UserCheck
} from 'lucide-react';

export default function VendorLoginPage() {
  const { login, register, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState('vendoruser@marketplace.com');
  const [loginPassword, setLoginPassword] = useState('Vendor123!');

  // Register form state
  const [regStoreName, setRegStoreName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsSubmitting(true);

    try {
      const res = await login(loginEmail, loginPassword, 'vendor', loginEmail.includes('vendor') ? 'Green Harvest Organic Farm' : undefined);
      if (!res.success) {
        setErrorMsg(res.message || 'Vendor login failed. Please check credentials.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!regStoreName.trim() || !regEmail.trim() || !regPassword.trim()) {
      setErrorMsg('Please fill in all required vendor registration fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await register(regStoreName, regEmail, regPassword, 'vendor');
      if (res.success) {
        setSuccessMsg('Vendor Application Submitted! Logging you in...');
        setTimeout(() => {
          login(regEmail, regPassword, 'vendor', regStoreName);
        }, 1200);
      } else {
        setErrorMsg(res.message || 'Registration failed.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit registration.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAutofillDemo = () => {
    setLoginEmail('vendoruser@marketplace.com');
    setLoginPassword('Vendor123!');
    setErrorMsg(null);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #064e3b 100%)',
      color: '#f8fafc',
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between'
    }}>
      {/* Top Header Navigation */}
      <header style={{
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '1.25rem 2rem',
        backdropFilter: 'blur(10px)',
        backgroundColor: 'rgba(15, 23, 42, 0.75)',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        <div className="container-fluid d-flex align-items-center justify-content-between" style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <Link href="/" className="d-flex align-items-center gap-2 text-decoration-none">
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)'
            }}>
              <Store size={22} color="#ffffff" />
            </div>
            <div>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' }}>FreshVana</span>
              <span style={{ fontSize: '0.75rem', display: 'block', color: '#34d399', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Vendor Partner Hub</span>
            </div>
          </Link>

          <div className="d-flex align-items-center gap-3">
            <Link 
              href="/login" 
              className="btn btn-outline-light btn-sm px-3 rounded-pill d-flex align-items-center gap-2"
              style={{ borderColor: 'rgba(255, 255, 255, 0.25)', fontSize: '0.85rem' }}
            >
              <UserCheck size={15} />
              <span>Customer Login</span>
            </Link>
            <Link 
              href="/" 
              className="btn btn-emerald btn-sm px-3 rounded-pill text-white fw-bold d-flex align-items-center gap-1"
              style={{ backgroundColor: '#10b981', border: 'none', fontSize: '0.85rem' }}
            >
              <span>Back to Store</span>
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Body Section */}
      <main style={{ padding: '3rem 1.5rem', flex: 1, display: 'flex', alignItems: 'center' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
          <div className="row g-5 align-items-center">
            
            {/* Left Column: Value Proposition & Partner Benefits */}
            <div className="col-lg-6 text-white">
              <div className="mb-4">
                <span className="badge rounded-pill bg-emerald-subtle text-emerald-light px-3 py-2 border border-emerald" style={{
                  backgroundColor: 'rgba(16, 185, 129, 0.15)',
                  color: '#6ee7b7',
                  borderColor: 'rgba(16, 185, 129, 0.3)',
                  fontSize: '0.825rem',
                  fontWeight: 600
                }}>
                  <ShieldCheck size={14} className="me-1" style={{ verticalAlign: '-2px' }} />
                  Official Seller & Farmer Portal
                </span>
                <h1 className="display-5 fw-extrabold mt-3 mb-3" style={{ letterSpacing: '-0.03em', lineHeight: 1.15 }}>
                  Grow Your Fresh Produce Business with <span style={{ color: '#34d399' }}>FreshVana</span>
                </h1>
                <p style={{ color: '#94a3b8', fontSize: '1.1rem', lineHeight: 1.6 }}>
                  Direct access to thousands of daily grocery buyers. List organic vegetables, fruits, and farm produce with automated payout settlements and inventory management.
                </p>
              </div>

              <div className="row g-3 mt-2">
                <div className="col-sm-6">
                  <div style={{
                    padding: '1.25rem',
                    borderRadius: '16px',
                    backgroundColor: 'rgba(30, 41, 59, 0.6)',
                    border: '1px solid rgba(255, 255, 255, 0.08)'
                  }}>
                    <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.75rem' }}>
                      <TrendingUp size={22} color="#34d399" />
                    </div>
                    <h6 className="fw-bold mb-1 text-white">Zero Listing Fee</h6>
                    <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: 0 }}>List unlimited inventory with 0% upfront commission fee.</p>
                  </div>
                </div>

                <div className="col-sm-6">
                  <div style={{
                    padding: '1.25rem',
                    borderRadius: '16px',
                    backgroundColor: 'rgba(30, 41, 59, 0.6)',
                    border: '1px solid rgba(255, 255, 255, 0.08)'
                  }}>
                    <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.75rem' }}>
                      <CreditCard size={22} color="#60a5fa" />
                    </div>
                    <h6 className="fw-bold mb-1 text-white">Daily Express Payouts</h6>
                    <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: 0 }}>Automated direct bank deposits within 24 hours of fulfillment.</p>
                  </div>
                </div>

                <div className="col-sm-6">
                  <div style={{
                    padding: '1.25rem',
                    borderRadius: '16px',
                    backgroundColor: 'rgba(30, 41, 59, 0.6)',
                    border: '1px solid rgba(255, 255, 255, 0.08)'
                  }}>
                    <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.75rem' }}>
                      <Truck size={22} color="#fbbf24" />
                    </div>
                    <h6 className="fw-bold mb-1 text-white">Cold Chain Logistics</h6>
                    <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: 0 }}>Pick & pack support from our local dark store fulfillment hubs.</p>
                  </div>
                </div>

                <div className="col-sm-6">
                  <div style={{
                    padding: '1.25rem',
                    borderRadius: '16px',
                    backgroundColor: 'rgba(30, 41, 59, 0.6)',
                    border: '1px solid rgba(255, 255, 255, 0.08)'
                  }}>
                    <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(168, 85, 247, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.75rem' }}>
                      <Leaf size={22} color="#c084fc" />
                    </div>
                    <h6 className="fw-bold mb-1 text-white">Quality Certification</h6>
                    <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: 0 }}>Verified Green Label badge to build buyer trust instantly.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Auth Card */}
            <div className="col-lg-6">
              <div style={{
                background: 'rgba(30, 41, 59, 0.85)',
                backdropFilter: 'blur(20px)',
                borderRadius: '24px',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                padding: '2.5rem 2rem',
                maxWidth: '500px',
                margin: '0 auto'
              }}>

                {/* Tab Buttons */}
                <div style={{
                  display: 'flex',
                  backgroundColor: 'rgba(15, 23, 42, 0.6)',
                  borderRadius: '14px',
                  padding: '4px',
                  marginBottom: '1.75rem',
                  border: '1px solid rgba(255, 255, 255, 0.05)'
                }}>
                  <button
                    onClick={() => { setActiveTab('login'); setErrorMsg(null); setSuccessMsg(null); }}
                    style={{
                      flex: 1,
                      padding: '0.75rem 1rem',
                      borderRadius: '10px',
                      border: 'none',
                      backgroundColor: activeTab === 'login' ? '#10b981' : 'transparent',
                      color: activeTab === 'login' ? '#ffffff' : '#94a3b8',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      transition: 'all 0.2s ease',
                      cursor: 'pointer'
                    }}
                  >
                    Vendor Sign In
                  </button>
                  <button
                    onClick={() => { setActiveTab('register'); setErrorMsg(null); setSuccessMsg(null); }}
                    style={{
                      flex: 1,
                      padding: '0.75rem 1rem',
                      borderRadius: '10px',
                      border: 'none',
                      backgroundColor: activeTab === 'register' ? '#10b981' : 'transparent',
                      color: activeTab === 'register' ? '#ffffff' : '#94a3b8',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      transition: 'all 0.2s ease',
                      cursor: 'pointer'
                    }}
                  >
                    Become a Supplier
                  </button>
                </div>

                {/* Quick Demo Credentials Autofill Banner */}
                <div 
                  onClick={handleAutofillDemo}
                  style={{
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    border: '1px dashed rgba(16, 185, 129, 0.4)',
                    borderRadius: '12px',
                    padding: '0.75rem 1rem',
                    marginBottom: '1.5rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div className="d-flex align-items-center gap-2">
                    <Key size={16} color="#34d399" />
                    <div>
                      <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#6ee7b7' }}>Quick Demo Vendor Login</div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>vendoruser@marketplace.com | Vendor123!</div>
                    </div>
                  </div>
                  <span className="badge bg-emerald" style={{ backgroundColor: '#10b981', fontSize: '0.7rem' }}>Click to Autofill</span>
                </div>

                {/* Feedback Alerts */}
                {errorMsg && (
                  <div className="alert alert-danger py-2 px-3 mb-3 border-0 rounded-3 text-white" style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)', border: '1px solid rgba(239, 68, 68, 0.4)', fontSize: '0.85rem' }}>
                    {errorMsg}
                  </div>
                )}
                {successMsg && (
                  <div className="alert alert-success py-2 px-3 mb-3 border-0 text-white" style={{ backgroundColor: 'rgba(16, 185, 129, 0.2)', border: '1px solid rgba(16, 185, 129, 0.4)', fontSize: '0.85rem' }}>
                    <CheckCircle2 size={16} className="me-2" style={{ verticalAlign: '-2px' }} />
                    {successMsg}
                  </div>
                )}

                {/* FORM: LOGIN */}
                {activeTab === 'login' ? (
                  <form onSubmit={handleLoginSubmit}>
                    <div className="mb-3">
                      <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.35rem', display: 'block' }}>
                        Vendor Account Email / ID
                      </label>
                      <div className="position-relative">
                        <Mail size={18} color="#64748b" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                        <input
                          type="email"
                          required
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          placeholder="e.g. vendor@freshvana.com"
                          style={{
                            width: '100%',
                            padding: '0.75rem 1rem 0.75rem 2.6rem',
                            backgroundColor: 'rgba(15, 23, 42, 0.7)',
                            border: '1px solid rgba(255, 255, 255, 0.15)',
                            borderRadius: '12px',
                            color: '#ffffff',
                            fontSize: '0.925rem',
                            outline: 'none'
                          }}
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="d-flex align-items-center justify-content-between mb-1">
                        <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', display: 'block' }}>
                          Password
                        </label>
                        <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('Password reset link sent to vendor email address.'); }} style={{ fontSize: '0.75rem', color: '#34d399', textDecoration: 'none' }}>
                          Forgot password?
                        </a>
                      </div>
                      <div className="position-relative">
                        <Lock size={18} color="#64748b" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                        <input
                          type="password"
                          required
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          placeholder="••••••••"
                          style={{
                            width: '100%',
                            padding: '0.75rem 1rem 0.75rem 2.6rem',
                            backgroundColor: 'rgba(15, 23, 42, 0.7)',
                            border: '1px solid rgba(255, 255, 255, 0.15)',
                            borderRadius: '12px',
                            color: '#ffffff',
                            fontSize: '0.925rem',
                            outline: 'none'
                          }}
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting || loading}
                      style={{
                        width: '100%',
                        padding: '0.875rem',
                        borderRadius: '12px',
                        border: 'none',
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        color: '#ffffff',
                        fontWeight: 700,
                        fontSize: '1rem',
                        boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      {isSubmitting || loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                          <span>Authenticating...</span>
                        </>
                      ) : (
                        <>
                          <span>Access Vendor Dashboard</span>
                          <ArrowRight size={18} />
                        </>
                      )}
                    </button>
                  </form>
                ) : (
                  /* FORM: REGISTER */
                  <form onSubmit={handleRegisterSubmit}>
                    <div className="mb-3">
                      <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.35rem', display: 'block' }}>
                        Farm / Business Name
                      </label>
                      <div className="position-relative">
                        <Building2 size={18} color="#64748b" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                        <input
                          type="text"
                          required
                          value={regStoreName}
                          onChange={(e) => setRegStoreName(e.target.value)}
                          placeholder="e.g. Green Harvest Organic Farm"
                          style={{
                            width: '100%',
                            padding: '0.75rem 1rem 0.75rem 2.6rem',
                            backgroundColor: 'rgba(15, 23, 42, 0.7)',
                            border: '1px solid rgba(255, 255, 255, 0.15)',
                            borderRadius: '12px',
                            color: '#ffffff',
                            fontSize: '0.925rem',
                            outline: 'none'
                          }}
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.35rem', display: 'block' }}>
                        Business Email Address
                      </label>
                      <div className="position-relative">
                        <Mail size={18} color="#64748b" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                        <input
                          type="email"
                          required
                          value={regEmail}
                          onChange={(e) => setRegEmail(e.target.value)}
                          placeholder="contact@greenharvest.com"
                          style={{
                            width: '100%',
                            padding: '0.75rem 1rem 0.75rem 2.6rem',
                            backgroundColor: 'rgba(15, 23, 42, 0.7)',
                            border: '1px solid rgba(255, 255, 255, 0.15)',
                            borderRadius: '12px',
                            color: '#ffffff',
                            fontSize: '0.925rem',
                            outline: 'none'
                          }}
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.35rem', display: 'block' }}>
                        Phone Number (For OTP / Orders)
                      </label>
                      <div className="position-relative">
                        <Phone size={18} color="#64748b" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                        <input
                          type="tel"
                          value={regPhone}
                          onChange={(e) => setRegPhone(e.target.value)}
                          placeholder="+91 98765 43210"
                          style={{
                            width: '100%',
                            padding: '0.75rem 1rem 0.75rem 2.6rem',
                            backgroundColor: 'rgba(15, 23, 42, 0.7)',
                            border: '1px solid rgba(255, 255, 255, 0.15)',
                            borderRadius: '12px',
                            color: '#ffffff',
                            fontSize: '0.925rem',
                            outline: 'none'
                          }}
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.35rem', display: 'block' }}>
                        Set Password
                      </label>
                      <div className="position-relative">
                        <Lock size={18} color="#64748b" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                        <input
                          type="password"
                          required
                          value={regPassword}
                          onChange={(e) => setRegPassword(e.target.value)}
                          placeholder="Minimum 6 characters"
                          style={{
                            width: '100%',
                            padding: '0.75rem 1rem 0.75rem 2.6rem',
                            backgroundColor: 'rgba(15, 23, 42, 0.7)',
                            border: '1px solid rgba(255, 255, 255, 0.15)',
                            borderRadius: '12px',
                            color: '#ffffff',
                            fontSize: '0.925rem',
                            outline: 'none'
                          }}
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting || loading}
                      style={{
                        width: '100%',
                        padding: '0.875rem',
                        borderRadius: '12px',
                        border: 'none',
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        color: '#ffffff',
                        fontWeight: 700,
                        fontSize: '1rem',
                        boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      {isSubmitting || loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                          <span>Creating Account...</span>
                        </>
                      ) : (
                        <>
                          <span>Submit Supplier Application</span>
                          <ArrowRight size={18} />
                        </>
                      )}
                    </button>
                  </form>
                )}

              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '1.25rem 2rem',
        textAlign: 'center',
        color: '#64748b',
        fontSize: '0.85rem'
      }}>
        <div>FreshVana Partner Hub &copy; {new Date().getFullYear()} FreshVana Inc. All rights reserved.</div>
      </footer>
    </div>
  );
}
