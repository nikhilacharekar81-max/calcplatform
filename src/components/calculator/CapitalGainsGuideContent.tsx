import React from 'react';
import { BookOpen } from 'lucide-react';

export const CapitalGainsGuideContent: React.FC = () => {
  return (
    <div className="space-y-12 font-sans text-[#404145] leading-relaxed">
      {/* Section 1: Overview */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <h2 className="text-2xl font-black text-[#222325]">
          India Capital Gains Tax Calculator & Portfolio Simulator
        </h2>
        <p className="text-sm sm:text-base text-[#62646a] leading-relaxed">
          Direct taxation on Indian capital assets demands strict precision. Liquidating equity portfolios, offloading commercial real estate, shifting mutual fund holdings, or selling gold requires calculating exact tax obligations under current tax provisions.
        </p>
        <p className="text-sm sm:text-base text-[#62646a] leading-relaxed">
          This technical guide breaks down the computational architecture behind the India Capital Gains Tax Calculator. Built for taxpayers and financial practitioners, the engine processes Short-Term Capital Gains (STCG) and Long-Term Capital Gains (LTCG), statutory tax rates, Section 112A grandfathering rules, and multi-year loss set-offs.
        </p>
      </div>

      {/* Section 2: Core Interactive Tool */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <h3 className="text-xl font-extrabold text-[#222325]">
          2. Multi-Asset Classification Engine
        </h3>
        <p className="text-sm text-[#62646a]">
          Every asset class operates under distinct statutory holding thresholds and tax schedules:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-sm text-[#62646a]">
          <li><strong>Listed Equity Shares & Equity Mutual Funds:</strong> Subjected to Securities Transaction Tax (STT) upon realization.</li>
          <li><strong>Real Estate (Land & Building):</strong> Governed by immovable property duration rules.</li>
          <li><strong>Debt Mutual Funds:</strong> Regulated under Section 50AA amendments.</li>
          <li><strong>Unlisted Securities:</strong> Taxed under separate private share transfers.</li>
          <li><strong>Gold & Jewelry:</strong> Classified as physical capital holdings.</li>
        </ul>
        <p className="text-sm text-[#62646a]">
          The validator cross-references transaction dates against statutory holding limits to determine short-term versus long-term status instantly.
        </p>
      </div>

      {/* Section 3: Transaction Parameters */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <h3 className="text-xl font-extrabold text-[#222325]">
          3. Acquisition & Transfer Parameters
        </h3>
        <p className="text-sm text-[#62646a]">
          Calculating capital gains requires specific financial inputs to establish cost basis:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-sm text-[#62646a]">
          <li><strong>Purchase Date & Sale Date:</strong> Primary inputs for holding period calculations.</li>
          <li><strong>Consideration Value:</strong> Gross sale price agreed upon during transaction.</li>
          <li><strong>Transfer Expenses:</strong> Deductible outlays including brokerage fees, legal documentation, and stamp duty.</li>
          <li><strong>Improvement Costs:</strong> Capital expenditures incurred for structural additions or permanent asset upgrades.</li>
        </ul>
      </div>

      {/* Section 4: July 23, 2024 Real Estate Pivot */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <h3 className="text-xl font-extrabold text-[#222325]">
          4. July 23, 2024 Real Estate Amendment & Dual-Option Engine
        </h3>
        <p className="text-sm text-[#62646a]">
          Budget amendments restructured immovable property tax schedules based on acquisition dates:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-sm text-[#62646a]">
          <li><strong>Acquired On or After July 23, 2024:</strong> Taxed flat at 12.5% without indexation benefits.</li>
          <li><strong>Acquired Before July 23, 2024:</strong> Resident individuals and HUFs get a dual-option comparison:
            <ul className="list-disc pl-5 mt-1 space-y-1">
              <li><strong>Option A:</strong> Flat 12.5% tax without indexation.</li>
              <li><strong>Option B:</strong> 20% tax applying Cost Inflation Index (CII) adjustments to purchase and improvement costs.</li>
            </ul>
          </li>
          <li><strong>Automatic Selection:</strong> The engine selects whichever option yields lower tax liability.</li>
        </ul>
      </div>

      {/* Section 5: Section 112A Grandfathering */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <h3 className="text-xl font-extrabold text-[#222325]">
          5. Section 112A Equity Grandfathering
        </h3>
        <p className="text-sm text-[#62646a]">
          Listed equities and equity mutual funds acquired before January 31, 2018 benefit from grandfathering protection.
        </p>
        <p className="text-sm text-[#62646a]">
          Inputting the January 31, 2018 Fair Market Value (FMV) triggers the statutory formula: Cost of Acquisition equals the higher of actual purchase price or the lower of Jan 31, 2018 FMV and full sale consideration. Only gains exceeding the ₹1,25,000 annual exemption limit incur 12.5% tax.
        </p>
      </div>

      {/* Section 6: Capital Losses */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <h3 className="text-xl font-extrabold text-[#222325]">
          6. Loss Set-Off & 8-Year Carry-Forward Rules
        </h3>
        <p className="text-sm text-[#62646a]">
          Capital losses follow strict set-off hierarchies under the Income Tax Act:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-sm text-[#62646a]">
          <li><strong>Long-Term Capital Losses (LTCL):</strong> Offsets Long-Term Capital Gains exclusively.</li>
          <li><strong>Short-Term Capital Losses (STCL):</strong> Offsets both Short-Term and Long-Term Capital Gains.</li>
          <li><strong>Carry-Forward Limit:</strong> Unabsorbed losses can be carried forward up to 8 assessment years provided tax returns are filed within due dates.</li>
        </ul>
      </div>

      {/* Section 7: Reinvestment Exemptions */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <h3 className="text-xl font-extrabold text-[#222325]">
          7. Section 54, 54F, and 54EC Reinvestment Exemption Engine
        </h3>
        <p className="text-sm text-[#62646a]">
          Reinvesting capital gains reduces total taxable gains under statutory exemption sections:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-sm text-[#62646a]">
          <li><strong>Section 54 & 54F:</strong> Deductions for capital gains invested into residential house construction or acquisition within prescribed timeframes.</li>
          <li><strong>Section 54EC:</strong> Investments in notified infrastructure bonds (NHAI, REC) capped at ₹50 lakhs per financial year with a mandatory 5-year lock-in period.</li>
        </ul>
      </div>

      {/* Section 10: Reference Table */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-6">
        <h3 className="text-xl font-extrabold text-[#222325]">
          8. Asset Class Tax Rate Reference Table
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-200">
                <th className="p-3.5">Asset Class</th>
                <th className="p-3.5">Section</th>
                <th className="p-3.5">Holding Period</th>
                <th className="p-3.5">Tax Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[#404145]">
              <tr>
                <td className="p-3.5 font-bold">Listed Equity / Equity MFs</td>
                <td className="p-3.5">Sec 111A / 112A</td>
                <td className="p-3.5">STCG: ≤ 12 Months<br />LTCG: &gt; 12 Months</td>
                <td className="p-3.5">STCG: 20%<br />LTCG: 12.5% (above ₹1.25L exemption)</td>
              </tr>
              <tr>
                <td className="p-3.5 font-bold">Real Estate (Land & Building)</td>
                <td className="p-3.5">Sec 112 / 112A</td>
                <td className="p-3.5">STCG: ≤ 24 Months<br />LTCG: &gt; 24 Months</td>
                <td className="p-3.5">STCG: Slab Rates<br />LTCG: 12.5% (Post-July 2024) or Dual Option (Pre-July 2024)</td>
              </tr>
              <tr>
                <td className="p-3.5 font-bold">Debt Mutual Funds</td>
                <td className="p-3.5">Sec 50AA</td>
                <td className="p-3.5">N/A</td>
                <td className="p-3.5">Taxed at regular income slab rates as STCG</td>
              </tr>
              <tr>
                <td className="p-3.5 font-bold">Unlisted Shares</td>
                <td className="p-3.5">Sec 112</td>
                <td className="p-3.5">STCG: ≤ 24 Months<br />LTCG: &gt; 24 Months</td>
                <td className="p-3.5">STCG: Slab Rates<br />LTCG: 12.5% without indexation</td>
              </tr>
              <tr>
                <td className="p-3.5 font-bold">Gold & Jewelry</td>
                <td className="p-3.5">Sec 112</td>
                <td className="p-3.5">STCG: ≤ 24 Months<br />LTCG: &gt; 24 Months</td>
                <td className="p-3.5">STCG: Slab Rates<br />LTCG: 12.5% without indexation</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQs */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-6">
        <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
          <div className="w-8 h-8 rounded-lg bg-[#f4fdf8] text-[#1dbf73] flex items-center justify-center border border-[#d8f5e5] shrink-0">
            <BookOpen className="w-4 h-4" />
          </div>
          <h3 className="text-lg font-bold text-[#222325]">
            Frequently Asked Questions
          </h3>
        </div>

        <div className="space-y-3">
          {[
            {
              q: 'What distinguishes Short-Term from Long-Term Capital Gains?',
              a: 'Short-term gains occur when assets are sold within holding thresholds (12 months for listed equity, 24 months for real estate and gold). Long-term gains apply when holdings exceed these durations.',
            },
            {
              q: 'How does the July 23, 2024 real estate tax rule affect earlier purchases?',
              a: 'Properties acquired before July 23, 2024 allow resident taxpayers to choose between 12.5% without indexation (Option A) or 20% with Cost Inflation Indexation (Option B), whichever gives a lower tax output. Post-July 23 acquisitions strictly incur 12.5% without indexation.',
            },
            {
              q: 'How is Section 112A grandfathering calculated for equity?',
              a: 'For equity bought before January 31, 2018, cost of acquisition equals the higher of actual purchase price or the lower of Jan 31, 2018 FMV and full sale value.',
            },
            {
              q: 'What is the LTCG exemption threshold on listed equities?',
              a: 'Under Section 112A, long-term capital gains on listed shares and equity funds are exempt up to ₹1,25,000 per financial year. Amounts above ₹1,25,000 incur 12.5% tax.',
            },
            {
              q: 'Can capital losses offset capital gains?',
              a: 'Long-term capital losses offset long-term gains only. Short-term losses offset both short-term and long-term gains. Unused losses carry forward up to 8 years if returns are filed on time.',
            },
            {
              q: 'How are debt mutual funds taxed under Section 50AA?',
              a: 'Specified debt funds acquired on or after April 1, 2023 lose long-term tax status and indexation benefits. All gains are treated as short-term capital gains taxed at applicable slab rates.',
            },
            {
              q: 'Does Section 87A rebate apply to capital gains?',
              a: 'Section 87A rebates cannot reduce tax liabilities arising from special-rate capital gains under Section 111A or Section 112A.',
            },
            {
              q: 'What is the maximum surcharge on equity capital gains?',
              a: 'Surcharge on capital gains from listed equities and equity funds under Section 111A and Section 112A is capped at 15%.',
            },
            {
              q: 'Which property improvement expenses qualify for capital gains adjustments?',
              a: 'Only capital structural improvements (room additions, structural modifications) qualify. Routine maintenance and painting are excluded.',
            },
            {
              q: 'How are bonus shares taxed?',
              a: 'Bonus shares have an acquisition cost of ₹0. Holding period begins on allotment date, making the full sale price taxable capital gains.',
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
    </div>
  );
};
