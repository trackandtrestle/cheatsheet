import { describe, expect, it } from 'vitest';
import { isRef } from 'vue';
import { count, first, fromMap, n, state } from './refUnwrapping';

describe('ref unwrapping rules', () => {
  it('unwraps refs in reactive objects and writes through to the ref', () => {
    expect(n).toBe(2);
    expect(state.count).toBe(2);
    expect(count.value).toBe(2);
    count.value = 3;
    expect(state.count).toBe(3);
  });

  it('does not unwrap refs in arrays or Maps', () => {
    expect(isRef(first)).toBe(true);
    expect(first?.value).toBe(10);
    expect(isRef(fromMap)).toBe(true);
    expect(fromMap?.value).toBe(20);
  });
});
