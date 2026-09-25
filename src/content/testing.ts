import type { Entry } from './types';
import queryPrioritySrc from '../snippets/testing/queryPriority.test.tsx?raw';
import queryVariantsSrc from '../snippets/testing/queryVariants.test.tsx?raw';
import userEventSrc from '../snippets/testing/userEvent.test.tsx?raw';
import fakeTimersSrc from '../snippets/testing/fakeTimersUserEvent.test.tsx?raw';
import waitForSrc from '../snippets/testing/waitForPitfalls.test.tsx?raw';
import withinSrc from '../snippets/testing/withinDebug.test.tsx?raw';
import mockFetchSrc from '../snippets/testing/mockFetch.test.tsx?raw';
import mockModuleSrc from '../snippets/testing/mockModule.test.tsx?raw';
import raceSrc from '../snippets/testing/raceCondition.test.tsx?raw';
import renderHookSrc from '../snippets/testing/renderHook.test.tsx?raw';
import a11ySrc from '../snippets/testing/a11yAssertions.test.tsx?raw';

export const testingEntries: Entry[] = [
  {
    id: 'testing-query-priority',
    section: 'testing',
    title: 'Query priority',
    summary: 'Query the way users and assistive tech find things: `getByRole` with a `name` first, then label, text, and `getByTestId` only as a last resort.',
    tags: ['getByRole', 'getByLabelText', 'getByText', 'getByTestId', 'queries'],
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
    summary: '`userEvent` simulates a full interaction (focus, keydown, input, keyup, click) the way a browser would. `fireEvent` dispatches a single DOM event.',
    tags: ['userEvent', 'fireEvent', 'keyboard', 'tab', 'type', 'click'],
    snippet: userEventSrc,
    gotchas: [
      'All `user.*` methods are async: always `await` them.',
      'Call `userEvent.setup()` before `render`, once per test. Calling the old direct APIs (`userEvent.click`) skips shared state such as pressed keys.',
      '`user.type` clicks the element first. Use `user.keyboard` to type into whatever is already focused.',
    ],
  },
  {
    id: 'testing-fake-timers-user-event',
    section: 'testing',
    title: 'Fake timers + userEvent',
    summary: 'In Vitest, use `vi.useFakeTimers({ shouldAdvanceTime: true })` together with `userEvent.setup({ advanceTimers })`, or every `await user.click()` hangs.',
    tags: ['fake timers', 'vi.useFakeTimers', 'advanceTimers', 'shouldAdvanceTime', 'hang'],
    snippet: fakeTimersSrc,
    gotchas: [
      "RTL's `asyncWrapper` waits on a `setTimeout(0)` and only auto-advances when it detects *Jest* fake timers. Under Vitest with plain fake timers that timer never fires, so the test times out.",
      '`findBy*` and `waitFor` poll with timers, so they stall too without `shouldAdvanceTime`.',
      'Wrap `vi.advanceTimersByTime` in `act()` when the timer updates React state.',
      '`shouldAdvanceTime` lets real time leak into the clock. Assert on clear margins, not exact millisecond boundaries.',
    ],
  },
  {
    id: 'testing-waitfor-pitfalls',
    section: 'testing',
    title: 'waitFor pitfalls',
    summary: 'Prefer `findBy`. When you do need `waitFor`, put one assertion in it with no side effects, and write the remaining checks after it.',
    tags: ['waitFor', 'findBy', 'waitForElementToBeRemoved', 'async'],
    snippet: waitForSrc,
    gotchas: [
      'The callback re-runs on every poll and DOM mutation, so a click inside it can fire many times.',
      'An empty `waitFor(() => {})` resolves on the first tick and does not wait for anything.',
      "If a `waitFor` holds several assertions, a failing one hides whether the others passed, and the failure only shows up after the timeout.",
      '`waitForElementToBeRemoved` throws right away if the element is absent when it is called.',
    ],
  },
  {
    id: 'testing-within-debug',
    section: 'testing',
    title: 'within(), debugging, visible vs present',
    summary: '`within(el)` scopes queries to part of the page. `screen.debug()` and `logRoles` show what is actually rendered. `toBeInTheDocument` and `toBeVisible` check different things.',
    tags: ['within', 'screen.debug', 'logRoles', 'toBeVisible', 'toBeInTheDocument'],
    snippet: withinSrc,
    gotchas: [
      '`toBeVisible` checks `display`, `visibility`, `opacity: 0`, `hidden` and closed `<details>` on the element and all its ancestors. jsdom does not load your CSS files, so class-based hiding is not seen.',
      "`screen.debug()` truncates long output. Set `DEBUG_PRINT_LIMIT` or pass `(el, Infinity)`.",
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
      "`mockResolvedValue(response)` returns the *same* `Response` every time, and a body can only be read once. Use `mockImplementation(async () => Response.json(…))` when fetch is called more than once.",
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
    summary: 'Give each request its own `Promise.withResolvers()` so the test controls the order responses arrive in. This proves a stale response cannot overwrite a newer one.',
    tags: ['race condition', 'Promise.withResolvers', 'deferred', 'useEffect cleanup', 'act'],
    snippet: raceSrc,
    gotchas: [
      "Resolve inside `await act(async () => …)` so React flushes the resulting state update before you assert.",
      'Real delays such as `setTimeout(…, 100)` make race tests slow and flaky. Deferred promises are deterministic.',
      'An `AbortController` in the effect cleanup also cancels the request itself, not just its result.',
    ],
  },
  {
    id: 'testing-render-hook',
    section: 'testing',
    title: 'renderHook for custom hooks',
    summary: 'Test a hook without a throwaway component: `renderHook` returns `result.current`, `rerender(newProps)` and supports a `wrapper` for providers.',
    tags: ['renderHook', 'custom hooks', 'act', 'wrapper', 'context'],
    snippet: renderHookSrc,
    gotchas: [
      "Don't destructure `result.current` early. Read it after each `act` to see the latest value.",
      'Test hooks through a real component when their behaviour depends on the DOM, such as refs, focus or events.',
    ],
  },
  {
    id: 'testing-a11y-assertions',
    section: 'testing',
    title: 'Accessibility assertions',
    summary: 'Use jest-dom to assert what assistive tech sees: `toHaveAccessibleName`, `toHaveAccessibleDescription`, ARIA state via `toHaveAttribute`, and `toBeInvalid`.',
    tags: ['jest-dom', 'toHaveAccessibleName', 'aria-expanded', 'aria-describedby', 'a11y'],
    snippet: a11ySrc,
    gotchas: [
      'ARIA attributes are strings: assert `\'true\'`/`\'false\'`. React renders `aria-expanded={false}` as `"false"` and does not drop it.',
      'Querying `getByRole(..., { expanded: true })` is a concise alternative to asserting the attribute.',
    ],
  },
];
