import React from 'react';
import {
  Calculator as CalcIcon,
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

export const LoanEligibilityGuideContent: React.FC = () => {
  return (
    <div className="space-y-12 font-sans text-[#404145] leading-relaxed">
      {/* 1. Article Header & Intro */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800">
          <CalcIcon className="w-3.5 h-3.5" />
          <span>Affordability & FOIR &bull; Loan Eligibility Guide</span>
        </div>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#222325] tracking-tight">
          Loan Eligibility Calculator
        </h2>
        <p className="text-base sm:text-lg text-[#62646a] leading-relaxed">
          Before applying for a loan, most people want to know one thing: <strong>“Based on my salary and current EMIs, how much loan can I afford?”</strong>
        </p>
        <p className="text-sm sm:text-base text-[#62646a] leading-relaxed">
          Our <strong>Loan Eligibility Calculator</strong> gives you an estimate using your monthly income, existing EMIs, FOIR ratio, interest rate and loan tenure. You can change the numbers and compare different situations before you approach a lender.
        </p>
        <p className="text-xs sm:text-sm text-slate-500 italic">
          Note: This is not a loan approval tool. The actual amount offered by a bank or NBFC can be different because lenders may check other details during their assessment.
        </p>
      </div>

      {/* 2. Loan Eligibility Calculator at a Glance */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-6">
        <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
          <div className="p-2 rounded-xl bg-emerald-50 text-[#1dbf73]">
            <FileText className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-extrabold text-[#222325]">Loan Eligibility Calculator at a Glance</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="p-3.5 font-bold text-[#222325]">What You Enter</th>
                <th className="p-3.5 font-bold text-[#222325]">What It Means</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600">
              <tr>
                <td className="p-3.5 font-semibold text-[#222325]">Net Monthly Income / Salary</td>
                <td className="p-3.5">Your monthly income after deductions</td>
              </tr>
              <tr>
                <td className="p-3.5 font-semibold text-[#222325]">Existing Monthly EMIs</td>
                <td className="p-3.5">EMIs you are already paying</td>
              </tr>
              <tr>
                <td className="p-3.5 font-semibold text-[#222325]">FOIR Ratio / Max EMI Capacity</td>
                <td className="p-3.5">The maximum portion of your income that can go towards EMIs</td>
              </tr>
              <tr>
                <td className="p-3.5 font-semibold text-[#222325]">Interest Rate</td>
                <td className="p-3.5">Annual interest rate used for the estimate</td>
              </tr>
              <tr>
                <td className="p-3.5 font-semibold text-[#222325]">Tenure</td>
                <td className="p-3.5">Number of years available to repay the new loan</td>
              </tr>
              <tr className="bg-emerald-50/40">
                <td className="p-3.5 font-semibold text-[#1dbf73]">Main Result</td>
                <td className="p-3.5 font-medium text-[#222325]">Estimated loan amount you may be able to afford</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center font-medium text-xs sm:text-sm text-slate-700">
          Income &rarr; EMI capacity &rarr; Available EMI &rarr; Estimated loan amount
        </div>
      </div>

      {/* 3. What Is a Loan Eligibility Calculator? */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <h3 className="text-xl font-extrabold text-[#222325]">What Is a Loan Eligibility Calculator?</h3>
        <p className="text-sm sm:text-base text-[#62646a] leading-relaxed">
          A <strong>Loan Eligibility Calculator</strong> is an online tool that estimates how much additional loan you may be able to handle based on your income and existing EMI commitments. You enter your monthly salary, current EMIs, an FOIR ratio, interest rate and loan tenure.
        </p>
        <p className="text-sm sm:text-base text-[#62646a] leading-relaxed">
          The calculator first estimates how much of your monthly income can be used for EMIs. It then considers the EMIs you already have and estimates the loan amount that could fit within the remaining repayment capacity. It gives you a starting point before you apply.
        </p>
      </div>

      {/* 4. How Does Loan Eligibility Work? & Example */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <h3 className="text-xl font-extrabold text-[#222325]">How Does Loan Eligibility Work? (Example: ₹60,000 Salary)</h3>
        <p className="text-sm sm:text-base text-[#62646a] leading-relaxed">
          Suppose your net monthly salary is <strong>₹60,000</strong> and you already pay <strong>₹10,000</strong> every month towards existing loans. Assuming a <strong>50% FOIR</strong>:
        </p>
        <ul className="list-disc list-inside text-sm sm:text-base text-slate-700 space-y-1">
          <li><strong>Maximum EMI capacity:</strong> ₹60,000 &times; 50% = ₹30,000</li>
          <li><strong>Existing EMIs:</strong> ₹10,000</li>
          <li><strong>Room for new EMI:</strong> ₹30,000 &minus; ₹10,000 = ₹20,000</li>
        </ul>
        <p className="text-sm sm:text-base text-[#62646a] leading-relaxed pt-2">
          The calculator then works backwards from that ₹20,000 new EMI using the interest rate and tenure to estimate the possible loan amount.
        </p>
      </div>

      {/* 5. What Is FOIR? */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-6">
        <h3 className="text-xl font-extrabold text-[#222325]">What Is FOIR?</h3>
        <p className="text-sm sm:text-base text-[#62646a] leading-relaxed">
          <strong>FOIR stands for Fixed Obligations to Income Ratio.</strong> It is used to estimate how much of your monthly income can go towards fixed financial commitments such as EMIs. For example, with a ₹60,000 monthly income:
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="p-3.5 font-bold text-[#222325]">FOIR</th>
                <th className="p-3.5 font-bold text-[#222325] text-right">Maximum EMI Capacity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600">
              <tr>
                <td className="p-3.5 font-semibold text-[#222325]">40%</td>
                <td className="p-3.5 text-right font-bold text-[#222325]">₹24,000</td>
              </tr>
              <tr>
                <td className="p-3.5 font-semibold text-[#222325]">50%</td>
                <td className="p-3.5 text-right font-bold text-[#222325]">₹30,000</td>
              </tr>
              <tr>
                <td className="p-3.5 font-semibold text-[#222325]">60%</td>
                <td className="p-3.5 text-right font-bold text-[#222325]">₹36,000</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 6. Why Existing EMIs & Income Matter */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-3">
          <h3 className="text-lg font-extrabold text-[#222325]">Why Existing EMIs Matter</h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Two people earning ₹60,000 can have very different eligibility if Person A pays ₹5,000 in existing EMIs while Person B pays ₹20,000. Existing commitments directly reduce available room for a new loan.
          </p>
        </div>
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-3">
          <h3 className="text-lg font-extrabold text-[#222325]">How Income & FOIR Affect Capacity</h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Higher income or a higher FOIR ratio increases total EMI capacity. However, don't pick an unrealistic FOIR just to inflate the eligibility estimate; actual lenders enforce strict underwriting standards.
          </p>
        </div>
      </div>

      {/* 7. Interest Rate & Tenure Impact */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <h3 className="text-xl font-extrabold text-[#222325]">How Interest Rate and Tenure Impact Loan Eligibility</h3>
        <p className="text-sm sm:text-base text-[#62646a] leading-relaxed">
          If your affordable new EMI is ₹20,000, a higher interest rate (e.g. 12% vs 9%) will support a smaller loan amount because more of the payment goes towards interest. Conversely, a longer tenure (e.g. 15 years vs 5 years) allows the same EMI to support a larger principal, though total interest paid will rise.
        </p>
      </div>

      {/* 8. Loan Eligibility vs EMI Calculator */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <h3 className="text-xl font-extrabold text-[#222325]">Loan Eligibility vs EMI Calculator</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="p-3.5 font-bold text-[#222325]">Calculator</th>
                <th className="p-3.5 font-bold text-[#222325]">Main Question</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600">
              <tr>
                <td className="p-3.5 font-semibold text-[#222325]">Loan Eligibility Calculator</td>
                <td className="p-3.5">How much loan may I be able to afford based on my income and existing EMIs?</td>
              </tr>
              <tr>
                <td className="p-3.5 font-semibold text-[#222325]">EMI Calculator</td>
                <td className="p-3.5">What could my monthly EMI be for a particular loan amount, rate and tenure?</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 9. Frequently Asked Questions */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-6">
        <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
          <div className="p-2 rounded-xl bg-emerald-50 text-[#1dbf73]">
            <HelpCircle className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-extrabold text-[#222325]">Loan Eligibility FAQs</h3>
        </div>

        <div className="space-y-6">
          {[
            {
              q: 'What is a Loan Eligibility Calculator?',
              a: 'A Loan Eligibility Calculator estimates how much additional loan you may be able to afford based on your net monthly income, existing EMIs, selected FOIR ratio, interest rate and loan tenure.'
            },
            {
              q: 'What inputs are required?',
              a: 'This calculator uses five inputs: Net Monthly Income, Existing Monthly EMIs, FOIR Ratio / Maximum EMI Capacity, Interest Rate and Tenure.'
            },
            {
              q: 'What is FOIR?',
              a: 'FOIR means Fixed Obligations to Income Ratio. It represents the percentage of your monthly income used to estimate your maximum EMI capacity.'
            },
            {
              q: 'Does existing EMI reduce loan eligibility?',
              a: 'Yes. Existing EMIs reduce the amount of your calculated EMI capacity available for a new loan.'
            },
            {
              q: 'Does a higher salary increase loan eligibility?',
              a: 'Generally yes, if other inputs remain unchanged. A higher income increases calculated EMI capacity and the estimated loan amount.'
            },
            {
              q: 'Does a higher FOIR increase eligibility?',
              a: 'Mathematically yes, by allowing a larger portion of income to be considered for EMI payments. However, avoid unrealistic ratios.'
            },
            {
              q: 'Does a higher interest rate reduce loan eligibility?',
              a: 'Generally yes. If affordable EMI and tenure remain unchanged, a higher interest rate supports a smaller loan amount.'
            },
            {
              q: 'Does a longer tenure increase loan eligibility?',
              a: 'Usually yes. A longer tenure allows the same affordable EMI to support a larger principal, though total interest paid increases.'
            },
            {
              q: 'Can this calculator guarantee loan approval?',
              a: 'No. It provides an estimate. Banks and NBFCs use additional underwriting criteria when making actual lending decisions.'
            },
            {
              q: 'Should I borrow the maximum amount shown?',
              a: 'Not necessarily. Consider your household expenses, savings and emergency needs before deciding how much to borrow.'
            }
          ].map((faq, i) => (
            <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <h4 className="font-bold text-sm text-[#222325]">{faq.q}</h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 10. Final Takeaway */}
      <div className="bg-gradient-to-r from-emerald-900 to-[#013a12] rounded-3xl p-6 sm:p-10 text-white space-y-4">
        <h3 className="text-xl font-extrabold text-white">Final Takeaway</h3>
        <p className="text-sm sm:text-base text-emerald-100 leading-relaxed">
          Loan eligibility isn't just about your salary. Existing EMIs matter, and the FOIR ratio determines how much of your income is available for EMI payments. Before applying for a loan, try different numbers, reduce loan amounts, change tenures, and see how results change. Use the Loan Eligibility Calculator as a planning tool, not as a promise of loan approval.
        </p>
      </div>
    </div>
  );
};
