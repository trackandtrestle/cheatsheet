import { describe, expect, it } from 'vitest';
import { latestPerCityDay, uniqueByKeepFirst, uniqueByKeepLast } from './dedupeBy';

const users = [
  { id: 1, v: 'a' },
  { id: 2, v: 'b' },
  { id: 1, v: 'c' },
];

describe('dedupe by key', () => {
  it('keep last', () => {
    expect(uniqueByKeepLast(users, (u) => u.id)).toEqual([{ id: 1, v: 'c' }, { id: 2, v: 'b' }]);
  });
  it('keep first', () => {
    expect(uniqueByKeepFirst(users, (u) => u.id)).toEqual([{ id: 1, v: 'a' }, { id: 2, v: 'b' }]);
  });
  it('composite string key', () => {
    const rows = [
      { city: 'X', day: 'mon', temp: 1 },
      { city: 'X', day: 'mon', temp: 2 },
      { city: 'X', day: 'tue', temp: 3 },
    ];
    expect(latestPerCityDay(rows).map((r) => r.temp)).toEqual([2, 3]);
  });
});
