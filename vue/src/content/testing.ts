import type { Entry } from './types';
import queryPrioritySrc from '../snippets/testing/queryPriority.test.ts?raw';
import queryVariantsSrc from '../snippets/testing/queryVariants.test.ts?raw';
import userEventSrc from '../snippets/testing/userEvent.test.ts?raw';
import mountVsShallowSrc from '../snippets/testing/mountVsShallow.test.ts?raw';
import emittedSrc from '../snippets/testing/emitted.test.ts?raw';
import globalConfigSrc from '../snippets/testing/globalConfig.test.ts?raw';
import asyncUpdatesSrc from '../snippets/testing/asyncUpdates.test.ts?raw';
import vModelSrc from '../snippets/testing/vModel.test.ts?raw';
import composablesSrc from '../snippets/testing/composables.test.ts?raw';
import fakeTimersSrc from '../snippets/testing/fakeTimersUserEvent.test.ts?raw';
import mockFetchSrc from '../snippets/testing/mockFetch.test.ts?raw';
import mockModuleSrc from '../snippets/testing/mockModule.test.ts?raw';
import raceSrc from '../snippets/testing/raceCondition.test.ts?raw';
import suspenseSrc from '../snippets/testing/suspense.test.ts?raw';

export const testingEntries: Entry[] = [
  {
    id: 'testing-query-priority',
    section: 'testing',
    title: 'Query priority (Testing Library)',
    summary: '`render` from `@testing-library/vue` plus `screen` queries. Query the way users and assistive tech find things: `getByRole` with a `name` first, then label, text, and `getByTestId` only as a last resort.',
    tags: ['@testing-library/vue', 'render', 'screen', 'getByRole', 'getByLabelText', 'getByTestId'],
    snippet: queryPrioritySrc,
    gotchas: [
      '`*ByRole` ignores elements hidden from the accessibility tree (`hidden`, `display:none`, `aria-hidden`); pass `{ hidden: true }` to include them.',
      'The `name` option matches the accessible name (label, `aria-label`, text content), not the `name` attribute.',
      'If only `getByPlaceholderText` or `getByTestId` works, the UI probably has an accessibility bug.',
    ],
  },
  {
    id: 'testing-get-query-find',
    section: 'testing',
    title: 'getBy vs queryBy vs findBy',
    summary: '`getBy` throws when nothing (or more than one) matches, `queryBy` returns `null` for asserting absence, `findBy` returns a promise that retries until it matches.',
    tags: ['getBy', 'queryBy', 'findBy', 'getAllBy', 'async'],
    snippet: queryVariantsSrc,
    gotchas: [
      '`getBy` throws, so `expect(getBy…).not.toBeInTheDocument()` can never pass: use `queryBy` to assert absence.',
      'The single-element variants all throw on multiple matches, `queryBy` included. Use the `*AllBy` variants for those.',
      'Forgetting `await` before `findBy` gives you a pending promise, and the assertion runs too early.',
    ],
  },
  {
    id: 'testing-user-event',
    section: 'testing',
    title: 'userEvent.setup() vs fireEvent',
    summary: '`userEvent` simulates a full interaction (focus, keydown, input, keyup, click) the way a browser would. `fireEvent` dispatches one DOM event; in Vue, `await` it (or use `fireEvent.update` for inputs).',
    tags: ['userEvent', 'fireEvent', 'fireEvent.update', 'keyboard', 'tab', 'emitted'],
    snippet: userEventSrc,
    gotchas: [
      'All `user.*` methods are async: always `await` them.',
      'Call `userEvent.setup()` before `render`, once per test, and reuse the returned `user`.',
      '`user.type` clicks the element first. Use `user.keyboard` to type into whatever is already focused.',
      "`render` returns `emitted()` too: assert a component's events without touching its internals.",
    ],
  },
  {
    id: 'testing-mount-shallow',
    section: 'testing',
    title: 'mount vs shallowMount (Vue Test Utils)',
    summary: '`mount` renders the full tree; `shallowMount` replaces every child component with a `<name-stub>`. `find` takes a selector, `findComponent` a component, and `setProps` re-renders.',
    tags: ['@vue/test-utils', 'mount', 'shallowMount', 'find', 'findComponent', 'setProps', 'get'],
    snippet: mountVsShallowSrc,
    gotchas: [
      'Prefer `mount`: shallow tests pass even when the parent/child contract is broken, and break on harmless refactors.',
      'Stubs are named after the component `name`. SFCs infer it from the filename; inline `defineComponent` without `name` becomes `<anonymous-stub>`.',
      '`setProps`, `setValue` and `trigger` return `nextTick()`. Forgetting `await` means you assert against the old DOM.',
      '`find` returns an empty wrapper (`exists() === false`) while `get` throws, which gives a clearer failure message.',
    ],
  },
  {
    id: 'testing-emitted',
    section: 'testing',
    title: 'trigger + emitted()',
    summary: '`await wrapper.trigger(\'click\')` dispatches a DOM event and waits for the re-render. `wrapper.emitted(\'name\')` holds one argument array per emit, or `undefined` if it never fired.',
    tags: ['trigger', 'emitted', 'emits', 'events', 'onX props'],
    snippet: emittedSrc,
    gotchas: [
      '`emitted(\'change\')` is `[[1], [2]]`, an array of argument lists, not `[1, 2]`.',
      'Event names are matched as emitted: `emit(\'update:modelValue\')` is read with `emitted(\'update:modelValue\')`.',
      'Passing an `onChange` prop is the same as a parent listener, which is handy for asserting with a spy or a local array.',
    ],
  },
  {
    id: 'testing-global-config',
    section: 'testing',
    title: 'global: stubs, provide, plugins',
    summary: 'The `global` mounting option builds the app context for one test: `stubs` (Teleport, child components), `provide` for injected values, and `plugins` with their options.',
    tags: ['global.stubs', 'global.provide', 'global.plugins', 'Teleport', 'Transition', 'attachTo'],
    snippet: globalConfigSrc,
    gotchas: [
      'Teleported content is not inside `wrapper.html()`. Stub `teleport`, or query `document.body`.',
      'VTU stubs `<Transition>` and `<TransitionGroup>` by default, so leave animations finish instantly. Set `stubs: { transition: false }` to test the real one.',
      '`attachTo: document.body` leaks DOM between tests unless you `unmount()`.',
      'Use `config.global` from `@vue/test-utils` in a setup file for plugins every test needs (router, i18n, pinia).',
    ],
  },
  {
    id: 'testing-nexttick-flushpromises',
    section: 'testing',
    title: 'nextTick vs flushPromises',
    summary: '`await nextTick()` waits for Vue to patch the DOM after a reactive change you made. `await flushPromises()` waits for every already-resolved promise (mocked API calls) and the render that follows.',
    tags: ['nextTick', 'flushPromises', 'async', 'scheduler', 'DOM update'],
    snippet: asyncUpdatesSrc,
    gotchas: [
      'Vue batches DOM updates. A state change in a test, timer or raw DOM event shows up only after `nextTick()`.',
      'One `nextTick` covers one hop. Data that arrives through a promise chain (`fetch().then(r => r.json())`) needs `flushPromises()`.',
      '`flushPromises` cannot wait for promises that have not resolved yet, such as real network calls or timers. Use `findBy*`, fake timers or deferred promises for those.',
    ],
  },
  {
    id: 'testing-v-model',
    section: 'testing',
    title: 'Testing v-model / defineModel',
    summary: '`v-model` is `modelValue` plus `onUpdate:modelValue`. In a test you are the parent: pass both props, and have the listener call `setProps` so the new value flows back.',
    tags: ['v-model', 'defineModel', 'modelValue', 'update:modelValue', 'setProps'],
    snippet: vModelSrc,
    gotchas: [
      'When the parent passes `modelValue` *and* a listener, `defineModel` waits for the parent: without `setProps` the DOM keeps the old value.',
      'For a named model (`defineModel(\'open\')`) the props are `open` and `onUpdate:open`.',
      'Assert on `emitted(\'update:modelValue\')` for the contract, and on the DOM for the user-visible result.',
    ],
  },
  {
    id: 'testing-composables',
    section: 'testing',
    title: 'Testing composables (effectScope, withSetup)',
    summary: 'Run a composable that only uses reactivity inside `effectScope().run()`, and `stop()` the scope afterwards. If it registers lifecycle hooks or uses `inject`, mount a throwaway host app with a `withSetup` helper.',
    tags: ['composables', 'effectScope', 'withSetup', 'createApp', 'onMounted', 'lifecycle'],
    snippet: composablesSrc,
    gotchas: [
      'Outside a component, `onMounted` only warns ("no active component instance") and never runs.',
      'Without a scope, a composable\'s `watch` and `computed` effects outlive the test.',
      'Test composables that touch the DOM, focus or template refs through a real component with `render`/`mount`.',
    ],
  },
  {
    id: 'testing-fake-timers-user-event',
    section: 'testing',
    title: 'Fake timers + userEvent',
    summary: 'Use `vi.useFakeTimers({ shouldAdvanceTime: true })` together with `userEvent.setup({ advanceTimers: vi.advanceTimersByTime })`, or `await user.click()` and `findBy*` hang.',
    tags: ['fake timers', 'vi.useFakeTimers', 'advanceTimers', 'shouldAdvanceTime', 'hang'],
    snippet: fakeTimersSrc,
    gotchas: [
      'user-event waits on a `setTimeout` between actions, and Testing Library only auto-advances *Jest* fake timers. Under Vitest with plain fake timers nobody ticks the clock, so the test times out.',
      '`vi.advanceTimersByTime` runs the callback synchronously, but Vue still renders on the next tick. `await nextTick()` before asserting.',
      '`shouldAdvanceTime` lets real time leak into the clock. Assert on clear margins, not exact millisecond boundaries.',
      'Always `vi.useRealTimers()` in `afterEach`.',
    ],
  },
  {
    id: 'testing-mock-fetch',
    section: 'testing',
    title: 'Mocking fetch',
    summary: 'Spy on `globalThis.fetch` or stub it with `vi.stubGlobal`, and resolve it with a real `Response` so `.ok`, `.status` and `.json()` behave as they do in the browser.',
    tags: ['fetch', 'vi.spyOn', 'vi.stubGlobal', 'Response', 'mock'],
    snippet: mockFetchSrc,
    gotchas: [
      '`mockResolvedValue(response)` returns the *same* `Response` every time, and a body can only be read once. Use `mockImplementation(async () => Response.json(…))` when fetch is called more than once.',
      '`vi.restoreAllMocks()` does not undo `vi.stubGlobal`. Call `vi.unstubAllGlobals()` or set `unstubGlobals: true` in the config.',
      'For larger suites, consider MSW so the tests exercise the real request code.',
    ],
  },
  {
    id: 'testing-mock-module',
    section: 'testing',
    title: 'vi.mock, vi.hoisted, vi.mocked',
    summary: '`vi.mock(path, factory)` replaces a module for every importer. `importOriginal` keeps the exports you do not replace, and `vi.hoisted` makes variables available inside the factory.',
    tags: ['vi.mock', 'vi.hoisted', 'vi.mocked', 'importOriginal', 'module mock'],
    snippet: mockModuleSrc,
    gotchas: [
      '`vi.mock` is hoisted above the imports. A factory that references a normal top-level `const` throws "cannot access before initialization".',
      '`vi.mocked(fn)` is a type-only helper. It does not turn anything into a mock.',
      'The path is resolved relative to the *test file*, and it must be the same module the code under test imports.',
    ],
  },
  {
    id: 'testing-race-condition',
    section: 'testing',
    title: 'Race conditions with deferred promises',
    summary: 'Give each request its own `Promise.withResolvers()` so the test controls the order responses arrive in. This proves a stale response cannot overwrite a newer one, here guarded by `onWatcherCleanup`.',
    tags: ['race condition', 'Promise.withResolvers', 'deferred', 'onWatcherCleanup', 'rerender', 'flushPromises'],
    snippet: raceSrc,
    gotchas: [
      'Call `onWatcherCleanup` *before* the first `await`. After it, there is no active watcher and Vue warns.',
      'Real delays such as `setTimeout(…, 100)` make race tests slow and flaky. Deferred promises are deterministic.',
      'An `AbortController` aborted in the cleanup also cancels the request itself, not just its result.',
    ],
  },
  {
    id: 'testing-suspense',
    section: 'testing',
    title: 'Testing async setup with <Suspense>',
    summary: 'A component with top-level `await` in `<script setup>` renders nothing on its own. Mount it inside a host with `<Suspense>`, then `await flushPromises()` to let the async setup settle.',
    tags: ['Suspense', 'async setup', 'top-level await', 'flushPromises', 'fallback'],
    snippet: suspenseSrc,
    gotchas: [
      'Mounting an async component directly renders an empty wrapper with no error.',
      'Suspense is still marked experimental, so expect a console notice in tests.',
      'Control resolution with a deferred promise to assert the `fallback` slot first.',
    ],
  },
];
