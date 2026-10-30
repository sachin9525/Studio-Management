import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowUpRight, CalendarDays, ImagePlus, Images, Pencil, Plus, RefreshCw, Save, Trash2, X } from 'lucide-react';
import { VendorLayout, SelectedMediaPreviews } from '@/vendor/components';
import { useAuth } from '@/context/AuthContext';
import { apiRequest } from '@/utils/api';

const blankAlbum = { title: '', description: '', eventDate: '', isPublished: false };
const inputClass = 'w-full rounded-sm border border-white/10 bg-ink-900 px-3 py-2.5 text-sm text-ink-100 focus:border-gold-400 focus:outline-none';
const formatDate = (date) => date
  ? new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  : 'Date not set';

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

  const loadAlbums = useCallback(async () => {
    if (!session?.token) return;
    setLoading(true);
    setError('');
    try {
      const data = await apiRequest('/vendor/albums', { token: session.token });
      setAlbums(data.albums);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to load albums.');
    } finally {
      setLoading(false);
    }
  }, [session?.token]);

  useEffect(() => { loadAlbums(); }, [loadAlbums]);

  const resetForm = () => {
    setForm(blankAlbum);
    setFiles([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setEditingId('');
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
        setAlbums((current) => current.map((album) => album._id === editingId ? data.album : album));
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
      eventDate: album.eventDate ? new Date(album.eventDate).toISOString().slice(0, 10) : '',
      isPublished: album.isPublished,
    });
    setFiles([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setSaved(false);
  };

  const togglePublished = async (album) => {
    setUpdatingId(album._id);
    setError('');
    try {
      const data = await apiRequest(`/vendor/albums/${album._id}`, {
        method: 'PATCH',
        token: session.token,
        body: JSON.stringify({ isPublished: !album.isPublished }),
      });
      setAlbums((current) => current.map((item) => item._id === album._id ? data.album : item));
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to update album visibility.');
    } finally {
      setUpdatingId('');
    }
  };

  const deleteAlbum = async (album) => {
    if (!window.confirm(`Delete “${album.title}” and its uploaded images? This cannot be undone.`)) return;
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

  const deleteImage = async (albumId, mediaId) => {
    setUpdatingId(albumId);
    setError('');
    try {
      const data = await apiRequest(`/vendor/albums/${albumId}/media/${mediaId}`, {
        method: 'DELETE',
        token: session.token,
      });
      setAlbums((current) => current.map((album) => album._id === albumId ? data.album : album));
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to remove uploaded image.');
    } finally {
      setUpdatingId('');
    }
  };

  const publishedCount = albums.filter((album) => album.isPublished).length;

  return <VendorLayout title="Albums">
    <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h2 className="mb-1 font-serif text-3xl text-ink-50">Albums</h2>
        <p className="text-sm text-ink-400">Upload, organize, and share your studio photo albums.</p>
      </div>
      <button type="button" onClick={loadAlbums} disabled={loading} className="inline-flex items-center gap-2 rounded-sm border border-white/10 px-3 py-2 text-xs text-ink-300 hover:border-gold-400/40 hover:text-gold-300 disabled:opacity-50">
        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
      </button>
    </div>

    {error && <p role="alert" className="mb-5 rounded-sm border border-red-400/20 bg-red-400/5 p-4 text-sm text-red-300">{error}</p>}
    {saved && <p role="status" className="mb-5 rounded-sm border border-green-400/20 bg-green-400/5 p-4 text-sm text-green-300">Album saved.</p>}

    <form onSubmit={handleSubmit} className="mb-8 max-w-4xl rounded-sm border border-white/5 bg-ink-800 p-5 md:p-7">
      <div className="mb-5 flex items-center justify-between gap-3">
        <h3 className="font-serif text-xl text-ink-50">{editingId ? 'Edit album' : 'Create an album'}</h3>
        {editingId && <button type="button" onClick={resetForm} className="inline-flex items-center gap-1 text-xs text-ink-400 hover:text-ink-100"><X className="h-4 w-4" /> Cancel</button>}
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-[10px] uppercase tracking-widest text-ink-400">Album title</span>
          <input required maxLength={120} value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} className={inputClass} placeholder="Aarav & Meera Wedding" />
        </label>
        <label className="block">
          <span className="mb-2 block text-[10px] uppercase tracking-widest text-ink-400">Event date</span>
          <input type="date" value={form.eventDate} onChange={(event) => setForm((current) => ({ ...current, eventDate: event.target.value }))} className={inputClass} />
        </label>
        <label className="block sm:col-span-2">
          <span className="mb-2 block text-[10px] uppercase tracking-widest text-ink-400">Upload photos</span>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={(event) => setFiles(Array.from(event.target.files || []))}
            className={`${inputClass} file:mr-4 file:rounded-sm file:border-0 file:bg-gold-400/10 file:px-3 file:py-2 file:text-xs file:text-gold-300`}
          />
          <span className="mt-2 block text-xs text-ink-500">Choose up to 20 images, 100 MB each. Preview them below before saving.</span>
          {files.length > 0 && <span className="mt-2 block text-xs text-ink-400">{files.length} image{files.length === 1 ? '' : 's'} selected</span>}
          <SelectedMediaPreviews files={files} />
        </label>
        <label className="block sm:col-span-2">
          <span className="mb-2 block text-[10px] uppercase tracking-widest text-ink-400">Description</span>
          <textarea maxLength={2000} rows={3} value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} className={inputClass} placeholder="A few details about this album." />
        </label>
      </div>
      <label className="mt-5 flex cursor-pointer items-center gap-3 text-sm text-ink-300">
        <input type="checkbox" checked={form.isPublished} onChange={(event) => setForm((current) => ({ ...current, isPublished: event.target.checked }))} className="h-4 w-4 accent-yellow-500" />
        Publish this album
      </label>
      <button type="submit" disabled={saving} className="mt-6 inline-flex items-center gap-2 rounded-sm bg-gold-400 px-4 py-2.5 text-xs font-medium uppercase tracking-widest text-ink-950 hover:bg-gold-300 disabled:opacity-50">
        {editingId ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}{saving ? 'Saving…' : editingId ? 'Save changes' : 'Create album'}
      </button>
    </form>

    <div className="mb-4 flex items-center justify-between">
      <h3 className="font-serif text-xl text-ink-50">Your albums</h3>
      <span className="text-xs text-ink-500">{publishedCount} published · {albums.length} total</span>
    </div>
    {loading ? <p className="py-12 text-center text-sm text-ink-500">Loading albums…</p> : albums.length ? <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
      {albums.map((album) => <article key={album._id} className="overflow-hidden rounded-sm border border-white/5 bg-ink-800">
        <div className="relative flex aspect-[16/10] items-center justify-center bg-ink-900 text-gold-400">
          {album.media?.length ? <img src={album.media[0].url} alt={album.title} loading="lazy" className="absolute inset-0 h-full w-full object-cover" /> : <Images className="h-10 w-10 opacity-60" />}
          <span className={`absolute right-3 top-3 rounded-full border px-2.5 py-1 text-[10px] uppercase tracking-widest ${album.isPublished ? 'border-green-400/30 bg-ink-950/80 text-green-400' : 'border-white/10 bg-ink-950/80 text-ink-400'}`}>{album.isPublished ? 'Published' : 'Draft'}</span>
        </div>
        <div className="p-5">
          <h4 className="truncate font-serif text-xl text-ink-50">{album.title}</h4>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-500">
            <span className="inline-flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5" />{formatDate(album.eventDate)}</span>
            <span>{album.media?.length || 0} photo{album.media?.length === 1 ? '' : 's'}</span>
          </div>
          {album.description && <p className="mt-3 line-clamp-3 text-sm text-ink-400">{album.description}</p>}
          {album.media?.length > 0 && <div className="mt-4 grid grid-cols-3 gap-2">
            {album.media.map((image) => <div key={image._id} className="group relative aspect-square overflow-hidden rounded-sm bg-ink-900">
              <a href={image.url} target="_blank" rel="noreferrer" aria-label={`View ${image.originalName}`}>
                <img src={image.url} alt={image.originalName} loading="lazy" className="h-full w-full object-cover transition-transform group-hover:scale-105" />
              </a>
              <button type="button" disabled={updatingId === album._id} onClick={() => deleteImage(album._id, image._id)} aria-label={`Remove ${image.originalName}`} className="absolute right-1 top-1 rounded-full bg-ink-950/80 p-1.5 text-red-300 hover:bg-red-500/30 disabled:opacity-50"><X className="h-3.5 w-3.5" /></button>
            </div>)}
          </div>}
          <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-white/5 pt-4">
            <button type="button" disabled={updatingId === album._id} onClick={() => editAlbum(album)} className="inline-flex items-center gap-1.5 rounded-sm border border-white/10 px-3 py-2 text-xs text-ink-300 hover:border-gold-400/30 hover:text-gold-300 disabled:opacity-50"><Pencil className="h-3.5 w-3.5" /> Edit</button>
            <button type="button" disabled={updatingId === album._id} onClick={() => togglePublished(album)} className="inline-flex items-center gap-1.5 rounded-sm border border-white/10 px-3 py-2 text-xs text-ink-300 hover:text-gold-300 disabled:opacity-50">{album.isPublished ? 'Unpublish' : 'Publish'} <ArrowUpRight className="h-3.5 w-3.5" /></button>
            <button type="button" disabled={updatingId === album._id} onClick={() => deleteAlbum(album)} className="ml-auto inline-flex items-center gap-1.5 rounded-sm px-3 py-2 text-xs text-red-300 hover:bg-red-400/10 disabled:opacity-50"><Trash2 className="h-3.5 w-3.5" /> Delete</button>
          </div>
        </div>
      </article>)}
    </div> : <div className="rounded-sm border border-white/5 bg-ink-800 px-5 py-14 text-center">
      <ImagePlus className="mx-auto mb-3 h-8 w-8 text-ink-500" />
      <p className="text-sm text-ink-300">No albums added yet.</p>
      <p className="mt-1 text-xs text-ink-500">Create an album above and upload your photos.</p>
    </div>}
  </VendorLayout>;
}

export default VendorAlbums;
