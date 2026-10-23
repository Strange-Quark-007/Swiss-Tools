import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ROUTES } from '@/constants/routes';
import { matchI18nPlainText, testT } from '@/test-helpers/i18n';

import { PreferencesCallout } from '../preferences-callout';

describe('PreferencesCallout landing component', () => {
  it('should render title, description, and link to preferences', async () => {
    const jsx = await PreferencesCallout();
    render(jsx);

    // Title
    expect(screen.getByText(testT('home.preferencesCallout.title'))).toBeDefined();

    // Description
    expect(screen.getByText(matchI18nPlainText('home.preferencesCallout.description'))).toBeDefined();

    // CTA Link
    const ctaLink = screen.getByRole('link', { name: new RegExp(testT('home.preferencesCallout.cta')) });
    expect(ctaLink).toBeDefined();
    expect(ctaLink.getAttribute('href')).toBe(ROUTES.PREFERENCES);
  });
});
