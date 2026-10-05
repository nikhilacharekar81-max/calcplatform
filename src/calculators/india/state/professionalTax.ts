import Decimal from "decimal.js";
import { STATE_RULE_REGISTRY } from "../../../rules/india/states/index.ts";

export interface StateProfessionalTaxInput {
  stateCode: string; // e.g. "MH", "KA", "WB", "TS", "GJ", "TN"
  monthlySalary: number;
  month?: number; // 1 to 12 (2 for February)
  gender?: "male" | "female" | "other";
}

export interface StateProfessionalTaxResult {
  stateCode: string;
  stateName: string;
  monthlySalary: number;
  monthlyTax: number;
  annualTaxEstimated: number;
  isFemaleExempt: boolean;
  notes: string[];
}

export function calculateProfessionalTax(
  taxableSalary: string | Decimal | number,
  applicableTax: string | Decimal | number
) {
  const salary = new Decimal(taxableSalary);
  const tax = Decimal.min(Decimal.max(new Decimal(applicableTax), 0), salary);
  return {
    tax,
    netSalaryAfterProfessionalTax: salary.minus(tax),
  };
}

export function calculateStateProfessionalTax(input: StateProfessionalTaxInput): StateProfessionalTaxResult {
  const stateRule = STATE_RULE_REGISTRY[input.stateCode.toUpperCase()] || STATE_RULE_REGISTRY.MH;
  const salary = Math.max(0, input.monthlySalary);
  const month = input.month || new Date().getMonth() + 1; // 1-12
  const gender = input.gender || "male";

  const notes: string[] = [];
  let isFemaleExempt = false;
  let monthlyTax = 0;
  let annualTax = 0;

  if (input.stateCode.toUpperCase() === "MH") {
    // Maharashtra:
    // Men: Up to 7500: Nil, 7501-10000: 175/mo, >10000: 200/mo (300 in Feb = 2500/yr)
    // Women: Exempt up to ₹25,000/month; >25000: 200/mo (300 in Feb = 2500/yr)
    if (gender === "female" && salary <= 25000) {
      isFemaleExempt = true;
      monthlyTax = 0;
      annualTax = 0;
      notes.push("Women earning up to ₹25,000/month are completely exempt from Maharashtra Professional Tax.");
    } else if (salary > 10000) {
      monthlyTax = month === 2 ? 300 : 200;
      annualTax = 200 * 11 + 300; // ₹2,500
    } else if (salary > 7500) {
      monthlyTax = 175;
      annualTax = 175 * 12; // ₹2,100
    } else {
      monthlyTax = 0;
      annualTax = 0;
    }
  } else if (input.stateCode.toUpperCase() === "KA") {
    // Karnataka:
    // >= 15000: ₹200/mo, ₹300 in Feb = ₹2,500/yr
    if (salary >= 15000) {
      monthlyTax = month === 2 ? 300 : 200;
      annualTax = 200 * 11 + 300; // ₹2,500
    } else {
      monthlyTax = 0;
      annualTax = 0;
    }
  } else if (input.stateCode.toUpperCase() === "DL") {
    // Delhi: No professional tax levied
    monthlyTax = 0;
    annualTax = 0;
    notes.push("No Professional Tax is levied in the National Capital Territory of Delhi.");
  } else {
    // Standard tier check from schedule if available
    const schedule = stateRule.parameters.professionalTaxSchedule;
    if (schedule && schedule.length > 0) {
      for (const tier of schedule) {
        if (salary > tier.monthlySalaryAbove) {
          if (gender === "female" && tier.femaleExemptionThreshold && salary <= tier.femaleExemptionThreshold) {
            isFemaleExempt = true;
            monthlyTax = 0;
          } else {
            monthlyTax = (month === 2 && tier.specialMonthTax) ? tier.specialMonthTax.tax : tier.monthlyTax;
          }
        }
      }
      annualTax = monthlyTax * 12;
    }
  }

  return {
    stateCode: stateRule.parameters.stateCode,
    stateName: stateRule.parameters.stateName,
    monthlySalary: salary,
    monthlyTax,
    annualTaxEstimated: annualTax,
    isFemaleExempt,
    notes,
  };
}

