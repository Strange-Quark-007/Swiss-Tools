import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { SEARCH_PARAM_KEYS } from '@/constants/common';

import { HashEncodingSelector } from '../hash-encoding-selector';
import { HASH_ENCODINGS } from '../utils';

vi.mock('@/components/app-converter/selector', () => ({
  Selector: ({ type, options }: { type: SEARCH_PARAM_KEYS; options: unknown[] }) => (
    <div data-testid={`selector-${type}`} data-options-count={options.length}>
      Selector
    </div>
  ),
}));

describe('HashEncodingSelector', () => {
  it('should render Selector with correct type and encoding options', () => {
    render(<HashEncodingSelector type={SEARCH_PARAM_KEYS.ENCODING} />);

    const selector = screen.getByTestId(`selector-${SEARCH_PARAM_KEYS.ENCODING}`);
    expect(selector).toBeDefined();
    expect(selector.getAttribute('data-options-count')).toBe(String(Object.values(HASH_ENCODINGS).length));
  });
});
