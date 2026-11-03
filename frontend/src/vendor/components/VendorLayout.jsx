import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Camera,
  LogOut,
  Menu,
  X,
  Bell,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Store,
  Layers,
  ArrowLeft,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { vendorNavItems } from '@/data/navConfig';
import ThemeToggle from '@/components/common/ThemeToggle';
import GlassySidebar from '@/components/common/GlassySidebar';

function VendorLayout({ children, navItems = vendorNavItems, title = 'Vendor Dashboard' }) {
  const { profile, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Close notifications dropdown on navigation
  useEffect(() => {
    setShowNotifications(false);
  }, [location.pathname]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/vendor/login');
  };

  const studioName = profile?.studio_name || 'My Studio';

  const notifications = [
    { id: 1, title: 'New Client Inquiry', desc: 'Pre-Wedding Shoot requested by Ananya & Kabir', time: '15m ago', unread: true },
    { id: 2, title: 'Booking Confirmed', desc: 'Destination Wedding coverage locked for Nov 18', time: '1h ago', unread: true },
    { id: 3, title: 'Album Published', desc: 'Royal Palace Jaipur album is now public on platform', time: '3h ago', unread: false },
  ];

  // Derive breadcrumbs from current path
  const pathParts = location.pathname.split('/').filter(Boolean);
  const breadcrumbItems = pathParts.map((part, index) => {
    const url = `/${pathParts.slice(0, index + 1).join('/')}`;
    const isLast = index === pathParts.length - 1;
    const label = part.charAt(0).toUpperCase() + part.slice(1).replace(/-/g, ' ');
    return { url, label, isLast };
  });

  return (
    <div className="h-screen w-full bg-ink-950 text-ink-100 flex overflow-hidden relative selection:bg-gold-400 selection:text-ink-950 font-sans">
      {/* Studio Ambient Luxury Background Lighting for Realistic Glass Blur */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_15%_10%,rgba(216,179,106,0.08),rgba(0,0,0,0))] dark:bg-[radial-gradient(ellipse_80%_80%_at_15%_10%,rgba(216,179,106,0.1),rgba(0,0,0,0))] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-orange-600/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Glassy SideBar V5 — Desktop */}
      <div className="hidden lg:block shrink-0">
        <GlassySidebar role="vendor" navItems={navItems} />
      </div>

      {/* Mobile Drawer with Glassy SideBar V5 */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-ink-950/80 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setOpen(false)}
          />
          <div className="relative z-10 w-72 h-full flex items-center">
            <GlassySidebar role="vendor" navItems={navItems} />
          </div>
        </div>
      )}

      {/* Main Content Area — independent scroll */}
      <div className="flex-1 min-w-0 h-screen flex flex-col overflow-y-auto relative scroll-smooth">
        {/* Glassy Floating Island Header */}
        <header className="sticky top-0 z-30 shrink-0 pl-6 sm:pl-8 pr-4 sm:pr-6 pt-3 sm:pt-4 pb-2 transition-all">
          <div className="relative rounded-[24px] sm:rounded-full bg-white/85 dark:bg-black/50 backdrop-blur-3xl border border-black/10 dark:border-white/15 px-4 sm:px-6 py-2 flex items-center justify-between shadow-[0_15px_35px_rgba(0,0,0,0.06)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden">
            {/* Ambient Corner Glow */}
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-amber-500/15 dark:bg-amber-400/10 rounded-full blur-xl pointer-events-none" />

            <div className="flex items-center gap-3 sm:gap-4 relative z-10">
              <button
                className="lg:hidden p-2 rounded-full text-ink-500 hover:text-ink-50 hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
                onClick={() => setOpen(!open)}
                aria-label="Toggle navigation"
              >
                {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

              {/* Universal Back Button for All Sidebar Sections (hidden on root dashboard) */}
              {location.pathname !== '/vendor/dashboard' && (
                <button
                  type="button"
                  onClick={() => {
                    if (window.history.length > 1) {
                      navigate(-1);
                    } else {
                      navigate('/vendor/dashboard');
                    }
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/[0.04] dark:bg-white/10 hover:bg-amber-500/15 border border-black/10 dark:border-white/10 text-xs text-ink-950 dark:text-ink-50 hover:text-amber-700 dark:hover:text-amber-300 font-sans font-semibold transition-all shadow-2xs hover:scale-105 active:scale-95 cursor-pointer shrink-0"
                  title="Go back to dashboard"
                >
                  <ArrowLeft className="w-3.5 h-3.5 text-ink-950 dark:text-ink-50 group-hover:text-amber-600 stroke-[2.5] transition-transform group-hover:-translate-x-0.5" />
                  <span>Back</span>
                </button>
              )}

              {/* Glassy Title & Section Indicator */}
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-400 text-white font-bold text-xs flex items-center justify-center shadow-md shadow-orange-500/20 shrink-0">
                  {studioName.charAt(0).toUpperCase() || 'S'}
                </div>
                <div className="flex items-center gap-2">
                  <h1 className="font-sans font-bold text-sm sm:text-base text-ink-950 dark:text-ink-50 tracking-tight leading-none">{title}</h1>
                  {location.pathname !== '/vendor/dashboard' ? (
                    <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-black/[0.04] dark:bg-white/10 text-[10px] font-sans font-semibold text-ink-500 dark:text-ink-400">
                      <Link to="/vendor/dashboard" className="hover:text-ink-950 dark:hover:text-white">Studio</Link>
                      <span>/</span>
                      <span className="text-amber-700 dark:text-amber-300 font-bold">{title.replace('Vendor ', '')}</span>
                    </span>
                  ) : (
                    <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-[10px] font-sans font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
                      Studio
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Right Header Actions */}
            <div className="flex items-center gap-2 sm:gap-2.5 relative z-10">
              {/* Live Status Pill */}
              <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-sans font-semibold shadow-2xs">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span>Studio Online</span>
              </div>

              {/* View Live Site Shortcut */}
              <Link
                to="/"
                target="_blank"
                rel="noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/[0.04] dark:bg-white/10 hover:bg-amber-500/15 border border-black/10 dark:border-white/15 hover:border-amber-500/40 text-xs font-sans font-semibold text-ink-950 dark:text-ink-50 hover:text-amber-700 dark:hover:text-amber-300 transition-all shadow-2xs hover:scale-105 active:scale-95 cursor-pointer"
              >
                <span>View Site</span>
                <ExternalLink className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              </Link>

              {/* Theme Toggle (Dark / Light) */}
              <ThemeToggle className="w-8 h-8" />

              {/* Notifications Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className={`relative w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-200 cursor-pointer shadow-2xs hover:scale-105 active:scale-95 ${
                    showNotifications
                      ? 'border-amber-500/50 bg-amber-500/15 text-amber-700 dark:text-amber-300'
                      : 'border-black/10 dark:border-white/15 bg-black/[0.04] dark:bg-white/10 text-ink-700 dark:text-ink-300 hover:bg-amber-500/15 hover:border-amber-500/40 hover:text-amber-700 dark:hover:text-amber-300'
                  }`}
                  aria-label="Notifications"
                >
                  <Bell className="w-3.5 h-3.5" />
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white dark:ring-black animate-pulse" />
                </button>

                {/* Notifications Dropdown Drawer */}
                {showNotifications && (
                  <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-[28px] border border-black/10 dark:border-white/15 bg-white/95 dark:bg-black/90 backdrop-blur-2xl p-5 shadow-[0_20px_50px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.7)] z-50 animate-fade-in">
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-black/10 dark:border-white/10">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                        <h4 className="font-sans font-bold text-base text-ink-950 dark:text-ink-50">Studio Inquiries & Updates</h4>
                      </div>
                      <span className="text-[10px] font-sans font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                        2 New
                      </span>
                    </div>
                    <div className="space-y-2.5 max-h-72 overflow-y-auto no-scrollbar">
                      {notifications.map((n) => (
                        <div
                          key={n.id}
                          className={`p-3.5 rounded-2xl border transition-all ${
                            n.unread
                              ? 'bg-amber-500/10 border-amber-500/25 shadow-2xs'
                              : 'bg-black/[0.02] dark:bg-white/[0.03] border-black/10 dark:border-white/10'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-xs font-bold text-ink-950 dark:text-ink-50">{n.title}</p>
                            <span className="text-[10px] font-sans font-medium text-ink-500 dark:text-ink-400 whitespace-nowrap">{n.time}</span>
                          </div>
                          <p className="text-[11px] text-ink-600 dark:text-ink-300 mt-1">{n.desc}</p>
                        </div>
                      ))}
                    </div>
                    <Link
                      to="/vendor/dashboard/inquiries"
                      onClick={() => setShowNotifications(false)}
                      className="mt-3 block text-center text-[10px] font-sans font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 hover:underline py-1.5 transition-colors"
                    >
                      View All Studio Inquiries →
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 p-6 sm:p-8 max-w-7xl w-full mx-auto animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
}

export default VendorLayout;
