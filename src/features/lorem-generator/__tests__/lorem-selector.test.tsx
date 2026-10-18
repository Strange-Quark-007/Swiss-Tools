import { fireEvent, render, screen } from '@testing-library/react';
import { toast } from 'sonner';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { SEARCH_PARAM_KEYS } from '@/constants/common';
import { testT } from '@/test-helpers/i18n';
import { Option } from '@/types/selector';

import { useLoremGeneratorStore } from '../lorem-generator-store';
import { LoremSelector } from '../lorem-selector';
import { LOREM, MAX_COUNT } from '../utils';

vi.mock('sonner', () => ({
  toast: {
    warning: vi.fn(),
  },
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

describe('LoremSelector', () => {
  const mockOnGenerateNew = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useLoremGeneratorStore.setState({ count: 10, toValue: '', toError: undefined });
  });

  it('should render selector with options, count input and generate button', () => {
    render(<LoremSelector onGenerateNew={mockOnGenerateNew} />);

    expect(screen.getByTestId('options-count').textContent).toBe(String(Object.values(LOREM).length));

    const input = screen.getByRole('textbox');
    expect((input as HTMLInputElement).value).toBe('10');

    const generateBtn = screen.getByRole('button');
    fireEvent.click(generateBtn);
    expect(mockOnGenerateNew).toHaveBeenCalled();
  });

  it('should update count on valid number input', () => {
    render(<LoremSelector onGenerateNew={mockOnGenerateNew} />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '25' } });

    expect(useLoremGeneratorStore.getState().count).toBe(25);
  });

  it('should show toast warning on invalid count', () => {
    render(<LoremSelector onGenerateNew={mockOnGenerateNew} />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '-5' } });

    expect(toast.warning).toHaveBeenCalledWith(testT('loremGenerator.invalidCount'));
    expect(useLoremGeneratorStore.getState().count).toBe(10);
  });

  it('should show toast warning when count exceeds MAX_COUNT', () => {
    render(<LoremSelector onGenerateNew={mockOnGenerateNew} />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: String(MAX_COUNT + 1) } });

    expect(toast.warning).toHaveBeenCalledWith(testT('loremGenerator.countWarning', { maxCount: MAX_COUNT }));
    expect(useLoremGeneratorStore.getState().count).toBe(10);
  });

  it('should render empty string in input when count is 0', () => {
    useLoremGeneratorStore.setState({ count: 0 });
    render(<LoremSelector onGenerateNew={mockOnGenerateNew} />);
    const input = screen.getByRole('textbox');
    expect((input as HTMLInputElement).value).toBe('');
  });
});
