import { useCallback, useEffect, useState } from 'react';
import { ArrowUpRight, Briefcase, Calendar, FolderHeart, Images, Mail, RefreshCw, Users, Video } from 'lucide-react';
import {
  VendorLayout,
  StatCard,
  RecentInquiriesList,
  StudioAccountCard,
} from '@/vendor/components';
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

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

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

  return (
    <VendorLayout title="Dashboard">
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="mb-1 font-serif text-3xl text-ink-50">
            Welcome back, {(vendor.fullName || profile?.full_name || 'there').split(' ')[0]}
          </h2>
          <p className="text-sm text-ink-400">Here is what is happening at {studioName} today.</p>
        </div>
        <button
          type="button"
          onClick={loadDashboard}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-sm border border-white/10 px-3 py-2 text-xs text-ink-300 hover:border-gold-400/40 hover:text-gold-300 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </div>

      {error && (
        <p role="alert" className="mb-5 rounded-sm border border-red-400/20 bg-red-400/5 p-4 text-sm text-red-300">
          {error}
        </p>
      )}

      <div className="mb-10 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(([label, value, icon, accent]) => (
          <StatCard
            key={label}
            label={label}
            value={loading ? '—' : Number(value || 0).toLocaleString('en-IN')}
            icon={icon}
            accent={accent}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <RecentInquiriesList
          inquiries={dashboard.recentInquiries || []}
          loading={loading}
        />
        <StudioAccountCard
          studioName={studioName}
          vendor={vendor}
          profile={profile}
        />
      </div>
    </VendorLayout>
  );
}

export default VendorDashboard;
