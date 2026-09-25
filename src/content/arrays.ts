import type { Entry } from './types';
import mapFilterReduceSrc from '../snippets/arrays/mapFilterReduce.ts?raw';
import flatMapSrc from '../snippets/arrays/flatMap.ts?raw';
import findSrc from '../snippets/arrays/find.ts?raw';
import someEverySrc from '../snippets/arrays/someEvery.ts?raw';
import atSrc from '../snippets/arrays/at.ts?raw';
import includesSrc from '../snippets/arrays/includes.ts?raw';
import numericSortSrc from '../snippets/arrays/numericSort.ts?raw';
import multiKeySortSrc from '../snippets/arrays/multiKeySort.ts?raw';
import collatorSrc from '../snippets/arrays/collator.ts?raw';
import stableSortSrc from '../snippets/arrays/stableSort.ts?raw';
import immutableSrc from '../snippets/arrays/immutable.ts?raw';
import groupBySrc from '../snippets/arrays/groupBy.ts?raw';
import partitionSrc from '../snippets/arrays/partition.ts?raw';
import chunkSrc from '../snippets/arrays/chunk.ts?raw';
import zipSrc from '../snippets/arrays/zip.ts?raw';
import rangeSrc from '../snippets/arrays/range.ts?raw';
import grid2dSrc from '../snippets/arrays/grid2d.ts?raw';
import dedupeSrc from '../snippets/arrays/dedupe.ts?raw';
import dedupeBySrc from '../snippets/arrays/dedupeBy.ts?raw';
import frequencySrc from '../snippets/arrays/frequency.ts?raw';
import topKSrc from '../snippets/arrays/topK.ts?raw';
import slidingWindowSrc from '../snippets/arrays/slidingWindow.ts?raw';
import prefixSumsSrc from '../snippets/arrays/prefixSums.ts?raw';
import binarySearchSrc from '../snippets/arrays/binarySearch.ts?raw';
import flattenSrc from '../snippets/arrays/flatten.ts?raw';
import setOpsSrc from '../snippets/arrays/setOps.ts?raw';

