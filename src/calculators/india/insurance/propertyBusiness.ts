import { roundMoney } from "../../../engines/financial-maths/index.ts";
import { indiaRuleRegistry } from "../../../rules/india/registry.ts";
import { IndiaInsuranceParameters } from "../../../rules/india/insurance/versions/2026.ts";

export interface HomeInsuranceInput {
  builtUpAreaSqFt: number;
  constructionCostPerSqFt?: number; // Default ₹2,500/sq.ft for metro construction
  contentsValuationToday?: number;
  includeJewelryAddon?: boolean;
  jewelryValuation?: number;
}

export interface HomeInsuranceResult {
  structureReconstructionSumInsured: number;
  contentsValuationSumInsured: number;
  totalHomeInsuranceSumInsured: number;
  totalHomeInsuranceSumInsuredFormatted: string;
  estimatedAnnualPremiumInr: number;
}

/**
 * 11. Home Insurance Calculator — Structure Reconstruction & Contents Sizing
 */
export function calculateHomeInsurance(input: HomeInsuranceInput): HomeInsuranceResult {
  const sqFt = Math.max(100, input.builtUpAreaSqFt);
  const costPerSqFt = input.constructionCostPerSqFt || 2500;
  const contents = Math.max(0, input.contentsValuationToday || 0);

  const structureSumInsured = sqFt * costPerSqFt;
  const jewelry = input.includeJewelryAddon ? Math.max(0, input.jewelryValuation || 0) : 0;
  const totalContents = contents + jewelry;

  const totalSumInsured = structureSumInsured + totalContents;

  // Retrieve statutory GST rate from India Rule Registry
  const rule = indiaRuleRegistry.resolveActiveVerified<IndiaInsuranceParameters>({
    domain: "INSURANCE",
    ruleId: "INSURANCE-INDIA-2026",
    version: "2026-01",
  });
  const gstRate = rule.parameters.gstRatesPercent.propertyInsurance;

  // Bharat Griha Raksha standard rate estimate (~₹50 per ₹1 Lakh sum insured)
  const baseRate = 0.0005;
  const netPremium = totalSumInsured * baseRate;
  const gst = netPremium * (gstRate / 100);
  const totalPremium = roundMoney(netPremium + gst);

  return {
    structureReconstructionSumInsured: roundMoney(structureSumInsured),
    contentsValuationSumInsured: roundMoney(totalContents),
    totalHomeInsuranceSumInsured: totalSumInsured,
    totalHomeInsuranceSumInsuredFormatted: `₹${(totalSumInsured / 100000).toFixed(2)} Lakh`,
    estimatedAnnualPremiumInr: totalPremium,
  };
}

export interface BusinessInsuranceInput {
  buildingReconstructionValue: number;
  plantMachineryStockValue: number;
  annualGrossProfit: number;
  indemnityPeriodMonths?: number; // Standard 12-month business interruption indemnity
}

export interface BusinessInsuranceResult {
  propertyMaterialDamageSumInsured: number;
  businessInterruptionGrossProfitSumInsured: number;
  totalBusinessInsuranceSumInsured: number;
  totalBusinessInsuranceSumInsuredFormatted: string;
}

/**
 * 12. Business Insurance Calculator — Asset Reinstatement & Business Interruption Sizing
 */
export function calculateBusinessInsurance(input: BusinessInsuranceInput): BusinessInsuranceResult {
  const building = Math.max(0, input.buildingReconstructionValue);
  const machinery = Math.max(0, input.plantMachineryStockValue);
  const grossProfit = Math.max(0, input.annualGrossProfit);
  const indemnityMonths = Math.min(36, Math.max(3, input.indemnityPeriodMonths || 12));

  const propertyAssetsSumInsured = building + machinery;
  const businessInterruptionSumInsured = (grossProfit * indemnityMonths) / 12;

  const totalSumInsured = propertyAssetsSumInsured + businessInterruptionSumInsured;

  return {
    propertyMaterialDamageSumInsured: roundMoney(propertyAssetsSumInsured),
    businessInterruptionGrossProfitSumInsured: roundMoney(businessInterruptionSumInsured),
    totalBusinessInsuranceSumInsured: totalSumInsured,
    totalBusinessInsuranceSumInsuredFormatted: `₹${(totalSumInsured / 100000).toFixed(2)} Lakh`,
  };
}
