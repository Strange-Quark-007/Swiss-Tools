import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { SEARCH_PARAM_KEYS } from '@/constants/common';
import { useUrlSearchParams } from '@/hooks/use-search-params';
import { Option } from '@/types/selector';

import { CodecSelector } from '../codec-selector';
import { CODECS, MODES } from '../utils';

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
          <span key={opt.value} data-testid={`opt-${opt.value}`}>
            {opt.label}
          </span>
        ))}
      </div>
      {renderExtra?.()}
    </div>
  ),
}));

describe('CodecSelector', () => {
  const mockSetMode = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render codec options and switch with ENCODE when mode is encode', () => {
    vi.mocked(useUrlSearchParams).mockReturnValue([MODES.encode.value, mockSetMode]);

    render(<CodecSelector type={SEARCH_PARAM_KEYS.CODEC} />);

    expect(screen.getByTestId(`selector-${SEARCH_PARAM_KEYS.CODEC}`)).toBeDefined();
    expect(screen.getByTestId(`opt-${CODECS.base64.value}`)).toBeDefined();

    const modeSwitch = screen.getByRole('switch');
    expect(modeSwitch.getAttribute('aria-checked')).toBe('true');
    expect(screen.getByText('ENCODE')).toBeDefined();

    fireEvent.click(modeSwitch);
    expect(mockSetMode).toHaveBeenCalledWith(MODES.decode.value);
  });

  it('should toggle switch to ENCODE when currently in DECODE mode', () => {
    vi.mocked(useUrlSearchParams).mockReturnValue([MODES.decode.value, mockSetMode]);

    render(<CodecSelector type={SEARCH_PARAM_KEYS.CODEC} />);

    const modeSwitch = screen.getByRole('switch');
    expect(modeSwitch.getAttribute('aria-checked')).toBe('false');
    expect(screen.getByText('DECODE')).toBeDefined();

    fireEvent.click(modeSwitch);
    expect(mockSetMode).toHaveBeenCalledWith(MODES.encode.value);
  });
});
