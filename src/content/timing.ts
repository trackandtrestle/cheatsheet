import type { Entry } from './types';
import { rateLimitEntries } from './timing-rate-limit';
import setTimeoutSrc from '../snippets/timing/setTimeout.ts?raw';
import setIntervalSrc from '../snippets/timing/setInterval.ts?raw';
import sleepSrc from '../snippets/timing/sleep.ts?raw';
import withTimeoutSrc from '../snippets/timing/withTimeout.ts?raw';
import promiseAllSrc from '../snippets/timing/promiseAll.ts?raw';
import promiseAllSettledSrc from '../snippets/timing/promiseAllSettled.ts?raw';
import promiseAnySrc from '../snippets/timing/promiseAny.ts?raw';
import promiseRaceSrc from '../snippets/timing/promiseRace.ts?raw';
import useDebouncedValueSrc from '../snippets/timing/useDebouncedValue.ts?raw';
import useDebouncedCallbackSrc from '../snippets/timing/useDebouncedCallback.ts?raw';
import useThrottleSrc from '../snippets/timing/useThrottle.ts?raw';
import useIntervalSrc from '../snippets/timing/useInterval.ts?raw';
import useTimeoutSrc from '../snippets/timing/useTimeout.ts?raw';
import abortFetchSrc from '../snippets/timing/abortFetch.ts?raw';
import abortSignalTimeoutSrc from '../snippets/timing/abortSignalTimeout.ts?raw';
import cancellablePromiseSrc from '../snippets/timing/cancellablePromise.ts?raw';
import takeLatestSrc from '../snippets/timing/takeLatest.ts?raw';
import useFetchLatestSrc from '../snippets/timing/useFetchLatest.tsx?raw';
import retrySrc from '../snippets/timing/retry.ts?raw';
import mapLimitSrc from '../snippets/timing/mapLimit.ts?raw';
import memoizeAsyncSrc from '../snippets/timing/memoizeAsync.ts?raw';
import priorityQueueSrc from '../snippets/timing/priorityQueue.ts?raw';

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
      'Browsers clamp nested timeouts to ≥4 ms and throttle background tabs to ≥1 s.',
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
      'A callback that closes over state from when the interval was created keeps seeing that stale value — see `useInterval`.',
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
  // ── React hooks ───────────────────────────────────────────────────────────
  {
    id: 'timing-use-debounced-value',
    section: 'timing',
    title: 'useDebouncedValue',
    summary: 'Return a copy of a value that only updates after it stops changing for `delayMs`; the effect cleanup resets the timer on each change.',
    tags: ['debounce', 'hook', 'useEffect', 'search', 'react'],
    snippet: useDebouncedValueSrc,
    gotchas: ['Debouncing the value does not cancel requests already started for older values — combine with an abort in the fetching effect.'],
  },
  {
    id: 'timing-use-debounced-callback',
    section: 'timing',
    title: 'useDebouncedCallback',
    summary: 'A debounced function with a stable identity that always calls the latest callback (kept in a ref), with `cancel()` and automatic cancel on unmount.',
    tags: ['debounce', 'hook', 'useRef', 'stable callback', 'stale closure', 'react'],
    snippet: useDebouncedCallbackSrc,
    gotchas: [
      '`useMemo(() => debounce(cb, ms), [cb])` recreates the debouncer whenever `cb` changes (every render for inline arrows), so it never fires.',
      'Writing `callbackRef.current = callback` during render is unsafe in concurrent React; update it in a layout effect.',
      'Without cancel-on-unmount the timer fires after unmount and calls into a dead component.',
    ],
  },
  {
    id: 'timing-use-throttle',
    section: 'timing',
    title: 'useThrottle (throttled value)',
    summary: 'Let a fast-changing value through at most once per interval, delivering the latest value on the trailing edge.',
    tags: ['throttle', 'hook', 'scroll', 'resize', 'react'],
    snippet: useThrottleSrc,
    gotchas: ['Tracking the last update in state instead of a ref would cause an extra render and re-run the effect.'],
  },
  {
    id: 'timing-use-interval',
    section: 'timing',
    title: 'useInterval (declarative)',
    summary: 'Keep the latest callback in a ref so the interval runs continuously without stale state; pass `null` as the delay to pause.',
    tags: ['setInterval', 'hook', 'useRef', 'stale closure', 'react'],
    snippet: useIntervalSrc,
    gotchas: [
      'Stale closure trap: `useEffect(() => { setInterval(() => setCount(count + 1), 1000) }, [])` captures `count = 0` forever and gets stuck at 1.',
      'Adding `count` to the deps "fixes" it by tearing down and recreating the interval every tick, which resets its phase.',
      'In tests, advance each tick in its own `act()`: one big `act` batches renders, so the ref is not refreshed between ticks.',
    ],
  },
  {
    id: 'timing-use-timeout',
    section: 'timing',
    title: 'useTimeout',
    summary: 'Run a callback once after a delay, with `reset()` to restart and `clear()` to cancel; `null` disables it and unmount cleans up.',
    tags: ['setTimeout', 'hook', 'toast', 'idle', 'react'],
    snippet: useTimeoutSrc,
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
  {
    id: 'timing-use-fetch-latest',
    section: 'timing',
    title: 'Race-safe fetch in useEffect',
    summary: 'Abort the previous request and set an `ignore` flag in the effect cleanup, so a slow stale response can never overwrite state for the current key.',
    tags: ['useEffect', 'fetch', 'race condition', 'AbortController', 'cleanup', 'react'],
    snippet: useFetchLatestSrc,
    gotchas: [
      'Forgetting the cleanup is the classic bug: switch from user 1 to user 2 and user 1 arrives last and wins.',
      'The abort alone is not enough if the loader ignores the signal or already resolved; the `ignore` flag is the real guard.',
      'StrictMode runs effects twice in dev — with a proper cleanup that is harmless.',
      'An inline `load` arrow changes every render and refetches in a loop; keep it module-level or wrap it in `useCallback`.',
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
