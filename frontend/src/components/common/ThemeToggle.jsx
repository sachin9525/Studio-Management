import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

function ThemeToggle({ className = '', showLabel = false }) {
  const { toggleTheme, isDark } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`relative inline-flex items-center justify-center w-8 h-8 rounded-full border transition-all duration-300 group cursor-pointer shadow-2xs hover:scale-105 active:scale-95 ${
        isDark
          ? 'border-white/15 bg-white/5 hover:bg-amber-400/15 hover:border-amber-400/40 text-amber-300 hover:text-amber-200'
          : 'border-black/10 bg-black/[0.04] hover:bg-amber-500/15 hover:border-amber-500/40 text-ink-900 hover:text-amber-700'
      } ${className}`}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <div className="relative w-3.5 h-3.5 flex items-center justify-center">
        {isDark ? (
          <Sun className="w-3.5 h-3.5 text-amber-300 transition-transform duration-500 group-hover:rotate-45" />
        ) : (
          <Moon className="w-3.5 h-3.5 text-neutral-800 dark:text-ink-300 group-hover:text-amber-700 transition-transform duration-500 group-hover:-rotate-12" />
        )}
      </div>

      {showLabel && (
        <span className="ml-2 text-xs font-sans font-semibold">
          {isDark ? 'Light' : 'Dark'}
        </span>
      )}
    </button>
  );
}

export default ThemeToggle;