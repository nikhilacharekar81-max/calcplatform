import React, { useState, useEffect } from 'react';
import {
  FileText,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  CheckCircle2,
  Clock,
  Sparkles,
  ExternalLink,
  AlertCircle,
  Tag,
  Folder,
} from 'lucide-react';
import { BlogPost } from '../../types/schema.ts';

interface AdminBlogManagerProps {
  onEditPost: (post: BlogPost | null) => void;
}

export const AdminBlogManager: React.FC<AdminBlogManagerProps> = ({ onEditPost }) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/blogs', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('calc_admin_token') || ''}`,
        },
      });
      if (!res.ok) throw new Error('Failed to fetch blog posts');
      const data = await res.json();
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

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;
    try {
      setDeletingId(id);
      const res = await fetch(`/api/admin/blogs/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('calc_admin_token') || ''}`,
        },
      });
      if (!res.ok) throw new Error('Failed to delete post');
      setPosts((prev) => prev.filter((p) => p.id !== id));
    } catch (err: any) {
      alert(err.message || 'Error deleting post');
    } finally {
      setDeletingId(null);
    }
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

  return (
    <div className="space-y-6">
      {/* Header Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#1dbf73] uppercase tracking-wider">
            <FileText className="w-4 h-4" />
            <span>WordPress-Style CMS &bull; Blog Articles</span>
          </div>
          <h1 className="text-2xl font-black text-[#222325] mt-1">Blog Posts Management</h1>
          <p className="text-xs text-[#74767e]">
            Create, edit, and manage rich editorial tax articles and compliance guides.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onEditPost(null)}
          className="px-5 py-2.5 rounded-xl bg-[#1dbf73] hover:bg-[#19a463] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
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
              Get started by creating your first rich editorial blog post or tax guide.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <th className="p-4">Article</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Author</th>
                  <th className="p-4">Views</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-[#404145]">
                {filteredPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-slate-50/80 transition-colors">
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
                    <td className="p-4 font-semibold text-slate-700">
                      <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-[11px]">
                        {post.category}
                      </span>
                    </td>
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
                    <td className="p-4 font-bold text-slate-700">{post.views || 0}</td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          post.status === 'published'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {post.status === 'published' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                        <span className="capitalize">{post.status}</span>
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2 whitespace-nowrap">
                      {post.status === 'published' && (
                        <a
                          href={`/blog/${post.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 inline-flex items-center"
                          title="View Live"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                      <button
                        type="button"
                        onClick={() => onEditPost(post)}
                        className="p-2 rounded-lg bg-[#f4fdf8] text-[#1dbf73] border border-[#d8f5e5] hover:bg-[#1dbf73] hover:text-white inline-flex items-center transition-colors"
                        title="Edit Article"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(post.id)}
                        disabled={deletingId === post.id}
                        className="p-2 rounded-lg bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-600 hover:text-white inline-flex items-center transition-colors"
                        title="Delete Article"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
