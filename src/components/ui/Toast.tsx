'use client';

import React from 'react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toastMessage: cartToast } = useCart();
  const { toastMessage: wishlistToast } = useWishlist();

  const activeToast = cartToast || wishlistToast;

  return (
    <AnimatePresence>
      {activeToast && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.9 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="toast-freshvana"
          style={{ zIndex: 9999 }}
        >
          <CheckCircle className="text-warning flex-shrink-0" size={20} />
          <span>{activeToast}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
