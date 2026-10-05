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

function calculateVoluntaryDeductibleDiscount(
  odPremium: number,
  deductibleRupees: number,
  discountSchedule?: Array<{ minDeductibleRupees: number; discountPercentOnOD: number; maxDiscountRupees: number }>
): number {
  if (deductibleRupees <= 0 || odPremium <= 0) return 0;
  
  if (discountSchedule && discountSchedule.length > 0) {
    const sorted = [...discountSchedule].sort((a, b) => b.minDeductibleRupees - a.minDeductibleRupees);
    for (const tier of sorted) {
      if (deductibleRupees >= tier.minDeductibleRupees) {
        const calculatedDiscount = odPremium * (tier.discountPercentOnOD / 100);
        return roundMoney(Math.min(calculatedDiscount, tier.maxDiscountRupees));
      }
    }
  }

  // Deductible is strictly a rupee amount; no percentage interpretation
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
  return 50; // Max depreciation for vehicles older than 60 months
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
  const deductibleSchedule = rule.parameters.motorVoluntaryDeductibleDiscountSchedule;

  // Determine IRDAI IDV Depreciation Percentage from Registry Schedule
  const depPct = getIdvDepreciationFromSchedule(ageMonths, rule.parameters.motorIdvDepreciationPercent);

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

  // Voluntary deductible lookup from registry motor tariff schedule (Rupees only)
  const deductibleDiscount = calculateVoluntaryDeductibleDiscount(
    odAfterNcb,
    input.voluntaryDeductible ?? 0,
    deductibleSchedule
  );
  const netOdPremium = roundMoney(Math.max(0, odAfterNcb - deductibleDiscount));

  // Statutory Third-Party Premium Estimate based on CC and vehicle age from Rule Registry
  const cc = input.engineCapacityCC ?? 1200;
  let tpTariff = 0;
  if (input.isNewVehicle || ageMonths === 0) {
    // 3-Year bundled TP policy for new private cars
    if (cc > 1500) tpTariff = tpTariffs.cars3YearBundled.above1500cc;
    else if (cc > 1000) tpTariff = tpTariffs.cars3YearBundled.from1000to1500cc;
    else tpTariff = tpTariffs.cars3YearBundled.under1000cc;
  } else {
    // 1-Year statutory annual TP policy
    if (cc > 1500) tpTariff = tpTariffs.carsAnnual.above1500cc;
    else if (cc > 1000) tpTariff = tpTariffs.carsAnnual.from1000to1500cc;
    else tpTariff = tpTariffs.carsAnnual.under1000cc;
  }

  // Electric Vehicle 15% TP discount per IRDAI statutory tariff notification
  if (input.isElectricVehicle) {
    const evDiscount = tpTariffs.electricVehicleTpDiscountPercent;
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
  const deductibleSchedule = rule.parameters.motorVoluntaryDeductibleDiscountSchedule;

  // Determine IRDAI IDV Depreciation Percentage from Registry Schedule
  const depPct = getIdvDepreciationFromSchedule(ageMonths, rule.parameters.motorIdvDepreciationPercent);
  const idv = roundMoney(exShowroom * (1 - depPct / 100));

  // Determine NCB Percentage (using completed claim-free years)
  const matchedNcb = ncbLadder.find((item) => item.claimFreeYears === completedNcbYears);
  const ncbPct = matchedNcb ? matchedNcb.ncbPercent : 0;

  let grossOdRate = 0.017;
  if (input.isElectricVehicle) grossOdRate = 0.014;

  const grossOd = idv * grossOdRate;
  const ncbDiscount = grossOd * (ncbPct / 100);
  const odAfterNcb = Math.max(0, grossOd - ncbDiscount);
  
  // Deductible discount from registry schedule
  const deductibleDiscount = calculateVoluntaryDeductibleDiscount(
    odAfterNcb,
    input.voluntaryDeductible ?? 0,
    deductibleSchedule
  );
  const netOd = roundMoney(Math.max(0, odAfterNcb - deductibleDiscount));

  const cc = input.engineCapacityCC ?? 125;
  let tpTariff = 0;
  if (input.isNewVehicle || ageMonths === 0) {
    // 5-Year bundled TP policy for new two-wheelers from registry
    if (cc > 350) tpTariff = tpTariffs.twoWheelers5YearBundled.above350cc;
    else if (cc > 150) tpTariff = tpTariffs.twoWheelers5YearBundled.from150to350cc;
    else if (cc > 75) tpTariff = tpTariffs.twoWheelers5YearBundled.from75to150cc;
    else tpTariff = tpTariffs.twoWheelers5YearBundled.under75cc;
  } else {
    // 1-Year annual TP tariff from registry
    if (cc > 350) tpTariff = tpTariffs.twoWheelersAnnual.above350cc;
    else if (cc > 150) tpTariff = tpTariffs.twoWheelersAnnual.from150to350cc;
    else if (cc > 75) tpTariff = tpTariffs.twoWheelersAnnual.from75to150cc;
    else tpTariff = tpTariffs.twoWheelersAnnual.under75cc;
  }

  // Electric Vehicle 15% TP discount per IRDAI statutory tariff notification
  if (input.isElectricVehicle) {
    const evDiscount = tpTariffs.electricVehicleTpDiscountPercent;
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

