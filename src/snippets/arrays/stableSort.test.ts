import { describe, expect, it } from 'vitest';
import { byPriorityThenName, shuffle, type Task } from './stableSort';

describe('stable sort', () => {
  it('keeps equal items in prior order', () => {
    const tasks: Task[] = [
      { name: 'c', priority: 1 },
      { name: 'b', priority: 2 },
      { name: 'a', priority: 1 },
    ];
    expect(byPriorityThenName(tasks).map((t) => t.name)).toEqual(['a', 'c', 'b']);
  });
  it('Fisher–Yates shuffle is a permutation', () => {
    const out = shuffle([1, 2, 3, 4, 5]);
    expect(out.toSorted((a, b) => a - b)).toEqual([1, 2, 3, 4, 5]);
    expect(shuffle([1, 2, 3], () => 0)).toEqual([2, 3, 1]);
  });
});
