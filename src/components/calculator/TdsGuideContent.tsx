import React from 'react';
import {
  BookOpen,
  Layers,
  ShieldAlert,
  FileCheck2,
  Calendar,
  Building,
  Coins,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  TrendingDown,
  Info,
  Receipt,
  FileSpreadsheet,
  CheckSquare,
  AlertTriangle,
} from 'lucide-react';

export const TdsGuideContent: React.FC = () => {
  return (
    <div className="w-full space-y-8 font-sans text-[#222325]">
      {/* 1. INTRODUCTION: NAVIGATING TDS COMPLIANCE IN FY 2026-27 */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 text-xs font-bold text-[#1dbf73] uppercase tracking-wider">
          <BookOpen className="w-4 h-4" />
          <span>Statutory Compliance Guide &bull; FY 2026-27 (AY 2027-28)</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#222325] tracking-tight">
          Introduction: Navigating TDS Compliance in FY 2026-27
        </h2>

        <p className="text-sm sm:text-base text-[#404145] leading-relaxed">
          Tax Deducted at Source (TDS) is an essential pillar of direct tax collection in India. Under the Income Tax Act, a person (deductor) responsible for making specified payments to another person (deductee) must withhold a fixed percentage of tax at the time of credit or actual payment—whichever occurs earlier—and remit it to the government.
        </p>

        <p className="text-xs sm:text-sm text-[#404145] leading-relaxed">
          For <strong>Financial Year (FY) 2026-27 (Assessment Year 2027-28)</strong>, staying compliant requires tracking statutory updates, managing distinct threshold limits across sections like 194C, 194J, and 194I, and accounting for mandatory higher deduction penalties when Permanent Account Number (PAN) details are missing. Manual calculations across large volumes of vendor invoices introduce severe risks of short-deduction notices, <strong>30% expense disallowances</strong> under corporate tax provisions, and compounding interest penalties. Implementing a reliable, automated online TDS calculator ensures financial accuracy and streamlined accounts payable workflows.
        </p>
      </section>

      {/* 2. CORE MECHANICS OF AN ONLINE TDS CALCULATOR */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-[#1dbf73]" />
          <h3 className="text-lg sm:text-xl font-bold text-[#222325]">
            Core Mechanics of an Online TDS Calculator
          </h3>
        </div>

        <p className="text-xs sm:text-sm text-[#404145] leading-relaxed">
          An effective online TDS calculator is built on a structured logical engine that processes four fundamental parameters before generating tax liability outputs:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
            <div className="w-7 h-7 rounded-full bg-[#1dbf73] text-white text-xs font-bold flex items-center justify-center">
              1
            </div>
            <h4 className="text-xs font-bold text-[#222325]">Payment Category Selection</h4>
            <p className="text-[11px] text-[#62646a] leading-relaxed">
              The user selects the nature of the transaction, which instantly maps the background code to the appropriate statutory section (e.g., professional fees, rent, or contractor payments).
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
            <div className="w-7 h-7 rounded-full bg-[#1dbf73] text-white text-xs font-bold flex items-center justify-center">
              2
            </div>
            <h4 className="text-xs font-bold text-[#222325]">Threshold Evaluation Engine</h4>
            <p className="text-[11px] text-[#62646a] leading-relaxed">
              The system checks whether the transaction crosses the statutory limit, distinguishing between single-invoice caps and aggregate financial year limits.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
            <div className="w-7 h-7 rounded-full bg-[#1dbf73] text-white text-xs font-bold flex items-center justify-center">
              3
            </div>
            <h4 className="text-xs font-bold text-[#222325]">Entity & Compliance Status</h4>
            <p className="text-[11px] text-[#62646a] leading-relaxed">
              Evaluates whether the payee is an Individual/HUF or a corporate entity, and checks if a valid PAN has been supplied to prevent Section 206AA penalties.
            </p>
          </div>

          <div className="p-4 bg-[#f4fdf8] rounded-2xl border border-[#d8f5e5] space-y-1.5">
            <div className="w-7 h-7 rounded-full bg-[#1dbf73] text-white text-xs font-bold flex items-center justify-center">
              4
            </div>
            <h4 className="text-xs font-bold text-[#1dbf73]">Dynamic Net Payable Computation</h4>
            <p className="text-[11px] text-[#404145] leading-relaxed">
              Computes the exact withholding tax amount and displays the net balance due to the vendor alongside compliance status flags.
            </p>
          </div>
        </div>
      </section>

      {/* 3. MASTER REFERENCE TABLE: KEY TDS SECTIONS, RATES, AND THRESHOLDS (FY 2026-27) */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-[#1dbf73]" />
            <h3 className="text-lg sm:text-xl font-bold text-[#222325]">
              Master Reference Table: Key TDS Sections, Rates, and Thresholds (FY 2026-27)
            </h3>
          </div>
          <span className="text-xs font-bold text-[#1dbf73] bg-[#f4fdf8] px-3 py-1 rounded-full border border-[#d8f5e5]">
            FY 2026-27 / AY 2027-28
          </span>
        </div>

        <p className="text-xs sm:text-sm text-[#404145] leading-relaxed">
          The following reference matrix outlines the core resident payment categories, active rates, and statutory thresholds applicable for FY 2026-27:
        </p>

        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-800 font-extrabold border-b border-slate-200">
                <th className="p-3.5">Section</th>
                <th className="p-3.5">Nature of Payment / Transaction</th>
                <th className="p-3.5">Threshold Limit (FY 2026-27)</th>
                <th className="p-3.5">Standard TDS Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[#404145]">
              <tr className="hover:bg-slate-50/80">
                <td className="p-3.5 font-bold text-[#1dbf73]">194C</td>
                <td className="p-3.5">Payment to Contractors / Sub-contractors</td>
                <td className="p-3.5">₹30,000 (single) or ₹1,00,000 (aggregate FY)</td>
                <td className="p-3.5 font-semibold">1% (Individual/HUF), 2% (Others)</td>
              </tr>
              <tr className="hover:bg-slate-50/80">
                <td className="p-3.5 font-bold text-[#1dbf73]">194J(a)</td>
                <td className="p-3.5">Technical Services, Call Centres, Royalty (Films)</td>
                <td className="p-3.5">₹50,000 per financial year</td>
                <td className="p-3.5 font-semibold">2%</td>
              </tr>
              <tr className="hover:bg-slate-50/80">
                <td className="p-3.5 font-bold text-[#1dbf73]">194J(b)</td>
                <td className="p-3.5">Professional Services, Other Royalties, Directors' Fees</td>
                <td className="p-3.5">₹50,000 per financial year (None for Directors' fees)</td>
                <td className="p-3.5 font-semibold">10%</td>
              </tr>
              <tr className="hover:bg-slate-50/80">
                <td className="p-3.5 font-bold text-[#1dbf73]">194I(a)</td>
                <td className="p-3.5">Rent on Plant, Machinery, and Equipment</td>
                <td className="p-3.5">₹50,000 per month (₹2,40,000/year)</td>
                <td className="p-3.5 font-semibold">2%</td>
              </tr>
              <tr className="hover:bg-slate-50/80">
                <td className="p-3.5 font-bold text-[#1dbf73]">194I(b)</td>
                <td className="p-3.5">Rent on Land, Building, Furniture, and Fittings</td>
                <td className="p-3.5">₹50,000 per month (₹2,40,000/year)</td>
                <td className="p-3.5 font-semibold">10%</td>
              </tr>
              <tr className="hover:bg-slate-50/80">
                <td className="p-3.5 font-bold text-[#1dbf73]">194H</td>
                <td className="p-3.5">Commission or Brokerage (Non-Insurance)</td>
                <td className="p-3.5">₹20,000 per financial year</td>
                <td className="p-3.5 font-semibold">2%</td>
              </tr>
              <tr className="hover:bg-slate-50/80">
                <td className="p-3.5 font-bold text-[#1dbf73]">194A</td>
                <td className="p-3.5">Interest other than Securities (Regular vs. Senior Citizens)</td>
                <td className="p-3.5">₹50,000 (Regular) / ₹1,00,000 (Senior Citizens)</td>
                <td className="p-3.5 font-semibold">10%</td>
              </tr>
              <tr className="hover:bg-slate-50/80">
                <td className="p-3.5 font-bold text-[#1dbf73]">194Q</td>
                <td className="p-3.5">Purchase of Goods from Resident Sellers</td>
                <td className="p-3.5">₹50,000,000 (Buyer turnover &gt; ₹10 Cr)</td>
                <td className="p-3.5 font-semibold">0.10% (on excess above ₹50L)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 4. DECODING COMPLEX THRESHOLD RULES: SINGLE VS. AGGREGATE LIMITS */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-[#1dbf73]" />
          <h3 className="text-lg sm:text-xl font-bold text-[#222325]">
            Decoding Complex Threshold Rules: Single vs. Aggregate Limits
          </h3>
        </div>

        <p className="text-xs sm:text-sm text-[#404145] leading-relaxed">
          A frequent point of confusion in automated TDS calculation is distinguishing between single-invoice thresholds and cumulative financial year thresholds:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <span className="text-xs font-bold text-[#222325] block">
              Single-Transaction vs. Aggregate Thresholds (Section 194C)
            </span>
            <p className="text-xs text-[#62646a] leading-relaxed">
              Under provisions like Section 194C, a transaction is evaluated based on whether an individual invoice exceeds <strong>₹30,000</strong> or whether the total aggregate payments across the financial year exceed <strong>₹1,00,000</strong>. If multiple small invoices are processed (e.g., four bills of ₹26,000 each), crossing the ₹1,00,000 cumulative aggregate limit retroactively triggers tax withholding requirements on the cumulative sum.
            </p>
          </div>

          <div className="p-5 bg-[#f4fdf8] rounded-2xl border border-[#d8f5e5] space-y-2">
            <span className="text-xs font-bold text-[#1dbf73] block">
              Monthly Thresholds (Section 194I / 194-IB)
            </span>
            <p className="text-xs text-[#404145] leading-relaxed">
              Sections governing rental payments apply a monthly evaluation limit of <strong>₹50,000</strong>. If monthly rent stays at ₹48,000, no TDS is due under Section 194-IB; if it scales to ₹55,000 per month, tax applies to the gross monthly sum.
            </p>
          </div>
        </div>
      </section>

      {/* 5. THE MISSING PAN PENALTY CLAUSE (SECTION 206AA) */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-rose-700">
          <ShieldAlert className="w-5 h-5" />
          <h3 className="text-lg sm:text-xl font-bold text-[#222325]">
            The Missing PAN Penalty Clause (Section 206AA)
          </h3>
        </div>

        <p className="text-xs sm:text-sm text-[#404145] leading-relaxed">
          Compliance automation must account for payee identification integrity. If a deductee fails to furnish a valid Permanent Account Number (PAN) to the deductor, standard tax rates are superseded by statutory penalty rules.
        </p>

        <div className="p-5 bg-rose-50/70 rounded-2xl border border-rose-200 space-y-2">
          <span className="text-xs font-bold text-rose-950 block">
            Automatic Rate Escalation to 20%
          </span>
          <p className="text-xs text-rose-900 leading-relaxed">
            Under <strong>Section 206AA</strong>, the TDS rate automatically escalates to <strong>20%</strong> (or the highest applicable rate specified under the relevant section, whichever is higher). An online calculator must feature an explicit compliance toggle (<em>"Is PAN Furnished?"</em>) to trigger this override automatically, preventing costly short-deduction liabilities for the business.
          </p>
        </div>
      </section>

      {/* 6. HANDLING GST IN TDS CALCULATIONS: CORE ACCOUNTING PRACTICE */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-[#222325]">
          <Receipt className="w-5 h-5 text-[#1dbf73]" />
          <h3 className="text-lg sm:text-xl font-bold">
            Handling GST in TDS Calculations: Core Accounting Practice
          </h3>
        </div>

        <p className="text-xs sm:text-sm text-[#404145] leading-relaxed">
          When calculating withholding tax on invoices that include Goods and Services Tax (GST), proper tax base isolation is critical (as clarified by CBDT Circular No. 23/2017):
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <div className="p-5 bg-[#f4fdf8] rounded-2xl border border-[#d8f5e5] space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#1dbf73]">
              <CheckCircle2 className="w-4 h-4" />
              <span>Separate Invoice Breakdown (Standard Rule)</span>
            </div>
            <p className="text-xs text-[#404145] leading-relaxed">
              When the invoice clearly itemizes the base service fee and the GST component (CGST/SGST/IGST) separately, <strong>TDS is computed strictly on the base taxable amount excluding GST</strong>.
            </p>
          </div>

          <div className="p-5 bg-amber-50/60 rounded-2xl border border-amber-200 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
              <AlertTriangle className="w-4 h-4" />
              <span>Composite Invoices (Lump-Sum)</span>
            </div>
            <p className="text-xs text-amber-800 leading-relaxed">
              If an invoice presents a single lump-sum figure without segregating taxes, withholding tax must generally be calculated on the total gross invoice value unless specific contractual clarifications apply. Web calculators should incorporate helper notes advising users to input pre-tax amounts for accurate computations.
            </p>
          </div>
        </div>
      </section>

      {/* 7. SPECIAL PROVISIONS & MODERN SECTIONS (194R, 194S, 194T) */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Coins className="w-5 h-5 text-amber-500" />
          <h3 className="text-lg sm:text-xl font-bold text-[#222325]">
            Special Provisions & Modern Sections (194R, 194S, 194T)
          </h3>
        </div>

        <p className="text-xs sm:text-sm text-[#404145] leading-relaxed">
          Modern business ecosystems involve diverse transaction types that are fully incorporated into contemporary compliance calculators:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <span className="text-xs font-bold text-[#222325] block">
              Section 194R (Perquisites and Benefits)
            </span>
            <p className="text-xs text-[#62646a] leading-relaxed">
              Imposes a <strong>10% TDS</strong> on the value of any benefit or perquisite (whether convertible to money or not) arising from business or professional operations, crossing a <strong>₹20,000</strong> annual limit.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <span className="text-xs font-bold text-[#222325] block">
              Section 194S (Virtual Digital Assets)
            </span>
            <p className="text-xs text-[#62646a] leading-relaxed">
              Mandates a <strong>1% TDS</strong> on transfer consideration involving crypto or VDAs exceeding <strong>₹10,000</strong> (or ₹50,000 for specified persons).
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <span className="text-xs font-bold text-[#222325] block">
              Section 194T (Partnership Remuneration)
            </span>
            <p className="text-xs text-[#62646a] leading-relaxed">
              Applies a <strong>10% TDS</strong> on salary, bonus, commission, or interest payments made by a partnership firm to its partners once cumulative payments exceed <strong>₹20,000</strong> in a financial year.
            </p>
          </div>
        </div>
      </section>

      {/* 8. CONCLUSION & BEST PRACTICES FOR WEB INTEGRATION */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-[#1dbf73]">
          <CheckSquare className="w-5 h-5" />
          <h3 className="text-lg sm:text-xl font-bold text-[#222325]">
            Conclusion & Best Practices for Web Integration
          </h3>
        </div>

        <p className="text-xs sm:text-sm text-[#404145] leading-relaxed">
          Building an accurate online TDS calculator for FY 2026-27 requires balancing rigorous tax logic with an intuitive user experience. Developers and finance teams must ensure that calculation modules dynamically handle section-specific splits (such as separating technical services at 2% from professional consultancy at 10% under Section 194J), integrate PAN default overrides, and provide clean print-ready summaries for accounting reconciliation.
        </p>

        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 leading-relaxed">
          <strong>Disclaimer:</strong> Always cross-verify figures and specific contractual terms against official Central Board of Direct Taxes (CBDT) circulars and statutory notifications before finalizing statutory tax deduction returns and challan payments.
        </div>
      </section>
    </div>
  );
};
