'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { Home, Layers, ShoppingBag, Heart, Flame, Search } from 'lucide-react';
import { motion } from 'framer-motion';

interface MobileBottomNavProps {
  onOpenSearch: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ onOpenSearch }) => {
  const pathname = usePathname();
  const { itemCount, setIsCartOpen } = useCart();
  const { wishlistCount } = useWishlist();

  const navItems = [
    {
      name: 'Home',
      href: '/',
      icon: Home,
      isAction: false
    },
    {
      name: 'Categories',
      href: '/categories',
      icon: Layers,
      isAction: false
    },
    {
      name: 'Deals',
      href: '/deals',
      icon: Flame,
      badge: 'HOT',
      isAction: false
    },
    {
      name: 'Saved',
      href: '/wishlist',
      icon: Heart,
      badgeCount: wishlistCount,
      isAction: false
    },
    {
      name: 'Cart',
      href: '#',
      icon: ShoppingBag,
      badgeCount: itemCount,
      isAction: true,
      onClick: () => setIsCartOpen(true)
    }
  ];

  return (
    <nav
      className="mobile-bottom-nav fixed-bottom bg-white border-top shadow-lg d-flex align-items-center justify-content-around py-1 d-md-none"
      style={{
        zIndex: 1040,
        height: '62px',
        borderTopLeftRadius: '20px',
        borderTopRightRadius: '20px',
        boxShadow: '0 -4px 25px rgba(0, 0, 0, 0.08)',
        backdropFilter: 'blur(10px)',
        background: 'rgba(255, 255, 255, 0.95)'
      }}
    >
      {navItems.map((item) => {
        const IconComponent = item.icon;
        const isActive = !item.isAction && pathname === item.href;

        const content = (
          <motion.div
            whileTap={{ scale: 0.9 }}
            className="d-flex flex-column align-items-center justify-content-center position-relative py-1 px-2"
            style={{ minWidth: '54px' }}
          >
            {/* Active Highlight Indicator Pill */}
            {isActive && (
              <motion.span
                layoutId="activeTabPill"
                className="position-absolute rounded-pill bg-success opacity-15"
                style={{
                  top: '2px',
                  width: '40px',
                  height: '28px',
                  zIndex: 0
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}

            {/* Icon + Badge */}
            <div className="position-relative d-flex align-items-center justify-content-center mb-1" style={{ zIndex: 1 }}>
              <IconComponent
                size={21}
                className={isActive ? 'text-success fw-bold' : 'text-secondary'}
                style={{ color: isActive ? '#0A6836' : '#64748B' }}
              />

              {/* Number Badge (Cart / Wishlist) */}
              {item.badgeCount !== undefined && item.badgeCount > 0 && (
                <span
                  className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger shadow-xs"
                  style={{ fontSize: '0.6rem', padding: '2px 5px' }}
                >
                  {item.badgeCount}
                </span>
              )}

              {/* Text Badge (e.g. HOT) */}
              {item.badge && (
                <span
                  className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-warning text-dark fw-extrabold shadow-xs"
                  style={{ fontSize: '0.55rem', padding: '1px 4px' }}
                >
                  {item.badge}
                </span>
              )}
            </div>

            {/* Tab Name Label */}
            <span
              className={`font-heading ${isActive ? 'fw-bold text-success' : 'text-muted'}`}
              style={{
                fontSize: '0.68rem',
                zIndex: 1,
                color: isActive ? '#0A6836' : '#64748B',
                lineHeight: 1
              }}
            >
              {item.name}
            </span>
          </motion.div>
        );

        if (item.isAction) {
          return (
            <button
              key={item.name}
              type="button"
              onClick={item.onClick}
              className="btn btn-link text-decoration-none p-0 border-0 bg-transparent"
              aria-label={item.name}
            >
              {content}
            </button>
          );
        }

        return (
          <Link key={item.name} href={item.href} className="text-decoration-none">
            {content}
          </Link>
        );
      })}
    </nav>
  );
};
