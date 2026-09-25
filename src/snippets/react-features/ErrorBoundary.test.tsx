import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ErrorBoundary } from './ErrorBoundary';

let shouldThrow = true;
function Flaky() {
  if (shouldThrow) throw new Error('render failed');
  return <p>All good</p>;
}

function ThrowsInHandler() {
  const [clicked, setClicked] = useState(false);
  const onClick = () => {
    setClicked(true);
    throw new Error('handler failed');
  };
  return <button onClick={onClick}>{clicked ? 'Clicked' : 'Click'}</button>;
}

const fallback = (error: Error, reset: () => void) => (
  <div role="alert">
    {error.message} <button onClick={reset}>Try again</button>
  </div>
);

describe('error boundary', () => {
  beforeEach(() => vi.spyOn(console, 'error').mockImplementation(() => {}));
  afterEach(() => vi.restoreAllMocks());

  it('catches render errors, reports them and can reset', async () => {
    shouldThrow = true;
    const onError = vi.fn();
    render(<ErrorBoundary fallback={fallback} onError={onError}><Flaky /></ErrorBoundary>);
    expect(screen.getByRole('alert')).toHaveTextContent('render failed');
    expect(onError).toHaveBeenCalledWith(expect.any(Error), expect.objectContaining({ componentStack: expect.any(String) }));

    shouldThrow = false; // fix the cause before resetting, or it throws again
    await userEvent.setup().click(screen.getByRole('button', { name: 'Try again' }));
    expect(screen.getByText('All good')).toBeInTheDocument();
  });

  it('does NOT catch errors thrown in event handlers', async () => {
    const onWindowError = vi.fn((e: ErrorEvent) => e.preventDefault());
    window.addEventListener('error', onWindowError);
    render(<ErrorBoundary fallback={fallback}><ThrowsInHandler /></ErrorBoundary>);

    await userEvent.setup().click(screen.getByRole('button', { name: 'Click' }));
    window.removeEventListener('error', onWindowError);

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Clicked' })).toBeInTheDocument();
    expect(onWindowError).toHaveBeenCalled();
    expect(onWindowError.mock.calls[0]?.[0].error).toHaveProperty('message', 'handler failed');
  });
});
