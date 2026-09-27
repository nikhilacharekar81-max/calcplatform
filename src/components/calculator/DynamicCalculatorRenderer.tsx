import React, { useState, useEffect, useMemo } from 'react';
import { Calculator, CalculatorField, ContentSection } from '../../types/schema.ts';
import { evaluateFormula, formatResultValue } from '../../utils/mathEngine.ts';
import {
  MODULE_COMPONENT_MAP,
  normalizeModuleId,
  getDefaultModuleConfigs,
  CanonicalModuleId,
} from './modules/ModuleRegistry';
import { BookOpen, AlertCircle, FileText, CheckCircle2, Edit3, Sliders } from 'lucide-react';

interface DynamicCalculatorRendererProps {
  calculator: Calculator;
  isPreview?: boolean;
}

export const DynamicCalculatorRenderer: React.FC<DynamicCalculatorRendererProps> = ({
  calculator,
  isPreview = false,
}) => {
  // Initialize default form values from field definitions
  const initialValues = useMemo(() => {
    const vals: Record<string, any> = {};
    if (calculator.fields && Array.isArray(calculator.fields)) {
      calculator.fields.forEach((field) => {
        if (field.defaultValue !== undefined) {
          vals[field.id] = field.defaultValue;
        } else if (field.type === 'number' || field.type === 'slider') {
          vals[field.id] = field.min !== undefined ? field.min : 0;
        } else if (field.type === 'checkbox') {
          vals[field.id] = false;
        } else if (field.type === 'select' || field.type === 'radio') {
          vals[field.id] = field.options && field.options.length > 0 ? field.options[0].value : '';
        } else if (field.type === 'date') {
          vals[field.id] = new Date().toISOString().split('T')[0];
        } else {
          vals[field.id] = '';
        }
      });
    }
    return vals;
  }, [calculator.fields]);

  const [formValues, setFormValues] = useState<Record<string, any>>(initialValues);

  // Hydrate from URL query parameters if on public live page
  useEffect(() => {
    if (!isPreview && typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const urlValues = { ...initialValues };
      let hasCustom = false;

      calculator.fields?.forEach((f) => {
        if (urlParams.has(f.id)) {
          const raw = urlParams.get(f.id)!;
          if (f.type === 'number' || f.type === 'slider') {
            const num = parseFloat(raw);
            if (!isNaN(num)) {
              urlValues[f.id] = num;
              hasCustom = true;
            }
          } else if (f.type === 'checkbox') {
            urlValues[f.id] = raw === 'true' || raw === '1';
            hasCustom = true;
          } else {
            urlValues[f.id] = raw;
            hasCustom = true;
          }
        }
      });

      if (hasCustom) {
        setFormValues(urlValues);
        return;
      }
    }
    setFormValues(initialValues);
  }, [initialValues, calculator.fields, isPreview]);

  const handleInputChange = (fieldId: string, value: any) => {
    setFormValues((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
  };

  const handleReset = () => {
    setFormValues(initialValues);
  };

  // Evaluate all output formulas once centrally (Structured Calculator Result)
  const evaluatedOutputs = useMemo(() => {
    if (!calculator.outputs || !Array.isArray(calculator.outputs)) {
      return [];
    }

    const context: Record<string, any> = { ...formValues };

    return calculator.outputs.map((out) => {
      let rawVal: any = 0;
      try {
        if (out.formula) {
          rawVal = evaluateFormula(out.formula, context);
          context[out.id] = rawVal; // make previous outputs accessible to downstream formulas
        }
      } catch (err) {
        console.warn(`Formula evaluation error on ${out.id}:`, err);
        rawVal = 0;
      }

      const formatted = formatResultValue(rawVal, out.format, out.prefix, out.suffix);
      return {
        def: out,
        formatted,
        raw: rawVal,
      };
    });
  }, [calculator.outputs, formValues]);

  // Retrieve modules configuration sorted strictly by admin order
  const activeModules = useMemo(() => {
    const rawConfigs =
      calculator.modules && calculator.modules.length > 0
        ? calculator.modules
        : getDefaultModuleConfigs();

    // Map each config to its canonical ID and filter ONLY enabled modules
    return rawConfigs
      .map((mod) => ({
        ...mod,
        canonicalId: normalizeModuleId(mod.moduleId),
      }))
      .filter((mod): mod is typeof mod & { canonicalId: CanonicalModuleId } => {
        return Boolean(mod.canonicalId && mod.isEnabled);
      })
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  }, [calculator.modules]);

  // Set of enabled canonical module IDs for cross-checking
  const enabledModuleIds = useMemo(() => {
    return new Set(activeModules.map((m) => m.canonicalId));
  }, [activeModules]);

  // Custom standalone content sections (excluding those owned by dedicated modules)
  const activeCustomContentSections = useMemo(() => {
    if (!calculator.contentSections || !Array.isArray(calculator.contentSections)) {
      return [];
    }

    return calculator.contentSections
      .filter((s) => {
        if (!s.isEnabled || !s.htmlContent || s.htmlContent.trim().length === 0) {
          return false;
        }

        const type = (s.sectionType || 'custom').toLowerCase();
        // If it's a how-to section, it's rendered by the how-to-guide module
        if (type === 'how-to' || s.title.toLowerCase().includes('how to')) {
          return false;
        }
        // If it's an assumptions section, it's rendered by assumptions-info module
        if (type === 'assumptions' || s.title.toLowerCase().includes('assumption')) {
          return false;
        }
        // If it's a formula/methodology section and formula-methodology module is active
        if ((type === 'formula' || type === 'methodology') && enabledModuleIds.has('formula-methodology')) {
          return false;
        }

        return true;
      })
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  }, [calculator.contentSections, enabledModuleIds]);

  return (
    <div className="space-y-8">
      {/* 1. Dynamic Modules Pipeline Rendered via Central ModuleRegistry */}
      {activeModules.length === 0 ? (
        <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-8 text-center space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 mx-auto flex items-center justify-center">
            <Sliders className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-amber-900">All Calculator Modules Are Currently Disabled</h3>
          <p className="text-xs text-amber-700 max-w-md mx-auto leading-relaxed">
            All interactive modules (Inputs, Results, Chart, Formulas, Guides, etc.) are currently toggled off in the Admin configuration for this calculator.
          </p>
          <div className="pt-1">
            <a
              href={`/admin/modules?calculatorId=${calculator.id}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#1dbf73] hover:bg-[#19a463] text-white text-xs font-bold rounded-lg shadow-sm transition-all"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Enable Modules in Admin &rarr;</span>
            </a>
          </div>
        </div>
      ) : (
        activeModules.map((modConfig) => {
          const Component = MODULE_COMPONENT_MAP[modConfig.canonicalId];
          if (!Component) return null;

          return (
            <section
              key={modConfig.id || modConfig.canonicalId}
              data-module-id={modConfig.canonicalId}
              data-module-order={modConfig.order}
            >
              <Component
                calculator={calculator}
                formValues={formValues}
                evaluatedOutputs={evaluatedOutputs}
                onInputChange={handleInputChange}
                onReset={handleReset}
                settings={modConfig.settings}
              />
            </section>
          );
        })
      )}

      {/* 2. Custom Supplementary Articles (Only custom articles, zero module duplication) */}
      {activeCustomContentSections.length > 0 && activeModules.length > 0 && (
        <div className="space-y-6 pt-2">
          {activeCustomContentSections.map((section: ContentSection, idx: number) => (
            <article
              key={section.id || idx}
              className="bg-white rounded-xl border border-[#e4e5e7] p-6 sm:p-7 shadow-2xs space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#f0f0f0] pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#f4fdf8] text-[#1dbf73] flex items-center justify-center border border-[#d8f5e5] shrink-0">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-base sm:text-lg font-bold text-[#222325]">
                      {section.title}
                    </h2>
                    {section.sectionType && (
                      <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase font-mono tracking-wider bg-[#fafafa] border border-[#e4e5e7] text-[#74767e] rounded">
                        {section.sectionType}
                      </span>
                    )}
                  </div>
                </div>

                <a
                  href={`/admin/content-seo?calculatorId=${calculator.id}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#fafafa] hover:bg-[#e4e5e7] text-[#404145] hover:text-[#222325] text-xs font-bold rounded-lg border border-[#e4e5e7] transition-colors cursor-pointer self-start sm:self-center"
                  title="Edit or delete this content section in Rich-Text & SEO Manager"
                >
                  <Edit3 className="w-3.5 h-3.5 text-[#1dbf73]" />
                  <span>Edit Section</span>
                </a>
              </div>

              <div
                className="text-xs sm:text-sm text-[#404145] leading-relaxed prose prose-slate max-w-none font-sans"
                dangerouslySetInnerHTML={{ __html: section.htmlContent }}
              />
            </article>
          ))}
        </div>
      )}
    </div>
  );
};
