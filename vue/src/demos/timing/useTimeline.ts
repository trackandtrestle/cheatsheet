import { onScopeDispose, shallowRef, triggerRef, watch, type Ref } from 'vue';
// The real snippet implementations, shared with the React edition.
import { debounce } from '../../../../src/snippets/timing/debounce';
import { debounceLeading } from '../../../../src/snippets/timing/debounceLeading';
import { debounceLeadingTrailing } from '../../../../src/snippets/timing/debounceLeadingTrailing';
import { throttle } from '../../../../src/snippets/timing/throttle';
import { rafThrottle } from '../../../../src/snippets/timing/rafThrottle';

export type LaneKey = 'raw' | 'trailing' | 'leading' | 'both' | 'throttle' | 'raf';

export interface TimelineEvent {
  lane: LaneKey;
  /** ms, from performance.now() */
  t: number;
  value: string;
  /** the wait in effect when this event was recorded */
  wait: number;
}

/**
 * Wires debounce / throttle to a shared event log. The limiters are rebuilt whenever `wait`
 * changes; calls already scheduled still land.
 */
export function useTimeline(wait: Ref<number>) {
  // shallowRef + triggerRef: append in place without making every event deeply reactive.
  const events = shallowRef<TimelineEvent[]>([]);
  let disposed = false;

  const record = (lane: LaneKey, value: string, w: number) => {
    if (disposed) return;
    events.value.push({ lane, t: performance.now(), value, wait: w });
    triggerRef(events);
  };

  const build = (w: number) => ({
    trailing: debounce((v: string) => record('trailing', v, w), w),
    leading: debounceLeading((v: string) => record('leading', v, w), w),
    both: debounceLeadingTrailing((v: string) => record('both', v, w), w),
    throttle: throttle((v: string) => record('throttle', v, w), w),
    raf: rafThrottle((v: string) => record('raf', v, w)),
  });

  let limiters = build(wait.value);
  watch(wait, (w) => {
    limiters.throttle.cancel();
    limiters.raf.cancel();
    limiters = build(w);
  });
  onScopeDispose(() => {
    disposed = true;
    limiters.throttle.cancel();
    limiters.raf.cancel();
  });

  const fire = (value: string) => {
    record('raw', value, wait.value);
    limiters.trailing(value);
    limiters.leading(value);
    limiters.both(value);
    limiters.throttle(value);
    limiters.raf(value);
  };

  const clear = () => {
    events.value = [];
  };

  return { events, fire, clear };
}

/** Merge overlapping [start, end] intervals. Input need not be sorted. */
export function mergeIntervals(intervals: readonly (readonly [number, number])[]): [number, number][] {
  const out: [number, number][] = [];
  for (const [s, e] of intervals.toSorted((a, b) => a[0] - b[0])) {
    const last = out.at(-1);
    if (last && s <= last[1]) last[1] = Math.max(last[1], e);
    else out.push([s, e]);
  }
  return out;
}

/**
 * Shaded windows per lane: debounces are armed for `wait` after every raw call;
 * throttle is locked for `wait` after each fire (kept separate so the rhythm stays visible).
 */
export function laneWindows(events: readonly TimelineEvent[], lane: LaneKey): [number, number][] {
  if (lane === 'trailing' || lane === 'leading' || lane === 'both') {
    return mergeIntervals(events.filter((e) => e.lane === 'raw').map((e) => [e.t, e.t + e.wait] as const));
  }
  if (lane === 'throttle') return events.filter((e) => e.lane === 'throttle').map((e) => [e.t, e.t + e.wait]);
  return [];
}
