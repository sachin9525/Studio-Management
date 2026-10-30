import { useCallback, useEffect, useState } from 'react';
import { ArrowUpRight, Package, Pencil, Plus, RefreshCw, Save, Star, Trash2, X } from 'lucide-react';
import { VendorLayout } from '@/vendor/components';
import { useAuth } from '@/context/AuthContext';
import { apiRequest } from '@/utils/api';

const blankPackage = { name: '', tagline: '', price: '', features: '', isFeatured: false, isPublished: false };
const inputClass = 'w-full rounded-sm border border-white/10 bg-ink-900 px-3 py-2.5 text-sm text-ink-100 focus:border-gold-400 focus:outline-none';
const priceFormat = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });

function VendorPackages() {
  const { session } = useAuth();
  const [packages, setPackages] = useState([]);
  const [form, setForm] = useState(blankPackage);
  const [editingId, setEditingId] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [updatingId, setUpdatingId] = useState('');
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  const loadPackages = useCallback(async () => {
    if (!session?.token) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const data = await apiRequest('/vendor/packages', { token: session.token });
      setPackages(data.packages || []);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to load packages.');
    } finally {
      setLoading(false);
    }
  }, [session?.token]);

  useEffect(() => { loadPackages(); }, [loadPackages]);

  const resetForm = () => {
    setForm(blankPackage);
    setEditingId('');
    setSaved(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    setSaved(false);
    const payload = { ...form, price: Number(form.price) };
    try {
      const data = await apiRequest(editingId ? `/vendor/packages/${editingId}` : '/vendor/packages', {
        method: editingId ? 'PATCH' : 'POST',
        token: session.token,
        body: JSON.stringify(payload),
      });
      if (editingId) {
        setPackages((current) => current.map((item) => item._id === editingId ? data.package : item));
      } else {
        setPackages((current) => [data.package, ...current]);
      }
      resetForm();
      setSaved(true);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to save package.');
    } finally {
      setSaving(false);
    }
  };

  const editPackage = (studioPackage) => {
    setEditingId(studioPackage._id);
    setForm({
      name: studioPackage.name,
      tagline: studioPackage.tagline || '',
      price: String(studioPackage.price),
      features: (studioPackage.features || []).join('\n'),
      isFeatured: studioPackage.isFeatured,
      isPublished: studioPackage.isPublished,
    });
    setSaved(false);
  };

  const updatePackage = async (studioPackage, changes) => {
    setUpdatingId(studioPackage._id);
    setError('');
    try {
      const data = await apiRequest(`/vendor/packages/${studioPackage._id}`, {
        method: 'PATCH',
        token: session.token,
        body: JSON.stringify(changes),
      });
      setPackages((current) => current.map((item) => item._id === studioPackage._id ? data.package : item));
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to update package.');
    } finally {
      setUpdatingId('');
    }
  };

  const deletePackage = async (studioPackage) => {
    if (!window.confirm(`Delete “${studioPackage.name}”? This cannot be undone.`)) return;
    setUpdatingId(studioPackage._id);
    setError('');
    try {
      await apiRequest(`/vendor/packages/${studioPackage._id}`, { method: 'DELETE', token: session.token });
      setPackages((current) => current.filter((item) => item._id !== studioPackage._id));
      if (editingId === studioPackage._id) resetForm();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to delete package.');
    } finally {
      setUpdatingId('');
    }
  };

  const publishedCount = packages.filter((item) => item.isPublished).length;

  return <VendorLayout title="Packages">
    <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h2 className="mb-1 font-serif text-3xl text-ink-50">Packages</h2>
        <p className="text-sm text-ink-400">Create the pricing packages shown on your public landing page.</p>
      </div>
      <button type="button" onClick={loadPackages} disabled={loading} className="inline-flex items-center gap-2 rounded-sm border border-white/10 px-3 py-2 text-xs text-ink-300 hover:border-gold-400/40 hover:text-gold-300 disabled:opacity-50">
        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
      </button>
    </div>

    {error && <p role="alert" className="mb-5 rounded-sm border border-red-400/20 bg-red-400/5 p-4 text-sm text-red-300">{error}</p>}
    {saved && <p role="status" className="mb-5 rounded-sm border border-green-400/20 bg-green-400/5 p-4 text-sm text-green-300">Package saved.</p>}

    <form onSubmit={handleSubmit} className="mb-8 max-w-4xl rounded-sm border border-white/5 bg-ink-800 p-5 md:p-7">
      <div className="mb-5 flex items-center justify-between gap-3">
        <h3 className="font-serif text-xl text-ink-50">{editingId ? 'Edit package' : 'Add a package'}</h3>
        {editingId && <button type="button" onClick={resetForm} className="inline-flex items-center gap-1 text-xs text-ink-400 hover:text-ink-100"><X className="h-4 w-4" /> Cancel</button>}
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-[10px] uppercase tracking-widest text-ink-400">Package name</span>
          <input required maxLength={80} value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} className={inputClass} placeholder="Signature" />
        </label>
        <label className="block">
          <span className="mb-2 block text-[10px] uppercase tracking-widest text-ink-400">Price (₹)</span>
          <input required type="number" min="0" step="1" value={form.price} onChange={(event) => setForm((current) => ({ ...current, price: event.target.value }))} className={inputClass} placeholder="89000" />
        </label>
        <label className="block sm:col-span-2">
          <span className="mb-2 block text-[10px] uppercase tracking-widest text-ink-400">Short description</span>
          <input maxLength={180} value={form.tagline} onChange={(event) => setForm((current) => ({ ...current, tagline: event.target.value }))} className={inputClass} placeholder="Our most chosen wedding package." />
        </label>
        <label className="block sm:col-span-2">
          <span className="mb-2 block text-[10px] uppercase tracking-widest text-ink-400">Package features</span>
          <textarea rows={5} maxLength={4000} value={form.features} onChange={(event) => setForm((current) => ({ ...current, features: event.target.value }))} className={inputClass} placeholder={'Candid + traditional photography\n2 professional photographers\nFull-day coverage'} />
          <span className="mt-2 block text-xs text-ink-500">Add one feature per line, up to 20 features.</span>
        </label>
      </div>
      <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3">
        <label className="flex cursor-pointer items-center gap-3 text-sm text-ink-300">
          <input type="checkbox" checked={form.isFeatured} onChange={(event) => setForm((current) => ({ ...current, isFeatured: event.target.checked }))} className="h-4 w-4 accent-yellow-500" />
          Mark as most popular
        </label>
        <label className="flex cursor-pointer items-center gap-3 text-sm text-ink-300">
          <input type="checkbox" checked={form.isPublished} onChange={(event) => setForm((current) => ({ ...current, isPublished: event.target.checked }))} className="h-4 w-4 accent-yellow-500" />
          Publish on public page
        </label>
      </div>
      <button type="submit" disabled={saving} className="mt-6 inline-flex items-center gap-2 rounded-sm bg-gold-400 px-4 py-2.5 text-xs font-medium uppercase tracking-widest text-ink-950 hover:bg-gold-300 disabled:opacity-50">
        {editingId ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}{saving ? 'Saving…' : editingId ? 'Save changes' : 'Add package'}
      </button>
    </form>

    <div className="mb-4 flex items-center justify-between">
      <h3 className="font-serif text-xl text-ink-50">Your packages</h3>
      <span className="text-xs text-ink-500">{publishedCount} published · {packages.length} total</span>
    </div>
    {loading ? <p className="py-12 text-center text-sm text-ink-500">Loading packages…</p> : packages.length ? <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
      {packages.map((studioPackage) => <article key={studioPackage._id} className={`relative rounded-sm border p-6 ${studioPackage.isFeatured ? 'border-gold-400/40 bg-gradient-to-b from-gold-400/10 to-ink-800' : 'border-white/5 bg-ink-800'}`}>
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h4 className="font-serif text-2xl text-ink-50">{studioPackage.name}</h4>
            <p className="mt-1 text-xs text-ink-400">{studioPackage.tagline || 'No description added.'}</p>
          </div>
          <span className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] uppercase tracking-widest ${studioPackage.isPublished ? 'border-green-400/20 bg-green-400/10 text-green-400' : 'border-white/10 bg-white/5 text-ink-500'}`}>{studioPackage.isPublished ? 'Published' : 'Draft'}</span>
        </div>
        <p className="mb-5 font-serif text-3xl text-gold-400">{priceFormat.format(studioPackage.price)}<span className="ml-2 font-sans text-xs text-ink-500">onwards</span></p>
        <ul className="mb-5 min-h-8 space-y-2.5">
          {(studioPackage.features || []).map((feature) => <li key={feature} className="flex items-start gap-2.5 text-sm text-ink-300"><span className="mt-0.5 text-gold-400">✓</span>{feature}</li>)}
          {!studioPackage.features?.length && <li className="text-sm text-ink-500">No features added.</li>}
        </ul>
        <div className="flex flex-wrap items-center gap-2 border-t border-white/5 pt-4">
          <button type="button" disabled={updatingId === studioPackage._id} onClick={() => editPackage(studioPackage)} className="inline-flex items-center gap-1.5 rounded-sm border border-white/10 px-3 py-2 text-xs text-ink-300 hover:border-gold-400/30 hover:text-gold-300 disabled:opacity-50"><Pencil className="h-3.5 w-3.5" /> Edit</button>
          <button type="button" disabled={updatingId === studioPackage._id} onClick={() => updatePackage(studioPackage, { isFeatured: !studioPackage.isFeatured })} className="inline-flex items-center gap-1.5 rounded-sm border border-white/10 px-3 py-2 text-xs text-ink-300 hover:text-gold-300 disabled:opacity-50"><Star className="h-3.5 w-3.5" />{studioPackage.isFeatured ? 'Unfeature' : 'Feature'}</button>
          <button type="button" disabled={updatingId === studioPackage._id} onClick={() => updatePackage(studioPackage, { isPublished: !studioPackage.isPublished })} className="inline-flex items-center gap-1.5 rounded-sm border border-white/10 px-3 py-2 text-xs text-ink-300 hover:text-gold-300 disabled:opacity-50">{studioPackage.isPublished ? 'Unpublish' : 'Publish'} <ArrowUpRight className="h-3.5 w-3.5" /></button>
          <button type="button" disabled={updatingId === studioPackage._id} onClick={() => deletePackage(studioPackage)} className="ml-auto inline-flex items-center gap-1.5 rounded-sm px-3 py-2 text-xs text-red-300 hover:bg-red-400/10 disabled:opacity-50"><Trash2 className="h-3.5 w-3.5" /> Delete</button>
        </div>
      </article>)}
    </div> : <div className="rounded-sm border border-white/5 bg-ink-800 px-5 py-14 text-center">
      <Package className="mx-auto mb-3 h-8 w-8 text-ink-500" />
      <p className="text-sm text-ink-300">No packages added yet.</p>
      <p className="mt-1 text-xs text-ink-500">Create a package above and publish it to show it on the public page.</p>
    </div>}
  </VendorLayout>;
}

export default VendorPackages;
