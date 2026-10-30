import { useEffect, useState } from 'react';
import { TrendingUp, ArrowUpRight } from 'lucide-react';

function StatCard({ label, value, icon, trend = '+12% this mo.', accent = false }) {
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
      const duration = 800; // ms
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
      className={`relative rounded-sm p-3.5 sm:p-4 border transition-all duration-300 hover:-translate-y-0.5 group overflow-hidden ${
        accent
          ? 'bg-gradient-to-br from-gold-400/15 via-ink-900/90 to-ink-900 border-gold-400/40 shadow-lg shadow-gold-500/5'
          : 'bg-ink-900/80 border-white/5 hover:border-gold-400/30 hover:shadow-lg'
      }`}
    >
      {/* Subtle ambient light on hover */}
      <div className="absolute -top-10 -right-10 w-20 h-20 bg-gold-400/10 rounded-full blur-xl group-hover:bg-gold-400/20 transition-all duration-500 pointer-events-none" />

      <div className="flex items-center justify-between mb-3 relative z-10">
        <div
          className={`w-8 h-8 sm:w-9 sm:h-9 rounded-sm flex items-center justify-center transition-all duration-300 group-hover:scale-105 ${
            accent
              ? 'bg-gold-400 text-ink-950 font-bold shadow shadow-gold-400/20'
              : 'bg-ink-800 text-gold-400 border border-white/5 group-hover:border-gold-400/40 group-hover:text-gold-300'
          }`}
        >
          {icon}
        </div>
        {trend && (
          <span className="inline-flex items-center gap-1 text-[9px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded-full bg-emerald-400/10 text-emerald-400 border border-emerald-400/20 whitespace-nowrap">
            <TrendingUp className="w-2.5 h-2.5 shrink-0" />
            <span className="truncate max-w-[70px] sm:max-w-none">{trend}</span>
          </span>
        )}
      </div>

      <div className="relative z-10">
        <p className="font-serif text-2xl sm:text-3xl text-ink-50 font-normal tracking-tight group-hover:text-gold-200 transition-colors leading-none">
          {formattedValue}
        </p>
        <p className="text-[10px] uppercase tracking-wider text-ink-400 mt-2 font-medium flex items-center justify-between leading-tight">
          <span className="truncate">{label}</span>
          <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-gold-400 shrink-0 ml-1" />
        </p>
      </div>
    </div>
  );
}

export default StatCard;
