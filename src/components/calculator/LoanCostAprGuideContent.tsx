import React, { useState } from 'react';
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
  Scale,
  Sparkles,
  FileText,
  ChevronDown,
  Check
} from 'lucide-react';

export const LoanCostAprGuideContent: React.FC = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "Is the lowest interest rate always the cheapest loan?",
      answer: "No. A lower interest rate can come with higher processing fees or other applicable charges. Compare the complete cost of the two offers."
    },
    {
      question: "What is the purpose of a Loan Cost & APR Comparison Calculator?",
      answer: "It helps you compare two loan offers using figures such as interest rate, EMI, tenure, fees, total interest, total repayment and APR where available."
    },
    {
      question: "What is APR in a loan?",
      answer: "APR means Annual Percentage Rate. It is intended to provide an annualized view of the cost of credit, including relevant charges covered by the applicable framework."
    },
    {
      question: "Why is my EMI lower when I choose a longer tenure?",
      answer: "A longer tenure spreads repayment over more months, which usually reduces the monthly EMI. However, you may pay more total interest over the life of the loan."
    },
    {
      question: "Can processing fees change which loan is cheaper?",
      answer: "Yes. A loan with a lower interest rate can still have a higher overall cost if its applicable fees are substantially higher."
    },
    {
      question: "Should I use the advertised interest rate or my actual offered rate?",
      answer: "Use your actual offered rate whenever possible. Advertisements may show starting rates that do not necessarily apply to every borrower."
    },
    {
      question: "What is the difference between total interest and total repayment?",
      answer: "Total interest is the interest paid over the scheduled loan period. Total repayment generally represents the principal plus the scheduled interest, before considering how separately disclosed charges are treated."
    },
    {
      question: "Does APR include every possible cost?",
      answer: "Not necessarily. What is included depends on the applicable regulatory framework and the loan product. Check the APR and charges shown in your actual loan documents or KFS."
    },
    {
      question: "Can a floating-rate loan become more expensive later?",
      answer: "Yes. A floating interest rate can change when the applicable benchmark or reset mechanism changes. Check the loan terms to understand how a rate change can affect your EMI or tenure."
    },
    {
      question: "What documents should I check before accepting a loan?",
      answer: "Check your actual loan offer, sanction terms and, where applicable, the Key Facts Statement. Pay particular attention to the interest rate, APR, fees, repayment schedule and prepayment terms."
    },
    {
      question: "Is this calculator a substitute for the lender's loan agreement?",
      answer: "No. It is a comparison and estimation tool. The lender's actual loan documents contain the terms that apply to your loan."
    }
  ];

  return (
    <div className="space-y-10 font-sans text-[#404145] leading-relaxed">
      
      {/* 1. Article Header & Intro */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800">
          <CalcIcon className="w-3.5 h-3.5 text-[#1dbf73]" />
          <span>True Cost of Borrowing &bull; Loan Guide</span>
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#222325] tracking-tight">
          Loan Cost & APR Comparison Calculator
        </h1>
        <p className="text-base sm:text-lg text-[#62646a] leading-relaxed">
          Choosing between two loans can be surprisingly difficult.
        </p>
        <p className="text-sm sm:text-base text-[#62646a] leading-relaxed">
          One lender may show a lower interest rate. Another may offer a lower EMI. One may charge a bigger processing fee, while another may have fewer upfront charges. Then there is APR.
        </p>
        <p className="text-sm sm:text-base text-[#62646a] leading-relaxed">
          For someone who just wants to borrow money, all these numbers can become confusing very quickly.
        </p>
        <p className="text-sm sm:text-base text-[#62646a] leading-relaxed">
          The <strong>Loan Cost & APR Comparison Calculator</strong> is meant to make that comparison easier. Enter the details of two loan offers and look at them side by side instead of trying to work everything out in your head.
        </p>
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-sm font-semibold text-emerald-900">
          The goal is simple: <strong>understand what each loan is likely to cost you before you make a decision.</strong>
        </div>
      </div>

      {/* 2. Why comparing interest rate alone can be misleading */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#222325]">
          Why comparing the interest rate alone can be misleading
        </h2>
        <p className="text-sm sm:text-base text-[#62646a]">
          Let's say you have two offers. One lender offers you a loan at <strong>9.50%</strong>. Another offers <strong>9.75%</strong>.
        </p>
        <p className="text-sm sm:text-base text-[#62646a]">
          The first one looks cheaper. But now suppose the 9.50% loan has a ₹25,000 processing fee and the 9.75% loan has a ₹5,000 fee. The difference is ₹20,000.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-700">The wrong question</span>
            <p className="text-sm font-bold text-rose-950">“Which lender has the lower rate?”</p>
          </div>
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">The right question</span>
            <p className="text-sm font-bold text-emerald-950">“After taking the interest and applicable charges together, which offer costs less for the loan I actually need?”</p>
          </div>
        </div>
        <p className="text-sm sm:text-base text-[#62646a]">
          That is the comparison this calculator is designed to help you make.
        </p>
      </div>

      {/* 3. What can you compare with this calculator? */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#222325]">
          What can you compare with this calculator?
        </h2>
        <p className="text-sm sm:text-base text-[#62646a]">
          You can compare the important numbers from two loan offers, such as:
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
          {[
            "Loan amount",
            "Interest rate",
            "Loan tenure",
            "EMI",
            "Processing fee",
            "Other applicable charges",
            "Total interest",
            "Total repayment",
            "APR, where available",
            "Net amount received"
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-bold text-[#222325]">
              <CheckCircle2 className="w-4 h-4 text-[#1dbf73] shrink-0" />
              <span>{item}</span>
            </div>
          ))}
        </div>
        <p className="text-xs sm:text-sm text-slate-500 pt-2">
          You don't necessarily need every number to start a comparison. But the more accurate the figures you enter, the more useful the result will be.
        </p>
      </div>

      {/* 4. What is APR? */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#222325]">
          What is APR?
        </h2>
        <p className="text-sm sm:text-base text-[#62646a]">
          APR means <strong>Annual Percentage Rate</strong>. You can think of it as a broader way of looking at the cost of borrowing than the interest rate alone.
        </p>
        <p className="text-sm sm:text-base text-[#62646a]">
          Why does that matter? Because a loan can have a competitive interest rate but also come with fees and other applicable costs.
        </p>
        
        <div className="overflow-x-auto my-4">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200">
                <th className="p-3.5 font-bold text-[#222325]">Parameter</th>
                <th className="p-3.5 font-bold text-[#222325] text-right">Loan A</th>
                <th className="p-3.5 font-bold text-[#222325] text-right">Loan B</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr>
                <td className="p-3.5 font-semibold text-[#222325]">Interest rate</td>
                <td className="p-3.5 text-right font-medium">10.00%</td>
                <td className="p-3.5 text-right font-medium">10.25%</td>
              </tr>
              <tr>
                <td className="p-3.5 font-semibold text-[#222325]">Processing fee</td>
                <td className="p-3.5 text-right font-medium text-amber-700 font-bold">₹20,000</td>
                <td className="p-3.5 text-right font-medium text-emerald-700 font-bold">₹5,000</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="text-sm sm:text-base text-[#62646a]">
          If you only look at the interest rate, Loan A appears cheaper. But the ₹15,000 difference in processing fees changes the picture.
        </p>
        <p className="text-sm sm:text-base text-[#62646a]">
          APR can be useful in situations like this because it is intended to provide an annualized view of the cost of credit, taking relevant charges into account. For applicable loans, APR is disclosed in the Key Facts Statement under the relevant RBI framework.
        </p>
      </div>

      {/* 5. Why is APR useful when comparing loans? */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#222325]">
          Why is APR useful when comparing loans?
        </h2>
        <p className="text-sm sm:text-base text-[#62646a]">
          Imagine you are shopping for a phone. One phone has a lower sticker price, but you later discover that it needs an expensive accessory before you can actually use it. The second phone costs slightly more but includes everything you need. You wouldn't normally decide just by looking at the first price.
        </p>
        <p className="text-sm sm:text-base text-[#62646a]">
          Loan comparison works in a similar way. The interest rate is important, but it doesn't always tell you the complete cost. APR can give you another useful number to look at when the loans have different fees or charges.
        </p>
        <p className="text-xs sm:text-sm text-slate-500 italic">
          Still, don't rely on APR alone. Read the actual loan offer and KFS and check what is included.
        </p>
      </div>

      {/* 6. Your EMI is important, but it isn't the whole story */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#222325]">
          Your EMI is important, but it isn't the whole story
        </h2>
        <p className="text-sm sm:text-base text-[#62646a]">
          Most borrowers naturally focus on EMI. That's fair. If you have a monthly income of ₹60,000, for example, you need to know whether a ₹25,000 EMI fits comfortably into your budget.
        </p>
        <p className="text-sm sm:text-base text-[#62646a]">
          But there's another question: <strong>How long will you be paying that EMI?</strong>
        </p>
        <p className="text-sm sm:text-base text-[#62646a]">
          A ₹20,000 EMI for five years is very different from a ₹20,000 EMI for ten years. The longer loan may feel easier because of the lower monthly burden, but you may pay interest for many more months.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-xs font-bold text-slate-500">Monthly Budget</span>
            <p className="text-sm font-extrabold text-[#222325]">What will I pay every month?</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-xs font-bold text-slate-500">Long-term Outflow</span>
            <p className="text-sm font-extrabold text-[#222325]">What will I pay altogether?</p>
          </div>
        </div>
      </div>

      {/* 7. A lower EMI can sometimes mean a more expensive loan */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#222325]">
          A lower EMI can sometimes mean a more expensive loan
        </h2>
        <p className="text-sm sm:text-base text-[#62646a]">
          Suppose two lenders offer you a ₹10 lakh loan.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <h3 className="font-extrabold text-base text-[#222325]">Loan A</h3>
            <p className="text-sm text-slate-600">EMI: <strong className="text-[#222325]">₹21,000</strong></p>
            <p className="text-sm text-slate-600">Tenure: <strong className="text-[#222325]">5 years</strong></p>
          </div>
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <h3 className="font-extrabold text-base text-[#222325]">Loan B</h3>
            <p className="text-sm text-slate-600">EMI: <strong className="text-[#222325]">₹16,000</strong></p>
            <p className="text-sm text-slate-600">Tenure: <strong className="text-[#222325]">8 years</strong></p>
          </div>
        </div>
        <p className="text-sm sm:text-base text-[#62646a]">
          At first, Loan B looks much easier. You have ₹5,000 more available every month. But Loan B keeps the debt around for another three years. That extra time can mean substantially more interest.
        </p>
        <p className="text-sm sm:text-base text-[#62646a]">
          This doesn't mean the five-year loan is automatically the right choice. Maybe ₹21,000 is too much for your monthly budget. The important thing is to understand the trade-off instead of assuming that the smaller EMI is the cheaper option.
        </p>
      </div>

      {/* 8. What does total interest tell you? */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#222325]">
          What does total interest tell you?
        </h2>
        <p className="text-sm sm:text-base text-[#62646a]">
          Total interest answers a very simple question: <strong>“How much am I paying the lender in interest over the scheduled loan period?”</strong>
        </p>
        <p className="text-sm sm:text-base text-[#62646a]">
          Suppose you borrow ₹10 lakh. If all your scheduled EMI payments add up to ₹12.60 lakh, then approximately ₹2.60 lakh represents interest.
        </p>
        <p className="text-sm sm:text-base text-[#62646a]">
          Now suppose another offer requires total scheduled payments of ₹12.30 lakh. You can immediately see a ₹30,000 difference. That is often easier to understand than looking at two percentages and trying to guess which one matters more.
        </p>
      </div>

      {/* 9. What about processing fees? */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#222325]">
          What about processing fees?
        </h2>
        <p className="text-sm sm:text-base text-[#62646a]">
          Processing fees are easy to overlook because they may be shown separately from the interest rate. Let's say:
        </p>
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1 text-sm font-semibold text-[#222325]">
          <p>Loan amount: ₹5 lakh</p>
          <p>Loan A processing fee: ₹5,000</p>
          <p>Loan B processing fee: ₹20,000</p>
        </div>
        <p className="text-sm sm:text-base text-[#62646a]">
          Loan B starts ₹15,000 behind on upfront cost. But you shouldn't immediately conclude that Loan A is cheaper. Maybe Loan B has a significantly lower interest rate.
        </p>
        <p className="text-sm sm:text-base text-[#62646a]">
          The right comparison is to look at the <strong>fee difference and interest difference together</strong>. That's where a calculator is more useful than a quick glance at a lender's advertisement.
        </p>
      </div>

      {/* 10. What is net amount received? */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#222325]">
          What is net amount received?
        </h2>
        <p className="text-sm sm:text-base text-[#62646a]">
          This is another number borrowers should pay attention to. Suppose your loan is sanctioned for <strong>₹5,00,000</strong> and the lender deducts <strong>₹10,000</strong> in applicable upfront charges. You may actually receive <strong>₹4,90,000</strong> in your account.
        </p>
        <p className="text-sm sm:text-base text-[#62646a]">
          So there is a difference between <strong>Loan amount</strong> and <strong>Money actually received.</strong>
        </p>
        <p className="text-sm sm:text-base text-[#62646a]">
          If two lenders both advertise a ₹5 lakh loan but one deducts considerably more in upfront charges, the comparison is not as simple as it first appears.
        </p>
      </div>

      {/* 11. What if two loans have different fees? */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#222325]">
          What if the two loans have different fees?
        </h2>
        <p className="text-sm sm:text-base text-[#62646a]">
          This is one of the situations where the calculator becomes particularly useful. Consider:
        </p>
        <div className="overflow-x-auto my-4">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200">
                <th className="p-3.5 font-bold text-[#222325]">Parameter</th>
                <th className="p-3.5 font-bold text-[#222325] text-right">Offer A</th>
                <th className="p-3.5 font-bold text-[#222325] text-right">Offer B</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr>
                <td className="p-3.5 font-semibold text-[#222325]">Loan amount</td>
                <td className="p-3.5 text-right font-medium">₹10 lakh</td>
                <td className="p-3.5 text-right font-medium">₹10 lakh</td>
              </tr>
              <tr>
                <td className="p-3.5 font-semibold text-[#222325]">Interest rate</td>
                <td className="p-3.5 text-right font-medium text-emerald-700 font-bold">9.50%</td>
                <td className="p-3.5 text-right font-medium">9.75%</td>
              </tr>
              <tr>
                <td className="p-3.5 font-semibold text-[#222325]">Processing fee</td>
                <td className="p-3.5 text-right font-medium text-amber-700 font-bold">₹25,000</td>
                <td className="p-3.5 text-right font-medium text-emerald-700 font-bold">₹5,000</td>
              </tr>
              <tr>
                <td className="p-3.5 font-semibold text-[#222325]">Tenure</td>
                <td className="p-3.5 text-right font-medium">5 years</td>
                <td className="p-3.5 text-right font-medium">5 years</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-sm sm:text-base text-[#62646a]">
          Offer A has the lower interest rate. Offer B has the lower processing fee. Now you need to find out whether the interest saving from Offer A is enough to make up for its additional ₹20,000 fee. That is a much better question than simply asking which percentage is smaller.
        </p>
      </div>

      {/* 12. What happens when loan tenure changes? */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#222325]">
          What happens when the loan tenure changes?
        </h2>
        <p className="text-sm sm:text-base text-[#62646a]">
          Tenure has a big effect on the numbers. A longer tenure normally brings down the EMI because you spread repayment over more months. But interest has more time to accumulate.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
            <h3 className="font-bold text-sm text-[#222325]">Shorter Tenure</h3>
            <ul className="text-xs sm:text-sm text-slate-600 space-y-1 list-disc pl-4">
              <li>Higher EMI</li>
              <li>Loan gets paid off sooner</li>
              <li>Usually less total interest</li>
            </ul>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
            <h3 className="font-bold text-sm text-[#222325]">Longer Tenure</h3>
            <ul className="text-xs sm:text-sm text-slate-600 space-y-1 list-disc pl-4">
              <li>Lower EMI</li>
              <li>More months of repayment</li>
              <li>Usually more total interest</li>
            </ul>
          </div>
        </div>
        <p className="text-sm sm:text-base text-[#62646a]">
          The best tenure depends on your own finances. If the shorter tenure makes your monthly budget uncomfortable, choosing it simply because it has lower total interest may not be practical. On the other hand, taking a very long tenure only to get a low EMI can make the loan considerably more expensive.
        </p>
      </div>

      {/* 13. What if one loan has a floating interest rate? */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#222325]">
          What if one loan has a floating interest rate?
        </h2>
        <p className="text-sm sm:text-base text-[#62646a]">
          This deserves extra attention. A floating-rate loan can change when the applicable benchmark or reset mechanism changes. So the rate you see today may not necessarily remain unchanged throughout the loan.
        </p>
        <p className="text-sm sm:text-base text-[#62646a]">
          When comparing a floating-rate offer, check:
        </p>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-slate-700 font-semibold">
          {[
            "Whether the rate is fixed or floating",
            "Which benchmark applies",
            "The lender's spread",
            "How often the rate can reset",
            "What happens to the EMI if the rate changes",
            "What happens to the tenure if the rate changes"
          ].map((item, idx) => (
            <li key={idx} className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <Check className="w-4 h-4 text-[#1dbf73]" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <p className="text-xs sm:text-sm text-slate-500 pt-2">
          For applicable RBI-regulated floating-rate loans, lenders have requirements around communicating the effect of interest-rate resets to borrowers. A calculator can compare the numbers you enter today, but nobody can use it to know exactly what a future floating interest rate will be.
        </p>
      </div>

      {/* 14. Can a loan with a higher interest rate cost less? */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#222325]">
          Can a loan with a higher interest rate cost less?
        </h2>
        <p className="text-sm sm:text-base text-[#62646a]">
          It can, depending on the rest of the offer. For example:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1 text-sm font-semibold text-[#222325]">
            <p>Loan A</p>
            <p className="text-xs text-slate-600">10.00% interest</p>
            <p className="text-xs text-slate-600">₹30,000 applicable fees</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1 text-sm font-semibold text-[#222325]">
            <p>Loan B</p>
            <p className="text-xs text-slate-600">10.25% interest</p>
            <p className="text-xs text-slate-600">₹5,000 applicable fees</p>
          </div>
        </div>
        <p className="text-sm sm:text-base text-[#62646a]">
          Loan B starts with ₹25,000 less in fees. Whether that makes it cheaper overall depends on the loan amount, tenure and interest difference.
        </p>
        <p className="text-sm sm:text-base text-[#62646a]">
          This is why simple rules such as “always choose the lowest rate” don't work for every loan comparison. The actual numbers need to be looked at together.
        </p>
      </div>

      {/* 15. What if both loans have the same interest rate? */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#222325]">
          What if both loans have the same interest rate?
        </h2>
        <p className="text-sm sm:text-base text-[#62646a]">
          You might think the comparison is finished. Not necessarily. Suppose both lenders offer <strong>10% interest</strong>, but:
        </p>
        <ul className="list-disc pl-5 text-sm text-[#62646a] space-y-1">
          <li>Lender A charges ₹5,000 processing fee</li>
          <li>Lender B charges ₹20,000 processing fee</li>
        </ul>
        <p className="text-sm sm:text-base text-[#62646a]">
          The interest cost may be similar, but the overall cost is not identical. There may also be differences in other applicable charges or loan terms. So even when the interest rate is exactly the same, it is worth comparing the complete offer.
        </p>
      </div>

      {/* 16. What if the loan amounts are different? */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#222325]">
          What if the loan amounts are different?
        </h2>
        <p className="text-sm sm:text-base text-[#62646a]">
          Be careful here. Suppose Loan A is ₹5 lakh and Loan B is ₹10 lakh. Loan B will naturally produce a larger total interest figure because you are borrowing twice as much.
        </p>
        <p className="text-sm sm:text-base text-[#62646a]">
          That doesn't automatically mean it is a more expensive loan in relative terms. If you're comparing different loan amounts, first decide what you are trying to understand:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm font-semibold text-[#222325]">
          {[
            "Which loan gives me the amount I need?",
            "Which has the lower EMI?",
            "Which has the lower borrowing cost?",
            "Which has the lower APR?",
            "Which offer gives me better overall terms?"
          ].map((q, i) => (
            <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-[#1dbf73] shrink-0" />
              <span>{q}</span>
            </div>
          ))}
        </div>
        <p className="text-xs sm:text-sm text-slate-500 pt-2">
          The calculator gives you the numbers. You still need to look at them in the context of what you are trying to borrow.
        </p>
      </div>

      {/* 17. What if the tenures are different? */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#222325]">
          What if the tenures are different?
        </h2>
        <p className="text-sm sm:text-base text-[#62646a]">
          The same caution applies. A five-year loan and a ten-year loan aren't directly comparable by total interest alone. The ten-year loan has more time to accumulate interest.
        </p>
        <p className="text-sm sm:text-base text-[#62646a]">
          Instead, look at several figures together: <strong>Interest rate, EMI, Tenure, Total interest, Total repayment, Fees, and APR, where available.</strong>
        </p>
      </div>

      {/* 18. Where should you get the numbers for the calculator? */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#222325]">
          Where should you get the numbers for the calculator?
        </h2>
        <p className="text-sm sm:text-base text-[#62646a]">
          Use the figures from your <strong>actual loan offer</strong>, sanction letter or applicable Key Facts Statement whenever possible.
        </p>
        <p className="text-sm sm:text-base text-[#62646a]">
          This is better than copying a rate from a bank advertisement. Why? Because advertisements may show a starting rate. Your actual rate can be different depending on the lender's assessment and the particular loan being offered to you.
        </p>
      </div>

      {/* 19. What should you check in the KFS? */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#222325]">
          What should you check in the KFS?
        </h2>
        <p className="text-sm sm:text-base text-[#62646a]">
          If your loan is covered by the applicable RBI Key Facts Statement requirements, the KFS is worth reading carefully. Look for:
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs sm:text-sm font-semibold text-[#222325]">
          {[
            "Loan amount",
            "Interest rate",
            "Tenure",
            "EMI or repayment schedule",
            "APR",
            "Processing fee",
            "Other applicable charges",
            "Penal charges",
            "Prepayment information",
            "Interest-rate changes"
          ].map((item, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#1dbf73] shrink-0" />
              <span>{item}</span>
            </div>
          ))}
        </div>
        <p className="text-xs sm:text-sm text-slate-500 pt-2">
          Don't rely only on what someone tells you verbally. If a fee is waived or a special rate is promised, ask for the offer to be reflected in the relevant documents.
        </p>
      </div>

      {/* 20. How to compare two loan offers in a few minutes */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#222325]">
          How to compare two loan offers in a few minutes
        </h2>
        <p className="text-sm sm:text-base text-[#62646a]">
          You don't need a spreadsheet with dozens of columns. Start with these numbers for each loan:
        </p>
        <div className="overflow-x-auto my-4">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200">
                <th className="p-3.5 font-bold text-[#222325]">What to check</th>
                <th className="p-3.5 font-bold text-[#222325] text-right">Loan A</th>
                <th className="p-3.5 font-bold text-[#222325] text-right">Loan B</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {[
                "Loan amount",
                "Interest rate",
                "Tenure",
                "EMI",
                "Processing fee",
                "Other applicable charges",
                "Total interest",
                "Total repayment",
                "APR",
                "Net amount received"
              ].map((row, idx) => (
                <tr key={idx}>
                  <td className="p-3.5 font-semibold text-[#222325]">{row}</td>
                  <td className="p-3.5 text-right font-mono text-slate-400">&mdash;</td>
                  <td className="p-3.5 text-right font-mono text-slate-400">&mdash;</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm sm:text-base text-[#62646a]">
          Once these are filled in, the difference becomes much easier to see. You may find that one lender has a better rate but higher upfront costs, or another has a higher rate but lower overall repayment.
        </p>
      </div>

      {/* 21. What should you look at first in the result? */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#222325]">
          What should you look at first in the result?
        </h2>
        <div className="flex flex-wrap items-center gap-2 text-sm font-bold pt-2">
          <span className="px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-900 border border-emerald-300">1. Total repayment</span>
          <ArrowRight className="w-4 h-4 text-slate-400" />
          <span className="px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-900 border border-emerald-300">2. Total interest</span>
          <ArrowRight className="w-4 h-4 text-slate-400" />
          <span className="px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-900 border border-emerald-300">3. Fees & charges</span>
          <ArrowRight className="w-4 h-4 text-slate-400" />
          <span className="px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-900 border border-emerald-300">4. APR</span>
          <ArrowRight className="w-4 h-4 text-slate-400" />
          <span className="px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-900 border border-emerald-300">5. Monthly EMI</span>
        </div>
        <p className="text-sm sm:text-base text-[#62646a] pt-2">
          Why this order? Because the cheapest loan on paper isn't necessarily useful if you cannot comfortably afford the monthly repayment.
        </p>
        <p className="text-sm sm:text-base text-[#62646a]">
          Your decision has two sides: <strong>What will this loan cost me overall?</strong> and <strong>Can I comfortably repay it?</strong> You need both answers.
        </p>
      </div>

      {/* 22. A quick example */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#222325]">
          A quick example
        </h2>
        <p className="text-sm sm:text-base text-[#62646a]">
          Suppose you need ₹10 lakh and have two offers.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1 text-sm text-[#222325]">
            <h3 className="font-extrabold text-base">Offer A</h3>
            <p>9.50% interest</p>
            <p>5-year tenure</p>
            <p className="font-bold text-amber-700">₹20,000 processing fee</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1 text-sm text-[#222325]">
            <h3 className="font-extrabold text-base">Offer B</h3>
            <p>9.75% interest</p>
            <p>5-year tenure</p>
            <p className="font-bold text-emerald-700">₹5,000 processing fee</p>
          </div>
        </div>
        <p className="text-sm sm:text-base text-[#62646a]">
          Offer A saves money on interest. Offer B saves ₹15,000 on the upfront fee. The calculator shows you whether the lower rate actually compensates for the higher fee.
        </p>
      </div>

      {/* 23. When is this calculator useful? */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#222325]">
          When is this calculator useful?
        </h2>
        <p className="text-sm sm:text-base text-[#62646a]">
          You can use it whenever you're deciding between two loan offers. For example:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm font-semibold text-[#222325]">
          {[
            "Personal loan offers from different lenders",
            "Home-loan offers",
            "Business loans",
            "Vehicle loans",
            "Loan balance-transfer offers",
            "Refinancing options",
            "Different tenure choices",
            "Different interest-rate offers from the same lender"
          ].map((item, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#1dbf73] shrink-0" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 24. A few things this calculator cannot tell you */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-3">
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#222325]">
          A few things this calculator cannot tell you
        </h2>
        <ul className="list-disc pl-5 text-xs sm:text-sm text-slate-600 space-y-1.5">
          <li>A calculator can compare the numbers you provide.</li>
          <li>It cannot tell you whether a lender will approve your application.</li>
          <li>It cannot predict future floating interest rates.</li>
          <li>It cannot know whether a loan is suitable for your personal financial situation.</li>
          <li>It also cannot replace the actual loan agreement or KFS.</li>
        </ul>
        <p className="text-xs sm:text-sm text-slate-500 pt-1">
          Those documents contain the terms that apply to your loan. So use the calculator as a <strong>comparison tool</strong>, not as a replacement for reading the offer.
        </p>
      </div>

      {/* 25. Don't let one number make the decision */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#222325]">
          Don't let one number make the decision
        </h2>
        <p className="text-sm sm:text-base text-[#62646a]">
          A loan can look attractive because of a low rate. Another can look attractive because of a low EMI. A third might have very low upfront charges. None of those numbers should be viewed in isolation.
        </p>
        <div className="p-4 rounded-2xl bg-slate-900 text-white text-center font-extrabold text-sm sm:text-base">
          Rate &rarr; EMI &rarr; Tenure &rarr; Fees &rarr; Total Interest &rarr; Total Repayment &rarr; APR
        </div>
        <p className="text-sm sm:text-base text-[#62646a]">
          Once you put the numbers together, loan comparisons become much less confusing.
        </p>
      </div>

      {/* 26. Final Word */}
      <div className="bg-gradient-to-br from-[#0a2e15] to-[#013a12] text-white rounded-3xl p-6 sm:p-10 shadow-lg space-y-4">
        <h2 className="text-xl sm:text-2xl font-black text-white">
          Final Word
        </h2>
        <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed">
          You don't need to understand every technical detail of lending to compare two loan offers. Start with the numbers that affect you directly:
        </p>
        <p className="text-sm sm:text-base text-emerald-200 font-semibold">
          How much are you borrowing? How much will actually reach your account? How much will you pay each month? How many months will you keep paying? How much interest will you pay? What fees will you pay? And, where available, what APR is shown in the loan documents?
        </p>
        <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed">
          Enter those figures into the <strong>Loan Cost & APR Comparison Calculator</strong> and compare the two offers side by side.
        </p>
        <p className="text-xs sm:text-sm text-emerald-300 font-medium">
          Sometimes the difference between two loans is obvious. Sometimes it isn't. That's exactly when doing the calculation is worth your time.
        </p>
      </div>

      {/* 27. Frequently Asked Questions Accordion */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-6">
        <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
          <div className="p-2 rounded-xl bg-emerald-50 text-[#1dbf73]">
            <HelpCircle className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-extrabold text-[#222325]">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="border border-slate-200 rounded-2xl overflow-hidden transition-all bg-white"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full text-left p-4 sm:p-5 flex justify-between items-center gap-4 hover:bg-slate-50 transition-colors"
                >
                  <span className="font-extrabold text-sm sm:text-base text-[#222325]">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 transition-transform shrink-0 ${
                      isOpen ? 'rotate-180 text-[#1dbf73]' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 pb-5 sm:px-5 pt-1 text-sm text-[#62646a] border-t border-slate-100 leading-relaxed bg-slate-50/50">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