export const arraysEntries: Entry[] = [
  {
    id: 'arrays-map-filter-reduce',
    section: 'arrays',
    title: 'map / filter / reduce',
    summary: 'Transform, select and fold. Give `reduce` an initial value so the accumulator is typed and empty arrays are safe.',
    tags: ['map', 'filter', 'reduce', 'fold', 'accumulator'],
    snippet: mapFilterReduceSrc,
    gotchas: [
      '`reduce` without an initial value throws `TypeError` on an empty array.',
      'Without an initial value the accumulator type is the element type; use `reduce<Acc>(fn, init)` for anything else.',
      '`map(parseInt)` passes the index as radix: `["1","2","3"].map(parseInt)` is `[1, NaN, NaN]`.',
    ],
  },
  {
    id: 'arrays-flatmap',
    section: 'arrays',
    title: 'flatMap',
    summary: 'Map each item to zero, one or many results. Returning `[]` or `[x]` is a type-safe filter-and-map in one pass.',
    tags: ['flatMap', 'flat', 'filter map', 'expand'],
    snippet: flatMapSrc,
    gotchas: ['Only flattens one level: returning `[[a, b]]` leaves a nested array.'],
  },
  {
    id: 'arrays-find',
    section: 'arrays',
    title: 'find / findLast / findIndex / findLastIndex',
    summary: 'Locate the first or last match. `find*` return `T | undefined`; `*Index` return `-1` on a miss.',
    tags: ['find', 'findLast', 'findIndex', 'findLastIndex', 'search', 'type guard'],
    snippet: findSrc,
    gotchas: [
      '`find` returns `undefined` on a miss, which is indistinguishable from a matched `undefined` element.',
      'Check `findIndex(...) === -1`, not falsiness: index `0` is falsy.',
      'Pass a type-guard predicate `(x): x is Sub => ...` to narrow the result.',
    ],
  },
  {
    id: 'arrays-some-every',
    section: 'arrays',
    title: 'some / every',
    summary: 'Short-circuiting "any" and "all" checks. `every` with a type guard narrows the whole array.',
    tags: ['some', 'every', 'any', 'all', 'predicate'],
    snippet: someEverySrc,
    gotchas: ['Vacuous truth: `[].every(fn)` is `true`, `[].some(fn)` is `false`. Guard `length > 0` for "all valid".'],
  },
  {
    id: 'arrays-at',
    section: 'arrays',
    title: 'at(-1) and safe indexing',
    summary: '`at()` takes negative indexes from the end and is always typed `T | undefined`, so handle the miss with `?.` / `??`.',
    tags: ['at', 'last', 'negative index', 'noUncheckedIndexedAccess'],
    snippet: atSrc,
    gotchas: [
      '`xs[-1]` is silently `undefined` — negative indexes only work with `at()`.',
      'With `noUncheckedIndexedAccess`, both `xs[i]` and `xs.at(i)` are `T | undefined`; prefer `??` or a guard over `!`.',
    ],
  },
  {
    id: 'arrays-includes',
    section: 'arrays',
    title: 'includes vs indexOf',
    summary: '`includes` uses SameValueZero and finds `NaN`; `indexOf` uses `===` and does not. Both compare objects by reference.',
    tags: ['includes', 'indexOf', 'NaN', 'SameValueZero', 'as const'],
    snippet: includesSrc,
    gotchas: [
      '`[NaN].indexOf(NaN)` is `-1`; `[NaN].includes(NaN)` is `true`.',
      '`includes` on a `readonly ["a","b"]` rejects a plain `string` argument; widen to `readonly string[]` inside a type guard.',
    ],
  },
  {
    id: 'arrays-numeric-sort',
    section: 'arrays',
    title: 'Numeric sort pitfall',
    summary: 'Default `sort()` compares strings, so `[1, 10, 2].sort()` stays `[1, 10, 2]`. Pass `(a, b) => a - b`.',
    tags: ['sort', 'comparator', 'numeric', 'lexicographic', 'mutation'],
    snippet: numericSortSrc,
    gotchas: [
      'Default sort is lexicographic by UTF-16 code units, even for numbers.',
      '`sort` mutates in place and returns the same array — copy first or use `toSorted`.',
      'A comparator must return a number; returning a boolean (`a > b`) gives inconsistent results.',
      '`a - b` does not work for BigInt comparators (returns bigint); compare with `<` / `>`.',
    ],
  },
  {
    id: 'arrays-multi-key-sort',
    section: 'arrays',
    title: 'Multi-key comparator',
    summary: 'Chain comparisons with `||` so the first non-zero result wins, or compose reusable `by` / `thenBy` comparators.',
    tags: ['sort', 'comparator', 'multi-key', 'thenBy', 'compose'],
    snippet: multiKeySortSrc,
    gotchas: ['For descending order flip the operands (`b.age - a.age`) rather than negating a result that may be `-0`.'],
  },
  {
    id: 'arrays-collator',
    section: 'arrays',
    title: 'localeCompare / Intl.Collator',
    summary: 'Sort human text correctly. `Intl.Collator` with `numeric: true` gives natural order; `sensitivity: "base"` ignores case and accents.',
    tags: ['localeCompare', 'Intl.Collator', 'natural sort', 'i18n', 'case-insensitive'],
    snippet: collatorSrc,
    gotchas: [
      'Plain `<` puts `"Z"` before `"a"` and `"file10"` before `"file2"`.',
      'Create the Collator once and pass `collator.compare`; `localeCompare` with options per call is much slower.',
      'Omitting the locale uses the runtime default, so tests may differ across machines.',
    ],
  },
  {
    id: 'arrays-stable-sort',
    section: 'arrays',
    title: 'Stable sort guarantee',
    summary: 'Since ES2019 `sort` is stable: equal elements keep their relative order, so you can sort by secondary key then primary key.',
    tags: ['sort', 'stable', 'shuffle', 'Fisher-Yates'],
    snippet: stableSortSrc,
    gotchas: ['`sort(() => Math.random() - 0.5)` is not a uniform shuffle; use Fisher–Yates.'],
  },
  {
    id: 'arrays-immutable-es2023',
    section: 'arrays',
    title: 'toSorted / toReversed / toSpliced / with',
    summary: 'ES2023 copy-returning versions of `sort`, `reverse`, `splice` and index assignment. They work on `readonly` arrays.',
    tags: ['toSorted', 'toReversed', 'toSpliced', 'with', 'immutable', 'react state'],
    snippet: immutableSrc,
    gotchas: [
      '`with(i, v)` throws `RangeError` for an out-of-range index instead of growing the array.',
      '`toSpliced` returns the new array, not the removed items as `splice` does.',
    ],
  },
  {
    id: 'arrays-group-by',
    section: 'arrays',
    title: 'Object.groupBy / Map.groupBy',
    summary: 'Bucket items by a computed key. `Object.groupBy` for string keys, `Map.groupBy` for any key type.',
    tags: ['groupBy', 'Object.groupBy', 'Map.groupBy', 'bucket', 'ES2024'],
    snippet: groupBySrc,
    gotchas: [
      '`Object.groupBy` returns a null-prototype object: no `hasOwnProperty`/`toString`; use `Object.hasOwn`.',
      'Its type is `Partial<Record<K, T[]>>`, so every group is `T[] | undefined`.',
      'Needs ES2024 (Node 21+, Safari 17.4+); use the `reduce` fallback for older targets.',
    ],
  },
  {
    id: 'arrays-partition',
    section: 'arrays',
    title: 'partition (type-guard overload)',
    summary: 'Split into matches and non-matches in one pass. A type-guard overload narrows both halves.',
    tags: ['partition', 'split', 'type guard', 'overload', 'narrowing'],
    snippet: partitionSrc,
    gotchas: ['Order the type-guard overload first: TypeScript picks the first matching overload.'],
  },
  {
    id: 'arrays-chunk',
    section: 'arrays',
    title: 'chunk',
    summary: 'Split an array into fixed-size groups (e.g. batching requests or grid rows).',
    tags: ['chunk', 'batch', 'paginate', 'slice'],
    snippet: chunkSrc,
    gotchas: ['Validate `size`: a loop with `i += 0` never terminates.'],
  },
  {
    id: 'arrays-zip',
    section: 'arrays',
    title: 'zip (typed tuples)',
    summary: 'Pair up items at the same index as typed tuples; a mapped tuple type makes a variadic version.',
    tags: ['zip', 'unzip', 'tuple', 'mapped type', 'variadic'],
    snippet: zipSrc,
    gotchas: ['Arrays of different lengths are truncated to the shortest.'],
  },
  {
    id: 'arrays-range',
    section: 'arrays',
    title: 'range / Array.from({ length })',
    summary: '`Array.from({ length: n }, (_, i) => ...)` is the idiomatic way to generate arrays; a `range` helper wraps it.',
    tags: ['range', 'Array.from', 'generate', 'sequence', 'holes'],
    snippet: rangeSrc,
    gotchas: ['`new Array(3).map(fn)` returns holes untouched: `map` skips empty slots. `fill` first or use `Array.from`.'],
  },
  {
    id: 'arrays-grid-2d',
    section: 'arrays',
    title: 'Safe 2D array init',
    summary: 'Build a matrix with `Array.from` so each row is a distinct array, and read cells with `grid[r]?.[c]`.',
    tags: ['2d', 'matrix', 'grid', 'fill', 'shared reference'],
    snippet: grid2dSrc,
    gotchas: [
      '`Array(3).fill([])` puts one shared array in every slot; pushing to a row changes all rows.',
      '`fill(obj)` has the same trap for object cells — create each cell in a factory.',
    ],
  },
  {
    id: 'arrays-dedupe',
    section: 'arrays',
    title: 'Dedupe primitives with Set',
    summary: '`[...new Set(xs)]` removes duplicates in O(n) and keeps first-occurrence order.',
    tags: ['dedupe', 'unique', 'Set', 'distinct'],
    snippet: dedupeSrc,
    gotchas: [
      'Objects are compared by reference, so `new Set([{}, {}])` has size 2 — dedupe by key instead.',
      'The `filter((x, i) => xs.indexOf(x) === i)` idiom is O(n²) and drops `NaN`.',
    ],
  },
  {
    id: 'arrays-dedupe-by-key',
    section: 'arrays',
    title: 'Dedupe by key (keep first vs last)',
    summary: 'Use a Map keyed by id: `new Map(xs.map(x => [key(x), x]))` keeps the last; check `has` first to keep the first.',
    tags: ['dedupe', 'uniqueBy', 'Map', 'key', 'composite key'],
    snippet: dedupeBySrc,
    gotchas: [
      'The Map constructor keeps the LAST value but the position of the FIRST occurrence.',
      'Composite keys like `[a, b]` never match (reference identity); build a string key.',
    ],
  },
  {
    id: 'arrays-frequency',
    section: 'arrays',
    title: 'Frequency count',
    summary: 'Count occurrences with `map.set(x, (map.get(x) ?? 0) + 1)`, then derive the mode.',
    tags: ['frequency', 'count', 'histogram', 'mode', 'Map'],
    snippet: frequencySrc,
    gotchas: ['Counting into `{}` breaks on keys like `"constructor"` or `"__proto__"`; use a Map or `Object.create(null)`.'],
  },
  {
    id: 'arrays-top-k',
    section: 'arrays',
    title: 'Top-K',
    summary: 'Sort a copy and slice for simplicity, or keep a bounded buffer when k is small and n is large.',
    tags: ['top k', 'largest', 'most frequent', 'ranking'],
    snippet: topKSrc,
    gotchas: ['`xs.sort(...).slice(0, k)` mutates the caller\'s array; use `toSorted`.'],
  },
  {
    id: 'arrays-sliding-window',
    section: 'arrays',
    title: 'Sliding window',
    summary: 'O(n) scans over contiguous ranges: a fixed-size window that adds/removes one item per step, and a variable window that moves its left edge.',
    tags: ['sliding window', 'two pointers', 'subarray', 'algorithm'],
    snippet: slidingWindowSrc,
    gotchas: ['Seed `best` from the first window, not `0`, or all-negative inputs give the wrong answer.'],
  },
  {
    id: 'arrays-prefix-sums',
    section: 'arrays',
    title: 'Prefix sums (range sum queries)',
    summary: 'Precompute running totals once, then answer any range sum as `p[to] - p[from]` in O(1).',
    tags: ['prefix sum', 'cumulative', 'running total', 'range query'],
    snippet: prefixSumsSrc,
    gotchas: ['A leading `0` (length n + 1) avoids special-casing ranges that start at index 0.'],
  },
  {
    id: 'arrays-binary-search',
    section: 'arrays',
    title: 'Binary search (lower bound)',
    summary: 'Find the first index whose value is `>=` target in O(log n); it doubles as the sorted insertion point.',
    tags: ['binary search', 'lower bound', 'sorted', 'insertion point', 'bisect'],
    snippet: binarySearchSrc,
    gotchas: [
      'Only correct if the array is sorted by the same comparator you search with.',
      'Use a half-open range `[lo, hi)` and `lo < hi` to avoid off-by-one infinite loops.',
    ],
  },
  {
    id: 'arrays-flatten',
    section: 'arrays',
    title: 'flatten(depth)',
    summary: 'Use `flat(depth)` built in, a recursive `Nested<T>` type for a fully typed deep flatten, or an explicit stack for a controlled depth.',
    tags: ['flatten', 'flat', 'nested', 'recursive type', 'depth'],
    snippet: flattenSrc,
    gotchas: [
      '`flat()` defaults to depth 1, not fully flat; pass `Infinity`.',
      '`flat` also removes holes from sparse arrays.',
    ],
  },
  {
    id: 'arrays-intersection-difference',
    section: 'arrays',
    title: 'Intersection / difference of arrays',
    summary: 'Build a Set from one side and `filter` the other: O(n + m) instead of O(n·m) with `includes`.',
    tags: ['intersection', 'difference', 'union', 'set operations', 'Set'],
    snippet: setOpsSrc,
    gotchas: [
      '`a.filter(x => b.includes(x))` is O(n·m) and slow for large arrays.',
      'Objects compare by reference; compare by a key (`differenceBy`).',
      'For Set-to-Set operations, ES2025 adds `Set.prototype.intersection` / `difference`.',
    ],
  },
];
