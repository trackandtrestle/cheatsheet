import { computed, ref, toValue, useId, watch, type MaybeRefOrGetter } from 'vue';

// ARIA 1.2 combobox: DOM focus stays on the <input>; aria-activedescendant names the active option.
export function useCombobox(options: MaybeRefOrGetter<readonly string[]>, onSelect: (value: string) => void) {
  const id = useId();
  const open = ref(false);
  const active = ref(-1);
  const list = computed(() => toValue(options));
  watch(list, () => (active.value = -1)); // options changed (typing, async results)
  const expanded = computed(() => open.value && list.value.length > 0);
  const optionId = (i: number) => `${id}-opt-${i}`;
  const close = () => { open.value = false; active.value = -1; };
  const select = (i: number) => { const v = list.value[i]; if (v !== undefined) onSelect(v); close(); };
  const move = (delta: 1 | -1) => {
    const n = list.value.length, i = active.value;
    open.value = true;
    if (n > 0) active.value = i === -1 && delta < 0 ? n - 1 : (i + delta + n) % n;
  };
  function onKeydown(e: KeyboardEvent) {
    if (e.key === 'ArrowDown') move(1);
    else if (e.key === 'ArrowUp') move(-1);
    else if (e.key === 'Enter' && expanded.value && active.value >= 0) select(active.value);
    else if (e.key === 'Escape' && expanded.value) close();
    else return;
    e.preventDefault(); // don't move the caret / submit the form
  }
  // Spread with v-bind="inputAttrs": on* keys become listeners.
  const inputAttrs = computed(() => ({
    role: 'combobox', 'aria-expanded': expanded.value, 'aria-controls': `${id}-list`, 'aria-autocomplete': 'list' as const,
    'aria-activedescendant': expanded.value && active.value >= 0 ? optionId(active.value) : undefined,
    onKeydown, onInput: () => { open.value = true; active.value = -1; }, onBlur: close,
  }));
  const listboxAttrs = computed(() => ({ id: `${id}-list`, role: 'listbox', hidden: !expanded.value }));
  const optionAttrs = (i: number) => ({
    id: optionId(i), role: 'option', 'aria-selected': i === active.value,
    onMousedown: (e: MouseEvent) => e.preventDefault(), onClick: () => select(i), // keep input focus
  });
  return { expanded, active, inputAttrs, listboxAttrs, optionAttrs };
}
