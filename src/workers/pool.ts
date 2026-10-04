import type { CalculationJob, CalculationWorkerMessage } from "./protocol.ts";

export interface WorkerLike {
  postMessage(message: unknown): void;
  terminate(): void;
  onmessage: ((event: MessageEvent) => void) | null;
  onerror: ((event: ErrorEvent) => void) | null;
}

export type WorkerFactory = () => WorkerLike;

type Pending = {
  job: CalculationJob;
  resolve: (v: unknown) => void;
  reject: (e: Error) => void;
  worker?: WorkerLike;
};

export class CalculationWorkerPool {
  private readonly workers: WorkerLike[] = [];
  private readonly busy = new Set<WorkerLike>();
  private readonly queue: Pending[] = [];
  private readonly active = new Map<string, Pending>();

  constructor(private readonly factory: WorkerFactory, size = 1) {
    if (size < 1) throw new Error("Worker pool size must be >= 1");
    for (let i = 0; i < size; i++) {
      this.createWorker();
    }
  }

  private createWorker() {
    const worker = this.factory();
    worker.onmessage = (event) => {
      const message = event.data as CalculationWorkerMessage;
      const item = this.active.get(message.jobId);
      if (!item) return;

      this.active.delete(message.jobId);
      this.busy.delete(worker);

      if (message.ok) {
        item.resolve(message.result);
      } else {
        item.reject(new Error(message.error));
      }

      this.dispatch();
    };

    worker.onerror = (event) => {
      for (const [id, item] of this.active) {
        if (item.worker === worker) {
          this.active.delete(id);
          item.reject(new Error(event.message || "Worker failure"));
        }
      }
      this.busy.delete(worker);
      this.dispatch();
    };

    this.workers.push(worker);
  }

  execute<T, R>(job: CalculationJob<T>): Promise<R> {
    return new Promise<R>((resolve, reject) => {
      this.queue.push({
        job,
        resolve: resolve as (v: unknown) => void,
        reject
      });
      this.dispatch();
    });
  }

  private dispatch() {
    for (const worker of this.workers) {
      if (this.busy.has(worker)) continue;
      const item = this.queue.shift();
      if (!item) return;

      item.worker = worker;
      this.busy.add(worker);
      this.active.set(item.job.jobId, item);
      worker.postMessage(item.job);
    }
  }

  terminate() {
    for (const worker of this.workers) {
      worker.terminate();
    }
    this.workers.length = 0;
    this.busy.clear();
    this.queue.length = 0;
    this.active.clear();
  }
}
