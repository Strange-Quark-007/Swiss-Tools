import { render, screen } from '@testing-library/react';
import { redirect } from 'next/navigation';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ROUTES } from '@/constants/routes';
import { VOLUMES } from '@/features/unit-converter/volume/utils';
import { testT } from '@/test-helpers/i18n';

import VolumeConverterPage, { generateMetadata } from '../../unit-converter/volume/page';

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

vi.mock('@/features/unit-converter/volume/volume-converter', () => ({
  VolumeConverter: ({ from, to }: { from: string; to: string }) => (
    <div data-testid="volume-converter" data-from={from} data-to={to} />
  ),
}));

describe('Volume converter page (app/unit-converter/volume/page.tsx)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should generate metadata for volume converter page', async () => {
    const metadata = await generateMetadata();

    expect(metadata.title).toBe(testT('volumeConverter.meta.title'));
    expect(metadata.description).toBe(testT('volumeConverter.meta.description'));
    expect(metadata.openGraph?.title).toBe(testT('volumeConverter.meta.title'));
    expect(metadata.twitter?.title).toBe(testT('volumeConverter.meta.title'));
  });

  it('should redirect to canonical URL when search params are missing', async () => {
    const searchParams = Promise.resolve({});
    await VolumeConverterPage({ searchParams });

    expect(redirect).toHaveBeenCalledWith(`${ROUTES.VOLUME_CONVERTER}?from=${VOLUMES.l.value}&to=${VOLUMES.gal.value}`);
  });

  it('should render with validated custom query params without redirecting', async () => {
    const searchParams = Promise.resolve({
      from: VOLUMES.ml.value,
      to: VOLUMES.fl_oz.value,
    });
    const jsx = await VolumeConverterPage({ searchParams });
    render(jsx);

    expect(redirect).not.toHaveBeenCalled();
    expect(screen.getByTestId('app-breadcrumb')).toBeDefined();
    expect(screen.getByText(testT('unitConverter.name'))).toBeDefined();
    expect(screen.getByText(testT('volumeConverter.name'))).toBeDefined();
    expect(screen.getByText(`${VOLUMES.ml.label} ↔ ${VOLUMES.fl_oz.label}`)).toBeDefined();

    const feature = screen.getByTestId('volume-converter');
    expect(feature.getAttribute('data-from')).toBe(VOLUMES.ml.value);
    expect(feature.getAttribute('data-to')).toBe(VOLUMES.fl_oz.value);
  });
});
