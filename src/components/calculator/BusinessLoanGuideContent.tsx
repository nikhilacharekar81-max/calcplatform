import React from 'react';
import {
  Building2,
  TrendingUp,
  AlertCircle,
  ShieldCheck,
  Percent,
  Calendar,
  CheckCircle2,
  FileSpreadsheet,
  Briefcase,
  HelpCircle,
  Layers,
  ArrowRight,
  Info,
  DollarSign,
  AlertTriangle,
  Lightbulb,
  Check,
} from 'lucide-react';

export const BusinessLoanGuideContent: React.FC = () => {
  return (
    <div className="space-y-12 font-sans text-[#404145] leading-relaxed">
      {/* 1. Article Header & Intro */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800">
          <Briefcase className="w-3.5 h-3.5" />
          <span>Business Financing &amp; Working Capital</span>
        </div>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#222325] tracking-tight">
          Business Loan EMI Calculator
        </h2>
        <p className="text-base sm:text-lg text-[#62646a] leading-relaxed">
          Before taking a business loan, you need to know one basic number: <strong>how much will you have to pay every month?</strong>
        </p>
        <p className="text-sm sm:text-base text-[#62646a] leading-relaxed">
          The <strong>Business Loan EMI Calculator</strong> helps you estimate your monthly EMI, total interest and total repayment using your <strong>loan amount, interest rate and loan tenure</strong>. If your loan has a processing fee, you can also include it in the calculation to get a better idea of the amount you may actually receive.
        </p>
        <p className="text-sm sm:text-base text-[#62646a] leading-relaxed">
          The calculator is useful when comparing different loan amounts, interest rates and repayment periods before making a borrowing decision.
        </p>
      </div>

      {/* 2. Business Loan EMI Calculator at a Glance */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#1dbf73] flex items-center justify-center border border-emerald-100">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-[#222325]">
                Business Loan EMI Calculator at a Glance
              </h2>
              <p className="text-xs text-[#74767e]">
                Quick summary connecting inputs to outputs
              </p>
            </div>
          </div>
          <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
            Overview
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs sm:text-sm text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-900 font-bold border-b border-slate-200">
                <th className="p-3.5 w-1/3">What you enter</th>
                <th className="p-3.5 w-2/3">What you get</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[#404145]">
              <tr className="hover:bg-slate-50">
                <td className="p-3.5 font-bold text-[#222325]">Loan Amount</td>
                <td className="p-3.5">Amount you want to borrow</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="p-3.5 font-bold text-[#222325]">Interest Rate</td>
                <td className="p-3.5">Annual interest rate</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="p-3.5 font-bold text-[#222325]">Loan Tenure</td>
                <td className="p-3.5">Time available to repay the loan</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="p-3.5 font-bold text-[#222325]">Processing Fee</td>
                <td className="p-3.5">Optional fee charged by the lender</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="p-3.5 font-bold text-[#222325]">Monthly EMI</td>
                <td className="p-3.5 font-semibold text-emerald-700">Estimated monthly repayment</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="p-3.5 font-bold text-[#222325]">Total Interest</td>
                <td className="p-3.5 font-semibold text-amber-700">Estimated interest paid during the loan</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="p-3.5 font-bold text-[#222325]">Total Repayment</td>
                <td className="p-3.5 font-bold text-[#222325]">Principal plus estimated interest</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="p-3.5 font-bold text-[#222325]">Net Disbursed Amount</td>
                <td className="p-3.5">Estimated amount after the included processing fee, where applicable</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="p-3.5 font-bold text-[#222325]">Amortisation Schedule</td>
                <td className="p-3.5">Breakdown of principal, interest and outstanding balance</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="text-xs text-[#74767e] pt-2 italic font-semibold">
          The result is an estimate. Your actual EMI and loan cost depend on the terms offered by your lender.
        </p>
      </div>

      {/* How to Use the Business Loan EMI Calculator */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-6">
        <h2 className="text-xl font-extrabold text-[#222325]">
          How to Use the Business Loan EMI Calculator
        </h2>
        <p className="text-sm sm:text-base text-[#62646a]">
          Using the calculator is straightforward.
        </p>

        <div className="space-y-4">
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
            <h3 className="text-base font-bold text-[#222325]">Step 1: Enter the loan amount</h3>
            <p className="text-xs sm:text-sm text-[#62646a]">Enter the amount you want to borrow.</p>
            <p className="text-xs sm:text-sm font-mono font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg inline-block">
              For example: ₹10,00,000
            </p>
            <p className="text-xs sm:text-sm text-[#62646a] pt-1">
              Don't automatically enter the maximum amount a lender is willing to offer. Start with the amount your business actually needs.
            </p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
            <h3 className="text-base font-bold text-[#222325]">Step 2: Enter the interest rate</h3>
            <p className="text-xs sm:text-sm text-[#62646a]">Enter the annual interest rate offered by the lender.</p>
            <p className="text-xs sm:text-sm font-mono font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg inline-block">
              For example: 14% per year
            </p>
            <p className="text-xs sm:text-sm text-[#62646a] pt-1">
              If you are only planning and don't have a lender offer yet, you can enter an assumed rate and later replace it with the actual rate.
            </p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
            <h3 className="text-base font-bold text-[#222325]">Step 3: Enter the loan tenure</h3>
            <p className="text-xs sm:text-sm text-[#62646a]">Enter how long you plan to take to repay the loan.</p>
            <p className="text-xs sm:text-sm font-mono font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg inline-block">
              For example: 5 years
            </p>
            <p className="text-xs sm:text-sm text-[#62646a] pt-1">
              Depending on the calculator, you may be able to enter the tenure in years or months.
            </p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
            <h3 className="text-base font-bold text-[#222325]">Step 4: Add the processing fee if applicable</h3>
            <p className="text-xs sm:text-sm text-[#62646a]">
              If you know the processing fee, you can include it using the optional processing-fee field.
            </p>
            <p className="text-xs sm:text-sm text-[#62646a]">
              Depending on the available option, you may enter:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-[#62646a]">
              <li>A percentage of the loan amount</li>
              <li>A flat fee in rupees</li>
            </ul>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
            <h3 className="text-base font-bold text-[#222325]">Step 5: Check your results</h3>
            <p className="text-xs sm:text-sm text-[#62646a]">
              The calculator can show:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-[#62646a]">
              <li>Monthly EMI</li>
              <li>Total interest</li>
              <li>Total repayment</li>
              <li>Processing fee</li>
              <li>Net disbursed amount, where applicable</li>
              <li>Amortisation schedule</li>
            </ul>
            <p className="text-xs sm:text-sm text-[#62646a] pt-1">
              Try different combinations to see how the repayment changes.
            </p>
          </div>
        </div>
      </div>

      {/* 5. Business Loan EMI Example */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <h2 className="text-xl font-extrabold text-[#222325]">
          Business Loan EMI Example
        </h2>
        <p className="text-sm sm:text-base text-[#62646a]">
          Suppose you want to borrow:
        </p>
        <p className="text-base sm:text-lg font-black text-emerald-700">
          ₹10 lakh
        </p>
        <p className="text-sm sm:text-base text-[#62646a]">
          The assumed interest rate is:
        </p>
        <p className="text-base sm:text-lg font-bold text-[#222325]">
          14% per year
        </p>
        <p className="text-sm sm:text-base text-[#62646a]">
          And the repayment period is:
        </p>
        <p className="text-base sm:text-lg font-bold text-[#222325]">
          5 years
        </p>
        <p className="text-sm sm:text-base text-[#62646a]">
          Enter these three figures into the calculator.
        </p>
        <p className="text-sm sm:text-base text-[#62646a]">
          You will get an estimated monthly EMI along with the total interest and total repayment.
        </p>
        <p className="text-sm sm:text-base text-[#62646a]">
          Now change the tenure to 3 years.
        </p>
        <p className="text-sm sm:text-base text-[#62646a]">
          The monthly EMI will generally increase because you are repaying the same loan over a shorter period. However, the total interest can be lower because the loan is being repaid faster.
        </p>
        <p className="text-sm sm:text-base text-[#62646a]">
          Change the tenure again to 7 years and you can see the opposite effect: the monthly payment generally becomes lower, but the total interest can increase.
        </p>
        <p className="text-sm sm:text-base font-semibold text-[#222325]">
          This is why it helps to test more than one scenario.
        </p>
      </div>

      {/* 6. What Is EMI? */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <h2 className="text-xl font-extrabold text-[#222325]">
          What Is EMI?
        </h2>
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 font-bold text-sm sm:text-base">
          EMI stands for Equated Monthly Instalment. It is the amount you repay every month toward a loan.
        </div>
        <p className="text-sm sm:text-base text-[#62646a]">
          For a standard reducing-balance loan, an EMI contains both:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-sm sm:text-base text-[#62646a]">
          <li>A portion of the loan principal</li>
          <li>A portion of the interest</li>
        </ul>
        <p className="text-sm sm:text-base text-[#62646a]">
          As you continue making payments, the outstanding loan balance falls. The interest component can therefore change over the repayment period even when the scheduled EMI remains broadly the same.
        </p>
        <p className="text-xs sm:text-sm text-[#74767e] italic">
          The exact repayment structure depends on the loan agreement.
        </p>
      </div>

      {/* 7. What Information Does the Calculator Need? */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-6">
        <h2 className="text-xl font-extrabold text-[#222325]">
          What Information Does the Calculator Need?
        </h2>
        <p className="text-sm sm:text-base text-[#62646a]">
          The calculator mainly needs three numbers.
        </p>

        <div className="space-y-4">
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
            <h3 className="text-base font-bold text-[#222325]">Loan Amount</h3>
            <p className="text-xs sm:text-sm text-[#62646a]">This is the principal you want to borrow.</p>
            <p className="text-xs sm:text-sm text-[#62646a]">For example: ₹5 lakh, ₹10 lakh, ₹25 lakh, ₹50 lakh, ₹1 crore.</p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
            <h3 className="text-base font-bold text-[#222325]">Interest Rate</h3>
            <p className="text-xs sm:text-sm text-[#62646a]">This is the annual rate used to estimate the cost of borrowing.</p>
            <p className="text-xs sm:text-sm text-[#62646a]">Your actual rate can depend on the lender, loan product and your business and financial profile.</p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
            <h3 className="text-base font-bold text-[#222325]">Loan Tenure</h3>
            <p className="text-xs sm:text-sm text-[#62646a]">This is the repayment period.</p>
            <p className="text-xs sm:text-sm text-[#62646a]">It may be expressed in months or years.</p>
          </div>
        </div>

        <p className="text-sm sm:text-base font-semibold text-[#222325]">
          These three figures are enough to calculate the basic EMI.
        </p>
      </div>

      {/* 8. How Is Business Loan EMI Calculated? */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <h2 className="text-xl font-extrabold text-[#222325]">
          How Is Business Loan EMI Calculated?
        </h2>
        <p className="text-sm sm:text-base text-[#62646a]">
          For a standard reducing-balance loan, the commonly used EMI formula is:
        </p>
        <div className="p-5 rounded-2xl bg-slate-900 text-white font-mono text-center text-sm sm:text-base overflow-x-auto my-3">
          EMI = P &times; R &times; (1 + R)&supn; &divide; [(1 + R)&supn; &minus; 1]
        </div>
        <div className="text-xs sm:text-sm text-[#62646a] space-y-1.5">
          <p>Where:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>P</strong> = Principal loan amount</li>
            <li><strong>R</strong> = Monthly interest rate</li>
            <li><strong>N</strong> = Total number of monthly instalments</li>
          </ul>
        </div>
        <p className="text-xs sm:text-sm text-[#62646a]">
          The annual interest rate is converted into a monthly rate before the formula is applied.
        </p>
        <p className="text-xs sm:text-sm text-[#62646a]">
          You don't need to perform this calculation manually. Enter the figures into the calculator and it will calculate the estimated EMI for you.
        </p>
      </div>

      {/* 9. How Does the Loan Amount Affect Your EMI? */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <h2 className="text-xl font-extrabold text-[#222325]">
          How Does the Loan Amount Affect Your EMI?
        </h2>
        <p className="text-sm sm:text-base text-[#62646a]">
          If the interest rate and tenure stay the same, borrowing more generally means paying a higher EMI.
        </p>
        <p className="text-sm sm:text-base text-[#62646a]">
          For example, compare:
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-xs sm:text-sm text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-900 font-bold border-b border-slate-200">
                <th className="p-3 text-right">Loan Amount</th>
                <th className="p-3 text-right">Interest Rate</th>
                <th className="p-3 text-right">Tenure</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[#404145]">
              <tr className="hover:bg-slate-50">
                <td className="p-3 text-right font-bold text-[#222325]">₹10 lakh</td>
                <td className="p-3 text-right">Same</td>
                <td className="p-3 text-right">Same</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="p-3 text-right font-bold text-[#222325]">₹15 lakh</td>
                <td className="p-3 text-right">Same</td>
                <td className="p-3 text-right">Same</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="p-3 text-right font-bold text-[#222325]">₹20 lakh</td>
                <td className="p-3 text-right">Same</td>
                <td className="p-3 text-right">Same</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="text-sm sm:text-base text-[#62646a] pt-2">
          The calculator lets you compare the resulting EMI and total repayment.
        </p>
        <p className="text-sm sm:text-base text-[#62646a]">
          This can help you decide whether you actually need the larger loan amount.
        </p>
        <p className="text-sm sm:text-base font-semibold text-[#222325]">
          A higher loan limit from a lender doesn't mean you have to use all of it.
        </p>
      </div>

      {/* 10. How Does the Interest Rate Affect Your EMI? */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <h2 className="text-xl font-extrabold text-[#222325]">
          How Does the Interest Rate Affect Your EMI?
        </h2>
        <p className="text-sm sm:text-base text-[#62646a]">
          The interest rate directly affects the cost of borrowing.
        </p>
        <p className="text-sm sm:text-base text-[#62646a]">
          Suppose you keep the loan amount and tenure unchanged and compare:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-sm sm:text-base text-[#62646a]">
          <li>12%</li>
          <li>13%</li>
          <li>14%</li>
          <li>15%</li>
        </ul>
        <p className="text-sm sm:text-base text-[#62646a]">
          The EMI and total interest will change.
        </p>
        <p className="text-sm sm:text-base text-[#62646a]">
          Even a small difference in the interest rate can become meaningful when the loan is large or the repayment period is long.
        </p>
        <p className="text-xs sm:text-sm text-[#74767e] italic">
          When you have an actual loan offer, use the lender's quoted rate rather than an estimated rate.
        </p>
      </div>

      {/* 11. How Does Tenure Affect Your EMI? */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <h2 className="text-xl font-extrabold text-[#222325]">
          How Does Tenure Affect Your EMI?
        </h2>
        <p className="text-sm sm:text-base text-[#62646a]">
          Tenure creates a trade-off between your monthly payment and the total interest.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
            <h3 className="text-base font-bold text-[#222325]">Shorter tenure</h3>
            <p className="text-xs text-[#62646a]">A shorter repayment period generally means:</p>
            <ul className="list-disc pl-5 space-y-1 text-xs text-[#62646a]">
              <li>Higher EMI</li>
              <li>Fewer instalments</li>
              <li>Lower total interest</li>
            </ul>
          </div>
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
            <h3 className="text-base font-bold text-[#222325]">Longer tenure</h3>
            <p className="text-xs text-[#62646a]">A longer repayment period generally means:</p>
            <ul className="list-disc pl-5 space-y-1 text-xs text-[#62646a]">
              <li>Lower EMI</li>
              <li>More instalments</li>
              <li>Higher total interest</li>
            </ul>
          </div>
        </div>

        <p className="text-sm sm:text-base text-[#62646a] pt-2">
          So don't choose a loan tenure simply because it gives you the lowest EMI.
        </p>
        <p className="text-sm sm:text-base font-bold text-[#222325]">
          Look at the <strong>total interest</strong> as well.
        </p>
      </div>

      {/* 12. Should You Choose a Short or Long Business Loan Tenure? */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <h2 className="text-xl font-extrabold text-[#222325]">
          Should You Choose a Short or Long Business Loan Tenure?
        </h2>
        <p className="text-sm sm:text-base text-[#62646a]">
          There isn't one repayment period that works for every business.
        </p>
        <p className="text-sm sm:text-base text-[#62646a]">
          A shorter tenure may suit a business with strong and predictable cash flow that can comfortably manage a larger EMI.
        </p>
        <p className="text-sm sm:text-base text-[#62646a]">
          A longer tenure may reduce the monthly pressure and leave more cash available for everyday business needs.
        </p>
        <p className="text-sm sm:text-base text-[#62646a]">
          Before choosing a tenure, consider:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-[#62646a]">
          <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl border border-slate-200">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Monthly business expenses</span>
          </div>
          <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl border border-slate-200">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Existing loan EMIs</span>
          </div>
          <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl border border-slate-200">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Employee salaries</span>
          </div>
          <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl border border-slate-200">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Rent</span>
          </div>
          <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl border border-slate-200">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Supplier payments</span>
          </div>
          <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl border border-slate-200">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Inventory requirements</span>
          </div>
          <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl border border-slate-200">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Seasonal changes in sales</span>
          </div>
          <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl border border-slate-200">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Emergency cash requirements</span>
          </div>
        </div>
        <p className="text-sm sm:text-base font-semibold text-[#222325] pt-2">
          The EMI should fit your business cash flow, including months when revenue is weaker.
        </p>
      </div>

      {/* 13. What Is a Business Loan Processing Fee? */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <h2 className="text-xl font-extrabold text-[#222325]">
          What Is a Business Loan Processing Fee?
        </h2>
        <p className="text-sm sm:text-base text-[#62646a]">
          A processing fee is a charge that a lender may apply when processing a loan.
        </p>
        <p className="text-sm sm:text-base text-[#62646a]">
          The amount can vary between lenders and loan products.
        </p>
        <p className="text-sm sm:text-base text-[#62646a]">
          A lender may charge the fee as:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-sm sm:text-base text-[#62646a]">
          <li>A percentage of the loan amount</li>
          <li>A flat amount</li>
          <li>A fee subject to minimum or maximum limits</li>
        </ul>
        <p className="text-sm sm:text-base text-[#62646a]">
          If your calculator has an optional processing-fee field, you can enter the applicable fee to see how it affects the amount you may receive.
        </p>
        <p className="text-sm sm:text-base text-[#62646a]">
          For example, if the approved loan amount is ₹10 lakh and a processing fee is deducted before disbursement, the amount credited to your account may be lower than ₹10 lakh.
        </p>
        <p className="text-xs sm:text-sm text-[#74767e] italic font-semibold">
          Check your lender's actual fee schedule before using the calculator for final financial planning.
        </p>
      </div>

      {/* 14. Why Net Disbursed Amount Matters */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <h2 className="text-xl font-extrabold text-[#222325]">
          Why Net Disbursed Amount Matters
        </h2>
        <p className="text-sm sm:text-base text-[#62646a]">
          There is a difference between the <strong>loan amount approved</strong> and the <strong>amount that reaches your bank account</strong> when certain charges are deducted from the loan proceeds.
        </p>
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1 text-xs sm:text-sm">
          <p><strong>Approved loan amount:</strong> ₹10,00,000</p>
          <p><strong>Processing fee:</strong> ₹X</p>
          <p className="font-bold text-emerald-700"><strong>Amount received:</strong> ₹X</p>
        </div>
        <p className="text-sm sm:text-base text-[#62646a]">
          The exact amount depends on the lender's terms and the charges applicable to your loan.
        </p>
        <p className="text-sm sm:text-base text-[#62646a]">
          This is why including a known processing fee in your calculation can give you a more realistic view of the funds available for your business.
        </p>
      </div>

      {/* 15. What Is Total Interest? */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <h2 className="text-xl font-extrabold text-[#222325]">
          What Is Total Interest?
        </h2>
        <p className="text-sm sm:text-base text-[#62646a]">
          Total interest is the estimated amount you pay toward interest over the entire loan tenure.
        </p>
        <p className="text-sm sm:text-base text-[#62646a]">
          It is separate from the original amount you borrowed.
        </p>
        <p className="text-sm sm:text-base text-[#62646a]">
          For example, if you borrow ₹10 lakh, the total amount you repay can be higher than ₹10 lakh because of interest.
        </p>
        <p className="text-sm sm:text-base font-semibold text-[#222325]">
          The calculator helps you see this cost before you take the loan.
        </p>
      </div>

      {/* 16. What Is Total Repayment? */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <h2 className="text-xl font-extrabold text-[#222325]">
          What Is Total Repayment?
        </h2>
        <p className="text-sm sm:text-base text-[#62646a]">
          Total repayment is the estimated amount you pay toward the principal and interest during the complete loan period.
        </p>
        <p className="text-sm sm:text-base text-[#62646a]">
          In a basic EMI calculation:
        </p>
        <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 text-center text-sm font-bold text-[#222325]">
          Total Repayment = Principal + Total Interest
        </div>
        <p className="text-sm sm:text-base text-[#62646a]">
          Processing fees and other lender charges may be separate depending on how the loan is structured.
        </p>
        <p className="text-sm sm:text-base text-[#62646a]">
          That's why you should check the lender's complete loan terms rather than relying only on the EMI figure.
        </p>
      </div>

      {/* 17. What Is an Amortisation Schedule? */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <h2 className="text-xl font-extrabold text-[#222325]">
          What Is an Amortisation Schedule?
        </h2>
        <p className="text-sm sm:text-base text-[#62646a]">
          An amortisation schedule shows how your loan repayment changes over time.
        </p>
        <p className="text-sm sm:text-base text-[#62646a]">
          It can show:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-sm sm:text-base text-[#62646a]">
          <li>Opening loan balance</li>
          <li>EMI</li>
          <li>Principal paid</li>
          <li>Interest paid</li>
          <li>Closing loan balance</li>
        </ul>
        <p className="text-sm sm:text-base text-[#62646a] pt-2">
          A simplified example looks like this:
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-xs sm:text-sm text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-900 font-bold border-b border-slate-200">
                <th className="p-3 text-right">Payment</th>
                <th className="p-3 text-right">EMI</th>
                <th className="p-3 text-right">Principal</th>
                <th className="p-3 text-right">Interest</th>
                <th className="p-3 text-right">Remaining Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[#404145]">
              <tr className="hover:bg-slate-50">
                <td className="p-3 text-right font-semibold">1</td>
                <td className="p-3 text-right">₹X</td>
                <td className="p-3 text-right">₹X</td>
                <td className="p-3 text-right">₹X</td>
                <td className="p-3 text-right">₹X</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="p-3 text-right font-semibold">2</td>
                <td className="p-3 text-right">₹X</td>
                <td className="p-3 text-right">₹X</td>
                <td className="p-3 text-right">₹X</td>
                <td className="p-3 text-right">₹X</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="p-3 text-right font-semibold">3</td>
                <td className="p-3 text-right">₹X</td>
                <td className="p-3 text-right">₹X</td>
                <td className="p-3 text-right">₹X</td>
                <td className="p-3 text-right">₹X</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="text-xs sm:text-sm text-[#62646a] pt-2">
          The actual numbers depend on your loan amount, interest rate and tenure.
        </p>
        <p className="text-xs sm:text-sm text-[#62646a]">
          If your calculator provides a full amortisation schedule, you can use it to see how quickly the outstanding balance falls.
        </p>
      </div>

      {/* 18. Business Loan EMI for Different Business Needs */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-6">
        <h2 className="text-xl font-extrabold text-[#222325]">
          Business Loan EMI for Different Business Needs
        </h2>
        <p className="text-sm sm:text-base text-[#62646a]">
          Businesses borrow money for different reasons.
        </p>
        <p className="text-sm sm:text-base text-[#62646a]">
          You might need financing for:
        </p>

        <div className="space-y-4">
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <h3 className="text-base font-bold text-[#222325]">Equipment</h3>
            <p className="text-xs sm:text-sm text-[#62646a]">Buying machinery, computers, commercial equipment or other business assets.</p>
          </div>
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <h3 className="text-base font-bold text-[#222325]">Expansion</h3>
            <p className="text-xs sm:text-sm text-[#62646a]">Opening another location or increasing production capacity.</p>
          </div>
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <h3 className="text-base font-bold text-[#222325]">Inventory</h3>
            <p className="text-xs sm:text-sm text-[#62646a]">Purchasing additional stock before a busy sales period.</p>
          </div>
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <h3 className="text-base font-bold text-[#222325]">Renovation</h3>
            <p className="text-xs sm:text-sm text-[#62646a]">Improving a shop, office, restaurant, clinic or other commercial space.</p>
          </div>
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <h3 className="text-base font-bold text-[#222325]">Working Capital</h3>
            <p className="text-xs sm:text-sm text-[#62646a]">Managing regular business expenses when cash flow is temporarily tight.</p>
          </div>
        </div>

        <p className="text-sm sm:text-base text-[#62646a] pt-2">
          The reason for borrowing matters.
        </p>
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 font-bold text-sm sm:text-base">
          Before deciding how much to borrow, ask yourself: &ldquo;How much does my business actually need, and what EMI can it comfortably afford?&rdquo;
        </div>
      </div>

      {/* 19. Can an EMI Calculator Tell You Whether Your Loan Will Be Approved? */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <h2 className="text-xl font-extrabold text-[#222325]">
          Can an EMI Calculator Tell You Whether Your Loan Will Be Approved?
        </h2>
        <p className="text-base sm:text-lg font-bold text-rose-600">
          No.
        </p>
        <p className="text-sm sm:text-base text-[#62646a]">
          An EMI calculator only estimates repayment.
        </p>
        <p className="text-sm sm:text-base text-[#62646a]">
          It does not check whether you qualify for a particular business loan or guarantee that a lender will approve your application.
        </p>
        <p className="text-sm sm:text-base text-[#62646a]">
          Lenders may consider:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-[#62646a]">
          <li>Credit history</li>
          <li>Business turnover</li>
          <li>Financial statements</li>
          <li>Existing liabilities</li>
          <li>Banking history</li>
          <li>Business age</li>
          <li>Cash flow</li>
          <li>Documents</li>
          <li>Business profile</li>
          <li>Their own lending criteria</li>
        </ul>
        <p className="text-xs sm:text-sm text-[#74767e] pt-2 font-semibold">
          Use the calculator for <strong>repayment planning</strong>, not as an approval checker.
        </p>
      </div>

      {/* 20. Common Business Loan EMI Mistakes */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-6">
        <h2 className="text-xl font-extrabold text-[#222325]">
          Common Business Loan EMI Mistakes
        </h2>

        <div className="space-y-4">
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <h3 className="text-base font-bold text-[#222325]">Looking only at the EMI</h3>
            <p className="text-xs sm:text-sm text-[#62646a]">A low EMI can result from a longer tenure. Check total interest too.</p>
          </div>
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <h3 className="text-base font-bold text-[#222325]">Borrowing more than you need</h3>
            <p className="text-xs sm:text-sm text-[#62646a]">A larger loan means a larger repayment obligation.</p>
          </div>
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <h3 className="text-base font-bold text-[#222325]">Ignoring the interest rate</h3>
            <p className="text-xs sm:text-sm text-[#62646a]">The rate has a direct effect on the cost of borrowing.</p>
          </div>
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <h3 className="text-base font-bold text-[#222325]">Forgetting processing fees</h3>
            <p className="text-xs sm:text-sm text-[#62646a]">A processing fee can reduce the amount you actually receive.</p>
          </div>
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <h3 className="text-base font-bold text-[#222325]">Choosing a long tenure only because the EMI is lower</h3>
            <p className="text-xs sm:text-sm text-[#62646a]">A lower monthly payment can come with higher total interest.</p>
          </div>
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <h3 className="text-base font-bold text-[#222325]">Using an estimated rate as a final rate</h3>
            <p className="text-xs sm:text-sm text-[#62646a]">Your calculator result changes when the interest rate changes. Use the lender's actual rate when you have it.</p>
          </div>
        </div>
      </div>

      {/* 21. How to Compare Different Business Loan Scenarios */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-6">
        <h2 className="text-xl font-extrabold text-[#222325]">
          How to Compare Different Business Loan Scenarios
        </h2>
        <p className="text-sm sm:text-base text-[#62646a]">
          You don't have to settle on the first calculation.
        </p>
        <p className="text-sm sm:text-base text-[#62646a]">
          Try several scenarios.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
            <h3 className="text-base font-bold text-[#222325]">Scenario 1: Change the loan amount</h3>
            <p className="text-xs sm:text-sm text-[#62646a]">Compare ₹10 lakh, ₹15 lakh and ₹20 lakh.</p>
          </div>
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
            <h3 className="text-base font-bold text-[#222325]">Scenario 2: Change the interest rate</h3>
            <p className="text-xs sm:text-sm text-[#62646a]">Compare different rates offered by lenders.</p>
          </div>
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
            <h3 className="text-base font-bold text-[#222325]">Scenario 3: Change the tenure</h3>
            <p className="text-xs sm:text-sm text-[#62646a]">Compare a shorter and longer repayment period.</p>
          </div>
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
            <h3 className="text-base font-bold text-[#222325]">Scenario 4: Add the processing fee</h3>
            <p className="text-xs sm:text-sm text-[#62646a]">If you know the fee, include it and check the estimated net amount.</p>
          </div>
        </div>

        <p className="text-sm sm:text-base font-semibold text-[#222325] pt-2">
          This gives you a clearer picture of what each borrowing option means for your business.
        </p>
      </div>

      {/* 22. Business Loan EMI Calculator Results Explained */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-6">
        <h2 className="text-xl font-extrabold text-[#222325]">
          Business Loan EMI Calculator Results Explained
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <h3 className="text-base font-bold text-[#222325]">Monthly EMI</h3>
            <p className="text-xs sm:text-sm text-[#62646a]">The estimated amount payable every month.</p>
          </div>
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <h3 className="text-base font-bold text-[#222325]">Total Interest</h3>
            <p className="text-xs sm:text-sm text-[#62646a]">The estimated interest paid during the complete loan tenure.</p>
          </div>
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <h3 className="text-base font-bold text-[#222325]">Total Repayment</h3>
            <p className="text-xs sm:text-sm text-[#62646a]">The estimated principal plus interest paid over the loan period.</p>
          </div>
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <h3 className="text-base font-bold text-[#222325]">Processing Fee</h3>
            <p className="text-xs sm:text-sm text-[#62646a]">The optional fee entered into the calculator.</p>
          </div>
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <h3 className="text-base font-bold text-[#222325]">Net Disbursed Amount</h3>
            <p className="text-xs sm:text-sm text-[#62646a]">The estimated amount remaining after an included processing fee, where the calculator provides this figure.</p>
          </div>
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <h3 className="text-base font-bold text-[#222325]">Amortisation Schedule</h3>
            <p className="text-xs sm:text-sm text-[#62646a]">A period-by-period breakdown showing principal, interest and the remaining loan balance.</p>
          </div>
        </div>
      </div>

      {/* 23. Frequently Asked Questions */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-6">
        <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
          <div className="w-8 h-8 rounded-lg bg-[#f4fdf8] text-[#1dbf73] flex items-center justify-center border border-[#d8f5e5] shrink-0">
            <HelpCircle className="w-4 h-4" />
          </div>
          <h2 className="text-xl font-extrabold text-[#222325]">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {[
            {
              q: 'What is a Business Loan EMI Calculator?',
              a: 'It is a tool that estimates your monthly business loan EMI using the loan amount, interest rate and repayment tenure. It can also show total interest and total repayment, and may allow you to include an optional processing fee.',
            },
            {
              q: 'What do I need to calculate a business loan EMI?',
              a: 'You need the loan amount, interest rate and loan tenure. If you know the processing fee and the calculator provides an optional processing-fee field, you can include that as well.',
            },
            {
              q: 'Does a higher loan amount increase the EMI?',
              a: 'Yes. If the interest rate and tenure stay the same, a higher principal generally results in a higher EMI and higher total interest.',
            },
            {
              q: 'Does a longer tenure reduce the EMI?',
              a: 'Usually, yes. A longer tenure spreads the repayment across more instalments. However, the total interest can increase.',
            },
            {
              q: 'Does a lower EMI mean a cheaper loan?',
              a: 'Not necessarily. A lower EMI can result from a longer tenure, which may increase the total interest paid.',
            },
            {
              q: 'Can I include the processing fee?',
              a: 'Yes, if the calculator provides the optional processing-fee feature. Enter the fee according to the lender’s actual terms.',
            },
            {
              q: 'Can the calculator tell me whether my loan will be approved?',
              a: 'No. It only estimates repayment. Loan approval depends on the lender’s eligibility and credit assessment.',
            },
            {
              q: 'Is the EMI shown by the calculator final?',
              a: 'No. It is an estimate based on the information entered. Your actual repayment depends on the lender’s final loan terms.',
            },
            {
              q: 'Why should I check total interest?',
              a: 'The EMI tells you what you may pay each month. Total interest tells you how much the borrowing may cost over the entire repayment period. Checking both gives you a better picture.',
            },
          ].map((faq, idx) => (
            <div key={idx} className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <h3 className="font-bold text-[#222325] text-sm sm:text-base flex items-start gap-2">
                <span className="text-[#1dbf73] font-mono">Q{idx + 1}.</span>
                <span>{faq.q}</span>
              </h3>
              <p className="text-xs sm:text-sm text-[#62646a] pl-6 leading-relaxed">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 24. Final Takeaway */}
      <div className="bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white rounded-3xl p-6 sm:p-10 shadow-xl space-y-4 border border-slate-800">
        <h2 className="text-xl sm:text-2xl font-black text-[#1dbf73] tracking-tight">
          Final Takeaway
        </h2>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          Don't judge a business loan by the EMI alone.
        </p>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          Enter your <strong>loan amount, interest rate and tenure</strong> into the calculator. Check the monthly EMI, then look at the total interest and total repayment.
        </p>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          If you know the processing fee, include it too.
        </p>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          Try different loan amounts and repayment periods. A few minutes of comparison can show you how much a small change in tenure or interest rate can affect the overall cost of borrowing.
        </p>
        <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-bold text-center text-sm sm:text-base">
          The right loan calculation starts with a simple question:<br />
          <span className="text-white text-base sm:text-lg">&ldquo;Can your business comfortably handle the repayment?&rdquo;</span>
        </div>
      </div>
    </div>
  );
};
