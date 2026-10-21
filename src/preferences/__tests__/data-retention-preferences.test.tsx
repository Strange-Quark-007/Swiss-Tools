import { fireEvent, render, screen } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { toast } from 'sonner';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { DATA_RETENTION_MODE } from '@/constants/common';
import { usePreferencesStore } from '@/store/preferences-store';
import * as storeRegistryModule from '@/store/store-registry';
import { testT } from '@/test-helpers/i18n';

import { DataRetentionPreferences } from '../data-retention-preferences';

describe('DataRetentionPreferences', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    usePreferencesStore.setState({ dataRetentionMode: DATA_RETENTION_MODE.STRICT });
  });

  it('should render the retention group on the server without a pre-selected tier', () => {
    const html = renderToString(<DataRetentionPreferences />);

    expect(html).toContain(testT('preferences.retention.title'));
    expect(html).toContain('aria-labelledby="data-retention-heading"');
    expect(html).not.toContain('checked=""');
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

    expect(usePreferencesStore.getState().dataRetentionMode).toBe(DATA_RETENTION_MODE.SESSION);
    expect(toast.success).toHaveBeenCalledWith(testT('preferences.retention.toast.sessionActivated'));

    // Clicking session again while already in SESSION is a no-op
    vi.mocked(toast.success).mockClear();
    fireEvent.click(sessionRadio);
    expect(toast.success).not.toHaveBeenCalled();
  });

  it('should open confirmation dialog when clicking strict card from SESSION mode and handle cancel/confirm', () => {
    const resetSpy = vi.spyOn(storeRegistryModule, 'resetAllRegisteredStores').mockImplementation(() => {});
    usePreferencesStore.setState({ dataRetentionMode: DATA_RETENTION_MODE.SESSION });

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

    expect(usePreferencesStore.getState().dataRetentionMode).toBe(DATA_RETENTION_MODE.SESSION);
    expect(resetSpy).not.toHaveBeenCalled();

    // Re-open dialog and test Confirm button
    fireEvent.click(strictRadio);
    const confirmButton = screen.getByRole('button', { name: testT('preferences.retention.toast.confirmClear') });
    fireEvent.click(confirmButton);

    expect(usePreferencesStore.getState().dataRetentionMode).toBe(DATA_RETENTION_MODE.STRICT);
    expect(resetSpy).toHaveBeenCalledTimes(1);
    expect(toast.success).toHaveBeenCalledWith(testT('preferences.retention.toast.strictActivated'));

    // Clicking strict card while already in STRICT does not open dialog
    fireEvent.click(strictRadio);
    expect(screen.queryByRole('dialog')).toBeNull();

    resetSpy.mockRestore();
  });

  it('should expose both cards as native radios in one group', () => {
    render(<DataRetentionPreferences />);

    const radios = screen.getAllByRole('radio') as HTMLInputElement[];

    expect(radios).toHaveLength(2);
    expect(new Set(radios.map((radio) => radio.name))).toEqual(new Set(['data-retention-mode']));
    expect(radios.filter((radio) => radio.checked)).toHaveLength(1);
    expect(screen.getByRole('radiogroup', { name: testT('preferences.retention.title') })).toBeDefined();
  });
});
