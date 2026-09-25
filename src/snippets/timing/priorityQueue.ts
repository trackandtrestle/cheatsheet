interface Job {
  priority: number;
  seq: number; // FIFO tie-breaker for equal priorities
  start: () => Promise<void>;
}

// Async task queue: runs up to `concurrency` tasks, highest priority first.
export class PriorityTaskQueue {
  #jobs: Job[] = [];
  #running = 0;
  #seq = 0;

  constructor(readonly concurrency = 1) {}

  add<T>(task: () => Promise<T>, priority = 0): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      // Promise.resolve().then(task) also turns a synchronous throw into a rejection.
      const start = () => Promise.resolve().then(task).then(resolve, reject);
      this.#jobs.push({ priority, seq: this.#seq++, start });
      this.#jobs.sort((a, b) => b.priority - a.priority || a.seq - b.seq);
      this.#drain();
    });
  }

  #drain(): void {
    while (this.#running < this.concurrency) {
      const job = this.#jobs.shift();
      if (!job) return;
      this.#running++;
      void job.start().finally(() => {
        this.#running--;
        this.#drain();
      });
    }
  }
}
