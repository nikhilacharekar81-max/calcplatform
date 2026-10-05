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
    thresholdAmount: 600000, // or ₹50,000/month for non-audit individual (194IB)
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
  '194IA_PROPERTY': {
    code: '194-IA',
    name: 'TDS on Sale of Immovable Property',
    category: 'Property',
    standardRate: 1,
    thresholdAmount: 5000000,
    thresholdType: 'single',
    thresholdDescription: '₹50,00,000 single transaction value',
    payeeTypes: ['Individual/HUF', 'Company/Firm', 'Any'],
    description: '1% TDS on consideration paid for transfer of immovable property (other than agricultural land) exceeding ₹50 Lakhs.',
    supportsForm15GH: false,
    supportsForm13: false,
  },
  '194C_CONTRACTOR': {
    code: '194C',
    name: 'Payments to Contractors & Sub-Contractors',
    category: 'Contracts & Work',
    standardRate: 1, // 1% for Ind/HUF, 2% for others
    nonIndividualRate: 2,
    thresholdAmount: 30000, // single invoice ₹30,000 or aggregate ₹1,00,000
    thresholdType: 'single',
    thresholdDescription: '₹30,000 single bill or ₹1,00,000 aggregate per year',
    payeeTypes: ['Individual/HUF', 'Company/Firm'],
    description: 'Carrying out any work (including advertising, broadcasting, catering, carriage of goods or passengers) pursuant to a contract.',
    supportsForm15GH: false,
    supportsForm13: true,
    notes: '1% if payee is Individual/HUF; 2% for Companies/LLPs/Partnership firms.',
  },
  '194H_COMMISSION': {
    code: '194H',
    name: 'Commission or Brokerage',
    category: 'Commission',
    standardRate: 2, // Concessional budget rate of 2%
    thresholdAmount: 20000,
    thresholdType: 'annual',
    thresholdDescription: '₹20,000 per financial year',
    payeeTypes: ['Individual/HUF', 'Company/Firm', 'Any'],
    description: 'Commission or brokerage fees for facilitating services in the course of buying or selling goods/properties.',
    supportsForm15GH: false,
    supportsForm13: true,
  },
  '194A_INTEREST': {
    code: '194A',
    name: 'Interest other than Interest on Securities (FD, NBFC, Loan)',
    category: 'Interest',
    standardRate: 10,
    thresholdAmount: 10000, // ₹10,000 regular, ₹1,00,000 senior citizen
    thresholdType: 'annual',
    thresholdDescription: '₹10,000 (regular) or ₹1,00,000 (Senior Citizen) for Banks/Co-op',
    payeeTypes: ['Individual/HUF', 'Company/Firm', 'Any'],
    description: 'Interest paid by banks, co-operative societies, or private firms on fixed deposits, recurring deposits, or unsecured loans.',
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
    description: 'Applicable to buyers whose gross business turnover exceeds ₹10 Crores in the preceding FY. TDS @ 0.1% applies strictly on the sum exceeding ₹50 Lakhs.',
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
    description: 'Value of any benefit, perk, gift, travel sponsorship, or dealer incentive provided in the course of business or profession.',
    supportsForm15GH: false,
    supportsForm13: true,
  },
  '194S_CRYPTO': {
    code: '194S',
    name: 'Payment on Transfer of Virtual Digital Assets (Crypto / NFT)',
    category: 'Digital Assets',
    standardRate: 1,
    thresholdAmount: 10000, // or ₹50,000 for specified persons
    thresholdType: 'annual',
    thresholdDescription: '₹10,000 (or ₹50,000 for specified individual buyers)',
    payeeTypes: ['Any'],
    description: 'TDS @ 1% on consideration paid to a resident on transfer of Virtual Digital Assets (crypto, tokens, NFTs).',
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
    description: 'TDS @ 10% on salary, remuneration, bonus, commission, or interest paid by partnership firms/LLPs to their partners.',
    supportsForm15GH: false,
    supportsForm13: true,
  },
  '194O_ECOMMERCE': {
    code: '194O',
    name: 'TDS on E-Commerce Operator Payments to Participants',
    category: 'E-Commerce',
    standardRate: 0.1, // Concessional 0.1%
    thresholdAmount: 500000,
    thresholdType: 'annual',
    thresholdDescription: '₹5,00,000 for Individual/HUF e-commerce sellers',
    payeeTypes: ['Individual/HUF', 'Company/Firm'],
    description: 'E-commerce platform operator deducting TDS on gross sales of goods or digital services facilitated through its marketplace.',
    supportsForm15GH: false,
    supportsForm13: true,
  },
};

