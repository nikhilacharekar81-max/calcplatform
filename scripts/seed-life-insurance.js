import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_FILE = path.join(__dirname, '..', 'data', 'db.json');
const BACKUP_FILE = path.join(__dirname, '..', 'data', 'db_backup.json');

const CATEGORY_ID = 'cat_1791101453693_sszmv'; // Insurance Calculators
const SUBCATEGORY_ID = 'sub_1791102238540_jihxg'; // Life Insurance

const calculatorsToAdd = [
  {
    id: 'calc_term_insurance_calculator',
    name: 'Term Insurance Calculator',
    slug: 'term-insurance-calculator',
    shortDescription: 'Calculate recommended life insurance cover, income replacement, debt protection, and net protection gap with an interactive stacked breakdown.',
    categoryId: CATEGORY_ID,
    subcategoryId: SUBCATEGORY_ID,
    engineType: 'custom_formula',
    order: 1,
    isActive: true,
    isFeatured: true,
    seoTitle: 'Term Insurance Calculator India - Calculate Sum Assured & Protection Gap',
    seoDescription: 'Use our free Term Insurance Calculator to determine your recommended life cover based on age, income, dependents, debts, and future goals with stacked visual charts.',
    seoKeywords: 'term insurance calculator, life insurance sum assured, protection gap, term plan calculator',
    fields: [
      {
        id: 'age',
        label: 'Current Age',
        type: 'slider',
        defaultValue: 30,
        min: 18,
        max: 70,
        step: 1,
        suffix: ' Yrs',
        helpText: 'Your current age. Life insurance premiums increase with entry age.'
      },
      {
        id: 'annualIncome',
        label: 'Annual Income',
        type: 'slider',
        defaultValue: 1200000,
        min: 100000,
        max: 20000000,
        step: 50000,
        prefix: '₹',
        helpText: 'Your gross annual earned income from salary or profession.'
      },
      {
        id: 'monthlyExpenses',
        label: 'Monthly Living Expenses',
        type: 'slider',
        defaultValue: 45000,
        min: 5000,
        max: 1000000,
        step: 5000,
        prefix: '₹',
        helpText: 'Regular monthly household living expenses to sustain family lifestyle.'
      },
      {
        id: 'retirementAge',
        label: 'Planned Retirement Age',
        type: 'slider',
        defaultValue: 60,
        min: 45,
        max: 75,
        step: 1,
        suffix: ' Yrs',
        helpText: 'Target age when you plan to stop working and financial dependents become self-reliant.'
      },
      {
        id: 'dependents',
        label: 'Number of Dependents',
        type: 'slider',
        defaultValue: 2,
        min: 0,
        max: 10,
        step: 1,
        helpText: 'Number of family members relying on your income (spouse, children, dependent parents).'
      },
      {
        id: 'outstandingLoans',
        label: 'Outstanding Loans & Liabilities',
        type: 'slider',
        defaultValue: 2500000,
        min: 0,
        max: 50000000,
        step: 50000,
        prefix: '₹',
        helpText: 'Total unpaid debt balance across home loans, personal loans, car loans, and credit cards.'
      },
      {
        id: 'existingLifeCover',
        label: 'Existing Life Cover',
        type: 'slider',
        defaultValue: 2000000,
        min: 0,
        max: 50000000,
        step: 50000,
        prefix: '₹',
        helpText: 'Total sum assured of active life, term, or employer group insurance policies.'
      },
      {
        id: 'existingSavings',
        label: 'Savings & Investments',
        type: 'slider',
        defaultValue: 1000000,
        min: 0,
        max: 50000000,
        step: 50000,
        prefix: '₹',
        helpText: 'Liquid funds, fixed deposits, mutual funds, and shares available to the family.'
      },
      {
        id: 'futureFinancialGoals',
        label: 'Future Financial Goals',
        type: 'slider',
        defaultValue: 2000000,
        min: 0,
        max: 50000000,
        step: 50000,
        prefix: '₹',
        helpText: 'Estimated costs for upcoming milestones such as children higher education, marriage, etc.'
      },
      {
        id: 'inflationRate',
        label: 'Expected Inflation Rate',
        type: 'slider',
        defaultValue: 6,
        min: 3,
        max: 12,
        step: 0.5,
        suffix: '%',
        helpText: 'Projected annual inflation rate eroding future purchasing power.'
      }
    ],
    outputs: [
      {
        id: 'recommendedLifeCover',
        label: 'Recommended Life Cover',
        formula: 'recommendedLifeCover',
        format: 'currency',
        prefix: '₹'
      },
      {
        id: 'existingCover',
        label: 'Existing Cover',
        formula: 'existingCover',
        format: 'currency',
        prefix: '₹'
      },
      {
        id: 'protectionGap',
        label: 'Protection Gap',
        formula: 'protectionGap',
        format: 'currency',
        prefix: '₹'
      },
      {
        id: 'incomeReplacement',
        label: 'Income Replacement',
        formula: 'incomeReplacement',
        format: 'currency',
        prefix: '₹'
      },
      {
        id: 'loanProtection',
        label: 'Loan Protection',
        formula: 'loanProtection',
        format: 'currency',
        prefix: '₹'
      },
      {
        id: 'goalProtection',
        label: 'Goal Protection',
        formula: 'goalProtection',
        format: 'currency',
        prefix: '₹'
      }
    ],
    modules: [
      {
        id: 'mod_calculator-inputs',
        moduleId: 'calculator-inputs',
        name: 'Parameters & Inputs',
        isEnabled: true,
        order: 1,
        settings: {
          title: 'Term Insurance Parameters',
          layout: 'two-column',
          showResetButton: true
        }
      },
      {
        id: 'mod_result-cards',
        moduleId: 'result-cards',
        name: 'Recommended Coverage & Gap',
        isEnabled: true,
        order: 2,
        settings: {
          title: 'Coverage Analysis & Summary'
        }
      },
      {
        id: 'mod_chart-visualizer',
        moduleId: 'chart-visualizer',
        name: 'Visual Breakdown & Comparison',
        isEnabled: true,
        order: 3,
        settings: {
          chartType: 'bar',
          chartTitle: 'Total Needs Breakdown vs Existing Setup'
        }
      },
      {
        id: 'mod_faq-accordion',
        moduleId: 'faq-accordion',
        name: 'Frequently Asked Questions',
        isEnabled: true,
        order: 4,
        settings: {
          title: 'Frequently Asked Questions'
        }
      }
    ],
    faqs: [
      {
        id: 'faq_term_sum_assured',
        question: 'How much term life insurance cover do I need?',
        answer: '<p>A widely recommended financial rule of thumb is 10 to 15 times your gross annual income, plus the full value of any outstanding liabilities (home loans, car loans) and earmarked future milestones (children college education), minus your existing liquid savings.</p>',
        isEnabled: true,
        order: 1
      },
      {
        id: 'faq_term_protection_gap',
        question: 'What is a life insurance protection gap?',
        answer: '<p>The protection gap is the shortfall between the total financial resources your family would need to maintain their standard of living and settle debts in your absence, versus the actual life insurance and liquid assets currently in place.</p>',
        isEnabled: true,
        order: 2
      },
      {
        id: 'faq_term_gst_exemption',
        question: 'Is GST applicable on individual term life insurance in India?',
        answer: '<p>Following landmark GST council reforms, individual term life and health insurance premiums are eligible for 0% GST exemption, significantly reducing upfront policy premiums for policyholders.</p>',
        isEnabled: true,
        order: 3
      }
    ]
  },
  {
    id: 'calc_life_insurance_needs_calculator',
    name: 'Life Insurance Needs Calculator',
    slug: 'life-insurance-needs-calculator',
    shortDescription: 'Evaluate total financial obligations, future goals, and available resources to determine your exact life insurance protection gap.',
    categoryId: CATEGORY_ID,
    subcategoryId: SUBCATEGORY_ID,
    engineType: 'custom_formula',
    order: 2,
    isActive: true,
    isFeatured: true,
    seoTitle: 'Life Insurance Needs Calculator - Assess Your Coverage Needs',
    seoDescription: 'Calculate total life insurance needs by balancing family living expenses, loans, children goals, and available assets using our comprehensive comparison engine.',
    seoKeywords: 'life insurance needs calculator, insurance requirement, coverage gap, family protection',
    fields: [
      {
        id: 'age',
        label: 'Current Age',
        type: 'slider',
        defaultValue: 32,
        min: 18,
        max: 70,
        step: 1,
        suffix: ' Yrs',
        helpText: 'Your current age in years.'
      },
      {
        id: 'annualIncome',
        label: 'Annual Income',
        type: 'slider',
        defaultValue: 1500000,
        min: 100000,
        max: 20000000,
        step: 50000,
        prefix: '₹',
        helpText: 'Total annual income earned before taxes.'
      },
      {
        id: 'monthlyExpenses',
        label: 'Monthly Living Expenses',
        type: 'slider',
        defaultValue: 50000,
        min: 5000,
        max: 1000000,
        step: 5000,
        prefix: '₹',
        helpText: 'Monthly budget required for household groceries, rent, utilities, and lifestyle.'
      },
      {
        id: 'retirementAge',
        label: 'Planned Retirement Age',
        type: 'slider',
        defaultValue: 60,
        min: 45,
        max: 75,
        step: 1,
        suffix: ' Yrs',
        helpText: 'Target age to achieve financial independence.'
      },
      {
        id: 'dependents',
        label: 'Dependents Count',
        type: 'slider',
        defaultValue: 3,
        min: 0,
        max: 10,
        step: 1,
        helpText: 'Number of family members financially reliant on your earnings.'
      },
      {
        id: 'loans',
        label: 'Outstanding Loans & Liabilities',
        type: 'slider',
        defaultValue: 3000000,
        min: 0,
        max: 50000000,
        step: 50000,
        prefix: '₹',
        helpText: 'Total unpaid debt across mortgage, vehicle, and unsecured borrowings.'
      },
      {
        id: 'existingLifeCover',
        label: 'Existing Life Cover',
        type: 'slider',
        defaultValue: 2500000,
        min: 0,
        max: 50000000,
        step: 50000,
        prefix: '₹',
        helpText: 'Total death benefit sum assured across your current life insurance policies.'
      },
      {
        id: 'savings',
        label: 'Cash & Liquid Savings',
        type: 'slider',
        defaultValue: 500000,
        min: 0,
        max: 20000000,
        step: 25000,
        prefix: '₹',
        helpText: 'Liquid emergency funds in savings accounts and bank fixed deposits.'
      },
      {
        id: 'investments',
        label: 'Investments (Mutual Funds, EPF, Stocks)',
        type: 'slider',
        defaultValue: 1500000,
        min: 0,
        max: 50000000,
        step: 50000,
        prefix: '₹',
        helpText: 'Accumulated portfolio in retirement funds (EPF/PPF), mutual funds, and equities.'
      },
      {
        id: 'futureGoals',
        label: 'Future Major Goals',
        type: 'slider',
        defaultValue: 3000000,
        min: 0,
        max: 50000000,
        step: 50000,
        prefix: '₹',
        helpText: 'Capital earmarked for children higher education, marriage, and other major milestones.'
      },
      {
        id: 'inflationRate',
        label: 'Expected Inflation Rate',
        type: 'slider',
        defaultValue: 6,
        min: 3,
        max: 12,
        step: 0.5,
        suffix: '%',
        helpText: 'Anticipated long-term inflation rate.'
      },
      {
        id: 'investmentReturn',
        label: 'Expected Investment Return',
        type: 'slider',
        defaultValue: 8.5,
        min: 4,
        max: 15,
        step: 0.5,
        suffix: '%',
        helpText: 'Expected annualized growth rate on investment corpus.'
      }
    ],
    outputs: [
      {
        id: 'totalFinancialNeed',
        label: 'Total Financial Need',
        formula: 'totalFinancialNeed',
        format: 'currency',
        prefix: '₹'
      },
      {
        id: 'availableResources',
        label: 'Available Resources',
        formula: 'availableResources',
        format: 'currency',
        prefix: '₹'
      },
      {
        id: 'insuranceRequired',
        label: 'Insurance Required',
        formula: 'insuranceRequired',
        format: 'currency',
        prefix: '₹'
      },
      {
        id: 'protectionGap',
        label: 'Protection Gap',
        formula: 'protectionGap',
        format: 'currency',
        prefix: '₹'
      }
    ],
    modules: [
      {
        id: 'mod_calculator-inputs',
        moduleId: 'calculator-inputs',
        name: 'Parameters & Inputs',
        isEnabled: true,
        order: 1,
        settings: {
          title: 'Financial Needs Parameters',
          layout: 'two-column',
          showResetButton: true
        }
      },
      {
        id: 'mod_result-cards',
        moduleId: 'result-cards',
        name: 'Needs vs Resources Summary',
        isEnabled: true,
        order: 2,
        settings: {
          title: 'Protection Need Summary'
        }
      },
      {
        id: 'mod_chart-visualizer',
        moduleId: 'chart-visualizer',
        name: 'Comparison View',
        isEnabled: true,
        order: 3,
        settings: {
          chartType: 'bar',
          chartTitle: 'Total Financial Need vs Available Resources'
        }
      },
      {
        id: 'mod_faq-accordion',
        moduleId: 'faq-accordion',
        name: 'Frequently Asked Questions',
        isEnabled: true,
        order: 4,
        settings: {
          title: 'Frequently Asked Questions'
        }
      }
    ],
    faqs: [
      {
        id: 'faq_needs_approach',
        question: 'What is the Needs Analysis method in life insurance?',
        answer: '<p>The Needs Analysis approach estimates your family exact financial liabilities, ongoing discounted living expenditure till retirement or dependency completion, and key milestones, offsetting existing savings to calculate the precise net insurance deficit.</p>',
        isEnabled: true,
        order: 1
      },
      {
        id: 'faq_needs_inflation',
        question: 'Why does inflation matter in life insurance calculations?',
        answer: '<p>Inflation reduces the real purchasing power of money over time. A family expense of ₹50,000/month today will require over ₹1,60,000/month after 20 years at a 6% inflation rate. Accounting for inflation ensures your family is not underfunded.</p>',
        isEnabled: true,
        order: 2
      }
    ]
  },
  {
    id: 'calc_human_life_value_calculator',
    name: 'Human Life Value (HLV) Calculator',
    slug: 'human-life-value-calculator',
    shortDescription: 'Determine your true economic life value to your family based on future discounted net lifetime earnings, income growth, and inflation.',
    categoryId: CATEGORY_ID,
    subcategoryId: SUBCATEGORY_ID,
    engineType: 'custom_formula',
    order: 3,
    isActive: true,
    isFeatured: true,
    seoTitle: 'Human Life Value (HLV) Calculator - Economic Valuation of Life',
    seoDescription: 'Calculate your Human Life Value (HLV) to assess the exact present value of your future lifetime financial contributions with discounted growth curves.',
    seoKeywords: 'human life value calculator, hlv calculator, life insurance valuation, economic value of life',
    fields: [
      {
        id: 'age',
        label: 'Current Age',
        type: 'slider',
        defaultValue: 30,
        min: 18,
        max: 65,
        step: 1,
        suffix: ' Yrs',
        helpText: 'Your current age in completed years.'
      },
      {
        id: 'annualIncome',
        label: 'Annual Income',
        type: 'slider',
        defaultValue: 1200000,
        min: 100000,
        max: 20000000,
        step: 50000,
        prefix: '₹',
        helpText: 'Current gross annual earned income from career or business.'
      },
      {
        id: 'annualPersonalExpenses',
        label: 'Annual Personal Expenses',
        type: 'slider',
        defaultValue: 360000,
        min: 25000,
        max: 5000000,
        step: 25000,
        prefix: '₹',
        helpText: 'Personal living and consumption expenses consumed exclusively by you (typically 20% to 35% of income).'
      },
      {
        id: 'retirementAge',
        label: 'Planned Retirement Age',
        type: 'slider',
        defaultValue: 60,
        min: 45,
        max: 75,
        step: 1,
        suffix: ' Yrs',
        helpText: 'Age when professional income ceases.'
      },
      {
        id: 'expectedIncomeGrowth',
        label: 'Expected Income Growth',
        type: 'slider',
        defaultValue: 8,
        min: 0,
        max: 20,
        step: 0.5,
        suffix: '%',
        helpText: 'Anticipated average annual wage hike or career earnings growth rate.'
      },
      {
        id: 'inflationRate',
        label: 'Inflation Rate',
        type: 'slider',
        defaultValue: 6,
        min: 2,
        max: 12,
        step: 0.5,
        suffix: '%',
        helpText: 'Estimated rate of general retail inflation.'
      },
      {
        id: 'investmentReturn',
        label: 'Discount / Return Rate',
        type: 'slider',
        defaultValue: 7.5,
        min: 3,
        max: 15,
        step: 0.5,
        suffix: '%',
        helpText: 'Discount rate used to compute the present value of future earnings cashflows.'
      }
    ],
    outputs: [
      {
        id: 'humanLifeValue',
        label: 'Human Life Value (HLV)',
        formula: 'humanLifeValue',
        format: 'currency',
        prefix: '₹'
      },
      {
        id: 'futureIncomeValue',
        label: 'Future Income Value',
        formula: 'futureIncomeValue',
        format: 'currency',
        prefix: '₹'
      },
      {
        id: 'financialContribution',
        label: 'Financial Contribution',
        formula: 'financialContribution',
        format: 'currency',
        prefix: '₹'
      },
      {
        id: 'estimatedInsuranceRequirement',
        label: 'Estimated Insurance Requirement',
        formula: 'estimatedInsuranceRequirement',
        format: 'currency',
        prefix: '₹'
      }
    ],
    modules: [
      {
        id: 'mod_calculator-inputs',
        moduleId: 'calculator-inputs',
        name: 'Parameters & Inputs',
        isEnabled: true,
        order: 1,
        settings: {
          title: 'HLV Parameters',
          layout: 'two-column',
          showResetButton: true
        }
      },
      {
        id: 'mod_result-cards',
        moduleId: 'result-cards',
        name: 'HLV Economic Valuation',
        isEnabled: true,
        order: 2,
        settings: {
          title: 'Human Life Value Valuation'
        }
      },
      {
        id: 'mod_chart-visualizer',
        moduleId: 'chart-visualizer',
        name: 'Discounted Earnings Trajectory',
        isEnabled: true,
        order: 3,
        settings: {
          chartType: 'area',
          chartTitle: 'Present Value of Future Financial Contributions up to Retirement'
        }
      },
      {
        id: 'mod_faq-accordion',
        moduleId: 'faq-accordion',
        name: 'Frequently Asked Questions',
        isEnabled: true,
        order: 4,
        settings: {
          title: 'Frequently Asked Questions'
        }
      }
    ],
    faqs: [
      {
        id: 'faq_hlv_meaning',
        question: 'What is Human Life Value (HLV)?',
        answer: '<p>Human Life Value (HLV) is the present financial value of all future net earnings a person will contribute to their family over their remaining working lifetime, discounted back to present value using an appropriate discount rate.</p>',
        isEnabled: true,
        order: 1
      },
      {
        id: 'faq_hlv_vs_sum_assured',
        question: 'How is HLV used to determine life insurance?',
        answer: '<p>HLV represents your maximum economic replacement worth. Insurers typically cap the maximum term life insurance cover you can buy to your HLV to maintain the insurable interest principle.</p>',
        isEnabled: true,
        order: 2
      }
    ]
  }
];

try {
  const dbRaw = fs.readFileSync(DB_FILE, 'utf-8');
  const db = JSON.parse(dbRaw);

  if (!db.calculators) {
    db.calculators = [];
  }

  // Upsert the three calculators
  for (const newCalc of calculatorsToAdd) {
    const existingIndex = db.calculators.findIndex(c => c.slug === newCalc.slug || c.id === newCalc.id);
    if (existingIndex >= 0) {
      db.calculators[existingIndex] = { ...db.calculators[existingIndex], ...newCalc };
      console.log(`Updated existing calculator: ${newCalc.slug}`);
    } else {
      db.calculators.push(newCalc);
      console.log(`Added new calculator: ${newCalc.slug}`);
    }
  }

  const updatedRaw = JSON.stringify(db, null, 2);
  fs.writeFileSync(DB_FILE, updatedRaw, 'utf-8');
  if (fs.existsSync(BACKUP_FILE)) {
    fs.writeFileSync(BACKUP_FILE, updatedRaw, 'utf-8');
  }

  console.log('Successfully saved calculators to db.json and db_backup.json');
} catch (err) {
  console.error('Failed to seed calculators:', err);
  process.exit(1);
}
