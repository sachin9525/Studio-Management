import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import VendorStatusBadge from './VendorStatusBadge';

function RecentVendorsTable({ vendors = [], loading = false, error = false }) {
  return (
    <section className="mt-6 bg-ink-800 rounded-sm p-6 border border-white/5">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-serif text-xl text-ink-50">Recent Vendors</h3>
        <Link
          to="/admin/dashboard/vendors"
          className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-gold-400 hover:text-gold-300 transition-colors"
        >
          View All <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-[10px] uppercase tracking-widest text-ink-500 border-b border-white/5">
              <th className="pb-3 font-normal">Studio</th>
              <th className="pb-3 font-normal">City</th>
              <th className="pb-3 font-normal">Joined</th>
              <th className="pb-3 font-normal">Status</th>
            </tr>
          </thead>
          <tbody>
            {vendors.map((vendor) => (
              <tr key={vendor._id} className="border-b border-white/5 last:border-0">
                <td className="py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gold-400/20 border border-gold-400/30 flex items-center justify-center text-gold-400 font-serif text-xs">
                      {(vendor.studioName || vendor.fullName || '?').charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm text-ink-100">{vendor.studioName || vendor.fullName}</span>
                  </div>
                </td>
                <td className="py-4 text-sm text-ink-400">{vendor.city || '—'}</td>
                <td className="py-4 text-sm text-ink-400">
                  {new Date(vendor.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </td>
                <td className="py-4">
                  <VendorStatusBadge status={vendor.status} />
                </td>
              </tr>
            ))}
            {!loading && !error && vendors.length === 0 && (
              <tr>
                <td colSpan="4" className="py-8 text-center text-sm text-ink-500">
                  No vendor registrations yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default RecentVendorsTable;

