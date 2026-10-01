import { describe, expect, expectTypeOf, it } from 'vitest';
import { render, screen } from '@testing-library/vue';
import Alert from './Alert.vue';

type AlertProps = InstanceType<typeof Alert>['$props'];

describe('typing props', () => {
  it('infers the public prop types from the interface', () => {
    expectTypeOf<AlertProps['title']>().toEqualTypeOf<string>();
    expectTypeOf<AlertProps['tone']>().toEqualTypeOf<'info' | 'success' | 'danger' | undefined>();
    // withDefaults makes `tone` non-optional INSIDE the component only.
    expectTypeOf<InstanceType<typeof Alert>['tone']>().toEqualTypeOf<'info' | 'success' | 'danger'>();
  });

  it('rejects bad props at compile time', () => {
    // @ts-expect-error 'warning' is not in the tone union
    const bad: AlertProps = { title: 'x', tone: 'warning' };
    // @ts-expect-error title is required
    const missing: AlertProps = { tone: 'info' };
    expect([bad, missing]).toHaveLength(2);
  });

  it('applies defaults at runtime', () => {
    render(Alert, { props: { title: 'Saved' } });
    expect(screen.getByRole('status')).toHaveClass('alert-info');
    expect(screen.queryByRole('button', { name: 'Dismiss' })).toBeNull();
  });
});
