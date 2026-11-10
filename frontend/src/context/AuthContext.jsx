import { createContext, useContext, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectSession,
  selectUser,
  selectProfile,
  selectAuthLoading,
  selectAuthNotice,
  clearAuthNotice,
  signOut as signOutAction,
  signInUser,
  signUpVendor as signUpVendorAction,
  refreshProfile as refreshProfileAction,
} from '@/store/slices/authSlice';

const AuthContext = createContext(void 0);

export function AuthProvider({ children }) {
  const dispatch = useDispatch();
  const session = useSelector(selectSession);
  const user = useSelector(selectUser);
  const profile = useSelector(selectProfile);
  const loading = useSelector(selectAuthLoading);
  const authNotice = useSelector(selectAuthNotice);

  const handleClearAuthNotice = useCallback(() => {
    dispatch(clearAuthNotice());
  }, [dispatch]);

  const signOut = useCallback(
    async (noticeMessage = null) => {
      dispatch(signOutAction(noticeMessage));
    },
    [dispatch]
  );

  // Listen for global 401 session-expired events from api.js
  useEffect(() => {
    const handleSessionExpired = (event) => {
      const msg = event?.detail?.message || 'Your session has expired. Please sign in again.';
      signOut(msg);
    };

    window.addEventListener('auth:session-expired', handleSessionExpired);
    return () => {
      window.removeEventListener('auth:session-expired', handleSessionExpired);
    };
  }, [signOut]);

  const signUpVendor = async (data) => {
    try {
      await dispatch(signUpVendorAction(data)).unwrap();
      return { error: null };
    } catch (error) {
      return { error: typeof error === 'string' ? error : 'Unable to create account.' };
    }
  };

  const signIn = async (email, password) => {
    try {
      await dispatch(signInUser({ email, password })).unwrap();
      return { error: null };
    } catch (error) {
      return { error: typeof error === 'string' ? error : 'Unable to sign in.' };
    }
  };

  const refreshProfile = useCallback(async () => {
    if (!session?.token) return;
    try {
      await dispatch(refreshProfileAction()).unwrap();
    } catch (err) {
      // If 401, handled in extraReducers
    }
  }, [dispatch, session?.token]);

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        profile,
        loading,
        authNotice,
        clearAuthNotice: handleClearAuthNotice,
        signUpVendor,
        signIn,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}

export default AuthContext;
