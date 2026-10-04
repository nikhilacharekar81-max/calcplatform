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
  validate?: (input: TInput) => CalculationErrorItem[];
  execute(input: TInput): TResult;
}

export type CalculationMiddleware = (
  engineKey: string,
  input: any,
  next: () => any
) => any;

export type CalculationEventType = 'calculate' | 'error' | 'cache_hit' | 'batch_complete';

export class EliteCalculatorEngineRegistry {
  private readonly engines = new Map<string, CalculatorEngineAdapter>();
  private readonly cache = new Map<string, { data: any; expiry: number }>();
  private readonly middlewares: CalculationMiddleware[] = [];
  private readonly listeners = new Map<CalculationEventType, Array<(payload: any) => void>>();
  private cacheTtlMs = 60000;

  register(adapter: CalculatorEngineAdapter): void {
    this.engines.set(adapter.engineKey, adapter);
  }

  use(middleware: CalculationMiddleware): void {
    this.middlewares.push(middleware);
  }

  on(event: CalculationEventType, callback: (payload: any) => void): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  private emit(event: CalculationEventType, payload: any): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach((cb) => cb(payload));
    }
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
      const errRes: CalculationError = {
        success: false,
        errors: [{ field: 'engineKey', message: `Unknown calculation engine key: ${engineKey}`, code: 'UNKNOWN_ENGINE' }],
      };
      this.emit('error', { engineKey, input, errors: errRes.errors });
      return errRes;
    }

    // Run optional adapter validation
    if (adapter.validate) {
      const validationErrors = adapter.validate(input);
      if (validationErrors.length > 0) {
        const errRes: CalculationError = { success: false, errors: validationErrors };
        this.emit('error', { engineKey, input, errors: validationErrors });
        return errRes;
      }
    }

    const cacheKey = `${engineKey}:${adapter.calculationVersion}:${JSON.stringify(input)}`;
    const now = Date.now();

    if (useCache && this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey)!;
      if (cached.expiry > now) {
        const successRes: CalculationSuccess<TResult> = {
          success: true,
          data: cached.data,
          metadata: { engineKey, calculationVersion: adapter.calculationVersion, computedAt: new Date(now).toISOString(), cached: true },
        };
        this.emit('cache_hit', { engineKey, input });
        return successRes;
      } else {
        this.cache.delete(cacheKey);
      }
    }

    const startTime = performance.now();

    try {
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

      const successRes: CalculationSuccess<TResult> = {
        success: true,
        data,
        metadata: { engineKey, calculationVersion: adapter.calculationVersion, computedAt: new Date().toISOString(), executionTimeMs, cached: false },
      };

      this.emit('calculate', { engineKey, input, metadata: successRes.metadata });
      return successRes;
    } catch (error: any) {
      const errRes: CalculationError = {
        success: false,
        errors: [{ field: 'execution', message: error.message || 'Calculation execution failed.', code: 'CALCULATION_EXECUTION_ERROR' }],
      };
      this.emit('error', { engineKey, input, errors: errRes.errors });
      return errRes;
    }
  }

  async executeBatch(
    requests: Array<{ engineKey: string; input: any; useCache?: boolean }>
  ): Promise<Array<CalculationEnvelope<any>>> {
    const results = await Promise.all(
      requests.map(async (req) => this.executeEngine(req.engineKey, req.input, req.useCache))
    );
    this.emit('batch_complete', { count: requests.length });
    return results;
  }
}

export const calculatorEngineRegistry = new EliteCalculatorEngineRegistry();

// Telemetry & Event Logging Middleware
calculatorEngineRegistry.on('calculate', (payload) => {
  // Event-driven telemetry hook
});

calculatorEngineRegistry.on('error', (payload) => {
  // Event-driven error reporting hook
});

// Register official Income Tax Engine Adapter (AY 2026-27) with runtime validation
calculatorEngineRegistry.register({
  engineKey: 'calculateIndiaIncomeTax',
  calculationVersion: 'AY-2026-27',
  validate(input: IndiaIncomeTaxInput) {
    const errors: CalculationErrorItem[] = [];
    if (input.grossIncome === undefined || input.grossIncome < 0 || !Number.isFinite(input.grossIncome)) {
      errors.push({ field: 'grossIncome', message: 'Gross income must be a valid non-negative number.', code: 'INVALID_INPUT' });
    }
    return errors;
  },
  execute(input: IndiaIncomeTaxInput): IndiaIncomeTaxResult {
    return calculateIndiaIncomeTax(input);
  },
});
