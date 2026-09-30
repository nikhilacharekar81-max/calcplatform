import React from 'react';
import { BookOpen, Building2, TrendingUp, AlertCircle, ShieldCheck, DollarSign } from 'lucide-react';

export const BusinessLoanGuideContent: React.FC = () => {
  return (
    <div className="space-y-12 font-sans text-[#404145] leading-relaxed">
      {/* Article Header & Intro */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800">
          <Building2 className="w-3.5 h-3.5" />
          Business Financing &amp; Working Capital
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#222325]">
          Business Loan EMI Calculator: Calculate Your Monthly EMI, Interest &amp; Total Repayment
        </h1>
        <p className="text-sm sm:text-base text-[#62646a] leading-relaxed">
          Taking a business loan can help you buy equipment, add inventory, open another location, manage working capital, or handle a large business expense.
        </p>
        <p className="text-sm sm:text-base text-[#62646a] leading-relaxed">
          But before taking a loan, one question matters more than the approved loan amount:
        </p>
        <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1 text-emerald-950">
          <p className="text-xs sm:text-sm font-semibold">The fundamental financial test for any business owner:</p>
          <p className="text-base sm:text-xl font-black italic">&ldquo;Can my business comfortably handle this monthly EMI even during lean months?&rdquo;</p>
        </div>
        <p className="text-sm sm:text-base text-[#62646a] leading-relaxed">
          Our <strong>Business Loan EMI Calculator</strong> helps you estimate your monthly EMI, total interest, and total repayment amount before you commit to a loan. Enter your <strong>loan amount, interest rate, and loan tenure</strong> to get an estimate within seconds.
        </p>
        <p className="text-sm sm:text-base text-[#62646a] leading-relaxed">
          The calculator is useful whether you run a small shop, work as a self-employed professional, operate a manufacturing business, run a service company, or manage an established enterprise.
        </p>
        <p className="text-xs text-[#74767e] italic">
          Important: The calculator provides a mathematical estimate. The actual EMI charged by a lender can differ because of the lender's interest-rate method, repayment schedule, fees, rounding practices, rate changes, and loan terms.
        </p>
      </div>

      {/* What Is a Business Loan EMI? */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <h2 className="text-xl font-extrabold text-[#222325]">
          What Is a Business Loan EMI?
        </h2>
        <p className="text-sm text-[#62646a]">
          EMI stands for <strong>Equated Monthly Instalment</strong>. It is the amount you are scheduled to pay towards your loan each month. An EMI normally contains two parts:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <div className="font-bold text-[#222325] text-sm">Principal Component</div>
            <p className="text-xs text-[#62646a]">The portion of the EMI that directly reduces the money you originally borrowed.</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <div className="font-bold text-[#222325] text-sm">Interest Component</div>
            <p className="text-xs text-[#62646a]">The borrowing cost charged by the bank or NBFC for providing the capital.</p>
          </div>
        </div>
        <p className="text-sm text-[#62646a]">
          At the beginning of a typical reducing-balance loan, a larger part of the EMI goes towards interest. As the outstanding loan balance comes down, the interest component generally becomes smaller and more of the EMI goes towards the principal.
        </p>
        <p className="text-sm text-[#62646a]">
          This is why looking only at the monthly EMI can sometimes be misleading. A loan with a lower EMI may still cost considerably more overall if the repayment period is much longer.
        </p>
      </div>

      {/* How to Use the Calculator */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-6">
        <h2 className="text-xl font-extrabold text-[#222325]">
          How to Use the Business Loan EMI Calculator
        </h2>
        <p className="text-sm text-[#62646a]">
          You only need three main inputs to calculate your business loan repayment:
        </p>

        <div className="space-y-4">
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <h3 className="text-base font-bold text-[#222325]">1. Enter the Loan Amount</h3>
            <p className="text-xs sm:text-sm text-[#62646a]">
              Enter the amount you plan to borrow (e.g., ₹2,00,000, ₹5,00,000, ₹10,00,000, ₹25,00,000, or ₹50,00,000). Your actual eligible loan amount may differ from the amount entered because lenders assess business income, existing obligations, credit history, business vintage, and financial records.
            </p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <h3 className="text-base font-bold text-[#222325]">2. Enter the Interest Rate</h3>
            <p className="text-xs sm:text-sm text-[#62646a]">
              Enter the annual interest rate quoted or assumed for your calculation (e.g. 12% per year). Business loan rates vary based on whether the loan is collateral-free or secured, the borrower's credit profile, business turnover, and lender policy.
            </p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <h3 className="text-base font-bold text-[#222325]">3. Select the Loan Tenure</h3>
            <p className="text-xs sm:text-sm text-[#62646a]">
              Choose how long you want to take to repay the loan (e.g., 1 to 5 years). A shorter tenure means higher monthly EMIs but lower total interest. A longer tenure means lower monthly EMIs but higher total interest paid over time.
            </p>
          </div>
        </div>
      </div>

      {/* Business Loan EMI Formula */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <h2 className="text-xl font-extrabold text-[#222325]">
          Business Loan EMI Formula
        </h2>
        <p className="text-sm text-[#62646a]">
          For a standard reducing-balance loan with a fixed periodic interest rate, the monthly EMI is calculated using:
        </p>
        <div className="p-6 rounded-2xl bg-slate-900 text-white font-mono text-center text-sm sm:text-base overflow-x-auto my-3">
          EMI = [P &times; r &times; (1+r)^n] / [(1+r)^n - 1]
        </div>
        <div className="text-xs sm:text-sm text-[#62646a] space-y-2">
          <p>Where:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>P</strong> = Principal loan amount</li>
            <li><strong>r</strong> = Monthly interest rate (e.g., 12% &divide; 12 &divide; 100 = 0.01 per month)</li>
            <li><strong>n</strong> = Total number of monthly instalments (e.g., 5 years &times; 12 = 60 months)</li>
          </ul>
        </div>
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
          <div className="font-bold text-[#222325] text-xs">Why Does the Interest Portion Change Every Month?</div>
          <p className="text-xs text-[#62646a]">
            Interest is calculated on the outstanding principal balance in a reducing-balance structure. When the outstanding principal is high, the monthly interest calculated is higher. As principal is repaid, the remaining balance falls, causing future monthly interest charges to decrease.
          </p>
        </div>
      </div>

      {/* Example: ₹10,00,000 Business Loan */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <h2 className="text-xl font-extrabold text-[#222325]">
          Example: ₹10,00,000 Business Loan Breakdown
        </h2>
        <p className="text-sm text-[#62646a]">
          Suppose you take a hypothetical <strong>₹10,00,000 business loan</strong> at <strong>12% p.a.</strong> for <strong>5 years (60 months)</strong>:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-1">
            <div className="text-xs text-slate-500 font-medium">Estimated Monthly EMI</div>
            <div className="text-lg font-black text-emerald-600">₹22,244</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-1">
            <div className="text-xs text-slate-500 font-medium">Estimated Total Interest</div>
            <div className="text-lg font-black text-[#222325]">₹3,34,667</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-1">
            <div className="text-xs text-slate-500 font-medium">Estimated Total Repayment</div>
            <div className="text-lg font-black text-[#222325]">₹13,34,667</div>
          </div>
        </div>
        <p className="text-sm text-[#62646a]">
          Before borrowing, ask yourself: <em>&ldquo;If sales are lower than expected for a few months, can my business still make this ₹22,244 payment comfortably?&rdquo;</em> That question is often far more critical than whether a lender is willing to approve the sanction letter.
        </p>
      </div>

      {/* Short Tenure vs Long Tenure */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <h2 className="text-xl font-extrabold text-[#222325]">
          Short Tenure vs. Long Tenure Trade-Offs
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <div className="font-bold text-[#222325] text-sm">Shorter Tenure (e.g. 2 Years)</div>
            <p className="text-xs text-[#62646a]">Higher monthly EMI, but the loan is repaid sooner with substantially lower total interest burden. Ideal for businesses with predictable, robust cash flow.</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <div className="font-bold text-[#222325] text-sm">Longer Tenure (e.g. 5 Years)</div>
            <p className="text-xs text-[#62646a]">Lower monthly EMI, easing monthly working capital pressure. However, total interest paid over the loan term is higher. Ideal for businesses with seasonal income variations.</p>
          </div>
        </div>
        <p className="text-sm text-[#62646a]">
          Do not choose a tenure simply because the EMI looks small. Evaluate your actual business expenses: employee salaries, rent, GST, existing loan EMIs, supplier payments, and emergency cash buffers.
        </p>
      </div>

      {/* Cash Flow vs Paper Profit */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <div className="flex items-center gap-2 font-bold text-[#222325] text-lg">
          <TrendingUp className="w-5 h-5 text-emerald-600 shrink-0" />
          Business Loan EMI and Cash Flow Reality
        </div>
        <p className="text-sm text-[#62646a]">
          Your business may have a profitable year on paper but still face severe cash-flow crunches. For example, if customers take 30 to 60 days to pay invoices, your sales are recorded today, but actual cash reaches your bank account weeks later.
        </p>
        <p className="text-sm text-[#62646a]">
          Meanwhile, your loan EMI is due on a fixed date every month. Projected accounting profit and available bank cash are not the same thing. Ensure your liquid cash inflow comfortably covers the EMI even when customer payments are delayed.
        </p>
      </div>

      {/* Existing Loan Obligations */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <h2 className="text-xl font-extrabold text-[#222325]">
          Cumulative Effect of Existing Debt
        </h2>
        <p className="text-sm text-[#62646a]">
          If you already pay existing business or equipment loans, adding another EMI increases total monthly fixed liabilities:
        </p>
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs sm:text-sm text-[#62646a]">
          <div className="flex justify-between border-b border-slate-200 pb-1">
            <span>Existing Business Loan EMI:</span>
            <span className="font-bold text-[#222325]">₹25,000</span>
          </div>
          <div className="flex justify-between border-b border-slate-200 pb-1">
            <span>Equipment Finance EMI:</span>
            <span className="font-bold text-[#222325]">₹15,000</span>
          </div>
          <div className="flex justify-between border-b border-slate-200 pb-1">
            <span>Proposed New Business Loan EMI:</span>
            <span className="font-bold text-emerald-700">₹20,000</span>
          </div>
          <div className="flex justify-between font-bold text-[#222325] pt-1 text-sm">
            <span>Total Monthly Loan Commitment:</span>
            <span className="text-emerald-800">₹60,000 / month</span>
          </div>
        </div>
        <p className="text-xs text-[#74767e]">
          Lenders evaluate your total Debt-Service Coverage Ratio (DSCR) and existing obligations when assessing new credit applications.
        </p>
      </div>

      {/* Business Loan Use Cases */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <h2 className="text-xl font-extrabold text-[#222325]">
          Evaluating Specific Business Loan Use Cases
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <div className="font-bold text-[#222325] text-sm">Working Capital</div>
            <p className="text-xs text-[#62646a]">Used to buy bulk inventory, pay suppliers, or bridge seasonal cash gaps. Avoid using working capital loans to fund continuous operating losses.</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <div className="font-bold text-[#222325] text-sm">Equipment &amp; Machinery</div>
            <p className="text-xs text-[#62646a]">Compare the expected monthly operating cost savings or additional production revenue generated by the machine against its monthly EMI.</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <div className="font-bold text-[#222325] text-sm">Business Expansion</div>
            <p className="text-xs text-[#62646a]">Funding a second outlet or new branch. Prepare conservative cash-flow projections rather than relying on best-case scenario sales targets.</p>
          </div>
        </div>
      </div>

      {/* Credit Score & Business Eligibility */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-3">
          <h2 className="text-lg font-extrabold text-[#222325]">
            Fixed vs. Floating Rates
          </h2>
          <p className="text-xs sm:text-sm text-[#62646a]">
            <strong>Fixed Rate:</strong> EMI remains unchanged throughout the loan duration.<br />
            <strong>Floating Rate:</strong> Rate moves with the lender's benchmark, meaning monthly EMIs or loan tenures can increase during rate hike cycles.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-3">
          <h2 className="text-lg font-extrabold text-[#222325]">
            Processing Fees &amp; Net Disbursement
          </h2>
          <p className="text-xs sm:text-sm text-[#62646a]">
            Processing fees (typically 1% to 3% plus GST) are often deducted upfront from the sanctioned amount. If you borrow ₹10,00,000, you might receive ₹9,75,000 in hand while repaying interest on the full ₹10,00,000.
          </p>
        </div>
      </div>

      {/* Revenue vs Net Operating Cash */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <h2 className="text-xl font-extrabold text-[#222325]">
          Business Revenue vs. Repayment Capacity
        </h2>
        <p className="text-sm text-[#62646a]">
          Never compare your monthly EMI directly with gross sales revenue. Suppose your business records gross monthly sales of ₹10,00,000. That does not mean ₹10,00,000 is available for loan repayment.
        </p>
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
          <div className="font-bold text-[#222325] text-xs sm:text-sm">Gross Sales (₹10,00,000) &minus; Operating Expenses = Net Cash Available</div>
          <p className="text-xs text-[#62646a]">
            Subtract inventory costs, salaries, factory rent, GST/taxes, electricity, logistics, software, and vendor payments. Only the remaining net surplus cash flow determines true loan repayment capacity.
          </p>
        </div>
      </div>

      {/* 10 Preparation Steps */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <h2 className="text-xl font-extrabold text-[#222325]">
          10 Checklist Steps Before Applying for a Business Loan
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#62646a]">
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">1. Review all existing business &amp; personal loan commitments.</div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">2. Check personal CIBIL and commercial credit reports.</div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">3. Organise GST returns, ITR filings, and audited P&amp;L statements.</div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">4. Calculate the exact capital required for the project.</div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">5. Prepare realistic monthly cash-flow projections.</div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">6. Stress-test the EMI in the calculator at higher interest rates.</div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">7. Compare shorter vs. longer tenure impact on total interest.</div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">8. Verify processing fees, legal charges, and documentation costs.</div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">9. Read foreclosure, part-prepayment, and penalty terms.</div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">10. Maintain an emergency cash cushion for business operations.</div>
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
              q: 'What is a Business Loan EMI?',
              a: 'A Business Loan EMI is the fixed monthly payment made to repay a business loan. It consists of both principal repayment and interest charged by the bank or NBFC.',
            },
            {
              q: 'How is a Business Loan EMI calculated?',
              a: 'Using the reducing-balance formula based on the principal loan amount, monthly interest rate, and total tenure in months.',
            },
            {
              q: 'Does a business loan affect my personal CIBIL score?',
              a: 'Yes. For sole proprietorships, partnerships, or loans where business owners act as personal guarantors, repayment history directly impacts personal CIBIL scores.',
            },
            {
              q: 'What is the difference between fixed and floating business loan rates?',
              a: 'A fixed rate keeps the interest rate and EMI constant throughout the tenure. A floating rate changes according to external market benchmarks (like RBI Repo Rate).',
            },
            {
              q: 'Can I get a business loan without collateral?',
              a: 'Yes. Unsecured business loans do not require collateral (property or machinery), but they often carry higher interest rates and require strong turnover and credit records.',
            },
            {
              q: 'How does business cash flow affect loan eligibility?',
              a: 'Lenders inspect bank statements and GST filings to ensure regular monthly cash inflows are sufficient to service the proposed EMI alongside operating costs.',
            },
            {
              q: 'Can I prepay or foreclose a business loan early?',
              a: 'Yes, most lenders allow early foreclosure or part-prepayment, though prepayment charges (1% to 5%) may apply depending on the loan agreement and lender policy.',
            },
            {
              q: 'Is processing fee deducted from the loan sanction amount?',
              a: 'Yes. Lenders usually deduct processing fees (1% to 3% plus GST) upfront from the sanctioned amount during loan disbursement.',
            },
            {
              q: 'Is it better to take a shorter or longer tenure for a business loan?',
              a: 'A shorter tenure saves interest cost if cash flow is robust. A longer tenure lowers monthly EMI pressure, providing breathing room for businesses with variable monthly sales.',
            },
            {
              q: 'How do existing EMIs impact my new business loan approval?',
              a: 'Existing EMIs reduce your net Debt-Service Coverage Ratio (DSCR), which may lower the maximum new loan amount a bank is willing to sanction.',
            },
            {
              q: 'What expenses are included in working capital borrowing?',
              a: 'Raw material procurement, inventory stock, vendor payments, supplier invoices, employee wages, and temporary operational cash gaps.',
            },
            {
              q: 'What happens if my customers delay invoice payments?',
              a: 'Loan EMIs are due on fixed monthly dates regardless of customer payment delays. Maintain a 2 to 3-month EMI emergency cash buffer to handle delayed receivables.',
            },
            {
              q: 'Is loan eligibility the same as monthly affordability?',
              a: 'No. A bank may approve a high loan limit based on turnover, but affordability depends on your net operating surplus cash after all business and family expenses.',
            },
            {
              q: 'What documents do lenders examine for business loans?',
              a: 'Bank statements (12 months), GST returns, ITR filings (2-3 years), audited P&L and Balance Sheet, business registration proof, and KYC of promoters.',
            },
            {
              q: 'What is more important: monthly EMI or total repayment?',
              a: 'Both matter equally. Monthly EMI determines your immediate cash-flow pressure, while total interest and total repayment tell you the true cost of borrowing over time.',
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

      {/* Final Checklist & Summary */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <h2 className="text-xl font-extrabold text-[#222325]">
          Final Decision Rule for Business Borrowers
        </h2>
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 font-bold text-center text-[#222325] text-xs sm:text-sm">
          Sanction Amount &minus; Processing Fees &rarr; Disbursed Cash &rarr; Interest Rate &rarr; Tenure &rarr; EMI &rarr; Net Operating Surplus Cash Buffer
        </div>
        <p className="text-sm text-[#62646a]">
          The goal of a Business Loan EMI Calculator is not to tell you how much you can borrow, but to help you understand what borrowing will cost your business each month.
        </p>
      </div>

      {/* Disclaimer */}
      <div className="bg-slate-50 rounded-3xl border border-slate-200 p-6 sm:p-8 text-xs text-slate-500 space-y-2">
        <div className="font-bold text-[#222325]">Important Rate &amp; Calculator Disclaimer</div>
        <p>
          The Business Loan EMI Calculator provides mathematical estimates based on the information entered by the user and standard amortisation formulas. Actual loan terms, interest rates, processing fees, documentation charges, foreclosure rules, and EMI repayment schedules vary by lender and individual business credit assessment.
        </p>
        <p>
          Always verify the official sanction letter, interest rate, fee schedule, and loan agreement directly with your lending bank or financial institution before making a borrowing decision.
        </p>
      </div>
    </div>
  );
};
