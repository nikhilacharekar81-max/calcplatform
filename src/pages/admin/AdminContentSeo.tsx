import React, { useState, useEffect } from 'react';
import { api } from '../../services/api.ts';
import { Calculator, ContentSection, CalculatorFAQ, CalculatorExample, CalculatorModuleConfig } from '../../types/schema.ts';
import { RichTextEditor } from '../../components/admin/RichTextEditor.tsx';
import {
  FileText,
  Search,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Save,
  Globe,
  HelpCircle,
  BookOpen,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Code2,
  Info,
  Eye,
  Sliders,
  FileCheck,
  Layers,
  Award,
  ChevronRight,
} from 'lucide-react';

export const AdminContentSeo: React.FC = () => {
  const [calculators, setCalculators] = useState<Calculator[]>([]);
  const [selectedCalcId, setSelectedCalcId] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<
    'how-to' | 'examples' | 'formula' | 'assumptions' | 'content' | 'faqs' | 'seo'
  >('how-to');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Custom in-app confirmation modal (avoids iframe-blocked window.confirm)
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    action: () => Promise<void> | void;
  } | null>(null);

  // Active calculator state
  const [currentCalc, setCurrentCalc] = useState<Calculator | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const list = await api.adminGetCalculators();
        setCalculators(list);
        if (list.length > 0) {
          const urlParams = new URLSearchParams(window.location.search);
          const preselectId = urlParams.get('calculatorId');
          const preselectTab = urlParams.get('tab') as any;
          if (
            preselectTab &&
            ['how-to', 'examples', 'formula', 'assumptions', 'content', 'faqs', 'seo'].includes(
              preselectTab
            )
          ) {
            setActiveTab(preselectTab);
          }

          let target = list[0];
          if (preselectId) {
            const found = list.find((c) => c.id === preselectId || c.slug === preselectId);
            if (found) target = found;
          }
          setSelectedCalcId(target.id);
          const fullData = await api.adminGetCalculator(target.id);
          setCurrentCalc(fullData);
        }
      } catch (err: any) {
        setErrorMessage(err.message || 'Failed to load calculators list.');
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSelectCalculator = async (calcId: string) => {
    setSelectedCalcId(calcId);
    try {
      setIsLoading(true);
      const fullData = await api.adminGetCalculator(calcId);
      setCurrentCalc(fullData);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to load selected calculator.');
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to get or update a module's settings (e.g. custom title)
  const getModuleTitle = (moduleId: string, fallback: string = '') => {
    if (!currentCalc) return '';
    const mod = currentCalc.modules?.find((m) => m.moduleId === moduleId);
    if (mod && mod.settings && typeof mod.settings.title === 'string') {
      return mod.settings.title;
    }
    // Check if configured in contentSections
    if (moduleId === 'how-to-guide') {
      const sec = currentCalc.contentSections?.find(
        (s) => s.sectionType === 'how-to' || s.title?.toLowerCase().includes('how to')
      );
      if (sec && typeof sec.title === 'string') {
        return sec.title;
      }
    } else if (moduleId === 'assumptions-info') {
      const sec = currentCalc.contentSections?.find(
        (s) => s.sectionType === 'assumptions' || s.title?.toLowerCase().includes('assumption')
      );
      if (sec && typeof sec.title === 'string') {
        return sec.title;
      }
    } else if (moduleId === 'formula-methodology') {
      const sec = currentCalc.contentSections?.find(
        (s) => s.sectionType === 'formula' || s.title?.toLowerCase().includes('formula')
      );
      if (sec && typeof sec.title === 'string') {
        return sec.title;
      }
    }
    return fallback;
  };

  const updateModuleTitle = (moduleId: string, newTitle: string) => {
    if (!currentCalc) return;
    const mods = currentCalc.modules ? [...currentCalc.modules] : [];
    const idx = mods.findIndex((m) => m.moduleId === moduleId);
    if (idx >= 0) {
      mods[idx] = {
        ...mods[idx],
        settings: { ...(mods[idx].settings || {}), title: newTitle },
      };
    } else {
      mods.push({
        id: `mod_${moduleId}`,
        moduleId,
        name: newTitle || moduleId,
        isEnabled: true,
        order: mods.length + 1,
        settings: { title: newTitle },
      });
    }

    // Also sync the corresponding contentSections title so it never restores old title
    let updatedSections = currentCalc.contentSections ? [...currentCalc.contentSections] : [];
    if (moduleId === 'how-to-guide') {
      updatedSections = updatedSections.map((s) =>
        (s.sectionType === 'how-to' || s.title?.toLowerCase().includes('how to'))
          ? { ...s, title: newTitle }
          : s
      );
    } else if (moduleId === 'assumptions-info') {
      updatedSections = updatedSections.map((s) =>
        (s.sectionType === 'assumptions' || s.title?.toLowerCase().includes('assumption'))
          ? { ...s, title: newTitle }
          : s
      );
    } else if (moduleId === 'formula-methodology') {
      updatedSections = updatedSections.map((s) =>
        (s.sectionType === 'formula' || s.title?.toLowerCase().includes('formula'))
          ? { ...s, title: newTitle }
          : s
      );
    }

    setCurrentCalc({
      ...currentCalc,
      modules: mods,
      contentSections: updatedSections,
    });
  };

  const isModuleEnabled = (moduleId: string): boolean => {
    if (!currentCalc) return false;
    const mod = currentCalc.modules?.find((m) => m.moduleId === moduleId);
    if (mod) {
      return mod.isEnabled !== false;
    }
    if (moduleId === 'how-to-guide') {
      const guide = getHowToContent();
      return Boolean(guide && guide.trim().length > 0);
    }
    if (moduleId === 'worked-examples') {
      return Boolean(currentCalc.examples && currentCalc.examples.length > 0);
    }
    if (moduleId === 'formula-methodology') {
      const formula = currentCalc.content?.formulaExplanation;
      return Boolean(formula && formula.trim().length > 0);
    }
    if (moduleId === 'assumptions-info') {
      const assumptions = getAssumptionsContent();
      return Boolean(assumptions && assumptions.trim().length > 0);
    }
    return true;
  };

  const toggleModuleEnabled = async (moduleId: string, enabled: boolean) => {
    if (!currentCalc) return;
    const mods = [...(currentCalc.modules || [])];
    const modIdx = mods.findIndex((m) => m.moduleId === moduleId);
    if (modIdx >= 0) {
      mods[modIdx] = { ...mods[modIdx], isEnabled: enabled };
    } else {
      mods.push({
        id: `mod_${moduleId}`,
        moduleId: moduleId as any,
        name: moduleId,
        isEnabled: enabled,
        order: mods.length + 1,
        settings: {},
      });
    }

    const updatedSections = (currentCalc.contentSections || []).map((sec) => {
      const isMatch =
        (moduleId === 'how-to-guide' && (sec.sectionType === 'how-to' || sec.title?.toLowerCase().includes('how to'))) ||
        (moduleId === 'formula-methodology' && (sec.sectionType === 'formula' || sec.title?.toLowerCase().includes('formula'))) ||
        (moduleId === 'assumptions-info' && (sec.sectionType === 'assumptions' || sec.title?.toLowerCase().includes('assumption')));
      if (isMatch) {
        return { ...sec, isEnabled: enabled };
      }
      return sec;
    });

    const updatedCalc: Calculator = {
      ...currentCalc,
      modules: mods,
      contentSections: updatedSections,
    };

    setCurrentCalc(updatedCalc);

    try {
      setIsSaving(true);
      await api.adminUpdateCalculator(currentCalc.id, updatedCalc);
      setSuccessMessage(`Section "${moduleId}" is now ${enabled ? 'ACTIVE' : 'DISABLED'} on the live calculator.`);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to update section status.');
    } finally {
      setIsSaving(false);
    }
  };

  // Content Sections management
  const handleAddSection = () => {
    if (!currentCalc) return;
    const newSec: ContentSection = {
      id: `sec_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      title: 'New Educational Guide & Methodology',
      sectionType: 'overview',
      htmlContent: '<p>Write clear, educational content explaining the mathematical formula, practical use cases, and regulatory rules...</p>',
      isEnabled: true,
      order: (currentCalc.contentSections?.length || 0) + 1,
    };
    setCurrentCalc({
      ...currentCalc,
      contentSections: [...(currentCalc.contentSections || []), newSec],
    });
  };

  const handleUpdateSection = (secIdOrIndex: string | number, updates: Partial<ContentSection>) => {
    if (!currentCalc || !currentCalc.contentSections) return;
    const updated = currentCalc.contentSections.map((s: ContentSection, idx: number) => {
      if (typeof secIdOrIndex === 'number') {
        return idx === secIdOrIndex ? { ...s, ...updates } : s;
      }
      return (s.id === secIdOrIndex || idx.toString() === secIdOrIndex) ? { ...s, ...updates } : s;
    });
    setCurrentCalc({
      ...currentCalc,
      contentSections: updated,
    });
  };

  const handleRemoveSection = async (secIdOrIndex: string | number) => {
    if (!currentCalc || !currentCalc.contentSections) return;
    const sections = [...currentCalc.contentSections];
    let targetSection: ContentSection | undefined;
    let remaining: ContentSection[] = [];

    if (typeof secIdOrIndex === 'number') {
      targetSection = sections[secIdOrIndex];
      remaining = sections.filter((_, idx) => idx !== secIdOrIndex);
    } else {
      targetSection = sections.find((s, idx) => s.id === secIdOrIndex || idx.toString() === secIdOrIndex);
      remaining = sections.filter((s, idx) => s.id !== secIdOrIndex && idx.toString() !== secIdOrIndex);
    }

    if (!targetSection && typeof secIdOrIndex === 'string') {
      targetSection = sections.find((s) => s.id === secIdOrIndex);
      remaining = sections.filter((s) => s.id !== secIdOrIndex);
    }

    const title = targetSection?.title || 'this section';
    const executeRemove = async () => {
      // Renumber remaining sections
      const updatedSections = remaining.map((s, idx) => ({ ...s, order: idx + 1 }));

      const isHowTo =
        targetSection?.sectionType === 'how-to' ||
        targetSection?.title?.toLowerCase().includes('how to');
      const isFormula =
        targetSection?.sectionType === 'formula' ||
        targetSection?.title?.toLowerCase().includes('formula');

      const updatedContent = {
        ...(currentCalc.content || { formulaExplanation: '', usageInstructions: '', faqs: [] }),
      };
      if (isHowTo) updatedContent.usageInstructions = '';
      if (isFormula) updatedContent.formulaExplanation = '';

      const updatedCalc: Calculator = {
        ...currentCalc,
        contentSections: updatedSections,
        content: updatedContent,
      };

      setCurrentCalc(updatedCalc);
      setConfirmModal(null);

      // Save deletion immediately to API backend to prevent it from reappearing
      try {
        setIsSaving(true);
        await api.adminUpdateCalculator(currentCalc.id, updatedCalc);
        setSuccessMessage(`Section "${title}" was permanently deleted and saved.`);
        setTimeout(() => setSuccessMessage(null), 3500);
      } catch (err: any) {
        setErrorMessage(err.message || 'Failed to save deletion to server.');
      } finally {
        setIsSaving(false);
      }
    };

    setConfirmModal({
      isOpen: true,
      title: `Delete "${title}"?`,
      message: 'Are you sure you want to permanently delete this content section from the calculator?',
      confirmLabel: 'Delete Section',
      action: executeRemove,
    });
  };

  const handleMoveSection = (index: number, direction: 'up' | 'down') => {
    if (!currentCalc || !currentCalc.contentSections) return;
    const sections = [...currentCalc.contentSections];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sections.length) return;

    const temp = sections[index];
    sections[index] = sections[targetIndex];
    sections[targetIndex] = temp;

    const updated = sections.map((s: ContentSection, idx: number) => ({ ...s, order: idx + 1 }));
    setCurrentCalc({ ...currentCalc, contentSections: updated });
  };

  // How-To Guide handlers
  const getHowToContent = () => {
    if (!currentCalc) return '';
    const section = currentCalc.contentSections?.find(
      (s) => s.sectionType === 'how-to' || s.title?.toLowerCase().includes('how to')
    );
    if (section) {
      return section.htmlContent || '';
    }
    // Only fall back to legacy if contentSections was never configured
    if (!currentCalc.contentSections || currentCalc.contentSections.length === 0) {
      return currentCalc.content?.usageInstructions || '';
    }
    return '';
  };

  const updateHowToContent = (html: string) => {
    if (!currentCalc) return;
    const cleanHtml = html && html.trim().length > 0 ? html : '';
    let sections = currentCalc.contentSections ? [...currentCalc.contentSections] : [];

    if (!cleanHtml) {
      // If user wiped the content in rich text editor, delete from contentSections
      sections = sections.filter(
        (s) => s.sectionType !== 'how-to' && !s.title?.toLowerCase().includes('how to')
      ).map((s, idx) => ({ ...s, order: idx + 1 }));
    } else {
      const howToIndex = sections.findIndex(
        (s) => s.sectionType === 'how-to' || s.title?.toLowerCase().includes('how to')
      );

      if (howToIndex >= 0) {
        sections[howToIndex] = {
          ...sections[howToIndex],
          htmlContent: cleanHtml,
          isEnabled: true,
        };
      } else {
        sections.push({
          id: `sec_how_to_${Date.now()}`,
          title: 'Step-by-Step Instructions',
          sectionType: 'how-to',
          htmlContent: cleanHtml,
          isEnabled: true,
          order: sections.length + 1,
        });
      }
    }

    setCurrentCalc({
      ...currentCalc,
      contentSections: sections,
      content: {
        ...(currentCalc.content || { formulaExplanation: '', usageInstructions: '', faqs: [] }),
        usageInstructions: cleanHtml,
      },
    });
  };

  const executeDeleteHowToGuide = async () => {
    if (!currentCalc) return;
    const remainingSections = (currentCalc.contentSections || [])
      .filter((s) => s.sectionType !== 'how-to' && !s.title?.toLowerCase().includes('how to'))
      .map((s, idx) => ({ ...s, order: idx + 1 }));

    const updatedModules = (currentCalc.modules || []).map((m) =>
      m.moduleId === 'how-to-guide' ? { ...m, isEnabled: false } : m
    );

    const updatedCalc: Calculator = {
      ...currentCalc,
      modules: updatedModules,
      contentSections: remainingSections,
      content: {
        ...(currentCalc.content || { formulaExplanation: '', usageInstructions: '', faqs: [] }),
        usageInstructions: '',
      },
    };

    setCurrentCalc(updatedCalc);
    setConfirmModal(null);

    try {
      setIsSaving(true);
      await api.adminUpdateCalculator(currentCalc.id, updatedCalc);
      setSuccessMessage('How-to Guide was completely deleted, disabled, and saved.');
      setTimeout(() => setSuccessMessage(null), 3500);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to save deletion.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteHowToGuide = () => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete How-To Guide Section?',
      message: 'This will erase the step-by-step instructions, remove the section from content, and disable the module on the live calculator page.',
      confirmLabel: 'Yes, Delete Section',
      action: executeDeleteHowToGuide,
    });
  };

  const insertHowToTemplate = () => {
    const template = `<h3>How to Calculate Step-by-Step</h3>
<ol class="list-decimal pl-5 space-y-2 my-3">
  <li><strong>Input Primary Parameters:</strong> Enter your base values or adjust the interactive sliders to match your scenario.</li>
  <li><strong>Verify Real-Time Results:</strong> The calculation engine updates dynamically, outputting primary figures and distribution breakdowns immediately.</li>
  <li><strong>Review Milestones & Schedules:</strong> Inspect the visual charts, amortization tables, and comparison benchmarks below to plan your strategy.</li>
</ol>
<div class="p-3.5 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg my-3 text-xs text-blue-900">
  <strong>Pro-Tip:</strong> Bookmark or copy the current page URL to save your customized input numbers for later review.
</div>`;
    updateHowToContent(template);
  };

  // Worked Examples handlers
  const handleAddExample = () => {
    if (!currentCalc) return;
    const newEx: CalculatorExample = {
      id: `ex_${Date.now()}`,
      title: 'Real-World Scenario Example',
      description: 'Describe the scenario, baseline values, and context in detail...',
      resultSummary: 'Evaluated Result: Instant Dynamic Output',
      isEnabled: true,
      order: (currentCalc.examples?.length || 0) + 1,
    };
    setCurrentCalc({
      ...currentCalc,
      examples: [...(currentCalc.examples || []), newEx],
    });
  };

  const handleUpdateExample = (exId: string, updates: Partial<CalculatorExample>) => {
    if (!currentCalc) return;
    setCurrentCalc({
      ...currentCalc,
      examples: (currentCalc.examples || []).map((ex) => (ex.id === exId ? { ...ex, ...updates } : ex)),
    });
  };

  const handleRemoveExample = (exId: string) => {
    if (!currentCalc) return;
    const target = (currentCalc.examples || []).find((e) => e.id === exId);
    const title = target?.title || 'this worked example';

    const executeRemove = async () => {
      const updatedExamples = (currentCalc.examples || [])
        .filter((ex) => ex.id !== exId)
        .map((ex, idx) => ({ ...ex, order: idx + 1 }));

      const updatedCalc: Calculator = {
        ...currentCalc,
        examples: updatedExamples,
      };
      setCurrentCalc(updatedCalc);
      setConfirmModal(null);

      try {
        setIsSaving(true);
        await api.adminUpdateCalculator(currentCalc.id, updatedCalc);
        setSuccessMessage('Worked example was deleted and saved.');
        setTimeout(() => setSuccessMessage(null), 3500);
      } catch (err: any) {
        setErrorMessage(err.message || 'Failed to save deletion.');
      } finally {
        setIsSaving(false);
      }
    };

    setConfirmModal({
      isOpen: true,
      title: `Delete Example "${title}"?`,
      message: 'Are you sure you want to delete this worked example scenario?',
      confirmLabel: 'Delete Example',
      action: executeRemove,
    });
  };

  const handleMoveExample = (index: number, direction: 'up' | 'down') => {
    if (!currentCalc || !currentCalc.examples) return;
    const list = [...currentCalc.examples];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= list.length) return;

    const temp = list[index];
    list[index] = list[targetIndex];
    list[targetIndex] = temp;

    const updated = list.map((ex, idx) => ({ ...ex, order: idx + 1 }));
    setCurrentCalc({ ...currentCalc, examples: updated });
  };

  const handleDeleteAllExamples = () => {
    if (!currentCalc) return;

    const executeDelete = async () => {
      const updatedModules = (currentCalc.modules || []).map((m) =>
        m.moduleId === 'worked-examples' ? { ...m, isEnabled: false } : m
      );

      const updatedCalc: Calculator = {
        ...currentCalc,
        examples: [],
        modules: updatedModules,
      };
      setCurrentCalc(updatedCalc);
      setConfirmModal(null);

      try {
        setIsSaving(true);
        await api.adminUpdateCalculator(currentCalc.id, updatedCalc);
        setSuccessMessage('All worked examples were deleted and the section was disabled.');
        setTimeout(() => setSuccessMessage(null), 3500);
      } catch (err: any) {
        setErrorMessage(err.message || 'Failed to delete examples.');
      } finally {
        setIsSaving(false);
      }
    };

    setConfirmModal({
      isOpen: true,
      title: 'Delete All Worked Examples?',
      message: 'This will erase all custom worked examples and disable the Worked Examples section on the live calculator page.',
      confirmLabel: 'Yes, Delete All Examples',
      action: executeDelete,
    });
  };

  // Formula & Methodology handlers
  const getFormulaContent = () => {
    if (!currentCalc) return '';
    const section = currentCalc.contentSections?.find(
      (s) => s.sectionType === 'formula' || s.title?.toLowerCase().includes('formula')
    );
    if (section) return section.htmlContent || '';
    return currentCalc.content?.formulaExplanation || '';
  };

  const updateFormulaContent = (html: string) => {
    if (!currentCalc) return;
    const cleanHtml = html && html.trim().length > 0 ? html : '';
    let sections = currentCalc.contentSections ? [...currentCalc.contentSections] : [];

    if (!cleanHtml) {
      sections = sections.filter(
        (s) => s.sectionType !== 'formula' && !s.title?.toLowerCase().includes('formula')
      ).map((s, idx) => ({ ...s, order: idx + 1 }));
    } else {
      const formulaIndex = sections.findIndex(
        (s) => s.sectionType === 'formula' || s.title?.toLowerCase().includes('formula')
      );
      if (formulaIndex >= 0) {
        sections[formulaIndex] = {
          ...sections[formulaIndex],
          htmlContent: cleanHtml,
          isEnabled: true,
        };
      } else {
        sections.push({
          id: `sec_formula_${Date.now()}`,
          title: 'Formula & Mathematical Logic',
          sectionType: 'formula',
          htmlContent: cleanHtml,
          isEnabled: true,
          order: sections.length + 1,
        });
      }
    }

    setCurrentCalc({
      ...currentCalc,
      contentSections: sections,
      content: {
        ...(currentCalc.content || { formulaExplanation: '', usageInstructions: '', faqs: [] }),
        formulaExplanation: cleanHtml,
      },
    });
  };

  const handleDeleteFormulaGuide = () => {
    if (!currentCalc) return;

    const executeDelete = async () => {
      const remainingSections = (currentCalc.contentSections || [])
        .filter((s) => s.sectionType !== 'formula' && !s.title?.toLowerCase().includes('formula'))
        .map((s, idx) => ({ ...s, order: idx + 1 }));

      const updatedModules = (currentCalc.modules || []).map((m) =>
        m.moduleId === 'formula-methodology' ? { ...m, isEnabled: false } : m
      );

      const updatedCalc: Calculator = {
        ...currentCalc,
        modules: updatedModules,
        contentSections: remainingSections,
        content: {
          ...(currentCalc.content || { formulaExplanation: '', usageInstructions: '', faqs: [] }),
          formulaExplanation: '',
        },
      };
      setCurrentCalc(updatedCalc);
      setConfirmModal(null);

      try {
        setIsSaving(true);
        await api.adminUpdateCalculator(currentCalc.id, updatedCalc);
        setSuccessMessage('Formula section was completely deleted, disabled, and saved.');
        setTimeout(() => setSuccessMessage(null), 3500);
      } catch (err: any) {
        setErrorMessage(err.message || 'Failed to delete formula section.');
      } finally {
        setIsSaving(false);
      }
    };

    setConfirmModal({
      isOpen: true,
      title: 'Delete Formula & Methodology Section?',
      message: 'This will erase the narrative explanation, clear mathematical methodology, and disable the section on the live page.',
      confirmLabel: 'Yes, Delete Formula Section',
      action: executeDelete,
    });
  };

  // Key Assumptions handlers
  const getAssumptionsContent = () => {
    if (!currentCalc) return '';
    const section = currentCalc.contentSections?.find(
      (s) => s.sectionType === 'assumptions' || s.title?.toLowerCase().includes('assumption')
    );
    return section?.htmlContent || '';
  };

  const updateAssumptionsContent = (html: string) => {
    if (!currentCalc) return;
    const cleanHtml = html && html.trim().length > 0 ? html : '';
    let sections = currentCalc.contentSections ? [...currentCalc.contentSections] : [];

    if (!cleanHtml) {
      sections = sections.filter(
        (s) => s.sectionType !== 'assumptions' && !s.title?.toLowerCase().includes('assumption')
      ).map((s, idx) => ({ ...s, order: idx + 1 }));
    } else {
      const assumpIndex = sections.findIndex(
        (s) => s.sectionType === 'assumptions' || s.title?.toLowerCase().includes('assumption')
      );

      if (assumpIndex >= 0) {
        sections[assumpIndex] = {
          ...sections[assumpIndex],
          htmlContent: cleanHtml,
          isEnabled: true,
        };
      } else {
        sections.push({
          id: `sec_assumptions_${Date.now()}`,
          title: 'Key Assumptions & Statutory Notes',
          sectionType: 'assumptions',
          htmlContent: cleanHtml,
          isEnabled: true,
          order: sections.length + 1,
        });
      }
    }

    setCurrentCalc({
      ...currentCalc,
      contentSections: sections,
    });
  };

  const handleDeleteAssumptionsGuide = () => {
    if (!currentCalc) return;

    const executeDelete = async () => {
      const remainingSections = (currentCalc.contentSections || [])
        .filter((s) => s.sectionType !== 'assumptions' && !s.title?.toLowerCase().includes('assumption'))
        .map((s, idx) => ({ ...s, order: idx + 1 }));

      const updatedModules = (currentCalc.modules || []).map((m) =>
        m.moduleId === 'assumptions-info' ? { ...m, isEnabled: false } : m
      );

      const updatedCalc: Calculator = {
        ...currentCalc,
        modules: updatedModules,
        contentSections: remainingSections,
      };
      setCurrentCalc(updatedCalc);
      setConfirmModal(null);

      try {
        setIsSaving(true);
        await api.adminUpdateCalculator(currentCalc.id, updatedCalc);
        setSuccessMessage('Assumptions section was completely deleted, disabled, and saved.');
        setTimeout(() => setSuccessMessage(null), 3500);
      } catch (err: any) {
        setErrorMessage(err.message || 'Failed to save deletion.');
      } finally {
        setIsSaving(false);
      }
    };

    setConfirmModal({
      isOpen: true,
      title: 'Delete Key Assumptions Section?',
      message: 'This will erase assumptions, notes, and statutory disclosures, and disable the section on the live page.',
      confirmLabel: 'Yes, Delete Assumptions',
      action: executeDelete,
    });
  };

  const insertAssumptionsTemplate = () => {
    const template = `<h3>Standard Regulatory & Computational Basis</h3>
<p>Calculations assume standard uniform compounding periods, 30-day month conventions, and standard statutory thresholds:</p>
<ul class="list-disc pl-5 space-y-1.5 my-3">
  <li>Interest rates are treated as constant over the entire tenure duration.</li>
  <li>Rounding is performed to 2 decimal places in standard financial currency.</li>
  <li>Statutory tax provisions and deduction limits reflect current enacted schedules.</li>
</ul>
<div class="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900">
  <strong>Disclaimer:</strong> This calculator provides mathematical projections for informational and planning purposes only and does not constitute formal underwriting advice.
</div>`;
    updateAssumptionsContent(template);
  };

  // FAQ Management
  const handleAddFaq = () => {
    if (!currentCalc) return;
    const newFaq: CalculatorFAQ = {
      id: `faq_${Date.now()}`,
      question: 'Frequently Asked Question Title',
      answer: '<p>Detailed, informative answer with structured explanation for users and Google Search snippets.</p>',
      isEnabled: true,
      order: (currentCalc.faqs?.length || 0) + 1,
    };
    setCurrentCalc({
      ...currentCalc,
      faqs: [...(currentCalc.faqs || []), newFaq],
    });
  };

  const handleUpdateFaq = (faqId: string, updates: Partial<CalculatorFAQ>) => {
    if (!currentCalc) return;
    setCurrentCalc({
      ...currentCalc,
      faqs: (currentCalc.faqs || []).map((f: CalculatorFAQ) =>
        f.id === faqId ? { ...f, ...updates } : f
      ),
    });
  };

  const handleRemoveFaq = (faqId: string) => {
    if (!currentCalc) return;
    const target = (currentCalc.faqs || []).find((f) => f.id === faqId);
    const question = target?.question || 'this FAQ item';

    const executeRemove = async () => {
      const updatedFaqs = (currentCalc.faqs || [])
        .filter((f: CalculatorFAQ) => f.id !== faqId)
        .map((f, idx) => ({ ...f, order: idx + 1 }));

      const updatedCalc: Calculator = {
        ...currentCalc,
        faqs: updatedFaqs,
      };
      setCurrentCalc(updatedCalc);
      setConfirmModal(null);

      try {
        setIsSaving(true);
        await api.adminUpdateCalculator(currentCalc.id, updatedCalc);
        setSuccessMessage('FAQ item was deleted and saved.');
        setTimeout(() => setSuccessMessage(null), 3500);
      } catch (err: any) {
        setErrorMessage(err.message || 'Failed to save deletion.');
      } finally {
        setIsSaving(false);
      }
    };

    setConfirmModal({
      isOpen: true,
      title: `Delete FAQ "${question}"?`,
      message: 'Are you sure you want to permanently delete this FAQ item from the calculator?',
      confirmLabel: 'Delete FAQ',
      action: executeRemove,
    });
  };

  // Save all content & SEO changes
  const handleSaveAll = async () => {
    if (!currentCalc) return;
    try {
      setIsSaving(true);
      setErrorMessage(null);
      await api.adminUpdateCalculator(currentCalc.id, currentCalc);
      setSuccessMessage(`All content, guides, examples, and SEO for "${currentCalc.name}" saved successfully!`);
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to save content and SEO configuration.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e4e5e7] pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#1dbf73] uppercase tracking-wider mb-1">
            <BookOpen className="w-4 h-4" />
            <span>Comprehensive Section & Content Manager</span>
          </div>
          <h1 className="text-2xl font-black text-[#222325]">Calculator Sections, Content & SEO</h1>
          <p className="text-sm text-[#74767e] mt-1">
            Customize and edit every section on the calculator page: How-to Guides, Worked Examples, Formulas, Assumptions, FAQs, and Search Metadata.
          </p>
        </div>

        {currentCalc && (
          <div className="flex items-center gap-3">
            <a
              href={`/${(currentCalc as any).category?.slug || 'c'}/${(currentCalc as any).subcategory?.slug || 's'}/${currentCalc.slug}`}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2.5 bg-white border border-[#e4e5e7] hover:border-[#1dbf73] text-[#404145] text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all shadow-2xs"
            >
              <Eye className="w-4 h-4 text-[#74767e]" />
              <span>View Live Page</span>
              <ExternalLink className="w-3 h-3 text-[#74767e]" />
            </a>

            <button
              type="button"
              onClick={handleSaveAll}
              disabled={isSaving}
              className="px-5 py-2.5 bg-[#1dbf73] hover:bg-[#19a463] text-white text-xs font-bold rounded-lg flex items-center gap-2 transition-all cursor-pointer shadow-sm disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving Changes...' : 'Save All Changes'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Status Notifications */}
      {successMessage && (
        <div className="p-4 bg-[#f4fdf8] border border-[#d8f5e5] rounded-xl flex items-center justify-between text-xs font-bold text-[#1dbf73] animate-fade-in shadow-2xs">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            <span>{successMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setSuccessMessage(null)}
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

      {/* Target Calculator Selector or Empty State */}
      {calculators.length === 0 ? (
        <div className="p-8 bg-white rounded-2xl border border-[#e4e5e7] text-center space-y-4">
          <div className="w-12 h-12 rounded-xl bg-[#f4fdf8] text-[#1dbf73] mx-auto flex items-center justify-center border border-[#d8f5e5]">
            <BookOpen className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h2 className="text-base font-bold text-[#222325]">No Calculators Created Yet</h2>
            <p className="text-xs text-[#74767e] max-w-md mx-auto leading-relaxed">
              Create your first calculator record in <strong>Calculators &rarr; Create Calculator</strong>. Once created, you can edit all sections and rich content here.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Calculator Selector Bar */}
          <div className="p-4 bg-white rounded-xl border border-[#e4e5e7] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-[#222325] shrink-0">Active Calculator:</span>
              <select
                value={selectedCalcId}
                onChange={(e) => handleSelectCalculator(e.target.value)}
                className="px-3.5 py-2 bg-[#fafafa] border border-[#e4e5e7] rounded-lg text-xs font-bold text-[#222325] focus:outline-none focus:border-[#1dbf73]"
              >
                {calculators.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} (/{c.slug})
                  </option>
                ))}
              </select>
            </div>

            {currentCalc && (
              <div className="flex items-center gap-3 text-xs font-mono text-[#74767e]">
                <span>Slug:</span>
                <code className="px-2 py-0.5 bg-[#fafafa] rounded border border-[#e4e5e7] text-[#222325] font-bold">
                  /{currentCalc.slug}
                </code>
              </div>
            )}
          </div>

          {currentCalc && (
            <div className="space-y-6">
              {/* Comprehensive Section Tabs */}
              <div className="flex items-center gap-1 border-b border-[#e4e5e7] overflow-x-auto pb-px">
                <button
                  type="button"
                  onClick={() => setActiveTab('how-to')}
                  className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === 'how-to'
                      ? 'border-[#1dbf73] text-[#1dbf73] bg-[#f4fdf8]'
                      : 'border-transparent text-[#74767e] hover:text-[#222325]'
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  <span>1. How to Use Guide</span>
                  <span className={`w-2 h-2 rounded-full ${isModuleEnabled('how-to-guide') ? 'bg-emerald-500' : 'bg-amber-400'}`} title={isModuleEnabled('how-to-guide') ? 'Active on Public Page' : 'Disabled / Hidden'}></span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('examples')}
                  className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === 'examples'
                      ? 'border-[#1dbf73] text-[#1dbf73] bg-[#f4fdf8]'
                      : 'border-transparent text-[#74767e] hover:text-[#222325]'
                  }`}
                >
                  <FileCheck className="w-4 h-4" />
                  <span>2. Worked Examples</span>
                  <span className="px-1.5 py-0.5 text-[10px] font-extrabold rounded-full bg-[#fafafa] text-[#74767e] border border-[#e4e5e7]">
                    {currentCalc.examples?.length || 0}
                  </span>
                  <span className={`w-2 h-2 rounded-full ${isModuleEnabled('worked-examples') ? 'bg-emerald-500' : 'bg-amber-400'}`} title={isModuleEnabled('worked-examples') ? 'Active on Public Page' : 'Disabled / Hidden'}></span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('formula')}
                  className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === 'formula'
                      ? 'border-[#1dbf73] text-[#1dbf73] bg-[#f4fdf8]'
                      : 'border-transparent text-[#74767e] hover:text-[#222325]'
                  }`}
                >
                  <Code2 className="w-4 h-4" />
                  <span>3. Formula & Logic</span>
                  <span className={`w-2 h-2 rounded-full ${isModuleEnabled('formula-methodology') ? 'bg-emerald-500' : 'bg-amber-400'}`} title={isModuleEnabled('formula-methodology') ? 'Active on Public Page' : 'Disabled / Hidden'}></span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('assumptions')}
                  className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === 'assumptions'
                      ? 'border-[#1dbf73] text-[#1dbf73] bg-[#f4fdf8]'
                      : 'border-transparent text-[#74767e] hover:text-[#222325]'
                  }`}
                >
                  <Info className="w-4 h-4" />
                  <span>4. Key Assumptions</span>
                  <span className={`w-2 h-2 rounded-full ${isModuleEnabled('assumptions-info') ? 'bg-emerald-500' : 'bg-amber-400'}`} title={isModuleEnabled('assumptions-info') ? 'Active on Public Page' : 'Disabled / Hidden'}></span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('content')}
                  className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === 'content'
                      ? 'border-[#1dbf73] text-[#1dbf73] bg-[#f4fdf8]'
                      : 'border-transparent text-[#74767e] hover:text-[#222325]'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span>5. Custom Articles</span>
                  <span className="px-1.5 py-0.5 text-[10px] font-extrabold rounded-full bg-[#f4fdf8] text-[#1dbf73] border border-[#d8f5e5]">
                    {currentCalc.contentSections?.length || 0}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('faqs')}
                  className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === 'faqs'
                      ? 'border-[#1dbf73] text-[#1dbf73] bg-[#f4fdf8]'
                      : 'border-transparent text-[#74767e] hover:text-[#222325]'
                  }`}
                >
                  <HelpCircle className="w-4 h-4" />
                  <span>6. FAQs</span>
                  <span className="px-1.5 py-0.5 text-[10px] font-extrabold rounded-full bg-[#fafafa] text-[#74767e] border border-[#e4e5e7]">
                    {currentCalc.faqs?.length || 0}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('seo')}
                  className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === 'seo'
                      ? 'border-[#1dbf73] text-[#1dbf73] bg-[#f4fdf8]'
                      : 'border-transparent text-[#74767e] hover:text-[#222325]'
                  }`}
                >
                  <Globe className="w-4 h-4" />
                  <span>7. SEO & Meta</span>
                </button>
              </div>

              {/* TAB 1: HOW TO USE GUIDE */}
              {activeTab === 'how-to' && (
                <div className="bg-white rounded-xl border border-[#e4e5e7] p-6 sm:p-7 space-y-6 shadow-2xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#f0f0f0] pb-4">
                    <div>
                      <h2 className="text-base font-bold text-[#222325] flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-[#1dbf73]" />
                        <span>How to Use This Calculator - Section Editor</span>
                      </h2>
                      <p className="text-xs text-[#74767e] mt-0.5">
                        Customize the section headline, step-by-step user guide, bullet points, and helpful usage tips.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={insertHowToTemplate}
                        className="px-3.5 py-1.5 bg-[#f4fdf8] hover:bg-[#e8faef] text-[#1dbf73] border border-[#d8f5e5] rounded-lg text-xs font-bold transition-all cursor-pointer shadow-2xs shrink-0"
                      >
                        Insert 3-Step Guided Template
                      </button>
                      <button
                        type="button"
                        onClick={handleDeleteHowToGuide}
                        className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-2xs shrink-0 flex items-center gap-1.5"
                        title="Delete this entire section from calculator"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete Guide Section</span>
                      </button>
                    </div>
                  </div>

                  {/* Section Live Status & Master Toggle Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-[#f9fafb] border border-[#e4e5e7] rounded-xl">
                    <div className="flex items-center gap-2.5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                        isModuleEnabled('how-to-guide')
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        <span className={`w-2 h-2 rounded-full ${isModuleEnabled('how-to-guide') ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                        <span>{isModuleEnabled('how-to-guide') ? 'Active on Public Page' : 'Disabled on Public Page'}</span>
                      </span>
                      <span className="text-xs text-[#74767e]">
                        {isModuleEnabled('how-to-guide')
                          ? 'This section is currently visible to visitors.'
                          : 'This section is hidden on the public calculator page.'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => toggleModuleEnabled('how-to-guide', !isModuleEnabled('how-to-guide'))}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                          isModuleEnabled('how-to-guide')
                            ? 'bg-white hover:bg-slate-50 text-slate-700 border-[#e4e5e7]'
                            : 'bg-[#1dbf73] hover:bg-[#19a463] text-white border-[#1dbf73]'
                        }`}
                      >
                        {isModuleEnabled('how-to-guide') ? 'Disable Section' : 'Enable Section'}
                      </button>
                    </div>
                  </div>

                  {!isModuleEnabled('how-to-guide') && (
                    <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-2 text-xs text-amber-800">
                        <Info className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>This section is <strong>deleted / disabled</strong>. It will NOT appear on the public page. You can edit content below or click <strong>Enable Section</strong> to publish it.</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleModuleEnabled('how-to-guide', true)}
                        className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold shrink-0 cursor-pointer shadow-2xs self-start sm:self-auto"
                      >
                        Enable Section
                      </button>
                    </div>
                  )}

                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-bold text-[#222325]">
                          Section Display Title (Header on Public Page)
                        </label>
                        {getModuleTitle('how-to-guide', `How to Use the ${currentCalc.name}`) !== '' && (
                          <button
                            type="button"
                            onClick={() => updateModuleTitle('how-to-guide', '')}
                            className="text-[11px] text-[#74767e] hover:text-rose-600 transition-colors cursor-pointer flex items-center gap-1 font-semibold"
                            title="Delete this header title"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Delete Title</span>
                          </button>
                        )}
                      </div>
                      <input
                        type="text"
                        value={getModuleTitle('how-to-guide', `How to Use the ${currentCalc.name}`)}
                        onChange={(e) => updateModuleTitle('how-to-guide', e.target.value)}
                        placeholder={`Leave blank to hide header, or e.g. How to Use the ${currentCalc.name}`}
                        className="w-full px-3.5 py-2.5 bg-[#fafafa] border border-[#e4e5e7] rounded-lg text-xs font-bold text-[#222325] focus:outline-none focus:border-[#1dbf73]"
                      />
                      {getModuleTitle('how-to-guide', `How to Use the ${currentCalc.name}`) === '' && (
                        <p className="text-[11px] text-amber-600 font-medium">
                          Display title is deleted — the header banner will not appear on the live calculator page.
                        </p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-[#222325]">
                        Step-by-Step Instructions & Usage Guide (Rich-Text Editor)
                      </label>
                      <RichTextEditor
                        value={getHowToContent()}
                        onChange={(html) => updateHowToContent(html)}
                        placeholder="Write clear, step-by-step instructions with numbered lists, pro-tips, and explanations..."
                        minHeight="240px"
                      />
                    </div>

                    <div className="flex justify-end pt-3 border-t border-[#f0f0f0]">
                      <button
                        type="button"
                        onClick={handleSaveAll}
                        disabled={isSaving}
                        className="px-5 py-2.5 bg-[#1dbf73] hover:bg-[#19a463] text-white text-xs font-bold rounded-lg flex items-center gap-2 transition-all cursor-pointer shadow-sm disabled:opacity-50"
                      >
                        <Save className="w-4 h-4" />
                        <span>{isSaving ? 'Saving Changes...' : 'Save Changes'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: WORKED EXAMPLES & SCENARIOS */}
              {activeTab === 'examples' && (
                <div className="bg-white rounded-xl border border-[#e4e5e7] p-6 sm:p-7 space-y-6 shadow-2xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#f0f0f0] pb-4">
                    <div>
                      <h2 className="text-base font-bold text-[#222325] flex items-center gap-2">
                        <FileCheck className="w-4 h-4 text-[#1dbf73]" />
                        <span>Worked Examples & Scenarios Editor</span>
                      </h2>
                      <p className="text-xs text-[#74767e] mt-0.5">
                        Add real-world calculation scenarios, sample input benchmarks, and evaluated outcome summaries.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleAddExample}
                        className="px-3.5 py-1.5 bg-[#222325] hover:bg-black text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs shrink-0"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Example</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleDeleteAllExamples}
                        className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-2xs shrink-0 flex items-center gap-1.5"
                        title="Delete all examples and disable this section"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete All Examples</span>
                      </button>
                    </div>
                  </div>

                  {/* Section Live Status & Master Toggle Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-[#f9fafb] border border-[#e4e5e7] rounded-xl">
                    <div className="flex items-center gap-2.5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                        isModuleEnabled('worked-examples')
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        <span className={`w-2 h-2 rounded-full ${isModuleEnabled('worked-examples') ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                        <span>{isModuleEnabled('worked-examples') ? 'Active on Public Page' : 'Disabled on Public Page'}</span>
                      </span>
                      <span className="text-xs text-[#74767e]">
                        {isModuleEnabled('worked-examples')
                          ? 'This section is currently visible to visitors.'
                          : 'This section is hidden on the public calculator page.'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => toggleModuleEnabled('worked-examples', !isModuleEnabled('worked-examples'))}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                          isModuleEnabled('worked-examples')
                            ? 'bg-white hover:bg-slate-50 text-slate-700 border-[#e4e5e7]'
                            : 'bg-[#1dbf73] hover:bg-[#19a463] text-white border-[#1dbf73]'
                        }`}
                      >
                        {isModuleEnabled('worked-examples') ? 'Disable Section' : 'Enable Section'}
                      </button>
                    </div>
                  </div>

                  {!isModuleEnabled('worked-examples') && (
                    <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-2 text-xs text-amber-800">
                        <Info className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>Worked Examples is <strong>deleted / disabled</strong> and will NOT appear on the public page. You can add scenarios below or click <strong>Enable Section</strong> to publish them.</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleModuleEnabled('worked-examples', true)}
                        className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold shrink-0 cursor-pointer shadow-2xs self-start sm:self-auto"
                      >
                        Enable Section
                      </button>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold text-[#222325]">
                        Section Display Title (Header on Public Page)
                      </label>
                      {getModuleTitle('worked-examples', 'Worked Examples & Real Scenarios') !== '' && (
                        <button
                          type="button"
                          onClick={() => updateModuleTitle('worked-examples', '')}
                          className="text-[11px] text-[#74767e] hover:text-rose-600 transition-colors cursor-pointer flex items-center gap-1 font-semibold"
                          title="Delete this header title"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Delete Title</span>
                        </button>
                      )}
                    </div>
                    <input
                      type="text"
                      value={getModuleTitle('worked-examples', 'Worked Examples & Real Scenarios')}
                      onChange={(e) => updateModuleTitle('worked-examples', e.target.value)}
                      placeholder="Leave blank to hide header, or e.g. Worked Examples & Real Scenarios"
                      className="w-full px-3.5 py-2.5 bg-[#fafafa] border border-[#e4e5e7] rounded-lg text-xs font-bold text-[#222325] focus:outline-none focus:border-[#1dbf73]"
                    />
                    {getModuleTitle('worked-examples', 'Worked Examples & Real Scenarios') === '' && (
                      <p className="text-[11px] text-amber-600 font-medium">
                        Display title is deleted — the header banner will not appear on the live calculator page.
                      </p>
                    )}
                  </div>

                  <div className="space-y-5 pt-2">
                    {(!currentCalc.examples || currentCalc.examples.length === 0) ? (
                      <div className="p-6 bg-[#fafafa] rounded-xl border border-[#e4e5e7] text-center space-y-3">
                        <FileCheck className="w-8 h-8 text-[#74767e] mx-auto opacity-50" />
                        <div className="space-y-1">
                          <p className="text-xs font-bold text-[#222325]">No Custom Examples Added Yet</p>
                          <p className="text-[11px] text-[#74767e]">
                            The calculator currently shows standard placeholder scenarios. Click "Add Worked Example" to create custom case studies with exact numbers.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={handleAddExample}
                          className="px-4 py-2 bg-[#1dbf73] hover:bg-[#19a463] text-white text-xs font-bold rounded-lg cursor-pointer transition-all"
                        >
                          + Add First Example
                        </button>
                      </div>
                    ) : (
                      currentCalc.examples.map((ex, idx) => (
                        <div
                          key={ex.id || idx}
                          className="p-5 bg-white rounded-xl border border-[#e4e5e7] space-y-4 shadow-2xs hover:border-[#1dbf73] transition-colors"
                        >
                          <div className="flex items-center justify-between border-b border-[#e4e5e7] pb-3">
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
                                  disabled={idx === (currentCalc.examples?.length || 1) - 1}
                                  onClick={() => handleMoveExample(idx, 'down')}
                                  className="p-1 rounded hover:bg-[#e4e5e7] disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
                                >
                                  <ArrowDown className="w-3.5 h-3.5 text-[#74767e]" />
                                </button>
                              </div>

                              <div className="flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-[#1dbf73] text-white text-xs font-bold flex items-center justify-center">
                                  {idx + 1}
                                </span>
                                <span className="text-xs font-bold text-[#222325]">
                                  {ex.title || `Example #${idx + 1}`}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              <label className="flex items-center gap-1.5 text-xs font-bold text-[#404145] cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={ex.isEnabled !== false}
                                  onChange={(e) =>
                                    handleUpdateExample(ex.id, { isEnabled: e.target.checked })
                                  }
                                  className="w-4 h-4 text-[#1dbf73] accent-[#1dbf73] rounded"
                                />
                                <span>Active</span>
                              </label>

                              <button
                                type="button"
                                onClick={() => handleRemoveExample(ex.id)}
                                className="text-rose-500 hover:text-rose-700 p-1.5 rounded hover:bg-rose-50 cursor-pointer transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="block text-[11px] font-bold text-[#74767e]">
                                Scenario Title
                              </label>
                              <input
                                type="text"
                                value={ex.title}
                                onChange={(e) => handleUpdateExample(ex.id, { title: e.target.value })}
                                placeholder="e.g. Example 1: 5-Year Home Loan Benchmark"
                                className="w-full px-3.5 py-2 bg-[#fafafa] border border-[#e4e5e7] rounded-lg text-xs font-bold text-[#222325] focus:outline-none focus:border-[#1dbf73]"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="block text-[11px] font-bold text-[#74767e]">
                                Outcome Summary / Highlight Badge
                              </label>
                              <input
                                type="text"
                                value={ex.resultSummary || ''}
                                onChange={(e) =>
                                  handleUpdateExample(ex.id, { resultSummary: e.target.value })
                                }
                                placeholder="e.g. Monthly EMI: ₹10,258 | Total Interest: ₹1,15,480"
                                className="w-full px-3.5 py-2 bg-[#fafafa] border border-[#e4e5e7] rounded-lg text-xs font-mono font-bold text-[#1dbf73] focus:outline-none focus:border-[#1dbf73]"
                              />
                            </div>
                          </div>

                          <div className="space-y-1">
                            <label className="block text-[11px] font-bold text-[#74767e]">
                              Scenario Narrative & Input Parameters Description
                            </label>
                            <textarea
                              rows={3}
                              value={ex.description}
                              onChange={(e) =>
                                handleUpdateExample(ex.id, { description: e.target.value })
                              }
                              placeholder="Describe the context: Suppose an applicant borrows ₹5,00,000 at 8.5% annual interest for a 5-year repayment tenure..."
                              className="w-full px-3.5 py-2.5 bg-[#fafafa] border border-[#e4e5e7] rounded-lg text-xs text-[#222325] leading-relaxed focus:outline-none focus:border-[#1dbf73]"
                            />
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* TAB 3: FORMULA & LOGIC NOTES */}
              {activeTab === 'formula' && (
                <div className="bg-white rounded-xl border border-[#e4e5e7] p-6 sm:p-7 space-y-6 shadow-2xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#f0f0f0] pb-4">
                    <div>
                      <h2 className="text-base font-bold text-[#222325] flex items-center gap-2">
                        <Code2 className="w-4 h-4 text-[#1dbf73]" />
                        <span>Formula Methodology & Mathematical Logic Notes</span>
                      </h2>
                      <p className="text-xs text-[#74767e] mt-0.5">
                        Explain the computational equations, derivation steps, rounding rules, and variable definitions.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={`/admin/calculators/${currentCalc.id}?tab=formulas`}
                        className="px-3.5 py-1.5 bg-[#222325] hover:bg-black text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs shrink-0"
                      >
                        <Sliders className="w-3.5 h-3.5" />
                        <span>Edit Equations &rarr;</span>
                      </a>
                      <button
                        type="button"
                        onClick={handleDeleteFormulaGuide}
                        className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-2xs shrink-0 flex items-center gap-1.5"
                        title="Delete formula explanation and disable this section"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete Formula Section</span>
                      </button>
                    </div>
                  </div>

                  {/* Section Live Status & Master Toggle Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-[#f9fafb] border border-[#e4e5e7] rounded-xl">
                    <div className="flex items-center gap-2.5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                        isModuleEnabled('formula-methodology')
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        <span className={`w-2 h-2 rounded-full ${isModuleEnabled('formula-methodology') ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                        <span>{isModuleEnabled('formula-methodology') ? 'Active on Public Page' : 'Disabled on Public Page'}</span>
                      </span>
                      <span className="text-xs text-[#74767e]">
                        {isModuleEnabled('formula-methodology')
                          ? 'This section is currently visible to visitors.'
                          : 'This section is hidden on the public calculator page.'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => toggleModuleEnabled('formula-methodology', !isModuleEnabled('formula-methodology'))}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                          isModuleEnabled('formula-methodology')
                            ? 'bg-white hover:bg-slate-50 text-slate-700 border-[#e4e5e7]'
                            : 'bg-[#1dbf73] hover:bg-[#19a463] text-white border-[#1dbf73]'
                        }`}
                      >
                        {isModuleEnabled('formula-methodology') ? 'Disable Section' : 'Enable Section'}
                      </button>
                    </div>
                  </div>

                  {!isModuleEnabled('formula-methodology') && (
                    <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-2 text-xs text-amber-800">
                        <Info className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>Formula section is <strong>deleted / disabled</strong> and will NOT appear on the public page. You can edit content below or click <strong>Enable Section</strong> to publish it.</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleModuleEnabled('formula-methodology', true)}
                        className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold shrink-0 cursor-pointer shadow-2xs self-start sm:self-auto"
                      >
                        Enable Section
                      </button>
                    </div>
                  )}

                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-bold text-[#222325]">
                          Section Display Title (Header on Public Page)
                        </label>
                        {getModuleTitle('formula-methodology', 'Formula & Mathematical Logic') !== '' && (
                          <button
                            type="button"
                            onClick={() => updateModuleTitle('formula-methodology', '')}
                            className="text-[11px] text-[#74767e] hover:text-rose-600 transition-colors cursor-pointer flex items-center gap-1 font-semibold"
                            title="Delete this header title"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Delete Title</span>
                          </button>
                        )}
                      </div>
                      <input
                        type="text"
                        value={getModuleTitle('formula-methodology', 'Formula & Mathematical Logic')}
                        onChange={(e) => updateModuleTitle('formula-methodology', e.target.value)}
                        placeholder="Leave blank to hide header, or e.g. Formula & Mathematical Logic"
                        className="w-full px-3.5 py-2.5 bg-[#fafafa] border border-[#e4e5e7] rounded-lg text-xs font-bold text-[#222325] focus:outline-none focus:border-[#1dbf73]"
                      />
                      {getModuleTitle('formula-methodology', 'Formula & Mathematical Logic') === '' && (
                        <p className="text-[11px] text-amber-600 font-medium">
                          Display title is deleted — the header banner will not appear on the live calculator page.
                        </p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-[#222325]">
                        Methodology Explanation & Narrative Proof (Rich-Text Editor)
                      </label>
                      <RichTextEditor
                        value={getFormulaContent()}
                        onChange={(html) => updateFormulaContent(html)}
                        placeholder="Describe the mathematical foundation, compounding frequency, formulas, and proofs..."
                        minHeight="220px"
                      />
                    </div>

                    {/* Active Output Equations Overview */}
                    <div className="p-4 bg-[#fafafa] rounded-xl border border-[#e4e5e7] space-y-3">
                      <span className="text-xs font-bold text-[#222325] uppercase tracking-wider block">
                        Active Mathematical Formulas in Engine:
                      </span>
                      <div className="space-y-2">
                        {(currentCalc.outputs || []).map((out) => (
                          <div
                            key={out.id}
                            className="p-3 bg-white rounded-lg border border-[#e4e5e7] flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                          >
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-[#1dbf73]"></span>
                              <span className="text-xs font-bold text-[#222325]">{out.label}:</span>
                            </div>
                            <code className="text-xs font-mono text-[#1dbf73] bg-[#f4fdf8] px-2.5 py-1 rounded border border-[#d8f5e5]">
                              {out.formula}
                            </code>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: KEY ASSUMPTIONS & DISCLOSURES */}
              {activeTab === 'assumptions' && (
                <div className="bg-white rounded-xl border border-[#e4e5e7] p-6 sm:p-7 space-y-6 shadow-2xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#f0f0f0] pb-4">
                    <div>
                      <h2 className="text-base font-bold text-[#222325] flex items-center gap-2">
                        <Info className="w-4 h-4 text-[#1dbf73]" />
                        <span>Key Assumptions & Statutory Disclosures</span>
                      </h2>
                      <p className="text-xs text-[#74767e] mt-0.5">
                        Customize regulatory disclosures, computational baselines, underwriting guidelines, and disclaimers.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={insertAssumptionsTemplate}
                        className="px-3.5 py-1.5 bg-[#f4fdf8] hover:bg-[#e8faef] text-[#1dbf73] border border-[#d8f5e5] rounded-lg text-xs font-bold transition-all cursor-pointer shadow-2xs shrink-0"
                      >
                        Insert Template
                      </button>
                      <button
                        type="button"
                        onClick={handleDeleteAssumptionsGuide}
                        className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-2xs shrink-0 flex items-center gap-1.5"
                        title="Delete assumptions and disable this section"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete Assumptions Section</span>
                      </button>
                    </div>
                  </div>

                  {/* Section Live Status & Master Toggle Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-[#f9fafb] border border-[#e4e5e7] rounded-xl">
                    <div className="flex items-center gap-2.5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                        isModuleEnabled('assumptions-info')
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        <span className={`w-2 h-2 rounded-full ${isModuleEnabled('assumptions-info') ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                        <span>{isModuleEnabled('assumptions-info') ? 'Active on Public Page' : 'Disabled on Public Page'}</span>
                      </span>
                      <span className="text-xs text-[#74767e]">
                        {isModuleEnabled('assumptions-info')
                          ? 'This section is currently visible to visitors.'
                          : 'This section is hidden on the public calculator page.'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => toggleModuleEnabled('assumptions-info', !isModuleEnabled('assumptions-info'))}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                          isModuleEnabled('assumptions-info')
                            ? 'bg-white hover:bg-slate-50 text-slate-700 border-[#e4e5e7]'
                            : 'bg-[#1dbf73] hover:bg-[#19a463] text-white border-[#1dbf73]'
                        }`}
                      >
                        {isModuleEnabled('assumptions-info') ? 'Disable Section' : 'Enable Section'}
                      </button>
                    </div>
                  </div>

                  {!isModuleEnabled('assumptions-info') && (
                    <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-2 text-xs text-amber-800">
                        <Info className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>Assumptions section is <strong>deleted / disabled</strong> and will NOT appear on the public page. You can edit content below or click <strong>Enable Section</strong> to publish it.</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleModuleEnabled('assumptions-info', true)}
                        className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold shrink-0 cursor-pointer shadow-2xs self-start sm:self-auto"
                      >
                        Enable Section
                      </button>
                    </div>
                  )}

                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-bold text-[#222325]">
                          Section Display Title (Header on Public Page)
                        </label>
                        {getModuleTitle('assumptions-info', 'Key Assumptions & Statutory Notes') !== '' && (
                          <button
                            type="button"
                            onClick={() => updateModuleTitle('assumptions-info', '')}
                            className="text-[11px] text-[#74767e] hover:text-rose-600 transition-colors cursor-pointer flex items-center gap-1 font-semibold"
                            title="Delete this header title"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Delete Title</span>
                          </button>
                        )}
                      </div>
                      <input
                        type="text"
                        value={getModuleTitle('assumptions-info', 'Key Assumptions & Statutory Notes')}
                        onChange={(e) => updateModuleTitle('assumptions-info', e.target.value)}
                        placeholder="Leave blank to hide header, or e.g. Key Assumptions & Statutory Notes"
                        className="w-full px-3.5 py-2.5 bg-[#fafafa] border border-[#e4e5e7] rounded-lg text-xs font-bold text-[#222325] focus:outline-none focus:border-[#1dbf73]"
                      />
                      {getModuleTitle('assumptions-info', 'Key Assumptions & Statutory Notes') === '' && (
                        <p className="text-[11px] text-amber-600 font-medium">
                          Display title is deleted — the header banner will not appear on the live calculator page.
                        </p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-[#222325]">
                        Assumptions & Disclosures Copy (Rich-Text Editor)
                      </label>
                      <RichTextEditor
                        value={getAssumptionsContent()}
                        onChange={(html) => updateAssumptionsContent(html)}
                        placeholder="Specify statutory notes, interest conventions, tax provisions, or computational disclaimers..."
                        minHeight="220px"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: CUSTOM RICH-TEXT CONTENT SECTIONS */}
              {activeTab === 'content' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-[#fafafa] rounded-xl border border-[#e4e5e7]">
                    <div className="space-y-0.5">
                      <h2 className="text-sm font-bold text-[#222325] flex items-center gap-2">
                        <FileText className="w-4 h-4 text-[#1dbf73]" />
                        <span>Custom Educational & SEO Articles</span>
                      </h2>
                      <p className="text-xs text-[#74767e]">
                        Add unlimited formatted sections with headings, formulas, bullet points, callout boxes, and comparison tables.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleAddSection}
                      className="px-4 py-2 bg-[#222325] hover:bg-black text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Content Section</span>
                    </button>
                  </div>

                  <div className="space-y-6">
                    {(currentCalc.contentSections || []).map((sec: ContentSection, idx: number) => (
                      <div
                        key={sec.id || idx}
                        className="p-5 sm:p-6 bg-white rounded-xl border border-[#e4e5e7] space-y-4 shadow-2xs hover:border-[#1dbf73] transition-colors"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#e4e5e7] pb-3">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                disabled={idx === 0}
                                onClick={() => handleMoveSection(idx, 'up')}
                                title="Move section up"
                                className="p-1 rounded hover:bg-[#e4e5e7] disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
                              >
                                <ArrowUp className="w-3.5 h-3.5 text-[#74767e]" />
                              </button>
                              <button
                                type="button"
                                disabled={idx === (currentCalc.contentSections?.length || 1) - 1}
                                onClick={() => handleMoveSection(idx, 'down')}
                                title="Move section down"
                                className="p-1 rounded hover:bg-[#e4e5e7] disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
                              >
                                <ArrowDown className="w-3.5 h-3.5 text-[#74767e]" />
                              </button>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="w-6 h-6 rounded-full bg-[#222325] text-white text-xs font-bold flex items-center justify-center">
                                {idx + 1}
                              </span>
                              <span className="text-xs font-bold text-[#222325]">
                                {sec.title || 'Untitled Section'}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <label className="flex items-center gap-1.5 text-xs font-bold text-[#404145] cursor-pointer">
                              <input
                                type="checkbox"
                                checked={sec.isEnabled !== false}
                                onChange={(e) =>
                                  handleUpdateSection(sec.id, { isEnabled: e.target.checked })
                                }
                                className="w-4 h-4 text-[#1dbf73] accent-[#1dbf73] rounded"
                              />
                              <span>Enabled on Public Page</span>
                            </label>

                            <button
                              type="button"
                              onClick={() => handleRemoveSection(sec.id)}
                              className="text-rose-500 hover:text-rose-700 p-1.5 rounded hover:bg-rose-50 cursor-pointer transition-colors"
                              title="Delete this section"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="sm:col-span-2 space-y-1">
                            <label className="block text-[11px] font-bold text-[#74767e]">
                              Section Heading / Title (H2 for SEO)
                            </label>
                            <input
                              type="text"
                              value={sec.title}
                              onChange={(e) =>
                                handleUpdateSection(sec.id, { title: e.target.value })
                              }
                              className="w-full px-3.5 py-2 bg-[#fafafa] border border-[#e4e5e7] rounded-lg text-xs font-bold text-[#222325] focus:outline-none focus:border-[#1dbf73]"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="block text-[11px] font-bold text-[#74767e]">
                              Section Type & Category
                            </label>
                            <select
                              value={sec.sectionType || 'custom'}
                              onChange={(e) =>
                                handleUpdateSection(sec.id, {
                                  sectionType: e.target.value as any,
                                })
                              }
                              className="w-full px-3.5 py-2 bg-[#fafafa] border border-[#e4e5e7] rounded-lg text-xs font-semibold text-[#222325] focus:outline-none focus:border-[#1dbf73]"
                            >
                              <option value="overview">Overview & What is it</option>
                              <option value="how-to">How-to Guide & Steps</option>
                              <option value="formula">Formula & Mathematical Proof</option>
                              <option value="methodology">Computation Methodology</option>
                              <option value="assumptions">Statutory Assumptions & Rules</option>
                              <option value="pitfalls">Common Pitfalls & Mistakes</option>
                              <option value="custom">Custom Content Section</option>
                            </select>
                          </div>
                        </div>

                        {/* Visual Rich Text Editor */}
                        <div className="space-y-1.5 pt-1">
                          <label className="block text-[11px] font-bold text-[#74767e]">
                            Rich-Text Content Editor (supports H3/H4, Bold, Italic, Lists, Formulas, Tables, and Callout Boxes)
                          </label>
                          <RichTextEditor
                            value={sec.htmlContent}
                            onChange={(html) =>
                              handleUpdateSection(sec.id, { htmlContent: html })
                            }
                            placeholder="Type educational, formatted guide content here..."
                            minHeight="220px"
                          />
                        </div>
                      </div>
                    ))}

                    {(currentCalc.contentSections || []).length === 0 && (
                      <div className="p-8 bg-white rounded-xl border border-dashed border-[#e4e5e7] text-center space-y-3">
                        <p className="text-xs text-[#74767e]">
                          No custom content sections yet. Click &quot;Add Content Section&quot; above to create formatted articles or guides.
                        </p>
                      </div>
                    )}

                    {(currentCalc.contentSections || []).length > 0 && (
                      <div className="flex justify-end pt-3">
                        <button
                          type="button"
                          onClick={handleSaveAll}
                          disabled={isSaving}
                          className="px-5 py-2.5 bg-[#1dbf73] hover:bg-[#19a463] text-white text-xs font-bold rounded-lg flex items-center gap-2 transition-all cursor-pointer shadow-sm disabled:opacity-50"
                        >
                          <Save className="w-4 h-4" />
                          <span>{isSaving ? 'Saving Sections...' : 'Save All Content Sections'}</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 6: FAQS */}
              {activeTab === 'faqs' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-[#fafafa] rounded-xl border border-[#e4e5e7]">
                    <div className="space-y-0.5">
                      <h2 className="text-sm font-bold text-[#222325] flex items-center gap-2">
                        <HelpCircle className="w-4 h-4 text-[#1dbf73]" />
                        <span>Frequently Asked Questions & Schema.org FAQPage</span>
                      </h2>
                      <p className="text-xs text-[#74767e]">
                        Answers render as interactive accordions on the public page and generate Google-compliant FAQPage JSON-LD rich snippets.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleAddFaq}
                      className="px-4 py-2 bg-[#222325] hover:bg-black text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add FAQ Item</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {(currentCalc.faqs || []).map((faq: CalculatorFAQ, idx: number) => (
                      <div
                        key={faq.id || idx}
                        className="p-5 bg-white rounded-xl border border-[#e4e5e7] space-y-3 shadow-2xs"
                      >
                        <div className="flex items-center justify-between border-b border-[#e4e5e7] pb-2">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-[#1dbf73] text-white text-[10px] font-bold flex items-center justify-center">
                              Q{idx + 1}
                            </span>
                            <span className="text-xs font-bold text-[#222325]">
                              Question Item #{idx + 1}
                            </span>
                          </div>

                          <div className="flex items-center gap-3">
                            <label className="flex items-center gap-1.5 text-xs font-bold text-[#404145] cursor-pointer">
                              <input
                                type="checkbox"
                                checked={faq.isEnabled !== false}
                                onChange={(e) =>
                                  handleUpdateFaq(faq.id, { isEnabled: e.target.checked })
                                }
                                className="w-4 h-4 text-[#1dbf73] accent-[#1dbf73] rounded"
                              />
                              <span>Active</span>
                            </label>

                            <button
                              type="button"
                              onClick={() => handleRemoveFaq(faq.id)}
                              className="text-rose-500 hover:text-rose-700 p-1.5 rounded hover:bg-rose-50 cursor-pointer transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="block text-[11px] font-bold text-[#74767e]">
                            Question Text
                          </label>
                          <input
                            type="text"
                            value={faq.question}
                            onChange={(e) =>
                              handleUpdateFaq(faq.id, { question: e.target.value })
                            }
                            placeholder="e.g. How is interest calculated on reducing balance?"
                            className="w-full px-3.5 py-2 bg-[#fafafa] border border-[#e4e5e7] rounded-lg text-xs font-bold text-[#222325] focus:outline-none focus:border-[#1dbf73]"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="block text-[11px] font-bold text-[#74767e]">
                            Rich-Text Answer
                          </label>
                          <RichTextEditor
                            value={faq.answer}
                            onChange={(html) =>
                              handleUpdateFaq(faq.id, { answer: html })
                            }
                            placeholder="Write comprehensive, authoritative answer..."
                            minHeight="120px"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 7: SEO META & SNIPPET PREVIEW */}
              {activeTab === 'seo' && (
                <div className="space-y-6">
                  <div className="p-6 bg-white rounded-xl border border-[#e4e5e7] space-y-6 shadow-2xs">
                    <div className="border-b border-[#f0f0f0] pb-4">
                      <h2 className="text-sm font-bold text-[#222325]">
                        Google Search Snippet & Meta Tag Optimization
                      </h2>
                      <p className="text-xs text-[#74767e]">
                        Customize meta titles, meta descriptions, search keywords, and review live Google Search preview.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Left: Input Fields */}
                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-bold text-[#222325]">SEO Title</label>
                            <span
                              className={`text-[11px] font-mono font-bold ${
                                (currentCalc.seoTitle?.length || 0) > 60
                                  ? 'text-amber-600'
                                  : 'text-[#1dbf73]'
                              }`}
                            >
                              {currentCalc.seoTitle?.length || 0} / 60 chars
                            </span>
                          </div>
                          <input
                            type="text"
                            value={currentCalc.seoTitle || ''}
                            onChange={(e) =>
                              setCurrentCalc({ ...currentCalc, seoTitle: e.target.value })
                            }
                            placeholder={`${currentCalc.name} - Free Online Calculator | CalcPlatform`}
                            className="w-full px-3.5 py-2.5 bg-[#fafafa] border border-[#e4e5e7] rounded-lg text-xs font-bold text-[#222325] focus:outline-none focus:border-[#1dbf73]"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-bold text-[#222325]">
                              Meta Description
                            </label>
                            <span
                              className={`text-[11px] font-mono font-bold ${
                                (currentCalc.seoDescription?.length || 0) > 160
                                  ? 'text-amber-600'
                                  : 'text-[#1dbf73]'
                              }`}
                            >
                              {currentCalc.seoDescription?.length || 0} / 160 chars
                            </span>
                          </div>
                          <textarea
                            rows={3}
                            value={currentCalc.seoDescription || ''}
                            onChange={(e) =>
                              setCurrentCalc({
                                ...currentCalc,
                                seoDescription: e.target.value,
                              })
                            }
                            placeholder="Calculate your monthly EMI, total interest, and amortization schedule instantly with our free online calculator."
                            className="w-full px-3.5 py-2.5 bg-[#fafafa] border border-[#e4e5e7] rounded-lg text-xs text-[#222325] focus:outline-none focus:border-[#1dbf73]"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-[#222325]">
                            Keywords (comma separated)
                          </label>
                          <input
                            type="text"
                            value={currentCalc.seoKeywords || ''}
                            onChange={(e) =>
                              setCurrentCalc({
                                ...currentCalc,
                                seoKeywords: e.target.value,
                              })
                            }
                            placeholder="emi calculator, home loan calculator, interest formula"
                            className="w-full px-3.5 py-2.5 bg-[#fafafa] border border-[#e4e5e7] rounded-lg text-xs text-[#222325] focus:outline-none focus:border-[#1dbf73]"
                          />
                        </div>
                      </div>

                      {/* Right: Live Google Search Snippet Preview */}
                      <div className="space-y-3">
                        <span className="text-xs font-bold text-[#222325] uppercase tracking-wider block">
                          Live Google Search Snippet Preview
                        </span>

                        <div className="p-4 bg-[#fafafa] rounded-xl border border-[#e4e5e7] space-y-1.5 font-sans">
                          <div className="flex items-center gap-1.5 text-xs text-[#202124]">
                            <span className="w-4 h-4 rounded-full bg-[#1dbf73] text-white text-[9px] font-bold flex items-center justify-center">
                              C
                            </span>
                            <span className="text-[12px] text-[#4d5156]">
                              https://calcplatform.org &rsaquo; {currentCalc.slug}
                            </span>
                          </div>

                          <h3 className="text-base text-[#1a0dab] hover:underline font-medium cursor-pointer line-clamp-1">
                            {currentCalc.seoTitle ||
                              `${currentCalc.name} - Free Online Calculator | CalcPlatform`}
                          </h3>

                          <p className="text-xs text-[#4d5156] leading-relaxed line-clamp-2">
                            {currentCalc.seoDescription ||
                              currentCalc.shortDescription ||
                              `Instant online calculation for ${currentCalc.name}. Includes step-by-step mathematical methodology, visual charts, and FAQ answers.`}
                          </p>
                        </div>

                        {/* Schema.org FAQ Preview */}
                        <div className="p-3.5 bg-[#f4fdf8] rounded-xl border border-[#d8f5e5] text-xs space-y-1">
                          <div className="flex items-center gap-1.5 text-[#1dbf73] font-bold">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Rich Structured Data Active</span>
                          </div>
                          <p className="text-[11px] text-[#404145]">
                            {currentCalc.faqs?.length || 0} FAQ items automatically mapped to Schema.org <code className="font-mono text-[#1dbf73]">FAQPage</code> JSON-LD for rich snippet eligibility.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* In-App Confirmation Modal (Safe for Iframes & Preview) */}
      {confirmModal && confirmModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-[#e4e5e7] p-6 max-w-md w-full shadow-2xl space-y-5">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-200 shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-[#222325]">{confirmModal.title}</h3>
                <p className="text-xs text-[#74767e] leading-relaxed">{confirmModal.message}</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#f0f0f0]">
              <button
                type="button"
                onClick={() => setConfirmModal(null)}
                className="px-4 py-2 bg-[#fafafa] hover:bg-[#e4e5e7] text-[#404145] text-xs font-bold rounded-lg border border-[#e4e5e7] transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => confirmModal.action()}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg transition-all cursor-pointer shadow-sm flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{confirmModal.confirmLabel || 'Delete'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
