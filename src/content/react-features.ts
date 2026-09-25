import type { Entry } from './types';
import lazyInitSrc from '../snippets/react-features/LazyInit.tsx?raw';
import counterSrc from '../snippets/react-features/Counter.tsx?raw';
import effectCleanupSrc from '../snippets/react-features/effectCleanup.ts?raw';
import derivedStateSrc from '../snippets/react-features/DerivedState.tsx?raw';
import resetWithKeySrc from '../snippets/react-features/ResetWithKey.tsx?raw';
import useRefSrc from '../snippets/react-features/UseRef.tsx?raw';
import memoCallbackSrc from '../snippets/react-features/MemoCallback.tsx?raw';
import useIdSrc from '../snippets/react-features/UseId.tsx?raw';
import transitionFilterSrc from '../snippets/react-features/TransitionFilter.tsx?raw';
import deferredSearchSrc from '../snippets/react-features/DeferredSearch.tsx?raw';
import suspenseUseSrc from '../snippets/react-features/SuspenseUse.tsx?raw';
import likeButtonSrc from '../snippets/react-features/LikeButton.tsx?raw';
import subscribeFormSrc from '../snippets/react-features/SubscribeForm.tsx?raw';
import errorBoundarySrc from '../snippets/react-features/ErrorBoundary.tsx?raw';
import modalSrc from '../snippets/react-features/Modal.tsx?raw';
import formsSrc from '../snippets/react-features/Forms.tsx?raw';
import listKeysSrc from '../snippets/react-features/ListKeys.tsx?raw';
import useLocalStorageSrc from '../snippets/react-features/useLocalStorage.ts?raw';
import usePreviousSrc from '../snippets/react-features/usePrevious.ts?raw';
import useOnClickOutsideSrc from '../snippets/react-features/useOnClickOutside.ts?raw';
import useMediaQuerySrc from '../snippets/react-features/useMediaQuery.ts?raw';
import useFetchSrc from '../snippets/react-features/useFetch.ts?raw';
import { TransitionFilterDemo } from '../demos/react-features/TransitionFilterDemo';
import { LikeButtonDemo } from '../demos/react-features/LikeButtonDemo';
import { SubscribeFormDemo } from '../demos/react-features/SubscribeFormDemo';
import { ListKeysDemo } from '../demos/react-features/ListKeysDemo';
import { MediaQueryDemo } from '../demos/react-features/MediaQueryDemo';

const section = 'react-features';