export interface TdsInputState {
  sectionKey: string;
  payeeType: 'Individual/HUF' | 'Company/Firm';
  grossAmount: number;
  aggregatePaidTillDate: number;
  isPanFurnished: boolean;
  isSeniorCitizen: boolean; // Relevant for 194A
  isSpecifiedPerson?: boolean; // Relevant for 194S (below turnover threshold)
  isForm15Submitted: boolean; // 15G or 15H
  hasForm13Certificate: boolean; // Lower deduction certificate
  form13Rate: number; // percentage
  applySurchargeAndCess: boolean;
  surchargeRate: number; // e.g. 0, 10, 15
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
}

export const DEFAULT_TDS_INPUTS: TdsInputState = {
  sectionKey: '194J_PROF',
  payeeType: 'Individual/HUF',
  grossAmount: 75000,
  aggregatePaidTillDate: 0,
  isPanFurnished: true,
  isSeniorCitizen: false,
  isForm15Submitted: false,
  hasForm13Certificate: false,
  form13Rate: 1.5,
  applySurchargeAndCess: false,
  surchargeRate: 0,
};

export function calculateTds(inputs: TdsInputState): TdsCalculationResult {
  const section = TDS_SECTIONS[inputs.sectionKey] || TDS_SECTIONS['194J_PROF'];
  const notes: string[] = [];

  // Determine standard base rate
  let standardRate = section.standardRate;
  if (section.nonIndividualRate && inputs.payeeType === 'Company/Firm') {
    standardRate = section.nonIndividualRate;
  }

  // Determine Threshold Limit
  let thresholdLimit = section.thresholdAmount;
  if (section.code === '194A') {
    // Note: ₹1,00,000 limit only applies to Banks, Co-operatives, and Post Offices.
    // Private firms/NBFCs usually have lower limits (standard 10k/40k).
    // Our section key '194A_INTEREST' covers bank-like payers.
    if (inputs.isSeniorCitizen && inputs.sectionKey === '194A_INTEREST') {
      thresholdLimit = 100000; 
      notes.push('Senior Citizen threshold of ₹1,00,000 applied (applicable for Banks/Post Office).');
    }
  }

  if (section.code === '194S') {
    if (inputs.isSpecifiedPerson) {
      thresholdLimit = 50000;
      notes.push('Specified Person threshold of ₹50,000 applied (Individual/HUF below audit limits).');
    }
  }

  const totalCumulativeAmount = (inputs.aggregatePaidTillDate || 0) + (inputs.grossAmount || 0);

  // Evaluate threshold status
  let isThresholdCrossed = false;
  let taxableBaseAmount = inputs.grossAmount;

  if (section.code === '194Q') {
    // 194Q applies strictly on excess above ₹50 Lakhs
    if (totalCumulativeAmount > thresholdLimit) {
      isThresholdCrossed = true;
      const previousExcess = Math.max(0, (inputs.aggregatePaidTillDate || 0) - thresholdLimit);
      const totalExcess = totalCumulativeAmount - thresholdLimit;
      taxableBaseAmount = Math.max(0, totalExcess - previousExcess);
      notes.push(`Section 194Q applies only to the incremental amount exceeding ₹50,00,000.`);
    } else {
      isThresholdCrossed = false;
      taxableBaseAmount = 0;
    }
  } else if (section.code === '194C') {
    // Single bill > ₹30,000 or Aggregate > ₹1,00,000
    const singleThreshold = 30000;
    const aggregateThreshold = 100000;

    if (inputs.grossAmount > singleThreshold) {
      isThresholdCrossed = true;
      taxableBaseAmount = inputs.grossAmount;
      notes.push(`Single invoice threshold of ₹30,000 exceeded.`);
    } else if (totalCumulativeAmount > aggregateThreshold) {
      isThresholdCrossed = true;
      if ((inputs.aggregatePaidTillDate || 0) <= aggregateThreshold) {
        // First time crossing aggregate limit: tax the whole year's payments
        taxableBaseAmount = totalCumulativeAmount;
        notes.push(`Aggregate annual threshold of ₹1,00,000 exceeded. Catch-up TDS applied on total payments of ₹${totalCumulativeAmount.toLocaleString('en-IN')}.`);
      } else {
        taxableBaseAmount = inputs.grossAmount;
      }
    } else {
      isThresholdCrossed = false;
      taxableBaseAmount = 0;
    }
  } else {
    // Standard annual or single limit
    if (totalCumulativeAmount > thresholdLimit) {
      isThresholdCrossed = true;
      // If it's the first time crossing the threshold, the taxable base should be the 
      // entire cumulative amount (catch-up), provided previous payments were below threshold.
      // However, if previous payments were already above threshold (aggregatePaidTillDate > thresholdLimit),
      // then we only tax the current gross amount.
      if ((inputs.aggregatePaidTillDate || 0) <= thresholdLimit) {
        taxableBaseAmount = totalCumulativeAmount;
        notes.push(`Annual threshold of ₹${thresholdLimit.toLocaleString('en-IN')} crossed. TDS applied on total cumulative payment of ₹${totalCumulativeAmount.toLocaleString('en-IN')}.`);
      } else {
        taxableBaseAmount = inputs.grossAmount;
      }
    } else {
      isThresholdCrossed = false;
      taxableBaseAmount = 0;
    }
  }

  // Evaluate Form 15G / 15H Exemption
  let isExemptedViaForm15 = false;
  if (section.supportsForm15GH && inputs.isForm15Submitted) {
    isExemptedViaForm15 = true;
    notes.push('Valid Form 15G / 15H declared: 0% TDS applicable regardless of threshold.');
  }

  // Determine Effective Rate
  let effectiveRate = standardRate;
  let isMissingPanPenalty = false;
  let penaltyWarning: string | undefined = undefined;

  if (isExemptedViaForm15) {
    effectiveRate = 0;
  } else if (!inputs.isPanFurnished) {
    // Higher rate u/s 206AA: Higher of 20% or standard rate
    effectiveRate = Math.max(20, standardRate);
    isMissingPanPenalty = true;
    penaltyWarning = `Section 206AA Penalty: Missing PAN triggers higher penalty TDS rate of ${effectiveRate}%.`;
    notes.push(penaltyWarning);
  } else if (inputs.hasForm13Certificate && section.supportsForm13) {
    effectiveRate = Math.max(0, Number(inputs.form13Rate) || 0);
    notes.push(`Assessing Officer Lower Deduction Certificate (Form 13) rate of ${effectiveRate}% applied.`);
  }

  // Calculate Base TDS
  let baseTdsAmount = 0;
  if (isThresholdCrossed && !isExemptedViaForm15) {
    baseTdsAmount = (taxableBaseAmount * effectiveRate) / 100;
  }

  // Surcharge & Cess (if enabled)
  let surchargeAmount = 0;
  let cessAmount = 0;
  if (inputs.applySurchargeAndCess && baseTdsAmount > 0) {
    const surchargeRate = Math.max(0, Number(inputs.surchargeRate) || 0);
    surchargeAmount = (baseTdsAmount * surchargeRate) / 100;
    // Health & Education Cess is 4% on (Base TDS + Surcharge)
    cessAmount = ((baseTdsAmount + surchargeAmount) * 4) / 100;
  }

  const totalTdsDeductible = Math.round(baseTdsAmount + surchargeAmount + cessAmount);
  const netPayableToPayee = Math.max(0, inputs.grossAmount - totalTdsDeductible);

  // Status Badge
  let statusBadge: TdsCalculationResult['statusBadge'] = 'Deduction Applicable';
  if (isExemptedViaForm15) {
    statusBadge = 'Exempt (Form 15G/H)';
  } else if (!isThresholdCrossed) {
    statusBadge = 'Below Threshold (₹0 TDS)';
  } else if (inputs.hasForm13Certificate && section.supportsForm13) {
    statusBadge = 'Lower Rate (Form 13)';
  }

  return {
    section,
    grossAmount: inputs.grossAmount,
    taxableBaseAmount,
    isThresholdCrossed,
    isExemptedViaForm15,
    isMissingPanPenalty,
    baseTdsRate: standardRate,
    effectiveTdsRate: effectiveRate,
    baseTdsAmount: Math.round(baseTdsAmount),
    surchargeAmount: Math.round(surchargeAmount),
    cessAmount: Math.round(cessAmount),
    totalTdsDeductible,
    netPayableToPayee,
    thresholdLimitUsed: thresholdLimit,
    statusBadge,
    penaltyWarning,
    notes,
  };
}
