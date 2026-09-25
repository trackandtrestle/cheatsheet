import { describe, expect, expectTypeOf, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ChangeEvent, ChangeEventHandler, ComponentProps } from 'react';
import { ProfileForm } from './ChangeEvents';

describe('change event types', () => {
  it('updates controlled inputs', async () => {
    const user = userEvent.setup();
    render(<ProfileForm />);
    await user.type(screen.getByRole('textbox', { name: 'Name' }), 'Ada');
    await user.selectOptions(screen.getByRole('combobox', { name: 'Plan' }), 'pro');
    await user.click(screen.getByRole('checkbox', { name: 'Agree' }));
    expect(screen.getByRole('status')).toHaveTextContent('Ada|pro|true');
  });

  it('types handlers by element', () => {
    expectTypeOf<ComponentProps<'input'>['onChange']>().toEqualTypeOf<
      ChangeEventHandler<HTMLInputElement> | undefined
    >();
    expectTypeOf<ChangeEvent<HTMLInputElement>['currentTarget']>().toExtend<HTMLInputElement>();
    const onSelect: ChangeEventHandler<HTMLSelectElement> = () => {};
    // @ts-expect-error — a <select> handler does not fit an <input>
    void (<input onChange={onSelect} />);
  });
});
