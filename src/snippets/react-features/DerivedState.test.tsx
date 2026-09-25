import { describe, expect, it } from 'vitest';
import { renderToString } from 'react-dom/server';
import { render, screen } from '@testing-library/react';
import { VisibleTodos, VisibleTodosEffect, type Todo } from './DerivedState';

const todos: Todo[] = [
  { id: 1, text: 'write tests', done: true },
  { id: 2, text: 'ship it', done: false },
];

describe('derive state during render', () => {
  it('derived version is correct on the very first render (even SSR)', () => {
    expect(renderToString(<VisibleTodos todos={todos} showDone={false} />)).toContain('ship it');
  });

  it('effect version renders an empty list first (effects never run on the server)', () => {
    expect(renderToString(<VisibleTodosEffect todos={todos} showDone={false} />)).not.toContain('<li>');
  });

  it('both converge in the browser, and derived updates synchronously on rerender', () => {
    const { rerender } = render(<VisibleTodos todos={todos} showDone={false} />);
    expect(screen.getAllByRole('listitem')).toHaveLength(1);
    rerender(<VisibleTodos todos={todos} showDone />);
    expect(screen.getAllByRole('listitem')).toHaveLength(2);

    render(<VisibleTodosEffect todos={todos} showDone={false} />);
    expect(screen.getAllByText('ship it')).toHaveLength(2);
  });
});
