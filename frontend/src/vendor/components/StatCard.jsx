import { useEffect, useState } from 'react';
import { TrendingUp, ArrowUpRight } from 'lucide-react';

function StatCard({ label, value, icon, trend = '+8% this mo.', accent = false }) {
  const [displayValue, setDisplayValue] = useState(0);

  // Smooth counter animation if value is numeric
  useEffect(() => {
    if (typeof value === 'number') {
      let start = 0;
      const end = value;
      if (end === 0) {
        setDisplayValue(0);
        return;
      }
      const duration = 500; // ms
      const stepTime = 20;
      const totalSteps = duration / stepTime;
      const increment = end / totalSteps;

      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setDisplayValue(end);
          clearInterval(timer);
        } else {
          setDisplayValue(Math.floor(start));
        }
      }, stepTime);

      return () => clearInterval(timer);
    } else {
      setDisplayValue(value);
    }
  }, [value]);

  const formattedValue =
    typeof displayValue === 'number'
      ? displayValue.toLocaleString('en-IN')
      : displayValue;

  return (
    <div
      className={`relative rounded-sm p-2.5 sm:p-3 border transition-all duration-300 hover:-translate-y-0.5 group overflow-hidden ${
        accent
          ? 'bg-gradient-to-br from-gold-400/15 via-ink-900/90 to-ink-900 border-gold-400/40 shadow-md shadow-gold-500/5'
          : 'bg-ink-900/80 border-white/5 hover:border-gold-400/30 hover:shadow-md'
      }`}
    >
      {/* Subtle ambient light on hover */}
      <div className="absolute -top-8 -right-8 w-16 h-16 bg-gold-400/10 rounded-full blur-lg group-hover:bg-gold-400/20 transition-all duration-500 pointer-events-none" />

      <div className="flex items-center justify-between mb-1.5 relative z-10">
        <div
          className={`w-7 h-7 rounded-sm flex items-center justify-center transition-all duration-300 group-hover:scale-105 shrink-0 ${
            accent
              ? 'bg-gold-400 text-ink-950 font-bold shadow-sm shadow-gold-400/20'
              : 'bg-ink-800 text-gold-600 dark:text-gold-400 border border-black/5 dark:border-white/5 group-hover:border-gold-400/40 group-hover:text-gold-700 dark:group-hover:text-gold-300'
          }`}
        >
          {icon}
        </div>
        {trend && (
          <span className="inline-flex items-center gap-1 text-[8px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded-full bg-emerald-400/10 text-emerald-400 border border-emerald-400/20 whitespace-nowrap">
            <TrendingUp className="w-2 h-2 shrink-0" />
            <span className="truncate max-w-[60px] sm:max-w-none">{trend}</span>
          </span>
        )}
      </div>

      <div className="relative z-10">
        <p className="font-sans font-bold text-xl sm:text-2xl text-ink-50 tracking-tight group-hover:text-gold-600 dark:group-hover:text-gold-200 transition-colors leading-none tabular-nums">
          {formattedValue}
        </p>
        <p className="text-[9px] uppercase tracking-wider text-ink-400 mt-1 font-semibold flex items-center justify-between leading-tight">
          <span className="truncate">{label}</span>
          <ArrowUpRight className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition-opacity text-gold-400 shrink-0 ml-1" />
        </p>
      </div>
    </div>
  );
}

export default StatCard;
