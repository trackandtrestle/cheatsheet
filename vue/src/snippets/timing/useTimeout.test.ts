import { render, screen, fireEvent } from '@testing-library/vue';
import { defineComponent, h } from 'vue';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useTimeout } from './useTimeout';

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

const onDone = vi.fn<() => void>();
const Toast = defineComponent(() => {
  const { start, stop, isPending } = useTimeout(onDone, 1000);
  return () => [
    h('button', { onClick: start }, 'start'),
    h('button', { onClick: stop }, 'stop'),
    h('output', isPending.value ? 'pending' : 'idle'),
  ];
});

describe('useTimeout', () => {
  afterEach(() => onDone.mockReset());

  it('start() runs the callback once and tracks isPending', async () => {
    render(Toast);
    await fireEvent.click(screen.getByText('start'));
    expect(screen.getByRole('status')).toHaveTextContent('pending');
    vi.advanceTimersByTime(600);
    await fireEvent.click(screen.getByText('start')); // restart
    vi.advanceTimersByTime(600);
    expect(onDone).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(400);
    expect(onDone).toHaveBeenCalledOnce();
    expect(screen.getByRole('status')).toHaveTextContent('idle');
  });

  it('stop() and unmount both cancel', async () => {
    const { unmount } = render(Toast);
    await fireEvent.click(screen.getByText('start'));
    await fireEvent.click(screen.getByText('stop'));
    vi.runAllTimers();
    expect(onDone).not.toHaveBeenCalled();
    await fireEvent.click(screen.getByText('start'));
    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });
});
