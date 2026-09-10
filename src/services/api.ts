/**
 * Centralized API Service for MarketPlace Frontend
 * Implements endpoints from docs/OpenAPISpecs.yaml
 * Handles HTTP requests, JWT token injection, base URL, and error parsing.
 */

import type {
  AdminRole,
  CartResponse,
  Category,
  CheckoutResponse,
  Coupon,
  DeliverySlotAvailability,
  DeliveryZone,
  Inventory,
  Order,
  Permission,
  Product,
  ProductImage,
  ProductVariant,
  Referral,
  SavedAddress,
  Vendor,
  VendorProduct,
} from '@/types';

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000').replace(/\/$/, '');

// Token Storage Keys
const ACCESS_TOKEN_KEY = 'freshvana_access_token';
const REFRESH_TOKEN_KEY = 'freshvana_refresh_token';

export const getAccessToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
};

export const getRefreshToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

export const setTokens = (accessToken: string, refreshToken?: string) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  if (refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }
};

export const clearTokens = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

interface RequestOptions extends RequestInit {
  requiresAuth?: boolean;
}

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<{ success: boolean; data?: T; message?: string; error?: string; meta?: any }> {
  const { requiresAuth = false, headers: customHeaders, ...restOptions } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(customHeaders as Record<string, string>),
  };

  if (requiresAuth) {
    const token = getAccessToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${API_BASE_URL}${cleanEndpoint}`;

  try {
    const response = await fetch(url, {
      ...restOptions,
      headers,
    });

    const data = await response.json().catch(() => null);

    // Refresh once for an expired access token. The original request is then
    // repeated with the new token; a failed refresh never creates a session.
    if (response.status === 401 && requiresAuth && !hasRetriedAfterRefresh && endpoint !== '/auth/refresh') {
      const refreshToken = getRefreshToken();
      if (refreshToken) {
        const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken }),
        });
        const refreshBody = await refreshResponse.json().catch(() => null);
        const refreshed = refreshBody?.data ?? refreshBody;
        if (refreshResponse.ok && refreshed?.accessToken) {
          setTokens(refreshed.accessToken, refreshed.refreshToken);
          return apiRequest<T>(endpoint, options, true);
        }
      }
      clearTokens();
    }

    if (!response.ok) {
      const errorMessage =
        data?.message || data?.error?.message || data?.error || `HTTP error! Status: ${response.status}`;
      return {
        success: false,
        message: errorMessage,
        error: data?.error?.code,
      };
    }

    return {
      success: true,
      data: data?.data ?? data,
      message: data?.message,
      meta: data?.meta,
    };
  } catch (err: any) {
    console.error(`API Error [${endpoint}]:`, err);
    return {
      success: false,
      message: err.message || 'Unable to connect to server. Please check if the backend is running.',
    };
  }
}

const toQueryString = (params: Record<string, any>) => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.set(key, String(value));
    }
  });
  const qs = searchParams.toString();
  return qs ? `?${qs}` : '';
};

// =============================================================================
// HEALTH API
// =============================================================================
export const healthApi = {
  getLiveness: () => apiRequest<{ status: string; uptime: number }>('/health'),
  getReadiness: () => apiRequest<{ status: string; database: boolean; redis: boolean }>('/health/ready'),
};

// =============================================================================
// AUTH API
// =============================================================================
export interface LoginPayload {
  emailOrPhone?: string;
  email?: string;
  phone?: string;
  password?: string;
}

export interface SignupPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  password?: string;
  referralCode?: string;
}

export interface AuthResponseData {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    role: string;
    status: string;
  };
  accessToken: string;
  refreshToken: string;
}

export const authApi = {
  signup: (payload: SignupPayload) =>
    apiRequest<AuthResponseData>('/api/v1/auth/signup', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  login: (payload: LoginPayload) =>
    apiRequest<AuthResponseData>('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  refresh: (refreshToken: string) =>
    apiRequest<{ accessToken: string; refreshToken: string }>('/api/v1/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    }),

  logout: (refreshToken: string) =>
    apiRequest('/api/v1/auth/logout', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    }),

  logoutAll: () =>
    apiRequest('/api/v1/auth/logout-all', {
      method: 'POST',
      requiresAuth: true,
    }),

  getCurrentUser: () =>
    apiRequest<{
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      phone?: string;
      role: string;
      status: string;
    }>('/api/v1/auth/me', {
      method: 'GET',
      requiresAuth: true,
    }),

  verifyEmail: (token: string) =>
    apiRequest(`/api/v1/auth/verify-email?token=${encodeURIComponent(token)}`),

  resendVerification: (userId: string) =>
    apiRequest('/api/v1/auth/resend-verification', {
      method: 'POST',
      body: JSON.stringify({ userId }),
    }),

  forgotPassword: (email: string) =>
    apiRequest('/api/v1/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  resetPassword: (token: string, newPassword: string) =>
    apiRequest('/api/v1/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword }),
    }),
};

// =============================================================================
// USERS & ADDRESSES API
// =============================================================================
export const usersApi = {
  getProfile: () => apiRequest<any>('/api/v1/users/me', { method: 'GET', requiresAuth: true }),
  updateProfile: (payload: any) =>
    apiRequest<any>('/api/v1/users/me', { method: 'PUT', body: JSON.stringify(payload), requiresAuth: true }),
  getAddresses: () => apiRequest<SavedAddress[]>('/api/v1/users/addresses', { method: 'GET', requiresAuth: true }),
  createAddress: (payload: Partial<SavedAddress>) =>
    apiRequest<SavedAddress>('/api/v1/users/addresses', {
      method: 'POST',
      body: JSON.stringify(payload),
      requiresAuth: true,
    }),
  updateAddress: (id: string, payload: Partial<SavedAddress>) =>
    apiRequest<SavedAddress>(`/api/v1/users/addresses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
      requiresAuth: true,
    }),
  deleteAddress: (id: string) =>
    apiRequest(`/api/v1/users/addresses/${id}`, { method: 'DELETE', requiresAuth: true }),
  setDefaultAddress: (id: string) =>
    apiRequest<SavedAddress>(`/api/v1/users/addresses/${id}/default`, { method: 'PATCH', requiresAuth: true }),
};

