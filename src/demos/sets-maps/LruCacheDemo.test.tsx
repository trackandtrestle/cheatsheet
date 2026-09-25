import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { LruCacheDemo } from './LruCacheDemo';

describe('LruCacheDemo', () => {
  it('shows hits, misses and evictions', async () => {
    const user = userEvent.setup();
    render(<LruCacheDemo />);
    for (const k of ['A', 'B', 'C', 'A', 'D']) {
      await user.click(screen.getByRole('button', { name: `get(${k})` }));
    }
    expect(screen.getByText('[C, A, D]')).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('miss D → stored, evicted B');
  });
});
