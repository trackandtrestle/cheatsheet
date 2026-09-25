import type { Entry } from './types';
import comboboxSrc from '../snippets/dom-a11y/useCombobox.ts?raw';
import listboxSrc from '../snippets/dom-a11y/useListbox.ts?raw';
import focusTrapSrc from '../snippets/dom-a11y/useFocusTrap.ts?raw';
import nativeDialogSrc from '../snippets/dom-a11y/NativeDialog.tsx?raw';
import rovingSrc from '../snippets/dom-a11y/useRovingTabIndex.ts?raw';
import liveRegionSrc from '../snippets/dom-a11y/LiveRegion.tsx?raw';
import delegateSrc from '../snippets/dom-a11y/delegate.ts?raw';
import infiniteSrc from '../snippets/dom-a11y/useInfiniteScroll.ts?raw';
import elementSizeSrc from '../snippets/dom-a11y/useElementSize.ts?raw';
import skipLinkSrc from '../snippets/dom-a11y/SkipLink.tsx?raw';
import { ComboboxDemo } from '../demos/dom-a11y/ComboboxDemo';
import { ListboxDemo } from '../demos/dom-a11y/ListboxDemo';
import { FocusTrapDemo } from '../demos/dom-a11y/FocusTrapDemo';
import { RovingToolbarDemo } from '../demos/dom-a11y/RovingToolbarDemo';

