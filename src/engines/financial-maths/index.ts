/**
 * Global Financial Maths Engine — Reusable Numerical Kernel
 * Version 6.1.3
 *
 * Shared kernel for the Global Calculator Platform.
 *
 * Design goals:
 * - client-side first and deterministic
 * - zero eval() / zero new Function()
 * - reusable financial, investment, retirement, statistical and numerical primitives
 * - explicit precision, timing, frequency and rounding policies
 * - versioned calculator-contract compatibility
 * - jurisdiction-specific tax/regulatory rules kept outside universal math primitives
 *
 * This engine is designed as a serious reusable numerical/financial foundation.
 * It does not claim to reproduce proprietary NASA, SpaceX, bank or government software.
 */

export const ENGINE_NAME = "Global Financial Maths Engine";
export const ENGINE_VERSION = "6.1.3";

export class CalculationError extends Error {
  readonly code: string;
  readonly details?: Record<string, unknown>;
  constructor(code: string, message: string, details?: Record<string, unknown>) {
    super(message);
    this.name = "CalculationError";
    this.code = code;
    this.details = details;
  }
}

export interface CalculationMeta {
  engineVersion: string;
  calculationId: string;
  startedAt?: string;
  finishedAt?: string;
  method?: string;
  precision?: number;
  rounding?: RoundingPolicy;
  iterations?: number;
  tolerance?: number;
  residual?: number;
  converged?: boolean;
  warnings?: string[];
  assumptions?: string[];
}

export interface CalculationResult<T> {
  value: T;
  meta: CalculationMeta;
}

function makeCalculationId(prefix = "calc"): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function assertFinite(value: number, name = "value"): void {
  if (!Number.isFinite(value)) {
    throw new CalculationError("NON_FINITE", `${name} must be finite.`);
  }
}

export function assertNonNegative(value: number, name: string): void {
  assertFinite(value, name);
  if (value < 0) throw new CalculationError("NEGATIVE_VALUE", `${name} must be >= 0.`);
}

export function assertPositive(value: number, name: string): void {
  assertFinite(value, name);
  if (value <= 0) throw new CalculationError("NON_POSITIVE", `${name} must be > 0.`);
}

export function assertInteger(value: number, name: string): void {
  assertFinite(value, name);
  if (!Number.isInteger(value)) throw new CalculationError("NOT_INTEGER", `${name} must be an integer.`);
}

export function nearlyZero(value: number, epsilon = 1e-12): boolean {
  return Math.abs(value) <= epsilon;
}

/* ============================================================================
 * PRECISION / ROUNDING
 * ========================================================================== */

export type RoundingMode =
  | "HALF_UP"
  | "HALF_EVEN"
  | "DOWN"
  | "UP"
  | "TOWARD_ZERO"
  | "AWAY_FROM_ZERO";

export interface RoundingPolicy {
  mode: RoundingMode;
  scale: number;
}

function roundHalfEven(value: number, scale: number): number {
  const factor = 10 ** scale;
  const x = value * factor;
  const sign = x < 0 ? -1 : 1;
  const absolute = Math.abs(x);
  const floor = Math.floor(absolute);
  const fraction = absolute - floor;

  let rounded: number;
  if (fraction > 0.5) rounded = floor + 1;
  else if (fraction < 0.5) rounded = floor;
  else rounded = floor % 2 === 0 ? floor : floor + 1;

  return (sign * rounded) / factor;
}

export function roundNumber(
  value: number,
  policy: RoundingPolicy = { mode: "HALF_UP", scale: 2 }
): number {
  assertFinite(value);
  if (!Number.isInteger(policy.scale) || policy.scale < 0 || policy.scale > 15) {
    throw new CalculationError("ROUNDING_SCALE", "Rounding scale must be an integer from 0 to 15.");
  }

  const factor = 10 ** policy.scale;

  switch (policy.mode) {
    case "HALF_EVEN":
      return roundHalfEven(value, policy.scale);
    case "DOWN":
      return Math.floor(value * factor) / factor;
    case "UP":
      return Math.ceil(value * factor) / factor;
    case "TOWARD_ZERO":
      return (value < 0 ? Math.ceil(value * factor) : Math.floor(value * factor)) / factor;
    case "AWAY_FROM_ZERO":
      return (value < 0 ? Math.floor(value * factor) : Math.ceil(value * factor)) / factor;
    case "HALF_UP":
    default: {
      const scaled = value * factor;
      const rounded = scaled >= 0 ? Math.floor(scaled + 0.5) : Math.ceil(scaled - 0.5);
      return rounded / factor;
    }
  }
}

export function roundMoney(value: number): number {
  return roundNumber(value, { mode: "HALF_UP", scale: 2 });
}

export function cleanZero(value: number, epsilon = 1e-10): number {
  return Math.abs(value) < epsilon ? 0 : value;
}

/**
 * Fixed-point settlement representation.
 * General calculations remain floating-point; this class is for exact
 * fixed-scale money storage/settlement where a Number conversion is acceptable
 * at the public boundary.
 */
export class Money {
  static readonly DECIMAL_SCALE = 8;
  static readonly SCALE = 100000000n;
  private readonly units: bigint;

  private constructor(units: bigint) {
    this.units = units;
  }

  static from(value: number | string): Money {
    if (typeof value === "number") {
      assertFinite(value, "money");
      const rounded = roundNumber(value, { mode: "HALF_UP", scale: Money.DECIMAL_SCALE });
      const text = rounded.toFixed(Money.DECIMAL_SCALE);
      return Money.from(text);
    }

    const text = String(value).trim();
    if (!/^-?\d+(?:\.\d+)?$/.test(text)) {
      throw new CalculationError("INVALID_MONEY", `Invalid money value: ${text}`);
    }

    const negative = text.startsWith("-");
    const unsigned = negative ? text.slice(1) : text;
    const [whole, fraction = ""] = unsigned.split(".");
    const padded = fraction + "000000000";
    const first8 = padded.slice(0, Money.DECIMAL_SCALE);
    const ninth = Number(padded[Money.DECIMAL_SCALE] ?? "0");
    let units = BigInt(whole) * Money.SCALE + BigInt(first8 || "0");
    if (ninth >= 5) units += 1n;

    return new Money(negative ? -units : units);
  }

  static zero(): Money {
    return new Money(0n);
  }

  static fromCents(cents: bigint | number): Money {
    if (typeof cents === "number") {
      assertFinite(cents, "cents");
      if (!Number.isSafeInteger(cents)) {
        throw new CalculationError("INVALID_CENTS", "cents must be a safe integer.");
      }
    }
    const value = typeof cents === "bigint" ? cents : BigInt(cents);
    return new Money(value * 1000000n);
  }

  toCents(): bigint {
    const sign = this.units < 0n ? -1n : 1n;
    const absolute = this.units < 0n ? -this.units : this.units;
    const cents = (absolute + 500000n) / 1000000n;
    return sign * cents;
  }

  add(other: Money): Money {
    return new Money(this.units + other.units);
  }

  subtract(other: Money): Money {
    return new Money(this.units - other.units);
  }

  toNumber(): number {
    return Number(this.units) / Number(Money.SCALE);
  }

  toString(scale = 2): string {
    return this.toNumber().toFixed(scale);
  }
}

export function kahanSum(values: readonly number[]): number {
  let sum = 0;
  let compensation = 0;

  for (const value of values) {
    assertFinite(value);
    const adjusted = value - compensation;
    const next = sum + adjusted;
    compensation = next - sum - adjusted;
    sum = next;
  }

  return sum;
}

export function stableExpm1(value: number): number {
  assertFinite(value);
  if (Math.abs(value) < 1e-5) {
    return value + value * value / 2 + value * value * value / 6;
  }
  return Math.expm1(value);
}

export function stableLog1p(value: number): number {
  assertFinite(value);
  if (value <= -1) throw new CalculationError("LOG_DOMAIN", "log1p requires x > -1.");
  if (Math.abs(value) < 1e-5) {
    return value - value * value / 2 + value * value * value / 3;
  }
  return Math.log1p(value);
}

export function safePow(base: number, exponent: number): number {
  assertFinite(base, "base");
  assertFinite(exponent, "exponent");

  if (base < 0 && !Number.isInteger(exponent)) {
    throw new CalculationError(
      "POWER_DOMAIN",
      "Negative base with non-integer exponent is not real-valued."
    );
  }

  const result = Math.pow(base, exponent);
  assertFinite(result, "power result");
  return result;
}

/* ============================================================================
 * TOKENIZER / AST / SAFE EXPRESSION ENGINE
 * ========================================================================== */

export type TokenType =
  | "number"
  | "identifier"
  | "operator"
  | "leftParen"
  | "rightParen"
  | "comma"
  | "eof";

export interface Token {
  type: TokenType;
  text: string;
  position: number;
}

export type AST =
  | { kind: "number"; value: number }
  | { kind: "variable"; name: string }
  | { kind: "unary"; op: "+" | "-"; expr: AST }
  | {
      kind: "binary";
      op: "+" | "-" | "*" | "/" | "^";
      left: AST;
      right: AST;
    }
  | { kind: "call"; name: string; args: AST[] };

export function tokenize(expression: string): Token[] {
  const tokens: Token[] = [];
  let index = 0;

  while (index < expression.length) {
    const char = expression[index];

    if (/\s/.test(char)) {
      index++;
      continue;
    }

    if (/[0-9.]/.test(char)) {
      const start = index;
      let dotCount = 0;

      while (index < expression.length && /[0-9.]/.test(expression[index])) {
        if (expression[index] === ".") dotCount++;
        index++;
      }

      if (dotCount > 1 || expression.slice(start, index) === ".") {
        throw new CalculationError("TOKEN_NUMBER", "Invalid number.", { position: start });
      }

      if (/[eE]/.test(expression[index] ?? "")) {
        index++;
        if (/[+-]/.test(expression[index] ?? "")) index++;

        const exponentStart = index;
        while (index < expression.length && /[0-9]/.test(expression[index])) index++;

        if (index === exponentStart) {
          throw new CalculationError("TOKEN_EXPONENT", "Invalid scientific notation.", {
            position: start
          });
        }
      }

      const text = expression.slice(start, index);
      const value = Number(text);

      if (!Number.isFinite(value)) {
        throw new CalculationError("TOKEN_NUMBER", "Number is not finite.", {
          position: start
        });
      }

      tokens.push({ type: "number", text, position: start });
      continue;
    }

    if (/[A-Za-z_]/.test(char)) {
      const start = index++;
      while (index < expression.length && /[A-Za-z0-9_]/.test(expression[index])) index++;

      tokens.push({
        type: "identifier",
        text: expression.slice(start, index),
        position: start
      });
      continue;
    }

    if ("+-*/^".includes(char)) {
      tokens.push({ type: "operator", text: char, position: index++ });
      continue;
    }

    if (char === "(") {
      tokens.push({ type: "leftParen", text: char, position: index++ });
      continue;
    }

    if (char === ")") {
      tokens.push({ type: "rightParen", text: char, position: index++ });
      continue;
    }

    if (char === ",") {
      tokens.push({ type: "comma", text: char, position: index++ });
      continue;
    }

    throw new CalculationError("TOKEN_CHAR", `Unexpected character '${char}'.`, {
      position: index
    });
  }

  tokens.push({ type: "eof", text: "", position: expression.length });
  return tokens;
}

export class Parser {
  private index = 0;

  constructor(private readonly tokens: Token[]) {}

  parse(): AST {
    const node = this.parseAdditive();

    if (this.peek().type !== "eof") {
      throw new CalculationError("PARSE_TRAILING", "Unexpected trailing token.", {
        token: this.peek()
      });
    }

    return node;
  }

  private peek(): Token {
    return this.tokens[this.index];
  }

  private take(): Token {
    return this.tokens[this.index++];
  }

  private match(type: TokenType, text?: string): boolean {
    const token = this.peek();

    if (token.type !== type || (text !== undefined && token.text !== text)) {
      return false;
    }

    this.index++;
    return true;
  }

