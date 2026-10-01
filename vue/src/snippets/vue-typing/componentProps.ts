/**
 * Vue 3.5 has no `ComponentProps` export (vue-component-type-helpers has one).
 * Class-like components (SFCs, defineComponent) expose `$props` on the instance;
 * generic SFCs compile to functions whose first parameter is the props.
 */
export type ComponentProps<C> = C extends new (...args: never[]) => { $props: infer P }
  ? P
  : C extends (props: infer P, ...args: never[]) => unknown
    ? P
    : never;

/** What a parent reaches through a template ref (class-like components only). */
export type ComponentExposed<C> = C extends new (...args: never[]) => infer I ? I : never;

// Reuse a prop type without re-declaring it:
// type Tone = NonNullable<ComponentProps<typeof Alert>['tone']>;
