import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/vue';
import { h } from 'vue';
import TodoList from './TodoList.vue';

const todos = [
  { id: 1, text: 'Write tests', done: true },
  { id: 2, text: 'Ship', done: false },
];

describe('scoped slots', () => {
  it('passes slot props to the parent template', () => {
    // <TodoList :todos><template #item="{ todo, index }">…</template></TodoList>
    render(TodoList, {
      props: { todos },
      slots: {
        item: ({ todo, index }: { todo: (typeof todos)[number]; index: number }) =>
          h('span', `${index + 1}. ${todo.text}${todo.done ? ' ✓' : ''}`),
      },
    });
    expect(screen.getAllByRole('listitem').map((li) => li.textContent)).toEqual(['1. Write tests ✓', '2. Ship']);
  });

  it('falls back to default content', () => {
    render(TodoList, { props: { todos } });
    expect(screen.getByText('Ship')).toBeInTheDocument();
  });

  it('renders the empty slot fallback', () => {
    render(TodoList, { props: { todos: [] } });
    expect(screen.getByText('Nothing to do.')).toBeInTheDocument();
  });
});
