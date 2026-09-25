import { useEffect, useId, useRef, useState } from 'react';
import { laneWindows, useTimeline, type LaneKey, type TimelineEvent } from './useTimeline';
import './TimelineVisualizer.css';

interface LaneInfo {
  key: LaneKey;
  label: string;
  hint: string;
}

export const LANES: readonly LaneInfo[] = [
  { key: 'raw', label: 'Raw events', hint: 'every click / keystroke' },
  { key: 'trailing', label: 'debounce · trailing', hint: 'once, after the burst goes quiet' },
  { key: 'leading', label: 'debounce · leading', hint: 'instantly, then ignores the burst' },
  { key: 'both', label: 'debounce · leading + trailing', hint: 'instantly and after the burst' },
  { key: 'throttle', label: 'throttle', hint: 'at most once per wait, steady rhythm' },
  { key: 'raf', label: 'rAF throttle', hint: 'at most once per frame (~16 ms)' },
];

const WINDOW_MS = 6000;
const BURST: readonly number[] = [
  ...Array.from({ length: 12 }, (_, i) => i * 70), // fast burst
  ...Array.from({ length: 5 }, (_, i) => 1800 + i * 240), // slower taps
  3600, // lone click
];

export interface TimelineVisualizerProps {
  /** Which lanes to show (defaults to all). `raw` is always shown. */
  lanes?: readonly LaneKey[];
  initialWait?: number;
}

