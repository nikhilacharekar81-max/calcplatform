import { roundMoney } from "../../../engines/financial-maths/index.ts";
import { indiaRuleRegistry } from "../../../rules/india/registry.ts";
import { IndiaInsuranceParameters } from "../../../rules/india/insurance/versions/2026.ts";

export interface TravelInsuranceInput {
  destinationRegion: "USA_CANADA" | "SCHENGEN_EUROPE" | "ASIA_EXCLUDING_JAPAN" | "WORLDWIDE";
  tripDurationDays: number;
  travelerAge: number;
  medicalCoverUsdThreshold?: number;
  includePreExistingConditionCover?: boolean;
}

export interface TravelInsuranceResult {
  recommendedMedicalSumInsuredUsd: number;
  recommendedMedicalSumInsuredUsdFormatted: string;
  estimatedTotalPremiumInr: number;
  estimatedTotalPremiumInrFormatted: string;
  gstAmountInr: number;
  riskFactorNotes: string;
}

/**
 * 8. Travel Insurance Calculator — Region & Duration Emergency Coverage Needs
 */
export function calculateTravelInsurance(input: TravelInsuranceInput): TravelInsuranceResult {
  const duration = Math.max(1, input.tripDurationDays);
  const age = Math.max(1, input.travelerAge);

  // Region Medical Coverage Benchmark in USD
  let baseUsdCover = 50000;
  let dailyRateInr = 90;

  switch (input.destinationRegion) {
    case "USA_CANADA":
      baseUsdCover = 250000; // High US healthcare costs
      dailyRateInr = 210;
      break;
    case "SCHENGEN_EUROPE":
      baseUsdCover = 100000; // Mandatory €30k Schengen minimum requirement
      dailyRateInr = 140;
      break;
    case "WORLDWIDE":
      baseUsdCover = 100000;
      dailyRateInr = 160;
      break;
    case "ASIA_EXCLUDING_JAPAN":
    default:
      baseUsdCover = 50000;
      dailyRateInr = 90;
      break;
  }

  // Senior traveler surcharge factor
  let ageLoadingFactor = 1.0;
  if (age >= 70) ageLoadingFactor = 2.5;
  else if (age >= 60) ageLoadingFactor = 1.8;
  else if (age >= 50) ageLoadingFactor = 1.3;

  if (input.includePreExistingConditionCover) {
    ageLoadingFactor *= 1.4;
  }

  const baseNetPremium = duration * dailyRateInr * ageLoadingFactor;

  // Retrieve statutory GST rate
  const rule = indiaRuleRegistry.resolveActiveVerified<IndiaInsuranceParameters>({
    domain: "INSURANCE",
    ruleId: "INSURANCE-INDIA-2026",
    version: "2026-01",
  });
  const gstRate = rule.parameters.gstRatesPercent.travelInsurance;
  const gst = roundMoney(baseNetPremium * (gstRate / 100));
  const totalInr = roundMoney(baseNetPremium + gst);

  // If caller specified a higher custom medical cover threshold, respect it
  const recommendedMedicalCover = input.medicalCoverUsdThreshold && input.medicalCoverUsdThreshold > baseUsdCover
    ? input.medicalCoverUsdThreshold
    : baseUsdCover;

  return {
    recommendedMedicalSumInsuredUsd: recommendedMedicalCover,
    recommendedMedicalSumInsuredUsdFormatted: `$${recommendedMedicalCover.toLocaleString("en-US")} USD`,
    estimatedTotalPremiumInr: totalInr,
    estimatedTotalPremiumInrFormatted: `₹${totalInr.toLocaleString("en-IN")}`,
    gstAmountInr: gst,
    riskFactorNotes: `Destination: ${input.destinationRegion.replaceAll("_", " ")}, Duration: ${duration} Days, Age Surcharge Factor: ${ageLoadingFactor.toFixed(1)}x`,
  };
}
