import { describe, expect, it } from 'vitest';
import * as m from './setMethods';

describe('ES2025 Set methods', () => {
  it('computes set algebra (order follows the receiver, then the argument)', () => {
    expect([...m.all]).toEqual(['ts', 'react', 'css', 'go', 'sql']);
    expect([...m.shared]).toEqual(['ts']);
    expect([...m.onlyFrontend]).toEqual(['react', 'css']);
    expect([...m.eitherNotBoth]).toEqual(['react', 'css', 'go', 'sql']);
  });

  it('answers relationship questions', () => {
    expect(m.isSubset).toBe(true);
    expect(m.isSuperset).toBe(true);
    expect(m.disjoint).toBe(true);
  });

  it('accepts set-like arguments such as a Map (uses its keys)', () => {
    expect([...m.langsInFrontend]).toEqual(['ts']);
  });

  it('throws on arrays: they are not set-like', () => {
    const s = new Set([1]);
    // @ts-expect-error — arrays lack size/has/keys
    expect(() => s.union([2])).toThrow(TypeError);
  });
});
