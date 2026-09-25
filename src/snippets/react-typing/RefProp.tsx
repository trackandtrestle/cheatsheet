import { useImperativeHandle, useRef } from 'react';
import type { Ref } from 'react';

// React 19: `ref` is a regular prop on function components. No forwardRef.
export function TextField({ label, ref }: { label: string; ref?: Ref<HTMLInputElement> }) {
  return (
    <label>
      {label} <input ref={ref} />
    </label>
  );
}

// Expose a small imperative API instead of the raw DOM node.
export interface SearchHandle {
  focus: () => void;
  clear: () => void;
}

export function SearchBox({ ref }: { ref?: Ref<SearchHandle> }) {
  const inputRef = useRef<HTMLInputElement>(null); // RefObject<HTMLInputElement | null>
  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current?.focus(),
    clear: () => {
      if (inputRef.current) inputRef.current.value = '';
    },
  }), []);
  return <input ref={inputRef} aria-label="Search" />;
}
