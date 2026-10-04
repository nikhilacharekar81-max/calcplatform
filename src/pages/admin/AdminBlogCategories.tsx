import React, { useState, useEffect } from 'react';
import {
  FolderTree,
  Layers,
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  FileText,
  AlertCircle,
  X,
  ArrowRight,
} from 'lucide-react';
import { BlogCategory, BlogSubcategory } from '../../types/schema.ts';
import { api } from '../../services/api.ts';

export const AdminBlogCategories: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'categories' | 'subcategories'>('categories');
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [subcategories, setSubcategories] = useState<Array<BlogSubcategory & { categoryName?: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Modal State for Categories
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<BlogCategory | null>(null);
  const [catName, setCatName] = useState('');
  const [catSlug, setCatSlug] = useState('');
  const [catDescription, setCatDescription] = useState('');
  const [catOrder, setCatOrder] = useState<number>(1);
  const [catIsActive, setCatIsActive] = useState<boolean>(true);

  // Modal State for Subcategories
  const [subcategoryModalOpen, setSubcategoryModalOpen] = useState(false);
  const [editingSubcategory, setEditingSubcategory] = useState<BlogSubcategory | null>(null);
  const [subParentId, setSubParentId] = useState('');
  const [subName, setSubName] = useState('');
  const [subSlug, setSubSlug] = useState('');
  const [subDescription, setSubDescription] = useState('');
  const [subOrder, setSubOrder] = useState<number>(1);
  const [subIsActive, setSubIsActive] = useState<boolean>(true);

  const [saving, setSaving] = useState(false);
  const [deleteCatConfirmId, setDeleteCatConfirmId] = useState<string | null>(null);
  const [deleteSubConfirmId, setDeleteSubConfirmId] = useState<string | null>(null);
  const [selectedCatIds, setSelectedCatIds] = useState<string[]>([]);
  const [selectedSubIds, setSelectedSubIds] = useState<string[]>([]);
  const [bulkCatConfirmDelete, setBulkCatConfirmDelete] = useState(false);
  const [bulkSubConfirmDelete, setBulkSubConfirmDelete] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const [cats, subs] = await Promise.all([
        api.adminGetBlogCategories(),
        api.adminGetBlogSubcategories(),
      ]);
      setCategories(cats);
      setSubcategories(subs);
      setSelectedCatIds([]);
      setSelectedSubIds([]);
      setBulkCatConfirmDelete(false);
      setBulkSubConfirmDelete(false);
    } catch (err: any) {
      setError(err.message || 'Failed to load blog categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    setSelectedCatIds([]);
    setSelectedSubIds([]);
    setBulkCatConfirmDelete(false);
    setBulkSubConfirmDelete(false);
  }, [activeTab]);

  const showNotification = (msg: string, isError = false) => {
    if (isError) {
      setError(msg);
      setSuccess('');
    } else {
      setSuccess(msg);
      setError('');
    }
    setTimeout(() => {
      setError('');
      setSuccess('');
    }, 4000);
  };

  // Helper for slug clean
  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  // CATEGORIES ACTIONS
  const handleOpenCategoryModal = (cat: BlogCategory | null = null) => {
    if (cat) {
      setEditingCategory(cat);
      setCatName(cat.name);
      setCatSlug(cat.slug);
      setCatDescription(cat.description || '');
      setCatOrder(cat.order || categories.length + 1);
      setCatIsActive(cat.isActive !== false);
    } else {
      setEditingCategory(null);
      setCatName('');
      setCatSlug('');
      setCatDescription('');
      setCatOrder(categories.length + 1);
      setCatIsActive(true);
    }
    setCategoryModalOpen(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim()) {
      showNotification('Category name is required', true);
      return;
    }

    try {
      setSaving(true);
      const payload = {
        name: catName.trim(),
        slug: catSlug.trim() || generateSlug(catName),
        description: catDescription.trim(),
        order: Number(catOrder),
        isActive: catIsActive,
      };

      if (editingCategory) {
        await api.adminUpdateBlogCategory(editingCategory.id, payload);
        showNotification('Blog category updated successfully!');
      } else {
        await api.adminCreateBlogCategory(payload);
        showNotification('Blog category created successfully!');
      }

      setCategoryModalOpen(false);
      loadData();
    } catch (err: any) {
      showNotification(err.message || 'Error saving category', true);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCategory = async (cat: BlogCategory) => {
    try {
      await api.adminDeleteBlogCategory(cat.id);
      showNotification('Blog category deleted successfully');
      setDeleteCatConfirmId(null);
      loadData();
    } catch (err: any) {
      showNotification(err.message || 'Error deleting category', true);
    }
  };

  const handleToggleCategoryStatus = async (cat: BlogCategory) => {
    try {
      await api.adminUpdateBlogCategory(cat.id, { isActive: !cat.isActive });
      showNotification(`Category "${cat.name}" is now ${!cat.isActive ? 'Active' : 'Inactive'}`);
      loadData();
    } catch (err: any) {
      showNotification(err.message || 'Error updating status', true);
    }
  };

  const handleMoveCategory = async (cat: BlogCategory, direction: 'up' | 'down') => {
    try {
      const sortedCats = [...categories].sort((a, b) => (a.order || 0) - (b.order || 0));
      const index = sortedCats.findIndex((c) => c.id === cat.id);
      if (index === -1) return;

      if (direction === 'up' && index > 0) {
        const targetCat = sortedCats[index - 1];
        const currentOrder = cat.order || 1;
        const targetOrder = targetCat.order || 1;
        
        // Swap orders
        await Promise.all([
          api.adminUpdateBlogCategory(cat.id, { order: targetOrder }),
          api.adminUpdateBlogCategory(targetCat.id, { order: currentOrder }),
        ]);
        showNotification(`Category "${cat.name}" moved up`);
        loadData();
      } else if (direction === 'down' && index < sortedCats.length - 1) {
        const targetCat = sortedCats[index + 1];
        const currentOrder = cat.order || 1;
        const targetOrder = targetCat.order || 1;

        // Swap orders
        await Promise.all([
          api.adminUpdateBlogCategory(cat.id, { order: targetOrder }),
          api.adminUpdateBlogCategory(targetCat.id, { order: currentOrder }),
        ]);
        showNotification(`Category "${cat.name}" moved down`);
        loadData();
      }
    } catch (err: any) {
      showNotification(err.message || 'Error reordering category', true);
    }
  };

  const handleMoveSubcategory = async (sub: BlogSubcategory, direction: 'up' | 'down') => {
    try {
      const sameParentSubs = subcategories
        .filter((s) => s.blogCategoryId === sub.blogCategoryId)
        .sort((a, b) => (a.order || 0) - (b.order || 0));
      
      const index = sameParentSubs.findIndex((s) => s.id === sub.id);
      if (index === -1) return;

      if (direction === 'up' && index > 0) {
        const targetSub = sameParentSubs[index - 1];
        const currentOrder = sub.order || 1;
        const targetOrder = targetSub.order || 1;

        await Promise.all([
          api.adminUpdateBlogSubcategory(sub.id, { order: targetOrder }),
          api.adminUpdateBlogSubcategory(targetSub.id, { order: currentOrder }),
        ]);
        showNotification(`Subcategory "${sub.name}" moved up`);
        loadData();
      } else if (direction === 'down' && index < sameParentSubs.length - 1) {
        const targetSub = sameParentSubs[index + 1];
        const currentOrder = sub.order || 1;
        const targetOrder = targetSub.order || 1;

        await Promise.all([
          api.adminUpdateBlogSubcategory(sub.id, { order: targetOrder }),
          api.adminUpdateBlogSubcategory(targetSub.id, { order: currentOrder }),
        ]);
        showNotification(`Subcategory "${sub.name}" moved down`);
        loadData();
      }
    } catch (err: any) {
      showNotification(err.message || 'Error reordering subcategory', true);
    }
  };

  const handleBulkCategoryStatusToggle = async (isActive: boolean) => {
    if (selectedCatIds.length === 0) return;
    try {
      setLoading(true);
      await api.adminBulkBlogCategoryStatus(selectedCatIds, isActive);
      showNotification(`Successfully updated status for ${selectedCatIds.length} categories`);
      loadData();
    } catch (err: any) {
      showNotification(err.message || 'Error updating bulk status', true);
    } finally {
      setLoading(false);
    }
  };

  const handleBulkCategoryDelete = async () => {
    if (selectedCatIds.length === 0) return;
    try {
      setLoading(true);
      await api.adminBulkBlogCategoryDelete(selectedCatIds);
      showNotification(`Successfully deleted ${selectedCatIds.length} categories and their subcategories`);
      loadData();
    } catch (err: any) {
      showNotification(err.message || 'Error deleting categories', true);
    } finally {
      setLoading(false);
    }
  };

  const handleBulkSubcategoryStatusToggle = async (isActive: boolean) => {
    if (selectedSubIds.length === 0) return;
    try {
      setLoading(true);
      await api.adminBulkBlogSubcategoryStatus(selectedSubIds, isActive);
      showNotification(`Successfully updated status for ${selectedSubIds.length} subcategories`);
      loadData();
    } catch (err: any) {
      showNotification(err.message || 'Error updating bulk status', true);
    } finally {
      setLoading(false);
    }
  };

  const handleBulkSubcategoryDelete = async () => {
    if (selectedSubIds.length === 0) return;
    try {
      setLoading(true);
      await api.adminBulkBlogSubcategoryDelete(selectedSubIds);
      showNotification(`Successfully deleted ${selectedSubIds.length} subcategories`);
      loadData();
    } catch (err: any) {
      showNotification(err.message || 'Error deleting subcategories', true);
    } finally {
      setLoading(false);
    }
  };

  // SUBCATEGORIES ACTIONS
  const handleOpenSubcategoryModal = (sub: BlogSubcategory | null = null, defaultParentId?: string) => {
    if (sub) {
      setEditingSubcategory(sub);
      setSubParentId(sub.blogCategoryId);
      setSubName(sub.name);
      setSubSlug(sub.slug);
      setSubDescription(sub.description || '');
      setSubOrder(sub.order || 1);
      setSubIsActive(sub.isActive !== false);
    } else {
      setEditingSubcategory(null);
      setSubParentId(defaultParentId || (categories[0]?.id || ''));
      setSubName('');
      setSubSlug('');
      setSubDescription('');
      setSubOrder(subcategories.length + 1);
      setSubIsActive(true);
    }
    setSubcategoryModalOpen(true);
  };

  const handleSaveSubcategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subParentId) {
      showNotification('Please select a parent blog category', true);
      return;
    }
    if (!subName.trim()) {
      showNotification('Subcategory name is required', true);
      return;
    }

    try {
      setSaving(true);
      const payload = {
        blogCategoryId: subParentId,
        name: subName.trim(),
        slug: subSlug.trim() || generateSlug(subName),
        description: subDescription.trim(),
        order: Number(subOrder),
        isActive: subIsActive,
      };

      if (editingSubcategory) {
        await api.adminUpdateBlogSubcategory(editingSubcategory.id, payload);
        showNotification('Blog subcategory updated successfully!');
      } else {
        await api.adminCreateBlogSubcategory(payload);
        showNotification('Blog subcategory created successfully!');
      }

      setSubcategoryModalOpen(false);
      loadData();
    } catch (err: any) {
      showNotification(err.message || 'Error saving subcategory', true);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSubcategory = async (sub: BlogSubcategory) => {
    try {
      await api.adminDeleteBlogSubcategory(sub.id);
      showNotification('Blog subcategory deleted successfully');
      setDeleteSubConfirmId(null);
      loadData();
    } catch (err: any) {
      showNotification(err.message || 'Error deleting subcategory', true);
    }
  };

  const handleToggleSubcategoryStatus = async (sub: BlogSubcategory) => {
    try {
      await api.adminUpdateBlogSubcategory(sub.id, { isActive: !sub.isActive });
      showNotification(`Subcategory "${sub.name}" is now ${!sub.isActive ? 'Active' : 'Inactive'}`);
      loadData();
    } catch (err: any) {
      showNotification(err.message || 'Error updating status', true);
    }
  };

  // Filtered lists
  const filteredCategories = (categories || []).filter(
    (c) =>
      c &&
      (c.name || '').toLowerCase().includes((searchQuery || '').toLowerCase()) ||
      (c.slug || '').toLowerCase().includes((searchQuery || '').toLowerCase()) ||
      (c.description || '').toLowerCase().includes((searchQuery || '').toLowerCase())
  );

  const filteredSubcategories = (subcategories || []).filter((s) => {
    if (!s) return false;
    const matchesSearch =
      (s.name || '').toLowerCase().includes((searchQuery || '').toLowerCase()) ||
      (s.slug || '').toLowerCase().includes((searchQuery || '').toLowerCase()) ||
      (s.categoryName || '').toLowerCase().includes((searchQuery || '').toLowerCase());
    const matchesCat = categoryFilter === 'all' || s.blogCategoryId === categoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#1dbf73] uppercase tracking-wider">
            <FolderTree className="w-4 h-4" />
            <span>Blog CMS &bull; Taxonomy Structure</span>
          </div>
          <h1 className="text-2xl font-black text-[#222325] mt-1">Blog Categories &amp; Subcategories</h1>
          <p className="text-xs text-[#74767e]">
            Manage blog topic categories, sub-topics, and article classification hierarchy.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {activeTab === 'categories' ? (
            <button
              type="button"
              onClick={() => handleOpenCategoryModal(null)}
              className="px-5 py-2.5 rounded-xl bg-[#1dbf73] hover:bg-[#19a463] text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Blog Category</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => handleOpenSubcategoryModal(null)}
              className="px-5 py-2.5 rounded-xl bg-[#1dbf73] hover:bg-[#19a463] text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Blog Subcategory</span>
            </button>
          )}
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
          <button type="button" onClick={() => setError('')} className="p-1 hover:bg-rose-100 rounded-md">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {success && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{success}</span>
          </div>
          <button type="button" onClick={() => setSuccess('')} className="p-1 hover:bg-emerald-100 rounded-md">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Navigation Tabs & Search Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Tabs */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <button
            type="button"
            onClick={() => setActiveTab('categories')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'categories'
                ? 'bg-[#222325] text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <FolderTree className="w-4 h-4" />
            <span>Blog Categories ({categories.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('subcategories')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'subcategories'
                ? 'bg-[#222325] text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Blog Subcategories ({subcategories.length})</span>
          </button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          {activeTab === 'subcategories' && (
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 text-xs font-semibold border border-slate-200 rounded-xl bg-slate-50 text-[#222325] focus:outline-none focus:border-[#1dbf73]"
            >
              <option value="all">All Parent Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          )}

          <div className="relative w-full md:w-64">
            <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:border-[#1dbf73]"
            />
          </div>
        </div>
      </div>

      {/* Category Bulk Action Bar */}
      {activeTab === 'categories' && selectedCatIds.length > 0 && (
        <div className="bg-[#f4fdf8] border border-emerald-200 p-4 rounded-2xl shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-in slide-in-from-top-3 duration-150">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={selectedCatIds.length === filteredCategories.length}
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedCatIds(filteredCategories.map((c) => c.id));
                } else {
                  setSelectedCatIds([]);
                }
              }}
              className="w-4 h-4 text-[#1dbf73] border-slate-300 rounded focus:ring-[#1dbf73] cursor-pointer"
            />
            <span className="text-xs font-extrabold text-[#222325]">
              Selected {selectedCatIds.length} of {filteredCategories.length} categories
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {bulkCatConfirmDelete ? (
              <div className="flex items-center gap-1.5 bg-rose-50 p-1.5 rounded-xl border border-rose-200">
                <span className="text-[11px] font-bold text-rose-800 px-2">
                  Are you absolutely sure? All subcategories will also be deleted.
                </span>
                <button
                  type="button"
                  onClick={() => {
                    handleBulkCategoryDelete();
                    setBulkCatConfirmDelete(false);
                  }}
                  className="px-3 py-1.5 text-xs font-black bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition-all cursor-pointer shadow-xs"
                >
                  Yes, Delete All
                </button>
                <button
                  type="button"
                  onClick={() => setBulkCatConfirmDelete(false)}
                  className="px-3 py-1.5 text-xs font-bold bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-all cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => handleBulkCategoryStatusToggle(true)}
                  className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Turn On (Active)</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleBulkCategoryStatusToggle(false)}
                  className="px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <XCircle className="w-3.5 h-3.5 text-slate-400" />
                  <span>Turn Off (Inactive)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setBulkCatConfirmDelete(true)}
                  className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                  <span>Delete Selected</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedCatIds([])}
                  className="px-3 py-2 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-all cursor-pointer"
                >
                  Deselect All
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Subcategory Bulk Action Bar */}
      {activeTab === 'subcategories' && selectedSubIds.length > 0 && (
        <div className="bg-[#f4fdf8] border border-emerald-200 p-4 rounded-2xl shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-in slide-in-from-top-3 duration-150">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={selectedSubIds.length === filteredSubcategories.length}
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedSubIds(filteredSubcategories.map((s) => s.id));
                } else {
                  setSelectedSubIds([]);
                }
              }}
              className="w-4 h-4 text-[#1dbf73] border-slate-300 rounded focus:ring-[#1dbf73] cursor-pointer"
            />
            <span className="text-xs font-extrabold text-[#222325]">
              Selected {selectedSubIds.length} of {filteredSubcategories.length} subcategories
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {bulkSubConfirmDelete ? (
              <div className="flex items-center gap-1.5 bg-rose-50 p-1.5 rounded-xl border border-rose-200">
                <span className="text-[11px] font-bold text-rose-800 px-2">
                  Are you absolutely sure you want to bulk delete {selectedSubIds.length} subcategories?
                </span>
                <button
                  type="button"
                  onClick={() => {
                    handleBulkSubcategoryDelete();
                    setBulkSubConfirmDelete(false);
                  }}
                  className="px-3 py-1.5 text-xs font-black bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition-all cursor-pointer shadow-xs"
                >
                  Yes, Delete Selected
                </button>
                <button
                  type="button"
                  onClick={() => setBulkSubConfirmDelete(false)}
                  className="px-3 py-1.5 text-xs font-bold bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-all cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => handleBulkSubcategoryStatusToggle(true)}
                  className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Turn On (Active)</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleBulkSubcategoryStatusToggle(false)}
                  className="px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <XCircle className="w-3.5 h-3.5 text-slate-400" />
                  <span>Turn Off (Inactive)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setBulkSubConfirmDelete(true)}
                  className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                  <span>Delete Selected</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedSubIds([])}
                  className="px-3 py-2 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-all cursor-pointer"
                >
                  Deselect All
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Loading state */}
      {loading ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-400 text-xs font-semibold">
          Loading blog categories and subcategories...
        </div>
      ) : activeTab === 'categories' ? (
        /* BLOG CATEGORIES TAB */
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          {filteredCategories.length === 0 ? (
            <div className="p-12 text-center text-slate-500 text-xs space-y-3">
              <FolderTree className="w-8 h-8 text-slate-300 mx-auto" />
              <div className="font-bold text-slate-700">No Blog Categories Found</div>
              <p>Create your first blog category to organize articles and CMS guides.</p>
              <button
                type="button"
                onClick={() => handleOpenCategoryModal(null)}
                className="px-4 py-2 bg-[#1dbf73] text-white font-bold rounded-xl text-xs hover:bg-[#19a463] cursor-pointer"
              >
                Create Category
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                    <th className="p-4 w-12 text-center">
                      <input
                        type="checkbox"
                        checked={filteredCategories.length > 0 && selectedCatIds.length === filteredCategories.length}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedCatIds(filteredCategories.map((c) => c.id));
                          } else {
                            setSelectedCatIds([]);
                          }
                        }}
                        className="w-4 h-4 text-[#1dbf73] border-slate-300 rounded focus:ring-[#1dbf73] cursor-pointer"
                      />
                    </th>
                    <th className="p-4">Order</th>
                    <th className="p-4">Category Name</th>
                    <th className="p-4">Slug</th>
                    <th className="p-4 text-center">Subcategories</th>
                    <th className="p-4 text-center">Posts Count</th>
                    <th className="p-4 text-center">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredCategories.map((cat) => (
                    <tr key={cat.id} className={`hover:bg-slate-50/60 transition-colors ${selectedCatIds.includes(cat.id) ? 'bg-[#1dbf73]/5 hover:bg-[#1dbf73]/10' : ''}`}>
                      <td className="p-4 text-center">
                        <input
                          type="checkbox"
                          checked={selectedCatIds.includes(cat.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedCatIds((prev) => [...prev, cat.id]);
                            } else {
                              setSelectedCatIds((prev) => prev.filter((id) => id !== cat.id));
                            }
                          }}
                          className="w-4 h-4 text-[#1dbf73] border-slate-300 rounded focus:ring-[#1dbf73] cursor-pointer"
                        />
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="flex flex-col gap-0.5">
                            <button
                              type="button"
                              onClick={() => handleMoveCategory(cat, 'up')}
                              className="p-0.5 hover:bg-slate-100 text-slate-400 hover:text-[#1dbf73] rounded text-[9px] font-bold cursor-pointer transition-all leading-none"
                              title="Move Up"
                            >
                              ▲
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMoveCategory(cat, 'down')}
                              className="p-0.5 hover:bg-slate-100 text-slate-400 hover:text-[#1dbf73] rounded text-[9px] font-bold cursor-pointer transition-all leading-none"
                              title="Move Down"
                            >
                              ▼
                            </button>
                          </div>
                          <span className="font-mono font-bold text-slate-500">{cat.order || 1}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-[#222325]">{cat.name}</div>
                        {cat.description && (
                          <div className="text-[11px] text-slate-400 line-clamp-1">{cat.description}</div>
                        )}
                      </td>
                      <td className="p-4 font-mono text-slate-600 bg-slate-50/50 rounded-lg py-1">{cat.slug}</td>
                      <td className="p-4 text-center">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-bold text-[11px]">
                          <Layers className="w-3 h-3 text-slate-500" />
                          {cat.subcategoriesCount || 0}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 font-bold text-[11px] border border-emerald-200">
                          <FileText className="w-3 h-3 text-emerald-600" />
                          {cat.postCount || 0}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleCategoryStatus(cat)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold cursor-pointer transition-all ${
                            cat.isActive !== false
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                          }`}
                        >
                          {cat.isActive !== false ? (
                            <>
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              Active
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3 h-3 text-slate-400" />
                              Inactive
                            </>
                          )}
                        </button>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenSubcategoryModal(null, cat.id)}
                            title="Add Subcategory to this Category"
                            className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Plus className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleOpenCategoryModal(cat)}
                            title="Edit Category"
                            className="p-1.5 text-slate-500 hover:text-[#222325] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          {deleteCatConfirmId === cat.id ? (
                            <div className="inline-flex items-center gap-1 bg-rose-50/50 p-1 rounded-lg border border-rose-100">
                              <button
                                type="button"
                                onClick={() => handleDeleteCategory(cat)}
                                className="px-2 py-1 text-[10px] font-extrabold bg-rose-600 hover:bg-rose-700 text-white rounded-md transition-all cursor-pointer"
                              >
                                Confirm
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeleteCatConfirmId(null)}
                                className="px-2 py-1 text-[10px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-md transition-all cursor-pointer"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setDeleteCatConfirmId(cat.id)}
                              title="Delete Category"
                              className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        /* BLOG SUBCATEGORIES TAB */
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          {filteredSubcategories.length === 0 ? (
            <div className="p-12 text-center text-slate-500 text-xs space-y-3">
              <Layers className="w-8 h-8 text-slate-300 mx-auto" />
              <div className="font-bold text-slate-700">No Blog Subcategories Found</div>
              <p>Create blog subcategories under your parent categories for granular topic navigation.</p>
              <button
                type="button"
                onClick={() => handleOpenSubcategoryModal(null)}
                className="px-4 py-2 bg-[#1dbf73] text-white font-bold rounded-xl text-xs hover:bg-[#19a463] cursor-pointer"
              >
                Create Subcategory
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                    <th className="p-4 w-12 text-center">
                      <input
                        type="checkbox"
                        checked={filteredSubcategories.length > 0 && selectedSubIds.length === filteredSubcategories.length}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedSubIds(filteredSubcategories.map((s) => s.id));
                          } else {
                            setSelectedSubIds([]);
                          }
                        }}
                        className="w-4 h-4 text-[#1dbf73] border-slate-300 rounded focus:ring-[#1dbf73] cursor-pointer"
                      />
                    </th>
                    <th className="p-4">Order</th>
                    <th className="p-4">Subcategory Name</th>
                    <th className="p-4">Parent Category</th>
                    <th className="p-4">Slug</th>
                    <th className="p-4 text-center">Posts Count</th>
                    <th className="p-4 text-center">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredSubcategories.map((sub) => (
                    <tr key={sub.id} className={`hover:bg-slate-50/60 transition-colors ${selectedSubIds.includes(sub.id) ? 'bg-[#1dbf73]/5 hover:bg-[#1dbf73]/10' : ''}`}>
                      <td className="p-4 text-center">
                        <input
                          type="checkbox"
                          checked={selectedSubIds.includes(sub.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedSubIds((prev) => [...prev, sub.id]);
                            } else {
                              setSelectedSubIds((prev) => prev.filter((id) => id !== sub.id));
                            }
                          }}
                          className="w-4 h-4 text-[#1dbf73] border-slate-300 rounded focus:ring-[#1dbf73] cursor-pointer"
                        />
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="flex flex-col gap-0.5">
                            <button
                              type="button"
                              onClick={() => handleMoveSubcategory(sub, 'up')}
                              className="p-0.5 hover:bg-slate-100 text-slate-400 hover:text-[#1dbf73] rounded text-[9px] font-bold cursor-pointer transition-all leading-none"
                              title="Move Up"
                            >
                              ▲
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMoveSubcategory(sub, 'down')}
                              className="p-0.5 hover:bg-slate-100 text-slate-400 hover:text-[#1dbf73] rounded text-[9px] font-bold cursor-pointer transition-all leading-none"
                              title="Move Down"
                            >
                              ▼
                            </button>
                          </div>
                          <span className="font-mono font-bold text-slate-500">{sub.order || 1}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-[#222325]">{sub.name}</div>
                        {sub.description && (
                          <div className="text-[11px] text-slate-400 line-clamp-1">{sub.description}</div>
                        )}
                      </td>
                      <td className="p-4 font-semibold text-slate-700">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 text-[11px]">
                          <FolderTree className="w-3 h-3 text-[#1dbf73]" />
                          {sub.categoryName}
                        </span>
                      </td>
                      <td className="p-4 font-mono text-slate-600 bg-slate-50/50 rounded-lg py-1">{sub.slug}</td>
                      <td className="p-4 text-center">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 font-bold text-[11px] border border-emerald-200">
                          <FileText className="w-3 h-3 text-emerald-600" />
                          {sub.postCount || 0}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleSubcategoryStatus(sub)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold cursor-pointer transition-all ${
                            sub.isActive !== false
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                          }`}
                        >
                          {sub.isActive !== false ? (
                            <>
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              Active
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3 h-3 text-slate-400" />
                              Inactive
                            </>
                          )}
                        </button>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenSubcategoryModal(sub)}
                            title="Edit Subcategory"
                            className="p-1.5 text-slate-500 hover:text-[#222325] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          {deleteSubConfirmId === sub.id ? (
                            <div className="inline-flex items-center gap-1 bg-rose-50/50 p-1 rounded-lg border border-rose-100">
                              <button
                                type="button"
                                onClick={() => handleDeleteSubcategory(sub)}
                                className="px-2 py-1 text-[10px] font-extrabold bg-rose-600 hover:bg-rose-700 text-white rounded-md transition-all cursor-pointer"
                              >
                                Confirm
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeleteSubConfirmId(null)}
                                className="px-2 py-1 text-[10px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-md transition-all cursor-pointer"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setDeleteSubConfirmId(sub.id)}
                              title="Delete Subcategory"
                              className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* CATEGORY MODAL */}
      {categoryModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <FolderTree className="w-5 h-5 text-[#1dbf73]" />
                <h2 className="text-lg font-extrabold text-[#222325]">
                  {editingCategory ? 'Edit Blog Category' : 'Create Blog Category'}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setCategoryModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#222325] mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tax Planning & Compliance"
                  value={catName}
                  onChange={(e) => {
                    setCatName(e.target.value);
                    if (!editingCategory && !catSlug) {
                      setCatSlug(generateSlug(e.target.value));
                    }
                  }}
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:border-[#1dbf73]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#222325] mb-1">URL Slug *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. tax-planning-compliance"
                  value={catSlug}
                  onChange={(e) => setCatSlug(generateSlug(e.target.value))}
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 font-mono focus:outline-none focus:border-[#1dbf73]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#222325] mb-1">Description (Optional)</label>
                <textarea
                  rows={3}
                  placeholder="Brief summary of articles in this category..."
                  value={catDescription}
                  onChange={(e) => setCatDescription(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:border-[#1dbf73]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#222325] mb-1">Sort Order</label>
                  <input
                    type="number"
                    min={1}
                    value={catOrder}
                    onChange={(e) => setCatOrder(parseInt(e.target.value, 10) || 1)}
                    className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:border-[#1dbf73]"
                  />
                </div>

                <div className="flex items-center pt-5">
                  <label className="inline-flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={catIsActive}
                      onChange={(e) => setCatIsActive(e.target.checked)}
                      className="w-4 h-4 text-[#1dbf73] rounded-md focus:ring-[#1dbf73]"
                    />
                    <span className="text-xs font-bold text-[#222325]">Active Category</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCategoryModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-[#1dbf73] hover:bg-[#19a463] text-white text-xs font-bold shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {saving ? 'Saving...' : editingCategory ? 'Save Changes' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SUBCATEGORY MODAL */}
      {subcategoryModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#1dbf73]" />
                <h2 className="text-lg font-extrabold text-[#222325]">
                  {editingSubcategory ? 'Edit Blog Subcategory' : 'Create Blog Subcategory'}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSubcategoryModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSubcategory} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#222325] mb-1">Parent Category *</label>
                <select
                  required
                  value={subParentId}
                  onChange={(e) => setSubParentId(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:border-[#1dbf73]"
                >
                  <option value="">Select Parent Category...</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#222325] mb-1">Subcategory Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Income Tax Filing Guides"
                  value={subName}
                  onChange={(e) => {
                    setSubName(e.target.value);
                    if (!editingSubcategory && !subSlug) {
                      setSubSlug(generateSlug(e.target.value));
                    }
                  }}
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:border-[#1dbf73]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#222325] mb-1">URL Slug *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. income-tax-filing-guides"
                  value={subSlug}
                  onChange={(e) => setSubSlug(generateSlug(e.target.value))}
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 font-mono focus:outline-none focus:border-[#1dbf73]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#222325] mb-1">Description (Optional)</label>
                <textarea
                  rows={3}
                  placeholder="Subtopic description..."
                  value={subDescription}
                  onChange={(e) => setSubDescription(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:border-[#1dbf73]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#222325] mb-1">Sort Order</label>
                  <input
                    type="number"
                    min={1}
                    value={subOrder}
                    onChange={(e) => setSubOrder(parseInt(e.target.value, 10) || 1)}
                    className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:border-[#1dbf73]"
                  />
                </div>

                <div className="flex items-center pt-5">
                  <label className="inline-flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={subIsActive}
                      onChange={(e) => setSubIsActive(e.target.checked)}
                      className="w-4 h-4 text-[#1dbf73] rounded-md focus:ring-[#1dbf73]"
                    />
                    <span className="text-xs font-bold text-[#222325]">Active Subcategory</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSubcategoryModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-[#1dbf73] hover:bg-[#19a463] text-white text-xs font-bold shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {saving ? 'Saving...' : editingSubcategory ? 'Save Changes' : 'Create Subcategory'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
