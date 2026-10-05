import { roundMoney } from "../../../engines/financial-maths/index.ts";
import { indiaRuleRegistry } from "../../../rules/india/registry.ts";
import { IndiaInsuranceParameters } from "../../../rules/india/insurance/versions/2026.ts";

export interface CarInsuranceInput {
  manufacturerListedExShowroomPrice: number;
  vehicleAgeMonths: number;
  claimFreeYearsNCB: number;
  engineCapacityCC?: number;
  voluntaryDeductible?: number;
  isElectricVehicle?: boolean;
}

export interface CarInsuranceResult {
  insuredDeclaredValueIDV: number;
  insuredDeclaredValueIDVFormatted: string;
  appliedDepreciationPercent: number;
  noClaimBonusPercent: number;
  estimatedOwnDamagePremium: number;
  estimatedOwnDamageLabel: string;
  statutoryThirdPartyTariffEstimate: number;
  gstAmount: number;
  totalEstimatedPremiumPayable: number;
  disclaimer: string;
}

/**
 * 6. Car Insurance Calculator — IDV Schedule Depreciation & NCB Discount Engine
 */
export function calculateCarInsurance(input: CarInsuranceInput): CarInsuranceResult {
  const exShowroom = Math.max(0, input.manufacturerListedExShowroomPrice);
  const ageMonths = Math.max(0, input.vehicleAgeMonths);
  const ncbYears = Math.min(5, Math.max(0, input.claimFreeYearsNCB));

  const rule = indiaRuleRegistry.resolveActiveVerified<IndiaInsuranceParameters>({
    domain: "INSURANCE",
    ruleId: "INSURANCE-INDIA-2026",
    version: "2026-01",
  });
  const depSchedule = rule.parameters.motorIdvDepreciationPercent;
  const ncbLadder = rule.parameters.motorNcbLadderPercent;
  const gstPercent = rule.parameters.gstRatesPercent.motorInsurance;

  // Determine IRDAI IDV Depreciation Percentage
  let depPct = 50; // fallback for vehicles > 5 years old
  const matchedDep = depSchedule.find((item) => ageMonths >= item.minAgeMonths && ageMonths < item.maxAgeMonths);
  if (matchedDep) {
    depPct = matchedDep.depreciationPercent;
  }

  // Calculate Insured Declared Value (IDV) based on Manufacturer Listed Ex-Showroom Price
  const idv = roundMoney(exShowroom * (1 - depPct / 100));

  // Determine NCB Percentage
  const matchedNcb = ncbLadder.find((item) => item.claimFreeYears === ncbYears);
  const ncbPct = matchedNcb ? matchedNcb.ncbPercent : 50;

  // Illustrative OD Premium Calculation
  let baseOdRate = 0.028;
  if (input.isElectricVehicle) baseOdRate = 0.022;

  let grossOdPremium = idv * baseOdRate;
  const ncbDiscount = grossOdPremium * (ncbPct / 100);
  const netOdPremium = Math.max(0, grossOdPremium - ncbDiscount - (input.voluntaryDeductible || 0));

  // Statutory Third-Party Premium Estimate based on CC
  const cc = input.engineCapacityCC || 1200;
  let tpTariff = 2094;
  if (cc > 1500) tpTariff = 7897;
  else if (cc > 1000) tpTariff = 3416;

  const netPremiumBeforeTax = netOdPremium + tpTariff;
  const gst = roundMoney(netPremiumBeforeTax * (gstPercent / 100));
  const totalPayable = roundMoney(netPremiumBeforeTax + gst);

  return {
    insuredDeclaredValueIDV: idv,
    insuredDeclaredValueIDVFormatted: `₹${idv.toLocaleString("en-IN")}`,
    appliedDepreciationPercent: depPct,
    noClaimBonusPercent: ncbPct,
    estimatedOwnDamagePremium: roundMoney(netOdPremium),
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
}

export interface BikeInsuranceResult {
  insuredDeclaredValueIDV: number;
  insuredDeclaredValueIDVFormatted: string;
  appliedDepreciationPercent: number;
  noClaimBonusPercent: number;
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
  const ncbYears = Math.min(5, Math.max(0, input.claimFreeYearsNCB));

  const rule = indiaRuleRegistry.resolveActiveVerified<IndiaInsuranceParameters>({
    domain: "INSURANCE",
    ruleId: "INSURANCE-INDIA-2026",
    version: "2026-01",
  });
  const depSchedule = rule.parameters.motorIdvDepreciationPercent;
  const ncbLadder = rule.parameters.motorNcbLadderPercent;
  const gstPercent = rule.parameters.gstRatesPercent.motorInsurance;

  let depPct = 50;
  const matchedDep = depSchedule.find((item) => ageMonths > item.minAgeMonths && ageMonths <= item.maxAgeMonths);
  if (matchedDep) depPct = matchedDep.depreciationPercent;
  else if (ageMonths <= 0) depPct = 0; // Brand new

  const idv = roundMoney(exShowroom * (1 - depPct / 100));

  const completedNcbYears = Math.floor(ncbYears);
  const matchedNcb = ncbLadder.find((item) => item.claimFreeYears === completedNcbYears);
  const ncbPct = matchedNcb ? matchedNcb.ncbPercent : 0;

  const grossOd = idv * 0.017;
  const netOd = Math.max(0, grossOd * (1 - ncbPct / 100));

  const cc = input.engineCapacityCC || 125;
  let tpTariff = 714;
  if (cc > 350) tpTariff = 2804;
  else if (cc > 150) tpTariff = 1366;
  else if (cc <= 75) tpTariff = 538;

  const netBeforeGst = netOd + tpTariff;
  const gst = roundMoney(netBeforeGst * (gstPercent / 100));
  const totalPayable = roundMoney(netBeforeGst + gst);

  return {
    insuredDeclaredValueIDV: idv,
    insuredDeclaredValueIDVFormatted: `₹${idv.toLocaleString("en-IN")}`,
    appliedDepreciationPercent: depPct,
    noClaimBonusPercent: ncbPct,
    statutoryThirdPartyPremium: tpTariff,
    estimatedOwnDamageLabel: "Estimated Own Damage Premium — Illustrative Only",
    gstAmount: gst,
    totalEstimatedPremiumPayable: totalPayable,
  };
}
