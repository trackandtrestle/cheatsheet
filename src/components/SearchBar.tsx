import type { Ref } from 'react';

interface SearchBarProps {
  ref?: Ref<HTMLInputElement>;
  value: string;
  onChange: (value: string) => void;
  resultCount: number;
  total: number;
}

export function SearchBar({ ref, value, onChange, resultCount, total }: SearchBarProps) {
  return (
    <form className="search" role="search" onSubmit={(e) => e.preventDefault()}>
      <label htmlFor="search-input" className="visually-hidden">
        Search entries
      </label>
      <input
        ref={ref}
        id="search-input"
        type="search"
        placeholder="Search… (press / )"
        autoComplete="off"
        spellCheck={false}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            if (value) onChange('');
            else e.currentTarget.blur();
          }
        }}
        aria-describedby="search-status"
      />
      <kbd className="search-kbd" aria-hidden="true">
        /
      </kbd>
      <span id="search-status" className="search-status" role="status">
        {value ? `${resultCount} of ${total} entries` : ''}
      </span>
    </form>
  );
}