  private parseAdditive(): AST {
    let node = this.parseMultiplicative();

    while (
      this.peek().type === "operator" &&
      (this.peek().text === "+" || this.peek().text === "-")
    ) {
      const operator = this.take().text as "+" | "-";
      node = {
        kind: "binary",
        op: operator,
        left: node,
        right: this.parseMultiplicative()
      };
    }

    return node;
  }

  private parseMultiplicative(): AST {
    let node = this.parseUnary();

    while (
      this.peek().type === "operator" &&
      (this.peek().text === "*" || this.peek().text === "/")
    ) {
      const operator = this.take().text as "*" | "/";
      node = {
        kind: "binary",
        op: operator,
        left: node,
        right: this.parseUnary()
      };
    }

    return node;
  }

  private parseUnary(): AST {
    if (
      this.peek().type === "operator" &&
      (this.peek().text === "+" || this.peek().text === "-")
    ) {
      const operator = this.take().text as "+" | "-";
      return {
        kind: "unary",
        op: operator,
        expr: this.parseUnary()
      };
    }

    return this.parsePower();
  }

  private parsePower(): AST {
    const left = this.parsePrimary();

    if (this.match("operator", "^")) {
      return {
        kind: "binary",
        op: "^",
        left,
        right: this.parseUnary()
      };
    }

    return left;
  }

  private parsePrimary(): AST {
    const token = this.peek();

    if (token.type === "number") {
      this.take();
      return { kind: "number", value: Number(token.text) };
    }

    if (token.type === "identifier") {
      this.take();

      if (this.match("leftParen")) {
        const args: AST[] = [];

        if (!this.match("rightParen")) {
          do {
            args.push(this.parseAdditive());
          } while (this.match("comma"));

          if (!this.match("rightParen")) {
            throw new CalculationError("PARSE_PAREN", "Expected ')'.", {
              position: this.peek().position
            });
          }
        }

        return {
          kind: "call",
          name: token.text.toLowerCase(),
          args
        };
      }

      return { kind: "variable", name: token.text };
    }

    if (this.match("leftParen")) {
      const node = this.parseAdditive();

      if (!this.match("rightParen")) {
        throw new CalculationError("PARSE_PAREN", "Expected ')'.", {
          position: this.peek().position
        });
      }

      return node;
    }

    throw new CalculationError(
      "PARSE_PRIMARY",
      "Expected number, variable, function, or parenthesized expression.",
      { position: token.position }
    );
  }
}

export interface FunctionSpec {
  minArgs: number;
  maxArgs: number;
  fn: (...args: number[]) => number;
}

const FUNCTION_REGISTRY: Record<string, FunctionSpec> = {
  abs: { minArgs: 1, maxArgs: 1, fn: Math.abs },
  sqrt: {
    minArgs: 1,
    maxArgs: 1,
    fn: (x) => {
      if (x < 0) throw new CalculationError("DOMAIN", "sqrt requires x >= 0.");
      return Math.sqrt(x);
    }
  },
  exp: { minArgs: 1, maxArgs: 1, fn: Math.exp },
  log: {
    minArgs: 1,
    maxArgs: 1,
    fn: (x) => {
      if (x <= 0) throw new CalculationError("DOMAIN", "log requires x > 0.");
      return Math.log10(x);
    }
  },
  ln: {
    minArgs: 1,
    maxArgs: 1,
    fn: (x) => {
      if (x <= 0) throw new CalculationError("DOMAIN", "ln requires x > 0.");
      return Math.log(x);
    }
  },
  sin: { minArgs: 1, maxArgs: 1, fn: Math.sin },
  cos: { minArgs: 1, maxArgs: 1, fn: Math.cos },
  tan: { minArgs: 1, maxArgs: 1, fn: Math.tan },
  asin: {
    minArgs: 1,
    maxArgs: 1,
    fn: (x) => {
      if (x < -1 || x > 1) throw new CalculationError("DOMAIN", "asin requires -1 <= x <= 1.");
      return Math.asin(x);
    }
  },
  acos: {
    minArgs: 1,
    maxArgs: 1,
    fn: (x) => {
      if (x < -1 || x > 1) throw new CalculationError("DOMAIN", "acos requires -1 <= x <= 1.");
      return Math.acos(x);
    }
  },
  atan: { minArgs: 1, maxArgs: 1, fn: Math.atan },
  floor: { minArgs: 1, maxArgs: 1, fn: Math.floor },
  ceil: { minArgs: 1, maxArgs: 1, fn: Math.ceil },
  min: { minArgs: 1, maxArgs: Number.MAX_SAFE_INTEGER, fn: (...args) => Math.min(...args) },
  max: { minArgs: 1, maxArgs: Number.MAX_SAFE_INTEGER, fn: (...args) => Math.max(...args) },
  pow: { minArgs: 2, maxArgs: 2, fn: safePow },
  round: {
    minArgs: 1,
    maxArgs: 2,
    fn: (x, digits = 0) => {
      if (!Number.isInteger(digits)) {
        throw new CalculationError("ROUND_DIGITS", "round digits must be an integer.");
      }
      return roundNumber(x, { mode: "HALF_UP", scale: digits });
    }
  },
  trunc: { minArgs: 1, maxArgs: 1, fn: Math.trunc },
  sign: { minArgs: 1, maxArgs: 1, fn: Math.sign },
  pmt: { minArgs: 3, maxArgs: 3, fn: (r, n, pv0) => pmt(r, n, pv0) },
  pv: { minArgs: 3, maxArgs: 3, fn: (r, n, pmtValue) => pv(r, n, pmtValue) },
  fv: { minArgs: 3, maxArgs: 3, fn: (r, n, pmtValue) => fv(r, n, pmtValue) },
  nper: { minArgs: 3, maxArgs: 3, fn: (r, pmtValue, pv0) => nper(r, pmtValue, pv0) }
};

export function evaluateAST(
  ast: AST,
  context: Record<string, number> = {}
): number {
  switch (ast.kind) {
    case "number":
      return ast.value;

    case "variable": {
      if (!Object.prototype.hasOwnProperty.call(context, ast.name)) {
        throw new CalculationError("UNKNOWN_VARIABLE", `Unknown variable '${ast.name}'.`);
      }
      const value = context[ast.name];
      assertFinite(value, ast.name);
      return value;
    }

    case "unary": {
      const value = evaluateAST(ast.expr, context);
      return ast.op === "-" ? -value : value;
    }

    case "binary": {
      const left = evaluateAST(ast.left, context);
      const right = evaluateAST(ast.right, context);
      let result: number;

      switch (ast.op) {
        case "+":
          result = left + right;
          break;
        case "-":
          result = left - right;
          break;
        case "*":
          result = left * right;
          break;
        case "/":
          if (nearlyZero(right)) {
            throw new CalculationError("DIV_ZERO", "Division by zero.");
          }
          result = left / right;
          break;
        case "^":
          result = safePow(left, right);
          break;
      }

      assertFinite(result, "expression result");
      return result;
    }

    case "call": {
      const spec = FUNCTION_REGISTRY[ast.name];

      if (!spec) {
        throw new CalculationError("UNKNOWN_FUNCTION", `Unknown function '${ast.name}'.`);
      }

      if (ast.args.length < spec.minArgs || ast.args.length > spec.maxArgs) {
        throw new CalculationError(
          "ARITY",
          `Function ${ast.name} expects ${
            spec.minArgs === spec.maxArgs
              ? spec.minArgs
              : `${spec.minArgs}-${spec.maxArgs}`
          } arguments.`
        );
      }

      const result = spec.fn(...ast.args.map((arg) => evaluateAST(arg, context)));
      assertFinite(result, "function result");
      return result;
    }
  }
}

export function evaluateExpression(
  expression: string,
  context: Record<string, number> = {}
): number {
  return evaluateAST(new Parser(tokenize(expression)).parse(), context);
}

/* ============================================================================
 * NUMERICAL SOLVERS
 * ========================================================================== */

export interface SolverOptions {
  tolerance?: number;
  maxIterations?: number;
  lower?: number;
  upper?: number;
  derivativeStep?: number;
}

export interface SolverResult {
  root: number;
  converged: boolean;
  iterations: number;
  residual: number;
  method: string;
  bracket?: [number, number];
  message?: string;
}

function solverDefaults(options?: SolverOptions): {
  tolerance: number;
  maxIterations: number;
} {
  return {
    tolerance: options?.tolerance ?? 1e-10,
    maxIterations: options?.maxIterations ?? 200
  };
}

export function bisection(
  fn: (x: number) => number,
  lower: number,
  upper: number,
  options: SolverOptions = {}
): SolverResult {
  assertFinite(lower, "lower");
  assertFinite(upper, "upper");

  if (lower >= upper) {
    throw new CalculationError("BRACKET", "lower must be < upper.");
  }

  const { tolerance, maxIterations } = solverDefaults(options);
  let a = lower;
  let b = upper;
  let fa = fn(a);
  let fb = fn(b);

  assertFinite(fa, "f(lower)");
  assertFinite(fb, "f(upper)");

  if (fa === 0) {
    return { root: a, converged: true, iterations: 0, residual: 0, method: "bisection" };
  }

  if (fb === 0) {
    return { root: b, converged: true, iterations: 0, residual: 0, method: "bisection" };
  }

  if (fa * fb > 0) {
    throw new CalculationError("NO_BRACKET", "Function has no sign change on bracket.");
  }

  let midpoint = (a + b) / 2;
  let fm = Number.POSITIVE_INFINITY;

  for (let iteration = 1; iteration <= maxIterations; iteration++) {
    midpoint = (a + b) / 2;
    fm = fn(midpoint);
    assertFinite(fm, "f(midpoint)");

    if (Math.abs(fm) <= tolerance || Math.abs(b - a) <= tolerance) {
      return {
        root: midpoint,
        converged: true,
        iterations: iteration,
        residual: fm,
        method: "bisection",
        bracket: [a, b]
      };
    }

    if (fa * fm < 0) {
      b = midpoint;
      fb = fm;
    } else {
      a = midpoint;
      fa = fm;
    }
  }

  return {
    root: midpoint,
    converged: false,
    iterations: maxIterations,
    residual: fm,
    method: "bisection",
    bracket: [a, b],
    message: "Maximum iterations reached."
  };
}

/**
 * Brent-style bracketed root solver.
 * Bracketing is required; this avoids many of the failure modes of an
 * unguarded Newton solver for IRR/RATE/YTM-type problems.
 */
export function brent(
  fn: (x: number) => number,
  lower: number,
  upper: number,
  options: SolverOptions = {}
): SolverResult {
  const { tolerance, maxIterations } = solverDefaults(options);

  let a = lower;
  let b = upper;
  let fa = fn(a);
  let fb = fn(b);

  assertFinite(fa, "f(lower)");
  assertFinite(fb, "f(upper)");

  if (fa === 0) {
    return { root: a, converged: true, iterations: 0, residual: 0, method: "brent" };
  }

  if (fb === 0) {
    return { root: b, converged: true, iterations: 0, residual: 0, method: "brent" };
  }

  if (fa * fb > 0) {
    throw new CalculationError("NO_BRACKET", "Function has no sign change on bracket.");
  }

  let c = b;
  let fc = fb;
  let d = b - a;
  let e = d;

  for (let iteration = 1; iteration <= maxIterations; iteration++) {
    if ((fb > 0 && fc > 0) || (fb < 0 && fc < 0)) {
      c = a;
      fc = fa;
      d = b - a;
      e = d;
    }

    if (Math.abs(fc) < Math.abs(fb)) {
      a = b;
      b = c;
      c = a;
      fa = fb;
      fb = fc;
      fc = fa;
    }

    const toleranceHalf =
      2 * Number.EPSILON * Math.abs(b) + tolerance / 2;
    const midpoint = 0.5 * (c - b);

    if (Math.abs(midpoint) <= toleranceHalf || fb === 0) {
      return {
        root: b,
        converged: true,
        iterations: iteration,
        residual: fb,
        method: "brent",
        bracket: [Math.min(b, c), Math.max(b, c)]
      };
    }

    if (Math.abs(e) >= toleranceHalf && Math.abs(fa) > Math.abs(fb)) {
      const s = fb / fa;
      let p: number;
      let q: number;

      if (a === c) {
        p = 2 * midpoint * s;
        q = 1 - s;
      } else {
        q = fa / fc;
        const r = fb / fc;
        p = s * (
          2 * midpoint * q * (q - r) -
          (b - a) * (r - 1)
        );
        q = (q - 1) * (r - 1) * (s - 1);
      }

      if (p > 0) q = -q;
      else p = -p;

      const minimum1 = 3 * midpoint * q - Math.abs(toleranceHalf * q);
      const minimum2 = Math.abs(e * q);

      if (2 * p < Math.min(minimum1, minimum2)) {
        e = d;
        d = p / q;
      } else {
        d = midpoint;
        e = midpoint;
      }
    } else {
      d = midpoint;
      e = midpoint;
    }

    a = b;
    fa = fb;
    b += Math.abs(d) > toleranceHalf
      ? d
      : midpoint > 0
        ? toleranceHalf
        : -toleranceHalf;
    fb = fn(b);
    assertFinite(fb, "f(root)");
  }

  return {
    root: b,
    converged: false,
    iterations: maxIterations,
    residual: fb,
    method: "brent",
    message: "Maximum iterations reached."
  };
}

