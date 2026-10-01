import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import Disclosure from './Disclosure.vue';

const slots = { default: () => 'Details' };

describe('v-if vs v-show', () => {
  it('v-if keeps closed content out of the DOM', async () => {
    render(Disclosure, { props: { title: 'More' }, slots });
    expect(screen.queryByText('Details')).toBeNull();
    await userEvent.click(screen.getByRole('button', { name: 'More' }));
    expect(screen.getByText('Details')).toBeVisible();
  });

  it('v-show renders it hidden with display: none', async () => {
    render(Disclosure, { props: { title: 'More', mode: 'show' }, slots });
    expect(screen.getByText('Details')).not.toBeVisible();
    expect(screen.getByText('Details')).toHaveStyle({ display: 'none' });
    await userEvent.click(screen.getByRole('button', { name: 'More' }));
    expect(screen.getByText('Details')).toBeVisible();
    expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'true');
  });
});
