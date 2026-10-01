import { fireEvent, render, screen } from '@testing-library/vue';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { nextTick } from 'vue';
import TimelineVisualizer from './TimelineVisualizer.vue';
import { mergeIntervals } from './useTimeline';

const count = (lane: string) => Number(screen.getByTestId(`count-${lane}`).textContent);
const advance = async (ms: number) => {
  vi.advanceTimersByTime(ms);
  await nextTick();
};

// fireEvent (not user-event) keeps these deterministic under fake timers + rAF.
describe('TimelineVisualizer', () => {
  beforeEach(() => {
    vi.useFakeTimers({
      toFake: ['setTimeout', 'clearTimeout', 'Date', 'performance', 'requestAnimationFrame', 'cancelAnimationFrame'],
    });
  });
  afterEach(() => vi.useRealTimers());

  it('shows raw vs debounced vs throttled fires on a shared axis', async () => {
    render(TimelineVisualizer, { props: { initialWait: 300 } });
    const mash = screen.getByRole('button', { name: 'Mash me' });
    for (let i = 0; i < 5; i++) {
      await fireEvent.click(mash);
      await advance(50);
    }
    await advance(1000);
    expect(count('raw')).toBe(5);
    expect(count('trailing')).toBe(1);
    expect(count('leading')).toBe(1);
    expect(count('both')).toBe(2);
    expect(count('throttle')).toBe(2);
    expect(screen.getByRole('img', { name: 'debounce · trailing: 1 call' })).toBeInTheDocument();
  });

  it('plays a scripted burst and clears', async () => {
    render(TimelineVisualizer, { props: { lanes: ['trailing'] } });
    expect(screen.queryByText('throttle')).not.toBeInTheDocument();
    await fireEvent.click(screen.getByRole('button', { name: 'Play sample burst' }));
    await advance(6000);
    expect(count('raw')).toBe(18);
    expect(count('trailing')).toBeGreaterThanOrEqual(2);
    await fireEvent.click(screen.getByRole('button', { name: 'Clear' }));
    expect(count('raw')).toBe(0);
  });

  it('typing feeds the timeline', async () => {
    render(TimelineVisualizer, { props: { lanes: ['trailing'] } });
    const box = screen.getByRole('textbox', { name: 'Type here' });
    for (const v of ['a', 'ab', 'abc']) {
      await fireEvent.update(box, v);
      await advance(50);
    }
    await advance(1000);
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
