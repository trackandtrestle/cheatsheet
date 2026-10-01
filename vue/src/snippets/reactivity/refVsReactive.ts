import { reactive, ref } from 'vue';

interface Filters {
  query: string;
  tags: string[];
}

const emptyFilters = (): Filters => ({ query: '', tags: [] });

// ref: holds ANY value (primitives too), is deeply reactive for objects,
// and can be replaced wholesale. Default choice.
export function useFilters() {
  const filters = ref<Filters>(emptyFilters());
  const addTag = (tag: string) => filters.value.tags.push(tag); // deep mutation is tracked
  const reset = () => {
    filters.value = emptyFilters(); // replacing .value is fine
  };
  return { filters, addTag, reset };
}

// reactive: objects/collections only, no `.value` — but the variable can never be
// reassigned without breaking bindings, and destructuring it loses reactivity.
export function useForm() {
  const form = reactive({ name: '', email: '' });
  const reset = () => Object.assign(form, { name: '', email: '' }); // mutate, don't replace
  return { form, reset };
}
