import React from 'react';
import { BookOpen, AlertCircle, HeartHandshake, ShieldCheck, GraduationCap, DollarSign } from 'lucide-react';

export const EducationLoanGuideContent: React.FC = () => {
  return (
    <div className="space-y-12 font-sans text-[#404145] leading-relaxed">
      {/* Article Header & Intro */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800">
          <GraduationCap className="w-3.5 h-3.5" />
          Higher Education Financial Planning
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#222325]">
          Education Loan EMI Calculator: Calculate Monthly EMI, Interest &amp; Total Repayment
        </h1>
        <p className="text-sm sm:text-base text-[#62646a] leading-relaxed">
          Planning for higher education can be exciting, but the cost of college, university, professional courses or studying abroad can become a major financial responsibility.
        </p>
        <p className="text-sm sm:text-base text-[#62646a] leading-relaxed">
          An <strong>Education Loan EMI Calculator</strong> helps you understand that responsibility before you borrow. You can enter your expected loan amount, interest rate and repayment tenure to estimate your <strong>monthly EMI, total interest and total repayment amount</strong>.
        </p>
        <p className="text-sm sm:text-base text-[#62646a] leading-relaxed">
          This is useful whether you are planning an engineering degree, MBA, medical course, postgraduate programme, professional qualification or higher education abroad.
        </p>
        <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1 text-emerald-950">
          <p className="text-xs sm:text-sm font-semibold">More importantly, an EMI calculation helps answer the vital question:</p>
          <p className="text-base sm:text-xl font-black italic">&ldquo;How much loan can I realistically repay after my studies?&rdquo;</p>
          <p className="text-xs text-emerald-800 pt-1">
            That is the number you should think about before signing a loan agreement with your bank.
          </p>
        </div>
        <p className="text-xs text-[#74767e] italic">
          Important: The calculator provides a mathematical estimate. The actual EMI and repayment schedule can differ depending on the lender's interest-rate method, rate changes, moratorium terms, repayment start date, capitalisation of interest, prepayments, rounding and other loan conditions.
        </p>
      </div>

      {/* What Is an Education Loan EMI Calculator? */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <h2 className="text-xl font-extrabold text-[#222325]">
          What Is an Education Loan EMI Calculator?
        </h2>
        <p className="text-sm text-[#62646a]">
          An Education Loan EMI Calculator is an online tool that estimates the monthly instalment you may have to pay after your education loan enters its repayment period. You generally need three main inputs:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <div className="text-xs font-bold text-[#222325]">Loan Amount</div>
            <p className="text-xs text-slate-500">Total principal you plan to borrow (e.g. ₹10,00,000)</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <div className="text-xs font-bold text-[#222325]">Interest Rate</div>
            <p className="text-xs text-slate-500">Annual interest rate applicable (e.g. 9.00% p.a.)</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <div className="text-xs font-bold text-[#222325]">Loan Tenure</div>
            <p className="text-xs text-slate-500">Repayment period in years/months (e.g. 10 years)</p>
          </div>
        </div>
        <p className="text-sm text-[#62646a]">
          For example, suppose you are considering borrowing <strong>₹10,00,000</strong> at <strong>9% p.a.</strong> over <strong>10 years</strong>. The calculator estimates your monthly EMI at roughly ₹12,668, showing you that over 120 months, you will repay a total of ₹15.20 lakh. This gives you a clear picture of the true long-term borrowing cost.
        </p>
      </div>

      {/* Why Calculate Before Borrowing */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <h2 className="text-xl font-extrabold text-[#222325]">
          Why You Should Calculate Your Education Loan EMI Before Borrowing
        </h2>
        <p className="text-sm text-[#62646a]">
          An education loan is different from an ordinary short-term loan. You borrow the money while studying, but your repayment responsibility can continue for 10 or 15 years after graduation.
        </p>
        <p className="text-sm text-[#62646a]">
          Your financial situation may also be very different when repayment starts. When you step into your first job, you might face:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-[#62646a]">
          <li>Entry-level starting salary realities</li>
          <li>Relocation expenses to a new metro city</li>
          <li>House rent, PG, or hostel bills</li>
          <li>Daily food, commuting, and living expenses</li>
          <li>Family responsibilities or helping aging parents</li>
          <li>Other credit commitments or emergency savings goals</li>
        </ul>
        <p className="text-sm text-[#62646a]">
          A ₹10,00,000 loan sounds manageable when paying college fees today. The more useful human question is: <strong>What will this ₹10,00,000 loan cost me when I actually start repaying it?</strong>
        </p>
      </div>

      {/* How to Use */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-6">
        <h2 className="text-xl font-extrabold text-[#222325]">
          How to Use the Education Loan EMI Calculator
        </h2>
        <div className="space-y-4">
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <h3 className="text-base font-bold text-[#222325]">1. Enter the loan amount</h3>
            <p className="text-xs sm:text-sm text-[#62646a]">
              Enter the amount you expect to borrow (e.g. ₹5,00,000, ₹10,00,000, or ₹20,00,000). Do not automatically enter the full university fee. First deduct scholarships, family contributions, savings, and assistantships. Borrowing less means less principal accumulating interest.
            </p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <h3 className="text-base font-bold text-[#222325]">2. Enter the interest rate</h3>
            <p className="text-xs sm:text-sm text-[#62646a]">
              Enter the annual interest rate quoted by your lender (e.g. 8.5%, 9.0%, 10.0%). Rates vary according to course type, institution ranking (e.g., Tier-1 premier institutes get lower rates), country of study, collateral offered, and co-applicant credit profile.
            </p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <h3 className="text-base font-bold text-[#222325]">3. Select the repayment tenure</h3>
            <p className="text-xs sm:text-sm text-[#62646a]">
              Education loan tenures often span 5 to 15 years. A longer tenure reduces the monthly EMI but increases total interest paid over the life of the loan. That is why you should evaluate both EMI and total interest together.
            </p>
          </div>
        </div>
      </div>

      {/* Education Loan EMI Formula */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <h2 className="text-xl font-extrabold text-[#222325]">
          Education Loan EMI Formula
        </h2>
        <p className="text-sm text-[#62646a]">
          For a standard reducing-balance calculation, the monthly EMI is calculated using:
        </p>
        <div className="p-6 rounded-2xl bg-slate-900 text-white font-mono text-center text-sm sm:text-base overflow-x-auto my-3">
          EMI = [P &times; r &times; (1+r)^n] / [(1+r)^n - 1]
        </div>
        <div className="text-xs sm:text-sm text-[#62646a] space-y-2">
          <p>Where:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>P</strong> = Principal loan amount</li>
            <li><strong>r</strong> = Monthly interest rate (Annual Rate &divide; 12 &divide; 100) e.g., 9% &divide; 12 &divide; 100 = 0.0075 per month</li>
            <li><strong>n</strong> = Total number of monthly instalments (Years &times; 12) e.g., 10 years &times; 12 = 120 months</li>
          </ul>
        </div>
      </div>

      {/* Example Table */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <h2 className="text-xl font-extrabold text-[#222325]">
          Example: ₹10,00,000 Education Loan Breakdown
        </h2>
        <div className="overflow-x-auto border border-slate-200 rounded-2xl max-w-lg">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="bg-slate-100 text-[#222325]">
                <th className="p-3 font-bold border-b border-slate-200">Particular</th>
                <th className="p-3 font-bold border-b border-slate-200 text-right">Example Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[#62646a]">
              <tr><td className="p-3 font-bold">Loan amount</td><td className="p-3 text-right">₹10,00,000</td></tr>
              <tr className="bg-slate-50/50"><td className="p-3">Interest rate</td><td className="p-3 text-right font-semibold">9.00% p.a.</td></tr>
              <tr><td className="p-3">Repayment tenure</td><td className="p-3 text-right">10 years (120 months)</td></tr>
              <tr className="bg-emerald-50/80 font-bold text-[#222325]"><td className="p-3">Estimated Monthly EMI</td><td className="p-3 text-right text-emerald-700">₹12,668</td></tr>
              <tr><td className="p-3 font-semibold">Total Repayment</td><td className="p-3 text-right font-bold text-[#222325]">₹15,20,160</td></tr>
              <tr className="bg-slate-50/50"><td className="p-3 font-semibold">Total Interest</td><td className="p-3 text-right font-bold text-[#222325]">₹5,20,160</td></tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-[#74767e]">
          This illustrates why a ₹10 lakh loan eventually requires over ₹15.2 lakh to repay over a 10-year term.
        </p>
      </div>

      {/* Moratorium Period Explanation & Capitalisation */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <h2 className="text-xl font-extrabold text-[#222325]">
          The Most Important Issue: Moratorium Period &amp; Interest Capitalisation
        </h2>
        <p className="text-sm text-[#62646a]">
          Education loans often have a study period followed by a moratorium or repayment holiday (e.g. course duration + 6 to 12 months). This gives students time to finish their studies and secure job placement before full EMIs start.
        </p>
        <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 text-xs sm:text-sm text-amber-950 space-y-2">
          <div className="flex items-center gap-2 font-bold text-amber-900 text-base">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
            A Moratorium Does Not Stop Interest Accumulation!
          </div>
          <p>
            Depending on the loan scheme, interest continues to accrue during the study period and moratorium period. Unpaid simple interest during college may be <strong>capitalised (added to the principal balance)</strong> before regular EMI repayment starts.
          </p>
          <div className="p-3 rounded-xl bg-white/80 border border-amber-300/60 font-semibold text-slate-800">
            Example: If you borrow ₹10,00,000 and accumulate ₹1,80,000 simple interest during 4 years of college, your starting principal for EMI calculation will become ₹11,80,000!
          </div>
          <p className="font-bold pt-1 text-amber-900">
            Always ask your lender: &ldquo;What will my actual outstanding loan balance be when my monthly EMI starts?&rdquo;
          </p>
        </div>
      </div>

      {/* Does Paying Interest During College Make Sense? */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <h2 className="text-xl font-extrabold text-[#222325]">
          Does Paying Simple Interest During College Make Sense?
        </h2>
        <p className="text-sm text-[#62646a]">
          If the lender allows it and the family can comfortably afford it, servicing simple interest monthly while the student is in college can prevent interest from compounding into the principal balance.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="font-bold text-[#222325] text-sm">Paying Interest During College</div>
            <p className="text-xs text-[#62646a]">
              Prevents capitalisation. Keeps your starting loan principal strictly at ₹10,00,000, lowering your monthly EMI after graduation and saving lakhs in future interest.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="font-bold text-[#222325] text-sm">Deferring All Payments</div>
            <p className="text-xs text-[#62646a]">
              Preserves family monthly cash flow during college, but increases starting principal to ₹11.8+ lakhs, leading to higher monthly EMIs later.
            </p>
          </div>
        </div>
        <p className="text-xs text-[#74767e]">
          Note: A family should never empty its liquid emergency savings simply to pay college interest. Balance monthly safety with future interest savings.
        </p>
      </div>

      {/* Indicative Rates 20 Banks Table */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <h2 className="text-xl font-extrabold text-[#222325]">
          Education Loan Interest Rates: Indicative Comparison Across Lenders
        </h2>
        <p className="text-sm text-[#62646a]">
          Published market comparison data indicates education loan interest rates ranging from approximately <strong>6.85% to 16.00% p.a.</strong>:
        </p>

        <div className="overflow-x-auto border border-slate-200 rounded-2xl">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="bg-slate-100 text-[#222325]">
                <th className="p-3 font-bold border-b border-slate-200">Lender</th>
                <th className="p-3 font-bold border-b border-slate-200 text-right">Indicative Rate Range</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[#62646a]">
              <tr><td className="p-3 font-semibold">Bank of Maharashtra</td><td className="p-3 text-right font-bold text-emerald-600">Around 6.85%–10.05%</td></tr>
              <tr className="bg-slate-50/50"><td className="p-3 font-semibold">UCO Bank</td><td className="p-3 text-right font-bold text-emerald-600">Around 6.90%–10.50%</td></tr>
              <tr><td className="p-3 font-semibold">IDBI Bank</td><td className="p-3 text-right font-bold text-emerald-600">Around 6.95%–10.40%</td></tr>
              <tr className="bg-slate-50/50"><td className="p-3 font-semibold">Bank of India</td><td className="p-3 text-right font-bold text-emerald-600">Around 7.00%–9.80%</td></tr>
              <tr><td className="p-3 font-semibold">Canara Bank</td><td className="p-3 text-right font-bold text-emerald-600">Around 7.25%–10.10%</td></tr>
              <tr className="bg-slate-50/50"><td className="p-3 font-semibold">Punjab National Bank</td><td className="p-3 text-right font-bold text-emerald-600">From around 7.50%</td></tr>
              <tr><td className="p-3 font-semibold">Indian Overseas Bank</td><td className="p-3 text-right font-bold text-emerald-600">Around 7.50%–11.75%</td></tr>
              <tr className="bg-slate-50/50"><td className="p-3 font-semibold">Axis Bank</td><td className="p-3 text-right font-bold text-emerald-600">Around 8.00%–16.00%</td></tr>
              <tr><td className="p-3 font-semibold">Bank of Baroda</td><td className="p-3 text-right font-bold text-emerald-600">From around 8.15%</td></tr>
              <tr className="bg-slate-50/50"><td className="p-3 font-semibold">ICICI Bank</td><td className="p-3 text-right font-bold text-emerald-600">Around 8.50%–13.00%</td></tr>
              <tr><td className="p-3 font-semibold">HDFC Credila</td><td className="p-3 text-right font-bold text-emerald-600">Around 9.00%–13.00%</td></tr>
              <tr className="bg-slate-50/50"><td className="p-3 font-semibold">State Bank of India (SBI)</td><td className="p-3 text-right font-bold text-emerald-600">Around 9.40%–9.90%</td></tr>
              <tr><td className="p-3 font-semibold">IDFC FIRST Bank</td><td className="p-3 text-right font-bold text-emerald-600">From around 9.50%</td></tr>
              <tr className="bg-slate-50/50"><td className="p-3 font-semibold">Karnataka Bank</td><td className="p-3 text-right font-bold text-emerald-600">Around 9.81% onwards</td></tr>
              <tr><td className="p-3 font-semibold">Avanse</td><td className="p-3 text-right font-bold text-emerald-600">Around 10.00%–14.50%</td></tr>
              <tr className="bg-slate-50/50"><td className="p-3 font-semibold">HDFC Bank</td><td className="p-3 text-right font-bold text-emerald-600">Around 10.50% onwards</td></tr>
              <tr><td className="p-3 font-semibold">Federal Bank</td><td className="p-3 text-right font-bold text-emerald-600">Around 10.50%–13.50%</td></tr>
              <tr className="bg-slate-50/50"><td className="p-3 font-semibold">Karur Vysya Bank</td><td className="p-3 text-right font-bold text-emerald-600">Around 10.75%–13.25%</td></tr>
              <tr><td className="p-3 font-semibold">Tamilnad Mercantile Bank</td><td className="p-3 text-right font-bold text-emerald-600">Around 11.30%–14.15%</td></tr>
              <tr className="bg-slate-50/50"><td className="p-3 font-semibold">Kotak Mahindra Bank</td><td className="p-3 text-right font-bold text-emerald-600">Up to around 16.00%</td></tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-[#74767e]">
          Rates are floating and benchmark-linked. Always verify official current bank terms directly before applying.
        </p>
      </div>

      {/* CIBIL Score & Co-Applicant Role */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <h2 className="text-xl font-extrabold text-[#222325]">
          Why CIBIL Score &amp; Co-Applicant Profile Matter
        </h2>
        <p className="text-sm text-[#62646a]">
          Since many students have no established credit history (showing an NA/NH score), lenders evaluate the <strong>financial profile and CIBIL score of the co-applicant (parent, guardian, or spouse)</strong>.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <div className="font-bold text-[#222325] text-sm">Co-Applicant CIBIL &gt; 750</div>
            <p className="text-xs text-[#62646a]">Demonstrates responsible debt management, enabling lower floating interest spreads and faster loan approvals.</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <div className="font-bold text-[#222325] text-sm">Co-Applicant CIBIL Errors</div>
            <p className="text-xs text-[#62646a]">Missed credit card or home loan EMIs by co-applicants can lead to higher interest rates or collateral demands.</p>
          </div>
        </div>
      </div>

      {/* Education Loan for Parents */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <div className="flex items-center gap-2 font-bold text-[#222325] text-lg">
          <HeartHandshake className="w-5 h-5 text-emerald-600 shrink-0" />
          Education Loan for Parents: What Should You Consider?
        </div>
        <p className="text-sm text-[#62646a]">
          Parents often play an indispensable financial role as primary co-applicants or guarantors. Before taking on a significant education loan, parents should review their personal financial health:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-[#62646a]">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <strong>Other Children's Education:</strong> Will funding one child restrict borrowing capacity for younger siblings later?
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <strong>Retirement Savings Protection:</strong> Never liquidate retirement provident funds or pension deposits to pay tuition if a structured education loan is available.
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <strong>Emergency Cash Reserves:</strong> Keep at least 6 months of household running expenses intact in liquid bank savings.
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <strong>Delayed Placement Backup:</strong> Ensure the family can comfortably manage interest payments if post-graduation job placement takes 6 months longer than planned.
          </div>
        </div>
      </div>

      {/* Study in India vs Study Abroad & Currency Risk */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-3">
          <h2 className="text-lg font-extrabold text-[#222325]">
            Study in India
          </h2>
          <p className="text-xs sm:text-sm text-[#62646a]">
            Covers tuition fees, hostel expenses, exam fees, and books. Generally involves lower loan amounts, domestic interest rates, and streamlined documentation.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-3">
          <div className="flex items-center gap-1.5 font-extrabold text-[#222325] text-lg">
            <DollarSign className="w-4 h-4 text-emerald-600 shrink-0" />
            Study Abroad &amp; Currency Risk
          </div>
          <p className="text-xs sm:text-sm text-[#62646a]">
            Covers foreign tuition, USD/EUR/GBP living costs, airfare, visa fees, and health insurance. If the Rupee depreciates against foreign currency during college, your Rupee loan requirement increases even if university tuition fees remain unchanged.
          </p>
        </div>
      </div>

      {/* Tax Benefit (Section 80E) & Floating Rate Stress Test */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-3">
          <div className="flex items-center gap-1.5 font-extrabold text-[#222325] text-lg">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            Tax Benefit Under Section 80E
          </div>
          <p className="text-xs sm:text-sm text-[#62646a]">
            Interest paid on eligible higher education loans qualifies for full tax deduction under <strong>Section 80E of the Income Tax Act</strong> (no monetary ceiling on the interest deduction for up to 8 consecutive financial years).
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-3">
          <h2 className="text-lg font-extrabold text-[#222325]">
            Floating Rate Stress Testing
          </h2>
          <p className="text-xs sm:text-sm text-[#62646a]">
            Education loans are generally floating-rate loans linked to Repo/EBR benchmarks. Test your EMI budget at <strong>0.5% and 1.0% higher interest rates</strong> (e.g. at 9.0%, 9.5%, and 10.0%) to ensure affordability during macroeconomic rate hikes.
          </p>
        </div>
      </div>

      {/* Simple Loan Comparison Framework */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <h2 className="text-xl font-extrabold text-[#222325]">
          A Simple Way to Compare Education Loans
        </h2>
        <p className="text-sm text-[#62646a]">
          Before selecting a loan offer, construct a clear side-by-side comparison table:
        </p>

        <div className="overflow-x-auto border border-slate-200 rounded-2xl max-w-xl">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="bg-slate-100 text-[#222325]">
                <th className="p-3 font-bold border-b border-slate-200">Factor</th>
                <th className="p-3 font-bold border-b border-slate-200 text-center">Lender A</th>
                <th className="p-3 font-bold border-b border-slate-200 text-center">Lender B</th>
                <th className="p-3 font-bold border-b border-slate-200 text-center">Lender C</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[#62646a]">
              <tr><td className="p-3 font-bold">Interest Rate</td><td className="p-3 text-center">8.5%</td><td className="p-3 text-center">9.0%</td><td className="p-3 text-center">9.5%</td></tr>
              <tr className="bg-slate-50/50"><td className="p-3 font-bold">Fixed / Floating</td><td className="p-3 text-center">Floating</td><td className="p-3 text-center">Floating</td><td className="p-3 text-center">Floating</td></tr>
              <tr><td className="p-3 font-bold">Processing Fee</td><td className="p-3 text-center">Nil</td><td className="p-3 text-center">₹10,000</td><td className="p-3 text-center">1.5%</td></tr>
              <tr className="bg-slate-50/50"><td className="p-3 font-bold">Moratorium Terms</td><td className="p-3 text-center">Course + 1 yr</td><td className="p-3 text-center">Course + 6 mo</td><td className="p-3 text-center">Course + 1 yr</td></tr>
              <tr><td className="p-3 font-bold">College Interest</td><td className="p-3 text-center">Optional</td><td className="p-3 text-center">Compulsory</td><td className="p-3 text-center">Capitalised</td></tr>
              <tr className="bg-emerald-50/80 font-bold text-[#222325]"><td className="p-3">Total Repayment</td><td className="p-3 text-center text-emerald-800">Compare</td><td className="p-3 text-center text-emerald-800">Compare</td><td className="p-3 text-center text-emerald-800">Compare</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 7 Common Mistakes */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <h2 className="text-xl font-extrabold text-[#222325]">
          7 Common Mistakes Students and Parents Make
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-[#62646a]">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200"><strong>1. Looking only at the EMI:</strong> Ignoring tenure length and total interest burden over 10-15 years.</div>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200"><strong>2. Taking the maximum limit:</strong> Borrowing extra money simply because the bank sanctioned it.</div>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200"><strong>3. Ignoring co-applicant score:</strong> Failing to check parents' CIBIL status before applying.</div>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200"><strong>4. Overlooking moratorium interest:</strong> Assuming no interest accumulates during college.</div>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200"><strong>5. Comparing rates only:</strong> Ignoring processing fees, legal charges, and mandatory insurance.</div>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200"><strong>6. Forgetting floating rate risks:</strong> Assuming starting EMI remains fixed forever.</div>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200"><strong>7. Draining emergency savings:</strong> Emptying family reserves to pay tuition fees instead of structuring a loan.</div>
        </div>
      </div>

      {/* 20 Pre-Signing Questions */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <h2 className="text-xl font-extrabold text-[#222325]">
          20 Questions to Ask Your Bank Before Signing
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#62646a]">
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">1. What exact interest rate will apply?</div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">2. Is the rate fixed or floating?</div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">3. What benchmark is used?</div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">4. Can the rate change during repayment?</div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">5. What happens to interest during study?</div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">6. What happens during the moratorium?</div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">7. Is unpaid interest capitalised?</div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">8. What is the starting balance when EMI begins?</div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">9. What is the processing fee?</div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">10. Are there other hidden charges?</div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">11. Is collateral required?</div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">12. Who has to be the co-applicant?</div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">13. What happens if I prepay?</div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">14. Can I make part-prepayments?</div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">15. Will prepayment reduce EMI or tenure?</div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">16. What documents are required?</div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">17. Which expenses are eligible?</div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">18. What if course duration changes?</div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">19. What if I discontinue the course?</div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">20. What if job placement is delayed?</div>
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
              q: 'What is an Education Loan EMI Calculator?',
              a: 'It is an online tool that estimates your monthly education-loan EMI based on the loan amount, interest rate and repayment tenure.',
            },
            {
              q: 'Is the EMI shown by the calculator guaranteed to be the same as my bank EMI?',
              a: 'No. The calculator provides a mathematical estimate. Your lender\'s actual calculation can differ because of the loan agreement, interest-rate changes, moratorium, rounding, payment dates, capitalisation and other terms.',
            },
            {
              q: 'What interest rate should I enter?',
              a: 'Enter the rate actually quoted for your particular education-loan scheme if you have it. If you are still comparing lenders, try several rates rather than relying on one assumed rate.',
            },
            {
              q: 'Can I use the calculator before applying for an education loan?',
              a: 'Yes. In fact, this is one of the most useful times to use it. You can compare different loan amounts, rates and tenures before making a borrowing decision.',
            },
            {
              q: 'Does CIBIL score matter for an education loan?',
              a: 'It can. The lender may consider the credit history of the student and/or relevant co-applicant depending on the loan structure.',
            },
            {
              q: 'I am a student and have never taken a loan. Do I have a CIBIL score?',
              a: 'You may have little or no established credit history. That is different from having a poor credit history. The lender may also consider the co-applicant\'s financial and credit profile.',
            },
            {
              q: 'Can my parent\'s CIBIL score affect my education loan?',
              a: 'It can be relevant when the parent is a co-applicant or otherwise part of the loan assessment. The exact effect depends on the lender and loan scheme.',
            },
            {
              q: 'Does a higher CIBIL score guarantee a lower education-loan interest rate?',
              a: 'No. The rate can depend on several factors, including the course, institution, loan amount, collateral, co-applicant, credit profile and lender\'s scheme.',
            },
            {
              q: 'Does interest continue during the study period?',
              a: 'It can, depending on the loan terms. Do not assume that a study period or moratorium means interest stops accumulating. Ask your lender exactly how interest is handled before regular EMI repayment begins.',
            },
            {
              q: 'What is a moratorium period?',
              a: 'It is a period during which regular repayment may be postponed, usually around the study period and an additional period specified by the lender. The exact conditions vary by loan.',
            },
            {
              q: 'Does a longer education-loan tenure reduce the EMI?',
              a: 'Generally, a longer repayment period reduces the scheduled EMI under a standard amortisation calculation. However, it can increase the total interest paid.',
            },
            {
              q: 'Should I choose the longest possible tenure?',
              a: 'Not automatically. Choose a tenure that gives you a manageable EMI while avoiding unnecessary extension of the debt.',
            },
            {
              q: 'Can I prepay my education loan?',
              a: 'Depending on the lender and loan agreement, part-prepayment or full prepayment may be possible. Check the specific terms and charges before making the payment.',
            },
            {
              q: 'Can I reduce my EMI after making a prepayment?',
              a: 'It may be possible depending on the lender\'s recalculation policy. Some lenders may allow the borrower to keep the EMI unchanged and reduce the tenure instead.',
            },
            {
              q: 'Is an education loan eligible for a tax deduction?',
              a: 'Interest paid on eligible education loans may qualify for a deduction under Section 80E, subject to applicable conditions and tax rules. Check the current rules before making a tax calculation.',
            },
            {
              q: 'Can an education loan cover studying abroad?',
              a: 'Many education-loan schemes are designed for overseas education, but the eligible expenses, loan limits, collateral requirements and interest rates vary by lender.',
            },
            {
              q: 'Why is an overseas education loan usually larger?',
              a: 'Overseas students may need to finance tuition, accommodation, living expenses, travel and other eligible costs, often resulting in a larger overall borrowing requirement.',
            },
            {
              q: 'Should I borrow the maximum amount offered by the bank?',
              a: 'Not necessarily. Borrow based on the amount you actually need and can reasonably repay. Loan eligibility does not automatically mean the full amount is financially comfortable.',
            },
            {
              q: 'Can education-loan interest rates change?',
              a: 'Yes, if your loan is floating-rate and its terms allow changes. For example, SBI states that its education-loan rates are linked to an external benchmark and are floating.',
            },
            {
              q: 'Why do education-loan rates differ between banks?',
              a: 'Banks may price loans differently based on their benchmark, scheme, course, institution, loan amount, security, applicant profile and other factors.',
            },
            {
              q: 'Should I compare banks only by interest rate?',
              a: 'No. Compare the complete loan: Interest rate, Processing fee, Collateral, Moratorium, Interest during study period, Repayment tenure, Prepayment conditions, Other charges, and Total estimated repayment.',
            },
            {
              q: 'What is more important: EMI or total interest?',
              a: 'Both matter. The EMI tells you about your monthly cash flow. Total interest tells you how much the borrowing may cost over time. Looking at both gives you a more complete picture.',
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

      {/* Pre-Signing Checklist */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <h2 className="text-xl font-extrabold text-[#222325]">
          A Practical Final Pre-Signing Checklist
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#62646a]">
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">&check; I know the exact loan amount.</div>
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">&check; I know the applicable interest rate.</div>
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">&check; I know whether the rate is fixed or floating.</div>
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">&check; I understand the lender's benchmark.</div>
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">&check; I know when repayment starts.</div>
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">&check; I understand the moratorium period terms.</div>
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">&check; I know whether interest accumulates during study.</div>
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">&check; I know whether unpaid interest is capitalised.</div>
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">&check; I checked the co-applicant's credit report.</div>
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">&check; I know the processing fee and other charges.</div>
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">&check; I know whether collateral is required.</div>
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">&check; I know the repayment tenure.</div>
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">&check; I understand prepayment conditions.</div>
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">&check; I have calculated the total interest.</div>
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">&check; I have calculated the total repayment.</div>
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">&check; I considered what happens if job placement is delayed.</div>
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">&check; I am not relying solely on hypothetical future salaries.</div>
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">&check; I kept an appropriate family emergency reserve.</div>
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 col-span-1 sm:col-span-2 font-bold text-[#222325] text-center bg-emerald-50 border-emerald-200">&check; I verified the latest official bank terms directly.</div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-slate-50 rounded-3xl border border-slate-200 p-6 sm:p-8 text-xs text-slate-500 space-y-2">
        <div className="font-bold text-[#222325]">Important Rate &amp; Calculator Disclaimer</div>
        <p>
          The Education Loan EMI Calculator provides mathematical estimates based on the information entered by the user and the selected calculation method. Actual education-loan costs may differ because of lender-specific terms, interest-rate changes, moratorium-period interest, capitalisation, payment dates, rounding, fees, prepayments, taxation and other applicable conditions.
        </p>
        <p>
          Interest-rate figures mentioned for banks are indicative reference figures and can change. The applicable rate for a borrower depends on the lender, loan scheme, course, institution, loan amount, security, credit profile and other eligibility conditions. Always verify the latest rate, fees and terms directly with the lender before making a borrowing decision.
        </p>
      </div>
    </div>
  );
};
