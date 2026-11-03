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

const inputClass =
  'w-full rounded-full border border-black/15 dark:border-white/15 bg-white/90 dark:bg-black/40 px-4 py-2.5 text-xs text-ink-50 placeholder:text-ink-400 focus:outline-none focus:border-gold-500/60 shadow-inner transition-colors';

const selectClass =
  'w-full rounded-full border border-black/15 dark:border-white/15 bg-white/90 dark:bg-black/40 px-4 py-2.5 text-xs text-ink-50 font-semibold focus:outline-none focus:border-gold-500/60 shadow-inner transition-colors cursor-pointer';

const textareaClass =
  'w-full rounded-2xl border border-black/15 dark:border-white/15 bg-white/90 dark:bg-black/40 px-4 py-3 text-xs text-ink-50 placeholder:text-ink-400 focus:outline-none focus:border-gold-500/60 shadow-inner transition-colors';

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

  useEffect(() => {
    loadTestimonials();
  }, [loadTestimonials]);

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
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-700 dark:text-gold-300 text-[10px] font-mono uppercase tracking-widest font-bold flex items-center gap-1.5 shadow-2xs">
              <Sparkles className="w-3 h-3 text-gold-600 dark:text-gold-400" />
              Social Proof & Trust
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-ink-50 font-normal tracking-tight">Client Testimonials</h2>
          <p className="text-xs sm:text-sm text-ink-500 dark:text-ink-400 mt-1 max-w-2xl font-medium">
            Showcase verified bride, groom, and family praise on your studio profile.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start md:self-auto">
          <button
            type="button"
            onClick={loadTestimonials}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-black/15 dark:border-white/15 bg-white/80 dark:bg-white/5 text-xs text-ink-50 font-medium hover:bg-gold-500/10 hover:border-gold-500/40 transition-colors shadow-2xs cursor-pointer disabled:opacity-50"
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
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-gold-500 to-gold-400 text-ink-950 font-bold text-xs uppercase tracking-wider hover:brightness-110 hover:scale-[1.02] transition-all shadow-lg shadow-gold-500/25 cursor-pointer"
          >
            {showAddForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            <span>{showAddForm ? 'Close Form' : 'Add Review'}</span>
          </button>
        </div>
      </div>

      {error && (
        <div role="alert" className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-xs font-semibold text-red-600 dark:text-red-400">
          <span>{error}</span>
          <button type="button" onClick={loadTestimonials} className="underline underline-offset-4 cursor-pointer">Try again</button>
        </div>
      )}

      {saved && (
        <div role="status" className="mb-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          <span>Testimonial saved and published on your review wall.</span>
        </div>
      )}

      {/* 4 Glassy Stat Capsules */}
      <div className="mb-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {[
          ['Total Reviews', testimonials.length, `${publishedCount} Live Online`],
          ['5-Star Reviews', fiveStarCount, 'Top Rated Feedback'],
          ['Rating Score', '4.9 / 5.0', 'Studio Satisfaction'],
          ['Client Love', '100%', 'Positive Recommendation'],
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
              <p className="font-serif text-2xl sm:text-3xl text-ink-50 font-normal tracking-tight group-hover:text-gold-700 dark:group-hover:text-gold-300 transition-colors truncate">
                {value}
              </p>
              <p className="mt-1 text-[10px] uppercase font-mono font-bold tracking-widest text-ink-500 dark:text-ink-400">
                {label}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Testimonial Form Panel */}
      {showAddForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-8 rounded-[28px] border border-black/10 dark:border-white/15 bg-white/95 dark:bg-black/60 backdrop-blur-2xl p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.6)] animate-fade-in relative overflow-hidden"
        >
          <div className="absolute -top-16 -right-16 w-48 h-48 bg-amber-500/10 dark:bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

          <div className="mb-6 flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-4 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gold-500/15 border border-gold-500/30 flex items-center justify-center text-gold-700 dark:text-gold-300">
                <Star className="w-5 h-5 fill-gold-500" />
              </div>
              <div>
                <h3 className="font-serif text-2xl text-ink-50 font-normal">{editingId ? 'Edit Testimonial' : 'Add Client Testimonial'}</h3>
                <p className="text-xs text-ink-500 dark:text-ink-400">Record genuine client feedback and ratings</p>
              </div>
            </div>
            <button
              type="button"
              onClick={resetForm}
              className="p-2 rounded-full text-ink-400 hover:text-ink-50 hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 relative z-10">
            <label className="block">
              <span className="mb-1.5 block text-[10px] font-mono uppercase tracking-widest text-ink-500 dark:text-ink-400 font-bold">Client / Couple Name *</span>
              <input
                required
                maxLength={100}
                value={form.name}
                onChange={(e) => setForm((curr) => ({ ...curr, name: e.target.value }))}
                className={inputClass}
                placeholder="e.g. Priya & Rohan"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-[10px] font-mono uppercase tracking-widest text-ink-500 dark:text-ink-400 font-bold">Event / Role Tag</span>
              <input
                maxLength={100}
                value={form.role}
                onChange={(e) => setForm((curr) => ({ ...curr, role: e.target.value }))}
                className={inputClass}
                placeholder="e.g. Udaipur Palace Wedding · Bride & Groom"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-[10px] font-mono uppercase tracking-widest text-ink-500 dark:text-ink-400 font-bold">Rating</span>
              <select
                value={form.rating}
                onChange={(e) => setForm((curr) => ({ ...curr, rating: e.target.value }))}
                className={selectClass}
              >
                <option value="5">★★★★★ (5 Stars - Exceptional)</option>
                <option value="4">★★★★☆ (4 Stars - Great)</option>
                <option value="3">★★★☆☆ (3 Stars - Good)</option>
              </select>
            </label>

            <div className="border border-black/15 dark:border-white/15 rounded-2xl p-4 bg-black/[0.02] dark:bg-white/[0.02] flex items-center gap-3">
              <UploadCloud className="w-7 h-7 text-gold-600 dark:text-gold-400 shrink-0" />
              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-mono uppercase tracking-widest text-ink-500 dark:text-ink-400 block font-bold">Couple Photo (Optional)</span>
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFiles(Array.from(e.target.files || []))}
                  className="text-xs text-ink-500 dark:text-ink-400 file:mr-2 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:bg-black/[0.06] dark:file:bg-white/10 file:text-ink-50 file:font-semibold cursor-pointer"
                />
              </div>
            </div>

            <label className="block sm:col-span-2">
              <span className="mb-1.5 block text-[10px] font-mono uppercase tracking-widest text-ink-500 dark:text-ink-400 font-bold">Client Feedback & Review *</span>
              <textarea
                required
                rows={3}
                maxLength={2000}
                value={form.review}
                onChange={(e) => setForm((curr) => ({ ...curr, review: e.target.value }))}
                className={textareaClass}
                placeholder="Describe the couple's kind words about your photography, warmth, and deliverable quality."
              />
            </label>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-black/10 dark:border-white/10 pt-5 relative z-10">
            <label className="flex cursor-pointer items-center gap-3 text-xs text-ink-50 font-medium">
              <input
                type="checkbox"
                checked={form.isPublished}
                onChange={(e) => setForm((curr) => ({ ...curr, isPublished: e.target.checked }))}
                className="h-4 w-4 rounded-full border-black/20 bg-transparent text-gold-500 focus:ring-gold-500 cursor-pointer"
              />
              <span>Publish Review on Public Profile</span>
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={resetForm}
                className="px-5 py-2.5 rounded-full border border-black/15 dark:border-white/15 text-xs font-semibold text-ink-500 dark:text-ink-400 hover:text-ink-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-gold-500 to-gold-400 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-ink-950 hover:brightness-110 disabled:opacity-50 shadow-lg shadow-gold-500/25 cursor-pointer"
              >
                {editingId ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                <span>{saving ? 'Saving…' : editingId ? 'Update Review' : 'Save Review'}</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Search Bar */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-500 dark:text-ink-400" />
          <input
            type="text"
            placeholder="Search reviews by name or keyword…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-full border border-black/15 dark:border-white/15 bg-white/90 dark:bg-black/40 pl-10 pr-4 py-2 text-xs text-ink-50 placeholder:text-ink-400 focus:outline-none focus:border-gold-500/60 shadow-inner"
          />
        </div>
        <span className="text-xs font-mono font-bold text-ink-500 dark:text-ink-400 uppercase tracking-widest">{filteredTestimonials.length} reviews found</span>
      </div>

      {/* Testimonials Grid */}
      {loading ? (
        <div className="py-20 text-center text-sm text-ink-500 dark:text-ink-400 font-mono">Loading reviews…</div>
      ) : filteredTestimonials.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTestimonials.map((t, idx) => {
            const avatarImg = t.media?.[0]?.url || DEFAULT_AVATARS[idx % DEFAULT_AVATARS.length];
            const ratingNum = Number(t.rating) || 5;

            return (
              <article
                key={t._id}
                className="group relative rounded-[28px] overflow-hidden border border-black/10 dark:border-white/15 bg-white/90 dark:bg-black/45 backdrop-blur-2xl p-7 shadow-[0_20px_50px_rgba(0,0,0,0.06)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-amber-500/10 dark:bg-amber-400/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-all pointer-events-none" />

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1 text-gold-500">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${i < ratingNum ? 'fill-gold-500 text-gold-500' : 'text-ink-300 dark:text-ink-700'}`}
                        />
                      ))}
                    </div>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider font-bold backdrop-blur-md border shadow-md ${
                        t.isPublished
                          ? 'bg-emerald-500/20 border-emerald-400/40 text-emerald-600 dark:text-emerald-300'
                          : 'bg-black/[0.04] dark:bg-black/70 border-black/10 dark:border-white/20 text-ink-500 dark:text-stone-300'
                      }`}
                    >
                      {t.isPublished ? 'Live' : 'Draft'}
                    </span>
                  </div>

                  <Quote className="w-8 h-8 text-gold-500/25 mb-3" />

                  <p className="font-serif italic text-base text-ink-50 leading-relaxed mb-6 font-normal">
                    &ldquo;{t.review}&rdquo;
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-3 pt-5 border-t border-black/10 dark:border-white/10">
                    <img
                      src={avatarImg}
                      alt={t.name}
                      className="w-11 h-11 rounded-full object-cover border-2 border-gold-400/40 shadow-md"
                      onError={(e) => {
                        e.currentTarget.src = DEFAULT_AVATARS[0];
                      }}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-serif text-base text-ink-50 font-normal truncate group-hover:text-gold-700 dark:group-hover:text-gold-300 transition-colors">{t.name}</p>
                      <p className="text-xs text-ink-500 dark:text-ink-400 truncate font-mono">{t.role || 'Happy Couple'}</p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-black/10 dark:border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => editTestimonial(t)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/[0.04] dark:bg-white/10 hover:bg-gold-500/20 border border-black/10 dark:border-white/10 text-xs font-semibold text-ink-50 hover:text-gold-700 dark:hover:text-gold-300 transition-all cursor-pointer"
                      >
                        <Pencil className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                      <button
                        type="button"
                        disabled={updatingId === t._id}
                        onClick={() => updateVisibility(t)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/[0.04] dark:bg-white/10 hover:bg-gold-500/20 border border-black/10 dark:border-white/10 text-xs font-semibold text-ink-50 hover:text-gold-700 dark:hover:text-gold-300 transition-all disabled:opacity-50 cursor-pointer"
                      >
                        <span>{t.isPublished ? 'Unpublish' : 'Publish'}</span>
                      </button>
                    </div>
                    <button
                      type="button"
                      disabled={updatingId === t._id}
                      onClick={() => deleteTestimonial(t)}
                      className="p-2 rounded-full text-red-500 hover:bg-red-500/10 transition-colors disabled:opacity-50 cursor-pointer"
                      title="Delete review"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="rounded-[28px] border border-dashed border-black/15 dark:border-white/15 bg-white/60 dark:bg-black/30 p-12 text-center">
          <Star className="mx-auto mb-3 h-10 w-10 text-gold-500/60" />
          <h4 className="font-serif text-lg text-ink-50 font-normal">No Testimonials Yet</h4>
          <p className="mt-1 text-xs text-ink-500 dark:text-ink-400 max-w-sm mx-auto">
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