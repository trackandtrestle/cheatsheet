import { describe, expect, it } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';

export function useCounter(initial = 0, step = 1) {
  const [count, setCount] = useState(initial);
  const increment = useCallback(() => setCount((c) => c + step), [step]);
  return { count, increment };
}

describe('renderHook', () => {
  it('reads result.current AFTER act — never destructure it early', () => {
    const { result } = renderHook(() => useCounter(5));
    act(() => result.current.increment()); // state updates must be wrapped in act
    expect(result.current.count).toBe(6);
  });

  it('rerender with new props', () => {
    const { result, rerender } = renderHook(({ step }) => useCounter(0, step), {
      initialProps: { step: 1 },
    });
    rerender({ step: 10 });
    act(() => result.current.increment());
    expect(result.current.count).toBe(10);
  });

  it('wrapper provides context', () => {
    const Theme = createContext('light');
    const wrapper = ({ children }: { children: ReactNode }) => (
      <Theme.Provider value="dark">{children}</Theme.Provider>
    );
    const { result } = renderHook(() => useContext(Theme), { wrapper });
    expect(result.current).toBe('dark');
  });
});
