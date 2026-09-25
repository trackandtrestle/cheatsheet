import { beforeEach, describe, expect, it, vi } from 'vitest';
import { wireTodoList } from './delegate';

const row = (id: string) =>
  `<li data-id="${id}">Task ${id}<button data-action="done"><span>✓</span></button>` +
  `<button data-action="delete">✕</button></li>`;

describe('event delegation', () => {
  let list: HTMLUListElement;
  beforeEach(() => {
    // The list itself sits inside another [data-action] element (e.g. a clickable card).
    document.body.innerHTML = `<div data-action="archive" data-id="card"><ul>${row('1')}</ul></div>`;
    list = document.querySelector('ul')!;
  });

  it('handles nested targets and rows added later', () => {
    const onAction = vi.fn();
    wireTodoList(list, onAction);
    list.querySelector('span')!.click(); // click lands on the <span> inside the button
    expect(onAction).toHaveBeenLastCalledWith('done', '1');

    list.insertAdjacentHTML('beforeend', row('2')); // no new listener needed
    list.querySelector<HTMLElement>('[data-id="2"] [data-action="delete"]')!.click();
    expect(onAction).toHaveBeenLastCalledWith('delete', '2');
  });

  it('ignores matches outside root and stops after cleanup', () => {
    const onAction = vi.fn();
    const off = wireTodoList(list, onAction);
    list.querySelector('li')!.click(); // closest() finds the OUTER card — rejected
    expect(onAction).not.toHaveBeenCalled();
    off();
    list.querySelector<HTMLElement>('[data-action="done"]')!.click();
    expect(onAction).not.toHaveBeenCalled();
  });
});
