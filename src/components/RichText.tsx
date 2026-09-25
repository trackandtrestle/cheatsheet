import { Fragment } from 'react';

/** Renders `backticked` spans as <code>; everything else as plain text. */
export function RichText({ text }: { text: string }) {
  const parts = text.split(/(`[^`]+`)/g);
  return (
    <>
      {parts.map((part, i) =>
        part.length > 2 && part.startsWith('`') && part.endsWith('`') ? (
          <code key={i}>{part.slice(1, -1)}</code>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </>
  );
}
