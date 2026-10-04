import { calculateIndiaIncomeTax, IndiaIncomeTaxInput, IndiaIncomeTaxResult } from '../calculators/india/incomeTax.ts';

export interface CalculationSuccess<T> {
  success: true;
  data: T;
  metadata: {
    engineKey: string;
    calculationVersion: string;
    computedAt: string;
    executionTimeMs?: number;
    cached?: boolean;
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
  execute(input: TInput): TResult;
}

export type CalculationMiddleware = (
  engineKey: string,
  input: any,
  next: () => any
) => any;

export class AdvancedCalculatorEngineRegistry {
  private readonly engines = new Map<string, CalculatorEngineAdapter>();
  private readonly cache = new Map<string, { data: any; expiry: number }>();
  private readonly middlewares: CalculationMiddleware[] = [];
  private cacheTtlMs = 60000; // 1 min cache

  register(adapter: CalculatorEngineAdapter): void {
    this.engines.set(adapter.engineKey, adapter);
  }

  use(middleware: CalculationMiddleware): void {
    this.middlewares.push(middleware);
  }

  resolve(engineKey: string): CalculatorEngineAdapter | undefined {
    return this.engines.get(engineKey);
  }

  clearCache(): void {
    this.cache.clear();
  }

  executeEngine<TInput, TResult>(
    engineKey: string,
    input: TInput,
    useCache = true
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

    const cacheKey = `${engineKey}:${adapter.calculationVersion}:${JSON.stringify(input)}`;
    const now = Date.now();

    if (useCache && this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey)!;
      if (cached.expiry > now) {
        return {
          success: true,
          data: cached.data,
          metadata: {
            engineKey,
            calculationVersion: adapter.calculationVersion,
            computedAt: new Date(now).toISOString(),
            cached: true,
          },
        };
      } else {
        this.cache.delete(cacheKey);
      }
    }

    const startTime = performance.now();

    try {
      // Execute middleware chain
      let index = 0;
      const dispatch = (): any => {
        if (index < this.middlewares.length) {
          const mw = this.middlewares[index++];
          return mw(engineKey, input, dispatch);
        }
        return adapter.execute(input);
      };

      const data = dispatch();
      const endTime = performance.now();
      const executionTimeMs = Math.round((endTime - startTime) * 100) / 100;

      if (useCache) {
        this.cache.set(cacheKey, { data, expiry: now + this.cacheTtlMs });
      }

      return {
        success: true,
        data,
        metadata: {
          engineKey,
          calculationVersion: adapter.calculationVersion,
          computedAt: new Date().toISOString(),
          executionTimeMs,
          cached: false,
        },
      };
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

  async executeEngineAsync<TInput, TResult>(
    engineKey: string,
    input: TInput,
    useCache = true
  ): Promise<CalculationEnvelope<TResult>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.executeEngine<TInput, TResult>(engineKey, input, useCache));
      }, 0);
    });
  }
}

export const calculatorEngineRegistry = new AdvancedCalculatorEngineRegistry();

// Add Audit / Telemetry Middleware
calculatorEngineRegistry.use((engineKey, input, next) => {
  const result = next();
  return result;
});

// Register official Income Tax Engine Adapter (AY 2026-27)
calculatorEngineRegistry.register({
  engineKey: 'calculateIndiaIncomeTax',
  calculationVersion: 'AY-2026-27',
  execute(input: IndiaIncomeTaxInput): IndiaIncomeTaxResult {
    if (input.grossIncome === undefined || input.grossIncome < 0 || !Number.isFinite(input.grossIncome)) {
      throw new Error('Gross income must be a valid non-negative number.');
    }
    return calculateIndiaIncomeTax(input);
  },
});
