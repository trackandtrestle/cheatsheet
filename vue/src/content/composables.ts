import type { Entry } from './types';
import anatomySrc from '../snippets/composables/useWindowWidth.ts?raw';
import eventListenerSrc from '../snippets/composables/useEventListener.ts?raw';
import localStorageSrc from '../snippets/composables/useLocalStorage.ts?raw';
import fetchSrc from '../snippets/composables/useFetch.ts?raw';
import mediaQuerySrc from '../snippets/composables/useMediaQuery.ts?raw';
import clickOutsideSrc from '../snippets/composables/useOnClickOutside.ts?raw';
import previousSrc from '../snippets/composables/usePrevious.ts?raw';
import toggleSrc from '../snippets/composables/useToggle.ts?raw';
import counterSrc from '../snippets/composables/useCounter.ts?raw';
import asyncStateSrc from '../snippets/composables/useAsyncState.ts?raw';
import intersectionSrc from '../snippets/composables/useIntersectionObserver.ts?raw';
import elementSizeSrc from '../snippets/composables/useElementSize.ts?raw';
import clipboardSrc from '../snippets/composables/useClipboard.ts?raw';
import titleSrc from '../snippets/composables/useTitle.ts?raw';
import cartSrc from '../snippets/composables/useCart.ts?raw';
import injectionStateSrc from '../snippets/composables/createInjectionState.ts?raw';
import LocalStorageDemo from '../demos/composables/LocalStorageDemo.vue';
import FetchDemo from '../demos/composables/FetchDemo.vue';
import MediaQueryDemo from '../demos/composables/MediaQueryDemo.vue';
import ClickOutsideDemo from '../demos/composables/ClickOutsideDemo.vue';

