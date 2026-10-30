import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowUpRight, CalendarDays, Pencil, Plus, RefreshCw, Save, Trash2, Video, X } from 'lucide-react';
import DashboardLayout from '@/components/common/DashboardLayout';
import SelectedMediaPreviews from '@/components/common/SelectedMediaPreviews';
import { vendorNavItems } from '@/data/navConfig';
import { useAuth } from '@/context/AuthContext';
import { apiRequest } from '@/utils/api';

const blankVideo = { title: '', description: '', eventDate: '', isPublished: false };
const inputClass = 'w-full rounded-sm border border-white/10 bg-ink-900 px-3 py-2.5 text-sm text-ink-100 focus:border-gold-400 focus:outline-none';
const formatDate = (date) => date
  ? new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  : 'Date not set';

function VendorVideos() {
  const { session } = useAuth();
  const [videos, setVideos] = useState([]);
  const [form, setForm] = useState(blankVideo);
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);
  const [editingId, setEditingId] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [updatingId, setUpdatingId] = useState('');
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const [refreshedAt, setRefreshedAt] = useState(null);

  const loadVideos = useCallback(async () => {
    if (!session?.token) {
      setError('Your session has expired. Please sign in again to refresh videos.');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const data = await apiRequest('/vendor/videos', { token: session.token });
      setVideos(data.videos || []);
      setRefreshedAt(new Date());
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to load videos.');
    } finally {
      setLoading(false);
    }
  }, [session?.token]);

  useEffect(() => { loadVideos(); }, [loadVideos]);

  const resetForm = () => {
    setForm(blankVideo);
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
      const data = await apiRequest(editingId ? `/vendor/videos/${editingId}` : '/vendor/videos', {
        method: editingId ? 'PATCH' : 'POST',
        token: session.token,
        body: payload,
      });
      if (editingId) {
        setVideos((current) => current.map((video) => video._id === editingId ? data.video : video));
      } else {
        setVideos((current) => [data.video, ...current]);
      }
      resetForm();
      setSaved(true);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to save videos.');
    } finally {
      setSaving(false);
    }
  };

  const editVideo = (video) => {
    setEditingId(video._id);
    setForm({
      title: video.title,
      description: video.description || '',
      eventDate: video.eventDate ? new Date(video.eventDate).toISOString().slice(0, 10) : '',
      isPublished: video.isPublished,
    });
    setFiles([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setSaved(false);
  };

  const togglePublished = async (video) => {
    setUpdatingId(video._id);
    setError('');
    try {
      const data = await apiRequest(`/vendor/videos/${video._id}`, {
        method: 'PATCH',
        token: session.token,
        body: JSON.stringify({ isPublished: !video.isPublished }),
      });
      setVideos((current) => current.map((item) => item._id === video._id ? data.video : item));
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to update video visibility.');
    } finally {
      setUpdatingId('');
    }
  };

  const deleteVideo = async (video) => {
    if (!window.confirm(`Delete “${video.title}” and its uploaded videos? This cannot be undone.`)) return;
    setUpdatingId(video._id);
    setError('');
    try {
      await apiRequest(`/vendor/videos/${video._id}`, { method: 'DELETE', token: session.token });
      setVideos((current) => current.filter((item) => item._id !== video._id));
      if (editingId === video._id) resetForm();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to delete video entry.');
    } finally {
      setUpdatingId('');
    }
  };

  const deleteVideoFile = async (videoId, mediaId) => {
    setUpdatingId(videoId);
    setError('');
    try {
      const data = await apiRequest(`/vendor/videos/${videoId}/media/${mediaId}`, {
        method: 'DELETE',
        token: session.token,
      });
      if (data.video) setVideos((current) => current.map((video) => video._id === videoId ? data.video : video));
      else setVideos((current) => current.filter((video) => video._id !== videoId));
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to remove uploaded video.');
    } finally {
      setUpdatingId('');
    }
  };

  const publishedCount = videos.filter((video) => video.isPublished).length;
  const totalVideoFiles = videos.reduce((total, video) => total + (video.media?.length || 0), 0);

  return <DashboardLayout navItems={vendorNavItems} title="Videos" role="vendor">
    <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h2 className="mb-1 font-serif text-3xl text-ink-50">Videos</h2>
        <p className="text-sm text-ink-400">Upload and manage videos from your studio work.</p>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        {refreshedAt && <span role="status" className="text-xs text-ink-500">Updated {refreshedAt.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' })}</span>}
        <button type="button" onClick={() => loadVideos()} disabled={loading} aria-label={loading ? 'Refreshing videos' : 'Refresh videos'} className="inline-flex items-center gap-2 rounded-sm border border-white/10 px-3 py-2 text-xs text-ink-300 hover:border-gold-400/40 hover:text-gold-300 disabled:cursor-wait disabled:opacity-50">
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> {loading ? 'Refreshing…' : 'Refresh'}
        </button>
      </div>
    </div>

    {error && <p role="alert" className="mb-5 rounded-sm border border-red-400/20 bg-red-400/5 p-4 text-sm text-red-300">{error}</p>}
    {saved && <p role="status" className="mb-5 rounded-sm border border-green-400/20 bg-green-400/5 p-4 text-sm text-green-300">Video entry saved.</p>}

    <form onSubmit={handleSubmit} className="mb-8 max-w-4xl rounded-sm border border-white/5 bg-ink-800 p-5 md:p-7">
      <div className="mb-5 flex items-center justify-between gap-3">
        <h3 className="font-serif text-xl text-ink-50">{editingId ? 'Edit video entry' : 'Add videos'}</h3>
        {editingId && <button type="button" onClick={resetForm} className="inline-flex items-center gap-1 text-xs text-ink-400 hover:text-ink-100"><X className="h-4 w-4" /> Cancel</button>}
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-[10px] uppercase tracking-widest text-ink-400">Video title</span>
          <input required maxLength={120} value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} className={inputClass} placeholder="Wedding highlights" />
        </label>
        <label className="block">
          <span className="mb-2 block text-[10px] uppercase tracking-widest text-ink-400">Event date</span>
          <input type="date" value={form.eventDate} onChange={(event) => setForm((current) => ({ ...current, eventDate: event.target.value }))} className={inputClass} />
        </label>
        <label className="block sm:col-span-2">
          <span className="mb-2 block text-[10px] uppercase tracking-widest text-ink-400">Upload videos</span>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="video/mp4,video/webm,video/quicktime,video/x-matroska,video/mkv,.mkv"
            onChange={(event) => setFiles(Array.from(event.target.files || []))}
            className={`${inputClass} file:mr-4 file:rounded-sm file:border-0 file:bg-gold-400/10 file:px-3 file:py-2 file:text-xs file:text-gold-300`}
          />
          <span className="mt-2 block text-xs text-ink-500">Choose up to 20 videos, 100 MB each. Supported formats: MP4, WebM, MOV, and MKV. Preview and play them below before saving. Use Add videos to upload; Refresh only reloads saved entries.</span>
          {files.length > 0 && <span className="mt-2 block text-xs text-ink-400">{files.length} video{files.length === 1 ? '' : 's'} selected</span>}
          <SelectedMediaPreviews files={files} />
        </label>
        <label className="block sm:col-span-2">
          <span className="mb-2 block text-[10px] uppercase tracking-widest text-ink-400">Description</span>
          <textarea maxLength={2000} rows={3} value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} className={inputClass} placeholder="Add a short description." />
        </label>
      </div>
      <label className="mt-5 flex cursor-pointer items-center gap-3 text-sm text-ink-300">
        <input type="checkbox" checked={form.isPublished} onChange={(event) => setForm((current) => ({ ...current, isPublished: event.target.checked }))} className="h-4 w-4 accent-yellow-500" />
        Publish these videos
      </label>
      <button type="submit" disabled={saving} className="mt-6 inline-flex items-center gap-2 rounded-sm bg-gold-400 px-4 py-2.5 text-xs font-medium uppercase tracking-widest text-ink-950 hover:bg-gold-300 disabled:opacity-50">
        {editingId ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}{saving ? 'Saving…' : editingId ? 'Save changes' : 'Add videos'}
      </button>
    </form>

    <div className="mb-4 flex items-center justify-between">
      <h3 className="font-serif text-xl text-ink-50">Your videos</h3>
      <span className="text-xs text-ink-500">{totalVideoFiles} videos · {publishedCount} published entries</span>
    </div>
    {loading ? <p className="py-12 text-center text-sm text-ink-500">Loading videos…</p> : videos.length ? <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
      {videos.map((video) => <article key={video._id} className="overflow-hidden rounded-sm border border-white/5 bg-ink-800">
        <div className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h4 className="truncate font-serif text-xl text-ink-50">{video.title}</h4>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-500">
                <span className="inline-flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5" />{formatDate(video.eventDate)}</span>
                <span>{video.media?.length || 0} file{video.media?.length === 1 ? '' : 's'}</span>
              </div>
            </div>
            <span className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] uppercase tracking-widest ${video.isPublished ? 'border-green-400/30 bg-ink-950/80 text-green-400' : 'border-white/10 bg-ink-950/80 text-ink-400'}`}>{video.isPublished ? 'Published' : 'Draft'}</span>
          </div>
          {video.description && <p className="mt-3 line-clamp-3 text-sm text-ink-400">{video.description}</p>}
          {video.media?.length > 0 && <div className="mt-4 grid grid-cols-1 gap-3">
            {video.media.map((file) => <div key={file._id} className="group relative overflow-hidden rounded-sm bg-ink-900">
              <video src={file.url} controls preload="metadata" className="aspect-video w-full bg-ink-950 object-contain" />
              <div className="flex items-center justify-between gap-2 px-3 py-2">
                <span className="truncate text-xs text-ink-400" title={file.originalName}>{file.originalName}</span>
                <button type="button" disabled={updatingId === video._id} onClick={() => deleteVideoFile(video._id, file._id)} aria-label={`Remove ${file.originalName}`} className="shrink-0 rounded-full p-1.5 text-red-300 hover:bg-red-500/20 disabled:opacity-50"><X className="h-3.5 w-3.5" /></button>
              </div>
            </div>)}
          </div>}
          <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-white/5 pt-4">
            <button type="button" disabled={updatingId === video._id} onClick={() => editVideo(video)} className="inline-flex items-center gap-1.5 rounded-sm border border-white/10 px-3 py-2 text-xs text-ink-300 hover:border-gold-400/30 hover:text-gold-300 disabled:opacity-50"><Pencil className="h-3.5 w-3.5" /> Edit / Add</button>
            <button type="button" disabled={updatingId === video._id} onClick={() => togglePublished(video)} className="inline-flex items-center gap-1.5 rounded-sm border border-white/10 px-3 py-2 text-xs text-ink-300 hover:text-gold-300 disabled:opacity-50">{video.isPublished ? 'Unpublish' : 'Publish'} <ArrowUpRight className="h-3.5 w-3.5" /></button>
            <button type="button" disabled={updatingId === video._id} onClick={() => deleteVideo(video)} className="ml-auto inline-flex items-center gap-1.5 rounded-sm px-3 py-2 text-xs text-red-300 hover:bg-red-400/10 disabled:opacity-50"><Trash2 className="h-3.5 w-3.5" /> Delete</button>
          </div>
        </div>
      </article>)}
    </div> : <div className="rounded-sm border border-white/5 bg-ink-800 px-5 py-14 text-center">
      <Video className="mx-auto mb-3 h-8 w-8 text-ink-500" />
      <p className="text-sm text-ink-300">No videos added yet.</p>
      <p className="mt-1 text-xs text-ink-500">Add a video above and it will appear here for viewing.</p>
    </div>}
  </DashboardLayout>;
}

export default VendorVideos;
