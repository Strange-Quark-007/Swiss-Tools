import { act, fireEvent, render, screen, within } from '@testing-library/react';
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

  it('should render evaluated empty state with hint and without a match badge when pattern and text exist with zero matches and hasEvaluated is true', () => {
    act(() => {
      useRegexTesterStore.getState().setPattern('foo');
      useRegexTesterStore.getState().setTestText('bar');
    });

    render(<RegexOutput matches={[]} isValid={true} hasEvaluated={true} />);

    expect(screen.getByPlaceholderText(testT('regexTester.noMatchesHint'))).toBeDefined();
    expect(screen.queryByText(testT('label.noResults'))).toBeNull();
    expect(screen.queryByText(testT('regexTester.matchCount', { count: 0 }))).toBeNull();
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

  it('should skip copy and download while evaluation is pending even with matches present', () => {
    const matches: MatchResult[] = [{ match: 'pending', index: 0, end: 7, groups: [] }];

    render(<RegexOutput matches={matches} isPending={true} />);

    const copyBtn = screen.getByRole('button', {
      name: testT('aria.copyContext', { context: testT('label.result') }),
    });
    const downloadBtn = screen.getByRole('button', { name: testT('label.download') });

    act(() => {
      fireEvent.click(copyBtn);
      fireEvent.click(downloadBtn);
    });

    expect(navigator.clipboard.writeText).not.toHaveBeenCalled();
    expect(mockDownload).not.toHaveBeenCalled();
  });

  it('should skip copy and download when an execution error exists even with matches present', () => {
    const matches: MatchResult[] = [{ match: 'stale', index: 0, end: 5, groups: [] }];

    act(() => {
      useRegexTesterStore.getState().setToError('Execution timed out');
    });

    render(<RegexOutput matches={matches} />);

    const copyBtn = screen.getByRole('button', {
      name: testT('aria.copyContext', { context: testT('label.result') }),
    });
    const downloadBtn = screen.getByRole('button', { name: testT('label.download') });

    act(() => {
      fireEvent.click(copyBtn);
      fireEvent.click(downloadBtn);
    });

    expect(navigator.clipboard.writeText).not.toHaveBeenCalled();
    expect(mockDownload).not.toHaveBeenCalled();
  });

  it('should display error message in textarea and disable copying or downloading error', () => {
    act(() => {
      useRegexTesterStore.getState().setToError('Execution timed out');
    });

    render(<RegexOutput matches={[]} />);

    const textarea = screen.getByLabelText(testT('regexTester.resultsLabel')) as HTMLTextAreaElement;
    expect(textarea.value).toBe('Execution timed out');
    expect(textarea.closest('[role="alert"]')).not.toBeNull();

    const copyBtn = screen.getByRole('button', {
      name: testT('aria.copyContext', { context: testT('label.result') }),
    }) as HTMLButtonElement;
    expect(copyBtn.disabled).toBe(true);

    const downloadBtn = screen.getByRole('button', { name: testT('label.download') }) as HTMLButtonElement;
    expect(downloadBtn.disabled).toBe(true);
  });

  it('should put the cap hint in the badge tooltip when isCapped is true', () => {
    act(() => {
      useRegexTesterStore.getState().setMaxMatches(5000);
    });

    const matches: MatchResult[] = [
      { match: 'm1', index: 0, end: 2, groups: [] },
      { match: 'm2', index: 3, end: 5, groups: [] },
    ];

    render(<RegexOutput matches={matches} isCapped={true} />);

    const countText = testT('regexTester.matchCountCapped', { count: 2 });
    const cappedHint = testT('regexTester.matchesCappedHint', { max: 5000 });
    const badge = screen.getByLabelText(`${countText}. ${cappedHint}`);

    expect(badge.textContent).toBe(countText);
    expect(badge.querySelector('svg')).not.toBeNull();
    expect(badge.getAttribute('tabindex')).toBe('0');
    expect(badge.getAttribute('aria-label')).toBe(`${countText}. ${cappedHint}`);
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
    expect(screen.getByRole('alert').contains(textarea)).toBe(true);
  });

  it('should retain matches and render spinner overlay while isPending is true', () => {
    act(() => {
      useRegexTesterStore.getState().setPattern('abc');
      useRegexTesterStore.getState().setTestText('abcdef');
    });

    const staleMatches: MatchResult[] = [{ match: 'abc', index: 0, end: 3, groups: [] }];

    render(<RegexOutput matches={staleMatches} isPending={true} isValid={true} />);

    // Matches remain rendered to prevent DOM layout shift / flicker
    expect(screen.getByRole('tabpanel', { name: testT('regexTester.matchesTab') })).toBeDefined();
    expect(screen.getByText(testT('regexTester.matchCount', { count: 1 }))).toBeDefined();

    // Spinner overlay is active
    expect(screen.getByTestId('regex-output-spinner')).toBeDefined();
  });

  it('should default to the Matches view and switch to the Replace view', () => {
    render(<RegexOutput matches={[]} />);

    const matchesTab = screen.getByRole('tab', { name: testT('regexTester.matchesTab') });
    const replaceTab = screen.getByRole('tab', { name: testT('regexTester.replaceTab') });

    expect(matchesTab.getAttribute('aria-selected')).toBe('true');
    expect(replaceTab.getAttribute('aria-selected')).toBe('false');
    expect(screen.queryByLabelText(testT('regexTester.replacement'))).toBeNull();

    act(() => {
      fireEvent.click(replaceTab);
    });

    expect(replaceTab.getAttribute('aria-selected')).toBe('true');
    expect(screen.getByLabelText(testT('regexTester.replacement'))).toBeDefined();

    act(() => {
      fireEvent.click(matchesTab);
    });

    expect(matchesTab.getAttribute('aria-selected')).toBe('true');
    expect(screen.queryByLabelText(testT('regexTester.replacement'))).toBeNull();
  });

  it('should move between result tabs with arrow keys', () => {
    render(<RegexOutput matches={[]} />);

    const matchesTab = screen.getByRole('tab', { name: testT('regexTester.matchesTab') });
    const replaceTab = screen.getByRole('tab', { name: testT('regexTester.replaceTab') });

    act(() => {
      fireEvent.keyDown(matchesTab, { key: 'ArrowRight' });
    });

    expect(replaceTab.getAttribute('aria-selected')).toBe('true');
    expect(document.activeElement).toBe(replaceTab);

    act(() => {
      fireEvent.keyDown(replaceTab, { key: 'ArrowLeft' });
    });

    expect(matchesTab.getAttribute('aria-selected')).toBe('true');
    expect(document.activeElement).toBe(matchesTab);
  });

  it('should support Home and End keys and ignore unrelated keys on result tabs', () => {
    render(<RegexOutput matches={[]} />);

    const matchesTab = screen.getByRole('tab', { name: testT('regexTester.matchesTab') });
    const replaceTab = screen.getByRole('tab', { name: testT('regexTester.replaceTab') });

    act(() => {
      fireEvent.keyDown(matchesTab, { key: 'Tab' });
    });

    expect(matchesTab.getAttribute('aria-selected')).toBe('true');

    act(() => {
      fireEvent.keyDown(matchesTab, { key: 'End' });
    });

    expect(replaceTab.getAttribute('aria-selected')).toBe('true');

    act(() => {
      fireEvent.keyDown(replaceTab, { key: 'Home' });
    });

    expect(matchesTab.getAttribute('aria-selected')).toBe('true');
  });

  it('should update the stored replacement when typing in the Replace view', () => {
    render(<RegexOutput matches={[]} />);

    act(() => {
      fireEvent.click(screen.getByRole('tab', { name: testT('regexTester.replaceTab') }));
    });

    const input = screen.getByLabelText(testT('regexTester.replacement')) as HTMLInputElement;

    expect(input.getAttribute('aria-describedby')).toBeNull();
    expect(input.getAttribute('placeholder')).toBe(testT('regexTester.replacementPlaceholder'));

    act(() => {
      fireEvent.change(input, { target: { value: '$1-$2' } });
    });

    expect(useRegexTesterStore.getState().replacement).toBe('$1-$2');
  });

  it('should render replaced segments with boxes in the Replace view', () => {
    act(() => {
      useRegexTesterStore.getState().setPattern('\\d+');
      useRegexTesterStore.getState().setTestText('a1b22c');
      useRegexTesterStore.getState().setReplacement('[$&]');
    });

    const { container } = render(
      <RegexOutput
        matches={[]}
        replacementSegments={[
          { text: 'a', isReplacement: false },
          { text: '[1]', isReplacement: true, matchIndex: 1 },
          { text: 'b', isReplacement: false },
          { text: '[22]', isReplacement: true, matchIndex: 2 },
          { text: 'c', isReplacement: false },
        ]}
      />
    );

    act(() => {
      fireEvent.click(screen.getByRole('tab', { name: testT('regexTester.replaceTab') }));
    });

    expect(screen.getByRole('tabpanel', { name: testT('regexTester.replaceTab') })).toBeDefined();
    expect(container.querySelectorAll('mark')).toHaveLength(2);
    expect(screen.getByText('[1]')).toBeDefined();
    expect(screen.getByText('[22]')).toBeDefined();
    expect(screen.getByText('a')).toBeDefined();
    expect(screen.getByText('c')).toBeDefined();
  });

  it('should render no visible content for an empty replacement segment', () => {
    render(
      <RegexOutput
        matches={[]}
        replacementSegments={[
          { text: 'ab', isReplacement: false },
          { text: '', isReplacement: true, matchIndex: 1 },
          { text: 'c', isReplacement: false },
        ]}
      />
    );

    act(() => {
      fireEvent.click(screen.getByRole('tab', { name: testT('regexTester.replaceTab') }));
    });

    const panel = screen.getByRole('tabpanel', { name: testT('regexTester.replaceTab') });
    expect(panel.textContent).toBe('abc');
    expect(panel.querySelectorAll('mark')).toHaveLength(0);
  });

  it('should keep result textareas exposed as textboxes inside the active tab panel', () => {
    render(<RegexOutput matches={[]} />);

    const matchesPanel = screen.getByRole('tabpanel', { name: testT('regexTester.matchesTab') });
    expect(within(matchesPanel).getByRole('textbox', { name: testT('regexTester.resultsLabel') })).toBeDefined();

    act(() => {
      fireEvent.click(screen.getByRole('tab', { name: testT('regexTester.replaceTab') }));
    });

    const replacePanel = screen.getByRole('tabpanel', { name: testT('regexTester.replaceTab') });
    expect(within(replacePanel).getByRole('textbox', { name: testT('regexTester.replacedText') })).toBeDefined();
  });

  it('should use the segment position when a replacement has no match index and fade while pending', () => {
    act(() => {
      useRegexTesterStore.getState().setPattern('a');
      useRegexTesterStore.getState().setTestText('a');
    });

    render(
      <RegexOutput
        matches={[]}
        isPending
        replacementSegments={[
          { text: 'a', isReplacement: false },
          { text: 'X', isReplacement: true },
        ]}
      />
    );

    act(() => {
      fireEvent.click(screen.getByRole('tab', { name: testT('regexTester.replaceTab') }));
    });

    expect(screen.getByText('X').getAttribute('title')).toBe(
      testT('regexTester.replacementMatch', { index: 2, text: 'X' })
    );
    expect(screen.getByTestId('regex-output-spinner')).toBeDefined();
  });

  it('should display errors in the Replace view without hiding the replacement input', () => {
    act(() => {
      useRegexTesterStore.getState().setToError('Execution timed out');
    });

    render(<RegexOutput matches={[]} />);

    act(() => {
      fireEvent.click(screen.getByRole('tab', { name: testT('regexTester.replaceTab') }));
    });

    const textarea = screen.getByLabelText(testT('regexTester.replacedText')) as HTMLTextAreaElement;

    expect(textarea.value).toBe('Execution timed out');
    expect(textarea.closest('[role="alert"]')).not.toBeNull();
    expect(screen.getByLabelText(testT('regexTester.replacement'))).toBeDefined();
  });

  it('should show the replaced text placeholder when no replacement has been evaluated', () => {
    render(<RegexOutput matches={[]} />);

    act(() => {
      fireEvent.click(screen.getByRole('tab', { name: testT('regexTester.replaceTab') }));
    });

    expect(screen.getByPlaceholderText(testT('regexTester.replacedTextPlaceholder'))).toBeDefined();
  });

  it('should copy and download replaced text in the Replace view', () => {
    act(() => {
      useRegexTesterStore.getState().setReplacement('$1');
      useRegexTesterStore.getState().setToValue('replaced output');
    });

    render(<RegexOutput matches={[]} />);

    act(() => {
      fireEvent.click(screen.getByRole('tab', { name: testT('regexTester.replaceTab') }));
    });

    const copyBtn = screen.getByRole('button', {
      name: testT('aria.copyContext', { context: testT('regexTester.replacedText') }),
    });
    const downloadBtn = screen.getByRole('button', { name: testT('label.download') });

    act(() => {
      fireEvent.click(copyBtn);
      fireEvent.click(downloadBtn);
    });

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('replaced output');
    expect(mockDownload).toHaveBeenCalledWith('replaced output', ['regex', 'replaced'], 'text/plain');
  });

  it('should render whitespace-only matches with readable labels and toggle their visibility', () => {
    const matches: MatchResult[] = [
      { match: ' ', index: 0, end: 1, groups: [] },
      { match: 'word', index: 2, end: 6, groups: [] },
    ];

    render(<RegexOutput matches={matches} />);

    expect(screen.getByText('[space]')).toBeDefined();
    expect(screen.getByText('word')).toBeDefined();
    expect(screen.getByText(testT('regexTester.matchCount', { count: 2 }))).toBeDefined();
    expect(screen.getByText(testT('regexTester.hideWhitespaceMatches', { count: 1 }))).toBeDefined();

    const toggleBtn = screen.getByRole('button', {
      name: testT('regexTester.hideWhitespaceMatches', { count: 1 }),
    });

    act(() => {
      fireEvent.click(toggleBtn);
    });

    expect(screen.queryByText('[space]')).toBeNull();
    expect(screen.getByText('word')).toBeDefined();
    expect(screen.getByText(testT('regexTester.matchIndex', { index: 2 }))).toBeDefined();
    expect(toggleBtn.getAttribute('aria-pressed')).toBe('true');
    expect(toggleBtn.textContent).toBe(testT('label.showAll'));
    expect(screen.getByRole('button', { name: testT('label.showAll') })).toBe(toggleBtn);

    act(() => {
      fireEvent.click(toggleBtn);
    });

    expect(screen.getByText('[space]')).toBeDefined();
    expect(toggleBtn.getAttribute('aria-pressed')).toBe('false');
    expect(toggleBtn.textContent).toBe(testT('regexTester.hideWhitespaceMatches', { count: 1 }));
    expect(screen.getByRole('button', { name: testT('regexTester.hideWhitespaceMatches', { count: 1 }) })).toBe(
      toggleBtn
    );
  });

  it('should disable the whitespace toggle in Replace view', () => {
    const matches: MatchResult[] = [{ match: '\t', index: 0, end: 1, groups: [] }];

    render(<RegexOutput matches={matches} />);

    const toggleBtn = screen.getByRole('button', {
      name: testT('regexTester.hideWhitespaceMatches', { count: 1 }),
    }) as HTMLButtonElement;
    expect(toggleBtn.disabled).toBe(false);

    act(() => {
      fireEvent.click(screen.getByRole('tab', { name: testT('regexTester.replaceTab') }));
    });

    expect(toggleBtn.disabled).toBe(true);
  });

  it('should hide the whitespace-only toggle chip when there are no whitespace-only matches', () => {
    const matches: MatchResult[] = [{ match: 'word', index: 0, end: 4, groups: [] }];

    render(<RegexOutput matches={matches} />);

    expect(screen.getByText(testT('regexTester.matchCount', { count: 1 }))).toBeDefined();
    expect(screen.queryByRole('button', { name: testT('regexTester.hideWhitespaceMatches', { count: 1 }) })).toBeNull();
    expect(screen.queryByRole('button', { name: testT('label.showAll') })).toBeNull();
  });

  it('should show no results when every match is whitespace-only and filtered out', () => {
    const matches: MatchResult[] = [{ match: '\n', index: 0, end: 1, groups: [] }];

    render(<RegexOutput matches={matches} />);

    expect(screen.getByText('[newline]')).toBeDefined();

    act(() => {
      fireEvent.click(screen.getByRole('button', { name: testT('regexTester.hideWhitespaceMatches', { count: 1 }) }));
    });

    expect(screen.getByRole('tabpanel', { name: testT('regexTester.matchesTab') })).toBeDefined();
    expect(screen.queryByText('[newline]')).toBeNull();
    expect(screen.getByText(testT('regexTester.matchCount', { count: 1 }))).toBeDefined();
    expect(screen.getByRole('button', { name: testT('label.showAll') })).toBeDefined();
    expect(screen.getByText(testT('label.noResults'))).toBeDefined();

    act(() => {
      fireEvent.click(screen.getByRole('button', { name: testT('label.showAll') }));
    });

    expect(screen.getByText('[newline]')).toBeDefined();
    expect(screen.queryByText(testT('label.noResults'))).toBeNull();
  });
});
