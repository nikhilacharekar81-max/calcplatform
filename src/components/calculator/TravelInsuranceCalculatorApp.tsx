import React, { useState } from 'react';
import { Plane, Calendar, DollarSign, Users, Shield, Clock, FileText, Check, AlertCircle } from 'lucide-react';
import { TravelInsuranceInfo } from './TravelInsuranceInfo';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell
} from 'recharts';

export const TravelInsuranceCalculatorApp: React.FC = () => {
  // Inputs & State
  const [destinationRegion, setDestinationRegion] = useState<string>('ASIA_EXCLUDING_JAPAN');
  const [startDate, setStartDate] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState<string>(() => {
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    return nextWeek.toISOString().split('T')[0];
  });
  const [travelerAge, setTravelerAge] = useState<number>(30);
  const [numTravelers, setNumTravelers] = useState<number>(1);
  const [sumInsuredUsd, setSumInsuredUsd] = useState<number>(100000);
  const [tripType, setTripType] = useState<string>('Single'); // Single / Annual
  const [preExistingCondition, setPreExistingCondition] = useState<string>('No'); // Yes / No
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);

  // Calculate Trip Duration (inclusive of start/end day)
  const calculateDuration = (start: string, end: string) => {
    const s = new Date(start);
    const e = new Date(end);
    if (isNaN(s.getTime()) || isNaN(e.getTime())) return 1;
    const diffTime = e.getTime() - s.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return Math.max(1, diffDays);
  };

  const duration = tripType === 'Annual' ? 365 : calculateDuration(startDate, endDate);

  // Toggle Add-on
  const toggleAddOn = (id: string) => {
    if (selectedAddOns.includes(id)) {
      setSelectedAddOns(selectedAddOns.filter(item => item !== id));
    } else {
      setSelectedAddOns([...selectedAddOns, id]);
    }
  };

  // Math Multipliers
  const baseDailyRate = 120; // Daily base rate per traveller in INR
  const baseAnnualRate = 2500; // Flat annual multi-trip rate per traveller in INR

  // 1. Destination Region Adjustments
  const destMultiplier = 
    destinationRegion === 'ASIA_EXCLUDING_JAPAN' ? 1.00 :
    destinationRegion === 'SCHENGEN_EUROPE' ? 1.45 :
    destinationRegion === 'USA_CANADA' ? 2.35 : 1.90;

  // 2. Coverage Limit (Sum Insured) Adjustments
  const covMultiplier = 
    sumInsuredUsd === 50000 ? 1.00 :
    sumInsuredUsd === 100000 ? 1.25 :
    sumInsuredUsd === 250000 ? 1.65 : 2.20;

  // 3. Age Adjustments (Standard risk bands)
  let ageMultiplier = 1.00;
  if (travelerAge <= 35) ageMultiplier = 1.00;
  else if (travelerAge <= 50) ageMultiplier = 1.20;
  else if (travelerAge <= 60) ageMultiplier = 1.55;
  else if (travelerAge <= 70) ageMultiplier = 2.10;
  else if (travelerAge <= 80) ageMultiplier = 3.40;
  else ageMultiplier = 4.80;

  // 4. Pre-existing Conditions Load
  const pecMultiplier = preExistingCondition === 'Yes' ? 1.60 : 1.00;

  // Base Individual Premium (before surcharges and add-ons)
  const baseIndividualUnit = tripType === 'Annual' ? baseAnnualRate : duration * baseDailyRate;

  // Premium per traveller BEFORE add-ons
  const indPremiumPreAddon = baseIndividualUnit * destMultiplier * covMultiplier * ageMultiplier * pecMultiplier;

  // Individual Surcharges (absolute loaded amounts for reporting)
  const indAgeSurcharge = Math.round(baseIndividualUnit * (ageMultiplier - 1) * destMultiplier * covMultiplier * pecMultiplier);
  const indDestSurcharge = Math.round(baseIndividualUnit * (destMultiplier - 1) * covMultiplier * ageMultiplier * pecMultiplier);
  const indCovSurcharge = Math.round(baseIndividualUnit * (covMultiplier - 1) * destMultiplier * ageMultiplier * pecMultiplier);

  // Add-ons computation per traveller
  let addOnCostPerTraveller = 0;
  if (selectedAddOns.includes('baggage')) addOnCostPerTraveller += 250;
  if (selectedAddOns.includes('cancellation')) addOnCostPerTraveller += 450;
  if (selectedAddOns.includes('sports')) addOnCostPerTraveller += Math.round(indPremiumPreAddon * 0.35); // 35% Loading for adventure sports
  if (selectedAddOns.includes('burglary')) addOnCostPerTraveller += 150;

  // Individual Premium
  const premiumPerTraveller = Math.round(indPremiumPreAddon + addOnCostPerTraveller);

  // Total Premium values
  const totalBasePremiumAll = Math.round(indPremiumPreAddon * numTravelers);
  const totalAddOnPremiumAll = Math.round(addOnCostPerTraveller * numTravelers);
  
  // Adjusted base premium before GST
  const estimatedPremium = totalBasePremiumAll + totalAddOnPremiumAll;

  // Premium per day per traveller
  const premiumPerDay = tripType === 'Annual' ? Math.round(premiumPerTraveller / 365) : Math.round(premiumPerTraveller / duration);

  // Deductible based on medical coverage tier
  const deductibleUsd = sumInsuredUsd <= 100000 ? 50 : 100;

  // Statutory General Insurance GST (18%)
  const gstAmount = Math.round(estimatedPremium * 0.18);
  const finalPayablePremium = estimatedPremium + gstAmount;

  // Formats
  const formatINR = (val: number) => `₹${Math.round(val).toLocaleString('en-IN')}`;
  const formatUSD = (val: number) => `$${val.toLocaleString('en-US')} USD`;

  // 3. Dynamic Chart: Premium Breakdown (Bar Chart)
  const getBreakdownChartData = () => {
    return [
      { name: 'Base Base', value: Math.round(baseIndividualUnit * numTravelers), color: '#6366f1' },
      { name: 'Age Surcharge', value: indAgeSurcharge * numTravelers, color: '#f59e0b' },
      { name: 'Dest Surcharge', value: indDestSurcharge * numTravelers, color: '#3b82f6' },
      { name: 'Cov Surcharge', value: indCovSurcharge * numTravelers, color: '#ec4899' },
      { name: 'Add-ons Cost', value: totalAddOnPremiumAll, color: '#8b5cf6' },
      { name: 'GST Tax (18%)', value: gstAmount, color: '#10b981' }
    ].filter(item => item.value > 0);
  };

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Input Control Panel */}
        <div className="lg:col-span-7 bg-[#fafafa] border border-[#e4e5e7] rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3 pb-3 border-b border-[#e4e5e7]">
            <div className="w-10 h-10 rounded-xl bg-[#eefaf4] text-[#1dbf73] flex items-center justify-center border border-[#d8f5e5]">
              <Plane className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#222325]">Travel Insurance Settings</h2>
              <p className="text-xs text-[#74767e]">Adjust itinerary, age, and coverage params in real-time</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Trip Type */}
            <div className="sm:col-span-2 space-y-1.5">
              <label className="block text-xs font-bold text-[#222325] uppercase tracking-wider">Trip Type</label>
              <div className="flex p-1 bg-slate-100 rounded-xl">
                {[
                  { id: 'Single', label: 'Single Trip Cover' },
                  { id: 'Annual', label: 'Annual Multi-Trip (365 days)' }
                ].map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setTripType(item.id)}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors whitespace-nowrap ${
                      tripType === item.id 
                        ? 'bg-[#1dbf73] text-white shadow-xs' 
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Destination Region */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#222325] uppercase tracking-wider">Destination Region</label>
              <select
                value={destinationRegion}
                onChange={(e) => setDestinationRegion(e.target.value)}
                className="w-full h-11 px-3 border border-[#cbd1d6] rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#1dbf73] focus:border-[#1dbf73] bg-white transition-all"
              >
                <option value="ASIA_EXCLUDING_JAPAN">Asia (Excl. Japan & Korea)</option>
                <option value="SCHENGEN_EUROPE">Schengen Europe Zone</option>
                <option value="USA_CANADA">USA & Canada (High Medical Risk)</option>
                <option value="WORLDWIDE">Worldwide (Full Global Coverage)</option>
              </select>
            </div>

            {/* Sum Insured / Medical Coverage */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#222325] uppercase tracking-wider">Medical Sum Insured</label>
              <select
                value={sumInsuredUsd}
                onChange={(e) => setSumInsuredUsd(Number(e.target.value))}
                className="w-full h-11 px-3 border border-[#cbd1d6] rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#1dbf73] focus:border-[#1dbf73] bg-white transition-all font-semibold text-[#222325]"
              >
                <option value={50000}>$50,000 USD (Basic Cover)</option>
                <option value={100000}>$100,000 USD (Recommended Standard)</option>
                <option value={250000}>$250,000 USD (Enhanced Protection)</option>
                <option value={500000}>$500,000 USD (Supreme Peace-of-Mind)</option>
              </select>
            </div>

            {/* Trip Dates - only if Single Trip */}
            {tripType === 'Single' && (
              <>
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#222325] uppercase tracking-wider">Trip Start Date</label>
                  <div className="relative">
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => {
                        setStartDate(e.target.value);
                        if (new Date(e.target.value) > new Date(endDate)) {
                          setEndDate(e.target.value);
                        }
                      }}
                      className="w-full h-11 px-3 border border-[#cbd1d6] rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#1dbf73] focus:border-[#1dbf73] bg-white transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#222325] uppercase tracking-wider">Trip End Date</label>
                  <div className="relative">
                    <input
                      type="date"
                      value={endDate}
                      min={startDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full h-11 px-3 border border-[#cbd1d6] rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#1dbf73] focus:border-[#1dbf73] bg-white transition-all"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Traveller Age */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#222325] uppercase tracking-wider">Primary Traveller Age</label>
              <div className="space-y-2">
                <input
                  type="number"
                  min={1}
                  max={99}
                  value={travelerAge}
                  onChange={(e) => setTravelerAge(Math.max(1, Math.min(99, Number(e.target.value))))}
                  className="w-full h-11 px-3 border border-[#cbd1d6] rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#1dbf73] focus:border-[#1dbf73] bg-white transition-all font-mono"
                />
                <input
                  type="range"
                  min={1}
                  max={95}
                  value={travelerAge}
                  onChange={(e) => setTravelerAge(Number(e.target.value))}
                  className="w-full h-1 accent-[#1dbf73] bg-slate-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>

            {/* Number of Travellers */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#222325] uppercase tracking-wider">Number of Travellers</label>
              <input
                type="number"
                min={1}
                max={25}
                value={numTravelers}
                onChange={(e) => setNumTravelers(Math.max(1, Math.min(25, Number(e.target.value))))}
                className="w-full h-11 px-3 border border-[#cbd1d6] rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#1dbf73] focus:border-[#1dbf73] bg-white transition-all font-mono"
              />
            </div>

            {/* Pre-existing Medical Condition */}
            <div className="sm:col-span-2 space-y-1.5 border-t border-[#e4e5e7] pt-5">
              <label className="block text-xs font-bold text-[#222325] uppercase tracking-wider">Pre-existing Medical History?</label>
              <div className="flex gap-4">
                {['No', 'Yes'].map(option => (
                  <label key={option} className="flex items-center gap-2 cursor-pointer text-sm font-medium text-[#404145]">
                    <input
                      type="radio"
                      name="preExisting"
                      value={option}
                      checked={preExistingCondition === option}
                      onChange={() => setPreExistingCondition(option)}
                      className="w-4 h-4 text-[#1dbf73] focus:ring-[#1dbf73] border-slate-300"
                    />
                    <span>{option === 'Yes' ? 'Yes (Includes medical complications cover)' : 'No (Standard coverage)'}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Optional Add-ons */}
            <div className="sm:col-span-2 space-y-3 border-t border-[#e4e5e7] pt-5">
              <label className="block text-xs font-bold text-[#222325] uppercase tracking-wider">Optional Sickness & Luggage Add-ons</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {[
                  { id: 'baggage', label: 'Baggage Loss & Delay Cover', price: '₹250 flat' },
                  { id: 'cancellation', label: 'Trip Interruption & Delay', price: '₹450 flat' },
                  { id: 'sports', label: 'Adventure Sports & Trekking Cover', price: '+35% base load' },
                  { id: 'burglary', label: 'Home Burglary Security during trip', price: '₹150 flat' }
                ].map(item => {
                  const checked = selectedAddOns.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleAddOn(item.id)}
                      className={`flex items-center justify-between p-3 border text-left rounded-xl transition-all ${
                        checked 
                          ? 'bg-[#f4fdf8] border-[#1dbf73] shadow-2xs' 
                          : 'bg-white border-[#e4e5e7] hover:border-slate-400'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                          checked ? 'bg-[#1dbf73] border-[#1dbf73]' : 'border-slate-300'
                        }`}>
                          {checked && <Check className="w-3 h-3 text-white stroke-[3px]" />}
                        </div>
                        <span className="text-xs font-semibold text-[#222325]">{item.label}</span>
                      </div>
                      <span className="text-[10px] font-mono text-[#74767e] bg-slate-100 px-1.5 py-0.5 rounded-md shrink-0">
                        {item.price}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Results & Recharts Displays */}
        <div className="lg:col-span-5 space-y-6">
          {/* Output KPI Board */}
          <div className="bg-[#222325] text-white rounded-3xl p-6 sm:p-8 space-y-5 shadow-lg">
            <span className="text-xs text-[#a6a9ad] font-bold uppercase tracking-widest block border-b border-slate-800 pb-2">Estimated Travel Premium</span>
            
            <div className="text-4xl font-extrabold text-[#1dbf73] mb-6">
              {formatINR(finalPayablePremium)}
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-[#74767e]">Base Premium</span>
                <span className="font-medium text-[#222325]">{formatINR(totalBasePremiumAll)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#74767e]">Add-on Premium</span>
                <span className="font-medium text-[#222325]">{formatINR(totalAddOnPremiumAll)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#74767e]">GST (18%)</span>
                <span className="font-medium text-[#222325]">{formatINR(gstAmount)}</span>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-[#e4e5e7] grid grid-cols-2 gap-4">
              <div className="bg-[#f8f9fa] p-4 rounded-xl">
                <div className="text-xs text-[#74767e] mb-1">Per Traveller</div>
                <div className="font-bold text-[#222325]">{formatINR(premiumPerTraveller)}</div>
              </div>
              <div className="bg-[#f8f9fa] p-4 rounded-xl">
                <div className="text-xs text-[#74767e] mb-1">Per Day</div>
                <div className="font-bold text-[#222325]">{formatINR(premiumPerDay)}</div>
              </div>
            </div>
          </div>

          {/* 1. CHART: Premium Breakdown */}
          <div className="bg-white border border-[#e4e5e7] rounded-3xl p-5 space-y-3.5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-xs font-bold text-[#222325] uppercase tracking-wider">Premium Breakdown (All Travellers)</h3>
              <span className="text-[10px] bg-slate-100 px-2 py-0.5 text-slate-600 rounded font-bold uppercase">₹ INR</span>
            </div>
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={getBreakdownChartData()} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" fontSize={9} tickLine={false} stroke="#74767e" />
                  <YAxis fontSize={9} tickLine={false} stroke="#74767e" />
                  <Tooltip 
                    cursor={{ fill: 'rgba(0, 0, 0, 0.02)' }}
                    contentStyle={{ fontSize: '11px', borderRadius: '8px' }} 
                    formatter={(val: any) => [formatINR(Number(val || 0)), 'Premium']}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={28}>
                    {getBreakdownChartData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>


          {/* Assumptions & Educational Card */}
          <div className="bg-slate-50 border border-[#e4e5e7] rounded-3xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-slate-700" />
              <h4 className="text-xs font-bold text-[#222325] uppercase tracking-wider">Travel Insurance Assumptions</h4>
            </div>
            <div className="text-[11px] text-[#74767e] leading-relaxed space-y-2.5">
              <p>
                • **Schengen Visa Minimum**: General Schengen insurance policies require at least **$50,000 USD** (equivalent to €30,000) medical insurance with a **$0 USD** or **$50 USD** deductible.
              </p>
              <p>
                • **High-Cost Territories**: Regions such as the **USA & Canada** carry significantly higher loading (up to **2.35x**) on base daily tariffs due to extremely high medical diagnostic and inpatient care costs.
              </p>
              <p>
                • **Sickness Cover Loadings**: Declaring pre-existing medical conditions incurs a standard risk loading of **1.60x** on underwritten base pricing to cover emergency exacerbations.
              </p>
              <p>
                • **Indian GST Standard**: A flat **18.00%** Goods & Services Tax is automatically applied in accordance with current IRDAI general insurance taxation regulations.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <TravelInsuranceInfo />
    </div>
  );
};
