import { useCallback, useEffect, useState } from 'react';
import { Check, Save } from 'lucide-react';
import { VendorLayout } from '@/vendor/components';
import { useAuth } from '@/context/AuthContext';
import { apiRequest } from '@/utils/api';

const fields = [
  ['fullName', 'Owner name', 120],
  ['studioName', 'Studio name', 120],
  ['phone', 'Phone number', 40],
  ['address', 'Street address', 200],
  ['city', 'City', 100],
  ['state', 'State', 100],
];
const blankProfile = Object.fromEntries(fields.map(([name]) => [name, '']));
const inputClass = 'w-full rounded-sm border border-white/10 bg-ink-900 px-3 py-2.5 text-sm text-ink-100 focus:border-gold-400 focus:outline-none';

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

  return <VendorLayout title="Studio Profile">
    <div className="mb-8">
      <h2 className="mb-1 font-serif text-3xl text-ink-50">Studio Profile</h2>
      <p className="text-sm text-ink-400">Keep your studio and contact information up to date.</p>
    </div>
    {error && <p role="alert" className="mb-5 rounded-sm border border-red-400/20 bg-red-400/5 p-4 text-sm text-red-300">{error}</p>}
    {saved && <p role="status" className="mb-5 flex items-center gap-2 rounded-sm border border-green-400/20 bg-green-400/5 p-4 text-sm text-green-300"><Check className="h-4 w-4" /> Profile saved successfully.</p>}

    <form onSubmit={handleSubmit} className="max-w-4xl rounded-sm border border-white/5 bg-ink-800 p-5 md:p-7">
      {loading ? <p className="py-12 text-center text-sm text-ink-400">Loading profile…</p> : <>
        <div className="mb-7 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {fields.map(([name, label, maxLength]) => <label key={name} className="block">
            <span className="mb-2 block text-[10px] uppercase tracking-widest text-ink-400">{label}</span>
            <input
              type="text"
              name={name}
              value={profile[name]}
              onChange={(event) => {
                setProfile((current) => ({ ...current, [name]: event.target.value }));
                setSaved(false);
              }}
              maxLength={maxLength}
              required={['fullName', 'studioName', 'phone'].includes(name)}
              className={inputClass}
            />
          </label>)}
        </div>

        <div className="grid grid-cols-1 gap-5 border-t border-white/5 pt-6 sm:grid-cols-2">
          <div>
            <p className="mb-2 text-[10px] uppercase tracking-widest text-ink-500">Account email</p>
            <p className="text-sm text-ink-300">{account.email}</p>
            <p className="mt-1 text-xs text-ink-500">Used to sign in; contact admin to change it.</p>
          </div>
          <div>
            <p className="mb-2 text-[10px] uppercase tracking-widest text-ink-500">Account status</p>
            <p className="capitalize text-sm text-green-400">{account.status}</p>
          </div>
        </div>

        <button type="submit" disabled={saving} className="mt-7 inline-flex items-center gap-2 rounded-sm bg-gold-400 px-4 py-2.5 text-xs font-medium uppercase tracking-widest text-ink-950 hover:bg-gold-300 disabled:opacity-50">
          <Save className="h-4 w-4" /> {saving ? 'Saving…' : 'Save profile'}
        </button>
      </>}
    </form>
  </VendorLayout>;
}

export default VendorProfile;
