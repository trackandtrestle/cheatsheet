import { render } from '@testing-library/react';
import { expect, it } from 'vitest';
import { RichText } from './RichText';

it('renders backticked spans as code', () => {
  const { container } = render(<RichText text="Use `a - b` not `sort()` alone" />);
  expect(container.querySelectorAll('code')).toHaveLength(2);
  expect(container.textContent).toBe('Use a - b not sort() alone');
});