export function newton(
  fn: (x: number) => number,
  initial: number,
  options: SolverOptions = {}
): SolverResult {
  const { tolerance, maxIterations } = solverDefaults(options);
  let x = initial;
  let fx = fn(x);

  assertFinite(fx, "f(initial)");

  for (let iteration = 1; iteration <= maxIterations; iteration++) {
    if (Math.abs(fx) <= tolerance) {
      return {
        root: x,
        converged: true,
        iterations: iteration - 1,
        residual: fx,
        method: "newton"
      };
    }

    const h = options.derivativeStep ?? Math.max(1e-6, Math.abs(x) * 1e-6);
    const derivative = (fn(x + h) - fn(x - h)) / (2 * h);

    if (!Number.isFinite(derivative) || Math.abs(derivative) < 1e-16) break;

    const next = x - fx / derivative;
    if (!Number.isFinite(next)) break;

    x = next;
    fx = fn(x);
    assertFinite(fx, "f(newton)");
  }

  return {
    root: x,
    converged: Math.abs(fx) <= tolerance,
    iterations: maxIterations,
    residual: fx,
    method: "newton",
    message: "Newton iteration ended without guaranteed bracketed convergence."
  };
}

export function goalSeek(
  fn: (x: number) => number,
  target = 0,
  options: SolverOptions & { initial?: number } = {}
): SolverResult {
  const residual = (x: number) => fn(x) - target;

  if (options.lower !== undefined && options.upper !== undefined) {
    return brent(residual, options.lower, options.upper, options);
  }

  return newton(residual, options.initial ?? 1, options);
}

/* ============================================================================
 * TIME VALUE OF MONEY
 * ========================================================================== */

export function pmt(
  rate: number,
  periods: number,
  presentValue: number,
  futureValue = 0,
  type: 0 | 1 = 0
): number {
  assertFinite(rate, "rate");
  assertFinite(periods, "periods");
  assertFinite(presentValue, "presentValue");
  assertFinite(futureValue, "futureValue");

  if (periods <= 0) {
    throw new CalculationError("INVALID_PERIODS", "periods must be > 0.");
  }

  if (type !== 0 && type !== 1) {
    throw new CalculationError("INVALID_TYPE", "type must be 0 or 1.");
  }

  if (nearlyZero(rate)) {
    return -(presentValue + futureValue) / periods;
  }

  if (rate <= -1) {
    throw new CalculationError("INVALID_RATE", "rate must be > -100% per period.");
  }

  const growth = Math.pow(1 + rate, periods);

  if (!Number.isFinite(growth) || growth === 0) {
    throw new CalculationError("NUMERIC_OVERFLOW", "Rate/period combination is unstable.");
  }

  return (
    -(rate * (presentValue * growth + futureValue)) /
    ((1 + rate * type) * (growth - 1))
  );
}

export function pv(
  rate: number,
  periods: number,
  payment: number,
  futureValue = 0,
  type: 0 | 1 = 0
): number {
  assertFinite(rate);
  assertFinite(periods);
  assertFinite(payment);
  assertFinite(futureValue);

  if (periods < 0) {
    throw new CalculationError("INVALID_PERIODS", "periods must be >= 0.");
  }

  if (rate <= -1) {
    throw new CalculationError("INVALID_RATE", "rate must be > -100% per period.");
  }

  if (nearlyZero(rate)) {
    return -futureValue - payment * periods;
  }

  const growth = Math.pow(1 + rate, periods);
  return -(futureValue + payment * (1 + rate * type) * (growth - 1) / rate) / growth;
}

export function fv(
  rate: number,
  periods: number,
  payment: number,
  presentValue = 0,
  type: 0 | 1 = 0
): number {
  assertFinite(rate);
  assertFinite(periods);
  assertFinite(payment);
  assertFinite(presentValue);

  if (periods < 0) {
    throw new CalculationError("INVALID_PERIODS", "periods must be >= 0.");
  }

  if (rate <= -1) {
    throw new CalculationError("INVALID_RATE", "rate must be > -100% per period.");
  }

  if (nearlyZero(rate)) {
    return -(presentValue + payment * periods);
  }

  const growth = Math.pow(1 + rate, periods);
  return -(
    presentValue * growth +
    payment * (1 + rate * type) * (growth - 1) / rate
  );
}

export function nper(
  rate: number,
  payment: number,
  presentValue: number,
  futureValue = 0,
  type: 0 | 1 = 0
): number {
  assertFinite(rate);
  assertFinite(payment);
  assertFinite(presentValue);
  assertFinite(futureValue);

  if (rate <= -1) {
    throw new CalculationError("INVALID_RATE", "rate must be > -100% per period.");
  }

  if (nearlyZero(rate)) {
    if (nearlyZero(payment)) {
      throw new CalculationError("NO_SOLUTION", "Zero rate and zero payment cannot solve nper.");
    }
    const result = -(presentValue + futureValue) / payment;
    if (result < 0 || !Number.isFinite(result)) {
      throw new CalculationError("NO_SOLUTION", "No valid nper solution.");
    }
    return result;
  }

  const paymentAdjusted = payment * (1 + rate * type);
  const numerator = paymentAdjusted - futureValue * rate;
  const denominator = presentValue * rate + paymentAdjusted;

  if (numerator === 0 || denominator === 0) {
    throw new CalculationError("NO_SOLUTION", "No finite nper solution for these inputs.");
  }

  const result =
    Math.log(numerator / denominator) /
    Math.log(1 + rate);

  if (!Number.isFinite(result) || result < 0) {
    throw new CalculationError("NO_SOLUTION", "No valid nper solution.");
  }

  return result;
}

export function rate(
  periods: number,
  payment: number,
  presentValue: number,
  futureValue = 0,
  type: 0 | 1 = 0,
  guess = 0.05
): SolverResult {
  if (periods <= 0) {
    throw new CalculationError("INVALID_PERIODS", "periods must be > 0.");
  }

  const fn = (candidate: number) =>
    pmt(candidate, periods, presentValue, futureValue, type) - payment;

  let lower = -0.999999;
  let upper = Math.max(guess * 2, 0.01);

  for (let attempt = 0; attempt < 100; attempt++) {
    try {
      if (fn(lower) * fn(upper) <= 0) {
        return brent(fn, lower, upper, {
          tolerance: 1e-12,
          maxIterations: 400
        });
      }
    } catch {
      // Expand/adjust bracket below.
    }

    upper = Math.min(100, upper * 2);
  }

  return newton(fn, guess, {
    tolerance: 1e-12,
    maxIterations: 400
  });
}

export function npv(
  ratePerPeriod: number,
  cashFlows: readonly number[],
  startAtZero = false
): number {
  assertFinite(ratePerPeriod, "ratePerPeriod");

  if (ratePerPeriod <= -1) {
    throw new CalculationError("INVALID_RATE", "rate must be > -100%.");
  }

  const start = startAtZero ? 0 : 1;

  return kahanSum(
    cashFlows.map((cashFlow, index) => {
      assertFinite(cashFlow, `cashFlows[${index}]`);
      return cashFlow / Math.pow(1 + ratePerPeriod, index + start);
    })
  );
}

/* ============================================================================
 * IRR / XIRR / MIRR
 * ========================================================================== */

function validateCashFlows(cashFlows: readonly number[]): void {
  if (cashFlows.length < 2) {
    throw new CalculationError("CASH_FLOW_COUNT", "At least two cash flows are required.");
  }

  cashFlows.forEach((value, index) =>
    assertFinite(value, `cashFlows[${index}]`)
  );

  if (!cashFlows.some((value) => value < 0) || !cashFlows.some((value) => value > 0)) {
    throw new CalculationError(
      "CASH_FLOW_SIGNS",
      "Cash flows need at least one positive and one negative value."
    );
  }
}

export interface RootSearchOptions {
  minimumRate?: number;
  initialMaximumRate?: number;
  maxPositiveRate?: number;
  expansionFactor?: number;
  refinementPasses?: number;
  linearSteps?: number;
}

interface SignChangeBracketOptions {
  adaptivePositiveExpansion?: boolean;
  maxPositiveRate?: number;
  expansionFactor?: number;
  refinementPasses?: number;
}

function safeRootFunctionValue(
  fn: (x: number) => number,
  x: number
): number | null {
  try {
    const value = fn(x);
    return Number.isFinite(value) ? value : null;
  } catch {
    return null;
  }
}

function findSignChangeBrackets(
  fn: (x: number) => number,
  minimum: number,
  maximum: number,
  steps: number,
  options: SignChangeBracketOptions = {}
): [number, number][] {
  if (!Number.isFinite(minimum) || !Number.isFinite(maximum) || minimum >= maximum) {
    throw new CalculationError("INVALID_BRACKET", "Root-search minimum must be finite and less than maximum.");
  }
  if (!Number.isInteger(steps) || steps < 2) {
    throw new CalculationError("INVALID_BRACKET", "Root-search steps must be an integer >= 2.");
  }

  const brackets: [number, number][] = [];
  const points: number[] = [];
  const seen = new Set<string>();
  const pointMaximum = options.adaptivePositiveExpansion
    ? (options.maxPositiveRate ?? 1_000_000)
    : maximum;
  const addPoint = (x: number): void => {
    if (!Number.isFinite(x) || x < minimum || x > pointMaximum) return;
    const key = x.toPrecision(17);
    if (!seen.has(key)) { seen.add(key); points.push(x); }
  };

  for (let i = 0; i <= steps; i++) addPoint(minimum + (maximum - minimum) * i / steps);

  if (options.adaptivePositiveExpansion) {
    const maxPositiveRate = options.maxPositiveRate ?? 1_000_000;
    const expansionFactor = options.expansionFactor ?? 2;
    if (!Number.isFinite(maxPositiveRate) || maxPositiveRate <= Math.max(0, maximum) ||
        expansionFactor <= 1 || !Number.isFinite(expansionFactor)) {
      throw new CalculationError("INVALID_BRACKET", "Invalid adaptive positive-rate search configuration.");
    }
    let rate = Math.max(0, maximum);
    if (rate === 0) rate = 0.01;
    while (rate < maxPositiveRate) {
      addPoint(rate);
      const next = Math.min(maxPositiveRate, rate * expansionFactor);
      if (next === rate) break;
      rate = next;
    }
    addPoint(maxPositiveRate);
  }

  points.sort((a, b) => a - b);

  const recordInterval = (left: number, leftF: number, right: number, rightF: number): void => {
    if (leftF === 0) { brackets.push([left, left]); return; }
    if (rightF === 0) { brackets.push([right, right]); return; }
    if (leftF * rightF < 0) brackets.push([left, right]);
  };

  let previousX: number | null = null;
  let previousF: number | null = null;
  for (const x of points) {
    const fx = safeRootFunctionValue(fn, x);
    if (fx === null) { previousX = null; previousF = null; continue; }
    if (previousX !== null && previousF !== null) recordInterval(previousX, previousF, x, fx);
    else if (fx === 0) brackets.push([x, x]);
    previousX = x; previousF = fx;
  }

  const refinementPasses = Math.max(0, options.refinementPasses ?? 2);
  let intervals = points.slice(0, -1).map((left, index) => [left, points[index + 1]] as [number, number]);
  for (let pass = 0; pass < refinementPasses && intervals.length; pass++) {
    const nextIntervals: [number, number][] = [];
    for (const [left, right] of intervals) {
      const leftF = safeRootFunctionValue(fn, left);
      const rightF = safeRootFunctionValue(fn, right);
      if (leftF === null || rightF === null) continue;
      const hasRootAtEndpoint = leftF === 0 || rightF === 0;
      const hasSignChange = leftF * rightF < 0;
      recordInterval(left, leftF, right, rightF);
      if (hasRootAtEndpoint || hasSignChange) continue;
      const midpoint = left + (right - left) / 2;
      if (midpoint !== left && midpoint !== right) {
        const midF = safeRootFunctionValue(fn, midpoint);
        if (midF !== null) {
          recordInterval(left, leftF, midpoint, midF);
          recordInterval(midpoint, midF, right, rightF);
        }
        nextIntervals.push([left, midpoint], [midpoint, right]);
      }
    }
    intervals = nextIntervals;
  }

  const unique = new Map<string, [number, number]>();
  for (const bracket of brackets) {
    const left = Math.min(bracket[0], bracket[1]);
    const right = Math.max(bracket[0], bracket[1]);
    unique.set(`${left.toPrecision(17)}:${right.toPrecision(17)}`, [left, right]);
  }
  return [...unique.values()];
}

