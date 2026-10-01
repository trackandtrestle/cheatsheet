<script setup lang="ts">
interface User {
  id: number;
  name: string;
}

const { id, load } = defineProps<{ id: number; load: (id: number) => Promise<User> }>();

// Top-level await makes setup async: this component must sit under <Suspense>.
// It runs once: changing `id` won't refetch. Re-key it (:key="id") to load again.
const user = await load(id);
</script>

<template>
  <p>Signed in as {{ user.name }}</p>
</template>
