import React from 'react';
import { LucideIcon } from 'lucide-react';
import {
  Sliders,
  Award,
  PieChart,
  Table,
  BarChart3,
  Code2,
  BookOpen,
  FileCheck,
  HelpCircle,
  GitCompare,
  Clock,
  Info,
} from 'lucide-react';
import { CalculatorModuleConfig, Calculator, CalculatorOutput } from '../../../types/schema.ts';

// Actual Reusable Module Components
import { InputsModule } from './InputsModule.tsx';
import { ResultCardsModule } from './ResultCardsModule.tsx';
import { ChartVisualizerModule } from './ChartVisualizerModule.tsx';
import { BreakdownVisualizerModule } from './BreakdownVisualizerModule.tsx';
import { AmortizationTableModule } from './AmortizationTableModule.tsx';
import { ScenarioComparisonModule } from './ScenarioComparisonModule.tsx';
import { TimelineMilestonesModule } from './TimelineMilestonesModule.tsx';
import { FormulaMethodologyModule } from './FormulaMethodologyModule.tsx';
import { HowToGuideModule } from './HowToGuideModule.tsx';
import { WorkedExamplesModule } from './WorkedExamplesModule.tsx';
import { FaqAccordionModule } from './FaqAccordionModule.tsx';
import { AssumptionsInfoModule } from './AssumptionsInfoModule.tsx';

export type CanonicalModuleId =
  | 'calculator-inputs'
  | 'result-cards'
  | 'chart-visualizer'
  | 'breakdown-visualizer'
  | 'amortization-table'
  | 'scenario-comparison'
  | 'timeline-milestones'
  | 'formula-methodology'
  | 'how-to-guide'
  | 'worked-examples'
  | 'faq-accordion'
  | 'assumptions-info';

/**
 * Normalizes any module ID or legacy alias into the canonical Module ID.
 */
export function normalizeModuleId(rawId: string): CanonicalModuleId | null {
  if (!rawId) return null;
  const clean = rawId.trim().toLowerCase();

  switch (clean) {
    case 'calculator-inputs':
    case 'inputs':
    case 'calculator_inputs':
    case 'inputs-module':
      return 'calculator-inputs';

    case 'result-cards':
    case 'results':
    case 'result_cards':
    case 'kpi-summary':
    case 'results-cards':
      return 'result-cards';

    case 'chart-visualizer':
    case 'chart':
    case 'charts':
    case 'chart_visualizer':
    case 'chart-engine':
      return 'chart-visualizer';

    case 'breakdown-visualizer':
    case 'breakdown':
    case 'breakdown_visualizer':
      return 'breakdown-visualizer';

    case 'amortization-table':
    case 'amortization':
    case 'table':
    case 'schedule-table':
    case 'amortization_table':
      return 'amortization-table';

    case 'scenario-comparison':
    case 'scenario':
    case 'scenarios':
    case 'scenario_comparison':
      return 'scenario-comparison';

    case 'timeline-milestones':
    case 'timeline':
    case 'milestones':
    case 'timeline_milestones':
      return 'timeline-milestones';

    case 'formula-methodology':
    case 'formula':
    case 'formulas':
    case 'methodology':
    case 'formula_methodology':
      return 'formula-methodology';

    case 'how-to-guide':
    case 'how-to':
    case 'guide':
    case 'instructions':
    case 'how_to_guide':
      return 'how-to-guide';

    case 'worked-examples':
    case 'examples':
    case 'scenarios-examples':
    case 'worked_examples':
      return 'worked-examples';

    case 'faq-accordion':
    case 'faq':
    case 'faqs':
    case 'faq_accordion':
      return 'faq-accordion';

    case 'assumptions-info':
    case 'assumptions':
    case 'disclosures':
    case 'rules':
    case 'assumptions_info':
      return 'assumptions-info';

    default:
      return null;
  }
}

export interface ModuleDefinition {
  id: CanonicalModuleId;
  name: string;
  category: 'core' | 'visualization' | 'analytics' | 'content' | 'interactive';
  description: string;
  icon: LucideIcon;
  defaultEnabled: boolean;
  defaultOrder: number;
  settingsSchema: {
    key: string;
    label: string;
    type: 'text' | 'select' | 'boolean' | 'number';
    options?: Array<{ label: string; value: any }>;
    defaultValue: any;
    helpText?: string;
  }[];
}