export const domA11yEntries: Entry[] = [
  {
    id: 'dom-a11y-combobox',
    section: 'dom-a11y',
    title: 'Combobox / autocomplete',
    summary: 'An ARIA 1.2 combobox: focus stays on the `<input role="combobox">` while `aria-activedescendant` points at the highlighted `role="option"`. The arrow keys, Enter and Escape drive it.',
    tags: ['combobox', 'autocomplete', 'aria-activedescendant', 'listbox', 'aria-expanded', 'aria-controls'],
    snippet: comboboxSrc,
    gotchas: [
      '`aria-activedescendant` needs a real `id` on every option, and DOM focus must stay on the input. Do not call `.focus()` on options.',
      'Options need `onMouseDown={e => e.preventDefault()}`, or the input blurs, the list closes and the click never lands.',
      'The highlighted option has no `:focus` style, so style `[aria-selected="true"]` and scroll it into view yourself.',
      'Clamp or reset the active index when the filtered list shrinks.',
    ],
    Demo: ComboboxDemo,
  },
  {
    id: 'dom-a11y-listbox',
    section: 'dom-a11y',
    title: 'Listbox keyboard navigation',
    summary: 'A single-select listbox with one tab stop: arrow keys, Home/End and first-letter type-ahead move the selection. The key-to-index mapping is a pure function you can unit test.',
    tags: ['listbox', 'keyboard', 'home', 'end', 'type-ahead', 'aria-selected'],
    snippet: listboxSrc,
    gotchas: [
      "Call `preventDefault()` on handled keys, or arrows and Home/End also scroll the page.",
      'Selection that follows focus suits cheap choices. For expensive ones, keep a separate active index and select on Space/Enter.',
      'A listbox is not a menu: use `role="menu"` only for application-style command menus.',
    ],
    Demo: ListboxDemo,
  },
  {
    id: 'dom-a11y-focus-trap',
    section: 'dom-a11y',
    title: 'Modal focus trap',
    summary: 'Keep Tab and Shift+Tab cycling inside a modal, close it on Escape, and return focus to the element that opened it.',
    tags: ['focus trap', 'modal', 'dialog', 'aria-modal', 'escape', 'restore focus'],
    snippet: focusTrapSrc,
    gotchas: [
      'Query the focusable elements on every Tab, not once at mount. Otherwise fields added after opening escape the trap.',
      'Capture `document.activeElement` *before* moving focus into the dialog, and restore it in the cleanup.',
      '`aria-modal="true"` does not stop the mouse or screen-reader browsing mode. Also set `inert` on the rest of the app, or use native `<dialog>`.',
      'Render modals in a portal so a parent with `overflow` or `transform` cannot clip them.',
    ],
    Demo: FocusTrapDemo,
  },
  {
    id: 'dom-a11y-native-dialog',
    section: 'dom-a11y',
    title: 'Native <dialog> with showModal()',
    summary: '`dialog.showModal()` provides the focus trap, Escape-to-close, the inert background, `::backdrop`, top-layer stacking and focus restore built in. React only mirrors `open` state and listens for `close`.',
    tags: ['dialog', 'showModal', 'modal', 'inert', 'backdrop', 'top layer'],
    snippet: nativeDialogSrc,
    gotchas: [
      'Rendering `<dialog open>` makes a *non-modal* dialog with no trap and no backdrop. Call `showModal()`.',
      'Escape fires `cancel` and then `close`. Sync React state in `onClose`, or the next `open` change is ignored.',
      'jsdom does not implement `showModal`/`close`, so stub them in tests.',
      'Use `autoFocus` on the element that should receive initial focus. Light-dismiss on backdrop click needs `closedby="any"` or a click handler.',
    ],
  },
  {
    id: 'dom-a11y-roving-tabindex',
    section: 'dom-a11y',
    title: 'Roving tabindex',
    summary: 'A composite widget (toolbar, radio group, tabs) is one tab stop: the active item has `tabIndex=0`, the others `-1`, and the arrow keys move real focus between them.',
    tags: ['roving tabindex', 'toolbar', 'radio group', 'tabs', 'keyboard', 'composite'],
    snippet: rovingSrc,
    gotchas: [
      'Update the active index in `onFocus` as well, so a mouse click also makes that item the tab stop.',
      'Roving tabindex moves DOM focus. `aria-activedescendant` keeps focus on the container. Choose one per widget.',
      'Native radio groups already rove. Only build this for custom widgets.',
    ],
    Demo: RovingToolbarDemo,
  },
  {
    id: 'dom-a11y-live-region',
    section: 'dom-a11y',
    title: 'Live regions (status vs alert)',
    summary: '`role="status"` (polite) announces when the user is idle and `role="alert"` (assertive) interrupts. Render the region first, then change its text.',
    tags: ['aria-live', 'role=status', 'role=alert', 'screen reader', 'announce'],
    snippet: liveRegionSrc,
    gotchas: [
      'A live region that is mounted together with its content is usually *not* announced. It must already exist in the accessibility tree.',
      'Setting the same text twice is not a change. Clear it first, then set it on the next frame.',
      'Reserve `role="alert"` for errors and time-sensitive messages, because it interrupts whatever is being read.',
    ],
  },
  {
    id: 'dom-a11y-event-delegation',
    section: 'dom-a11y',
    title: 'Event delegation',
    summary: 'Attach one listener to a stable parent, use `closest()` to find the element that was clicked, and read the payload from `data-*` attributes. It also covers rows added later.',
    tags: ['event delegation', 'closest', 'dataset', 'addEventListener', 'dom'],
    snippet: delegateSrc,
    gotchas: [
      '`event.target` can be a nested `<span>` or `<svg>`, so use `closest(selector)`. Do not compare `target` directly.',
      '`closest()` can climb *past* the root, so check `root.contains(match)`.',
      '`focus`/`blur` do not bubble. Delegate `focusin`/`focusout` instead.',
      'React already delegates at the root. This pattern is for vanilla DOM or third-party HTML.',
    ],
  },
  {
    id: 'dom-a11y-infinite-scroll',
    section: 'dom-a11y',
    title: 'Infinite scroll with IntersectionObserver',
    summary: 'Observe a sentinel element after the last item and load more when it comes near the viewport. A React 19 callback ref returns the observer cleanup.',
    tags: ['IntersectionObserver', 'infinite scroll', 'callback ref', 'useEffectEvent', 'pagination'],
    snippet: infiniteSrc,
    gotchas: [
      'jsdom has no `IntersectionObserver`. Stub it with `vi.stubGlobal` and trigger the callback manually.',
      'Disable the observer while a page is loading or when there is no more data, or it fires repeatedly.',
      'Keyboard and screen-reader users cannot reach content that is never loaded. Also offer a "Load more" button, and keep the footer reachable.',
    ],
  },
  {
    id: 'dom-a11y-resize-observer',
    section: 'dom-a11y',
    title: 'useElementSize (ResizeObserver)',
    summary: 'Measure an element and re-render when *it* resizes, which enables container-query-like logic in JS. The observer fires once right after `observe()`.',
    tags: ['ResizeObserver', 'element size', 'useLayoutEffect', 'responsive', 'container'],
    snippet: elementSizeSrc,
    gotchas: [
      'Skip updates when the size has not changed. Changing layout inside the callback can loop and trigger "ResizeObserver loop" errors.',
      '`contentBoxSize` is an array. `contentRect` is the older fallback.',
      'jsdom has no layout: stub `ResizeObserver` and push sizes from the test.',
      'Prefer CSS container queries when the logic only affects styling.',
    ],
  },
  {
    id: 'dom-a11y-skip-link',
    section: 'dom-a11y',
    title: 'Skip link & visually hidden text',
    summary: 'Make a "Skip to main content" link the first tab stop, targeting a `<main tabIndex={-1}>`. Visually hidden text names icon-only controls without showing the text.',
    tags: ['skip link', 'visually hidden', 'sr-only', 'icon button', 'tabindex'],
    snippet: skipLinkSrc,
    gotchas: [
      '`display:none` and `hidden` remove text from the accessibility tree as well. Use the clip technique to hide it only visually.',
      'Without `tabIndex={-1}` on the target, some browsers scroll to it but the next Tab starts again from the top.',
      'A skip link that stays hidden while focused fails WCAG 2.4.7. It must appear on focus.',
    ],
  },
];
