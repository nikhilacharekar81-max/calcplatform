import React, { useState, useEffect } from 'react';
import { calculateIndiaEmi, IndiaEmiResult } from '../../calculators/india/emi.ts';
import { generateAmortizationSchedule } from '../../engines/financial-maths/index.ts';
import { formatIndianCurrency } from '../../localization/india/index.ts';
import { InputField } from '../common/InputField.tsx';
import { ResultCard } from '../common/ResultCard.tsx';
import { DonutChartComponent } from '../charts/DonutChartComponent.tsx';

export const LoanEmiCalculator: React.FC = () => {
  const [principal, setPrincipal] = useState('5000000');
  const [rate, setRate] = useState('8.5');
  const [years, setYears] = useState('20');
  const [results, setResults] = useState<{
    emiFormatted: string;
    totalInterestFormatted: string;
    totalPaymentFormatted: string;
    principalValue: number;
    interestValue: number;
  }>({
    emiFormatted: '₹0',
    totalInterestFormatted: '₹0',
    totalPaymentFormatted: '₹0',
    principalValue: 5000000,
    interestValue: 0,
  });

  useEffect(() => {
    try {
      const P = Math.max(0, parseFloat(principal) || 0);
      const annualRate = Math.max(0, parseFloat(rate) || 0);
      const tenureYears = Math.max(0, parseFloat(years) || 0);
      const tenureMonths = Math.round(tenureYears * 12);

      if (P <= 0 || annualRate <= 0 || tenureMonths <= 0) {
        setResults({
          emiFormatted: '₹0',
          totalInterestFormatted: '₹0',
          totalPaymentFormatted: '₹0',
          principalValue: 0,
          interestValue: 0,
        });
        return;
      }

      // Delegate to Universal Maths Engine and India EMI Service
      const emiRes: IndiaEmiResult = calculateIndiaEmi({
        principal: P,
        annualInterestRatePercent: annualRate,
        tenureMonths,
      });

      const schedule = generateAmortizationSchedule({
        principal: P,
        annualRate,
        term: tenureYears,
        termUnit: 'YEARS',
        frequency: 'MONTHLY',
      });

      setResults({
        emiFormatted: emiRes.monthlyEmiFormatted,
        totalInterestFormatted: formatIndianCurrency(schedule.totalInterest),
        totalPaymentFormatted: formatIndianCurrency(schedule.totalPayments),
        principalValue: P,
        interestValue: Math.round(schedule.totalInterest),
      });
    } catch (e) {
      console.warn('Loan calculation error:', e);
    }
  }, [principal, rate, years]);

  const donutData = [
    { name: 'Principal Amount', value: results.principalValue, fill: '#3b82f6' },
    { name: 'Total Interest', value: results.interestValue, fill: '#f59e0b' },
  ];

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <h2 className="text-xl font-black text-[#222325]">Loan EMI Calculator</h2>
        <span className="text-xs font-semibold px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-200 self-start sm:self-auto">
          Global Maths Engine • PMT & Amortization
        </span>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <InputField label="Principal Amount" value={principal} onChange={(e) => setPrincipal(e.target.value)} unit="₹" />
        <InputField label="Interest Rate" value={rate} onChange={(e) => setRate(e.target.value)} unit="%" />
        <InputField label="Tenure" value={years} onChange={(e) => setYears(e.target.value)} unit="Yrs" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
        <ResultCard label="Monthly EMI" value={results.emiFormatted} highlight />
        <ResultCard label="Total Interest" value={results.totalInterestFormatted} />
        <ResultCard label="Total Payment" value={results.totalPaymentFormatted} />
      </div>

      {results.principalValue > 0 && results.interestValue > 0 && (
        <DonutChartComponent
          data={donutData}
          title="Principal vs Total Interest Breakdown"
          parameters={{
            height: 280,
            currencySymbol: '₹',
          }}
        />
      )}
    </div>
  );
};