export function irr(
  cashFlows: readonly number[],
  _guess = 0.1,
  search: RootSearchOptions = {}
): SolverResult {
  validateCashFlows(cashFlows);

  const fn = (candidate: number) => npv(candidate, cashFlows, true);
  const brackets = findSignChangeBrackets(
    fn,
    search.minimumRate ?? -0.9999,
    search.initialMaximumRate ?? 10,
    search.linearSteps ?? 800,
    {
      adaptivePositiveExpansion: true,
      maxPositiveRate: search.maxPositiveRate ?? 1_000_000,
      expansionFactor: search.expansionFactor ?? 2,
      refinementPasses: search.refinementPasses ?? 2
    }
  );

  if (brackets.length !== 1) {
    throw new CalculationError(
      brackets.length === 0 ? "NO_ROOT" : "MULTIPLE_ROOTS",
      `IRR requires a unique sign-change root; found ${brackets.length} candidate bracket(s).`
    );
  }

  return brent(fn, brackets[0][0], brackets[0][1], {
    tolerance: 1e-12,
    maxIterations: 600
  });
}

export function xnpv(
  annualRate: number,
  cashFlows: readonly { date: Date | string; value: number }[]
): number {
  if (annualRate <= -1) {
    throw new CalculationError("INVALID_RATE", "Annual rate must be > -100%.");
  }

  if (!cashFlows.length) {
    throw new CalculationError("EMPTY_CASH_FLOWS", "At least one cash flow is required.");
  }

  const sorted = cashFlows
    .map((cashFlow) => ({
      date: toDate(cashFlow.date),
      value: cashFlow.value
    }))
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  const start = sorted[0].date.getTime();

  return kahanSum(
    sorted.map((cashFlow) => {
      assertFinite(cashFlow.value);
      const days = (cashFlow.date.getTime() - start) / 86400000;
      return cashFlow.value / Math.pow(1 + annualRate, days / 365);
    })
  );
}

export function xirr(
  cashFlows: readonly { date: Date | string; value: number }[],
  _guess = 0.1,
  search: RootSearchOptions = {}
): SolverResult {
  if (cashFlows.length < 2) {
    throw new CalculationError("CASH_FLOW_COUNT", "At least two cash flows are required.");
  }

  const fn = (candidate: number) => xnpv(candidate, cashFlows);
  const brackets = findSignChangeBrackets(
    fn,
    search.minimumRate ?? -0.9999,
    search.initialMaximumRate ?? 10,
    search.linearSteps ?? 1000,
    {
      adaptivePositiveExpansion: true,
      maxPositiveRate: search.maxPositiveRate ?? 1_000_000,
      expansionFactor: search.expansionFactor ?? 2,
      refinementPasses: search.refinementPasses ?? 2
    }
  );

  if (brackets.length !== 1) {
    throw new CalculationError(
      brackets.length === 0 ? "NO_ROOT" : "MULTIPLE_ROOTS",
      `XIRR requires a unique sign-change root; found ${brackets.length}.`
    );
  }

  return brent(fn, brackets[0][0], brackets[0][1], {
    tolerance: 1e-11,
    maxIterations: 600
  });
}

export function mirr(
  cashFlows: readonly number[],
  financeRate: number,
  reinvestmentRate: number
): number {
  validateCashFlows(cashFlows);

  if (financeRate <= -1 || reinvestmentRate <= -1) {
    throw new CalculationError("INVALID_RATE", "Rates must be > -100%.");
  }

  const periods = cashFlows.length - 1;
  let presentValueNegative = 0;
  let futureValuePositive = 0;

  for (let index = 0; index < cashFlows.length; index++) {
    const cashFlow = cashFlows[index];

    if (cashFlow < 0) {
      presentValueNegative +=
        cashFlow / Math.pow(1 + financeRate, index);
    } else if (cashFlow > 0) {
      futureValuePositive +=
        cashFlow * Math.pow(1 + reinvestmentRate, periods - index);
    }
  }

  if (presentValueNegative === 0 || futureValuePositive === 0) {
    throw new CalculationError(
      "MIRR_NO_SOLUTION",
      "Cash flows must contain both negative and positive values."
    );
  }

  return Math.pow(-futureValuePositive / presentValueNegative, 1 / periods) - 1;
}

/* ============================================================================
 * DATE / FREQUENCY / DAY-COUNT
 * ========================================================================== */

export type Frequency =
  | "ANNUAL"
  | "SEMI_ANNUAL"
  | "QUARTERLY"
  | "MONTHLY"
  | "SEMI_MONTHLY"
  | "BIWEEKLY"
  | "WEEKLY"
  | "DAILY";

export type PaymentTiming = "BEGINNING" | "END";

export type DayCount =
  | "ACTUAL_365"
  | "ACTUAL_360"
  | "ACTUAL_ACTUAL"
  | "30_360_US"
  | "30E_360";

export function periodsPerYear(frequency: Frequency): number {
  switch (frequency) {
    case "ANNUAL":
      return 1;
    case "SEMI_ANNUAL":
      return 2;
    case "QUARTERLY":
      return 4;
    case "MONTHLY":
      return 12;
    case "SEMI_MONTHLY":
      return 24;
    case "BIWEEKLY":
      return 26;
    case "WEEKLY":
      return 52;
    case "DAILY":
      return 365;
  }
}

export function toDate(value: Date | string): Date {
  if (value instanceof Date) {
    const date = new Date(value.getTime());
    if (Number.isNaN(date.getTime())) throw new CalculationError("INVALID_DATE", "Invalid Date object.");
    return date;
  }

  const text = String(value).trim();
  const dateOnly = /^(\d{4})-(\d{2})-(\d{2})$/.exec(text);
  if (dateOnly) {
    const year = Number(dateOnly[1]);
    const month = Number(dateOnly[2]);
    const day = Number(dateOnly[3]);
    const date = new Date(Date.UTC(year, month - 1, day));
    if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) {
      throw new CalculationError("INVALID_DATE", `Invalid calendar date: ${text}`);
    }
    return date;
  }

  // ISO-8601 date-times with no timezone are normalized to UTC; explicit offsets are preserved.
  const isoWithZone = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d{1,9})?)?(?:Z|[+-]\d{2}:?\d{2})$/.test(text);
  const isoWithoutZone = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d{1,9})?)?$/.test(text);
  if (!isoWithZone && !isoWithoutZone) {
    throw new CalculationError(
      "AMBIGUOUS_DATE",
      `Date must be YYYY-MM-DD or an ISO-8601 datetime with an explicit timezone: ${text}`
    );
  }
  const normalized = isoWithoutZone ? `${text}Z` : text;
  const date = new Date(normalized);
  if (Number.isNaN(date.getTime())) throw new CalculationError("INVALID_DATE", `Invalid date: ${text}`);
  return date;
}

export function addMonths(date: Date, months: number): Date {
  const source = toDate(date);
  const day = source.getUTCDate();

  const output = new Date(
    Date.UTC(
      source.getUTCFullYear(),
      source.getUTCMonth() + months,
      1,
      source.getUTCHours(),
      source.getUTCMinutes(),
      source.getUTCSeconds(),
      source.getUTCMilliseconds()
    )
  );

  const lastDay = new Date(
    Date.UTC(output.getUTCFullYear(), output.getUTCMonth() + 1, 0)
  ).getUTCDate();

  output.setUTCDate(Math.min(day, lastDay));
  return output;
}

export function dayCountFraction(
  start: Date | string,
  end: Date | string,
  method: DayCount = "ACTUAL_365"
): number {
  const a = toDate(start);
  const b = toDate(end);

  if (b < a) {
    throw new CalculationError("DATE_ORDER", "end must be >= start.");
  }

  const days = (b.getTime() - a.getTime()) / 86400000;

  if (method === "ACTUAL_360") return days / 360;
  if (method === "ACTUAL_ACTUAL") {
    // Actual/Actual ISDA-style year splitting: each calendar year's actual
    // days are divided by 365 or 366 as appropriate. This preserves leap-day
    // behavior instead of using a synthetic 365.2425 denominator.
    let cursor = a;
    const segments: number[] = [];
    while (cursor < b) {
      const year = cursor.getUTCFullYear();
      const endOfYear = new Date(Date.UTC(year + 1, 0, 1, 0, 0, 0, 0));
      const segmentEnd = endOfYear < b ? endOfYear : b;
      const segmentDays = (segmentEnd.getTime() - cursor.getTime()) / 86400000;
      const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
      segments.push(segmentDays / (leap ? 366 : 365));
      cursor = segmentEnd;
    }
    return kahanSum(segments);
  }

  if (method === "30_360_US" || method === "30E_360") {
    let d1 = a.getUTCDate();
    let d2 = b.getUTCDate();
    const m1 = a.getUTCMonth() + 1;
    const m2 = b.getUTCMonth() + 1;
    const y1 = a.getUTCFullYear();
    const y2 = b.getUTCFullYear();

    if (method === "30_360_US") {
      const aLastFeb = m1 === 2 && d1 === new Date(Date.UTC(y1, 2, 0)).getUTCDate();
      const bLastFeb = m2 === 2 && d2 === new Date(Date.UTC(y2, 2, 0)).getUTCDate();
      if (d1 === 31 || aLastFeb) d1 = 30;
      if ((d2 === 31 && d1 >= 30) || bLastFeb && d1 >= 30) d2 = 30;
    } else {
      d1 = Math.min(d1, 30);
      d2 = Math.min(d2, 30);
    }

    return (360 * (y2 - y1) + 30 * (m2 - m1) + (d2 - d1)) / 360;
  }

  return days / 365;
}

/* ============================================================================
 * LOANS / AMORTIZATION
 * ========================================================================== */

export interface ExtraPayment {
  period?: number;
  date?: Date | string;
  amount: number;
}

export interface AmortizationInput {
  principal: number;
  annualRate: number;
  term: number;
  termUnit?: "YEARS" | "MONTHS" | "PERIODS";
  frequency?: Frequency;
  timing?: PaymentTiming;
  startDate?: Date | string;
  extraPayments?: ExtraPayment[];
  paymentOverride?: number;
  feeUpfront?: number;
  financedFees?: number;
  residualPayment?: number;
  settlementRounding?: RoundingPolicy;
  allowNegativeAmortization?: boolean;
}

export interface AmortizationRow {
  period: number;
  date?: string;
  beginningBalance: number;
  scheduledPayment: number;
  extraPayment: number;
  interest: number;
  principal: number;
  endingBalance: number;
  cumulativeInterest: number;
  cumulativePrincipal: number;
  negativeAmortization: boolean;
}

export interface AnnualSummary {
  year: number;
  periods: number;
  beginningBalance: number;
  endingBalance: number;
  payments: number;
  interest: number;
  principal: number;
  extraPayments: number;
}

