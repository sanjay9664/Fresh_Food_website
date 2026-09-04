'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import '@/styles/globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { ProductProvider } from '@/context/ProductContext';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { QuickViewProvider, useQuickView } from '@/context/QuickViewContext';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { SearchModal } from '@/components/search/SearchModal';
import { Toast } from '@/components/ui/Toast';
import { StoreProvider } from '@/store/StoreProvider';

function MainApp({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { openQuickView } = useQuickView();

  const isLoginPage = pathname === '/login';
  const isAdminPage = pathname?.startsWith('/admin');
  const isMinimalPage = isLoginPage || isAdminPage;

  return (
    <>
      {/* Hide Navbar on Login and Admin Pages */}
      {!isMinimalPage && <Navbar onOpenSearch={() => setIsSearchOpen(true)} />}

      <main className={!isMinimalPage ? "pb-5 pb-md-0 mb-4 mb-md-0" : ""} style={{ minHeight: isMinimalPage ? '100vh' : '80vh' }}>
        {children}
      </main>

      {/* Hide Footer on Login and Admin Pages */}
      {!isMinimalPage && <Footer />}

      {/* Mobile App Style Bottom Navigation Bar */}
      {!isMinimalPage && <MobileBottomNav onOpenSearch={() => setIsSearchOpen(true)} />}

      {!isMinimalPage && <CartDrawer />}

      {!isMinimalPage && (
        <SearchModal
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          onSelectProduct={(p) => openQuickView(p)}
        />
      )}

      <Toast />
    </>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>FreshVana — Freshness, Naturally Delivered</title>
        <meta
          name="description"
          content="Premium organic fruits and fresh vegetables delivered directly from clean local farms to your home."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>
        <StoreProvider>
          <AuthProvider>
            <ProductProvider>
              <CartProvider>
                <WishlistProvider>
                  <QuickViewProvider>
                    <MainApp>{children}</MainApp>
                  </QuickViewProvider>
                </WishlistProvider>
              </CartProvider>
            </ProductProvider>
          </AuthProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
