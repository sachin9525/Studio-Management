import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  Eye,
  Images,
  Pencil,
  Plus,
  RefreshCw,
  Save,
  Search,
  Sparkles,
  Trash2,
  UploadCloud,
  X,
} from 'lucide-react';
import { VendorLayout, SelectedMediaPreviews } from '@/vendor/components';
import { useAuth } from '@/context/AuthContext';
import { apiRequest } from '@/utils/api';

const blankAlbum = { title: '', description: '', eventDate: '', isPublished: true };

const inputClass =
  'w-full rounded-full border border-black/15 dark:border-white/15 bg-white/90 dark:bg-black/40 px-4 py-2.5 text-xs text-ink-50 placeholder:text-ink-400 focus:outline-none focus:border-gold-500/60 shadow-inner transition-colors';

const textareaClass =
  'w-full rounded-2xl border border-black/15 dark:border-white/15 bg-white/90 dark:bg-black/40 px-4 py-3 text-xs text-ink-50 placeholder:text-ink-400 focus:outline-none focus:border-gold-500/60 shadow-inner transition-colors';

const formatDate = (date) =>
  date
    ? new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : 'Date not set';

const DEFAULT_COVERS = [
  'https://images.pexels.com/photos/32327732/pexels-photo-32327732.jpeg?auto=compress&cs=tinysrgb&w=900',
  'https://images.pexels.com/photos/32327730/pexels-photo-32327730.jpeg?auto=compress&cs=tinysrgb&w=900',
  'https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?auto=compress&cs=tinysrgb&w=900',
  'https://images.pexels.com/photos/169198/pexels-photo-169198.jpeg?auto=compress&cs=tinysrgb&w=900',
];

