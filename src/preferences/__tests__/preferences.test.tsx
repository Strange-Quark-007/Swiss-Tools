import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { testT } from '@/test-helpers/i18n';

import { Preferences } from '../preferences';

describe('Preferences page component', () => {
  it('should render preferences content with back button, heading, and PreferencesContent', async () => {
    const jsx = await Preferences();
    render(jsx);

    const backButton = screen.getByRole('button', { name: testT('label.back') });
    expect(backButton).toBeDefined();

    expect(screen.getByText(testT('preferences.title'))).toBeDefined();
    expect(screen.getByText(testT('preferences.subtitle'))).toBeDefined();
    expect(screen.getByText(testT('preferences.retention.title'))).toBeDefined();
  });
});
