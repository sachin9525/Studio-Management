import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";
function ProtectedRoute({ children, role }) {
  const { user, profile, loading } = useAuth();
  if (loading) {
    return <div className="min-h-screen bg-ink-950 flex items-center justify-center"><Loader2 className="w-8 h-8 text-gold-400 animate-spin" /></div>;
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
  useEffect(() => {
    refreshProfile();
    const interval = setInterval(refreshProfile, 10000);
    return () => clearInterval(interval);
  }, [refreshProfile]);

  return <div className="min-h-screen bg-ink-950 flex items-center justify-center px-6"><div className="text-center max-w-md">
    <div className="w-16 h-16 rounded-full bg-gold-400/10 border border-gold-400/20 flex items-center justify-center mx-auto mb-6"><Loader2 className="w-8 h-8 text-gold-400" /></div>
    <h1 className="font-serif text-3xl text-ink-50 mb-3">Awaiting Approval</h1>
    <p className="text-ink-400 mb-8">Your studio account is waiting for platform admin approval. This page checks for updates automatically.</p>
    <button
      onClick={() => signOut()}
      className="text-xs uppercase tracking-widest text-gold-400 hover:text-gold-300 transition-colors"
    >Sign Out</button>
  </div></div>;
}
function Suspended() {
  const { signOut } = useAuth();
  return <div className="min-h-screen bg-ink-950 flex items-center justify-center px-6"><div className="text-center max-w-md">
    <h1 className="font-serif text-3xl text-ink-50 mb-3">Account Suspended</h1>
    <p className="text-ink-400 mb-8">Your studio account has been suspended. Please contact the platform administrator for assistance.</p>
    <button
      onClick={() => signOut()}
      className="text-xs uppercase tracking-widest text-gold-400 hover:text-gold-300 transition-colors"
    >Sign Out</button>
  </div></div>;
}
export {
  ProtectedRoute as default
};
