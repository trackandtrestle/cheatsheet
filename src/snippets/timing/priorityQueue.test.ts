import { describe, expect, it } from 'vitest';
import { PriorityTaskQueue } from './priorityQueue';

describe('PriorityTaskQueue', () => {
  it('runs queued tasks highest priority first (FIFO within a priority)', async () => {
    const queue = new PriorityTaskQueue(1);
    const order: string[] = [];
    const blocker = Promise.withResolvers<void>();
    const task = (name: string) => async () => {
      order.push(name);
    };

    const first = queue.add(() => blocker.promise); // occupies the only slot
    const rest = [
      queue.add(task('low'), 0),
      queue.add(task('high-a'), 10),
      queue.add(task('mid'), 5),
      queue.add(task('high-b'), 10),
    ];
    blocker.resolve();
    await Promise.all([first, ...rest]);
    expect(order).toEqual(['high-a', 'high-b', 'mid', 'low']);
  });

  it('respects concurrency and settles each task with its own result or error', async () => {
    const queue = new PriorityTaskQueue(2);
    let inFlight = 0;
    let maxInFlight = 0;
    const track = <T>(value: T) => async () => {
      maxInFlight = Math.max(maxInFlight, ++inFlight);
      await Promise.resolve();
      inFlight--;
      return value;
    };
    const results = await Promise.allSettled([
      queue.add(track(1)),
      queue.add(() => Promise.reject(new Error('bad'))),
      queue.add(track(3)),
      queue.add(track(4)),
    ]);
    expect(results.map((r) => r.status)).toEqual(['fulfilled', 'rejected', 'fulfilled', 'fulfilled']);
    expect(maxInFlight).toBeLessThanOrEqual(2);
  });
});
