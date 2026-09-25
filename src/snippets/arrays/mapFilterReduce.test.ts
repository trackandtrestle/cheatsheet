import { describe, expect, it } from 'vitest';
import { byId, ids, maxNoInit, revenue, unpaid, type Order } from './mapFilterReduce';

const orders: Order[] = [
  { id: 'a', total: 10, paid: true },
  { id: 'b', total: 5, paid: false },
  { id: 'c', total: 7, paid: true },
];

describe('map / filter / reduce', () => {
  it('maps and filters', () => {
    expect(ids(orders)).toEqual(['a', 'b', 'c']);
    expect(unpaid(orders).map((o) => o.id)).toEqual(['b']);
  });
  it('reduces with an initial value (empty safe)', () => {
    expect(revenue(orders)).toBe(17);
    expect(revenue([])).toBe(0);
    expect(byId(orders).c?.total).toBe(7);
  });
  it('reduce without initial value throws on empty arrays', () => {
    expect(maxNoInit([3, 9, 2])).toBe(9);
    expect(() => maxNoInit([])).toThrow(TypeError);
  });
});
