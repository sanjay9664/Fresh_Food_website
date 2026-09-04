import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { CartItem, Product } from '@/types';

export type SlotType = 'Morning' | 'Afternoon' | 'Evening' | 'Express';
type CartState = { items: CartItem[]; couponCode: string | null; isOpen: boolean; deliverySlot: SlotType; deliveryDate: string; toastMessage: string | null };
const initialState: CartState = { items: [], couponCode: null, isOpen: false, deliverySlot: 'Morning', deliveryDate: 'Tomorrow', toastMessage: null };
const multiplier = (weight: string) => ({ '125g': .125, '250g': .25, '500g': .5, '1kg': 1, '2kg': 2 }[weight] || 1);
const reservedKg = (items: CartItem[], productId: string) => items.filter((item) => item.product.id === productId).reduce((total, item) => total + item.weightMultiplier * item.quantity, 0);
const stockKg = (product: Product) => product.stockQuantityKg === undefined ? Number.POSITIVE_INFINITY : Math.max(0, product.stockQuantityKg);
const maxUnits = (items: CartItem[], product: Product, weight: string, currentUnits = 0) => {
  const available = stockKg(product) - (reservedKg(items, product.id) - currentUnits * multiplier(weight));
  return Math.max(0, Math.floor((available + 0.000001) / multiplier(weight)));
};

const cartSlice = createSlice({ name: 'cart', initialState, reducers: {
  hydrateCart: (_state, action: PayloadAction<Partial<CartState>>) => ({ ...initialState, ...action.payload }),
  addItem: (state, action: PayloadAction<{ product: Product; weight?: string; quantity?: number }>) => {
    const { product, quantity = 1 } = action.payload; const selectedWeight = action.payload.weight || product.weights[0] || '1kg';
    const existing = state.items.find((item) => item.product.id === product.id && item.selectedWeight === selectedWeight);
    const permitted = maxUnits(state.items, product, selectedWeight, existing?.quantity || 0);
    const requested = (existing?.quantity || 0) + quantity;
    if (permitted === 0) { state.toastMessage = `${product.name} is sold out`; return; }
    if (existing) existing.quantity = Math.min(requested, permitted);
    else { const weightMultiplier = multiplier(selectedWeight); state.items.push({ product, selectedWeight, weightMultiplier, quantity: Math.min(quantity, permitted), itemPrice: Math.round(product.price * weightMultiplier) }); }
    state.toastMessage = requested > permitted ? `Only ${product.stockQuantityKg} kg of ${product.name} is available` : `${product.name} added to your cart`;
  },
  removeItem: (state, action: PayloadAction<{ productId: string; weight: string }>) => { state.items = state.items.filter((item) => !(item.product.id === action.payload.productId && item.selectedWeight === action.payload.weight)); state.toastMessage = 'Item removed from cart'; },
  updateItemQuantity: (state, action: PayloadAction<{ productId: string; weight: string; quantity: number }>) => { const item = state.items.find((row) => row.product.id === action.payload.productId && row.selectedWeight === action.payload.weight); if (item) { item.quantity = Math.min(action.payload.quantity, maxUnits(state.items, item.product, item.selectedWeight, item.quantity)); if (action.payload.quantity > item.quantity) state.toastMessage = `Maximum available quantity reached for ${item.product.name}`; } state.items = state.items.filter((item) => item.quantity > 0); },
  clearCart: (state) => { state.items = []; state.couponCode = null; }, setCoupon: (state, action: PayloadAction<string | null>) => { state.couponCode = action.payload; }, setCartOpen: (state, action: PayloadAction<boolean>) => { state.isOpen = action.payload; }, setDeliveryPreference: (state, action: PayloadAction<{ slot: SlotType; date?: string }>) => { state.deliverySlot = action.payload.slot; if (action.payload.date) state.deliveryDate = action.payload.date; }, clearToast: (state) => { state.toastMessage = null; },
} });
export const { hydrateCart, addItem, removeItem, updateItemQuantity, clearCart, setCoupon, setCartOpen, setDeliveryPreference, clearToast } = cartSlice.actions;
export default cartSlice.reducer;
