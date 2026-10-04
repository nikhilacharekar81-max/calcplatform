const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, '../data/db.json');

if (!fs.existsSync(DB_FILE)) {
  console.error('Database file not found!');
  process.exit(1);
}

const db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));

// 1. Categories
const categoriesToAdd = [
  {
    id: 'cat_core_maths',
    name: 'Core Mathematics',
    slug: 'core-mathematics',
    description: 'Solve common arithmetic, ratios, fractions, and general mathematical proportion problems with step-by-step clarity.',
    seoTitle: 'Core Mathematics Calculators — Ratios, Percentages & Fractions',
    seoDescription: 'Accurately solve percentages, percentage changes, ratios, averages, and LCM/GCD with safe and secure sandboxed calculation tools.',
    seoKeywords: 'maths calculators, ratio calculator, percentage calculator, average solver, lcm and hcf',
    order: 4,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'cat_investments',
    name: 'Investments & Wealth',
    slug: 'investments-wealth',
    description: 'Grow your savings with precise compound interest projections, Step-Up SIP planners, and CAGR investment metrics.',
    seoTitle: 'Investments & Wealth Calculators — Compound Interest & SIP Planners',
    seoDescription: 'Calculate compound growth, SIP performance, Step-Up increases, SWP payouts, and CAGR return rates with zero latency.',
    seoKeywords: 'sip calculator, step up sip, compound interest, swp calculator, cagr calculator, compound growth',
    order: 5,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'cat_retirement',
    name: 'Retirement & Pension',
    slug: 'retirement-pension',
    description: 'Plan your long-term financial security with Gratuity estimators, EPF contributions, and inflation-aware retirement corpus sizing.',
    seoTitle: 'Retirement & Pension Calculators — Gratuity & Corpus Planners',
    seoDescription: 'Project statutory Gratuity payouts, EPF pension contributions, and calculate retirement corpus sizes under changing inflation scales.',
    seoKeywords: 'retirement corpus calculator, gratuity calculation act, epf contribution, nps planning, retirement corpus sizer',
    order: 6,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'cat_health_fitness',
    name: 'Health & Fitness',
    slug: 'health-fitness',
    description: 'Monitor your vital physical metrics with BMI, BMR, and daily calorie/TDEE energy expenditure models.',
    seoTitle: 'Health & Fitness Calculators — BMI, BMR & Calorie Sizers',
    seoDescription: 'Calculate your Body Mass Index (BMI), Basal Metabolic Rate (BMR), and Total Daily Energy Expenditure (TDEE) with safe estimation models.',
    seoKeywords: 'bmi calculator, bmr calculator, tdee estimator, calorie needs calculator, physical metrics estimation',
    order: 7,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'cat_business',
    name: 'Business & Corporate',
    slug: 'business-corporate',
    description: 'Optimize corporate planning with margin, markup, ROI, break-even thresholds, and professional CTC estimations.',
    seoTitle: 'Business & Corporate Calculators — Margin, Break-Even & ROI Planners',
    seoDescription: 'Optimize corporate operations and evaluate ROI, profit margins, markups, and break-even unit sales with robust dynamic widgets.',
    seoKeywords: 'profit margin calculator, markup estimator, break even calculator, roi calculator, corporate finance metrics',
    order: 8,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

categoriesToAdd.forEach(cat => {
  const existing = db.categories.find(c => c.id === cat.id || c.slug === cat.slug);
  if (!existing) {
    db.categories.push(cat);
  } else {
    Object.assign(existing, cat);
  }
});

// 2. Subcategories
const subcategoriesToAdd = [
  { id: 'sub_maths_basic', name: 'Basic Mathematics', slug: 'basic-mathematics', categoryId: 'cat_core_maths', order: 1, isActive: true },
  { id: 'sub_investments_savings', name: 'Savings & Deposits', slug: 'savings-deposits', categoryId: 'cat_investments', order: 1, isActive: true },
  { id: 'sub_investments_sip', name: 'SIP & Wealth Planners', slug: 'sip-wealth-planners', categoryId: 'cat_investments', order: 2, isActive: true },
  { id: 'sub_retirement_planning', name: 'Retirement Sizing', slug: 'retirement-sizing', categoryId: 'cat_retirement', order: 1, isActive: true },
  { id: 'sub_health_metrics', name: 'Body Metrics', slug: 'body-metrics', categoryId: 'cat_health_fitness', order: 1, isActive: true },
  { id: 'sub_business_finance', name: 'Business Finance', slug: 'business-finance', categoryId: 'cat_business', order: 1, isActive: true }
];

subcategoriesToAdd.forEach(sub => {
  const existing = db.subcategories.find(s => s.id === sub.id || (s.slug === sub.slug && s.categoryId === sub.categoryId));
  if (!existing) {
    db.subcategories.push({
      ...sub,
      description: `Precise dynamic calculation tools for ${sub.name}.`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  } else {
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
      title: 'Parameters & Options',
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
      title: 'Computed Results',
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
      chartType: 'bar',
      chartTitle: 'Result Breakdown Graph',
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

// 3. Calculators to Add
const calcsToAdd = [
  // CORE MATHS
  {
    id: 'calc_percentage',
    name: 'Percentage Calculator',
    slug: 'percentage-calculator',
    subcategoryId: 'sub_maths_basic',
    categoryId: 'cat_core_maths',
    shortDescription: 'Solve general percentage problems instantly, such as finding a given percentage of a number.',
    seoTitle: 'Percentage Calculator — Find Percent of a Value',
    seoDescription: 'An online math utility to calculate the exact percentage value from any given number instantly.',
    seoKeywords: 'percentage calculator, find percent of value, calculate percentage ratio',
    isActive: true,
    fields: [
      { id: 'percent', label: 'Percent (%)', type: 'number', defaultValue: 15, min: 0, max: 1000, prefix: '%' },
      { id: 'value', label: 'Of Number', type: 'number', defaultValue: 500, min: 0, max: 1000000000 }
    ],
    outputs: [
      { id: 'result', label: 'Calculated Percentage Value', formula: 'result', format: 'decimal_2', highlight: true }
    ],
    faqs: [
      { id: 'faq_pct_1', question: 'How is a percentage calculated?', answer: '<p>A percentage is calculated by multiplying the base value by the percent rate, then dividing by 100: (Value × Percent) / 100.</p>', isEnabled: true, order: 1 }
    ]
  },
  {
    id: 'calc_percentage_change',
    name: 'Percentage Increase/Decrease Calculator',
    slug: 'percentage-increase-decrease',
    subcategoryId: 'sub_maths_basic',
    categoryId: 'cat_core_maths',
    shortDescription: 'Compute the percentage change from an initial value to a final value, showing absolute difference and change direction.',
    seoTitle: 'Percentage Increase/Decrease Calculator — Change Rate',
    seoDescription: 'Find the percentage rate of change (increase or decrease) between two numeric values with step-by-step clarity.',
    seoKeywords: 'percentage change calculator, percent increase, percent decrease, growth rate calculator',
    isActive: true,
    fields: [
      { id: 'initialValue', label: 'Initial Value', type: 'number', defaultValue: 200 },
      { id: 'finalValue', label: 'Final Value', type: 'number', defaultValue: 250 }
    ],
    outputs: [
      { id: 'percentChange', label: 'Percentage Change', formula: 'percentChange', format: 'percent', highlight: true },
      { id: 'difference', label: 'Absolute Difference', formula: 'difference', format: 'number' }
    ],
    faqs: [
      { id: 'faq_pct_change_1', question: 'What is the percentage change formula?', answer: '<p>The percentage change formula is: ((Final Value - Initial Value) / |Initial Value|) × 100.</p>', isEnabled: true, order: 1 }
    ]
  },
  {
    id: 'calc_ratio',
    name: 'Ratio Calculator',
    slug: 'ratio-calculator',
    subcategoryId: 'sub_maths_basic',
    categoryId: 'cat_core_maths',
    shortDescription: 'Simplify ratios and calculate proportional shares or division ratios instantly.',
    seoTitle: 'Ratio Simplifier & Division Calculator',
    seoDescription: 'Simplify any given ratio into its lowest terms and compute percentage-based proportional shares.',
    seoKeywords: 'ratio calculator, simplify ratios, proportional division, ratio scale',
    isActive: true,
    fields: [
      { id: 'valueA', label: 'Value A', type: 'number', defaultValue: 15 },
      { id: 'valueB', label: 'Value B', type: 'number', defaultValue: 25 }
    ],
    outputs: [
      { id: 'ratioString', label: 'Simplified Ratio', formula: 'ratioString', format: 'text', highlight: true },
      { id: 'shareAPercent', label: 'Share A of Total (%)', formula: 'shareAPercent', format: 'percent' },
      { id: 'shareBPercent', label: 'Share B of Total (%)', formula: 'shareBPercent', format: 'percent' }
    ],
    faqs: [
      { id: 'faq_ratio_1', question: 'How does the ratio simplifier work?', answer: '<p>It computes the Greatest Common Divisor (GCD) of both terms and divides both terms by this factor to find the most simplified integer ratio.</p>', isEnabled: true, order: 1 }
    ]
  },
  {
    id: 'calc_average',
    name: 'Average Calculator',
    slug: 'average-calculator',
    subcategoryId: 'sub_maths_basic',
    categoryId: 'cat_core_maths',
    shortDescription: 'Calculate the mathematical average (arithmetic mean), count, sum, min, and max for any list of numbers.',
    seoTitle: 'Average Calculator — Arithmetic Mean Solver',
    seoDescription: 'Enter comma-separated values to solve the mathematical arithmetic average, sum, and numeric range instantly.',
    seoKeywords: 'average calculator, arithmetic mean, average solver, numbers sum average',
    isActive: true,
    fields: [
      { id: 'valuesString', label: 'Enter Numbers (comma-separated)', type: 'radio', defaultValue: '10, 20, 30, 40, 50', options: [
        { label: 'Set A: 10, 20, 30, 40, 50', value: '10, 20, 30, 40, 50' },
        { label: 'Set B: 100, 250, 450, 600', value: '100, 250, 450, 600' }
      ]}
    ],
    outputs: [
      { id: 'average', label: 'Calculated Average (Mean)', formula: 'average', format: 'decimal_2', highlight: true },
      { id: 'sum', label: 'Sum Total', formula: 'sum', format: 'number' },
      { id: 'count', label: 'Total Count of Values', formula: 'count', format: 'integer' }
    ],
    faqs: [
      { id: 'faq_avg_1', question: 'How is the arithmetic mean calculated?', answer: '<p>The arithmetic mean is calculated by summing all the values in a dataset, and then dividing this sum by the total number of items: Sum / Count.</p>', isEnabled: true, order: 1 }
    ]
  },
  {
    id: 'calc_lcm',
    name: 'LCM Calculator',
    slug: 'lcm-calculator',
    subcategoryId: 'sub_maths_basic',
    categoryId: 'cat_core_maths',
    shortDescription: 'Determine the Least Common Multiple (LCM) of two positive integers.',
    seoTitle: 'LCM Calculator — Least Common Multiple Solver',
    seoDescription: 'Find the lowest common multiple of two integers using secure sandboxed greatest common divisor algorithms.',
    seoKeywords: 'lcm calculator, least common multiple, lowest common multiple, integer factors',
    isActive: true,
    fields: [
      { id: 'valueA', label: 'Integer A', type: 'number', defaultValue: 12, min: 1, max: 1000000 },
      { id: 'valueB', label: 'Integer B', type: 'number', defaultValue: 18, min: 1, max: 1000000 }
    ],
    outputs: [
      { id: 'lcm', label: 'Least Common Multiple (LCM)', formula: 'lcm', format: 'integer', highlight: true },
      { id: 'gcd', label: 'Greatest Common Divisor (GCD/HCF)', formula: 'gcd', format: 'integer' }
    ],
    faqs: [
      { id: 'faq_lcm_1', question: 'What is a Least Common Multiple?', answer: '<p>The Least Common Multiple (LCM) of two integers is the smallest positive integer that is perfectly divisible by both numbers without any remainder.</p>', isEnabled: true, order: 1 }
    ]
  },
  {
    id: 'calc_hcf_gcd',
    name: 'HCF/GCD Calculator',
    slug: 'hcf-gcd-calculator',
    subcategoryId: 'sub_maths_basic',
    categoryId: 'cat_core_maths',
    shortDescription: 'Calculate the Highest Common Factor (HCF) or Greatest Common Divisor (GCD) of two integers.',
    seoTitle: 'HCF/GCD Calculator — Highest Common Factor Solver',
    seoDescription: 'Find the highest common factor or greatest common divisor of two integers instantly.',
    seoKeywords: 'hcf calculator, gcd calculator, highest common factor, greatest common divisor',
    isActive: true,
    fields: [
      { id: 'valueA', label: 'Integer A', type: 'number', defaultValue: 24, min: 1, max: 1000000 },
      { id: 'valueB', label: 'Integer B', type: 'number', defaultValue: 36, min: 1, max: 1000000 }
    ],
    outputs: [
      { id: 'gcd', label: 'Greatest Common Divisor (GCD/HCF)', formula: 'gcd', format: 'integer', highlight: true },
      { id: 'lcm', label: 'Least Common Multiple (LCM)', formula: 'lcm', format: 'integer' }
    ],
    faqs: [
      { id: 'faq_gcd_1', question: 'What is a Highest Common Factor (HCF)?', answer: '<p>The Highest Common Factor (HCF), also known as Greatest Common Divisor (GCD), is the largest positive integer that divides both numbers perfectly without a remainder.</p>', isEnabled: true, order: 1 }
    ]
  },

  // INVESTMENTS & WEALTH
  {
    id: 'calc_simple_interest',
    name: 'Simple Interest Calculator',
    slug: 'simple-interest-calculator',
    subcategoryId: 'sub_investments_savings',
    categoryId: 'cat_investments',
    shortDescription: 'Project flat interest earnings on principal deposits without exponential compounding variables.',
    seoTitle: 'Simple Interest Calculator — Flat Interest Solver',
    seoDescription: 'Compute flat simple interest rates over principal sums and track total accumulated assets with ease.',
    seoKeywords: 'simple interest calculator, flat interest rate, interest on principal, principal interest total',
    isActive: true,
    fields: [
      { id: 'principal', label: 'Principal Sum (₹)', type: 'number', defaultValue: 100000, prefix: '₹' },
      { id: 'rate', label: 'Annual Interest Rate (%)', type: 'slider', defaultValue: 7.5, min: 1, max: 30, step: 0.1, suffix: '%' },
      { id: 'years', label: 'Duration (Years)', type: 'slider', defaultValue: 5, min: 1, max: 40, step: 1, suffix: 'yrs' }
    ],
    outputs: [
      { id: 'totalValue', label: 'Accumulated Total Value', formula: 'totalValue', format: 'currency_inr', highlight: true },
      { id: 'interestEarned', label: 'Total Simple Interest Earned', formula: 'interestEarned', format: 'currency_inr' }
    ],
    faqs: [
      { id: 'faq_si_1', question: 'What is simple interest formula?', answer: '<p>The simple interest formula is: Interest = Principal × Rate × Time. No compounding is applied to the earned interest.</p>', isEnabled: true, order: 1 }
    ]
  },
  {
    id: 'calc_compound_interest',
    name: 'Compound Interest Calculator',
    slug: 'compound-interest-calculator',
    subcategoryId: 'sub_investments_savings',
    categoryId: 'cat_investments',
    shortDescription: 'Project exponential compounding growth on your savings and deposits with adjustable compounding frequencies.',
    seoTitle: 'Compound Interest Calculator — Exponential Wealth Solver',
    seoDescription: 'Calculate compound interest growth curves with customizable monthly, quarterly, or annual frequency structures.',
    seoKeywords: 'compound interest calculator, compound growth, compounding frequency, compound wealth planner',
    isActive: true,
    fields: [
      { id: 'principal', label: 'Initial Principal (₹)', type: 'number', defaultValue: 100000, prefix: '₹' },
      { id: 'rate', label: 'Annual Compound Rate (%)', type: 'slider', defaultValue: 10.0, min: 1, max: 30, step: 0.1, suffix: '%' },
      { id: 'years', label: 'Duration (Years)', type: 'slider', defaultValue: 10, min: 1, max: 50, step: 1, suffix: 'yrs' },
      { id: 'compoundingFrequency', label: 'Compounding Frequency', type: 'select', defaultValue: 'annually', options: [
        { label: 'Annually', value: 'annually' },
        { label: 'Half-Yearly', value: 'half-yearly' },
        { label: 'Quarterly', value: 'quarterly' },
        { label: 'Monthly', value: 'monthly' }
      ]}
    ],
    outputs: [
      { id: 'totalValue', label: 'Compounded Future Value', formula: 'totalValue', format: 'currency_inr', highlight: true },
      { id: 'interestEarned', label: 'Total Interest Accrued', formula: 'interestEarned', format: 'currency_inr' }
    ],
    faqs: [
      { id: 'faq_ci_1', question: 'Why does compounding frequency matter?', answer: '<p>More frequent compounding (e.g. monthly vs annually) increases the speed of wealth generation because interest is reinvested and begins generating additional interest sooner.</p>', isEnabled: true, order: 1 }
    ]
  },
  {
    id: 'calc_sip',
    name: 'SIP Calculator',
    slug: 'sip-calculator',
    subcategoryId: 'sub_investments_sip',
    categoryId: 'cat_investments',
    shortDescription: 'Determine your future mutual fund corpus and estimated earnings through Systematic Investment Plans (SIP).',
    seoTitle: 'SIP Calculator — Systematic Mutual Fund Growth Planner',
    seoDescription: 'Calculate future portfolio values and interest returns for systematic monthly investments (SIP) with standard charts.',
    seoKeywords: 'sip calculator, systematic investment plan, mutual fund return, monthly sip planner',
    isActive: true,
    fields: [
      { id: 'monthlyInvestment', label: 'Monthly Investment (₹)', type: 'number', defaultValue: 5000, prefix: '₹' },
      { id: 'rate', label: 'Expected Return Rate (% p.a.)', type: 'slider', defaultValue: 12, min: 1, max: 30, step: 0.5, suffix: '%' },
      { id: 'years', label: 'Duration (Years)', type: 'slider', defaultValue: 15, min: 1, max: 40, step: 1, suffix: 'yrs' }
    ],
    outputs: [
      { id: 'totalValue', label: 'Future Value of SIP Corpus', formula: 'totalValue', format: 'currency_inr', highlight: true },
      { id: 'estimatedReturns', label: 'Estimated Wealth Gains', formula: 'estimatedReturns', format: 'currency_inr' },
      { id: 'totalInvested', label: 'Total Capital Outlay', formula: 'totalInvested', format: 'currency_inr' }
    ],
    faqs: [
      { id: 'faq_sip_1', question: 'How does a mutual fund SIP calculate returns?', answer: '<p>A standard SIP formula assumes monthly compounding to match monthly contributions: FV = P × [ (1 + i)^n - 1 ] / i × (1 + i), where P is monthly payment, i is monthly return rate, and n is number of months.</p>', isEnabled: true, order: 1 }
    ]
  },
  {
    id: 'calc_step_up_sip',
    name: 'Step-Up SIP Calculator',
    slug: 'step-up-sip-calculator',
    subcategoryId: 'sub_investments_sip',
    categoryId: 'cat_investments',
    shortDescription: 'Plan your mutual fund wealth growth by systematically increasing your monthly SIP contributions by a fixed percentage each year.',
    seoTitle: 'Step-Up SIP Calculator — Dynamic Contribution Sizer',
    seoDescription: 'Calculate Step-Up SIP growth rates where contributions increase systematically by 5%, 10%, or 20% annually to match salary increases.',
    seoKeywords: 'step up sip, dynamic sip planner, annual step up calculator, mutual fund step up',
    isActive: true,
    fields: [
      { id: 'monthlyInvestment', label: 'Initial Monthly Investment (₹)', type: 'number', defaultValue: 10000, prefix: '₹' },
      { id: 'stepUpPercent', label: 'Annual Step-Up Rate (%)', type: 'slider', defaultValue: 10, min: 0, max: 50, step: 1, suffix: '%' },
      { id: 'rate', label: 'Expected Return Rate (% p.a.)', type: 'slider', defaultValue: 12, min: 1, max: 30, step: 0.5, suffix: '%' },
      { id: 'years', label: 'Duration (Years)', type: 'slider', defaultValue: 15, min: 1, max: 40, step: 1, suffix: 'yrs' }
    ],
    outputs: [
      { id: 'totalValue', label: 'Future Value of Step-Up Corpus', formula: 'totalValue', format: 'currency_inr', highlight: true },
      { id: 'estimatedReturns', label: 'Wealth Gains component', formula: 'estimatedReturns', format: 'currency_inr' },
      { id: 'totalInvested', label: 'Total Invested Outlay', formula: 'totalInvested', format: 'currency_inr' }
    ],
    faqs: [
      { id: 'faq_stepup_1', question: 'Why is Step-Up SIP superior to standard flat SIP?', answer: '<p>A Step-Up SIP coordinates your mutual fund investments with your professional career growth. Even a conservative 10% annual increase in contributions can generate up to double the total future corpus of a standard flat SIP over 15 to 20 years.</p>', isEnabled: true, order: 1 }
    ]
  },
  {
    id: 'calc_lump_sum_investment',
    name: 'Lump Sum Investment Calculator',
    slug: 'lump-sum-investment-calculator',
    subcategoryId: 'sub_investments_sip',
    categoryId: 'cat_investments',
    shortDescription: 'Project the compounded growth on a single, one-time mutual fund or equity investment over long timelines.',
    seoTitle: 'Lump Sum Calculator — One-Time Mutual Fund Sizer',
    seoDescription: 'Track compound growth for one-time capital investments under long-term equity or debt mutual fund return scales.',
    seoKeywords: 'lump sum calculator, one-time investment, compound returns mutual fund',
    isActive: true,
    fields: [
      { id: 'principal', label: 'One-Time Investment Sum (₹)', type: 'number', defaultValue: 100000, prefix: '₹' },
      { id: 'rate', label: 'Expected Annual Return (% p.a.)', type: 'slider', defaultValue: 12, min: 1, max: 30, step: 0.5, suffix: '%' },
      { id: 'years', label: 'Duration (Years)', type: 'slider', defaultValue: 15, min: 1, max: 40, step: 1, suffix: 'yrs' }
    ],
    outputs: [
      { id: 'totalValue', label: 'Compounded Future Value', formula: 'totalValue', format: 'currency_inr', highlight: true },
      { id: 'interestEarned', label: 'Estimated Wealth Gain', formula: 'interestEarned', format: 'currency_inr' }
    ],
    faqs: [
      { id: 'faq_lump_1', question: 'How is a lump sum calculation done?', answer: '<p>A lump sum mutual fund calculation utilizes standard annual compounding interest logic: Future Value = Principal × (1 + Return Rate)^Years.</p>', isEnabled: true, order: 1 }
    ]
  },
  {
    id: 'calc_swp',
    name: 'SWP Calculator',
    slug: 'swp-calculator',
    subcategoryId: 'sub_investments_sip',
    categoryId: 'cat_investments',
    shortDescription: 'Plan your monthly systematic withdrawals from an accumulated mutual fund corpus while compounding the remaining balance.',
    seoTitle: 'SWP Calculator — Systematic Withdrawal Plan Planner',
    seoDescription: 'Calculate monthly cash flows and project remaining portfolio value for systematic withdrawals (SWP) with safe return curves.',
    seoKeywords: 'swp calculator, systematic withdrawal plan, retirement monthly payout, corpus remaining balance',
    isActive: true,
    fields: [
      { id: 'totalInvestment', label: 'Accumulated Initial Corpus (₹)', type: 'number', defaultValue: 5000000, prefix: '₹' },
      { id: 'withdrawalAmount', label: 'Monthly Withdrawal Payout (₹)', type: 'number', defaultValue: 30000, prefix: '₹' },
      { id: 'rate', label: 'Expected Return Rate (% p.a.)', type: 'slider', defaultValue: 8.5, min: 1, max: 25, step: 0.1, suffix: '%' },
      { id: 'years', label: 'Duration of Withdrawals (Years)', type: 'slider', defaultValue: 15, min: 1, max: 40, step: 1, suffix: 'yrs' }
    ],
    outputs: [
      { id: 'remainingBalance', label: 'Remaining Portfolio Balance', formula: 'remainingBalance', format: 'currency_inr', highlight: true },
      { id: 'totalWithdrawn', label: 'Total Cash Payouts Withdrawn', formula: 'totalWithdrawn', format: 'currency_inr' },
      { id: 'totalInvested', label: 'Initial Outlay Corpus', formula: 'totalInvested', format: 'currency_inr' }
    ],
    faqs: [
      { id: 'faq_swp_1', question: 'Is SWP tax-efficient for retirement payouts?', answer: '<p>Yes. SWP withdrawals are subject to capital gains tax rather than ordinary slab income tax rates, making SWP highly tax-efficient compared to bank FD interest payouts or annuity plans.</p>', isEnabled: true, order: 1 }
    ]
  },
  {
    id: 'calc_cagr',
    name: 'CAGR Return Calculator',
    slug: 'cagr-calculator',
    subcategoryId: 'sub_investments_sip',
    categoryId: 'cat_investments',
    shortDescription: 'Determine the Compound Annual Growth Rate (CAGR) of any asset or investment portfolio over multiple years.',
    seoTitle: 'CAGR Calculator — Compound Annual Growth Rate Solver',
    seoDescription: 'Find the annualized compound growth rate (CAGR) and absolute returns from any investment’s initial and final balances.',
    seoKeywords: 'cagr calculator, compound annual growth rate, portfolio annualized return, absolute return rate',
    isActive: true,
    fields: [
      { id: 'initialValue', label: 'Initial Capital (₹)', type: 'number', defaultValue: 100000, prefix: '₹' },
      { id: 'finalValue', label: 'Final Portfolio Value (₹)', type: 'number', defaultValue: 250000, prefix: '₹' },
      { id: 'years', label: 'Investment Span (Years)', type: 'slider', defaultValue: 5, min: 0.5, max: 30, step: 0.5, suffix: 'yrs' }
    ],
    outputs: [
      { id: 'cagrFormatted', label: 'Compound Annual Growth Rate', formula: 'cagrFormatted', format: 'text', highlight: true },
      { id: 'absoluteReturnPercent', label: 'Absolute Return (%)', formula: 'absoluteReturnPercent', format: 'percent' }
    ],
    faqs: [
      { id: 'faq_cagr_1', question: 'What is CAGR and how does it differ from absolute returns?', answer: '<p>Absolute return only measures total percentage profit: ((Final - Initial) / Initial) × 100. CAGR factors in the time variable, telling you the steady annualized rate at which the investment grew each year.</p>', isEnabled: true, order: 1 }
    ]
  },

  // RETIREMENT
  {
    id: 'calc_epf',
    name: 'EPF Contribution Calculator',
    slug: 'epf-calculator',
    subcategoryId: 'sub_retirement_planning',
    categoryId: 'cat_retirement',
    shortDescription: 'Calculate the statutory monthly EPF contribution limits for both employees and employers based on basic salary components.',
    seoTitle: 'EPF Contribution Calculator — Statutory Salary Sizer',
    seoDescription: 'Calculate employee and employer statutory EPF contributions (12%) based on the latest Indian EPFO guidelines.',
    seoKeywords: 'epf contribution, employee provident fund, epfo statutory rate, monthly epf deduction',
    isActive: true,
    fields: [
      { id: 'base', label: 'Monthly Basic Salary + DA (₹)', type: 'number', defaultValue: 50000, prefix: '₹' },
      { id: 'employeeRate', label: 'Employee Statutory Rate (%)', type: 'slider', defaultValue: 12, min: 10, max: 20, suffix: '%' },
      { id: 'employerRate', label: 'Employer Statutory Rate (%)', type: 'slider', defaultValue: 12, min: 10, max: 20, suffix: '%' }
    ],
    outputs: [
      { id: 'total', label: 'Total Monthly EPF Contribution', formula: 'total', format: 'currency_inr', highlight: true },
      { id: 'employee', label: 'Employee Monthly Share', formula: 'employee', format: 'currency_inr' },
      { id: 'employer', label: 'Employer Monthly Share (EPF + EPS)', formula: 'employer', format: 'currency_inr' }
    ],
    faqs: [
      { id: 'faq_epf_1', question: 'What is the statutory EPF contribution rate?', answer: '<p>The standard statutory rate is 12% of your Basic Salary + Dearness Allowance (DA) contributed by the employee, and an equal 12% contributed by the employer (which is split between EPF and EPS schemes).</p>', isEnabled: true, order: 1 }
    ]
  },
  {
    id: 'calc_stamp_duty',
    name: 'Stamp Duty & Registration Calculator',
    slug: 'stamp-duty-calculator',
    subcategoryId: 'sub_retirement_planning',
    categoryId: 'cat_retirement',
    shortDescription: 'Calculate property stamp duty rates and government registration charges based on local transaction scales.',
    seoTitle: 'Stamp Duty & Registration Charges Calculator',
    seoDescription: 'Calculate government stamp duty and statutory registration fees for commercial or residential property transactions in India.',
    seoKeywords: 'stamp duty calculator, registration charges, property purchase taxes, government stamp duty scale',
    isActive: true,
    fields: [
      { id: 'propertyValue', label: 'Agreement / Market Property Value (₹)', type: 'number', defaultValue: 5000000, prefix: '₹' },
      { id: 'rate', label: 'Local Stamp Duty Rate (%)', type: 'slider', defaultValue: 5, min: 1, max: 15, step: 0.1, suffix: '%' },
      { id: 'registrationRate', label: 'Registration Charge Rate (%)', type: 'slider', defaultValue: 1, min: 0.1, max: 5, step: 0.1, suffix: '%' }
    ],
    outputs: [
      { id: 'totalGovernmentCharges', label: 'Total Statutory Charges', formula: 'totalGovernmentCharges', format: 'currency_inr', highlight: true },
      { id: 'stampDuty', label: 'Stamp Duty Payable', formula: 'stampDuty', format: 'currency_inr' },
      { id: 'registration', label: 'Registration Charges Payable', formula: 'registration', format: 'currency_inr' }
    ],
    faqs: [
      { id: 'faq_sd_1', question: 'What is stamp duty on property?', answer: '<p>Stamp duty is a statutory tax collected by the State Government for legalising property sale agreements and documents, calculated as a percentage of the transaction or circle rate value.</p>', isEnabled: true, order: 1 }
    ]
  },
  {
    id: 'calc_gratuity',
    name: 'Gratuity Calculator',
    slug: 'gratuity-calculator',
    subcategoryId: 'sub_retirement_planning',
    categoryId: 'cat_retirement',
    shortDescription: 'Calculate your statutory Gratuity eligibility and payout sum upon completing 5 or more years of continuous corporate service.',
    seoTitle: 'Gratuity Calculator — Payment of Gratuity Act Sizer',
    seoDescription: 'Calculate your tax-exempt and total Gratuity eligibility sum under the Payment of Gratuity Act 1972 guidelines.',
    seoKeywords: 'gratuity calculator, payment of gratuity act, tax exempt gratuity, continuous corporate service',
    isActive: true,
    fields: [
      { id: 'lastDrawnSalary', label: 'Monthly Last Drawn Basic + DA (₹)', type: 'number', defaultValue: 100000, prefix: '₹' },
      { id: 'completedYearsOfService', label: 'Completed Years of Service', type: 'slider', defaultValue: 8, min: 5, max: 40, step: 1, suffix: 'yrs' },
      { id: 'isCoveredUnderGratuityAct', label: 'Covered Under Gratuity Act? (Yes/No)', type: 'checkbox', defaultValue: true }
    ],
    outputs: [
      { id: 'gratuityAmount', label: 'Estimated Gratuity Amount', formula: 'gratuityAmount', format: 'currency_inr', highlight: true },
      { id: 'taxFreeLimit', label: 'Statutory Tax-Free Ceiling', formula: 'taxFreeLimit', format: 'currency_inr' },
      { id: 'taxableGratuity', label: 'Taxable Gratuity Component', formula: 'taxableGratuity', format: 'currency_inr' }
    ],
    faqs: [
      { id: 'faq_gratuity_rule', question: 'Are gratuity payouts tax-free?', answer: '<p>Under statutory guidelines, Gratuity is tax-free up to a lifetime cumulative ceiling of ₹20,00,000 for private-sector employees. Any excess received is added to taxable salary.</p>', isEnabled: true, order: 1 }
    ]
  },
  {
    id: 'calc_retirement_corpus',
    name: 'Retirement Corpus Sizer Calculator',
    slug: 'retirement-corpus-calculator',
    subcategoryId: 'sub_retirement_planning',
    categoryId: 'cat_retirement',
    shortDescription: 'Determine the retirement target corpus and monthly savings rate required to sustain your family lifestyle across your golden years.',
    seoTitle: 'Retirement Corpus Calculator — Pension Sizer Tool',
    seoDescription: 'Determine your future retirement target corpus and monthly savings requirements compounded with multi-rate inflation scales.',
    seoKeywords: 'retirement planning calculator, pension corpus sizer, inflation adjusted pension, post retirement returns',
    isActive: true,
    fields: [
      { id: 'monthlyExpensesToday', label: 'Current Monthly Expenses today (₹)', type: 'number', defaultValue: 50000, prefix: '₹' },
      { id: 'currentAge', label: 'Your Current Age', type: 'slider', defaultValue: 30, min: 18, max: 65, suffix: 'yrs' },
      { id: 'retirementAge', label: 'Target Retirement Age', type: 'slider', defaultValue: 60, min: 25, max: 75, suffix: 'yrs' },
      { id: 'lifeExpectancy', label: 'Expected Life Expectancy', type: 'slider', defaultValue: 85, min: 50, max: 100, suffix: 'yrs' },
      { id: 'inflationPercent', label: 'Expected Annual Inflation (% p.a.)', type: 'slider', defaultValue: 6, min: 1, max: 15, suffix: '%' },
      { id: 'preRetirementReturnPercent', label: 'Pre-Retirement Asset Return (% p.a.)', type: 'slider', defaultValue: 12, min: 1, max: 25, suffix: '%' },
      { id: 'postRetirementReturnPercent', label: 'Post-Retirement Safe Return (% p.a.)', type: 'slider', defaultValue: 8, min: 1, max: 20, suffix: '%' }
    ],
    outputs: [
      { id: 'targetCorpus', label: 'Required Target Corpus at Retirement', formula: 'targetCorpus', format: 'currency_inr', highlight: true },
      { id: 'monthlyExpensesAtRetirement', label: 'Inflated Expenses at Year 1 of Retirement', formula: 'monthlyExpensesAtRetirement', format: 'currency_inr' },
      { id: 'requiredMonthlySavings', label: 'Required Monthly Savings starting Today', formula: 'requiredMonthlySavings', format: 'currency_inr' }
    ],
    faqs: [
      { id: 'faq_corpus_size', question: 'How is the required retirement corpus determined?', answer: '<p>The calculator inflates your current monthly expenses to your planned retirement age. It then uses annuity-due formulas discounted at a post-retirement real rate of return to sustain these payouts over your entire retirement timeline.</p>', isEnabled: true, order: 1 }
    ]
  },

  // HEALTH & FITNESS
  {
    id: 'calc_bmi',
    name: 'BMI Calculator',
    slug: 'bmi-calculator',
    subcategoryId: 'sub_health_metrics',
    categoryId: 'cat_health_fitness',
    shortDescription: 'Calculate your Body Mass Index (BMI) and discover your safe weight ranges based on global healthcare scales.',
    seoTitle: 'BMI Calculator — Body Mass Index Sizer',
    seoDescription: 'Find your Body Mass Index (BMI) and compute ideal physical weight limits safely based on standard height ratios.',
    seoKeywords: 'bmi calculator, body mass index, healthy weight range, weight to height ratio',
    isActive: true,
    fields: [
      { id: 'weightKg', label: 'Current Weight (kg)', type: 'number', defaultValue: 70, min: 10, max: 300, suffix: 'kg' },
      { id: 'heightCm', label: 'Height (cm)', type: 'number', defaultValue: 170, min: 50, max: 250, suffix: 'cm' }
    ],
    outputs: [
      { id: 'bmi', label: 'Your Body Mass Index (BMI)', formula: 'bmi', format: 'decimal_2', highlight: true },
      { id: 'bmiCategory', label: 'Weight Classification', formula: 'bmiCategory', format: 'text' },
      { id: 'idealWeightMin', label: 'Minimum Ideal Weight (kg)', formula: 'idealWeightMin', format: 'decimal_2', suffix: 'kg' },
      { id: 'idealWeightMax', label: 'Maximum Ideal Weight (kg)', formula: 'idealWeightMax', format: 'decimal_2', suffix: 'kg' }
    ],
    faqs: [
      { id: 'faq_bmi_1', question: 'What is a healthy BMI classification?', answer: '<p>According to the WHO guidelines, a BMI under 18.5 is Underweight, 18.5 to 24.9 is Normal Weight, 25 to 29.9 is Overweight, and 30 or above is Obese.</p>', isEnabled: true, order: 1 }
    ]
  },
  {
    id: 'calc_bmr',
    name: 'BMR Calculator',
    slug: 'bmr-calculator',
    subcategoryId: 'sub_health_metrics',
    categoryId: 'cat_health_fitness',
    shortDescription: 'Determine your Basal Metabolic Rate (BMR) representing daily energy requirements at complete rest.',
    seoTitle: 'BMR Calculator — Basal Metabolic Rate Sizer',
    seoDescription: 'Find your Basal Metabolic Rate (BMR) using Mifflin-St Jeor metabolic physical calculation formulas.',
    seoKeywords: 'bmr calculator, basal metabolic rate, resting calorie burn, Mifflin St Jeor formula',
    isActive: true,
    fields: [
      { id: 'weightKg', label: 'Weight (kg)', type: 'number', defaultValue: 70, suffix: 'kg' },
      { id: 'heightCm', label: 'Height (cm)', type: 'number', defaultValue: 170, suffix: 'cm' },
      { id: 'ageYears', label: 'Age (Years)', type: 'slider', defaultValue: 30, min: 1, max: 100, suffix: 'yrs' },
      { id: 'gender', label: 'Biological Gender', type: 'select', defaultValue: 'male', options: [
        { label: 'Male', value: 'male' },
        { label: 'Female', value: 'female' }
      ]}
    ],
    outputs: [
      { id: 'bmr', label: 'Basal Metabolic Rate (BMR)', formula: 'bmr', format: 'integer', suffix: 'kcal/day', highlight: true }
    ],
    faqs: [
      { id: 'faq_bmr_1', question: 'What does BMR measure?', answer: '<p>Your BMR represents the total calories required to maintain primary biological life-support functions (breathing, circulation, cellular repair) at complete rest over a 24-hour timeline.</p>', isEnabled: true, order: 1 }
    ]
  },
  {
    id: 'calc_calorie_needs',
    name: 'Calorie & TDEE Calculator',
    slug: 'calorie-needs-calculator',
    subcategoryId: 'sub_health_metrics',
    categoryId: 'cat_health_fitness',
    shortDescription: 'Calculate your Total Daily Energy Expenditure (TDEE) and find calorie limits required to lose, maintain, or gain weight.',
    seoTitle: 'Calorie & TDEE Calculator — Daily Energy Sizer',
    seoDescription: 'Calculate your daily Caloric needs (TDEE) and target intake deficits safely to reach optimal physical weight goals.',
    seoKeywords: 'tdee calculator, daily calorie needs, weight loss calorie deficit, calorie intake surrender',
    isActive: true,
    fields: [
      { id: 'weightKg', label: 'Weight (kg)', type: 'number', defaultValue: 70, suffix: 'kg' },
      { id: 'heightCm', label: 'Height (cm)', type: 'number', defaultValue: 170, suffix: 'cm' },
      { id: 'ageYears', label: 'Age (Years)', type: 'slider', defaultValue: 30, min: 1, max: 100, suffix: 'yrs' },
      { id: 'gender', label: 'Biological Gender', type: 'select', defaultValue: 'male', options: [
        { label: 'Male', value: 'male' },
        { label: 'Female', value: 'female' }
      ]},
      { id: 'activityLevel', label: 'Daily Activity Level', type: 'select', defaultValue: 'sedentary', options: [
        { label: 'Sedentary (Office job / little exercise)', value: 'sedentary' },
        { label: 'Lightly Active (Light exercise 1-3 days/wk)', value: 'lightly_active' },
        { label: 'Moderately Active (Moderate exercise 3-5 days/wk)', value: 'moderately_active' },
        { label: 'Very Active (Heavy exercise 6-7 days/wk)', value: 'very_active' },
        { label: 'Extremely Active (Athletic physical training)', value: 'extremely_active' }
      ]}
    ],
    outputs: [
      { id: 'tdee', label: 'Total Daily Energy Expenditure (TDEE)', formula: 'tdee', format: 'integer', suffix: 'kcal/day', highlight: true },
      { id: 'bmr', label: 'Basal Metabolic Rate (BMR)', formula: 'bmr', format: 'integer', suffix: 'kcal/day' },
      { id: 'weightLossCalories', label: 'Weight Loss Target (-500 kcal)', formula: 'weightLossCalories', format: 'integer', suffix: 'kcal/day' },
      { id: 'weightGainCalories', label: 'Weight Gain Target (+500 kcal)', formula: 'weightGainCalories', format: 'integer', suffix: 'kcal/day' }
    ],
    faqs: [
      { id: 'faq_tdee_1', question: 'How is TDEE calculated?', answer: '<p>TDEE is calculated by first determining your resting BMR, and then multiplying this by an activity factor representing daily physical movement scaling.</p>', isEnabled: true, order: 1 }
    ]
  },

  // BUSINESS
  {
    id: 'calc_profit_margin',
    name: 'Profit Margin Calculator',
    slug: 'profit-margin-calculator',
    subcategoryId: 'sub_business_finance',
    categoryId: 'cat_business',
    shortDescription: 'Calculate gross profit totals and profit margins based on revenue receipts and cost ratios.',
    seoTitle: 'Profit Margin Calculator — Corporate Gross Profit Solver',
    seoDescription: 'Compute gross profit margins and business profitability scales safely based on revenue and cost sales.',
    seoKeywords: 'profit margin calculator, gross profit solver, margin percentage, revenue cost calculation',
    isActive: true,
    fields: [
      { id: 'revenue', label: 'Gross Revenue / Sales (₹)', type: 'number', defaultValue: 1000000, prefix: '₹' },
      { id: 'cost', label: 'Total Cost of Goods Sold (COGS) (₹)', type: 'number', defaultValue: 600000, prefix: '₹' }
    ],
    outputs: [
      { id: 'marginPercent', label: 'Gross Profit Margin (%)', formula: 'marginPercent', format: 'percent', highlight: true },
      { id: 'grossProfit', label: 'Gross Profit (₹)', formula: 'grossProfit', format: 'currency_inr' }
    ],
    faqs: [
      { id: 'faq_margin_1', question: 'What is the profit margin formula?', answer: '<p>The gross profit margin formula is: Margin % = ((Revenue - Cost) / Revenue) × 100.</p>', isEnabled: true, order: 1 }
    ]
  },
  {
    id: 'calc_markup',
    name: 'Markup Calculator',
    slug: 'markup-calculator',
    subcategoryId: 'sub_business_finance',
    categoryId: 'cat_business',
    shortDescription: 'Determine target selling prices by applying markup rates directly over wholesale cost pricing.',
    seoTitle: 'Markup Calculator — Selling Price Solver',
    seoDescription: 'Find the target retail selling price by applying markup percentage rates directly over wholesale costs.',
    seoKeywords: 'markup calculator, retail selling price, wholesale cost markup, corporate profit margin',
    isActive: true,
    fields: [
      { id: 'cost', label: 'Wholesale Unit Cost (₹)', type: 'number', defaultValue: 500, prefix: '₹' },
      { id: 'markupPercent', label: 'Markup Rate (%)', type: 'slider', defaultValue: 40, min: 0, max: 200, step: 1, suffix: '%' }
    ],
    outputs: [
      { id: 'sellingPrice', label: 'Target Retail Selling Price', formula: 'sellingPrice', format: 'currency_inr', highlight: true },
      { id: 'grossProfit', label: 'Markup Profit Component', formula: 'grossProfit', format: 'currency_inr' }
    ],
    faqs: [
      { id: 'faq_markup_1', question: 'What is the markup formula?', answer: '<p>Markup applies profit percentage directly over cost: Selling Price = Cost × (1 + Markup %). This differs from margin, which represents profit divided by selling price.</p>', isEnabled: true, order: 1 }
    ]
  },
  {
    id: 'calc_break_even',
    name: 'Break-Even Calculator',
    slug: 'break-even-calculator',
    subcategoryId: 'sub_business_finance',
    categoryId: 'cat_business',
    shortDescription: 'Calculate the minimum unit sales volume required to recover fixed operational overheads and achieve zero-loss operations.',
    seoTitle: 'Break-Even Calculator — Unit Sales Solver',
    seoDescription: 'Find your break-even operational thresholds in unit sales and revenue based on fixed and variable COGS overheads.',
    seoKeywords: 'break even calculator, corporate finance pivot, cost recovery units, fixed variable overheads',
    isActive: true,
    fields: [
      { id: 'fixedCosts', label: 'Annual Fixed Overhead Costs (₹)', type: 'number', defaultValue: 1000000, prefix: '₹' },
      { id: 'sellingPricePerUnit', label: 'Selling Price per Unit (₹)', type: 'number', defaultValue: 500, prefix: '₹' },
      { id: 'variableCostPerUnit', label: 'Variable Cost per Unit (₹)', type: 'number', defaultValue: 300, prefix: '₹' }
    ],
    outputs: [
      { id: 'breakEvenUnits', label: 'Required Break-Even Units', formula: 'breakEvenUnits', format: 'integer', highlight: true },
      { id: 'breakEvenSales', label: 'Required Break-Even Sales Revenue', formula: 'breakEvenSales', format: 'currency_inr' }
    ],
    faqs: [
      { id: 'faq_be_1', question: 'What is a break-even point?', answer: '<p>The break-even point is the sales volume where your gross revenue perfectly balances your fixed and variable operational costs, resulting in exactly zero profit or loss.</p>', isEnabled: true, order: 1 }
    ]
  },
  {
    id: 'calc_roi',
    name: 'ROI Calculator',
    slug: 'roi-calculator',
    subcategoryId: 'sub_business_finance',
    categoryId: 'cat_business',
    shortDescription: 'Evaluate Return on Investment (ROI) percentages and net gains from corporate investment projects.',
    seoTitle: 'ROI Calculator — Return on Investment Sizer',
    seoDescription: 'Find Return on Investment (ROI) and net capital gains based on initial and final returned valuations.',
    seoKeywords: 'roi calculator, return on investment, net corporate gains, project profitability scale',
    isActive: true,
    fields: [
      { id: 'amountInvested', label: 'Capital Invested Outlay (₹)', type: 'number', defaultValue: 500000, prefix: '₹' },
      { id: 'amountReturned', label: 'Total Returned Value (₹)', type: 'number', defaultValue: 750000, prefix: '₹' }
    ],
    outputs: [
      { id: 'roiPercent', label: 'Return on Investment (ROI)', formula: 'roiPercent', format: 'percent', highlight: true },
      { id: 'gain', label: 'Net Capital Gain (₹)', formula: 'gain', format: 'currency_inr' }
    ],
    faqs: [
      { id: 'faq_roi_1', question: 'How is standard ROI calculated?', answer: '<p>The standard Return on Investment (ROI) is calculated by dividing the net profit gain by the initial capital invested outlay, expressed as a percentage: ROI = ((Returned - Invested) / Invested) × 100.</p>', isEnabled: true, order: 1 }
    ]
  }
];

calcsToAdd.forEach(calc => {
  calc.modules = createDefaultModules(calc.slug);
  calc.contentSections = [
    {
      id: `sec_${calc.slug}_overview`,
      title: `${calc.name} Methodology & Planning Guide`,
      htmlContent: `<p>All calculations are structured strictly using high-precision, sandboxed deterministic math execution frameworks.</p><p>Use this tool to simulate various scenarios, configure variable inputs, and evaluate outcomes immediately. Results are calculated with zero latency and styled using highly accessible, responsive visualization pipelines.</p>`,
      isEnabled: true,
      order: 1,
      sectionType: 'overview'
    }
  ];

  const existing = db.calculators.find(c => c.id === calc.id || c.slug === calc.slug);
  if (!existing) {
    db.calculators.push(calc);
  } else {
    Object.assign(existing, calc);
  }
});

fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf8');
console.log(`[SEED SUCCESS] Successfully seeded ${categoriesToAdd.length} categories, ${subcategoriesToAdd.length} subcategories, and ${calcsToAdd.length} calculators in db.json.`);
