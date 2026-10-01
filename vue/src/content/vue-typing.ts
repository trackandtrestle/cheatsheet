import type { Entry } from './types';
import alertSrc from '../snippets/vue-typing/Alert.vue?raw';
import signupFormSrc from '../snippets/vue-typing/SignupForm.vue?raw';
import pagerSrc from '../snippets/vue-typing/Pager.vue?raw';
import dataStateSrc from '../snippets/vue-typing/DataState.vue?raw';
import selectListSrc from '../snippets/vue-typing/SelectList.vue?raw';
import loginFormSrc from '../snippets/vue-typing/LoginForm.vue?raw';
import contextSrc from '../snippets/vue-typing/context.ts?raw';
import tagInputSrc from '../snippets/vue-typing/TagInput.vue?raw';
import progressBarSrc from '../snippets/vue-typing/ProgressBar.ts?raw';
import componentPropsSrc from '../snippets/vue-typing/componentProps.ts?raw';
import useCounterSrc from '../snippets/vue-typing/useCounter.ts?raw';
import useCurrencySrc from '../snippets/vue-typing/useCurrency.ts?raw';
import SelectListDemo from '../demos/vue-typing/SelectListDemo.vue';

export const vueTypingEntries: Entry[] = [
  {
    id: 'vue-typing-props',
    section: 'vue-typing',
    title: 'Typing props (interfaces, unions, defaults)',
    summary:
      'Describe props with an interface: `?` for optional, literal unions for variants. `withDefaults` makes them non-optional inside the component while the public API stays optional.',
    tags: ['defineProps', 'withDefaults', 'interface', 'union', 'optional'],
    snippet: alertSrc,
    lang: 'vue',
    gotchas: [
      'Array/object defaults must be factories (`() => []`) in `withDefaults`. A bare literal would be shared by every instance.',
      'The compiler turns the type into runtime props, so conditional types are only partly supported. Keep prop types simple and resolvable.',
      'With 3.5 destructure defaults (`const { tone = \'info\' } = defineProps<Props>()`) you rarely need `withDefaults`. Both type the same.',
    ],
  },
  {
    id: 'vue-typing-emits',
    section: 'vue-typing',
    title: 'Typing emits + payload validation',
    summary:
      'Object-syntax `defineEmits({ submit: (p: Signup) => boolean })` types the payload and adds a dev-only validator. Parents get typed `onSubmit` handlers.',
    tags: ['defineEmits', 'validation', 'payload', 'onX props'],
    snippet: signupFormSrc,
    lang: 'vue',
    gotchas: [
      'A failing validator only logs a warning in development. The event is still emitted, so it does not replace real validation.',
      '`cancel: null` types the listener as `(...args: any[]) => any`. Use `() => true` or the tuple syntax to keep it typed.',
      'Emits become `onX` props on the component type, which is how `$props[\'onSubmit\']` gets its parameters.',
    ],
  },
  {
    id: 'vue-typing-define-model',
    section: 'vue-typing',
    title: 'Typing defineModel',
    summary:
      '`defineModel<T>(name, opts)` generates a typed prop and an `update:name` event. `required: true` drops `undefined` and a literal-union `T` constrains what the parent may bind.',
    tags: ['defineModel', 'v-model', 'required', 'literal types'],
    snippet: pagerSrc,
    lang: 'vue',
    gotchas: [
      'Without `required` or `default`, the ref is `Ref<T | undefined>` inside the component.',
      'Use `v-model.number` on `<select>` / `<input>` when the model is numeric. DOM values are strings.',
    ],
  },
  {
    id: 'vue-typing-define-slots',
    section: 'vue-typing',
    title: 'defineSlots',
    summary:
      '`defineSlots<{ error?(props: {…}): unknown }>()` types slot names and slot props for consumers and checks the `<slot>` bindings in your own template.',
    tags: ['defineSlots', 'slots', 'slot props', '$slots'],
    snippet: dataStateSrc,
    lang: 'vue',
    gotchas: [
      'It is type-only: slot functions take exactly one props argument and the return type is ignored, so use `unknown`.',
      'Mark slots the parent may omit as optional (`name?()`), or `$slots.name` checks are typed as always-present.',
    ],
  },
  {
    id: 'vue-typing-generic-component',
    section: 'vue-typing',
    title: 'Generic components (generic="T")',
    summary:
      '`<script setup lang="ts" generic="T extends { id: string | number }">` infers `T` from the `items` you pass. Props, model, emits and scoped-slot `item` are all typed as your item type.',
    tags: ['generic', 'generics', 'scoped slots', 'List<T>', 'defineSlots'],
    snippet: selectListSrc,
    lang: 'vue',
    Demo: SelectListDemo,
    gotchas: [
      'A generic SFC compiles to a function, not a constructor, so `InstanceType<typeof C>` fails. Use `Parameters<typeof C<T>>[0]` for props, or `ComponentInstance` / `ComponentExposed` helpers for refs.',
      'Constrain `T` to what the template needs (`id` for `:key`); an unconstrained `T` cannot be used as a key.',
    ],
  },
  {
    id: 'vue-typing-component-refs',
    section: 'vue-typing',
    title: 'Typing template refs to components',
    summary:
      'Type a child-component ref as `InstanceType<typeof Child>`. Only what the child `defineExpose`s is visible, and exposed refs are unwrapped.',
    tags: ['useTemplateRef', 'InstanceType', 'ComponentInstance', 'defineExpose'],
    snippet: loginFormSrc,
    lang: 'vue',
    gotchas: [
      'Exposed `computed`/`ref` values are unwrapped on the instance (`isEmpty` is `boolean`, not `ComputedRef<boolean>`).',
      'With `strictTemplates`, undeclared attributes on components such as `aria-label` are type errors. Declare a prop or relax the setting.',
      'Vue exports `ComponentInstance<typeof C>`, an alternative that is equivalent for non-generic components.',
    ],
  },
  {
    id: 'vue-typing-injection-key',
    section: 'vue-typing',
    title: 'Typed provide/inject with InjectionKey',
    summary:
      '`InjectionKey<T>` ties a symbol to a type so `inject` returns `T | undefined`. Wrap it in a `useX()` helper that throws without a provider, so consumers get a plain `T`.',
    tags: ['InjectionKey', 'provide', 'inject', 'context', 'non-null'],
    snippet: contextSrc,
    gotchas: [
      'String keys (`inject(\'cart\')`) are untyped (`unknown`) and can collide. Use a `Symbol` key.',
      '`inject(key)` without a default logs "injection not found". Pass a default (`null`) when you handle the missing case yourself.',
    ],
  },
  {
    id: 'vue-typing-event-handlers',
    section: 'vue-typing',
    title: 'Typing DOM event handlers',
    summary:
      'Annotate the DOM event (`KeyboardEvent`, `MouseEvent`) and narrow `event.target`, which is only `EventTarget | null`. Template expressions are TypeScript, so inline handlers can be annotated too.',
    tags: ['events', 'KeyboardEvent', 'event.target', 'template', 'handlers'],
    snippet: tagInputSrc,
    lang: 'vue',
    gotchas: [
      'Use `event.currentTarget` (the element the listener is on) when children can be the `target`. Cast whichever you use; there is no generic `Event<T>`.',
      'Check `event.isComposing` before acting on Enter, or IME users (Chinese, Japanese, Korean…) submit half-typed text.',
    ],
  },
  {
    id: 'vue-typing-prop-type',
    section: 'vue-typing',
    title: 'PropType<T> in defineComponent',
    summary:
      'Runtime props declare constructors (`Array`, `String`), and `as PropType<T>` narrows them. `ExtractPublicPropTypes` turns the props object into the public props type.',
    tags: ['PropType', 'defineComponent', 'runtime props', 'ExtractPublicPropTypes', 'Options API'],
    snippet: progressBarSrc,
    gotchas: [
      'Object/array `default`s must be factories, but for `type: Function` the default is the function itself.',
      'Use arrow functions for `validator` / `default`. Method syntax can break `this` inference in the Options API.',
      'Use `ExtractPublicPropTypes` for what parents pass; `ExtractPropTypes` is the internal view, where defaulted props are required.',
    ],
  },
  {
    id: 'vue-typing-component-props',
    section: 'vue-typing',
    title: 'Extracting props from a component',
    summary:
      'Vue 3.5 has no `ComponentProps` export. Read `$props` off the instance type for SFCs/`defineComponent` and the first parameter for generic SFCs, then reuse prop types without re-declaring them.',
    tags: ['ComponentProps', 'InstanceType', '$props', 'type helpers', 'wrapper components'],
    snippet: componentPropsSrc,
    gotchas: [
      '`$props` includes `onX` listener props plus `class`/`style`/`key`/`ref` (VNodeProps and AllowedComponentProps), so `Pick` what you forward.',
      '`vue-component-type-helpers` (from the Vue language tools) ships production-grade `ComponentProps` / `ComponentSlots` / `ComponentExposed` if you can add a dependency.',
    ],
  },
  {
    id: 'vue-typing-composable-return',
    section: 'vue-typing',
    title: 'Typing composable return values',
    summary:
      'Give composables an explicit return interface. Return an object of refs (destructurable) and expose state as `Readonly<Ref<T>>` with actions as the only way to change it.',
    tags: ['composables', 'Readonly<Ref>', 'ComputedRef', 'return type', 'readonly'],
    snippet: useCounterSrc,
    gotchas: [
      'Returning `reactive({...})` breaks reactivity when destructured. Return refs, or callers must use `toRefs`.',
      '`readonly(ref)` is enforced at runtime too: writes are ignored with a dev warning, not just rejected by the compiler.',
    ],
  },
  {
    id: 'vue-typing-maybe-ref-or-getter',
    section: 'vue-typing',
    title: 'MaybeRefOrGetter + toValue',
    summary:
      'Accept `MaybeRefOrGetter<T>` so callers can pass a value, a ref/computed or a getter like `() => props.amount`. Unwrap it with `toValue()` inside a `computed` / `watchEffect` so it is tracked.',
    tags: ['MaybeRefOrGetter', 'MaybeRef', 'toValue', 'composables', 'getters'],
    snippet: useCurrencySrc,
    gotchas: [
      'Calling `toValue()` outside a reactive scope reads once. Do it inside `computed` / `watch` / `watchEffect`.',
      '`MaybeRef<T>` excludes getters, and `unref()` does not call them. Prefer `MaybeRefOrGetter` + `toValue` (3.3+).',
    ],
  },
];
