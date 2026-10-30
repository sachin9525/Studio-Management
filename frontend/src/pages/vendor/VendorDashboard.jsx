import { useCallback, useEffect, useState } from 'react';
import { ArrowUpRight, Briefcase, Calendar, FolderHeart, Images, Mail, RefreshCw, Users, Video } from 'lucide-react';
import { Link } from 'react-router-dom';
import DashboardLayout from '@/components/common/DashboardLayout';
import StatCard from '@/components/common/StatCard';
import { vendorNavItems } from '@/data/navConfig';
import { useAuth } from '@/context/AuthContext';
import { apiRequest } from '@/utils/api';

const emptyDashboard = {
  stats: {
    totalInquiries: 0,
    newInquiries: 0,
    contactedInquiries: 0,
    bookedThisMonth: 0,
    totalProjects: 0,
    publishedProjects: 0,
    totalAlbums: 0,
    publishedAlbums: 0,
    totalVideos: 0,
    totalPackages: 0,
    publishedPackages: 0,
    activeServices: 0,
  },
  recentInquiries: [],
};
const statusColors = {
  new: 'bg-gold-400/10 text-gold-400 border-gold-400/20',
  contacted: 'bg-blue-400/10 text-blue-400 border-blue-400/20',
  booked: 'bg-green-400/10 text-green-400 border-green-400/20',
};
const formatDate = (date) => date
  ? new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  : 'Date not set';

