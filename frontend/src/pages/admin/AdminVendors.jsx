import { useCallback, useEffect, useMemo, useState } from 'react';
import { RefreshCw, Users } from 'lucide-react';
import DashboardLayout from '@/components/common/DashboardLayout';
import { adminNavItems } from '@/data/navConfig';
import { useAuth } from '@/context/AuthContext';
import { apiRequest } from '@/utils/api';

const filters = ['all', 'pending', 'approved', 'suspended'];
const statusColors = {
  approved: 'border-green-400/20 bg-green-400/10 text-green-400',
  pending: 'border-gold-400/20 bg-gold-400/10 text-gold-300',
  suspended: 'border-red-400/20 bg-red-400/10 text-red-300',
};

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

  return <DashboardLayout navItems={adminNavItems} title="Vendor Management" role="admin">
    <div className="mb-8 flex items-start justify-between gap-4">
      <div>
        <h2 className="font-serif text-3xl text-ink-50 mb-1">Vendor Management</h2>
        <p className="text-sm text-ink-400">Review registrations and manage vendor account access.</p>
      </div>
      <button
        type="button"
        onClick={loadVendors}
        disabled={loading}
        className="inline-flex items-center gap-2 rounded-sm border border-white/10 px-3 py-2 text-xs text-ink-300 hover:border-gold-400/40 hover:text-gold-300 disabled:opacity-50"
      >
        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
      </button>
    </div>

    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap gap-2" aria-label="Filter vendors by status">
        {filters.map((value) => <button
          key={value}
          type="button"
          onClick={() => setFilter(value)}
          aria-pressed={filter === value}
          className={`rounded-sm border px-3 py-2 text-[10px] uppercase tracking-widest transition-colors ${filter === value ? 'border-gold-400/40 bg-gold-400/10 text-gold-300' : 'border-white/5 text-ink-400 hover:text-ink-100'}`}
        >{value} <span className="ml-1">{value === 'all' ? vendors.length : vendors.filter((vendor) => vendor.status === value).length}</span></button>)}
      </div>
      <span className="text-xs text-ink-500">Showing up to 200 vendors</span>
    </div>

    {error && <p role="alert" className="mb-4 rounded-sm border border-red-400/20 bg-red-400/5 p-4 text-sm text-red-300">{error}</p>}

    <div className="overflow-x-auto rounded-sm border border-white/5 bg-ink-800">
      <table className="w-full min-w-[800px]">
        <thead><tr className="border-b border-white/5 text-left text-[10px] uppercase tracking-widest text-ink-500">
          <th className="px-5 py-4 font-normal">Studio / Owner</th>
          <th className="px-5 py-4 font-normal">Contact</th>
          <th className="px-5 py-4 font-normal">Location</th>
          <th className="px-5 py-4 font-normal">Registered</th>
          <th className="px-5 py-4 font-normal">Status</th>
          <th className="px-5 py-4 font-normal">Action</th>
        </tr></thead>
        <tbody>
          {visibleVendors.map((vendor) => <tr key={vendor._id} className="border-b border-white/5 last:border-0 align-middle">
            <td className="px-5 py-4">
              <p className="text-sm text-ink-100">{vendor.studioName || vendor.fullName}</p>
              <p className="mt-1 text-xs text-ink-500">{vendor.fullName}</p>
            </td>
            <td className="px-5 py-4">
              <a className="text-xs text-ink-300 hover:text-gold-300" href={`mailto:${vendor.email}`}>{vendor.email}</a>
              {vendor.phone && <a className="mt-1 block text-xs text-ink-500 hover:text-gold-300" href={`tel:${vendor.phone}`}>{vendor.phone}</a>}
            </td>
            <td className="px-5 py-4 text-xs text-ink-400">{[vendor.city, vendor.state].filter(Boolean).join(', ') || '—'}</td>
            <td className="whitespace-nowrap px-5 py-4 text-xs text-ink-400">{new Date(vendor.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
            <td className="px-5 py-4"><span className={`rounded-full border px-3 py-1.5 text-[10px] uppercase tracking-widest ${statusColors[vendor.status] || ''}`}>{vendor.status}</span></td>
            <td className="px-5 py-4">
              {vendor.status === 'pending' ? <div className="flex gap-2">
                <button type="button" disabled={updatingId === vendor._id} onClick={() => updateStatus(vendor._id, 'approved')} className="rounded-sm bg-gold-400 px-3 py-2 text-[10px] font-medium uppercase tracking-widest text-ink-950 hover:bg-gold-300 disabled:opacity-50">Approve</button>
                <button type="button" disabled={updatingId === vendor._id} onClick={() => updateStatus(vendor._id, 'suspended')} className="rounded-sm border border-white/10 px-3 py-2 text-[10px] uppercase tracking-widest text-ink-300 hover:border-red-400/40 hover:text-red-300 disabled:opacity-50">Suspend</button>
              </div> : <select
                aria-label={`Change ${vendor.studioName || vendor.fullName} status`}
                value={vendor.status}
                disabled={updatingId === vendor._id}
                onChange={(event) => updateStatus(vendor._id, event.target.value)}
                className="rounded-sm border border-white/10 bg-ink-900 px-2 py-2 text-xs text-ink-100 focus:border-gold-400 focus:outline-none disabled:opacity-50"
              >
                <option value="approved">approved</option>
                <option value="pending">pending</option>
                <option value="suspended">suspended</option>
              </select>}
            </td>
          </tr>)}
          {!loading && visibleVendors.length === 0 && <tr>
            <td colSpan="6" className="px-5 py-16 text-center">
              <Users className="mx-auto mb-3 h-8 w-8 text-ink-500" />
              <p className="text-sm text-ink-300">No vendors {filter === 'all' ? 'registered yet' : `with status “${filter}”`}.</p>
            </td>
          </tr>}
          {loading && <tr><td colSpan="6" className="px-5 py-16 text-center text-sm text-ink-500">Loading vendors…</td></tr>}
        </tbody>
      </table>
    </div>
  </DashboardLayout>;
}

export default AdminVendors;
