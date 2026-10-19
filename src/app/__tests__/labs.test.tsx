import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { testT } from '@/test-helpers/i18n';

import LabsPage, { generateMetadata } from '../labs/page';

vi.mock('@/components/app-layout/app-footer', () => ({
  Footer: () => <div data-testid="footer-component" />,
}));

describe('Labs page (app/labs/page.tsx)', () => {
  it('should generate metadata for labs page', async () => {
    const metadata = await generateMetadata();

    expect(metadata.title).toBe(testT('labs.meta.title'));
    expect(metadata.description).toBe(testT('labs.meta.description'));
    expect(metadata.openGraph?.title).toBe(testT('labs.meta.title'));
    expect(metadata.twitter?.title).toBe(testT('labs.meta.title'));
  });

  it('should render Footer component', async () => {
    const jsx = await LabsPage();
    render(jsx);

    expect(screen.getByTestId('footer-component')).toBeDefined();
  });
});
