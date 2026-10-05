import { roundMoney } from "../../../engines/financial-maths/index.ts";
import { indiaRuleRegistry } from "../../../rules/india/registry.ts";
import { IndiaInsuranceParameters } from "../../../rules/india/insurance/versions/2026.ts";

export interface VehicleDeductibleTariffProfile {
  insurerId: string;
  insurerName: string;
  discountSchedule: Array<{ minDeductibleRupees: number; discountPercentOnOD: number; maxDiscountRupees: number }>;
}

export interface CarInsuranceInput {
  manufacturerListedExShowroomPrice: number;
  vehicleAgeMonths: number;
  claimFreeYearsNCB: number;
  engineCapacityCC?: number;
  voluntaryDeductible?: number;
  isElectricVehicle?: boolean;
  isNewVehicle?: boolean;
  insurerProfile?: VehicleDeductibleTariffProfile;
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
  statutoryThirdPartyPremium: number;
  gstAmount: number;
  totalEstimatedPremiumPayable: number;
  disclaimer: string;
  insurerNameUsed: string;
}

function calculateVoluntaryDeductibleDiscount(
  odPremium: number,
  deductibleRupees: number,
  discountSchedule?: Array<{ minDeductibleRupees: number; discountPercentOnOD: number; maxDiscountRupees: number }>
): number {
  if (deductibleRupees <= 0 || odPremium <= 0 || !discountSchedule) return 0;
  
  const sorted = [...discountSchedule].sort((a, b) => b.minDeductibleRupees - a.minDeductibleRupees);
  for (const tier of sorted) {
    if (deductibleRupees >= tier.minDeductibleRupees) {
      const calculatedDiscount = odPremium * (tier.discountPercentOnOD / 100);
      return roundMoney(Math.min(calculatedDiscount, tier.maxDiscountRupees));
    }
  }
  return 0;
}

function getIdvDepreciationFromSchedule(
  ageMonths: number,
  schedule: Array<{ minAgeMonths: number; maxAgeMonths: number; depreciationPercent: number }>
): number {
  if (ageMonths <= 0) return 0;
  for (const tier of schedule) {
    if (ageMonths > tier.minAgeMonths && ageMonths <= tier.maxAgeMonths) {
      return tier.depreciationPercent;
    }
  }
  return 50;
}

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

  // Strict check: Voluntary deductible discounts are strictly insurer-specific. If no insurer profile is provided, discount is unavailable (no fabricated universal rule).
  const hasInsurerProfile = Boolean(input.insurerProfile && input.insurerProfile.discountSchedule);
  const activeSchedule = hasInsurerProfile ? input.insurerProfile!.discountSchedule : undefined;
  const insurerNameUsed = hasInsurerProfile ? input.insurerProfile!.insurerName : "No Insurer Profile Selected (Voluntary Deductible Unavailable)";

  const depPct = getIdvDepreciationFromSchedule(ageMonths, rule.parameters.motorIdvDepreciationPercent);
  const idv = roundMoney(exShowroom * (1 - depPct / 100));

  const matchedNcb = ncbLadder.find((item) => item.claimFreeYears === completedNcbYears);
  const ncbPct = matchedNcb ? matchedNcb.ncbPercent : 0;

  let baseOdRate = 0.028;
  if (input.isElectricVehicle) baseOdRate = 0.022;

  const grossOdPremium = idv * baseOdRate;
  const ncbDiscount = grossOdPremium * (ncbPct / 100);
  const odAfterNcb = Math.max(0, grossOdPremium - ncbDiscount);

  const deductibleDiscount = hasInsurerProfile
    ? calculateVoluntaryDeductibleDiscount(odAfterNcb, input.voluntaryDeductible ?? 0, activeSchedule)
    : 0;
  const netOdPremium = roundMoney(Math.max(0, odAfterNcb - deductibleDiscount));

  const cc = input.engineCapacityCC ?? 1200;
  let tpTariff = 0;
  if (input.isNewVehicle || ageMonths === 0) {
    if (cc > 1500) tpTariff = tpTariffs.cars3YearBundled.above1500cc;
    else if (cc > 1000) tpTariff = tpTariffs.cars3YearBundled.from1000to1500cc;
    else tpTariff = tpTariffs.cars3YearBundled.under1000cc;
  } else {
    if (cc > 1500) tpTariff = tpTariffs.carsAnnual.above1500cc;
    else if (cc > 1000) tpTariff = tpTariffs.carsAnnual.from1000to1500cc;
    else tpTariff = tpTariffs.carsAnnual.under1000cc;
  }

  if (input.isElectricVehicle) {
    const evDiscount = tpTariffs.electricVehicleTpDiscountPercent;
    tpTariff = roundMoney(tpTariff * (1 - evDiscount / 100));
  }

  const netPremiumBeforeTax = netOdPremium + tpTariff;
  const gst = roundMoney(netPremiumBeforeTax * (gstPercent / 100));
  const totalPayable = roundMoney(netPremiumBeforeTax + gst);

  const fallbackNotice = !hasInsurerProfile
    ? " Note: Voluntary deductible discount unavailable as no specific insurer tariff profile was selected. Voluntary deductible discounts are strictly insurer-specific underwriter terms and not universal statutory rules."
    : "";

  return {
    insuredDeclaredValueIDV: idv,
    insuredDeclaredValueIDVFormatted: `₹${idv.toLocaleString("en-IN")}`,
    appliedDepreciationPercent: depPct,
    noClaimBonusPercent: ncbPct,
    voluntaryDeductibleDiscount: deductibleDiscount,
    estimatedOwnDamagePremium: netOdPremium,
    estimatedOwnDamageLabel: "Estimated Own Damage Premium — Illustrative Only",
    statutoryThirdPartyTariffEstimate: tpTariff,
    statutoryThirdPartyPremium: tpTariff,
    gstAmount: gst,
    totalEstimatedPremiumPayable: totalPayable,
    insurerNameUsed,
    disclaimer: `Insured Declared Value (IDV) is calculated strictly per IRDAI statutory depreciation schedules. Own damage and deductible terms utilize profile '${insurerNameUsed}'.${fallbackNotice}`,
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
  insurerProfile?: VehicleDeductibleTariffProfile;
}

