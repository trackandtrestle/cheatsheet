import { describe, expect, it, vi } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LikeButton } from './LikeButton';

describe('useOptimistic', () => {
  it('flips immediately and stays flipped once the save succeeds', async () => {
    const { promise, resolve } = Promise.withResolvers<boolean>();
    const save = vi.fn(() => promise);
    render(<LikeButton initialLiked={false} save={save} />);
    const button = screen.getByRole('button');

    await userEvent.setup().click(button);
    expect(button).toHaveAttribute('aria-pressed', 'true'); // before the server answers
    expect(save).toHaveBeenCalledWith(true);

    await act(async () => resolve(true));
    expect(button).toHaveAttribute('aria-pressed', 'true');
  });

  it('reverts automatically when the save fails', async () => {
    const { promise, reject } = Promise.withResolvers<boolean>();
    render(<LikeButton initialLiked={false} save={() => promise} />);
    const button = screen.getByRole('button');

    await userEvent.setup().click(button);
    expect(button).toHaveAttribute('aria-pressed', 'true');

    await act(async () => reject(new Error('500')));
    expect(button).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByRole('alert')).toHaveTextContent('Could not save');
  });
});
