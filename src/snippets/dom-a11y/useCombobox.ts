import { useId, useState, type KeyboardEvent } from 'react';

// ARIA 1.2 combobox: DOM focus never leaves the <input>; the "virtual" focus is
// announced through aria-activedescendant, which must point at an option's id.
export function useCombobox(options: readonly string[], onSelect: (value: string) => void) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [rawActive, setActive] = useState(-1);
  const active = rawActive < options.length ? rawActive : -1; // options shrank while typing
  const expanded = open && options.length > 0;
  const optionId = (i: number) => `${id}-opt-${i}`;
  const close = () => { setOpen(false); setActive(-1); };
  const select = (i: number) => { const v = options[i]; if (v !== undefined) onSelect(v); close(); };
  const move = (delta: 1 | -1) => {
    const n = options.length;
    setOpen(true);
    if (n > 0) setActive((i) => (i === -1 && delta < 0 ? n - 1 : (i + delta + n) % n));
  };
  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') move(1);
    else if (e.key === 'ArrowUp') move(-1);
    else if (e.key === 'Enter' && expanded && active >= 0) select(active);
    else if (e.key === 'Escape' && expanded) close();
    else return;
    e.preventDefault(); // don't move the caret / submit the form
  };
  return {
    expanded, active,
    inputProps: { role: 'combobox', 'aria-expanded': expanded, 'aria-controls': `${id}-list`,
      'aria-autocomplete': 'list' as const, 'aria-activedescendant': expanded && active >= 0 ? optionId(active) : undefined,
      onKeyDown, onInput: () => { setOpen(true); setActive(-1); }, onBlur: close },
    listboxProps: { id: `${id}-list`, role: 'listbox', hidden: !expanded },
    getOptionProps: (i: number) => ({ id: optionId(i), role: 'option', 'aria-selected': i === active,
      onMouseDown: (e: { preventDefault(): void }) => e.preventDefault(), onClick: () => select(i) }), // keep input focus
  };
}
