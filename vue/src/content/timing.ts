import type { Entry } from './types';
import { rateLimitEntries } from './timing-rate-limit';
import setTimeoutSrc from '../../../src/snippets/timing/setTimeout.ts?raw';
import setIntervalSrc from '../../../src/snippets/timing/setInterval.ts?raw';
import sleepSrc from '../../../src/snippets/timing/sleep.ts?raw';
import withTimeoutSrc from '../../../src/snippets/timing/withTimeout.ts?raw';
import promiseAllSrc from '../../../src/snippets/timing/promiseAll.ts?raw';
import promiseAllSettledSrc from '../../../src/snippets/timing/promiseAllSettled.ts?raw';
import promiseAnySrc from '../../../src/snippets/timing/promiseAny.ts?raw';
import promiseRaceSrc from '../../../src/snippets/timing/promiseRace.ts?raw';
import abortFetchSrc from '../../../src/snippets/timing/abortFetch.ts?raw';
import abortSignalTimeoutSrc from '../../../src/snippets/timing/abortSignalTimeout.ts?raw';
import cancellablePromiseSrc from '../../../src/snippets/timing/cancellablePromise.ts?raw';
import takeLatestSrc from '../../../src/snippets/timing/takeLatest.ts?raw';
import retrySrc from '../../../src/snippets/timing/retry.ts?raw';
import mapLimitSrc from '../../../src/snippets/timing/mapLimit.ts?raw';
import memoizeAsyncSrc from '../../../src/snippets/timing/memoizeAsync.ts?raw';
import priorityQueueSrc from '../../../src/snippets/timing/priorityQueue.ts?raw';
import useDebouncedRefSrc from '../snippets/timing/useDebouncedRef.ts?raw';
import refDebouncedSrc from '../snippets/timing/refDebounced.ts?raw';
import useDebounceFnSrc from '../snippets/timing/useDebounceFn.ts?raw';
import useThrottledRefSrc from '../snippets/timing/useThrottledRef.ts?raw';
import useIntervalSrc from '../snippets/timing/useInterval.ts?raw';
import useTimeoutSrc from '../snippets/timing/useTimeout.ts?raw';
import useNowSrc from '../snippets/timing/useNow.ts?raw';
import useLatestFetchSrc from '../snippets/timing/useLatestFetch.ts?raw';

