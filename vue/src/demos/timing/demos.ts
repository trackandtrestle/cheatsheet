import { defineComponent, h } from 'vue';
import TimelineVisualizer from './TimelineVisualizer.vue';
import type { LaneKey } from './useTimeline';

const preset = (name: string, lanes?: readonly LaneKey[], initialWait?: number) =>
  defineComponent({ name, setup: () => () => h(TimelineVisualizer, { lanes, initialWait }) });

export const TimelineDemo = preset('TimelineDemo');
export const TrailingDemo = preset('TrailingDemo', ['trailing']);
export const LeadingDemo = preset('LeadingDemo', ['leading']);
export const LeadingTrailingDemo = preset('LeadingTrailingDemo', ['leading', 'both', 'trailing']);
export const ThrottleDemo = preset('ThrottleDemo', ['throttle', 'trailing']);
export const RafDemo = preset('RafDemo', ['raf', 'throttle'], 100);
