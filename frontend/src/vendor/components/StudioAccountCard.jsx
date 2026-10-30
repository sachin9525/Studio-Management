import { Link } from 'react-router-dom';
import { ArrowUpRight, CheckCircle2, MapPin, Store } from 'lucide-react';

const formatDate = (date) =>
  date
    ? new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : 'Date not set';

function StudioAccountCard({ studioName, vendor = {}, profile = {} }) {
  return (
    <section className="rounded-sm border border-white/5 bg-ink-900/80 backdrop-blur-md p-5" aria-labelledby="studio-account-title">
      <div className="flex items-center justify-between mb-4">
        <h3 id="studio-account-title" className="font-serif text-lg text-ink-50 flex items-center gap-2">
          <Store className="w-4 h-4 text-gold-400" />
          Studio Account
        </h3>
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-400/10 border border-emerald-400/20 text-emerald-400 text-[10px] uppercase tracking-wider font-semibold">
          <CheckCircle2 className="w-3 h-3" />
          {vendor.status || profile?.status || 'Active'}
        </span>
      </div>

      <div className="space-y-3.5">
        <div className="p-3 rounded-sm bg-ink-800/50 border border-white/5">
          <span className="text-[10px] uppercase tracking-wider text-ink-500 block mb-0.5 font-medium">Studio Name</span>
          <p className="text-sm font-medium text-ink-100">{studioName}</p>
        </div>

        <div className="p-3 rounded-sm bg-ink-800/50 border border-white/5">
          <span className="text-[10px] uppercase tracking-wider text-ink-500 block mb-0.5 font-medium">Location</span>
          <p className="text-xs text-ink-200 flex items-center gap-1.5">
            <MapPin className="w-3 h-3 text-gold-400 shrink-0" />
            {[vendor.city, vendor.state].filter(Boolean).join(', ') || 'Location not added'}
          </p>
        </div>

        <div className="p-3 rounded-sm bg-ink-800/50 border border-white/5">
          <span className="text-[10px] uppercase tracking-wider text-ink-500 block mb-0.5 font-medium">Member Since</span>
          <p className="text-xs text-ink-300">{formatDate(vendor.createdAt)}</p>
        </div>
      </div>

      <Link
        to="/vendor/dashboard/profile"
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-sm border border-gold-400/30 bg-gold-400/10 py-2.5 text-xs uppercase tracking-widest text-gold-300 font-medium transition-all hover:bg-gold-400/20 hover:scale-[1.01]"
      >
        <span>Manage Profile</span>
        <ArrowUpRight className="h-3.5 w-3.5" />
      </Link>
    </section>
  );
}

export default StudioAccountCard;
