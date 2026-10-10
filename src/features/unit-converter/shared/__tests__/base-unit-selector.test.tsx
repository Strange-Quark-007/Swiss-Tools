import { fireEvent, render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { SEARCH_PARAM_KEYS } from '@/constants/common';
import { useUrlSearchParams } from '@/hooks/use-search-params';

import { BaseUnitSelector } from '../base-unit-selector';

vi.mock('@/hooks/use-search-params', () => ({
  useUrlSearchParams: vi.fn(),
}));

describe('BaseUnitSelector', () => {
  const mockSetValue = vi.fn();
  const sampleOptions = [
    { value: 'm', label: 'Meter' },
    { value: 'km', label: 'Kilometer' },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useUrlSearchParams).mockReturnValue(['m', mockSetValue]);
  });

  it('should render selector trigger and handle option selection', () => {
    render(<BaseUnitSelector type={SEARCH_PARAM_KEYS.FROM} options={sampleOptions} />);

    expect(screen.getByText('FROM:')).toBeDefined();
    const trigger = screen.getByRole('combobox');
    expect(trigger).toBeDefined();

    fireEvent.click(trigger);
    const kmOption = screen.getByText('Kilometer');
    fireEvent.click(kmOption);

    expect(mockSetValue).toHaveBeenCalledWith('km');
  });
});
