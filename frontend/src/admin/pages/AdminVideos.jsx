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
    <AdminLayout title="Films & Cinematography">
      {/* Top Banner */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-1 rounded-full bg-gold-400/10 border border-gold-400/20 text-gold-300 text-[10px] uppercase tracking-widest font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-gold-400" />
              Cinematic Films Showcase
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-ink-50 font-normal">Wedding Films & Teasers</h2>
          <p className="text-sm text-ink-400 mt-1 max-w-2xl">
            Manage the cinematic wedding trailers and teasers shown in the public video theatre section.
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-sm bg-gradient-to-r from-gold-500 to-gold-400 text-ink-950 font-medium text-xs uppercase tracking-widest hover:brightness-110 transition-all shadow-lg shadow-gold-500/20 hover:scale-[1.02]"
        >
          <Plus className="w-4 h-4" />
          <span>Add Wedding Film</span>
        </button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="p-5 rounded-sm bg-ink-900/70 border border-white/5 backdrop-blur-md">
          <span className="text-[10px] uppercase tracking-widest text-ink-500 block mb-1">Total Films</span>
          <p className="font-sans font-bold text-3xl text-ink-50 tabular-nums">{videos.length}</p>
          <p className="text-[10px] text-emerald-400 mt-1">{videos.filter((v) => v.isPublished).length} Published Live</p>
        </div>
        <div className="p-5 rounded-sm bg-ink-900/70 border border-white/5 backdrop-blur-md">
          <span className="text-[10px] uppercase tracking-widest text-ink-500 block mb-1">Resolution</span>
          <p className="font-serif text-3xl text-gold-400">4K DCI</p>
          <p className="text-[10px] text-ink-500 mt-1">Cinematic Standard</p>
        </div>
        <div className="p-5 rounded-sm bg-ink-900/70 border border-white/5 backdrop-blur-md">
          <span className="text-[10px] uppercase tracking-widest text-ink-500 block mb-1">Total Views</span>
          <p className="font-sans font-bold text-3xl text-ink-50 tabular-nums">
            {videos.reduce((a, b) => a + (b.views || 0), 0).toLocaleString('en-IN')}
          </p>
          <p className="text-[10px] text-ink-500 mt-1">Trailer plays</p>
        </div>
        <div className="p-5 rounded-sm bg-gradient-to-br from-gold-400/10 via-ink-900/80 to-ink-900 border border-gold-400/20 backdrop-blur-md">
          <span className="text-[10px] uppercase tracking-widest text-gold-400 block mb-1 font-semibold">Audio Master</span>
          <p className="font-serif text-3xl text-gold-300">Dolby 5.1</p>
          <p className="text-[10px] text-gold-400/80 mt-1">Cinema Sound Mix</p>
        </div>
      </div>

      {/* Search */}
      <div className="p-4 rounded-sm bg-ink-900/90 border border-white/5 mb-6 flex items-center justify-between gap-4 backdrop-blur-lg">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-500" />
          <input
            type="text"
            placeholder="Search films by title or couple…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-ink-950/80 border border-white/10 rounded-sm pl-9 pr-8 py-2 text-xs text-ink-100 placeholder:text-ink-500 focus:outline-none focus:border-gold-400"
          />
        </div>
      </div>

      {/* Video Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVideos.map((vid) => (
          <div
            key={vid.id}
            className="group bg-ink-900/80 border border-white/5 rounded-sm overflow-hidden hover:border-gold-400/30 transition-all duration-300 flex flex-col hover:shadow-2xl"
          >
            <div className="relative aspect-[16/9] overflow-hidden bg-ink-950">
              <img
                src={vid.poster}
                alt={vid.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/40" />

              <div className="absolute top-3 left-3 flex items-center gap-1.5">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-semibold bg-black/70 backdrop-blur-md border border-white/20 text-gold-300">
                  {vid.quality}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-black/70 text-stone-200 border border-white/10 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-gold-400" />
                  {vid.duration}
                </span>
              </div>

              {/* Play Button Trigger */}
              <button
                onClick={() => setSelectedVideo(vid)}
                className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-gold-400/90 text-ink-950 flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-2xl group-hover:bg-gold-400 shadow-gold-400/20"
                aria-label="Play Film"
              >
                <Play className="w-6 h-6 fill-current ml-0.5" />
              </button>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-serif text-xl text-ink-50 font-medium group-hover:text-gold-300 transition-colors">
                  {vid.title}
                </h3>
                <p className="text-xs text-ink-400 mt-1">{vid.caption}</p>
              </div>

              <div className="flex items-center justify-between gap-2 mt-5 pt-3 border-t border-white/5 text-xs">
                <button
                  onClick={() => handleTogglePublish(vid.id)}
                  className={`px-3 py-1 rounded-sm text-[10px] uppercase tracking-wider font-semibold transition-colors ${
                    vid.isPublished
                      ? 'text-ink-400 hover:text-amber-400'
                      : 'bg-emerald-400/10 text-emerald-300 border border-emerald-400/20'
                  }`}
                >
                  {vid.isPublished ? 'Unpublish' : 'Publish Live'}
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEditModal(vid)}
                    className="p-1.5 rounded-sm text-ink-400 hover:text-gold-300 hover:bg-white/5 transition-colors"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(vid.id)}
                    className="p-1.5 rounded-sm text-ink-400 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Video Player Modal */}
      {selectedVideo && (
        <div
          className="fixed inset-0 z-50 bg-ink-950/95 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-8 animate-fade-in"
          onClick={() => setSelectedVideo(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-ink-900 border border-gold-400/40 rounded-sm overflow-hidden flex flex-col shadow-2xl animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-white/5 flex items-center justify-between bg-ink-950">
              <div>
                <h3 className="font-serif text-xl text-ink-50">{selectedVideo.title}</h3>
                <p className="text-xs text-gold-400">{selectedVideo.caption} · {selectedVideo.duration}</p>
              </div>
              <button onClick={() => setSelectedVideo(null)} className="p-2 text-ink-400 hover:text-ink-50">
                <X className="w-5 h-5" />
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

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-ink-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-ink-900 border border-gold-400/30 rounded-sm p-6 shadow-2xl animate-scale-in">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/5">
              <h3 className="font-serif text-2xl text-ink-50">
                {editingVideo ? 'Edit Wedding Film' : 'Add New Wedding Film'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-ink-400 hover:text-ink-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-ink-400 mb-1.5">Film Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Royal Udaipur Wedding Teaser"
                  className="w-full bg-ink-950 border border-white/10 rounded-sm px-3.5 py-2.5 text-xs text-ink-100 focus:outline-none focus:border-gold-400"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest text-ink-400 mb-1.5">Couple / Location</label>
                <input
                  type="text"
                  value={formData.caption}
                  onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                  placeholder="e.g. Yash & Megha | City Palace"
                  className="w-full bg-ink-950 border border-white/10 rounded-sm px-3.5 py-2.5 text-xs text-ink-100 focus:outline-none focus:border-gold-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-ink-400 mb-1.5">Duration</label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="e.g. 04:30"
                    className="w-full bg-ink-950 border border-white/10 rounded-sm px-3.5 py-2.5 text-xs text-ink-100 focus:outline-none focus:border-gold-400"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-ink-400 mb-1.5">Resolution</label>
                  <input
                    type="text"
                    value={formData.quality}
                    onChange={(e) => setFormData({ ...formData, quality: e.target.value })}
                    className="w-full bg-ink-950 border border-white/10 rounded-sm px-3.5 py-2.5 text-xs text-ink-100 focus:outline-none focus:border-gold-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest text-ink-400 mb-1.5">Poster Image URL *</label>
                <input
                  type="url"
                  required
                  value={formData.poster}
                  onChange={(e) => setFormData({ ...formData, poster: e.target.value })}
                  placeholder="https://images.pexels.com/..."
                  className="w-full bg-ink-950 border border-white/10 rounded-sm px-3.5 py-2.5 text-xs text-ink-100 focus:outline-none focus:border-gold-400"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest text-ink-400 mb-1.5">Video File / Stream URL</label>
                <input
                  type="url"
                  value={formData.videoUrl}
                  onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                  placeholder="https://assets.mixkit.co/..."
                  className="w-full bg-ink-950 border border-white/10 rounded-sm px-3.5 py-2.5 text-xs text-ink-100 focus:outline-none focus:border-gold-400"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-sm text-xs text-ink-400 hover:text-ink-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-sm bg-gold-400 text-ink-950 text-xs font-semibold uppercase tracking-wider hover:bg-gold-300 transition-colors shadow-lg"
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

