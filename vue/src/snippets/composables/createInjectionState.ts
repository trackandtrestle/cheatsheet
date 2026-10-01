import { inject, provide, type InjectionKey } from 'vue';

/**
 * Turn any composable into "state scoped to a subtree": the ancestor calls
 * useProvide(...) once, descendants call useInject(). Each provider = its own
 * instance, so it's SSR/test safe (state lives in the app, not the module).
 */
export function createInjectionState<Args extends unknown[], State>(
  composable: (...args: Args) => State,
  name = 'InjectionState',
) {
  const key: InjectionKey<State> = Symbol(name);

  function useProvide(...args: Args): State {
    const state = composable(...args);
    provide(key, state);
    return state;
  }

  function useInject(): State {
    const state = inject(key, null); // explicit default: no "injection not found" warn
    if (state === null) throw new Error(`${name}: useInject() needs a useProvide() ancestor`);
    return state;
  }

  return [useProvide, useInject] as const;
}
