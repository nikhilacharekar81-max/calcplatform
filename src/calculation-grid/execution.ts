export interface ExecutionVersion {
  graphVersion: number;
  calculationVersion: string;
  ruleVersion: string;
}

export interface ExecutionResult<T> {
  version: ExecutionVersion;
  result: T;
}

/**
 * Rejects stale results if graphVersion, calculationVersion, or ruleVersion have shifted.
 */
export function acceptIfCurrent<T>(
  current: ExecutionVersion,
  candidate: ExecutionResult<T>
): T | null {
  return current.graphVersion === candidate.version.graphVersion &&
    current.calculationVersion === candidate.version.calculationVersion &&
    current.ruleVersion === candidate.version.ruleVersion
    ? candidate.result
    : null;
}
