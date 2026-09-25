# TS + React Cheat Sheet

A searchable TypeScript + React reference: 150 entries across 9 sections. Every snippet is a real
file that type-checks and, for non-UI code, is proven by a colocated test.

```sh
npm install
npm run dev        # http://localhost:5173
npm test           # vitest (jsdom)
npm run typecheck  # tsc --noEmit
npm run build      # typecheck + production build
```

- `/` focuses search (fuzzy over title, tags, summary and code); `Esc` clears it.
- `#<entry-id>` deep-links to an entry; each card has copy, gotchas and (often) a live demo.
- Showcase: **Timing → Debounce vs throttle: timeline visualizer**.

Adding an entry: see [docs/AUTHORING.md](docs/AUTHORING.md). Design calls: [DECISIONS.md](DECISIONS.md).
