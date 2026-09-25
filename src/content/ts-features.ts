import type { Entry } from './types';
import utilityShapeSrc from '../snippets/ts-features/utilityShape.ts?raw';
import pickOmitRecordSrc from '../snippets/ts-features/pickOmitRecord.ts?raw';
import functionTypesSrc from '../snippets/ts-features/functionTypes.ts?raw';
import unionFiltersSrc from '../snippets/ts-features/unionFilters.ts?raw';
import discriminatedUnionSrc from '../snippets/ts-features/discriminatedUnion.ts?raw';
import typeGuardsSrc from '../snippets/ts-features/typeGuards.ts?raw';
import assertionFunctionsSrc from '../snippets/ts-features/assertionFunctions.ts?raw';
import satisfiesSrc from '../snippets/ts-features/satisfies.ts?raw';
import asConstSrc from '../snippets/ts-features/asConst.ts?raw';
import keyofTypeofSrc from '../snippets/ts-features/keyofTypeof.ts?raw';
import indexedAccessSrc from '../snippets/ts-features/indexedAccess.ts?raw';
import mappedTypesSrc from '../snippets/ts-features/mappedTypes.ts?raw';
import conditionalInferSrc from '../snippets/ts-features/conditionalInfer.ts?raw';
import distributiveSrc from '../snippets/ts-features/distributive.ts?raw';
import templateLiteralSrc from '../snippets/ts-features/templateLiteral.ts?raw';
import genericsSrc from '../snippets/ts-features/generics.ts?raw';
import overloadsSrc from '../snippets/ts-features/overloads.ts?raw';
import brandedSrc from '../snippets/ts-features/branded.ts?raw';
import unknownVsAnySrc from '../snippets/ts-features/unknownVsAny.ts?raw';