// =============================================================================
// DELIVERY API
// =============================================================================
export const deliveryApi = {
  getZonesByPincode: (postalCode: string) =>
    apiRequest<DeliveryZone[]>(`/api/v1/delivery/zones?postalCode=${encodeURIComponent(postalCode)}`),
  getAvailableSlots: (zoneId: string, date?: string) =>
    apiRequest<DeliverySlotAvailability[]>(
      `/api/v1/delivery/slots?zoneId=${encodeURIComponent(zoneId)}&date=${encodeURIComponent(
        date || new Date().toISOString().split('T')[0]
      )}`
    ),
};

// =============================================================================
// CATALOG API (PUBLIC & ADMIN)
// =============================================================================
export interface CatalogQuery {
  categoryId?: string;
  status?: string;
  search?: string;
}

export const catalogApi = {
  // Public read-only catalog
  getPublicCategories: () => apiRequest<Category[]>('/api/v1/catalog/public/categories'),
  getPublicCategoryById: (id: string) => apiRequest<Category>(`/api/v1/catalog/public/categories/${id}`),
  getPublicProducts: (query: CatalogQuery = {}) =>
    apiRequest<Product[]>(`/api/v1/catalog/public/products${toQueryString(query)}`),
  getPublicProductById: (id: string) => apiRequest<Product>(`/api/v1/catalog/public/products/${id}`),
  getPublicVendorProducts: (query: { variantId?: string; vendorId?: string } = {}) =>
    apiRequest<VendorProduct[]>(`/api/v1/catalog/public/vendor-products${toQueryString(query)}`),

  // Protected Admin Catalog
  getCategories: (query: { status?: string; parentId?: string } = {}) =>
    apiRequest<Category[]>(`/api/v1/catalog/categories${toQueryString(query)}`, { requiresAuth: true }),
  getCategoryById: (id: string) =>
    apiRequest<Category>(`/api/v1/catalog/categories/${id}`, { requiresAuth: true }),
  createCategory: (payload: unknown) =>
    apiRequest<Category>('/api/v1/catalog/categories', {
      method: 'POST',
      body: JSON.stringify(payload),
      requiresAuth: true,
    }),
  updateCategory: (id: string, payload: unknown) =>
    apiRequest<Category>(`/api/v1/catalog/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
      requiresAuth: true,
    }),
  deleteCategory: (id: string) =>
    apiRequest(`/api/v1/catalog/categories/${id}`, { method: 'DELETE', requiresAuth: true }),

  getProducts: (query: CatalogQuery = {}) =>
    apiRequest<Product[]>(`/api/v1/catalog/products${toQueryString(query)}`, { requiresAuth: true }),
  getProductById: (id: string) =>
    apiRequest<Product>(`/api/v1/catalog/products/${id}`, { requiresAuth: true }),
  createProduct: (payload: unknown) =>
    apiRequest<Product>('/api/v1/catalog/products', {
      method: 'POST',
      body: JSON.stringify(payload),
      requiresAuth: true,
    }),
  updateProduct: (id: string, payload: unknown) =>
    apiRequest<Product>(`/api/v1/catalog/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
      requiresAuth: true,
    }),
  deleteProduct: (id: string) =>
    apiRequest(`/api/v1/catalog/products/${id}`, { method: 'DELETE', requiresAuth: true }),

  // Variants & Images
  createVariant: (payload: Partial<ProductVariant>) =>
    apiRequest<ProductVariant>('/api/v1/catalog/variants', {
      method: 'POST',
      body: JSON.stringify(payload),
      requiresAuth: true,
    }),
  updateVariant: (id: string, payload: Partial<ProductVariant>) =>
    apiRequest<ProductVariant>(`/api/v1/catalog/variants/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
      requiresAuth: true,
    }),
  deleteVariant: (id: string) =>
    apiRequest(`/api/v1/catalog/variants/${id}`, { method: 'DELETE', requiresAuth: true }),

  createImage: (payload: Partial<ProductImage>) =>
    apiRequest<ProductImage>('/api/v1/catalog/images', {
      method: 'POST',
      body: JSON.stringify(payload),
      requiresAuth: true,
    }),
  deleteImage: (id: string) =>
    apiRequest(`/api/v1/catalog/images/${id}`, { method: 'DELETE', requiresAuth: true }),

  getVendorProducts: (query: { vendorId?: string; variantId?: string; isActive?: boolean } = {}) =>
    apiRequest<VendorProduct[]>(`/api/v1/catalog/vendor-products${toQueryString(query)}`, { requiresAuth: true }),
  getVendorProductById: (id: string) =>
    apiRequest<VendorProduct>(`/api/v1/catalog/vendor-products/${id}`, { requiresAuth: true }),
  updateVendorProduct: (id: string, payload: Partial<VendorProduct>) =>
    apiRequest<VendorProduct>(`/api/v1/catalog/vendor-products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
      requiresAuth: true,
    }),
  deleteVendorProduct: (id: string) =>
    apiRequest(`/api/v1/catalog/vendor-products/${id}`, { method: 'DELETE', requiresAuth: true }),
};

