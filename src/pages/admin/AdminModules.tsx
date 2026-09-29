import React, { useState, useEffect } from 'react';
import {
  MODULE_REGISTRY,
  ModuleDefinition,
  getDefaultModuleConfigs,
} from '../../components/calculator/modules/ModuleRegistry';
import { CalculatorModuleConfig, Calculator } from '../../types/schema.ts';
import { api } from '../../services/api.ts';
import {
  Layers,
  Search,
  CheckCircle2,
  Sliders,
  Eye,
  Settings2,
  Sparkles,
  Info,
  Code2,
  ArrowUp,
  ArrowDown,
  RotateCcw,
  Check,
  X,
  Plus,
  Save,
  ShieldCheck,
  Zap,
  ExternalLink,
  ChevronRight,
  BookOpen,
} from 'lucide-react';



export const AdminModules: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'order' | 'registry' | 'guide'>('order');
  const [calculators, setCalculators] = useState<Calculator[]>([]);
  const [selectedCalcId, setSelectedCalcId] = useState<string>('all');
  const [currentCalc, setCurrentCalc] = useState<Calculator | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [modules, setModulesState] = useState<CalculatorModuleConfig[]>([]);

  const setModules = (value: React.SetStateAction<CalculatorModuleConfig[]>, sourceTag: string = 'unknown') => {
    setModulesState((prev) => {
      const next = typeof value === 'function' ? value(prev) : value;
      console.log(`[MODULE STATE CHANGE: ${sourceTag}]`, {
        urlSearch: window.location.search,
        selectedCalcId,
        count: next.length,
        enabledCount: next.filter((m) => m.isEnabled).length,
        disabledCount: next.filter((m) => !m.isEnabled).length,
        sample: next.slice(0, 3).map((m) => ({ id: m.moduleId, isEnabled: m.isEnabled })),
      });
      return next;
    });
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedModuleDef, setSelectedModuleDef] = useState<ModuleDefinition | null>(null);
  const [editingModule, setEditingModule] = useState<CalculatorModuleConfig | null>(null);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    console.log('[MOUNT] AdminModules mounted at:', new Date().toISOString(), 'URL:', window.location.href);
    return () => {
      console.log('[UNMOUNT] AdminModules unmounted at:', new Date().toISOString());
    };
  }, []);

  // Load calculators and initial modules from database
  useEffect(() => {
    async function loadInitial() {
      try {
        setIsLoading(true);
        console.log('[LOAD_INITIAL START]', { url: window.location.href, search: window.location.search });
        const list = await api.adminGetCalculators();
        console.log('[LOAD_INITIAL GET CALCULATORS SUCCESS]', { listCount: list.length });
        setCalculators(list);

        const urlParams = new URLSearchParams(window.location.search);
        const preselectId = urlParams.get('calculatorId');

        if (preselectId && list.length > 0) {
          const found = list.find((c) => c.id === preselectId || c.slug === preselectId);
          console.log('[LOAD_INITIAL FOUND MATCH]', { preselectId, foundId: found?.id, foundName: found?.name, modulesCount: found?.modules?.length });
          if (found) {
            setSelectedCalcId(found.id);
            setCurrentCalc(found);
            const initialMods = found.modules && Array.isArray(found.modules) ? found.modules : [];
            setModules(initialMods, 'loadInitial:foundInList');
            return;
          }
        }

        console.log('[LOAD_INITIAL NO PRESELECT MATCH -> ALL]');
        setSelectedCalcId('all');
        setCurrentCalc(null);
        setModules([], 'loadInitial:noPreselect');
      } catch (err: any) {
        console.error('Failed to load calculators:', err);
        setErrorMessage(err.message || 'Failed to load calculators.');
        setModules([], 'loadInitial:error');
      } finally {
        setIsLoading(false);
      }
    }

    loadInitial();

    const handlePopState = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const preselectId = urlParams.get('calculatorId');
      console.log('[POPSTATE NAV EVENT]', { preselectId });
      if (preselectId) {
        handleSelectCalculator(preselectId, true);
      } else {
        handleSelectCalculator('all', true);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // When changing selected calculator
  const handleSelectCalculator = async (calcId: string, skipPush: boolean = false) => {
    console.log('[SELECT CALCULATOR START]', { calcId, skipPush });
    setSelectedCalcId(calcId);
    setSaveSuccessMessage(null);
    setErrorMessage(null);

    if (!skipPush) {
      const newUrl =
        calcId === 'all'
          ? window.location.pathname
          : `${window.location.pathname}?calculatorId=${encodeURIComponent(calcId)}`;
      window.history.pushState({}, '', newUrl);
    }

    if (calcId === 'all') {
      setCurrentCalc(null);
      setModules([], 'handleSelectCalculator:all');
      return;
    }

    try {
      setIsLoading(true);
      const fullData = await api.adminGetCalculator(calcId);
      console.log('[SELECT CALCULATOR GET SINGLE SUCCESS]', { calcId, name: fullData.name, modulesCount: fullData.modules?.length });
      setCurrentCalc(fullData);
      if (fullData.modules && Array.isArray(fullData.modules)) {
        setModules(fullData.modules, 'handleSelectCalculator:single');
      } else {
        setModules([], 'handleSelectCalculator:singleEmpty');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to load calculator configuration.');
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle individual module ON / OFF
  const handleToggleModule = (moduleId: string) => {
    setModules(
      (prev) => prev.map((m) => (m.moduleId === moduleId ? { ...m, isEnabled: !m.isEnabled } : m)),
      'handleToggleModule'
    );
  };

  // Enable All modules
  const handleEnableAll = () => {
    setModules((prev) => prev.map((m) => ({ ...m, isEnabled: true })), 'handleEnableAll');
  };

  // Disable All modules
  const handleDisableAll = () => {
    setModules((prev) => prev.map((m) => ({ ...m, isEnabled: false })), 'handleDisableAll');
  };

  // Reset to default ordering and status
  const handleResetDefaults = () => {
    setModules(getDefaultModuleConfigs(), 'handleResetDefaults');
  };

  // Move module up in order
  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const sorted = [...modules].sort((a, b) => (a.order || 0) - (b.order || 0));
    const temp = sorted[index];
    sorted[index] = sorted[index - 1];
    sorted[index - 1] = temp;
    const updated = sorted.map((m, idx) => ({ ...m, order: idx + 1 }));
    setModules(updated, 'handleMoveUp');
  };

  // Move module down in order
  const handleMoveDown = (index: number) => {
    const sorted = [...modules].sort((a, b) => (a.order || 0) - (b.order || 0));
    if (index === sorted.length - 1) return;
    const temp = sorted[index];
    sorted[index] = sorted[index + 1];
    sorted[index + 1] = temp;
    const updated = sorted.map((m, idx) => ({ ...m, order: idx + 1 }));
    setModules(updated, 'handleMoveDown');
  };

  // Save module settings from modal
  const handleSaveSettings = (moduleId: string, newSettings: Record<string, any>) => {
    setModules(
      (prev) => prev.map((m) => (m.moduleId === moduleId ? { ...m, settings: newSettings } : m)),
      'handleSaveSettings'
    );
    setEditingModule(null);
  };

  // Persist modules to backend database
  const handleSaveToDatabase = async () => {
    try {
      setIsSaving(true);
      setErrorMessage(null);
      setSaveSuccessMessage(null);

      if (selectedCalcId === 'all') {
        // Apply to all calculators
        const res = await api.adminApplyModulesToAll(modules);
        setCalculators((prev) => prev.map((c) => ({ ...c, modules })));
        setSaveSuccessMessage(`Successfully applied module configuration to all ${res.count} calculators in the database!`);
      } else if (currentCalc) {
        // Save to specific calculator
        const updated = await api.adminUpdateCalculator(currentCalc.id, {
          modules,
        });
        setCurrentCalc(updated);
        setCalculators((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
        setSaveSuccessMessage(`Module configuration for "${currentCalc.name}" saved to database successfully!`);
      }

      setTimeout(() => setSaveSuccessMessage(null), 4000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to save module configuration to database.');
    } finally {
      setIsSaving(false);
    }
  };

  // Apply to all calculators button
  const handleApplyToAllCalculators = async () => {
    try {
      setIsSaving(true);
      setErrorMessage(null);
      const res = await api.adminApplyModulesToAll(modules);
      setSaveSuccessMessage(`Successfully synchronized module configuration across all ${res.count} calculators!`);
      setTimeout(() => setSaveSuccessMessage(null), 4000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to apply modules to all calculators.');
    } finally {
      setIsSaving(false);
    }
  };

  const categories = [
    { id: 'all', label: 'All Modules' },
    { id: 'core', label: 'Core Engines' },
    { id: 'visualization', label: 'Visualization' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'content', label: 'Content & Guides' },
    { id: 'interactive', label: 'Interactive' },
  ];

  const sortedModules = [...modules].sort((a, b) => (a.order || 0) - (b.order || 0));
  const enabledCount = modules.filter((m) => m.isEnabled).length;
  const disabledCount = modules.filter((m) => !m.isEnabled).length;

  const filteredRegistry = MODULE_REGISTRY.filter((mod) => {
    const matchesSearch =
      mod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mod.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mod.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || mod.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e4e5e7] pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#1dbf73] uppercase tracking-wider mb-1">
            <Layers className="w-4 h-4" />
            <span>Architecture & Controls</span>
          </div>
          <h1 className="text-2xl font-black text-[#222325]">Calculator Modules & Pipeline Controls</h1>
          <p className="text-sm text-[#74767e] mt-1">
            Manage activation, display ordering, and settings for each calculation module. Changes save directly to the live database.
          </p>
        </div>

        {/* Global Summary Badge & Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="px-3 py-1.5 bg-[#f4fdf8] text-[#1dbf73] font-bold text-xs rounded-lg border border-[#d8f5e5] flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{enabledCount} Active</span>
          </span>
          <span className="px-3 py-1.5 bg-[#fafafa] text-[#74767e] font-bold text-xs rounded-lg border border-[#e4e5e7]">
            {disabledCount} Off
          </span>

          <button
            type="button"
            onClick={handleSaveToDatabase}
            disabled={isSaving}
            className="px-4 py-2 bg-[#1dbf73] hover:bg-[#19a463] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all shadow-sm cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving to DB...' : 'Save Module Configuration'}</span>
          </button>
        </div>
      </div>

      {/* Calculator Target Bar */}
      <div className="p-4 bg-white rounded-xl border border-[#e4e5e7] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-bold text-[#222325] shrink-0">Configure Modules For:</span>
          <select
            value={selectedCalcId}
            onChange={(e) => handleSelectCalculator(e.target.value)}
            className="px-3.5 py-2 bg-[#fafafa] border border-[#e4e5e7] rounded-lg text-xs font-bold text-[#222325] focus:outline-none focus:border-[#1dbf73]"
          >
            <option value="all">⚡ Global Template (Apply to All Calculators)</option>
            {calculators.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} (/{c.slug})
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3">
          {currentCalc && (
            <a
              href={`/${(currentCalc as any).category?.slug || 'calc'}/${(currentCalc as any).subcategory?.slug || 'sub'}/${currentCalc.slug}`}
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-1.5 bg-[#f4fdf8] hover:bg-[#e8faef] text-[#1dbf73] border border-[#d8f5e5] rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>View Live Calculator Page</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}

          <button
            type="button"
            onClick={handleApplyToAllCalculators}
            disabled={isSaving}
            className="px-3 py-1.5 bg-[#222325] hover:bg-black text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer"
            title="Copy current module settings to all calculators in directory"
          >
            <Zap className="w-3.5 h-3.5 text-[#1dbf73]" />
            <span>Apply to All Calculators</span>
          </button>
        </div>
      </div>

      {/* Status Notifications */}
      {saveSuccessMessage && (
        <div className="p-4 bg-[#f4fdf8] border border-[#d8f5e5] rounded-xl flex items-center justify-between text-xs font-bold text-[#1dbf73] animate-fade-in shadow-2xs">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            <span>{saveSuccessMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setSaveSuccessMessage(null)}
            className="text-[#1dbf73] hover:text-[#19a463] cursor-pointer text-lg leading-none"
          >
            &times;
          </button>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center justify-between text-xs font-bold text-rose-700">
          <span>{errorMessage}</span>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="text-rose-700 hover:text-rose-900 cursor-pointer text-lg leading-none"
          >
            &times;
          </button>
        </div>
      )}

      {/* Main Tab Navigation & Content */}
      {isLoading ? (
        <div className="p-16 text-center text-xs text-[#74767e] bg-white rounded-xl border border-[#e4e5e7] space-y-3">
          <div className="w-6 h-6 border-2 border-[#1dbf73] border-t-transparent rounded-full animate-spin mx-auto" />
          <p>Loading module configuration from database...</p>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2 border-b border-[#e4e5e7]">
            <button
              type="button"
              onClick={() => setActiveTab('order')}
              className={`pb-3 px-4 text-sm font-bold border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'order'
                  ? 'border-[#1dbf73] text-[#1dbf73]'
                  : 'border-transparent text-[#74767e] hover:text-[#222325]'
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span>Modules & Display Order</span>
              <span className="px-2 py-0.5 text-[10px] font-extrabold rounded-full bg-[#f4fdf8] text-[#1dbf73] border border-[#d8f5e5]">
                {enabledCount}/{MODULE_REGISTRY.length} ON
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('registry')}
              className={`pb-3 px-4 text-sm font-bold border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'registry'
                  ? 'border-[#1dbf73] text-[#1dbf73]'
                  : 'border-transparent text-[#74767e] hover:text-[#222325]'
              }`}
            >
              <Code2 className="w-4 h-4" />
              <span>Module Registry & Specs</span>
              <span className="px-2 py-0.5 text-[10px] font-extrabold rounded-full bg-[#fafafa] text-[#74767e] border border-[#e4e5e7]">
                {MODULE_REGISTRY.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('guide')}
              className={`pb-3 px-4 text-sm font-bold border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'guide'
                  ? 'border-[#1dbf73] text-[#1dbf73]'
                  : 'border-transparent text-[#74767e] hover:text-[#222325]'
              }`}
            >
              <Info className="w-4 h-4" />
              <span>Architecture Guide</span>
            </button>
          </div>

      {/* TAB 1: MODULES & ORDER */}
      {activeTab === 'order' && (
        <div className="space-y-6">
          {selectedCalcId === 'all' && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-3 text-xs text-amber-900 font-bold">
              <Info className="w-5 h-5 text-amber-700 shrink-0" />
              <span>No specific calculator is currently selected. Please select a specific calculator from the dropdown above to edit its modules, or arrange modules here and click "Apply to All Calculators" to broadcast the configuration globally.</span>
            </div>
          )}

          {/* Action Bar with Enable All / Disable All / Reset Defaults */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-[#fafafa] rounded-xl border border-[#e4e5e7]">
            <div className="space-y-0.5">
              <h2 className="text-sm font-bold text-[#222325]">Module Pipeline Management</h2>
              <p className="text-xs text-[#74767e]">
                {selectedCalcId === 'all'
                  ? 'Configuring global template. Changes can be applied to all calculators.'
                  : `Configuring modules specifically for "${currentCalc?.name || 'Selected Calculator'}".`}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleEnableAll}
                className="px-3 py-1.5 bg-[#f4fdf8] hover:bg-[#e8faef] text-[#1dbf73] border border-[#d8f5e5] rounded-md text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Enable All</span>
              </button>

              <button
                type="button"
                onClick={handleDisableAll}
                className="px-3 py-1.5 bg-[#fff1f2] hover:bg-[#ffe4e6] text-rose-600 border border-rose-200 rounded-md text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <X className="w-3.5 h-3.5" />
                <span>Disable All</span>
              </button>

              <button
                type="button"
                onClick={handleResetDefaults}
                className="px-3 py-1.5 bg-white hover:bg-[#f5f5f5] text-[#404145] border border-[#e4e5e7] rounded-md text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Defaults</span>
              </button>
            </div>
          </div>

          {/* Module List with Order & Toggles */}
          <div className="space-y-3">
            {sortedModules.map((modConfig, idx) => {
              const def = MODULE_REGISTRY.find((r) => r.id === modConfig.moduleId);
              const isFirst = idx === 0;
              const isLast = idx === sortedModules.length - 1;

              return (
                <div
                  key={modConfig.moduleId}
                  className={`p-4 sm:p-5 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    modConfig.isEnabled
                      ? 'bg-white border-[#e4e5e7] shadow-2xs hover:border-[#1dbf73]'
                      : 'bg-[#fafafa] border-[#f0f0f0] opacity-75'
                  }`}
                >
                  <div className="flex items-start sm:items-center gap-3">
                    {/* Reordering Up / Down buttons */}
                    <div className="flex sm:flex-col gap-1 shrink-0 pt-0.5 sm:pt-0">
                      <button
                        type="button"
                        disabled={isFirst}
                        onClick={() => handleMoveUp(idx)}
                        className="p-1 rounded hover:bg-[#f0f0f0] disabled:opacity-25 cursor-pointer disabled:cursor-not-allowed"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5 text-[#74767e]" />
                      </button>
                      <button
                        type="button"
                        disabled={isLast}
                        onClick={() => handleMoveDown(idx)}
                        className="p-1 rounded hover:bg-[#f0f0f0] disabled:opacity-25 cursor-pointer disabled:cursor-not-allowed"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5 text-[#74767e]" />
                      </button>
                    </div>

                    {/* Step Number Badge */}
                    <div className="w-7 h-7 rounded-full bg-[#fafafa] border border-[#e4e5e7] text-xs font-bold flex items-center justify-center text-[#404145] shrink-0 font-mono">
                      {idx + 1}
                    </div>

                    {/* Module Info */}
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-xs sm:text-sm font-bold text-[#222325]">
                          {def?.name || modConfig.name}
                        </h3>
                        <span className="px-2 py-0.5 bg-[#fafafa] text-[#74767e] text-[10px] font-mono rounded border border-[#e4e5e7]">
                          {modConfig.moduleId}
                        </span>
                        {def?.category && (
                          <span className="px-2 py-0.5 bg-[#f4fdf8] text-[#1dbf73] text-[10px] font-bold uppercase rounded border border-[#d8f5e5]">
                            {def.category}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#74767e] line-clamp-1">
                        {def?.description || 'Modular calculator engine section.'}
                      </p>
                    </div>
                  </div>

                  {/* Actions & Toggles */}
                  <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                    <button
                      type="button"
                      onClick={() => setEditingModule(modConfig)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#fafafa] hover:bg-[#f0f0f0] border border-[#e4e5e7] rounded-md text-xs font-bold text-[#404145] transition-colors cursor-pointer"
                    >
                      <Settings2 className="w-3.5 h-3.5 text-[#74767e]" />
                      <span>Settings</span>
                    </button>

                    {/* Interactive Switch */}
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

          {/* Bottom Save Bar */}
          <div className="p-4 bg-white rounded-xl border border-[#e4e5e7] flex items-center justify-between shadow-2xs">
            <span className="text-xs text-[#74767e]">
              Changes to module order and activation state take effect immediately upon saving.
            </span>
            <button
              type="button"
              onClick={handleSaveToDatabase}
              disabled={isSaving}
              className="px-5 py-2.5 bg-[#1dbf73] hover:bg-[#19a463] text-white text-xs font-bold rounded-lg flex items-center gap-2 transition-all shadow-sm cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving to Database...' : 'Save Module Configuration'}</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: MODULE REGISTRY */}
      {activeTab === 'registry' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#74767e]" />
              <input
                type="text"
                placeholder="Search modules by name, ID, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white border border-[#e4e5e7] rounded-lg text-xs focus:outline-none focus:border-[#1dbf73]"
              />
            </div>

            <div className="flex flex-wrap gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-[#1dbf73] text-white'
                      : 'bg-white border border-[#e4e5e7] text-[#404145] hover:bg-[#fafafa]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRegistry.map((mod) => (
              <div
                key={mod.id}
                className="p-5 bg-white rounded-xl border border-[#e4e5e7] space-y-3 hover:border-[#1dbf73] transition-colors shadow-2xs flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 bg-[#f4fdf8] text-[#1dbf73] text-[10px] font-bold uppercase rounded border border-[#d8f5e5]">
                      {mod.category}
                    </span>
                    <code className="text-[11px] font-mono text-[#74767e]">{mod.id}</code>
                  </div>
                  <h3 className="text-sm font-bold text-[#222325]">{mod.name}</h3>
                  <p className="text-xs text-[#74767e] leading-relaxed">{mod.description}</p>
                </div>

                <div className="pt-3 border-t border-[#f0f0f0] flex items-center justify-between text-xs">
                  <button
                    type="button"
                    onClick={() => setSelectedModuleDef(mod)}
                    className="text-[#1dbf73] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>View Specifications</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: ARCHITECTURE GUIDE */}
      {activeTab === 'guide' && (
        <div className="bg-white rounded-xl border border-[#e4e5e7] p-6 sm:p-7 space-y-6 shadow-2xs">
          <div className="space-y-2 border-b border-[#f0f0f0] pb-4">
            <h2 className="text-base font-bold text-[#222325]">
              Modular Architecture & Rendering Pipeline
            </h2>
            <p className="text-xs text-[#74767e] leading-relaxed">
              Every calculator in CalcPlatform is rendered through a pipeline of plug-and-play UI and math modules.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-[#fafafa] rounded-xl border border-[#e4e5e7] space-y-2">
              <div className="w-8 h-8 rounded-lg bg-[#f4fdf8] text-[#1dbf73] flex items-center justify-center font-bold text-xs">
                1
              </div>
              <h3 className="text-xs font-bold text-[#222325]">Data Layer</h3>
              <p className="text-[11px] text-[#74767e] leading-normal">
                Input fields, parameter states, and output expressions evaluate instantaneously using mathjs formulas.
              </p>
            </div>

            <div className="p-4 bg-[#fafafa] rounded-xl border border-[#e4e5e7] space-y-2">
              <div className="w-8 h-8 rounded-lg bg-[#f4fdf8] text-[#1dbf73] flex items-center justify-center font-bold text-xs">
                2
              </div>
              <h3 className="text-xs font-bold text-[#222325]">Pipeline Sequence</h3>
              <p className="text-[11px] text-[#74767e] leading-normal">
                Active modules execute according to their numeric order index, ensuring inputs precede outputs and charts.
              </p>
            </div>

            <div className="p-4 bg-[#fafafa] rounded-xl border border-[#e4e5e7] space-y-2">
              <div className="w-8 h-8 rounded-lg bg-[#f4fdf8] text-[#1dbf73] flex items-center justify-center font-bold text-xs">
                3
              </div>
              <h3 className="text-xs font-bold text-[#222325]">Live Synchronization</h3>
              <p className="text-[11px] text-[#74767e] leading-normal">
                Module configuration updates saved in Admin immediately propagate to the public calculator page.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Module Settings Modal */}
      {editingModule && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-5 shadow-xl border border-[#e4e5e7]">
            <div className="flex items-center justify-between border-b border-[#f0f0f0] pb-3">
              <h3 className="text-sm font-bold text-[#222325]">
                Configure Module: {editingModule.name}
              </h3>
              <button
                type="button"
                onClick={() => setEditingModule(null)}
                className="text-[#74767e] hover:text-[#222325] text-lg font-bold cursor-pointer"
              >
                &times;
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-[#222325]">Custom Section Title</label>
                <input
                  type="text"
                  defaultValue={editingModule.settings?.title || ''}
                  id="modal-setting-title"
                  placeholder="e.g. Primary Parameters"
                  className="w-full px-3 py-2 bg-[#fafafa] border border-[#e4e5e7] rounded-md text-xs"
                />
              </div>

              {editingModule.moduleId === 'calculator-inputs' && (
                <div className="space-y-1">
                  <label className="font-bold text-[#222325]">Layout Style</label>
                  <select
                    id="modal-setting-layout"
                    defaultValue={editingModule.settings?.layout || 'two-column'}
                    className="w-full px-3 py-2 bg-[#fafafa] border border-[#e4e5e7] rounded-md text-xs"
                  >
                    <option value="single">Single Column</option>
                    <option value="two-column">Two Columns</option>
                  </select>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#f0f0f0]">
              <button
                type="button"
                onClick={() => setEditingModule(null)}
                className="px-3 py-1.5 bg-[#fafafa] text-[#74767e] rounded-md text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  const titleInput = document.getElementById('modal-setting-title') as HTMLInputElement;
                  const layoutSelect = document.getElementById('modal-setting-layout') as HTMLSelectElement;
                  const newSettings: Record<string, any> = {
                    ...(editingModule.settings || {}),
                    title: titleInput ? titleInput.value : undefined,
                  };
                  if (layoutSelect) {
                    newSettings.layout = layoutSelect.value;
                  }
                  handleSaveSettings(editingModule.moduleId, newSettings);
                }}
                className="px-4 py-1.5 bg-[#1dbf73] text-white rounded-md text-xs font-bold"
              >
                Apply Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Module Specifications Modal */}
      {selectedModuleDef && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl border border-[#e4e5e7]">
            <div className="flex items-center justify-between border-b border-[#f0f0f0] pb-3">
              <div>
                <h3 className="text-sm font-bold text-[#222325]">{selectedModuleDef.name}</h3>
                <code className="text-[10px] font-mono text-[#74767e]">{selectedModuleDef.id}</code>
              </div>
              <button
                type="button"
                onClick={() => setSelectedModuleDef(null)}
                className="text-[#74767e] hover:text-[#222325] text-lg font-bold cursor-pointer"
              >
                &times;
              </button>
            </div>

            <p className="text-xs text-[#404145] leading-relaxed">
              {selectedModuleDef.description}
            </p>

            <div className="p-3 bg-[#fafafa] rounded-lg border border-[#e4e5e7] space-y-1 text-xs">
              <span className="font-bold text-[#222325]">Settings Schema:</span>
              <pre className="text-[11px] font-mono text-[#404145] overflow-x-auto">
                {JSON.stringify(selectedModuleDef.settingsSchema, null, 2)}
              </pre>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelectedModuleDef(null)}
                className="px-4 py-2 bg-[#222325] text-white rounded-lg text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
        </>
      )}
    </div>
  );
};
