import { describe, expect, expectTypeOf, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ComponentProps, FC, ReactNode } from 'react';
import { Card, Disclosure, Note } from './Children';

describe('typing children', () => {
  it('renders any ReactNode', () => {
    render(<Card title="Stats">{42}{null}<b>bold</b></Card>);
    expect(screen.getByRole('region', { name: 'Stats' })).toHaveTextContent('42bold');
    render(<Note />); // children optional via PropsWithChildren
    expect(screen.getByRole('note')).toHaveAttribute('data-tone', 'info');
  });

  it('types children precisely', () => {
    expectTypeOf<ComponentProps<typeof Note>['children']>().toEqualTypeOf<ReactNode | undefined>();
    // @ts-expect-error — children is required on Card
    void (<Card title="x" />);
    // @ts-expect-error — Disclosure wants a function, not an element
    void (<Disclosure><p>nope</p></Disclosure>);
    // React.FC does NOT add children implicitly (since React 18).
    const Plain: FC<{ title: string }> = ({ title }) => <h1>{title}</h1>;
    // @ts-expect-error — children is not a prop of Plain
    void (<Plain title="t">child</Plain>);
  });

  it('supports render-prop children', async () => {
    render(<Disclosure>{(open) => (open ? <p>Shown</p> : null)}</Disclosure>);
    expect(screen.queryByText('Shown')).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Details' }));
    expect(screen.getByText('Shown')).toBeInTheDocument();
  });
});
