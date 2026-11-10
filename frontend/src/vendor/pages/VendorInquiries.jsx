import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  Clock,
  Eye,
  Mail,
  MapPin,
  Package,
  Phone,
  RefreshCw,
  Search,
  Sparkles,
  TrendingUp,
  User,
  X,
} from 'lucide-react';
import { VendorLayout } from '@/vendor/components';
import { useAuth } from '@/context/AuthContext';
import { apiRequest } from '@/utils/api';

const filters = ['all', 'new', 'contacted', 'booked'];
const emptyStats = { total: 0, new: 0, contacted: 0, booked: 0 };

const statusColors = {
  new: 'border-gold-500/35 bg-gold-500/15 text-gold-900 dark:text-gold-300',
  contacted: 'border-blue-500/35 bg-blue-500/15 text-blue-900 dark:text-blue-300',
  booked: 'border-emerald-500/35 bg-emerald-500/15 text-emerald-900 dark:text-emerald-300',
};

const dateFormat = { day: 'numeric', month: 'short', year: 'numeric' };

function VendorInquiries() {
  const { session } = useAuth();
  const [filter, setFilter] = useState('all');
  const [inquiries, setInquiries] = useState([]);
  const [stats, setStats] = useState(emptyStats);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState('');
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInquiry, setSelectedInquiry] = useState(null);

  const loadInquiries = useCallback(async () => {
    if (!session?.token) return;
    setLoading(true);
    setError('');
    try {
      const query = filter === 'all' ? '' : `?status=${filter}`;
      const data = await apiRequest(`/vendor/inquiries${query}`, { token: session.token });
      setInquiries(data.inquiries || []);
      setStats(data.stats || emptyStats);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to load inquiries.');
    } finally {
      setLoading(false);
    }
  }, [filter, session?.token]);

  useEffect(() => { loadInquiries(); }, [loadInquiries]);

  const updateStatus = async (id, status) => {
    setUpdatingId(id);
    setError('');
    try {
      await apiRequest(`/vendor/inquiries/${id}/status`, {
        method: 'PATCH',
        token: session.token,
        body: JSON.stringify({ status }),
      });
      await loadInquiries();
      if (selectedInquiry?._id === id) {
        setSelectedInquiry((curr) => (curr ? { ...curr, status } : null));
      }
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to update inquiry.');
    } finally {
      setUpdatingId('');
    }
  };

  const filteredInquiries = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return inquiries;
    return inquiries.filter(
      (inq) =>
        inq.name?.toLowerCase().includes(q) ||
        inq.email?.toLowerCase().includes(q) ||
        inq.phone?.toLowerCase().includes(q) ||
        inq.eventType?.toLowerCase().includes(q) ||
        inq.eventLocation?.toLowerCase().includes(q)
    );
  }, [inquiries, searchQuery]);

  return (
    <VendorLayout title="Client Inquiries Desk">
      {/* Top Banner Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-3 py-1 rounded-full bg-gold-400/10 border border-gold-400/25 text-gold-700 dark:text-gold-300 text-[10px] uppercase font-mono tracking-widest font-bold flex items-center gap-1.5 shadow-2xs">
              <Sparkles className="w-3 h-3 text-gold-600 dark:text-gold-400" />
              Lead Conversion Pipeline
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-ink-50 font-normal tracking-tight">Studio Inquiries Desk</h2>
          <p className="text-xs sm:text-sm text-ink-500 dark:text-ink-400 mt-1 max-w-2xl font-medium">
            Manage inbound client leads, event dates, budgets, and direct communication stages.
          </p>
        </div>

        <button
          type="button"
          onClick={loadInquiries}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-full border border-black/15 dark:border-white/15 px-4 py-2 text-xs font-semibold bg-white/80 dark:bg-black/30 text-ink-700 dark:text-ink-300 hover:border-gold-500/40 hover:text-gold-700 dark:hover:text-gold-300 transition-all shadow-xs disabled:opacity-50 cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh Feed
        </button>
      </div>

      {error && (
        <div role="alert" className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-red-500/20 bg-red-500/5 p-4 text-xs font-semibold text-red-600 dark:text-red-300 shadow-xs">
          <span>{error}</span>
          <button type="button" onClick={loadInquiries} className="underline underline-offset-4 cursor-pointer">Try again</button>
        </div>
      )}

      {/* 4 Glassy Stat Cards */}
      <div className="mb-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {[
          ['All Inquiries', stats.total, 'Total leads received'],
          ['New Leads', stats.new, 'Requires response'],
          ['Contacted', stats.contacted, 'In active discussion'],
          ['Booked Shoots', stats.booked, 'Locked wedding clients'],
        ].map(([label, value, subtext], idx) => (
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
                {subtext}
              </span>
            </div>
            <div className="relative z-10">
              <p className="font-serif text-3xl sm:text-4xl text-ink-50 font-normal tracking-tight group-hover:text-gold-700 dark:group-hover:text-gold-300 transition-colors tabular-nums">
                {value}
              </p>
              <p className="mt-1 text-[10px] uppercase font-mono font-bold tracking-widest text-ink-500 dark:text-ink-400">
                {label}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Filter Tabs and Instant Search */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2" aria-label="Filter inquiries by status">
          {filters.map((value) => {
            const count = value === 'all' ? stats.total : stats[value] || 0;
            return (
              <button
                key={value}
                type="button"
                onClick={() => setFilter(value)}
                className={`rounded-full px-5 py-2 text-xs font-mono uppercase tracking-widest font-bold transition-all cursor-pointer shadow-2xs flex items-center gap-2 ${
                  filter === value
                    ? 'bg-gold-500/15 dark:bg-white/15 border border-gold-500/35 dark:border-white/20 text-gold-900 dark:text-gold-300 shadow-xs'
                    : 'bg-black/[0.03] dark:bg-white/5 border border-black/10 dark:border-white/10 text-ink-700 dark:text-ink-300 hover:text-ink-950 dark:hover:text-white hover:bg-black/[0.06] dark:hover:bg-white/10'
                }`}
              >
                <span>{value}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${filter === value ? 'bg-gold-500/30 text-gold-900 dark:text-gold-200' : 'bg-black/5 dark:bg-white/10 text-ink-500'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="relative min-w-[280px]">
          <Search className="w-4 h-4 text-ink-500 dark:text-ink-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search client, email, phone, venue…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-full border border-black/15 dark:border-white/15 bg-white/90 dark:bg-black/40 pl-10 pr-4 py-2 text-xs text-ink-50 placeholder:text-ink-400 focus:outline-none focus:border-gold-500/60 shadow-inner"
          />
        </div>
      </div>

      {/* Inquiries Glassy Table Container */}
      <div className="overflow-x-auto rounded-[28px] border border-black/10 dark:border-white/15 bg-white/90 dark:bg-black/45 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.06)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        <table className="w-full min-w-[950px]">
          <thead>
            <tr className="border-b border-black/10 dark:border-white/10 bg-black/[0.03] dark:bg-white/[0.03] text-left text-[10px] uppercase font-mono font-bold tracking-widest text-ink-500 dark:text-ink-400">
              <th className="px-6 py-4">Client Contact</th>
              <th className="px-6 py-4">Event Details</th>
              <th className="px-6 py-4">Requirements & Budget</th>
              <th className="px-6 py-4">Date Received</th>
              <th className="px-6 py-4">Status Stage</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5 dark:divide-white/5">
            {filteredInquiries.map((inquiry) => (
              <tr
                key={inquiry._id}
                className="align-top hover:bg-black/[0.02] dark:hover:bg-white/[0.03] transition-colors text-xs"
              >
                <td className="px-6 py-4.5">
                  <p className="font-semibold text-sm text-ink-50">{inquiry.name}</p>
                  <a className="mt-1 block text-ink-500 hover:text-gold-700 dark:hover:text-gold-300 font-medium transition-colors" href={`mailto:${inquiry.email}`}>
                    {inquiry.email}
                  </a>
                  {inquiry.phone && (
                    <a className="mt-0.5 block text-ink-500 font-mono hover:text-gold-700 dark:hover:text-gold-300 transition-colors" href={`tel:${inquiry.phone}`}>
                      {inquiry.phone}
                    </a>
                  )}
                </td>
                <td className="px-6 py-4.5 text-ink-100">
                  <p className="font-semibold text-ink-50">{inquiry.eventType || 'Wedding'}</p>
                  {inquiry.eventDate && (
                    <p className="mt-1 font-mono text-ink-500 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-gold-600 dark:text-gold-400" />
                      {new Date(inquiry.eventDate).toLocaleDateString('en-IN', dateFormat)}
                    </p>
                  )}
                  {inquiry.eventLocation && (
                    <p className="mt-0.5 text-ink-500 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-gold-600 dark:text-gold-400" />
                      {inquiry.eventLocation}
                    </p>
                  )}
                </td>
                <td className="max-w-xs px-6 py-4.5 text-ink-600 dark:text-ink-400">
                  {inquiry.packageName && (
                    <span className="inline-block mb-1.5 px-2.5 py-0.5 rounded-full bg-gold-500/10 text-gold-800 dark:text-gold-300 border border-gold-500/25 font-mono text-[10px] font-bold">
                      {inquiry.packageName}
                    </span>
                  )}
                  {inquiry.budget && (
                    <p className="mb-1 text-gold-700 dark:text-gold-400 font-mono text-[11px] font-semibold">
                      Budget: {inquiry.budget.replaceAll('-', ' ')}
                    </p>
                  )}
                  <p className="line-clamp-2 leading-relaxed">{inquiry.message || 'No additional note provided.'}</p>
                </td>
                <td className="whitespace-nowrap px-6 py-4.5 text-ink-500 dark:text-ink-400 font-mono">
                  {new Date(inquiry.createdAt).toLocaleDateString('en-IN', dateFormat)}
                </td>
                <td className="px-6 py-4.5">
                  <select
                    aria-label={`Update ${inquiry.name}'s status`}
                    value={inquiry.status || 'new'}
                    disabled={updatingId === inquiry._id}
                    onChange={(e) => updateStatus(inquiry._id, e.target.value)}
                    className="rounded-full border border-black/15 dark:border-white/15 bg-white dark:bg-black/60 px-3.5 py-1.5 text-xs text-ink-50 font-semibold focus:border-gold-500 focus:outline-none shadow-2xs disabled:opacity-50 cursor-pointer"
                  >
                    <option value="new">NEW LEAD</option>
                    <option value="contacted">CONTACTED</option>
                    <option value="booked">BOOKED</option>
                  </select>
                </td>
                <td className="px-6 py-4.5 text-right">
                  <button
                    type="button"
                    onClick={() => setSelectedInquiry(inquiry)}
                    className="p-2 rounded-full border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/5 text-ink-600 dark:text-ink-400 hover:text-gold-700 dark:hover:text-gold-300 hover:border-gold-500/30 transition-all cursor-pointer"
                    title="View Full Details"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}

            {!loading && filteredInquiries.length === 0 && (
              <tr>
                <td colSpan="6" className="px-6 py-20 text-center">
                  <Mail className="mx-auto mb-3 h-9 w-9 text-ink-400 opacity-60" />
                  <p className="text-sm font-semibold text-ink-50">
                    No inquiries found {filter === 'all' ? '' : `with status "${filter}"`}.
                  </p>
                  <p className="mt-1 text-xs text-ink-500 font-medium">
                    New inquiries submitted by couples on your public catalog will appear here immediately.
                  </p>
                </td>
              </tr>
            )}

            {loading && (
              <tr>
                <td colSpan="6" className="px-6 py-20 text-center text-xs font-mono font-semibold text-ink-500 animate-pulse">
                  Loading inquiries feed…
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Inquiry Detail Lightbox Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-950/70 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-lg rounded-[28px] border border-black/15 dark:border-white/20 bg-white/95 dark:bg-zinc-950/90 backdrop-blur-2xl p-6 sm:p-8 shadow-2xl animate-scale-in">
            <div className="flex items-start justify-between border-b border-black/10 dark:border-white/10 pb-4 mb-5">
              <div>
                <h3 className="font-serif text-2xl text-ink-50 font-normal">{selectedInquiry.name}</h3>
                <p className="text-xs text-gold-700 dark:text-gold-300 font-medium mt-0.5">
                  {selectedInquiry.eventType || 'Wedding Shoot'} · Received {new Date(selectedInquiry.createdAt).toLocaleDateString('en-IN', dateFormat)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedInquiry(null)}
                className="w-8 h-8 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center text-ink-500 hover:text-ink-950 dark:hover:text-white cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/5 dark:border-white/5">
                  <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-ink-500 block mb-1">Email Address</span>
                  <a href={`mailto:${selectedInquiry.email}`} className="text-gold-700 dark:text-gold-300 font-medium hover:underline break-all">
                    {selectedInquiry.email}
                  </a>
                </div>
                <div className="p-3.5 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/5 dark:border-white/5">
                  <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-ink-500 block mb-1">Phone Number</span>
                  <a href={`tel:${selectedInquiry.phone}`} className="text-gold-700 dark:text-gold-300 font-mono font-medium hover:underline">
                    {selectedInquiry.phone || 'Not provided'}
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/5 dark:border-white/5">
                  <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-ink-500 block mb-1">Target Date</span>
                  <p className="text-ink-100 font-medium font-mono">
                    {selectedInquiry.eventDate ? new Date(selectedInquiry.eventDate).toLocaleDateString('en-IN', dateFormat) : 'Flexible / TBD'}
                  </p>
                </div>
                <div className="p-3.5 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/5 dark:border-white/5">
                  <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-ink-500 block mb-1">Target Budget</span>
                  <p className="text-ink-100 font-medium font-mono">
                    {selectedInquiry.budget ? selectedInquiry.budget.replaceAll('-', ' ') : 'Standard'}
                  </p>
                </div>
              </div>

              {selectedInquiry.packageName && (
                <div className="p-3.5 rounded-2xl bg-gold-500/10 border border-gold-500/25 text-xs">
                  <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-gold-700 dark:text-gold-300 block mb-0.5">Interested Package</span>
                  <p className="text-gold-900 dark:text-gold-200 font-semibold">{selectedInquiry.packageName}</p>
                </div>
              )}

              <div className="p-4 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/5 dark:border-white/5 text-xs">
                <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-ink-500 block mb-1">Client Message</span>
                <p className="text-ink-100 whitespace-pre-wrap leading-relaxed font-medium">
                  {selectedInquiry.message || 'No specific notes included with inquiry.'}
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-black/10 dark:border-white/10">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-ink-500">Status:</span>
                  <select
                    value={selectedInquiry.status || 'new'}
                    disabled={updatingId === selectedInquiry._id}
                    onChange={(e) => updateStatus(selectedInquiry._id, e.target.value)}
                    className="rounded-full border border-black/15 dark:border-white/15 bg-white dark:bg-black/60 px-3.5 py-1 text-xs text-ink-50 font-semibold focus:outline-none focus:border-gold-500 cursor-pointer shadow-2xs"
                  >
                    <option value="new">NEW LEAD</option>
                    <option value="contacted">CONTACTED</option>
                    <option value="booked">BOOKED</option>
                  </select>
                </div>
                <a
                  href={`mailto:${selectedInquiry.email}?subject=Regarding your wedding inquiry with SVML`}
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-gradient-to-r from-gold-500 to-gold-400 text-ink-950 font-bold text-xs uppercase tracking-wider hover:brightness-110 shadow-lg shadow-gold-500/25 transition-all"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Reply Email</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </VendorLayout>
  );
}

export default VendorInquiries;
