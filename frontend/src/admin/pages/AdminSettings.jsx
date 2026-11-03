import { useCallback, useEffect, useState } from 'react';
import { Check, Save, Sparkles, Sliders } from 'lucide-react';
import { AdminLayout } from '@/admin/components';
import { useAuth } from '@/context/AuthContext';
import { apiRequest } from '@/utils/api';

const fields = [
  ['brandName', 'Studio / Platform Name'],
  ['contactEmail', 'Contact Support Email', 'email'],
  ['bookingEmail', 'Direct Booking Email', 'email'],
  ['phone', 'Primary Phone Number'],
  ['whatsappNumber', 'WhatsApp Concierge Number'],
  ['streetAddress', 'Studio Headquarters Address'],
  ['city', 'City'],
  ['state', 'State / Region'],
  ['postalCode', 'Postal Code'],
  ['businessHours', 'Studio Business Hours'],
];

const emptySettings = Object.fromEntries(fields.map(([name]) => [name, '']));
const inputClass = 'w-full rounded-full border border-black/15 dark:border-white/15 bg-white dark:bg-black/50 px-4 py-2.5 text-xs text-ink-50 placeholder:text-ink-400 focus:border-gold-500 focus:outline-none shadow-inner transition-colors';

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

  return (
    <AdminLayout title="Settings">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="px-3 py-1 rounded-full bg-gold-400/10 border border-gold-400/25 text-gold-700 dark:text-gold-300 text-[10px] uppercase font-mono tracking-widest font-bold flex items-center gap-1.5 shadow-2xs">
            <Sparkles className="w-3 h-3 text-gold-600 dark:text-gold-400" />
            Platform Configuration
          </span>
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl text-ink-50 font-normal tracking-tight">Studio & Contact Settings</h2>
        <p className="text-xs sm:text-sm text-ink-500 dark:text-ink-400 mt-1 max-w-2xl font-medium">
          Manage the public studio brand details, concierge contact channels, and headquarters address displayed on the landing page.
        </p>
      </div>

      {error && (
        <p role="alert" className="mb-5 rounded-2xl border border-red-500/20 bg-red-500/5 p-4 text-xs font-semibold text-red-600 dark:text-red-300 shadow-xs">
          {error}
        </p>
      )}

      {saved && (
        <p role="status" className="mb-5 flex items-center gap-2 rounded-2xl border border-emerald-500/25 bg-emerald-500/10 p-4 text-xs font-bold text-emerald-700 dark:text-emerald-300 shadow-xs">
          <Check className="h-4 w-4" /> Studio settings saved successfully.
        </p>
      )}

      <form
        onSubmit={handleSubmit}
        className="relative max-w-4xl rounded-[28px] border border-black/10 dark:border-white/15 bg-white/90 dark:bg-black/45 backdrop-blur-2xl p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.06)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden"
      >
        <div className="absolute -top-16 -right-16 w-40 h-40 bg-amber-500/10 dark:bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

        {loading ? (
          <p className="py-16 text-center text-xs font-mono font-bold text-ink-500 animate-pulse">Loading studio configuration…</p>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 relative z-10">
              {fields.map(([name, label, type = 'text']) => (
                <label key={name} className="block">
                  <span className="mb-1.5 block text-[10px] uppercase font-mono font-bold tracking-widest text-ink-500">
                    {label} {['brandName', 'contactEmail', 'phone'].includes(name) ? '*' : ''}
                  </span>
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
                </label>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-black/10 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-gold-500 to-gold-400 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-ink-950 hover:brightness-110 shadow-lg shadow-gold-500/25 transition-all disabled:opacity-50 cursor-pointer"
              >
                <Save className="h-4 w-4" /> {saving ? 'Saving changes…' : 'Save Studio Settings'}
              </button>
              <span className="text-xs font-mono text-ink-500 dark:text-ink-400">
                All modifications reflect instantly on public contact points.
              </span>
            </div>
          </>
        )}
      </form>
    </AdminLayout>
  );
}

export default AdminSettings;
