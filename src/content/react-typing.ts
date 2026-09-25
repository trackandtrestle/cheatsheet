import type { Entry } from './types';
import childrenSrc from '../snippets/react-typing/Children.tsx?raw';
import buttonSrc from '../snippets/react-typing/Button.tsx?raw';
import polymorphicSrc from '../snippets/react-typing/Polymorphic.tsx?raw';
import changeEventsSrc from '../snippets/react-typing/ChangeEvents.tsx?raw';
import pointerKeyboardSrc from '../snippets/react-typing/PointerKeyboard.tsx?raw';
import formSubmitSrc from '../snippets/react-typing/FormSubmit.tsx?raw';
import listSrc from '../snippets/react-typing/List.tsx?raw';
import selectSrc from '../snippets/react-typing/Select.tsx?raw';
import refPropSrc from '../snippets/react-typing/RefProp.tsx?raw';
import forwardRefSrc from '../snippets/react-typing/ForwardRef.tsx?raw';
import typedContextSrc from '../snippets/react-typing/TypedContext.tsx?raw';
import { SelectDemo } from '../demos/react-typing/SelectDemo';
import { SignupDemo } from '../demos/react-typing/SignupDemo';
import { ToolbarDemo } from '../demos/react-typing/ToolbarDemo';

export const reactTypingEntries: Entry[] = [
  {
    id: 'react-typing-children',
    section: 'react-typing',
    title: 'Typing children (ReactNode vs PropsWithChildren)',
    summary: 'Declare `children: ReactNode` when it is required, use `PropsWithChildren<P>` for optional children, and a function type for render props.',
    tags: ['children', 'ReactNode', 'PropsWithChildren', 'render prop', 'React.FC'],
    snippet: childrenSrc,
    gotchas: [
      '`React.FC` no longer adds `children` implicitly (since React 18) — declare it.',
      '`JSX.Element` / `ReactElement` is too narrow for children: it rejects strings, numbers, `null` and arrays.',
    ],
  },
  {
    id: 'react-typing-component-props',
    section: 'react-typing',
    title: 'Extending native props (ComponentProps)',
    summary: "Extend `ComponentProps<'button'>` to accept every native attribute, and `Omit` a native prop to replace it with a friendlier signature.",
    tags: ['ComponentProps', 'ComponentPropsWithoutRef', 'native props', 'wrapper', 'Omit', 'button'],
    snippet: buttonSrc,
    gotchas: [
      "In React 19 `ComponentProps<'button'>` includes `ref`, so spreading `...rest` forwards it automatically. Use `ComponentPropsWithoutRef` when the ref must not reach that element.",
      'Default `type="button"`: a bare `<button>` inside a form is a submit button.',
      'Put `{...rest}` before props you must control, or callers can override them.',
    ],
  },
  {
    id: 'react-typing-polymorphic-as',
    section: 'react-typing',
    title: 'Polymorphic `as` prop',
    summary: 'A generic `E extends ElementType` lets a component render as any element or component, accepting exactly that element\'s props.',
    tags: ['polymorphic', 'as prop', 'ElementType', 'generic component', 'design system'],
    snippet: polymorphicSrc,
    gotchas: [
      'Omit the keys you define yourself (`as`, `children`) from the element props, or conflicting types intersect into `never`.',
      'Polymorphic types get expensive for the compiler on large unions; many design systems prefer an `asChild`/Slot pattern.',
    ],
  },
  {
    id: 'react-typing-change-events',
    section: 'react-typing',
    title: 'Change events (ChangeEvent, ChangeEventHandler)',
    summary: 'Type an extracted handler as `ChangeEvent<HTMLInputElement>` or the whole function as `ChangeEventHandler<HTMLSelectElement>`; inline handlers infer it.',
    tags: ['ChangeEvent', 'ChangeEventHandler', 'onChange', 'input', 'select', 'checkbox', 'events'],
    snippet: changeEventsSrc,
    gotchas: [
      'Read `e.currentTarget` (typed as the element) rather than `e.target`; for change events React types both the same, but for other events `target` is just `EventTarget`.',
      'Checkboxes: read `.checked`, not `.value` (which is always `"on"`).',
      'Hover the JSX attribute (e.g. `onChange`) in your editor to see the exact handler type to use.',
    ],
  },
  {
    id: 'react-typing-keyboard-mouse-events',
    section: 'react-typing',
    title: 'Keyboard & mouse events (target vs currentTarget)',
    summary: '`KeyboardEvent<T>` and `MouseEvent<T>` are typed by the element the handler is attached to — `currentTarget`. `target` is whatever was actually hit.',
    tags: ['KeyboardEvent', 'MouseEvent', 'target', 'currentTarget', 'event delegation', 'shortcuts'],
    snippet: pointerKeyboardSrc,
    Demo: ToolbarDemo,
    gotchas: [
      '`e.target` is only `EventTarget` because events bubble from children — narrow it with `instanceof Element` before using DOM APIs.',
      'Import the React types (`import type { MouseEvent } from "react"`) — the global DOM `MouseEvent` is a different type.',
      'Use `e.key`, not the deprecated `keyCode`/`which`.',
    ],
  },
  {
    id: 'react-typing-form-submit',
    section: 'react-typing',
    title: 'Form submit (SubmitEvent + FormData)',
    summary: 'Type the handler as `SubmitEvent<HTMLFormElement>`, read fields with `new FormData(e.currentTarget)` and narrow each `FormDataEntryValue` before use.',
    tags: ['SubmitEvent', 'FormEvent', 'FormData', 'onSubmit', 'forms', 'validation'],
    snippet: formSubmitSrc,
    Demo: SignupDemo,
    gotchas: [
      '`FormEvent` / `FormEventHandler` are deprecated in the React 19 types; use `SubmitEvent` for `onSubmit`.',
      '`formData.get()` returns `string | File | null` — check `typeof value === "string"` instead of casting.',
      'Call `e.preventDefault()` or the browser will perform a full-page submit.',
    ],
  },
  {
    id: 'react-typing-generic-list',
    section: 'react-typing',
    title: 'Generic component: List<T>',
    summary: 'A component with a type parameter infers `T` from `items`, then type-checks `renderItem` and `getKey` against it.',
    tags: ['generic component', 'List', 'renderItem', 'getKey', 'Key', 'render prop'],
    snippet: listSrc,
    gotchas: [
      'In `.tsx`, an arrow generic must be written `<T,>` (or `<T extends unknown>`) so it is not parsed as JSX.',
      'Type `getKey` as returning `Key` so objects cannot be used as React keys.',
    ],
  },
  {
    id: 'react-typing-generic-select',
    section: 'react-typing',
    title: 'Generic component: Select<T>',
    summary: 'A `<select>` wrapper that works with any option type and hands the selected object (not a string) to `onChange`.',
    tags: ['generic component', 'Select', 'controlled', 'options', 'useId'],
    snippet: selectSrc,
    Demo: SelectDemo,
    gotchas: [
      'DOM `<option value>` is always a string: map it back to the option with a stable `getValue` rather than using the array index.',
      '`T` is inferred from both `options` and `value`; for a nullable selection type it explicitly (`Select<Currency | null>`).',
    ],
  },
  {
    id: 'react-typing-ref-as-prop',
    section: 'react-typing',
    title: 'ref as a prop (React 19) + useImperativeHandle',
    summary: 'In React 19 function components receive `ref` like any other prop — type it `Ref<HTMLInputElement>`. Use `useImperativeHandle` to expose a narrow API.',
    tags: ['ref', 'Ref', 'React 19', 'useImperativeHandle', 'useRef', 'RefObject'],
    snippet: refPropSrc,
    gotchas: [
      '`useRef<HTMLInputElement>(null)` returns `RefObject<HTMLInputElement | null>` in React 19 — `current` must be null-checked.',
      'Type the prop as `Ref<T>` (accepts object and callback refs), not `RefObject<T>`.',
      'Prefer declarative props; reach for imperative handles only for focus, scroll, media and similar.',
    ],
  },
  {
    id: 'react-typing-forwardref',
    section: 'react-typing',
    title: 'forwardRef (legacy) and generics',
    summary: 'Pre-19 components need `forwardRef<RefType, Props>`. It erases type parameters, so generic components must re-assert their signature with a cast.',
    tags: ['forwardRef', 'ForwardedRef', 'legacy', 'generic component', 'ref'],
    snippet: forwardRefSrc,
    gotchas: [
      'The generic order `forwardRef<Ref, Props>` is the reverse of the render function\'s `(props, ref)`.',
      'Passing a generic function to `forwardRef` turns `T` into `unknown`; in React 19 skip `forwardRef` and take `ref` as a prop instead.',
    ],
  },
  {
    id: 'react-typing-typed-context',
    section: 'react-typing',
    title: 'Typed context with a non-null hook',
    summary: 'Create the context as `createContext<T | null>(null)` and expose a `useX()` hook that throws outside the provider, so consumers get a non-null `T`.',
    tags: ['context', 'createContext', 'useContext', 'provider', 'custom hook', 'null'],
    snippet: typedContextSrc,
    gotchas: [
      'A fake default (`createContext({} as Auth)`) hides a missing provider until something crashes at runtime.',
      'Memoise the value object, or every provider render re-renders all consumers.',
      'React 19 renders `<Context value>` directly; `<Context.Provider>` still works.',
    ],
  },
];
