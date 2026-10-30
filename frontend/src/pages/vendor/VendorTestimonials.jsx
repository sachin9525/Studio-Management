import { useCallback, useEffect, useRef, useState } from 'react';
import { Pencil, Plus, RefreshCw, Save, Star, Trash2, X } from 'lucide-react';
import DashboardLayout from '@/components/common/DashboardLayout';
import SelectedMediaPreviews from '@/components/common/SelectedMediaPreviews';
import { vendorNavItems } from '@/data/navConfig';
import { useAuth } from '@/context/AuthContext';
import { apiRequest } from '@/utils/api';

const blankForm = { name: '', role: '', review: '', rating: '5', isPublished: false };
const inputClass = 'w-full rounded-sm border border-white/10 bg-ink-900 px-3 py-2.5 text-sm text-ink-100 focus:border-gold-400 focus:outline-none';

function VendorTestimonials() {
  const { session } = useAuth();
  const [testimonials, setTestimonials] = useState([]);
  const [form, setForm] = useState(blankForm);
  const [files, setFiles] = useState([]);
  const imageInputRef = useRef(null);
  const [editingId, setEditingId] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [updatingId, setUpdatingId] = useState('');
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  const loadTestimonials = useCallback(async () => {
    if (!session?.token) return;
    setLoading(true);
    setError('');
    try {
      const data = await apiRequest('/vendor/testimonials', { token: session.token });
      setTestimonials(data.testimonials || []);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to load testimonials.');
    } finally {
      setLoading(false);
    }
  }, [session?.token]);

  useEffect(() => { loadTestimonials(); }, [loadTestimonials]);

  const resetForm = () => {
    setForm(blankForm);
    setFiles([]);
    if (imageInputRef.current) imageInputRef.current.value = '';
    setEditingId('');
    setSaved(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    setSaved(false);
    const payload = new FormData();
    Object.entries(form).forEach(([key, value]) => payload.append(key, String(value)));
    files.forEach((file) => payload.append('files', file));
    try {
      const data = await apiRequest(editingId ? `/vendor/testimonials/${editingId}` : '/vendor/testimonials', {
        method: editingId ? 'PATCH' : 'POST', token: session.token, body: payload,
      });
      if (editingId) setTestimonials((current) => current.map((item) => item._id === editingId ? data.testimonial : item));
      else setTestimonials((current) => [data.testimonial, ...current]);
      resetForm();
      setSaved(true);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to save testimonial.');
    } finally {
      setSaving(false);
    }
  };

  const editTestimonial = (testimonial) => {
    setEditingId(testimonial._id);
    setForm({ name: testimonial.name, role: testimonial.role, review: testimonial.review, rating: String(testimonial.rating), isPublished: testimonial.isPublished });
    setFiles([]);
    if (imageInputRef.current) imageInputRef.current.value = '';
    setSaved(false);
  };

  const updateVisibility = async (testimonial) => {
    setUpdatingId(testimonial._id);
    setError('');
    try {
      const data = await apiRequest(`/vendor/testimonials/${testimonial._id}`, {
        method: 'PATCH', token: session.token,
        body: JSON.stringify({ isPublished: !testimonial.isPublished }),
      });
      setTestimonials((current) => current.map((item) => item._id === testimonial._id ? data.testimonial : item));
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to update testimonial.');
    } finally {
      setUpdatingId('');
    }
  };

  const deleteTestimonial = async (testimonial) => {
    if (!window.confirm(`Delete the testimonial from ${testimonial.name}? This cannot be undone.`)) return;
    setUpdatingId(testimonial._id);
    setError('');
    try {
      await apiRequest(`/vendor/testimonials/${testimonial._id}`, { method: 'DELETE', token: session.token });
      setTestimonials((current) => current.filter((item) => item._id !== testimonial._id));
      if (editingId === testimonial._id) resetForm();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to delete testimonial.');
    } finally {
      setUpdatingId('');
    }
  };

  const publishedCount = testimonials.filter((item) => item.isPublished).length;

  return <DashboardLayout navItems={vendorNavItems} title="Testimonials" role="vendor">
    <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h2 className="mb-1 font-serif text-3xl text-ink-50">Testimonials</h2>
        <p className="text-sm text-ink-400">Add client feedback and choose which reviews appear publicly.</p>
      </div>
      <button type="button" onClick={loadTestimonials} disabled={loading} className="inline-flex items-center gap-2 rounded-sm border border-white/10 px-3 py-2 text-xs text-ink-300 hover:border-gold-400/40 hover:text-gold-300 disabled:opacity-50">
        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
      </button>
    </div>

    {error && <p role="alert" className="mb-5 rounded-sm border border-red-400/20 bg-red-400/5 p-4 text-sm text-red-300">{error}</p>}
    {saved && <p role="status" className="mb-5 rounded-sm border border-green-400/20 bg-green-400/5 p-4 text-sm text-green-300">Testimonial saved.</p>}

    <form onSubmit={handleSubmit} className="mb-8 max-w-4xl rounded-sm border border-white/5 bg-ink-800 p-5 md:p-7">
      <div className="mb-5 flex items-center justify-between gap-3">
        <h3 className="font-serif text-xl text-ink-50">{editingId ? 'Edit testimonial' : 'Add a testimonial'}</h3>
        {editingId && <button type="button" onClick={resetForm} className="inline-flex items-center gap-1 text-xs text-ink-400 hover:text-ink-100"><X className="h-4 w-4" /> Cancel</button>}
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-[10px] uppercase tracking-widest text-ink-400">Client name</span>
          <input required maxLength={120} value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} className={inputClass} placeholder="Priya Sharma" />
        </label>
        <label className="block">
          <span className="mb-2 block text-[10px] uppercase tracking-widest text-ink-400">Event / location</span>
          <input required maxLength={120} value={form.role} onChange={(event) => setForm((current) => ({ ...current, role: event.target.value }))} className={inputClass} placeholder="Bride, Bhopal" />
        </label>
        <label className="block">
          <span className="mb-2 block text-[10px] uppercase tracking-widest text-ink-400">Rating</span>
          <select value={form.rating} onChange={(event) => setForm((current) => ({ ...current, rating: event.target.value }))} className={inputClass}>
            {[5, 4, 3, 2, 1].map((rating) => <option key={rating} value={rating}>{rating} star{rating === 1 ? '' : 's'}</option>)}
          </select>
        </label>
        <label className="block">
          <span className="mb-2 block text-[10px] uppercase tracking-widest text-ink-400">Client photo (optional)</span>
          <input ref={imageInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={(event) => setFiles(Array.from(event.target.files || []))} className={`${inputClass} file:mr-3 file:rounded-sm file:border-0 file:bg-gold-400/10 file:px-3 file:py-2 file:text-xs file:text-gold-300`} />
          <span className="mt-2 block text-xs text-ink-500">One image, up to 5 MB. Upload a photo or leave blank for initials.</span>
          <SelectedMediaPreviews files={files} />
        </label>
        <label className="block sm:col-span-2">
          <span className="mb-2 block text-[10px] uppercase tracking-widest text-ink-400">Review</span>
          <textarea required maxLength={2000} rows={4} value={form.review} onChange={(event) => setForm((current) => ({ ...current, review: event.target.value }))} className={inputClass} placeholder="Share the client's feedback." />
        </label>
      </div>
      <label className="mt-5 flex cursor-pointer items-center gap-3 text-sm text-ink-300">
        <input type="checkbox" checked={form.isPublished} onChange={(event) => setForm((current) => ({ ...current, isPublished: event.target.checked }))} className="h-4 w-4 accent-yellow-500" />
        Publish this testimonial on the public page
      </label>
      <button type="submit" disabled={saving} className="mt-6 inline-flex items-center gap-2 rounded-sm bg-gold-400 px-4 py-2.5 text-xs font-medium uppercase tracking-widest text-ink-950 hover:bg-gold-300 disabled:opacity-50">
        {editingId ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}{saving ? 'Saving…' : editingId ? 'Save changes' : 'Add testimonial'}
      </button>
    </form>

    <div className="mb-4 flex items-center justify-between">
      <h3 className="font-serif text-xl text-ink-50">Your testimonials</h3>
      <span className="text-xs text-ink-500">{publishedCount} published · {testimonials.length} total</span>
    </div>
    {loading ? <p className="py-12 text-center text-sm text-ink-500">Loading testimonials…</p> : testimonials.length ? <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
      {testimonials.map((testimonial) => <article key={testimonial._id} className="rounded-sm border border-white/5 bg-ink-800 p-5">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div><h4 className="font-serif text-xl text-ink-50">{testimonial.name}</h4><p className="mt-1 text-xs text-ink-400">{testimonial.role}</p></div>
          <span className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] uppercase tracking-widest ${testimonial.isPublished ? 'border-green-400/20 bg-green-400/10 text-green-400' : 'border-white/10 bg-white/5 text-ink-500'}`}>{testimonial.isPublished ? 'Published' : 'Draft'}</span>
        </div>
        <div className="mb-3 flex gap-1" aria-label={`${testimonial.rating} out of 5 stars`}>
          {Array.from({ length: testimonial.rating }, (_, index) => <Star key={index} className="h-4 w-4 fill-current text-gold-400" />)}
        </div>
        <p className="mb-5 line-clamp-4 text-sm italic leading-relaxed text-ink-300">“{testimonial.review}”</p>
        {testimonial.image?.url && <img src={testimonial.image.url} alt={testimonial.name} className="mb-4 h-14 w-14 rounded-full border border-gold-400/30 object-cover" />}
        <div className="flex flex-wrap items-center gap-2 border-t border-white/5 pt-4">
          <button type="button" disabled={updatingId === testimonial._id} onClick={() => editTestimonial(testimonial)} className="inline-flex items-center gap-1.5 rounded-sm border border-white/10 px-3 py-2 text-xs text-ink-300 hover:border-gold-400/30 hover:text-gold-300 disabled:opacity-50"><Pencil className="h-3.5 w-3.5" /> Edit</button>
          <button type="button" disabled={updatingId === testimonial._id} onClick={() => updateVisibility(testimonial)} className="rounded-sm border border-white/10 px-3 py-2 text-xs text-ink-300 hover:text-gold-300 disabled:opacity-50">{testimonial.isPublished ? 'Unpublish' : 'Publish'}</button>
          <button type="button" disabled={updatingId === testimonial._id} onClick={() => deleteTestimonial(testimonial)} className="ml-auto inline-flex items-center gap-1.5 rounded-sm px-3 py-2 text-xs text-red-300 hover:bg-red-400/10 disabled:opacity-50"><Trash2 className="h-3.5 w-3.5" /> Delete</button>
        </div>
      </article>)}
    </div> : <div className="rounded-sm border border-white/5 bg-ink-800 px-5 py-14 text-center">
      <Star className="mx-auto mb-3 h-8 w-8 text-ink-500" />
      <p className="text-sm text-ink-300">No testimonials added yet.</p>
      <p className="mt-1 text-xs text-ink-500">Add a client review and publish it to show it on the public page.</p>
    </div>}
  </DashboardLayout>;
}

export default VendorTestimonials;
