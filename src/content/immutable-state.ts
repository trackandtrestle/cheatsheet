import type { Entry } from './types';
import arrayAddRemoveSrc from '../snippets/immutable-state/arrayAddRemove.ts?raw';
import updateByIdSrc from '../snippets/immutable-state/updateById.ts?raw';
import insertAtSrc from '../snippets/immutable-state/insertAt.ts?raw';
import moveItemSrc from '../snippets/immutable-state/moveItem.ts?raw';
import sortStateSrc from '../snippets/immutable-state/sortState.ts?raw';
import useToggleSetSrc from '../snippets/immutable-state/useToggleSet.ts?raw';
import mapStateSrc from '../snippets/immutable-state/mapState.ts?raw';
import nestedUpdateSrc from '../snippets/immutable-state/nestedUpdate.ts?raw';
import todoReducerSrc from '../snippets/immutable-state/todoReducer.ts?raw';
import functionalUpdatesSrc from '../snippets/immutable-state/FunctionalUpdates.tsx?raw';
import structuredCloneSrc from '../snippets/immutable-state/structuredCloneCaveats.ts?raw';
import { ReorderTodosDemo } from '../demos/immutable-state/ReorderTodosDemo';
import { TagToggleDemo } from '../demos/immutable-state/TagToggleDemo';
import { FunctionalUpdatesDemo } from '../demos/immutable-state/FunctionalUpdatesDemo';

const SAME_REF =
  'React compares state with `Object.is`: mutating and then setting the same reference skips the rerender.';

