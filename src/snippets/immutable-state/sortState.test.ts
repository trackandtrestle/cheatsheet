import { describe, expect, it } from 'vitest';
import type { Row } from './sortState';
import { byNameCopy, byScoreDesc, reversed, sortInPlace } from './sortState';

const make = (): Row[] => [
  { name: 'bo', score: 1 },
  { name: 'al', score: 3 },
  { name: 'cy', score: 2 },
];

describe('sorting state', () => {
  it('sort() mutates and returns the same reference', () => {
    const rows = make();
    const result = sortInPlace(rows);
    expect(result).toBe(rows); // Object.is(prev, next) -> React bails out
    expect(rows[0]?.name).toBe('al'); // original was changed
  });

  it('toSorted / toReversed / copy-then-sort leave the input alone', () => {
    const rows = Object.freeze(make());
    expect(byScoreDesc(rows).map((r) => r.name)).toEqual(['al', 'cy', 'bo']);
    expect(reversed(rows).map((r) => r.name)).toEqual(['cy', 'al', 'bo']);
    expect(byNameCopy(rows).map((r) => r.name)).toEqual(['al', 'bo', 'cy']);
    expect(rows[0]?.name).toBe('bo');
  });
});
