import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { TimelineVisualizer } from './TimelineVisualizer';
import { mergeIntervals } from './useTimeline';

const count = (lane: string) => Number(screen.getByTestId(`count-${lane}`).textContent);

// fireEvent (not user-event) keeps these fully synchronous under fake timers + rAF.
describe('TimelineVisualizer', () => {
  beforeEach(() => {
    vi.useFakeTimers({
      toFake: ['setTimeout', 'clearTimeout', 'Date', 'performance', 'requestAnimationFrame', 'cancelAnimationFrame'],
    });
  });
  afterEach(() => vi.useRealTimers());

  it('shows raw vs debounced vs throttled fires on a shared axis', () => {
    render(<TimelineVisualizer initialWait={300} />);
    const mash = screen.getByRole('button', { name: 'Mash me' });

    for (let i = 0; i < 5; i++) {
      fireEvent.click(mash);
      act(() => vi.advanceTimersByTime(50));
    }
    act(() => vi.advanceTimersByTime(1000));

    expect(count('raw')).toBe(5);
    expect(count('trailing')).toBe(1);
    expect(count('leading')).toBe(1);
    expect(count('both')).toBe(2);
    expect(count('throttle')).toBe(2);
    expect(screen.getByRole('img', { name: 'debounce · trailing: 1 call' })).toBeInTheDocument();
  });

  it('plays a scripted burst and clears', () => {
    render(<TimelineVisualizer lanes={['trailing']} />);
    expect(screen.queryByText('throttle')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Play sample burst' }));
    act(() => vi.advanceTimersByTime(6000));
    expect(count('raw')).toBe(18);
    expect(count('trailing')).toBeGreaterThanOrEqual(2);
    fireEvent.click(screen.getByRole('button', { name: 'Clear' }));
    expect(count('raw')).toBe(0);
  });

  it('typing feeds the timeline', () => {
    render(<TimelineVisualizer lanes={['trailing']} />);
    const box = screen.getByRole('textbox', { name: 'Type here' });
    for (const v of ['a', 'ab', 'abc']) {
      fireEvent.change(box, { target: { value: v } });
      act(() => vi.advanceTimersByTime(50));
    }
    act(() => vi.advanceTimersByTime(1000));
    expect(count('raw')).toBe(3);
    expect(count('trailing')).toBe(1);
    expect(screen.getAllByText('"abc"').length).toBeGreaterThan(0);
  });
});

describe('mergeIntervals', () => {
  it('merges overlaps', () => {
    expect(mergeIntervals([[5, 8], [0, 2], [1, 3], [8, 9]])).toEqual([[0, 3], [5, 9]]);
  });
});
