import { fireEvent, render, screen } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { toast } from 'sonner';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { DATA_RETENTION_MODE } from '@/constants/common';
import { useAppStore } from '@/store/store';
import * as storeRegistryModule from '@/store/store-registry';
import { testT } from '@/test-helpers/i18n';

import { DataRetentionPreferences } from '../data-retention-preferences';

describe('DataRetentionPreferences', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAppStore.setState({ dataRetentionMode: DATA_RETENTION_MODE.STRICT });
  });

  it('should render on the server via getServerSnapshot without pre-selecting either tier card', () => {
    const html = renderToString(<DataRetentionPreferences />);

    expect(html).toContain(testT('preferences.retention.title'));
    // On server, getServerSnapshot returns undefined so neither radio has aria-checked="true"
    expect(html).not.toContain('aria-checked="true"');
  });

  it('should render retention section with both tier cards', () => {
    render(<DataRetentionPreferences />);

    expect(screen.getByText(testT('preferences.retention.title'))).toBeDefined();
    expect(screen.getByText(testT('preferences.retention.description'))).toBeDefined();

    // Cards
    expect(screen.getByText(testT('preferences.retention.strict.label'))).toBeDefined();
    expect(screen.getByText(testT('preferences.retention.strict.summary'))).toBeDefined();
    expect(screen.getByText(/Inputs and results clear/i)).toBeDefined();

    expect(screen.getByText(testT('preferences.retention.session.label'))).toBeDefined();
    expect(screen.getByText(testT('preferences.retention.session.summary'))).toBeDefined();
    expect(screen.getByText(/without losing your inputs or results/i)).toBeDefined();
  });

  it('should switch to SESSION mode and show success toast when session card is clicked', () => {
    render(<DataRetentionPreferences />);

    const sessionRadio = screen.getByRole('radio', {
      name: new RegExp(testT('preferences.retention.session.label')),
    });

    fireEvent.click(sessionRadio);

    expect(useAppStore.getState().dataRetentionMode).toBe(DATA_RETENTION_MODE.SESSION);
    expect(toast.success).toHaveBeenCalledWith(testT('preferences.retention.toast.sessionActivated'));

    // Clicking session again while already in SESSION is a no-op
    vi.mocked(toast.success).mockClear();
    fireEvent.click(sessionRadio);
    expect(toast.success).not.toHaveBeenCalled();
  });

  it('should open confirmation dialog when clicking strict card from SESSION mode and handle cancel/confirm', () => {
    const resetSpy = vi.spyOn(storeRegistryModule, 'resetAllRegisteredStores').mockImplementation(() => {});
    useAppStore.setState({ dataRetentionMode: DATA_RETENTION_MODE.SESSION });

    render(<DataRetentionPreferences />);

    const strictRadio = screen.getByRole('radio', {
      name: new RegExp(testT('preferences.retention.strict.label')),
    });

    // Clicking strict card while in SESSION opens confirmation dialog
    fireEvent.click(strictRadio);

    expect(screen.getByRole('dialog')).toBeDefined();
    expect(screen.getByText(testT('preferences.retention.toast.strictConfirmTitle'))).toBeDefined();
    expect(screen.getByText(testT('preferences.retention.toast.strictConfirmDescription'))).toBeDefined();

    // Test Cancel button
    const cancelButton = screen.getByRole('button', { name: testT('preferences.retention.toast.cancel') });
    fireEvent.click(cancelButton);

    expect(useAppStore.getState().dataRetentionMode).toBe(DATA_RETENTION_MODE.SESSION);
    expect(resetSpy).not.toHaveBeenCalled();

    // Re-open dialog and test Confirm button
    fireEvent.click(strictRadio);
    const confirmButton = screen.getByRole('button', { name: testT('preferences.retention.toast.confirmClear') });
    fireEvent.click(confirmButton);

    expect(useAppStore.getState().dataRetentionMode).toBe(DATA_RETENTION_MODE.STRICT);
    expect(resetSpy).toHaveBeenCalledTimes(1);
    expect(toast.success).toHaveBeenCalledWith(testT('preferences.retention.toast.strictActivated'));

    // Clicking strict card while already in STRICT does not open dialog
    fireEvent.click(strictRadio);
    expect(screen.queryByRole('dialog')).toBeNull();

    resetSpy.mockRestore();
  });

  it('should handle keyboard navigation on both cards via Enter and Space keys, ignoring other keys', () => {
    render(<DataRetentionPreferences />);

    const sessionRadio = screen.getByRole('radio', {
      name: new RegExp(testT('preferences.retention.session.label')),
    });
    const strictRadio = screen.getByRole('radio', {
      name: new RegExp(testT('preferences.retention.strict.label')),
    });

    // Ignored key on session radio does nothing
    fireEvent.keyDown(sessionRadio, { key: 'ArrowDown' });
    expect(useAppStore.getState().dataRetentionMode).toBe(DATA_RETENTION_MODE.STRICT);

    // Space on session radio activates session mode
    fireEvent.keyDown(sessionRadio, { key: ' ' });
    expect(useAppStore.getState().dataRetentionMode).toBe(DATA_RETENTION_MODE.SESSION);

    // Enter on session radio when already in session is a no-op
    fireEvent.keyDown(sessionRadio, { key: 'Enter' });
    expect(useAppStore.getState().dataRetentionMode).toBe(DATA_RETENTION_MODE.SESSION);

    // Ignored key on strict radio does nothing
    fireEvent.keyDown(strictRadio, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).toBeNull();

    // Enter on strict radio while in session opens dialog
    fireEvent.keyDown(strictRadio, { key: 'Enter' });
    expect(screen.getByRole('dialog')).toBeDefined();

    // Close dialog
    fireEvent.click(screen.getByRole('button', { name: testT('preferences.retention.toast.cancel') }));
    expect(screen.queryByRole('dialog')).toBeNull();

    // Space on strict radio opens dialog
    fireEvent.keyDown(strictRadio, { key: ' ' });
    expect(screen.getByRole('dialog')).toBeDefined();
  });
});
