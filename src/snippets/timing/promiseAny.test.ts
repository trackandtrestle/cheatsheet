import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fastestMirror, reasonsOf } from './promiseAny';

const after = <T>(ms: number, value: T) =>
  new Promise<T>((resolve) => setTimeout(() => resolve(value), ms));
const failAfter = (ms: number, message: string) =>
  new Promise<never>((_, reject) => setTimeout(() => reject(new Error(message)), ms));

describe('Promise.any', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('skips earlier rejections and resolves with the first success', async () => {
    const p = fastestMirror([() => failAfter(10, 'eu down'), () => after(200, 'us'), () => after(300, 'asia')]);
    await vi.advanceTimersByTimeAsync(200);
    await expect(p).resolves.toBe('us');
  });

  it('rejects with an AggregateError only when all reject', async () => {
    const p = fastestMirror([() => failAfter(10, 'eu down'), () => failAfter(20, 'us down')]);
    const caught = p.catch((error: unknown) => error);
    await vi.advanceTimersByTimeAsync(20);
    const error = await caught;
    expect(error).toBeInstanceOf(AggregateError);
    expect(reasonsOf(error)).toEqual([new Error('eu down'), new Error('us down')]);
  });
});
