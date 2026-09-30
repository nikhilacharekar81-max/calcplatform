import React from 'react';
import { BookOpen } from 'lucide-react';

export const BikeLoanGuideContent: React.FC = () => {
  return (
    <div className="space-y-12 font-sans text-[#404145] leading-relaxed">
      {/* Article Header & Intro */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <h1 className="text-2xl sm:text-3xl font-black text-[#222325]">
          Bike Loan EMI Calculator: Calculate Your Monthly EMI, Interest &amp; Total Repayment
        </h1>
        <p className="text-sm sm:text-base text-[#62646a] leading-relaxed">
          Buying a bike can make everyday life much easier. Maybe you need a scooter to travel to work. Maybe you want a motorcycle for your daily commute. Maybe you are buying your first bike, upgrading to a bigger motorcycle, or considering an electric scooter.
        </p>
        <p className="text-sm sm:text-base text-[#62646a] leading-relaxed">
          Whatever your reason, one thing is worth knowing before you sign a loan agreement: <strong>The price of the bike is not the same as the cost of the loan.</strong>
        </p>
        <p className="text-sm sm:text-base text-[#62646a] leading-relaxed">
          A bike loan adds interest, processing charges and other possible costs to your purchase. A loan that looks affordable because the EMI is low can become expensive if you choose a very long tenure or receive a higher interest rate.
        </p>
        <p className="text-sm sm:text-base text-[#62646a] leading-relaxed">
          Our <strong>Bike Loan EMI Calculator</strong> helps you estimate three important numbers before you make that decision:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-2">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
            <div className="text-xs text-slate-500 font-medium">Monthly Commitment</div>
            <div className="text-base font-bold text-emerald-700">Monthly EMI</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
            <div className="text-xs text-slate-500 font-medium">Borrowing Cost</div>
            <div className="text-base font-bold text-[#222325]">Total Interest</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
            <div className="text-xs text-slate-500 font-medium">Out-of-Pocket Expense</div>
            <div className="text-base font-bold text-[#222325]">Total Repayment</div>
          </div>
        </div>
        <p className="text-sm sm:text-base text-[#62646a] leading-relaxed">
          You can change the loan amount, interest rate and tenure to see how the numbers change. This is useful because a difference of even 1% in interest rate can matter over several years.
        </p>
      </div>

      {/* What Is a Bike Loan EMI Calculator? */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <h2 className="text-xl font-extrabold text-[#222325]">
          What Is a Bike Loan EMI Calculator?
        </h2>
        <p className="text-sm text-[#62646a]">
          A Bike Loan EMI Calculator is a simple financial tool that estimates your monthly instalment for a two-wheeler loan. You normally need only three numbers:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="text-xs font-bold text-[#222325]">1. Loan Amount</div>
            <div className="text-xs text-slate-500">Principal amount to borrow (e.g. ₹1,50,000)</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="text-xs font-bold text-[#222325]">2. Interest Rate</div>
            <div className="text-xs text-slate-500">Annual rate offered (e.g. 12% p.a.)</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="text-xs font-bold text-[#222325]">3. Loan Tenure</div>
            <div className="text-xs text-slate-500">Repayment duration in months (e.g. 36 months)</div>
          </div>
        </div>
        <p className="text-sm text-[#62646a]">
          The result is an estimate based on standard reducing-balance math. Your actual EMI can differ if the lender uses different rounding conventions, charges fees separately, changes the interest rate, or applies specific terms to your loan agreement.
        </p>
      </div>

      {/* How to Use */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-6">
        <h2 className="text-xl font-extrabold text-[#222325]">
          How to Use the Bike Loan EMI Calculator
        </h2>
        <div className="space-y-4">
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <h3 className="text-base font-bold text-[#222325]">1. Enter the loan amount</h3>
            <p className="text-xs sm:text-sm text-[#62646a]">
              Enter the amount you actually intend to borrow (e.g., ₹1,00,000 or ₹2,50,000). Remember that the amount you borrow does not necessarily have to equal the full price of the bike — you can pay part from savings as a down payment.
            </p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <h3 className="text-base font-bold text-[#222325]">2. Enter the interest rate</h3>
            <p className="text-xs sm:text-sm text-[#62646a]">
              Enter the annual interest rate offered by the lender (e.g., 10.50%, 12.00%, or 14.50%). Do not simply enter the lowest advertised rate online — your actual rate depends on your credit profile, income, vehicle, and lender policies.
            </p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <h3 className="text-base font-bold text-[#222325]">3. Enter the tenure</h3>
            <p className="text-xs sm:text-sm text-[#62646a]">
              Common two-wheeler loan tenures include 12, 18, 24, 36, 48, or 60 months. A longer tenure reduces your monthly EMI but increases total interest paid.
            </p>
          </div>
        </div>
      </div>

      {/* How Is Bike Loan EMI Calculated? */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <h2 className="text-xl font-extrabold text-[#222325]">
          How Is Bike Loan EMI Calculated?
        </h2>
        <p className="text-sm text-[#62646a]">
          For an ordinary reducing-balance loan, the commonly used EMI formula is:
        </p>
        <div className="p-6 rounded-2xl bg-slate-900 text-white font-mono text-center text-sm sm:text-base overflow-x-auto my-3">
          EMI = [P &times; r &times; (1+r)^n] / [(1+r)^n - 1]
        </div>
        <div className="text-xs sm:text-sm text-[#62646a] space-y-2">
          <p>Here:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>P</strong> = Principal loan amount</li>
            <li><strong>r</strong> = Monthly interest rate (e.g., 12% p.a. &divide; 12 &divide; 100 = 0.01 per month)</li>
            <li><strong>n</strong> = Total number of monthly instalments (e.g., 3 years &times; 12 = 36 months)</li>
          </ul>
        </div>
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs sm:text-sm text-amber-900 space-y-1">
          <div className="font-bold">Important Point About the Formula</div>
          <p>
            This formula explains the mathematical calculation for a standard reducing-balance amortising loan. It does not mean every lender in India must use exactly the same commercial pricing structure. Always check your actual sanction letter or loan agreement before accepting a loan.
          </p>
        </div>
      </div>

      {/* Reducing-Balance & Early EMI Dynamics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-3">
          <h2 className="text-lg font-extrabold text-[#222325]">
            What Does Reducing-Balance Mean?
          </h2>
          <p className="text-xs sm:text-sm text-[#62646a]">
            Interest is calculated on the outstanding principal balance. As you pay EMIs and reduce the principal, the interest component becomes smaller over time, allowing a larger portion of subsequent EMIs to go directly toward principal repayment.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-3">
          <h2 className="text-lg font-extrabold text-[#222325]">
            Why Early EMIs Feel Slow
          </h2>
          <p className="text-xs sm:text-sm text-[#62646a]">
            In the initial months of borrowing ₹2,00,000, the outstanding principal is high, meaning interest takes up a significant share of your EMI. Over time, as principal drops, interest decreases sharply.
          </p>
        </div>
      </div>

      {/* 20 Banks Comparison Table */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <h2 className="text-xl font-extrabold text-[#222325]">
          Bike Loan Interest Rates: 20 Banks &amp; Lenders to Compare
        </h2>
        <p className="text-sm text-[#62646a]">
          The following table gives an <strong>indicative comparison of published starting rates/ranges reported for 2026</strong>. It is intended for research and comparison, not as a promise that you will receive that rate.
        </p>

        <div className="overflow-x-auto border border-slate-200 rounded-2xl">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="bg-slate-100 text-[#222325]">
                <th className="p-3 font-bold border-b border-slate-200">Bank / Lender</th>
                <th className="p-3 font-bold border-b border-slate-200 text-right">Indicative Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[#62646a]">
              <tr><td className="p-3 font-semibold">Bank of India</td><td className="p-3 text-right font-bold text-emerald-600">From 7.60% p.a.</td></tr>
              <tr className="bg-slate-50/50"><td className="p-3 font-semibold">IDFC FIRST Bank</td><td className="p-3 text-right font-bold text-emerald-600">From 8.50% p.a.</td></tr>
              <tr><td className="p-3 font-semibold">UCO Bank</td><td className="p-3 text-right font-bold text-emerald-600">From 9.00% p.a.</td></tr>
              <tr className="bg-slate-50/50"><td className="p-3 font-semibold">Bandhan Bank</td><td className="p-3 text-right font-bold text-emerald-600">From 9.47% p.a.</td></tr>
              <tr><td className="p-3 font-semibold">Punjab National Bank</td><td className="p-3 text-right font-bold text-emerald-600">From 10.00% p.a.</td></tr>
              <tr className="bg-slate-50/50"><td className="p-3 font-semibold">Canara Bank</td><td className="p-3 text-right font-bold text-emerald-600">From 10.10% p.a.</td></tr>
              <tr><td className="p-3 font-semibold">Indian Overseas Bank</td><td className="p-3 text-right font-bold text-emerald-600">From 10.65% p.a.</td></tr>
              <tr className="bg-slate-50/50"><td className="p-3 font-semibold">Karur Vysya Bank</td><td className="p-3 text-right font-bold text-emerald-600">From 10.70% p.a.</td></tr>
              <tr><td className="p-3 font-semibold">Union Bank of India</td><td className="p-3 text-right font-bold text-emerald-600">From 10.90% p.a.</td></tr>
              <tr className="bg-slate-50/50"><td className="p-3 font-semibold">Axis Bank</td><td className="p-3 text-right font-bold text-emerald-600">From 11.00% p.a.</td></tr>
              <tr><td className="p-3 font-semibold">State Bank of India</td><td className="p-3 text-right font-bold text-emerald-600">From 11.70% p.a.</td></tr>
              <tr className="bg-slate-50/50"><td className="p-3 font-semibold">Karnataka Bank</td><td className="p-3 text-right font-bold text-emerald-600">From 12.06% p.a.</td></tr>
              <tr><td className="p-3 font-semibold">Bank of Baroda</td><td className="p-3 text-right font-bold text-emerald-600">From 12.40% p.a.</td></tr>
              <tr className="bg-slate-50/50"><td className="p-3 font-semibold">Tata Capital</td><td className="p-3 text-right font-bold text-emerald-600">From 12.50% p.a.</td></tr>
              <tr><td className="p-3 font-semibold">Tamilnad Mercantile Bank</td><td className="p-3 text-right font-bold text-emerald-600">From 13.30% p.a.</td></tr>
              <tr className="bg-slate-50/50"><td className="p-3 font-semibold">Hero FinCorp</td><td className="p-3 text-right font-bold text-emerald-600">From 14.00% p.a.</td></tr>
              <tr><td className="p-3 font-semibold">HDFC Bank</td><td className="p-3 text-right font-bold text-emerald-600">From 14.50% p.a.</td></tr>
              <tr className="bg-slate-50/50"><td className="p-3 font-semibold">SMFG India Credit</td><td className="p-3 text-right font-bold text-amber-600">From 20.00% p.a.</td></tr>
              <tr><td className="p-3 font-semibold">Bajaj Auto Finance</td><td className="p-3 text-right font-bold text-amber-600">Up to 24.00% p.a.</td></tr>
              <tr className="bg-slate-50/50"><td className="p-3 font-semibold">TVS Credit</td><td className="p-3 text-right font-bold text-slate-600">Based on assessment</td></tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-[#74767e]">
          Rates can change according to lender policies, CIBIL score, vehicle segment, and customer category. Always check current official quotes before applying.
        </p>
      </div>

      {/* CIBIL Score Deep Dive */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-6">
        <h2 className="text-xl font-extrabold text-[#222325]">
          Why CIBIL Score Matters So Much for a Bike Loan
        </h2>
        <p className="text-sm text-[#62646a]">
          Your <strong>CIBIL Score (300 to 900)</strong> reflects your credit history and payment discipline. CIBIL states that a score above <strong>700</strong> is generally considered good by lenders.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="font-bold text-[#222325] text-sm">Borrower A (Strong CIBIL)</div>
            <p className="text-xs text-[#62646a]">High score, stable income, no missed payments &rarr; Enjoys lower interest rates, higher approved loan amounts, and minimal down payment requirements.</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="font-bold text-[#222325] text-sm">Borrower B (Lower CIBIL)</div>
            <p className="text-xs text-[#62646a]">Lower score, recent enquiries, previous late payments &rarr; May face higher interest rates, larger down payment demands, or loan rejection.</p>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <h3 className="text-base font-bold text-[#222325]">4 Factors Affecting Your CIBIL Score:</h3>
          <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-[#62646a]">
            <li><strong>Payment History:</strong> Repeatedly paying EMIs or credit card dues late damages credit profiles.</li>
            <li><strong>Credit Utilisation:</strong> Using a very high percentage of your credit card limit signals credit dependence.</li>
            <li><strong>Age of Credit History:</strong> Longer, responsibly managed credit records give lenders greater confidence.</li>
            <li><strong>Credit Enquiries:</strong> Applying to 15 lenders simultaneously creates multiple hard enquiries, hurting your score.</li>
          </ul>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
          <div className="font-bold text-[#222325] text-sm">Free Annual CIBIL Report</div>
          <p className="text-xs text-[#62646a]">
            CIBIL provides one free CIBIL Score and Report per calendar year through its official portal. Check your report before starting negotiations to fix any clerical errors or unknown enquiries.
          </p>
        </div>
      </div>

      {/* Example: ₹1,50,000 Bike Loan */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <h2 className="text-xl font-extrabold text-[#222325]">
          Example: ₹1,50,000 Bike Loan at 12% for 3 Years
        </h2>
        <p className="text-sm text-[#62646a]">
          Suppose you borrow <strong>₹1,50,000</strong> at <strong>12% p.a.</strong> for <strong>3 years (36 months)</strong>:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-1">
            <div className="text-xs text-slate-500 font-medium">Monthly EMI</div>
            <div className="text-lg font-black text-emerald-600">₹4,982</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-1">
            <div className="text-xs text-slate-500 font-medium">Total Interest</div>
            <div className="text-lg font-black text-[#222325]">₹29,341</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-1">
            <div className="text-xs text-slate-500 font-medium">Total Repayment</div>
            <div className="text-lg font-black text-[#222325]">₹1,79,341</div>
          </div>
        </div>
        <p className="text-sm text-[#62646a]">
          Extending this borrowing to 5 years lowers the monthly EMI but significantly increases the total interest component. That is why comparing total repayment is essential.
        </p>
      </div>

      {/* Down Payment & Total Ownership */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-3">
          <h2 className="text-lg font-extrabold text-[#222325]">
            Down Payment vs. Emergency Fund
          </h2>
          <p className="text-xs sm:text-sm text-[#62646a]">
            Paying a larger down payment reduces loan principal and total interest. However, do not empty your cash reserve completely — maintain an emergency fund for unexpected medical, family, or employment needs.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-3">
          <h2 className="text-lg font-extrabold text-[#222325]">
            On-Road vs. Ex-Showroom Price
          </h2>
          <p className="text-xs sm:text-sm text-[#62646a]">
            The final on-road price includes road tax, registration fees, insurance, accessories, and dealer handling charges. Always calculate your loan based on the full <strong>on-road price minus down payment</strong>.
          </p>
        </div>
      </div>

      {/* Fees, APR & Prepayment */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <h2 className="text-xl font-extrabold text-[#222325]">
          Processing Fees, APR &amp; Prepayment Terms
        </h2>
        <p className="text-sm text-[#62646a]">
          Beyond interest rates, consider all associated borrowing costs:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <div className="font-bold text-[#222325] text-xs">Processing &amp; Admin Fees</div>
            <p className="text-xs text-[#62646a]">Upfront documentation and processing charges levied by banks.</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <div className="font-bold text-[#222325] text-xs">Annual Percentage Rate (APR)</div>
            <p className="text-xs text-[#62646a]">Annualised cost representing interest rate plus applicable fees.</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <div className="font-bold text-[#222325] text-xs">Prepayment Rules</div>
            <p className="text-xs text-[#62646a]">Check waiting periods, foreclosure charges, and part-prepayment limits.</p>
          </div>
        </div>
      </div>

      {/* Special Borrower Profiles */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <h2 className="text-xl font-extrabold text-[#222325]">
          Guidelines for Special Borrower Categories
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <div className="font-bold text-[#222325] text-sm">First-Time &amp; Young Buyers</div>
            <p className="text-xs text-[#62646a]">Avoid borrowing the maximum eligible limit. Factor in fuel, maintenance, parking, and insurance alongside the EMI.</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <div className="font-bold text-[#222325] text-sm">Self-Employed Borrowers</div>
            <p className="text-xs text-[#62646a]">Lenders require bank statements, ITR filings, and business proof in place of salary slips.</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <div className="font-bold text-[#222325] text-sm">Electric Scooter Buyers</div>
            <p className="text-xs text-[#62646a]">Special green loan schemes and interest concessions may apply (e.g., SBI Green Vehicle Loan).</p>
          </div>
        </div>
      </div>

      {/* Comparing Two Loans Table */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <h2 className="text-xl font-extrabold text-[#222325]">
          A Better Way to Compare Two Bike Loans
        </h2>
        <p className="text-sm text-[#62646a]">
          Instead of comparing headline interest rates alone, evaluate all key cost parameters side-by-side:
        </p>

        <div className="overflow-x-auto border border-slate-200 rounded-2xl max-w-md">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="bg-slate-100 text-[#222325]">
                <th className="p-3 font-bold border-b border-slate-200">Factor</th>
                <th className="p-3 font-bold border-b border-slate-200 text-center">Loan A</th>
                <th className="p-3 font-bold border-b border-slate-200 text-center">Loan B</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[#62646a]">
              <tr><td className="p-3 font-bold">Interest rate</td><td className="p-3 text-center">10.5%</td><td className="p-3 text-center">11.0%</td></tr>
              <tr className="bg-slate-50/50"><td className="p-3 font-bold">Loan amount</td><td className="p-3 text-center">₹1,50,000</td><td className="p-3 text-center">₹1,50,000</td></tr>
              <tr><td className="p-3 font-bold">Tenure</td><td className="p-3 text-center">3 years</td><td className="p-3 text-center">3 years</td></tr>
              <tr className="bg-slate-50/50"><td className="p-3 font-bold">Processing fee</td><td className="p-3 text-center">Low</td><td className="p-3 text-center">High</td></tr>
              <tr><td className="p-3 font-bold">Prepayment fee</td><td className="p-3 text-center">Free</td><td className="p-3 text-center">3% charge</td></tr>
              <tr className="bg-emerald-50/80 font-bold text-[#222325]"><td className="p-3">Total Repayment</td><td className="p-3 text-center text-emerald-800">Compare</td><td className="p-3 text-center text-emerald-800">Compare</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 20 Questions Checklist */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <h2 className="text-xl font-extrabold text-[#222325]">
          20 Questions to Ask Before Signing a Bike Loan
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#62646a]">
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">1. What exact interest rate am I getting?</div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">2. Is it fixed or floating?</div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">3. Is it calculated on a reducing balance?</div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">4. What is my total repayment amount?</div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">5. What is the processing fee?</div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">6. Are there documentation charges?</div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">7. Are taxes added to the fees?</div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">8. What happens if I miss an EMI?</div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">9. Can I make a part-prepayment?</div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">10. Is there a foreclosure charge?</div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">11. How long must I wait before prepaying?</div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">12. What happens to my EMI after a part-payment?</div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">13. Is insurance financed in the loan?</div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">14. Are accessories included in financing?</div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">15. What is the final on-road price?</div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">16. What amount am I actually borrowing?</div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">17. What CIBIL score criteria apply?</div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">18. Is there a special EV rate?</div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">19. Is the quoted rate promotional?</div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">20. How long is the quoted rate valid?</div>
        </div>
      </div>

      {/* Frequently Asked Questions (Open by Default) */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-6">
        <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
          <div className="w-8 h-8 rounded-lg bg-[#f4fdf8] text-[#1dbf73] flex items-center justify-center border border-[#d8f5e5] shrink-0">
            <BookOpen className="w-4 h-4" />
          </div>
          <h2 className="text-xl font-extrabold text-[#222325]">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {[
            {
              q: 'What is a Bike Loan EMI?',
              a: 'A Bike Loan EMI is the regular amount you pay towards your two-wheeler loan. It generally contains both principal and interest.',
            },
            {
              q: 'How is Bike Loan EMI calculated?',
              a: 'For a standard reducing-balance amortising loan, EMI is calculated using the principal, monthly interest rate and number of monthly instalments.',
            },
            {
              q: 'Does a higher CIBIL score help with a bike loan?',
              a: 'A higher CIBIL score can strengthen your credit profile and may improve your chances of receiving favourable loan terms. However, it does not guarantee approval or a particular interest rate.',
            },
            {
              q: 'What CIBIL score is good for a bike loan?',
              a: 'CIBIL scores range from 300 to 900. CIBIL states that a score above 700 is generally considered good, but lenders can have their own eligibility and pricing criteria.',
            },
            {
              q: 'Can I get a bike loan with a low CIBIL score?',
              a: 'It may be possible depending on the lender and your overall financial profile. However, you may face stricter eligibility requirements or less favourable terms.',
            },
            {
              q: 'Can I get a bike loan without a CIBIL score?',
              a: 'Possibly. If you are new to credit, some lenders may consider you under their own policies, while others may have minimum credit-history requirements.',
            },
            {
              q: 'Does checking my own CIBIL score reduce my score?',
              a: 'Checking your own credit report is different from a lender making a credit enquiry. CIBIL provides consumers with access to their own score and report.',
            },
            {
              q: 'How often can I get a free CIBIL report?',
              a: 'CIBIL currently provides one free CIBIL Score and Report per calendar year through its website or mobile application.',
            },
            {
              q: 'Does applying to many lenders affect my CIBIL score?',
              a: 'Multiple lender enquiries can be recorded in your credit report and can affect your score. Avoid unnecessary loan applications.',
            },
            {
              q: 'Does my income affect my bike-loan interest rate?',
              a: 'It can. Lenders may consider income, employment stability and existing obligations when evaluating an application and pricing the loan.',
            },
            {
              q: 'Is a longer tenure better?',
              a: 'Not necessarily. A longer tenure can reduce the EMI but may increase the total interest you pay.',
            },
            {
              q: 'Is a shorter tenure better?',
              a: 'A shorter tenure usually means higher monthly payments but can reduce total interest, provided the EMI is affordable for you.',
            },
            {
              q: 'Can I make a part-payment?',
              a: 'Many lenders allow part-prepayment, but the rules and charges vary. Check your loan agreement.',
            },
            {
              q: 'Can I close my bike loan early?',
              a: 'Usually, lenders have procedures for premature closure, but charges and waiting periods can apply depending on the lender and loan terms.',
            },
            {
              q: 'Does the interest rate remain the same throughout the loan?',
              a: 'That depends on whether your loan is fixed or floating and on the terms of your agreement.',
            },
            {
              q: 'Can I finance the full on-road price?',
              a: 'Some lenders may finance a large portion of the on-road cost, while others may require a down payment. Don\'t assume 100% financing is available for your particular case.',
            },
            {
              q: 'Is the ex-showroom price the amount I should use?',
              a: 'Not necessarily. If you are trying to determine how much you actually need to borrow, start with the final on-road cost and then subtract the amount you plan to pay yourself.',
            },
            {
              q: 'Should I include accessories in my bike loan?',
              a: 'Only if you actually need them. Financing optional accessories means you may also pay interest on them.',
            },
            {
              q: 'Does an electric bike get a lower interest rate?',
              a: 'Some lenders offer specific EV concessions or schemes, but this is not universal. Check the lender\'s current offer.',
            },
            {
              q: 'What happens if I miss my EMI?',
              a: 'You may face additional charges and the missed or delayed payment can negatively affect your credit profile. Contact the lender if you expect difficulty making a payment.',
            },
            {
              q: 'Does a good CIBIL score guarantee loan approval?',
              a: 'No. CIBIL itself does not approve loans. The lender makes the final decision using its own assessment and policies.',
            },
            {
              q: 'Can I improve my CIBIL score before taking a bike loan?',
              a: 'Yes, responsible credit behaviour can help over time. Pay existing dues on time, keep credit utilisation under control, avoid unnecessary applications and check your report for errors.',
            },
            {
              q: 'What is more important: EMI or total repayment?',
              a: 'You should look at both. The EMI tells you what you may pay every month. Total repayment tells you what the loan may cost you over the full tenure.',
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

      {/* Final Checklist */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <h2 className="text-xl font-extrabold text-[#222325]">
          Final Checklist Before Taking a Bike Loan
        </h2>
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 font-bold text-center text-[#222325] text-xs sm:text-sm">
          On-Road Price &minus; Down Payment &rarr; Actual Loan Amount &rarr; Interest Rate &rarr; Tenure &rarr; EMI &rarr; Total Interest &rarr; Total Repayment + Fees
        </div>
        <p className="text-sm text-[#62646a]">
          If these numbers make sense and the EMI comfortably fits your monthly budget, you have a much clearer picture of the borrowing decision.
        </p>
      </div>

      {/* Disclaimer */}
      <div className="bg-slate-50 rounded-3xl border border-slate-200 p-6 sm:p-8 text-xs text-slate-500 space-y-2">
        <div className="font-bold text-[#222325]">Important Rate &amp; Calculator Disclaimer</div>
        <p>
          Interest rates, processing fees, documentation charges, eligibility requirements, loan-to-value limits, tenure options, prepayment rules and other terms can change according to individual lender policies, product terms, market conditions and applicable regulations.
        </p>
        <p>
          The 20-lender rate information provided on this page is for general educational and comparison purposes only. A published starting rate or range does not guarantee that the same rate will be offered to every borrower. Your final rate may depend on your credit profile, income, loan amount, vehicle, tenure and other factors. Always verify the latest rate and complete loan terms directly with the lender before accepting a loan.
        </p>
        <p>
          The EMI calculator provides a mathematical estimate based on the information entered. It does not guarantee loan approval, a specific interest rate, a specific EMI or the final repayment amount charged by any lender.
        </p>
      </div>
    </div>
  );
};
