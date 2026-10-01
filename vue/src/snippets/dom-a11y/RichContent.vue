<script setup lang="ts">
defineProps<{ html: string }>(); // sanitized HTML only (e.g. rendered Markdown)
const emit = defineEmits<{ navigate: [path: string] }>();

// v-html content can't have Vue listeners: ONE delegated listener on the wrapper
// handles every link inside it, including HTML that is swapped in later.
function onClick(e: MouseEvent) {
  // Let the browser handle new-tab gestures (Cmd/Ctrl/Shift-click, middle button).
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  // target may be a <span>/<svg> INSIDE the link: walk up with closest()…
  const link = e.target instanceof Element ? e.target.closest('a') : null;
  // …but closest() can climb past the wrapper, so check containment.
  if (!link || !(e.currentTarget instanceof Element) || !e.currentTarget.contains(link)) return;
  const href = link.getAttribute('href') ?? '';
  const internal = href.startsWith('/') && !href.startsWith('//'); // `//host` is external!
  if (!internal || link.target === '_blank' || link.hasAttribute('download')) return;
  e.preventDefault();
  emit('navigate', href); // e.g. router.push(href)
}
</script>

<template>
  <div class="prose" @click="onClick" v-html="html" />
</template>
