import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  CheckCircle2,
  Pencil,
  Plus,
  Quote,
  RefreshCw,
  Save,
  Search,
  Sparkles,
  Star,
  Trash2,
  UploadCloud,
  X,
} from 'lucide-react';
import { VendorLayout, SelectedMediaPreviews } from '@/vendor/components';
import { useAuth } from '@/context/AuthContext';
import { apiRequest } from '@/utils/api';

const blankForm = { name: '', role: '', review: '', rating: '5', isPublished: true };
const inputClass = 'w-full rounded-sm border border-white/10 bg-ink-900 px-3 py-2.5 text-sm text-ink-100 focus:border-gold-400 focus:outline-none transition-colors';

const DEFAULT_AVATARS = [
  'https://images.pexels.com/photos/15490147/pexels-photo-15490147.jpeg?auto=compress&cs=tinysrgb&w=300',
  'https://images.pexels.com/photos/32327732/pexels-photo-32327732.jpeg?auto=compress&cs=tinysrgb&w=300',
  'https://images.pexels.com/photos/38147801/pexels-photo-38147801.jpeg?auto=compress&cs=tinysrgb&w=300',
];

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
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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
    setShowAddForm(false);
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
        method: editingId ? 'PATCH' : 'POST',
        token: session.token,
        body: payload,
      });
      if (editingId) {
        setTestimonials((current) => current.map((item) => (item._id === editingId ? data.testimonial : item)));
      } else {
        setTestimonials((current) => [data.testimonial, ...current]);
      }
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
    setForm({
      name: testimonial.name,
      role: testimonial.role || '',
      review: testimonial.review || '',
      rating: String(testimonial.rating || '5'),
      isPublished: testimonial.isPublished !== false,
    });
    setShowAddForm(true);
    setSaved(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const updateVisibility = async (testimonial) => {
    setUpdatingId(testimonial._id);
    setError('');
    try {
      const data = await apiRequest(`/vendor/testimonials/${testimonial._id}`, {
        method: 'PATCH',
        token: session.token,
        body: JSON.stringify({ isPublished: !testimonial.isPublished }),
      });
      setTestimonials((current) => current.map((item) => (item._id === testimonial._id ? data.testimonial : item)));
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to update testimonial.');
    } finally {
      setUpdatingId('');
    }
  };

  const deleteTestimonial = async (testimonial) => {
    if (!window.confirm(`Delete review from "${testimonial.name}"? This cannot be undone.`)) return;
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

  const filteredTestimonials = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return testimonials;
    return testimonials.filter(
      (t) =>
        t.name?.toLowerCase().includes(q) ||
        t.role?.toLowerCase().includes(q) ||
        t.review?.toLowerCase().includes(q)
    );
  }, [testimonials, searchQuery]);

  const publishedCount = testimonials.filter((item) => item.isPublished).length;
  const fiveStarCount = testimonials.filter((item) => Number(item.rating) >= 5).length;

  return (
    <VendorLayout title="Client Reviews">
      {/* Top Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded-full bg-gold-400/10 border border-gold-400/20 text-gold-300 text-[10px] uppercase tracking-widest font-semibold flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5 text-gold-400" />
              Social Proof & Trust
            </span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl text-ink-50 mb-1">Client Testimonials</h2>
          <p className="text-xs sm:text-sm text-ink-400">
            Showcase verified bride, groom, and family praise on your studio profile.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={loadTestimonials}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-sm border border-white/10 px-3 py-1.5 text-xs text-ink-300 transition-colors hover:border-gold-400/40 hover:text-gold-300 disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            type="button"
            onClick={() => {
              if (showAddForm) resetForm();
              else {
                resetForm();
                setShowAddForm(true);
              }
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-gradient-to-r from-gold-500 to-gold-400 text-ink-950 font-medium text-xs uppercase tracking-wider hover:brightness-110 transition-all shadow-md shadow-gold-500/10"
          >
            {showAddForm ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
            <span>{showAddForm ? 'Close Form' : 'Add Review'}</span>
          </button>
        </div>
      </div>

      {error && (
        <div role="alert" className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-sm border border-red-400/20 bg-red-400/5 p-4 text-sm text-red-300">
          <span>{error}</span>
          <button type="button" onClick={loadTestimonials} className="underline underline-offset-4">Try again</button>
        </div>
      )}

      {saved && (
        <div role="status" className="mb-6 rounded-sm border border-emerald-400/20 bg-emerald-400/10 p-3 text-xs text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Testimonial saved and published on your review wall.</span>
        </div>
      )}

      {/* Symmetrical Metric Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-3.5 mb-8">
        <div className="p-3.5 sm:p-4 rounded-sm bg-ink-900/80 border border-white/5 backdrop-blur-md">
          <span className="text-[10px] uppercase tracking-wider text-ink-500 block mb-1 font-medium">Total Reviews</span>
          <p className="font-serif text-2xl sm:text-3xl text-ink-50 leading-none">{testimonials.length}</p>
          <p className="text-[10px] text-emerald-400 mt-1 font-medium">{publishedCount} live online</p>
        </div>
        <div className="p-3.5 sm:p-4 rounded-sm bg-ink-900/80 border border-white/5 backdrop-blur-md">
          <span className="text-[10px] uppercase tracking-wider text-ink-500 block mb-1 font-medium">5-Star Reviews</span>
          <p className="font-serif text-2xl sm:text-3xl text-gold-400 leading-none">{fiveStarCount}</p>
          <p className="text-[10px] text-ink-500 mt-1">Top rated feedback</p>
        </div>
        <div className="p-3.5 sm:p-4 rounded-sm bg-ink-900/80 border border-white/5 backdrop-blur-md">
          <span className="text-[10px] uppercase tracking-wider text-ink-500 block mb-1 font-medium">Rating Score</span>
          <p className="font-serif text-2xl sm:text-3xl text-ink-50 leading-none">4.9 / 5.0</p>
          <p className="text-[10px] text-emerald-400 mt-1 font-medium">Studio satisfaction</p>
        </div>
        <div className="p-3.5 sm:p-4 rounded-sm bg-gradient-to-br from-gold-400/15 via-ink-900/90 to-ink-900 border border-gold-400/30 backdrop-blur-md">
          <span className="text-[10px] uppercase tracking-wider text-gold-400 block mb-1 font-semibold">Client Love</span>
          <p className="font-serif text-2xl sm:text-3xl text-gold-300 leading-none">100%</p>
          <p className="text-[10px] text-gold-400/80 mt-1 font-medium">Positive recommendation</p>
        </div>
      </div>

      {/* Add / Edit Testimonial Form */}
      {showAddForm && (
        <form onSubmit={handleSubmit} className="mb-8 rounded-sm border border-gold-400/30 bg-ink-900/95 backdrop-blur-xl p-5 sm:p-6 shadow-2xl animate-scale-in">
          <div className="mb-5 flex items-center justify-between border-b border-white/5 pb-3">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-gold-400 fill-gold-400" />
              <h3 className="font-serif text-xl text-ink-50">{editingId ? 'Edit Testimonial' : 'Add Client Testimonial'}</h3>
            </div>
            <button type="button" onClick={resetForm} className="inline-flex items-center gap-1 text-xs text-ink-400 hover:text-ink-100">
              <X className="h-4 w-4" /> Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-[10px] uppercase tracking-wider text-ink-400 font-medium">Client / Couple Name *</span>
              <input required maxLength={100} value={form.name} onChange={(e) => setForm((curr) => ({ ...curr, name: e.target.value }))} className={inputClass} placeholder="e.g. Priya & Rohan" />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-[10px] uppercase tracking-wider text-ink-400 font-medium">Event / Role Tag</span>
              <input maxLength={100} value={form.role} onChange={(e) => setForm((curr) => ({ ...curr, role: e.target.value }))} className={inputClass} placeholder="e.g. Udaipur Palace Wedding · Bride & Groom" />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-[10px] uppercase tracking-wider text-ink-400 font-medium">Rating</span>
              <select value={form.rating} onChange={(e) => setForm((curr) => ({ ...curr, rating: e.target.value }))} className={inputClass}>
                <option value="5">★★★★★ (5 Stars - Exceptional)</option>
                <option value="4">★★★★☆ (4 Stars - Great)</option>
                <option value="3">★★★☆☆ (3 Stars - Good)</option>
              </select>
            </label>

            <div className="border border-white/10 rounded-sm p-3 bg-ink-950/40 flex items-center gap-3">
              <UploadCloud className="w-6 h-6 text-gold-400 shrink-0" />
              <div className="min-w-0 flex-1">
                <span className="text-[10px] uppercase tracking-wider text-ink-400 block font-medium">Couple Photo (Optional)</span>
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFiles(Array.from(e.target.files || []))}
                  className="text-xs text-ink-400 file:mr-2 file:py-1 file:px-2.5 file:rounded-sm file:border-0 file:text-[11px] file:bg-white/10 file:text-gold-300 cursor-pointer"
                />
              </div>
            </div>

            <label className="block sm:col-span-2">
              <span className="mb-1.5 block text-[10px] uppercase tracking-wider text-ink-400 font-medium">Client Feedback & Review *</span>
              <textarea required rows={3} maxLength={2000} value={form.review} onChange={(e) => setForm((curr) => ({ ...curr, review: e.target.value }))} className={inputClass} placeholder="Describe the couple's kind words about your photography, warmth, and deliverable quality." />
            </label>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-white/5 pt-4">
            <label className="flex cursor-pointer items-center gap-2.5 text-xs text-ink-300">
              <input type="checkbox" checked={form.isPublished} onChange={(e) => setForm((curr) => ({ ...curr, isPublished: e.target.checked }))} className="h-4 w-4 rounded border-white/20 bg-ink-900 accent-yellow-500" />
              <span>Publish Review on Public Profile</span>
            </label>
            <div className="flex items-center gap-2">
              <button type="button" onClick={resetForm} className="px-3.5 py-2 rounded-sm border border-white/10 text-xs text-ink-400 hover:text-ink-200">
                Cancel
              </button>
              <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-sm bg-gradient-to-r from-gold-500 to-gold-400 px-4 py-2 text-xs font-medium uppercase tracking-wider text-ink-950 hover:brightness-110 disabled:opacity-50 shadow-md shadow-gold-500/10">
                {editingId ? <Save className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                <span>{saving ? 'Saving…' : editingId ? 'Update Review' : 'Save Review'}</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Search Bar */}
      <div className="p-3 sm:p-4 rounded-sm bg-ink-900/80 border border-white/5 mb-6 flex items-center justify-between gap-3 backdrop-blur-md">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-ink-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search reviews by name or keyword…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 rounded-sm bg-ink-950/70 border border-white/10 text-xs text-ink-100 focus:border-gold-400 focus:outline-none"
          />
        </div>
        <span className="text-xs text-ink-500">{filteredTestimonials.length} reviews found</span>
      </div>

      {/* Testimonials Grid */}
      {loading ? (
        <div className="py-16 text-center text-sm text-ink-500">Loading reviews…</div>
      ) : filteredTestimonials.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredTestimonials.map((t, idx) => {
            const avatarImg = t.media?.[0]?.url || DEFAULT_AVATARS[idx % DEFAULT_AVATARS.length];
            const ratingNum = Number(t.rating) || 5;

            return (
              <article
                key={t._id}
                className="relative flex flex-col justify-between rounded-sm border border-white/5 bg-ink-900/80 backdrop-blur-md p-6 transition-all duration-300 hover:border-gold-400/30 hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1 text-gold-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${i < ratingNum ? 'fill-gold-400 text-gold-400' : 'text-ink-600'}`}
                        />
                      ))}
                    </div>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] uppercase tracking-wider font-semibold border ${
                        t.isPublished
                          ? 'border-emerald-400/20 bg-emerald-400/10 text-emerald-400'
                          : 'border-white/10 bg-white/5 text-ink-500'
                      }`}
                    >
                      {t.isPublished ? 'Live' : 'Draft'}
                    </span>
                  </div>

                  <Quote className="w-7 h-7 text-gold-400/20 mb-2" />

                  <p className="font-serif italic text-sm text-ink-100 leading-relaxed mb-6">
                    &ldquo;{t.review}&rdquo;
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                    <img
                      src={avatarImg}
                      alt={t.name}
                      className="w-10 h-10 rounded-full object-cover border border-gold-400/30"
                      onError={(e) => {
                        e.currentTarget.src = DEFAULT_AVATARS[0];
                      }}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-serif text-sm text-ink-50 font-normal truncate">{t.name}</p>
                      <p className="text-[11px] text-ink-400 truncate">{t.role || 'Happy Couple'}</p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => editTestimonial(t)}
                        className="inline-flex items-center gap-1 text-xs text-ink-300 hover:text-gold-300 transition-colors"
                      >
                        <Pencil className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                      <button
                        type="button"
                        disabled={updatingId === t._id}
                        onClick={() => updateVisibility(t)}
                        className="inline-flex items-center gap-1 text-xs text-ink-300 hover:text-gold-300 transition-colors disabled:opacity-50"
                      >
                        <span>{t.isPublished ? 'Unpublish' : 'Publish'}</span>
                      </button>
                    </div>
                    <button
                      type="button"
                      disabled={updatingId === t._id}
                      onClick={() => deleteTestimonial(t)}
                      className="inline-flex items-center gap-1 text-xs text-red-400 hover:text-red-300 transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="rounded-sm border border-dashed border-white/10 bg-ink-900/60 px-5 py-16 text-center">
          <Star className="mx-auto mb-3 h-10 w-10 text-gold-400/50" />
          <h4 className="font-serif text-lg text-ink-100">No Testimonials Yet</h4>
          <p className="mt-1 text-xs text-ink-400 max-w-sm mx-auto">
            {searchQuery
              ? 'No reviews match your search query.'
              : 'Add your first client recommendation by clicking "Add Review" above.'}
          </p>
        </div>
      )}
    </VendorLayout>
  );
}

export default VendorTestimonials;
