import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  ArrowUp,
  ArrowDown,
  AlertTriangle,
  Layers,
  Eye,
  EyeOff,
  ExternalLink,
  X,
} from 'lucide-react';
import { api } from '../../services/api.ts';
import { Subcategory, Category } from '../../types/schema.ts';
import { slugify, isValidSlug } from '../../utils/slugify.ts';
import { EmptyState } from '../../components/common/EmptyState.tsx';

export const AdminSubcategories: React.FC = () => {
  const [subcategories, setSubcategories] = useState<Array<Subcategory & { category?: Category; calculatorsCount: number }>>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [isLoading, setIsLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSub, setEditingSub] = useState<Subcategory | null>(null);
  const [formData, setFormData] = useState({
    categoryId: '',
    name: '',
    slug: '',
    description: '',
    seoTitle: '',
    seoDescription: '',
    seoKeywords: '',
    order: 1,
    isActive: true,
  });
  const [autoSlug, setAutoSlug] = useState(true);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Delete Target
  const [deleteTarget, setDeleteTarget] = useState<{
    sub: Subcategory & { category?: Category; calculatorsCount: number };
    cascadeWarning?: boolean;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadSubcategories();
  }, [selectedCategoryId, search, statusFilter]);

  const loadCategories = async () => {
    try {
      const cats = await api.adminGetCategories();
      setCategories(cats);
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  };

  const loadSubcategories = async () => {
    setIsLoading(true);
    try {
      const data = await api.adminGetSubcategories({
        categoryId: selectedCategoryId || undefined,
        search: search || undefined,
        status: statusFilter === 'all' ? undefined : statusFilter,
      });
      setSubcategories(data);
    } catch (err) {
      console.error('Failed to load subcategories:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenCreate = () => {
    if (categories.length === 0) {
      alert('Please create at least one category before adding subcategories.');
      return;
    }

    setEditingSub(null);
    setFormData({
      categoryId: selectedCategoryId || (categories[0]?.id || ''),
      name: '',
      slug: '',
      description: '',
      seoTitle: '',
      seoDescription: '',
      seoKeywords: '',
      order: subcategories.length + 1,
      isActive: true,
    });
    setAutoSlug(true);
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (sub: Subcategory & { category?: Category; calculatorsCount: number }) => {
    setEditingSub(sub);
    setFormData({
      categoryId: sub.categoryId,
      name: sub.name,
      slug: sub.slug,
      description: sub.description || '',
      seoTitle: sub.seoTitle || '',
      seoDescription: sub.seoDescription || '',
      seoKeywords: sub.seoKeywords || '',
      order: sub.order || 1,
      isActive: sub.isActive,
    });
    setAutoSlug(false);
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleNameChange = (name: string) => {
    setFormData((prev) => ({
      ...prev,
      name,
      slug: autoSlug ? slugify(name) : prev.slug,
      seoTitle: !prev.seoTitle || prev.seoTitle === prev.name ? name : prev.seoTitle,
    }));
  };

  const handleSlugChange = (slug: string) => {
    setAutoSlug(false);
    setFormData((prev) => ({ ...prev, slug: slugify(slug) }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.categoryId) {
      setFormError('Parent category is required.');
      return;
    }

    if (!formData.name.trim()) {
      setFormError('Subcategory name is required.');
      return;
    }

    const finalSlug = slugify(formData.slug || formData.name);
    if (!isValidSlug(finalSlug)) {
      setFormError('Please enter a valid lowercase alphanumeric slug.');
      return;
    }

    setIsSaving(true);
    try {
      if (editingSub) {
        await api.adminUpdateSubcategory(editingSub.id, {
          ...formData,
          slug: finalSlug,
        });
      } else {
        await api.adminCreateSubcategory({
          ...formData,
          slug: finalSlug,
        });
      }
      setIsModalOpen(false);
      loadSubcategories();
    } catch (err: any) {
      setFormError(err.message || 'Failed to save subcategory.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleStatus = async (sub: Subcategory) => {
    try {
      await api.adminToggleSubcategory(sub.id);
      loadSubcategories();
    } catch (err) {
      console.error('Failed to toggle status:', err);
    }
  };

  const handleMoveOrder = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= subcategories.length) return;

    const newOrder = [...subcategories];
    const temp = newOrder[index];
    newOrder[index] = newOrder[targetIndex];
    newOrder[targetIndex] = temp;

    setSubcategories(newOrder);

    try {
      await api.adminReorderSubcategories(newOrder.map((s) => s.id));
    } catch (err) {
      console.error('Failed to reorder subcategories:', err);
      loadSubcategories();
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const targetId = deleteTarget.sub.id;
      await api.adminDeleteSubcategory(targetId, true);

      // Optimistically update local state immediately
      setSubcategories((prev) => prev.filter((s) => s.id !== targetId));
      setDeleteTarget(null);

      // Refresh list from server
      await loadSubcategories();
    } catch (err: any) {
      alert(err.message || 'Failed to delete subcategory');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#e4e5e7]">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#222325] tracking-tight">
            Subcategory Management
          </h1>
          <p className="text-xs sm:text-sm text-[#74767e] mt-1">
            Create secondary organization groups linked to parent categories
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-white bg-[#1dbf73] hover:bg-[#19a463] rounded-md transition-colors cursor-pointer shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Subcategory</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-3 rounded-lg border border-[#e4e5e7]">
        <div className="relative">
          <Search className="w-4 h-4 text-[#74767e] absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search subcategories..."
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-[#dadbdd] rounded-md outline-hidden focus:border-[#1dbf73]"
          />
        </div>

        <div>
          <select
            value={selectedCategoryId}
            onChange={(e) => setSelectedCategoryId(e.target.value)}
            className="w-full px-3 py-1.5 text-xs font-semibold text-[#222325] border border-[#dadbdd] rounded-md outline-hidden focus:border-[#1dbf73] bg-white cursor-pointer"
          >
            <option value="">All Parent Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                Category: {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center justify-end gap-2">
          <span className="text-xs font-semibold text-[#74767e]">Status:</span>
          <div className="flex items-center p-0.5 bg-[#f5f5f5] rounded-md text-xs">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1 rounded font-bold transition-colors cursor-pointer ${
                statusFilter === 'all' ? 'bg-white text-[#222325] shadow-xs' : 'text-[#74767e] hover:text-[#222325]'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter('active')}
              className={`px-3 py-1 rounded font-bold transition-colors cursor-pointer ${
                statusFilter === 'active' ? 'bg-white text-[#1dbf73] shadow-xs' : 'text-[#74767e] hover:text-[#222325]'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setStatusFilter('inactive')}
              className={`px-3 py-1 rounded font-bold transition-colors cursor-pointer ${
                statusFilter === 'inactive' ? 'bg-white text-[#222325] shadow-xs' : 'text-[#74767e] hover:text-[#222325]'
              }`}
            >
              Inactive
            </button>
          </div>
        </div>
      </div>

      {/* Subcategories Table */}
      {isLoading ? (
        <div className="bg-white rounded-lg border border-[#e4e5e7] p-8 text-center text-xs text-[#74767e]">
          Loading subcategories...
        </div>
      ) : subcategories.length > 0 ? (
        <div className="bg-white rounded-lg border border-[#e4e5e7] overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#fafafa] border-b border-[#e4e5e7] text-[#74767e] font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3.5 px-4 w-12 text-center">Order</th>
                  <th className="py-3.5 px-4">Subcategory Name</th>
                  <th className="py-3.5 px-4">Parent Category</th>
                  <th className="py-3.5 px-4">Slug Path</th>
                  <th className="py-3.5 px-4 text-center">Calculators</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f5f5f5]">
                {subcategories.map((sub, index) => (
                  <tr key={sub.id} className="hover:bg-[#fafafa] transition-colors">
                    {/* Order column */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          disabled={index === 0}
                          onClick={() => handleMoveOrder(index, 'up')}
                          className="p-1 text-[#74767e] hover:text-[#222325] disabled:opacity-20 cursor-pointer"
                          title="Move up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={index === subcategories.length - 1}
                          onClick={() => handleMoveOrder(index, 'down')}
                          className="p-1 text-[#74767e] hover:text-[#222325] disabled:opacity-20 cursor-pointer"
                          title="Move down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                    {/* Name */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[#222325] text-sm">{sub.name}</div>
                      {sub.description && (
                        <div className="text-[11px] text-[#74767e] line-clamp-1 max-w-xs mt-0.5">
                          {sub.description}
                        </div>
                      )}
                    </td>

                    {/* Parent Category */}
                    <td className="py-3.5 px-4 font-semibold text-[#1dbf73]">
                      {sub.category?.name || 'Unassigned'}
                    </td>

                    {/* Slug */}
                    <td className="py-3.5 px-4 font-mono font-semibold text-[#62646a]">
                      <span className="text-[#dadbdd]">/{sub.category?.slug || 'cat'}/</span>
                      {sub.slug}
                    </td>

                    {/* Calculators Count */}
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-[#222325]">
                      {sub.calculatorsCount}
                    </td>

                    {/* Status Toggle */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(sub)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-bold transition-colors cursor-pointer ${
                          sub.isActive
                            ? 'bg-[#e8faf1] text-[#013a12] hover:bg-[#dcfce7]'
                            : 'bg-[#f5f5f5] text-[#74767e] hover:bg-[#e4e5e7]'
                        }`}
                        title="Click to toggle status"
                      >
                        {sub.isActive ? (
                          <>
                            <Eye className="w-3 h-3 text-[#1dbf73]" />
                            <span>Active</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3 text-[#74767e]" />
                            <span>Inactive</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {sub.isActive && sub.category && (
                          <a
                            href={`/${sub.category.slug}/${sub.slug}`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 text-[#74767e] hover:text-[#1dbf73] rounded hover:bg-[#f5f5f5] transition-colors"
                            title="View public subcategory page"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(sub)}
                          className="p-1.5 text-[#74767e] hover:text-[#222325] rounded hover:bg-[#f5f5f5] transition-colors cursor-pointer"
                          title="Edit subcategory"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget({ sub, cascadeWarning: sub.calculatorsCount > 0 })}
                          className="p-1.5 text-rose-500 hover:text-rose-700 rounded hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Delete subcategory"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <EmptyState
          icon={Layers}
          title={search ? 'No Matching Subcategories' : 'No Subcategories Created Yet'}
          description={
            search
              ? 'Try different search keywords.'
              : 'Add subcategories to organize calculators under categories.'
          }
          actionLabel="Add Subcategory"
          onAction={handleOpenCreate}
        />
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#222325]/50 backdrop-blur-xs">
          <div
            className="fixed inset-0"
            onClick={() => setIsModalOpen(false)}
            aria-hidden="true"
          />
          <div className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl border border-[#dadbdd] overflow-hidden z-10 flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-[#e4e5e7] flex items-center justify-between bg-[#fafafa]">
              <h3 className="text-sm font-bold text-[#222325]">
                {editingSub ? 'Edit Subcategory' : 'Create New Subcategory'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-[#74767e] hover:text-[#222325] p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-4 flex-1">
              {formError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-md text-xs text-rose-700 flex items-center gap-2 font-semibold">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-[#222325] mb-1">
                  Parent Category <span className="text-rose-500">*</span>
                </label>
                <select
                  required
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  className="w-full px-3 py-2 text-xs font-semibold text-[#222325] border border-[#dadbdd] rounded-md focus:border-[#1dbf73] outline-hidden bg-white"
                >
                  <option value="" disabled>Select parent category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name} (/{cat.slug})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#222325] mb-1">
                  Subcategory Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Mortgages & Loans"
                  className="w-full px-3 py-2 text-xs font-semibold text-[#222325] border border-[#dadbdd] rounded-md focus:border-[#1dbf73] outline-hidden"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-[#222325]">
                    URL Slug <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-[11px] text-[#74767e]">Lowercase, hyphens only</span>
                </div>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-xs text-[#74767e] font-mono">/</span>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => handleSlugChange(e.target.value)}
                    placeholder="mortgages-and-loans"
                    className="w-full pl-6 pr-3 py-2 text-xs font-mono font-semibold text-[#222325] border border-[#dadbdd] rounded-md focus:border-[#1dbf73] outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#222325] mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Description of this subcategory..."
                  className="w-full px-3 py-2 text-xs border border-[#dadbdd] rounded-md focus:border-[#1dbf73] outline-hidden resize-none text-[#404145]"
                />
              </div>

              <div className="pt-2 border-t border-[#f5f5f5]">
                <span className="text-xs font-bold text-[#222325] uppercase tracking-wider block mb-3">
                  SEO Metadata (Optional)
                </span>
                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[#74767e] mb-1">
                      SEO Meta Title
                    </label>
                    <input
                      type="text"
                      value={formData.seoTitle}
                      onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                      placeholder="Page title displayed in search engines"
                      className="w-full px-3 py-1.5 text-xs border border-[#dadbdd] rounded-md focus:border-[#1dbf73] outline-hidden"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-[#f5f5f5] flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs font-bold text-[#222325] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 rounded text-[#1dbf73] focus:ring-[#1dbf73] accent-[#1dbf73]"
                  />
                  <span>Publish as Active (Visible publicly)</span>
                </label>
              </div>

              <div className="pt-4 border-t border-[#e4e5e7] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#404145] hover:bg-[#f5f5f5] rounded-md transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 text-xs font-bold text-white bg-[#1dbf73] hover:bg-[#19a463] rounded-md transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : editingSub ? 'Save Changes' : 'Create Subcategory'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#222325]/50 backdrop-blur-xs">
          <div
            className="fixed inset-0"
            onClick={() => setDeleteTarget(null)}
            aria-hidden="true"
          />
          <div className="relative w-full max-w-md bg-white rounded-xl shadow-2xl border border-[#dadbdd] p-6 z-10 space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center">
              <h3 className="text-base font-bold text-[#222325]">
                Delete Subcategory "{deleteTarget.sub.name}"?
              </h3>
              {deleteTarget.cascadeWarning || deleteTarget.sub.calculatorsCount > 0 ? (
                <p className="text-xs text-rose-600 mt-2 leading-relaxed font-semibold">
                  Warning: Contains {deleteTarget.sub.calculatorsCount} calculators. Confirming will delete all associated calculators.
                </p>
              ) : (
                <p className="text-xs text-[#74767e] mt-1">
                  Are you sure you want to delete this subcategory?
                </p>
              )}
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 text-xs font-bold text-[#404145] hover:bg-[#f5f5f5] rounded-md border border-[#dadbdd] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDeleteConfirm}
                className="px-5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-md transition-colors cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
