import { fireEvent, render, screen } from '@testing-library/react';
import { toast } from 'sonner';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { SEARCH_PARAM_KEYS } from '@/constants/common';
import { testT } from '@/test-helpers/i18n';

import { ConverterPanel } from '../converter-panel';

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
  },
}));

describe('ConverterPanel', () => {
  const mockOnTextChange = vi.fn();
  const mockOnCopy = vi.fn();
  const mockOnClear = vi.fn();
  const mockOnSample = vi.fn();
  const mockOnUpload = vi.fn();
  const mockOnDownload = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render editable panel with placeholder and handle text change', () => {
    render(
      <ConverterPanel
        value="hello world"
        onTextChange={mockOnTextChange}
        onCopy={mockOnCopy}
        onClear={mockOnClear}
        onSample={mockOnSample}
        onUpload={mockOnUpload}
        onDownload={mockOnDownload}
      />
    );

    const textarea = screen.getByRole('textbox');
    expect(textarea).toBeDefined();
    expect(textarea.getAttribute('value') ?? (textarea as HTMLTextAreaElement).value).toBe('hello world');
    expect(textarea.hasAttribute('readonly')).toBe(false);

    fireEvent.change(textarea, { target: { value: 'new text' } });
    expect(mockOnTextChange).toHaveBeenCalledWith('new text');
  });

  it('should render readOnly panel with result placeholder fallback', () => {
    render(<ConverterPanel value="" readOnly onCopy={mockOnCopy} onDownload={mockOnDownload} />);

    const textarea = screen.getByRole('textbox');
    expect(textarea.hasAttribute('readonly')).toBe(true);
    expect(textarea.getAttribute('placeholder')).toBe(testT('converter.resultPlaceholder'));
  });

  it('should use custom placeholder when provided', () => {
    render(<ConverterPanel value="" placeholder="Custom input placeholder" onTextChange={mockOnTextChange} />);

    const textarea = screen.getByRole('textbox');
    expect(textarea.getAttribute('placeholder')).toBe('Custom input placeholder');
  });

  it('should toast error and display error in textarea when error prop is provided', () => {
    render(<ConverterPanel readOnly value="" error="Invalid syntax error" />);

    expect(toast.error).toHaveBeenCalledWith('Invalid syntax error');
    const textarea = screen.getByRole('textbox');
    expect((textarea as HTMLTextAreaElement).value).toBe('Invalid syntax error');
  });

  it('should render SelectorComponent with selectorProps when provided', () => {
    interface DummySelectorProps {
      customLabel: string;
    }
    const DummySelector = ({ type, customLabel }: { type: SEARCH_PARAM_KEYS; customLabel?: string }) => (
      <div data-testid="dummy-selector">
        {type}-{customLabel}
      </div>
    );

    render(
      <ConverterPanel<DummySelectorProps>
        type={SEARCH_PARAM_KEYS.FROM}
        value="test"
        onTextChange={mockOnTextChange}
        SelectorComponent={DummySelector}
        selectorProps={{ customLabel: 'my-label' }}
      />
    );

    expect(screen.getByTestId('dummy-selector')).toBeDefined();
    expect(screen.getByText(`${SEARCH_PARAM_KEYS.FROM}-my-label`)).toBeDefined();
  });

  it('should render SelectorComponent with default empty props when selectorProps is omitted', () => {
    const DummySelector = ({ type }: { type: SEARCH_PARAM_KEYS }) => (
      <div data-testid="dummy-selector-no-props">{type}</div>
    );

    render(<ConverterPanel type={SEARCH_PARAM_KEYS.TO} value="test" readOnly SelectorComponent={DummySelector} />);

    expect(screen.getByTestId('dummy-selector-no-props')).toBeDefined();
    expect(screen.getByText(SEARCH_PARAM_KEYS.TO)).toBeDefined();
  });
});
