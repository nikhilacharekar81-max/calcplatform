import React from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  HelpCircle,
  Layers,
  Calculator,
  TrendingUp,
  FileText,
  AlertCircle,
  Clock,
  ArrowRight,
  Info,
  DollarSign,
  HelpCircle as QuestionIcon
} from 'lucide-react';

export const LifeInsuranceNeedsGuideContent: React.FC = () => {
  return (
    <div className="space-y-8 text-[#404145] font-sans">
      {/* Introduction Card */}
      <div className="bg-white rounded-3xl border border-[#e4e5e7] p-6 sm:p-10 shadow-xs space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#1dbf73] flex items-center justify-center border border-emerald-100 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-[#222325]">
              Life Insurance Needs Calculator
            </h2>
            <p className="text-xs sm:text-sm text-[#74767e]">
              Estimate how much life insurance cover your family may need based on your income, family expenses, loans, future goals, existing insurance and savings.
            </p>
          </div>
        </div>

        <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-medium">
          Enter your details to estimate your total financial need and the additional life insurance cover that may be required.
        </p>

        <div className="border-t border-slate-100 pt-6 space-y-4">
          <h3 className="text-lg font-bold text-[#222325]">Life Insurance Cover Needed</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            The right amount of life insurance is different for every family. A simple rule such as "10 times your annual income" can give you a quick starting point, but it does not consider your loans, family expenses, children's education, existing insurance or savings.
          </p>
          <p className="text-sm text-slate-600 leading-relaxed">
            This calculator takes those factors into account to give you a more personalised planning estimate.
          </p>
        </div>
      </div>

      {/* What This Calculator Considers */}
      <div className="bg-white rounded-3xl border border-[#e4e5e7] p-6 sm:p-10 shadow-xs space-y-6">
        <h3 className="text-lg sm:text-xl font-bold text-[#222325] flex items-center gap-2">
          <Layers className="w-5 h-5 text-emerald-600" />
          What This Calculator Considers
        </h3>
        <p className="text-sm text-slate-600 leading-relaxed">
          Your estimate is based on the financial responsibilities your family may need to manage if your income stops. It considers:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ul className="text-xs sm:text-sm text-slate-600 space-y-2.5 list-disc list-inside">
            <li>Annual family income</li>
            <li>Annual family expenses</li>
            <li>Number of years income may need to be replaced</li>
            <li>Outstanding home loan</li>
            <li>Other debts and loans</li>
          </ul>
          <ul className="text-xs sm:text-sm text-slate-600 space-y-2.5 list-disc list-inside">
            <li>Future education and family goals</li>
            <li>Final and emergency expenses</li>
            <li>Existing life insurance</li>
            <li>Savings and investments</li>
          </ul>
        </div>
        <p className="text-sm text-slate-600 leading-relaxed">
          The result shows both your estimated total financial need and the additional cover that may still be required.
        </p>
      </div>

      {/* How to Use the Life Insurance Needs Calculator */}
      <div className="bg-white rounded-3xl border border-[#e4e5e7] p-6 sm:p-10 shadow-xs space-y-6">
        <h3 className="text-lg sm:text-xl font-bold text-[#222325] flex items-center gap-2">
          <Calculator className="w-5 h-5 text-emerald-600" />
          How to Use the Life Insurance Needs Calculator
        </h3>
        
        <div className="space-y-6">
          <div className="flex gap-4">
            <span className="w-7 h-7 rounded-full bg-emerald-100 text-[#1dbf73] font-bold text-sm flex items-center justify-center shrink-0">1</span>
            <div>
              <h4 className="font-bold text-slate-900 text-sm sm:text-base">Enter your annual income</h4>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Enter your current yearly income. For example, if you earn ₹12 lakh per year, enter <strong>₹12,00,000</strong>.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <span className="w-7 h-7 rounded-full bg-emerald-100 text-[#1dbf73] font-bold text-sm flex items-center justify-center shrink-0">2</span>
            <div>
              <h4 className="font-bold text-slate-900 text-sm sm:text-base">Enter your annual family expenses</h4>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Think about how much your family needs each year for regular living costs such as housing, food, utilities, education and other household expenses.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <span className="w-7 h-7 rounded-full bg-emerald-100 text-[#1dbf73] font-bold text-sm flex items-center justify-center shrink-0">3</span>
            <div>
              <h4 className="font-bold text-slate-900 text-sm sm:text-base">Choose the income replacement period</h4>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Enter the number of years your family may need financial support from your income. For example, you might choose 15 years if your children or other dependants would need support for that period.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <span className="w-7 h-7 rounded-full bg-emerald-100 text-[#1dbf73] font-bold text-sm flex items-center justify-center shrink-0">4</span>
            <div>
              <h4 className="font-bold text-slate-900 text-sm sm:text-base">Add your outstanding loans</h4>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Enter your remaining home loan and other debts that your family may need to repay.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <span className="w-7 h-7 rounded-full bg-emerald-100 text-[#1dbf73] font-bold text-sm flex items-center justify-center shrink-0">5</span>
            <div>
              <h4 className="font-bold text-slate-900 text-sm sm:text-base">Add future family goals</h4>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Include major future requirements such as children's education or other important financial goals.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <span className="w-7 h-7 rounded-full bg-emerald-100 text-[#1dbf73] font-bold text-sm flex items-center justify-center shrink-0">6</span>
            <div>
              <h4 className="font-bold text-slate-900 text-sm sm:text-base">Add final and emergency expenses</h4>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Enter an estimate for expenses your family may face immediately after your death.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <span className="w-7 h-7 rounded-full bg-emerald-100 text-[#1dbf73] font-bold text-sm flex items-center justify-center shrink-0">7</span>
            <div>
              <h4 className="font-bold text-slate-900 text-sm sm:text-base">Enter existing life insurance</h4>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Include life insurance coverage you already have. If you have employer-provided life cover, consider whether that cover would continue if you changed jobs before including it as a long-term resource.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <span className="w-7 h-7 rounded-full bg-emerald-100 text-[#1dbf73] font-bold text-sm flex items-center justify-center shrink-0">8</span>
            <div>
              <h4 className="font-bold text-slate-900 text-sm sm:text-base">Enter savings and investments</h4>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Add savings and investments that could realistically be available to your family.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mathematical Need Formula */}
      <div className="bg-white rounded-3xl border border-[#e4e5e7] p-6 sm:p-10 shadow-xs space-y-6">
        <h3 className="text-lg sm:text-xl font-bold text-[#222325] flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-emerald-600" />
          How Is Life Insurance Need Calculated?
        </h3>
        <p className="text-sm text-slate-600 leading-relaxed">
          A needs-based calculation starts by estimating the financial obligations your family may have to meet. The calculator then subtracts resources that are already available.
        </p>

        <div className="p-5 bg-slate-900 text-white rounded-2xl font-mono text-xs sm:text-sm space-y-2 border border-slate-800 shadow-sm leading-relaxed">
          <p className="text-emerald-400 font-bold">Estimated Additional Cover = Total Financial Need − Existing Life Insurance − Available Savings & Investments</p>
          <div className="h-px bg-slate-800 my-2" />
          <p className="text-slate-300">Where Total Financial Need is computed as:</p>
          <p className="text-amber-400 font-semibold">Total Financial Need = Income Replacement + Loans and Debts + Future Family Goals + Final and Emergency Expenses</p>
        </div>

        <p className="text-sm text-slate-600 leading-relaxed">
          This approach is more useful than relying on a single income multiple because it connects the estimate to your family's actual financial situation. Needs-based calculators commonly use this type of income-replacement, debt, education and existing-resource framework.
        </p>
      </div>

      {/* Why Income Replacement Matters */}
      <div className="bg-white rounded-3xl border border-[#e4e5e7] p-6 sm:p-10 shadow-xs space-y-6">
        <h3 className="text-lg sm:text-xl font-bold text-[#222325] flex items-center gap-2">
          <FileText className="w-5 h-5 text-emerald-600" />
          Why Income Replacement Matters
        </h3>
        <p className="text-sm text-slate-600 leading-relaxed">
          For many families, the largest part of life insurance need is replacing the financial support provided by the person who earns the income.
        </p>
        <p className="text-sm text-slate-600 leading-relaxed">
          For example, suppose you earn <strong>₹12 lakh</strong> a year and decide that your family may need income support for 15 years. A simple calculation would start with:
        </p>
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs sm:text-sm font-bold text-[#222325] text-center">
          ₹12,00,000 × 15 = ₹1.80 crore
        </div>
        <p className="text-sm text-slate-600 leading-relaxed">
          That does not automatically mean you need ₹1.80 crore of new insurance. Your actual requirement can be higher or lower after considering debts, future goals, existing insurance and available savings.
        </p>
        <p className="text-sm text-slate-600 leading-relaxed">
          The calculator therefore shows the income-replacement component separately from the other financial needs.
        </p>
      </div>

      {/* Should You Use the 10x Income Rule? */}
      <div className="bg-white rounded-3xl border border-[#e4e5e7] p-6 sm:p-10 shadow-xs space-y-6">
        <h3 className="text-lg sm:text-xl font-bold text-[#222325] flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-emerald-600" />
          Should You Use the 10× Income Rule?
        </h3>
        <p className="text-sm text-slate-600 leading-relaxed">
          The 10× annual-income rule is easy to understand, but it is only a rough benchmark.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div className="p-5 bg-rose-50/60 border border-rose-200 rounded-2xl space-y-2">
            <h4 className="font-bold text-rose-900 text-sm">Simple 10× Benchmark</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Annual income = ₹12 lakh<br />
              <strong>10× income = ₹1.20 crore</strong>
            </p>
            <p className="text-xs text-rose-700 italic">
              Does not show how debts, assets, and future education goals alter your actual safety requirements.
            </p>
          </div>
          <div className="p-5 bg-emerald-50/60 border border-emerald-200 rounded-2xl space-y-2">
            <h4 className="font-bold text-emerald-900 text-sm">Needs-Based Reality</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              • ₹40 lakh home loan<br />
              • ₹10 lakh other debts<br />
              • ₹30 lakh education goal<br />
              • ₹20 lakh existing life insurance<br />
              • ₹10 lakh available savings
            </p>
            <p className="text-xs text-emerald-700 italic">
              Factors in both financial liabilities and resources to find your true cover gap.
            </p>
          </div>
        </div>
        <p className="text-sm text-slate-600 leading-relaxed">
          That is why a needs-based calculation can provide more useful context than a single income multiple.
        </p>
      </div>

      {/* Example: How the Calculation Works Table */}
      <div className="bg-white rounded-3xl border border-[#e4e5e7] p-6 sm:p-10 shadow-xs space-y-6">
        <h3 className="text-lg sm:text-xl font-bold text-[#222325]">Example: How the Calculation Works</h3>
        <p className="text-sm text-slate-600 leading-relaxed">
          Suppose a person has the following financial responsibilities and resources:
        </p>

        <div className="overflow-x-auto border border-slate-200 rounded-2xl">
          <table className="w-full text-xs sm:text-sm text-left text-slate-700 border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="p-4 font-bold text-slate-900">Financial Item</th>
                <th className="p-4 font-bold text-slate-900 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              <tr>
                <td className="p-4">Annual income</td>
                <td className="p-4 text-right font-mono">₹12 lakh</td>
              </tr>
              <tr>
                <td className="p-4">Annual family expenses</td>
                <td className="p-4 text-right font-mono">₹6 lakh</td>
              </tr>
              <tr>
                <td className="p-4">Income replacement period</td>
                <td className="p-4 text-right font-mono">15 years</td>
              </tr>
              <tr>
                <td className="p-4">Home loan</td>
                <td className="p-4 text-right font-mono">₹40 lakh</td>
              </tr>
              <tr>
                <td className="p-4">Other debts</td>
                <td className="p-4 text-right font-mono">₹10 lakh</td>
              </tr>
              <tr>
                <td className="p-4">Education & family goals</td>
                <td className="p-4 text-right font-mono">₹30 lakh</td>
              </tr>
              <tr>
                <td className="p-4">Final & emergency expenses</td>
                <td className="p-4 text-right font-mono">₹5 lakh</td>
              </tr>
              <tr className="bg-emerald-50/30 text-emerald-900">
                <td className="p-4">Existing life insurance</td>
                <td className="p-4 text-right font-mono">₹20 lakh</td>
              </tr>
              <tr className="bg-emerald-50/30 text-emerald-900">
                <td className="p-4">Savings & investments</td>
                <td className="p-4 text-right font-mono">₹10 lakh</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="text-sm text-slate-600 leading-relaxed">
          The calculator first estimates the family's financial needs. It then considers the insurance and financial resources already available. The remaining amount represents the estimated additional protection gap.
        </p>
        <p className="text-sm text-slate-600 leading-relaxed">
          Your actual result will depend on the figures you enter.
        </p>
      </div>

      {/* Explaining Key Concepts */}
      <div className="bg-white rounded-3xl border border-[#e4e5e7] p-6 sm:p-10 shadow-xs space-y-8">
        <div className="space-y-4">
          <h4 className="font-bold text-[#222325] text-base sm:text-lg">What Does "Additional Cover Required" Mean?</h4>
          <p className="text-sm text-slate-600 leading-relaxed">
            Additional cover required is the estimated amount of new life insurance that may be needed after considering your existing resources.
          </p>
          <p className="text-sm text-slate-600 leading-relaxed">
            For example, if your estimated financial need is <strong>₹1.50 crore</strong> and you already have ₹25 lakh of life insurance and ₹10 lakh of eligible savings:
          </p>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs sm:text-sm text-slate-700 text-center font-bold">
            ₹1.50 crore − ₹25 lakh − ₹10 lakh = ₹1.15 crore
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            Your estimated additional cover would therefore be <strong>₹1.15 crore</strong>. The result is an estimate, not a guaranteed recommendation for a particular insurance policy.
          </p>
        </div>

        <div className="h-px bg-slate-100" />

        <div className="space-y-4">
          <h4 className="font-bold text-[#222325] text-base sm:text-lg">What Should You Include as Existing Life Insurance?</h4>
          <p className="text-sm text-slate-600 leading-relaxed">
            Include life insurance policies that are currently active and expected to provide a death benefit to your family. This may include:
          </p>
          <ul className="text-xs sm:text-sm text-slate-600 space-y-1 list-disc list-inside">
            <li>Individual term insurance</li>
            <li>Other eligible life insurance policies</li>
            <li>Employer or group life insurance, where appropriate</li>
          </ul>
          <p className="text-sm text-slate-600 leading-relaxed">
            Be careful with employer-provided cover. If the benefit ends when you leave your job, it may not provide the same long-term protection as an individual policy.
          </p>
        </div>

        <div className="h-px bg-slate-100" />

        <div className="space-y-4">
          <h4 className="font-bold text-[#222325] text-base sm:text-lg">Should You Subtract Savings and Investments?</h4>
          <p className="text-sm text-slate-600 leading-relaxed">
            Savings and investments can reduce the amount of new insurance your family may need if those assets would actually be available to survivors. Examples may include:
          </p>
          <ul className="text-xs sm:text-sm text-slate-600 space-y-1 list-disc list-inside">
            <li>Bank savings</li>
            <li>Fixed deposits</li>
            <li>Liquid investments</li>
            <li>Other financial assets intended for family protection</li>
          </ul>
          <p className="text-sm text-slate-600 leading-relaxed">
            Do not automatically treat every asset as available for this purpose. For example, money already committed to another important goal may not realistically be available to replace income or repay debt.
          </p>
        </div>

        <div className="h-px bg-slate-100" />

        <div className="space-y-4">
          <h4 className="font-bold text-[#222325] text-base sm:text-lg">What About a Home Loan?</h4>
          <p className="text-sm text-slate-600 leading-relaxed">
            Your outstanding home loan can be an important part of your family's financial need. If you want the insurance benefit to help your family clear the remaining loan, include the outstanding balance in the calculator.
          </p>
          <p className="text-sm text-slate-600 leading-relaxed">
            The same principle applies to other debts such as: personal loans, car loans, education loans, credit-card balances, and other outstanding liabilities.
          </p>
        </div>

        <div className="h-px bg-slate-100" />

        <div className="space-y-4">
          <h4 className="font-bold text-[#222325] text-base sm:text-lg">What Should I Enter for Future Goals?</h4>
          <p className="text-sm text-slate-600 leading-relaxed">
            Think about major financial commitments your family may face in the future. For example: children's education, marriage-related financial goals, or other major family commitments.
          </p>
          <p className="text-sm text-slate-600 leading-relaxed">
            Use a reasonable estimate rather than trying to predict the exact future cost. If you are uncertain, you can run the calculator again with a higher or lower estimate and compare the results.
          </p>
        </div>
      </div>

      {/* Difference Panel */}
      <div className="bg-white rounded-3xl border border-[#e4e5e7] p-6 sm:p-10 shadow-xs space-y-6">
        <h3 className="text-lg sm:text-xl font-bold text-[#222325]">Life Insurance Needs vs Life Insurance Premium</h3>
        <p className="text-sm text-slate-600 leading-relaxed">
          These are two different questions:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
            <h4 className="font-bold text-slate-900 text-sm sm:text-base">Life Insurance Needs Calculator</h4>
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Answers:</p>
            <p className="text-sm font-bold text-slate-800">"How much life insurance cover might my family need?"</p>
            <p className="text-xs text-slate-600 leading-relaxed mt-2">
              It focuses on income, expenses, debts, future goals, existing insurance and available resources.
            </p>
          </div>

          <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
            <h4 className="font-bold text-slate-900 text-sm sm:text-base">Life Insurance Premium Calculator</h4>
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Answers:</p>
            <p className="text-sm font-bold text-slate-800">"How much might a particular insurance policy cost?"</p>
            <p className="text-xs text-slate-600 leading-relaxed mt-2">
              Premium calculations can depend on factors such as age, policy term, coverage amount, health information, smoking or tobacco use, insurer-specific pricing and underwriting.
            </p>
          </div>
        </div>
        <p className="text-xs text-slate-500 italic">
          * Note: This calculator does not provide an insurance premium quote.
        </p>
      </div>

      {/* Why Your Result Is an Estimate */}
      <div className="bg-white rounded-3xl border border-[#e4e5e7] p-6 sm:p-10 shadow-xs space-y-6">
        <h3 className="text-lg sm:text-xl font-bold text-[#222325]">Why Your Result Is an Estimate</h3>
        <p className="text-sm text-slate-600 leading-relaxed">
          No simple calculator can know every detail of your family's financial situation. Your actual requirement may change because of factors such as:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-slate-600 list-disc list-inside">
          <div>• Future income changes</div>
          <div>• Inflation</div>
          <div>• Changes in family expenses</div>
          <div>• New loans</div>
          <div>• Changes in children's education plans</div>
          <div>• Existing insurance benefits</div>
          <div>• Investment assets</div>
          <div>• Spouse or dependent income</div>
          <div>• Employer benefits</div>
          <div>• Retirement plans</div>
        </div>
        <p className="text-sm text-slate-600 leading-relaxed">
          For this reason, treat the result as a planning estimate, not an exact amount you must purchase. A useful approach is to change important assumptions and see how the result changes.
        </p>
      </div>

      {/* Try Different Scenarios */}
      <div className="bg-white rounded-3xl border border-[#e4e5e7] p-6 sm:p-10 shadow-xs space-y-6">
        <h3 className="text-lg sm:text-xl font-bold text-[#222325]">Try Different Scenarios</h3>
        <p className="text-sm text-slate-600 leading-relaxed">
          Your life insurance requirement can change significantly when one major assumption changes. For example, compare:
        </p>
        <ul className="text-xs sm:text-sm text-slate-600 space-y-1.5 list-disc list-inside font-medium">
          <li>10 years of income replacement</li>
          <li>15 years of income replacement</li>
          <li>20 years of income replacement</li>
        </ul>
        <p className="text-sm text-slate-600 leading-relaxed">
          You can also test what happens if: your income increases, your outstanding loan decreases, your existing insurance increases, your savings increase, or your future education goal changes.
        </p>
        <p className="text-sm text-slate-600 leading-relaxed">
          Looking at a few realistic scenarios can give you a better understanding of your coverage gap than relying on one number.
        </p>
      </div>

      {/* When Should You Recalculate Your Life Insurance Need? */}
      <div className="bg-white rounded-3xl border border-[#e4e5e7] p-6 sm:p-10 shadow-xs space-y-6">
        <h3 className="text-lg sm:text-xl font-bold text-[#222325]">When Should You Recalculate Your Life Insurance Need?</h3>
        <p className="text-sm text-slate-600 leading-relaxed">
          Consider reviewing your estimate when something important changes in your financial life. For example:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-slate-700 font-medium">
          <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">• You get married</div>
          <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">• You have a child</div>
          <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">• You take a large loan</div>
          <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">• You repay a major loan</div>
          <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">• Your income changes significantly</div>
          <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">• Your family expenses change</div>
          <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">• You buy additional life insurance</div>
          <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">• Your children become financially independent</div>
          <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">• You build significant savings or investments</div>
        </div>
        <p className="text-sm text-slate-600 leading-relaxed">
          Life insurance needs are not necessarily fixed forever.
        </p>
      </div>

      {/* Frequently Asked Questions */}
      <div className="bg-white rounded-3xl border border-[#e4e5e7] p-6 sm:p-10 shadow-xs space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shrink-0">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-black text-[#222325]">
              Frequently Asked Questions
            </h3>
            <p className="text-xs sm:text-sm text-[#74767e]">
              Answers to common life cover estimation questions.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <details className="group border border-slate-200 rounded-2xl overflow-hidden bg-[#fafafa]">
            <summary className="p-4 font-bold text-xs sm:text-sm text-[#222325] flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-100 transition-colors list-none">
              <span>How much life insurance do I need?</span>
              <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="p-4 pt-3 text-xs sm:text-sm text-[#404145] leading-relaxed border-t border-slate-100 bg-white">
              There is no single amount that works for everyone. Your requirement depends on your family's income needs, expenses, debts, future goals, existing insurance and available financial resources. This calculator provides a needs-based estimate to help you understand the approximate amount.
            </div>
          </details>

          <details className="group border border-slate-200 rounded-2xl overflow-hidden bg-[#fafafa]">
            <summary className="p-4 font-bold text-xs sm:text-sm text-[#222325] flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-100 transition-colors list-none">
              <span>Is 10 times my annual income enough?</span>
              <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="p-4 pt-3 text-xs sm:text-sm text-[#404145] leading-relaxed border-t border-slate-100 bg-white">
              Not necessarily. 10× income can be used as a quick starting benchmark, but it does not account for your specific debts, family goals, existing insurance or savings. A needs-based calculation can provide more context.
            </div>
          </details>

          <details className="group border border-slate-200 rounded-2xl overflow-hidden bg-[#fafafa]">
            <summary className="p-4 font-bold text-xs sm:text-sm text-[#222325] flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-100 transition-colors list-none">
              <span>Does the calculator calculate my insurance premium?</span>
              <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="p-4 pt-3 text-xs sm:text-sm text-[#404145] leading-relaxed border-t border-slate-100 bg-white">
              No. This calculator estimates the amount of life insurance coverage you may need. It does not calculate an insurer's premium. Premiums depend on the policy and insurer as well as factors used in underwriting.
            </div>
          </details>

          <details className="group border border-slate-200 rounded-2xl overflow-hidden bg-[#fafafa]">
            <summary className="p-4 font-bold text-xs sm:text-sm text-[#222325] flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-100 transition-colors list-none">
              <span>Should I include my home loan?</span>
              <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="p-4 pt-3 text-xs sm:text-sm text-[#404145] leading-relaxed border-t border-slate-100 bg-white">
              Yes, if you want your life insurance planning estimate to account for the outstanding home-loan balance. Enter the remaining amount rather than the original loan amount.
            </div>
          </details>

          <details className="group border border-slate-200 rounded-2xl overflow-hidden bg-[#fafafa]">
            <summary className="p-4 font-bold text-xs sm:text-sm text-[#222325] flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-100 transition-colors list-none">
              <span>Should I include other loans?</span>
              <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="p-4 pt-3 text-xs sm:text-sm text-[#404145] leading-relaxed border-t border-slate-100 bg-white">
              Yes. Include outstanding debts that your family may need to repay, such as personal loans, car loans, education loans or credit-card balances.
            </div>
          </details>

          <details className="group border border-slate-200 rounded-2xl overflow-hidden bg-[#fafafa]">
            <summary className="p-4 font-bold text-xs sm:text-sm text-[#222325] flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-100 transition-colors list-none">
              <span>Should I subtract my existing life insurance?</span>
              <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="p-4 pt-3 text-xs sm:text-sm text-[#404145] leading-relaxed border-t border-slate-100 bg-white">
              Yes. Existing life insurance can reduce the amount of additional cover your family may need.
            </div>
          </details>

          <details className="group border border-slate-200 rounded-2xl overflow-hidden bg-[#fafafa]">
            <summary className="p-4 font-bold text-xs sm:text-sm text-[#222325] flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-100 transition-colors list-none">
              <span>Should I subtract my savings?</span>
              <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="p-4 pt-3 text-xs sm:text-sm text-[#404145] leading-relaxed border-t border-slate-100 bg-white">
              Potentially. Savings and investments that are genuinely available to your family can reduce the amount that needs to be covered by new insurance.
            </div>
          </details>

          <details className="group border border-slate-200 rounded-2xl overflow-hidden bg-[#fafafa]">
            <summary className="p-4 font-bold text-xs sm:text-sm text-[#222325] flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-100 transition-colors list-none">
              <span>Does this calculator account for inflation?</span>
              <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="p-4 pt-3 text-xs sm:text-sm text-[#404145] leading-relaxed border-t border-slate-100 bg-white">
              If the calculator's inflation assumption is enabled, future financial needs can be adjusted based on the selected assumption. Remember that inflation is uncertain, so changing the assumption can change the result.
            </div>
          </details>

          <details className="group border border-slate-200 rounded-2xl overflow-hidden bg-[#fafafa]">
            <summary className="p-4 font-bold text-xs sm:text-sm text-[#222325] flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-100 transition-colors list-none">
              <span>Is this calculator financial advice?</span>
              <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="p-4 pt-3 text-xs sm:text-sm text-[#404145] leading-relaxed border-t border-slate-100 bg-white">
              No. It is an educational and financial-planning tool designed to help you estimate a potential coverage requirement. Your actual insurance needs may require a more detailed review of your family's circumstances, assets, liabilities and future goals.
            </div>
          </details>
        </div>
      </div>

      {/* Important Note */}
      <div className="bg-amber-50/70 border border-amber-200 rounded-3xl p-6 sm:p-10 space-y-4">
        <h3 className="text-base sm:text-lg font-bold text-amber-900 flex items-center gap-2">
          <Info className="w-5 h-5 text-amber-700" />
          Important Note
        </h3>
        <p className="text-xs sm:text-sm text-amber-800 leading-relaxed">
          This calculator provides an illustrative estimate for financial planning purposes. It is not an insurance quote, underwriting assessment, policy recommendation, tax advice or personalised financial advice.
        </p>
        <p className="text-xs sm:text-sm text-amber-800 leading-relaxed">
          The result depends on the information and assumptions entered. Actual life insurance needs can be different based on your family's circumstances, future income, expenses, assets, liabilities, employer benefits, existing policies and financial goals.
        </p>
        <p className="text-xs sm:text-sm text-amber-800 leading-relaxed font-semibold">
          Review important figures against your actual financial documents before making an insurance decision.
        </p>
      </div>
    </div>
  );
};