export const immutableStateEntries: Entry[] = [
  {
    id: 'immutable-state-array-add-remove',
    section: 'immutable-state',
    title: 'Array state: add & remove',
    summary:
      'Add with spread (`[...prev, item]`), remove with `filter` or `toSpliced`. Always return a new array from a functional `setState`.',
    tags: ['array', 'usestate', 'add', 'remove', 'filter', 'spread', 'tospliced', 'immutable'],
    snippet: arrayAddRemoveSrc,
    gotchas: [SAME_REF, '`push`, `splice`, `pop`, `shift`, `unshift` all mutate — never call them on state.'],
  },
  {
    id: 'immutable-state-update-by-id',
    section: 'immutable-state',
    title: 'Array state: update by id',
    summary:
      '`map` over the list and replace only the matching item; unchanged items keep their references so `memo` children skip rerendering. `with(i, x)` updates by index.',
    tags: ['array', 'update', 'map', 'with', 'patch', 'immutable', 'memo'],
    snippet: updateByIdSrc,
    gotchas: [
      '`list[i].done = true; setList([...list])` still mutates the shared item — a memoised row sees the same object and may not update.',
      '`arr.with(i, x)` throws `RangeError` for out-of-range indexes (unlike `arr[i] = x`).',
    ],
  },
  {
    id: 'immutable-state-insert-at',
    section: 'immutable-state',
    title: 'Array state: insert at index',
    summary:
      '`toSpliced(index, 0, ...items)` is the non-mutating insert; the slice-spread-slice form works on pre-ES2023 targets.',
    tags: ['array', 'insert', 'tospliced', 'slice', 'immutable'],
    snippet: insertAtSrc,
    gotchas: ['Negative indexes count from the end in `toSpliced` / `slice` — clamp user input if that is surprising.'],
  },
  {
    id: 'immutable-state-reorder',
    section: 'immutable-state',
    title: 'Array state: move / reorder',
    summary:
      'Remove then re-insert with two `toSpliced` calls; return the same reference for no-op moves so React bails out. The demo is a keyboard-operable reorderable list.',
    tags: ['array', 'reorder', 'move', 'swap', 'drag and drop', 'key', 'immutable'],
    snippet: moveItemSrc,
    gotchas: [
      'Key rows by a stable id, not the index: with `key={i}`, input values, focus and component state stay in the slot while the data moves.',
      'Announce moves (`role="status"`) — screen-reader users otherwise get no feedback from a reorder.',
    ],
    Demo: ReorderTodosDemo,
  },
  {
    id: 'immutable-state-sorting',
    section: 'immutable-state',
    title: 'Sorting state without mutating',
    summary:
      '`sort()` and `reverse()` mutate and return the same array. Use `toSorted()` / `toReversed()` (or copy first), or keep state unsorted and derive the view.',
    tags: ['array', 'sort', 'tosorted', 'toreversed', 'derived state', 'usememo'],
    snippet: sortStateSrc,
    gotchas: [
      '`setRows(rows.sort(cmp))` mutates state and passes the same reference: no rerender, and the old render\'s data changed underneath it.',
      'Storing a sorted copy alongside the original is duplicated state; derive it during render instead.',
    ],
  },
  {
    id: 'immutable-state-set-toggle',
    section: 'immutable-state',
    title: 'Set state: toggle membership',
    summary:
      'Copy with `new Set(prev)`, mutate the copy, return it. Type the state as `ReadonlySet<T>` so accidental `.add()` on state is a compile error.',
    tags: ['set', 'usestate', 'toggle', 'selection', 'readonlyset', 'custom hook', 'aria-pressed'],
    snippet: useToggleSetSrc,
    gotchas: [
      SAME_REF,
      '`prev.add(x); return prev` inside an updater also skips the render — and the mutation leaks into the previous state.',
    ],
    Demo: TagToggleDemo,
  },
  {
    id: 'immutable-state-map-state',
    section: 'immutable-state',
    title: 'Map state',
    summary:
      '`new Map(prev).set(k, v)` copies and updates in one expression. Return `prev` unchanged when there is nothing to do.',
    tags: ['map', 'usestate', 'immutable', 'cart', 'readonlymap'],
    snippet: mapStateSrc,
    gotchas: [
      SAME_REF,
      'Copying a Map is O(n) per update; for very large collections consider a keyed object of ids or an immutable library.',
    ],
  },
  {
    id: 'immutable-state-nested-objects',
    section: 'immutable-state',
    title: 'Nested object updates',
    summary:
      'Spread every level along the path to the change and share the rest (structural sharing). A typed `patchSection` covers the common one-level case without a stringly `setIn`.',
    tags: ['object', 'nested', 'spread', 'structural sharing', 'immutable', 'keyof'],
    snippet: nestedUpdateSrc,
    gotchas: [
      '`{ ...obj }` is shallow: nested objects are still shared, so assigning into them mutates the original.',
      'Deeply nested state is a smell — flatten/normalise it or use `useReducer` (or Immer) when paths get long.',
    ],
  },
  {
    id: 'immutable-state-use-reducer',
    section: 'immutable-state',
    title: 'useReducer with a discriminated union',
    summary:
      'Model actions as a union on `type`; each `case` narrows the payload and `const _exhaustive: never = action` makes a missing case a compile error.',
    tags: ['usereducer', 'reducer', 'discriminated union', 'exhaustive', 'never', 'switch', 'dispatch'],
    snippet: todoReducerSrc,
    gotchas: [
      'Reducers must be pure: no mutation, no `Date.now()` / `crypto.randomUUID()` inside — pass generated ids in the action.',
      'StrictMode calls reducers twice in development to surface impurity.',
    ],
  },
  {
    id: 'immutable-state-functional-updates',
    section: 'immutable-state',
    title: 'Functional updates vs stale state',
    summary:
      '`setCount(count + 1)` three times reads the same snapshot and adds 1. `setCount(c => c + 1)` queues updaters that each see the latest pending value.',
    tags: ['usestate', 'functional update', 'updater', 'stale closure', 'batching'],
    snippet: functionalUpdatesSrc,
    gotchas: [
      'State is a snapshot per render: reading `count` right after `setCount` still gives the old value.',
      'Async callbacks (timeouts, fetch `.then`) capture old state too — use the updater form there.',
    ],
    Demo: FunctionalUpdatesDemo,
  },
  {
    id: 'immutable-state-structured-clone',
    section: 'immutable-state',
    title: 'structuredClone caveats',
    summary:
      '`structuredClone` deep-copies Dates, Maps, Sets and cycles, but throws on functions, drops class prototypes, and is no substitute for targeted immutable updates.',
    tags: ['structuredclone', 'deep copy', 'clone', 'datacloneerror', 'prototype'],
    snippet: structuredCloneSrc,
    gotchas: [
      'Functions, symbols and DOM nodes throw `DataCloneError`; private `#fields` and prototype getters/methods are silently dropped.',
      'Class instances come back as plain objects, yet TypeScript still types the result as the class.',
      'Cloning the whole state on each update gives every branch a new reference, defeating `memo` and costing O(size).',
    ],
  },
];
