import { computed, ref } from 'vue';

export function useFullName() {
  const first = ref('Ada');
  const last = ref('Lovelace');

  // get/set: the setter writes back to the sources; the getter stays the source of truth.
  const fullName = computed({
    get: () => `${first.value} ${last.value}`.trim(),
    set: (value: string) => {
      const [head = '', ...rest] = value.trim().split(/\s+/);
      first.value = head;
      last.value = rest.join(' ');
    },
  });

  return { first, last, fullName };
}

// 3.4+: the getter receives the previous value — e.g. keep the last valid result.
export function useLastValidNumber() {
  const input = ref('0');
  const value = computed<number>((previous) => {
    const parsed = Number(input.value);
    return Number.isFinite(parsed) ? parsed : (previous ?? 0);
  });
  return { input, value };
}