export const MODULE_REGISTRY: ModuleDefinition[] = [
  {
    id: 'calculator-inputs',
    name: 'Interactive Inputs & Controls',
    category: 'core',
    description: 'Dynamic user inputs (numeric fields, sliders, dropdown selects, radios, checkboxes, and date pickers) with real-time recalculation.',
    icon: Sliders,
    defaultEnabled: true,
    defaultOrder: 1,
    settingsSchema: [
      {
        key: 'title',
        label: 'Section Title',
        type: 'text',
        defaultValue: 'Parameters & Inputs',
        helpText: 'Title displayed above input controls',
      },
      {
        key: 'layout',
        label: 'Inputs Layout',
        type: 'select',
        options: [
          { label: 'Single Column (Stacked)', value: 'single' },
          { label: 'Two Columns (Grid)', value: 'two-column' },
        ],
        defaultValue: 'two-column',
      },
      {
        key: 'showResetButton',
        label: 'Show Reset Button',
        type: 'boolean',
        defaultValue: true,
      },
    ],
  },
  {
    id: 'result-cards',
    name: 'Results & KPI Summary',
    category: 'core',
    description: 'Prominent highlight summary cards displaying primary calculated results, KPI metrics, difference indicators, and copy/share actions.',
    icon: Award,
    defaultEnabled: true,
    defaultOrder: 2,
    settingsSchema: [
      {
        key: 'title',
        label: 'Section Title',
        type: 'text',
        defaultValue: 'Calculated Results',
      },
      {
        key: 'highlightCardStyle',
        label: 'Primary Hero Card Style',
        type: 'select',
        options: [
          { label: 'Emerald Gradient Accent', value: 'emerald' },
          { label: 'Dark Midnight Slate', value: 'dark' },
          { label: 'Clean Border Minimal', value: 'minimal' },
        ],
        defaultValue: 'emerald',
      },
      {
        key: 'showShareActions',
        label: 'Show Copy & Share Buttons',
        type: 'boolean',
        defaultValue: true,
      },
    ],
  },
  {
    id: 'chart-visualizer',
    name: 'Visual Chart & Graph Engine',
    category: 'visualization',
    description: 'Interactive SVG / Canvas charts (Donut breakdown, Trajectory area, Bar charts, and Monte Carlo trend visualizers).',
    icon: PieChart,
    defaultEnabled: true,
    defaultOrder: 3,
    settingsSchema: [
      {
        key: 'chartType',
        label: 'Visualization Type',
        type: 'select',
        options: [
          { label: 'Donut / Pie Breakdown', value: 'donut' },
          { label: 'Growth Area Chart', value: 'area' },
          { label: 'Bar Comparison', value: 'bar' },
        ],
        defaultValue: 'donut',
      },
      {
        key: 'chartTitle',
        label: 'Chart Section Title',
        type: 'text',
        defaultValue: 'Visual Breakdown',
      },
      {
        key: 'showLegend',
        label: 'Show Color Legend',
        type: 'boolean',
        defaultValue: true,
      },
    ],
  },
  {
    id: 'breakdown-visualizer',
    name: 'Distribution & Itemized Breakdown',
    category: 'visualization',
    description: 'Itemized proportional distribution bars and percentage component breakdown cards.',
    icon: BarChart3,
    defaultEnabled: true,
    defaultOrder: 4,
    settingsSchema: [
      {
        key: 'title',
        label: 'Section Title',
        type: 'text',
        defaultValue: 'Distribution Breakdown',
      },
      {
        key: 'showPercentages',
        label: 'Show Percentage Values',
        type: 'boolean',
        defaultValue: true,
      },
    ],
  },
  {
    id: 'amortization-table',
    name: 'Amortization & Schedule Table',
    category: 'analytics',
    description: 'Detailed period-by-period payment and milestone schedule table with monthly/yearly toggle and CSV export.',
    icon: Table,
    defaultEnabled: false,
    defaultOrder: 5,
    settingsSchema: [
      {
        key: 'title',
        label: 'Table Title',
        type: 'text',
        defaultValue: 'Payment & Growth Schedule',
      },
      {
        key: 'defaultView',
        label: 'Default Period View',
        type: 'select',
        options: [
          { label: 'Yearly Schedule', value: 'yearly' },
          { label: 'Monthly Schedule', value: 'monthly' },
        ],
        defaultValue: 'yearly',
      },
      {
        key: 'pageSize',
        label: 'Rows Per Page',
        type: 'number',
        defaultValue: 10,
      },
    ],
  },
  {
    id: 'scenario-comparison',
    name: 'Scenario & Alternative Comparator',
    category: 'analytics',
    description: 'Side-by-side alternative scenario modeling to compare conservative, expected, and aggressive options.',
    icon: GitCompare,
    defaultEnabled: false,
    defaultOrder: 6,
    settingsSchema: [
      {
        key: 'title',
        label: 'Section Title',
        type: 'text',
        defaultValue: 'Scenario Comparison & Sensitivity',
      },
    ],
  },
  {
    id: 'timeline-milestones',
    name: 'Milestone & Growth Timeline',
    category: 'analytics',
    description: 'Chronological timeline mapping loan completion, payoff dates, or wealth-building investment milestones.',
    icon: Clock,
    defaultEnabled: false,
    defaultOrder: 7,
    settingsSchema: [
      {
        key: 'title',
        label: 'Section Title',
        type: 'text',
        defaultValue: 'Key Milestones & Timeline',
      },
    ],
  },
  {
    id: 'formula-methodology',
    name: 'Formula, Math & Logic Steps',
    category: 'content',
    description: 'Mathematical equations, computational logic, formula derivation, rounding rules, and variable definitions.',
    icon: Code2,
    defaultEnabled: true,
    defaultOrder: 8,
    settingsSchema: [
      {
        key: 'title',
        label: 'Section Title',
        type: 'text',
        defaultValue: 'Formula & Mathematical Logic',
      },
      {
        key: 'showStepByStep',
        label: 'Show Variable Breakdown',
        type: 'boolean',
        defaultValue: true,
      },
    ],
  },
  {
    id: 'how-to-guide',
    name: 'How-to Guide & Instructions',
    category: 'content',
    description: 'Step-by-step user manual explaining input requirements, how to interpret outputs, and expert tips.',
    icon: BookOpen,
    defaultEnabled: true,
    defaultOrder: 9,
    settingsSchema: [
      {
        key: 'title',
        label: 'Section Title',
        type: 'text',
        defaultValue: 'How to Use This Calculator',
      },
    ],
  },
  {
    id: 'worked-examples',
    name: 'Worked Examples & Real Scenarios',
    category: 'content',
    description: 'Real-world case studies and worked examples with explicit numerical inputs and verified outcomes.',
    icon: FileCheck,
    defaultEnabled: true,
    defaultOrder: 10,
    settingsSchema: [
      {
        key: 'title',
        label: 'Section Title',
        type: 'text',
        defaultValue: 'Worked Examples & Scenarios',
      },
    ],
  },
  {
    id: 'faq-accordion',
    name: 'FAQ Accordion & Schema Q&A',
    category: 'content',
    description: 'Interactive collapsible FAQ accordion providing authoritative answers and Schema.org FAQPage rich snippets.',
    icon: HelpCircle,
    defaultEnabled: true,
    defaultOrder: 11,
    settingsSchema: [
      {
        key: 'title',
        label: 'Section Title',
        type: 'text',
        defaultValue: 'Frequently Asked Questions',
      },
      {
        key: 'allowMultipleOpen',
        label: 'Allow Multiple FAQs Open Simultaneously',
        type: 'boolean',
        defaultValue: false,
      },
    ],
  },
  {
    id: 'assumptions-info',
    name: 'Assumptions, Rules & Disclosures',
    category: 'content',
    description: 'Disclosures, statutory tax rates, standard inflation rules, benchmark interest rates, and regulatory notes.',
    icon: Info,
    defaultEnabled: true,
    defaultOrder: 12,
    settingsSchema: [
      {
        key: 'title',
        label: 'Section Title',
        type: 'text',
        defaultValue: 'Key Assumptions & Statutory Notes',
      },
    ],
  },
];

