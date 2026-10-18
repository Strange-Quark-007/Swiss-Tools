import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { SEARCH_PARAM_KEYS } from '@/constants/common';
import { useUrlSearchParams } from '@/hooks/use-search-params';
import { testT } from '@/test-helpers/i18n';
import { Option } from '@/types/selector';

import { DataFormatSelector } from '../data-format-selector';
import { DATA_FORMATS } from '../utils';

vi.mock('@/hooks/use-search-params', () => ({
  useUrlSearchParams: vi.fn(),
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
      <div data-testid="options-list">
        {options.map((opt) => (
          <span key={opt.value} data-testid={`opt-${opt.value}`} data-disabled={opt.disabled ? 'true' : 'false'}>
            {opt.label}
          </span>
        ))}
      </div>
      {renderExtra?.()}
    </div>
  ),
}));

describe('DataFormatSelector', () => {
  const mockOnMinify = vi.fn();
  const mockOnPrettyPrint = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render options without ini for FROM selector', () => {
    vi.mocked(useUrlSearchParams).mockReturnValue([DATA_FORMATS.json.value, vi.fn()]);

    render(
      <DataFormatSelector type={SEARCH_PARAM_KEYS.FROM} onMinify={mockOnMinify} onPrettyPrint={mockOnPrettyPrint} />
    );

    expect(screen.queryByTestId(`opt-${DATA_FORMATS.ini.value}`)).toBeNull();
    expect(screen.getByTestId(`opt-${DATA_FORMATS.json.value}`)).toBeDefined();
    expect(screen.queryByRole('button', { name: testT('label.minify') })).toBeNull();
  });

  it('should disable incompatible target options and render extra buttons when TO is json', () => {
    vi.mocked(useUrlSearchParams).mockImplementation((key) => {
      if (key === SEARCH_PARAM_KEYS.FROM) {
        return [DATA_FORMATS.csv.value, vi.fn()];
      }
      return [DATA_FORMATS.json.value, vi.fn()];
    });

    render(
      <DataFormatSelector type={SEARCH_PARAM_KEYS.TO} onMinify={mockOnMinify} onPrettyPrint={mockOnPrettyPrint} />
    );

    const minifyBtn = screen.getByRole('button', { name: testT('label.minify') });
    const prettyBtn = screen.getByRole('button', { name: testT('label.prettyPrint') });

    fireEvent.click(minifyBtn);
    expect(mockOnMinify).toHaveBeenCalled();

    fireEvent.click(prettyBtn);
    expect(mockOnPrettyPrint).toHaveBeenCalled();
  });

  it('should render extra buttons when TO is xml', () => {
    vi.mocked(useUrlSearchParams).mockImplementation((key) => {
      if (key === SEARCH_PARAM_KEYS.FROM) {
        return [DATA_FORMATS.json.value, vi.fn()];
      }
      return [DATA_FORMATS.xml.value, vi.fn()];
    });

    render(
      <DataFormatSelector type={SEARCH_PARAM_KEYS.TO} onMinify={mockOnMinify} onPrettyPrint={mockOnPrettyPrint} />
    );

    expect(screen.getByRole('button', { name: testT('label.minify') })).toBeDefined();
    expect(screen.getByRole('button', { name: testT('label.prettyPrint') })).toBeDefined();
  });

  it('should not render extra buttons when TO is yaml', () => {
    vi.mocked(useUrlSearchParams).mockImplementation((key) => {
      if (key === SEARCH_PARAM_KEYS.FROM) {
        return [DATA_FORMATS.json.value, vi.fn()];
      }
      return [DATA_FORMATS.yaml.value, vi.fn()];
    });

    render(
      <DataFormatSelector type={SEARCH_PARAM_KEYS.TO} onMinify={mockOnMinify} onPrettyPrint={mockOnPrettyPrint} />
    );

    expect(screen.queryByRole('button', { name: testT('label.minify') })).toBeNull();
  });

  it('should disable incompatible options and set error tooltip when from format is toml', () => {
    vi.mocked(useUrlSearchParams).mockImplementation((key) => {
      if (key === SEARCH_PARAM_KEYS.FROM) {
        return [DATA_FORMATS.toml.value, vi.fn()];
      }
      return [DATA_FORMATS.json.value, vi.fn()];
    });

    render(
      <DataFormatSelector type={SEARCH_PARAM_KEYS.TO} onMinify={mockOnMinify} onPrettyPrint={mockOnPrettyPrint} />
    );

    const csvOpt = screen.getByTestId(`opt-${DATA_FORMATS.csv.value}`);
    expect(csvOpt.getAttribute('data-disabled')).toBe('true');
  });

  it('should handle missing from param for TO selector', () => {
    vi.mocked(useUrlSearchParams).mockImplementation((key) => {
      if (key === SEARCH_PARAM_KEYS.FROM) {
        return ['', vi.fn()];
      }
      return [DATA_FORMATS.json.value, vi.fn()];
    });

    render(
      <DataFormatSelector type={SEARCH_PARAM_KEYS.TO} onMinify={mockOnMinify} onPrettyPrint={mockOnPrettyPrint} />
    );

    expect(screen.getByTestId(`opt-${DATA_FORMATS.csv.value}`).getAttribute('data-disabled')).toBe('false');
  });
});
