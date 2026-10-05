import { roundMoney } from "../../../engines/financial-maths/index.ts";
import { indiaRuleRegistry } from "../../../rules/india/registry.ts";
import { IndiaInsuranceParameters } from "../../../rules/india/insurance/versions/2026.ts";

export interface CarInsuranceInput {
  manufacturerListedExShowroomPrice: number;
  vehicleAgeMonths: number;
  claimFreeYearsNCB: number;
  engineCapacityCC?: number;
  /** Voluntary Deductible in Rupees (e.g. 2500, 5000, 7500, 15000) or discount percentage */
  voluntaryDeductible?: number;
  isElectricVehicle?: boolean;
  isNewVehicle?: boolean;
}

export interface CarInsuranceResult {
  insuredDeclaredValueIDV: number;
  insuredDeclaredValueIDVFormatted: string;
  appliedDepreciationPercent: number;
  noClaimBonusPercent: number;
  voluntaryDeductibleDiscount: number;
  estimatedOwnDamagePremium: number;
  estimatedOwnDamageLabel: string;
  statutoryThirdPartyTariffEstimate: number;
  gstAmount: number;
  totalEstimatedPremiumPayable: number;
  disclaimer: string;
}

function calculateVoluntaryDeductibleDiscount(odPremium: number, deductibleInput: number): number {
  if (deductibleInput <= 0 || odPremium <= 0) return 0;
  // If user entered a percentage (e.g. 10, 20, 25, 30, 35)
  if (deductibleInput <= 50) {
    return roundMoney(odPremium * (deductibleInput / 100));
  }
  // If user entered standard IRDAI rupee voluntary deductible tiers
  if (deductibleInput >= 15000) {
    return roundMoney(Math.min(odPremium * 0.35, 2500));
  }
  if (deductibleInput >= 7500) {
    return roundMoney(Math.min(odPremium * 0.30, 2000));
  }
  if (deductibleInput >= 5000) {
    return roundMoney(Math.min(odPremium * 0.25, 1500));
  }
  if (deductibleInput >= 2500) {
    return roundMoney(Math.min(odPremium * 0.20, 750));
  }
  // General proportional discount capped at 35% of OD
  return roundMoney(Math.min(odPremium * 0.35, deductibleInput * 0.15));
}

function getIdvDepreciationPercent(ageMonths: number): number {
  if (ageMonths <= 0) return 0;
  if (ageMonths <= 6) return 5;
  if (ageMonths <= 12) return 15;
  if (ageMonths <= 24) return 20;
  if (ageMonths <= 36) return 30;
  if (ageMonths <= 48) return 40;
  return 50;
}

/**
 * 6. Car Insurance Calculator — IDV Schedule Depreciation & NCB Discount Engine
 */
