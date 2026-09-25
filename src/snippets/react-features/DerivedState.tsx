import { useEffect, useState } from 'react';

export interface Todo { id: number; text: string; done: boolean }
interface Props { todos: Todo[]; showDone: boolean }

const TodoList = ({ items }: { items: Todo[] }) => (
  <ul>{items.map((t) => <li key={t.id}>{t.text}</li>)}</ul>
);

// Bad: mirror props into state with an effect. The first paint shows stale
// data, every change costs an extra render, and SSR never runs the effect.
export function VisibleTodosEffect({ todos, showDone }: Props) {
  const [visible, setVisible] = useState<Todo[]>([]);
  useEffect(() => {
    setVisible(showDone ? todos : todos.filter((t) => !t.done));
  }, [todos, showDone]);
  return <TodoList items={visible} />;
}

// Good: derive it during render. Add useMemo only if profiling says it's slow.
export function VisibleTodos({ todos, showDone }: Props) {
  const visible = showDone ? todos : todos.filter((t) => !t.done);
  return <TodoList items={visible} />;
}
