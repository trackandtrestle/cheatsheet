# Decisions

Calls made while building this, in no particular order.

## Stack & tooling
- **prism-react-renderer over shiki.** Synchronous, ~no WASM/grammar loading, one `tsx` grammar
  covers every snippet. Themes: `github` (light) / `vsDark` (dark).
- **Latest toolchain as installed** (React 19.3, Vite 8, Vitest 5, TypeScript 7). Worked as-is.
- **`strict` + `noUncheckedIndexedAccess` + `verbatimModuleSyntax`**, but `noUnusedLocals/Parameters`
  are **off**: illustrative snippets sometimes declare a value only to show its type.
- **Bundle-size warning limit raised to 800 kB.** All snippet source must ship up front so search can
  scan code instantly (~180 kB gzip). Not worth code-splitting a single-page reference.

## Architecture
- Entries are data (`src/content/<section>.ts`), snippets are real files displayed via `?raw`, and
  `tsc --noEmit` type-checks every snippet and test.
- `src/snippets/snippets.test.ts` enforces the quality bar in CI: every snippet < 40 lines, no `any`
  (except the deliberate `unknownVsAny.ts` contrast), a colocated test for every non-UI `.ts` snippet,
  and unique `section-slug` ids.
- The Testing Library section's snippets **are** `.test.tsx` files, so they run in the suite.
- Live demos live in `src/demos/<section>/` and are **not** shown as code; they import the real
  snippet so the demo proves the snippet. Demos mount lazily when opened, inside an error boundary.
- `Entry.demoOpen` (extra optional field) opens a demo by default and renders it above the code;
  only the timeline visualizer uses it.
- Debounce/throttle entries live in `timing-rate-limit.ts` (spread into `timing.ts`) so the visualizer
  and its snippets could be built in parallel with the rest of the section.
- Complex widget hooks (combobox, listbox, focus trap) are written compactly to fit the 40-line cap;
  the demo wrapper holds the markup.

## UI
- Search is a small hand-written fuzzy matcher (no dependency): every term must match; weights
  title 10 > tags 6 > summary 3 > code 1; code is matched by substring only (fuzzy over code matches
  almost everything). Results stay grouped by section, ranked within each section.
- `useDeferredValue` keeps typing responsive while 150 highlighted cards filter.
- Hash routing: `#<entry-id>` deep-links (and focuses) a card; if the current search hides the target,
  the search is cleared. Section links use `#section-<id>`.
- Theme follows `prefers-color-scheme` until the user toggles; the override persists in
  `localStorage` and is applied before first paint by an inline script.
- `/` focuses search (ignored while typing in a field), `Esc` clears it, `Esc` closes the mobile nav.
- Summaries and gotchas render `` `backticks` `` as inline `<code>`.

## Timeline visualizer
- Feeds each raw event through the **actual** snippet implementations (`debounce`, `debounceLeading`,
  `debounceLeadingTrailing`, `throttle`, `rafThrottle`) and plots them on a shared 6 s axis.
- Shaded bars show when a debounce timer is armed (union of `[raw, raw + wait]`) and each throttle
  lock-out window. The view scrolls while anything can still fire, then freezes so a burst can be
  studied; Pause freezes manually. A scripted "Play sample burst" makes it usable without mashing.
- Each debounce/throttle entry reuses the visualizer with a subset of lanes.
- Its tests use `fireEvent` + fake timers (incl. rAF/performance) to stay fully synchronous.

## Content conventions (from the section authors)
- Snippets are self-contained (no cross-snippet imports) so they copy-paste cleanly; e.g. the timing
  hooks re-implement debounce rather than importing it.
- Type-level claims are proven with `expectTypeOf` and `// @ts-expect-error` (an unused one is itself an
  error, so negative cases must really fail to compile).
- Promise combinators get one entry each; `takeLatest` rejects superseded calls with a `StaleError`
  (and aborts them) instead of leaving them pending forever.
- `retry` defaults to full jitter; `memoizeAsync` caches the promise (in-flight dedupe) and evicts on
  rejection only if the entry is still that promise.
- Fake timers + user-event in Vitest need `vi.useFakeTimers({ shouldAdvanceTime: true })` **and**
  `userEvent.setup({ advanceTimers: vi.advanceTimersByTime })`; RTL only auto-advances Jest's fake timers.
- React 19 idioms: `ref` as a plain prop, `<Context value>`, `useEffectEvent` for latest-callback
  reads, callback refs returning cleanup, `SubmitEvent` for forms (`FormEvent` is deprecated in
  @types/react 19.3). `forwardRef` kept as a separate legacy entry.
- Immutable helpers return the same reference for no-op updates so React bails out; Set/Map state is
  typed `ReadonlySet` / `ReadonlyMap` so mutation is a compile error.
- Abort errors are detected by `error.name === 'AbortError'` (jsdom's `DOMException` fails `instanceof Error`).
