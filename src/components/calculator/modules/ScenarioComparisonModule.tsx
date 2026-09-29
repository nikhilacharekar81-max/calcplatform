import React, { useState } from 'react';
import { GitCompare, ArrowRight, Check, Award, Sparkles, TrendingDown } from 'lucide-react';

interface ScenarioComparisonModuleProps {
  outputs: Array<{
    def: { id: string; label: string };
    formatted: string;
    raw: number | string | boolean;
  }>;
  settings?: {
    title?: string;
  };
}

export const ScenarioComparisonModule: React.FC<ScenarioComparisonModuleProps> = ({
  outputs = [],
  settings = {},
}) => {
  const [activeScenario, setActiveScenario] = useState<'conservative' | 'baseline' | 'aggressive'>('baseline');
  const title = settings.title || 'Old vs New Tax Regime Scenario Comparison';

  // Helper map to find output values by ID
  const outputMap = new Map(outputs.map((o) => [o.def.id, o]));

  const grossNew = Number(outputMap.get('grossTotalIncomeNew')?.raw || 0);
  const grossOld = Number(outputMap.get('grossTotalIncomeOld')?.raw || 0);
  const dedOld = Number(outputMap.get('totalDeductionsOld')?.raw || 0);
  const taxableNew = Number(outputMap.get('taxableIncomeNew')?.raw || 0);
  const taxableOld = Number(outputMap.get('taxableIncomeOld')?.raw || 0);
  const taxNew = Number(outputMap.get('totalTaxLiabilityNew')?.raw || 0);
  const taxOld = Number(outputMap.get('totalTaxLiabilityOld')?.raw || 0);
  const payableNew = Number(outputMap.get('netTaxPayableNew')?.raw || 0);
  const payableOld = Number(outputMap.get('netTaxPayableOld')?.raw || 0);

  const isTaxComparisonAvailable = outputMap.has('totalTaxLiabilityNew') || outputMap.has('netTaxPayableNew');

  // Calculate regime recommendation
  const diff = Math.abs(payableOld - payableNew);
  const recommendedRegime = payableNew < payableOld ? 'New Regime' : payableOld < payableNew ? 'Old Regime' : 'Both Equal';

  const primaryOut = outputs.find((o) => typeof o.raw === 'number') || outputs[0];
  const baseNum = typeof primaryOut?.raw === 'number' ? primaryOut.raw : 10000;

  return (
    <div className="bg-white rounded-xl border border-[#e4e5e7] p-6 sm:p-7 shadow-2xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#f0f0f0] pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#f4fdf8] text-[#1dbf73] flex items-center justify-center border border-[#d8f5e5]">
            <GitCompare className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#222325]">{title}</h2>
            <p className="text-xs text-[#74767e]">Side-by-Side Direct Tax Comparison Matrix</p>
          </div>
        </div>

        {isTaxComparisonAvailable && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#f4fdf8] border border-[#d8f5e5] rounded-xl text-xs font-bold text-[#013a12] self-start sm:self-auto">
            <Sparkles className="w-4 h-4 text-[#1dbf73]" />
            <span>Recommended: <strong className="text-[#1dbf73] uppercase">{recommendedRegime}</strong></span>
            {diff > 0 && <span>(Save ₹{Math.round(diff).toLocaleString()})</span>}
          </div>
        )}
      </div>

      {isTaxComparisonAvailable ? (
        <div className="space-y-6">
          {/* Highlight Savings Banner */}
          <div className="p-4 bg-gradient-to-r from-[#f4fdf8] to-[#e8faef] rounded-xl border border-[#d8f5e5] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#1dbf73] text-white flex items-center justify-center shrink-0 shadow-2xs">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-extrabold text-[#222325] block">
                  Optimized Tax Strategy: {recommendedRegime}
                </span>
                <p className="text-xs text-[#62646a] mt-0.5">
                  {recommendedRegime === 'New Regime'
                    ? 'The New Tax Regime yields lower net tax liability thanks to standard deduction & Section 87A rebate.'
                    : recommendedRegime === 'Old Regime'
                    ? 'The Old Tax Regime yields lower net tax liability due to your Chapter VI-A deductions & home loan interest.'
                    : 'Both regimes yield identical net tax payable for your input parameters.'}
                </p>
              </div>
            </div>

            {diff > 0 && (
              <div className="text-right shrink-0">
                <span className="text-[10px] uppercase tracking-wider text-[#74767e] font-bold block">Annual Tax Savings</span>
                <span className="text-xl font-mono font-black text-[#1dbf73]">₹{Math.round(diff).toLocaleString()}</span>
              </div>
            )}
          </div>

          {/* Side-by-Side Comparison Matrix Table */}
          <div className="overflow-x-auto rounded-xl border border-[#e4e5e7]">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#fafafa] border-b border-[#e4e5e7] text-[#404145] font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Financial Metric</th>
                  <th className="py-3.5 px-4 text-right">Old Tax Regime</th>
                  <th className="py-3.5 px-4 text-right text-[#1dbf73]">New Tax Regime</th>
                  <th className="py-3.5 px-4 text-right">Regime Impact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0f0f0] bg-white">
                <tr className="hover:bg-[#fafafa]">
                  <td className="py-3 px-4 font-semibold text-[#222325]">Gross Total Income</td>
                  <td className="py-3 px-4 text-right font-mono font-medium text-[#404145]">₹{grossOld.toLocaleString()}</td>
                  <td className="py-3 px-4 text-right font-mono font-medium text-[#404145]">₹{grossNew.toLocaleString()}</td>
                  <td className="py-3 px-4 text-right text-[11px] text-[#74767e]">
                    {grossNew < grossOld ? 'New has ₹75k Std Ded' : 'Standard'}
                  </td>
                </tr>

                <tr className="hover:bg-[#fafafa]">
                  <td className="py-3 px-4 font-semibold text-[#222325]">Chapter VI-A Deductions</td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-emerald-600">-₹{dedOld.toLocaleString()}</td>
                  <td className="py-3 px-4 text-right font-mono text-[#74767e]">₹0 (N/A)</td>
                  <td className="py-3 px-4 text-right text-[11px] text-[#74767e]">Old allows Sec 80C/80D</td>
                </tr>

                <tr className="hover:bg-[#fafafa] bg-[#fafafa]/50">
                  <td className="py-3 px-4 font-bold text-[#222325]">Net Taxable Income</td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-[#222325]">₹{taxableOld.toLocaleString()}</td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-[#222325]">₹{taxableNew.toLocaleString()}</td>
                  <td className="py-3 px-4 text-right text-[11px] text-[#74767e]">Taxable Base</td>
                </tr>

                <tr className="hover:bg-[#fafafa]">
                  <td className="py-3 px-4 font-semibold text-[#222325]">Gross Slab Tax Liability</td>
                  <td className="py-3 px-4 text-right font-mono text-[#404145]">₹{Math.round(taxOld).toLocaleString()}</td>
                  <td className="py-3 px-4 text-right font-mono text-[#404145]">₹{Math.round(taxNew).toLocaleString()}</td>
                  <td className="py-3 px-4 text-right text-[11px] text-[#74767e]">Before Cess/Credits</td>
                </tr>

                <tr className="hover:bg-[#f4fdf8] bg-[#f4fdf8]/30">
                  <td className="py-3.5 px-4 font-black text-[#222325] text-sm">Net Tax Payable</td>
                  <td className={`py-3.5 px-4 text-right font-mono font-black text-sm ${payableOld < payableNew ? 'text-[#1dbf73]' : 'text-[#222325]'}`}>
                    ₹{Math.round(payableOld).toLocaleString()}
                  </td>
                  <td className={`py-3.5 px-4 text-right font-mono font-black text-sm ${payableNew <= payableOld ? 'text-[#1dbf73]' : 'text-[#222325]'}`}>
                    ₹{Math.round(payableNew).toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-[#1dbf73] text-white">
                      {recommendedRegime}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Fallback Sensitivity Cards for Non-Tax Calculators */
        <div className="space-y-4">
          <div className="flex justify-end">
            <div className="bg-[#f0f0f0] p-0.5 rounded-lg flex text-xs font-semibold">
              {(['conservative', 'baseline', 'aggressive'] as const).map((sc) => (
                <button
                  key={sc}
                  type="button"
                  onClick={() => setActiveScenario(sc)}
                  className={`px-3 py-1.5 rounded-md capitalize transition-all cursor-pointer ${
                    activeScenario === sc ? 'bg-white text-[#222325] shadow-2xs font-bold' : 'text-[#74767e]'
                  }`}
                >
                  {sc}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className={`p-4 rounded-xl border transition-all ${activeScenario === 'conservative' ? 'border-[#1dbf73] bg-[#f4fdf8] ring-1 ring-[#1dbf73]' : 'border-[#e4e5e7] bg-[#fafafa]'}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#222325]">Conservative</span>
                <span className="text-[10px] font-mono text-[#74767e]">-15% variance</span>
              </div>
              <div className="text-lg font-mono font-bold text-[#222325]">
                {(baseNum * 0.85).toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </div>
              <p className="text-[11px] text-[#74767e] mt-2">Accounts for conservative market growth assumptions.</p>
            </div>

            <div className={`p-4 rounded-xl border transition-all ${activeScenario === 'baseline' ? 'border-[#1dbf73] bg-[#f4fdf8] ring-1 ring-[#1dbf73]' : 'border-[#e4e5e7] bg-[#fafafa]'}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#222325]">Baseline (Current)</span>
                <span className="text-[10px] font-mono text-[#1dbf73] font-bold">Standard</span>
              </div>
              <div className="text-lg font-mono font-bold text-[#1dbf73]">
                {primaryOut?.formatted || baseNum.toLocaleString()}
              </div>
              <p className="text-[11px] text-[#74767e] mt-2">Calculated directly from active input parameters.</p>
            </div>

            <div className={`p-4 rounded-xl border transition-all ${activeScenario === 'aggressive' ? 'border-[#1dbf73] bg-[#f4fdf8] ring-1 ring-[#1dbf73]' : 'border-[#e4e5e7] bg-[#fafafa]'}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#222325]">Optimistic</span>
                <span className="text-[10px] font-mono text-[#74767e]">+20% variance</span>
              </div>
              <div className="text-lg font-mono font-bold text-[#222325]">
                {(baseNum * 1.20).toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </div>
              <p className="text-[11px] text-[#74767e] mt-2">Optimistic yield projection with accelerated growth.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
