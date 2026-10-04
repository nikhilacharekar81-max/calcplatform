import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  ArrowUp,
  ArrowDown,
  AlertTriangle,
  FolderTree,
  Eye,
  EyeOff,
  ExternalLink,
  X,
  CheckCircle2,
} from 'lucide-react';
import { api } from '../../services/api.ts';
import { Category } from '../../types/schema.ts';
import { slugify, isValidSlug } from '../../utils/slugify.ts';
import { EmptyState } from '../../components/common/EmptyState.tsx';

export const AdminCategories: React.FC = () => {
  const [categories, setCategories] = useState<Array<Category & { subcategoriesCount: number; calculatorsCount: number }>>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [isLoading, setIsLoading] = useState(true);

  // Bulk Selection and Action State
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isBulkProcessing, setIsBulkProcessing] = useState(false);
  const [bulkDeleteModalOpen, setBulkDeleteModalOpen] = useState(false);
  const [notification, setNotification] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
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

  // Delete Confirmation State
  const [deleteTarget, setDeleteTarget] = useState<{
    category: Category & { subcategoriesCount: number; calculatorsCount: number };
    cascadeWarning?: boolean;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadCategories();
  }, [search, statusFilter]);

  const showNotification = (text: string, type: 'success' | 'error' = 'success') => {
    setNotification({ text, type });
    setTimeout(() => {
      setNotification((curr) => (curr?.text === text ? null : curr));
    }, 4500);
  };

  const loadCategories = async () => {
    setIsLoading(true);
    try {
      const data = await api.adminGetCategories({
        search: search || undefined,
        status: statusFilter === 'all' ? undefined : statusFilter,
      });
      setCategories(data);
      // Clean up selection of items no longer in list
      const existingIds = new Set(data.map((c) => c.id));
      setSelectedIds((prev) => prev.filter((id) => existingIds.has(id)));
    } catch (err) {
      console.error('Failed to load admin categories:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleSelectAll = () => {
    if (selectedIds.length === categories.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(categories.map((c) => c.id));
    }
  };

  const handleToggleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleBulkStatus = async (isActive: boolean) => {
    if (selectedIds.length === 0) return;
    setIsBulkProcessing(true);
    try {
      await api.adminBulkCategoryStatus(selectedIds, isActive);
      setCategories((prev) =>
        prev.map((c) => (selectedIds.includes(c.id) ? { ...c, isActive } : c))
      );
      showNotification(
        `Successfully turned ${isActive ? 'ON' : 'OFF'} ${selectedIds.length} categories.`
      );
    } catch (err: any) {
      showNotification(err.message || 'Failed to update category status', 'error');
      loadCategories();
    } finally {
      setIsBulkProcessing(false);
    }
  };

  const handleBulkDeleteConfirm = async () => {
    if (selectedIds.length === 0) return;
    setIsBulkProcessing(true);
    try {
      const res = await api.adminBulkCategoryDelete(selectedIds);
      const count = res.count || selectedIds.length;
      setCategories((prev) => prev.filter((c) => !selectedIds.includes(c.id)));
      setSelectedIds([]);
      setBulkDeleteModalOpen(false);
      showNotification(
        `Successfully deleted ${count} categories along with all associated subcategories and calculators.`
      );
      await loadCategories();
    } catch (err: any) {
      showNotification(err.message || 'Failed to bulk delete categories', 'error');
    } finally {
      setIsBulkProcessing(false);
    }
  };

  // Selected categories metrics for cascade delete warnings
  const selectedCategories = categories.filter((c) => selectedIds.includes(c.id));
  const totalCascadeSubcategories = selectedCategories.reduce(
    (sum, c) => sum + (c.subcategoriesCount || 0),
    0
  );
  const totalCascadeCalculators = selectedCategories.reduce(
    (sum, c) => sum + (c.calculatorsCount || 0),
    0
  );

  const handleOpenCreate = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      slug: '',
      description: '',
      seoTitle: '',
      seoDescription: '',
      seoKeywords: '',
      order: categories.length + 1,
      isActive: true,
    });
    setAutoSlug(true);
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat: Category & { subcategoriesCount: number; calculatorsCount: number }) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || '',
      seoTitle: cat.seoTitle || '',
      seoDescription: cat.seoDescription || '',
      seoKeywords: cat.seoKeywords || '',
      order: cat.order || 1,
      isActive: cat.isActive,
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

    if (!formData.name.trim()) {
      setFormError('Category name is required.');
      return;
    }

    const finalSlug = slugify(formData.slug || formData.name);
    if (!isValidSlug(finalSlug)) {
      setFormError('Please enter a valid lowercase alphanumeric slug (e.g. "finance" or "construction-math").');
      return;
    }

    setIsSaving(true);
    try {
      if (editingCategory) {
        await api.adminUpdateCategory(editingCategory.id, {
          ...formData,
          slug: finalSlug,
        });
      } else {
        await api.adminCreateCategory({
          ...formData,
          slug: finalSlug,
        });
      }
      setIsModalOpen(false);
      loadCategories();
    } catch (err: any) {
      setFormError(err.message || 'Failed to save category.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleStatus = async (cat: Category) => {
    try {
      await api.adminToggleCategory(cat.id);
      loadCategories();
    } catch (err) {
      console.error('Failed to toggle status:', err);
    }
  };

  const handleMoveOrder = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= categories.length) return;

    const newOrder = [...categories];
    const temp = newOrder[index];
    newOrder[index] = newOrder[targetIndex];
    newOrder[targetIndex] = temp;

    setCategories(newOrder);

    try {
      await api.adminReorderCategories(newOrder.map((c) => c.id));
    } catch (err) {
      console.error('Failed to reorder categories:', err);
      loadCategories();
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const targetId = deleteTarget.category.id;
      await api.adminDeleteCategory(targetId, true);

      // Optimistically update local state immediately
      setCategories((prev) => prev.filter((c) => c.id !== targetId));
      setDeleteTarget(null);

      // Refresh list from server
      await loadCategories();
    } catch (err: any) {
      alert(err.message || 'Failed to delete category');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification Banner */}
      {notification && (
        <div
          className={`p-3.5 rounded-lg text-xs font-bold flex items-center justify-between border shadow-xs animate-fadeIn ${
            notification.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          <div className="flex items-center gap-2">
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-[#1dbf73] shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{notification.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setNotification(null)}
            className="p-1 hover:opacity-75 cursor-pointer text-[#74767e]"
            title="Dismiss"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#e4e5e7]">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#222325] tracking-tight">
            Category Management
          </h1>
          <p className="text-xs sm:text-sm text-[#74767e] mt-1">
            Organize parent categories and configure SEO metadata
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-white bg-[#1dbf73] hover:bg-[#19a463] rounded-md transition-colors cursor-pointer shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Category</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-lg border border-[#e4e5e7]">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-[#74767e] absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search categories..."
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-[#dadbdd] rounded-md outline-hidden focus:border-[#1dbf73]"
          />
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <span className="text-xs font-semibold text-[#74767e]">Status:</span>
          <div className="flex items-center p-0.5 bg-[#f5f5f5] rounded-md text-xs">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1 rounded font-bold transition-colors cursor-pointer ${
                statusFilter === 'all' ? 'bg-white text-[#222325] shadow-xs' : 'text-[#74767e] hover:text-[#222325]'
              }`}
            >
              All ({categories.length})
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

      {/* Bulk Action Toolbar */}
      {selectedIds.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-slate-900 text-white rounded-lg shadow-md border border-slate-800 animate-fadeIn">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#1dbf73] animate-pulse" />
              <span className="text-xs font-bold text-white">
                {selectedIds.length} of {categories.length} selected
              </span>
            </div>
            <div className="h-4 w-[1px] bg-slate-700 hidden sm:block" />
            <button
              type="button"
              onClick={handleToggleSelectAll}
              className="text-xs text-slate-300 hover:text-white underline cursor-pointer"
            >
              {selectedIds.length === categories.length ? 'Deselect All' : `Select All (${categories.length})`}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={isBulkProcessing}
              onClick={() => handleBulkStatus(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-[#1dbf73] hover:bg-[#19a463] rounded-md transition-colors cursor-pointer disabled:opacity-50 shadow-xs"
              title="Turn ON (Activate) selected categories"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Turn ON</span>
            </button>

            <button
              type="button"
              disabled={isBulkProcessing}
              onClick={() => handleBulkStatus(false)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md transition-colors cursor-pointer disabled:opacity-50 shadow-xs"
              title="Turn OFF (Deactivate) selected categories"
            >
              <EyeOff className="w-3.5 h-3.5" />
              <span>Turn OFF</span>
            </button>

            <button
              type="button"
              disabled={isBulkProcessing}
              onClick={() => setBulkDeleteModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-md transition-colors cursor-pointer disabled:opacity-50 shadow-xs"
              title="Bulk delete selected categories"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Bulk Delete ({selectedIds.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedIds([])}
              className="p-1.5 text-slate-400 hover:text-white rounded transition-colors cursor-pointer"
              title="Clear selection"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Categories Table */}
      {isLoading ? (
        <div className="bg-white rounded-lg border border-[#e4e5e7] p-8 text-center text-xs text-[#74767e]">
          Loading categories...
        </div>
      ) : categories.length > 0 ? (
        <div className="bg-white rounded-lg border border-[#e4e5e7] overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#fafafa] border-b border-[#e4e5e7] text-[#74767e] font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3.5 px-3 w-10 text-center">
                    <input
                      type="checkbox"
                      checked={categories.length > 0 && selectedIds.length === categories.length}
                      ref={(el) => {
                        if (el) {
                          el.indeterminate = selectedIds.length > 0 && selectedIds.length < categories.length;
                        }
                      }}
                      onChange={handleToggleSelectAll}
                      className="w-4 h-4 rounded border-[#dadbdd] text-[#1dbf73] focus:ring-[#1dbf73] cursor-pointer accent-[#1dbf73]"
                      title="Select / Deselect all"
                    />
                  </th>
                  <th className="py-3.5 px-4 w-12 text-center">Order</th>
                  <th className="py-3.5 px-4">Category Name</th>
                  <th className="py-3.5 px-4">Slug / Path</th>
                  <th className="py-3.5 px-4 text-center">Subcategories</th>
                  <th className="py-3.5 px-4 text-center">Calculators</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f5f5f5]">
                {categories.map((cat, index) => {
                  const isSelected = selectedIds.includes(cat.id);
                  return (
                    <tr
                      key={cat.id}
                      className={`transition-colors ${
                        isSelected ? 'bg-emerald-50/50 hover:bg-emerald-50/70' : 'hover:bg-[#fafafa]'
                      }`}
                    >
                      {/* Checkbox column */}
                      <td className="py-3.5 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelectOne(cat.id)}
                          className="w-4 h-4 rounded border-[#dadbdd] text-[#1dbf73] focus:ring-[#1dbf73] cursor-pointer accent-[#1dbf73]"
                        />
                      </td>

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
                            disabled={index === categories.length - 1}
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
                        <div className="font-bold text-[#222325] text-sm">{cat.name}</div>
                        {cat.description && (
                          <div className="text-[11px] text-[#74767e] line-clamp-1 max-w-xs mt-0.5">
                            {cat.description}
                          </div>
                        )}
                      </td>

                      {/* Slug */}
                      <td className="py-3.5 px-4 font-mono font-semibold text-[#62646a]">
                        <span className="text-[#dadbdd]">/</span>
                        {cat.slug}
                      </td>

                      {/* Subcategories count */}
                      <td className="py-3.5 px-4 text-center font-mono font-bold text-[#222325]">
                        {cat.subcategoriesCount}
                      </td>

                      {/* Calculators count */}
                      <td className="py-3.5 px-4 text-center font-mono font-bold text-[#222325]">
                        {cat.calculatorsCount}
                      </td>

                      {/* Status toggle */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(cat)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-bold transition-colors cursor-pointer ${
                            cat.isActive
                              ? 'bg-[#e8faf1] text-[#013a12] hover:bg-[#dcfce7]'
                              : 'bg-[#f5f5f5] text-[#74767e] hover:bg-[#e4e5e7]'
                          }`}
                          title="Click to toggle status (On / Off)"
                        >
                          {cat.isActive ? (
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
                        {cat.isActive && (
                          <a
                            href={`/${cat.slug}`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 text-[#74767e] hover:text-[#1dbf73] rounded hover:bg-[#f5f5f5] transition-colors"
                            title="View public category page"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(cat)}
                          className="p-1.5 text-[#74767e] hover:text-[#222325] rounded hover:bg-[#f5f5f5] transition-colors cursor-pointer"
                          title="Edit category"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget({ category: cat, cascadeWarning: cat.subcategoriesCount > 0 || cat.calculatorsCount > 0 })}
                          className="p-1.5 text-rose-500 hover:text-rose-700 rounded hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Delete category"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            </table>
          </div>
        </div>
      ) : (
        <EmptyState
          icon={FolderTree}
          title={search ? 'No Matching Categories' : 'No Categories Created Yet'}
          description={
            search
              ? 'Try different search keywords.'
              : 'Add your first category to start organizing calculators.'
          }
          actionLabel="Add Category"
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
                {editingCategory ? 'Edit Category' : 'Create New Category'}
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
                  Category Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Financial Calculators"
                  className="w-full px-3 py-2 text-xs border border-[#dadbdd] rounded-md focus:border-[#1dbf73] focus:ring-2 focus:ring-[#1dbf73]/20 outline-hidden font-semibold text-[#222325]"
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
                    placeholder="financial-calculators"
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
                  placeholder="Brief summary of calculators in this category..."
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

                  <div>
                    <label className="block text-[11px] font-bold text-[#74767e] mb-1">
                      SEO Meta Description
                    </label>
                    <textarea
                      rows={2}
                      value={formData.seoDescription}
                      onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                      placeholder="Meta description for search engine snippets"
                      className="w-full px-3 py-1.5 text-xs border border-[#dadbdd] rounded-md focus:border-[#1dbf73] outline-hidden resize-none"
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
                  {isSaving ? 'Saving...' : editingCategory ? 'Save Changes' : 'Create Category'}
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
                Delete Category "{deleteTarget.category.name}"?
              </h3>
              {deleteTarget.cascadeWarning || deleteTarget.category.subcategoriesCount > 0 ? (
                <p className="text-xs text-rose-600 mt-2 leading-relaxed font-semibold">
                  Warning: Contains {deleteTarget.category.subcategoriesCount} subcategories and {deleteTarget.category.calculatorsCount} calculators. Confirming will remove all nested records.
                </p>
              ) : (
                <p className="text-xs text-[#74767e] mt-1">
                  Are you sure you want to permanently delete this category?
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

      {/* Bulk Delete Confirmation Modal */}
      {bulkDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#222325]/50 backdrop-blur-xs">
          <div
            className="fixed inset-0"
            onClick={() => !isBulkProcessing && setBulkDeleteModalOpen(false)}
            aria-hidden="true"
          />
          <div className="relative w-full max-w-md bg-white rounded-xl shadow-2xl border border-[#dadbdd] p-6 z-10 space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center">
              <h3 className="text-base font-bold text-[#222325]">
                Delete {selectedIds.length} Selected Categories?
              </h3>
              <p className="text-xs text-[#74767e] mt-1">
                This action is permanent and cannot be undone.
              </p>

              <div className="mt-4 p-3 bg-rose-50/70 border border-rose-200/80 rounded-lg text-left text-xs space-y-2">
                <div className="font-bold text-rose-800 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>Cascade Impact Warning:</span>
                </div>
                <div className="text-[#404145] space-y-1 pl-1">
                  <div>
                    • <span className="font-bold text-[#222325]">{selectedIds.length}</span> parent categories will be removed.
                  </div>
                  <div>
                    • <span className="font-bold text-rose-700">{totalCascadeSubcategories}</span> nested subcategories will be cascade deleted.
                  </div>
                  <div>
                    • <span className="font-bold text-rose-700">{totalCascadeCalculators}</span> nested calculators will be cascade deleted.
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                disabled={isBulkProcessing}
                onClick={() => setBulkDeleteModalOpen(false)}
                className="px-4 py-2 text-xs font-bold text-[#404145] hover:bg-[#f5f5f5] rounded-md border border-[#dadbdd] transition-colors cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isBulkProcessing}
                onClick={handleBulkDeleteConfirm}
                className="px-5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-md transition-colors cursor-pointer disabled:opacity-50"
              >
                {isBulkProcessing ? 'Deleting...' : `Confirm Delete (${selectedIds.length})`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
