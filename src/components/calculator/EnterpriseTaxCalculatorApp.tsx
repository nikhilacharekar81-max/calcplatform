import React, { useState, useMemo } from 'react';
import {
  Calculator as CalcIcon,
  Palette,
  Sliders,
  Printer,
  FileDown,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Code,
  Copy,
  Check,
  BookOpen,
  HelpCircle,
  FileText,
  ChevronDown,
  Edit3,
} from 'lucide-react';
import { EmbedModal } from './EmbedModal.tsx';
import { Calculator as CalculatorType, ContentSection } from '../../types/schema.ts';
import { formatContentHtml } from '../../utils/formatters.ts';
import { calculateIndiaIncomeTax } from '../../calculators/india/incomeTax.ts';

interface EnterpriseTaxCalculatorAppProps {
  calculator?: CalculatorType;
}

export const EnterpriseTaxCalculatorApp: React.FC<EnterpriseTaxCalculatorAppProps> = ({
  calculator,
}) => {
  const [currentTab, setCurrentTab] = useState<'calculator' | 'whitelabel'>('calculator');
  const [isEmbedModalOpen, setIsEmbedModalOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // White-Label Branding State
  const [branding, setBranding] = useState({
    brandName: 'TaxOS™ Enterprise Advisory',
    footerText: 'Direct Tax Calculation & Comparison Engine',
    primaryColor: '#1dbf73',
  });

  // Profile Inputs
  const [profile, setProfile] = useState({
    fy: '2026-27',
    age: 45,
    employment: 'salaried',
  });

  // Salary Inputs
  const [salary, setSalary] = useState({
    gross: 1800000,
    profTax: 2500,
  });

  // House Property Inputs
  const [houseProperty, setHouseProperty] = useState({
    type: 'self',
    interest: 200000,
  });

  // Capital Gains
  const [capitalGains, setCapitalGains] = useState({
    stcg: 0,
    ltcg: 0,
  });

  // Other Sources
  const [otherSources, setOtherSources] = useState({
    interest: 30000,
    other: 0,
  });

  // Deductions (Old Regime)
  const [deductions, setDeductions] = useState({
    sec80C: 150000,
    sec80D: 25000,
    sec80CCD: 50000,
  });

  // Dynamic Tax Computation Logic via canonical calculateIndiaIncomeTax engine (AY 2026-27)
  const results = useMemo(() => {
    const totalGross = salary.gross + otherSources.interest + otherSources.other + capitalGains.stcg + capitalGains.ltcg;
    const additionalDed = Math.min(150000, deductions.sec80C) + Math.min(50000, deductions.sec80D) + Math.min(50000, deductions.sec80CCD) + (houseProperty.type === 'self' ? Math.min(200000, houseProperty.interest) : 0);

    const newRes = calculateIndiaIncomeTax({
      grossIncome: totalGross,
      salaryIncome: salary.gross,
      additionalDeductions: additionalDed,
      regime: 'NEW',
      age: profile.age,
    });

    const oldRes = calculateIndiaIncomeTax({
      grossIncome: totalGross,
      salaryIncome: salary.gross,
      additionalDeductions: additionalDed,
      regime: 'OLD',
      age: profile.age,
    });

    return {
      old: {
        gross: totalGross,
        stdDed: oldRes.standardDeduction,
        deductions: oldRes.additionalDeductions,
        taxable: oldRes.taxableIncome,
        netTax: oldRes.totalTax,
      },
      new: {
        gross: totalGross,
        stdDed: newRes.standardDeduction,
        deductions: newRes.additionalDeductions,
        taxable: newRes.taxableIncome,
        netTax: newRes.totalTax,
      },
    };
  }, [profile, salary, houseProperty, capitalGains, otherSources, deductions]);

  const comparison = useMemo(() => {
    const oldTax = results.old.netTax;
    const newTax = results.new.netTax;
    const diff = Math.abs(oldTax - newTax);

    if (oldTax < newTax) return { recommended: 'Old Regime', savings: diff };
    if (newTax < oldTax) return { recommended: 'New Regime', savings: diff };
    return { recommended: 'Both Equal', savings: 0 };
  }, [results]);

  const handlePrint = () => {
    window.print();
  };

  const handleExportJSON = () => {
    const payload = {
      brand: branding.brandName,
      timestamp: new Date().toISOString(),
      profile,
      salary,
      results,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tax_audit_report_${profile.fy}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Content Sections from Rich-Text & SEO Content Manager
  const activeContentSections = useMemo(() => {
    if (!calculator?.contentSections || !Array.isArray(calculator.contentSections)) {
      return [];
    }
    return calculator.contentSections.filter((s) => {
      if (s.isEnabled === false || !s.htmlContent || s.htmlContent.trim().length === 0) {
        return false;
      }
      const type = (s.sectionType || '').toLowerCase();
      // Do not duplicate How-To section here as it has its own dedicated card below
      if (type === 'how-to' || s.title.toLowerCase().includes('how to')) {
        return false;
      }
      return true;
    });
  }, [calculator?.contentSections]);

  const usageInstructions = useMemo(() => {
    if (calculator?.contentSections && Array.isArray(calculator.contentSections)) {
      const sec = calculator.contentSections.find(
        (s) => s.isEnabled !== false && (s.sectionType === 'how-to' || s.title?.toLowerCase().includes('how to'))
      );
      if (sec && sec.htmlContent && sec.htmlContent.trim().length > 0) {
        return sec.htmlContent;
      }
      return '';
    }
    const legacy = calculator?.content?.usageInstructions;
    return legacy && legacy.trim().length > 0 ? legacy : '';
  }, [calculator?.contentSections, calculator?.content?.usageInstructions]);

  const isHowToEnabled = useMemo(() => {
    const mod = calculator?.modules?.find((m) => m.moduleId === 'how-to-guide');
    if (mod && mod.isEnabled === false) return false;
    const sec = calculator?.contentSections?.find(
      (s) => s.sectionType === 'how-to' || s.title?.toLowerCase().includes('how to')
    );
    if (sec && sec.isEnabled === false) return false;
    return Boolean(usageInstructions && usageInstructions.trim().length > 0);
  }, [calculator?.modules, calculator?.contentSections, usageInstructions]);

  const howToTitle = useMemo(() => {
    const mod = calculator?.modules?.find((m) => m.moduleId === 'how-to-guide');
    if (mod?.settings && typeof mod.settings.title === 'string') return mod.settings.title;
    const sec = calculator?.contentSections?.find(
      (s) => s.sectionType === 'how-to' || s.title?.toLowerCase().includes('how to')
    );
    if (sec && typeof sec.title === 'string') return sec.title;
    return 'How to Use This Income Tax Calculator';
  }, [calculator?.modules, calculator?.contentSections]);

  const faqsList = calculator?.faqs || calculator?.content?.faqs || [];
  const isFaqsEnabled = useMemo(() => {
    const mod = calculator?.modules?.find((m) => m.moduleId === 'faq-accordion');
    if (mod && mod.isEnabled === false) return false;
    return faqsList.length > 0;
  }, [calculator?.modules, faqsList]);

  const faqsTitle = useMemo(() => {
    const mod = calculator?.modules?.find((m) => m.moduleId === 'faq-accordion');
    if (mod?.settings && typeof mod.settings.title === 'string') return mod.settings.title;
    return 'Frequently Asked Questions (FAQs)';
  }, [calculator?.modules]);

  const examplesList = calculator?.examples || [];
  const isExamplesEnabled = useMemo(() => {
    const mod = calculator?.modules?.find((m) => m.moduleId === 'worked-examples');
    if (mod && mod.isEnabled === false) return false;
    return examplesList.length > 0;
  }, [calculator?.modules, examplesList]);

  const examplesTitle = useMemo(() => {
    const mod = calculator?.modules?.find((m) => m.moduleId === 'worked-examples');
    if (mod?.settings && typeof mod.settings.title === 'string') return mod.settings.title;
    return 'Worked Examples & Real Tax Scenarios';
  }, [calculator?.modules]);

  return (
    <div className="space-y-8 select-none">
      {/* App Bar / Branding Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-base shadow-sm transition-all duration-300 shrink-0"
            style={{ backgroundColor: branding.primaryColor }}
          >
            <CalcIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-sm text-slate-900 tracking-tight">
              {branding.brandName}
            </h2>
            <p className="text-[11px] text-slate-500">{branding.footerText}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setIsEmbedModalOpen(true)}
            className="px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 bg-[#f4fdf8] text-[#1dbf73] border border-[#d8f5e5] hover:bg-[#e8faef] cursor-pointer"
          >
            <Code className="w-3.5 h-3.5" />
            <span>Embed Widget</span>
          </button>

          <div className="bg-slate-100 p-1 rounded-xl border border-slate-200 flex items-center space-x-1">
            <button
              type="button"
              onClick={() => setCurrentTab('calculator')}
              className={`px-3.5 py-1.5 rounded-lg text-xs transition-all flex items-center cursor-pointer ${
                currentTab === 'calculator'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900 font-medium'
              }`}
            >
              <Sliders className="w-3.5 h-3.5 mr-1.5" />
              <span>Calculator</span>
            </button>
            <button
              type="button"
              onClick={() => setCurrentTab('whitelabel')}
              className={`px-3.5 py-1.5 rounded-lg text-xs transition-all flex items-center cursor-pointer ${
                currentTab === 'whitelabel'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900 font-medium'
              }`}
            >
              <Palette className="w-3.5 h-3.5 mr-1.5" />
              <span>White-Label Studio</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Tab Workspace */}
      <div>
        {currentTab === 'calculator' ? (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* LEFT INPUT FORMS */}
              <div className="lg:col-span-7 space-y-6">
                {/* MODULE 1: PROFILE & FINANCIAL YEAR */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 mb-4 pb-2 border-b border-slate-100 flex items-center">
                    <span
                      className="w-5 h-5 rounded-full text-white flex items-center justify-center mr-2 text-[10px]"
                      style={{ backgroundColor: branding.primaryColor }}
                    >
                      1
                    </span>
                    Taxpayer Profile & Fiscal Rules
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Financial Year
                      </label>
                      <select
                        value={profile.fy}
                        onChange={(e) => setProfile({ ...profile, fy: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-hidden focus:border-[#1dbf73] cursor-pointer font-medium"
                      >
                        <option value="2026-27">FY 2026-27 (AY 2027-28)</option>
                        <option value="2025-26">FY 2025-26 (AY 2026-27)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Age Group (Old Regime)
                      </label>
                      <select
                        value={profile.age}
                        onChange={(e) =>
                          setProfile({ ...profile, age: parseInt(e.target.value, 10) })
                        }
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-hidden focus:border-[#1dbf73] cursor-pointer font-medium"
                      >
                        <option value={45}>Below 60 Years</option>
                        <option value={65}>60 - 80 Years (Senior)</option>
                        <option value={85}>Above 80 Years (Super Senior)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Employment Type
                      </label>
                      <select
                        value={profile.employment}
                        onChange={(e) => setProfile({ ...profile, employment: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-hidden focus:border-[#1dbf73] cursor-pointer font-medium"
                      >
                        <option value="salaried">Salaried (Eligible for Std Ded)</option>
                        <option value="self">Self-Employed / Business</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* MODULE 2: SALARY & INCOME */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 mb-4 pb-2 border-b border-slate-100 flex items-center">
                    <span
                      className="w-5 h-5 rounded-full text-white flex items-center justify-center mr-2 text-[10px]"
                      style={{ backgroundColor: branding.primaryColor }}
                    >
                      2
                    </span>
                    Salary & Allowances
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Gross Salary (Basic + DA + HRA)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-2 text-xs text-slate-400 font-bold">
                          ₹
                        </span>
                        <input
                          type="number"
                          value={salary.gross}
                          onChange={(e) =>
                            setSalary({ ...salary, gross: parseFloat(e.target.value) || 0 })
                          }
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-7 pr-3 py-2 text-xs focus:outline-hidden focus:border-[#1dbf73] font-bold text-slate-800"
                          placeholder="1800000"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Professional Tax Paid
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-2 text-xs text-slate-400 font-bold">
                          ₹
                        </span>
                        <input
                          type="number"
                          value={salary.profTax}
                          onChange={(e) =>
                            setSalary({ ...salary, profTax: parseFloat(e.target.value) || 0 })
                          }
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-7 pr-3 py-2 text-xs focus:outline-hidden focus:border-[#1dbf73] font-medium"
                          placeholder="2500"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* MODULE 3: HOUSE PROPERTY */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 mb-4 pb-2 border-b border-slate-100 flex items-center">
                    <span
                      className="w-5 h-5 rounded-full text-white flex items-center justify-center mr-2 text-[10px]"
                      style={{ backgroundColor: branding.primaryColor }}
                    >
                      3
                    </span>
                    House Property & Home Loan Interest (Sec 24b)
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Property Type
                      </label>
                      <select
                        value={houseProperty.type}
                        onChange={(e) => setHouseProperty({ ...houseProperty, type: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-hidden focus:border-[#1dbf73] cursor-pointer font-medium"
                      >
                        <option value="self">Self-Occupied (Max 2L deduction in Old)</option>
                        <option value="letout">Let-Out Property</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Home Loan Interest Paid
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-2 text-xs text-slate-400 font-bold">
                          ₹
                        </span>
                        <input
                          type="number"
                          value={houseProperty.interest}
                          onChange={(e) =>
                            setHouseProperty({
                              ...houseProperty,
                              interest: parseFloat(e.target.value) || 0,
                            })
                          }
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-7 pr-3 py-2 text-xs focus:outline-hidden focus:border-[#1dbf73] font-medium"
                          placeholder="200000"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* MODULE 4 & 5: CAPITAL GAINS & OTHER SOURCES */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 mb-3 pb-2 border-b border-slate-100 flex items-center">
                      <span
                        className="w-4 h-4 rounded-full text-white flex items-center justify-center mr-2 text-[9px]"
                        style={{ backgroundColor: branding.primaryColor }}
                      >
                        4
                      </span>
                      Capital Gains
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          STCG (Equity Sec 111A)
                        </label>
                        <input
                          type="number"
                          value={capitalGains.stcg}
                          onChange={(e) =>
                            setCapitalGains({
                              ...capitalGains,
                              stcg: parseFloat(e.target.value) || 0,
                            })
                          }
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs focus:outline-hidden focus:border-[#1dbf73]"
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          LTCG (Equity Sec 112A)
                        </label>
                        <input
                          type="number"
                          value={capitalGains.ltcg}
                          onChange={(e) =>
                            setCapitalGains({
                              ...capitalGains,
                              ltcg: parseFloat(e.target.value) || 0,
                            })
                          }
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs focus:outline-hidden focus:border-[#1dbf73]"
                          placeholder="0"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 mb-3 pb-2 border-b border-slate-100 flex items-center">
                      <span
                        className="w-4 h-4 rounded-full text-white flex items-center justify-center mr-2 text-[9px]"
                        style={{ backgroundColor: branding.primaryColor }}
                      >
                        5
                      </span>
                      Other Sources
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          Savings & FD Interest
                        </label>
                        <input
                          type="number"
                          value={otherSources.interest}
                          onChange={(e) =>
                            setOtherSources({
                              ...otherSources,
                              interest: parseFloat(e.target.value) || 0,
                            })
                          }
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs focus:outline-hidden focus:border-[#1dbf73]"
                          placeholder="30000"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          Other Income (Freelance/Rent)
                        </label>
                        <input
                          type="number"
                          value={otherSources.other}
                          onChange={(e) =>
                            setOtherSources({
                              ...otherSources,
                              other: parseFloat(e.target.value) || 0,
                            })
                          }
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs focus:outline-hidden focus:border-[#1dbf73]"
                          placeholder="0"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* MODULE 6: DEDUCTIONS (OLD REGIME ONLY) */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 mb-4 pb-2 border-b border-slate-100 flex items-center">
                    <span
                      className="w-5 h-5 rounded-full text-white flex items-center justify-center mr-2 text-[10px]"
                      style={{ backgroundColor: branding.primaryColor }}
                    >
                      6
                    </span>
                    Chapter VI-A Deductions{' '}
                    <span className="text-amber-600 font-bold ml-1.5 text-[10px]">
                      (Old Regime Only)
                    </span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Sec 80C (PPF/ELSS/EPF)
                      </label>
                      <input
                        type="number"
                        value={deductions.sec80C}
                        onChange={(e) =>
                          setDeductions({
                            ...deductions,
                            sec80C: parseFloat(e.target.value) || 0,
                          })
                        }
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-hidden focus:border-[#1dbf73]"
                        placeholder="150000"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Sec 80D (Health Insurance)
                      </label>
                      <input
                        type="number"
                        value={deductions.sec80D}
                        onChange={(e) =>
                          setDeductions({
                            ...deductions,
                            sec80D: parseFloat(e.target.value) || 0,
                          })
                        }
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-hidden focus:border-[#1dbf73]"
                        placeholder="25000"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Sec 80CCD(1B) (NPS Tier 1)
                      </label>
                      <input
                        type="number"
                        value={deductions.sec80CCD}
                        onChange={(e) =>
                          setDeductions({
                            ...deductions,
                            sec80CCD: parseFloat(e.target.value) || 0,
                          })
                        }
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-hidden focus:border-[#1dbf73]"
                        placeholder="50000"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT OUTPUT COLUMN: SIDE-BY-SIDE MATRIX & SUMMARY */}
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xl sticky top-20">
                  <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
                    <div>
                      <span
                        className="text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider text-white"
                        style={{ backgroundColor: branding.primaryColor }}
                      >
                        Regime Comparison
                      </span>
                      <h3 className="text-base font-bold text-slate-900 mt-1">
                        Tax Audit Summary
                      </h3>
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] text-slate-400 block font-medium">
                        Recommended
                      </span>
                      <span className="text-xs font-black px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 inline-block mt-0.5 uppercase">
                        {comparison.recommended}
                      </span>
                    </div>
                  </div>

                  {/* COMPARISON TABLE */}
                  <div className="space-y-3 mb-6">
                    <div className="grid grid-cols-3 text-xs font-bold text-slate-400 pb-2 border-b border-slate-100">
                      <span>Metric</span>
                      <span className="text-right text-slate-700">Old Regime</span>
                      <span className="text-right text-[#1dbf73]">New Regime</span>
                    </div>
                    <div className="grid grid-cols-3 text-xs items-center py-1.5 border-b border-slate-100">
                      <span className="text-slate-500 font-medium">Gross Income</span>
                      <span className="text-right font-semibold text-slate-800">
                        ₹{results.old.gross.toLocaleString()}
                      </span>
                      <span className="text-right font-semibold text-slate-800">
                        ₹{results.new.gross.toLocaleString()}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 text-xs items-center py-1.5 border-b border-slate-100">
                      <span className="text-slate-500 font-medium">Standard Ded.</span>
                      <span className="text-right font-semibold text-emerald-600">
                        -₹{results.old.stdDed.toLocaleString()}
                      </span>
                      <span className="text-right font-semibold text-emerald-600">
                        -₹{results.new.stdDed.toLocaleString()}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 text-xs items-center py-1.5 border-b border-slate-100">
                      <span className="text-slate-500 font-medium">Total Deductions</span>
                      <span className="text-right font-semibold text-emerald-600">
                        -₹{results.old.deductions.toLocaleString()}
                      </span>
                      <span className="text-right font-semibold text-emerald-600">
                        -₹{results.new.deductions.toLocaleString()}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 text-xs items-center py-1.5 border-b border-slate-100">
                      <span className="text-slate-500 font-medium">Taxable Income</span>
                      <span className="text-right font-bold text-slate-900">
                        ₹{results.old.taxable.toLocaleString()}
                      </span>
                      <span className="text-right font-bold text-slate-900">
                        ₹{results.new.taxable.toLocaleString()}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 text-xs items-center py-2 bg-slate-50 px-2.5 rounded-xl border border-slate-200">
                      <span className="font-bold text-slate-800">Net Tax Payable</span>
                      <span className="text-right font-black text-amber-600 text-sm">
                        ₹{results.old.netTax.toLocaleString()}
                      </span>
                      <span className="text-right font-black text-[#1dbf73] text-sm">
                        ₹{results.new.netTax.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* SAVINGS CARD */}
                  <div
                    className="border rounded-2xl p-4 mb-6 flex items-center justify-between"
                    style={{
                      backgroundColor: `${branding.primaryColor}10`,
                      borderColor: `${branding.primaryColor}30`,
                    }}
                  >
                    <div>
                      <span
                        className="text-xs font-semibold block"
                        style={{ color: branding.primaryColor }}
                      >
                        Maximum Savings
                      </span>
                      <span className="text-2xl font-black text-slate-900">
                        ₹{comparison.savings.toLocaleString()}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block font-mono">
                        4% Cess Included
                      </span>
                      <span className="text-xs font-bold text-emerald-600">Active Audit</span>
                    </div>
                  </div>

                  {/* ACTION BUTTONS */}
                  <div className="space-y-2.5">
                    <button
                      type="button"
                      onClick={handlePrint}
                      className="w-full text-white text-xs font-bold py-3 px-4 rounded-xl transition-all shadow-md flex items-center justify-center cursor-pointer"
                      style={{ backgroundColor: branding.primaryColor }}
                    >
                      <Printer className="w-4 h-4 mr-2" />
                      <span>Print / Export Tax Summary</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleExportJSON}
                      className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold py-3 px-4 rounded-xl transition-all border border-slate-200 flex items-center justify-center cursor-pointer"
                    >
                      <FileDown className="w-4 h-4 mr-2" />
                      <span>Download Audit JSON</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* DYNAMIC CONTENT SECTIONS (Articles & Content Added in Content & SEO Manager) */}
            {activeContentSections.length > 0 && (
              <div className="space-y-6 pt-4 border-t border-[#e4e5e7]">
                <h2 className="text-base font-extrabold text-[#222325] flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-[#1dbf73]" />
                  <span>Comprehensive Guides & Articles</span>
                </h2>

                {activeContentSections.map((section: ContentSection, idx: number) => (
                  <article
                    key={section.id || idx}
                    className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-[#f4fdf8] text-[#1dbf73] flex items-center justify-center border border-[#d8f5e5] shrink-0">
                          <BookOpen className="w-4 h-4" />
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-base sm:text-lg font-bold text-[#222325]">
                            {section.title}
                          </h3>
                          {section.sectionType && (
                            <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase font-mono tracking-wider bg-[#fafafa] border border-[#e4e5e7] text-[#74767e] rounded">
                              {section.sectionType}
                            </span>
                          )}
                        </div>
                      </div>

                      {calculator?.id && (
                        <a
                          href={`/admin/content-seo?calculatorId=${calculator.id}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#fafafa] hover:bg-[#e4e5e7] text-[#404145] hover:text-[#222325] text-xs font-bold rounded-lg border border-[#e4e5e7] transition-colors cursor-pointer self-start sm:self-center"
                          title="Edit section in Rich-Text & SEO Manager"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-[#1dbf73]" />
                          <span>Edit Article</span>
                        </a>
                      )}
                    </div>

                    <div
                      className="text-xs sm:text-sm text-[#404145] leading-relaxed prose prose-slate max-w-none font-sans whitespace-pre-line space-y-3"
                      dangerouslySetInnerHTML={{ __html: formatContentHtml(section.htmlContent) }}
                    />
                  </article>
                ))}
              </div>
            )}

            {/* HOW-TO GUIDE SECTION */}
            {isHowToEnabled && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-4">
                {howToTitle && howToTitle.trim().length > 0 && (
                  <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
                    <div className="w-8 h-8 rounded-lg bg-[#f4fdf8] text-[#1dbf73] flex items-center justify-center border border-[#d8f5e5] shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-[#222325]">
                      {howToTitle}
                    </h3>
                  </div>
                )}
                <div
                  className="text-xs sm:text-sm text-[#404145] leading-relaxed prose prose-slate max-w-none whitespace-pre-line space-y-3"
                  dangerouslySetInnerHTML={{ __html: formatContentHtml(usageInstructions) }}
                />
              </div>
            )}

            {/* WORKED EXAMPLES SECTION */}
            {isExamplesEnabled && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-6">
                {examplesTitle && examplesTitle.trim().length > 0 && (
                  <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
                    <div className="w-8 h-8 rounded-lg bg-[#f4fdf8] text-[#1dbf73] flex items-center justify-center border border-[#d8f5e5] shrink-0">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-[#222325]">
                      {examplesTitle}
                    </h3>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {examplesList.map((ex, idx) => (
                    <div
                      key={ex.id || idx}
                      className="p-4 bg-[#fafafa] rounded-xl border border-slate-200 space-y-2"
                    >
                      <h4 className="text-xs font-bold text-[#222325]">{ex.title}</h4>
                      <p className="text-xs text-[#62646a] leading-relaxed">{ex.description}</p>
                      {ex.resultSummary && (
                        <div className="pt-2 border-t border-slate-200 text-xs font-mono font-bold text-[#1dbf73]">
                          Result: {ex.resultSummary}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* FAQS ACCORDION SECTION */}
            {isFaqsEnabled && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-4">
                {faqsTitle && faqsTitle.trim().length > 0 && (
                  <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
                    <div className="w-8 h-8 rounded-lg bg-[#f4fdf8] text-[#1dbf73] flex items-center justify-center border border-[#d8f5e5] shrink-0">
                      <HelpCircle className="w-4 h-4" />
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-[#222325]">
                      {faqsTitle}
                    </h3>
                  </div>
                )}

                <div className="space-y-3">
                  {faqsList.map((faq: any, idx: number) => (
                    <details
                      key={faq.id || idx}
                      open
                      className="group border border-slate-200 rounded-xl overflow-hidden bg-[#fafafa]"
                    >
                      <summary className="p-4 font-bold text-xs sm:text-sm text-[#222325] flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-100 transition-colors list-none">
                        <span>{faq.question}</span>
                        <ChevronDown className="w-4 h-4 text-slate-500 group-open:rotate-180 group-open:text-[#1dbf73] transition-transform" />
                      </summary>
                      <div
                        className="p-4 pt-3 text-xs sm:text-sm text-[#404145] leading-relaxed border-t border-slate-100 bg-white prose prose-slate max-w-none space-y-2"
                        dangerouslySetInnerHTML={{
                          __html: faq.answer && faq.answer.startsWith('<') ? faq.answer : `<p>${faq.answer}</p>`,
                        }}
                      />
                    </details>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* WHITE-LABEL STUDIO TAB */
          <div className="space-y-6 max-w-2xl mx-auto">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
              <h2 className="text-base font-bold text-slate-900 mb-1 flex items-center">
                <Palette className="w-5 h-5 text-[#1dbf73] mr-2.5" />
                <span>White-Label Brand Studio</span>
              </h2>
              <p className="text-xs text-slate-500 mb-6">
                Customize the brand name, footer text, and primary accent color instantly to match
                your advisory firm.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Firm / Brand Name
                  </label>
                  <input
                    type="text"
                    value={branding.brandName}
                    onChange={(e) => setBranding({ ...branding, brandName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-hidden focus:border-[#1dbf73]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Subtitle / Footer Attribution
                  </label>
                  <input
                    type="text"
                    value={branding.footerText}
                    onChange={(e) => setBranding({ ...branding, footerText: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-hidden focus:border-[#1dbf73]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Primary Brand Accent Color
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      value={branding.primaryColor}
                      onChange={(e) => setBranding({ ...branding, primaryColor: e.target.value })}
                      className="w-12 h-10 rounded-lg cursor-pointer border border-slate-200 bg-transparent"
                    />
                    <input
                      type="text"
                      value={branding.primaryColor}
                      onChange={(e) => setBranding({ ...branding, primaryColor: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono focus:outline-hidden"
                    />
                  </div>
                </div>
                <div className="pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentTab('calculator');
                    }}
                    className="w-full text-white text-xs font-bold py-3 rounded-xl shadow-md transition-all cursor-pointer"
                    style={{ backgroundColor: branding.primaryColor }}
                  >
                    Save & Preview Theme
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {calculator && (
        <EmbedModal
          calculator={calculator}
          isOpen={isEmbedModalOpen}
          onClose={() => setIsEmbedModalOpen(false)}
        />
      )}
    </div>
  );
};
