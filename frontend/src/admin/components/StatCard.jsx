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
      className={`relative rounded-[24px] p-4 sm:p-5 border transition-all duration-300 hover:-translate-y-1 group overflow-hidden bg-white/90 dark:bg-black/45 backdrop-blur-2xl border-black/10 dark:border-white/15 shadow-[0_15px_30px_rgba(0,0,0,0.06)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] ${
        accent ? 'ring-1 ring-gold-500/40 border-gold-500/40' : ''
      }`}
    >
      {/* Soft Glass Ambient Highlights */}
      <div className="absolute -top-10 -right-10 w-24 h-24 bg-amber-500/10 dark:bg-amber-400/10 rounded-full blur-xl group-hover:bg-amber-500/20 transition-all pointer-events-none" />

      <div className="flex items-center justify-between mb-3 relative z-10">
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-105 shrink-0 shadow-2xs ${
            accent
              ? 'bg-gradient-to-tr from-amber-500 to-orange-500 text-white font-bold shadow-md shadow-orange-500/20'
              : 'bg-gradient-to-tr from-amber-500/15 to-orange-500/15 text-gold-700 dark:text-gold-300 border border-gold-500/30 group-hover:border-gold-500/50'
          }`}
        >
          {icon}
        </div>
        {trend && (
          <span className="inline-flex items-center gap-1 text-[9px] uppercase tracking-wider font-mono font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 dark:bg-emerald-400/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/25 whitespace-nowrap shadow-2xs">
            <TrendingUp className="w-2.5 h-2.5 shrink-0" />
            <span className="truncate max-w-[70px] sm:max-w-none">{trend}</span>
          </span>
        )}
      </div>

      <div className="relative z-10">
        <p className="font-serif text-3xl sm:text-4xl text-ink-50 font-normal tracking-tight group-hover:text-gold-600 dark:group-hover:text-gold-300 transition-colors leading-none tabular-nums">
          {formattedValue}
        </p>
        <p className="text-[10px] uppercase tracking-widest font-mono font-bold text-ink-500 dark:text-ink-400 mt-2 flex items-center justify-between leading-tight">
          <span className="truncate">{label}</span>
          <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-gold-600 dark:text-gold-400 shrink-0 ml-1" />
        </p>
      </div>
    </div>
  );
}

export default StatCard;
