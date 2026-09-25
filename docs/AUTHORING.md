# Authoring entries

Every entry is **data** in `src/content/<section>.ts` and every snippet is a **real source file**.

## Files

```
src/snippets/<section>/<name>.ts        # snippet (non-UI)  -> displayed via ?raw
src/snippets/<section>/<name>.test.ts   # proves the behaviour shown (required for non-UI)
src/snippets/<section>/<Name>.tsx       # UI snippet (component / hook)
src/snippets/<section>/<Name>.test.tsx  # optional but encouraged (renderHook / RTL)
src/demos/<section>/<Name>Demo.tsx      # optional live demo wrapper (not displayed as code)
src/content/<section>.ts                # the Entry[] for that section
```

Section ids: `timing`, `arrays`, `sets-maps`, `immutable-state`, `ts-features`,
`react-typing`, `react-features`, `testing`, `dom-a11y`.

## Entry shape (`src/content/types.ts`)

```ts
import debounceSrc from '../snippets/timing/debounce.ts?raw';
import { DebounceDemo } from '../demos/timing/DebounceDemo';

{
  id: 'timing-debounce-trailing',   // `${section}-${slug}`, globally unique, URL-safe
  section: 'timing',
  title: 'debounce (trailing)',
  summary: 'One or two sentences. Inline `code` in backticks is fine.',
  tags: ['debounce', 'rate limit'], // lowercase-ish keywords that aid search
  snippet: debounceSrc,
  gotchas: ['Only where there is a real trap.'],
  Demo: DebounceDemo,               // optional
}
```

## Rules

- Snippet file **< 40 lines**, idiomatic, strictly typed, **no `any`** (use `unknown`, generics).
- Snippets must pass `tsc --noEmit` (strict, `noUncheckedIndexedAccess`, `verbatimModuleSyntax`
  -> use `import type` for types). Export what you define so it can be tested.
- Keep snippet files self-contained (only import from `react`, `react-dom`, testing libs,
  or a sibling snippet when it is the point of the entry). Readers copy them verbatim.
- Every non-UI snippet has a colocated test. Timing code uses `vi.useFakeTimers()` and
  `vi.useRealTimers()` in `afterEach`.
- Tests import from `vitest` explicitly (`import { describe, it, expect, vi } from 'vitest'`).
  jest-dom matchers are globally available. jsdom environment.
- For the Testing Library section, the snippet **is** a `.test.tsx` file: it runs as a real test.
- Demos: plain CSS via the global helpers (`.btn`, `.btn-small`, `.btn-primary`, `.demo-row`,
  `.mono`) and CSS custom properties (`--accent`, `--border`, `--surface`, `--surface-2`,
  `--muted`, `--text`). Extra styles go in a colocated `.css` file imported by the demo.
  Demos must be keyboard accessible.
