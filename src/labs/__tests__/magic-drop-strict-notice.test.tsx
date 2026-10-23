import { fireEvent, render, screen } from '@testing-library/react';
import { toast } from 'sonner';
import { describe, expect, it, vi } from 'vitest';

import { DATA_RETENTION_MODE } from '@/constants/common';
import { usePreferencesStore } from '@/store/preferences-store';
import { matchI18nPlainText, testT } from '@/test-helpers/i18n';

import { MagicDropStrictNotice } from '../magic-drop-strict-notice';

const okName = testT('label.ok');
const sessionLinkName = testT('labs.magicDrop.useSessionInstead');
const dontShowName = testT('label.dontShowAgain');

describe('MagicDropStrictNotice', () => {
  it('should render the strict privacy warning with an unchecked checkbox and no close button', () => {
    render(<MagicDropStrictNotice onDismiss={vi.fn()} />);

    expect(screen.getByText(testT('labs.magicDrop.strictRetentionTitle'))).toBeDefined();
    expect(screen.getByText(matchI18nPlainText('labs.magicDrop.strictRetentionDescription'))).toBeDefined();
    expect(screen.getByRole('checkbox', { name: dontShowName }).getAttribute('aria-checked')).toBe('false');
    expect(screen.queryByRole('button', { name: /close/i })).toBeNull();
  });

  it('should stay open when the escape key is pressed', () => {
    const onDismiss = vi.fn();
    render(<MagicDropStrictNotice onDismiss={onDismiss} />);

    fireEvent.keyDown(document.body, { key: 'Escape' });

    expect(onDismiss).not.toHaveBeenCalled();
    expect(usePreferencesStore.getState().labs.magicDrop).toBe(false);
    expect(screen.getByText(testT('labs.magicDrop.strictRetentionTitle'))).toBeDefined();
  });

  it('should enable magic drop without opting out when the checkbox is unchecked', () => {
    const onDismiss = vi.fn();
    render(<MagicDropStrictNotice onDismiss={onDismiss} />);

    fireEvent.click(screen.getByRole('button', { name: okName }));

    expect(onDismiss).toHaveBeenCalledOnce();
    expect(usePreferencesStore.getState().labs.magicDrop).toBe(true);
    expect(usePreferencesStore.getState().labs.magicDropStrictNoticeOptOut).toBe(false);
    expect(toast.success).toHaveBeenCalledWith(testT('labs.magicDrop.toastEnabled'));
  });

  it('should opt out of the notice when enabled with the checkbox checked', () => {
    const onDismiss = vi.fn();
    render(<MagicDropStrictNotice onDismiss={onDismiss} />);

    fireEvent.click(screen.getByRole('checkbox', { name: dontShowName }));
    fireEvent.click(screen.getByRole('button', { name: okName }));

    expect(onDismiss).toHaveBeenCalledOnce();
    expect(usePreferencesStore.getState().labs.magicDrop).toBe(true);
    expect(usePreferencesStore.getState().labs.magicDropStrictNoticeOptOut).toBe(true);
  });

  it('should switch to session retention without opting out when the checkbox is unchecked', () => {
    const onDismiss = vi.fn();
    render(<MagicDropStrictNotice onDismiss={onDismiss} />);

    fireEvent.click(screen.getByRole('button', { name: sessionLinkName }));

    expect(onDismiss).toHaveBeenCalledOnce();
    expect(usePreferencesStore.getState().dataRetentionMode).toBe(DATA_RETENTION_MODE.SESSION);
    expect(usePreferencesStore.getState().labs.magicDrop).toBe(true);
    expect(usePreferencesStore.getState().labs.magicDropStrictNoticeOptOut).toBe(false);
    expect(toast.success).toHaveBeenCalledTimes(1);
    expect(toast.success).toHaveBeenCalledWith(testT('labs.magicDrop.toastEnabledWithSession'));
  });

  it('should opt out of the notice when switching to session retention with the checkbox checked', () => {
    const onDismiss = vi.fn();
    render(<MagicDropStrictNotice onDismiss={onDismiss} />);

    fireEvent.click(screen.getByRole('checkbox', { name: dontShowName }));
    fireEvent.click(screen.getByRole('button', { name: sessionLinkName }));

    expect(onDismiss).toHaveBeenCalledOnce();
    expect(usePreferencesStore.getState().dataRetentionMode).toBe(DATA_RETENTION_MODE.SESSION);
    expect(usePreferencesStore.getState().labs.magicDropStrictNoticeOptOut).toBe(true);
    expect(toast.success).toHaveBeenCalledTimes(1);
    expect(toast.success).toHaveBeenCalledWith(testT('labs.magicDrop.toastEnabledWithSession'));
  });
});
