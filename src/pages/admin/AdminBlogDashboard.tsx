import React, { useState, useEffect } from 'react';
import {
  FileText,
  FolderTree,
  Layers,
  Plus,
  ArrowRight,
  CheckCircle2,
  Edit2,
  Calendar,
  Sparkles,
  Bookmark,
} from 'lucide-react';
import { api } from '../../services/api.ts';
import { BlogPost, BlogCategory, BlogSubcategory } from '../../types/schema.ts';

interface AdminBlogDashboardProps {
  onNavigate: (tab: any, param?: string) => void;
}

export const AdminBlogDashboard: React.FC<AdminBlogDashboardProps> = ({ onNavigate }) => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [subcategories, setSubcategories] = useState<BlogSubcategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const [allBlogs, allCats, allSubs] = await Promise.all([
        api.adminGetBlogs(),
        api.adminGetBlogCategories(),
        api.adminGetBlogSubcategories(),
      ]);
      setBlogs(allBlogs);
      setCategories(allCats);
      setSubcategories(allSubs);
    } catch (err: any) {
      setError(err.message || 'Error loading Blog CMS Dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const totalBlogs = blogs.length;
  const publishedBlogs = blogs.filter((b) => b.status === 'published').length;
  const draftBlogs = blogs.filter((b) => b.status === 'draft').length;
  const totalCategories = categories.length;
  const totalSubcategories = subcategories.length;

  const statsList = [
    {
      title: 'Total Articles',
      total: totalBlogs,
      detail: `${publishedBlogs} Published, ${draftBlogs} Drafts`,
      icon: FileText,
      color: 'text-emerald-600 bg-emerald-50',
      tab: 'blogs',
    },
    {
      title: 'Blog Categories',
      total: totalCategories,
      detail: `${categories.filter((c) => c.isActive !== false).length} Active Categories`,
      icon: FolderTree,
      color: 'text-[#1dbf73] bg-emerald-50/50',
      tab: 'blog-categories',
    },
    {
      title: 'Blog Subcategories',
      total: totalSubcategories,
      detail: `${subcategories.filter((s) => s.isActive !== false).length} Active Sub-topics`,
      icon: Layers,
      color: 'text-[#1dbf73] bg-[#e8faf1]',
      tab: 'blog-categories',
    },
  ];

  const recentPosts = [...blogs]
    .sort((a, b) => new Date(b.publishedAt || b.updatedAt || '').getTime() - new Date(a.publishedAt || a.updatedAt || '').getTime())
    .slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-[#e4e5e7]">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#1dbf73] uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Blog CMS Center &bull; Editorial Suite</span>
          </div>
          <h1 className="text-2xl font-black text-[#222325]">Blog &amp; Articles Dashboard</h1>
          <p className="text-xs sm:text-sm text-[#74767e]">
            Review total posts, article statuses, and taxonomies to power your site content.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => onNavigate('blog-categories')}
            className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-[#404145] bg-white hover:bg-[#f5f5f5] border border-[#dadbdd] rounded-xl transition-all cursor-pointer shadow-2xs"
          >
            <FolderTree className="w-3.5 h-3.5" />
            <span>Manage Taxonomies</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigate('blog-editor', 'new')}
            className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-white bg-[#1dbf73] hover:bg-[#19a463] rounded-xl transition-all cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Write New Article</span>
          </button>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statsList.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col justify-between hover:border-[#1dbf73] hover:shadow-xs transition-all duration-150"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-[#74767e] uppercase tracking-wider">
                    {stat.title}
                  </span>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}>
                    <Icon className="w-5 h-5 stroke-[1.75]" />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-4xl font-black font-mono text-[#222325] tabular-nums">
                    {loading ? '-' : stat.total}
                  </div>
                  <div className="text-[11px] font-bold text-slate-400">{stat.detail}</div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => onNavigate(stat.tab)}
                  className="w-full flex items-center justify-between text-xs font-extrabold text-[#1dbf73] hover:text-[#19a463] transition-colors cursor-pointer"
                >
                  <span>Manage {stat.title}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Articles List */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-extrabold text-[#222325]">Recent Articles</h2>
              <p className="text-[11px] text-[#74767e] mt-0.5">Quick overview of your latest posts and status badges</p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('blogs')}
              className="text-xs font-bold text-[#1dbf73] hover:text-[#19a463] transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {loading ? (
            <div className="p-12 text-center text-xs text-slate-400">Loading recent posts...</div>
          ) : recentPosts.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-xs space-y-3">
              <Bookmark className="w-8 h-8 text-slate-200 mx-auto" />
              <div className="font-bold text-slate-700">No Articles Yet</div>
              <p>Create your very first article to post updates on your live blog site.</p>
              <button
                type="button"
                onClick={() => onNavigate('blog-editor', 'new')}
                className="px-4 py-2 bg-[#1dbf73] hover:bg-[#19a463] text-white text-xs font-bold rounded-xl"
              >
                Write Article
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentPosts.map((post) => (
                <div key={post.id} className="p-4 flex items-center justify-between hover:bg-slate-50/60 transition-colors">
                  <div className="space-y-1">
                    <div className="font-extrabold text-[#222325] text-xs line-clamp-1">{post.title}</div>
                    <div className="flex items-center gap-2.5 text-[10px] font-bold text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(post.publishedAt || post.updatedAt || '').toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                      <span>&bull;</span>
                      <span>By {typeof post.author === 'object' ? post.author?.name : (post.author || 'Editorial Staff')}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-black tracking-wide uppercase ${
                        post.status === 'published'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-slate-50 text-slate-500 border border-slate-200'
                      }`}
                    >
                      {post.status}
                    </span>
                    <button
                      type="button"
                      onClick={() => onNavigate('blog-editor', post.id)}
                      className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-[#222325]"
                      title="Edit Post"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions Panel */}
        <div className="space-y-6">
          <div className="bg-[#222325] text-white rounded-3xl p-6 shadow-xs space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#1dbf73] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>Quick Tips</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              Taxonomy categorization helps calculators rank higher. Align your subcategories with specific tools
              (such as EMI, Loan, or Tax) to display matching calculators directly alongside your guide posts!
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-extrabold text-[#222325]">Editorial Stats Summary</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                <span>Published Articles</span>
                <span className="text-emerald-600 font-mono">{publishedBlogs}</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full"
                  style={{ width: `${totalBlogs ? (publishedBlogs / totalBlogs) * 100 : 0}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-xs font-bold text-slate-500 pt-2">
                <span>Draft Articles</span>
                <span className="text-slate-500 font-mono">{draftBlogs}</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-slate-400 h-full rounded-full"
                  style={{ width: `${totalBlogs ? (draftBlogs / totalBlogs) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
