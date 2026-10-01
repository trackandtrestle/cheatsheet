<script setup lang="ts">
import { computed, shallowRef } from 'vue';
import { useFetch, type Fetcher } from '../../snippets/composables/useFetch';

interface User {
  id: number;
  name: string;
}
const NAMES = ['Ada Lovelace', 'Grace Hopper', 'Alan Turing'];

// Fake network: 600 ms latency, honours AbortSignal, user 4 is a 404.
const fakeFetch: Fetcher = (url, { signal }) =>
  new Promise((resolve, reject) => {
    const id = Number(url.split('/').pop());
    const timer = setTimeout(() => {
      const name = NAMES[id - 1];
      resolve(name ? Response.json({ id, name }) : new Response(null, { status: 404 }));
    }, 600);
    signal.addEventListener('abort', () => {
      clearTimeout(timer);
      reject(signal.reason);
    });
  });

function parseUser(json: unknown): User {
  if (typeof json === 'object' && json !== null && 'id' in json && 'name' in json) {
    const { id, name } = json;
    if (typeof id === 'number' && typeof name === 'string') return { id, name };
  }
  throw new Error('Unexpected payload');
}

const userId = shallowRef(1);
const { state, refetch } = useFetch(() => `/api/users/${userId.value}`, parseUser, fakeFetch);
const busy = computed(() => state.value.status === 'loading');
</script>

<template>
  <div class="demo-row" role="group" aria-label="Pick a user">
    <button
      v-for="id in [1, 2, 3, 4]"
      :key="id"
      type="button"
      class="btn btn-small"
      :aria-pressed="userId === id"
      @click="userId = id"
    >
      User {{ id }}
    </button>
    <button type="button" class="btn btn-small" @click="refetch()">Refetch</button>
  </div>
  <p class="result" aria-live="polite" :aria-busy="busy">
    <span v-if="state.status === 'loading'">Loading… (click quickly: stale requests are aborted)</span>
    <span v-else-if="state.status === 'error'" class="demo-error">Error: {{ state.error.message }}</span>
    <span v-else-if="state.status === 'success'" class="mono">{{ state.data }}</span>
  </p>
</template>

<style scoped>
.result {
  margin: 10px 0 0;
  min-height: 1.5em;
}
</style>
