import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Menu, X, Bell, ArrowLeft } from "lucide-react";
import GlassySidebar from "@/components/common/GlassySidebar";
import ThemeToggle from "@/components/common/ThemeToggle";

function DashboardLayout({ children, navItems, title, role }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="h-screen w-full bg-ink-950 text-ink-100 flex overflow-hidden relative selection:bg-gold-400 selection:text-ink-950 font-sans">
      {/* Studio Ambient Luxury Background Lighting for Realistic Glass Blur */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_15%_10%,rgba(216,179,106,0.08),rgba(0,0,0,0))] dark:bg-[radial-gradient(ellipse_80%_80%_at_15%_10%,rgba(216,179,106,0.1),rgba(0,0,0,0))] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-orange-600/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Glassy SideBar V5 — Desktop */}
      <div className="hidden lg:block shrink-0">
        <GlassySidebar role={role} navItems={navItems} />
      </div>

      {/* Mobile Drawer with Glassy SideBar V5 */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-ink-950/80 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setOpen(false)}
          />
          <div className="relative z-10 w-72 h-full flex items-center">
            <GlassySidebar role={role} navItems={navItems} />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 h-screen flex flex-col overflow-y-auto relative scroll-smooth">
        {/* Glassy Floating Island Header */}
        <header className="sticky top-0 z-30 shrink-0 pl-6 sm:pl-8 pr-4 sm:pr-6 pt-3 sm:pt-4 pb-2 transition-all">
          <div className="rounded-[24px] sm:rounded-full bg-white/90 dark:bg-black/45 backdrop-blur-2xl border border-black/10 dark:border-white/15 px-4 sm:px-6 py-2.5 flex items-center justify-between shadow-[0_15px_35px_rgba(0,0,0,0.06)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            <div className="flex items-center gap-3 sm:gap-4">
              <button
                className="lg:hidden p-2 rounded-full text-ink-500 hover:text-ink-50 hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                onClick={() => setOpen(!open)}
                aria-label="Toggle sidebar"
              >
                {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

              {/* Universal Back Button for All Sidebar Sections */}
              <button
                type="button"
                onClick={() => {
                  if (window.history.length > 1) {
                    navigate(-1);
                  } else {
                    navigate(role === 'admin' ? '/admin/dashboard' : '/vendor/dashboard');
                  }
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/[0.04] dark:bg-white/10 hover:bg-gold-500/15 border border-black/10 dark:border-white/10 text-xs text-ink-50 hover:text-gold-700 dark:hover:text-gold-300 font-bold transition-all shadow-2xs hover:scale-105 active:scale-95 cursor-pointer shrink-0"
                title="Go back to dashboard"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-ink-50 group-hover:text-gold-600 dark:group-hover:text-gold-300 stroke-[2.5] transition-transform group-hover:-translate-x-0.5" />
                <span className="font-sans">Back</span>
              </button>

              <h1 className="font-serif text-lg sm:text-xl text-ink-50 font-normal tracking-tight">{title}</h1>
            </div>

            <div className="flex items-center gap-2.5">
              <ThemeToggle />
              <button
                className="relative w-9 h-9 rounded-full flex items-center justify-center border border-black/15 dark:border-white/15 bg-black/[0.04] dark:bg-white/5 text-ink-50 hover:bg-gold-500/10 hover:border-gold-500/40 hover:text-gold-700 dark:hover:text-gold-300 transition-all cursor-pointer shadow-2xs hover:scale-105 active:scale-95"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-gold-500 ring-2 ring-white dark:ring-black animate-pulse" />
              </button>
            </div>
          </div>
        </header>
        <main className="flex-1 p-6 sm:p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}

export default DashboardLayout;
