import React, { useState, useEffect } from 'react';
import {
  FileText,
  Search,
  Calendar,
  Clock,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Tag,
  User,
  ExternalLink,
} from 'lucide-react';
import { BlogPost, BlogCategory } from '../types/schema.ts';
import { Breadcrumbs } from '../components/layout/Breadcrumbs.tsx';

export const BlogIndexPage: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [postsRes, catsRes] = await Promise.all([
          fetch('/api/public/blogs'),
          fetch('/api/public/blog-categories'),
        ]);
        if (postsRes.ok) {
          const pData = await postsRes.json();
          setPosts(pData);
        }
        if (catsRes.ok) {
          const cData = await catsRes.json();
          setCategories(cData);
        }
      } catch (err) {
        console.error('Error loading blog feed:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredPosts = posts.filter((p) => {
    const matchesCat =
      selectedCategory === 'All' || p.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const featuredPost = posts.find((p) => p.isFeatured) || posts[0];
  const regularPosts = filteredPosts.filter((p) => p.id !== featuredPost?.id);

  return (
    <div className="w-full space-y-10 py-6 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Tax Blog & Guides', href: '/blog' },
          ]}
        />

        {/* Hero Header */}
        <div className="bg-gradient-to-br from-[#f4fdf8] via-white to-emerald-50/40 rounded-3xl border border-emerald-100 p-8 sm:p-12 shadow-xs space-y-4 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1dbf73]/10 text-[#1dbf73] text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Expert Direct Tax & Compliance Insights</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-[#222325] tracking-tight">
              Tax & Financial Intelligence Hub
            </h1>
            <p className="text-sm sm:text-base text-[#62646a] leading-relaxed">
              Stay ahead with expert articles on the New Tax Regime, TDS compliance, Section 194 updates, and strategic financial planning for FY 2026-27.
            </p>
          </div>

          <div className="w-full sm:w-80 shrink-0">
            <div className="relative">
              <Search className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search articles & guides..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white border border-slate-300 rounded-2xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#1dbf73] shadow-xs"
              />
            </div>
          </div>
        </div>

        {/* Categories Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-4">
          <button
            type="button"
            onClick={() => setSelectedCategory('All')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedCategory === 'All'
                ? 'bg-[#222325] text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            All Articles ({posts.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.name)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === cat.name
                  ? 'bg-[#1dbf73] text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat.name} ({cat.postCount || 0})
            </button>
          ))}
        </div>

        {/* Featured Hero Article Banner */}
        {featuredPost && selectedCategory === 'All' && !searchQuery && (
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-md grid grid-cols-1 lg:grid-cols-12 gap-0 group hover:shadow-lg transition-shadow">
            <div className="lg:col-span-7 relative min-h-[280px] sm:min-h-[360px] overflow-hidden">
              <img
                src={featuredPost.featuredImage}
                alt={featuredPost.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-4 left-4 bg-[#1dbf73] text-white text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                Featured Guide
              </div>
            </div>

            <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
                  <span className="text-[#1dbf73] font-bold">{featuredPost.category}</span>
                  <span>&bull;</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {featuredPost.readTimeMinutes || 5} min read
                  </span>
                </div>

                <a href={`/blog/${featuredPost.slug}`} className="block">
                  <h2 className="text-xl sm:text-2xl font-extrabold text-[#222325] hover:text-[#1dbf73] transition-colors leading-tight">
                    {featuredPost.title}
                  </h2>
                </a>

                <p className="text-xs sm:text-sm text-[#62646a] leading-relaxed line-clamp-3">
                  {featuredPost.excerpt}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img
                    src={featuredPost.author?.avatar}
                    alt={featuredPost.author?.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div>
                    <div className="text-xs font-bold text-[#222325]">{featuredPost.author?.name}</div>
                    <div className="text-[10px] text-slate-400">{featuredPost.author?.role}</div>
                  </div>
                </div>

                <a
                  href={`/blog/${featuredPost.slug}`}
                  className="px-4 py-2 rounded-xl bg-[#f4fdf8] text-[#1dbf73] font-bold text-xs hover:bg-[#1dbf73] hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <span>Read Article</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Regular Posts Grid */}
        {loading ? (
          <div className="py-20 text-center text-xs text-slate-500">Loading articles...</div>
        ) : filteredPosts.length === 0 ? (
          <div className="py-20 text-center space-y-3">
            <FileText className="w-10 h-10 text-slate-300 mx-auto" />
            <div className="text-base font-bold text-slate-700">No matching articles found</div>
            <p className="text-xs text-slate-500">Try adjusting your search query or category filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(selectedCategory === 'All' && !searchQuery ? regularPosts : filteredPosts).map((post) => (
              <article
                key={post.id}
                className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={post.featuredImage}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-[#222325] text-[10px] font-bold px-2.5 py-1 rounded-full">
                      {post.category}
                    </div>
                  </div>

                  <div className="p-6 space-y-3">
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 font-medium">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(post.publishedAt).toLocaleDateString('en-IN', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                      <span>&bull;</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {post.readTimeMinutes || 5} min read
                      </span>
                    </div>

                    <a href={`/blog/${post.slug}`} className="block">
                      <h3 className="text-base font-extrabold text-[#222325] hover:text-[#1dbf73] transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                    </a>

                    <p className="text-xs text-[#62646a] line-clamp-3 leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0 flex items-center justify-between border-t border-slate-100 mt-4">
                  <div className="flex items-center gap-2">
                    <img
                      src={post.author?.avatar}
                      alt={post.author?.name}
                      className="w-7 h-7 rounded-full object-cover"
                    />
                    <span className="text-xs font-bold text-[#222325]">{post.author?.name}</span>
                  </div>

                  <a
                    href={`/blog/${post.slug}`}
                    className="text-xs font-bold text-[#1dbf73] hover:underline flex items-center gap-1"
                  >
                    <span>Read</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
