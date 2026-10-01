<script setup lang="ts">
import { ref, useId } from 'vue';
import type { Entry } from '../content/types';
import CodeBlock from './CodeBlock.vue';
import CopyButton from './CopyButton.vue';
import DemoBoundary from './DemoBoundary.vue';
import { RichText } from './RichText';

const props = defineProps<{ entry: Entry; active: boolean }>();
const demoOpen = ref(props.entry.demoOpen ?? false);
const demoId = useId();
// Demos that open by default (the showcase) render above the code.
const demoFirst = props.entry.demoOpen === true;
</script>

<template>
  <article
    :id="entry.id"
    class="card"
    :class="{ 'card-active': active }"
    :aria-labelledby="`${entry.id}-title`"
    tabindex="-1"
  >
    <header class="card-head">
      <h3>
        <a :href="`#${entry.id}`" class="anchor" :aria-label="`Link to ${entry.title}`">#</a>
        <span :id="`${entry.id}-title`">{{ entry.title }}</span>
      </h3>
      <ul class="tags" aria-label="Tags">
        <li v-for="t in entry.tags" :key="t">{{ t }}</li>
        <li v-if="entry.lang === 'vue'" class="tag-sfc">SFC</li>
      </ul>
    </header>
    <p class="summary"><RichText :text="entry.summary" /></p>

    <template v-for="slot in demoFirst ? ['demo', 'code'] : ['code', 'demo']" :key="slot">
      <div v-if="slot === 'code'" class="code-wrap">
        <CopyButton :text="entry.snippet" :label="`Copy code for ${entry.title}`" />
        <CodeBlock :code="entry.snippet" :lang="entry.lang ?? 'ts'" />
      </div>

      <section v-else-if="entry.Demo" class="demo" :aria-label="`Live demo: ${entry.title}`">
        <button
          type="button"
          class="btn btn-small"
          :aria-expanded="demoOpen"
          :aria-controls="demoId"
          @click="demoOpen = !demoOpen"
        >
          {{ demoOpen ? 'Hide live demo' : 'Show live demo' }}
        </button>
        <div :id="demoId" class="demo-body" :hidden="!demoOpen">
          <DemoBoundary v-if="demoOpen">
            <component :is="entry.Demo" />
          </DemoBoundary>
        </div>
      </section>

      <details v-if="slot === 'code' && entry.gotchas?.length" class="gotchas">
        <summary>
          Gotchas <span class="count">{{ entry.gotchas.length }}</span>
        </summary>
        <ul>
          <li v-for="g in entry.gotchas" :key="g"><RichText :text="g" /></li>
        </ul>
      </details>
    </template>
  </article>
</template>
