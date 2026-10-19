import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';

import { DATA_RETENTION_MODE } from '@/constants/common';
import { useAppStore } from '@/store/store';
import { testT } from '@/test-helpers/i18n';

import { PreferencesContent } from '../preferences-content';

describe('PreferencesContent', () => {
  beforeEach(() => {
    useAppStore.setState({ dataRetentionMode: DATA_RETENTION_MODE.STRICT });
  });

  it('should render retention section with both tier cards', () => {
    render(<PreferencesContent />);

    expect(screen.getByText(testT('preferences.retention.title'))).toBeDefined();
    expect(screen.getByText(testT('preferences.retention.description'))).toBeDefined();

    // Cards
    expect(screen.getByText(testT('preferences.retention.strict.label'))).toBeDefined();
    expect(screen.getByText(testT('preferences.retention.strict.summary'))).toBeDefined();
    expect(screen.getByText(/Inputs and results clear/i)).toBeDefined();

    expect(screen.getByText(testT('preferences.retention.session.label'))).toBeDefined();
    expect(screen.getByText(testT('preferences.retention.session.summary'))).toBeDefined();
    expect(screen.getByText(/Switch between tools/i)).toBeDefined();
  });

  it('should toggle selection between strict and session when cards are clicked', () => {
    render(<PreferencesContent />);

    const strictRadio = screen.getByRole('radio', {
      name: new RegExp(testT('preferences.retention.strict.label')),
    });
    const sessionRadio = screen.getByRole('radio', {
      name: new RegExp(testT('preferences.retention.session.label')),
    });

    expect(strictRadio.getAttribute('aria-checked')).toBe('true');
    expect(sessionRadio.getAttribute('aria-checked')).toBe('false');

    fireEvent.click(sessionRadio);
    expect(sessionRadio.getAttribute('aria-checked')).toBe('true');
    expect(strictRadio.getAttribute('aria-checked')).toBe('false');
    expect(useAppStore.getState().dataRetentionMode).toBe(DATA_RETENTION_MODE.SESSION);

    fireEvent.click(strictRadio);
    expect(strictRadio.getAttribute('aria-checked')).toBe('true');
    expect(sessionRadio.getAttribute('aria-checked')).toBe('false');
    expect(useAppStore.getState().dataRetentionMode).toBe(DATA_RETENTION_MODE.STRICT);
  });

  it('should handle keyboard selection via Enter and Space keys, ignoring other keys', () => {
    render(<PreferencesContent />);

    const sessionRadio = screen.getByRole('radio', {
      name: new RegExp(testT('preferences.retention.session.label')),
    });
    const strictRadio = screen.getByRole('radio', {
      name: new RegExp(testT('preferences.retention.strict.label')),
    });

    // Ignored key does not change selection
    fireEvent.keyDown(sessionRadio, { key: 'ArrowDown' });
    expect(sessionRadio.getAttribute('aria-checked')).toBe('false');

    // Space on session radio
    fireEvent.keyDown(sessionRadio, { key: ' ' });
    expect(sessionRadio.getAttribute('aria-checked')).toBe('true');
    expect(useAppStore.getState().dataRetentionMode).toBe(DATA_RETENTION_MODE.SESSION);

    // Enter on strict radio
    fireEvent.keyDown(strictRadio, { key: 'Enter' });
    expect(strictRadio.getAttribute('aria-checked')).toBe('true');
    expect(useAppStore.getState().dataRetentionMode).toBe(DATA_RETENTION_MODE.STRICT);

    // Enter on session radio
    fireEvent.keyDown(sessionRadio, { key: 'Enter' });
    expect(sessionRadio.getAttribute('aria-checked')).toBe('true');

    // Space on strict radio
    fireEvent.keyDown(strictRadio, { key: ' ' });
    expect(strictRadio.getAttribute('aria-checked')).toBe('true');

    // Ignored key on strict radio
    fireEvent.keyDown(strictRadio, { key: 'Escape' });
    expect(strictRadio.getAttribute('aria-checked')).toBe('true');
  });
});
