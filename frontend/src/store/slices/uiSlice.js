import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    videoModal: {
      isOpen: false,
      video: null,
    },
    lightbox: {
      isOpen: false,
      index: 0,
      images: [],
      title: '',
    },
    toast: {
      isVisible: false,
      message: '',
      type: 'info', // 'success' | 'error' | 'warning' | 'info'
    },
    isQuickSearchOpen: false,
  },
  reducers: {
    openVideoModal: (state, action) => {
      state.videoModal.isOpen = true;
      state.videoModal.video = action.payload;
    },
    closeVideoModal: (state) => {
      state.videoModal.isOpen = false;
      state.videoModal.video = null;
    },
    openLightbox: (state, action) => {
      const { images, index = 0, title = '' } = action.payload;
      state.lightbox.isOpen = true;
      state.lightbox.images = images;
      state.lightbox.index = index;
      state.lightbox.title = title;
    },
    closeLightbox: (state) => {
      state.lightbox.isOpen = false;
      state.lightbox.images = [];
      state.lightbox.index = 0;
      state.lightbox.title = '';
    },
    setLightboxIndex: (state, action) => {
      state.lightbox.index = action.payload;
    },
    showToast: (state, action) => {
      const { message, type = 'info' } =
        typeof action.payload === 'string'
          ? { message: action.payload, type: 'info' }
          : action.payload;
      state.toast.isVisible = true;
      state.toast.message = message;
      state.toast.type = type;
    },
    hideToast: (state) => {
      state.toast.isVisible = false;
      state.toast.message = '';
    },
    toggleQuickSearch: (state) => {
      state.isQuickSearchOpen = !state.isQuickSearchOpen;
    },
    setQuickSearch: (state, action) => {
      state.isQuickSearchOpen = Boolean(action.payload);
    },
  },
});

export const {
  openVideoModal,
  closeVideoModal,
  openLightbox,
  closeLightbox,
  setLightboxIndex,
  showToast,
  hideToast,
  toggleQuickSearch,
  setQuickSearch,
} = uiSlice.actions;

export const selectVideoModal = (state) => state.ui.videoModal;
export const selectLightbox = (state) => state.ui.lightbox;
export const selectToast = (state) => state.ui.toast;
export const selectIsQuickSearchOpen = (state) => state.ui.isQuickSearchOpen;

export default uiSlice.reducer;

