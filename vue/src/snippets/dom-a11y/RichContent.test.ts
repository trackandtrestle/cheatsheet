import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import RichContent from './RichContent.vue';

const html = `<p>See <a href="/docs/intro"><strong>the intro</strong></a>,
  <a href="https://vuejs.org">Vue</a> and <a href="//evil.example">this</a>.</p>`;

// Swallow unhandled link clicks at the document so jsdom doesn't try to navigate.
const stopNavigation = (e: Event) => e.preventDefault();
beforeEach(() => document.addEventListener('click', stopNavigation));
afterEach(() => document.removeEventListener('click', stopNavigation));

describe('RichContent (event delegation)', () => {
  it('routes internal links, even when the click lands on a nested element', async () => {
    const user = userEvent.setup();
    const { emitted } = render(RichContent, { props: { html } });
    await user.click(screen.getByText('the intro')); // the <strong>, not the <a>
    expect(emitted('navigate')).toEqual([['/docs/intro']]);
  });

  it('leaves external, protocol-relative and modified clicks to the browser', async () => {
    const user = userEvent.setup();
    const { emitted, rerender } = render(RichContent, { props: { html } });
    await user.click(screen.getByRole('link', { name: 'Vue' }));
    await user.click(screen.getByRole('link', { name: 'this' }));
    await user.keyboard('{Control>}');
    await user.click(screen.getByRole('link', { name: 'the intro' }));
    await user.keyboard('{/Control}');
    expect(emitted('navigate')).toBeUndefined();

    await rerender({ html: '<a href="/new">New</a>' }); // content swapped: still handled
    await user.click(screen.getByRole('link', { name: 'New' }));
    expect(emitted('navigate')).toEqual([['/new']]);
  });
});
