import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiRequest } from '@/utils/api';

const STORAGE_KEY = 'svml_local_auth';

export function toProfile(user) {
  if (!user) return null;
  return {
    id: user.id || user._id,
    email: user.email,
    role: user.role,
    full_name: user.fullName || user.full_name,
    studio_name: user.studioName ?? user.studio_name ?? null,
    studio_slug: user.studioSlug ?? user.studio_slug ?? null,
    status: user.status,
    phone: user.phone,
    address: user.address,
    city: user.city,
    state: user.state,
  };
}

const getInitialAuthState = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        session: parsed,
        user: parsed.user || null,
        profile: parsed.profile || null,
        loading: false,
        authNotice: null,
        error: null,
      };
    }
  } catch {
    localStorage.removeItem(STORAGE_KEY);
  }
  return {
    session: null,
    user: null,
    profile: null,
    loading: false,
    authNotice: null,
    error: null,
  };
};

export const signInUser = createAsyncThunk(
  'auth/signInUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      const profile = toProfile(response.user);
      const session = {
        token: response.token,
        user: { id: response.user.id || response.user._id, email: response.user.email },
        profile,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
      return session;
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : 'Unable to sign in.');
    }
  }
);

export const signUpVendor = createAsyncThunk(
  'auth/signUpVendor',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await apiRequest('/auth/register/vendor', {
        method: 'POST',
        body: JSON.stringify(formData),
      });
      return response;
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : 'Unable to create account.');
    }
  }
);

export const refreshProfile = createAsyncThunk(
  'auth/refreshProfile',
  async (_, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.session?.token;
    if (!token) return rejectWithValue('No token found');
    try {
      const response = await apiRequest('/auth/me', { token });
      const profile = toProfile(response.user);
      const nextSession = {
        token,
        user: { id: response.user.id || response.user._id, email: response.user.email },
        profile,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextSession));
      return nextSession;
    } catch (err) {
      if (err?.status === 401) {
        localStorage.removeItem(STORAGE_KEY);
      }
      return rejectWithValue(err instanceof Error ? err.message : 'Failed to refresh profile.');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: getInitialAuthState(),
  reducers: {
    signOut: (state, action) => {
      localStorage.removeItem(STORAGE_KEY);
      state.session = null;
      state.user = null;
      state.profile = null;
      state.error = null;
      if (action.payload) {
        state.authNotice = action.payload;
      }
    },
    clearAuthNotice: (state) => {
      state.authNotice = null;
    },
    setAuthNotice: (state, action) => {
      state.authNotice = action.payload;
    },
    setSessionDirectly: (state, action) => {
      state.session = action.payload;
      state.user = action.payload?.user || null;
      state.profile = action.payload?.profile || null;
      if (action.payload) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(action.payload));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Sign In
      .addCase(signInUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signInUser.fulfilled, (state, action) => {
        state.loading = false;
        state.session = action.payload;
        state.user = action.payload.user;
        state.profile = action.payload.profile;
        state.authNotice = null;
        state.error = null;
      })
      .addCase(signInUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Refresh Profile
      .addCase(refreshProfile.fulfilled, (state, action) => {
        state.session = action.payload;
        state.user = action.payload.user;
        state.profile = action.payload.profile;
      })
      .addCase(refreshProfile.rejected, (state, action) => {
        if (action.payload?.includes('401') || action.error?.message?.includes('401')) {
          state.session = null;
          state.user = null;
          state.profile = null;
          state.authNotice = 'Your session has expired. Please sign in again.';
        }
      });
  },
});

export const { signOut, clearAuthNotice, setAuthNotice, setSessionDirectly } = authSlice.actions;

export const selectAuth = (state) => state.auth;
export const selectSession = (state) => state.auth.session;
export const selectUser = (state) => state.auth.user;
export const selectProfile = (state) => state.auth.profile;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthNotice = (state) => state.auth.authNotice;
export const selectAuthError = (state) => state.auth.error;
export const selectIsAuthenticated = (state) => !!state.auth.session?.token;
export const selectUserRole = (state) => state.auth.profile?.role || state.auth.user?.role || null;

export default authSlice.reducer;

