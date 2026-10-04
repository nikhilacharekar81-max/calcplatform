import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Cpu,
  Layers,
  ShieldCheck,
  Code2,
  TrendingUp,
  FileJson,
  CheckCircle2,
  ArrowRight,
  Sliders,
  HelpCircle,
  RefreshCw,
  Info,
  DollarSign,
  PieChart as PieChartIcon,
  BarChart3,
  ExternalLink,
} from 'lucide-react';
import { api } from '../services/api.ts';
import {
  DynamicChartRenderer,
  CHART_REGISTRY,
  ComposedChartComponent,
  GroupedBarChartComponent,
  StackedBarChartComponent,
  GradientAreaChartComponent,
  DonutChartComponent,
  LineChartComponent,
} from '../components/charts/index.tsx';
import { calculateDeterministicScenario } from '../engines/scenarioEngine.ts';

export const ScenarioStudioPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'ai_dynamic' | 'deterministic_routes' | 'architecture'>('ai_dynamic');

  // Input states for Scenario
  const [annualIncome, setAnnualIncome] = useState<number>(1800000);
  const [homeLoanAmount, setHomeLoanAmount] = useState<number>(4500000);
  const [loanInterestRate, setLoanInterestRate] = useState<number>(8.75);
  const [loanTenureYears, setLoanTenureYears] = useState<number>(20);
  const [monthlySip, setMonthlySip] = useState<number>(25000);
  const [sipReturnRate, setSipReturnRate] = useState<number>(12.0);
  const [userQuery, setUserQuery] = useState<string>(
    'Should I prepay my 8.75% home loan aggressively or invest in equity SIP, and which tax regime minimizes my cash outflow?'
  );

  // Advisory layout state from server
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [advisoryData, setAdvisoryData] = useState<any>(null);
  const [showJsonInspector, setShowJsonInspector] = useState<boolean>(false);

  // Deterministic interactive state for Tab 2
  const [deterministicData, setDeterministicData] = useState<any>(null);

  // Preset scenarios
  const applyPreset = (preset: 'loan_vs_sip' | 'tax_regimes' | 'high_net_worth') => {
    if (preset === 'loan_vs_sip') {
      setAnnualIncome(1800000);
      setHomeLoanAmount(5000000);
      setLoanInterestRate(8.85);
      setLoanTenureYears(20);
      setMonthlySip(30000);
      setSipReturnRate(12.5);
      setUserQuery('Analyze opportunity cost: prepaying 50L home loan at 8.85% vs investing 30k monthly in 12.5% mutual fund SIP.');
    } else if (preset === 'tax_regimes') {
      setAnnualIncome(2400000);
      setHomeLoanAmount(4000000);
      setLoanInterestRate(8.5);
      setLoanTenureYears(15);
      setMonthlySip(20000);
      setSipReturnRate(11.0);
      setUserQuery('Which tax regime is optimal considering 2L Section 24b home loan interest and 1.5L Section 80C deductions?');
    } else if (preset === 'high_net_worth') {
      setAnnualIncome(4500000);
      setHomeLoanAmount(8500000);
      setLoanInterestRate(8.6);
      setLoanTenureYears(25);
      setMonthlySip(75000);
      setSipReturnRate(13.0);
      setUserQuery('High earner wealth structuring: allocating surplus across mega home loan service and accelerated compounding SIP.');
    }
  };

  // Run calculation and request dynamic layout
  const fetchAdvisoryLayout = async () => {
    setIsLoading(true);
    try {
      const res = await api.getAdvisoryLayout({
        annualIncome,
        homeLoanAmount,
        homeLoanInterestRate: loanInterestRate,
        homeLoanTenureYears: loanTenureYears,
        monthlyInvestment: monthlySip,
        sipReturnRate,
        userQuery,
      });
      setAdvisoryData(res);
    } catch (err) {
      console.error('Failed to fetch advisory layout:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Update deterministic preview on change
  useEffect(() => {
    const calc = calculateDeterministicScenario({
      annualIncome,
      homeLoanAmount,
      homeLoanInterestRate: loanInterestRate,
      homeLoanTenureYears: loanTenureYears,
      monthlyInvestment: monthlySip,
      sipReturnRate,
    });
    setDeterministicData(calc);
  }, [annualIncome, homeLoanAmount, loanInterestRate, loanTenureYears, monthlySip, sipReturnRate]);

  // Initial load
  useEffect(() => {
    fetchAdvisoryLayout();
  }, []);

  const formatCurrency = (val: number) => {
    if (!val && val !== 0) return '₹0';
    return `₹${Math.round(val).toLocaleString('en-IN')}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-24">
      {/* Hero Header */}
      <section className="bg-white border-b border-slate-200 pt-10 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold mb-3">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                Hybrid Architectural Pattern
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Financial Scenario & Visualization Studio
              </h1>
              <p className="mt-2 text-slate-600 max-w-3xl text-sm sm:text-base leading-relaxed">
                Deterministic mathematical accuracy meets Google AI Studio’s Structured Outputs. Standard calculators use route-based deterministic components, while multi-intent scenario dashboards use schema-driven dynamic layout registries.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => setShowJsonInspector(!showJsonInspector)}
                className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-colors border border-slate-300"
              >
                <FileJson className="w-4 h-4 text-slate-600" />
                {showJsonInspector ? 'Hide Schema' : 'Inspect JSON Schema'}
              </button>
              <button
                onClick={fetchAdvisoryLayout}
                disabled={isLoading}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#1dbf73] hover:bg-[#19a463] text-white rounded-xl text-sm font-bold shadow-xs hover:shadow-md transition-all disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                {isLoading ? 'Synthesizing...' : 'Run Scenario'}
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-200 mt-8 gap-8 text-sm font-semibold">
            <button
              onClick={() => setActiveTab('ai_dynamic')}
              className={`pb-3.5 border-b-2 flex items-center gap-2 transition-colors ${
                activeTab === 'ai_dynamic'
                  ? 'border-[#1dbf73] text-[#1dbf73]'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <Cpu className="w-4 h-4" />
              1. Schema-Driven Dynamic Advisory (AI Studio JSON)
            </button>
            <button
              onClick={() => setActiveTab('deterministic_routes')}
              className={`pb-3.5 border-b-2 flex items-center gap-2 transition-colors ${
                activeTab === 'deterministic_routes'
                  ? 'border-[#1dbf73] text-[#1dbf73]'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <Layers className="w-4 h-4" />
              2. Route-Based Deterministic Mappings
            </button>
            <button
              onClick={() => setActiveTab('architecture')}
              className={`pb-3.5 border-b-2 flex items-center gap-2 transition-colors ${
                activeTab === 'architecture'
                  ? 'border-[#1dbf73] text-[#1dbf73]'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <Code2 className="w-4 h-4" />
              3. Architectural Registry & Factory Pattern
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* ============================================================== */}
        {/* TAB 1: SCHEMA-DRIVEN DYNAMIC ADVISORY (GEMINI STRUCTURED OUTPUTS) */}
        {/* ============================================================== */}
        {activeTab === 'ai_dynamic' && (
          <div className="space-y-8">
            {/* Input Controls Card */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Sliders className="w-5 h-5 text-emerald-600" />
                    Multi-Intent Scenario Parameters
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                    Adjust variables or select a scenario to watch Gemini orchestrate the layout using Recharts Factory components.
                  </p>
                </div>

                {/* Preset Chips */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mr-1">Presets:</span>
                  <button
                    onClick={() => applyPreset('loan_vs_sip')}
                    className="text-xs font-medium px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                  >
                    Home Loan vs. SIP
                  </button>
                  <button
                    onClick={() => applyPreset('tax_regimes')}
                    className="text-xs font-medium px-3 py-1.5 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 transition-colors"
                  >
                    Tax Regime & Sec 24b
                  </button>
                  <button
                    onClick={() => applyPreset('high_net_worth')}
                    className="text-xs font-medium px-3 py-1.5 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors"
                  >
                    High Earner Allocation
                  </button>
                </div>
              </div>

              {/* Sliders Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                {/* Annual Income */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-semibold text-slate-600 uppercase">Gross Annual Income</label>
                    <span className="text-sm font-bold text-slate-900">{formatCurrency(annualIncome)}</span>
                  </div>
                  <input
                    type="range"
                    min={600000}
                    max={6000000}
                    step={100000}
                    value={annualIncome}
                    onChange={(e) => setAnnualIncome(Number(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span>₹6L</span>
                    <span>₹30L</span>
                    <span>₹60L</span>
                  </div>
                </div>

                {/* Home Loan Amount */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-semibold text-slate-600 uppercase">Home Loan Principal</label>
                    <span className="text-sm font-bold text-slate-900">{formatCurrency(homeLoanAmount)}</span>
                  </div>
                  <input
                    type="range"
                    min={1000000}
                    max={15000000}
                    step={250000}
                    value={homeLoanAmount}
                    onChange={(e) => setHomeLoanAmount(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span>₹10L</span>
                    <span>₹75L</span>
                    <span>₹1.5Cr</span>
                  </div>
                </div>

                {/* Monthly SIP */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-semibold text-slate-600 uppercase">Monthly SIP Investment</label>
                    <span className="text-sm font-bold text-slate-900">{formatCurrency(monthlySip)}/mo</span>
                  </div>
                  <input
                    type="range"
                    min={5000}
                    max={150000}
                    step={5000}
                    value={monthlySip}
                    onChange={(e) => setMonthlySip(Number(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span>₹5k</span>
                    <span>₹75k</span>
                    <span>₹1.5L</span>
                  </div>
                </div>
              </div>

              {/* Natural Language Prompt Box */}
              <div className="mt-6">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Advisory Context / Custom Scenario Query:
                </label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={userQuery}
                    onChange={(e) => setUserQuery(e.target.value)}
                    placeholder="Ask financial question, e.g. Prepayment vs SIP opportunity cost..."
                    className="flex-1 bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <button
                    onClick={fetchAdvisoryLayout}
                    disabled={isLoading}
                    className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-bold transition-all disabled:opacity-50 shrink-0"
                  >
                    {isLoading ? 'Analyzing...' : 'Re-orchestrate'}
                  </button>
                </div>
              </div>
            </div>

            {/* Schema Inspector Drawer (Collapsible) */}
            {showJsonInspector && advisoryData && (
              <div className="bg-slate-950 text-emerald-400 p-6 rounded-3xl font-mono text-xs overflow-x-auto border border-slate-800 shadow-2xl relative">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 text-slate-400">
                  <div className="flex items-center gap-2">
                    <FileJson className="w-4 h-4 text-emerald-400" />
                    <span className="font-bold text-slate-200">Google AI Studio Structured Output Schema (Response)</span>
                  </div>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800">
                    responseSchema: application/json
                  </span>
                </div>
                <pre>{JSON.stringify({
                  calculatorType: advisoryData.calculatorType,
                  scenarioTitle: advisoryData.scenarioTitle,
                  recommendedCharts: advisoryData.recommendedCharts,
                  verdict: advisoryData.verdict,
                  keyMetrics: advisoryData.keyMetrics,
                }, null, 2)}</pre>
              </div>
            )}

            {/* Dynamic Output Dashboard */}
            {isLoading ? (
              <div className="bg-white rounded-3xl border border-slate-200 p-16 text-center shadow-xs">
                <RefreshCw className="w-10 h-10 text-emerald-500 animate-spin mx-auto mb-4" />
                <h4 className="text-lg font-bold text-slate-800">Orchestrating Structured Financial Advisory</h4>
                <p className="text-slate-500 text-sm max-w-md mx-auto mt-1">
                  Computing deterministic mathematical schedules and requesting optimal Recharts layout schema from Gemini...
                </p>
              </div>
            ) : advisoryData ? (
              <div className="space-y-8">
                {/* Executive Summary & Strategic Verdict */}
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                    <div className="space-y-3 max-w-3xl">
                      <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-widest">
                        <ShieldCheck className="w-4 h-4" />
                        AI Advisory Synthesis • {advisoryData.scenarioTitle}
                      </div>
                      <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
                        {advisoryData.executiveSummary}
                      </p>
                      <div className="pt-2">
                        <div className="inline-block bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 text-xs sm:text-sm text-emerald-300 font-medium">
                          <strong>Strategic Verdict:</strong> {advisoryData.verdict}
                        </div>
                      </div>
                    </div>

                    {/* Action Points */}
                    {advisoryData.actionPoints && advisoryData.actionPoints.length > 0 && (
                      <div className="bg-white/5 border border-white/10 rounded-2xl p-5 md:w-80 shrink-0">
                        <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          Recommended Steps
                        </h5>
                        <ul className="space-y-2.5 text-xs text-slate-300">
                          {advisoryData.actionPoints.map((pt: string, idx: number) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                              <span>{pt}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                {/* Key Metrics Grid */}
                {advisoryData.keyMetrics && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {advisoryData.keyMetrics.map((metric: any, idx: number) => (
                      <div
                        key={idx}
                        className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs transition-all hover:shadow-md"
                      >
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                          {metric.label}
                        </span>
                        <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                          {metric.value}
                        </div>
                        {metric.subtext && (
                          <div className={`text-xs mt-1.5 font-medium ${
                            metric.status === 'positive' ? 'text-emerald-600' :
                            metric.status === 'warning' ? 'text-amber-600' : 'text-slate-500'
                          }`}>
                            {metric.subtext}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Dynamic Recharts Layout Rendered via Factory Registry Pattern */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-blue-600" />
                        Component Registry Rendering (Recharts Factory)
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        The frontend reads the JSON schema returned by Gemini and dynamically mounts the exact Recharts components from <code className="bg-slate-100 text-slate-700 px-1 py-0.5 rounded text-[11px]">CHART_REGISTRY</code>.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {advisoryData.recommendedCharts?.map((chartConfig: any, index: number) => {
                      const dataset = advisoryData.chartDataSets?.[chartConfig.dataKey] || [];
                      return (
                        <div key={chartConfig.chartId || index} className="flex flex-col">
                          <DynamicChartRenderer
                            componentName={chartConfig.componentName}
                            data={dataset}
                            title={chartConfig.title}
                            parameters={{
                              ...chartConfig.parameters,
                              currencySymbol: '₹',
                            }}
                          />
                          {chartConfig.description && (
                            <p className="mt-2 text-xs text-slate-500 px-2 italic">
                              {chartConfig.description}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: ROUTE-BASED DETERMINISTIC MAPPING (CORE FOUNDATION) */}
        {/* ============================================================== */}
        {activeTab === 'deterministic_routes' && (
          <div className="space-y-8">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
              <div className="flex items-center gap-3 mb-2">
                <ShieldCheck className="w-6 h-6 text-emerald-600" />
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                  Deterministic Route-Based Page Mapping
                </h3>
              </div>
              <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
                For standard financial calculators, layouts are never left to AI randomness. Instead, each route is strictly mapped to hardcoded, regulation-compliant Recharts visualizations:
              </p>

              {/* 3 Core Route Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                {/* Route 1 */}
                <div className="border border-slate-200 rounded-2xl p-5 bg-slate-50/50 hover:bg-white hover:shadow-md transition-all">
                  <div className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md inline-block mb-3">
                    /calculators/income-tax
                  </div>
                  <h4 className="font-bold text-slate-900 text-base mb-1">Income Tax Calculator</h4>
                  <p className="text-xs text-slate-600 mb-4">
                    Renders <strong>Grouped Bar Charts</strong> (Old vs. New Regime) and <strong>Tax Slab Breakdown Donut Charts</strong>.
                  </p>
                  <div className="text-xs text-slate-500 font-semibold flex items-center gap-1.5 text-blue-700">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Predictable Compliance Format
                  </div>
                </div>

                {/* Route 2 */}
                <div className="border border-slate-200 rounded-2xl p-5 bg-slate-50/50 hover:bg-white hover:shadow-md transition-all">
                  <div className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md inline-block mb-3">
                    /calculators/home-loan
                  </div>
                  <h4 className="font-bold text-slate-900 text-base mb-1">Home Loan / EMI Calculator</h4>
                  <p className="text-xs text-slate-600 mb-4">
                    Renders <strong>Stacked Amortization Bars</strong> and <strong>Composed Charts</strong> (Principal vs. Outstanding Balance).
                  </p>
                  <div className="text-xs text-slate-500 font-semibold flex items-center gap-1.5 text-indigo-700">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Amortization Table Integration
                  </div>
                </div>

                {/* Route 3 */}
                <div className="border border-slate-200 rounded-2xl p-5 bg-slate-50/50 hover:bg-white hover:shadow-md transition-all">
                  <div className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md inline-block mb-3">
                    /calculators/sip
                  </div>
                  <h4 className="font-bold text-slate-900 text-base mb-1">SIP / Mutual Fund Calculator</h4>
                  <p className="text-xs text-slate-600 mb-4">
                    Renders <strong>Gradient Area Charts</strong> illustrating wealth compounding over 10–30 years.
                  </p>
                  <div className="text-xs text-slate-500 font-semibold flex items-center gap-1.5 text-emerald-700">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Exponential Wealth Curve
                  </div>
                </div>
              </div>
            </div>

            {/* Live Interactive Deterministic Gallery */}
            {deterministicData && (
              <div className="space-y-6">
                <h4 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                  Live Preview of Deterministic Route Components
                </h4>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Income Tax Route Preview */}
                  <GroupedBarChartComponent
                    data={deterministicData.chartDataSets.regimeComparison}
                    title="Route /calculators/income-tax: Old vs. New Regime Grouped Bars"
                    parameters={{ xAxisKey: 'label', currencySymbol: '₹' }}
                  />

                  {/* Slabs Donut Preview */}
                  <DonutChartComponent
                    data={deterministicData.chartDataSets.slabs}
                    title="Route /calculators/income-tax: Tax Slab & Expense Allocation Donut"
                    parameters={{ currencySymbol: '₹' }}
                  />

                  {/* Home Loan Composed Preview */}
                  <ComposedChartComponent
                    data={deterministicData.chartDataSets.amortization}
                    title="Route /calculators/home-loan: Principal Repaid vs Balance Composed Chart"
                    parameters={{ showBrush: true, xAxisKey: 'year', currencySymbol: '₹' }}
                  />

                  {/* SIP Gradient Area Preview */}
                  <GradientAreaChartComponent
                    data={deterministicData.chartDataSets.compounding}
                    title="Route /calculators/sip: Gradient Area Wealth Compounding Curve"
                    parameters={{ xAxisKey: 'year', currencySymbol: '₹' }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: ARCHITECTURAL BLUEPRINT & REGISTRY FACTORY PATTERN */}
        {/* ============================================================== */}
        {activeTab === 'architecture' && (
          <div className="space-y-8">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-2">
                The Hybrid Architectural Blueprint
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed max-w-3xl">
                How enterprise financial platforms reconcile mathematical guarantees with generative AI capabilities:
              </p>

              {/* Architecture Pipeline Visualization */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 relative">
                {/* Step 1 */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 relative">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm mb-4">
                    1
                  </div>
                  <h4 className="font-bold text-slate-900 text-base mb-2">Deterministic Math Engine</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Calculations (amortization schedules, compounding formulas, tax slabs) are executed strictly in pure TypeScript engines. <strong>Zero LLM guessing or hallucinated numbers.</strong>
                  </p>
                </div>

                {/* Step 2 */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 relative">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-sm mb-4">
                    2
                  </div>
                  <h4 className="font-bold text-slate-900 text-base mb-2">Structured Output Schema</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Google AI Studio’s Gemini API receives the deterministic numbers and a strict <code className="bg-slate-200 text-slate-800 px-1 py-0.5 rounded text-[11px]">responseSchema</code>. It outputs a typed JSON layout schema choosing which charts to prioritize.
                  </p>
                </div>

                {/* Step 3 */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 relative">
                  <div className="w-8 h-8 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center text-sm mb-4">
                    3
                  </div>
                  <h4 className="font-bold text-slate-900 text-base mb-2">React Component Registry</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    The frontend <code className="bg-slate-200 text-slate-800 px-1 py-0.5 rounded text-[11px]">DynamicChartRenderer</code> maps string identifiers directly to battle-tested Recharts component implementations via the Factory Pattern.
                  </p>
                </div>
              </div>

              {/* Code Snippets */}
              <div className="mt-8 space-y-4">
                <h4 className="text-base font-bold text-slate-900">
                  Production Component Registry Pattern
                </h4>
                <div className="bg-slate-950 text-slate-200 p-5 rounded-2xl font-mono text-xs overflow-x-auto border border-slate-800">
                  <pre>{`// 1. Define the Component Registry Map
export const CHART_REGISTRY: Record<string, React.FC<any>> = {
  ComposedChart: ComposedChartComponent,
  GroupedBarChart: GroupedBarChartComponent,
  StackedBarChart: StackedBarChartComponent,
  GradientAreaChart: GradientAreaChartComponent,
  DonutChart: DonutChartComponent,
  LineChart: LineChartComponent,
};

// 2. Factory Pattern Renderer
export const DynamicChartRenderer = ({ componentName, data, parameters, title }) => {
  const TargetChartComponent = CHART_REGISTRY[componentName];
  if (!TargetChartComponent) return <div>Chart component not found</div>;
  return <TargetChartComponent data={data} parameters={parameters} title={title} />;
};`}</pre>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
