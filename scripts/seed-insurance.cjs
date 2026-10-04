const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, '../data/db.json');

if (!fs.existsSync(DB_FILE)) {
  console.error('Database file not found!');
  process.exit(1);
}

const db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));

// 1. Check/Add Category
const catId = 'cat_1791092573880_j3of9';
let insuranceCategory = db.categories.find(c => c.id === catId);
if (!insuranceCategory) {
  insuranceCategory = {
    id: catId,
    name: 'Insurance Calculators',
    slug: 'insurance-calculators',
    description: 'Calculate coverage requirements, optimal premium estimates, statutory tax deductions under Sec 80D, and asset IDV values with absolute precision.',
    seoTitle: 'Insurance Calculators — Sizing, Premium Estimates & Tax Savings',
    seoDescription: 'Accurately size your life, health, motor, travel, and personal accident covers with India-specific tax and depreciation rules.',
    seoKeywords: 'insurance calculators, health insurance premium, term insurance sizing, motor idv, bike insurance premium, travel medical coverage',
    order: 3,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  db.categories.push(insuranceCategory);
}

// 2. Define Subcategories
const subcategories = [
  {
    id: 'sub_ins_life',
    name: 'Life Insurance',
    slug: 'life-insurance',
    description: 'Determine comprehensive term protection gaps, human life valuation (HLV), and family financial longevity sizing.',
    categoryId: catId,
    order: 1,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'sub_ins_health',
    name: 'Health Insurance',
    slug: 'health-insurance',
    description: 'Calculate medical inflation-adjusted sum insured needs, Section 80D tax deductions, and floater adequacy.',
    categoryId: catId,
    order: 2,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'sub_ins_vehicle',
    name: 'Vehicle Insurance',
    slug: 'vehicle-insurance',
    description: 'Estimate motor Insured Declared Value (IDV), depreciation schedules, and NCB discounts.',
    categoryId: catId,
    order: 3,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'sub_ins_travel',
    name: 'Travel Insurance',
    slug: 'travel-insurance',
    description: 'Check international medical cover requirements, hazard ratios, and duration-aware premium sizing.',
    categoryId: catId,
    order: 4,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'sub_ins_protection',
    name: 'Personal Protection',
    slug: 'personal-protection',
    description: 'Sizing tool for accidental death, temporary or permanent disability income, and critical illness treatments.',
    categoryId: catId,
    order: 5,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'sub_ins_property_business',
    name: 'Property & Business Insurance',
    slug: 'property-business-insurance',
    description: 'Assess structure reconstruction values, contents, material damage, and business interruption margins.',
    categoryId: catId,
    order: 6,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

subcategories.forEach(sub => {
  const existing = db.subcategories.find(s => s.id === sub.id || (s.slug === sub.slug && s.categoryId === catId));
  if (!existing) {
    db.subcategories.push(sub);
  } else {
    // Update existing properties
    Object.assign(existing, sub);
  }
});

// Helper for default modules
const createDefaultModules = (calcSlug) => [
  {
    id: `mod_${calcSlug}_inputs`,
    moduleId: 'calculator-inputs',
    name: 'Interactive Inputs & Controls',
    isEnabled: true,
    order: 1,
    settings: {
      title: 'Coverage & Risk Inputs',
      layout: 'grid_2_col',
      showResetButton: true
    }
  },
  {
    id: `mod_${calcSlug}_results`,
    moduleId: 'result-cards',
    name: 'Results & Sizing Summary',
    isEnabled: true,
    order: 2,
    settings: {
      title: 'Recommended Sizing & Key Benefits',
      highlightCardStyle: 'hero_primary',
      showShareActions: true
    }
  },
  {
    id: `mod_${calcSlug}_chart`,
    moduleId: 'chart-visualizer',
    name: 'Visual Distribution & Projections',
    isEnabled: true,
    order: 3,
    settings: {
      chartType: 'donut',
      chartTitle: 'Recommended Coverage Split',
      showLegend: true
    }
  },
  {
    id: `mod_${calcSlug}_faqs`,
    moduleId: 'faq-accordion',
    name: 'Frequently Asked Questions (FAQs)',
    isEnabled: true,
    order: 4,
    settings: {
      title: 'Statutory & Planning FAQs'
    }
  }
];

// 3. Define the 12 Calculators
const calculators = [
  // LIFE INSURANCE
  {
    id: 'calc_term_life_insurance',
    name: 'Term Insurance Calculator',
    slug: 'term-insurance-calculator',
    subcategoryId: 'sub_ins_life',
    categoryId: catId,
    shortDescription: 'Saves tax under Sec 80C, checks Sec 10(10D) compliance, and evaluates optimal sum assured needs based on outstanding debts and income multiple methodology with 0% GST.',
    seoTitle: 'Term Life Insurance Calculator — Tax-Free Sizing Tool',
    seoDescription: 'Calculate optimal term insurance requirements based on outstanding liabilities, savings, and income multiples with 0% GST and Section 10(10D) verification.',
    seoKeywords: 'term insurance calculator, life cover sizing, 80c tax benefit, 10 10d eligibility, 0 gst life policy',
    isActive: true,
    isFeatured: true,
    isPopular: true,
    viewsCount: 15,
    fields: [
      { id: 'annualIncome', label: 'Annual Income (₹)', type: 'number', defaultValue: 1200000, min: 100000, max: 100000000, step: 50000, prefix: '₹' },
      { id: 'currentAge', label: 'Current Age', type: 'slider', defaultValue: 30, min: 18, max: 65, step: 1, suffix: 'yrs' },
      { id: 'retirementAge', label: 'Retirement Age', type: 'slider', defaultValue: 60, min: 25, max: 75, step: 1, suffix: 'yrs' },
      { id: 'outstandingDebts', label: 'Outstanding Debts (₹)', type: 'number', defaultValue: 2000000, min: 0, max: 500000000, step: 50000, prefix: '₹' },
      { id: 'existingLifeCover', label: 'Existing Life Cover (₹)', type: 'number', defaultValue: 1000000, min: 0, max: 200000000, step: 50000, prefix: '₹' },
      { id: 'existingSavings', label: 'Existing Savings & Assets (₹)', type: 'number', defaultValue: 500000, min: 0, max: 200000000, step: 50000, prefix: '₹' },
      { id: 'incomeMultipleYears', label: 'Income Multiple Sizing (Years)', type: 'slider', defaultValue: 15, min: 5, max: 30, step: 1, suffix: 'yrs' },
      { id: 'estimatedAnnualPremium', label: 'Estimated Annual Premium (₹)', type: 'number', defaultValue: 15000, min: 1000, max: 500000, step: 500, prefix: '₹' },
      { id: 'isGroupPolicy', label: 'Group Policy? (18% GST applies)', type: 'checkbox', defaultValue: false }
    ],
    outputs: [
      { id: 'recommendedSumAssured', label: 'Recommended Sum Assured', formula: 'recommendedSumAssured', format: 'currency_inr', highlight: true },
      { id: 'netProtectionGap', label: 'Net Protection Gap', formula: 'netProtectionGap', format: 'currency_inr' },
      { id: 'applicableGstPercent', label: 'Applicable GST Rate (%)', formula: 'applicableGstPercent', format: 'percent' },
      { id: 'section80cTaxBenefit', label: 'Sec 80C Deduction Limit', formula: 'section80cTaxBenefit', format: 'currency_inr' }
    ],
    faqs: [
      { id: 'faq_term_gst', question: 'Are individual term insurance policies exempt from GST in India?', answer: '<p>Yes. Effective post September 22, 2025, individual life insurance policies are exempt from GST (0% rate). Group life plans remain subject to the standard 18% GST.</p>', isEnabled: true, order: 1 },
      { id: 'faq_term_10d', question: 'How does Section 10(10D) affect term insurance proceeds?', answer: '<p>Under Section 10(10D) of the Income Tax Act, maturity or death benefit proceeds of a life insurance policy are tax-free only if the annual premium in any year does not exceed 10% of the sum assured. For term plans, the premium is typically under 1% of the sum assured, making them fully tax-exempt.</p>', isEnabled: true, order: 2 }
    ]
  },
  {
    id: 'calc_life_needs_calculator',
    name: 'Life Insurance Needs Calculator',
    slug: 'life-insurance-needs-calculator',
    subcategoryId: 'sub_ins_life',
    categoryId: catId,
    shortDescription: 'Calculate your true life insurance needs by discounting future family living expenses and mapping children education and marriage goals.',
    seoTitle: 'Life Insurance Needs Calculator — Goal-Based Cover Sizing',
    seoDescription: 'Find your net life cover needs using a comprehensive goal-discounting approach, factoring in inflation, family support, and liabilities.',
    seoKeywords: 'life needs calculator, financial goal protection, family protection planning, child education protection, inflation adjusted life insurance',
    isActive: true,
    isFeatured: false,
    isPopular: true,
    viewsCount: 11,
    fields: [
      { id: 'annualFamilyExpenses', label: 'Annual Family Expenses today (₹)', type: 'number', defaultValue: 600000, prefix: '₹' },
      { id: 'yearsOfSupportNeeded', label: 'Years of Support Needed', type: 'slider', defaultValue: 20, min: 1, max: 50, suffix: 'yrs' },
      { id: 'childrenEducationCostToday', label: 'Children Education Cost Today (₹)', type: 'number', defaultValue: 2000000, prefix: '₹' },
      { id: 'childrenMarriageCostToday', label: 'Children Marriage Cost Today (₹)', type: 'number', defaultValue: 1500000, prefix: '₹' },
      { id: 'inflationRatePercent', label: 'Expected Inflation Rate (% p.a.)', type: 'slider', defaultValue: 6, min: 1, max: 15, suffix: '%' },
      { id: 'expectedReturnRatePercent', label: 'Expected Safe Investment Return (% p.a.)', type: 'slider', defaultValue: 8, min: 1, max: 20, suffix: '%' },
      { id: 'totalDebts', label: 'Total Outstanding Debts (₹)', type: 'number', defaultValue: 2500000, prefix: '₹' },
      { id: 'currentAssets', label: 'Current Assets & Savings (₹)', type: 'number', defaultValue: 1000000, prefix: '₹' },
      { id: 'existingLifeInsurance', label: 'Existing Life Insurance Cover (₹)', type: 'number', defaultValue: 2000000, prefix: '₹' }
    ],
    outputs: [
      { id: 'netInsuranceRequired', label: 'Net Insurance Needed', formula: 'netInsuranceRequired', format: 'currency_inr', highlight: true },
      { id: 'totalFinancialNeedToday', label: 'Total Financial Need Today', formula: 'totalFinancialNeedToday', format: 'currency_inr' },
      { id: 'futureInflationAdjustedGoals', label: 'Education & Marriage Goals Sizing', formula: 'futureInflationAdjustedGoals', format: 'currency_inr' },
      { id: 'existingResources', label: 'Total Existing Financial Assets', formula: 'existingResources', format: 'currency_inr' }
    ],
    faqs: [
      { id: 'faq_needs_real', question: 'Why does this calculator use a Real Rate of Return?', answer: '<p>To ensure your family is not vulnerable to price increases, we discount future family support using the "real rate of return" (inflation-adjusted return), compounding protection against purchasing-power erosion over decades.</p>', isEnabled: true, order: 1 }
    ]
  },
  {
    id: 'calc_human_life_value',
    name: 'Human Life Value (HLV) Calculator',
    slug: 'human-life-value-calculator',
    subcategoryId: 'sub_ins_life',
    categoryId: catId,
    shortDescription: 'Examines the economic worth of human life by computing the present value of future lifetime earned income available to support dependents.',
    seoTitle: 'Human Life Value (HLV) Calculator — Economic Sizing Tool',
    seoDescription: 'Calculate your Human Life Value (HLV) in India using the present value of future earnings discount method to protect family income.',
    seoKeywords: 'hlv calculator, human life value calculation, economic life value, present value of future income, discount rate lifetime earnings',
    isActive: true,
    isFeatured: false,
    isPopular: false,
    viewsCount: 8,
    fields: [
      { id: 'currentAge', label: 'Current Age', type: 'slider', defaultValue: 30, min: 18, max: 65, suffix: 'yrs' },
      { id: 'retirementAge', label: 'Planned Retirement Age', type: 'slider', defaultValue: 60, min: 25, max: 75, suffix: 'yrs' },
      { id: 'annualIncome', label: 'Annual Earned Income (₹)', type: 'number', defaultValue: 1500000, prefix: '₹' },
      { id: 'personalExpensesPercent', label: 'Personal Expenses & Taxes (%)', type: 'slider', defaultValue: 30, min: 10, max: 80, suffix: '%' },
      { id: 'expectedAnnualIncomeGrowthPercent', label: 'Expected Salary Growth Rate (%)', type: 'slider', defaultValue: 8, min: 0, max: 20, suffix: '%' },
      { id: 'discountRatePercent', label: 'Discount Rate (%)', type: 'slider', defaultValue: 7, min: 1, max: 20, suffix: '%' }
    ],
    outputs: [
      { id: 'humanLifeValue', label: 'Human Life Value (HLV)', formula: 'humanLifeValue', format: 'currency_inr', highlight: true },
      { id: 'totalLifetimeNetEarningsPV', label: 'Lifetime Net Personal Earnings PV', formula: 'totalLifetimeNetEarningsPV', format: 'currency_inr' },
      { id: 'effectiveWorkingYears', label: 'Remaining Career Span', formula: 'effectiveWorkingYears', format: 'integer', suffix: 'years' }
    ],
    faqs: [
      { id: 'faq_hlv_def', question: 'What is Human Life Value (HLV) and why is it important?', answer: '<p>Human Life Value measures the economic loss your dependents would face if your earning capacity ceased. It forms the strict mathematical ceiling or benchmark used by professional underwriters to issue maximum term life cover.</p>', isEnabled: true, order: 1 }
    ]
  },

  // HEALTH INSURANCE
  {
    id: 'calc_health_insurance',
    name: 'Health Insurance Premium & Sizing Calculator',
    slug: 'health-insurance-calculator',
    subcategoryId: 'sub_ins_health',
    categoryId: catId,
    shortDescription: 'Calculate optimal health insurance cover sizing and estimate premium ranges while calculating tax savings across separate Section 80D limits.',
    seoTitle: 'Health Insurance Calculator — Premium & Sec 80D Sizer',
    seoDescription: 'Estimate optimal health cover requirements and separate Section 80D tax deductions for self and senior parents in India with 0% GST.',
    seoKeywords: 'health insurance calculator, section 80d tax benefit, family floater cover, metro room category, parent health 80d limit',
    isActive: true,
    isFeatured: true,
    isPopular: true,
    viewsCount: 22,
    fields: [
      { id: 'ageOfEldestMember', label: 'Age of Eldest Family Member', type: 'slider', defaultValue: 35, min: 18, max: 85, suffix: 'yrs' },
      { id: 'cityTier', label: 'City Tier / Residence', type: 'select', defaultValue: 'TIER_1', options: [{label: 'Tier 1 Metro (Mumbai, Delhi, etc.)', value: 'TIER_1'}, {label: 'Tier 2 / Non-Metro', value: 'TIER_2'}] },
      { id: 'familyMembersCount', label: 'Family Members to Cover', type: 'slider', defaultValue: 4, min: 1, max: 10, suffix: 'members' },
      { id: 'preferredRoomCategory', label: 'Hospital Room Type Preference', type: 'select', defaultValue: 'SINGLE_PRIVATE', options: [{label: 'Single Private A/C Room', value: 'SINGLE_PRIVATE'}, {label: 'Shared / Twin Room', value: 'SHARED'}, {label: 'Suite / Luxury Room', value: 'SUITE'}] },
      { id: 'includeParents80D', label: 'Include Parents in Section 80D Sizing?', type: 'checkbox', defaultValue: true },
      { id: 'parentsAgeAbove60', label: 'Are Parents Senior Citizens (Age 60+)?', type: 'checkbox', defaultValue: true },
      { id: 'isGroupPolicy', label: 'Is Group Health Policy? (18% GST applies)', type: 'checkbox', defaultValue: false }
    ],
    outputs: [
      { id: 'recommendedSumInsured', label: 'Recommended Sum Insured', formula: 'recommendedSumInsured', format: 'currency_inr', highlight: true },
      { id: 'estimatedBasePremium', label: 'Estimated Annual Premium (₹)', formula: 'estimatedBasePremium', format: 'currency_inr' },
      { id: 'totalSection80dTaxDeductionLimit', label: 'Total Section 80D Deduction Limit', formula: 'totalSection80dTaxDeductionLimit', format: 'currency_inr' },
      { id: 'selfFamily80dBucket', label: 'Self/Family Deduction Limit', formula: 'selfFamily80dBucket', format: 'currency_inr' },
      { id: 'parents80dBucket', label: 'Parents Deduction Limit', formula: 'parents80dBucket', format: 'currency_inr' },
      { id: 'applicableGstPercent', label: 'Applicable GST Rate (%)', formula: 'applicableGstPercent', format: 'percent' }
    ],
    faqs: [
      { id: 'faq_health_80d_limit', question: 'How is the Section 80D health insurance deduction calculated?', answer: '<p>Deduction is split into separate buckets: Self/Family (under 60 is ₹25,000; over 60 senior citizen is ₹50,000) and Parents (under 60 is ₹25,000; over 60 is ₹50,000). Total possible deduction reaches ₹1,00,000 if both are senior citizens.</p>', isEnabled: true, order: 1 },
      { id: 'faq_health_gst', question: 'What is the GST rate on health insurance policies in India?', answer: '<p>Effective post Sept 22, 2025, individual and family floater health policies are exempt from GST (0%). Group and business health policies remain taxed at 18% GST.</p>', isEnabled: true, order: 2 }
    ]
  },
  {
    id: 'calc_health_coverage',
    name: 'Health Insurance Adequacy & Coverage Calculator',
    slug: 'health-insurance-coverage-calculator',
    subcategoryId: 'sub_ins_health',
    categoryId: catId,
    shortDescription: 'Compound your current coverage against medical inflation to discover treatment cost shortfalls and optimal top-up recommendations.',
    seoTitle: 'Health Insurance Adequacy Calculator — Medical Inflation Sizer',
    seoDescription: 'Ensure your medical coverage is adequate in the future by compounding treatment costs against high double-digit medical inflation.',
    seoKeywords: 'medical inflation calculator, healthcare top-up estimator, sum insured adequacy, buffer protection, health cover shortfall',
    isActive: true,
    isFeatured: false,
    isPopular: false,
    viewsCount: 14,
    fields: [
      { id: 'currentCoverageAmount', label: 'Current Coverage Amount (₹)', type: 'number', defaultValue: 500000, prefix: '₹' },
      { id: 'medicalInflationRatePercent', label: 'Annual Medical Inflation Rate (%)', type: 'slider', defaultValue: 12, min: 5, max: 25, suffix: '%' },
      { id: 'yearsInFuture', label: 'Years in Future', type: 'slider', defaultValue: 10, min: 1, max: 30, suffix: 'yrs' },
      { id: 'selfAgeAbove60', label: 'Are you a Senior Citizen (Age 60+)?', type: 'checkbox', defaultValue: false },
      { id: 'includeParentCover80D', label: 'Include parents in tax sizing?', type: 'checkbox', defaultValue: true },
      { id: 'parentsAgeAbove60', label: 'Are Parents Senior Citizens?', type: 'checkbox', defaultValue: true },
      { id: 'isGroupPolicy', label: 'Group Policy? (18% GST)', type: 'checkbox', defaultValue: false }
    ],
    outputs: [
      { id: 'projectedFutureTreatmentCost', label: 'Future Treatment Cost (Inflation-Adjusted)', formula: 'projectedFutureTreatmentCost', format: 'currency_inr', highlight: true },
      { id: 'coverageShortfall', label: 'Estimated Coverage Shortfall', formula: 'coverageShortfall', format: 'currency_inr' },
      { id: 'totalSection80dTaxBenefitAvailable', label: 'Section 80D Tax Deduction limit', formula: 'totalSection80dTaxBenefitAvailable', format: 'currency_inr' }
    ],
    faqs: [
      { id: 'faq_med_inflation', question: 'What is medical inflation, and why is it so high in India?', answer: '<p>Medical inflation in India is typically around 12% to 15% per annum, double the rate of standard retail inflation. This quickly renders flat, standard ₹5 Lakh health covers highly inadequate over a 5 to 10 year timeline.</p>', isEnabled: true, order: 1 }
    ]
  },

  // VEHICLE INSURANCE
  {
    id: 'calc_car_insurance',
    name: 'Car Insurance IDV & Premium Estimator',
    slug: 'car-insurance-calculator',
    subcategoryId: 'sub_ins_vehicle',
    categoryId: catId,
    shortDescription: 'Calculate your car Insured Declared Value (IDV) using IRDAI age-based depreciation schedules and calculate No Claim Bonus (NCB) discount ladders.',
    seoTitle: 'Car Insurance IDV & Premium Calculator — IRDAI Rules',
    seoDescription: 'Estimate your car’s Insured Declared Value (IDV) using the statutory age-based depreciation rates and calculate NCB premium discounts.',
    seoKeywords: 'car idv calculator, car depreciation schedule, irdai motor rules, car insurance premium, no claim bonus discount',
    isActive: true,
    isFeatured: true,
    isPopular: true,
    viewsCount: 30,
    fields: [
      { id: 'manufacturerListedExShowroomPrice', label: 'Manufacturer Ex-Showroom Price (₹)', type: 'number', defaultValue: 1000000, prefix: '₹' },
      { id: 'vehicleAgeMonths', label: 'Vehicle Age (Months)', type: 'slider', defaultValue: 18, min: 0, max: 120, suffix: 'months' },
      { id: 'claimFreeYearsNCB', label: 'Claim-Free Years (for NCB Discount)', type: 'slider', defaultValue: 2, min: 0, max: 5, suffix: 'yrs' },
      { id: 'engineCapacityCC', label: 'Engine Capacity (CC)', type: 'slider', defaultValue: 1200, min: 600, max: 5000, suffix: 'cc' }
    ],
    outputs: [
      { id: 'insuredDeclaredValueIDV', label: 'Insured Declared Value (IDV)', formula: 'insuredDeclaredValueIDV', format: 'currency_inr', highlight: true },
      { id: 'estimatedTotalPremium', label: 'Estimated Annual Premium (₹)', formula: 'estimatedTotalPremium', format: 'currency_inr' },
      { id: 'appliedDepreciationPercent', label: 'IDV Depreciation Rate (%)', formula: 'appliedDepreciationPercent', format: 'percent' },
      { id: 'noClaimBonusPercent', label: 'No Claim Bonus (NCB) Discount (%)', formula: 'noClaimBonusPercent', format: 'percent' }
    ],
    faqs: [
      { id: 'faq_motor_idv', question: 'How is Insured Declared Value (IDV) calculated according to IRDAI rules?', answer: '<p>IDV represents the maximum sum insured of your vehicle. It is calculated by depreciating the manufacturer ex-showroom price based on vehicle age: ≤ 6 months is 5% depreciation, 6-12 months is 15%, 1-2 years is 20%, 2-3 years is 30%, 3-4 years is 40%, 4-5 years is 50%.</p>', isEnabled: true, order: 1 },
      { id: 'faq_ncb_ladder', question: 'What is the No Claim Bonus (NCB) slab structure?', answer: '<p>NCB is a discount on the Own Damage premium awarded for claim-free years: 1 year claim-free is 20% discount, 2 years is 25%, 3 years is 35%, 4 years is 45%, 5 years is 50% discount. NCB resets to 0% if any claim is filed.</p>', isEnabled: true, order: 2 }
    ]
  },
  {
    id: 'calc_bike_insurance',
    name: 'Two-Wheeler Insurance IDV & Premium Estimator',
    slug: 'bike-insurance-calculator',
    subcategoryId: 'sub_ins_vehicle',
    categoryId: catId,
    shortDescription: 'Calculate your bike or scooter IDV according to IRDAI schedules and check No Claim Bonus discounts with third-party engine slabs.',
    seoTitle: 'Two-Wheeler Insurance IDV & Premium Calculator',
    seoDescription: 'Estimate your bike’s Insured Declared Value (IDV) and annual insurance premiums under statutory IRDAI motor guidelines.',
    seoKeywords: 'bike idv calculator, scooter insurance premium, two wheeler ncb discount, bike depreciation scale, third party liability cc',
    isActive: true,
    isFeatured: false,
    isPopular: false,
    viewsCount: 16,
    fields: [
      { id: 'manufacturerListedExShowroomPrice', label: 'Manufacturer Ex-Showroom Price (₹)', type: 'number', defaultValue: 150000, prefix: '₹' },
      { id: 'bikeAgeMonths', label: 'Vehicle Age (Months)', type: 'slider', defaultValue: 8, min: 0, max: 120, suffix: 'months' },
      { id: 'claimFreeYearsNCB', label: 'Claim-Free Years (NCB)', type: 'slider', defaultValue: 1, min: 0, max: 5, suffix: 'yrs' },
      { id: 'engineCapacityCC', label: 'Engine Capacity (CC)', type: 'slider', defaultValue: 125, min: 50, max: 2000, suffix: 'cc' }
    ],
    outputs: [
      { id: 'insuredDeclaredValueIDV', label: 'Insured Declared Value (IDV)', formula: 'insuredDeclaredValueIDV', format: 'currency_inr', highlight: true },
      { id: 'estimatedTotalPremium', label: 'Estimated Annual Premium (₹)', formula: 'estimatedTotalPremium', format: 'currency_inr' },
      { id: 'appliedDepreciationPercent', label: 'IDV Depreciation Rate (%)', formula: 'appliedDepreciationPercent', format: 'percent' },
      { id: 'noClaimBonusPercent', label: 'No Claim Bonus (NCB) Discount (%)', formula: 'noClaimBonusPercent', format: 'percent' }
    ],
    faqs: [
      { id: 'faq_bike_dep', question: 'How is a two-wheeler IDV calculated?', answer: '<p>The exact same age-depreciation schedules defined by IRDAI apply to two-wheelers, starting from 5% for brand-new bikes up to 50% for 5-year-old vehicles.</p>', isEnabled: true, order: 1 }
    ]
  },

  // TRAVEL INSURANCE
  {
    id: 'calc_travel_insurance',
    name: 'Travel Insurance Coverage & Premium Calculator',
    slug: 'travel-insurance-calculator',
    subcategoryId: 'sub_ins_travel',
    categoryId: catId,
    shortDescription: 'Calculate optimal medical coverage sizes and estimate international travel insurance premiums based on destination risk coefficients.',
    seoTitle: 'Travel Insurance Calculator — Premium & Coverage Sizer',
    seoDescription: 'Sizing tool for international medical travel insurance with destination-risk coefficients and age-duration curves.',
    seoKeywords: 'travel insurance premium, schengen visa medical cover, us canada trip cover, baggage delay delay indemnity, travel hazard risk factor',
    isActive: true,
    isFeatured: false,
    isPopular: false,
    viewsCount: 10,
    fields: [
      { id: 'destinationRegion', label: 'Travel Destination', type: 'select', defaultValue: 'USA_CANADA', options: [{label: 'USA & Canada (High Risk/Cost)', value: 'USA_CANADA'}, {label: 'Schengen Area / Europe (Medium Cost)', value: 'SCHENGEN'}, {label: 'Asia & Other Regions (Standard Risk)', value: 'ASIA_OTHER'}] },
      { id: 'tripDurationDays', label: 'Trip Duration (Days)', type: 'slider', defaultValue: 15, min: 1, max: 180, suffix: 'days' },
      { id: 'travelerAge', label: 'Traveler Age', type: 'slider', defaultValue: 35, min: 1, max: 85, suffix: 'yrs' }
    ],
    outputs: [
      { id: 'estimatedTotalPremiumInr', label: 'Estimated Total Premium (₹)', formula: 'estimatedTotalPremiumInr', format: 'currency_inr', highlight: true },
      { id: 'recommendedMedicalSumInsuredUsd', label: 'Recommended Medical Cover (USD)', formula: 'recommendedMedicalSumInsuredUsd', format: 'integer', prefix: '$' },
      { id: 'baggageDelayCoverUsd', label: 'Baggage / Delay Coverage (USD)', formula: 'baggageDelayCoverUsd', format: 'integer', prefix: '$' }
    ],
    faqs: [
      { id: 'faq_travel_req', question: 'Is medical insurance mandatory for a Schengen Visa?', answer: '<p>Yes. Schengen Visa rules mandate international travel insurance with a minimum medical coverage of €30,000 or $50,000, including repatriation of remains. USA/Canada trips don’t have visa mandates but healthcare costs make $250,000+ highly recommended.</p>', isEnabled: true, order: 1 }
    ]
  },

  // PERSONAL PROTECTION
  {
    id: 'calc_personal_accident_cover',
    name: 'Personal Accident Coverage Calculator',
    slug: 'personal-accident-cover-calculator',
    subcategoryId: 'sub_ins_protection',
    categoryId: catId,
    shortDescription: 'Size recommended covers for accidental death, permanent disablement, and weekly temporary total disability (TTD) replacement benefits.',
    seoTitle: 'Personal Accident Insurance Calculator — Disability Sizing',
    seoDescription: 'Calculate accidental death cover requirements and temporary disability weekly benefits based on your annual earned income in India.',
    seoKeywords: 'personal accident cover, accidental death sum insured, temporary total disability benefit, ttd weekly payout, disability cover scale',
    isActive: true,
    isFeatured: true,
    isPopular: false,
    viewsCount: 13,
    fields: [
      { id: 'annualEarnedIncome', label: 'Annual Earned Income (₹)', type: 'number', defaultValue: 1000000, prefix: '₹' },
      { id: 'outstandingDebts', label: 'Outstanding Financial Debts (₹)', type: 'number', defaultValue: 1500000, prefix: '₹' }
    ],
    outputs: [
      { id: 'recommendedAccidentalDeathCover', label: 'Accidental Death Sizing', formula: 'recommendedAccidentalDeathCover', format: 'currency_inr', highlight: true },
      { id: 'permanentDisabilityCover', label: 'Permanent Disablement Cover', formula: 'permanentDisabilityCover', format: 'currency_inr' },
      { id: 'temporaryTotalDisabilityWeeklyBenefit', label: 'Weekly Temporary Disability (TTD) Benefit', formula: 'temporaryTotalDisabilityWeeklyBenefit', format: 'currency_inr' }
    ],
    faqs: [
      { id: 'faq_accident_ttd', question: 'What is Temporary Total Disability (TTD) and how is it sized?', answer: '<p>TTD cover pays a weekly cash benefit if an accident temporarily prevents you from working. It is typically sized at 1% of the total sum insured per week, capped at ₹50,000 or your actual weekly net salary to replace lost cash flow during recovery.</p>', isEnabled: true, order: 1 }
    ]
  },
  {
    id: 'calc_critical_illness_cover',
    name: 'Critical Illness Coverage Sizing Calculator',
    slug: 'critical-illness-cover-calculator',
    subcategoryId: 'sub_ins_protection',
    categoryId: catId,
    shortDescription: 'Size optimal lump-sum protection to replace multiple years of family living expenses and fund specialized treatments for serious diagnoses.',
    seoTitle: 'Critical Illness Insurance Sizer Calculator',
    seoDescription: 'Find your critical illness coverage needs based on living expenses, treatment costs, and income replacement requirements in India.',
    seoKeywords: 'critical illness cover, disease list coverage, specialized treatment costs, living expenses multiplier, lump sum recovery pool',
    isActive: true,
    isFeatured: false,
    isPopular: false,
    viewsCount: 11,
    fields: [
      { id: 'annualLivingExpenses', label: 'Annual Living Expenses (₹)', type: 'number', defaultValue: 600000, prefix: '₹' },
      { id: 'yearsOfIncomeReplacementNeeded', label: 'Income Replacement Duration (Years)', type: 'slider', defaultValue: 3, min: 1, max: 10, suffix: 'yrs' },
      { id: 'expectedSpecializedTreatmentCost', label: 'Expected Specialized Treatment Cost today (₹)', type: 'number', defaultValue: 1500000, prefix: '₹' }
    ],
    outputs: [
      { id: 'recommendedCriticalIllnessLumpSum', label: 'Recommended Sum Insured', formula: 'recommendedCriticalIllnessLumpSum', format: 'currency_inr', highlight: true },
      { id: 'incomeReplacementSizing', label: 'Living Expenses Replacement Sizing', formula: 'incomeReplacementSizing', format: 'currency_inr' },
      { id: 'estimatedBaseAnnualPremium', label: 'Estimated Annual Premium (₹)', formula: 'estimatedBaseAnnualPremium', format: 'currency_inr' }
    ],
    faqs: [
      { id: 'faq_critical_lump', question: 'How is critical illness insurance different from health insurance?', answer: '<p>Standard health insurance reimburses actual hospitalisation bills. Critical illness insurance is a benefit policy that pays out a pre-agreed 100% lump sum immediately upon diagnosis of a covered illness (like cancer or stroke), allowing you to replace income or pay for out-of-hospital recovery costs.</p>', isEnabled: true, order: 1 }
    ]
  },

  // PROPERTY / BUSINESS
  {
    id: 'calc_home_insurance',
    name: 'Home Structure & Contents Insurance Calculator',
    slug: 'home-insurance-calculator',
    subcategoryId: 'sub_ins_property_business',
    categoryId: catId,
    shortDescription: 'Protect your home structure using real-world reconstruction costs per square foot and estimate comprehensive contents valuations.',
    seoTitle: 'Home Structure & Contents Insurance Calculator',
    seoDescription: 'Sizing tool for home structure and contents insurance based on built-up area, average reconstruction rates, and household valuations.',
    seoKeywords: 'home insurance calculator, structure reconstruction cover, property cost per sq ft, household contents valuation, home fire policy',
    isActive: true,
    isFeatured: false,
    isPopular: false,
    viewsCount: 9,
    fields: [
      { id: 'builtUpAreaSqFt', label: 'Built-Up Area (Sq Ft)', type: 'number', defaultValue: 1200, prefix: 'sqft' },
      { id: 'constructionCostPerSqFt', label: 'Construction Cost Rate (₹ per Sq Ft)', type: 'slider', defaultValue: 2500, min: 1000, max: 10000, step: 100, prefix: '₹' },
      { id: 'contentsValuationToday', label: 'Value of Household Contents & Appliances (₹)', type: 'number', defaultValue: 500000, prefix: '₹' }
    ],
    outputs: [
      { id: 'totalHomeInsuranceSumInsured', label: 'Total Recommended Sum Insured', formula: 'totalHomeInsuranceSumInsured', format: 'currency_inr', highlight: true },
      { id: 'structureReconstructionSumInsured', label: 'Structure Reconstruction Cover Sizing', formula: 'structureReconstructionSumInsured', format: 'currency_inr' },
      { id: 'estimatedAnnualPremium', label: 'Estimated Annual Premium (₹)', formula: 'estimatedAnnualPremium', format: 'currency_inr' }
    ],
    faqs: [
      { id: 'faq_home_reconstruct', question: 'Why is home insurance calculated based on construction cost rather than market value?', answer: '<p>Home insurance pays to reconstruct the damaged building. The market value of property includes the land value, which never burns or gets destroyed. Thus, coverage is sized as Built-up Area × Reconstruction Cost per sq ft, completely independent of land pricing.</p>', isEnabled: true, order: 1 }
    ]
  },
  {
    id: 'calc_business_insurance',
    name: 'Business Property & Interruption Sizing Calculator',
    slug: 'business-insurance-calculator',
    subcategoryId: 'sub_ins_property_business',
    categoryId: catId,
    shortDescription: 'Assess material damage requirements for commercial buildings and machinery alongside business interruption coverages for lost gross profits.',
    seoTitle: 'Business Property & Interruption Insurance Calculator',
    seoDescription: 'Accurately size commercial building structure, machinery assets, and Business Interruption (FLOP) gross profit covers with specified indemnity timelines.',
    seoKeywords: 'business property cover, material damage sizing, business interruption insurance, loss of profit cover, commercial building reconstruction',
    isActive: true,
    isFeatured: true,
    isPopular: false,
    viewsCount: 15,
    fields: [
      { id: 'buildingReconstructionValue', label: 'Building Structure Reconstruction Value (₹)', type: 'number', defaultValue: 5000000, prefix: '₹' },
      { id: 'plantMachineryStockValue', label: 'Plant, Machinery, Fixtures & Stock Value (₹)', type: 'number', defaultValue: 10000000, prefix: '₹' },
      { id: 'annualGrossProfit', label: 'Annual Gross Profit (₹)', type: 'number', defaultValue: 3000000, prefix: '₹' },
      { id: 'indemnityPeriodMonths', label: 'Business Interruption Indemnity Period', type: 'slider', defaultValue: 12, min: 3, max: 36, suffix: 'months' }
    ],
    outputs: [
      { id: 'totalBusinessSumInsured', label: 'Total Recommended Sum Insured', formula: 'totalBusinessSumInsured', format: 'currency_inr', highlight: true },
      { id: 'propertyMaterialDamageSumInsured', label: 'Material Damage (Property) Sum Insured', formula: 'propertyMaterialDamageSumInsured', format: 'currency_inr' },
      { id: 'businessInterruptionGrossProfitSumInsured', label: 'Business Interruption (Loss of Profit) Cover', formula: 'businessInterruptionGrossProfitSumInsured', format: 'currency_inr' },
      { id: 'estimatedAnnualPremium', label: 'Estimated Annual Premium (₹)', formula: 'estimatedAnnualPremium', format: 'currency_inr' }
    ],
    faqs: [
      { id: 'faq_biz_interrupt', question: 'What is Business Interruption insurance and why does it require gross profit calculations?', answer: '<p>If a fire or disaster stops your business, material damage cover pays to rebuild, but does not cover lost revenue. Business Interruption insurance pays for the lost Gross Profit and ongoing fixed expenses during the "indemnity period" required to restore full business operations.</p>', isEnabled: true, order: 1 }
    ]
  }
];

calculators.forEach(calc => {
  // Add modules configs
  calc.modules = createDefaultModules(calc.slug);
  calc.contentSections = [
    {
      id: `sec_${calc.slug}_overview`,
      title: `${calc.name} Methodology & Planning Guide`,
      htmlContent: `<p>All calculations are structured strictly in compliance with statutory Indian guidelines, insurance risk underwriting methodologies, and Section 80D or Section 80C parameters where applicable.</p><p>Use this tool to simulate coverage splits, determine maximum liabilities, and discover critical shortfalls due to high healthcare inflation or motor depreciation rates. Individual plans are presented with 0% GST reform adjustments for maximum pricing transparency.</p>`,
      isEnabled: true,
      order: 1,
      sectionType: 'overview'
    }
  ];

  const existing = db.calculators.find(c => c.id === calc.id || c.slug === calc.slug);
  if (!existing) {
    db.calculators.push(calc);
  } else {
    // Merge updates
    Object.assign(existing, calc);
  }
});

fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf8');
console.log(`[SEED SUCCESS] Successfully seeded 6 subcategories and 12 calculators inside Insurance category (${catId}).`);
