import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { testT } from '@/test-helpers/i18n';

import Home, { generateMetadata } from '../page';

vi.mock('@/landing/landing', () => ({
  Landing: () => <div data-testid="landing-component" />,
}));

vi.mock('@/components/app-layout/app-footer', () => ({
  Footer: () => <div data-testid="footer-component" />,
}));

describe('Home page (app/page.tsx)', () => {
  it('should generate metadata for home page', async () => {
    const metadata = await generateMetadata();

    expect(metadata.title).toBe(testT('home.meta.title'));
    expect(metadata.description).toBe(testT('home.meta.description'));
    expect(metadata.openGraph?.title).toBe(testT('home.meta.title'));
    expect(metadata.twitter?.title).toBe(testT('home.meta.title'));
  });

  it('should render Landing and Footer components', () => {
    render(<Home />);

    expect(screen.getByTestId('landing-component')).toBeDefined();
    expect(screen.getByTestId('footer-component')).toBeDefined();
  });
});
