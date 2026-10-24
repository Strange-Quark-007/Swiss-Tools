import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useUrlSearchParams } from '@/hooks/use-search-params';
import { testT } from '@/test-helpers/i18n';

import { RegexTester } from '../regex-tester';
import { useRegexTesterStore } from '../regex-tester-store';
import * as useRegexWorkerModule from '../use-regex-worker';
import { DEFAULT_FLAGS, RegexExecutionResult } from '../utils';

vi.mock('@/hooks/use-search-params', () => ({
  useUrlSearchParams: vi.fn(() => ['', vi.fn()]),
}));

describe('RegexTester component', () => {
  beforeEach(() => {
    act(() => {
      useRegexTesterStore.setState({
        pattern: '',
        flags: { ...DEFAULT_FLAGS },
        replacement: '',
        selectedPreset: undefined,
        testText: '',
        toValue: '',
        toError: undefined,
      });
      useRegexTesterStore.getState().reset();
    });
    vi.restoreAllMocks();
    vi.mocked(useUrlSearchParams).mockReturnValue(['', vi.fn()]);
  });

  it('should render pattern input, all flag buttons, ConverterActions, and SplitView panels', () => {
    render(<RegexTester />);

    expect(screen.getByLabelText(testT('regexTester.expression'))).toBeDefined();
    expect(screen.getByRole('button', { name: 'g (Global)' })).toBeDefined();
    expect(screen.getByRole('button', { name: 'i (Case-insensitive)' })).toBeDefined();
    expect(screen.getByRole('button', { name: 'm (Multiline)' })).toBeDefined();
    expect(screen.getByRole('button', { name: 's (Dot matches newline)' })).toBeDefined();
    expect(screen.getByRole('button', { name: 'u (Unicode)' })).toBeDefined();
    expect(screen.getByRole('button', { name: 'y (Sticky)' })).toBeDefined();

    // ConverterActions
    expect(screen.getByLabelText(testT('label.auto'))).toBeDefined();
    expect(screen.getByRole('button', { name: testT('label.convert') })).toBeDefined();
    expect(screen.getByRole('button', { name: testT('label.reset') })).toBeDefined();

    // Inputs & outputs
    expect(screen.getByText(`${testT('label.input').toUpperCase()}:`)).toBeDefined();
    expect(screen.getByText(`${testT('regexTester.resultsLabel').toUpperCase()}:`)).toBeDefined();
  });

  it('should toggle flag when flag button is clicked', () => {
    render(<RegexTester />);

    const caseButton = screen.getByRole('button', { name: 'i (Case-insensitive)' });
    expect(caseButton.getAttribute('aria-pressed')).toBe('false');

    act(() => {
      fireEvent.click(caseButton);
    });
    expect(useRegexTesterStore.getState().flags.caseInsensitive).toBe(true);
    expect(caseButton.getAttribute('aria-pressed')).toBe('true');
  });

  it('should display matches and count when pattern matches test text', async () => {
    useRegexTesterStore.setState({
      pattern: 'foo',
      testText: 'foo bar foo',
      auto: false,
    });

    render(<RegexTester />);

    const convertBtn = screen.getByRole('button', { name: testT('label.convert') });
    await act(async () => {
      fireEvent.click(convertBtn);
    });

    await waitFor(() => {
      expect(screen.getByText(testT('regexTester.matchCount', { count: 2 }))).toBeDefined();
      expect(screen.getByText(testT('regexTester.matchIndex', { index: 1 }))).toBeDefined();
      expect(screen.getByText(testT('regexTester.matchIndex', { index: 2 }))).toBeDefined();
    });
  });

  it('should display noMatchesHint placeholder when pattern matches zero times against test text', async () => {
    useRegexTesterStore.setState({
      pattern: 'nonexistent',
      testText: 'foo bar baz',
      auto: false,
    });

    render(<RegexTester />);

    const convertBtn = screen.getByRole('button', { name: testT('label.convert') });
    await act(async () => {
      fireEvent.click(convertBtn);
    });

    await waitFor(() => {
      expect(screen.getByPlaceholderText(testT('regexTester.noMatchesHint'))).toBeDefined();
      expect(screen.queryByText(testT('regexTester.matchCount', { count: 0 }))).toBeNull();
    });
  });

  it('should display error message when invalid regex pattern is entered', () => {
    render(<RegexTester />);

    const patternInput = screen.getByLabelText(testT('regexTester.expression'));

    act(() => {
      fireEvent.change(patternInput, { target: { value: '[a-z' } });
    });

    const alert = screen.getByRole('alert');
    expect(alert).toBeDefined();
  });

  it('should reset store when Reset action is clicked', () => {
    render(<RegexTester />);

    act(() => {
      useRegexTesterStore.setState({ pattern: 'test', testText: 'sample text' });
    });
    expect(useRegexTesterStore.getState().pattern).toBe('test');
    expect(useRegexTesterStore.getState().testText).toBe('sample text');

    const resetBtn = screen.getByRole('button', { name: testT('label.reset') });
    act(() => {
      fireEvent.click(resetBtn);
    });

    expect(useRegexTesterStore.getState().pattern).toBe('test');
    expect(useRegexTesterStore.getState().testText).toBe('');
  });

  it('should show Custom in preset select when custom pattern is entered', () => {
    render(<RegexTester />);

    const patternInput = screen.getByLabelText(testT('regexTester.expression'));
    act(() => {
      fireEvent.change(patternInput, { target: { value: 'custom_regex_abc' } });
    });

    expect(screen.getByText(testT('label.custom'))).toBeDefined();
  });

  it('should clear matches and error when Convert is clicked with invalid pattern and auto is false', () => {
    useRegexTesterStore.setState({
      auto: false,
      pattern: '[invalid',
      toValue: 'some old value',
      toError: 'old error',
    });

    render(<RegexTester />);

    const convertBtn = screen.getByRole('button', { name: testT('label.convert') });
    act(() => {
      fireEvent.click(convertBtn);
    });

    expect(useRegexTesterStore.getState().toValue).toBe('');
    expect(useRegexTesterStore.getState().toError).toBeUndefined();
  });

  it('should initialize preset when urlPattern matches a preset id without populating sample data', async () => {
    const { useUrlSearchParams } = vi.mocked(await import('@/hooks/use-search-params'));
    useUrlSearchParams.mockReturnValue(['url', vi.fn()]);

    render(<RegexTester />);

    expect(useRegexTesterStore.getState().selectedPreset).toBe('url');
    expect(useRegexTesterStore.getState().testText).toBe('');
  });

  it('should initialize custom pattern when urlPattern is a raw pattern string without populating sample data', async () => {
    const { useUrlSearchParams } = vi.mocked(await import('@/hooks/use-search-params'));
    const urlPreset = (await import('../utils')).REGEX_PRESETS[1];
    useUrlSearchParams.mockReturnValue([urlPreset.pattern, vi.fn()]);

    render(<RegexTester />);

    expect(useRegexTesterStore.getState().pattern).toBe(urlPreset.pattern);
    expect(useRegexTesterStore.getState().selectedPreset).toBeUndefined();
    expect(useRegexTesterStore.getState().testText).toBe('');
  });

  it('should switch to custom and not reset back to preset when a flag is toggled on an active preset', async () => {
    vi.useFakeTimers();
    useRegexTesterStore.getState().loadPreset('email');

    render(<RegexTester />);

    expect(useRegexTesterStore.getState().selectedPreset).toBe('email');

    const caseBtn = screen.getByRole('button', { name: 'i (Case-insensitive)' });
    act(() => {
      fireEvent.click(caseBtn);
    });

    expect(useRegexTesterStore.getState().selectedPreset).toBeUndefined();
    expect(useRegexTesterStore.getState().flags.caseInsensitive).toBe(false);

    act(() => {
      vi.advanceTimersByTime(350);
    });

    expect(useRegexTesterStore.getState().selectedPreset).toBeUndefined();
    expect(useRegexTesterStore.getState().flags.caseInsensitive).toBe(false);
    vi.useRealTimers();
  });

  it('should initialize custom pattern when urlPattern is a custom pattern', async () => {
    const { useUrlSearchParams } = vi.mocked(await import('@/hooks/use-search-params'));
    useUrlSearchParams.mockReturnValue(['my_custom_pattern', vi.fn()]);

    render(<RegexTester />);

    expect(useRegexTesterStore.getState().pattern).toBe('my_custom_pattern');
  });

  it('should sync pattern to URL via debounced effect when changed', async () => {
    vi.useFakeTimers();
    const setUrlPatternMock = vi.fn();
    const { useUrlSearchParams } = vi.mocked(await import('@/hooks/use-search-params'));
    useUrlSearchParams.mockReturnValue(['', setUrlPatternMock]);

    render(<RegexTester />);

    act(() => {
      useRegexTesterStore.getState().setPattern('new-pattern');
    });

    act(() => {
      vi.advanceTimersByTime(350);
    });

    expect(setUrlPatternMock).toHaveBeenCalledWith('new-pattern');
    vi.useRealTimers();
  });

  it('should not update pattern if urlPattern already equals currentPattern', async () => {
    const { useUrlSearchParams } = vi.mocked(await import('@/hooks/use-search-params'));
    useUrlSearchParams.mockReturnValue(['existing-pattern', vi.fn()]);

    useRegexTesterStore.setState({ pattern: 'existing-pattern' });

    render(<RegexTester />);

    expect(useRegexTesterStore.getState().pattern).toBe('existing-pattern');
  });

  it('should sync selectedPreset to URL and not sync if targetParam equals urlPattern', async () => {
    vi.useFakeTimers();
    const setUrlPatternMock = vi.fn();
    const { useUrlSearchParams } = vi.mocked(await import('@/hooks/use-search-params'));
    useUrlSearchParams.mockReturnValue(['email', setUrlPatternMock]);

    useRegexTesterStore.setState({ selectedPreset: 'email', pattern: 'sample' });

    render(<RegexTester />);

    act(() => {
      vi.advanceTimersByTime(350);
    });

    expect(setUrlPatternMock).not.toHaveBeenCalled();

    act(() => {
      useRegexTesterStore.getState().setSelectedPreset('url');
    });

    act(() => {
      vi.advanceTimersByTime(350);
    });

    expect(setUrlPatternMock).toHaveBeenCalledWith('url');
    vi.useRealTimers();
  });

  it('should reset ephemeral test text and results on component unmount while keeping pattern', () => {
    const { unmount } = render(<RegexTester />);

    act(() => {
      useRegexTesterStore.getState().setPattern('pattern');
      useRegexTesterStore.getState().setTestText('sample');
      useRegexTesterStore.getState().setToValue('result');
    });

    unmount();

    expect(useRegexTesterStore.getState().pattern).toBe('pattern');
    expect(useRegexTesterStore.getState().testText).toBe('');
    expect(useRegexTesterStore.getState().toValue).toBe('');
  });

  it('should ignore async conversion result if component unmounts before resolution', async () => {
    let resolvePromise: (value: RegexExecutionResult) => void;
    const slowPromise = new Promise<RegexExecutionResult>((resolve) => {
      resolvePromise = resolve;
    });

    vi.spyOn(useRegexWorkerModule, 'useRegexWorker').mockReturnValue({
      runRegex: vi.fn().mockReturnValue(slowPromise),
    });

    useRegexTesterStore.setState({
      auto: false,
      pattern: 'foo',
      testText: 'foo bar',
    });

    const { unmount } = render(<RegexTester />);
    const convertBtn = screen.getByRole('button', { name: testT('label.convert') });

    act(() => {
      fireEvent.click(convertBtn);
    });

    unmount();

    await act(async () => {
      resolvePromise!({
        isValid: true,
        matches: [{ match: 'foo', index: 0, end: 3, groups: [] }],
      });
    });

    expect(useRegexTesterStore.getState().toValue).toBe('');
  });

  it('should ignore stale async result when newer convert call is initiated', async () => {
    let resolveFirst: (value: RegexExecutionResult) => void;
    const firstPromise = new Promise<RegexExecutionResult>((resolve) => {
      resolveFirst = resolve;
    });

    const runRegexMock = vi
      .fn()
      .mockReturnValueOnce(firstPromise)
      .mockResolvedValueOnce({
        isValid: true,
        matches: [{ match: 'second', index: 0, end: 6, groups: [] }],
      });

    vi.spyOn(useRegexWorkerModule, 'useRegexWorker').mockReturnValue({
      runRegex: runRegexMock,
    });

    useRegexTesterStore.setState({
      auto: false,
      pattern: 'foo',
      testText: 'foo',
    });

    render(<RegexTester />);
    const convertBtn = screen.getByRole('button', { name: testT('label.convert') });

    act(() => {
      fireEvent.click(convertBtn);
    });

    await act(async () => {
      fireEvent.click(convertBtn);
    });

    expect(useRegexTesterStore.getState().toValue).toBe('second');

    // Settle first (stale) call
    await act(async () => {
      resolveFirst!({
        isValid: true,
        matches: [{ match: 'first', index: 0, end: 5, groups: [] }],
      });
    });

    // Stale result should NOT overwrite second result
    expect(useRegexTesterStore.getState().toValue).toBe('second');
  });

  it('should clear matches when pattern becomes invalid', () => {
    act(() => {
      useRegexTesterStore.getState().setPattern('[');
    });

    render(<RegexTester />);

    expect(screen.queryByText(/Match 1/)).toBeNull();
  });

  it('should clear stale toError as soon as a new conversion starts', async () => {
    useRegexTesterStore.setState({
      auto: false,
      pattern: 'foo',
      testText: 'foo',
      toError: 'Previous execution error',
    });

    render(<RegexTester />);
    const convertBtn = screen.getByRole('button', { name: testT('label.convert') });

    await act(async () => {
      fireEvent.click(convertBtn);
    });

    expect(useRegexTesterStore.getState().toError).toBeUndefined();
  });

  it('should retain toValue during in-flight evaluation and update when new result arrives', async () => {
    let resolvePromise: (value: RegexExecutionResult) => void;
    const pendingPromise = new Promise<RegexExecutionResult>((resolve) => {
      resolvePromise = resolve;
    });

    vi.spyOn(useRegexWorkerModule, 'useRegexWorker').mockReturnValue({
      runRegex: vi.fn().mockReturnValue(pendingPromise),
    });

    useRegexTesterStore.setState({
      auto: false,
      pattern: 'foo',
      testText: 'foo bar',
      toValue: 'old-stale-match',
    });

    render(<RegexTester />);
    const convertBtn = screen.getByRole('button', { name: testT('label.convert') });

    act(() => {
      fireEvent.click(convertBtn);
    });

    // Previous value is retained without flicker while in-flight
    expect(useRegexTesterStore.getState().toValue).toBe('old-stale-match');

    await act(async () => {
      resolvePromise!({
        isValid: true,
        matches: [{ match: 'new-match', index: 0, end: 9, groups: [] }],
      });
    });

    expect(useRegexTesterStore.getState().toValue).toBe('new-match');
  });

  it('should not display 0-matches badge before evaluation completes', async () => {
    let resolveExecution: (res: RegexExecutionResult) => void;
    const executionPromise = new Promise<RegexExecutionResult>((resolve) => {
      resolveExecution = resolve;
    });

    vi.spyOn(useRegexWorkerModule, 'useRegexWorker').mockReturnValue({
      runRegex: vi.fn().mockReturnValue(executionPromise),
    });

    useRegexTesterStore.setState({
      auto: false,
      pattern: 'abc',
      testText: 'abcdef',
    });

    render(<RegexTester />);

    // Before convert, no badge should be shown
    expect(screen.queryByText(testT('regexTester.matchCount', { count: 0 }))).toBeNull();

    // Trigger convert
    const convertBtn = screen.getByRole('button', { name: testT('label.convert') });
    act(() => {
      fireEvent.click(convertBtn);
    });

    // While in-flight, no 0-matches badge
    expect(screen.queryByText(testT('regexTester.matchCount', { count: 0 }))).toBeNull();

    // Resolve with matches
    await act(async () => {
      resolveExecution({
        isValid: true,
        matches: [{ match: 'abc', index: 0, end: 3, groups: [] }],
      });
    });

    // Now it shows 1 match
    expect(screen.getByText(testT('regexTester.matchCount', { count: 1 }))).toBeDefined();
    expect(screen.queryByText(testT('regexTester.matchCount', { count: 0 }))).toBeNull();
  });

  it('should set error and not mark as evaluated when runRegex returns an error', async () => {
    vi.spyOn(useRegexWorkerModule, 'useRegexWorker').mockReturnValue({
      runRegex: vi.fn().mockResolvedValue({
        isValid: false,
        error: 'Execution timed out',
        matches: [],
      }),
    });

    useRegexTesterStore.setState({
      auto: false,
      pattern: 'foo',
      testText: 'foo bar',
    });

    render(<RegexTester />);
    const convertBtn = screen.getByRole('button', { name: testT('label.convert') });

    await act(async () => {
      fireEvent.click(convertBtn);
    });

    expect(useRegexTesterStore.getState().toError).toBe('Execution timed out');
    expect(screen.queryByText(testT('regexTester.matchCount', { count: 0 }))).toBeNull();
  });

  it('should not mark as evaluated when testText is empty', async () => {
    useRegexTesterStore.setState({
      auto: false,
      pattern: 'foo',
      testText: '',
    });

    render(<RegexTester />);
    const convertBtn = screen.getByRole('button', { name: testT('label.convert') });

    await act(async () => {
      fireEvent.click(convertBtn);
    });

    expect(screen.queryByText(testT('regexTester.matchCount', { count: 0 }))).toBeNull();
  });

  it('should not mark as evaluated when pattern is empty', async () => {
    useRegexTesterStore.setState({
      auto: false,
      pattern: '',
      testText: 'sample text',
    });

    render(<RegexTester />);
    const convertBtn = screen.getByRole('button', { name: testT('label.convert') });

    await act(async () => {
      fireEvent.click(convertBtn);
    });

    expect(screen.queryByText(testT('regexTester.matchCount', { count: 0 }))).toBeNull();
  });

  it('should not render spinner on initial render or auto-convert when pattern and testText are empty', async () => {
    vi.useFakeTimers();
    useRegexTesterStore.setState({
      auto: true,
      pattern: '',
      testText: '',
    });

    render(<RegexTester />);

    expect(screen.queryByTestId('regex-output-spinner')).toBeNull();

    await act(async () => {
      vi.advanceTimersByTime(500);
    });

    expect(screen.queryByTestId('regex-output-spinner')).toBeNull();
    vi.useRealTimers();
  });

  it('should not render spinner and should keep isPending false when Convert is clicked with blank inputs', async () => {
    useRegexTesterStore.setState({
      auto: false,
      pattern: '',
      testText: '',
    });

    render(<RegexTester />);
    const convertBtn = screen.getByRole('button', { name: testT('label.convert') });

    await act(async () => {
      fireEvent.click(convertBtn);
    });

    expect(screen.queryByTestId('regex-output-spinner')).toBeNull();
  });

  it('should remove matches when the replacement is blank', async () => {
    useRegexTesterStore.setState({
      auto: false,
      pattern: 'foo',
      testText: 'foo bar foo',
      replacement: '',
    });

    render(<RegexTester />);

    const convertBtn = screen.getByRole('button', { name: testT('label.convert') });
    await act(async () => {
      fireEvent.click(convertBtn);
    });

    await waitFor(() => {
      expect(useRegexTesterStore.getState().toValue).toBe(' bar ');
    });
    expect(screen.getByText(testT('regexTester.matchCount', { count: 2 }))).toBeDefined();
  });

  it('should compute replaced text using capture group references', async () => {
    useRegexTesterStore.setState({
      auto: false,
      pattern: '(\\w+)@(\\w+)',
      testText: 'alice@example',
      replacement: '$2:$1',
    });

    render(<RegexTester />);

    const convertBtn = screen.getByRole('button', { name: testT('label.convert') });
    await act(async () => {
      fireEvent.click(convertBtn);
    });

    await waitFor(() => {
      expect(useRegexTesterStore.getState().toValue).toBe('example:alice');
    });
  });
});
