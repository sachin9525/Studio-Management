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
  Shield,
  Activity,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { adminNavItems } from '@/data/navConfig';
import ThemeToggle from '@/components/common/ThemeToggle';

function AdminLayout({ children, navItems = adminNavItems, title = 'Admin Dashboard' }) {
  const { profile, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Close notifications dropdown on click outside or navigation
  useEffect(() => {
    setShowNotifications(false);
  }, [location.pathname]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  const notifications = [
    { id: 1, title: 'New Vendor Registration', desc: 'Royal Frames Studio registered from Jaipur', time: '10m ago', unread: true },
    { id: 2, title: 'Client Inquiry Received', desc: 'Destination Wedding in Udaipur (₹5L Budget)', time: '42m ago', unread: true },
    { id: 3, title: 'Portfolio Updated', desc: '5 new wedding projects added to platform', time: '2h ago', unread: false },
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
      {/* Sidebar — desktop & mobile */}
      <aside
        className={`fixed lg:static top-0 left-0 z-40 h-screen w-64 shrink-0 bg-ink-900/95 backdrop-blur-2xl border-r border-white/5 flex flex-col transition-transform duration-300 ease-in-out shadow-2xl ${
          open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-sm bg-gradient-to-br from-gold-400/20 to-gold-400/5 border border-gold-400/30 flex items-center justify-center text-gold-400 group-hover:border-gold-400/60 group-hover:scale-105 transition-all duration-300 shadow-lg shadow-gold-400/5">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <span className="font-serif text-xl text-ink-50 font-medium tracking-tight block leading-tight group-hover:text-gold-300 transition-colors">
                SVML<span className="text-gold-400">.</span>
              </span>
              <span className="inline-flex items-center gap-1.5 text-[9px] uppercase tracking-widest text-gold-400 font-semibold">
                <Shield className="w-2.5 h-2.5" />
                Admin Panel
              </span>
            </div>
          </Link>
          <button
            onClick={() => setOpen(false)}
            className="lg:hidden text-ink-400 hover:text-ink-100 transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 overflow-y-auto py-5 px-3 space-y-1.5 no-scrollbar">
          <div className="px-3 pb-2 text-[10px] uppercase tracking-widest-2 text-ink-500 font-semibold flex items-center justify-between">
            <span>Main Menu</span>
            <span className="flex h-1.5 w-1.5 rounded-full bg-gold-400" />
          </div>

          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setOpen(false)}
                className={`group flex items-center justify-between px-3.5 py-2.5 rounded-sm text-xs uppercase tracking-widest transition-all duration-200 relative ${
                  isActive
                    ? 'bg-gradient-to-r from-gold-400/20 via-gold-400/10 to-transparent text-gold-600 dark:text-gold-300 font-bold border-l-2 border-gold-500 shadow-sm'
                    : 'text-ink-400 hover:text-ink-50 hover:bg-black/[0.04] dark:hover:bg-white/[0.04] hover:translate-x-1 font-medium'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                      isActive ? 'text-gold-600 dark:text-gold-400 filter drop-shadow-[0_0_8px_rgba(216,179,106,0.5)]' : 'text-ink-400 group-hover:text-gold-600 dark:group-hover:text-gold-300'
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-500 animate-pulse shadow-sm shadow-gold-500" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Admin Profile Footer */}
        <div className="p-4 border-t border-white/5 bg-ink-950/40">
          <div className="flex items-center gap-3 mb-3 p-2 rounded-sm bg-ink-900/60 border border-white/5">
            <div className="relative">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-gold-500/20 to-gold-400/30 border border-gold-400/40 flex items-center justify-center text-gold-300 font-serif text-sm font-semibold shadow-inner">
                {profile?.full_name?.charAt(0).toUpperCase() ?? 'A'}
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-ink-900" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-ink-100 truncate">{profile?.full_name ?? 'Platform Admin'}</p>
              <p className="text-[10px] text-ink-500 truncate">{profile?.email ?? 'admin@svml.studio'}</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-sm text-[10px] font-medium uppercase tracking-widest text-ink-400 hover:text-red-300 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all duration-200"
          >
            <LogOut className="w-3.5 h-3.5" />
            Logout Session
          </button>
        </div>
      </aside>

      {/* Mobile Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-ink-950/80 backdrop-blur-sm z-30 lg:hidden transition-opacity duration-300"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Main Content Area — independent scroll */}
      <div className="flex-1 min-w-0 h-screen flex flex-col overflow-y-auto relative scroll-smooth">
        {/* Sticky Header */}
        <header className="sticky top-0 z-30 shrink-0 bg-ink-950/85 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex items-center justify-between transition-all">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden p-2 rounded-sm text-ink-400 hover:text-ink-100 hover:bg-white/5 transition-colors"
              onClick={() => setOpen(!open)}
              aria-label="Toggle navigation"
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Breadcrumb / Title */}
            <div>
              <div className="hidden sm:flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-ink-500 mb-0.5">
                <span>Admin</span>
                <ChevronRight className="w-3 h-3 text-ink-600" />
                {breadcrumbItems.map((item, idx) => (
                  <span key={item.url} className="flex items-center gap-1.5">
                    {item.isLast ? (
                      <span className="text-gold-400 font-semibold">{item.label}</span>
                    ) : (
                      <>
                        <Link to={item.url} className="hover:text-ink-300 transition-colors">{item.label}</Link>
                        <ChevronRight className="w-3 h-3 text-ink-600" />
                      </>
                    )}
                  </span>
                ))}
              </div>
              <h1 className="font-serif text-2xl text-ink-50 font-normal tracking-tight">{title}</h1>
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-3">
            {/* Live Status Pill */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-400/10 border border-emerald-400/20 text-emerald-400 text-[10px] uppercase tracking-widest font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span>Live Engine</span>
            </div>

            {/* View Live Site Shortcut */}
            <Link
              to="/"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-sm border border-gold-400/40 bg-gold-400/10 hover:bg-gold-400/20 text-gold-600 dark:text-gold-300 text-xs uppercase tracking-widest font-semibold transition-all duration-200 hover:scale-[1.02]"
            >
              <span>View Site</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            {/* Theme Toggle (Dark / Light) */}
            <ThemeToggle />

            {/* Notifications Menu */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className={`relative p-2.5 rounded-sm border transition-all duration-200 ${
                  showNotifications
                    ? 'border-gold-400/40 bg-gold-400/10 text-gold-300'
                    : 'border-white/5 bg-ink-900 hover:border-gold-400/30 text-ink-300 hover:text-gold-300'
                }`}
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-gold-400 ring-2 ring-ink-950 animate-pulse" />
              </button>

              {/* Notifications Dropdown Drawer */}
              {showNotifications && (
                <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-sm border border-gold-400/20 bg-ink-900/95 backdrop-blur-2xl p-4 shadow-2xl z-50 animate-scale-in">
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/5">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-gold-400" />
                      <h4 className="font-serif text-lg text-ink-50">Notifications</h4>
                    </div>
                    <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-gold-400/10 text-gold-400 border border-gold-400/20">
                      3 New
                    </span>
                  </div>
                  <div className="space-y-2.5 max-h-72 overflow-y-auto no-scrollbar">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-3 rounded-sm border transition-colors ${
                          n.unread ? 'bg-gold-400/[0.04] border-gold-400/20' : 'bg-ink-800/40 border-white/5'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-xs font-medium text-ink-100">{n.title}</p>
                          <span className="text-[10px] text-ink-500 whitespace-nowrap">{n.time}</span>
                        </div>
                        <p className="text-[11px] text-ink-400 mt-1">{n.desc}</p>
                      </div>
                    ))}
                  </div>
                  <Link
                    to="/admin/dashboard/inquiries"
                    onClick={() => setShowNotifications(false)}
                    className="mt-3 block text-center text-[10px] uppercase tracking-widest text-gold-400 hover:text-gold-300 py-1.5 transition-colors font-semibold"
                  >
                    View All Platform Inquiries →
                  </Link>
                </div>
              )}
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

export default AdminLayout;
