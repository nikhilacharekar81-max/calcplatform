import React from 'react';
import { BookOpen } from 'lucide-react';

export const CarLoanGuideContent: React.FC = () => {
  return (
    <div className="space-y-12 font-sans text-[#404145] leading-relaxed">
      {/* Overview & Intro */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <h1 className="text-2xl sm:text-3xl font-black text-[#222325]">
          Car Loan EMI Calculator: Calculate Your Monthly EMI and Total Loan Cost
        </h1>
        <p className="text-sm sm:text-base text-[#62646a] leading-relaxed">
          Buying a car is a big decision. The price of the car is important, but there is another number you should look at before making a decision: <strong>your monthly EMI</strong>.
        </p>
        <p className="text-sm sm:text-base text-[#62646a] leading-relaxed">
          A car loan can make a car easier to afford because you don't have to pay the entire amount at once. But you will be making that payment every month for several years.
        </p>
        <p className="text-sm sm:text-base text-[#62646a] leading-relaxed">
          Our <strong>Car Loan EMI Calculator</strong> helps you get a quick idea of what that payment could look like.
        </p>
        <p className="text-sm sm:text-base text-[#62646a] leading-relaxed">
          Just enter your <strong>loan amount, interest rate and loan tenure</strong>. The calculator will show you your estimated monthly EMI, total interest and total amount you could repay over the loan period.
        </p>
        <p className="text-sm sm:text-base text-[#62646a] leading-relaxed">
          It can be useful when you are comparing different cars, deciding how much to put down as a down payment, or simply checking whether a particular EMI fits comfortably into your monthly budget.
        </p>
      </div>

      {/* How to Use */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-6">
        <h2 className="text-xl font-extrabold text-[#222325]">
          How to Use the Car Loan EMI Calculator
        </h2>
        <p className="text-sm text-[#62646a]">
          You don't need to understand complicated financial calculations to use the calculator. You only need three numbers.
        </p>

        <div className="space-y-4">
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <h3 className="text-base font-bold text-[#222325]">1. Loan Amount</h3>
            <p className="text-xs sm:text-sm text-[#62646a]">
              Enter the amount you expect to borrow. For example, suppose the car costs ₹10,00,000 and you plan to pay ₹2,00,000 from your own savings. You may need a loan of around <strong>₹8,00,000</strong>.
            </p>
            <p className="text-xs text-[#74767e]">
              Remember that the amount you actually borrow depends on the car's price, your down payment and the lender's loan terms.
            </p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <h3 className="text-base font-bold text-[#222325]">2. Interest Rate</h3>
            <p className="text-xs sm:text-sm text-[#62646a]">
              Enter the annual interest rate offered by your lender. For example, you might be offered a rate of 8.50%, 9.00% or 9.50% per year.
            </p>
            <p className="text-xs text-[#74767e]">
              Don't assume that the rate you see advertised online is necessarily the rate you will receive. Your actual rate can depend on things such as your credit history, income, loan amount, tenure, vehicle and the lender's policies.
            </p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <h3 className="text-base font-bold text-[#222325]">3. Loan Tenure</h3>
            <p className="text-xs sm:text-sm text-[#62646a]">
              This is how long you plan to take to repay the loan. You might choose 1, 2, 3, 4, 5, 6, or 7 years depending on the lender and the car-loan product.
            </p>
          </div>
        </div>

        <div>
          <p className="text-sm font-bold text-[#222325] mb-2">Once you enter these details, the calculator estimates your:</p>
          <ul className="list-disc pl-5 space-y-1 text-sm text-[#62646a]">
            <li><strong>Monthly EMI</strong></li>
            <li><strong>Total interest</strong></li>
            <li><strong>Total repayment</strong></li>
            <li><strong>Principal and interest breakdown</strong></li>
          </ul>
        </div>
      </div>

      {/* What Does EMI Actually Mean? */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <h2 className="text-xl font-extrabold text-[#222325]">
          What Does EMI Actually Mean?
        </h2>
        <p className="text-sm text-[#62646a]">
          EMI stands for <strong>Equated Monthly Instalment</strong>. In simple terms, it is the amount you are scheduled to pay towards your loan every month.
        </p>
        <p className="text-sm text-[#62646a]">
          Your EMI generally contains two parts:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <div className="font-bold text-[#222325] text-sm">Principal</div>
            <p className="text-xs text-[#62646a]">The money that reduces what you borrowed.</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <div className="font-bold text-[#222325] text-sm">Interest</div>
            <p className="text-xs text-[#62646a]">The cost of borrowing that money.</p>
          </div>
        </div>
        <p className="text-sm text-[#62646a]">
          The two parts don't stay the same throughout the loan. In the early part of a typical reducing-balance loan, a larger share of your EMI goes towards interest because your outstanding loan balance is still high.
        </p>
        <p className="text-sm text-[#62646a]">
          As you continue paying, the outstanding balance comes down. The interest charged on that balance also comes down, so more of your EMI goes towards the principal. That's why a ₹20,000 EMI doesn't mean that ₹20,000 is reducing your loan every month.
        </p>
      </div>

      {/* How Is Car Loan EMI Calculated? */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <h2 className="text-xl font-extrabold text-[#222325]">
          How Is Car Loan EMI Calculated?
        </h2>
        <p className="text-sm text-[#62646a]">
          For a standard reducing-balance loan, the mathematical formula is:
        </p>
        <div className="p-6 rounded-2xl bg-slate-900 text-white font-mono text-center text-sm sm:text-base overflow-x-auto my-3">
          EMI = [P &times; r &times; (1+r)^n] / [(1+r)^n - 1]
        </div>
        <div className="text-xs sm:text-sm text-[#62646a] space-y-2">
          <p>Here:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>P</strong> is the amount you borrow.</li>
            <li><strong>r</strong> is the monthly interest rate (Annual Rate &divide; 12 &divide; 100).</li>
            <li><strong>n</strong> is the total number of monthly payments (Years &times; 12).</li>
          </ul>
        </div>
        <p className="text-sm text-[#62646a]">
          If the annual interest rate is 9.50%, the monthly rate used in the calculation is <strong>9.50 &divide; 12 &divide; 100</strong>. And if your loan runs for 5 years, there are <strong>5 &times; 12 = 60 monthly payments</strong>.
        </p>
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs sm:text-sm text-amber-900 space-y-1">
          <div className="font-bold">One Important Point</div>
          <p>
            This formula is a mathematical model for a standard reducing-balance loan. It should not be presented as a claim that every bank and every car-loan product in India calculates interest in exactly the same way. Different lenders can have different products, rates, repayment arrangements, rounding methods, fees and other terms. So treat the calculator result as an <strong>estimate based on the numbers you entered</strong>. For your actual loan, the lender's sanction letter and repayment schedule are the final reference.
          </p>
        </div>
      </div>

      {/* Example: ₹10 Lakh Car Loan */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <h2 className="text-xl font-extrabold text-[#222325]">
          Example: What Could a ₹10 Lakh Car Loan Cost?
        </h2>
        <p className="text-sm text-[#62646a]">
          Suppose you borrow <strong>₹10,00,000</strong> at an annual interest rate of <strong>9.50% per year</strong> for <strong>5 years</strong>.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-1">
            <div className="text-xs text-slate-500 font-medium">Estimated Monthly EMI</div>
            <div className="text-lg font-black text-emerald-600">₹21,002</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-1">
            <div className="text-xs text-slate-500 font-medium">Estimated Total Interest</div>
            <div className="text-lg font-black text-[#222325]">₹2,60,112</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-1">
            <div className="text-xs text-slate-500 font-medium">Estimated Total Repayment</div>
            <div className="text-lg font-black text-[#222325]">₹12,60,112</div>
          </div>
        </div>
        <p className="text-sm text-[#62646a]">
          This is why it is worth looking beyond the EMI. The car may cost ₹10,00,000 today, but borrowing ₹10,00,000 means the total amount paid over the loan period can be considerably higher.
        </p>
      </div>

      {/* Does a Longer Loan Tenure Make a Car Cheaper? */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <h2 className="text-xl font-extrabold text-[#222325]">
          Does a Longer Loan Tenure Make a Car Cheaper?
        </h2>
        <p className="text-sm text-[#62646a]">
          No. It usually makes the <strong>monthly payment smaller</strong>, but the total interest can become higher.
        </p>
        <p className="text-xs sm:text-sm text-[#62646a]">
          For example, suppose you borrow ₹10,00,000 at 9.50%:
        </p>

        <div className="overflow-x-auto border border-slate-200 rounded-2xl">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="bg-slate-100 text-[#222325]">
                <th className="p-3 font-bold border-b border-slate-200">Tenure</th>
                <th className="p-3 font-bold border-b border-slate-200 text-right">Approx. EMI</th>
                <th className="p-3 font-bold border-b border-slate-200 text-right">Approx. Total Interest</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[#62646a]">
              <tr>
                <td className="p-3 font-bold">1 Year</td>
                <td className="p-3 text-right font-semibold text-emerald-600">₹87,684</td>
                <td className="p-3 text-right">₹52,202</td>
              </tr>
              <tr className="bg-slate-50/50">
                <td className="p-3 font-bold">2 Years</td>
                <td className="p-3 text-right font-semibold text-emerald-600">₹45,914</td>
                <td className="p-3 text-right">₹1,01,948</td>
              </tr>
              <tr>
                <td className="p-3 font-bold">3 Years</td>
                <td className="p-3 text-right font-semibold text-emerald-600">₹32,033</td>
                <td className="p-3 text-right">₹1,53,186</td>
              </tr>
              <tr className="bg-slate-50/50">
                <td className="p-3 font-bold">4 Years</td>
                <td className="p-3 text-right font-semibold text-emerald-600">₹25,123</td>
                <td className="p-3 text-right">₹2,05,911</td>
              </tr>
              <tr className="bg-emerald-50/60 font-bold text-[#222325]">
                <td className="p-3">5 Years</td>
                <td className="p-3 text-right text-emerald-700">₹21,002</td>
                <td className="p-3 text-right">₹2,60,112</td>
              </tr>
              <tr className="bg-slate-50/50">
                <td className="p-3 font-bold">6 Years</td>
                <td className="p-3 text-right font-semibold text-emerald-600">₹18,275</td>
                <td className="p-3 text-right">₹3,15,778</td>
              </tr>
              <tr>
                <td className="p-3 font-bold">7 Years</td>
                <td className="p-3 text-right font-semibold text-emerald-600">₹16,344</td>
                <td className="p-3 text-right">₹3,72,894</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-[#74767e] italic">
          *These are mathematical examples using 9.50% p.a. and the standard reducing-balance formula. Actual lender figures can differ.
        </p>
        <p className="text-sm text-[#62646a]">
          Notice what happens: Going from 5 years to 7 years reduces the monthly EMI by several thousand rupees. That may make the loan easier to manage each month. But you also stay in debt for two additional years and pay more interest overall.
        </p>
      </div>

      {/* What Happens When Interest Rate Changes? */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <h2 className="text-xl font-extrabold text-[#222325]">
          What Happens When the Interest Rate Changes?
        </h2>
        <p className="text-sm text-[#62646a]">
          The interest rate also affects your EMI. Suppose you borrow <strong>₹10,00,000 for 5 years</strong>:
        </p>

        <div className="overflow-x-auto border border-slate-200 rounded-2xl max-w-md">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="bg-slate-100 text-[#222325]">
                <th className="p-3 font-bold border-b border-slate-200">Interest Rate</th>
                <th className="p-3 font-bold border-b border-slate-200 text-right">Approx. EMI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[#62646a]">
              <tr>
                <td className="p-3 font-bold">8.50%</td>
                <td className="p-3 text-right font-semibold text-emerald-600">₹20,516</td>
              </tr>
              <tr className="bg-slate-50/50">
                <td className="p-3 font-bold">9.00%</td>
                <td className="p-3 text-right font-semibold text-emerald-600">₹20,758</td>
              </tr>
              <tr className="bg-emerald-50/60 font-bold text-[#222325]">
                <td className="p-3">9.50%</td>
                <td className="p-3 text-right text-emerald-700">₹21,002</td>
              </tr>
              <tr className="bg-slate-50/50">
                <td className="p-3 font-bold">10.00%</td>
                <td className="p-3 text-right font-semibold text-emerald-600">₹21,247</td>
              </tr>
              <tr>
                <td className="p-3 font-bold">10.50%</td>
                <td className="p-3 text-right font-semibold text-emerald-600">₹21,493</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-sm text-[#62646a]">
          The difference may not look huge when you look at one month's EMI. But remember that you could make 60, 72 or even 84 payments. That is why it is worth comparing the total interest as well.
        </p>
      </div>

      {/* Don't Confuse Car Price With Loan Amount */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <h2 className="text-xl font-extrabold text-[#222325]">
          Don't Confuse the Car Price With the Amount You Need to Borrow
        </h2>
        <p className="text-sm text-[#62646a]">
          This is one of the easiest mistakes to make when buying a car. You might see a car advertised at <strong>₹8,99,000</strong> ex-showroom price.
        </p>
        <p className="text-sm text-[#62646a]">
          However, your final on-road cost can also include:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-sm text-[#62646a]">
          <li>Registration &amp; Road tax</li>
          <li>Insurance</li>
          <li>FASTag</li>
          <li>Accessories</li>
          <li>Other applicable charges</li>
        </ul>
        <p className="text-sm text-[#62646a]">
          So your actual on-road price could be considerably higher. The amount a lender finances depends on the particular loan product and its conditions. That's why it's better to work out the <strong>actual amount you expect to borrow</strong> before calculating your EMI.
        </p>
      </div>

      {/* Down Payment */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <h2 className="text-xl font-extrabold text-[#222325]">
          How Much Should You Pay as a Down Payment?
        </h2>
        <p className="text-sm text-[#62646a]">
          There isn't one down-payment percentage that applies to every car buyer. You may hear people suggest putting down 15% or 20%, but the actual amount depends on the lender, car, loan product and your financial situation.
        </p>
        <p className="text-sm font-bold text-[#222325]">
          For a car costing ₹12,00,000:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <div className="font-bold text-[#222325] text-sm">Option 1</div>
            <p className="text-xs text-[#62646a]">Down payment: ₹2,00,000 &rarr; Loan: <strong>₹10,00,000</strong></p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <div className="font-bold text-[#222325] text-sm">Option 2</div>
            <p className="text-xs text-[#62646a]">Down payment: ₹3,00,000 &rarr; Loan: <strong>₹9,00,000</strong></p>
          </div>
        </div>
        <p className="text-sm text-[#62646a]">
          The second option starts with a smaller loan, so the EMI and total interest will generally be lower. But don't put every rupee of your savings into the car just to reduce your EMI — you still need money for emergencies, insurance, fuel, maintenance and unexpected expenses.
        </p>
      </div>

      {/* Other Costs of Owning a Car */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <h2 className="text-xl font-extrabold text-[#222325]">
          Don't Forget the Other Costs of Owning a Car
        </h2>
        <p className="text-sm text-[#62646a]">
          Your EMI isn't the complete monthly cost of owning a car. Suppose your EMI is ₹20,000. You may also have to pay for:
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {['Fuel / EV Charging', 'Insurance', 'Parking', 'Servicing & Repairs', 'Tyres', 'Roadside Assistance & Accessories'].map((item, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-[#222325] text-center">
              {item}
            </div>
          ))}
        </div>
        <p className="text-sm text-[#62646a]">
          So before deciding that a car is affordable, look at the <strong>total monthly cost</strong>, not just the EMI. A ₹20,000 EMI can feel very different for someone earning ₹1,00,000 a month compared with someone earning ₹50,000.
        </p>
      </div>

      {/* Can You Comfortably Afford the EMI? */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <h2 className="text-xl font-extrabold text-[#222325]">
          Can You Comfortably Afford the EMI?
        </h2>
        <p className="text-sm text-[#62646a]">
          This is probably more important than getting the lowest possible interest rate. Before taking a car loan, look at your existing monthly commitments:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-[#62646a]">
          <li>Home loan EMI / Personal loan EMI</li>
          <li>Credit card payments &amp; Rent</li>
          <li>School fees &amp; Household expenses</li>
          <li>Insurance &amp; Investments</li>
        </ul>
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
          <div className="font-bold text-[#222325] text-sm">Loan Eligibility Is Not the Same as Affordability</div>
          <p className="text-xs text-[#62646a]">
            A lender may approve a certain loan amount based on its own eligibility criteria. That doesn't necessarily mean you should borrow that much. Ask yourself: <em>"Can I comfortably make this payment every month without putting my other financial goals under pressure?"</em>
          </p>
        </div>
      </div>

      {/* Processing Fees & Loan Structure */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-3">
          <h2 className="text-lg font-extrabold text-[#222325]">
            What Are Processing Fees?
          </h2>
          <p className="text-xs sm:text-sm text-[#62646a]">
            Depending on the lender and product, you may see processing fees, documentation charges, administrative charges, late-payment charges, and prepayment charges. When comparing loans, ask for the complete list of charges rather than looking at interest rate alone.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-3">
          <h2 className="text-lg font-extrabold text-[#222325]">
            Fixed vs Floating Interest
          </h2>
          <p className="text-xs sm:text-sm text-[#62646a]">
            <strong>Fixed Rate:</strong> Applicable rate is generally fixed during the agreed period.<br />
            <strong>Floating Rate:</strong> Can change according to the benchmark mechanism, affecting your EMI or tenure under lender terms.
          </p>
        </div>
      </div>

      {/* Prepayment & EMI vs Tenure */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <h2 className="text-xl font-extrabold text-[#222325]">
          What Happens If You Prepay Your Car Loan?
        </h2>
        <p className="text-sm text-[#62646a]">
          A prepayment reduces your outstanding principal, lowering future interest under a reducing-balance structure. Check for lock-in periods, minimum prepayment amounts, and applicable charges beforehand.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <div className="font-bold text-[#222325] text-sm">Reduce the EMI</div>
            <p className="text-xs text-[#62646a]">Your monthly payment becomes smaller, giving you more breathing room in your monthly budget.</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <div className="font-bold text-[#222325] text-sm">Reduce the Tenure</div>
            <p className="text-xs text-[#62646a]">Your EMI remains similar, but the loan finishes earlier, cutting total interest paid.</p>
          </div>
        </div>
      </div>

      {/* Used Car & EV Loan Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-3">
          <h2 className="text-lg font-extrabold text-[#222325]">
            What About Used-Car Loans?
          </h2>
          <p className="text-xs sm:text-sm text-[#62646a]">
            Used-car loans depend on vehicle age, condition, and valuation. Interest rates are usually different from new-car loans, so enter the actual rate offered for the used car.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-3">
          <h2 className="text-lg font-extrabold text-[#222325]">
            Electric Vehicles (EV) Loans
          </h2>
          <p className="text-xs sm:text-sm text-[#62646a]">
            The EMI formula works identically for petrol, diesel, or EV. Enter the specific EV financing rate offered by your lender.
          </p>
        </div>
      </div>

      {/* Car Loan vs Cash */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <h2 className="text-xl font-extrabold text-[#222325]">
          Car Loan vs Paying Cash
        </h2>
        <p className="text-sm text-[#62646a]">
          Paying cash saves interest costs but depletes liquidity. Taking a loan preserves cash reserves for emergencies and investments while creating a monthly commitment.
        </p>
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
          <div className="font-bold text-[#222325] text-sm">7 Key Factors to Compare:</div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-semibold text-slate-700">
            <div>1. Loan Amount</div>
            <div>2. Interest Rate</div>
            <div>3. Tenure</div>
            <div>4. Monthly EMI</div>
            <div>5. Total Interest</div>
            <div>6. Total Repayment</div>
            <div className="col-span-2">7. Other Charges</div>
          </div>
        </div>
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
              q: 'What is a car loan EMI?',
              a: 'It is the amount you are scheduled to pay towards your car loan every month. It normally includes both principal and interest.',
            },
            {
              q: 'How do I calculate my car loan EMI?',
              a: 'Enter your loan amount, annual interest rate and tenure into the calculator. The calculator uses these numbers to estimate your monthly EMI and total repayment.',
            },
            {
              q: 'Does a longer tenure reduce the EMI?',
              a: 'Usually, yes. You spread the loan over more months, so each monthly payment becomes smaller. But you may pay more total interest because the loan lasts longer.',
            },
            {
              q: 'Is a lower EMI always better?',
              a: 'No. A lower EMI can simply mean that you have chosen a longer tenure. Always check the total interest and total repayment before deciding.',
            },
            {
              q: 'Is a 20% down payment compulsory?',
              a: 'No single down-payment percentage applies to every car loan. The amount depends on the lender, car, loan product and borrower.',
            },
            {
              q: 'Can I finance the entire car?',
              a: 'Some lenders and loan products may finance a very large portion of the vehicle\'s cost, subject to their conditions. Don\'t assume that 100% financing is available to everyone.',
            },
            {
              q: 'Does my credit score affect my car loan?',
              a: 'It can. Lenders may consider your credit history and other financial information when deciding your eligibility and interest rate.',
            },
            {
              q: 'Why did my bank give me a different EMI?',
              a: 'There are several possible reasons. The interest rate may be different, or the lender may use different repayment dates, rounding methods, fees or other loan terms. Your bank\'s repayment schedule should be treated as the final figure for your actual loan.',
            },
            {
              q: 'Can I repay my car loan early?',
              a: 'You may be able to, but the rules depend on the lender and your loan agreement. Check for any lock-in period, minimum amount and applicable charges before making a prepayment.',
            },
            {
              q: 'Does prepayment reduce interest?',
              a: 'It can. If the prepayment reduces your outstanding principal, future interest can also fall under a reducing-balance structure. The actual saving depends on when you prepay, how much you pay and how the lender recalculates your loan.',
            },
            {
              q: 'What is the difference between a new-car loan and a used-car loan?',
              a: 'The interest rate, tenure, eligibility requirements and other terms can be different. Used-car loans may also depend on the age and value of the vehicle.',
            },
            {
              q: 'Can I calculate an EV loan EMI?',
              a: 'Yes. Enter the amount you plan to borrow, the interest rate offered for the EV loan and the repayment period.',
            },
            {
              q: 'Does the calculator include insurance and registration?',
              a: 'Not unless those costs are included in the loan amount you enter. The calculator is designed to calculate the cost of the loan itself.',
            },
            {
              q: 'Why is my EMI different by a few rupees from another calculator?',
              a: 'Different calculators may use different rounding rules or assumptions. Small differences can also come from the way the interest rate and repayment schedule are handled.',
            },
            {
              q: 'Is the result from this calculator guaranteed?',
              a: 'No. It is an estimate based on the information you enter and the selected calculation method. The lender\'s actual loan agreement and repayment schedule are the final reference.',
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

      {/* Before You Take the Loan */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <h2 className="text-xl font-extrabold text-[#222325]">
          Before You Take the Loan
        </h2>
        <p className="text-sm text-[#62646a]">
          A car loan isn't just about finding an EMI that fits on your screen. Think about what the payment will feel like <strong>every month</strong>.
        </p>
        <p className="text-sm text-[#62646a]">
          If the EMI is ₹20,000, ask yourself whether you can still comfortably pay for fuel, insurance, maintenance, household expenses and savings.
        </p>
        <p className="text-sm font-bold text-[#222325]">Final Takeaway:</p>
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 font-bold text-center text-[#222325] text-xs sm:text-sm">
          Loan Amount + Interest Rate + Tenure + EMI + Total Interest + Total Repayment + Other Costs
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-slate-50 rounded-3xl border border-slate-200 p-6 sm:p-8 text-xs text-slate-500 space-y-2">
        <div className="font-bold text-[#222325]">Disclaimer</div>
        <p>
          This calculator provides mathematical estimates based on the information entered by the user and the selected amortisation assumptions. Actual interest rates, EMI amounts, fees, repayment schedules, prepayment rules and other loan terms can vary between lenders and loan products. Always check the final loan offer and repayment schedule provided by your lender before accepting a loan.
        </p>
      </div>
    </div>
  );
};