export interface AmortizationResult {
  principal: number;
  periodicRate: number;
  periods: number;
  periodicPayment: number;
  totalPayments: number;
  totalInterest: number;
  totalPrincipal: number;
  rows: AmortizationRow[];
  annual: AnnualSummary[];
  payoffPeriod: number;
  payoffDate?: string;
  negativeAmortizationOccurred: boolean;
}

export function normalizePeriods(
  term: number,
  unit: "YEARS" | "MONTHS" | "PERIODS",
  frequency: Frequency
): number {
  assertPositive(term, "term");

  if (unit === "PERIODS") return Math.ceil(term);
  if (unit === "YEARS") return Math.ceil(term * periodsPerYear(frequency));

  return Math.ceil(term * periodsPerYear(frequency) / 12);
}

function extraForPeriod(
  extras: readonly ExtraPayment[],
  period: number,
  date: Date | undefined
): number {
  return extras
    .filter((extra) => {
      if (extra.period !== undefined) return extra.period === period;
      if (extra.date !== undefined && date !== undefined) {
        return toDate(extra.date).getTime() === date.getTime();
      }
      return false;
    })
    .map((extra) => {
      assertNonNegative(extra.amount, `extra payment at period ${period}`);
      return extra.amount;
    })
    .reduce((sum, value) => sum + value, 0);
}

export function generateAmortizationSchedule(
  input: AmortizationInput
): AmortizationResult {
  assertNonNegative(input.principal, "principal");
  assertFinite(input.annualRate, "annualRate");

  const frequency = input.frequency ?? "MONTHLY";
  const timing = input.timing ?? "END";
  const termUnit = input.termUnit ?? "YEARS";
  const periods = normalizePeriods(input.term, termUnit, frequency);
  const periodsPerYearValue = periodsPerYear(frequency);
  const periodicRate = input.annualRate / 100 / periodsPerYearValue;

  if (periodicRate <= -1) {
    throw new CalculationError("INVALID_RATE", "Periodic rate must be > -100%.");
  }

  const principal = input.principal + Math.max(0, input.financedFees ?? 0);

  const scheduledPayment =
    input.paymentOverride ??
    Math.abs(
      pmt(
        periodicRate,
        periods,
        principal,
        input.residualPayment ?? 0,
        timing === "BEGINNING" ? 1 : 0
      )
    );

  if (scheduledPayment < 0 || !Number.isFinite(scheduledPayment)) {
    throw new CalculationError("INVALID_PAYMENT", "Payment must be finite and >= 0.");
  }

  const rows: AmortizationRow[] = [];
  const extras = input.extraPayments ?? [];

  let balance = principal;
  let cumulativeInterest = 0;
  let cumulativePrincipal = 0;
  let totalPayments = 0;
  let date = input.startDate ? toDate(input.startDate) : undefined;
  let negativeAmortizationOccurred = false;

  for (
    let period = 1;
    period <= periods && balance > 1e-11;
    period++
  ) {
    const beginningBalance = balance;
    let interest = 0;
    let scheduled = scheduledPayment;
    let extra = extraForPeriod(extras, period, date);
    let principalPart = 0;
    let endingBalance = balance;

    if (timing === "BEGINNING") {
      const totalBeginningPayment = scheduled + extra;
      const principalBeforeInterest = Math.min(beginningBalance, totalBeginningPayment);

      principalPart = principalBeforeInterest;
      endingBalance = beginningBalance - principalPart;

      interest = endingBalance * periodicRate;
      endingBalance += interest;

      if (endingBalance < 0 && Math.abs(endingBalance) < 1e-9) {
        endingBalance = 0;
      }

      if (scheduled > beginningBalance) scheduled = beginningBalance;
      if (extra > beginningBalance - scheduled) {
        extra = Math.max(0, beginningBalance - scheduled);
      }
    } else {
      interest = beginningBalance * periodicRate;

      const amountDue = beginningBalance + interest;
      const scheduledApplied = Math.min(scheduled, amountDue);
      principalPart = scheduledApplied - interest;

      if (principalPart < 0) {
        negativeAmortizationOccurred = true;
        if (!input.allowNegativeAmortization) {
          throw new CalculationError(
            "NEGATIVE_AMORTIZATION",
            `Scheduled payment is below accrued interest in period ${period}. `
            + "Set allowNegativeAmortization=true only when that product explicitly permits it."
          );
        }
      }

      const availableAfterScheduled = Math.max(0, beginningBalance - Math.max(0, principalPart));
      if (extra > availableAfterScheduled) extra = availableAfterScheduled;

      principalPart += extra;
      endingBalance = beginningBalance + interest - scheduledApplied - extra;

      if (endingBalance < 0 && Math.abs(endingBalance) < 1e-9) {
        endingBalance = 0;
      }

      scheduled = scheduledApplied;
    }

    if (endingBalance < -1e-8) {
      throw new CalculationError(
        "NEGATIVE_BALANCE",
        "Payment schedule produced a materially negative balance."
      );
    }

    endingBalance = cleanZero(endingBalance);

    cumulativeInterest += interest;
    cumulativePrincipal += principalPart;

    const paymentThisPeriod =
      timing === "BEGINNING"
        ? scheduled + extra
        : scheduled + extra;

    totalPayments += paymentThisPeriod;

    const settlement = input.settlementRounding;

    rows.push({
      period,
      date: date?.toISOString(),
      beginningBalance,
      scheduledPayment: settlement
        ? roundNumber(scheduled, settlement)
        : scheduled,
      extraPayment: settlement
        ? roundNumber(extra, settlement)
        : extra,
      interest: settlement
        ? roundNumber(interest, settlement)
        : interest,
      principal: settlement
        ? roundNumber(principalPart, settlement)
        : principalPart,
      endingBalance,
      cumulativeInterest,
      cumulativePrincipal,
      negativeAmortization: principalPart < 0
    });

    balance = endingBalance;

    if (date) {
      if (frequency === "MONTHLY") {
        date = addMonths(date, 1);
      } else if (frequency === "QUARTERLY") {
        date = addMonths(date, 3);
      } else if (frequency === "SEMI_ANNUAL") {
        date = addMonths(date, 6);
      } else if (frequency === "ANNUAL") {
        date = addMonths(date, 12);
      } else {
        const days =
          frequency === "BIWEEKLY"
            ? 14
            : frequency === "WEEKLY"
              ? 7
              : frequency === "SEMI_MONTHLY"
                ? 15
                : 1;
        date = new Date(date.getTime() + days * 86400000);
      }
    }
  }

  if (input.settlementRounding && rows.length) {
    const policy = input.settlementRounding;
    const targetPrincipal = roundNumber(principal, policy);
    const roundedPrincipalBeforeLast = rows.slice(0, -1).reduce((sum, row) => sum + row.principal, 0);
    const roundedExtra = rows.reduce((sum, row) => sum + row.extraPayment, 0);
    const roundedScheduledBeforeLast = rows.slice(0, -1).reduce((sum, row) => sum + row.scheduledPayment, 0);
    const last = rows[rows.length - 1];
    const principalResidual = roundNumber(targetPrincipal - roundedPrincipalBeforeLast, policy);
    last.principal = principalResidual;
    last.interest = roundNumber(last.interest, policy);
    const lastExtra = last.extraPayment;
    const totalSettledInterest = kahanSum(rows.map((row) => row.interest));
    const targetSettledPayments = roundNumber(targetPrincipal + totalSettledInterest, policy);
    const lastScheduled = roundNumber(targetSettledPayments - roundedScheduledBeforeLast - roundedExtra - lastExtra, policy);
    if (lastScheduled < -(10 ** -policy.scale)) {
      throw new CalculationError("SETTLEMENT_RECONCILIATION", "Rounded final scheduled payment became negative.");
    }
    last.scheduledPayment = Math.max(0, lastScheduled);

    const settledInterest = kahanSum(rows.map((row) => row.interest));
    const settledPrincipal = kahanSum(rows.map((row) => row.principal));
    const settledPayments = kahanSum(rows.map((row) => row.scheduledPayment + row.extraPayment));
    cumulativeInterest = settledInterest;
    cumulativePrincipal = settledPrincipal;
    totalPayments = settledPayments;
  }

  const annual: AnnualSummary[] = [];

  for (const row of rows) {
    const year = Math.ceil(row.period / periodsPerYearValue);
    let summary = annual[year - 1];

    if (!summary) {
      summary = {
        year,
        periods: 0,
        beginningBalance: row.beginningBalance,
        endingBalance: row.endingBalance,
        payments: 0,
        interest: 0,
        principal: 0,
        extraPayments: 0
      };
      annual.push(summary);
    }

    summary.periods++;
    summary.endingBalance = row.endingBalance;
    summary.payments += row.scheduledPayment + row.extraPayment;
    summary.interest += row.interest;
    summary.principal += row.principal;
    summary.extraPayments += row.extraPayment;
  }

  return {
    principal,
    periodicRate,
    periods,
    periodicPayment: scheduledPayment,
    totalPayments,
    totalInterest: cumulativeInterest,
    totalPrincipal: cumulativePrincipal,
    rows,
    annual,
    payoffPeriod: rows.length,
    payoffDate: rows.length ? rows[rows.length - 1].date : undefined,
    negativeAmortizationOccurred
  };
}

/* ============================================================================
 * INVESTMENT / SAVINGS / RETIREMENT
 * ========================================================================== */

export interface InvestmentInput {
  initial: number;
  annualReturn: number;
  years: number;
  contribution: number;
  contributionFrequency?: Frequency;
  contributionGrowthRate?: number;
  contributionTiming?: PaymentTiming;
  feesAnnual?: number;
  inflationRate?: number;
}

export interface InvestmentPeriod {
  period: number;
  year: number;
  beginningBalance: number;
  contribution: number;
  growth: number;
  fees: number;
  endingBalance: number;
  cumulativeContributions: number;
}

export interface InvestmentResult {
  futureValue: number;
  nominalFutureValue: number;
  realFutureValue: number;
  totalContributions: number;
  totalGrowth: number;
  totalFees: number;
  schedule: InvestmentPeriod[];
}

export function calculateInvestment(
  input: InvestmentInput
): InvestmentResult {
  assertNonNegative(input.initial, "initial");
  assertNonNegative(input.contribution, "contribution");
  assertPositive(input.years, "years");

  const frequency = input.contributionFrequency ?? "MONTHLY";
  const periods = periodsPerYear(frequency);
  const count = Math.ceil(input.years * periods);
  const periodicReturn = input.annualReturn / 100 / periods;
  const periodicFee = (input.feesAnnual ?? 0) / 100 / periods;
  const timing = input.contributionTiming ?? "END";

  let balance = input.initial;
  let contribution = input.contribution;
  let totalContributions = 0;
  let totalGrowth = 0;
  let totalFees = 0;

  const schedule: InvestmentPeriod[] = [];

  for (let period = 1; period <= count; period++) {
    const year = Math.ceil(period / periods);
    const beginningBalance = balance;

    let contributionThisPeriod = contribution;

    if (timing === "BEGINNING") {
      balance += contributionThisPeriod;
    }

    const growth = balance * periodicReturn;
    const fees = balance * periodicFee;

    balance += growth - fees;

    if (timing === "END") {
      balance += contributionThisPeriod;
    }

    totalContributions += contributionThisPeriod;
    totalGrowth += growth;
    totalFees += fees;

    schedule.push({
      period,
      year,
      beginningBalance,
      contribution: contributionThisPeriod,
      growth,
      fees,
      endingBalance: balance,
      cumulativeContributions: totalContributions
    });

    if (input.contributionGrowthRate !== undefined) {
      contribution *=
        1 + input.contributionGrowthRate / 100 / periods;
    }
  }

  const inflation = input.inflationRate ?? 0;
  const realFutureValue =
    balance / Math.pow(1 + inflation / 100, input.years);

  return {
    futureValue: balance,
    nominalFutureValue: balance,
    realFutureValue,
    totalContributions,
    totalGrowth,
    totalFees,
    schedule
  };
}

export function calculateFutureValueWithContributions(
  initial: number,
  annualReturn: number,
  years: number,
  contribution: number,
  frequency: Frequency = "ANNUAL",
  timing: PaymentTiming = "END"
): number {
  return calculateInvestment({
    initial,
    annualReturn,
    years,
    contribution,
    contributionFrequency: frequency,
    contributionTiming: timing
  }).futureValue;
}

