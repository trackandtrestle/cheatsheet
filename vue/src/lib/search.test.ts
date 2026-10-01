import { describe, expect, it } from 'vitest';
import type { Entry } from '../content/types';
import { buildIndex, fuzzyScore, search } from './search';

const e = (id: string, title: string, tags: string[], summary = '', snippet = ''): Entry => ({
  id,
  section: 'timing',
  title,
  tags,
  summary,
  snippet,
});

const entries = [
  e('a', 'Debounce (trailing)', ['debounce', 'timing']),
  e('b', 'Throttle', ['throttle'], 'Limit calls to once per wait.'),
  e('c', 'Binary search', ['array'], '', 'function binarySearch(xs: number[]) {}'),
];
const index = buildIndex(entries);

describe('fuzzyScore', () => {
  it('prefers word-start substring over subsequence', () => {
    expect(fuzzyScore('deb', 'debounce')).toBeGreaterThan(fuzzyScore('dbc', 'debounce'));
    expect(fuzzyScore('dbc', 'debounce')).toBeGreaterThan(0);
    expect(fuzzyScore('xyz', 'debounce')).toBe(0);
  });
});

describe('search', () => {
  it('returns everything for an empty query', () => {
    expect(search(index, '  ')).toHaveLength(3);
  });
  it('fuzzy-matches titles', () => {
    expect(search(index, 'dbnce').map((x) => x.id)).toEqual(['a']);
  });
  it('matches summary and code', () => {
    expect(search(index, 'once per').map((x) => x.id)).toEqual(['b']);
    expect(search(index, 'binarysearch').map((x) => x.id)).toEqual(['c']);
  });
  it('requires every term to match', () => {
    expect(search(index, 'debounce throttle')).toEqual([]);
  });
});