export function getDefaultModuleConfigs(): CalculatorModuleConfig[] {
  return MODULE_REGISTRY.map((mod) => {
    const defaultSettings: Record<string, any> = {};
    mod.settingsSchema.forEach((s) => {
      defaultSettings[s.key] = s.defaultValue;
    });
    return {
      id: `mod_${mod.id}`,
      moduleId: mod.id,
      name: mod.name,
      isEnabled: mod.defaultEnabled,
      order: mod.defaultOrder,
      settings: defaultSettings,
    };
  });
}

export interface ModuleRenderProps {
  calculator: Calculator;
  formValues: Record<string, any>;
  evaluatedOutputs: Array<{
    def: CalculatorOutput;
    formatted: string;
    raw: number | string | boolean;
  }>;
  onInputChange: (fieldId: string, value: any) => void;
  onReset: () => void;
  settings?: Record<string, any>;
}

/**
 * Central Mapping: Maps every CanonicalModuleId directly to its real React component.
 * Guaranteed 1-to-1 connection between ModuleRegistry and the live rendering pipeline.
 */
export const MODULE_COMPONENT_MAP: Record<CanonicalModuleId, React.FC<ModuleRenderProps>> = {
  'calculator-inputs': function CalculatorInputsComponent(props) {
    return (
      <InputsModule
        fields={props.calculator.fields || []}
        formValues={props.formValues}
        onValueChange={props.onInputChange}
        onReset={props.onReset}
        settings={props.settings}
      />
    );
  },
  'result-cards': function ResultCardsComponent(props) {
    return (
      <ResultCardsModule
        outputs={props.evaluatedOutputs}
        calculatorName={props.calculator.name}
        settings={props.settings}
      />
    );
  },
  'chart-visualizer': function ChartVisualizerComponent(props) {
    return (
      <ChartVisualizerModule
        outputs={props.evaluatedOutputs}
        chartConfig={props.calculator.chartConfig}
        settings={props.settings}
      />
    );
  },
  'breakdown-visualizer': function BreakdownVisualizerComponent(props) {
    return (
      <BreakdownVisualizerModule
        outputs={props.evaluatedOutputs}
        settings={props.settings}
      />
    );
  },
  'amortization-table': function AmortizationTableComponent(props) {
    return (
      <AmortizationTableModule
        outputs={props.evaluatedOutputs}
        settings={props.settings}
      />
    );
  },
  'scenario-comparison': function ScenarioComparisonComponent(props) {
    return (
      <ScenarioComparisonModule
        outputs={props.evaluatedOutputs}
        settings={props.settings}
      />
    );
  },
  'timeline-milestones': function TimelineMilestonesComponent(props) {
    return (
      <TimelineMilestonesModule
        outputs={props.evaluatedOutputs}
        settings={props.settings}
      />
    );
  },
  'formula-methodology': function FormulaMethodologyComponent(props) {
    return (
      <FormulaMethodologyModule
        calculatorId={props.calculator.id}
        calculatorSlug={props.calculator.slug}
        outputs={props.calculator.outputs || []}
        fields={props.calculator.fields || []}
        content={props.calculator.content}
        settings={props.settings}
      />
    );
  },
  'how-to-guide': function HowToGuideComponent(props) {
    return (
      <HowToGuideModule
        calculatorId={props.calculator.id}
        calculatorSlug={props.calculator.slug}
        calculatorName={props.calculator.name}
        usageInstructions={props.calculator.content?.usageInstructions}
        contentSections={props.calculator.contentSections}
        settings={props.settings}
      />
    );
  },
  'worked-examples': function WorkedExamplesComponent(props) {
    return (
      <WorkedExamplesModule
        calculatorId={props.calculator.id}
        calculatorSlug={props.calculator.slug}
        calculatorName={props.calculator.name}
        examples={props.calculator.examples}
        settings={props.settings}
      />
    );
  },
  'faq-accordion': function FaqAccordionComponent(props) {
    return (
      <FaqAccordionModule
        calculatorId={props.calculator.id}
        calculatorSlug={props.calculator.slug}
        faqs={props.calculator.faqs || props.calculator.content?.faqs}
        settings={props.settings}
      />
    );
  },
  'assumptions-info': function AssumptionsInfoComponent(props) {
    return (
      <AssumptionsInfoModule
        calculatorId={props.calculator.id}
        calculatorSlug={props.calculator.slug}
        contentSections={props.calculator.contentSections}
        settings={props.settings}
      />
    );
  },
};