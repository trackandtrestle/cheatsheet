import { computed, onScopeDispose, ref, watchEffect } from 'vue';

export type Theme = 'light' | 'dark';

function storedTheme(): Theme | null {
  try {
    const t = localStorage.getItem('theme');
    return t === 'light' || t === 'dark' ? t : null;
  } catch {
    return null;
  }
}

/** Follows `prefers-color-scheme` until the user explicitly toggles. */
export function useTheme() {
  const override = ref<Theme | null>(storedTheme());
  const mql = window.matchMedia?.('(prefers-color-scheme: dark)');
  const system = ref<Theme>(mql?.matches ? 'dark' : 'light');
  const onChange = () => (system.value = mql?.matches ? 'dark' : 'light');
  mql?.addEventListener('change', onChange);
  onScopeDispose(() => mql?.removeEventListener('change', onChange));

  watchEffect(() => {
    const root = document.documentElement;
    if (override.value) root.dataset.theme = override.value;
    else delete root.dataset.theme;
  });

  const theme = computed<Theme>(() => override.value ?? system.value);
  const toggle = () => {
    override.value = theme.value === 'dark' ? 'light' : 'dark';
    try {
      localStorage.setItem('theme', override.value);
    } catch {
      /* storage unavailable */
    }
  };
  return { theme, toggle };
}
