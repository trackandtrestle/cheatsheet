<script setup lang="ts">
// Named model: parent writes <TitleEditor v-model:title.capitalize="t" v-model:body="b" />.
// The tuple's second item holds the modifiers used on that v-model.
const [title, titleModifiers] = defineModel<string, 'capitalize'>('title', {
  required: true,
  set(value) {
    return titleModifiers.capitalize ? value.charAt(0).toUpperCase() + value.slice(1) : value;
  },
});
const body = defineModel<string>('body', { default: '' });
</script>

<template>
  <label>
    Title
    <input v-model="title" />
  </label>
  <label>
    Body
    <textarea v-model="body" />
  </label>
</template>
