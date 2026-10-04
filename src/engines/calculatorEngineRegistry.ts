import { calculateIndiaIncomeTax, IndiaIncomeTaxInput, IndiaIncomeTaxResult } from '../calculators/india/incomeTax.ts';

export interface CalculationSuccess<T> {
  success: true;
  data: T;
  metadata: {
    engineKey: string;
    calculationVersion: string;
    computedAt: string;
  };
}

export interface CalculationErrorItem {
  field: string;
  message: string;
  code: string;
}

export interface CalculationError {
  success: false;
  errors: CalculationErrorItem[];
}

export type CalculationEnvelope<T> = CalculationSuccess<T> | CalculationError;

export interface CalculatorEngineAdapter<TInput = any, TResult = any> {
  engineKey: string;
  calculationVersion: string;
  execute(input: TInput): CalculationEnvelope<TResult>;
}

export class CalculatorEngineRegistry {
  private readonly engines = new Map<string, CalculatorEngineAdapter>();

  register(adapter: CalculatorEngineAdapter): void {
    this.engines.set(adapter.engineKey, adapter);
  }

  resolve(engineKey: string): CalculatorEngineAdapter | undefined {
    return this.engines.get(engineKey);
  }

  executeEngine<TInput, TResult>(
    engineKey: string,
    input: TInput
  ): CalculationEnvelope<TResult> {
    const adapter = this.resolve(engineKey);
    if (!adapter) {
      return {
        success: false,
        errors: [
          {
            field: 'engineKey',
            message: `Unknown calculation engine key: ${engineKey}`,
            code: 'UNKNOWN_ENGINE',
          },
        ],
      };
    }

    try {
      return adapter.execute(input);
    } catch (error: any) {
      return {
        success: false,
        errors: [
          {
            field: 'execution',
            message: error.message || 'Calculation execution failed.',
            code: 'CALCULATION_EXECUTION_ERROR',
          },
        ],
      };
    }
  }
}

export const calculatorEngineRegistry = new CalculatorEngineRegistry();

// Register official Income Tax Engine Adapter (AY 2026-27)
calculatorEngineRegistry.register({
  engineKey: 'calculateIndiaIncomeTax',
  calculationVersion: 'AY-2026-27',
  execute(input: IndiaIncomeTaxInput): CalculationEnvelope<IndiaIncomeTaxResult> {
    const errors: CalculationErrorItem[] = [];
    if (input.grossIncome === undefined || input.grossIncome < 0 || !Number.isFinite(input.grossIncome)) {
      errors.push({ field: 'grossIncome', message: 'Gross income must be a valid non-negative number.', code: 'INVALID_INPUT' });
    }
    if (errors.length > 0) {
      return { success: false, errors };
    }

    const result = calculateIndiaIncomeTax(input);
    return {
      success: true,
      data: result,
      metadata: {
        engineKey: 'calculateIndiaIncomeTax',
        calculationVersion: 'AY-2026-27',
        computedAt: new Date().toISOString(),
      },
    };
  },
});
