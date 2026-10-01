import type { Directive } from 'vue';

type Handler = (event: PointerEvent) => void;
const state = new WeakMap<HTMLElement, { handler: Handler; listener: (e: PointerEvent) => void }>();

// <div v-click-outside="close">. Register locally in <script setup> by importing `vClickOutside`.
export const vClickOutside: Directive<HTMLElement, Handler> = {
  mounted(el, { value }) {
    const entry = {
      handler: value,
      listener: (e: PointerEvent) => {
        if (!(e.target instanceof Node && el.contains(e.target))) entry.handler(e);
      },
    };
    state.set(el, entry);
    // pointerdown + capture: runs BEFORE any handler can remove the target from the DOM
    // (a later `click` would then look "outside") or call stopPropagation().
    document.addEventListener('pointerdown', entry.listener, true);
  },
  updated(el, { value }) {
    const entry = state.get(el);
    if (entry) entry.handler = value; // new inline handler each render: just swap it
  },
  beforeUnmount(el) {
    const entry = state.get(el);
    if (entry) document.removeEventListener('pointerdown', entry.listener, true);
    state.delete(el);
  },
};
