import React, { useState, useEffect } from 'react';
import { calculateIndiaIncomeTax, IndiaIncomeTaxResult } from '../../calculators/india/incomeTax.ts';
import { InputField } from '../common/InputField.tsx';
import { ResultCard } from '../common/ResultCard.tsx';
import { TaxComparisonChart } from './india/income-tax/TaxComparisonChart.tsx';

export const TaxRegimeCalculator: React.FC = () => {
  const [grossIncome, setGrossIncome] = useState('1500000');
  const [deductions, setDeductions] = useState('150000');
  const [taxResult, setTaxResult] = useState<{
    newRegime: IndiaIncomeTaxResult | null;
    oldRegime: IndiaIncomeTaxResult | null;
  }>({ newRegime: null, oldRegime: null });

  useEffect(() => {
    try {
      const income = Math.max(0, parseFloat(grossIncome) || 0);
      const ded = Math.max(0, parseFloat(deductions) || 0);

      // Execute via India Tax Calculation Service and Rule Registry
      const newResult = calculateIndiaIncomeTax({
        grossIncome: income,
        salaryIncome: income,
        regime: 'NEW',
        age: 30,
        resident: true,
      });

      const oldResult = calculateIndiaIncomeTax({
        grossIncome: income,
        salaryIncome: income,
        additionalDeductions: ded,
        regime: 'OLD',
        age: 30,
        resident: true,
      });

      setTaxResult({
        newRegime: newResult,
        oldRegime: oldResult,
      });
    } catch (e) {
      console.warn('Tax calculation error:', e);
    }
  }, [grossIncome, deductions]);

  const newTax = taxResult.newRegime?.totalTaxFormatted ?? '₹0';
  const oldTax = taxResult.oldRegime?.totalTaxFormatted ?? '₹0';
  const taxDiff = (taxResult.oldRegime?.totalTax ?? 0) - (taxResult.newRegime?.totalTax ?? 0);
  const recommendation = taxDiff > 0
    ? `New Regime saves you ₹${Math.abs(taxDiff).toLocaleString('en-IN')}`
    : taxDiff < 0
      ? `Old Regime saves you ₹${Math.abs(taxDiff).toLocaleString('en-IN')}`
      : 'Both regimes yield equal tax';

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <h2 className="text-xl font-black text-[#222325]">Income Tax Regime Comparison (AY 2026-27)</h2>
        <span className="text-xs font-semibold px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200 self-start sm:self-auto">
          India Rule Registry • Active Verified
        </span>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField label="Gross Annual Income" value={grossIncome} onChange={(e) => setGrossIncome(e.target.value)} unit="₹" />
        <InputField label="Total Deductions (80C, 80D, HRA)" value={deductions} onChange={(e) => setDeductions(e.target.value)} unit="₹" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
        <ResultCard
          label="New Tax Regime (Std Ded ₹75k)"
          value={newTax}
          highlight={taxDiff >= 0}
        />
        <ResultCard
          label="Old Tax Regime (Std Ded ₹50k)"
          value={oldTax}
          highlight={taxDiff < 0}
        />
      </div>

      <TaxComparisonChart
        oldTax={taxResult.oldRegime?.totalTax ?? 0}
        newTax={taxResult.newRegime?.totalTax ?? 0}
      />

      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-sm text-slate-700 flex items-center justify-between">
        <span className="font-semibold text-slate-900">Recommendation:</span>
        <span className="font-bold text-indigo-600">{recommendation}</span>
      </div>
    </div>
  );
};
