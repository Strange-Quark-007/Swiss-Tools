import { act, fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { testT } from '@/test-helpers/i18n';

import { RegexInput } from '../regex-input';
import { useRegexTesterStore } from '../regex-tester-store';
import { MatchResult, REGEX_PRESETS } from '../utils';

describe('RegexInput component', () => {
  beforeEach(() => {
    act(() => {
      useRegexTesterStore.getState().reset();
    });
    vi.restoreAllMocks();
  });

  it('should render textarea and allow editing test text', () => {
    render(<RegexInput matches={[]} />);

    const textarea = screen.getByPlaceholderText(testT('regexTester.testTextPlaceholder'));
    act(() => {
      fireEvent.change(textarea, { target: { value: 'Hello World' } });
    });

    expect(useRegexTesterStore.getState().testText).toBe('Hello World');
  });

  it('should load default sample text when Sample action is clicked without selectedPreset', () => {
    render(<RegexInput matches={[]} />);

    const sampleBtn = screen.getByRole('button', { name: testT('label.sampleData') });
    act(() => {
      fireEvent.click(sampleBtn);
    });

    expect(useRegexTesterStore.getState().testText).toBe(REGEX_PRESETS[0].sampleText);
  });

  it('should load preset-specific sample text when Sample action is clicked with selectedPreset', () => {
    act(() => {
      useRegexTesterStore.getState().loadPreset('url');
    });

    render(<RegexInput matches={[]} />);

    const sampleBtn = screen.getByRole('button', { name: testT('label.sampleData') });
    act(() => {
      fireEvent.click(sampleBtn);
    });

    const urlPreset = REGEX_PRESETS.find((p) => p.id === 'url')!;
    expect(useRegexTesterStore.getState().testText).toBe(urlPreset.sampleText);
  });

  it('should copy text when Copy action is clicked and testText is not empty', () => {
    const writeTextSpy = vi.fn();
    Object.assign(navigator, {
      clipboard: { writeText: writeTextSpy },
    });

    act(() => {
      useRegexTesterStore.getState().setTestText('sample copy text');
    });

    render(<RegexInput matches={[]} />);

    const copyBtn = screen.getByRole('button', {
      name: testT('aria.copyContext', { context: testT('label.input') }),
    });
    act(() => {
      fireEvent.click(copyBtn);
    });

    expect(writeTextSpy).toHaveBeenCalledWith('sample copy text');
  });

  it('should do nothing when Copy action is clicked and testText is empty', () => {
    const writeTextSpy = vi.fn();
    Object.assign(navigator, {
      clipboard: { writeText: writeTextSpy },
    });

    render(<RegexInput matches={[]} />);

    const copyBtn = screen.getByRole('button', {
      name: testT('aria.copyContext', { context: testT('label.input') }),
    });
    act(() => {
      fireEvent.click(copyBtn);
    });

    expect(writeTextSpy).not.toHaveBeenCalled();
  });

  it('should clear test text when Clear action is clicked', () => {
    act(() => {
      useRegexTesterStore.getState().setTestText('some text');
    });

    render(<RegexInput matches={[]} />);

    const clearBtn = screen.getByRole('button', { name: testT('label.clear') });
    act(() => {
      fireEvent.click(clearBtn);
    });

    expect(useRegexTesterStore.getState().testText).toBe('');
  });

  it('should toggle between text and highlight tabs when matches exist', () => {
    act(() => {
      useRegexTesterStore.getState().setTestText('apple banana apple');
    });

    const matches: MatchResult[] = [
      { match: 'apple', index: 0, end: 5, groups: [] },
      { match: 'apple', index: 13, end: 18, groups: [] },
    ];

    render(<RegexInput matches={matches} />);

    expect(screen.getByRole('tablist', { name: testT('regexTester.viewModeTabs') })).toBeDefined();

    const highlightTab = screen.getByRole('tab', { name: testT('label.highlight') });
    const textTab = screen.getByRole('tab', { name: testT('label.text') });

    act(() => {
      fireEvent.click(highlightTab);
    });

    expect(screen.getByRole('tabpanel', { name: testT('label.highlight') })).toBeDefined();

    act(() => {
      fireEvent.click(textTab);
    });

    expect(screen.getByRole('tabpanel', { name: testT('label.text') })).toBeDefined();
  });
  it('should render placeholder in highlight mode when testText is empty', () => {
    act(() => {
      useRegexTesterStore.getState().setTestText('');
    });

    render(<RegexInput matches={[]} />);

    const highlightTab = screen.getByRole('tab', { name: testT('label.highlight') });
    act(() => {
      fireEvent.click(highlightTab);
    });

    expect(screen.getByText(testT('regexTester.testTextPlaceholder'))).toBeDefined();
  });

  it('should reset viewMode to text when Clear action is clicked while in highlight mode', () => {
    act(() => {
      useRegexTesterStore.getState().setTestText('some text');
    });

    render(<RegexInput matches={[{ match: 'some', index: 0, end: 4, groups: [] }]} />);

    const highlightTab = screen.getByRole('tab', { name: testT('label.highlight') });
    act(() => {
      fireEvent.click(highlightTab);
    });

    expect(screen.getByRole('tabpanel', { name: testT('label.highlight') })).toBeDefined();

    const clearBtn = screen.getByRole('button', { name: testT('label.clear') });
    act(() => {
      fireEvent.click(clearBtn);
    });

    expect(useRegexTesterStore.getState().testText).toBe('');
    expect(screen.getByRole('tabpanel', { name: testT('label.text') })).toBeDefined();
  });

  it('should preserve and restore scroll position when switching between text and highlight views', () => {
    act(() => {
      useRegexTesterStore.getState().setTestText('line 1\nline 2\nline 3\nline 4\nline 5');
    });

    render(<RegexInput matches={[{ match: 'line', index: 0, end: 4, groups: [] }]} />);

    const textarea = screen.getByPlaceholderText(testT('regexTester.testTextPlaceholder'));
    Object.defineProperty(textarea, 'scrollTop', { value: 150, writable: true });
    fireEvent.scroll(textarea);

    const highlightTab = screen.getByRole('tab', { name: testT('label.highlight') });
    act(() => {
      fireEvent.click(highlightTab);
    });

    const highlightPanel = screen.getByRole('tabpanel', { name: testT('label.highlight') });
    expect(highlightPanel.scrollTop).toBe(150);

    // Scroll in highlight view
    highlightPanel.scrollTop = 220;
    fireEvent.scroll(highlightPanel);

    // Switch back to text view
    const textTab = screen.getByRole('tab', { name: testT('label.text') });
    act(() => {
      fireEvent.click(textTab);
    });

    const restoredTextarea = screen.getByPlaceholderText(testT('regexTester.testTextPlaceholder'));
    expect(restoredTextarea.scrollTop).toBe(220);
  });

  it('should reset scroll position to 0 when loading sample text', () => {
    act(() => {
      useRegexTesterStore.getState().setTestText('initial');
    });

    render(<RegexInput matches={[]} />);

    const textarea = screen.getByPlaceholderText(testT('regexTester.testTextPlaceholder'));
    Object.defineProperty(textarea, 'scrollTop', { value: 300, writable: true });
    fireEvent.scroll(textarea);

    const sampleBtn = screen.getByRole('button', { name: testT('label.sampleData') });
    act(() => {
      fireEvent.click(sampleBtn);
    });

    expect(textarea.scrollTop).toBe(0);
  });

  it('should ignore clicking the currently active tab', () => {
    render(<RegexInput matches={[]} />);

    const textTab = screen.getByRole('tab', { name: testT('label.text') });
    act(() => {
      fireEvent.click(textTab);
    });

    expect(screen.getByRole('tabpanel', { name: testT('label.text') })).toBeDefined();
  });

  it('should reset scroll position to 0 when loading sample text in highlight mode', () => {
    act(() => {
      useRegexTesterStore.getState().setTestText('initial');
    });

    render(<RegexInput matches={[]} />);

    const highlightTab = screen.getByRole('tab', { name: testT('label.highlight') });
    act(() => {
      fireEvent.click(highlightTab);
    });

    const highlightPanel = screen.getByRole('tabpanel', { name: testT('label.highlight') });
    highlightPanel.scrollTop = 250;

    const sampleBtn = screen.getByRole('button', { name: testT('label.sampleData') });
    act(() => {
      fireEvent.click(sampleBtn);
    });

    expect(highlightPanel.scrollTop).toBe(0);
  });

  it('should fall back to matchIndex 1 when segment has no matchIndex', async () => {
    const utils = await import('../utils');
    vi.spyOn(utils, 'highlightSegments').mockReturnValue([{ text: 'hello', isMatch: true }]);

    act(() => {
      useRegexTesterStore.getState().setTestText('hello');
    });

    render(<RegexInput matches={[]} />);

    const highlightTab = screen.getByRole('tab', { name: testT('label.highlight') });
    act(() => {
      fireEvent.click(highlightTab);
    });

    const mark = screen.getByText('hello');
    expect(mark.tagName).toBe('MARK');
  });
});
