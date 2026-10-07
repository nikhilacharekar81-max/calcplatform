import React, { useState } from 'react';
import { Shield, Info, Car, FileText } from 'lucide-react';
import { calculateCarInsurance } from '../../calculators/india/insurance/vehicle.ts';

export const CarInsuranceCalculatorApp: React.FC = () => {
  // Simple Streamlined Inputs
  const [vehicleType, setVehicleType] = useState<string>('Hatchback');
  const [fuelType, setFuelType] = useState<string>('Petrol');
  const [engineCapacity, setEngineCapacity] = useState<number>(1200);
  const [vehicleAgeYears, setVehicleAgeYears] = useState<number>(1); // 0 (New) to 5
  const [vehicleValue, setVehicleValue] = useState<number>(850000); // Ex-showroom or estimated value
  const [policyType, setPolicyType] = useState<string>('Comprehensive'); // Comprehensive / Third-party / OD
  const [ncbPercent, setNcbPercent] = useState<number>(20); // 0, 20, 25, 35, 45, 50

  // Derive age in months for the underlying engine
  const ageMonths = vehicleAgeYears === 0 ? 0 : vehicleAgeYears * 12;

  // Run calculation
  const carInsuranceResult = calculateCarInsurance({
    manufacturerListedExShowroomPrice: vehicleValue,
    vehicleAgeMonths: ageMonths,
    claimFreeYearsNCB: ncbPercent === 20 ? 1 : ncbPercent === 25 ? 2 : ncbPercent === 35 ? 3 : ncbPercent === 45 ? 4 : ncbPercent === 50 ? 5 : 0,
    engineCapacityCC: engineCapacity,
    voluntaryDeductible: 0, // removed optional voluntary deductibles per instruction
    isElectricVehicle: fuelType === 'Electric',
    isNewVehicle: vehicleAgeYears === 0,
    insurerId: undefined, // removed underwriter profile selection per instruction
  });

  // Simple outputs mapped cleanly
  const calculatedIDV = carInsuranceResult.insuredDeclaredValueIDV;
  const rawOwnDamage = carInsuranceResult.estimatedOwnDamagePremium; // base OD premium before NCB
  
  // Calculate NCB discount
  const baseOdRate = fuelType === 'Electric' ? 0.022 : 0.028;
  const grossOwnDamage = calculatedIDV * baseOdRate;
  const ncbDiscount = policyType === 'Third-party' ? 0 : Math.round(grossOwnDamage * (ncbPercent / 100));
  
  // Own Damage Premium (after discounts)
  const finalOwnDamagePremium = policyType === 'Third-party' ? 0 : Math.max(0, Math.round(grossOwnDamage - ncbDiscount));
  
  // Third Party Premium
  const finalThirdPartyPremium = policyType === 'OD' ? 0 : carInsuranceResult.statutoryThirdPartyPremium;

  // Estimated Premium (base premium before tax)
  const estimatedPremium = finalOwnDamagePremium + finalThirdPartyPremium;

  // GST 18%
  const gstAmount = Math.round(estimatedPremium * 0.18);

  // Total Estimated Premium
  const totalEstimatedPremium = estimatedPremium + gstAmount;

  // Formatting helper
  const formatRupees = (val: number) => {
    return `₹${Math.round(val).toLocaleString('en-IN')}`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* LEFT COLUMN: Simplified Inputs */}
      <div className="lg:col-span-7 bg-[#fafafa] border border-[#e4e5e7] rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3 pb-2 border-b border-[#e4e5e7]">
          <div className="w-10 h-10 rounded-xl bg-[#eefaf4] text-[#1dbf73] flex items-center justify-center border border-[#d8f5e5]">
            <Car className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#222325]">Car Insurance Parameters</h2>
            <p className="text-xs text-[#74767e]">Provide vehicle details to calculate premium</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Vehicle Type */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#222325] uppercase tracking-wider">Vehicle Type</label>
            <select 
              value={vehicleType} 
              onChange={(e) => setVehicleType(e.target.value)}
              className="w-full h-11 px-3 border border-[#cbd1d6] rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#1dbf73] focus:border-[#1dbf73] bg-white transition-all"
            >
              <option value="Hatchback">Hatchback (e.g. Alto, i10)</option>
              <option value="Sedan">Sedan (e.g. City, Verna)</option>
              <option value="SUV">SUV / MUV (e.g. Creta, Brezza)</option>
              <option value="Luxury">Luxury Car (e.g. BMW, Audi)</option>
            </select>
          </div>

          {/* Fuel Type */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#222325] uppercase tracking-wider">Fuel Type</label>
            <select 
              value={fuelType} 
              onChange={(e) => setFuelType(e.target.value)}
              className="w-full h-11 px-3 border border-[#cbd1d6] rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#1dbf73] focus:border-[#1dbf73] bg-white transition-all"
            >
              <option value="Petrol">Petrol</option>
              <option value="Diesel">Diesel</option>
              <option value="CNG">CNG</option>
              <option value="Electric">Electric (EV)</option>
            </select>
          </div>

          {/* Engine Capacity / EV Power */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#222325] uppercase tracking-wider">Engine Capacity / EV Power (CC / kW)</label>
            <input 
              type="number" 
              value={engineCapacity} 
              onChange={(e) => setEngineCapacity(Math.max(1, Number(e.target.value)))}
              className="w-full h-11 px-3 border border-[#cbd1d6] rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#1dbf73] focus:border-[#1dbf73] bg-white transition-all"
              placeholder="e.g. 1200"
            />
          </div>

          {/* Vehicle Age */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#222325] uppercase tracking-wider">Vehicle Age</label>
            <select 
              value={vehicleAgeYears} 
              onChange={(e) => setVehicleAgeYears(Number(e.target.value))}
              className="w-full h-11 px-3 border border-[#cbd1d6] rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#1dbf73] focus:border-[#1dbf73] bg-white transition-all"
            >
              <option value="0">New (Under 6 months)</option>
              <option value="1">1 Year Old</option>
              <option value="2">2 Years Old</option>
              <option value="3">3 Years Old</option>
              <option value="4">4 Years Old</option>
              <option value="5">5+ Years Old</option>
            </select>
          </div>

          {/* Vehicle Value / IDV */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#222325] uppercase tracking-wider">Vehicle Value / IDV (₹)</label>
            <input 
              type="number" 
              value={vehicleValue} 
              onChange={(e) => setVehicleValue(Math.max(0, Number(e.target.value)))}
              className="w-full h-11 px-3 border border-[#cbd1d6] rounded-xl text-sm font-semibold text-[#222325] focus:outline-none focus:ring-1 focus:ring-[#1dbf73] focus:border-[#1dbf73] bg-white transition-all"
            />
          </div>

          {/* NCB */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#222325] uppercase tracking-wider">No Claim Bonus (NCB)</label>
            <select 
              value={ncbPercent} 
              onChange={(e) => setNcbPercent(Number(e.target.value))}
              className="w-full h-11 px-3 border border-[#cbd1d6] rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#1dbf73] focus:border-[#1dbf73] bg-white transition-all"
            >
              <option value="0">0% (No discount)</option>
              <option value="20">20% (1 Claim-free year)</option>
              <option value="25">25% (2 Claim-free years)</option>
              <option value="35">35% (3 Claim-free years)</option>
              <option value="45">45% (4 Claim-free years)</option>
              <option value="50">50% (5+ Claim-free years)</option>
            </select>
          </div>
        </div>

        {/* Policy Type */}
        <div className="space-y-1.5 border-t border-[#e4e5e7] pt-5">
          <label className="block text-xs font-bold text-[#222325] uppercase tracking-wider">Policy Type</label>
          <div className="flex p-1 bg-slate-100 rounded-xl">
            {['Comprehensive', 'Third-party', 'OD'].map(type => (
              <button
                key={type}
                type="button"
                onClick={() => setPolicyType(type)}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors whitespace-nowrap ${
                  policyType === type 
                    ? 'bg-[#1dbf73] text-white shadow-xs' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {type === 'OD' ? 'OD Only' : type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Output Form conforming to requirements */}
      <div className="lg:col-span-5 space-y-6">
        <div className="bg-[#222325] text-white rounded-3xl p-6 sm:p-8 space-y-5">
          <span className="text-xs text-[#a6a9ad] font-bold uppercase tracking-widest block border-b border-slate-800 pb-2">Estimated Premium</span>
          
          <div className="grid grid-cols-2 gap-4 text-xs font-medium text-[#a6a9ad]">
            <div className="space-y-1">
              <span>Vehicle IDV</span>
              <span className="block text-base font-bold text-white font-mono">{formatRupees(calculatedIDV)}</span>
            </div>
            
            <div className="space-y-1">
              <span>Third-Party Premium</span>
              <span className="block text-base font-bold text-white font-mono">{formatRupees(finalThirdPartyPremium)}</span>
            </div>
            
            <div className="space-y-1">
              <span>Own Damage Premium</span>
              <span className="block text-base font-bold text-white font-mono">{formatRupees(finalOwnDamagePremium)}</span>
            </div>
            
            <div className="space-y-1">
              <span>NCB Discount</span>
              <span className="block text-base font-bold text-[#1dbf73] font-mono">-{formatRupees(ncbDiscount)}</span>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-4 mt-2 flex justify-between items-center bg-slate-900/50 p-4 rounded-2xl border border-slate-800/80">
            <div>
              <span className="block text-xs font-bold text-white uppercase tracking-wider">Total Estimated Premium</span>
              <span className="text-[10px] text-[#a6a9ad]">Includes GST (18%)</span>
            </div>
            <span className="text-2xl font-black font-mono text-[#1dbf73]">
              {formatRupees(totalEstimatedPremium)}
            </span>
          </div>
        </div>

        {/* Premium Breakdown Visualization (HTML Bar Chart) */}
        <div className="bg-white border border-[#e4e5e7] rounded-3xl p-6 sm:p-8 space-y-4">
          <h3 className="text-xs font-bold text-[#222325] uppercase tracking-wider border-b border-slate-100 pb-2">Premium Breakdown</h3>
          <div className="space-y-2.5">
            {[
              { label: 'Third-Party Premium', val: finalThirdPartyPremium, color: 'bg-indigo-600' },
              { label: 'Own Damage Premium', val: finalOwnDamagePremium, color: 'bg-emerald-600' },
              { label: 'NCB Discount', val: ncbDiscount, color: 'bg-rose-500', isDiscount: true }
            ]
              .filter(item => item.val > 0)
              .map((item, idx) => {
                const maxVal = Math.max(finalThirdPartyPremium, finalOwnDamagePremium, ncbDiscount);
                const percentage = Math.max(5, (item.val / maxVal) * 100);
                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-[10px] text-[#74767e]">
                      <span className="font-bold uppercase tracking-wider">{item.label}</span>
                      <span className="font-mono font-bold text-[#222325]">
                        {item.isDiscount ? '-' : ''}{formatRupees(item.val)}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${item.color}`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Statutory Assumptions */}
        <div className="bg-slate-50 border border-[#e4e5e7] rounded-3xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-slate-700" />
            <h4 className="text-xs font-bold text-[#222325] uppercase tracking-wider">Statutory Rules & Tariffs</h4>
          </div>
          <div className="text-[11px] text-[#74767e] leading-relaxed space-y-2">
            <p>
              • **Own Damage Base Tariff**: Illustrative rate of **2.80%** (or **2.20%** for EVs) applied on the calculated Insured Declared Value.
            </p>
            <p>
              • **Third-Party Tariffs (FY 2026-27)**: Derived from statutory IRDAI mandates. Under-1000cc: **₹2,094**, 1000cc-1500cc: **₹3,416**, Above-1500cc: **₹7,897**.
            </p>
            <p>
              • **NCB Rules**: Strict IRDAI scale starts at **20%** after 1 claim-free year, capped at **50%** max. Any prior claim resets the NCB discount immediately to **0%**.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
