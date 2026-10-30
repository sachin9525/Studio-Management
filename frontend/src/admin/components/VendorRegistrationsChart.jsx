import { TrendingUp } from 'lucide-react';

function VendorRegistrationsChart({ registrations = [], loading = false, error = false }) {
  const maxRegistrations = Math.max(1, ...registrations.map(({ count }) => count));

  return (
    <section className="lg:col-span-2 bg-ink-800 rounded-sm p-6 border border-white/5">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-serif text-xl text-ink-50">Vendor Registrations</h3>
          <p className="mt-1 text-xs text-ink-500">Last six months</p>
        </div>
        <TrendingUp className="w-4 h-4 text-gold-400" />
      </div>
      {loading && registrations.length === 0 ? (
        <p className="py-16 text-center text-sm text-ink-500">Loading registrations…</p>
      ) : error && registrations.length === 0 ? (
        <p className="py-16 text-center text-sm text-ink-500">Registration data unavailable.</p>
      ) : (
        <div className="flex h-48 items-end justify-between gap-3 pt-4">
          {registrations.map((bar) => (
            <div key={bar.month} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
              <span className="text-[10px] text-ink-400">{bar.count}</span>
              <div
                className="w-full min-h-1 rounded-t-sm bg-gradient-to-t from-gold-600 to-gold-400 transition-all"
                style={{ height: `${Math.max(3, (bar.count / maxRegistrations) * 100)}%` }}
                title={`${bar.count} registrations`}
              />
              <span className="text-[10px] uppercase tracking-widest text-ink-500">{bar.month}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default VendorRegistrationsChart;

