import { useCallback, useEffect, useState } from 'react';
import { Mail, RefreshCw } from 'lucide-react';
import DashboardLayout from '@/components/common/DashboardLayout';
import { vendorNavItems } from '@/data/navConfig';
import { useAuth } from '@/context/AuthContext';
import { apiRequest } from '@/utils/api';

const filters = ['all', 'new', 'contacted', 'booked'];
const emptyStats = { total: 0, new: 0, contacted: 0, booked: 0 };
const statusColors = {
  new: 'border-gold-400/20 bg-gold-400/10 text-gold-300',
  contacted: 'border-blue-400/20 bg-blue-400/10 text-blue-300',
  booked: 'border-green-400/20 bg-green-400/10 text-green-300',
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
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to update inquiry.');
    } finally {
      setUpdatingId('');
    }
  };

  return <DashboardLayout navItems={vendorNavItems} title="Client Inquiries" role="vendor">
    <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h2 className="mb-1 font-serif text-3xl text-ink-50">Client Inquiries</h2>
        <p className="text-sm text-ink-400">Review client requests and update their booking status.</p>
      </div>
      <button type="button" onClick={loadInquiries} disabled={loading} className="inline-flex items-center gap-2 rounded-sm border border-white/10 px-3 py-2 text-xs text-ink-300 hover:border-gold-400/40 hover:text-gold-300 disabled:opacity-50">
        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
      </button>
    </div>

    {error && <p role="alert" className="mb-5 rounded-sm border border-red-400/20 bg-red-400/5 p-4 text-sm text-red-300">{error}</p>}

    <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
      {[
        ['All inquiries', stats.total],
        ['New', stats.new],
        ['Contacted', stats.contacted],
        ['Booked', stats.booked],
      ].map(([label, value]) => <div key={label} className="rounded-sm border border-white/5 bg-ink-800 p-4">
        <p className="font-serif text-2xl text-ink-50">{loading ? '—' : Number(value || 0).toLocaleString('en-IN')}</p>
        <p className="mt-1 text-[10px] uppercase tracking-widest text-ink-400">{label}</p>
      </div>)}
    </div>

    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap gap-2" aria-label="Filter inquiries by status">
        {filters.map((value) => <button key={value} type="button" onClick={() => setFilter(value)} aria-pressed={filter === value} className={`rounded-sm border px-3 py-2 text-[10px] uppercase tracking-widest transition-colors ${filter === value ? 'border-gold-400/40 bg-gold-400/10 text-gold-300' : 'border-white/5 text-ink-400 hover:text-ink-100'}`}>
          {value} {value === 'all' ? stats.total : stats[value]}
        </button>)}
      </div>
      <span className="text-xs text-ink-500">Showing up to 200 inquiries</span>
    </div>

    <div className="overflow-x-auto rounded-sm border border-white/5 bg-ink-800">
      <table className="w-full min-w-[900px]">
        <thead><tr className="border-b border-white/5 text-left text-[10px] uppercase tracking-widest text-ink-500">
          <th className="px-5 py-4 font-normal">Client</th>
          <th className="px-5 py-4 font-normal">Event</th>
          <th className="px-5 py-4 font-normal">Details</th>
          <th className="px-5 py-4 font-normal">Received</th>
          <th className="px-5 py-4 font-normal">Status</th>
        </tr></thead>
        <tbody>
          {inquiries.map((inquiry) => <tr key={inquiry._id} className="border-b border-white/5 last:border-0 align-top">
            <td className="px-5 py-4">
              <p className="text-sm text-ink-100">{inquiry.name}</p>
              <a className="mt-1 block text-xs text-ink-400 hover:text-gold-300" href={`mailto:${inquiry.email}`}>{inquiry.email}</a>
              <a className="mt-1 block text-xs text-ink-400 hover:text-gold-300" href={`tel:${inquiry.phone}`}>{inquiry.phone}</a>
            </td>
            <td className="px-5 py-4 text-sm text-ink-200">
              <p>{inquiry.eventType}</p>
              {inquiry.eventDate && <p className="mt-1 text-xs text-ink-500">{new Date(inquiry.eventDate).toLocaleDateString('en-IN', dateFormat)}</p>}
              {inquiry.eventLocation && <p className="mt-1 text-xs text-ink-500">{inquiry.eventLocation}</p>}
            </td>
            <td className="max-w-xs px-5 py-4 text-xs text-ink-400">
              {inquiry.packageName && <p className="mb-1 text-gold-300">Package: {inquiry.packageName}</p>}
              {inquiry.budget && <p className="mb-1 text-ink-300">Budget: {inquiry.budget.replaceAll('-', ' ')}</p>}
              <p className="whitespace-pre-wrap">{inquiry.message || 'No message provided.'}</p>
            </td>
            <td className="whitespace-nowrap px-5 py-4 text-xs text-ink-400">{new Date(inquiry.createdAt).toLocaleDateString('en-IN', dateFormat)}</td>
            <td className="px-5 py-4">
              <select aria-label={`Update ${inquiry.name}'s inquiry status`} value={inquiry.status} disabled={updatingId === inquiry._id} onChange={(event) => updateStatus(inquiry._id, event.target.value)} className={`rounded-full border px-3 py-2 text-[10px] uppercase tracking-widest focus:outline-none disabled:opacity-50 ${statusColors[inquiry.status] || statusColors.new} bg-ink-900`}>
                {['new', 'contacted', 'booked'].map((status) => <option key={status} value={status}>{status}</option>)}
              </select>
            </td>
          </tr>)}
          {!loading && inquiries.length === 0 && <tr><td colSpan="5" className="px-5 py-16 text-center">
            <Mail className="mx-auto mb-3 h-8 w-8 text-ink-500" />
            <p className="text-sm text-ink-300">No inquiries {filter === 'all' ? 'yet' : `with status “${filter}”`}.</p>
            <p className="mt-1 text-xs text-ink-500">Package enquiries and requests assigned to your studio will appear here.</p>
          </td></tr>}
          {loading && <tr><td colSpan="5" className="px-5 py-16 text-center text-sm text-ink-500">Loading inquiries…</td></tr>}
        </tbody>
      </table>
    </div>
  </DashboardLayout>;
}

export default VendorInquiries;
