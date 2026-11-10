import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import themeReducer from './slices/themeSlice';
import uiReducer from './slices/uiSlice';
import portfolioReducer from './slices/portfolioSlice';
import inquiriesReducer from './slices/inquiriesSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: themeReducer,
    ui: uiReducer,
    portfolio: portfolioReducer,
    inquiries: inquiriesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore date/function serializability warnings for flexible payloads
        ignoredActions: ['ui/openLightbox', 'ui/openVideoModal'],
      },
    }),
});

export default store;

