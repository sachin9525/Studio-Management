import { useCallback, useEffect, useState } from 'react';
import {
  Camera,
  Check,
  CheckCircle2,
  Mail,
  MapPin,
  Phone,
  RefreshCw,
  Save,
  Shield,
  Sparkles,
  Store,
  User,
} from 'lucide-react';
import { VendorLayout } from '@/vendor/components';
import { useAuth } from '@/context/AuthContext';
import { apiRequest } from '@/utils/api';

const fields = [
  ['fullName', 'Owner / Lead Artist Name', 120, 'e.g. Rohan Sharma'],
  ['studioName', 'Official Studio Brand Name', 120, 'e.g. Royal Heritage Frames'],
  ['phone', 'Direct Studio Phone Number', 40, 'e.g. +91 98765 43210'],
  ['city', 'City', 100, 'e.g. Jaipur'],
  ['state', 'State', 100, 'e.g. Rajasthan'],
  ['address', 'Full Studio / Office Address', 200, 'e.g. 42 Palace Road, C-Scheme'],
];

const blankProfile = Object.fromEntries(fields.map(([name]) => [name, '']));

const inputClass =
  'w-full rounded-full border border-black/15 dark:border-white/15 bg-white/90 dark:bg-black/40 px-4 py-2.5 text-xs text-ink-50 placeholder:text-ink-400 focus:outline-none focus:border-gold-500/60 shadow-inner transition-colors';

