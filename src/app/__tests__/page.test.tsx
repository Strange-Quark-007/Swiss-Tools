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

    expect(metadata).toEqual({
      title: testT('home.meta.title'),
      description: testT('home.meta.description'),
    });
  });

  it('should render Landing and Footer components', () => {
    render(<Home />);

    expect(screen.getByTestId('landing-component')).toBeDefined();
    expect(screen.getByTestId('footer-component')).toBeDefined();
  });
});