export const tsFeaturesEntries: Entry[] = [
  {
    id: 'ts-features-partial-required-readonly',
    section: 'ts-features',
    title: 'Partial / Required / Readonly',
    summary: 'Toggle the `?` and `readonly` modifiers on every key of an object type — patch payloads, resolved configs, immutable inputs.',
    tags: ['utility types', 'Partial', 'Required', 'Readonly', 'optional'],
    snippet: utilityShapeSrc,
    gotchas: [
      '`Readonly<T>` is shallow: nested arrays and objects stay mutable. It is also compile-time only (no `Object.freeze`).',
      '`Partial` allows `{ name: undefined }` unless `exactOptionalPropertyTypes` is on — spreading it can overwrite a real value with `undefined`.',
    ],
  },
  {
    id: 'ts-features-pick-omit-record',
    section: 'ts-features',
    title: 'Pick / Omit / Record',
    summary: '`Pick` and `Omit` select object keys; `Record<K, V>` builds an object type from a key union (exhaustive) or `string` (dictionary).',
    tags: ['utility types', 'Pick', 'Omit', 'Record', 'dictionary'],
    snippet: pickOmitRecordSrc,
    gotchas: [
      '`Omit<T, K>` does not require `K` to be a key of `T`: a typo silently omits nothing. `Pick` does check.',
      '`Omit` on a union is not distributive — it keeps only the shared keys (see Distributive conditional types).',
      'With `noUncheckedIndexedAccess`, `Record<string, V>` lookups are `V | undefined`; prefer a `Map` for truly dynamic keys.',
    ],
  },
  {
    id: 'ts-features-returntype-parameters-awaited',
    section: 'ts-features',
    title: 'ReturnType / Parameters / Awaited',
    summary: 'Derive types from existing functions instead of duplicating them — ideal for wrappers such as retry, logging or memoisation.',
    tags: ['utility types', 'ReturnType', 'Parameters', 'Awaited', 'typeof', 'wrapper'],
    snippet: functionTypesSrc,
    gotchas: [
      'Pass the function TYPE: `ReturnType<typeof fn>`, not `ReturnType<fn>`.',
      'For an overloaded function these utilities only see the LAST overload signature.',
      '`ReturnType` of an async function is a `Promise<…>`; wrap it in `Awaited` to get the resolved value.',
    ],
  },
  {
    id: 'ts-features-extract-exclude-nonnullable',
    section: 'ts-features',
    title: 'Extract / Exclude / NonNullable',
    summary: 'Filter the members of a union type: keep matches (`Extract`), drop them (`Exclude`), or drop `null | undefined` (`NonNullable`).',
    tags: ['utility types', 'Extract', 'Exclude', 'NonNullable', 'union', 'filter'],
    snippet: unionFiltersSrc,
    gotchas: [
      '`Extract`/`Exclude` work on union members; `Pick`/`Omit` work on object keys — easy to mix up.',
      '`Exclude<T, U>` does not check that `U` overlaps `T`, so a stale type argument silently does nothing.',
    ],
  },
  {
    id: 'ts-features-discriminated-unions',
    section: 'ts-features',
    title: 'Discriminated unions + assertNever',
    summary: 'Tag each variant with a literal field and `switch` on it: TypeScript narrows each branch, and `assertNever` turns a forgotten variant into a compile error.',
    tags: ['discriminated union', 'tagged union', 'never', 'exhaustive', 'switch', 'narrowing'],
    snippet: discriminatedUnionSrc,
    gotchas: [
      "The discriminant must be a literal type (`'success'`, `true`, `404`); a field typed `string` does not narrow anything.",
      '`assertNever` also throws at runtime, which catches bad data from the network that the types did not anticipate.',
    ],
  },
  {
    id: 'ts-features-type-guards',
    section: 'ts-features',
    title: 'Type guards (x is T)',
    summary: 'A function returning `value is T` narrows its argument in the caller — the standard way to validate `unknown` data and to filter arrays.',
    tags: ['type guard', 'type predicate', 'narrowing', 'unknown', 'in', 'filter'],
    snippet: typeGuardsSrc,
    gotchas: [
      'The compiler trusts the predicate blindly: a buggy guard body lies to every caller.',
      'Since TS 5.5 simple arrow predicates like `xs.filter((x) => x !== null)` infer the guard automatically.',
    ],
  },
  {
    id: 'ts-features-assertion-functions',
    section: 'ts-features',
    title: 'Assertion functions (asserts x is T)',
    summary: 'A function typed `asserts value is T` throws on failure and narrows the value for the rest of the scope — no `!` or nested `if` needed.',
    tags: ['asserts', 'assertion', 'narrowing', 'invariant', 'non-null'],
    snippet: assertionFunctionsSrc,
    gotchas: [
      'Arrow-function asserters must be called through a name with an EXPLICIT type annotation, or TS errors with "Assertions require every name in the call target to be declared with an explicit type annotation".',
      'Assertion functions must return `void`; they signal failure only by throwing.',
    ],
  },
  {
    id: 'ts-features-satisfies',
    section: 'ts-features',
    title: 'satisfies vs type annotation',
    summary: '`satisfies` validates a value against a type without widening it: you keep literal keys and precise property types that an annotation would erase.',
    tags: ['satisfies', 'annotation', 'widening', 'inference', 'as const', 'config'],
    snippet: satisfiesSrc,
    gotchas: [
      'An annotation (`const x: Record<string, Route>`) widens: `keyof typeof x` becomes `string` and every lookup may be `undefined`.',
      '`satisfies` alone keeps objects mutable and strings widened to `string`; combine as `as const satisfies T` for literals.',
    ],
  },
  {
    id: 'ts-features-as-const',
    section: 'ts-features',
    title: 'as const + union from a const array',
    summary: '`as const` infers the narrowest literal, deeply readonly type — use it to derive a union type from a runtime array so both stay in sync.',
    tags: ['as const', 'const assertion', 'literal', 'readonly', 'union', 'typeof'],
    snippet: asConstSrc,
    gotchas: [
      '`as const` makes arrays `readonly`: they can no longer be passed to parameters typed `string[]` — accept `readonly T[]` instead.',
      '`ROLES.includes(someString)` does not compile because the parameter type is the literal union; widen the array (`as readonly string[]`).',
      'It is compile-time only: nothing is frozen at runtime.',
    ],
  },
  {
    id: 'ts-features-keyof-typeof',
    section: 'ts-features',
    title: 'keyof / typeof',
    summary: '`typeof value` lifts a runtime value into a type; `keyof T` turns its keys into a union — together they type-safe property access by key.',
    tags: ['keyof', 'typeof', 'generics', 'Object.keys', 'lookup'],
    snippet: keyofTypeofSrc,
    gotchas: [
      '`Object.keys(obj)` returns `string[]`, not `(keyof T)[]`, because objects can have extra keys at runtime. Casting is a deliberate choice.',
      '`keyof` of a type with an index signature `{ [k: string]: V }` is `string | number`.',
    ],
  },
  {
    id: 'ts-features-indexed-access',
    section: 'ts-features',
    title: "Indexed access types (T['k'], T[number])",
    summary: "Look up a property type with `T['key']`, an element type with `T[number]`, and all value types with `T[keyof T]` — without redeclaring anything.",
    tags: ['indexed access', 'lookup type', 'T[number]', 'element type', 'ValueOf'],
    snippet: indexedAccessSrc,
    gotchas: [
      "Use bracket syntax: `T['key']`; `T.key` is a namespace access and does not work on types.",
      '`T[number]` on an array type is not affected by `noUncheckedIndexedAccess` — the type does not include `undefined`.',
    ],
  },
  {
    id: 'ts-features-mapped-types',
    section: 'ts-features',
    title: 'Mapped types (modifiers, `as` remapping)',
    summary: 'Transform every property of a type: `[K in keyof T]`, remove modifiers with `-readonly`/`-?`, rename or filter keys with `as`.',
    tags: ['mapped types', 'key remapping', 'as', 'readonly', 'optional', 'Capitalize'],
    snippet: mappedTypesSrc,
    gotchas: [
      '`keyof T` includes `number` and `symbol` keys, so intersect with `string` (`K & string`) before using them in a template literal.',
      'Mapped types over `keyof T` are homomorphic: they preserve the original `readonly` and `?` modifiers unless you change them.',
    ],
  },
  {
    id: 'ts-features-conditional-infer',
    section: 'ts-features',
    title: 'Conditional types with infer',
    summary: '`T extends U ? X : Y` branches at the type level; `infer` captures part of the matched type — this is how `ReturnType`, `Awaited` and `Parameters` are built.',
    tags: ['conditional types', 'infer', 'pattern matching', 'tuple', 'recursive types'],
    snippet: conditionalInferSrc,
    gotchas: [
      'Conditional types on a generic parameter are deferred inside the function body, so returning a value often needs a cast.',
      'A type that does not match falls to the false branch — often `never`, which silently disappears in unions.',
    ],
  },
  {
    id: 'ts-features-distributive-conditionals',
    section: 'ts-features',
    title: 'Distributive conditional types',
    summary: 'A conditional on a naked type parameter runs once per union member; wrap in `[T]` to stop it. This is why `Omit` on a union needs a distributive variant.',
    tags: ['distributive', 'conditional types', 'union', 'never', 'Omit', 'DistributiveOmit'],
    snippet: distributiveSrc,
    gotchas: [
      '`Omit<A | B, K>` collapses to the keys common to all members — variant-specific props vanish. Use `DistributiveOmit`.',
      '`never` is the empty union, so `T extends never ? … : …` with `T = never` yields `never`. Check with `[T] extends [never]`.',
    ],
  },
  {
    id: 'ts-features-template-literal-types',
    section: 'ts-features',
    title: 'Template literal types',
    summary: 'Build string types from other types: every combination of unions, `Uppercase`/`Capitalize` intrinsics, and `infer` to parse strings like route params.',
    tags: ['template literal', 'string types', 'Capitalize', 'Uppercase', 'infer', 'event names', 'routes'],
    snippet: templateLiteralSrc,
    gotchas: [
      'Unions multiply: three unions of 10 members produce 1 000 members — large cross products slow the compiler (limit is 100 000).',
      'A template string VALUE is typed `string` unless you add `as const`.',
    ],
  },
  {
    id: 'ts-features-generics',
    section: 'ts-features',
    title: 'Generics: constraints, defaults, const, NoInfer',
    summary: 'Constrain type parameters with `extends`, give them defaults, infer literals with `const T`, and stop an argument from widening inference with `NoInfer`.',
    tags: ['generics', 'constraints', 'extends', 'default type', 'const type parameter', 'NoInfer'],
    snippet: genericsSrc,
    gotchas: [
      'A type parameter used only once (e.g. `<T>(x: T): void`) adds nothing — use the constraint type directly.',
      'Without `NoInfer`, every argument is an inference site: `createMachine(["a"], "b")` would silently infer `"a" | "b"`.',
    ],
  },
  {
    id: 'ts-features-function-overloads',
    section: 'ts-features',
    title: 'Function overloads',
    summary: 'Several call signatures above one implementation let the return type depend on the argument type. A generic with a conditional return is often simpler.',
    tags: ['overloads', 'signatures', 'return type', 'conditional types'],
    snippet: overloadsSrc,
    gotchas: [
      'The implementation signature is not callable from outside — a union argument (`string | string[]`) matches no overload unless you add one.',
      'Overloads are tried top to bottom: put the most specific signatures first.',
    ],
  },
  {
    id: 'ts-features-branded-types',
    section: 'ts-features',
    title: 'Branded types (UserId)',
    summary: 'Intersect a primitive with a phantom tag so structurally identical values (`UserId`, `OrderId`, cents vs dollars) cannot be mixed up.',
    tags: ['branded types', 'nominal typing', 'opaque type', 'UserId', 'smart constructor'],
    snippet: brandedSrc,
    gotchas: [
      'The brand has zero runtime cost and zero runtime existence: validate in the constructor, since `as UserId` elsewhere bypasses it.',
      'Arithmetic on a branded number (`a + b`) returns a plain `number`; re-brand the result.',
    ],
  },
  {
    id: 'ts-features-unknown-vs-any',
    section: 'ts-features',
    title: 'unknown vs any (parsing JSON)',
    summary: '`any` turns type checking off; `unknown` accepts anything but must be narrowed before use. Treat `JSON.parse` and `fetch().json()` results as `unknown`.',
    tags: ['unknown', 'any', 'JSON.parse', 'narrowing', 'validation', 'type safety'],
    snippet: unknownVsAnySrc,
    gotchas: [
      '`any` is contagious: `JSON.parse` returns `any`, and everything derived from it is `any` too — annotate the result as `unknown` immediately.',
      "`catch (e)` is `unknown` under `strict` (`useUnknownInCatchVariables`) — narrow with `instanceof Error`.",
      'For non-trivial shapes, a schema library (zod, valibot) gives you validation and the type from one definition.',
    ],
  },
];
