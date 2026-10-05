import { isMonetaryExceeded, isMonetaryLessOrEqual } from "../engines/financial-maths/index.ts";

export interface TdsSectionDefinition {
  code: string;
  name: string;
  category: string;
  standardRate: number; // percentage, e.g. 10 for 10%
  nonIndividualRate?: number;
  thresholdAmount: number;
  thresholdType: 'annual' | 'single' | 'monthly' | 'cumulative_excess';
  thresholdDescription: string;
  payeeTypes: Array<'Individual/HUF' | 'Company/Firm' | 'Any'>;
  description: string;
  supportsForm15GH: boolean;
  supportsForm13: boolean;
  notes?: string;
}

export const TDS_SECTIONS: Record<string, TdsSectionDefinition> = {
  '194J_PROF': {
    code: '194J',
    name: 'Professional Fees (Medical, Legal, Technical, etc.)',
    category: 'Professional & Technical',
    standardRate: 10,
    thresholdAmount: 50000,
    thresholdType: 'annual',
    thresholdDescription: '₹50,000 per financial year',
    payeeTypes: ['Individual/HUF', 'Company/Firm', 'Any'],
    description: 'Fees for professional services like medical, legal, engineering, architectural, accountancy, or interior decoration.',
    supportsForm15GH: false,
    supportsForm13: true,
  },
  '194J_TECH': {
    code: '194J',
    name: 'Technical Services Fees / Call Center Operations',
    category: 'Professional & Technical',
    standardRate: 2,
    thresholdAmount: 50000,
    thresholdType: 'annual',
    thresholdDescription: '₹50,000 per financial year',
    payeeTypes: ['Individual/HUF', 'Company/Firm', 'Any'],
    description: 'Fees for technical services or operation of call centers taxed at a concessional rate of 2%.',
    supportsForm15GH: false,
    supportsForm13: true,
  },
  '194I_BUILDING': {
    code: '194I',
    name: 'Rent on Land, Building, or Furniture',
    category: 'Rent',
    standardRate: 10,
    thresholdAmount: 600000,
    thresholdType: 'annual',
    thresholdDescription: '₹6,00,000 per financial year (or ₹50,000/month under 194-IB)',
    payeeTypes: ['Individual/HUF', 'Company/Firm', 'Any'],
    description: 'Rent paid for use of land, commercial or residential building, or factory building including furniture and fittings.',
    supportsForm15GH: false,
    supportsForm13: true,
  },
  '194I_PLANT': {
    code: '194I',
    name: 'Rent on Plant, Machinery, or Equipment',
    category: 'Rent',
    standardRate: 2,
    thresholdAmount: 600000,
    thresholdType: 'annual',
    thresholdDescription: '₹6,00,000 per financial year',
    payeeTypes: ['Individual/HUF', 'Company/Firm', 'Any'],
    description: 'Rent paid for the lease or hire of plant, machinery, heavy equipment, or commercial vehicles.',
    supportsForm15GH: false,
    supportsForm13: true,
  },
  '194C_CONTRACTOR': {
    code: '194C',
    name: 'Payments to Contractors & Sub-Contractors',
    category: 'Contracts & Work',
    standardRate: 1,
    nonIndividualRate: 2,
    thresholdAmount: 30000,
    thresholdType: 'single',
    thresholdDescription: '₹30,000 single bill or ₹1,00,000 aggregate per year',
    payeeTypes: ['Individual/HUF', 'Company/Firm'],
    description: 'Carrying out any work pursuant to a contract.',
    supportsForm15GH: false,
    supportsForm13: true,
    notes: '1% if payee is Individual/HUF; 2% for Companies/LLPs/Partnership firms.',
  },
  '194H_COMMISSION': {
    code: '194H',
    name: 'Commission or Brokerage',
    category: 'Commission',
    standardRate: 2,
    thresholdAmount: 20000,
    thresholdType: 'annual',
    thresholdDescription: '₹20,000 per financial year',
    payeeTypes: ['Individual/HUF', 'Company/Firm', 'Any'],
    description: 'Commission or brokerage fees for facilitating services.',
    supportsForm15GH: false,
    supportsForm13: true,
  },
  '194A_INTEREST': {
    code: '194A',
    name: 'Interest other than Interest on Securities (FD, NBFC, Loan)',
    category: 'Interest',
    standardRate: 10,
    thresholdAmount: 10000,
    thresholdType: 'annual',
    thresholdDescription: '₹10,000 (regular) or ₹1,00,000 (Senior Citizen) for Banks/Co-op',
    payeeTypes: ['Individual/HUF', 'Company/Firm', 'Any'],
    description: 'Interest paid by banks, co-operative societies, or private firms.',
    supportsForm15GH: true,
    supportsForm13: true,
  },
  '194Q_PURCHASE': {
    code: '194Q',
    name: 'TDS on Purchase of Goods (> ₹50 Lakhs)',
    category: 'Purchase of Goods',
    standardRate: 0.1,
    thresholdAmount: 5000000,
    thresholdType: 'cumulative_excess',
    thresholdDescription: '₹50,00,000 aggregate purchase during the financial year',
    payeeTypes: ['Any'],
    description: 'Applicable to buyers whose gross business turnover exceeds ₹10 Crores.',
    supportsForm15GH: false,
    supportsForm13: true,
  },
  '194R_PERQUISITES': {
    code: '194R',
    name: 'Benefit or Perquisite arising from Business / Profession',
    category: 'Benefits & Perks',
    standardRate: 10,
    thresholdAmount: 20000,
    thresholdType: 'annual',
    thresholdDescription: '₹20,000 aggregate value per financial year',
    payeeTypes: ['Individual/HUF', 'Company/Firm', 'Any'],
    description: 'Value of any benefit, perk, gift, or travel sponsorship.',
    supportsForm15GH: false,
    supportsForm13: true,
  },
  '194S_CRYPTO': {
    code: '194S',
    name: 'Payment on Transfer of Virtual Digital Assets (Crypto / NFT)',
    category: 'Digital Assets',
    standardRate: 1,
    thresholdAmount: 10000,
    thresholdType: 'annual',
    thresholdDescription: '₹10,000 (or ₹50,000 for specified individual buyers)',
    payeeTypes: ['Any'],
    description: 'TDS @ 1% on consideration paid on transfer of VDAs.',
    supportsForm15GH: false,
    supportsForm13: false,
  },
  '194T_PARTNER': {
    code: '194T',
    name: 'Payment of Salary / Remuneration / Interest to Partners',
    category: 'Partnership',
    standardRate: 10,
    thresholdAmount: 20000,
    thresholdType: 'annual',
    thresholdDescription: '₹20,000 per financial year',
    payeeTypes: ['Individual/HUF'],
    description: 'TDS @ 10% on salary, remuneration, or interest paid to partners.',
    supportsForm15GH: false,
    supportsForm13: true,
  },
  '194O_ECOMMERCE': {
    code: '194O',
    name: 'TDS on E-Commerce Operator Payments to Participants',
    category: 'E-Commerce',
    standardRate: 0.1,
    thresholdAmount: 500000,
    thresholdType: 'annual',
    thresholdDescription: '₹5,00,000 for Individual/HUF e-commerce sellers',
    payeeTypes: ['Individual/HUF', 'Company/Firm'],
    description: 'E-commerce platform operator deducting TDS on gross sales.',
    supportsForm15GH: false,
    supportsForm13: true,
  },
};