// =============================================================================
// VENDOR SCOPED API
// =============================================================================
export const vendorApi = {
  getProducts: (query: { variantId?: string; isActive?: boolean } = {}) =>
    apiRequest<VendorProduct[]>(`/api/v1/vendor/products${toQueryString(query)}`, { requiresAuth: true }),
  createProduct: (payload: any) =>
    apiRequest<VendorProduct>('/api/v1/vendor/products', {
      method: 'POST',
      body: JSON.stringify(payload),
      requiresAuth: true,
    }),
  updateProduct: (id: string, payload: any) =>
    apiRequest<VendorProduct>(`/api/v1/vendor/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
      requiresAuth: true,
    }),
  deleteProduct: (id: string) =>
    apiRequest(`/api/v1/vendor/products/${id}`, { method: 'DELETE', requiresAuth: true }),

  getInventory: (lowStock?: boolean) =>
    apiRequest<Inventory[]>(`/api/v1/vendor/inventory${toQueryString({ lowStock })}`, { requiresAuth: true }),
  getLowStockInventory: () =>
    apiRequest<Inventory[]>('/api/v1/vendor/inventory/low-stock', { requiresAuth: true }),
  getInventoryById: (id: string) =>
    apiRequest<Inventory>(`/api/v1/vendor/inventory/${id}`, { requiresAuth: true }),
  adjustInventory: (id: string, payload: { adjustmentQuantity: number; reason?: string }) =>
    apiRequest<{ inventoryId: string; oldQuantity: number; newQuantity: number }>(
      `/api/v1/vendor/inventory/${id}`,
      { method: 'PUT', body: JSON.stringify(payload), requiresAuth: true }
    ),
};

// =============================================================================
// CART API
// =============================================================================
export const cartApi = {
  getCart: () => apiRequest('/cart', { method: 'GET', requiresAuth: true }),
  addItem: (vendorProductId: string, quantity: number) =>
    apiRequest('/cart/items', { method: 'POST', body: JSON.stringify({ vendorProductId, quantity }), requiresAuth: true }),
  updateItem: (itemId: string, quantity: number) =>
    apiRequest(`/cart/items/${itemId}`, { method: 'PUT', body: JSON.stringify({ quantity }), requiresAuth: true }),
  removeItem: (itemId: string) => apiRequest(`/cart/items/${itemId}`, { method: 'DELETE', requiresAuth: true }),
  clear: () => apiRequest('/cart', { method: 'DELETE', requiresAuth: true }),
};

// =============================================================================
// CHECKOUT API
// =============================================================================
export const checkoutApi = {
  processCheckout: (payload: any, idempotencyKey?: string) =>
    apiRequest<CheckoutResponse>('/api/v1/checkout', {
      method: 'POST',
      headers: idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : undefined,
      body: JSON.stringify(payload),
      requiresAuth: true,
    }),
};

// =============================================================================
// ORDERS API
// =============================================================================
export const ordersApi = {
  getCustomerOrders: (status?: string) =>
    apiRequest<Order[]>(`/api/v1/orders/customer${toQueryString({ status })}`, { method: 'GET', requiresAuth: true }),
  getCustomerOrderDetail: (id: string) =>
    apiRequest<Order>(`/api/v1/orders/customer/${id}`, { method: 'GET', requiresAuth: true }),
  getVendorOrders: (status?: string) =>
    apiRequest<any[]>(`/api/v1/orders/vendor${toQueryString({ status })}`, { method: 'GET', requiresAuth: true }),
  getVendorOrderDetail: (id: string) =>
    apiRequest<any>(`/api/v1/orders/vendor/${id}`, { method: 'GET', requiresAuth: true }),
  updateVendorOrderStatus: (id: string, status: string) =>
    apiRequest<any>(`/api/v1/orders/vendor/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
      requiresAuth: true,
    }),
};

