import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/vue';
import TemplateUnwrap from './TemplateUnwrap.vue';

describe('template ref unwrapping', () => {
  it('unwraps top-level refs only', () => {
    render(TemplateUnwrap);
    expect(screen.getByTestId('top')).toHaveTextContent('2');
    expect(screen.getByTestId('nested')).toHaveTextContent('2');
    expect(screen.getByTestId('final')).toHaveTextContent('1');
    expect(screen.getByTestId('destructured')).toHaveTextContent('2');
  });
});
