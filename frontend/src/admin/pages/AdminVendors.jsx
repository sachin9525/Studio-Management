import { useCallback, useEffect, useMemo, useState } from 'react';
import { RefreshCw, Users } from 'lucide-react';
import { AdminLayout, VendorStatusBadge } from '@/admin/components';
import { useAuth } from '@/context/AuthContext';
import { apiRequest } from '@/utils/api';

const filters = ['all', 'pending', 'approved', 'suspended'];

function AdminVendors() {
  const { session } = useAuth();
  const [vendors, setVendors] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState('');
  const [error, setError] = useState('');

  const loadVendors = useCallback(async () => {
    if (!session?.token) return;
    setLoading(true);
    setError('');
    try {
      const data = await apiRequest('/admin/vendors', { token: session.token });
      setVendors(data.vendors);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to load vendors.');
    } finally {
      setLoading(false);
    }
  }, [session?.token]);

  useEffect(() => {
    loadVendors();
  }, [loadVendors]);

  const visibleVendors = useMemo(
    () => filter === 'all' ? vendors : vendors.filter((vendor) => vendor.status === filter),
    [filter, vendors]
  );

  const updateStatus = async (id, status) => {
    setUpdatingId(id);
    setError('');
    try {
      const data = await apiRequest(`/admin/vendors/${id}/status`, {
        method: 'PATCH',
        token: session.token,
        body: JSON.stringify({ status }),
      });
      setVendors((current) => current.map((vendor) => vendor._id === id ? data.vendor : vendor));
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to update vendor status.');
    } finally {
      setUpdatingId('');
    }
  };

  return (
    <AdminLayout title="Vendor Management">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-3xl sm:text-4xl text-ink-50 mb-1 font-normal tracking-tight">Vendor Management</h2>
          <p className="text-xs sm:text-sm text-ink-500 dark:text-ink-400 font-medium">Review registrations and manage verified studio partner credentials.</p>
        </div>
        <button
          type="button"
          onClick={loadVendors}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-full border border-black/15 dark:border-white/15 px-4 py-2 text-xs font-semibold bg-white/80 dark:bg-black/30 text-ink-700 dark:text-ink-300 hover:border-gold-500/40 hover:text-gold-700 dark:hover:text-gold-300 transition-all shadow-xs disabled:opacity-50 cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh Directory
        </button>
      </div>

      {/* 4 Glassy Stat Cards */}
      <div className="mb-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {[
          ['Total Studios', vendors.length, 'Network'],
          ['Pending Review', vendors.filter((v) => v.status === 'pending').length, 'Queue'],
          ['Active Studios', vendors.filter((v) => v.status === 'approved').length, 'Verified'],
          ['Suspended', vendors.filter((v) => v.status === 'suspended').length, 'Paused'],
        ].map(([label, value, badgeText], idx) => (
          <div
            key={label}
            className="relative rounded-[24px] p-4 sm:p-5 border bg-white/90 dark:bg-black/45 backdrop-blur-2xl border-black/10 dark:border-white/15 shadow-[0_15px_30px_rgba(0,0,0,0.06)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden group hover:-translate-y-0.5 transition-all"
          >
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-amber-500/10 dark:bg-amber-400/10 rounded-full blur-xl group-hover:bg-amber-500/20 transition-all pointer-events-none" />
            <div className="flex items-center justify-between mb-2 relative z-10">
              <span className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500/20 to-orange-500/20 border border-gold-400/30 text-gold-700 dark:text-gold-300 flex items-center justify-center font-bold text-xs shadow-2xs">
                {idx + 1}
              </span>
              <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-black/[0.04] dark:bg-white/10 border border-black/10 dark:border-white/15 text-ink-600 dark:text-ink-300">
                {badgeText}
              </span>
            </div>
            <div className="relative z-10">
              <p className="font-serif text-3xl sm:text-4xl text-ink-50 font-normal tracking-tight group-hover:text-gold-700 dark:group-hover:text-gold-300 transition-colors tabular-nums">
                {value.toLocaleString('en-IN')}
              </p>
              <p className="mt-1 text-[10px] uppercase font-mono font-bold tracking-widest text-ink-500 dark:text-ink-400">
                {label}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Modern Filter Pills */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2" aria-label="Filter vendors by status">
          {filters.map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setFilter(value)}
              aria-pressed={filter === value}
              className={`rounded-full px-5 py-2 text-xs font-mono uppercase tracking-widest transition-all cursor-pointer font-bold shadow-2xs ${
                filter === value
                  ? 'bg-gold-500/15 dark:bg-white/15 border border-gold-500/35 dark:border-white/20 text-gold-900 dark:text-gold-300 shadow-xs'
                  : 'bg-black/[0.03] dark:bg-white/5 border border-black/10 dark:border-white/10 text-ink-700 dark:text-ink-300 hover:text-ink-950 dark:hover:text-white hover:bg-black/[0.06] dark:hover:bg-white/10'
              }`}
            >
              {value}{' '}
              <span className="ml-1 text-[10px] font-mono opacity-80">
                ({value === 'all' ? vendors.length : vendors.filter((vendor) => vendor.status === value).length})
              </span>
            </button>
          ))}
        </div>
        <span className="text-xs font-mono text-ink-500 dark:text-ink-400">Showing up to 200 studios</span>
      </div>

      {error && (
        <p role="alert" className="mb-4 rounded-2xl border border-red-500/20 bg-red-500/5 p-4 text-xs font-semibold text-red-600 dark:text-red-300 shadow-xs">
          {error}
        </p>
      )}

      {/* Glassy Table Card Container */}
      <div className="overflow-x-auto rounded-[28px] border border-black/10 dark:border-white/15 bg-white/90 dark:bg-black/45 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.06)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="border-b border-black/10 dark:border-white/10 bg-black/[0.03] dark:bg-white/[0.03] text-left text-[10px] uppercase font-mono font-bold tracking-widest text-ink-500 dark:text-ink-400">
              <th className="px-6 py-4">Studio / Brand</th>
              <th className="px-6 py-4">Contact</th>
              <th className="px-6 py-4">Location</th>
              <th className="px-6 py-4">Registered</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5 dark:divide-white/5">
            {visibleVendors.map((vendor) => (
              <tr key={vendor._id} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.03] transition-colors align-middle text-xs">
                <td className="px-6 py-4.5">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-500/20 to-orange-500/20 border border-gold-400/30 flex items-center justify-center text-gold-700 dark:text-gold-300 font-serif text-sm font-bold shrink-0 shadow-2xs">
                      {(vendor.studioName || vendor.fullName || 'V').charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-ink-50">{vendor.studioName || vendor.fullName}</p>
                      <p className="mt-0.5 text-xs text-ink-500">{vendor.fullName}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4.5">
                  <a className="text-ink-700 dark:text-ink-300 hover:text-gold-700 dark:hover:text-gold-300 font-medium transition-colors block" href={`mailto:${vendor.email}`}>
                    {vendor.email}
                  </a>
                  {vendor.phone && (
                    <a className="mt-0.5 block text-ink-500 font-mono hover:text-gold-700 dark:hover:text-gold-300 transition-colors" href={`tel:${vendor.phone}`}>
                      {vendor.phone}
                    </a>
                  )}
                </td>
                <td className="px-6 py-4.5 text-ink-600 dark:text-ink-400">
                  {[vendor.city, vendor.state].filter(Boolean).join(', ') || '—'}
                </td>
                <td className="whitespace-nowrap px-6 py-4.5 text-ink-500 dark:text-ink-400 font-mono">
                  {new Date(vendor.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </td>
                <td className="px-6 py-4.5">
                  <VendorStatusBadge status={vendor.status} />
                </td>
                <td className="px-6 py-4.5 text-right">
                  {vendor.status === 'pending' ? (
                    <div className="inline-flex gap-2">
                      <button
                        type="button"
                        disabled={updatingId === vendor._id}
                        onClick={() => updateStatus(vendor._id, 'approved')}
                        className="rounded-full bg-emerald-500 hover:bg-emerald-600 px-3.5 py-1.5 text-[10px] font-mono font-bold uppercase tracking-widest text-white shadow-xs transition-transform active:scale-95 disabled:opacity-50 cursor-pointer"
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        disabled={updatingId === vendor._id}
                        onClick={() => updateStatus(vendor._id, 'suspended')}
                        className="rounded-full border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 px-3.5 py-1.5 text-[10px] font-mono font-bold uppercase tracking-widest text-red-600 dark:text-red-400 transition-colors disabled:opacity-50 cursor-pointer"
                      >
                        Suspend
                      </button>
                    </div>
                  ) : (
                    <select
                      aria-label={`Change ${vendor.studioName || vendor.fullName} status`}
                      value={vendor.status}
                      disabled={updatingId === vendor._id}
                      onChange={(event) => updateStatus(vendor._id, event.target.value)}
                      className="rounded-full border border-black/15 dark:border-white/15 bg-white dark:bg-black/60 px-3.5 py-1.5 text-xs text-ink-50 font-semibold focus:border-gold-500 focus:outline-none shadow-2xs disabled:opacity-50 cursor-pointer"
                    >
                      <option value="approved">APPROVED</option>
                      <option value="pending">PENDING</option>
                      <option value="suspended">SUSPENDED</option>
                    </select>
                  )}
                </td>
              </tr>
            ))}
            {!loading && visibleVendors.length === 0 && (
              <tr>
                <td colSpan="6" className="px-6 py-20 text-center">
                  <Users className="mx-auto mb-3 h-9 w-9 text-ink-400 opacity-60" />
                  <p className="text-sm font-medium text-ink-500">
                    No vendors {filter === 'all' ? 'registered yet' : `with status “${filter}”`}.
                  </p>
                </td>
              </tr>
            )}
            {loading && (
              <tr>
                <td colSpan="6" className="px-6 py-20 text-center text-xs font-mono font-semibold text-ink-500 animate-pulse">
                  Loading vendors…
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}

export default AdminVendors;
