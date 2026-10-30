import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowUpRight,
  Briefcase,
  Clock,
  Film,
  Folder,
  LayoutDashboard,
  LayoutGrid,
  Mail,
  Package,
  RefreshCw,
  Settings,
  Star,
  TrendingUp,
  UserCheck,
  Users,
  UserX,
} from 'lucide-react';
import DashboardLayout from '@/components/common/DashboardLayout';
import StatCard from '@/components/common/StatCard';
import { useAuth } from '@/context/AuthContext';
import { apiRequest } from '@/utils/api';

const navItems = [
  { label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" />, path: '/admin/dashboard' },
  { label: 'Vendors', icon: <Users className="w-4 h-4" />, path: '/admin/dashboard/vendors' },
  { label: 'Demo Services', icon: <Briefcase className="w-4 h-4" />, path: '/admin/dashboard/services' },
  { label: 'Demo Portfolio', icon: <LayoutGrid className="w-4 h-4" />, path: '/admin/dashboard/portfolio' },
  { label: 'Demo Albums', icon: <Folder className="w-4 h-4" />, path: '/admin/dashboard/albums' },
  { label: 'Demo Videos', icon: <Film className="w-4 h-4" />, path: '/admin/dashboard/videos' },
  { label: 'Demo Packages', icon: <Package className="w-4 h-4" />, path: '/admin/dashboard/packages' },
  { label: 'Inquiries', icon: <Mail className="w-4 h-4" />, path: '/admin/dashboard/inquiries' },
  { label: 'Testimonials', icon: <Star className="w-4 h-4" />, path: '/admin/dashboard/testimonials' },
  { label: 'Settings', icon: <Settings className="w-4 h-4" />, path: '/admin/dashboard/settings' },
];

const statusColors = {
  approved: 'bg-green-400/10 text-green-400 border-green-400/20',
  pending: 'bg-gold-400/10 text-gold-400 border-gold-400/20',
  suspended: 'bg-red-400/10 text-red-400 border-red-400/20',
};

function AdminDashboard() {
  const { session } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadDashboard = useCallback(async () => {
    if (!session?.token) {
      setError('Admin session not found. Please sign in again.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');
    try {
      setDashboard(await apiRequest('/admin/dashboard', { token: session.token }));
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to load dashboard data.');
    } finally {
      setLoading(false);
    }
  }, [session?.token]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const stats = dashboard?.stats;
  const cards = [
    { label: 'Total Vendors', value: stats?.totalVendors, icon: <Users className="w-5 h-5" />, accent: true },
    { label: 'Active Vendors', value: stats?.activeVendors, icon: <UserCheck className="w-5 h-5" /> },
    { label: 'Pending Approval', value: stats?.pendingVendors, icon: <Clock className="w-5 h-5" /> },
    { label: 'Suspended', value: stats?.suspendedVendors, icon: <UserX className="w-5 h-5" /> },
    { label: 'Total Inquiries', value: stats?.totalInquiries, icon: <Mail className="w-5 h-5" /> },
  ];
  const maxRegistrations = Math.max(1, ...(dashboard?.registrations || []).map(({ count }) => count));

  return <DashboardLayout navItems={navItems} title="Admin Dashboard" role="admin">
    <div className="mb-8 flex items-start justify-between gap-4">
      <div>
        <h2 className="font-serif text-3xl text-ink-50 mb-1">Platform Overview</h2>
        <p className="text-sm text-ink-400">Live vendor activity from your platform.</p>
      </div>
      <button
        type="button"
        onClick={loadDashboard}
        disabled={loading}
        className="inline-flex items-center gap-2 rounded-sm border border-white/10 px-3 py-2 text-xs text-ink-300 transition-colors hover:border-gold-400/40 hover:text-gold-300 disabled:opacity-50"
      >
        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        Refresh
      </button>
    </div>

    {error && <div role="alert" className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-sm border border-red-400/20 bg-red-400/5 p-4 text-sm text-red-300">
      <span>{error}</span>
      <button type="button" onClick={loadDashboard} className="underline underline-offset-4">Try again</button>
    </div>}

    <div className="grid grid-cols-1 gap-5 mb-10 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => <StatCard
        key={card.label}
        label={card.label}
        value={!dashboard && (loading || error) ? '—' : (card.value ?? 0).toLocaleString('en-IN')}
        icon={card.icon}
        accent={card.accent}
      />)}
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <section className="lg:col-span-2 bg-ink-800 rounded-sm p-6 border border-white/5">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-serif text-xl text-ink-50">Vendor Registrations</h3>
            <p className="mt-1 text-xs text-ink-500">Last six months</p>
          </div>
          <TrendingUp className="w-4 h-4 text-gold-400" />
        </div>
        {loading && !dashboard ? <p className="py-16 text-center text-sm text-ink-500">Loading registrations…</p> :
          !dashboard ? <p className="py-16 text-center text-sm text-ink-500">Registration data unavailable.</p> :
          <div className="flex h-48 items-end justify-between gap-3 pt-4">
            {(dashboard?.registrations || []).map((bar) => <div key={bar.month} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
              <span className="text-[10px] text-ink-400">{bar.count}</span>
              <div
                className="w-full min-h-1 rounded-t-sm bg-gradient-to-t from-gold-600 to-gold-400 transition-all"
                style={{ height: `${Math.max(3, (bar.count / maxRegistrations) * 100)}%` }}
                title={`${bar.count} registrations`}
              />
              <span className="text-[10px] uppercase tracking-widest text-ink-500">{bar.month}</span>
            </div>)}
          </div>}
      </section>

      <section className="bg-ink-800 rounded-sm p-6 border border-white/5">
        <h3 className="font-serif text-xl text-ink-50 mb-4">Quick Actions</h3>
        <div className="space-y-3">{[
          { label: 'Review Vendor Requests', to: '/admin/dashboard/vendors', count: stats?.pendingVendors ?? 0 },
          { label: 'Manage Demo Content', to: '/admin/dashboard/portfolio' },
          { label: 'View Inquiries', to: '/admin/dashboard/inquiries', count: stats?.newInquiries ?? 0 },
        ].map((action) => <Link
          key={action.label}
          to={action.to}
          className="flex items-center justify-between p-4 rounded-sm bg-ink-900 border border-white/5 hover:border-gold-400/30 transition-colors group"
        >
          <span className="text-sm text-ink-200 group-hover:text-gold-300 transition-colors">{action.label}</span>
          <div className="flex items-center gap-2">
            {action.count > 0 && <span className="text-[10px] bg-gold-400/10 text-gold-400 px-2 py-1 rounded-full">{action.count}</span>}
            <ArrowUpRight className="w-4 h-4 text-ink-500 group-hover:text-gold-400 transition-colors" />
          </div>
        </Link>)}</div>
      </section>
    </div>

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
      <div className="overflow-x-auto"><table className="w-full">
        <thead><tr className="text-left text-[10px] uppercase tracking-widest text-ink-500 border-b border-white/5">
          <th className="pb-3 font-normal">Studio</th>
          <th className="pb-3 font-normal">City</th>
          <th className="pb-3 font-normal">Joined</th>
          <th className="pb-3 font-normal">Status</th>
        </tr></thead>
        <tbody>
          {(dashboard?.recentVendors || []).map((vendor) => <tr key={vendor._id} className="border-b border-white/5 last:border-0">
            <td className="py-4"><div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gold-400/20 border border-gold-400/30 flex items-center justify-center text-gold-400 font-serif text-xs">
                {(vendor.studioName || vendor.fullName || '?').charAt(0).toUpperCase()}
              </div>
              <span className="text-sm text-ink-100">{vendor.studioName || vendor.fullName}</span>
            </div></td>
            <td className="py-4 text-sm text-ink-400">{vendor.city || '—'}</td>
            <td className="py-4 text-sm text-ink-400">{new Date(vendor.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
            <td className="py-4"><span className={`text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-full border ${statusColors[vendor.status] || ''}`}>{vendor.status}</span></td>
          </tr>)}
          {!loading && !error && dashboard?.recentVendors.length === 0 && <tr>
            <td colSpan="4" className="py-8 text-center text-sm text-ink-500">No vendor registrations yet.</td>
          </tr>}
        </tbody>
      </table></div>
    </section>
  </DashboardLayout>;
}

export default AdminDashboard;
