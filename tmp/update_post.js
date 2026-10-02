const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'data/db.json');
const backupPath = path.join(__dirname, 'data/db_backup.json');
const serverPath = path.join(__dirname, 'server.ts');

const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

const newHtml = `<div class="my-8 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-emerald-50/90 via-teal-50/40 to-slate-50 border border-emerald-200/80 shadow-xs space-y-4">
  <div class="flex items-center gap-3">
    <span class="inline-flex items-center justify-center px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-[#1dbf73] text-white shadow-3xs">
      Executive Summary
    </span>
    <span class="text-xs font-bold text-slate-500">Essential Financial Literacy Guide</span>
  </div>
  <h3 class="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
    Don't Get Fooled by "Headline Interest Rates": APR Reveals the True Cost of Your Loan
  </h3>
  <p class="text-slate-700 text-sm sm:text-base leading-relaxed">
    When comparing loan offers from banks and NBFCs, picking the lowest stated interest rate can cost you tens of thousands of rupees in hidden processing fees, documentation charges, and insurance premiums. <strong>Annual Percentage Rate (APR)</strong> combines interest plus all upfront fees into one annual percentage, giving you the only true apple-to-apples metric to identify the cheapest loan.
  </p>
  
  <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
    <div class="p-4 rounded-2xl bg-white border border-emerald-100 shadow-3xs text-center sm:text-left">
      <div class="text-xs font-bold text-slate-400 uppercase tracking-wider">Interest Rate</div>
      <div class="text-lg font-black text-slate-900 mt-1">Cost of Principal</div>
      <p class="text-xs text-slate-500 mt-0.5">Excludes fees & processing costs</p>
    </div>
    <div class="p-4 rounded-2xl bg-white border border-emerald-200 shadow-3xs text-center sm:text-left">
      <div class="text-xs font-bold text-[#1dbf73] uppercase tracking-wider">APR Metric</div>
      <div class="text-lg font-black text-[#1dbf73] mt-1">True Annual Cost</div>
      <p class="text-xs text-slate-500 mt-0.5">Interest + Fees + Mandates</p>
    </div>
    <div class="p-4 rounded-2xl bg-white border border-emerald-100 shadow-3xs text-center sm:text-left">
      <div class="text-xs font-bold text-slate-400 uppercase tracking-wider">RBI Mandate</div>
      <div class="text-lg font-black text-slate-900 mt-1">Key Facts Statement</div>
      <p class="text-xs text-slate-500 mt-0.5">Mandatory disclosure for all loans</p>
    </div>
  </div>
</div>

<h2>Interest Rate vs. APR: Understanding the Fundamental Difference</h2>
<p>
  When you apply for a personal loan, home loan, or car loan, lenders showcase advertised interest rates on billboards and ads. However, what you actually pay out of pocket involves additional fees that increase your total borrowing burden.
</p>

<!-- Side-by-Side Comparison Cards -->
<div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
  <!-- Card 1: Stated Interest Rate -->
  <div class="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 shadow-3xs flex flex-col justify-between space-y-4">
    <div>
      <div class="flex items-center justify-between">
        <span class="px-3 py-1 rounded-full text-xs font-bold bg-slate-200 text-slate-700">Headline Metric</span>
        <span class="text-xs font-semibold text-slate-400">Basic Rate</span>
      </div>
      <h3 class="text-lg font-extrabold text-slate-900 mt-3">Stated Interest Rate</h3>
      <p class="text-xs sm:text-sm text-slate-600 leading-relaxed mt-2">
        The percentage fee charged by the lender purely on the borrowed principal amount over a year.
      </p>
    </div>
    <div class="space-y-2 pt-3 border-t border-slate-200 text-xs">
      <div class="flex items-center gap-2 text-slate-700">
        <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
        <span>Used to compute monthly Equated Monthly Instalments (EMIs)</span>
      </div>
      <div class="flex items-center gap-2 text-slate-500">
        <span class="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
        <span><strong>Ignores</strong> processing fees & stamp duty</span>
      </div>
      <div class="flex items-center gap-2 text-slate-500">
        <span class="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
        <span><strong>Ignores</strong> insurance & verification charges</span>
      </div>
    </div>
  </div>

  <!-- Card 2: Annual Percentage Rate (APR) -->
  <div class="p-6 rounded-3xl bg-emerald-50/60 border-2 border-[#1dbf73]/50 shadow-2xs flex flex-col justify-between space-y-4">
    <div>
      <div class="flex items-center justify-between">
        <span class="px-3 py-1 rounded-full text-xs font-extrabold bg-[#1dbf73] text-white shadow-3xs">True Cost Metric</span>
        <span class="text-xs font-bold text-[#1dbf73]">Recommended</span>
      </div>
      <h3 class="text-lg font-extrabold text-slate-900 mt-3">Annual Percentage Rate (APR)</h3>
      <p class="text-xs sm:text-sm text-slate-700 leading-relaxed mt-2">
        The comprehensive annual cost of credit expressed as a percentage, factoring interest plus all mandatory upfront charges.
      </p>
    </div>
    <div class="space-y-2 pt-3 border-t border-emerald-200 text-xs">
      <div class="flex items-center gap-2 text-slate-800 font-medium">
        <span class="w-1.5 h-1.5 rounded-full bg-[#1dbf73]"></span>
        <span>Includes processing fees, GST, documentation & insurance</span>
      </div>
      <div class="flex items-center gap-2 text-slate-800 font-medium">
        <span class="w-1.5 h-1.5 rounded-full bg-[#1dbf73]"></span>
        <span>Calculated on net cash disbursed into your bank account</span>
      </div>
      <div class="flex items-center gap-2 text-slate-800 font-medium">
        <span class="w-1.5 h-1.5 rounded-full bg-[#1dbf73]"></span>
        <span>Mandated by RBI in Key Facts Statement (KFS)</span>
      </div>
    </div>
  </div>
</div>

<h2>Real-World Example: Why Loan B Wins Despite a Higher Interest Rate</h2>
<p>
  Consider a loan scenario where you need a <strong>₹5,00,000 personal loan</strong> for 3 years (36 months). You receive offers from two competing lenders:
</p>

<!-- Live Comparison Table Card -->
<div class="my-8 rounded-3xl border border-slate-200 overflow-hidden shadow-sm bg-white">
  <div class="bg-slate-900 text-white p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
    <div>
      <span class="text-xs uppercase tracking-widest text-[#1dbf73] font-bold">Case Study</span>
      <h3 class="text-lg font-black text-white mt-0.5">₹5,00,000 Personal Loan Comparison (3-Year Tenure)</h3>
    </div>
    <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
      Net Disbursement Cost
    </span>
  </div>

  <div class="overflow-x-auto">
    <table class="w-full text-left text-xs sm:text-sm border-collapse">
      <thead>
        <tr class="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase text-[11px] tracking-wider">
          <th class="p-4">Loan Parameter</th>
          <th class="p-4 text-center bg-rose-50/50 text-rose-900">Lender A (High Fee)</th>
          <th class="p-4 text-center bg-emerald-50/60 text-emerald-900">Lender B (Low Fee)</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-slate-100 text-slate-700">
        <tr>
          <td class="p-4 font-semibold text-slate-900">Loan Principal Amount</td>
          <td class="p-4 text-center font-bold text-slate-900">₹5,00,000</td>
          <td class="p-4 text-center font-bold text-slate-900">₹5,00,000</td>
        </tr>
        <tr>
          <td class="p-4 font-semibold text-slate-900">Advertised Interest Rate</td>
          <td class="p-4 text-center text-emerald-600 font-extrabold bg-emerald-50/30">11.5% p.a. (Lower)</td>
          <td class="p-4 text-center text-slate-700 font-bold">12.0% p.a. (Higher)</td>
        </tr>
        <tr>
          <td class="p-4 font-semibold text-slate-900">Upfront Processing Fee + GST</td>
          <td class="p-4 text-center text-rose-600 font-bold">₹15,000 (3% + GST)</td>
          <td class="p-4 text-center text-emerald-600 font-bold">₹3,500 (Flat Fee)</td>
        </tr>
        <tr>
          <td class="p-4 font-semibold text-slate-900">Net Money Disbursed to Bank</td>
          <td class="p-4 text-center text-slate-600">₹4,85,000</td>
          <td class="p-4 text-center text-slate-600">₹4,96,500</td>
        </tr>
        <tr>
          <td class="p-4 font-semibold text-slate-900">Monthly EMI (36 Months)</td>
          <td class="p-4 text-center font-bold">₹16,482</td>
          <td class="p-4 text-center font-bold">₹16,607</td>
        </tr>
        <tr class="bg-slate-50 font-bold">
          <td class="p-4 text-slate-900">Total Outflow (Fee + 36 EMIs)</td>
          <td class="p-4 text-center text-rose-700 font-extrabold">₹6,08,352</td>
          <td class="p-4 text-center text-emerald-700 font-extrabold">₹6,01,352</td>
        </tr>
        <tr class="bg-emerald-50/80 border-t-2 border-[#1dbf73]">
          <td class="p-4 font-black text-slate-900">Effective APR (True Annual Cost)</td>
          <td class="p-4 text-center text-rose-700 font-black text-base">13.84% APR</td>
          <td class="p-4 text-center text-emerald-700 font-black text-base">
            12.52% APR
            <span class="block text-[10px] font-extrabold text-[#1dbf73] uppercase tracking-wider mt-0.5">Winner: Saves ₹7,000!</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</div>

<div class="p-5 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-900 text-xs sm:text-sm leading-relaxed my-6 flex items-start gap-3">
  <div class="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center font-black text-xs shrink-0 mt-0.5">!</div>
  <div>
    <strong>Key Takeaway:</strong> Even though Lender A advertised a lower 11.5% interest rate, its heavy ₹15,000 processing fee raised its true annual cost (APR) to 13.84%. Lender B is <strong>₹7,000 cheaper overall</strong> despite having a higher headline interest rate!
  </div>
</div>

<h2>What Fees Are Covered in APR Calculations?</h2>
<p>
  Under financial standards and central banking guidelines, APR accounts for all mandatory recurring and non-recurring costs required to obtain the loan:
</p>

<div class="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
  <div class="p-4 rounded-2xl bg-white border border-slate-200 shadow-3xs space-y-1.5">
    <div class="w-8 h-8 rounded-xl bg-emerald-100 text-[#1dbf73] font-bold flex items-center justify-center text-sm mb-2">1</div>
    <h4 class="font-bold text-slate-900 text-sm">Processing & Admin Fees</h4>
    <p class="text-xs text-slate-500 leading-normal">Upfront charges deducted during loan disbursement.</p>
  </div>
  <div class="p-4 rounded-2xl bg-white border border-slate-200 shadow-3xs space-y-1.5">
    <div class="w-8 h-8 rounded-xl bg-emerald-100 text-[#1dbf73] font-bold flex items-center justify-center text-sm mb-2">2</div>
    <h4 class="font-bold text-slate-900 text-sm">Documentation & Stamps</h4>
    <p class="text-xs text-slate-500 leading-normal">Legal agreement, e-stamping, and verification fees.</p>
  </div>
  <div class="p-4 rounded-2xl bg-white border border-slate-200 shadow-3xs space-y-1.5">
    <div class="w-8 h-8 rounded-xl bg-emerald-100 text-[#1dbf73] font-bold flex items-center justify-center text-sm mb-2">3</div>
    <h4 class="font-bold text-slate-900 text-sm">Credit Life Insurance</h4>
    <p class="text-xs text-slate-500 leading-normal">Compulsory loan protection insurance bundled by lender.</p>
  </div>
</div>

<h2>RBI Key Facts Statement (KFS) Rule for Indian Borrowers</h2>
<p>
  To protect retail borrowers from misleading financial advertisements, the <strong>Reserve Bank of India (RBI)</strong> made it compulsory for all regulated entities (banks, NBFCs, and digital lending apps) to issue a standardized <strong>Key Facts Statement (KFS)</strong> before executing any loan contract.
</p>

<!-- RBI KFS Highlight Box -->
<div class="p-6 sm:p-8 rounded-3xl bg-slate-900 text-white my-8 shadow-md space-y-4">
  <div class="flex items-center gap-3">
    <span class="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-[#1dbf73] text-white">
      RBI Regulatory Mandate
    </span>
    <span class="text-xs text-slate-400 font-medium">Consumer Protection Framework</span>
  </div>
  
  <h3 class="text-lg sm:text-xl font-black text-white">
    What Lenders Must Disclose in Your Key Facts Statement (KFS):
  </h3>
  
  <ul class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-slate-300 pt-1">
    <li class="flex items-center gap-2">
      <span class="w-2 h-2 rounded-full bg-[#1dbf73]"></span>
      <span>Exact <strong>Annual Percentage Rate (APR)</strong></span>
    </li>
    <li class="flex items-center gap-2">
      <span class="w-2 h-2 rounded-full bg-[#1dbf73]"></span>
      <span>Itemized breakdown of all upfront fees</span>
    </li>
    <li class="flex items-center gap-2">
      <span class="w-2 h-2 rounded-full bg-[#1dbf73]"></span>
      <span>Net disbursed amount vs gross sanction amount</span>
    </li>
    <li class="flex items-center gap-2">
      <span class="w-2 h-2 rounded-full bg-[#1dbf73]"></span>
      <span>Complete EMI repayment schedule table</span>
    </li>
    <li class="flex items-center gap-2">
      <span class="w-2 h-2 rounded-full bg-[#1dbf73]"></span>
      <span>Prepayment penalty terms & foreclosure clauses</span>
    </li>
    <li class="flex items-center gap-2">
      <span class="w-2 h-2 rounded-full bg-[#1dbf73]"></span>
      <span>Nodal Grievance Officer details</span>
    </li>
  </ul>
</div>

<h2>4-Step Checklist to Compare Loan Offers Like a Pro</h2>
<div class="space-y-4 my-6">
  <div class="p-5 rounded-2xl bg-white border border-slate-200 shadow-3xs flex items-start gap-4">
    <span class="w-8 h-8 rounded-full bg-slate-900 text-white font-extrabold flex items-center justify-center shrink-0 text-sm">1</span>
    <div>
      <h4 class="font-extrabold text-slate-900 text-base">Request the Key Facts Statement (KFS) First</h4>
      <p class="text-xs sm:text-sm text-slate-600 mt-1">Never accept an offer verbally or based on marketing flyers. Demand the official KFS document from the bank officer.</p>
    </div>
  </div>
  <div class="p-5 rounded-2xl bg-white border border-slate-200 shadow-3xs flex items-start gap-4">
    <span class="w-8 h-8 rounded-full bg-slate-900 text-white font-extrabold flex items-center justify-center shrink-0 text-sm">2</span>
    <div>
      <h4 class="font-extrabold text-slate-900 text-base">Compare APR with APR (Apple-to-Apples)</h4>
      <p class="text-xs sm:text-sm text-slate-600 mt-1">Only compare APRs across loans with identical tenure and similar borrowing amounts for accurate results.</p>
    </div>
  </div>
  <div class="p-5 rounded-2xl bg-white border border-slate-200 shadow-3xs flex items-start gap-4">
    <span class="w-8 h-8 rounded-full bg-slate-900 text-white font-extrabold flex items-center justify-center shrink-0 text-sm">3</span>
    <div>
      <h4 class="font-extrabold text-slate-900 text-base">Check Net In-Hand Disbursement</h4>
      <p class="text-xs sm:text-sm text-slate-600 mt-1">Calculate: <code>Net Disbursed Amount = Sanctioned Principal - (Processing Fee + GST + Insurance)</code>.</p>
    </div>
  </div>
  <div class="p-5 rounded-2xl bg-white border border-slate-200 shadow-3xs flex items-start gap-4">
    <span class="w-8 h-8 rounded-full bg-slate-900 text-white font-extrabold flex items-center justify-center shrink-0 text-sm">4</span>
    <div>
      <h4 class="font-extrabold text-slate-900 text-base">Review Foreclosure & Part-Payment Penalties</h4>
      <p class="text-xs sm:text-sm text-slate-600 mt-1">Under RBI norms, floating rate personal loans to individuals carry 0% foreclosure fees, but fixed rate loans may attract 2% to 5% charges.</p>
    </div>
  </div>
</div>

<h2>Frequently Asked Questions</h2>
<div class="space-y-4 my-8">
  <div class="p-5 rounded-2xl bg-slate-50 border border-slate-200">
    <h3 class="text-base font-extrabold text-slate-900 flex items-center gap-2">
      <span class="text-[#1dbf73]">Q:</span> Why is APR higher than the advertised interest rate?
    </h3>
    <p class="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
      APR includes both the annual interest charge AND all mandatory upfront fees (processing fees, documentation, GST, insurance) distributed across the loan tenure, making it higher than the nominal interest rate.
    </p>
  </div>

  <div class="p-5 rounded-2xl bg-slate-50 border border-slate-200">
    <h3 class="text-base font-extrabold text-slate-900 flex items-center gap-2">
      <span class="text-[#1dbf73]">Q:</span> Can APR and interest rate ever be equal?
    </h3>
    <p class="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
      Yes! If a lender waives 100% of processing fees, documentation charges, and insurance costs, the APR will exactly equal the interest rate.
    </p>
  </div>

  <div class="p-5 rounded-2xl bg-slate-50 border border-slate-200">
    <h3 class="text-base font-extrabold text-slate-900 flex items-center gap-2">
      <span class="text-[#1dbf73]">Q:</span> Is KFS mandatory for all Indian loans?
    </h3>
    <p class="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
      Yes, per RBI guidelines, all regulated banks, NBFCs, and fintech platforms must provide a standardized Key Facts Statement (KFS) before loan execution.
    </p>
  </div>
</div>`;

