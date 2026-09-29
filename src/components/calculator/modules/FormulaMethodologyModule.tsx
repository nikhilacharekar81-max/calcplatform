import React, { useState } from 'react';
import { Code2, ChevronDown, Edit3, Calculator, Table, ShieldCheck, CheckCircle2, HelpCircle } from 'lucide-react';
import { CalculatorOutput, CalculatorField } from '../../../types/schema.ts';

interface FormulaMethodologyModuleProps {
  calculatorId?: string;
  calculatorSlug?: string;
  outputs: CalculatorOutput[];
  fields: CalculatorField[];
  content?: {
    formulaExplanation?: string;
  };
  settings?: {
    title?: string;
    showStepByStep?: boolean;
    customExplanation?: string;
  };
}

export const FormulaMethodologyModule: React.FC<FormulaMethodologyModuleProps> = ({
  calculatorId,
  outputs = [],
  fields = [],
  content,
  settings = {},
}) => {
  const [expanded, setExpanded] = useState(true);
  const [selectedRegimeTab, setSelectedRegimeTab] = useState<'new' | 'old'>('new');
  const title = settings.title !== undefined ? settings.title : 'Slab Computation & Tax Methodology';
  const showSteps = settings.showStepByStep !== false;
  const explanation = settings.customExplanation || content?.formulaExplanation;

  // Detect if this is an Indian Tax Calculator
  const isTaxCalculator = outputs.some(
    (o) => o.formula?.includes('tax_in') || o.id.toLowerCase().includes('tax')
  ) || fields.some((f) => f.id === 'grossSalary' || f.id === 'ageGroup' || f.id === 'sec80C');

  // Humanize raw JS formula strings into readable math notation
  const humanizeFormula = (formula: string, id: string) => {
    if (!formula) return `${id} = f(inputs)`;
    if (formula.includes('tax_in(taxableIncomeNew')) {
      return 'Net Tax Payable (New) = Slab Tax(Net Taxable Income) + 4% Health & Education Cess - Sec 87A Rebate';
    }
    if (formula.includes('tax_in(taxableIncomeOld')) {
      return 'Net Tax Payable (Old) = Slab Tax(Net Taxable Income) + 4% Health & Education Cess - Sec 87A Rebate';
    }
    if (id === 'grossTotalIncomeNew') {
      return 'Gross Income (New) = Max(0, Gross Salary - ₹75,000 Standard Deduction - Professional Tax) + House Property Income + Capital Gains + Other Income';
    }
    if (id === 'grossTotalIncomeOld') {
      return 'Gross Income (Old) = Max(0, Gross Salary - ₹50,000 Standard Deduction - Professional Tax) + House Property Income + Capital Gains + Other Income';
    }
    if (id === 'totalDeductionsOld') {
      return 'Total Chapter VI-A Deductions = Min(₹1,50,000, Sec 80C) + Min(₹50,000, Sec 80D) + Min(₹50,000, Sec 80CCD)';
    }
    if (id === 'taxableIncomeNew') {
      return 'Net Taxable Income (New) = Gross Total Income (New)';
    }
    if (id === 'taxableIncomeOld') {
      return 'Net Taxable Income (Old) = Max(0, Gross Total Income (Old) - Total Deductions)';
    }
    return formula;
  };

  // Humanize help text for input variables
  const getFieldHelpText = (f: CalculatorField) => {
    if (f.helpText && f.helpText.trim().length > 0) return f.helpText;
    switch (f.id) {
      case 'ageGroup':
        return 'Age category determines baseline exemption thresholds under the Old Tax Regime.';
      case 'residentialStatus':
        return 'Tax liability and statutory rebate eligibility differ for Residents vs NRIs.';
      case 'grossSalary':
        return 'Total gross annual salary before standard deduction, PT, or tax exemptions.';
      case 'professionalTax':
        return 'State professional tax paid via payroll deductions (exempt under Sec 16).';
      case 'propertyType':
        return 'Self-occupied allows up to ₹2,00,000 Sec 24b home loan interest deduction.';
      case 'rentalIncome':
        return 'Gross annual rental income received from let-out real estate properties.';
      case 'homeLoanInterest':
        return 'Interest paid on home loan for self-occupied or rented property (Sec 24b).';
      case 'stcg':
        return 'Short Term Capital Gains on equity shares / equity mutual funds (Sec 111A @ 20%).';
      case 'ltcg':
        return 'Long Term Capital Gains on equity shares / mutual funds exceeding ₹1.25L (Sec 112A @ 12.5%).';
      case 'interestIncome':
        return 'Interest earned from savings accounts, fixed deposits (FDs), and recurring deposits.';
      case 'otherIncome':
        return 'Dividends, lottery, interest on bonds, or secondary income sources.';
      case 'sec80C':
        return 'Investments in PPF, ELSS mutual funds, EPF, LIC premium, NSC, etc. (Max ₹1,50,000).';
      case 'sec80D':
        return 'Health insurance premiums paid for self, family, and senior citizen parents.';
      case 'sec80CCD':
        return 'Additional tax-deductible contribution to National Pension System (NPS Tier-1).';
      case 'tds':
        return 'Total Tax Deducted at Source by employer, banks, or deductors.';
      case 'advanceTax':
        return 'Quarterly advance tax installments paid directly to Income Tax Department.';
      default:
        return `Input parameter for ${f.label.toLowerCase()}`;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-[#e4e5e7] p-6 sm:p-7 shadow-2xs space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#f0f0f0] pb-4">
        <div
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2.5 cursor-pointer select-none"
        >
          <div className="w-8 h-8 rounded-lg bg-[#f4fdf8] text-[#1dbf73] flex items-center justify-center border border-[#d8f5e5]">
            <Code2 className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#222325]">{title}</h2>
            <p className="text-xs text-[#74767e]">Statutory Tax Slabs, Formula Equations & Input Variables</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {calculatorId && (
            <a
              href={`/admin/calculators/${calculatorId}`}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#fafafa] hover:bg-[#e4e5e7] text-[#404145] hover:text-[#222325] text-xs font-bold rounded-lg border border-[#e4e5e7] transition-colors cursor-pointer"
              title="Edit mathematical formulas and variable definitions in Admin Builder"
            >
              <Edit3 className="w-3.5 h-3.5 text-[#1dbf73]" />
              <span>Edit Formulas & Logic</span>
            </a>
          )}
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="p-1 text-[#74767e] hover:text-[#222325] cursor-pointer"
          >
            <ChevronDown
              className={`w-4 h-4 transition-transform ${expanded ? 'rotate-180' : ''}`}
            />
          </button>
        </div>
      </div>

      {expanded && (
        <div className="space-y-6 pt-1">
          {/* Custom Narrative Explanation */}
          {explanation && (
            <div className="p-4 bg-[#f8fafc] rounded-xl border border-[#e2e8f0] text-xs sm:text-sm text-[#334155] leading-relaxed prose max-w-none font-sans">
              <div dangerouslySetInnerHTML={{ __html: explanation }} />
            </div>
          )}

          {/* Interactive Tax Slab Matrix (For Income Tax Calculator) */}
          {isTaxCalculator && (
            <div className="p-5 bg-[#fafafa] rounded-xl border border-[#e4e5e7] space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#e4e5e7] pb-3">
                <div className="flex items-center gap-2">
                  <Table className="w-4 h-4 text-[#1dbf73]" />
                  <h3 className="text-xs font-bold text-[#222325] uppercase tracking-wider">
                    Statutory Income Tax Slab Rates (FY 2025-26 & FY 2026-27)
                  </h3>
                </div>

                <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-[#e4e5e7] self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setSelectedRegimeTab('new')}
                    className={`px-3 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                      selectedRegimeTab === 'new'
                        ? 'bg-[#1dbf73] text-white shadow-2xs'
                        : 'text-[#74767e] hover:text-[#222325]'
                    }`}
                  >
                    New Tax Regime
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedRegimeTab('old')}
                    className={`px-3 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                      selectedRegimeTab === 'old'
                        ? 'bg-[#1dbf73] text-white shadow-2xs'
                        : 'text-[#74767e] hover:text-[#222325]'
                    }`}
                  >
                    Old Tax Regime
                  </button>
                </div>
              </div>

              {selectedRegimeTab === 'new' ? (
                <div className="space-y-3">
                  <div className="overflow-x-auto rounded-lg border border-[#e4e5e7]">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#f0f0f0] text-[#404145] font-bold uppercase tracking-wider border-b border-[#e4e5e7]">
                        <tr>
                          <th className="py-2.5 px-3">Income Slab Bracket</th>
                          <th className="py-2.5 px-3">Income Tax Rate</th>
                          <th className="py-2.5 px-3">Statutory Provisions & Benefits</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#e4e5e7] bg-white">
                        <tr className="hover:bg-[#f9fdfa]">
                          <td className="py-2.5 px-3 font-semibold text-[#222325]">Up to ₹4,00,000</td>
                          <td className="py-2.5 px-3 font-bold text-[#1dbf73]">NIL (0%)</td>
                          <td className="py-2.5 px-3 text-[#74767e]">Basic Exemption Limit</td>
                        </tr>
                        <tr className="hover:bg-[#f9fdfa]">
                          <td className="py-2.5 px-3 font-semibold text-[#222325]">₹4,00,001 to ₹8,00,000</td>
                          <td className="py-2.5 px-3 font-bold text-[#222325]">5%</td>
                          <td className="py-2.5 px-3 text-[#74767e]">Sec 87A rebate waives tax up to ₹12L income</td>
                        </tr>
                        <tr className="hover:bg-[#f9fdfa]">
                          <td className="py-2.5 px-3 font-semibold text-[#222325]">₹8,00,001 to ₹12,00,000</td>
                          <td className="py-2.5 px-3 font-bold text-[#222325]">10%</td>
                          <td className="py-2.5 px-3 text-[#74767e]">Covered under Section 87A Full Rebate</td>
                        </tr>
                        <tr className="hover:bg-[#f9fdfa]">
                          <td className="py-2.5 px-3 font-semibold text-[#222325]">₹12,00,001 to ₹16,00,000</td>
                          <td className="py-2.5 px-3 font-bold text-[#222325]">15%</td>
                          <td className="py-2.5 px-3 text-[#74767e]">Standard slab rate above ₹12 Lakhs</td>
                        </tr>
                        <tr className="hover:bg-[#f9fdfa]">
                          <td className="py-2.5 px-3 font-semibold text-[#222325]">₹16,00,001 to ₹20,00,000</td>
                          <td className="py-2.5 px-3 font-bold text-[#222325]">20%</td>
                          <td className="py-2.5 px-3 text-[#74767e]">Moderate tax bracket</td>
                        </tr>
                        <tr className="hover:bg-[#f9fdfa]">
                          <td className="py-2.5 px-3 font-semibold text-[#222325]">₹20,00,001 to ₹24,00,000</td>
                          <td className="py-2.5 px-3 font-bold text-[#222325]">25%</td>
                          <td className="py-2.5 px-3 text-[#74767e]">Higher earning slab rate</td>
                        </tr>
                        <tr className="hover:bg-[#f9fdfa]">
                          <td className="py-2.5 px-3 font-semibold text-[#222325]">Above ₹24,00,000</td>
                          <td className="py-2.5 px-3 font-bold text-rose-600">30%</td>
                          <td className="py-2.5 px-3 text-[#74767e]">Maximum marginal tax rate</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 bg-emerald-50/70 border border-emerald-200 rounded-lg text-emerald-900 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span><strong>Standard Deduction:</strong> Flat ₹75,000 automatically deducted from gross salary.</span>
                    </div>
                    <div className="p-2.5 bg-blue-50/70 border border-blue-200 rounded-lg text-blue-900 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                      <span><strong>Section 87A Rebate:</strong> Full tax rebate for taxable income up to ₹12,00,000 (NIL tax payable).</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="overflow-x-auto rounded-lg border border-[#e4e5e7]">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#f0f0f0] text-[#404145] font-bold uppercase tracking-wider border-b border-[#e4e5e7]">
                        <tr>
                          <th className="py-2.5 px-3">Income Slab Bracket</th>
                          <th className="py-2.5 px-3">General (&lt; 60 Yrs)</th>
                          <th className="py-2.5 px-3">Senior Citizen (60-80 Yrs)</th>
                          <th className="py-2.5 px-3">Super Senior (80+ Yrs)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#e4e5e7] bg-white">
                        <tr className="hover:bg-[#f9fdfa]">
                          <td className="py-2.5 px-3 font-semibold text-[#222325]">Up to ₹2,50,000</td>
                          <td className="py-2.5 px-3 font-bold text-[#1dbf73]">NIL (0%)</td>
                          <td className="py-2.5 px-3 font-bold text-[#1dbf73]">NIL (0%)</td>
                          <td className="py-2.5 px-3 font-bold text-[#1dbf73]">NIL (0%)</td>
                        </tr>
                        <tr className="hover:bg-[#f9fdfa]">
                          <td className="py-2.5 px-3 font-semibold text-[#222325]">₹2,50,001 to ₹3,00,000</td>
                          <td className="py-2.5 px-3 font-bold text-[#222325]">5%</td>
                          <td className="py-2.5 px-3 font-bold text-[#1dbf73]">NIL (0%)</td>
                          <td className="py-2.5 px-3 font-bold text-[#1dbf73]">NIL (0%)</td>
                        </tr>
                        <tr className="hover:bg-[#f9fdfa]">
                          <td className="py-2.5 px-3 font-semibold text-[#222325]">₹3,00,001 to ₹5,00,000</td>
                          <td className="py-2.5 px-3 font-bold text-[#222325]">5%</td>
                          <td className="py-2.5 px-3 font-bold text-[#222325]">5%</td>
                          <td className="py-2.5 px-3 font-bold text-[#1dbf73]">NIL (0%)</td>
                        </tr>
                        <tr className="hover:bg-[#f9fdfa]">
                          <td className="py-2.5 px-3 font-semibold text-[#222325]">₹5,00,001 to ₹10,00,000</td>
                          <td className="py-2.5 px-3 font-bold text-[#222325]">20%</td>
                          <td className="py-2.5 px-3 font-bold text-[#222325]">20%</td>
                          <td className="py-2.5 px-3 font-bold text-[#222325]">20%</td>
                        </tr>
                        <tr className="hover:bg-[#f9fdfa]">
                          <td className="py-2.5 px-3 font-semibold text-[#222325]">Above ₹10,00,000</td>
                          <td className="py-2.5 px-3 font-bold text-rose-600">30%</td>
                          <td className="py-2.5 px-3 font-bold text-rose-600">30%</td>
                          <td className="py-2.5 px-3 font-bold text-rose-600">30%</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 bg-emerald-50/70 border border-emerald-200 rounded-lg text-emerald-900 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span><strong>Standard Deduction:</strong> Flat ₹50,000 allowed for salaried individuals.</span>
                    </div>
                    <div className="p-2.5 bg-blue-50/70 border border-blue-200 rounded-lg text-blue-900 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                      <span><strong>Chapter VI-A Deductions:</strong> Full support for Sec 80C, 80D, 80CCD, & Sec 24b Interest.</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Mathematical Formulations & Formulas List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-[#222325] uppercase tracking-wider">
                Mathematical Formulations & Equations
              </h3>
              <span className="text-[11px] font-mono text-[#74767e]">
                {outputs.length} output {outputs.length === 1 ? 'formula' : 'formulas'}
              </span>
            </div>

            {outputs.length > 0 ? (
              <div className="space-y-3">
                {outputs.map((out) => (
                  <div
                    key={out.id}
                    className="p-4 bg-[#fafafa] rounded-lg border border-[#e4e5e7] space-y-2"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <span className="text-xs font-bold text-[#222325]">{out.label}</span>
                      <span className="text-[10px] font-mono text-[#74767e]">
                        Output ID: <strong className="text-[#222325]">{out.id}</strong>
                      </span>
                    </div>
                    <div className="p-3 bg-white rounded-md border border-[#e4e5e7] text-xs font-mono font-bold text-[#1dbf73] overflow-x-auto shadow-2xs leading-relaxed">
                      {humanizeFormula(out.formula || '', out.id)}
                    </div>
                    {out.description && (
                      <p className="text-[11px] text-[#74767e] leading-relaxed">{out.description}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 bg-[#fafafa] rounded-lg border border-[#e4e5e7] text-xs text-[#74767e]">
                No explicit formulas configured for this calculator yet.
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
};
