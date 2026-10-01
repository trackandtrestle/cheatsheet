<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue';

const props = withDefaults(defineProps<{ text: string; label?: string }>(), { label: 'Copy code' });
const status = ref<'idle' | 'copied' | 'error'>('idle');
let timer: ReturnType<typeof setTimeout> | undefined;
onBeforeUnmount(() => clearTimeout(timer));

async function writeClipboard(text: string): Promise<void> {
  if (navigator.clipboard?.writeText) return navigator.clipboard.writeText(text);
  const ta = document.createElement('textarea'); // fallback for insecure contexts
  ta.value = text;
  ta.setAttribute('readonly', '');
  ta.style.cssText = 'position:fixed;opacity:0';
  document.body.appendChild(ta);
  ta.select();
  document.execCommand('copy');
  ta.remove();
}

async function copy() {
  try {
    await writeClipboard(props.text);
    status.value = 'copied';
  } catch {
    status.value = 'error';
  }
  clearTimeout(timer);
  timer = setTimeout(() => (status.value = 'idle'), 1500);
}
</script>

<template>
  <button type="button" class="btn btn-small copy-btn" :aria-label="label" @click="copy">
    <span aria-hidden="true">{{ status === 'copied' ? 'Copied!' : status === 'error' ? 'Failed' : 'Copy' }}</span>
    <span class="visually-hidden" role="status">
      {{ status === 'copied' ? 'Copied to clipboard' : status === 'error' ? 'Copy failed' : '' }}
    </span>
  </button>
</template>
