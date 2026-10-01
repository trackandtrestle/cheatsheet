<script lang="ts">
import type { InjectionKey, Ref } from 'vue';

export type Theme = 'light' | 'dark';
export interface ThemeContext {
  theme: Readonly<Ref<Theme>>;
  toggle: () => void;
}
// A normal <script> block can export; <script setup> cannot.
export const themeKey: InjectionKey<ThemeContext> = Symbol('theme');
</script>

<script setup lang="ts">
import { provide, readonly, ref } from 'vue';

const { initial = 'light' } = defineProps<{ initial?: Theme }>();
const theme = ref<Theme>(initial);

// Provide a ref (stays reactive) as readonly, plus the one sanctioned way to change it.
provide(themeKey, {
  theme: readonly(theme),
  toggle: () => (theme.value = theme.value === 'light' ? 'dark' : 'light'),
});
</script>

<template>
  <div :data-theme="theme"><slot /></div>
</template>