export interface RetirementInput extends InvestmentInput {
  currentAge: number;
  retirementAge: number;
  lifeExpectancy: number;
  postRetirementReturn: number;
  withdrawalRate?: number;
  annualRetirementSpending?: number;
  spendingInflationRate?: number;
  otherAnnualIncome?: number;
  otherIncomeGrowthRate?: number;
  retirementFeesAnnual?: number;
}

export interface RetirementDrawdownRow {
  age: number;
  year: number;
  beginningBalance: number;
  investmentGrowth: number;
  fees: number;
  otherIncome: number;
  withdrawal: number;
  endingBalance: number;
  cumulativeWithdrawals: number;
  depleted: boolean;
}

export interface RetirementResult {
  accumulation: InvestmentResult;
  nestEggNominal: number;
  nestEggTodayDollars: number;
  annualWithdrawalAtRetirement: number;
  monthlyWithdrawalAtRetirement: number;
  drawdown: RetirementDrawdownRow[];
  sustainable: boolean;
  depletionAge?: number;
}

export function calculateRetirement(
  input: RetirementInput
): RetirementResult {
  if (input.retirementAge <= input.currentAge) {
    throw new CalculationError(
      "AGE_ORDER",
      "retirementAge must exceed currentAge."
    );
  }

  if (input.lifeExpectancy < input.retirementAge) {
    throw new CalculationError(
      "LIFE_EXPECTANCY",
      "lifeExpectancy must be >= retirementAge."
    );
  }

  const accumulation = calculateInvestment(input);
  const withdrawalRate = (input.withdrawalRate ?? 4) / 100;

  const startingSpending =
    input.annualRetirementSpending ??
    accumulation.futureValue * withdrawalRate;

  let balance = accumulation.futureValue;
  let spending = startingSpending;
  let otherIncome = input.otherAnnualIncome ?? 0;
  let cumulativeWithdrawals = 0;
  let depletionAge: number | undefined;

  const drawdown: RetirementDrawdownRow[] = [];

  for (let age = input.retirementAge; age <= input.lifeExpectancy; age++) {
    const beginningBalance = balance;
    const investmentGrowth =
      balance * (input.postRetirementReturn / 100);
    const fees =
      balance * ((input.retirementFeesAnnual ?? 0) / 100);

    balance += investmentGrowth - fees;

    const withdrawal = Math.max(0, spending - otherIncome);

    balance -= withdrawal;
    cumulativeWithdrawals += withdrawal;

    if (balance < 0) {
      balance = 0;
      if (depletionAge === undefined) depletionAge = age;
    }

    drawdown.push({
      age,
      year: age - input.retirementAge + 1,
      beginningBalance,
      investmentGrowth,
      fees,
      otherIncome,
      withdrawal,
      endingBalance: balance,
      cumulativeWithdrawals,
      depleted: balance === 0
    });

    spending *=
      1 + (input.spendingInflationRate ?? input.inflationRate ?? 0) / 100;

    otherIncome *=
      1 + (input.otherIncomeGrowthRate ?? 0) / 100;
  }

  return {
    accumulation,
    nestEggNominal: accumulation.futureValue,
    nestEggTodayDollars: accumulation.realFutureValue,
    annualWithdrawalAtRetirement: startingSpending,
    monthlyWithdrawalAtRetirement: startingSpending / 12,
    drawdown,
    sustainable: depletionAge === undefined,
    depletionAge
  };
}

export interface Scenario<T> {
  name: string;
  overrides: Partial<T>;
}

export function runScenarios<T extends Record<string, any>, R>(
  base: T,
  scenarios: readonly Scenario<T>[],
  calculate: (input: T) => R
): Record<string, R> {
  const results: Record<string, R> = {};

  for (const scenario of scenarios) {
    results[scenario.name] = calculate({
      ...base,
      ...scenario.overrides
    });
  }

  return results;
}

export interface SensitivityCell {
  rowValue: number;
  columnValue: number;
  result: number;
}

export function sensitivity<T extends Record<string, any>>(
  base: T,
  rowKey: keyof T,
  rowValues: readonly number[],
  columnKey: keyof T,
  columnValues: readonly number[],
  calculate: (input: T) => number
): SensitivityCell[] {
  const cells: SensitivityCell[] = [];

  for (const rowValue of rowValues) {
    for (const columnValue of columnValues) {
      cells.push({
        rowValue,
        columnValue,
        result: calculate({
          ...base,
          [rowKey]: rowValue,
          [columnKey]: columnValue
        })
      });
    }
  }

  return cells;
}

/* ============================================================================
 * STATISTICS / PROBABILITY
 * ========================================================================== */

export function mean(values: readonly number[]): number {
  if (!values.length) {
    throw new CalculationError("EMPTY_DATA", "At least one value is required.");
  }
  return kahanSum(values) / values.length;
}

export function weightedMean(
  values: readonly number[],
  weights: readonly number[]
): number {
  if (!values.length || values.length !== weights.length) {
    throw new CalculationError(
      "WEIGHTED_MEAN",
      "Values and weights must have equal non-zero length."
    );
  }

  const totalWeight = kahanSum(weights);

  if (totalWeight === 0) {
    throw new CalculationError("WEIGHT_SUM", "Weights must not sum to zero.");
  }

  return kahanSum(values.map((value, index) => value * weights[index])) / totalWeight;
}

export function median(values: readonly number[]): number {
  if (!values.length) {
    throw new CalculationError("EMPTY_DATA", "At least one value is required.");
  }

  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);

  return sorted.length % 2
    ? sorted[middle]
    : (sorted[middle - 1] + sorted[middle]) / 2;
}

export function variance(
  values: readonly number[],
  sample = true
): number {
  const minimum = sample ? 2 : 1;

  if (values.length < minimum) {
    throw new CalculationError("DATA_COUNT", "Insufficient data.");
  }

  const average = mean(values);

  return (
    kahanSum(values.map((value) => (value - average) ** 2)) /
    (values.length - (sample ? 1 : 0))
  );
}

export function standardDeviation(
  values: readonly number[],
  sample = true
): number {
  return Math.sqrt(variance(values, sample));
}

export function covariance(
  a: readonly number[],
  b: readonly number[],
  sample = true
): number {
  if (a.length !== b.length || a.length < (sample ? 2 : 1)) {
    throw new CalculationError("DATA_COUNT", "Invalid paired data.");
  }

  const meanA = mean(a);
  const meanB = mean(b);

  return (
    kahanSum(
      a.map((value, index) => (value - meanA) * (b[index] - meanB))
    ) /
    (a.length - (sample ? 1 : 0))
  );
}

export function correlation(
  a: readonly number[],
  b: readonly number[]
): number {
  const result =
    covariance(a, b, true) /
    (standardDeviation(a, true) * standardDeviation(b, true));

  if (!Number.isFinite(result)) {
    throw new CalculationError("CORRELATION", "Correlation is undefined for constant data.");
  }

  return result;
}

export function percentile(
  values: readonly number[],
  p: number
): number {
  if (p < 0 || p > 1) {
    throw new CalculationError("PERCENTILE", "p must be between 0 and 1.");
  }

  if (!values.length) {
    throw new CalculationError("EMPTY_DATA", "No values.");
  }

  const sorted = [...values].sort((a, b) => a - b);
  const position = (sorted.length - 1) * p;
  const lower = Math.floor(position);
  const upper = Math.ceil(position);

  return sorted[lower] +
    (sorted[upper] - sorted[lower]) * (position - lower);
}

export function normalCDF(
  value: number,
  meanValue = 0,
  standardDeviationValue = 1
): number {
  assertPositive(standardDeviationValue, "standardDeviation");
  return 0.5 * (
    1 +
    erf(
      (value - meanValue) /
      (standardDeviationValue * Math.sqrt(2))
    )
  );
}

export function normalPDF(
  value: number,
  meanValue = 0,
  standardDeviationValue = 1
): number {
  assertPositive(standardDeviationValue, "standardDeviation");

  return Math.exp(
    -0.5 *
    ((value - meanValue) / standardDeviationValue) ** 2
  ) /
    (standardDeviationValue * Math.sqrt(2 * Math.PI));
}

function erf(value: number): number {
  const sign = value < 0 ? -1 : 1;
  const absolute = Math.abs(value);
  const t = 1 / (1 + 0.3275911 * absolute);

  const approximation =
    1 -
    (((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t -
      0.284496736) *
      t +
      0.254829592) *
      t) *
      Math.exp(-absolute * absolute);

  return sign * approximation;
}

/* ============================================================================
 * MONTE CARLO / REPRODUCIBILITY
 * ========================================================================== */

export class SeededRandom {
  private state: number;

  constructor(seed = 123456789) {
    this.state = (seed >>> 0) || 1;
  }

  next(): number {
    let x = this.state;
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    this.state = x >>> 0;
    return this.state / 4294967296;
  }

  normal(): number {
    const u = Math.max(this.next(), Number.MIN_VALUE);
    const v = this.next();

    return Math.sqrt(-2 * Math.log(u)) *
      Math.cos(2 * Math.PI * v);
  }
}

export interface MonteCarloResult {
  trials: number;
  seed: number;
  values: number[];
  mean: number;
  median: number;
  p05: number;
  p10: number;
  p25: number;
  p50: number;
  p75: number;
  p90: number;
  p95: number;
  probabilityAtOrAbove?: number;
}

export function monteCarlo(
  trials: number,
  seed: number,
  simulate: (rng: SeededRandom, index: number) => number,
  target?: number
): MonteCarloResult {
  assertInteger(trials, "trials");

  if (trials <= 0) {
    throw new CalculationError("TRIALS", "trials must be > 0.");
  }

  const random = new SeededRandom(seed);
  const values: number[] = [];

  for (let index = 0; index < trials; index++) {
    const value = simulate(random, index);
    assertFinite(value, "simulation result");
    values.push(value);
  }

  const sorted = [...values].sort((a, b) => a - b);

  return {
    trials,
    seed,
    values,
    mean: mean(values),
    median: median(values),
    p05: percentile(sorted, 0.05),
    p10: percentile(sorted, 0.10),
    p25: percentile(sorted, 0.25),
    p50: percentile(sorted, 0.50),
    p75: percentile(sorted, 0.75),
    p90: percentile(sorted, 0.90),
    p95: percentile(sorted, 0.95),
    probabilityAtOrAbove:
      target === undefined
        ? undefined
        : values.filter((value) => value >= target).length / trials
  };
}

export interface MonteCarloAsyncOptions {
  chunkSize?: number;
  onProgress?: (completed: number, total: number) => void;
}

export async function monteCarloAsync(
  trials: number,
  seed: number,
  simulate: (rng: SeededRandom, index: number) => number,
  target?: number,
  options: MonteCarloAsyncOptions = {}
): Promise<MonteCarloResult> {
  assertInteger(trials, "trials");
  if (trials <= 0) throw new CalculationError("TRIALS", "trials must be > 0.");

  const chunkSize = Math.max(1, Math.floor(options.chunkSize ?? 1000));
  const random = new SeededRandom(seed);
  const values: number[] = new Array(trials);

  for (let start = 0; start < trials; start += chunkSize) {
    const end = Math.min(trials, start + chunkSize);
    for (let index = start; index < end; index++) {
      const value = simulate(random, index);
      assertFinite(value, "simulation result");
      values[index] = value;
    }
    options.onProgress?.(end, trials);
    if (end < trials) {
      await new Promise<void>((resolve) => {
        if (typeof globalThis.setTimeout === "function") globalThis.setTimeout(resolve, 0);
        else resolve();
      });
    }
  }

  const sorted = [...values].sort((a, b) => a - b);
  return {
    trials,
    seed,
    values,
    mean: mean(values),
    median: median(values),
    p05: percentile(sorted, 0.05),
    p10: percentile(sorted, 0.10),
    p25: percentile(sorted, 0.25),
    p50: percentile(sorted, 0.50),
    p75: percentile(sorted, 0.75),
    p90: percentile(sorted, 0.90),
    p95: percentile(sorted, 0.95),
    probabilityAtOrAbove:
      target === undefined ? undefined : values.filter((value) => value >= target).length / trials
  };
}

