import { Link } from 'react-router-dom';
import { ArrowUpRight, Users, ShieldCheck } from 'lucide-react';
import VendorStatusBadge from './VendorStatusBadge';

function RecentVendorsTable({ vendors = [], loading = false, error = false }) {
  // Fallback demo vendors if database is fresh
  const displayVendors = vendors.length
    ? vendors
    : [
        {
          _id: 'v1',
          studioName: 'Royal Frames Jaipur',
          fullName: 'Vikramaditya Rathore',
          city: 'Jaipur',
          status: 'approved',
          createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        },
        {
          _id: 'v2',
          studioName: 'Lumière Wedding Cinematics',
          fullName: 'Siddharth Roy',
          city: 'Mumbai',
          status: 'approved',
          createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
        },
        {
          _id: 'v3',
          studioName: 'Udaipur Heritage Stories',
          fullName: 'Kavita Singh',
          city: 'Udaipur',
          status: 'pending',
          createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
        },
        {
          _id: 'v4',
          studioName: 'Cinematic Knot Productions',
          fullName: 'Arjun Kapoor',
          city: 'Delhi NCR',
          status: 'approved',
          createdAt: new Date(Date.now() - 86400000 * 12).toISOString(),
        },
      ];

  return (
    <section className="mt-8 bg-white/90 dark:bg-black/45 rounded-[28px] p-6 sm:p-7 border border-black/10 dark:border-white/15 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.06)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-300 relative overflow-hidden">
      {/* Soft Glass Ambient Highlights */}
      <div className="absolute -top-20 -left-20 w-44 h-44 bg-amber-500/10 dark:bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-serif text-2xl sm:text-3xl text-ink-50 font-normal">Recent Vendor Registrations</h3>
            <span className="px-2.5 py-1 rounded-full bg-gold-500/10 dark:bg-gold-400/10 text-gold-700 dark:text-gold-300 border border-gold-500/20 text-[9px] uppercase font-mono tracking-wider font-bold shadow-2xs">
              Live Feed
            </span>
          </div>
          <p className="mt-1 text-xs text-ink-500 dark:text-ink-400 font-medium">
            Latest studio creators and wedding cinematographers joining the platform
          </p>
        </div>
        <Link
          to="/admin/dashboard/vendors"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/[0.03] dark:bg-white/5 border border-black/10 dark:border-white/10 text-xs font-mono uppercase tracking-widest text-gold-700 dark:text-gold-300 hover:bg-gold-500/10 hover:border-gold-500/30 font-bold transition-all shadow-2xs"
        >
          <span>View All Vendors</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-black/10 dark:border-white/10 relative z-10 bg-white/60 dark:bg-black/30">
        <table className="w-full text-left">
          <thead>
            <tr className="text-[10px] uppercase font-mono tracking-widest text-ink-500 dark:text-ink-400 bg-black/[0.03] dark:bg-white/[0.03] border-b border-black/10 dark:border-white/10">
              <th className="py-3.5 px-5 font-bold">Studio / Brand</th>
              <th className="py-3.5 px-5 font-bold">Owner / Lead</th>
              <th className="py-3.5 px-5 font-bold">City</th>
              <th className="py-3.5 px-5 font-bold">Joined Date</th>
              <th className="py-3.5 px-5 font-bold">Account Status</th>
              <th className="py-3.5 px-5 font-bold text-right">Quick Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5 dark:divide-white/5 text-xs">
            {displayVendors.map((vendor) => (
              <tr key={vendor._id} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.03] transition-colors">
                <td className="py-3.5 px-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500/20 to-orange-500/20 border border-gold-400/30 flex items-center justify-center text-gold-700 dark:text-gold-300 font-serif text-xs font-bold shrink-0 shadow-2xs">
                      {(vendor.studioName || vendor.fullName || '?').charAt(0).toUpperCase()}
                    </div>
                    <span className="font-semibold text-ink-50">{vendor.studioName || vendor.fullName}</span>
                  </div>
                </td>
                <td className="py-3.5 px-5 text-ink-700 dark:text-ink-300 font-medium">{vendor.fullName}</td>
                <td className="py-3.5 px-5 text-ink-500 dark:text-ink-400">{vendor.city || '—'}</td>
                <td className="py-3.5 px-5 text-ink-500 dark:text-ink-400 font-mono">
                  {new Date(vendor.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </td>
                <td className="py-3.5 px-5">
                  <VendorStatusBadge status={vendor.status} />
                </td>
                <td className="py-3.5 px-5 text-right">
                  <Link
                    to="/admin/dashboard/vendors"
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-black/[0.03] dark:bg-white/5 border border-black/10 dark:border-white/10 text-[10px] font-mono uppercase tracking-widest text-ink-700 dark:text-ink-300 hover:text-gold-700 dark:hover:text-gold-300 hover:border-gold-500/30 font-bold transition-all shadow-2xs"
                  >
                    <span>Inspect</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default RecentVendorsTable;
