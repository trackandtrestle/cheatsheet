<script setup lang="ts">
import { reactive, toRefs } from 'vue';

const state = reactive({ count: 0 });
const { count: snapshot } = state; // plain number, copied once
const { count: linked } = toRefs(state); // Ref linked to state.count
</script>

<template>
  <div class="demo-row">
    <button type="button" class="btn btn-primary" @click="state.count++">state.count++</button>
    <button type="button" class="btn" @click="linked++">linked++ (via toRefs)</button>
  </div>
  <dl class="cols" aria-live="polite">
    <div>
      <dt>Destructured <code class="mono">const { count } = state</code></dt>
      <dd class="mono">{{ snapshot }}</dd>
    </div>
    <div>
      <dt>Via <code class="mono">toRefs(state)</code></dt>
      <dd class="mono">{{ linked }}</dd>
    </div>
    <div>
      <dt>Source <code class="mono">state.count</code></dt>
      <dd class="mono">{{ state.count }}</dd>
    </div>
  </dl>
</template>

<style scoped>
.cols {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 8px;
  margin: 12px 0 0;
}
.cols > div {
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 8px 10px;
  background: var(--surface-2);
}
dt {
  font-size: 13px;
  color: var(--muted);
}
dd {
  margin: 4px 0 0;
  font-size: 20px;
}
</style>
