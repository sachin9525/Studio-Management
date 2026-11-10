import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  Eye,
  FolderHeart,
  MapPin,
  Pencil,
  Plus,
  RefreshCw,
  Save,
  Search,
  Sparkles,
  Tag,
  Trash2,
  UploadCloud,
  X,
} from 'lucide-react';
import { VendorLayout, SelectedMediaPreviews } from '@/vendor/components';
import { useAuth } from '@/context/AuthContext';
import { apiRequest } from '@/utils/api';

const blankProject = {
  title: '',
  eventType: 'Weddings',
  eventDate: '',
  location: '',
  description: '',
  isPublished: true,
};

const inputClass = 'w-full rounded-full border border-black/15 dark:border-white/15 bg-white dark:bg-black/50 px-4 py-2.5 text-xs text-ink-50 placeholder:text-ink-400 focus:border-gold-500 focus:outline-none transition-colors shadow-inner';

const formatDate = (date) =>
  date
    ? new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : 'Date not set';

const DEFAULT_PROJECT_COVERS = [
  'https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?auto=compress&cs=tinysrgb&w=900',
  'https://images.pexels.com/photos/32327730/pexels-photo-32327730.jpeg?auto=compress&cs=tinysrgb&w=900',
  'https://images.pexels.com/photos/32327732/pexels-photo-32327732.jpeg?auto=compress&cs=tinysrgb&w=900',
  'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=900',
];

const CATEGORIES = ['All', 'Weddings', 'Pre-Wedding', 'Celebrations', 'Destination'];

