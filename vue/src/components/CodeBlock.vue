<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import { highlight } from '../lib/highlight';
import type { SnippetLang } from '../content/types';

const props = defineProps<{ code: string; lang: SnippetLang }>();
const html = ref<string | null>(null);

watchEffect((onCleanup) => {
  let stale = false;
  onCleanup(() => (stale = true));
  const code = props.code.trimEnd();
  highlight(code, props.lang).then(
    (out) => !stale && (html.value = out),
    () => !stale && (html.value = null), // keep the plain fallback
  );
});
</script>

<template>
  <!-- Shiki output is generated from our own snippet files, never user input. -->
  <div v-if="html" class="code-host" tabindex="0" aria-label="Code snippet" v-html="html" />
  <pre v-else class="code shiki-fallback" tabindex="0" aria-label="Code snippet"><code>{{ code.trimEnd() }}</code></pre>
</template>