export const composablesEntries: Entry[] = [
  {
    id: 'composables-anatomy',
    section: 'composables',
    title: 'Anatomy of a composable',
    summary:
      'A `use*` function called synchronously in `setup`: accept `MaybeRefOrGetter` inputs and read them with `toValue()` inside `computed`/`watch`, return a plain object of refs, clean up with `onScopeDispose`, and guard `window` for SSR.',
    tags: ['composable', 'MaybeRefOrGetter', 'toValue', 'onScopeDispose', 'SSR', 'conventions'],
    snippet: anatomySrc,
    gotchas: [
      'Call composables synchronously at the top of `setup` / `<script setup>`. Lifecycle hooks and `provide`/`inject` called elsewhere (in a click handler, a `setTimeout`) warn and do nothing, because there is no current instance.',
      'Return `{ width, isWide }` refs, not `reactive({ ... })`: destructuring a reactive object copies plain values and reactivity is lost.',
      '`toValue(input)` at the top of the composable reads the value once. Call it inside a `computed`/`watch` so the composable follows later changes.',
      'Prefer `onScopeDispose` over `onUnmounted`: it also runs inside a bare `effectScope()` (tests, stores) and does not warn outside a component.',
    ],
  },
  {
    id: 'composables-use-event-listener',
    section: 'composables',
    title: 'useEventListener',
    summary:
      'A `watch` on the target (an element, a template ref or a getter) adds the listener and removes it in `onCleanup`. It re-binds when the target changes and unbinds when the scope is disposed. Most DOM composables are built on this pattern.',
    tags: ['addEventListener', 'template ref', 'watch', 'onCleanup', 'cleanup'],
    snippet: eventListenerSrc,
    gotchas: [
      'Use `flush: \'post\'`. With the default `pre` flush, the first run happens before the template ref is assigned and the listener never binds.',
      'Removing a listener needs the same function and the same `capture` flag. An inline arrow created again on every run can never be removed.',
    ],
  },
  {
    id: 'composables-use-local-storage',
    section: 'composables',
    title: 'useLocalStorage<T>',
    summary:
      'A ref saved to `localStorage` as JSON. It starts from the stored value (or `initial` when the JSON is missing or corrupt), writes back on deep changes, and syncs with other tabs through the `storage` event.',
    tags: ['localStorage', 'persistence', 'JSON', 'storage event', 'deep watch'],
    snippet: localStorageSrc,
    Demo: LocalStorageDemo,
    gotchas: [
      '`JSON.parse(raw) as T` trusts whatever is on disk. Old app versions and users can leave any shape there, so validate before casting when it matters.',
      'The `storage` event fires only in other tabs, never in the tab that wrote the value.',
      'On the server the ref holds `initial`. A client that hydrates with a different stored value causes a hydration mismatch, so read storage in `onMounted` or render the value client-only.',
    ],
  },
  {
    id: 'composables-use-fetch',
    section: 'composables',
    title: 'useFetch<T> with abort',
    summary:
      'Status is a discriminated union, so `data` exists only on `success`. A `watch` on the URL creates an `AbortController` per run, and `onWatcherCleanup` aborts the stale request when the URL changes or the component unmounts. A `parse` function validates the JSON before it enters the app.',
    tags: ['fetch', 'AbortController', 'onWatcherCleanup', 'discriminated union', 'validation', 'race condition'],
    snippet: fetchSrc,
    Demo: FetchDemo,
    gotchas: [
      '`onWatcherCleanup` (Vue 3.5) must be called before the first `await`. After it, the active watcher is gone and the call warns. Use the `onCleanup` argument when you need to register cleanup later.',
      'Check `signal.aborted` before writing state. A slow response that arrives after a newer one would otherwise overwrite fresh data.',
      '`res.json()` returns `Promise<any>`. Pass it through a parse function (for example zod\'s `.parse`) so `any` stays out of your types.',
    ],
  },
  {
    id: 'composables-use-media-query',
    section: 'composables',
    title: 'useMediaQuery / usePreferredDark',
    summary:
      'Wraps `matchMedia` in a read-only boolean ref that updates on `change`. `watchEffect` subscribes again whenever a reactive query changes. Presets like `usePreferredDark` are one-liners built on it.',
    tags: ['matchMedia', 'prefers-color-scheme', 'prefers-reduced-motion', 'responsive', 'mock'],
    snippet: mediaQuerySrc,
    Demo: MediaQueryDemo,
    gotchas: [
      'jsdom has no `matchMedia`. Stub it with `vi.stubGlobal` and a fake object that records listeners so tests can fire `change`.',
      'The value is `false` on the server, so a layout that switches on it can flash after hydration. Prefer CSS media queries for pure styling.',
    ],
  },
  {
    id: 'composables-use-on-click-outside',
    section: 'composables',
    title: 'useOnClickOutside',
    summary:
      'Closes popovers when the user points at, or tabs focus to, anything outside the target. It listens for `pointerdown` and `focusin` in the capture phase and checks `composedPath()`.',
    tags: ['click outside', 'dropdown', 'popover', 'focusin', 'keyboard', 'a11y'],
    snippet: clickOutsideSrc,
    Demo: ClickOutsideDemo,
    gotchas: [
      'If you listen only for `click`/`mousedown`, keyboard users who Tab out of a menu leave it open. Add `focusin`.',
      'Exclude the toggle button by putting it inside the target. If you don\'t, its `pointerdown` closes the menu and its `click` opens it again.',
    ],
  },
  {
    id: 'composables-use-previous',
    section: 'composables',
    title: 'usePrevious',
    summary: 'Records the value from before the latest change. It watches a getter and keeps the watcher\'s `oldValue`.',
    tags: ['watch', 'oldValue', 'getter', 'previous'],
    snippet: previousSrc,
    gotchas: [
      'Watching a getter fires only when the returned value changes (`Object.is`). Pushing into the same array is not a change. A watch on a `reactive` object is deep, but then `old === new` because both point at the same proxy.',
    ],
  },
  {
    id: 'composables-use-toggle',
    section: 'composables',
    title: 'useToggle',
    summary:
      'Returns a `[value, toggle]` tuple, so callers name both parts. `toggle(true/false)` sets the value; any other argument (such as a DOM event) flips it.',
    tags: ['boolean', 'tuple', 'as const'],
    snippet: toggleSrc,
    gotchas: [
      '`@click="toggle"` passes the `MouseEvent` as the first argument. A naive `toggle(next = !value)` would store the event object. Guard with `typeof`, or write `@click="toggle()"`.',
    ],
  },
  {
    id: 'composables-use-counter',
    section: 'composables',
    title: 'useCounter with min/max',
    summary:
      'Keeps the count between `min` and `max` and exposes it as `readonly`, so only `inc`/`dec`/`set`/`reset` can change it. `atMin()`/`atMax()` drive `disabled` on the buttons.',
    tags: ['counter', 'clamp', 'readonly', 'stepper'],
    snippet: counterSrc,
    gotchas: [
      '`@click="inc"` passes the event as `step` and the result is `NaN`. `vue-tsc` with `strictTemplates` reports this; plain JS fails silently. Write `@click="inc()"`.',
    ],
  },
  {
    id: 'composables-use-async-state',
    section: 'composables',
    title: 'useAsyncState (loading / error / data)',
    summary:
      'Wraps any async function with `loading`, `error`, `data` and `execute(...args)`. A call counter lets only the latest call write its result, so out-of-order responses cannot overwrite newer data.',
    tags: ['async', 'loading', 'error', 'race condition', 'execute'],
    snippet: asyncStateSrc,
    gotchas: [
      'An `await` in `setup` before other composable calls is a trap. The current instance is lost after the `await`, so later `onMounted`/`watch`/`inject` calls warn or leak. Call composables first and `await` last, or use `<Suspense>`.',
      'The function does not reject; it returns `undefined` on error. Read `error.value` instead of wrapping `execute` in try/catch.',
    ],
  },
  {
    id: 'composables-use-intersection-observer',
    section: 'composables',
    title: 'useIntersectionObserver',
    summary:
      'Creates one `IntersectionObserver` per target and exposes `isVisible`. The observer is disconnected when the target changes and when the scope is disposed. Use it for lazy loading, infinite scroll and "seen" tracking.',
    tags: ['IntersectionObserver', 'lazy load', 'infinite scroll', 'visibility', 'mock'],
    snippet: intersectionSrc,
    gotchas: [
      'jsdom has no `IntersectionObserver`. Stub a small class that stores its callback, and call it in tests to simulate scrolling.',
      '`options` are read when the observer is created. Changing `threshold` or `rootMargin` later has no effect until the target changes.',
    ],
  },
  {
    id: 'composables-use-element-size',
    section: 'composables',
    title: 'useElementSize (ResizeObserver)',
    summary:
      'Tracks an element\'s content-box size with a `ResizeObserver` and returns `width` and `height` as separate refs. It reacts to container changes that `window` resize events miss.',
    tags: ['ResizeObserver', 'element size', 'container', 'mock'],
    snippet: elementSizeSrc,
    gotchas: [
      'Writing to the same element\'s size inside the callback can cause a resize loop ("ResizeObserver loop limit exceeded").',
      'jsdom does no layout, so `getBoundingClientRect()` returns zeros. Mock `ResizeObserver` and push sizes from the test.',
    ],
  },
  {
    id: 'composables-use-clipboard',
    section: 'composables',
    title: 'useClipboard',
    summary:
      '`copy(text)` returns whether the write succeeded and turns on a `copied` flag that resets after a timeout. Copying again restarts the timer, and disposing the scope clears it.',
    tags: ['clipboard', 'navigator.clipboard', 'copy', 'fake timers', 'setTimeout'],
    snippet: clipboardSrc,
    gotchas: [
      '`navigator.clipboard` exists only in secure contexts (https or localhost), and the write may need a user gesture. Feature-detect it and handle rejection.',
      'In tests, define `navigator.clipboard` with `Object.defineProperty(..., { configurable: true })` and drive the reset with `vi.useFakeTimers()`.',
    ],
  },
  {
    id: 'composables-use-title',
    section: 'composables',
    title: 'useTitle',
    summary:
      'Keeps `document.title` in sync with a string, ref or getter through `watchEffect`, and by default restores the previous title on unmount.',
    tags: ['document.title', 'watchEffect', 'toValue', 'head'],
    snippet: titleSrc,
    gotchas: [
      'With nested routes, several `useTitle` calls compete and the last write wins. Restoring on unmount happens in unmount order, which is not always what you expect. For anything beyond a simple app, use a head manager (for example `@unhead/vue`).',
    ],
  },
  {
    id: 'composables-shared-state',
    section: 'composables',
    title: 'Shared state: module-level store',
    summary:
      'State created at module scope is a singleton, so every `useCart()` caller shares it. State created inside the function is private to each caller. Exposing `readonly` state plus named actions gives a minimal Pinia-like store.',
    tags: ['global state', 'store', 'singleton', 'SSR', 'Pinia', 'readonly'],
    snippet: cartSrc,
    gotchas: [
      'SSR: module scope lives as long as the server process, so one user\'s cart leaks into the next request. Use per-app state instead: `provide`/`inject`, `createInjectionState`, or Pinia installed on each request\'s app.',
      'Tests share the module too. Reset it in `beforeEach` or use `vi.resetModules()`, or results depend on test order.',
    ],
  },
  {
    id: 'composables-create-injection-state',
    section: 'composables',
    title: 'createInjectionState (provide / inject)',
    summary:
      'Turns any composable into state scoped to a subtree: an ancestor calls `useProvide(...)`, and descendants call `useInject()` with full typing through `InjectionKey<T>`. Each provider gets its own instance, which makes it SSR-safe.',
    tags: ['provide', 'inject', 'InjectionKey', 'dependency injection', 'scoped state', 'SSR'],
    snippet: injectionStateSrc,
    gotchas: [
      '`inject(key)` with no default logs "injection not found" and returns `undefined`. Pass an explicit default (`null`) and throw a clear error, so a missing provider fails loudly.',
      '`provide` makes state visible to descendants only. A component cannot inject what it provides itself; use the value `useProvide` returns.',
    ],
  },
];
