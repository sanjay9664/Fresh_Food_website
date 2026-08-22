'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product } from '@/types';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, weight?: string, quantity?: number) => void;
  removeFromCart: (productId: string, weight: string) => void;
  updateQuantity: (productId: string, weight: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  itemCount: number;
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  couponCode: string | null;
  appliedCoupon: string | null;
  couponDiscountPercent: number;
  couponDiscountAmount: number;
  productSavingsAmount: number;
  totalAmount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  toastMessage: string | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [couponCode, setCouponCode] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('freshvana_cart');
    const savedCoupon = localStorage.getItem('freshvana_coupon');
    if (saved) {
      try {
        setCart(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse cart from local storage', e);
      }
    }
    if (savedCoupon) setCouponCode(savedCoupon);
  }, []);

  useEffect(() => {
    localStorage.setItem('freshvana_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (couponCode) {
      localStorage.setItem('freshvana_coupon', couponCode);
    } else {
      localStorage.removeItem('freshvana_coupon');
    }
  }, [couponCode]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const getMultiplier = (w: string) => {
    if (w === '250g') return 0.25;
    if (w === '500g') return 0.5;
    if (w === '1kg') return 1;
    if (w === '2kg') return 2;
    if (w === '125g') return 0.125;
    return 1;
  };

  const addToCart = (product: Product, weight?: string, quantity: number = 1) => {
    const selectedWeight = weight || product.weights[0] || '1kg';
    const multiplier = getMultiplier(selectedWeight);
    const unitPrice = Math.round(product.price * multiplier);

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) => item.product.id === product.id && item.selectedWeight === selectedWeight
      );

      if (existingIndex > -1) {
        const newCart = [...prevCart];
        newCart[existingIndex].quantity += quantity;
        return newCart;
      } else {
        return [
          ...prevCart,
          {
            product,
            selectedWeight,
            weightMultiplier: multiplier,
            quantity,
            itemPrice: unitPrice
          }
        ];
      }
    });

    showToast(`Added ${product.name} (${selectedWeight}) to your cart!`);
  };

  const removeFromCart = (productId: string, weight: string) => {
    setCart((prevCart) => prevCart.filter((item) => !(item.product.id === productId && item.selectedWeight === weight)));
    showToast('Item removed from cart');
  };

  const updateQuantity = (productId: string, weight: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, weight);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item.product.id === productId && item.selectedWeight === weight) {
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
    setCouponCode(null);
  };

  const applyCoupon = (code: string) => {
    if (code.trim().toUpperCase() === 'FRESH20') {
      setCouponCode('FRESH20');
      showToast('Coupon FRESH20 applied! 20% discount added.');
      return { success: true, message: 'Coupon FRESH20 applied! 20% discount added.' };
    }
    showToast('Invalid Coupon Code');
    return { success: false, message: 'Invalid Coupon Code. Try FRESH20' };
  };

  const removeCoupon = () => {
    setCouponCode(null);
    showToast('Coupon removed');
  };

  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.itemPrice * item.quantity, 0);

  const productSavingsAmount = cart.reduce((sum, item) => {
    const origUnitPrice = Math.round(item.product.originalPrice * item.weightMultiplier);
    return sum + (origUnitPrice - item.itemPrice) * item.quantity;
  }, 0);

  const couponDiscountAmount = couponCode === 'FRESH20' ? Math.round(subtotal * 0.2) : 0;
  const couponDiscountPercent = couponCode === 'FRESH20' ? 20 : 0;

  const discount = couponDiscountAmount;
  const deliveryFee = subtotal > 499 || subtotal === 0 ? 0 : 49;
  const total = Math.max(0, subtotal - discount + deliveryFee);
  const totalAmount = total;

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        applyCoupon,
        removeCoupon,
        itemCount,
        subtotal,
        discount,
        deliveryFee,
        total,
        couponCode,
        appliedCoupon: couponCode,
        couponDiscountPercent,
        couponDiscountAmount,
        productSavingsAmount,
        totalAmount,
        isCartOpen,
        setIsCartOpen,
        toastMessage
      }}
    >
      {children}
      {toastMessage && (
        <div className="toast-freshvana animate-fade-in">
          <span>{toastMessage}</span>
        </div>
      )}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
