import type { Entry } from './types';
import greetingSrc from '../snippets/components/Greeting.vue?raw';
import ratingPickerSrc from '../snippets/components/RatingPicker.vue?raw';
import quantityInputSrc from '../snippets/components/QuantityInput.vue?raw';
import titleEditorSrc from '../snippets/components/TitleEditor.vue?raw';
import cardSrc from '../snippets/components/Card.vue?raw';
import todoListSrc from '../snippets/components/TodoList.vue?raw';
import themeProviderSrc from '../snippets/components/ThemeProvider.vue?raw';
import searchBoxSrc from '../snippets/components/SearchBox.vue?raw';
import labeledInputSrc from '../snippets/components/LabeledInput.vue?raw';
import disclosureSrc from '../snippets/components/Disclosure.vue?raw';
import keyedListSrc from '../snippets/components/KeyedList.vue?raw';
import keepAliveTabsSrc from '../snippets/components/KeepAliveTabs.vue?raw';
import modalSrc from '../snippets/components/Modal.vue?raw';
import asyncProfileSrc from '../snippets/components/AsyncProfile.vue?raw';
import lazySrc from '../snippets/components/lazy.ts?raw';
import errorBoundarySrc from '../snippets/components/ErrorBoundary.vue?raw';
import lifecycleLogSrc from '../snippets/components/LifecycleLog.vue?raw';
import fieldSrc from '../snippets/components/Field.vue?raw';
import inlineEditSrc from '../snippets/components/InlineEdit.vue?raw';
import QuantityInputDemo from '../demos/components/QuantityInputDemo.vue';
import KeepAliveTabsDemo from '../demos/components/KeepAliveTabsDemo.vue';
import ModalDemo from '../demos/components/ModalDemo.vue';

