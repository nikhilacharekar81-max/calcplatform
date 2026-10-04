export function supportsSharedArrayBuffer(): boolean {
  return typeof SharedArrayBuffer !== "undefined" &&
    typeof Atomics !== "undefined" &&
    typeof crossOriginIsolated !== "undefined" &&
    crossOriginIsolated === true;
}

export function allocateSharedFloat64Array(length: number): Float64Array {
  if (!supportsSharedArrayBuffer()) {
    throw new Error("SharedArrayBuffer is unavailable; use transferable Worker fallback");
  }
  return new Float64Array(new SharedArrayBuffer(length * Float64Array.BYTES_PER_ELEMENT));
}
