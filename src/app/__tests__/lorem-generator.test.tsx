import { render, screen } from '@testing-library/react';
import { redirect } from 'next/navigation';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ROUTES } from '@/constants/routes';
import { LOREM } from '@/features/lorem-generator/utils';
import { testT } from '@/test-helpers/i18n';

import LoremGeneratorPage, { generateMetadata } from '../lorem-generator/page';

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}));

vi.mock('@/components/app-layout/app-breadcrumb', () => ({
  AppBreadcrumb: ({ items }: { items: { label: string }[] }) => (
    <nav data-testid="app-breadcrumb">
      {items.map((item) => (
        <span key={item.label}>{item.label}</span>
      ))}
    </nav>
  ),
}));

vi.mock('@/features/lorem-generator/lorem-generator', () => ({
  LoremGenerator: ({ type }: { type: string }) => <div data-testid="lorem-generator" data-type={type} />,
}));

describe('Lorem generator page (app/lorem-generator/page.tsx)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should generate metadata for lorem generator page', async () => {
    const metadata = await generateMetadata();

    expect(metadata.title).toBe(testT('loremGenerator.meta.title'));
    expect(metadata.description).toBe(testT('loremGenerator.meta.description'));
    expect(metadata.openGraph?.title).toBe(testT('loremGenerator.meta.title'));
    expect(metadata.twitter?.title).toBe(testT('loremGenerator.meta.title'));
  });

  it('should redirect to canonical URL when search params are missing', async () => {
    const searchParams = Promise.resolve({});
    await LoremGeneratorPage({ searchParams });

    expect(redirect).toHaveBeenCalledWith(`${ROUTES.LOREM_GENERATOR}?type=${LOREM.word.value}`);
  });

  it('should render with validated custom query params without redirecting', async () => {
    const searchParams = Promise.resolve({
      type: LOREM.paragraph.value,
    });
    const jsx = await LoremGeneratorPage({ searchParams });
    render(jsx);

    expect(redirect).not.toHaveBeenCalled();
    expect(screen.getByTestId('app-breadcrumb')).toBeDefined();
    expect(screen.getByText(testT('loremGenerator.name'))).toBeDefined();
    expect(screen.getByText(LOREM.paragraph.label)).toBeDefined();

    const feature = screen.getByTestId('lorem-generator');
    expect(feature.getAttribute('data-type')).toBe(LOREM.paragraph.value);
  });
});
