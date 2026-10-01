import { describe, expect, it } from 'vitest';
import { nextTick } from 'vue';
import { render, screen } from '@testing-library/vue';
import NextTick from './NextTick.vue';

describe('nextTick', () => {
  it('the DOM is stale until the next tick', async () => {
    render(NextTick);
    screen.getByRole('button', { name: 'Add message' }).click(); // native, synchronous

    expect(screen.queryAllByRole('listitem')).toHaveLength(0); // state changed, DOM not yet

    await nextTick();
    expect(screen.getAllByRole('listitem')).toHaveLength(1);
    await nextTick(); // let add() continue after its own await
    expect(screen.getByText('Message 1')).toHaveAttribute('aria-current', 'true');
  });
});
