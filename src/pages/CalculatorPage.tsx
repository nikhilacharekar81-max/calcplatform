import React, { useEffect, useState } from 'react';
import { ArrowRight, Calculator as CalcIcon, Sparkles, Edit3, BookOpen, Layers, FileCheck } from 'lucide-react';
import { Category, Subcategory, Calculator } from '../types/schema.ts';
import { Breadcrumbs } from '../components/layout/Breadcrumbs.tsx';
import { DynamicCalculatorRenderer } from '../components/calculator/DynamicCalculatorRenderer.tsx';
import { getAdminToken } from '../services/api.ts';

interface CalculatorPageProps {
  category: Category;
  subcategory: Subcategory;
  calculator: Calculator;
  relatedCalculators?: Calculator[];
}

export const CalculatorPage: React.FC<CalculatorPageProps> = ({
  category,
  subcategory,
  calculator,
  relatedCalculators = [],
}) => {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setIsAdmin(Boolean(getAdminToken()));
  }, []);
  const breadcrumbs = [
    { label: category.name, href: `/${category.slug}` },
    { label: subcategory.name, href: `/${category.slug}/${subcategory.slug}` },
    { label: calculator.name, isCurrent: true },
  ];

  useEffect(() => {
    document.title = calculator.seoTitle || `${calculator.name} - CalcPlatform`;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', calculator.seoDescription || calculator.shortDescription || '');
    }

    const schemaScriptId = 'calculator-jsonld-schema';
    let script = document.getElementById(schemaScriptId) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement('script');
      script.id = schemaScriptId;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }

    const schemaData = {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: calculator.name,
      description: calculator.shortDescription || calculator.seoDescription,
      applicationCategory: 'UtilityApplication',
      operatingSystem: 'Any',
      browserRequirements: 'Requires JavaScript',
      url: window.location.href,
      about: {
        '@type': 'Thing',
        name: category.name,
      },
    };

    script.textContent = JSON.stringify(schemaData);

    return () => {
      const el = document.getElementById(schemaScriptId);
      if (el) el.remove();
    };
  }, [calculator, category]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Breadcrumbs items={breadcrumbs} />

      {/* Admin Quick Action Toolbar */}
      {isAdmin && (
        <div className="bg-[#222325] text-white px-4 py-3 rounded-xl flex flex-wrap items-center justify-between gap-3 shadow-md border border-[#333]">
          <div className="flex items-center gap-2 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-[#1dbf73] animate-pulse" />
            <span className="text-[#1dbf73] uppercase tracking-wider">Admin Quick Actions:</span>
            <span className="text-white font-semibold">{calculator.name}</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <a
              href={`/admin/calculators/${calculator.id}`}
              className="px-3 py-1.5 bg-[#1dbf73] hover:bg-[#19a463] text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Formulas & Inputs</span>
            </a>
            <a
              href={`/admin/content-seo?calculatorId=${calculator.id}&tab=how-to`}
              className="px-3 py-1.5 bg-[#333438] hover:bg-[#44464c] text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#1dbf73]" />
              <span>Edit How-to Guide</span>
            </a>
            <a
              href={`/admin/content-seo?calculatorId=${calculator.id}&tab=examples`}
              className="px-3 py-1.5 bg-[#333438] hover:bg-[#44464c] text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <FileCheck className="w-3.5 h-3.5 text-[#1dbf73]" />
              <span>Edit Worked Examples</span>
            </a>
            <a
              href={`/admin/content-seo?calculatorId=${calculator.id}&tab=seo`}
              className="px-3 py-1.5 bg-[#333438] hover:bg-[#44464c] text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#1dbf73]" />
              <span>SEO & Content</span>
            </a>
          </div>
        </div>
      )}

      {/* Header Info */}
      <div className="space-y-2 border-b border-[#e4e5e7] pb-6">
        <div className="flex items-center gap-2 text-xs font-bold text-[#1dbf73] uppercase tracking-wider">
          <CalcIcon className="w-4 h-4" />
          <span>{category.name} &bull; {subcategory.name}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#222325]">
          {calculator.name}
        </h1>
        {calculator.shortDescription && (
          <p className="text-sm text-[#74767e] max-w-3xl leading-relaxed">
            {calculator.shortDescription}
          </p>
        )}
      </div>

      {/* Main Dynamic Calculator Engine Rendering All Configured Modules */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <main className="lg:col-span-8 xl:col-span-9 space-y-8">
          <DynamicCalculatorRenderer calculator={calculator} />
        </main>

        {/* Sidebar: Related Tools */}
        <aside className="lg:col-span-4 xl:col-span-3 space-y-6">
          <div className="p-5 bg-[#fafafa] rounded-xl border border-[#e4e5e7] space-y-4 sticky top-20">
            <h3 className="text-xs font-bold text-[#222325] uppercase tracking-wider">
              Related {subcategory.name} Tools
            </h3>
            {relatedCalculators.length > 0 ? (
              <div className="space-y-2.5">
                {relatedCalculators.map((rel) => (
                  <a
                    key={rel.id}
                    href={`/${category.slug}/${subcategory.slug}/${rel.slug}`}
                    className="block p-3.5 bg-white rounded-lg border border-[#e4e5e7] hover:border-[#1dbf73] hover:shadow-xs transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#222325] group-hover:text-[#1dbf73] truncate">
                        {rel.name}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#74767e] group-hover:text-[#1dbf73] transition-colors shrink-0" />
                    </div>
                    {rel.shortDescription && (
                      <p className="text-[11px] text-[#74767e] mt-1 line-clamp-1">
                        {rel.shortDescription}
                      </p>
                    )}
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#74767e]">
                No other calculators in this subcategory yet.
              </p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};
