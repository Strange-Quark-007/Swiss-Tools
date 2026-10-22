import { fireEvent, render, screen } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { toast } from 'sonner';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { DATA_RETENTION_MODE } from '@/constants/common';
import { usePreferencesStore } from '@/store/preferences-store';
import { extractI18nText, matchI18nPlainText, normalizeWhitespace, testT } from '@/test-helpers/i18n';

import { LabsFeatures } from '../labs-features';

const switchName = testT('labs.magicDrop.title');
const noticeTitle = testT('labs.magicDrop.strictRetentionTitle');
const okName = testT('label.ok');

describe('LabsFeatures', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render on the server via getServerSnapshot without crashing', () => {
    const html = renderToString(<LabsFeatures />);

    const renderedText = normalizeWhitespace(new DOMParser().parseFromString(html, 'text/html').body.textContent ?? '');

    expect(html).toContain(testT('labs.magicDrop.title'));
    expect(renderedText).toContain(extractI18nText('labs.magicDrop.description'));
    expect(html).toContain('aria-checked="false"');
  });

  it('should render the magic drop feature card in default off state', () => {
    render(<LabsFeatures />);

    expect(screen.getByText(testT('labs.magicDrop.title'))).toBeDefined();
    expect(screen.getByText(matchI18nPlainText('labs.magicDrop.description'))).toBeDefined();

    const switchEl = screen.getByRole('switch', { name: switchName });
    expect(switchEl).toBeDefined();
    expect(switchEl.getAttribute('aria-checked')).toBe('false');
  });

  it('should toggle magic drop off and trigger disabled toast', () => {
    usePreferencesStore.setState({
      dataRetentionMode: DATA_RETENTION_MODE.STRICT,
      labs: { magicDrop: true, magicDropStrictNoticeOptOut: false },
    });
    render(<LabsFeatures />);

    const switchEl = screen.getByRole('switch', { name: switchName });
    expect(switchEl.getAttribute('aria-checked')).toBe('true');

    fireEvent.click(switchEl);

    expect(usePreferencesStore.getState().labs.magicDrop).toBe(false);
    expect(switchEl.getAttribute('aria-checked')).toBe('false');
    expect(toast.success).toHaveBeenCalledWith(testT('labs.magicDrop.toastDisabled'));
  });

  it('should show the strict retention notice when enabling under strict retention', () => {
    render(<LabsFeatures />);

    const switchEl = screen.getByRole('switch', { name: switchName });
    fireEvent.click(switchEl);

    expect(usePreferencesStore.getState().labs.magicDrop).toBe(false);
    expect(switchEl.getAttribute('aria-checked')).toBe('false');
    expect(screen.getByText(noticeTitle)).toBeDefined();
    expect(toast.success).not.toHaveBeenCalled();
  });

  it('should not show the notice when retention is session', () => {
    usePreferencesStore.setState({ dataRetentionMode: DATA_RETENTION_MODE.SESSION });
    render(<LabsFeatures />);

    fireEvent.click(screen.getByRole('switch', { name: switchName }));

    expect(usePreferencesStore.getState().labs.magicDrop).toBe(true);
    expect(screen.queryByText(noticeTitle)).toBeNull();
    expect(toast.success).toHaveBeenCalledWith(testT('labs.magicDrop.toastEnabled'));
  });

  it('should not show the notice when it was already acknowledged', () => {
    usePreferencesStore.setState({ labs: { magicDrop: false, magicDropStrictNoticeOptOut: true } });
    render(<LabsFeatures />);

    fireEvent.click(screen.getByRole('switch', { name: switchName }));

    expect(screen.queryByText(noticeTitle)).toBeNull();
    expect(toast.success).toHaveBeenCalledWith(testT('labs.magicDrop.toastEnabled'));
  });

  it('should enable magic drop and close the notice when acknowledged', () => {
    render(<LabsFeatures />);

    fireEvent.click(screen.getByRole('switch', { name: switchName }));
    fireEvent.click(screen.getByRole('button', { name: okName }));

    expect(screen.queryByText(noticeTitle)).toBeNull();
    expect(usePreferencesStore.getState().labs.magicDrop).toBe(true);
    expect(toast.success).toHaveBeenCalledWith(testT('labs.magicDrop.toastEnabled'));
  });
});
