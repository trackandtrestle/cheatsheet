import type { Entry } from './types';
import setBasicsSrc from '../snippets/sets-maps/setBasics.ts?raw';
import setMethodsSrc from '../snippets/sets-maps/setMethods.ts?raw';
import setOpsFallbackSrc from '../snippets/sets-maps/setOpsFallback.ts?raw';
import compositeKeysSrc from '../snippets/sets-maps/compositeKeys.ts?raw';
import mapVsObjectSrc from '../snippets/sets-maps/mapVsObject.ts?raw';
import mapIterationSrc from '../snippets/sets-maps/mapIteration.ts?raw';
import countBySrc from '../snippets/sets-maps/countBy.ts?raw';
import multimapSrc from '../snippets/sets-maps/multimap.ts?raw';
import weakMapSrc from '../snippets/sets-maps/weakMap.ts?raw';
import weakSetSrc from '../snippets/sets-maps/weakSet.ts?raw';
import lruCacheSrc from '../snippets/sets-maps/lruCache.ts?raw';
import { LruCacheDemo } from '../demos/sets-maps/LruCacheDemo';

export const setsMapsEntries: Entry[] = [
  {
    id: 'sets-maps-set-basics',
    section: 'sets-maps',
    title: 'Set basics',
    summary:
      'A `Set` holds unique values in insertion order with O(1) `add` / `has` / `delete`. Equality is SameValueZero, so objects match by reference only.',
    tags: ['set', 'unique', 'dedupe', 'samevaluezero', 'has', 'add', 'delete'],
    snippet: setBasicsSrc,
    gotchas: [
      '`new Set("abc")` iterates the string: you get `{"a","b","c"}`, not `{"abc"}`.',
      'Two structurally equal objects are two members; use a primitive key if you need value equality.',
      '`set.add()` returns the set (chainable) but `set.delete()` returns a boolean.',
    ],
  },
  {
    id: 'sets-maps-set-methods',
    section: 'sets-maps',
    title: 'ES2025 Set methods',
    summary:
      'Native `union`, `intersection`, `difference`, `symmetricDifference`, `isSubsetOf`, `isSupersetOf` and `isDisjointFrom`. They return new Sets and never mutate.',
    tags: ['set', 'union', 'intersection', 'difference', 'symmetricdifference', 'subset', 'superset', 'disjoint', 'es2025'],
    snippet: setMethodsSrc,
    gotchas: [
      'The argument must be set-like (`size`, `has`, `keys`); passing an array throws `TypeError` — wrap it in `new Set(arr)`.',
      'Needs Node 22+ / 2024-era browsers and `lib: ["ESNext"]` (or `ES2025`) in tsconfig for the types.',
      'Result order is not always "receiver first": `intersection` may iterate the smaller set, so don\'t rely on order.',
    ],
  },
  {
    id: 'sets-maps-set-fallbacks',
    section: 'sets-maps',
    title: 'Set operations (typed fallback)',
    summary:
      'Generic helpers over `ReadonlySet<T>` that mirror the ES2025 methods for older runtimes; the tests check them against the native implementations.',
    tags: ['set', 'union', 'intersection', 'difference', 'polyfill', 'fallback', 'readonlyset', 'generics'],
    snippet: setOpsFallbackSrc,
    gotchas: [
      'Accept `ReadonlySet<T>` so callers can pass frozen/readonly sets and the helper can\'t mutate them.',
      'Iterate the smaller set for `intersection` — O(min(a, b)) instead of O(a).',
    ],
  },
  {
    id: 'sets-maps-composite-keys',
    section: 'sets-maps',
    title: 'Tuple / object keys',
    summary:
      'Arrays and objects as Set/Map keys compare by identity, so `set.has([0, 0])` is always false. Derive a primitive key or intern the objects.',
    tags: ['set', 'map', 'key', 'tuple', 'identity', 'intern', 'coordinates'],
    snippet: compositeKeysSrc,
    gotchas: [
      'Keep encodings unambiguous: `${a}${b}` makes (1, 23) and (12, 3) collide — use a separator.',
      'An interning pool grows forever; scope it (per request / per component) or cap it.',
    ],
  },
  {
    id: 'sets-maps-map-vs-object',
    section: 'sets-maps',
    title: 'Map vs plain object',
    summary:
      'Prefer `Map` for dynamic dictionaries: any key type, `.size`, guaranteed insertion order, no prototype keys, and engines optimise it for frequent add/delete.',
    tags: ['map', 'object', 'record', 'dictionary', '__proto__', 'prototype pollution', 'performance'],
    snippet: mapVsObjectSrc,
    gotchas: [
      'Object keys are always strings/symbols: `obj[1]` and `obj["1"]` are the same slot.',
      'Assigning `"__proto__"` on a normal object changes its prototype (a prototype-pollution vector with user input).',
      'Integer-like object keys iterate first in ascending order, regardless of insertion order; Maps keep true insertion order.',
      '`JSON.stringify(map)` gives `{}` — convert with `Object.fromEntries(map)` first.',
      '`delete obj.key` in a hot loop can push objects into slow dictionary mode; `map.delete` has no such cliff.',
    ],
  },
  {
    id: 'sets-maps-map-iteration',
    section: 'sets-maps',
    title: 'Map iteration & conversion',
    summary:
      'Maps iterate `[key, value]` pairs in insertion order. Convert with `new Map(Object.entries(o))` and `Object.fromEntries(map)`; transform via entry arrays.',
    tags: ['map', 'entries', 'iteration', 'order', 'object.entries', 'object.fromentries', 'sort'],
    snippet: mapIterationSrc,
    gotchas: [
      'Re-`set`ting an existing key keeps its original position; `delete` + `set` to move it to the end.',
      'There is no `map.map()` / `map.filter()` — spread to entries, transform, and rebuild.',
      '`Object.fromEntries` stringifies non-string keys.',
    ],
  },
  {
    id: 'sets-maps-count-by',
    section: 'sets-maps',
    title: 'Counting & grouping',
    summary:
      'Tally with `m.set(k, (m.get(k) ?? 0) + 1)`. For grouping into arrays, `Map.groupBy` (ES2024) is built in and keeps non-string keys.',
    tags: ['map', 'count', 'frequency', 'histogram', 'groupby', 'map.groupby', 'tally'],
    snippet: countBySrc,
    gotchas: [
      'Use `??` not `||`: fine here, but `||` would also replace legitimate `0` values in other accumulators.',
      '`Object.groupBy` returns a null-prototype object with string keys; `Map.groupBy` keeps key types (booleans, objects).',
    ],
  },
  {
    id: 'sets-maps-multimap',
    section: 'sets-maps',
    title: 'Map of arrays (multimap)',
    summary:
      'One key, many values: get-or-create a bucket on add, return `[]` for missing keys, and drop empty buckets on delete.',
    tags: ['map', 'multimap', 'buckets', 'group', 'index', 'class', 'private fields'],
    snippet: multimapSrc,
    gotchas: [
      'Don\'t `m.set(k, [...(m.get(k) ?? []), v])` in a loop: it copies the bucket every time (O(n²)).',
      'Returning the internal array as `readonly V[]` stops callers from mutating buckets behind your back (at the type level).',
    ],
  },
  {
    id: 'sets-maps-weakmap',
    section: 'sets-maps',
    title: 'WeakMap: private data & memo caches',
    summary:
      'A `WeakMap` holds object keys weakly, so metadata and caches keyed by an object disappear when that object is garbage-collected.',
    tags: ['weakmap', 'memoize', 'cache', 'private', 'garbage collection', 'memory leak'],
    snippet: weakMapSrc,
    gotchas: [
      'Keys must be objects (or non-registered symbols); primitives throw `TypeError`.',
      'Not iterable and no `.size` — by design, since contents depend on GC timing.',
      'Caching by identity means an equal-but-new object misses the cache (common with inline array/object props).',
    ],
  },
  {
    id: 'sets-maps-weakset',
    section: 'sets-maps',
    title: 'WeakSet: visited tracking & branding',
    summary:
      'A `WeakSet` records "have I seen this object?" without keeping it alive — ideal for cycle detection or marking objects produced by a trusted factory.',
    tags: ['weakset', 'visited', 'cycle', 'graph', 'brand', 'type guard'],
    snippet: weakSetSrc,
    gotchas: [
      'A local `Set` works just as well for a single traversal; `WeakSet` matters when the tracker outlives the objects.',
      'Branding is per-realm/module instance: objects from another bundle copy won\'t be recognised.',
    ],
  },
  {
    id: 'sets-maps-lru-cache',
    section: 'sets-maps',
    title: 'LRU cache with Map',
    summary:
      'Because Maps iterate in insertion order, `delete` + `set` moves a key to "newest" and `keys().next()` is the oldest — a complete O(1) LRU in ~30 lines.',
    tags: ['lru', 'cache', 'map', 'eviction', 'class', 'memoize'],
    snippet: lruCacheSrc,
    gotchas: [
      'Use `has()` before `get()` if `undefined` is a valid cached value.',
      'Decide whether `has()` should count as a use; here it deliberately does not.',
    ],
    Demo: LruCacheDemo,
  },
];
