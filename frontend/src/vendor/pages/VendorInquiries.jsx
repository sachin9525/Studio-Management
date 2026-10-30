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
  new: 'border-gold-400/30 bg-gold-400/10 text-gold-300',
  contacted: 'border-blue-400/30 bg-blue-400/10 text-blue-300',
  booked: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-400',
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
    <VendorLayout title="Client Inquiries">
      {/* Top Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded-full bg-gold-400/10 border border-gold-400/20 text-gold-300 text-[10px] uppercase tracking-widest font-semibold flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5 text-gold-400" />
              Direct Leads Funnel
            </span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl text-ink-50 mb-1">Client Inquiries</h2>
          <p className="text-xs sm:text-sm text-ink-400">
            Review incoming booking leads and track client conversation stages.
          </p>
        </div>

        <button
          type="button"
          onClick={loadInquiries}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-sm border border-white/10 px-3 py-1.5 text-xs text-ink-300 transition-colors hover:border-gold-400/40 hover:text-gold-300 disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {error && (
        <div role="alert" className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-sm border border-red-400/20 bg-red-400/5 p-4 text-sm text-red-300">
          <span>{error}</span>
          <button type="button" onClick={loadInquiries} className="underline underline-offset-4">Try again</button>
        </div>
      )}

      {/* Symmetrical Metric Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-3.5 mb-8">
        <div className="p-3.5 sm:p-4 rounded-sm bg-ink-900/80 border border-white/5 backdrop-blur-md">
          <span className="text-[10px] uppercase tracking-wider text-ink-500 block mb-1 font-medium">All Inquiries</span>
          <p className="font-serif text-2xl sm:text-3xl text-ink-50 leading-none">{stats.total}</p>
          <p className="text-[10px] text-emerald-400 mt-1 font-medium">Total leads received</p>
        </div>
        <div className="p-3.5 sm:p-4 rounded-sm bg-gradient-to-br from-gold-400/15 via-ink-900/90 to-ink-900 border border-gold-400/30 backdrop-blur-md">
          <span className="text-[10px] uppercase tracking-wider text-gold-400 block mb-1 font-semibold">New Leads</span>
          <p className="font-serif text-2xl sm:text-3xl text-gold-300 leading-none">{stats.new}</p>
          <p className="text-[10px] text-gold-400/80 mt-1 font-medium">Requires initial response</p>
        </div>
        <div className="p-3.5 sm:p-4 rounded-sm bg-ink-900/80 border border-white/5 backdrop-blur-md">
          <span className="text-[10px] uppercase tracking-wider text-ink-500 block mb-1 font-medium">Contacted</span>
          <p className="font-serif text-2xl sm:text-3xl text-blue-400 leading-none">{stats.contacted}</p>
          <p className="text-[10px] text-ink-500 mt-1">In active discussion</p>
        </div>
        <div className="p-3.5 sm:p-4 rounded-sm bg-ink-900/80 border border-white/5 backdrop-blur-md">
          <span className="text-[10px] uppercase tracking-wider text-ink-500 block mb-1 font-medium">Booked</span>
          <p className="font-serif text-2xl sm:text-3xl text-emerald-400 leading-none">{stats.booked}</p>
          <p className="text-[10px] text-emerald-400/80 mt-1 font-medium">Locked wedding clients</p>
        </div>
      </div>

      {/* Filter Tabs and Instant Search */}
      <div className="p-3 sm:p-4 rounded-sm bg-ink-900/80 border border-white/5 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-3 backdrop-blur-md">
        <div className="flex flex-wrap items-center gap-1.5" aria-label="Filter inquiries by status">
          {filters.map((value) => {
            const count = value === 'all' ? stats.total : stats[value] || 0;
            return (
              <button
                key={value}
                type="button"
                onClick={() => setFilter(value)}
                className={`px-3 py-1.5 rounded-sm text-xs uppercase tracking-wider font-medium transition-all capitalize flex items-center gap-1.5 ${
                  filter === value
                    ? 'bg-gold-400 text-ink-950 shadow-md shadow-gold-400/20 font-semibold'
                    : 'text-ink-400 hover:text-ink-100 hover:bg-white/5'
                }`}
              >
                <span>{value}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${filter === value ? 'bg-ink-950/20 text-ink-950 font-bold' : 'bg-white/10 text-ink-400'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-ink-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search client, email, phone, venue…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 rounded-sm bg-ink-950/70 border border-white/10 text-xs text-ink-100 focus:border-gold-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Inquiries Table */}
      <div className="overflow-x-auto rounded-sm border border-white/5 bg-ink-900/80 backdrop-blur-md shadow-xl">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="border-b border-white/5 text-left text-[10px] uppercase tracking-widest text-ink-500 bg-ink-950/30">
              <th className="px-5 py-3.5 font-medium">Client Contact</th>
              <th className="px-5 py-3.5 font-medium">Event Details</th>
              <th className="px-5 py-3.5 font-medium">Requirements & Budget</th>
              <th className="px-5 py-3.5 font-medium">Date Received</th>
              <th className="px-5 py-3.5 font-medium">Status Stage</th>
              <th className="px-5 py-3.5 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredInquiries.map((inquiry) => (
              <tr
                key={inquiry._id}
                className="align-top hover:bg-white/[0.02] transition-colors"
              >
                <td className="px-5 py-4">
                  <p className="text-sm font-medium text-ink-100">{inquiry.name}</p>
                  <a className="mt-0.5 block text-xs text-ink-400 hover:text-gold-300" href={`mailto:${inquiry.email}`}>
                    {inquiry.email}
                  </a>
                  {inquiry.phone && (
                    <a className="mt-0.5 block text-xs text-ink-400 hover:text-gold-300" href={`tel:${inquiry.phone}`}>
                      {inquiry.phone}
                    </a>
                  )}
                </td>
                <td className="px-5 py-4 text-xs text-ink-200">
                  <p className="font-medium text-ink-100 text-sm">{inquiry.eventType || 'Wedding'}</p>
                  {inquiry.eventDate && (
                    <p className="mt-1 text-ink-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-gold-400" />
                      {new Date(inquiry.eventDate).toLocaleDateString('en-IN', dateFormat)}
                    </p>
                  )}
                  {inquiry.eventLocation && (
                    <p className="mt-0.5 text-ink-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-gold-400" />
                      {inquiry.eventLocation}
                    </p>
                  )}
                </td>
                <td className="max-w-xs px-5 py-4 text-xs text-ink-400">
                  {inquiry.packageName && (
                    <p className="mb-1 text-gold-300 font-medium flex items-center gap-1">
                      <Package className="w-3 h-3" />
                      {inquiry.packageName}
                    </p>
                  )}
                  {inquiry.budget && (
                    <p className="mb-1 text-ink-300 font-medium">
                      Budget: {inquiry.budget.replaceAll('-', ' ')}
                    </p>
                  )}
                  <p className="line-clamp-2 text-ink-400">{inquiry.message || 'No additional note provided.'}</p>
                </td>
                <td className="whitespace-nowrap px-5 py-4 text-xs text-ink-400">
                  {new Date(inquiry.createdAt).toLocaleDateString('en-IN', dateFormat)}
                </td>
                <td className="px-5 py-4">
                  <select
                    aria-label={`Update ${inquiry.name}'s status`}
                    value={inquiry.status || 'new'}
                    disabled={updatingId === inquiry._id}
                    onChange={(e) => updateStatus(inquiry._id, e.target.value)}
                    className={`rounded-full border px-3 py-1 text-[10px] uppercase tracking-wider font-semibold focus:outline-none disabled:opacity-50 ${
                      statusColors[inquiry.status] || statusColors.new
                    } bg-ink-950 cursor-pointer`}
                  >
                    <option value="new">New Lead</option>
                    <option value="contacted">Contacted</option>
                    <option value="booked">Booked</option>
                  </select>
                </td>
                <td className="px-5 py-4 text-right">
                  <button
                    type="button"
                    onClick={() => setSelectedInquiry(inquiry)}
                    className="inline-flex items-center gap-1 text-xs text-ink-400 hover:text-gold-300 transition-colors p-1"
                    title="View Full Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}

            {!loading && filteredInquiries.length === 0 && (
              <tr>
                <td colSpan="6" className="px-5 py-16 text-center">
                  <Mail className="mx-auto mb-3 h-8 w-8 text-ink-500" />
                  <p className="text-sm text-ink-300 font-medium">
                    No inquiries found {filter === 'all' ? '' : `with status "${filter}"`}.
                  </p>
                  <p className="mt-1 text-xs text-ink-500">
                    New inquiries submitted by couples on your public catalog will appear here immediately.
                  </p>
                </td>
              </tr>
            )}

            {loading && (
              <tr>
                <td colSpan="6" className="px-5 py-16 text-center text-sm text-ink-500">
                  Loading inquiries…
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Inquiry Detail Lightbox Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-950/85 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-lg rounded-sm border border-gold-400/30 bg-ink-900 p-6 shadow-2xl">
            <div className="flex items-start justify-between border-b border-white/5 pb-4 mb-4">
              <div>
                <h3 className="font-serif text-2xl text-ink-50">{selectedInquiry.name}</h3>
                <p className="text-xs text-gold-300 mt-0.5">
                  {selectedInquiry.eventType || 'Wedding Shoot'} · Received {new Date(selectedInquiry.createdAt).toLocaleDateString('en-IN', dateFormat)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedInquiry(null)}
                className="p-1 rounded-sm text-ink-400 hover:text-ink-100 hover:bg-white/5 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-sm bg-ink-950/60 border border-white/5">
                  <span className="text-[10px] uppercase tracking-wider text-ink-500 block mb-1">Email Address</span>
                  <a href={`mailto:${selectedInquiry.email}`} className="text-gold-300 hover:underline break-all">
                    {selectedInquiry.email}
                  </a>
                </div>
                <div className="p-3 rounded-sm bg-ink-950/60 border border-white/5">
                  <span className="text-[10px] uppercase tracking-wider text-ink-500 block mb-1">Phone Number</span>
                  <a href={`tel:${selectedInquiry.phone}`} className="text-gold-300 hover:underline">
                    {selectedInquiry.phone || 'Not provided'}
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-sm bg-ink-950/60 border border-white/5">
                  <span className="text-[10px] uppercase tracking-wider text-ink-500 block mb-1">Target Date</span>
                  <p className="text-ink-200">
                    {selectedInquiry.eventDate ? new Date(selectedInquiry.eventDate).toLocaleDateString('en-IN', dateFormat) : 'Flexible / TBD'}
                  </p>
                </div>
                <div className="p-3 rounded-sm bg-ink-950/60 border border-white/5">
                  <span className="text-[10px] uppercase tracking-wider text-ink-500 block mb-1">Target Budget</span>
                  <p className="text-ink-200">
                    {selectedInquiry.budget ? selectedInquiry.budget.replaceAll('-', ' ') : 'Standard'}
                  </p>
                </div>
              </div>

              {selectedInquiry.packageName && (
                <div className="p-3 rounded-sm bg-gold-400/10 border border-gold-400/20 text-xs">
                  <span className="text-[10px] uppercase tracking-wider text-gold-400 block mb-0.5 font-semibold">Interested Package</span>
                  <p className="text-gold-200 font-medium">{selectedInquiry.packageName}</p>
                </div>
              )}

              <div className="p-3.5 rounded-sm bg-ink-950/70 border border-white/5 text-xs">
                <span className="text-[10px] uppercase tracking-wider text-ink-500 block mb-1 font-medium">Client Message</span>
                <p className="text-ink-200 whitespace-pre-wrap leading-relaxed">
                  {selectedInquiry.message || 'No specific notes included with inquiry.'}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/5">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-ink-400">Current Status:</span>
                  <select
                    value={selectedInquiry.status || 'new'}
                    disabled={updatingId === selectedInquiry._id}
                    onChange={(e) => updateStatus(selectedInquiry._id, e.target.value)}
                    className={`rounded-full border px-3 py-1 text-[10px] uppercase tracking-wider font-semibold focus:outline-none ${
                      statusColors[selectedInquiry.status] || statusColors.new
                    } bg-ink-950 cursor-pointer`}
                  >
                    <option value="new">New Lead</option>
                    <option value="contacted">Contacted</option>
                    <option value="booked">Booked</option>
                  </select>
                </div>
                <a
                  href={`mailto:${selectedInquiry.email}?subject=Regarding your wedding inquiry with SVML`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-gold-400 text-ink-950 font-medium text-xs uppercase tracking-wider hover:bg-gold-300 transition-colors"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Reply</span>
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
