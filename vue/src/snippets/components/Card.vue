<script setup lang="ts">
import { useId } from 'vue';

const headingId = useId();
</script>

<template>
  <article class="card" :aria-labelledby="headingId">
    <header :id="headingId">
      <!-- Fallback content renders when the parent passes nothing for the slot -->
      <slot name="header">Untitled</slot>
    </header>
    <slot />
    <!-- $slots tells you which slots were passed: skip the empty wrapper -->
    <footer v-if="$slots.footer">
      <slot name="footer" />
    </footer>
  </article>
</template>
