import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  User,
  Share2,
  ArrowLeft,
  ArrowRight,
  Calculator,
  CheckCircle2,
  Bookmark,
  Sparkles,
} from 'lucide-react';
import { BlogPost } from '../types/schema.ts';
import { Breadcrumbs } from '../components/layout/Breadcrumbs.tsx';
import { EnterpriseTaxCalculatorApp } from '../components/calculator/EnterpriseTaxCalculatorApp.tsx';
import { TdsCalculatorApp } from '../components/calculator/TdsCalculatorApp.tsx';
import { OldVsNewRegimeCalculatorApp } from '../components/calculator/OldVsNewRegimeCalculatorApp.tsx';

interface BlogPostPageProps {
  slug: string;
}

export const BlogPostPage: React.FC<BlogPostPageProps> = ({ slug }) => {
  const [data, setData] = useState<{ post: BlogPost; related: BlogPost[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    async function fetchPost() {
      try {
        setLoading(true);
        const res = await fetch(`/api/public/blogs/${slug}`);
        if (!res.ok) throw new Error('Article not found');
        const json = await res.json();
        setData(json);
      } catch (err: any) {
        setError(err.message || 'Error loading article');
      } finally {
        setLoading(false);
      }
    }
    fetchPost();
  }, [slug]);

  // Scroll Progress Bar
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(progress);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  if (loading) {
    return (
      <div className="w-full py-24 text-center text-xs text-slate-500 font-medium">
        Loading article...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="w-full py-24 text-center space-y-4">
        <h1 className="text-2xl font-black text-[#222325]">Article Not Found</h1>
        <p className="text-xs text-slate-500">The requested article could not be loaded or does not exist.</p>
        <a
          href="/blog"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1dbf73] text-white text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Tax Blog</span>
        </a>
      </div>
    );
  }

  const { post, related } = data;

  return (
    <div className="w-full font-sans pb-16">
      {/* Scroll Progress Bar */}
      <div
        className="fixed top-0 left-0 h-1 bg-[#1dbf73] z-50 transition-all duration-150"
        style={{ width: `${scrollProgress}%` }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Tax Blog', href: '/blog' },
            { label: post.category, href: `/blog?category=${encodeURIComponent(post.category)}` },
            { label: post.title, href: `/blog/${post.slug}` },
          ]}
        />

        {/* Article Header */}
        <header className="space-y-4 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs">
            <span className="px-3 py-1 rounded-full bg-[#f4fdf8] text-[#1dbf73] font-bold border border-[#d8f5e5]">
              {post.category}
            </span>
            <span className="flex items-center gap-1 text-slate-400">
              <Calendar className="w-3.5 h-3.5" />
              {new Date(post.publishedAt).toLocaleDateString('en-IN', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
            <span>&bull;</span>
            <span className="flex items-center gap-1 text-slate-400">
              <Clock className="w-3.5 h-3.5" />
              {post.readTimeMinutes || 5} min read
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-[#222325] tracking-tight leading-tight">
            {post.title}
          </h1>

          <p className="text-sm sm:text-base text-[#62646a] leading-relaxed max-w-3xl">
            {post.excerpt}
          </p>

          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img
                src={post.author?.avatar}
                alt={post.author?.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-xs"
              />
              <div className="text-left">
                <div className="text-sm font-extrabold text-[#222325]">{post.author?.name}</div>
                <div className="text-xs text-slate-500">{post.author?.role}</div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCopyLink}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>{copiedLink ? 'Link Copied!' : 'Share Article'}</span>
            </button>
          </div>
        </header>

        {/* Featured Cover Image */}
        <div className="rounded-3xl overflow-hidden border border-slate-200 shadow-md">
          <img
            src={post.featuredImage}
            alt={post.title}
            className="w-full h-auto max-h-[480px] object-cover"
          />
        </div>

        {/* Main Body Content */}
        <article
          className="prose prose-emerald max-w-none text-[#404145] text-sm sm:text-base leading-relaxed space-y-6 bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-xs"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Embedded Interactive Calculator Widget (if specified) */}
        {post.embeddedCalculators && post.embeddedCalculators.length > 0 && (
          <div className="bg-gradient-to-br from-[#f4fdf8] via-white to-emerald-50/50 p-6 sm:p-8 rounded-3xl border border-[#1dbf73]/40 shadow-md space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#1dbf73] text-white flex items-center justify-center shadow-xs">
                <Calculator className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-[#222325]">
                  Interactive Calculation Widget
                </h3>
                <p className="text-xs text-[#62646a]">
                  Run your numbers live using our integrated FY 2026-27 calculation tool.
                </p>
              </div>
            </div>

            <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs">
              {post.embeddedCalculators[0] === 'income-tax-calculator' ? (
                <EnterpriseTaxCalculatorApp
                  calculator={{
                    id: 'calc_ent_tax',
                    name: 'Enterprise Income Tax Calculator',
                    slug: 'income-tax-calculator',
                    shortDescription: '',
                    categoryId: '',
                    subcategoryId: '',
                    fields: [],
                    outputs: [],
                    order: 1,
                    isActive: true,
                    createdAt: '',
                    updatedAt: '',
                  }}
                />
              ) : post.embeddedCalculators[0] === 'tds' ? (
                <TdsCalculatorApp />
              ) : (
                <OldVsNewRegimeCalculatorApp />
              )}
            </div>
          </div>
        )}

        {/* Author Bio Card */}
        {post.author?.bio && (
          <div className="bg-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-200 flex flex-col sm:flex-row items-center gap-6">
            <img
              src={post.author.avatar}
              alt={post.author.name}
              className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-xs shrink-0"
            />
            <div className="space-y-1.5 text-center sm:text-left">
              <span className="text-[10px] font-bold text-[#1dbf73] uppercase tracking-wider">
                About the Author
              </span>
              <h4 className="text-base font-extrabold text-[#222325]">{post.author.name}</h4>
              <p className="text-xs text-[#62646a] leading-relaxed">{post.author.bio}</p>
            </div>
          </div>
        )}

        {/* Related Articles */}
        {related.length > 0 && (
          <div className="space-y-6 pt-6 border-t border-slate-200">
            <h3 className="text-xl font-extrabold text-[#222325]">Related Tax Articles</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((rel) => (
                <a
                  key={rel.id}
                  href={`/blog/${rel.slug}`}
                  className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3 hover:shadow-md transition-shadow flex flex-col justify-between group"
                >
                  <div>
                    <img
                      src={rel.featuredImage}
                      alt={rel.title}
                      className="w-full h-32 object-cover rounded-xl mb-3"
                    />
                    <h4 className="text-sm font-bold text-[#222325] group-hover:text-[#1dbf73] transition-colors line-clamp-2">
                      {rel.title}
                    </h4>
                  </div>
                  <span className="text-xs font-bold text-[#1dbf73] flex items-center gap-1">
                    <span>Read Guide</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
