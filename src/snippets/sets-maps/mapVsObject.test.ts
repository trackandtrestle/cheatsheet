import { describe, expect, it } from 'vitest';
import { dict, mapKeys, objectKeys, protoKey } from './mapVsObject';

describe('Map vs object', () => {
  it('Map keeps key types distinct and supports object keys', () => {
    expect(mapKeys()).toEqual({ size: 3, byObject: 'object', numberVsString: true });
  });

  it('objects coerce keys to strings', () => {
    expect(objectKeys()).toBe(1);
  });

  it('"__proto__" is special on objects but a normal Map key', () => {
    expect(protoKey()).toEqual({ objectHasOwn: false, mapHas: true });
  });

  it('Object.create(null) has no inherited keys', () => {
    const d = dict<number>();
    expect('toString' in d).toBe(false);
    expect('toString' in {}).toBe(true);
  });
});
