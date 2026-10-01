import { reactive, ref, watch } from 'vue';

export function watchSources(log: (msg: string) => void) {
  const count = ref(0);
  const user = reactive({ name: 'Ada', address: { city: 'London' } });

  // A ref
  watch(count, (next, prev) => log(`ref ${prev}->${next}`));
  // A getter — the way to watch one property of a reactive object
  watch(() => user.name, (name) => log(`getter ${name}`));
  // An array of sources — callback gets arrays of new / old values
  watch([count, () => user.name], ([c, name]) => log(`array ${c} ${name}`));
  // A reactive object: implicitly DEEP — fires on any nested mutation
  watch(user, () => log('reactive (deep)'));
  // A getter returning an object: SHALLOW — fires only when it is replaced
  watch(() => user.address, () => log('getter (shallow)'));

  // watch(user.name, ...) ✗ passes a string, not a reactive source
  return { count, user };
}
