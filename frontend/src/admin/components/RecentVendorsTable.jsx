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
    <section className="mt-8 bg-ink-900/80 rounded-sm p-6 border border-white/5 backdrop-blur-xl group hover:border-gold-400/20 transition-all duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-serif text-2xl text-ink-50 font-normal">Recent Vendor Registrations</h3>
            <span className="px-2 py-0.5 rounded-full bg-gold-400/10 text-gold-400 border border-gold-400/20 text-[9px] uppercase tracking-wider font-semibold">
              Live Feed
            </span>
          </div>
          <p className="mt-1 text-xs text-ink-400">
            Latest studio creators and wedding cinematographers joining the platform
          </p>
        </div>
        <Link
          to="/admin/dashboard/vendors"
          className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-gold-400 hover:text-gold-300 font-semibold transition-colors"
        >
          <span>View All Vendors</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="overflow-x-auto rounded-sm border border-white/5">
        <table className="w-full text-left">
          <thead>
            <tr className="text-[10px] uppercase tracking-widest text-ink-400 bg-ink-950/80 border-b border-white/5">
              <th className="py-3.5 px-4 font-semibold">Studio / Brand</th>
              <th className="py-3.5 px-4 font-semibold">Owner / Lead</th>
              <th className="py-3.5 px-4 font-semibold">City</th>
              <th className="py-3.5 px-4 font-semibold">Joined Date</th>
              <th className="py-3.5 px-4 font-semibold">Account Status</th>
              <th className="py-3.5 px-4 font-semibold text-right">Quick Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-xs">
            {displayVendors.map((vendor) => (
              <tr key={vendor._id} className="hover:bg-white/[0.02] transition-colors">
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-gold-500/20 to-gold-400/20 border border-gold-400/30 flex items-center justify-center text-gold-300 font-serif text-xs font-semibold shrink-0">
                      {(vendor.studioName || vendor.fullName || '?').charAt(0).toUpperCase()}
                    </div>
                    <span className="font-medium text-ink-100">{vendor.studioName || vendor.fullName}</span>
                  </div>
                </td>
                <td className="py-3.5 px-4 text-ink-300">{vendor.fullName}</td>
                <td className="py-3.5 px-4 text-ink-400">{vendor.city || '—'}</td>
                <td className="py-3.5 px-4 text-ink-400">
                  {new Date(vendor.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </td>
                <td className="py-3.5 px-4">
                  <VendorStatusBadge status={vendor.status} />
                </td>
                <td className="py-3.5 px-4 text-right">
                  <Link
                    to="/admin/dashboard/vendors"
                    className="text-[10px] uppercase tracking-wider text-gold-400 hover:text-gold-300 hover:underline font-medium"
                  >
                    Manage →
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
