import { useDispatch, useSelector } from 'react-redux';
import {
  selectAuth,
  selectUser,
  selectProfile,
  selectSession,
  selectAuthLoading,
  selectAuthNotice,
  selectIsAuthenticated,
  selectUserRole,
  signInUser,
  signUpVendor,
  refreshProfile,
  signOut,
  clearAuthNotice,
} from './slices/authSlice';
import {
  selectThemeMode,
  selectIsDark,
  setTheme,
  toggleTheme,
} from './slices/themeSlice';
import {
  selectToast,
  selectVideoModal,
  selectLightbox,
  showToast,
  hideToast,
  openVideoModal,
  closeVideoModal,
} from './slices/uiSlice';

// Core Redux hooks
export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;

// High-level Domain Hooks
export const useAppAuth = () => {
  const dispatch = useAppDispatch();
  const auth = useAppSelector(selectAuth);
  const user = useAppSelector(selectUser);
  const profile = useAppSelector(selectProfile);
  const session = useAppSelector(selectSession);
  const loading = useAppSelector(selectAuthLoading);
  const authNotice = useAppSelector(selectAuthNotice);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const role = useAppSelector(selectUserRole);

  return {
    ...auth,
    user,
    profile,
    session,
    loading,
    authNotice,
    isAuthenticated,
    role,
    signIn: (email, password) => dispatch(signInUser({ email, password })),
    signUpVendor: (data) => dispatch(signUpVendor(data)),
    refreshProfile: () => dispatch(refreshProfile()),
    signOut: (notice) => dispatch(signOut(notice)),
    clearAuthNotice: () => dispatch(clearAuthNotice()),
  };
};

export const useAppTheme = () => {
  const dispatch = useAppDispatch();
  const theme = useAppSelector(selectThemeMode);
  const isDark = useAppSelector(selectIsDark);

  return {
    theme,
    isDark,
    setTheme: (newTheme) => dispatch(setTheme(newTheme)),
    toggleTheme: () => dispatch(toggleTheme()),
  };
};

export const useAppUI = () => {
  const dispatch = useAppDispatch();
  const toast = useAppSelector(selectToast);
  const videoModal = useAppSelector(selectVideoModal);
  const lightbox = useAppSelector(selectLightbox);

  return {
    toast,
    videoModal,
    lightbox,
    notify: (message, type = 'info') => dispatch(showToast({ message, type })),
    closeToast: () => dispatch(hideToast()),
    openVideo: (video) => dispatch(openVideoModal(video)),
    closeVideo: () => dispatch(closeVideoModal()),
  };
};

