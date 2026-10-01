import { defineComponent, h } from 'vue';

/** Renders `backticked` spans as <code>; everything else as plain text. */
export const RichText = defineComponent({
  name: 'RichText',
  props: { text: { type: String, required: true } },
  setup(props) {
    return () =>
      props.text
        .split(/(`[^`]+`)/g)
        .filter(Boolean)
        .map((part) => (part.length > 2 && part.startsWith('`') && part.endsWith('`') ? h('code', part.slice(1, -1)) : part));
  },
});
