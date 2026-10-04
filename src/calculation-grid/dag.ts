export interface CalculationNode<T = unknown> {
  id: string;
  dependencies: readonly string[];
  compute: (context: ReadonlyMap<string, unknown>) => T;
}

export class CalculationDag {
  private readonly nodes = new Map<string, CalculationNode>();
  private readonly invalidated = new Set<string>();
  private version = 1;

  getVersion(): number {
    return this.version;
  }

  addNode<T>(node: CalculationNode<T>): void {
    if (this.nodes.has(node.id)) {
      throw new Error(`Duplicate node: ${node.id}`);
    }
    this.nodes.set(node.id, node as CalculationNode<unknown>);
    this.version++;
  }

  topologicalOrder(): string[] {
    const state = new Map<string, 0 | 1 | 2>(); // 0=unvisited, 1=visiting, 2=visited
    const output: string[] = [];

    const visit = (id: string): void => {
      const s = state.get(id) ?? 0;
      if (s === 1) throw new Error(`Cycle detected at node: ${id}`);
      if (s === 2) return;

      const node = this.nodes.get(id);
      if (!node) throw new Error(`Missing dependency: ${id}`);

      state.set(id, 1);
      for (const dep of node.dependencies) {
        visit(dep);
      }
      state.set(id, 2);
      output.push(id);
    };

    for (const id of this.nodes.keys()) {
      visit(id);
    }

    return output;
  }

  invalidateFrom(id: string): void {
    if (!this.nodes.has(id)) {
      throw new Error(`Unknown node: ${id}`);
    }

    const dependents = new Map<string, string[]>();
    for (const node of this.nodes.values()) {
      for (const dep of node.dependencies) {
        const list = dependents.get(dep) ?? [];
        list.push(node.id);
        dependents.set(dep, list);
      }
    }

    const queue = [id];
    const seen = new Set<string>();

    while (queue.length) {
      const current = queue.shift()!;
      if (seen.has(current)) continue;
      seen.add(current);
      this.invalidated.add(current);

      for (const next of dependents.get(current) ?? []) {
        queue.push(next);
      }
    }
  }

  evaluate(): Map<string, unknown> {
    const context = new Map<string, unknown>();
    for (const id of this.topologicalOrder()) {
      const node = this.nodes.get(id)!;
      context.set(id, node.compute(context));
      this.invalidated.delete(id);
    }
    return context;
  }

  isInvalidated(id: string): boolean {
    return this.invalidated.has(id);
  }
}
