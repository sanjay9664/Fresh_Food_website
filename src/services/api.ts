/**
 * Centralized API Service for MarketPlace Frontend
 * Handles HTTP requests, JWT token injection, base URL, and error parsing.
 */

// Keep the versioned API base in one place. Override it per environment with
// NEXT_PUBLIC_API_URL (for example: https://api.freshvana.com/api/v1).
const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1').replace(/\/$/, '');

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
  options: RequestOptions = {},
  hasRetriedAfterRefresh = false,
): Promise<{ success: boolean; data?: T; message?: string; error?: string }> {
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

  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

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
      };
    }

    return {
      success: true,
      data: data?.data ?? data,
      message: data?.message,
    };
  } catch (err: any) {
    console.error(`API Error [${endpoint}]:`, err);
    return {
      success: false,
      message: err.message || 'Unable to connect to server. Please check if the backend is running.',
    };
  }
}

// =============================================================================
// AUTH API ENDPOINTS
// =============================================================================

export interface LoginPayload {
  emailOrPhone: string;
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
  login: (payload: LoginPayload) =>
    apiRequest<AuthResponseData>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  signup: (payload: SignupPayload) =>
    apiRequest<AuthResponseData>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(payload),
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
    }>('/users/me', {
      method: 'GET',
      requiresAuth: true,
    }),

  logout: (refreshToken: string) =>
    apiRequest('/auth/logout', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    }),

  refresh: (refreshToken: string) =>
    apiRequest<{ accessToken: string; refreshToken: string }>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    }),
};

// =============================================================================
// CATALOG API ENDPOINTS
// =============================================================================

export interface CatalogQuery {
  categoryId?: string;
  status?: string;
  search?: string;
}

const toQueryString = (query: CatalogQuery) => {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => value && params.set(key, value));
  const queryString = params.toString();
  return queryString ? `?${queryString}` : '';
};

export const catalogApi = {
  getProducts: (query: CatalogQuery = {}) =>
    apiRequest<unknown[]>(`/catalog/public/products${toQueryString(query)}`, { method: 'GET' }),
  getCategories: () =>
    apiRequest<unknown[]>('/catalog/public/categories', { method: 'GET' }),
  createProduct: (payload: unknown) =>
    apiRequest<unknown>('/catalog/products', { method: 'POST', body: JSON.stringify(payload), requiresAuth: true }),
  updateProduct: (id: string, payload: unknown) =>
    apiRequest<unknown>(`/catalog/products/${id}`, { method: 'PUT', body: JSON.stringify(payload), requiresAuth: true }),
  deleteProduct: (id: string) =>
    apiRequest(`/catalog/products/${id}`, { method: 'DELETE', requiresAuth: true }),
  createCategory: (payload: unknown) =>
    apiRequest<unknown>('/catalog/categories', { method: 'POST', body: JSON.stringify(payload), requiresAuth: true }),
  deleteCategory: (id: string) =>
    apiRequest(`/catalog/categories/${id}`, { method: 'DELETE', requiresAuth: true }),
};

// =============================================================================
// DELIVERY & CART API ENDPOINTS
// =============================================================================

export interface AvailableSlotResponse {
  id: string;
  startTime: string;
  endTime: string;
  label?: string;
  maxOrderCapacity?: number;
}

export const deliveryApi = {
  getZonesByPincode: (postalCode: string) =>
    apiRequest(`/delivery/zones?postalCode=${encodeURIComponent(postalCode)}`, {
      method: 'GET',
    }),

  getAvailableSlots: (zoneId: string = 'default-zone', date?: string) =>
    apiRequest<AvailableSlotResponse[]>(
      `/delivery/slots?zoneId=${encodeURIComponent(zoneId)}&date=${encodeURIComponent(
        date || new Date().toISOString()
      )}`,
      {
        method: 'GET',
      }
    ),
};

export const cartApi = {
  getCart: () => apiRequest('/cart', { method: 'GET', requiresAuth: true }),
  addItem: (vendorProductId: string, quantity: number) =>
    apiRequest('/cart/items', { method: 'POST', body: JSON.stringify({ vendorProductId, quantity }), requiresAuth: true }),
  updateItem: (itemId: string, quantity: number) =>
    apiRequest(`/cart/items/${itemId}`, { method: 'PUT', body: JSON.stringify({ quantity }), requiresAuth: true }),
  removeItem: (itemId: string) => apiRequest(`/cart/items/${itemId}`, { method: 'DELETE', requiresAuth: true }),
  clear: () => apiRequest('/cart', { method: 'DELETE', requiresAuth: true }),
};
