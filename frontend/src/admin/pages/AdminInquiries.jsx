import { useCallback, useEffect, useState } from 'react';
import { Mail, RefreshCw } from 'lucide-react';
import { AdminLayout } from '@/admin/components';
import { useAuth } from '@/context/AuthContext';
import { apiRequest } from '@/utils/api';

const filters = ['all', 'new', 'contacted', 'booked'];

function AdminInquiries() {
  const { session } = useAuth();
  const [filter, setFilter] = useState('all');
  const [inquiries, setInquiries] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [stats, setStats] = useState({ total: 0, new: 0, contacted: 0, booked: 0 });
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState('');
  const [error, setError] = useState('');

  const loadInquiries = useCallback(async () => {
    if (!session?.token) return;
    setLoading(true);
    setError('');
    try {
      const query = filter === 'all' ? '' : `?status=${filter}`;
      const [data, vendorData] = await Promise.all([
        apiRequest(`/admin/inquiries${query}`, { token: session.token }),
        apiRequest('/admin/vendors?status=approved', { token: session.token }),
      ]);
      setInquiries(data.inquiries);
      setVendors(vendorData.vendors);
      setStats(data.stats);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to load inquiries.');
    } finally {
      setLoading(false);
    }
  }, [filter, session?.token]);

  useEffect(() => {
    loadInquiries();
  }, [loadInquiries]);

  const updateStatus = async (id, status) => {
    setUpdatingId(id);
    setError('');
    try {
      await apiRequest(`/admin/inquiries/${id}/status`, {
        method: 'PATCH',
        token: session.token,
        body: JSON.stringify({ status }),
      });
      await loadInquiries();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to update inquiry.');
    } finally {
      setUpdatingId('');
    }
  };

  const assignVendor = async (id, vendorId) => {
    setUpdatingId(id);
    setError('');
    try {
      await apiRequest(`/admin/inquiries/${id}/vendor`, {
        method: 'PATCH',
        token: session.token,
        body: JSON.stringify({ vendorId }),
      });
      await loadInquiries();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to assign inquiry.');
    } finally {
      setUpdatingId('');
    }
  };

  return (
    <AdminLayout title="Client Inquiries">
      {/* Top Banner Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-3xl sm:text-4xl text-ink-50 mb-1 font-normal tracking-tight">Client Inquiries</h2>
          <p className="text-xs sm:text-sm text-ink-500 dark:text-ink-400 font-medium">Review and delegate wedding photography inquiries from the public showcase.</p>
        </div>
        <button
          type="button"
          onClick={loadInquiries}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-full border border-black/15 dark:border-white/15 px-4 py-2 text-xs font-semibold bg-white/80 dark:bg-black/30 text-ink-700 dark:text-ink-300 hover:border-gold-500/40 hover:text-gold-700 dark:hover:text-gold-300 transition-all shadow-xs disabled:opacity-50 cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh Feed
        </button>
      </div>

      {/* 4 Glassy Stat Cards */}
      <div className="mb-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {[
          ['All Inquiries', stats.total, 'Catalog'],
          ['New Leads', stats.new, 'Active'],
          ['Contacted', stats.contacted, 'In Touch'],
          ['Booked Shoots', stats.booked, 'Confirmed'],
        ].map(([label, value, badgeText], idx) => (
          <div
            key={label}
            className="relative rounded-[24px] p-4 sm:p-5 border bg-white/90 dark:bg-black/45 backdrop-blur-2xl border-black/10 dark:border-white/15 shadow-[0_15px_30px_rgba(0,0,0,0.06)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden group hover:-translate-y-0.5 transition-all"
          >
            {/* Soft Ambient Glow */}
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
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2" aria-label="Filter inquiries by status">
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
              {value}
            </button>
          ))}
        </div>
        <span className="text-xs font-mono text-ink-500 dark:text-ink-400">Showing up to 200 inquiries</span>
      </div>

      {error && (
        <p role="alert" className="mb-4 rounded-2xl border border-red-500/20 bg-red-500/5 p-4 text-xs font-semibold text-red-600 dark:text-red-300 shadow-xs">
          {error}
        </p>
      )}

      {/* Glassy Table Card Container */}
      <div className="overflow-x-auto rounded-[28px] border border-black/10 dark:border-white/15 bg-white/90 dark:bg-black/45 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.06)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        <table className="w-full min-w-[1050px]">
          <thead>
            <tr className="border-b border-black/10 dark:border-white/10 bg-black/[0.03] dark:bg-white/[0.03] text-left text-[10px] uppercase font-mono font-bold tracking-widest text-ink-500 dark:text-ink-400">
              <th className="px-6 py-4">Client</th>
              <th className="px-6 py-4">Event</th>
              <th className="px-6 py-4">Details</th>
              <th className="px-6 py-4">Received</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Assigned Studio</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5 dark:divide-white/5">
            {inquiries.map((inquiry) => (
              <tr key={inquiry._id} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.03] transition-colors align-top text-xs">
                <td className="px-6 py-4.5">
                  <p className="font-semibold text-sm text-ink-50">{inquiry.name}</p>
                  <a className="mt-1 block text-ink-500 hover:text-gold-700 dark:hover:text-gold-300 font-medium transition-colors" href={`mailto:${inquiry.email}`}>
                    {inquiry.email}
                  </a>
                  <a className="mt-0.5 block text-ink-500 hover:text-gold-700 dark:hover:text-gold-300 font-mono transition-colors" href={`tel:${inquiry.phone}`}>
                    {inquiry.phone}
                  </a>
                </td>
                <td className="px-6 py-4.5 text-ink-100">
                  <p className="font-semibold text-ink-50">{inquiry.eventType}</p>
                  {inquiry.eventDate && <p className="mt-1 font-mono text-ink-500">{new Date(inquiry.eventDate).toLocaleDateString('en-IN')}</p>}
                  {inquiry.eventLocation && <p className="mt-0.5 text-ink-500">{inquiry.eventLocation}</p>}
                </td>
                <td className="max-w-xs px-6 py-4.5 text-ink-600 dark:text-ink-400">
                  {inquiry.budget && (
                    <span className="inline-block mb-1.5 px-2.5 py-0.5 rounded-full bg-gold-500/10 text-gold-800 dark:text-gold-300 border border-gold-500/25 font-mono text-[10px] font-bold">
                      Budget: {inquiry.budget.replaceAll('-', ' ')}
                    </span>
                  )}
                  <p className="whitespace-pre-wrap leading-relaxed">{inquiry.message || 'No message provided.'}</p>
                </td>
                <td className="whitespace-nowrap px-6 py-4.5 text-ink-500 dark:text-ink-400 font-mono">
                  {new Date(inquiry.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </td>
                <td className="px-6 py-4.5">
                  <select
                    aria-label={`Update ${inquiry.name}'s inquiry status`}
                    value={inquiry.status}
                    disabled={updatingId === inquiry._id}
                    onChange={(event) => updateStatus(inquiry._id, event.target.value)}
                    className="rounded-full border border-black/15 dark:border-white/15 bg-white dark:bg-black/60 px-3.5 py-1.5 text-xs text-ink-50 font-semibold focus:border-gold-500 focus:outline-none shadow-2xs disabled:opacity-50 cursor-pointer"
                  >
                    {['new', 'contacted', 'booked'].map((status) => (
                      <option key={status} value={status}>
                        {status.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-6 py-4.5">
                  <select
                    aria-label={`Assign ${inquiry.name}'s inquiry to a studio`}
                    value={inquiry.vendorId?._id || ''}
                    disabled={updatingId === inquiry._id}
                    onChange={(event) => assignVendor(inquiry._id, event.target.value)}
                    className="max-w-52 rounded-full border border-black/15 dark:border-white/15 bg-white dark:bg-black/60 px-3.5 py-1.5 text-xs text-ink-50 font-semibold focus:border-gold-500 focus:outline-none shadow-2xs disabled:opacity-50 cursor-pointer"
                  >
                    <option value="">Unassigned</option>
                    {vendors.map((vendor) => (
                      <option key={vendor._id} value={vendor._id}>
                        {vendor.studioName || vendor.fullName}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
            {!loading && inquiries.length === 0 && (
              <tr>
                <td colSpan="6" className="px-6 py-20 text-center">
                  <Mail className="mx-auto mb-3 h-9 w-9 text-ink-400 opacity-60" />
                  <p className="text-sm font-medium text-ink-500">
                    No inquiries {filter === 'all' ? 'yet' : `with status “${filter}”`}.
                  </p>
                </td>
              </tr>
            )}
            {loading && (
              <tr>
                <td colSpan="6" className="px-6 py-20 text-center text-xs font-mono font-semibold text-ink-500 animate-pulse">
                  Loading inquiries…
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}

export default AdminInquiries;
