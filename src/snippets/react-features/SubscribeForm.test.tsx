import { describe, expect, it, vi } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SubscribeForm } from './SubscribeForm';

describe('useActionState + <form action>', () => {
  it('exposes pending state, then the returned state', async () => {
    const { promise, resolve } = Promise.withResolvers<void>();
    const subscribe = vi.fn(() => promise);
    const user = userEvent.setup();
    render(<SubscribeForm subscribe={subscribe} />);

    await user.type(screen.getByLabelText('Email'), 'ada@example.com');
    await user.click(screen.getByRole('button', { name: 'Subscribe' }));

    expect(screen.getByRole('button', { name: 'Subscribing…' })).toBeDisabled();
    expect(subscribe).toHaveBeenCalledWith('ada@example.com');

    await act(async () => resolve());
    expect(screen.getByRole('status')).toHaveTextContent('Subscribed ada@example.com');
    expect(screen.getByRole('button', { name: 'Subscribe' })).toBeEnabled();
    expect(screen.getByLabelText('Email')).toHaveValue(''); // uncontrolled form is reset
  });

  it('returns validation and server errors as state', async () => {
    const subscribe = vi.fn(() => Promise.reject(new Error('Already subscribed')));
    const user = userEvent.setup();
    render(<SubscribeForm subscribe={subscribe} />);

    await user.type(screen.getByLabelText('Email'), 'nope');
    await user.click(screen.getByRole('button', { name: 'Subscribe' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Enter a valid email.');
    expect(subscribe).not.toHaveBeenCalled();

    await user.type(screen.getByLabelText('Email'), 'ada@example.com');
    await user.click(screen.getByRole('button', { name: 'Subscribe' }));
    expect(await screen.findByText('Already subscribed')).toBeInTheDocument();
  });
});
