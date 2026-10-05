import React from 'react';
import { BookOpen, ShieldCheck, HelpCircle, Activity, Info, CheckCircle2, ArrowRight } from 'lucide-react';

export const HumanLifeValueGuideContent: React.FC = () => {
  return (
    <div className="space-y-8 text-[#404145] font-sans">
      {/* Main Guide Content Card */}
      <div className="bg-white rounded-3xl border border-[#e4e5e7] p-6 sm:p-10 shadow-xs space-y-8">
        
        {/* Intro */}
        <div className="space-y-4 border-b border-slate-100 pb-6">
          <h2 className="text-xl sm:text-2xl font-black text-[#222325]">
            Human Life Value (HLV) Calculator
          </h2>
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
            You may know your salary. You may even know how much life insurance you have.
          </p>
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-semibold">
            But there is another question worth asking:
          </p>
          <p className="text-base sm:text-lg font-bold text-[#1dbf73] bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
            How much is your future income worth to your family today?
          </p>
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
            That is what Human Life Value, or HLV, tries to estimate.
          </p>
          <p className="text-xs sm:text-sm text-slate-500 italic">
            Use the calculator above to see how your age, income, expenses, income growth and discount rate affect the result.
          </p>
        </div>

        {/* Section 1: What is Human Life Value? */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-[#222325] flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1dbf73]" />
            What is Human Life Value?
          </h3>
          <p className="text-sm text-slate-700 leading-relaxed">
            Human Life Value is an estimate of the present value of your future financial contribution.
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">
            For example, a 30-year-old earning ₹20 lakh a year may earn for another 30 years. But ₹20 lakh received 20 years from now is not worth the same as ₹20 lakh today.
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">
            HLV takes those future amounts and converts them into today's value.
          </p>
          <p className="text-xs font-semibold text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-200">
            It is an estimate, not a guaranteed value.
          </p>
        </div>

        {/* Section 2: How is HLV calculated? */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-[#222325] flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1dbf73]" />
            How is HLV calculated?
          </h3>
          <p className="text-sm text-slate-700 leading-relaxed">
            A discounted-earnings model can be written as:
          </p>

          <div className="p-4 bg-slate-900 text-emerald-300 rounded-2xl font-mono text-xs sm:text-sm space-y-2 border border-slate-800 shadow-inner">
            <div className="text-center font-bold text-white text-base py-1">
              HLV = ∑ [ NE<sub>t</sub> / (1 + r)<sup>t</sup> ] &nbsp; for t = 1 to n
            </div>
            <div className="border-t border-slate-800 pt-2 text-xs text-slate-300 grid grid-cols-1 sm:grid-cols-2 gap-1">
              <div><strong>NE<sub>t</sub></strong> = net financial contribution in year t</div>
              <div><strong>r</strong> = discount rate</div>
              <div><strong>t</strong> = future year</div>
              <div><strong>n</strong> = remaining working years</div>
            </div>
          </div>

          <p className="text-sm text-slate-700 leading-relaxed">
            The working period can be estimated as:
          </p>

          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl font-mono text-xs text-emerald-900 font-bold text-center">
            n = Retirement Age − Current Age
          </div>

          <p className="text-sm text-slate-700 leading-relaxed">
            So, if you are 30 and expect to retire at 60, the calculation uses a 30-year working period.
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">
            The exact result depends on the assumptions entered into the calculator.
          </p>
        </div>

        {/* Section 3: What information do you need? */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-[#222325] flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1dbf73]" />
            What information do you need?
          </h3>
          <p className="text-sm text-slate-700 leading-relaxed">
            You don't need a complicated financial statement.
          </p>
          <p className="text-sm text-slate-700 font-semibold">
            The main inputs are:
          </p>
          <ul className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs sm:text-sm text-slate-700">
            <li className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#1dbf73] shrink-0" /> Current Age
            </li>
            <li className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#1dbf73] shrink-0" /> Retirement Age
            </li>
            <li className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#1dbf73] shrink-0" /> Annual Income
            </li>
            <li className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#1dbf73] shrink-0" /> Expected Income Growth
            </li>
            <li className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#1dbf73] shrink-0" /> Personal Expenses
            </li>
            <li className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#1dbf73] shrink-0" /> Discount Rate
            </li>
          </ul>
          <p className="text-sm text-slate-700 leading-relaxed pt-1">
            These numbers drive the result.
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">
            If your income, expenses or retirement plans change, your HLV can change too.
          </p>
        </div>

        {/* Section 4: Why does income growth matter? */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-[#222325] flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1dbf73]" />
            Why does income growth matter?
          </h3>
          <p className="text-sm text-slate-700 leading-relaxed">
            Your salary today may not be your salary ten years from now.
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">
            Suppose your current income is ₹20 lakh and you assume 8% annual growth. The calculator can project higher income in future years before converting those amounts into today's value.
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">
            Change the growth rate from 8% to 5%, and the result can change substantially.
          </p>
          <p className="text-sm text-slate-700 leading-relaxed font-semibold text-slate-800">
            That is why the income-growth assumption deserves attention. Don't simply enter a number because it makes the HLV look higher.
          </p>
        </div>

        {/* Section 5: Why are personal expenses important? */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-[#222325] flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1dbf73]" />
            Why are personal expenses important?
          </h3>
          <p className="text-sm text-slate-700 leading-relaxed">
            Your entire income may not be a financial contribution to your family.
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">
            Suppose you earn ₹20 lakh a year and spend ₹6 lakh on your own needs. The amount available to support your family is different from your full salary.
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">
            The calculator can use personal expenses when estimating the financial contribution.
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">
            This is one reason two people earning the same salary can have different HLVs.
          </p>
        </div>

        {/* Section 6: What happens if I change the discount rate? */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-[#222325] flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1dbf73]" />
            What happens if I change the discount rate?
          </h3>
          <p className="text-sm text-slate-700 leading-relaxed">
            This is one of the most important parts of the calculation.
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">
            Money expected in the future is converted into today's value using the discount rate.
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">
            For example, a payment expected 20 years from now is discounted much more than a payment expected next year.
          </p>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1 text-xs font-semibold text-slate-700">
            <p className="text-amber-700">Higher discount rate → lower present value</p>
            <p className="text-emerald-700">Lower discount rate → higher present value</p>
          </div>
          <p className="text-sm text-slate-700 leading-relaxed">
            Try changing the rate in the calculator and watch the result change.
          </p>
        </div>

        {/* Section 7: What happens if I retire earlier? */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-[#222325] flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1dbf73]" />
            What happens if I retire earlier?
          </h3>
          <p className="text-sm text-slate-700 leading-relaxed">
            Your working years matter.
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">
            Someone aged 30 retiring at 60 has a 30-year working period.
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">
            If the same person plans to retire at 55, the working period falls to 25 years.
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">
            Fewer earning years can mean a lower HLV, all else being equal.
          </p>
        </div>

        {/* Section 8: Try the What-If Analysis */}
        <div className="space-y-4 bg-slate-50/70 p-6 rounded-2xl border border-slate-200">
          <h3 className="text-lg font-bold text-[#222325] flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1dbf73]" />
            Try the What-If Analysis
          </h3>
          <p className="text-sm text-slate-700 leading-relaxed">
            Don't stop after getting one number.
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">
            Change one assumption and see what happens.
          </p>
          <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700">
            <li className="p-3 bg-white border border-slate-200 rounded-xl">
              <strong>What if income grows faster?</strong> Compare 5%, 8% and 10% income growth. You'll see how strongly long-term earnings assumptions can affect HLV.
            </li>
            <li className="p-3 bg-white border border-slate-200 rounded-xl">
              <strong>What if you retire earlier?</strong> Compare retirement at 55, 60 and 65. This shows the effect of your remaining working years.
            </li>
            <li className="p-3 bg-white border border-slate-200 rounded-xl">
              <strong>What if your personal expenses increase?</strong> Higher personal expenses can reduce the financial contribution available to dependents.
            </li>
            <li className="p-3 bg-white border border-slate-200 rounded-xl">
              <strong>What if the discount rate changes?</strong> Try different reasonable assumptions rather than relying on one rate.
            </li>
          </ul>
          <p className="text-xs text-slate-600 italic">
            The purpose of What-If analysis is not to find the biggest HLV. It is to understand how sensitive your result is.
          </p>
        </div>

        {/* Section 9: Is HLV the Same as Your Life Insurance Requirement? */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-[#222325] flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1dbf73]" />
            Is HLV the Same as Your Life Insurance Requirement?
          </h3>
          <p className="text-sm text-slate-700 leading-relaxed font-bold text-red-600">
            No.
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">
            This is an easy mistake to make.
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">
            HLV looks at the economic value of future financial contribution.
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">
            A needs-based insurance calculation asks a different question:
          </p>
          <p className="text-sm font-semibold text-slate-800 italic bg-amber-50 p-3 rounded-xl border border-amber-200">
            How much money would my family actually need if my income stopped?
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">
            That calculation may consider:
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-slate-700">
            <li className="p-2 bg-slate-50 border border-slate-200 rounded-lg">&bull; Household expenses</li>
            <li className="p-2 bg-slate-50 border border-slate-200 rounded-lg">&bull; Outstanding loans</li>
            <li className="p-2 bg-slate-50 border border-slate-200 rounded-lg">&bull; Children's education</li>
            <li className="p-2 bg-slate-50 border border-slate-200 rounded-lg">&bull; Other future goals</li>
            <li className="p-2 bg-slate-50 border border-slate-200 rounded-lg">&bull; Existing investments</li>
            <li className="p-2 bg-slate-50 border border-slate-200 rounded-lg">&bull; Existing life insurance</li>
            <li className="p-2 bg-slate-50 border border-slate-200 rounded-lg">&bull; Other available resources</li>
          </ul>
          <p className="text-sm text-slate-700 leading-relaxed">
            So you can use HLV as one reference point, then perform a separate needs analysis.
          </p>

          {/* Comparison Table */}
          <div className="overflow-x-auto my-4 border border-slate-200 rounded-2xl shadow-2xs">
            <table className="w-full text-xs sm:text-sm text-left text-slate-700 border-collapse">
              <thead className="text-xs uppercase bg-slate-100 text-slate-800 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 w-1/2">HLV</th>
                  <th className="py-3 px-4 w-1/2">Needs-Based Analysis</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                <tr>
                  <td className="py-2.5 px-4">Focuses on future financial contribution</td>
                  <td className="py-2.5 px-4">Focuses on family financial requirements</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4">Uses projected earnings</td>
                  <td className="py-2.5 px-4">Uses expenses, debts, goals and assets</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4">Uses a discount rate</td>
                  <td className="py-2.5 px-4">Can use present-value calculations</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4">Gives an economic-value estimate</td>
                  <td className="py-2.5 px-4">Gives an estimated protection gap</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-semibold text-emerald-700">Useful as a benchmark</td>
                  <td className="py-2.5 px-4 font-semibold text-blue-700">Useful for detailed insurance planning</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-sm text-slate-700 leading-relaxed">
            Neither number should be treated as automatically correct for every household.
          </p>
          <p className="text-sm font-bold text-slate-800">
            Your situation matters.
          </p>
        </div>

        {/* Section 10: A Simple Example */}
        <div className="space-y-3 bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100">
          <h3 className="text-lg font-bold text-[#222325]">
            A Simple Example
          </h3>
          <p className="text-sm text-slate-700 leading-relaxed">
            Suppose you are:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-mono font-bold text-emerald-950">
            <div className="p-2 bg-white rounded-lg border border-emerald-200">Age: 30</div>
            <div className="p-2 bg-white rounded-lg border border-emerald-200">Retirement age: 60</div>
            <div className="p-2 bg-white rounded-lg border border-emerald-200">Annual income: ₹20 lakh</div>
            <div className="p-2 bg-white rounded-lg border border-emerald-200">Income growth: 8%</div>
            <div className="p-2 bg-white rounded-lg border border-emerald-200">Personal expenses: ₹6 lakh</div>
            <div className="p-2 bg-white rounded-lg border border-emerald-200">Discount rate: 7.5%</div>
          </div>
          <p className="text-sm text-slate-700 leading-relaxed pt-2">
            The calculator projects the future financial contribution over the remaining working period.
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">
            It then discounts those future amounts back to today's value.
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">
            The resulting number is your estimated HLV under those assumptions.
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">
            Now change the income growth from 8% to 5%.
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">
            The result will change.
          </p>
          <p className="text-xs text-slate-600 italic">
            That difference is useful because it shows how much the answer depends on your assumptions.
          </p>
        </div>

        {/* Section 11: Does HLV Tell Me How Much Term Insurance I Should Buy? */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-[#222325] flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1dbf73]" />
            Does HLV Tell Me How Much Term Insurance I Should Buy?
          </h3>
          <p className="text-sm text-slate-700 leading-relaxed font-bold">
            Not by itself.
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">
            HLV can give you a useful starting point, but your family's actual requirement may be different.
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">
            For example, a person may have a high HLV but also have substantial savings and existing insurance.
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">
            Another person may have a lower HLV but significant loans and young children who depend on their income.
          </p>
          <p className="text-sm text-slate-700 leading-relaxed font-semibold">
            A proper insurance assessment should look at the whole picture.
          </p>
        </div>

        {/* Section 12: What About Existing Life Insurance? */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-[#222325] flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1dbf73]" />
            What About Existing Life Insurance?
          </h3>
          <p className="text-sm text-slate-700 leading-relaxed">
            Existing insurance does not change your HLV calculation itself.
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">
            It is a separate resource.
          </p>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1 text-xs font-mono">
            <p>Estimated HLV: ₹2 crore</p>
            <p>Existing life cover: ₹75 lakh</p>
          </div>
          <p className="text-sm text-slate-700 leading-relaxed">
            That does not automatically mean you need exactly ₹1.25 crore more insurance.
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">
            Your loans, savings, family expenses and future goals also matter.
          </p>
        </div>

        {/* Section 13: When Should You Recalculate HLV? */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-[#222325] flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1dbf73]" />
            When Should You Recalculate HLV?
          </h3>
          <p className="text-sm text-slate-700 leading-relaxed">
            You don't need to check it every week.
          </p>
          <p className="text-sm text-slate-700 leading-relaxed font-semibold">
            Review it when something meaningful changes:
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-slate-700">
            <li className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">&bull; Your income increases or decreases significantly.</li>
            <li className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">&bull; You get married.</li>
            <li className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">&bull; You have a child.</li>
            <li className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">&bull; You take a large home or personal loan.</li>
            <li className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">&bull; Your expenses change.</li>
            <li className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">&bull; You buy additional life insurance.</li>
            <li className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">&bull; Your retirement plan changes.</li>
            <li className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">&bull; Your savings or investments change significantly.</li>
          </ul>
          <p className="text-xs text-slate-500 italic pt-1">
            A calculation based on an old financial situation may no longer tell you much.
          </p>
        </div>

        {/* Section 14: Is HLV a Guaranteed Number? */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-[#222325] flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1dbf73]" />
            Is HLV a Guaranteed Number?
          </h3>
          <p className="text-sm text-slate-700 leading-relaxed font-bold">
            No.
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">
            HLV depends on assumptions about the future.
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">
            Your actual income growth may be different. Your expenses may change. You may retire earlier or later. Investment returns may not match your assumption.
          </p>
          <p className="text-sm text-slate-700 leading-relaxed font-medium bg-slate-50 p-3 rounded-xl border border-slate-200">
            So treat the result as an estimate for financial planning, not as a promise about your future earnings.
          </p>
        </div>

        {/* Section 15: HLV and Tax in India */}
        <div className="space-y-3 p-5 bg-blue-50/50 rounded-2xl border border-blue-100">
          <h3 className="text-lg font-bold text-[#222325] flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
            HLV and Tax in India
          </h3>
          <p className="text-sm text-slate-700 leading-relaxed">
            For Indian life insurance policies, proceeds may qualify for exemption under Section 10(10D) of the Income Tax Act, subject to the conditions applicable to the policy and the law in force.
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">
            This HLV calculator does not calculate the tax treatment of an insurance policy.
          </p>
          <p className="text-xs font-semibold text-blue-900">
            Check the applicable tax rules for your particular policy before making a financial decision.
          </p>
        </div>

      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-3xl border border-[#e4e5e7] p-6 sm:p-10 shadow-xs space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shrink-0">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-black text-[#222325]">
              Frequently Asked Questions
            </h3>
            <p className="text-xs sm:text-sm text-[#74767e]">
              Common queries on Human Life Value methodology and usage.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <details className="group border border-slate-200 rounded-2xl overflow-hidden bg-[#fafafa]">
            <summary className="p-4 font-bold text-xs sm:text-sm text-[#222325] flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-100 transition-colors list-none">
              <span>What does HLV stand for?</span>
              <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="p-4 pt-3 text-xs sm:text-sm text-[#404145] leading-relaxed border-t border-slate-100 bg-white">
              HLV stands for Human Life Value.
            </div>
          </details>

          <details className="group border border-slate-200 rounded-2xl overflow-hidden bg-[#fafafa]">
            <summary className="p-4 font-bold text-xs sm:text-sm text-[#222325] flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-100 transition-colors list-none">
              <span>What does Human Life Value mean?</span>
              <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="p-4 pt-3 text-xs sm:text-sm text-[#404145] leading-relaxed border-t border-slate-100 bg-white">
              It is an estimate of the present value of a person's future financial contribution.
            </div>
          </details>

          <details className="group border border-slate-200 rounded-2xl overflow-hidden bg-[#fafafa]">
            <summary className="p-4 font-bold text-xs sm:text-sm text-[#222325] flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-100 transition-colors list-none">
              <span>Is HLV the same as net worth?</span>
              <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="p-4 pt-3 text-xs sm:text-sm text-[#404145] leading-relaxed border-t border-slate-100 bg-white">
              No. Net worth looks at assets and liabilities you have today. HLV looks at the estimated economic value of future financial contributions.
            </div>
          </details>

          <details className="group border border-slate-200 rounded-2xl overflow-hidden bg-[#fafafa]">
            <summary className="p-4 font-bold text-xs sm:text-sm text-[#222325] flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-100 transition-colors list-none">
              <span>Is HLV the same as life insurance cover?</span>
              <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="p-4 pt-3 text-xs sm:text-sm text-[#404145] leading-relaxed border-t border-slate-100 bg-white">
              No. HLV estimates economic value. Life insurance cover is the amount payable under an insurance policy, subject to its terms and conditions.
            </div>
          </details>

          <details className="group border border-slate-200 rounded-2xl overflow-hidden bg-[#fafafa]">
            <summary className="p-4 font-bold text-xs sm:text-sm text-[#222325] flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-100 transition-colors list-none">
              <span>Does a higher salary increase HLV?</span>
              <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="p-4 pt-3 text-xs sm:text-sm text-[#404145] leading-relaxed border-t border-slate-100 bg-white">
              Generally, yes. Higher income can increase the projected future financial contribution.
            </div>
          </details>

          <details className="group border border-slate-200 rounded-2xl overflow-hidden bg-[#fafafa]">
            <summary className="p-4 font-bold text-xs sm:text-sm text-[#222325] flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-100 transition-colors list-none">
              <span>Does income growth increase HLV?</span>
              <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="p-4 pt-3 text-xs sm:text-sm text-[#404145] leading-relaxed border-t border-slate-100 bg-white">
              Generally, yes. A higher assumed growth rate can increase projected future earnings.
            </div>
          </details>

          <details className="group border border-slate-200 rounded-2xl overflow-hidden bg-[#fafafa]">
            <summary className="p-4 font-bold text-xs sm:text-sm text-[#222325] flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-100 transition-colors list-none">
              <span>Does retirement age affect HLV?</span>
              <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="p-4 pt-3 text-xs sm:text-sm text-[#404145] leading-relaxed border-t border-slate-100 bg-white">
              Yes. A later retirement age generally means more earning years, which can increase HLV.
            </div>
          </details>

          <details className="group border border-slate-200 rounded-2xl overflow-hidden bg-[#fafafa]">
            <summary className="p-4 font-bold text-xs sm:text-sm text-[#222325] flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-100 transition-colors list-none">
              <span>Does personal spending reduce HLV?</span>
              <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="p-4 pt-3 text-xs sm:text-sm text-[#404145] leading-relaxed border-t border-slate-100 bg-white">
              It can. If personal expenses are deducted from income to estimate the amount available to dependents, higher personal expenses reduce that contribution.
            </div>
          </details>

          <details className="group border border-slate-200 rounded-2xl overflow-hidden bg-[#fafafa]">
            <summary className="p-4 font-bold text-xs sm:text-sm text-[#222325] flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-100 transition-colors list-none">
              <span>Why does the discount rate matter?</span>
              <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="p-4 pt-3 text-xs sm:text-sm text-[#404145] leading-relaxed border-t border-slate-100 bg-white">
              It converts future money into today's value. A higher discount rate generally produces a lower present value for future earnings.
            </div>
          </details>

          <details className="group border border-slate-200 rounded-2xl overflow-hidden bg-[#fafafa]">
            <summary className="p-4 font-bold text-xs sm:text-sm text-[#222325] flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-100 transition-colors list-none">
              <span>Can I use HLV to decide my term insurance amount?</span>
              <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="p-4 pt-3 text-xs sm:text-sm text-[#404145] leading-relaxed border-t border-slate-100 bg-white">
              You can use it as a starting point, but it should not be the only calculation. Consider your family's expenses, debts, goals, savings and existing insurance as well.
            </div>
          </details>

          <details className="group border border-slate-200 rounded-2xl overflow-hidden bg-[#fafafa]">
            <summary className="p-4 font-bold text-xs sm:text-sm text-[#222325] flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-100 transition-colors list-none">
              <span>Does existing insurance reduce HLV?</span>
              <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="p-4 pt-3 text-xs sm:text-sm text-[#404145] leading-relaxed border-t border-slate-100 bg-white">
              No. Existing insurance is separate from HLV. It can be considered when working out the remaining protection requirement.
            </div>
          </details>

          <details className="group border border-slate-200 rounded-2xl overflow-hidden bg-[#fafafa]">
            <summary className="p-4 font-bold text-xs sm:text-sm text-[#222325] flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-100 transition-colors list-none">
              <span>Should I recalculate my HLV?</span>
              <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="p-4 pt-3 text-xs sm:text-sm text-[#404145] leading-relaxed border-t border-slate-100 bg-white">
              Yes, when your financial or family situation changes significantly.
            </div>
          </details>

          <details className="group border border-slate-200 rounded-2xl overflow-hidden bg-[#fafafa]">
            <summary className="p-4 font-bold text-xs sm:text-sm text-[#222325] flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-100 transition-colors list-none">
              <span>Is this an insurance premium calculator?</span>
              <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="p-4 pt-3 text-xs sm:text-sm text-[#404145] leading-relaxed border-t border-slate-100 bg-white">
              No. It estimates financial value. It does not calculate an insurer's premium or underwriting decision.
            </div>
          </details>

          <details className="group border border-slate-200 rounded-2xl overflow-hidden bg-[#fafafa]">
            <summary className="p-4 font-bold text-xs sm:text-sm text-[#222325] flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-100 transition-colors list-none">
              <span>Are the calculator results guaranteed?</span>
              <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="p-4 pt-3 text-xs sm:text-sm text-[#404145] leading-relaxed border-t border-slate-100 bg-white">
              No. The result depends on the assumptions you enter.
            </div>
          </details>
        </div>
      </div>

      {/* Important Note Footer Card */}
      <div className="p-6 bg-amber-50/80 border border-amber-200 rounded-3xl space-y-2">
        <h4 className="text-sm font-bold text-amber-900 flex items-center gap-2">
          <Info className="w-4 h-4 text-amber-700" />
          Important Note
        </h4>
        <p className="text-xs sm:text-sm text-amber-900/90 leading-relaxed">
          This calculator provides an illustrative estimate based on the information and assumptions you enter.
        </p>
        <p className="text-xs sm:text-sm text-amber-900/90 leading-relaxed">
          It is a financial-planning tool, not an insurer's underwriting, premium-pricing or policy-approval system.
        </p>
        <p className="text-xs sm:text-sm text-amber-900/90 leading-relaxed">
          Don't choose an insurance policy based on one number alone. Look at your family's actual expenses, liabilities, goals, assets and existing protection before making a decision.
        </p>
        <p className="text-xs font-bold text-amber-950 pt-1">
          Best practice: run the calculator with a few different assumptions and see how much the result changes.
        </p>
      </div>

    </div>
  );
};