export interface BikeInsuranceResult {
  insuredDeclaredValueIDV: number;
  insuredDeclaredValueIDVFormatted: string;
  appliedDepreciationPercent: number;
  noClaimBonusPercent: number;
  voluntaryDeductibleDiscount: number;
  estimatedOwnDamagePremium: number;
  statutoryThirdPartyTariffEstimate: number;
  statutoryThirdPartyPremium: number;
  gstAmount: number;
  totalEstimatedPremiumPayable: number;
  disclaimer: string;
  insurerNameUsed: string;
}

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

  const hasInsurerProfile = Boolean(input.insurerProfile && input.insurerProfile.discountSchedule);
  const activeSchedule = hasInsurerProfile ? input.insurerProfile!.discountSchedule : undefined;
  const insurerNameUsed = hasInsurerProfile ? input.insurerProfile!.insurerName : "No Insurer Profile Selected (Voluntary Deductible Unavailable)";

  const depPct = getIdvDepreciationFromSchedule(ageMonths, rule.parameters.motorIdvDepreciationPercent);
  const idv = roundMoney(exShowroom * (1 - depPct / 100));

  const matchedNcb = ncbLadder.find((item) => item.claimFreeYears === completedNcbYears);
  const ncbPct = matchedNcb ? matchedNcb.ncbPercent : 0;

  let baseOdRate = 0.025;
  if (input.isElectricVehicle) baseOdRate = 0.020;

  const grossOdPremium = idv * baseOdRate;
  const ncbDiscount = grossOdPremium * (ncbPct / 100);
  const odAfterNcb = Math.max(0, grossOdPremium - ncbDiscount);

  const deductibleDiscount = hasInsurerProfile
    ? calculateVoluntaryDeductibleDiscount(odAfterNcb, input.voluntaryDeductible ?? 0, activeSchedule)
    : 0;
  const netOdPremium = roundMoney(Math.max(0, odAfterNcb - deductibleDiscount));

  const cc = input.engineCapacityCC ?? 150;
  let tpTariff = 0;
  if (input.isNewVehicle || ageMonths === 0) {
    if (cc > 350) tpTariff = tpTariffs.twoWheelers5YearBundled.above350cc;
    else if (cc > 150) tpTariff = tpTariffs.twoWheelers5YearBundled.from150to350cc;
    else if (cc > 75) tpTariff = tpTariffs.twoWheelers5YearBundled.from75to150cc;
    else tpTariff = tpTariffs.twoWheelers5YearBundled.under75cc;
  } else {
    if (cc > 350) tpTariff = tpTariffs.twoWheelersAnnual.above350cc;
    else if (cc > 150) tpTariff = tpTariffs.twoWheelersAnnual.from150to350cc;
    else if (cc > 75) tpTariff = tpTariffs.twoWheelersAnnual.from75to150cc;
    else tpTariff = tpTariffs.twoWheelersAnnual.under75cc;
  }

  if (input.isElectricVehicle) {
    const evDiscount = tpTariffs.electricVehicleTpDiscountPercent;
    tpTariff = roundMoney(tpTariff * (1 - evDiscount / 100));
  }

  const netPremiumBeforeTax = netOdPremium + tpTariff;
  const gst = roundMoney(netPremiumBeforeTax * (gstPercent / 100));
  const totalPayable = roundMoney(netPremiumBeforeTax + gst);

  const fallbackNotice = !hasInsurerProfile
    ? " Note: Voluntary deductible discount unavailable as no specific insurer tariff profile was selected. Voluntary deductible discounts are strictly insurer-specific underwriter terms."
    : "";

  return {
    insuredDeclaredValueIDV: idv,
    insuredDeclaredValueIDVFormatted: `₹${idv.toLocaleString("en-IN")}`,
    appliedDepreciationPercent: depPct,
    noClaimBonusPercent: ncbPct,
    voluntaryDeductibleDiscount: deductibleDiscount,
    estimatedOwnDamagePremium: netOdPremium,
    statutoryThirdPartyTariffEstimate: tpTariff,
    statutoryThirdPartyPremium: tpTariff,
    gstAmount: gst,
    totalEstimatedPremiumPayable: totalPayable,
    insurerNameUsed,
    disclaimer: `Two-wheeler IDV and own damage premiums calculated per IRDAI schedules using profile '${insurerNameUsed}'.${fallbackNotice}`,
  };
}
