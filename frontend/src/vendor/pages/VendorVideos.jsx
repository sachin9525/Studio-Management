import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  Clock,
  Film,
  Pencil,
  Play,
  Plus,
  RefreshCw,
  Save,
  Search,
  Sparkles,
  Trash2,
  UploadCloud,
  Video,
  X,
} from 'lucide-react';
import { VendorLayout, SelectedMediaPreviews } from '@/vendor/components';
import { useAuth } from '@/context/AuthContext';
import { apiRequest } from '@/utils/api';

const blankVideo = { title: '', description: '', eventDate: '', isPublished: true };
const inputClass = 'w-full rounded-sm border border-white/10 bg-ink-900 px-3 py-2.5 text-sm text-ink-100 focus:border-gold-400 focus:outline-none transition-colors';

const formatDate = (date) =>
  date
    ? new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : 'Date not set';

const DEFAULT_POSTERS = [
  'https://images.pexels.com/photos/33975526/pexels-photo-33975526.jpeg?auto=compress&cs=tinysrgb&w=900',
  'https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?auto=compress&cs=tinysrgb&w=900',
  'https://images.pexels.com/photos/32327730/pexels-photo-32327730.jpeg?auto=compress&cs=tinysrgb&w=900',
];

const SAMPLE_VIDEO_URL = 'https://assets.mixkit.co/videos/preview/mixkit-bride-and-groom-having-their-first-dance-41484-large.mp4';

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
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const loadVideos = useCallback(async () => {
    if (!session?.token) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const data = await apiRequest('/vendor/videos', { token: session.token });
      setVideos(data.videos || []);
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
      const data = await apiRequest(editingId ? `/vendor/videos/${editingId}` : '/vendor/videos', {
        method: editingId ? 'PATCH' : 'POST',
        token: session.token,
        body: payload,
      });
      if (editingId) {
        setVideos((current) => current.map((video) => (video._id === editingId ? data.video : video)));
      } else {
        setVideos((current) => [data.video, ...current]);
      }
      resetForm();
      setSaved(true);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to save video entry.');
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
      isPublished: video.isPublished !== false,
    });
    setShowAddForm(true);
    setSaved(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
      setVideos((current) => current.map((item) => (item._id === video._id ? data.video : item)));
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to update video status.');
    } finally {
      setUpdatingId('');
    }
  };

  const deleteVideo = async (video) => {
    if (!window.confirm(`Delete "${video.title}"? This cannot be undone.`)) return;
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

  const filteredVideos = useMemo(() => {
    return videos.filter((vid) => {
      const matchStatus =
        statusFilter === 'all' ||
        (statusFilter === 'published' && vid.isPublished) ||
        (statusFilter === 'draft' && !vid.isPublished);
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        vid.title.toLowerCase().includes(q) ||
        (vid.description && vid.description.toLowerCase().includes(q));
      return matchStatus && matchSearch;
    });
  }, [videos, statusFilter, searchQuery]);

  const publishedCount = videos.filter((video) => video.isPublished).length;
  const totalVideoFiles = videos.reduce((total, video) => total + (video.media?.length || 0), 0);

  return (
    <VendorLayout title="Cinematic Films">
      {/* Top Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded-full bg-gold-400/10 border border-gold-400/20 text-gold-300 text-[10px] uppercase tracking-widest font-semibold flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5 text-gold-400" />
              Cinematography Showcase
            </span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl text-ink-50 mb-1">4K Wedding Films</h2>
          <p className="text-xs sm:text-sm text-ink-400">
            Showcase your cinematic wedding trailers, teasers, and highlight reels.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={loadVideos}
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
            <span>{showAddForm ? 'Close Form' : 'Upload Film'}</span>
          </button>
        </div>
      </div>

      {error && (
        <div role="alert" className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-sm border border-red-400/20 bg-red-400/5 p-4 text-sm text-red-300">
          <span>{error}</span>
          <button type="button" onClick={loadVideos} className="underline underline-offset-4">Try again</button>
        </div>
      )}

      {saved && (
        <div role="status" className="mb-6 rounded-sm border border-emerald-400/20 bg-emerald-400/10 p-3 text-xs text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Film uploaded successfully and published in your video showcase.</span>
        </div>
      )}

      {/* Symmetrical Metric Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-3.5 mb-8">
        <div className="p-3.5 sm:p-4 rounded-sm bg-ink-900/80 border border-white/5 backdrop-blur-md">
          <span className="text-[10px] uppercase tracking-wider text-ink-500 block mb-1 font-medium">Total Films</span>
          <p className="font-sans font-bold text-2xl sm:text-3xl text-ink-50 leading-none tabular-nums">{videos.length}</p>
          <p className="text-[10px] text-emerald-400 mt-1 font-medium">{publishedCount} live online</p>
        </div>
        <div className="p-3.5 sm:p-4 rounded-sm bg-ink-900/80 border border-white/5 backdrop-blur-md">
          <span className="text-[10px] uppercase tracking-wider text-ink-500 block mb-1 font-medium">Quality Tier</span>
          <p className="font-serif text-2xl sm:text-3xl text-gold-400 leading-none">4K Ultra HD</p>
          <p className="text-[10px] text-ink-500 mt-1">Cinematic grading</p>
        </div>
        <div className="p-3.5 sm:p-4 rounded-sm bg-ink-900/80 border border-white/5 backdrop-blur-md">
          <span className="text-[10px] uppercase tracking-wider text-ink-500 block mb-1 font-medium">Video Files</span>
          <p className="font-sans font-bold text-2xl sm:text-3xl text-ink-50 leading-none tabular-nums">{totalVideoFiles}</p>
          <p className="text-[10px] text-ink-500 mt-1">Uploaded clips</p>
        </div>
        <div className="p-3.5 sm:p-4 rounded-sm bg-gradient-to-br from-gold-400/15 via-ink-900/90 to-ink-900 border border-gold-400/30 backdrop-blur-md">
          <span className="text-[10px] uppercase tracking-wider text-gold-400 block mb-1 font-semibold">Latest Film</span>
          <p className="font-serif text-lg sm:text-xl text-gold-300 leading-none truncate">
            {videos[0]?.title || 'No films yet'}
          </p>
          <p className="text-[10px] text-gold-400/80 mt-1 font-medium">{formatDate(videos[0]?.eventDate)}</p>
        </div>
      </div>

      {/* Add / Edit Video Form */}
      {showAddForm && (
        <form onSubmit={handleSubmit} className="mb-8 rounded-sm border border-gold-400/30 bg-ink-900/95 backdrop-blur-xl p-5 sm:p-6 shadow-2xl animate-scale-in">
          <div className="mb-5 flex items-center justify-between border-b border-white/5 pb-3">
            <div className="flex items-center gap-2">
              <Film className="w-5 h-5 text-gold-400" />
              <h3 className="font-serif text-xl text-ink-50">{editingId ? 'Edit Cinematic Film' : 'Upload New Wedding Film'}</h3>
            </div>
            <button type="button" onClick={resetForm} className="inline-flex items-center gap-1 text-xs text-ink-400 hover:text-ink-100">
              <X className="h-4 w-4" /> Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="block sm:col-span-2">
              <span className="mb-1.5 block text-[10px] uppercase tracking-wider text-ink-400 font-medium">Film Title *</span>
              <input required maxLength={120} value={form.title} onChange={(e) => setForm((curr) => ({ ...curr, title: e.target.value }))} className={inputClass} placeholder="e.g. Forever Begins Today · Meera & Aarav (Cinematic Teaser)" />
            </label>
            <label className="block sm:col-span-2">
              <span className="mb-1.5 block text-[10px] uppercase tracking-wider text-ink-400 font-medium">Event Date</span>
              <input type="date" value={form.eventDate} onChange={(e) => setForm((curr) => ({ ...curr, eventDate: e.target.value }))} className={inputClass} />
            </label>
            <label className="block sm:col-span-2">
              <span className="mb-1.5 block text-[10px] uppercase tracking-wider text-ink-400 font-medium">Description & Music Credits</span>
              <textarea rows={3} maxLength={2000} value={form.description} onChange={(e) => setForm((curr) => ({ ...curr, description: e.target.value }))} className={inputClass} placeholder="Short synopsis of the film, equipment used, and music score." />
            </label>

            <div className="sm:col-span-2 border-2 border-dashed border-white/10 hover:border-gold-400/40 rounded-sm p-5 text-center transition-colors bg-ink-950/40">
              <UploadCloud className="w-8 h-8 text-gold-400 mx-auto mb-2" />
              <p className="text-xs text-ink-200 font-medium mb-1">Select 4K / HD Video or Poster Media</p>
              <p className="text-[11px] text-ink-500 mb-3">Upload MP4, MOV, WEBM, or teaser cover photos</p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="video/mp4,video/quicktime,video/webm,image/*"
                onChange={(e) => setFiles(Array.from(e.target.files || []))}
                className="hidden"
                id="vendor-video-file-input"
              />
              <label
                htmlFor="vendor-video-file-input"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-white/5 hover:bg-gold-400/10 border border-white/10 hover:border-gold-400/30 text-xs text-gold-300 font-medium cursor-pointer transition-colors"
              >
                Choose Video Files
              </label>
              {files.length > 0 && (
                <p className="mt-2 text-xs text-emerald-400 font-medium">✓ {files.length} media files selected</p>
              )}
            </div>

            <SelectedMediaPreviews files={files} onRemove={(idx) => setFiles((curr) => curr.filter((_, i) => i !== idx))} />
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-white/5 pt-4">
            <label className="flex cursor-pointer items-center gap-2.5 text-xs text-ink-300">
              <input type="checkbox" checked={form.isPublished} onChange={(e) => setForm((curr) => ({ ...curr, isPublished: e.target.checked }))} className="h-4 w-4 rounded border-white/20 bg-ink-900 accent-yellow-500" />
              <span>Publish Video Showcase Live</span>
            </label>
            <div className="flex items-center gap-2">
              <button type="button" onClick={resetForm} className="px-3.5 py-2 rounded-sm border border-white/10 text-xs text-ink-400 hover:text-ink-200">
                Cancel
              </button>
              <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-sm bg-gradient-to-r from-gold-500 to-gold-400 px-4 py-2 text-xs font-medium uppercase tracking-wider text-ink-950 hover:brightness-110 disabled:opacity-50 shadow-md shadow-gold-500/10">
                {editingId ? <Save className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                <span>{saving ? 'Uploading…' : editingId ? 'Update Film' : 'Publish Film'}</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Filter and Search Bar */}
      <div className="p-3 sm:p-4 rounded-sm bg-ink-900/80 border border-white/5 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-3 backdrop-blur-md">
        <div className="flex items-center gap-2">
          {['all', 'published', 'draft'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-sm text-xs uppercase tracking-wider font-medium transition-all capitalize ${
                statusFilter === status
                  ? 'bg-gold-400 text-ink-950 shadow-md shadow-gold-400/20 font-semibold'
                  : 'text-ink-400 hover:text-ink-100 hover:bg-white/5'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-ink-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search films, couples…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 rounded-sm bg-ink-950/70 border border-white/10 text-xs text-ink-100 focus:border-gold-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Videos Grid */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-serif text-xl text-ink-50">Film Releases</h3>
        <span className="text-xs text-ink-500">{filteredVideos.length} films</span>
      </div>

      {loading ? (
        <div className="py-16 text-center text-sm text-ink-500">Loading cinematic films…</div>
      ) : filteredVideos.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredVideos.map((video, idx) => {
            const posterImage =
              video.media?.find((m) => m.type?.startsWith('image'))?.url ||
              DEFAULT_POSTERS[idx % DEFAULT_POSTERS.length];
            const videoUrl =
              video.media?.find((m) => m.type?.startsWith('video'))?.url || SAMPLE_VIDEO_URL;

            return (
              <article
                key={video._id}
                className="group relative flex flex-col rounded-sm border border-white/5 bg-ink-900/80 backdrop-blur-md overflow-hidden transition-all duration-300 hover:border-gold-400/30 hover:-translate-y-1"
              >
                {/* Poster & Play Button */}
                <div className="relative h-56 w-full overflow-hidden bg-ink-950">
                  <img
                    src={posterImage}
                    alt={video.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.src = DEFAULT_POSTERS[0];
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-85" />

                  {/* Play Button Trigger */}
                  <button
                    type="button"
                    onClick={() => setSelectedVideo({ ...video, videoUrl, posterImage })}
                    className="absolute inset-0 flex items-center justify-center group-hover:bg-black/20 transition-colors"
                    aria-label="Play Video"
                  >
                    <div className="w-14 h-14 rounded-full bg-gold-400 text-ink-950 flex items-center justify-center shadow-xl shadow-gold-500/30 transition-transform duration-300 group-hover:scale-110">
                      <Play className="w-6 h-6 fill-ink-950 ml-0.5" />
                    </div>
                  </button>

                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-[10px] uppercase tracking-wider text-gold-300 font-semibold">
                      <Film className="w-3 h-3" />
                      4K Ultra HD
                    </span>
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[9px] uppercase tracking-wider font-semibold backdrop-blur-md border ${
                        video.isPublished
                          ? 'bg-emerald-950/80 border-emerald-500/30 text-emerald-300'
                          : 'bg-black/70 border-white/10 text-stone-300'
                      }`}
                    >
                      {video.isPublished ? 'Live' : 'Draft'}
                    </span>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs text-ink-500 mb-1.5">
                      <Calendar className="w-3.5 h-3.5 text-gold-400" />
                      <span>{formatDate(video.eventDate)}</span>
                    </div>

                    <h4 className="font-serif text-xl text-ink-50 font-normal group-hover:text-gold-200 transition-colors line-clamp-1">
                      {video.title}
                    </h4>

                    <p className="text-xs text-ink-400 mt-1 line-clamp-2 min-h-[32px]">
                      {video.description || 'Cinematic wedding highlight film.'}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => editVideo(video)}
                        className="inline-flex items-center gap-1 text-xs text-ink-300 hover:text-gold-300 transition-colors"
                      >
                        <Pencil className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                      <button
                        type="button"
                        disabled={updatingId === video._id}
                        onClick={() => togglePublished(video)}
                        className="inline-flex items-center gap-1 text-xs text-ink-300 hover:text-gold-300 transition-colors disabled:opacity-50"
                      >
                        <span>{video.isPublished ? 'Unpublish' : 'Publish'}</span>
                      </button>
                    </div>
                    <button
                      type="button"
                      disabled={updatingId === video._id}
                      onClick={() => deleteVideo(video)}
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
          <Video className="mx-auto mb-3 h-10 w-10 text-gold-400/50" />
          <h4 className="font-serif text-lg text-ink-100">No Films Uploaded</h4>
          <p className="mt-1 text-xs text-ink-400 max-w-sm mx-auto">
            {searchQuery || statusFilter !== 'all'
              ? 'No films match your current filter.'
              : 'Upload your first cinematic wedding teaser or film by clicking "Upload Film" above.'}
          </p>
        </div>
      )}

      {/* Interactive Video Player Lightbox Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-950/90 backdrop-blur-xl animate-fade-in">
          <div className="relative w-full max-w-4xl rounded-sm border border-gold-400/30 bg-ink-900 overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-white/5 flex items-center justify-between">
              <div>
                <h3 className="font-serif text-xl text-ink-50">{selectedVideo.title}</h3>
                <p className="text-xs text-ink-400">{formatDate(selectedVideo.eventDate)} · 4K UHD Master</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedVideo(null)}
                className="p-1.5 rounded-sm text-ink-400 hover:text-ink-100 hover:bg-white/5 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="aspect-video w-full bg-black">
              <video
                src={selectedVideo.videoUrl}
                poster={selectedVideo.posterImage}
                controls
                autoPlay
                className="h-full w-full object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </VendorLayout>
  );
}

export default VendorVideos;
