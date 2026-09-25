import type { Entry } from './types';
import debounceSrc from '../snippets/timing/debounce.ts?raw';
import debounceLeadingSrc from '../snippets/timing/debounceLeading.ts?raw';
import debounceLeadingTrailingSrc from '../snippets/timing/debounceLeadingTrailing.ts?raw';
import debounceWithControlsSrc from '../snippets/timing/debounceWithControls.ts?raw';
import throttleSrc from '../snippets/timing/throttle.ts?raw';
import rafThrottleSrc from '../snippets/timing/rafThrottle.ts?raw';
import whichSrc from '../snippets/timing/whichRateLimiter.ts?raw';
import {
  LeadingDemo,
  LeadingTrailingDemo,
  RafDemo,
  ThrottleDemo,
  TimelineDemo,
  TrailingDemo,
} from '../demos/timing/TimelineVisualizer';


/** debounce / throttle entries + the timeline visualizer (owned separately from timing.ts). */
export const rateLimitEntries: Entry[] = [
  {
    id: 'timing-visualizer',
    section: 'timing',
    title: 'Debounce vs throttle: timeline visualizer',
    summary:
      'Mash the button or type: every raw event is fed through the real debounce / throttle implementations below and plotted on one shared time axis. Drag the wait slider to see how each strategy reacts.',
    tags: ['debounce', 'throttle', 'visualizer', 'demo', 'rate limit', 'requestAnimationFrame'],
    snippet: whichSrc,
    Demo: TimelineDemo,
    demoOpen: true,
  },
  {
    id: 'timing-debounce-trailing',
    section: 'timing',
    title: 'debounce (trailing)',
    summary: 'Run once, `wait` ms after the last call of a burst, with the latest arguments. The default meaning of "debounce".',
    tags: ['debounce', 'trailing', 'search', 'autosave', 'rate limit'],
    snippet: debounceSrc,
    gotchas: [
      'Creating the debounced function inside a React render makes a new timer every render — it never debounces. Create it once (useMemo/useRef) or use a hook.',
      'A continuous stream (holding a key) never fires until it stops. If you need progress, use throttle or leading+trailing.',
      'No cancel: a pending call can fire after unmount. Use the cancel/flush variant in components.',
    ],
    Demo: TrailingDemo,
  },
  {
    id: 'timing-debounce-leading',
    section: 'timing',
    title: 'debounce (leading)',
    summary: 'Fire immediately on the first call, then ignore calls until there has been `wait` ms of quiet. Great for double-click / double-submit guards.',
    tags: ['debounce', 'leading', 'immediate', 'double submit'],
    snippet: debounceLeadingSrc,
    gotchas: [
      'The final value of a burst is dropped — wrong for search boxes, where the last keystroke matters most.',
      'Every ignored call extends the quiet period, so steady clicking faster than `wait` only ever fires once.',
    ],
    Demo: LeadingDemo,
  },
  {
    id: 'timing-debounce-leading-trailing',
    section: 'timing',
    title: 'debounce (leading + trailing)',
    summary: 'Fire on the first call for instant feedback and once more after the burst, but only if something changed during it.',
    tags: ['debounce', 'leading', 'trailing', 'lodash'],
    snippet: debounceLeadingTrailingSrc,
    gotchas: [
      'A naive implementation fires twice for a single call (leading + trailing with the same args). Track whether calls arrived during the burst.',
    ],
    Demo: LeadingTrailingDemo,
  },
  {
    id: 'timing-debounce-controls',
    section: 'timing',
    title: 'debounce with cancel / flush / pending',
    summary: 'A debounce that exposes `cancel()` (drop the pending call), `flush()` (run it now) and `pending()`. What you want for autosave and component cleanup.',
    tags: ['debounce', 'cancel', 'flush', 'pending', 'autosave', 'cleanup'],
    snippet: debounceWithControlsSrc,
    gotchas: [
      'Call `cancel()` in effect cleanup, or a pending call runs against an unmounted component / stale route.',
      'Call `flush()` on `beforeunload` / `pagehide` so the user’s last edit is not lost.',
      '`Object.assign` on the arrow keeps the call signature and methods in one typed value (`Debounced<A>`).',
    ],
  },
  {
    id: 'timing-throttle',
    section: 'timing',
    title: 'throttle (leading + trailing)',
    summary: 'Run at most once per `wait` ms: immediately, then at the end of each window with the latest args, so the final state is never lost.',
    tags: ['throttle', 'rate limit', 'scroll', 'drag', 'leading', 'trailing'],
    snippet: throttleSrc,
    gotchas: [
      'A leading-only throttle drops the last event — e.g. a scroll position that stops mid-window is never reported.',
      'Throttle measures from the last *run*, not the last call; debounce measures from the last call. That is the whole difference.',
      '`Date.now()` can jump with clock changes; `performance.now()` is monotonic if that matters.',
    ],
    Demo: ThrottleDemo,
  },
  {
    id: 'timing-raf-throttle',
    section: 'timing',
    title: 'requestAnimationFrame throttle',
    summary: 'Coalesce scroll / resize / pointermove handlers to at most one run per frame with the latest args — no magic `wait` number needed.',
    tags: ['throttle', 'requestAnimationFrame', 'raf', 'scroll', 'resize', 'performance'],
    snippet: rafThrottleSrc,
    gotchas: [
      'rAF pauses in background tabs, so pending work waits until the tab is visible again.',
      'Register scroll listeners as `{ passive: true }` so the browser does not wait on them before scrolling.',
      'Test with `vi.useFakeTimers({ toFake: [\'requestAnimationFrame\', …] })` and `vi.advanceTimersToNextFrame()`.',
    ],
    Demo: RafDemo,
  },
];
