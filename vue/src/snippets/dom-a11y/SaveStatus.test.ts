import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import SaveStatus from './SaveStatus.vue';

describe('SaveStatus live regions', () => {
  it('regions exist (empty) before any message, then get polite text', async () => {
    const user = userEvent.setup();
    render(SaveStatus, { props: { save: async () => {} } });
    expect(screen.getByRole('status')).toBeEmptyDOMElement(); // pre-exists in the a11y tree
    expect(screen.getByRole('alert')).toBeEmptyDOMElement();

    await user.click(screen.getByRole('button', { name: 'Save' }));
    expect(await screen.findByText('Saved')).toBe(screen.getByRole('status'));
  });

  it('errors go to the assertive alert region', async () => {
    const user = userEvent.setup();
    render(SaveStatus, { props: { save: () => Promise.reject(new Error('Network down')) } });
    await user.click(screen.getByRole('button', { name: 'Save' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Network down');
    expect(screen.getByRole('status')).toBeEmptyDOMElement();
  });
});