export interface TdsTransaction {
  amount: number;
  creditDate?: string;
  paymentDate?: string;
  transactionDate?: string;
}

export interface TdsInputState {
  sectionKey: string;
  payeeType: 'Individual/HUF' | 'Company/Firm';
  payerType?: 'bank_post_office' | 'other_payer';
  grossAmount: number;
  isPanFurnished: boolean;
  isSeniorCitizen: boolean;
  isForm15Submitted: boolean;
  hasForm13Certificate: boolean;
  form13Rate: number;
  applySurchargeAndCess: boolean;
  surchargeRate: number;
  
  // Explicit Current Transaction timing fields for ledger evaluation & statutory trigger
  currentTransactionDate?: string;
  transactionDate?: string;
  creditDate?: string;
  paymentDate?: string;

  // Primary historical ledger model supporting creditDate, paymentDate, chronological sorting, and FY grouping
  historicalPayments?: TdsTransaction[];
}

export interface TdsCalculationResult {
  section: TdsSectionDefinition;
  grossAmount: number;
  taxableBaseAmount: number;
  isThresholdCrossed: boolean;
  isExemptedViaForm15: boolean;
  isMissingPanPenalty: boolean;
  baseTdsRate: number;
  effectiveTdsRate: number;
  baseTdsAmount: number;
  surchargeAmount: number;
  cessAmount: number;
  totalTdsDeductible: number;
  netPayableToPayee: number;
  thresholdLimitUsed: number;
  statusBadge: 'Deduction Applicable' | 'Below Threshold (₹0 TDS)' | 'Exempt (Form 15G/H)' | 'Lower Rate (Form 13)';
  penaltyWarning?: string;
  notes: string[];
  evaluatedFinancialYear: string;
  statutoryTriggerDate: string;
}

