import type { Section } from './types';

export const SECTIONS: readonly Section[] = [
  { id: 'timing', title: 'Timing', blurb: 'Timers, promises, debounce, throttle, cancellation and async control flow.' },
  { id: 'arrays', title: 'Arrays / lists', blurb: 'Iteration, sorting, immutable methods, grouping and classic algorithms.' },
  { id: 'sets-maps', title: 'Sets & Maps', blurb: 'Set algebra, Map vs object, weak collections and caches.' },
  { id: 'immutable-state', title: 'Immutable state', blurb: 'Updating arrays, sets, maps and nested objects in React state.' },
  { id: 'ts-features', title: 'TypeScript features', blurb: 'Utility, mapped, conditional and template literal types; narrowing and generics.' },
  { id: 'react-typing', title: 'React typing', blurb: 'Typing props, events, refs, context and generic components.' },
  { id: 'react-features', title: 'React features', blurb: 'Hooks, concurrent features, React 19 APIs and custom hooks.' },
  { id: 'testing', title: 'Testing Library', blurb: 'Queries, user-event, fake timers, mocking and async races.' },
  { id: 'dom-a11y', title: 'DOM & a11y', blurb: 'Accessible widgets, focus management, observers and delegation.' },
];
