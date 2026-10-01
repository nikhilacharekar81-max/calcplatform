import React, { useState, useEffect } from 'react';
import {
  FileText,
  Plus,
  Search,
  Edit,
  Trash2,
  CheckCircle2,
  Clock,
  ExternalLink,
  Power,
  CheckSquare,
  Square,
  AlertTriangle,
  X,
  Check,
  Ban,
} from 'lucide-react';
import { BlogPost } from '../../types/schema.ts';
import { api } from '../../services/api.ts';

interface AdminBlogManagerProps {
  onEditPost: (post: BlogPost | null) => void;
}

export const AdminBlogManager: React.FC<AdminBlogManagerProps> = ({ onEditPost }) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  
  // Selection and Bulk Actions state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkActionLoading, setBulkActionLoading] = useState(false);
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Single item actions
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const data = await api.adminGetBlogs();
      setPosts(data);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Error loading posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const showToast = (type: 'success' | 'error', text: string) => {
    setToastMessage({ type, text });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const filteredPosts = posts.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === 'all'
        ? true
        : statusFilter === 'published'
        ? p.status === 'published'
        : p.status === 'draft';
    return matchesSearch && matchesStatus;
  });

  // Single Item Delete
  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id);
      await api.adminDeleteBlog(id);
      setPosts((prev) => prev.filter((p) => p.id !== id));
      setSelectedIds((prev) => prev.filter((i) => i !== id));
      setDeleteConfirmId(null);
      showToast('success', 'Article deleted successfully');
    } catch (err: any) {
      showToast('error', err.message || 'Error deleting article');
    } finally {
      setDeletingId(null);
    }
  };

  // Single Item Status Toggle (Enable / Disable)
  const handleToggleStatus = async (id: string) => {
    try {
      setTogglingId(id);
      const res = await api.adminToggleBlogStatus(id);
      setPosts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: res.status } : p))
      );
      showToast('success', `Article status changed to ${res.status}`);
    } catch (err: any) {
      showToast('error', err.message || 'Error updating status');
    } finally {
      setTogglingId(null);
    }
  };

  // Selection Logic
  const isAllSelected =
    filteredPosts.length > 0 &&
    filteredPosts.every((p) => selectedIds.includes(p.id));

  const toggleSelectAll = () => {
    if (isAllSelected) {
      // Unselect all filtered
      const filteredSet = new Set(filteredPosts.map((p) => p.id));
      setSelectedIds((prev) => prev.filter((id) => !filteredSet.has(id)));
    } else {
      // Select all filtered
      const newIds = new Set([...selectedIds, ...filteredPosts.map((p) => p.id)]);
      setSelectedIds(Array.from(newIds));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Bulk Enable (Publish)
  const handleBulkEnable = async () => {
    if (selectedIds.length === 0) return;
    try {
      setBulkActionLoading(true);
      await api.adminBulkBlogStatus(selectedIds, 'published');
      setPosts((prev) =>
        prev.map((p) => (selectedIds.includes(p.id) ? { ...p, status: 'published' } : p))
      );
      showToast('success', `Successfully enabled (published) ${selectedIds.length} article(s)`);
      setSelectedIds([]);
    } catch (err: any) {
      showToast('error', err.message || 'Error executing bulk enable');
    } finally {
      setBulkActionLoading(false);
    }
  };

  // Bulk Disable (Draft / Unpublish)
  const handleBulkDisable = async () => {
    if (selectedIds.length === 0) return;
    try {
      setBulkActionLoading(true);
      await api.adminBulkBlogStatus(selectedIds, 'draft');
      setPosts((prev) =>
        prev.map((p) => (selectedIds.includes(p.id) ? { ...p, status: 'draft' } : p))
      );
      showToast('success', `Successfully disabled (moved to draft) ${selectedIds.length} article(s)`);
      setSelectedIds([]);
    } catch (err: any) {
      showToast('error', err.message || 'Error executing bulk disable');
    } finally {
      setBulkActionLoading(false);
    }
  };

  // Bulk Delete
  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    try {
      setBulkActionLoading(true);
      await api.adminBulkBlogDelete(selectedIds);
      const targetSet = new Set(selectedIds);
      setPosts((prev) => prev.filter((p) => !targetSet.has(p.id)));
      showToast('success', `Successfully deleted ${selectedIds.length} article(s)`);
      setSelectedIds([]);
      setShowBulkDeleteConfirm(false);
    } catch (err: any) {
      showToast('error', err.message || 'Error executing bulk delete');
    } finally {
      setBulkActionLoading(false);
    }
  };

  return (
    <div className="space-y-6 relative pb-20">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl shadow-xl border text-xs font-bold transition-all animate-bounce ${
            toastMessage.type === 'success'
              ? 'bg-emerald-900 text-emerald-100 border-emerald-700'
              : 'bg-rose-900 text-rose-100 border-rose-700'
          }`}
        >
          {toastMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
          )}
          <span>{toastMessage.text}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="ml-2 hover:opacity-80 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Header Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#1dbf73] uppercase tracking-wider">
            <FileText className="w-4 h-4" />
            <span>Editorial CMS &bull; Blog Articles</span>
          </div>
          <h1 className="text-2xl font-black text-[#222325] mt-1">Blog Posts Management</h1>
          <p className="text-xs text-[#74767e]">
            Create, publish, bulk enable/disable, and manage rich editorial blog posts and scholarship guides.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onEditPost(null)}
          className="px-5 py-2.5 rounded-xl bg-[#1dbf73] hover:bg-[#19a463] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Article</span>
        </button>
      </div>

      {/* Filters & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setStatusFilter('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              statusFilter === 'all'
                ? 'bg-[#222325] text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All ({posts.length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('published')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              statusFilter === 'published'
                ? 'bg-[#1dbf73] text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Published ({posts.filter((p) => p.status === 'published').length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('draft')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              statusFilter === 'draft'
                ? 'bg-amber-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Drafts ({posts.filter((p) => p.status === 'draft').length})
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#1dbf73] focus:bg-white"
          />
        </div>
      </div>

      {/* Floating Bulk Action Bar */}
      {selectedIds.length > 0 && (
        <div className="sticky top-4 z-40 bg-[#222325] text-white p-4 rounded-2xl border border-slate-800 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <span className="w-7 h-7 rounded-lg bg-[#1dbf73] text-white font-extrabold text-xs flex items-center justify-center">
              {selectedIds.length}
            </span>
            <span className="text-xs font-bold text-slate-200">
              {selectedIds.length === 1 ? '1 article selected' : `${selectedIds.length} articles selected`}
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Bulk Enable / Publish */}
            <button
              type="button"
              onClick={handleBulkEnable}
              disabled={bulkActionLoading}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs disabled:opacity-50"
              title="Enable / Publish all selected articles"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Enable (Publish)</span>
            </button>

            {/* Bulk Disable / Draft */}
            <button
              type="button"
              onClick={handleBulkDisable}
              disabled={bulkActionLoading}
              className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs disabled:opacity-50"
              title="Disable / Move to Draft all selected articles"
            >
              <Ban className="w-3.5 h-3.5" />
              <span>Disable (Draft)</span>
            </button>

            {/* Bulk Delete Trigger */}
            <button
              type="button"
              onClick={() => setShowBulkDeleteConfirm(true)}
              disabled={bulkActionLoading}
              className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs disabled:opacity-50"
              title="Delete all selected articles"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Bulk Delete</span>
            </button>

            {/* Clear Selection */}
            <button
              type="button"
              onClick={() => setSelectedIds([])}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-all cursor-pointer ml-2"
            >
              Deselect
            </button>
          </div>
        </div>
      )}

      {/* Bulk Delete Modal Confirmation */}
      {showBulkDeleteConfirm && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-md w-full p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-lg font-black text-[#222325]">Bulk Delete Confirmation</h3>
              <p className="text-xs text-slate-500">
                Are you sure you want to permanently delete <strong className="text-rose-600">{selectedIds.length}</strong> selected articles? This action cannot be undone.
              </p>
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowBulkDeleteConfirm(false)}
                disabled={bulkActionLoading}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleBulkDelete}
                disabled={bulkActionLoading}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-xs disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" />
                <span>{bulkActionLoading ? 'Deleting...' : 'Yes, Delete Selected'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Posts Table */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-500 font-medium">Loading blog articles...</div>
        ) : error ? (
          <div className="p-12 text-center text-xs text-rose-600 font-medium">{error}</div>
        ) : filteredPosts.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <FileText className="w-10 h-10 text-slate-300 mx-auto" />
            <div className="text-sm font-bold text-slate-700">No blog posts found</div>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Get started by creating your first rich editorial blog post or scholarship guide.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <th className="p-4 w-10 text-center">
                    <button
                      type="button"
                      onClick={toggleSelectAll}
                      className="text-slate-500 hover:text-[#1dbf73] transition-colors cursor-pointer"
                      title={isAllSelected ? 'Deselect All' : 'Select All'}
                    >
                      {isAllSelected ? (
                        <CheckSquare className="w-4 h-4 text-[#1dbf73]" />
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                    </button>
                  </th>
                  <th className="p-4">Article</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Author</th>
                  <th className="p-4">Views</th>
                  <th className="p-4">Status & Quick Toggle</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-[#404145]">
                {filteredPosts.map((post) => {
                  const isSelected = selectedIds.includes(post.id);
                  const isPublished = post.status === 'published';

                  return (
                    <tr
                      key={post.id}
                      className={`transition-colors ${
                        isSelected ? 'bg-emerald-50/50' : 'hover:bg-slate-50/80'
                      }`}
                    >
                      {/* Checkbox Cell */}
                      <td className="p-4 text-center">
                        <button
                          type="button"
                          onClick={() => toggleSelectOne(post.id)}
                          className="text-slate-400 hover:text-[#1dbf73] transition-colors cursor-pointer"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-[#1dbf73]" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>
                      </td>

                      {/* Article Info Cell */}
                      <td className="p-4 flex items-center gap-3">
                        <img
                          src={post.featuredImage}
                          alt=""
                          className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                        />
                        <div>
                          <div className="font-bold text-[#222325] line-clamp-1">{post.title}</div>
                          <div className="text-[11px] text-slate-400">/blog/{post.slug}</div>
                        </div>
                      </td>

                      {/* Category Cell */}
                      <td className="p-4 font-semibold text-slate-700">
                        <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-[11px]">
                          {post.category}
                        </span>
                      </td>

                      {/* Author Cell */}
                      <td className="p-4 text-slate-600">
                        <div className="flex items-center gap-2">
                          <img
                            src={post.author?.avatar}
                            alt=""
                            className="w-6 h-6 rounded-full object-cover"
                          />
                          <span>{post.author?.name}</span>
                        </div>
                      </td>

                      {/* Views Cell */}
                      <td className="p-4 font-bold text-slate-700">{post.views || 0}</td>

                      {/* Status & Single Enable/Disable Toggle */}
                      <td className="p-4">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(post.id)}
                          disabled={togglingId === post.id}
                          className={`group inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border transition-all cursor-pointer ${
                            isPublished
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200'
                              : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200'
                          }`}
                          title={isPublished ? 'Click to Disable (Move to Draft)' : 'Click to Enable (Publish)'}
                        >
                          <Power className={`w-3 h-3 ${isPublished ? 'text-emerald-600 group-hover:text-rose-600' : 'text-amber-600 group-hover:text-emerald-600'}`} />
                          <span>
                            {togglingId === post.id
                              ? 'Updating...'
                              : isPublished
                              ? 'Published'
                              : 'Draft'}
                          </span>
                        </button>
                      </td>

                      {/* Actions Cell */}
                      <td className="p-4 text-right space-x-2 whitespace-nowrap">
                        {isPublished && (
                          <a
                            href={`/blog/${post.slug}`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 inline-flex items-center"
                            title="View Live Article"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}

                        <button
                          type="button"
                          onClick={() => onEditPost(post)}
                          className="p-2 rounded-lg bg-[#f4fdf8] text-[#1dbf73] border border-[#d8f5e5] hover:bg-[#1dbf73] hover:text-white inline-flex items-center transition-colors cursor-pointer"
                          title="Edit Article"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>

                        {deleteConfirmId === post.id ? (
                          <div className="inline-flex items-center gap-1.5 bg-rose-50/50 p-1 rounded-xl border border-rose-100">
                            <button
                              type="button"
                              onClick={() => handleDelete(post.id)}
                              disabled={deletingId === post.id}
                              className="px-2.5 py-1.5 text-[10px] font-extrabold bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition-all cursor-pointer shadow-xs"
                            >
                              {deletingId === post.id ? 'Deleting...' : 'Confirm'}
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteConfirmId(null)}
                              className="px-2 py-1.5 text-[10px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition-all cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmId(post.id)}
                            className="p-2 rounded-lg bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-600 hover:text-white inline-flex items-center transition-colors cursor-pointer"
                            title="Delete Article"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