export const reactFeaturesEntries: Entry[] = [
  {
    id: 'react-features-usestate-lazy-init',
    section,
    title: 'useState lazy initializer',
    summary: 'Pass a function to `useState` when the initial value is expensive (parsing, reading storage): React calls it once on mount instead of every render.',
    tags: ['useState', 'lazy', 'initial state', 'performance'],
    snippet: lazyInitSrc,
    gotchas: [
      '`useState(compute())` still calls `compute()` on every render; the result is just ignored after the first.',
      'Pass the function, do not call it: `useState(compute)`, not `useState(compute())`.',
      'StrictMode calls the initializer twice in dev; keep it pure.',
    ],
  },
  {
    id: 'react-features-usestate-updater',
    section,
    title: 'useState functional updates',
    summary: 'State is a snapshot per render. `setCount(count + 1)` three times adds 1; `setCount(c => c + 1)` three times adds 3 because updaters queue.',
    tags: ['useState', 'updater', 'batching', 'stale closure'],
    snippet: counterSrc,
    gotchas: [
      'Use the updater form whenever the next value depends on the previous one, especially in timers and async callbacks (stale closures).',
      'Updaters must be pure: StrictMode runs them twice in dev.',
    ],
  },
  {
    id: 'react-features-useeffect-cleanup',
    section,
    title: 'useEffect cleanup',
    summary: 'Return a cleanup from every effect that starts something: timers, listeners, subscriptions, requests. It runs before the next effect and on unmount.',
    tags: ['useEffect', 'cleanup', 'setInterval', 'addEventListener', 'strict mode'],
    snippet: effectCleanupSrc,
    gotchas: [
      'StrictMode mounts, cleans up and re-mounts every effect in dev. If that breaks something, the cleanup is missing or incomplete.',
      'Object/array/function deps created during render are new every time, so the effect re-runs every render; setting state in it loops forever. Depend on primitives or memoize.',
      'removeEventListener needs the same function reference that was added: define the handler inside the effect.',
    ],
  },
  {
    id: 'react-features-derived-state',
    section,
    title: 'You might not need an effect: derived state',
    summary: 'If a value can be computed from props or state, compute it during render. Mirroring it into state with an effect adds a render, shows stale data first and can desync.',
    tags: ['useEffect', 'derived state', 'anti-pattern', 'useMemo'],
    snippet: derivedStateSrc,
    gotchas: [
      'Reach for `useMemo` only when the calculation is measurably slow, not by default.',
      'Effects never run during SSR, so effect-derived data is missing from server HTML.',
    ],
  },
  {
    id: 'react-features-reset-state-with-key',
    section,
    title: 'Reset state with key',
    summary: 'Giving a component a different `key` makes React unmount the old instance and mount a fresh one, resetting all nested state without an effect.',
    tags: ['key', 'reset state', 'useEffect'],
    snippet: resetWithKeySrc,
    gotchas: [
      'Resetting via `useEffect(() => setX(initial), [id])` renders once with stale state and then again.',
      'A key remount also re-runs effects and loses DOM state such as focus and scroll: use it deliberately.',
    ],
  },
  {
    id: 'react-features-useref',
    section,
    title: 'useRef: mutable value and DOM ref',
    summary: 'A ref is a mutable `{ current }` box that survives renders without triggering one: ideal for timer ids and DOM nodes.',
    tags: ['useRef', 'dom', 'focus', 'interval', 'mutable'],
    snippet: useRefSrc,
    gotchas: [
      'Do not read or write `ref.current` during render (except lazy init): the UI will not update, and it breaks purity under StrictMode and React Compiler.',
      'DOM refs are `null` until commit: access them in effects or event handlers.',
      'If the value should appear on screen, it belongs in state, not a ref.',
    ],
  },
  {
    id: 'react-features-usememo-usecallback',
    section,
    title: 'useMemo / useCallback: when they matter',
    summary: 'They preserve referential identity between renders. That matters for props of `memo` children, for effect dependencies, and for genuinely expensive calculations.',
    tags: ['useMemo', 'useCallback', 'memo', 'referential equality', 'performance'],
    snippet: memoCallbackSrc,
    gotchas: [
      'Without `memo` on the child, stable props change nothing: the child re-renders with its parent anyway.',
      'One unstable prop (inline object, arrow function, `children`) defeats `memo` entirely.',
      'With React Compiler enabled, most manual memoization becomes unnecessary.',
    ],
  },
  {
    id: 'react-features-useid',
    section,
    title: 'useId for label / aria wiring',
    summary: '`useId` generates an id that is unique per component instance and identical on server and client, so `htmlFor` and `aria-describedby` survive hydration.',
    tags: ['useId', 'accessibility', 'aria', 'ssr', 'hydration'],
    snippet: useIdSrc,
    gotchas: [
      'Not for list keys: keys must come from your data.',
      'The generated id contains characters that are invalid in CSS selectors: use `getElementById` or `CSS.escape` rather than a raw `querySelector`.',
      '`Math.random()` or a module counter causes hydration mismatches.',
    ],
  },
  {
    id: 'react-features-usetransition',
    section,
    title: 'useTransition: keep input responsive',
    summary: 'Split the urgent update (input value) from the expensive one (filtered list) and mark the latter as a transition so React can interrupt it.',
    tags: ['useTransition', 'startTransition', 'concurrent', 'filter', 'performance'],
    snippet: transitionFilterSrc,
    gotchas: [
      'Controlled input values must not be set inside a transition, or typing lags.',
      'Transitions make rendering interruptible, not faster: a single slow component still blocks.',
      'State updates after an `await` inside `startTransition` must be wrapped in another `startTransition`.',
    ],
    Demo: TransitionFilterDemo,
  },
  {
    id: 'react-features-usedeferredvalue',
    section,
    title: 'useDeferredValue',
    summary: 'Render with a lagging copy of a value so the expensive subtree updates in the background. Handy when you do not own the state setter.',
    tags: ['useDeferredValue', 'concurrent', 'search', 'stale'],
    snippet: deferredSearchSrc,
    gotchas: [
      'The slow child must be wrapped in `memo`, otherwise it re-renders with the urgent value anyway.',
      'Compare `value !== deferredValue` to show a stale indicator.',
      'It is not a debounce: there is no fixed delay and no fewer network requests.',
    ],
  },
  {
    id: 'react-features-suspense-use',
    section,
    title: 'Suspense + use(promise)',
    summary: '`use(promise)` suspends until the promise settles; the nearest `<Suspense>` shows a fallback and an error boundary catches rejections.',
    tags: ['Suspense', 'use', 'promise', 'data fetching', 'react 19'],
    snippet: suspenseUseSrc,
    gotchas: [
      'Creating the promise during render (`use(fetch(...))`) suspends forever: each retry makes a new promise. Create it in a loader, event, parent or cache.',
      'A rejected promise throws: wrap with an error boundary.',
      'Unlike hooks, `use` may be called conditionally.',
    ],
  },
  {
    id: 'react-features-useoptimistic',
    section,
    title: 'useOptimistic like button',
    summary: 'Show the expected result immediately while an async action runs; when it settles React falls back to real state, so failures roll back automatically.',
    tags: ['useOptimistic', 'optimistic ui', 'actions', 'transition', 'react 19'],
    snippet: likeButtonSrc,
    gotchas: [
      'The optimistic setter only works inside a transition or form action; outside one React warns and it reverts immediately.',
      'Commit the confirmed value to real state before the action ends, or the UI snaps back.',
    ],
    Demo: LikeButtonDemo,
  },
  {
    id: 'react-features-useactionstate',
    section,
    title: 'useActionState + <form action>',
    summary: 'Pass an async function as `<form action>`; `useActionState` gives you the returned state and an `isPending` flag with no manual `preventDefault` or loading state.',
    tags: ['useActionState', 'form', 'action', 'pending', 'FormData', 'react 19'],
    snippet: subscribeFormSrc,
    gotchas: [
      'React resets uncontrolled fields after a successful action; return submitted values in state if you need to keep them.',
      'Return errors as state rather than throwing: a thrown error goes to the nearest error boundary.',
      'Multiple submissions are queued and run sequentially, each receiving the previous state.',
    ],
    Demo: SubscribeFormDemo,
  },
  {
    id: 'react-features-error-boundary',
    section,
    title: 'Error boundary with reset',
    summary: 'A class component with `getDerivedStateFromError` renders a fallback when a descendant throws during render; `componentDidCatch` logs; resetting state retries.',
    tags: ['error boundary', 'getDerivedStateFromError', 'componentDidCatch', 'class component'],
    snippet: errorBoundarySrc,
    gotchas: [
      'Boundaries do not catch errors in event handlers, timeouts or async code; handle those with try/catch and state.',
      'Resetting without fixing the cause re-throws immediately. A `key` on the boundary is an easy way to reset on navigation.',
      'A boundary cannot catch errors thrown by itself, only by its children.',
    ],
  },
  {
    id: 'react-features-portal',
    section,
    title: 'Portals (createPortal)',
    summary: '`createPortal` renders children into another DOM node (e.g. `document.body`) to escape `overflow` and stacking contexts, while staying in the React tree.',
    tags: ['createPortal', 'portal', 'modal', 'dialog', 'react-dom'],
    snippet: modalSrc,
    gotchas: [
      'React events bubble through the React tree, not the DOM tree: a click inside the portal triggers `onClick` on React ancestors.',
      '`document` does not exist on the server: only portal after mount or on the client.',
      'A portal gives no focus management; for real modals, also trap focus or use the native `<dialog>` element.',
    ],
  },
  {
    id: 'react-features-controlled-vs-uncontrolled',
    section,
    title: 'Controlled vs uncontrolled inputs',
    summary: 'Controlled: `value` + `onChange`, React state is the source of truth. Uncontrolled: `defaultValue`, the DOM holds the value and you read it on submit with `FormData` or a ref.',
    tags: ['forms', 'controlled', 'uncontrolled', 'FormData', 'defaultValue'],
    snippet: formsSrc,
    gotchas: [
      '`value` without `onChange` makes a read-only input (React warns).',
      'Switching from `undefined` to a string turns an uncontrolled input into a controlled one; initialise with `\'\'`.',
      '`defaultValue` is only read on mount; change the `key` to reset it.',
    ],
  },
  {
    id: 'react-features-list-keys',
    section,
    title: 'List keys: why index keys break state',
    summary: 'Keys tell React which item is which. With index keys, reordering moves the labels but leaves per-row state (inputs, focus, hooks) at the old position.',
    tags: ['key', 'lists', 'reorder', 'index key', 'reconciliation'],
    snippet: listKeysSrc,
    gotchas: [
      'Index keys are only safe for static lists that are never reordered, filtered or inserted into.',
      'Do not generate keys during render (`Math.random()`, `crypto.randomUUID()`): every render remounts every row.',
      'Keys must be unique among siblings only, not globally.',
    ],
    Demo: ListKeysDemo,
  },
  {
    id: 'react-features-uselocalstorage',
    section,
    title: 'useLocalStorage hook',
    summary: 'Typed generic state persisted as JSON, read lazily once, safe on the server and on corrupt data, and synced across tabs via the `storage` event.',
    tags: ['custom hook', 'localStorage', 'persistence', 'storage event', 'generic'],
    snippet: useLocalStorageSrc,
    gotchas: [
      '`JSON.parse` throws on corrupt or hand-edited values, and `getItem`/`setItem` throw in some privacy modes or when full: always try/catch.',
      'The `storage` event fires only in other tabs, never in the one that wrote.',
      'With SSR the server renders the fallback; a different stored value causes a hydration mismatch. Read storage after mount (or `useSyncExternalStore` with a server snapshot) if that matters.',
      '`JSON.parse(...) as T` is unchecked: validate if the data could come from an older app version.',
    ],
  },
  {
    id: 'react-features-useprevious',
    section,
    title: 'usePrevious hook',
    summary: 'Track the previous distinct value of a prop or state using the "adjust state while rendering" pattern.',
    tags: ['custom hook', 'previous value', 'usePrevious'],
    snippet: usePreviousSrc,
    gotchas: [
      'The popular `useRef` + `useEffect` version reads a ref during render, which React docs discourage and which can be wrong under concurrent rendering.',
      'Setting state during render must be guarded by a condition, or it loops forever.',
    ],
  },
  {
    id: 'react-features-useonclickoutside',
    section,
    title: 'useOnClickOutside hook',
    summary: 'Close popovers when the pointer or keyboard focus leaves an element. `useEffectEvent` always calls the latest handler without re-subscribing.',
    tags: ['custom hook', 'click outside', 'useEffectEvent', 'popover', 'dropdown'],
    snippet: useOnClickOutsideSrc,
    gotchas: [
      'Content rendered in a portal is outside `ref.current` in the DOM, so clicks in it count as outside.',
      'Listen for `focusin` too; a click-only version leaves keyboard users with a menu that never closes.',
      'Without `useEffectEvent`, callers must memoize the handler or the listener re-subscribes every render.',
    ],
  },
  {
    id: 'react-features-usemediaquery',
    section,
    title: 'useMediaQuery with useSyncExternalStore',
    summary: 'Subscribe to `matchMedia` with `useSyncExternalStore`: tear-free under concurrent rendering, with a separate server snapshot for SSR.',
    tags: ['custom hook', 'matchMedia', 'useSyncExternalStore', 'responsive', 'ssr'],
    snippet: useMediaQuerySrc,
    gotchas: [
      'An inline `subscribe` function re-subscribes on every render: keep it stable.',
      '`getSnapshot` must return the same value when nothing changed; returning a new object loops forever.',
      'jsdom has no `matchMedia`: stub it in tests.',
    ],
    Demo: MediaQueryDemo,
  },
  {
    id: 'react-features-usefetch',
    section,
    title: 'useFetch with abort + status union',
    summary: 'Fetch in an effect, abort the stale request when the URL changes, and expose a discriminated union so `data` only exists when `status === \'success\'`.',
    tags: ['custom hook', 'fetch', 'AbortController', 'discriminated union', 'race condition'],
    snippet: useFetchSrc,
    gotchas: [
      'Without abort (or an ignore flag), a slow earlier response can overwrite a newer one.',
      'StrictMode runs the effect twice in dev: the first request is aborted, which is expected.',
      '`fetch` only rejects on network errors; check `res.ok` for 4xx/5xx.',
      'For real apps prefer a data library or framework loader: this has no caching or deduping.',
    ],
  },
];
