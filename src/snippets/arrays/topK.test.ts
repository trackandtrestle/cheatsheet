import { describe, expect, it } from 'vitest';
import { mostFrequent, topK, topKSmall } from './topK';

describe('top-K', () => {
  it('by score', () => {
    const players = [{ n: 'a', s: 5 }, { n: 'b', s: 9 }, { n: 'c', s: 7 }];
    expect(topK(players, 2, (p) => p.s).map((p) => p.n)).toEqual(['b', 'c']);
  });
  it('most frequent', () => {
    expect(mostFrequent(['x', 'y', 'y', 'z', 'x', 'y'], 2)).toEqual([['y', 3], ['x', 2]]);
  });
  it('bounded buffer', () => {
    expect(topKSmall([5, 1, 9, 3, 7, 9], 3)).toEqual([9, 9, 7]);
    expect(topKSmall([2], 3)).toEqual([2]);
    expect(topKSmall([1, 2], 0)).toEqual([]);
  });
});
