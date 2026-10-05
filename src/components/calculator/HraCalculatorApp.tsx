import React, { useState } from 'react';
import {
  Calculator as CalcIcon,
  Home,
  ShieldAlert,
  FileText,
  Download,
  Printer,
  CheckCircle2,
  AlertTriangle,
  Info,
  DollarSign,
  Building,
} from 'lucide-react';

export const HraCalculatorApp: React.FC = () => {
  const [mode, setMode] = useState<'annual' | 'monthly'>('annual');
  const [basic, setBasic] = useState<number>(600000); // Annual Basic
  const [da, setDa] = useState<number>(0);         // Annual DA
  const [hraReceived, setHraReceived] = useState<number>(240000); // Annual HRA Received
  const [rentPaid, setRentPaid] = useState<number>(300000);       // Annual Rent Paid
  const [isMetro, setIsMetro] = useState<boolean>(true);          // Metro vs Non-Metro

  // Convert inputs to annual basis for calculation
  const multiplier = mode === 'monthly' ? 12 : 1;
  const annualBasic = basic * multiplier;
  const annualDa = da * multiplier;
  const annualHra = hraReceived * multiplier;
  const annualRent = rentPaid * multiplier;

  // Calculation Logic (Section 10(13A))
  const salaryForHra = annualBasic + annualDa;
  
  // 1. Actual HRA received
  const comp1 = annualHra;
  
  // 2. Rent paid minus 10% of salary
  const comp2 = Math.max(0, annualRent - (0.10 * salaryForHra));
  
  // 3. 50% (Metro) or 40% (Non-Metro) of salary
  const comp3 = (isMetro ? 0.50 : 0.40) * salaryForHra;

  // Exempt HRA is the minimum of the three components
  const exemptHra = Math.min(comp1, comp2, comp3);
  
  // Taxable HRA
  const taxableHra = Math.max(0, annualHra - exemptHra);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
  };

  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
      mode,
      basic: annualBasic,
      da: annualDa,
      hraReceived: annualHra,
      rentPaid: annualRent,
      isMetro,
      exemptHra,
      taxableHra
    }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `hra_calculation_report_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full space-y-8 font-sans">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white p-8 sm:p-10 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1dbf73]/20 text-[#1dbf73] text-xs font-bold uppercase tracking-wider border border-[#1dbf73]/30">
            <Home className="w-4 h-4" />
            <span>Section 10(13A) &bull; Income-tax Act, 2025</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            House Rent Allowance (HRA) Calculator
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Instantly calculate your tax-exempt and taxable HRA for metro and non-metro residential rentals with automated salary threshold validations.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={handleExportJson}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-colors border border-white/20 cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#1dbf73]" />
            <span>Export JSON</span>
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2.5 bg-[#1dbf73] hover:bg-[#19a463] text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-colors shadow-lg cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Compliance Notices */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <strong className="block font-bold mb-0.5">Old Tax Regime Notice</strong>
            HRA exemption is exclusively available under the <strong>Old Tax Regime</strong> and cannot be claimed if you opt for the New Tax Regime.
          </div>
        </div>

        {annualRent > 100000 && (
          <div className="p-4 bg-blue-50 rounded-2xl border border-blue-200 text-xs text-blue-900 flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-bold mb-0.5">Landlord PAN Mandate</strong>
              Since annual rent exceeds ₹1,00,000, furnishing your landlord's <strong>Permanent Account Number (PAN)</strong> to your employer is mandatory.
            </div>
          </div>
        )}
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: INPUT FORM (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 className="text-base font-black text-[#222325] flex items-center gap-2">
              <Building className="w-4 h-4 text-[#1dbf73]" />
              <span>Salary & Rent Parameters</span>
            </h3>

            {/* Monthly / Annual Toggle */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => setMode('annual')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  mode === 'annual' ? 'bg-white text-[#222325] shadow-xs' : 'text-slate-600 hover:text-[#222325]'
                }`}
              >
                Annual
              </button>
              <button
                type="button"
                onClick={() => setMode('monthly')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  mode === 'monthly' ? 'bg-white text-[#222325] shadow-xs' : 'text-slate-600 hover:text-[#222325]'
                }`}
              >
                Monthly
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Basic Salary ({mode === 'annual' ? 'Annual' : 'Monthly'}) (₹)
                </label>
                <input
                  type="number"
                  value={basic}
                  onChange={(e) => setBasic(parseFloat(e.target.value) || 0)}
                  className="w-full p-3.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-[#222325]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Dearness Allowance (DA) ({mode === 'annual' ? 'Annual' : 'Monthly'}) (₹)
                </label>
                <input
                  type="number"
                  value={da}
                  onChange={(e) => setDa(parseFloat(e.target.value) || 0)}
                  className="w-full p-3.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-[#222325]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  HRA Received ({mode === 'annual' ? 'Annual' : 'Monthly'}) (₹)
                </label>
                <input
                  type="number"
                  value={hraReceived}
                  onChange={(e) => setHraReceived(parseFloat(e.target.value) || 0)}
                  className="w-full p-3.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-[#222325]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Rent Paid ({mode === 'annual' ? 'Annual' : 'Monthly'}) (₹)
                </label>
                <input
                  type="number"
                  value={rentPaid}
                  onChange={(e) => setRentPaid(parseFloat(e.target.value) || 0)}
                  className="w-full p-3.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-[#222325]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">City Classification</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setIsMetro(true)}
                  className={`p-3.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    isMetro ? 'bg-[#1dbf73]/10 border-[#1dbf73] text-[#1dbf73]' : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <span>Metro City (50% of Basic)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsMetro(false)}
                  className={`p-3.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    !isMetro ? 'bg-[#1dbf73]/10 border-[#1dbf73] text-[#1dbf73]' : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <span>Non-Metro City (40% of Basic)</span>
                </button>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Metro cities include Mumbai, Delhi, Kolkata, Chennai, Bengaluru, Hyderabad, Pune, and Ahmedabad.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: STICKY LIVE HRA SUMMARY CARD (5 cols) */}
        <div className="lg:col-span-5 sticky top-24 space-y-6">
          <div className="bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white p-6 sm:p-8 rounded-3xl shadow-2xl space-y-6 border border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="text-xs font-bold text-[#1dbf73] uppercase tracking-wider">
                HRA Exemption Summary
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-extrabold uppercase">
                Section 10(13A)
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <div className="text-xs text-slate-400 mb-1">Tax-Exempt HRA (Lower of 3 components)</div>
                <div className="text-3xl font-black text-[#1dbf73]">
                  {formatCurrency(exemptHra)}
                </div>
              </div>

              <div>
                <div className="text-xs text-slate-400 mb-1">Taxable HRA (Added to Salary Income)</div>
                <div className="text-2xl font-black text-white">
                  {formatCurrency(taxableHra)}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 space-y-2 text-xs text-slate-300">
              <div className="font-bold text-white mb-1">Component Breakdown:</div>
              <div className="flex justify-between">
                <span>1. Actual HRA Received:</span>
                <span>{formatCurrency(comp1)}</span>
              </div>
              <div className="flex justify-between">
                <span>2. Rent Paid - 10% Salary:</span>
                <span>{formatCurrency(comp2)}</span>
              </div>
              <div className="flex justify-between">
                <span>3. {isMetro ? '50%' : '40%'} of Salary (Basic+DA):</span>
                <span>{formatCurrency(comp3)}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleExportJson}
              className="w-full py-3.5 rounded-2xl bg-[#1dbf73] hover:bg-[#19a463] text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download HRA Report (JSON)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
