import type { Entry } from './types';
import refVsReactiveSrc from '../snippets/reactivity/refVsReactive.ts?raw';
import refUnwrappingSrc from '../snippets/reactivity/refUnwrapping.ts?raw';
import templateUnwrapSrc from '../snippets/reactivity/TemplateUnwrap.vue?raw';
import toRefsSrc from '../snippets/reactivity/toRefs.ts?raw';
import propsDestructureSrc from '../snippets/reactivity/PropsDestructure.vue?raw';
import computedSrc from '../snippets/reactivity/computed.ts?raw';
import writableComputedSrc from '../snippets/reactivity/writableComputed.ts?raw';
import watchVsWatchEffectSrc from '../snippets/reactivity/watchVsWatchEffect.ts?raw';
import watchSourcesSrc from '../snippets/reactivity/watchSources.ts?raw';
import watchOptionsSrc from '../snippets/reactivity/watchOptions.ts?raw';
import watchFlushSrc from '../snippets/reactivity/WatchFlush.vue?raw';
import watchCleanupSrc from '../snippets/reactivity/watchCleanup.ts?raw';
import shallowRefSrc from '../snippets/reactivity/shallowRef.ts?raw';
import markRawSrc from '../snippets/reactivity/markRaw.ts?raw';
import readonlySrc from '../snippets/reactivity/readonly.ts?raw';
import toValueSrc from '../snippets/reactivity/toValue.ts?raw';
import nextTickSrc from '../snippets/reactivity/NextTick.vue?raw';
import collectionsSrc from '../snippets/reactivity/collections.ts?raw';
import replaceReactiveSrc from '../snippets/reactivity/replaceReactive.ts?raw';
import effectScopeSrc from '../snippets/reactivity/effectScope.ts?raw';
import clampedRefSrc from '../snippets/reactivity/clampedRef.ts?raw';
import identitySrc from '../snippets/reactivity/identity.ts?raw';
import DestructureDemo from '../demos/reactivity/DestructureDemo.vue';
import WatchLogDemo from '../demos/reactivity/WatchLogDemo.vue';
import ShallowRefDemo from '../demos/reactivity/ShallowRefDemo.vue';

