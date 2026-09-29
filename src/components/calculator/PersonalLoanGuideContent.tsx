import React from 'react';
import { BookOpen, HelpCircle, Calculator as CalcIcon, ShieldAlert, CheckCircle2 } from 'lucide-react';

export const PersonalLoanGuideContent: React.FC = () => {
  return (
    <div className="space-y-12 font-sans text-[#404145] leading-relaxed">
      {/* Overview & Intro */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <h1 className="text-2xl sm:text-3xl font-black text-[#222325]">
          Personal Loan EMI Calculator: Calculate Your Monthly EMI, Interest & Total Repayment
        </h1>
        <p className="text-sm sm:text-base text-[#62646a] leading-relaxed">
          Taking a personal loan can give you access to money when you need it, but the monthly EMI becomes part of your regular expenses until the loan is repaid.
        </p>
        <p className="text-sm sm:text-base text-[#62646a] leading-relaxed">
          Before applying, it helps to know roughly how much you will have to pay each month and how much interest the loan may cost you over the full tenure.
        </p>
        <p className="text-sm sm:text-base text-[#62646a] leading-relaxed">
          Our Personal Loan EMI Calculator lets you enter your <strong>loan amount, interest rate and loan tenure</strong> to estimate your monthly EMI, total interest and total repayment amount.
        </p>
        <p className="text-sm sm:text-base text-[#62646a] leading-relaxed">
          The calculation is based on the <strong>reducing-balance method</strong> selected for this calculator. The result is an estimate and does not guarantee the EMI or loan terms that a particular lender will offer.
        </p>
      </div>

      {/* How to Use */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <h2 className="text-xl font-extrabold text-[#222325]">
          How to Use the Personal Loan EMI Calculator
        </h2>
        <p className="text-sm text-[#62646a]">
          You only need three details to calculate an estimated personal loan EMI:
        </p>
        <ul className="list-disc pl-5 space-y-3 text-sm text-[#62646a]">
          <li>
            <strong>Loan Amount:</strong> Enter the amount you want to borrow.
          </li>
          <li>
            <strong>Interest Rate:</strong> Enter the annual interest rate in percentage.
          </li>
          <li>
            <strong>Loan Tenure:</strong> Enter how long you plan to take to repay the loan.
          </li>
        </ul>
        <div className="pt-2">
          <p className="text-sm font-bold text-[#222325] mb-2">Once you enter these details, the calculator shows:</p>
          <ul className="list-disc pl-5 space-y-1 text-sm text-[#62646a]">
            <li>Monthly EMI</li>
            <li>Total interest payable</li>
            <li>Total repayment amount</li>
            <li>Principal and interest breakdown</li>
            <li>Remaining loan balance through the repayment schedule</li>
          </ul>
        </div>
        <p className="text-sm text-[#62646a]">
          You can change any of the three inputs and compare different repayment situations. For example, you can check what happens to your EMI if you borrow ₹5 lakh instead of ₹4 lakh, or what happens when you choose a longer or shorter repayment period.
        </p>
      </div>

      {/* What Is a Personal Loan EMI? */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <h2 className="text-xl font-extrabold text-[#222325]">
          What Is a Personal Loan EMI?
        </h2>
        <p className="text-sm text-[#62646a]">
          EMI stands for <strong>Equated Monthly Instalment</strong>.
        </p>
        <p className="text-sm text-[#62646a]">
          It is the amount you are scheduled to pay towards your loan each month. Under a fixed-rate reducing-balance calculation, each EMI contains two parts:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-sm text-[#62646a]">
          <li>
            <strong>Principal:</strong> The amount that reduces what you originally borrowed.
          </li>
          <li>
            <strong>Interest:</strong> The borrowing cost charged on the outstanding principal.
          </li>
        </ul>
        <p className="text-sm text-[#62646a]">
          The EMI may remain the same under a fixed-rate loan, but the amount going towards principal and interest changes over time. In the earlier part of the repayment schedule, the interest component is usually larger. As the outstanding balance falls, more of the EMI goes towards principal.
        </p>
        <p className="text-sm text-[#62646a]">
          The actual repayment structure can differ if your lender uses a different interest method, changes the rate, or applies different rounding and repayment rules.
        </p>
      </div>

      {/* How Does the Calculator Work? */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <h2 className="text-xl font-extrabold text-[#222325]">
          How Does the Personal Loan EMI Calculator Work?
        </h2>
        <p className="text-sm text-[#62646a]">
          The calculator uses your loan amount, monthly interest rate and total number of monthly payments.
        </p>
        <p className="text-sm text-[#62646a]">
          For this calculator, the reducing-balance EMI formula is:
        </p>

        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center font-mono text-base sm:text-lg text-[#222325] overflow-x-auto my-4">
          {"$$\\text{EMI} = \\frac{P \\times r \\times (1+r)^n}{(1+r)^n - 1}$$"}
        </div>

        <p className="text-sm font-bold text-[#222325]">Where:</p>
        <ul className="list-disc pl-5 space-y-1 text-sm text-[#62646a]">
          <li><strong>P</strong> = Principal or original loan amount</li>
          <li><strong>r</strong> = Monthly interest rate (Annual interest rate ÷ 12 ÷ 100)</li>
          <li><strong>n</strong> = Total number of monthly instalments</li>
        </ul>

        <p className="text-sm text-[#62646a]">
          If the annual interest rate is 12%, for example, the monthly rate used in the calculation is:
        </p>
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 font-mono text-xs sm:text-sm text-[#222325] inline-block">
          12 ÷ 12 ÷ 100 = 0.01
        </div>

        <p className="text-sm text-[#62646a]">
          A five-year loan would have:
        </p>
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 font-mono text-xs sm:text-sm text-[#222325] inline-block">
          5 × 12 = 60 monthly instalments
        </div>

        <p className="text-xs text-[#74767e] italic bg-slate-50 p-4 rounded-xl border border-slate-200/80">
          The calculator performs the calculation internally and displays the final monetary values rounded to the nearest rupee.
        </p>
      </div>

      {/* Example: ₹5 Lakh at 12% for 3 Years */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <h2 className="text-xl font-extrabold text-[#222325]">
          Example: ₹5 Lakh Personal Loan at 12% for 3 Years
        </h2>
        <p className="text-sm text-[#62646a]">
          Suppose you borrow <strong>₹5,00,000</strong> at an annual interest rate of <strong>12%</strong> for <strong>3 years</strong>.
        </p>
        <p className="text-sm text-[#62646a]">
          Using the reducing-balance method:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-xs text-[#74767e] block">Loan Amount</span>
            <span className="text-lg font-bold text-[#222325]">₹5,00,000</span>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-xs text-[#74767e] block">Interest Rate</span>
            <span className="text-lg font-bold text-[#222325]">12% p.a.</span>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-xs text-[#74767e] block">Tenure / EMIs</span>
            <span className="text-lg font-bold text-[#222325]">3 Years (36 EMIs)</span>
          </div>
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
            <span className="text-xs text-emerald-700 block font-semibold">Estimated Monthly EMI</span>
            <span className="text-lg font-black text-emerald-700">₹16,607</span>
          </div>
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
            <span className="text-xs text-amber-800 block font-semibold">Estimated Total Interest</span>
            <span className="text-lg font-black text-amber-800">₹97,858</span>
          </div>
          <div className="p-4 rounded-2xl bg-slate-100 border border-slate-300">
            <span className="text-xs text-slate-700 block font-semibold">Estimated Total Repayment</span>
            <span className="text-lg font-black text-slate-900">₹5,97,858</span>
          </div>
        </div>
        <p className="text-xs text-[#74767e] italic pt-2">
          The actual amount charged by a lender may be different if the loan has a different interest calculation method, fees, rate changes, or other terms.
        </p>
      </div>

      {/* Why Use a Personal Loan EMI Calculator? */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-6">
        <h2 className="text-xl font-extrabold text-[#222325]">
          Why Use a Personal Loan EMI Calculator?
        </h2>
        <p className="text-sm text-[#62646a]">
          Doing the calculation manually can be inconvenient, especially when you want to compare several loan amounts and tenures. A calculator makes the comparison much easier.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <h3 className="font-bold text-[#222325] text-base">See the monthly cost before borrowing</h3>
            <p className="text-sm text-[#62646a]">
              You can check the estimated EMI before deciding how much to borrow. This is useful because a loan may look affordable when you only consider the amount you receive. The monthly repayment gives you a better idea of what the loan will add to your regular expenses.
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <h3 className="font-bold text-[#222325] text-base">Compare different loan amounts</h3>
            <p className="text-sm text-[#62646a]">
              You do not have to calculate one loan amount at a time manually. Try ₹2 lakh, ₹3 lakh, ₹5 lakh or another amount and compare the resulting EMI and total interest.
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <h3 className="font-bold text-[#222325] text-base">See the cost of a longer tenure</h3>
            <p className="text-sm text-[#62646a]">
              A longer tenure generally reduces the monthly EMI under a fixed-rate reducing-balance calculation. However, you may pay interest for a longer period, which can increase the total interest paid.
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <h3 className="font-bold text-[#222325] text-base">Understand the total repayment</h3>
            <p className="text-sm text-[#62646a]">
              The EMI is only one part of the picture. For example, two loans may have similar monthly EMIs but different tenures. Looking at the total repayment can show how much you are expected to pay over the complete repayment period.
            </p>
          </div>
        </div>
      </div>

      {/* What Affects Your Personal Loan EMI? */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <h2 className="text-xl font-extrabold text-[#222325]">
          What Affects Your Personal Loan EMI?
        </h2>
        <p className="text-sm text-[#62646a]">
          Three inputs have a direct effect on the EMI calculated by the formula:
        </p>
        <div className="space-y-4 pt-2">
          <div className="border-l-4 border-emerald-500 pl-4 space-y-1">
            <h3 className="font-bold text-[#222325]">Loan Amount</h3>
            <p className="text-sm text-[#62646a]">
              A larger loan normally results in a larger EMI when the interest rate and tenure remain the same. For example, increasing the loan from ₹3 lakh to ₹5 lakh increases the amount that needs to be repaid.
            </p>
          </div>
          <div className="border-l-4 border-amber-500 pl-4 space-y-1">
            <h3 className="font-bold text-[#222325]">Interest Rate</h3>
            <p className="text-sm text-[#62646a]">
              A higher interest rate generally increases the EMI and total interest for the same loan amount and tenure. Even a small rate difference can matter when the loan runs for several years.
            </p>
          </div>
          <div className="border-l-4 border-blue-500 pl-4 space-y-1">
            <h3 className="font-bold text-[#222325]">Loan Tenure</h3>
            <p className="text-sm text-[#62646a]">
              A longer tenure spreads repayment over more months. This can reduce the monthly EMI, but it can also increase the total interest paid because the outstanding balance remains under repayment for longer. A shorter tenure normally means a higher monthly EMI but fewer months of interest.
            </p>
          </div>
        </div>
      </div>

      {/* Personal Loan EMI vs Total Interest */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <h2 className="text-xl font-extrabold text-[#222325]">
          Personal Loan EMI vs Total Interest
        </h2>
        <p className="text-sm text-[#62646a]">
          It is easy to focus only on the monthly EMI.
        </p>
        <p className="text-sm text-[#62646a]">
          Suppose a calculator shows an EMI that fits comfortably into your monthly budget. That does not automatically mean it is the lowest-cost borrowing option.
        </p>
        <p className="text-sm font-bold text-[#222325]">You should also look at:</p>
        <ul className="list-disc pl-5 space-y-1 text-sm text-[#62646a]">
          <li>How many months you will make payments</li>
          <li>Total interest over the loan</li>
          <li>Total amount you will repay</li>
          <li>Any applicable processing fee</li>
          <li>Any other charges mentioned by the lender</li>
        </ul>
        <p className="text-sm text-[#62646a]">
          For this reason, checking the complete repayment picture is often more useful than looking at the EMI alone.
        </p>
      </div>

      {/* Reducing-Balance Interest Explained */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <h2 className="text-xl font-extrabold text-[#222325]">
          Reducing-Balance Interest Explained in Simple English
        </h2>
        <p className="text-sm text-[#62646a]">
          With a reducing-balance method, interest is calculated using the outstanding principal rather than continually using the original loan amount.
        </p>
        <p className="text-sm text-[#62646a]">
          Imagine you borrowed ₹5 lakh.
        </p>
        <p className="text-sm text-[#62646a]">
          At the beginning, your outstanding balance is close to ₹5 lakh, so the interest calculation is based on a larger balance.
        </p>
        <p className="text-sm text-[#62646a]">
          After you make repayments, the principal outstanding becomes smaller. As that balance falls, the interest component also falls, while a larger portion of the EMI goes towards reducing the principal.
        </p>
        <p className="text-sm text-[#62646a]">
          This is why the principal and interest portions of an amortisation schedule change over time.
        </p>
      </div>

      {/* Does Every Personal Loan Use the Same Interest Calculation? */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <h2 className="text-xl font-extrabold text-[#222325]">
          Does Every Personal Loan Use the Same Interest Calculation?
        </h2>
        <p className="text-sm text-[#222325] font-bold">
          No.
        </p>
        <p className="text-sm text-[#62646a]">
          This is an important point when comparing EMI calculators.
        </p>
        <p className="text-sm text-[#62646a]">
          Different loan products and lenders can have different pricing, interest structures, repayment terms and charges. Some personal-loan information sources also distinguish between <strong>reducing-balance</strong> and <strong>flat-rate</strong> calculations.
        </p>
        <p className="text-sm text-[#62646a]">
          This calculator specifically uses the <strong>standard reducing-balance formula</strong> stated above.
        </p>
        <p className="text-sm text-[#62646a]">
          Therefore, its result should be treated as a mathematical estimate based on the inputs you provide. Before accepting a loan offer, check the lender's documents to confirm the interest calculation method, rate, fees and repayment terms.
        </p>
      </div>

      {/* What Is Included in the EMI? */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <h2 className="text-xl font-extrabold text-[#222325]">
          What Is Included in the EMI?
        </h2>
        <p className="text-sm text-[#62646a]">
          Under the standard reducing-balance calculation used here, the EMI represents the scheduled repayment of:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-sm text-[#62646a]">
          <li>Principal</li>
          <li>Interest</li>
        </ul>
        <p className="text-sm text-[#62646a]">
          Processing fees and other charges are not automatically part of the mathematical EMI unless they are specifically included in the loan amount or repayment structure.
        </p>
        <p className="text-sm text-[#62646a]">
          A lender may charge separate fees. Check the lender's Key Facts Statement, sanction letter or loan agreement for the actual charges applicable to your loan.
        </p>
      </div>

      {/* Amortisation Schedule */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <h2 className="text-xl font-extrabold text-[#222325]">
          Personal Loan Amortisation Schedule
        </h2>
        <p className="text-sm text-[#62646a]">
          An amortisation schedule shows how your loan balance changes as you make payments. It can show:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-sm text-[#62646a]">
          <li>Opening balance</li>
          <li>EMI paid</li>
          <li>Principal paid</li>
          <li>Interest paid</li>
          <li>Closing balance</li>
        </ul>
        <p className="text-sm text-[#62646a]">
          At the beginning of a reducing-balance loan, the interest portion is generally higher because the outstanding balance is higher. Later, the interest portion falls as the principal is paid down. Personal-loan calculators from several Indian financial websites also provide monthly or yearly amortisation schedules for this purpose.
        </p>
        <p className="text-sm text-[#62646a]">
          The schedule can be useful when you want to understand where your money is going rather than looking only at the EMI figure.
        </p>
      </div>

      {/* How to Choose a Personal Loan Tenure */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <h2 className="text-xl font-extrabold text-[#222325]">
          How to Choose a Personal Loan Tenure
        </h2>
        <p className="text-sm text-[#62646a]">
          There is no single tenure that works for everyone.
        </p>
        <p className="text-sm text-[#62646a]">
          A shorter tenure means you usually need to handle a higher monthly EMI, but the loan is repaid sooner.
        </p>
        <p className="text-sm text-[#62646a]">
          A longer tenure can make the monthly payment easier to manage, but the loan can cost more in total interest.
        </p>
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center font-bold text-[#222325] text-sm sm:text-base">
          Monthly EMI + Total Interest
        </div>
        <p className="text-sm text-[#62646a]">
          Do not choose a tenure only because its EMI is lower.
        </p>
        <p className="text-sm text-[#62646a]">
          Your income, existing expenses, other loans and financial plans all matter when deciding what repayment amount is comfortable for you.
        </p>
      </div>

      {/* Can a Personal Loan EMI Change? */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <h2 className="text-xl font-extrabold text-[#222325]">
          Can a Personal Loan EMI Change?
        </h2>
        <p className="text-sm text-[#62646a]">
          It depends on the loan terms.
        </p>
        <p className="text-sm text-[#62646a]">
          For a fixed-rate loan, the EMI is generally designed to remain unchanged during the agreed repayment period, subject to the terms of the loan.
        </p>
        <p className="text-sm text-[#62646a]">
          For loans where the interest rate can change, the EMI, tenure or both may change according to the lender's terms.
        </p>
        <p className="text-sm text-[#62646a]">
          This is why you should check whether the rate offered to you is fixed or variable before relying on a calculator result for your future payments.
        </p>
      </div>

      {/* Approval & Pre-application Questions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-3">
          <h2 className="text-lg font-extrabold text-[#222325]">
            Does a Personal Loan EMI Calculator Tell Me Whether I Will Get the Loan?
          </h2>
          <p className="text-sm text-[#62646a]">
            No. An EMI calculator only estimates repayment based on the information you enter. It does not approve a loan.
          </p>
          <p className="text-sm font-bold text-[#222325]">A lender may consider factors such as:</p>
          <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-[#62646a]">
            <li>Income</li>
            <li>Existing debt</li>
            <li>Credit history</li>
            <li>Employment or business profile</li>
            <li>Age & repayment capacity</li>
            <li>Internal lending policies</li>
          </ul>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-3">
          <h2 className="text-lg font-extrabold text-[#222325]">
            Can I Use the Calculator Before Applying for a Personal Loan?
          </h2>
          <p className="text-sm text-[#62646a]">
            Yes. In fact, using the calculator before applying can help you understand the repayment amount you are considering.
          </p>
          <p className="text-sm font-bold text-[#222325]">Test several combinations and ask:</p>
          <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-[#62646a]">
            <li>Can I comfortably pay this EMI every month?</li>
            <li>What happens if I choose a shorter tenure?</li>
            <li>How much additional interest with a longer tenure?</li>
            <li>Is the loan amount really necessary?</li>
            <li>Are there additional fees outside the EMI?</li>
          </ul>
        </div>
      </div>

      {/* Processing Fees */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <h2 className="text-xl font-extrabold text-[#222325]">
          What About Processing Fees and Other Charges?
        </h2>
        <p className="text-sm text-[#62646a]">
          The EMI calculation itself does not necessarily include every cost associated with a personal loan.
        </p>
        <p className="text-sm text-[#62646a]">
          Depending on the lender and loan agreement, you may encounter charges such as:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-sm text-[#62646a]">
          <li>Processing fees</li>
          <li>Applicable taxes on fees</li>
          <li>Late-payment charges</li>
          <li>Prepayment or foreclosure charges, where permitted and applicable</li>
          <li>Other service or documentation charges</li>
        </ul>
        <p className="text-sm text-[#62646a]">
          Always check the lender's current fee schedule and loan documents instead of assuming that the calculator's total repayment includes every possible charge.
        </p>
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
              q: 'What is a personal loan EMI?',
              a: 'EMI stands for Equated Monthly Instalment. It is the amount you are scheduled to pay towards your personal loan each month. Your EMI includes both principal and interest. As you repay the loan, the amount going towards principal and interest changes over time.',
            },
            {
              q: 'How is a personal loan EMI calculated?',
              a: 'For this calculator, EMI is calculated using the standard reducing-balance formula. The calculation uses three things: Loan amount, Annual interest rate, and Loan tenure. The annual interest rate is converted into a monthly rate, and the tenure is converted into the number of monthly payments.',
            },
            {
              q: 'Is the EMI shown by this calculator the same as my bank\'s EMI?',
              a: 'It can be very close, but you should not assume that it will always be exactly the same. This calculator uses the standard reducing-balance formula and the numbers you enter. Your lender may use its own rounding rules, repayment dates, rate-reset terms, fees or other loan-specific conditions. For a final figure, always check the lender\'s repayment schedule or loan agreement.',
            },
            {
              q: 'Does a higher interest rate increase my EMI?',
              a: 'Yes. If the loan amount and tenure stay the same, a higher interest rate generally means a higher EMI and more interest paid over the loan period. This is why it can be useful to compare the actual interest rates offered by different lenders rather than looking only at the EMI.',
            },
            {
              q: 'Does a longer tenure reduce my EMI?',
              a: 'Usually, yes. When the same loan is spread over more months, the monthly EMI generally becomes lower. However, there is another side to this: you may pay interest for a longer period, which can increase the total interest paid. So when comparing tenures, look at both the EMI and total interest.',
            },
            {
              q: 'Is a shorter loan tenure better?',
              a: 'It depends on what you can comfortably afford. A shorter tenure usually means a higher monthly EMI, but the loan is repaid sooner and the total interest can be lower. A longer tenure usually gives you a lower monthly payment, but may cost more in total interest. The important thing is to compare the numbers rather than choosing a tenure only because the EMI looks lower.',
            },
            {
              q: 'Does the calculator include processing fees?',
              a: 'No. The standard EMI calculation is based on the loan amount, interest rate and tenure. Processing fees and other lender charges are separate unless they are specifically included in the loan amount. Some lenders charge processing fees or other service-related charges, so check the lender\'s fee schedule before comparing the total cost of two loans.',
            },
            {
              q: 'Why is my first year\'s interest higher?',
              a: 'With a reducing-balance loan, interest is calculated using the outstanding principal. At the beginning of the loan, you owe more money, so the interest portion of your EMI is generally higher. As you repay the principal, the outstanding balance falls. This normally means a smaller portion of later EMIs goes towards interest and a larger portion goes towards principal.',
            },
            {
              q: 'Why does the principal and interest split change every month?',
              a: 'Your EMI may remain the same under the assumptions used by the calculator, but the outstanding loan balance changes after every payment. Because interest is calculated on that outstanding balance, the interest portion generally falls as the principal is repaid. The principal portion then makes up a larger share of the EMI.',
            },
            {
              q: 'Can I use this calculator before applying for a personal loan?',
              a: 'Yes. It can help you understand what different loan amounts, interest rates and tenures could mean for your monthly budget. For example, you can compare a ₹3 lakh loan with a ₹5 lakh loan or see how the EMI changes when you move from a three-year tenure to five years.',
            },
            {
              q: 'Does the calculator tell me how much personal loan I can get?',
              a: 'No. An EMI calculator estimates your repayment based on the figures you enter. It does not decide whether a lender will approve your loan. Lenders may consider your income, existing debts, credit history, employment or business profile, age and their own lending policies.',
            },
            {
              q: 'Can I use the calculator to compare different lenders?',
              a: 'Yes, but use it as a starting point. You can enter the interest rate offered by each lender and compare the resulting EMI and total interest. However, don\'t compare lenders using EMI alone. Also check processing fees, other charges, prepayment conditions, interest-rate type and the terms in the actual loan offer.',
            },
            {
              q: 'What if my personal loan has a floating interest rate?',
              a: 'Your repayment can change if the interest rate changes. For floating-rate EMI-based personal loans, RBI requires regulated entities to communicate the impact of interest-rate resets on the EMI and/or tenure in the circumstances covered by its rules. Because of this, an EMI calculated today should not automatically be treated as the payment for the entire loan period when the rate is variable.',
            },
            {
              q: 'Can I change my EMI after taking the loan?',
              a: 'It depends on your lender and the terms of your loan. A change in tenure, an interest-rate reset or a prepayment may affect the EMI or remaining repayment period. If you are considering a change, check with your lender how the outstanding balance and remaining tenure will be recalculated.',
            },
            {
              q: 'What happens if I make a part-prepayment?',
              a: 'A part-prepayment reduces the outstanding principal. This can reduce the interest that would otherwise be charged on that amount in the future. Depending on the lender\'s rules, you may be able to reduce your EMI, shorten the tenure, or choose from the options offered by the lender. Check the applicable prepayment terms before making the payment.',
            },
            {
              q: 'Does making a prepayment always reduce my EMI?',
              a: 'Not necessarily. A lender may apply a prepayment by reducing the remaining tenure while keeping the EMI similar, or it may recalculate the EMI. The exact treatment depends on the loan agreement and the lender\'s policy.',
            },
            {
              q: 'What is the difference between a flat-rate loan and a reducing-balance loan?',
              a: 'They are different ways of calculating interest. With a reducing-balance method, interest is calculated using the outstanding principal. With a flat-rate method, interest can be calculated using the original loan amount for the stated period. Therefore, two loans showing the same headline interest rate can produce very different repayment costs if the calculation methods are different. This calculator specifically uses the reducing-balance method.',
            },
            {
              q: 'Why shouldn\'t I look at EMI alone?',
              a: 'A low EMI can sometimes come from choosing a longer repayment period. That may make the monthly payment easier to manage, but you could pay more interest over the full loan period. When comparing loans, look at: EMI + Total Interest + Total Repayment. Also consider any fees or charges that are not included in the basic EMI calculation.',
            },
            {
              q: 'Can I calculate the EMI for any loan amount?',
              a: 'You can use the calculator to test different loan amounts within the calculator\'s available range. However, the amount you can actually borrow depends on the lender\'s eligibility requirements and the loan offer you receive.',
            },
            {
              q: 'Is the result from this calculator guaranteed to be my final repayment amount?',
              a: 'No. The calculator provides a mathematical estimate based on the inputs you provide and the calculation method used. Your actual loan may have different terms, fees, rounding conventions, payment dates, rate changes or other conditions. Always use the lender\'s final loan documents for the exact repayment obligation.',
            },
            {
              q: 'Is this Personal Loan EMI Calculator free to use?',
              a: 'Yes. The calculator is designed to let you estimate your EMI and repayment cost without having to perform the calculation manually.',
            },
            {
              q: 'Do I need to apply for a loan to use the calculator?',
              a: 'No. You can use the calculator simply to explore different loan amounts, interest rates and tenures before deciding whether you want to apply.',
            },
            {
              q: 'What three numbers should I look at after calculating my EMI?',
              a: 'Start with these three: 1. Monthly EMI — what you may need to pay each month. 2. Total Interest — the interest calculated over the repayment period. 3. Total Repayment — the principal plus the calculated interest. Looking at all three gives you a better picture of the loan than looking at the EMI alone.',
            },
            {
              q: 'What should I check before accepting a personal loan?',
              a: 'Before accepting an offer, check the actual documents from the lender. Pay attention to: Interest rate and whether it is fixed or floating, EMI amount, Loan tenure, Processing fee and other charges, Prepayment or foreclosure terms, Late-payment or penal charges, Total amount payable, and Other important conditions in the loan agreement.',
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

      {/* A Simple Way to Use */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <h2 className="text-xl font-extrabold text-[#222325]">
          A Simple Way to Use the Calculator
        </h2>
        <p className="text-sm text-[#62646a]">
          If you are considering a personal loan, start with the amount you actually need rather than the maximum amount you think you might qualify for. Then enter the interest rate offered to you and test different repayment periods.
        </p>
        <p className="text-sm font-bold text-[#222325]">Look at three numbers together:</p>
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 font-bold text-center text-[#222325] text-sm sm:text-base">
          Monthly EMI &nbsp;&rarr;&nbsp; Total Interest &nbsp;&rarr;&nbsp; Total Repayment
        </div>
        <p className="text-sm text-[#62646a]">
          This gives you a much clearer picture of the loan than looking at the EMI alone.
        </p>
      </div>

      {/* Important Note Disclaimer */}
      <div className="bg-slate-50 rounded-3xl border border-slate-200 p-6 sm:p-8 text-xs text-slate-500 space-y-2">
        <div className="font-bold text-[#222325]">Important Note</div>
        <p>
          This Personal Loan EMI Calculator provides an estimate using the standard reducing-balance amortisation formula. The calculation assumes the entered interest rate remains applicable throughout the selected tenure and does not automatically account for lender-specific rounding, rate changes, processing fees, prepayments, delayed payments or other contractual charges.
        </p>
        <p>
          The final EMI, interest amount and repayment schedule should be confirmed from the lender's official loan documents before you make a borrowing decision.
        </p>
      </div>
    </div>
  );
};