const post = db.posts.find(p => p.slug === "apr-vs-interest-rate-how-to-compare-loan-offers-correctly");
if (post) {
  post.content = newHtml;
  post.title = "APR vs Interest Rate: How to Compare Loan Offers Correctly";
  post.excerpt = "Learn how Annual Percentage Rate (APR) reveals hidden loan processing fees and why the lowest advertised interest rate isn't always the cheapest loan offer.";
  post.featuredImage = "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=80";
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), "utf-8");
  fs.writeFileSync(backupPath, JSON.stringify(db, null, 2), "utf-8");
  console.log("UPDATED POST IN DB.JSON AND DB_BACKUP.JSON!");
} else {
  console.error("POST NOT FOUND!");
}

let serverCode = fs.readFileSync(serverPath, "utf-8");
const postsJson = JSON.stringify(db.posts, null, 2);
const newDefaultPostsDecl = `const defaultPosts: any[] = ${postsJson};`;

const startIdx = serverCode.indexOf("const defaultPosts: any[] = [");
const endIdx = serverCode.indexOf("function getInitialDb(): DatabaseSchema {");

if (startIdx !== -1 && endIdx !== -1) {
  serverCode = serverCode.substring(0, startIdx) + newDefaultPostsDecl + "\n\n" + serverCode.substring(endIdx);
  fs.writeFileSync(serverPath, serverCode, "utf-8");
  console.log("SERVER.TS UPDATED WITH NEW HTML!");
}
