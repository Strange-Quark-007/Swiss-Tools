import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { ROUTES } from '@/constants/routes';
import { matchI18nPlainText, testT } from '@/test-helpers/i18n';

import { Hero } from '../hero';

describe('Hero landing component', () => {
  it('should render hero headings, badges, and dashboard CTA', async () => {
    const jsx = await Hero();
    render(jsx);

    // Heading and paragraph
    expect(screen.getByText(testT('home.hero.heading'))).toBeDefined();
    expect(screen.getByText(testT('home.hero.paragraph'))).toBeDefined();

    // Badges
    expect(screen.getByText(testT('home.badge.privacy'))).toBeDefined();
    expect(screen.getByText(testT('home.badge.fast'))).toBeDefined();
    expect(screen.getByText(testT('home.badge.toolbox'))).toBeDefined();
    expect(screen.getByText(testT('home.badge.reliable'))).toBeDefined();

    // CTA Link
    const ctaLink = screen.getByRole('link', { name: testT('home.hero.mainCta') });
    expect(ctaLink).toBeDefined();
    expect(ctaLink.getAttribute('href')).toBe(ROUTES.DASHBOARD);

    // Tagline
    expect(screen.getByText(matchI18nPlainText('home.hero.tagline'))).toBeDefined();
  });
});