export function TimelineVisualizer({ lanes, initialWait = 300 }: TimelineVisualizerProps) {
  const [wait, setWait] = useState(initialWait);
  const { events, fire, clear, version } = useTimeline(wait);
  const [paused, setPaused] = useState(false);
  const [now, setNow] = useState(() => performance.now());
  const [origin, setOrigin] = useState(() => performance.now());
  const counter = useRef(0);
  const burstTimers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const [text, setText] = useState('');
  const ids = useId();

  const shown = LANES.filter((l) => l.key === 'raw' || !lanes || lanes.includes(l.key));
  const lastEvent = events.at(-1)?.t ?? -Infinity;
  // Keep scrolling until every limiter has had time to settle, then freeze so the burst can be studied.
  const settleAt = lastEvent + Math.max(wait * 2, 800);
  const live = !paused && now < settleAt;

  useEffect(() => {
    if (paused) return;
    let frame = requestAnimationFrame(function tick() {
      const t = performance.now();
      setNow(t);
      if (t < settleAt) frame = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(frame);
  }, [paused, settleAt, version]);

  useEffect(() => () => burstTimers.current.forEach(clearTimeout), []);

  const emit = (value: string) => fire(value);
  const onMash = () => emit(`click #${++counter.current}`);
  const playBurst = () => {
    burstTimers.current.forEach(clearTimeout);
    burstTimers.current = BURST.map((delay, i) => setTimeout(() => emit(`burst #${i + 1}`), delay));
  };
  const onClear = () => {
    burstTimers.current.forEach(clearTimeout);
    counter.current = 0;
    clear();
    const t = performance.now();
    setOrigin(t);
    setNow(t);
  };

  const start = now - WINDOW_MS;
  const pct = (t: number) => ((t - start) / WINDOW_MS) * 100;
  const visible = (t: number) => t >= start - 200 && t <= now + 1;

  const ticks: number[] = [];
  for (let s = Math.ceil((start - origin) / 1000); origin + s * 1000 <= now; s++) {
    if (s >= 0) ticks.push(s);
  }

  const byLane = new Map<LaneKey, TimelineEvent[]>();
  for (const e of events) {
    const list = byLane.get(e.lane);
    if (list) list.push(e);
    else byLane.set(e.lane, [e]);
  }

  return (
    <div className="tv">
      <div className="tv-controls">
        <button type="button" className="btn btn-primary tv-mash" onClick={onMash}>
          Mash me
        </button>
        <label className="tv-field">
          <span>Type here</span>
          <input
            type="text"
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              emit(JSON.stringify(e.target.value));
            }}
            placeholder="search…"
          />
        </label>
        <button type="button" className="btn" onClick={playBurst}>
          Play sample burst
        </button>
        <label className="tv-field tv-wait">
          <span>
            wait <output htmlFor={`${ids}-wait`}>{wait} ms</output>
          </span>
          <input
            id={`${ids}-wait`}
            type="range"
            min={50}
            max={1500}
            step={50}
            value={wait}
            onChange={(e) => setWait(Number(e.target.value))}
          />
        </label>
        <button type="button" className="btn" aria-pressed={paused} onClick={() => setPaused((p) => !p)}>
          {paused ? 'Resume' : 'Pause'}
        </button>
        <button type="button" className="btn" onClick={onClear}>
          Clear
        </button>
      </div>

      <div className="tv-status" aria-hidden="true">
        <span className={`tv-dot${live ? ' tv-dot-live' : ''}`} />
        {paused ? 'paused' : live ? 'live' : 'frozen — interact to continue'}
        <span className="tv-scale">
          <span className="tv-scale-bar" style={{ width: `${(wait / WINDOW_MS) * 100}%` }} />
          wait = {wait} ms
        </span>
      </div>

      <div className="tv-grid" role="group" aria-label={`Timeline of the last ${WINDOW_MS / 1000} seconds`}>
        {shown.map((lane) => {
          const laneEvents = byLane.get(lane.key) ?? [];
          const windows = laneWindows(events, lane.key).filter(([s, e]) => e >= start && s <= now);
          const last = laneEvents.at(-1);
          return (
            <div key={lane.key} className="tv-lane" data-lane={lane.key}>
              <div className="tv-label">
                <strong>{lane.label}</strong>
                <span className="tv-hint">{lane.hint}</span>
              </div>
              <div
                className="tv-track"
                role="img"
                aria-label={`${lane.label}: ${laneEvents.length} ${laneEvents.length === 1 ? 'call' : 'calls'}`}
              >
                {ticks.map((s) => (
                  <span key={s} className="tv-tick" style={{ left: `${pct(origin + s * 1000)}%` }} />
                ))}
                {windows.map(([s, e]) => (
                  <span
                    key={s}
                    className="tv-window"
                    style={{ left: `${Math.max(0, pct(s))}%`, width: `${Math.max(0, pct(Math.min(e, now)) - Math.max(0, pct(s)))}%` }}
                  />
                ))}
                {laneEvents.filter((e) => visible(e.t)).map((e, i) => (
                  <span key={`${e.t}-${i}`} className="tv-mark" style={{ left: `${pct(e.t)}%` }} title={e.value} />
                ))}
              </div>
              <div className="tv-stat">
                <span className="tv-count" data-testid={`count-${lane.key}`}>
                  {laneEvents.length}
                </span>
                <span className="tv-last" title={last?.value}>
                  {last?.value ?? '—'}
                </span>
              </div>
            </div>
          );
        })}
        <div className="tv-axis" aria-hidden="true">
          {ticks.map((s) => (
            <span key={s} style={{ left: `${pct(origin + s * 1000)}%` }}>
              {s}s
            </span>
          ))}
        </div>
      </div>
      <p className="tv-legend">
        Dots are calls; shaded bars show when a debounce timer is armed (resets on every raw event) or when
        throttle is locked out. Try a fast burst, then slow taps just under and just over the wait.
      </p>
    </div>
  );
}

export const TimelineDemo = () => <TimelineVisualizer />;
export const TrailingDemo = () => <TimelineVisualizer lanes={['trailing']} />;
export const LeadingDemo = () => <TimelineVisualizer lanes={['leading']} />;
export const LeadingTrailingDemo = () => <TimelineVisualizer lanes={['leading', 'both', 'trailing']} />;
export const ThrottleDemo = () => <TimelineVisualizer lanes={['throttle', 'trailing']} />;
export const RafDemo = () => <TimelineVisualizer lanes={['raf', 'throttle']} initialWait={100} />;
