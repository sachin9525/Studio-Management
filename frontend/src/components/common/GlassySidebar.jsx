import { useState, useEffect, useRef, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutGrid,
  Zap,
  Calendar,
  MessageSquare,
  Layers,
  Settings,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  Search,
  LogOut,
  ExternalLink,
  Camera,
  Folder,
  Film,
  Package,
  Star,
  Users,
  Briefcase,
  ArrowLeft,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';

export default function GlassySidebar({ role = 'admin' }) {
  const { profile, signOut } = useAuth();
  const { toggleTheme, isDark } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  // Collapsed state persisted in localStorage
  const [isCollapsed, setIsCollapsed] = useState(() => {
    try {
      return localStorage.getItem('glassy_sidebar_collapsed') === 'true';
    } catch {
      return false;
    }
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [isProjectsOpen, setIsProjectsOpen] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const searchInputRef = useRef(null);

  // Sync collapsed state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('glassy_sidebar_collapsed', String(isCollapsed));
    } catch {
      // ignore
    }
  }, [isCollapsed]);

  // Global Ctrl+K / Cmd+K shortcut to focus search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCollapsed(false);
        setTimeout(() => {
          searchInputRef.current?.focus();
        }, 150);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate(role === 'admin' ? '/admin/login' : '/vendor/login');
  };

  // Brand details
  const isVendor = role === 'vendor';
  const brandName = isVendor ? (profile?.studio_name || 'SVML Studio') : 'Vertix SVML';
  const brandSubtitle = isVendor ? 'Studio workspace' : 'Platform Console';
  const brandLetter = isVendor ? (brandName.charAt(0).toUpperCase() || 'S') : 'V';

  // Navigation groupings
  const mainItems = useMemo(() => {
    if (isVendor) {
      return [
        {
          id: 'dashboard',
          label: 'Dashboard',
          icon: LayoutGrid,
          path: '/vendor/dashboard',
        },
        {
          id: 'profile',
          label: 'Studio Profile',
          icon: Camera,
          path: '/vendor/dashboard/profile',
        },
        {
          id: 'services',
          label: 'Services',
          icon: Briefcase,
          path: '/vendor/dashboard/services',
        },
        {
          id: 'calendar',
          label: 'Schedule',
          icon: Calendar,
          path: '/vendor/dashboard/inquiries',
          dot: true,
        },
      ];
    }

    return [
      {
        id: 'dashboard',
        label: 'Dashboard',
        icon: LayoutGrid,
        path: '/admin/dashboard',
      },
      {
        id: 'activity',
        label: 'Activity',
        icon: Zap,
        path: '/admin/dashboard/inquiries',
        badge: '12',
      },
      {
        id: 'vendors',
        label: 'Vendors',
        icon: Users,
        path: '/admin/dashboard/vendors',
        badge: 'Active',
      },
      {
        id: 'schedule',
        label: 'Schedule',
        icon: Calendar,
        path: '/admin/dashboard/portfolio',
        dot: true,
      },
    ];
  }, [isVendor]);

  const workspaceItems = useMemo(() => {
    const basePath = isVendor ? '/vendor/dashboard' : '/admin/dashboard';
    return [
      {
        id: 'messages',
        label: 'Messages',
        icon: MessageSquare,
        path: `${basePath}/inquiries`,
        badgeCount: 3,
      },
      {
        id: 'albums',
        label: 'Albums',
        icon: Folder,
        path: `${basePath}/albums`,
      },
      {
        id: 'videos',
        label: 'Videos',
        icon: Film,
        path: `${basePath}/videos`,
      },
      {
        id: 'packages',
        label: 'Packages',
        icon: Package,
        path: `${basePath}/packages`,
      },
      {
        id: 'testimonials',
        label: 'Testimonials',
        icon: Star,
        path: `${basePath}/testimonials`,
      },
      {
        id: 'settings',
        label: 'Settings',
        icon: Settings,
        path: `${basePath}/settings`,
      },
    ];
  }, [isVendor]);

  // Project sub-tree items
  const projectSubItems = useMemo(() => {
    const basePath = isVendor ? '/vendor/dashboard/projects' : '/admin/dashboard/portfolio';
    return [
      { label: 'Wedding Shoots', dotColor: 'bg-emerald-500', path: `${basePath}?cat=Weddings` },
      { label: 'Pre-Wedding', dotColor: 'bg-amber-500', path: `${basePath}?cat=Pre-Wedding` },
      { label: 'Brand & Films', dotColor: 'bg-purple-500', path: isVendor ? '/vendor/dashboard/videos' : '/admin/dashboard/videos' },
    ];
  }, [isVendor]);

  // Filter items if searching
  const filteredMain = useMemo(() => {
    if (!searchQuery.trim()) return mainItems;
    return mainItems.filter((i) => i.label.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [mainItems, searchQuery]);

  const filteredWorkspace = useMemo(() => {
    if (!searchQuery.trim()) return workspaceItems;
    return workspaceItems.filter((i) => i.label.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [workspaceItems, searchQuery]);

  const isProjectsActive = location.pathname.includes('/projects') || location.pathname.includes('/portfolio');

  return (
    <aside
      className={`relative h-[calc(100vh-1.5rem)] my-3 ml-3 sm:ml-4 shrink-0 transition-all duration-300 ease-in-out z-40 select-none ${
        isCollapsed ? 'w-[76px]' : 'w-72'
      }`}
    >
      {/* Circular Collapse Toggle Button Mounted on the Right Edge (Never Overlaps Brand Logo) */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-6 z-50 w-7 h-7 rounded-full bg-white dark:bg-ink-800 text-ink-950 dark:text-ink-50 shadow-lg border border-black/20 dark:border-white/25 flex items-center justify-center hover:scale-110 active:scale-95 transition-all cursor-pointer"
        title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {isCollapsed ? (
          <ChevronRight className="w-3.5 h-3.5 text-ink-950 dark:text-ink-50 stroke-[2.5]" />
        ) : (
          <ChevronLeft className="w-3.5 h-3.5 text-ink-950 dark:text-ink-50 stroke-[2.5]" />
        )}
      </button>

      {/* Outer Floating Glass Card Container */}
      <div className="relative w-full h-full rounded-[28px] overflow-hidden flex flex-col justify-between bg-white/95 dark:bg-black/50 backdrop-blur-2xl border border-black/15 dark:border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.12)] dark:shadow-[0_25px_60px_rgba(0,0,0,0.6)] text-ink-900 dark:text-ink-50 transition-colors">
        {/* Soft Glass Ambient Highlights */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-amber-500/15 dark:bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-orange-600/15 dark:bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* TOP SECTION: Brand Header & Search */}
        <div className="p-4 pb-2 shrink-0">
          {/* Brand Identity */}
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
            <Link
              to="/"
              className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-600 via-orange-500 to-amber-400 text-white font-bold text-lg flex items-center justify-center shadow-lg shadow-orange-500/25 shrink-0 hover:scale-105 transition-transform"
            >
              {brandLetter}
            </Link>

            {!isCollapsed && (
              <div className="min-w-0 pr-6 animate-fade-in">
                <Link to="/" className="block">
                  <h2 className="font-serif text-lg font-bold tracking-tight text-ink-950 dark:text-ink-50 truncate leading-snug hover:text-gold-600 dark:hover:text-gold-300 transition-colors">
                    {brandName}
                  </h2>
                </Link>
                <p className="text-[11px] text-ink-500 dark:text-ink-400 tracking-normal font-sans truncate font-medium">
                  {brandSubtitle}
                </p>
              </div>
            )}
          </div>

          {/* Search Pill */}
          <div className="mt-3">
            {isCollapsed ? (
              <button
                onClick={() => setIsCollapsed(false)}
                className="w-full flex items-center justify-center p-2 rounded-full bg-black/[0.04] dark:bg-white/5 border border-black/10 dark:border-white/10 text-ink-600 dark:text-ink-400 hover:text-gold-700 dark:hover:text-gold-300 hover:bg-black/10 dark:hover:bg-white/10 transition-all cursor-pointer"
                title="Search pages (Ctrl+K)"
              >
                <Search className="w-4 h-4" />
              </button>
            ) : (
              <div className="relative flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/[0.04] dark:bg-white/5 border border-black/15 dark:border-white/10 text-xs text-ink-900 dark:text-ink-200 focus-within:border-gold-500/60 focus-within:bg-white dark:focus-within:bg-black/60 focus-within:shadow-md transition-all">
                <Search className="w-3.5 h-3.5 text-ink-500 dark:text-ink-400 shrink-0" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search pages"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent outline-none text-xs text-ink-950 dark:text-ink-50 placeholder:text-ink-400 dark:placeholder:text-ink-500 font-sans font-medium"
                />
                <kbd className="hidden sm:inline-block text-[9px] font-mono px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10 text-ink-700 dark:text-ink-300 border border-black/15 dark:border-white/10 shrink-0">
                  ⌘K
                </kbd>
              </div>
            )}
          </div>
        </div>

        {/* MIDDLE SECTION: Navigation Menu Items */}
        <div className="flex-1 overflow-y-auto px-3 py-1 space-y-3 no-scrollbar">
          {/* Quick Back to Dashboard Button when visiting any section */}
          {location.pathname !== (isVendor ? '/vendor/dashboard' : '/admin/dashboard') && (
            <div className="pb-1">
              <button
                type="button"
                onClick={() => navigate(isVendor ? '/vendor/dashboard' : '/admin/dashboard')}
                className={`w-full flex items-center gap-2 py-1.5 px-3 rounded-full bg-gold-400/15 hover:bg-gold-400/25 border border-gold-400/40 text-gold-600 dark:text-gold-300 text-xs font-bold transition-all group cursor-pointer shadow-xs ${
                  isCollapsed ? 'justify-center w-10 h-10 p-0 mx-auto' : ''
                }`}
                title="Back to Dashboard"
              >
                <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5 shrink-0 text-gold-600 dark:text-gold-300 stroke-[2.5]" />
                {!isCollapsed && <span className="truncate text-gold-600 dark:text-gold-300">Back to Dashboard</span>}
              </button>
            </div>
          )}

          {/* SECTION: MAIN */}
          {filteredMain.length > 0 && (
            <div>
              {!isCollapsed && (
                <div className="px-3 pb-1 text-[10px] uppercase tracking-widest font-mono font-bold text-ink-500 dark:text-ink-400">
                  Main
                </div>
              )}

              {isCollapsed && <div className="h-px w-8 bg-black/15 dark:bg-white/10 my-1.5 mx-auto" />}

              <div className="space-y-0.5">
                {filteredMain.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;

                  return (
                    <Link
                      key={item.id}
                      to={item.path}
                      className={`group relative flex items-center transition-all duration-200 cursor-pointer ${isCollapsed
                        ? 'justify-center w-10 h-10 mx-auto rounded-full'
                        : 'justify-between px-3 py-2 rounded-full text-xs font-medium'
                        } ${isActive
                          ? 'sidebar-active bg-gold-500/15 dark:bg-white/15 border border-gold-500/30 dark:border-white/20 text-gold-900 dark:text-gold-300 font-bold shadow-xs'
                          : 'text-ink-700 dark:text-ink-300 hover:text-ink-950 dark:hover:text-ink-50 hover:bg-black/[0.05] dark:hover:bg-white/10'
                        }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="relative shrink-0">
                          <Icon className={`w-4 h-4 transition-transform duration-200 group-hover:scale-110 ${isActive
                            ? 'text-gold-700 dark:text-gold-300'
                            : 'text-ink-500 dark:text-ink-400 group-hover:text-ink-950 dark:group-hover:text-ink-50'
                            }`} />
                          {item.dot && (
                            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-orange-500 shadow-sm shadow-orange-500" />
                          )}
                        </span>

                        {!isCollapsed && (
                          <span className={`truncate text-xs font-sans tracking-tight ${isActive
                            ? 'text-gold-900 dark:text-gold-200 font-bold'
                            : 'text-ink-50 dark:text-ink-200 group-hover:text-ink-950 dark:group-hover:text-white font-medium'
                            }`}>
                            {item.label}
                          </span>
                        )}
                      </div>

                      {!isCollapsed && item.badge && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-black/[0.06] dark:bg-white/10 border border-black/10 dark:border-white/15 text-ink-700 dark:text-ink-200 shrink-0">
                          {item.badge}
                        </span>
                      )}

                      {/* Tooltip in Collapsed Mode */}
                      {isCollapsed && (
                        <div className="absolute left-full ml-3 px-3 py-1.5 rounded-lg bg-ink-950/90 text-white text-xs whitespace-nowrap shadow-xl border border-white/15 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 font-sans">
                          {item.label} {item.badge ? `(${item.badge})` : ''}
                        </div>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* SECTION: WORKSPACE */}
          {filteredWorkspace.length > 0 && (
            <div>
              {!isCollapsed && (
                <div className="px-3 pb-1 text-[10px] uppercase tracking-widest font-mono font-bold text-ink-500 dark:text-ink-400">
                  Workspace
                </div>
              )}

              {isCollapsed && <div className="h-px w-8 bg-black/15 dark:bg-white/10 my-1.5 mx-auto" />}

              <div className="space-y-0.5">
                {/* Messages / Inquiries */}
                {filteredWorkspace.filter(i => i.id === 'messages').map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;

                  return (
                    <Link
                      key={item.id}
                      to={item.path}
                      className={`group relative flex items-center transition-all duration-200 cursor-pointer ${isCollapsed
                        ? 'justify-center w-10 h-10 mx-auto rounded-full'
                        : 'justify-between px-3 py-2 rounded-full text-xs font-medium'
                        } ${isActive
                          ? 'sidebar-active bg-gold-500/15 dark:bg-white/15 border border-gold-500/30 dark:border-white/20 text-gold-900 dark:text-gold-300 font-bold shadow-xs'
                          : 'text-ink-700 dark:text-ink-300 hover:text-ink-950 dark:hover:text-ink-50 hover:bg-black/[0.05] dark:hover:bg-white/10'
                        }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="relative shrink-0">
                          <Icon className={`w-4 h-4 transition-transform duration-200 group-hover:scale-110 ${isActive
                            ? 'text-gold-700 dark:text-gold-300'
                            : 'text-ink-500 dark:text-ink-400 group-hover:text-ink-950 dark:group-hover:text-ink-50'
                            }`} />
                          {isCollapsed && (
                            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-orange-500 shadow-sm shadow-orange-500" />
                          )}
                        </span>
                        {!isCollapsed && (
                          <span className={`truncate text-xs font-sans tracking-tight ${isActive
                            ? 'text-gold-900 dark:text-gold-200 font-bold'
                            : 'text-ink-50 dark:text-ink-200 group-hover:text-ink-950 dark:group-hover:text-white font-medium'
                            }`}>
                            {item.label}
                          </span>
                        )}
                      </div>

                      {!isCollapsed && item.badgeCount && (
                        <span className="w-5 h-5 rounded-full text-[10px] font-mono font-bold bg-orange-500 text-white flex items-center justify-center shadow-md shadow-orange-500/30 shrink-0">
                          {item.badgeCount}
                        </span>
                      )}

                      {/* Tooltip */}
                      {isCollapsed && (
                        <div className="absolute left-full ml-3 px-3 py-1.5 rounded-lg bg-ink-950/90 text-white text-xs whitespace-nowrap shadow-xl border border-white/15 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 font-sans">
                          {item.label} ({item.badgeCount})
                        </div>
                      )}
                    </Link>
                  );
                })}

                {/* Projects (Expandable Tree with Connecting Lines) */}
                {(!searchQuery.trim() || 'projects'.includes(searchQuery.toLowerCase())) && (
                  <div>
                    <div
                      onClick={() => {
                        if (isCollapsed) setIsCollapsed(false);
                        setIsProjectsOpen(!isProjectsOpen);
                      }}
                      className={`group relative flex items-center transition-all duration-200 cursor-pointer ${isCollapsed
                        ? 'justify-center w-10 h-10 mx-auto rounded-full'
                        : 'justify-between px-3 py-2 rounded-full text-xs font-medium'
                        } ${isProjectsActive
                          ? 'sidebar-active bg-gold-500/15 dark:bg-white/15 border border-gold-500/30 dark:border-white/20 text-gold-900 dark:text-gold-300 font-bold shadow-xs'
                          : 'text-ink-700 dark:text-ink-300 hover:text-ink-950 dark:hover:text-ink-50 hover:bg-black/[0.05] dark:hover:bg-white/10'
                        }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Layers className={`w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-110 ${isProjectsActive ? 'text-gold-700 dark:text-gold-300' : 'text-ink-500 dark:text-ink-400 group-hover:text-ink-950 dark:group-hover:text-ink-50'
                          }`} />
                        {!isCollapsed && (
                          <span className={`truncate text-xs font-sans tracking-tight ${isProjectsActive ? 'text-gold-900 dark:text-gold-200 font-bold' : 'text-ink-50 dark:text-ink-200 group-hover:text-ink-950 dark:group-hover:text-white font-medium'
                            }`}>
                            Projects
                          </span>
                        )}
                      </div>

                      {!isCollapsed && (
                        <span className="text-ink-500 dark:text-ink-400 shrink-0">
                          {isProjectsOpen ? (
                            <ChevronUp className="w-3.5 h-3.5" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5" />
                          )}
                        </span>
                      )}

                      {/* Tooltip */}
                      {isCollapsed && (
                        <div className="absolute left-full ml-3 px-3 py-1.5 rounded-lg bg-ink-950/90 text-white text-xs whitespace-nowrap shadow-xl border border-white/15 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 font-sans">
                          Projects & Portfolio
                        </div>
                      )}
                    </div>

                    {/* Accordion Tree Sub-items */}
                    {!isCollapsed && isProjectsOpen && (
                      <div className="relative ml-5 pl-4 mt-1 space-y-1 border-l border-black/15 dark:border-white/15 animate-fade-in">
                        {projectSubItems.map((sub) => (
                          <Link
                            key={sub.label}
                            to={sub.path}
                            className="flex items-center gap-2.5 py-1 text-xs text-ink-700 dark:text-ink-300 hover:text-ink-950 dark:hover:text-ink-50 font-medium transition-colors group"
                          >
                            <span className={`w-2 h-2 rounded-full ${sub.dotColor} shrink-0 group-hover:scale-125 transition-transform shadow-xs`} />
                            <span className="truncate">{sub.label}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Other Workspace Items (Albums, Videos, Packages, Testimonials, Settings) */}
                {filteredWorkspace.filter(i => i.id !== 'messages').map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;

                  return (
                    <Link
                      key={item.id}
                      to={item.path}
                      className={`group relative flex items-center transition-all duration-200 cursor-pointer ${isCollapsed
                        ? 'justify-center w-10 h-10 mx-auto rounded-full'
                        : 'justify-between px-3 py-2 rounded-full text-xs font-medium'
                        } ${isActive
                          ? 'sidebar-active bg-gold-500/15 dark:bg-white/15 border border-gold-500/30 dark:border-white/20 text-gold-900 dark:text-gold-300 font-bold shadow-xs'
                          : 'text-ink-700 dark:text-ink-300 hover:text-ink-950 dark:hover:text-ink-50 hover:bg-black/[0.05] dark:hover:bg-white/10'
                        }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon className={`w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-110 ${isActive ? 'text-gold-700 dark:text-gold-300' : 'text-ink-500 dark:text-ink-400 group-hover:text-ink-950 dark:group-hover:text-ink-50'
                          }`} />
                        {!isCollapsed && (
                          <span className={`truncate text-xs font-sans tracking-tight ${isActive
                            ? 'text-gold-900 dark:text-gold-200 font-bold'
                            : 'text-ink-50 dark:text-ink-200 group-hover:text-ink-950 dark:group-hover:text-white font-medium'
                            }`}>
                            {item.label}
                          </span>
                        )}
                      </div>

                      {/* Tooltip */}
                      {isCollapsed && (
                        <div className="absolute left-full ml-3 px-3 py-1.5 rounded-lg bg-ink-950/90 text-white text-xs whitespace-nowrap shadow-xl border border-white/15 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 font-sans">
                          {item.label}
                        </div>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* BOTTOM SECTION: Night Mode Switch & User Profile */}
        <div className="p-3 pt-2 shrink-0 border-t border-black/15 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] space-y-1.5">
          {/* Night Mode Switch Row */}
          {isCollapsed ? (
            <button
              onClick={toggleTheme}
              className="w-10 h-10 mx-auto flex items-center justify-center rounded-full bg-black/[0.04] dark:bg-white/5 border border-black/15 dark:border-white/10 text-ink-700 dark:text-ink-300 hover:text-gold-700 dark:hover:text-gold-300 transition-all cursor-pointer"
              title={`Switch to ${isDark ? 'Light' : 'Night'} Mode`}
            >
              {isDark ? <Moon className="w-4 h-4 text-amber-300" /> : <Sun className="w-4 h-4 text-amber-600" />}
            </button>
          ) : (
            <div className="flex items-center justify-between px-3 py-1.5 rounded-full bg-black/[0.04] dark:bg-white/5 border border-black/10 dark:border-white/5">
              <div className="flex items-center gap-2.5 text-xs text-ink-100 dark:text-ink-200 font-medium">
                {isDark ? (
                  <Moon className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                ) : (
                  <Sun className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                )}
                <span className="text-ink-50 dark:text-ink-200 font-medium">Night mode</span>
              </div>

              {/* iOS Glass Style Sliding Switch */}
              <button
                type="button"
                onClick={toggleTheme}
                role="switch"
                aria-checked={isDark}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${isDark ? 'bg-amber-500' : 'bg-black/25'
                  }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${isDark ? 'translate-x-4' : 'translate-x-0'
                    }`}
                />
              </button>
            </div>
          )}

          {/* User Profile Pill Card */}
          <div className="relative">
            <div
              onClick={() => setShowUserMenu(!showUserMenu)}
              className={`flex items-center transition-all rounded-2xl cursor-pointer ${isCollapsed
                ? 'justify-center p-1'
                : 'justify-between p-1.5 hover:bg-black/[0.04] dark:hover:bg-white/5'
                }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="relative shrink-0">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500/30 to-orange-500/40 border border-gold-400/50 flex items-center justify-center text-ink-950 dark:text-gold-300 font-serif font-bold text-xs shadow-inner">
                    {profile?.full_name?.charAt(0).toUpperCase() || (isVendor ? 'V' : 'A')}
                  </div>
                  {/* Green Online Status Dot */}
                  <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 border border-white dark:border-ink-950 shadow-sm" />
                </div>

                {!isCollapsed && (
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-ink-950 dark:text-ink-50 truncate leading-snug">
                      {profile?.full_name || (isVendor ? 'Studio Director' : 'Platform Admin')}
                    </p>
                    <p className="text-[10px] text-ink-500 dark:text-ink-400 font-medium truncate">
                      {profile?.email || (isVendor ? 'vendor@svml.studio' : 'admin@svml.studio')}
                    </p>
                  </div>
                )}
              </div>

              {!isCollapsed && (
                <ChevronsUpDown className="w-3.5 h-3.5 text-ink-500 dark:text-ink-400 shrink-0" />
              )}
            </div>

            {/* User Popover Menu / Logout Action */}
            {showUserMenu && (
              <div
                className={`absolute bottom-full mb-2 rounded-xl bg-white dark:bg-ink-900 border border-black/15 dark:border-white/15 shadow-2xl p-2 z-50 animate-scale-in ${isCollapsed ? 'left-full ml-2 w-48' : 'left-0 right-0'
                  }`}
              >
                <div className="px-2.5 py-1.5 border-b border-black/5 dark:border-white/5 mb-1">
                  <p className="text-xs font-bold text-ink-50 dark:text-ink-100 truncate">
                    {profile?.full_name || 'Signed In'}
                  </p>
                  <p className="text-[10px] text-ink-500 truncate">
                    {role === 'admin' ? 'Platform Administrator' : 'Verified Vendor'}
                  </p>
                </div>

                <Link
                  to="/"
                  target="_blank"
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-ink-700 dark:text-ink-300 hover:bg-black/5 dark:hover:bg-white/5 transition-colors font-medium"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-gold-600 dark:text-gold-400" />
                  <span>View Public Site</span>
                </Link>

                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-red-600 dark:text-red-400 hover:bg-red-500/10 transition-colors font-medium cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