export function calculateCarInsurance(input: CarInsuranceInput): CarInsuranceResult {
  const exShowroom = Math.max(0, input.manufacturerListedExShowroomPrice);
  const ageMonths = Math.max(0, input.vehicleAgeMonths);
  const rawNcbYears = Math.max(0, input.claimFreeYearsNCB);
  const completedNcbYears = Math.min(5, Math.floor(rawNcbYears));

  const rule = indiaRuleRegistry.resolveActiveVerified<IndiaInsuranceParameters>({
    domain: "INSURANCE",
    ruleId: "INSURANCE-INDIA-2026",
    version: "2026-01",
  });
  const ncbLadder = rule.parameters.motorNcbLadderPercent;
  const gstPercent = rule.parameters.gstRatesPercent.motorInsurance;
  const tpTariffs = rule.parameters.motorThirdPartyTariffs;

  // Determine IRDAI IDV Depreciation Percentage
  const depPct = getIdvDepreciationPercent(ageMonths);

  // Calculate Insured Declared Value (IDV) based on Manufacturer Listed Ex-Showroom Price
  const idv = roundMoney(exShowroom * (1 - depPct / 100));

  // Determine NCB Percentage (using completed claim-free years)
  const matchedNcb = ncbLadder.find((item) => item.claimFreeYears === completedNcbYears);
  const ncbPct = matchedNcb ? matchedNcb.ncbPercent : 0;

  // Illustrative OD Premium Calculation
  let baseOdRate = 0.028;
  if (input.isElectricVehicle) baseOdRate = 0.022;

  const grossOdPremium = idv * baseOdRate;
  const ncbDiscount = grossOdPremium * (ncbPct / 100);
  const odAfterNcb = Math.max(0, grossOdPremium - ncbDiscount);

  // Voluntary deductible gives a percentage discount on OD premium, NOT raw rupee subtraction
  const deductibleDiscount = calculateVoluntaryDeductibleDiscount(odAfterNcb, input.voluntaryDeductible || 0);
  const netOdPremium = roundMoney(Math.max(0, odAfterNcb - deductibleDiscount));

  // Statutory Third-Party Premium Estimate based on CC and vehicle age
  const cc = input.engineCapacityCC || 1200;
  let tpTariff = 2094;
  if (input.isNewVehicle || ageMonths === 0) {
    // 3-Year bundled TP policy for new private cars
    if (cc > 1500) tpTariff = tpTariffs?.cars3YearBundled.above1500cc ?? 24596;
    else if (cc > 1000) tpTariff = tpTariffs?.cars3YearBundled.from1000to1500cc ?? 10640;
    else tpTariff = tpTariffs?.cars3YearBundled.under1000cc ?? 6521;
  } else {
    // 1-Year statutory annual TP policy
    if (cc > 1500) tpTariff = tpTariffs?.carsAnnual.above1500cc ?? 7897;
    else if (cc > 1000) tpTariff = tpTariffs?.carsAnnual.from1000to1500cc ?? 3416;
    else tpTariff = tpTariffs?.carsAnnual.under1000cc ?? 2094;
  }

  // Electric Vehicle 15% TP discount per IRDAI notification
  if (input.isElectricVehicle) {
    const evDiscount = tpTariffs?.electricVehicleTpDiscountPercent ?? 15;
    tpTariff = roundMoney(tpTariff * (1 - evDiscount / 100));
  }

  const netPremiumBeforeTax = netOdPremium + tpTariff;
  const gst = roundMoney(netPremiumBeforeTax * (gstPercent / 100));
  const totalPayable = roundMoney(netPremiumBeforeTax + gst);

  return {
    insuredDeclaredValueIDV: idv,
    insuredDeclaredValueIDVFormatted: `₹${idv.toLocaleString("en-IN")}`,
    appliedDepreciationPercent: depPct,
    noClaimBonusPercent: ncbPct,
    voluntaryDeductibleDiscount: deductibleDiscount,
    estimatedOwnDamagePremium: netOdPremium,
    estimatedOwnDamageLabel: "Estimated Own Damage Premium — Illustrative Only",
    statutoryThirdPartyTariffEstimate: tpTariff,
    gstAmount: gst,
    totalEstimatedPremiumPayable: totalPayable,
    disclaimer: "Insured Declared Value (IDV) is calculated strictly per IRDAI statutory depreciation schedules based on manufacturer listed ex-showroom price. Own Damage premium calculations are illustrative estimates; actual quotes depend on insurer underwriting, zonal classification, and selected add-ons.",
  };
}

export interface BikeInsuranceInput {
  manufacturerListedExShowroomPrice: number;
  bikeAgeMonths: number;
  claimFreeYearsNCB: number;
  engineCapacityCC?: number;
  isElectricVehicle?: boolean;
  isNewVehicle?: boolean;
  voluntaryDeductible?: number;
}

export interface BikeInsuranceResult {
  insuredDeclaredValueIDV: number;
  insuredDeclaredValueIDVFormatted: string;
  appliedDepreciationPercent: number;
  noClaimBonusPercent: number;
  voluntaryDeductibleDiscount: number;
  statutoryThirdPartyPremium: number;
  estimatedOwnDamageLabel: string;
  gstAmount: number;
  totalEstimatedPremiumPayable: number;
}

/**
 * 7. Bike / Two-Wheeler Insurance Calculator — Two-Wheeler IDV & Statutory TP Tariff
 */
