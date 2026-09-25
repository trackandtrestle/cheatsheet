import { act, renderHook } from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, it } from 'vitest';
import { toggleIn, useToggleSet } from './useToggleSet';

describe('Set state', () => {
  it('toggleIn returns a new Set and leaves prev untouched', () => {
    const prev = new Set(['a']);
    const next = toggleIn(prev, 'b');
    expect([...next]).toEqual(['a', 'b']);
    expect([...toggleIn(next, 'a')]).toEqual(['b']);
    expect([...prev]).toEqual(['a']);
  });

  it('useToggleSet rerenders with a new Set', () => {
    const { result } = renderHook(() => useToggleSet(['x']));
    act(() => result.current.toggle('y'));
    expect([...result.current.selected]).toEqual(['x', 'y']);
    act(() => result.current.toggle('x'));
    expect([...result.current.selected]).toEqual(['y']);
  });

  it('mutating and returning the same Set does not rerender', () => {
    let renders = 0;
    const { result } = renderHook(() => {
      renders += 1;
      return useState(() => new Set<string>());
    });
    const before = renders;
    act(() => result.current[1]((prev) => (prev.add('lost'), prev)));
    expect(renders).toBe(before); // React bailed out: same reference
  });
});
