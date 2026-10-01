# Decisions (Vue 3 edition)

## Structure
- **Lives in `vue/` beside the React edition**, with its own `package.json` and toolchain, on the same
  branch. One repo keeps the shared snippets single-sourced.
- **Shared, not duplicated.** Arrays, Sets & Maps and TypeScript features are framework-agnostic: their
  entries are imported from `../src/content` (Sets & Maps was split into `sets-maps.data.ts` + a React
  demo wrapper for this). The plain-TS timing utilities (promises, retry, debounce/throttle, …) are
  raw-imported from `../src/snippets/timing`, where they're type-checked and tested.
- **The timeline visualizer** is a Vue port that drives the *same* shared debounce/throttle
  implementations as the React one; only the rendering and the `useTimeline` composable differ.

## Tooling
- **TypeScript 5 + `vue-tsc`** (the React edition uses TS 7; `vue-tsc` needs the JS compiler API).
  `strictTemplates` is on; a global augmentation allows `data-*` attributes on native elements.
- **Shiki** (fine-grained core + JS regex engine, `typescript` and `vue` grammars) instead of Prism,
  because `.vue` SFCs need real embedded-language highlighting. Both themes are baked in as CSS
  variables, so the theme toggle never re-highlights. Grammars load lazily.
- `vite.single.config.ts` produces a one-file build (lazy chunks inlined) for publishing as a page.
- `src/snippets/snippets.test.ts` enforces: < 40 lines (template included), no `any`, a colocated test
  for every `.ts` snippet, `lang: 'vue'` on exactly the SFC entries, unique `section-slug` ids.

## Shell
- Same UX as the React edition: `/` focuses search, Esc clears it / closes the mobile nav, `#entry-id`
  deep links (clearing a search that hides the target), copy button, gotchas, lazy demos in an
  `onErrorCaptured` boundary. Search runs on a 60 ms `refDebounced` copy of the query.
- Accent is Vue green with green-biased neutrals; layout and tokens otherwise match the React edition.
- Only the visualizer opens its demo by default (section authors' `demoOpen` flags were removed).

## Content conventions (from the section authors)
- Vue 3.5 idioms throughout: reactive props destructure, `defineModel`, `useTemplateRef`, `useId`,
  `onWatcherCleanup`, `generic="T"`, `deep: 1`.
- Composables clean up with `onScopeDispose` (works in components and bare `effectScope`s), accept
  `MaybeRefOrGetter` inputs via `toValue`, return plain objects of refs, and guard `window` for SSR.
  Snippets stay self-contained, so small patterns (event listeners) are repeated rather than imported.
- Reactivity is tested in a fresh `effectScope()` per test; composables with lifecycle needs are tested by
  mounting a tiny `defineComponent`. Test components use `h()` (the runtime-only build has no template
  compiler).
- `useFetch` takes an injectable fetcher and a required `parse(json: unknown) => T`; stale requests are
  aborted via `onWatcherCleanup`, registered before the first `await`.
- Vue 3.5 has no `ComponentProps` export, so `vue-typing/componentProps.ts` defines a small helper;
  generic SFC props are extracted with `Parameters<typeof Comp<T>>[0]`.
- `<KeepAlive>` + `v-if`: put the `v-if` on `<KeepAlive>`, not the child, or every branch shares a key.
- Widget composables (combobox, listbox, roving tabindex, focus trap) return computed binding objects
  to spread with `v-bind`; roving tabindex finds items in DOM order because `v-for` template-ref arrays
  aren't guaranteed to follow source order.
- Fake timers + user-event need `shouldAdvanceTime: true` **and** `advanceTimers`; demos and the
  visualizer tests use `fireEvent` to stay deterministic.
