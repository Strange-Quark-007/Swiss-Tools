import { fireEvent, render, screen } from '@testing-library/react';
import { toast } from 'sonner';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { SEARCH_PARAM_KEYS } from '@/constants/common';
import { testT } from '@/test-helpers/i18n';
import { Option } from '@/types/selector';

import { useIdGeneratorStore } from '../id-generator-store';
import { IdSelector } from '../id-selector';
import { IDS, MAX_COUNT } from '../utils';

vi.mock('sonner', () => ({
  toast: {
    warning: vi.fn(),
  },
}));

vi.mock('@/hooks/use-ga-events', () => ({
  useTrackEvent: () => vi.fn(),
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

describe('IdSelector', () => {
  const mockOnGenerateNew = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useIdGeneratorStore.setState({ count: 10, toValue: '', toError: undefined });
  });

  it('should render selector with options, count input and generate button', () => {
    render(<IdSelector onGenerateNew={mockOnGenerateNew} />);

    expect(screen.getByTestId('options-count').textContent).toBe(String(Object.values(IDS).length));

    const input = screen.getByRole('textbox');
    expect((input as HTMLInputElement).value).toBe('10');

    const generateBtn = screen.getByRole('button');
    fireEvent.click(generateBtn);
    expect(mockOnGenerateNew).toHaveBeenCalled();
  });

  it('should update count on valid number input', () => {
    render(<IdSelector onGenerateNew={mockOnGenerateNew} />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '25' } });

    expect(useIdGeneratorStore.getState().count).toBe(25);
  });

  it('should show toast warning on invalid count', () => {
    render(<IdSelector onGenerateNew={mockOnGenerateNew} />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '-5' } });

    expect(toast.warning).toHaveBeenCalledWith(testT('loremGenerator.invalidCount'));
    expect(useIdGeneratorStore.getState().count).toBe(10);
  });

  it('should show toast warning when count exceeds MAX_COUNT', () => {
    render(<IdSelector onGenerateNew={mockOnGenerateNew} />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: String(MAX_COUNT + 1) } });

    expect(toast.warning).toHaveBeenCalledWith(testT('loremGenerator.countWarning', { maxCount: MAX_COUNT }));
    expect(useIdGeneratorStore.getState().count).toBe(10);
  });

  it('should render empty string in input when count is 0', () => {
    useIdGeneratorStore.setState({ count: 0 });
    render(<IdSelector onGenerateNew={mockOnGenerateNew} />);
    const input = screen.getByRole('textbox');
    expect((input as HTMLInputElement).value).toBe('');
  });
});
