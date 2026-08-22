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
  ShieldAlert
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

  // Requested Navigation Order: Home -> Categories -> Shop -> Fresh Deals -> About Us -> Contact Us
  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Categories', href: '/categories' },
    { name: 'Shop', href: '/shop' },
    { name: 'Fresh Deals', href: '/deals', badge: 'HOT' },
    { name: 'About Us', href: '/about' },
    { name: 'Contact Us', href: '/contact' }
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
        style={{ top: '30px', zIndex: 1040 }}
      >
        <div className="container py-2">
          {/* Row 1: Logo, Search, User & Cart */}
          <div className="d-flex align-items-center justify-content-between gap-3 py-1">
            {/* Logo */}
            <Link href="/" className="text-decoration-none d-flex align-items-center gap-2 flex-shrink-0">
              <div
                className="rounded-circle d-flex align-items-center justify-content-center text-white"
                style={{ width: '42px', height: '42px', background: 'linear-gradient(135deg, #0A6836, #064E28)' }}
              >
                <Leaf size={24} className="animate-float-fast" />
              </div>
              <div className="d-flex flex-column">
                <span
                  className="brand-text font-heading fw-extrabold fs-3 text-dark lh-1"
                  style={{ letterSpacing: '-0.5px' }}
                >
                  Fresh<span style={{ color: '#0A6836' }}>Vana</span>
                </span>
                <span
                  className="text-muted"
                  style={{ fontSize: '0.62rem', letterSpacing: '0.8px', fontWeight: 600 }}
                >
                  Freshness, Naturally Delivered.
                </span>
              </div>
            </Link>

            {/* Large Center Search Bar */}
            <div className="d-none d-md-flex align-items-center flex-grow-1 mx-3" style={{ maxWidth: '540px' }}>
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

            {/* Right Icons: Wishlist, Cart & Profile Dropdown */}
            <div className="d-flex align-items-center gap-3 flex-shrink-0">
              {/* Search Icon Mobile */}
              <button
                onClick={onOpenSearch}
                className="btn btn-light rounded-circle p-2 d-md-none text-dark"
              >
                <Search size={20} />
              </button>

              {/* Wishlist */}
              <Link
                href="/wishlist"
                className="d-flex align-items-center gap-2 text-decoration-none text-dark position-relative"
                title="Wishlist"
              >
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center bg-light text-dark position-relative"
                  style={{ width: '40px', height: '40px' }}
                >
                  <Heart size={20} />
                  {wishlistCount > 0 && (
                    <span
                      className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                      style={{ fontSize: '0.65rem' }}
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
                  style={{ width: '40px', height: '40px' }}
                >
                  <ShoppingBag size={20} />
                  {itemCount > 0 && (
                    <span
                      className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                      style={{ fontSize: '0.65rem' }}
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

              {/* Profile Dropdown */}
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

              {/* Mobile Hamburger Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="btn btn-light p-2 border-0 d-xl-none text-dark"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Row 2: Category Selector Button + Nav Links */}
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
              <Sparkles size={14} className="text-warning" />
              <span>Use Code: <strong className="text-success">FRESH20</strong> for 20% OFF</span>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="position-fixed top-0 end-0 h-100 w-100 bg-white d-xl-none"
            style={{ zIndex: 1050, paddingTop: '100px' }}
          >
            <div className="p-4 d-flex flex-column h-100 justify-content-between">
              <div>
                <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
                  <div className="d-flex align-items-center gap-2">
                    <Leaf className="text-success" size={24} />
                    <span className="font-heading fw-bold fs-4 text-dark">
                      Fresh<span style={{ color: '#0A6836' }}>Vana</span>
                    </span>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="btn btn-light rounded-circle p-2"
                  >
                    <X size={22} />
                  </button>
                </div>

                <div className="d-flex flex-column gap-3 fs-5">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`text-decoration-none fw-semibold py-2 px-3 rounded-3 ${
                        pathname === link.href ? 'bg-success text-white' : 'text-dark hover-bg-light'
                      }`}
                    >
                      {link.name}
                    </Link>
                  ))}

                  {isLoggedIn ? (
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        logout();
                      }}
                      className="btn btn-danger rounded-3 py-2 px-3 fw-bold text-center border-0 text-white d-flex align-items-center justify-content-center gap-2"
                    >
                      <LogOut size={18} />
                      <span>Logout / Sign Out</span>
                    </button>
                  ) : (
                    <Link
                      href="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-decoration-none fw-semibold py-2 px-3 rounded-3 text-success hover-bg-light border text-center"
                    >
                      Sign In Now
                    </Link>
                  )}
                </div>
              </div>

              <div className="pt-4 border-top text-center text-muted small">
                Freshness, Naturally Delivered to your doorstep.
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
