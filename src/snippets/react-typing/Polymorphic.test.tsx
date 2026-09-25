import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Box } from './Polymorphic';

function Badge({ count }: { count: number }) {
  return <span>{count} new</span>;
}

describe('polymorphic `as` prop', () => {
  it('renders the chosen element with its props', () => {
    render(
      <>
        <Box>plain</Box>
        <Box as="a" href="/docs">Docs</Box>
        <Box as="button" type="submit" disabled>Send</Box>
        <Box as={Badge} count={3} />
      </>,
    );
    expect(screen.getByText('plain').tagName).toBe('DIV');
    expect(screen.getByRole('link', { name: 'Docs' })).toHaveAttribute('href', '/docs');
    expect(screen.getByRole('button', { name: 'Send' })).toBeDisabled();
    expect(screen.getByText('3 new')).toBeInTheDocument();
  });

  it('rejects props the element does not accept', () => {
    // @ts-expect-error — a <div> has no href
    void (<Box href="/docs" />);
    // @ts-expect-error — a <button> has no href
    void (<Box as="button" href="/docs" />);
    // @ts-expect-error — Badge requires count
    void (<Box as={Badge} />);
  });
});
