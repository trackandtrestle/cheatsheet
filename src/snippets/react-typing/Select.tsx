import { useId } from 'react';

export interface SelectProps<T> {
  label: string;
  options: readonly T[];
  value: T;
  onChange: (value: T) => void; // receives the OPTION, not a string
  getLabel: (option: T) => string;
  getValue?: (option: T) => string; // stable id for <option value>
}

export function Select<T>({ label, options, value, onChange, getLabel, getValue = getLabel }: SelectProps<T>) {
  const id = useId();
  return (
    <>
      <label htmlFor={id}>{label}</label>
      <select
        id={id}
        value={getValue(value)}
        onChange={(e) => {
          const next = options.find((o) => getValue(o) === e.currentTarget.value);
          if (next !== undefined) onChange(next);
        }}
      >
        {options.map((option) => (
          <option key={getValue(option)} value={getValue(option)}>
            {getLabel(option)}
          </option>
        ))}
      </select>
    </>
  );
}
