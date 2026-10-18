import { render, screen } from '@testing-library/react';
import { redirect } from 'next/navigation';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ROUTES } from '@/constants/routes';
import { IDS } from '@/features/id-generator/utils';
import { testT } from '@/test-helpers/i18n';

import IdGeneratorPage, { generateMetadata } from '../id-generator/page';

vi.mock('@/components/app-layout/app-breadcrumb', () => ({
  AppBreadcrumb: ({ items }: { items: { label: string }[] }) => (
    <nav data-testid="app-breadcrumb">
      {items.map((item) => (
        <span key={item.label}>{item.label}</span>
      ))}
    </nav>
  ),
}));

vi.mock('@/features/id-generator/id-generator', () => ({
  IdGenerator: ({ type }: { type: string }) => <div data-testid="id-generator" data-type={type} />,
}));

describe('Id generator page (app/id-generator/page.tsx)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should generate metadata for id generator page', async () => {
    const metadata = await generateMetadata();

    expect(metadata.title).toBe(testT('idGenerator.meta.title'));
    expect(metadata.description).toBe(testT('idGenerator.meta.description'));
    expect(metadata.openGraph?.title).toBe(testT('idGenerator.meta.title'));
    expect(metadata.twitter?.title).toBe(testT('idGenerator.meta.title'));
  });

  it('should redirect to canonical URL when search params are missing', async () => {
    const searchParams = Promise.resolve({});
    await IdGeneratorPage({ searchParams });

    expect(redirect).toHaveBeenCalledWith(`${ROUTES.ID_GENERATOR}?type=${IDS.uuidv4.value}`);
  });

  it('should render with validated custom query params without redirecting', async () => {
    const searchParams = Promise.resolve({
      type: IDS.nanoid.value,
    });
    const jsx = await IdGeneratorPage({ searchParams });
    render(jsx);

    expect(redirect).not.toHaveBeenCalled();
    expect(screen.getByTestId('app-breadcrumb')).toBeDefined();
    expect(screen.getByText(testT('idGenerator.name'))).toBeDefined();
    expect(screen.getByText(IDS.nanoid.label)).toBeDefined();

    const feature = screen.getByTestId('id-generator');
    expect(feature.getAttribute('data-type')).toBe(IDS.nanoid.value);
  });
});
