import { useEffect, useId, useRef, useState } from 'react';
import { useCombobox } from '../../snippets/dom-a11y/useCombobox';
import './dom-a11y.css';

const LANGUAGES = ['TypeScript', 'JavaScript', 'Rust', 'Go', 'Python', 'Ruby', 'Kotlin', 'Swift', 'Scala', 'Elixir'];

export function ComboboxDemo() {
  const [value, setValue] = useState('');
  const [picked, setPicked] = useState<string | null>(null);
  const options = LANGUAGES.filter((l) => l.toLowerCase().includes(value.trim().toLowerCase()));
  const cb = useCombobox(options, (v) => { setValue(v); setPicked(v); });
  const inputId = useId();
  const listRef = useRef<HTMLUListElement>(null);
  // Keep the virtually-focused option scrolled into view.
  useEffect(() => {
    if (cb.active >= 0) listRef.current?.children[cb.active]?.scrollIntoView({ block: 'nearest' });
  }, [cb.active]);

  return (
    <div className="demo-row">
      <div className="a11y-field">
        <label htmlFor={inputId}>Language</label>
        <input id={inputId} type="text" autoComplete="off" value={value}
          onChange={(e) => setValue(e.target.value)} {...cb.inputProps} />
        <ul ref={listRef} className="a11y-popup" aria-label="Languages" {...cb.listboxProps}>
          {options.map((o, i) => <li key={o} {...cb.getOptionProps(i)}>{o}</li>)}
        </ul>
      </div>
      <output className="a11y-muted">
        ↓/↑ move · Enter picks · Esc closes · picked: <span className="mono">{picked ?? '—'}</span>
      </output>
    </div>
  );
}
