'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useAuth } from '@/context/AuthContext';
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  Menu,
  X,
  Leaf,
  Truck,
  ChevronDown,
  Sparkles,
  Layers,
  Clock,
  ShieldCheck,
  LogOut,
  ShieldAlert,
  Home,
  Tag,
  Info,
  PhoneCall
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarProps {
  onOpenSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSearch }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const pathname = usePathname();
  const { itemCount, subtotal, setIsCartOpen } = useCart();
  const { wishlistCount } = useWishlist();
  const { isLoggedIn, user, logout } = useAuth();

  // Top offer countdown timer
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 45, seconds: 33 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 2, minutes: 45, seconds: 33 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Categories', href: '/categories', icon: Layers },
    { name: 'Shop', href: '/shop', icon: ShoppingBag },
    { name: 'Fresh Deals', href: '/deals', badge: 'HOT', icon: Tag },
    { name: 'About Us', href: '/about', icon: Info },
    { name: 'Contact Us', href: '/contact', icon: PhoneCall }
  ];

  return (
    <>
      {/* Top Utility Bar */}
      <div className="top-bar-v2 fixed-top w-100" style={{ zIndex: 1045 }}>
        <div className="container">
          <div className="d-flex align-items-center justify-content-between small">
            <div className="d-flex align-items-center gap-2">
              <Truck size={14} className="text-warning" />
              <span>Free Delivery on orders above <strong>₹499</strong></span>
              <span className="opacity-50">|</span>
              <div className="d-flex align-items-center gap-1">
                <ShieldCheck size={13} className="text-warning" />
                <span>100% Fresh • Organic • Chemical Free</span>
              </div>
            </div>

            <div className="d-none d-md-flex align-items-center gap-2">
              <Clock size={13} className="text-warning" />
              <span>Offer Ends In:</span>
              <div className="d-flex align-items-center gap-1 font-heading fw-bold">
                <span className="bg-black bg-opacity-30 rounded px-1">{String(timeLeft.hours).padStart(2, '0')}</span> Hrs
                <span className="bg-black bg-opacity-30 rounded px-1">{String(timeLeft.minutes).padStart(2, '0')}</span> Mins
                <span className="bg-black bg-opacity-30 rounded px-1 text-warning">{String(timeLeft.seconds).padStart(2, '0')}</span> Secs
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Sticky Header */}
      <header
        className="fixed-top w-100 glass-header-v2"
        style={{ zIndex: 1040 }}
      >
        <div className="container py-2">
          {/* Row 1: Logo, Search, User & Cart */}
          <div className="d-flex align-items-center justify-content-between gap-1 gap-sm-3 py-1">
            {/* Logo */}
            <Link href="/" className="text-decoration-none d-flex align-items-center gap-2 flex-shrink-0">
              <div
                className="rounded-circle d-flex align-items-center justify-content-center text-white"
                style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, #0A6836, #064E28)' }}
              >
                <Leaf size={19} className="animate-float-fast" />
              </div>
              <div className="d-flex flex-column">
                <span
                  className="brand-text font-heading fw-extrabold fs-4 fs-sm-3 text-dark lh-1"
                  style={{ letterSpacing: '-0.5px' }}
                >
                  Fresh<span style={{ color: '#0A6836' }}>Vana</span>
                </span>
                <span
                  className="text-muted d-none d-sm-inline"
                  style={{ fontSize: '0.62rem', letterSpacing: '0.8px', fontWeight: 600 }}
                >
                  Freshness, Naturally Delivered.
                </span>
              </div>
            </Link>

            {/* Large Center Search Bar (Desktop / Laptop) */}
            <div className="d-none d-md-flex align-items-center flex-grow-1 mx-3" style={{ maxWidth: '520px' }}>
              <div
                onClick={onOpenSearch}
                className="input-group rounded-pill overflow-hidden border bg-light shadow-sm cursor-pointer w-100"
                style={{ cursor: 'pointer' }}
              >
                <input
                  type="text"
                  placeholder="Search for fruits, vegetables and more..."
                  className="form-control border-0 bg-transparent px-4 py-2 text-dark small"
                  readOnly
                />
                <button
                  className="btn btn-success px-4 border-0 d-flex align-items-center justify-content-center"
                  style={{ background: '#0A6836' }}
                  type="button"
                >
                  <Search size={18} />
                </button>
              </div>
            </div>

            {/* Right Icons: Search Mobile, Wishlist, Cart & Profile Dropdown */}
            <div className="d-flex align-items-center gap-1 gap-sm-2 gap-md-3 flex-shrink-0">
              {/* Search Icon Mobile */}
              <button
                onClick={onOpenSearch}
                className="btn btn-light rounded-circle p-2 d-md-none text-dark"
                style={{ width: '36px', height: '36px' }}
                title="Search Produce"
              >
                <Search size={17} />
              </button>

              {/* Wishlist (Shown on Tablet & Desktop >=576px) */}
              <Link
                href="/wishlist"
                className="d-none d-sm-flex align-items-center gap-2 text-decoration-none text-dark position-relative"
                title="Wishlist"
              >
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center bg-light text-dark position-relative"
                  style={{ width: '38px', height: '38px' }}
                >
                  <Heart size={18} />
                  {wishlistCount > 0 && (
                    <span
                      className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                      style={{ fontSize: '0.62rem' }}
                    >
                      {wishlistCount}
                    </span>
                  )}
                </div>
                <div className="d-none d-lg-flex flex-column lh-1">
                  <span className="text-muted" style={{ fontSize: '0.68rem' }}>Saved</span>
                  <strong className="small font-heading">Wishlist</strong>
                </div>
              </Link>

              {/* Cart Drawer Trigger */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="btn text-decoration-none text-dark d-flex align-items-center gap-2 border-0 p-0"
              >
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center bg-light text-dark position-relative"
                  style={{ width: '36px', height: '36px' }}
                >
                  <ShoppingBag size={17} />
                  {itemCount > 0 && (
                    <span
                      className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                      style={{ fontSize: '0.62rem' }}
                    >
                      {itemCount}
                    </span>
                  )}
                </div>
                <div className="d-none d-lg-flex flex-column lh-1 text-start">
                  <span className="text-muted" style={{ fontSize: '0.68rem' }}>Basket</span>
                  <strong className="small font-heading text-success">
                    {subtotal > 0 ? `₹${subtotal}` : 'Cart'}
                  </strong>
                </div>
              </button>

              {/* Desktop Profile Dropdown Pill (>=576px) */}
              <div className="position-relative d-none d-sm-block">
                <button
                  type="button"
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="btn btn-light rounded-pill px-3 py-1 border d-flex align-items-center gap-2 shadow-sm"
                >
                  <User size={18} className="text-success" />
                  <div className="d-flex flex-column lh-1 text-start" style={{ fontSize: '0.75rem' }}>
                    <span className="text-muted" style={{ fontSize: '0.65rem' }}>
                      {isLoggedIn ? `Hello, ${user?.name}` : 'Hello, Guest'}
                    </span>
                    <strong className="font-heading d-flex align-items-center gap-1">
                      {isLoggedIn ? 'My Account' : 'Sign In'} <ChevronDown size={12} />
                    </strong>
                  </div>
                </button>

                {/* Dropdown Menu */}
                {profileDropdownOpen && (
                  <div
                    className="position-absolute end-0 mt-2 bg-white rounded-4 shadow-lg border p-2 animate-fade-in"
                    style={{ width: '220px', zIndex: 1060 }}
                  >
                    {isLoggedIn ? (
                      <div>
                        <div className="p-2 border-bottom mb-1">
                          <span className="d-block text-dark fw-bold small">{user?.name}</span>
                          <span className="text-muted small" style={{ fontSize: '0.72rem' }}>{user?.email}</span>
                        </div>

                        {user?.role === 'admin' && (
                          <Link
                            href="/admin"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="dropdown-item rounded-3 py-2 px-3 small fw-semibold text-dark d-flex align-items-center gap-2 mb-1"
                          >
                            <ShieldAlert size={16} className="text-warning" />
                            <span>Super Admin Panel</span>
                          </Link>
                        )}

                        <button
                          onClick={() => {
                            setProfileDropdownOpen(false);
                            logout();
                          }}
                          className="btn btn-danger btn-sm rounded-3 w-100 py-2 px-3 fw-bold d-flex align-items-center justify-content-center gap-2 border-0 mt-1"
                        >
                          <LogOut size={16} />
                          <span>Logout / Sign Out</span>
                        </button>
                      </div>
                    ) : (
                      <Link
                        href="/login"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="btn btn-success btn-sm rounded-3 w-100 py-2 fw-bold text-center border-0 text-white d-block"
                        style={{ background: '#0A6836' }}
                      >
                        Sign In Now
                      </Link>
                    )}
                  </div>
                )}
              </div>

              {/* Hamburger Menu Toggle Button (<1200px / mobile & tablet) */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="btn btn-success rounded-3 p-2 border-0 d-xl-none text-white shadow-sm"
                style={{ background: '#0A6836', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* Row 2: Category Selector Button + Nav Links (Desktop XL) */}
          <div className="d-none d-xl-flex align-items-center justify-content-between pt-2 border-top">
            <div className="d-flex align-items-center gap-3">
              {/* All Categories Dropdown Button */}
              <Link href="/categories" className="all-categories-btn text-decoration-none">
                <Layers size={18} />
                <span>All Categories</span>
                <ChevronDown size={14} />
              </Link>

              {/* Nav Links */}
              <nav className="d-flex align-items-center gap-1">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      className={`nav-link-v2 ${isActive ? 'active' : ''}`}
                    >
                      {link.name}
                      {link.badge && (
                        <span className="badge bg-danger ms-1" style={{ fontSize: '0.62rem' }}>
                          {link.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="small text-muted d-flex align-items-center gap-2">
              
              
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu (<1200px Mobile & Tablet) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="position-fixed top-0 start-0 h-100 w-100 bg-white d-xl-none overflow-auto"
            style={{ zIndex: 1050, paddingTop: '95px' }}
          >
            <div className="p-4 d-flex flex-column h-100 justify-content-between">
              <div>
                {/* Mobile Drawer Header */}
                <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
                  <div className="d-flex align-items-center gap-2">
                    <div className="p-2 rounded-circle bg-success text-white">
                      <User size={18} />
                    </div>
                    <div className="d-flex flex-column">
                      <strong className="font-heading text-dark">
                        {isLoggedIn ? `Hello, ${user?.name}` : 'Welcome Guest'}
                      </strong>
                      <span className="text-muted small" style={{ fontSize: '0.72rem' }}>
                        {isLoggedIn ? user?.email : 'Sign in to access your orders'}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="btn btn-light rounded-circle p-2 border"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Mobile Navigation Links */}
                <div className="d-flex flex-column gap-2 mb-4">
                  <span className="text-muted fw-bold small mb-1" style={{ letterSpacing: '0.5px' }}>
                    NAVIGATION MENU
                  </span>
                  {navLinks.map((link) => {
                    const IconComp = link.icon;
                    const isActive = pathname === link.href;

                    return (
                      <Link
                        key={link.name}
                        href={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`text-decoration-none fw-bold py-3 px-3 rounded-4 d-flex align-items-center justify-content-between ${
                          isActive ? 'bg-success text-white shadow-sm' : 'text-dark hover-bg-light border'
                        }`}
                        style={isActive ? { background: '#0A6836' } : {}}
                      >
                        <div className="d-flex align-items-center gap-3">
                          <IconComp size={20} className={isActive ? 'text-white' : 'text-success'} />
                          <span>{link.name}</span>
                        </div>
                        {link.badge && (
                          <span className="badge bg-danger rounded-pill px-2 py-1" style={{ fontSize: '0.65rem' }}>
                            {link.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>

                {/* Super Admin & Profile Actions */}
                <div className="pt-3 border-top d-flex flex-column gap-2">
                  {isLoggedIn && user?.role === 'admin' && (
                    <Link
                      href="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="btn btn-warning rounded-4 py-3 px-3 fw-bold text-dark d-flex align-items-center justify-content-center gap-2 shadow-sm border-0"
                    >
                      <ShieldAlert size={18} />
                      <span>Enter Super Admin Panel</span>
                    </Link>
                  )}

                  {isLoggedIn ? (
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        logout();
                      }}
                      className="btn btn-danger rounded-4 py-3 px-3 fw-bold text-center border-0 text-white d-flex align-items-center justify-content-center gap-2 mt-1"
                    >
                      <LogOut size={18} />
                      <span>Logout / Sign Out</span>
                    </button>
                  ) : (
                    <Link
                      href="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="btn btn-success rounded-4 py-3 px-3 fw-bold text-center border-0 text-white d-block"
                      style={{ background: '#0A6836' }}
                    >
                      Sign In Now →
                    </Link>
                  )}
                </div>
              </div>

              <div className="pt-4 text-center text-muted small">
                Freshness, Naturally Delivered to your doorstep.
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
