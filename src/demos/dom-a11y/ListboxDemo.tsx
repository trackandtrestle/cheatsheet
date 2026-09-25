import { useId } from 'react';
import { useListbox } from '../../snippets/dom-a11y/useListbox';
import './dom-a11y.css';

const TIMEZONES = ['Auckland', 'Berlin', 'Chicago', 'Denver', 'Lisbon', 'London', 'Los Angeles', 'New York', 'Tokyo'] as const;

export function ListboxDemo() {
  const { selected, listboxProps, getOptionProps } = useListbox(TIMEZONES, 'London');
  const labelId = useId();
  return (
    <div className="demo-row">
      <div className="a11y-field">
        <span id={labelId}>Time zone</span>
        <ul className="a11y-listbox" aria-labelledby={labelId} {...listboxProps}>
          {TIMEZONES.map((tz, i) => <li key={tz} {...getOptionProps(i)}>{tz}</li>)}
        </ul>
      </div>
      <output className="a11y-muted">
        Tab in, then ↑/↓ · Home/End · type a letter (repeat to cycle) · selected:{' '}
        <span className="mono">{selected}</span>
      </output>
    </div>
  );
}
