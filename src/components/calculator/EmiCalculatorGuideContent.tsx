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

export const EmiCalculatorGuideContent: React.FC = () => {
  return (
    <div className="space-y-12 font-sans text-[#404145] leading-relaxed">
      {/* 1. Article Header & Intro */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800">
          <CalcIcon className="w-3.5 h-3.5" />
          <span>Universal Loan Repayment &bull; EMI Guide</span>
        </div>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#222325] tracking-tight">
          EMI Calculator
        </h2>
        <p className="text-base sm:text-lg text-[#62646a] leading-relaxed">
          Planning to take a loan? The first question is usually simple: <strong>“How much will I have to pay every month?”</strong>
        </p>
        <p className="text-sm sm:text-base text-[#62646a] leading-relaxed">
          An <strong>EMI Calculator</strong> gives you a quick estimate before you take the loan. Enter the <strong>loan amount, interest rate and loan tenure</strong>, and you can see your estimated monthly EMI, total interest and total amount you may repay. You don't need to do the calculation yourself.
        </p>
      </div>

      {/* 2. EMI Calculator at a Glance */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-6">
        <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
          <div className="p-2 rounded-xl bg-emerald-50 text-[#1dbf73]">
            <FileText className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-extrabold text-[#222325]">EMI Calculator at a Glance</h3>
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
                <td className="p-3.5">The amount you want to borrow</td>
              </tr>
              <tr>
                <td className="p-3.5 font-semibold text-[#222325]">Interest Rate (% p.a.)</td>
                <td className="p-3.5">The annual interest rate on the loan</td>
              </tr>
              <tr>
                <td className="p-3.5 font-semibold text-[#222325]">Tenure (Years)</td>
                <td className="p-3.5">How many years you plan to take to repay the loan</td>
              </tr>
              <tr className="bg-emerald-50/40">
                <td className="p-3.5 font-semibold text-[#1dbf73]">Currency</td>
                <td className="p-3.5 font-medium text-[#222325]">₹ INR</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="text-xs sm:text-sm text-slate-600">
          The calculator is useful for home loans, personal loans, car loans, education loans and other loans where repayment is made through regular monthly instalments.
        </p>
      </div>

      {/* 3. What Is EMI? */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <h3 className="text-xl font-extrabold text-[#222325]">What Is EMI?</h3>
        <p className="text-sm sm:text-base text-[#62646a] leading-relaxed">
          <strong>EMI stands for Equated Monthly Instalment.</strong> It is the amount you pay to the lender every month towards your loan. Your EMI normally contains two parts:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <h4 className="font-bold text-sm text-[#222325]">Principal</h4>
            <p className="text-xs sm:text-sm text-slate-600">The original amount you borrowed.</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <h4 className="font-bold text-sm text-[#222325]">Interest</h4>
            <p className="text-xs sm:text-sm text-slate-600">The cost charged by the lender for giving you the loan.</p>
          </div>
        </div>
        <p className="text-sm sm:text-base text-[#62646a] leading-relaxed pt-2">
          At the beginning of a typical loan, a larger part of the EMI goes towards interest. As you continue making payments, more of the EMI goes towards reducing the principal. You don't have to work this out manually. The calculator does it for you.
        </p>
      </div>

      {/* 4. How Does the EMI Calculator Work? */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <h3 className="text-xl font-extrabold text-[#222325]">How Does the EMI Calculator Work?</h3>
        <p className="text-sm sm:text-base text-[#62646a] leading-relaxed">
          You only need three numbers:
        </p>
        <ol className="list-decimal list-inside text-sm sm:text-base text-slate-700 space-y-2 font-medium">
          <li><strong>Loan amount:</strong> Enter the amount you plan to borrow.</li>
          <li><strong>Interest rate:</strong> Enter the annual interest rate offered by the lender.</li>
          <li><strong>Loan tenure:</strong> Enter the number of years you expect to take to repay the loan.</li>
        </ol>
        <p className="text-sm sm:text-base text-[#62646a] leading-relaxed pt-2">
          The calculator uses these details to estimate your monthly EMI and overall repayment. That's it.
        </p>
      </div>

      {/* 5. Example & Comparison */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-6">
        <h3 className="text-xl font-extrabold text-[#222325]">Example: How Much EMI Will You Pay?</h3>
        <p className="text-sm sm:text-base text-[#62646a] leading-relaxed">
          Let's say you are planning to borrow <strong>₹10 lakh</strong>. You enter:
        </p>
        <ul className="list-disc list-inside text-sm sm:text-base text-slate-700 space-y-1">
          <li><strong>Loan Amount:</strong> ₹10,00,000</li>
          <li><strong>Interest Rate:</strong> 10% per year</li>
          <li><strong>Tenure:</strong> 5 years</li>
        </ul>
        <p className="text-sm sm:text-base text-[#62646a] leading-relaxed">
          The calculator will show your estimated monthly EMI, total interest and total repayment. Now change the tenure to 7 years. Your monthly EMI will generally come down because the repayment is spread over a longer period. But you will also pay interest for a longer time. This is why looking at the EMI alone isn't enough.
        </p>
      </div>

      {/* 6. A Lower EMI Doesn't Always Mean a Cheaper Loan */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <h3 className="text-xl font-extrabold text-[#222325]">A Lower EMI Doesn't Always Mean a Cheaper Loan</h3>
        <p className="text-sm sm:text-base text-[#62646a] leading-relaxed">
          This is one of the easiest mistakes to make when comparing loans. Imagine two loan options. One has a higher monthly EMI but a shorter tenure. The other has a lower EMI but a much longer tenure. The second option may look more comfortable every month. But because you are borrowing for longer, the total interest can be considerably higher. Before choosing a loan, look at <strong>both the monthly EMI and the total interest</strong>. That gives you a much clearer picture.
        </p>
      </div>

      {/* 7. Loan Amount & Interest Rate & Tenure Comparisons */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-6">
        <h3 className="text-xl font-extrabold text-[#222325]">Comparing Loan Amounts, Interest Rates and Tenures</h3>
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <h4 className="font-bold text-sm text-[#222325]">What Happens When You Increase the Loan Amount?</h4>
            <p className="text-xs sm:text-sm text-slate-600">
              A bigger loan usually means a bigger EMI, assuming interest rate and tenure stay the same. You can compare ₹5 lakh, ₹10 lakh, or ₹15 lakh to see how additional borrowing affects your monthly payment.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <h4 className="font-bold text-sm text-[#222325]">What Happens When the Interest Rate Changes?</h4>
            <p className="text-xs sm:text-sm text-slate-600">
              Interest rate has a direct effect on your EMI and total interest. Running the calculator at 9%, 10%, 11%, or 12% helps when comparing offers from different lenders.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <h4 className="font-bold text-sm text-[#222325]">What Happens When You Increase the Loan Tenure?</h4>
            <p className="text-xs sm:text-sm text-slate-600">
              A longer tenure generally reduces monthly EMI, but you remain in debt for longer and pay more total interest. Compare 3, 5, 7, and 10 years to find the right balance.
            </p>
          </div>
        </div>
      </div>

      {/* 8. EMI vs Total Interest */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <h3 className="text-xl font-extrabold text-[#222325]">EMI vs Total Interest: Look at Both</h3>
        <p className="text-sm sm:text-base text-[#62646a] leading-relaxed">
          Your EMI tells you what you may have to pay each month. Your total interest tells you what the loan may cost you beyond the principal. Both numbers matter. A loan with a manageable EMI can still become expensive if the tenure is very long.
        </p>
      </div>

      {/* 9. When Should You Use an EMI Calculator? */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <h3 className="text-xl font-extrabold text-[#222325]">When Should You Use an EMI Calculator?</h3>
        <p className="text-sm sm:text-base text-[#62646a] leading-relaxed">
          You don't have to wait until you are ready to apply for a loan. The calculator can be useful much earlier:
        </p>
        <ul className="list-disc list-inside text-sm sm:text-base text-slate-700 space-y-1">
          <li><strong>Before visiting a lender:</strong> Estimate what monthly payment you might be comfortable with.</li>
          <li><strong>While comparing loan offers:</strong> Enter the same loan amount and tenure with different interest rates.</li>
          <li><strong>Before buying a car or home:</strong> Calculate the EMI before deciding how much you can afford to borrow.</li>
          <li><strong>Before taking a personal loan:</strong> Check total interest instead of looking only at the monthly payment.</li>
        </ul>
      </div>

      {/* 10. Frequently Asked Questions */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-6">
        <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
          <div className="p-2 rounded-xl bg-emerald-50 text-[#1dbf73]">
            <HelpCircle className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-extrabold text-[#222325]">EMI Calculator FAQs</h3>
        </div>

        <div className="space-y-6">
          {[
            {
              q: 'What is an EMI Calculator?',
              a: 'An EMI Calculator is an online tool that estimates your monthly loan payment. You enter the loan amount, annual interest rate and repayment tenure, and the calculator works out the estimated EMI, total interest and total repayment.'
            },
            {
              q: 'What does EMI mean?',
              a: 'EMI means Equated Monthly Instalment. It is the regular amount you pay towards a loan each month, including both principal and interest components.'
            },
            {
              q: 'What information do I need to calculate EMI?',
              a: 'You need three main details: loan amount, interest rate and loan tenure (in ₹ INR currency).'
            },
            {
              q: 'Does a higher loan amount increase EMI?',
              a: 'Yes. If the interest rate and tenure remain the same, increasing the loan amount generally increases the monthly EMI and total interest.'
            },
            {
              q: 'Does a higher interest rate increase EMI?',
              a: 'Yes. If the loan amount and tenure stay the same, a higher interest rate generally results in a higher EMI and greater total interest.'
            },
            {
              q: 'Does a longer tenure reduce EMI?',
              a: 'Usually, yes. A longer tenure spreads repayment over more months, which generally lowers the monthly EMI. However, the total interest paid can increase.'
            },
            {
              q: 'Is a lower EMI always better?',
              a: 'No. A lower EMI can result from a longer loan tenure. While the monthly payment may be easier to manage, you may pay more interest over the full repayment period.'
            },
            {
              q: 'Can I use this calculator for different types of loans?',
              a: 'Yes. The basic EMI calculation can be used for many loans that use regular monthly repayments, including personal loans, car loans, home loans and education loans.'
            },
            {
              q: 'Does the calculator guarantee my actual EMI?',
              a: 'No. It provides an estimate. Your lender\'s final interest rate, repayment terms and other applicable conditions determine the actual EMI.'
            },
            {
              q: 'Should I choose a shorter or longer tenure?',
              a: 'Compare both monthly EMI and total interest. A shorter tenure usually means a higher EMI but reduces total interest. A longer tenure lowers monthly payments but increases overall interest cost.'
            }
          ].map((faq, i) => (
            <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <h4 className="font-bold text-sm text-[#222325]">{faq.q}</h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 11. Final Word */}
      <div className="bg-gradient-to-r from-emerald-900 to-[#013a12] rounded-3xl p-6 sm:p-10 text-white space-y-4">
        <h3 className="text-xl font-extrabold text-white">Final Word</h3>
        <p className="text-sm sm:text-base text-emerald-100 leading-relaxed">
          An EMI calculator is useful for one simple reason: it helps you see the loan before you commit to it. Change the loan amount, change the interest rate, try a different tenure, and see what happens to your monthly payment and total repayment. A few minutes of comparison can give you a much clearer idea of what the loan may actually cost before you sign up.
        </p>
      </div>
    </div>
  );
};
