import React from 'react';
import { Plane, Info, ShieldCheck, DollarSign, Calendar, Users, Briefcase } from 'lucide-react';

export const TravelInsuranceInfo: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto prose prose-slate prose-lg bg-white p-8 rounded-3xl border border-[#e4e5e7] shadow-sm -mt-12">
      <h1 className="text-3xl font-extrabold text-[#222325] mb-6 flex items-center gap-3">
        <Plane className="w-8 h-8 text-[#1dbf73]" />
        Travel Insurance Calculator
      </h1>
      <p>Planning an international trip? Our Travel Insurance Calculator helps you estimate the cost of travel insurance using your trip details, traveller profile and selected protection.</p>
      <p>Use the result to plan your travel budget and compare different scenarios. An insurer's final price can differ because each company has its own products, underwriting and pricing methods.</p>

      <h2 className="text-2xl font-bold mt-8 mb-4">How much does travel insurance cost?</h2>
      <p>There is no single price for travel insurance.</p>
      <p>A short trip to one country can cost very different amounts from a longer trip to another destination. Traveller age, medical coverage, number of people travelling and additional protection can also change the price.</p>
      <p>For example, a 30-year-old travelling to Europe for 10 days may pay a different premium from a 65-year-old taking the same trip. Rather than relying on an average, it makes more sense to calculate the cost for your actual journey.</p>

      <h2 className="text-2xl font-bold mt-8 mb-4">What affects the cost of travel insurance?</h2>
      
      <h3 className="flex items-center gap-2"><Briefcase className="w-5 h-5"/> Destination</h3>
      <p>Your destination matters because medical treatment and other potential claim costs can vary greatly between countries.</p>
      <p>The United States and Canada, for example, are known for very high healthcare costs. This is one reason travel insurance can be more expensive for some destinations.</p>
      <p>There is no fixed percentage that applies to every country. Insurers use their own destination classifications when pricing their products.</p>

      <h3 className="flex items-center gap-2"><Calendar className="w-5 h-5"/> Trip duration</h3>
      <p>The longer you travel, the longer your insurance protection needs to remain active.</p>
      <p>A 20-day trip can therefore cost more than a 7-day trip. Use the calculator to change your dates and see how the estimated price moves.</p>

      <h3 className="flex items-center gap-2"><Users className="w-5 h-5"/> Traveller age</h3>
      <p>Age can influence the premium because insurers assess medical risk differently across age groups.</p>
      <p>There is no single age-based loading used throughout the industry, so the effect can vary between products.</p>

      <h3 className="flex items-center gap-2"><Users className="w-5 h-5"/> Number of travellers</h3>
      <p>Adding travellers increases the total amount of protection being provided.</p>
      <p>For a family or group, compare both the total premium and the approximate cost per traveller. Pricing may not simply be a matter of multiplying one person's premium by the number of people.</p>

      <h3 className="flex items-center gap-2"><ShieldCheck className="w-5 h-5"/> Medical coverage</h3>
      <p>The medical sum insured is the maximum amount available for eligible covered medical expenses, subject to the terms of the policy.</p>
      <p>Higher medical protection can be particularly valuable in countries where hospital treatment is expensive.</p>
      <p>Remember that the sum insured is a limit, not a promise that the entire amount will be paid. The claim must still meet the policy's coverage conditions.</p>

      <h3 className="flex items-center gap-2"><Info className="w-5 h-5"/> Pre-existing medical conditions</h3>
      <p>Existing health conditions can affect both eligibility and coverage.</p>
      <p>Be honest when providing medical information. Depending on the product, a condition may be excluded, covered with specific restrictions or require additional assessment.</p>

      <h3 className="flex items-center gap-2"><DollarSign className="w-5 h-5"/> Optional protection</h3>
      <p>Additional protection can increase the premium.</p>
      <p>Examples include baggage protection, trip interruption or delay benefits and cover for certain adventure activities.</p>
      <p>These benefits are not identical across all travel insurance products, so consider them based on the risks involved in your particular trip.</p>

      <h2 className="text-2xl font-bold mt-8 mb-4">How much travel medical insurance should you buy?</h2>
      <p>The right medical coverage depends heavily on where you are going.</p>
      <p>A lower limit can keep the premium down, but it may leave you with less financial protection if you face a large eligible medical bill. A higher limit offers more room for expensive treatment, especially in countries with high healthcare costs.</p>
      <p>Don't look at the medical limit alone. Deductibles, exclusions, sub-limits and emergency assistance can be just as important when comparing policies.</p>

      <h2 className="text-2xl font-bold mt-8 mb-4">Is $100,000 enough for international travel?</h2>
      <p>There is no universal answer.</p>
      <p>$100,000 may be a sensible level for some trips, while a higher amount may be more appropriate for destinations where medical treatment can be extremely expensive.</p>
      <p>Think about the destination, length of stay and your own circumstances rather than choosing a coverage amount simply because it is the cheapest option.</p>

      <h2 className="text-2xl font-bold mt-8 mb-4">Single-trip vs annual multi-trip insurance</h2>
      <h3 className="text-xl font-semibold">Single-trip insurance</h3>
      <p>Single-trip cover is built around one particular journey.</p>
      <p>It can be a practical choice if you are taking one international trip and already know your travel dates.</p>
      <h3 className="text-xl font-semibold">Annual multi-trip insurance</h3>
      <p>Annual multi-trip cover can suit frequent travellers who expect to take several trips during the policy year.</p>
      <p>One important detail is easy to miss: an annual policy does not necessarily allow you to remain abroad continuously for 365 days. Many products set a maximum number of days for each individual trip.</p>

      <h2 className="text-2xl font-bold mt-8 mb-4">What does travel insurance cover?</h2>
      <p>Travel insurance can protect against several financial risks while you are away from home.</p>
      <ul className="list-disc pl-6 space-y-2">
        <li><strong>Medical emergencies:</strong> Travel policies can cover eligible medical treatment for illness or injury during the trip. This is often the most important benefit for international travel because treatment costs can become very large in some countries.</li>
        <li><strong>Baggage problems:</strong> Depending on the cover, you may receive compensation for eligible baggage loss, theft or delay. Limits can apply to the total claim as well as individual items.</li>
        <li><strong>Trip delays and interruptions:</strong> Some policies provide benefits when specified events delay or interrupt your journey. The reason for the disruption matters, so a policy should not be viewed as protection against every travel inconvenience.</li>
        <li><strong>Trip cancellation:</strong> Cancellation cover can help with certain specified reasons for cancelling before departure. It is different from a general "cancel for any reason" facility, which is not automatically included in standard travel insurance.</li>
        <li><strong>Personal liability:</strong> Some policies provide protection if you become legally liable for certain covered incidents involving another person. The situations covered and maximum benefit vary by product.</li>
        <li><strong>Emergency assistance:</strong> Travel insurance may also give you access to emergency assistance while you are abroad, which can be particularly useful when dealing with a medical or travel emergency in an unfamiliar country.</li>
      </ul>

      <h2 className="text-2xl font-bold mt-8 mb-4">What may not be covered?</h2>
      <p>Travel insurance has exclusions and limits.</p>
      <p>Examples can include certain pre-existing medical conditions, excluded activities, claims outside the insured period and expenses that exceed applicable limits.</p>
      <p>Adventure activities deserve special attention. Trekking or adventure sports may need additional protection, and standard travel cover should not automatically be assumed to include every activity.</p>

      <h2 className="text-2xl font-bold mt-8 mb-4">Are you travelling to a country with insurance requirements?</h2>
      <p>Some countries and visa categories require travellers to have travel medical insurance.</p>
      <p>That requirement is not necessarily the same as the amount of protection you should personally choose.</p>
      <p>For example, a visa authority may specify a minimum medical coverage amount. Meeting that minimum can satisfy an entry requirement, but you may still decide that a higher level of protection makes more sense for your trip.</p>
      <p>Check the current requirements for your destination and visa before travelling.</p>

      <h2 className="text-2xl font-bold mt-8 mb-4">Why can an insurer's quote be different?</h2>
      <p>You may enter the same trip details into two insurers and receive different prices.</p>
      <p>That is normal. Insurers can use different age bands, destination categories, medical-risk assessments, coverage limits, deductibles, exclusions, add-on prices and product structures.</p>
      <p>There is no single universal formula that every travel insurer in India uses to arrive at the same premium.</p>
      <p>This calculator is therefore most useful for <strong>planning, understanding costs and comparing scenarios</strong> before obtaining an actual insurer quotation.</p>

      <h2 className="text-2xl font-bold mt-8 mb-4">A simple example</h2>
      <p>Imagine you are planning a 10-day international trip.</p>
      <p>You enter your destination, travel dates, age, number of travellers and preferred medical protection. The calculator gives you an estimated premium based on those choices.</p>
      <p>Now change the trip from 10 days to 20 days.</p>
      <p>The new result lets you see how extending the trip affects the estimated cost.</p>
      <p>You can do the same with medical coverage. Compare a lower limit with a higher one and see what changes.</p>
      <p>This gives you a much clearer picture of the price-versus-protection trade-off than an average travel insurance price ever could.</p>

      <h2 className="text-2xl font-bold mt-8 mb-4">Travel insurance is about more than the premium</h2>
      <p>The cheapest policy is not necessarily the best fit.</p>
      <p>When comparing policies, look at the medical cover, exclusions, deductible or excess, pre-existing condition terms, emergency assistance, baggage limits and cancellation or interruption benefits.</p>
      <p>If your trip includes adventure activities, make sure those activities are covered.</p>
      <p>A slightly higher premium can be worthwhile if it provides protection that is actually relevant to your trip.</p>

      <h2 className="text-2xl font-bold mt-8 mb-4">GST and tax treatment</h2>
      <p>Insurance tax rules can change, and the treatment can depend on the nature and classification of the product.</p>
      <p>For CalcPlatform, applicable India-specific tax rules should be maintained separately from the core calculation engine so they can be updated when the rules change.</p>

      <h2 className="text-2xl font-bold mt-8 mb-4">Frequently Asked Questions</h2>
      <div className="space-y-6">
        <div>
          <p className="font-bold">How is travel insurance premium calculated?</p>
          <p className="text-slate-600">Pricing can take into account the destination, trip duration, traveller age, number of travellers, medical coverage, medical conditions and additional protection. There is no single formula used by every insurer.</p>
        </div>
        <div>
          <p className="font-bold">Does age affect travel insurance cost?</p>
          <p className="text-slate-600">Yes. Age can influence pricing because medical risk is assessed differently across age groups.</p>
        </div>
        <div>
          <p className="font-bold">Does trip duration affect the premium?</p>
          <p className="text-slate-600">It can. A longer trip means the cover applies for more days, which can increase the cost.</p>
        </div>
        <div>
          <p className="font-bold">Is travel insurance mandatory?</p>
          <p className="text-slate-600">Not for every international trip. Some countries or visa categories have specific insurance requirements, so check the rules for your destination.</p>
        </div>
        <div>
          <p className="font-bold">Is travel insurance required for a Schengen visa?</p>
          <p className="text-slate-600">Schengen visa applications have specific travel medical insurance requirements. Check the current official visa guidance for the required coverage and conditions before applying.</p>
        </div>
        <div>
          <p className="font-bold">Is $100,000 enough travel medical coverage?</p>
          <p className="text-slate-600">It depends on the destination, traveller and policy. Consider the potential cost of medical treatment rather than choosing a limit based only on price.</p>
        </div>
        <div>
          <p className="font-bold">Does travel insurance cover pre-existing diseases?</p>
          <p className="text-slate-600">Not automatically. Some policies exclude pre-existing conditions, while others may offer limited or specific protection.</p>
        </div>
        <div>
          <p className="font-bold">Does travel insurance cover baggage loss?</p>
          <p className="text-slate-600">Some policies cover eligible baggage loss, theft or delay. The amount payable depends on the benefit limits and circumstances of the claim.</p>
        </div>
        <div>
          <p className="font-bold">Does travel insurance cover adventure sports?</p>
          <p className="text-slate-600">Not necessarily. Some activities are excluded from standard cover or require an additional benefit. Check that your specific activity is included before travelling.</p>
        </div>
        <div>
          <p className="font-bold">Why is my insurer's quote different from the calculator?</p>
          <p className="text-slate-600">Insurers can use different underwriting rules, products, coverage levels and pricing models. As a result, two valid calculations can produce different premiums for the same trip.</p>
        </div>
        <div>
          <p className="font-bold">Is annual travel insurance valid for one continuous year abroad?</p>
          <p className="text-slate-600">Not necessarily. Annual multi-trip policies commonly have a maximum duration for each individual trip.</p>
        </div>
        <div>
          <p className="font-bold">Is a higher medical coverage amount always better?</p>
          <p className="text-slate-600">Not necessarily. A higher limit can provide greater protection, but exclusions, deductibles, sub-limits and assistance services also matter.</p>
        </div>
      </div>

      <h2 className="text-2xl font-bold mt-8 mb-4">Methodology</h2>
      <p>This calculator is designed to help you estimate travel insurance costs and compare different trip scenarios.</p>
      <p>The calculation uses the assumptions built into the calculator for factors such as destination, trip duration, traveller profile, medical coverage and selected protection.</p>
      <p>Actual insurance products can differ in their pricing and terms. India-specific regulatory and tax rules are maintained separately from the core mathematical calculation so that they can be updated without changing the underlying maths.</p>
      <p>Always review the current policy terms and destination requirements before purchasing travel insurance.</p>
    </div>
  );
};

