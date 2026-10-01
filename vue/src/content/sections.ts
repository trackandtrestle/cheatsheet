import type { Section } from './types';

export const SECTIONS: readonly Section[] = [
  { id: 'timing', title: 'Timing', blurb: 'Timers, promises, debounce, throttle, cancellation and timing composables.' },
  { id: 'reactivity', title: 'Reactivity', blurb: 'ref, reactive, computed, watchers and the traps that silently break tracking.' },
  { id: 'components', title: 'Components & SFCs', blurb: 'Props, emits, v-model, slots, provide/inject and the built-in components.' },
  { id: 'composables', title: 'Composables', blurb: 'Reusable stateful logic with the Composition API, cleanup included.' },
  { id: 'vue-typing', title: 'Vue + TypeScript', blurb: 'Typing props, emits, slots, refs, injections and generic components.' },
  { id: 'arrays', title: 'Arrays / lists', blurb: 'Iteration, sorting, immutable methods, grouping and classic algorithms.' },
  { id: 'sets-maps', title: 'Sets & Maps', blurb: 'Set algebra, Map vs object, weak collections and caches.' },
  { id: 'ts-features', title: 'TypeScript features', blurb: 'Utility, mapped, conditional and template literal types; narrowing and generics.' },
  { id: 'testing', title: 'Testing', blurb: 'Vue Test Utils, Testing Library, fake timers, mocking and async flushing.' },
  { id: 'dom-a11y', title: 'DOM & a11y', blurb: 'Accessible widgets, focus management, directives and observers.' },
];
