import { useCallback, useEffect, useState } from 'react';
import { Briefcase, Pencil, Plus, RefreshCw, Save, Trash2, X } from 'lucide-react';
import { VendorLayout } from '@/vendor/components';
import { useAuth } from '@/context/AuthContext';
import { apiRequest } from '@/utils/api';

const blankService = { name: '', category: '', description: '', startingPrice: '', duration: '' };
const priceFormat = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
const inputClass = 'w-full rounded-sm border border-white/10 bg-ink-900 px-3 py-2.5 text-sm text-ink-100 focus:border-gold-400 focus:outline-none';

function VendorServices() {
  const { session } = useAuth();
  const [services, setServices] = useState([]);
  const [form, setForm] = useState(blankService);
  const [editingId, setEditingId] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [updatingId, setUpdatingId] = useState('');
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  const loadServices = useCallback(async () => {
    if (!session?.token) return;
    setLoading(true);
    setError('');
    try {
      const data = await apiRequest('/vendor/services', { token: session.token });
      setServices(data.services);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to load services.');
    } finally {
      setLoading(false);
    }
  }, [session?.token]);

  useEffect(() => { loadServices(); }, [loadServices]);

  const resetForm = () => {
    setForm(blankService);
    setEditingId('');
    setSaved(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    setSaved(false);
    const payload = { ...form, startingPrice: Number(form.startingPrice) };
    try {
      const data = await apiRequest(editingId ? `/vendor/services/${editingId}` : '/vendor/services', {
        method: editingId ? 'PATCH' : 'POST',
        token: session.token,
        body: JSON.stringify(payload),
      });
      if (editingId) {
        setServices((current) => current.map((service) => service._id === editingId ? data.service : service));
      } else {
        setServices((current) => [data.service, ...current]);
      }
      resetForm();
      setSaved(true);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to save service.');
    } finally {
      setSaving(false);
    }
  };

  const editService = (service) => {
    setEditingId(service._id);
    setForm({
      name: service.name,
      category: service.category,
      description: service.description || '',
      startingPrice: String(service.startingPrice),
      duration: service.duration || '',
    });
    setSaved(false);
  };

  const toggleService = async (service) => {
    setUpdatingId(service._id);
    setError('');
    try {
      const data = await apiRequest(`/vendor/services/${service._id}`, {
        method: 'PATCH',
        token: session.token,
        body: JSON.stringify({ isActive: !service.isActive }),
      });
      setServices((current) => current.map((item) => item._id === service._id ? data.service : item));
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to update service status.');
    } finally {
      setUpdatingId('');
    }
  };

  const deleteService = async (service) => {
    if (!window.confirm(`Delete “${service.name}”? This cannot be undone.`)) return;
    setUpdatingId(service._id);
    setError('');
    try {
      await apiRequest(`/vendor/services/${service._id}`, { method: 'DELETE', token: session.token });
      setServices((current) => current.filter((item) => item._id !== service._id));
      if (editingId === service._id) resetForm();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to delete service.');
    } finally {
      setUpdatingId('');
    }
  };

  return <VendorLayout title="Services">
    <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h2 className="mb-1 font-serif text-3xl text-ink-50">Studio Services</h2>
        <p className="text-sm text-ink-400">Add and manage the photography services your studio offers.</p>
      </div>
      <button type="button" onClick={loadServices} disabled={loading} className="inline-flex items-center gap-2 rounded-sm border border-white/10 px-3 py-2 text-xs text-ink-300 hover:border-gold-400/40 hover:text-gold-300 disabled:opacity-50">
        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
      </button>
    </div>

    {error && <p role="alert" className="mb-5 rounded-sm border border-red-400/20 bg-red-400/5 p-4 text-sm text-red-300">{error}</p>}
    {saved && <p role="status" className="mb-5 rounded-sm border border-green-400/20 bg-green-400/5 p-4 text-sm text-green-300">Service saved.</p>}

    <form onSubmit={handleSubmit} className="mb-8 max-w-4xl rounded-sm border border-white/5 bg-ink-800 p-5 md:p-7">
      <div className="mb-5 flex items-center justify-between gap-3">
        <h3 className="font-serif text-xl text-ink-50">{editingId ? 'Edit service' : 'Add a service'}</h3>
        {editingId && <button type="button" onClick={resetForm} className="inline-flex items-center gap-1 text-xs text-ink-400 hover:text-ink-100"><X className="h-4 w-4" /> Cancel</button>}
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-[10px] uppercase tracking-widest text-ink-400">Service name</span>
          <input required maxLength={100} value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} className={inputClass} placeholder="Wedding Photography" />
        </label>
        <label className="block">
          <span className="mb-2 block text-[10px] uppercase tracking-widest text-ink-400">Category</span>
          <input required maxLength={80} value={form.category} onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))} className={inputClass} placeholder="Photography" />
        </label>
        <label className="block">
          <span className="mb-2 block text-[10px] uppercase tracking-widest text-ink-400">Starting price (₹)</span>
          <input required type="number" min="0" step="1" value={form.startingPrice} onChange={(event) => setForm((current) => ({ ...current, startingPrice: event.target.value }))} className={inputClass} placeholder="25000" />
        </label>
        <label className="block">
          <span className="mb-2 block text-[10px] uppercase tracking-widest text-ink-400">Duration</span>
          <input maxLength={80} value={form.duration} onChange={(event) => setForm((current) => ({ ...current, duration: event.target.value }))} className={inputClass} placeholder="8 hours" />
        </label>
        <label className="block sm:col-span-2">
          <span className="mb-2 block text-[10px] uppercase tracking-widest text-ink-400">Description</span>
          <textarea maxLength={1000} rows={3} value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} className={inputClass} placeholder="Describe what is included in this service." />
        </label>
      </div>
      <button type="submit" disabled={saving} className="mt-6 inline-flex items-center gap-2 rounded-sm bg-gold-400 px-4 py-2.5 text-xs font-medium uppercase tracking-widest text-ink-950 hover:bg-gold-300 disabled:opacity-50">
        {editingId ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}{saving ? 'Saving…' : editingId ? 'Save changes' : 'Add service'}
      </button>
    </form>

    <div className="mb-4 flex items-center justify-between">
      <h3 className="font-serif text-xl text-ink-50">Your services</h3>
      <span className="text-xs text-ink-500">{services.filter((service) => service.isActive).length} active · {services.length} total</span>
    </div>
    {loading ? <p className="py-12 text-center text-sm text-ink-500">Loading services…</p> : services.length ? <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
      {services.map((service) => <article key={service._id} className="rounded-sm border border-white/5 bg-ink-800 p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold-400/10 text-gold-400"><Briefcase className="h-5 w-5" /></div>
            <div className="min-w-0">
              <h4 className="truncate text-base text-ink-100">{service.name}</h4>
              <p className="mt-1 text-xs text-ink-500">{service.category}{service.duration ? ` · ${service.duration}` : ''}</p>
            </div>
          </div>
          <span className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] uppercase tracking-widest ${service.isActive ? 'border-green-400/20 bg-green-400/10 text-green-400' : 'border-white/10 bg-white/5 text-ink-500'}`}>
            {service.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>
        <p className="mt-4 min-h-10 text-sm text-ink-400">{service.description || 'No description added.'}</p>
        <p className="mt-3 font-serif text-2xl text-ink-50">{priceFormat.format(service.startingPrice)}<span className="ml-2 font-sans text-xs text-ink-500">starting price</span></p>
        <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-white/5 pt-4">
          <button type="button" disabled={updatingId === service._id} onClick={() => editService(service)} className="inline-flex items-center gap-1.5 rounded-sm border border-white/10 px-3 py-2 text-xs text-ink-300 hover:border-gold-400/30 hover:text-gold-300 disabled:opacity-50"><Pencil className="h-3.5 w-3.5" /> Edit</button>
          <button type="button" disabled={updatingId === service._id} onClick={() => toggleService(service)} className="rounded-sm border border-white/10 px-3 py-2 text-xs text-ink-300 hover:text-gold-300 disabled:opacity-50">{service.isActive ? 'Deactivate' : 'Activate'}</button>
          <button type="button" disabled={updatingId === service._id} onClick={() => deleteService(service)} className="ml-auto inline-flex items-center gap-1.5 rounded-sm px-3 py-2 text-xs text-red-300 hover:bg-red-400/10 disabled:opacity-50"><Trash2 className="h-3.5 w-3.5" /> Delete</button>
        </div>
      </article>)}
    </div> : <div className="rounded-sm border border-white/5 bg-ink-800 px-5 py-14 text-center">
      <Briefcase className="mx-auto mb-3 h-8 w-8 text-ink-500" />
      <p className="text-sm text-ink-300">No services added yet.</p>
      <p className="mt-1 text-xs text-ink-500">Use the form above to add your first studio service.</p>
    </div>}
  </VendorLayout>;
}

export default VendorServices;
