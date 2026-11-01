import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

function ThemeToggle({ className = '', showLabel = false }) {
  const { toggleTheme, isDark } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`relative inline-flex items-center justify-center p-2 rounded-sm border transition-all duration-300 group cursor-pointer ${isDark
          ? 'border-white/10 bg-white/5 hover:bg-gold-400/10 hover:border-gold-400/40 text-gold-300 hover:text-gold-200 shadow-sm'
          : 'border-gold-500/30 bg-gold-500/10 hover:bg-gold-500/20 text-gold-600 hover:text-gold-700 shadow-sm'
        } ${className}`}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <div className="relative w-4 h-4 flex items-center justify-center">
        {isDark ? (
          <Sun className="w-4 h-4 transition-transform duration-500 group-hover:rotate-45" />
        ) : (
          <Moon className="w-4 h-4 transition-transform duration-500 group-hover:-rotate-12" />
        )}
      </div>

      {showLabel && (
        <span className="ml-2 text-xs uppercase tracking-wider font-medium">
          {isDark ? 'Light' : 'Dark'}
        </span>
      )}
    </button>
  );
}

export default ThemeToggle;
