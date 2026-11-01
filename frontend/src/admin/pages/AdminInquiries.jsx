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

  return <AdminLayout title="Client Inquiries">
    <div className="mb-8 flex items-start justify-between gap-4">
      <div>
        <h2 className="font-serif text-3xl text-ink-50 mb-1">Client Inquiries</h2>
        <p className="text-sm text-ink-400">Review messages submitted through the contact form.</p>
      </div>
      <button
        type="button"
        onClick={loadInquiries}
        disabled={loading}
        className="inline-flex items-center gap-2 rounded-sm border border-white/10 px-3 py-2 text-xs text-ink-300 hover:border-gold-400/40 hover:text-gold-300 disabled:opacity-50"
      >
        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
      </button>
    </div>

    <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
      {[
        ['All inquiries', stats.total],
        ['New', stats.new],
        ['Contacted', stats.contacted],
        ['Booked', stats.booked],
      ].map(([label, value]) => <div key={label} className="rounded-sm border border-white/5 bg-ink-800 p-4">
        <p className="font-sans font-bold text-2xl text-ink-50 tabular-nums">{value.toLocaleString('en-IN')}</p>
        <p className="mt-1 text-[10px] uppercase tracking-widest text-ink-400">{label}</p>
      </div>)}
    </div>

    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap gap-2" aria-label="Filter inquiries by status">
        {filters.map((value) => <button
          key={value}
          type="button"
          onClick={() => setFilter(value)}
          aria-pressed={filter === value}
          className={`rounded-sm border px-3 py-2 text-[10px] uppercase tracking-widest transition-colors ${filter === value ? 'border-gold-400/40 bg-gold-400/10 text-gold-300' : 'border-white/5 text-ink-400 hover:text-ink-100'}`}
        >{value}</button>)}
      </div>
      <span className="text-xs text-ink-500">Showing up to 200 inquiries</span>
    </div>

    {error && <p role="alert" className="mb-4 rounded-sm border border-red-400/20 bg-red-400/5 p-4 text-sm text-red-300">{error}</p>}

    <div className="overflow-x-auto rounded-sm border border-white/5 bg-ink-800">
      <table className="w-full min-w-[1050px]">
        <thead><tr className="border-b border-white/5 text-left text-[10px] uppercase tracking-widest text-ink-500">
          <th className="px-5 py-4 font-normal">Client</th>
          <th className="px-5 py-4 font-normal">Event</th>
          <th className="px-5 py-4 font-normal">Details</th>
          <th className="px-5 py-4 font-normal">Received</th>
          <th className="px-5 py-4 font-normal">Status</th>
          <th className="px-5 py-4 font-normal">Assigned studio</th>
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
              {inquiry.eventDate && <p className="mt-1 text-xs text-ink-500">{new Date(inquiry.eventDate).toLocaleDateString('en-IN')}</p>}
              {inquiry.eventLocation && <p className="mt-1 text-xs text-ink-500">{inquiry.eventLocation}</p>}
            </td>
            <td className="max-w-xs px-5 py-4 text-xs text-ink-400">
              {inquiry.budget && <p className="mb-1 text-ink-300">Budget: {inquiry.budget.replaceAll('-', ' ')}</p>}
              <p className="whitespace-pre-wrap">{inquiry.message || 'No message provided.'}</p>
            </td>
            <td className="whitespace-nowrap px-5 py-4 text-xs text-ink-400">{new Date(inquiry.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
            <td className="px-5 py-4">
              <select
                aria-label={`Update ${inquiry.name}'s inquiry status`}
                value={inquiry.status}
                disabled={updatingId === inquiry._id}
                onChange={(event) => updateStatus(inquiry._id, event.target.value)}
                className="rounded-sm border border-white/10 bg-ink-900 px-2 py-2 text-xs text-ink-100 focus:border-gold-400 focus:outline-none disabled:opacity-50"
              >
                {['new', 'contacted', 'booked'].map((status) => <option key={status} value={status}>{status}</option>)}
              </select>
            </td>
            <td className="px-5 py-4">
              <select
                aria-label={`Assign ${inquiry.name}'s inquiry to a studio`}
                value={inquiry.vendorId?._id || ''}
                disabled={updatingId === inquiry._id}
                onChange={(event) => assignVendor(inquiry._id, event.target.value)}
                className="max-w-48 rounded-sm border border-white/10 bg-ink-900 px-2 py-2 text-xs text-ink-100 focus:border-gold-400 focus:outline-none disabled:opacity-50"
              >
                <option value="">Unassigned</option>
                {vendors.map((vendor) => <option key={vendor._id} value={vendor._id}>{vendor.studioName || vendor.fullName}</option>)}
              </select>
            </td>
          </tr>)}
          {!loading && inquiries.length === 0 && <tr>
            <td colSpan="6" className="px-5 py-16 text-center">
              <Mail className="mx-auto mb-3 h-8 w-8 text-ink-500" />
              <p className="text-sm text-ink-300">No inquiries {filter === 'all' ? 'yet' : `with status “${filter}”`}.</p>
            </td>
          </tr>}
          {loading && <tr><td colSpan="5" className="px-5 py-16 text-center text-sm text-ink-500">Loading inquiries…</td></tr>}
        </tbody>
      </table>
    </div>
  </AdminLayout>;
}

export default AdminInquiries;
