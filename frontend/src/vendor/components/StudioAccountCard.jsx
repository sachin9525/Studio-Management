import { Link } from 'react-router-dom';
import { ArrowUpRight, CheckCircle2, MapPin, Store } from 'lucide-react';

const formatDate = (date) =>
  date
    ? new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : 'Date not set';

function StudioAccountCard({ studioName, vendor = {}, profile = {} }) {
  return (
    <section
      className="relative rounded-[28px] border border-black/10 dark:border-white/15 bg-white/90 dark:bg-black/45 backdrop-blur-2xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.06)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden"
      aria-labelledby="studio-account-title"
    >
      <div className="absolute -top-10 -right-10 w-28 h-28 bg-amber-500/10 dark:bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex items-center justify-between mb-5 relative z-10">
        <h3 id="studio-account-title" className="font-serif text-xl text-ink-50 flex items-center gap-2 font-normal">
          <Store className="w-4 h-4 text-gold-600 dark:text-gold-400" />
          Studio Account
        </h3>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-700 dark:text-emerald-300 text-[10px] uppercase font-mono tracking-wider font-bold shadow-2xs">
          <CheckCircle2 className="w-3 h-3" />
          {vendor.status || profile?.status || 'Active'}
        </span>
      </div>

      <div className="space-y-3 relative z-10">
        <div className="p-3.5 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/5 dark:border-white/5">
          <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-ink-500 block mb-1">Studio Name</span>
          <p className="text-sm font-semibold text-ink-50">{studioName}</p>
        </div>

        <div className="p-3.5 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/5 dark:border-white/5">
          <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-ink-500 block mb-1">Location</span>
          <p className="text-xs text-ink-100 font-medium flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-gold-600 dark:text-gold-400 shrink-0" />
            {[vendor.city, vendor.state].filter(Boolean).join(', ') || 'Location not added'}
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/5 dark:border-white/5">
          <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-ink-500 block mb-1">Member Since</span>
          <p className="text-xs font-mono text-ink-500">{formatDate(vendor.createdAt)}</p>
        </div>
      </div>

      <Link
        to="/vendor/dashboard/profile"
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-full border border-gold-500/30 bg-gold-500/10 hover:bg-gold-500/20 py-2.5 text-xs uppercase font-mono tracking-widest text-gold-700 dark:text-gold-300 font-bold transition-all hover:scale-[1.01] shadow-2xs relative z-10 cursor-pointer"
      >
        <span>Manage Studio Profile</span>
        <ArrowUpRight className="h-3.5 w-3.5" />
      </Link>
    </section>
  );
}

export default StudioAccountCard;
