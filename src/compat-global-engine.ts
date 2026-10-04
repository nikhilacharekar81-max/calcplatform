/**
 * Compatibility facade for consumers that previously imported the monolithic
 * USA/global engine. It intentionally re-exports both the reusable global
 * maths kernel and the USA jurisdiction layer.
 */
export * from "./engines/financial-maths/index.ts";
export * from "./rules/usa/usa-engine.ts";
