import React, { useState } from 'react';
import {
  ArrowLeft,
  Save,
  Sparkles,
  Image as ImageIcon,
  Tag,
  Folder,
  User,
  Globe,
  Calculator,
  CheckCircle2,
  HelpCircle,
  Eye,
  Code,
  List,
  Heading,
} from 'lucide-react';
import { BlogPost } from '../../types/schema.ts';

interface AdminBlogEditorProps {
  post: BlogPost | null;
  onBack: () => void;
  onSaved: () => void;
}

export const AdminBlogEditor: React.FC<AdminBlogEditorProps> = ({ post, onBack, onSaved }) => {
  const [formData, setFormData] = useState<Partial<BlogPost>>(
    post || {
      title: '',
      slug: '',
      excerpt: '',
      content: '<p>Start writing your tax article or compliance guide here...</p>',
      featuredImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=80',
      category: 'Tax Planning',
      tags: ['Tax Planning', 'FY 2026-27'],
      author: {
        name: 'CA Rajesh Sharma',
        role: 'Senior Tax Consultant',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        bio: 'Practicing Chartered Accountant specializing in direct taxation.',
      },
      status: 'published',
      readTimeMinutes: 5,
      isFeatured: false,
      seoTitle: '',
      seoDescription: '',
      seoKeywords: ['tax calculator', 'fy 2026-27'],
      embeddedCalculators: ['income-tax-calculator'],
    }
  );

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [tagInput, setTagInput] = useState((formData.tags || []).join(', '));

  const handleTitleChange = (val: string) => {
    setFormData((prev) => ({
      ...prev,
      title: val,
      slug: !post
        ? val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
        : prev.slug,
      seoTitle: !prev.seoTitle ? val : prev.seoTitle,
    }));
  };

  const insertTagHelper = (tag: string) => {
    const currentTags = formData.tags || [];
    if (!currentTags.includes(tag)) {
      const updated = [...currentTags, tag];
      setFormData((prev) => ({ ...prev, tags: updated }));
      setTagInput(updated.join(', '));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) {
      setError('Article title is required');
      return;
    }

    try {
      setSaving(true);
      setError('');

      const tagsArray = tagInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const payload = {
        ...formData,
        tags: tagsArray,
      };

      const url = post ? `/api/admin/blogs/${post.id}` : '/api/admin/blogs';
      const method = post ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('calc_admin_token') || ''}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || 'Failed to save blog post');
      }

      onSaved();
    } catch (err: any) {
      setError(err.message || 'Error saving article');
    } finally {
      setSaving(false);
    }
  };

  // Helper formatting tools
  const insertFormatting = (tagStart: string, tagEnd: string = '') => {
    const textarea = document.getElementById('blog-content-editor') as HTMLTextAreaElement;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selected = text.substring(start, end);
    const replacement = `${tagStart}${selected || 'text'}${tagEnd}`;
    const newContent = text.substring(0, start) + replacement + text.substring(end);
    setFormData((prev) => ({ ...prev, content: newContent }));
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl font-black text-[#222325]">
              {post ? 'Edit Blog Article' : 'Create New Blog Article'}
            </h1>
            <p className="text-xs text-[#74767e]">
              WordPress-style rich content editor with live SEO preview and calculator embeds.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-[#1dbf73] hover:bg-[#19a463] text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : post ? 'Update Article' : 'Publish Article'}</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 text-rose-700 rounded-2xl border border-rose-200 text-xs font-bold">
          {error}
        </div>
      )}

      {/* Main Split-Screen Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: EDITOR CANVAS (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Title & Slug */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#222325] mb-1.5">Article Title</label>
              <input
                type="text"
                required
                placeholder="Enter an engaging SEO article title..."
                value={formData.title || ''}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full p-3.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold text-[#222325] focus:outline-none focus:ring-2 focus:ring-[#1dbf73] focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#222325] mb-1.5">URL Permalink Slug</label>
              <div className="flex items-center bg-slate-50 border border-slate-300 rounded-xl overflow-hidden px-3">
                <span className="text-xs text-slate-400 font-medium">/blog/</span>
                <input
                  type="text"
                  value={formData.slug || ''}
                  onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                  className="w-full p-2.5 bg-transparent text-xs font-bold text-[#222325] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#222325] mb-1.5">Short Excerpt / Summary</label>
              <textarea
                rows={2}
                placeholder="Brief summary for article cards and search snippets..."
                value={formData.excerpt || ''}
                onChange={(e) => setFormData((prev) => ({ ...prev, excerpt: e.target.value }))}
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-[#222325] focus:outline-none focus:ring-2 focus:ring-[#1dbf73]"
              />
            </div>
          </div>

          {/* Content Editor with WordPress Toolbar */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-3 bg-slate-100 border-b border-slate-200 flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => insertFormatting('<h2>', '</h2>')}
                className="px-2.5 py-1.5 bg-white hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold border border-slate-300"
                title="Heading 2"
              >
                H2
              </button>
              <button
                type="button"
                onClick={() => insertFormatting('<h3>', '</h3>')}
                className="px-2.5 py-1.5 bg-white hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold border border-slate-300"
                title="Heading 3"
              >
                H3
              </button>
              <span className="w-px h-5 bg-slate-300 mx-1" />
              <button
                type="button"
                onClick={() => insertFormatting('<strong>', '</strong>')}
                className="px-2.5 py-1.5 bg-white hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold border border-slate-300"
                title="Bold"
              >
                <strong>B</strong>
              </button>
              <button
                type="button"
                onClick={() => insertFormatting('<em>', '</em>')}
                className="px-2.5 py-1.5 bg-white hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold border border-slate-300 italic"
                title="Italic"
              >
                I
              </button>
              <span className="w-px h-5 bg-slate-300 mx-1" />
              <button
                type="button"
                onClick={() => insertFormatting('<ul>\n  <li>', '</li>\n</ul>')}
                className="px-2.5 py-1.5 bg-white hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium border border-slate-300 flex items-center gap-1"
                title="Bullet List"
              >
                <List className="w-3.5 h-3.5" />
                <span>List</span>
              </button>
              <button
                type="button"
                onClick={() => insertFormatting('<blockquote><p>', '</p></blockquote>')}
                className="px-2.5 py-1.5 bg-white hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium border border-slate-300"
                title="Blockquote"
              >
                Quote
              </button>
              <button
                type="button"
                onClick={() =>
                  insertFormatting(
                    '<div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 text-xs font-medium">\n  <p>',
                    '</p>\n</div>'
                  )
                }
                className="px-2.5 py-1.5 bg-[#f4fdf8] text-[#1dbf73] hover:bg-[#1dbf73] hover:text-white rounded-lg text-xs font-bold border border-[#d8f5e5]"
                title="Callout Box"
              >
                Callout Box
              </button>
            </div>

            <div className="p-6">
              <label className="block text-xs font-bold text-[#222325] mb-2">
                Article Body Content (HTML / Rich Text)
              </label>
              <textarea
                id="blog-content-editor"
                rows={16}
                value={formData.content || ''}
                onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
                className="w-full p-4 font-mono text-xs bg-slate-50 border border-slate-300 rounded-2xl text-[#222325] focus:outline-none focus:ring-2 focus:ring-[#1dbf73] focus:bg-white leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: INSPECTOR SIDEBAR (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Publish Settings Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-[#222325] border-b border-slate-100 pb-3">
              Publishing Settings
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Status</label>
              <select
                value={formData.status || 'published'}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, status: e.target.value as any }))
                }
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-[#222325]"
              >
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs font-bold text-slate-700">Featured Post Hero</span>
              <input
                type="checkbox"
                checked={formData.isFeatured || false}
                onChange={(e) => setFormData((prev) => ({ ...prev, isFeatured: e.target.checked }))}
                className="w-5 h-5 text-[#1dbf73] rounded-md border-slate-300 focus:ring-[#1dbf73] cursor-pointer"
              />
            </div>
          </div>

          {/* Category & Tags Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-[#222325] border-b border-slate-100 pb-3 flex items-center gap-2">
              <Folder className="w-4 h-4 text-[#1dbf73]" />
              <span>Category & Tags</span>
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Category</label>
              <select
                value={formData.category || 'Tax Planning'}
                onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-[#222325]"
              >
                <option value="Tax Planning">Tax Planning</option>
                <option value="TDS & Compliance">TDS & Compliance</option>
                <option value="Union Budget 2026">Union Budget 2026</option>
                <option value="Personal Finance">Personal Finance</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Tags (Comma separated)</label>
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-[#222325]"
                placeholder="Tax Planning, Regime, FY 2026-27"
              />
              <div className="flex flex-wrap gap-1.5 mt-2">
                {['Section 87A', 'Standard Deduction', 'Section 194J', 'New Tax Regime'].map((presetTag) => (
                  <button
                    key={presetTag}
                    type="button"
                    onClick={() => insertTagHelper(presetTag)}
                    className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[10px] font-bold"
                  >
                    + {presetTag}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Featured Image Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-[#222325] border-b border-slate-100 pb-3 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-[#1dbf73]" />
              <span>Featured Cover Image</span>
            </h3>

            <div>
              <input
                type="url"
                value={formData.featuredImage || ''}
                onChange={(e) => setFormData((prev) => ({ ...prev, featuredImage: e.target.value }))}
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-[#222325] mb-3"
                placeholder="https://images.unsplash.com/..."
              />
              {formData.featuredImage && (
                <img
                  src={formData.featuredImage}
                  alt="Cover preview"
                  className="w-full h-36 object-cover rounded-2xl border border-slate-200"
                />
              )}
            </div>
          </div>

          {/* Embedded Calculator Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-[#222325] border-b border-slate-100 pb-3 flex items-center gap-2">
              <Calculator className="w-4 h-4 text-[#1dbf73]" />
              <span>Embed Calculator Widget</span>
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Interactive Tool to Embed</label>
              <select
                value={formData.embeddedCalculators?.[0] || 'none'}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    embeddedCalculators: e.target.value === 'none' ? [] : [e.target.value],
                  }))
                }
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-[#222325]"
              >
                <option value="none">None</option>
                <option value="income-tax-calculator">Income Tax Calculator (Enterprise)</option>
                <option value="old-vs-new-tax-regime">Old vs New Tax Regime Calculator</option>
                <option value="tds">TDS Calculator</option>
              </select>
              <p className="text-[11px] text-slate-400 mt-1.5">
                Embeds the interactive calculator directly at the bottom of the article for readers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};
