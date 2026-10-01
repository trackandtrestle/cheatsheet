import type { Entry } from './types';
import comboboxSrc from '../snippets/dom-a11y/useCombobox.ts?raw';
import listboxSrc from '../snippets/dom-a11y/useListbox.ts?raw';
import focusTrapSrc from '../snippets/dom-a11y/useFocusTrap.ts?raw';
import nativeDialogSrc from '../snippets/dom-a11y/NativeDialog.vue?raw';
import rovingSrc from '../snippets/dom-a11y/useRovingTabIndex.ts?raw';
import liveRegionSrc from '../snippets/dom-a11y/SaveStatus.vue?raw';
import delegationSrc from '../snippets/dom-a11y/RichContent.vue?raw';
import infiniteSrc from '../snippets/dom-a11y/useInfiniteScroll.ts?raw';
import elementSizeSrc from '../snippets/dom-a11y/useElementSize.ts?raw';
import clickOutsideSrc from '../snippets/dom-a11y/vClickOutside.ts?raw';
import autofocusSrc from '../snippets/dom-a11y/vAutofocus.ts?raw';
import fadeSrc from '../snippets/dom-a11y/FadeTransition.vue?raw';
import ComboboxDemo from '../demos/dom-a11y/ComboboxDemo.vue';
import ListboxDemo from '../demos/dom-a11y/ListboxDemo.vue';
import FocusTrapDemo from '../demos/dom-a11y/FocusTrapDemo.vue';
import RovingToolbarDemo from '../demos/dom-a11y/RovingToolbarDemo.vue';

