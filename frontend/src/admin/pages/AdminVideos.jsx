import { useState, useMemo } from 'react';
import {
  Film,
  Plus,
  Search,
  Play,
  Trash2,
  Pencil,
  Sparkles,
  Clock,
  Eye,
  X,
  Video,
} from 'lucide-react';
import { AdminLayout } from '@/admin/components';
import { VIDEOS } from '@/data/demoContent';

const initialVideos = VIDEOS.map((vid, idx) => ({
  id: `vid-${idx + 1}`,
  title: vid.title,
  caption: vid.caption,
  poster: vid.poster,
  videoUrl: vid.videoUrl || 'https://assets.mixkit.co/videos/preview/mixkit-bride-and-groom-having-their-first-dance-41484-large.mp4',
  duration: idx === 0 ? '03:45' : idx === 1 ? '06:12' : '04:30',
  quality: '4K Ultra HD',
  views: 3200 + idx * 850,
  isPublished: true,
}));

function AdminVideos() {
  const [videos, setVideos] = useState(() => {
    try {
      const saved = localStorage.getItem('svml_admin_videos_items');
      return saved ? JSON.parse(saved) : initialVideos;
    } catch {
      return initialVideos;
    }
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    caption: '',
    poster: '',
    videoUrl: '',
    duration: '04:00',
    quality: '4K Ultra HD',
    isPublished: true,
  });

  const saveVideos = (items) => {
    setVideos(items);
    try {
      localStorage.setItem('svml_admin_videos_items', JSON.stringify(items));
    } catch (e) {
      console.error(e);
    }
  };

  const filteredVideos = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return videos;
    return videos.filter((v) => v.title.toLowerCase().includes(q) || v.caption.toLowerCase().includes(q));
  }, [videos, searchQuery]);

  const handleTogglePublish = (id) => {
    const updated = videos.map((v) => (v.id === id ? { ...v, isPublished: !v.isPublished } : v));
    saveVideos(updated);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this film?')) {
      const updated = videos.filter((v) => v.id !== id);
      saveVideos(updated);
    }
  };

  const handleOpenAddModal = () => {
    setEditingVideo(null);
    setFormData({
      title: '',
      caption: '',
      poster: 'https://images.pexels.com/photos/33975526/pexels-photo-33975526.jpeg?auto=compress&cs=tinysrgb&w=900',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-bride-and-groom-having-their-first-dance-41484-large.mp4',
      duration: '04:15',
      quality: '4K Ultra HD',
      isPublished: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (vid) => {
    setEditingVideo(vid);
    setFormData({
      title: vid.title,
      caption: vid.caption,
      poster: vid.poster,
      videoUrl: vid.videoUrl,
      duration: vid.duration,
      quality: vid.quality,
      isPublished: vid.isPublished,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.poster) return;

    if (editingVideo) {
      const updated = videos.map((v) => (v.id === editingVideo.id ? { ...v, ...formData } : v));
      saveVideos(updated);
    } else {
      const newVid = {
        ...formData,
        id: `vid-${Date.now()}`,
        views: 120,
      };
      saveVideos([newVid, ...videos]);
    }
    setIsModalOpen(false);
  };

  return (
    <AdminLayout title="Cinematic Wedding Films">
      {/* Top Banner */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-3 py-1 rounded-full bg-gold-400/10 border border-gold-400/25 text-gold-700 dark:text-gold-300 text-[10px] uppercase font-mono tracking-widest font-bold flex items-center gap-1.5 shadow-2xs">
              <Sparkles className="w-3 h-3 text-gold-600 dark:text-gold-400" />
              Cinematic Theatre Manager
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-ink-50 font-normal tracking-tight">Wedding Films & Teasers</h2>
          <p className="text-xs sm:text-sm text-ink-500 dark:text-ink-400 mt-1 max-w-2xl font-medium">
            Manage the cinematic wedding trailers and teasers shown in the public video theatre section.
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-gold-500 to-gold-400 text-ink-950 font-bold text-xs uppercase tracking-wider hover:brightness-110 hover:scale-[1.02] transition-all shadow-lg shadow-gold-500/25 cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Wedding Film</span>
        </button>
      </div>

      {/* 4 Glassy Stat Cards */}
      <div className="mb-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {[
          ['Total Films', videos.length, `${videos.filter((v) => v.isPublished).length} Published Live`],
          ['Resolution', '4K DCI', 'Cinematic Standard'],
          ['Total Views', videos.reduce((a, b) => a + (b.views || 0), 0).toLocaleString('en-IN'), 'Trailer plays'],
          ['Audio Master', 'Dolby 5.1', 'Cinema Sound Mix'],
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
              <p className="font-serif text-3xl sm:text-4xl text-ink-50 font-normal tracking-tight group-hover:text-gold-700 dark:group-hover:text-gold-300 transition-colors tabular-nums">
                {value}
              </p>
              <p className="mt-1 text-[10px] uppercase font-mono font-bold tracking-widest text-ink-500 dark:text-ink-400">
                {label}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Search Bar */}
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-500 dark:text-ink-400" />
          <input
            type="text"
            placeholder="Search films by title or couple…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-full border border-black/15 dark:border-white/15 bg-white/90 dark:bg-black/40 pl-10 pr-4 py-2 text-xs text-ink-50 placeholder:text-ink-400 focus:outline-none focus:border-gold-500/60 shadow-inner"
          />
        </div>
      </div>

      {/* Video Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVideos.map((vid) => (
          <div
            key={vid.id}
            className="group relative rounded-[28px] overflow-hidden border border-black/10 dark:border-white/15 bg-white/90 dark:bg-black/45 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.06)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
          >
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-amber-500/10 dark:bg-amber-400/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-all pointer-events-none" />

            <div>
              <div className="relative aspect-[16/9] overflow-hidden bg-ink-950 m-2.5 rounded-[22px]">
                <img
                  src={vid.poster}
                  alt={vid.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40" />

                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span className="px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider font-bold bg-black/70 backdrop-blur-md border border-white/20 text-gold-300 shadow-md">
                    {vid.quality}
                  </span>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-mono bg-black/70 text-stone-200 border border-white/10 flex items-center gap-1 shadow-md">
                    <Clock className="w-3 h-3 text-gold-400" />
                    {vid.duration}
                  </span>
                </div>

                {/* Play Button Trigger */}
                <button
                  onClick={() => setSelectedVideo(vid)}
                  className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-gold-400/90 text-ink-950 flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-2xl group-hover:bg-gold-400 shadow-gold-400/30 cursor-pointer"
                  aria-label="Play Film"
                >
                  <Play className="w-6 h-6 fill-current ml-0.5" />
                </button>
              </div>

              <div className="px-5 py-3">
                <h3 className="font-serif text-xl sm:text-2xl text-ink-50 font-normal group-hover:text-gold-700 dark:group-hover:text-gold-300 transition-colors">
                  {vid.title}
                </h3>
                <p className="text-xs text-ink-500 dark:text-ink-400 mt-1 font-medium">{vid.caption}</p>
              </div>
            </div>

            <div className="px-5 py-4 border-t border-black/5 dark:border-white/5 flex items-center justify-between gap-2 text-xs">
              <button
                onClick={() => handleTogglePublish(vid.id)}
                className={`rounded-full px-3.5 py-1 text-[10px] font-mono uppercase tracking-wider font-bold transition-colors cursor-pointer border ${
                  vid.isPublished
                    ? 'border-black/10 dark:border-white/10 bg-black/[0.03] dark:bg-white/5 text-ink-600 dark:text-ink-400 hover:text-amber-700 dark:hover:text-amber-300'
                    : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
                }`}
              >
                {vid.isPublished ? 'Unpublish' : 'Publish Live'}
              </button>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleOpenEditModal(vid)}
                  className="p-2 rounded-full border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/5 text-ink-600 dark:text-ink-400 hover:text-gold-700 dark:hover:text-gold-300 hover:border-gold-500/30 transition-all cursor-pointer"
                  title="Edit Film"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(vid.id)}
                  className="p-2 rounded-full border border-red-500/20 bg-red-500/5 text-red-600 dark:text-red-400 hover:bg-red-500/15 transition-all cursor-pointer"
                  title="Delete Film"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Video Player Glassy Theater Modal */}
      {selectedVideo && (
        <div
          className="fixed inset-0 z-50 bg-ink-950/95 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-8 animate-fade-in"
          onClick={() => setSelectedVideo(null)}
        >
          <div
            className="relative max-w-4xl w-full rounded-[28px] border border-black/15 dark:border-white/20 bg-white/95 dark:bg-zinc-950/90 backdrop-blur-2xl overflow-hidden flex flex-col shadow-2xl animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-black/10 dark:border-white/10 flex items-center justify-between">
              <div>
                <h3 className="font-serif text-2xl text-ink-50">{selectedVideo.title}</h3>
                <p className="text-xs text-gold-700 dark:text-gold-300 font-medium">{selectedVideo.caption} · {selectedVideo.duration}</p>
              </div>
              <button
                onClick={() => setSelectedVideo(null)}
                className="w-8 h-8 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center text-ink-500 hover:text-ink-950 dark:hover:text-white cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="aspect-video bg-black flex items-center justify-center">
              <video
                src={selectedVideo.videoUrl}
                poster={selectedVideo.poster}
                controls
                autoPlay
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Glassy Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-ink-950/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg rounded-[28px] border border-black/15 dark:border-white/20 bg-white/95 dark:bg-zinc-950/90 backdrop-blur-2xl p-6 sm:p-8 shadow-2xl animate-scale-in">
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-black/10 dark:border-white/10">
              <h3 className="font-serif text-2xl text-ink-50 font-normal">
                {editingVideo ? 'Edit Wedding Film' : 'Add New Wedding Film'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center text-ink-500 hover:text-ink-950 dark:hover:text-white cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase font-mono font-bold tracking-widest text-ink-500 mb-1.5">Film Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Royal Udaipur Wedding Teaser"
                  className="w-full rounded-full border border-black/15 dark:border-white/15 bg-white dark:bg-black/50 px-4 py-2.5 text-xs text-ink-50 focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-mono font-bold tracking-widest text-ink-500 mb-1.5">Couple / Location</label>
                <input
                  type="text"
                  value={formData.caption}
                  onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                  placeholder="e.g. Yash & Megha | City Palace"
                  className="w-full rounded-full border border-black/15 dark:border-white/15 bg-white dark:bg-black/50 px-4 py-2.5 text-xs text-ink-50 focus:outline-none focus:border-gold-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-mono font-bold tracking-widest text-ink-500 mb-1.5">Duration</label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="e.g. 04:30"
                    className="w-full rounded-full border border-black/15 dark:border-white/15 bg-white dark:bg-black/50 px-4 py-2.5 text-xs text-ink-50 focus:outline-none focus:border-gold-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-mono font-bold tracking-widest text-ink-500 mb-1.5">Resolution</label>
                  <input
                    type="text"
                    value={formData.quality}
                    onChange={(e) => setFormData({ ...formData, quality: e.target.value })}
                    className="w-full rounded-full border border-black/15 dark:border-white/15 bg-white dark:bg-black/50 px-4 py-2.5 text-xs text-ink-50 focus:outline-none focus:border-gold-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-mono font-bold tracking-widest text-ink-500 mb-1.5">Poster Image URL *</label>
                <input
                  type="url"
                  required
                  value={formData.poster}
                  onChange={(e) => setFormData({ ...formData, poster: e.target.value })}
                  placeholder="https://images.pexels.com/..."
                  className="w-full rounded-full border border-black/15 dark:border-white/15 bg-white dark:bg-black/50 px-4 py-2.5 text-xs text-ink-50 focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-mono font-bold tracking-widest text-ink-500 mb-1.5">Video File / Stream URL</label>
                <input
                  type="url"
                  value={formData.videoUrl}
                  onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                  placeholder="https://assets.mixkit.co/..."
                  className="w-full rounded-full border border-black/15 dark:border-white/15 bg-white dark:bg-black/50 px-4 py-2.5 text-xs text-ink-50 focus:outline-none focus:border-gold-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-black/10 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-full px-5 py-2 text-xs font-semibold text-ink-500 hover:text-ink-950 dark:hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-gradient-to-r from-gold-500 to-gold-400 text-ink-950 px-6 py-2.5 text-xs font-bold uppercase tracking-wider hover:brightness-110 shadow-lg shadow-gold-500/25 transition-all cursor-pointer"
                >
                  {editingVideo ? 'Update Film' : 'Save Film'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

export default AdminVideos;
