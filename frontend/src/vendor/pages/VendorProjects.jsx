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

const inputClass = 'w-full rounded-sm border border-white/10 bg-ink-900 px-3 py-2.5 text-sm text-ink-100 focus:border-gold-400 focus:outline-none transition-colors';

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
      const data = await apiRequest(editingId ? `/vendor/projects/${editingId}` : '/vendor/projects', {
        method: editingId ? 'PATCH' : 'POST',
        token: session.token,
        body: payload,
      });
      if (editingId) {
        setProjects((current) => current.map((p) => (p._id === editingId ? data.project : p)));
      } else {
        setProjects((current) => [data.project, ...current]);
      }
      resetForm();
      setSaved(true);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to save project.');
    } finally {
      setSaving(false);
    }
  };

  const editProject = (project) => {
    setEditingId(project._id);
    setForm({
      title: project.title,
      eventType: project.eventType || 'Weddings',
      eventDate: project.eventDate ? new Date(project.eventDate).toISOString().slice(0, 10) : '',
      location: project.location || '',
      description: project.description || '',
      isPublished: project.isPublished !== false,
    });
    setShowAddForm(true);
    setSaved(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const togglePublished = async (project) => {
    setUpdatingId(project._id);
    setError('');
    try {
      const data = await apiRequest(`/vendor/projects/${project._id}`, {
        method: 'PATCH',
        token: session.token,
        body: JSON.stringify({ isPublished: !project.isPublished }),
      });
      setProjects((current) => current.map((item) => (item._id === project._id ? data.project : item)));
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to update project.');
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
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded-full bg-gold-400/10 border border-gold-400/20 text-gold-300 text-[10px] uppercase tracking-widest font-semibold flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5 text-gold-400" />
              Portfolio Showcase
            </span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl text-ink-50 mb-1">Wedding Projects</h2>
          <p className="text-xs sm:text-sm text-ink-400">
            Showcase completed real weddings, royal celebrations, and destination shoots.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={loadProjects}
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
            <span>{showAddForm ? 'Close Form' : 'New Project'}</span>
          </button>
        </div>
      </div>

      {error && (
        <div role="alert" className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-sm border border-red-400/20 bg-red-400/5 p-4 text-sm text-red-300">
          <span>{error}</span>
          <button type="button" onClick={loadProjects} className="underline underline-offset-4">Try again</button>
        </div>
      )}

      {saved && (
        <div role="status" className="mb-6 rounded-sm border border-emerald-400/20 bg-emerald-400/10 p-3 text-xs text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Project saved and published on your portfolio showcase.</span>
        </div>
      )}

      {/* Symmetrical Metric Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-3.5 mb-8">
        <div className="p-3.5 sm:p-4 rounded-sm bg-ink-900/80 border border-white/5 backdrop-blur-md">
          <span className="text-[10px] uppercase tracking-wider text-ink-500 block mb-1 font-medium">Total Shoots</span>
          <p className="font-serif text-2xl sm:text-3xl text-ink-50 leading-none">{projects.length}</p>
          <p className="text-[10px] text-emerald-400 mt-1 font-medium">{publishedCount} published live</p>
        </div>
        <div className="p-3.5 sm:p-4 rounded-sm bg-ink-900/80 border border-white/5 backdrop-blur-md">
          <span className="text-[10px] uppercase tracking-wider text-ink-500 block mb-1 font-medium">Published</span>
          <p className="font-serif text-2xl sm:text-3xl text-gold-400 leading-none">{publishedCount}</p>
          <p className="text-[10px] text-ink-500 mt-1">Live in showcase</p>
        </div>
        <div className="p-3.5 sm:p-4 rounded-sm bg-ink-900/80 border border-white/5 backdrop-blur-md">
          <span className="text-[10px] uppercase tracking-wider text-ink-500 block mb-1 font-medium">Destinations</span>
          <p className="font-serif text-2xl sm:text-3xl text-ink-50 leading-none">{uniqueLocations || 1}</p>
          <p className="text-[10px] text-ink-500 mt-1">Cities & venues covered</p>
        </div>
        <div className="p-3.5 sm:p-4 rounded-sm bg-gradient-to-br from-gold-400/15 via-ink-900/90 to-ink-900 border border-gold-400/30 backdrop-blur-md">
          <span className="text-[10px] uppercase tracking-wider text-gold-400 block mb-1 font-semibold">Latest Story</span>
          <p className="font-serif text-lg sm:text-xl text-gold-300 leading-none truncate">
            {projects[0]?.title || 'No shoots yet'}
          </p>
          <p className="text-[10px] text-gold-400/80 mt-1 font-medium">{projects[0]?.location || 'India'}</p>
        </div>
      </div>

      {/* Add / Edit Project Form */}
      {showAddForm && (
        <form onSubmit={handleSubmit} className="mb-8 rounded-sm border border-gold-400/30 bg-ink-900/95 backdrop-blur-xl p-5 sm:p-6 shadow-2xl animate-scale-in">
          <div className="mb-5 flex items-center justify-between border-b border-white/5 pb-3">
            <div className="flex items-center gap-2">
              <FolderHeart className="w-5 h-5 text-gold-400" />
              <h3 className="font-serif text-xl text-ink-50">{editingId ? 'Edit Shoot Project' : 'Create New Wedding Project'}</h3>
            </div>
            <button type="button" onClick={resetForm} className="inline-flex items-center gap-1 text-xs text-ink-400 hover:text-ink-100">
              <X className="h-4 w-4" /> Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="block sm:col-span-2">
              <span className="mb-1.5 block text-[10px] uppercase tracking-wider text-ink-400 font-medium">Project / Couple Title *</span>
              <input required maxLength={120} value={form.title} onChange={(e) => setForm((curr) => ({ ...curr, title: e.target.value }))} className={inputClass} placeholder="e.g. Ananya & Kabir · Royal Udaipur Palace Wedding" />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-[10px] uppercase tracking-wider text-ink-400 font-medium">Event Type</span>
              <select value={form.eventType} onChange={(e) => setForm((curr) => ({ ...curr, eventType: e.target.value }))} className={inputClass}>
                <option value="Weddings">Weddings</option>
                <option value="Pre-Wedding">Pre-Wedding</option>
                <option value="Celebrations">Celebrations</option>
                <option value="Destination">Destination</option>
              </select>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-[10px] uppercase tracking-wider text-ink-400 font-medium">Event Date</span>
              <input type="date" value={form.eventDate} onChange={(e) => setForm((curr) => ({ ...curr, eventDate: e.target.value }))} className={inputClass} />
            </label>
            <label className="block sm:col-span-2">
              <span className="mb-1.5 block text-[10px] uppercase tracking-wider text-ink-400 font-medium">Location / Venue</span>
              <input maxLength={120} value={form.location} onChange={(e) => setForm((curr) => ({ ...curr, location: e.target.value }))} className={inputClass} placeholder="e.g. The Oberoi Udaivilas, Udaipur, Rajasthan" />
            </label>
            <label className="block sm:col-span-2">
              <span className="mb-1.5 block text-[10px] uppercase tracking-wider text-ink-400 font-medium">Story & Highlights</span>
              <textarea rows={3} maxLength={2000} value={form.description} onChange={(e) => setForm((curr) => ({ ...curr, description: e.target.value }))} className={inputClass} placeholder="Describe the shoot vibe, decor aesthetics, and memorable moments." />
            </label>

            <div className="sm:col-span-2 border-2 border-dashed border-white/10 hover:border-gold-400/40 rounded-sm p-5 text-center transition-colors bg-ink-950/40">
              <UploadCloud className="w-8 h-8 text-gold-400 mx-auto mb-2" />
              <p className="text-xs text-ink-200 font-medium mb-1">Upload Project Showcase Photos</p>
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
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-white/5 hover:bg-gold-400/10 border border-white/10 hover:border-gold-400/30 text-xs text-gold-300 font-medium cursor-pointer transition-colors"
              >
                Choose Photos
              </label>
              {files.length > 0 && (
                <p className="mt-2 text-xs text-emerald-400 font-medium">✓ {files.length} photos ready for upload</p>
              )}
            </div>

            <SelectedMediaPreviews files={files} onRemove={(idx) => setFiles((curr) => curr.filter((_, i) => i !== idx))} />
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-white/5 pt-4">
            <label className="flex cursor-pointer items-center gap-2.5 text-xs text-ink-300">
              <input type="checkbox" checked={form.isPublished} onChange={(e) => setForm((curr) => ({ ...curr, isPublished: e.target.checked }))} className="h-4 w-4 rounded border-white/20 bg-ink-900 accent-yellow-500" />
              <span>Publish Project in Studio Portfolio</span>
            </label>
            <div className="flex items-center gap-2">
              <button type="button" onClick={resetForm} className="px-3.5 py-2 rounded-sm border border-white/10 text-xs text-ink-400 hover:text-ink-200">
                Cancel
              </button>
              <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-sm bg-gradient-to-r from-gold-500 to-gold-400 px-4 py-2 text-xs font-medium uppercase tracking-wider text-ink-950 hover:brightness-110 disabled:opacity-50 shadow-md shadow-gold-500/10">
                {editingId ? <Save className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                <span>{saving ? 'Saving…' : editingId ? 'Update Project' : 'Create Project'}</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Filter and Search Bar */}
      <div className="p-3 sm:p-4 rounded-sm bg-ink-900/80 border border-white/5 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-3 backdrop-blur-md">
        <div className="flex flex-wrap items-center gap-1.5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-sm text-xs uppercase tracking-wider font-medium transition-all ${
                activeCategory === cat
                  ? 'bg-gold-400 text-ink-950 shadow-md shadow-gold-400/20 font-semibold'
                  : 'text-ink-400 hover:text-ink-100 hover:bg-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-ink-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search shoots, couples, venues…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 rounded-sm bg-ink-950/70 border border-white/10 text-xs text-ink-100 focus:border-gold-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Projects Grid */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-serif text-xl text-ink-50">Portfolio Stories</h3>
        <span className="text-xs text-ink-500">{filteredProjects.length} shoots</span>
      </div>

      {loading ? (
        <div className="py-16 text-center text-sm text-ink-500">Loading portfolio projects…</div>
      ) : filteredProjects.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProjects.map((project, idx) => {
            const coverImage = project.media?.[0]?.url || DEFAULT_PROJECT_COVERS[idx % DEFAULT_PROJECT_COVERS.length];
            const photosCount = project.media?.length || 0;

            return (
              <article
                key={project._id}
                className="group relative flex flex-col rounded-sm border border-white/5 bg-ink-900/80 backdrop-blur-md overflow-hidden transition-all duration-300 hover:border-gold-400/30 hover:-translate-y-1"
              >
                <div className="relative h-56 w-full overflow-hidden bg-ink-950">
                  <img
                    src={coverImage}
                    alt={project.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.src = DEFAULT_PROJECT_COVERS[0];
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-transparent to-transparent opacity-85" />

                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-ink-950/80 backdrop-blur-md border border-white/10 text-[10px] uppercase tracking-wider text-gold-300 font-semibold">
                      <Tag className="w-2.5 h-2.5" />
                      {project.eventType || 'Weddings'}
                    </span>
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[9px] uppercase tracking-wider font-semibold backdrop-blur-md border ${
                        project.isPublished
                          ? 'bg-emerald-400/10 border-emerald-400/20 text-emerald-400'
                          : 'bg-ink-950/80 border-white/10 text-ink-400'
                      }`}
                    >
                      {project.isPublished ? 'Live' : 'Draft'}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setPreviewProject(project)}
                    className="absolute bottom-3 right-3 p-2 rounded-sm bg-ink-900/90 border border-white/10 text-gold-300 hover:bg-gold-400 hover:text-ink-950 transition-colors shadow-lg opacity-0 group-hover:opacity-100"
                    title="View Project Lightbox"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 text-xs text-ink-500 mb-2">
                      {project.location && (
                        <span className="flex items-center gap-1 truncate text-ink-300">
                          <MapPin className="w-3 h-3 text-gold-400 shrink-0" />
                          <span className="truncate">{project.location}</span>
                        </span>
                      )}
                      <span>·</span>
                      <span className="flex items-center gap-1 shrink-0">
                        <Calendar className="w-3 h-3 text-gold-400 shrink-0" />
                        <span>{formatDate(project.eventDate)}</span>
                      </span>
                    </div>

                    <h4 className="font-serif text-xl text-ink-50 font-normal group-hover:text-gold-200 transition-colors line-clamp-1">
                      {project.title}
                    </h4>

                    <p className="text-xs text-ink-400 mt-1 line-clamp-2 min-h-[32px]">
                      {project.description || 'Exclusive wedding storytelling and celebration gallery.'}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => editProject(project)}
                        className="inline-flex items-center gap-1 text-xs text-ink-300 hover:text-gold-300 transition-colors"
                      >
                        <Pencil className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                      <button
                        type="button"
                        disabled={updatingId === project._id}
                        onClick={() => togglePublished(project)}
                        className="inline-flex items-center gap-1 text-xs text-ink-300 hover:text-gold-300 transition-colors disabled:opacity-50"
                      >
                        <span>{project.isPublished ? 'Unpublish' : 'Publish'}</span>
                      </button>
                    </div>
                    <button
                      type="button"
                      disabled={updatingId === project._id}
                      onClick={() => deleteProject(project)}
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
          <FolderHeart className="mx-auto mb-3 h-10 w-10 text-gold-400/50" />
          <h4 className="font-serif text-lg text-ink-100">No Projects Found</h4>
          <p className="mt-1 text-xs text-ink-400 max-w-sm mx-auto">
            {searchQuery || activeCategory !== 'All'
              ? 'No shoots match your filter.'
              : 'Add your first wedding shoot or project by clicking "New Project" above.'}
          </p>
        </div>
      )}

      {/* Project Preview Lightbox Modal */}
      {previewProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-950/85 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-sm border border-gold-400/30 bg-ink-900 p-6 shadow-2xl">
            <div className="flex items-start justify-between border-b border-white/5 pb-4 mb-5">
              <div>
                <h3 className="font-serif text-2xl text-ink-50">{previewProject.title}</h3>
                <p className="text-xs text-ink-400 mt-0.5">
                  {previewProject.location || 'Location Not Specified'} · {formatDate(previewProject.eventDate)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPreviewProject(null)}
                className="p-1.5 rounded-sm text-ink-400 hover:text-ink-100 hover:bg-white/5 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {previewProject.media?.length ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {previewProject.media.map((img, i) => (
                  <div key={img._id || i} className="relative h-44 rounded-sm overflow-hidden bg-ink-950 border border-white/5 group">
                    <img src={img.url} alt="" className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-sm text-ink-400">
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