export const reactivityEntries: Entry[] = [
  {
    id: 'reactivity-ref-vs-reactive',
    section: 'reactivity',
    title: 'ref vs reactive',
    summary:
      'Default to `ref`: it holds any value, is deeply reactive and can be replaced via `.value`. `reactive` drops `.value` but only takes objects and must never be reassigned or destructured.',
    tags: ['ref', 'reactive', '.value', 'state'],
    snippet: refVsReactiveSrc,
    gotchas: [
      '`reactive(0)` does not work — primitives need `ref`.',
      'Resetting a `reactive` means mutating it (`Object.assign`), not `state = reactive({...})`.',
    ],
  },
  {
    id: 'reactivity-ref-unwrapping',
    section: 'reactivity',
    title: 'Ref unwrapping rules',
    summary:
      'A ref inside a reactive object is unwrapped (no `.value`, writes go through). Refs inside reactive arrays, `Map`s and `Set`s are not.',
    tags: ['ref', 'reactive', 'unwrap', 'Map', 'array'],
    snippet: refUnwrappingSrc,
    gotchas: ['`reactive([ref(1)])[0]` is still a `Ref` — you need `.value` there.'],
  },
  {
    id: 'reactivity-template-unwrapping',
    section: 'reactivity',
    title: 'Template unwrapping is top-level only',
    summary:
      'Templates unwrap refs that are top-level bindings of `<script setup>`. A ref nested in a plain object needs `.value` — unless it is the whole interpolation.',
    tags: ['template', 'ref', 'unwrap', 'script setup'],
    snippet: templateUnwrapSrc,
    lang: 'vue',
    gotchas: [
      '`{{ obj.nested + 1 }}` renders `[object Object]1`; destructure the ref to a top-level const or use `.value`.',
    ],
  },
  {
    id: 'reactivity-destructuring',
    section: 'reactivity',
    title: 'Destructuring loses reactivity → toRefs / toRef',
    summary:
      'Destructuring or spreading a `reactive` copies plain values once. `toRefs(state)` turns every property into a linked ref; `toRef(state, key)` or `toRef(() => …)` does one.',
    tags: ['toRefs', 'toRef', 'destructure', 'spread', 'reactive'],
    snippet: toRefsSrc,
    Demo: DestructureDemo,
    gotchas: [
      'Returning `{ ...state }` from a composable silently breaks callers — return `toRefs(state)`.',
      '`toRefs` only creates refs for keys that exist now; use `toRef(state, key)` for optional keys.',
    ],
  },
  {
    id: 'reactivity-props-destructure',
    section: 'reactivity',
    title: 'Reactive props destructure (3.5)',
    summary:
      'In 3.5 `const { count = 0 } = defineProps<…>()` stays reactive because the compiler rewrites `count` to `props.count`. Watch it or pass it to composables through a getter.',
    tags: ['defineProps', 'props', 'destructure', 'defaults', 'getter', '3.5'],
    snippet: propsDestructureSrc,
    lang: 'vue',
    gotchas: [
      '`watch(count, …)` is a compile error, and `useX(count)` passes a frozen number. Use `() => count`.',
      'This is compile-time magic inside `<script setup>` only; destructuring `props` in a plain function still loses reactivity.',
    ],
  },
  {
    id: 'reactivity-computed',
    section: 'reactivity',
    title: 'computed: lazy and cached',
    summary:
      'A `computed` runs only when read and caches until a dependency changes. Prefer it to a method in templates, which re-runs on every render.',
    tags: ['computed', 'cache', 'derived state', 'lazy'],
    snippet: computedSrc,
    gotchas: [
      'Keep getters pure — no mutations, async calls or DOM work. Use a watcher for side effects.',
      'Mutating a computed array (`matches.value.push()`) edits a temporary snapshot; change the source.',
    ],
  },
  {
    id: 'reactivity-writable-computed',
    section: 'reactivity',
    title: 'Writable computed & previous value',
    summary:
      'Pass `{ get, set }` to get a computed that is both derived and assignable (great for `v-model`). Since 3.4 the getter receives the previous value.',
    tags: ['computed', 'get', 'set', 'writable', 'previous', 'v-model'],
    snippet: writableComputedSrc,
  },
  {
    id: 'reactivity-watch-vs-watcheffect',
    section: 'reactivity',
    title: 'watch vs watchEffect',
    summary:
      '`watchEffect` runs immediately and tracks everything it reads. `watch` is lazy, watches only its explicit source and gets the new and old values.',
    tags: ['watch', 'watchEffect', 'side effects', 'dependencies'],
    snippet: watchVsWatchEffectSrc,
    Demo: WatchLogDemo,
    gotchas: [
      '`watchEffect` only tracks reads made before its first `await`. Read async dependencies up front, or use `watch`.',
      'Writing to state that the same effect reads causes an infinite loop.',
    ],
  },
  {
    id: 'reactivity-watch-sources',
    section: 'reactivity',
    title: 'watch sources',
    summary:
      'A source can be a ref, a getter, an array of either, or a reactive object. A reactive object is watched deeply; a getter returning an object only fires when it is replaced.',
    tags: ['watch', 'getter', 'deep', 'reactive', 'sources'],
    snippet: watchSourcesSrc,
    gotchas: [
      '`watch(state.count, …)` passes a number, not a source. Write `watch(() => state.count, …)`.',
      'When you watch a reactive object deeply, `newValue === oldValue` because it is the same proxy.',
    ],
  },
  {
    id: 'reactivity-watch-options',
    section: 'reactivity',
    title: 'watch options: deep, immediate, once',
    summary:
      'A ref holding an object is watched shallowly: use `deep: true`, or since 3.5 a numeric depth. `immediate` runs the callback once up front, and `once` stops it after the first change.',
    tags: ['watch', 'deep', 'immediate', 'once', '3.5'],
    snippet: watchOptionsSrc,
    gotchas: ['`deep: true` walks the entire object on every change — costly on large data. Limit it with a depth or a narrow getter.'],
  },
  {
    id: 'reactivity-watch-flush',
    section: 'reactivity',
    title: "Watcher flush timing: 'pre' | 'post' | 'sync'",
    summary:
      "By default, watchers run in a batch before the component re-renders, so the DOM is still stale. `flush: 'post'` runs after the patch, and `'sync'` runs on every single mutation.",
    tags: ['watch', 'flush', 'post', 'sync', 'watchPostEffect', 'DOM'],
    snippet: watchFlushSrc,
    lang: 'vue',
    gotchas: [
      "Reading template refs in a default watcher gives the old DOM. Use `flush: 'post'` or `await nextTick()`.",
      "`'sync'` bypasses batching: pushing 1000 items runs the callback 1000 times.",
    ],
  },
  {
    id: 'reactivity-watch-cleanup',
    section: 'reactivity',
    title: 'onWatcherCleanup & stopping watchers',
    summary:
      'Register cleanup (3.5 `onWatcherCleanup`, or the callback’s `onCleanup` argument) to abort stale async work before the next run. The returned handle stops, pauses or resumes the watcher.',
    tags: ['watch', 'onWatcherCleanup', 'onCleanup', 'AbortController', 'race condition', 'stop'],
    snippet: watchCleanupSrc,
    gotchas: [
      '`onWatcherCleanup` must be called synchronously, before the first `await`. After that it no longer knows which watcher is active.',
      'Watchers created asynchronously (after an `await` in setup, or in a `setTimeout`) are not stopped on unmount. Stop them yourself.',
    ],
  },
  {
    id: 'reactivity-shallow-ref',
    section: 'reactivity',
    title: 'shallowRef + triggerRef',
    summary:
      '`shallowRef` tracks only `.value` assignment and leaves the contents as plain objects. Use it for large or immutable data that you replace wholesale. `triggerRef` forces an update after mutating in place.',
    tags: ['shallowRef', 'triggerRef', 'performance', 'immutable'],
    snippet: shallowRefSrc,
    Demo: ShallowRefDemo,
    gotchas: [
      'The template looks stale after an in-place mutation, then catches up on the next unrelated re-render. That is a confusing source of "random" bugs.',
    ],
  },
  {
    id: 'reactivity-markraw-shallow-reactive',
    section: 'reactivity',
    title: 'markRaw & shallowReactive',
    summary:
      '`markRaw` keeps a value from ever being proxied, which suits class instances from libraries and big immutable data. `shallowReactive` makes only the top-level keys reactive.',
    tags: ['markRaw', 'shallowReactive', 'class', 'performance', 'third-party'],
    snippet: markRawSrc,
    gotchas: [
      'Proxying a class with `#private` fields throws a `TypeError` when its methods run. Wrap such instances in `markRaw`.',
      '`markRaw` is shallow: the objects inside a marked value are still proxied if you reach them through other reactive state.',
    ],
  },
  {
    id: 'reactivity-readonly',
    section: 'reactivity',
    title: 'readonly / shallowReadonly',
    summary:
      '`readonly(state)` is a live, deeply read-only view of the same state. Expose it from stores so only your actions can write. `shallowReadonly` protects only the top level.',
    tags: ['readonly', 'shallowReadonly', 'store', 'encapsulation'],
    snippet: readonlySrc,
    gotchas: ['At runtime, writes are ignored with only a dev warning. Rely on the `DeepReadonly` type to catch them at compile time.'],
  },
  {
    id: 'reactivity-to-value',
    section: 'reactivity',
    title: 'toValue & MaybeRefOrGetter',
    summary:
      'Type composable inputs as `MaybeRefOrGetter<T>` and normalize them with `toValue()` inside a `computed` or watcher. Callers can then pass a value, a ref or a getter.',
    tags: ['toValue', 'MaybeRefOrGetter', 'MaybeRef', 'unref', 'isRef', 'composables'],
    snippet: toValueSrc,
    gotchas: [
      'Calling `toValue(input)` once at the top of the composable reads it a single time and loses reactivity. Call it inside the effect.',
      '`unref` does not call getters. Use `toValue` for inputs that can be getters.',
    ],
  },
  {
    id: 'reactivity-next-tick',
    section: 'reactivity',
    title: 'nextTick: DOM updates are batched',
    summary:
      'State changes are applied to the DOM in a batch on the next microtask. `await nextTick()` before measuring, scrolling or focusing the new DOM.',
    tags: ['nextTick', 'DOM', 'batching', 'scroll', 'focus'],
    snippet: nextTickSrc,
    lang: 'vue',
    gotchas: ['In tests, assert after `await nextTick()`. Otherwise, use an awaited `trigger` / `setValue` / user-event call.'],
  },
  {
    id: 'reactivity-collections',
    section: 'reactivity',
    title: 'Arrays, Sets & Maps: just mutate',
    summary:
      'Vue tracks in-place `push`, `splice`, `Set.add` and `Map.set`, plus nested property writes. That is the opposite of React, where you copy state to change it.',
    tags: ['array', 'Set', 'Map', 'mutation', 'collections', 'React'],
    snippet: collectionsSrc,
    gotchas: [
      '`WeakMap`/`WeakSet` are reactive too, but they cannot be iterated, so `size` and loops are not available.',
      'Sorting in a computed with `arr.sort()` mutates the source. Use `toSorted()`.',
    ],
  },
  {
    id: 'reactivity-replace-reactive',
    section: 'reactivity',
    title: 'Replacing a reactive object breaks bindings',
    summary:
      '`state = reactive({...})` rebinds a variable that templates, computeds and watchers already captured, so they keep tracking the old proxy. Mutate it in place or use a `ref`.',
    tags: ['reactive', 'reset', 'Object.assign', 'ref', 'gotcha'],
    snippet: replaceReactiveSrc,
    gotchas: ['The same applies to arrays: `list.splice(0)` or `list.length = 0`, never `list = []` on a `reactive`.'],
  },
  {
    id: 'reactivity-effect-scope',
    section: 'reactivity',
    title: 'effectScope',
    summary:
      'Collect the computeds, watchers and `onScopeDispose` callbacks created outside a component, then dispose of them all with one `scope.stop()`. It is the basis for stores and shared composables.',
    tags: ['effectScope', 'onScopeDispose', 'cleanup', 'store'],
    snippet: effectScopeSrc,
    gotchas: [
      'Effects created at module level or in a `setTimeout` belong to no scope and leak until you stop them yourself.',
    ],
  },
  {
    id: 'reactivity-custom-ref',
    section: 'reactivity',
    title: 'customRef: a clamped number',
    summary:
      '`customRef` gives you full control over `track()` and `trigger()`. Here, writes are clamped into a range, and changes only notify when something actually changed.',
    tags: ['customRef', 'track', 'trigger', 'clamp', 'v-model'],
    snippet: clampedRefSrc,
    gotchas: [
      'If you skip `trigger()` when the clamped value is unchanged, a bound `<input>` keeps showing the out-of-range text. Trigger when the input was rejected too.',
    ],
  },
  {
    id: 'reactivity-identity',
    section: 'reactivity',
    title: 'Proxy identity & toRaw',
    summary:
      '`reactive(obj)` returns a cached Proxy, so it is `!== obj`. Items read from reactive arrays are proxies too. Use `toRaw` to compare or clone the original object.',
    tags: ['toRaw', 'isProxy', 'Proxy', 'identity', 'structuredClone'],
    snippet: identitySrc,
    gotchas: [
      '`list.find(i => i === rawItem)` misses because the callback receives proxies. `includes` and `indexOf` are patched to also match raw values.',
      '`structuredClone(state)` throws a `DataCloneError`. Clone `toRaw(state)` instead.',
    ],
  },
];
