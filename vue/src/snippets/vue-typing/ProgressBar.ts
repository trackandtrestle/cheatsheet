import { defineComponent, h, type ExtractPublicPropTypes, type PropType } from 'vue';

export interface Segment {
  label: string;
  value: number;
}

// Runtime props (Options API / defineComponent): `PropType<T>` narrows the
// constructor's broad type (`Array` -> Segment[], `String` -> a union).
const progressBarProps = {
  segments: { type: Array as PropType<Segment[]>, required: true },
  size: {
    type: String as PropType<'sm' | 'md'>,
    default: 'md',
    validator: (v: string) => ['sm', 'md'].includes(v),
  },
  // For `type: Function` the default IS the function (not a factory).
  format: { type: Function as PropType<(pct: number) => string>, default: (pct: number) => `${pct}%` },
} as const;

export type ProgressBarProps = ExtractPublicPropTypes<typeof progressBarProps>;

export const ProgressBar = defineComponent({
  name: 'ProgressBar',
  props: progressBarProps,
  setup(props) {
    const pct = () => Math.round(props.segments.reduce((sum, s) => sum + s.value, 0));
    return () =>
      h('div', { role: 'progressbar', 'aria-valuenow': pct(), class: `progress-${props.size}` }, props.format(pct()));
  },
});