export const domA11yEntries: Entry[] = [
  {
    id: 'dom-a11y-combobox',
    section: 'dom-a11y',
    title: 'Combobox / autocomplete',
    summary: 'An ARIA 1.2 combobox composable: focus stays on the `<input role="combobox">` while `aria-activedescendant` points at the highlighted `role="option"`. It returns attribute objects you spread with `v-bind`, listeners included.',
    tags: ['combobox', 'autocomplete', 'aria-activedescendant', 'listbox', 'v-bind', 'useId'],
    snippet: comboboxSrc,
    gotchas: [
      '`aria-activedescendant` needs a real `id` on every option (`useId()` keeps them unique and SSR-stable), and DOM focus must stay on the input. Do not call `.focus()` on options.',
      'Options need `@mousedown.prevent` (here `onMousedown` in the bindings), or the input blurs, the list closes and the click never lands.',
      'The highlighted option has no `:focus` style, so style `[aria-selected="true"]` and scroll it into view yourself.',
      '`v-model` and a `v-bind` object with `onInput` both run. Vue merges listeners, it does not replace them.',
    ],
    Demo: ComboboxDemo,
  },
  {
    id: 'dom-a11y-listbox',
    section: 'dom-a11y',
    title: 'Listbox keyboard navigation',
    summary: 'A single-select listbox with one tab stop: arrow keys, Home/End and first-letter type-ahead move the selection. Pass the `defineModel()` ref in; the key-to-index mapping is a pure, unit-testable function.',
    tags: ['listbox', 'keyboard', 'home', 'end', 'type-ahead', 'aria-selected', 'defineModel'],
    snippet: listboxSrc,
    gotchas: [
      'Call `preventDefault()` on handled keys, or arrows, Home/End and Space also scroll the page.',
      'Selection that follows focus suits cheap choices. For expensive ones, keep a separate active index and select on Space/Enter.',
      'A listbox is not a menu: use `role="menu"` only for application-style command menus.',
    ],
    Demo: ListboxDemo,
  },
  {
    id: 'dom-a11y-focus-trap',
    section: 'dom-a11y',
    title: 'Modal focus trap',
    summary: 'Watch the dialog\'s template ref: when it appears, move focus in and keep Tab/Shift+Tab inside; Escape closes; when it disappears, `onWatcherCleanup` removes the listener and restores focus to the opener.',
    tags: ['focus trap', 'modal', 'dialog', 'aria-modal', 'escape', 'restore focus', 'useTemplateRef'],
    snippet: focusTrapSrc,
    gotchas: [
      'Query the focusable elements on every Tab, not once on open. Otherwise fields added later escape the trap.',
      'Capture `document.activeElement` *before* moving focus into the dialog. `flush: \'post\'` guarantees the element is in the DOM.',
      '`aria-modal="true"` does not stop the mouse or screen-reader browsing mode. Also set `inert` on the rest of the app, or use native `<dialog>`.',
      'Render modals with `<Teleport to="body">` so a parent with `overflow` or `transform` cannot clip them.',
    ],
    Demo: FocusTrapDemo,
  },
  {
    id: 'dom-a11y-native-dialog',
    section: 'dom-a11y',
    title: 'Native <dialog> with showModal()',
    summary: '`showModal()` provides the focus trap, Escape-to-close, an inert background, `::backdrop`, top-layer stacking and focus restore. The component maps a `v-model:open` to `showModal()`/`close()` and syncs back on the `close` event.',
    tags: ['dialog', 'showModal', 'modal', 'inert', 'backdrop', 'defineModel', 'returnValue'],
    snippet: nativeDialogSrc,
    lang: 'vue',
    gotchas: [
      '`<dialog :open="…">` makes a *non-modal* dialog with no trap and no backdrop. Call `showModal()`.',
      'Escape fires `cancel` then `close` without touching your state. Sync it in `@close`, or the next `open = true` is a no-op.',
      'jsdom has no `showModal`/`close`/`returnValue`. Stub them on `HTMLDialogElement.prototype` in tests.',
      'Light-dismiss on a backdrop click needs `closedby="any"` (newer browsers) or a click handler on the `<dialog>` itself.',
    ],
  },
  {
    id: 'dom-a11y-roving-tabindex',
    section: 'dom-a11y',
    title: 'Roving tabindex',
    summary: 'A composite widget (toolbar, radio group, tabs) is one tab stop: the active item has `tabindex="0"`, the others `-1`, and the arrow keys move real focus. One `keydown` on the container finds items in DOM order.',
    tags: ['roving tabindex', 'toolbar', 'radio group', 'tabs', 'keyboard', 'composite'],
    snippet: rovingSrc,
    gotchas: [
      'Update the active index on `focus` as well, so a mouse click also makes that item the tab stop.',
      'Template-ref arrays from `v-for` are not guaranteed to be in source order. Query the DOM, or key a ref map by index.',
      'Roving tabindex moves DOM focus. `aria-activedescendant` keeps focus on the container. Choose one per widget.',
      'Native radio groups already rove. Only build this for custom widgets.',
    ],
    Demo: RovingToolbarDemo,
  },
  {
    id: 'dom-a11y-live-region',
    section: 'dom-a11y',
    title: 'Live regions (status vs alert)',
    summary: '`role="status"` (polite) announces when the user is idle and `role="alert"` (assertive) interrupts. Render the regions up front and change only their text.',
    tags: ['aria-live', 'role=status', 'role=alert', 'screen reader', 'announce'],
    snippet: liveRegionSrc,
    lang: 'vue',
    gotchas: [
      'A region mounted together with its content (`v-if`) is usually *not* announced. It must already be in the accessibility tree.',
      'Setting the same text twice is not a change. Go through an intermediate message (or clear it and set it on the next frame).',
      'Reserve `role="alert"` for errors and time-sensitive messages, because it interrupts whatever is being read.',
    ],
  },
  {
    id: 'dom-a11y-event-delegation',
    section: 'dom-a11y',
    title: 'Event delegation (v-html links)',
    summary: 'One `@click` on a stable wrapper, `closest()` to find the real target, and `contains()` to stay inside. This is the Vue-friendly way to route internal links in `v-html` content, which cannot carry Vue listeners.',
    tags: ['event delegation', 'closest', 'v-html', 'router', 'links', 'dataset'],
    snippet: delegationSrc,
    lang: 'vue',
    gotchas: [
      '`event.target` can be a nested `<strong>` or `<svg>`, so use `closest(selector)`. Do not compare `target` directly.',
      '`//host/path` starts with `/` but is an external, protocol-relative URL.',
      'Leave modified clicks (Cmd/Ctrl/Shift, middle button) and `target="_blank"` to the browser.',
      '`focus`/`blur` do not bubble. Delegate `focusin`/`focusout` instead. For ordinary `v-for` rows, per-item `@click` is fine.',
    ],
  },
  {
    id: 'dom-a11y-infinite-scroll',
    section: 'dom-a11y',
    title: 'Infinite scroll with IntersectionObserver',
    summary: 'Observe a sentinel element after the last item and load more when it nears the viewport. A multi-source `watch` re-creates the observer only when the sentinel or `enabled` changes, and `onWatcherCleanup` disconnects it.',
    tags: ['IntersectionObserver', 'infinite scroll', 'sentinel', 'onWatcherCleanup', 'pagination'],
    snippet: infiniteSrc,
    gotchas: [
      'A getter returning `[a, b]` is a new array every time, so the watcher re-runs whenever any dependency changes. Pass an array of sources instead.',
      'The observer only fires on *changes*. If the sentinel is still visible after a short page, re-observe it to check again.',
      'jsdom has no `IntersectionObserver`. Stub it with `vi.stubGlobal` and trigger the callback manually.',
      'Keyboard and screen-reader users cannot reach content that is never loaded. Also offer a "Load more" button, and keep the footer reachable.',
    ],
  },
  {
    id: 'dom-a11y-resize-observer',
    section: 'dom-a11y',
    title: 'useElementSize (ResizeObserver)',
    summary: 'Reactive width/height of one element, for container-query-like logic in JS. The observer fires once right after `observe()`, so the first size arrives without measuring by hand.',
    tags: ['ResizeObserver', 'element size', 'useTemplateRef', 'responsive', 'container'],
    snippet: elementSizeSrc,
    gotchas: [
      'Changing layout inside the callback can loop and trigger "ResizeObserver loop" errors. `shallowRef` skips same-value writes, which helps.',
      '`contentBoxSize` is an array, and `inlineSize`/`blockSize` follow the writing mode. `contentRect` is the older fallback.',
      'jsdom has no layout: stub `ResizeObserver` and push sizes from the test.',
      'Prefer CSS container queries when the logic only affects styling.',
    ],
  },
  {
    id: 'dom-a11y-v-click-outside',
    section: 'dom-a11y',
    title: 'v-click-outside directive',
    summary: 'A typed `Directive<HTMLElement, Handler>` that registers a document listener in `mounted` and removes it in `beforeUnmount`. Per-element state lives in a `WeakMap`.',
    tags: ['directive', 'click outside', 'Directive', 'pointerdown', 'popover', 'WeakMap'],
    snippet: clickOutsideSrc,
    gotchas: [
      'Inline handlers change on every render. Swap the stored handler in `updated`, or the directive calls a stale closure.',
      'A bubbling `click` arrives after earlier handlers have run, and its target may already be removed from the DOM, so `contains()` says "outside". Listen to `pointerdown` in the capture phase.',
      'Click-outside is mouse-only. Popovers also need Escape and focus-out handling for keyboard users.',
      'In `<script setup>`, any camelCase `vName` import is usable as `v-name`. No registration needed.',
    ],
  },
  {
    id: 'dom-a11y-v-autofocus',
    section: 'dom-a11y',
    title: 'v-autofocus directive',
    summary: 'Focus an element when Vue inserts it, or when its binding flips to `true`. The native `autofocus` attribute does not help for elements rendered later by `v-if`.',
    tags: ['directive', 'autofocus', 'focus', 'Directive', 'v-if', 'inline edit'],
    snippet: autofocusSrc,
    gotchas: [
      '`autofocus` only applies on page load and when a `<dialog>` opens. Elements inserted later are ignored.',
      'Use the `mounted` hook, not `created` or `beforeMount`: before that the element is not in the document and `focus()` does nothing.',
      'Moving focus unexpectedly disorients screen-reader users. Autofocus only in response to a user action (open, edit) or on a dedicated page.',
    ],
  },
  {
    id: 'dom-a11y-reduced-motion',
    section: 'dom-a11y',
    title: '<Transition> with prefers-reduced-motion',
    summary: 'Read `prefers-reduced-motion` with `matchMedia`, react to changes, and pass `:css="!reduced"` so `<Transition>` swaps instantly for users who asked for less motion.',
    tags: ['Transition', 'prefers-reduced-motion', 'matchMedia', 'animation', 'a11y'],
    snippet: fadeSrc,
    lang: 'vue',
    gotchas: [
      'A CSS-only fix also works: `@media (prefers-reduced-motion: reduce) { .fade-enter-active, .fade-leave-active { transition: none } }`. Vue detects that there is no duration and finishes at once.',
      'Reduced motion means less movement, not none. A short opacity fade is usually fine; avoid slides, zooms and parallax.',
      'jsdom has no `matchMedia`, and VTU stubs `<Transition>` by default. Stub the former and set `stubs: { transition: false }` to test it.',
    ],
  },
];
