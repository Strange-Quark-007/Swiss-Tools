import { act, fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useAppStore } from '@/store/store';
import { testT } from '@/test-helpers/i18n';

import { RegexPatternInput } from '../regex-pattern-input';
import { useRegexTesterStore } from '../regex-tester-store';

vi.mock('@/hooks/use-search-params', () => ({
  useUrlSearchParams: vi.fn(() => ['', vi.fn()]),
}));

vi.mock('@/components/ui/select', async () => {
  const actual = await vi.importActual<typeof import('@/components/ui/select')>('@/components/ui/select');
  return {
    ...actual,
    Select: ({ onValueChange, value, children, ...props }: React.ComponentProps<typeof actual.Select>) => (
      <div
        data-testid="mock-select"
        onClick={() => onValueChange?.('email')}
        onKeyDown={() => onValueChange?.('custom')}
      >
        <actual.Select onValueChange={onValueChange} value={value} {...props}>
          {children}
        </actual.Select>
      </div>
    ),
  };
});

describe('RegexPatternInput component', () => {
  beforeEach(() => {
    act(() => {
      useRegexTesterStore.getState().reset();
    });
    vi.restoreAllMocks();
  });

  it('should copy regex when Copy action is clicked and pattern is non-empty', () => {
    act(() => {
      useRegexTesterStore.getState().setPattern('[0-9]+');
    });

    render(<RegexPatternInput isValid={true} />);

    const copyBtn = screen.getByRole('button', {
      name: testT('aria.copyContext', { context: testT('regexTester.expression') }),
    });
    act(() => {
      fireEvent.click(copyBtn);
    });

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('/[0-9]+/g');
  });

  it('should not copy when Copy action is clicked and pattern is empty', () => {
    act(() => {
      useRegexTesterStore.getState().setPattern('');
    });

    render(<RegexPatternInput isValid={true} />);

    const copyBtn = screen.getByRole('button', {
      name: testT('aria.copyContext', { context: testT('regexTester.expression') }),
    });
    act(() => {
      fireEvent.click(copyBtn);
    });

    expect(navigator.clipboard.writeText).not.toHaveBeenCalled();
  });

  it('should clear pattern without clearing testText when Clear action is clicked', () => {
    act(() => {
      useRegexTesterStore.getState().setPattern('something');
      useRegexTesterStore.getState().setTestText('preserve me');
    });

    render(<RegexPatternInput isValid={true} />);

    const clearBtn = screen.getByRole('button', { name: testT('label.clear') });
    act(() => {
      fireEvent.click(clearBtn);
    });

    expect(useRegexTesterStore.getState().pattern).toBe('');
    expect(useRegexTesterStore.getState().testText).toBe('preserve me');
  });

  it('should mark input as invalid and apply danger border when pattern is invalid', () => {
    act(() => {
      useRegexTesterStore.getState().setPattern('[');
    });

    render(<RegexPatternInput isValid={false} error="Unterminated character class" />);

    const input = screen.getByRole('textbox', { name: testT('regexTester.expression') });
    expect(input.getAttribute('aria-invalid')).toBe('true');
  });

  it('should toggle flag when flag button is clicked', () => {
    render(<RegexPatternInput isValid={true} />);

    const globalBtn = screen.getByRole('button', { name: 'g (Global)' });
    expect(globalBtn.getAttribute('aria-pressed')).toBe('true');

    act(() => {
      fireEvent.click(globalBtn);
    });

    expect(useRegexTesterStore.getState().flags.global).toBe(false);
  });

  it('should load preset when a preset is selected from dropdown', () => {
    render(<RegexPatternInput isValid={true} />);

    const mockSelect = screen.getByTestId('mock-select');
    act(() => {
      fireEvent.click(mockSelect);
    });

    expect(useRegexTesterStore.getState().selectedPreset).toBe('email');
  });

  it('should not load preset when custom is selected', () => {
    render(<RegexPatternInput isValid={true} />);

    const mockSelect = screen.getByTestId('mock-select');
    act(() => {
      fireEvent.keyDown(mockSelect);
    });

    expect(useRegexTesterStore.getState().selectedPreset).toBe('email');
  });

  it('should update pattern when input value changes', () => {
    render(<RegexPatternInput isValid={true} />);

    const input = screen.getByPlaceholderText(testT('regexTester.patternPlaceholder'));
    act(() => {
      fireEvent.change(input, { target: { value: 'test-value' } });
    });

    expect(useRegexTesterStore.getState().pattern).toBe('test-value');
  });

  it('should render matching preset label when pattern matches preset', () => {
    act(() => {
      useRegexTesterStore.getState().setPattern('[0-9]+');
      useRegexTesterStore.getState().setSelectedPreset(undefined);
    });

    render(<RegexPatternInput isValid={true} />);

    expect(screen.getByText(testT('label.custom'))).toBeDefined();
  });

  it('should switch selector to custom when a flag is toggled on an active preset', () => {
    act(() => {
      useRegexTesterStore.getState().loadPreset('email');
    });

    render(<RegexPatternInput isValid={true} />);

    expect(screen.getByText('Email Address')).toBeDefined();

    const caseBtn = screen.getByRole('button', { name: 'i (Case-insensitive)' });
    act(() => {
      fireEvent.click(caseBtn);
    });

    expect(screen.getByText(testT('label.custom'))).toBeDefined();
    expect(useRegexTesterStore.getState().selectedPreset).toBeUndefined();
  });

  it('should not render the magic drop handle even when the feature is enabled', () => {
    useAppStore.setState({ magicDrop: true });

    render(<RegexPatternInput isValid={true} />);

    expect(screen.queryByRole('button', { name: testT('labs.magicDrop.dragTooltip') })).toBeNull();

    useAppStore.setState({ magicDrop: false });
  });

  it('should toggle auto-populate sample checkbox and update store', () => {
    render(<RegexPatternInput isValid={true} />);

    const checkbox = screen.getByRole('checkbox', { name: testT('regexTester.autoPopulateSample') });
    expect(checkbox).toBeDefined();
    expect(useRegexTesterStore.getState().autoPopulateSample).toBe(true);

    act(() => {
      fireEvent.click(checkbox);
    });

    expect(useRegexTesterStore.getState().autoPopulateSample).toBe(false);
  });
});
