import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FocusableSearch, Stopwatch } from './UseRef';

describe('useRef', () => {
  describe('mutable value', () => {
    beforeEach(() => vi.useFakeTimers());
    afterEach(() => vi.useRealTimers());

    it('stores the interval id without re-rendering; double start is a no-op', () => {
      const { unmount } = render(<Stopwatch />);
      fireEvent.click(screen.getByRole('button', { name: 'Start' }));
      fireEvent.click(screen.getByRole('button', { name: 'Start' }));
      expect(vi.getTimerCount()).toBe(1);

      act(() => vi.advanceTimersByTime(3000));
      expect(screen.getByLabelText('ticks')).toHaveTextContent('3');

      fireEvent.click(screen.getByRole('button', { name: 'Stop' }));
      act(() => vi.advanceTimersByTime(3000));
      expect(screen.getByLabelText('ticks')).toHaveTextContent('3');

      fireEvent.click(screen.getByRole('button', { name: 'Start' }));
      unmount();
      expect(vi.getTimerCount()).toBe(0);
    });
  });

  it('DOM ref focuses the input', async () => {
    render(<FocusableSearch />);
    await userEvent.setup().click(screen.getByRole('button', { name: 'Focus search' }));
    expect(screen.getByRole('searchbox', { name: 'Search' })).toHaveFocus();
  });
});