function VendorProfile() {
  const { session, refreshProfile } = useAuth();
  const [profile, setProfile] = useState(blankProfile);
  const [account, setAccount] = useState({ email: '', status: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  const loadProfile = useCallback(async () => {
    if (!session?.token) return;
    setLoading(true);
    setError('');
    try {
      const data = await apiRequest('/vendor/profile', { token: session.token });
      setProfile(Object.fromEntries(fields.map(([name]) => [name, data.profile[name] || ''])));
      setAccount({ email: data.profile.email, status: data.profile.status });
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to load studio profile.');
    } finally {
      setLoading(false);
    }
  }, [session?.token]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    setSaved(false);
    try {
      const data = await apiRequest('/vendor/profile', {
        method: 'PUT',
        token: session.token,
        body: JSON.stringify(profile),
      });
      setProfile(Object.fromEntries(fields.map(([name]) => [name, data.profile[name] || ''])));
      setAccount({ email: data.profile.email, status: data.profile.status });
      await refreshProfile();
      setSaved(true);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to save studio profile.');
    } finally {
      setSaving(false);
    }
  };

  const filledCount = Object.values(profile).filter(Boolean).length;
  const completeness = Math.round((filledCount / fields.length) * 100);

  return (
    <VendorLayout title="Studio Profile">
      {/* Top Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-700 dark:text-gold-300 text-[10px] font-mono uppercase tracking-widest font-bold flex items-center gap-1.5 shadow-2xs">
              <Sparkles className="w-3 h-3 text-gold-600 dark:text-gold-400" />
              Brand & Contact Settings
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-ink-50 font-normal tracking-tight">Studio Profile</h2>
          <p className="text-xs sm:text-sm text-ink-500 dark:text-ink-400 mt-1 max-w-2xl font-medium">
            Manage your official studio identity, contact lines, and presence across the platform.
          </p>
        </div>

        <button
          type="button"
          onClick={loadProfile}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-black/15 dark:border-white/15 bg-white/80 dark:bg-white/5 text-xs text-ink-50 font-medium hover:bg-gold-500/10 hover:border-gold-500/40 transition-colors shadow-2xs cursor-pointer self-start md:self-auto disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {error && (
        <div role="alert" className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-xs font-semibold text-red-600 dark:text-red-400">
          <span>{error}</span>
          <button type="button" onClick={loadProfile} className="underline underline-offset-4 cursor-pointer">Try again</button>
        </div>
      )}

      {saved && (
        <div role="status" className="mb-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          <span>Studio profile updated successfully.</span>
        </div>
      )}

      {/* 4 Glassy Stat Capsules */}
      <div className="mb-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {[
          ['Account Status', account.status || 'Active', 'Verified Vendor'],
          ['Completeness', `${completeness}%`, `${filledCount} of ${fields.length} details`],
          ['Headquarters', profile.city ? `${profile.city}, ${profile.state}` : 'Location pending', 'Primary Base'],
          ['Contact Phone', profile.phone || 'Not added', 'Inquiry helpline'],
        ].map(([label, value, subtext], idx) => (
          <div
            key={label}
            className="relative rounded-[24px] p-4 sm:p-5 border bg-white/90 dark:bg-black/45 backdrop-blur-2xl border-black/10 dark:border-white/15 shadow-[0_15px_30px_rgba(0,0,0,0.06)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden group hover:-translate-y-0.5 transition-all"
          >
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-amber-500/10 dark:bg-amber-400/10 rounded-full blur-xl group-hover:bg-amber-500/20 transition-all pointer-events-none" />
            <div className="flex items-center justify-between mb-2 relative z-10">
              <span className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500/20 to-orange-500/20 border border-gold-400/30 text-gold-700 dark:text-gold-300 flex items-center justify-center font-bold text-xs shadow-2xs">
                {idx + 1}
              </span>
              <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-black/[0.04] dark:bg-white/10 border border-black/10 dark:border-white/15 text-ink-600 dark:text-ink-300">
                {subtext}
              </span>
            </div>
            <div className="relative z-10">
              <p className="font-serif text-xl sm:text-2xl text-ink-50 font-normal tracking-tight group-hover:text-gold-700 dark:group-hover:text-gold-300 transition-colors truncate capitalize">
                {value}
              </p>
              <p className="mt-1 text-[10px] uppercase font-mono font-bold tracking-widest text-ink-500 dark:text-ink-400">
                {label}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Profile Form Card */}
      <form
        onSubmit={handleSubmit}
        className="max-w-4xl rounded-[28px] border border-black/10 dark:border-white/15 bg-white/90 dark:bg-black/45 backdrop-blur-2xl p-7 sm:p-9 shadow-[0_20px_50px_rgba(0,0,0,0.06)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden"
      >
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-amber-500/10 dark:bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

        {loading ? (
          <div className="py-20 text-center text-sm text-ink-500 dark:text-ink-400 font-mono">Loading profile data…</div>
        ) : (
          <div className="relative z-10">
            <div className="mb-8 flex items-center gap-4 pb-6 border-b border-black/10 dark:border-white/10">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-gold-500/20 to-amber-500/10 border border-gold-400/30 flex items-center justify-center text-gold-700 dark:text-gold-300 font-serif text-2xl font-normal shadow-md">
                {profile.studioName?.charAt(0)?.toUpperCase() || profile.fullName?.charAt(0)?.toUpperCase() || 'S'}
              </div>
              <div>
                <h3 className="font-serif text-2xl text-ink-50 font-normal">
                  {profile.studioName || 'Studio Information'}
                </h3>
                <p className="text-xs text-ink-500 dark:text-ink-400 font-mono mt-0.5">Owner: {profile.fullName || 'Studio Artist'}</p>
              </div>
            </div>

            <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
              {fields.map(([name, label, maxLength, placeholder]) => (
                <label key={name} className={`block ${name === 'address' ? 'sm:col-span-2' : ''}`}>
                  <span className="mb-1.5 block text-[10px] font-mono uppercase tracking-widest text-ink-500 dark:text-ink-400 font-bold">{label} *</span>
                  <input
                    type="text"
                    name={name}
                    value={profile[name]}
                    placeholder={placeholder}
                    onChange={(event) => {
                      setProfile((current) => ({ ...current, [name]: event.target.value }));
                      setSaved(false);
                    }}
                    maxLength={maxLength}
                    required={['fullName', 'studioName', 'phone'].includes(name)}
                    className={inputClass}
                  />
                </label>
              ))}
            </div>

            {/* Account Credentials Summary Card */}
            <div className="grid grid-cols-1 gap-4 border border-black/10 dark:border-white/10 pt-6 sm:grid-cols-2 bg-black/[0.02] dark:bg-white/[0.02] p-5 rounded-[22px] mb-8">
              <div>
                <p className="mb-1 text-[10px] font-mono uppercase tracking-widest text-ink-500 dark:text-ink-400 font-bold">Account Sign-in Email</p>
                <p className="text-sm font-semibold text-ink-50 font-sans">{account.email}</p>
                <p className="mt-1 text-xs text-ink-500 dark:text-ink-400">Associated login email; contact admin to modify.</p>
              </div>
              <div>
                <p className="mb-1 text-[10px] font-mono uppercase tracking-widest text-ink-500 dark:text-ink-400 font-bold">Verification & Tier</p>
                <div className="flex items-center gap-2">
                  <span className="capitalize text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    {account.status || 'Active'}
                  </span>
                  <span className="text-ink-400">·</span>
                  <span className="text-xs font-mono font-bold text-gold-700 dark:text-gold-300">Certified Studio</span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-gold-500 to-gold-400 px-7 py-3 text-xs font-bold uppercase tracking-wider text-ink-950 hover:brightness-110 hover:scale-[1.02] disabled:opacity-50 transition-all shadow-lg shadow-gold-500/25 cursor-pointer"
            >
              <Save className="h-4 w-4" />
              <span>{saving ? 'Saving Profile…' : 'Save Studio Profile'}</span>
            </button>
          </div>
        )}
      </form>
    </VendorLayout>
  );
}

export default VendorProfile;