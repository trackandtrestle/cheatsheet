export interface Row {
  name: string;
  score: number;
}

// BUG: sort() and reverse() mutate in place and return the SAME array.
// setRows(rows.sort(...)) mutates state and React sees an identical reference.
export function sortInPlace(rows: Row[]): Row[] {
  return rows.sort((a, b) => b.score - a.score);
}

// ES2023 copying methods: toSorted, toReversed, toSpliced, with.
export const byScoreDesc = (rows: readonly Row[]): Row[] =>
  rows.toSorted((a, b) => b.score - a.score);

export const reversed = (rows: readonly Row[]): Row[] => rows.toReversed();

// Pre-ES2023 equivalent: copy first.
export const byNameCopy = (rows: readonly Row[]): Row[] =>
  [...rows].sort((a, b) => a.name.localeCompare(b.name));

// Better still: keep state unsorted and derive the sorted view while rendering.
//   const visible = useMemo(() => byScoreDesc(rows), [rows]);
