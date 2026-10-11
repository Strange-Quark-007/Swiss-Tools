import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { testT } from '@/test-helpers/i18n';

import PrivacyPage, { generateMetadata } from '../privacy/page';

vi.mock('@/privacy/privacy', () => ({
  Privacy: () => <div data-testid="privacy-component" />,
}));

vi.mock('@/components/app-layout/app-footer', () => ({
  Footer: () => <div data-testid="footer-component" />,
}));

describe('Privacy page (app/privacy/page.tsx)', () => {
  it('should generate metadata for privacy page', async () => {
    const metadata = await generateMetadata();

    expect(metadata).toEqual({
      title: testT('privacy.meta.title'),
      description: testT('privacy.meta.description'),
    });
  });

  it('should render Privacy and Footer components', async () => {
    const jsx = await PrivacyPage();
    render(jsx);

    expect(screen.getByTestId('privacy-component')).toBeDefined();
    expect(screen.getByTestId('footer-component')).toBeDefined();
  });
});
