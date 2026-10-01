import { ref, watch } from 'vue';

export function watchOptions(log: (msg: string) => void) {
  const settings = ref({ theme: 'dark', editor: { tabSize: 2 } });

  // A ref holding an object is SHALLOW by default: only `settings.value = ...` fires.
  watch(settings, () => log('shallow'));
  // deep: true — any nested mutation (traverses everything: costly on big data).
  watch(settings, () => log('deep'), { deep: true });
  // 3.5: numeric depth — only the first level of keys of the object.
  watch(settings, () => log('depth 1'), { deep: 1 });
  // immediate: run once right away (oldValue is undefined on that call).
  watch(() => settings.value.theme, (t) => log(`immediate ${t}`), { immediate: true });
  // once: fire on the first change, then stop automatically (3.4+).
  watch(() => settings.value.theme, (t) => log(`once ${t}`), { once: true });

  return settings;
}
