import { act, render, renderHook, screen } from '@testing-library/react';
import { useEffect, useState } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useInterval } from './useInterval';

function Counter({ delay }: { delay: number | null }) {
  const [count, setCount] = useState(0);
  useInterval(() => setCount(count + 1), delay); // reads `count` from the latest render
  return <output>{count}</output>;
}

// The trap: a plain setInterval in a mount-only effect captures count = 0 forever.
function StaleCounter() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setCount(count + 1), 100);
    return () => clearInterval(id);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return <output>{count}</output>;
}

describe('useInterval', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('always uses the latest callback (no stale closure)', () => {
    render(<Counter delay={100} />);
    // One act per tick: React renders (and refreshes the ref) between ticks, as in a browser.
    for (let i = 0; i < 3; i++) act(() => vi.advanceTimersByTime(100));
    expect(screen.getByRole('status')).toHaveTextContent('3');
  });

  it('stale closure demo: the naive version gets stuck at 1', () => {
    render(<StaleCounter />);
    for (let i = 0; i < 3; i++) act(() => vi.advanceTimersByTime(100));
    expect(screen.getByRole('status')).toHaveTextContent('1');
  });

  it('pauses with null and resumes', () => {
    const { rerender } = render(<Counter delay={100} />);
    act(() => vi.advanceTimersByTime(100));
    rerender(<Counter delay={null} />);
    act(() => vi.advanceTimersByTime(500));
    expect(screen.getByRole('status')).toHaveTextContent('1');
    rerender(<Counter delay={100} />);
    act(() => vi.advanceTimersByTime(100));
    expect(screen.getByRole('status')).toHaveTextContent('2');
  });

  it('does not restart the interval when only the callback changes', () => {
    const tick = vi.fn();
    const { rerender } = renderHook(({ cb }) => useInterval(cb, 100), { initialProps: { cb: vi.fn() } });
    act(() => vi.advanceTimersByTime(60));
    rerender({ cb: tick });
    act(() => vi.advanceTimersByTime(40)); // fires at t=100, not t=160
    expect(tick).toHaveBeenCalledTimes(1);
  });
});
