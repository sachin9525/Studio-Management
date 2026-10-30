import { useCallback, useEffect, useState } from 'react';
import {
  ArrowUpRight,
  Briefcase,
  Calendar,
  FolderHeart,
  Images,
  Mail,
  Package,
  Plus,
  RefreshCw,
  Sparkles,
  Users,
  Video,
} from 'lucide-react';
import { Link } from 'react-router-dom';
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
    { label: 'Total Inquiries', value: stats.totalInquiries, icon: <Mail className="w-3.5 h-3.5" />, accent: true, trend: '+15% this mo.' },
    { label: 'New Leads', value: stats.newInquiries, icon: <Users className="w-3.5 h-3.5" />, trend: 'Active' },
    { label: 'Contacted', value: stats.contactedInquiries, icon: <ArrowUpRight className="w-3.5 h-3.5" />, trend: 'Follow-ups' },
    { label: 'Booked This Mo.', value: stats.bookedThisMonth, icon: <Calendar className="w-3.5 h-3.5" />, accent: true, trend: 'Confirmed' },
    { label: 'Portfolio Shoots', value: stats.totalProjects, icon: <FolderHeart className="w-3.5 h-3.5" />, trend: `${stats.publishedProjects || 0} live` },
    { label: 'Photo Albums', value: stats.totalAlbums, icon: <Images className="w-3.5 h-3.5" />, trend: `${stats.publishedAlbums || 0} live` },
    { label: 'Cinematic Videos', value: stats.totalVideos, icon: <Video className="w-3.5 h-3.5" />, trend: '4K Films' },
    { label: 'Pricing Packages', value: stats.totalPackages, icon: <Package className="w-3.5 h-3.5" />, trend: `${stats.publishedPackages || 0} live` },
    { label: 'Active Services', value: stats.activeServices, icon: <Briefcase className="w-3.5 h-3.5" />, trend: 'Catalog' },
    { label: 'Published Shoots', value: stats.publishedProjects, icon: <FolderHeart className="w-3.5 h-3.5" />, trend: 'Public' },
    { label: 'Published Albums', value: stats.publishedAlbums, icon: <Images className="w-3.5 h-3.5" />, trend: 'Public' },
    { label: 'Published Tiers', value: stats.publishedPackages, icon: <Package className="w-3.5 h-3.5" />, trend: 'Public' },
  ];

  return (
    <VendorLayout title="Studio Dashboard">
      {/* Top Banner Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded-full bg-gold-400/10 border border-gold-400/20 text-gold-300 text-[10px] uppercase tracking-widest font-semibold flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5 text-gold-400" />
              Studio Operations
            </span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl text-ink-50 mb-1">
            Welcome back, {(vendor.fullName || profile?.full_name || 'Vendor').split(' ')[0]}
          </h2>
          <p className="text-xs sm:text-sm text-ink-400">
            Real-time activity and showcase performance for <span className="text-gold-300 font-medium">{studioName}</span>.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={loadDashboard}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-sm border border-white/10 px-3 py-1.5 text-xs text-ink-300 transition-colors hover:border-gold-400/40 hover:text-gold-300 disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <Link
            to="/vendor/dashboard/projects"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-gradient-to-r from-gold-500 to-gold-400 text-ink-950 font-medium text-xs uppercase tracking-wider hover:brightness-110 transition-all shadow-md shadow-gold-500/10"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Shoot</span>
          </Link>
        </div>
      </div>

      {error && (
        <div role="alert" className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-sm border border-red-400/20 bg-red-400/5 p-4 text-sm text-red-300">
          <span>{error}</span>
          <button type="button" onClick={loadDashboard} className="underline underline-offset-4">Try again</button>
        </div>
      )}

      {/* Symmetrical 6-Column Ultra-Compact Metric Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3 mb-6">
        {cards.map((card) => (
          <StatCard
            key={card.label}
            label={card.label}
            value={loading ? '—' : Number(card.value || 0)}
            icon={card.icon}
            accent={card.accent}
            trend={card.trend}
          />
        ))}
      </div>

      {/* Main Grid: Inquiries, Quick Studio Actions & Account Details */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <RecentInquiriesList
          inquiries={dashboard.recentInquiries || []}
          loading={loading}
        />
        <div className="space-y-6">
          {/* Quick Studio Actions */}
          <section className="rounded-sm border border-white/5 bg-ink-900/80 backdrop-blur-md p-5">
            <h3 className="font-serif text-lg text-ink-50 mb-3 flex items-center justify-between">
              <span>Quick Actions</span>
              <span className="text-[10px] uppercase tracking-widest text-gold-400 font-sans">Fast Links</span>
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <Link
                to="/vendor/dashboard/albums"
                className="flex flex-col items-center justify-center p-3 rounded-sm bg-ink-800/60 border border-white/5 hover:border-gold-400/30 text-ink-300 hover:text-gold-300 transition-all group"
              >
                <Images className="w-5 h-5 mb-1.5 text-gold-400 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] uppercase tracking-wider font-medium text-center">New Album</span>
              </Link>
              <Link
                to="/vendor/dashboard/videos"
                className="flex flex-col items-center justify-center p-3 rounded-sm bg-ink-800/60 border border-white/5 hover:border-gold-400/30 text-ink-300 hover:text-gold-300 transition-all group"
              >
                <Video className="w-5 h-5 mb-1.5 text-gold-400 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] uppercase tracking-wider font-medium text-center">Upload Film</span>
              </Link>
              <Link
                to="/vendor/dashboard/packages"
                className="flex flex-col items-center justify-center p-3 rounded-sm bg-ink-800/60 border border-white/5 hover:border-gold-400/30 text-ink-300 hover:text-gold-300 transition-all group"
              >
                <Package className="w-5 h-5 mb-1.5 text-gold-400 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] uppercase tracking-wider font-medium text-center">Packages</span>
              </Link>
              <Link
                to="/vendor/dashboard/services"
                className="flex flex-col items-center justify-center p-3 rounded-sm bg-ink-800/60 border border-white/5 hover:border-gold-400/30 text-ink-300 hover:text-gold-300 transition-all group"
              >
                <Briefcase className="w-5 h-5 mb-1.5 text-gold-400 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] uppercase tracking-wider font-medium text-center">Services</span>
              </Link>
            </div>
          </section>

          <StudioAccountCard
            studioName={studioName}
            vendor={vendor}
            profile={profile}
          />
        </div>
      </div>
    </VendorLayout>
  );
}

export default VendorDashboard;