export const timingEntries: Entry[] = [
  // ── Basics ────────────────────────────────────────────────────────────────
  {
    id: 'timing-settimeout',
    section: 'timing',
    title: 'setTimeout / clearTimeout',
    summary: 'Schedule a callback once after a delay and return a canceller. Even a 0 ms timeout runs after all queued microtasks.',
    tags: ['setTimeout', 'clearTimeout', 'event loop', 'microtask'],
    snippet: setTimeoutSrc,
    gotchas: [
      'Type the handle as `ReturnType<typeof setTimeout>`, not `number` — Node returns a Timeout object.',
      'The delay is a minimum, not a guarantee: a busy main thread delays the callback.',
    ],
  },
  {
    id: 'timing-setinterval',
    section: 'timing',
    title: 'setInterval / clearInterval',
    summary: 'Repeat a callback on a fixed period and return a stop function. For clocks and countdowns, schedule each tick against the start time so error does not accumulate.',
    tags: ['setInterval', 'clearInterval', 'drift', 'ticker', 'polling'],
    snippet: setIntervalSrc,
    gotchas: [
      'Intervals drift: callbacks run late under load and background tabs are throttled to ≥1 s. Derive elapsed time from `Date.now()`/`performance.now()`, never from a tick count.',
      'Forgetting `clearInterval` in `onScopeDispose`/`onUnmounted` keeps the interval alive after the component is gone — see `useInterval`.',
      'For async work, prefer a chained `setTimeout` (or `sleep` loop): `setInterval` fires again even if the previous run has not finished.',
    ],
  },
  {
    id: 'timing-sleep',
    section: 'timing',
    title: 'sleep(ms, signal?)',
    summary: 'A promise-returning delay that rejects with `signal.reason` when aborted and cleans up its timer and listener either way.',
    tags: ['sleep', 'delay', 'promise', 'AbortSignal', 'polling'],
    snippet: sleepSrc,
    gotchas: [
      'Under fake timers, `vi.advanceTimersByTime` does not flush promise callbacks between timers, so an `await`-then-`setTimeout` loop stalls; use `await vi.advanceTimersByTimeAsync(ms)`.',
      'Without removing the abort listener on resolve, a long-lived signal accumulates one listener per sleep.',
    ],
  },
  {
    id: 'timing-with-timeout',
    section: 'timing',
    title: 'withTimeout(promise, ms)',
    summary: 'Race a promise against a timer that rejects with a typed `TimeoutError`, and clear the timer as soon as either side settles.',
    tags: ['timeout', 'Promise.race', 'TimeoutError', 'deadline'],
    snippet: withTimeoutSrc,
    gotchas: [
      'Timing out only stops *waiting* — the underlying request keeps running. For fetch, pass `AbortSignal.timeout(ms)` instead so the work is actually cancelled.',
      'Forgetting `clearTimeout` in `finally` leaves a timer alive after success: it keeps Node processes and test runners from exiting.',
    ],
  },
  // ── Promise combinators ───────────────────────────────────────────────────
  {
    id: 'timing-promise-all',
    section: 'timing',
    title: 'Promise.all — parallel, fail-fast',
    summary: 'Start independent requests together and await a typed tuple. Rejects as soon as any input rejects.',
    tags: ['Promise.all', 'parallel', 'concurrency', 'fail-fast', 'waterfall'],
    snippet: promiseAllSrc,
    gotchas: [
      'Sequential `await`s on independent work create a waterfall: total time is the sum instead of the max.',
      'Fail-fast does not cancel the other promises; they keep running and their later rejections are swallowed.',
      '`Promise.all(items.map(fetch))` over thousands of items launches all at once — use `mapLimit`.',
    ],
  },
  {
    id: 'timing-promise-allsettled',
    section: 'timing',
    title: 'Promise.allSettled — wait for everything',
    summary: 'Wait for every promise and get a `{ status, value | reason }` record for each; it never rejects. Good for batch jobs where partial success is fine.',
    tags: ['Promise.allSettled', 'partial failure', 'batch', 'PromiseSettledResult'],
    snippet: promiseAllSettledSrc,
    gotchas: ['Because it never rejects, errors are easy to silently drop — always inspect the `rejected` results.'],
  },
  {
    id: 'timing-promise-any',
    section: 'timing',
    title: 'Promise.any — first success',
    summary: 'Resolve with the first promise that fulfils, ignoring failures; reject with an `AggregateError` only if every input rejects.',
    tags: ['Promise.any', 'AggregateError', 'fallback', 'mirrors', 'hedging'],
    snippet: promiseAnySrc,
    gotchas: [
      'The rejection is an `AggregateError`; the individual reasons are in `error.errors`, not `error.message`.',
      '`Promise.any([])` rejects immediately with an empty AggregateError.',
    ],
  },
  {
    id: 'timing-promise-race',
    section: 'timing',
    title: 'Promise.race — first to settle',
    summary: 'Settle with whichever promise settles first, success or failure. Pair it with an `AbortController` to stop the losers.',
    tags: ['Promise.race', 'AbortController', 'timeout', 'cancellation'],
    snippet: promiseRaceSrc,
    gotchas: [
      '`Promise.race` does not cancel the losers — they keep running, holding sockets and timers, unless you abort them.',
      'A fast rejection wins over a slow success; use `Promise.any` if you want the first *success*.',
      '`Promise.race([])` stays pending forever.',
    ],
  },
  // debounce / throttle family lives in timing-rate-limit.ts
  ...rateLimitEntries,
  // ── Vue composables ───────────────────────────────────────────────────────
  {
    id: 'timing-use-debounced-ref',
    section: 'timing',
    title: 'useDebouncedRef (customRef)',
    summary: 'A writable ref built with `customRef` that only calls `trigger()` once writes stop for `delayMs`. Bind it with `v-model` and every watcher reading it is debounced for free.',
    tags: ['customRef', 'debounce', 'v-model', 'track', 'trigger', 'search'],
    snippet: useDebouncedRefSrc,
    gotchas: [
      'Call `track()` in `get` and `trigger()` in `set` (or later): forget `track()` and nothing re-renders; call `trigger()` synchronously and you have built a normal ref.',
      'The input shows the debounced value too, so a re-render mid-typing can snap the field back — for a text box prefer an instant ref plus `refDebounced`.',
      '`onScopeDispose(fn, true)` (Vue 3.5) fails silently outside a scope; without it the timer fires after unmount.',
    ],
  },
  {
    id: 'timing-ref-debounced',
    section: 'timing',
    title: 'refDebounced (follow a source)',
    summary: 'A read-only ref that copies a ref or getter once it has been stable for `delayMs`. The `watch` callback schedules the copy and `onWatcherCleanup` cancels it on the next change or on unmount.',
    tags: ['debounce', 'watch', 'onWatcherCleanup', 'MaybeRefOrGetter', 'toValue', 'search'],
    snippet: refDebouncedSrc,
    gotchas: [
      'Debouncing the value does not cancel requests already started for older values — pair it with `useLatestFetch`.',
      'Pass a getter (`() => props.query`), not `props.query`: the latter is a plain value read once and never changes.',
    ],
  },
  {
    id: 'timing-use-debounce-fn',
    section: 'timing',
    title: 'useDebounceFn (cancel / flush)',
    summary: 'A debounced function with `cancel()` and `flush()` that auto-cancels via `onScopeDispose` when the component unmounts. Because `setup` runs once, the callback reads live reactive state with no stale-closure workaround.',
    tags: ['debounce', 'onScopeDispose', 'cancel', 'flush', 'autosave', 'composable'],
    snippet: useDebounceFnSrc,
    gotchas: [
      'Without `onScopeDispose(cancel)` a pending call fires after unmount — e.g. an autosave posting from a page the user already left.',
      'Call `flush()` on blur/submit/`beforeunload` so the last edit is not lost when the user leaves within the delay.',
    ],
  },
  {
    id: 'timing-use-throttled-ref',
    section: 'timing',
    title: 'useThrottledRef (leading + trailing)',
    summary: 'A writable `customRef` that publishes the first write immediately and then at most once per interval, always ending on the latest value.',
    tags: ['throttle', 'customRef', 'scroll', 'resize', 'leading', 'trailing'],
    snippet: useThrottledRefSrc,
    gotchas: [
      'A trailing timer must read the newest write when it fires, not the value it was scheduled with — otherwise the final scroll position is lost.',
      'Under fake timers this relies on `Date.now()` being mocked too; Vitest fakes `Date` by default, but a custom `toFake` list may not.',
    ],
  },
  {
    id: 'timing-use-interval',
    section: 'timing',
    title: 'useInterval (reactive delay)',
    summary: 'Watch a `MaybeRefOrGetter<number | null>` delay: `null` pauses, a new value restarts the interval, and `onWatcherCleanup` clears it on change and on unmount.',
    tags: ['setInterval', 'watch', 'onWatcherCleanup', 'toValue', 'MaybeRefOrGetter', 'polling'],
    snippet: useIntervalSrc,
    gotchas: [
      'A bare `setInterval` in `setup`/`onMounted` without a matching `clearInterval` in `onUnmounted` leaks: it keeps ticking (and holding the component) after it is gone.',
      'No stale-closure problem here (unlike React): the callback reads `count.value` live. The trap is passing a destructured, non-reactive delay — pass the ref or a getter.',
      'Watcher callbacks are queued: after changing the delay, `await nextTick()` before advancing fake timers in tests.',
    ],
  },
  {
    id: 'timing-use-timeout',
    section: 'timing',
    title: 'useTimeout (start / stop / isPending)',
    summary: 'A one-shot timer with imperative `start()` (restarts) and `stop()`, a read-only `isPending` ref for the UI, and cleanup on scope dispose.',
    tags: ['setTimeout', 'onScopeDispose', 'readonly', 'toast', 'composable'],
    snippet: useTimeoutSrc,
    gotchas: ['Expose `isPending` via `readonly()` so callers cannot desync it from the actual timer.'],
  },
  {
    id: 'timing-use-now',
    section: 'timing',
    title: 'useNow (ticking clock)',
    summary: 'A `shallowRef<Date>` refreshed on an interval that starts in `onMounted`, so nothing ticks during SSR, and stops in `onBeforeUnmount`.',
    tags: ['Date', 'clock', 'setInterval', 'onMounted', 'SSR', 'shallowRef'],
    snippet: useNowSrc,
    gotchas: [
      'Timers started in `setup` also run on the server, where there is no unmount to clear them — every request leaks one. Start them in `onMounted`.',
      'Rendering `new Date()` causes a hydration mismatch between server and client time; render a coarse value or only after mount.',
      '`ref(new Date())` would be deeply reactive for nothing; use `shallowRef` and replace the Date each tick.',
    ],
  },
  {
    id: 'timing-use-latest-fetch',
    section: 'timing',
    title: 'Race-safe fetch with watch + onWatcherCleanup',
    summary: 'Each run of the watcher gets its own `AbortController`; `onWatcherCleanup` aborts it when the key changes or the component unmounts, and results are only written if the signal is still live.',
    tags: ['watch', 'onWatcherCleanup', 'fetch', 'race condition', 'AbortController', 'Promise.withResolvers'],
    snippet: useLatestFetchSrc,
    gotchas: [
      'A plain `watch(id, async (id) => { data.value = await load(id) })` races: switch from user 1 to 2 and a slow user 1 response arrives last and wins.',
      '`onWatcherCleanup` must be called synchronously, before the first `await` — afterwards Vue has lost the active watcher and warns (or silently drops it). Use the callback\'s third `onCleanup` arg if you must register later.',
      'Abort alone is not enough if the loader ignores the signal; the `signal.aborted` check before writing is the real guard.',
    ],
  },
  // ── Cancellation ──────────────────────────────────────────────────────────
  {
    id: 'timing-abort-fetch',
    section: 'timing',
    title: 'AbortController + fetch',
    summary: 'Give each request its own controller and pass its `signal` to fetch; `abort()` cancels the network request and rejects with an `AbortError`.',
    tags: ['AbortController', 'AbortSignal', 'fetch', 'cancellation', 'AbortError'],
    snippet: abortFetchSrc,
    gotchas: [
      'A controller is one-shot: once aborted, its signal stays aborted. Create a new one per request.',
      'Treat `AbortError` as expected, not as a failure: do not show an error toast for it.',
      'Check `error.name`, not `instanceof Error`: `DOMException` can come from another realm (iframes, jsdom).',
    ],
  },
  {
    id: 'timing-abort-signal-timeout',
    section: 'timing',
    title: 'AbortSignal.timeout / AbortSignal.any',
    summary: 'Built-in deadline signals: `AbortSignal.timeout(ms)` aborts with a `TimeoutError`, and `AbortSignal.any` combines it with a user cancel signal.',
    tags: ['AbortSignal.timeout', 'AbortSignal.any', 'deadline', 'fetch', 'TimeoutError'],
    snippet: abortSignalTimeoutSrc,
    gotchas: ['Timeouts reject with `TimeoutError` and manual aborts with `AbortError` — check the name to tell them apart.'],
  },
  {
    id: 'timing-cancellable-promise',
    section: 'timing',
    title: 'Cancellable promise wrapper',
    summary: 'Wrap any promise into `{ promise, cancel }` so the consumer can stop waiting; cancelling rejects with a `CancelledError`.',
    tags: ['cancel', 'promise', 'Promise.withResolvers', 'Promise.race'],
    snippet: cancellablePromiseSrc,
    gotchas: ['This does not stop the underlying work — it only abandons the result. Prefer threading an `AbortSignal` through when you own the work.'],
  },
  {
    id: 'timing-take-latest',
    section: 'timing',
    title: 'takeLatest (switch to the newest call)',
    summary: 'Wrap an async function so only the most recent call resolves. Older calls are aborted and reject with `StaleError` instead of hanging forever.',
    tags: ['takeLatest', 'switchMap', 'race condition', 'autocomplete', 'AbortController'],
    snippet: takeLatestSrc,
    gotchas: [
      'Responses can arrive out of order; without a "latest" guard an old search result overwrites a newer one.',
      'Callers must ignore `StaleError` (e.g. `if (e instanceof StaleError) return`), or they will report superseded calls as failures.',
    ],
  },
  // ── Async utilities ───────────────────────────────────────────────────────
  {
    id: 'timing-retry-backoff',
    section: 'timing',
    title: 'retry with exponential backoff + jitter',
    summary: 'Retry a failing async task with doubling, capped delays and optional full jitter, stopping early when `shouldRetry` says the error is permanent.',
    tags: ['retry', 'backoff', 'jitter', 'resilience', 'fetch'],
    snippet: retrySrc,
    gotchas: [
      'Only retry idempotent requests (GET, PUT, DELETE, or POST with an idempotency key); retrying a timed-out POST can charge a card twice.',
      'Without jitter, every client that failed together retries together, hammering the recovering server in synchronized waves.',
      'Do not retry 4xx client errors (except 429); honour a `Retry-After` header when present.',
      'Test with `await vi.advanceTimersByTimeAsync(ms)`: the sync version fires timers but not the `await`s between them.',
    ],
  },
  {
    id: 'timing-map-limit',
    section: 'timing',
    title: 'mapLimit — concurrency pool',
    summary: 'Map over items with at most `limit` promises in flight, starting the next item as soon as a slot frees, and return results in input order.',
    tags: ['concurrency', 'pool', 'mapLimit', 'Promise.all', 'rate limit'],
    snippet: mapLimitSrc,
    gotchas: [
      'Batching in chunks of N (await chunk, then next) is slower: each batch waits for its slowest item.',
      'On the first rejection the result rejects, but the other workers keep processing the remaining items.',
    ],
  },
  {
    id: 'timing-memoize-async',
    section: 'timing',
    title: 'memoizeAsync (TTL + in-flight dedupe)',
    summary: 'Cache the promise itself, not the resolved value, so concurrent callers share one request. Entries expire after a TTL and rejections are evicted.',
    tags: ['memoize', 'cache', 'dedupe', 'TTL', 'promise'],
    snippet: memoizeAsyncSrc,
    gotchas: [
      'Caching only after `await` lets two concurrent callers both miss and fire duplicate requests.',
      'Caching a rejected promise makes a transient failure permanent until the TTL expires.',
      'The map grows without bound; add LRU eviction for high-cardinality keys. Object keys compare by reference.',
    ],
  },
  {
    id: 'timing-priority-queue',
    section: 'timing',
    title: 'Priority task queue',
    summary: 'An async queue that runs up to `concurrency` tasks at once, always starting the highest-priority waiting task next (FIFO within a priority).',
    tags: ['queue', 'priority', 'concurrency', 'scheduler', 'private fields'],
    snippet: priorityQueueSrc,
    gotchas: [
      'Priority only reorders *waiting* tasks; it never preempts one that is already running.',
      'A steady stream of high-priority work can starve low-priority tasks; add ageing if that matters.',
    ],
  },
];