export const DEFAULT_TDS_INPUTS: TdsInputState = {
  sectionKey: '194J_PROF',
  payeeType: 'Individual/HUF',
  payerType: 'bank_post_office',
  grossAmount: 75000,
  isPanFurnished: true,
  isSeniorCitizen: false,
  isForm15Submitted: false,
  hasForm13Certificate: false,
  form13Rate: 1.5,
  applySurchargeAndCess: false,
  surchargeRate: 0,
  historicalPayments: [],
};

export function getFinancialYear(dateStr: string): string {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "FY 2026-27";
  const year = d.getFullYear();
  const month = d.getMonth(); // 3 = April (0-indexed)
  if (month >= 3) {
    return `FY ${year}-${(year + 1).toString().slice(-2)}`;
  } else {
    return `FY ${year - 1}-${year.toString().slice(-2)}`;
  }
}

/**
 * Determine statutory trigger date: Earlier of credit or payment date per IT Act Section 194.
 */
export function resolveStatutoryTriggerDate(tx: { creditDate?: string; paymentDate?: string; transactionDate?: string; currentTransactionDate?: string }): {
  dateStr: string;
  timestamp: number;
} {
  const creditTime = tx.creditDate ? new Date(tx.creditDate).getTime() : NaN;
  const paymentTime = tx.paymentDate ? new Date(tx.paymentDate).getTime() : NaN;
  const txTime = (tx.currentTransactionDate || tx.transactionDate) ? new Date(tx.currentTransactionDate || tx.transactionDate!).getTime() : NaN;

  const validEntries = [
    { time: creditTime, dateStr: tx.creditDate! },
    { time: paymentTime, dateStr: tx.paymentDate! },
    { time: txTime, dateStr: (tx.currentTransactionDate || tx.transactionDate)! },
  ].filter(item => !isNaN(item.time));

  if (validEntries.length > 0) {
    validEntries.sort((a, b) => a.time - b.time); // Statutory Rule: Earlier of credit date or payment date
    return { dateStr: validEntries[0].dateStr, timestamp: validEntries[0].time };
  }

  const defaultStr = new Date().toISOString();
  return { dateStr: defaultStr, timestamp: new Date(defaultStr).getTime() };
}

