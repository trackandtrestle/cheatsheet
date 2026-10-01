import type { Directive } from 'vue';

// <input v-autofocus> or <input v-autofocus="isEditing">.
// The `autofocus` ATTRIBUTE only works on page load (and in a <dialog> opened with
// showModal) — not for elements Vue inserts later with v-if or on a route change.
export const vAutofocus: Directive<HTMLElement, boolean | undefined> = {
  mounted(el, { value }) {
    if (value !== false) el.focus(); // mounted: the element is in the document now
  },
  updated(el, { value, oldValue }) {
    if (value && !oldValue) el.focus(); // flipped false -> true while already mounted
  },
};
