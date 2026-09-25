import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Count, List } from './List';

interface Todo {
  id: number;
  title: string;
  done: boolean;
}

const todos: Todo[] = [
  { id: 1, title: 'Write tests', done: true },
  { id: 2, title: 'Ship', done: false },
];

describe('generic List<T>', () => {
  it('renders items through renderItem', () => {
    render(<List items={todos} getKey={(t) => t.id} renderItem={(t, i) => `${i + 1}. ${t.title}`} />);
    expect(screen.getAllByRole('listitem').map((li) => li.textContent)).toEqual([
      '1. Write tests',
      '2. Ship',
    ]);
  });

  it('shows the empty state', () => {
    render(<List items={[]} getKey={String} renderItem={String} empty="No todos" />);
    expect(screen.getByText('No todos')).toBeInTheDocument();
    render(<Count items={todos} />);
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('infers T from items', () => {
    // @ts-expect-error — Todo has no `name`
    void (<List items={todos} getKey={(t) => t.id} renderItem={(t) => t.name} />);
    // @ts-expect-error — a key must be string | number | bigint
    void (<List items={todos} getKey={(t) => t} renderItem={(t) => t.title} />);
  });
});
