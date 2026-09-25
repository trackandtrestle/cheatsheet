import type { Entry } from '../content/types';

/**
 * Score how well `needle` fuzzy-matches `hay` (both lowercase).
 * Contiguous substring matches score highest, word-prefix matches next,
 * then in-order subsequence matches (penalised by gaps). Returns 0 for no match.
 */
export function fuzzyScore(needle: string, hay: string): number {
  if (!needle) return 0;
  const idx = hay.indexOf(needle);
  if (idx !== -1) {
    const atWordStart = idx === 0 || /[^a-z0-9]/.test(hay[idx - 1] ?? '');
    return atWordStart ? 3 : 2;
  }
  // Subsequence match; require it to be reasonably tight.
  let h = 0;
  let gaps = 0;
  let last = -1;
  for (const ch of needle) {
    const found = hay.indexOf(ch, h);
    if (found === -1) return 0;
    if (last !== -1) gaps += found - last - 1;
    last = found;
    h = found + 1;
  }
  if (gaps > needle.length * 3) return 0;
  return 1 / (1 + gaps / needle.length);
}

export interface SearchDoc {
  entry: Entry;
  title: string;
  tags: string;
  summary: string;
  code: string;
}

export function buildIndex(entries: readonly Entry[]): SearchDoc[] {
  return entries.map((entry) => ({
    entry,
    title: entry.title.toLowerCase(),
    tags: entry.tags.join(' ').toLowerCase(),
    summary: entry.summary.toLowerCase(),
    code: entry.snippet.toLowerCase(),
  }));
}

const WEIGHTS = { title: 10, tags: 6, summary: 3, code: 1 } as const;

/**
 * Every whitespace-separated term must match at least one field.
 * Code is only matched by substring (fuzzy over code matches nearly everything).
 */
export function search(index: readonly SearchDoc[], query: string): Entry[] {
  const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return index.map((d) => d.entry);

  const scored: { entry: Entry; score: number; order: number }[] = [];
  index.forEach((doc, order) => {
    let total = 0;
    for (const term of terms) {
      const s =
        fuzzyScore(term, doc.title) * WEIGHTS.title +
        fuzzyScore(term, doc.tags) * WEIGHTS.tags +
        fuzzyScore(term, doc.summary) * WEIGHTS.summary +
        (doc.code.includes(term) ? WEIGHTS.code * 2 : 0);
      if (s === 0) return;
      total += s;
    }
    scored.push({ entry: doc.entry, score: total, order });
  });
  return scored
    .sort((a, b) => b.score - a.score || a.order - b.order)
    .map((s) => s.entry);
}
