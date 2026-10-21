import { act, fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useDownloadFile } from '@/hooks/use-download-file';
import { testT } from '@/test-helpers/i18n';

import { RegexOutput } from '../regex-output';
import { useRegexTesterStore } from '../regex-tester-store';
import { MatchResult } from '../utils';

const mockDownload = vi.fn();

describe('RegexOutput component', () => {
  beforeEach(() => {
    act(() => {
      useRegexTesterStore.getState().reset();
    });
    vi.clearAllMocks();
    vi.mocked(useDownloadFile).mockReturnValue(mockDownload);
  });

  it('should render empty state placeholder when no matches and not evaluated', () => {
    render(<RegexOutput matches={[]} />);

    expect(screen.getByPlaceholderText(testT('converter.resultPlaceholder'))).toBeDefined();
    expect(screen.queryByText(testT('regexTester.matchCount', { count: 0 }))).toBeNull();
  });

  it('should not render evaluated empty state or 0-matches badge when hasEvaluated is false', () => {
    act(() => {
      useRegexTesterStore.getState().setPattern('foo');
      useRegexTesterStore.getState().setTestText('bar');
    });

    render(<RegexOutput matches={[]} isValid={true} hasEvaluated={false} />);

    expect(screen.getByPlaceholderText(testT('converter.resultPlaceholder'))).toBeDefined();
    expect(screen.queryByText(testT('regexTester.matchCount', { count: 0 }))).toBeNull();
  });

  it('should render evaluated empty state with badge and hint when pattern and text exist with zero matches and hasEvaluated is true', () => {
    act(() => {
      useRegexTesterStore.getState().setPattern('foo');
      useRegexTesterStore.getState().setTestText('bar');
    });

    render(<RegexOutput matches={[]} isValid={true} hasEvaluated={true} />);

    expect(screen.getByPlaceholderText(testT('regexTester.noMatchesHint'))).toBeDefined();
    expect(screen.getByText(testT('regexTester.matchCount', { count: 0 }))).toBeDefined();
  });

  it('should not render evaluated empty state or 0-matches badge while evaluation is pending even if hasEvaluated is true', () => {
    act(() => {
      useRegexTesterStore.getState().setPattern('foo');
      useRegexTesterStore.getState().setTestText('bar');
    });

    render(<RegexOutput matches={[]} isValid={true} isPending={true} hasEvaluated={true} />);

    expect(screen.getByPlaceholderText(testT('converter.resultPlaceholder'))).toBeDefined();
    expect(screen.queryByText(testT('regexTester.matchCount', { count: 0 }))).toBeNull();
  });

  it('should render matches list and badge when matches exist', () => {
    const matches: MatchResult[] = [
      { match: 'first', index: 0, end: 5, groups: [] },
      { match: 'second', index: 6, end: 12, groups: [] },
    ];

    render(<RegexOutput matches={matches} />);

    expect(screen.getByText(testT('regexTester.matchCount', { count: 2 }))).toBeDefined();
    expect(screen.getByText('first')).toBeDefined();
    expect(screen.getByText('second')).toBeDefined();
  });

  it('should copy match on click and on Enter / Space keydown', async () => {
    const matches: MatchResult[] = [{ match: 'hello', index: 0, end: 5, groups: [] }];

    render(<RegexOutput matches={matches} />);

    const matchEl = screen.getByRole('button', { name: /hello/ });

    // Click
    act(() => {
      fireEvent.click(matchEl);
    });
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('hello');

    // Enter
    act(() => {
      fireEvent.keyDown(matchEl, { key: 'Enter' });
    });
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('hello');

    // Space
    act(() => {
      fireEvent.keyDown(matchEl, { key: ' ' });
    });
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('hello');

    // Other key (does nothing)
    vi.mocked(navigator.clipboard.writeText).mockClear();
    act(() => {
      fireEvent.keyDown(matchEl, { key: 'Escape' });
    });
    expect(navigator.clipboard.writeText).not.toHaveBeenCalled();
  });

  it('should copy all matches when PanelActions Copy is clicked and matches exist', () => {
    const matches: MatchResult[] = [
      { match: 'line1', index: 0, end: 5, groups: [] },
      { match: 'line2', index: 6, end: 11, groups: [] },
    ];

    render(<RegexOutput matches={matches} />);

    const copyBtn = screen.getByRole('button', {
      name: testT('aria.copyContext', { context: testT('label.result') }),
    });
    act(() => {
      fireEvent.click(copyBtn);
    });

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('line1\nline2');
  });

  it('should disable Copy when matches are empty', () => {
    render(<RegexOutput matches={[]} />);

    const copyBtn = screen.getByRole('button', {
      name: testT('aria.copyContext', { context: testT('label.result') }),
    }) as HTMLButtonElement;

    expect(copyBtn.disabled).toBe(true);
  });

  it('should download matches when PanelActions Download is clicked and matches exist', () => {
    const matches: MatchResult[] = [{ match: 'download-me', index: 0, end: 11, groups: [] }];

    render(<RegexOutput matches={matches} />);

    const downloadBtn = screen.getByRole('button', { name: testT('label.download') });
    act(() => {
      fireEvent.click(downloadBtn);
    });

    expect(mockDownload).toHaveBeenCalledWith('download-me', ['regex', 'matches'], 'text/plain');
  });

  it('should disable Download when matches are empty', () => {
    render(<RegexOutput matches={[]} />);

    const downloadBtn = screen.getByRole('button', { name: testT('label.download') }) as HTMLButtonElement;

    expect(downloadBtn.disabled).toBe(true);
  });

  it('should display error message in textarea and disable copying or downloading error', () => {
    act(() => {
      useRegexTesterStore.getState().setToError('Execution timed out');
    });

    render(<RegexOutput matches={[]} />);

    const textarea = screen.getByLabelText(testT('regexTester.resultsLabel')) as HTMLTextAreaElement;
    expect(textarea.value).toBe('Execution timed out');
    expect(textarea.getAttribute('role')).toBe('alert');

    const copyBtn = screen.getByRole('button', {
      name: testT('aria.copyContext', { context: testT('label.result') }),
    }) as HTMLButtonElement;
    expect(copyBtn.disabled).toBe(true);

    const downloadBtn = screen.getByRole('button', { name: testT('label.download') }) as HTMLButtonElement;
    expect(downloadBtn.disabled).toBe(true);
  });

  it('should render capped badge and hint tooltip when isCapped is true', () => {
    act(() => {
      useRegexTesterStore.getState().setMaxMatches(5000);
    });

    const matches: MatchResult[] = [
      { match: 'm1', index: 0, end: 2, groups: [] },
      { match: 'm2', index: 3, end: 5, groups: [] },
    ];

    render(<RegexOutput matches={matches} isCapped={true} />);

    const badge = screen.getByText(testT('regexTester.matchCountCapped', { count: 2 }));
    expect(badge).toBeDefined();
    expect(badge.getAttribute('title')).toBeNull();

    const infoBtn = screen.getByRole('button', {
      name: testT('regexTester.matchesCappedHint', { max: 5000 }),
    });
    expect(infoBtn).toBeDefined();
    expect(infoBtn.getAttribute('tabindex')).toBe('0');
  });

  it('should render spinner overlay when isPending and isValid are true and pattern/testText exist', () => {
    act(() => {
      useRegexTesterStore.getState().setPattern('abc');
      useRegexTesterStore.getState().setTestText('abcdef');
    });

    render(<RegexOutput matches={[]} isPending={true} isValid={true} />);

    expect(screen.getByTestId('regex-output-spinner')).toBeDefined();
    expect(screen.getByRole('status', { name: 'Loading' })).toBeDefined();
  });

  it('should not render spinner overlay when pattern or testText is blank even if isPending is true', () => {
    act(() => {
      useRegexTesterStore.getState().setPattern('');
      useRegexTesterStore.getState().setTestText('');
    });

    render(<RegexOutput matches={[]} isPending={true} isValid={true} />);

    expect(screen.queryByTestId('regex-output-spinner')).toBeNull();
  });

  it('should not render spinner overlay when isValid is false even if isPending is true', () => {
    act(() => {
      useRegexTesterStore.getState().setPattern('abc');
      useRegexTesterStore.getState().setTestText('abcdef');
    });

    render(<RegexOutput matches={[]} isPending={true} isValid={false} />);

    expect(screen.queryByTestId('regex-output-spinner')).toBeNull();
  });

  it('should fall back to default invalidPattern message when isValid is false and error is not provided', () => {
    act(() => {
      useRegexTesterStore.getState().setPattern('[invalid');
    });

    render(<RegexOutput matches={[]} isValid={false} error={undefined} />);

    const textarea = screen.getByLabelText(testT('regexTester.resultsLabel')) as HTMLTextAreaElement;
    expect(textarea.value).toBe(testT('regexTester.invalidPattern'));
  });

  it('should retain matches and render spinner overlay while isPending is true', () => {
    act(() => {
      useRegexTesterStore.getState().setPattern('abc');
      useRegexTesterStore.getState().setTestText('abcdef');
    });

    const staleMatches: MatchResult[] = [{ match: 'abc', index: 0, end: 3, groups: [] }];

    render(<RegexOutput matches={staleMatches} isPending={true} isValid={true} />);

    // Matches remain rendered to prevent DOM layout shift / flicker
    expect(screen.getByRole('region', { name: testT('regexTester.resultsLabel') })).toBeDefined();
    expect(screen.getByText(testT('regexTester.matchCount', { count: 1 }))).toBeDefined();

    // Spinner overlay is active
    expect(screen.getByTestId('regex-output-spinner')).toBeDefined();
  });
});
