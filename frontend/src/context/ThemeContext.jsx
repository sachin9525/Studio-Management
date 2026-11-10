import { createContext, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectThemeMode,
  selectIsDark,
  toggleTheme as toggleThemeAction,
  setTheme as setThemeAction,
} from '@/store/slices/themeSlice';

const ThemeContext = createContext({
  theme: 'light',
  toggleTheme: () => {},
  setTheme: () => {},
  isDark: false,
});

export function ThemeProvider({ children }) {
  const dispatch = useDispatch();
  const theme = useSelector(selectThemeMode);
  const isDark = useSelector(selectIsDark);

  const toggleTheme = () => {
    dispatch(toggleThemeAction());
  };

  const setTheme = (newTheme) => {
    dispatch(setThemeAction(newTheme));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export default ThemeContext;
