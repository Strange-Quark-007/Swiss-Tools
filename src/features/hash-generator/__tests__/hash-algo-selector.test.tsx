import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { SEARCH_PARAM_KEYS } from '@/constants/common';

import { HashAlgoSelector } from '../hash-algo-selector';
import { HASHING_ALGOS } from '../utils';

vi.mock('@/components/app-converter/selector', () => ({
  Selector: ({ type, options }: { type: SEARCH_PARAM_KEYS; options: unknown[] }) => (
    <div data-testid={`selector-${type}`} data-options-count={options.length}>
      Selector
    </div>
  ),
}));

describe('HashAlgoSelector', () => {
  it('should render Selector with correct type and algo options', () => {
    render(<HashAlgoSelector type={SEARCH_PARAM_KEYS.ALGO} />);

    const selector = screen.getByTestId(`selector-${SEARCH_PARAM_KEYS.ALGO}`);
    expect(selector).toBeDefined();
    expect(selector.getAttribute('data-options-count')).toBe(String(Object.values(HASHING_ALGOS).length));
  });
});
