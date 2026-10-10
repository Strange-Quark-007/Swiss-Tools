import { fireEvent, render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { SEARCH_PARAM_KEYS, TOOLTIP_TYPE } from '@/constants/common';
import { useUrlSearchParams } from '@/hooks/use-search-params';
import { Option } from '@/types/selector';

import { Selector } from '../selector';

vi.mock('@/hooks/use-search-params', () => ({
  useUrlSearchParams: vi.fn(),
}));

vi.mock('@/components/ui/select', async () => {
  const actual = await vi.importActual<typeof import('@/components/ui/select')>('@/components/ui/select');
  return {
    ...actual,
    Select: ({ onValueChange, value, children, ...props }: React.ComponentProps<typeof actual.Select>) => (
      <div data-testid="mock-select-container" onClick={() => onValueChange?.(value as string)}>
        <actual.Select onValueChange={onValueChange} value={value} {...props}>
          {children}
        </actual.Select>
      </div>
    ),
  };
});


describe('Selector component', () => {
  const mockSetValue = vi.fn();

  const sampleOptions: Option<string>[] = [
    { value: 'json', label: 'JSON' },
    {
      value: 'xml',
      label: 'XML',
      tooltip: { type: 'info' as TOOLTIP_TYPE, messageKey: 'timeConverter.yearTooltip' },
    },
    {
      value: 'yaml',
      label: 'YAML',
      tooltip: { type: 'warning' as TOOLTIP_TYPE, messageKey: 'app.name' },
    },
    {
      value: 'csv',
      label: 'CSV',
      disabled: true,
      tooltip: { type: 'error' as TOOLTIP_TYPE, messageKey: 'app.name' },
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useUrlSearchParams).mockReturnValue(['json', mockSetValue]);
  });


  it('should render trigger with uppercase type label and current value', () => {
    render(
      <Selector
        type={SEARCH_PARAM_KEYS.FROM}
        options={sampleOptions}
      />
    );

    expect(screen.getByText('FROM:')).toBeDefined();
    expect(screen.getByRole('combobox')).toBeDefined();
  });

  it('should render options and handle selection changes', () => {
    render(
      <Selector
        type={SEARCH_PARAM_KEYS.FROM}
        options={sampleOptions}
      />
    );

    const trigger = screen.getByRole('combobox');
    fireEvent.click(trigger);

    expect(screen.getAllByText('JSON').length).toBeGreaterThan(0);
    expect(screen.getByText('XML')).toBeDefined();
    expect(screen.getByText('YAML')).toBeDefined();
    expect(screen.getByText('CSV')).toBeDefined();

    const yamlOption = screen.getByText('YAML');
    fireEvent.click(yamlOption);
    expect(mockSetValue).toHaveBeenCalledWith('yaml');
  });

  it('should not call setValue when selecting the already selected option', () => {
    render(
      <Selector
        type={SEARCH_PARAM_KEYS.FROM}
        options={sampleOptions}
      />
    );

    const container = screen.getByTestId('mock-select-container');
    fireEvent.click(container);
    expect(mockSetValue).not.toHaveBeenCalled();
  });


  it('should render extra content when renderExtra is supplied', () => {

    render(
      <Selector
        type={SEARCH_PARAM_KEYS.TO}
        options={sampleOptions}
        renderExtra={(current) => <div data-testid="extra-node">Active: {current}</div>}
      />
    );

    expect(screen.getByTestId('extra-node')).toBeDefined();
    expect(screen.getByText('Active: json')).toBeDefined();
  });
});