/* ============================================================================
 * BONDS / ANNUITIES / LEASES / DEPRECIATION
 * ========================================================================== */

export interface BondInput {
  faceValue: number;
  couponRate: number;
  years: number;
  marketRate: number;
  paymentsPerYear?: number;
}

export function bondPrice(input: BondInput): number {
  const paymentsPerYear = input.paymentsPerYear ?? 2;

  if (
    paymentsPerYear <= 0 ||
    !Number.isInteger(paymentsPerYear)
  ) {
    throw new CalculationError(
      "FREQUENCY",
      "paymentsPerYear must be a positive integer."
    );
  }

  const periods = Math.round(input.years * paymentsPerYear);
  const coupon =
    input.faceValue *
    (input.couponRate / 100) /
    paymentsPerYear;

  const periodicRate =
    input.marketRate / 100 / paymentsPerYear;

  if (nearlyZero(periodicRate)) {
    return coupon * periods + input.faceValue;
  }

  return (
    coupon *
      (1 - Math.pow(1 + periodicRate, -periods)) /
      periodicRate +
    input.faceValue *
      Math.pow(1 + periodicRate, -periods)
  );
}

export function bondYieldToMaturity(
  faceValue: number,
  couponRate: number,
  years: number,
  price: number,
  paymentsPerYear = 2
): SolverResult {
  const fn = (periodicRate: number) =>
    bondPrice({
      faceValue,
      couponRate,
      years,
      marketRate: periodicRate * 100,
      paymentsPerYear
    }) - price;

  return brent(fn, -0.999999, 100, {
    tolerance: 1e-12,
    maxIterations: 600
  });
}

export function annuityPresentValue(
  payment: number,
  annualRate: number,
  years: number,
  frequency: Frequency = "MONTHLY",
  timing: PaymentTiming = "END"
): number {
  const periods = periodsPerYear(frequency);
  return pv(
    annualRate / 100 / periods,
    years * periods,
    -payment,
    0,
    timing === "BEGINNING" ? 1 : 0
  );
}

export function annuityFutureValue(
  payment: number,
  annualRate: number,
  years: number,
  frequency: Frequency = "MONTHLY",
  timing: PaymentTiming = "END"
): number {
  const periods = periodsPerYear(frequency);

  return fv(
    annualRate / 100 / periods,
    years * periods,
    -payment,
    0,
    timing === "BEGINNING" ? 1 : 0
  );
}

export type DepreciationMethod =
  | "STRAIGHT_LINE"
  | "DECLINING_BALANCE"
  | "DOUBLE_DECLINING"
  | "SUM_OF_YEARS_DIGITS";

export function depreciation(
  cost: number,
  salvage: number,
  life: number,
  method: DepreciationMethod,
  period: number,
  rate?: number
): number {
  assertNonNegative(cost, "cost");
  assertNonNegative(salvage, "salvage");
  assertPositive(life, "life");

  if (salvage > cost) {
    throw new CalculationError("SALVAGE", "salvage cannot exceed cost.");
  }

  if (period < 1 || period > life) {
    throw new CalculationError("PERIOD", "period outside useful life.");
  }

  switch (method) {
    case "STRAIGHT_LINE":
      return (cost - salvage) / life;

    case "SUM_OF_YEARS_DIGITS":
      return (
        (cost - salvage) *
        (life - period + 1) /
        (life * (life + 1) / 2)
      );

    case "DOUBLE_DECLINING": {
      const opening =
        period === 1
          ? cost
          : cost * Math.pow(1 - 2 / life, period - 1);

      return Math.min(
        Math.max(0, opening - salvage),
        opening * 2 / life
      );
    }

    case "DECLINING_BALANCE": {
      const rateDecimal =
        (rate ?? (1 / life * 100)) / 100;

      if (rateDecimal < 0 || rateDecimal >= 1) {
        throw new CalculationError(
          "DEPRECIATION_RATE",
          "Declining-balance rate must be >= 0 and < 100%."
        );
      }

      const opening =
        period === 1
          ? cost
          : cost * Math.pow(1 - rateDecimal, period - 1);

      return Math.min(
        Math.max(0, opening - salvage),
        opening * rateDecimal
      );
    }
  }
}

/* ============================================================================
 * TAX / PAYROLL / VAT PRIMITIVES (GENERIC MATHEMATICAL FUNCTIONS)
 * ========================================================================== */

export interface TaxBracket {
  upTo: number;
  rate: number;
}

export function progressiveTax(
  taxableIncome: number,
  brackets: readonly TaxBracket[]
): number {
  assertNonNegative(taxableIncome, "taxableIncome");

  if (!brackets.length) return 0;

  let previousLimit = 0;
  let total = 0;

  for (const bracket of brackets) {
    if (
      bracket.upTo <= previousLimit ||
      bracket.rate < 0 ||
      !Number.isFinite(bracket.upTo) ||
      !Number.isFinite(bracket.rate)
    ) {
      throw new CalculationError(
        "BRACKETS",
        "Invalid tax brackets. Use a final Infinity upper bound for an uncapped bracket."
      );
    }

    const taxableSlice =
      Math.min(taxableIncome, bracket.upTo) -
      previousLimit;

    if (taxableSlice > 0) {
      total += taxableSlice * bracket.rate / 100;
    }

    if (taxableIncome <= bracket.upTo) break;
    previousLimit = bracket.upTo;
  }

  if (
    taxableIncome >
    brackets[brackets.length - 1].upTo
  ) {
    throw new CalculationError(
      "BRACKET_COVERAGE",
      "Tax brackets do not cover the full taxable income."
    );
  }

  return total;
}

export function marginalTaxRate(
  taxableIncome: number,
  brackets: readonly TaxBracket[]
): number {
  for (const bracket of brackets) {
    if (taxableIncome <= bracket.upTo) {
      return bracket.rate;
    }
  }

  throw new CalculationError(
    "BRACKET_COVERAGE",
    "Tax brackets do not cover taxable income."
  );
}

export function vatFromNet(
  net: number,
  vatRate: number
): { vat: number; gross: number } {
  assertNonNegative(net, "net");
  assertNonNegative(vatRate, "vatRate");

  const vat = net * vatRate / 100;
  return { vat, gross: net + vat };
}

export function vatFromGross(
  gross: number,
  vatRate: number
): { net: number; vat: number } {
  assertNonNegative(gross, "gross");

  if (vatRate <= -100) {
    throw new CalculationError("VAT_RATE", "Invalid VAT rate.");
  }

  const net = gross / (1 + vatRate / 100);
  return { net, vat: gross - net };
}

export function salesTax(
  amount: number,
  taxRate: number
): number {
  return amount * taxRate / 100;
}

export function netPay(
  gross: number,
  deductions: readonly number[]
): number {
  return gross - kahanSum(deductions);
}

/* ============================================================================
 * RATIOS / MARGINS / COMMISSIONS / AFFORDABILITY
 * ========================================================================== */

export function debtToIncomeRatio(
  monthlyDebt: number,
  monthlyGrossIncome: number
): number {
  assertNonNegative(monthlyDebt, "monthlyDebt");
  assertPositive(monthlyGrossIncome, "monthlyGrossIncome");

  return monthlyDebt / monthlyGrossIncome;
}

export function margin(
  sales: number,
  cost: number
): number {
  if (sales === 0) {
    throw new CalculationError("SALES", "sales cannot be zero.");
  }

  return (sales - cost) / sales;
}

export function markup(
  sales: number,
  cost: number
): number {
  if (cost === 0) {
    throw new CalculationError("COST", "cost cannot be zero.");
  }

  return (sales - cost) / cost;
}

export function commission(
  sales: number,
  ratePercent: number,
  baseAdjustment = 0
): number {
  return (sales - baseAdjustment) * ratePercent / 100;
}

export function houseAffordability(
  monthlyIncome: number,
  maxDTI: number,
  otherDebt: number,
  annualRate: number,
  years: number,
  downPayment = 0
): {
  maxMonthlyPI: number;
  maxLoan: number;
  maxHomePrice: number;
} {
  const maximumDebt =
    monthlyIncome * maxDTI / 100;

  const maxPrincipalAndInterest =
    Math.max(0, maximumDebt - otherDebt);

  const monthlyRate =
    annualRate / 100 / 12;

  const periods = years * 12;

  const loan =
    nearlyZero(monthlyRate)
      ? maxPrincipalAndInterest * periods
      : maxPrincipalAndInterest *
        (1 - Math.pow(1 + monthlyRate, -periods)) /
        monthlyRate;

  return {
    maxMonthlyPI: maxPrincipalAndInterest,
    maxLoan: loan,
    maxHomePrice: loan + downPayment
  };
}

export function roi(
  gain: number,
  cost: number
): number {
  if (cost === 0) {
    throw new CalculationError("COST", "cost cannot be zero.");
  }

  return (gain - cost) / cost;
}

export function paybackPeriod(
  initialInvestment: number,
  cashFlows: readonly number[]
): number {
  assertNonNegative(initialInvestment, "initialInvestment");

  let cumulative = 0;

  for (let index = 0; index < cashFlows.length; index++) {
    const cashFlow = cashFlows[index];
    assertFinite(cashFlow, `cashFlows[${index}]`);

    const previous = cumulative;
    cumulative += cashFlow;

    if (cumulative >= initialInvestment) {
      if (cashFlow === 0) return index + 1;
      return index + (initialInvestment - previous) / cashFlow;
    }
  }

  return Infinity;
}

/* ============================================================================
 * PAYOFF / REFINANCE / CASH VS FINANCE / LEASE
 * ========================================================================== */

export interface PayoffResult {
  regularPayment: number;
  extraPayment: number;
  originalInterest: number;
  newInterest: number;
  interestSaved: number;
  periodsSaved: number;
  payoffMonths: number;
}

export function mortgagePayoff(
  principal: number,
  annualRate: number,
  remainingMonths: number,
  extraMonthlyPayment = 0
): PayoffResult {
  const monthlyRate = annualRate / 100 / 12;
  const regularPayment =
    Math.abs(pmt(monthlyRate, remainingMonths, principal));

  const base = generateAmortizationSchedule({
    principal,
    annualRate,
    term: remainingMonths,
    termUnit: "MONTHS",
    frequency: "MONTHLY"
  });

  const accelerated = generateAmortizationSchedule({
    principal,
    annualRate,
    term: remainingMonths,
    termUnit: "MONTHS",
    frequency: "MONTHLY",
    paymentOverride: regularPayment + extraMonthlyPayment
  });

  return {
    regularPayment,
    extraPayment: extraMonthlyPayment,
    originalInterest: base.totalInterest,
    newInterest: accelerated.totalInterest,
    interestSaved:
      base.totalInterest - accelerated.totalInterest,
    periodsSaved:
      base.payoffPeriod - accelerated.payoffPeriod,
    payoffMonths: accelerated.payoffPeriod
  };
}

export function refinanceComparison(
  balance: number,
  currentRate: number,
  currentMonths: number,
  newRate: number,
  newMonths: number,
  closingCosts = 0
): {
  currentPayment: number;
  newPayment: number;
  monthlySavings: number;
  breakEvenMonths: number;
  interestSavingsBeforeCosts: number;
  netSavings: number;
} {
  const currentPayment =
    Math.abs(pmt(currentRate / 100 / 12, currentMonths, balance));

  const newPayment =
    Math.abs(pmt(newRate / 100 / 12, newMonths, balance));

  const currentInterest =
    currentPayment * currentMonths - balance;

  const newInterest =
    newPayment * newMonths - balance;

  const monthlySavings =
    currentPayment - newPayment;

  const breakEvenMonths =
    monthlySavings > 0
      ? closingCosts / monthlySavings
      : Infinity;

  return {
    currentPayment,
    newPayment,
    monthlySavings,
    breakEvenMonths,
    interestSavingsBeforeCosts:
      currentInterest - newInterest,
    netSavings:
      currentInterest - newInterest - closingCosts
  };
}

