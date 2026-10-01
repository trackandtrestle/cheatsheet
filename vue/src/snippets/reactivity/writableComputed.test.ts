import { describe, expect, it } from 'vitest';
import { useFullName, useLastValidNumber } from './writableComputed';

describe('writable computed', () => {
  it('setter writes through to the source refs', () => {
    const { first, last, fullName } = useFullName();
    expect(fullName.value).toBe('Ada Lovelace');
    fullName.value = '  Grace   Brewster Hopper ';
    expect(first.value).toBe('Grace');
    expect(last.value).toBe('Brewster Hopper');
    expect(fullName.value).toBe('Grace Brewster Hopper');
  });

  it('getter can fall back to the previous value', () => {
    const { input, value } = useLastValidNumber();
    input.value = '42';
    expect(value.value).toBe(42);
    input.value = '4x';
    expect(value.value).toBe(42);
  });
});