function VendorDashboard() {
  const { profile, session } = useAuth();
  const [dashboard, setDashboard] = useState(emptyDashboard);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadDashboard = useCallback(async () => {
    if (!session?.token) return;
    setLoading(true);
    setError('');
    try {
      setDashboard(await apiRequest('/vendor/dashboard', { token: session.token }));
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to load dashboard.');
    } finally {
      setLoading(false);
    }
  }, [session?.token]);

  useEffect(() => { loadDashboard(); }, [loadDashboard]);

  const vendor = dashboard.vendor || {};
  const studioName = vendor.studioName || profile?.studio_name || 'Your Studio';
  const stats = dashboard.stats || emptyDashboard.stats;
  const cards = [
    ['Portfolio Projects', stats.totalProjects, <FolderHeart className="h-5 w-5" />, true],
    ['Published Projects', stats.publishedProjects, <FolderHeart className="h-5 w-5" />],
    ['Photo Albums', stats.totalAlbums, <Images className="h-5 w-5" />, true],
    ['Published Albums', stats.publishedAlbums, <Images className="h-5 w-5" />],
    ['Videos', stats.totalVideos, <Video className="h-5 w-5" />],
    ['Packages', stats.totalPackages, <Briefcase className="h-5 w-5" />],
    ['Published Packages', stats.publishedPackages, <Briefcase className="h-5 w-5" />],
    ['Active Services', stats.activeServices, <Briefcase className="h-5 w-5" />],
    ['Total Inquiries', stats.totalInquiries, <Mail className="h-5 w-5" />, true],
    ['New Inquiries', stats.newInquiries, <Users className="h-5 w-5" />],
    ['Contacted', stats.contactedInquiries, <ArrowUpRight className="h-5 w-5" />],
    ['Booked This Month', stats.bookedThisMonth, <Calendar className="h-5 w-5" />],
  ];

  return <DashboardLayout navItems={vendorNavItems} title="Dashboard" role="vendor">
    <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h2 className="mb-1 font-serif text-3xl text-ink-50">Welcome back, {(vendor.fullName || profile?.full_name || 'there').split(' ')[0]}</h2>
        <p className="text-sm text-ink-400">Here is what is happening at {studioName} today.</p>
      </div>
      <button
        type="button"
        onClick={loadDashboard}
        disabled={loading}
        className="inline-flex items-center gap-2 rounded-sm border border-white/10 px-3 py-2 text-xs text-ink-300 hover:border-gold-400/40 hover:text-gold-300 disabled:opacity-50"
      ><RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Refresh</button>
    </div>

    {error && <p role="alert" className="mb-5 rounded-sm border border-red-400/20 bg-red-400/5 p-4 text-sm text-red-300">{error}</p>}

    <div className="mb-10 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map(([label, value, icon, accent]) => <StatCard
        key={label}
        label={label}
        value={loading ? '—' : Number(value || 0).toLocaleString('en-IN')}
        icon={icon}
        accent={accent}
      />)}
    </div>

    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <section className="rounded-sm border border-white/5 bg-ink-800 p-6 lg:col-span-2" aria-labelledby="recent-inquiries-title">
        <div className="mb-6 flex items-center justify-between">
          <h3 id="recent-inquiries-title" className="font-serif text-xl text-ink-50">Recent Inquiries</h3>
          <Link to="/vendor/dashboard/inquiries" className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-gold-400 hover:text-gold-300">
            View All <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        {loading ? <p className="py-8 text-center text-sm text-ink-500">Loading inquiries…</p> : dashboard.recentInquiries?.length ? <div className="space-y-3">
          {dashboard.recentInquiries.map((inquiry) => <article key={inquiry._id} className="flex items-center justify-between gap-4 rounded-sm border border-white/5 bg-ink-900 p-4">
            <div className="flex min-w-0 items-center gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold-400/30 bg-gold-400/20 font-serif text-gold-400">{inquiry.name?.charAt(0)?.toUpperCase() || '?'}</div>
              <div className="min-w-0">
                <p className="truncate text-sm text-ink-100">{inquiry.name}</p>
                <p className="text-xs text-ink-500">{inquiry.eventType} · {formatDate(inquiry.eventDate || inquiry.createdAt)}</p>
              </div>
            </div>
            <span className={`shrink-0 rounded-full border px-3 py-1.5 text-[10px] uppercase tracking-widest ${statusColors[inquiry.status] || statusColors.new}`}>{inquiry.status}</span>
          </article>)}
        </div> : <div className="py-10 text-center">
          <Mail className="mx-auto mb-3 h-8 w-8 text-ink-500" />
          <p className="text-sm text-ink-300">No inquiries have been assigned to your studio yet.</p>
          <p className="mt-1 text-xs text-ink-500">The platform admin can assign inquiries from the Client Inquiries page.</p>
        </div>}
      </section>

      <section className="rounded-sm border border-white/5 bg-ink-800 p-6" aria-labelledby="studio-account-title">
        <h3 id="studio-account-title" className="mb-5 font-serif text-xl text-ink-50">Studio Account</h3>
        <dl className="space-y-4">
          <div><dt className="text-[10px] uppercase tracking-widest text-ink-500">Studio</dt><dd className="mt-1 text-sm text-ink-200">{studioName}</dd></div>
          <div><dt className="text-[10px] uppercase tracking-widest text-ink-500">Location</dt><dd className="mt-1 text-sm text-ink-200">{[vendor.city, vendor.state].filter(Boolean).join(', ') || 'Not added yet'}</dd></div>
          <div><dt className="text-[10px] uppercase tracking-widest text-ink-500">Account status</dt><dd className="mt-1 capitalize text-sm text-green-400">{vendor.status || profile?.status || 'Active'}</dd></div>
          <div><dt className="text-[10px] uppercase tracking-widest text-ink-500">Member since</dt><dd className="mt-1 text-sm text-ink-200">{formatDate(vendor.createdAt)}</dd></div>
        </dl>
        <Link to="/vendor/dashboard/profile" className="mt-6 flex w-full items-center justify-center gap-2 rounded-sm border border-gold-400/30 bg-gold-400/10 py-3 text-xs uppercase tracking-widest text-gold-400 transition-colors hover:bg-gold-400/20">
          Manage Studio Profile <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </section>
    </div>
  </DashboardLayout>;
}

export default VendorDashboard;
