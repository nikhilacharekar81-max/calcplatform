import React from 'react';
import {
  Coins,
  ShieldCheck,
  TrendingUp,
  AlertCircle,
  Percent,
  Calendar,
  CheckCircle2,
  FileSpreadsheet,
  Building2,
  HelpCircle,
  Layers,
  ArrowRight,
  Info,
  DollarSign,
  AlertTriangle,
  Lightbulb,
  Check,
  Scale,
  Sparkles,
} from 'lucide-react';

export const GoldLoanGuideContent: React.FC = () => {
  return (
    <div className="space-y-12 font-sans text-[#404145] leading-relaxed">
      {/* 1. Article Header & Intro */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-xs font-bold text-amber-800">
          <Coins className="w-3.5 h-3.5" />
          <span>Secured Gold Financing &bull; RBI Regulatory Norms</span>
        </div>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#222325] tracking-tight">
          Gold Loan Calculator
        </h2>
        <p className="text-base sm:text-lg text-[#62646a] leading-relaxed">
          If you are planning to take a loan against your gold, the first thing you need to understand is <strong>how much your gold may be worth and how the interest rate and tenure can affect the cost of borrowing</strong>.
        </p>
        <p className="text-sm sm:text-base text-[#62646a] leading-relaxed">
          A Gold Loan Calculator helps you make that estimate using five basic details: <strong>gold weight, gold purity, current gold rate per gram, interest rate and loan tenure</strong>.
        </p>
        <p className="text-sm sm:text-base text-[#62646a] leading-relaxed">
          You don't need to enter a separate loan amount to start the calculation. The calculator begins with your gold and uses its weight, purity and current rate to estimate the value before calculating the loan-related figures.
        </p>
      </div>

      {/* 2. Gold Loan Calculator at a Glance */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-[#222325]">
                Gold Loan Calculator at a Glance
              </h2>
              <p className="text-xs text-[#74767e]">
                Quick summary connecting inputs to what they mean
              </p>
            </div>
          </div>
          <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
            Overview
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs sm:text-sm text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-900 font-bold border-b border-slate-200">
                <th className="p-3.5 w-1/3">What you enter</th>
                <th className="p-3.5 w-2/3">What it means</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[#404145]">
              <tr className="hover:bg-slate-50">
                <td className="p-3.5 font-bold text-[#222325]">Gold Weight (Grams)</td>
                <td className="p-3.5">Weight of the gold you want to use as security</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="p-3.5 font-bold text-[#222325]">Gold Purity</td>
                <td className="p-3.5">Purity of the gold: 24K, 22K or 18K</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="p-3.5 font-bold text-[#222325]">Current Gold Rate per Gram (₹)</td>
                <td className="p-3.5">Current rate used for the calculation</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="p-3.5 font-bold text-[#222325]">Interest Rate (% p.a.)</td>
                <td className="p-3.5 font-semibold text-emerald-700">Annual interest rate charged on the loan</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="p-3.5 font-bold text-[#222325]">Tenure (Years)</td>
                <td className="p-3.5">Period over which the loan is planned to run</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="text-xs text-[#74767e] pt-2 italic font-semibold">
          The result is an <strong>estimate</strong>, not a guarantee of the amount a lender will actually approve. The lender may value the jewellery differently and apply its own lending rules.
        </p>
      </div>

      {/* 3. How Does a Gold Loan Calculator Work? */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <h2 className="text-xl font-extrabold text-[#222325]">
          How Does a Gold Loan Calculator Work?
        </h2>
        <p className="text-sm sm:text-base text-[#62646a] leading-relaxed">
          A Gold Loan Calculator starts with the quantity and purity of your gold.
        </p>
        <p className="text-sm sm:text-base text-[#62646a] leading-relaxed">
          You enter the <strong>weight in grams</strong>, select the <strong>purity</strong>, and provide the <strong>current gold rate per gram</strong>. These details help estimate the value of the gold.
        </p>
        <p className="text-sm sm:text-base text-[#62646a] leading-relaxed">
          The calculator then uses the <strong>interest rate</strong> and <strong>tenure</strong> to estimate the cost of borrowing.
        </p>
        <p className="text-sm sm:text-base text-[#62646a] leading-relaxed">
          This gives you a quick way to understand how changes in your gold, interest rate or repayment period can affect the calculation.
        </p>
        <p className="text-sm sm:text-base font-semibold text-[#222325]">
          You can change the numbers and test different situations before approaching a lender.
        </p>
      </div>

      {/* 4. What Information Do You Need? */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-6">
        <h2 className="text-xl font-extrabold text-[#222325]">
          What Information Do You Need?
        </h2>
        <p className="text-sm sm:text-base text-[#62646a]">
          You only need five inputs.
        </p>

        <div className="space-y-4">
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
            <h3 className="text-base font-bold text-[#222325]">1. Gold Weight in Grams</h3>
            <p className="text-xs sm:text-sm text-[#62646a]">Enter the weight of the gold you plan to pledge.</p>
            <p className="text-xs sm:text-sm font-mono font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-lg inline-block">
              For example: 20 grams
            </p>
            <p className="text-xs sm:text-sm text-[#62646a] pt-1">
              The weight matters because more gold generally means a higher underlying gold value when the purity and rate remain the same. Use the actual weight of the gold being considered for the loan rather than guessing.
            </p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
            <h3 className="text-base font-bold text-[#222325]">2. Gold Purity</h3>
            <p className="text-xs sm:text-sm text-[#62646a]">Select the purity of your gold. The calculator supports:</p>
            <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-[#62646a]">
              <li><strong>24K</strong> (99.9% pure)</li>
              <li><strong>22K</strong> (91.6% pure standard jewellery)</li>
              <li><strong>18K</strong> (75.0% pure)</li>
            </ul>
            <p className="text-xs sm:text-sm text-[#62646a] pt-1">
              Purity matters because 20 grams of 24K gold does not contain the same proportion of pure gold as 20 grams of 18K gold. This is why the calculator needs both <strong>weight and purity</strong> rather than weight alone.
            </p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
            <h3 className="text-base font-bold text-[#222325]">3. Current Gold Rate per Gram</h3>
            <p className="text-xs sm:text-sm text-[#62646a]">Enter the current gold rate per gram used for your calculation.</p>
            <p className="text-xs sm:text-sm font-mono font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-lg inline-block">
              For example: ₹7,000 per gram
            </p>
            <p className="text-xs sm:text-sm text-[#62646a] pt-1">
              The rate you enter directly affects the estimated value. Gold prices change over time, so a calculation made today may produce a different result from one made later.
            </p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
            <h3 className="text-base font-bold text-[#222325]">4. Interest Rate</h3>
            <p className="text-xs sm:text-sm text-[#62646a]">Enter the annual interest rate offered or assumed for the gold loan.</p>
            <p className="text-xs sm:text-sm font-mono font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg inline-block">
              For example: 10% per year
            </p>
            <p className="text-xs sm:text-sm text-[#62646a] pt-1">
              A higher interest rate generally increases the cost of borrowing. If you already have an offer from a lender, use the rate stated in that offer rather than relying on a random rate found online.
            </p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
            <h3 className="text-base font-bold text-[#222325]">5. Tenure</h3>
            <p className="text-xs sm:text-sm text-[#62646a]">Enter the loan tenure in years.</p>
            <p className="text-xs sm:text-sm font-mono font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg inline-block">
              For example: 2 years
            </p>
            <p className="text-xs sm:text-sm text-[#62646a] pt-1">
              Tenure tells the calculator how long the loan is expected to remain outstanding. Changing the tenure can change the repayment and total interest calculation.
            </p>
          </div>
        </div>
      </div>

      {/* 5. How Does Gold Weight Affect the Calculation? */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <h2 className="text-xl font-extrabold text-[#222325]">
          How Does Gold Weight Affect the Calculation?
        </h2>
        <p className="text-sm sm:text-base text-[#62646a]">
          Gold weight is one of the simplest parts of the calculation.
        </p>
        <p className="text-sm sm:text-base text-[#62646a]">
          If everything else remains unchanged, increasing the weight generally increases the estimated value of the gold.
        </p>
        <p className="text-sm sm:text-base text-[#62646a]">
          For example, compare:
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-xs sm:text-sm text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-900 font-bold border-b border-slate-200">
                <th className="p-3 text-right">Gold Weight</th>
                <th className="p-3">Purity</th>
                <th className="p-3 text-right">Gold Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[#404145]">
              <tr className="hover:bg-slate-50">
                <td className="p-3 text-right font-bold text-[#222325]">10 grams</td>
                <td className="p-3">22K</td>
                <td className="p-3 text-right">Same rate</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="p-3 text-right font-bold text-[#222325]">20 grams</td>
                <td className="p-3">22K</td>
                <td className="p-3 text-right">Same rate</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="p-3 text-right font-bold text-[#222325]">30 grams</td>
                <td className="p-3">22K</td>
                <td className="p-3 text-right">Same rate</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="text-sm sm:text-base text-[#62646a] pt-2">
          The estimated gold value will increase as the weight increases.
        </p>
        <p className="text-sm sm:text-base text-[#62646a]">
          That doesn't automatically mean a lender will offer the same proportional increase in the loan amount. The lender may apply its own valuation and lending limits.
        </p>
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 font-bold text-center text-sm sm:text-base">
          Gold value &ne; guaranteed loan amount
        </div>
      </div>

      {/* 6. Why Does Gold Purity Matter? & 24K vs 22K vs 18K */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-6">
        <h2 className="text-xl font-extrabold text-[#222325]">
          Why Does Gold Purity Matter?
        </h2>
        <p className="text-sm sm:text-base text-[#62646a]">
          Purity tells you how much of the jewellery consists of gold.
        </p>
        <p className="text-sm sm:text-base text-[#62646a]">
          The calculator gives you three purity choices: <strong>24K, 22K, and 18K</strong>.
        </p>
        <p className="text-sm sm:text-base text-[#62646a]">
          For the same weight, higher-purity gold generally has a higher underlying gold value when the applicable rate is comparable.
        </p>
        <p className="text-sm sm:text-base text-[#62646a]">
          For example, 20 grams of 22K gold and 20 grams of 18K gold have the same weight, but they do not represent the same amount of pure gold.
        </p>
        <p className="text-sm sm:text-base font-semibold text-[#222325]">
          This is why entering the correct purity is important. If you select the wrong purity, the estimated result can be misleading.
        </p>

        <div className="pt-2">
          <h3 className="text-lg font-bold text-[#222325] mb-3">
            24K vs 22K vs 18K Gold
          </h3>
          <p className="text-sm text-[#62646a] mb-3">Here is the simple difference:</p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-900 font-bold border-b border-slate-200">
                  <th className="p-3.5">Purity</th>
                  <th className="p-3.5 text-right">Approximate Gold Content</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-[#404145]">
                <tr className="hover:bg-slate-50">
                  <td className="p-3.5 font-bold text-[#222325]">24K</td>
                  <td className="p-3.5 text-right font-semibold">99.9% or very close to pure gold</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="p-3.5 font-bold text-[#222325]">22K</td>
                  <td className="p-3.5 text-right font-semibold">About 91.6% gold</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="p-3.5 font-bold text-[#222325]">18K</td>
                  <td className="p-3.5 text-right font-semibold">About 75% gold</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-[#74767e] pt-3 italic">
            Jewellery is often made using alloys to provide greater strength and durability. As a result, jewellery purity can be lower than 24K. For a calculator, always select the purity that matches the gold being considered.
          </p>
        </div>
      </div>

      {/* 7. How Does the Gold Rate Affect the Result? & Gold Rate vs Jewellery Value */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <h2 className="text-xl font-extrabold text-[#222325]">
          How Does the Gold Rate Affect the Result?
        </h2>
        <p className="text-sm sm:text-base text-[#62646a]">
          The current gold rate per gram is another major input.
        </p>
        <p className="text-sm sm:text-base text-[#62646a]">
          Suppose you enter: <strong>20 grams</strong>, <strong>22K</strong>, and <strong>₹7,000 per gram</strong>.
        </p>
        <p className="text-sm sm:text-base text-[#62646a]">
          Now change the rate to ₹7,500. The estimated gold value will change even though the weight and purity remain exactly the same.
        </p>
        <p className="text-sm sm:text-base text-[#62646a]">
          This is one reason you should use a relevant current rate when making an estimate. Do not assume that a gold rate from an old article or an old screenshot is still applicable today.
        </p>

        <div className="pt-4 border-t border-slate-100 space-y-2">
          <h3 className="text-lg font-bold text-[#222325]">
            Gold Rate vs Jewellery Value
          </h3>
          <p className="text-sm text-[#62646a]">
            This is an important distinction. The rate you enter into a calculator is a reference rate for the calculation. The lender's actual valuation of jewellery can involve its own valuation process.
          </p>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center text-xs sm:text-sm font-mono font-bold text-slate-700">
            Final amount may differ from: Weight &times; Gold Rate
          </div>
          <p className="text-xs sm:text-sm text-[#62646a]">
            Jewellery may also contain stones, non-gold components, workmanship and other elements that do not necessarily have the same value as the underlying gold. The lender's valuation process determines what value it accepts for lending purposes.
          </p>
        </div>
      </div>

      {/* 8. Does the Calculator Tell You the Exact Loan Amount? */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <h2 className="text-xl font-extrabold text-[#222325]">
          Does the Calculator Tell You the Exact Loan Amount?
        </h2>
        <p className="text-sm sm:text-base font-bold text-rose-600">
          Not necessarily.
        </p>
        <p className="text-sm sm:text-base text-[#62646a]">
          A Gold Loan Calculator can estimate figures based on the information you enter, but the <strong>actual loan amount offered by a lender can be different</strong>.
        </p>
        <p className="text-sm sm:text-base text-[#62646a]">
          The lender may consider factors such as:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-[#62646a]">
          <li>Its valuation of the pledged gold</li>
          <li>Gold purity confirmed during valuation</li>
          <li>Applicable lending limits</li>
          <li>Loan product terms</li>
          <li>Interest rate</li>
          <li>Internal policies</li>
          <li>Other charges or conditions</li>
        </ul>
        <p className="text-xs sm:text-sm text-[#74767e] pt-2 font-semibold">
          So use the calculator as a planning tool. The final sanction amount comes from the lender.
        </p>
      </div>

      {/* 9. How Interest Rate & Tenure Affect Gold Loans */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-6">
        <h2 className="text-xl font-extrabold text-[#222325]">
          How Interest Rate and Tenure Affect a Gold Loan
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <h3 className="text-base font-bold text-[#222325]">How Interest Rate Affects Cost</h3>
            <p className="text-xs sm:text-sm text-[#62646a]">
              The interest rate determines how much interest you pay for borrowing the money.
            </p>
            <p className="text-xs sm:text-sm text-[#62646a]">
              If the loan amount and tenure remain unchanged, a higher interest rate generally means a higher interest cost. For example, test: 9%, 10%, 11%, 12%.
            </p>
            <p className="text-xs text-[#74767e]">
              A difference of one percentage point may look small on paper, but over a longer repayment period or larger loan, the effect becomes noticeable.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <h3 className="text-base font-bold text-[#222325]">How Tenure Affects Loan Cost</h3>
            <p className="text-xs sm:text-sm text-[#62646a]">
              Tenure is the length of time you plan to keep the loan (e.g. 1 year, 2 years, 3 years, 4 years).
            </p>
            <p className="text-xs sm:text-sm text-[#62646a]">
              A shorter tenure usually means the loan is repaid over a shorter period. A longer tenure spreads repayment over more time, which can increase the total interest you pay.
            </p>
            <p className="text-xs text-[#74767e] font-semibold">
              The important point is not to look at tenure separately from interest rate. Test both together.
            </p>
          </div>
        </div>
      </div>

      {/* 10. Gold Loan Example */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <h2 className="text-xl font-extrabold text-[#222325]">
          Gold Loan Example
        </h2>
        <p className="text-sm sm:text-base text-[#62646a]">
          Suppose you have:
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs sm:text-sm text-[#222325] font-bold">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-slate-400 block text-[10px] uppercase">Weight</span>
            20 grams
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-slate-400 block text-[10px] uppercase">Purity</span>
            22K
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-slate-400 block text-[10px] uppercase">Gold Rate</span>
            ₹7,000/g
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-slate-400 block text-[10px] uppercase">Interest</span>
            10% p.a.
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-slate-400 block text-[10px] uppercase">Tenure</span>
            2 years
          </div>
        </div>

        <p className="text-sm sm:text-base text-[#62646a] pt-2">
          Enter these values into the calculator. The calculator will use the gold details to estimate the gold value and then use the applicable loan and interest inputs to produce the relevant repayment figures.
        </p>
        <p className="text-sm sm:text-base text-[#62646a]">
          Now change the gold weight from 20 grams to 30 grams: the estimated gold value will increase.
        </p>
        <p className="text-sm sm:text-base text-[#62646a]">
          Change the interest rate from 10% to 12%: the estimated borrowing cost will increase.
        </p>
        <p className="text-sm sm:text-base text-[#62646a]">
          Change the tenure from 2 years to 3 years: the repayment period becomes longer, which can affect the total interest.
        </p>
        <p className="text-sm sm:text-base font-semibold text-[#222325]">
          This is where the calculator becomes useful: you can experiment with the numbers before making a real borrowing decision.
        </p>
      </div>

      {/* 11. Why You Should Try More Than One Calculation */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-6">
        <h2 className="text-xl font-extrabold text-[#222325]">
          Why You Should Try More Than One Calculation
        </h2>
        <p className="text-sm sm:text-base text-[#62646a]">
          Don't stop after entering one set of numbers. Try a few realistic scenarios.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <h3 className="text-base font-bold text-[#222325]">Scenario 1: Your current gold</h3>
            <p className="text-xs sm:text-sm text-[#62646a]">Enter the actual weight and purity of the gold you are considering.</p>
          </div>
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <h3 className="text-base font-bold text-[#222325]">Scenario 2: Different interest rate</h3>
            <p className="text-xs sm:text-sm text-[#62646a]">Change the interest rate to see how the borrowing cost changes.</p>
          </div>
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <h3 className="text-base font-bold text-[#222325]">Scenario 3: Different tenure</h3>
            <p className="text-xs sm:text-sm text-[#62646a]">Compare a shorter and longer tenure.</p>
          </div>
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <h3 className="text-base font-bold text-[#222325]">Scenario 4: Different gold rate</h3>
            <p className="text-xs sm:text-sm text-[#62646a]">Change the gold rate to understand how sensitive the estimated gold value is to market prices.</p>
          </div>
        </div>

        <p className="text-sm sm:text-base font-semibold text-[#222325]">
          These comparisons can help you understand the numbers instead of looking at a single result in isolation.
        </p>
      </div>

      {/* 12. Common Mistakes When Using a Gold Loan Calculator */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-6">
        <h2 className="text-xl font-extrabold text-[#222325]">
          Common Mistakes When Using a Gold Loan Calculator
        </h2>

        <div className="space-y-4">
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <h3 className="text-base font-bold text-[#222325]">Entering the wrong gold weight</h3>
            <p className="text-xs sm:text-sm text-[#62646a]">Even a small difference in weight can change the estimated value. Use the weight relevant to the gold being pledged.</p>
          </div>
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <h3 className="text-base font-bold text-[#222325]">Selecting the wrong purity</h3>
            <p className="text-xs sm:text-sm text-[#62646a]">20 grams of 18K gold and 20 grams of 22K gold should not be treated as the same. Select the correct purity.</p>
          </div>
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <h3 className="text-base font-bold text-[#222325]">Using an outdated gold rate</h3>
            <p className="text-xs sm:text-sm text-[#62646a]">Gold rates change. If you're using the calculator to assess a current loan, use a current and relevant rate.</p>
          </div>
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <h3 className="text-base font-bold text-[#222325]">Assuming gold value equals loan amount</h3>
            <p className="text-xs sm:text-sm text-[#62646a]">This is one of the biggest mistakes. A lender does not necessarily lend the entire calculated value of the gold. The actual loan amount depends on the lender's valuation and applicable lending rules.</p>
          </div>
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <h3 className="text-base font-bold text-[#222325]">Looking only at the interest rate</h3>
            <p className="text-xs sm:text-sm text-[#62646a]">The tenure also matters. Compare the overall borrowing cost rather than looking at the rate alone.</p>
          </div>
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <h3 className="text-base font-bold text-[#222325]">Treating the calculator result as a loan approval</h3>
            <p className="text-xs sm:text-sm text-[#62646a]">The calculator does not approve your loan. It only performs an estimate based on the numbers you enter.</p>
          </div>
        </div>
      </div>

      {/* 13. Gold Loan Calculator vs Actual Lender Valuation */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <h2 className="text-xl font-extrabold text-[#222325]">
          Gold Loan Calculator vs Actual Lender Valuation
        </h2>
        <p className="text-sm sm:text-base text-[#62646a]">
          These two processes serve different purposes.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-xs sm:text-sm text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-900 font-bold border-b border-slate-200">
                <th className="p-3.5 w-1/2">Calculator</th>
                <th className="p-3.5 w-1/2">Lender</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[#404145]">
              <tr className="hover:bg-slate-50">
                <td className="p-3.5">Uses the figures you enter</td>
                <td className="p-3.5 font-semibold text-[#222325]">Performs its own valuation</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="p-3.5">Provides an estimate</td>
                <td className="p-3.5 font-semibold text-[#222325]">Determines the actual eligible amount</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="p-3.5">Helps you compare scenarios</td>
                <td className="p-3.5 font-semibold text-[#222325]">Makes the final lending decision</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="p-3.5">Useful before applying</td>
                <td className="p-3.5 font-semibold text-[#222325]">Used during the actual loan process</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="text-xs sm:text-sm text-[#62646a] pt-2">
          The calculator is useful before you visit or apply to a lender because it gives you a starting point. But don't treat the calculated figure as a promise of what you will receive.
        </p>
      </div>

      {/* 14. What Should You Check Before Taking a Gold Loan? */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <h2 className="text-xl font-extrabold text-[#222325]">
          What Should You Check Before Taking a Gold Loan?
        </h2>
        <p className="text-sm sm:text-base text-[#62646a]">
          Before accepting a loan offer, look beyond the headline interest rate. Check:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-[#62646a]">
          <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl border border-slate-200">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Interest rate</span>
          </div>
          <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl border border-slate-200">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Loan tenure</span>
          </div>
          <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl border border-slate-200">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Total interest</span>
          </div>
          <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl border border-slate-200">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Repayment conditions</span>
          </div>
          <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl border border-slate-200">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Applicable charges</span>
          </div>
          <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl border border-slate-200">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Terms for late payment</span>
          </div>
          <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl border border-slate-200">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Rules for repayment or closure</span>
          </div>
          <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl border border-slate-200">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Conditions related to the pledged gold</span>
          </div>
          <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl border border-slate-200 sm:col-span-2">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>What happens if the loan is not repaid according to the agreement</span>
          </div>
        </div>
        <p className="text-xs sm:text-sm text-[#74767e] pt-2 font-semibold">
          Read the lender's actual loan documents before accepting the offer.
        </p>
      </div>

      {/* 15. Frequently Asked Questions */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-6">
        <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
          <div className="w-8 h-8 rounded-lg bg-[#f4fdf8] text-[#1dbf73] flex items-center justify-center border border-[#d8f5e5] shrink-0">
            <HelpCircle className="w-4 h-4" />
          </div>
          <h2 className="text-xl font-extrabold text-[#222325]">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {[
            {
              q: 'What is a Gold Loan Calculator?',
              a: 'A Gold Loan Calculator is a tool that estimates gold value and loan-related figures using your gold weight, purity, current gold rate, interest rate and tenure. It helps you understand how different gold and loan assumptions can affect the estimated result.',
            },
            {
              q: 'What inputs are required for a Gold Loan Calculator?',
              a: 'The calculator requires gold weight in grams, gold purity, current gold rate per gram, annual interest rate and loan tenure in years.',
            },
            {
              q: 'Why do I need to enter gold purity?',
              a: 'Purity affects the amount of actual gold contained in the jewellery. The calculator uses the selected purity—24K, 22K or 18K—to make the calculation more meaningful than using weight alone.',
            },
            {
              q: 'What is the difference between 24K, 22K and 18K gold?',
              a: '24K is nearly pure gold, while 22K contains about 91.6% gold and 18K contains about 75% gold. For the same weight, the underlying gold value can therefore differ by purity.',
            },
            {
              q: 'Does more gold mean a higher loan amount?',
              a: 'More gold generally means a higher underlying gold value when purity and the applicable gold rate remain the same. However, the actual loan amount depends on the lender’s valuation and lending rules.',
            },
            {
              q: 'Does the current gold rate affect the calculation?',
              a: 'Yes. The gold rate per gram directly affects the estimated value of the gold. If the rate changes while the weight and purity remain the same, the estimated value will also change.',
            },
            {
              q: 'Does a higher interest rate increase the cost of a gold loan?',
              a: 'Generally, yes. If the other loan assumptions remain unchanged, a higher interest rate generally results in a higher interest cost.',
            },
            {
              q: 'Does a longer tenure increase interest?',
              a: 'A longer tenure can increase the total interest paid because the loan remains outstanding for a longer period. The exact result depends on the loan structure and repayment method.',
            },
            {
              q: 'Can this calculator tell me exactly how much a lender will give me?',
              a: 'No. It provides an estimate based on the information entered. The lender’s actual valuation, lending limits and loan terms determine the final eligible amount.',
            },
            {
              q: 'Should I use the lender’s gold rate?',
              a: 'If you are calculating a real loan offer, use the rate and valuation information provided by the lender where appropriate. A general market gold rate may not be identical to the rate or valuation used by a lender.',
            },
          ].map((faq, idx) => (
            <div key={idx} className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <h3 className="font-bold text-[#222325] text-sm sm:text-base flex items-start gap-2">
                <span className="text-[#1dbf73] font-mono">Q{idx + 1}.</span>
                <span>{faq.q}</span>
              </h3>
              <p className="text-xs sm:text-sm text-[#62646a] pl-6 leading-relaxed">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 16. Final Takeaway */}
      <div className="bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white rounded-3xl p-6 sm:p-10 shadow-xl space-y-4 border border-slate-800">
        <h2 className="text-xl sm:text-2xl font-black text-amber-400 tracking-tight flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <span>Final Takeaway</span>
        </h2>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          A gold loan calculation starts with the gold itself.
        </p>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          Enter the <strong>weight</strong>, choose the correct <strong>purity</strong>, add the <strong>current gold rate per gram</strong>, and then enter the <strong>interest rate and tenure</strong>.
        </p>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          Don't stop at the estimated gold value. Look at how the interest rate and tenure affect the cost of borrowing as well.
        </p>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          Most importantly, remember that the calculator gives you an estimate. The lender's own valuation determines the actual loan amount and final terms.
        </p>
        <div className="p-4 rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-300 font-bold text-center text-sm sm:text-base">
          Use the calculator to understand your numbers <span className="text-white font-black underline">before</span> you make the borrowing decision.
        </div>
      </div>
    </div>
  );
};
