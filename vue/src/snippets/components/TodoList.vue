<script setup lang="ts">
interface Todo {
  id: number;
  text: string;
  done: boolean;
}

const { todos } = defineProps<{ todos: Todo[] }>();
</script>

<template>
  <ul v-if="todos.length">
    <li v-for="(todo, index) in todos" :key="todo.id">
      <!-- Scoped slot: the child hands data UP to the parent's slot content -->
      <slot name="item" :todo="todo" :index="index">
        {{ todo.text }}
      </slot>
    </li>
  </ul>
  <slot v-else name="empty">
    <p>Nothing to do.</p>
  </slot>
</template>
