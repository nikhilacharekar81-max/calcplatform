import { CalculationDag } from "../../src/calculation-grid/dag.ts";
import { acceptIfCurrent } from "../../src/calculation-grid/execution.ts";
import { supportsSharedArrayBuffer } from "../../src/workers/sharedBuffer.ts";

function assert(condition: boolean, msg: string) {
  if (!condition) throw new Error(msg);
}

export function runArchitectureTests(): { name: string; passed: boolean; error?: string }[] {
  const results: { name: string; passed: boolean; error?: string }[] = [];

  const runTest = (name: string, fn: () => void) => {
    try {
      fn();
      results.push({ name, passed: true });
    } catch (err: any) {
      results.push({ name, passed: false, error: err.message });
    }
  };

  runTest("DAG - Topological Ordering and Dependency Resolution", () => {
    const dag = new CalculationDag();
    dag.addNode({ id: "income", dependencies: [], compute: () => 100000 });
    dag.addNode({ id: "deduction", dependencies: [], compute: () => 20000 });
    dag.addNode({
      id: "taxable",
      dependencies: ["income", "deduction"],
      compute: (ctx) => Number(ctx.get("income")) - Number(ctx.get("deduction")),
    });
    dag.addNode({
      id: "tax",
      dependencies: ["taxable"],
      compute: (ctx) => Number(ctx.get("taxable")) * 0.1,
    });

    const order = dag.topologicalOrder();
    assert(order.indexOf("income") < order.indexOf("taxable"), "income before taxable");
    assert(order.indexOf("deduction") < order.indexOf("taxable"), "deduction before taxable");
    assert(order.indexOf("taxable") < order.indexOf("tax"), "taxable before tax");

    const evalRes = dag.evaluate();
    assert(evalRes.get("taxable") === 80000, "Taxable computation = 80,000");
    assert(evalRes.get("tax") === 8000, "Tax computation = 8,000");
  });

  runTest("DAG - Cycle Detection", () => {
    const dag = new CalculationDag();
    dag.addNode({ id: "a", dependencies: ["b"], compute: () => 1 });
    dag.addNode({ id: "b", dependencies: ["a"], compute: () => 1 });
    let cycleCaught = false;
    try {
      dag.topologicalOrder();
    } catch (err: any) {
      if (err.message.includes("Cycle detected")) {
        cycleCaught = true;
      }
    }
    assert(cycleCaught, "DAG must detect dependency cycles");
  });

  runTest("DAG - Incremental Invalidation Tracking", () => {
    const dag = new CalculationDag();
    dag.addNode({ id: "a", dependencies: [], compute: () => 10 });
    dag.addNode({ id: "b", dependencies: ["a"], compute: (ctx) => Number(ctx.get("a")) * 2 });
    dag.addNode({ id: "c", dependencies: ["b"], compute: (ctx) => Number(ctx.get("b")) + 5 });
    dag.addNode({ id: "d", dependencies: [], compute: () => 99 });

    dag.evaluate();
    dag.invalidateFrom("a");

    assert(dag.isInvalidated("a"), "Node 'a' is invalidated");
    assert(dag.isInvalidated("b"), "Dependent 'b' is invalidated");
    assert(dag.isInvalidated("c"), "Downstream dependent 'c' is invalidated");
    assert(!dag.isInvalidated("d"), "Independent 'd' must NOT be invalidated");
  });

  runTest("Execution Grid - Stale Result Rejection", () => {
    const current = { graphVersion: 5, calculationVersion: "tax-ay-2026-v2", ruleVersion: "2026-27" };
    const staleCandidate = {
      version: { graphVersion: 4, calculationVersion: "tax-ay-2026-v2", ruleVersion: "2026-27" },
      result: 45000,
    };
    const validCandidate = {
      version: { graphVersion: 5, calculationVersion: "tax-ay-2026-v2", ruleVersion: "2026-27" },
      result: 50000,
    };

    assert(acceptIfCurrent(current, staleCandidate) === null, "Stale graphVersion result must be rejected (return null)");
    assert(acceptIfCurrent(current, validCandidate) === 50000, "Matching version result must be accepted");
  });

  runTest("Worker System - SharedArrayBuffer Feature Detection", () => {
    const supports = supportsSharedArrayBuffer();
    assert(typeof supports === "boolean", "SharedArrayBuffer capability detection returned boolean");
  });

  return results;
}
