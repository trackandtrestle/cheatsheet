export interface Todo {
  id: string;
  text: string;
  done: boolean;
}

// Discriminated union: `type` narrows the payload in each case.
export type TodoAction =
  | { type: 'added'; id: string; text: string }
  | { type: 'toggled'; id: string }
  | { type: 'renamed'; id: string; text: string }
  | { type: 'removed'; id: string }
  | { type: 'clearedDone' };

export function todoReducer(state: readonly Todo[], action: TodoAction): readonly Todo[] {
  switch (action.type) {
    case 'added':
      return [...state, { id: action.id, text: action.text, done: false }];
    case 'toggled':
      return state.map((t) => (t.id === action.id ? { ...t, done: !t.done } : t));
    case 'renamed':
      return state.map((t) => (t.id === action.id ? { ...t, text: action.text } : t));
    case 'removed':
      return state.filter((t) => t.id !== action.id);
    case 'clearedDone':
      return state.filter((t) => !t.done);
    default: {
      // Adding a new action type without a case becomes a compile error here.
      const _exhaustive: never = action;
      return state;
    }
  }
}

// const [todos, dispatch] = useReducer(todoReducer, []);
// dispatch({ type: 'toggled', id });  // payload checked against the union
