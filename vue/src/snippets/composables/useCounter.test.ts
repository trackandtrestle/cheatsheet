import { describe, expect, it } from 'vitest';
import { defineComponent, h } from 'vue';
import { fireEvent, render, screen } from '@testing-library/vue';
import { useCounter } from './useCounter';

const Stepper = defineComponent({
  setup() {
    const { count, inc, dec, atMin, atMax, reset } = useCounter(1, { min: 0, max: 3 });
    return () => [
      h('button', { disabled: atMin(), onClick: () => dec() }, '-'),
      h('output', count.value),
      h('button', { disabled: atMax(), onClick: () => inc() }, '+'),
      h('button', { onClick: reset }, 'Reset'),
    ];
  },
});

describe('useCounter', () => {
  it('increments, clamps to min/max and disables the ends', async () => {
    render(Stepper);
    const plus = screen.getByRole('button', { name: '+' });
    const minus = screen.getByRole('button', { name: '-' });
    const out = screen.getByRole('status');
    for (let i = 0; i < 5; i++) await fireEvent.click(plus);
    expect(out).toHaveTextContent('3');
    expect(plus).toBeDisabled();
    await fireEvent.click(screen.getByRole('button', { name: 'Reset' }));
    await fireEvent.click(minus);
    expect(out).toHaveTextContent('0');
    expect(minus).toBeDisabled();
  });

  it('clamps set() and an out-of-range initial value', () => {
    const c = useCounter(99, { max: 10 }); // no lifecycle hooks: safe outside setup
    expect(c.count.value).toBe(10);
    c.set(-5);
    expect(c.count.value).toBe(-5);
    c.inc(20);
    expect(c.count.value).toBe(10);
  });
});
