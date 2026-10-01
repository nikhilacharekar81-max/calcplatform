import React, { useState, useEffect } from 'react';
import { Decimal } from '../../utils/calculatorEngine.ts';
import { InputField } from '../common/InputField.tsx';
import { ResultCard } from '../common/ResultCard.tsx';

// FY 2025-26 Slab structure (Simplified for demonstration)
const NEW_REGIME_SLABS = [
  { limit: 300000, rate: 0 },
  { limit: 700000, rate: 0.05 },
  { limit: 1000000, rate: 0.10 },
  { limit: 1200000, rate: 0.15 },
  { limit: 1500000, rate: 0.20 },
  { limit: Infinity, rate: 0.30 },
];

export const TaxRegimeCalculator: React.FC = () => {
  const [grossIncome, setGrossIncome] = useState('1500000');
  const [deductions, setDeductions] = useState('150000');
  const [tax, setTax] = useState({ old: '0', new: '0' });

  useEffect(() => {
    const calculateTax = () => {
      const income = new Decimal(grossIncome || 0);
      const ded = new Decimal(deductions || 0);
      
      // Simplified New Regime Calculation
      let taxableNew = Decimal.max(0, income);
      let taxNew = new Decimal(0);
      let remainingIncome = taxableNew;
      
      for (let i = 0; i < NEW_REGIME_SLABS.length; i++) {
        const slab = NEW_REGIME_SLABS[i];
        const prevLimit = i === 0 ? 0 : NEW_REGIME_SLABS[i-1].limit;
        const slabAmount = Decimal.min(remainingIncome, new Decimal(slab.limit).minus(prevLimit));
        
        if (slabAmount.greaterThan(0)) {
          taxNew = taxNew.plus(slabAmount.times(slab.rate));
          remainingIncome = remainingIncome.minus(slabAmount);
        }
      }

      // Simplified Old Regime (Mock logic)
      const taxableOld = Decimal.max(0, income.minus(ded));
      const taxOld = taxableOld.times(0.2); // Placeholder 20% for old regime demo

      setTax({ 
        new: taxNew.toFixed(0), 
        old: taxOld.toFixed(0) 
      });
    };
    calculateTax();
  }, [grossIncome, deductions]);

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
      <h2 className="text-xl font-black text-[#222325]">Income Tax Regime Comparison</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField label="Gross Annual Income" value={grossIncome} onChange={(e) => setGrossIncome(e.target.value)} unit="₹" />
        <InputField label="Total Deductions (80C, 80D, HRA)" value={deductions} onChange={(e) => setDeductions(e.target.value)} unit="₹" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
        <ResultCard label="New Regime Tax" value={`₹${tax.new}`} />
        <ResultCard label="Old Regime Tax" value={`₹${tax.old}`} highlight />
      </div>
    </div>
  );
};
