import type { Entry } from './types';
import setTimeoutSrc from '../snippets/timing/setTimeout.ts?raw';

export const timingEntries: Entry[] = [
  {
    id: 'timing-settimeout',
    section: 'timing',
    title: 'setTimeout / clearTimeout',
    summary: 'Schedule a callback once after a delay and return a canceller. Even a 0 ms timeout runs after all queued microtasks.',
    tags: ['setTimeout', 'clearTimeout', 'event loop', 'microtask'],
    snippet: setTimeoutSrc,
    gotchas: [
      'Type the handle as `ReturnType<typeof setTimeout>`, not `number` — Node returns a Timeout object.',
      'Browsers clamp nested timeouts to ≥4 ms and throttle background tabs to ≥1 s.',
      'The delay is a minimum, not a guarantee: a busy main thread delays the callback.',
    ],
  },
];
