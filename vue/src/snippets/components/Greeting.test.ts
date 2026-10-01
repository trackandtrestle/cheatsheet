import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/vue';
import Greeting from './Greeting.vue';

describe('defineProps with reactive destructure', () => {
  it('applies destructure defaults for omitted props', () => {
    render(Greeting, { props: { name: 'Ada' } });
    expect(screen.getByText('Hello, Ada.')).toBeInTheDocument();
  });

  it('stays reactive: computed and watch see new prop values', async () => {
    const { rerender } = render(Greeting, { props: { name: 'Ada', excited: true } });
    expect(screen.getByText('Hello, Ada!')).toBeInTheDocument();

    await rerender({ name: 'Grace', greeting: 'Hi', excited: true });
    expect(screen.getByText('Hi, Grace!')).toBeInTheDocument();
    expect(screen.getByText('renamed 1×')).toBeInTheDocument();
  });
});
