import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createRef, forwardRef } from 'react';
import { FancyInput, Row } from './ForwardRef';

describe('forwardRef (legacy)', () => {
  it('forwards the ref', () => {
    const ref = createRef<HTMLInputElement>();
    render(<FancyInput ref={ref} aria-label="Fancy" />);
    expect(ref.current).toBe(screen.getByRole('textbox', { name: 'Fancy' }));
  });

  it('keeps generics only with the cast', () => {
    const ref = createRef<HTMLLIElement>();
    render(<ul><Row ref={ref} item={{ n: 2 }} format={(x) => `n=${x.n}`} /></ul>);
    expect(ref.current).toHaveTextContent('n=2');
    // @ts-expect-error — T is inferred from item, so `x.missing` is an error
    void (<Row item={{ n: 2 }} format={(x) => x.missing} />);

    // Without the cast, T collapses to unknown and `x.n` fails.
    const Plain = forwardRef(function Inner<T>(p: { item: T; format: (x: T) => string }) {
      return <li>{p.format(p.item)}</li>;
    });
    // @ts-expect-error — x is unknown
    void (<Plain item={{ n: 2 }} format={(x) => `${x.n}`} />);
  });
});
