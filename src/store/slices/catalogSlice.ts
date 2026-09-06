import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Category, Product } from '@/types';
import { categories as initialCategories } from '@/data/categories';
import { products as initialProducts } from '@/data/products';
import { catalogApi } from '@/services/api';

const normaliseProduct = (item: any): Product => ({ ...item, id: item.id, name: item.name || item.title, category: item.category?.name || item.category || 'Fresh Produce', categoryId: item.categoryId || item.category?.id || '', price: Number(item.price || 0), originalPrice: Number(item.originalPrice || item.price || 0), discountPercentage: item.discountPercentage || 0, rating: item.rating || 0, reviewsCount: item.reviewsCount || 0, badge: item.badge || 'Farm Fresh', inStock: item.inStock ?? item.status === 'ACTIVE', image: item.image || item.images?.[0]?.url || '/images/tomatoes.png', thumbnails: item.thumbnails || [], description: item.description || '', weights: item.weights || ['1kg'], healthBenefits: item.healthBenefits || [], nutrition: item.nutrition || {}, reviews: item.reviews || [], isAdded: item.isAdded ?? true });

export const fetchCatalog = createAsyncThunk('catalog/fetch', async (_, { rejectWithValue }) => {
  const [pubProducts, pubCategories] = await Promise.all([catalogApi.getPublicProducts(), catalogApi.getPublicCategories()]);
  const products = pubProducts.success ? pubProducts : await catalogApi.getProducts();
  const categories = pubCategories.success ? pubCategories : await catalogApi.getCategories();
  if (!products.success) return rejectWithValue(products.message || 'Catalog could not be loaded');
  return { products: (products.data || []).map(normaliseProduct), categories: (categories.data || []) as Category[] };
});

const catalogSlice = createSlice({ name: 'catalog', initialState: { products: initialProducts as Product[], categories: initialCategories as Category[], loading: false, error: null as string | null, isRemote: false }, reducers: {
  addLocalProduct: (state, action: PayloadAction<Product>) => { state.products.unshift(action.payload); }, removeLocalProduct: (state, action: PayloadAction<string>) => { state.products = state.products.filter((item) => item.id !== action.payload); }, toggleLocalStock: (state, action: PayloadAction<string>) => { const item = state.products.find((row) => row.id === action.payload); if (item) item.inStock = !item.inStock; }, toggleLocalVisibility: (state, action: PayloadAction<string>) => { const item = state.products.find((row) => row.id === action.payload); if (item) item.isAdded = item.isAdded === false; }, addLocalCategory: (state, action: PayloadAction<Category>) => { state.categories.push(action.payload); }, removeLocalCategory: (state, action: PayloadAction<string>) => { state.categories = state.categories.filter((item) => item.id !== action.payload); }, resetCatalog: (state) => { state.products = initialProducts as Product[]; state.categories = initialCategories as Category[]; state.isRemote = false; },
}, extraReducers: (builder) => builder.addCase(fetchCatalog.pending, (state) => { state.loading = true; state.error = null; }).addCase(fetchCatalog.fulfilled, (state, action) => { if (action.payload.products.length) state.products = action.payload.products; if (action.payload.categories.length) state.categories = action.payload.categories; state.loading = false; state.isRemote = true; }).addCase(fetchCatalog.rejected, (state, action) => { state.loading = false; state.error = String(action.payload || 'Catalog could not be loaded'); }) });
export const { addLocalProduct, removeLocalProduct, toggleLocalStock, toggleLocalVisibility, addLocalCategory, removeLocalCategory, resetCatalog } = catalogSlice.actions;
export default catalogSlice.reducer;
