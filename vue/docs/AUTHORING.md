# Authoring entries (Vue edition)

Same model as the React edition one level up: every entry is **data** in `src/content/<section>.ts`
and every snippet is a **real source file** shown via a `?raw` import.

## Files

```
src/snippets/<section>/<name>.ts          # non-UI snippet / composable -> shown via ?raw
src/snippets/<section>/<name>.test.ts     # REQUIRED for every .ts snippet
src/snippets/<section>/<Name>.vue         # SFC snippet (shown with lang: 'vue')
src/snippets/<section>/<Name>.test.ts     # encouraged for SFCs (@testing-library/vue or @vue/test-utils)
src/demos/<section>/<Name>Demo.vue        # optional live demo wrapper (not displayed as code)
src/content/<section>.ts                  # the Entry[] for that section
```

Vue section ids: `timing`, `reactivity`, `components`, `composables`, `vue-typing`, `testing`, `dom-a11y`.
(`arrays`, `sets-maps`, `ts-features` are shared from the React edition — don't touch them.)

## Entry shape (`src/content/types.ts`)

```ts
import counterSrc from '../snippets/components/Counter.vue?raw';
import CounterDemo from '../demos/components/CounterDemo.vue';

{
  id: 'components-define-model',  // `${section}-${slug}`, unique, URL-safe
  section: 'components',
  title: 'defineModel (v-model)',
  summary: 'One or two sentences. Inline `code` in backticks renders as code.',
  tags: ['v-model', 'defineModel', 'two-way binding'],
  snippet: counterSrc,
  lang: 'vue',                     // REQUIRED for .vue snippets; omit for .ts
  gotchas: ['Only where there is a real trap.'],
  Demo: CounterDemo,               // optional; any Vue component
}
```

Framework-agnostic snippets already exist in `../src/snippets/**` (React edition, tested there).
Reuse them by raw import from content files, e.g.
`import sleepSrc from '../../../src/snippets/timing/sleep.ts?raw';` — don't re-implement.

## Rules

- Vue 3.5+ idioms: `<script setup lang="ts">`, type-based `defineProps` (reactive props destructure
  with defaults), `defineEmits` with the tuple syntax, `defineModel`, `useTemplateRef`, `useId`,
  `onWatcherCleanup`, `defineSlots`, `generic="T"`. Options API only when contrasting.
- Snippet file **< 40 lines** (including `<template>`), strictly typed, **no `any`**.
- Must pass `vue-tsc --noEmit` (strict, `strictTemplates`, `noUncheckedIndexedAccess`,
  `verbatimModuleSyntax` -> `import type` for types).
- Snippets are self-contained (import only from `vue` / test libs / a sibling snippet when that's the point).
- Every `.ts` snippet has a colocated test proving the behaviour. Test composables inside a
  component (`render`/`mount` a tiny `defineComponent`) or an `effectScope()` when lifecycle hooks
  aren't involved. Use `await nextTick()` / `flushPromises()` from `@vue/test-utils` for async DOM.
- Timing code: `vi.useFakeTimers()` + `vi.useRealTimers()` in `afterEach`. With user-event under
  fake timers you need `vi.useFakeTimers({ shouldAdvanceTime: true })` AND
  `userEvent.setup({ advanceTimers: vi.advanceTimersByTime })`, or prefer `fireEvent`.
- Tests import from `vitest` explicitly. jest-dom matchers are global. jsdom environment.
- For the Testing section the snippet **is** a `*.test.ts` file that runs in the suite.
- Demos use the global CSS helpers (`.btn`, `.btn-small`, `.btn-primary`, `.demo-row`, `.mono`)
  and tokens (`--accent`, `--accent-soft`, `--border`, `--surface`, `--surface-2`, `--muted`,
  `--text`). Extra styles: `<style scoped>` in the demo SFC. Demos must be keyboard accessible.

## Verify

```sh
cd vue && npx vue-tsc --noEmit && npx vitest run src/snippets/<section>
```
