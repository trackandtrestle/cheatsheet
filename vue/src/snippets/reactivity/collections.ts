import { computed, reactive } from 'vue';

interface Todo {
  text: string;
  done: boolean;
}

// Vue tracks in-place mutation of arrays, Sets and Maps. React would need
// `setTodos(prev => [...prev, todo])` / `new Set(prev).add(id)` — here you just mutate.
export function useTodos() {
  const todos = reactive<Todo[]>([]);
  const selected = reactive(new Set<number>());
  const tagCounts = reactive(new Map<string, number>());

  const add = (text: string, tags: string[] = []) => {
    todos.push({ text, done: false });
    for (const tag of tags) tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1);
  };
  const toggleDone = (i: number) => {
    const todo = todos[i];
    if (todo) todo.done = !todo.done; // nested objects are reactive too
  };
  const toggleSelected = (i: number) => {
    if (!selected.delete(i)) selected.add(i);
  };
  const clear = () => todos.splice(0); // empty in place; `todos = []` would break bindings

  const remaining = computed(() => todos.filter((t) => !t.done).length);
  const selectedCount = computed(() => selected.size);
  return { todos, tagCounts, add, toggleDone, toggleSelected, clear, remaining, selectedCount };
}
