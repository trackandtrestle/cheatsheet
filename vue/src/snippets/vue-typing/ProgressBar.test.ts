import { describe, expect, expectTypeOf, it } from 'vitest';
import { render, screen } from '@testing-library/vue';
import { ProgressBar, type ProgressBarProps, type Segment } from './ProgressBar';

describe('PropType in defineComponent', () => {
  it('extracts precise public prop types', () => {
    expectTypeOf<ProgressBarProps['segments']>().toEqualTypeOf<Segment[]>();
    expectTypeOf<ProgressBarProps['size']>().toEqualTypeOf<'sm' | 'md' | undefined>();
    expectTypeOf<ProgressBarProps['format']>().toEqualTypeOf<((pct: number) => string) | undefined>();
    // @ts-expect-error 'lg' is not a valid size
    const bad: ProgressBarProps = { segments: [], size: 'lg' };
    expect(bad).toBeTruthy();
  });

  it('applies defaults, including a function default', () => {
    render(ProgressBar, { props: { segments: [{ label: 'a', value: 30 }, { label: 'b', value: 12.4 }] } });
    const bar = screen.getByRole('progressbar');
    expect(bar).toHaveTextContent('42%');
    expect(bar).toHaveClass('progress-md');
  });

  it('accepts a custom formatter', () => {
    render(ProgressBar, { props: { segments: [{ label: 'a', value: 5 }], format: (p: number) => `${p} of 100` } });
    expect(screen.getByRole('progressbar')).toHaveTextContent('5 of 100');
  });
});
