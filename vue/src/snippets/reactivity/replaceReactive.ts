import { computed, reactive, ref } from 'vue';

interface Form {
  name: string;
}
const blank = (): Form => ({ name: '' });

// ✗ Rebinding the variable: everything that already read `form` keeps the OLD proxy.
export function useBrokenForm() {
  let form = reactive(blank());
  const summary = computed(() => form.name);
  const edit = (name: string) => (form.name = name);
  const reset = () => (form = reactive(blank()));
  return { summary, edit, reset };
}

// ✓ Mutate the existing proxy...
export function useFormAssign() {
  const form = reactive(blank());
  const summary = computed(() => form.name);
  const edit = (name: string) => (form.name = name);
  const reset = () => Object.assign(form, blank());
  return { summary, edit, reset };
}

// ✓ ...or use a ref, whose `.value` is meant to be replaced.
export function useFormRef() {
  const form = ref(blank());
  const summary = computed(() => form.value.name);
  const edit = (name: string) => (form.value.name = name);
  const reset = () => (form.value = blank());
  return { summary, edit, reset };
}
