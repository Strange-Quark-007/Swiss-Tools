import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { SEARCH_PARAM_KEYS } from '@/constants/common';

import { TimestampSelector } from '../timestamp-selector';
import { TIMESTAMP_FORMATS } from '../utils';

vi.mock('@/components/app-converter/selector', () => ({
  Selector: ({ type, options }: { type: SEARCH_PARAM_KEYS; options: unknown[] }) => (
    <div data-testid={`selector-${type}`} data-options-count={options.length}>
      Selector
    </div>
  ),
}));

describe('TimestampSelector', () => {
  it('should render Selector with correct type and timestamp format options', () => {
    render(<TimestampSelector type={SEARCH_PARAM_KEYS.FROM} />);

    const selector = screen.getByTestId(`selector-${SEARCH_PARAM_KEYS.FROM}`);
    expect(selector).toBeDefined();
    expect(selector.getAttribute('data-options-count')).toBe(String(Object.values(TIMESTAMP_FORMATS).length));
  });
});
