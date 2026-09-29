import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  HelpCircle,
  Eye,
  Layers,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Code2,
  Sliders,
  Settings2,
  ArrowUp,
  ArrowDown,
  Globe,
  FileText,
  BookOpen,
  Award,
  ToggleLeft,
  ToggleRight,
  ExternalLink,
  FileCheck,
} from 'lucide-react';
import { api } from '../../services/api.ts';
import {
  Calculator,
  Category,
  Subcategory,
  CalculatorField,
  CalculatorOutput,
  FieldType,
  OutputFormat,
  CalculatorModuleConfig,
  ContentSection,
  CalculatorFAQ,
  CalculatorExample,
} from '../../types/schema.ts';
import { slugify, isValidSlug } from '../../utils/slugify.ts';
import { MODULE_REGISTRY, getDefaultModuleConfigs, ModuleDefinition } from '../../components/calculator/modules/ModuleRegistry';
import { RichTextEditor } from '../../components/admin/RichTextEditor.tsx';
import { DynamicCalculatorRenderer } from '../../components/calculator/DynamicCalculatorRenderer.tsx';

interface AdminCalculatorEditorProps {
  calculatorId: string;
  onBack: () => void;
  onSaved: () => void;
}

export const AdminCalculatorEditor: React.FC<AdminCalculatorEditorProps> = ({
  calculatorId,
  onBack,
  onSaved,
}) => {
  const isNew = calculatorId === 'new';

  const [activeTab, setActiveTab] = useState<
    'general' | 'fields' | 'formulas' | 'modules' | 'content' | 'examples' | 'faqs' | 'seo' | 'preview'
  >('general');

  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [isLoading, setIsLoading] = useState(!isNew);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [autoSlug, setAutoSlug] = useState(isNew);

  // Active module for settings modal
  const [editingModuleSettings, setEditingModuleSettings] = useState<CalculatorModuleConfig | null>(null);

  const [calculator, setCalculator] = useState<Partial<Calculator>>({
    name: '',
    slug: '',
    shortDescription: '',
    categoryId: '',
    subcategoryId: '',
    engineType: 'custom_formula',
    fields: [
      {
        id: 'amount',
        label: 'Principal Amount',
        type: 'number',
        defaultValue: 500000,
        placeholder: '500000',
        prefix: '₹',
        suffix: '',
        min: 1000,
        max: 100000000,
        step: 1000,
        helpText: 'Enter total base amount',
      },
      {
        id: 'rate',
        label: 'Annual Interest Rate (%)',
        type: 'slider',
        defaultValue: 8.5,
        prefix: '',
        suffix: '%',
        min: 1,
        max: 30,
        step: 0.1,
        helpText: 'Annual percentage rate',
      },
      {
        id: 'tenureYears',
        label: 'Tenure (Years)',
        type: 'number',
        defaultValue: 5,
        prefix: '',
        suffix: 'Yrs',
        min: 1,
        max: 40,
        step: 1,
        helpText: 'Loan or investment duration in years',
      },
    ],
    outputs: [
      {
        id: 'monthlyPayment',
        label: 'Monthly Payment (EMI)',
        formula: '(amount * (rate / 1200) * pow(1 + (rate / 1200), tenureYears * 12)) / (pow(1 + (rate / 1200), tenureYears * 12) - 1)',
        format: 'currency_inr',
        highlight: true,
        description: 'Estimated monthly installment',
      },
      {
        id: 'totalPayment',
        label: 'Total Payment',
        formula: 'monthlyPayment * tenureYears * 12',
        format: 'currency_inr',
        highlight: false,
        description: 'Total principal + interest repayment',
      },
      {
        id: 'totalInterest',
        label: 'Total Interest Payable',
        formula: 'totalPayment - amount',
        format: 'currency_inr',
        highlight: false,
        description: 'Aggregate interest cost',
      },
    ],
    modules: getDefaultModuleConfigs(),
    contentSections: [
      {
        id: 'sec_overview',
        title: 'Overview & Computational Methodology',
        sectionType: 'overview',
        htmlContent: '<p>This calculator provides high-precision evaluation using standard actuarial formulas and reducing balance compounding principles.</p>',
        isEnabled: true,
        order: 1,
      },
      {
        id: 'sec_how_to',
        title: 'Step-by-Step Instructions',
        sectionType: 'how-to',
        htmlContent: '<ol class="list-decimal pl-5 space-y-1.5 my-3">\n  <li>Enter the total amount.</li>\n  <li>Adjust the annual rate and tenure.</li>\n  <li>Review the computed monthly EMI, total interest, and visual amortization schedule below.</li>\n</ol>',
        isEnabled: true,
        order: 2,
      },
    ],
    faqs: [
      {
        id: 'faq_1',
        question: 'How is the calculation evaluated?',
        answer: '<p>The calculation uses standard reducing-balance math computed directly on your browser for instant, real-time results.</p>',
        isEnabled: true,
        order: 1,
      },
      {
        id: 'faq_2',
        question: 'Can I change parameters anytime?',
        answer: '<p>Yes, all values update automatically in real-time as you type or drag the sliders.</p>',
        isEnabled: true,
        order: 2,
      },
    ],
    chartConfig: {
      enabled: true,
      chartType: 'donut',
      title: 'Principal vs Interest Breakdown',
      segments: [
        { label: 'Principal Amount', outputId: 'amount', color: '#1dbf73' },
        { label: 'Total Interest', outputId: 'totalInterest', color: '#ff7640' },
      ],
    },
    seoTitle: '',
    seoDescription: '',
    seoKeywords: '',
    order: 1,
    isActive: true,
    isFeatured: false,
  });

  // Load Categories & Subcategories
  useEffect(() => {
    async function loadData() {
      try {
        const [cats, subs] = await Promise.all([
          api.adminGetCategories(),
          api.adminGetSubcategories(),
        ]);
        setCategories(cats);
        setSubcategories(subs);

        if (!isNew) {
          const calcData = await api.adminGetCalculator(calculatorId);
          // Ensure modules array is populated
          if (!calcData.modules || calcData.modules.length === 0) {
            calcData.modules = getDefaultModuleConfigs();
          }
          setCalculator(calcData);
          setAutoSlug(false);
        } else if (cats.length > 0) {
          const firstCat = cats[0];
          const matchedSubs = subs.filter((s) => s.categoryId === firstCat.id);
          setCalculator((prev) => ({
            ...prev,
            categoryId: firstCat.id,
            subcategoryId: matchedSubs.length > 0 ? matchedSubs[0].id : '',
          }));
        }

        const urlParams = new URLSearchParams(window.location.search);
        const preselectTab = urlParams.get('tab') as any;
        if (
          preselectTab &&
          ['general', 'fields', 'formulas', 'modules', 'content', 'examples', 'faqs', 'seo', 'preview'].includes(
            preselectTab
          )
        ) {
          setActiveTab(preselectTab);
        }
      } catch (err: any) {
        setErrorMessage(err.message || 'Failed to load calculator configuration.');
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [calculatorId, isNew]);

  const handleNameChange = (name: string) => {
    setCalculator((prev) => {
      const next = { ...prev, name };
      if (autoSlug) {
        next.slug = slugify(name);
      }
      return next;
    });
  };

  const handleCategoryChange = (categoryId: string) => {
    const matchedSubs = subcategories.filter((s) => s.categoryId === categoryId);
    setCalculator((prev) => ({
      ...prev,
      categoryId,
      subcategoryId: matchedSubs.length > 0 ? matchedSubs[0].id : '',
    }));
  };

  // Module Management handlers
  const handleToggleModule = (moduleId: string) => {
    setCalculator((prev) => {
      const currentModules = [...(prev.modules || getDefaultModuleConfigs())];
      const index = currentModules.findIndex((m) => m.moduleId === moduleId);
      if (index >= 0) {
        currentModules[index] = {
          ...currentModules[index],
          isEnabled: !currentModules[index].isEnabled,
        };
      } else {
        const modDef = MODULE_REGISTRY.find((r) => r.id === moduleId);
        if (modDef) {
          currentModules.push({
            id: `mod_${moduleId}`,
            moduleId,
            name: modDef.name,
            isEnabled: true,
            order: currentModules.length + 1,
            settings: {},
          });
        }
      }
      return { ...prev, modules: currentModules };
    });
  };

  const handleMoveModule = (index: number, direction: 'up' | 'down') => {
    setCalculator((prev) => {
      const currentModules = [...(prev.modules || getDefaultModuleConfigs())].sort(
        (a, b) => (a.order || 0) - (b.order || 0)
      );
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= currentModules.length) return prev;

      const temp = currentModules[index];
      currentModules[index] = currentModules[targetIndex];
      currentModules[targetIndex] = temp;

      // re-index orders
      const updated = currentModules.map((m, idx) => ({
        ...m,
        order: idx + 1,
      }));

      return { ...prev, modules: updated };
    });
  };

  const handleSaveModuleSettings = (modId: string, updatedSettings: Record<string, any>) => {
    setCalculator((prev) => {
      const currentModules = [...(prev.modules || [])];
      const idx = currentModules.findIndex((m) => m.id === modId || m.moduleId === modId);
      if (idx >= 0) {
        currentModules[idx] = {
          ...currentModules[idx],
          settings: updatedSettings,
        };
      }
      return { ...prev, modules: currentModules };
    });
    setEditingModuleSettings(null);
  };

  // Content Section handlers
  const handleAddContentSection = () => {
    const newSection: ContentSection = {
      id: `sec_${Date.now()}`,
      title: 'New Content Section',
      sectionType: 'custom',
      htmlContent: '<p>Add detailed explanatory text, tables, or guidance here.</p>',
      isEnabled: true,
      order: (calculator.contentSections?.length || 0) + 1,
    };
    setCalculator((prev) => ({
      ...prev,
      contentSections: [...(prev.contentSections || []), newSection],
    }));
  };

  const handleUpdateContentSection = (id: string, updates: Partial<ContentSection>) => {
    setCalculator((prev) => ({
      ...prev,
      contentSections: (prev.contentSections || []).map((s) => (s.id === id ? { ...s, ...updates } : s)),
    }));
  };

  const handleRemoveContentSection = (id: string) => {
    setCalculator((prev) => {
      const removed = (prev.contentSections || []).find((s) => s.id === id);
      const remaining = (prev.contentSections || []).filter((s) => s.id !== id);
      remaining.forEach((s, idx) => {
        s.order = idx + 1;
      });

      const isHowTo =
        removed?.sectionType === 'how-to' ||
        removed?.title?.toLowerCase().includes('how to');
      const isFormula =
        removed?.sectionType === 'formula' ||
        removed?.title?.toLowerCase().includes('formula');

      const content = { ...(prev.content || {}) };
      if (isHowTo) content.usageInstructions = '';
      if (isFormula) content.formulaExplanation = '';

      return {
        ...prev,
        contentSections: remaining,
        content,
      };
    });
  };

  const handleMoveContentSection = (index: number, direction: 'up' | 'down') => {
    setCalculator((prev) => {
      const sections = [...(prev.contentSections || [])];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= sections.length) return prev;

      const temp = sections[index];
      sections[index] = sections[targetIndex];
      sections[targetIndex] = temp;

      sections.forEach((s, idx) => {
        s.order = idx + 1;
      });

      return { ...prev, contentSections: sections };
    });
  };

  // FAQ Handlers
  const handleAddFaq = () => {
    const newFaq: CalculatorFAQ = {
      id: `faq_${Date.now()}`,
      question: 'What are the main benefits of this calculation?',
      answer: '<p>Enter a comprehensive, easy-to-understand explanation here.</p>',
      isEnabled: true,
      order: (calculator.faqs?.length || 0) + 1,
    };
    setCalculator((prev) => ({
      ...prev,
      faqs: [...(prev.faqs || []), newFaq],
    }));
  };

  const handleUpdateFaq = (id: string, updates: Partial<CalculatorFAQ>) => {
    setCalculator((prev) => ({
      ...prev,
      faqs: (prev.faqs || []).map((f) => (f.id === id ? { ...f, ...updates } : f)),
    }));
  };

  const handleRemoveFaq = (id: string) => {
    setCalculator((prev) => ({
      ...prev,
      faqs: (prev.faqs || []).filter((f) => f.id !== id),
    }));
  };

  // Worked Examples Handlers
  const handleAddExample = () => {
    const newEx: CalculatorExample = {
      id: `ex_${Date.now()}`,
      title: 'Real-World Scenario Example',
      description: 'Describe the scenario, baseline values, and context in detail...',
      resultSummary: 'Evaluated Result: Instant Output',
      isEnabled: true,
      order: (calculator.examples?.length || 0) + 1,
    };
    setCalculator((prev) => ({
      ...prev,
      examples: [...(prev.examples || []), newEx],
    }));
  };

  const handleUpdateExample = (exId: string, updates: Partial<CalculatorExample>) => {
    setCalculator((prev) => ({
      ...prev,
      examples: (prev.examples || []).map((ex) => (ex.id === exId ? { ...ex, ...updates } : ex)),
    }));
  };

  const handleRemoveExample = (exId: string) => {
    setCalculator((prev) => ({
      ...prev,
      examples: (prev.examples || []).filter((ex) => ex.id !== exId),
    }));
  };

  const handleMoveExample = (index: number, direction: 'up' | 'down') => {
    if (!calculator.examples) return;
    const list = [...calculator.examples];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= list.length) return;

    const temp = list[index];
    list[index] = list[targetIndex];
    list[targetIndex] = temp;

    const updated = list.map((ex, idx) => ({ ...ex, order: idx + 1 }));
    setCalculator((prev) => ({ ...prev, examples: updated }));
  };

  // Save Calculator
  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!calculator.name?.trim()) {
      setErrorMessage('Calculator name is required.');
      setActiveTab('general');
      return;
    }

    if (!calculator.slug?.trim() || !isValidSlug(calculator.slug)) {
      setErrorMessage('A valid URL slug is required.');
      setActiveTab('general');
      return;
    }

    if (!calculator.categoryId) {
      setErrorMessage('Please select a parent Category.');
      setActiveTab('general');
      return;
    }

    if (!calculator.subcategoryId) {
      setErrorMessage('Please select a Subcategory.');
      setActiveTab('general');
      return;
    }

    setIsSaving(true);
    try {
      if (isNew) {
        await api.adminCreateCalculator(calculator as Omit<Calculator, 'id' | 'createdAt' | 'updatedAt'>);
      } else {
        await api.adminUpdateCalculator(calculatorId, calculator);
      }
      setSuccessMessage('Calculator configuration successfully saved!');
      setTimeout(() => {
        onSaved();
      }, 700);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to save calculator.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-12 text-center text-xs font-semibold text-[#74767e]">
        Loading calculator editor...
      </div>
    );
  }

  const enabledModulesCount = (calculator.modules || []).filter((m) => m.isEnabled).length;
  const filteredSubcategories = subcategories.filter((s) => s.categoryId === calculator.categoryId);

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e4e5e7] pb-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="p-2 rounded-lg border border-[#e4e5e7] hover:bg-[#f5f5f5] text-[#404145] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl font-extrabold text-[#222325]">
              {isNew ? 'Create New Calculator' : `Edit Calculator: ${calculator.name}`}
            </h1>
            <p className="text-xs text-[#74767e]">
              Configure formula parameters, modular components, rich content, and SEO metadata.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => handleSave()}
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1dbf73] hover:bg-[#19a463] text-white font-bold text-xs rounded-lg shadow-sm transition-all cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving...' : 'Save Calculator'}</span>
          </button>
        </div>
      </div>

      {/* Status Alerts */}
      {errorMessage && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
      {successMessage && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-700 font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1 border-b border-[#e4e5e7] overflow-x-auto pb-px">
        {[
          { id: 'general', label: '1. General Info', icon: Sliders },
          { id: 'fields', label: '2. Inputs & Fields', icon: Code2, count: calculator.fields?.length },
          { id: 'formulas', label: '3. Outputs & Math', icon: Award, count: calculator.outputs?.length },
          { id: 'modules', label: '4. Modules & Order', icon: Layers, badge: `${enabledModulesCount} ON` },
          { id: 'content', label: '5. Rich Content', icon: BookOpen, count: calculator.contentSections?.length },
          { id: 'examples', label: '6. Worked Examples', icon: FileCheck, count: calculator.examples?.length },
          { id: 'faqs', label: '7. FAQs', icon: HelpCircle, count: calculator.faqs?.length },
          { id: 'seo', label: '8. SEO & Meta', icon: Globe },
          { id: 'preview', label: 'Live Preview', icon: Eye },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'border-[#1dbf73] text-[#1dbf73] bg-[#f4fdf8]'
                  : 'border-transparent text-[#74767e] hover:text-[#222325] hover:border-[#e4e5e7]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {tab.badge && (
                <span className="px-1.5 py-0.2 bg-[#1dbf73] text-white text-[10px] font-bold rounded-full">
                  {tab.badge}
                </span>
              )}
              {tab.count !== undefined && (
                <span className="px-1.5 py-0.2 bg-[#f0f0f0] text-[#404145] text-[10px] font-bold rounded-full">
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: General Info */}
      {activeTab === 'general' && (
        <div className="bg-white rounded-xl border border-[#e4e5e7] p-6 sm:p-7 space-y-6 shadow-2xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#222325]">
                Calculator Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={calculator.name || ''}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Home Loan EMI Calculator"
                className="w-full px-3.5 py-2.5 bg-white border border-[#e4e5e7] rounded-lg text-sm text-[#222325] focus:outline-none focus:border-[#1dbf73]"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-[#222325]">
                  URL Slug <span className="text-rose-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setAutoSlug(!autoSlug);
                    if (!autoSlug && calculator.name) {
                      setCalculator((prev) => ({ ...prev, slug: slugify(prev.name || '') }));
                    }
                  }}
                  className="text-[11px] font-bold text-[#1dbf73] hover:underline cursor-pointer"
                >
                  {autoSlug ? 'Auto-sync ON' : 'Sync from Name'}
                </button>
              </div>
              <div className="flex items-center">
                <span className="px-3 py-2.5 bg-[#fafafa] border border-r-0 border-[#e4e5e7] rounded-l-lg text-xs text-[#74767e] font-mono">
                  /
                </span>
                <input
                  type="text"
                  value={calculator.slug || ''}
                  onChange={(e) => {
                    setAutoSlug(false);
                    setCalculator((prev) => ({ ...prev, slug: e.target.value }));
                  }}
                  placeholder="home-loan-emi"
                  className="w-full px-3.5 py-2.5 bg-white border border-[#e4e5e7] rounded-r-lg text-sm text-[#222325] font-mono focus:outline-none focus:border-[#1dbf73]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#222325]">
                Parent Category <span className="text-rose-500">*</span>
              </label>
              <select
                value={calculator.categoryId || ''}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-[#e4e5e7] rounded-lg text-sm text-[#222325] focus:outline-none focus:border-[#1dbf73]"
              >
                <option value="">Select Category...</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#222325]">
                Subcategory <span className="text-rose-500">*</span>
              </label>
              <select
                value={calculator.subcategoryId || ''}
                onChange={(e) => setCalculator((prev) => ({ ...prev, subcategoryId: e.target.value }))}
                className="w-full px-3.5 py-2.5 bg-white border border-[#e4e5e7] rounded-lg text-sm text-[#222325] focus:outline-none focus:border-[#1dbf73]"
              >
                <option value="">Select Subcategory...</option>
                {filteredSubcategories.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#222325]">
              Short Description / Excerpt
            </label>
            <textarea
              rows={3}
              value={calculator.shortDescription || ''}
              onChange={(e) => setCalculator((prev) => ({ ...prev, shortDescription: e.target.value }))}
              placeholder="Concise summary displayed on cards and search results..."
              className="w-full px-3.5 py-2.5 bg-white border border-[#e4e5e7] rounded-lg text-sm text-[#222325] focus:outline-none focus:border-[#1dbf73]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-6 pt-2 border-t border-[#f0f0f0]">
            <label className="flex items-center gap-2 text-xs font-bold text-[#222325] cursor-pointer">
              <input
                type="checkbox"
                checked={calculator.isActive !== false}
                onChange={(e) => setCalculator((prev) => ({ ...prev, isActive: e.target.checked }))}
                className="w-4 h-4 text-[#1dbf73] accent-[#1dbf73] rounded cursor-pointer"
              />
              <span>Published & Active on Public Site</span>
            </label>

            <label className="flex items-center gap-2 text-xs font-bold text-[#222325] cursor-pointer">
              <input
                type="checkbox"
                checked={Boolean(calculator.isFeatured)}
                onChange={(e) => setCalculator((prev) => ({ ...prev, isFeatured: e.target.checked }))}
                className="w-4 h-4 text-[#1dbf73] accent-[#1dbf73] rounded cursor-pointer"
              />
              <span>Feature on Category / Homepage Hero</span>
            </label>
          </div>
        </div>
      )}

      {/* TAB 2: Inputs & Fields */}
      {activeTab === 'fields' && (
        <div className="bg-white rounded-xl border border-[#e4e5e7] p-6 sm:p-7 space-y-6 shadow-2xs">
          <div className="flex items-center justify-between border-b border-[#f0f0f0] pb-4">
            <div>
              <h2 className="text-sm font-bold text-[#222325]">Input Variables & Form Controls</h2>
              <p className="text-xs text-[#74767e]">
                Define input fields (sliders, number boxes, dropdown selects) that feed into formulas.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                const newField: CalculatorField = {
                  id: `param_${Date.now()}`,
                  label: 'New Parameter',
                  type: 'number',
                  defaultValue: 100,
                  min: 0,
                  max: 100000,
                  step: 1,
                  prefix: '',
                  suffix: '',
                  helpText: '',
                };
                setCalculator((prev) => ({ ...prev, fields: [...(prev.fields || []), newField] }));
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#222325] hover:bg-black text-white text-xs font-bold rounded-lg cursor-pointer transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Input Field</span>
            </button>
          </div>

          <div className="space-y-4">
            {calculator.fields?.map((field, idx) => (
              <div
                key={field.id || idx}
                className="p-4 sm:p-5 bg-[#fafafa] rounded-xl border border-[#e4e5e7] space-y-4"
              >
                <div className="flex items-center justify-between border-b border-[#e4e5e7] pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#222325] text-white text-[10px] font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-bold text-[#222325]">{field.label || 'Untitled Field'}</span>
                    <code className="text-[10px] font-mono bg-white px-1.5 py-0.5 rounded border border-[#e4e5e7] text-[#74767e]">
                      var: {field.id}
                    </code>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setCalculator((prev) => ({
                        ...prev,
                        fields: prev.fields?.filter((_, fIdx) => fIdx !== idx),
                      }));
                    }}
                    className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-[#74767e] mb-1">Variable ID</label>
                    <input
                      type="text"
                      value={field.id}
                      onChange={(e) => {
                        const newId = e.target.value.replace(/[^a-zA-Z0-9_]/g, '');
                        setCalculator((prev) => {
                          const fields = [...(prev.fields || [])];
                          fields[idx] = { ...fields[idx], id: newId };
                          return { ...prev, fields };
                        });
                      }}
                      className="w-full px-3 py-1.5 bg-white border border-[#e4e5e7] rounded-md text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#74767e] mb-1">Field Label</label>
                    <input
                      type="text"
                      value={field.label}
                      onChange={(e) => {
                        setCalculator((prev) => {
                          const fields = [...(prev.fields || [])];
                          fields[idx] = { ...fields[idx], label: e.target.value };
                          return { ...prev, fields };
                        });
                      }}
                      className="w-full px-3 py-1.5 bg-white border border-[#e4e5e7] rounded-md text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#74767e] mb-1">Control Type</label>
                    <select
                      value={field.type}
                      onChange={(e) => {
                        setCalculator((prev) => {
                          const fields = [...(prev.fields || [])];
                          fields[idx] = { ...fields[idx], type: e.target.value as FieldType };
                          return { ...prev, fields };
                        });
                      }}
                      className="w-full px-3 py-1.5 bg-white border border-[#e4e5e7] rounded-md text-xs"
                    >
                      <option value="number">Number Box</option>
                      <option value="slider">Slider + Number</option>
                      <option value="select">Dropdown Select</option>
                      <option value="checkbox">Checkbox Toggle</option>
                      <option value="date">Date Picker</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#74767e] mb-1">Default Value</label>
                    <input
                      type="text"
                      value={String(field.defaultValue !== undefined ? field.defaultValue : '')}
                      onChange={(e) => {
                        const v = field.type === 'number' || field.type === 'slider' ? parseFloat(e.target.value) || 0 : e.target.value;
                        setCalculator((prev) => {
                          const fields = [...(prev.fields || [])];
                          fields[idx] = { ...fields[idx], defaultValue: v };
                          return { ...prev, fields };
                        });
                      }}
                      className="w-full px-3 py-1.5 bg-white border border-[#e4e5e7] rounded-md text-xs font-mono"
                    />
                  </div>
                </div>

                {(field.type === 'slider' || field.type === 'number') && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-1">
                    <div>
                      <label className="block text-[10px] font-bold text-[#95979d] mb-1">Min Value</label>
                      <input
                        type="number"
                        value={field.min ?? ''}
                        onChange={(e) => {
                          setCalculator((prev) => {
                            const fields = [...(prev.fields || [])];
                            fields[idx] = { ...fields[idx], min: parseFloat(e.target.value) || 0 };
                            return { ...prev, fields };
                          });
                        }}
                        className="w-full px-2.5 py-1 bg-white border border-[#e4e5e7] rounded text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-[#95979d] mb-1">Max Value</label>
                      <input
                        type="number"
                        value={field.max ?? ''}
                        onChange={(e) => {
                          setCalculator((prev) => {
                            const fields = [...(prev.fields || [])];
                            fields[idx] = { ...fields[idx], max: parseFloat(e.target.value) || 0 };
                            return { ...prev, fields };
                          });
                        }}
                        className="w-full px-2.5 py-1 bg-white border border-[#e4e5e7] rounded text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-[#95979d] mb-1">Prefix (e.g. ₹, $)</label>
                      <input
                        type="text"
                        value={field.prefix ?? ''}
                        onChange={(e) => {
                          setCalculator((prev) => {
                            const fields = [...(prev.fields || [])];
                            fields[idx] = { ...fields[idx], prefix: e.target.value };
                            return { ...prev, fields };
                          });
                        }}
                        className="w-full px-2.5 py-1 bg-white border border-[#e4e5e7] rounded text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-[#95979d] mb-1">Suffix (e.g. %, Yrs)</label>
                      <input
                        type="text"
                        value={field.suffix ?? ''}
                        onChange={(e) => {
                          setCalculator((prev) => {
                            const fields = [...(prev.fields || [])];
                            fields[idx] = { ...fields[idx], suffix: e.target.value };
                            return { ...prev, fields };
                          });
                        }}
                        className="w-full px-2.5 py-1 bg-white border border-[#e4e5e7] rounded text-xs"
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Outputs & Math */}
      {activeTab === 'formulas' && (
        <div className="bg-white rounded-xl border border-[#e4e5e7] p-6 sm:p-7 space-y-6 shadow-2xs">
          <div className="flex items-center justify-between border-b border-[#f0f0f0] pb-4">
            <div>
              <h2 className="text-sm font-bold text-[#222325]">Calculated Outputs & Formulas</h2>
              <p className="text-xs text-[#74767e]">
                Specify formulas evaluated securely in real-time. Reference any input ID directly.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                const newOut: CalculatorOutput = {
                  id: `result_${Date.now()}`,
                  label: 'Calculated Metric',
                  formula: 'amount * 1.15',
                  format: 'currency_inr',
                  highlight: false,
                  description: 'Result metric description',
                };
                setCalculator((prev) => ({ ...prev, outputs: [...(prev.outputs || []), newOut] }));
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#222325] hover:bg-black text-white text-xs font-bold rounded-lg cursor-pointer transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Output Metric</span>
            </button>
          </div>

          <div className="space-y-4">
            {calculator.outputs?.map((out, idx) => (
              <div
                key={out.id || idx}
                className="p-4 sm:p-5 bg-[#fafafa] rounded-xl border border-[#e4e5e7] space-y-4"
              >
                <div className="flex items-center justify-between border-b border-[#e4e5e7] pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#1dbf73] text-white text-[10px] font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-bold text-[#222325]">{out.label}</span>
                    {out.highlight && (
                      <span className="px-2 py-0.5 bg-[#f4fdf8] text-[#1dbf73] text-[10px] font-bold rounded border border-[#d8f5e5]">
                        Primary KPI Hero
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setCalculator((prev) => ({
                        ...prev,
                        outputs: prev.outputs?.filter((_, oIdx) => oIdx !== idx),
                      }));
                    }}
                    className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-[#74767e] mb-1">Output Variable ID</label>
                    <input
                      type="text"
                      value={out.id}
                      onChange={(e) => {
                        const newId = e.target.value.replace(/[^a-zA-Z0-9_]/g, '');
                        setCalculator((prev) => {
                          const outputs = [...(prev.outputs || [])];
                          outputs[idx] = { ...outputs[idx], id: newId };
                          return { ...prev, outputs };
                        });
                      }}
                      className="w-full px-3 py-1.5 bg-white border border-[#e4e5e7] rounded-md text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#74767e] mb-1">Display Label</label>
                    <input
                      type="text"
                      value={out.label}
                      onChange={(e) => {
                        setCalculator((prev) => {
                          const outputs = [...(prev.outputs || [])];
                          outputs[idx] = { ...outputs[idx], label: e.target.value };
                          return { ...prev, outputs };
                        });
                      }}
                      className="w-full px-3 py-1.5 bg-white border border-[#e4e5e7] rounded-md text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#74767e] mb-1">Formatting</label>
                    <select
                      value={out.format}
                      onChange={(e) => {
                        setCalculator((prev) => {
                          const outputs = [...(prev.outputs || [])];
                          outputs[idx] = { ...outputs[idx], format: e.target.value as OutputFormat };
                          return { ...prev, outputs };
                        });
                      }}
                      className="w-full px-3 py-1.5 bg-white border border-[#e4e5e7] rounded-md text-xs"
                    >
                      <option value="currency_inr">Indian Rupees (₹)</option>
                      <option value="currency">US Dollars ($)</option>
                      <option value="percent">Percentage (%)</option>
                      <option value="decimal_2">Decimal (2 digits)</option>
                      <option value="integer">Integer (Whole number)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-[#74767e]">
                    Math Formula Expression
                  </label>
                  <input
                    type="text"
                    value={out.formula}
                    onChange={(e) => {
                      setCalculator((prev) => {
                        const outputs = [...(prev.outputs || [])];
                        outputs[idx] = { ...outputs[idx], formula: e.target.value };
                        return { ...prev, outputs };
                      });
                    }}
                    placeholder="e.g. amount * rate / 100"
                    className="w-full px-3 py-2 bg-white border border-[#e4e5e7] rounded-md text-xs font-mono font-bold text-[#1dbf73]"
                  />
                </div>

                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-xs font-bold text-[#222325] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={Boolean(out.highlight)}
                      onChange={(e) => {
                        setCalculator((prev) => {
                          const outputs = [...(prev.outputs || [])];
                          outputs[idx] = { ...outputs[idx], highlight: e.target.checked };
                          return { ...prev, outputs };
                        });
                      }}
                      className="w-4 h-4 text-[#1dbf73] accent-[#1dbf73] rounded"
                    />
                    <span>Highlight as Hero KPI Card</span>
                  </label>
                </div>
              </div>
            ))}
          </div>

          {/* Formula Methodology Narrative Explanation */}
          <div className="pt-6 border-t border-[#f0f0f0] space-y-3">
            <div>
              <h3 className="text-sm font-bold text-[#222325]">
                Formula Methodology & Mathematical Logic Notes
              </h3>
              <p className="text-xs text-[#74767e] mt-0.5">
                Narrative explanation, proofs, and derivation steps displayed alongside the mathematical formulas on the calculator page.
              </p>
            </div>
            <RichTextEditor
              value={calculator.content?.formulaExplanation || ''}
              onChange={(html) =>
                setCalculator((prev) => ({
                  ...prev,
                  content: { ...(prev.content || {}), formulaExplanation: html },
                }))
              }
              placeholder="Write narrative explanations, calculation steps, formulas, and proofs..."
              minHeight="180px"
            />
          </div>
        </div>
      )}

      {/* TAB 4: Per-Calculator Modules Manager */}
      {activeTab === 'modules' && (
        <div className="bg-white rounded-xl border border-[#e4e5e7] p-6 sm:p-7 space-y-6 shadow-2xs">
          <div className="border-b border-[#f0f0f0] pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-sm font-bold text-[#222325]">Per-Calculator Module Controls & Ordering</h2>
              <p className="text-xs text-[#74767e]">
                Turn individual modules ON or OFF and arrange their exact rendering sequence. Disabled modules disappear completely from the calculator page.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setCalculator((prev) => {
                    const current = [...(prev.modules || getDefaultModuleConfigs())];
                    current.forEach((m) => { m.isEnabled = true; });
                    return { ...prev, modules: current };
                  });
                }}
                className="px-2.5 py-1 bg-[#f4fdf8] hover:bg-[#d8f5e5] text-[#1dbf73] border border-[#d8f5e5] text-xs font-bold rounded-md cursor-pointer transition-colors"
              >
                Enable All
              </button>
              <button
                type="button"
                onClick={() => {
                  setCalculator((prev) => {
                    const current = [...(prev.modules || getDefaultModuleConfigs())];
                    current.forEach((m) => { m.isEnabled = false; });
                    return { ...prev, modules: current };
                  });
                }}
                className="px-2.5 py-1 bg-[#fafafa] hover:bg-[#f0f0f0] text-[#74767e] hover:text-[#222325] border border-[#e4e5e7] text-xs font-bold rounded-md cursor-pointer transition-colors"
              >
                Disable All
              </button>
              <button
                type="button"
                onClick={() => {
                  setCalculator((prev) => ({
                    ...prev,
                    modules: getDefaultModuleConfigs(),
                  }));
                }}
                className="px-2.5 py-1 bg-[#fafafa] hover:bg-[#f0f0f0] text-[#74767e] hover:text-[#222325] border border-[#e4e5e7] text-xs font-bold rounded-md cursor-pointer transition-colors"
              >
                Reset Defaults
              </button>
              <span className="text-xs font-bold text-[#1dbf73] bg-[#f4fdf8] px-3 py-1 rounded-full border border-[#d8f5e5]">
                {enabledModulesCount} Active Modules
              </span>
            </div>
          </div>

          <div className="space-y-3">
            {(calculator.modules || []).map((modConfig, idx) => {
              const regDef = MODULE_REGISTRY.find((r) => r.id === modConfig.moduleId);
              const Icon = regDef?.icon || Layers;

              return (
                <div
                  key={modConfig.id || modConfig.moduleId || idx}
                  className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    modConfig.isEnabled
                      ? 'bg-white border-[#e4e5e7] shadow-2xs hover:border-[#1dbf73]'
                      : 'bg-[#fafafa] border-[#e4e5e7] opacity-65'
                  }`}
                >
                  <div className="flex items-center gap-3.5 flex-1 min-w-0">
                    {/* Reorder Up/Down */}
                    <div className="flex flex-col gap-1 shrink-0">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => handleMoveModule(idx, 'up')}
                        className="p-1 rounded hover:bg-[#f0f0f0] disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5 text-[#74767e]" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === (calculator.modules?.length || 1) - 1}
                        onClick={() => handleMoveModule(idx, 'down')}
                        className="p-1 rounded hover:bg-[#f0f0f0] disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5 text-[#74767e]" />
                      </button>
                    </div>

                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center border shrink-0 ${
                      modConfig.isEnabled ? 'bg-[#f4fdf8] text-[#1dbf73] border-[#d8f5e5]' : 'bg-[#f0f0f0] text-[#95979d] border-[#e4e5e7]'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-extrabold text-[#222325] truncate">
                          {modConfig.name || regDef?.name || modConfig.moduleId}
                        </span>
                        <span className="text-[10px] font-mono text-[#74767e] shrink-0">
                          #{idx + 1}
                        </span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded shrink-0 ${
                          modConfig.isEnabled
                            ? 'bg-[#f4fdf8] text-[#1dbf73] border border-[#d8f5e5]'
                            : 'bg-[#f0f0f0] text-[#74767e] border border-[#e4e5e7]'
                        }`}>
                          {modConfig.isEnabled ? 'ACTIVE' : 'OFF'}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#74767e] line-clamp-1">
                        {regDef?.description || 'Reusable calculator module'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                    {/* Settings configure button */}
                    <button
                      type="button"
                      onClick={() => setEditingModuleSettings(modConfig)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#fafafa] hover:bg-[#f0f0f0] border border-[#e4e5e7] rounded-md text-xs font-bold text-[#404145] transition-colors cursor-pointer"
                    >
                      <Settings2 className="w-3.5 h-3.5 text-[#74767e]" />
                      <span>Settings</span>
                    </button>

                    {/* Interactive Toggle Switch */}
                    <button
                      type="button"
                      role="switch"
                      aria-checked={modConfig.isEnabled}
                      onClick={() => handleToggleModule(modConfig.moduleId)}
                      className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        modConfig.isEnabled ? 'bg-[#1dbf73]' : 'bg-[#d0d2d6]'
                      }`}
                      title={modConfig.isEnabled ? 'Turn OFF Module' : 'Turn ON Module'}
                    >
                      <span className="sr-only">Toggle Module</span>
                      <span
                        aria-hidden="true"
                        className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out flex items-center justify-center text-[9px] font-black ${
                          modConfig.isEnabled
                            ? 'translate-x-7 text-[#1dbf73]'
                            : 'translate-x-0 text-[#74767e]'
                        }`}
                      >
                        {modConfig.isEnabled ? 'ON' : 'OFF'}
                      </span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 5: Rich Content Sections */}
      {activeTab === 'content' && (
        <div className="bg-white rounded-xl border border-[#e4e5e7] p-6 sm:p-7 space-y-6 shadow-2xs">
          <div className="flex items-center justify-between border-b border-[#f0f0f0] pb-4">
            <div>
              <h2 className="text-sm font-bold text-[#222325]">Rich-Text Content Sections</h2>
              <p className="text-xs text-[#74767e]">
                Create formatted guides, formulas, methodology, assumptions, and custom explanatory content.
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddContentSection}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#222325] hover:bg-black text-white text-xs font-bold rounded-lg cursor-pointer transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Content Section</span>
            </button>
          </div>

          <div className="space-y-6">
            {(calculator.contentSections || []).map((sec, idx) => (
              <div
                key={sec.id || idx}
                className="p-5 bg-[#fafafa] rounded-xl border border-[#e4e5e7] space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#e4e5e7] pb-3">
                  <div className="flex items-center gap-3">
                    {/* Reorder */}
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => handleMoveContentSection(idx, 'up')}
                        className="p-1 rounded hover:bg-[#e4e5e7] disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
                      >
                        <ArrowUp className="w-3.5 h-3.5 text-[#74767e]" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === (calculator.contentSections?.length || 1) - 1}
                        onClick={() => handleMoveContentSection(idx, 'down')}
                        className="p-1 rounded hover:bg-[#e4e5e7] disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
                      >
                        <ArrowDown className="w-3.5 h-3.5 text-[#74767e]" />
                      </button>
                    </div>

                    <span className="text-xs font-bold text-[#222325]">Section #{idx + 1}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-1.5 text-xs font-bold text-[#404145] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={sec.isEnabled !== false}
                        onChange={(e) => handleUpdateContentSection(sec.id, { isEnabled: e.target.checked })}
                        className="w-3.5 h-3.5 text-[#1dbf73] accent-[#1dbf73] rounded"
                      />
                      <span>Enabled</span>
                    </label>

                    <button
                      type="button"
                      onClick={() => handleRemoveContentSection(sec.id)}
                      className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
                      title="Delete this section"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-[#74767e] mb-1">Section Title</label>
                    <input
                      type="text"
                      value={sec.title}
                      onChange={(e) => handleUpdateContentSection(sec.id, { title: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-[#e4e5e7] rounded-md text-xs font-bold text-[#222325]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#74767e] mb-1">Section Type</label>
                    <select
                      value={sec.sectionType || 'custom'}
                      onChange={(e) => handleUpdateContentSection(sec.id, { sectionType: e.target.value as any })}
                      className="w-full px-3 py-2 bg-white border border-[#e4e5e7] rounded-md text-xs"
                    >
                      <option value="overview">Overview</option>
                      <option value="how-to">How-to Guide</option>
                      <option value="formula">Formula & Math</option>
                      <option value="methodology">Methodology</option>
                      <option value="assumptions">Assumptions & Rules</option>
                      <option value="pitfalls">Common Pitfalls</option>
                      <option value="custom">Custom Content</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-[#74767e]">
                    Rich-Text Content
                  </label>
                  <RichTextEditor
                    value={sec.htmlContent}
                    onChange={(html) => handleUpdateContentSection(sec.id, { htmlContent: html })}
                    placeholder="Write formatted explanatory copy with headings, lists, tables, and callouts..."
                  />
                </div>
              </div>
            ))}

            {(calculator.contentSections || []).length === 0 && (
              <div className="p-8 bg-[#fafafa] rounded-xl border border-dashed border-[#e4e5e7] text-center space-y-2">
                <p className="text-xs text-[#74767e]">
                  No content sections currently configured. Click &quot;Create Content Section&quot; above to add one.
                </p>
              </div>
            )}

            <div className="flex justify-end pt-3">
              <button
                type="button"
                onClick={() => handleSave()}
                disabled={isSaving}
                className="px-5 py-2.5 bg-[#1dbf73] hover:bg-[#19a463] text-white text-xs font-bold rounded-lg flex items-center gap-2 transition-all cursor-pointer shadow-sm disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? 'Saving...' : 'Save Calculator Sections'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: Worked Examples */}
      {activeTab === 'examples' && (
        <div className="bg-white rounded-xl border border-[#e4e5e7] p-6 sm:p-7 space-y-6 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#f0f0f0] pb-4">
            <div>
              <h2 className="text-sm font-bold text-[#222325]">Worked Examples & Real Scenarios</h2>
              <p className="text-xs text-[#74767e]">
                Add real calculation scenarios, sample input benchmarks, and evaluated outcome summaries.
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddExample}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#222325] hover:bg-black text-white text-xs font-bold rounded-lg cursor-pointer transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Worked Example</span>
            </button>
          </div>

          <div className="space-y-4">
            {(!calculator.examples || calculator.examples.length === 0) ? (
              <div className="p-8 bg-[#fafafa] rounded-xl border border-[#e4e5e7] text-center space-y-2">
                <FileCheck className="w-8 h-8 text-[#74767e] mx-auto opacity-50" />
                <p className="text-xs font-bold text-[#222325]">No custom worked examples configured</p>
                <p className="text-[11px] text-[#74767e]">
                  Click "Add Worked Example" above to add real scenarios with custom benchmarks.
                </p>
              </div>
            ) : (
              calculator.examples.map((ex, idx) => (
                <div
                  key={ex.id || idx}
                  className="p-5 bg-[#fafafa] rounded-xl border border-[#e4e5e7] space-y-3"
                >
                  <div className="flex items-center justify-between border-b border-[#e4e5e7] pb-2.5">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => handleMoveExample(idx, 'up')}
                          className="p-1 rounded hover:bg-[#e4e5e7] disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
                        >
                          <ArrowUp className="w-3.5 h-3.5 text-[#74767e]" />
                        </button>
                        <button
                          type="button"
                          disabled={idx === (calculator.examples?.length || 1) - 1}
                          onClick={() => handleMoveExample(idx, 'down')}
                          className="p-1 rounded hover:bg-[#e4e5e7] disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
                        >
                          <ArrowDown className="w-3.5 h-3.5 text-[#74767e]" />
                        </button>
                      </div>
                      <span className="text-xs font-bold text-[#222325]">Example #{idx + 1}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-1.5 text-xs font-bold text-[#404145] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={ex.isEnabled !== false}
                          onChange={(e) =>
                            handleUpdateExample(ex.id, { isEnabled: e.target.checked })
                          }
                          className="w-3.5 h-3.5 text-[#1dbf73] accent-[#1dbf73] rounded"
                        />
                        <span>Active</span>
                      </label>

                      <button
                        type="button"
                        onClick={() => handleRemoveExample(ex.id)}
                        className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-[#74767e] mb-1">
                        Scenario Title
                      </label>
                      <input
                        type="text"
                        value={ex.title}
                        onChange={(e) => handleUpdateExample(ex.id, { title: e.target.value })}
                        placeholder="e.g. Example 1: 5-Year Loan Benchmark"
                        className="w-full px-3 py-2 bg-white border border-[#e4e5e7] rounded-md text-xs font-bold text-[#222325]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#74767e] mb-1">
                        Outcome Summary / Badge
                      </label>
                      <input
                        type="text"
                        value={ex.resultSummary || ''}
                        onChange={(e) =>
                          handleUpdateExample(ex.id, { resultSummary: e.target.value })
                        }
                        placeholder="e.g. Monthly EMI: ₹10,258 | Total Interest: ₹1,15,480"
                        className="w-full px-3 py-2 bg-white border border-[#e4e5e7] rounded-md text-xs font-mono font-bold text-[#1dbf73]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#74767e] mb-1">
                      Scenario Narrative & Assumptions
                    </label>
                    <textarea
                      rows={3}
                      value={ex.description}
                      onChange={(e) =>
                        handleUpdateExample(ex.id, { description: e.target.value })
                      }
                      placeholder="Describe the context: Suppose an applicant borrows ₹5,00,000 at 8.5% annual interest..."
                      className="w-full px-3 py-2 bg-white border border-[#e4e5e7] rounded-md text-xs text-[#222325]"
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 7: FAQs */}
      {activeTab === 'faqs' && (
        <div className="bg-white rounded-xl border border-[#e4e5e7] p-6 sm:p-7 space-y-6 shadow-2xs">
          <div className="flex items-center justify-between border-b border-[#f0f0f0] pb-4">
            <div>
              <h2 className="text-sm font-bold text-[#222325]">Frequently Asked Questions</h2>
              <p className="text-xs text-[#74767e]">
                Add questions and answers. Used for user guidance and Schema.org FAQPage structured data.
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddFaq}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#222325] hover:bg-black text-white text-xs font-bold rounded-lg cursor-pointer transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add FAQ</span>
            </button>
          </div>

          <div className="space-y-4">
            {(calculator.faqs || []).map((faq, idx) => (
              <div
                key={faq.id || idx}
                className="p-4 sm:p-5 bg-[#fafafa] rounded-xl border border-[#e4e5e7] space-y-3"
              >
                <div className="flex items-center justify-between border-b border-[#e4e5e7] pb-2">
                  <span className="text-xs font-bold text-[#222325]">FAQ #{idx + 1}</span>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-1.5 text-xs font-bold text-[#404145] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={faq.isEnabled !== false}
                        onChange={(e) => handleUpdateFaq(faq.id, { isEnabled: e.target.checked })}
                        className="w-3.5 h-3.5 text-[#1dbf73] accent-[#1dbf73] rounded"
                      />
                      <span>Active</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => handleRemoveFaq(faq.id)}
                      className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-[#74767e]">Question</label>
                  <input
                    type="text"
                    value={faq.question}
                    onChange={(e) => handleUpdateFaq(faq.id, { question: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#e4e5e7] rounded-md text-xs font-bold text-[#222325]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-[#74767e]">Answer</label>
                  <RichTextEditor
                    value={faq.answer}
                    onChange={(html) => handleUpdateFaq(faq.id, { answer: html })}
                    minHeight="120px"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 7: SEO & Meta */}
      {activeTab === 'seo' && (
        <div className="bg-white rounded-xl border border-[#e4e5e7] p-6 sm:p-7 space-y-6 shadow-2xs">
          <div className="border-b border-[#f0f0f0] pb-4">
            <h2 className="text-sm font-bold text-[#222325]">Search Engine & Social Optimization</h2>
            <p className="text-xs text-[#74767e]">
              Configure meta tags, OpenGraph cards, and rich indexing attributes.
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#222325]">Custom SEO Title</label>
              <input
                type="text"
                value={calculator.seoTitle || ''}
                onChange={(e) => setCalculator((prev) => ({ ...prev, seoTitle: e.target.value }))}
                placeholder="e.g. Free Home Loan EMI Calculator with Amortization Schedule (2025)"
                className="w-full px-3.5 py-2.5 bg-white border border-[#e4e5e7] rounded-lg text-sm text-[#222325] focus:outline-none focus:border-[#1dbf73]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#222325]">Meta Description</label>
              <textarea
                rows={3}
                value={calculator.seoDescription || ''}
                onChange={(e) => setCalculator((prev) => ({ ...prev, seoDescription: e.target.value }))}
                placeholder="Calculate your exact monthly EMI, principal-interest ratio, and download repayment schedule..."
                className="w-full px-3.5 py-2.5 bg-white border border-[#e4e5e7] rounded-lg text-sm text-[#222325] focus:outline-none focus:border-[#1dbf73]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#222325]">Keywords (Comma separated)</label>
              <input
                type="text"
                value={calculator.seoKeywords || ''}
                onChange={(e) => setCalculator((prev) => ({ ...prev, seoKeywords: e.target.value }))}
                placeholder="loan calculator, emi calculator, home loan interest, amortization"
                className="w-full px-3.5 py-2.5 bg-white border border-[#e4e5e7] rounded-lg text-sm text-[#222325] focus:outline-none focus:border-[#1dbf73]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#222325]">Canonical URL Override</label>
              <input
                type="url"
                value={calculator.canonicalUrl || ''}
                onChange={(e) => setCalculator((prev) => ({ ...prev, canonicalUrl: e.target.value }))}
                placeholder="https://example.com/finance/loans/home-loan-emi"
                className="w-full px-3.5 py-2.5 bg-white border border-[#e4e5e7] rounded-lg text-sm text-[#222325] focus:outline-none focus:border-[#1dbf73]"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 8: Live Preview */}
      {activeTab === 'preview' && (
        <div className="space-y-6">
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-800">
            <span className="font-bold flex items-center gap-2">
              <Eye className="w-4 h-4 text-[#1dbf73]" />
              Live Interactive Preview with Enabled Modules & Configured Order
            </span>
            <span>{enabledModulesCount} modules enabled</span>
          </div>

          <div className="bg-[#fafafa] p-4 sm:p-6 rounded-2xl border border-[#e4e5e7]">
            <DynamicCalculatorRenderer
              calculator={calculator as Calculator}
              isPreview={true}
            />
          </div>
        </div>
      )}

      {/* Module Settings Modal */}
      {editingModuleSettings && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#e4e5e7] max-w-md w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-[#f0f0f0] pb-3">
              <div>
                <h3 className="text-sm font-bold text-[#222325]">
                  Configure {editingModuleSettings.name}
                </h3>
                <code className="text-[10px] font-mono text-[#74767e]">
                  {editingModuleSettings.moduleId}
                </code>
              </div>
              <button
                type="button"
                onClick={() => setEditingModuleSettings(null)}
                className="text-[#95979d] hover:text-[#222325] text-lg font-bold cursor-pointer"
              >
                &times;
              </button>
            </div>

            {/* Render Schema Inputs */}
            <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
              {MODULE_REGISTRY.find((r) => r.id === editingModuleSettings.moduleId)?.settingsSchema.map((schema) => {
                const currentVal =
                  editingModuleSettings.settings?.[schema.key] !== undefined
                    ? editingModuleSettings.settings[schema.key]
                    : schema.defaultValue;

                return (
                  <div key={schema.key} className="space-y-1">
                    <label className="block text-xs font-bold text-[#222325]">
                      {schema.label}
                    </label>

                    {schema.type === 'select' ? (
                      <select
                        value={currentVal}
                        onChange={(e) => {
                          setEditingModuleSettings({
                            ...editingModuleSettings,
                            settings: {
                              ...editingModuleSettings.settings,
                              [schema.key]: e.target.value,
                            },
                          });
                        }}
                        className="w-full px-3 py-2 bg-white border border-[#e4e5e7] rounded-lg text-xs"
                      >
                        {schema.options?.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    ) : schema.type === 'boolean' ? (
                      <label className="flex items-center gap-2 text-xs text-[#404145] cursor-pointer pt-1">
                        <input
                          type="checkbox"
                          checked={Boolean(currentVal)}
                          onChange={(e) => {
                            setEditingModuleSettings({
                              ...editingModuleSettings,
                              settings: {
                                ...editingModuleSettings.settings,
                                [schema.key]: e.target.checked,
                              },
                            });
                          }}
                          className="w-4 h-4 text-[#1dbf73] accent-[#1dbf73] rounded"
                        />
                        <span>Enable this setting</span>
                      </label>
                    ) : (
                      <input
                        type={schema.type === 'number' ? 'number' : 'text'}
                        value={currentVal ?? ''}
                        onChange={(e) => {
                          const v = schema.type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value;
                          setEditingModuleSettings({
                            ...editingModuleSettings,
                            settings: {
                              ...editingModuleSettings.settings,
                              [schema.key]: v,
                            },
                          });
                        }}
                        className="w-full px-3 py-2 bg-white border border-[#e4e5e7] rounded-lg text-xs"
                      />
                    )}

                    {schema.helpText && (
                      <p className="text-[10px] text-[#74767e]">{schema.helpText}</p>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#f0f0f0]">
              <button
                type="button"
                onClick={() => setEditingModuleSettings(null)}
                className="px-3.5 py-1.5 rounded-lg border border-[#e4e5e7] text-xs font-semibold text-[#62646a] hover:bg-[#fafafa] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() =>
                  handleSaveModuleSettings(editingModuleSettings.id, editingModuleSettings.settings || {})
                }
                className="px-4 py-1.5 bg-[#1dbf73] hover:bg-[#19a463] text-white text-xs font-bold rounded-lg cursor-pointer transition-colors"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
