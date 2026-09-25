import { describe, expect, it } from 'vitest';
import { renderHook } from '@testing-library/react';
import { usePrevious } from './usePrevious';

describe('usePrevious', () => {
  it('is undefined first, then tracks the last different value', () => {
    const { result, rerender } = renderHook(({ v }) => usePrevious(v), { initialProps: { v: 1 } });
    expect(result.current).toBeUndefined();

    rerender({ v: 2 });
    expect(result.current).toBe(1);

    rerender({ v: 2 }); // unrelated re-render doesn't lose the previous value
    expect(result.current).toBe(1);

    rerender({ v: 5 });
    expect(result.current).toBe(2);
  });
});
