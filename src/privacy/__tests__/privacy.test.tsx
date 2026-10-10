import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import { matchI18nPlainText, testT } from '@/test-helpers/i18n';

import { PRIVACY_SECTIONS, Privacy } from '../privacy';

vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

describe('Privacy page component', () => {
  it('should render privacy policy content with home link, headings, and all policy sections', async () => {
    const jsx = await Privacy();
    render(jsx);

    // Back to home link
    const homeLink = screen.getByRole('link', { name: testT('label.home') });
    expect(homeLink).toBeDefined();
    expect(homeLink.getAttribute('href')).toBe('/');

    // Main title and subtitle
    expect(screen.getByRole('heading', { level: 1, name: testT('privacy.title') })).toBeDefined();
    expect(screen.getByText(matchI18nPlainText('privacy.subtitle'))).toBeDefined();

    // All policy sections
    PRIVACY_SECTIONS.forEach(({ titleKey, textKey }) => {
      expect(screen.getByText(testT(titleKey))).toBeDefined();
      expect(screen.getByText(matchI18nPlainText(textKey))).toBeDefined();
    });

    // Last updated footer
    expect(screen.getByText(testT('privacy.lastUpdated'))).toBeDefined();
  });
});
