import { describe, expect, expectTypeOf, it } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, useRef } from 'react';
import type { RefObject } from 'react';
import { SearchBox, TextField } from './RefProp';
import type { SearchHandle } from './RefProp';

describe('ref as a prop (React 19)', () => {
  it('passes a DOM ref straight through', () => {
    const ref = createRef<HTMLInputElement>();
    render(<TextField label="Name" ref={ref} />);
    expect(ref.current).toBe(screen.getByRole('textbox', { name: 'Name' }));
    // @ts-expect-error — wrong element type for the ref
    void (<TextField label="x" ref={createRef<HTMLDivElement>()} />);
  });

  it('exposes an imperative handle', async () => {
    const ref = createRef<SearchHandle>();
    render(<SearchBox ref={ref} />);
    const input = screen.getByRole('textbox', { name: 'Search' });
    await userEvent.type(input, 'hello');
    act(() => ref.current?.clear());
    expect(input).toHaveValue('');
    act(() => ref.current?.focus());
    expect(input).toHaveFocus();
  });

  it('useRef(null) includes null in the type', () => {
    function Probe() {
      const r = useRef<HTMLInputElement>(null);
      expectTypeOf(r).toEqualTypeOf<RefObject<HTMLInputElement | null>>();
      return null;
    }
    render(<Probe />);
  });
});
