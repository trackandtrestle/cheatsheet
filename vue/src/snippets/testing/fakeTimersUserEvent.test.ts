import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import { defineComponent, h, nextTick, ref } from 'vue';

const Toast = defineComponent(() => {
  const open = ref(false);
  const show = () => { open.value = true; setTimeout(() => (open.value = false), 3000); };
  return () => [h('button', { onClick: show }, 'Save'), open.value && h('p', { role: 'status' }, 'Saved')];
});

// PITFALL: with plain `vi.useFakeTimers()` every `await user.click()` HANGS:
// user-event awaits a real setTimeout between actions and nobody ticks the fake clock.
// findBy/waitFor stall the same way — they poll with timers.
describe('fake timers + userEvent', () => {
  beforeEach(() => vi.useFakeTimers({ shouldAdvanceTime: true })); // clock follows real time
  afterEach(() => vi.useRealTimers());

  it('advances the fake clock for user-event, jumps it explicitly for the app', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(Toast);

    await user.click(screen.getByRole('button', { name: 'Save' }));
    expect(await screen.findByRole('status')).toHaveTextContent('Saved');

    vi.advanceTimersByTime(2000);
    await nextTick(); // the timer changed state: let Vue re-render
    expect(screen.getByRole('status')).toBeInTheDocument();
    vi.advanceTimersByTime(1000); // not ms-exact: real time also ticks
    await nextTick();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });
});
