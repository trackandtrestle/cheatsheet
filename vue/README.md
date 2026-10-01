# Vue 3 Cheat Sheet

The Vue 3 + TypeScript edition: 182 entries across 10 sections, same architecture as the React edition
one level up (every snippet is a real file, type-checked with `vue-tsc` and, for non-UI code, tested).

```sh
cd vue
npm install
npm run dev        # http://localhost:5173
npm test           # vitest (jsdom)
npm run typecheck  # vue-tsc --noEmit
npm run build      # typecheck + production build
npx vite build --config vite.single.config.ts   # one-file build in dist-single/
```

Showcase: **Timing → Debounce vs throttle: timeline visualizer**. Adding entries: [docs/AUTHORING.md](docs/AUTHORING.md).
Design calls: [DECISIONS.md](DECISIONS.md).
