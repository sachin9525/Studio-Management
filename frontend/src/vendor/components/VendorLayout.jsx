import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Camera, LogOut, Menu, X, Bell } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { vendorNavItems } from '@/data/navConfig';

function VendorLayout({ children, navItems = vendorNavItems, title = 'Vendor Dashboard' }) {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-ink-950 flex">
      {/* Sidebar — desktop */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-64 bg-ink-900 border-r border-white/5 flex flex-col transition-transform duration-300 ${
          open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-6 border-b border-white/5">
          <Link to="/" className="flex items-center gap-2.5">
            <Camera className="w-6 h-6 text-gold-400" />
            <div>
              <span className="font-serif text-lg text-ink-50 block leading-tight">
                SVML<span className="text-gold-400">.</span>
              </span>
              <span className="text-[9px] uppercase tracking-widest text-gold-400">
                Vendor Panel
              </span>
            </div>
          </Link>
        </div>
        <nav className="flex-1 overflow-y-auto py-4 no-scrollbar">
          <ul className="space-y-1 px-3">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm text-ink-400 hover:text-gold-400 hover:bg-white/5 transition-colors"
                >
                  <span className="shrink-0">{item.icon}</span>
                  <span className="text-xs uppercase tracking-widest">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3 mb-3 px-2">
            <div className="w-9 h-9 rounded-full bg-gold-400/20 border border-gold-400/30 flex items-center justify-center text-gold-400 font-serif text-sm">
              {profile?.full_name?.charAt(0).toUpperCase() ?? 'V'}
            </div>
            <div className="min-w-0">
              <p className="text-xs text-ink-200 truncate">{profile?.full_name ?? 'Studio Vendor'}</p>
              <p className="text-[10px] text-ink-500 truncate">{profile?.email}</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-sm text-xs uppercase tracking-widest text-ink-400 hover:text-red-400 hover:bg-red-500/5 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {open && (
        <div className="fixed inset-0 bg-ink-950/60 z-30 lg:hidden" onClick={() => setOpen(false)} />
      )}

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-ink-900/80 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden text-ink-300"
              onClick={() => setOpen(!open)}
              aria-label="Toggle sidebar"
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <h1 className="font-serif text-xl text-ink-50">{title}</h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              className="relative text-ink-400 hover:text-gold-400 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-gold-400" />
            </button>
          </div>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}

export default VendorLayout;

