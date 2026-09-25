import { describe, expect, it } from 'vitest';
import { replaceAt, updateById } from './updateById';

interface Todo {
  id: string;
  text: string;
  done: boolean;
}

const list: readonly Todo[] = Object.freeze([
  { id: 'a', text: 'A', done: false },
  { id: 'b', text: 'B', done: false },
]);

describe('updateById', () => {
  it('patches only the matching item and preserves other references', () => {
    const next = updateById(list, 'b', { done: true });
    expect(next[1]).toEqual({ id: 'b', text: 'B', done: true });
    expect(next[0]).toBe(list[0]);
    expect(list[1]?.done).toBe(false);
  });

  it('accepts an updater function', () => {
    const next = updateById(list, 'a', (t) => ({ ...t, done: !t.done }));
    expect(next[0]?.done).toBe(true);
  });

  it('replaceAt uses .with() and throws on out-of-range indexes', () => {
    expect(replaceAt(['x', 'y'], 1, 'Y')).toEqual(['x', 'Y']);
    expect(replaceAt(['x', 'y'], -1, 'last')).toEqual(['x', 'last']);
    expect(() => replaceAt(['x'], 5, 'nope')).toThrow(RangeError);
  });
});
