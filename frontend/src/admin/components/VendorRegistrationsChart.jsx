import { useState } from 'react';
import { TrendingUp, Sparkles, BarChart2 } from 'lucide-react';

function VendorRegistrationsChart({ registrations = [], loading = false, error = false }) {
  const [hoveredBar, setHoveredBar] = useState(null);

  // Fallback demo data if registrations is empty
  const chartData = registrations.length
    ? registrations
    : [
        { month: 'Jun', count: 4 },
        { month: 'Jul', count: 7 },
        { month: 'Aug', count: 12 },
        { month: 'Sep', count: 18 },
        { month: 'Oct', count: 24 },
        { month: 'Nov', count: 31 },
      ];

  const maxRegistrations = Math.max(1, ...chartData.map(({ count }) => count));
  const totalInPeriod = chartData.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <section className="lg:col-span-2 bg-white/90 dark:bg-black/45 rounded-[28px] p-6 sm:p-7 border border-black/10 dark:border-white/15 backdrop-blur-2xl relative overflow-hidden group shadow-[0_20px_50px_rgba(0,0,0,0.06)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-300">
      {/* Soft Glass Ambient Highlights */}
      <div className="absolute -top-20 -right-20 w-44 h-44 bg-amber-500/10 dark:bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-serif text-2xl sm:text-3xl text-ink-50 font-normal">Vendor Growth Trajectory</h3>
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 dark:bg-emerald-400/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[9px] uppercase tracking-wider font-mono font-bold shadow-2xs">
              +42% Growth
            </span>
          </div>
          <p className="mt-1 text-xs text-ink-500 dark:text-ink-400 font-medium">
            Monthly onboarding of luxury photography & cinematography studios
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-ink-700 dark:text-ink-300 bg-black/[0.04] dark:bg-white/5 px-3.5 py-1.5 rounded-full border border-black/10 dark:border-white/10 font-semibold shadow-2xs">
          <TrendingUp className="w-4 h-4 text-gold-600 dark:text-gold-400" />
          <span className="font-mono text-gold-700 dark:text-gold-300 font-bold">{totalInPeriod}</span>
          <span>studios joined</span>
        </div>
      </div>

      {loading && registrations.length === 0 ? (
        <div className="py-20 text-center text-xs text-ink-500 animate-pulse">
          Loading platform metrics…
        </div>
      ) : error && registrations.length === 0 ? (
        <div className="py-20 text-center text-xs text-ink-500">
          Registration trend unavailable.
        </div>
      ) : (
        <div className="pt-4 relative z-10">
          <div className="flex h-52 items-end justify-between gap-3 sm:gap-6 border-b border-black/10 dark:border-white/10 pb-2">
            {chartData.map((bar, idx) => {
              const heightPercent = Math.max(8, (bar.count / maxRegistrations) * 100);
              const isHovered = hoveredBar === idx;
              const isLast = idx === chartData.length - 1;

              return (
                <div
                  key={bar.month}
                  className="flex h-full flex-1 flex-col items-center justify-end gap-2 group/bar relative cursor-pointer"
                  onMouseEnter={() => setHoveredBar(idx)}
                  onMouseLeave={() => setHoveredBar(null)}
                >
                  {/* Tooltip on hover */}
                  {isHovered && (
                    <div className="absolute -top-10 bg-gold-400 text-ink-950 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-xl whitespace-nowrap z-20 animate-scale-in">
                      {bar.count} Studios Onboarded
                    </div>
                  )}

                  <span
                    className={`text-[10px] font-mono transition-colors ${
                      isHovered || isLast ? 'text-gold-700 dark:text-gold-300 font-bold' : 'text-ink-500 dark:text-ink-400 font-semibold'
                    }`}
                  >
                    {bar.count}
                  </span>

                  {/* Animated Bar with gradient */}
                  <div className="w-full relative flex items-end justify-center">
                    <div
                      className={`w-full max-w-[44px] rounded-t-xl transition-all duration-500 ease-out ${
                        isHovered || isLast
                          ? 'bg-gradient-to-t from-amber-600 via-orange-500 to-amber-300 shadow-lg shadow-orange-500/25'
                          : 'bg-gradient-to-t from-gold-600/50 to-gold-400/50 hover:from-gold-600 hover:to-gold-400'
                      }`}
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>

                  <span
                    className={`text-[10px] uppercase font-mono tracking-widest transition-colors ${
                      isHovered || isLast ? 'text-gold-700 dark:text-gold-400 font-bold' : 'text-ink-500 dark:text-ink-400 font-semibold'
                    }`}
                  >
                    {bar.month}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}

export default VendorRegistrationsChart;
