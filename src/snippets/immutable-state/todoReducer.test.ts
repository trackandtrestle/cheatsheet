import { describe, expect, it } from 'vitest';
import type { Todo, TodoAction } from './todoReducer';
import { todoReducer } from './todoReducer';

const run = (actions: TodoAction[], start: readonly Todo[] = []) =>
  actions.reduce(todoReducer, start);

describe('todoReducer', () => {
  it('handles each action immutably', () => {
    const start = Object.freeze([] as Todo[]);
    const state = run(
      [
        { type: 'added', id: '1', text: 'write' },
        { type: 'added', id: '2', text: 'test' },
        { type: 'toggled', id: '1' },
        { type: 'renamed', id: '2', text: 'test more' },
      ],
      start,
    );
    expect(state).toEqual([
      { id: '1', text: 'write', done: true },
      { id: '2', text: 'test more', done: false },
    ]);
    expect(start).toEqual([]);
  });

  it('removes and clears done todos', () => {
    const state = run([
      { type: 'added', id: '1', text: 'a' },
      { type: 'added', id: '2', text: 'b' },
      { type: 'added', id: '3', text: 'c' },
      { type: 'toggled', id: '1' },
      { type: 'removed', id: '2' },
      { type: 'clearedDone' },
    ]);
    expect(state.map((t) => t.id)).toEqual(['3']);
  });

  it('rejects unknown actions at compile time', () => {
    // @ts-expect-error — 'archived' is not a TodoAction
    const bad: TodoAction = { type: 'archived', id: '1' };
    expect(todoReducer([], bad)).toEqual([]);
  });
});
