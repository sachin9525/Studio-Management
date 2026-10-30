import { useCallback, useEffect, useState } from 'react';
import {
  Clock,
  Mail,
  RefreshCw,
  UserCheck,
  Users,
  UserX,
} from 'lucide-react';
import {
  AdminLayout,
  StatCard,
  VendorRegistrationsChart,
  QuickActions,
  RecentVendorsTable,
} from '@/admin/components';
import { useAuth } from '@/context/AuthContext';
import { apiRequest } from '@/utils/api';

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

  return (
    <AdminLayout title="Admin Dashboard">
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

      {error && (
        <div role="alert" className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-sm border border-red-400/20 bg-red-400/5 p-4 text-sm text-red-300">
          <span>{error}</span>
          <button type="button" onClick={loadDashboard} className="underline underline-offset-4">Try again</button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 mb-10 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <StatCard
            key={card.label}
            label={card.label}
            value={!dashboard && (loading || error) ? '—' : (card.value ?? 0).toLocaleString('en-IN')}
            icon={card.icon}
            accent={card.accent}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <VendorRegistrationsChart
          registrations={dashboard?.registrations || []}
          loading={loading}
          error={!!error}
        />
        <QuickActions stats={stats} />
      </div>

      <RecentVendorsTable
        vendors={dashboard?.recentVendors || []}
        loading={loading}
        error={!!error}
      />
    </AdminLayout>
  );
}

export default AdminDashboard;
