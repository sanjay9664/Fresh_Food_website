import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Category, Product } from '@/types';
import { categories as initialCategories } from '@/data/categories';
import { products as initialProducts } from '@/data/products';
import { catalogApi } from '@/services/api';

const normaliseProduct = (item: any): Product => {
  const listings = (item.variants || []).flatMap((variant: any) => variant.vendorProducts || []);
  const cheapestListing = listings.reduce((lowest: any, listing: any) =>
    !lowest || Number(listing.price) < Number(lowest.price) ? listing : lowest, null);
  // Backend monetary values are stored in paise; the storefront displays INR.
  const price = cheapestListing ? Number(cheapestListing.price) / 100 : Number(item.price || 0);
  const originalPrice = cheapestListing?.compareAtPrice
    ? Number(cheapestListing.compareAtPrice) / 100
    : Number(item.originalPrice || price);
  const weights = (item.variants || []).map((variant: any) => variant.name).filter(Boolean);
  const availableQuantity = cheapestListing?.inventory?.quantity;

  return {
    ...item,
    id: item.id,
    name: item.name || item.title,
    category: item.category?.name || item.category || 'Fresh Produce',
    categoryId: item.categoryId || item.category?.id || '',
    price,
    originalPrice,
    discountPercentage: originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0,
    rating: item.rating || 0,
    reviewsCount: item.reviewsCount || 0,
    badge: item.badge || 'Farm Fresh',
    inStock: item.inStock ?? (item.status === 'ACTIVE' && (!cheapestListing || Number(availableQuantity) > 0)),
    image: item.image || item.images?.[0]?.url || '/images/tomatoes.png',
    thumbnails: item.thumbnails || item.images?.map((image: any) => image.url) || [],
    description: item.description || '',
    weights: weights.length ? weights : ['1kg'],
    healthBenefits: item.healthBenefits || [],
    nutrition: item.nutrition || {},
    reviews: item.reviews || [],
    isAdded: item.isAdded ?? true,
    isVendorUploaded: item.isVendorUploaded ?? Boolean(item.vendorId || item.vendorName || listings.length > 0),
  };
};

const normaliseCategory = (item: any): Category => ({
  id: item.id,
  name: item.name,
  slug: item.slug,
  description: item.description || '',
  image: item.image || '/images/carrots.png',
  icon: item.icon || 'Leaf',
  productCount: item._count?.products || item.productCount || 0,
});

export const fetchCatalog = createAsyncThunk('catalog/fetch', async (_, { rejectWithValue }) => {
  const [products, categories] = await Promise.all([catalogApi.getProducts(), catalogApi.getCategories()]);
  if (!products.success) return rejectWithValue(products.message || 'Catalog could not be loaded');
  return { products: (products.data || []).map(normaliseProduct), categories: (categories.data || []).map(normaliseCategory) };
});

const catalogSlice = createSlice({ name: 'catalog', initialState: { products: initialProducts as Product[], categories: initialCategories as Category[], loading: false, error: null as string | null, isRemote: false }, reducers: {
  addLocalProduct: (state, action: PayloadAction<Product>) => { state.products.unshift(action.payload); }, removeLocalProduct: (state, action: PayloadAction<string>) => { state.products = state.products.filter((item) => item.id !== action.payload); }, toggleLocalStock: (state, action: PayloadAction<string>) => { const item = state.products.find((row) => row.id === action.payload); if (item) item.inStock = !item.inStock; }, toggleLocalVisibility: (state, action: PayloadAction<string>) => { const item = state.products.find((row) => row.id === action.payload); if (item) item.isAdded = item.isAdded === false; }, addLocalCategory: (state, action: PayloadAction<Category>) => { state.categories.push(action.payload); }, removeLocalCategory: (state, action: PayloadAction<string>) => { state.categories = state.categories.filter((item) => item.id !== action.payload); }, resetCatalog: (state) => { state.products = initialProducts as Product[]; state.categories = initialCategories as Category[]; state.isRemote = false; },
}, extraReducers: (builder) => builder.addCase(fetchCatalog.pending, (state) => { state.loading = true; state.error = null; }).addCase(fetchCatalog.fulfilled, (state, action) => {
  if (action.payload.products.length) {
    // Keep local-only unavailable / non-vendor-uploaded products so they stay
    // visible (grayed out) on the customer storefront even after the API loads.
    const remoteIds = new Set(action.payload.products.map((p: Product) => p.id));
    const localUnavailable = (initialProducts as Product[]).filter(
      (p) => p.isVendorUploaded === false && !remoteIds.has(p.id)
    );
    state.products = [...action.payload.products, ...localUnavailable];
  }
  if (action.payload.categories.length) state.categories = action.payload.categories;
  state.loading = false; state.isRemote = true;
}).addCase(fetchCatalog.rejected, (state, action) => { state.loading = false; state.error = String(action.payload || 'Catalog could not be loaded'); }) });
export const { addLocalProduct, removeLocalProduct, toggleLocalStock, toggleLocalVisibility, addLocalCategory, removeLocalCategory, resetCatalog } = catalogSlice.actions;
export default catalogSlice.reducer;
