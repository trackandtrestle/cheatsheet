import { useMediaQuery } from '../../snippets/react-features/useMediaQuery';

const QUERIES = [
  '(min-width: 820px)',
  '(prefers-color-scheme: dark)',
  '(prefers-reduced-motion: reduce)',
  '(pointer: coarse)',
] as const;

function Readout({ query }: { query: string }) {
  const matches = useMediaQuery(query);
  return (
    <li className="mono">
      {query}: <strong>{String(matches)}</strong>
    </li>
  );
}

export function MediaQueryDemo() {
  return (
    <div>
      <p>Resize the window or change OS settings; values update live.</p>
      <ul aria-live="polite">
        {QUERIES.map((q) => <Readout key={q} query={q} />)}
      </ul>
    </div>
  );
}
