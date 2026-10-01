import React, { useEffect, useState } from 'react';
import { ArrowRight, Calculator as CalcIcon, Sparkles, Edit3, BookOpen, Layers, FileCheck } from 'lucide-react';
import { Category, Subcategory, Calculator } from '../types/schema.ts';
import { Breadcrumbs } from '../components/layout/Breadcrumbs.tsx';
import { DynamicCalculatorRenderer } from '../components/calculator/DynamicCalculatorRenderer.tsx';
import { EnterpriseTaxCalculatorApp } from '../components/calculator/EnterpriseTaxCalculatorApp.tsx';
import { SalaryTaxCalculatorApp } from '../components/calculator/SalaryTaxCalculatorApp.tsx';
import { SalaryTaxGuideContent } from '../components/calculator/SalaryTaxGuideContent.tsx';
import { OldVsNewRegimeCalculatorApp } from '../components/calculator/OldVsNewRegimeCalculatorApp.tsx';
import { OldVsNewRegimeGuideContent } from '../components/calculator/OldVsNewRegimeGuideContent.tsx';
import { TdsCalculatorApp } from '../components/calculator/TdsCalculatorApp.tsx';
import { TdsGuideContent } from '../components/calculator/TdsGuideContent.tsx';
import { CapitalGainsCalculatorApp } from '../components/calculator/CapitalGainsCalculatorApp.tsx';
import { CapitalGainsGuideContent } from '../components/calculator/CapitalGainsGuideContent.tsx';
import { HraCalculatorApp } from '../components/calculator/HraCalculatorApp.tsx';
import { HraGuideContent } from '../components/calculator/HraGuideContent.tsx';
import { LoansCalculatorApp } from '../components/calculator/LoansCalculatorApp.tsx';
import { HomeLoanGuideContent } from '../components/calculator/HomeLoanGuideContent.tsx';
import { PersonalLoanGuideContent } from '../components/calculator/PersonalLoanGuideContent.tsx';
import { CarLoanGuideContent } from '../components/calculator/CarLoanGuideContent.tsx';
import { BikeLoanGuideContent } from '../components/calculator/BikeLoanGuideContent.tsx';
import { EducationLoanGuideContent } from '../components/calculator/EducationLoanGuideContent.tsx';
import { BusinessLoanGuideContent } from '../components/calculator/BusinessLoanGuideContent.tsx';
import { BusinessLoanCalculatorApp } from '../components/calculator/BusinessLoanCalculatorApp.tsx';
import { GoldLoanGuideContent } from '../components/calculator/GoldLoanGuideContent.tsx';
import { LoanAgainstPropertyGuideContent } from '../components/calculator/LoanAgainstPropertyGuideContent.tsx';
import { EmiCalculatorGuideContent } from '../components/calculator/EmiCalculatorGuideContent.tsx';
import { LoanEligibilityGuideContent } from '../components/calculator/LoanEligibilityGuideContent.tsx';
import { LoanPrepaymentGuideContent } from '../components/calculator/LoanPrepaymentGuideContent.tsx';
import { LoanAffordabilityGuideContent } from '../components/calculator/LoanAffordabilityGuideContent.tsx';
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
    const pageTitle = calculator.seoTitle || `${calculator.name} - CalcPlatform`;
    const pageDesc = calculator.seoDescription || calculator.shortDescription || '';

    document.title = pageTitle;

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', pageDesc);
    }

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', pageTitle);

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', pageDesc);

    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle) {
      twitterTitle.setAttribute('content', pageTitle);
    } else {
      const t = document.createElement('meta');
      t.setAttribute('name', 'twitter:title');
      t.setAttribute('content', pageTitle);
      document.head.appendChild(t);
    }

    const twitterDesc = document.querySelector('meta[name="twitter:description"]');
    if (twitterDesc) {
      twitterDesc.setAttribute('content', pageDesc);
    } else {
      const t = document.createElement('meta');
      t.setAttribute('name', 'twitter:description');
      t.setAttribute('content', pageDesc);
      document.head.appendChild(t);
    }

    const schemaScriptId = 'calculator-jsonld-schema';
    let script = document.getElementById(schemaScriptId) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement('script');
      script.id = schemaScriptId;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }

    const activeFaqs = (calculator.faqs || calculator.content?.faqs || []).filter(
      (f: any) => f.isEnabled !== false
    );

    const schemaGraph: any[] = [
      {
        '@type': 'WebApplication',
        '@id': `${window.location.href}#webapp`,
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
      },
    ];

    if (activeFaqs.length > 0) {
      schemaGraph.push({
        '@type': 'FAQPage',
        '@id': `${window.location.href}#faqpage`,
        mainEntity: activeFaqs.map((faq: any) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: (faq.answer || '').replace(/<[^>]*>?/gm, '').trim(),
          },
        })),
      });
    }

    const schemaData = {
      '@context': 'https://schema.org',
      '@graph': schemaGraph,
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

      {/* Main Dynamic Calculator Engine Rendering */}
      {calculator.slug === 'income-tax-calculator' ? (
        <EnterpriseTaxCalculatorApp calculator={calculator} />
      ) : calculator.slug === 'capital-gains-tax' ? (
        <div className="space-y-12">
          <CapitalGainsCalculatorApp />
          <CapitalGainsGuideContent />
        </div>
      ) : calculator.slug === 'hra' ? (
        <div className="space-y-12">
          <HraCalculatorApp />
          <HraGuideContent />
        </div>
      ) : calculator.slug === 'home-loan-emi-calculator' ? (
        <div className="space-y-12">
          <LoansCalculatorApp calculator={calculator} />
          <HomeLoanGuideContent />
        </div>
      ) : calculator.slug === 'personal-loan-emi-calculator' ? (
        <div className="space-y-12">
          <LoansCalculatorApp calculator={calculator} />
          <PersonalLoanGuideContent />
        </div>
      ) : calculator.slug === 'car-loan-emi-calculator' ? (
        <div className="space-y-12">
          <LoansCalculatorApp calculator={calculator} />
          <CarLoanGuideContent />
        </div>
      ) : calculator.slug === 'bike-loan-emi-calculator' ? (
        <div className="space-y-12">
          <LoansCalculatorApp calculator={calculator} />
          <BikeLoanGuideContent />
        </div>
      ) : calculator.slug === 'education-loan-emi-calculator' ? (
        <div className="space-y-12">
          <LoansCalculatorApp calculator={calculator} />
          <EducationLoanGuideContent />
        </div>
      ) : calculator.slug === 'business-loan-emi-calculator' ? (
        <div className="space-y-12">
          <BusinessLoanCalculatorApp calculator={calculator} />
          <BusinessLoanGuideContent />
        </div>
      ) : calculator.slug === 'loan-against-property-calculator' || calculator.slug.includes('property') ? (
        <div className="space-y-12">
          <LoansCalculatorApp calculator={calculator} />
          <LoanAgainstPropertyGuideContent />
        </div>
      ) : calculator.slug === 'gold-loan-calculator' || calculator.slug === 'gold-loan' || subcategory.slug === 'gold-loan' ? (
        <div className="space-y-12">
          <LoansCalculatorApp calculator={calculator} />
          <GoldLoanGuideContent />
        </div>
      ) : calculator.slug === 'emi-calculator' ? (
        <div className="space-y-12">
          <LoansCalculatorApp calculator={calculator} />
          <EmiCalculatorGuideContent />
        </div>
      ) : calculator.slug === 'loan-eligibility-calculator' ? (
        <div className="space-y-12">
          <LoansCalculatorApp calculator={calculator} />
          <LoanEligibilityGuideContent />
        </div>
      ) : calculator.slug === 'loan-prepayment-calculator' ? (
        <div className="space-y-12">
          <LoansCalculatorApp calculator={calculator} />
          <LoanPrepaymentGuideContent />
        </div>
      ) : calculator.slug === 'loan-affordability' || calculator.slug === 'loan-affordability-calculator' ? (
        <div className="space-y-12">
          <LoansCalculatorApp calculator={calculator} />
          <LoanAffordabilityGuideContent />
        </div>
      ) : category.slug === 'loans-emi' || calculator.engineType === 'loans_emi' || calculator.slug.includes('loan') || calculator.slug.includes('emi') ? (
        <LoansCalculatorApp calculator={calculator} />
      ) : calculator.slug === 'old-vs-new-tax-regime' || calculator.slug === 'old-vs-new-tax-regime-calculator' ? (
        <div className="space-y-10">
          <OldVsNewRegimeCalculatorApp />

          {/* Guide Content */}
          <OldVsNewRegimeGuideContent />

          {/* FAQ Accordion Section */}
          {calculator.faqs && calculator.faqs.length > 0 && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
              <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
                <div className="w-8 h-8 rounded-lg bg-[#f4fdf8] text-[#1dbf73] flex items-center justify-center border border-[#d8f5e5] shrink-0">
                  <BookOpen className="w-4 h-4" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-[#222325]">
                  Frequently Asked Questions (Old vs. New Tax Regime FY 2026-27)
                </h3>
              </div>
              <div className="space-y-3">
                {calculator.faqs
                  .filter((f) => f.isEnabled !== false)
                  .map((faq, idx) => (
                    <details
                      key={faq.id || idx}
                      open
                      className="group border border-slate-200 rounded-2xl overflow-hidden bg-[#fafafa]"
                    >
                      <summary className="p-4 font-bold text-xs sm:text-sm text-[#222325] flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-100 transition-colors list-none">
                        <span>{faq.question}</span>
                        <span className="text-slate-400 group-open:rotate-180 transition-transform">
                          ▼
                        </span>
                      </summary>
                      <div
                        className="p-4 pt-3 text-xs sm:text-sm text-[#404145] leading-relaxed border-t border-slate-100 bg-white prose prose-slate max-w-none"
                        dangerouslySetInnerHTML={{ __html: faq.answer }}
                      />
                    </details>
                  ))}
              </div>
            </div>
          )}
        </div>
      ) : calculator.slug === 'salary-tax' || calculator.slug === 'salary-tax-calculator' ? (
        <div className="space-y-10">
          <SalaryTaxCalculatorApp />

          {/* Complete 16-Section Editorial Guide */}
          <SalaryTaxGuideContent />

          {/* Section 17: FAQ Accordion Section */}
          {calculator.faqs && calculator.faqs.length > 0 && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
              <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
                <div className="w-8 h-8 rounded-lg bg-[#f4fdf8] text-[#1dbf73] flex items-center justify-center border border-[#d8f5e5] shrink-0">
                  <BookOpen className="w-4 h-4" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-[#222325]">
                  Frequently Asked Questions (Salary Tax FY 2026-27)
                </h3>
              </div>
              <div className="space-y-3">
                {calculator.faqs
                  .filter((f) => f.isEnabled !== false)
                  .map((faq, idx) => (
                    <details
                      key={faq.id || idx}
                      open
                      className="group border border-slate-200 rounded-2xl overflow-hidden bg-[#fafafa]"
                    >
                      <summary className="p-4 font-bold text-xs sm:text-sm text-[#222325] flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-100 transition-colors list-none">
                        <span>{faq.question}</span>
                        <span className="text-slate-400 group-open:rotate-180 transition-transform">
                          ▼
                        </span>
                      </summary>
                      <div
                        className="p-4 pt-3 text-xs sm:text-sm text-[#404145] leading-relaxed border-t border-slate-100 bg-white prose prose-slate max-w-none"
                        dangerouslySetInnerHTML={{ __html: faq.answer }}
                      />
                    </details>
                  ))}
              </div>
            </div>
          )}
        </div>
      ) : calculator.slug === 'tds' || calculator.slug === 'tds-calculator' ? (
        <div className="space-y-10">
          <TdsCalculatorApp />

          {/* Complete TDS Guide Content */}
          <TdsGuideContent />

          {/* FAQ Accordion Section */}
          {calculator.faqs && calculator.faqs.length > 0 && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
              <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
                <div className="w-8 h-8 rounded-lg bg-[#f4fdf8] text-[#1dbf73] flex items-center justify-center border border-[#d8f5e5] shrink-0">
                  <BookOpen className="w-4 h-4" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-[#222325]">
                  Frequently Asked Questions (TDS FY 2026-27)
                </h3>
              </div>
              <div className="space-y-3">
                {calculator.faqs
                  .filter((f) => f.isEnabled !== false)
                  .map((faq, idx) => (
                    <details
                      key={faq.id || idx}
                      open
                      className="group border border-slate-200 rounded-2xl overflow-hidden bg-[#fafafa]"
                    >
                      <summary className="p-4 font-bold text-xs sm:text-sm text-[#222325] flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-100 transition-colors list-none">
                        <span>{faq.question}</span>
                        <span className="text-slate-400 group-open:rotate-180 transition-transform">
                          ▼
                        </span>
                      </summary>
                      <div
                        className="p-4 pt-3 text-xs sm:text-sm text-[#404145] leading-relaxed border-t border-slate-100 bg-white prose prose-slate max-w-none"
                        dangerouslySetInnerHTML={{ __html: faq.answer }}
                      />
                    </details>
                  ))}
              </div>
            </div>
          )}
        </div>
      ) : (
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
      )}
    </div>
  );
};
