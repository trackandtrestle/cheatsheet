<script setup lang="ts">
import { computed, onBeforeUnmount, ref, useId, watch } from 'vue';
import { laneWindows, useTimeline, type LaneKey, type TimelineEvent } from './useTimeline';

const LANES: readonly { key: LaneKey; label: string; hint: string }[] = [
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

const { lanes, initialWait = 300 } = defineProps<{
  /** Which lanes to show (defaults to all). `raw` is always shown. */
  lanes?: readonly LaneKey[];
  initialWait?: number;
}>();

const wait = ref(initialWait);
const { events, fire, clear } = useTimeline(wait);
const paused = ref(false);
const now = ref(performance.now());
const origin = ref(performance.now());
const text = ref('');
const waitId = useId();
let counter = 0;
let burstTimers: ReturnType<typeof setTimeout>[] = [];
let frame: number | undefined;

const shown = computed(() => LANES.filter((l) => l.key === 'raw' || !lanes || lanes.includes(l.key)));
// Keep scrolling until every limiter has had time to settle, then freeze so the burst can be studied.
const settleAt = computed(() => (events.value.at(-1)?.t ?? -Infinity) + Math.max(wait.value * 2, 800));
const live = computed(() => !paused.value && now.value < settleAt.value);

function tick() {
  frame = undefined;
  now.value = performance.now();
  if (!paused.value && now.value < settleAt.value) frame = requestAnimationFrame(tick);
}
function ensureLoop() {
  if (frame === undefined && !paused.value) frame = requestAnimationFrame(tick);
}
watch([events, paused], ensureLoop);
onBeforeUnmount(() => {
  if (frame !== undefined) cancelAnimationFrame(frame);
  burstTimers.forEach(clearTimeout);
});

const onMash = () => fire(`click #${++counter}`);
const onType = () => fire(JSON.stringify(text.value));
function playBurst() {
  burstTimers.forEach(clearTimeout);
  burstTimers = BURST.map((delay, i) => setTimeout(() => fire(`burst #${i + 1}`), delay));
}
function onClear() {
  burstTimers.forEach(clearTimeout);
  counter = 0;
  clear();
  origin.value = now.value = performance.now();
}

const start = computed(() => now.value - WINDOW_MS);
const pct = (t: number) => ((t - start.value) / WINDOW_MS) * 100;
const ticks = computed(() => {
  const out: number[] = [];
  for (let s = Math.max(0, Math.ceil((start.value - origin.value) / 1000)); origin.value + s * 1000 <= now.value; s++) out.push(s);
  return out;
});
const byLane = computed(() => Map.groupBy(events.value, (e) => e.lane));
const laneEvents = (k: LaneKey): TimelineEvent[] => byLane.value.get(k) ?? [];
const visible = (e: TimelineEvent) => e.t >= start.value - 200 && e.t <= now.value + 1;
const windowsFor = (k: LaneKey) =>
  laneWindows(events.value, k)
    .filter(([s, e]) => e >= start.value && s <= now.value)
    .map(([s, e]) => {
      const left = Math.max(0, pct(s));
      return { key: s, left, width: Math.max(0, pct(Math.min(e, now.value)) - left) };
    });
</script>

<template>
  <div class="tv">
    <div class="tv-controls">
      <button type="button" class="btn btn-primary tv-mash" @click="onMash">Mash me</button>
      <label class="tv-field">
        <span>Type here</span>
        <input v-model="text" type="text" placeholder="search…" @input="onType" />
      </label>
      <button type="button" class="btn" @click="playBurst">Play sample burst</button>
      <label class="tv-field tv-wait">
        <span>wait <output :for="waitId">{{ wait }} ms</output></span>
        <input :id="waitId" v-model.number="wait" type="range" min="50" max="1500" step="50" />
      </label>
      <button type="button" class="btn" :aria-pressed="paused" @click="paused = !paused">
        {{ paused ? 'Resume' : 'Pause' }}
      </button>
      <button type="button" class="btn" @click="onClear">Clear</button>
    </div>

    <div class="tv-status" aria-hidden="true">
      <span class="tv-dot" :class="{ 'tv-dot-live': live }" />
      {{ paused ? 'paused' : live ? 'live' : 'frozen — interact to continue' }}
      <span class="tv-scale">
        <span class="tv-scale-bar" :style="{ width: `${(wait / WINDOW_MS) * 100}%` }" />
        wait = {{ wait }} ms
      </span>
    </div>

    <div class="tv-grid" role="group" :aria-label="`Timeline of the last ${WINDOW_MS / 1000} seconds`">
      <div v-for="lane in shown" :key="lane.key" class="tv-lane" :data-lane="lane.key">
        <div class="tv-label">
          <strong>{{ lane.label }}</strong>
          <span class="tv-hint">{{ lane.hint }}</span>
        </div>
        <div
          class="tv-track"
          role="img"
          :aria-label="`${lane.label}: ${laneEvents(lane.key).length} ${laneEvents(lane.key).length === 1 ? 'call' : 'calls'}`"
        >
          <span v-for="s in ticks" :key="`t${s}`" class="tv-tick" :style="{ left: `${pct(origin + s * 1000)}%` }" />
          <span
            v-for="w in windowsFor(lane.key)"
            :key="`w${w.key}`"
            class="tv-window"
            :style="{ left: `${w.left}%`, width: `${w.width}%` }"
          />
          <span
            v-for="(e, i) in laneEvents(lane.key).filter(visible)"
            :key="`${e.t}-${i}`"
            class="tv-mark"
            :style="{ left: `${pct(e.t)}%` }"
            :title="e.value"
          />
        </div>
        <div class="tv-stat">
          <span class="tv-count" :data-testid="`count-${lane.key}`">{{ laneEvents(lane.key).length }}</span>
          <span class="tv-last" :title="laneEvents(lane.key).at(-1)?.value">{{ laneEvents(lane.key).at(-1)?.value ?? '—' }}</span>
        </div>
      </div>
      <div class="tv-axis" aria-hidden="true">
        <span v-for="s in ticks" :key="s" :style="{ left: `${pct(origin + s * 1000)}%` }">{{ s }}s</span>
      </div>
    </div>
    <p class="tv-legend">
      Dots are calls; shaded bars show when a debounce timer is armed (resets on every raw event) or when
      throttle is locked out. Try a fast burst, then slow taps just under and just over the wait.
    </p>
  </div>
</template>

<style src="./TimelineVisualizer.css"></style>
