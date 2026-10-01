import { shallowRef } from 'vue';

export function useToggle(initial = false) {
  const value = shallowRef(initial);
  // The typeof guard makes `@click="toggle"` safe at runtime: Vue passes the
  // MouseEvent as `next`, which would otherwise be stored as a truthy object.
  const toggle = (next?: boolean | Event) => {
    value.value = typeof next === 'boolean' ? next : !value.value;
  };
  return [value, toggle] as const; // tuple: rename freely, like useState
}
