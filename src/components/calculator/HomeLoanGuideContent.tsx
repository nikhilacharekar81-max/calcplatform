import React from 'react';
import { BookOpen, HelpCircle, Calculator, ShieldAlert, CheckCircle2 } from 'lucide-react';

export const HomeLoanGuideContent: React.FC = () => {
  return (
    <div className="space-y-12 font-sans text-[#404145] leading-relaxed">
      {/* Overview & Intro */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <h2 className="text-2xl font-black text-[#222325]">
          Home Loan EMI Calculator: Calculate Your Monthly EMI, Interest & Total Repayment
        </h2>
        <p className="text-sm sm:text-base text-[#62646a] leading-relaxed">
          Buying a home is a major financial decision. For most people, the home loan is also one of the biggest monthly commitments they will take on.
        </p>
        <p className="text-sm sm:text-base text-[#62646a] leading-relaxed">
          Before choosing a property or deciding how much to borrow, it helps to know what the loan could actually cost you each month.
        </p>
        <p className="text-sm sm:text-base text-[#62646a] leading-relaxed">
          Our Home Loan EMI Calculator lets you estimate your monthly EMI, total interest, and total repayment amount using three simple inputs: your loan amount, interest rate, and loan tenure.
        </p>
        <p className="text-sm sm:text-base text-[#62646a] leading-relaxed">
          You can change these numbers to see how a different loan amount, interest rate, or repayment period affects your monthly payment and overall borrowing cost.
        </p>
      </div>

      {/* How to Use */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <h3 className="text-xl font-extrabold text-[#222325]">
          How to Use the Home Loan EMI Calculator
        </h3>
        <p className="text-sm text-[#62646a]">
          You only need three details to calculate your estimated home loan EMI:
        </p>
        <ul className="list-disc pl-5 space-y-3 text-sm text-[#62646a]">
          <li>
            <strong>Loan Amount:</strong> Enter the amount you plan to borrow. For example, if a property costs ₹70 lakh and you make a ₹20 lakh down payment, the loan amount may be around ₹50 lakh, subject to the lender's eligibility and financing rules.
          </li>
          <li>
            <strong>Interest Rate:</strong> Enter the annual interest rate used for your calculation, such as 8.50%.
          </li>
          <li>
            <strong>Loan Tenure:</strong> Enter how long you plan to repay the loan, such as 15, 20, or 30 years.
          </li>
        </ul>
        <div className="pt-2">
          <p className="text-sm font-bold text-[#222325] mb-2">After entering these details, the calculator shows:</p>
          <ul className="list-disc pl-5 space-y-1 text-sm text-[#62646a]">
            <li>Monthly EMI</li>
            <li>Total Interest Payable</li>
            <li>Total Repayment Amount</li>
          </ul>
        </div>
        <p className="text-xs text-[#74767e] italic bg-slate-50 p-4 rounded-xl border border-slate-200/80">
          The calculator performs each month's EMI and amortization calculations using the exact unrounded EMI (e.g., ₹43,391.161668...) internally, rather than the rounded monthly display figure, and rounds only the final displayed summary figures to the nearest rupee. Keep in mind that the calculator is a mathematical estimate. Your actual lender's repayment schedule can differ because of the lender's terms, payment dates, interest-rate changes, rounding methods, and other loan-specific conditions.
        </p>
      </div>

      {/* Formula */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <h3 className="text-xl font-extrabold text-[#222325]">
          Home Loan EMI Formula
        </h3>
        <p className="text-sm text-[#62646a]">
          The calculator uses the standard reducing-balance EMI formula:
        </p>
        <div className="bg-emerald-50/50 border border-emerald-200/60 rounded-2xl p-5 text-center font-mono font-bold text-base sm:text-lg text-emerald-900 my-4 overflow-x-auto">
          EMI = [P × r × (1+r)ⁿ] / [(1+r)ⁿ - 1]
        </div>
        <p className="text-sm text-[#62646a]"><strong>Where:</strong></p>
        <ul className="list-disc pl-5 space-y-1.5 text-sm text-[#62646a]">
          <li><strong>P</strong> = Principal loan amount</li>
          <li><strong>r</strong> = Monthly interest rate, calculated as (annual interest rate ÷ 1200)</li>
          <li><strong>n</strong> = Total number of monthly installments</li>
        </ul>
        <p className="text-sm text-[#62646a] pt-2">
          For example, a 20-year loan has 20 × 12 = 240 monthly installments. This formula is used to estimate the EMI for a loan where interest is calculated on the outstanding balance.
        </p>
      </div>

      {/* Why Split Changes */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <h3 className="text-xl font-extrabold text-[#222325]">
          Why Does the Interest and Principal Split Change?
        </h3>
        <p className="text-sm text-[#62646a]">
          Your EMI generally remains the same when the interest rate and loan terms remain unchanged, but the amount going toward interest and principal changes over time.
        </p>
        <p className="text-sm text-[#62646a]">
          At the beginning of the loan, the outstanding principal is high. Therefore, the interest portion of the EMI is relatively large.
        </p>
        <p className="text-sm text-[#62646a]">
          As you continue making payments, the outstanding principal decreases. The interest charged on that lower balance also decreases, allowing a larger portion of the EMI to go toward principal repayment.
        </p>
        <p className="text-sm text-[#62646a]">
          This is why the first few years of a long-term home loan can feel very different from the later years.
        </p>
      </div>

      {/* Example Table */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-6">
        <h3 className="text-xl font-extrabold text-[#222325]">
          Home Loan EMI Example: ₹50 Lakh at 8.50% for 20 Years
        </h3>
        <p className="text-sm text-[#62646a]">
          Suppose you borrow ₹50,00,000 at an annual interest rate of 8.50% for 20 years. Using the calculator's standard reducing-balance formula:
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-xs sm:text-sm text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-200">
                <th className="p-3.5">Loan Amount</th>
                <th className="p-3.5">Interest Rate</th>
                <th className="p-3.5">Tenure</th>
                <th className="p-3.5 text-emerald-700">Monthly EMI</th>
                <th className="p-3.5">Total Interest</th>
                <th className="p-3.5">Total Repayment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[#404145]">
              <tr className="bg-emerald-50/30">
                <td className="p-3.5 font-bold">₹50,00,000</td>
                <td className="p-3.5">8.50%</td>
                <td className="p-3.5">20 Years</td>
                <td className="p-3.5 font-black text-emerald-600">₹43,391</td>
                <td className="p-3.5 font-bold text-amber-600">₹54,13,879</td>
                <td className="p-3.5 font-black text-[#222325]">₹1,04,13,879</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-sm text-[#62646a]">
          The important point is that a ₹50 lakh loan does not mean you will repay only ₹50 lakh. At these assumptions, the estimated total repayment is approximately ₹1.04 crore, of which approximately ₹54.14 lakh represents interest.
        </p>
      </div>

      {/* Interest Rate Impact Table */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-6">
        <h3 className="text-xl font-extrabold text-[#222325]">
          How the Interest Rate Changes Your EMI
        </h3>
        <p className="text-sm text-[#62646a]">
          Even a small change in the interest rate can affect a long-term loan. For example, consider a ₹50 lakh loan for 20 years:
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-xs sm:text-sm text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-200">
                <th className="p-3.5">Annual Interest Rate</th>
                <th className="p-3.5 text-emerald-700">Monthly EMI</th>
                <th className="p-3.5">Total Interest</th>
                <th className="p-3.5">Total Repayment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[#404145]">
              <tr>
                <td className="p-3.5 font-bold">8.00%</td>
                <td className="p-3.5 font-bold text-emerald-600">₹41,822</td>
                <td className="p-3.5">₹50,37,281</td>
                <td className="p-3.5 font-bold">₹1,00,37,281</td>
              </tr>
              <tr className="bg-slate-50/50">
                <td className="p-3.5 font-bold">8.50%</td>
                <td className="p-3.5 font-bold text-emerald-600">₹43,391</td>
                <td className="p-3.5">₹54,13,879</td>
                <td className="p-3.5 font-bold">₹1,04,13,879</td>
              </tr>
              <tr>
                <td className="p-3.5 font-bold">9.00%</td>
                <td className="p-3.5 font-bold text-emerald-600">₹44,987</td>
                <td className="p-3.5">₹57,96,711</td>
                <td className="p-3.5 font-bold">₹1,07,96,711</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-sm text-[#62646a]">
          Going from 8.00% to 9.00% in this example increases the calculated EMI by ₹3,165 per month and increases the calculated total interest by ₹7,59,430 over the full 20-year period.
        </p>
      </div>

      {/* Tenure Impact Table */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-6">
        <h3 className="text-xl font-extrabold text-[#222325]">
          How Loan Tenure Changes Your EMI
        </h3>
        <p className="text-sm text-[#62646a]">
          A longer tenure generally reduces the monthly EMI because the repayment is spread over more months. However, because interest is paid over a longer period, the total interest can be considerably higher.
        </p>
        <p className="text-sm text-[#62646a]">For a ₹50 lakh loan at 8.50%:</p>
        <div className="overflow-x-auto">
          <table className="w-full text-xs sm:text-sm text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-200">
                <th className="p-3.5">Tenure</th>
                <th className="p-3.5 text-emerald-700">Monthly EMI</th>
                <th className="p-3.5">Total Interest</th>
                <th className="p-3.5">Total Repayment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[#404145]">
              <tr>
                <td className="p-3.5 font-bold">15 Years</td>
                <td className="p-3.5 font-bold text-emerald-600">₹48,731</td>
                <td className="p-3.5">₹37,71,718</td>
                <td className="p-3.5 font-bold">₹87,71,718</td>
              </tr>
              <tr className="bg-slate-50/50">
                <td className="p-3.5 font-bold">20 Years</td>
                <td className="p-3.5 font-bold text-emerald-600">₹43,391</td>
                <td className="p-3.5">₹54,13,879</td>
                <td className="p-3.5 font-bold">₹1,04,13,879</td>
              </tr>
              <tr>
                <td className="p-3.5 font-bold">30 Years</td>
                <td className="p-3.5 font-bold text-emerald-600">₹38,537</td>
                <td className="p-3.5 font-bold text-amber-600">₹88,73,071</td>
                <td className="p-3.5 font-bold">₹1,38,73,071</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-sm text-[#62646a]">
          The 30-year option has the lowest monthly EMI in this example, but the calculated total interest is much higher than with a 15-year tenure. This is why it can be useful to look at both the monthly EMI and the total repayment, rather than choosing a loan only because its EMI looks affordable.
        </p>
      </div>

      {/* Affordability & FOIR */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-6">
        <h3 className="text-xl font-extrabold text-[#222325]">
          How Much Home Loan Can You Actually Afford?
        </h3>
        <p className="text-sm text-[#62646a]">
          The EMI shown by a calculator is only one part of the home-buying decision. Before taking a loan, consider your regular household expenses, existing EMIs, insurance, investments, emergency savings, and other financial commitments.
        </p>
        <div className="space-y-3">
          <p className="text-sm font-bold text-[#222325]">Lenders assess factors such as:</p>
          <ul className="list-disc pl-5 space-y-1.5 text-sm text-[#62646a]">
            <li>Monthly or annual income</li>
            <li>Existing loan obligations</li>
            <li>Employment or business stability</li>
            <li>Credit history (CIBIL score)</li>
            <li>Age and expected age at loan maturity</li>
            <li>Property details and valuation</li>
            <li>Loan-to-value (LTV) considerations</li>
            <li>The lender's internal eligibility criteria</li>
          </ul>
        </div>

        <div className="pt-4 border-t border-slate-100 space-y-3">
          <h4 className="text-lg font-bold text-[#222325]">What Is FOIR?</h4>
          <p className="text-sm text-[#62646a]">
            FOIR, or Fixed Obligation to Income Ratio, is one of the measures that lenders may use when assessing repayment capacity. It generally considers existing financial obligations along with the proposed loan payment in relation to income.
          </p>
          <p className="text-sm text-[#62646a]">
            There is no single FOIR percentage that applies to every borrower or every lender. The acceptable level can vary depending on the lender's policies, income profile, credit history, existing obligations, and other underwriting factors. An EMI calculator can tell you what the EMI would be, but it cannot guarantee that a bank or housing finance company will approve that loan amount.
          </p>
        </div>
      </div>

      {/* Prepayment */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <h3 className="text-xl font-extrabold text-[#222325]">
          What Happens If You Make a Home Loan Prepayment?
        </h3>
        <p className="text-sm text-[#62646a]">
          If you receive a bonus, sell an investment, or have extra savings, you may consider making a part-prepayment toward your home loan, if permitted under your loan terms.
        </p>
        <p className="text-sm text-[#62646a]">
          A prepayment reduces the outstanding principal. This can reduce the amount of interest charged over the remaining loan period.
        </p>
        <div className="space-y-2">
          <p className="text-sm font-bold text-[#222325]">Options typically include:</p>
          <ul className="list-disc pl-5 space-y-1.5 text-sm text-[#62646a]">
            <li><strong>Reducing the tenure:</strong> Keep the EMI broadly unchanged and repay the loan sooner.</li>
            <li><strong>Reducing the EMI:</strong> Reduce the monthly payment while keeping the repayment period closer to the existing schedule.</li>
          </ul>
        </div>
        <p className="text-sm text-[#62646a]">
          For floating-rate loans to individual borrowers, applicable RBI rules may restrict certain foreclosure or prepayment charges for regulated entities. Borrowers should still check the current regulatory position and their specific loan agreement before making a decision.
        </p>
      </div>

      {/* Tax Benefits */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <h3 className="text-xl font-extrabold text-[#222325]">
          Home Loan Tax Benefits in India
        </h3>
        <p className="text-sm text-[#62646a]">
          Home loan tax treatment depends on the applicable provisions, the property, the purpose of the loan, and the tax regime you use. Under the old tax regime, eligible borrowers may be able to claim deductions for certain home-loan payments, subject to the conditions of the Income Tax Act.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-2">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <h4 className="font-bold text-[#222325]">Principal Repayment (Sec 80C)</h4>
            <p className="text-xs text-[#62646a]">
              Eligible principal repayment can form part of the deductions available under Section 80C, subject to the overall Section 80C limit of ₹1.5 Lakh per financial year and statutory conditions.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200 space-y-2">
            <h4 className="font-bold text-[#222325]">Interest Payment (Sec 24b)</h4>
            <p className="text-xs text-[#62646a]">
              Eligible interest on a housing loan qualifies for deductions under Section 24(b). For self-occupied property, the maximum deduction is ₹2 lakh per financial year.
            </p>
          </div>
        </div>

        <div className="space-y-2 pt-2">
          <h4 className="text-sm font-bold text-[#222325]">What About Sections 80EE and 80EEA?</h4>
          <p className="text-sm text-[#62646a]">
            Sections 80EE and 80EEA provided additional deductions for certain eligible first-time homebuyers during specified historical periods and subject to specific conditions. They should not be treated as automatically available for every new home loan today.
          </p>
        </div>
      </div>

      {/* Comprehensive Examples Matrix Table */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-6">
        <h3 className="text-xl font-extrabold text-[#222325]">
          Home Loan EMI Examples at 8.50%
        </h3>
        <p className="text-sm text-[#62646a]">
          The following examples show how the loan amount and tenure affect the estimated EMI when the annual interest rate is kept at 8.50%.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-xs sm:text-sm text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-200">
                <th className="p-3.5">Loan Amount</th>
                <th className="p-3.5">Tenure</th>
                <th className="p-3.5 text-emerald-700">Monthly EMI</th>
                <th className="p-3.5">Total Interest</th>
                <th className="p-3.5">Total Repayment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[#404145]">
              <tr>
                <td className="p-3 font-bold">₹30,00,000</td>
                <td className="p-3">15 Years</td>
                <td className="p-3 font-bold text-emerald-600">₹29,239</td>
                <td className="p-3">₹22,63,031</td>
                <td className="p-3 font-bold">₹52,63,031</td>
              </tr>
              <tr className="bg-slate-50/50">
                <td className="p-3 font-bold">₹30,00,000</td>
                <td className="p-3">20 Years</td>
                <td className="p-3 font-bold text-emerald-600">₹25,960</td>
                <td className="p-3">₹32,30,480</td>
                <td className="p-3 font-bold">₹62,30,480</td>
              </tr>
              <tr>
                <td className="p-3 font-bold">₹30,00,000</td>
                <td className="p-3">30 Years</td>
                <td className="p-3 font-bold text-emerald-600">₹23,122</td>
                <td className="p-3">₹53,23,843</td>
                <td className="p-3 font-bold">₹83,23,843</td>
              </tr>
              <tr className="border-t-2 border-slate-200">
                <td className="p-3 font-bold">₹50,00,000</td>
                <td className="p-3">15 Years</td>
                <td className="p-3 font-bold text-emerald-600">₹48,731</td>
                <td className="p-3">₹37,71,718</td>
                <td className="p-3 font-bold">₹87,71,718</td>
              </tr>
              <tr className="bg-slate-50/50">
                <td className="p-3 font-bold">₹50,00,000</td>
                <td className="p-3">20 Years</td>
                <td className="p-3 font-bold text-emerald-600">₹43,391</td>
                <td className="p-3">₹54,13,879</td>
                <td className="p-3 font-bold">₹1,04,13,879</td>
              </tr>
              <tr>
                <td className="p-3 font-bold">₹50,00,000</td>
                <td className="p-3">30 Years</td>
                <td className="p-3 font-bold text-emerald-600">₹38,537</td>
                <td className="p-3">₹88,73,071</td>
                <td className="p-3 font-bold">₹1,38,73,071</td>
              </tr>
              <tr className="border-t-2 border-slate-200">
                <td className="p-3 font-bold">₹75,00,000</td>
                <td className="p-3">15 Years</td>
                <td className="p-3 font-bold text-emerald-600">₹73,097</td>
                <td className="p-3">₹56,57,577</td>
                <td className="p-3 font-bold">₹1,31,57,577</td>
              </tr>
              <tr className="bg-slate-50/50">
                <td className="p-3 font-bold">₹75,00,000</td>
                <td className="p-3">20 Years</td>
                <td className="p-3 font-bold text-emerald-600">₹65,086</td>
                <td className="p-3">₹81,20,818</td>
                <td className="p-3 font-bold">₹1,56,20,818</td>
              </tr>
              <tr>
                <td className="p-3 font-bold">₹75,00,000</td>
                <td className="p-3">30 Years</td>
                <td className="p-3 font-bold text-emerald-600">₹57,806</td>
                <td className="p-3">₹1,33,09,607</td>
                <td className="p-3 font-bold">₹2,08,09,607</td>
              </tr>
              <tr className="border-t-2 border-slate-200">
                <td className="p-3 font-bold">₹1,00,00,000</td>
                <td className="p-3">15 Years</td>
                <td className="p-3 font-bold text-emerald-600">₹97,464</td>
                <td className="p-3">₹75,43,436</td>
                <td className="p-3 font-bold">₹1,75,43,436</td>
              </tr>
              <tr className="bg-slate-50/50">
                <td className="p-3 font-bold">₹1,00,00,000</td>
                <td className="p-3">20 Years</td>
                <td className="p-3 font-bold text-emerald-600">₹86,782</td>
                <td className="p-3">₹1,08,27,759</td>
                <td className="p-3 font-bold">₹2,08,27,759</td>
              </tr>
              <tr>
                <td className="p-3 font-bold">₹1,00,00,000</td>
                <td className="p-3">30 Years</td>
                <td className="p-3 font-bold text-emerald-600">₹77,073</td>
                <td className="p-3">₹1,77,46,142</td>
                <td className="p-3 font-bold">₹2,77,46,142</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQs (Open by default) */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-6">
        <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
          <div className="w-8 h-8 rounded-lg bg-[#f4fdf8] text-[#1dbf73] flex items-center justify-center border border-[#d8f5e5] shrink-0">
            <BookOpen className="w-4 h-4" />
          </div>
          <h3 className="text-lg font-bold text-[#222325]">
            Frequently Asked Questions
          </h3>
        </div>

        <div className="space-y-3">
          {[
            {
              q: 'What is a home loan EMI?',
              a: 'A home loan EMI is the fixed monthly amount you pay toward your home loan. It includes both the interest charged on the loan and a portion of the principal amount you borrowed.',
            },
            {
              q: 'How is my home loan EMI calculated?',
              a: 'Your EMI is calculated using three main things: your loan amount, interest rate, and loan tenure. A longer tenure usually means a lower monthly EMI, while a shorter tenure usually means a higher EMI but less total interest over the life of the loan.',
            },
            {
              q: 'How much EMI will I pay for a ₹50 lakh home loan?',
              a: 'It depends on the interest rate and loan tenure. For example, at 8.50% per year for 20 years, a ₹50 lakh loan has an estimated EMI of about ₹43,391 per month. You can enter your own loan amount, interest rate, and tenure in the calculator to get your estimate.',
            },
            {
              q: 'Does a lower interest rate reduce my EMI?',
              a: 'Yes. When the interest rate is lower, your monthly EMI generally becomes lower, and you also pay less interest over the full loan period. Even a small difference in the interest rate can make a noticeable difference when the loan runs for many years.',
            },
            {
              q: 'Does choosing a longer tenure reduce my EMI?',
              a: 'Usually, yes. A longer loan tenure spreads your repayment over more months, which reduces the monthly EMI. However, you generally end up paying more total interest because the loan remains outstanding for a longer period.',
            },
            {
              q: 'Should I choose a shorter or longer home loan tenure?',
              a: 'It depends on what fits your finances. A shorter tenure can help you pay off the loan sooner and reduce the total interest, but the monthly EMI will usually be higher. A longer tenure can make the monthly payment easier to manage, but the total interest cost can be higher. Before choosing a tenure, consider your monthly income, existing expenses, other loans, savings, and future financial plans.',
            },
            {
              q: 'What is the difference between principal and interest?',
              a: 'The principal is the amount you borrowed. The interest is the cost charged by the lender for providing that money. Your EMI pays both. In the earlier part of the loan, a larger portion of the EMI generally goes toward interest. As the outstanding loan balance falls, more of the EMI goes toward the principal.',
            },
            {
              q: 'Why does the interest portion of my EMI change over time?',
              a: 'Home loans are generally calculated on the outstanding loan balance. At the beginning, you owe more money, so the interest calculated for the month is higher. As you repay the principal, the outstanding balance becomes smaller. This reduces the interest charged each month, so a larger portion of your EMI goes toward the principal.',
            },
            {
              q: 'Does the EMI calculator show the exact amount my bank will charge?',
              a: 'The calculator gives a mathematical estimate based on the information you enter. Your actual lender calculation can differ slightly because of factors such as payment dates, rounding methods, interest-rate changes, prepayments, and the lender\'s specific terms. Always check your loan agreement or sanction documents for the actual repayment schedule.',
            },
            {
              q: 'Can my home loan EMI change after I take the loan?',
              a: 'It can, depending on the type of interest rate attached to your loan. For a floating-rate loan, changes in the applicable interest rate can affect your EMI, loan tenure, or both, depending on the lender\'s repayment policy. A fixed-rate loan may work differently. Check your lender\'s terms to understand how rate changes are handled.',
            },
            {
              q: 'Can I make a part-prepayment on my home loan?',
              a: 'Many home loans allow borrowers to make part-prepayments, subject to the lender\'s terms. A part-prepayment reduces your outstanding principal. Depending on how the lender recalculates the loan, it may reduce your future EMI, shorten the tenure, or give you another repayment option.',
            },
            {
              q: 'Is reducing the loan tenure better after a prepayment?',
              a: 'There is no single answer for everyone. If you keep your EMI the same after making a prepayment and reduce the tenure, you may repay the loan sooner and potentially reduce future interest. If you reduce the EMI instead, you may have more money available each month. The better option depends on your income, cash-flow needs, and financial goals.',
            },
            {
              q: 'Does the calculator include processing fees and other home loan charges?',
              a: 'No. The EMI calculation normally covers the loan principal and interest. Additional costs such as processing fees, legal charges, valuation charges, insurance, stamp duty, registration charges, and other property-related expenses are not included unless specifically stated.',
            },
            {
              q: 'Can I use this calculator for any bank?',
              a: 'Yes. You can use the calculator to estimate EMI for different loan amounts, interest rates, and tenures. However, the calculator is a general mathematical tool. Banks and housing finance companies may have their own loan terms, interest-rate structures, rounding practices, and repayment policies.',
            },
            {
              q: 'What happens if I pay extra toward my home loan?',
              a: 'Paying extra toward the principal can reduce the amount you owe. This can potentially reduce the interest you pay in the future because interest is calculated on the outstanding balance. The exact benefit depends on the amount and timing of the prepayment and how your lender recalculates the loan.',
            },
            {
              q: 'What is pre-EMI?',
              a: 'Pre-EMI is generally the interest payment made on the amount of a loan that has already been disbursed, which is common with some under-construction property loans. For example, if a lender releases your loan in stages as construction progresses, you may initially pay interest only on the amount that has been disbursed. Full EMI payments may begin later, depending on the lender\'s terms.',
            },
            {
              q: 'Does a home loan EMI include my down payment?',
              a: 'No. Your down payment is normally paid separately by you. The EMI calculator calculates repayments on the loan amount you enter, not the total property price. For example, if a property costs ₹70 lakh and you pay ₹20 lakh as a down payment, the loan amount could be ₹50 lakh. The EMI would then be calculated on ₹50 lakh, subject to the lender\'s actual financing terms.',
            },
            {
              q: 'Can I calculate EMI for different loan amounts?',
              a: 'Yes. Try different loan amounts in the calculator to see how the monthly EMI and total interest change. Comparing a few different amounts can help you understand how much borrowing you may be comfortable with before applying for a loan.',
            },
            {
              q: 'Is the lowest EMI always the best option?',
              a: 'Not necessarily. A lower EMI can make your monthly budget easier to manage, but it may come with a longer tenure and a higher total interest cost. It is useful to look at both the monthly EMI and the total amount you will repay, rather than considering the EMI alone.',
            },
            {
              q: 'Is this home loan EMI calculator free to use?',
              a: 'Yes. You can use the calculator to estimate your monthly EMI, total interest, total repayment, and yearly repayment breakdown based on the values you enter.',
            },
          ].map((faq, idx) => (
            <details
              key={idx}
              open={true}
              className="group border border-slate-200 rounded-2xl overflow-hidden bg-[#fafafa]"
            >
              <summary className="p-4 font-bold text-xs sm:text-sm text-[#222325] flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-100 transition-colors list-none">
                <span>{faq.q}</span>
                <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="p-4 pt-0 text-xs sm:text-sm text-[#62646a] leading-relaxed border-t border-slate-200/60 bg-white">
                {faq.a}
              </div>
            </details>
          ))}
        </div>
      </div>

      {/* Simple Way to Use */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <h3 className="text-xl font-extrabold text-[#222325]">
          A Simple Way to Use the Calculator
        </h3>
        <p className="text-sm text-[#62646a]">
          If you are comparing different home-loan options, don't look at the EMI alone. Try entering the same loan amount with different interest rates and tenures. Then compare:
        </p>
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 font-bold text-center text-[#222325] text-sm sm:text-base">
          Monthly EMI &nbsp;&rarr;&nbsp; Total Interest &nbsp;&rarr;&nbsp; Total Repayment
        </div>
        <p className="text-sm text-[#62646a]">
          This gives you a clearer picture of how changing the loan terms can affect both your monthly budget and the overall cost of borrowing.
        </p>
      </div>

      {/* Disclaimer */}
      <div className="bg-slate-50 rounded-3xl border border-slate-200 p-6 sm:p-8 text-xs text-slate-500 space-y-2">
        <div className="font-bold text-[#222325]">Important Disclaimer</div>
        <p>
          The results provided by this Home Loan EMI Calculator are mathematical estimates, not loan offers, approvals, or financial advice. Calculations are based on the information entered by the user and the standard reducing-balance EMI formula described on this page. Actual lender calculations may vary because of interest-rate resets, payment dates, disbursement schedules, rounding conventions, part-prepayments, lender-specific terms, fees, charges, and other contractual conditions.
        </p>
        <p>
          Always check the final sanction letter, loan agreement, repayment schedule, and applicable charges provided by your lender before making a borrowing decision.
        </p>
      </div>
    </div>
  );
};
