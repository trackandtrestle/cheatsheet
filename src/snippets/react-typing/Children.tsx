import { useState } from 'react';
import type { PropsWithChildren, ReactNode } from 'react';

// Explicit children: part of the contract, and here REQUIRED.
export interface CardProps {
  title: string;
  children: ReactNode; // JSX, string, number, null, arrays, fragments...
}

export function Card({ title, children }: CardProps) {
  return (
    <section aria-label={title}>
      <h2>{title}</h2>
      {children}
    </section>
  );
}

// PropsWithChildren<P> adds an OPTIONAL `children?: ReactNode`.
type NoteProps = PropsWithChildren<{ tone?: 'info' | 'warn' }>;

export function Note({ tone = 'info', children }: NoteProps) {
  return <p role="note" data-tone={tone}>{children}</p>;
}

// Narrow children when you need a specific shape, e.g. a render prop.
export function Disclosure({ children }: { children: (open: boolean) => ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button aria-expanded={open} onClick={() => setOpen((o) => !o)}>Details</button>
      {children(open)}
    </>
  );
}
