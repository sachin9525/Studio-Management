import { createSlice } from '@reduxjs/toolkit';
import {
  WEDDING_PORTFOLIO,
  PREWEDDING_PORTFOLIO,
  EVENT_PORTFOLIO,
} from '@/data/demoContent';

const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState: {
    activeCategory: 'All',
    activeTab: 'wedding', // 'wedding' | 'pre-wedding' | 'event'
    weddingPhotos: WEDDING_PORTFOLIO,
    preWeddingPhotos: PREWEDDING_PORTFOLIO,
    eventPhotos: EVENT_PORTFOLIO,
    selectedPhoto: null,
  },
  reducers: {
    setActiveCategory: (state, action) => {
      state.activeCategory = action.payload;
    },
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
      state.activeCategory = 'All'; // reset filter on tab change
    },
    setSelectedPhoto: (state, action) => {
      state.selectedPhoto = action.payload;
    },
    addPhoto: (state, action) => {
      const { collection, photo } = action.payload;
      if (collection === 'wedding') {
        state.weddingPhotos.unshift(photo);
      } else if (collection === 'pre-wedding') {
        state.preWeddingPhotos.unshift(photo);
      } else if (collection === 'event') {
        state.eventPhotos.unshift(photo);
      }
    },
    deletePhoto: (state, action) => {
      const { collection, url } = action.payload;
      if (collection === 'wedding') {
        state.weddingPhotos = state.weddingPhotos.filter((p) => p.url !== url);
      } else if (collection === 'pre-wedding') {
        state.preWeddingPhotos = state.preWeddingPhotos.filter((p) => p.url !== url);
      } else if (collection === 'event') {
        state.eventPhotos = state.eventPhotos.filter((p) => p.url !== url);
      }
    },
  },
});

export const {
  setActiveCategory,
  setActiveTab,
  setSelectedPhoto,
  addPhoto,
  deletePhoto,
} = portfolioSlice.actions;

export const selectPortfolio = (state) => state.portfolio;
export const selectActiveCategory = (state) => state.portfolio.activeCategory;
export const selectActiveTab = (state) => state.portfolio.activeTab;
export const selectWeddingPhotos = (state) => state.portfolio.weddingPhotos;
export const selectPreWeddingPhotos = (state) => state.portfolio.preWeddingPhotos;
export const selectEventPhotos = (state) => state.portfolio.eventPhotos;

export default portfolioSlice.reducer;

