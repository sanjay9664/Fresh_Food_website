import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { authApi, clearTokens, getAccessToken, getRefreshToken, setTokens } from '@/services/api';

export interface AuthUser { id?: string; email: string; name: string; role: string; phone?: string; firstName?: string; lastName?: string }
type Credentials = { identifier: string; password: string };

const saveSession = (user: AuthUser) => {
  localStorage.setItem('freshvana_auth', JSON.stringify({ isLoggedIn: true, user }));
};

export const restoreSession = createAsyncThunk<AuthUser | null>('auth/restore', async () => {
  if (!getAccessToken()) return null;
  const response = await authApi.getCurrentUser();
  if (!response.success || !response.data) {
    clearTokens();
    return null;
  }
  const user = response.data;
  return { ...user, name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email };
});

export const loginUser = createAsyncThunk<AuthUser, Credentials, { rejectValue: string }>('auth/login', async (payload, { rejectWithValue }) => {
  const response = await authApi.login({ emailOrPhone: payload.identifier.trim(), password: payload.password });
  if (!response.success || !response.data?.accessToken) return rejectWithValue(response.message || 'Unable to sign in.');
  const { user, accessToken, refreshToken } = response.data;
  setTokens(accessToken, refreshToken);
  const authUser: AuthUser = { ...user, name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email };
  saveSession(authUser);
  return authUser;
});

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  const refreshToken = getRefreshToken();
  if (refreshToken) await authApi.logout(refreshToken);
  clearTokens();
  localStorage.removeItem('freshvana_auth');
});

const authSlice = createSlice({
  name: 'auth', initialState: { user: null as AuthUser | null, loading: true, error: null as string | null },
  reducers: { clearAuthError: (state) => { state.error = null; } },
  extraReducers: (builder) => builder
    .addCase(restoreSession.fulfilled, (state, action) => { state.user = action.payload; state.loading = false; })
    .addCase(restoreSession.rejected, (state) => { state.user = null; state.loading = false; })
    .addCase(loginUser.pending, (state) => { state.loading = true; state.error = null; })
    .addCase(loginUser.fulfilled, (state, action) => { state.user = action.payload; state.loading = false; })
    .addCase(loginUser.rejected, (state, action) => { state.loading = false; state.error = action.payload || 'Unable to sign in.'; })
    .addCase(logoutUser.fulfilled, (state) => { state.user = null; state.loading = false; }),
});
export const { clearAuthError } = authSlice.actions;
export default authSlice.reducer;
