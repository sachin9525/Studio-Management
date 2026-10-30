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
const inputClass = 'w-full rounded-sm border border-white/10 bg-ink-900 px-3.5 py-2.5 text-sm text-ink-100 focus:border-gold-400 focus:outline-none transition-colors';

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

  useEffect(() => { loadProfile(); }, [loadProfile]);

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
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded-full bg-gold-400/10 border border-gold-400/20 text-gold-300 text-[10px] uppercase tracking-widest font-semibold flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5 text-gold-400" />
              Brand & Contact Settings
            </span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl text-ink-50 mb-1">Studio Profile</h2>
          <p className="text-xs sm:text-sm text-ink-400">
            Manage your official studio identity, contact lines, and presence across the platform.
          </p>
        </div>

        <button
          type="button"
          onClick={loadProfile}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-sm border border-white/10 px-3 py-1.5 text-xs text-ink-300 transition-colors hover:border-gold-400/40 hover:text-gold-300 disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {error && (
        <div role="alert" className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-sm border border-red-400/20 bg-red-400/5 p-4 text-sm text-red-300">
          <span>{error}</span>
          <button type="button" onClick={loadProfile} className="underline underline-offset-4">Try again</button>
        </div>
      )}

      {saved && (
        <div role="status" className="mb-6 rounded-sm border border-emerald-400/20 bg-emerald-400/10 p-3 text-xs text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Studio profile updated successfully.</span>
        </div>
      )}

      {/* Symmetrical Metric Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-3.5 mb-8">
        <div className="p-3.5 sm:p-4 rounded-sm bg-gradient-to-br from-gold-400/15 via-ink-900/90 to-ink-900 border border-gold-400/30 backdrop-blur-md">
          <span className="text-[10px] uppercase tracking-wider text-gold-400 block mb-1 font-semibold">Account Status</span>
          <p className="font-serif text-xl sm:text-2xl text-gold-300 leading-none capitalize">
            {account.status || 'Active'}
          </p>
          <p className="text-[10px] text-emerald-400 mt-1 font-medium flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Verified Vendor
          </p>
        </div>
        <div className="p-3.5 sm:p-4 rounded-sm bg-ink-900/80 border border-white/5 backdrop-blur-md">
          <span className="text-[10px] uppercase tracking-wider text-ink-500 block mb-1 font-medium">Profile Completeness</span>
          <p className="font-serif text-2xl sm:text-3xl text-ink-50 leading-none">{completeness}%</p>
          <p className="text-[10px] text-emerald-400 mt-1 font-medium">{filledCount} of {fields.length} details filled</p>
        </div>
        <div className="p-3.5 sm:p-4 rounded-sm bg-ink-900/80 border border-white/5 backdrop-blur-md">
          <span className="text-[10px] uppercase tracking-wider text-ink-500 block mb-1 font-medium">Headquarters</span>
          <p className="font-serif text-xl sm:text-2xl text-ink-50 leading-none truncate">
            {profile.city ? `${profile.city}, ${profile.state}` : 'Location pending'}
          </p>
          <p className="text-[10px] text-ink-500 mt-1">Primary coverage base</p>
        </div>
        <div className="p-3.5 sm:p-4 rounded-sm bg-ink-900/80 border border-white/5 backdrop-blur-md">
          <span className="text-[10px] uppercase tracking-wider text-ink-500 block mb-1 font-medium">Contact Phone</span>
          <p className="font-serif text-lg sm:text-xl text-gold-400 leading-none truncate">
            {profile.phone || 'Not added'}
          </p>
          <p className="text-[10px] text-ink-500 mt-1">Inquiry helpline</p>
        </div>
      </div>

      {/* Main Profile Form */}
      <form onSubmit={handleSubmit} className="max-w-4xl rounded-sm border border-white/5 bg-ink-900/80 backdrop-blur-md p-6 sm:p-8 shadow-xl">
        {loading ? (
          <div className="py-16 text-center text-sm text-ink-400">Loading profile data…</div>
        ) : (
          <>
            <div className="mb-6 flex items-center gap-3 pb-4 border-b border-white/5">
              <div className="w-12 h-12 rounded-full bg-gold-400/10 border border-gold-400/30 flex items-center justify-center text-gold-400 font-serif text-xl font-bold">
                {profile.studioName?.charAt(0)?.toUpperCase() || profile.fullName?.charAt(0)?.toUpperCase() || 'S'}
              </div>
              <div>
                <h3 className="font-serif text-xl text-ink-50 font-normal">
                  {profile.studioName || 'Studio Information'}
                </h3>
                <p className="text-xs text-ink-400">Owner: {profile.fullName || 'Studio Artist'}</p>
              </div>
            </div>

            <div className="mb-7 grid grid-cols-1 gap-5 sm:grid-cols-2">
              {fields.map(([name, label, maxLength, placeholder]) => (
                <label key={name} className={`block ${name === 'address' ? 'sm:col-span-2' : ''}`}>
                  <span className="mb-1.5 block text-[10px] uppercase tracking-wider text-ink-400 font-medium">{label} *</span>
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

            {/* Account Credentials Summary */}
            <div className="grid grid-cols-1 gap-4 border-t border-white/5 pt-6 sm:grid-cols-2 bg-ink-950/40 p-4 rounded-sm mb-6">
              <div>
                <p className="mb-1 text-[10px] uppercase tracking-wider text-ink-500 font-semibold">Account Sign-in Email</p>
                <p className="text-sm font-medium text-ink-200">{account.email}</p>
                <p className="mt-1 text-[11px] text-ink-500">Associated login email; contact admin to modify.</p>
              </div>
              <div>
                <p className="mb-1 text-[10px] uppercase tracking-wider text-ink-500 font-semibold">Verification & Tier</p>
                <div className="flex items-center gap-2">
                  <span className="capitalize text-xs font-semibold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {account.status || 'Active'}
                  </span>
                  <span className="text-ink-600">·</span>
                  <span className="text-xs text-gold-300">Certified Studio</span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-sm bg-gradient-to-r from-gold-500 to-gold-400 px-5 py-2.5 text-xs font-medium uppercase tracking-wider text-ink-950 hover:brightness-110 disabled:opacity-50 transition-all shadow-md shadow-gold-500/10"
            >
              <Save className="h-4 w-4" />
              <span>{saving ? 'Saving Profile…' : 'Save Studio Profile'}</span>
            </button>
          </>
        )}
      </form>
    </VendorLayout>
  );
}

export default VendorProfile;