// =============================================================================
// ADMIN COUPONS API
// =============================================================================
export const couponsApi = {
  getCoupons: (query: { isActive?: boolean; code?: string } = {}) =>
    apiRequest<Coupon[]>(`/api/v1/admin/coupons${toQueryString(query)}`, { requiresAuth: true }),
  createCoupon: (payload: Partial<Coupon>) =>
    apiRequest<Coupon>('/api/v1/admin/coupons', {
      method: 'POST',
      body: JSON.stringify(payload),
      requiresAuth: true,
    }),
  getCouponById: (id: string) => apiRequest<Coupon>(`/api/v1/admin/coupons/${id}`, { requiresAuth: true }),
  updateCoupon: (id: string, payload: Partial<Coupon>) =>
    apiRequest<Coupon>(`/api/v1/admin/coupons/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
      requiresAuth: true,
    }),
  deleteCoupon: (id: string) => apiRequest(`/api/v1/admin/coupons/${id}`, { method: 'DELETE', requiresAuth: true }),
};

// =============================================================================
// ADMIN REFERRALS API
// =============================================================================
export const referralsApi = {
  getReferrals: () => apiRequest<Referral[]>('/api/v1/admin/referrals', { requiresAuth: true }),
  grantReward: (id: string) =>
    apiRequest(`/api/v1/admin/referrals/rewards/${id}/grant`, { method: 'POST', requiresAuth: true }),
};

// =============================================================================
// ADMIN VENDORS, ROLES & PERMISSIONS API
// =============================================================================
export const adminApi = {
  getVendors: (query: { status?: string; search?: string } = {}) =>
    apiRequest<Vendor[]>(`/api/v1/admin/vendors${toQueryString(query)}`, { requiresAuth: true }),
  getVendorById: (id: string) => apiRequest<Vendor>(`/api/v1/admin/vendors/${id}`, { requiresAuth: true }),
  updateVendorStatus: (id: string, status: string) =>
    apiRequest<Vendor>(`/api/v1/admin/vendors/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
      requiresAuth: true,
    }),

  getPermissions: () => apiRequest<Permission[]>('/api/v1/admin/permissions', { requiresAuth: true }),
  getRoles: () => apiRequest<AdminRole[]>('/api/v1/admin/roles', { requiresAuth: true }),
  createRole: (payload: Partial<AdminRole>) =>
    apiRequest<AdminRole>('/api/v1/admin/roles', {
      method: 'POST',
      body: JSON.stringify(payload),
      requiresAuth: true,
    }),
  getRoleById: (id: string) => apiRequest<AdminRole>(`/api/v1/admin/roles/${id}`, { requiresAuth: true }),
  updateRole: (id: string, payload: Partial<AdminRole>) =>
    apiRequest<AdminRole>(`/api/v1/admin/roles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
      requiresAuth: true,
    }),
  deleteRole: (id: string) => apiRequest(`/api/v1/admin/roles/${id}`, { method: 'DELETE', requiresAuth: true }),

  assignUserRole: (userId: string, adminRoleId: string) =>
    apiRequest(`/api/v1/admin/users/${userId}/role`, {
      method: 'POST',
      body: JSON.stringify({ adminRoleId }),
      requiresAuth: true,
    }),
  removeUserRole: (userId: string) =>
    apiRequest(`/api/v1/admin/users/${userId}/role`, { method: 'DELETE', requiresAuth: true }),
};
