import { render, screen } from '@testing-library/react';
import { redirect } from 'next/navigation';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ROUTES } from '@/constants/routes';
import { DATA_SIZES } from '@/features/unit-converter/data-size/utils';
import { testT } from '@/test-helpers/i18n';

import DataSizeConverterPage, { generateMetadata } from '../../unit-converter/data-size/page';

vi.mock('@/components/app-layout/app-breadcrumb', () => ({
  AppBreadcrumb: ({ items }: { items: { label: string }[] }) => (
    <nav data-testid="app-breadcrumb">
      {items.map((item) => (
        <span key={item.label}>{item.label}</span>
      ))}
    </nav>
  ),
}));

vi.mock('@/features/unit-converter/data-size/data-size-converter', () => ({
  DataSizeConverter: ({ from, to }: { from: string; to: string }) => (
    <div data-testid="data-size-converter" data-from={from} data-to={to} />
  ),
}));

describe('Data size converter page (app/unit-converter/data-size/page.tsx)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should generate metadata for data size converter page', async () => {
    const metadata = await generateMetadata();

    expect(metadata.title).toBe(testT('dataSizeConverter.meta.title'));
    expect(metadata.description).toBe(testT('dataSizeConverter.meta.description'));
    expect(metadata.openGraph?.title).toBe(testT('dataSizeConverter.meta.title'));
    expect(metadata.twitter?.title).toBe(testT('dataSizeConverter.meta.title'));
  });

  it('should redirect to canonical URL when search params are missing', async () => {
    const searchParams = Promise.resolve({});
    await DataSizeConverterPage({ searchParams });

    expect(redirect).toHaveBeenCalledWith(
      `${ROUTES.DATA_SIZE_CONVERTER}?from=${DATA_SIZES.gib.value}&to=${DATA_SIZES.mib.value}`
    );
  });

  it('should render with validated custom query params without redirecting', async () => {
    const searchParams = Promise.resolve({
      from: DATA_SIZES.kb.value,
      to: DATA_SIZES.mb.value,
    });
    const jsx = await DataSizeConverterPage({ searchParams });
    render(jsx);

    expect(redirect).not.toHaveBeenCalled();
    expect(screen.getByTestId('app-breadcrumb')).toBeDefined();
    expect(screen.getByText(testT('unitConverter.name'))).toBeDefined();
    expect(screen.getByText(testT('dataSizeConverter.name'))).toBeDefined();
    expect(screen.getByText(`${DATA_SIZES.kb.label} ↔ ${DATA_SIZES.mb.label}`)).toBeDefined();

    const feature = screen.getByTestId('data-size-converter');
    expect(feature.getAttribute('data-from')).toBe(DATA_SIZES.kb.value);
    expect(feature.getAttribute('data-to')).toBe(DATA_SIZES.mb.value);
  });
});