function VendorProjects() {
  const { session } = useAuth();
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState(blankProject);
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);
  const [editingId, setEditingId] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [updatingId, setUpdatingId] = useState('');
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [previewProject, setPreviewProject] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const loadProjects = useCallback(async () => {
    if (!session?.token) return;
    setLoading(true);
    setError('');
    try {
      const data = await apiRequest('/vendor/projects', { token: session.token });
      setProjects(data.projects || []);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to load projects.');
    } finally {
      setLoading(false);
    }
  }, [session?.token]);

  useEffect(() => { loadProjects(); }, [loadProjects]);

  const resetForm = () => {
    setForm(blankProject);
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
      if (editingId) {
        const data = await apiRequest(`/vendor/projects/${editingId}`, {
          method: 'PATCH',
          token: session.token,
          body: payload,
        });
        setProjects((current) => current.map((item) => item._id === editingId ? data.project : item));
      } else {
        const data = await apiRequest('/vendor/projects', {
          method: 'POST',
          token: session.token,
          body: payload,
        });
        setProjects((current) => [data.project, ...current]);
      }
      setSaved(true);
      resetForm();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to save project.');
    } finally {
      setSaving(false);
    }
  };

  const editProject = (project) => {
    setForm({
      title: project.title,
      eventType: project.eventType || 'Weddings',
      eventDate: project.eventDate ? new Date(project.eventDate).toISOString().split('T')[0] : '',
      location: project.location || '',
      description: project.description || '',
      isPublished: Boolean(project.isPublished),
    });
    setEditingId(project._id);
    setShowAddForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const togglePublished = async (project) => {
    setUpdatingId(project._id);
    setError('');
    try {
      const data = await apiRequest(`/vendor/projects/${project._id}/publish`, {
        method: 'PATCH',
        token: session.token,
        body: JSON.stringify({ isPublished: !project.isPublished }),
      });
      setProjects((current) => current.map((item) => item._id === project._id ? data.project : item));
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to update status.');
    } finally {
      setUpdatingId('');
    }
  };

  const deleteProject = async (project) => {
    if (!window.confirm(`Delete "${project.title}"? This cannot be undone.`)) return;
    setUpdatingId(project._id);
    setError('');
    try {
      await apiRequest(`/vendor/projects/${project._id}`, { method: 'DELETE', token: session.token });
      setProjects((current) => current.filter((item) => item._id !== project._id));
      if (editingId === project._id) resetForm();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to delete project.');
    } finally {
      setUpdatingId('');
    }
  };

  const filteredProjects = useMemo(() => {
    return projects.filter((prj) => {
      const matchCategory = activeCategory === 'All' || prj.eventType === activeCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        prj.title.toLowerCase().includes(q) ||
        (prj.location && prj.location.toLowerCase().includes(q)) ||
        (prj.description && prj.description.toLowerCase().includes(q));
      return matchCategory && matchSearch;
    });
  }, [projects, activeCategory, searchQuery]);

  const publishedCount = projects.filter((p) => p.isPublished).length;
  const uniqueLocations = new Set(projects.map((p) => p.location).filter(Boolean)).size;

  return (
    <VendorLayout title="Wedding Projects">
      {/* Top Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-3 py-1 rounded-full bg-gold-400/10 border border-gold-400/25 text-gold-700 dark:text-gold-300 text-[10px] uppercase font-mono tracking-widest font-bold flex items-center gap-1.5 shadow-2xs">
              <Sparkles className="w-3 h-3 text-gold-600 dark:text-gold-400" />
              Studio Showcase Manager
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-ink-50 font-normal tracking-tight">Wedding Projects</h2>
          <p className="text-xs sm:text-sm text-ink-500 dark:text-ink-400 mt-1 max-w-2xl font-medium">
            Showcase completed real weddings, royal celebrations, and destination shoots on your studio profile.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            type="button"
            onClick={loadProjects}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-full border border-black/15 dark:border-white/15 px-4 py-2 text-xs font-semibold bg-white/80 dark:bg-black/30 text-ink-700 dark:text-ink-300 hover:border-gold-500/40 hover:text-gold-700 dark:hover:text-gold-300 transition-all shadow-xs disabled:opacity-50 cursor-pointer"
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
            <span>{showAddForm ? 'Close Form' : 'New Project'}</span>
          </button>
        </div>
      </div>

      {error && (
        <div role="alert" className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-red-500/20 bg-red-500/5 p-4 text-xs font-semibold text-red-600 dark:text-red-300 shadow-xs">
          <span>{error}</span>
          <button type="button" onClick={loadProjects} className="underline underline-offset-4 cursor-pointer">Try again</button>
        </div>
      )}

      {saved && (
        <div role="status" className="mb-6 rounded-2xl border border-emerald-500/25 bg-emerald-500/10 p-4 text-xs text-emerald-700 dark:text-emerald-300 font-bold flex items-center gap-2 shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Project saved and published on your portfolio showcase.</span>
        </div>
      )}

      {/* 4 Glassy Stat Cards */}
      <div className="mb-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {[
          ['Total Shoots', projects.length, `${publishedCount} published live`],
          ['Live In Showcase', publishedCount, 'Publicly visible'],
          ['Destinations', uniqueLocations || 1, 'Cities & venues'],
          ['Latest Story', projects[0]?.title || 'No shoots yet', projects[0]?.location || 'India'],
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
              <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-black/[0.04] dark:bg-white/10 border border-black/10 dark:border-white/15 text-ink-600 dark:text-ink-300 truncate max-w-[120px]">
                {subtext}
              </span>
            </div>
            <div className="relative z-10">
              <p className="font-serif text-3xl sm:text-4xl text-ink-50 font-normal tracking-tight group-hover:text-gold-700 dark:group-hover:text-gold-300 transition-colors tabular-nums truncate">
                {value}
              </p>
              <p className="mt-1 text-[10px] uppercase font-mono font-bold tracking-widest text-ink-500 dark:text-ink-400">
                {label}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Project Glassy Form */}
      {showAddForm && (
        <form onSubmit={handleSubmit} className="mb-8 rounded-[28px] border border-black/15 dark:border-white/20 bg-white/95 dark:bg-zinc-950/90 backdrop-blur-2xl p-6 sm:p-8 shadow-2xl animate-scale-in relative overflow-hidden">
          <div className="absolute -top-16 -right-16 w-40 h-40 bg-amber-500/10 dark:bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

          <div className="mb-6 flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-4 relative z-10">
            <div className="flex items-center gap-2.5">
              <FolderHeart className="w-5 h-5 text-gold-600 dark:text-gold-400" />
              <h3 className="font-serif text-2xl text-ink-50 font-normal">{editingId ? 'Edit Shoot Project' : 'Create New Wedding Project'}</h3>
            </div>
            <button type="button" onClick={resetForm} className="w-8 h-8 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center text-ink-500 hover:text-ink-950 dark:hover:text-white cursor-pointer transition-colors">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 relative z-10">
            <label className="block sm:col-span-2">
              <span className="mb-1.5 block text-[10px] uppercase font-mono font-bold tracking-widest text-ink-500">Project / Couple Title *</span>
              <input required maxLength={120} value={form.title} onChange={(e) => setForm((curr) => ({ ...curr, title: e.target.value }))} className={inputClass} placeholder="e.g. Ananya & Kabir · Royal Udaipur Palace Wedding" />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-[10px] uppercase font-mono font-bold tracking-widest text-ink-500">Event Type</span>
              <select value={form.eventType} onChange={(e) => setForm((curr) => ({ ...curr, eventType: e.target.value }))} className={inputClass}>
                <option value="Weddings">Weddings</option>
                <option value="Pre-Wedding">Pre-Wedding</option>
                <option value="Celebrations">Celebrations</option>
                <option value="Destination">Destination</option>
              </select>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-[10px] uppercase font-mono font-bold tracking-widest text-ink-500">Event Date</span>
              <input type="date" value={form.eventDate} onChange={(e) => setForm((curr) => ({ ...curr, eventDate: e.target.value }))} className={inputClass} />
            </label>
            <label className="block sm:col-span-2">
              <span className="mb-1.5 block text-[10px] uppercase font-mono font-bold tracking-widest text-ink-500">Location / Venue</span>
              <input maxLength={120} value={form.location} onChange={(e) => setForm((curr) => ({ ...curr, location: e.target.value }))} className={inputClass} placeholder="e.g. The Oberoi Udaivilas, Udaipur, Rajasthan" />
            </label>
            <label className="block sm:col-span-2">
              <span className="mb-1.5 block text-[10px] uppercase font-mono font-bold tracking-widest text-ink-500">Story & Highlights</span>
              <textarea rows={3} maxLength={2000} value={form.description} onChange={(e) => setForm((curr) => ({ ...curr, description: e.target.value }))} className="w-full rounded-2xl border border-black/15 dark:border-white/15 bg-white dark:bg-black/50 p-4 text-xs text-ink-50 placeholder:text-ink-400 focus:border-gold-500 focus:outline-none shadow-inner" placeholder="Describe the shoot vibe, decor aesthetics, and memorable moments." />
            </label>

            <div className="sm:col-span-2 border-2 border-dashed border-black/15 dark:border-white/15 hover:border-gold-500/50 rounded-2xl p-6 text-center transition-colors bg-black/[0.01] dark:bg-white/[0.01]">
              <UploadCloud className="w-8 h-8 text-gold-600 dark:text-gold-400 mx-auto mb-2" />
              <p className="text-xs text-ink-50 font-semibold mb-1">Upload Project Showcase Photos</p>
              <p className="text-[11px] text-ink-500 mb-3">High-resolution ceremony, portrait, and candid pictures</p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={(e) => setFiles(Array.from(e.target.files || []))}
                className="hidden"
                id="vendor-project-file-input"
              />
              <label
                htmlFor="vendor-project-file-input"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-black/5 dark:bg-white/10 hover:bg-gold-500/10 border border-black/10 dark:border-white/10 hover:border-gold-500/30 text-xs text-gold-700 dark:text-gold-300 font-bold cursor-pointer transition-colors shadow-2xs"
              >
                Choose Photos
              </label>
              {files.length > 0 && (
                <p className="mt-2 text-xs text-emerald-600 dark:text-emerald-400 font-bold">✓ {files.length} photos ready for upload</p>
              )}
            </div>

            <SelectedMediaPreviews files={files} onRemove={(idx) => setFiles((curr) => curr.filter((_, i) => i !== idx))} />
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-black/10 dark:border-white/10 pt-4 relative z-10">
            <label className="flex cursor-pointer items-center gap-2.5 text-xs text-ink-100 font-medium">
              <input type="checkbox" checked={form.isPublished} onChange={(e) => setForm((curr) => ({ ...curr, isPublished: e.target.checked }))} className="h-4 w-4 rounded-sm border-black/20 dark:border-white/20 text-gold-500 focus:ring-gold-400" />
              <span>Publish Project in Studio Portfolio</span>
            </label>
            <div className="flex items-center gap-2">
              <button type="button" onClick={resetForm} className="rounded-full px-4 py-2 text-xs font-semibold text-ink-500 hover:text-ink-950 dark:hover:text-white cursor-pointer">
                Cancel
              </button>
              <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-gold-500 to-gold-400 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-ink-950 hover:brightness-110 shadow-lg shadow-gold-500/25 disabled:opacity-50 cursor-pointer">
                {editingId ? <Save className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                <span>{saving ? 'Saving…' : editingId ? 'Update Project' : 'Create Project'}</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Filter and Search Bar */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-full px-5 py-2 text-xs font-mono uppercase tracking-widest font-bold transition-all cursor-pointer shadow-2xs ${
                activeCategory === cat
                  ? 'bg-gold-500/15 dark:bg-white/15 border border-gold-500/35 dark:border-white/20 text-gold-900 dark:text-gold-300 shadow-xs'
                  : 'bg-black/[0.03] dark:bg-white/5 border border-black/10 dark:border-white/10 text-ink-700 dark:text-ink-300 hover:text-ink-950 dark:hover:text-white hover:bg-black/[0.06] dark:hover:bg-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="relative min-w-[280px]">
          <Search className="w-4 h-4 text-ink-500 dark:text-ink-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search shoots, couples, venues…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-full border border-black/15 dark:border-white/15 bg-white/90 dark:bg-black/40 pl-10 pr-4 py-2 text-xs text-ink-50 placeholder:text-ink-400 focus:outline-none focus:border-gold-500/60 shadow-inner"
          />
        </div>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="py-20 text-center text-xs font-mono font-semibold text-ink-500 animate-pulse">Loading portfolio projects…</div>
      ) : filteredProjects.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProjects.map((project, idx) => {
            const coverImage = project.media?.[0]?.url || DEFAULT_PROJECT_COVERS[idx % DEFAULT_PROJECT_COVERS.length];

            return (
              <article
                key={project._id}
                className="group relative rounded-[28px] overflow-hidden border border-black/10 dark:border-white/15 bg-white/90 dark:bg-black/45 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.06)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-amber-500/10 dark:bg-amber-400/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-all pointer-events-none" />

                <div>
                  <div className="relative aspect-[16/10] overflow-hidden bg-ink-950 m-2.5 rounded-[22px]">
                    <img
                      src={coverImage}
                      alt={project.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.src = DEFAULT_PROJECT_COVERS[0];
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-[10px] uppercase font-mono tracking-wider text-gold-300 font-bold shadow-md">
                        <Tag className="w-2.5 h-2.5" />
                        {project.eventType || 'Weddings'}
                      </span>
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-[9px] uppercase font-mono tracking-widest font-bold backdrop-blur-md border shadow-md ${
                          project.isPublished
                            ? 'bg-emerald-950/80 border-emerald-500/30 text-emerald-300'
                            : 'bg-black/70 border-white/10 text-stone-300'
                        }`}
                      >
                        {project.isPublished ? 'Live' : 'Draft'}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setPreviewProject(project)}
                      className="absolute bottom-3 right-3 p-2 rounded-full bg-black/70 border border-gold-400/40 text-gold-300 hover:scale-110 transition-all shadow-xl opacity-0 group-hover:opacity-100 cursor-pointer backdrop-blur-md"
                      title="View Project Lightbox"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="px-5 py-3">
                    <div className="flex items-center gap-3 text-xs text-ink-500 mb-2">
                      {project.location && (
                        <span className="flex items-center gap-1.5 truncate text-ink-600 dark:text-ink-400 font-medium">
                          <MapPin className="w-3.5 h-3.5 text-gold-600 dark:text-gold-400 shrink-0" />
                          <span className="truncate">{project.location}</span>
                        </span>
                      )}
                      <span>·</span>
                      <span className="flex items-center gap-1.5 shrink-0 text-ink-500 font-mono">
                        <Calendar className="w-3.5 h-3.5 text-ink-500 shrink-0" />
                        <span>{formatDate(project.eventDate)}</span>
                      </span>
                    </div>

                    <h4 className="font-serif text-xl sm:text-2xl text-ink-50 font-normal group-hover:text-gold-700 dark:group-hover:text-gold-300 transition-colors line-clamp-1">
                      {project.title}
                    </h4>

                    <p className="text-xs text-ink-500 dark:text-ink-400 mt-1 line-clamp-2 min-h-[32px] font-medium leading-relaxed">
                      {project.description || 'Exclusive wedding storytelling and celebration gallery.'}
                    </p>
                  </div>
                </div>

                <div className="px-5 py-4 border-t border-black/5 dark:border-white/5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => editProject(project)}
                      className="p-2 rounded-full border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/5 text-ink-600 dark:text-ink-400 hover:text-gold-700 dark:hover:text-gold-300 hover:border-gold-500/30 transition-all cursor-pointer"
                      title="Edit Shoot"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={updatingId === project._id}
                      onClick={() => togglePublished(project)}
                      className={`rounded-full px-3.5 py-1 text-[10px] font-mono uppercase tracking-wider font-bold transition-colors cursor-pointer border ${
                        project.isPublished
                          ? 'border-black/10 dark:border-white/10 bg-black/[0.03] dark:bg-white/5 text-ink-600 dark:text-ink-400 hover:text-amber-700 dark:hover:text-amber-300'
                          : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
                      }`}
                    >
                      <span>{project.isPublished ? 'Unpublish' : 'Publish'}</span>
                    </button>
                  </div>
                  <button
                    type="button"
                    disabled={updatingId === project._id}
                    onClick={() => deleteProject(project)}
                    className="p-2 rounded-full border border-red-500/20 bg-red-500/5 text-red-600 dark:text-red-400 hover:bg-red-500/15 transition-all cursor-pointer disabled:opacity-50"
                    title="Delete Project"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="rounded-[28px] border border-dashed border-black/15 dark:border-white/15 bg-white/70 dark:bg-black/30 px-6 py-20 text-center backdrop-blur-xl">
          <FolderHeart className="mx-auto mb-3 h-10 w-10 text-ink-400 opacity-60" />
          <h4 className="font-serif text-xl text-ink-50">No Projects Found</h4>
          <p className="mt-1 text-xs text-ink-500 max-w-sm mx-auto font-medium">
            {searchQuery || activeCategory !== 'All'
              ? 'No shoots match your filter.'
              : 'Add your first wedding shoot or project by clicking "New Project" above.'}
          </p>
        </div>
      )}

      {/* Project Preview Lightbox Modal */}
      {previewProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-950/80 backdrop-blur-xl animate-fade-in">
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[28px] border border-black/15 dark:border-white/20 bg-white/95 dark:bg-zinc-950/90 backdrop-blur-2xl p-6 sm:p-8 shadow-2xl">
            <div className="flex items-start justify-between border-b border-black/10 dark:border-white/10 pb-4 mb-5">
              <div>
                <h3 className="font-serif text-2xl text-ink-50 font-normal">{previewProject.title}</h3>
                <p className="text-xs text-gold-700 dark:text-gold-300 font-medium mt-0.5">
                  {previewProject.location || 'Location Not Specified'} · {formatDate(previewProject.eventDate)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPreviewProject(null)}
                className="w-8 h-8 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center text-ink-500 hover:text-ink-950 dark:hover:text-white cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {previewProject.media?.length ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {previewProject.media.map((img, i) => (
                  <div key={img._id || i} className="relative h-44 rounded-2xl overflow-hidden bg-black/40 border border-black/10 dark:border-white/10 group">
                    <img src={img.url} alt="" className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-xs text-ink-500 font-medium">
                <p>No extra photos uploaded for this project yet. Click &ldquo;Edit&rdquo; to add photos.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </VendorLayout>
  );
}

export default VendorProjects;
