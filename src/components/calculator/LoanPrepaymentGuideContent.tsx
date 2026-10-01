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

export const LoanPrepaymentGuideContent: React.FC = () => {
  return (
    <div className="space-y-12 font-sans text-[#404145] leading-relaxed">
      {/* 1. Article Header & Intro */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800">
          <CalcIcon className="w-3.5 h-3.5" />
          <span>Principal Reduction & Tenure vs EMI &bull; Prepayment Guide</span>
        </div>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#222325] tracking-tight">
          Loan Prepayment Calculator
        </h2>
        <p className="text-base sm:text-lg text-[#62646a] leading-relaxed">
          Have some extra money available and thinking about paying part of your loan early? A <strong>Loan Prepayment Calculator</strong> helps you see what could happen if you make a lump-sum payment towards your outstanding loan. You can compare two common choices: <strong>reduce your loan tenure</strong> or <strong>reduce your monthly EMI</strong>.
        </p>
        <p className="text-sm sm:text-base text-[#62646a] leading-relaxed">
          Enter your loan amount, interest rate, original tenure and the amount you want to prepay. The calculator then shows how the prepayment can change your repayment.
        </p>
      </div>

      {/* 2. Loan Prepayment Calculator at a Glance */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-6">
        <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
          <div className="p-2 rounded-xl bg-emerald-50 text-[#1dbf73]">
            <FileText className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-extrabold text-[#222325]">Loan Prepayment Calculator at a Glance</h3>
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
                <td className="p-3.5 font-semibold text-[#222325]">Loan Amount (Principal)</td>
                <td className="p-3.5">The original loan amount used for the calculation</td>
              </tr>
              <tr>
                <td className="p-3.5 font-semibold text-[#222325]">Interest Rate (% p.a.)</td>
                <td className="p-3.5">Annual interest rate on the loan</td>
              </tr>
              <tr>
                <td className="p-3.5 font-semibold text-[#222325]">Tenure (Years)</td>
                <td className="p-3.5">Original repayment period</td>
              </tr>
              <tr>
                <td className="p-3.5 font-semibold text-[#222325]">Prepayment Amount (Lump Sum)</td>
                <td className="p-3.5">Extra amount you want to pay towards the loan</td>
              </tr>
              <tr className="bg-emerald-50/40">
                <td className="p-3.5 font-semibold text-[#1dbf73]">Prepayment Strategy</td>
                <td className="p-3.5 font-medium text-[#222325]">Choose whether to reduce the loan tenure or monthly EMI</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center font-medium text-xs sm:text-sm text-slate-700">
          Pay a lump sum &rarr; reduce outstanding principal &rarr; reduce future interest &rarr; see new repayment position.
        </div>
      </div>

      {/* 3. What Is Loan Prepayment? */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <h3 className="text-xl font-extrabold text-[#222325]">What Is Loan Prepayment?</h3>
        <p className="text-sm sm:text-base text-[#62646a] leading-relaxed">
          Loan prepayment means paying an additional amount towards your loan before the scheduled repayment period ends. For example, suppose you have a ₹10 lakh loan and later receive ₹1 lakh that you want to put towards the loan. Instead of waiting for your regular EMIs to reduce the balance, you make an additional ₹1 lakh payment.
        </p>
        <p className="text-sm sm:text-base text-[#62646a] leading-relaxed">
          That reduces the principal outstanding, which can reduce the interest you would otherwise pay in the future. Your exact savings depend on the loan amount, interest rate, remaining repayment period and the amount you prepay.
        </p>
      </div>

      {/* 4. Reduce Loan Tenure vs Reduce Monthly EMI */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-6">
        <h3 className="text-xl font-extrabold text-[#222325]">Reduce Loan Tenure vs Reduce Monthly EMI</h3>
        <p className="text-sm sm:text-base text-[#62646a] leading-relaxed">
          This is the most important choice in the calculator. After making a lump-sum prepayment, you can generally look at two approaches:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <h4 className="font-bold text-base text-[#222325]">1. Reduce Loan Tenure</h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Your EMI remains broadly similar, but you finish the loan sooner. Useful if your current EMI is comfortable and your priority is to become debt-free earlier.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <h4 className="font-bold text-base text-[#222325]">2. Reduce Monthly EMI</h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Instead of finishing the loan sooner, you reduce the monthly repayment amount while keeping the repayment period broadly similar. Useful if your monthly budget is tight.
            </p>
          </div>
        </div>
      </div>

      {/* 5. When Can Loan Prepayment Be Useful? */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <h3 className="text-xl font-extrabold text-[#222325]">When Can Loan Prepayment Be Useful?</h3>
        <p className="text-sm sm:text-base text-[#62646a] leading-relaxed">
          A lump-sum prepayment may be worth considering when you have received extra money and want to reduce your outstanding debt. Common examples include:
        </p>
        <ul className="list-disc list-inside text-sm sm:text-base text-slate-700 space-y-1">
          <li>Annual bonuses</li>
          <li>Business profits</li>
          <li>Sale proceeds from an asset</li>
          <li>A large one-time payment</li>
          <li>Savings accumulated specifically for debt reduction</li>
        </ul>
      </div>

      {/* 6. Frequently Asked Questions */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-6">
        <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
          <div className="p-2 rounded-xl bg-emerald-50 text-[#1dbf73]">
            <HelpCircle className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-extrabold text-[#222325]">Loan Prepayment FAQs</h3>
        </div>

        <div className="space-y-6">
          {[
            {
              q: 'What is a Loan Prepayment Calculator?',
              a: 'A Loan Prepayment Calculator estimates how a lump-sum payment towards a loan could affect your repayment. It helps you compare reducing loan tenure with reducing monthly EMI.'
            },
            {
              q: 'What is loan prepayment?',
              a: 'Loan prepayment means paying an additional amount towards your loan before the scheduled repayment period ends. This reduces outstanding principal and may reduce future interest.'
            },
            {
              q: 'What is a lump-sum prepayment?',
              a: 'A lump-sum prepayment is an extra one-time payment made towards your loan in addition to your regular EMI.'
            },
            {
              q: 'Does loan prepayment reduce interest?',
              a: 'It can reduce future interest because the outstanding principal becomes lower earlier. Actual savings depend on prepayment amount, interest rate, remaining tenure and terms.'
            },
            {
              q: 'Should I reduce my EMI or loan tenure after prepayment?',
              a: 'If your current EMI is comfortable and you want to finish the loan earlier, compare Reduce Loan Tenure. If monthly cash flow is your priority, compare Reduce Monthly EMI.'
            },
            {
              q: 'Does a lower EMI mean I save more money?',
              a: 'Not necessarily. A lower EMI can mean you continue repaying the loan for longer. Compare total interest and repayment period before deciding.'
            },
            {
              q: 'Does a larger prepayment always save more interest?',
              a: 'A larger principal reduction can create greater potential interest savings, but the exact result depends on loan terms and when prepayment is made.'
            },
            {
              q: 'Can I use the calculator for any type of loan?',
              a: 'The calculator can be used for loans following regular EMI-based repayment structures, though actual prepayment rules differ between loan products.'
            },
            {
              q: 'Does this calculator include lender prepayment charges?',
              a: 'The calculator estimates the effect of the prepayment amount you enter. Any lender-specific prepayment or foreclosure charges should be checked separately.'
            },
            {
              q: 'Is the calculated saving guaranteed?',
              a: 'No. It is an estimate based on inputs provided. Your lender\'s official outstanding balance and repayment schedule determine actual figures.'
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
          A loan prepayment can do more than simply reduce your outstanding balance. You have a choice: reduce loan tenure if you want to get out of debt sooner, or reduce monthly EMI if you want more breathing room in your monthly budget. Enter your loan details, add the lump-sum amount, and compare both strategies before making the payment.
        </p>
      </div>
    </div>
  );
};