export function calculateBikeInsurance(input: BikeInsuranceInput): BikeInsuranceResult {
  const exShowroom = Math.max(0, input.manufacturerListedExShowroomPrice);
  const ageMonths = Math.max(0, input.bikeAgeMonths);
  const rawNcbYears = Math.max(0, input.claimFreeYearsNCB);
  const completedNcbYears = Math.min(5, Math.floor(rawNcbYears));

  const rule = indiaRuleRegistry.resolveActiveVerified<IndiaInsuranceParameters>({
    domain: "INSURANCE",
    ruleId: "INSURANCE-INDIA-2026",
    version: "2026-01",
  });
  const ncbLadder = rule.parameters.motorNcbLadderPercent;
  const gstPercent = rule.parameters.gstRatesPercent.motorInsurance;
  const tpTariffs = rule.parameters.motorThirdPartyTariffs;

  // Determine IRDAI IDV Depreciation Percentage
  const depPct = getIdvDepreciationPercent(ageMonths);
  const idv = roundMoney(exShowroom * (1 - depPct / 100));

  // Determine NCB Percentage (using completed claim-free years)
  const matchedNcb = ncbLadder.find((item) => item.claimFreeYears === completedNcbYears);
  const ncbPct = matchedNcb ? matchedNcb.ncbPercent : 0;

  let grossOdRate = 0.017;
  if (input.isElectricVehicle) grossOdRate = 0.014;

  const grossOd = idv * grossOdRate;
  const ncbDiscount = grossOd * (ncbPct / 100);
  const odAfterNcb = Math.max(0, grossOd - ncbDiscount);
  const deductibleDiscount = calculateVoluntaryDeductibleDiscount(odAfterNcb, input.voluntaryDeductible || 0);
  const netOd = roundMoney(Math.max(0, odAfterNcb - deductibleDiscount));

  const cc = input.engineCapacityCC || 125;
  let tpTariff = 714;
  if (input.isNewVehicle || ageMonths === 0) {
    // 5-Year bundled TP policy for new two-wheelers
    if (cc > 350) tpTariff = tpTariffs?.twoWheelers5YearBundled.above350cc ?? 15117;
    else if (cc > 150) tpTariff = tpTariffs?.twoWheelers5YearBundled.from150to350cc ?? 7365;
    else if (cc > 75) tpTariff = tpTariffs?.twoWheelers5YearBundled.from75to150cc ?? 3851;
    else tpTariff = tpTariffs?.twoWheelers5YearBundled.under75cc ?? 2901;
  } else {
    // 1-Year annual TP tariff
    if (cc > 350) tpTariff = tpTariffs?.twoWheelersAnnual.above350cc ?? 2804;
    else if (cc > 150) tpTariff = tpTariffs?.twoWheelersAnnual.from150to350cc ?? 1366;
    else if (cc > 75) tpTariff = tpTariffs?.twoWheelersAnnual.from75to150cc ?? 714;
    else tpTariff = tpTariffs?.twoWheelersAnnual.under75cc ?? 538;
  }

  // Electric Vehicle 15% TP discount per IRDAI notification
  if (input.isElectricVehicle) {
    const evDiscount = tpTariffs?.electricVehicleTpDiscountPercent ?? 15;
    tpTariff = roundMoney(tpTariff * (1 - evDiscount / 100));
  }

  const netBeforeGst = netOd + tpTariff;
  const gst = roundMoney(netBeforeGst * (gstPercent / 100));
  const totalPayable = roundMoney(netBeforeGst + gst);

  return {
    insuredDeclaredValueIDV: idv,
    insuredDeclaredValueIDVFormatted: `₹${idv.toLocaleString("en-IN")}`,
    appliedDepreciationPercent: depPct,
    noClaimBonusPercent: ncbPct,
    voluntaryDeductibleDiscount: deductibleDiscount,
    statutoryThirdPartyPremium: tpTariff,
    estimatedOwnDamageLabel: "Estimated Own Damage Premium — Illustrative Only",
    gstAmount: gst,
    totalEstimatedPremiumPayable: totalPayable,
  };
}

