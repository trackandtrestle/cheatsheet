import { useId, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import type { Todo } from '../../snippets/immutable-state/arrayAddRemove';
import { append, removeById } from '../../snippets/immutable-state/arrayAddRemove';
import { moveById } from '../../snippets/immutable-state/moveItem';
import { updateById } from '../../snippets/immutable-state/updateById';
import './demos.css';

const seed: readonly Todo[] = [
  { id: 't1', text: 'Write the helper', done: true },
  { id: 't2', text: 'Test the helper', done: false },
  { id: 't3', text: 'Ship it', done: false },
];

export function ReorderTodosDemo() {
  const [todos, setTodos] = useState<readonly Todo[]>(seed);
  const [text, setText] = useState('');
  const [status, setStatus] = useState('');
  const inputId = useId();
  const nextId = useRef(seed.length + 1);

  const add = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    setTodos((prev) => append(prev, { id: `t${nextId.current++}`, text: trimmed, done: false }));
    setText('');
    setStatus(`Added “${trimmed}”.`);
  };

  const move = (todo: Todo, delta: -1 | 1) => {
    setTodos((prev) => moveById(prev, todo.id, delta));
    setStatus(`Moved “${todo.text}” ${delta < 0 ? 'up' : 'down'}.`);
  };

  return (
    <div className="imm-demo">
      <form className="demo-row" onSubmit={add}>
        <label htmlFor={inputId}>New todo</label>
        <input id={inputId} value={text} onChange={(e) => setText(e.target.value)} />
        <button type="submit" className="btn btn-small btn-primary">Add</button>
      </form>
      <ul className="imm-list" aria-label="Todos">
        {todos.map((todo, i) => (
          <li key={todo.id} className="imm-item">
            <label className="imm-grow">
              <input
                type="checkbox"
                checked={todo.done}
                onChange={() => setTodos((prev) => updateById(prev, todo.id, (t) => ({ ...t, done: !t.done })))}
              />{' '}
              <span className={todo.done ? 'imm-done' : undefined}>{todo.text}</span>
            </label>
            <button
              type="button"
              className="btn btn-small"
              aria-label={`Move “${todo.text}” up`}
              aria-disabled={i === 0}
              onClick={() => i > 0 && move(todo, -1)}
            >
              ↑
            </button>
            <button
              type="button"
              className="btn btn-small"
              aria-label={`Move “${todo.text}” down`}
              aria-disabled={i === todos.length - 1}
              onClick={() => i < todos.length - 1 && move(todo, 1)}
            >
              ↓
            </button>
            <button
              type="button"
              className="btn btn-small"
              aria-label={`Remove “${todo.text}”`}
              onClick={() => {
                setTodos((prev) => removeById(prev, todo.id));
                setStatus(`Removed “${todo.text}”.`);
              }}
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
      <p className="imm-status" role="status">{status}</p>
    </div>
  );
}
