import { createSlice } from '@reduxjs/toolkit';

const getInitialTheme = () => {
  try {
    const saved = localStorage.getItem('svml_theme');
    if (saved === 'light' || saved === 'dark') return saved;
    return 'dark'; // Default to signature dark luxury aesthetic
  } catch {
    return 'dark';
  }
};

const applyThemeToDOM = (theme) => {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  if (theme === 'light') {
    root.classList.remove('dark');
    root.classList.add('light');
    root.style.colorScheme = 'light';
  } else {
    root.classList.remove('light');
    root.classList.add('dark');
    root.style.colorScheme = 'dark';
  }
  try {
    localStorage.setItem('svml_theme', theme);
  } catch (e) {
    console.error('Failed to save theme in localStorage', e);
  }
};

const initialTheme = getInitialTheme();
applyThemeToDOM(initialTheme);

const themeSlice = createSlice({
  name: 'theme',
  initialState: {
    mode: initialTheme,
    isDark: initialTheme === 'dark',
  },
  reducers: {
    setTheme: (state, action) => {
      const newTheme = action.payload === 'light' ? 'light' : 'dark';
      state.mode = newTheme;
      state.isDark = newTheme === 'dark';
      applyThemeToDOM(newTheme);
    },
    toggleTheme: (state) => {
      const nextTheme = state.mode === 'dark' ? 'light' : 'dark';
      state.mode = nextTheme;
      state.isDark = nextTheme === 'dark';
      applyThemeToDOM(nextTheme);
    },
  },
});

export const { setTheme, toggleTheme } = themeSlice.actions;

export const selectThemeMode = (state) => state.theme.mode;
export const selectIsDark = (state) => state.theme.isDark;

export default themeSlice.reducer;