export const componentsEntries: Entry[] = [
  {
    id: 'components-define-props',
    section: 'components',
    title: 'defineProps (reactive destructure)',
    summary:
      'Type-based `defineProps<{…}>()`. Since 3.5, destructured props stay reactive and `= value` defaults replace `withDefaults`.',
    tags: ['defineProps', 'props', 'destructure', 'defaults', '3.5'],
    snippet: greetingSrc,
    lang: 'vue',
    gotchas: [
      'Before 3.5, `const { name } = defineProps()` captured a one-off value and lost reactivity; on older versions use `props.name` or `toRefs`.',
      'Pass a destructured prop to `watch` / composables as a getter (`() => name`) or `toRef(() => name)`; `watch(name, …)` is a compile error.',
      'Props are readonly: assigning to one warns in dev and is ignored. Emit an event or use `defineModel` instead.',
      'Absent `boolean` props are cast to `false`, not `undefined`.',
    ],
  },
  {
    id: 'components-define-emits',
    section: 'components',
    title: 'defineEmits (tuple syntax)',
    summary:
      'Declare events as `name: [labelled, payload]` tuples; the parent listens with `@rate`. Declared events are removed from fallthrough attrs.',
    tags: ['defineEmits', 'events', 'emit', 'tuple'],
    snippet: ratingPickerSrc,
    lang: 'vue',
    gotchas: [
      'An event you `emit` but do not declare is also treated as a fallthrough listener: a native-named one like `click` lands on the root element and fires twice.',
      'Emitted events do not bubble. Grandparents need re-emitting, provide/inject or a store.',
    ],
  },
  {
    id: 'components-define-model',
    section: 'components',
    title: 'defineModel (v-model)',
    summary:
      '`defineModel()` declares the `modelValue` prop + `update:modelValue` event and returns a ref: read it like a prop, assign it to emit.',
    tags: ['defineModel', 'v-model', 'two-way binding'],
    snippet: quantityInputSrc,
    lang: 'vue',
    Demo: QuantityInputDemo,
    gotchas: [
      'With a `default`, a parent that binds `v-model` to `undefined` stays `undefined` while the child shows the default: the two disagree until the first write.',
      'Without an `onUpdate:modelValue` listener the model falls back to local state, which is handy for uncontrolled use but can hide a missing `v-model`.',
      'Assign a new value (`model.value = [...model.value, x]`). Mutating an array or object model in place changes the parent’s data without emitting.',
    ],
  },
  {
    id: 'components-define-model-named',
    section: 'components',
    title: 'Named v-model & modifiers',
    summary:
      '`defineModel(\'title\')` backs `v-model:title`; several models per component are fine. Destructure `[model, modifiers]` to support custom modifiers like `.capitalize`.',
    tags: ['defineModel', 'v-model:arg', 'modifiers', 'multiple v-model'],
    snippet: titleEditorSrc,
    lang: 'vue',
    gotchas: [
      'The built-in `.trim` and `.number` modifiers already work on component `v-model`; you only handle custom ones.',
      'Modifiers arrive as the `titleModifiers` prop (`modelModifiers` for the default model), so do not declare a prop with that name.',
    ],
  },
  {
    id: 'components-slots',
    section: 'components',
    title: 'Slots: default, named, fallback',
    summary:
      'Use `<slot>` for children, `<slot name="header">` for named regions, and put fallback content inside the slot tag. Check `$slots.footer` to skip empty wrappers.',
    tags: ['slots', 'named slots', 'fallback', '$slots'],
    snippet: cardSrc,
    lang: 'vue',
    gotchas: [
      'Slot content is compiled in the parent’s scope and cannot see the child’s state unless the child passes it as slot props.',
      '`v-slot` / `#name` only goes on a component or a `<template>`, not on a plain element.',
    ],
  },
  {
    id: 'components-scoped-slots',
    section: 'components',
    title: 'Scoped slots (slot props)',
    summary:
      'The child binds data on `<slot :todo="todo">` and the parent receives it with `#item="{ todo, index }"`. The child owns the iteration and the parent owns the markup.',
    tags: ['scoped slots', 'slot props', 'render delegation'],
    snippet: todoListSrc,
    lang: 'vue',
    gotchas: [
      'Slot props are typed as `any` unless the child declares them with `defineSlots` (see Vue + TypeScript).',
    ],
  },
  {
    id: 'components-provide-inject',
    section: 'components',
    title: 'provide / inject',
    summary:
      'An ancestor `provide`s a value under an `InjectionKey`, and any descendant can `inject` it without prop drilling. Provide a readonly ref plus an updater function.',
    tags: ['provide', 'inject', 'InjectionKey', 'dependency injection'],
    snippet: themeProviderSrc,
    lang: 'vue',
    gotchas: [
      'Provide a ref or a reactive object. A plain value (`provide(key, theme.value)`) is a snapshot that never updates.',
      '`inject` only works synchronously in `setup` and returns `undefined` (with a warning) when nothing provides the key.',
      'Exports such as the key need a separate normal `<script>` block; `<script setup>` cannot export.',
    ],
  },
  {
    id: 'components-template-refs',
    section: 'components',
    title: 'useTemplateRef + defineExpose',
    summary:
      '`useTemplateRef(\'input\')` (3.5) reaches a DOM node after mount. `<script setup>` components are closed, so `defineExpose` picks the API that parents can call through a ref.',
    tags: ['useTemplateRef', 'ref', 'defineExpose', 'focus', 'imperative'],
    snippet: searchBoxSrc,
    lang: 'vue',
    gotchas: [
      'The ref is `null` until mounted and again after an element under `v-if` unmounts, so always use `?.`.',
      'Inside `v-for` the ref holds an array whose order is not guaranteed to match the source array.',
      'Expose behaviour (`focus`, `clear`) rather than internal state. Data should flow through props and events.',
    ],
  },
  {
    id: 'components-attrs-fallthrough',
    section: 'components',
    title: 'Fallthrough attrs, inheritAttrs: false, useAttrs',
    summary:
      'Undeclared attributes and listeners (`class`, `placeholder`, `@focus`) land on the root element. Use `defineOptions({ inheritAttrs: false })` + `v-bind="$attrs"` to forward them to the right element.',
    tags: ['$attrs', 'useAttrs', 'inheritAttrs', 'fallthrough', 'defineOptions'],
    snippet: labeledInputSrc,
    lang: 'vue',
    gotchas: [
      '`useAttrs()` is not reactive. Read it in the template, a handler or `onUpdated`, not in a `computed` or `watch`.',
      'Multi-root components (fragments) do not auto-inherit attrs and warn until you bind `$attrs` explicitly.',
      'In Vue 3, `class`, `style` and `on*` listeners are all part of `$attrs` (no more `$listeners`).',
    ],
  },
  {
    id: 'components-v-if-v-show',
    section: 'components',
    title: 'v-if vs v-show',
    summary:
      '`v-if` creates and destroys the branch (lazy, resets state). `v-show` renders once and toggles `display: none` (cheap to flip, always mounted).',
    tags: ['v-if', 'v-show', 'conditional rendering', 'disclosure'],
    snippet: disclosureSrc,
    lang: 'vue',
    gotchas: [
      'On the same element `v-if` has higher priority than `v-for` in Vue 3, so the condition cannot see the loop variable. Filter with a `computed` or wrap in `<template v-for>`.',
      '`v-show` does not work on `<template>` and cannot have `v-else`.',
    ],
  },
  {
    id: 'components-v-for-keys',
    section: 'components',
    title: 'v-for keys (index-key bug)',
    summary:
      'Vue matches list rows by `:key`. With the index as key, reordering patches rows in place, so DOM and component state stay at the position and end up on the wrong item.',
    tags: ['v-for', 'key', 'lists', 'reorder'],
    snippet: keyedListSrc,
    lang: 'vue',
    gotchas: [
      'Use a stable id from the data. Index keys are only safe for static lists that are never reordered, filtered or prepended.',
      '`v-for="n in 5"` starts at 1, not 0.',
      'On `<template v-for>`, put the `:key` on the `<template>` itself (Vue 3).',
    ],
  },
  {
    id: 'components-keep-alive',
    section: 'components',
    title: '<component :is> + KeepAlive',
    summary:
      '`<component :is>` swaps components dynamically, and `<KeepAlive>` caches the inactive ones so their state survives. Cached children get `onActivated` / `onDeactivated` instead of remount/unmount.',
    tags: ['KeepAlive', 'dynamic component', 'onActivated', 'tabs', 'cache'],
    snippet: keepAliveTabsSrc,
    lang: 'vue',
    Demo: KeepAliveTabsDemo,
    gotchas: [
      'The cache key is the vnode `key` or else the component. A `v-if` on the child inside `<KeepAlive>` gets a compiler-assigned key shared by every tab, which corrupts the cache. Put the `v-if` on `<KeepAlive>` or give each child a `:key`.',
      'Store component definitions with `markRaw` / `shallowRef`. Putting them in `ref()` makes them deeply reactive and Vue warns.',
      '`onActivated` also runs on the first mount. `include` / `exclude` match the component `name`, which SFCs infer from the filename.',
    ],
  },
  {
    id: 'components-teleport',
    section: 'components',
    title: 'Teleport (modal)',
    summary:
      '`<Teleport to="body">` renders markup elsewhere in the DOM (escaping `overflow` / `z-index` traps) while it stays in the same component tree for props, events and provide/inject.',
    tags: ['Teleport', 'modal', 'dialog', 'portal', 'focus'],
    snippet: modalSrc,
    lang: 'vue',
    Demo: ModalDemo,
    gotchas: [
      'The `to` target must exist when the Teleport mounts. For targets rendered by Vue itself use `defer` (3.5) or mount later.',
      'Scoped styles from a parent cannot reach teleported nodes through ancestor selectors. Style the modal inside its own component or globally.',
      '`aria-modal` alone does not trap focus. Real dialogs also need a focus trap, `inert` on the background, and focus returned to the opener (the demo does the latter).',
    ],
  },
  {
    id: 'components-suspense',
    section: 'components',
    title: 'Suspense + async setup',
    summary:
      'A top-level `await` in `<script setup>` makes the component async. The nearest `<Suspense>` shows `#fallback` until every async descendant resolves.',
    tags: ['Suspense', 'async setup', 'top-level await', 'fallback'],
    snippet: asyncProfileSrc,
    lang: 'vue',
    gotchas: [
      'Setup runs once: changing a prop will not re-run the `await`. Re-key the component, or fetch reactively in a composable instead.',
      'Once resolved, Suspense only shows the fallback again on a new pending branch, and only after its `timeout` prop elapses.',
      'A rejected `await` is an ordinary component error. Catch it with `onErrorCaptured` above the Suspense.',
      'Suspense is still marked experimental in Vue 3.5.',
    ],
  },
  {
    id: 'components-async-component',
    section: 'components',
    title: 'defineAsyncComponent',
    summary:
      'Lazy-load a component into its own chunk with `defineAsyncComponent`. Options add a delayed loading state, a timeout, retries and an error component.',
    tags: ['defineAsyncComponent', 'lazy', 'code splitting', 'dynamic import'],
    snippet: lazySrc,
    gotchas: [
      '`delay` (default 200 ms) keeps the loading component from flashing on fast loads.',
      'Inside a `<Suspense>` the async component defers to it by default, and its own loading/error options are ignored unless `suspensible: false`.',
      'Call `defineAsyncComponent` once at module level, not inside `setup` or a render function, or every render creates a new component.',
    ],
  },
  {
    id: 'components-error-boundary',
    section: 'components',
    title: 'Error boundary (onErrorCaptured)',
    summary:
      '`onErrorCaptured` receives errors thrown by descendants, so a wrapper can render a fallback and a reset button. Return `false` to stop propagation.',
    tags: ['onErrorCaptured', 'error boundary', 'errors', 'fallback'],
    snippet: errorBoundarySrc,
    lang: 'vue',
    gotchas: [
      'Unlike React, Vue boundaries also catch errors thrown in child event handlers, watchers and async lifecycle hooks.',
      'Errors in the boundary’s own setup/render and in `setTimeout` / un-awaited promises are not captured. Use `app.config.errorHandler` as the last resort.',
      'If the fallback itself throws, the error goes to the next boundary up.',
    ],
  },
  {
    id: 'components-lifecycle',
    section: 'components',
    title: 'Lifecycle hooks order',
    summary:
      'Setup and `onBeforeMount` run parent → child, while `onMounted` runs child → parent. Unmount starts at the parent (`beforeUnmount`) and finishes with child-first `onUnmounted`.',
    tags: ['onMounted', 'onUpdated', 'onUnmounted', 'lifecycle', 'order'],
    snippet: lifecycleLogSrc,
    lang: 'vue',
    gotchas: [
      'Hooks must be registered synchronously during setup. After an `await` they are not tied to the instance (except in `<script setup>`, which restores the context).',
      '`onUpdated` fires only when this component re-renders, not when a child does, and must not mutate state (that causes an infinite loop).',
      'The DOM is not available during setup or `onBeforeMount`. Touch elements in `onMounted` or later.',
    ],
  },
  {
    id: 'components-use-id',
    section: 'components',
    title: 'useId for label wiring',
    summary:
      '`useId()` (3.5) returns an id that is unique per instance and stable across SSR and hydration, for `for`, `aria-describedby` and `aria-errormessage`.',
    tags: ['useId', 'accessibility', 'label', 'aria-describedby', 'SSR'],
    snippet: fieldSrc,
    lang: 'vue',
    gotchas: [
      'Call it in setup, not in the template or a `computed`. Do not use it as a `v-for` key.',
      'Multiple apps on one page can collide; set `app.config.idPrefix` per app.',
    ],
  },
  {
    id: 'components-custom-directive',
    section: 'components',
    title: 'Custom directive (v-focus)',
    summary:
      'In `<script setup>`, any `vCamelCase` variable is a directive. Hooks mirror the component lifecycle (`mounted`, `updated`, `unmounted`) and receive the element.',
    tags: ['directive', 'v-focus', 'Directive', 'DOM'],
    snippet: inlineEditSrc,
    lang: 'vue',
    gotchas: [
      'Directives are for low-level DOM access. Prefer a component or composable for anything with state or markup.',
      'On a component, a directive applies to its root element and warns for multi-root components.',
    ],
  },
];
