import { describe, expect, it } from 'vitest';
import { clone, found, foundRaw, identity, included, raw, state } from './identity';

describe('reactive identity', () => {
  it('proxy vs raw', () => {
    expect(identity).toEqual({
      proxyIsNotRaw: true,
      cached: true,
      idempotent: true,
      rawBack: true,
      isProxy: true,
    });
  });

  it('array search compares proxies unless you toRaw', () => {
    expect(found).toBeUndefined();
    expect(foundRaw).toBe(state);
    expect(included).toBe(true);
  });

  it('structuredClone needs the raw object', () => {
    expect(() => structuredClone(state)).toThrow();
    expect(clone(state)).toEqual(raw);
    expect(clone(state)).not.toBe(raw);
  });
});