export function cashOrFinanceComparison(
  cashPrice: number,
  financeAmount: number,
  annualRate: number,
  termMonths: number,
  investmentReturn: number,
  downPayment = 0
): {
  loanPayment: number;
  totalFinanceCost: number;
  opportunityCost: number;
  netDifference: number;
} {
  const loanPrincipal =
    financeAmount - downPayment;

  const payment =
    Math.abs(
      pmt(
        annualRate / 100 / 12,
        termMonths,
        loanPrincipal
      )
    );

  const totalFinanceCost =
    payment * termMonths - loanPrincipal;

  const opportunityCost =
    (cashPrice - downPayment) *
    (
      Math.pow(
        1 + investmentReturn / 100,
        termMonths / 12
      ) - 1
    );

  return {
    loanPayment: payment,
    totalFinanceCost,
    opportunityCost,
    netDifference: opportunityCost - totalFinanceCost
  };
}

export function leasePayment(
  capCost: number,
  residual: number,
  moneyFactor: number,
  termMonths: number,
  taxRate = 0,
  downPayment = 0
): number {
  const adjustedCapCost =
    capCost - downPayment;

  const depreciation =
    (adjustedCapCost - residual) /
    termMonths;

  const finance =
    (adjustedCapCost + residual) *
    moneyFactor;

  return (depreciation + finance) *
    (1 + taxRate / 100);
}

/* ============================================================================
 * CURRENCY / INFLATION / COMPOUNDING
 * ========================================================================== */

export function convertCurrency(
  amount: number,
  exchangeRate: number
): number {
  assertFinite(amount);
  assertPositive(exchangeRate, "exchangeRate");
  return amount * exchangeRate;
}

export function inflationAdjustedFutureValue(
  presentValue: number,
  inflationRate: number,
  years: number
): number {
  return presentValue *
    Math.pow(1 + inflationRate / 100, years);
}

export function presentValueOfInflationAdjustedFuture(
  futureValue: number,
  inflationRate: number,
  years: number
): number {
  return futureValue /
    Math.pow(1 + inflationRate / 100, years);
}

export function realReturn(
  nominalRate: number,
  inflationRate: number
): number {
  return (
    (1 + nominalRate / 100) /
    (1 + inflationRate / 100) -
    1
  );
}

export function compoundInterest(
  principal: number,
  annualRate: number,
  years: number,
  frequency = 12
): number {
  if (frequency <= 0) {
    throw new CalculationError("FREQUENCY", "frequency must be > 0.");
  }

  return principal *
    Math.pow(
      1 + annualRate / 100 / frequency,
      years * frequency
    );
}

export function percentChange(
  oldValue: number,
  newValue: number
): number {
  if (oldValue === 0) {
    throw new CalculationError("OLD_VALUE", "oldValue cannot be zero.");
  }

  return (newValue - oldValue) / Math.abs(oldValue);
}

/* ============================================================================
 * DEPENDENCY GRAPH
 * ========================================================================== */

export interface DependencyNode {
  id: string;
  dependencies: string[];
  calculate: (
    inputs: Record<string, number>,
    values: Record<string, number>
  ) => number;
}

export interface DependencyResult {
  values: Record<string, number>;
  order: string[];
}

export function calculateDependencyGraph(
  nodes: readonly DependencyNode[],
  inputs: Record<string, number> = {}
): DependencyResult {
  const byId = new Map<string, DependencyNode>();
  for (const node of nodes) {
    if (!node.id || byId.has(node.id)) {
      throw new CalculationError("DUPLICATE_NODE_ID", `Dependency graph node id must be unique: '${node.id}'.`);
    }
    byId.set(node.id, node);
    const uniqueDependencies = new Set(node.dependencies);
    if (uniqueDependencies.size !== node.dependencies.length) {
      throw new CalculationError("DUPLICATE_DEPENDENCY", `Duplicate dependency for '${node.id}'.`);
    }
  }

  for (const node of nodes) {
    for (const dependency of node.dependencies) {
      if (
        !byId.has(dependency) &&
        !Object.prototype.hasOwnProperty.call(inputs, dependency)
      ) {
        throw new CalculationError(
          "MISSING_DEPENDENCY",
          `Missing dependency '${dependency}' for '${node.id}'.`
        );
      }
    }
  }

  const indegree = new Map<string, number>();
  const edges = new Map<string, string[]>();

  for (const node of nodes) {
    indegree.set(
      node.id,
      node.dependencies.filter((dependency) => byId.has(dependency)).length
    );
    edges.set(node.id, []);
  }

  for (const node of nodes) {
    for (const dependency of node.dependencies) {
      if (byId.has(dependency)) {
        edges.get(dependency)!.push(node.id);
      }
    }
  }

  const queue: string[] = [];

  for (const [id, degree] of indegree) {
    if (degree === 0) queue.push(id);
  }

  const order: string[] = [];

  while (queue.length) {
    const id = queue.shift()!;
    order.push(id);

    for (const dependent of edges.get(id) ?? []) {
      const nextDegree = indegree.get(dependent)! - 1;
      indegree.set(dependent, nextDegree);

      if (nextDegree === 0) queue.push(dependent);
    }
  }

  if (order.length !== nodes.length) {
    throw new CalculationError(
      "CYCLE",
      "Dependency graph contains a cycle."
    );
  }

  const values: Record<string, number> = { ...inputs };

  for (const id of order) {
    const node = byId.get(id)!;
    const value = node.calculate(inputs, values);
    assertFinite(value, id);
    values[id] = value;
  }

  return { values, order };
}

/* ============================================================================
 * CALCULATION TRACE / CONTRACT
 * ========================================================================== */

export function withMeta<T>(
  value: T,
  method: string,
  extra: Partial<CalculationMeta> = {}
): CalculationResult<T> {
  return {
    value,
    meta: {
      engineVersion: ENGINE_VERSION,
      calculationId: makeCalculationId(),
      method,
      ...extra
    }
  };
}

export interface InputSpec {
  key: string;
  type:
    | "number"
    | "currency"
    | "percent"
    | "integer"
    | "date"
    | "select"
    | "boolean";
  required?: boolean;
  min?: number;
  max?: number;
}

export interface OutputSpec {
  key: string;
  unit?: string;
  description?: string;
}

export interface CalculatorContract<
  Input = Record<string, unknown>,
  Output = unknown
> {
  id: string;
  version: string;
  inputs: InputSpec[];
  outputs: OutputSpec[];
  calculate: (input: Input) => Output;
  assumptions?: string[];
  jurisdiction?: string;
  methodology?: string;
  sourceIds?: string[];
}

export function validateInputs(
  input: Record<string, unknown>,
  specifications: readonly InputSpec[]
): void {
  for (const specification of specifications) {
    const value = input[specification.key];

    if (specification.required && value === undefined) {
      throw new CalculationError(
        "REQUIRED_INPUT",
        `Missing input '${specification.key}'.`
      );
    }

    if (value === undefined) continue;

    if (
      specification.type === "number" ||
      specification.type === "currency" ||
      specification.type === "percent" ||
      specification.type === "integer"
    ) {
      if (
        typeof value !== "number" ||
        !Number.isFinite(value)
      ) {
        throw new CalculationError(
          "INPUT_TYPE",
          `Input '${specification.key}' must be a finite number.`
        );
      }

      if (
        specification.type === "integer" &&
        !Number.isInteger(value)
      ) {
        throw new CalculationError(
          "INPUT_INTEGER",
          `Input '${specification.key}' must be an integer.`
        );
      }

      if (
        specification.min !== undefined &&
        value < specification.min
      ) {
        throw new CalculationError(
          "INPUT_MIN",
          `Input '${specification.key}' is below minimum.`
        );
      }

      if (
        specification.max !== undefined &&
        value > specification.max
      ) {
        throw new CalculationError(
          "INPUT_MAX",
          `Input '${specification.key}' exceeds maximum.`
        );
      }
    }
  }
}

/* ============================================================================
 * REGRESSION / VERIFICATION
 * ========================================================================== */

export interface RegressionCase {
  name: string;
  run: () => void;
}

export function runRegressionSuite(): {
  passed: number;
  failed: number;
  failures: string[];
} {
  const tests: RegressionCase[] = [
    {
      name: "parser unary precedence",
      run: () => {
        if (evaluateExpression("-2^2") !== -4) {
          throw new Error("-2^2 precedence failed");
        }
      }
    },
    {
      name: "parser negative exponent",
      run: () => {
        if (Math.abs(evaluateExpression("2^-2") - 0.25) > 1e-14) {
          throw new Error("2^-2 failed");
        }
      }
    },
    {
      name: "parser right associative power",
      run: () => {
        if (evaluateExpression("2^3^2") !== 512) {
          throw new Error("2^3^2 failed");
        }
      }
    },
    {
      name: "zero-rate payment",
      run: () => {
        if (Math.abs(pmt(0, 10, 1000) + 100) > 1e-12) {
          throw new Error("zero-rate PMT failed");
        }
      }
    },
    {
      name: "investment timing",
      run: () => {
        const end = calculateInvestment({
          initial: 0,
          annualReturn: 12,
          years: 1,
          contribution: 100,
          contributionFrequency: "MONTHLY",
          contributionTiming: "END"
        });

        const beginning = calculateInvestment({
          initial: 0,
          annualReturn: 12,
          years: 1,
          contribution: 100,
          contributionFrequency: "MONTHLY",
          contributionTiming: "BEGINNING"
        });

        if (!(beginning.futureValue > end.futureValue)) {
          throw new Error("contribution timing failed");
        }
      }
    },
    {
      name: "mortgage amortization",
      run: () => {
        const result = generateAmortizationSchedule({
          principal: 100000,
          annualRate: 6,
          term: 30,
          termUnit: "YEARS",
          frequency: "MONTHLY"
        });

        if (
          result.payoffPeriod !== 360 ||
          result.totalInterest <= 0 ||
          Math.abs(result.totalPrincipal - 100000) > 1e-7
        ) {
          throw new Error("amortization failed");
        }
      }
    },
    {
      name: "dependency cycle",
      run: () => {
        let caught = false;

        try {
          calculateDependencyGraph([
            {
              id: "a",
              dependencies: ["b"],
              calculate: () => 1
            },
            {
              id: "b",
              dependencies: ["a"],
              calculate: () => 1
            }
          ]);
        } catch (error) {
          caught =
            error instanceof CalculationError &&
            error.code === "CYCLE";
        }

        if (!caught) throw new Error("cycle detection failed");
      }
    },
    {
      name: "irr",
      run: () => {
        const result = irr([-100, 60, 60]);

        if (
          !result.converged ||
          Math.abs(result.root - 0.1306623863) > 1e-7
        ) {
          throw new Error("IRR failed");
        }
      }
    },
    {
      name: "high-rate irr",
      run: () => {
        const result = irr([-100, 2100]);
        if (!result.converged || Math.abs(result.root - 20) > 1e-10) {
          throw new Error("high-rate IRR failed");
        }
      }
    },
    {
      name: "high-rate xirr",
      run: () => {
        const result = xirr([
          { date: "2026-01-01", value: -100 },
          { date: "2026-01-31", value: 200 }
        ]);
        if (!result.converged || result.root <= 10) {
          throw new Error("high-rate XIRR failed");
        }
      }
    }
  ];

  let passed = 0;
  const failures: string[] = [];

  for (const test of tests) {
    try {
      test.run();
      passed++;
    } catch (error) {
      failures.push(
        `${test.name}: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  return {
    passed,
    failed: failures.length,
    failures
  };
}

/* ============================================================================
 * DISPLAY
 * ========================================================================== */

export function formatCurrency(
  value: number,
  currency = "USD",
  locale = "en-US",
  maximumFractionDigits = 2
): string {
  assertFinite(value, "currency value");

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits
  }).format(value);
}

export function formatPercent(
  value: number,
  locale = "en-US",
  digits = 2
): string {
  assertFinite(value);

  return new Intl.NumberFormat(locale, {
    style: "percent",
    maximumFractionDigits: digits
  }).format(value / 100);
}

export function formatNumber(
  value: number,
  locale = "en-US",
  digits = 2
): string {
  assertFinite(value);

  return new Intl.NumberFormat(locale, {
    maximumFractionDigits: digits
  }).format(value);
}
