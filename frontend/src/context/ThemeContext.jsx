import { createContext, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectThemeMode,
  selectIsDark,
  toggleTheme as toggleThemeAction,
  setTheme as setThemeAction,
} from '@/store/slices/themeSlice';

const ThemeContext = createContext({
<<<<<<< HEAD
  theme: 'light',
  toggleTheme: () => { },
  isDark: false,
});

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    try {
      // If the user has explicitly chosen a theme via the toggle, respect their choice
      const explicit = localStorage.getItem('svml_theme_user_set');
      if (explicit) {
        const saved = localStorage.getItem('svml_theme');
        if (saved === 'light' || saved === 'dark') return saved;
      }
      return 'light'; // By default, luxury light mode
    } catch {
      return 'light';
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.remove('light');
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
      root.style.colorScheme = 'light';
    }
    try {
      localStorage.setItem('svml_theme', theme);
    } catch (e) {
      console.error('Failed to save theme in localStorage', e);
    }
  }, [theme]);

  const toggleTheme = () => {
    try {
      localStorage.setItem('svml_theme_user_set', 'true');
    } catch {
      // Ignore storage errors in private browsing
    }
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
=======
  theme: 'dark',
  toggleTheme: () => {},
  isDark: true,
});

export function ThemeProvider({ children }) {
  const dispatch = useDispatch();
  const theme = useSelector(selectThemeMode);
  const isDark = useSelector(selectIsDark);

  const toggleTheme = () => {
    dispatch(toggleThemeAction());
>>>>>>> 5c3de334890c83be6a71b75dd461a49f9fb2c2d1
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