function VendorAlbums() {
  const { session } = useAuth();
  const [albums, setAlbums] = useState([]);
  const [form, setForm] = useState(blankAlbum);
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);
  const [editingId, setEditingId] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [updatingId, setUpdatingId] = useState('');
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [previewAlbum, setPreviewAlbum] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const loadAlbums = useCallback(async () => {
    if (!session?.token) return;
    setLoading(true);
    setError('');
    try {
      const data = await apiRequest('/vendor/albums', { token: session.token });
      setAlbums(data.albums || []);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to load albums.');
    } finally {
      setLoading(false);
    }
  }, [session?.token]);

  useEffect(() => {
    loadAlbums();
  }, [loadAlbums]);

  const resetForm = () => {
    setForm(blankAlbum);
    setFiles([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
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
    Object.entries({ ...form, eventDate: form.eventDate || '' }).forEach(([key, value]) => {
      payload.append(key, String(value));
    });
    files.forEach((file) => payload.append('files', file));
    try {
      const data = await apiRequest(editingId ? `/vendor/albums/${editingId}` : '/vendor/albums', {
        method: editingId ? 'PATCH' : 'POST',
        token: session.token,
        body: payload,
      });
      if (editingId) {
        setAlbums((current) => current.map((album) => (album._id === editingId ? data.album : album)));
      } else {
        setAlbums((current) => [data.album, ...current]);
      }
      resetForm();
      setSaved(true);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to save album.');
    } finally {
      setSaving(false);
    }
  };

  const editAlbum = (album) => {
    setEditingId(album._id);
    setForm({
      title: album.title,
      description: album.description || '',
      eventDate: album.eventDate ? album.eventDate.slice(0, 10) : '',
      isPublished: album.isPublished !== false,
    });
    setShowAddForm(true);
    setSaved(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const togglePublish = async (album) => {
    setUpdatingId(album._id);
    setError('');
    try {
      const data = await apiRequest(`/vendor/albums/${album._id}`, {
        method: 'PATCH',
        token: session.token,
        body: JSON.stringify({ isPublished: !album.isPublished }),
      });
      setAlbums((current) => current.map((item) => (item._id === album._id ? data.album : item)));
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to toggle album status.');
    } finally {
      setUpdatingId('');
    }
  };

  const deleteAlbum = async (album) => {
    if (!window.confirm(`Delete "${album.title}" and its photos? This cannot be undone.`)) return;
    setUpdatingId(album._id);
    setError('');
    try {
      await apiRequest(`/vendor/albums/${album._id}`, { method: 'DELETE', token: session.token });
      setAlbums((current) => current.filter((item) => item._id !== album._id));
      if (editingId === album._id) resetForm();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to delete album.');
    } finally {
      setUpdatingId('');
    }
  };

  const filteredAlbums = useMemo(() => {
    return albums.filter((alb) => {
      const matchStatus =
        statusFilter === 'all' ||
        (statusFilter === 'published' && alb.isPublished) ||
        (statusFilter === 'draft' && !alb.isPublished);
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        alb.title.toLowerCase().includes(q) ||
        (alb.description && alb.description.toLowerCase().includes(q));
      return matchStatus && matchSearch;
    });
  }, [albums, statusFilter, searchQuery]);

  const publishedCount = albums.filter((album) => album.isPublished).length;
  const totalPhotosCount = albums.reduce((acc, a) => acc + (a.media?.length || 0), 0);

  return (
    <VendorLayout title="Studio Albums">
      {/* Top Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-700 dark:text-gold-300 text-[10px] font-mono uppercase tracking-widest font-bold flex items-center gap-1.5 shadow-2xs">
              <Sparkles className="w-3 h-3 text-gold-600 dark:text-gold-400" />
              Photo Galleries & Books
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-ink-50 font-normal tracking-tight">Studio Albums</h2>
          <p className="text-xs sm:text-sm text-ink-500 dark:text-ink-400 mt-1 max-w-2xl font-medium">
            Curate high-resolution wedding, pre-wedding, and celebration photo collections for your public catalog.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start md:self-auto">
          <button
            type="button"
            onClick={loadAlbums}
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
            <span>{showAddForm ? 'Close Form' : 'New Album'}</span>
          </button>
        </div>
      </div>

      {error && (
        <div role="alert" className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-xs font-semibold text-red-600 dark:text-red-400">
          <span>{error}</span>
          <button type="button" onClick={loadAlbums} className="underline underline-offset-4 cursor-pointer">Try again</button>
        </div>
      )}

      {saved && (
        <div role="status" className="mb-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          <span>Album saved successfully and updated in studio catalog.</span>
        </div>
      )}

      {/* 4 Glassy Stat Capsules */}
      <div className="mb-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {[
          ['Total Albums', albums.length, `${publishedCount} Published Live`],
          ['Total Photos', totalPhotosCount, 'High-Res Frames'],
          ['Draft Albums', albums.length - publishedCount, 'Pending Publishing'],
          ['Latest Album', albums[0]?.title || 'No albums yet', formatDate(albums[0]?.eventDate)],
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

      {/* Add / Edit Album Form Panel */}
      {showAddForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-8 rounded-[28px] border border-black/10 dark:border-white/15 bg-white/95 dark:bg-black/60 backdrop-blur-2xl p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.6)] animate-fade-in relative overflow-hidden"
        >
          <div className="absolute -top-16 -right-16 w-48 h-48 bg-amber-500/10 dark:bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

          <div className="mb-6 flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-4 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gold-500/15 border border-gold-500/30 flex items-center justify-center text-gold-700 dark:text-gold-300">
                <Images className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-2xl text-ink-50 font-normal">{editingId ? 'Edit Album' : 'Create New Photo Album'}</h3>
                <p className="text-xs text-ink-500 dark:text-ink-400">Add collection details and upload high-res imagery</p>
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
            <label className="block sm:col-span-2">
              <span className="mb-1.5 block text-[10px] font-mono uppercase tracking-widest text-ink-500 dark:text-ink-400 font-bold">Album Title *</span>
              <input
                required
                maxLength={120}
                value={form.title}
                onChange={(e) => setForm((curr) => ({ ...curr, title: e.target.value }))}
                className={inputClass}
                placeholder="e.g. Royal Palace Wedding · Aarav & Meera"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-[10px] font-mono uppercase tracking-widest text-ink-500 dark:text-ink-400 font-bold">Event Date</span>
              <input
                type="date"
                value={form.eventDate}
                onChange={(e) => setForm((curr) => ({ ...curr, eventDate: e.target.value }))}
                className={inputClass}
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="mb-1.5 block text-[10px] font-mono uppercase tracking-widest text-ink-500 dark:text-ink-400 font-bold">Album Description</span>
              <textarea
                rows={3}
                maxLength={1000}
                value={form.description}
                onChange={(e) => setForm((curr) => ({ ...curr, description: e.target.value }))}
                className={textareaClass}
                placeholder="Short story or notes about this shoot."
              />
            </label>

            <div className="sm:col-span-2 border-2 border-dashed border-black/15 dark:border-white/15 hover:border-gold-500/50 rounded-[22px] p-6 text-center transition-all bg-black/[0.02] dark:bg-white/[0.02]">
              <UploadCloud className="w-10 h-10 text-gold-600 dark:text-gold-400 mx-auto mb-2" />
              <p className="text-xs text-ink-50 font-bold mb-1">Select High-Resolution Photos</p>
              <p className="text-[11px] text-ink-500 dark:text-ink-400 mb-3">Upload JPG, PNG, or WEBP images for this collection</p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={(e) => setFiles(Array.from(e.target.files || []))}
                className="hidden"
                id="vendor-album-file-input"
              />
              <label
                htmlFor="vendor-album-file-input"
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/90 dark:bg-black/50 hover:bg-gold-500/10 border border-black/15 dark:border-white/15 hover:border-gold-500/40 text-xs text-gold-700 dark:text-gold-300 font-bold cursor-pointer transition-all shadow-2xs"
              >
                Browse Files
              </label>
              {files.length > 0 && (
                <p className="mt-3 text-xs text-emerald-600 dark:text-emerald-400 font-bold">✓ {files.length} photos selected for upload</p>
              )}
            </div>

            <SelectedMediaPreviews files={files} onRemove={(idx) => setFiles((curr) => curr.filter((_, i) => i !== idx))} />
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-black/10 dark:border-white/10 pt-5 relative z-10">
            <label className="flex cursor-pointer items-center gap-3 text-xs text-ink-50 font-medium">
              <input
                type="checkbox"
                checked={form.isPublished}
                onChange={(e) => setForm((curr) => ({ ...curr, isPublished: e.target.checked }))}
                className="h-4 w-4 rounded-full border-black/20 bg-transparent text-gold-500 focus:ring-gold-500 cursor-pointer"
              />
              <span>Publish Album Live on Public Profile</span>
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
                <span>{saving ? 'Uploading…' : editingId ? 'Update Album' : 'Create Album'}</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Filter and Search Bar */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {['all', 'published', 'draft'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-full text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                statusFilter === status
                  ? 'bg-gradient-to-r from-gold-500 to-gold-400 text-ink-950 shadow-md shadow-gold-500/25 font-bold'
                  : 'bg-white/60 dark:bg-black/30 border border-black/10 dark:border-white/10 text-ink-500 dark:text-ink-400 hover:text-ink-50 hover:bg-white/80 dark:hover:bg-white/5'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-500 dark:text-ink-400" />
          <input
            type="text"
            placeholder="Search albums by title…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-full border border-black/15 dark:border-white/15 bg-white/90 dark:bg-black/40 pl-10 pr-4 py-2 text-xs text-ink-50 placeholder:text-ink-400 focus:outline-none focus:border-gold-500/60 shadow-inner"
          />
        </div>
      </div>

      {/* Albums Grid */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-serif text-2xl text-ink-50 font-normal">Album Collections</h3>
        <span className="text-xs font-mono font-bold text-ink-500 dark:text-ink-400 uppercase tracking-widest">{filteredAlbums.length} collections</span>
      </div>

      {loading ? (
        <div className="py-20 text-center text-sm text-ink-500 dark:text-ink-400 font-mono">Loading albums…</div>
      ) : filteredAlbums.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAlbums.map((album, idx) => {
            const coverImage = album.media?.[0]?.url || DEFAULT_COVERS[idx % DEFAULT_COVERS.length];
            const photosCount = album.media?.length || 0;

            return (
              <article
                key={album._id}
                className="group relative rounded-[28px] overflow-hidden border border-black/10 dark:border-white/15 bg-white/90 dark:bg-black/45 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.06)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-amber-500/10 dark:bg-amber-400/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-all pointer-events-none" />

                <div>
                  {/* Cover Image Container */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-ink-950 m-2.5 rounded-[22px]">
                    <img
                      src={coverImage}
                      alt={album.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.src = DEFAULT_COVERS[0];
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-[10px] font-mono uppercase tracking-wider text-gold-300 font-bold shadow-md">
                        <Images className="w-3 h-3 text-gold-400" />
                        {photosCount} photos
                      </span>
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider font-bold backdrop-blur-md border shadow-md ${
                          album.isPublished
                            ? 'bg-emerald-500/20 border-emerald-400/40 text-emerald-300'
                            : 'bg-black/70 border-white/20 text-stone-300'
                        }`}
                      >
                        {album.isPublished ? 'Live' : 'Draft'}
                      </span>
                    </div>

                    {/* Quick Preview Lightbox trigger */}
                    <button
                      type="button"
                      onClick={() => setPreviewAlbum(album)}
                      className="absolute bottom-3 right-3 p-2.5 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-gold-300 hover:bg-gold-500 hover:text-ink-950 transition-all shadow-lg opacity-0 group-hover:opacity-100 cursor-pointer"
                      title="View Album Lightbox"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="p-5 pb-3">
                    <div className="flex items-center gap-1.5 text-xs text-ink-500 dark:text-ink-400 mb-1.5 font-mono">
                      <Calendar className="w-3.5 h-3.5 text-gold-600 dark:text-gold-400" />
                      <span>{formatDate(album.eventDate)}</span>
                    </div>
                    <h4 className="font-serif text-xl text-ink-50 font-normal group-hover:text-gold-700 dark:group-hover:text-gold-300 transition-colors line-clamp-1">
                      {album.title}
                    </h4>
                    <p className="text-xs text-ink-500 dark:text-ink-400 mt-1 line-clamp-2 min-h-[32px] leading-relaxed">
                      {album.description || 'Curated wedding photo gallery.'}
                    </p>
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="p-5 pt-3 border-t border-black/10 dark:border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => editAlbum(album)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/[0.04] dark:bg-white/10 hover:bg-gold-500/20 border border-black/10 dark:border-white/10 text-xs font-semibold text-ink-50 hover:text-gold-700 dark:hover:text-gold-300 transition-all cursor-pointer"
                    >
                      <Pencil className="w-3 h-3" />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      disabled={updatingId === album._id}
                      onClick={() => togglePublish(album)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/[0.04] dark:bg-white/10 hover:bg-gold-500/20 border border-black/10 dark:border-white/10 text-xs font-semibold text-ink-50 hover:text-gold-700 dark:hover:text-gold-300 transition-all disabled:opacity-50 cursor-pointer"
                    >
                      <span>{album.isPublished ? 'Unpublish' : 'Publish'}</span>
                    </button>
                  </div>
                  <button
                    type="button"
                    disabled={updatingId === album._id}
                    onClick={() => deleteAlbum(album)}
                    className="p-2 rounded-full text-red-500 hover:bg-red-500/10 transition-colors disabled:opacity-50 cursor-pointer"
                    title="Delete album"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="rounded-[28px] border border-dashed border-black/15 dark:border-white/15 bg-white/60 dark:bg-black/30 p-12 text-center">
          <Images className="mx-auto mb-3 h-10 w-10 text-gold-500/60" />
          <h4 className="font-serif text-lg text-ink-50 font-normal">No Albums Found</h4>
          <p className="mt-1 text-xs text-ink-500 dark:text-ink-400 max-w-sm mx-auto">
            {searchQuery || statusFilter !== 'all'
              ? 'No albums match your active filter.'
              : 'Create your first photo gallery collection by clicking "New Album" above.'}
          </p>
        </div>
      )}

      {/* Album Preview Lightbox Modal */}
      {previewAlbum && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xl animate-fade-in">
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[28px] border border-black/15 dark:border-white/15 bg-white/95 dark:bg-black/85 backdrop-blur-2xl p-6 sm:p-8 shadow-2xl">
            <div className="flex items-start justify-between border-b border-black/10 dark:border-white/10 pb-4 mb-6">
              <div>
                <h3 className="font-serif text-2xl sm:text-3xl text-ink-50 font-normal">{previewAlbum.title}</h3>
                <p className="text-xs text-ink-500 dark:text-ink-400 mt-1 font-mono">
                  {formatDate(previewAlbum.eventDate)} · {previewAlbum.media?.length || 0} Photos in Collection
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPreviewAlbum(null)}
                className="p-2 rounded-full text-ink-400 hover:text-ink-50 hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {previewAlbum.media?.length ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {previewAlbum.media.map((img, i) => (
                  <div key={img._id || i} className="relative aspect-[4/3] rounded-[18px] overflow-hidden bg-ink-950 border border-black/10 dark:border-white/10 group">
                    <img src={img.url} alt="" className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-16 text-center text-sm text-ink-500 dark:text-ink-400 font-medium">
                <p>No uploaded photos in this album yet. Click &ldquo;Edit&rdquo; to add images.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </VendorLayout>
  );
}

export default VendorAlbums;