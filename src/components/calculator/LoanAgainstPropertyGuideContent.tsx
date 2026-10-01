import React from 'react';
import {
  Building2,
  ShieldCheck,
  TrendingUp,
  AlertCircle,
  Percent,
  Calendar,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  Info,
  DollarSign,
  AlertTriangle,
  Lightbulb,
  Check,
  Scale,
  Sparkles,
  FileText
} from 'lucide-react';

export const LoanAgainstPropertyGuideContent: React.FC = () => {
  return (
    <div className="space-y-12 font-sans text-[#404145] leading-relaxed">
      {/* 1. Article Header & Intro */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800">
          <Building2 className="w-3.5 h-3.5" />
          <span>Secured Mortgage Financing &bull; LAP Guide</span>
        </div>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#222325] tracking-tight">
          Loan Against Property (LAP) Calculator: Estimate EMI, Interest and LTV
        </h2>
        <p className="text-base sm:text-lg text-[#62646a] leading-relaxed">
          A <strong>Loan Against Property (LAP) Calculator</strong> helps you estimate the monthly EMI and overall repayment cost when you borrow against a property. Enter your <strong>Property Market Value, Loan Amount, Interest Rate and Tenure</strong> to see how the numbers change before you approach a lender.
        </p>
        <p className="text-sm sm:text-base text-[#62646a] leading-relaxed">
          For example, if your property is worth <strong>₹1 crore</strong> and you want to borrow <strong>₹50 lakh</strong>, the proposed loan is 50% of the property value you entered. That does not mean a bank will automatically approve ₹50 lakh. The lender can use its own property valuation, eligibility rules and lending policy when deciding the final loan amount.
        </p>
      </div>

      {/* 2. Calculator at a Glance */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-6">
        <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
          <div className="p-2 rounded-xl bg-emerald-50 text-[#1dbf73]">
            <FileText className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-extrabold text-[#222325]">Loan Against Property Calculator at a Glance</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="p-3.5 font-bold text-[#222325]">Calculator Input</th>
                <th className="p-3.5 font-bold text-[#222325]">What It Means</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600">
              <tr>
                <td className="p-3.5 font-semibold text-[#222325]">Property Market Value (₹)</td>
                <td className="p-3.5">Your estimated current value of the property</td>
              </tr>
              <tr>
                <td className="p-3.5 font-semibold text-[#222325]">Loan Amount (Principal) (₹)</td>
                <td className="p-3.5">The amount you want to borrow</td>
              </tr>
              <tr>
                <td className="p-3.5 font-semibold text-[#222325]">Interest Rate (% p.a.)</td>
                <td className="p-3.5">Annual interest rate used for the calculation</td>
              </tr>
              <tr>
                <td className="p-3.5 font-semibold text-[#222325]">Tenure (Years)</td>
                <td className="p-3.5">How long you plan to repay the loan</td>
              </tr>
              <tr className="bg-emerald-50/40">
                <td className="p-3.5 font-semibold text-[#1dbf73]">Main Results</td>
                <td className="p-3.5 font-medium text-[#222325]">Estimated EMI, total interest and total repayment</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
          <h4 className="text-sm font-bold text-[#222325] flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-[#1dbf73]" />
            <span>Quick Example</span>
          </h4>
          <p className="text-xs sm:text-sm text-slate-600">Suppose you enter:</p>
          <ul className="list-disc list-inside text-xs sm:text-sm text-slate-600 space-y-1">
            <li><strong>Property Market Value:</strong> ₹1 crore</li>
            <li><strong>Loan Amount:</strong> ₹50 lakh</li>
            <li><strong>Interest Rate:</strong> 10% p.a.</li>
            <li><strong>Tenure:</strong> 15 years</li>
          </ul>
          <p className="text-xs sm:text-sm text-slate-600">
            The calculator uses the <strong>₹50 lakh loan amount</strong>, not the ₹1 crore property value, to calculate the EMI. The property value helps you understand how large the proposed borrowing is compared with the asset being offered as security.
          </p>
        </div>
      </div>

      {/* 3. What Is a Loan Against Property? */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <h3 className="text-xl font-extrabold text-[#222325]">What Is a Loan Against Property?</h3>
        <p className="text-sm sm:text-base text-[#62646a] leading-relaxed">
          A Loan Against Property is a <strong>secured loan</strong> where an eligible property is offered as collateral. Depending on the lender and product, residential, commercial or other eligible properties may be accepted. For example, ICICI Bank currently states that its LAP product can be secured against residential, commercial or industrial property, subject to its eligibility conditions.
        </p>
        <p className="text-sm sm:text-base text-[#62646a] leading-relaxed">
          People may use LAP funds for different needs, including:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {[
            'Business expansion',
            'Working capital',
            'Education expenses',
            'Medical expenses',
            'Debt consolidation',
            'Property-related expenses',
            'Other permitted personal or business requirements'
          ].map((item, idx) => (
            <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700 font-medium">
              <Check className="w-4 h-4 text-[#1dbf73] shrink-0 mt-0.5" />
              <span>{item}</span>
            </div>
          ))}
        </div>
        <p className="text-sm sm:text-base text-[#62646a] leading-relaxed pt-2">
          The exact permitted use depends on the lender and the loan agreement. The important point for the calculator is simple: <strong>you are borrowing a specific amount against a property with a specific estimated value.</strong>
        </p>
      </div>

      {/* 4. What Is a Loan Against Property Calculator? */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <h3 className="text-xl font-extrabold text-[#222325]">What Is a Loan Against Property Calculator?</h3>
        <p className="text-sm sm:text-base text-[#62646a] leading-relaxed">
          A Loan Against Property Calculator is a financial planning tool that estimates the repayment cost of a proposed property-backed loan. You provide property value, loan amount, interest rate and tenure. The calculator then works out the estimated EMI and repayment figures.
        </p>
        <p className="text-sm sm:text-base text-[#62646a] leading-relaxed">
          You can change any of the three main repayment variables — <strong>loan amount, interest rate or tenure</strong> — and immediately see how the estimated cost changes. That makes the tool useful when you're comparing different borrowing scenarios.
        </p>
      </div>

      {/* 5. Property Value vs Loan Amount */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <h3 className="text-xl font-extrabold text-[#222325]">Property Value vs Loan Amount: What Should You Enter?</h3>
        <p className="text-sm sm:text-base text-[#62646a] leading-relaxed">
          These two fields have different jobs. <strong>Property Market Value</strong> is your estimate of what the property is currently worth. <strong>Loan Amount</strong> is the money you want to borrow.
        </p>
        <div className="overflow-x-auto pt-2">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="p-3.5 font-bold text-[#222325]">Item</th>
                <th className="p-3.5 font-bold text-[#222325] text-right">Example</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600">
              <tr>
                <td className="p-3.5 font-semibold text-[#222325]">Property Market Value</td>
                <td className="p-3.5 text-right font-bold text-[#222325]">₹1 crore</td>
              </tr>
              <tr>
                <td className="p-3.5 font-semibold text-[#222325]">Loan Amount</td>
                <td className="p-3.5 text-right font-bold text-[#222325]">₹50 lakh</td>
              </tr>
              <tr className="bg-emerald-50/40">
                <td className="p-3.5 font-semibold text-[#1dbf73]">Proposed LTV</td>
                <td className="p-3.5 text-right font-bold text-[#1dbf73]">50%</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-sm sm:text-base text-[#62646a] leading-relaxed pt-2">
          Do not enter ₹1 crore as the loan amount simply because the property is worth ₹1 crore. If you only need ₹40 lakh, enter ₹40 lakh. If you need ₹50 lakh, enter ₹50 lakh. The calculator should reflect the amount you actually want to borrow.
        </p>
      </div>

      {/* 6. What Is LTV in a Loan Against Property? */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <h3 className="text-xl font-extrabold text-[#222325]">What Is LTV in a Loan Against Property?</h3>
        <p className="text-sm sm:text-base text-[#62646a] leading-relaxed">
          <strong>Loan-to-Value (LTV)</strong> shows the proposed loan amount as a percentage of the property value. The basic calculation is:
        </p>
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs sm:text-sm font-bold text-emerald-900 text-center">
          LTV = Loan Amount ÷ Property Value × 100
        </div>
        <p className="text-sm sm:text-base text-[#62646a] leading-relaxed">
          For a ₹50 lakh loan against a property valued at ₹1 crore: <strong>₹50 lakh ÷ ₹1 crore × 100 = 50%</strong>. So the proposed LTV is <strong>50% based on the property value you entered</strong>. This is useful for planning, but don't treat it as a guaranteed sanction limit. The lender can use a different valuation and its own LTV criteria.
        </p>
      </div>

      {/* 7. How Much Can You Borrow Against a Property? */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <h3 className="text-xl font-extrabold text-[#222325]">How Much Can You Borrow Against a Property?</h3>
        <p className="text-sm sm:text-base text-[#62646a] leading-relaxed">
          There is <strong>no single LAP percentage that applies to every borrower and every lender</strong>. You may see figures such as 50%, 60%, 70% or higher in different lender products or examples, but the actual amount depends on the lender, property type, valuation, borrower profile and loan product.
        </p>
        <p className="text-sm sm:text-base text-[#62646a] leading-relaxed">
          For example, ICICI Bank currently states that its LAP can provide up to <strong>75% of the property's market value</strong>, subject to factors including property type and eligibility. That is an ICICI-specific product statement, not a universal rule for every LAP in India. Don't calculate your finances on the assumption that every bank will lend the same percentage.
        </p>
      </div>

      {/* 8. Why Lender Valuation Matters */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <h3 className="text-xl font-extrabold text-[#222325]">Why the Lender's Property Valuation Matters</h3>
        <p className="text-sm sm:text-base text-[#62646a] leading-relaxed">
          Your estimated property value may not be the value used by the lender. Imagine you believe your property is worth <strong>₹1 crore</strong> and you enter a <strong>₹50 lakh loan</strong> (50% LTV). Now suppose the lender's valuation comes in at ₹90 lakh. The same ₹50 lakh loan would represent about <strong>55.6%</strong> of that valuation.
        </p>
        <p className="text-sm sm:text-base text-[#62646a] leading-relaxed">
          Banks have their own valuation policies and may use professional valuers. RBI guidance also requires banks to have board-approved policies around property and collateral valuation. So the property value in your calculator is a <strong>planning figure</strong>, not an official bank valuation.
        </p>
      </div>

      {/* 9. How Much Does a Loan Against Property Cost? */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <h3 className="text-xl font-extrabold text-[#222325]">How Much Does a Loan Against Property Cost?</h3>
        <p className="text-sm sm:text-base text-[#62646a] leading-relaxed">
          The cost of a LAP depends mainly on loan amount, interest rate, tenure, lender, borrower profile, property type, loan purpose and applicable fees. Interest rates can also change over time.
        </p>
        <p className="text-sm sm:text-base text-[#62646a] leading-relaxed">
          For example, ICICI Bank's currently published LAP rates for non-housing loans show different ranges based on loan amount and borrower category. As of the published schedule valid through <strong>30 September 2026</strong>, its displayed rates range from <strong>10.60% to 12.25%</strong>, depending on loan size and borrower segment.
        </p>
        <p className="text-sm sm:text-base text-[#62646a] leading-relaxed">
          That is a good example of why your calculator should let the user <strong>enter their own interest rate</strong> rather than automatically assuming one market-wide rate.
        </p>
      </div>

      {/* 10. How Loan Amount, Interest Rate and Tenure Change Your EMI */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-6">
        <h3 className="text-xl font-extrabold text-[#222325]">How Loan Amount, Interest Rate and Tenure Change Your EMI</h3>
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <h4 className="font-bold text-sm text-[#222325]">Borrow more</h4>
            <p className="text-xs sm:text-sm text-slate-600">
              A larger principal generally means a larger EMI when the rate and tenure remain unchanged. For example, you could compare ₹25 lakh, ₹40 lakh, ₹50 lakh or ₹60 lakh against the same property value.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <h4 className="font-bold text-sm text-[#222325]">Get a higher interest rate</h4>
            <p className="text-xs sm:text-sm text-slate-600">
              A higher interest rate generally increases both the EMI and total interest when the loan amount and tenure remain unchanged. Look at the rate too when comparing offers.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <h4 className="font-bold text-sm text-[#222325]">Choose a longer tenure</h4>
            <p className="text-xs sm:text-sm text-slate-600">
              A longer tenure generally lowers the monthly EMI because repayment is spread across more months. But you may pay interest for more years, increasing total borrowing cost.
            </p>
          </div>
        </div>
      </div>

      {/* 11. A Realistic LAP Comparison */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <h3 className="text-xl font-extrabold text-[#222325]">A Realistic LAP Comparison</h3>
        <p className="text-sm sm:text-base text-[#62646a] leading-relaxed">
          Imagine you need ₹50 lakh against a property worth ₹1 crore. You could use the calculator to compare:
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="p-3.5 font-bold text-[#222325]">Scenario</th>
                <th className="p-3.5 font-bold text-[#222325] text-right">Loan Amount</th>
                <th className="p-3.5 font-bold text-[#222325] text-right">Interest Rate</th>
                <th className="p-3.5 font-bold text-[#222325] text-right">Tenure</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600">
              <tr>
                <td className="p-3.5 font-bold text-[#222325]">A</td>
                <td className="p-3.5 text-right">₹50 lakh</td>
                <td className="p-3.5 text-right">10%</td>
                <td className="p-3.5 text-right">10 years</td>
              </tr>
              <tr>
                <td className="p-3.5 font-bold text-[#222325]">B</td>
                <td className="p-3.5 text-right">₹50 lakh</td>
                <td className="p-3.5 text-right">10%</td>
                <td className="p-3.5 text-right">15 years</td>
              </tr>
              <tr>
                <td className="p-3.5 font-bold text-[#222325]">C</td>
                <td className="p-3.5 text-right">₹50 lakh</td>
                <td className="p-3.5 text-right">10%</td>
                <td className="p-3.5 text-right">20 years</td>
              </tr>
              <tr>
                <td className="p-3.5 font-bold text-[#222325]">D</td>
                <td className="p-3.5 text-right">₹40 lakh</td>
                <td className="p-3.5 text-right">10%</td>
                <td className="p-3.5 text-right">15 years</td>
              </tr>
              <tr>
                <td className="p-3.5 font-bold text-[#222325]">E</td>
                <td className="p-3.5 text-right">₹50 lakh</td>
                <td className="p-3.5 text-right">11%</td>
                <td className="p-3.5 text-right">15 years</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-sm sm:text-base text-[#62646a] leading-relaxed pt-2">
          The purpose isn't to find one magical combination. It is to understand the trade-offs between loan amount, tenure and interest rate.
        </p>
      </div>

      {/* 12. Why a Lower EMI Can Cost You More & Don't Borrow More */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-3">
          <h3 className="text-lg font-extrabold text-[#222325]">Why a Lower EMI Can Cost You More</h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            The longer tenure produces a lower monthly EMI, but keeps the outstanding principal alive for many additional years, allowing more time for interest to accumulate. Always check both <strong>Monthly EMI</strong> and <strong>Total Interest</strong>.
          </p>
        </div>
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-3">
          <h3 className="text-lg font-extrabold text-[#222325]">Don't Borrow More Just Because You're Eligible</h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            If a lender indicates eligibility for ₹60 lakh but you only need ₹40 lakh, don't automatically treat ₹60 lakh as your target. Compare the financial cost of borrowing extra money. A bigger sanctioned amount is not automatically better.
          </p>
        </div>
      </div>

      {/* 13. Residential vs Commercial Property & Bank Checklist */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <h3 className="text-xl font-extrabold text-[#222325]">Residential vs Commercial Property & Lender Checks</h3>
        <p className="text-sm sm:text-base text-[#62646a] leading-relaxed">
          Residential and commercial properties can have different valuation methods, eligibility conditions, documentation requirements, lending policies and risk assessments. Lenders review property ownership, title documents, valuation, location, existing charges, income, repayment capacity and credit history.
        </p>
      </div>

      {/* 14. Frequently Asked Questions */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-6">
        <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
          <div className="p-2 rounded-xl bg-emerald-50 text-[#1dbf73]">
            <HelpCircle className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-extrabold text-[#222325]">Loan Against Property FAQs</h3>
        </div>

        <div className="space-y-6">
          {[
            {
              q: 'What is a Loan Against Property Calculator?',
              a: 'A Loan Against Property Calculator estimates the EMI, total interest and total repayment for a proposed property-backed loan. It uses loan amount, interest rate and tenure for repayment, while property value helps understand proposed LTV.'
            },
            {
              q: 'What inputs are required for a LAP Calculator?',
              a: 'The calculator requires Property Market Value, Loan Amount (Principal), Interest Rate (% p.a.) and Tenure (Years).'
            },
            {
              q: 'Does property value directly determine EMI?',
              a: 'No. Once the loan amount is specified, EMI primarily depends on the principal, interest rate and tenure. Property value is used for understanding the proposed loan-to-value relationship.'
            },
            {
              q: 'What is LTV in a Loan Against Property?',
              a: 'LTV means Loan-to-Value. It compares the proposed loan amount with the property value. A ₹50 lakh loan against a ₹1 crore property represents a 50% LTV.'
            },
            {
              q: 'Can I borrow 70% of my property\'s value?',
              a: 'Not automatically. The maximum amount depends on the lender, property type, valuation, loan product and borrower eligibility. Some lenders advertise higher LTV limits for specific products.'
            },
            {
              q: 'What is the current LAP interest rate in India?',
              a: 'There is no single nationwide LAP rate. Rates vary by lender, borrower profile, loan amount, property and product (e.g., ICICI Bank published rates range from 10.60% to 12.25%).'
            },
            {
              q: 'Does a higher interest rate increase EMI?',
              a: 'Yes. Keeping loan amount and tenure unchanged, a higher interest rate increases both monthly EMI and total interest.'
            },
            {
              q: 'Does a longer LAP tenure reduce EMI?',
              a: 'Usually yes, by spreading repayment across more months. The trade-off is higher total interest.'
            },
            {
              q: 'Is the property value entered into the calculator the lender\'s valuation?',
              a: 'No. It is an estimate for your planning. The lender will conduct its own official valuation before deciding the sanctioned amount.'
            },
            {
              q: 'Can the calculator guarantee loan approval?',
              a: 'No. It provides mathematical estimates based on your inputs. The lender makes the final decision after underwriting the borrower and property.'
            }
          ].map((faq, i) => (
            <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <h4 className="font-bold text-sm text-[#222325]">{faq.q}</h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 15. Final Takeaway */}
      <div className="bg-gradient-to-r from-emerald-900 to-[#013a12] rounded-3xl p-6 sm:p-10 text-white space-y-4">
        <h3 className="text-xl font-extrabold text-white">Final Takeaway</h3>
        <p className="text-sm sm:text-base text-emerald-100 leading-relaxed">
          A Loan Against Property Calculator is most useful when you use it to test different borrowing decisions. Start with a realistic property value, enter the amount you actually need, use the quoted interest rate, and compare tenures. Check total interest, total repayment, and proposed LTV. Your calculator result is an estimate; the lender's valuation and final loan terms determine your actual loan.
        </p>
      </div>
    </div>
  );
};