export function calculateTds(inputs: TdsInputState): TdsCalculationResult {
  const section = TDS_SECTIONS[inputs.sectionKey] || TDS_SECTIONS['194J_PROF'];
  const notes: string[] = [];

  let standardRate = section.standardRate;
  if (section.nonIndividualRate && inputs.payeeType === 'Company/Firm') {
    standardRate = section.nonIndividualRate;
  }

  let thresholdLimit = section.thresholdAmount;
  if (section.code === '194A') {
    const isBankOrPostOffice = inputs.payerType === undefined || inputs.payerType === 'bank_post_office';
    if (inputs.isSeniorCitizen && isBankOrPostOffice && inputs.sectionKey === '194A_INTEREST') {
      thresholdLimit = 100000;
      notes.push('Senior Citizen threshold of ₹1,00,000 applied (Banks/Post Office).');
    } else if (inputs.isSeniorCitizen && !isBankOrPostOffice) {
      thresholdLimit = 10000;
      notes.push('Standard non-bank threshold of ₹10,000 applied for other payers.');
    }
  }

  // Resolve statutory trigger date & target FY for the current transaction
  const currentTrigger = resolveStatutoryTriggerDate(inputs);
  const evaluatedFinancialYear = getFinancialYear(currentTrigger.dateStr);

  // Determine prior cumulative aggregate paid in target FY strictly from the transaction ledger
  let aggregatePaid = 0;
  if (inputs.historicalPayments && inputs.historicalPayments.length > 0) {
    // Ledger model: chronologically sort historical payments by statutory trigger date
    const sortedTx = [...inputs.historicalPayments].sort((a, b) => {
      return resolveStatutoryTriggerDate(a).timestamp - resolveStatutoryTriggerDate(b).timestamp;
    });

    // Group cumulative payments by Financial Year
    const fyMap = new Map<string, number>();
    sortedTx.forEach(tx => {
      const trigger = resolveStatutoryTriggerDate(tx);
      const fy = getFinancialYear(trigger.dateStr);
      const current = fyMap.get(fy) || 0;
      fyMap.set(fy, current + (tx.amount || 0));
    });

    aggregatePaid = fyMap.get(evaluatedFinancialYear) || 0;
    notes.push(`Transaction ledger evaluated for ${evaluatedFinancialYear} using statutory trigger date (${currentTrigger.dateStr}). Prior FY cumulative sum: ₹${aggregatePaid.toLocaleString('en-IN')}`);
  } else {
    notes.push(`Transaction ledger evaluated for ${evaluatedFinancialYear} (Trigger: ${currentTrigger.dateStr}). Prior FY cumulative sum: ₹0`);
  }

  const totalCumulativeAmount = aggregatePaid + (inputs.grossAmount || 0);

  let isThresholdCrossed = false;
  let taxableBaseAmount = inputs.grossAmount;

  if (section.code === '194Q') {
    if (isMonetaryExceeded(totalCumulativeAmount, thresholdLimit)) {
      isThresholdCrossed = true;
      const previousExcess = Math.max(0, aggregatePaid - thresholdLimit);
      const totalExcess = totalCumulativeAmount - thresholdLimit;
      taxableBaseAmount = Math.max(0, totalExcess - previousExcess);
      notes.push(`Section 194Q applies to incremental amount exceeding ₹50,00,000.`);
    } else {
      isThresholdCrossed = false;
      taxableBaseAmount = 0;
    }
  } else if (section.code === '194C') {
    const singleThreshold = 30000;
    const aggregateThreshold = 100000;
    if (isMonetaryExceeded(inputs.grossAmount, singleThreshold)) {
      isThresholdCrossed = true;
      taxableBaseAmount = inputs.grossAmount;
      notes.push(`Single invoice threshold of ₹30,000 exceeded.`);
    } else if (isMonetaryExceeded(totalCumulativeAmount, aggregateThreshold)) {
      isThresholdCrossed = true;
      if (isMonetaryLessOrEqual(aggregatePaid, aggregateThreshold)) {
        taxableBaseAmount = totalCumulativeAmount;
        notes.push(`Aggregate annual threshold of ₹1,00,000 exceeded. Catch-up TDS applied.`);
      } else {
        taxableBaseAmount = inputs.grossAmount;
      }
    } else {
      isThresholdCrossed = false;
      taxableBaseAmount = 0;
    }
  } else {
    if (isMonetaryExceeded(totalCumulativeAmount, thresholdLimit)) {
      isThresholdCrossed = true;
      if (isMonetaryLessOrEqual(aggregatePaid, thresholdLimit)) {
        taxableBaseAmount = totalCumulativeAmount;
        notes.push(`Annual threshold crossed. Catch-up TDS applied on cumulative sum.`);
      } else {
        taxableBaseAmount = inputs.grossAmount;
      }
    } else {
      isThresholdCrossed = false;
      taxableBaseAmount = 0;
    }
  }

  let isExemptedViaForm15 = false;
  if (section.supportsForm15GH && inputs.isForm15Submitted) {
    isExemptedViaForm15 = true;
    notes.push('Valid Form 15G / 15H declared: 0% TDS applicable.');
  }

  let isMissingPanPenalty = false;
  let effectiveTdsRate = standardRate;

  if (inputs.hasForm13Certificate && !isExemptedViaForm15) {
    effectiveTdsRate = Math.max(0, inputs.form13Rate);
    notes.push(`Section 197 Form 13 Lower Deduction Certificate rate of ${effectiveTdsRate}% applied.`);
  }

  if (!inputs.isPanFurnished && !isExemptedViaForm15) {
    isMissingPanPenalty = true;
    effectiveTdsRate = Math.max(20, standardRate);
    notes.push('Section 206AA Penalty applied: PAN not furnished. Higher of 20% or statutory rate enforced.');
  }

  const baseTdsAmount = isThresholdCrossed && !isExemptedViaForm15
    ? Math.round((taxableBaseAmount * (effectiveTdsRate / 100)) * 100) / 100
    : 0;

  let surchargeAmount = 0;
  let cessAmount = 0;
  if (inputs.applySurchargeAndCess && baseTdsAmount > 0) {
    surchargeAmount = Math.round((baseTdsAmount * (inputs.surchargeRate / 100)) * 100) / 100;
    cessAmount = Math.round(((baseTdsAmount + surchargeAmount) * 0.04) * 100) / 100;
  }

  const totalTdsDeductible = Math.round((baseTdsAmount + surchargeAmount + cessAmount) * 100) / 100;
  const netPayableToPayee = Math.round((inputs.grossAmount - totalTdsDeductible) * 100) / 100;

  let statusBadge: 'Deduction Applicable' | 'Below Threshold (₹0 TDS)' | 'Exempt (Form 15G/H)' | 'Lower Rate (Form 13)';
  if (isExemptedViaForm15) {
    statusBadge = 'Exempt (Form 15G/H)';
  } else if (!isThresholdCrossed) {
    statusBadge = 'Below Threshold (₹0 TDS)';
  } else if (inputs.hasForm13Certificate) {
    statusBadge = 'Lower Rate (Form 13)';
  } else {
    statusBadge = 'Deduction Applicable';
  }

  return {
    section,
    grossAmount: inputs.grossAmount,
    taxableBaseAmount,
    isThresholdCrossed,
    isExemptedViaForm15,
    isMissingPanPenalty,
    baseTdsRate: standardRate,
    effectiveTdsRate,
    baseTdsAmount,
    surchargeAmount,
    cessAmount,
    totalTdsDeductible,
    netPayableToPayee,
    thresholdLimitUsed: thresholdLimit,
    statusBadge,
    penaltyWarning: isMissingPanPenalty ? 'Section 206AA Penalty Active: Higher of 20% or statutory rate applied due to missing PAN.' : undefined,
    notes,
    evaluatedFinancialYear,
    statutoryTriggerDate: currentTrigger.dateStr,
  };
}
