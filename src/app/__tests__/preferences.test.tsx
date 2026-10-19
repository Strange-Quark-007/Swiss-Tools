import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { testT } from '@/test-helpers/i18n';

import PreferencesPage, { generateMetadata } from '../preferences/page';

vi.mock('@/components/app-layout/app-footer', () => ({
  Footer: () => <div data-testid="footer-component" />,
}));

describe('Preferences page (app/preferences/page.tsx)', () => {
  it('should generate metadata for preferences page', async () => {
    const metadata = await generateMetadata();

    expect(metadata.title).toBe(testT('preferences.meta.title'));
    expect(metadata.description).toBe(testT('preferences.meta.description'));
    expect(metadata.openGraph?.title).toBe(testT('preferences.meta.title'));
    expect(metadata.twitter?.title).toBe(testT('preferences.meta.title'));
  });

  it('should render Footer component', async () => {
    const jsx = await PreferencesPage();
    render(jsx);

    expect(screen.getByTestId('footer-component')).toBeDefined();
  });
});
