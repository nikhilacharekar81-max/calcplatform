import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Copy,
  ArrowUp,
  ArrowDown,
  AlertTriangle,
  Calculator as CalcIcon,
  Eye,
  EyeOff,
  ExternalLink,
  Star,
  BookOpen,
  FolderInput,
  FolderOutput,
  Check,
  CheckCircle2,
  X,
} from 'lucide-react';
import { api } from '../../services/api.ts';
import { Calculator, Category, Subcategory } from '../../types/schema.ts';
import { EmptyState } from '../../components/common/EmptyState.tsx';

interface AdminCalculatorsProps {
  onNavigate: (tab: 'dashboard' | 'categories' | 'subcategories' | 'calculators' | 'content-seo' | 'settings' | 'calculator-editor', calcId?: string) => void;
}

export const AdminCalculators: React.FC<AdminCalculatorsProps> = ({ onNavigate }) => {
  const [calculators, setCalculators] = useState<Array<Calculator & { category?: Category; subcategory?: Subcategory }>>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<string>('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [isLoading, setIsLoading] = useState(true);

  // Bulk Selection and Actions State
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isBulkProcessing, setIsBulkProcessing] = useState(false);
  const [bulkDeleteModalOpen, setBulkDeleteModalOpen] = useState(false);
  const [notification, setNotification] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Delete Target Modal
  const [deleteTarget, setDeleteTarget] = useState<Calculator | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Move Category / Subcategory Modal State
  const [moveTarget, setMoveTarget] = useState<Calculator | null>(null);
  const [moveCategoryId, setMoveCategoryId] = useState<string>('');
  const [moveSubcategoryId, setMoveSubcategoryId] = useState<string>('');
  const [isMoving, setIsMoving] = useState<boolean>(false);
  const [moveSuccessMsg, setMoveSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    api.adminGetCategories().then(setCategories).catch(() => {});
    api.adminGetSubcategories().then(setSubcategories).catch(() => {});
  }, []);

  useEffect(() => {
    loadCalculators();
  }, [selectedCategoryId, selectedSubcategoryId, search, statusFilter]);

  const showNotification = (text: string, type: 'success' | 'error' = 'success') => {
    setNotification({ text, type });
    setTimeout(() => {
      setNotification((curr) => (curr?.text === text ? null : curr));
    }, 4500);
  };

  const loadCalculators = async () => {
    setIsLoading(true);
    try {
      const data = await api.adminGetCalculators({
        categoryId: selectedCategoryId || undefined,
        subcategoryId: selectedSubcategoryId || undefined,
        search: search || undefined,
        status: statusFilter === 'all' ? undefined : statusFilter,
      });
      setCalculators(data);
      const existingIds = new Set(data.map((c) => c.id));
      setSelectedIds((prev) => prev.filter((id) => existingIds.has(id)));
    } catch (err) {
      console.error('Failed to load calculators:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleSelectAll = () => {
    if (selectedIds.length === calculators.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(calculators.map((c) => c.id));
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
      await api.adminBulkCalculatorStatus(selectedIds, isActive);
      setCalculators((prev) =>
        prev.map((c) => (selectedIds.includes(c.id) ? { ...c, isActive } : c))
      );
      showNotification(
        `Successfully turned ${isActive ? 'ON' : 'OFF'} ${selectedIds.length} calculators.`
      );
    } catch (err: any) {
      showNotification(err.message || 'Failed to update calculator status', 'error');
      loadCalculators();
    } finally {
      setIsBulkProcessing(false);
    }
  };

  const handleBulkDeleteConfirm = async () => {
    if (selectedIds.length === 0) return;
    setIsBulkProcessing(true);
    try {
      const res = await api.adminBulkCalculatorDelete(selectedIds);
      const count = res.count || selectedIds.length;
      setCalculators((prev) => prev.filter((c) => !selectedIds.includes(c.id)));
      setSelectedIds([]);
      setBulkDeleteModalOpen(false);
      showNotification(`Successfully deleted ${count} calculators.`);
      await loadCalculators();
    } catch (err: any) {
      showNotification(err.message || 'Failed to bulk delete calculators', 'error');
    } finally {
      setIsBulkProcessing(false);
    }
  };

  const handleToggleStatus = async (calc: Calculator) => {
    try {
      await api.adminToggleCalculator(calc.id);
      loadCalculators();
    } catch (err) {
      console.error('Failed to toggle calculator status:', err);
    }
  };

  const handleDuplicate = async (calc: Calculator) => {
    try {
      await api.adminDuplicateCalculator(calc.id);
      loadCalculators();
    } catch (err: any) {
      alert(err.message || 'Failed to duplicate calculator');
    }
  };

  const handleMoveOrder = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= calculators.length) return;

    const newOrder = [...calculators];
    const temp = newOrder[index];
    newOrder[index] = newOrder[targetIndex];
    newOrder[targetIndex] = temp;

    setCalculators(newOrder);

    try {
      await api.adminReorderCalculators(newOrder.map((c) => c.id));
    } catch (err) {
      console.error('Failed to reorder calculators:', err);
      loadCalculators();
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await api.adminDeleteCalculator(deleteTarget.id);
      setDeleteTarget(null);
      loadCalculators();
    } catch (err: any) {
      alert(err.message || 'Failed to delete calculator');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleOpenMoveModal = (calc: Calculator) => {
    setMoveTarget(calc);
    setMoveCategoryId(calc.categoryId);
    setMoveSubcategoryId(calc.subcategoryId);
    setMoveSuccessMsg(null);
  };

  const handleMoveCategoryChange = (newCatId: string) => {
    setMoveCategoryId(newCatId);
    const matched = subcategories.filter((s) => s.categoryId === newCatId);
    setMoveSubcategoryId(matched.length > 0 ? matched[0].id : '');
  };

  const handleConfirmMove = async () => {
    if (!moveTarget || !moveCategoryId || !moveSubcategoryId) {
      alert('Please select both a target Category and Subcategory.');
      return;
    }
    try {
      setIsMoving(true);
      await api.adminUpdateCalculator(moveTarget.id, {
        categoryId: moveCategoryId,
        subcategoryId: moveSubcategoryId,
      });
      const targetCatName = categories.find((c) => c.id === moveCategoryId)?.name || 'Category';
      const targetSubName = subcategories.find((s) => s.id === moveSubcategoryId)?.name || 'Subcategory';
      setMoveSuccessMsg(`Successfully moved "${moveTarget.name}" to ${targetCatName} › ${targetSubName}!`);
      setTimeout(() => {
        setMoveTarget(null);
        setMoveSuccessMsg(null);
        loadCalculators();
      }, 1200);
    } catch (err: any) {
      alert(err.message || 'Failed to move calculator category.');
    } finally {
      setIsMoving(false);
    }
  };

  const filteredSubcategories = selectedCategoryId
    ? subcategories.filter((s) => s.categoryId === selectedCategoryId)
    : subcategories;

  const moveModalSubcategories = moveCategoryId
    ? subcategories.filter((s) => s.categoryId === moveCategoryId)
    : subcategories;

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

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#e4e5e7]">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#222325] tracking-tight">
            Calculator Management
          </h1>
          <p className="text-xs sm:text-sm text-[#74767e] mt-1">
            Build and manage computational tools, mathematical formulas, and input fields
          </p>
        </div>

        <button
          type="button"
          onClick={() => onNavigate('calculator-editor', 'new')}
          className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-white bg-[#1dbf73] hover:bg-[#19a463] rounded-md transition-colors cursor-pointer shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Calculator</span>
        </button>
      </div>

      {/* Filter and Search Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-white p-3 rounded-lg border border-[#e4e5e7]">
        <div className="relative">
          <Search className="w-4 h-4 text-[#74767e] absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or slug..."
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-[#dadbdd] rounded-md outline-hidden focus:border-[#1dbf73]"
          />
        </div>

        <div>
          <select
            value={selectedCategoryId}
            onChange={(e) => {
              setSelectedCategoryId(e.target.value);
              setSelectedSubcategoryId('');
            }}
            className="w-full px-3 py-1.5 text-xs font-semibold text-[#222325] border border-[#dadbdd] rounded-md outline-hidden focus:border-[#1dbf73] bg-white cursor-pointer"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                Category: {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <select
            value={selectedSubcategoryId}
            onChange={(e) => setSelectedSubcategoryId(e.target.value)}
            className="w-full px-3 py-1.5 text-xs font-semibold text-[#222325] border border-[#dadbdd] rounded-md outline-hidden focus:border-[#1dbf73] bg-white cursor-pointer"
          >
            <option value="">All Subcategories</option>
            {filteredSubcategories.map((s) => (
              <option key={s.id} value={s.id}>
                Subcategory: {s.name}
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

      {/* Bulk Action Toolbar */}
      {selectedIds.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-slate-900 text-white rounded-lg shadow-md border border-slate-800 animate-fadeIn">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#1dbf73] animate-pulse" />
              <span className="text-xs font-bold text-white">
                {selectedIds.length} of {calculators.length} selected
              </span>
            </div>
            <div className="h-4 w-[1px] bg-slate-700 hidden sm:block" />
            <button
              type="button"
              onClick={handleToggleSelectAll}
              className="text-xs text-slate-300 hover:text-white underline cursor-pointer"
            >
              {selectedIds.length === calculators.length ? 'Deselect All' : `Select All (${calculators.length})`}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={isBulkProcessing}
              onClick={() => handleBulkStatus(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-[#1dbf73] hover:bg-[#19a463] rounded-md transition-colors cursor-pointer disabled:opacity-50 shadow-xs"
              title="Turn ON (Activate) selected calculators"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Turn ON</span>
            </button>

            <button
              type="button"
              disabled={isBulkProcessing}
              onClick={() => handleBulkStatus(false)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md transition-colors cursor-pointer disabled:opacity-50 shadow-xs"
              title="Turn OFF (Deactivate) selected calculators"
            >
              <EyeOff className="w-3.5 h-3.5" />
              <span>Turn OFF</span>
            </button>

            <button
              type="button"
              disabled={isBulkProcessing}
              onClick={() => setBulkDeleteModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-md transition-colors cursor-pointer disabled:opacity-50 shadow-xs"
              title="Bulk delete selected calculators"
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

      {/* Calculators Table */}
      {isLoading ? (
        <div className="bg-white rounded-lg border border-[#e4e5e7] p-8 text-center text-xs text-[#74767e]">
          Loading calculators...
        </div>
      ) : calculators.length > 0 ? (
        <div className="bg-white rounded-lg border border-[#e4e5e7] overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#fafafa] border-b border-[#e4e5e7] text-[#74767e] font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3.5 px-3 w-10 text-center">
                    <input
                      type="checkbox"
                      checked={calculators.length > 0 && selectedIds.length === calculators.length}
                      ref={(el) => {
                        if (el) {
                          el.indeterminate = selectedIds.length > 0 && selectedIds.length < calculators.length;
                        }
                      }}
                      onChange={handleToggleSelectAll}
                      className="w-4 h-4 rounded border-[#dadbdd] text-[#1dbf73] focus:ring-[#1dbf73] cursor-pointer accent-[#1dbf73]"
                      title="Select / Deselect all"
                    />
                  </th>
                  <th className="py-3.5 px-4 w-12 text-center">Order</th>
                  <th className="py-3.5 px-4">Calculator Name</th>
                  <th className="py-3.5 px-4">Hierarchy</th>
                  <th className="py-3.5 px-4 text-center">Inputs / Outputs</th>
                  <th className="py-3.5 px-4 text-center">Featured</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f5f5f5]">
                {calculators.map((calc, index) => {
                  const isSelected = selectedIds.includes(calc.id);
                  return (
                    <tr
                      key={calc.id}
                      className={`transition-colors ${
                        isSelected ? 'bg-emerald-50/50 hover:bg-emerald-50/70' : 'hover:bg-[#fafafa]'
                      }`}
                    >
                      {/* Checkbox column */}
                      <td className="py-3.5 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelectOne(calc.id)}
                          className="w-4 h-4 rounded border-[#dadbdd] text-[#1dbf73] focus:ring-[#1dbf73] cursor-pointer accent-[#1dbf73]"
                        />
                      </td>

                      {/* Order buttons */}
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
                            disabled={index === calculators.length - 1}
                            onClick={() => handleMoveOrder(index, 'down')}
                            className="p-1 text-[#74767e] hover:text-[#222325] disabled:opacity-20 cursor-pointer"
                            title="Move down"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>

                      {/* Name & Slug */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-[#222325] text-sm">
                          {calc.name}
                        </div>
                        <div className="text-[11px] font-mono text-[#74767e] mt-0.5">
                          /{calc.category?.slug || 'cat'}/{calc.subcategory?.slug || 'sub'}/{calc.slug}
                        </div>
                      </td>

                      {/* Hierarchy / Move Badge */}
                      <td className="py-3.5 px-4 text-[#404145]">
                        <button
                          type="button"
                          onClick={() => handleOpenMoveModal(calc)}
                          className="group flex flex-col text-left p-1.5 -m-1.5 rounded-md hover:bg-emerald-50/80 transition-colors cursor-pointer"
                          title="Click to move calculator to another category or subcategory"
                        >
                          <div className="font-bold text-[#1dbf73] flex items-center gap-1">
                            <span>{calc.category?.name || 'Category'}</span>
                            <FolderInput className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-[#1dbf73]" />
                          </div>
                          <div className="text-[11px] text-[#74767e] group-hover:text-[#222325]">
                            {calc.subcategory?.name || 'Subcategory'}
                          </div>
                        </button>
                      </td>

                      {/* Inputs & Outputs counts */}
                      <td className="py-3.5 px-4 text-center font-mono text-[#404145]">
                        <span className="font-bold text-[#222325]">{calc.fields?.length || 0}</span> in / <span className="font-bold text-[#222325]">{calc.outputs?.length || 0}</span> out
                      </td>

                      {/* Featured toggle */}
                      <td className="py-3.5 px-4 text-center">
                        {calc.isFeatured ? (
                          <span className="inline-flex items-center gap-1 text-[11px] text-amber-800 font-bold bg-amber-50 px-2 py-0.5 rounded">
                            <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                            <span>Featured</span>
                          </span>
                        ) : (
                          <span className="text-[#dadbdd]">-</span>
                        )}
                      </td>

                      {/* Status toggle */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(calc)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-bold transition-colors cursor-pointer ${
                            calc.isActive
                              ? 'bg-[#e8faf1] text-[#013a12] hover:bg-[#dcfce7]'
                              : 'bg-[#f5f5f5] text-[#74767e] hover:bg-[#e4e5e7]'
                          }`}
                          title="Click to toggle status (On / Off)"
                        >
                          {calc.isActive ? (
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
                        {calc.isActive && calc.category && calc.subcategory && (
                          <a
                            href={`/${calc.category.slug}/${calc.subcategory.slug}/${calc.slug}`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 text-[#74767e] hover:text-[#1dbf73] rounded hover:bg-[#f5f5f5] transition-colors"
                            title="View public calculator"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                        <button
                          type="button"
                          onClick={() => handleOpenMoveModal(calc)}
                          className="p-1.5 text-[#74767e] hover:text-[#1dbf73] rounded hover:bg-[#e8faf1] transition-colors cursor-pointer"
                          title="Move to another Category / Subcategory"
                        >
                          <FolderInput className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDuplicate(calc)}
                          className="p-1.5 text-[#74767e] hover:text-[#222325] rounded hover:bg-[#f5f5f5] transition-colors cursor-pointer"
                          title="Duplicate calculator"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onNavigate('content-seo', calc.id)}
                          className="p-1.5 text-[#74767e] hover:text-[#1dbf73] rounded hover:bg-[#f5f5f5] transition-colors cursor-pointer"
                          title="Edit Rich-Text Content & SEO Sections"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onNavigate('calculator-editor', calc.id)}
                          className="p-1.5 text-[#74767e] hover:text-[#222325] rounded hover:bg-[#f5f5f5] transition-colors cursor-pointer"
                          title="Edit calculator in Builder"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(calc)}
                          className="p-1.5 text-rose-500 hover:text-rose-700 rounded hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Delete calculator"
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
          icon={CalcIcon}
          title={search ? 'No Matching Calculators' : 'No Calculators Created Yet'}
          description={
            search
              ? 'Try different search keywords.'
              : 'Launch the Builder to configure inputs, mathematical formulas, and formatting.'
          }
          actionLabel="Launch Calculator Builder"
          onAction={() => onNavigate('calculator-editor', 'new')}
        />
      )}

      {/* Move Category / Subcategory Modal */}
      {moveTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#222325]/50 backdrop-blur-xs">
          <div
            className="fixed inset-0"
            onClick={() => setMoveTarget(null)}
            aria-hidden="true"
          />
          <div className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl border border-[#dadbdd] p-6 z-10 space-y-5">
            <div className="flex items-center gap-3 border-b border-[#e4e5e7] pb-4">
              <div className="w-10 h-10 rounded-full bg-[#e8faf1] text-[#1dbf73] flex items-center justify-center shrink-0">
                <FolderOutput className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#222325]">
                  Move Calculator Location
                </h3>
                <p className="text-xs text-[#74767e]">
                  Relocate <span className="font-bold text-[#222325]">"{moveTarget.name}"</span> to a different Category or Subcategory
                </p>
              </div>
            </div>

            {moveSuccessMsg ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs font-bold flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>{moveSuccessMsg}</span>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#222325]">
                    Target Parent Category <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={moveCategoryId}
                    onChange={(e) => handleMoveCategoryChange(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#dadbdd] rounded-lg text-xs font-medium text-[#222325] outline-hidden focus:border-[#1dbf73]"
                  >
                    <option value="">Select Category...</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.slug})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#222325]">
                    Target Subcategory <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={moveSubcategoryId}
                    onChange={(e) => setMoveSubcategoryId(e.target.value)}
                    disabled={!moveCategoryId}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#dadbdd] rounded-lg text-xs font-medium text-[#222325] outline-hidden focus:border-[#1dbf73] disabled:opacity-50"
                  >
                    <option value="">Select Subcategory...</option>
                    {moveModalSubcategories.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.slug})
                      </option>
                    ))}
                  </select>
                  {moveCategoryId && moveModalSubcategories.length === 0 && (
                    <p className="text-[11px] text-amber-700 mt-1">
                      No subcategories exist for this category yet. Create one first in Subcategories.
                    </p>
                  )}
                </div>

                <div className="p-3 bg-[#fafafa] rounded-lg border border-[#e4e5e7] text-[11px] text-[#74767e] space-y-1">
                  <div className="font-bold text-[#404145]">New Target URL:</div>
                  <div className="font-mono text-[#1dbf73]">
                    /{categories.find((c) => c.id === moveCategoryId)?.slug || 'category'}/{moveModalSubcategories.find((s) => s.id === moveSubcategoryId)?.slug || 'subcategory'}/{moveTarget.slug}
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setMoveTarget(null)}
                className="px-4 py-2 text-xs font-bold text-[#404145] hover:bg-[#f5f5f5] rounded-md border border-[#dadbdd] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isMoving || !moveCategoryId || !moveSubcategoryId || Boolean(moveSuccessMsg)}
                onClick={handleConfirmMove}
                className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-[#1dbf73] hover:bg-[#19a463] rounded-md transition-colors cursor-pointer disabled:opacity-50 shadow-xs"
              >
                <FolderInput className="w-3.5 h-3.5" />
                <span>{isMoving ? 'Moving...' : 'Move Calculator'}</span>
              </button>
            </div>
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
                Delete Calculator "{deleteTarget.name}"?
              </h3>
              <p className="text-xs text-[#74767e] mt-1">
                Are you sure you want to delete this calculator? This action cannot be undone.
              </p>
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
                Delete {selectedIds.length} Selected Calculators?
              </h3>
              <p className="text-xs text-[#74767e] mt-1">
                Are you sure you want to permanently delete these {selectedIds.length} calculators? This action cannot be undone.
              </p>

              <div className="mt-4 p-3 bg-rose-50/70 border border-rose-200/80 rounded-lg text-left text-xs space-y-1.5 max-h-36 overflow-y-auto">
                <div className="font-bold text-rose-800">
                  Calculators to be deleted:
                </div>
                {calculators
                  .filter((c) => selectedIds.includes(c.id))
                  .map((c) => (
                    <div key={c.id} className="text-[#404145] flex items-center gap-1.5 truncate">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                      <span className="truncate">{c.name}</span>
                    </div>
                  ))}
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
