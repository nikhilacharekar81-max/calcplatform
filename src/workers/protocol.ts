export interface CalculationJob<T = unknown> {
  jobId: string;
  graphVersion: number;
  calculationVersion: string;
  ruleVersion: string;
  payload: T;
}

export interface CalculationSuccess<T = unknown> extends CalculationJob {
  ok: true;
  result: T;
}

export interface CalculationFailure extends CalculationJob {
  ok: false;
  error: string;
}

export type CalculationWorkerMessage<T = unknown> = CalculationSuccess<T> | CalculationFailure;
