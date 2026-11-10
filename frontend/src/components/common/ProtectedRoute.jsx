import { useState, useEffect } from "react";
import { Navigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import ThemeToggle from "@/components/common/ThemeToggle";
import { Loader2, Clock, ShieldAlert, LogOut, RefreshCw, Home } from "lucide-react";

function ProtectedRoute({ children, role }) {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f5f0] dark:bg-[#07090e] flex items-center justify-center transition-colors">
        <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
      </div>
    );
  }

  if (!user) {
    const loginPath = role === "admin" ? "/admin/login" : "/vendor/login";
    return <Navigate to={loginPath} replace />;
  }

  if (role && profile?.role !== role) {
    const correctDashboard = profile?.role === "admin" ? "/admin/dashboard" : "/vendor/dashboard";
    return <Navigate to={correctDashboard} replace />;
  }

  if (role === "vendor" && profile?.status === "pending") {
    return <PendingApproval />;
  }

  if (role === "vendor" && profile?.status === "suspended") {
    return <Suspended />;
  }

  return <>{children}</>;
}

function PendingApproval() {
  const { signOut, refreshProfile } = useAuth();
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    refreshProfile();
    const interval = setInterval(refreshProfile, 10000);
    return () => clearInterval(interval);
  }, [refreshProfile]);

  const handleManualCheck = async () => {
    setChecking(true);
    await refreshProfile();
    setTimeout(() => setChecking(false), 600);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between p-6 sm:p-10 bg-[#f7f5f0] dark:bg-[#07090e] text-[#1c1815] dark:text-[#f3f0ea] transition-colors duration-300 overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] bg-amber-500/10 dark:bg-amber-400/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Top Bar */}
      <header className="relative z-10 w-full max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 dark:bg-amber-400/10 border border-amber-500/20 flex items-center justify-center text-amber-700 dark:text-amber-400 font-serif font-bold text-lg">
            V
          </div>
          <div>
            <span className="block font-serif text-sm font-semibold tracking-wide text-[#1c1815] dark:text-[#f8f6f0]">
              Vertix SVML
            </span>
            <span className="block text-[10px] font-sans uppercase tracking-[0.2em] text-[#857b70] dark:text-[#788094]">
              Studio Portal
            </span>
          </div>
        </div>
        <ThemeToggle />
      </header>

      {/* Center Card */}
      <main className="relative z-10 w-full max-w-lg mx-auto my-auto text-center py-8">
        <div className="rounded-[32px] p-8 sm:p-10 bg-white/75 dark:bg-[#10141d]/85 backdrop-blur-2xl border border-[#241c14]/10 dark:border-white/10 shadow-2xl">
          {/* Status Icon */}
          <div className="w-16 h-16 rounded-full bg-amber-500/10 dark:bg-amber-400/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-6 text-amber-600 dark:text-amber-400">
            <Clock className="w-8 h-8 animate-pulse" />
          </div>

          <span className="inline-block text-[11px] font-sans font-bold uppercase tracking-[0.2em] text-amber-600 dark:text-amber-400 bg-amber-500/10 px-3.5 py-1 rounded-full mb-3 border border-amber-500/20">
            Verification Pending
          </span>

          <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-[#1c1815] dark:text-[#f8f6f0] mb-3">
            Awaiting Approval
          </h1>

          <p className="font-sans text-sm text-[#60554b] dark:text-[#9ea3b0] max-w-md mx-auto leading-relaxed mb-8">
            Your studio registration is being verified by the platform administrators. This view automatically refreshes every few moments once your studio is approved.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleManualCheck}
              disabled={checking}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-xs font-sans font-bold tracking-wider uppercase bg-[#1c1815] text-[#f7f5f0] hover:bg-black dark:bg-[#e8be74] dark:text-[#0b0e14] dark:hover:bg-[#f3ce8a] transition-all shadow-md active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${checking ? "animate-spin" : ""}`} />
              {checking ? "Checking..." : "Check Status Now"}
            </button>

            <button
              type="button"
              onClick={() => signOut()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-xs font-sans font-bold tracking-wider uppercase bg-black/5 hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10 text-[#302720] dark:text-[#d8dce6] border border-[#241c14]/10 dark:border-white/10 transition-all active:scale-95"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>
        </div>
      </main>

      <footer className="relative z-10 w-full max-w-6xl mx-auto text-center text-xs font-sans text-[#8a7f73] dark:text-[#6c7487]">
        <p>&copy; {new Date().getFullYear()} Vertix Studio Management. All rights reserved.</p>
      </footer>
    </div>
  );
}

function Suspended() {
  const { signOut } = useAuth();

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between p-6 sm:p-10 bg-[#f7f5f0] dark:bg-[#07090e] text-[#1c1815] dark:text-[#f3f0ea] transition-colors duration-300 overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] bg-rose-500/10 dark:bg-rose-500/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Top Bar */}
      <header className="relative z-10 w-full max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-600 dark:text-rose-400 font-serif font-bold text-lg">
            V
          </div>
          <div>
            <span className="block font-serif text-sm font-semibold tracking-wide text-[#1c1815] dark:text-[#f8f6f0]">
              Vertix SVML
            </span>
            <span className="block text-[10px] font-sans uppercase tracking-[0.2em] text-[#857b70] dark:text-[#788094]">
              Studio Portal
            </span>
          </div>
        </div>
        <ThemeToggle />
      </header>

      {/* Center Card */}
      <main className="relative z-10 w-full max-w-lg mx-auto my-auto text-center py-8">
        <div className="rounded-[32px] p-8 sm:p-10 bg-white/75 dark:bg-[#10141d]/85 backdrop-blur-2xl border border-[#241c14]/10 dark:border-white/10 shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mx-auto mb-6 text-rose-600 dark:text-rose-400">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <span className="inline-block text-[11px] font-sans font-bold uppercase tracking-[0.2em] text-rose-600 dark:text-rose-400 bg-rose-500/10 px-3.5 py-1 rounded-full mb-3 border border-rose-500/20">
            Account Inactive
          </span>

          <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-[#1c1815] dark:text-[#f8f6f0] mb-3">
            Account Suspended
          </h1>

          <p className="font-sans text-sm text-[#60554b] dark:text-[#9ea3b0] max-w-md mx-auto leading-relaxed mb-8">
            Access to your studio account has been temporarily restricted. Please contact the platform administration for assistance or questions regarding your account status.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => signOut()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-xs font-sans font-bold tracking-wider uppercase bg-[#1c1815] text-[#f7f5f0] hover:bg-black dark:bg-[#e8be74] dark:text-[#0b0e14] dark:hover:bg-[#f3ce8a] transition-all shadow-md active:scale-95"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>

            <Link
              to="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-xs font-sans font-bold tracking-wider uppercase bg-black/5 hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10 text-[#302720] dark:text-[#d8dce6] border border-[#241c14]/10 dark:border-white/10 transition-all active:scale-95"
            >
              <Home className="w-3.5 h-3.5" />
              Return Home
            </Link>
          </div>
        </div>
      </main>

      <footer className="relative z-10 w-full max-w-6xl mx-auto text-center text-xs font-sans text-[#8a7f73] dark:text-[#6c7487]">
        <p>&copy; {new Date().getFullYear()} Vertix Studio Management. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default ProtectedRoute;
