'use client';

import { useEffect } from 'react';
import type { Product } from '@/types';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addItem, clearCart as clearCartAction, clearToast, hydrateCart, removeItem, setCartOpen, setCoupon, setDeliveryPreference, SlotType, updateItemQuantity } from '@/store/slices/cartSlice';
export type { SlotType } from '@/store/slices/cartSlice';

const slotText = (slot: SlotType) => ({ Morning: '7 AM – 10 AM', Afternoon: '12 PM – 3 PM', Evening: '5 PM – 8 PM', Express: '⚡ 2-Hour Express' }[slot]);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const cart = useAppSelector((state) => state.cart);
  useEffect(() => {
    const saved = localStorage.getItem('freshvana_cart_state');
    if (saved) try { dispatch(hydrateCart(JSON.parse(saved))); } catch { /* ignore malformed local storage */ }
  }, [dispatch]);
  useEffect(() => { localStorage.setItem('freshvana_cart_state', JSON.stringify(cart)); }, [cart]);
  useEffect(() => { if (!cart.toastMessage) return; const timer = window.setTimeout(() => dispatch(clearToast()), 3500); return () => window.clearTimeout(timer); }, [cart.toastMessage, dispatch]);
  return <>{children}</>;
}

export const useCart = () => {
  const dispatch = useAppDispatch();
  const state = useAppSelector((root) => root.cart); const cart = state.items;
  const subtotal = cart.reduce((sum, item) => sum + item.itemPrice * item.quantity, 0);
  const couponDiscountAmount = state.couponCode === 'FRESH20' ? Math.round(subtotal * .2) : 0;
  const deliveryFee = subtotal > 499 || subtotal === 0 ? 0 : 49;
  return {
    cart, itemCount: cart.reduce((sum, item) => sum + item.quantity, 0), subtotal, discount: couponDiscountAmount, deliveryFee, total: Math.max(0, subtotal - couponDiscountAmount + deliveryFee), totalAmount: Math.max(0, subtotal - couponDiscountAmount + deliveryFee), couponCode: state.couponCode, appliedCoupon: state.couponCode, couponDiscountPercent: state.couponCode === 'FRESH20' ? 20 : 0, couponDiscountAmount,
    productSavingsAmount: cart.reduce((sum, item) => sum + (Math.round(item.product.originalPrice * item.weightMultiplier) - item.itemPrice) * item.quantity, 0), isCartOpen: state.isOpen, setIsCartOpen: (open: boolean) => dispatch(setCartOpen(open)), toastMessage: state.toastMessage,
    deliverySlot: state.deliverySlot, deliveryDate: state.deliveryDate, slotTimeText: slotText(state.deliverySlot), setDeliverySlotPreference: (slot: SlotType, date?: string) => dispatch(setDeliveryPreference({ slot, date })),
    reservedQuantityKg: (productId: string) => cart.filter((item) => item.product.id === productId).reduce((total, item) => total + item.weightMultiplier * item.quantity, 0),
    remainingQuantityKg: (product: Product) => product.stockQuantityKg === undefined ? Number.POSITIVE_INFINITY : Math.max(0, product.stockQuantityKg - cart.filter((item) => item.product.id === product.id).reduce((total, item) => total + item.weightMultiplier * item.quantity, 0)),
    addToCart: (product: Product, weight?: string, quantity?: number) => dispatch(addItem({ product, weight, quantity })), removeFromCart: (productId: string, weight: string) => dispatch(removeItem({ productId, weight })), updateQuantity: (productId: string, weight: string, quantity: number) => dispatch(updateItemQuantity({ productId, weight, quantity })), clearCart: () => dispatch(clearCartAction()),
    applyCoupon: (code: string) => { if (code.trim().toUpperCase() === 'FRESH20') { dispatch(setCoupon('FRESH20')); return { success: true, message: 'Coupon FRESH20 applied! 20% discount added.' }; } return { success: false, message: 'Invalid Coupon Code. Try FRESH20' }; }, removeCoupon: () => dispatch(setCoupon(null)),
  };
};
