import React from 'react';
import { BookOpen, ShieldAlert, CheckCircle2 } from 'lucide-react';

export const HraGuideContent: React.FC = () => {
  return (
    <div className="space-y-12 font-sans text-[#404145] leading-relaxed">
      {/* Section 1: Overview */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <h2 className="text-2xl font-black text-[#222325]">
          1. Mastering Your House Rent Allowance (HRA): Online Exemption Calculator Guide
        </h2>
        <p className="text-sm sm:text-base text-[#62646a] leading-relaxed">
          House Rent Allowance (HRA) is one of the most substantial components of a salaried individual's compensation structure in India. Under Section 10(13A) of the Income Tax Act, employees living in rented accommodations can claim tax exemptions on a portion of their HRA, significantly lowering their taxable income.
        </p>
        <p className="text-sm sm:text-base text-[#62646a] leading-relaxed">
          However, computing the exact exempt amount manually can be complex due to overlapping statutory rules regarding basic salary proportions, city classifications, and actual rent paid. The online HRA Calculator automates this process instantly, ensuring you claim the maximum permissible tax benefit while maintaining strict compliance.
        </p>
      </div>

      {/* Section 2: How HRA is Calculated */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <h3 className="text-xl font-extrabold text-[#222325]">
          2. How HRA Exemption is Calculated Under Section 10(13A)
        </h3>
        <p className="text-sm text-[#62646a]">
          The Income Tax Department dictates that the exempt HRA is strictly the lowest of the following three parameters:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-sm text-[#62646a]">
          <li><strong>Actual HRA Received:</strong> The total house rent allowance component disbursed by your employer during the financial year.</li>
          <li><strong>Rent Paid Minus 10% of Salary:</strong> The total annual rent you pay to your landlord, minus 10% of your basic salary (inclusive of applicable dearness allowance).</li>
          <li><strong>City Classification Limit:</strong> Either 50% of your salary if you reside in a metro city (Mumbai, Delhi, Kolkata, Chennai) or 40% of your salary if you live in a non-metro city.</li>
        </ul>
        <p className="text-sm text-[#62646a] mt-2">
          Your taxable HRA is simply the remainder after subtracting the exempt HRA from the total HRA received from your employer.
        </p>
      </div>

      {/* Section 3: Key Components */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <h3 className="text-xl font-extrabold text-[#222325]">
          3. Key Components Required for the HRA Calculation
        </h3>
        <p className="text-sm text-[#62646a]">
          To derive accurate results from the calculator, you must gather precise financial figures from your salary slips and rent agreements:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-sm text-[#62646a]">
          <li><strong>Basic Salary:</strong> The fixed foundational component of your compensation. Performance bonuses, special allowances, and commissions are excluded.</li>
          <li><strong>Dearness Allowance (DA):</strong> If your employment terms state that DA forms part of retirement benefits, it is added to the basic salary for computation.</li>
          <li><strong>HRA Received:</strong> The exact annual amount allocated as house rent allowance by your company.</li>
          <li><strong>Actual Rent Paid:</strong> The aggregate annual rent disbursed to the property owner.</li>
        </ul>
      </div>

      {/* Section 4: Metro vs Non-Metro */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <h3 className="text-xl font-extrabold text-[#222325]">
          4. Metro vs. Non-Metro Classification Rules
        </h3>
        <p className="text-sm text-[#62646a]">
          The distinction between metro and non-metro cities plays a vital role in determining your exemption cap.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-sm text-[#62646a]">
          <li><strong>Metro Cities:</strong> Only Mumbai, New Delhi, Kolkata, and Chennai qualify for the 50% salary exemption threshold.</li>
          <li><strong>Non-Metro Cities:</strong> All other urban areas, tier-2, and tier-3 cities across India—including Bengaluru, Hyderabad, Pune, Ahmedabad, and Gurgaon—fall under the 40% exemption limit, regardless of their booming rental markets or metropolitan characteristics.</li>
        </ul>
      </div>

      {/* Section 5: Tax Implications */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <h3 className="text-xl font-extrabold text-[#222325]">
          5. Tax Implications: Old Tax Regime vs. New Tax Regime
        </h3>
        <p className="text-sm text-[#62646a]">
          A vital structural consideration for modern taxpayers is regime selection:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-sm text-[#62646a]">
          <li><strong>Old Tax Regime:</strong> HRA exemption under Section 10(13A) is fully supported, allowing salaried individuals to claim deductions by submitting rent receipts and agreements.</li>
          <li><strong>New Tax Regime:</strong> HRA exemption is not available under the concessional tax regime. Taxpayers opting for the new tax regime forfeit all Section 10(13A) benefits in exchange for lower baseline tax slabs.</li>
        </ul>
      </div>

      {/* Section 6: Mandatory Documentation */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <h3 className="text-xl font-extrabold text-[#222325]">
          6. Mandatory Documentation: Rent Receipts & Landlord PAN Rules
        </h3>
        <p className="text-sm text-[#62646a]">
          To ensure your employer or the tax authorities validate your HRA claim during scrutiny, proper documentation is required:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-sm text-[#62646a]">
          <li><strong>Rent Receipts:</strong> Serialized monthly or annual rent receipts signed by the landlord, bearing revenue stamps where cash payments exceed statutory thresholds.</li>
          <li><strong>Rent Agreement:</strong> A legally stamped leave-and-license agreement specifying the monthly rent, security deposit, and tenant-landlord details.</li>
          <li><strong>Landlord's PAN:</strong> If your total annual rent payment exceeds ₹1,00,000, furnishing your landlord's Permanent Account Number (PAN) is legally mandatory. Failure to provide it will result in the denial of the HRA exemption.</li>
        </ul>
      </div>

      {/* Section 7: Paying Rent to Parents */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <h3 className="text-xl font-extrabold text-[#222325]">
          7. Strategic Scenarios: Paying Rent to Parents
        </h3>
        <p className="text-sm text-[#62646a]">
          Salaried individuals living in a family-owned property can legally claim HRA by paying rent to their parents, provided specific conditions are met:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-sm text-[#62646a]">
          <li><strong>Genuine Tenancy:</strong> There must be a formal rental agreement and regular bank transfers or receipt-backed cash payments from the child's account to the parent's account.</li>
          <li><strong>Parental Income Tax Reporting:</strong> The parent receiving the rent must declare the rental income under "Income from House Property" in their own income tax return, while claiming standard deductions on it. (Note: You cannot pay rent to your spouse and claim HRA).</li>
        </ul>
      </div>

      {/* Section 8: FAQs */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-6">
        <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
          <div className="w-8 h-8 rounded-lg bg-[#f4fdf8] text-[#1dbf73] flex items-center justify-center border border-[#d8f5e5] shrink-0">
            <BookOpen className="w-4 h-4" />
          </div>
          <h3 className="text-lg font-bold text-[#222325]">
            8. Frequently Asked Questions (FAQs)
          </h3>
        </div>

        <div className="space-y-3">
          {[
            {
              q: 'Can I claim both HRA and home loan tax benefits simultaneously?',
              a: 'Yes, if you live in a rented house due to employment reasons in one city while owning a self-occupied or rented property in another city funded by a home loan, you can claim both HRA exemption and home loan interest/principal deductions.',
            },
            {
              q: 'What happens if I forget to submit rent proofs to my employer?',
              a: 'If your employer deducts excess TDS due to missing proof submissions, you can still claim your HRA exemption directly while filing your income tax return (ITR) and claim a refund for the excess tax deducted.',
            },
            {
              q: 'Is PAN mandatory if my monthly rent is less than ₹8,333?',
              a: 'If your total annual rent does not exceed ₹1,00,000 (averaging ₹8,333 per month), the landlord\'s PAN is not mandatory, though maintaining signed rent receipts remains essential.',
            },
            {
              q: 'Can I claim HRA if I do not have a formal rental agreement?',
              a: 'While rent receipts and bank transfer trails can sometimes suffice, having a stamped rental agreement is highly recommended to substantiate your claim against tax scrutiny.',
            },
            {
              q: 'How is HRA calculated if I changed apartments or cities mid-year?',
              a: 'The calculator allows you to compute exemptions on a prorated monthly basis by splitting your calculation periods according to different rent amounts or city classifications.',
            },
            {
              q: 'Does the HRA exemption apply if I live in my own house?',
              a: 'No, HRA exemption is only available if you are paying actual rent for a property that you do not own. If you live in your own house, no HRA tax benefit can be claimed.',
            },
            {
              q: 'Are maintenance charges and utility bills included in rent calculations?',
              a: 'Only the core rent paid for occupying the property qualifies for HRA calculations. Separate utility bills, electricity charges, and maintenance fees paid to a society cannot be included.',
            },
            {
              q: 'Can I claim HRA if I receive a consolidated salary without a specific HRA component?',
              a: 'No, to claim an exemption under Section 10(13A), HRA must be explicitly designated as a distinct component of your salary structure breakdown.',
            },
            {
              q: 'What is the maximum HRA exemption limit under the law?',
              a: 'There is no absolute monetary cap on HRA exemption; the exempt amount is determined entirely by your basic salary, actual rent paid, and city classification limits.',
            },
            {
              q: 'Can I claim HRA during notice periods or sabbatical leave?',
              a: 'You can claim HRA for the exact months you were actively employed and incurred rental expenses. Months without salary or employment do not qualify for HRA exemptions.',
            },
          ].map((faq, idx) => (
            <details
              key={idx}
              open={true}
              className="group border border-slate-200 rounded-2xl overflow-hidden bg-[#fafafa]"
            >
              <summary className="p-4 font-bold text-xs sm:text-sm text-[#222325] flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-100 transition-colors list-none">
                <span>{idx + 1}. {faq.q}</span>
                <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="p-4 pt-0 text-xs sm:text-sm text-[#62646a] leading-relaxed border-t border-slate-200/60 bg-white">
                {faq.a}
              </div>
            </details>
          ))}
        </div>
      </div>

      {/* Legal Disclaimer */}
      <div className="bg-slate-50 rounded-3xl border border-slate-200 p-6 sm:p-8 text-xs text-slate-500 space-y-2">
        <div className="font-bold text-[#222325]">Legal Disclaimer & Official Verification Notice</div>
        <p>
          This calculator and guide are designed for estimation, educational simulation, and tax planning purposes only. Tax regulations are subject to legislative updates and individual financial circumstances vary. Users are strongly advised to verify all computed exemption figures and documentation requirements with a qualified Chartered Accountant (CA) or official CBDT Income Tax Department portals prior to filing official Income Tax Returns (ITR).
        </p>
      </div>
    </div>
  );
};
