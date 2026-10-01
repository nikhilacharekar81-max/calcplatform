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

export const LoanAffordabilityGuideContent: React.FC = () => {
  return (
    <div className="space-y-12 font-sans text-[#404145] leading-relaxed">
      {/* 1. Article Header & Intro */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800">
          <CalcIcon className="w-3.5 h-3.5" />
          <span>Monthly EMI Budget &bull; Affordability Guide</span>
        </div>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#222325] tracking-tight">
          Loan Affordability Calculator
        </h2>
        <p className="text-base sm:text-lg text-[#62646a] leading-relaxed">
          Before taking a loan, there is one number you should be comfortable with: <strong>your monthly EMI</strong>. Our <strong>Loan Affordability Calculator</strong> works backwards from that number. Enter the monthly EMI you can afford, the interest rate and the loan tenure, and the calculator estimates the <strong>loan amount that could fit within that EMI budget</strong>.
        </p>
        <p className="text-sm sm:text-base text-[#62646a] leading-relaxed">
          For example, if you decide that an EMI of ₹20,000 a month is manageable, you can use the calculator to see roughly how much you could borrow at different interest rates and repayment periods. That makes it easier to set a realistic loan budget before you start comparing lenders.
        </p>
      </div>

      {/* 2. Loan Affordability Calculator at a Glance */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-6">
        <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
          <div className="p-2 rounded-xl bg-emerald-50 text-[#1dbf73]">
            <FileText className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-extrabold text-[#222325]">Loan Affordability Calculator at a Glance</h3>
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
                <td className="p-3.5 font-semibold text-[#222325]">Target Monthly EMI Budget (₹)</td>
                <td className="p-3.5">The monthly amount you are comfortable spending on the loan</td>
              </tr>
              <tr>
                <td className="p-3.5 font-semibold text-[#222325]">Interest Rate (% p.a.)</td>
                <td className="p-3.5">The annual interest rate used for the calculation</td>
              </tr>
              <tr>
                <td className="p-3.5 font-semibold text-[#222325]">Tenure (Years)</td>
                <td className="p-3.5">How many years you plan to repay the loan</td>
              </tr>
              <tr>
                <td className="p-3.5 font-semibold text-[#222325]">Currency</td>
                <td className="p-3.5">Indian Rupees (₹)</td>
              </tr>
              <tr className="bg-emerald-50/40">
                <td className="p-3.5 font-semibold text-[#1dbf73]">Main Result</td>
                <td className="p-3.5 font-medium text-[#222325]">Estimated loan amount that fits your EMI budget</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center font-medium text-xs sm:text-sm text-slate-700">
          “If I can pay ₹X every month, approximately how much can I borrow?”
        </div>
      </div>

      {/* 3. What Is a Loan Affordability Calculator? */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <h3 className="text-xl font-extrabold text-[#222325]">What Is a Loan Affordability Calculator?</h3>
        <p className="text-sm sm:text-base text-[#62646a] leading-relaxed">
          A Loan Affordability Calculator estimates the loan amount you could potentially borrow based on a <strong>monthly EMI budget</strong>. Instead of starting with a loan amount and asking, “What will my EMI be?”, you start with the EMI you can afford and work backwards.
        </p>
        <p className="text-sm sm:text-base text-[#62646a] leading-relaxed">
          For example, you may know that you don't want your new loan EMI to be more than <strong>₹25,000 per month</strong>. Enter ₹25,000 as your target EMI, add the expected interest rate and choose the repayment period. The calculator estimates the loan amount that corresponds to those numbers.
        </p>
      </div>

      {/* 4. How Interest Rate & Tenure Change Affordability */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-6">
        <h3 className="text-xl font-extrabold text-[#222325]">How Interest Rate and Tenure Change Your Affordability</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <h4 className="font-bold text-base text-[#222325]">Interest Rate Impact</h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              At a lower interest rate, more of your EMI goes towards reducing the principal. At a higher interest rate, a larger portion goes towards interest, meaning a smaller loan amount is supported.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <h4 className="font-bold text-base text-[#222325]">Tenure Impact</h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              A longer tenure generally allows the same EMI to support a larger principal. However, you remain in debt longer and may pay more total interest.
            </p>
          </div>
        </div>
      </div>

      {/* 5. Loan Affordability vs Loan Eligibility */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <h3 className="text-xl font-extrabold text-[#222325]">Loan Affordability vs Loan Eligibility</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="p-3.5 font-bold text-[#222325]">Concept</th>
                <th className="p-3.5 font-bold text-[#222325]">Core Question</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600">
              <tr>
                <td className="p-3.5 font-semibold text-[#222325]">Loan Affordability</td>
                <td className="p-3.5">How much loan could fit within the EMI I am willing to pay?</td>
              </tr>
              <tr>
                <td className="p-3.5 font-semibold text-[#222325]">Loan Eligibility</td>
                <td className="p-3.5">Based on income and existing financial commitments, how much might a lender consider me eligible for?</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 6. Frequently Asked Questions */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-6">
        <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
          <div className="p-2 rounded-xl bg-emerald-50 text-[#1dbf73]">
            <HelpCircle className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-extrabold text-[#222325]">Loan Affordability FAQs</h3>
        </div>

        <div className="space-y-6">
          {[
            {
              q: 'What is a Loan Affordability Calculator?',
              a: 'A Loan Affordability Calculator estimates how much loan you could potentially borrow based on the monthly EMI you are comfortable paying, the interest rate and the repayment tenure.'
            },
            {
              q: 'How much loan can I afford with a ₹20,000 EMI?',
              a: 'There is no single answer. Estimated loan amount depends on interest rate and tenure. A ₹20,000 EMI supports different loan amounts at different rates and repayment periods.'
            },
            {
              q: 'Can I calculate loan affordability without entering my salary?',
              a: 'Yes. This calculator starts with your target monthly EMI budget rather than your salary. You choose the monthly payment you are comfortable with, and it estimates the corresponding loan amount.'
            },
            {
              q: 'Does a higher interest rate reduce loan affordability?',
              a: 'Generally yes. If your EMI budget and tenure stay the same, a higher interest rate usually means the same monthly payment supports a smaller loan amount.'
            },
            {
              q: 'Does a longer tenure increase loan affordability?',
              a: 'Generally yes. A longer tenure allows the same EMI budget to support a larger loan amount, though it can also mean paying interest for more months.'
            },
            {
              q: 'Should I choose a longer loan tenure?',
              a: 'Not automatically. A longer tenure may make monthly payments easier to manage, but you should also consider total interest and how long you want to remain in debt.'
            },
            {
              q: 'Is the calculator\'s result guaranteed by a bank?',
              a: 'No. It is an estimate based on numbers you enter. Lenders use additional criteria when deciding whether to approve a loan and how much to offer.'
            },
            {
              q: 'Should I borrow the maximum amount shown?',
              a: 'No. The calculated amount is a ceiling based on your EMI budget, rate and tenure. Borrow only what you actually need and what fits comfortably into your wider financial plans.'
            }
          ].map((faq, i) => (
            <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <h4 className="font-bold text-sm text-[#222325]">{faq.q}</h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 7. Final Takeaway */}
      <div className="bg-gradient-to-r from-emerald-900 to-[#013a12] rounded-3xl p-6 sm:p-10 text-white space-y-4">
        <h3 className="text-xl font-extrabold text-white">Final Takeaway</h3>
        <p className="text-sm sm:text-base text-emerald-100 leading-relaxed">
          A loan should fit your monthly budget. Start with the EMI you can genuinely handle, then use the interest rate and tenure to see what loan amount that payment could support. Choose the EMI first, then decide how much you should borrow.
        </p>
      </div>
    </div>
  );
};
