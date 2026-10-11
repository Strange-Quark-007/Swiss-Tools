import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { SEARCH_PARAM_KEYS } from '@/constants/common';
import { useUrlSearchParams } from '@/hooks/use-search-params';
import { Option } from '@/types/selector';

import { BaseSelector } from '../base-selector';
import { BASES } from '../utils';

vi.mock('@/hooks/use-search-params', () => ({
  useUrlSearchParams: vi.fn(),
}));

vi.mock('../custom-base-form', () => ({
  default: ({ customBase, onCustomBaseChange }: { customBase: string; onCustomBaseChange: (val: string) => void }) => (
    <div data-testid="custom-base-form">
      <input data-testid="mock-custom-input" value={customBase} onChange={(e) => onCustomBaseChange(e.target.value)} />
    </div>
  ),
}));

vi.mock('@/components/app-converter/selector', () => ({
  Selector: ({
    type,
    options,
    renderExtra,
  }: {
    type: SEARCH_PARAM_KEYS;
    options: Option<string>[];
    renderExtra?: () => React.ReactNode;
  }) => (
    <div data-testid={`selector-${type}`}>
      <span data-testid="options-count">{options.length}</span>
      {renderExtra?.()}
    </div>
  ),
}));

describe('BaseSelector', () => {
  const mockOnCustomBaseChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render options and not show custom base form when base is decimal', () => {
    vi.mocked(useUrlSearchParams).mockReturnValue([BASES.decimal.value, vi.fn()]);

    render(<BaseSelector type={SEARCH_PARAM_KEYS.FROM} customBase="" onCustomBaseChange={mockOnCustomBaseChange} />);

    expect(screen.getByTestId('options-count').textContent).toBe(String(Object.values(BASES).length));
    expect(screen.queryByTestId('custom-base-form')).toBeNull();
  });

  it('should render custom base form and validate value when base is custom', async () => {
    vi.mocked(useUrlSearchParams).mockReturnValue([BASES.custom.value, vi.fn()]);

    render(<BaseSelector type={SEARCH_PARAM_KEYS.FROM} customBase="16" onCustomBaseChange={mockOnCustomBaseChange} />);

    await vi.waitFor(() => {
      expect(screen.getByTestId('custom-base-form')).toBeDefined();
    });

    const input = screen.getByTestId('mock-custom-input');
    fireEvent.change(input, { target: { value: '32' } });
    expect(mockOnCustomBaseChange).toHaveBeenCalledWith('32');
  });

  it('should not throw if onCustomBaseChange is not provided', async () => {
    vi.mocked(useUrlSearchParams).mockReturnValue([BASES.custom.value, vi.fn()]);

    render(<BaseSelector type={SEARCH_PARAM_KEYS.FROM} customBase="16" />);

    const input = screen.getByTestId('mock-custom-input');
    fireEvent.change(input, { target: { value: '32' } });
  });
});
