import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Select } from './Select';

interface Currency {
  code: string;
  name: string;
}

const currencies: Currency[] = [
  { code: 'EUR', name: 'Euro' },
  { code: 'USD', name: 'US Dollar' },
];

describe('generic Select<T>', () => {
  it('hands back the selected object', async () => {
    const onChange = vi.fn<(c: Currency) => void>();
    render(
      <Select
        label="Currency"
        options={currencies}
        value={currencies[0]!}
        onChange={onChange}
        getLabel={(c) => c.name}
        getValue={(c) => c.code}
      />,
    );
    await userEvent.selectOptions(screen.getByRole('combobox', { name: 'Currency' }), 'USD');
    expect(onChange).toHaveBeenCalledWith({ code: 'USD', name: 'US Dollar' });
  });

  it('works with literal unions', () => {
    const sizes = ['sm', 'md', 'lg'] as const;
    const onSize = (size: (typeof sizes)[number]) => size;
    render(<Select label="Size" options={sizes} value="md" onChange={onSize} getLabel={(s) => s} />);
    expect(screen.getByRole('combobox', { name: 'Size' })).toHaveValue('md');
    // @ts-expect-error — 'xl' is not one of the options
    void (<Select label="Size" options={sizes} value="xl" onChange={onSize} getLabel={(s) => s} />);
    // @ts-expect-error — onChange must accept the option type, not a string event
    void (<Select label="C" options={currencies} value={currencies[0]!} onChange={(c: number) => c} getLabel={(c) => c.name} />);
  });
});
