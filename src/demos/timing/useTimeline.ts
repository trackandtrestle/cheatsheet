import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { debounce } from '../../snippets/timing/debounce';
import { debounceLeading } from '../../snippets/timing/debounceLeading';
import { debounceLeadingTrailing } from '../../snippets/timing/debounceLeadingTrailing';
import { throttle } from '../../snippets/timing/throttle';
import { rafThrottle } from '../../snippets/timing/rafThrottle';

export type LaneKey = 'raw' | 'trailing' | 'leading' | 'both' | 'throttle' | 'raf';

export interface TimelineEvent {
  lane: LaneKey;
  /** ms, from performance.now() */
  t: number;
  value: string;
  /** the wait in effect when this event was recorded */
  wait: number;
}

export interface Timeline {
  events: readonly TimelineEvent[];
  /** Feed one raw event through every rate limiter. */
  fire: (value: string) => void;
  clear: () => void;
  /** Bumps whenever `events` changes, so consumers re-render. */
  version: number;
}

const now = () => performance.now();

/**
 * Wires the real snippet implementations (debounce, throttle, …) to a shared event log.
 * Every limiter is rebuilt when `wait` changes; calls already scheduled still land.
 */
export function useTimeline(wait: number): Timeline {
  const events = useRef<TimelineEvent[]>([]);
  const [version, setVersion] = useState(0);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const record = useCallback(
    (lane: LaneKey, value: string) => {
      if (!mounted.current) return;
      events.current.push({ lane, t: now(), value, wait });
      setVersion((v) => v + 1);
    },
    [wait],
  );

  const limiters = useMemo(() => {
    const t = throttle((v: string) => record('throttle', v), wait);
    const r = rafThrottle((v: string) => record('raf', v));
    return {
      trailing: debounce((v: string) => record('trailing', v), wait),
      leading: debounceLeading((v: string) => record('leading', v), wait),
      both: debounceLeadingTrailing((v: string) => record('both', v), wait),
      throttle: t,
      raf: r,
      cancel: () => {
        t.cancel();
        r.cancel();
      },
    };
  }, [record, wait]);

  useEffect(() => limiters.cancel, [limiters]);

  const fire = useCallback(
    (value: string) => {
      record('raw', value);
      limiters.trailing(value);
      limiters.leading(value);
      limiters.both(value);
      limiters.throttle(value);
      limiters.raf(value);
    },
    [limiters, record],
  );

  const clear = useCallback(() => {
    events.current = [];
    setVersion((v) => v + 1);
  }, []);

  return { events: events.current, fire, clear, version };
}

/** Merge overlapping [start, end] intervals. Input need not be sorted. */
export function mergeIntervals(intervals: readonly (readonly [number, number])[]): [number, number][] {
  const sorted = intervals.toSorted((a, b) => a[0] - b[0]);
  const out: [number, number][] = [];
  for (const [s, e] of sorted) {
    const last = out.at(-1);
    if (last && s <= last[1]) last[1] = Math.max(last[1], e);
    else out.push([s, e]);
  }
  return out;
}

/**
 * Shaded "timer armed" / "locked out" windows per lane:
 * debounces are armed for `wait` after every raw call; throttle is locked for `wait` after each fire.
 */
export function laneWindows(events: readonly TimelineEvent[], lane: LaneKey): [number, number][] {
  if (lane === 'trailing' || lane === 'leading' || lane === 'both') {
    return mergeIntervals(events.filter((e) => e.lane === 'raw').map((e) => [e.t, e.t + e.wait] as const));
  }
  if (lane === 'throttle') {
    return mergeIntervals(events.filter((e) => e.lane === 'throttle').map((e) => [e.t, e.t + e.wait] as const));
  }
  return [];
}
