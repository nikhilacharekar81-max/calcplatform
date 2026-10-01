import React, { useState, useEffect } from 'react';
import { Decimal } from '../../utils/calculatorEngine.ts';
import { InputField } from '../common/InputField.tsx';
import { ResultCard } from '../common/ResultCard.tsx';

export const LoanEmiCalculator: React.FC = () => {
  const [principal, setPrincipal] = useState('5000000');
  const [rate, setRate] = useState('8.5');
  const [years, setYears] = useState('20');
  const [results, setResults] = useState({ emi: '0', totalInterest: '0', totalPayment: '0' });

  useEffect(() => {
    const calculate = () => {
      try {
        const P = new Decimal(principal || 0);
        const annualRate = new Decimal(rate || 0);
        const tenureYears = new Decimal(years || 0);

        if (P.isZero() || annualRate.isZero() || tenureYears.isZero()) {
          setResults({ emi: '0', totalInterest: '0', totalPayment: '0' });
          return;
        }

        const r = annualRate.dividedBy(12).dividedBy(100);
        const n = tenureYears.times(12);

        // EMI = P * r * (1+r)^n / ((1+r)^n - 1)
        const onePlusRpowN = new Decimal(1).plus(r).pow(n);
        const emi = P.times(r).times(onePlusRpowN).dividedBy(onePlusRpowN.minus(1));

        const totalPayment = emi.times(n);
        const totalInterest = totalPayment.minus(P);

        setResults({
          emi: emi.toFixed(2),
          totalInterest: totalInterest.toFixed(2),
          totalPayment: totalPayment.toFixed(2),
        });
      } catch (e) {
        // Handle invalid inputs
      }
    };
    calculate();
  }, [principal, rate, years]);

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
      <h2 className="text-xl font-black text-[#222325]">Loan EMI Calculator</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <InputField label="Principal Amount" value={principal} onChange={(e) => setPrincipal(e.target.value)} unit="₹" />
        <InputField label="Interest Rate" value={rate} onChange={(e) => setRate(e.target.value)} unit="%" />
        <InputField label="Tenure" value={years} onChange={(e) => setYears(e.target.value)} unit="Yrs" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
        <ResultCard label="Monthly EMI" value={`₹${results.emi}`} highlight />
        <ResultCard label="Total Interest" value={`₹${results.totalInterest}`} />
        <ResultCard label="Total Payment" value={`₹${results.totalPayment}`} />
      </div>
    </div>
  );
};
