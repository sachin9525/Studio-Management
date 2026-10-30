import { useCallback, useEffect, useState } from 'react';
import { Check, Save } from 'lucide-react';
import DashboardLayout from '@/components/common/DashboardLayout';
import { adminNavItems } from '@/data/navConfig';
import { useAuth } from '@/context/AuthContext';
import { apiRequest } from '@/utils/api';

const fields = [
  ['brandName', 'Studio name'],
  ['contactEmail', 'Contact email', 'email'],
  ['bookingEmail', 'Booking email', 'email'],
  ['phone', 'Phone'],
  ['whatsappNumber', 'WhatsApp number'],
  ['streetAddress', 'Street address'],
  ['city', 'City'],
  ['state', 'State'],
  ['postalCode', 'Postal code'],
  ['businessHours', 'Business hours'],
];

const emptySettings = Object.fromEntries(fields.map(([name]) => [name, '']));
const inputClass = 'w-full rounded-sm border border-white/10 bg-ink-900 px-3 py-2.5 text-sm text-ink-100 focus:border-gold-400 focus:outline-none';

function AdminSettings() {
  const { session } = useAuth();
  const [settings, setSettings] = useState(emptySettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  const loadSettings = useCallback(async () => {
    if (!session?.token) return;
    setLoading(true);
    setError('');
    try {
      const data = await apiRequest('/admin/settings', { token: session.token });
      setSettings(Object.fromEntries(fields.map(([name]) => [name, data[name] || ''])));
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to load settings.');
    } finally {
      setLoading(false);
    }
  }, [session?.token]);

  useEffect(() => { loadSettings(); }, [loadSettings]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    setSaved(false);
    try {
      const data = await apiRequest('/admin/settings', {
        method: 'PUT',
        token: session.token,
        body: JSON.stringify(settings),
      });
      setSettings(Object.fromEntries(fields.map(([name]) => [name, data.settings[name] || ''])));
      setSaved(true);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to save settings.');
    } finally {
      setSaving(false);
    }
  };

  return <DashboardLayout navItems={adminNavItems} title="Settings" role="admin">
    <div className="mb-8">
      <h2 className="mb-1 font-serif text-3xl text-ink-50">Studio Settings</h2>
      <p className="text-sm text-ink-400">Manage the studio details shown on the public contact page.</p>
    </div>
    {error && <p role="alert" className="mb-5 rounded-sm border border-red-400/20 bg-red-400/5 p-4 text-sm text-red-300">{error}</p>}
    {saved && <p role="status" className="mb-5 flex items-center gap-2 rounded-sm border border-green-400/20 bg-green-400/5 p-4 text-sm text-green-300"><Check className="h-4 w-4" /> Settings saved.</p>}
    <form onSubmit={handleSubmit} className="max-w-4xl rounded-sm border border-white/5 bg-ink-800 p-5 md:p-7">
      {loading ? <p className="py-12 text-center text-sm text-ink-400">Loading settings…</p> : <>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {fields.map(([name, label, type = 'text']) => <label key={name} className="block">
            <span className="mb-2 block text-[10px] uppercase tracking-widest text-ink-400">{label}</span>
            <input
              type={type}
              name={name}
              value={settings[name]}
              onChange={(event) => {
                setSettings((current) => ({ ...current, [name]: event.target.value }));
                setSaved(false);
              }}
              required={['brandName', 'contactEmail', 'phone'].includes(name)}
              maxLength={name === 'brandName' ? 80 : undefined}
              className={inputClass}
            />
          </label>)}
        </div>
        <div className="mt-7 flex items-center gap-4">
          <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-sm bg-gold-400 px-4 py-2.5 text-xs font-medium uppercase tracking-widest text-ink-950 hover:bg-gold-300 disabled:opacity-50">
            <Save className="h-4 w-4" /> {saving ? 'Saving…' : 'Save settings'}
          </button>
          <span className="text-xs text-ink-500">Changes appear on the public contact page.</span>
        </div>
      </>}
    </form>
  </DashboardLayout>;
}

export default AdminSettings;
